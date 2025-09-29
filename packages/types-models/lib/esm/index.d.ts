import { CUD, Indexable, UserIdentity } from "@tellescope/types-utilities";
export interface EnduserPortalVisibility {
    hideFromEnduserPortal?: boolean;
}
export interface SearchOptions {
    query: string;
}
export type StripeCountryCode = "US" | "GB";
export type StripeCheckoutInfo = {
    customerId: string;
    clientSecret: string;
    publishableKey: string;
    stripeAccount: string;
    businessName: string;
};
export type SortBy = 'updatedAt' | 'dueDateInMS' | 'closedAt' | 'timestamp';
export declare const SORT_BY_OPTIONS: SortBy[];
export type AccessType = "All" | "Default" | "Assigned" | null;
export type AccessAction = "create" | "read" | "update" | "delete";
export type AccessResources = ModelName | 'apiKeys';
export type AccessForResource = {
    [K in AccessAction]: AccessType;
} & {
    showInSidebar?: boolean;
};
export type AccessPermissions = {
    [K in AccessResources]: AccessForResource;
};
export type IndexUpdate = {
    id: string;
    index: number;
};
export type Filters = {
    _exists: boolean;
    _gt: number;
    _gte: number;
    _lt: number;
    _lte: number;
    _all: any[];
    _in: any[];
    _nin: any[];
    _ne: any;
};
export type ExistsFilter = {
    _exists: boolean;
};
export type FilterType = Filters;
export type FilterKey = keyof Filters;
export declare const FilterKeys: readonly ["_exists", "_gt", "_gte", "_lt", "_lte", "_all", "_ne", "_nin"];
export type ReadFilter<T> = {
    [K in keyof T]?: T[K] | Partial<FilterType>;
};
export type FlowchartUI = {
    x: number;
    y: number;
};
export type BasicFilter<T extends string> = {
    [K in T]: (string | number | null | {
        $exists: boolean;
    } | {
        $gt: number;
    } | {
        $lt: number;
    } | {
        $contains: string | number;
    } | {
        $doesNotContain: string | number;
    });
};
export type CompoundFilter<T extends string> = {
    condition?: BasicFilter<T>;
    $or?: (CompoundFilter<T>)[];
    $and?: (CompoundFilter<T>)[];
};
/** @deprecated */
export type OrganizationLimit = 'endusersLimit' | 'smsLimit' | 'emailsLimit' | 'tasksLimit' | 'formsLimit' | 'orgUsersLimit' | 'automationsLimit' | 'automationStepsLimit' | 'journeysLimit' | 'journeyStatesLimit' | 'templatesLimit' | 'apiKeysLimit';
export type PortalSettings = {
    authentication?: {
        landingTitle?: string;
        landingLogo?: string;
        landingGraphic?: string;
        loginTitle?: string;
        loginDescription?: string;
        loginGraphic?: string;
        loginBottomHTML?: string;
        registerTitle?: string;
        registerDescription?: string;
        registerGraphic?: string;
        hideRegister?: boolean;
        dontPromptSetPassword?: boolean;
        requireOTP?: boolean;
    };
    communication?: {
        allowEnduserInitiatedChat?: boolean;
        allowChatCareTeamSelection?: boolean;
        enduserInitiatedChatDefaultSubject?: string;
        sendEmailNotificationsToEnduser?: boolean;
        sendSMSNotificationsToEnduser?: boolean;
        showFloatingChatIcon?: boolean;
    };
    orders?: {
        customOrderTrackingURL?: string;
    };
    documents?: {
        hideMissingAnswers?: boolean;
        outstandingFormsTitle?: string;
        availableFormsTitle?: string;
    };
};
export type WithLinkOpenTrackingIds = {
    linkOpenTrackingIds: string[];
};
type BuildCustomEnduserField<T, I> = {
    type: T;
    info: I;
    field: string;
    required?: boolean;
    hiddenFromProfile?: boolean;
    requireConfirmation?: boolean;
    tags?: string[];
};
export type CustomEnduserFields = {
    "Select": BuildCustomEnduserField<'Select', {
        options: string[];
        other?: boolean;
    }>;
    "Multiple Select": BuildCustomEnduserField<'Multiple Select', {
        options: string[];
    }>;
    "Text": BuildCustomEnduserField<'Text', {}>;
    "Number": BuildCustomEnduserField<'Number', {}>;
    "Multiple Text": BuildCustomEnduserField<'Multiple Text', {}>;
    "Date": BuildCustomEnduserField<'Date', {}>;
    "File": BuildCustomEnduserField<'File', {}>;
    'Auto Detect': BuildCustomEnduserField<'Auto Detect', {}>;
    "Table": BuildCustomEnduserField<"Table", {
        columns: TableInputChoice[];
    }>;
    'Checkbox': BuildCustomEnduserField<'Checkbox', {}>;
    "Database Select": BuildCustomEnduserField<'Database Select', {
        databaseId: string;
        columns: string[];
    }>;
};
export type CustomEnduserFieldType = keyof CustomEnduserFields;
export type CustomEnduserField = CustomEnduserFields[CustomEnduserFieldType];
export type EnduserBuiltInField = {
    field: string;
    label: string;
    required?: boolean;
    requireConfirmation?: boolean;
    hidden?: boolean;
};
export type CustomDashboardViewBlockType = "Inbox" | "Tickets" | "Upcoming Events" | "Team Chats" | "To-Dos" | "Database";
export type CustomDashboardViewBlock = {
    type: CustomDashboardViewBlockType;
    info?: {
        databaseId?: string;
    };
};
export type CustomDashboardView = {
    blocks: CustomDashboardViewBlock[];
};
export type OrganizationSettings = {
    dashboard?: {
        view?: CustomDashboardView;
    };
    endusers?: {
        disableMultipleChatRooms?: boolean;
        disableCalendarEventAutoAssignment?: boolean;
        builtinFields?: EnduserBuiltInField[];
        customFields?: CustomEnduserField[];
        disableAdhocFields?: boolean;
        autoReplyEnabled?: boolean;
        disableAutoreplyForCustomEntities?: boolean;
        tags?: string[];
        showFreeNote?: boolean;
        autoSaveFreeNote?: boolean;
        canDeleteFreeNote?: boolean;
        recordCalls?: boolean;
        recordCallAudioPlayback?: string;
        dontRecordCallsToPhone?: string[];
        transcribeCalls?: boolean;
        transcribeCallInboundPlayback?: string;
        showDeleteCallRecordingOnTimeline?: boolean;
        defaultPhoneNumber?: string;
        sendSMSOnZoomStart?: boolean;
        enableGroupMMS?: boolean;
        enableAccessTags?: boolean;
        flaggedFileText?: string;
        showBulkFormInput?: boolean;
        autofillSignature?: boolean;
        showFullVitalsTab?: boolean;
        canMoveCalls?: boolean;
        canMoveSMS?: boolean;
        inboxRepliesMarkRead?: boolean;
        alwaysShowInsurance?: boolean;
        defaultToOutboundConferenceCall?: boolean;
        sharedInboxReadStatus?: boolean;
        dontMarkReadForAssigned?: boolean;
        matchEmailAndNames?: boolean;
        hideNotesFromComposeForm?: boolean;
        showSalesforceId?: boolean;
        loopQueueCallSound?: boolean;
        showOrdersInSidebar?: boolean;
        showDiagnoses?: boolean;
        showDeviceOrders?: boolean;
        requireObservationInvalidationReason?: boolean;
        defaultHideFilesFromPortal?: boolean;
        hideUnorderedFullscriptMeds?: boolean;
        detailField?: string;
        showDownloadCallRecordings?: boolean;
        launchDosespotWebhookURL?: string;
        reverseTimeline?: boolean;
        delayedReadingIntervalInMS?: number;
        createChatRoomWithBlankUserIds?: boolean;
    };
    tickets?: {
        defaultJourneyDueDateOffsetInMS?: number | '';
        disableSnooze?: boolean;
        showCommunications?: boolean;
        showJourneys?: boolean;
        requireDueDate?: boolean;
        allowArchival?: boolean;
        returnToTicketsList?: boolean;
        dontAddToCareTeamOnTicketAssignment?: boolean;
    };
    calendar?: {
        dayStart?: {
            hour: number;
            minute: number;
        };
        dayEnd?: {
            hour: number;
            minute: number;
        };
        bookingStartOffset?: {
            month?: number;
            day?: number;
            hour?: number;
        };
        bookingEndOffset?: {
            month?: number;
            day?: number;
            hour?: number;
        };
        templateRequired?: boolean;
        locationRequired?: boolean;
        cancelReasons?: string[];
        copyRemindersByDefault?: boolean;
        showMakeRecurringOnProfile?: boolean;
    };
    users?: {
        sessionDurationInHours?: number;
    };
    integrations?: {
        vitalLabOrderPhysicianOptional?: boolean;
        athenaAppointmentSyncJITSeconds?: number;
    };
    interface?: {
        dontPersistSearches?: boolean;
        showEndusersV2?: boolean;
        showInboxV2?: boolean;
        showDialerInTopbar?: boolean;
    };
};
export type OrganizationLimits = {
    [K in ModelName]?: number;
};
export type BasicWebhook = {
    label: string;
    url: string;
    method?: 'Link' | 'POST';
};
export type SyncDirection = "Bidirectional" | "From Tellescope" | "To Tellescope";
export type AthenaFieldSync = {
    field: string;
    externalField: {
        id: string;
        options: {
            id: string;
            value: string;
        }[];
    };
    direction: SyncDirection;
    dateFormat?: string;
};
export type AthenaSubscription = {
    type: 'patients' | 'appointments' | 'orders' | 'chart/healthhistory/problems' | 'obepisode';
    frequencyInMinutes: number;
    lastSyncedAt: Date;
};
export type StripeKeyDetail = {
    key: string;
    title: string;
};
export type MetriportIntegrationDetail = {
    title: string;
    environment?: string;
};
export type OutOfOfficeBlock = {
    from: Date;
    to: Date;
    autoreplyText: string;
};
export interface Organization_readonly extends ClientRecord {
    subscriptionExpiresAt: Date;
    subscriptionPeriod: number;
    lastSync?: number;
    limits?: OrganizationLimits;
    twilioNumber?: string;
    twilioNumbers?: string[];
    stripeAccountId?: string;
    stripeIsConnected?: boolean;
    hasCustomStripe?: boolean;
    photon?: {
        organizationId: string;
        clientId: string;
        environment: string;
    };
    fromEmails?: string[];
    twilioSID?: string;
    twilioCustomerId?: string;
    customPortalScriptTags?: string[];
}
export interface Organization_required {
}
export interface Organization_updatesDisabled {
    name: string;
    subdomain: string;
}
export interface Organization extends Organization_readonly, Organization_required, Organization_updatesDisabled {
    inboxThreadsBuiltFrom?: Date | '';
    inboxThreadsBuiltTo?: Date | '';
    bedrockAIAllowed?: boolean;
    subdomains?: string[];
    owner?: string;
    timezone?: Timezone;
    roles?: string[];
    skills?: string[];
    logoVersion?: number;
    faviconVersion?: number;
    themeColor?: string;
    themeColorSecondary?: string;
    customPortalURL?: string;
    customPortalURLs?: string[];
    customProviderURL?: string;
    customTermsOfService?: string;
    customPrivacyPolicy?: string;
    customPolicies?: {
        url: string;
        title: string;
    }[];
    customPoliciesVersion?: string;
    requireCustomTermsOnMagicLink?: boolean;
    settings?: OrganizationSettings;
    portalSettings?: PortalSettings;
    enduserDisplayName?: string;
    parentOrganizationId?: string;
    hasCustomBusinessSubdomain?: boolean;
    callForwardingNumber?: string;
    customAutoreplyMessage?: string;
    externalCalendarEventPlaceholderTitle?: string;
    externalCalendarEventPlaceholderDescription?: string;
    customZoomEmailTemplate?: string;
    customZoomEmailSubject?: string;
    customZoomSMSTemplate?: string;
    customVoicemailText?: string;
    hasConnectedOpenAI?: boolean;
    hasConnectedHealthie?: boolean;
    hasConnectedElation?: boolean;
    hasConnectedIterable?: boolean;
    hasConnectedZendesk?: boolean;
    hasConnectedZus?: boolean;
    hasConnectedCanvas?: boolean;
    canvasURL?: string;
    hasConnectedCandid?: boolean;
    hasConnectedGoGoMeds?: boolean;
    hasConnectedPagerDuty?: boolean;
    hasConnectedSmartMeter?: boolean;
    hasConnectedAthena?: boolean;
    hasConnectedActiveCampaign?: boolean;
    hasConnectedDocsumo?: boolean;
    hasConnectedEmotii?: boolean;
    hasConnectedDevelopHealth?: boolean;
    hasConnectedCustomerIO?: boolean;
    hasConnectedSuperDial?: boolean;
    hasConnectedBeluga?: boolean;
    hasConnectedMetriport?: boolean;
    hasConnectedPaubox?: boolean;
    hasConfiguredZoom?: boolean;
    hasTicketQueues?: boolean;
    vitalTeamId?: string;
    altVitalTeamIds?: {
        teamId: string;
        label: string;
    }[];
    zendeskSettings?: {
        priorityGroups?: string[];
        resolutionFieldId?: string;
        resolutionFieldOptions?: string[];
    };
    replyToAllEmails?: string;
    replyToEnduserTransactionalEmails?: string;
    forwardAllIncomingEmailsTo?: string;
    numCustomTypes?: number;
    ticketThreadsEnabled?: boolean;
    _groupChatsEnabled?: boolean;
    allowCreateSuborganizations?: boolean;
    allowCallerId?: boolean;
    billingOrganizationName?: string;
    billingOrganizationNPI?: string;
    billingOrganizationTaxId?: string;
    billingOrganizationAddress?: Address;
    videoCallBackgroundImage?: string;
    sendToVoicemailOOO?: boolean;
    forwardingOOONumber?: string;
    onCallUserIds?: string[];
    outOfOfficeVoicemail?: PhonePlayback;
    enduserProfileWebhooks?: BasicWebhook[];
    showCommunity?: boolean;
    phoneLabels?: {
        number: string;
        label: string;
    }[];
    mfaxAccountId?: string;
    athenaFieldsSync?: AthenaFieldSync[];
    athenaSubscriptions?: AthenaSubscription[];
    athenaDepartments?: {
        id: string;
        timezone: Timezone;
    }[];
    fieldsToAdminNote?: string[];
    canvasMessageSync?: {
        id: string;
        questionId: string;
    };
    canvasSyncEmailConsent?: boolean;
    canvasSyncPhoneConsent?: boolean;
    dosespotClinics?: {
        id: string;
        name: string;
    }[];
    answersSyncToPortal?: {
        id: string;
        questions: string[];
    }[];
    externalFormIdsToSync?: string[];
    enforceMFA?: boolean;
    analyticsIframes?: {
        title: string;
        iframeURL: string;
    }[];
    stripePublicKeys?: string[];
    stripeKeyDetails?: StripeKeyDetail[];
    metriportIntegrationDetails?: MetriportIntegrationDetail[];
    additionalIterableKeys?: string[];
    defaultDoseSpotPharmacies?: {
        id: string;
        name: string;
    }[];
    groups?: string[];
    observationInvalidationReasons?: string[];
    chargebeeEnvironments?: string[];
    customNotificationTypes?: string[];
    hasConnectedMedplum?: boolean;
    customPortalLoginEmailSubject?: string;
    customPortalLoginEmailHTML?: string;
    customerIOFields?: string[];
    customerIOIdField?: string;
    createEnduserForms?: string[];
    creditCount?: number;
    creditTrialStartedAt?: Date;
    hasIntegrations?: string[];
    outOfOfficeHours?: OutOfOfficeBlock[];
    skipActivePatientBilling?: boolean;
}
export type OrganizationTheme = {
    name: string;
    businessId: string;
    organizationIds?: string[];
    subdomain: string;
    themeColor?: string;
    themeColorSecondary?: string;
    logoURL?: string;
    customPortalURL?: string;
    faviconURL?: string;
    portalSettings?: PortalSettings & {
        html: {
            scripts?: string[];
        };
    };
    customTermsOfService?: string;
    customPrivacyPolicy?: string;
    customPolicies?: Organization['customPolicies'];
    customPoliciesVersion?: string;
    requireCustomTermsOnMagicLink?: boolean;
    hasConnectedVital?: boolean;
    brandId?: string;
};
export interface RecordInfo {
    businessId: string;
    updatedAt: Date;
    creator: string;
    organizationIds?: string[];
    sharedWithOrganizations?: string[][];
}
export interface ClientRecord extends RecordInfo {
    id: string;
}
export interface WithAllowedPaths {
    allowedPaths?: string[];
}
export interface Session {
    type: "user" | "enduser";
    businessId: string;
    iat: number;
    exp: number;
    allowedPaths?: string[];
    requiresMFA?: boolean;
}
export type SessionType = "user" | "enduser";
export interface EnduserSession extends Session, Enduser {
    type: "enduser";
    passwordIsUnset?: boolean;
    denySocket?: boolean;
    fromPublicSession?: boolean;
    requiresOTP?: boolean;
}
export interface UserSession extends Session, OrganizationLimits {
    type: "user";
    source?: "api_key";
    id: string;
    email: string;
    businessId: string;
    organizationIds: string[];
    organization: string;
    phone?: string;
    username?: string;
    orgEmail?: string;
    fname?: string;
    roles?: string[];
    lname?: string;
    displayName?: string;
    avatar?: string;
    twilioNumber?: string;
    enduserDisplayName?: string;
    subscriptionExpiresAt: Date;
    subscriptionPeriod: number;
    access: AccessPermissions;
    orgName: string;
    orgTwilioNumber: string;
    defaultTwilioNumber?: string;
    ticketThreadsEnabled?: boolean;
    fromEmail?: string;
    verifiedEmail: boolean;
    wasAutomated: boolean;
    limits?: OrganizationLimits;
    uiRestrictions?: UserUIRestrictions;
    dashboardView?: CustomDashboardView;
    hasTicketQueues?: boolean;
    eat?: boolean;
    lockedOutUntil?: number;
    duration?: number;
    doseSpotUserId?: string;
    availablePhoneNumbers: string[];
    availableFromEmails: string[];
    isa?: boolean;
}
export type StateCredentialInfo = {
    state: string;
    licenseId?: string;
    expiresAt?: Date;
};
export type MonthlyRestriction = {
    occurrences: (1 | 2 | 3 | 4 | 5)[];
};
export type WeeklyAvailability = {
    dayOfWeekStartingSundayIndexedByZero: number;
    startTimeInMinutes: number;
    endTimeInMinutes: number;
    intervalInMinutes?: number;
    bufferStartMinutes?: number;
    active?: DateRange;
    locationId?: string;
    locationIds?: string[];
    validTemplateIds?: string[];
    priority?: number;
    monthlyRestriction?: MonthlyRestriction;
};
export type NotificationPreference = {
    email?: boolean;
};
export type AccountType = string;
export type UserCallRoutingBehavior = ('' | 'Assigned' | 'Unassigned' | 'All');
export type MFASettings = {
    email?: boolean;
};
export type LabeledField = {
    field: string;
    value: string;
};
export interface User_readonly extends ClientRecord {
    organization?: string;
    username?: string;
    orgEmail?: string;
    pauboxEmail?: string;
    lastActive?: Date;
    lastLogout?: Date;
    isa?: boolean;
    passwordLastChangedAt?: Date;
}
export interface User_required {
    email: string;
}
export interface User_updatesDisabled {
    verifiedEmail: boolean;
}
export interface User extends User_required, User_readonly, User_updatesDisabled {
    billingTags?: LabeledField[];
    defaultLocationId?: string;
    termsSigned?: Date;
    termsVersion?: string;
    externalId?: string;
    phone?: string;
    fname?: string;
    lname?: string;
    displayName?: string;
    internalDisplayName?: string;
    suffixes?: string[];
    accountType?: AccountType;
    hashedInviteCode?: string;
    roles?: string[];
    avatar?: string;
    fields?: CustomFields;
    unredactedFields?: CustomFields;
    acknowledgedIntegrations?: Date;
    notificationPreferences?: {
        [index: string]: NotificationPreference;
    };
    notificationEmailsDisabled?: boolean;
    disableIncomingPhoneCalls?: boolean;
    disableTicketAutoAssignment?: boolean;
    ticketAssignmentPriority?: number;
    callRouting?: UserCallRoutingBehavior;
    credentialedStates?: StateCredentialInfo[];
    timezone?: Timezone;
    weeklyAvailabilities?: WeeklyAvailability[];
    autoReplyEnabled?: boolean;
    twilioNumber?: string;
    availableFromNumbers?: string[];
    availableFromEmails?: string[];
    hashedPass?: string;
    pushNotificationIosTokens?: string[];
    pushNotificationFirebaseTokens?: string[];
    pushNotificationDestinations?: string[];
    drChronoId?: string;
    canvasId?: string;
    medplumId?: string;
    athenaId?: string;
    zoomId?: string;
    zendeskId?: number;
    tags?: string[];
    emailSignature?: string;
    specialties?: string[];
    bio?: string;
    fromEmail?: string;
    TIN?: string;
    NPI?: string;
    DEA?: string;
    voicemailPlayback?: PhonePlayback | {};
    mfa?: MFASettings;
    skills?: string[];
    lockedOutUntil?: number;
    elationUserId?: number;
    iOSBadgeCount?: number;
    doseSpotUserId?: string;
    url?: string;
    requiresMFAConfiguration?: boolean;
    templateFields?: LabeledField[];
    dashboardView?: CustomDashboardView;
    hideFromCalendarView?: boolean;
    requireSSO?: string[];
}
export type Preference = 'email' | 'sms' | 'call' | 'chat';
export type CustomField = string | number | object | {
    value: string | object;
    title?: string;
    description?: string;
};
export type CustomFields = Indexable<boolean | null | string | CustomField>;
export type GenericQuantityWithUnit = {
    value: number | string;
    unit: string;
};
export interface EnduserEngagementTimestamps {
    recentFormSubmittedAt?: Date;
    recentEventBookedAt?: Date;
    recentOutboundCallAt?: Date;
    recentInboundCallAt?: Date;
    recentOutboundChatAt?: Date;
    recentInboundChatAt?: Date;
    recentOutboundSMSAt?: Date;
    recentInboundSMSAt?: Date;
    recentOutboundEmailAt?: Date;
    recentInboundEmailAt?: Date;
    recentOutboundGroupMMSAt?: Date;
    recentInboundGroupMMSAt?: Date;
    recentActivityAt?: Date;
}
export type StripeSubscriptionStatus = 'active' | 'trialing' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'canceled' | 'unpaid';
export type StripeSubscription = {
    status: StripeSubscriptionStatus;
};
export type ScheduledJourney = {
    journeyId: string;
    addAt: Date;
};
export type EnduserRelationship = {
    type: ('Parent' | 'Child' | 'Spouse' | 'Partner' | 'Sibling' | 'Grandparent' | 'Grandchild' | 'Caregiver' | 'Caretaker' | 'Care Recipient' | 'Power of Attorney' | 'Power of Attorney For' | "Emergency Contact" | "Emergency Contact For" | "Care Partner" | 'Relates To' | "Referring Provider" | "Referred Patient");
    id: string;
};
export type Language = {
    displayName: string;
    iso6391: string;
};
export type InsuranceRelationship = ("Spouse" | "Grandfather or Grandmother" | "Grandson or Grandaughter" | "Nephew or Niece" | "Foster Child" | "Ward of the Court" | "Stepson or Stepdaughter" | "Self" | "Child" | "Employee" | "Unknown" | "Handicapped/Dependent" | "Sponsored Dependent" | "Dependent of Minor Dependent" | "Significant Other" | "Mother" | "Father" | "Emancipated Minor" | "Organ Donor" | "Cadaver Donor" | "Injured Plaintiff" | "Child Where Insured Has No Financial Responsibility" | "Life Partner" | "Other Relationship");
export type EnduserInsurance = {
    memberId?: string;
    payerId?: string;
    payerName?: string;
    cardFront?: string;
    cardBack?: string;
    eligibility?: string;
    status?: string;
    eligibilityRanAt?: Date;
    coverageId?: string;
    requestId?: string;
    relationship?: InsuranceRelationship;
    relationshipDetails?: {
        fname?: string;
        lname?: string;
        gender?: TellescopeGender;
        dateOfBirth?: string;
    };
    payerType?: string;
    groupNumber?: string;
    planName?: string;
    startDate?: string;
};
export type EnduserDevice = {
    title: string;
    id: string;
    gatewayId?: string;
    disabled?: boolean;
    archivedAt?: Date | '';
};
export type EnduserDiagnosis = {
    id?: string;
    createdAt?: Date;
    externalId?: string;
    active?: boolean;
    start?: string;
    end?: string;
    code?: string;
    display?: string;
    source?: string;
    references?: RelatedRecord[];
};
export type RecentViewer = {
    id: string;
    at: Date;
};
export type TellescopeGender = "Male" | "Female" | "Other" | "Unknown";
export interface Enduser_readonly extends UserActivityInfo, ClientRecord, EnduserEngagementTimestamps {
    lastCommunication?: Date;
    recentMessagePreview?: string;
    hashedPassword: string;
    stripeCustomerId?: string;
    customStripeCustomerId?: string;
    stripeSubscription?: StripeSubscription;
    _dateOfBirth?: Date;
    _age?: number;
    mergedIds?: string[];
    _updateKey?: string;
    passwordLastChangedAt?: Date;
}
export interface Enduser_required {
}
export interface Enduser_updatesDisabled {
    references?: RelatedRecord[];
}
export interface Enduser extends Enduser_readonly, Enduser_required, Enduser_updatesDisabled {
    recentViewers?: RecentViewer[];
    healthie_dietitian_id?: string;
    unsubscribePhone?: boolean;
    externalId?: string;
    humanReadableId?: string;
    displayName?: string;
    lockId?: string;
    email?: string;
    alternateEmails?: string[];
    emailConsent?: boolean;
    phone?: string;
    alternatePhones?: string[];
    landline?: string;
    phoneConsent?: boolean;
    fname?: string;
    mname?: string;
    lname?: string;
    suffix?: string;
    journeys?: Indexable<string>;
    scheduledJourneys?: ScheduledJourney[];
    tags?: string[];
    unredactedTags?: string[];
    fields?: CustomFields;
    unredactedFields?: CustomFields;
    preference?: Preference;
    assignedTo?: string[];
    primaryAssignee?: string;
    avatar?: string;
    unread?: boolean;
    termsSigned?: Date;
    termsVersion?: string;
    timezone?: Timezone;
    dateOfBirth?: string;
    gender?: TellescopeGender;
    genderIdentity?: string;
    pronouns?: string;
    height?: GenericQuantityWithUnit;
    weight?: GenericQuantityWithUnit;
    source?: string;
    usingV1SMS?: boolean;
    addressLineOne?: string;
    addressLineTwo?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    zipPlusFour?: string;
    lastAutoreplySentAt?: Date;
    unsubscribedFromPortalChatNotifications?: boolean;
    triggeredEvents?: Record<string, number>;
    relationships?: EnduserRelationship[];
    customTypeId?: string;
    language?: Language;
    triggerIds?: string[];
    markedReadAt?: Date | '';
    markedUnreadAt?: Date | '';
    note?: string;
    noteIsFlagged?: boolean;
    mfa?: MFASettings;
    lastZendeskSyncAt?: Date;
    accessTags?: string[];
    unsubscribedFromMarketing?: boolean;
    unsubscribedFromPhones?: string[];
    insurance?: EnduserInsurance;
    insuranceSecondary?: EnduserInsurance;
    bookingNotes?: {
        bookingPageId: string;
        note: string;
    }[];
    devices?: EnduserDevice[];
    salesforceId?: string;
    athenaPracticeId?: string;
    athenaDepartmentId?: string;
    vitalTriggersDisabled?: boolean;
    defaultFromPhone?: string;
    defaultFromEmail?: string;
    useDefaultFromEmailInAutomations?: boolean;
    useDefaultFromPhoneInAutomations?: boolean;
    stripeCustomerId?: string;
    stripeKey?: string;
    lastDoseSpotSyncAt?: Date;
    diagnoses?: EnduserDiagnosis[];
    lockedFromPortal?: boolean;
    chargebeeEnvironment?: string;
    chargebeeId?: string;
    healthieSyncError?: string;
    lastSuperdialEligibilityCheckAt?: Date;
    superdialEligibilityResponse?: string;
}
export interface EnduserCustomType_readonly extends ClientRecord {
}
export interface EnduserCustomType_required {
    title: string;
}
export interface EnduserCustomType_updatesDisabled {
}
export interface EnduserCustomType extends EnduserCustomType_readonly, EnduserCustomType_required, EnduserCustomType_updatesDisabled {
    builtinFields?: EnduserBuiltInField[];
    customFields?: CustomEnduserField[];
}
export interface EnduserStatusUpdate_readonly extends ClientRecord {
}
export interface EnduserStatusUpdate_required {
    enduserId: string;
    journeyId: string;
    status: string;
}
export interface EnduserStatusUpdate_updatesDisabled {
}
export interface EnduserStatusUpdate extends EnduserStatusUpdate_readonly, EnduserStatusUpdate_required, EnduserStatusUpdate_updatesDisabled {
}
export interface EnduserMedication_readonly extends ClientRecord {
}
export interface EnduserMedication_required {
    enduserId: string;
    title: string;
}
export interface EnduserMedication_updatesDisabled {
}
export interface EnduserMedication extends EnduserMedication_readonly, EnduserMedication_required, EnduserMedication_updatesDisabled {
    source?: string;
    externalId?: string;
    references?: RelatedRecord[];
    calendarEventId?: string;
    prescribedBy?: string;
    prescribedAt?: Date | '';
    prescriberName?: string;
    startedTakingAt?: Date | '';
    stoppedTakingAt?: Date | '';
    rxNormCode?: string;
    fdbCode?: string;
    dispensing?: {
        quantity: number;
        unit?: string;
    };
    dosage?: {
        value: string;
        unit: string;
        description?: string;
        quantity?: string;
        frequency?: string;
        frequencyDescriptor?: string;
    };
    notes?: string;
    pharmacyName?: string;
    pharmacyId?: string;
    orderStatus?: string;
    reasonForTaking?: string;
    directions?: string;
}
export interface APIKey_readonly extends ClientRecord {
    hashedKey: string;
}
export interface APIKey_required {
}
export interface APIKey_updatesDisabled {
}
export interface APIKey extends APIKey_readonly, APIKey_required, APIKey_updatesDisabled {
}
export interface EngagementEvent_readonly extends ClientRecord {
}
export interface EngagementEvent_required {
    enduserId: string;
    type: string;
    significance: number;
}
export interface EngagementEvent_updatesDisabled {
    enduserId: string;
}
export interface EngagementEvent extends EngagementEvent_readonly, EngagementEvent_required, EngagementEvent_updatesDisabled {
    timestamp: Date;
    fields?: CustomFields;
}
export type TicketsReports = {
    'default': {
        type: 'default';
        data: {
            open: {
                title: string;
                count: number;
                unassignedCount: number;
                overdueCount: number;
            }[];
            closed: {
                title: string;
                count: number;
                unassignedCount: number;
                overdueCount: number;
                averageTimeToCloseInMS: number;
            }[];
        };
    };
    'by-user': {
        type: 'by-user';
        data: {
            open: {
                userId: string;
                count: number;
                unassignedCount: number;
                overdueCount: number;
            }[];
            closed: {
                userId: string;
                count: number;
                unassignedCount: number;
                overdueCount: number;
                averageTimeToCloseInMS: number;
            }[];
            closedForReason: {
                userId: string;
                reason: string;
                count: number;
                averageTimeToCloseInMS: number;
            }[];
        };
    };
};
export type TicketsReportType = keyof TicketsReports;
export type TicketsReport = TicketsReports[TicketsReportType];
export type ReportQuery = {
    range?: DateRange;
    groupBy?: string;
    createdAtBuckets?: Date[];
    mmddyyyyRangeField?: string;
};
export type ReportQueries = Record<string, ReportQuery>;
export type Report = Record<string, {
    count: number;
    _id: null | string | string[];
    ids?: string[];
}[]>;
export type FormResponsesReportQuery = ReportQuery & {
    submittedAtRange?: DateRange;
    submittedAtBuckets?: Date[];
    answers?: string[];
};
export type FormResponsesReportQueries = Record<string, FormResponsesReportQuery>;
export type FormResponsesReport = Report;
export type PhoneCallsReportQuery = ReportQuery & {};
export type PhoneCallsReportQueries = Record<string, PhoneCallsReportQuery>;
export type PhoneCallsReport = Record<string, {
    count: number;
    callDurationInSeconds: number;
    _id: null | string | string[];
}[]>;
export type EnduserReportQuery = ReportQuery & {
    activeSince?: Date;
    fields?: {
        field: string;
        value: string;
    }[];
    filter?: any;
};
export type EndusersReportQueries = Record<string, EnduserReportQuery>;
export type EndusersReport = Report;
export type JourneyStatistics = {
    steps: Record<string, {
        count: number;
        activeCount: number;
        finishedCount: number;
        errorCount: number;
        cancelledCount: number;
        opens?: number;
        clicked?: number;
    }>;
};
export type FormStatistics = {
    fields: Record<string, {
        count: number;
    }>;
};
export type JourneyStatePriority = "Disengaged" | "N/A" | "Engaged";
export interface JourneyState {
    name: string;
    priority: JourneyStatePriority;
    requiresFollowup?: boolean;
    description?: string;
}
export interface Journey_readonly extends ClientRecord {
}
export interface Journey_updatesDisabled {
}
export interface Journey_required {
    title: string;
}
export interface Journey extends Journey_readonly, Journey_required, Journey_updatesDisabled {
    defaultState: string;
    states: JourneyState[];
    description?: string;
    onIncomingEnduserCommunication?: 'Remove' | '';
    tags?: string[];
    archivedAt?: Date | '';
}
export interface TextCommunication extends WithLinkOpenTrackingIds {
    automationStepId?: string;
    templateId?: string;
    calendarEventId?: string;
}
export type EmailEncoding = '' | 'base64';
export interface Email_readonly extends ClientRecord {
    delivered: boolean;
    threadId: string;
    source: string;
    linkOpens?: {
        [index: number]: Date;
    };
    openedAt?: Date;
    textEncoding?: EmailEncoding;
    htmlEncoding?: EmailEncoding;
    numForms?: number;
    s3id: string | null;
    error?: string;
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
    logOnly?: boolean;
    timestamp?: Date;
    journeyId?: string;
}
export interface Email extends Email_required, Email_readonly, Email_updatesDisabled, TextCommunication {
    replyToTemplateId?: string;
    userId: string;
    hiddenFromTimeline?: boolean;
    isAutoreply?: boolean;
    replyTo?: string | null;
    isBounce?: boolean;
    via?: string;
    readBy?: {
        [index: string]: Date | '';
    };
    journeyContext?: JourneyContext;
    sendAt?: Date | '';
    pinnedAt?: Date | '';
    isDraft?: boolean;
    attachments?: ChatAttachment[];
    syncedAt?: Date;
    cc?: string[];
    fromEmailOverride?: string;
    scheduledFromEmail?: string;
    ticketIds?: string[];
    alternateToAddress?: string;
    hiddenBy?: {
        [index: string]: Date | '';
    };
    hiddenForAll?: boolean;
    suggestedReply?: string;
    tags?: string[];
    batchId?: string;
    isMarketing?: boolean;
    destination?: string[];
    assignedTo?: string[];
    canvasId?: string;
    discussionRoomId?: string;
    markedUnreadForAll?: boolean;
    inboxStatus?: string;
    relatedContactId?: string;
    copyOf?: string;
}
export interface SMSMessage_readonly extends ClientRecord {
    delivered: boolean;
    internalMessageId?: string;
    linkOpens?: {
        [index: number]: Date;
    };
    price?: string;
    priceUnit?: string;
    numForms?: number;
    error?: string;
    images?: {
        url: string;
        type: string;
    }[];
}
export interface SMSMessage_required {
    enduserId: string;
    message: string;
}
export interface SMSMessage_updatesDisabled {
    inbound: boolean;
    newThread: boolean;
    logOnly?: boolean;
    journeyId?: string;
}
export interface SMSMessage extends SMSMessage_readonly, SMSMessage_required, SMSMessage_updatesDisabled, TextCommunication, WithLinkOpenTrackingIds {
    hiddenFromTimeline?: boolean;
    autoResolveToFrom?: boolean;
    isAutoreply?: boolean;
    userId?: string;
    readBy?: {
        [index: string]: Date | '';
    };
    hiddenBy?: {
        [index: string]: Date | '';
    };
    hiddenForAll?: boolean;
    error?: string;
    journeyContext?: JourneyContext;
    sendAt?: Date | '';
    pinnedAt?: Date | '';
    isDraft?: boolean;
    timestamp?: Date;
    ticketIds?: string[];
    suggestedReply?: string;
    phoneNumber?: string;
    enduserPhoneNumber?: string;
    tags?: string[];
    batchId?: string;
    replyToTemplateId?: string;
    assignedTo?: string[];
    templatedMessage?: string;
    canvasId?: string;
    discussionRoomId?: string;
    mediaURLs?: string[];
    markedUnreadForAll?: boolean;
    inboxStatus?: string;
    relatedContactId?: string;
    copyOf?: string;
}
export type ChatRoomType = 'internal' | 'external' | 'Group Chat';
export interface ChatRoom_readonly extends ClientRecord {
    recentMessage?: string;
    recentEnduserMessage?: string;
    recentSender?: string;
    numMessages: number;
}
export type ChatRoomUserInfo = {
    unreadCount: number;
    markedUnread?: boolean;
};
export interface ChatRoom_required {
}
export interface ChatRoom_updatesDisabled {
}
export interface ChatRoom extends ChatRoom_readonly, ChatRoom_required, ChatRoom_updatesDisabled {
    recentMessageSentAt?: number;
    recentEnduserMessageSentAt?: number;
    markedUnreadForAll?: boolean;
    inboxStatus?: string;
    description?: string;
    type?: ChatRoomType;
    userIds?: string[];
    title?: string;
    topic?: string;
    topicId?: string;
    enduserIds?: string[];
    ticketId?: string;
    endedAt?: Date | '';
    tags?: string[];
    infoForUser?: {
        [index: string]: ChatRoomUserInfo;
    };
    aboutEnduserId: string;
    pinnedAt?: Date | '';
    fields?: Indexable<string | CustomField>;
    suggestedReply?: string;
    assignedTo?: string[];
    discussionRoomId?: string;
    identifier?: string;
    source?: string;
    externalId?: string;
    references?: RelatedRecord[];
    journeyId?: string;
}
export type ChatAttachmentType = 'image' | 'video' | 'file' | string;
export type ChatAttachment = {
    type: ChatAttachmentType;
    name?: string;
    secureName: string;
};
export type GenericAttachment = {
    type: string;
    fileId: string;
    displayName: string;
    secureName: string;
};
export interface ChatMessage_readonly extends ClientRecord {
    linkOpens?: {
        [index: number]: Date;
    };
}
export interface ChatMessage_required {
    roomId: string;
    message: string;
}
export interface ChatMessage_updatesDisabled {
    roomId: string;
    replyId?: string | null;
}
export interface ChatMessage extends ChatMessage_readonly, ChatMessage_required, ChatMessage_updatesDisabled, TextCommunication {
    senderId: string | null;
    html?: string;
    readBy?: {
        [index: string]: Date | '';
    };
    hiddenBy?: {
        [index: string]: Date | '';
    };
    hiddenForAll?: boolean;
    attachments?: ChatAttachment[];
    timestamp?: Date;
    ticketIds?: string[];
    tags?: string[];
    mentions?: string[];
    userId?: string;
    enduserId?: string;
    canvasId?: string;
    isAutoreply?: boolean;
    quote?: string[];
    references?: RelatedRecord[];
    sendAt?: Date | '';
    isDraft?: boolean;
    journeyId?: string;
    source?: string;
}
export type MessageTemplateType = 'enduser' | 'Reply' | 'team';
export type MessageTemplateMode = 'html' | 'richtext';
export interface MessageTemplate_readonly extends ClientRecord {
}
export interface MessageTemplate_required {
    title: string;
    subject: string;
    message: string;
}
export interface MessageTemplate_updatesDisabled {
}
export interface MessageTemplate extends MessageTemplate_readonly, MessageTemplate_required, MessageTemplate_updatesDisabled {
    html: string;
    type?: MessageTemplateType;
    editorState?: string;
    mode?: MessageTemplateMode;
    embeddingHash?: string;
    isMarketing?: boolean;
    forChannels?: string[];
    forRoles?: string[];
    forEntityTypes?: string[];
    hideFromCompose?: boolean;
    tags?: string[];
    archivedAt?: Date | '';
    mmsAttachmentURLs?: string[];
}
export interface MessageTemplateSnippet_readonly extends ClientRecord {
}
export interface MessageTemplateSnippet_required {
    key: string;
    value: string;
}
export interface MessageTemplateSnippet_updatesDisabled {
}
export interface MessageTemplateSnippet extends MessageTemplateSnippet_readonly, MessageTemplateSnippet_required, MessageTemplateSnippet_updatesDisabled {
}
export interface File_readonly extends ClientRecord {
    secureName: string;
    publicRead?: boolean;
    viewsById?: Record<string, {
        recentlyViewedAt: Date;
        type: 'user' | 'enduser';
    }>;
    externalId?: string;
    timestamp?: Date;
    confirmedAt?: Date;
}
export interface File_required {
    name: string;
    type: string;
    size: number;
}
export interface File_updatesDisabled {
}
export interface File extends File_readonly, File_required, File_updatesDisabled, EnduserPortalVisibility {
    enduserId?: string;
    pushedToClientPortal?: boolean;
    hiddenFromEnduser?: boolean;
    source?: string;
    isCalledOut?: boolean;
    ocrType?: string;
    references?: RelatedRecord[];
    tags?: string[];
}
export type TicketActionBuilder<T, I> = {
    type: T;
    info: I;
    optional?: boolean;
    completedAt?: Date | '';
};
export type TicketActions = {
    "Complete Form": TicketActionBuilder<'Complete Form', {
        formId: string;
        formResponseId?: string;
        bulkForEvent?: boolean;
    }>;
    "Create Prescription": TicketActionBuilder<'Create Prescription', {}>;
    "Send SMS": TicketActionBuilder<'Send SMS', {
        templateId: string;
        smsId?: string;
        bulkForEvent?: boolean;
    }>;
    "Send Email": TicketActionBuilder<'Send Email', {
        templateId: string;
        emailId?: string;
    }>;
    "Send Chat": TicketActionBuilder<'Send Chat', {
        templateId: string;
        chatId?: string;
        chatRoomId?: string;
    }>;
};
export type TicketActionType = keyof TicketActions;
export type TicketAction = TicketActions[TicketActionType];
export type TicketSnooze = {
    at: Date;
    until: Date;
    reason?: string;
};
export type RoundRobinAssignmentInfo = {
    id: string;
    key: string;
    timestamp: number;
    userId: string;
};
export type TicketReminder = {
    msBeforeDueDate: number;
    queueId?: string;
    didRemind?: boolean;
};
export interface Ticket_readonly extends ClientRecord {
    source?: string;
    externalId?: string;
    references?: RelatedRecord[];
    nextReminderInMS?: number;
}
export interface Ticket_required {
    title: string;
}
export interface Ticket_updatesDisabled {
}
export interface Ticket extends Ticket_readonly, Ticket_required, Ticket_updatesDisabled {
    disableEditTitle?: boolean;
    queueId?: string;
    dequeuedAt?: Date | '';
    dequeuedFrom?: string;
    enduserId?: string;
    closedAt?: Date | '';
    closedBy?: string;
    closedForReason?: string;
    closeReasons?: string[];
    automationStepId?: string;
    dueDateInMS?: number;
    message?: string;
    type?: string;
    owner?: string;
    skillsRequired?: string[];
    chatRoomId?: string;
    priority?: number;
    stage?: string;
    blockerDescription?: string;
    index?: number;
    carePlanId?: string;
    journeyId?: string;
    hiddenFromTickets?: boolean;
    htmlDescription?: string;
    formResponseIds?: string[];
    purchaseId?: string;
    actions?: TicketAction[];
    closeOnFinishedActions?: boolean;
    remindAt?: Date | '';
    reminderSilencedAt?: Date | '';
    reminderLockId?: string;
    relatedRecords?: RelatedRecord[];
    attachments?: ChatAttachment[];
    rootTicketId?: string;
    parentTicketId?: string;
    timeToCloseInMS?: number;
    snoozes?: TicketSnooze[];
    requireConfirmation?: boolean;
    reminders?: TicketReminder[];
    preserveContext?: boolean;
    phoneCallId?: string;
    smsId?: string;
    emailId?: string;
    calendarEventId?: string;
    calendarEventTitle?: string;
    calendarEventStartTimeInMS?: number;
    observationId?: string;
    tags?: string[];
    restrictByState?: string;
    restrictByTags?: string[];
    restrictByTagsQualifier?: ListQueryQualifier;
    archiveReason?: string;
    contextFormIds?: string[];
    contextContentIds?: string[];
    triggerFileId?: string;
    orderId?: string;
    contextEnduserFields?: string[];
    isTodo?: boolean;
    databaseRecordId?: string;
    databaseRecordCreator?: string;
}
export type AttendeeInfo = {
    ExternalUserId: string;
    AttendeeId: string;
    JoinToken: string;
};
export type Attendee = UserIdentity & {
    info: AttendeeInfo;
};
export type MeetingStatus = 'scheduled' | 'live' | 'ended';
export type MeetingInfo = {
    MeetingId: string;
    ExternalMeetingId: string;
    MediaPlacement: object;
};
export interface Meeting_readonly extends ClientRecord {
    calendarEventId?: string;
}
export interface Meeting_required {
}
export interface Meeting_updatesDisabled {
}
export interface Meeting extends Meeting_readonly, Meeting_required, Meeting_updatesDisabled {
    attendees: Attendee[];
    meetingInfo: {
        Meeting: MeetingInfo;
    };
    status: MeetingStatus;
    publicRead?: boolean;
    endedAt?: Date;
}
export interface Note_readonly extends ClientRecord {
}
export interface Note_required {
    enduserId: string;
}
export interface Note_updatesDisabled {
}
export interface Note extends Note_readonly, Note_required, Note_updatesDisabled {
    text?: string;
    title?: string;
    type?: string;
    ticketId?: string;
    fields?: Indexable<string | CustomField>;
    pinnedAt?: Date | '';
    tags?: string[];
    discussionRoomId?: string;
    source?: string;
    externalId?: string;
    hiddenFromTimeline?: boolean;
    copiedFrom?: string;
    copiedFromEnduserId?: string;
}
export type FormFieldLiteralType = 'Rich Text' | 'description' | 'string' | 'stringLong' | 'number' | 'email' | 'phone' | 'date' | 'dateString' | 'rating' | 'Time' | "Timezone";
export type FormFieldComplexType = "Conditions" | "Allergies" | "Emotii" | "Hidden Value" | "Redirect" | "Height" | "Appointment Booking" | "multiple_choice" | "file" | 'files' | "signature" | 'ranking' | 'Question Group' | 'Table Input' | "Address" | "Chargebee" | "Stripe" | "Dropdown" | "Database Select" | "Medications" | "Related Contacts" | "Insurance";
export type FormFieldType = FormFieldLiteralType | FormFieldComplexType;
export type PreviousFormFieldType = 'root' | 'after' | 'previousEquals' | 'compoundLogic';
export type PreviousFormFieldBuilder<T extends PreviousFormFieldType, V> = {
    type: T;
    info: V;
};
export type PreviousFormFieldAfterInfo = {
    fieldId: string;
};
export type PreviousFormFieldEqualsInfo = {
    fieldId: string;
    equals: string;
};
export type PreviousFormFieldAfter = PreviousFormFieldBuilder<'after', PreviousFormFieldAfterInfo>;
export type PreviousFormFieldEquals = PreviousFormFieldBuilder<'previousEquals', PreviousFormFieldEqualsInfo>;
export type PreviousFormCompoundLogic = PreviousFormFieldBuilder<'compoundLogic', {
    fieldId: string;
    priority: number;
    label: string;
    condition: any;
}>;
export type PreviousFormFieldRoot = PreviousFormFieldBuilder<'root', {}>;
export type PreviousFormField = (PreviousFormFieldRoot | PreviousFormFieldAfter | PreviousFormFieldEquals | PreviousFormCompoundLogic);
export type FormSubField = {
    id: string;
};
export type TableChoiceBuilder<T, I> = {
    type: T;
    info: I;
    label: string;
};
export type TableInputChoices = {
    Text: TableChoiceBuilder<'Text', {}>;
    Select: TableChoiceBuilder<'Select', {
        choices: string[];
    }>;
    Date: TableChoiceBuilder<'Date', {}>;
    Database: TableChoiceBuilder<'Database', {
        databaseId: string;
        databaseLabel: string;
    }>;
};
export type TableInputChoiceType = keyof TableInputChoices;
export type TableInputChoice = TableInputChoices[TableInputChoiceType];
export type FormFieldValidation = {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    repeat?: boolean;
};
export type CanvasCoding = {
    system: string;
    code: string;
    display: string;
};
export type FormFieldFeedback = {
    ifEquals: string;
    display: string;
};
export type FormFieldOptionDetails = {
    option: string;
    description?: string;
};
export interface CanvasConsentCategory extends CanvasCoding {
}
export type FormFieldOptions = FormFieldValidation & {
    default?: string;
    tableChoices?: TableInputChoice[];
    choices?: string[];
    optionDetails?: FormFieldOptionDetails[];
    canvasCodings?: CanvasCoding[];
    from?: number;
    to?: number;
    radio?: boolean;
    other?: boolean;
    pdfAttachment?: string;
    canvasConsentCategory?: CanvasConsentCategory;
    subFields?: FormSubField[];
    validFileTypes?: string[];
    maxFileSize?: number;
    hideFromPortal?: boolean;
    signatureUrl?: string;
    productIds?: string[];
    chargeImmediately?: boolean;
    databaseId?: string;
    databaseLabel?: string;
    databaseLabels?: string[];
    filterByEnduserState?: boolean;
    databaseFilter?: {
        fieldId?: string;
        databaseLabel?: string;
    };
    allowAddToDatabase?: boolean;
    useDatePicker?: boolean;
    sharedIntakeFields?: string[];
    hiddenDefaultFields?: string[];
    customTypeId?: string;
    copyResponse?: boolean;
    disableGoBack?: boolean;
    disableNext?: boolean;
    customPriceMessage?: string;
    billingProvider?: 'Canvas' | "Candid" | string;
    bookingPageId?: string;
    userTags?: string[];
    userFilterTags?: string[];
    requirePredefinedInsurer?: boolean;
    addressFields?: string[];
    validStates?: string[];
    autoAdvance?: boolean;
    autoSubmit?: boolean;
    prefillSignature?: boolean;
    includeGroupNumber?: boolean;
    holdAppointmentMinutes?: number;
    rangeStepSize?: number;
    redirectFormId?: string;
    redirectExternalUrl?: string;
    groupPadding?: number;
    saveIntakeOnPartial?: boolean;
    stripeKey?: string;
    stripeProductSelectionMode?: boolean;
    dataSource?: string;
    canvasDocumentCoding?: Pick<CanvasCoding, 'system' | 'code'>;
    canvasDocumentType?: CanvasCoding;
    canvasDocumentComment?: string;
    canvasReviewMode?: string;
    esignatureTermsCompanyName?: string;
    observationCode?: string;
    observationDisplay?: string;
    observationUnit?: string;
    autoUploadFiles?: boolean;
    chargebeeEnvironment?: string;
    chargebeePlanId?: string;
    chargebeeItemId?: string;
    relatedContactTypes?: string[];
    radioChoices?: string[];
    elationHistoryType?: string;
    elationIsAllergy?: boolean;
    elationAppendToNote?: boolean;
    elationAppendToNotePrefix?: string;
};
export type MultipleChoiceOptions = Pick<FormFieldOptions, 'choices' | 'radio' | 'other' | 'optionDetails' | 'radioChoices'>;
export type FormFieldCalloutConditionComparison = 'Equals';
export type FormFieldCalloutCondition = {
    comparison: FormFieldCalloutConditionComparison;
    value: string;
};
export interface FormField_readonly extends ClientRecord {
}
export interface FormField_required {
    formId: string;
    title: string;
    type: FormFieldType;
    previousFields: PreviousFormField[];
}
export interface FormField_updatesDisabled {
}
export interface FormField extends FormField_readonly, FormField_required, FormField_updatesDisabled {
    internalNote?: string;
    placeholder?: string;
    isOptional?: boolean;
    fullZIP?: boolean;
    description?: string;
    htmlDescription?: string;
    headerText?: string;
    options?: FormFieldOptions;
    intakeField?: string | null;
    flowchartUI?: FlowchartUI;
    isInGroup?: boolean;
    externalId?: string;
    sharedWithEnduser?: boolean;
    prepopulateFromFields?: boolean;
    disabledWhenPrepopulated?: boolean;
    calloutConditions?: FormFieldCalloutCondition[];
    feedback?: FormFieldFeedback[];
    highlightOnTimeline?: boolean;
    prepopulateFromDatabase?: {
        databaseId?: string;
        field?: string;
        overwrite?: boolean;
    };
    titleFontSize?: number;
    groupShowCondition: Record<string, any>;
}
export type FormScoring = {
    title: string;
    fieldId: string;
    response?: string;
    score: (string | number);
};
export type FormType = 'note' | 'enduserFacing';
export type FormCustomization = {
    publicFormHTMLDescription?: string;
    publicFormSubmitHTMLDescription?: string;
    logoHeight?: number;
    publicLabelPrefix?: string;
    publicFnameLabel?: string;
    publicLnameLabel?: string;
    publicEmailLabel?: string;
    publicPhoneLabel?: string;
    publicStateLabel?: string;
    publicDateOfBirthLabel?: string;
    publicGenderLabel?: string;
    hideProgressBar?: boolean;
    showRestartAtEnd?: boolean;
    hideLogo?: boolean;
    multiPagePublicQuestions?: boolean;
    hideBg?: boolean;
    portalShowThanksAfterSubmission?: boolean;
    maxWidth?: number;
};
export interface Form_readonly extends ClientRecord {
    numFields: number;
}
export interface Form_required {
    title: string;
}
export interface Form_updatesDisabled {
}
export interface Form extends Form_readonly, Form_required, Form_updatesDisabled {
    gtmTag?: string;
    ipAddressCustomField: string;
    archivedAt?: Date | '';
    displayTitle?: string;
    description?: string;
    customSubject?: string;
    customGreeting?: string;
    customSignature?: string;
    allowPublicURL?: boolean;
    intakeEmailRequired?: boolean;
    intakeEmailHidden?: boolean;
    intakePhone?: 'required' | 'optional' | 'hidden';
    intakeDateOfBirth?: 'required' | 'optional' | 'hidden';
    intakeState?: 'required' | 'optional' | 'hidden';
    intakeGender?: 'required' | 'optional' | 'hidden';
    intakeGenderIsSex?: boolean;
    thanksMessage?: string;
    htmlThanksMessage?: string;
    type?: FormType;
    scoring?: FormScoring[];
    realTimeScoring?: boolean;
    externalId?: string;
    ga4measurementId?: string;
    backgroundColor?: string;
    productIds?: string[];
    redirectToBookedAppointmentOnSubmit?: boolean;
    submitRedirectURL?: string;
    publicFormIdRedirect?: string;
    publicShowLanguage?: boolean;
    publicShowDownload?: boolean;
    customization?: FormCustomization;
    disabled?: boolean;
    disableAutomaticIntegrationPush?: boolean;
    customTypeIds?: string[];
    lockResponsesOnSubmission?: boolean;
    tags?: string[];
    language?: string;
    isNonVisitElationNote?: boolean;
    elationVisitNotePractitionerIds?: string[];
    elationVisitNoteType?: string;
    elationSkipBlankResponses?: boolean;
    canvasId?: string;
    canvasQuestionId?: string;
    syncToOLH?: boolean;
    syncWithResponsesFromFormIds?: string[];
    scoresSync?: {
        score: string;
        externalId: string;
    }[];
    hideAfterUnsubmittedInMS?: number;
    hideFromCompose?: boolean;
    hideFromBulkSubmission?: boolean;
    enduserFieldsToAppendForSync?: string[];
    allowPortalSubmission?: boolean;
    allowPortalSubmissionEnduserCondition?: Record<string, any>;
    canvasNoteCoding?: Partial<CanvasCoding>;
    syncToCanvasAsDataImport?: boolean;
    matchCareTeamTagsForCanvasPractitionerResolution?: ListOfStringsWithQualifier;
    dontSyncToCanvasOnSubmission?: boolean;
    belugaVisitType?: string;
    showByUserTags?: string[];
}
export interface FormGroup_readonly extends ClientRecord {
}
export interface FormGroup_required {
}
export interface FormGroup_updatesDisabled {
}
export interface FormGroup extends FormGroup_readonly, FormGroup_required, FormGroup_updatesDisabled {
    title: string;
    formIds: string[];
}
export type OAuth2AuthenticationFields = {
    access_token: string;
    refresh_token: string;
    scope: string;
    token_type: 'Bearer';
    expiry_date: number;
    external_id?: string;
    state?: string;
    email?: string;
};
export type IntegrationAuthentication = ({
    type: 'oauth2';
    info: OAuth2AuthenticationFields;
} | {
    type: 'apiKey';
    info: OAuth2AuthenticationFields;
});
export type FieldMapping = {
    field: string;
    externalField: string;
    type: string;
};
export interface Integration_readonly extends ClientRecord {
    lastSync?: number;
    lastSyncId?: string;
    historyId?: string;
}
export interface Integration_required {
}
export interface Integration_updatesDisabled {
}
export interface Integration extends Integration_readonly, Integration_required, Integration_updatesDisabled {
    title: string;
    tenantId?: string;
    authentication: IntegrationAuthentication;
    emailDisabled?: boolean;
    syncUnrecognizedSenders?: boolean;
    createEndusersForUnrecognizedSenders?: boolean;
    calendars?: string[];
    environment?: string;
    webhooksSecret?: string;
    calendarOnly?: boolean;
    shouldCreateNotifications?: boolean;
    disableEnduserAutoSync?: boolean;
    disableTicketAutoSync?: boolean;
    syncEnduserFiles?: boolean;
    pushCalendarDetails?: boolean;
    redactExternalEvents?: boolean;
    fhirClientId?: string;
    fhirClientSecret?: string;
    fhirAccessToken?: string;
    fhirExpiryDate?: number;
    defaultAttendeeId?: string;
    sendEmailOnSync?: boolean;
    enduserFieldMapping?: FieldMapping[];
    default_dietitian_id?: string;
    dontPushCalendarEvent?: boolean;
    dontPullCalendarEvent?: boolean;
    pushAddedTags?: boolean;
    pushRemovedTags?: boolean;
    overwriteAddress?: boolean;
    requirePhoneToPushEnduser?: boolean;
    syncAsActive?: boolean;
    syncEnduserId?: boolean;
    syncCareTeam?: boolean;
    shardId?: string;
    pushHistoricalEvents?: boolean;
}
export type BuildDatabaseRecordField<K extends string, V, O> = {
    type: K;
    value: V;
    options: O & {
        width?: string;
    };
};
export type DatabaseRecordFieldsInfo = {
    Text: BuildDatabaseRecordField<'Text', string, {}>;
    Email: BuildDatabaseRecordField<'Email', string, {}>;
    Phone: BuildDatabaseRecordField<'Phone', string, {}>;
    'Text Long': BuildDatabaseRecordField<'Text Long', string, {}>;
    'Text List': BuildDatabaseRecordField<'Text List', string[], {}>;
    'Number': BuildDatabaseRecordField<'Number', number | '', {}>;
    Address: BuildDatabaseRecordField<'Address', Address | undefined, {}>;
    'Multiple Select': BuildDatabaseRecordField<'Multiple Select', string[], {
        options: string[];
    }>;
    'Dropdown': BuildDatabaseRecordField<'Dropdown', string, {
        options: string[];
    }>;
    'Timestamp': BuildDatabaseRecordField<'Timestamp', string, {}>;
    'Date': BuildDatabaseRecordField<'Date', string, {}>;
};
export type DatabaseRecordFieldType = keyof DatabaseRecordFieldsInfo;
export type DatabaseRecordValues = {
    [K in DatabaseRecordFieldType]: {
        type: K;
        value: DatabaseRecordFieldsInfo[K]['value'];
        label: string;
    };
};
export type DatabaseRecordValue = DatabaseRecordValues[DatabaseRecordFieldType];
export type DatabaseRecordFields = {
    [K in DatabaseRecordFieldType]: {
        type: K;
        label: string;
        showConditions?: Record<any, any>;
        required?: boolean;
        hideFromTable?: boolean;
        wrap?: string;
        options?: DatabaseRecordFieldsInfo[K]['options'];
    };
};
export type DatabaseRecordField = DatabaseRecordFields[DatabaseRecordFieldType];
export type OrganizationAccess = {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
};
export interface Database_readonly extends ClientRecord {
    numRecords: number;
}
export interface Database_required {
    title: string;
    fields: DatabaseRecordField[];
}
export interface Database_updatesDisabled {
}
export interface Database extends Database_readonly, Database_required, Database_updatesDisabled {
    visibleForRoles?: string[];
    isReferralDatabase?: boolean;
}
export interface DatabaseRecord_readonly extends ClientRecord {
}
export interface DatabaseRecord_required {
    databaseId: string;
    values: DatabaseRecordValue[];
}
export interface DatabaseRecord_updatesDisabled {
}
export interface DatabaseRecord extends DatabaseRecord_readonly, DatabaseRecord_required, DatabaseRecord_updatesDisabled {
}
export type FormResponseValueAnswerBuilder<TYPE extends FormFieldType, VALUE extends number | object | string> = {
    type: TYPE;
    value?: VALUE;
};
export type TableInputCell = {
    label: string;
    entry: string;
};
export type FormResponseAnswerAddress = FormResponseValueAnswerBuilder<'Address', {
    addressLineOne: string;
    addressLineTwo?: string;
    city: string;
    zipCode: string;
    zipPlusFour?: string;
    state: string;
}>;
export type DatabaseSelectResponse = {
    text: string;
    databaseId?: string;
    recordId?: string;
};
export type MedicationResponse = {
    displayTerm: string;
    drugName: string;
    otherDrug?: string;
    drugSynonym?: string;
    rxNormCode?: string;
    fdbCode?: string;
    dosage?: {
        value: string;
        unit: string;
        description?: string;
        quantity?: string;
        frequency?: string;
        frequencyDescriptor?: string;
    };
    NDCs?: string[];
    reasonForTaking?: string;
};
export type BaseResponse = {
    display: string;
    code: string;
    system?: string;
};
export type AllergyResponse = BaseResponse & {
    severity?: string;
    note?: string;
};
export type ConditionResponse = BaseResponse;
export type FormResponseAnswerTable = FormResponseValueAnswerBuilder<'Table Input', TableInputCell[][]>;
export type FormResponseAnswerGroup = FormResponseValueAnswerBuilder<'Question Group', FormSubField[]>;
export type FormResponseAnswerDescription = FormResponseValueAnswerBuilder<'description', ''>;
export type FormResponseAnswerEmail = FormResponseValueAnswerBuilder<'email', string>;
export type FormResponseAnswerNumber = FormResponseValueAnswerBuilder<'number', number>;
export type FormResponseAnswerPhone = FormResponseValueAnswerBuilder<'phone', string>;
export type FormResponseAnswerString = FormResponseValueAnswerBuilder<'string', string>;
export type FormResponseAnswerStringLong = FormResponseValueAnswerBuilder<'stringLong', string>;
export type FormResponseAnswerRichText = FormResponseValueAnswerBuilder<'Rich Text', string>;
export type FormResponseAnswerDate = FormResponseValueAnswerBuilder<'date', Date>;
export type FormResponseAnswerDateString = FormResponseValueAnswerBuilder<'dateString', string>;
export type FormResponseAnswerRating = FormResponseValueAnswerBuilder<'rating', number>;
export type FormResponseAnswerTime = FormResponseValueAnswerBuilder<'Time', string>;
export type FormResponseAnswerStripe = FormResponseValueAnswerBuilder<'Stripe', string>;
export type FormResponseAnswerDatabaseSelect = FormResponseValueAnswerBuilder<'Database Select', DatabaseSelectResponse[]>;
export type FormResponseAnswerMedications = FormResponseValueAnswerBuilder<'Medications', MedicationResponse[]>;
export type FormResponseAnswerRelatedContacts = FormResponseValueAnswerBuilder<'Related Contacts', Partial<Enduser>[]>;
export type FormResponseAnswerAppointmentBooking = FormResponseValueAnswerBuilder<'Appointment Booking', string>;
export type FormResponseAnswerInsurance = FormResponseValueAnswerBuilder<'Insurance', Partial<EnduserInsurance>>;
export type FormResponseAnswerHeight = FormResponseValueAnswerBuilder<'Height', {
    feet: number;
    inches: number;
}>;
export type FormResponseAnswerRedirect = FormResponseValueAnswerBuilder<'Redirect', string>;
export type FormResponseAnswerAllergies = FormResponseValueAnswerBuilder<'Allergies', AllergyResponse[]>;
export type FormResponseAnswerConditions = FormResponseValueAnswerBuilder<'Conditions', ConditionResponse[]>;
export type FormResponseAnswerChargebee = FormResponseValueAnswerBuilder<'Chargebee', {
    url: string;
}>;
export type FormResponseAnswerSignatureValue = {
    fullName: string;
    signed: boolean;
    pdfAttachment?: string;
    signedPdfSecureName?: string;
    url?: string;
};
export type FormResponseAnswerSignature = FormResponseValueAnswerBuilder<'signature', FormResponseAnswerSignatureValue>;
export type FormResponseAnswerMultipleChoiceValue = string[];
export type FormResponseAnswerMultipleChoice = FormResponseValueAnswerBuilder<'multiple_choice', FormResponseAnswerMultipleChoiceValue>;
export type FormResponseAnswerDropdown = FormResponseValueAnswerBuilder<'Dropdown', FormResponseAnswerMultipleChoiceValue>;
export type FormResponseAnswerRanking = FormResponseValueAnswerBuilder<'ranking', FormResponseAnswerMultipleChoiceValue>;
export type FormResponseAnswerHiddenValue = FormResponseValueAnswerBuilder<'Hidden Value', string>;
export type FormResponseAnswerEmotii = FormResponseValueAnswerBuilder<'Emotii', string>;
export type FormResponseAnswerFileValue = {
    secureName: string;
    name: string;
    type?: string;
};
export type FormResponseAnswerFile = FormResponseValueAnswerBuilder<'file', FormResponseAnswerFileValue>;
export type FormResponseAnswerFiles = FormResponseValueAnswerBuilder<'files', FormResponseAnswerFileValue[]>;
export type FormResponseAnswerTimezone = FormResponseValueAnswerBuilder<'Timezone', string>;
export type FormResponseValueAnswer = (FormResponseAnswerGroup | FormResponseAnswerTimezone | FormResponseAnswerTable | FormResponseAnswerDescription | FormResponseAnswerEmail | FormResponseAnswerNumber | FormResponseAnswerPhone | FormResponseAnswerString | FormResponseAnswerStringLong | FormResponseAnswerRichText | FormResponseAnswerSignature | FormResponseAnswerMultipleChoice | FormResponseAnswerFile | FormResponseAnswerFiles | FormResponseAnswerDate | FormResponseAnswerRating | FormResponseAnswerRanking | FormResponseAnswerDateString | FormResponseAnswerAddress | FormResponseAnswerTime | FormResponseAnswerStripe | FormResponseAnswerDropdown | FormResponseAnswerDatabaseSelect | FormResponseAnswerMedications | FormResponseAnswerRelatedContacts | FormResponseAnswerInsurance | FormResponseAnswerAppointmentBooking | FormResponseAnswerHeight | FormResponseAnswerRedirect | FormResponseAnswerHiddenValue | FormResponseAnswerEmotii | FormResponseAnswerAllergies | FormResponseAnswerConditions | FormResponseAnswerChargebee);
export type FormResponseValue = {
    fieldId: string;
    fieldTitle: string;
    fieldDescription?: string;
    fieldHtmlDescription?: string;
    answer: FormResponseValueAnswer;
    answerIsHTML?: boolean;
    externalId?: string;
    sharedWithEnduser?: boolean;
    isCalledOut?: boolean;
    disabled?: boolean;
    isHighlightedOnTimeline?: boolean;
    computedValueKey?: 'Height' | 'Weight' | 'Date of Birth' | "Gender" | "State";
    intakeField?: string;
};
export type AnswerForType = {
    'email': FormResponseAnswerEmail['value'];
    'number': FormResponseAnswerNumber['value'];
    'phone': FormResponseAnswerPhone['value'];
    'string': FormResponseAnswerString['value'];
    'stringLong': FormResponseAnswerStringLong['value'];
    'Rich Text': FormResponseAnswerRichText['value'];
    'signature': FormResponseAnswerSignature['value'];
    'multiple_choice': FormResponseAnswerMultipleChoice['value'];
    'Dropdown': FormResponseAnswerMultipleChoice['value'];
    'file': FormResponseAnswerFile['value'];
    'files': FormResponseAnswerFiles['value'];
    'date': FormResponseAnswerDate['value'];
    'rating': FormResponseAnswerRating['value'];
    'ranking': FormResponseAnswerRanking['value'];
    'dateString': FormResponseAnswerDateString['value'];
    'Input Table': FormResponseAnswerTable['value'];
    'Address': FormResponseAnswerAddress['value'];
    'Time': FormResponseAnswerTime['value'];
    'Stripe': FormResponseAnswerStripe['value'];
    'Database Select': FormResponseAnswerDatabaseSelect['value'];
    'Medications': FormResponseAnswerMedications['value'];
    'Related Contacts': FormResponseAnswerRelatedContacts['value'];
    'Insurance': FormResponseAnswerInsurance['value'];
    'Appointment Booking': FormResponseAnswerAppointmentBooking['value'];
    'Chargebee': FormResponseAnswerChargebee['value'];
    'Height': FormResponseAnswerHeight['value'];
    'Redirect': FormResponseAnswerRedirect['value'];
    'Hidden Value': FormResponseAnswerHiddenValue['value'];
    'Emotii': FormResponseAnswerEmotii['value'];
    'Allergies': FormResponseAnswerAllergies['value'];
    'Conditions': FormResponseAnswerConditions['value'];
    'Timezone': FormResponseAnswerTimezone['value'];
};
export type Addendum = {
    timestamp: Date;
    userId: string;
    text: string;
};
export type FormResponseFollowup = {
    formId: string;
    formResponseId?: string;
    completedAt?: Date;
};
export interface FormResponse_readonly extends ClientRecord {
    openedAt?: Date;
    references?: RelatedRecord[];
    triggerIds?: string[];
}
export interface FormResponse_required {
    formId: string;
    enduserId: string;
    formTitle: string;
    responses?: FormResponseValue[];
    publicSubmit?: boolean;
    submittedBy?: string;
    submittedByIsPlaceholder?: boolean;
    markedAsSubmitted?: boolean;
    submittedAt?: Date;
    accessCode?: string;
    userEmail?: string;
    phone?: string;
    fname?: string;
    lname?: string;
    state?: string;
    dateOfBirth?: string;
    gender?: TellescopeGender;
    customTypeId?: string;
    followups?: FormResponseFollowup[];
}
export interface FormResponse_updatesDisabled {
    submissionExpiresAt?: number;
    automationStepId?: string;
}
export interface FormResponse extends FormResponse_readonly, FormResponse_required, FormResponse_updatesDisabled, EnduserPortalVisibility {
    hiddenFromTimeline?: boolean;
    draftSavedAt?: Date;
    draftSavedBy?: string;
    sharedVia?: CommunicationsChannel;
    isInternalNote?: boolean;
    scores?: {
        title: string;
        value: number;
    }[];
    source?: string;
    externalId?: string;
    pinnedAt?: Date | '';
    publicIdentifier?: string;
    rootResponseId?: string;
    parentResponseId?: string;
    tags?: string[];
    lockedAt?: Date | '';
    carePlanId?: string;
    context?: string;
    calendarEventId?: string;
    copiedFrom?: string;
    copiedFromEnduserId?: string;
    groupId?: string;
    groupInstance?: string;
    groupPosition?: number;
    utm?: LabeledField[];
    emotii?: {
        id: string;
        scores: {
            total: {
                score: number;
                relative: number;
                percentile: number;
            };
            byAnswer: {
                label: string;
                score: number;
                relative: number;
                percentile: number;
            }[];
        };
    }[];
    discussionRoomId?: string;
    formsort?: string;
    hideAfterUnsubmittedInMS?: number;
    addenda?: Addendum[];
    canvasEncounterId?: string;
    pushedToPortalAt?: Date;
    belugaStatus?: string;
}
export interface WebHook_readonly extends ClientRecord {
}
export interface WebHook_required {
}
export interface WebHook_updatesDisabled {
}
export interface WebHook extends WebHook_readonly, WebHook_required, WebHook_updatesDisabled {
    url: string;
    secret: string;
    subscriptions: WebhookSubscriptionsType;
}
export type BaseAvailabilityBlock = {
    userId: string;
    startTimeInMS: number;
    durationInMinutes: number;
    externalId?: string;
};
export interface AvailabilityBlock_readonly extends ClientRecord {
}
export interface AvailabilityBlock_required extends Pick<WeeklyAvailability, 'startTimeInMinutes' | 'endTimeInMinutes' | 'dayOfWeekStartingSundayIndexedByZero'> {
    entity: 'organization' | 'user';
    entityId: string;
}
export interface AvailabilityBlock_updatesDisabled {
    index: number;
}
export interface AvailabilityBlock extends WeeklyAvailability, AvailabilityBlock_readonly, AvailabilityBlock_required, AvailabilityBlock_updatesDisabled {
    typeId?: string;
    athenaDepartmentId?: string;
    externalId?: string;
    source?: string;
}
export type CalendarEventReminderNotificationInfo = {
    templateId?: string;
    channel?: 'Email' | 'SMS';
    useTemplateForSMS?: boolean;
};
type BuildCalendarEventReminderInfo<T, I> = {
    type: T;
    info: I;
    msBeforeStartTime: number;
    dontSendIfPassed?: boolean;
    didRemind?: boolean;
    dontSendIfJoined?: boolean;
};
export type CalendarEventReminderInfoForType = {
    "webhook": BuildCalendarEventReminderInfo<'webhook', {}>;
    "add-to-journey": BuildCalendarEventReminderInfo<'add-to-journey', {
        journeyId: string;
        firstAttendeeOnly?: boolean;
    }>;
    "Remove From Journey": BuildCalendarEventReminderInfo<'Remove From Journey', {
        journeyId: string;
    }>;
    "user-notification": BuildCalendarEventReminderInfo<'user-notification', CalendarEventReminderNotificationInfo>;
    "enduser-notification": BuildCalendarEventReminderInfo<'enduser-notification', CalendarEventReminderNotificationInfo>;
    "create-ticket": BuildCalendarEventReminderInfo<'create-ticket', {
        title: string;
    }>;
};
export type CalendarEventReminderType = keyof CalendarEventReminderInfoForType;
export type CalendarEventReminder = CalendarEventReminderInfoForType[CalendarEventReminderType];
export type EnduserTaskForEvent = {
    id: string;
    enduserId: string;
};
export type EnduserFormResponseForEvent = {
    formId: string;
    enduserId: string;
    accessCode: string;
};
export type GroupCancellation = {
    at: Date;
    id: string;
};
export type AttendeeStatus = {
    at: Date;
    id: string;
    status: 'Confirmed' | "Completed" | 'Cancelled' | 'No-showed' | 'Rescheduled';
};
export interface CalendarEventPortalSettings {
    hideUsers?: boolean;
}
export interface CalendarEvent_readonly extends ClientRecord {
    meetingId?: string;
    meetingStatus?: MeetingStatus;
    references?: RelatedRecord[];
}
export interface CalendarEvent_required {
    title: string;
    startTimeInMS: number;
    durationInMinutes: number;
}
export interface CalendarEvent_updatesDisabled {
}
export interface CalendarEvent extends CalendarEvent_readonly, CalendarEvent_required, CalendarEvent_updatesDisabled {
    updateKey?: string;
    dontSyncToElation?: boolean;
    createAndBookAthenaSlot?: boolean;
    athenaDepartmentId?: string;
    generateAthenaTelehealthLink?: boolean;
    athenaTypeId?: string;
    athenaBookingTypeId?: string;
    actualDuration?: number;
    dontSyncToCanvas?: boolean;
    reason?: string;
    cancelReason?: string;
    attendees: (UserIdentity & {
        joinLinkToken?: string;
    })[];
    color?: string;
    enableVideoCall?: boolean;
    type?: string;
    publicRead?: boolean;
    chatRoomId?: string;
    description?: string;
    fields?: Indexable<string | CustomField>;
    reminders?: CalendarEventReminder[];
    image?: string;
    numRSVPs?: number;
    source?: string;
    externalId?: string;
    templateId?: string;
    carePlanId?: string;
    carePlanNote?: string;
    enduserTasks?: EnduserTaskForEvent[];
    enduserFormResponses?: EnduserFormResponseForEvent[];
    sharedContentIds?: string[];
    attachments?: GenericAttachment[];
    bookingPageId?: string;
    locationId?: string;
    locationIds?: string[];
    location?: string;
    locationNotes?: string;
    locationURL?: string;
    phone?: string;
    wasSelfScheduled?: boolean;
    agreedToTerms?: AppointmentTerm[];
    cancelledAt?: Date | '';
    rescheduledAt?: Date | '';
    rescheduledTo?: string;
    noShowedAt?: Date | '';
    portalSettings?: CalendarEventPortalSettings;
    isEphemeral?: boolean;
    videoIntegration?: VideoIntegrationType;
    videoURL?: string;
    videoStartURL?: string;
    externalVideoURL?: string;
    videoHostUserId?: string;
    timezone?: Timezone;
    copiedFrom?: string;
    sequence?: number;
    internalNotes?: string;
    hiddenFromPortal?: boolean;
    nextReminderInMS?: number | null;
    enduserAttendeeLimit?: number;
    bufferStartMinutes?: number;
    bufferEndMinutes?: number;
    canvasCoding?: CanvasCoding;
    canvasReasonCoding?: CanvasCoding;
    canvasLocationId?: string;
    completedAt?: Date | '';
    completedBy?: string;
    holdUntil?: Date;
    holdFormResponseId?: string;
    tags?: string[];
    cancelledGroupAttendees?: GroupCancellation[];
    attendeeStatuses?: AttendeeStatus[];
    useUserURL?: boolean;
    healthieZoomStartURL?: string;
    healthieZoomJoinURL?: string;
    instructions?: string;
    scheduledBy?: string;
    statusChangeSource?: {
        source: string;
        identifier: string;
        byEnduserExternal?: boolean;
    };
    dontAutoSyncPatientToHealthie?: boolean;
    displayTitle?: string;
    displayDescription?: string;
    dontBlockAvailability?: boolean;
    previousStartTimes?: (number | string)[];
    requirePortalCancelReason?: boolean;
    startLinkToken?: string;
    canvasEncounterId?: string;
    allowGroupReschedule?: boolean;
    joinedVideoCall?: {
        id: string;
        at: Date;
    }[];
    confirmedAt?: Date | '';
    preventRescheduleMinutesInAdvance?: number;
    preventCancelMinutesInAdvance?: number;
    sendIcsEmail?: boolean;
    healthieInsuranceBillingEnabled?: boolean;
}
export type PaymentProcessor = 'Square' | 'Stripe';
export interface Product_readonly extends ClientRecord {
}
export interface Product_required {
    title: string;
    cost: {
        amount: number;
        currency: Currency;
    };
    processor: PaymentProcessor;
}
export interface Product_updatesDisabled {
}
export interface Product extends Product_readonly, Product_required, Product_updatesDisabled {
    description?: string;
    htmlDescription?: string;
    cptCode?: BillingCode;
    image?: string;
    showInPortal?: boolean;
    categories?: string[];
    maxCheckoutCount?: number | '';
    stripeSubscriptionId?: string;
    stripeProductId?: string;
    stripePriceId?: string;
    additionalStripePriceIds?: string[];
}
export interface Purchase_readonly extends ClientRecord {
}
export interface Purchase_required {
    title: string;
    cost: {
        amount: number;
        currency: Currency;
    };
    processor: PaymentProcessor;
    source?: string;
    enduserId: string;
}
export interface Purchase_updatesDisabled {
}
export interface Purchase extends Purchase_readonly, Purchase_required, Purchase_updatesDisabled {
    description?: string;
    refundedAmount?: number;
    processedAt?: Date | '';
    productId?: string;
    productIds?: string[];
    externalId?: string;
    cptCode?: BillingCode;
    notes?: string;
    references?: RelatedRecord[];
}
type BuildPurchaseCreditInfo<T, I> = {
    type: T;
    info: I;
};
export type PurchaseCreditInfoForType = {
    "Credit": BuildPurchaseCreditInfo<"Credit", {
        amount: number;
        currency: Currency;
    }>;
};
export type PurcahseCreditType = keyof PurchaseCreditInfoForType;
export type PurchaseCreditInfo = PurchaseCreditInfoForType[PurcahseCreditType];
export interface PurchaseCredit_readonly extends ClientRecord {
}
export interface PurchaseCredit_required {
    title: string;
    enduserId: string;
    value: PurchaseCreditInfo;
}
export interface PurchaseCredit_updatesDisabled {
}
export interface PurchaseCredit extends PurchaseCredit_readonly, PurchaseCredit_required, PurchaseCredit_updatesDisabled {
    usedAt?: Date | string;
    description?: string;
}
export type VideoIntegrationType = "Zoom" | 'No Integration';
export interface CalendarEventTemplate_readonly extends ClientRecord {
}
export interface CalendarEventTemplate_required {
    title: string;
    durationInMinutes: number;
}
export interface CalendarEventTemplate_updatesDisabled {
}
export interface CalendarEventTemplate extends CalendarEventTemplate_readonly, CalendarEventTemplate_required, CalendarEventTemplate_updatesDisabled {
    dontSyncToElation?: boolean;
    sendIcsEmail?: boolean;
    createAndBookAthenaSlot?: boolean;
    dontSyncToCanvas?: boolean;
    archivedAt?: Date | '';
    type?: string;
    enableVideoCall?: boolean;
    videoIntegration?: VideoIntegrationType;
    generateZoomLinkWhenBooked?: boolean;
    enableSelfScheduling?: boolean;
    restrictedByState?: boolean;
    publicRead?: boolean;
    description?: string;
    reminders?: CalendarEventReminder[];
    image?: string;
    productIds?: string[];
    portalSettings?: CalendarEventPortalSettings;
    confirmationEmailDisabled?: boolean;
    confirmationSMSDisabled?: boolean;
    color?: string;
    carePlanTasks?: string[];
    carePlanForms?: string[];
    carePlanContent?: string[];
    carePlanFiles?: string[];
    enduserAttendeeLimit?: number;
    apiOnly?: boolean;
    bufferStartMinutes?: number;
    bufferEndMinutes?: number;
    canvasCoding?: CanvasCoding;
    canvasReasonCoding?: CanvasCoding;
    tags?: string[];
    matchToHealthieTemplate?: boolean;
    useUserURL?: boolean;
    instructions?: string;
    dontAutoSyncPatientToHealthie?: boolean;
    displayTitle?: string;
    displayDescription?: string;
    requiresEnduser?: boolean;
    requirePortalCancelReason?: boolean;
    allowGroupReschedule?: boolean;
    preventRescheduleMinutesInAdvance?: number;
    preventCancelMinutesInAdvance?: number;
    athenaDepartmentId?: string;
    generateAthenaTelehealthLink?: boolean;
    athenaTypeId?: string;
    athenaBookingTypeId?: string;
    healthieInsuranceBillingEnabled?: boolean;
}
export interface AppointmentLocation_readonly extends ClientRecord {
}
export interface AppointmentLocation_required {
    title: string;
}
export interface AppointmentLocation_updatesDisabled {
}
export interface AppointmentLocation extends AppointmentLocation_readonly, AppointmentLocation_required, AppointmentLocation_updatesDisabled {
    address?: string;
    city?: string;
    zipCode?: string;
    state?: string;
    phone?: string;
    timezone?: Timezone;
    canvasLocationId?: string;
    healthieContactType?: string;
    healthieLocationId?: string;
    healthieUseZoom?: boolean;
    instructions?: string;
    tags?: string[];
}
export interface BookingRestrictions {
    templateId: string;
    restrictions: {
        state?: boolean;
        careTeam?: boolean;
        tagsPortal?: string[];
        hoursBefore?: number | '';
        hoursAfter?: number | '';
        shouldOpenJoinLink?: boolean;
    };
}
export type AppointmentTerm = {
    title: string;
    link: string;
};
export type Currency = 'USD';
export interface AppointmentBookingPage_readonly extends ClientRecord {
}
export interface AppointmentBookingPage_required {
    title: string;
    locationIds: string[];
    calendarEventTemplateIds: string[];
}
export interface AppointmentBookingPage_updatesDisabled {
}
export interface AppointmentBookingPage extends AppointmentBookingPage_readonly, AppointmentBookingPage_required, AppointmentBookingPage_updatesDisabled {
    startDate?: Date;
    endDate?: Date;
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    fontFamily?: string;
    fontFace?: string;
    fontURL?: string;
    terms?: AppointmentTerm[];
    topLogo?: string;
    intakeTitle?: string;
    intakeDescription?: string;
    thankYouRedirectURL?: string;
    thankYouTitle?: string;
    thankYouDescription?: string;
    thankYouHeaderImageURL?: string;
    thankYouMainImageURL?: string;
    ga4measurementId?: string;
    hiddenFromPortal?: boolean;
    hoursBeforeBookingAllowed?: number | '';
    limitedToCareTeam?: boolean;
    limitedByState?: boolean;
    limitedByTagsPortal?: string[];
    requireLocationSelection?: boolean;
    collectReason?: "Do Not Collect" | 'Optional' | 'Required';
    restrictionsByTemplate?: BookingRestrictions[];
    publicMulti?: boolean;
    publicUserTags?: string[];
    publicUserFilterTags?: string[];
    appointmentSlotsMaxHeight?: number;
    includeRelatedContactTypes?: string[];
    archivedAt?: Date | '';
    gtmTag?: string;
    dontRestrictRescheduleToOriginalHost?: boolean;
    calendarTitleText?: string;
    emailFieldBehavior?: "required" | "optional" | "hidden";
}
export interface CalendarEventRSVP_readonly extends ClientRecord {
    creatorType: SessionType;
}
export interface CalendarEventRSVP_required {
    eventId: string;
}
export interface CalendarEventRSVP_updatesDisabled {
}
export interface CalendarEventRSVP extends CalendarEventRSVP_readonly, CalendarEventRSVP_required, CalendarEventRSVP_updatesDisabled {
    displayName: string;
    avatar?: string;
    status?: string;
}
export type WebhookRecord = {
    id: string;
    [index: string]: any;
};
export type WebhookUpdates = {
    recordBeforeUpdate: WebhookRecord;
    update: Partial<WebhookRecord>;
}[];
export interface WebhookCall {
    model: WebhookSupportedModel;
    message: string;
    type: CUD;
    event?: CalendarEvent & {
        id: string;
    };
    records: WebhookRecord[];
    updates?: WebhookUpdates;
    relatedRecords: {
        [index: string]: WebhookRecord;
    };
    timestamp: string;
    integrity: string;
    description?: string;
}
export type AutomationEventType = 'onJourneyStart' | 'afterAction' | "formResponse" | "formResponses" | "formUnsubmitted" | "formsUnsubmitted" | "ticketCompleted" | 'waitForTrigger' | "onCallOutcome" | "onAIDecision" | "onError";
interface AutomationEventBuilder<T extends AutomationEventType, V extends object> {
    type: T;
    info: V;
}
export type CommunicationsChannel = "Email" | "SMS" | "Chat";
export interface AutomationForJourney {
    journeyId: string;
}
export interface WithJourneyId {
    journeyId: string;
}
export interface AutomationForJourneyState {
    state: string;
}
export interface AutomationForJourneyAndState extends AutomationForJourney, AutomationForJourneyState {
}
export interface AutomationForAutomation {
    automationId: string;
}
export interface AutomationForForm {
    formId: string;
}
export interface WithFormId {
    formId: string;
}
export interface WithAutomationStepId {
    automationStepId: string;
}
export interface AutomationForTemplate {
    templateId: string;
}
export type SenderAssignmentStrategies = {
    'Care Team Primary': {
        type: 'Care Team Primary';
        info: {};
    };
    'Default': {
        type: 'Default';
        info: {};
    };
};
export type SenderAssignmentStrategyType = keyof SenderAssignmentStrategies;
export type SenderAssignmentStrategy = SenderAssignmentStrategies[SenderAssignmentStrategyType];
export interface AutomationForSender {
    assignment?: SenderAssignmentStrategy;
    senderId: string;
}
export interface AutomationForFormRequest extends AutomationForForm, AutomationForSender {
    channel?: CommunicationsChannel;
}
export interface AutomationForMessage extends AutomationForTemplate, AutomationForSender {
    sendToDestinationOfRelatedContactTypes?: string[];
    hiddenFromTimeline?: boolean;
}
export interface AutomationForWebhook {
    message: string;
    url?: string;
    secret?: string;
    fields?: LabeledField[];
    headers?: LabeledField[];
    method?: 'get' | 'patch' | 'post' | 'put' | 'delete';
    rawJSONBody?: string;
}
export type FormResponseAutomationEvent = AutomationEventBuilder<'formResponse', {
    automationStepId: string;
}>;
export type FormResponsesAutomationEvent = AutomationEventBuilder<'formResponses', {
    automationStepId: string;
}>;
export type UnitOfTime = "Seconds" | "Minutes" | "Hours" | "Days";
export type FormSubmitCancellationConditionInfo = {
    automationStepId: string;
};
export type CancelConditions = {
    formResponse: {
        type: 'formResponse';
        info: FormSubmitCancellationConditionInfo;
    };
    formResponses: {
        type: 'formResponses';
        info: FormSubmitCancellationConditionInfo & {
            unsubmittedFormCount: number;
        };
    };
};
export type CancelConditionType = keyof CancelConditions;
export type CancelCondition = CancelConditions[CancelConditionType];
export type AfterActionEventInfo = {
    automationStepId: string;
    delayInMS: number;
    delay: number;
    unit: UnitOfTime;
    officeHoursOnly?: boolean;
    useEnduserTimezone?: boolean;
    cancelConditions?: CancelCondition[];
    abTestCondition?: string;
};
export type TicketCompletedEventInfo = {
    automationStepId: string;
    closedForReason?: string;
};
export interface FormUnsubmittedEventInfo extends AfterActionEventInfo {
}
export type AfterActionAutomationEvent = AutomationEventBuilder<'afterAction', AfterActionEventInfo & {
    formCondition?: {
        formId: string;
        formFieldId: string;
        before?: boolean;
    };
    fieldCondition?: {
        field: string;
        before?: boolean;
    };
    eventCondition?: {
        before?: boolean;
    };
    dayOfMonthCondition?: {
        dayOfMonth: number;
        hour?: number;
        minute?: number;
    };
    skipIfDelayPassed?: boolean;
}>;
export type FormUnsubmittedEvent = AutomationEventBuilder<'formUnsubmitted', FormUnsubmittedEventInfo>;
export type FormsUnsubmittedEvent = AutomationEventBuilder<'formsUnsubmitted', FormUnsubmittedEventInfo>;
export type OnJourneyStartAutomationEvent = AutomationEventBuilder<'onJourneyStart', {}>;
export type TicketCompletedAutomationEvent = AutomationEventBuilder<'ticketCompleted', TicketCompletedEventInfo>;
export type WaitForTriggerAutomationEvent = AutomationEventBuilder<'waitForTrigger', {
    automationStepId: string;
    triggerId: string;
}>;
export type OnCallOutcomeAutomationEvent = AutomationEventBuilder<'onCallOutcome', {
    automationStepId: string;
    outcome: string;
}>;
export type OnAIDecisionAutomationEvent = AutomationEventBuilder<'onAIDecision', {
    automationStepId: string;
    outcomes: string[];
}>;
export type OnErrorEventInfo = {
    automationStepId: string;
};
export type OnErrorAutomationEvent = AutomationEventBuilder<'onError', OnErrorEventInfo>;
export type AutomationEventForType = {
    'onJourneyStart': OnJourneyStartAutomationEvent;
    'afterAction': AfterActionAutomationEvent;
    "formResponse": FormResponseAutomationEvent;
    "formResponses": FormResponsesAutomationEvent;
    'formUnsubmitted': FormUnsubmittedEvent;
    'formsUnsubmitted': FormsUnsubmittedEvent;
    'ticketCompleted': TicketCompletedAutomationEvent;
    'waitForTrigger': WaitForTriggerAutomationEvent;
    'onCallOutcome': OnCallOutcomeAutomationEvent;
    'onAIDecision': OnAIDecisionAutomationEvent;
    'onError': OnErrorAutomationEvent;
};
export type AutomationEvent = AutomationEventForType[keyof AutomationEventForType];
export type SetEnduserStatusInfo = {
    status: string;
};
interface AutomationActionBuilder<T extends string, V extends object> {
    type: T;
    info: V;
    continueOnError?: boolean;
    isBrandedWebhook?: boolean;
}
export type AssignToQueueInfo = {
    queueId: string;
    tags?: ListOfStringsWithQualifier;
};
export type CreateTicketAssignmentStrategies = {
    'care-team-random': {
        type: 'care-team-random';
        info: {};
    };
    'care-team-primary': {
        type: 'care-team-primary';
        info: {};
    };
    'by-tags': {
        type: 'by-tags';
        info: ListOfStringsWithQualifier;
    };
    'previous-owner': {
        type: 'previous-owner';
        info: {};
    };
    'queue': {
        type: 'queue';
        info: AssignToQueueInfo;
    };
    'Recently-Booked Appointment Host': {
        type: 'Recently-Booked Appointment Host';
        info: {};
    };
    'Form Submitter for Journey Trigger': {
        type: 'Form Submitter for Journey Trigger';
        info: {};
    };
    'default': {
        type: 'default';
        info: {};
    };
};
export type CreateTicketAssignmentStrategyType = keyof CreateTicketAssignmentStrategies;
export type CreateTicketAssignmentStrategy = CreateTicketAssignmentStrategies[CreateTicketAssignmentStrategyType];
export type CreateTicketActionInfo = {
    title: string;
    assignmentStrategy: CreateTicketAssignmentStrategy;
    defaultAssignee: string;
    restrictByState?: boolean;
    restrictByCareTeam?: boolean;
    closeReasons?: string[];
    forCarePlan?: boolean;
    hiddenFromTickets?: boolean;
    description?: string;
    htmlDescription?: string;
    actions?: TicketAction[];
    closeOnFinishedActions?: boolean;
    dueDateOffsetInMS?: number;
    skipDaysOfWeekForDueDate?: number[];
    requireConfirmation?: boolean;
    reminders?: TicketReminder[];
    priority?: number;
    preserveContext?: boolean;
    tags?: string[];
    contextFormIds?: string[];
    contextEnduserFields?: string[];
    contextContentIds?: string[];
    disableEditTitle?: boolean;
};
export type SendEmailAutomationAction = AutomationActionBuilder<'sendEmail', AutomationForMessage & {
    fromEmailOverride?: string;
    ccRelatedContactTypes?: string[];
}>;
export type NotifyTeamAutomationAction = AutomationActionBuilder<'notifyTeam', {
    templateId: string;
    forAssigned: boolean;
    roles?: string[];
    tags?: ListOfStringsWithQualifier;
}>;
export type SendSMSAutomationAction = AutomationActionBuilder<'sendSMS', AutomationForMessage>;
export type SendFormAutomationAction = AutomationActionBuilder<'sendForm', AutomationForFormRequest>;
export type PushFormsAutomationAction = AutomationActionBuilder<'pushFormsToPortal', {
    formIds: string[];
}>;
export type SetEnduserStatusAutomationAction = AutomationActionBuilder<'setEnduserStatus', SetEnduserStatusInfo>;
export type CreateTicketAutomationAction = AutomationActionBuilder<'createTicket', CreateTicketActionInfo>;
export type SendWebhookAutomationAction = AutomationActionBuilder<'sendWebhook', AutomationForWebhook>;
export type ShareContentAutomationAction = AutomationActionBuilder<'shareContent', {
    managedContentRecordIds: string[];
}>;
export type AddEnduserTagsAutomationAction = AutomationActionBuilder<'addEnduserTags', {
    tags: string[];
    replaceExisting?: boolean;
}>;
export type RemoveEnduserTagsAutomationAction = AutomationActionBuilder<'removeEnduserTags', {
    tags: string[];
}>;
export type AddToJourneyAutomationAction = AutomationActionBuilder<'addToJourney', {
    journeyId: string;
}>;
export type RemoveFromJourneyAutomationAction = AutomationActionBuilder<'removeFromJourney', {
    journeyId: string;
}>;
export type RemoveFromAllJourneysAutomationAction = AutomationActionBuilder<'removeFromAllJourneys', {}>;
export type IterableSendEmailAutomationAction = AutomationActionBuilder<'iterableSendEmail', {
    campaignId: string;
}>;
export type ZendeskCreateTicketAutomationAction = AutomationActionBuilder<'zendeskCreateTicket', {
    templateId: string;
    defaultSenderId: string;
}>;
export type CreateCarePlanAutomationAction = AutomationActionBuilder<'createCarePlan', {
    title: string;
    htmlDescription?: string;
    hideRemainingTicketsProgress?: boolean;
    highlightedEnduserFields?: string[];
    closeAutomaticallyByTicket?: boolean;
}>;
export type CompleteCarePlanAutomationAction = AutomationActionBuilder<'completeCarePlan', {}>;
export type ZusSyncAutomationAction = AutomationActionBuilder<'zusSync', {}>;
export type ZusPullAutomationAction = AutomationActionBuilder<'zusPull', {}>;
export type MetriportSyncAutomationAction = AutomationActionBuilder<'metriportSync', {
    facilityId: string;
    integrationTitle?: string;
}>;
export type ZusSubscribeAutomationAction = AutomationActionBuilder<'zusSubscribe', {
    practitionerId: string;
    packageIds: string[];
}>;
export type PagerDutyCreateIncidentAutomationAction = AutomationActionBuilder<'pagerDutyCreateIncident', {
    type: string;
    title: string;
    serviceId: string;
}>;
export type SmartMeterOrderLineItem = {
    quantity: number;
    sku: string;
};
export type SmartMeterPlaceOrderAutomationAction = AutomationActionBuilder<'smartMeterPlaceOrder', {
    lines: SmartMeterOrderLineItem[];
    shipping?: string;
}>;
export type SendChatAutomationAction = AutomationActionBuilder<'sendChat', {
    templateId: string;
    identifier: string;
    includeCareTeam?: boolean;
    userIds?: string[];
    sendToDestinationOfRelatedContactTypes?: string[];
}>;
export type HealthieSyncAutomationAction = AutomationActionBuilder<'healthieSync', {}>;
export type HealthieAddToCourseAutomationAction = AutomationActionBuilder<'healthieAddToCourse', {
    courseId: string;
}>;
export type HealthieSendChatAutomationAction = AutomationActionBuilder<'healthieSendChat', {
    templateId: string;
    identifier: string;
    includeCareTeam?: boolean;
}>;
export type CompleteTicketsAutomationAction = AutomationActionBuilder<'completeTickets', {
    journeyIds?: string[];
}>;
export type ChangeContactTypeAutomationAction = AutomationActionBuilder<'changeContactType', {
    type: string;
}>;
export type ActiveCampaignSyncAutomationAction = AutomationActionBuilder<'activeCampaignSync', {}>;
export type ActiveCampaignAddToListsAutomationAction = AutomationActionBuilder<'activeCampaignAddToLists', {
    listIds: string[];
}>;
export type SwitchToRelatedContactAutomationAction = AutomationActionBuilder<'switchToRelatedContact', {
    type: string;
    otherTypes?: string[];
}>;
export type ElationSyncAutomationAction = AutomationActionBuilder<'elationSync', {}>;
export type AthenaSyncAutomationAction = AutomationActionBuilder<'athenaSync', {
    departmentid: string;
}>;
export type CanvasSyncAutomationAction = AutomationActionBuilder<'canvasSync', {}>;
export type CanvasCreateNoteAutomationAction = AutomationActionBuilder<'canvasCreateNote', {
    formIds: string[];
    matchCareTeamTagsForCanvasPractitionerResolution: ListOfStringsWithQualifier;
    noteCoding: CanvasCoding;
}>;
export type CancelFutureAppointmentsAutomationAction = AutomationActionBuilder<'cancelFutureAppointments', {}>;
export type DevelopHealthMedicationEligibilityAutomationAction = AutomationActionBuilder<'developHealthMedEligibility', {
    drugs: DevelopHealthDrug[];
    diagnoses: DevelopHealthDiagnosis[];
    providerUserId: string;
    mock_result?: DevelopHealthMockResult;
}>;
export type IterableFieldsMapping = {
    iterable: string;
    tellescope: string;
};
export type IterableCustomEventAutomationAction = AutomationActionBuilder<'iterableCustomEvent', {
    eventName: string;
    description: string;
    dataFieldsMapping?: IterableFieldsMapping[];
    environment?: string;
    customEmailField?: string;
}>;
export type AddAccessTagsAutomationAction = AutomationActionBuilder<'addAccessTags', {
    tags: string[];
    replaceExisting?: boolean;
}>;
export type RemoveAccessTagsAutomationAction = AutomationActionBuilder<'removeAccessTags', {
    tags: string[];
}>;
export type EnduserFieldSetterType = 'Custom Value' | 'Current Timestamp' | 'Current Date' | "Increment Number";
export type EnduserFieldSetter = {
    name: string;
    type: EnduserFieldSetterType;
    value: string;
    increment?: number;
};
export type SetEnduserFieldsAutomationAction = AutomationActionBuilder<'setEnduserFields', {
    fields: EnduserFieldSetter[];
}>;
export type CustomerIOIdentifyAction = AutomationActionBuilder<'customerIOIdentify', {}>;
export type CustomerIOTrackAction = AutomationActionBuilder<'customerIOTrack', {
    event: string;
    trackProperties?: string[];
}>;
export type CancelCurrentEventAction = AutomationActionBuilder<'cancelCurrentEvent', {}>;
export type ConfirmCurrentEventAction = AutomationActionBuilder<'confirmCurrentEvent', {}>;
export type AutomationConditionType = 'atJourneyState';
export type AutomationConditionBuilder<T extends AutomationConditionType, V extends object> = {
    type: T;
    info: V;
};
export type AtJourneyStateAutomationCondition = AutomationConditionBuilder<'atJourneyState', AutomationForJourneyAndState>;
export type AutomationCondition = AtJourneyStateAutomationCondition;
export type OutboundCallAutomationAction = AutomationActionBuilder<'outboundCall', {
    treeId: string;
}>;
export type RemoveCareTeamAutomationAction = AutomationActionBuilder<'removeCareTeam', AutomationTriggerActions['Remove Care Team']['info']>;
export type AssignCareTeamAutomationAction = AutomationActionBuilder<'assignCareTeam', AutomationTriggerActions['Assign Care Team']['info']>;
export type CallUserAutomationAction = AutomationActionBuilder<'callUser', {
    message: string;
    routeBy: "Appointment Host";
}>;
export type StripeChargeCardOnFileAutomationAction = AutomationActionBuilder<'stripeChargeCardOnFile', {
    stripeKey?: string;
    priceIds: string[];
    productIds?: string[];
    subscriptionPriceId?: string;
}>;
export type AIContextSource = {
    type: "Email" | "SMS";
    limit: number;
};
export type AIDecisionAutomationAction = AutomationActionBuilder<'aiDecision', {
    prompt: string;
    sources: AIContextSource[];
    outcomes: string[];
}>;
export type AssignInboxItemAutomationAction = AutomationActionBuilder<'assignInboxItem', {
    tags: ListOfStringsWithQualifier;
    limit: number;
}>;
export type AutomationActionForType = {
    'aiDecision': AIDecisionAutomationAction;
    'assignInboxItem': AssignInboxItemAutomationAction;
    'stripeChargeCardOnFile': StripeChargeCardOnFileAutomationAction;
    'outboundCall': OutboundCallAutomationAction;
    "sendEmail": SendEmailAutomationAction;
    "sendSMS": SendSMSAutomationAction;
    "sendChat": SendChatAutomationAction;
    "sendForm": SendFormAutomationAction;
    "createTicket": CreateTicketAutomationAction;
    'sendWebhook': SendWebhookAutomationAction;
    'setEnduserStatus': SetEnduserStatusAutomationAction;
    'setEnduserFields': SetEnduserFieldsAutomationAction;
    'shareContent': ShareContentAutomationAction;
    'notifyTeam': NotifyTeamAutomationAction;
    'addEnduserTags': AddEnduserTagsAutomationAction;
    'removeEnduserTags': RemoveEnduserTagsAutomationAction;
    'addAccessTags': AddAccessTagsAutomationAction;
    'removeAccessTags': RemoveAccessTagsAutomationAction;
    'addToJourney': AddToJourneyAutomationAction;
    'removeFromJourney': RemoveFromJourneyAutomationAction;
    removeFromAllJourneys: RemoveFromAllJourneysAutomationAction;
    'iterableSendEmail': IterableSendEmailAutomationAction;
    'iterableCustomEvent': IterableCustomEventAutomationAction;
    'zendeskCreateTicket': ZendeskCreateTicketAutomationAction;
    'createCarePlan': CreateCarePlanAutomationAction;
    'completeCarePlan': CompleteCarePlanAutomationAction;
    'zusSync': ZusSyncAutomationAction;
    'zusPull': ZusPullAutomationAction;
    'metriportSync': MetriportSyncAutomationAction;
    'zusSubscribe': ZusSubscribeAutomationAction;
    'pagerDutyCreateIncident': PagerDutyCreateIncidentAutomationAction;
    'smartMeterPlaceOrder': SmartMeterPlaceOrderAutomationAction;
    'healthieSync': HealthieSyncAutomationAction;
    healthieAddToCourse: HealthieAddToCourseAutomationAction;
    healthieSendChat: HealthieSendChatAutomationAction;
    'completeTickets': CompleteTicketsAutomationAction;
    'changeContactType': ChangeContactTypeAutomationAction;
    activeCampaignSync: ActiveCampaignSyncAutomationAction;
    activeCampaignAddToLists: ActiveCampaignAddToListsAutomationAction;
    switchToRelatedContact: SwitchToRelatedContactAutomationAction;
    'elationSync': ElationSyncAutomationAction;
    'athenaSync': AthenaSyncAutomationAction;
    canvasSync: CanvasSyncAutomationAction;
    canvasCreateNote: CanvasCreateNoteAutomationAction;
    pushFormsToPortal: PushFormsAutomationAction;
    developHealthMedEligibility: DevelopHealthMedicationEligibilityAutomationAction;
    cancelFutureAppointments: CancelFutureAppointmentsAutomationAction;
    customerIOIdentify: CustomerIOIdentifyAction;
    customerIOTrack: CustomerIOTrackAction;
    cancelCurrentEvent: CancelCurrentEventAction;
    confirmCurrentEvent: ConfirmCurrentEventAction;
    removeCareTeam: RemoveCareTeamAutomationAction;
    assignCareTeam: AssignCareTeamAutomationAction;
    callUser: CallUserAutomationAction;
};
export type AutomationActionType = keyof AutomationActionForType;
export type AutomationAction = AutomationActionForType[AutomationActionType];
export type BrandedWebhookActions = "Puppeteer: Start Agent";
export interface AutomationStep_readonly extends ClientRecord {
}
export interface AutomationStep_required {
    events: AutomationEvent[];
    conditions?: AutomationCondition[];
    enduserConditions?: Record<any, any>;
    action: AutomationAction;
}
export interface AutomationStep_updatesDisabled {
}
export interface AutomationStep extends AutomationStep_readonly, AutomationStep_required, AutomationStep_updatesDisabled {
    journeyId: string;
    flowchartUI?: FlowchartUI;
    continueOnError?: boolean;
    tags?: string[];
}
export type RelatedRecord = {
    type: string;
    id: string;
    creator?: string;
    environment?: string;
};
export interface UserNotification_readonly extends ClientRecord {
}
export interface UserNotification_required {
    userId: string;
    type: string;
    message: string;
}
export interface UserNotification_updatesDisabled {
}
export interface UserNotification extends UserNotification_readonly, UserNotification_required, UserNotification_updatesDisabled {
    read?: boolean;
    relatedRecords?: RelatedRecord[];
}
export type ObservationValue = {
    value: number;
    unit: string;
};
export type ObservationStatusCode = ('registered' | 'preliminary' | 'final' | 'amended' | 'corrected' | 'cancelled' | 'entered-in-error' | 'unknown');
export type ObservationCategory = 'vital-signs';
export interface EnduserObservation_readonly extends ClientRecord {
}
export interface EnduserObservation_required {
    status: ObservationStatusCode;
    category: ObservationCategory;
    enduserId: string;
    measurement: ObservationValue;
}
export interface EnduserObservation_updatesDisabled {
}
export interface EnduserObservation extends EnduserObservation_readonly, EnduserObservation_required, EnduserObservation_updatesDisabled {
    recordedAt?: Date;
    timestamp: Date;
    code?: string;
    type?: string;
    source?: string;
    notes?: string;
    externalId?: string;
    deviceId?: string;
    references?: RelatedRecord[];
    reviewedAt?: Date;
    reviewedBy?: string;
    statusChangedBy?: string;
    classifications?: {
        configurationId: string;
        classification: string;
    }[];
    beforeMeal?: boolean;
    medStatus?: string;
    timestampIsEstimated?: boolean;
    dontTrigger?: boolean;
    showWithPlotsByUnit?: string[];
    invalidationReason?: string;
    excludeFromVitalCountLookback?: boolean;
}
export type BlockType = 'h1' | 'h2' | 'html' | 'image' | 'youtube' | 'pdf' | 'iframe' | 'content-link';
export type BlockStyle = {
    width?: number;
    height?: number;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    textColor?: string;
};
export type ContentBlockBuilder<BLOCK extends BlockType, INFO extends object> = {
    type: BLOCK;
    info: INFO;
    style?: BlockStyle;
};
export type BlockContentText = {
    text: string;
};
export type BlockContentMedia = {
    link: string;
    name?: string;
    alt?: string;
    height?: number;
    maxHeight?: number;
    width?: number;
    maxWidth?: number;
};
export type BlockContentH1 = ContentBlockBuilder<'h1', BlockContentText>;
export type BlockContentH2 = ContentBlockBuilder<'h2', BlockContentText>;
export type BlockContentHTML = ContentBlockBuilder<'html', {
    html: string;
}>;
export type BlockContentImage = ContentBlockBuilder<'image', BlockContentMedia>;
export type BlockContentPDF = ContentBlockBuilder<'pdf', BlockContentMedia>;
export type BlockContentYoutube = ContentBlockBuilder<'youtube', BlockContentMedia>;
export type BlockContentIFrame = ContentBlockBuilder<'iframe', BlockContentMedia>;
export type BlockContentLink = ContentBlockBuilder<'content-link', {
    recordId: string;
}>;
export type Block = (BlockContentYoutube | BlockContentPDF | BlockContentImage | BlockContentHTML | BlockContentH1 | BlockContentH2 | BlockContentIFrame | BlockContentLink);
export declare const TEXT_EMBEDDING_ADA_002 = "text-embedding-ada-002";
export declare const EmbeddingInfo: {
    "text-embedding-ada-002": {
        maxTokens: number;
    };
};
export type EmbeddingType = keyof typeof EmbeddingInfo;
export type ManagedContentRecordType = 'Article' | 'PDF' | 'Video';
export type ManagedContentRecordAssignmentType = 'All' | "By Tags" | 'Manual' | 'Individual';
export interface ManagedContentRecord_readonly extends ClientRecord {
}
export interface ManagedContentRecord_required {
    title: string;
    textContent: string;
    htmlContent: string;
}
export interface ManagedContentRecord_updatesDisabled {
    type?: ManagedContentRecordType;
}
export interface ManagedContentRecord extends ManagedContentRecord_readonly, ManagedContentRecord_required, ManagedContentRecord_updatesDisabled {
    index?: number;
    headerPhoto?: string;
    publicRead?: boolean;
    allowUnauthenticatedAccess?: boolean;
    slug?: string;
    description?: string;
    blocks?: Block[];
    tags?: string[];
    files?: string[];
    category?: string;
    editorState?: string;
    enduserId?: string;
    mode?: MessageTemplateMode;
    attachments?: ChatAttachment[];
    assignmentType?: ManagedContentRecordAssignmentType;
    embedding?: number[];
    embeddingHash?: string;
    embeddingType?: EmbeddingType;
    forInternalUse?: boolean;
    portalIndex?: number;
}
export interface ManagedContentRecordAssignment_readonly extends ClientRecord {
}
export interface ManagedContentRecordAssignment_required {
    contentId: string;
    enduserId: string;
}
export interface ManagedContentRecordAssignment_updatesDisabled {
}
export interface ManagedContentRecordAssignment extends ManagedContentRecordAssignment_readonly, ManagedContentRecordAssignment_required, ManagedContentRecordAssignment_updatesDisabled {
}
export type PortalPage = "Home" | "Care Plan" | "Documents" | "Education" | "My Events" | "Community" | "Communications" | "Appointment Booking" | "Orders" | "Vitals";
type BuildPortalBlockInfo<T, I> = {
    type: T;
    info: I;
};
export type CareTeamMemberPortalCustomizationInfo = {
    title: string;
    role?: string;
};
export type PortalBlockForType = {
    careTeam: BuildPortalBlockInfo<'careTeam', {
        title: string;
        roles?: string[];
        showAll?: boolean;
        hideContactButton?: boolean;
    }>;
    carePlan: BuildPortalBlockInfo<'carePlan', {}>;
    education: BuildPortalBlockInfo<'education', {}>;
    Events: BuildPortalBlockInfo<'Events', {}>;
    text: BuildPortalBlockInfo<'text', {
        text: string;
    }>;
    chat: BuildPortalBlockInfo<'chat', {}>;
    "Orders": BuildPortalBlockInfo<'Orders', {}>;
    "Manage Subscription Button": BuildPortalBlockInfo<'Manage Subscription Button', {}>;
    HTML: BuildPortalBlockInfo<'HTML', {
        html: string;
    }>;
    pinnedForms: BuildPortalBlockInfo<'pinnedForms', {
        title?: string;
        formIds?: string[];
    }>;
};
export type PortalBlockType = keyof PortalBlockForType;
export type PortalBlock = PortalBlockForType[PortalBlockType];
export interface PortalCustomization_readonly extends ClientRecord {
}
export interface PortalCustomization_required {
    page: PortalPage | string;
}
export interface PortalCustomization_updatesDisabled {
}
export interface PortalCustomization extends PortalCustomization_readonly, PortalCustomization_required, PortalCustomization_updatesDisabled {
    blocks: PortalBlock[];
    title?: string;
    disabled?: boolean;
    mobileBottomNavigationPosition?: number;
    headerImageURL?: string;
    iframeURL?: string;
    iconURL?: string;
    activeIconURL?: string;
    showStripePortalLink?: boolean;
    hideCancellatation?: boolean;
    hideReschedule?: boolean;
    hiddenEventTitles?: string[];
    hiddenFormIds?: string[];
    brandId?: string;
}
export declare const MOBILE_BOTTOM_NAVIGATION_DISABLED_POSITION = 1000;
export declare const DEFAULT_PATIENT_PORTAL_BOTTOM_NAVIGATION_POSITIONS: {
    [K in PortalPage]: number;
};
export interface Forum_readonly extends ClientRecord {
}
export interface Forum_required {
    title: string;
}
export interface Forum_updatesDisabled {
}
export interface Forum extends Forum_readonly, Forum_required, Forum_updatesDisabled {
    slug?: string;
    description?: string;
    publicRead?: boolean;
}
export interface ForumPost_readonly extends ClientRecord {
}
export interface ForumPost_required {
    forumId: string;
    title: string;
    textContent: string;
    htmlContent: string;
    editorState?: string;
}
export interface ForumPost_updatesDisabled {
    numLikes: number;
    numComments: number;
}
export interface ForumPost extends ForumPost_readonly, ForumPost_required, ForumPost_updatesDisabled {
    postedBy: UserIdentity;
    slug?: string;
    description?: string;
    attachments?: ChatAttachment[];
}
export interface PostLike_readonly extends ClientRecord {
}
export interface PostLike_required {
    forumId: string;
    postId: string;
}
export interface PostLike_updatesDisabled {
}
export interface PostLike extends PostLike_readonly, PostLike_required, PostLike_updatesDisabled {
}
export interface PostComment_readonly extends ClientRecord {
}
export interface PostComment_required {
    forumId: string;
    postId: string;
    textContent: string;
    htmlContent: string;
    editorState?: string;
}
export interface PostComment_updatesDisabled {
    numLikes?: number;
    numReplies?: number;
}
export interface PostComment extends PostComment_readonly, PostComment_required, PostComment_updatesDisabled {
    postedBy: UserIdentity;
    threadId?: string;
    replyTo?: string;
    attachments?: string[];
}
export interface CommentLike_readonly extends ClientRecord {
}
export interface CommentLike_required {
    forumId: string;
    postId: string;
    commentId: string;
}
export interface CommentLike_updatesDisabled {
}
export interface CommentLike extends CommentLike_readonly, CommentLike_required, CommentLike_updatesDisabled {
}
export type AutomatedActionStatus = 'active' | 'finished' | 'cancelled' | 'error';
export interface AutomatedAction_readonly extends ClientRecord {
    source?: string;
    triggerId?: string;
    lockedAt?: number;
    lockId?: string;
    lockCount?: number;
    processedAt?: Date;
}
export interface AutomatedAction_required {
    enduserId: string;
    automationStepId: string;
    journeyId: string;
    event: AutomationEvent;
    action: AutomationAction;
    status: AutomatedActionStatus;
    cancelReason?: number;
    cancelConditions?: CancelCondition[];
    processAfter: number;
    didDelayForOutOfOffice?: boolean;
    errorMessage?: string;
    enduserConditions?: Record<any, any>;
}
export interface AutomatedAction_updatesDisabled {
}
export interface AutomatedAction extends AutomatedAction_readonly, AutomatedAction_required, AutomatedAction_updatesDisabled {
    isNOP?: boolean;
    cancelledBy?: string;
    journeyContext?: JourneyContext;
}
export interface UserLog_readonly extends ClientRecord {
    userId: string;
    resource: string;
    resourceId: string;
    action: CUD;
}
export interface UserLog_required {
}
export interface UserLog_updatesDisabled {
}
export interface UserLog extends UserLog_readonly, UserLog_required, UserLog_updatesDisabled {
    info?: Indexable;
    enduserId?: string;
    note?: string;
}
export interface EnduserTask_readonly extends ClientRecord {
}
export interface EnduserTask_required {
    title: string;
}
export interface EnduserTask_updatesDisabled {
}
export interface EnduserTask extends EnduserTask_readonly, EnduserTask_required, EnduserTask_updatesDisabled {
    enduserId: string;
    description?: string;
    completedAt?: Date;
}
export interface FaxLog_readonly extends ClientRecord {
}
export interface FaxLog_required {
    externalId: string;
    source: string;
    from: string;
    to: string;
    fileId: string;
    inbound: boolean;
    title: string;
}
export interface FaxLog_updatesDisabled {
}
export interface FaxLog extends FaxLog_readonly, FaxLog_required, FaxLog_updatesDisabled {
    userId?: string;
    enduserId?: string;
    status?: string;
    errorMessage?: string;
    pageCount?: string;
    tags?: string[];
}
export interface CarePlan_readonly extends ClientRecord {
}
export interface CarePlan_required {
    title: string;
}
export interface CarePlan_updatesDisabled {
}
export interface CarePlan extends CarePlan_readonly, CarePlan_required, CarePlan_updatesDisabled {
    enduserId: string;
    description?: string;
    htmlDescription?: string;
    eventIds?: string[];
    journeyId?: string;
    completedAt?: Date | '';
    hideRemainingTicketsProgress?: boolean;
    highlightedEnduserFields?: string[];
    closeAutomaticallyByTicket?: boolean;
}
export type TypedField = {
    type?: string;
    field?: string;
};
export type UserUIRestrictions = {
    hideDashboard?: boolean;
    hideInbox?: boolean;
    hideTeamChat?: boolean;
    hideEnduserChat?: boolean;
    disableTicketDueDate?: boolean;
    disableUnstructuredNotes?: boolean;
    hiddenFields?: TypedField[];
    disabledFields?: TypedField[];
    hideCareplan?: boolean;
    hideUnsubmittedForms?: boolean;
    hideMergeEndusers?: boolean;
    hideQueuedTicketsViewer?: boolean;
    hideIncomingFaxesIcon?: boolean;
    hideNotificationsIcon?: boolean;
    hideBulkEnduserActions?: boolean;
    visibleIntegrations?: string[];
};
export interface RoleBasedAccessPermission_readonly extends ClientRecord {
}
export interface RoleBasedAccessPermission_required {
    role: string;
    permissions: Partial<AccessPermissions>;
    uiRestrictions?: UserUIRestrictions;
}
export interface RoleBasedAccessPermission_updatesDisabled {
}
export interface RoleBasedAccessPermission extends RoleBasedAccessPermission_readonly, RoleBasedAccessPermission_required, RoleBasedAccessPermission_updatesDisabled {
}
export interface PhoneCall_readonly extends ClientRecord {
}
export interface PhoneCall_required {
}
export interface PhoneCall_updatesDisabled {
}
export interface PhoneCall extends PhoneCall_readonly, PhoneCall_required, PhoneCall_updatesDisabled {
    markedUnreadForAll?: boolean;
    inboxStatus?: string;
    enduserId: string;
    externalId: string;
    from: string;
    to: string;
    inbound: boolean;
    isVoicemail?: boolean;
    callDurationInSeconds?: number;
    recordingURI?: string;
    recordingId?: string;
    recordingDurationInSeconds?: number;
    transcriptionId?: string;
    conferenceId?: string;
    externalConferenceId?: string;
    conferenceAttendees?: (string[]) | (string[][]);
    unread?: boolean;
    transcription?: string;
    recordingTranscriptionData?: string;
    note?: string;
    userId?: string;
    pinnedAt?: Date | '';
    readBy?: {
        [index: string]: Date | '';
    };
    hiddenBy?: {
        [index: string]: Date | '';
    };
    hiddenForAll?: boolean;
    ticketIds?: string[];
    tags?: string[];
    inputs?: string[];
    answeredAt?: Date;
    recordingCancelledAt?: Date;
    assignedTo?: string[];
    timestamp?: Date;
    dialedUserIds?: string[][];
    ignoredUserIds?: string[][];
    ticketId?: string;
    hungUpByCaller?: boolean;
}
export type AnalyticsQueryResultValue = {
    key?: string;
    timestamp?: Date;
    unit?: string;
    value: number;
    numerator?: number;
    denominator?: number;
    userId?: string;
};
export type AnalyticsQueryResult = {
    count?: number;
    percentage?: string;
    values?: AnalyticsQueryResultValue[];
};
export type DateRange = {
    from?: Date | '';
    to?: Date | '';
};
type AnalyticsQueryInfoBuilder<M extends string, P extends object | undefined> = {
    method: M;
    parameters: P;
};
export type AnalyticsQueryInfoForType = {
    "Endusers": {
        Total: AnalyticsQueryInfoBuilder<'Total', undefined>;
        "Sum of Field": AnalyticsQueryInfoBuilder<"Sum of Field", {
            field: string;
        }>;
    };
    "Calendar Events": {
        Total: AnalyticsQueryInfoBuilder<'Total', undefined>;
    };
    "Form Responses": {
        Total: AnalyticsQueryInfoBuilder<'Total', undefined>;
    };
    "Purchases": {
        Total: AnalyticsQueryInfoBuilder<'Total', undefined>;
    };
    "Purchase Credits": {
        Total: AnalyticsQueryInfoBuilder<'Total', undefined>;
    };
    "Tickets": {
        Total: AnalyticsQueryInfoBuilder<'Total', undefined>;
    };
    "Emails": {
        Total: AnalyticsQueryInfoBuilder<'Total', undefined>;
    };
    "Files": {
        Total: AnalyticsQueryInfoBuilder<'Total', undefined>;
    };
    "SMS Messages": {
        Total: AnalyticsQueryInfoBuilder<'Total', undefined>;
    };
    "Medications": {
        Total: AnalyticsQueryInfoBuilder<'Total', undefined>;
    };
    "Phone Calls": {
        Total: AnalyticsQueryInfoBuilder<'Total', undefined>;
        Duration: AnalyticsQueryInfoBuilder<'Duration', undefined>;
    };
    "Meetings": {
        Total: AnalyticsQueryInfoBuilder<'Total', undefined>;
        Duration: AnalyticsQueryInfoBuilder<'Duration', undefined>;
    };
    "Journey Logs": {
        Total: AnalyticsQueryInfoBuilder<'Total', undefined>;
    };
    "Orders": {
        Total: AnalyticsQueryInfoBuilder<'Total', undefined>;
    };
    "Chat Rooms": {
        Total: AnalyticsQueryInfoBuilder<'Total', undefined>;
    };
    "Chats": {
        Total: AnalyticsQueryInfoBuilder<'Total', undefined>;
    };
};
export type AnalyticsQueryInfoType = keyof AnalyticsQueryInfoForType;
export type AnalyticsQueryInfo = AnalyticsQueryInfoForType[AnalyticsQueryInfoType];
export type ListQueryQualifier = 'All Of' | 'One Of';
export type AnalyticsEnduserFilterField = {
    key: string;
    value: string;
    operator?: string;
    range?: DateRange | '';
};
export type AnalyticsQueryFilterForType = {
    "Endusers": {
        activeSince?: Date | '';
        "Contacted Since"?: Date | '';
        "Submitted Forms"?: {
            qualifier: ListQueryQualifier;
            formIds: string[];
            formResponseCondition?: CompoundFilter<string>;
        };
        fields?: AnalyticsEnduserFilterField[];
        gender?: TellescopeGender;
        assignedTo?: {
            qualifier: ListQueryQualifier;
            userIds: string[];
        };
        born?: DateRange;
        tags?: ListOfStringsWithQualifier;
        entityTypes?: string[];
    };
    "Calendar Events": {
        userIds?: string[];
        templateIds?: string[];
        starts?: DateRange;
        wasSelfScheduled?: boolean;
        wasCancelled?: boolean;
        wasCompleted?: boolean;
        wasRescheduled?: boolean;
        wasNoShowed?: boolean;
        scheduledBy?: string;
    };
    "Form Responses": {
        formIds?: string[];
        formResponseCondition?: CompoundFilter<string>;
        tags?: ListOfStringsWithQualifier;
    };
    "Purchases": {
        titles?: string[];
    };
    "Purchase Credits": {};
    "Tickets": {
        titles?: string[];
        closeReasons?: string[];
        userTags?: ListOfStringsWithQualifier;
        enduserFields?: AnalyticsEnduserFilterField[];
        closedAtRange?: DateRange;
    };
    "Phone Calls": {};
    "Meetings": {};
    "SMS Messages": {
        direction?: string;
        messages?: string[];
        "SMS Tags"?: ListOfStringsWithQualifier;
    };
    Emails: {
        direction?: "Inbound" | "Outbound" | "Both";
        templateIds?: string[];
        subjects?: string[];
        "Email Tags"?: ListOfStringsWithQualifier;
    };
    Medications: {};
    Files: {
        names?: string[];
    };
    "Journey Logs": {
        automationStepIds?: string[];
    };
    Orders: {};
    "Chat Rooms": {};
    "Chats": {};
};
export type EnduserGrouping = {
    Field?: string;
    Gender?: boolean;
    "Assigned To"?: boolean;
    Tags?: boolean;
    Age?: boolean;
    Phone?: boolean;
    State?: string;
};
export type AnalyticsQueryGroupingForType = {
    "Endusers": EnduserGrouping;
    "Calendar Events": {
        Type: boolean;
        "Scheduled By"?: boolean;
        "Completed By"?: boolean;
        alsoGroupByHost?: boolean;
        "Cancel Reason"?: boolean;
    } & EnduserGrouping & {
        Enduser: string;
    };
    "Form Responses": {
        "Submitted By"?: boolean;
        "Submission Status"?: boolean;
        "Public Identifier"?: boolean;
    } & EnduserGrouping & {
        Enduser: string;
    };
    "Purchases": {
        Title?: boolean;
        Cost?: boolean;
    } & EnduserGrouping & {
        Enduser: string;
    };
    "Purchase Credits": {} & EnduserGrouping & {
        Enduser: string;
    };
    "Tickets": {
        Owner?: boolean;
        Title?: boolean;
        Outcome?: boolean;
    } & EnduserGrouping & {
        Enduser: string;
    };
    "Phone Calls": {} & EnduserGrouping & {
        Enduser: string;
    };
    "SMS Messages": {
        "SMS Tags"?: boolean;
        Score?: boolean;
    } & EnduserGrouping & {
        Enduser: string;
    };
    "Emails": {
        "Email Tags"?: boolean;
    } & EnduserGrouping & {
        Enduser: string;
    };
    "Medications": {} & EnduserGrouping & {
        Enduser: string;
    };
    "Files": {} & EnduserGrouping & {
        Enduser: string;
    };
    "Journey Logs": {} & EnduserGrouping & {
        Enduser: string;
    };
    "Meetings": {
        Host?: boolean;
    };
    "Orders": {} & EnduserGrouping & {
        Enduser: string;
    };
    "Chat Rooms": {} & EnduserGrouping & {
        Enduser: string;
    };
    "Chats": {} & EnduserGrouping & {
        Enduser: string;
    };
};
type DefaultRangeKey = 'Created At' | 'Updated At';
export type AnalyticsQueryRangeKeyForType = {
    "Endusers": DefaultRangeKey;
    "Calendar Events": DefaultRangeKey;
    "Form Responses": DefaultRangeKey | "Submitted At";
    "Purchases": DefaultRangeKey;
    "Purchase Credits": DefaultRangeKey;
    "Tickets": DefaultRangeKey | "Closed At";
    "Phone Calls": DefaultRangeKey;
    "SMS Messages": DefaultRangeKey;
    "Emails": DefaultRangeKey;
    "Medications": DefaultRangeKey;
    "Files": DefaultRangeKey;
    "Meetings": DefaultRangeKey;
    "Journey Logs": DefaultRangeKey;
    "Orders": DefaultRangeKey;
    "Chat Rooms": DefaultRangeKey;
    "Chats": DefaultRangeKey;
};
export type RangeKey = DefaultRangeKey | 'Submitted At' | "Closed At";
export type AnalyticsQueryRangeInterval = 'Hourly' | 'Daily' | 'Weekly' | 'Monthly';
export type AnalyticsQueryRange<R> = {
    interval: AnalyticsQueryRangeInterval;
    key: R;
};
type AnalyticsQueryBuilder<T extends keyof AnalyticsQueryInfoForType, M, F, G, R> = {
    resource: T;
    info: M;
    filter?: F;
    grouping?: G;
    range?: AnalyticsQueryRange<R>;
};
export type AnalyticsQueryForType = {
    "Endusers": AnalyticsQueryBuilder<"Endusers", AnalyticsQueryInfoForType['Endusers'][keyof AnalyticsQueryInfoForType['Endusers']], AnalyticsQueryFilterForType['Endusers'], AnalyticsQueryGroupingForType['Endusers'], AnalyticsQueryRangeKeyForType['Endusers']>;
    "Calendar Events": AnalyticsQueryBuilder<"Calendar Events", AnalyticsQueryInfoForType['Calendar Events'][keyof AnalyticsQueryInfoForType['Calendar Events']], AnalyticsQueryFilterForType['Calendar Events'], AnalyticsQueryGroupingForType['Calendar Events'], AnalyticsQueryRangeKeyForType['Calendar Events']>;
    "Form Responses": AnalyticsQueryBuilder<"Form Responses", AnalyticsQueryInfoForType['Form Responses'][keyof AnalyticsQueryInfoForType['Form Responses']], AnalyticsQueryFilterForType['Form Responses'], AnalyticsQueryGroupingForType['Form Responses'], AnalyticsQueryRangeKeyForType['Form Responses']>;
    "Purchases": AnalyticsQueryBuilder<"Purchases", AnalyticsQueryInfoForType['Purchases'][keyof AnalyticsQueryInfoForType['Purchases']], AnalyticsQueryFilterForType['Purchases'], AnalyticsQueryGroupingForType['Purchases'], AnalyticsQueryRangeKeyForType['Purchases']>;
    "Purchase Credits": AnalyticsQueryBuilder<"Purchase Credits", AnalyticsQueryInfoForType['Purchase Credits'][keyof AnalyticsQueryInfoForType['Purchase Credits']], AnalyticsQueryFilterForType['Purchase Credits'], AnalyticsQueryGroupingForType['Purchase Credits'], AnalyticsQueryRangeKeyForType['Purchase Credits']>;
    "Tickets": AnalyticsQueryBuilder<"Tickets", AnalyticsQueryInfoForType['Tickets'][keyof AnalyticsQueryInfoForType['Tickets']], AnalyticsQueryFilterForType['Tickets'], AnalyticsQueryGroupingForType['Tickets'], AnalyticsQueryRangeKeyForType['Tickets']>;
    "Phone Calls": AnalyticsQueryBuilder<"Phone Calls", AnalyticsQueryInfoForType['Phone Calls'][keyof AnalyticsQueryInfoForType['Phone Calls']], AnalyticsQueryFilterForType['Phone Calls'], AnalyticsQueryGroupingForType['Phone Calls'], AnalyticsQueryRangeKeyForType['Phone Calls']>;
    "Emails": AnalyticsQueryBuilder<"Emails", AnalyticsQueryInfoForType['Emails'][keyof AnalyticsQueryInfoForType['Emails']], AnalyticsQueryFilterForType['Emails'], AnalyticsQueryGroupingForType['Emails'], AnalyticsQueryRangeKeyForType['Emails']>;
    "SMS Messages": AnalyticsQueryBuilder<"SMS Messages", AnalyticsQueryInfoForType['SMS Messages'][keyof AnalyticsQueryInfoForType['SMS Messages']], AnalyticsQueryFilterForType['SMS Messages'], AnalyticsQueryGroupingForType['SMS Messages'], AnalyticsQueryRangeKeyForType['SMS Messages']>;
    "Medications": AnalyticsQueryBuilder<"Medications", AnalyticsQueryInfoForType['Medications'][keyof AnalyticsQueryInfoForType['Medications']], AnalyticsQueryFilterForType['Medications'], AnalyticsQueryGroupingForType['Medications'], AnalyticsQueryRangeKeyForType['Medications']>;
    "Files": AnalyticsQueryBuilder<"Files", AnalyticsQueryInfoForType['Files'][keyof AnalyticsQueryInfoForType['Files']], AnalyticsQueryFilterForType['Files'], AnalyticsQueryGroupingForType['Files'], AnalyticsQueryRangeKeyForType['Files']>;
    "Meetings": AnalyticsQueryBuilder<"Meetings", AnalyticsQueryInfoForType['Meetings'][keyof AnalyticsQueryInfoForType['Meetings']], AnalyticsQueryFilterForType['Meetings'], AnalyticsQueryGroupingForType['Meetings'], AnalyticsQueryRangeKeyForType['Meetings']>;
    "Journey Logs": AnalyticsQueryBuilder<"Journey Logs", AnalyticsQueryInfoForType['Journey Logs'][keyof AnalyticsQueryInfoForType['Journey Logs']], AnalyticsQueryFilterForType['Journey Logs'], AnalyticsQueryGroupingForType['Journey Logs'], AnalyticsQueryRangeKeyForType['Journey Logs']>;
    "Orders": AnalyticsQueryBuilder<"Orders", AnalyticsQueryInfoForType['Orders'][keyof AnalyticsQueryInfoForType['Orders']], AnalyticsQueryFilterForType['Orders'], AnalyticsQueryGroupingForType['Orders'], AnalyticsQueryRangeKeyForType['Orders']>;
    "Chat Rooms": AnalyticsQueryBuilder<"Chat Rooms", AnalyticsQueryInfoForType['Chat Rooms'][keyof AnalyticsQueryInfoForType['Chat Rooms']], AnalyticsQueryFilterForType['Chat Rooms'], AnalyticsQueryGroupingForType['Chat Rooms'], AnalyticsQueryRangeKeyForType['Chat Rooms']>;
    "Chats": AnalyticsQueryBuilder<"Chats", AnalyticsQueryInfoForType['Chats'][keyof AnalyticsQueryInfoForType['Chats']], AnalyticsQueryFilterForType['Chats'], AnalyticsQueryGroupingForType['Chats'], AnalyticsQueryRangeKeyForType['Chats']>;
};
export type AnalyticsQueryType = keyof AnalyticsQueryForType;
export type AnalyticsQuery = AnalyticsQueryForType[AnalyticsQueryType];
export declare const resource_to_modelName: {
    [K in AnalyticsQueryType]: ModelName;
};
export type AnalyticsQueryOptions = {
    createdRange?: DateRange;
    createdAvailabilities?: WeeklyAvailability[];
    updatedRange?: DateRange;
    overrideGlobalRange?: boolean;
    groupByCareTeam?: boolean;
};
export type AnalyticsAggregationRequest = {
    modelName: string;
    aggregation: any[];
};
export type AnalyticsFrameGroupingCategory = {
    category: string;
    keys: string[];
};
export type AnalyticsFrameType = 'Percentage';
export interface AnalyticsFrame_readonly extends ClientRecord {
}
export interface AnalyticsFrame_required {
    title: string;
    query: AnalyticsQuery;
    groupByCareTeam?: boolean;
}
export interface AnalyticsFrame_updatesDisabled {
}
export interface AnalyticsFrame extends AnalyticsFrame_readonly, AnalyticsFrame_required, AnalyticsFrame_updatesDisabled, AnalyticsQueryOptions {
    parentFrame?: string;
    type?: AnalyticsFrameType;
    groupMin?: number | '';
    groupMax?: number | '';
    displayType?: string;
    analyticsFrameGroupingCategory?: AnalyticsFrameGroupingCategory[];
    truncationLength?: number;
    showEllipsis?: boolean;
    orderedLabels?: string[];
    visibleForRoles?: string[];
    visibleForUserIds?: string[];
    index?: number;
    tags?: string[];
}
export interface BackgroundError_readonly extends ClientRecord {
}
export interface BackgroundError_required {
    title: string;
    message: string;
}
export interface BackgroundError_updatesDisabled {
}
export interface BackgroundError extends BackgroundError_readonly, BackgroundError_required, BackgroundError_updatesDisabled {
    acknowledgedAt?: Date | '';
    journeyId?: string;
    enduserId?: string;
}
export type SortingField = {
    field: string;
    ascending: boolean;
    type: 'date' | 'number' | 'string';
};
export interface EnduserView_readonly extends ClientRecord {
}
export interface EnduserView_required {
    title: string;
    fields: string[];
}
export interface EnduserView_updatesDisabled {
}
export interface EnduserView extends EnduserView_readonly, EnduserView_required, EnduserView_updatesDisabled {
    defaultForRole?: string;
    hideFromRoles?: string[];
    defaultForUserIds?: string[];
    hideProfileLink?: boolean;
    customTypeId?: string;
    filter?: Indexable;
    sort?: SortingField[];
    style?: {
        [index: string]: {
            width?: number;
            wrap?: string;
        };
    };
}
export type EnduserProfileViewBlockBuilder<T, I> = {
    type: T;
    info: I;
    width?: string;
    maxHeight?: number;
};
export type EnduserProfileViewBlocks = {
    "Field Group": EnduserProfileViewBlockBuilder<"Field Group", {
        title: string;
        fields: string[];
        displayFields?: {
            field: string;
            display: string;
        }[];
    }>;
    "Form Responses": EnduserProfileViewBlockBuilder<"Form Responses", {
        title: string;
        formId?: string;
        fieldIds?: string[];
        showAllForms?: boolean;
        expandable?: boolean;
    }>;
    "Zus Encounters": EnduserProfileViewBlockBuilder<"Zus Encounters", {
        title: string;
    }>;
    "Files": EnduserProfileViewBlockBuilder<"Files", {
        title: string;
    }>;
    "Tickets": EnduserProfileViewBlockBuilder<"Tickets", {
        title: string;
    }>;
    "Events": EnduserProfileViewBlockBuilder<"Events", {
        title: string;
    }>;
    "Labs": EnduserProfileViewBlockBuilder<"Labs", {
        title: string;
    }>;
    "Medications": EnduserProfileViewBlockBuilder<"Medications", {
        title: string;
    }>;
    "Diagnoses": EnduserProfileViewBlockBuilder<"Diagnoses", {
        title: string;
    }>;
    "Timeline": EnduserProfileViewBlockBuilder<"Timeline", {
        title: string;
    }>;
    "Shared Content": EnduserProfileViewBlockBuilder<"Shared Content", {
        title: string;
    }>;
};
export type EnduserProfileViewBlockType = keyof EnduserProfileViewBlocks;
export type EnduserProfileViewBlock = EnduserProfileViewBlocks[EnduserProfileViewBlockType];
export interface EnduserProfileView_readonly extends ClientRecord {
}
export interface EnduserProfileView_required {
    title: string;
    blocks: EnduserProfileViewBlock[];
}
export interface EnduserProfileView_updatesDisabled {
}
export interface EnduserProfileView extends EnduserProfileView_readonly, EnduserProfileView_required, EnduserProfileView_updatesDisabled {
    showCompose?: boolean;
    defaultForUserIds?: string[];
    defaultForRoles?: string[];
    hiddenFromRoles?: string[];
}
export type ListOfStringsWithQualifier = {
    qualifier: ListQueryQualifier;
    values: string[];
};
export type AutomationTriggerActionBuilder<T, I> = {
    type: T;
    info: I;
};
export type AutomationTriggerActions = {
    "Add To Journey": AutomationTriggerActionBuilder<'Add To Journey', {
        journeyId: string;
        doNotRestart?: boolean;
    }>;
    "Remove From Journey": AutomationTriggerActionBuilder<'Remove From Journey', {
        journeyId: string;
    }>;
    "Remove From All Journeys": AutomationTriggerActionBuilder<'Remove From All Journeys', {}>;
    "Add Tags": AutomationTriggerActionBuilder<'Add Tags', {
        tags: string[];
        replaceExisting?: boolean;
    }>;
    "Remove Tags": AutomationTriggerActionBuilder<'Remove Tags', {
        tags: string[];
    }>;
    "Add Access Tags": AutomationTriggerActionBuilder<'Add Access Tags', {
        tags: string[];
    }>;
    "Set Fields": AutomationTriggerActionBuilder<'Set Fields', {
        fields: EnduserFieldSetter[];
    }>;
    "Move To Step": AutomationTriggerActionBuilder<'Move To Step', {}>;
    "Assign Care Team": AutomationTriggerActionBuilder<'Assign Care Team', {
        tags: ListOfStringsWithQualifier;
        limitToOneUser?: boolean;
        setAsPrimary?: boolean;
    }>;
    "Canvas: Add Patient": AutomationTriggerActionBuilder<'Canvas: Add Patient', {}>;
    "Zus: Delete Enrollment": AutomationTriggerActionBuilder<'Zus: Delete Enrollment', {
        packageId: string;
    }>;
    "Remove Care Team": AutomationTriggerActionBuilder<'Remove Care Team', {
        tags: ListOfStringsWithQualifier;
    }>;
    "Require Form Followups": AutomationTriggerActionBuilder<'Require Form Followups', {
        formIds: string[];
    }>;
    "Add to Waitlist": AutomationTriggerActionBuilder<'Add to Waitlist', {
        waitlistId: string;
    }>;
    "Grant Access From Waitlist": AutomationTriggerActionBuilder<'Grant Access From Waitlist', {
        waitlistId: string;
        count: number;
    }>;
    "Reply to Chat": AutomationTriggerActionBuilder<'Reply to Chat', {
        message: string;
    }>;
    "Create User Notifications": AutomationTriggerActionBuilder<'Create User Notifications', {
        message: string;
        notificationType: string;
        careTeamOnly?: boolean;
        tags?: ListOfStringsWithQualifier;
        maxUsers?: number;
    }>;
    "Assign to Incoming Message": AutomationTriggerActionBuilder<'Assign to Incoming Message', {
        careTeamOnly?: boolean;
        tags?: ListOfStringsWithQualifier;
        maxUsers?: number;
    }>;
    "Zendesk: Update Ticket Assignee": AutomationTriggerActionBuilder<'Zendesk: Update Ticket Assignee', {}>;
};
export type AutomationTriggerActionType = keyof AutomationTriggerActions;
export type AutomationTriggerAction = AutomationTriggerActions[AutomationTriggerActionType];
export type AutomationTriggerEventBuilder<T, I, C> = {
    type: T;
    info: I;
    conditions?: C;
};
export type AutomationTriggerEvents = {
    'Form Submitted': AutomationTriggerEventBuilder<"Form Submitted", {
        formId: string;
        otherFormIds?: string[];
        submitterType?: SessionType | 'Anyone';
        publicIdentifier?: string;
        hasExpiredEvent?: boolean;
    }, {}>;
    'Form Unsubmitted': AutomationTriggerEventBuilder<"Form Unsubmitted", {
        formId: string;
        intervalInMS: number;
    }, {}>;
    'Purchase Made': AutomationTriggerEventBuilder<"Purchase Made", {
        titles?: string[];
        productIds?: string[];
        titlePartialMatches?: string[];
    }, {}>;
    'Refund Issued': AutomationTriggerEventBuilder<"Refund Issued", {}, {}>;
    'Subscription Ended': AutomationTriggerEventBuilder<"Subscription Ended", {
        productIds?: string[];
    }, {}>;
    'Subscription Payment Failed': AutomationTriggerEventBuilder<"Subscription Payment Failed", {}, {}>;
    'Appointment No-Showed': AutomationTriggerEventBuilder<"Appointment No-Showed", {
        titles?: string[];
        templateIds?: string[];
    }, {}>;
    'Field Equals': AutomationTriggerEventBuilder<"Field Equals", {
        field: string;
        value: string;
    }, {}>;
    'Fields Changed': AutomationTriggerEventBuilder<"Fields Changed", {
        fields: string[];
    }, {}>;
    'Tag Added': AutomationTriggerEventBuilder<"Tag Added", {
        tag: string;
    }, {}>;
    'Contact Created': AutomationTriggerEventBuilder<"Contact Created", {
        entityTypes?: string[];
    }, {}>;
    'Appointment Created': AutomationTriggerEventBuilder<"Appointment Created", {
        titles?: string[];
        templateIds?: string[];
        excludeTemplateIds?: string[];
    }, {}>;
    'Appointment Completed': AutomationTriggerEventBuilder<"Appointment Completed", {
        titles?: string[];
        templateIds?: string[];
    }, {}>;
    'Appointment Cancelled': AutomationTriggerEventBuilder<"Appointment Cancelled", {
        titles?: string[];
        templateIds?: string[];
        excludeTemplateIds?: string[];
        excludeCancelUpcomingEventsJourney?: boolean;
        by?: '' | 'enduser' | 'user';
    }, {}>;
    'Appointment Rescheduled': AutomationTriggerEventBuilder<"Appointment Rescheduled", {
        titles?: string[];
        detectManualReschedules?: boolean;
    }, {}>;
    'Medication Added': AutomationTriggerEventBuilder<"Medication Added", {
        titles: string[];
    }, {}>;
    'No Recent Appointment': AutomationTriggerEventBuilder<"No Recent Appointment", {
        intervalInMS: number;
        templateIds?: string[];
        titles?: string[];
    }, {}>;
    'On Birthday': AutomationTriggerEventBuilder<"On Birthday", {
        minutes: number;
    }, {}>;
    'Has Not Engaged': AutomationTriggerEventBuilder<"Has Not Engaged", {
        intervalInMS: number;
    }, {}>;
    'Vital Count': AutomationTriggerEventBuilder<"Vital Count", {
        units?: string[];
        minutes: number;
        comparison: VitalComparison;
        periodInMS: number;
    }, {}>;
    'Vital Update': AutomationTriggerEventBuilder<"Vital Update", {
        configurationIds: string[];
        classifications: string[];
        ignoreDelayedReadings?: boolean;
    }, {}>;
    'SMS Reply': AutomationTriggerEventBuilder<"SMS Reply", {
        templateIds: string[];
        replyKeywords?: string[];
    }, {}>;
    'Order Status Equals': AutomationTriggerEventBuilder<"Order Status Equals", {
        source: string;
        status: string;
        fills?: string[];
        skus?: string[];
        skuPartials?: string[];
        titlePartials?: string[];
    }, {}>;
    'Missed Call': AutomationTriggerEventBuilder<"Missed Call", {
        phoneNumbers?: string[];
        inputs?: string[];
    }, {}>;
    'Left Voicemail': AutomationTriggerEventBuilder<"Left Voicemail", {
        phoneNumbers?: string[];
        inputs?: string[];
    }, {}>;
    'Order Created': AutomationTriggerEventBuilder<"Order Created", {
        titles?: string[];
        fills?: string[];
        partialFrequency?: string;
    }, {}>;
    'Problem Created': AutomationTriggerEventBuilder<"Problem Created", {
        titles?: string[];
    }, {}>;
    'Message Delivery Failure': AutomationTriggerEventBuilder<"Message Delivery Failure", {}, {}>;
    'Incoming Message': AutomationTriggerEventBuilder<"Incoming Message", {
        noCareTeam?: boolean;
        destinations?: string[];
        channels?: string[];
        keywords?: string[];
    }, {}>;
    'Pregnancy Ended': AutomationTriggerEventBuilder<"Pregnancy Ended", {
        reason?: string;
    }, {}>;
    'Form Group Completed': AutomationTriggerEventBuilder<"Form Group Completed", {
        groupId: string;
    }, {}>;
    'Form Group Incomplete': AutomationTriggerEventBuilder<"Form Group Incomplete", {
        groupId: string;
        intervalInMS: number;
    }, {}>;
    'Message Opened': AutomationTriggerEventBuilder<"Message Opened", {
        templateIds?: string[];
    }, {}>;
    'Message Link Clicked': AutomationTriggerEventBuilder<"Message Link Clicked", {
        templateIds?: string[];
    }, {}>;
    'Healthie Note Locked': AutomationTriggerEventBuilder<"Healthie Note Locked", {
        healthieFormIds?: string[];
        answersCondition?: Record<string, any>;
    }, {}>;
    'Database Entry Added': AutomationTriggerEventBuilder<"Database Entry Added", {
        databaseId: string;
    }, {}>;
    'Form Started': AutomationTriggerEventBuilder<"Form Started", {
        formIds?: string[];
    }, {}>;
    "Eligibility Result Received": AutomationTriggerEventBuilder<'Eligibility Result Received', {
        source: string;
    }, {}>;
    'File Added': AutomationTriggerEventBuilder<"File Added", {
        source: string;
    }, {}>;
};
export type AutomationTriggerEventType = keyof AutomationTriggerEvents;
export type AutomationTriggerEvent = AutomationTriggerEvents[AutomationTriggerEventType];
export type AutomationTriggerStatus = "Active" | "Inactive";
export interface AutomationTrigger_readonly extends ClientRecord {
}
export interface AutomationTrigger_required {
    title: string;
    event: AutomationTriggerEvent;
    action: AutomationTriggerAction;
    status: AutomationTriggerStatus;
}
export interface AutomationTrigger_updatesDisabled {
}
export interface AutomationTrigger extends AutomationTrigger_readonly, AutomationTrigger_required, AutomationTrigger_updatesDisabled {
    enduserCondition?: Record<string, any>;
    journeyId?: string;
    oncePerEnduser?: boolean;
    triggerNextAt?: Date;
    tags?: string[];
    availabilityTimezone?: Timezone;
    weeklyAvailabilities?: WeeklyAvailability[];
    archivedAt?: Date | '';
}
export type Address = {
    lineOne: string;
    lineTwo?: string;
    city: string;
    state: string;
    zipCode: string;
    zipPlusFour?: string;
    title?: string;
};
type SuperbillProviderInfoRequired = {
    phone: string;
    email: string;
    officeName: string;
    taxId: string;
    placeOfServiceCode?: string;
    providerName: string;
    providerNPI: string;
    providerLicense: string;
    address: Address;
};
export type SuperbillProviderInfo = SuperbillProviderInfoRequired & {};
export interface SuperbillProvider_readonly extends ClientRecord {
}
export interface SuperbillProvider_required extends SuperbillProviderInfoRequired {
}
export interface SuperbillProvider_updatesDisabled {
}
export interface SuperbillProvider extends SuperbillProviderInfo, SuperbillProvider_readonly, SuperbillProvider_required, SuperbillProvider_updatesDisabled {
}
export type Insurance = {
    name: string;
};
export type BillingCode = {
    code: number | string;
    label: string;
};
export type SuperbillLineItem = {
    billingCode: BillingCode;
    quantity: number;
    cost: {
        amount: number;
        currency: Currency;
    };
    discount?: number;
    diagnosisCodes?: string[];
};
export type SuperbillPatientInfo = {
    name: string;
    dateOfBirth: string;
    phone: string;
};
export interface Superbill_readonly extends ClientRecord {
}
export interface Superbill_required {
    enduserId: string;
    appointmentDate: Date;
    provider: SuperbillProviderInfo;
    patient: SuperbillPatientInfo;
    lineItems: SuperbillLineItem[];
}
export interface Superbill_updatesDisabled {
}
export interface Superbill extends Superbill_readonly, Superbill_required, Superbill_updatesDisabled {
}
export type PhoneTreeEventBuilder<T, V> = {
    parentId: string;
    type: T;
    info: V;
};
export type PhoneTreeEvents = {
    'Start': PhoneTreeEventBuilder<'Start', {}>;
    'On Gather': PhoneTreeEventBuilder<'On Gather', {
        digits?: string;
        transcription?: string;
        handleNoInput?: boolean;
    }>;
    'If True': PhoneTreeEventBuilder<'If True', {}>;
    'If False': PhoneTreeEventBuilder<'If False', {}>;
    'If No Users Match': PhoneTreeEventBuilder<'If No Users Match', {}>;
    'If No Users Answer': PhoneTreeEventBuilder<'If No Users Answer', {}>;
};
export type PhoneTreeEventType = keyof PhoneTreeEvents;
export type PhoneTreeEvent = PhoneTreeEvents[PhoneTreeEventType];
export type PhonePlaybackInfo = {
    Say: {
        type: 'Say';
        info: {
            script: string;
            url?: string;
        };
    };
    Play: {
        type: "Play";
        info: {
            url: string;
            script?: string;
        };
    };
};
export type PhonePlaybackType = keyof PhonePlaybackInfo;
export type PhonePlayback = PhonePlaybackInfo[PhonePlaybackType];
export type PhoneTreeActionBuilder<T, V> = {
    type: T;
    info: V;
};
export type PhoneTreeActions = {
    'Gather': PhoneTreeActionBuilder<"Gather", {
        digits: boolean;
        speech: boolean;
        playback: PhonePlayback;
        duration?: number;
    }>;
    'Voicemail': PhoneTreeActionBuilder<"Voicemail", {
        playback: PhonePlayback;
        journeyId?: string;
    }>;
    'Play Message': PhoneTreeActionBuilder<"Play Message", {
        playback: PhonePlayback;
        journeyId?: string;
        outcome?: string;
        cancelAppointment?: boolean;
        confirmAppointment?: boolean;
    }>;
    'Dial Users': PhoneTreeActionBuilder<"Dial Users", {
        userIds: string[];
        playback?: Partial<PhonePlayback>;
        duration?: number;
    }>;
    'Route Call': PhoneTreeActionBuilder<"Route Call", {
        prePlayback?: Partial<PhonePlayback>;
        byCareTeamPrimary?: boolean;
        byCareTeam?: boolean;
        byRole?: string;
        byTags?: ListOfStringsWithQualifier;
        playback?: Partial<PhonePlayback>;
        duration?: number;
        addToCareTeam?: boolean;
        dialRecentAgent?: boolean;
    }>;
    "Select Care Team Member": PhoneTreeActionBuilder<"Select Care Team Member", {
        playback?: Partial<PhonePlayback>;
        playbackVoicemail?: Partial<PhonePlayback>;
    }>;
    'Forward Call': PhoneTreeActionBuilder<"Forward Call", {
        to: string;
    }>;
    'Conditional Split': PhoneTreeActionBuilder<"Conditional Split", {
        timezone?: Timezone;
        weeklyAvailabilities?: WeeklyAvailability[];
        hasCareTeam?: boolean;
        hasOneCareTeamMember?: boolean;
    }>;
    'Add to Queue': PhoneTreeActionBuilder<"Add to Queue", {
        queueId: string;
        playback?: Partial<PhonePlayback>;
    }>;
    'Route Extensions': PhoneTreeActionBuilder<"Route Extensions", {
        extensions: {
            input: string;
            userId: string;
        }[];
        playback?: Partial<PhonePlayback>;
    }>;
};
export type PhoneTreeActionType = keyof PhoneTreeActions;
export type PhoneTreeAction = PhoneTreeActions[PhoneTreeActionType];
export type PhoneTreeNode = {
    id: string;
    action: PhoneTreeAction;
    events: PhoneTreeEvent[];
    flowchartUI: FlowchartUI;
};
export type PhoneTreeEnduserCondition = ('All' | 'Unassigned');
export interface PhoneTree_readonly extends ClientRecord {
}
export interface PhoneTree_required {
    number: string;
    nodes: PhoneTreeNode[];
    isActive: boolean;
}
export interface PhoneTree_updatesDisabled {
}
export interface PhoneTree extends PhoneTree_readonly, PhoneTree_required, PhoneTree_updatesDisabled {
    testEnduserIds?: string[];
    enduserCondition?: PhoneTreeEnduserCondition;
    bypassOOO?: boolean;
    defaultEntityType?: string;
    tags?: string[];
    title?: string;
    outboundNumber?: string;
}
export type TableViewColumn = {
    field: string;
    type?: string;
    width?: number | '';
    wrap?: string;
};
export interface TableView_readonly extends ClientRecord {
}
export interface TableView_required {
    title: string;
    page: string;
    columns: TableViewColumn[];
}
export interface TableView_updatesDisabled {
}
export interface TableView extends TableView_readonly, TableView_required, TableView_updatesDisabled {
    defaultForRoles?: string[];
    defaultForUserIds?: string[];
    filter?: Indexable;
}
export interface EmailSyncDenial_readonly extends ClientRecord {
}
export interface EmailSyncDenial_required {
}
export interface EmailSyncDenial_updatesDisabled {
}
export interface EmailSyncDenial extends EmailSyncDenial_readonly, EmailSyncDenial_required, EmailSyncDenial_updatesDisabled {
    email: string;
}
export interface TicketThread_readonly extends ClientRecord {
    lockId?: string;
    externalId?: string;
    lockUntil?: number;
    cursor?: string;
    source: string;
    references?: RelatedRecord[];
    timestamp?: Date;
    group?: string;
    status?: string;
}
export interface TicketThread_required {
}
export interface TicketThread_updatesDisabled {
}
export interface TicketThread extends TicketThread_readonly, TicketThread_required, TicketThread_updatesDisabled {
    enduserId: string;
    subject: string;
    closedAt?: Date | '';
    pinnedAt?: Date | '';
    assignedTo?: string[];
    tags?: string[];
}
export interface TicketThreadComment_readonly extends ClientRecord {
    externalThreadId?: string;
    externalId?: string;
    source?: string;
    references?: RelatedRecord[];
    readBy?: {
        [index: string]: Date | '';
    };
    timestamp?: Date;
    group?: string;
}
export interface TicketThreadComment_required {
    ticketThreadId: string;
    plaintext: string;
    html: string;
    enduserId: string;
    public: boolean;
    inbound: boolean;
    assignedTo?: string[];
}
export interface TicketThreadComment_updatesDisabled {
}
export interface TicketThreadComment extends TicketThreadComment_readonly, TicketThreadComment_required, TicketThreadComment_updatesDisabled {
    userId?: string;
    userDisplayName?: string;
    type?: string;
    attachments?: ChatAttachment[];
    voice?: {
        "from": string;
        "to": string;
        "recording_url": string;
        "started_at": string;
        durationInSeconds: number;
        transcription?: string;
    };
    hiddenBy?: {
        [index: string]: Date | '';
    };
    hiddenForAll?: boolean;
    ticketIds?: string[];
    tags?: string[];
    markedUnreadForAll?: boolean;
    inboxStatus?: string;
}
export interface Configuration_readonly extends ClientRecord {
}
export interface Configuration_updatesDisabled {
}
export interface Configuration_required {
    type: string;
    value: string;
}
export interface Configuration extends Configuration_readonly, Configuration_required, Configuration_updatesDisabled {
}
export interface TicketQueue_readonly extends ClientRecord {
    count?: number;
}
export interface TicketQueue_updatesDisabled {
}
export interface TicketQueue_required {
    title: string;
    userIds: string[];
}
export interface TicketQueue extends TicketQueue_readonly, TicketQueue_required, TicketQueue_updatesDisabled {
    type?: string;
    defaultFromNumber?: string;
    enduserFields?: string[];
    lastRefreshedCountAt?: Date;
    preventPull?: string[];
    index?: number;
    overdueReminderUserId?: string;
}
export interface EnduserOrder_readonly extends ClientRecord {
}
export interface EnduserOrder_updatesDisabled {
}
export interface EnduserOrder_required {
    externalId: string;
    source: string;
    title: string;
    status: string;
    enduserId: string;
}
export interface EnduserOrder extends EnduserOrder_readonly, EnduserOrder_required, EnduserOrder_updatesDisabled {
    description?: string;
    userId?: string;
    error?: string;
    items?: {
        title: string;
        tracking?: string;
    }[];
    tracking?: string;
    instructions?: string;
    shippedDate?: string;
    frequency?: string;
    activateBy?: string;
    fill?: string;
    sku?: string;
}
export interface EnduserProblem_readonly extends ClientRecord {
}
export interface EnduserProblem_updatesDisabled {
}
export interface EnduserProblem_required {
}
export interface EnduserProblem extends EnduserProblem_readonly, EnduserProblem_required, EnduserProblem_updatesDisabled {
    externalId?: string;
    source?: string;
    title: string;
    enduserId: string;
    code?: string;
    codeset?: string;
    references?: RelatedRecord[];
}
export type CandidProcedureCode = {
    code: string;
    quantity: number;
    units: 'MJ' | 'UN';
};
export declare const DIAGNOSIS_TYPE_MAPPING: {
    ABF: string;
    ABJ: string;
    ABK: string;
    APR: string;
    BF: string;
    BJ: string;
    BK: string;
    PR: string;
    DR: string;
    LOI: string;
};
export type DiagnosisTypes = typeof DIAGNOSIS_TYPE_MAPPING;
export type DiagnosisType = keyof DiagnosisTypes;
export type Diagnosis = {
    type: keyof DiagnosisTypes;
    code: string;
    modifiers?: string[];
    procedureCodes?: CandidProcedureCode[];
};
export interface EnduserEncounter_readonly extends ClientRecord {
    externalId?: string;
    source?: string;
    integration?: 'Candid';
}
export interface EnduserEncounter_updatesDisabled {
}
export interface EnduserEncounter_required {
}
export interface EnduserEncounter extends EnduserEncounter_readonly, EnduserEncounter_required, EnduserEncounter_updatesDisabled {
    title: string;
    enduserId: string;
    providerUserId: string;
    dateOfService: string;
    diagnoses: Diagnosis[];
    authorizedRelease: boolean;
    placeOfServiceCode: string;
    billingProviderAddress?: Address;
    serviceFacilityAddress?: Address;
    modifiers?: string[];
    error?: string;
    class?: string;
    status?: string;
    location?: string;
    providerNames?: string[];
    diagnosisDisplays?: string[];
}
export interface TicketQueue_readonly extends ClientRecord {
    count?: number;
}
export interface TicketQueue_updatesDisabled {
}
export interface TicketQueue_required {
    title: string;
    userIds: string[];
}
export interface TicketQueue extends TicketQueue_readonly, TicketQueue_required, TicketQueue_updatesDisabled {
}
export interface CallHoldQueue_readonly extends ClientRecord {
}
export interface CallHoldQueue_updatesDisabled {
}
export interface CallHoldQueue_required {
    title: string;
    userIds: string[];
    twilioQueueId?: string;
}
export interface CallHoldQueue extends CallHoldQueue_readonly, CallHoldQueue_required, CallHoldQueue_updatesDisabled {
}
export type ImageAttachment = {
    url: string;
    type: string;
};
export type GroupMMSMessage = {
    message: string;
    sender: string;
    timestamp: number;
    images?: ImageAttachment[];
    logOnly?: boolean;
};
export type GroupMMSUserState = {
    id: string;
    numUnread: number;
    markedUnread?: boolean;
};
export interface GroupMMSConversation_readonly extends ClientRecord {
    externalId: string;
    destinations: string[];
    phoneNumber: string;
    title: string;
    pinnedAt?: Date | '';
    tags?: string[];
    suggestedReply?: string;
    hiddenBy?: {
        [index: string]: Date | '';
    };
    hiddenForAll?: boolean;
}
export interface GroupMMSConversation_updatesDisabled {
    messages: GroupMMSMessage[];
}
export interface GroupMMSConversation_required {
    userIds: string[];
    userStates: GroupMMSUserState[];
    enduserIds: string[];
}
export interface GroupMMSConversation extends GroupMMSConversation_readonly, GroupMMSConversation_required, GroupMMSConversation_updatesDisabled {
    markedUnreadForAll?: boolean;
    inboxStatus?: string;
    assignedTo?: string[];
}
export type VitalComparisons = {
    'Less Than': {
        type: "Less Than";
        value: number;
    };
    'Greater Than': {
        type: "Greater Than";
        value: number;
    };
    'Between': {
        type: "Between";
        value: {
            lower: number;
            upper: number;
        };
    };
};
export type VitalComparisonType = keyof VitalComparisons;
export type VitalComparison = VitalComparisons[VitalComparisonType];
export type VitalConfigurationRange = {
    classification: string;
    comparison: VitalComparison;
    trendIntervalInMS?: number;
    deviationFromProfileWeight?: boolean;
};
export interface VitalConfiguration_readonly extends ClientRecord {
}
export interface VitalConfiguration_required {
}
export interface VitalConfiguration_updatesDisabled {
}
export interface VitalConfiguration extends VitalConfiguration_readonly, VitalConfiguration_required, VitalConfiguration_updatesDisabled {
    title: string;
    unit: string;
    ranges: VitalConfigurationRange[];
    mealStatus?: "Before" | "After" | "Any";
    originalConfigurationId?: string;
    enduserId?: string;
}
export interface BlockedPhone_readonly extends ClientRecord {
}
export interface BlockedPhone_required {
}
export interface BlockedPhone_updatesDisabled {
}
export interface BlockedPhone extends BlockedPhone_readonly, BlockedPhone_required, BlockedPhone_updatesDisabled {
    phone: string;
}
export interface PrescriptionRoute_readonly extends ClientRecord {
}
export interface PrescriptionRoute_required {
}
export interface PrescriptionRoute_updatesDisabled {
}
export interface PrescriptionRoute extends PrescriptionRoute_readonly, PrescriptionRoute_required, PrescriptionRoute_updatesDisabled {
    title: string;
    state: string;
    templateIds: string[];
    pharmacyId?: string;
    pharmacyLabel?: string;
    tags?: string[];
}
export interface FlowchartNote_readonly extends ClientRecord {
}
export interface FlowchartNote_required {
}
export interface FlowchartNote_updatesDisabled {
}
export interface FlowchartNote extends FlowchartNote_readonly, FlowchartNote_required, FlowchartNote_updatesDisabled {
    flowchartId: string;
    note: string;
    flowchartUI?: FlowchartUI;
}
export interface PortalBranding_readonly extends ClientRecord {
}
export interface PortalBranding_required {
    title: string;
    enduserField: string;
    enduserValue: string;
}
export interface PortalBranding_updatesDisabled {
}
export interface PortalBranding extends PortalBranding_readonly, PortalBranding_required, PortalBranding_updatesDisabled {
    primary?: string;
    secondary?: string;
    logoURL?: string;
    subdomain?: string;
    customPortalURL?: string;
    portalSettings?: PortalSettings;
}
export interface WebhookLog_readonly extends ClientRecord {
    url: string;
    payload: object;
    responseCode: string | number;
    response: string | object;
}
export interface WebhookLog_required {
}
export interface WebhookLog_updatesDisabled {
}
export interface WebhookLog extends WebhookLog_readonly, WebhookLog_required, WebhookLog_updatesDisabled {
}
export interface SuggestedContact_readonly extends ClientRecord {
}
export interface SuggestedContact_required {
    title: string;
    phone?: string;
    email?: string;
}
export interface SuggestedContact_updatesDisabled {
}
export interface SuggestedContact extends SuggestedContact_readonly, SuggestedContact_required, SuggestedContact_updatesDisabled {
}
export interface DiagnosisCode_readonly extends ClientRecord {
}
export interface DiagnosisCode_required {
    code: string;
    display: string;
    system: string;
}
export interface DiagnosisCode_updatesDisabled {
}
export interface DiagnosisCode extends DiagnosisCode_readonly, DiagnosisCode_required, DiagnosisCode_updatesDisabled {
}
export interface AllergyCode_readonly extends ClientRecord {
}
export interface AllergyCode_required {
    code: string;
    display: string;
    system: string;
}
export interface AllergyCode_updatesDisabled {
}
export interface AllergyCode extends AllergyCode_readonly, AllergyCode_required, AllergyCode_updatesDisabled {
}
export interface IntegrationLog_readonly extends ClientRecord {
    integration: string;
    status: "Success" | "Error";
    type: string;
    url?: string;
    payload?: string;
    response?: string;
}
export interface IntegrationLog_required {
}
export interface IntegrationLog_updatesDisabled {
}
export interface IntegrationLog extends IntegrationLog_readonly, IntegrationLog_required, IntegrationLog_updatesDisabled {
}
export interface EnduserEligibilityResult_readonly extends ClientRecord {
}
export interface EnduserEligibilityResult_updatesDisabled {
}
export interface EnduserEligibilityResult_required {
    title: string;
    type: string;
    status: string;
    externalId: string;
    source: string;
    enduserId: string;
}
export interface EnduserEligibilityResult extends EnduserEligibilityResult_readonly, EnduserEligibilityResult_required, EnduserEligibilityResult_updatesDisabled {
    statusText?: string;
    results?: {
        title: string;
        is_covered: boolean;
        requires_prior_authorization: boolean;
        copay: string;
        copayDescription: string;
    }[];
}
export interface AgentRecord_readonly extends ClientRecord {
}
export interface AgentRecord_required {
    type: string;
    title: string;
    description: string;
}
export interface AgentRecord_updatesDisabled {
}
export interface AgentRecord extends AgentRecord_readonly, AgentRecord_required, AgentRecord_updatesDisabled {
    pages?: string[];
    content?: string;
    url?: string;
    embedding?: number[];
    source?: string;
    externalId?: string;
    indexed?: boolean;
}
export interface Waitlist_readonly extends ClientRecord {
}
export interface Waitlist_required {
    title: string;
    journeyId: string;
}
export interface Waitlist_updatesDisabled {
}
export interface Waitlist extends Waitlist_readonly, Waitlist_required, Waitlist_updatesDisabled {
    enduserIds: string[];
    tags?: string[];
}
export type AICOnversationMessageContent = {
    type: 'text' | 'image' | 'file';
    text?: string;
};
export type AIConversationMessage = {
    role: 'user' | 'assistant';
    text: string;
    timestamp: Date;
    tokens: number;
    content?: AICOnversationMessageContent[];
    userId?: string;
};
export interface AIConversation_readonly extends ClientRecord {
}
export interface AIConversation_required {
    type: string;
    modelName: string;
    messages: AIConversationMessage[];
}
export interface AIConversation_updatesDisabled {
}
export interface AIConversation extends AIConversation_readonly, AIConversation_required, AIConversation_updatesDisabled {
}
export interface InboxThread_readonly extends ClientRecord {
}
export interface InboxThread_required {
    type: "Email" | "SMS" | "Chat" | "GroupMMS" | "Phone";
    title: string;
    preview: string;
    timestamp: Date;
    assignedTo: string[];
    userIds: string[];
    enduserIds: string[];
    inboxStatus: string;
    threadId: string;
}
export interface InboxThread_updatesDisabled {
}
export interface InboxThread extends InboxThread_readonly, InboxThread_required, InboxThread_updatesDisabled {
    tags?: string[];
    phoneNumber?: string;
    enduserPhoneNumber?: string;
    emailMessageId?: string | null;
    readBy?: {
        [index: string]: Date | '';
    };
    outboundTimestamp?: Date | '';
    outboundPreview?: string;
}
export type ModelForName_required = {
    inbox_threads: InboxThread_required;
    ai_conversations: AIConversation_required;
    waitlists: Waitlist_required;
    agent_records: AgentRecord_required;
    enduser_eligibility_results: EnduserEligibilityResult_required;
    integration_logs: IntegrationLog_required;
    allergy_codes: AllergyCode_required;
    diagnosis_codes: DiagnosisCode_required;
    suggested_contacts: SuggestedContact_required;
    call_hold_queues: CallHoldQueue_required;
    fax_logs: FaxLog_required;
    message_template_snippets: MessageTemplateSnippet_required;
    portal_brandings: PortalBranding_required;
    form_groups: FormGroup_required;
    webhook_logs: WebhookLog_required;
    flowchart_notes: FlowchartNote_required;
    enduser_problems: EnduserProblem_required;
    prescription_routes: PrescriptionRoute_required;
    vital_configurations: VitalConfiguration_required;
    blocked_phones: BlockedPhone_required;
    enduser_encounters: EnduserEncounter_required;
    enduser_orders: EnduserOrder_required;
    group_mms_conversations: GroupMMSConversation_required;
    ticket_queues: TicketQueue_required;
    ticket_threads: TicketThread_required;
    ticket_thread_comments: TicketThreadComment_required;
    enduser_custom_types: EnduserCustomType_required;
    phone_trees: PhoneTree_required;
    superbill_providers: SuperbillProvider_required;
    superbills: Superbill_required;
    automation_triggers: AutomationTrigger_required;
    background_errors: BackgroundError_required;
    enduser_views: EnduserView_required;
    availability_blocks: AvailabilityBlock_required;
    analytics_frames: AnalyticsFrame_required;
    endusers: Enduser_required;
    enduser_profile_views: EnduserProfileView_required;
    engagement_events: EngagementEvent_required;
    journeys: Journey_required;
    api_keys: APIKey_required;
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
    forms: Form_required;
    form_fields: FormField_required;
    form_responses: FormResponse_required;
    calendar_events: CalendarEvent_required;
    calendar_event_templates: CalendarEventTemplate_required;
    calendar_event_RSVPs: CalendarEventRSVP_required;
    automation_steps: AutomationStep_required;
    automated_actions: AutomatedAction_required;
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
    role_based_access_permissions: RoleBasedAccessPermission_required;
    appointment_booking_pages: AppointmentBookingPage_required;
    appointment_locations: AppointmentLocation_required;
    products: Product_required;
    purchases: Purchase_required;
    purchase_credits: PurchaseCredit_required;
    phone_calls: PhoneCall_required;
    enduser_medications: EnduserMedication_required;
    table_views: TableView_required;
    email_sync_denials: EmailSyncDenial_required;
    configurations: Configuration_required;
};
export type ClientModel_required = ModelForName_required[keyof ModelForName_required];
export interface ModelForName_readonly {
    inbox_threads: InboxThread_readonly;
    ai_conversations: AIConversation_readonly;
    waitlists: Waitlist_readonly;
    agent_records: AgentRecord_readonly;
    enduser_eligibility_results: EnduserEligibilityResult_readonly;
    integration_logs: IntegrationLog_readonly;
    allergy_codes: AllergyCode_readonly;
    diagnosis_codes: DiagnosisCode_readonly;
    suggested_contacts: SuggestedContact_readonly;
    call_hold_queues: CallHoldQueue_readonly;
    fax_logs: FaxLog_readonly;
    message_template_snippets: MessageTemplateSnippet_readonly;
    portal_brandings: PortalBranding_readonly;
    form_groups: FormGroup_readonly;
    webhook_logs: WebhookLog_readonly;
    flowchart_notes: FlowchartNote_readonly;
    enduser_problems: EnduserProblem_readonly;
    prescription_routes: PrescriptionRoute_readonly;
    blocked_phones: BlockedPhone_readonly;
    vital_configurations: VitalConfiguration_readonly;
    enduser_encounters: EnduserEncounter_readonly;
    enduser_orders: EnduserOrder_readonly;
    group_mms_conversations: GroupMMSConversation_readonly;
    ticket_queues: TicketQueue_readonly;
    configurations: Configuration_readonly;
    ticket_threads: TicketThread_readonly;
    ticket_thread_comments: TicketThreadComment_readonly;
    enduser_custom_types: EnduserCustomType_readonly;
    phone_trees: PhoneTree_readonly;
    enduser_medications: EnduserMedication_readonly;
    superbill_providers: SuperbillProvider_readonly;
    superbills: Superbill_readonly;
    automation_triggers: AutomationTrigger_readonly;
    background_errors: BackgroundError_readonly;
    enduser_views: EnduserView_readonly;
    availability_blocks: AvailabilityBlock_readonly;
    analytics_frames: AnalyticsFrame_readonly;
    endusers: Enduser_readonly;
    engagement_events: EngagementEvent_readonly;
    journeys: Journey_readonly;
    api_keys: APIKey_readonly;
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
    calendar_events: CalendarEvent_readonly;
    calendar_event_templates: CalendarEventTemplate_readonly;
    calendar_event_RSVPs: CalendarEventRSVP_readonly;
    automation_steps: AutomationStep_readonly;
    automated_actions: AutomatedAction_readonly;
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
    role_based_access_permissions: RoleBasedAccessPermission_readonly;
    appointment_booking_pages: AppointmentBookingPage_readonly;
    appointment_locations: AppointmentLocation_readonly;
    products: Product_readonly;
    purchases: Purchase_readonly;
    purchase_credits: PurchaseCredit_readonly;
    phone_calls: PhoneCall_readonly;
    enduser_profile_views: EnduserProfileView_readonly;
    table_views: TableView_readonly;
    email_sync_denials: EmailSyncDenial_readonly;
}
export type ClientModel_readonly = ModelForName_readonly[keyof ModelForName_readonly];
export interface ModelForName_updatesDisabled {
    inbox_threads: InboxThread_updatesDisabled;
    ai_conversations: AIConversation_updatesDisabled;
    waitlists: Waitlist_updatesDisabled;
    agent_records: AgentRecord_updatesDisabled;
    enduser_eligibility_results: EnduserEligibilityResult_updatesDisabled;
    integration_logs: IntegrationLog_updatesDisabled;
    allergy_codes: AllergyCode_updatesDisabled;
    diagnosis_codes: DiagnosisCode_updatesDisabled;
    suggested_contacts: SuggestedContact_updatesDisabled;
    call_hold_queues: CallHoldQueue_updatesDisabled;
    fax_logs: FaxLog_updatesDisabled;
    message_template_snippets: MessageTemplateSnippet_updatesDisabled;
    portal_brandings: PortalBranding_updatesDisabled;
    form_groups: FormGroup_updatesDisabled;
    webhook_logs: WebhookLog_updatesDisabled;
    flowchart_notes: FlowchartNote_updatesDisabled;
    enduser_problems: EnduserProblem_updatesDisabled;
    prescription_routes: PrescriptionRoute_updatesDisabled;
    blocked_phones: BlockedPhone_updatesDisabled;
    vital_configurations: VitalConfiguration_updatesDisabled;
    enduser_encounters: EnduserEncounter_updatesDisabled;
    enduser_orders: EnduserOrder_updatesDisabled;
    group_mms_conversations: GroupMMSConversation_updatesDisabled;
    ticket_queues: TicketQueue_updatesDisabled;
    configurations: Configuration_updatesDisabled;
    ticket_threads: TicketThread_updatesDisabled;
    ticket_thread_comments: TicketThreadComment_updatesDisabled;
    enduser_custom_types: EnduserCustomType_updatesDisabled;
    phone_trees: PhoneTree_updatesDisabled;
    enduser_medications: EnduserMedication_updatesDisabled;
    superbill_providers: SuperbillProvider_updatesDisabled;
    superbills: Superbill_updatesDisabled;
    automation_triggers: AutomationTrigger_updatesDisabled;
    background_errors: BackgroundError_updatesDisabled;
    enduser_views: EnduserView_updatesDisabled;
    availability_blocks: AvailabilityBlock_updatesDisabled;
    analytics_frames: AnalyticsFrame_updatesDisabled;
    endusers: Enduser_updatesDisabled;
    engagement_events: EngagementEvent_updatesDisabled;
    journeys: Journey_updatesDisabled;
    api_keys: APIKey_updatesDisabled;
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
    calendar_events: CalendarEvent_updatesDisabled;
    calendar_event_templates: CalendarEventTemplate_updatesDisabled;
    calendar_event_RSVPs: CalendarEventRSVP_updatesDisabled;
    automation_steps: AutomationStep_updatesDisabled;
    automated_actions: AutomatedAction_updatesDisabled;
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
    role_based_access_permissions: RoleBasedAccessPermission_updatesDisabled;
    appointment_booking_pages: AppointmentBookingPage_updatesDisabled;
    appointment_locations: AppointmentLocation_updatesDisabled;
    products: Product_updatesDisabled;
    purchases: Purchase_updatesDisabled;
    purchase_credits: PurchaseCredit_updatesDisabled;
    phone_calls: PhoneCall_updatesDisabled;
    enduser_profile_views: EnduserProfileView_updatesDisabled;
    table_views: TableView_updatesDisabled;
    email_sync_denials: EmailSyncDenial_updatesDisabled;
}
export type ClientModel_updatesDisabled = ModelForName_updatesDisabled[keyof ModelForName_updatesDisabled];
export interface ModelForName extends ModelForName_required, ModelForName_readonly {
    inbox_threads: InboxThread;
    ai_conversations: AIConversation;
    waitlists: Waitlist;
    agent_records: AgentRecord;
    enduser_eligibility_results: EnduserEligibilityResult;
    integration_logs: IntegrationLog;
    allergy_codes: AllergyCode;
    diagnosis_codes: DiagnosisCode;
    suggested_contacts: SuggestedContact;
    call_hold_queues: CallHoldQueue;
    fax_logs: FaxLog;
    message_template_snippets: MessageTemplateSnippet;
    portal_brandings: PortalBranding;
    form_groups: FormGroup;
    webhook_logs: WebhookLog;
    flowchart_notes: FlowchartNote;
    enduser_problems: EnduserProblem;
    prescription_routes: PrescriptionRoute;
    blocked_phones: BlockedPhone;
    vital_configurations: VitalConfiguration;
    enduser_encounters: EnduserEncounter;
    enduser_orders: EnduserOrder;
    group_mms_conversations: GroupMMSConversation;
    ticket_queues: TicketQueue;
    configurations: Configuration;
    ticket_threads: TicketThread;
    ticket_thread_comments: TicketThreadComment;
    enduser_custom_types: EnduserCustomType;
    phone_trees: PhoneTree;
    enduser_medications: EnduserMedication;
    superbill_providers: SuperbillProvider;
    superbills: Superbill;
    automation_triggers: AutomationTrigger;
    background_errors: BackgroundError;
    enduser_views: EnduserView;
    availability_blocks: AvailabilityBlock;
    analytics_frames: AnalyticsFrame;
    endusers: Enduser;
    engagement_events: EngagementEvent;
    journeys: Journey;
    api_keys: APIKey;
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
    calendar_events: CalendarEvent;
    calendar_event_templates: CalendarEventTemplate;
    calendar_event_RSVPs: CalendarEventRSVP;
    automation_steps: AutomationStep;
    automated_actions: AutomatedAction;
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
    role_based_access_permissions: RoleBasedAccessPermission;
    appointment_booking_pages: AppointmentBookingPage;
    appointment_locations: AppointmentLocation;
    products: Product;
    purchases: Purchase;
    purchase_credits: PurchaseCredit;
    phone_calls: PhoneCall;
    enduser_profile_views: EnduserProfileView;
    table_views: TableView;
    email_sync_denials: EmailSyncDenial;
}
export type ModelName = keyof ModelForName;
export type Model = ModelForName[keyof ModelForName];
export type ConfiguredSessionInfo = {
    username: string;
    orgEmail: string;
    fname?: string;
    lname?: string;
};
export type ConfiguredSession = UserSession & ConfiguredSessionInfo;
export interface UserActivityInfo {
    lastActive: string | Date;
    lastLogout: string | Date;
}
export type UserActivityStatus = 'Active' | 'Away' | 'Unavailable';
export declare const modelNameChecker: {
    [K in ModelName]: true;
};
declare const WEBHOOK_MODELS: Partial<typeof modelNameChecker>;
export { WEBHOOK_MODELS };
export type WebhookSupportedModel = keyof typeof WEBHOOK_MODELS;
export type CUDSubscription = {
    [K in CUD]?: boolean;
};
export type WebhookSubscriptionsType = {
    [K in WebhookSupportedModel]?: CUDSubscription;
};
export declare const is_webhook_supported_model: (m: ModelName) => m is keyof ModelForName;
export declare const isModelName: (s: string) => s is keyof ModelForName;
export type JourneyContext = {
    calendarEventId?: string;
    formResponseId?: string;
    purchaseId?: string;
    templateId?: string;
    orderId?: string;
    observationId?: string;
    phoneCallId?: string;
    smsId?: string;
    formGroupId?: string;
    publicIdentifier?: string;
    chatId?: string;
    emailId?: string;
    databaseRecordId?: string;
    databaseRecordCreator?: string;
    eligibilityResultId?: string;
    fileId?: string;
    chatRoomId?: string;
    twilioNumber?: string;
    ticketThreadId?: string;
    ticketThreadCommentId?: string;
};
export declare const TIMEZONE_MAP: {
    readonly "Africa/Abidjan": "+00:00";
    readonly "Africa/Accra": "+00:00";
    readonly "Africa/Addis_Ababa": "+03:00";
    readonly "Africa/Algiers": "+01:00";
    readonly "Africa/Asmara": "+03:00";
    readonly "Africa/Asmera": "+03:00";
    readonly "Africa/Bamako": "+00:00";
    readonly "Africa/Bangui": "+01:00";
    readonly "Africa/Banjul": "+00:00";
    readonly "Africa/Blantyre": "+02:00";
    readonly "Africa/Brazzaville": "+01:00";
    readonly "Africa/Bujumbura": "+02:00";
    readonly "Africa/Cairo": "+02:00";
    readonly "Africa/Casablanca": "+00:00";
    readonly "Africa/Ceuta": "+01:00";
    readonly "Africa/Conakry": "+00:00";
    readonly "Africa/Dakar": "+00:00";
    readonly "Africa/Dar_es_Salaam": "+03:00";
    readonly "Africa/Djibouti": "+03:00";
    readonly "Africa/Douala": "+01:00";
    readonly "Africa/El_Aaiun": "+00:00";
    readonly "Africa/Freetown": "+00:00";
    readonly "Africa/Gaborone": "+02:00";
    readonly "Africa/Harare": "+02:00";
    readonly "Africa/Johannesburg": "+02:00";
    readonly "Africa/Juba": "+03:00";
    readonly "Africa/Kampala": "+03:00";
    readonly "Africa/Khartoum": "+03:00";
    readonly "Africa/Kigali": "+02:00";
    readonly "Africa/Kinshasa": "+01:00";
    readonly "Africa/Lagos": "+01:00";
    readonly "Africa/Libreville": "+01:00";
    readonly "Africa/Lome": "+00:00";
    readonly "Africa/Luanda": "+01:00";
    readonly "Africa/Lubumbashi": "+02:00";
    readonly "Africa/Lusaka": "+02:00";
    readonly "Africa/Malabo": "+01:00";
    readonly "Africa/Maputo": "+02:00";
    readonly "Africa/Maseru": "+02:00";
    readonly "Africa/Mbabane": "+02:00";
    readonly "Africa/Mogadishu": "+03:00";
    readonly "Africa/Monrovia": "+00:00";
    readonly "Africa/Nairobi": "+03:00";
    readonly "Africa/Ndjamena": "+01:00";
    readonly "Africa/Niamey": "+01:00";
    readonly "Africa/Nouakchott": "+00:00";
    readonly "Africa/Ouagadougou": "+00:00";
    readonly "Africa/Porto-Novo": "+01:00";
    readonly "Africa/Sao_Tome": "+00:00";
    readonly "Africa/Timbuktu": "+00:00";
    readonly "Africa/Tripoli": "+02:00";
    readonly "Africa/Tunis": "+01:00";
    readonly "Africa/Windhoek": "+01:00";
    readonly "America/Adak": "-10:00";
    readonly "America/Anchorage": "-09:00";
    readonly "America/Anguilla": "-04:00";
    readonly "America/Antigua": "-04:00";
    readonly "America/Araguaina": "-03:00";
    readonly "America/Argentina/Buenos_Aires": "-03:00";
    readonly "America/Argentina/Catamarca": "-03:00";
    readonly "America/Argentina/ComodRivadavia": "-03:00";
    readonly "America/Argentina/Cordoba": "-03:00";
    readonly "America/Argentina/Jujuy": "-03:00";
    readonly "America/Argentina/La_Rioja": "-03:00";
    readonly "America/Argentina/Mendoza": "-03:00";
    readonly "America/Argentina/Rio_Gallegos": "-03:00";
    readonly "America/Argentina/Salta": "-03:00";
    readonly "America/Argentina/San_Juan": "-03:00";
    readonly "America/Argentina/San_Luis": "-03:00";
    readonly "America/Argentina/Tucuman": "-03:00";
    readonly "America/Argentina/Ushuaia": "-03:00";
    readonly "America/Aruba": "-04:00";
    readonly "America/Asuncion": "-04:00";
    readonly "America/Atikokan": "-05:00";
    readonly "America/Atka": "-10:00";
    readonly "America/Bahia": "-03:00";
    readonly "America/Bahia_Banderas": "-06:00";
    readonly "America/Barbados": "-04:00";
    readonly "America/Belem": "-03:00";
    readonly "America/Belize": "-06:00";
    readonly "America/Blanc-Sablon": "-04:00";
    readonly "America/Boa_Vista": "-04:00";
    readonly "America/Bogota": "-05:00";
    readonly "America/Boise": "-07:00";
    readonly "America/Buenos_Aires": "-03:00";
    readonly "America/Cambridge_Bay": "-07:00";
    readonly "America/Campo_Grande": "-04:00";
    readonly "America/Cancun": "-06:00";
    readonly "America/Caracas": "-04:30";
    readonly "America/Catamarca": "-03:00";
    readonly "America/Cayenne": "-03:00";
    readonly "America/Cayman": "-05:00";
    readonly "America/Chicago": "-06:00";
    readonly "America/Chihuahua": "-07:00";
    readonly "America/Coral_Harbour": "-05:00";
    readonly "America/Cordoba": "-03:00";
    readonly "America/Costa_Rica": "-06:00";
    readonly "America/Creston": "-07:00";
    readonly "America/Cuiaba": "-04:00";
    readonly "America/Curacao": "-04:00";
    readonly "America/Danmarkshavn": "+00:00";
    readonly "America/Dawson": "-08:00";
    readonly "America/Dawson_Creek": "-07:00";
    readonly "America/Denver": "-07:00";
    readonly "America/Detroit": "-05:00";
    readonly "America/Dominica": "-04:00";
    readonly "America/Edmonton": "-07:00";
    readonly "America/Eirunepe": "-05:00";
    readonly "America/El_Salvador": "-06:00";
    readonly "America/Ensenada": "-08:00";
    readonly "America/Fort_Wayne": "-05:00";
    readonly "America/Fortaleza": "-03:00";
    readonly "America/Glace_Bay": "-04:00";
    readonly "America/Godthab": "-03:00";
    readonly "America/Goose_Bay": "-04:00";
    readonly "America/Grand_Turk": "-05:00";
    readonly "America/Grenada": "-04:00";
    readonly "America/Guadeloupe": "-04:00";
    readonly "America/Guatemala": "-06:00";
    readonly "America/Guayaquil": "-05:00";
    readonly "America/Guyana": "-04:00";
    readonly "America/Halifax": "-04:00";
    readonly "America/Havana": "-05:00";
    readonly "America/Hermosillo": "-07:00";
    readonly "America/Indiana/Indianapolis": "-05:00";
    readonly "America/Indiana/Knox": "-06:00";
    readonly "America/Indiana/Marengo": "-05:00";
    readonly "America/Indiana/Petersburg": "-05:00";
    readonly "America/Indiana/Tell_City": "-06:00";
    readonly "America/Indiana/Valparaiso": "-06:00";
    readonly "America/Indiana/Vevay": "-05:00";
    readonly "America/Indiana/Vincennes": "-05:00";
    readonly "America/Indiana/Winamac": "-05:00";
    readonly "America/Indianapolis": "-05:00";
    readonly "America/Inuvik": "-07:00";
    readonly "America/Iqaluit": "-05:00";
    readonly "America/Jamaica": "-05:00";
    readonly "America/Jujuy": "-03:00";
    readonly "America/Juneau": "-09:00";
    readonly "America/Kentucky/Louisville": "-05:00";
    readonly "America/Kentucky/Monticello": "-05:00";
    readonly "America/Knox_IN": "-06:00";
    readonly "America/Kralendijk": "-04:00";
    readonly "America/La_Paz": "-04:00";
    readonly "America/Lima": "-05:00";
    readonly "America/Los_Angeles": "-08:00";
    readonly "America/Louisville": "-05:00";
    readonly "America/Lower_Princes": "-04:00";
    readonly "America/Maceio": "-03:00";
    readonly "America/Managua": "-06:00";
    readonly "America/Manaus": "-04:00";
    readonly "America/Marigot": "-04:00";
    readonly "America/Martinique": "-04:00";
    readonly "America/Matamoros": "-06:00";
    readonly "America/Mazatlan": "-07:00";
    readonly "America/Mendoza": "-03:00";
    readonly "America/Menominee": "-06:00";
    readonly "America/Merida": "-06:00";
    readonly "America/Metlakatla": "-08:00";
    readonly "America/Mexico_City": "-06:00";
    readonly "America/Miquelon": "-03:00";
    readonly "America/Moncton": "-04:00";
    readonly "America/Monterrey": "-06:00";
    readonly "America/Montevideo": "-03:00";
    readonly "America/Montreal": "-05:00";
    readonly "America/Montserrat": "-04:00";
    readonly "America/Nassau": "-05:00";
    readonly "America/New_York": "-05:00";
    readonly "America/Nipigon": "-05:00";
    readonly "America/Nome": "-09:00";
    readonly "America/Noronha": "-02:00";
    readonly "America/North_Dakota/Beulah": "-06:00";
    readonly "America/North_Dakota/Center": "-06:00";
    readonly "America/North_Dakota/New_Salem": "-06:00";
    readonly "America/Ojinaga": "-07:00";
    readonly "America/Panama": "-05:00";
    readonly "America/Pangnirtung": "-05:00";
    readonly "America/Paramaribo": "-03:00";
    readonly "America/Phoenix": "-07:00";
    readonly "America/Port_of_Spain": "-04:00";
    readonly "America/Port-au-Prince": "-05:00";
    readonly "America/Porto_Acre": "-05:00";
    readonly "America/Porto_Velho": "-04:00";
    readonly "America/Puerto_Rico": "-04:00";
    readonly "America/Rainy_River": "-06:00";
    readonly "America/Rankin_Inlet": "-06:00";
    readonly "America/Recife": "-03:00";
    readonly "America/Regina": "-06:00";
    readonly "America/Resolute": "-06:00";
    readonly "America/Rio_Branco": "-05:00";
    readonly "America/Rosario": "-03:00";
    readonly "America/Santa_Isabel": "-08:00";
    readonly "America/Santarem": "-03:00";
    readonly "America/Santiago": "-03:00";
    readonly "America/Santo_Domingo": "-04:00";
    readonly "America/Sao_Paulo": "-03:00";
    readonly "America/Scoresbysund": "-01:00";
    readonly "America/Shiprock": "-07:00";
    readonly "America/Sitka": "-09:00";
    readonly "America/St_Barthelemy": "-04:00";
    readonly "America/St_Johns": "-03:30";
    readonly "America/St_Kitts": "-04:00";
    readonly "America/St_Lucia": "-04:00";
    readonly "America/St_Thomas": "-04:00";
    readonly "America/St_Vincent": "-04:00";
    readonly "America/Swift_Current": "-06:00";
    readonly "America/Tegucigalpa": "-06:00";
    readonly "America/Thule": "-04:00";
    readonly "America/Thunder_Bay": "-05:00";
    readonly "America/Tijuana": "-08:00";
    readonly "America/Toronto": "-05:00";
    readonly "America/Tortola": "-04:00";
    readonly "America/Vancouver": "-08:00";
    readonly "America/Virgin": "-04:00";
    readonly "America/Whitehorse": "-08:00";
    readonly "America/Winnipeg": "-06:00";
    readonly "America/Yakutat": "-09:00";
    readonly "America/Yellowknife": "-07:00";
    readonly "Antarctica/Casey": "+11:00";
    readonly "Antarctica/Davis": "+05:00";
    readonly "Antarctica/DumontDUrville": "+10:00";
    readonly "Antarctica/Macquarie": "+11:00";
    readonly "Antarctica/Mawson": "+05:00";
    readonly "Antarctica/McMurdo": "+12:00";
    readonly "Antarctica/Palmer": "-04:00";
    readonly "Antarctica/Rothera": "-03:00";
    readonly "Antarctica/South_Pole": "+12:00";
    readonly "Antarctica/Syowa": "+03:00";
    readonly "Antarctica/Troll": "+00:00";
    readonly "Antarctica/Vostok": "+06:00";
    readonly "Arctic/Longyearbyen": "+01:00";
    readonly "Asia/Aden": "+03:00";
    readonly "Asia/Almaty": "+06:00";
    readonly "Asia/Amman": "+02:00";
    readonly "Asia/Anadyr": "+12:00";
    readonly "Asia/Aqtau": "+05:00";
    readonly "Asia/Aqtobe": "+05:00";
    readonly "Asia/Ashgabat": "+05:00";
    readonly "Asia/Ashkhabad": "+05:00";
    readonly "Asia/Baghdad": "+03:00";
    readonly "Asia/Bahrain": "+03:00";
    readonly "Asia/Baku": "+04:00";
    readonly "Asia/Bangkok": "+07:00";
    readonly "Asia/Beirut": "+02:00";
    readonly "Asia/Bishkek": "+06:00";
    readonly "Asia/Brunei": "+08:00";
    readonly "Asia/Calcutta": "+05:30";
    readonly "Asia/Choibalsan": "+08:00";
    readonly "Asia/Chongqing": "+08:00";
    readonly "Asia/Chungking": "+08:00";
    readonly "Asia/Colombo": "+05:30";
    readonly "Asia/Dacca": "+06:00";
    readonly "Asia/Damascus": "+02:00";
    readonly "Asia/Dhaka": "+06:00";
    readonly "Asia/Dili": "+09:00";
    readonly "Asia/Dubai": "+04:00";
    readonly "Asia/Dushanbe": "+05:00";
    readonly "Asia/Gaza": "+02:00";
    readonly "Asia/Harbin": "+08:00";
    readonly "Asia/Hebron": "+02:00";
    readonly "Asia/Ho_Chi_Minh": "+07:00";
    readonly "Asia/Hong_Kong": "+08:00";
    readonly "Asia/Hovd": "+07:00";
    readonly "Asia/Irkutsk": "+08:00";
    readonly "Asia/Istanbul": "+02:00";
    readonly "Asia/Jakarta": "+07:00";
    readonly "Asia/Jayapura": "+09:00";
    readonly "Asia/Jerusalem": "+02:00";
    readonly "Asia/Kabul": "+04:30";
    readonly "Asia/Kamchatka": "+12:00";
    readonly "Asia/Karachi": "+05:00";
    readonly "Asia/Kashgar": "+08:00";
    readonly "Asia/Kathmandu": "+05:45";
    readonly "Asia/Katmandu": "+05:45";
    readonly "Asia/Khandyga": "+09:00";
    readonly "Asia/Kolkata": "+05:30";
    readonly "Asia/Krasnoyarsk": "+07:00";
    readonly "Asia/Kuala_Lumpur": "+08:00";
    readonly "Asia/Kuching": "+08:00";
    readonly "Asia/Kuwait": "+03:00";
    readonly "Asia/Macao": "+08:00";
    readonly "Asia/Macau": "+08:00";
    readonly "Asia/Magadan": "+10:00";
    readonly "Asia/Makassar": "+08:00";
    readonly "Asia/Manila": "+08:00";
    readonly "Asia/Muscat": "+04:00";
    readonly "Asia/Nicosia": "+02:00";
    readonly "Asia/Novokuznetsk": "+07:00";
    readonly "Asia/Novosibirsk": "+06:00";
    readonly "Asia/Omsk": "+06:00";
    readonly "Asia/Oral": "+05:00";
    readonly "Asia/Phnom_Penh": "+07:00";
    readonly "Asia/Pontianak": "+07:00";
    readonly "Asia/Pyongyang": "+09:00";
    readonly "Asia/Qatar": "+03:00";
    readonly "Asia/Qyzylorda": "+06:00";
    readonly "Asia/Rangoon": "+06:30";
    readonly "Asia/Riyadh": "+03:00";
    readonly "Asia/Saigon": "+07:00";
    readonly "Asia/Sakhalin": "+11:00";
    readonly "Asia/Samarkand": "+05:00";
    readonly "Asia/Seoul": "+09:00";
    readonly "Asia/Shanghai": "+08:00";
    readonly "Asia/Singapore": "+08:00";
    readonly "Asia/Taipei": "+08:00";
    readonly "Asia/Tashkent": "+05:00";
    readonly "Asia/Tbilisi": "+04:00";
    readonly "Asia/Tehran": "+03:30";
    readonly "Asia/Tel_Aviv": "+02:00";
    readonly "Asia/Thimbu": "+06:00";
    readonly "Asia/Thimphu": "+06:00";
    readonly "Asia/Tokyo": "+09:00";
    readonly "Asia/Ujung_Pandang": "+08:00";
    readonly "Asia/Ulaanbaatar": "+08:00";
    readonly "Asia/Ulan_Bator": "+08:00";
    readonly "Asia/Urumqi": "+08:00";
    readonly "Asia/Ust-Nera": "+10:00";
    readonly "Asia/Vientiane": "+07:00";
    readonly "Asia/Vladivostok": "+10:00";
    readonly "Asia/Yakutsk": "+09:00";
    readonly "Asia/Yekaterinburg": "+05:00";
    readonly "Asia/Yerevan": "+04:00";
    readonly "Atlantic/Azores": "-01:00";
    readonly "Atlantic/Bermuda": "-04:00";
    readonly "Atlantic/Canary": "+00:00";
    readonly "Atlantic/Cape_Verde": "-01:00";
    readonly "Atlantic/Faeroe": "+00:00";
    readonly "Atlantic/Faroe": "+00:00";
    readonly "Atlantic/Jan_Mayen": "+01:00";
    readonly "Atlantic/Madeira": "+00:00";
    readonly "Atlantic/Reykjavik": "+00:00";
    readonly "Atlantic/South_Georgia": "-02:00";
    readonly "Atlantic/St_Helena": "+00:00";
    readonly "Atlantic/Stanley": "-03:00";
    readonly "Australia/ACT": "+10:00";
    readonly "Australia/Adelaide": "+09:30";
    readonly "Australia/Brisbane": "+10:00";
    readonly "Australia/Broken_Hill": "+09:30";
    readonly "Australia/Canberra": "+10:00";
    readonly "Australia/Currie": "+10:00";
    readonly "Australia/Darwin": "+09:30";
    readonly "Australia/Eucla": "+08:45";
    readonly "Australia/Hobart": "+10:00";
    readonly "Australia/LHI": "+10:30";
    readonly "Australia/Lindeman": "+10:00";
    readonly "Australia/Lord_Howe": "+10:30";
    readonly "Australia/Melbourne": "+10:00";
    readonly "Australia/North": "+09:30";
    readonly "Australia/NSW": "+10:00";
    readonly "Australia/Perth": "+08:00";
    readonly "Australia/Queensland": "+10:00";
    readonly "Australia/South": "+09:30";
    readonly "Australia/Sydney": "+10:00";
    readonly "Australia/Tasmania": "+10:00";
    readonly "Australia/Victoria": "+10:00";
    readonly "Australia/West": "+08:00";
    readonly "Australia/Yancowinna": "+09:30";
    readonly "Brazil/Acre": "-05:00";
    readonly "Brazil/DeNoronha": "-02:00";
    readonly "Brazil/East": "-03:00";
    readonly "Brazil/West": "-04:00";
    readonly "Canada/Atlantic": "-04:00";
    readonly "Canada/Central": "-06:00";
    readonly "Canada/Eastern": "-05:00";
    readonly "Canada/East-Saskatchewan": "-06:00";
    readonly "Canada/Mountain": "-07:00";
    readonly "Canada/Newfoundland": "-03:30";
    readonly "Canada/Pacific": "-08:00";
    readonly "Canada/Saskatchewan": "-06:00";
    readonly "Canada/Yukon": "-08:00";
    readonly "Chile/Continental": "-03:00";
    readonly "Chile/EasterIsland": "-05:00";
    readonly Cuba: "-05:00";
    readonly Egypt: "+02:00";
    readonly Eire: "+00:00";
    readonly "Etc/GMT": "+00:00";
    readonly "Etc/GMT+0": "+00:00";
    readonly "Etc/UCT": "+00:00";
    readonly "Etc/Universal": "+00:00";
    readonly "Etc/UTC": "+00:00";
    readonly "Etc/Zulu": "+00:00";
    readonly "Europe/Amsterdam": "+01:00";
    readonly "Europe/Andorra": "+01:00";
    readonly "Europe/Athens": "+02:00";
    readonly "Europe/Belfast": "+00:00";
    readonly "Europe/Belgrade": "+01:00";
    readonly "Europe/Berlin": "+01:00";
    readonly "Europe/Bratislava": "+01:00";
    readonly "Europe/Brussels": "+01:00";
    readonly "Europe/Bucharest": "+02:00";
    readonly "Europe/Budapest": "+01:00";
    readonly "Europe/Busingen": "+01:00";
    readonly "Europe/Chisinau": "+02:00";
    readonly "Europe/Copenhagen": "+01:00";
    readonly "Europe/Dublin": "+00:00";
    readonly "Europe/Gibraltar": "+01:00";
    readonly "Europe/Guernsey": "+00:00";
    readonly "Europe/Helsinki": "+02:00";
    readonly "Europe/Isle_of_Man": "+00:00";
    readonly "Europe/Istanbul": "+02:00";
    readonly "Europe/Jersey": "+00:00";
    readonly "Europe/Kaliningrad": "+02:00";
    readonly "Europe/Kiev": "+02:00";
    readonly "Europe/Lisbon": "+00:00";
    readonly "Europe/Ljubljana": "+01:00";
    readonly "Europe/London": "+00:00";
    readonly "Europe/Luxembourg": "+01:00";
    readonly "Europe/Madrid": "+01:00";
    readonly "Europe/Malta": "+01:00";
    readonly "Europe/Mariehamn": "+02:00";
    readonly "Europe/Minsk": "+03:00";
    readonly "Europe/Monaco": "+01:00";
    readonly "Europe/Moscow": "+03:00";
    readonly "Europe/Nicosia": "+02:00";
    readonly "Europe/Oslo": "+01:00";
    readonly "Europe/Paris": "+01:00";
    readonly "Europe/Podgorica": "+01:00";
    readonly "Europe/Prague": "+01:00";
    readonly "Europe/Riga": "+02:00";
    readonly "Europe/Rome": "+01:00";
    readonly "Europe/Samara": "+04:00";
    readonly "Europe/San_Marino": "+01:00";
    readonly "Europe/Sarajevo": "+01:00";
    readonly "Europe/Simferopol": "+03:00";
    readonly "Europe/Skopje": "+01:00";
    readonly "Europe/Sofia": "+02:00";
    readonly "Europe/Stockholm": "+01:00";
    readonly "Europe/Tallinn": "+02:00";
    readonly "Europe/Tirane": "+01:00";
    readonly "Europe/Tiraspol": "+02:00";
    readonly "Europe/Uzhgorod": "+02:00";
    readonly "Europe/Vaduz": "+01:00";
    readonly "Europe/Vatican": "+01:00";
    readonly "Europe/Vienna": "+01:00";
    readonly "Europe/Vilnius": "+02:00";
    readonly "Europe/Volgograd": "+03:00";
    readonly "Europe/Warsaw": "+01:00";
    readonly "Europe/Zagreb": "+01:00";
    readonly "Europe/Zaporozhye": "+02:00";
    readonly "Europe/Zurich": "+01:00";
    readonly GB: "+00:00";
    readonly "GB-Eire": "+00:00";
    readonly GMT: "+00:00";
    readonly "GMT+0": "+00:00";
    readonly GMT0: "+00:00";
    readonly "GMT-0": "+00:00";
    readonly Greenwich: "+00:00";
    readonly Hongkong: "+08:00";
    readonly Iceland: "+00:00";
    readonly "Indian/Antananarivo": "+03:00";
    readonly "Indian/Chagos": "+06:00";
    readonly "Indian/Christmas": "+07:00";
    readonly "Indian/Cocos": "+06:30";
    readonly "Indian/Comoro": "+03:00";
    readonly "Indian/Kerguelen": "+05:00";
    readonly "Indian/Mahe": "+04:00";
    readonly "Indian/Maldives": "+05:00";
    readonly "Indian/Mauritius": "+04:00";
    readonly "Indian/Mayotte": "+03:00";
    readonly "Indian/Reunion": "+04:00";
    readonly Iran: "+03:30";
    readonly Israel: "+02:00";
    readonly Jamaica: "-05:00";
    readonly Japan: "+09:00";
    readonly Kwajalein: "+12:00";
    readonly Libya: "+02:00";
    readonly "Mexico/BajaNorte": "-08:00";
    readonly "Mexico/BajaSur": "-07:00";
    readonly "Mexico/General": "-06:00";
    readonly Navajo: "-07:00";
    readonly NZ: "+12:00";
    readonly "NZ-CHAT": "+12:45";
    readonly "Pacific/Apia": "+13:00";
    readonly "Pacific/Auckland": "+12:00";
    readonly "Pacific/Chatham": "+12:45";
    readonly "Pacific/Chuuk": "+10:00";
    readonly "Pacific/Easter": "-06:00";
    readonly "Pacific/Efate": "+11:00";
    readonly "Pacific/Enderbury": "+13:00";
    readonly "Pacific/Fakaofo": "+13:00";
    readonly "Pacific/Fiji": "+12:00";
    readonly "Pacific/Funafuti": "+12:00";
    readonly "Pacific/Galapagos": "-06:00";
    readonly "Pacific/Gambier": "-09:00";
    readonly "Pacific/Guadalcanal": "+11:00";
    readonly "Pacific/Guam": "+10:00";
    readonly "Pacific/Honolulu": "-10:00";
    readonly "Pacific/Johnston": "-10:00";
    readonly "Pacific/Kiritimati": "+14:00";
    readonly "Pacific/Kosrae": "+11:00";
    readonly "Pacific/Kwajalein": "+12:00";
    readonly "Pacific/Majuro": "+12:00";
    readonly "Pacific/Marquesas": "-09:30";
    readonly "Pacific/Midway": "-11:00";
    readonly "Pacific/Nauru": "+12:00";
    readonly "Pacific/Niue": "-11:00";
    readonly "Pacific/Norfolk": "+11:30";
    readonly "Pacific/Noumea": "+11:00";
    readonly "Pacific/Pago_Pago": "-11:00";
    readonly "Pacific/Palau": "+09:00";
    readonly "Pacific/Pitcairn": "-08:00";
    readonly "Pacific/Pohnpei": "+11:00";
    readonly "Pacific/Ponape": "+11:00";
    readonly "Pacific/Port_Moresby": "+10:00";
    readonly "Pacific/Rarotonga": "-10:00";
    readonly "Pacific/Saipan": "+10:00";
    readonly "Pacific/Samoa": "-11:00";
    readonly "Pacific/Tahiti": "-10:00";
    readonly "Pacific/Tarawa": "+12:00";
    readonly "Pacific/Tongatapu": "+13:00";
    readonly "Pacific/Truk": "+10:00";
    readonly "Pacific/Wake": "+12:00";
    readonly "Pacific/Wallis": "+12:00";
    readonly "Pacific/Yap": "+10:00";
    readonly Poland: "+01:00";
    readonly Portugal: "+00:00";
    readonly PRC: "+08:00";
    readonly ROC: "+08:00";
    readonly ROK: "+09:00";
    readonly Singapore: "+08:00";
    readonly Turkey: "+02:00";
    readonly UCT: "+00:00";
    readonly Universal: "+00:00";
    readonly "US/Alaska": "-09:00";
    readonly "US/Aleutian": "-10:00";
    readonly "US/Arizona": "-07:00";
    readonly "US/Central": "-06:00";
    readonly "US/Eastern": "-05:00";
    readonly "US/East-Indiana": "-05:00";
    readonly "US/Hawaii": "-10:00";
    readonly "US/Indiana-Starke": "-06:00";
    readonly "US/Michigan": "-05:00";
    readonly "US/Mountain": "-07:00";
    readonly "US/Pacific": "-08:00";
    readonly "US/Samoa": "-11:00";
    readonly UTC: "+00:00";
    readonly "W-SU": "+03:00";
    readonly Zulu: "+00:00";
};
export type Timezone = keyof typeof TIMEZONE_MAP;
export declare const TIMEZONES: ("GB" | "Africa/Abidjan" | "Africa/Accra" | "Africa/Addis_Ababa" | "Africa/Algiers" | "Africa/Asmara" | "Africa/Asmera" | "Africa/Bamako" | "Africa/Bangui" | "Africa/Banjul" | "Africa/Blantyre" | "Africa/Brazzaville" | "Africa/Bujumbura" | "Africa/Cairo" | "Africa/Casablanca" | "Africa/Ceuta" | "Africa/Conakry" | "Africa/Dakar" | "Africa/Dar_es_Salaam" | "Africa/Djibouti" | "Africa/Douala" | "Africa/El_Aaiun" | "Africa/Freetown" | "Africa/Gaborone" | "Africa/Harare" | "Africa/Johannesburg" | "Africa/Juba" | "Africa/Kampala" | "Africa/Khartoum" | "Africa/Kigali" | "Africa/Kinshasa" | "Africa/Lagos" | "Africa/Libreville" | "Africa/Lome" | "Africa/Luanda" | "Africa/Lubumbashi" | "Africa/Lusaka" | "Africa/Malabo" | "Africa/Maputo" | "Africa/Maseru" | "Africa/Mbabane" | "Africa/Mogadishu" | "Africa/Monrovia" | "Africa/Nairobi" | "Africa/Ndjamena" | "Africa/Niamey" | "Africa/Nouakchott" | "Africa/Ouagadougou" | "Africa/Porto-Novo" | "Africa/Sao_Tome" | "Africa/Timbuktu" | "Africa/Tripoli" | "Africa/Tunis" | "Africa/Windhoek" | "America/Adak" | "America/Anchorage" | "America/Anguilla" | "America/Antigua" | "America/Araguaina" | "America/Argentina/Buenos_Aires" | "America/Argentina/Catamarca" | "America/Argentina/ComodRivadavia" | "America/Argentina/Cordoba" | "America/Argentina/Jujuy" | "America/Argentina/La_Rioja" | "America/Argentina/Mendoza" | "America/Argentina/Rio_Gallegos" | "America/Argentina/Salta" | "America/Argentina/San_Juan" | "America/Argentina/San_Luis" | "America/Argentina/Tucuman" | "America/Argentina/Ushuaia" | "America/Aruba" | "America/Asuncion" | "America/Atikokan" | "America/Atka" | "America/Bahia" | "America/Bahia_Banderas" | "America/Barbados" | "America/Belem" | "America/Belize" | "America/Blanc-Sablon" | "America/Boa_Vista" | "America/Bogota" | "America/Boise" | "America/Buenos_Aires" | "America/Cambridge_Bay" | "America/Campo_Grande" | "America/Cancun" | "America/Caracas" | "America/Catamarca" | "America/Cayenne" | "America/Cayman" | "America/Chicago" | "America/Chihuahua" | "America/Coral_Harbour" | "America/Cordoba" | "America/Costa_Rica" | "America/Creston" | "America/Cuiaba" | "America/Curacao" | "America/Danmarkshavn" | "America/Dawson" | "America/Dawson_Creek" | "America/Denver" | "America/Detroit" | "America/Dominica" | "America/Edmonton" | "America/Eirunepe" | "America/El_Salvador" | "America/Ensenada" | "America/Fort_Wayne" | "America/Fortaleza" | "America/Glace_Bay" | "America/Godthab" | "America/Goose_Bay" | "America/Grand_Turk" | "America/Grenada" | "America/Guadeloupe" | "America/Guatemala" | "America/Guayaquil" | "America/Guyana" | "America/Halifax" | "America/Havana" | "America/Hermosillo" | "America/Indiana/Indianapolis" | "America/Indiana/Knox" | "America/Indiana/Marengo" | "America/Indiana/Petersburg" | "America/Indiana/Tell_City" | "America/Indiana/Valparaiso" | "America/Indiana/Vevay" | "America/Indiana/Vincennes" | "America/Indiana/Winamac" | "America/Indianapolis" | "America/Inuvik" | "America/Iqaluit" | "America/Jamaica" | "America/Jujuy" | "America/Juneau" | "America/Kentucky/Louisville" | "America/Kentucky/Monticello" | "America/Knox_IN" | "America/Kralendijk" | "America/La_Paz" | "America/Lima" | "America/Los_Angeles" | "America/Louisville" | "America/Lower_Princes" | "America/Maceio" | "America/Managua" | "America/Manaus" | "America/Marigot" | "America/Martinique" | "America/Matamoros" | "America/Mazatlan" | "America/Mendoza" | "America/Menominee" | "America/Merida" | "America/Metlakatla" | "America/Mexico_City" | "America/Miquelon" | "America/Moncton" | "America/Monterrey" | "America/Montevideo" | "America/Montreal" | "America/Montserrat" | "America/Nassau" | "America/New_York" | "America/Nipigon" | "America/Nome" | "America/Noronha" | "America/North_Dakota/Beulah" | "America/North_Dakota/Center" | "America/North_Dakota/New_Salem" | "America/Ojinaga" | "America/Panama" | "America/Pangnirtung" | "America/Paramaribo" | "America/Phoenix" | "America/Port_of_Spain" | "America/Port-au-Prince" | "America/Porto_Acre" | "America/Porto_Velho" | "America/Puerto_Rico" | "America/Rainy_River" | "America/Rankin_Inlet" | "America/Recife" | "America/Regina" | "America/Resolute" | "America/Rio_Branco" | "America/Rosario" | "America/Santa_Isabel" | "America/Santarem" | "America/Santiago" | "America/Santo_Domingo" | "America/Sao_Paulo" | "America/Scoresbysund" | "America/Shiprock" | "America/Sitka" | "America/St_Barthelemy" | "America/St_Johns" | "America/St_Kitts" | "America/St_Lucia" | "America/St_Thomas" | "America/St_Vincent" | "America/Swift_Current" | "America/Tegucigalpa" | "America/Thule" | "America/Thunder_Bay" | "America/Tijuana" | "America/Toronto" | "America/Tortola" | "America/Vancouver" | "America/Virgin" | "America/Whitehorse" | "America/Winnipeg" | "America/Yakutat" | "America/Yellowknife" | "Antarctica/Casey" | "Antarctica/Davis" | "Antarctica/DumontDUrville" | "Antarctica/Macquarie" | "Antarctica/Mawson" | "Antarctica/McMurdo" | "Antarctica/Palmer" | "Antarctica/Rothera" | "Antarctica/South_Pole" | "Antarctica/Syowa" | "Antarctica/Troll" | "Antarctica/Vostok" | "Arctic/Longyearbyen" | "Asia/Aden" | "Asia/Almaty" | "Asia/Amman" | "Asia/Anadyr" | "Asia/Aqtau" | "Asia/Aqtobe" | "Asia/Ashgabat" | "Asia/Ashkhabad" | "Asia/Baghdad" | "Asia/Bahrain" | "Asia/Baku" | "Asia/Bangkok" | "Asia/Beirut" | "Asia/Bishkek" | "Asia/Brunei" | "Asia/Calcutta" | "Asia/Choibalsan" | "Asia/Chongqing" | "Asia/Chungking" | "Asia/Colombo" | "Asia/Dacca" | "Asia/Damascus" | "Asia/Dhaka" | "Asia/Dili" | "Asia/Dubai" | "Asia/Dushanbe" | "Asia/Gaza" | "Asia/Harbin" | "Asia/Hebron" | "Asia/Ho_Chi_Minh" | "Asia/Hong_Kong" | "Asia/Hovd" | "Asia/Irkutsk" | "Asia/Istanbul" | "Asia/Jakarta" | "Asia/Jayapura" | "Asia/Jerusalem" | "Asia/Kabul" | "Asia/Kamchatka" | "Asia/Karachi" | "Asia/Kashgar" | "Asia/Kathmandu" | "Asia/Katmandu" | "Asia/Khandyga" | "Asia/Kolkata" | "Asia/Krasnoyarsk" | "Asia/Kuala_Lumpur" | "Asia/Kuching" | "Asia/Kuwait" | "Asia/Macao" | "Asia/Macau" | "Asia/Magadan" | "Asia/Makassar" | "Asia/Manila" | "Asia/Muscat" | "Asia/Nicosia" | "Asia/Novokuznetsk" | "Asia/Novosibirsk" | "Asia/Omsk" | "Asia/Oral" | "Asia/Phnom_Penh" | "Asia/Pontianak" | "Asia/Pyongyang" | "Asia/Qatar" | "Asia/Qyzylorda" | "Asia/Rangoon" | "Asia/Riyadh" | "Asia/Saigon" | "Asia/Sakhalin" | "Asia/Samarkand" | "Asia/Seoul" | "Asia/Shanghai" | "Asia/Singapore" | "Asia/Taipei" | "Asia/Tashkent" | "Asia/Tbilisi" | "Asia/Tehran" | "Asia/Tel_Aviv" | "Asia/Thimbu" | "Asia/Thimphu" | "Asia/Tokyo" | "Asia/Ujung_Pandang" | "Asia/Ulaanbaatar" | "Asia/Ulan_Bator" | "Asia/Urumqi" | "Asia/Ust-Nera" | "Asia/Vientiane" | "Asia/Vladivostok" | "Asia/Yakutsk" | "Asia/Yekaterinburg" | "Asia/Yerevan" | "Atlantic/Azores" | "Atlantic/Bermuda" | "Atlantic/Canary" | "Atlantic/Cape_Verde" | "Atlantic/Faeroe" | "Atlantic/Faroe" | "Atlantic/Jan_Mayen" | "Atlantic/Madeira" | "Atlantic/Reykjavik" | "Atlantic/South_Georgia" | "Atlantic/St_Helena" | "Atlantic/Stanley" | "Australia/ACT" | "Australia/Adelaide" | "Australia/Brisbane" | "Australia/Broken_Hill" | "Australia/Canberra" | "Australia/Currie" | "Australia/Darwin" | "Australia/Eucla" | "Australia/Hobart" | "Australia/LHI" | "Australia/Lindeman" | "Australia/Lord_Howe" | "Australia/Melbourne" | "Australia/North" | "Australia/NSW" | "Australia/Perth" | "Australia/Queensland" | "Australia/South" | "Australia/Sydney" | "Australia/Tasmania" | "Australia/Victoria" | "Australia/West" | "Australia/Yancowinna" | "Brazil/Acre" | "Brazil/DeNoronha" | "Brazil/East" | "Brazil/West" | "Canada/Atlantic" | "Canada/Central" | "Canada/Eastern" | "Canada/East-Saskatchewan" | "Canada/Mountain" | "Canada/Newfoundland" | "Canada/Pacific" | "Canada/Saskatchewan" | "Canada/Yukon" | "Chile/Continental" | "Chile/EasterIsland" | "Cuba" | "Egypt" | "Eire" | "Etc/GMT" | "Etc/GMT+0" | "Etc/UCT" | "Etc/Universal" | "Etc/UTC" | "Etc/Zulu" | "Europe/Amsterdam" | "Europe/Andorra" | "Europe/Athens" | "Europe/Belfast" | "Europe/Belgrade" | "Europe/Berlin" | "Europe/Bratislava" | "Europe/Brussels" | "Europe/Bucharest" | "Europe/Budapest" | "Europe/Busingen" | "Europe/Chisinau" | "Europe/Copenhagen" | "Europe/Dublin" | "Europe/Gibraltar" | "Europe/Guernsey" | "Europe/Helsinki" | "Europe/Isle_of_Man" | "Europe/Istanbul" | "Europe/Jersey" | "Europe/Kaliningrad" | "Europe/Kiev" | "Europe/Lisbon" | "Europe/Ljubljana" | "Europe/London" | "Europe/Luxembourg" | "Europe/Madrid" | "Europe/Malta" | "Europe/Mariehamn" | "Europe/Minsk" | "Europe/Monaco" | "Europe/Moscow" | "Europe/Nicosia" | "Europe/Oslo" | "Europe/Paris" | "Europe/Podgorica" | "Europe/Prague" | "Europe/Riga" | "Europe/Rome" | "Europe/Samara" | "Europe/San_Marino" | "Europe/Sarajevo" | "Europe/Simferopol" | "Europe/Skopje" | "Europe/Sofia" | "Europe/Stockholm" | "Europe/Tallinn" | "Europe/Tirane" | "Europe/Tiraspol" | "Europe/Uzhgorod" | "Europe/Vaduz" | "Europe/Vatican" | "Europe/Vienna" | "Europe/Vilnius" | "Europe/Volgograd" | "Europe/Warsaw" | "Europe/Zagreb" | "Europe/Zaporozhye" | "Europe/Zurich" | "GB-Eire" | "GMT" | "GMT+0" | "GMT0" | "GMT-0" | "Greenwich" | "Hongkong" | "Iceland" | "Indian/Antananarivo" | "Indian/Chagos" | "Indian/Christmas" | "Indian/Cocos" | "Indian/Comoro" | "Indian/Kerguelen" | "Indian/Mahe" | "Indian/Maldives" | "Indian/Mauritius" | "Indian/Mayotte" | "Indian/Reunion" | "Iran" | "Israel" | "Jamaica" | "Japan" | "Kwajalein" | "Libya" | "Mexico/BajaNorte" | "Mexico/BajaSur" | "Mexico/General" | "Navajo" | "NZ" | "NZ-CHAT" | "Pacific/Apia" | "Pacific/Auckland" | "Pacific/Chatham" | "Pacific/Chuuk" | "Pacific/Easter" | "Pacific/Efate" | "Pacific/Enderbury" | "Pacific/Fakaofo" | "Pacific/Fiji" | "Pacific/Funafuti" | "Pacific/Galapagos" | "Pacific/Gambier" | "Pacific/Guadalcanal" | "Pacific/Guam" | "Pacific/Honolulu" | "Pacific/Johnston" | "Pacific/Kiritimati" | "Pacific/Kosrae" | "Pacific/Kwajalein" | "Pacific/Majuro" | "Pacific/Marquesas" | "Pacific/Midway" | "Pacific/Nauru" | "Pacific/Niue" | "Pacific/Norfolk" | "Pacific/Noumea" | "Pacific/Pago_Pago" | "Pacific/Palau" | "Pacific/Pitcairn" | "Pacific/Pohnpei" | "Pacific/Ponape" | "Pacific/Port_Moresby" | "Pacific/Rarotonga" | "Pacific/Saipan" | "Pacific/Samoa" | "Pacific/Tahiti" | "Pacific/Tarawa" | "Pacific/Tongatapu" | "Pacific/Truk" | "Pacific/Wake" | "Pacific/Wallis" | "Pacific/Yap" | "Poland" | "Portugal" | "PRC" | "ROC" | "ROK" | "Singapore" | "Turkey" | "UCT" | "Universal" | "US/Alaska" | "US/Aleutian" | "US/Arizona" | "US/Central" | "US/Eastern" | "US/East-Indiana" | "US/Hawaii" | "US/Indiana-Starke" | "US/Michigan" | "US/Mountain" | "US/Pacific" | "US/Samoa" | "UTC" | "W-SU" | "Zulu")[];
export declare const TIMEZONES_USA: Timezone[];
export declare const VALID_STATES: string[];
export declare const USA_STATE_TO_TIMEZONE: {
    [index: string]: Timezone;
};
export type ExternalChatGPTMessage = {
    role: 'user' | 'assistant';
    content: string;
};
export type ChatGPTMessage = ExternalChatGPTMessage | {
    role: 'system';
    content: string;
};
export type ChatGPTModel = 'gpt-3.5-turbo' | 'gpt4';
export type CanvasBenefit = {
    type: {
        text: string;
    };
    allowedMoney?: {
        value: number;
    };
    allowedString?: {
        value: `${string}%`;
    };
    usedMoney?: {
        value: number;
    };
};
export type CanvasEligibility = {
    coverage: {
        reference: string;
        type: "Coverage";
    };
    item?: {
        name?: string;
        network?: {
            coding: {
                system: string;
                code: string;
                display: string;
            }[];
            text: string;
        };
        unit?: {
            coding: {
                system: string;
                code: string;
                display: string;
            }[];
            text: string;
        };
        benefit: CanvasBenefit[];
    }[];
};
export type GoGoMedsPet = {
    PetName: string;
    PetTypeId: number;
    OtherPetType?: string;
    PetWeight: string;
    Gender: "M" | "F" | "U" | "P";
    AllergyText?: string;
    MedicalConditionText?: string;
    CurrentMedications?: string;
};
export type DataSyncRecord = {
    businessId: string;
    organizationIds: string[];
    timestamp: Date;
    modelName: ModelName;
    recordId: string;
    data: 'deleted' | string;
    userIds: string[];
    enduserIds: string[];
};
export type InsuranceType = "Primary" | "Secondary";
export type TwilioQueue = {
    currentSize: number;
    friendlyName: string;
    averageWaitTime: number;
};
export type DevelopHealthDrug = {
    name: string;
    dosage: string;
    quantity: number;
};
export type DevelopHealthMockResult = {
    status: string;
    case: string;
};
export type DevelopHealthDiagnosis = {
    code: string;
};
export type DevelopHealthRunBenefitVerificationBaseArguments = {
    drugs: DevelopHealthDrug[];
    drug_history: {
        currently_taking_drugs: {
            name: string;
        }[];
        previously_taken_drugs: {
            name: string;
        }[];
    };
    diagnoses: DevelopHealthDiagnosis[];
    mock_result?: DevelopHealthMockResult;
    use_patient_plan_fund_source_check?: boolean;
};
export type ZendeskArticle = {
    id: number;
    html_url: string;
    title: string;
    body: string;
};
export type KendraSearchResult = {
    ResultItems: {
        Content: string;
        DocumentAttributes: ({
            Key: "_source_uri";
            Value: {
                StringValue: string;
            };
        })[];
        DocumentId: string;
        DocumentTitle: string;
        DocumentURI: string;
        ScoreAttributes: {
            ScoreConfidence: "VERY_HIGH" | "HIGH" | "MEDIUM" | "LOW" | "NOT_AVAILABLE";
        };
    }[];
};
export type HealthieWebhookEvent = {
    event_type: string;
};
export type HealthieWebhook = {
    id: string;
    url: string;
    is_enabled: boolean;
    webhook_events: HealthieWebhookEvent[];
};
//# sourceMappingURL=index.d.ts.map