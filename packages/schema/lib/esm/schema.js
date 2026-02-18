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
import { WEBHOOK_MODELS, } from "@tellescope/types-models";
import { booleanValidator, dateValidator, emailValidator, fieldsValidator, journeysValidator, journeyStatesValidator, phoneValidator, nameValidator, nonNegNumberValidator, mongoIdValidator, mongoIdStringRequired as mongoIdStringValidator, listOfMongoIdStringValidator, preferenceValidator, objectAnyFieldsAnyValuesValidator, stringValidator, stringValidator100, stringValidator105, listOfStringsValidator, emailEncodingValidator, numberToDateValidator, SMSMessageValidator, chatRoomTypeValidator, idStringToDateValidator, subdomainValidator, messageTemplateTypeValidator, stringValidator210, stringValidator250, stringValidator5000, listOfDisplayNameInfo, fileTypeValidator, fileSizeValidator, meetingStatusValidator, listOfAttendeesValidator, meetingInfoValidator, listOfUserIndentitiesValidator, meetingsListValidator, urlValidator, WebhookSubscriptionValidator, attendeeValidator, meetingDisplayInfoValidator, intakePhoneValidator, formResponsesValidator, stringValidator25000, automationActionValidator, automationEventValidator, automatedActionStatusValidator, listOfStringsValidatorEmptyOk, listOfChatAttachmentsValidator, listOfCalendarEventRemindersValidator, messageTemplateModeValidator, listOfAutomationConditionsValidator, chatRoomUserInfoValidator, CUDStringValidator, listOfRelatedRecordsValidator, cancelConditionsValidator, notificationPreferencesValidator, FHIRObservationCategoryValidator, FHIRObservationStatusCodeValidator, FHIRObservationValueValidator, userIdentityValidator, formFieldTypeValidator, previousFormFieldsValidator, numberValidator, organizationThemeValidator, managedContentRecordTypeValidator, passwordValidator, flowchartUIValidator, integrationAuthenticationsValidator, listOfMongoIdStringValidatorEmptyOk, formFieldOptionsValidator, blocksValidator, sessionTypeValidator, portalSettingsValidator, emailValidatorEmptyOkay, phoneValidatorOptional, stringValidator1000, databaseFieldsValidator, databaseRecordValuesValidator, automationEventsValidator, portalBlocksValidator, enduserFormResponsesForEventValidator, enduserTasksForEventValidator, stateCredentialsValidator, stateValidator, weeklyAvailabilitiesValidator, calendarEventLimitsValidator, timezoneValidator, formTypeValidator, managedContentRecordAssignmentTypeValidator, listOfGenericAttachmentsValidator, accessPermissionsValidator, organizationLimitsValidator, organizationSettingsValidator, communicationsChannelValidator, genericUnitWithQuantityValidator, stringValidator25000EmptyOkay, slugValidator, stringValidator5000EmptyOkay, loginFlowResultValidator, sharedWithOrganizationIdsValidator, stringValidator1000Optional, tellescopeGenderValidator, appointmentTermsValidator, paymentProcessorValidator, purchaseCreditValueValidator, costValidator, integrationTitleValidator, journeyContextValidator, stringValidator100000EmptyOkay, analyticsQueryValidator, dateRangeValidator, calendarEventPortalSettingsValidator, dateOptionalOrEmptyStringValidator, baseAvailabilityBlocksValidator, availabilityEntitiesValidator, indexUpdatesValidator, dateRangeOptionalValidator, booleanValidatorOptional, automationTriggerActionValidator, automationTriggerEventValidator, automatioNTriggerStatusValidator, exactMatchValidator, exactMatchValidatorOptional, listOfMongoIdStringValidatorOptionalOrEmptyOk, listOfStringsValidatorOptionalOrEmptyOk, stringValidatorOptionalEmptyOkay, analyticsQueryResultsValidator, stringValidatorOptional, addressValidator, superbillPatientInfoValidator, superbillProviderInfoValidator, superbillLineItemsValidator, billingCodeValidatorOptional, analyticsFrameTypeValidator, videoIntegrationTypesValidator, scheduledJourneysValidator, formScoringValidator, embeddingTypeValidator, listValidator, userCallRoutingBehaviorValidator, userUIRestrictionsValidator, externalChatGPTMessagesValidator, enduserProfileViewBlocksValidator, intakeDateOfBirthValidator, objectValidator, mongoIdStringRequired, objectAnyFieldsValidator, phoneTreeNodesValidator, phoneTreeEnduserConditionValidator, orValidator, optionalAnyObjectValidator, listValidatorOptionalOrEmptyOk, formCustomizationValidator, buildInFieldsValidator, customEnduserFieldsValidatorOptionalOrEmpty, ticketActionsValidator, formResponseValidator, numberValidatorOptional, languageValidator, relatedRecordValidator, mongoIdStringOptional, tableViewColumnsValidator, formFieldCalloutConditionsValidator, endusersReportQueriesValidator, formResponsesReportQueriesValidator, phoneCallsReportQueriesValidator, listValidatorEmptyOk, phonePlaybackValidatorOptional, ticketSnoozesValidator, listOfStringsWithQualifierValidator, listOfStringsWithQualifierValidatorOptional, stringValidator100000OptionalEmptyOkay, mmsMessagesValidator, groupMMSUserStatesValidator, sortingFieldsValidator, listOfUniqueStringsValidatorEmptyOk, ticketReminderValidator, insuranceOptionalValidator, pharmacyValidator, listOfStringsValidatorUniqueOptionalOrEmptyOkay, diagnosesValidator, stateValidatorOptional, canvasCodingValidator, vitalConfigurationRangesValidator, smartMeterLinesValidator, formFieldFeedbackValidator, phonePlaybackValidator, enduserProfileWebhooksValidator, fieldsSyncValidator, athenaSubscriptionTypeValidator, dateValidatorOptional, listQueryQualifiersValidator, stringValidator5000OptionalEmptyOkay, labeledFieldsValidator, fieldMappingsValidator, analyticsFrameGroupingCategoriesValidator, customDashboardViewValidator, bookingRestrictionsByTemplateValidator, listOfNumbersValidatorUniqueOptionalOrEmptyOkay, enduserDiagnosisValidator, canvasCodingValidatorOptional, calendarEventAttendeesValidator, developHealthDrugsValidator, developHealthDiagnosesValidator, developHealthMockResultValidator, positiveNumberValidator, listOfStringsWithQualifierValidatorOptionalValuesEmptyOkay, recentViewersValidator, stringValidator100000OptionalEmptyOkayEscapeHTML, customPoliciesValidator, stringValidator100EscapeHTML, outOfOfficeBlocksValidator, AIDecisionSourceValidator, AIMessageInputValidator, listOfObjectAnyFieldsAnyValuesValidator, } from "@tellescope/validation";
import { CREATOR_ONLY_ACCESS, DEFAULT_OPERATIONS, PLACEHOLDER_ID, ENDUSER_SESSION_TYPE, USER_SESSION_TYPE, CANDID_TITLE, DEVELOP_HEALTH_TITLE, } from "@tellescope/constants";
export var get_next_reminder_timestamp_for_ticket = function (_a) {
    var dueDateInMS = _a.dueDateInMS, reminders = _a.reminders, closedAt = _a.closedAt;
    if (!dueDateInMS)
        return -1;
    if (closedAt)
        return -1;
    var pending = reminders === null || reminders === void 0 ? void 0 : reminders.filter(function (r) { return !r.didRemind; });
    if (!(pending === null || pending === void 0 ? void 0 : pending.length))
        return -1;
    var maxMsBeforeStartTime = Math.max.apply(Math, pending.map(function (p) { return p.msBeforeDueDate; }));
    return dueDateInMS - maxMsBeforeStartTime;
};
export var UNIQUE_LIST_FIELDS = ['assignedTo', 'tags', 'closeReasons'];
var sideEffects = {
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
};
var BOOLEAN_EXAMPLES = [true, false];
var BuiltInFields = {
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
                dependsOn: ['organizations'],
                dependencyField: 'organizationIds',
                relationship: 'foreignKey',
                onDependencyDelete: 'delete',
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
    originalId: {
        validator: stringValidator250,
    },
};
export var build_schema = function (schema) { return schema; };
export var schema = build_schema({
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
                    evaluate: function (_a, _, session) {
                        var _id = _a._id;
                        if (session.type === USER_SESSION_TYPE)
                            return;
                        if (session.id !== (_id === null || _id === void 0 ? void 0 : _id.toString()))
                            return "Endusers may only update their own profile";
                    }
                }, {
                    explanation: "Enduser organizationIds can only be updated by users",
                    evaluate: function (_a, _, session, method, _b) {
                        var updates = _b.updates;
                        if (method === 'create')
                            return; // create already admin restricted
                        if (session.type === 'user')
                            return;
                        if (!(updates === null || updates === void 0 ? void 0 : updates.organizationIds))
                            return;
                        return "Enduser organizationIds can only be updated by users";
                    }
                }
            ],
            access: [
                { type: 'filter', field: 'assignedTo' },
            ]
        },
        defaultActions: DEFAULT_OPERATIONS,
        enduserActions: {
            read: {}, readMany: {},
            logout: {}, refresh_session: {}, update: {}, current_session_info: {},
            add_to_journey: {}, remove_from_journey: {}, begin_login_flow: {}, set_password: {},
            unsubscribe: {},
        },
        fields: __assign(__assign({}, BuiltInFields), { recentViewers: { validator: recentViewersValidator }, healthie_dietitian_id: { validator: stringValidator100 }, mergedIds: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk, readonly: true, redactions: ['enduser'] }, externalId: {
                validator: stringValidator250,
                examples: ['addfed3e-ddea-415b-b52b-df820c944dbb'],
            }, email: {
                validator: emailValidatorEmptyOkay,
                examples: ['test@tellescope.com'],
                redactions: ['enduser'],
            }, unsubscribedFromMarketing: { validator: booleanValidator }, alternateEmails: { validator: listValidatorOptionalOrEmptyOk(emailValidator), redactions: ['enduser'] }, alternatePhones: { validator: listOfStringsValidatorEmptyOk, redactions: ['enduser'] }, emailConsent: {
                validator: booleanValidator,
                examples: BOOLEAN_EXAMPLES,
                initializer: function (e) { return !!e.email; },
                redactions: ['enduser'],
            }, phone: {
                validator: phoneValidatorOptional,
                examples: ['+14155555555'],
                redactions: ['enduser'],
            }, landline: {
                validator: phoneValidatorOptional,
                examples: ['+14155555555'],
                redactions: ['enduser'],
            }, phoneConsent: {
                validator: booleanValidator,
                examples: BOOLEAN_EXAMPLES,
                initializer: function (e) { return !!e.phone; },
                redactions: ['enduser'],
            }, hashedPassword: {
                validator: stringValidator100,
                readonly: true,
                redactions: ['all'],
            }, fname: {
                validator: nameValidator,
                redactions: ['enduser'],
            }, mname: { validator: nameValidator, redactions: ['enduser'], }, lname: {
                validator: nameValidator,
                redactions: ['enduser'],
            }, suffix: {
                validator: stringValidator100,
                redactions: ['enduser'],
            }, dateOfBirth: {
                validator: stringValidator250,
                redactions: ['enduser'],
            }, journeys: {
                validator: journeysValidator,
                redactions: ['enduser'],
                dependencies: [
                    {
                        dependsOn: ['journeys'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'unset',
                        getDependentValues: function (t) { var _a; return Object.keys((_a = t.journeys) !== null && _a !== void 0 ? _a : {}); },
                        filterByDependency: function (journeyId) { return ({
                            field: "journeys.".concat(journeyId),
                            value: 'any',
                        }); },
                    },
                ]
            }, scheduledJourneys: { validator: scheduledJourneysValidator }, tags: {
                redactions: ['enduser'],
                validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay,
            }, accessTags: {
                redactions: ['enduser'],
                validator: listOfStringsValidatorEmptyOk,
            }, unredactedTags: {
                validator: listOfStringsValidatorEmptyOk,
            }, fields: {
                redactions: ['enduser'],
                validator: fieldsValidator,
            }, unredactedFields: {
                validator: fieldsValidator,
            }, preference: {
                redactions: ['enduser'],
                validator: preferenceValidator,
            }, assignedTo: {
                redactions: ['enduser'],
                validator: listOfUniqueStringsValidatorEmptyOk,
            }, primaryAssignee: {
                validator: mongoIdStringValidator,
                redactions: ['enduser'],
            }, unread: {
                redactions: ['enduser'],
                validator: booleanValidator,
            }, lastActive: {
                validator: dateValidator,
            }, lastLogout: { validator: dateValidator }, termsSigned: { validator: dateValidator }, termsVersion: { validator: stringValidator100 }, lastCommunication: {
                redactions: ['enduser'],
                validator: dateValidator,
            }, avatar: {
                validator: stringValidator1000,
                // BUG: This dependency is disabled because handleDeletionForDependencies queries
                // by file._id instead of file.secureName (the dependencyField is ignored).
                // Fixing would require: 1) updating the delete handler to use dependencyField,
                // 2) adding an index on { businessId: 1, avatar: 1 } for endusers collection.
                // Not worth supporting for now since avatar file deletion is rare.
                // dependencies: [
                //   {
                //     dependsOn: ['files'],
                //     dependencyField: 'secureName',
                //     relationship: 'foreignKey',
                //     onDependencyDelete: 'unset',
                //   },
                // ]
            }, 
            // should allow any gender via API but our UI can limit to Tellescope types by default
            gender: { validator: stringValidator, redactions: ['enduser'] }, genderIdentity: { validator: stringValidator100, redactions: ['enduser'] }, pronouns: { validator: stringValidator100, redactions: ['enduser'] }, height: { validator: genericUnitWithQuantityValidator, redactions: ['enduser'] }, weight: { validator: genericUnitWithQuantityValidator, redactions: ['enduser'] }, source: { validator: stringValidator1000Optional }, addressLineOne: { validator: stringValidator5000EmptyOkay, redactions: ['enduser'] }, addressLineTwo: { validator: stringValidator5000EmptyOkay, redactions: ['enduser'] }, city: { validator: stringValidator5000EmptyOkay, redactions: ['enduser'] }, state: { validator: stateValidator, redactions: ['enduser'] }, zipCode: { validator: stringValidator25000EmptyOkay, redactions: ['enduser'] }, zipPlusFour: { validator: stringValidator100, redactions: ['enduser'] }, timezone: { validator: timezoneValidator }, humanReadableId: { validator: stringValidator100 }, displayName: { validator: stringValidator250 }, unsubscribedFromPortalChatNotifications: { validator: booleanValidator }, triggeredEvents: { validator: objectAnyFieldsValidator(numberValidator) }, customTypeId: { validator: mongoIdStringValidator }, language: { validator: languageValidator }, relationships: {
                validator: listValidatorOptionalOrEmptyOk(objectValidator({
                    id: mongoIdStringRequired,
                    type: stringValidator100,
                }))
            }, markedReadAt: { validator: dateOptionalOrEmptyStringValidator }, markedUnreadAt: { validator: dateOptionalOrEmptyStringValidator }, note: { validator: stringValidator25000EmptyOkay, redactions: ['enduser'] }, noteIsFlagged: { validator: booleanValidator }, insurance: { validator: insuranceOptionalValidator, redactions: ['enduser'] }, insuranceSecondary: { validator: insuranceOptionalValidator, redactions: ['enduser'] }, bookingNotes: {
                validator: listValidatorOptionalOrEmptyOk(objectValidator({
                    bookingPageId: mongoIdStringRequired,
                    note: stringValidator5000EmptyOkay,
                })),
                redactions: ['enduser'],
            }, devices: {
                validator: listValidatorOptionalOrEmptyOk(objectValidator({
                    title: stringValidatorOptional,
                    id: stringValidatorOptional,
                    gatewayId: stringValidatorOptional,
                    disabled: booleanValidatorOptional,
                    archivedAt: dateValidatorOptional,
                })),
                redactions: ['enduser'],
            }, references: { validator: listOfRelatedRecordsValidator, updatesDisabled: true, redactions: ['enduser'] }, athenaDepartmentId: { validator: stringValidator100, redactions: ['enduser'] }, athenaPracticeId: { validator: stringValidator100, redactions: ['enduser'] }, salesforceId: { validator: stringValidator100, redactions: ['enduser'] }, vitalTriggersDisabled: { validator: booleanValidator }, defaultFromPhone: { validator: phoneValidator, redactions: ['enduser'] }, defaultFromEmail: { validator: emailValidator, redactions: ['enduser'] }, useDefaultFromEmailInAutomations: { validator: booleanValidator }, useDefaultFromPhoneInAutomations: { validator: booleanValidator }, stripeCustomerId: { validator: stringValidator100, redactions: ['enduser'] }, stripeKey: { validator: stringValidator250, redactions: ['enduser'] }, diagnoses: {
                validator: listValidatorOptionalOrEmptyOk(enduserDiagnosisValidator),
                redactions: ['enduser']
            }, unsubscribedFromPhones: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay, redactions: ['enduser'] }, lockedFromPortal: { validator: booleanValidator }, eligibleForAutoMerge: { validator: booleanValidator }, preferredPharmacy: { validator: pharmacyValidator, redactions: ['enduser'] } }),
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
                returns: {},
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
                    insuranceType: { validator: exactMatchValidator(['Primary', 'Secondary']) },
                    reCheck: { validator: booleanValidatorOptional },
                },
                returns: {
                    enduser: { validator: 'enduser' },
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
                returns: {}
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
                returns: {}
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
                returns: {} //authToken: { validator: stringValidator5000 } },
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
                } // todo: add enduser eventually, when validator defined
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
                } // todo: add enduser eventually, when validator defined
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
                    overrideOTP: { validator: booleanValidatorOptional },
                    overrideConsent: { validator: booleanValidatorOptional },
                },
                returns: {
                    authToken: { validator: stringValidator100, required: true },
                    enduser: { validator: 'enduser', required: true },
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
                parameters: {},
                enduserOnly: true,
                returns: {
                    enduser: { validator: 'enduser', required: true },
                } // todo: add enduser eventually, when validator defined
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
                    entrypoint: { validator: stringValidator },
                },
                returns: {
                    fullscriptRedirectURL: { validator: stringValidator },
                    vital_user_id: { validator: stringValidator },
                    scriptsure_patient_id: { validator: stringValidator },
                    scriptsure_deep_link: { validator: stringValidator },
                    scriptsure_practice_id: { validator: stringValidator },
                },
            },
            bulk_update: {
                op: "custom", access: 'update', method: "patch",
                name: 'Bulk Updates',
                path: '/endusers/bulk-update',
                description: "Updates custom fields across a batch of endusers at once",
                parameters: {
                    ids: { validator: listOfMongoIdStringValidator, required: true },
                    primaryAssignee: { validator: mongoIdStringValidator },
                    fields: { validator: fieldsValidator },
                    pushTags: { validator: listOfStringsValidator },
                    replaceTags: { validator: listOfStringsValidator },
                    customTypeId: { validator: stringValidator },
                    updateAccessTags: { validator: booleanValidator },
                    state: { validator: stateValidator },
                },
                returns: {
                    updated: { validator: 'endusers' },
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
                    updated: { validator: 'endusers' },
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
                    report: { validator: listValidator(objectValidator({ enduserId: stringValidator, count: numberValidator })), required: true }
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
                    customTypeId: { validator: stringValidator100 },
                    range: { validator: dateRangeOptionalValidator },
                    // mmddyyyyRangeField: { validator: stringValidator },
                    fields: {
                        validator: listValidatorEmptyOk(objectValidator({ field: stringValidator, value: stringValidator }))
                    }
                },
                returns: {
                    report: { validator: objectAnyFieldsAnyValuesValidator, required: true }
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
                        validator: listValidatorEmptyOk(objectValidator({ field: stringValidator, value: stringValidator }))
                    },
                    endusersFilter: { validator: objectAnyFieldsAnyValuesValidator },
                    groupBy: { validator: stringValidator },
                    includeLinkClicks: { validator: booleanValidator },
                },
                returns: {
                    count: { validator: numberValidator, required: true },
                    grouped: { validator: objectAnyFieldsAnyValuesValidator, },
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
                        validator: listValidatorEmptyOk(objectValidator({ field: stringValidator, value: stringValidator }))
                    },
                    endusersFilter: { validator: objectAnyFieldsAnyValuesValidator },
                    includeLinkClicks: { validator: booleanValidator },
                },
                returns: {
                    count: { validator: numberValidator, required: true },
                    grouped: { validator: objectAnyFieldsAnyValuesValidator, },
                },
            },
            sync_zendesk: {
                op: 'custom', access: 'read', method: 'post',
                path: '/endusers/sync-zendesk',
                name: 'Sync historical Zendesk tickets for a given enduser',
                description: "",
                parameters: { enduserId: { validator: mongoIdStringValidator, required: true } },
                returns: {}
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
            load_inbox_data: {
                op: 'custom', access: 'read', method: 'get',
                path: '/endusers/load-inbox-data',
                name: 'Load Inbox Data',
                description: "Loads data for displaying on the inbox",
                parameters: {
                    limit: { validator: nonNegNumberValidator },
                    userId: { validator: mongoIdStringValidator },
                    enduserIds: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk },
                    inboxStatuses: { validator: listOfStringsValidatorOptionalOrEmptyOk },
                    lastEmailId: { validator: mongoIdStringValidator },
                    lastChatRoomId: { validator: mongoIdStringValidator },
                    lastSMSId: { validator: mongoIdStringValidator },
                    lastGroupMMSId: { validator: mongoIdStringValidator },
                    lastPhoneCallId: { validator: mongoIdStringValidator },
                    lastTicketThreadCommentId: { validator: mongoIdStringValidator },
                    lastChatRoomUpdatedAt: { validator: dateValidatorOptional },
                    lastGroupMMSUpdatedAt: { validator: dateValidatorOptional },
                    phoneNumber: { validator: phoneValidatorOptional },
                },
                returns: {
                    emails: { validator: 'emails', required: true },
                    chat_rooms: { validator: 'chat_rooms', required: true },
                    sms_messages: { validator: 'sms_messages', required: true },
                    group_mms_conversations: { validator: 'group_mms_conversations', required: true },
                    phone_calls: { validator: 'phone_calls', required: true },
                    ticket_thread_comments: { validator: 'ticket_thread_comments', required: true },
                    endusers: { validator: 'endusers', required: true },
                }
            },
        },
        publicActions: {
            begin_login_flow: {
                op: "custom", access: 'read', method: "post",
                name: 'Begin enduser login flow',
                path: '/begin-enduser-login-flow',
                description: "Starts the login process for an enduser, supporting passwordless options",
                enduserOnly: true,
                parameters: {
                    businessId: { validator: mongoIdStringValidator, required: true, },
                    organizationIds: { validator: listOfMongoIdStringValidatorEmptyOk },
                    phone: { validator: phoneValidator },
                    email: { validator: emailValidator },
                    redir: { validator: stringValidator },
                    dateOfBirth: { validator: stringValidator250 },
                    brandId: { validator: mongoIdStringValidator },
                },
                returns: {
                    result: { validator: loginFlowResultValidator, required: true },
                    otpToken: { validator: stringValidator, required: true },
                    email: { validator: emailValidator },
                },
            },
            login: {
                op: "custom", access: 'read', method: "post",
                name: 'Login enduser',
                path: '/login-enduser',
                description: "Generates an authentication token for access to enduser-facing endpoints",
                enduserOnly: true,
                parameters: {
                    businessId: { validator: mongoIdStringValidator, required: true, },
                    organizationIds: { validator: listOfMongoIdStringValidatorEmptyOk },
                    id: { validator: mongoIdStringValidator },
                    phone: { validator: phoneValidator },
                    email: { validator: emailValidator },
                    password: { validator: stringValidator100, required: true },
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
                returns: {} //authToken: { validator: stringValidator5000 } },
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
                returns: {},
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
                returns: {},
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
                returns: {},
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
                    brandId: { validator: mongoIdStringValidator },
                },
                returns: {},
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
                    enduser: { validator: 'enduser', required: true },
                },
            },
        },
    },
    enduser_status_updates: {
        info: {
            sideEffects: { create: [sideEffects.updateEnduserStatus], createMany: [sideEffects.updateEnduserStatus] },
        },
        fields: __assign(__assign({}, BuiltInFields), { journeyId: {
                validator: mongoIdStringValidator,
                examples: [PLACEHOLDER_ID],
                required: true,
                dependencies: [{
                        dependsOn: ['journeys'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, enduserId: {
                validator: mongoIdStringValidator,
                examples: [PLACEHOLDER_ID],
                required: true,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, status: {
                required: true,
                validator: stringValidator250,
                examples: ["Status"]
            } }),
        constraints: { unique: [], relationship: [], access: [] },
        defaultActions: { create: {}, createMany: {}, read: {}, readMany: {}, delete: {} },
        customActions: {},
    },
    api_keys: {
        info: {},
        fields: __assign(__assign({}, BuiltInFields), { hashedKey: {
                validator: stringValidator,
                readonly: true,
            } }),
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
        enduserActions: { proxy_read: {}, proxy_write: {} },
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: stringValidator100,
                required: true,
                examples: ["Integration Title"]
            }, authentication: {
                validator: integrationAuthenticationsValidator,
                required: true,
                examples: [
                    {
                        type: 'oauth2',
                        info: {}
                    }
                ]
            }, pushHistoricalEvents: { validator: booleanValidator }, pushHistoricalFiles: { validator: booleanValidator }, syncCareTeam: { validator: booleanValidator }, syncAsActive: { validator: booleanValidator }, requirePhoneToPushEnduser: { validator: booleanValidator }, lastSync: { validator: nonNegNumberValidator }, emailDisabled: { validator: booleanValidator }, syncUnrecognizedSenders: { validator: booleanValidator }, createEndusersForUnrecognizedSenders: { validator: booleanValidator }, calendars: { validator: listOfStringsValidatorOptionalOrEmptyOk }, environment: { validator: stringValidator100 }, webhooksSecret: { validator: stringValidator }, shouldCreateNotifications: { validator: booleanValidator }, disableEnduserAutoSync: { validator: booleanValidator }, disableTicketAutoSync: { validator: booleanValidator }, redactExternalEvents: { validator: booleanValidator }, syncEnduserFiles: { validator: booleanValidator }, pushCalendarDetails: { validator: booleanValidator }, defaultAttendeeId: { validator: mongoIdStringValidator }, sendEmailOnSync: { validator: booleanValidator }, enduserFieldMapping: { validator: fieldMappingsValidator }, default_dietitian_id: { validator: stringValidator100 }, dontPushCalendarEvent: { validator: booleanValidator }, dontPullCalendarEvent: { validator: booleanValidator }, pushAddedTags: { validator: booleanValidator }, pushRemovedTags: { validator: booleanValidator }, overwriteAddress: { validator: booleanValidator }, syncEnduserId: { validator: booleanValidator }, shardId: { validator: stringValidator100 } }),
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
                returns: {}
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
            proxy_write: {
                op: 'custom', access: 'update', method: 'post',
                path: '/integrations/proxy-write',
                name: 'Proxies a write request to a given integration and returns the result',
                description: "",
                parameters: {
                    integration: { validator: stringValidator, required: true },
                    type: { validator: stringValidator, required: true },
                    query: { validator: objectAnyFieldsAnyValuesValidator },
                    id: { validator: stringValidator },
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
                parameters: { integration: { validator: integrationTitleValidator, } },
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
                parameters: { integration: { validator: integrationTitleValidator } },
                returns: {}
            },
            refresh_oauth2_session: {
                op: 'custom', access: 'create', method: 'post',
                path: '/refresh-oauth2-session',
                name: 'Uses a refresh_token to refresh a session and return the result',
                description: "",
                parameters: { title: { validator: stringValidator100, required: true } },
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
                    countryCode: { validator: exactMatchValidator(['US', 'GB']) }
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
                    updatedOrganization: { validator: 'organization', required: true },
                }
            },
            disconnect_photon: {
                op: 'custom', access: 'create', method: 'post', adminOnly: true,
                path: '/integrations/disconnect-photon',
                name: 'Disconnect Photon Health',
                description: "",
                parameters: {},
                returns: {}
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
                returns: { integration: { validator: 'integration', required: true } }
            },
            disconnect_elation: {
                op: 'custom', access: 'create', method: 'post', adminOnly: true,
                path: '/integrations/disconnect-elation',
                name: 'Disconnect Elation',
                description: "",
                parameters: {},
                returns: {}
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
                returns: {}
            },
            disconnect_zendesk: {
                op: 'custom', access: 'create', method: 'post', adminOnly: true,
                path: '/integrations/remove-zendesk-configuration',
                name: 'Remove Zendesk Configuration',
                description: "",
                parameters: {},
                returns: {}
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
                    fields: { validator: objectAnyFieldsAnyValuesValidator },
                    scope: { validator: stringValidator },
                },
                returns: { integration: { validator: 'integration' } }
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
                returns: {}
            },
            sync_ehr: {
                op: 'custom', access: 'create', method: 'post',
                path: '/integrations/sync-ehr',
                name: 'Syncs EHR data which is not supported by webhooks (e.g. Dr. Chrono lab results)',
                description: "",
                parameters: {},
                returns: {}
            },
            daily_sync: {
                op: 'custom', access: 'create', method: 'post',
                path: '/integrations/daily-sync',
                name: 'Syncs background tasks (like subscribing to Gmail notifications) once per 24hours',
                description: "",
                parameters: {},
                returns: {}
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
                        validator: listValidator(objectValidator({ name: stringValidator, id: stringValidator })),
                        required: true,
                    },
                    next_page_token: { validator: stringValidator }
                },
            },
        }
    },
    engagement_events: {
        info: {},
        fields: __assign(__assign({}, BuiltInFields), { enduserId: {
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
            }, type: {
                validator: stringValidator100,
                required: true,
                examples: ['Test']
            }, significance: {
                validator: nonNegNumberValidator,
                required: true,
                examples: [1]
            }, timestamp: {
                validator: dateValidator,
                initializer: function () { return new Date(); },
            }, fields: {
                validator: fieldsValidator,
            } }),
        constraints: { unique: [], relationship: [] },
        defaultActions: DEFAULT_OPERATIONS,
        enduserActions: { create: {}, createMany: {}, read: {}, readMany: {} },
        customActions: {},
    },
    journeys: {
        info: {},
        fields: __assign(__assign({}, BuiltInFields), { archivedAt: { validator: dateOptionalOrEmptyStringValidator }, title: {
                validator: stringValidator100,
                required: true,
                examples: ['Test']
            }, defaultState: {
                validator: stringValidator100,
                initializer: function (j) { var _a, _b; return (j.defaultState || ((_b = (_a = j.states) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.name) || 'New'); },
            }, description: {
                validator: stringValidator1000,
            }, states: {
                validator: journeyStatesValidator,
                initializer: function (j) { return j.defaultState
                    ? [{ name: j.defaultState, priority: "N/A" }]
                    : [{ name: 'New', priority: "N/A" }]; }
            }, onIncomingEnduserCommunication: {
                validator: exactMatchValidator(['Remove', ''])
            }, tags: { validator: listOfStringsValidatorOptionalOrEmptyOk } }),
        constraints: {
            unique: ['title', { array: 'states', itemKey: 'name' }],
            relationship: [{
                    explanation: 'states must include defaultState',
                    evaluate: function (_a) {
                        var defaultState = _a.defaultState, states = _a.states;
                        if (!(defaultState && states))
                            return;
                        if (states.find(function (s) { return s.name === defaultState; }) === undefined) {
                            return "defaultState does not exist in states";
                        }
                    }
                }]
        },
        defaultActions: __assign(__assign({}, DEFAULT_OPERATIONS), { create: {
                warnings: [
                    "To update state names, use Update State to ensure that updates propagate to endusers",
                ],
            } }),
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
                returns: { updated: 'journey' },
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
                returns: {},
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
                    statistics: { validator: objectAnyFieldsAnyValuesValidator }
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
                    evaluate: function (_a, deps, _, method) {
                        var enduserId = _a.enduserId, logOnly = _a.logOnly, isMarketing = _a.isMarketing, alternateToAddress = _a.alternateToAddress;
                        var e = deps[enduserId !== null && enduserId !== void 0 ? enduserId : ''];
                        // include before logOnly return for test-coverage purposes
                        if (isMarketing && e.unsubscribedFromMarketing)
                            return "Unsubscribed from marketing";
                        if (logOnly === true)
                            return;
                        if (method === 'update')
                            return;
                        if (!e)
                            return; // not in cache, permit by default, likely during an update
                        if (!(e === null || e === void 0 ? void 0 : e.email) && !alternateToAddress)
                            return "Missing email";
                        // if (!e?.emailConsent) return "Missing email consent"
                    }
                }
            ],
            access: [
                { type: 'filter', field: 'userId' },
            ]
        },
        fields: __assign(__assign({}, BuiltInFields), { hiddenFromTimeline: { validator: booleanValidator }, copyOf: { validator: mongoIdStringValidator }, relatedContactId: { validator: mongoIdStringValidator }, markedUnreadForAll: { validator: booleanValidator }, inboxStatus: { validator: stringValidator100 }, logOnly: {
                validator: booleanValidator,
                examples: [true],
                initializer: function () { return false; },
            }, enduserId: {
                validator: mongoIdStringValidator,
                required: true,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, userId: {
                validator: mongoIdStringValidator,
                examples: [PLACEHOLDER_ID],
                initializer: function (a, s) { return s.id; },
            }, subject: {
                validator: stringValidator,
                required: true,
                examples: ["Email Subject"],
            }, textContent: {
                validator: stringValidator100000EmptyOkay,
                required: true,
                examples: ["Hi there, this is Sebastian"],
            }, HTMLContent: {
                validator: stringValidator100000EmptyOkay,
            }, timestamp: {
                validator: dateValidator,
                initializer: function () { return new Date(); },
            }, delivered: {
                validator: booleanValidator,
                readonly: true,
                initializer: function (s) { return !!s.logOnly; }
            }, replyTo: {
                validator: stringValidator,
                initializer: function () { return null; },
            }, threadId: {
                validator: stringValidator,
                initializer: function (s) { var _a; return (_a = s.replyTo) !== null && _a !== void 0 ? _a : ''; },
                readonly: true,
            }, source: {
                validator: emailValidator,
                readonly: true,
            }, openedAt: {
                validator: dateValidator,
                readonly: true,
            }, linkOpens: {
                validator: numberToDateValidator,
                readonly: true,
                examples: [{ 0: new Date() }]
            }, messageId: { validator: stringValidator }, inbound: {
                validator: booleanValidator,
                initializer: function () { return false; },
            }, textEncoding: {
                validator: emailEncodingValidator,
                readonly: true,
            }, htmlEncoding: {
                validator: emailEncodingValidator,
                readonly: true,
            }, s3id: {
                validator: stringValidator250,
                readonly: true,
            }, readBy: { validator: idStringToDateValidator }, hiddenBy: { validator: idStringToDateValidator }, hiddenForAll: { validator: booleanValidator }, templateId: { validator: mongoIdStringValidator }, automationStepId: { validator: mongoIdStringValidator }, linkOpenTrackingIds: {
                validator: listOfStringsValidatorEmptyOk,
                initializer: function () { return []; },
            }, journeyContext: { validator: journeyContextValidator }, sendAt: { validator: dateOptionalOrEmptyStringValidator }, pinnedAt: { validator: dateOptionalOrEmptyStringValidator }, isDraft: { validator: booleanValidator }, cc: { validator: listOfStringsValidatorEmptyOk }, fromEmailOverride: { validator: stringValidator100 }, ticketIds: { validator: listOfStringsValidatorEmptyOk }, alternateToAddress: { validator: emailValidator }, suggestedReply: { validator: stringValidator5000EmptyOkay }, tags: { validator: listOfStringsValidatorOptionalOrEmptyOk }, batchId: { validator: stringValidator250 }, isMarketing: { validator: booleanValidator }, assignedTo: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, canvasId: { validator: stringValidator100 }, discussionRoomId: { validator: mongoIdStringValidator }, journeyId: { validator: mongoIdStringValidator }, calendarEventId: { validator: mongoIdStringValidator }, archivedAt: { validator: dateOptionalOrEmptyStringValidator }, trashedAt: { validator: dateOptionalOrEmptyStringValidator } }),
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
                    newEmails: { validator: 'emails', required: true },
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
                    timestamp: { validator: stringValidator100, required: true },
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
                returns: {}
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
                returns: { email: { validator: 'email' } }
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
                    report: { validator: objectAnyFieldsAnyValuesValidator, required: true }
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
                returns: {},
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
                returns: { sms: { validator: 'sms_message' } }
            },
            send_message_as_user_notification: {
                op: "custom", access: 'create', method: "post",
                name: 'Send Message as User Notification',
                path: '/sms-messages/send-message-as-user-notification',
                description: "Sends an SMS message as a user notification (e.g. for an upcoming calendar event)",
                parameters: {
                    to: { validator: phoneValidator, required: true },
                    message: { validator: stringValidator5000, required: true },
                },
                returns: { sms: { validator: 'sms_message' } }
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
                    report: { validator: objectAnyFieldsAnyValuesValidator, required: true }
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
                    report: { validator: objectAnyFieldsAnyValuesValidator, required: true }
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
                returns: { enduser: { validator: 'enduser', required: true } },
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
                    evaluate: function (_a, deps, _) {
                        var message = _a.message;
                        if (message === undefined)
                            return "message must not be blank";
                    }
                },
                {
                    explanation: "Phone number and phone consent must be set for enduser",
                    evaluate: function (_a, deps, _) {
                        var enduserPhoneNumber = _a.enduserPhoneNumber, enduserId = _a.enduserId, logOnly = _a.logOnly;
                        if (logOnly === true)
                            return;
                        var e = deps[enduserId !== null && enduserId !== void 0 ? enduserId : ''];
                        if (!e)
                            return; // not in cache, permit by default, likely during an update
                        if (!e.phone && !enduserPhoneNumber)
                            return "Missing phone";
                        // if (!e.phoneConsent) return "Missing phone consent"
                    }
                },
            ],
            access: [
                { type: 'filter', field: 'userId' },
            ]
        },
        fields: __assign(__assign({}, BuiltInFields), { hiddenFromTimeline: { validator: booleanValidator }, copyOf: { validator: mongoIdStringValidator }, relatedContactId: { validator: mongoIdStringValidator }, autoResolveToFrom: { validator: booleanValidator }, markedUnreadForAll: { validator: booleanValidator }, inboxStatus: { validator: stringValidator100 }, logOnly: {
                validator: booleanValidator,
                examples: [true],
                initializer: function () { return false; },
            }, templatedMessage: { validator: stringValidator5000EmptyOkay }, message: {
                validator: SMSMessageValidator,
                required: true,
                examples: ["Test message"],
                // updates should be allowed for drafts / unsent messages
                // updatesDisabled: true
            }, linkOpens: {
                validator: numberToDateValidator,
                readonly: true,
                examples: [{ 0: new Date() }]
            }, enduserId: {
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
            }, userId: {
                validator: mongoIdStringValidator,
                initializer: function (a, s) { return s.id; },
                dependencies: [{
                        dependsOn: ['users'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'setNull',
                    }]
            }, inbound: {
                validator: booleanValidator,
                initializer: function () { return false; },
            }, newThread: {
                validator: booleanValidator,
                updatesDisabled: true,
            }, delivered: {
                validator: booleanValidator,
                readonly: true,
                initializer: function (s) { return !!s.logOnly; }
            }, internalMessageId: {
                validator: stringValidator250,
                readonly: true,
            }, readBy: { validator: idStringToDateValidator }, hiddenBy: { validator: idStringToDateValidator }, hiddenForAll: { validator: booleanValidator }, templateId: { validator: mongoIdStringValidator }, automationStepId: { validator: mongoIdStringValidator }, linkOpenTrackingIds: {
                validator: listOfStringsValidatorEmptyOk,
                initializer: function () { return []; },
            }, journeyContext: { validator: journeyContextValidator }, sendAt: { validator: dateOptionalOrEmptyStringValidator }, pinnedAt: { validator: dateOptionalOrEmptyStringValidator }, isDraft: { validator: booleanValidator }, timestamp: { validator: dateValidator }, ticketIds: { validator: listOfStringsValidatorEmptyOk }, suggestedReply: { validator: stringValidator5000EmptyOkay }, phoneNumber: { validator: stringValidatorOptionalEmptyOkay }, enduserPhoneNumber: { validator: phoneValidator }, tags: { validator: listOfStringsValidatorOptionalOrEmptyOk }, batchId: { validator: stringValidator250 }, assignedTo: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, canvasId: { validator: stringValidator100 }, discussionRoomId: { validator: mongoIdStringValidator }, journeyId: { validator: mongoIdStringValidator }, calendarEventId: { validator: mongoIdStringValidator }, mediaURLs: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, archivedAt: { validator: dateOptionalOrEmptyStringValidator }, trashedAt: { validator: dateOptionalOrEmptyStringValidator } }),
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
        fields: __assign(__assign({}, BuiltInFields), { markedUnreadForAll: { validator: booleanValidator }, inboxStatus: { validator: stringValidator100 }, journeyId: { validator: mongoIdStringValidator }, assignedTo: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, title: {
                validator: stringValidator100,
            }, numMessages: {
                validator: nonNegNumberValidator,
                initializer: function () { return 0; },
            }, recentMessageSentAt: {
                validator: nonNegNumberValidator,
            }, type: {
                validator: chatRoomTypeValidator,
                initializer: function () { return 'internal'; }
            }, topic: {
                validator: stringValidator5000, // long to support MP use case / custom topics
            }, topicId: {
                validator: stringValidator100,
            }, description: {
                validator: stringValidator250,
            }, userIds: {
                validator: listOfMongoIdStringValidatorEmptyOk,
                examples: [[PLACEHOLDER_ID]],
                // required: true, // no longer required
                // add pull dependency for user deletion?
            }, enduserIds: {
                validator: listOfMongoIdStringValidatorEmptyOk,
                // add pull dependency for enduser deletion?
            }, recentEnduserMessage: {
                validator: stringValidator,
                readonly: true,
            }, recentEnduserMessageSentAt: { validator: nonNegNumberValidator }, recentMessage: {
                validator: stringValidator,
                initializer: function () { return ''; },
                readonly: true,
            }, recentSender: {
                validator: mongoIdStringValidator,
                initializer: function () { return ''; },
                readonly: true,
            }, ticketId: {
                validator: mongoIdStringValidator,
            }, endedAt: {
                validator: dateValidator,
            }, tags: {
                validator: listOfStringsValidatorEmptyOk,
            }, infoForUser: {
                validator: chatRoomUserInfoValidator,
            }, aboutEnduserId: {
                validator: mongoIdStringValidator,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, pinnedAt: { validator: dateOptionalOrEmptyStringValidator }, fields: { validator: fieldsValidator }, suggestedReply: { validator: stringValidator5000EmptyOkay }, discussionRoomId: { validator: mongoIdStringValidator }, identifier: { validator: stringValidator100 }, externalId: { validator: stringValidator100 }, emoji: { validator: stringValidator100 }, source: { validator: stringValidator100 }, archivedAt: { validator: dateOptionalOrEmptyStringValidator }, trashedAt: { validator: dateOptionalOrEmptyStringValidator } }),
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
                    room: { validator: 'Room' },
                } // add room eventually, when validator defined
            },
            mark_read: {
                op: "custom", access: 'update', method: "post",
                name: 'Mark Read',
                path: '/mark-chat-room-read',
                description: "Marks the conversation read by the authenticated user",
                parameters: { id: { validator: mongoIdStringValidator, required: true } },
                returns: {
                    updated: { validator: 'Room' },
                } // add room eventually, when validator defined
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
                    room: { validator: 'Room' },
                } // add room eventually, when validator defined
            },
            load_team_chat: {
                op: "custom", access: 'read', method: "get",
                name: 'Load Team Chat',
                path: '/chat-rooms/load-team-chat',
                description: "Loads team chat rooms with server-side filtering for rooms where the user is creator, in userIds, or on care team for aboutEnduserId",
                parameters: {
                    lastUpdatedAt: { validator: dateValidatorOptional },
                    limit: { validator: nonNegNumberValidator },
                    showClosed: { validator: booleanValidatorOptional },
                },
                returns: {
                    chat_rooms: { validator: 'chat_rooms' },
                    endusers: { validator: 'endusers' },
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
        defaultActions: { create: {}, update: {}, read: {}, readMany: {}, delete: {} },
        readFilter: {
        // roomId: { required: true },
        },
        enduserActions: { create: {}, read: {}, readMany: {} },
        customActions: {},
        fields: __assign(__assign({}, BuiltInFields), { journeyId: { validator: mongoIdStringValidator }, roomId: {
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
            }, linkOpens: {
                validator: numberToDateValidator,
                readonly: true,
                examples: [{ 0: new Date() }]
            }, senderId: {
                validator: mongoIdStringValidator,
                // if changing readonly to false, need to update side effect for track_chats_timestamp
                // readonly: true, // create a separate endpoint for storing enduser chats
                initializer: function (a, s) { return s.id; },
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['users', 'endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'setNull',
                    }]
            }, userId: {
                validator: mongoIdStringValidator,
                // don't use initializer to avoid setting userId by Admin API caller
                // initializer: (a, s) => s.type === 'user' ? s.id : undefined,
            }, message: {
                validator: stringValidator5000,
                required: true,
                examples: ["Message"]
            }, html: { validator: stringValidator5000 }, replyId: {
                validator: mongoIdStringValidator,
                updatesDisabled: true,
                dependencies: [{
                        dependsOn: ['chats'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'setNull',
                    }]
            }, readBy: { validator: idStringToDateValidator }, hiddenBy: { validator: idStringToDateValidator }, hiddenForAll: { validator: booleanValidator }, attachments: {
                validator: listOfChatAttachmentsValidator,
            }, templateId: { validator: mongoIdStringValidator }, automationStepId: { validator: mongoIdStringValidator }, linkOpenTrackingIds: {
                validator: listOfStringsValidatorEmptyOk,
                initializer: function () { return []; },
            }, timestamp: { validator: dateValidator }, ticketIds: { validator: listOfStringsValidatorEmptyOk }, tags: { validator: listOfStringsValidatorOptionalOrEmptyOk }, enduserId: {
                validator: mongoIdStringOptional,
                initializer: function (_, s) { return s.type === 'enduser' ? s.id : undefined; }
            }, mentions: { validator: listOfMongoIdStringValidatorEmptyOk }, canvasId: { validator: stringValidator100 }, quote: { validator: listValidatorOptionalOrEmptyOk(stringValidator5000OptionalEmptyOkay) }, sendAt: { validator: dateOptionalOrEmptyStringValidator }, isDraft: { validator: booleanValidator }, source: { validator: stringValidator100 } }),
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
                    evaluate: function (_a, deps, session, type, _b) {
                        var _c, _d;
                        var _id = _a._id;
                        var updates = _b.updates;
                        if (_id && _id.toString() === session.id)
                            return;
                        if ((_c = session === null || session === void 0 ? void 0 : session.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin'))
                            return;
                        if ((_d = updates === null || updates === void 0 ? void 0 : updates.roles) === null || _d === void 0 ? void 0 : _d.includes("Admin"))
                            return "Only Admin users can assign the Admin role";
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
                    evaluate: function (_a, _, session, method, _b) {
                        var _c;
                        var _id = _a._id;
                        var updates = _b.updates;
                        if (session.type === 'user' && !session.eat)
                            return; // accessTags is not enabled
                        if ((_c = session === null || session === void 0 ? void 0 : session.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin'))
                            return;
                        if (method === 'create')
                            return;
                        if (!(updates === null || updates === void 0 ? void 0 : updates.tags))
                            return;
                        return "Only admin users can update tags when accessTags is enabled";
                    }
                },
                {
                    explanation: "Only admin users can update user email",
                    evaluate: function (_a, _, session, method, _b) {
                        var _c;
                        var roles = _a.roles;
                        var updates = _b.updates;
                        if ((_c = session === null || session === void 0 ? void 0 : session.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin'))
                            return; // admin can do this
                        if (method === 'create')
                            return; // create already admin restricted
                        if (!(updates === null || updates === void 0 ? void 0 : updates.email))
                            return; // roles not provided (empty array is blocked by validator)
                        return "Only admin users can update user email";
                    }
                },
                {
                    explanation: "Only admin users can update user roles",
                    evaluate: function (_a, _, session, method, _b) {
                        var _c;
                        var roles = _a.roles;
                        var updates = _b.updates;
                        if ((_c = session === null || session === void 0 ? void 0 : session.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin'))
                            return; // admin can do this
                        if (method === 'create')
                            return; // create already admin restricted
                        if (!(updates === null || updates === void 0 ? void 0 : updates.roles))
                            return; // roles not provided (empty array is blocked by validator)
                        return "Only admin users can update user roles";
                    }
                },
                {
                    explanation: "Only admin users can update user lockouts",
                    evaluate: function (_a, _, session, method, _b) {
                        var _c;
                        var _id = _a._id;
                        var updates = _b.updates;
                        if ((updates === null || updates === void 0 ? void 0 : updates.lockedOutUntil) !== undefined && session.id === (_id === null || _id === void 0 ? void 0 : _id.toString())) {
                            return "Users cannot update own lock status";
                        }
                        if ((_c = session === null || session === void 0 ? void 0 : session.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin'))
                            return; // admin can do this
                        if (method === 'create')
                            return; // create already admin restricted
                        if ((updates === null || updates === void 0 ? void 0 : updates.lockedOutUntil) === undefined)
                            return; // not provided
                        return "Only admin users can update user lockouts";
                    }
                },
                {
                    explanation: "Only admin users can update failed login attempts",
                    evaluate: function (_a, _, session, method, _b) {
                        var _c;
                        var _id = _a._id;
                        var updates = _b.updates;
                        if ((updates === null || updates === void 0 ? void 0 : updates.failedLoginAttempts) !== undefined && session.id === (_id === null || _id === void 0 ? void 0 : _id.toString())) {
                            return "Users cannot update own failed login attempts";
                        }
                        if ((_c = session === null || session === void 0 ? void 0 : session.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin'))
                            return; // admin can do this
                        if (method === 'create')
                            return; // create already admin restricted
                        if ((updates === null || updates === void 0 ? void 0 : updates.failedLoginAttempts) === undefined)
                            return; // not provided
                        return "Only admin users can update failed login attempts";
                    }
                },
                {
                    explanation: "Only admin users can update doseSpotUserId",
                    evaluate: function (_a, _, session, method, _b) {
                        var _c;
                        var roles = _a.roles;
                        var updates = _b.updates;
                        if ((_c = session === null || session === void 0 ? void 0 : session.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin'))
                            return; // admin can do this
                        if (method === 'create')
                            return; // create already admin restricted
                        if (!(updates === null || updates === void 0 ? void 0 : updates.doseSpotUserId))
                            return; // doseSpotUserId not provided
                        return "Only admin users can update doseSpotUserId";
                    }
                },
                {
                    explanation: "Only admin users can update scriptSurePrescriberId",
                    evaluate: function (_a, _, session, method, _b) {
                        var _c;
                        var roles = _a.roles;
                        var updates = _b.updates;
                        if ((_c = session === null || session === void 0 ? void 0 : session.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin'))
                            return; // admin can do this
                        if (method === 'create')
                            return; // create already admin restricted
                        if (!(updates === null || updates === void 0 ? void 0 : updates.scriptSurePrescriberId))
                            return; // scriptSurePrescriberId not provided
                        return "Only admin users can update scriptSurePrescriberId";
                    }
                },
                {
                    explanation: "Only admin users can update requireSSO",
                    evaluate: function (_a, _, session, method, _b) {
                        var _c;
                        var roles = _a.roles;
                        var updates = _b.updates;
                        if ((_c = session === null || session === void 0 ? void 0 : session.roles) === null || _c === void 0 ? void 0 : _c.includes('Admin'))
                            return; // admin can do this
                        if (method === 'create')
                            return; // create already admin restricted
                        if (!(updates === null || updates === void 0 ? void 0 : updates.requireSSO))
                            return; // requireSSO not provided
                        return "Only admin users can update requireSSO";
                    }
                },
                {
                    explanation: "User organizationIds are readonly",
                    evaluate: function (_a, _, session, method, _b) {
                        var updates = _b.updates;
                        if (method === 'create')
                            return; // only concerned with updates
                        if (!(updates === null || updates === void 0 ? void 0 : updates.organizationIds))
                            return;
                        return "User organizationIds are readonly";
                    }
                }
            ],
        },
        defaultActions: {
            create: { adminOnly: true }, createMany: { adminOnly: true }, delete: { adminOnly: true },
            read: {}, readMany: {}, update: { description: "Users can only be updated by self or an organization admin" }
        },
        enduserActions: { display_info: {}, read: {}, readMany: {} },
        customActions: {
            invite_user: {
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
                    created: { validator: 'user', required: true },
                }
            },
            send_invitation_to_existing: {
                op: "custom", access: 'create', method: "post",
                name: 'Invite user to join organization',
                path: '/invite-existing-user-to-organization',
                adminOnly: true,
                description: "Invites a user to join the current (sub)organization",
                parameters: { userId: { validator: mongoIdStringValidator, required: true } },
                returns: {},
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
                    enduser: { validator: 'enduser', required: false },
                    user: { validator: 'user', required: false },
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
                    user: { validator: 'user' },
                } // add enduser eventually, when validator defined
            },
            configure_MFA: {
                op: "custom", access: 'update', method: "post",
                name: 'Configure MFA',
                path: '/users/configure-mfa',
                description: "Configures MFA (or removes it, when allowed by an organization)",
                parameters: {
                    disable: { validator: booleanValidator },
                },
                returns: {
                    recoveryCodes: { validator: listOfStringsValidator, required: true },
                    authToken: { validator: stringValidator, required: true },
                    user: { validator: 'user', required: true },
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
                returns: {}
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
                    user: { validator: 'user', required: true },
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
                    user: { validator: 'user', required: true },
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
                    user: { validator: 'user', required: true },
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
            play_phone_message: {
                op: "custom", access: 'create', method: "post",
                name: 'Play Phone Message',
                path: '/users/play-phone-message',
                description: "Calls the user and plays a recorded message",
                parameters: {
                    userId: { validator: mongoIdStringValidator, required: true },
                    message: { validator: stringValidator5000, required: true },
                    enduserId: { validator: mongoIdStringValidator },
                    journeyContext: { validator: journeyContextValidator },
                },
                returns: {},
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
                    user: { validator: 'user', required: true },
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
                returns: {},
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
                    user: { validator: 'user', required: true },
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
                    user: { validator: 'user', required: true },
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
                returns: {},
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
                returns: {},
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
                    user: { validator: 'user', required: true },
                },
            },
        },
        fields: __assign(__assign({}, BuiltInFields), { billingTags: { validator: labeledFieldsValidator }, defaultLocationId: { validator: mongoIdStringValidator }, email: {
                validator: emailValidator,
                required: true,
                examples: ['test@tellescope.com'],
                redactions: ['enduser'],
            }, phone: {
                validator: phoneValidator,
                redactions: ['enduser'],
            }, fields: {
                validator: fieldsValidator,
                redactions: ['enduser'],
            }, unredactedFields: {
                validator: fieldsValidator,
            }, username: {
                validator: subdomainValidator,
                readonly: true,
                redactions: ['enduser'],
            }, externalId: {
                validator: stringValidator250,
            }, fname: { validator: nameValidator, }, lname: { validator: nameValidator, }, displayName: { validator: stringValidatorOptionalEmptyOkay }, internalDisplayName: { validator: stringValidator100, redactions: ['enduser'] }, suffixes: { validator: listOfStringsValidatorEmptyOk }, organization: {
                validator: mongoIdStringValidator,
                updatesDisabled: true,
            }, orgEmail: {
                validator: emailValidator,
                readonly: true, // able to set once, then not change (for now, due to email configuration)
            }, pauboxEmail: {
                validator: emailValidator,
            }, accountType: {
                validator: stringValidator,
                readonly: true,
            }, roles: {
                validator: listOfStringsValidator, // important that this doesn't allow empty roles (would grant default permissions which may be higher)
                // unredacted March 1, 2024 -- useful for filtering scheduling and/or care team display for enduser by role
                // redactions: ['enduser'],
            }, acknowledgedIntegrations: { validator: dateValidator }, disableIncomingPhoneCalls: { validator: booleanValidator }, skills: {
                validator: listOfStringsValidatorEmptyOk,
            }, verifiedEmail: {
                updatesDisabled: true,
                validator: booleanValidator,
            }, hashedPass: {
                validator: stringValidator,
                readonly: true,
                redactions: ['all'],
            }, hashedInviteCode: { validator: stringValidator100, readonly: true, redactions: ['all'] }, notificationPreferences: {
                validator: notificationPreferencesValidator,
                redactions: ['enduser'],
            }, notificationEmailsDisabled: { validator: booleanValidator }, avatar: {
                validator: stringValidator1000,
                // BUG: This dependency is disabled because handleDeletionForDependencies queries
                // by file._id instead of file.secureName (the dependencyField is ignored).
                // Fixing would require: 1) updating the delete handler to use dependencyField,
                // 2) adding an index on { businessId: 1, avatar: 1 } for users collection.
                // Not worth supporting for now since avatar file deletion is rare.
                // dependencies: [
                //   {
                //     dependsOn: ['files'],
                //     dependencyField: 'secureName',
                //     relationship: 'foreignKey',
                //     onDependencyDelete: 'unset',
                //   },
                // ]
            }, credentialedStates: {
                validator: stateCredentialsValidator,
            }, timezone: { validator: timezoneValidator }, weeklyAvailabilities: { validator: weeklyAvailabilitiesValidator }, calendarEventLimits: { validator: calendarEventLimitsValidator }, autoReplyEnabled: { validator: booleanValidatorOptional }, pushNotificationIosTokens: { validator: listOfStringsValidatorEmptyOk }, pushNotificationFirebaseTokens: { validator: listOfStringsValidatorEmptyOk }, callRouting: { validator: userCallRoutingBehaviorValidator }, tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, emailSignature: { validator: stringValidator1000 }, disableTicketAutoAssignment: { validator: booleanValidator }, ticketAssignmentPriority: { validator: nonNegNumberValidator }, specialties: { validator: listOfStringsValidatorOptionalOrEmptyOk }, bio: { validator: stringValidator25000EmptyOkay }, TIN: { validator: stringValidatorOptionalEmptyOkay }, NPI: { validator: stringValidatorOptionalEmptyOkay }, DEA: { validator: stringValidatorOptionalEmptyOkay }, voicemailPlayback: { validator: phonePlaybackValidatorOptional }, lockedOutUntil: { validator: numberValidator }, failedLoginAttempts: { validator: nonNegNumberValidator }, iOSBadgeCount: { validator: nonNegNumberValidator }, availableFromNumbers: { validator: listOfStringsValidatorEmptyOk }, availableFromEmails: { validator: listOfStringsValidatorEmptyOk }, doseSpotUserId: { validator: stringValidator100 }, scriptSurePrescriberId: { validator: stringValidator100 }, isScriptsureProvider: { validator: booleanValidatorOptional }, url: { validator: stringValidator1000 }, templateFields: {
                validator: listValidatorOptionalOrEmptyOk(objectValidator({
                    field: stringValidator100,
                    value: stringValidator5000,
                }))
            }, canvasId: { validator: stringValidator100 }, medplumId: { validator: stringValidator100 }, athenaId: { validator: stringValidator100 }, dashboardView: { validator: customDashboardViewValidator }, hideFromCalendarView: { validator: booleanValidator }, requireSSO: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay } })
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
                    relatedContactId: { validator: mongoIdStringValidator },
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
                returns: {},
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
        fields: __assign(__assign({}, BuiltInFields), { archivedAt: { validator: dateOptionalOrEmptyStringValidator }, mmsAttachmentURLs: { validator: listOfUniqueStringsValidatorEmptyOk }, title: {
                validator: stringValidator100,
                required: true,
                examples: ["Template Name"],
            }, subject: {
                validator: stringValidator250,
                required: true,
                examples: ["Template Subject"],
            }, message: {
                validator: stringValidator100000EmptyOkay,
                required: true,
                examples: ["This is the template message......"],
            }, html: {
                validator: stringValidator100000EmptyOkay,
                examples: ["This is the template message......"],
            }, editorState: {
                validator: stringValidator25000,
                examples: ["This is the template message......"],
            }, type: {
                validator: messageTemplateTypeValidator,
                initializer: function () { return 'enduser'; }
            }, mode: {
                validator: messageTemplateModeValidator,
            }, isMarketing: { validator: booleanValidator }, hideFromCompose: { validator: booleanValidator }, forChannels: { validator: listOfStringsValidatorEmptyOk }, forRoles: { validator: listOfStringsValidatorEmptyOk }, forEntityTypes: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay } }),
    },
    files: {
        info: {},
        constraints: { unique: [], relationship: [] },
        defaultActions: { read: {}, readMany: {}, update: {}, delete: {} },
        enduserActions: { prepare_file_upload: {}, confirm_file_upload: {}, file_download_URL: {}, read: {}, readMany: {}, delete: {}, update: {} /* allow to hide from client side */ },
        fields: __assign(__assign({}, BuiltInFields), { source: { validator: stringValidator100 }, tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, name: {
                validator: stringValidator250,
                required: true,
            }, size: {
                validator: fileSizeValidator,
                required: true,
            }, type: {
                validator: fileTypeValidator,
                required: true
            }, enduserId: {
                validator: mongoIdStringValidator,
            }, secureName: {
                validator: stringValidator250,
                readonly: true,
            }, hideFromEnduserPortal: { validator: booleanValidator }, pushedToClientPortal: { validator: booleanValidator }, hiddenFromEnduser: { validator: booleanValidator }, isCalledOut: { validator: booleanValidator }, externalId: {
                validator: stringValidator250,
                examples: ['addfed3e-ddea-415b-b52b-df820c944dbb'],
            }, publicRead: { validator: booleanValidator, readonly: true } }),
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
                        validator: mongoIdStringValidator,
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
                        validator: 'file', // todo: add file validator
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
                    file: { validator: 'file', required: true },
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
                returns: {},
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
                returns: {},
            },
            push: {
                op: "custom", access: 'create', method: "post",
                name: 'Push File',
                path: '/files/push',
                description: "Sends a file to an integrated system (e.g. athenahealth)",
                parameters: {
                    id: { validator: mongoIdStringRequired, required: true },
                    destination: { validator: stringValidator, required: true },
                    type: { validator: stringValidator },
                    typeId: { validator: stringValidator },
                },
                returns: {
                    file: { validator: 'file' },
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
                    evaluate: function (_a, _, session) {
                        var enduserId = _a.enduserId;
                        if (session.type === ENDUSER_SESSION_TYPE && session.id !== enduserId)
                            return "enduserId does not match creator id for enduser session";
                    }
                },
            ],
            access: [
                { type: 'filter', field: 'owner' },
            ]
        },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {
            bulk_assign: {
                op: "custom", access: 'update', method: "patch",
                name: 'Bulk Assign Tickets',
                path: '/tickets/bulk-assign',
                description: "Assigns a list of tickets by id (does not send webhooks)",
                parameters: {
                    ids: { validator: listOfMongoIdStringValidator, required: true },
                    userId: { validator: mongoIdStringValidator, required: true },
                },
                returns: {},
            },
            bulk_delete: {
                op: "custom", access: 'delete', method: "delete",
                name: 'Bulk Delete Tickets',
                path: '/tickets/bulk-delete',
                description: "Deletes a list of tickets by id (does not send webhooks)",
                parameters: {
                    ids: { validator: listOfMongoIdStringValidator, required: true },
                },
                returns: {},
            },
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
                    ticket: { validator: 'ticket', required: true },
                    queue: { validator: 'ticket_queue', required: true },
                    enduser: { validator: 'enduser', required: true },
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
                    report: { validator: objectAnyFieldsAnyValuesValidator, required: true }
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
                    report: { validator: objectAnyFieldsAnyValuesValidator, required: true }
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
                    updated: { validator: 'ticket', required: true },
                    generated: { validator: 'ticket' },
                },
            },
        },
        enduserActions: { create: {}, read: {}, readMany: {} },
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: stringValidator1000,
                required: true,
                examples: ["Ticket Name"],
            }, enduserId: {
                validator: mongoIdStringValidator,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, automationStepId: {
                validator: mongoIdStringValidator,
            }, closedForReason: { validator: stringValidator }, closeReasons: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, closedBy: { validator: mongoIdStringValidator }, chatRoomId: {
                validator: mongoIdStringValidator,
            }, dueDateInMS: {
                validator: nonNegNumberValidator,
            }, closedAt: {
                validator: dateValidator,
            }, owner: {
                validator: mongoIdStringValidator,
            }, message: {
                validator: stringValidator5000,
                examples: ["Message"],
            }, type: {
                validator: stringValidator100,
            }, skillsRequired: {
                validator: listOfStringsValidator,
            }, priority: { validator: numberValidator }, stage: { validator: stringValidator100 }, blockerDescription: { validator: stringValidator5000EmptyOkay }, index: { validator: numberValidator }, carePlanId: { validator: mongoIdStringValidator }, journeyId: { validator: mongoIdStringValidator }, purchaseId: { validator: mongoIdStringValidator }, hiddenFromTickets: { validator: booleanValidator }, htmlDescription: { validator: stringValidator100000OptionalEmptyOkay }, formResponseIds: { validator: listOfStringsValidatorEmptyOk }, actions: { validator: ticketActionsValidator }, closeOnFinishedActions: { validator: booleanValidator }, remindAt: { validator: dateOptionalOrEmptyStringValidator }, reminderSilencedAt: { validator: dateOptionalOrEmptyStringValidator }, relatedRecords: { validator: listValidatorOptionalOrEmptyOk(relatedRecordValidator) }, attachments: { validator: listOfChatAttachmentsValidator }, snoozes: { validator: ticketSnoozesValidator }, requireConfirmation: { validator: booleanValidator }, queueId: { validator: mongoIdStringValidator }, reminders: { validator: listValidatorEmptyOk(ticketReminderValidator) }, nextReminderInMS: {
                validator: numberValidator,
                readonly: true,
                initializer: get_next_reminder_timestamp_for_ticket,
            }, references: { validator: listOfRelatedRecordsValidator, readonly: true }, calendarEventId: { validator: mongoIdStringValidator }, calendarEventTitle: { validator: stringValidator }, calendarEventStartTimeInMS: { validator: nonNegNumberValidator }, observationId: { validator: mongoIdStringValidator }, phoneCallId: { validator: mongoIdStringValidator }, smsId: { validator: mongoIdStringValidator }, emailId: { validator: mongoIdStringValidator }, orderId: { validator: mongoIdStringValidator }, tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, restrictByState: { validator: stateValidator }, restrictByTags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, restrictByTagsQualifier: { validator: listQueryQualifiersValidator }, archiveReason: { validator: stringValidator }, contextFormIds: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk }, contextContentIds: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk }, contextEnduserFields: { validator: listOfUniqueStringsValidatorEmptyOk }, isTodo: { validator: booleanValidator }, databaseRecordId: { validator: mongoIdStringValidator }, databaseRecordCreator: { validator: mongoIdStringValidator }, triggerFileId: { validator: mongoIdStringValidator }, disableEditTitle: { validator: booleanValidator }, templateId: { validator: mongoIdStringOptional } })
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
            readMany: __assign(__assign({}, DEFAULT_OPERATIONS['readMany']), { adminOnly: true })
        },
        enduserActions: { my_meetings: {}, join_meeting_for_event: {}, read: {} },
        customActions: {
            read: {
                op: "read", access: 'read', method: "get",
                description: "Get a meeting",
                parameters: {
                    id: { validator: mongoIdStringValidator },
                },
                returns: 'meeting',
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
                returns: {},
            },
            end_meeting: {
                op: "custom", access: 'update', method: "post",
                name: "End Meeting",
                path: '/end-meeting',
                description: "Ends a video meeting",
                parameters: { id: { validator: mongoIdStringValidator, required: true } },
                returns: {},
            },
            add_attendees_to_meeting: {
                op: "custom", access: 'update', method: "post",
                name: 'Add Attendees to Meeting',
                path: '/add-attendees-to-meeting',
                description: "Adds other attendees to a meeting, or dials out to a phone number",
                parameters: {
                    id: { validator: mongoIdStringValidator, required: true },
                    attendees: { validator: listOfUserIndentitiesValidator },
                    phoneNumber: { validator: phoneValidator },
                },
                returns: {},
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
        fields: __assign(__assign({}, BuiltInFields), { 
            // all fields are updatable by custom endpoints only
            status: {
                validator: meetingStatusValidator,
                readonly: true,
                initializer: function () { return 'scheduled'; },
            }, attendees: {
                validator: listOfAttendeesValidator,
                readonly: true,
            }, meetingInfo: {
                validator: meetingInfoValidator,
                readonly: true
            }, publicRead: { validator: booleanValidator }, endedAt: { validator: dateValidator } })
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
        fields: __assign(__assign({}, BuiltInFields), { copiedFrom: { validator: mongoIdStringOptional }, copiedFromEnduserId: { validator: mongoIdStringOptional }, hiddenFromTimeline: { validator: booleanValidator }, enduserId: {
                validator: mongoIdStringValidator,
                required: true,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, ticketId: {
                validator: mongoIdStringValidator,
            }, text: {
                validator: stringValidator5000,
                examples: ["Text"],
            }, title: {
                validator: stringValidator250,
                examples: ["Text"],
            }, fields: {
                validator: fieldsValidator,
            }, pinnedAt: { validator: dateOptionalOrEmptyStringValidator }, tags: { validator: listOfStringsValidatorOptionalOrEmptyOk }, discussionRoomId: { validator: mongoIdStringValidator }, source: { validator: stringValidator }, externalId: { validator: stringValidator } })
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
                    statistics: { validator: objectAnyFieldsAnyValuesValidator }
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
                    form: { validator: 'form', required: true },
                },
            },
        },
        fields: __assign(__assign({}, BuiltInFields), { showByUserTags: { validator: listOfStringsValidatorOptionalOrEmptyOk }, belugaVisitType: { validator: stringValidator }, belugaVerificationId: { validator: stringValidator }, mdiCaseOfferings: {
                validator: listValidatorOptionalOrEmptyOk(objectValidator({
                    offering_id: stringValidator100,
                }))
            }, autoMergeOnSubmission: { validator: booleanValidator }, gtmTag: { validator: stringValidator100EscapeHTML }, dontSyncToCanvasOnSubmission: { validator: booleanValidator }, archivedAt: { validator: dateOptionalOrEmptyStringValidator }, title: {
                validator: stringValidator250,
                required: true,
                examples: ["Text"],
            }, numFields: {
                validator: nonNegNumberValidator,
                initializer: function () { return 0; },
                examples: [0],
            }, redirectToBookedAppointmentOnSubmit: { validator: booleanValidator }, displayTitle: { validator: stringValidator1000 }, description: { validator: stringValidator5000EmptyOkay }, customGreeting: { validator: stringValidator5000 }, customSignature: { validator: stringValidator5000 }, customSubject: { validator: stringValidator5000 }, allowPublicURL: { validator: booleanValidator }, intakePhone: { validator: intakePhoneValidator }, intakeEmailRequired: { validator: booleanValidator }, intakeEmailHidden: { validator: booleanValidator }, intakeDateOfBirth: { validator: intakeDateOfBirthValidator }, intakeState: { validator: intakeDateOfBirthValidator }, intakeGender: { validator: intakeDateOfBirthValidator }, intakeGenderIsSex: { validator: booleanValidator }, thanksMessage: { validator: stringValidator5000EmptyOkay }, htmlThanksMessage: { validator: stringValidator5000EmptyOkay }, type: { validator: formTypeValidator }, scoring: { validator: formScoringValidator }, realTimeScoring: { validator: booleanValidator }, externalId: { validator: stringValidator100 }, ga4measurementId: { validator: stringValidator100 }, backgroundColor: { validator: stringValidator100 }, productIds: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk }, submitRedirectURL: { validator: stringValidator5000 }, customization: { validator: formCustomizationValidator }, publicFormIdRedirect: { validator: mongoIdStringOptional }, disabled: { validator: booleanValidatorOptional }, disableAutomaticIntegrationPush: { validator: booleanValidatorOptional }, customTypeIds: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk }, lockResponsesOnSubmission: { validator: booleanValidatorOptional }, tags: { validator: listOfStringsValidatorOptionalOrEmptyOk }, language: { validator: stringValidator }, isNonVisitElationNote: { validator: booleanValidator }, elationVisitNotePractitionerIds: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, elationVisitNoteType: { validator: stringValidator100 }, elationSkipBlankResponses: { validator: booleanValidator }, publicShowLanguage: { validator: booleanValidator }, publicShowDownload: { validator: booleanValidator }, canvasId: { validator: stringValidator100 }, canvasQuestionId: { validator: stringValidator100 }, syncToOLH: { validator: booleanValidator }, syncWithResponsesFromFormIds: { validator: listOfUniqueStringsValidatorEmptyOk }, scoresSync: {
                validator: listValidatorOptionalOrEmptyOk(objectValidator({
                    score: stringValidator100,
                    externalId: stringValidator100,
                }))
            }, hideAfterUnsubmittedInMS: { validator: numberValidator }, hideFromCompose: { validator: booleanValidator }, hideFromBulkSubmission: { validator: booleanValidator }, enduserFieldsToAppendForSync: { validator: listOfUniqueStringsValidatorEmptyOk }, allowPortalSubmission: { validator: booleanValidator }, allowPortalSubmissionEnduserCondition: { validator: optionalAnyObjectValidator }, canvasNoteCoding: { validator: canvasCodingValidatorOptional }, syncToCanvasAsDataImport: { validator: booleanValidator }, matchCareTeamTagsForCanvasPractitionerResolution: { validator: listOfStringsWithQualifierValidatorOptionalValuesEmptyOkay }, ipAddressCustomField: { validator: stringValidatorOptionalEmptyOkay }, version: { validator: exactMatchValidatorOptional(['v1', 'v2']) } })
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
                    search: { validator: stringValidatorOptionalEmptyOkay, required: false },
                },
                returns: {
                    choices: { validator: 'database_records', required: true }
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
                        validator: objectValidator({
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
        fields: __assign(__assign({}, BuiltInFields), { internalNote: { validator: stringValidator }, formId: {
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
            }, title: {
                validator: stringValidatorOptionalEmptyOkay,
                required: true,
                examples: ["Text"],
                initializer: function () { return ''; },
            }, headerText: { validator: stringValidator250 }, placeholder: { validator: stringValidatorOptional }, type: {
                validator: formFieldTypeValidator,
                examples: ['number'],
            }, previousFields: {
                validator: previousFormFieldsValidator,
                examples: [[{ type: 'root', info: {} }]]
            }, flowchartUI: { validator: flowchartUIValidator }, options: { validator: formFieldOptionsValidator }, description: { validator: stringValidator25000EmptyOkay }, htmlDescription: { validator: stringValidator25000EmptyOkay }, intakeField: { validator: stringValidator5000EmptyOkay }, isOptional: { validator: booleanValidator }, fullZIP: { validator: booleanValidator }, isInGroup: { validator: booleanValidator }, externalId: { validator: stringValidator1000 }, sharedWithEnduser: { validator: booleanValidator }, calloutConditions: { validator: formFieldCalloutConditionsValidator }, highlightOnTimeline: { validator: booleanValidator }, prepopulateFromFields: { validator: booleanValidator }, prepopulateFromDatabase: {
                validator: objectValidator({
                    databaseId: mongoIdStringOptional,
                    field: stringValidatorOptionalEmptyOkay,
                    overwrite: booleanValidatorOptional,
                }, { isOptional: true, emptyOk: true })
            }, disabledWhenPrepopulated: { validator: booleanValidator }, feedback: { validator: listValidatorOptionalOrEmptyOk(formFieldFeedbackValidator) }, titleFontSize: { validator: nonNegNumberValidator }, groupShowCondition: { validator: objectAnyFieldsAnyValuesValidator } })
    },
    form_responses: {
        info: {},
        constraints: {
            unique: [],
            relationship: [],
        },
        fields: __assign(__assign({}, BuiltInFields), { discussionRoomId: { validator: mongoIdStringValidator }, hiddenFromTimeline: { validator: booleanValidator }, lockedAt: { validator: dateValidator }, formId: {
                validator: stringValidator100,
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
            }, enduserId: {
                validator: mongoIdStringValidator,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, submissionExpiresAt: {
                validator: nonNegNumberValidator,
                updatesDisabled: true,
            }, openedAt: {
                validator: dateValidator,
            }, copiedFrom: { validator: mongoIdStringOptional }, copiedFromEnduserId: { validator: mongoIdStringOptional }, publicSubmit: { validator: booleanValidator }, submittedBy: { validator: stringValidator250 }, submittedByIsPlaceholder: { validator: booleanValidator }, markedAsSubmitted: { validator: booleanValidator }, accessCode: { validator: stringValidator250 }, userEmail: { validator: emailValidator }, submittedAt: { validator: dateValidator }, formTitle: { validator: stringValidator250 }, responses: { validator: formResponsesValidator }, draftSavedAt: { validator: dateValidator }, draftSavedBy: { validator: mongoIdStringValidator }, hideFromEnduserPortal: { validator: booleanValidator }, sharedVia: { validator: communicationsChannelValidator }, isInternalNote: { validator: booleanValidator }, pinnedAt: { validator: dateOptionalOrEmptyStringValidator }, publicIdentifier: { validator: stringValidator250 }, source: { validator: stringValidator250 }, externalId: { validator: stringValidator250 }, rootResponseId: { validator: mongoIdStringValidator }, parentResponseId: { validator: mongoIdStringValidator }, tags: { validator: listOfStringsValidatorOptionalOrEmptyOk }, carePlanId: { validator: mongoIdStringValidator }, context: { validator: stringValidator1000 }, calendarEventId: { validator: mongoIdStringValidator }, references: { validator: listOfRelatedRecordsValidator, readonly: true }, groupId: { validator: mongoIdStringValidator }, groupInstance: { validator: stringValidator100 }, groupPosition: { validator: nonNegNumberValidator }, hideAfterUnsubmittedInMS: { validator: numberValidator }, addenda: {
                validator: listValidatorOptionalOrEmptyOk(objectValidator({
                    text: stringValidator25000EmptyOkay,
                    timestamp: dateValidator,
                    userId: mongoIdStringRequired,
                }))
            }, followups: {
                validator: listValidatorOptionalOrEmptyOk(objectValidator({
                    formId: mongoIdStringRequired,
                    formResponseId: mongoIdStringOptional,
                    completedAt: dateValidatorOptional,
                }))
            }, canvasEncounterId: { validator: stringValidator100 }, pushedToPortalAt: { validator: dateValidatorOptional }, belugaScheduleLink: { validator: stringValidator1000 }, fieldViews: {
                validator: listValidatorOptionalOrEmptyOk(objectValidator({
                    fieldId: mongoIdStringRequired,
                    fieldTitle: stringValidator250,
                    timestamp: dateValidator,
                }))
            }, startedViaPinnedForm: { validator: booleanValidator } }),
        defaultActions: DEFAULT_OPERATIONS,
        enduserActions: {
            prepare_form_response: {}, info_for_access_code: {}, submit_form_response: {}, stripe_details: {}, chargebee_details: {},
            read: {}, readMany: {}, save_field_response: {},
            update: {} /* allows for hiding from client portal, storing partial responses while submitting form */
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
                    groupInstance: { validator: stringValidator100 },
                    groupPosition: { validator: nonNegNumberValidator },
                    startedViaPinnedForm: { validator: booleanValidator },
                },
                returns: {
                    accessCode: { validator: stringValidator250, required: true },
                    url: { validator: stringValidator250, required: true },
                    response: { validator: 'form_response', required: true },
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
                returns: {},
            },
            create_canvas_note: {
                op: "custom", access: 'create', method: "post",
                name: 'Create Canvas Note',
                path: '/form-responses/create-canvasnote',
                description: "Compiles FormResponses and creates a Note in Canvas",
                warnings: ['This returns early as the sync process can take a while for many form responses'],
                parameters: {
                    enduserId: { validator: mongoIdStringValidator, required: true },
                    formIds: { validator: listOfMongoIdStringValidator, required: true },
                    noteCoding: { validator: canvasCodingValidator, required: true },
                    matchCareTeamTagsForCanvasPractitionerResolution: {
                        validator: listOfStringsWithQualifierValidator,
                        required: true,
                    },
                },
                returns: {},
            },
            save_field_response: {
                op: "custom", access: 'update', method: "patch",
                name: 'Save Field Response',
                path: '/save-field-response',
                description: "With an accessCode, includes the answer to an individual field in a partial form response, or logs a field view.",
                parameters: {
                    formResponseId: { validator: mongoIdStringValidator },
                    accessCode: { validator: stringValidator250 },
                    response: { validator: formResponseValidator },
                    responses: { validator: listValidatorOptionalOrEmptyOk(formResponseValidator) },
                    viewOnly: { validator: booleanValidator },
                    fieldId: { validator: mongoIdStringValidator },
                },
                returns: {
                    formResponse: 'form response',
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
                    markedAsSubmitted: { validator: booleanValidator },
                },
                returns: {
                    formResponse: 'form response',
                    nextFormGroupPublicURL: { validator: stringValidator },
                    redirectTo: { validator: stringValidator },
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
                    form: 'form',
                    fields: 'form fields',
                    response: 'form response',
                },
            },
            stripe_details: {
                op: "custom", access: 'read', method: "get",
                name: 'Stripe details for form field',
                path: '/form-responses/stripe-details',
                description: "Gets the relevant information for a Stripe field",
                parameters: {
                    fieldId: { validator: mongoIdStringValidator, required: true },
                    enduserId: { validator: mongoIdStringValidator },
                    selectedProductIds: { validator: listOfStringsValidatorOptionalOrEmptyOk },
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
                op: "custom", access: 'read', method: "all",
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
                    report: { validator: objectAnyFieldsAnyValuesValidator, required: true }
                },
            },
            get_related_forms_report: {
                op: "custom", access: 'read', method: "all",
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
                    report: { validator: objectAnyFieldsAnyValuesValidator, required: true }
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
                        validator: listValidatorEmptyOk(objectValidator({ field: stringValidator, value: stringValidator }))
                    },
                    endusersFilter: { validator: objectAnyFieldsAnyValuesValidator },
                    groupBy: { validator: stringValidator },
                    includeCalendarEventTemplateIds: { validator: listOfStringsValidatorOptionalOrEmptyOk },
                },
                returns: {
                    count: { validator: numberValidator, required: true },
                    grouped: { validator: objectAnyFieldsAnyValuesValidator, },
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
                        validator: listValidatorEmptyOk(objectValidator({ field: stringValidator, value: stringValidator }))
                    },
                    endusersFilter: { validator: objectAnyFieldsAnyValuesValidator },
                    includeCalendarEventTemplateIds: { validator: listOfStringsValidatorOptionalOrEmptyOk },
                },
                returns: {
                    count: { validator: numberValidator, required: true },
                    grouped: { validator: objectAnyFieldsAnyValuesValidator, },
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
                    report: { validator: objectAnyFieldsAnyValuesValidator, required: true }
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
                    utm: { validator: labeledFieldsValidator },
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
            description: "Allows you to subscribe to Webhooks when models in Tellescope are created, updated, and deleted.\n\n        <strong style=\"font-size: 25px\">\n        To avoid echo (receiving webhooks when updating records with an API Key), pass the use { dontSendWebhook: true } in the \"options\" parameter to update (PATCH) requests\n        We rate limit requests which perform the same update to the same record to help you detect echo during development\n        </strong>\n\n        Each webhook is a POST request to the given URL, of the form <pre>{ \n          model: string, \n          type: 'create' | 'update' | 'delete', \n          records: object[], \n          timestamp: string, \n          integrity: string, \n          relatedRecords: { [id: string]: object } \n}</pre>\n        This includes the name of the model, the type of operation performed, and an array of the new, updated, or deleted model(s).\n\n        <strong>Each 'create' webhook may include more than one record (e.g. when records are created as part of a bulk POST) </strong>\n\n        The integrity field is a sha256 hash of (record ids concatenated from index 0 to the end, with the timestamp and then secret appended)\n        For example hook: { records: [{ id: '1', ... }, { id: '4', ... }], timestamp: \"1029358\" } with secret set as \"secret\",\n        integrity = sha256('141029358secret')\n        Each time you handle a webhook, you should verify the integrity field is correct to ensure that the request is actually coming from Tellescope. \n\n        For performance, a relatedRecords object is provided as a cache. This object maps some ids referenced in the webhook records to the corresponding models in Tellescope. \n        For a given webhook, relatedRecords may be empty, or may not include all related ids. In such cases, you'll need to query against the Tellescope API for an up-to-date reference.\n\n        Currently supported models for Webhooks: ".concat(Object.keys(WEBHOOK_MODELS).join(', '), "\n\n        You can handle webhooks from automations in Tellescope, which have a simpler format: <pre>{ \n          type: 'automation'\n          message: string,\n          timestamp: string, \n          integrity: string, \n          enduserId: string, \n}</pre>\n        In this case, integrity is a simple sha256 hash of message + timestamp + secret\n\n        You can also handle calendar event reminders as webhooks, which have the format: <pre>{ \n          type: 'calendar_event_reminder'\n          event: CalendarEvent,\n          timestamp: string, \n          integrity: string, \n}</pre>\n        In this case, integrity is a simple sha256 hash of event.id + timestamp + secret\n      ")
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
                parameters: {},
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
                    message: { validator: stringValidator5000 },
                    enduserId: { validator: mongoIdStringValidator },
                    automationStepId: { validator: mongoIdStringValidator },
                    action: { validator: optionalAnyObjectValidator },
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
        fields: __assign(__assign({}, BuiltInFields), { secret: {
                validator: stringValidator250,
                examples: ["Text"],
            }, url: {
                validator: urlValidator,
                examples: ["Text"],
            }, subscriptions: {
                validator: WebhookSubscriptionValidator,
            } })
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
                    evaluate: function (r, t, s) {
                        if (s.type === 'user')
                            return;
                        if (r.publicRead)
                            return "Enduser cannot create or update public events";
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
                    events: { validator: 'calendar_events', required: true }
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
                    events: { validator: 'calendar_events', required: true }
                },
            },
            generate_meeting_link: {
                op: "custom", access: 'read', method: "post",
                name: 'Generate Meeting Link',
                path: '/generate-meeting-link',
                description: "Generates a link to join a scheduled meeting for an enduser",
                parameters: {
                    eventId: { validator: mongoIdStringValidator, required: true },
                    enduserId: { validator: mongoIdStringValidator, required: true },
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
                    businessId: { validator: mongoIdStringValidator },
                    userId: { validator: mongoIdStringValidator },
                    userIds: { validator: listOfMongoIdStringValidatorEmptyOk },
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
                    externalId: { validator: stringValidator100 },
                },
                returns: {
                    createdEvent: { validator: 'calenar_event' },
                },
            },
            stripe_details: {
                op: "custom", access: 'read', method: "get",
                name: 'Get Stripe Details',
                path: '/scheduling/stripe-details',
                description: "Gets Stripe checkout details for an appointment booking flor",
                parameters: {},
                returns: {
                    stripe: {
                        validator: objectValidator({
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
                    updatedEvent: { validator: 'calendar_event', required: true },
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
                    updatedEvent: { validator: 'calendar_event', required: true },
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
                returns: {},
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
                    report: { validator: objectAnyFieldsAnyValuesValidator, required: true }
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
                    report: { validator: objectAnyFieldsAnyValuesValidator, required: true }
                },
            },
            get_status_report: {
                op: "custom", access: 'read', method: "all",
                name: 'Report',
                path: '/calendar-events/status-report',
                description: "Builds a report on events by status",
                parameters: {
                    range: { validator: dateRangeOptionalValidator },
                    groupBy: { validator: stringValidator },
                },
                returns: {
                    report: { validator: objectAnyFieldsAnyValuesValidator, required: true }
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
                    event: { validator: 'calendar_event', required: true },
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
                    email: { validator: emailValidator },
                    calendarEventTemplateId: { validator: mongoIdStringValidator, required: true },
                    businessId: { validator: mongoIdStringValidator, required: true },
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
                        validator: objectValidator({
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
                    businessId: { validator: mongoIdStringValidator, required: true },
                    userId: { validator: mongoIdStringValidator },
                    userTags: { validator: listOfStringsValidatorOptionalOrEmptyOk },
                    userFilterTags: { validator: listOfStringsValidatorOptionalOrEmptyOk },
                },
                returns: {
                    appointmentBookingPage: { validator: 'appointment_booking_page', required: true },
                    calendarEventTemplates: { validator: 'calendar_event_templates', required: true },
                    locations: { validator: 'appointment_locations', required: true },
                    products: { validator: 'products', required: true },
                    userDisplayName: { validator: stringValidator },
                    userAvatar: { validator: stringValidator },
                    users: { validator: "users" },
                },
            }
        },
        enduserActions: {
            read: {}, readMany: {}, update: {},
            get_appointment_availability: {}, book_appointment: {}, stripe_details: {},
            session_for_public_appointment_booking: {}, download_ics_file: {},
        },
        fields: __assign(__assign({}, BuiltInFields), { sendIcsEmail: { validator: booleanValidator }, athenaDepartmentId: { validator: stringValidator1000 }, generateAthenaTelehealthLink: { validator: booleanValidator }, athenaTypeId: { validator: stringValidator1000 }, athenaBookingTypeId: { validator: stringValidator1000 }, preventCancelMinutesInAdvance: { validator: numberValidator }, preventRescheduleMinutesInAdvance: { validator: numberValidator }, preventCancelInPortal: { validator: booleanValidator }, preventRescheduleInPortal: { validator: booleanValidator }, actualDuration: { validator: nonNegNumberValidator }, dontSyncToCanvas: { validator: booleanValidator }, title: {
                validator: stringValidator250,
                required: true,
                examples: ["Text"],
            }, displayTitle: { validator: stringValidator250 }, displayDescription: { validator: stringValidator5000 }, startTimeInMS: {
                validator: nonNegNumberValidator,
                examples: [100],
                required: true,
            }, durationInMinutes: {
                validator: nonNegNumberValidator,
                examples: [100],
                required: true,
            }, locationId: { validator: mongoIdStringValidator }, locationIds: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk }, type: { validator: stringValidator100 }, description: { validator: stringValidator5000 }, agreedToTerms: { validator: appointmentTermsValidator }, meetingId: { validator: mongoIdStringValidator, readonly: true }, bookingPageId: { validator: mongoIdStringValidator }, meetingStatus: { validator: meetingStatusValidator }, attachments: { validator: listOfGenericAttachmentsValidator }, cancelledAt: { validator: dateOptionalOrEmptyStringValidator }, rescheduledAt: { validator: dateOptionalOrEmptyStringValidator }, noShowedAt: { validator: dateOptionalOrEmptyStringValidator }, rescheduledTo: { validator: mongoIdStringValidator }, chatRoomId: {
                validator: mongoIdStringValidator,
                dependencies: [{
                        dependsOn: ['chat_rooms'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'setNull',
                    }]
            }, carePlanId: {
                validator: mongoIdStringValidator,
                dependencies: [{
                        dependsOn: ['care_plans'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'setNull',
                    }]
            }, carePlanNote: { validator: stringValidator5000EmptyOkay }, attendees: {
                validator: calendarEventAttendeesValidator,
                initializer: function () { return []; },
            }, reminders: {
                validator: listOfCalendarEventRemindersValidator,
                initializer: function () { return []; },
            }, templateId: {
                validator: mongoIdStringValidator,
                dependencies: [{
                        dependsOn: ['calendar_event_templates'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'nop',
                    }]
            }, publicRead: { validator: booleanValidator }, wasSelfScheduled: { validator: booleanValidator }, enableVideoCall: { validator: booleanValidator }, fields: { validator: fieldsValidator }, numRSVPs: { validator: nonNegNumberValidator }, image: { validator: stringValidator5000 }, sharedContentIds: { validator: listOfMongoIdStringValidatorEmptyOk }, enduserFormResponses: { validator: enduserFormResponsesForEventValidator }, enduserTasks: { validator: enduserTasksForEventValidator }, color: { validator: stringValidator1000 }, location: { validator: stringValidator1000 }, locationURL: { validator: stringValidator1000 }, locationNotes: { validator: stringValidator5000 }, phone: { validator: stringValidator100 }, portalSettings: { validator: calendarEventPortalSettingsValidator }, externalId: { validator: stringValidator }, source: { validator: stringValidator }, videoIntegration: { validator: videoIntegrationTypesValidator }, videoHostUserId: { validator: mongoIdStringValidator }, videoURL: { validator: stringValidator }, videoStartURL: { validator: stringValidator }, externalVideoURL: { validator: stringValidator }, timezone: { validator: timezoneValidator }, copiedFrom: { validator: mongoIdStringValidator }, internalNotes: { validator: stringValidator5000EmptyOkay }, hiddenFromPortal: { validator: booleanValidatorOptional }, enduserAttendeeLimit: { validator: numberValidator }, bufferEndMinutes: { validator: numberValidator }, bufferStartMinutes: { validator: numberValidator }, canvasCoding: { validator: canvasCodingValidator }, canvasReasonCoding: { validator: canvasCodingValidator }, canvasLocationId: { validator: stringValidator100 }, references: { validator: listOfRelatedRecordsValidator, readonly: true }, completedAt: { validator: dateValidatorOptional }, completedBy: { validator: stringValidator }, confirmedAt: { validator: dateValidatorOptional }, tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, cancelledGroupAttendees: {
                validator: listValidatorOptionalOrEmptyOk(objectValidator({
                    id: mongoIdStringRequired,
                    at: dateValidator,
                }))
            }, attendeeStatuses: {
                validator: listValidatorOptionalOrEmptyOk(objectValidator({
                    id: mongoIdStringRequired,
                    at: dateValidator,
                    status: exactMatchValidator(['Confirmed', 'Completed', 'Cancelled', 'No-showed', 'Rescheduled']),
                }))
            }, useUserURL: { validator: booleanValidator }, instructions: { validator: stringValidator5000EmptyOkay }, reason: { validator: stringValidator5000 }, scheduledBy: { validator: mongoIdStringValidator }, 
            // isAllDay: { validator: booleanValidator },
            statusChangeSource: {
                validator: objectValidator({
                    source: stringValidator100,
                    identifier: stringValidator100,
                    byEnduserExternal: booleanValidatorOptional,
                }),
            }, cancelReason: { validator: stringValidator5000 }, dontAutoSyncPatientToHealthie: { validator: booleanValidator }, healthieInsuranceBillingEnabled: { validator: booleanValidator }, dontBlockAvailability: { validator: booleanValidator }, previousStartTimes: { validator: listOfNumbersValidatorUniqueOptionalOrEmptyOkay }, requirePortalCancelReason: { validator: booleanValidator }, startLinkToken: { validator: stringValidator250 }, canvasEncounterId: { validator: stringValidator100 }, allowGroupReschedule: { validator: booleanValidator }, joinedVideoCall: {
                validator: listValidatorOptionalOrEmptyOk(objectValidator({
                    id: mongoIdStringRequired,
                    at: dateValidator,
                }))
            }, createAndBookAthenaSlot: { validator: booleanValidator }, dontSyncToElation: { validator: booleanValidator } })
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
        fields: __assign(__assign({}, BuiltInFields), { dontSyncToElation: { validator: booleanValidator }, sendIcsEmail: { validator: booleanValidator }, createAndBookAthenaSlot: { validator: booleanValidator }, athenaDepartmentId: { validator: stringValidator1000 }, generateAthenaTelehealthLink: { validator: booleanValidator }, athenaTypeId: { validator: stringValidator1000 }, athenaBookingTypeId: { validator: stringValidator1000 }, preventCancelMinutesInAdvance: { validator: numberValidator }, preventRescheduleMinutesInAdvance: { validator: numberValidator }, preventCancelInPortal: { validator: booleanValidator }, preventRescheduleInPortal: { validator: booleanValidator }, dontSyncToCanvas: { validator: booleanValidator }, archivedAt: { validator: dateOptionalOrEmptyStringValidator }, allowGroupReschedule: { validator: booleanValidator }, dontAutoSyncPatientToHealthie: { validator: booleanValidator }, title: {
                validator: stringValidator250,
                required: true,
                examples: ["Text"],
            }, displayTitle: { validator: stringValidator250 }, displayDescription: { validator: stringValidator5000 }, durationInMinutes: {
                validator: nonNegNumberValidator,
                examples: [100],
                required: true,
            }, portalSettings: { validator: calendarEventPortalSettingsValidator }, productIds: { validator: listOfMongoIdStringValidatorEmptyOk }, type: { validator: stringValidator100 }, description: { validator: stringValidator5000 }, reminders: {
                validator: listOfCalendarEventRemindersValidator,
                initializer: function () { return []; },
            }, publicRead: { validator: booleanValidator }, enableVideoCall: { validator: booleanValidator }, enableSelfScheduling: { validator: booleanValidator }, restrictedByState: { validator: booleanValidator }, image: { validator: stringValidator5000 }, confirmationEmailDisabled: { validator: booleanValidatorOptional }, confirmationSMSDisabled: { validator: booleanValidatorOptional }, 
            // confirmationSenderId: { validator: mongoIdStringValidator },
            carePlanForms: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk }, carePlanContent: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk }, carePlanFiles: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk }, carePlanTasks: { validator: listOfStringsValidatorOptionalOrEmptyOk }, videoIntegration: { validator: videoIntegrationTypesValidator }, generateZoomLinkWhenBooked: { validator: booleanValidator }, color: { validator: stringValidator1000 }, apiOnly: { validator: booleanValidator }, enduserAttendeeLimit: { validator: numberValidator }, bufferEndMinutes: { validator: numberValidator }, bufferStartMinutes: { validator: numberValidator }, canvasCoding: { validator: canvasCodingValidator }, canvasReasonCoding: { validator: canvasCodingValidator }, tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, matchToHealthieTemplate: { validator: booleanValidator }, healthieInsuranceBillingEnabled: { validator: booleanValidator }, useUserURL: { validator: booleanValidator }, instructions: { validator: stringValidator5000EmptyOkay }, requiresEnduser: { validator: booleanValidator }, requirePortalCancelReason: { validator: booleanValidator }, replaceHostOnReschedule: { validator: booleanValidator } })
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
        defaultActions: __assign(__assign({}, DEFAULT_OPERATIONS), { update: { creatorOnly: true }, delete: { creatorOnly: true } }),
        enduserActions: { create: {}, read: {}, readMany: {}, update: {}, delete: {} },
        fields: __assign(__assign({}, BuiltInFields), { eventId: {
                validator: mongoIdStringValidator,
                required: true,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['calendar_events'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, displayName: {
                validator: stringValidator,
                initializer: function (_, s) { var _a; return (_a = s.fname) !== null && _a !== void 0 ? _a : ''; },
            }, avatar: {
                validator: stringValidator1000,
                initializer: function (_, s) { var _a; return (_a = s.avatar) !== null && _a !== void 0 ? _a : ''; },
            }, status: { validator: stringValidator }, creatorType: {
                readonly: true,
                validator: sessionTypeValidator,
                initializer: function (_, s) { return s.type; },
            } })
    },
    automation_steps: {
        info: {},
        constraints: {
            unique: [],
            relationship: [
                {
                    explanation: 'Event, action, and conditions cannot all be shared by an existing event automation (no duplicates)',
                    evaluate: function () { } // implemented in routing.ts
                },
            ],
            access: []
        },
        defaultActions: __assign({}, DEFAULT_OPERATIONS),
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { journeyId: {
                validator: mongoIdStringValidator,
                examples: [PLACEHOLDER_ID],
                required: true,
                dependencies: [{
                        dependsOn: ['journeys'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, events: {
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
            }, action: {
                validator: automationActionValidator,
                required: true,
                examples: [{
                        type: "sendEmail",
                        info: {
                            senderId: PLACEHOLDER_ID,
                            templateId: PLACEHOLDER_ID,
                        },
                    }]
            }, conditions: { validator: listOfAutomationConditionsValidator }, flowchartUI: { validator: flowchartUIValidator }, continueOnError: { validator: booleanValidator }, enduserConditions: { validator: optionalAnyObjectValidator }, tags: { validator: listOfStringsValidatorOptionalOrEmptyOk } })
    },
    automated_actions: {
        info: {},
        constraints: {
            unique: [],
            relationship: [],
            access: []
        },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { cancelConditions: {
                validator: cancelConditionsValidator,
            }, automationStepId: {
                validator: mongoIdStringValidator,
                required: true,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['automation_steps'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'nop', // worth keeping as a log of some automated action, even if the automation itself is no longer active
                    }]
            }, enduserId: {
                validator: mongoIdStringValidator,
                required: true,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, journeyId: {
                validator: mongoIdStringValidator,
                required: true,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['journeys'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'nop', // worth keeping as a log of some automated action, even if the automation itself is no longer active
                    }]
            }, event: {
                validator: automationEventValidator,
                examples: [{
                        type: "onJourneyStart",
                        info: {},
                    }],
                required: true,
            }, action: {
                validator: automationActionValidator,
                required: true,
                examples: [{
                        type: "sendEmail",
                        info: {
                            senderId: PLACEHOLDER_ID,
                            templateId: PLACEHOLDER_ID,
                        },
                    }]
            }, status: {
                validator: automatedActionStatusValidator,
                required: true,
                examples: ['active']
            }, processAfter: {
                validator: nonNegNumberValidator,
                required: true,
                examples: [Date.now()],
            }, journeyContext: { validator: journeyContextValidator } })
    },
    user_logs: {
        info: {},
        constraints: {
            unique: [],
            relationship: [],
            access: []
        },
        defaultActions: { read: {}, readMany: {} },
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { userId: {
                validator: mongoIdStringValidator,
                required: true,
                examples: [PLACEHOLDER_ID],
                // dependencies: [{
                //   dependsOn: ['users'], 
                //   dependencyField: '_id',
                //   relationship: 'foreignKey',
                //   onDependencyDelete: 'delete',
                // }]
            }, enduserId: { validator: mongoIdStringValidator }, resource: {
                validator: stringValidator100,
                required: true,
                examples: [PLACEHOLDER_ID],
            }, resourceId: {
                validator: mongoIdStringValidator,
                required: true,
                examples: [PLACEHOLDER_ID],
            }, action: {
                validator: CUDStringValidator,
                required: true,
                examples: [PLACEHOLDER_ID],
            } })
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
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { userId: {
                validator: mongoIdStringValidator,
                required: true,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['users'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, type: { validator: stringValidator100, required: true, examples: ['type'] }, message: { validator: stringValidator5000, required: true, examples: ['message'] }, read: { validator: booleanValidator }, relatedRecords: { validator: listOfRelatedRecordsValidator } })
    },
    enduser_observations: {
        info: {},
        constraints: {
            unique: [],
            relationship: [],
        },
        defaultActions: __assign(__assign({}, DEFAULT_OPERATIONS), { create: {
                warnings: [
                    "\"timestamp\" is the datetime displayed in the Tellescope UI for Vitals, and defaults to the submission datetime with a precision of milliseconds. A \"createdAt\" timestamp is tracked automatically with a precision of seconds. \"recordedAt\" can be used to store another datetime but is not required and not exposed in our UI.",
                ],
            }, createMany: {
                warnings: [
                    "\"timestamp\" is the datetime displayed in the Tellescope UI for Vitals, and defaults to the submission datetime with a precision of milliseconds. A \"createdAt\" timestamp is tracked automatically with a precision of seconds. \"recordedAt\" can be used to store another datetime but is not required and not exposed in our UI.",
                ],
            } }),
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
                    observations: { validator: 'enduser_observations', required: true },
                },
            },
            acknowledge: {
                op: "custom", access: 'update', method: "post",
                name: 'Acknowledge Observations (Vitals)',
                path: '/enduser-observations/acknowledge',
                description: "Bulk acknowledge (mark reviewed) EnduserObservations or update exclusion flag for vital count lookback",
                parameters: {
                    ids: { validator: listOfMongoIdStringValidator, required: true },
                    excludeFromVitalCountLookback: { validator: booleanValidator },
                },
                returns: {},
            },
        },
        enduserActions: { create: {}, createMany: {}, read: {}, readMany: {}, load: {} },
        fields: __assign(__assign({}, BuiltInFields), { timestampIsEstimated: { validator: booleanValidator }, category: {
                required: true,
                validator: FHIRObservationCategoryValidator,
                examples: ['vital-signs'],
            }, status: {
                required: true,
                validator: FHIRObservationStatusCodeValidator,
                examples: ['final'],
            }, measurement: {
                required: true,
                validator: FHIRObservationValueValidator,
                examples: [{
                        unit: 'mmol',
                        value: 8,
                    }],
            }, enduserId: {
                required: true,
                validator: mongoIdStringValidator,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, code: { validator: stringValidator }, source: { validator: stringValidator }, type: { validator: stringValidator }, notes: { validator: stringValidator }, recordedAt: { validator: dateValidator }, reviewedAt: { validator: dateValidatorOptional }, timestamp: { validator: dateValidator, initializer: function () { return new Date(); } }, statusChangedBy: { validator: mongoIdStringValidator }, beforeMeal: { validator: booleanValidator }, medStatus: { validator: stringValidator }, irregularHeartbeat: { validator: booleanValidator }, dontTrigger: { validator: booleanValidator }, references: { validator: listOfRelatedRecordsValidator, readonly: true }, showWithPlotsByUnit: { validator: listOfStringsValidatorOptionalOrEmptyOk }, invalidationReason: { validator: stringValidatorOptionalEmptyOkay } })
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
                    updated: { validator: 'managed_content_record' },
                }
            },
            search: {
                op: 'custom', access: 'read', method: 'post',
                path: '/managed-content-records/search',
                name: "Search content using AI integration",
                description: "",
                parameters: {
                    query: { validator: stringValidator, required: true },
                    type: { validator: exactMatchValidator(['enduser', 'internal']) },
                },
                returns: {
                    record: { validator: 'managed_content_record', required: true },
                    matches: { validator: 'managed_content_records', required: true },
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
                    record: { validator: 'managed_content_record', required: true },
                }
            },
        },
        enduserActions: {
            create: {}, createMany: {}, read: {}, readMany: {},
            search: {},
        },
        fields: __assign(__assign({}, BuiltInFields), { slug: { validator: stringValidator250 }, title: {
                validator: stringValidator1000,
                required: true,
                examples: ["Template Name"],
            }, category: {
                validator: stringValidator100,
            }, description: {
                validator: stringValidator5000,
                examples: ["Template Subject"],
            }, textContent: {
                validator: stringValidator25000,
                required: true,
                examples: ["This is the template message......"],
            }, htmlContent: {
                validator: stringValidator25000,
                examples: ["This is the template message......"],
            }, editorState: {
                validator: stringValidator25000,
                examples: ["This is the template message......"],
            }, type: {
                validator: managedContentRecordTypeValidator,
                updatesDisabled: true,
            }, enduserId: {
                validator: mongoIdStringValidator,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete', // if enduserId exist (should only be for Individual), clean up as dependency of enduser
                    }]
            }, assignmentType: { validator: managedContentRecordAssignmentTypeValidator }, attachments: {
                validator: listOfChatAttachmentsValidator,
            }, blocks: { validator: blocksValidator }, headerPhoto: { validator: stringValidator250 }, publicRead: { validator: booleanValidator }, mode: { validator: messageTemplateModeValidator, }, files: { validator: listOfStringsValidatorEmptyOk }, tags: { validator: listOfStringsValidatorEmptyOk }, embeddingType: { validator: embeddingTypeValidator }, embedding: { validator: listValidator(numberValidator) }, forInternalUse: { validator: booleanValidator }, allowUnauthenticatedAccess: { validator: booleanValidator }, portalIndex: { validator: numberValidator } })
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
        customActions: {},
        enduserActions: { read: {}, readMany: {} },
        fields: __assign(__assign({}, BuiltInFields), { contentId: {
                validator: mongoIdStringValidator,
                required: true,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['managed_content_records'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, enduserId: {
                validator: mongoIdStringValidator,
                required: true,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            } })
    },
    forums: {
        info: {},
        constraints: {
            unique: ['title'],
            relationship: [],
        },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: { read: {}, readMany: {} },
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: stringValidator100,
                required: true,
                examples: ["Template Name"],
            }, description: {
                validator: stringValidator5000,
                examples: ["Template Subject"],
            }, publicRead: { validator: booleanValidator }, slug: { validator: stringValidator250 } }),
    },
    forum_posts: {
        info: {},
        constraints: {
            unique: [],
            relationship: [],
            access: [{ type: 'dependency', foreignModel: 'forums', foreignField: '_id', accessField: 'forumId' }]
        },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: { create: {}, read: {}, readMany: {}, update: { creatorOnly: true }, delete: { creatorOnly: true } },
        fields: __assign(__assign({}, BuiltInFields), { forumId: {
                validator: mongoIdStringValidator,
                required: true,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['forums'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, postedBy: {
                validator: userIdentityValidator,
                initializer: function (_, s) { return ({ type: s.type, id: s.id }); }
            }, numComments: {
                validator: nonNegNumberValidator,
                initializer: function () { return 0; },
                updatesDisabled: true,
            }, numLikes: {
                validator: nonNegNumberValidator,
                updatesDisabled: true,
                initializer: function () { return 0; },
            }, title: {
                validator: stringValidator5000,
                required: true,
                examples: ["This is the template message......"],
            }, textContent: {
                validator: stringValidator25000,
                required: true,
                examples: ["This is the template message......"],
            }, htmlContent: {
                validator: stringValidator25000,
                examples: ["This is the template message......"],
            }, editorState: {
                validator: stringValidator25000,
                examples: ["This is the template message......"],
            }, slug: { validator: stringValidator250 }, attachments: {
                validator: listOfChatAttachmentsValidator,
            } }),
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
        customActions: {},
        enduserActions: { create: {}, read: {}, readMany: {}, delete: { creatorOnly: true } },
        fields: __assign(__assign({}, BuiltInFields), { forumId: {
                validator: mongoIdStringValidator,
                required: true,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['forums'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, postId: {
                validator: mongoIdStringValidator,
                required: true,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['forum_posts'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, threadId: {
                validator: mongoIdStringValidator,
                examples: [PLACEHOLDER_ID],
                initializer: function (s) { var _a; return (_a = s.replyTo) !== null && _a !== void 0 ? _a : ''; },
                dependencies: [{
                        dependsOn: ['post_comments'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'nop',
                    }]
            }, replyTo: {
                validator: mongoIdStringValidator,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['post_comments'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'nop',
                    }]
            }, postedBy: {
                validator: userIdentityValidator,
                initializer: function (_, s) { return ({ type: s.type, id: s.id }); },
            }, attachments: { validator: listOfStringsValidator }, textContent: {
                validator: stringValidator25000,
                required: true,
                examples: ["This is the template message......"],
            }, htmlContent: {
                validator: stringValidator25000,
                examples: ["This is the template message......"],
            }, editorState: {
                validator: stringValidator25000,
                examples: ["This is the template message......"],
            }, numLikes: { validator: nonNegNumberValidator, updatesDisabled: true }, numReplies: { validator: nonNegNumberValidator, updatesDisabled: true } }),
    },
    post_likes: {
        info: {},
        constraints: {
            unique: [],
            relationship: [],
            access: [{ type: 'dependency', foreignModel: 'forums', foreignField: '_id', accessField: 'forumId' }]
        },
        defaultActions: { read: {}, readMany: {}, delete: {} },
        enduserActions: { create: {}, unlike_post: {}, readMany: {} },
        customActions: {
            create: {
                op: "custom", access: 'create', method: "post",
                name: 'Like Forum Post',
                path: '/post-like',
                description: "Likes a post",
                parameters: {
                    postId: { validator: mongoIdStringValidator, required: true },
                    forumId: { validator: mongoIdStringValidator, required: true },
                },
                returns: {} //authToken: { validator: stringValidator5000 } },
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
                returns: {} //authToken: { validator: stringValidator5000 } },
            },
        },
        fields: __assign(__assign({}, BuiltInFields), { 
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
            }, postId: {
                validator: mongoIdStringValidator,
                required: true,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['forum_posts'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            } }),
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
        enduserActions: { create: {}, read: {}, readMany: {}, delete: {} },
        fields: __assign(__assign({}, BuiltInFields), { forumId: {
                validator: mongoIdStringValidator,
                required: true,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['forums'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, postId: {
                validator: mongoIdStringValidator,
                required: true,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['forum_posts'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, commentId: {
                validator: mongoIdStringValidator,
                required: true,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['post_comments'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            } })
    },
    organizations: {
        info: {},
        constraints: {
            unique: [],
            globalUnique: ['subdomain'],
            relationship: [
                {
                    explanation: 'Only organization owner can update owner',
                    evaluate: function (updated, lookup, session, type, options) {
                        var _a;
                        if (type !== 'update')
                            return; // not updating
                        if (!((_a = options.updates) === null || _a === void 0 ? void 0 : _a.owner))
                            return; // not changing owner
                        if (!options.original)
                            return; // original not provided to check previous owner (bug)
                        var original = options.original;
                        if (original.owner) {
                            if (original.owner !== session.id) {
                                return "Only owner can change ownership";
                            }
                        }
                        else if (original.creator !== session.id) {
                            return "Only creator can set initial owner";
                        }
                    }
                },
                {
                    explanation: 'Subscription date, period, and AI enablement cannot be updated',
                    evaluate: function (updated, lookup, session, type, options) {
                        var _a, _b, _c, _d, _e, _f;
                        if (type !== 'update')
                            return; // not updating
                        if (!(((_a = options.updates) === null || _a === void 0 ? void 0 : _a.bedrockAIAllowed) || ((_b = options.updates) === null || _b === void 0 ? void 0 : _b.subscriptionExpiresAt) || ((_c = options.updates) === null || _c === void 0 ? void 0 : _c.subscriptionPeriod) || ((_d = options.updates) === null || _d === void 0 ? void 0 : _d.allowCreateSuborganizations) || ((_e = options.updates) === null || _e === void 0 ? void 0 : _e.customPortalURLs) || ((_f = options.updates) === null || _f === void 0 ? void 0 : _f.subdomains)))
                            return; // not changing
                        if (session.type === 'enduser')
                            return "User only";
                        if (!session.isa)
                            return "Not allowed";
                    }
                },
            ],
        },
        defaultActions: { read: {}, readMany: {}, update: {},
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
                    created: { validator: 'organization', required: true },
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
                    organization: { validator: 'organization', required: true },
                    user: { validator: 'user', required: true },
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
                    organization: { validator: 'organization' },
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
                returns: {}
            },
            sync_note_to_canvas: {
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
                parameters: {},
                returns: {
                    organization: { validator: 'organization', required: true },
                }
            },
            load_twilio_embed: {
                op: "custom", access: 'read', method: "get",
                adminOnly: true,
                name: 'Get Twilio Embed',
                path: '/organizations/twilio-embed',
                description: "Gets detail to load an embedded Twilio UI in Tellescope. Use type='tfn-verification' for TFN verification embed.",
                parameters: {
                    type: { validator: stringValidator },
                    phoneNumberSid: { validator: stringValidator },
                },
                returns: {
                    id: { validator: stringValidator },
                    inquiryId: { validator: stringValidator },
                    phoneNumberSid: { validator: stringValidator },
                    token: { validator: stringValidator, required: true },
                }
            },
        },
        enduserActions: {},
        publicActions: {
            get_theme: {
                op: "custom", access: 'read', method: "get",
                name: 'Get Organization Theme',
                path: '/organization-theme',
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
        fields: __assign(__assign({}, BuiltInFields), { inboxThreadsBuiltFrom: { validator: dateOptionalOrEmptyStringValidator }, inboxThreadsBuiltTo: { validator: dateOptionalOrEmptyStringValidator }, outOfOfficeHours: { validator: outOfOfficeBlocksValidator }, bedrockAIAllowed: { validator: booleanValidator }, creditCount: { validator: numberValidator, readonly: true }, stripeKeyDetails: {
                validator: listValidatorOptionalOrEmptyOk(objectValidator({
                    key: stringValidator5000EmptyOkay,
                    title: stringValidator5000EmptyOkay,
                }))
            }, metriportIntegrationDetails: {
                validator: listValidatorOptionalOrEmptyOk(objectValidator({
                    title: stringValidator5000EmptyOkay,
                    environment: stringValidator1000Optional,
                }))
            }, name: {
                validator: stringValidator100,
                required: true,
                examples: ["Template Name"],
            }, subdomain: {
                validator: slugValidator,
                required: true,
                examples: ["subdomain"],
            }, limits: {
                validator: organizationLimitsValidator,
                readonly: true, // to be set by Tellescope super admin only
            }, owner: { validator: mongoIdStringValidator }, parentOrganizationId: { validator: mongoIdStringValidator }, subscriptionExpiresAt: { validator: dateValidator }, subscriptionPeriod: { validator: numberValidator }, logoVersion: { validator: numberValidator }, faviconVersion: { validator: numberValidator }, roles: { validator: listOfStringsValidatorEmptyOk }, skills: { validator: listOfStringsValidator }, themeColor: { validator: stringValidator100 }, themeColorSecondary: { validator: stringValidator100 }, enduserDisplayName: { validator: stringValidator100 }, customPortalURL: { validator: stringValidator250 }, customPortalURLs: { validator: listOfStringsValidator }, subdomains: { validator: listOfStringsValidator }, portalSettings: { validator: portalSettingsValidator }, settings: { validator: organizationSettingsValidator }, timezone: { validator: timezoneValidator }, forwardAllIncomingEmailsTo: { validator: emailValidator }, zendeskSettings: {
                validator: objectValidator({
                    priorityGroups: listOfStringsValidatorOptionalOrEmptyOk,
                    resolutionFieldId: stringValidatorOptionalEmptyOkay,
                    resolutionFieldOptions: listOfStringsValidatorOptionalOrEmptyOk,
                    syncTagsToZendesk: booleanValidator,
                })
            }, hasTicketQueues: { validator: booleanValidator }, customAutoreplyMessage: { validator: stringValidator1000 }, customZoomEmailTemplate: { validator: stringValidator5000 }, customZoomEmailSubject: { validator: stringValidator1000 }, customZoomSMSTemplate: { validator: stringValidator1000 }, altVitalTeamIds: { validator: listValidatorEmptyOk(objectValidator({
                    teamId: stringValidator100,
                    label: stringValidator100,
                })) }, billingOrganizationName: { validator: stringValidator }, billingOrganizationNPI: { validator: stringValidator }, billingOrganizationTaxId: { validator: stringValidator }, billingOrganizationAddress: { validator: addressValidator }, videoCallBackgroundImage: { validator: stringValidator }, sendToVoicemailOOO: { validator: booleanValidator }, forwardingOOONumber: { validator: phoneValidator }, onCallUserIds: { validator: listOfUniqueStringsValidatorEmptyOk }, outOfOfficeVoicemail: { validator: phonePlaybackValidator }, enduserProfileWebhooks: { validator: enduserProfileWebhooksValidator }, showCommunity: { validator: booleanValidator }, phoneLabels: {
                validator: listValidatorOptionalOrEmptyOk(objectValidator({
                    label: stringValidator100,
                    number: stringValidator100,
                }))
            }, athenaFieldsSync: { validator: fieldsSyncValidator }, athenaDepartments: {
                validator: listValidatorOptionalOrEmptyOk(objectValidator({
                    id: stringValidator100,
                    timezone: timezoneValidator,
                }))
            }, fieldsToAdminNote: { validator: listOfStringsValidatorOptionalOrEmptyOk }, incomingCallDisplayFields: { validator: listOfStringsValidatorOptionalOrEmptyOk }, canvasMessageSync: {
                validator: objectValidator({
                    id: stringValidator100,
                    questionId: stringValidator100,
                })
            }, canvasSyncEmailConsent: { validator: booleanValidator }, canvasSyncPhoneConsent: { validator: booleanValidator }, enforceMFA: { validator: booleanValidator }, replyToEnduserTransactionalEmails: { validator: emailValidator }, customTermsOfService: { validator: stringValidator }, customPrivacyPolicy: { validator: stringValidator }, customPolicies: { validator: customPoliciesValidator }, customPoliciesVersion: { validator: stringValidator }, requireCustomTermsOnMagicLink: { validator: booleanValidator }, allowCreateSuborganizations: { validator: booleanValidator }, answersSyncToPortal: {
                validator: listValidatorOptionalOrEmptyOk(objectValidator({
                    id: stringValidator100,
                    questions: listValidatorEmptyOk(stringValidator1000),
                }))
            }, externalFormIdsToSync: { validator: listOfStringsValidatorOptionalOrEmptyOk }, analyticsIframes: {
                validator: listValidatorOptionalOrEmptyOk(objectValidator({
                    title: stringValidator1000,
                    iframeURL: stringValidator1000,
                }))
            }, defaultDoseSpotPharmacies: {
                validator: listValidatorOptionalOrEmptyOk(objectValidator({
                    id: stringValidator100,
                    name: stringValidator,
                }))
            }, groups: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, canvasURL: { validator: stringValidator }, observationInvalidationReasons: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, customNotificationTypes: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, customerIOFields: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, customerIOIdField: { validator: stringValidator }, hasConnectedPaubox: { validator: booleanValidator }, hasConnectedBridge: { validator: booleanValidator }, hasConnectedMDIntegrations: { validator: booleanValidator }, createEnduserForms: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk }, skipActivePatientBilling: { validator: booleanValidator }, portalV2SchemaURL: { validator: stringValidator } }),
    },
    databases: {
        info: {},
        constraints: {
            unique: ['title'],
            relationship: [],
        },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: stringValidator100,
                required: true,
                examples: ["Template Name"],
            }, fields: {
                required: true,
                validator: databaseFieldsValidator,
            }, numRecords: {
                readonly: true,
                validator: nonNegNumberValidator,
                initializer: function () { return 0; },
            }, 
            // organizationRead: { validator: booleanValidator },
            visibleForRoles: { validator: listOfStringsValidatorOptionalOrEmptyOk }, isReferralDatabase: { validator: booleanValidator } }),
    },
    database_records: {
        info: {},
        constraints: {
            unique: [],
            relationship: [],
            access: [{ type: 'dependency', foreignModel: 'databases', foreignField: '_id', accessField: 'databaseId' }]
        },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { databaseId: {
                validator: mongoIdStringValidator,
                required: true,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['databases'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, values: {
                required: true,
                validator: databaseRecordValuesValidator,
            } }),
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
                    evaluate: function (_a) {
                        var page = _a.page, disabled = _a.disabled;
                        if (page === 'Home' && disabled)
                            return 'Home page cannot be disabled';
                    }
                },
            ],
            access: []
        },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: { readMany: {} },
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: stringValidator1000,
                examples: ['Example Title']
            }, page: {
                validator: stringValidator100,
                required: true,
                examples: ['Home']
            }, blocks: {
                required: true,
                examples: [[]],
                validator: portalBlocksValidator,
            }, disabled: { validator: booleanValidator }, mobileBottomNavigationPosition: { validator: nonNegNumberValidator }, headerImageURL: { validator: stringValidator1000 }, iframeURL: { validator: stringValidator1000 }, iconURL: { validator: stringValidator1000 }, activeIconURL: { validator: stringValidator1000 }, showStripePortalLink: { validator: booleanValidator }, hideCancellatation: { validator: booleanValidator }, hideReschedule: { validator: booleanValidator }, hiddenEventTitles: { validator: listOfStringsValidatorEmptyOk }, hiddenFormIds: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk }, brandId: { validator: mongoIdStringValidator, examples: [PLACEHOLDER_ID] } }),
    },
    enduser_tasks: {
        info: {},
        constraints: {
            unique: [],
            relationship: [],
            access: []
        },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: { update: {}, read: {}, readMany: {} },
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: stringValidator1000,
                required: true,
                examples: ['Example Title']
            }, enduserId: {
                validator: mongoIdStringValidator,
                examples: [PLACEHOLDER_ID],
                required: true,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, completedAt: { validator: dateValidator }, description: { validator: stringValidator1000 } }),
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
        customActions: {},
        enduserActions: { read: {}, readMany: {} },
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: stringValidator1000,
                required: true,
                examples: ['Example Title']
            }, enduserId: {
                validator: mongoIdStringValidator,
                examples: [PLACEHOLDER_ID],
                required: true,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, description: {
                validator: stringValidator1000,
            }, eventIds: {
                validator: listOfMongoIdStringValidatorEmptyOk,
            }, journeyId: { validator: mongoIdStringValidator }, completedAt: { validator: dateOptionalOrEmptyStringValidator }, htmlDescription: { validator: stringValidator100000EmptyOkay }, hideRemainingTicketsProgress: { validator: booleanValidator }, highlightedEnduserFields: { validator: listOfStringsValidatorOptionalOrEmptyOk }, closeAutomaticallyByTicket: { validator: booleanValidator } }),
    },
    role_based_access_permissions: {
        info: {},
        constraints: {
            unique: ['role'],
            relationship: [
                {
                    explanation: "role can't be 'Admin'",
                    evaluate: function (_a, deps, _) {
                        var role = _a.role;
                        if (role === 'Admin')
                            return "role must not be 'Admin'";
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
        fields: __assign(__assign({}, BuiltInFields), { role: {
                validator: stringValidator250,
                required: true,
                examples: ["Role"],
            }, permissions: {
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
            }, uiRestrictions: { validator: userUIRestrictionsValidator } })
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
        fields: __assign(__assign({}, BuiltInFields), { dontRestrictRescheduleToOriginalHost: { validator: booleanValidator }, gtmTag: { validator: stringValidator100EscapeHTML }, archivedAt: { validator: dateOptionalOrEmptyStringValidator }, title: {
                validator: stringValidator100,
                required: true,
                examples: ["Appointment Booking Title"]
            }, calendarEventTemplateIds: {
                validator: listOfMongoIdStringValidator,
                required: true,
                examples: [[PLACEHOLDER_ID]]
            }, locationIds: {
                validator: listOfMongoIdStringValidatorEmptyOk,
                required: true,
                examples: [[PLACEHOLDER_ID]]
            }, terms: { validator: appointmentTermsValidator }, endDate: { validator: dateValidator }, startDate: { validator: dateValidator }, backgroundColor: { validator: stringValidator100 }, primaryColor: { validator: stringValidator100 }, secondaryColor: { validator: stringValidator100 }, intakeTitle: { validator: stringValidator1000 }, intakeDescription: { validator: stringValidator1000 }, thankYouRedirectURL: { validator: stringValidator1000 }, thankYouTitle: { validator: stringValidator1000 }, thankYouDescription: { validator: stringValidator1000 }, thankYouHeaderImageURL: { validator: stringValidator1000 }, thankYouMainImageURL: { validator: stringValidator1000 }, ga4measurementId: { validator: stringValidator100 }, hiddenFromPortal: { validator: booleanValidator }, hoursBeforeBookingAllowed: { validator: numberValidatorOptional }, limitedToCareTeam: { validator: booleanValidator }, limitedByState: { validator: booleanValidator }, limitedByTagsPortal: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, enableUserSelection: { validator: booleanValidator }, topLogo: { validator: stringValidator }, requireLocationSelection: { validator: booleanValidator }, fontFace: { validator: stringValidator }, fontFamily: { validator: stringValidator5000EmptyOkay }, fontURL: { validator: stringValidator }, collectReason: { validator: exactMatchValidator(['Do Not Collect', 'Optional', 'Required']) }, restrictionsByTemplate: { validator: bookingRestrictionsByTemplateValidator }, publicMulti: { validator: booleanValidator }, publicUserTags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, publicUserFilterTags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, appointmentSlotsMaxHeight: { validator: numberValidatorOptional }, includeRelatedContactTypes: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, calendarTitleText: { validator: stringValidator1000 }, emailFieldBehavior: { validator: exactMatchValidator(['required', 'optional', 'hidden']) }, language: { validator: stringValidator }, publicShowLanguage: { validator: booleanValidator } })
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
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: stringValidator100,
                required: true,
                examples: ["Appointment Booking Title"]
            }, address: { validator: stringValidator1000 }, city: { validator: stringValidator }, zipCode: { validator: stringValidator1000 }, phone: { validator: stringValidator }, state: { validator: stateValidator }, timezone: { validator: timezoneValidator }, canvasLocationId: { validator: stringValidator1000 }, canvasUseHostDefaultLocation: { validator: booleanValidator }, healthieContactType: { validator: stringValidator100 }, healthieLocationId: { validator: stringValidator100 }, healthieUseZoom: { validator: booleanValidator }, instructions: { validator: stringValidator5000EmptyOkay }, tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay } })
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
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: stringValidator100,
                required: true,
                examples: ["Product Title"]
            }, cost: {
                validator: costValidator,
                required: true,
                examples: [{ amount: 500, currency: 'USD' }],
            }, processor: {
                validator: paymentProcessorValidator,
                examples: ['Stripe'],
            }, description: { validator: stringValidator5000EmptyOkay }, htmlDescription: { validator: stringValidator25000EmptyOkay }, cptCode: { validator: billingCodeValidatorOptional }, image: { validator: stringValidator100000EmptyOkay }, showInPortal: { validator: booleanValidator }, categories: { validator: listOfStringsValidatorEmptyOk }, maxCheckoutCount: { validator: numberValidatorOptional }, stripeProductId: { validator: stringValidator100 }, stripeSubscriptionId: { validator: stringValidator100 }, stripePriceId: { validator: stringValidator100 }, additionalStripePriceIds: { validator: listOfStringsValidatorEmptyOk } })
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
                    priceIds: { validator: listOfStringsValidatorOptionalOrEmptyOk },
                    cost: { validator: costValidator },
                    stripeKey: { validator: stringValidator },
                    description: { validator: stringValidator },
                    subscriptionPriceId: { validator: stringValidatorOptional },
                },
                returns: {},
            },
        },
        enduserActions: { read: {}, readMany: {} },
        fields: __assign(__assign({}, BuiltInFields), { productId: {
                validator: mongoIdStringValidator,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['products'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'nop',
                    }]
            }, productIds: { validator: listOfStringsValidatorOptionalOrEmptyOk }, enduserId: {
                validator: mongoIdStringValidator,
                examples: [PLACEHOLDER_ID],
                required: true,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, title: {
                validator: stringValidator100,
                required: true,
                examples: ["Product Title"]
            }, cost: {
                validator: costValidator,
                required: true,
                examples: [{ amount: 500, currency: 'USD' }],
            }, processor: {
                validator: paymentProcessorValidator,
                required: true,
                examples: ['Stripe'],
            }, 
            // for timestamp of old/imported data processed before Tellescope
            processedAt: { validator: dateOptionalOrEmptyStringValidator }, description: { validator: stringValidator5000EmptyOkay }, refundedAmount: { validator: nonNegNumberValidator }, source: { validator: stringValidatorOptional }, externalId: { validator: stringValidator }, cptCode: { validator: billingCodeValidatorOptional }, notes: { validator: stringValidator5000EmptyOkay } })
    },
    purchase_credits: {
        info: {},
        constraints: { unique: [], relationship: [], },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { enduserId: {
                validator: mongoIdStringValidator,
                examples: [PLACEHOLDER_ID],
                required: true,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, title: {
                validator: stringValidator100,
                required: true,
                examples: ["Purchase Credit"]
            }, value: {
                validator: purchaseCreditValueValidator,
                required: true,
                examples: [{
                        type: "Credit",
                        info: { amount: 100, currency: "USD" },
                    }]
            }, usedAt: { validator: dateOptionalOrEmptyStringValidator, }, description: { validator: stringValidator5000EmptyOkay } })
    },
    phone_calls: {
        info: {
            description: ("\"to\" and \"from\" represent phone numbers. To represent the caller and callee, set userId and enduserId.\n\n{ \"isVoicemail\": true } indicates that an inbound call was not answered, but not necessarily that a full voicemail was left\nIf a voicemail is left, it is indicated by recordingURI, transcription, or recordingDurationInSeconds        \n")
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
                    os: { validator: exactMatchValidator(['ios', 'android']) },
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
                    report: { validator: objectAnyFieldsAnyValuesValidator, required: true }
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
                    report: { validator: objectAnyFieldsAnyValuesValidator, required: true }
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
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { markedUnreadForAll: { validator: booleanValidator }, inboxStatus: { validator: stringValidator100 }, enduserId: {
                validator: mongoIdStringValidator,
                examples: [PLACEHOLDER_ID],
                required: true,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, inbound: { validator: booleanValidator, required: true, examples: [true] }, externalId: { validator: stringValidator100 }, to: { validator: stringValidator100 }, from: { validator: stringValidator100 }, isVoicemail: { validator: booleanValidator }, recordingURI: { validator: stringValidator1000 }, recordingId: { validator: stringValidator100 }, transcriptionId: { validator: stringValidator100 }, recordingDurationInSeconds: { validator: nonNegNumberValidator }, transcription: { validator: stringValidator25000 }, recordingTranscriptionData: { validator: stringValidator25000 }, note: { validator: stringValidator5000EmptyOkay }, unread: { validator: booleanValidator }, userId: { validator: mongoIdStringValidator }, ticketId: { validator: mongoIdStringValidator }, pinnedAt: { validator: dateOptionalOrEmptyStringValidator }, readBy: { validator: idStringToDateValidator }, hiddenBy: { validator: idStringToDateValidator }, hiddenForAll: { validator: booleanValidator }, ticketIds: { validator: listOfStringsValidatorEmptyOk }, tags: { validator: listOfStringsValidatorOptionalOrEmptyOk }, assignedTo: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, callDurationInSeconds: { validator: numberValidator }, timestamp: { validator: dateValidator }, archivedAt: { validator: dateOptionalOrEmptyStringValidator }, trashedAt: { validator: dateOptionalOrEmptyStringValidator } }),
    },
    analytics_frames: {
        info: {},
        constraints: {
            unique: [],
            relationship: [
                {
                    explanation: 'Title is required when parentFrame is undefined',
                    evaluate: function (_a, _, session) {
                        var title = _a.title, parentFrame = _a.parentFrame;
                        if (!(title || parentFrame))
                            return "Title is required";
                    }
                },
            ],
        },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {
            update_indexes: {
                op: "custom", access: 'update', method: "patch",
                name: 'Update Indexes',
                path: '/analytics-frames/update-indexes',
                description: "Updates indexes for a number of analytics frames to adjust the default sorting",
                parameters: {
                    updates: { validator: indexUpdatesValidator, required: true },
                },
                returns: {},
            },
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
            custom_aggregation: {
                op: "custom", access: 'read', method: "post",
                name: 'Custom analytics aggregation',
                path: '/analytics/custom-aggregation',
                description: "Execute a custom MongoDB aggregation on a specified model for analytics",
                parameters: {
                    modelName: { validator: stringValidator, required: true },
                    aggregation: { validator: listOfObjectAnyFieldsAnyValuesValidator, required: true },
                },
                returns: { result: { validator: objectAnyFieldsAnyValuesValidator, required: true } }
            },
        },
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { createdAvailabilities: { validator: weeklyAvailabilitiesValidator }, title: {
                validator: stringValidator100,
                examples: ["Example Title"]
            }, query: {
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
            }, createdRange: { validator: dateRangeValidator }, updatedRange: { validator: dateRangeValidator }, parentFrame: {
                validator: mongoIdStringValidator,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['analytics_frames'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, type: { validator: analyticsFrameTypeValidator }, groupMin: { validator: nonNegNumberValidator }, groupMax: { validator: nonNegNumberValidator }, groupByCareTeam: { validator: booleanValidator }, displayType: { validator: stringValidator100 }, analyticsFrameGroupingCategory: { validator: analyticsFrameGroupingCategoriesValidator }, truncationLength: { validator: nonNegNumberValidator }, showEllipsis: { validator: booleanValidator }, orderedLabels: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, overrideGlobalRange: { validator: booleanValidator }, visibleForRoles: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, visibleForUserIds: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk }, tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay } }),
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
                returns: {}
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
                returns: {}
            },
        },
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { entity: { validator: availabilityEntitiesValidator, required: true, examples: ['organization'] }, entityId: {
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
            }, index: { validator: nonNegNumberValidator, required: true, examples: [30] }, dayOfWeekStartingSundayIndexedByZero: { validator: nonNegNumberValidator, required: true, examples: [30] }, startTimeInMinutes: { validator: nonNegNumberValidator, required: true, examples: [30] }, endTimeInMinutes: { validator: nonNegNumberValidator, required: true, examples: [30] }, active: { validator: dateRangeOptionalValidator }, source: { validator: stringValidator100 }, externalId: { validator: stringValidator100 }, typeId: { validator: stringValidator100 }, athenaDepartmentId: { validator: stringValidator100 } }),
    },
    enduser_views: {
        info: {},
        constraints: { unique: ['title'], relationship: [], },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: stringValidator100,
                required: true,
                examples: ["Custom View"]
            }, fields: {
                validator: listOfStringsValidator,
            }, filter: { validator: objectAnyFieldsAnyValuesValidator }, defaultForRole: { validator: stringValidator100 }, defaultForUserIds: { validator: listOfStringsValidatorOptionalOrEmptyOk }, hideFromRoles: { validator: listOfStringsValidatorEmptyOk }, hideProfileLink: { validator: booleanValidator }, customTypeId: { validator: mongoIdStringValidator }, style: { validator: objectAnyFieldsAnyValuesValidator }, sort: { validator: sortingFieldsValidator } })
    },
    enduser_profile_views: {
        info: {},
        constraints: { unique: ['title'], relationship: [], },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: stringValidator100,
                required: true,
                examples: ["Custom Profile View"]
            }, blocks: {
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
            }, showCompose: { validator: booleanValidator }, defaultForRoles: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, hiddenFromRoles: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, defaultForUserIds: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay } })
    },
    background_errors: {
        info: {},
        constraints: { unique: [], relationship: [], },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {
            mark_read: {
                op: "custom", access: 'update', method: "post",
                name: 'Mark Read',
                description: "Marks all background errors as read",
                path: '/background-errors/mark-read',
                adminOnly: true,
                parameters: {},
                returns: {},
            }
        },
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: stringValidator100,
                required: true,
                examples: ["Automation Error"]
            }, message: {
                validator: stringValidator25000,
                required: true,
                examples: ["Details relating to an automation error"]
            }, acknowledgedAt: { validator: dateOptionalOrEmptyStringValidator }, journeyId: { validator: mongoIdStringValidator }, enduserId: { validator: mongoIdStringValidator }, userId: { validator: mongoIdStringValidator } })
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
                        validator: listValidator(objectValidator({
                            action: objectAnyFieldsAnyValuesValidator,
                            automationTriggerId: mongoIdStringRequired,
                            enduserId: mongoIdStringRequired,
                            journeyContext: optionalAnyObjectValidator,
                        })),
                        required: true,
                    }
                },
                returns: {}
            },
        },
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: stringValidator100,
                required: true,
                examples: ["Automation Trigger"]
            }, event: {
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
            }, action: {
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
            }, status: {
                validator: automatioNTriggerStatusValidator,
                required: true,
                examples: ["Active"]
            }, enduserCondition: {
                validator: orValidator({
                    optional: optionalAnyObjectValidator,
                    included: objectAnyFieldsAnyValuesValidator,
                }, { isOptional: true })
            }, journeyId: {
                validator: mongoIdStringValidator,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['journeys'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, oncePerEnduser: { validator: booleanValidator }, 
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
            triggerNextAt: { validator: dateValidator }, tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, availabilityTimezone: { validator: timezoneValidator }, weeklyAvailabilities: { validator: weeklyAvailabilitiesValidator }, archivedAt: { validator: dateOptionalOrEmptyStringValidator } })
    },
    superbill_providers: {
        info: {},
        constraints: { unique: [], relationship: [], },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { address: {
                validator: addressValidator,
                required: true,
                examples: [{
                        city: 'city',
                        state: 'CA',
                        lineOne: 'address line one',
                        zipCode: '12345',
                    }]
            }, email: {
                validator: emailValidator,
                required: true,
                examples: ['example@tellescope.com']
            }, phone: {
                validator: stringValidator,
                required: true,
                examples: ['415-415-4155'],
            }, officeName: {
                validator: stringValidator,
                required: true,
                examples: ['office name'],
            }, taxId: {
                validator: stringValidator,
                required: true,
                examples: ['XX-XXXXXXX'],
            }, providerName: {
                validator: stringValidator,
                required: true,
                examples: ['provider name'],
            }, placeOfServiceCode: {
                validator: stringValidator,
                required: true,
                examples: ['17'],
            }, providerLicense: {
                validator: stringValidator,
                required: true,
                examples: ['17'],
            }, providerNPI: {
                validator: stringValidator,
                required: true,
                examples: ['17'],
            } })
    },
    superbills: {
        info: {},
        constraints: { unique: [], relationship: [], },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { enduserId: {
                validator: mongoIdStringValidator,
                examples: [PLACEHOLDER_ID],
                required: true,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, appointmentDate: {
                validator: dateValidator,
                required: true,
                examples: [new Date()]
            }, patient: {
                validator: superbillPatientInfoValidator,
                required: true,
                examples: [] // too lazy
            }, provider: {
                validator: superbillProviderInfoValidator,
                required: true,
                examples: [] // too lazy
            }, lineItems: {
                validator: superbillLineItemsValidator,
                required: true,
                examples: [] // too lazy
            } })
    },
    enduser_medications: {
        info: {},
        constraints: { unique: [], relationship: [], },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {
            create_scriptsure_order: {
                op: "custom", access: 'update', method: "post",
                path: "/enduser-medications/create-scriptsure-order",
                name: 'Create ScriptSure Order',
                description: "Creates a pending order in ScriptSure for a draft medication and returns the widget URL",
                parameters: {
                    id: { validator: mongoIdStringValidator, required: true },
                },
                returns: {
                    orderId: { validator: stringValidator },
                    sessionToken: { validator: stringValidator },
                    patientId: { validator: stringValidator },
                    widgetUrl: { validator: stringValidator },
                },
            },
        },
        enduserActions: {
            read: {}, readMany: {},
        },
        fields: __assign(__assign({}, BuiltInFields), { enduserId: {
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
            }, title: {
                required: true,
                validator: stringValidator,
                examples: ['Medication Name'],
            }, calendarEventId: { validator: mongoIdStringValidator }, prescribedBy: { validator: mongoIdStringValidator }, prescribedAt: { validator: dateOptionalOrEmptyStringValidator }, startedTakingAt: { validator: dateOptionalOrEmptyStringValidator }, stoppedTakingAt: { validator: dateOptionalOrEmptyStringValidator }, rxNormCode: { validator: stringValidator }, ndc: { validator: stringValidator100 }, fdbCode: { validator: stringValidator }, dispensing: {
                validator: objectValidator({
                    quantity: numberValidator,
                    unit: stringValidator,
                }),
            }, dosage: {
                validator: objectValidator({
                    value: stringValidator,
                    unit: stringValidator,
                    quantity: stringValidator,
                    frequency: stringValidator,
                    frequencyDescriptor: stringValidatorOptional,
                    description: stringValidatorOptional,
                }),
            }, source: { validator: stringValidator1000Optional }, externalId: { validator: stringValidator250 }, notes: { validator: stringValidator }, references: { validator: listOfRelatedRecordsValidator, readonly: true }, orderStatus: { validator: stringValidator1000 }, externalOrderId: { validator: stringValidator250 }, pharmacyName: { validator: stringValidator1000 }, prescriberName: { validator: stringValidator1000 }, reasonForTaking: { validator: stringValidator }, directions: { validator: stringValidator }, pharmacyId: { validator: stringValidator1000 }, status: { validator: stringValidator }, allergyNote: { validator: stringValidator1000 }, scriptSureDraft: {
                validator: optionalAnyObjectValidator,
            } })
    },
    phone_trees: {
        info: {},
        constraints: { unique: [], relationship: [], },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {
            start_outbound_call: {
                op: "custom", access: 'create', method: "post", path: "/phone-trees/start-outbound-call",
                name: 'Start Outbound Call',
                description: "Starts an phone call using the logic of an Outbound Phone Tree",
                parameters: {
                    treeId: { validator: mongoIdStringValidator, required: true },
                    enduserId: { validator: mongoIdStringValidator, required: true },
                    journeyId: { validator: mongoIdStringValidator, required: true },
                    automationStepId: { validator: mongoIdStringValidator, required: true },
                    journeyContext: { validator: optionalAnyObjectValidator },
                },
                returns: {}
            }
        },
        enduserActions: {
            read: {}, readMany: {},
        },
        fields: __assign(__assign({}, BuiltInFields), { title: { validator: stringValidator }, number: {
                required: true,
                validator: stringValidator,
                examples: ['+15555555555'],
            }, isActive: {
                required: true,
                validator: booleanValidator,
                examples: [true],
            }, nodes: {
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
            }, testEnduserIds: { validator: listOfStringsValidatorOptionalOrEmptyOk }, enduserCondition: { validator: phoneTreeEnduserConditionValidator }, bypassOOO: { validator: booleanValidator }, defaultEntityType: { validator: stringValidator100 }, tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, outboundNumber: { validator: stringValidator100, examples: ['+15555555555'] } })
    },
    enduser_custom_types: {
        info: {},
        constraints: { unique: [], relationship: [], },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {
            read: {}, readMany: {},
        },
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: stringValidator,
                required: true,
                examples: ["Title"]
            }, builtinFields: {
                validator: buildInFieldsValidator,
            }, customFields: {
                validator: customEnduserFieldsValidatorOptionalOrEmpty,
            } })
    },
    table_views: {
        info: {},
        constraints: { unique: [], relationship: [], },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: stringValidator,
                required: true,
                examples: ["Title"]
            }, page: {
                validator: stringValidator,
                required: true,
                examples: ["Title"]
            }, columns: {
                validator: tableViewColumnsValidator,
                required: true,
                examples: [[]],
            }, defaultForRoles: { validator: listOfStringsValidatorOptionalOrEmptyOk }, defaultForUserIds: { validator: listOfStringsValidatorOptionalOrEmptyOk }, filter: { validator: objectAnyFieldsAnyValuesValidator } })
    },
    email_sync_denials: {
        info: {},
        constraints: { unique: ['email'], relationship: [], },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { email: {
                validator: emailValidator,
                required: true,
                examples: ["test@test.com"]
            } })
    },
    ticket_threads: {
        info: {
            description: 'For Zendesk integration'
        },
        constraints: { unique: [], relationship: [], },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { enduserId: {
                validator: mongoIdStringValidator,
                required: true,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, source: { validator: stringValidator100, }, externalId: { validator: stringValidator100, }, subject: { validator: stringValidator1000 }, pinnedAt: { validator: dateOptionalOrEmptyStringValidator }, group: { validator: stringValidator250 }, assignedTo: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, references: { validator: listOfRelatedRecordsValidator, readonly: true }, tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay } })
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
        fields: __assign(__assign({}, BuiltInFields), { markedUnreadForAll: { validator: booleanValidator }, inboxStatus: { validator: stringValidator100 }, externalId: { validator: stringValidator100, }, source: { validator: stringValidator100, }, ticketThreadId: {
                validator: mongoIdStringValidator, required: true, examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['ticket_threads'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, externalThreadId: { validator: stringValidator100, }, public: { validator: booleanValidator, required: true, examples: [true] }, plaintext: { validator: stringValidator25000EmptyOkay }, html: { validator: stringValidator25000EmptyOkay }, type: { validator: stringValidator100, }, attachments: { validator: listOfChatAttachmentsValidator }, enduserId: { validator: mongoIdStringValidator }, userId: { validator: mongoIdStringValidator }, inbound: { validator: booleanValidator }, readBy: { validator: idStringToDateValidator }, hiddenBy: { validator: idStringToDateValidator }, hiddenForAll: { validator: booleanValidator }, ticketIds: { validator: listOfStringsValidatorEmptyOk }, group: { validator: stringValidator250 }, references: { validator: listOfRelatedRecordsValidator, readonly: true }, userDisplayName: { validator: stringValidator250 }, tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, assignedTo: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay } })
    },
    configurations: {
        info: {},
        constraints: { unique: [], relationship: [], access: [] },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { type: { validator: stringValidator250, examples: ['string'] }, value: { validator: stringValidator100000OptionalEmptyOkayEscapeHTML, examples: ['string'] } }),
    },
    time_tracks: {
        info: {},
        constraints: {
            unique: [],
            relationship: [],
            access: [
                { type: 'filter', field: 'userId' },
            ]
        },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: { validator: stringValidator, required: true, examples: ['Client Meeting'] }, userId: {
                validator: mongoIdStringValidator,
                examples: [PLACEHOLDER_ID],
                initializer: function (a, s) { return s.id; },
                dependencies: [{
                        dependsOn: ['users'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, enduserId: {
                validator: mongoIdStringOptional,
                examples: [PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'setNull',
                    }]
            }, timestamps: {
                validator: listValidatorOptionalOrEmptyOk(objectValidator({
                    type: stringValidator,
                    timestamp: dateValidator,
                })),
                initializer: function () { return [{ type: 'start', timestamp: new Date() }]; },
            }, closedAt: { validator: dateValidatorOptional }, totalDurationInMS: { validator: numberValidatorOptional } }),
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
        fields: __assign(__assign({}, BuiltInFields), { title: { validator: stringValidator, required: true, examples: ['Title'] }, userIds: { validator: listOfMongoIdStringValidatorEmptyOk, required: true, examples: [[PLACEHOLDER_ID]] }, type: { validator: stringValidator100 }, defaultFromNumber: { validator: stringValidatorOptional }, enduserFields: { validator: listOfStringsValidatorOptionalOrEmptyOk }, preventPull: { validator: listOfMongoIdStringValidatorEmptyOk }, overdueReminderUserId: { validator: mongoIdStringValidator } }),
    },
    ticket_templates: {
        info: {},
        constraints: {
            unique: ['title'],
            relationship: [],
            access: []
        },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: { validator: stringValidator250, required: true, examples: ['Template Title'] }, type: { validator: stringValidator100 }, stage: { validator: stringValidator100 }, priority: { validator: numberValidator }, tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, archivedAt: { validator: dateOptionalOrEmptyStringValidator } }),
    },
    group_mms_conversations: {
        info: {},
        constraints: {
            unique: [], relationship: [],
            access: [
                { type: 'filter', field: 'userIds' },
            ]
        },
        defaultActions: {
            // enable create for automated testing of inbox loading without having to send actual messages
            create: { warnings: ["Use start-conversation to create records"], },
            read: {}, readMany: {}, update: {}, delete: {}
        },
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
                    conversation: { validator: 'group_mms_conversations' },
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
                    logOnly: { validator: booleanValidatorOptional }
                },
                returns: {
                    conversation: { validator: 'group_mms_conversations' },
                }
            },
        },
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { markedUnreadForAll: { validator: booleanValidator }, inboxStatus: { validator: stringValidator100 }, userIds: { validator: listOfMongoIdStringValidatorEmptyOk, required: true, examples: [[PLACEHOLDER_ID]] }, enduserIds: { validator: listOfMongoIdStringValidatorEmptyOk, required: true, examples: [[PLACEHOLDER_ID]] }, externalId: { validator: stringValidator, readonly: true }, phoneNumber: { validator: stringValidator, readonly: true }, destinations: { validator: listOfStringsValidator, readonly: true }, title: { validator: stringValidator, readonly: true }, messages: { validator: mmsMessagesValidator, updatesDisabled: true, /* allows creating empty when testing while still broadly readonly */ }, userStates: { validator: groupMMSUserStatesValidator }, tags: { validator: listOfStringsValidatorEmptyOk }, suggestedReply: { validator: stringValidator5000EmptyOkay }, hiddenBy: { validator: idStringToDateValidator }, hiddenForAll: { validator: booleanValidator }, assignedTo: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, pinnedAt: { validator: dateOptionalOrEmptyStringValidator }, archivedAt: { validator: dateOptionalOrEmptyStringValidator }, trashedAt: { validator: dateOptionalOrEmptyStringValidator } }),
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
                    encounter: { validator: 'enduser_encounter', required: true },
                }
            },
        },
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { externalId: { validator: stringValidator100, examples: ['externalId'], readonly: true }, title: { validator: stringValidator, examples: ['Title'], required: true }, integration: { validator: exactMatchValidator([CANDID_TITLE]), examples: [CANDID_TITLE], readonly: true }, enduserId: {
                validator: mongoIdStringValidator,
                examples: [PLACEHOLDER_ID],
                required: true,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, providerUserId: { validator: mongoIdStringValidator, required: true, examples: [PLACEHOLDER_ID] }, authorizedRelease: { validator: booleanValidator, required: true, examples: [true] }, dateOfService: { validator: stringValidator, required: true, examples: ['MM-DD-YYYY'] }, diagnoses: { validator: diagnosesValidator, required: true, examples: [[{ type: 'LOI', code: "CODE_HERE" }]] }, placeOfServiceCode: { validator: stringValidator, required: true, examples: ['02', '11'] }, billingProviderAddress: { validator: addressValidator }, serviceFacilityAddress: { validator: addressValidator } })
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
                    tests: { validator: listValidatorOptionalOrEmptyOk(objectAnyFieldsAnyValuesValidator), required: true },
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
                    order: { validator: 'enduser_order', required: true },
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
                        validator: listValidatorOptionalOrEmptyOk(objectValidator({
                            marker_id: numberValidator,
                            question_id: numberValidator,
                            answer: stringValidator,
                        })),
                    }
                },
                returns: {
                    order: { validator: 'enduser_order', required: true },
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
                    order: { validator: 'enduser_order' },
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
                    Gender: { validator: stringValidator, required: true },
                    MedicalConditionText: { validator: stringValidator },
                },
                returns: {
                    order: { validator: 'enduser_order', required: true },
                }
            },
        },
        fields: __assign(__assign({}, BuiltInFields), { externalId: { validator: stringValidator100, examples: ['externalId'], required: true }, source: { validator: stringValidator100, examples: ['source'], required: true }, enduserId: {
                validator: mongoIdStringValidator,
                examples: [PLACEHOLDER_ID],
                required: true,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, userId: { validator: mongoIdStringValidator }, title: { validator: stringValidator, required: true, examples: ['title'] }, status: { validator: stringValidator, required: true, examples: ['status'] }, description: { validator: stringValidator1000 }, frequency: { validator: stringValidator100 }, items: { validator: listValidatorOptionalOrEmptyOk(objectValidator({
                    title: stringValidator,
                    tracking: stringValidatorOptional,
                })) }, tracking: { validator: stringValidatorOptional }, fill: { validator: stringValidatorOptional }, sku: { validator: stringValidatorOptional } })
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
        fields: __assign(__assign({}, BuiltInFields), { title: { validator: stringValidator, required: true, examples: ['Title'] }, unit: { validator: stringValidator100, required: true, examples: ['lb'] }, ranges: {
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
            }, mealStatus: { validator: exactMatchValidator(['Any', 'Before', 'After']) }, originalConfigurationId: { validator: mongoIdStringValidator }, enduserId: { validator: mongoIdStringValidator } }),
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
        fields: __assign(__assign({}, BuiltInFields), { phone: { validator: stringValidator, required: true, examples: ['+15555555555'] } }),
    },
    prescription_routes: {
        info: {},
        constraints: {
            unique: [], relationship: [],
            access: []
        },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: { validator: stringValidator105, required: true, examples: ['Title'] }, state: { validator: stateValidator, required: true, examples: ['CA'] }, templateIds: { validator: listOfStringsValidatorOptionalOrEmptyOk, examples: [['tmp_01GZMD9Q71W7T44812351V9QZN']] }, pharmacyId: { validator: stringValidator }, pharmacyLabel: { validator: stringValidator }, tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, source: { validator: stringValidator100, }, drugId: { validator: stringValidator }, ndc: { validator: stringValidator100 }, 
            // Compound-specific fields (for ScriptSure compound orders)
            compoundQuantity: { validator: nonNegNumberValidator }, compoundQuantityQualifier: { validator: stringValidator100 }, sig: { validator: stringValidator }, pharmacyNote: { validator: stringValidator210 }, controlledSubstance: { validator: exactMatchValidatorOptional(['0', '2', '3', '4', '5']) } }),
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
        fields: __assign(__assign({}, BuiltInFields), { externalId: { validator: stringValidator100, examples: ['externalId'] }, source: { validator: stringValidator100, examples: ['source'] }, enduserId: {
                validator: mongoIdStringValidator,
                examples: [PLACEHOLDER_ID],
                required: true,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, title: { validator: stringValidator, required: true, examples: ['title'] }, code: { validator: stringValidator100 }, codeset: { validator: stringValidator100 }, references: { validator: listOfRelatedRecordsValidator, updatesDisabled: true } })
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
        fields: __assign(__assign({}, BuiltInFields), { flowchartId: { validator: stringValidator100, required: true, examples: ['externalId'] }, note: { validator: stringValidator5000, required: true, examples: ['Note'] }, flowchartUI: { validator: flowchartUIValidator } })
    },
    webhook_logs: {
        info: { description: '' },
        constraints: { unique: [], relationship: [], access: [] },
        defaultActions: { readMany: {} },
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { payload: { validator: objectAnyFieldsAnyValuesValidator }, response: { validator: objectAnyFieldsAnyValuesValidator }, responseCode: { validator: numberValidator }, url: { validator: stringValidator } })
    },
    form_groups: {
        info: { description: '' },
        constraints: { unique: ['title'], relationship: [], access: [] },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: { read: {}, readMany: {} },
        fields: __assign(__assign({}, BuiltInFields), { title: { validator: stringValidator, required: true, examples: ['Title'] }, formIds: { validator: listOfMongoIdStringValidator, required: true, examples: [[PLACEHOLDER_ID]] } })
    },
    portal_brandings: {
        info: { description: '' },
        constraints: { unique: [], relationship: [], access: [] },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: { validator: stringValidator, required: true, examples: ['Title'] }, enduserField: { validator: stringValidator, required: true, examples: ['Title'] }, enduserValue: { validator: stringValidator, required: true, examples: ['Title'] }, primary: { validator: stringValidator }, secondary: { validator: stringValidator }, logoURL: { validator: stringValidator }, subdomain: { validator: stringValidator }, customPortalURL: { validator: stringValidator }, portalSettings: { validator: portalSettingsValidator }, portalV2SchemaURL: { validator: stringValidator } })
    },
    message_template_snippets: {
        info: { description: '' },
        constraints: { unique: ['key'], relationship: [], access: [] },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { key: { validator: stringValidator, required: true, examples: ['Unique Key'] }, value: { validator: stringValidator, required: true, examples: ['Value'] } })
    },
    fax_logs: {
        info: { description: '' },
        constraints: { unique: [], relationship: [], access: [] },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: { validator: stringValidator100, required: true, examples: ['Title'] }, externalId: { validator: stringValidator100, required: true, examples: ['external-uuid'] }, source: { validator: stringValidator100, required: true, examples: ['mFax'] }, fileId: { validator: mongoIdStringValidator, required: true, examples: [PLACEHOLDER_ID] }, from: { validator: stringValidator100, required: true, examples: ['+15555555555'] }, to: { validator: stringValidator100, required: true, examples: ['+15555555555'] }, inbound: { validator: booleanValidator, required: true, examples: [true] }, enduserId: { validator: mongoIdStringValidator }, userId: { validator: mongoIdStringValidator }, errorMessage: { validator: stringValidator }, tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay } })
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
                parameters: {},
                returns: {
                    queues: {
                        validator: listValidatorEmptyOk(objectValidator({
                            averageWaitTime: numberValidator,
                            currentSize: numberValidator,
                            friendlyName: stringValidator,
                        }))
                    }
                }
            },
        },
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: { validator: stringValidator, required: true, examples: ['Title'] }, userIds: { validator: listOfMongoIdStringValidatorEmptyOk, required: true, examples: [[PLACEHOLDER_ID]] } }),
    },
    suggested_contacts: {
        info: { description: '' },
        constraints: { unique: [], relationship: [], access: [] },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: { validator: stringValidator, required: true, examples: ['Title'] }, phone: { validator: phoneValidator, examples: ["+15555555555"] }, email: { validator: emailValidator, examples: ['test@tellescope.com'] } })
    },
    diagnosis_codes: {
        info: { description: '' },
        constraints: { unique: [], relationship: [], access: [] },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: { read: {}, readMany: {} },
        fields: __assign(__assign({}, BuiltInFields), { code: { validator: stringValidator, required: true, examples: ['A000'] }, display: { validator: stringValidator, required: true, examples: ["Cholera due to Vibrio cholerae 01, biovar cholerae"] }, system: { validator: stringValidator, required: true, examples: ['http://hl7.org/fhir/sid/icd-10-cm'] } })
    },
    allergy_codes: {
        info: { description: '' },
        constraints: { unique: [], relationship: [], access: [] },
        defaultActions: DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: { read: {}, readMany: {} },
        fields: __assign(__assign({}, BuiltInFields), { code: { validator: stringValidator, required: true, examples: ['6-2754'] }, display: { validator: stringValidator, required: true, examples: ["minocycline HCl"] }, system: { validator: stringValidator, required: true, examples: ['http://www.fdbhealth.com/'] } })
    },
    integration_logs: {
        info: { description: 'Read Only' },
        constraints: { unique: [], relationship: [], access: [] },
        defaultActions: { read: {}, readMany: {} },
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { integration: { validator: stringValidator, readonly: true, examples: ['Canvas'] }, status: { validator: exactMatchValidator(['Success', 'Error']), readonly: true, examples: ['Error'] }, type: { validator: stringValidator, readonly: true, examples: ['Patient Create'] }, payload: { validator: stringValidator, readonly: true, examples: ['{}'] }, response: { validator: stringValidator, readonly: true, examples: ['{}'] }, url: { validator: stringValidator, readonly: true, examples: ['https://www.tellescope.com'] } })
    },
    organization_payments: {
        info: { description: 'Read Only - Organization Payment Transaction Logs' },
        constraints: { unique: [['stripePaymentIntentId']], relationship: [], access: [] },
        defaultActions: { read: {}, readMany: {} },
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { amountInCents: { validator: nonNegNumberValidator, readonly: true, examples: [2500] }, type: { validator: stringValidator100, readonly: true, examples: ['ai_credits'] }, status: { validator: exactMatchValidator(['pending', 'completed', 'failed', 'refunded']), readonly: true, examples: ['completed'] }, stripePaymentIntentId: { validator: stringValidator, readonly: true, examples: ['pi_xxx'] }, stripeCheckoutSessionId: { validator: stringValidator, readonly: true, examples: ['cs_xxx'] }, userId: { validator: mongoIdStringValidator, readonly: true }, title: { validator: stringValidator, readonly: true, examples: ['AI Credits Purchase'] }, data: { validator: objectAnyFieldsAnyValuesValidator, readonly: true } })
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
                    insuranceType: { validator: stringValidator100, examples: ["Primary", "Secondary"] },
                    diagnoses: {
                        validator: developHealthDiagnosesValidator,
                        required: true,
                    },
                    drug_history: {
                        validator: objectValidator({
                            currently_taking_drugs: listValidatorOptionalOrEmptyOk(objectValidator({ name: stringValidator })),
                            previously_taken_drugs: listValidatorOptionalOrEmptyOk(objectValidator({ name: stringValidator })),
                        }),
                        required: true,
                    },
                    drugs: {
                        validator: developHealthDrugsValidator,
                        required: true,
                    },
                    use_patient_plan_fund_source_check: { validator: booleanValidator },
                    mock_result: { validator: developHealthMockResultValidator },
                },
                returns: {
                    result: { validator: 'enduser_eligibility_result', required: true },
                }
            }
        },
        enduserActions: {
            read: {}, readMany: {},
        },
        fields: __assign(__assign({}, BuiltInFields), { enduserId: {
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
            }, title: { validator: stringValidator, required: true, examples: ["Drug Name (20mg, x8)"] }, type: { validator: stringValidator250, required: true, examples: ["Prescription"] }, externalId: { validator: stringValidator250, required: true, examples: [PLACEHOLDER_ID] }, source: { validator: stringValidator250, required: true, examples: [DEVELOP_HEALTH_TITLE] }, status: { validator: stringValidator250, required: true, examples: ["Pending"] } })
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
        fields: __assign(__assign({}, BuiltInFields), { type: { validator: stringValidator, required: true, examples: ['Article'] }, title: { validator: stringValidator, required: true, examples: ['Article Title'] }, description: { validator: stringValidator, required: true, examples: ["Article Description"] }, url: { validator: stringValidator1000 }, content: { validator: stringValidator100000OptionalEmptyOkay, examples: ["Article Content"] }, source: { validator: stringValidator100 }, externalId: { validator: stringValidator100 }, pages: { validator: listOfStringsValidatorOptionalOrEmptyOk }, embedding: { validator: listValidator(numberValidator) } })
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
                    waitlist: { validator: 'waitlist', required: true },
                },
            },
        },
        fields: __assign(__assign({}, BuiltInFields), { title: { validator: stringValidator, required: true, examples: ['Title'] }, journeyId: { validator: mongoIdStringValidator, required: true, examples: [PLACEHOLDER_ID] }, enduserIds: { validator: listOfMongoIdStringValidatorEmptyOk, required: true, examples: [[PLACEHOLDER_ID]] }, tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay } })
    },
    ai_conversations: {
        info: { description: '' },
        constraints: { unique: [], relationship: [], access: [] },
        defaultActions: { create: {}, read: {}, readMany: {}, update: { disallowReplaceObjectFields: true } },
        customActions: {
            send_message: {
                op: "custom", access: 'create', method: "post",
                name: 'Send Message',
                path: '/ai-conversations/send-message',
                description: "Sends a message to the AI conversation. Use 'messages' for multi-turn conversations, or 'message' for a single user message. At least one of 'message' or 'messages' must be provided.",
                parameters: {
                    message: { validator: stringValidator25000 },
                    messages: { validator: listValidator(AIMessageInputValidator) },
                    type: { validator: stringValidator100 },
                    maxTokens: { validator: positiveNumberValidator },
                    conversationId: { validator: mongoIdStringValidator },
                    prompt: { validator: stringValidator25000 },
                    orchestrationId: { validator: stringValidatorOptional }, // optional ID to group multiple conversations as part of the same workflow
                },
                returns: {
                    ai_conversation: { validator: 'ai_conversation', required: true },
                },
            },
            generate_ai_decision: {
                op: "custom", access: 'create', method: "post",
                name: 'Generate AI Decision',
                path: '/ai-conversations/generate-ai-decision',
                description: "Generates a decision from the AI conversation and continues in Journey",
                parameters: {
                    enduserId: { validator: mongoIdStringValidator, required: true },
                    automationStepId: { validator: mongoIdStringValidator, required: true },
                    outcomes: { validator: listOfStringsValidator, required: true },
                    prompt: { validator: stringValidator5000, required: true },
                    sources: { validator: listValidator(AIDecisionSourceValidator), required: true },
                    journeyContext: { validator: journeyContextValidator },
                },
                returns: {},
            },
        },
        fields: __assign(__assign({}, BuiltInFields), { type: { validator: stringValidator, required: true, examples: ['HTML Template Generation'] }, modelName: { validator: stringValidator, required: true, examples: ['Claude Sonnet 4', 'Claude Sonnet 4.5'] }, orchestrationId: { validator: stringValidatorOptional, examples: ['workflow-123', 'batch-456'] }, messages: {
                validator: listValidatorEmptyOk(objectValidator({
                    role: exactMatchValidator(['user', 'assistant']),
                    text: stringValidator25000,
                    timestamp: dateValidator,
                    tokens: nonNegNumberValidator,
                    content: listValidatorOptionalOrEmptyOk(objectValidator({
                        type: exactMatchValidator(['text', 'image', 'file']),
                        text: stringValidatorOptional,
                    })),
                    userId: mongoIdStringOptional,
                    systemPrompt: stringValidator5000OptionalEmptyOkay,
                }))
            } })
    },
    inbox_threads: {
        info: { description: '' },
        constraints: { unique: [], relationship: [], access: [] },
        // we can't offer read defaults because they don't account for access permissions of each message channel
        // include create, createMany, and delete for easier automated testing
        defaultActions: { create: {}, createMany: {}, update: {}, delete: {} },
        customActions: {
            build_threads: {
                op: "custom", access: 'create', method: "post",
                name: 'Build Threads',
                path: '/inbox-threads/build',
                description: "Builds/hydrates InboxThreads for messages across different channels",
                parameters: {
                    from: { validator: dateValidatorOptional },
                    to: { validator: dateValidatorOptional },
                },
                returns: {
                    alreadyBuilt: { validator: booleanValidator, required: true },
                },
            },
            load_threads: {
                op: "custom", access: 'read', method: "get",
                name: 'Load Threads',
                path: '/inbox-threads/load',
                description: "Loads inbox threads with optional filtering",
                parameters: {
                    ids: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk },
                    excludeIds: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk },
                    limit: { validator: numberValidatorOptional },
                    lastTimestamp: { validator: dateValidatorOptional },
                    enduserIds: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk },
                    userIds: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk },
                    phoneNumber: { validator: phoneValidatorOptional },
                    returnCount: { validator: booleanValidatorOptional },
                    mdbFilter: { validator: objectAnyFieldsAnyValuesValidator },
                    sortBy: { validator: exactMatchValidatorOptional(['timestamp', 'outboundTimestamp']) },
                    autobuild: { validator: booleanValidatorOptional },
                },
                returns: {
                    threads: { validator: 'inbox_threads' },
                    count: { validator: numberValidatorOptional },
                },
            },
            reset_threads: {
                op: "custom", access: 'delete', method: "post",
                name: 'Reset Threads',
                path: '/inbox-threads/reset',
                description: "Deletes all built inbox threads and resets organization thread building dates",
                parameters: {},
                returns: {
                    deletedCount: { validator: numberValidator, required: true },
                },
            },
        },
        fields: __assign(__assign({}, BuiltInFields), { type: { validator: exactMatchValidator(['Chat', 'Email', 'GroupMMS', 'Phone', 'SMS']), required: true, examples: ['Email'] }, assignedTo: { validator: listOfMongoIdStringValidatorEmptyOk, required: true, examples: [[PLACEHOLDER_ID]] }, enduserIds: { validator: listOfMongoIdStringValidator, required: true, examples: [[PLACEHOLDER_ID]] }, userIds: { validator: listOfMongoIdStringValidatorEmptyOk, required: true, examples: [[PLACEHOLDER_ID]] }, inboxStatus: { validator: stringValidator, required: true, examples: ['In Progress'] }, preview: { validator: stringValidator25000, required: true, examples: ['Preview of the message'] }, threadId: { validator: stringValidator, required: true, examples: ['Thread ID'] }, timestamp: { validator: dateValidator, required: true, examples: [new Date().toISOString()] }, title: { validator: stringValidator, required: true, examples: ['Title or Subject Here'] }, tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, readBy: { validator: idStringToDateValidator }, outboundTimestamp: { validator: dateValidator }, outboundPreview: { validator: stringValidator25000 }, phoneNumber: { validator: phoneValidator }, enduserPhoneNumber: { validator: phoneValidator }, archivedAt: { validator: dateOptionalOrEmptyStringValidator }, trashedAt: { validator: dateOptionalOrEmptyStringValidator }, recentOutboundUserId: { validator: mongoIdStringOptional }, recentInboundEnduserId: { validator: mongoIdStringOptional }, draftMessageIds: {
                validator: listOfMongoIdStringValidatorOptionalOrEmptyOk,
                dependencies: [{
                        dependsOn: ['chats', 'sms_messages', 'emails'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'pull',
                    }]
            }, scheduledMessageIds: {
                validator: listOfMongoIdStringValidatorOptionalOrEmptyOk,
                dependencies: [{
                        dependsOn: ['chats', 'sms_messages', 'emails'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'pull',
                    }]
            } })
    }
});
// export type SchemaType = typeof schema
// export type SchemaV1 = SchemaType// & Schema
//# sourceMappingURL=schema.js.map