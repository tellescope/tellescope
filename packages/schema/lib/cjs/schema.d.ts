import { ServerModelForName, DatabaseModel, DatabaseRecord, ObjectId, ModelName, User } from "@tellescope/types-server";
import { ErrorInfo, Indexable, Operation, JSONType, CRUD, HTTPMethod, UserIdentity, SessionType } from "@tellescope/types-utilities";
import * as Utilities from "@tellescope/utilities";
import { EnduserSession, ChatRoom, UserSession, MeetingStatus, WebhookSubscriptionsType, Attendee, FormResponseValue, MeetingInfo, OrganizationTheme, WithLinkOpenTrackingIds, CommunicationsChannel, AppointmentTerm, JourneyContext, AnalyticsQuery, AnalyticsQueryResult, AnalyticsAggregationRequest, DateRange, BaseAvailabilityBlock, IndexUpdate, Timezone, UserCallRoutingBehavior, ExternalChatGPTMessage, StripeCheckoutInfo, StripeCountryCode, JourneyStatistics, FormStatistics, CustomFields, TicketsReport, EndusersReportQueries, EndusersReport, Report, FormResponsesReportQueries, PhoneCallsReportQueries, ListOfStringsWithQualifier, GoGoMedsPet, InsuranceType, SmartMeterOrderLineItem, PhoneCallsReport, AthenaSubscription, TellescopeGender, LabeledField, HealthieSendChatAutomationAction, TwilioQueue, SendWebhookAutomationAction, DevelopHealthRunBenefitVerificationBaseArguments, WeeklyAvailability, CanvasCreateNoteAutomationAction, InboxThread, AIDecisionAutomationAction } from "@tellescope/types-models";
import { AppointmentBookingPage as AppointmentBookingPageClient, UserDisplayInfo, Enduser, Journey, FormResponse, FormField, Form, Meeting, Email, File, CalendarEvent, Organization, User as UserClient, EnduserObservation as EnduserObservationClient, AppointmentLocation, CalendarEventTemplate, Product, ManagedContentRecord, DatabaseRecord as DatabaseRecordClient, Ticket, GroupMMSConversation, EnduserOrder, EnduserEncounter, Purchase, Integration, TicketQueue, SMSMessage, EnduserEligibilityResult, Waitlist, PhoneCall, TicketThreadComment, ChatRoom as ChatRoomClient, AIConversation } from "@tellescope/types-client";
import { ValidatorDefinition, LoginFlowResult, IntegrationsTitleType } from "@tellescope/validation";
export declare const get_next_reminder_timestamp_for_ticket: ({ dueDateInMS, reminders, closedAt }: Pick<Ticket, 'dueDateInMS' | 'reminders' | 'closedAt'>) => number;
export type RelationshipConstraintOptions<T> = {
    updates?: Partial<T>;
    original?: T;
};
export type RelationshipConstraint<T> = {
    explanation: string;
    evaluate: (v: T, dependencies: Indexable<Partial<DatabaseModel>>, session: UserSession | EnduserSession, method: 'create' | 'update', options: RelationshipConstraintOptions<T>) => string | void;
};
export type DependencyAccessConstraint<T> = {
    type: 'dependency';
    foreignModel: ModelName;
    foreignField: string;
    accessField: keyof T;
};
export type FilterAccessConstraint<T> = {
    type: 'filter';
    field: keyof T | `${(keyof T) & string}.${string}`;
};
export type AccessConstraint<T> = {
    type: 'creatorOnly';
} | FilterAccessConstraint<T> | DependencyAccessConstraint<T>;
export type UniqueArrayConstraint<T> = {
    array: keyof T;
    itemKey?: string;
    compareToOtherRecords?: boolean;
};
export type AndConstraint<T> = (keyof T)[];
export type UniqueConstraint<T> = (keyof T & string | AndConstraint<T> | UniqueArrayConstraint<T>);
export type Constraint<T> = {
    unique: UniqueConstraint<T>[];
    globalUnique?: (keyof T)[];
    relationship: (RelationshipConstraint<Partial<T>>)[];
    access?: AccessConstraint<T>[];
};
export type Initializer<T, R> = (a: T, s: UserSession | EnduserSession) => R;
export type EndpointOptions = {
    parameters?: {
        [index: string]: ValidatorDefinition<any>;
    };
};
export type DependencyDeletionAction = 'delete' | 'unset' | 'setNull' | 'nop';
export type DependecyRelationship = 'foreignKey' | 'value';
export type Dependency<T = DatabaseRecord> = {
    dependsOn: ModelName[];
    dependencyField: string;
    relationship: DependecyRelationship;
    onDependencyDelete: DependencyDeletionAction;
    getDependentValues?: (t: T) => JSONType[];
    filterByDependency?: (foreignValue: JSONType, foreignModel?: DatabaseModel) => {
        field: string;
        value: JSONType | 'any';
    };
};
export type RedactionReason = ('enduser' | 'all');
export type ModelFieldInfo<T, R> = {
    validator: ValidatorDefinition<R>;
    readonly?: boolean;
    required?: boolean;
    updatesDisabled?: boolean;
    examples?: JSONType[];
    initializer?: Initializer<Partial<T>, R>;
    dependencies?: Dependency<Partial<T>>[];
    redactions?: RedactionReason[];
};
export type ModelFields<T> = {
    [K in keyof T]: ModelFieldInfo<T, T[K]>;
};
export type extractFields<Type> = Type extends ModelFields<infer X> ? X : never;
type ActionInfo = {
    name?: string;
    description?: string;
    notes?: string[];
    warnings?: string[];
    adminOnly?: boolean;
    rootAdminOnly?: boolean;
    creatorOnly?: boolean;
};
export type CustomAction<P = any, R = any> = {
    op: Operation | 'custom';
    access: CRUD;
    parameters: ModelFields<P>;
    returns: R extends Array<any> ? ModelFieldInfo<any, R> : ModelFields<R>;
    path?: string;
    method?: HTTPMethod;
    enduserOnly?: boolean;
} & ActionInfo;
export type EnduserAction = {
    field?: string;
} & ActionInfo;
type CustomActionsForModel = {
    [K in ModelName]: {
        [index: string]: CustomAction;
    };
};
type ReadFilter<T> = {
    [K in keyof T]?: {
        required: boolean;
    };
};
export type SideEffectHandler<T, O = any> = (args: Partial<T>[], m: (Partial<T> | undefined)[] | undefined, n: (Partial<T> & {
    _id: ObjectId;
})[], s: UserSession | EnduserSession, o: O) => Promise<ErrorInfo[]>;
type SideEffect = {
    name: string;
    description: string;
};
export type Model<T, N extends ModelName> = {
    info: {
        name?: string;
        description?: string;
        sideEffects?: {
            [K in Operation]?: SideEffect[];
        };
    };
    fields: ModelFields<T>;
    constraints: Constraint<T>;
    defaultActions: {
        [k in Operation]?: ActionInfo;
    };
    enduserActions?: {
        [index: string]: EnduserAction;
    };
    customActions: CustomActionsForModel[N];
    readFilter?: ReadFilter<T>;
    options?: {
        create?: EndpointOptions;
    };
};
export type extractModelType<Type> = Type extends Model<infer T, infer N> ? T : never;
export type Schema = {
    [N in keyof ServerModelForName]: Model<ServerModelForName[N], ModelName>;
};
export declare const UNIQUE_LIST_FIELDS: string[];
declare const sideEffects: {
    handleJourneyStateChange: {
        name: string;
        description: string;
    };
    sendEmails: {
        name: string;
        description: string;
    };
    sendSMSMessages: {
        name: string;
        description: string;
    };
    updateChatroomCache: {
        name: string;
        description: string;
    };
    updateEnduserStatus: {
        name: string;
        description: string;
    };
    updatePostCommentCount: {
        name: string;
        description: string;
    };
    handleTicketClosed: {
        name: string;
        description: string;
    };
    incrementFieldCount: {
        name: string;
        description: string;
    };
    decrementFieldCount: {
        name: string;
        description: string;
    };
};
export type SideEffectNames = keyof typeof sideEffects;
declare const BuiltInFields: {
    _id: {
        validator: ValidatorDefinition<Utilities.ObjectId>;
        readonly: boolean;
    };
    businessId: {
        validator: ValidatorDefinition<string>;
        readonly: boolean;
    };
    organizationIds: {
        validator: ValidatorDefinition<string[]>;
        dependencies: {
            dependsOn: (keyof import("@tellescope/types-models").ModelForName)[];
            dependencyField: string;
            relationship: "foreignKey";
            onDependencyDelete: "delete";
        }[];
    };
    sharedWithOrganizations: {
        validator: ValidatorDefinition<string[][]>;
    };
    creator: {
        validator: ValidatorDefinition<string>;
        readonly: boolean;
    };
    updatedAt: {
        validator: ValidatorDefinition<Date>;
        readonly: boolean;
    };
};
export type BuiltInFields_T = typeof BuiltInFields;
export type AutoreplyInfo = {
    channel: CommunicationsChannel | "Phone";
    enduserId: string;
    threadId?: string;
    userId?: string;
};
export type VitalLabTest = {
    "id": string;
    "name": "Lipids Panel";
    "description": "Cholesterol test";
    "sample_type": "dried blood spot";
    "method": "testkit" | "walk_in_test" | "at_home_phlebotomy";
    "price": number;
    status: "active" | "pending_approval" | "inactive";
    "is_active": true;
    "lab"?: {
        "slug": "USSL";
        "name": "US Specialty Lab";
        "first_line_address": "123 Main St";
        "city": "New York";
        "zipcode": "10001";
    };
    "markers"?: [
        {
            id: number;
            "name": "Thyroid Stimulating Hormone";
            "slug": "tsh";
            "description": "";
            aoe?: {
                questions: {
                    id: number;
                    required?: boolean;
                    code: string;
                    value: string;
                    constraint?: string;
                    type: 'choice' | 'multiple_choice' | 'numeric' | 'text';
                    answers?: {
                        id: string;
                        code: string;
                        value: string;
                    }[];
                }[];
            };
        }
    ];
};
export type VitalAOEAnswer = {
    marker_id: number;
    question_id: number;
    answer: string;
};
type BookingInfoEnduserFields = {
    state?: string;
};
export type CustomActions = {
    availability_blocks: {
        update_order: CustomAction<{
            indexUpdates: IndexUpdate[];
        }, {}>;
        handle_autoreply: CustomAction<AutoreplyInfo, {}>;
    };
    api_keys: {
        create: CustomAction<{}, {
            id: string;
            key: string;
        }>;
    };
    templates: {
        get_templated_message: CustomAction<{
            message: string;
            userId: string;
            enduserId: string;
            channel: CommunicationsChannel;
            html?: string;
            subject?: string;
            automationStepId?: string;
            journeyContext?: JourneyContext;
            relatedContactId?: string;
        }, {
            plaintext: string;
            subject: string;
            html: string;
        } & WithLinkOpenTrackingIds>;
        get_suggested_reply: CustomAction<{
            messages: ExternalChatGPTMessage[];
        }, {
            completion: string;
        }>;
        create_embedding: CustomAction<{
            templateId: string;
        }, {}>;
        embedding_search: CustomAction<{
            content: string;
        }, {
            templateIds: string[];
            message?: string;
        }>;
    };
    files: {
        prepare_file_upload: CustomAction<{
            name: string;
            size: number;
            type: string;
            enduserId?: string;
            publicRead?: boolean;
            publicName?: string;
            source?: string;
            externalId?: string;
            isCalledOut?: boolean;
            hiddenFromEnduser?: boolean;
        }, {
            presignedUpload: object;
            file: File;
        }>;
        file_download_URL: CustomAction<{
            secureName: string;
            preferInBrowser?: boolean;
        }, {
            downloadURL: string;
            name: string;
        }>;
        run_ocr: CustomAction<{
            id: string;
            type: string;
        }, {
            file: File;
        }>;
        confirm_file_upload: CustomAction<{
            id: string;
        }, {}>;
        send_fax: CustomAction<{
            id: string;
            recipientFaxNumber: string;
        }, {}>;
        push: CustomAction<{
            id: string;
            destination: string;
            type?: string;
            typeId?: string;
        }, {
            file?: File;
        }>;
    };
    form_fields: {
        load_choices_from_database: CustomAction<{
            fieldId: string;
            lastId?: string;
            limit?: number;
            databaseId?: string;
        }, {
            choices: DatabaseRecordClient[];
        }>;
        booking_info: CustomAction<{
            bookingPageId: string;
            enduserId?: string;
            enduserFields?: BookingInfoEnduserFields;
        }, {
            bookingURL: string;
            warningMessage?: string;
            entropy: string;
        }>;
    };
    forms: {
        get_form_statistics: CustomAction<{
            formId: string;
            range?: DateRange;
        }, {
            statistics: FormStatistics;
        }>;
    };
    form_responses: {
        prepare_form_response: CustomAction<{
            formId: string;
            enduserId: string;
            automationStepId?: string;
            expireAt?: Date;
            sharedVia?: CommunicationsChannel;
            isInternalNote?: boolean;
            title?: string;
            rootResponseId?: string;
            parentResponseId?: string;
            carePlanId?: string;
            context?: string;
            calendarEventId?: string;
            groupId?: string;
            groupInstance?: string;
            groupPosition?: number;
        }, {
            accessCode: string;
            url: string;
            response: FormResponse;
            fullURL: string;
        }>;
        submit_form_response: CustomAction<{
            accessCode: string;
            responses: FormResponseValue[];
            automationStepId?: string;
            customerId?: string;
            productIds?: string[];
            utm?: LabeledField[];
        }, {
            formResponse: FormResponse;
            nextFormGroupPublicURL?: string;
        }>;
        save_field_response: CustomAction<{
            formResponseId?: string;
            accessCode?: string;
            response?: FormResponseValue;
            responses?: FormResponseValue[];
        }, {}>;
        info_for_access_code: CustomAction<{
            accessCode: string;
        }, {
            form: Form;
            fields: FormField[];
            response: FormResponse;
        }>;
        stripe_details: CustomAction<{
            fieldId: string;
        }, {
            customerId: string;
            clientSecret: string;
            publishableKey: string;
            stripeAccount: string;
            businessName: string;
            answerText?: string;
            isCheckout?: boolean;
        }>;
        chargebee_details: CustomAction<{
            fieldId: string;
        }, {
            url: string;
        }>;
        generate_pdf: CustomAction<{
            id: string;
        }, {}>;
        push_to_EHR: CustomAction<{
            id: string;
            addedResponses?: FormResponseValue[];
        }, {}>;
        create_canvas_note: CustomAction<CanvasCreateNoteAutomationAction['info'] & {
            enduserId: string;
        }, {}>;
        get_report: CustomAction<{
            queries: FormResponsesReportQueries;
            formIds?: string[];
            submittedAtRange?: DateRange;
            range?: DateRange;
            enduserFilter?: Record<string, any>;
            submittedOnly?: boolean;
            includeIds?: boolean;
        }, {
            report: Report;
        }>;
        get_enduser_statistics: CustomAction<{
            enduserFields?: {
                field: string;
                value: string;
            }[];
            endusersFilter?: any;
            formIds?: string[];
            range?: DateRange;
            customTypeId?: string;
            groupBy?: string;
            includeCalendarEventTemplateIds?: string[];
        }, {
            count: number;
            grouped?: {
                _id: string;
                count: number;
            }[];
        }>;
        get_enduser_statistics_by_submitter: CustomAction<{
            enduserFields?: {
                field: string;
                value: string;
            }[];
            endusersFilter?: any;
            formIds?: string[];
            range?: DateRange;
            customTypeId?: string;
            includeCalendarEventTemplateIds?: string[];
        }, {
            count: number;
            grouped: {
                _id: string;
                count: number;
            }[];
        }>;
        get_related_forms_report: CustomAction<{
            formIds?: string[];
            submittedAtRange?: DateRange;
            childSubmittedAtRange?: DateRange;
            answers?: string[];
            groupBy?: string;
            enduserFilter?: any;
        }, {
            report: Report;
        }>;
        get_distribution_report: CustomAction<{
            formIds: string[];
            submittedAtRange?: DateRange;
        }, {
            report: Report;
        }>;
    };
    journeys: {
        delete_states: CustomAction<{
            id: string;
            states: string[];
        }, {
            updated: Journey;
        }>;
        handle_incoming_communication: CustomAction<{
            enduserId: string;
            channel?: string;
            messageId?: string;
            destination?: string;
        }, {}>;
        get_journey_statistics: CustomAction<{
            journeyId: string;
        }, {
            statistics: JourneyStatistics;
        }>;
    };
    endusers: {
        add_to_healthie_course: CustomAction<{
            id: string;
            courseId: string;
        }, {}>;
        check_eligibility: CustomAction<{
            id: string;
            integration?: string;
            clearinghouse?: string;
            insuranceType?: InsuranceType;
            reCheck?: boolean;
        }, {
            enduser: Enduser;
        }>;
        set_password: CustomAction<{
            id: string;
            password: string;
        }, {}>;
        is_authenticated: CustomAction<{
            id?: string;
            authToken: string;
        }, {
            isAuthenticated: true;
            enduser: Enduser;
        } | {
            isAuthenticated: false;
            enduser: null;
        }>;
        refresh_session: CustomAction<{
            invalidatePreviousToken?: boolean;
        }, {
            enduser: Enduser;
            authToken: string;
        }>;
        generate_auth_token: CustomAction<{
            overrideOTP?: boolean;
            overrideConsent?: boolean;
            id?: string;
            phone?: string;
            email?: string;
            externalId?: string;
            durationInSeconds?: number;
        }, {
            authToken: string;
            enduser: Enduser;
        }>;
        logout: CustomAction<{}, {}>;
        current_session_info: CustomAction<{}, {
            enduser: Enduser;
        }>;
        add_to_journey: CustomAction<{
            enduserIds: string[];
            journeyId: string;
            startAt?: Date;
            automationStepId?: string;
            journeyContext?: JourneyContext;
            throttle?: boolean;
            source?: string;
        }, {}>;
        remove_from_journey: CustomAction<{
            enduserIds: string[];
            journeyId: string;
        }, {}>;
        merge: CustomAction<{
            sourceEnduserId: string;
            destinationEnduserId: string;
        }, {}>;
        push: CustomAction<{
            enduserId: string;
            destinations?: string[];
            externalIds?: string[];
            entrypoint?: string;
        }, {
            fullscriptRedirectURL?: string;
            vital_user_id?: string;
        }>;
        bulk_update: CustomAction<{
            ids: string[];
            primaryAssignee?: string;
            state?: string;
            fields?: CustomFields;
            pushTags?: string[];
            replaceTags?: string[];
            updateAccessTags?: boolean;
            customTypeId?: string;
        }, {
            updated: Enduser[];
        }>;
        bulk_assignment: CustomAction<{
            existingAssignment?: ListOfStringsWithQualifier;
            field?: string;
            existingFieldValue?: string;
            removeIds?: string[];
            addIds?: string[];
            customTypeId?: string;
        }, {
            updated: Enduser[];
        }>;
        related_contacts_report: CustomAction<{
            minimumRelationshipsCount: number;
        }, {
            report: {
                enduserId: string;
                count: number;
            }[];
        }>;
        get_report: CustomAction<{
            queries: EndusersReportQueries;
            customTypeId?: string;
            activeSince?: Date;
            fields?: {
                field: string;
                value: string;
            }[];
            range?: DateRange;
        }, {
            report: EndusersReport;
        }>;
        get_engagement_statistics: CustomAction<{
            enduserFields?: {
                field: string;
                value: string;
            }[];
            endusersFilter?: any;
            formIds?: string[];
            range?: DateRange;
            customTypeId?: string;
            groupBy?: string;
            includeLinkClicks?: boolean;
        }, {
            count: number;
            grouped?: {
                _id: string;
                count: number;
            }[];
        }>;
        get_engagement_statistics_by_userId: CustomAction<{
            enduserFields?: {
                field: string;
                value: string;
            }[];
            endusersFilter?: any;
            formIds?: string[];
            range?: DateRange;
            customTypeId?: string;
            includeLinkClicks?: boolean;
        }, {
            count: number;
            grouped: {
                _id: string;
                count: number;
            }[];
        }>;
        sync_zendesk: CustomAction<{
            enduserId: string;
        }, {}>;
        get_journeys_report: CustomAction<{}, {
            report: Record<string, any>;
        }>;
        dosespot: CustomAction<{
            enduserId: string;
        }, {
            link: string;
        }>;
        customer_io_sync: CustomAction<{
            enduserIds: string[];
            event?: string;
            trackProperties?: string[];
        }, {}>;
        rename_stored_custom_fields: CustomAction<{
            existingName: string;
            newName: string;
        }, {}>;
        load_inbox_data: (CustomAction<{
            userId?: string;
            enduserIds?: string[];
            lastEmailId?: string;
            inboxStatuses?: string[];
            lastSMSId?: string;
            lastGroupMMSId?: string;
            lastChatRoomId?: string;
            lastPhoneCallId?: string;
            lastTicketThreadCommentId?: string;
            lastChatRoomUpdatedAt?: Date;
            lastGroupMMSUpdatedAt?: Date;
            limit?: number;
        }, {
            emails: Email[];
            sms_messages: SMSMessage[];
            group_mms_conversations: GroupMMSConversation[];
            chat_rooms: ChatRoomClient[];
            phone_calls: PhoneCall[];
            ticket_thread_comments: TicketThreadComment[];
            endusers: Enduser[];
        }>);
    };
    users: {
        display_info: CustomAction<{}, {
            fname: string;
            lname: string;
            id: string;
        }[]>;
        refresh_session: CustomAction<{
            invalidatePreviousToken?: boolean;
        }, {
            user: UserSession;
            authToken: string;
        }>;
        generate_auth_token: CustomAction<{
            id?: string;
            phone?: string;
            email?: string;
            externalId?: string;
            durationInSeconds?: number;
        }, {
            authToken: string;
            enduser?: Enduser;
            user?: User;
        }>;
        send_invitation_to_existing: CustomAction<{
            userId: string;
        }, {}>;
        invite_user: CustomAction<{
            email: string;
            fname: string;
            lname: string;
            internalDisplayName?: string;
            organizationId: string;
            role?: string;
            tags?: string[];
        }, {
            created: UserClient;
        }>;
        configure_inbox: CustomAction<{
            username: string;
            fname: string;
            lname: string;
        }, {
            user: User;
            authToken: string;
        }>;
        configure_MFA: CustomAction<{
            disable?: boolean;
        }, {
            recoveryCodes: string[];
            authToken: string;
            user: UserSession;
        }>;
        generate_MFA_challenge: CustomAction<{
            method: string;
        }, {}>;
        submit_MFA_challenge: CustomAction<{
            code: string;
        }, {
            authToken: string;
            user: UserSession;
        }>;
        get_engagement_report: CustomAction<{
            range?: DateRange;
            excludeAutomated?: boolean;
        }, {
            report: Record<string, any>;
        }>;
        consent: CustomAction<{
            termsVersion: string;
        }, {
            user: User;
            authToken: string;
        }>;
        get_users_for_groups: CustomAction<{
            groups: string[];
        }, {
            userIds: string[];
        }>;
        play_phone_message: CustomAction<{
            userId: string;
            message: string;
            enduserId?: string;
            journeyContext?: JourneyContext;
        }, {}>;
    };
    chat_rooms: {
        join_room: CustomAction<{
            id: string;
        }, {
            room: ChatRoom;
        }>;
        display_info: CustomAction<{
            id: string;
        }, {
            id: string;
            display_info: {
                [index: string]: UserDisplayInfo;
            };
        }>;
        mark_read: CustomAction<{
            id: string;
        }, {
            updated: ChatRoom;
        }>;
        send_healthie_chat: CustomAction<HealthieSendChatAutomationAction['info'] & {
            enduserId: string;
            journeyId?: string;
        }, {
            room: ChatRoom;
        }>;
    };
    meetings: {
        start_meeting: CustomAction<{
            attendees?: UserIdentity[];
            publicRead?: boolean;
        }, {
            id: string;
            meeting: {
                Meeting: MeetingInfo;
            };
            host: Attendee;
        }>;
        send_invite: CustomAction<{
            meetingId: string;
            enduserId: string;
        }, {}>;
        end_meeting: CustomAction<{
            id: string;
        }, {}>;
        add_attendees_to_meeting: CustomAction<{
            id: string;
            attendees: UserIdentity[];
        }, {}>;
        my_meetings: CustomAction<{}, {
            id: string;
            updatedAt: string;
            status: MeetingStatus;
        }[]>;
        attendee_info: CustomAction<{
            id: string;
        }, {
            attendee: Attendee;
            others: UserIdentity[];
        }>;
        start_meeting_for_event: CustomAction<{
            calendarEventId: string;
        }, {
            id: string;
            meeting: {
                Meeting: MeetingInfo;
            };
            host: Attendee;
        }>;
        join_meeting_for_event: CustomAction<{
            calendarEventId: string;
        }, {
            id: string;
            meeting: {
                Meeting: MeetingInfo;
            };
            attendee: Attendee;
        }>;
        read: CustomAction<{
            id: string;
        }, Meeting>;
    };
    webhooks: {
        configure: CustomAction<{
            url: string;
            secret: string;
            subscriptions?: WebhookSubscriptionsType;
        }, {}>;
        update: CustomAction<{
            url?: string;
            secret?: string;
            subscriptionUpdates?: WebhookSubscriptionsType;
        }, {}>;
        get_configuration: CustomAction<{}, {
            url?: string;
            subscriptions?: WebhookSubscriptionsType;
        }>;
        send_automation_webhook: CustomAction<{
            message: string;
            enduserId: string;
            automationStepId: string;
            action: SendWebhookAutomationAction;
            context?: JourneyContext;
        }, {}>;
        send_calendar_event_reminder_webhook: CustomAction<{
            id: string;
        }, {}>;
    };
    user_notifications: {
        bulk_update: CustomAction<{
            action: string;
        }, {}>;
        send_user_email_notification: CustomAction<{
            userId: string;
            message: string;
            subject?: string;
        }, {}>;
    };
    post_likes: {
        create: CustomAction<{
            postId: string;
            forumId: string;
        }, {}>;
        unlike_post: CustomAction<{
            postId: string;
            forumId: string;
        }, {}>;
    };
    integrations: {
        load_payers: CustomAction<{
            integration?: string;
            query?: string;
            offset?: number;
            limit?: number;
            next_page_token?: string;
        }, {
            next_page_token?: string;
            choices: {
                name: string;
                id: string;
            }[];
        }>;
        generate_google_auth_url: CustomAction<{
            calendarOnly?: boolean;
        }, {
            authUrl: string;
        }>;
        disconnect_google_integration: CustomAction<{}, {}>;
        generate_oauth2_auth_url: CustomAction<{
            integration: IntegrationsTitleType;
        }, {
            authUrl: string;
            state: string;
        }>;
        add_api_key_integration: CustomAction<{
            API_KEY: string;
            integration: string;
            externalId?: string;
            webhooksSecret?: string;
            environment?: string;
            fields?: Record<string, string>;
            scope?: string;
        }, {
            integration: Integration;
        }>;
        remove_api_key_integration: CustomAction<{
            integration: string;
            externalId?: string;
        }, {}>;
        disconnect_oauth2_integration: CustomAction<{
            integration: IntegrationsTitleType;
        }, {}>;
        refresh_oauth2_session: CustomAction<{
            title: string;
        }, {
            access_token: string;
            expiry_date: number;
        }>;
        connect_stripe: CustomAction<{
            accountId?: string;
            countryCode?: StripeCountryCode;
        }, {
            accountId: string;
            accountLinkUrl: string;
        }>;
        sync_ehr: CustomAction<{}, {}>;
        daily_sync: CustomAction<{}, {}>;
        connect_photon: CustomAction<{
            organizationId: string;
            clientId: string;
            clientSecret: string;
            environment?: string;
        }, {
            updatedOrganization: Organization;
        }>;
        disconnect_photon: CustomAction<{}, {}>;
        connect_elation: CustomAction<{
            clientId: string;
            clientSecret: string;
            environment?: string;
        }, {
            integration: Integration;
        }>;
        disconnect_elation: CustomAction<{}, {}>;
        connect_zendesk: CustomAction<{
            subdomain: string;
            clientId: string;
            clientSecret: string;
            adminAPIKey: string;
            apiKeyEmail: string;
        }, {}>;
        disconnect_zendesk: CustomAction<{}, {}>;
        update_zoom: CustomAction<{
            clientId?: string;
            clientSecret?: string;
        }, {}>;
        proxy_read: CustomAction<{
            integration: string;
            type: string;
            id?: string;
            query?: string;
        }, {
            data: any;
        }>;
        proxy_write: CustomAction<{
            integration: string;
            type: string;
            id?: string;
            query?: Record<string, any>;
        }, {
            data: any;
        }>;
    };
    emails: {
        sync_integrations: CustomAction<{
            enduserEmail: string;
            allUsers?: boolean;
        }, {
            newEmails: Email[];
        }>;
        deliver_via_outlook: CustomAction<{
            message: string;
            senderId: string;
            cc?: string[];
            replyId?: string;
        }, {
            id: string;
            conversationId: string;
            timestamp: string;
        }>;
        deliver_via_iterable: CustomAction<{
            recipientEmail: string;
            campaignId: string;
        }, {}>;
        send_with_template: CustomAction<{
            enduserId: string;
            senderId: string;
            templateId: string;
        }, {
            email: Email;
        }>;
        get_template_report: CustomAction<{
            range?: DateRange;
        }, {
            report: Report;
        }>;
    };
    calendar_events: {
        push: CustomAction<{
            calendarEventId: string;
            destinations?: string[];
        }, {
            event?: CalendarEvent;
        }>;
        get_events_for_user: CustomAction<{
            userId: string;
            from: Date;
            userIds?: string[];
            to?: Date;
            limit?: number;
        }, {
            events: CalendarEvent[];
        }>;
        load_events: CustomAction<{
            userIds: string[];
            from: Date;
            to: Date;
            limit?: number;
            external?: boolean;
        }, {
            events: CalendarEvent[];
        }>;
        generate_meeting_link: CustomAction<{
            eventId: string;
            enduserId: string;
        }, {
            link: string;
        }>;
        get_appointment_availability: CustomAction<{
            from: Date;
            calendarEventTemplateId: string;
            to?: Date;
            restrictedByState?: boolean;
            limit?: number;
            locationId?: string;
            businessId?: string;
            userId?: string;
            userIds?: string[];
            multi?: boolean;
            intervalInMinutes?: number;
            state?: string;
        }, {
            availabilityBlocks: BaseAvailabilityBlock[];
        }>;
        book_appointment: CustomAction<{
            userId: string;
            startTime: Date;
            calendarEventTemplateId: string;
            otherUserIds?: string[];
            token?: string;
            locationId?: string;
            bookingPageId?: string;
            rescheduledCalendarEventId?: string;
            agreedToTerms?: AppointmentTerm[];
            timezone?: Timezone;
            fields?: Record<any, any>;
            customerId?: string;
            intervalInMinutes?: number;
            holdUntil?: Date;
            holdFormResponseId?: string;
            reason?: string;
            scheduledBy?: string;
            externalId?: string;
        }, {
            createdEvent: CalendarEvent;
        }>;
        stripe_details: CustomAction<{}, {
            stripe?: StripeCheckoutInfo;
        }>;
        generate_zoom_meeting: CustomAction<{
            calendarEventId?: string;
            userId: string;
            startTimeInMS?: number;
            durationInMinutes?: number;
        }, {
            updatedEvent: CalendarEvent;
        }>;
        change_zoom_host: CustomAction<{
            calendarEventId: string;
            userId: string;
        }, {
            updatedEvent: CalendarEvent;
        }>;
        download_ics_file: CustomAction<{
            calendarEventId: string;
            attendeeId?: string;
            attendeeType?: SessionType;
            excludeAttendee?: boolean;
        }, {}>;
        get_report: CustomAction<{
            range?: DateRange;
            groupBy?: string;
            templateIds?: string[];
        }, {
            report: Report;
        }>;
        get_enduser_report: CustomAction<{
            range?: DateRange;
            groupBy?: string;
            countDuplicates?: boolean;
            templateIds?: string[];
            enduserGroupBy?: string;
            enduserFields: Record<string, any>;
        }, {
            report: Report;
        }>;
        get_status_report: CustomAction<{
            range?: DateRange;
            groupBy?: string;
        }, {
            report: Report;
        }>;
    };
    organizations: {
        create_and_join: CustomAction<{
            name: string;
            subdomain: string;
        }, {
            authToken: string;
            user: User;
            organization: Organization;
        }>;
        create_suborganization: CustomAction<{
            name: string;
            subdomain: string;
        }, {
            created: Organization;
        }>;
        add_athena_subscription: CustomAction<{
            startAt?: Date;
            type: AthenaSubscription['type'];
            frequency: number;
            daily?: boolean;
        }, {
            organization: Organization;
        }>;
        sync_athena_subscription: CustomAction<{
            type: AthenaSubscription['type'];
            backgroundTaskId?: string;
            enduserId?: string;
        }, {}>;
        sync_note_to_canvas: CustomAction<{
            enduserId: string;
            note: string;
        }, {
            canvasId: string;
        }>;
        link_twilio: CustomAction<{}, {
            organization: Organization;
        }>;
        load_twilio_embed: CustomAction<{
            type?: string;
        }, {
            id: string;
            token: string;
        }>;
    };
    phone_calls: {
        authenticate_calling: CustomAction<{
            os?: "ios" | "android";
            type?: UserCallRoutingBehavior;
        }, {
            accessToken: string;
            identity: string;
        }>;
        get_report: CustomAction<{
            queries: PhoneCallsReportQueries;
            range?: DateRange;
            enduserFilter?: Record<string, any>;
        }, {
            report: Report;
        }>;
        get_number_report: CustomAction<{
            range?: DateRange;
        }, {
            report: PhoneCallsReport;
        }>;
        upgrade_to_conference: CustomAction<{
            id: string;
        }, {}>;
        add_conference_attendees: CustomAction<{
            conferenceId: string;
            enduserId?: string;
            byClientId?: string[];
            byPhone?: string[];
        }, {}>;
        remove_conference_attendees: CustomAction<{
            conferenceId: string;
            byClientId?: string[];
            byPhone?: string[];
        }, {}>;
        end_conference: CustomAction<{
            id: string;
        }, {}>;
        cancel_recording: CustomAction<{
            enduserId: string;
        }, {}>;
        delete_recordings: CustomAction<{
            callIds: string[];
        }, {}>;
    };
    call_hold_queues: {
        answer_call: CustomAction<{
            queueId: string;
        }, {}>;
        get_details: CustomAction<{}, {
            queues: TwilioQueue[];
        }>;
    };
    analytics_frames: {
        get_result_for_query: CustomAction<{
            query: AnalyticsQuery;
            createdRange?: DateRange;
            createdAvailabilities?: WeeklyAvailability[];
            updatedRange?: DateRange;
            groupByCareTeam?: boolean;
        }, AnalyticsQueryResult>;
        get_custom_report: CustomAction<{
            key: string;
            lastId?: string;
            limit?: number;
        }, {
            report: any;
        }>;
        custom_aggregation: CustomAction<AnalyticsAggregationRequest, any>;
        update_indexes: CustomAction<{
            updates: {
                id: string;
                index: number;
            }[];
        }, {}>;
    };
    managed_content_records: {
        generate_embedding: CustomAction<{
            id: string;
        }, {
            updated: ManagedContentRecord;
        }>;
        search: CustomAction<{
            query: string;
            type?: "enduser" | "internal";
        }, {
            record: ManagedContentRecord;
            matches: ManagedContentRecord[];
            response: string;
        }>;
        update_indexes: CustomAction<{
            updates: {
                id: string;
                index: number;
            }[];
        }, {}>;
    };
    automation_triggers: {
        trigger_events: CustomAction<{
            triggers: {
                enduserId: string;
                automationTriggerId: string;
                action?: any;
                journeyContext?: JourneyContext;
            }[];
        }, {}>;
    };
    tickets: {
        close_ticket: CustomAction<{
            ticketId: string;
            closedForReason?: string;
        }, {
            updated: Ticket;
            generated?: Ticket;
        }>;
        update_indexes: CustomAction<{
            updates: {
                id: string;
                index: number;
            }[];
        }, {}>;
        get_report: CustomAction<{
            rangeField?: string;
            title?: string;
            titles?: string[];
            userId?: string;
            range?: DateRange;
            groupByOwnerAndTitle?: boolean;
        }, {
            report: TicketsReport;
        }>;
        get_distribution_report: CustomAction<{
            range?: DateRange;
        }, {
            report: Report[keyof Report];
        }>;
        assign_from_queue: CustomAction<{
            userId?: string;
            ticketId?: string;
            queueId?: string;
            overrideRestrictions?: boolean;
        }, {
            ticket: Ticket;
            queue: TicketQueue;
            enduser: Enduser;
        }>;
        bulk_delete: CustomAction<{
            ids: string[];
        }, {}>;
        bulk_assign: CustomAction<{
            ids: string[];
            userId: string;
        }, {}>;
    };
    ticket_queues: {
        update_indexes: CustomAction<{
            updates: {
                id: string;
                index: number;
            }[];
        }, {}>;
    };
    appointment_booking_pages: {
        generate_access_token: CustomAction<{
            expiresAt: Date;
            bookingPageId?: string;
        }, {
            token: string;
        }>;
    };
    enduser_observations: {
        load: CustomAction<{
            from: Date;
            to: Date;
            enduserId?: string;
            careTeam?: string[];
            unreviewed?: boolean;
        }, {
            observations: EnduserObservationClient[];
        }>;
        acknowledge: CustomAction<{
            ids: string[];
        }, {}>;
    };
    sms_messages: {
        send_message_to_number: CustomAction<{
            message: string;
            to: string;
        }, {
            enduser: Enduser;
        }>;
        get_number_report: CustomAction<{
            range?: DateRange;
        }, {
            report: PhoneCallsReport;
        }>;
        get_template_report: CustomAction<{
            range?: DateRange;
        }, {
            report: Report;
        }>;
        send_with_template: CustomAction<{
            enduserId: string;
            senderId: string;
            templateId: string;
            fromNumber?: string;
        }, {
            sms: SMSMessage;
        }>;
        send_message_as_user_notification: CustomAction<{
            to: string;
            message: string;
        }>;
    };
    products: {
        prepare_stripe_checkout: CustomAction<{
            productIds: string[];
        }, {
            customerId: string;
            clientSecret: string;
            publishableKey: string;
            stripeAccount: string;
            businessName: string;
        }>;
        get_stripe_portal_session: CustomAction<{
            stripeKey?: string;
            stripeCustomerId?: string;
            return_url: string;
        }, {
            url: string;
        }>;
    };
    purchases: {
        charge_card_on_file: CustomAction<{
            enduserId: string;
            productIds?: string[];
            priceIds?: string[];
            cost?: Purchase['cost'];
            stripeKey?: string;
            description?: string;
            subscriptionPriceId?: string;
        }, {}>;
    };
    group_mms_conversations: {
        start_conversation: CustomAction<{
            message: string;
            sender: string;
            enduserIds: string[];
            userIds: string[];
            phoneNumber: string;
            title: string;
        }, {
            conversation: GroupMMSConversation;
        }>;
        send_message: CustomAction<{
            conversationId: string;
            message: string;
            sender: string;
            logOnly?: boolean;
        }, {
            conversation: GroupMMSConversation;
        }>;
    };
    enduser_orders: {
        get_available_tests: CustomAction<{
            zipCode?: string;
            teamId?: string;
        }, {
            tests: VitalLabTest[];
        }>;
        create_smart_meter_order: CustomAction<{
            enduserId: string;
            lines: SmartMeterOrderLineItem[];
            shipping?: string;
        }, {
            order: EnduserOrder;
        }>;
        create_lab_order: CustomAction<{
            enduserId: string;
            labTestId: string;
            physicianUserId?: string;
            teamId?: string;
            activateBy?: string;
            aoe_answers?: VitalAOEAnswer[];
        }, {
            order: EnduserOrder;
        }>;
        cancel_order: CustomAction<{
            orderId: string;
        }, {
            order?: EnduserOrder;
        }>;
        create_go_go_meds_order: CustomAction<{
            enduserId: string;
            PrescriptionImage: string;
            title?: string;
        } & GoGoMedsPet, {
            order: EnduserOrder;
        }>;
    };
    enduser_encounters: {
        create_candid_encounter: CustomAction<{
            encounterId: string;
        }, {
            encounter: EnduserEncounter;
        }>;
    };
    enduser_eligibility_results: {
        develop_health_run_benefit_verification: CustomAction<DevelopHealthRunBenefitVerificationBaseArguments & {
            enduserId: string;
            providerUserId: string;
            insuranceType?: string;
        }, {
            result: EnduserEligibilityResult;
        }>;
    };
    agent_records: {
        submit_support_ticket: CustomAction<{
            priority: string;
            message: string;
        }, {}>;
    };
    waitlists: {
        grant_access_from_waitlist: CustomAction<{
            id: string;
            count: number;
        }, {
            waitlist: Waitlist;
        }>;
    };
    background_errors: {
        mark_read: CustomAction<{}, {}>;
    };
    phone_trees: {
        start_outbound_call: CustomAction<{
            treeId: string;
            enduserId: string;
            journeyId: string;
            automationStepId: string;
            journeyContext?: JourneyContext;
        }, {}>;
    };
    ai_conversations: {
        send_message: CustomAction<{
            message: string;
            type?: string;
            prompt?: string;
            conversationId?: string;
            maxTokens?: number;
        }, {
            ai_conversation: AIConversation;
        }>;
        generate_ai_decision: CustomAction<AIDecisionAutomationAction['info'] & {
            enduserId: string;
            automationStepId: string;
            journeyContext?: JourneyContext;
        }, {}>;
    };
    inbox_threads: {
        build_threads: CustomAction<{
            from: Date;
            to: Date;
        }, {
            alreadyBuilt: boolean;
        }>;
        load_threads: CustomAction<{
            limit?: number;
            excludeIds?: string[];
            lastTimestamp?: Date;
            userIds?: string[];
            enduserIds?: string[];
        }, {
            threads: InboxThread[];
        }>;
    };
};
export type PublicActions = {
    endusers: {
        login: CustomAction<{
            id?: string;
            email?: string;
            phone?: string;
            password: string;
            durationInSeconds: number;
            businessId: string;
            organizationIds?: string[];
        }, {
            authToken: string;
        }>;
        register: CustomAction<{
            emailConsent?: boolean;
            fname?: string;
            lname?: string;
            email: string;
            password: string;
            termsVersion?: string;
            termsSigned?: Date;
            businessId: string;
            organizationIds?: string[];
        }, {}>;
        request_password_reset: CustomAction<{
            email: string;
            businessId: string;
            organizationIds?: string[];
        }, {}>;
        reset_password: CustomAction<{
            resetToken: string;
            newPassword: string;
            businessId: string;
            organizationIds?: string[];
        }, {}>;
        begin_login_flow: CustomAction<{
            email?: string;
            phone?: string;
            redir?: string;
            businessId: string;
            organizationIds?: string[];
        }, {
            result: LoginFlowResult;
            email?: string;
            otpToken?: string;
        }>;
        unsubscribe: CustomAction<{
            enduserId: string;
            unsubscribeFrom: string[];
        }, {}>;
        get_otp_methods: CustomAction<{
            token: string;
        }, {
            methods: string[];
        }>;
        send_otp: CustomAction<{
            token: string;
            method: string;
        }, {}>;
        verify_otp: CustomAction<{
            token: string;
            code: string;
        }, {
            authToken: string;
            enduser: Enduser;
        }>;
    };
    users: {
        begin_sso: CustomAction<{
            provider: string;
            configurationId?: string;
        }, {
            url: string;
        }>;
        complete_sso: CustomAction<{
            token: string;
        }, {
            authToken: string;
            user: User;
        }>;
        login: CustomAction<{
            email: string;
            password: string;
            expirationInSeconds?: number;
        }, {
            user: User;
            authToken: string;
        }>;
        login_with_google: CustomAction<{
            jwt: string;
        }, {
            user: User;
            authToken: string;
        }>;
        register: CustomAction<{
            email: string;
            password: string;
            termsVersion: string;
            inviteCode?: string;
        }, {}>;
        request_password_reset: CustomAction<{
            email: string;
        }, {}>;
        reset_password: CustomAction<{
            resetToken: string;
            newPassword: string;
        }, {}>;
        submit_email_verification: CustomAction<{
            email: string;
            code: string;
        }, {
            authToken: string;
            user: User;
        }>;
    };
    organizations: {
        get_theme: CustomAction<{
            businessId: string;
            organizationIds?: string[];
        }, {
            theme: OrganizationTheme;
        }>;
    };
    forms: {
        public_form_details: CustomAction<{
            formId: string;
        }, {
            form: Form;
        }>;
    };
    form_responses: {
        session_for_public_form: CustomAction<{
            fname?: string;
            lname?: string;
            email?: string;
            phone?: string;
            dateOfBirth?: string;
            gender?: TellescopeGender;
            formId: string;
            businessId: string;
            publicIdentifier?: string;
            state?: string;
            customTypeId?: string;
            skipMatch?: boolean;
            enduserId?: string;
            groupId?: string;
            utm?: LabeledField[];
        }, {
            accessCode: string;
            authToken: string;
            url: string;
            path: string;
            enduserId: string;
        }>;
    };
    calendar_events: {
        session_for_join_link: CustomAction<{
            token: string;
        }, {
            authToken: string;
            eventId: string;
        }>;
        session_for_start_link: CustomAction<{
            token: string;
        }, {
            authToken: string;
            eventId: string;
        }>;
        session_for_public_appointment_booking: CustomAction<{
            fname?: string;
            lname?: string;
            dateOfBirth?: string;
            email: string;
            phone?: string;
            state?: string;
            calendarEventTemplateId: string;
            businessId: string;
            organizationIds?: string[];
        }, {
            authToken: string;
            stripe?: StripeCheckoutInfo;
        }>;
        details_for_appointment_booking_page: CustomAction<{
            appointmentBookingPageId: string;
            businessId: string;
            userId?: string;
            restrictedByState?: boolean;
            userTags?: string[];
            userFilterTags?: string[];
        }, {
            appointmentBookingPage: AppointmentBookingPageClient;
            locations: AppointmentLocation[];
            calendarEventTemplates: CalendarEventTemplate[];
            products: Product[];
            userDisplayName?: string;
            userAvatar?: string;
            users?: UserClient[];
        }>;
    };
    sms_messages: {
        leave_message: CustomAction<{
            businessId: string;
            fname: string;
            lname: string;
            phone: string;
            message: string;
        }, {}>;
    };
    appointment_booking_pages: {
        validate_access_token: CustomAction<{
            token: string;
            bookingPageId?: string;
        }, {
            isValid: boolean;
        }>;
    };
    managed_content_records: {
        load_unauthenticated: CustomAction<{
            id: string;
        }, {
            record: ManagedContentRecord;
        }>;
    };
};
export type SchemaV1 = Schema & {
    [K in keyof CustomActions]: {
        customActions: CustomActions[K];
    };
} & {
    [K in keyof PublicActions]: {
        publicActions: PublicActions[K];
    };
};
export declare const build_schema: <T extends Schema>(schema: T) => T;
export declare const schema: SchemaV1;
export {};
//# sourceMappingURL=schema.d.ts.map