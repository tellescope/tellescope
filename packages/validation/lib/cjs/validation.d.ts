/// <reference types="validator" />
import { ObjectId } from "@tellescope/utilities";
import { CUD as CUDType, CustomUpdateOptions, Indexable, JSONType } from "@tellescope/types-utilities";
import { FilterType, CustomField, Preference, JourneyState, JourneyStatePriority, EmailEncoding, ChatRoomType, MessageTemplateType, MeetingStatus, SessionType, AttendeeInfo, MeetingInfo, CUDSubscription, FormField, AutomationEventType, FormResponseAutomationEvent, AutomationForMessage, AutomatedActionStatus, ChatAttachment, FormFieldType, FormResponseValue, MessageTemplateMode, AtJourneyStateAutomationCondition, ChatRoomUserInfo, RelatedRecord, SearchOptions, AfterActionAutomationEvent, OnJourneyStartAutomationEvent, UnitOfTime, FormUnsubmittedEvent, CancelCondition, FormSubmitCancellationConditionInfo, NotificationPreference, ObservationStatusCode, ObservationValue, TicketCompletedAutomationEvent, FormResponseValueAnswer, PreviousFormFieldAfter, PreviousFormFieldRoot, FormResponseAnswerEmail, FormResponseAnswerFile, FormResponseAnswerMultipleChoice, FormResponseAnswerNumber, FormResponseAnswerPhone, FormResponseAnswerString, FormResponseAnswerSignature, OrganizationTheme, ManagedContentRecordType, FlowchartUI, PreviousFormFieldEquals, IntegrationAuthentication, FormResponseAnswerRating, FormResponseAnswerDate, FormResponseAnswerRanking, FormFieldOptions, BlockType, BlockContentH1, BlockContentHTML, BlockContentImage, BlockContentYoutube, BlockContentH2, PortalSettings, BlockContentPDF, OrganizationAccess, CalendarEventReminderNotificationInfo, PortalPage, PortalBlockForType, EnduserTaskForEvent, EnduserFormResponseForEvent, StateCredentialInfo, BaseAvailabilityBlock, WeeklyAvailability, MonthlyRestriction, FormType, FormResponseAnswerStringLong, ManagedContentRecordAssignmentType, GenericAttachment, CommunicationsChannel, AccessPermissions, AccessForResource, AccessType, BlockContentIFrame, OrganizationLimits, OrganizationSettings, GenericQuantityWithUnit, CustomEnduserFields, FormResponseAnswerDateString, TellescopeGender, AppointmentTerm, PaymentProcessor, FormsUnsubmittedEvent, FormResponsesAutomationEvent, JourneyContext, AnalyticsQueryForType, DateRange, FormResponseAnswerGroup, FormResponseAnswerDescription, FormResponseAnswerTable, TableInputChoices, CalendarEventPortalSettings, IndexUpdate, FormResponseAnswerAddress, ListQueryQualifier, AutomationTriggerEvents, AutomationTriggerActions, AutomationTriggerStatus, EnduserBuiltInField, AnalyticsQueryResultValue, AnalyticsQueryRange, SuperbillPatientInfo, SuperbillLineItem, VideoIntegrationType, VALID_STATES, ScheduledJourney, FormScoring, UserCallRoutingBehavior, UserUIRestrictions, ExternalChatGPTMessage, FormResponseAnswerTime, Insurance, EnduserFieldSetter, PhoneTreeNode, Enduser, FormResponseAnswerStripe, PhoneTreeEnduserCondition, WaitForTriggerAutomationEvent, FormResponseAnswerDropdown, ListOfStringsWithQualifier, FormResponseAnswerFiles, FormResponseAnswerDatabaseSelect, FormResponseAnswerMedications, Language, TableViewColumn, FormFieldCalloutCondition, EnduserReportQuery, FormResponsesReportQuery, TicketSnooze, FormResponseAnswerRelatedContacts, PreviousFormCompoundLogic, GroupMMSMessage, GroupMMSUserState, ImageAttachment, SortingField, TicketReminder, EnduserInsurance, FormResponseAnswerInsurance, Diagnosis, FormResponseAnswerAppointmentBooking, CanvasCoding, VitalConfigurationRange, SenderAssignmentStrategy, SmartMeterOrderLineItem, FormFieldFeedback, FormFieldOptionDetails, CandidProcedureCode, BasicWebhook, SyncDirection, AthenaFieldSync, AthenaSubscription, FormResponseAnswerHeight, FormResponseAnswerRedirect, BlockContentLink, FormResponseAnswerHiddenValue, LabeledField, FieldMapping, AnalyticsFrameGroupingCategory, FormResponseAnswerEmotii, BookingRestrictions, EnduserDiagnosis, FormResponseAnswerAllergies, FormResponseAnswerConditions, FormResponseAnswerRichText, FormResponseAnswerChargebee, RecentViewer, OnCallOutcomeAutomationEvent, FormResponseAnswerTimezone, OutOfOfficeBlock, OnAIDecisionAutomationEvent, OnErrorAutomationEvent, AIContextSource } from "@tellescope/types-models";
import { UserDisplayInfo } from "@tellescope/types-client";
export declare const isDate: typeof import("validator").isDate, isEmail: typeof import("validator/lib/isEmail").default, isMobilePhone: typeof import("validator").isMobilePhone, isSlug: typeof import("validator").isSlug, isMongoId: typeof import("validator").isMongoId, isMimeType: typeof import("validator").isMimeType, isURL: typeof import("validator/lib/isURL").default;
import { ACTIVE_CAMPAIGN_TITLE, ATHENA_TITLE, CANDID_TITLE, CANVAS_TITLE, DEVELOP_HEALTH_TITLE, DOCSUMO_TITLE, DOSESPOT_TITLE, EMOTII_TITLE, FULLSCRIPT_INTEGRATIONS_TITLE, GOGO_MEDS_TITLE, MFAX_TITLE, OUTLOOK_INTEGRATIONS_TITLE, PAGER_DUTY_TITLE, SMART_METER_TITLE, SQUARE_INTEGRATIONS_TITLE, STRIPE_TITLE, ZENDESK_INTEGRATIONS_TITLE, ZOHO_TITLE, ZOOM_TITLE, ZUS_TITLE } from "@tellescope/constants";
export interface ValidatorOptions {
    maxLength?: number;
    minLength?: number;
    shouldTruncate?: boolean;
    toLower?: boolean;
    isOptional?: boolean;
    emptyStringOk?: boolean;
    emptyListOk?: boolean;
    nullOk?: boolean;
    isObject?: boolean;
    isNumber?: boolean;
    listOf?: boolean;
    isBoolean?: boolean;
    errorMessage?: string;
    trim?: boolean;
    unique?: boolean;
    field?: string;
    escapeHTML?: boolean;
}
export interface ValidatorOptionsForValue extends ValidatorOptions {
    listOf?: false;
}
export interface ValidatorOptionsForList extends ValidatorOptions {
    listOf: true;
}
export type ValidatorOptionsUnion = ValidatorOptionsForValue | ValidatorOptionsForList;
export type EscapeWithOptions<R = any> = (o: ValidatorOptions) => (v: JSONType) => R;
export type EscapeFunction<R = any> = (v: JSONType) => R;
export type EscapeToList<R = any> = EscapeFunction<R[]>;
export type EscapeBuilder<R = any> = {
    (o?: ValidatorOptionsForValue): EscapeFunction<R>;
    (o?: ValidatorOptionsForList): EscapeFunction<R[]>;
};
export type ComplexEscapeBuilder<C, R = any> = (customization: C) => EscapeBuilder<R>;
export type ValidatorDefinition<R = any> = {
    validate: EscapeBuilder<R>;
    getType: () => string | object;
    getExample: () => string | number | boolean | object;
};
export type ValidatorBuilder<R = any, C = {}> = (options: ValidatorOptions & C) => ValidatorDefinition<R>;
export type InputValues<T> = {
    [K in keyof T]: JSONType;
};
export type InputValidation<T> = {
    [K in keyof T]: ValidatorDefinition;
};
export type InputValidationOld<T> = {
    [K in keyof T]: EscapeFunction;
};
export declare const MAX_FILE_SIZE = 1000000000;
type BuildValidator_T = {
    (escapeFunction: EscapeFunction, options: ValidatorOptionsForList): EscapeToList;
    (escapeFunction: EscapeFunction, options: ValidatorOptionsForValue): EscapeFunction;
};
export declare const build_validator: BuildValidator_T;
export declare const fieldsToValidationOld: <T>(fs: { [K in keyof T]: {
    validator: ValidatorDefinition;
    required?: boolean | undefined;
}; }) => InputValidationOld<T>;
export declare const binaryOrValidator: <A, B>(f1: EscapeFunction<A>, f2: EscapeFunction<B>) => EscapeBuilder<A | B>;
export declare const orValidator: <T>(validators: { [K in keyof T]: ValidatorDefinition<T[K]>; }, _o?: {
    isNumber?: boolean;
    isOptional?: boolean;
}) => ValidatorDefinition<T[keyof T]>;
export declare const filterCommandsValidator: EscapeBuilder<FilterType>;
export declare const convertCommand: (key: string, value: any) => {
    $exists: any;
    $lt?: undefined;
    $lte?: undefined;
    $gt?: undefined;
    $gte?: undefined;
    $all?: undefined;
    $in?: undefined;
    $nin?: undefined;
    $ne?: undefined;
} | {
    $lt: any;
    $exists?: undefined;
    $lte?: undefined;
    $gt?: undefined;
    $gte?: undefined;
    $all?: undefined;
    $in?: undefined;
    $nin?: undefined;
    $ne?: undefined;
} | {
    $lte: any;
    $exists?: undefined;
    $lt?: undefined;
    $gt?: undefined;
    $gte?: undefined;
    $all?: undefined;
    $in?: undefined;
    $nin?: undefined;
    $ne?: undefined;
} | {
    $gt: any;
    $exists?: undefined;
    $lt?: undefined;
    $lte?: undefined;
    $gte?: undefined;
    $all?: undefined;
    $in?: undefined;
    $nin?: undefined;
    $ne?: undefined;
} | {
    $gte: any;
    $exists?: undefined;
    $lt?: undefined;
    $lte?: undefined;
    $gt?: undefined;
    $all?: undefined;
    $in?: undefined;
    $nin?: undefined;
    $ne?: undefined;
} | {
    $all: any;
    $exists?: undefined;
    $lt?: undefined;
    $lte?: undefined;
    $gt?: undefined;
    $gte?: undefined;
    $in?: undefined;
    $nin?: undefined;
    $ne?: undefined;
} | {
    $in: any;
    $exists?: undefined;
    $lt?: undefined;
    $lte?: undefined;
    $gt?: undefined;
    $gte?: undefined;
    $all?: undefined;
    $nin?: undefined;
    $ne?: undefined;
} | {
    $nin: any;
    $exists?: undefined;
    $lt?: undefined;
    $lte?: undefined;
    $gt?: undefined;
    $gte?: undefined;
    $all?: undefined;
    $in?: undefined;
    $ne?: undefined;
} | {
    $ne: any;
    $exists?: undefined;
    $lt?: undefined;
    $lte?: undefined;
    $gt?: undefined;
    $gte?: undefined;
    $all?: undefined;
    $in?: undefined;
    $nin?: undefined;
} | null;
export declare const convertCommands: (operators: Indexable<any>) => Indexable<any>;
interface ObjectOptions {
    emptyOk?: boolean;
    isOptional?: boolean;
    throwOnUnrecognizedField?: boolean;
    inputModifier?: (i: any) => any;
}
export declare const objectValidatorOld: <T extends object>(i: InputValidationOld<Required<T>>, objectOptions?: ObjectOptions) => EscapeBuilder<T>;
export declare const listValidatorOld: <T>(b: EscapeFunction<T>) => EscapeBuilder<T[]>;
export declare const objectValidator: <T extends object | undefined>(i: InputValidation<Required<T>>, objectOptions?: ObjectOptions) => ValidatorDefinition<T>;
export declare const listOfObjectsValidator: <T extends object>(i: InputValidation<Required<T>>, objectOptions?: {
    emptyOk: boolean;
}) => ValidatorDefinition<T[]>;
export declare const objectAnyFieldsValidator: <T>(valueValidator?: ValidatorDefinition<T> | undefined) => ValidatorDefinition<Indexable<T>>;
export declare const objectAnyFieldsAnyValuesValidator: ValidatorDefinition<Indexable<unknown>>;
export declare const optionalEmptyObjectValidator: ValidatorDefinition<object>;
export declare const optionalAnyObjectValidator: ValidatorDefinition<object>;
export declare const escapeString: EscapeWithOptions<string>;
export declare const stringValidator: ValidatorDefinition<string>;
export declare const stringValidatorOptional: ValidatorDefinition<string>;
export declare const stringValidatorOptionalEmptyOkay: ValidatorDefinition<string>;
export declare const stringValidator5000OptionalEmptyOkay: ValidatorDefinition<string>;
export declare const stringValidator100: ValidatorDefinition<string>;
export declare const stringValidator100EscapeHTML: ValidatorDefinition<string>;
export declare const stringValidator250: ValidatorDefinition<string>;
export declare const stringValidator1000: ValidatorDefinition<string>;
export declare const stringValidator1000Optional: ValidatorDefinition<string>;
export declare const stringValidator5000: ValidatorDefinition<string>;
export declare const stringValidator20000ptional: ValidatorDefinition<string>;
export declare const stringValidator5000EmptyOkay: ValidatorDefinition<string>;
export declare const stringValidator5000Optional: ValidatorDefinition<string>;
export declare const stringValidator25000: ValidatorDefinition<string>;
export declare const stringValidator100000EmptyOkay: ValidatorDefinition<string>;
export declare const stringValidator100000OptionalEmptyOkay: ValidatorDefinition<string>;
export declare const stringValidator100000OptionalEmptyOkayEscapeHTML: ValidatorDefinition<string>;
export declare const stringValidator25000OptionalEmptyOkay: ValidatorDefinition<string>;
export declare const stringValidator25000EmptyOkay: ValidatorDefinition<string>;
export declare const SMSMessageValidator: ValidatorDefinition<string>;
export declare const listValidator: <T>(b: ValidatorDefinition<T>, _o?: ValidatorOptions | ValidatorOptionsForList) => ValidatorDefinition<T[]>;
export declare const listValidatorEmptyOk: <T>(b: ValidatorDefinition<T>, o?: ValidatorOptions) => ValidatorDefinition<T[]>;
export declare const listValidatorOptionalOrEmptyOk: <T>(b: ValidatorDefinition<T>, o?: ValidatorOptions) => ValidatorDefinition<T[]>;
export declare const listValidatorUnique: <T>(b: ValidatorDefinition<T>, _o?: ValidatorOptions | ValidatorOptionsForList) => ValidatorDefinition<T[]>;
export declare const listValidatorUniqueEmptyOkay: <T>(b: ValidatorDefinition<T>, _o?: ValidatorOptions | ValidatorOptionsForList) => ValidatorDefinition<T[]>;
export declare const listValidatorUniqueOptionalEmptyOkay: <T>(b: ValidatorDefinition<T>, _o?: ValidatorOptions | ValidatorOptionsForList) => ValidatorDefinition<T[]>;
export declare const listOfStringsValidator: ValidatorDefinition<string[]>;
export declare const listOfStringsValidatorOptionalOrEmptyOk: ValidatorDefinition<string[]>;
export declare const listOfStringsValidatorEmptyOk: ValidatorDefinition<string[]>;
export declare const listOfStringsValidatorUniqueOptionalOrEmptyOkay: ValidatorDefinition<string[]>;
export declare const listOfObjectAnyFieldsAnyValuesValidator: ValidatorDefinition<Indexable<unknown>[]>;
export declare const listOfUniqueStringsValidatorEmptyOk: ValidatorDefinition<string[]>;
export declare const booleanValidatorBuilder: ValidatorBuilder<boolean>;
export declare const booleanValidator: ValidatorDefinition<boolean>;
export declare const booleanValidatorOptional: ValidatorDefinition<boolean>;
export declare const escapeMongoId: EscapeFunction<string>;
export declare const mongoIdValidator: ValidatorDefinition<ObjectId>;
export declare const buildMongoIdStringValidator: ValidatorBuilder<string>;
export declare const nullValidator: EscapeBuilder<null>;
export declare const stringReadonlyValidator: ValidatorDefinition<string>;
export declare const mongoIdRequired: EscapeFunction<ObjectId>;
export declare const mongoIdOptional: EscapeFunction<ObjectId>;
export declare const listOfMongoIdValidator: ValidatorDefinition<ObjectId[]>;
export declare const mongoIdStringRequired: ValidatorDefinition<string>;
export declare const mongoIdStringOptional: ValidatorDefinition<string>;
export declare const listOfMongoIdStringValidator: ValidatorDefinition<string[]>;
export declare const listOfMongoIdStringValidatorOptional: ValidatorDefinition<string[]>;
export declare const listOfMongoIdStringValidatorEmptyOk: ValidatorDefinition<string[]>;
export declare const listOfMongoIdStringValidatorOptionalOrEmptyOk: ValidatorDefinition<string[]>;
export declare const sharedWithOrganizationIdsValidator: ValidatorDefinition<string[][]>;
export declare const slugValidator: ValidatorDefinition<string>;
export declare const first_letter_capitalized: (s?: string) => string;
export declare const escape_name: (namestring: string) => string;
export declare const nameValidator: ValidatorDefinition<string>;
export declare const emailValidator: ValidatorDefinition<string>;
export declare const emailValidatorOptional: ValidatorDefinition<string>;
export declare const emailValidatorEmptyOkay: ValidatorDefinition<string>;
export declare const numberValidatorBuilder: ValidatorBuilder<number, {
    lower: number;
    upper: number;
}>;
export declare const nonNegNumberValidator: ValidatorDefinition<number>;
export declare const positiveNumberValidator: ValidatorDefinition<number>;
export declare const numberValidator: ValidatorDefinition<number>;
export declare const numberValidatorOptional: ValidatorDefinition<number>;
export declare const listOfNumbersValidatorUniqueOptionalOrEmptyOkay: ValidatorDefinition<number[]>;
export declare const numberValidatorMin1Max31: ValidatorDefinition<number>;
export declare const numberValidatorMin0Max23Optional: ValidatorDefinition<number>;
export declare const numberValidatorMin0Max59Optional: ValidatorDefinition<number>;
export declare const fileSizeValidator: ValidatorDefinition<number>;
export declare const numberOrStringValidatorEmptyOkay: ValidatorDefinition<string | number>;
export declare const numberOrStringValidatorOptional: ValidatorDefinition<string | number>;
export declare const dateValidator: ValidatorDefinition<Date>;
export declare const dateOptionalOrEmptyStringValidator: ValidatorDefinition<Date>;
export declare const dateValidatorOptional: ValidatorDefinition<Date>;
export declare const dateRangeValidator: ValidatorDefinition<DateRange>;
export declare const dateRangeOptionalValidator: ValidatorDefinition<DateRange>;
export declare const exactMatchValidator: <T extends string | null>(matches: T[], options?: ValidatorOptions) => ValidatorDefinition<T>;
export declare const exactMatchValidatorOptional: <T extends string | null>(matches: T[]) => ValidatorDefinition<T>;
export declare const exactMatchListValidator: <T extends string | null>(matches: T[]) => ValidatorDefinition<T[]>;
export { VALID_STATES };
export declare const stateValidator: ValidatorDefinition<string>;
export declare const stateValidatorOptional: ValidatorDefinition<string>;
export declare const journeysValidator: ValidatorDefinition<Indexable>;
export declare const escape_phone_number: (p?: string) => string;
export declare const phoneValidator: ValidatorDefinition<string>;
export declare const phoneValidatorOptional: ValidatorDefinition<string>;
export declare const fileTypeValidator: ValidatorDefinition<string>;
export declare const urlValidator: ValidatorDefinition<string>;
export declare const safeBase64Validator: ValidatorDefinition<string>;
export declare const subdomainValidator: ValidatorDefinition<string>;
type FileResponse = {
    type: 'file';
    name: string;
    secureName: string;
};
export declare const fileResponseValidator: ValidatorDefinition<FileResponse>;
type SignatureResponse = {
    type: 'signature';
    signed: string | null;
    fullName: string;
};
export declare const signatureResponseValidator: ValidatorDefinition<SignatureResponse>;
export declare const labeledFieldsValidator: ValidatorDefinition<LabeledField[]>;
export declare const FORM_FIELD_TYPES: FormFieldType[];
export declare const formFieldTypeValidator: ValidatorDefinition<FormFieldType>;
export declare const FORM_FIELD_VALIDATORS_BY_TYPE: {
    [K in FormFieldType | 'userEmail' | 'phoneNumber']: (value?: FormResponseValueAnswer[keyof FormResponseValueAnswer], options?: any, isOptional?: boolean) => any;
};
export declare const fieldsValidator: ValidatorDefinition<Indexable<string | CustomField>>;
export declare const preferenceValidator: ValidatorDefinition<Preference>;
export declare const updateOptionsValidator: ValidatorDefinition<CustomUpdateOptions>;
export declare const journeyStatePriorityValidator: ValidatorDefinition<JourneyStatePriority>;
export declare const journeyStateValidator: ValidatorDefinition<JourneyState>;
export declare const journeyStatesValidator: ValidatorDefinition<JourneyState[]>;
export declare const emailEncodingValidator: ValidatorDefinition<EmailEncoding>;
export declare const validateIndexable: <V>(keyValidator: EscapeFunction<string | number>, valueValidator: EscapeFunction<V>) => EscapeBuilder<{
    [index: string]: V;
    [index: number]: V;
}>;
export declare const indexableValidator: <V>(keyValidator: ValidatorDefinition<string>, valueValidator: ValidatorDefinition<V>) => ValidatorDefinition<{
    [index: string]: V;
}>;
export declare const indexableNumberValidator: <V>(keyValidator: ValidatorDefinition<number>, valueValidator: ValidatorDefinition<V>) => ValidatorDefinition<{
    [index: number]: V;
}>;
export declare const rejectionWithMessage: EscapeBuilder<undefined>;
export declare const numberToDateValidator: ValidatorDefinition<{
    [index: number]: Date;
}>;
export declare const idStringToDateValidator: ValidatorDefinition<{
    [index: string]: Date;
}>;
export declare const RESERVED_INTAKE_FIELDS: string[];
export declare const INTERNAL_NAME_TO_DISPLAY_FIELD: {
    string: string;
    stringLong: string;
    file: string;
    dateString: string;
    date: string;
    rating: string;
    ranking: string;
    number: string;
    email: string;
    phone: string;
    multiple_choice: string;
    signature: string;
};
export declare const addressValidator: ValidatorDefinition<import("@tellescope/types-models").Address>;
export declare const addressOptionalValidator: ValidatorDefinition<import("@tellescope/types-models").Address>;
export declare const TELLESCOPE_GENDER: TellescopeGender[];
export declare const tellescopeGenderValidator: ValidatorDefinition<TellescopeGender>;
export declare const tellescopeGenderOptionalValidator: ValidatorDefinition<"" | TellescopeGender>;
export declare const insuranceOptionalValidator: ValidatorDefinition<EnduserInsurance>;
export declare const formResponseAnswerValidator: ValidatorDefinition<(FormResponseAnswerHeight & {
    type: "Height";
}) | (FormResponseAnswerAppointmentBooking & {
    type: "Appointment Booking";
}) | (FormResponseAnswerRedirect & {
    type: "Redirect";
}) | (FormResponseAnswerRelatedContacts & {
    type: "Related Contacts";
}) | (FormResponseAnswerInsurance & {
    type: "Insurance";
}) | (FormResponseAnswerGroup & {
    type: "Question Group";
}) | (FormResponseAnswerAddress & {
    type: "Address";
}) | (FormResponseAnswerTable & {
    type: "Table Input";
}) | (FormResponseAnswerDescription & {
    type: "description";
}) | (FormResponseAnswerEmail & {
    type: "email";
}) | (FormResponseAnswerNumber & {
    type: "number";
}) | (FormResponseAnswerRating & {
    type: "rating";
}) | (FormResponseAnswerPhone & {
    type: "phone";
}) | (FormResponseAnswerString & {
    type: "string";
}) | (FormResponseAnswerTime & {
    type: "Time";
}) | (FormResponseAnswerHiddenValue & {
    type: "Hidden Value";
}) | (FormResponseAnswerEmotii & {
    type: "Emotii";
}) | (FormResponseAnswerStripe & {
    type: "Stripe";
}) | (FormResponseAnswerTimezone & {
    type: "Timezone";
}) | (FormResponseAnswerStringLong & {
    type: "stringLong";
}) | (FormResponseAnswerRichText & {
    type: "Rich Text";
}) | (FormResponseAnswerDate & {
    type: "date";
}) | (FormResponseAnswerDateString & {
    type: "dateString";
}) | (FormResponseAnswerFile & {
    type: "file";
}) | (FormResponseAnswerFiles & {
    type: "files";
}) | (FormResponseAnswerMultipleChoice & {
    type: "multiple_choice";
}) | (FormResponseAnswerDropdown & {
    type: "Dropdown";
}) | (FormResponseAnswerRanking & {
    type: "ranking";
}) | (FormResponseAnswerSignature & {
    type: "signature";
}) | (FormResponseAnswerDatabaseSelect & {
    type: "Database Select";
}) | (FormResponseAnswerMedications & {
    type: "Medications";
}) | (FormResponseAnswerAllergies & {
    type: "Allergies";
}) | (FormResponseAnswerConditions & {
    type: "Conditions";
}) | (FormResponseAnswerChargebee & {
    type: "Chargebee";
})>;
export declare const mmddyyyyRegex: RegExp;
export declare const photonDisabledForEnduser: (enduser: Pick<Enduser, 'phone' | 'fname' | 'lname' | 'gender' | 'dateOfBirth'>) => boolean;
export declare const fullscriptDisabledForEnduser: (enduser: Pick<Enduser, 'email' | 'fname' | 'lname'>) => boolean;
export declare const formResponseValidator: ValidatorDefinition<FormResponseValue>;
export declare const formResponsesValidator: ValidatorDefinition<FormResponseValue[]>;
export declare const intakePhoneValidator: ValidatorDefinition<"required" | "optional" | "hidden">;
export declare const intakeDateOfBirthValidator: ValidatorDefinition<"required" | "optional" | "hidden">;
export declare const formFieldValidator: EscapeBuilder<FormField>;
export declare const listOfFormFieldsValidator: EscapeBuilder<FormField[]>;
export declare const CHAT_ROOM_TYPES: ChatRoomType[];
export declare const chatRoomTypeValidator: ValidatorDefinition<ChatRoomType>;
export declare const ACCOUNT_TYPES: string[];
export declare const accountTypeValidator: ValidatorDefinition<string>;
export declare const MESSAGE_TEMPLATE_TYPES: MessageTemplateType[];
export declare const messageTemplateTypeValidator: ValidatorDefinition<MessageTemplateType>;
export declare const MEETING_STATUSES: MeetingStatus[];
export declare const meetingStatusValidator: ValidatorDefinition<MeetingStatus>;
export declare const CUD: CUDType[];
export declare const CUDStringValidator: ValidatorDefinition<CUDType>;
export declare const CUDValidator: ValidatorDefinition<CUDSubscription>;
export declare const UNITS_OF_TIME: UnitOfTime[];
export declare const UnitOfTimeValidator: ValidatorDefinition<UnitOfTime>;
export declare const WebhookSubscriptionValidator: ValidatorDefinition<{
    journeys: CUDSubscription;
    files: CUDSubscription;
    inbox_threads: CUDSubscription;
    ai_conversations: CUDSubscription;
    waitlists: CUDSubscription;
    agent_records: CUDSubscription;
    enduser_eligibility_results: CUDSubscription;
    integration_logs: CUDSubscription;
    allergy_codes: CUDSubscription;
    diagnosis_codes: CUDSubscription;
    suggested_contacts: CUDSubscription;
    call_hold_queues: CUDSubscription;
    fax_logs: CUDSubscription;
    message_template_snippets: CUDSubscription;
    portal_brandings: CUDSubscription;
    form_groups: CUDSubscription;
    webhook_logs: CUDSubscription;
    flowchart_notes: CUDSubscription;
    enduser_problems: CUDSubscription;
    prescription_routes: CUDSubscription;
    blocked_phones: CUDSubscription;
    vital_configurations: CUDSubscription;
    enduser_encounters: CUDSubscription;
    enduser_orders: CUDSubscription;
    group_mms_conversations: CUDSubscription;
    ticket_queues: CUDSubscription;
    configurations: CUDSubscription;
    ticket_threads: CUDSubscription;
    ticket_thread_comments: CUDSubscription;
    enduser_custom_types: CUDSubscription;
    phone_trees: CUDSubscription;
    enduser_medications: CUDSubscription;
    superbill_providers: CUDSubscription;
    superbills: CUDSubscription;
    automation_triggers: CUDSubscription;
    background_errors: CUDSubscription;
    enduser_views: CUDSubscription;
    availability_blocks: CUDSubscription;
    analytics_frames: CUDSubscription;
    endusers: CUDSubscription;
    engagement_events: CUDSubscription;
    api_keys: CUDSubscription;
    emails: CUDSubscription;
    sms_messages: CUDSubscription;
    chat_rooms: CUDSubscription;
    chats: CUDSubscription;
    users: CUDSubscription;
    templates: CUDSubscription;
    tickets: CUDSubscription;
    meetings: CUDSubscription;
    notes: CUDSubscription;
    forms: CUDSubscription;
    form_fields: CUDSubscription;
    form_responses: CUDSubscription;
    calendar_events: CUDSubscription;
    calendar_event_templates: CUDSubscription;
    calendar_event_RSVPs: CUDSubscription;
    automation_steps: CUDSubscription;
    automated_actions: CUDSubscription;
    webhooks: CUDSubscription;
    user_logs: CUDSubscription;
    user_notifications: CUDSubscription;
    enduser_status_updates: CUDSubscription;
    enduser_observations: CUDSubscription;
    managed_content_records: CUDSubscription;
    managed_content_record_assignments: CUDSubscription;
    forums: CUDSubscription;
    forum_posts: CUDSubscription;
    post_likes: CUDSubscription;
    comment_likes: CUDSubscription;
    post_comments: CUDSubscription;
    organizations: CUDSubscription;
    integrations: CUDSubscription;
    databases: CUDSubscription;
    database_records: CUDSubscription;
    portal_customizations: CUDSubscription;
    enduser_tasks: CUDSubscription;
    care_plans: CUDSubscription;
    role_based_access_permissions: CUDSubscription;
    appointment_booking_pages: CUDSubscription;
    appointment_locations: CUDSubscription;
    products: CUDSubscription;
    purchases: CUDSubscription;
    purchase_credits: CUDSubscription;
    phone_calls: CUDSubscription;
    enduser_profile_views: CUDSubscription;
    table_views: CUDSubscription;
    email_sync_denials: CUDSubscription;
}>;
export declare const sessionTypeValidator: ValidatorDefinition<SessionType>;
export declare const sessionTypeOrAnyoneValidatorOptional: ValidatorDefinition<SessionType | "Anyone">;
export declare const listOfDisplayNameInfo: ValidatorDefinition<{
    fname: string;
    lname: string;
    id: string;
}[]>;
export declare const attendeeInfoValidator: ValidatorDefinition<AttendeeInfo>;
export declare const attendeeValidator: ValidatorDefinition<{
    type: SessionType;
    id: string;
    info: AttendeeInfo;
}>;
export declare const listOfAttendeesValidator: ValidatorDefinition<{
    type: SessionType;
    id: string;
    info: AttendeeInfo;
}[]>;
export declare const meetingInfoValidator: ValidatorDefinition<{
    Meeting: MeetingInfo;
}>;
export declare const userIdentityValidator: ValidatorDefinition<{
    type: SessionType;
    id: string;
}>;
export declare const listOfUserIndentitiesValidator: ValidatorDefinition<{
    type: SessionType;
    id: string;
}[]>;
export declare const calendarEventAttendeeValidator: ValidatorDefinition<{
    type: SessionType;
    id: string;
    joinLinkToken?: string | undefined;
}>;
export declare const calendarEventAttendeesValidator: ValidatorDefinition<{
    type: SessionType;
    id: string;
    joinLinkToken?: string | undefined;
}[]>;
export declare const chatAttachmentValidator: ValidatorDefinition<ChatAttachment>;
export declare const listOfChatAttachmentsValidator: ValidatorDefinition<ChatAttachment[]>;
export declare const genericAttachmentValidator: ValidatorDefinition<GenericAttachment>;
export declare const listOfGenericAttachmentsValidator: ValidatorDefinition<GenericAttachment[]>;
export declare const meetingsListValidator: ValidatorDefinition<{
    id: string;
    updatedAt: string;
    status: MeetingStatus;
}[]>;
export declare const userDisplayInfoValidator: ValidatorDefinition<UserDisplayInfo>;
export declare const meetingDisplayInfoValidator: ValidatorDefinition<{
    [index: string]: UserDisplayInfo;
}>;
export declare const chatRoomUserInfoValidator: ValidatorDefinition<Indexable<ChatRoomUserInfo>>;
export declare const LIST_QUERY_QUALIFIERS: ListQueryQualifier[];
export declare const listQueryQualifiersValidator: ValidatorDefinition<ListQueryQualifier>;
export declare const listOfStringsWithQualifierValidator: ValidatorDefinition<ListOfStringsWithQualifier>;
export declare const listOfStringsWithQualifierValidatorOptional: ValidatorDefinition<ListOfStringsWithQualifier>;
export declare const listOfStringsWithQualifierValidatorOptionalValuesEmptyOkay: ValidatorDefinition<ListOfStringsWithQualifier>;
export declare const AUTOMATION_ENDUSER_STATUS: AutomatedActionStatus[];
export declare const automatedActionStatusValidator: ValidatorDefinition<AutomatedActionStatus>;
export declare const AUTOMATION_EVENTS: AutomationEventType[];
export declare const automationEventTypeValidator: ValidatorDefinition<AutomationEventType>;
export declare const AUTOMATION_ACTIONS: (keyof import("@tellescope/types-models").AutomationActionForType)[];
export declare const automationActionTypeValidator: ValidatorDefinition<keyof import("@tellescope/types-models").AutomationActionForType>;
export declare const COMMUNICATIONS_CHANNELS: CommunicationsChannel[];
export declare const communicationsChannelValidator: ValidatorDefinition<CommunicationsChannel>;
export declare const communicationsChannelValidatorOptional: ValidatorDefinition<CommunicationsChannel>;
export declare const MESSAGE_TEMPLATE_MODES: MessageTemplateMode[];
export declare const messageTemplateModeValidator: ValidatorDefinition<MessageTemplateMode>;
export declare const calendarEventReminderValidator: ValidatorDefinition<{
    type: "webhook";
    info: {};
    msBeforeStartTime: number;
    dontSendIfPassed?: boolean | undefined;
    didRemind?: boolean | undefined;
    dontSendIfJoined?: boolean | undefined;
} | {
    type: "add-to-journey";
    info: {
        journeyId: string;
        firstAttendeeOnly?: boolean | undefined;
    };
    msBeforeStartTime: number;
    dontSendIfPassed?: boolean | undefined;
    didRemind?: boolean | undefined;
    dontSendIfJoined?: boolean | undefined;
} | {
    type: "Remove From Journey";
    info: {
        journeyId: string;
    };
    msBeforeStartTime: number;
    dontSendIfPassed?: boolean | undefined;
    didRemind?: boolean | undefined;
    dontSendIfJoined?: boolean | undefined;
} | {
    type: "enduser-notification";
    info: CalendarEventReminderNotificationInfo;
    msBeforeStartTime: number;
    dontSendIfPassed?: boolean | undefined;
    didRemind?: boolean | undefined;
    dontSendIfJoined?: boolean | undefined;
} | {
    type: "user-notification";
    info: CalendarEventReminderNotificationInfo;
    msBeforeStartTime: number;
    dontSendIfPassed?: boolean | undefined;
    didRemind?: boolean | undefined;
    dontSendIfJoined?: boolean | undefined;
} | {
    type: "create-ticket";
    info: {
        title: string;
    };
    msBeforeStartTime: number;
    dontSendIfPassed?: boolean | undefined;
    didRemind?: boolean | undefined;
    dontSendIfJoined?: boolean | undefined;
}>;
export declare const listOfCalendarEventRemindersValidator: ValidatorDefinition<({
    type: "webhook";
    info: {};
    msBeforeStartTime: number;
    dontSendIfPassed?: boolean | undefined;
    didRemind?: boolean | undefined;
    dontSendIfJoined?: boolean | undefined;
} | {
    type: "add-to-journey";
    info: {
        journeyId: string;
        firstAttendeeOnly?: boolean | undefined;
    };
    msBeforeStartTime: number;
    dontSendIfPassed?: boolean | undefined;
    didRemind?: boolean | undefined;
    dontSendIfJoined?: boolean | undefined;
} | {
    type: "Remove From Journey";
    info: {
        journeyId: string;
    };
    msBeforeStartTime: number;
    dontSendIfPassed?: boolean | undefined;
    didRemind?: boolean | undefined;
    dontSendIfJoined?: boolean | undefined;
} | {
    type: "enduser-notification";
    info: CalendarEventReminderNotificationInfo;
    msBeforeStartTime: number;
    dontSendIfPassed?: boolean | undefined;
    didRemind?: boolean | undefined;
    dontSendIfJoined?: boolean | undefined;
} | {
    type: "user-notification";
    info: CalendarEventReminderNotificationInfo;
    msBeforeStartTime: number;
    dontSendIfPassed?: boolean | undefined;
    didRemind?: boolean | undefined;
    dontSendIfJoined?: boolean | undefined;
} | {
    type: "create-ticket";
    info: {
        title: string;
    };
    msBeforeStartTime: number;
    dontSendIfPassed?: boolean | undefined;
    didRemind?: boolean | undefined;
    dontSendIfJoined?: boolean | undefined;
})[]>;
export declare const cancelConditionValidator: ValidatorDefinition<({
    type: "formResponse";
    info: FormSubmitCancellationConditionInfo;
} & {
    type: "formResponse";
}) | ({
    type: "formResponses";
    info: FormSubmitCancellationConditionInfo & {
        unsubmittedFormCount: number;
    };
} & {
    type: "formResponses";
})>;
export declare const cancelConditionsValidator: ValidatorDefinition<CancelCondition[]>;
export declare const cancelConditionsValidatorOptional: ValidatorDefinition<CancelCondition[]>;
export declare const automationEventValidator: ValidatorDefinition<(FormResponseAutomationEvent & {
    type: "formResponse";
}) | (FormResponsesAutomationEvent & {
    type: "formResponses";
}) | (AfterActionAutomationEvent & {
    type: "afterAction";
}) | (FormUnsubmittedEvent & {
    type: "formUnsubmitted";
}) | (FormsUnsubmittedEvent & {
    type: "formsUnsubmitted";
}) | (OnJourneyStartAutomationEvent & {
    type: "onJourneyStart";
}) | (TicketCompletedAutomationEvent & {
    type: "ticketCompleted";
}) | (WaitForTriggerAutomationEvent & {
    type: "waitForTrigger";
}) | (OnCallOutcomeAutomationEvent & {
    type: "onCallOutcome";
}) | (OnAIDecisionAutomationEvent & {
    type: "onAIDecision";
}) | (OnErrorAutomationEvent & {
    type: "onError";
})>;
export declare const automationEventsValidator: ValidatorDefinition<((FormResponseAutomationEvent & {
    type: "formResponse";
}) | (FormResponsesAutomationEvent & {
    type: "formResponses";
}) | (AfterActionAutomationEvent & {
    type: "afterAction";
}) | (FormUnsubmittedEvent & {
    type: "formUnsubmitted";
}) | (FormsUnsubmittedEvent & {
    type: "formsUnsubmitted";
}) | (OnJourneyStartAutomationEvent & {
    type: "onJourneyStart";
}) | (TicketCompletedAutomationEvent & {
    type: "ticketCompleted";
}) | (WaitForTriggerAutomationEvent & {
    type: "waitForTrigger";
}) | (OnCallOutcomeAutomationEvent & {
    type: "onCallOutcome";
}) | (OnAIDecisionAutomationEvent & {
    type: "onAIDecision";
}) | (OnErrorAutomationEvent & {
    type: "onError";
}))[]>;
export declare const automationConditionValidator: ValidatorDefinition<AtJourneyStateAutomationCondition & {
    type: "atJourneyState";
}>;
export declare const listOfAutomationConditionsValidator: ValidatorDefinition<(AtJourneyStateAutomationCondition & {
    type: "atJourneyState";
})[]>;
export declare const ticketReminderValidator: ValidatorDefinition<TicketReminder>;
export declare const ticketActionValidator: ValidatorDefinition<(import("@tellescope/types-models").TicketActionBuilder<"Complete Form", {
    formId: string;
    formResponseId?: string | undefined;
    bulkForEvent?: boolean | undefined;
}> & {
    type: "Complete Form";
}) | (import("@tellescope/types-models").TicketActionBuilder<"Create Prescription", {}> & {
    type: "Create Prescription";
}) | (import("@tellescope/types-models").TicketActionBuilder<"Send SMS", {
    templateId: string;
    smsId?: string | undefined;
    bulkForEvent?: boolean | undefined;
}> & {
    type: "Send SMS";
}) | (import("@tellescope/types-models").TicketActionBuilder<"Send Email", {
    templateId: string;
    emailId?: string | undefined;
}> & {
    type: "Send Email";
}) | (import("@tellescope/types-models").TicketActionBuilder<"Send Chat", {
    templateId: string;
    chatId?: string | undefined;
    chatRoomId?: string | undefined;
}> & {
    type: "Send Chat";
})>;
export declare const ticketActionsValidator: ValidatorDefinition<((import("@tellescope/types-models").TicketActionBuilder<"Complete Form", {
    formId: string;
    formResponseId?: string | undefined;
    bulkForEvent?: boolean | undefined;
}> & {
    type: "Complete Form";
}) | (import("@tellescope/types-models").TicketActionBuilder<"Create Prescription", {}> & {
    type: "Create Prescription";
}) | (import("@tellescope/types-models").TicketActionBuilder<"Send SMS", {
    templateId: string;
    smsId?: string | undefined;
    bulkForEvent?: boolean | undefined;
}> & {
    type: "Send SMS";
}) | (import("@tellescope/types-models").TicketActionBuilder<"Send Email", {
    templateId: string;
    emailId?: string | undefined;
}> & {
    type: "Send Email";
}) | (import("@tellescope/types-models").TicketActionBuilder<"Send Chat", {
    templateId: string;
    chatId?: string | undefined;
    chatRoomId?: string | undefined;
}> & {
    type: "Send Chat";
}))[]>;
export declare const senderAssignmentStrategyValidatorOptional: ValidatorDefinition<SenderAssignmentStrategy>;
export declare const smartMeterLinesValidator: ValidatorDefinition<SmartMeterOrderLineItem[]>;
export declare const automationForMessageValidator: ValidatorDefinition<AutomationForMessage>;
export declare const developHealthDrugsValidator: ValidatorDefinition<{
    name: string;
    dosage: string;
    quantity: number;
}[]>;
export declare const developHealthDiagnosesValidator: ValidatorDefinition<{
    code: string;
}[]>;
export declare const developHealthMockResultValidator: ValidatorDefinition<{
    status: string;
    case: string;
}>;
export declare const canvasCodingValidator: ValidatorDefinition<CanvasCoding>;
export declare const canvasCodingValidatorOptional: ValidatorDefinition<CanvasCoding>;
export declare const AIDecisionSourceValidator: ValidatorDefinition<AIContextSource>;
export declare const automationActionValidator: ValidatorDefinition<never>;
export declare const journeyContextValidator: ValidatorDefinition<JourneyContext>;
export declare const relatedRecordValidator: ValidatorDefinition<RelatedRecord>;
export declare const listOfRelatedRecordsValidator: ValidatorDefinition<RelatedRecord[]>;
export declare const relatedRecordsValidatorOptional: ValidatorDefinition<RelatedRecord[]>;
export declare const searchOptionsValidator: ValidatorDefinition<SearchOptions>;
export declare const notificationPreferenceValidator: ValidatorDefinition<NotificationPreference>;
export declare const notificationPreferencesValidator: ValidatorDefinition<Indexable<NotificationPreference>>;
export declare const FHIRObservationCategoryValidator: ValidatorDefinition<"vital-signs">;
export declare const FHIR_OBSERVATION_STATUS_CODES: ObservationStatusCode[];
export declare const FHIRObservationStatusCodeValidator: ValidatorDefinition<ObservationStatusCode>;
export declare const FHIRObservationValueValidator: ValidatorDefinition<ObservationValue>;
export declare const previousFormFieldValidator: ValidatorDefinition<(PreviousFormFieldRoot & {
    type: "root";
}) | (PreviousFormFieldAfter & {
    type: "after";
}) | (PreviousFormFieldEquals & {
    type: "previousEquals";
}) | (PreviousFormCompoundLogic & {
    type: "compoundLogic";
})>;
export declare const previousFormFieldsValidator: ValidatorDefinition<((PreviousFormFieldRoot & {
    type: "root";
}) | (PreviousFormFieldAfter & {
    type: "after";
}) | (PreviousFormFieldEquals & {
    type: "previousEquals";
}) | (PreviousFormCompoundLogic & {
    type: "compoundLogic";
}))[]>;
export declare const portalSettingsValidator: ValidatorDefinition<PortalSettings>;
export declare const customPoliciesValidator: ValidatorDefinition<{
    title: string;
    url: string;
}[]>;
export declare const organizationThemeValidator: ValidatorDefinition<OrganizationTheme>;
export declare const MANAGED_CONTENT_RECORD_TYPES: ManagedContentRecordType[];
export declare const managedContentRecordTypeValidator: ValidatorDefinition<ManagedContentRecordType>;
export declare const MANAGED_CONTENT_RECORD_ASSIGNMENT_TYPES: ManagedContentRecordAssignmentType[];
export declare const managedContentRecordAssignmentTypeValidator: ValidatorDefinition<ManagedContentRecordAssignmentType>;
export declare const passwordValidator: ValidatorDefinition<string>;
export declare const flowchartUIValidator: ValidatorDefinition<FlowchartUI>;
export declare const integrationAuthenticationsValidator: ValidatorDefinition<IntegrationAuthentication>;
export declare const TABLE_INPUT_TYPES: (keyof TableInputChoices)[];
export declare const tableInputTypesValidator: ValidatorDefinition<keyof TableInputChoices>;
export declare const tableInputChoiceValidator: ValidatorDefinition<import("@tellescope/types-models").TableChoiceBuilder<"Text", {}> | import("@tellescope/types-models").TableChoiceBuilder<"Date", {}> | import("@tellescope/types-models").TableChoiceBuilder<"Select", {
    choices: string[];
}> | import("@tellescope/types-models").TableChoiceBuilder<"Database", {
    databaseId: string;
    databaseLabel: string;
}>>;
export declare const formFieldFeedbackValidator: ValidatorDefinition<FormFieldFeedback>;
export declare const formFieldOptionDetailsValidator: ValidatorDefinition<FormFieldOptionDetails>;
export declare const formFieldOptionsValidator: ValidatorDefinition<FormFieldOptions>;
export declare const blockStyleValidator: ValidatorDefinition<{
    width: unknown;
    height: unknown;
    backgroundColor: unknown;
    borderColor: unknown;
    borderWidth: unknown;
    textColor: unknown;
}>;
export declare const blockValidator: ValidatorDefinition<(BlockContentH1 & {
    type: "h1";
}) | (BlockContentH2 & {
    type: "h2";
}) | (BlockContentHTML & {
    type: "html";
}) | (BlockContentImage & {
    type: "image";
}) | (BlockContentPDF & {
    type: "pdf";
}) | (BlockContentYoutube & {
    type: "youtube";
}) | (BlockContentIFrame & {
    type: "iframe";
}) | (BlockContentLink & {
    type: "content-link";
})>;
export declare const BLOCK_TYPES: BlockType[];
export declare const blockTypeValidator: ValidatorDefinition<BlockType>;
export declare const is_block_type: (type: any) => type is BlockType;
export declare const blocksValidator: ValidatorDefinition<((BlockContentH1 & {
    type: "h1";
}) | (BlockContentH2 & {
    type: "h2";
}) | (BlockContentHTML & {
    type: "html";
}) | (BlockContentImage & {
    type: "image";
}) | (BlockContentPDF & {
    type: "pdf";
}) | (BlockContentYoutube & {
    type: "youtube";
}) | (BlockContentIFrame & {
    type: "iframe";
}) | (BlockContentLink & {
    type: "content-link";
}))[]>;
export declare const DATABASE_RECORD_FIELD_TYPES: (keyof import("@tellescope/types-models").DatabaseRecordFieldsInfo)[];
export declare const databaseRecordFieldTypeValidator: ValidatorDefinition<keyof import("@tellescope/types-models").DatabaseRecordFieldsInfo>;
export declare const is_database_record_field_type: (type: any) => type is keyof import("@tellescope/types-models").DatabaseRecordFieldsInfo;
export declare const databaseFieldValidator: ValidatorDefinition<{
    type: "Text";
    label: string;
    showConditions?: Record<any, any> | undefined;
    required?: boolean | undefined;
    hideFromTable?: boolean | undefined;
    wrap?: string | undefined;
    options?: {
        width?: string | undefined;
    } | undefined;
} | {
    type: "Email";
    label: string;
    showConditions?: Record<any, any> | undefined;
    required?: boolean | undefined;
    hideFromTable?: boolean | undefined;
    wrap?: string | undefined;
    options?: {
        width?: string | undefined;
    } | undefined;
} | {
    type: "Phone";
    label: string;
    showConditions?: Record<any, any> | undefined;
    required?: boolean | undefined;
    hideFromTable?: boolean | undefined;
    wrap?: string | undefined;
    options?: {
        width?: string | undefined;
    } | undefined;
} | {
    type: "Text Long";
    label: string;
    showConditions?: Record<any, any> | undefined;
    required?: boolean | undefined;
    hideFromTable?: boolean | undefined;
    wrap?: string | undefined;
    options?: {
        width?: string | undefined;
    } | undefined;
} | {
    type: "Text List";
    label: string;
    showConditions?: Record<any, any> | undefined;
    required?: boolean | undefined;
    hideFromTable?: boolean | undefined;
    wrap?: string | undefined;
    options?: {
        width?: string | undefined;
    } | undefined;
} | {
    type: "Number";
    label: string;
    showConditions?: Record<any, any> | undefined;
    required?: boolean | undefined;
    hideFromTable?: boolean | undefined;
    wrap?: string | undefined;
    options?: {
        width?: string | undefined;
    } | undefined;
} | {
    type: "Address";
    label: string;
    showConditions?: Record<any, any> | undefined;
    required?: boolean | undefined;
    hideFromTable?: boolean | undefined;
    wrap?: string | undefined;
    options?: {
        width?: string | undefined;
    } | undefined;
} | {
    type: "Multiple Select";
    label: string;
    showConditions?: Record<any, any> | undefined;
    required?: boolean | undefined;
    hideFromTable?: boolean | undefined;
    wrap?: string | undefined;
    options?: ({
        options: string[];
    } & {
        width?: string | undefined;
    }) | undefined;
} | {
    type: "Dropdown";
    label: string;
    showConditions?: Record<any, any> | undefined;
    required?: boolean | undefined;
    hideFromTable?: boolean | undefined;
    wrap?: string | undefined;
    options?: ({
        options: string[];
    } & {
        width?: string | undefined;
    }) | undefined;
} | {
    type: "Timestamp";
    label: string;
    showConditions?: Record<any, any> | undefined;
    required?: boolean | undefined;
    hideFromTable?: boolean | undefined;
    wrap?: string | undefined;
    options?: {
        width?: string | undefined;
    } | undefined;
} | {
    type: "Date";
    label: string;
    showConditions?: Record<any, any> | undefined;
    required?: boolean | undefined;
    hideFromTable?: boolean | undefined;
    wrap?: string | undefined;
    options?: {
        width?: string | undefined;
    } | undefined;
}>;
export declare const databaseFieldsValidator: ValidatorDefinition<({
    type: "Text";
    label: string;
    showConditions?: Record<any, any> | undefined;
    required?: boolean | undefined;
    hideFromTable?: boolean | undefined;
    wrap?: string | undefined;
    options?: {
        width?: string | undefined;
    } | undefined;
} | {
    type: "Email";
    label: string;
    showConditions?: Record<any, any> | undefined;
    required?: boolean | undefined;
    hideFromTable?: boolean | undefined;
    wrap?: string | undefined;
    options?: {
        width?: string | undefined;
    } | undefined;
} | {
    type: "Phone";
    label: string;
    showConditions?: Record<any, any> | undefined;
    required?: boolean | undefined;
    hideFromTable?: boolean | undefined;
    wrap?: string | undefined;
    options?: {
        width?: string | undefined;
    } | undefined;
} | {
    type: "Text Long";
    label: string;
    showConditions?: Record<any, any> | undefined;
    required?: boolean | undefined;
    hideFromTable?: boolean | undefined;
    wrap?: string | undefined;
    options?: {
        width?: string | undefined;
    } | undefined;
} | {
    type: "Text List";
    label: string;
    showConditions?: Record<any, any> | undefined;
    required?: boolean | undefined;
    hideFromTable?: boolean | undefined;
    wrap?: string | undefined;
    options?: {
        width?: string | undefined;
    } | undefined;
} | {
    type: "Number";
    label: string;
    showConditions?: Record<any, any> | undefined;
    required?: boolean | undefined;
    hideFromTable?: boolean | undefined;
    wrap?: string | undefined;
    options?: {
        width?: string | undefined;
    } | undefined;
} | {
    type: "Address";
    label: string;
    showConditions?: Record<any, any> | undefined;
    required?: boolean | undefined;
    hideFromTable?: boolean | undefined;
    wrap?: string | undefined;
    options?: {
        width?: string | undefined;
    } | undefined;
} | {
    type: "Multiple Select";
    label: string;
    showConditions?: Record<any, any> | undefined;
    required?: boolean | undefined;
    hideFromTable?: boolean | undefined;
    wrap?: string | undefined;
    options?: ({
        options: string[];
    } & {
        width?: string | undefined;
    }) | undefined;
} | {
    type: "Dropdown";
    label: string;
    showConditions?: Record<any, any> | undefined;
    required?: boolean | undefined;
    hideFromTable?: boolean | undefined;
    wrap?: string | undefined;
    options?: ({
        options: string[];
    } & {
        width?: string | undefined;
    }) | undefined;
} | {
    type: "Timestamp";
    label: string;
    showConditions?: Record<any, any> | undefined;
    required?: boolean | undefined;
    hideFromTable?: boolean | undefined;
    wrap?: string | undefined;
    options?: {
        width?: string | undefined;
    } | undefined;
} | {
    type: "Date";
    label: string;
    showConditions?: Record<any, any> | undefined;
    required?: boolean | undefined;
    hideFromTable?: boolean | undefined;
    wrap?: string | undefined;
    options?: {
        width?: string | undefined;
    } | undefined;
})[]>;
export declare const databaseRecordValueValidator: ValidatorDefinition<{
    type: "Text";
    value: string;
    label: string;
} | {
    type: "Phone";
    value: string;
    label: string;
} | {
    type: "Email";
    value: string;
    label: string;
} | {
    type: "Text Long";
    value: string;
    label: string;
} | {
    type: "Text List";
    value: string[];
    label: string;
} | {
    type: "Number";
    value: number | "";
    label: string;
} | {
    type: "Address";
    value: import("@tellescope/types-models").Address | undefined;
    label: string;
} | {
    type: "Multiple Select";
    value: string[];
    label: string;
} | {
    type: "Dropdown";
    value: string;
    label: string;
} | {
    type: "Date";
    value: string;
    label: string;
} | {
    type: "Timestamp";
    value: string;
    label: string;
}>;
export declare const databaseRecordValuesValidator: ValidatorDefinition<({
    type: "Text";
    value: string;
    label: string;
} | {
    type: "Phone";
    value: string;
    label: string;
} | {
    type: "Email";
    value: string;
    label: string;
} | {
    type: "Text Long";
    value: string;
    label: string;
} | {
    type: "Text List";
    value: string[];
    label: string;
} | {
    type: "Number";
    value: number | "";
    label: string;
} | {
    type: "Address";
    value: import("@tellescope/types-models").Address | undefined;
    label: string;
} | {
    type: "Multiple Select";
    value: string[];
    label: string;
} | {
    type: "Dropdown";
    value: string;
    label: string;
} | {
    type: "Date";
    value: string;
    label: string;
} | {
    type: "Timestamp";
    value: string;
    label: string;
})[]>;
export declare const organizationAccessValidator: ValidatorDefinition<OrganizationAccess>;
export declare const PORTAL_PAGES: PortalPage[];
export declare const portalPageValidator: ValidatorDefinition<PortalPage>;
export declare const FORM_TYPES: FormType[];
export declare const formTypeValidator: ValidatorDefinition<FormType>;
export declare const portalBlockValidator: ValidatorDefinition<{
    type: "carePlan";
    info: {};
} | {
    type: "education";
    info: {};
} | {
    type: "Events";
    info: {};
} | {
    type: "careTeam";
    info: {
        title: string;
        roles?: string[] | undefined;
        showAll?: boolean | undefined;
        hideContactButton?: boolean | undefined;
    };
} | {
    type: "text";
    info: {
        text: string;
    };
} | {
    type: "chat";
    info: {};
} | {
    type: "Manage Subscription Button";
    info: {};
} | {
    type: "Orders";
    info: {};
} | {
    type: "HTML";
    info: {
        html: string;
    };
} | {
    type: "pinnedForms";
    info: {
        title?: string | undefined;
        formIds?: string[] | undefined;
    };
}>;
export declare const portalBlocksValidator: ValidatorDefinition<({
    type: "carePlan";
    info: {};
} | {
    type: "education";
    info: {};
} | {
    type: "Events";
    info: {};
} | {
    type: "careTeam";
    info: {
        title: string;
        roles?: string[] | undefined;
        showAll?: boolean | undefined;
        hideContactButton?: boolean | undefined;
    };
} | {
    type: "text";
    info: {
        text: string;
    };
} | {
    type: "chat";
    info: {};
} | {
    type: "Manage Subscription Button";
    info: {};
} | {
    type: "Orders";
    info: {};
} | {
    type: "HTML";
    info: {
        html: string;
    };
} | {
    type: "pinnedForms";
    info: {
        title?: string | undefined;
        formIds?: string[] | undefined;
    };
})[]>;
export declare const PORTAL_BLOCK_TYPES: (keyof PortalBlockForType)[];
export declare const portalTypeValidator: ValidatorDefinition<keyof PortalBlockForType>;
export declare const enduserTaskForEventValidator: ValidatorDefinition<EnduserTaskForEvent>;
export declare const enduserTasksForEventValidator: ValidatorDefinition<EnduserTaskForEvent[]>;
export declare const enduserFormResponseForEventValidator: ValidatorDefinition<EnduserFormResponseForEvent>;
export declare const enduserFormResponsesForEventValidator: ValidatorDefinition<EnduserFormResponseForEvent[]>;
export declare const genericUnitWithQuantityValidator: ValidatorDefinition<GenericQuantityWithUnit>;
export declare const stateCredentialValidator: ValidatorDefinition<StateCredentialInfo>;
export declare const stateCredentialsValidator: ValidatorDefinition<StateCredentialInfo[]>;
export declare const baseAvailabilityBlockValidator: ValidatorDefinition<BaseAvailabilityBlock>;
export declare const baseAvailabilityBlocksValidator: ValidatorDefinition<BaseAvailabilityBlock[]>;
export declare const monthlyRestrictionValidator: ValidatorDefinition<MonthlyRestriction>;
export declare const monthlyRestrictionOptionalValidator: ValidatorDefinition<MonthlyRestriction>;
export declare const weeklyAvailabilityValidator: ValidatorDefinition<WeeklyAvailability>;
export declare const weeklyAvailabilitiesValidator: ValidatorDefinition<WeeklyAvailability[]>;
export declare const timezoneValidator: ValidatorDefinition<"Africa/Abidjan" | "Africa/Accra" | "Africa/Addis_Ababa" | "Africa/Algiers" | "Africa/Asmara" | "Africa/Asmera" | "Africa/Bamako" | "Africa/Bangui" | "Africa/Banjul" | "Africa/Blantyre" | "Africa/Brazzaville" | "Africa/Bujumbura" | "Africa/Cairo" | "Africa/Casablanca" | "Africa/Ceuta" | "Africa/Conakry" | "Africa/Dakar" | "Africa/Dar_es_Salaam" | "Africa/Djibouti" | "Africa/Douala" | "Africa/El_Aaiun" | "Africa/Freetown" | "Africa/Gaborone" | "Africa/Harare" | "Africa/Johannesburg" | "Africa/Juba" | "Africa/Kampala" | "Africa/Khartoum" | "Africa/Kigali" | "Africa/Kinshasa" | "Africa/Lagos" | "Africa/Libreville" | "Africa/Lome" | "Africa/Luanda" | "Africa/Lubumbashi" | "Africa/Lusaka" | "Africa/Malabo" | "Africa/Maputo" | "Africa/Maseru" | "Africa/Mbabane" | "Africa/Mogadishu" | "Africa/Monrovia" | "Africa/Nairobi" | "Africa/Ndjamena" | "Africa/Niamey" | "Africa/Nouakchott" | "Africa/Ouagadougou" | "Africa/Porto-Novo" | "Africa/Sao_Tome" | "Africa/Timbuktu" | "Africa/Tripoli" | "Africa/Tunis" | "Africa/Windhoek" | "America/Adak" | "America/Anchorage" | "America/Anguilla" | "America/Antigua" | "America/Araguaina" | "America/Argentina/Buenos_Aires" | "America/Argentina/Catamarca" | "America/Argentina/ComodRivadavia" | "America/Argentina/Cordoba" | "America/Argentina/Jujuy" | "America/Argentina/La_Rioja" | "America/Argentina/Mendoza" | "America/Argentina/Rio_Gallegos" | "America/Argentina/Salta" | "America/Argentina/San_Juan" | "America/Argentina/San_Luis" | "America/Argentina/Tucuman" | "America/Argentina/Ushuaia" | "America/Aruba" | "America/Asuncion" | "America/Atikokan" | "America/Atka" | "America/Bahia" | "America/Bahia_Banderas" | "America/Barbados" | "America/Belem" | "America/Belize" | "America/Blanc-Sablon" | "America/Boa_Vista" | "America/Bogota" | "America/Boise" | "America/Buenos_Aires" | "America/Cambridge_Bay" | "America/Campo_Grande" | "America/Cancun" | "America/Caracas" | "America/Catamarca" | "America/Cayenne" | "America/Cayman" | "America/Chicago" | "America/Chihuahua" | "America/Coral_Harbour" | "America/Cordoba" | "America/Costa_Rica" | "America/Creston" | "America/Cuiaba" | "America/Curacao" | "America/Danmarkshavn" | "America/Dawson" | "America/Dawson_Creek" | "America/Denver" | "America/Detroit" | "America/Dominica" | "America/Edmonton" | "America/Eirunepe" | "America/El_Salvador" | "America/Ensenada" | "America/Fort_Wayne" | "America/Fortaleza" | "America/Glace_Bay" | "America/Godthab" | "America/Goose_Bay" | "America/Grand_Turk" | "America/Grenada" | "America/Guadeloupe" | "America/Guatemala" | "America/Guayaquil" | "America/Guyana" | "America/Halifax" | "America/Havana" | "America/Hermosillo" | "America/Indiana/Indianapolis" | "America/Indiana/Knox" | "America/Indiana/Marengo" | "America/Indiana/Petersburg" | "America/Indiana/Tell_City" | "America/Indiana/Valparaiso" | "America/Indiana/Vevay" | "America/Indiana/Vincennes" | "America/Indiana/Winamac" | "America/Indianapolis" | "America/Inuvik" | "America/Iqaluit" | "America/Jamaica" | "America/Jujuy" | "America/Juneau" | "America/Kentucky/Louisville" | "America/Kentucky/Monticello" | "America/Knox_IN" | "America/Kralendijk" | "America/La_Paz" | "America/Lima" | "America/Los_Angeles" | "America/Louisville" | "America/Lower_Princes" | "America/Maceio" | "America/Managua" | "America/Manaus" | "America/Marigot" | "America/Martinique" | "America/Matamoros" | "America/Mazatlan" | "America/Mendoza" | "America/Menominee" | "America/Merida" | "America/Metlakatla" | "America/Mexico_City" | "America/Miquelon" | "America/Moncton" | "America/Monterrey" | "America/Montevideo" | "America/Montreal" | "America/Montserrat" | "America/Nassau" | "America/New_York" | "America/Nipigon" | "America/Nome" | "America/Noronha" | "America/North_Dakota/Beulah" | "America/North_Dakota/Center" | "America/North_Dakota/New_Salem" | "America/Ojinaga" | "America/Panama" | "America/Pangnirtung" | "America/Paramaribo" | "America/Phoenix" | "America/Port_of_Spain" | "America/Port-au-Prince" | "America/Porto_Acre" | "America/Porto_Velho" | "America/Puerto_Rico" | "America/Rainy_River" | "America/Rankin_Inlet" | "America/Recife" | "America/Regina" | "America/Resolute" | "America/Rio_Branco" | "America/Rosario" | "America/Santa_Isabel" | "America/Santarem" | "America/Santiago" | "America/Santo_Domingo" | "America/Sao_Paulo" | "America/Scoresbysund" | "America/Shiprock" | "America/Sitka" | "America/St_Barthelemy" | "America/St_Johns" | "America/St_Kitts" | "America/St_Lucia" | "America/St_Thomas" | "America/St_Vincent" | "America/Swift_Current" | "America/Tegucigalpa" | "America/Thule" | "America/Thunder_Bay" | "America/Tijuana" | "America/Toronto" | "America/Tortola" | "America/Vancouver" | "America/Virgin" | "America/Whitehorse" | "America/Winnipeg" | "America/Yakutat" | "America/Yellowknife" | "Antarctica/Casey" | "Antarctica/Davis" | "Antarctica/DumontDUrville" | "Antarctica/Macquarie" | "Antarctica/Mawson" | "Antarctica/McMurdo" | "Antarctica/Palmer" | "Antarctica/Rothera" | "Antarctica/South_Pole" | "Antarctica/Syowa" | "Antarctica/Troll" | "Antarctica/Vostok" | "Arctic/Longyearbyen" | "Asia/Aden" | "Asia/Almaty" | "Asia/Amman" | "Asia/Anadyr" | "Asia/Aqtau" | "Asia/Aqtobe" | "Asia/Ashgabat" | "Asia/Ashkhabad" | "Asia/Baghdad" | "Asia/Bahrain" | "Asia/Baku" | "Asia/Bangkok" | "Asia/Beirut" | "Asia/Bishkek" | "Asia/Brunei" | "Asia/Calcutta" | "Asia/Choibalsan" | "Asia/Chongqing" | "Asia/Chungking" | "Asia/Colombo" | "Asia/Dacca" | "Asia/Damascus" | "Asia/Dhaka" | "Asia/Dili" | "Asia/Dubai" | "Asia/Dushanbe" | "Asia/Gaza" | "Asia/Harbin" | "Asia/Hebron" | "Asia/Ho_Chi_Minh" | "Asia/Hong_Kong" | "Asia/Hovd" | "Asia/Irkutsk" | "Asia/Istanbul" | "Asia/Jakarta" | "Asia/Jayapura" | "Asia/Jerusalem" | "Asia/Kabul" | "Asia/Kamchatka" | "Asia/Karachi" | "Asia/Kashgar" | "Asia/Kathmandu" | "Asia/Katmandu" | "Asia/Khandyga" | "Asia/Kolkata" | "Asia/Krasnoyarsk" | "Asia/Kuala_Lumpur" | "Asia/Kuching" | "Asia/Kuwait" | "Asia/Macao" | "Asia/Macau" | "Asia/Magadan" | "Asia/Makassar" | "Asia/Manila" | "Asia/Muscat" | "Asia/Nicosia" | "Asia/Novokuznetsk" | "Asia/Novosibirsk" | "Asia/Omsk" | "Asia/Oral" | "Asia/Phnom_Penh" | "Asia/Pontianak" | "Asia/Pyongyang" | "Asia/Qatar" | "Asia/Qyzylorda" | "Asia/Rangoon" | "Asia/Riyadh" | "Asia/Saigon" | "Asia/Sakhalin" | "Asia/Samarkand" | "Asia/Seoul" | "Asia/Shanghai" | "Asia/Singapore" | "Asia/Taipei" | "Asia/Tashkent" | "Asia/Tbilisi" | "Asia/Tehran" | "Asia/Tel_Aviv" | "Asia/Thimbu" | "Asia/Thimphu" | "Asia/Tokyo" | "Asia/Ujung_Pandang" | "Asia/Ulaanbaatar" | "Asia/Ulan_Bator" | "Asia/Urumqi" | "Asia/Ust-Nera" | "Asia/Vientiane" | "Asia/Vladivostok" | "Asia/Yakutsk" | "Asia/Yekaterinburg" | "Asia/Yerevan" | "Atlantic/Azores" | "Atlantic/Bermuda" | "Atlantic/Canary" | "Atlantic/Cape_Verde" | "Atlantic/Faeroe" | "Atlantic/Faroe" | "Atlantic/Jan_Mayen" | "Atlantic/Madeira" | "Atlantic/Reykjavik" | "Atlantic/South_Georgia" | "Atlantic/St_Helena" | "Atlantic/Stanley" | "Australia/ACT" | "Australia/Adelaide" | "Australia/Brisbane" | "Australia/Broken_Hill" | "Australia/Canberra" | "Australia/Currie" | "Australia/Darwin" | "Australia/Eucla" | "Australia/Hobart" | "Australia/LHI" | "Australia/Lindeman" | "Australia/Lord_Howe" | "Australia/Melbourne" | "Australia/North" | "Australia/NSW" | "Australia/Perth" | "Australia/Queensland" | "Australia/South" | "Australia/Sydney" | "Australia/Tasmania" | "Australia/Victoria" | "Australia/West" | "Australia/Yancowinna" | "Brazil/Acre" | "Brazil/DeNoronha" | "Brazil/East" | "Brazil/West" | "Canada/Atlantic" | "Canada/Central" | "Canada/Eastern" | "Canada/East-Saskatchewan" | "Canada/Mountain" | "Canada/Newfoundland" | "Canada/Pacific" | "Canada/Saskatchewan" | "Canada/Yukon" | "Chile/Continental" | "Chile/EasterIsland" | "Cuba" | "Egypt" | "Eire" | "Etc/GMT" | "Etc/GMT+0" | "Etc/UCT" | "Etc/Universal" | "Etc/UTC" | "Etc/Zulu" | "Europe/Amsterdam" | "Europe/Andorra" | "Europe/Athens" | "Europe/Belfast" | "Europe/Belgrade" | "Europe/Berlin" | "Europe/Bratislava" | "Europe/Brussels" | "Europe/Bucharest" | "Europe/Budapest" | "Europe/Busingen" | "Europe/Chisinau" | "Europe/Copenhagen" | "Europe/Dublin" | "Europe/Gibraltar" | "Europe/Guernsey" | "Europe/Helsinki" | "Europe/Isle_of_Man" | "Europe/Istanbul" | "Europe/Jersey" | "Europe/Kaliningrad" | "Europe/Kiev" | "Europe/Lisbon" | "Europe/Ljubljana" | "Europe/London" | "Europe/Luxembourg" | "Europe/Madrid" | "Europe/Malta" | "Europe/Mariehamn" | "Europe/Minsk" | "Europe/Monaco" | "Europe/Moscow" | "Europe/Nicosia" | "Europe/Oslo" | "Europe/Paris" | "Europe/Podgorica" | "Europe/Prague" | "Europe/Riga" | "Europe/Rome" | "Europe/Samara" | "Europe/San_Marino" | "Europe/Sarajevo" | "Europe/Simferopol" | "Europe/Skopje" | "Europe/Sofia" | "Europe/Stockholm" | "Europe/Tallinn" | "Europe/Tirane" | "Europe/Tiraspol" | "Europe/Uzhgorod" | "Europe/Vaduz" | "Europe/Vatican" | "Europe/Vienna" | "Europe/Vilnius" | "Europe/Volgograd" | "Europe/Warsaw" | "Europe/Zagreb" | "Europe/Zaporozhye" | "Europe/Zurich" | "GB" | "GB-Eire" | "GMT" | "GMT+0" | "GMT0" | "GMT-0" | "Greenwich" | "Hongkong" | "Iceland" | "Indian/Antananarivo" | "Indian/Chagos" | "Indian/Christmas" | "Indian/Cocos" | "Indian/Comoro" | "Indian/Kerguelen" | "Indian/Mahe" | "Indian/Maldives" | "Indian/Mauritius" | "Indian/Mayotte" | "Indian/Reunion" | "Iran" | "Israel" | "Jamaica" | "Japan" | "Kwajalein" | "Libya" | "Mexico/BajaNorte" | "Mexico/BajaSur" | "Mexico/General" | "Navajo" | "NZ" | "NZ-CHAT" | "Pacific/Apia" | "Pacific/Auckland" | "Pacific/Chatham" | "Pacific/Chuuk" | "Pacific/Easter" | "Pacific/Efate" | "Pacific/Enderbury" | "Pacific/Fakaofo" | "Pacific/Fiji" | "Pacific/Funafuti" | "Pacific/Galapagos" | "Pacific/Gambier" | "Pacific/Guadalcanal" | "Pacific/Guam" | "Pacific/Honolulu" | "Pacific/Johnston" | "Pacific/Kiritimati" | "Pacific/Kosrae" | "Pacific/Kwajalein" | "Pacific/Majuro" | "Pacific/Marquesas" | "Pacific/Midway" | "Pacific/Nauru" | "Pacific/Niue" | "Pacific/Norfolk" | "Pacific/Noumea" | "Pacific/Pago_Pago" | "Pacific/Palau" | "Pacific/Pitcairn" | "Pacific/Pohnpei" | "Pacific/Ponape" | "Pacific/Port_Moresby" | "Pacific/Rarotonga" | "Pacific/Saipan" | "Pacific/Samoa" | "Pacific/Tahiti" | "Pacific/Tarawa" | "Pacific/Tongatapu" | "Pacific/Truk" | "Pacific/Wake" | "Pacific/Wallis" | "Pacific/Yap" | "Poland" | "Portugal" | "PRC" | "ROC" | "ROK" | "Singapore" | "Turkey" | "UCT" | "Universal" | "US/Alaska" | "US/Aleutian" | "US/Arizona" | "US/Central" | "US/Eastern" | "US/East-Indiana" | "US/Hawaii" | "US/Indiana-Starke" | "US/Michigan" | "US/Mountain" | "US/Pacific" | "US/Samoa" | "UTC" | "W-SU" | "Zulu">;
export declare const timezoneValidatorOptional: ValidatorDefinition<"Africa/Abidjan" | "Africa/Accra" | "Africa/Addis_Ababa" | "Africa/Algiers" | "Africa/Asmara" | "Africa/Asmera" | "Africa/Bamako" | "Africa/Bangui" | "Africa/Banjul" | "Africa/Blantyre" | "Africa/Brazzaville" | "Africa/Bujumbura" | "Africa/Cairo" | "Africa/Casablanca" | "Africa/Ceuta" | "Africa/Conakry" | "Africa/Dakar" | "Africa/Dar_es_Salaam" | "Africa/Djibouti" | "Africa/Douala" | "Africa/El_Aaiun" | "Africa/Freetown" | "Africa/Gaborone" | "Africa/Harare" | "Africa/Johannesburg" | "Africa/Juba" | "Africa/Kampala" | "Africa/Khartoum" | "Africa/Kigali" | "Africa/Kinshasa" | "Africa/Lagos" | "Africa/Libreville" | "Africa/Lome" | "Africa/Luanda" | "Africa/Lubumbashi" | "Africa/Lusaka" | "Africa/Malabo" | "Africa/Maputo" | "Africa/Maseru" | "Africa/Mbabane" | "Africa/Mogadishu" | "Africa/Monrovia" | "Africa/Nairobi" | "Africa/Ndjamena" | "Africa/Niamey" | "Africa/Nouakchott" | "Africa/Ouagadougou" | "Africa/Porto-Novo" | "Africa/Sao_Tome" | "Africa/Timbuktu" | "Africa/Tripoli" | "Africa/Tunis" | "Africa/Windhoek" | "America/Adak" | "America/Anchorage" | "America/Anguilla" | "America/Antigua" | "America/Araguaina" | "America/Argentina/Buenos_Aires" | "America/Argentina/Catamarca" | "America/Argentina/ComodRivadavia" | "America/Argentina/Cordoba" | "America/Argentina/Jujuy" | "America/Argentina/La_Rioja" | "America/Argentina/Mendoza" | "America/Argentina/Rio_Gallegos" | "America/Argentina/Salta" | "America/Argentina/San_Juan" | "America/Argentina/San_Luis" | "America/Argentina/Tucuman" | "America/Argentina/Ushuaia" | "America/Aruba" | "America/Asuncion" | "America/Atikokan" | "America/Atka" | "America/Bahia" | "America/Bahia_Banderas" | "America/Barbados" | "America/Belem" | "America/Belize" | "America/Blanc-Sablon" | "America/Boa_Vista" | "America/Bogota" | "America/Boise" | "America/Buenos_Aires" | "America/Cambridge_Bay" | "America/Campo_Grande" | "America/Cancun" | "America/Caracas" | "America/Catamarca" | "America/Cayenne" | "America/Cayman" | "America/Chicago" | "America/Chihuahua" | "America/Coral_Harbour" | "America/Cordoba" | "America/Costa_Rica" | "America/Creston" | "America/Cuiaba" | "America/Curacao" | "America/Danmarkshavn" | "America/Dawson" | "America/Dawson_Creek" | "America/Denver" | "America/Detroit" | "America/Dominica" | "America/Edmonton" | "America/Eirunepe" | "America/El_Salvador" | "America/Ensenada" | "America/Fort_Wayne" | "America/Fortaleza" | "America/Glace_Bay" | "America/Godthab" | "America/Goose_Bay" | "America/Grand_Turk" | "America/Grenada" | "America/Guadeloupe" | "America/Guatemala" | "America/Guayaquil" | "America/Guyana" | "America/Halifax" | "America/Havana" | "America/Hermosillo" | "America/Indiana/Indianapolis" | "America/Indiana/Knox" | "America/Indiana/Marengo" | "America/Indiana/Petersburg" | "America/Indiana/Tell_City" | "America/Indiana/Valparaiso" | "America/Indiana/Vevay" | "America/Indiana/Vincennes" | "America/Indiana/Winamac" | "America/Indianapolis" | "America/Inuvik" | "America/Iqaluit" | "America/Jamaica" | "America/Jujuy" | "America/Juneau" | "America/Kentucky/Louisville" | "America/Kentucky/Monticello" | "America/Knox_IN" | "America/Kralendijk" | "America/La_Paz" | "America/Lima" | "America/Los_Angeles" | "America/Louisville" | "America/Lower_Princes" | "America/Maceio" | "America/Managua" | "America/Manaus" | "America/Marigot" | "America/Martinique" | "America/Matamoros" | "America/Mazatlan" | "America/Mendoza" | "America/Menominee" | "America/Merida" | "America/Metlakatla" | "America/Mexico_City" | "America/Miquelon" | "America/Moncton" | "America/Monterrey" | "America/Montevideo" | "America/Montreal" | "America/Montserrat" | "America/Nassau" | "America/New_York" | "America/Nipigon" | "America/Nome" | "America/Noronha" | "America/North_Dakota/Beulah" | "America/North_Dakota/Center" | "America/North_Dakota/New_Salem" | "America/Ojinaga" | "America/Panama" | "America/Pangnirtung" | "America/Paramaribo" | "America/Phoenix" | "America/Port_of_Spain" | "America/Port-au-Prince" | "America/Porto_Acre" | "America/Porto_Velho" | "America/Puerto_Rico" | "America/Rainy_River" | "America/Rankin_Inlet" | "America/Recife" | "America/Regina" | "America/Resolute" | "America/Rio_Branco" | "America/Rosario" | "America/Santa_Isabel" | "America/Santarem" | "America/Santiago" | "America/Santo_Domingo" | "America/Sao_Paulo" | "America/Scoresbysund" | "America/Shiprock" | "America/Sitka" | "America/St_Barthelemy" | "America/St_Johns" | "America/St_Kitts" | "America/St_Lucia" | "America/St_Thomas" | "America/St_Vincent" | "America/Swift_Current" | "America/Tegucigalpa" | "America/Thule" | "America/Thunder_Bay" | "America/Tijuana" | "America/Toronto" | "America/Tortola" | "America/Vancouver" | "America/Virgin" | "America/Whitehorse" | "America/Winnipeg" | "America/Yakutat" | "America/Yellowknife" | "Antarctica/Casey" | "Antarctica/Davis" | "Antarctica/DumontDUrville" | "Antarctica/Macquarie" | "Antarctica/Mawson" | "Antarctica/McMurdo" | "Antarctica/Palmer" | "Antarctica/Rothera" | "Antarctica/South_Pole" | "Antarctica/Syowa" | "Antarctica/Troll" | "Antarctica/Vostok" | "Arctic/Longyearbyen" | "Asia/Aden" | "Asia/Almaty" | "Asia/Amman" | "Asia/Anadyr" | "Asia/Aqtau" | "Asia/Aqtobe" | "Asia/Ashgabat" | "Asia/Ashkhabad" | "Asia/Baghdad" | "Asia/Bahrain" | "Asia/Baku" | "Asia/Bangkok" | "Asia/Beirut" | "Asia/Bishkek" | "Asia/Brunei" | "Asia/Calcutta" | "Asia/Choibalsan" | "Asia/Chongqing" | "Asia/Chungking" | "Asia/Colombo" | "Asia/Dacca" | "Asia/Damascus" | "Asia/Dhaka" | "Asia/Dili" | "Asia/Dubai" | "Asia/Dushanbe" | "Asia/Gaza" | "Asia/Harbin" | "Asia/Hebron" | "Asia/Ho_Chi_Minh" | "Asia/Hong_Kong" | "Asia/Hovd" | "Asia/Irkutsk" | "Asia/Istanbul" | "Asia/Jakarta" | "Asia/Jayapura" | "Asia/Jerusalem" | "Asia/Kabul" | "Asia/Kamchatka" | "Asia/Karachi" | "Asia/Kashgar" | "Asia/Kathmandu" | "Asia/Katmandu" | "Asia/Khandyga" | "Asia/Kolkata" | "Asia/Krasnoyarsk" | "Asia/Kuala_Lumpur" | "Asia/Kuching" | "Asia/Kuwait" | "Asia/Macao" | "Asia/Macau" | "Asia/Magadan" | "Asia/Makassar" | "Asia/Manila" | "Asia/Muscat" | "Asia/Nicosia" | "Asia/Novokuznetsk" | "Asia/Novosibirsk" | "Asia/Omsk" | "Asia/Oral" | "Asia/Phnom_Penh" | "Asia/Pontianak" | "Asia/Pyongyang" | "Asia/Qatar" | "Asia/Qyzylorda" | "Asia/Rangoon" | "Asia/Riyadh" | "Asia/Saigon" | "Asia/Sakhalin" | "Asia/Samarkand" | "Asia/Seoul" | "Asia/Shanghai" | "Asia/Singapore" | "Asia/Taipei" | "Asia/Tashkent" | "Asia/Tbilisi" | "Asia/Tehran" | "Asia/Tel_Aviv" | "Asia/Thimbu" | "Asia/Thimphu" | "Asia/Tokyo" | "Asia/Ujung_Pandang" | "Asia/Ulaanbaatar" | "Asia/Ulan_Bator" | "Asia/Urumqi" | "Asia/Ust-Nera" | "Asia/Vientiane" | "Asia/Vladivostok" | "Asia/Yakutsk" | "Asia/Yekaterinburg" | "Asia/Yerevan" | "Atlantic/Azores" | "Atlantic/Bermuda" | "Atlantic/Canary" | "Atlantic/Cape_Verde" | "Atlantic/Faeroe" | "Atlantic/Faroe" | "Atlantic/Jan_Mayen" | "Atlantic/Madeira" | "Atlantic/Reykjavik" | "Atlantic/South_Georgia" | "Atlantic/St_Helena" | "Atlantic/Stanley" | "Australia/ACT" | "Australia/Adelaide" | "Australia/Brisbane" | "Australia/Broken_Hill" | "Australia/Canberra" | "Australia/Currie" | "Australia/Darwin" | "Australia/Eucla" | "Australia/Hobart" | "Australia/LHI" | "Australia/Lindeman" | "Australia/Lord_Howe" | "Australia/Melbourne" | "Australia/North" | "Australia/NSW" | "Australia/Perth" | "Australia/Queensland" | "Australia/South" | "Australia/Sydney" | "Australia/Tasmania" | "Australia/Victoria" | "Australia/West" | "Australia/Yancowinna" | "Brazil/Acre" | "Brazil/DeNoronha" | "Brazil/East" | "Brazil/West" | "Canada/Atlantic" | "Canada/Central" | "Canada/Eastern" | "Canada/East-Saskatchewan" | "Canada/Mountain" | "Canada/Newfoundland" | "Canada/Pacific" | "Canada/Saskatchewan" | "Canada/Yukon" | "Chile/Continental" | "Chile/EasterIsland" | "Cuba" | "Egypt" | "Eire" | "Etc/GMT" | "Etc/GMT+0" | "Etc/UCT" | "Etc/Universal" | "Etc/UTC" | "Etc/Zulu" | "Europe/Amsterdam" | "Europe/Andorra" | "Europe/Athens" | "Europe/Belfast" | "Europe/Belgrade" | "Europe/Berlin" | "Europe/Bratislava" | "Europe/Brussels" | "Europe/Bucharest" | "Europe/Budapest" | "Europe/Busingen" | "Europe/Chisinau" | "Europe/Copenhagen" | "Europe/Dublin" | "Europe/Gibraltar" | "Europe/Guernsey" | "Europe/Helsinki" | "Europe/Isle_of_Man" | "Europe/Istanbul" | "Europe/Jersey" | "Europe/Kaliningrad" | "Europe/Kiev" | "Europe/Lisbon" | "Europe/Ljubljana" | "Europe/London" | "Europe/Luxembourg" | "Europe/Madrid" | "Europe/Malta" | "Europe/Mariehamn" | "Europe/Minsk" | "Europe/Monaco" | "Europe/Moscow" | "Europe/Nicosia" | "Europe/Oslo" | "Europe/Paris" | "Europe/Podgorica" | "Europe/Prague" | "Europe/Riga" | "Europe/Rome" | "Europe/Samara" | "Europe/San_Marino" | "Europe/Sarajevo" | "Europe/Simferopol" | "Europe/Skopje" | "Europe/Sofia" | "Europe/Stockholm" | "Europe/Tallinn" | "Europe/Tirane" | "Europe/Tiraspol" | "Europe/Uzhgorod" | "Europe/Vaduz" | "Europe/Vatican" | "Europe/Vienna" | "Europe/Vilnius" | "Europe/Volgograd" | "Europe/Warsaw" | "Europe/Zagreb" | "Europe/Zaporozhye" | "Europe/Zurich" | "GB" | "GB-Eire" | "GMT" | "GMT+0" | "GMT0" | "GMT-0" | "Greenwich" | "Hongkong" | "Iceland" | "Indian/Antananarivo" | "Indian/Chagos" | "Indian/Christmas" | "Indian/Cocos" | "Indian/Comoro" | "Indian/Kerguelen" | "Indian/Mahe" | "Indian/Maldives" | "Indian/Mauritius" | "Indian/Mayotte" | "Indian/Reunion" | "Iran" | "Israel" | "Jamaica" | "Japan" | "Kwajalein" | "Libya" | "Mexico/BajaNorte" | "Mexico/BajaSur" | "Mexico/General" | "Navajo" | "NZ" | "NZ-CHAT" | "Pacific/Apia" | "Pacific/Auckland" | "Pacific/Chatham" | "Pacific/Chuuk" | "Pacific/Easter" | "Pacific/Efate" | "Pacific/Enderbury" | "Pacific/Fakaofo" | "Pacific/Fiji" | "Pacific/Funafuti" | "Pacific/Galapagos" | "Pacific/Gambier" | "Pacific/Guadalcanal" | "Pacific/Guam" | "Pacific/Honolulu" | "Pacific/Johnston" | "Pacific/Kiritimati" | "Pacific/Kosrae" | "Pacific/Kwajalein" | "Pacific/Majuro" | "Pacific/Marquesas" | "Pacific/Midway" | "Pacific/Nauru" | "Pacific/Niue" | "Pacific/Norfolk" | "Pacific/Noumea" | "Pacific/Pago_Pago" | "Pacific/Palau" | "Pacific/Pitcairn" | "Pacific/Pohnpei" | "Pacific/Ponape" | "Pacific/Port_Moresby" | "Pacific/Rarotonga" | "Pacific/Saipan" | "Pacific/Samoa" | "Pacific/Tahiti" | "Pacific/Tarawa" | "Pacific/Tongatapu" | "Pacific/Truk" | "Pacific/Wake" | "Pacific/Wallis" | "Pacific/Yap" | "Poland" | "Portugal" | "PRC" | "ROC" | "ROK" | "Singapore" | "Turkey" | "UCT" | "Universal" | "US/Alaska" | "US/Aleutian" | "US/Arizona" | "US/Central" | "US/Eastern" | "US/East-Indiana" | "US/Hawaii" | "US/Indiana-Starke" | "US/Michigan" | "US/Mountain" | "US/Pacific" | "US/Samoa" | "UTC" | "W-SU" | "Zulu">;
export declare const accessValidator: ValidatorDefinition<AccessType>;
export declare const CUSTOM_ENDUSER_FIELD_TYPES: (keyof CustomEnduserFields)[];
export declare const customEnduserFieldTypeValidator: ValidatorDefinition<keyof CustomEnduserFields>;
export declare const AVAILABILITY_BLOCK_ENTITIES: ("user" | "organization")[];
export declare const availabilityEntitiesValidator: ValidatorDefinition<"user" | "organization">;
export declare const indexUpdateValidator: ValidatorDefinition<IndexUpdate>;
export declare const indexUpdatesValidator: ValidatorDefinition<IndexUpdate[]>;
export declare const customEnduserFieldValidator: ValidatorDefinition<{
    type: "Select";
    info: {
        options: string[];
        other?: boolean | undefined;
    };
    field: string;
    required?: boolean | undefined;
    hiddenFromProfile?: boolean | undefined;
    requireConfirmation?: boolean | undefined;
    tags?: string[] | undefined;
} | {
    type: "Multiple Select";
    info: {
        options: string[];
    };
    field: string;
    required?: boolean | undefined;
    hiddenFromProfile?: boolean | undefined;
    requireConfirmation?: boolean | undefined;
    tags?: string[] | undefined;
} | {
    type: "Text";
    info: {};
    field: string;
    required?: boolean | undefined;
    hiddenFromProfile?: boolean | undefined;
    requireConfirmation?: boolean | undefined;
    tags?: string[] | undefined;
} | {
    type: "Number";
    info: {};
    field: string;
    required?: boolean | undefined;
    hiddenFromProfile?: boolean | undefined;
    requireConfirmation?: boolean | undefined;
    tags?: string[] | undefined;
} | {
    type: "File";
    info: {};
    field: string;
    required?: boolean | undefined;
    hiddenFromProfile?: boolean | undefined;
    requireConfirmation?: boolean | undefined;
    tags?: string[] | undefined;
} | {
    type: "Multiple Text";
    info: {};
    field: string;
    required?: boolean | undefined;
    hiddenFromProfile?: boolean | undefined;
    requireConfirmation?: boolean | undefined;
    tags?: string[] | undefined;
} | {
    type: "Date";
    info: {};
    field: string;
    required?: boolean | undefined;
    hiddenFromProfile?: boolean | undefined;
    requireConfirmation?: boolean | undefined;
    tags?: string[] | undefined;
} | {
    type: "Auto Detect";
    info: {};
    field: string;
    required?: boolean | undefined;
    hiddenFromProfile?: boolean | undefined;
    requireConfirmation?: boolean | undefined;
    tags?: string[] | undefined;
} | {
    type: "Table";
    info: {
        columns: import("@tellescope/types-models").TableInputChoice[];
    };
    field: string;
    required?: boolean | undefined;
    hiddenFromProfile?: boolean | undefined;
    requireConfirmation?: boolean | undefined;
    tags?: string[] | undefined;
} | {
    type: "Checkbox";
    info: {};
    field: string;
    required?: boolean | undefined;
    hiddenFromProfile?: boolean | undefined;
    requireConfirmation?: boolean | undefined;
    tags?: string[] | undefined;
} | {
    type: "Database Select";
    info: {
        databaseId: string;
        columns: string[];
    };
    field: string;
    required?: boolean | undefined;
    hiddenFromProfile?: boolean | undefined;
    requireConfirmation?: boolean | undefined;
    tags?: string[] | undefined;
}>;
export declare const customEnduserFieldsValidatorOptionalOrEmpty: ValidatorDefinition<({
    type: "Select";
    info: {
        options: string[];
        other?: boolean | undefined;
    };
    field: string;
    required?: boolean | undefined;
    hiddenFromProfile?: boolean | undefined;
    requireConfirmation?: boolean | undefined;
    tags?: string[] | undefined;
} | {
    type: "Multiple Select";
    info: {
        options: string[];
    };
    field: string;
    required?: boolean | undefined;
    hiddenFromProfile?: boolean | undefined;
    requireConfirmation?: boolean | undefined;
    tags?: string[] | undefined;
} | {
    type: "Text";
    info: {};
    field: string;
    required?: boolean | undefined;
    hiddenFromProfile?: boolean | undefined;
    requireConfirmation?: boolean | undefined;
    tags?: string[] | undefined;
} | {
    type: "Number";
    info: {};
    field: string;
    required?: boolean | undefined;
    hiddenFromProfile?: boolean | undefined;
    requireConfirmation?: boolean | undefined;
    tags?: string[] | undefined;
} | {
    type: "File";
    info: {};
    field: string;
    required?: boolean | undefined;
    hiddenFromProfile?: boolean | undefined;
    requireConfirmation?: boolean | undefined;
    tags?: string[] | undefined;
} | {
    type: "Multiple Text";
    info: {};
    field: string;
    required?: boolean | undefined;
    hiddenFromProfile?: boolean | undefined;
    requireConfirmation?: boolean | undefined;
    tags?: string[] | undefined;
} | {
    type: "Date";
    info: {};
    field: string;
    required?: boolean | undefined;
    hiddenFromProfile?: boolean | undefined;
    requireConfirmation?: boolean | undefined;
    tags?: string[] | undefined;
} | {
    type: "Auto Detect";
    info: {};
    field: string;
    required?: boolean | undefined;
    hiddenFromProfile?: boolean | undefined;
    requireConfirmation?: boolean | undefined;
    tags?: string[] | undefined;
} | {
    type: "Table";
    info: {
        columns: import("@tellescope/types-models").TableInputChoice[];
    };
    field: string;
    required?: boolean | undefined;
    hiddenFromProfile?: boolean | undefined;
    requireConfirmation?: boolean | undefined;
    tags?: string[] | undefined;
} | {
    type: "Checkbox";
    info: {};
    field: string;
    required?: boolean | undefined;
    hiddenFromProfile?: boolean | undefined;
    requireConfirmation?: boolean | undefined;
    tags?: string[] | undefined;
} | {
    type: "Database Select";
    info: {
        databaseId: string;
        columns: string[];
    };
    field: string;
    required?: boolean | undefined;
    hiddenFromProfile?: boolean | undefined;
    requireConfirmation?: boolean | undefined;
    tags?: string[] | undefined;
})[]>;
export declare const buildInFieldsValidator: ValidatorDefinition<EnduserBuiltInField[]>;
export declare const customDashboardViewValidator: ValidatorDefinition<import("@tellescope/types-models").CustomDashboardView | undefined>;
export declare const organizationSettingsValidator: ValidatorDefinition<OrganizationSettings>;
export declare const calendarEventPortalSettingsValidator: ValidatorDefinition<CalendarEventPortalSettings>;
export declare const vitalComparisonValidator: ValidatorDefinition<{
    type: "Less Than";
    value: number;
} | {
    type: "Greater Than";
    value: number;
} | {
    type: "Between";
    value: {
        lower: number;
        upper: number;
    };
}>;
export declare const vitalConfigurationRangeValidator: ValidatorDefinition<VitalConfigurationRange>;
export declare const vitalConfigurationRangesValidator: ValidatorDefinition<VitalConfigurationRange[]>;
export declare const AUTOMATION_TRIGGER_EVENT_TYPES: (keyof AutomationTriggerEvents)[];
export declare const automationTriggerEventValidator: ValidatorDefinition<import("@tellescope/types-models").AutomationTriggerEventBuilder<"Form Submitted", {
    formId: string;
    otherFormIds?: string[] | undefined;
    submitterType?: SessionType | "Anyone" | undefined;
    publicIdentifier?: string | undefined;
    hasExpiredEvent?: boolean | undefined;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Form Unsubmitted", {
    formId: string;
    intervalInMS: number;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Form Started", {
    formIds?: string[] | undefined;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Field Equals", {
    field: string;
    value: string;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Fields Changed", {
    fields: string[];
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Contact Created", {
    entityTypes?: string[] | undefined;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"No Recent Appointment", {
    intervalInMS: number;
    templateIds?: string[] | undefined;
    titles?: string[] | undefined;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Purchase Made", {
    titles?: string[] | undefined;
    productIds?: string[] | undefined;
    titlePartialMatches?: string[] | undefined;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Refund Issued", {}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Subscription Ended", {
    productIds?: string[] | undefined;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Subscription Payment Failed", {}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Message Delivery Failure", {}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Incoming Message", {
    noCareTeam?: boolean | undefined;
    destinations?: string[] | undefined;
    channels?: string[] | undefined;
    keywords?: string[] | undefined;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Appointment No-Showed", {
    titles?: string[] | undefined;
    templateIds?: string[] | undefined;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Appointment Created", {
    titles?: string[] | undefined;
    templateIds?: string[] | undefined;
    excludeTemplateIds?: string[] | undefined;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Appointment Completed", {
    titles?: string[] | undefined;
    templateIds?: string[] | undefined;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Appointment Cancelled", {
    titles?: string[] | undefined;
    templateIds?: string[] | undefined;
    excludeTemplateIds?: string[] | undefined;
    excludeCancelUpcomingEventsJourney?: boolean | undefined;
    by?: "" | "enduser" | "user" | undefined;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Appointment Rescheduled", {
    titles?: string[] | undefined;
    detectManualReschedules?: boolean | undefined;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Medication Added", {
    titles: string[];
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"On Birthday", {
    minutes: number;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Has Not Engaged", {
    intervalInMS: number;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Vital Count", {
    units?: string[] | undefined;
    minutes: number;
    comparison: import("@tellescope/types-models").VitalComparison;
    periodInMS: number;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Vital Update", {
    configurationIds: string[];
    classifications: string[];
    ignoreDelayedReadings?: boolean | undefined;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"SMS Reply", {
    templateIds: string[];
    replyKeywords?: string[] | undefined;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Order Status Equals", {
    source: string;
    status: string;
    fills?: string[] | undefined;
    skus?: string[] | undefined;
    skuPartials?: string[] | undefined;
    titlePartials?: string[] | undefined;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Missed Call", {
    phoneNumbers?: string[] | undefined;
    inputs?: string[] | undefined;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Left Voicemail", {
    phoneNumbers?: string[] | undefined;
    inputs?: string[] | undefined;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Order Created", {
    titles?: string[] | undefined;
    fills?: string[] | undefined;
    partialFrequency?: string | undefined;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Problem Created", {
    titles?: string[] | undefined;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Pregnancy Ended", {
    reason?: string | undefined;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Form Group Completed", {
    groupId: string;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Form Group Incomplete", {
    groupId: string;
    intervalInMS: number;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Message Opened", {
    templateIds?: string[] | undefined;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Message Link Clicked", {
    templateIds?: string[] | undefined;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Healthie Note Locked", {
    healthieFormIds?: string[] | undefined;
    answersCondition?: Record<string, any> | undefined;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Database Entry Added", {
    databaseId: string;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Eligibility Result Received", {
    source: string;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"File Added", {
    source: string;
}, {}> | import("@tellescope/types-models").AutomationTriggerEventBuilder<"Tag Added", {
    tag: string;
}, {}>>;
export declare const AUTOMATION_TRIGGER_ACTION_TYPES: (keyof AutomationTriggerActions)[];
export declare const automationTriggerActionValidator: ValidatorDefinition<import("@tellescope/types-models").AutomationTriggerActionBuilder<"Assign Care Team", {
    tags: ListOfStringsWithQualifier;
    limitToOneUser?: boolean | undefined;
    setAsPrimary?: boolean | undefined;
}> | import("@tellescope/types-models").AutomationTriggerActionBuilder<"Remove Care Team", {
    tags: ListOfStringsWithQualifier;
}> | import("@tellescope/types-models").AutomationTriggerActionBuilder<"Add To Journey", {
    journeyId: string;
    doNotRestart?: boolean | undefined;
}> | import("@tellescope/types-models").AutomationTriggerActionBuilder<"Remove From Journey", {
    journeyId: string;
}> | import("@tellescope/types-models").AutomationTriggerActionBuilder<"Move To Step", {}> | import("@tellescope/types-models").AutomationTriggerActionBuilder<"Add Tags", {
    tags: string[];
    replaceExisting?: boolean | undefined;
}> | import("@tellescope/types-models").AutomationTriggerActionBuilder<"Remove Tags", {
    tags: string[];
}> | import("@tellescope/types-models").AutomationTriggerActionBuilder<"Add Access Tags", {
    tags: string[];
}> | import("@tellescope/types-models").AutomationTriggerActionBuilder<"Set Fields", {
    fields: EnduserFieldSetter[];
}> | import("@tellescope/types-models").AutomationTriggerActionBuilder<"Remove From All Journeys", {}> | import("@tellescope/types-models").AutomationTriggerActionBuilder<"Canvas: Add Patient", {}> | import("@tellescope/types-models").AutomationTriggerActionBuilder<"Zus: Delete Enrollment", {
    packageId: string;
}> | import("@tellescope/types-models").AutomationTriggerActionBuilder<"Require Form Followups", {
    formIds: string[];
}> | import("@tellescope/types-models").AutomationTriggerActionBuilder<"Add to Waitlist", {
    waitlistId: string;
}> | import("@tellescope/types-models").AutomationTriggerActionBuilder<"Grant Access From Waitlist", {
    waitlistId: string;
    count: number;
}> | import("@tellescope/types-models").AutomationTriggerActionBuilder<"Reply to Chat", {
    message: string;
}> | import("@tellescope/types-models").AutomationTriggerActionBuilder<"Create User Notifications", {
    message: string;
    notificationType: string;
    careTeamOnly?: boolean | undefined;
    tags?: ListOfStringsWithQualifier | undefined;
    maxUsers?: number | undefined;
}> | import("@tellescope/types-models").AutomationTriggerActionBuilder<"Assign to Incoming Message", {
    careTeamOnly?: boolean | undefined;
    tags?: ListOfStringsWithQualifier | undefined;
    maxUsers?: number | undefined;
}> | import("@tellescope/types-models").AutomationTriggerActionBuilder<"Zendesk: Update Ticket Assignee", {}>>;
export declare const AUTOMATION_TRIGGER_STATUSES: AutomationTriggerStatus[];
export declare const automatioNTriggerStatusValidator: ValidatorDefinition<AutomationTriggerStatus>;
export declare const EMBEDDING_TYPES: "text-embedding-ada-002"[];
export declare const embeddingTypeValidator: ValidatorDefinition<"text-embedding-ada-002">;
export declare const superbillPatientInfoValidator: ValidatorDefinition<SuperbillPatientInfo>;
export declare const superbillProviderInfoValidator: ValidatorDefinition<{
    phone: string;
    email: string;
    officeName: string;
    taxId: string;
    placeOfServiceCode?: string | undefined;
    providerName: string;
    providerNPI: string;
    providerLicense: string;
    address: import("@tellescope/types-models").Address;
}>;
export declare const billingCodeValidator: ValidatorDefinition<import("@tellescope/types-models").BillingCode>;
export declare const billingCodeValidatorOptional: ValidatorDefinition<import("@tellescope/types-models").BillingCode>;
export declare const superbillLineItemsValidator: ValidatorDefinition<SuperbillLineItem[]>;
export declare const ticketSnoozesValidator: ValidatorDefinition<TicketSnooze[]>;
export declare const accessPermissionValidator: ValidatorDefinition<AccessForResource>;
export declare const accessPermissionsValidator: ValidatorDefinition<AccessPermissions>;
export declare const organizationLimitsValidator: ValidatorDefinition<OrganizationLimits>;
declare const _LOGIN_FLOW_RESULTS: {
    readonly "continue-with-password": true;
    readonly "sent-email": true;
    readonly "sent-sms": true;
};
export type LoginFlowResult = keyof typeof _LOGIN_FLOW_RESULTS;
export declare const LOGIN_FLOW_RESULTS: ("continue-with-password" | "sent-email" | "sent-sms")[];
export declare const loginFlowResultValidator: ValidatorDefinition<"continue-with-password" | "sent-email" | "sent-sms">;
export declare const appointmentTermsValidator: ValidatorDefinition<AppointmentTerm[]>;
export declare const CURRENCIES: "USD"[];
export declare const currencyValidator: ValidatorDefinition<"USD">;
export declare const PAYMENT_PROCESSORS: PaymentProcessor[];
export declare const paymentProcessorValidator: ValidatorDefinition<PaymentProcessor>;
export declare const costValidator: ValidatorDefinition<{
    amount: number;
    currency: "USD";
}>;
export declare const purchaseCreditValueValidator: ValidatorDefinition<{
    type: "Credit";
    info: {
        amount: number;
        currency: "USD";
    };
}>;
export type IntegrationsTitleType = (typeof SQUARE_INTEGRATIONS_TITLE | typeof OUTLOOK_INTEGRATIONS_TITLE | typeof ZOHO_TITLE | typeof ZOOM_TITLE | typeof ZENDESK_INTEGRATIONS_TITLE | typeof FULLSCRIPT_INTEGRATIONS_TITLE | typeof ZUS_TITLE | typeof CANVAS_TITLE | typeof CANDID_TITLE | typeof GOGO_MEDS_TITLE | typeof PAGER_DUTY_TITLE | typeof SMART_METER_TITLE | typeof MFAX_TITLE | typeof ATHENA_TITLE | typeof DOSESPOT_TITLE | typeof DOCSUMO_TITLE | typeof ACTIVE_CAMPAIGN_TITLE | typeof STRIPE_TITLE | typeof EMOTII_TITLE | typeof DEVELOP_HEALTH_TITLE);
export declare const integrationTitleValidator: ValidatorDefinition<IntegrationsTitleType>;
export declare const VIDEO_INTEGRATION_TYPES: VideoIntegrationType[];
export declare const videoIntegrationTypesValidator: ValidatorDefinition<VideoIntegrationType>;
export declare const analyticsQueryResultsValidator: ValidatorDefinition<AnalyticsQueryResultValue[]>;
export declare const scheduledJourneysValidator: ValidatorDefinition<ScheduledJourney[]>;
export declare const formScoringValidator: ValidatorDefinition<FormScoring[]>;
export declare const basicFilterValidator: ValidatorDefinition<Indexable<unknown>>;
export declare const compoundFilterValidator: ValidatorDefinition<Indexable<unknown>>;
export declare const analyticsQueryValidator: ValidatorDefinition<{
    resource: "Endusers";
    info: {
        method: "Total";
        parameters: undefined;
    } | {
        method: "Sum of Field";
        parameters: {
            field: string;
        };
    };
    filter?: {
        activeSince?: "" | Date | undefined;
        "Contacted Since"?: "" | Date | undefined;
        "Submitted Forms"?: {
            qualifier: ListQueryQualifier;
            formIds: string[];
            formResponseCondition?: import("@tellescope/types-models").CompoundFilter<string> | undefined;
        } | undefined;
        fields?: import("@tellescope/types-models").AnalyticsEnduserFilterField[] | undefined;
        gender?: TellescopeGender | undefined;
        assignedTo?: {
            qualifier: ListQueryQualifier;
            userIds: string[];
        } | undefined;
        born?: DateRange | undefined;
        tags?: ListOfStringsWithQualifier | undefined;
        entityTypes?: string[] | undefined;
    } | undefined;
    grouping?: import("@tellescope/types-models").EnduserGrouping | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "Calendar Events";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {
        userIds?: string[] | undefined;
        templateIds?: string[] | undefined;
        starts?: DateRange | undefined;
        wasSelfScheduled?: boolean | undefined;
        wasCancelled?: boolean | undefined;
        wasCompleted?: boolean | undefined;
        wasRescheduled?: boolean | undefined;
        wasNoShowed?: boolean | undefined;
        scheduledBy?: string | undefined;
    } | undefined;
    grouping?: ({
        Type: boolean;
        "Scheduled By"?: boolean | undefined;
        "Completed By"?: boolean | undefined;
        alsoGroupByHost?: boolean | undefined;
        "Cancel Reason"?: boolean | undefined;
    } & import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "Form Responses";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {
        formIds?: string[] | undefined;
        formResponseCondition?: import("@tellescope/types-models").CompoundFilter<string> | undefined;
        tags?: ListOfStringsWithQualifier | undefined;
    } | undefined;
    grouping?: ({
        "Submitted By"?: boolean | undefined;
        "Submission Status"?: boolean | undefined;
        "Public Identifier"?: boolean | undefined;
    } & import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<("Created At" | "Updated At") | "Submitted At"> | undefined;
} | {
    resource: "Purchases";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {
        titles?: string[] | undefined;
    } | undefined;
    grouping?: ({
        Title?: boolean | undefined;
        Cost?: boolean | undefined;
    } & import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "Purchase Credits";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {} | undefined;
    grouping?: (import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "Tickets";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {
        titles?: string[] | undefined;
        closeReasons?: string[] | undefined;
        userTags?: ListOfStringsWithQualifier | undefined;
        enduserFields?: import("@tellescope/types-models").AnalyticsEnduserFilterField[] | undefined;
        closedAtRange?: DateRange | undefined;
    } | undefined;
    grouping?: ({
        Owner?: boolean | undefined;
        Title?: boolean | undefined;
        Outcome?: boolean | undefined;
    } & import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<("Created At" | "Updated At") | "Closed At"> | undefined;
} | {
    resource: "Emails";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {
        direction?: "Inbound" | "Outbound" | "Both" | undefined;
        templateIds?: string[] | undefined;
        subjects?: string[] | undefined;
        "Email Tags"?: ListOfStringsWithQualifier | undefined;
    } | undefined;
    grouping?: ({
        "Email Tags"?: boolean | undefined;
    } & import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "Phone Calls";
    info: {
        method: "Total";
        parameters: undefined;
    } | {
        method: "Duration";
        parameters: undefined;
    };
    filter?: {} | undefined;
    grouping?: (import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "SMS Messages";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {
        direction?: string | undefined;
        messages?: string[] | undefined;
        "SMS Tags"?: ListOfStringsWithQualifier | undefined;
    } | undefined;
    grouping?: ({
        "SMS Tags"?: boolean | undefined;
        Score?: boolean | undefined;
    } & import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "Medications";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {} | undefined;
    grouping?: (import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "Files";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {
        names?: string[] | undefined;
    } | undefined;
    grouping?: (import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "Meetings";
    info: {
        method: "Total";
        parameters: undefined;
    } | {
        method: "Duration";
        parameters: undefined;
    };
    filter?: {} | undefined;
    grouping?: {
        Host?: boolean | undefined;
    } | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "Journey Logs";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {
        automationStepIds?: string[] | undefined;
    } | undefined;
    grouping?: (import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "Orders";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {} | undefined;
    grouping?: (import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "Chat Rooms";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {} | undefined;
    grouping?: (import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "Chats";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {} | undefined;
    grouping?: (import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
}>;
export declare const analyticsQueriesValidatorOptional: ValidatorDefinition<({
    resource: "Endusers";
    info: {
        method: "Total";
        parameters: undefined;
    } | {
        method: "Sum of Field";
        parameters: {
            field: string;
        };
    };
    filter?: {
        activeSince?: "" | Date | undefined;
        "Contacted Since"?: "" | Date | undefined;
        "Submitted Forms"?: {
            qualifier: ListQueryQualifier;
            formIds: string[];
            formResponseCondition?: import("@tellescope/types-models").CompoundFilter<string> | undefined;
        } | undefined;
        fields?: import("@tellescope/types-models").AnalyticsEnduserFilterField[] | undefined;
        gender?: TellescopeGender | undefined;
        assignedTo?: {
            qualifier: ListQueryQualifier;
            userIds: string[];
        } | undefined;
        born?: DateRange | undefined;
        tags?: ListOfStringsWithQualifier | undefined;
        entityTypes?: string[] | undefined;
    } | undefined;
    grouping?: import("@tellescope/types-models").EnduserGrouping | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "Calendar Events";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {
        userIds?: string[] | undefined;
        templateIds?: string[] | undefined;
        starts?: DateRange | undefined;
        wasSelfScheduled?: boolean | undefined;
        wasCancelled?: boolean | undefined;
        wasCompleted?: boolean | undefined;
        wasRescheduled?: boolean | undefined;
        wasNoShowed?: boolean | undefined;
        scheduledBy?: string | undefined;
    } | undefined;
    grouping?: ({
        Type: boolean;
        "Scheduled By"?: boolean | undefined;
        "Completed By"?: boolean | undefined;
        alsoGroupByHost?: boolean | undefined;
        "Cancel Reason"?: boolean | undefined;
    } & import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "Form Responses";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {
        formIds?: string[] | undefined;
        formResponseCondition?: import("@tellescope/types-models").CompoundFilter<string> | undefined;
        tags?: ListOfStringsWithQualifier | undefined;
    } | undefined;
    grouping?: ({
        "Submitted By"?: boolean | undefined;
        "Submission Status"?: boolean | undefined;
        "Public Identifier"?: boolean | undefined;
    } & import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<("Created At" | "Updated At") | "Submitted At"> | undefined;
} | {
    resource: "Purchases";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {
        titles?: string[] | undefined;
    } | undefined;
    grouping?: ({
        Title?: boolean | undefined;
        Cost?: boolean | undefined;
    } & import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "Purchase Credits";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {} | undefined;
    grouping?: (import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "Tickets";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {
        titles?: string[] | undefined;
        closeReasons?: string[] | undefined;
        userTags?: ListOfStringsWithQualifier | undefined;
        enduserFields?: import("@tellescope/types-models").AnalyticsEnduserFilterField[] | undefined;
        closedAtRange?: DateRange | undefined;
    } | undefined;
    grouping?: ({
        Owner?: boolean | undefined;
        Title?: boolean | undefined;
        Outcome?: boolean | undefined;
    } & import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<("Created At" | "Updated At") | "Closed At"> | undefined;
} | {
    resource: "Emails";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {
        direction?: "Inbound" | "Outbound" | "Both" | undefined;
        templateIds?: string[] | undefined;
        subjects?: string[] | undefined;
        "Email Tags"?: ListOfStringsWithQualifier | undefined;
    } | undefined;
    grouping?: ({
        "Email Tags"?: boolean | undefined;
    } & import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "Phone Calls";
    info: {
        method: "Total";
        parameters: undefined;
    } | {
        method: "Duration";
        parameters: undefined;
    };
    filter?: {} | undefined;
    grouping?: (import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "SMS Messages";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {
        direction?: string | undefined;
        messages?: string[] | undefined;
        "SMS Tags"?: ListOfStringsWithQualifier | undefined;
    } | undefined;
    grouping?: ({
        "SMS Tags"?: boolean | undefined;
        Score?: boolean | undefined;
    } & import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "Medications";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {} | undefined;
    grouping?: (import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "Files";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {
        names?: string[] | undefined;
    } | undefined;
    grouping?: (import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "Meetings";
    info: {
        method: "Total";
        parameters: undefined;
    } | {
        method: "Duration";
        parameters: undefined;
    };
    filter?: {} | undefined;
    grouping?: {
        Host?: boolean | undefined;
    } | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "Journey Logs";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {
        automationStepIds?: string[] | undefined;
    } | undefined;
    grouping?: (import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "Orders";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {} | undefined;
    grouping?: (import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "Chat Rooms";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {} | undefined;
    grouping?: (import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
} | {
    resource: "Chats";
    info: {
        method: "Total";
        parameters: undefined;
    };
    filter?: {} | undefined;
    grouping?: (import("@tellescope/types-models").EnduserGrouping & {
        Enduser: string;
    }) | undefined;
    range?: AnalyticsQueryRange<"Created At" | "Updated At"> | undefined;
})[]>;
export declare const ANALYTICS_FRAME_TYPES: "Percentage"[];
export declare const analyticsFrameTypeValidator: ValidatorDefinition<"Percentage">;
export declare const ANALYTICS_QUERY_TYPES: (keyof AnalyticsQueryForType)[];
export declare const analyticsQueryTypeValidator: ValidatorDefinition<keyof AnalyticsQueryForType>;
export declare const USER_CALL_ROUTING_BEHAVIORS: UserCallRoutingBehavior[];
export declare const userCallRoutingBehaviorValidator: ValidatorDefinition<UserCallRoutingBehavior>;
export declare const userUIRestrictionsValidator: ValidatorDefinition<UserUIRestrictions>;
export declare const externalChatGPTMessagesValidator: ValidatorDefinition<ExternalChatGPTMessage[]>;
export declare const sharedEnduserProfileViewBlockFields: {
    width: ValidatorDefinition<string>;
    maxHeight: ValidatorDefinition<number>;
};
export declare const enduserProfileViewBlockValidator: ValidatorDefinition<import("@tellescope/types-models").EnduserProfileViewBlockBuilder<"Field Group", {
    title: string;
    fields: string[];
    displayFields?: {
        field: string;
        display: string;
    }[] | undefined;
}> | import("@tellescope/types-models").EnduserProfileViewBlockBuilder<"Form Responses", {
    title: string;
    formId?: string | undefined;
    fieldIds?: string[] | undefined;
    showAllForms?: boolean | undefined;
    expandable?: boolean | undefined;
}> | import("@tellescope/types-models").EnduserProfileViewBlockBuilder<"Zus Encounters", {
    title: string;
}> | import("@tellescope/types-models").EnduserProfileViewBlockBuilder<"Files", {
    title: string;
}> | import("@tellescope/types-models").EnduserProfileViewBlockBuilder<"Tickets", {
    title: string;
}> | import("@tellescope/types-models").EnduserProfileViewBlockBuilder<"Events", {
    title: string;
}> | import("@tellescope/types-models").EnduserProfileViewBlockBuilder<"Labs", {
    title: string;
}> | import("@tellescope/types-models").EnduserProfileViewBlockBuilder<"Medications", {
    title: string;
}> | import("@tellescope/types-models").EnduserProfileViewBlockBuilder<"Diagnoses", {
    title: string;
}> | import("@tellescope/types-models").EnduserProfileViewBlockBuilder<"Timeline", {
    title: string;
}> | import("@tellescope/types-models").EnduserProfileViewBlockBuilder<"Shared Content", {
    title: string;
}>>;
export declare const enduserProfileViewBlocksValidator: ValidatorDefinition<(import("@tellescope/types-models").EnduserProfileViewBlockBuilder<"Field Group", {
    title: string;
    fields: string[];
    displayFields?: {
        field: string;
        display: string;
    }[] | undefined;
}> | import("@tellescope/types-models").EnduserProfileViewBlockBuilder<"Form Responses", {
    title: string;
    formId?: string | undefined;
    fieldIds?: string[] | undefined;
    showAllForms?: boolean | undefined;
    expandable?: boolean | undefined;
}> | import("@tellescope/types-models").EnduserProfileViewBlockBuilder<"Zus Encounters", {
    title: string;
}> | import("@tellescope/types-models").EnduserProfileViewBlockBuilder<"Files", {
    title: string;
}> | import("@tellescope/types-models").EnduserProfileViewBlockBuilder<"Tickets", {
    title: string;
}> | import("@tellescope/types-models").EnduserProfileViewBlockBuilder<"Events", {
    title: string;
}> | import("@tellescope/types-models").EnduserProfileViewBlockBuilder<"Labs", {
    title: string;
}> | import("@tellescope/types-models").EnduserProfileViewBlockBuilder<"Medications", {
    title: string;
}> | import("@tellescope/types-models").EnduserProfileViewBlockBuilder<"Diagnoses", {
    title: string;
}> | import("@tellescope/types-models").EnduserProfileViewBlockBuilder<"Timeline", {
    title: string;
}> | import("@tellescope/types-models").EnduserProfileViewBlockBuilder<"Shared Content", {
    title: string;
}>)[]>;
export declare const insurancesValidator: ValidatorDefinition<Insurance[]>;
export declare const phoneTreeEventValidator: ValidatorDefinition<import("@tellescope/types-models").PhoneTreeEventBuilder<"Start", {}> | import("@tellescope/types-models").PhoneTreeEventBuilder<"On Gather", {
    digits?: string | undefined;
    transcription?: string | undefined;
    handleNoInput?: boolean | undefined;
}> | import("@tellescope/types-models").PhoneTreeEventBuilder<"If True", {}> | import("@tellescope/types-models").PhoneTreeEventBuilder<"If False", {}> | import("@tellescope/types-models").PhoneTreeEventBuilder<"If No Users Match", {}> | import("@tellescope/types-models").PhoneTreeEventBuilder<"If No Users Answer", {}>>;
export declare const phoneTreeEventsValidator: ValidatorDefinition<(import("@tellescope/types-models").PhoneTreeEventBuilder<"Start", {}> | import("@tellescope/types-models").PhoneTreeEventBuilder<"On Gather", {
    digits?: string | undefined;
    transcription?: string | undefined;
    handleNoInput?: boolean | undefined;
}> | import("@tellescope/types-models").PhoneTreeEventBuilder<"If True", {}> | import("@tellescope/types-models").PhoneTreeEventBuilder<"If False", {}> | import("@tellescope/types-models").PhoneTreeEventBuilder<"If No Users Match", {}> | import("@tellescope/types-models").PhoneTreeEventBuilder<"If No Users Answer", {}>)[]>;
export declare const phonePlaybackValidator: ValidatorDefinition<{
    type: "Play";
    info: {
        url: string;
        script?: string | undefined;
    };
} | {
    type: "Say";
    info: {
        script: string;
        url?: string | undefined;
    };
}>;
export declare const phonePlaybackValidatorOptional: ValidatorDefinition<{} | {
    type: "Play";
    info: {
        url: string;
        script?: string | undefined;
    };
} | {
    type: "Say";
    info: {
        script: string;
        url?: string | undefined;
    };
}>;
export declare const phoneTreeActionValidator: ValidatorDefinition<import("@tellescope/types-models").PhoneTreeActionBuilder<"Gather", {
    digits: boolean;
    speech: boolean;
    playback: import("@tellescope/types-models").PhonePlayback;
    duration?: number | undefined;
}> | import("@tellescope/types-models").PhoneTreeActionBuilder<"Voicemail", {
    playback: import("@tellescope/types-models").PhonePlayback;
    journeyId?: string | undefined;
}> | import("@tellescope/types-models").PhoneTreeActionBuilder<"Play Message", {
    playback: import("@tellescope/types-models").PhonePlayback;
    journeyId?: string | undefined;
    outcome?: string | undefined;
    cancelAppointment?: boolean | undefined;
    confirmAppointment?: boolean | undefined;
}> | import("@tellescope/types-models").PhoneTreeActionBuilder<"Dial Users", {
    userIds: string[];
    playback?: Partial<import("@tellescope/types-models").PhonePlayback> | undefined;
    duration?: number | undefined;
}> | import("@tellescope/types-models").PhoneTreeActionBuilder<"Route Call", {
    prePlayback?: Partial<import("@tellescope/types-models").PhonePlayback> | undefined;
    byCareTeamPrimary?: boolean | undefined;
    byCareTeam?: boolean | undefined;
    byRole?: string | undefined;
    byTags?: ListOfStringsWithQualifier | undefined;
    playback?: Partial<import("@tellescope/types-models").PhonePlayback> | undefined;
    duration?: number | undefined;
    addToCareTeam?: boolean | undefined;
    dialRecentAgent?: boolean | undefined;
}> | import("@tellescope/types-models").PhoneTreeActionBuilder<"Forward Call", {
    to: string;
}> | import("@tellescope/types-models").PhoneTreeActionBuilder<"Conditional Split", {
    timezone?: "Africa/Abidjan" | "Africa/Accra" | "Africa/Addis_Ababa" | "Africa/Algiers" | "Africa/Asmara" | "Africa/Asmera" | "Africa/Bamako" | "Africa/Bangui" | "Africa/Banjul" | "Africa/Blantyre" | "Africa/Brazzaville" | "Africa/Bujumbura" | "Africa/Cairo" | "Africa/Casablanca" | "Africa/Ceuta" | "Africa/Conakry" | "Africa/Dakar" | "Africa/Dar_es_Salaam" | "Africa/Djibouti" | "Africa/Douala" | "Africa/El_Aaiun" | "Africa/Freetown" | "Africa/Gaborone" | "Africa/Harare" | "Africa/Johannesburg" | "Africa/Juba" | "Africa/Kampala" | "Africa/Khartoum" | "Africa/Kigali" | "Africa/Kinshasa" | "Africa/Lagos" | "Africa/Libreville" | "Africa/Lome" | "Africa/Luanda" | "Africa/Lubumbashi" | "Africa/Lusaka" | "Africa/Malabo" | "Africa/Maputo" | "Africa/Maseru" | "Africa/Mbabane" | "Africa/Mogadishu" | "Africa/Monrovia" | "Africa/Nairobi" | "Africa/Ndjamena" | "Africa/Niamey" | "Africa/Nouakchott" | "Africa/Ouagadougou" | "Africa/Porto-Novo" | "Africa/Sao_Tome" | "Africa/Timbuktu" | "Africa/Tripoli" | "Africa/Tunis" | "Africa/Windhoek" | "America/Adak" | "America/Anchorage" | "America/Anguilla" | "America/Antigua" | "America/Araguaina" | "America/Argentina/Buenos_Aires" | "America/Argentina/Catamarca" | "America/Argentina/ComodRivadavia" | "America/Argentina/Cordoba" | "America/Argentina/Jujuy" | "America/Argentina/La_Rioja" | "America/Argentina/Mendoza" | "America/Argentina/Rio_Gallegos" | "America/Argentina/Salta" | "America/Argentina/San_Juan" | "America/Argentina/San_Luis" | "America/Argentina/Tucuman" | "America/Argentina/Ushuaia" | "America/Aruba" | "America/Asuncion" | "America/Atikokan" | "America/Atka" | "America/Bahia" | "America/Bahia_Banderas" | "America/Barbados" | "America/Belem" | "America/Belize" | "America/Blanc-Sablon" | "America/Boa_Vista" | "America/Bogota" | "America/Boise" | "America/Buenos_Aires" | "America/Cambridge_Bay" | "America/Campo_Grande" | "America/Cancun" | "America/Caracas" | "America/Catamarca" | "America/Cayenne" | "America/Cayman" | "America/Chicago" | "America/Chihuahua" | "America/Coral_Harbour" | "America/Cordoba" | "America/Costa_Rica" | "America/Creston" | "America/Cuiaba" | "America/Curacao" | "America/Danmarkshavn" | "America/Dawson" | "America/Dawson_Creek" | "America/Denver" | "America/Detroit" | "America/Dominica" | "America/Edmonton" | "America/Eirunepe" | "America/El_Salvador" | "America/Ensenada" | "America/Fort_Wayne" | "America/Fortaleza" | "America/Glace_Bay" | "America/Godthab" | "America/Goose_Bay" | "America/Grand_Turk" | "America/Grenada" | "America/Guadeloupe" | "America/Guatemala" | "America/Guayaquil" | "America/Guyana" | "America/Halifax" | "America/Havana" | "America/Hermosillo" | "America/Indiana/Indianapolis" | "America/Indiana/Knox" | "America/Indiana/Marengo" | "America/Indiana/Petersburg" | "America/Indiana/Tell_City" | "America/Indiana/Valparaiso" | "America/Indiana/Vevay" | "America/Indiana/Vincennes" | "America/Indiana/Winamac" | "America/Indianapolis" | "America/Inuvik" | "America/Iqaluit" | "America/Jamaica" | "America/Jujuy" | "America/Juneau" | "America/Kentucky/Louisville" | "America/Kentucky/Monticello" | "America/Knox_IN" | "America/Kralendijk" | "America/La_Paz" | "America/Lima" | "America/Los_Angeles" | "America/Louisville" | "America/Lower_Princes" | "America/Maceio" | "America/Managua" | "America/Manaus" | "America/Marigot" | "America/Martinique" | "America/Matamoros" | "America/Mazatlan" | "America/Mendoza" | "America/Menominee" | "America/Merida" | "America/Metlakatla" | "America/Mexico_City" | "America/Miquelon" | "America/Moncton" | "America/Monterrey" | "America/Montevideo" | "America/Montreal" | "America/Montserrat" | "America/Nassau" | "America/New_York" | "America/Nipigon" | "America/Nome" | "America/Noronha" | "America/North_Dakota/Beulah" | "America/North_Dakota/Center" | "America/North_Dakota/New_Salem" | "America/Ojinaga" | "America/Panama" | "America/Pangnirtung" | "America/Paramaribo" | "America/Phoenix" | "America/Port_of_Spain" | "America/Port-au-Prince" | "America/Porto_Acre" | "America/Porto_Velho" | "America/Puerto_Rico" | "America/Rainy_River" | "America/Rankin_Inlet" | "America/Recife" | "America/Regina" | "America/Resolute" | "America/Rio_Branco" | "America/Rosario" | "America/Santa_Isabel" | "America/Santarem" | "America/Santiago" | "America/Santo_Domingo" | "America/Sao_Paulo" | "America/Scoresbysund" | "America/Shiprock" | "America/Sitka" | "America/St_Barthelemy" | "America/St_Johns" | "America/St_Kitts" | "America/St_Lucia" | "America/St_Thomas" | "America/St_Vincent" | "America/Swift_Current" | "America/Tegucigalpa" | "America/Thule" | "America/Thunder_Bay" | "America/Tijuana" | "America/Toronto" | "America/Tortola" | "America/Vancouver" | "America/Virgin" | "America/Whitehorse" | "America/Winnipeg" | "America/Yakutat" | "America/Yellowknife" | "Antarctica/Casey" | "Antarctica/Davis" | "Antarctica/DumontDUrville" | "Antarctica/Macquarie" | "Antarctica/Mawson" | "Antarctica/McMurdo" | "Antarctica/Palmer" | "Antarctica/Rothera" | "Antarctica/South_Pole" | "Antarctica/Syowa" | "Antarctica/Troll" | "Antarctica/Vostok" | "Arctic/Longyearbyen" | "Asia/Aden" | "Asia/Almaty" | "Asia/Amman" | "Asia/Anadyr" | "Asia/Aqtau" | "Asia/Aqtobe" | "Asia/Ashgabat" | "Asia/Ashkhabad" | "Asia/Baghdad" | "Asia/Bahrain" | "Asia/Baku" | "Asia/Bangkok" | "Asia/Beirut" | "Asia/Bishkek" | "Asia/Brunei" | "Asia/Calcutta" | "Asia/Choibalsan" | "Asia/Chongqing" | "Asia/Chungking" | "Asia/Colombo" | "Asia/Dacca" | "Asia/Damascus" | "Asia/Dhaka" | "Asia/Dili" | "Asia/Dubai" | "Asia/Dushanbe" | "Asia/Gaza" | "Asia/Harbin" | "Asia/Hebron" | "Asia/Ho_Chi_Minh" | "Asia/Hong_Kong" | "Asia/Hovd" | "Asia/Irkutsk" | "Asia/Istanbul" | "Asia/Jakarta" | "Asia/Jayapura" | "Asia/Jerusalem" | "Asia/Kabul" | "Asia/Kamchatka" | "Asia/Karachi" | "Asia/Kashgar" | "Asia/Kathmandu" | "Asia/Katmandu" | "Asia/Khandyga" | "Asia/Kolkata" | "Asia/Krasnoyarsk" | "Asia/Kuala_Lumpur" | "Asia/Kuching" | "Asia/Kuwait" | "Asia/Macao" | "Asia/Macau" | "Asia/Magadan" | "Asia/Makassar" | "Asia/Manila" | "Asia/Muscat" | "Asia/Nicosia" | "Asia/Novokuznetsk" | "Asia/Novosibirsk" | "Asia/Omsk" | "Asia/Oral" | "Asia/Phnom_Penh" | "Asia/Pontianak" | "Asia/Pyongyang" | "Asia/Qatar" | "Asia/Qyzylorda" | "Asia/Rangoon" | "Asia/Riyadh" | "Asia/Saigon" | "Asia/Sakhalin" | "Asia/Samarkand" | "Asia/Seoul" | "Asia/Shanghai" | "Asia/Singapore" | "Asia/Taipei" | "Asia/Tashkent" | "Asia/Tbilisi" | "Asia/Tehran" | "Asia/Tel_Aviv" | "Asia/Thimbu" | "Asia/Thimphu" | "Asia/Tokyo" | "Asia/Ujung_Pandang" | "Asia/Ulaanbaatar" | "Asia/Ulan_Bator" | "Asia/Urumqi" | "Asia/Ust-Nera" | "Asia/Vientiane" | "Asia/Vladivostok" | "Asia/Yakutsk" | "Asia/Yekaterinburg" | "Asia/Yerevan" | "Atlantic/Azores" | "Atlantic/Bermuda" | "Atlantic/Canary" | "Atlantic/Cape_Verde" | "Atlantic/Faeroe" | "Atlantic/Faroe" | "Atlantic/Jan_Mayen" | "Atlantic/Madeira" | "Atlantic/Reykjavik" | "Atlantic/South_Georgia" | "Atlantic/St_Helena" | "Atlantic/Stanley" | "Australia/ACT" | "Australia/Adelaide" | "Australia/Brisbane" | "Australia/Broken_Hill" | "Australia/Canberra" | "Australia/Currie" | "Australia/Darwin" | "Australia/Eucla" | "Australia/Hobart" | "Australia/LHI" | "Australia/Lindeman" | "Australia/Lord_Howe" | "Australia/Melbourne" | "Australia/North" | "Australia/NSW" | "Australia/Perth" | "Australia/Queensland" | "Australia/South" | "Australia/Sydney" | "Australia/Tasmania" | "Australia/Victoria" | "Australia/West" | "Australia/Yancowinna" | "Brazil/Acre" | "Brazil/DeNoronha" | "Brazil/East" | "Brazil/West" | "Canada/Atlantic" | "Canada/Central" | "Canada/Eastern" | "Canada/East-Saskatchewan" | "Canada/Mountain" | "Canada/Newfoundland" | "Canada/Pacific" | "Canada/Saskatchewan" | "Canada/Yukon" | "Chile/Continental" | "Chile/EasterIsland" | "Cuba" | "Egypt" | "Eire" | "Etc/GMT" | "Etc/GMT+0" | "Etc/UCT" | "Etc/Universal" | "Etc/UTC" | "Etc/Zulu" | "Europe/Amsterdam" | "Europe/Andorra" | "Europe/Athens" | "Europe/Belfast" | "Europe/Belgrade" | "Europe/Berlin" | "Europe/Bratislava" | "Europe/Brussels" | "Europe/Bucharest" | "Europe/Budapest" | "Europe/Busingen" | "Europe/Chisinau" | "Europe/Copenhagen" | "Europe/Dublin" | "Europe/Gibraltar" | "Europe/Guernsey" | "Europe/Helsinki" | "Europe/Isle_of_Man" | "Europe/Istanbul" | "Europe/Jersey" | "Europe/Kaliningrad" | "Europe/Kiev" | "Europe/Lisbon" | "Europe/Ljubljana" | "Europe/London" | "Europe/Luxembourg" | "Europe/Madrid" | "Europe/Malta" | "Europe/Mariehamn" | "Europe/Minsk" | "Europe/Monaco" | "Europe/Moscow" | "Europe/Nicosia" | "Europe/Oslo" | "Europe/Paris" | "Europe/Podgorica" | "Europe/Prague" | "Europe/Riga" | "Europe/Rome" | "Europe/Samara" | "Europe/San_Marino" | "Europe/Sarajevo" | "Europe/Simferopol" | "Europe/Skopje" | "Europe/Sofia" | "Europe/Stockholm" | "Europe/Tallinn" | "Europe/Tirane" | "Europe/Tiraspol" | "Europe/Uzhgorod" | "Europe/Vaduz" | "Europe/Vatican" | "Europe/Vienna" | "Europe/Vilnius" | "Europe/Volgograd" | "Europe/Warsaw" | "Europe/Zagreb" | "Europe/Zaporozhye" | "Europe/Zurich" | "GB" | "GB-Eire" | "GMT" | "GMT+0" | "GMT0" | "GMT-0" | "Greenwich" | "Hongkong" | "Iceland" | "Indian/Antananarivo" | "Indian/Chagos" | "Indian/Christmas" | "Indian/Cocos" | "Indian/Comoro" | "Indian/Kerguelen" | "Indian/Mahe" | "Indian/Maldives" | "Indian/Mauritius" | "Indian/Mayotte" | "Indian/Reunion" | "Iran" | "Israel" | "Jamaica" | "Japan" | "Kwajalein" | "Libya" | "Mexico/BajaNorte" | "Mexico/BajaSur" | "Mexico/General" | "Navajo" | "NZ" | "NZ-CHAT" | "Pacific/Apia" | "Pacific/Auckland" | "Pacific/Chatham" | "Pacific/Chuuk" | "Pacific/Easter" | "Pacific/Efate" | "Pacific/Enderbury" | "Pacific/Fakaofo" | "Pacific/Fiji" | "Pacific/Funafuti" | "Pacific/Galapagos" | "Pacific/Gambier" | "Pacific/Guadalcanal" | "Pacific/Guam" | "Pacific/Honolulu" | "Pacific/Johnston" | "Pacific/Kiritimati" | "Pacific/Kosrae" | "Pacific/Kwajalein" | "Pacific/Majuro" | "Pacific/Marquesas" | "Pacific/Midway" | "Pacific/Nauru" | "Pacific/Niue" | "Pacific/Norfolk" | "Pacific/Noumea" | "Pacific/Pago_Pago" | "Pacific/Palau" | "Pacific/Pitcairn" | "Pacific/Pohnpei" | "Pacific/Ponape" | "Pacific/Port_Moresby" | "Pacific/Rarotonga" | "Pacific/Saipan" | "Pacific/Samoa" | "Pacific/Tahiti" | "Pacific/Tarawa" | "Pacific/Tongatapu" | "Pacific/Truk" | "Pacific/Wake" | "Pacific/Wallis" | "Pacific/Yap" | "Poland" | "Portugal" | "PRC" | "ROC" | "ROK" | "Singapore" | "Turkey" | "UCT" | "Universal" | "US/Alaska" | "US/Aleutian" | "US/Arizona" | "US/Central" | "US/Eastern" | "US/East-Indiana" | "US/Hawaii" | "US/Indiana-Starke" | "US/Michigan" | "US/Mountain" | "US/Pacific" | "US/Samoa" | "UTC" | "W-SU" | "Zulu" | undefined;
    weeklyAvailabilities?: WeeklyAvailability[] | undefined;
    hasCareTeam?: boolean | undefined;
    hasOneCareTeamMember?: boolean | undefined;
}> | import("@tellescope/types-models").PhoneTreeActionBuilder<"Select Care Team Member", {
    playback?: Partial<import("@tellescope/types-models").PhonePlayback> | undefined;
    playbackVoicemail?: Partial<import("@tellescope/types-models").PhonePlayback> | undefined;
}> | import("@tellescope/types-models").PhoneTreeActionBuilder<"Add to Queue", {
    queueId: string;
    playback?: Partial<import("@tellescope/types-models").PhonePlayback> | undefined;
}> | import("@tellescope/types-models").PhoneTreeActionBuilder<"Route Extensions", {
    extensions: {
        input: string;
        userId: string;
    }[];
    playback?: Partial<import("@tellescope/types-models").PhonePlayback> | undefined;
}>>;
export declare const phoneTreeNodeValidator: ValidatorDefinition<PhoneTreeNode>;
export declare const phoneTreeNodesValidator: ValidatorDefinition<PhoneTreeNode[]>;
export declare const PHONE_TREE_ENDUSER_CONDITIONS: PhoneTreeEnduserCondition[];
export declare const phoneTreeEnduserConditionValidator: ValidatorDefinition<PhoneTreeEnduserCondition>;
export declare const formCustomizationValidator: ValidatorDefinition<import("@tellescope/types-models").FormCustomization | undefined>;
export declare const languageValidator: ValidatorDefinition<Language>;
export declare const tableViewColumnsValidator: ValidatorDefinition<TableViewColumn[]>;
export declare const formFieldCalloutConditionsValidator: ValidatorDefinition<FormFieldCalloutCondition[]>;
export declare const endusersReportQueriesValidator: ValidatorDefinition<Indexable<EnduserReportQuery>>;
export declare const formResponsesReportQueriesValidator: ValidatorDefinition<Indexable<FormResponsesReportQuery>>;
export declare const phoneCallsReportQueriesValidator: ValidatorDefinition<Indexable<import("@tellescope/types-models").ReportQuery>>;
export declare const isDateString: (_s?: string) => boolean;
export declare const imageAttachmentValidator: ValidatorDefinition<ImageAttachment>;
export declare const mmsMessageValidator: ValidatorDefinition<GroupMMSMessage>;
export declare const mmsMessagesValidator: ValidatorDefinition<GroupMMSMessage[]>;
export declare const groupMMSUserStateValidator: ValidatorDefinition<GroupMMSUserState>;
export declare const groupMMSUserStatesValidator: ValidatorDefinition<GroupMMSUserState[]>;
export declare const sortingFieldsValidator: ValidatorDefinition<SortingField[]>;
export declare const DIAGNOSIS_TYPES: ("ABF" | "ABJ" | "ABK" | "APR" | "BF" | "BJ" | "BK" | "PR" | "DR" | "LOI")[];
export declare const diagnosisTypeValidator: ValidatorDefinition<"ABF" | "ABJ" | "ABK" | "APR" | "BF" | "BJ" | "BK" | "PR" | "DR" | "LOI">;
export declare const candidProcedureCodeValidator: ValidatorDefinition<CandidProcedureCode>;
export declare const diagnosisValidator: ValidatorDefinition<Diagnosis>;
export declare const diagnosesValidator: ValidatorDefinition<Diagnosis[]>;
export declare const enduserProfileWebhooksValidator: ValidatorDefinition<BasicWebhook[]>;
export declare const syncDirectionValidator: ValidatorDefinition<SyncDirection>;
export declare const fieldSyncValidator: ValidatorDefinition<AthenaFieldSync>;
export declare const fieldsSyncValidator: ValidatorDefinition<AthenaFieldSync[]>;
export declare const athenaSubscriptionTypeValidator: ValidatorDefinition<"orders" | "patients" | "appointments" | "chart/healthhistory/problems" | "obepisode">;
export declare const athenaSubscriptionValidator: ValidatorDefinition<AthenaSubscription>;
export declare const athenaSubscriptionsValidator: ValidatorDefinition<AthenaSubscription[]>;
export declare const fieldMappingValidator: ValidatorDefinition<FieldMapping>;
export declare const fieldMappingsValidator: ValidatorDefinition<FieldMapping[]>;
export declare const analyticsFrameGroupingCategoryValidator: ValidatorDefinition<AnalyticsFrameGroupingCategory>;
export declare const analyticsFrameGroupingCategoriesValidator: ValidatorDefinition<AnalyticsFrameGroupingCategory[]>;
export declare const bookingRestrictionsByTemplateValidator: ValidatorDefinition<BookingRestrictions[]>;
export declare const enduserDiagnosisValidator: ValidatorDefinition<EnduserDiagnosis>;
export declare const recentViewerValidator: ValidatorDefinition<RecentViewer>;
export declare const recentViewersValidator: ValidatorDefinition<RecentViewer[]>;
export declare const outOfOfficeBlockValidator: ValidatorDefinition<OutOfOfficeBlock>;
export declare const outOfOfficeBlocksValidator: ValidatorDefinition<OutOfOfficeBlock[]>;
//# sourceMappingURL=validation.d.ts.map