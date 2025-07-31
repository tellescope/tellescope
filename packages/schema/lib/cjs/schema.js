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
exports.schema = exports.build_schema = exports.UNIQUE_LIST_FIELDS = exports.get_next_reminder_timestamp_for_ticket = void 0;
var types_models_1 = require("@tellescope/types-models");
var validation_1 = require("@tellescope/validation");
var constants_1 = require("@tellescope/constants");
var get_next_reminder_timestamp_for_ticket = function (_a) {
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
exports.get_next_reminder_timestamp_for_ticket = get_next_reminder_timestamp_for_ticket;
exports.UNIQUE_LIST_FIELDS = ['assignedTo', 'tags', 'closeReasons'];
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
        validator: validation_1.mongoIdValidator,
        readonly: true,
    },
    businessId: {
        validator: validation_1.mongoIdStringRequired,
        readonly: true,
    },
    organizationIds: {
        validator: validation_1.listOfMongoIdStringValidatorEmptyOk,
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
        validator: validation_1.sharedWithOrganizationIdsValidator,
    },
    creator: {
        validator: validation_1.mongoIdStringRequired,
        readonly: true,
    },
    updatedAt: {
        validator: validation_1.dateValidator,
        readonly: true,
    },
};
var build_schema = function (schema) { return schema; };
exports.build_schema = build_schema;
exports.schema = (0, exports.build_schema)({
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
                        if (session.type === constants_1.USER_SESSION_TYPE)
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
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        enduserActions: {
            read: {}, readMany: {},
            logout: {}, refresh_session: {}, update: {}, current_session_info: {},
            add_to_journey: {}, remove_from_journey: {}, begin_login_flow: {}, set_password: {},
            unsubscribe: {},
        },
        fields: __assign(__assign({}, BuiltInFields), { recentViewers: { validator: validation_1.recentViewersValidator }, healthie_dietitian_id: { validator: validation_1.stringValidator100 }, mergedIds: { validator: validation_1.listOfMongoIdStringValidatorOptionalOrEmptyOk, readonly: true, redactions: ['enduser'] }, externalId: {
                validator: validation_1.stringValidator250,
                examples: ['addfed3e-ddea-415b-b52b-df820c944dbb'],
            }, email: {
                validator: validation_1.emailValidatorEmptyOkay,
                examples: ['test@tellescope.com'],
                redactions: ['enduser'],
            }, unsubscribedFromMarketing: { validator: validation_1.booleanValidator }, alternateEmails: { validator: (0, validation_1.listValidatorOptionalOrEmptyOk)(validation_1.emailValidator), redactions: ['enduser'] }, alternatePhones: { validator: validation_1.listOfStringsValidatorEmptyOk, redactions: ['enduser'] }, emailConsent: {
                validator: validation_1.booleanValidator,
                examples: BOOLEAN_EXAMPLES,
                initializer: function (e) { return !!e.email; },
                redactions: ['enduser'],
            }, phone: {
                validator: validation_1.phoneValidatorOptional,
                examples: ['+14155555555'],
                redactions: ['enduser'],
            }, landline: {
                validator: validation_1.phoneValidatorOptional,
                examples: ['+14155555555'],
                redactions: ['enduser'],
            }, phoneConsent: {
                validator: validation_1.booleanValidator,
                examples: BOOLEAN_EXAMPLES,
                initializer: function (e) { return !!e.phone; },
                redactions: ['enduser'],
            }, hashedPassword: {
                validator: validation_1.stringValidator100,
                readonly: true,
                redactions: ['all'],
            }, fname: {
                validator: validation_1.nameValidator,
                redactions: ['enduser'],
            }, mname: { validator: validation_1.nameValidator, redactions: ['enduser'], }, lname: {
                validator: validation_1.nameValidator,
                redactions: ['enduser'],
            }, suffix: {
                validator: validation_1.stringValidator100,
                redactions: ['enduser'],
            }, dateOfBirth: {
                validator: validation_1.stringValidator250,
                redactions: ['enduser'],
            }, journeys: {
                validator: validation_1.journeysValidator,
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
            }, scheduledJourneys: { validator: validation_1.scheduledJourneysValidator }, tags: {
                redactions: ['enduser'],
                validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay,
            }, accessTags: {
                redactions: ['enduser'],
                validator: validation_1.listOfStringsValidatorEmptyOk,
            }, unredactedTags: {
                validator: validation_1.listOfStringsValidatorEmptyOk,
            }, fields: {
                redactions: ['enduser'],
                validator: validation_1.fieldsValidator,
            }, unredactedFields: {
                validator: validation_1.fieldsValidator,
            }, preference: {
                redactions: ['enduser'],
                validator: validation_1.preferenceValidator,
            }, assignedTo: {
                redactions: ['enduser'],
                validator: validation_1.listOfUniqueStringsValidatorEmptyOk,
            }, primaryAssignee: {
                validator: validation_1.mongoIdStringRequired,
                redactions: ['enduser'],
            }, unread: {
                redactions: ['enduser'],
                validator: validation_1.booleanValidator,
            }, lastActive: {
                validator: validation_1.dateValidator,
            }, lastLogout: { validator: validation_1.dateValidator }, termsSigned: { validator: validation_1.dateValidator }, termsVersion: { validator: validation_1.stringValidator100 }, lastCommunication: {
                redactions: ['enduser'],
                validator: validation_1.dateValidator,
            }, avatar: {
                validator: validation_1.stringValidator1000,
                dependencies: [
                    {
                        dependsOn: ['files'],
                        dependencyField: 'secureName',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'unset',
                    },
                ]
            }, 
            // should allow any gender via API but our UI can limit to Tellescope types by default
            gender: { validator: validation_1.stringValidator, redactions: ['enduser'] }, genderIdentity: { validator: validation_1.stringValidator100, redactions: ['enduser'] }, pronouns: { validator: validation_1.stringValidator100, redactions: ['enduser'] }, height: { validator: validation_1.genericUnitWithQuantityValidator, redactions: ['enduser'] }, weight: { validator: validation_1.genericUnitWithQuantityValidator, redactions: ['enduser'] }, source: { validator: validation_1.stringValidator1000Optional }, addressLineOne: { validator: validation_1.stringValidator5000EmptyOkay, redactions: ['enduser'] }, addressLineTwo: { validator: validation_1.stringValidator5000EmptyOkay, redactions: ['enduser'] }, city: { validator: validation_1.stringValidator5000EmptyOkay, redactions: ['enduser'] }, state: { validator: validation_1.stateValidator, redactions: ['enduser'] }, zipCode: { validator: validation_1.stringValidator25000EmptyOkay, redactions: ['enduser'] }, zipPlusFour: { validator: validation_1.stringValidator100, redactions: ['enduser'] }, timezone: { validator: validation_1.timezoneValidator }, humanReadableId: { validator: validation_1.stringValidator100 }, displayName: { validator: validation_1.stringValidator250 }, unsubscribedFromPortalChatNotifications: { validator: validation_1.booleanValidator }, triggeredEvents: { validator: (0, validation_1.objectAnyFieldsValidator)(validation_1.numberValidator) }, customTypeId: { validator: validation_1.mongoIdStringRequired }, language: { validator: validation_1.languageValidator }, relationships: {
                validator: (0, validation_1.listValidatorOptionalOrEmptyOk)((0, validation_1.objectValidator)({
                    id: validation_1.mongoIdStringRequired,
                    type: validation_1.stringValidator100,
                }))
            }, markedReadAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, markedUnreadAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, note: { validator: validation_1.stringValidator25000EmptyOkay, redactions: ['enduser'] }, insurance: { validator: validation_1.insuranceOptionalValidator, redactions: ['enduser'] }, insuranceSecondary: { validator: validation_1.insuranceOptionalValidator, redactions: ['enduser'] }, bookingNotes: {
                validator: (0, validation_1.listValidatorOptionalOrEmptyOk)((0, validation_1.objectValidator)({
                    bookingPageId: validation_1.mongoIdStringRequired,
                    note: validation_1.stringValidator5000EmptyOkay,
                })),
                redactions: ['enduser'],
            }, devices: {
                validator: (0, validation_1.listValidatorOptionalOrEmptyOk)((0, validation_1.objectValidator)({
                    title: validation_1.stringValidatorOptional,
                    id: validation_1.stringValidatorOptional,
                    gatewayId: validation_1.stringValidatorOptional,
                    disabled: validation_1.booleanValidatorOptional,
                    archivedAt: validation_1.dateValidatorOptional,
                })),
                redactions: ['enduser'],
            }, references: { validator: validation_1.listOfRelatedRecordsValidator, updatesDisabled: true, redactions: ['enduser'] }, athenaDepartmentId: { validator: validation_1.stringValidator100, redactions: ['enduser'] }, athenaPracticeId: { validator: validation_1.stringValidator100, redactions: ['enduser'] }, salesforceId: { validator: validation_1.stringValidator100, redactions: ['enduser'] }, vitalTriggersDisabled: { validator: validation_1.booleanValidator }, defaultFromPhone: { validator: validation_1.phoneValidator, redactions: ['enduser'] }, defaultFromEmail: { validator: validation_1.emailValidator, redactions: ['enduser'] }, useDefaultFromEmailInAutomations: { validator: validation_1.booleanValidator }, useDefaultFromPhoneInAutomations: { validator: validation_1.booleanValidator }, stripeCustomerId: { validator: validation_1.stringValidator100, redactions: ['enduser'] }, stripeKey: { validator: validation_1.stringValidator250, redactions: ['enduser'] }, diagnoses: {
                validator: (0, validation_1.listValidatorOptionalOrEmptyOk)(validation_1.enduserDiagnosisValidator),
                redactions: ['enduser']
            }, unsubscribedFromPhones: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay, redactions: ['enduser'] }, lockedFromPortal: { validator: validation_1.booleanValidator } }),
        customActions: {
            rename_stored_custom_fields: {
                op: "custom", access: 'update', method: "patch",
                name: 'Rename Custom Field',
                path: '/endusers/rename-stored-custom-field',
                description: "Rename a stored custom field for every Enduser",
                parameters: {
                    existingName: { validator: validation_1.stringValidator, required: true },
                    newName: { validator: validation_1.stringValidator, required: true },
                },
                returns: {},
            },
            customer_io_sync: {
                op: "custom", access: 'update', method: "post",
                name: 'Identify or Track via customer.io',
                path: '/customer-io/sync',
                description: "Identify or Track via customer.io",
                parameters: {
                    enduserIds: { validator: validation_1.listOfMongoIdStringValidator, required: true },
                    event: { validator: validation_1.stringValidator },
                    trackProperties: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk },
                },
                returns: {},
            },
            add_to_healthie_course: {
                op: "custom", access: 'update', method: "post",
                name: 'Add to Healthie Course (Program)',
                path: '/endusers/add-to-healthie-course',
                description: "Proxy for updateCourse mutation to add Enduser to Healthie Course",
                parameters: {
                    id: { validator: validation_1.mongoIdStringRequired, required: true },
                    courseId: { validator: validation_1.stringValidator100, required: true },
                },
                returns: {},
            },
            check_eligibility: {
                op: "custom", access: 'update', method: "post",
                name: 'Check Eligibility',
                path: '/endusers/check-eligibility',
                description: "Checks insurance eligibility via Candid or Canvas integration",
                parameters: {
                    id: { validator: validation_1.mongoIdStringRequired, required: true },
                    integration: { validator: validation_1.stringValidator },
                    clearinghouse: { validator: validation_1.stringValidator },
                    insuranceType: { validator: (0, validation_1.exactMatchValidator)(['Primary', 'Secondary']) },
                    reCheck: { validator: validation_1.booleanValidatorOptional },
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
                    enduserIds: { validator: validation_1.listOfMongoIdStringValidator, required: true },
                    journeyId: { validator: validation_1.mongoIdStringRequired, required: true },
                    automationStepId: { validator: validation_1.mongoIdStringRequired },
                    journeyContext: { validator: validation_1.journeyContextValidator },
                    throttle: { validator: validation_1.booleanValidatorOptional },
                    source: { validator: validation_1.stringValidatorOptional },
                    startAt: { validator: validation_1.dateValidatorOptional },
                },
                returns: {}
            },
            remove_from_journey: {
                op: "custom", access: 'update', method: "post",
                name: 'Remove from Journey',
                path: '/remove-endusers-from-journey',
                description: "Removes enduser(s) from in a journey",
                parameters: {
                    enduserIds: { validator: validation_1.listOfMongoIdStringValidator, required: true },
                    journeyId: { validator: validation_1.mongoIdStringRequired, required: true },
                },
                returns: {}
            },
            set_password: {
                op: "custom", access: 'update', method: "post",
                name: 'Set enduser password',
                path: '/set-enduser-password',
                description: "Sets (or resets) an enduser's password. Minimum length 8 characters. When called by enduser, can only be used to set initial password.",
                parameters: {
                    id: { validator: validation_1.mongoIdStringRequired, required: true },
                    password: { validator: validation_1.stringValidator100, required: true },
                },
                returns: {} //authToken: { validator: stringValidator5000 } },
            },
            is_authenticated: {
                op: "custom", access: 'read', method: "get",
                name: 'Check enduser authentication',
                path: '/enduser-is-authenticated',
                description: "Checks the validity of an enduser's authToken",
                parameters: {
                    id: { validator: validation_1.mongoIdStringRequired },
                    authToken: { validator: validation_1.stringValidator5000, required: true },
                },
                returns: {
                    isAuthenticated: { validator: validation_1.booleanValidator, required: true },
                    enduser: { validator: 'enduser' },
                } // todo: add enduser eventually, when validator defined
            },
            refresh_session: {
                op: "custom", access: 'update', method: "post",
                name: 'Refresh enduser authentication',
                path: '/refresh-enduser-session',
                description: "When called by an authenticated enduser, generates a new session",
                parameters: {
                    invalidatePreviousToken: { validator: validation_1.booleanValidator },
                },
                enduserOnly: true,
                returns: {
                    authToken: { validator: validation_1.stringValidator, required: true },
                    enduser: { validator: 'enduser', required: true },
                } // todo: add enduser eventually, when validator defined
            },
            generate_auth_token: {
                op: "custom", access: 'read', method: "get",
                name: 'Generate authToken',
                path: '/generate-enduser-auth-token',
                description: "Generates an authToken for use by an enduser. Useful for integrating a 3rd-party authentication process or creating a session for an enduser without a set password in Tellescope.",
                parameters: {
                    id: { validator: validation_1.mongoIdStringRequired },
                    externalId: { validator: validation_1.stringValidator250 },
                    email: { validator: validation_1.emailValidator },
                    phone: { validator: validation_1.phoneValidator },
                    durationInSeconds: { validator: validation_1.nonNegNumberValidator },
                    overrideOTP: { validator: validation_1.booleanValidatorOptional },
                    overrideConsent: { validator: validation_1.booleanValidatorOptional },
                },
                returns: {
                    authToken: { validator: validation_1.stringValidator100, required: true },
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
                    sourceEnduserId: { validator: validation_1.mongoIdStringRequired, required: true },
                    destinationEnduserId: { validator: validation_1.mongoIdStringRequired, required: true },
                },
                returns: {},
            },
            push: {
                op: "custom", access: 'update', method: "post",
                name: 'Push',
                path: '/endusers/push',
                description: "Pushes (upserts) using some integrations, like Photon Health",
                parameters: {
                    enduserId: { validator: validation_1.mongoIdStringRequired, required: true },
                    destinations: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk, },
                    externalIds: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk, },
                    entrypoint: { validator: validation_1.stringValidator },
                },
                returns: {
                    fullscriptRedirectURL: { validator: validation_1.stringValidator },
                    vital_user_id: { validator: validation_1.stringValidator },
                },
            },
            bulk_update: {
                op: "custom", access: 'update', method: "patch",
                name: 'Bulk Updates',
                path: '/endusers/bulk-update',
                description: "Updates custom fields across a batch of endusers at once",
                parameters: {
                    ids: { validator: validation_1.listOfMongoIdStringValidator, required: true },
                    primaryAssignee: { validator: validation_1.mongoIdStringRequired },
                    fields: { validator: validation_1.fieldsValidator },
                    pushTags: { validator: validation_1.listOfStringsValidator },
                    replaceTags: { validator: validation_1.listOfStringsValidator },
                    customTypeId: { validator: validation_1.stringValidator },
                    updateAccessTags: { validator: validation_1.booleanValidator },
                    state: { validator: validation_1.stateValidator },
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
                    customTypeId: { validator: validation_1.mongoIdStringRequired },
                    addIds: { validator: validation_1.listOfMongoIdStringValidator },
                    removeIds: { validator: validation_1.listOfMongoIdStringValidator },
                    field: { validator: validation_1.stringValidator },
                    existingFieldValue: { validator: validation_1.stringValidator },
                    existingAssignment: { validator: validation_1.listOfStringsWithQualifierValidatorOptional },
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
                    minimumRelationshipsCount: { validator: validation_1.numberValidator },
                },
                returns: {
                    report: { validator: (0, validation_1.listValidator)((0, validation_1.objectValidator)({ enduserId: validation_1.stringValidator, count: validation_1.numberValidator })), required: true }
                },
            },
            get_report: {
                op: "custom", access: 'read', method: "get",
                name: 'Report',
                path: '/endusers/report',
                description: "Builds a report",
                parameters: {
                    queries: { validator: validation_1.endusersReportQueriesValidator, required: true },
                    activeSince: { validator: validation_1.dateValidator, },
                    customTypeId: { validator: validation_1.stringValidator100 },
                    range: { validator: validation_1.dateRangeOptionalValidator },
                    // mmddyyyyRangeField: { validator: stringValidator },
                    fields: {
                        validator: (0, validation_1.listValidatorEmptyOk)((0, validation_1.objectValidator)({ field: validation_1.stringValidator, value: validation_1.stringValidator }))
                    }
                },
                returns: {
                    report: { validator: validation_1.objectAnyFieldsAnyValuesValidator, required: true }
                },
            },
            get_engagement_statistics: {
                op: "custom", access: 'read', method: "get",
                name: 'Get Engagement Statistics',
                path: '/endusers/engagement',
                description: "Gets the number of active endusers over a period of time (only includes chats if enduserId is set). Uses default entity only by default",
                parameters: {
                    formIds: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk },
                    range: { validator: validation_1.dateRangeOptionalValidator },
                    customTypeId: { validator: validation_1.mongoIdStringOptional },
                    enduserFields: {
                        validator: (0, validation_1.listValidatorEmptyOk)((0, validation_1.objectValidator)({ field: validation_1.stringValidator, value: validation_1.stringValidator }))
                    },
                    endusersFilter: { validator: validation_1.objectAnyFieldsAnyValuesValidator },
                    groupBy: { validator: validation_1.stringValidator },
                    includeLinkClicks: { validator: validation_1.booleanValidator },
                },
                returns: {
                    count: { validator: validation_1.numberValidator, required: true },
                    grouped: { validator: validation_1.objectAnyFieldsAnyValuesValidator, },
                },
            },
            get_engagement_statistics_by_userId: {
                op: "custom", access: 'read', method: "get",
                name: 'Get Engagement Statistics',
                path: '/endusers/engagement-by-userid',
                description: "Gets the number of active endusers over a period of time (only includes chats if enduserId is set). Uses default entity only by default. Groups by userId as submitter of form responses or recipient of messages.",
                parameters: {
                    formIds: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk },
                    range: { validator: validation_1.dateRangeOptionalValidator },
                    customTypeId: { validator: validation_1.mongoIdStringOptional },
                    enduserFields: {
                        validator: (0, validation_1.listValidatorEmptyOk)((0, validation_1.objectValidator)({ field: validation_1.stringValidator, value: validation_1.stringValidator }))
                    },
                    endusersFilter: { validator: validation_1.objectAnyFieldsAnyValuesValidator },
                    includeLinkClicks: { validator: validation_1.booleanValidator },
                },
                returns: {
                    count: { validator: validation_1.numberValidator, required: true },
                    grouped: { validator: validation_1.objectAnyFieldsAnyValuesValidator, },
                },
            },
            sync_zendesk: {
                op: 'custom', access: 'read', method: 'post',
                path: '/endusers/sync-zendesk',
                name: 'Sync historical Zendesk tickets for a given enduser',
                description: "",
                parameters: { enduserId: { validator: validation_1.mongoIdStringRequired, required: true } },
                returns: {}
            },
            get_journeys_report: {
                op: 'custom', access: 'read', method: 'post',
                path: '/endusers/journeys-report',
                name: 'Get journeys report',
                description: "",
                parameters: { journeyId: { validator: validation_1.mongoIdStringRequired } },
                returns: {
                    report: { validator: validation_1.objectAnyFieldsAnyValuesValidator, required: true }
                }
            },
            dosespot: {
                op: 'custom', access: 'read', method: 'post',
                path: '/endusers/dosespot',
                name: 'Open in DoseSpot',
                description: "Upserts patient to DoseSpot and opens a deep-link in DoseSpot",
                parameters: { enduserId: { validator: validation_1.mongoIdStringRequired } },
                returns: { link: { validator: validation_1.stringValidator } }
            },
            load_inbox_data: {
                op: 'custom', access: 'read', method: 'get',
                path: '/endusers/load-inbox-data',
                name: 'Load Inbox Data',
                description: "Loads data for displaying on the inbox",
                parameters: {
                    limit: { validator: validation_1.nonNegNumberValidator },
                    userId: { validator: validation_1.mongoIdStringRequired },
                    inboxStatuses: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk },
                    lastEmailId: { validator: validation_1.mongoIdStringRequired },
                    lastChatRoomId: { validator: validation_1.mongoIdStringRequired },
                    lastSMSId: { validator: validation_1.mongoIdStringRequired },
                    lastGroupMMSId: { validator: validation_1.mongoIdStringRequired },
                    lastPhoneCallId: { validator: validation_1.mongoIdStringRequired },
                    lastTicketThreadCommentId: { validator: validation_1.mongoIdStringRequired },
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
                    businessId: { validator: validation_1.mongoIdStringRequired, required: true, },
                    organizationIds: { validator: validation_1.listOfMongoIdStringValidatorEmptyOk },
                    phone: { validator: validation_1.phoneValidator },
                    email: { validator: validation_1.emailValidator },
                    redir: { validator: validation_1.stringValidator },
                },
                returns: {
                    result: { validator: validation_1.loginFlowResultValidator, required: true },
                    otpToken: { validator: validation_1.stringValidator, required: true },
                    email: { validator: validation_1.emailValidator },
                },
            },
            login: {
                op: "custom", access: 'read', method: "post",
                name: 'Login enduser',
                path: '/login-enduser',
                description: "Generates an authentication token for access to enduser-facing endpoints",
                enduserOnly: true,
                parameters: {
                    businessId: { validator: validation_1.mongoIdStringRequired, required: true, },
                    organizationIds: { validator: validation_1.listOfMongoIdStringValidatorEmptyOk },
                    id: { validator: validation_1.mongoIdStringRequired },
                    phone: { validator: validation_1.phoneValidator },
                    email: { validator: validation_1.emailValidator },
                    password: { validator: validation_1.stringValidator100, required: true },
                    durationInSeconds: { validator: validation_1.nonNegNumberValidator },
                },
                returns: { authToken: { validator: validation_1.stringValidator5000 } },
            },
            register: {
                op: "custom", access: 'create', method: "post",
                name: 'Register as Enduser',
                path: '/register-as-enduser',
                description: "Allows and enduser to register directly with an email and password",
                parameters: {
                    businessId: { validator: validation_1.mongoIdStringRequired, required: true, },
                    organizationIds: { validator: validation_1.listOfMongoIdStringValidatorEmptyOk },
                    email: { validator: validation_1.emailValidator, required: true },
                    password: { validator: validation_1.stringValidator100, required: true },
                    fname: { validator: validation_1.nameValidator },
                    lname: { validator: validation_1.nameValidator },
                    emailConsent: { validator: validation_1.booleanValidator },
                    termsSigned: { validator: validation_1.dateValidator },
                    termsVersion: { validator: validation_1.stringValidator100 },
                },
                returns: {} //authToken: { validator: stringValidator5000 } },
            },
            request_password_reset: {
                op: "custom", access: 'update', method: "post",
                name: 'Request Password Reset',
                path: '/request-enduser-password-reset',
                description: "Sends a password reset email",
                parameters: {
                    email: { validator: validation_1.emailValidator, required: true },
                    businessId: { validator: validation_1.mongoIdStringRequired, required: true, },
                    organizationIds: { validator: validation_1.listOfMongoIdStringValidatorEmptyOk },
                },
                returns: {},
            },
            reset_password: {
                op: "custom", access: 'update', method: "post",
                name: 'Reset Password',
                path: '/reset-enduser-password',
                description: "For a code generated by request-enduser-password-reset, sets a new password",
                parameters: {
                    resetToken: { validator: validation_1.stringValidator250, required: true },
                    newPassword: { validator: validation_1.passwordValidator, required: true },
                    businessId: { validator: validation_1.mongoIdStringRequired, required: true, },
                    organizationIds: { validator: validation_1.listOfMongoIdStringValidatorEmptyOk },
                },
                returns: {},
            },
            unsubscribe: {
                op: "custom", access: 'update', method: "post",
                name: 'Unsubscribe Enduser',
                path: '/unsubscribe-enduser',
                description: "Unsubscribes an enduser from one or more types of notifications",
                parameters: {
                    enduserId: { validator: validation_1.mongoIdStringRequired, required: true },
                    unsubscribeFrom: { validator: validation_1.listOfStringsValidator, required: true },
                },
                returns: {},
            },
            get_otp_methods: {
                op: "custom", access: 'read', method: "get",
                name: 'Get OTP Methods',
                path: '/endusers/otp-methods',
                description: "Gets a list of possible OTP methods (e.g. email or sms) to refresh a given enduser session token",
                parameters: {
                    token: { validator: validation_1.stringValidator, required: true },
                },
                returns: {
                    methods: { validator: validation_1.listOfStringsValidator, required: true },
                },
            },
            send_otp: {
                op: "custom", access: 'create', method: "post",
                name: 'Send OTP Code',
                path: '/endusers/send-otp-code',
                description: "Sends a otp code for a given method (e.g. email or sms)",
                parameters: {
                    token: { validator: validation_1.stringValidator, required: true },
                    method: { validator: validation_1.stringValidator, required: true },
                },
                returns: {},
            },
            verify_otp: {
                op: "custom", access: 'create', method: "post",
                name: 'Verify Code',
                path: '/endusers/verify-otp-code',
                description: "For a valid OTP code, returns an enduser session",
                parameters: {
                    token: { validator: validation_1.stringValidator, required: true },
                    code: { validator: validation_1.stringValidator, required: true },
                },
                returns: {
                    authToken: { validator: validation_1.stringValidator, required: true },
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
                validator: validation_1.mongoIdStringRequired,
                examples: [constants_1.PLACEHOLDER_ID],
                required: true,
                dependencies: [{
                        dependsOn: ['journeys'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, enduserId: {
                validator: validation_1.mongoIdStringRequired,
                examples: [constants_1.PLACEHOLDER_ID],
                required: true,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, status: {
                required: true,
                validator: validation_1.stringValidator250,
                examples: ["Status"]
            } }),
        constraints: { unique: [], relationship: [], access: [] },
        defaultActions: { create: {}, createMany: {}, read: {}, readMany: {}, delete: {} },
        customActions: {},
    },
    api_keys: {
        info: {},
        fields: __assign(__assign({}, BuiltInFields), { hashedKey: {
                validator: validation_1.stringValidator,
                readonly: true,
            } }),
        constraints: { unique: [], relationship: [], access: [{ type: constants_1.CREATOR_ONLY_ACCESS }] },
        defaultActions: { read: {}, readMany: {}, delete: {} },
        customActions: {
            create: {
                op: 'create', access: 'create',
                name: 'Generate ApiKey',
                description: "Generates and returns a new ApiKey. The returned key is not stored in Tellescope and cannot be retrieved later.",
                parameters: {},
                returns: {
                    id: {
                        validator: validation_1.mongoIdStringRequired,
                    },
                    key: {
                        validator: validation_1.stringValidator,
                    }
                }
            }
        }
    },
    integrations: {
        info: {},
        constraints: {
            unique: [], relationship: [], access: [{ type: constants_1.CREATOR_ONLY_ACCESS }]
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        enduserActions: { proxy_read: {} },
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: validation_1.stringValidator100,
                required: true,
                examples: ["Integration Title"]
            }, authentication: {
                validator: validation_1.integrationAuthenticationsValidator,
                required: true,
                examples: [
                    {
                        type: 'oauth2',
                        info: {}
                    }
                ]
            }, pushHistoricalEvents: { validator: validation_1.booleanValidator }, syncCareTeam: { validator: validation_1.booleanValidator }, syncAsActive: { validator: validation_1.booleanValidator }, requirePhoneToPushEnduser: { validator: validation_1.booleanValidator }, lastSync: { validator: validation_1.nonNegNumberValidator }, emailDisabled: { validator: validation_1.booleanValidator }, syncUnrecognizedSenders: { validator: validation_1.booleanValidator }, createEndusersForUnrecognizedSenders: { validator: validation_1.booleanValidator }, calendars: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk }, environment: { validator: validation_1.stringValidator100 }, webhooksSecret: { validator: validation_1.stringValidator }, shouldCreateNotifications: { validator: validation_1.booleanValidator }, disableEnduserAutoSync: { validator: validation_1.booleanValidator }, disableTicketAutoSync: { validator: validation_1.booleanValidator }, redactExternalEvents: { validator: validation_1.booleanValidator }, syncEnduserFiles: { validator: validation_1.booleanValidator }, pushCalendarDetails: { validator: validation_1.booleanValidator }, defaultAttendeeId: { validator: validation_1.mongoIdStringRequired }, sendEmailOnSync: { validator: validation_1.booleanValidator }, enduserFieldMapping: { validator: validation_1.fieldMappingsValidator }, default_dietitian_id: { validator: validation_1.stringValidator100 }, dontPushCalendarEvent: { validator: validation_1.booleanValidator }, dontPullCalendarEvent: { validator: validation_1.booleanValidator }, pushAddedTags: { validator: validation_1.booleanValidator }, pushRemovedTags: { validator: validation_1.booleanValidator }, overwriteAddress: { validator: validation_1.booleanValidator }, syncEnduserId: { validator: validation_1.booleanValidator }, shardId: { validator: validation_1.stringValidator100 } }),
        customActions: {
            update_zoom: {
                adminOnly: true,
                op: 'custom', access: 'create', method: 'post',
                path: '/integrations/zoom-configuration',
                name: 'Creates (include clientId, clientSecret) or removes a Zoom configuration',
                description: "",
                parameters: {
                    clientId: { validator: validation_1.stringValidator },
                    clientSecret: { validator: validation_1.stringValidator },
                },
                returns: {}
            },
            proxy_read: {
                op: 'custom', access: 'read', method: 'get',
                path: '/integrations/proxy-read',
                name: 'Proxies a request for a given integration and returns the result',
                description: "",
                parameters: {
                    integration: { validator: validation_1.stringValidator, required: true },
                    type: { validator: validation_1.stringValidator, required: true },
                    id: { validator: validation_1.stringValidator },
                    query: { validator: validation_1.stringValidator },
                },
                returns: {
                    data: { validator: validation_1.optionalAnyObjectValidator, required: true },
                }
            },
            proxy_write: {
                op: 'custom', access: 'update', method: 'post',
                path: '/integrations/proxy-write',
                name: 'Proxies a write request to a given integration and returns the result',
                description: "",
                parameters: {
                    integration: { validator: validation_1.stringValidator, required: true },
                    type: { validator: validation_1.stringValidator, required: true },
                    query: { validator: validation_1.objectAnyFieldsAnyValuesValidator },
                    id: { validator: validation_1.stringValidator },
                },
                returns: {
                    data: { validator: validation_1.optionalAnyObjectValidator, required: true },
                }
            },
            generate_google_auth_url: {
                op: 'custom', access: 'create', method: 'post',
                path: '/generate-google-auth-url',
                name: 'Generates a link to create a Google integration with Tellescope',
                description: "",
                parameters: {
                    calendarOnly: { validator: validation_1.booleanValidatorOptional },
                },
                returns: { authUrl: { validator: validation_1.stringValidator, required: true }, }
            },
            disconnect_google_integration: {
                op: 'custom', access: 'create', method: 'post',
                path: '/generate-square-auth-url',
                name: 'Generates a link to create a Square integration with Tellescope',
                description: "", parameters: {},
                returns: { authUrl: { validator: validation_1.stringValidator, required: true }, }
            },
            generate_oauth2_auth_url: {
                op: 'custom', access: 'create', method: 'post',
                path: '/generate-oauth2-auth-url',
                description: "",
                parameters: { integration: { validator: validation_1.integrationTitleValidator, } },
                returns: {
                    authUrl: { validator: validation_1.stringValidator, required: true },
                    state: { validator: validation_1.stringValidator, required: true },
                }
            },
            disconnect_oauth2_integration: {
                op: 'custom', access: 'delete', method: 'post',
                path: '/disconnect-oauth2-integration',
                name: 'Disconnects an integration with Square',
                description: "",
                parameters: { integration: { validator: validation_1.integrationTitleValidator } },
                returns: {}
            },
            refresh_oauth2_session: {
                op: 'custom', access: 'create', method: 'post',
                path: '/refresh-oauth2-session',
                name: 'Uses a refresh_token to refresh a session and return the result',
                description: "",
                parameters: { title: { validator: validation_1.stringValidator100, required: true } },
                returns: {
                    access_token: { validator: validation_1.stringValidator100, required: true },
                    expiry_date: { validator: validation_1.numberValidator, required: true },
                },
            },
            connect_stripe: {
                op: 'custom', access: 'create', method: 'post',
                path: '/connect-stripe',
                name: 'Begin Stripe integration via Connect',
                description: "",
                parameters: {
                    accountId: { validator: validation_1.stringValidator100 },
                    countryCode: { validator: (0, validation_1.exactMatchValidator)(['US', 'GB']) }
                },
                returns: {
                    accountLinkUrl: { validator: validation_1.stringValidator, required: true },
                    accountId: { validator: validation_1.stringValidator, required: true },
                }
            },
            connect_photon: {
                op: 'custom', access: 'create', method: 'post',
                path: '/integrations/connect-photon',
                name: 'Connect Photon Health',
                description: "",
                parameters: {
                    organizationId: { validator: validation_1.stringValidator100, required: true },
                    clientId: { validator: validation_1.stringValidator100, required: true },
                    clientSecret: { validator: validation_1.stringValidator100, required: true },
                    environment: { validator: validation_1.stringValidator },
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
                    clientId: { validator: validation_1.stringValidator100, required: true },
                    clientSecret: { validator: validation_1.stringValidator100, required: true },
                    environment: { validator: validation_1.stringValidator },
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
                    adminAPIKey: { validator: validation_1.stringValidator, required: true },
                    apiKeyEmail: { validator: validation_1.emailValidator, required: true },
                    clientId: { validator: validation_1.stringValidator, required: true },
                    clientSecret: { validator: validation_1.stringValidator, required: true },
                    subdomain: { validator: validation_1.stringValidator, required: true },
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
                    API_KEY: { validator: validation_1.stringValidator, required: true },
                    integration: { validator: validation_1.stringValidator, required: true },
                    environment: { validator: validation_1.stringValidator },
                    externalId: { validator: validation_1.stringValidator },
                    webhooksSecret: { validator: validation_1.stringValidator },
                    fields: { validator: validation_1.objectAnyFieldsAnyValuesValidator },
                    scope: { validator: validation_1.stringValidator },
                },
                returns: { integration: { validator: 'integration' } }
            },
            remove_api_key_integration: {
                op: 'custom', access: 'delete', method: 'delete',
                path: '/integrations/remove-api-key',
                name: 'Remove an API-Key based integration',
                description: "",
                parameters: {
                    integration: { validator: validation_1.stringValidator, required: true },
                    externalId: { validator: validation_1.stringValidator },
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
                    integration: { validator: validation_1.stringValidator },
                    offset: { validator: validation_1.nonNegNumberValidator },
                    limit: { validator: validation_1.nonNegNumberValidator },
                    query: { validator: validation_1.stringValidator },
                    next_page_token: { validator: validation_1.stringValidator },
                },
                returns: {
                    choices: {
                        validator: (0, validation_1.listValidator)((0, validation_1.objectValidator)({ name: validation_1.stringValidator, id: validation_1.stringValidator })),
                        required: true,
                    },
                    next_page_token: { validator: validation_1.stringValidator }
                },
            },
        }
    },
    engagement_events: {
        info: {},
        fields: __assign(__assign({}, BuiltInFields), { enduserId: {
                validator: validation_1.mongoIdStringRequired,
                required: true,
                updatesDisabled: true,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, type: {
                validator: validation_1.stringValidator100,
                required: true,
                examples: ['Test']
            }, significance: {
                validator: validation_1.nonNegNumberValidator,
                required: true,
                examples: [1]
            }, timestamp: {
                validator: validation_1.dateValidator,
                initializer: function () { return new Date(); },
            }, fields: {
                validator: validation_1.fieldsValidator,
            } }),
        constraints: { unique: [], relationship: [] },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        enduserActions: { create: {}, createMany: {}, read: {}, readMany: {} },
        customActions: {},
    },
    journeys: {
        info: {},
        fields: __assign(__assign({}, BuiltInFields), { archivedAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, title: {
                validator: validation_1.stringValidator100,
                required: true,
                examples: ['Test']
            }, defaultState: {
                validator: validation_1.stringValidator100,
                initializer: function (j) { var _a, _b; return (j.defaultState || ((_b = (_a = j.states) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.name) || 'New'); },
            }, description: {
                validator: validation_1.stringValidator1000,
            }, states: {
                validator: validation_1.journeyStatesValidator,
                initializer: function (j) { return j.defaultState
                    ? [{ name: j.defaultState, priority: "N/A" }]
                    : [{ name: 'New', priority: "N/A" }]; }
            }, onIncomingEnduserCommunication: {
                validator: (0, validation_1.exactMatchValidator)(['Remove', ''])
            }, tags: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk } }),
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
        defaultActions: __assign(__assign({}, constants_1.DEFAULT_OPERATIONS), { create: {
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
                    id: { validator: validation_1.mongoIdStringRequired, required: true },
                    states: { validator: validation_1.listOfStringsValidator, required: true },
                },
                returns: { updated: 'journey' },
            },
            handle_incoming_communication: {
                op: 'custom', access: 'update', method: "post",
                name: 'Handle Incoming Communication',
                path: '/journeys/handle-incoming-communication',
                description: "Handles removing endusers from relevant journeys and provides other automation on an incoming communication",
                parameters: {
                    enduserId: { validator: validation_1.mongoIdStringRequired, required: true },
                    channel: { validator: validation_1.stringValidator },
                    destination: { validator: validation_1.stringValidator },
                    messageId: { validator: validation_1.mongoIdStringOptional },
                },
                returns: {},
            },
            get_journey_statistics: {
                op: 'custom', access: 'read', method: "get",
                name: 'Handle Incoming Communication',
                path: '/journeys/statistics',
                description: "Gets statistics for a journey",
                parameters: {
                    journeyId: { validator: validation_1.mongoIdStringRequired, required: true },
                },
                returns: {
                    // todo: document shape with validator
                    statistics: { validator: validation_1.objectAnyFieldsAnyValuesValidator }
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
        fields: __assign(__assign({}, BuiltInFields), { hiddenFromTimeline: { validator: validation_1.booleanValidator }, copyOf: { validator: validation_1.mongoIdStringRequired }, relatedContactId: { validator: validation_1.mongoIdStringRequired }, markedUnreadForAll: { validator: validation_1.booleanValidator }, inboxStatus: { validator: validation_1.stringValidator100 }, logOnly: {
                validator: validation_1.booleanValidator,
                examples: [true],
                initializer: function () { return false; },
            }, enduserId: {
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, userId: {
                validator: validation_1.mongoIdStringRequired,
                examples: [constants_1.PLACEHOLDER_ID],
                initializer: function (a, s) { return s.id; },
            }, subject: {
                validator: validation_1.stringValidator,
                required: true,
                examples: ["Email Subject"],
            }, textContent: {
                validator: validation_1.stringValidator100000EmptyOkay,
                required: true,
                examples: ["Hi there, this is Sebastian"],
            }, HTMLContent: {
                validator: validation_1.stringValidator100000EmptyOkay,
            }, timestamp: {
                validator: validation_1.dateValidator,
                initializer: function () { return new Date(); },
            }, delivered: {
                validator: validation_1.booleanValidator,
                readonly: true,
                initializer: function (s) { return !!s.logOnly; }
            }, replyTo: {
                validator: validation_1.stringValidator,
                initializer: function () { return null; },
            }, threadId: {
                validator: validation_1.stringValidator,
                initializer: function (s) { var _a; return (_a = s.replyTo) !== null && _a !== void 0 ? _a : ''; },
                readonly: true,
            }, source: {
                validator: validation_1.emailValidator,
                readonly: true,
            }, openedAt: {
                validator: validation_1.dateValidator,
                readonly: true,
            }, linkOpens: {
                validator: validation_1.numberToDateValidator,
                readonly: true,
                examples: [{ 0: new Date() }]
            }, messageId: {
                validator: validation_1.stringValidator,
                readonly: true,
            }, inbound: {
                validator: validation_1.booleanValidator,
                initializer: function () { return false; },
            }, textEncoding: {
                validator: validation_1.emailEncodingValidator,
                readonly: true,
            }, htmlEncoding: {
                validator: validation_1.emailEncodingValidator,
                readonly: true,
            }, s3id: {
                validator: validation_1.stringValidator250,
                readonly: true,
            }, readBy: { validator: validation_1.idStringToDateValidator }, hiddenBy: { validator: validation_1.idStringToDateValidator }, hiddenForAll: { validator: validation_1.booleanValidator }, templateId: { validator: validation_1.mongoIdStringRequired }, automationStepId: { validator: validation_1.mongoIdStringRequired }, linkOpenTrackingIds: {
                validator: validation_1.listOfStringsValidatorEmptyOk,
                initializer: function () { return []; },
            }, journeyContext: { validator: validation_1.journeyContextValidator }, sendAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, pinnedAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, isDraft: { validator: validation_1.booleanValidator }, cc: { validator: validation_1.listOfStringsValidatorEmptyOk }, fromEmailOverride: { validator: validation_1.stringValidator100 }, ticketIds: { validator: validation_1.listOfStringsValidatorEmptyOk }, alternateToAddress: { validator: validation_1.emailValidator }, suggestedReply: { validator: validation_1.stringValidator5000EmptyOkay }, tags: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk }, batchId: { validator: validation_1.stringValidator250 }, isMarketing: { validator: validation_1.booleanValidator }, assignedTo: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, canvasId: { validator: validation_1.stringValidator100 }, discussionRoomId: { validator: validation_1.mongoIdStringRequired }, journeyId: { validator: validation_1.mongoIdStringRequired }, calendarEventId: { validator: validation_1.mongoIdStringRequired } }),
        customActions: {
            sync_integrations: {
                op: "custom", access: 'read', method: "post",
                name: 'Sync Integrations',
                path: '/sync-email-integrations',
                description: "Syncs email with external integrations (like Gmail) and returns any newly created messages",
                parameters: {
                    enduserEmail: { validator: validation_1.emailValidator, required: true },
                    allUsers: { validator: validation_1.booleanValidator },
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
                    senderId: { validator: validation_1.stringValidator, required: true },
                    message: { validator: validation_1.stringValidator100000EmptyOkay, required: true },
                    replyId: { validator: validation_1.stringValidator1000Optional },
                    cc: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk },
                },
                returns: {
                    id: { validator: validation_1.mongoIdStringRequired, required: true },
                    conversationId: { validator: validation_1.mongoIdStringRequired, required: true },
                    timestamp: { validator: validation_1.stringValidator100, required: true },
                }
            },
            deliver_via_iterable: {
                op: "custom", access: 'create', method: "post",
                name: 'Send Email via Iterable',
                path: '/emails/deliver-via-iterable',
                description: "Sends an email via Iterable",
                parameters: {
                    recipientEmail: { validator: validation_1.emailValidator, required: true },
                    campaignId: { validator: validation_1.stringValidator, required: true },
                },
                returns: {}
            },
            send_with_template: {
                op: "custom", access: 'create', method: "post",
                name: 'Send Email via Template',
                path: '/emails/send-with-template',
                description: "Sends an email for a specific template on behalf of a user (senderId is user.id)",
                parameters: {
                    enduserId: { validator: validation_1.mongoIdStringRequired, required: true },
                    senderId: { validator: validation_1.mongoIdStringRequired, required: true },
                    templateId: { validator: validation_1.mongoIdStringRequired, required: true },
                },
                returns: { email: { validator: 'email' } }
            },
            get_template_report: {
                op: "custom", access: 'read', method: "get",
                name: 'Template Report',
                path: '/emails/template-report',
                description: "Builds a report showing Email details by template",
                parameters: {
                    range: { validator: validation_1.dateRangeOptionalValidator },
                },
                returns: {
                    report: { validator: validation_1.objectAnyFieldsAnyValuesValidator, required: true }
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
                    businessId: { validator: validation_1.mongoIdStringRequired, required: true },
                    fname: { validator: validation_1.nameValidator, required: true },
                    lname: { validator: validation_1.nameValidator, required: true },
                    phone: { validator: validation_1.phoneValidator, required: true },
                    message: { validator: validation_1.stringValidator5000, required: true },
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
                    enduserId: { validator: validation_1.mongoIdStringRequired, required: true },
                    senderId: { validator: validation_1.mongoIdStringRequired, required: true },
                    templateId: { validator: validation_1.mongoIdStringRequired, required: true },
                    fromNumber: { validator: validation_1.phoneValidator },
                },
                returns: { sms: { validator: 'sms_message' } }
            },
            send_message_as_user_notification: {
                op: "custom", access: 'create', method: "post",
                name: 'Send Message as User Notification',
                path: '/sms-messages/send-message-as-user-notification',
                description: "Sends an SMS message as a user notification (e.g. for an upcoming calendar event)",
                parameters: {
                    to: { validator: validation_1.phoneValidator, required: true },
                    message: { validator: validation_1.stringValidator5000, required: true },
                },
                returns: { sms: { validator: 'sms_message' } }
            },
            get_number_report: {
                op: "custom", access: 'read', method: "get",
                name: 'Number Report',
                path: '/sms-messages/number-report',
                description: "Builds a report showing sms details by organization and user phone numbers",
                parameters: {
                    range: { validator: validation_1.dateRangeOptionalValidator },
                },
                returns: {
                    report: { validator: validation_1.objectAnyFieldsAnyValuesValidator, required: true }
                },
            },
            get_template_report: {
                op: "custom", access: 'read', method: "get",
                name: 'Template Report',
                path: '/sms-messages/template-report',
                description: "Builds a report showing sms details by template",
                parameters: {
                    range: { validator: validation_1.dateRangeOptionalValidator },
                },
                returns: {
                    report: { validator: validation_1.objectAnyFieldsAnyValuesValidator, required: true }
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
                    message: { validator: validation_1.stringValidator5000, required: true },
                    to: { validator: validation_1.phoneValidator, required: true }
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
        fields: __assign(__assign({}, BuiltInFields), { hiddenFromTimeline: { validator: validation_1.booleanValidator }, copyOf: { validator: validation_1.mongoIdStringRequired }, relatedContactId: { validator: validation_1.mongoIdStringRequired }, autoResolveToFrom: { validator: validation_1.booleanValidator }, markedUnreadForAll: { validator: validation_1.booleanValidator }, inboxStatus: { validator: validation_1.stringValidator100 }, logOnly: {
                validator: validation_1.booleanValidator,
                examples: [true],
                initializer: function () { return false; },
            }, templatedMessage: { validator: validation_1.stringValidator5000EmptyOkay }, message: {
                validator: validation_1.SMSMessageValidator,
                required: true,
                examples: ["Test message"],
                // updates should be allowed for drafts / unsent messages
                // updatesDisabled: true
            }, linkOpens: {
                validator: validation_1.numberToDateValidator,
                readonly: true,
                examples: [{ 0: new Date() }]
            }, enduserId: {
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
                // allow updates to support moving across profiles
                // updatesDisabled: true
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, userId: {
                validator: validation_1.mongoIdStringRequired,
                initializer: function (a, s) { return s.id; },
                dependencies: [{
                        dependsOn: ['users'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'setNull',
                    }]
            }, inbound: {
                validator: validation_1.booleanValidator,
                initializer: function () { return false; },
            }, newThread: {
                validator: validation_1.booleanValidator,
                updatesDisabled: true,
            }, delivered: {
                validator: validation_1.booleanValidator,
                readonly: true,
                initializer: function (s) { return !!s.logOnly; }
            }, internalMessageId: {
                validator: validation_1.stringValidator250,
                readonly: true,
            }, readBy: { validator: validation_1.idStringToDateValidator }, hiddenBy: { validator: validation_1.idStringToDateValidator }, hiddenForAll: { validator: validation_1.booleanValidator }, templateId: { validator: validation_1.mongoIdStringRequired }, automationStepId: { validator: validation_1.mongoIdStringRequired }, linkOpenTrackingIds: {
                validator: validation_1.listOfStringsValidatorEmptyOk,
                initializer: function () { return []; },
            }, journeyContext: { validator: validation_1.journeyContextValidator }, sendAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, pinnedAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, isDraft: { validator: validation_1.booleanValidator }, timestamp: { validator: validation_1.dateValidator }, ticketIds: { validator: validation_1.listOfStringsValidatorEmptyOk }, suggestedReply: { validator: validation_1.stringValidator5000EmptyOkay }, phoneNumber: { validator: validation_1.stringValidatorOptionalEmptyOkay }, enduserPhoneNumber: { validator: validation_1.phoneValidator }, tags: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk }, batchId: { validator: validation_1.stringValidator250 }, assignedTo: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, canvasId: { validator: validation_1.stringValidator100 }, discussionRoomId: { validator: validation_1.mongoIdStringRequired }, journeyId: { validator: validation_1.mongoIdStringRequired }, calendarEventId: { validator: validation_1.mongoIdStringRequired }, mediaURLs: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay } }),
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
        fields: __assign(__assign({}, BuiltInFields), { markedUnreadForAll: { validator: validation_1.booleanValidator }, inboxStatus: { validator: validation_1.stringValidator100 }, journeyId: { validator: validation_1.mongoIdStringRequired }, assignedTo: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, title: {
                validator: validation_1.stringValidator100,
            }, numMessages: {
                validator: validation_1.nonNegNumberValidator,
                initializer: function () { return 0; },
            }, recentMessageSentAt: {
                validator: validation_1.nonNegNumberValidator,
            }, type: {
                validator: validation_1.chatRoomTypeValidator,
                initializer: function () { return 'internal'; }
            }, topic: {
                validator: validation_1.stringValidator5000, // long to support MP use case / custom topics
            }, topicId: {
                validator: validation_1.stringValidator100,
            }, description: {
                validator: validation_1.stringValidator250,
            }, userIds: {
                validator: validation_1.listOfMongoIdStringValidatorEmptyOk,
                examples: [[constants_1.PLACEHOLDER_ID]],
                // required: true, // no longer required
                // add pull dependency for user deletion?
            }, enduserIds: {
                validator: validation_1.listOfMongoIdStringValidatorEmptyOk,
                // add pull dependency for enduser deletion?
            }, recentEnduserMessage: {
                validator: validation_1.stringValidator,
                readonly: true,
            }, recentMessage: {
                validator: validation_1.stringValidator,
                initializer: function () { return ''; },
                readonly: true,
            }, recentSender: {
                validator: validation_1.mongoIdStringRequired,
                initializer: function () { return ''; },
                readonly: true,
            }, ticketId: {
                validator: validation_1.mongoIdStringRequired,
            }, endedAt: {
                validator: validation_1.dateValidator,
            }, tags: {
                validator: validation_1.listOfStringsValidatorEmptyOk,
            }, infoForUser: {
                validator: validation_1.chatRoomUserInfoValidator,
            }, aboutEnduserId: {
                validator: validation_1.mongoIdStringRequired,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, pinnedAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, fields: { validator: validation_1.fieldsValidator }, suggestedReply: { validator: validation_1.stringValidator5000EmptyOkay }, discussionRoomId: { validator: validation_1.mongoIdStringRequired }, identifier: { validator: validation_1.stringValidator100 }, externalId: { validator: validation_1.stringValidator100 }, source: { validator: validation_1.stringValidator100 } }),
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        enduserActions: { create: {}, read: {}, readMany: {}, display_info: {}, mark_read: {} },
        customActions: {
            join_room: {
                op: "custom", access: 'update', method: "post",
                name: 'Join chat room',
                path: '/join-chat-room',
                description: "Allows a user to join a chat room with no other users, for use in accepting support chats.",
                parameters: { id: { validator: validation_1.mongoIdStringRequired, required: true } },
                returns: {
                    room: { validator: 'Room' },
                } // add room eventually, when validator defined
            },
            mark_read: {
                op: "custom", access: 'update', method: "post",
                name: 'Mark Read',
                path: '/mark-chat-room-read',
                description: "Marks the conversation read by the authenticated user",
                parameters: { id: { validator: validation_1.mongoIdStringRequired, required: true } },
                returns: {
                    updated: { validator: 'Room' },
                } // add room eventually, when validator defined
            },
            display_info: {
                op: "custom", access: 'read', method: "get",
                name: 'Attendee display info',
                path: '/chat-room-display-info',
                description: "Returns an object which maps userIds/enduserIds to display information. Includes the roomId as the 'id' field.",
                parameters: { id: { validator: validation_1.mongoIdStringRequired, required: true } },
                returns: {
                    display_info: { validator: validation_1.meetingDisplayInfoValidator, required: true },
                    id: { validator: validation_1.mongoIdStringRequired },
                }
            },
            send_healthie_chat: {
                op: "custom", access: 'create', method: "post",
                name: 'Send Healthie Chat',
                path: '/chat-rooms/send-healthie-chat',
                description: "Marks the conversation read by the authenticated user",
                parameters: {
                    identifier: { validator: validation_1.stringValidator100, required: true },
                    templateId: { validator: validation_1.mongoIdStringRequired, required: true },
                    includeCareTeam: { validator: validation_1.booleanValidator, required: true },
                    enduserId: { validator: validation_1.mongoIdStringRequired, required: true },
                    journeyId: { validator: validation_1.mongoIdStringRequired },
                },
                returns: {
                    room: { validator: 'Room' },
                } // add room eventually, when validator defined
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
        fields: __assign(__assign({}, BuiltInFields), { journeyId: { validator: validation_1.mongoIdStringRequired }, roomId: {
                validator: validation_1.mongoIdStringRequired,
                required: true,
                updatesDisabled: true,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['chat_rooms'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, linkOpens: {
                validator: validation_1.numberToDateValidator,
                readonly: true,
                examples: [{ 0: new Date() }]
            }, senderId: {
                validator: validation_1.mongoIdStringRequired,
                // if changing readonly to false, need to update side effect for track_chats_timestamp
                // readonly: true, // create a separate endpoint for storing enduser chats
                initializer: function (a, s) { return s.id; },
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['users', 'endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'setNull',
                    }]
            }, userId: {
                validator: validation_1.mongoIdStringRequired,
                // don't use initializer to avoid setting userId by Admin API caller
                // initializer: (a, s) => s.type === 'user' ? s.id : undefined,
            }, message: {
                validator: validation_1.stringValidator5000,
                required: true,
                examples: ["Message"]
            }, html: { validator: validation_1.stringValidator5000 }, replyId: {
                validator: validation_1.mongoIdStringRequired,
                updatesDisabled: true,
                dependencies: [{
                        dependsOn: ['chats'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'setNull',
                    }]
            }, readBy: { validator: validation_1.idStringToDateValidator }, hiddenBy: { validator: validation_1.idStringToDateValidator }, hiddenForAll: { validator: validation_1.booleanValidator }, attachments: {
                validator: validation_1.listOfChatAttachmentsValidator,
            }, templateId: { validator: validation_1.mongoIdStringRequired }, automationStepId: { validator: validation_1.mongoIdStringRequired }, linkOpenTrackingIds: {
                validator: validation_1.listOfStringsValidatorEmptyOk,
                initializer: function () { return []; },
            }, timestamp: { validator: validation_1.dateValidator }, ticketIds: { validator: validation_1.listOfStringsValidatorEmptyOk }, tags: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk }, enduserId: {
                validator: validation_1.mongoIdStringOptional,
                initializer: function (_, s) { return s.type === 'enduser' ? s.id : undefined; }
            }, mentions: { validator: validation_1.listOfMongoIdStringValidatorEmptyOk }, canvasId: { validator: validation_1.stringValidator100 }, quote: { validator: (0, validation_1.listValidatorOptionalOrEmptyOk)(validation_1.stringValidator5000OptionalEmptyOkay) }, sendAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, isDraft: { validator: validation_1.booleanValidator } }),
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
                    email: { validator: validation_1.emailValidator, required: true },
                    fname: { validator: validation_1.nameValidator, required: true },
                    lname: { validator: validation_1.nameValidator, required: true },
                    internalDisplayName: { validator: validation_1.stringValidatorOptionalEmptyOkay },
                    organizationId: { validator: validation_1.mongoIdStringRequired, required: true },
                    role: { validator: validation_1.stringValidator },
                    tags: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk },
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
                parameters: { userId: { validator: validation_1.mongoIdStringRequired, required: true } },
                returns: {},
            },
            generate_auth_token: {
                op: "custom", access: 'create', method: "get",
                name: 'Generate authToken (Admin Only)',
                path: '/generate-auth-token',
                description: "Generates an authToken for a user or enduser. Useful for integrating a 3rd-party authentication process.",
                parameters: {
                    id: { validator: validation_1.mongoIdStringRequired },
                    externalId: { validator: validation_1.stringValidator250 },
                    email: { validator: validation_1.emailValidator },
                    phone: { validator: validation_1.phoneValidator },
                    durationInSeconds: { validator: validation_1.nonNegNumberValidator },
                },
                returns: {
                    authToken: { validator: validation_1.stringValidator100, required: true },
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
                    validator: validation_1.listOfDisplayNameInfo
                },
            },
            refresh_session: {
                op: "custom", access: 'update', method: "post",
                name: 'Refresh user authentication',
                path: '/refresh-session',
                description: "When called by an authenticated user, generates a new session",
                parameters: {
                    invalidatePreviousToken: { validator: validation_1.booleanValidator },
                },
                returns: {
                    authToken: { validator: validation_1.stringValidator, required: true },
                    user: { validator: 'user' },
                } // add enduser eventually, when validator defined
            },
            configure_MFA: {
                op: "custom", access: 'update', method: "post",
                name: 'Configure MFA',
                path: '/users/configure-mfa',
                description: "Configures MFA (or removes it, when allowed by an organization)",
                parameters: {
                    disable: { validator: validation_1.booleanValidator },
                },
                returns: {
                    recoveryCodes: { validator: validation_1.listOfStringsValidator, required: true },
                    authToken: { validator: validation_1.stringValidator, required: true },
                    user: { validator: 'user', required: true },
                }
            },
            generate_MFA_challenge: {
                op: "custom", access: 'update', method: "post",
                name: 'Generate MFA Challenge',
                path: '/users/generate-mfa-challenge',
                description: "Begins the MFA verification process, e.g. by sending an email with a code",
                parameters: {
                    method: { validator: validation_1.stringValidator100, required: true },
                },
                returns: {}
            },
            submit_MFA_challenge: {
                op: "custom", access: 'update', method: "post",
                name: 'Submit MFA Challenge',
                path: '/users/submit-mfa-challenge',
                description: "Completes the MFA verification process and generates a new auth token",
                parameters: {
                    code: { validator: validation_1.stringValidator100, required: true },
                },
                returns: {
                    authToken: { validator: validation_1.stringValidator, required: true },
                    user: { validator: 'user', required: true },
                }
            },
            get_engagement_report: {
                op: "custom", access: 'read', method: "get",
                name: 'Get Engagement Report',
                path: '/users/get-engagement-report',
                description: "Gets a report on engagement by care team",
                parameters: {
                    range: { validator: validation_1.dateRangeOptionalValidator },
                    excludeAutomated: { validator: validation_1.booleanValidator },
                },
                returns: {
                    report: { validator: validation_1.objectAnyFieldsAnyValuesValidator, required: true },
                }
            },
            configure_inbox: {
                op: "custom", access: 'update', method: "post",
                name: 'Configure Inbox',
                path: '/users/configure-inbox',
                description: "Configured inbox to support built-in email server",
                parameters: {
                    username: { validator: validation_1.subdomainValidator, required: true },
                    fname: { validator: validation_1.nameValidator, required: true },
                    lname: { validator: validation_1.nameValidator, required: true },
                },
                returns: {
                    authToken: { validator: validation_1.stringValidator, required: true },
                    user: { validator: 'user', required: true },
                },
            },
            consent: {
                op: "custom", access: 'update', method: "patch",
                name: 'Consent to ToS / Privacy Policy',
                path: '/users/consent',
                description: "Stores consents",
                parameters: {
                    termsVersion: { validator: validation_1.stringValidator, required: true }
                },
                returns: {
                    authToken: { validator: validation_1.stringValidator, required: true },
                    user: { validator: 'user', required: true },
                },
            },
            get_users_for_groups: {
                op: "custom", access: 'read', method: "get",
                name: 'Get userIds for Group',
                path: '/users/group',
                description: "Loads all user ids for a given group",
                parameters: {
                    groups: { validator: validation_1.listOfStringsValidator, required: true }
                },
                returns: {
                    userIds: { validator: validation_1.listOfMongoIdStringValidator, required: true },
                },
            },
            play_phone_message: {
                op: "custom", access: 'create', method: "post",
                name: 'Play Phone Message',
                path: '/users/play-phone-message',
                description: "Calls the user and plays a recorded message",
                parameters: {
                    userId: { validator: validation_1.mongoIdStringRequired, required: true },
                    message: { validator: validation_1.stringValidator5000, required: true },
                    enduserId: { validator: validation_1.mongoIdStringRequired },
                    journeyContext: { validator: validation_1.journeyContextValidator },
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
                    provider: { validator: validation_1.stringValidator, required: true },
                    configurationId: { validator: validation_1.mongoIdStringRequired }
                },
                returns: {
                    url: { validator: validation_1.stringValidator, required: true },
                },
            },
            complete_sso: {
                op: "custom", access: 'read', method: "post",
                name: 'Complete SSO',
                path: '/users/complete-SSO',
                description: "For a valid token generated by SSO, authenticate",
                parameters: {
                    token: { validator: validation_1.stringValidator, required: true },
                },
                returns: {
                    authToken: { validator: validation_1.stringValidator, required: true },
                    user: { validator: 'user', required: true },
                },
            },
            register: {
                op: "custom", access: 'create', method: "post",
                name: 'Register',
                path: '/users/register',
                description: "Registers a new account",
                parameters: {
                    email: { validator: validation_1.emailValidator, required: true },
                    password: { validator: validation_1.stringValidator100, required: true },
                    termsVersion: { validator: validation_1.stringValidator100, required: true },
                    inviteCode: { validator: validation_1.stringValidator1000 },
                },
                returns: {},
            },
            login: {
                op: "custom", access: 'update', method: "post",
                name: 'Login',
                path: '/users/login',
                description: "Login with email and password",
                parameters: {
                    email: { validator: validation_1.emailValidator, required: true },
                    password: { validator: validation_1.stringValidator100, required: true },
                    expirationInSeconds: { validator: validation_1.numberValidator }
                },
                returns: {
                    authToken: { validator: validation_1.stringValidator, required: true },
                    user: { validator: 'user', required: true },
                },
            },
            login_with_google: {
                op: "custom", access: 'update', method: "post",
                name: 'Login with Google',
                path: '/users/login-google',
                description: "Login with Google",
                parameters: {
                    jwt: { validator: validation_1.stringValidator25000, required: true },
                },
                returns: {
                    authToken: { validator: validation_1.stringValidator, required: true },
                    user: { validator: 'user', required: true },
                },
            },
            request_password_reset: {
                op: "custom", access: 'update', method: "post",
                name: 'Request Password Reset',
                path: '/request-password-reset',
                description: "Sends a password reset email",
                parameters: {
                    email: { validator: validation_1.emailValidator, required: true }
                },
                returns: {},
            },
            reset_password: {
                op: "custom", access: 'update', method: "post",
                name: 'Reset Password',
                path: '/reset-password',
                description: "For a code generated by request-password-reset, sets a new password",
                parameters: {
                    resetToken: { validator: validation_1.stringValidator250, required: true },
                    newPassword: { validator: validation_1.passwordValidator, required: true },
                },
                returns: {},
            },
            submit_email_verification: {
                op: "custom", access: 'update', method: "post",
                name: 'Submit Email Verification',
                path: '/users/submit-email-verification',
                description: "Verifies a user's email address",
                parameters: {
                    email: { validator: validation_1.emailValidator, required: true },
                    code: { validator: validation_1.stringValidator1000, required: true },
                },
                returns: {
                    authToken: { validator: validation_1.stringValidator, required: true },
                    user: { validator: 'user', required: true },
                },
            },
        },
        fields: __assign(__assign({}, BuiltInFields), { billingTags: { validator: validation_1.labeledFieldsValidator }, defaultLocationId: { validator: validation_1.mongoIdStringRequired }, email: {
                validator: validation_1.emailValidator,
                required: true,
                examples: ['test@tellescope.com'],
                redactions: ['enduser'],
            }, phone: {
                validator: validation_1.phoneValidator,
                redactions: ['enduser'],
            }, fields: {
                validator: validation_1.fieldsValidator,
                redactions: ['enduser'],
            }, unredactedFields: {
                validator: validation_1.fieldsValidator,
            }, username: {
                validator: validation_1.subdomainValidator,
                readonly: true,
                redactions: ['enduser'],
            }, externalId: {
                validator: validation_1.stringValidator250,
            }, fname: { validator: validation_1.nameValidator, }, lname: { validator: validation_1.nameValidator, }, displayName: { validator: validation_1.stringValidatorOptionalEmptyOkay }, internalDisplayName: { validator: validation_1.stringValidator100, redactions: ['enduser'] }, suffixes: { validator: validation_1.listOfStringsValidatorEmptyOk }, organization: {
                validator: validation_1.mongoIdStringRequired,
                updatesDisabled: true,
            }, orgEmail: {
                validator: validation_1.emailValidator,
                readonly: true, // able to set once, then not change (for now, due to email configuration)
            }, accountType: {
                validator: validation_1.stringValidator,
                readonly: true,
            }, roles: {
                validator: validation_1.listOfStringsValidator, // important that this doesn't allow empty roles (would grant default permissions which may be higher)
                // unredacted March 1, 2024 -- useful for filtering scheduling and/or care team display for enduser by role
                // redactions: ['enduser'],
            }, acknowledgedIntegrations: { validator: validation_1.dateValidator }, disableIncomingPhoneCalls: { validator: validation_1.booleanValidator }, skills: {
                validator: validation_1.listOfStringsValidatorEmptyOk,
            }, verifiedEmail: {
                updatesDisabled: true,
                validator: validation_1.booleanValidator,
            }, hashedPass: {
                validator: validation_1.stringValidator,
                readonly: true,
                redactions: ['all'],
            }, hashedInviteCode: { validator: validation_1.stringValidator100, readonly: true, redactions: ['all'] }, notificationPreferences: {
                validator: validation_1.notificationPreferencesValidator,
                redactions: ['enduser'],
            }, notificationEmailsDisabled: { validator: validation_1.booleanValidator }, avatar: {
                validator: validation_1.stringValidator1000,
                dependencies: [
                    {
                        dependsOn: ['files'],
                        dependencyField: 'secureName',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'unset',
                    },
                ]
            }, credentialedStates: {
                validator: validation_1.stateCredentialsValidator,
            }, timezone: { validator: validation_1.timezoneValidator }, weeklyAvailabilities: { validator: validation_1.weeklyAvailabilitiesValidator }, autoReplyEnabled: { validator: validation_1.booleanValidatorOptional }, pushNotificationIosTokens: { validator: validation_1.listOfStringsValidatorEmptyOk }, pushNotificationFirebaseTokens: { validator: validation_1.listOfStringsValidatorEmptyOk }, callRouting: { validator: validation_1.userCallRoutingBehaviorValidator }, tags: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, emailSignature: { validator: validation_1.stringValidator1000 }, disableTicketAutoAssignment: { validator: validation_1.booleanValidator }, ticketAssignmentPriority: { validator: validation_1.nonNegNumberValidator }, specialties: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk }, bio: { validator: validation_1.stringValidator25000EmptyOkay }, TIN: { validator: validation_1.stringValidatorOptionalEmptyOkay }, NPI: { validator: validation_1.stringValidatorOptionalEmptyOkay }, DEA: { validator: validation_1.stringValidatorOptionalEmptyOkay }, voicemailPlayback: { validator: validation_1.phonePlaybackValidatorOptional }, lockedOutUntil: { validator: validation_1.numberValidator }, iOSBadgeCount: { validator: validation_1.nonNegNumberValidator }, availableFromNumbers: { validator: validation_1.listOfStringsValidatorEmptyOk }, availableFromEmails: { validator: validation_1.listOfStringsValidatorEmptyOk }, doseSpotUserId: { validator: validation_1.stringValidator100 }, url: { validator: validation_1.stringValidator1000 }, templateFields: {
                validator: (0, validation_1.listValidatorOptionalOrEmptyOk)((0, validation_1.objectValidator)({
                    field: validation_1.stringValidator100,
                    value: validation_1.stringValidator5000,
                }))
            }, canvasId: { validator: validation_1.stringValidator100 }, medplumId: { validator: validation_1.stringValidator100 }, athenaId: { validator: validation_1.stringValidator100 }, dashboardView: { validator: validation_1.customDashboardViewValidator }, hideFromCalendarView: { validator: validation_1.booleanValidator }, requireSSO: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay } })
    },
    templates: {
        info: {},
        constraints: {
            unique: ['title'],
            relationship: [],
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {
            get_templated_message: {
                op: "custom", access: 'read', method: "post",
                name: 'Get templated message',
                path: '/templated-message',
                description: "Returns a message with template values replaced. Uses POST to support large bodies.",
                parameters: {
                    message: { validator: validation_1.stringValidator100000EmptyOkay, required: true },
                    userId: { validator: validation_1.mongoIdStringRequired, required: true },
                    enduserId: { validator: validation_1.mongoIdStringRequired, required: true },
                    html: { validator: validation_1.stringValidator100000EmptyOkay },
                    subject: { validator: validation_1.stringValidatorOptionalEmptyOkay },
                    channel: { validator: validation_1.communicationsChannelValidator },
                    automationStepId: { validator: validation_1.mongoIdStringRequired },
                    journeyContext: { validator: validation_1.journeyContextValidator },
                    relatedContactId: { validator: validation_1.mongoIdStringRequired },
                },
                returns: {
                    plaintext: { validator: validation_1.stringValidator25000, required: true },
                    html: { validator: validation_1.stringValidator25000, required: true },
                    subject: { validator: validation_1.stringValidator },
                    linkOpenTrackingIds: { validator: validation_1.listOfStringsValidatorEmptyOk, required: true },
                },
            },
            get_suggested_reply: {
                op: "custom", access: 'read', method: "post",
                name: 'Get suggested reply',
                path: '/templates/suggested-reply',
                description: "Returns an AI-generated suggested reply to a conversation.",
                parameters: {
                    messages: { validator: validation_1.externalChatGPTMessagesValidator, required: true },
                },
                returns: {
                    completion: { validator: validation_1.stringValidator, required: true }
                },
            },
            create_embedding: {
                op: "custom", access: 'update', method: "post",
                name: 'Generate Embedding',
                path: '/templates/create-embedding',
                description: "Generates an embedding for AI search",
                parameters: {
                    templateId: { validator: validation_1.mongoIdStringRequired, required: true }
                },
                returns: {},
            },
            embedding_search: {
                op: "custom", access: 'read', method: "post",
                name: 'Embedding Search',
                path: '/templates/embedding-search',
                description: "Performs an AI search",
                parameters: {
                    content: { validator: validation_1.stringValidator25000, required: true },
                },
                returns: {
                    templateIds: { validator: validation_1.listOfMongoIdStringValidator, required: true },
                    message: { validator: validation_1.stringValidator },
                },
            },
        },
        fields: __assign(__assign({}, BuiltInFields), { archivedAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, mmsAttachmentURLs: { validator: validation_1.listOfUniqueStringsValidatorEmptyOk }, title: {
                validator: validation_1.stringValidator100,
                required: true,
                examples: ["Template Name"],
            }, subject: {
                validator: validation_1.stringValidator250,
                required: true,
                examples: ["Template Subject"],
            }, message: {
                validator: validation_1.stringValidator100000EmptyOkay,
                required: true,
                examples: ["This is the template message......"],
            }, html: {
                validator: validation_1.stringValidator100000EmptyOkay,
                examples: ["This is the template message......"],
            }, editorState: {
                validator: validation_1.stringValidator25000,
                examples: ["This is the template message......"],
            }, type: {
                validator: validation_1.messageTemplateTypeValidator,
                initializer: function () { return 'enduser'; }
            }, mode: {
                validator: validation_1.messageTemplateModeValidator,
            }, isMarketing: { validator: validation_1.booleanValidator }, hideFromCompose: { validator: validation_1.booleanValidator }, forChannels: { validator: validation_1.listOfStringsValidatorEmptyOk }, forRoles: { validator: validation_1.listOfStringsValidatorEmptyOk }, forEntityTypes: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, tags: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay } }),
    },
    files: {
        info: {},
        constraints: { unique: [], relationship: [] },
        defaultActions: { read: {}, readMany: {}, update: {}, delete: {} },
        enduserActions: { prepare_file_upload: {}, confirm_file_upload: {}, file_download_URL: {}, read: {}, readMany: {}, delete: {}, update: {} /* allow to hide from client side */ },
        fields: __assign(__assign({}, BuiltInFields), { source: { validator: validation_1.stringValidator100 }, tags: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, name: {
                validator: validation_1.stringValidator250,
                required: true,
            }, size: {
                validator: validation_1.fileSizeValidator,
                required: true,
            }, type: {
                validator: validation_1.fileTypeValidator,
                required: true
            }, enduserId: {
                validator: validation_1.mongoIdStringRequired,
            }, secureName: {
                validator: validation_1.stringValidator250,
                readonly: true,
            }, hideFromEnduserPortal: { validator: validation_1.booleanValidator }, pushedToClientPortal: { validator: validation_1.booleanValidator }, hiddenFromEnduser: { validator: validation_1.booleanValidator }, isCalledOut: { validator: validation_1.booleanValidator }, externalId: {
                validator: validation_1.stringValidator250,
                examples: ['addfed3e-ddea-415b-b52b-df820c944dbb'],
            }, publicRead: { validator: validation_1.booleanValidator, readonly: true } }),
        customActions: {
            prepare_file_upload: {
                op: "custom", access: 'create', method: "post",
                name: 'Prepare File Upload',
                path: '/prepare-file-upload',
                description: "Generates an upload link for a file, storing metadata as a File record.",
                parameters: {
                    name: {
                        validator: validation_1.stringValidator250,
                        required: true,
                    },
                    size: {
                        validator: validation_1.fileSizeValidator,
                        required: true,
                    },
                    type: {
                        validator: validation_1.fileTypeValidator,
                        required: true
                    },
                    publicRead: { validator: validation_1.booleanValidator },
                    isCalledOut: { validator: validation_1.booleanValidator },
                    publicName: { validator: validation_1.stringValidator5000 },
                    enduserId: {
                        validator: validation_1.mongoIdStringRequired,
                        dependencies: [{
                                dependsOn: ['endusers'],
                                dependencyField: '_id',
                                relationship: 'foreignKey',
                                onDependencyDelete: 'setNull',
                            }]
                    },
                    source: { validator: validation_1.stringValidator100 },
                    externalId: { validator: validation_1.stringValidator100 },
                    hiddenFromEnduser: { validator: validation_1.booleanValidator },
                },
                returns: {
                    presignedUpload: {
                        validator: validation_1.objectAnyFieldsAnyValuesValidator,
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
                    secureName: { validator: validation_1.stringValidator250, required: true },
                    preferInBrowser: { validator: validation_1.booleanValidator },
                },
                returns: {
                    downloadURL: { validator: validation_1.stringValidator250, required: true },
                    name: { validator: validation_1.stringValidator100, required: true },
                },
            },
            run_ocr: {
                op: "custom", access: 'read', method: "post",
                name: 'Run OCR (Docsumo)',
                path: '/files/ocr',
                description: "Runs optical character recognition on a document (currently Docsumo when integrated)",
                parameters: {
                    id: { validator: validation_1.mongoIdStringRequired, required: true },
                    type: { validator: validation_1.stringValidator100, required: true },
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
                    id: { validator: validation_1.mongoIdStringRequired, required: true },
                },
                returns: {},
            },
            send_fax: {
                op: "custom", access: 'create', method: "post",
                name: 'Send Fax (via mFax integration)',
                path: '/files/send-fax',
                description: "Sends a fax via mFax to the destination number",
                parameters: {
                    id: { validator: validation_1.mongoIdStringRequired, required: true },
                    recipientFaxNumber: { validator: validation_1.phoneValidator, required: true },
                },
                returns: {},
            },
            push: {
                op: "custom", access: 'create', method: "post",
                name: 'Push File',
                path: '/files/push',
                description: "Sends a file to an integrated system (e.g. athenahealth)",
                parameters: {
                    id: { validator: validation_1.mongoIdStringRequired, required: true },
                    destination: { validator: validation_1.stringValidator, required: true },
                    type: { validator: validation_1.stringValidator },
                    typeId: { validator: validation_1.stringValidator },
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
                        if (session.type === constants_1.ENDUSER_SESSION_TYPE && session.id !== enduserId)
                            return "enduserId does not match creator id for enduser session";
                    }
                },
            ],
            access: [
                { type: 'filter', field: 'owner' },
            ]
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {
            bulk_assign: {
                op: "custom", access: 'update', method: "patch",
                name: 'Bulk Assign Tickets',
                path: '/tickets/bulk-assign',
                description: "Assigns a list of tickets by id (does not send webhooks)",
                parameters: {
                    ids: { validator: validation_1.listOfMongoIdStringValidator, required: true },
                    userId: { validator: validation_1.mongoIdStringRequired, required: true },
                },
                returns: {},
            },
            bulk_delete: {
                op: "custom", access: 'delete', method: "delete",
                name: 'Bulk Delete Tickets',
                path: '/tickets/bulk-delete',
                description: "Deletes a list of tickets by id (does not send webhooks)",
                parameters: {
                    ids: { validator: validation_1.listOfMongoIdStringValidator, required: true },
                },
                returns: {},
            },
            assign_from_queue: {
                op: "custom", access: 'update', method: "patch",
                name: 'Assign From Queue',
                path: '/tickets/assign-from-queue',
                description: "Takes a specific ticket (or next available) from a queue and assigns to the caller of this endpoint",
                parameters: {
                    userId: { validator: validation_1.mongoIdStringRequired },
                    ticketId: { validator: validation_1.mongoIdStringRequired },
                    queueId: { validator: validation_1.mongoIdStringRequired },
                    overrideRestrictions: { validator: validation_1.booleanValidator },
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
                    updates: { validator: validation_1.indexUpdatesValidator, required: true },
                },
                returns: {},
            },
            get_report: {
                op: "custom", access: 'read', method: "all",
                name: 'Get Report',
                path: '/tickets/report',
                description: "Gets aggregate data for building a report on tickets",
                parameters: {
                    userId: { validator: validation_1.mongoIdStringOptional },
                    title: { validator: validation_1.stringValidator25000 },
                    titles: { validator: validation_1.listOfStringsValidatorEmptyOk },
                    range: { validator: validation_1.dateRangeOptionalValidator },
                    rangeField: { validator: validation_1.stringValidator },
                    groupByOwnerAndTitle: { validator: validation_1.booleanValidator },
                },
                returns: {
                    report: { validator: validation_1.objectAnyFieldsAnyValuesValidator, required: true }
                },
            },
            get_distribution_report: {
                op: "custom", access: 'read', method: "all",
                name: 'Get Report',
                path: '/tickets/distribution-report',
                description: "Gets aggregate data for a report on ticket distributions",
                parameters: {
                    range: { validator: validation_1.dateRangeOptionalValidator },
                },
                returns: {
                    report: { validator: validation_1.objectAnyFieldsAnyValuesValidator, required: true }
                },
            },
            close_ticket: {
                op: "custom", access: 'read', method: "post",
                name: 'Close Ticket',
                path: '/tickets/close',
                description: "Closes a ticket and returns any resulting tickets for a current journey",
                parameters: {
                    ticketId: { validator: validation_1.mongoIdStringRequired },
                    closedForReason: { validator: validation_1.stringValidator },
                },
                returns: {
                    updated: { validator: 'ticket', required: true },
                    generated: { validator: 'ticket' },
                },
            },
        },
        enduserActions: { create: {}, read: {}, readMany: {} },
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: validation_1.stringValidator1000,
                required: true,
                examples: ["Ticket Name"],
            }, enduserId: {
                validator: validation_1.mongoIdStringRequired,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, automationStepId: {
                validator: validation_1.mongoIdStringRequired,
            }, closedForReason: { validator: validation_1.stringValidator }, closeReasons: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, closedBy: { validator: validation_1.mongoIdStringRequired }, chatRoomId: {
                validator: validation_1.mongoIdStringRequired,
            }, dueDateInMS: {
                validator: validation_1.nonNegNumberValidator,
            }, closedAt: {
                validator: validation_1.dateValidator,
            }, owner: {
                validator: validation_1.mongoIdStringRequired,
            }, message: {
                validator: validation_1.stringValidator5000,
                examples: ["Message"],
            }, type: {
                validator: validation_1.stringValidator100,
            }, skillsRequired: {
                validator: validation_1.listOfStringsValidator,
            }, priority: { validator: validation_1.numberValidator }, stage: { validator: validation_1.stringValidator100 }, blockerDescription: { validator: validation_1.stringValidator5000EmptyOkay }, index: { validator: validation_1.numberValidator }, carePlanId: { validator: validation_1.mongoIdStringRequired }, journeyId: { validator: validation_1.mongoIdStringRequired }, purchaseId: { validator: validation_1.mongoIdStringRequired }, hiddenFromTickets: { validator: validation_1.booleanValidator }, htmlDescription: { validator: validation_1.stringValidator100000OptionalEmptyOkay }, formResponseIds: { validator: validation_1.listOfStringsValidatorEmptyOk }, actions: { validator: validation_1.ticketActionsValidator }, closeOnFinishedActions: { validator: validation_1.booleanValidator }, remindAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, reminderSilencedAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, relatedRecords: { validator: (0, validation_1.listValidatorOptionalOrEmptyOk)(validation_1.relatedRecordValidator) }, attachments: { validator: validation_1.listOfChatAttachmentsValidator }, snoozes: { validator: validation_1.ticketSnoozesValidator }, requireConfirmation: { validator: validation_1.booleanValidator }, queueId: { validator: validation_1.mongoIdStringRequired }, reminders: { validator: (0, validation_1.listValidatorEmptyOk)(validation_1.ticketReminderValidator) }, nextReminderInMS: {
                validator: validation_1.numberValidator,
                readonly: true,
                initializer: exports.get_next_reminder_timestamp_for_ticket,
            }, references: { validator: validation_1.listOfRelatedRecordsValidator, readonly: true }, calendarEventId: { validator: validation_1.mongoIdStringRequired }, calendarEventTitle: { validator: validation_1.stringValidator }, calendarEventStartTimeInMS: { validator: validation_1.nonNegNumberValidator }, observationId: { validator: validation_1.mongoIdStringRequired }, phoneCallId: { validator: validation_1.mongoIdStringRequired }, smsId: { validator: validation_1.mongoIdStringRequired }, emailId: { validator: validation_1.mongoIdStringRequired }, orderId: { validator: validation_1.mongoIdStringRequired }, tags: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, restrictByState: { validator: validation_1.stateValidator }, restrictByTags: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, restrictByTagsQualifier: { validator: validation_1.listQueryQualifiersValidator }, archiveReason: { validator: validation_1.stringValidator }, contextFormIds: { validator: validation_1.listOfMongoIdStringValidatorOptionalOrEmptyOk }, contextContentIds: { validator: validation_1.listOfMongoIdStringValidatorOptionalOrEmptyOk }, contextEnduserFields: { validator: validation_1.listOfUniqueStringsValidatorEmptyOk }, isTodo: { validator: validation_1.booleanValidator }, databaseRecordId: { validator: validation_1.mongoIdStringRequired }, databaseRecordCreator: { validator: validation_1.mongoIdStringRequired }, triggerFileId: { validator: validation_1.mongoIdStringRequired }, disableEditTitle: { validator: validation_1.booleanValidator } })
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
            readMany: __assign(__assign({}, constants_1.DEFAULT_OPERATIONS['readMany']), { adminOnly: true })
        },
        enduserActions: { my_meetings: {}, join_meeting_for_event: {}, read: {} },
        customActions: {
            read: {
                op: "read", access: 'read', method: "get",
                description: "Get a meeting",
                parameters: {
                    id: { validator: validation_1.mongoIdStringRequired },
                },
                returns: 'meeting',
            },
            start_meeting: {
                op: "custom", access: 'create', method: "post",
                name: 'Start Meeting',
                path: '/start-meeting',
                description: "Generates an video meeting room",
                parameters: {
                    attendees: { validator: validation_1.listOfUserIndentitiesValidator },
                    publicRead: { validator: validation_1.booleanValidator },
                },
                returns: {
                    id: { validator: validation_1.mongoIdStringRequired, required: true },
                    meeting: { validator: validation_1.meetingInfoValidator, required: true },
                    host: { validator: validation_1.attendeeValidator, required: true },
                },
            },
            send_invite: {
                op: "custom", access: 'update', method: "post",
                name: "Send Meeting Invite",
                path: '/send-meeting-invite',
                description: "Sends a meeting invite via email to the given enduser",
                parameters: {
                    meetingId: { validator: validation_1.mongoIdStringRequired, required: true },
                    enduserId: { validator: validation_1.mongoIdStringRequired, required: true },
                },
                returns: {},
            },
            end_meeting: {
                op: "custom", access: 'update', method: "post",
                name: "End Meeting",
                path: '/end-meeting',
                description: "Ends a video meeting",
                parameters: { id: { validator: validation_1.mongoIdStringRequired, required: true } },
                returns: {},
            },
            add_attendees_to_meeting: {
                op: "custom", access: 'update', method: "post",
                name: 'Add Attendees to Meeting',
                path: '/add-attendees-to-meeting',
                description: "Adds other attendees to a meeting",
                parameters: {
                    id: { validator: validation_1.mongoIdStringRequired, required: true },
                    attendees: { validator: validation_1.listOfUserIndentitiesValidator, required: true },
                },
                returns: {},
            },
            attendee_info: {
                op: "custom", access: 'read', method: "get",
                name: 'Get attendee info for meeting',
                path: '/attendee-info',
                description: "Gets meeting info for the current user, and details about other attendees",
                parameters: {
                    id: { validator: validation_1.mongoIdStringRequired, required: true },
                },
                returns: {
                    attendee: { validator: validation_1.attendeeValidator, required: true },
                    others: { validator: validation_1.listOfUserIndentitiesValidator, required: true },
                },
            },
            my_meetings: {
                op: "custom", access: 'read', method: "get",
                name: 'Get list of meetings',
                path: '/my-meetings',
                description: "Gets meetings for the current user.",
                parameters: {},
                returns: { validator: validation_1.meetingsListValidator, required: true },
            },
            start_meeting_for_event: {
                op: "custom", access: 'create', method: "post",
                name: 'Start Scheduled Meeting',
                path: '/start-meeting-for-event',
                description: "Generates an video meeting room",
                parameters: {
                    calendarEventId: { validator: validation_1.mongoIdStringRequired, required: true },
                },
                returns: {
                    id: { validator: validation_1.mongoIdStringRequired, required: true },
                    meeting: { validator: validation_1.meetingInfoValidator, required: true },
                    host: { validator: validation_1.attendeeValidator, required: true },
                },
            },
            join_meeting_for_event: {
                op: "custom", access: 'update', method: "post",
                name: 'Join Scheduled Meeting',
                path: '/join-meeting-for-event',
                description: "Generates an video meeting room",
                parameters: {
                    calendarEventId: { validator: validation_1.mongoIdStringRequired, required: true },
                },
                returns: {
                    id: { validator: validation_1.mongoIdStringRequired, required: true },
                    meeting: { validator: validation_1.meetingInfoValidator, required: true },
                    attendee: { validator: validation_1.attendeeValidator, required: true },
                },
            },
        },
        fields: __assign(__assign({}, BuiltInFields), { 
            // all fields are updatable by custom endpoints only
            status: {
                validator: validation_1.meetingStatusValidator,
                readonly: true,
                initializer: function () { return 'scheduled'; },
            }, attendees: {
                validator: validation_1.listOfAttendeesValidator,
                readonly: true,
            }, meetingInfo: {
                validator: validation_1.meetingInfoValidator,
                readonly: true
            }, publicRead: { validator: validation_1.booleanValidator }, endedAt: { validator: validation_1.dateValidator } })
    },
    notes: {
        info: {},
        constraints: {
            unique: [],
            relationship: [],
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { copiedFrom: { validator: validation_1.mongoIdStringOptional }, copiedFromEnduserId: { validator: validation_1.mongoIdStringOptional }, hiddenFromTimeline: { validator: validation_1.booleanValidator }, enduserId: {
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, ticketId: {
                validator: validation_1.mongoIdStringRequired,
            }, text: {
                validator: validation_1.stringValidator5000,
                examples: ["Text"],
            }, title: {
                validator: validation_1.stringValidator250,
                examples: ["Text"],
            }, fields: {
                validator: validation_1.fieldsValidator,
            }, pinnedAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, tags: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk }, discussionRoomId: { validator: validation_1.mongoIdStringRequired }, source: { validator: validation_1.stringValidator }, externalId: { validator: validation_1.stringValidator } })
    },
    forms: {
        info: {},
        constraints: {
            unique: [],
            relationship: [],
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {
            get_form_statistics: {
                op: "custom", access: 'read', method: "get",
                name: 'Form Statistics',
                path: '/forms/statistics',
                description: "Gets response statistics for a given form",
                parameters: {
                    formId: { validator: validation_1.mongoIdStringOptional, required: true },
                    range: { validator: validation_1.dateRangeOptionalValidator },
                },
                returns: {
                    // todo: document shape with validator
                    statistics: { validator: validation_1.objectAnyFieldsAnyValuesValidator }
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
                    formId: { validator: validation_1.mongoIdStringRequired, required: true },
                },
                returns: {
                    form: { validator: 'form', required: true },
                },
            },
        },
        fields: __assign(__assign({}, BuiltInFields), { gtmTag: { validator: validation_1.stringValidator100EscapeHTML }, dontSyncToCanvasOnSubmission: { validator: validation_1.booleanValidator }, archivedAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, title: {
                validator: validation_1.stringValidator250,
                required: true,
                examples: ["Text"],
            }, numFields: {
                validator: validation_1.nonNegNumberValidator,
                initializer: function () { return 0; },
                examples: [0],
            }, redirectToBookedAppointmentOnSubmit: { validator: validation_1.booleanValidator }, displayTitle: { validator: validation_1.stringValidator1000 }, description: { validator: validation_1.stringValidator5000EmptyOkay }, customGreeting: { validator: validation_1.stringValidator5000 }, customSignature: { validator: validation_1.stringValidator5000 }, customSubject: { validator: validation_1.stringValidator5000 }, allowPublicURL: { validator: validation_1.booleanValidator }, intakePhone: { validator: validation_1.intakePhoneValidator }, intakeEmailRequired: { validator: validation_1.booleanValidator }, intakeEmailHidden: { validator: validation_1.booleanValidator }, intakeDateOfBirth: { validator: validation_1.intakeDateOfBirthValidator }, intakeState: { validator: validation_1.intakeDateOfBirthValidator }, intakeGender: { validator: validation_1.intakeDateOfBirthValidator }, intakeGenderIsSex: { validator: validation_1.booleanValidator }, thanksMessage: { validator: validation_1.stringValidator5000EmptyOkay }, htmlThanksMessage: { validator: validation_1.stringValidator5000EmptyOkay }, type: { validator: validation_1.formTypeValidator }, scoring: { validator: validation_1.formScoringValidator }, externalId: { validator: validation_1.stringValidator100 }, ga4measurementId: { validator: validation_1.stringValidator100 }, backgroundColor: { validator: validation_1.stringValidator100 }, productIds: { validator: validation_1.listOfMongoIdStringValidatorOptionalOrEmptyOk }, submitRedirectURL: { validator: validation_1.stringValidator5000 }, customization: { validator: validation_1.formCustomizationValidator }, publicFormIdRedirect: { validator: validation_1.mongoIdStringOptional }, disabled: { validator: validation_1.booleanValidatorOptional }, disableAutomaticIntegrationPush: { validator: validation_1.booleanValidatorOptional }, customTypeIds: { validator: validation_1.listOfMongoIdStringValidatorOptionalOrEmptyOk }, lockResponsesOnSubmission: { validator: validation_1.booleanValidatorOptional }, tags: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk }, language: { validator: validation_1.stringValidator }, isNonVisitElationNote: { validator: validation_1.booleanValidator }, elationVisitNotePractitionerIds: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, elationVisitNoteType: { validator: validation_1.stringValidator100 }, elationSkipBlankResponses: { validator: validation_1.booleanValidator }, publicShowLanguage: { validator: validation_1.booleanValidator }, publicShowDownload: { validator: validation_1.booleanValidator }, canvasId: { validator: validation_1.stringValidator100 }, canvasQuestionId: { validator: validation_1.stringValidator100 }, syncToOLH: { validator: validation_1.booleanValidator }, syncWithResponsesFromFormIds: { validator: validation_1.listOfUniqueStringsValidatorEmptyOk }, scoresSync: {
                validator: (0, validation_1.listValidatorOptionalOrEmptyOk)((0, validation_1.objectValidator)({
                    score: validation_1.stringValidator100,
                    externalId: validation_1.stringValidator100,
                }))
            }, hideAfterUnsubmittedInMS: { validator: validation_1.numberValidator }, hideFromCompose: { validator: validation_1.booleanValidator }, hideFromBulkSubmission: { validator: validation_1.booleanValidator }, enduserFieldsToAppendForSync: { validator: validation_1.listOfUniqueStringsValidatorEmptyOk }, allowPortalSubmission: { validator: validation_1.booleanValidator }, allowPortalSubmissionEnduserCondition: { validator: validation_1.optionalAnyObjectValidator }, canvasNoteCoding: { validator: validation_1.canvasCodingValidatorOptional }, syncToCanvasAsDataImport: { validator: validation_1.booleanValidator }, matchCareTeamTagsForCanvasPractitionerResolution: { validator: validation_1.listOfStringsWithQualifierValidatorOptionalValuesEmptyOkay }, ipAddressCustomField: { validator: validation_1.stringValidatorOptionalEmptyOkay } })
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
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {
            load_choices_from_database: {
                op: "custom", access: 'read', method: "get",
                path: '/form-fields/load-choices-from-database',
                name: 'Load Choices From Database',
                description: "Loads choices for a Database Select field type in a form",
                parameters: {
                    fieldId: { validator: validation_1.mongoIdStringRequired, required: true },
                    limit: { validator: validation_1.nonNegNumberValidator, required: false },
                    lastId: { validator: validation_1.mongoIdStringRequired, required: false },
                    databaseId: { validator: validation_1.mongoIdStringRequired, required: false },
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
                    enduserId: { validator: validation_1.mongoIdStringRequired },
                    bookingPageId: { validator: validation_1.mongoIdStringRequired, required: true },
                    enduserFields: {
                        validator: (0, validation_1.objectValidator)({
                            state: validation_1.stateValidatorOptional,
                        }, { isOptional: true, emptyOk: true })
                    }
                },
                returns: {
                    warningMessage: { validator: validation_1.stringValidator },
                    bookingURL: { validator: validation_1.stringValidator, required: true },
                    entropy: { validator: validation_1.stringValidator, required: true },
                },
            },
        },
        enduserActions: { read: {}, readMany: {}, load_choices_from_database: {}, booking_info: {} },
        fields: __assign(__assign({}, BuiltInFields), { internalNote: { validator: validation_1.stringValidator }, formId: {
                validator: validation_1.mongoIdStringRequired,
                required: true,
                dependencies: [
                    {
                        dependsOn: ['forms'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    },
                ],
                examples: [constants_1.PLACEHOLDER_ID],
            }, title: {
                validator: validation_1.stringValidatorOptionalEmptyOkay,
                required: true,
                examples: ["Text"],
                initializer: function () { return ''; },
            }, headerText: { validator: validation_1.stringValidator250 }, placeholder: { validator: validation_1.stringValidatorOptional }, type: {
                validator: validation_1.formFieldTypeValidator,
                examples: ['number'],
            }, previousFields: {
                validator: validation_1.previousFormFieldsValidator,
                examples: [[{ type: 'root', info: {} }]]
            }, flowchartUI: { validator: validation_1.flowchartUIValidator }, options: { validator: validation_1.formFieldOptionsValidator }, description: { validator: validation_1.stringValidator25000EmptyOkay }, htmlDescription: { validator: validation_1.stringValidator25000EmptyOkay }, intakeField: { validator: validation_1.stringValidator5000EmptyOkay }, isOptional: { validator: validation_1.booleanValidator }, fullZIP: { validator: validation_1.booleanValidator }, isInGroup: { validator: validation_1.booleanValidator }, externalId: { validator: validation_1.stringValidator1000 }, sharedWithEnduser: { validator: validation_1.booleanValidator }, calloutConditions: { validator: validation_1.formFieldCalloutConditionsValidator }, highlightOnTimeline: { validator: validation_1.booleanValidator }, prepopulateFromFields: { validator: validation_1.booleanValidator }, prepopulateFromDatabase: {
                validator: (0, validation_1.objectValidator)({
                    databaseId: validation_1.mongoIdStringOptional,
                    field: validation_1.stringValidatorOptionalEmptyOkay,
                    overwrite: validation_1.booleanValidatorOptional,
                }, { isOptional: true, emptyOk: true })
            }, disabledWhenPrepopulated: { validator: validation_1.booleanValidator }, feedback: { validator: (0, validation_1.listValidatorOptionalOrEmptyOk)(validation_1.formFieldFeedbackValidator) }, titleFontSize: { validator: validation_1.nonNegNumberValidator }, groupShowCondition: { validator: validation_1.objectAnyFieldsAnyValuesValidator } })
    },
    form_responses: {
        info: {},
        constraints: {
            unique: [],
            relationship: [],
        },
        fields: __assign(__assign({}, BuiltInFields), { discussionRoomId: { validator: validation_1.mongoIdStringRequired }, hiddenFromTimeline: { validator: validation_1.booleanValidator }, lockedAt: { validator: validation_1.dateValidator }, formId: {
                validator: validation_1.stringValidator100,
                required: true,
                dependencies: [
                    {
                        dependsOn: ['forms'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'setNull',
                    },
                ],
                examples: [constants_1.PLACEHOLDER_ID],
            }, enduserId: {
                validator: validation_1.mongoIdStringRequired,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, submissionExpiresAt: {
                validator: validation_1.nonNegNumberValidator,
                updatesDisabled: true,
            }, openedAt: {
                validator: validation_1.dateValidator,
            }, copiedFrom: { validator: validation_1.mongoIdStringOptional }, copiedFromEnduserId: { validator: validation_1.mongoIdStringOptional }, publicSubmit: { validator: validation_1.booleanValidator }, submittedBy: { validator: validation_1.stringValidator250 }, submittedByIsPlaceholder: { validator: validation_1.booleanValidator }, accessCode: { validator: validation_1.stringValidator250 }, userEmail: { validator: validation_1.emailValidator }, submittedAt: { validator: validation_1.dateValidator }, formTitle: { validator: validation_1.stringValidator250 }, responses: { validator: validation_1.formResponsesValidator }, draftSavedAt: { validator: validation_1.dateValidator }, draftSavedBy: { validator: validation_1.mongoIdStringRequired }, hideFromEnduserPortal: { validator: validation_1.booleanValidator }, sharedVia: { validator: validation_1.communicationsChannelValidator }, isInternalNote: { validator: validation_1.booleanValidator }, pinnedAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, publicIdentifier: { validator: validation_1.stringValidator250 }, source: { validator: validation_1.stringValidator250 }, externalId: { validator: validation_1.stringValidator250 }, rootResponseId: { validator: validation_1.mongoIdStringRequired }, parentResponseId: { validator: validation_1.mongoIdStringRequired }, tags: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk }, carePlanId: { validator: validation_1.mongoIdStringRequired }, context: { validator: validation_1.stringValidator1000 }, calendarEventId: { validator: validation_1.mongoIdStringRequired }, references: { validator: validation_1.listOfRelatedRecordsValidator, readonly: true }, groupId: { validator: validation_1.mongoIdStringRequired }, instanceId: { validator: validation_1.stringValidator100 }, groupPosition: { validator: validation_1.nonNegNumberValidator }, hideAfterUnsubmittedInMS: { validator: validation_1.numberValidator }, addenda: {
                validator: (0, validation_1.listValidatorOptionalOrEmptyOk)((0, validation_1.objectValidator)({
                    text: validation_1.stringValidator25000EmptyOkay,
                    timestamp: validation_1.dateValidator,
                    userId: validation_1.mongoIdStringRequired,
                }))
            }, followups: {
                validator: (0, validation_1.listValidatorOptionalOrEmptyOk)((0, validation_1.objectValidator)({
                    formId: validation_1.mongoIdStringRequired,
                    formResponseId: validation_1.mongoIdStringOptional,
                    completedAt: validation_1.dateValidatorOptional,
                }))
            }, canvasEncounterId: { validator: validation_1.stringValidator100 }, pushedToPortalAt: { validator: validation_1.dateValidatorOptional } }),
        defaultActions: constants_1.DEFAULT_OPERATIONS,
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
                    formId: { validator: validation_1.mongoIdStringRequired, required: true },
                    enduserId: { validator: validation_1.mongoIdStringRequired, required: true },
                    automationStepId: { validator: validation_1.mongoIdStringRequired },
                    expireAt: { validator: validation_1.dateValidator },
                    sharedVia: { validator: validation_1.communicationsChannelValidator },
                    isInternalNote: { validator: validation_1.booleanValidator },
                    title: { validator: validation_1.stringValidator },
                    parentResponseId: { validator: validation_1.mongoIdStringRequired },
                    rootResponseId: { validator: validation_1.mongoIdStringRequired },
                    carePlanId: { validator: validation_1.mongoIdStringRequired },
                    calendarEventId: { validator: validation_1.mongoIdStringRequired },
                    context: { validator: validation_1.stringValidator1000 },
                    groupId: { validator: validation_1.mongoIdStringRequired },
                    instanceId: { validator: validation_1.stringValidator100 },
                    groupPosition: { validator: validation_1.nonNegNumberValidator },
                },
                returns: {
                    accessCode: { validator: validation_1.stringValidator250, required: true },
                    url: { validator: validation_1.stringValidator250, required: true },
                    response: { validator: 'form_response', required: true },
                    fullURL: { validator: validation_1.stringValidator250, required: true },
                },
            },
            generate_pdf: {
                op: "custom", access: 'read', method: "get",
                name: 'Generate PDF',
                path: '/form-responses/generate-pdf',
                description: "Get a PDF document generated for a given form response",
                parameters: {
                    id: { validator: validation_1.mongoIdStringRequired, required: true },
                },
                returns: {},
            },
            push_to_EHR: {
                op: "custom", access: 'update', method: "post",
                name: 'Push to EHR',
                path: '/form-responses/push-to-ehr',
                description: "Pushes to an external EHR (e.g. Healthie)",
                parameters: {
                    id: { validator: validation_1.mongoIdStringRequired, required: true },
                    addedResponses: { validator: validation_1.formResponsesValidator }
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
                    enduserId: { validator: validation_1.mongoIdStringRequired, required: true },
                    formIds: { validator: validation_1.listOfMongoIdStringValidator, required: true },
                    noteCoding: { validator: validation_1.canvasCodingValidator, required: true },
                    matchCareTeamTagsForCanvasPractitionerResolution: {
                        validator: validation_1.listOfStringsWithQualifierValidator,
                        required: true,
                    },
                },
                returns: {},
            },
            save_field_response: {
                op: "custom", access: 'update', method: "patch",
                name: 'Save Field Response',
                path: '/save-field-response',
                description: "With an accessCode, includes the answer to an individual field in a partial form response.",
                parameters: {
                    formResponseId: { validator: validation_1.mongoIdStringRequired },
                    accessCode: { validator: validation_1.stringValidator250 },
                    response: { validator: validation_1.formResponseValidator },
                    responses: { validator: (0, validation_1.listValidatorOptionalOrEmptyOk)(validation_1.formResponseValidator) },
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
                    accessCode: { validator: validation_1.stringValidator250, required: true },
                    responses: { validator: validation_1.formResponsesValidator, required: true },
                    automationStepId: { validator: validation_1.mongoIdStringRequired },
                    customerId: { validator: validation_1.stringValidator },
                    productIds: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk },
                    utm: { validator: validation_1.labeledFieldsValidator },
                },
                returns: {
                    formResponse: 'form response',
                    nextFormGroupPublicURL: { validator: validation_1.stringValidator },
                },
            },
            info_for_access_code: {
                op: "custom", access: 'read', method: "get",
                name: 'Info for Access Code',
                path: '/form-info-for-access-code',
                description: "With an accessCode, retrieves the relevant info for submitting a form",
                parameters: {
                    accessCode: { validator: validation_1.stringValidator250, required: true },
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
                    fieldId: { validator: validation_1.mongoIdStringRequired, required: true },
                },
                returns: {
                    clientSecret: { validator: validation_1.stringValidator, required: true },
                    customerId: { validator: validation_1.stringValidator, required: true },
                    publishableKey: { validator: validation_1.stringValidator, required: true },
                    stripeAccount: { validator: validation_1.stringValidator, required: true },
                    businessName: { validator: validation_1.stringValidator, required: true },
                    isCheckout: { validator: validation_1.booleanValidator },
                },
            },
            chargebee_details: {
                op: "custom", access: 'read', method: "get",
                name: 'Chargebee details for form field',
                path: '/form-responses/chargebee-details',
                description: "Gets the relevant information for a Chargebee field",
                parameters: {
                    fieldId: { validator: validation_1.mongoIdStringRequired, required: true },
                },
                returns: {
                    url: { validator: validation_1.stringValidator, required: true },
                },
            },
            get_report: {
                op: "custom", access: 'read', method: "all",
                name: 'Report',
                path: '/form-responses/report',
                description: "Builds a report",
                parameters: {
                    queries: { validator: validation_1.formResponsesReportQueriesValidator, required: true },
                    formIds: { validator: validation_1.listOfMongoIdStringValidatorOptionalOrEmptyOk },
                    submittedAtRange: { validator: validation_1.dateRangeOptionalValidator },
                    range: { validator: validation_1.dateRangeOptionalValidator },
                    enduserFilter: { validator: validation_1.objectAnyFieldsAnyValuesValidator },
                    submittedOnly: { validator: validation_1.booleanValidatorOptional },
                    includeIds: { validator: validation_1.booleanValidator },
                },
                returns: {
                    report: { validator: validation_1.objectAnyFieldsAnyValuesValidator, required: true }
                },
            },
            get_related_forms_report: {
                op: "custom", access: 'read', method: "all",
                name: 'Related Forms Report',
                path: '/form-responses/related-forms-report',
                description: "Builds a report on related forms (parent-child)",
                parameters: {
                    formIds: { validator: validation_1.listOfMongoIdStringValidatorOptionalOrEmptyOk },
                    submittedAtRange: { validator: validation_1.dateRangeOptionalValidator },
                    childSubmittedAtRange: { validator: validation_1.dateRangeOptionalValidator },
                    answers: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk },
                    groupBy: { validator: validation_1.stringValidator },
                    enduserFilter: { validator: validation_1.objectAnyFieldsAnyValuesValidator },
                },
                returns: {
                    report: { validator: validation_1.objectAnyFieldsAnyValuesValidator, required: true }
                },
            },
            get_enduser_statistics: {
                op: "custom", access: 'read', method: "all",
                name: 'Get Enduser Statistics',
                path: '/form-responses/enduser-statistics',
                description: "Get statistics on the number of *unique* endusers who have submitted forms",
                parameters: {
                    formIds: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk },
                    range: { validator: validation_1.dateRangeOptionalValidator },
                    customTypeId: { validator: validation_1.mongoIdStringOptional },
                    enduserFields: {
                        validator: (0, validation_1.listValidatorEmptyOk)((0, validation_1.objectValidator)({ field: validation_1.stringValidator, value: validation_1.stringValidator }))
                    },
                    endusersFilter: { validator: validation_1.objectAnyFieldsAnyValuesValidator },
                    groupBy: { validator: validation_1.stringValidator },
                    includeCalendarEventTemplateIds: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk },
                },
                returns: {
                    count: { validator: validation_1.numberValidator, required: true },
                    grouped: { validator: validation_1.objectAnyFieldsAnyValuesValidator, },
                },
            },
            get_enduser_statistics_by_submitter: {
                op: "custom", access: 'read', method: "all",
                name: 'Get Enduser Statistics By Submitter',
                path: '/form-responses/enduser-statistics-by-submitter',
                description: "Get statistics on the number of *unique* endusers who have submitted forms, grouped by form submitter ID",
                parameters: {
                    formIds: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk },
                    range: { validator: validation_1.dateRangeOptionalValidator },
                    customTypeId: { validator: validation_1.mongoIdStringOptional },
                    enduserFields: {
                        validator: (0, validation_1.listValidatorEmptyOk)((0, validation_1.objectValidator)({ field: validation_1.stringValidator, value: validation_1.stringValidator }))
                    },
                    endusersFilter: { validator: validation_1.objectAnyFieldsAnyValuesValidator },
                    includeCalendarEventTemplateIds: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk },
                },
                returns: {
                    count: { validator: validation_1.numberValidator, required: true },
                    grouped: { validator: validation_1.objectAnyFieldsAnyValuesValidator, },
                },
            },
            get_distribution_report: {
                op: "custom", access: 'read', method: "all",
                name: 'Get Distribution of Answers for Forms',
                path: '/form-responses/distribution-report',
                description: "Get statistics on the number of *unique* endusers who have submitted forms, grouped by form submitter ID",
                parameters: {
                    formIds: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk, required: true },
                    submittedAtRange: { validator: validation_1.dateRangeOptionalValidator, required: true },
                },
                returns: {
                    report: { validator: validation_1.objectAnyFieldsAnyValuesValidator, required: true }
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
                    formId: { validator: validation_1.mongoIdStringRequired, required: true },
                    businessId: { validator: validation_1.mongoIdStringRequired, required: true },
                    enduserId: { validator: validation_1.mongoIdStringRequired },
                    email: { validator: validation_1.emailValidator },
                    dateOfBirth: { validator: validation_1.stringValidator100 },
                    phone: { validator: validation_1.phoneValidator },
                    fname: { validator: validation_1.nameValidator },
                    lname: { validator: validation_1.nameValidator },
                    gender: { validator: validation_1.tellescopeGenderValidator },
                    publicIdentifier: { validator: validation_1.stringValidator },
                    state: { validator: validation_1.stateValidator },
                    customTypeId: { validator: validation_1.stringValidator },
                    skipMatch: { validator: validation_1.booleanValidator },
                    groupId: { validator: validation_1.mongoIdStringRequired },
                    utm: { validator: validation_1.labeledFieldsValidator },
                },
                returns: {
                    accessCode: { validator: validation_1.stringValidator250, required: true },
                    authToken: { validator: validation_1.stringValidator250, required: true },
                    url: { validator: validation_1.stringValidator250, required: true },
                    path: { validator: validation_1.stringValidator250, required: true },
                    enduserId: { validator: validation_1.mongoIdStringRequired, required: true },
                },
            },
        },
    },
    webhooks: {
        info: {
            description: "Allows you to subscribe to Webhooks when models in Tellescope are created, updated, and deleted.\n\n        <strong style=\"font-size: 25px\">\n        To avoid echo (receiving webhooks when updating records with an API Key), pass the use { dontSendWebhook: true } in the \"options\" parameter to update (PATCH) requests\n        We rate limit requests which perform the same update to the same record to help you detect echo during development\n        </strong>\n\n        Each webhook is a POST request to the given URL, of the form <pre>{ \n          model: string, \n          type: 'create' | 'update' | 'delete', \n          records: object[], \n          timestamp: string, \n          integrity: string, \n          relatedRecords: { [id: string]: object } \n}</pre>\n        This includes the name of the model, the type of operation performed, and an array of the new, updated, or deleted model(s).\n\n        <strong>Each 'create' webhook may include more than one record (e.g. when records are created as part of a bulk POST) </strong>\n\n        The integrity field is a sha256 hash of (record ids concatenated from index 0 to the end, with the timestamp and then secret appended)\n        For example hook: { records: [{ id: '1', ... }, { id: '4', ... }], timestamp: \"1029358\" } with secret set as \"secret\",\n        integrity = sha256('141029358secret')\n        Each time you handle a webhook, you should verify the integrity field is correct to ensure that the request is actually coming from Tellescope. \n\n        For performance, a relatedRecords object is provided as a cache. This object maps some ids referenced in the webhook records to the corresponding models in Tellescope. \n        For a given webhook, relatedRecords may be empty, or may not include all related ids. In such cases, you'll need to query against the Tellescope API for an up-to-date reference.\n\n        Currently supported models for Webhooks: ".concat(Object.keys(types_models_1.WEBHOOK_MODELS).join(', '), "\n\n        You can handle webhooks from automations in Tellescope, which have a simpler format: <pre>{ \n          type: 'automation'\n          message: string,\n          timestamp: string, \n          integrity: string, \n          enduserId: string, \n}</pre>\n        In this case, integrity is a simple sha256 hash of message + timestamp + secret\n\n        You can also handle calendar event reminders as webhooks, which have the format: <pre>{ \n          type: 'calendar_event_reminder'\n          event: CalendarEvent,\n          timestamp: string, \n          integrity: string, \n}</pre>\n        In this case, integrity is a simple sha256 hash of event.id + timestamp + secret\n      ")
        },
        constraints: {
            unique: [],
            relationship: [],
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {
            configure: {
                op: "custom", access: 'create', method: "post",
                name: 'Configure Webhooks (Admin Only)',
                path: '/configure-webhooks',
                description: "Sets the URL, secret, and initial subscriptions for your organization. Your secret must exceed 15 characters and should be generated randomly. This endpoint ensures duplicate webhook records aren't created.",
                parameters: {
                    url: { validator: validation_1.urlValidator, required: true },
                    secret: { validator: validation_1.stringValidator5000, required: true },
                    subscriptions: { validator: validation_1.WebhookSubscriptionValidator },
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
                    subscriptions: { validator: validation_1.WebhookSubscriptionValidator },
                    url: { validator: validation_1.stringValidator5000 },
                },
            },
            update: {
                op: "custom", access: 'update', method: "patch",
                name: 'Update Webhooks (Admin Only)',
                path: '/update-webhooks',
                description: "DEPRECATED: Modifies only subscriptions to models included in subscriptionUpdates. To remove subscriptions for a given model, set all values to false.",
                parameters: {
                    url: { validator: validation_1.urlValidator },
                    secret: { validator: validation_1.stringValidator5000 },
                    subscriptionUpdates: { validator: validation_1.WebhookSubscriptionValidator },
                },
                returns: {},
            },
            send_automation_webhook: {
                op: "custom", access: 'create', method: "post",
                name: 'Send Automation Webhook',
                path: '/send-automation-webhook',
                description: "Sends a webhook with the automations format, useful for testing automation integrations",
                parameters: {
                    message: { validator: validation_1.stringValidator5000 },
                    enduserId: { validator: validation_1.mongoIdStringRequired },
                    automationStepId: { validator: validation_1.mongoIdStringRequired },
                    action: { validator: validation_1.optionalAnyObjectValidator },
                    context: { validator: validation_1.journeyContextValidator },
                },
                returns: {},
            },
            send_calendar_event_reminder_webhook: {
                op: "custom", access: 'create', method: "post",
                name: 'Send Calendar Event Reminder Webhook',
                path: '/send-calendar-event-reminder-webhook',
                description: "Sends a webhook with the calendar reminder format, useful for testing integrations",
                parameters: {
                    id: { validator: validation_1.mongoIdStringRequired, required: true },
                },
                returns: {},
            },
        },
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { secret: {
                validator: validation_1.stringValidator250,
                examples: ["Text"],
            }, url: {
                validator: validation_1.urlValidator,
                examples: ["Text"],
            }, subscriptions: {
                validator: validation_1.WebhookSubscriptionValidator,
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
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {
            get_events_for_user: {
                op: "custom", access: 'read', method: "get",
                name: 'Get Events for User (Including Integrations)',
                path: '/events-for-user',
                description: "Combines internal and external events, formatted as a Tellescope events",
                parameters: {
                    userId: { validator: validation_1.mongoIdStringRequired, required: true },
                    from: { validator: validation_1.dateValidator, required: true },
                    userIds: { validator: validation_1.listOfMongoIdStringValidatorOptionalOrEmptyOk },
                    to: { validator: validation_1.dateValidator },
                    limit: { validator: validation_1.nonNegNumberValidator },
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
                    userIds: { validator: validation_1.listOfStringsValidator, required: true },
                    from: { validator: validation_1.dateValidator, required: true },
                    to: { validator: validation_1.dateValidator, required: true },
                    limit: { validator: validation_1.nonNegNumberValidator },
                    external: { validator: validation_1.booleanValidator },
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
                    eventId: { validator: validation_1.mongoIdStringRequired, required: true },
                    enduserId: { validator: validation_1.mongoIdStringRequired, required: true },
                },
                returns: {
                    link: { validator: validation_1.stringValidator1000, required: true }
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
                    calendarEventTemplateId: { validator: validation_1.mongoIdStringRequired, required: true },
                    from: { validator: validation_1.dateValidator, required: true },
                    locationId: { validator: validation_1.mongoIdStringRequired },
                    restrictedByState: { validator: validation_1.booleanValidator },
                    state: { validator: validation_1.stateValidator },
                    multi: { validator: validation_1.booleanValidator },
                    to: { validator: validation_1.dateValidator },
                    limit: { validator: validation_1.nonNegNumberValidator },
                    businessId: { validator: validation_1.mongoIdStringRequired },
                    userId: { validator: validation_1.mongoIdStringRequired },
                    userIds: { validator: validation_1.listOfMongoIdStringValidatorEmptyOk },
                    intervalInMinutes: { validator: validation_1.nonNegNumberValidator },
                },
                returns: {
                    availabilityBlocks: { validator: validation_1.baseAvailabilityBlocksValidator, required: true }
                },
            },
            book_appointment: {
                op: "custom", access: 'create', method: "post",
                name: 'Book Appointment',
                path: '/book-appointment',
                description: "Books an appointment with a given user if available",
                parameters: {
                    calendarEventTemplateId: { validator: validation_1.mongoIdStringRequired, required: true },
                    userId: { validator: validation_1.mongoIdStringRequired, required: true },
                    otherUserIds: { validator: validation_1.listOfMongoIdStringValidatorOptionalOrEmptyOk },
                    startTime: { validator: validation_1.dateValidator, required: true },
                    locationId: { validator: validation_1.mongoIdStringRequired },
                    rescheduledCalendarEventId: { validator: validation_1.mongoIdStringRequired },
                    bookingPageId: { validator: validation_1.mongoIdStringRequired },
                    agreedToTerms: { validator: validation_1.appointmentTermsValidator },
                    timezone: { validator: validation_1.timezoneValidator },
                    fields: { validator: validation_1.objectAnyFieldsAnyValuesValidator },
                    token: { validator: validation_1.stringValidator },
                    customerId: { validator: validation_1.stringValidator100 },
                    intervalInMinutes: { validator: validation_1.nonNegNumberValidator },
                    holdUntil: { validator: validation_1.dateValidator },
                    holdFormResponseId: { validator: validation_1.mongoIdStringRequired },
                    reason: { validator: validation_1.stringValidator5000 },
                    scheduledBy: { validator: validation_1.mongoIdStringRequired },
                    externalId: { validator: validation_1.stringValidator100 },
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
                        validator: (0, validation_1.objectValidator)({
                            customerId: validation_1.stringValidator1000,
                            clientSecret: validation_1.stringValidator1000,
                            publishableKey: validation_1.stringValidator1000,
                            stripeAccount: validation_1.stringValidator1000,
                            businessName: validation_1.stringValidator1000,
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
                    userId: { validator: validation_1.stringValidator, required: true },
                    calendarEventId: { validator: validation_1.stringValidator },
                    startTimeInMS: { validator: validation_1.nonNegNumberValidator },
                    durationInMinutes: { validator: validation_1.nonNegNumberValidator },
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
                    calendarEventId: { validator: validation_1.stringValidator, required: true },
                    userId: { validator: validation_1.stringValidator, required: true },
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
                    calendarEventId: { validator: validation_1.mongoIdStringRequired, required: true },
                    attendeeId: { validator: validation_1.stringValidator },
                    attendeeType: { validator: validation_1.sessionTypeValidator },
                    excludeAttendee: { validator: validation_1.booleanValidator },
                },
                returns: {},
            },
            get_report: {
                op: "custom", access: 'read', method: "all",
                name: 'Report',
                path: '/calendar-events/report',
                description: "Builds a report",
                parameters: {
                    range: { validator: validation_1.dateRangeOptionalValidator },
                    templateIds: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk },
                    groupBy: { validator: validation_1.stringValidator },
                },
                returns: {
                    report: { validator: validation_1.objectAnyFieldsAnyValuesValidator, required: true }
                },
            },
            get_enduser_report: {
                op: "custom", access: 'read', method: "all",
                name: 'Report',
                path: '/calendar-events/enduser-report',
                description: "Builds a report",
                parameters: {
                    range: { validator: validation_1.dateRangeOptionalValidator },
                    templateIds: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk },
                    groupBy: { validator: validation_1.stringValidator },
                    enduserGroupBy: { validator: validation_1.stringValidator },
                    countDuplicates: { validator: validation_1.booleanValidatorOptional },
                    enduserFields: { validator: validation_1.objectAnyFieldsAnyValuesValidator },
                },
                returns: {
                    report: { validator: validation_1.objectAnyFieldsAnyValuesValidator, required: true }
                },
            },
            push: {
                op: "custom", access: 'create', method: "post",
                name: 'Push to external EHRs',
                path: '/calendar-events/push',
                description: "Syncs to an external EHR (e.g. Canvas)",
                parameters: {
                    calendarEventId: { validator: validation_1.mongoIdStringRequired, required: true },
                    destinations: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk }
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
                    token: { validator: validation_1.stringValidator, required: true }
                },
                returns: {
                    authToken: { validator: validation_1.stringValidator250, required: true },
                    eventId: { validator: validation_1.mongoIdStringRequired, required: true },
                },
            },
            session_for_start_link: {
                op: "custom", access: 'read', method: "get",
                path: '/calendar-events/session-link',
                name: 'Gets Start Link Info (user only)',
                description: "Gets session and event details for a start link",
                parameters: {
                    token: { validator: validation_1.stringValidator, required: true }
                },
                returns: {
                    authToken: { validator: validation_1.stringValidator250, required: true },
                    eventId: { validator: validation_1.mongoIdStringRequired, required: true },
                },
            },
            session_for_public_appointment_booking: {
                op: "custom", access: 'create', method: "post",
                path: '/session-for-public-appointment-booking',
                name: 'Generate Session for Public Appointment Booking',
                description: "Generates a session for booking an appointment",
                parameters: {
                    email: { validator: validation_1.emailValidator, required: true },
                    calendarEventTemplateId: { validator: validation_1.mongoIdStringRequired, required: true },
                    businessId: { validator: validation_1.mongoIdStringRequired, required: true },
                    dateOfBirth: { validator: validation_1.stringValidator },
                    phone: { validator: validation_1.phoneValidator },
                    fname: { validator: validation_1.nameValidator },
                    lname: { validator: validation_1.nameValidator },
                    state: { validator: validation_1.stateValidator },
                    organizationIds: { validator: validation_1.listOfMongoIdStringValidatorOptionalOrEmptyOk },
                },
                returns: {
                    authToken: { validator: validation_1.stringValidator250, required: true },
                    stripe: {
                        validator: (0, validation_1.objectValidator)({
                            customerId: validation_1.stringValidator1000,
                            clientSecret: validation_1.stringValidator1000,
                            publishableKey: validation_1.stringValidator1000,
                            stripeAccount: validation_1.stringValidator1000,
                            businessName: validation_1.stringValidator1000,
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
                    appointmentBookingPageId: { validator: validation_1.mongoIdStringRequired, required: true },
                    businessId: { validator: validation_1.mongoIdStringRequired, required: true },
                    userId: { validator: validation_1.mongoIdStringRequired },
                    userTags: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk },
                    userFilterTags: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk },
                },
                returns: {
                    appointmentBookingPage: { validator: 'appointment_booking_page', required: true },
                    calendarEventTemplates: { validator: 'calendar_event_templates', required: true },
                    locations: { validator: 'appointment_locations', required: true },
                    products: { validator: 'products', required: true },
                    userDisplayName: { validator: validation_1.stringValidator },
                    userAvatar: { validator: validation_1.stringValidator },
                    users: { validator: "users" },
                },
            }
        },
        enduserActions: {
            read: {}, readMany: {}, update: {},
            get_appointment_availability: {}, book_appointment: {}, stripe_details: {},
            session_for_public_appointment_booking: {}, download_ics_file: {},
        },
        fields: __assign(__assign({}, BuiltInFields), { sendIcsEmail: { validator: validation_1.booleanValidator }, athenaDepartmentId: { validator: validation_1.stringValidator1000 }, generateAthenaTelehealthLink: { validator: validation_1.booleanValidator }, athenaTypeId: { validator: validation_1.stringValidator1000 }, athenaBookingTypeId: { validator: validation_1.stringValidator1000 }, preventCancelMinutesInAdvance: { validator: validation_1.numberValidator }, preventRescheduleMinutesInAdvance: { validator: validation_1.numberValidator }, actualDuration: { validator: validation_1.nonNegNumberValidator }, dontSyncToCanvas: { validator: validation_1.booleanValidator }, title: {
                validator: validation_1.stringValidator250,
                required: true,
                examples: ["Text"],
            }, displayTitle: { validator: validation_1.stringValidator250 }, displayDescription: { validator: validation_1.stringValidator5000 }, startTimeInMS: {
                validator: validation_1.nonNegNumberValidator,
                examples: [100],
                required: true,
            }, durationInMinutes: {
                validator: validation_1.nonNegNumberValidator,
                examples: [100],
                required: true,
            }, locationId: { validator: validation_1.mongoIdStringRequired }, locationIds: { validator: validation_1.listOfMongoIdStringValidatorOptionalOrEmptyOk }, type: { validator: validation_1.stringValidator100 }, description: { validator: validation_1.stringValidator5000 }, agreedToTerms: { validator: validation_1.appointmentTermsValidator }, meetingId: { validator: validation_1.mongoIdStringRequired, readonly: true }, bookingPageId: { validator: validation_1.mongoIdStringRequired }, meetingStatus: { validator: validation_1.meetingStatusValidator }, attachments: { validator: validation_1.listOfGenericAttachmentsValidator }, cancelledAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, rescheduledAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, noShowedAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, rescheduledTo: { validator: validation_1.mongoIdStringRequired }, chatRoomId: {
                validator: validation_1.mongoIdStringRequired,
                dependencies: [{
                        dependsOn: ['chat_rooms'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'setNull',
                    }]
            }, carePlanId: {
                validator: validation_1.mongoIdStringRequired,
                dependencies: [{
                        dependsOn: ['care_plans'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'setNull',
                    }]
            }, carePlanNote: { validator: validation_1.stringValidator5000EmptyOkay }, attendees: {
                validator: validation_1.calendarEventAttendeesValidator,
                initializer: function () { return []; },
            }, reminders: {
                validator: validation_1.listOfCalendarEventRemindersValidator,
                initializer: function () { return []; },
            }, templateId: {
                validator: validation_1.mongoIdStringRequired,
                dependencies: [{
                        dependsOn: ['calendar_event_templates'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'nop',
                    }]
            }, publicRead: { validator: validation_1.booleanValidator }, wasSelfScheduled: { validator: validation_1.booleanValidator }, enableVideoCall: { validator: validation_1.booleanValidator }, fields: { validator: validation_1.fieldsValidator }, numRSVPs: { validator: validation_1.nonNegNumberValidator }, image: { validator: validation_1.stringValidator5000 }, sharedContentIds: { validator: validation_1.listOfMongoIdStringValidatorEmptyOk }, enduserFormResponses: { validator: validation_1.enduserFormResponsesForEventValidator }, enduserTasks: { validator: validation_1.enduserTasksForEventValidator }, color: { validator: validation_1.stringValidator1000 }, location: { validator: validation_1.stringValidator1000 }, locationURL: { validator: validation_1.stringValidator1000 }, locationNotes: { validator: validation_1.stringValidator5000 }, phone: { validator: validation_1.stringValidator100 }, portalSettings: { validator: validation_1.calendarEventPortalSettingsValidator }, externalId: { validator: validation_1.stringValidator }, source: { validator: validation_1.stringValidator }, videoIntegration: { validator: validation_1.videoIntegrationTypesValidator }, videoHostUserId: { validator: validation_1.mongoIdStringRequired }, videoURL: { validator: validation_1.stringValidator }, videoStartURL: { validator: validation_1.stringValidator }, externalVideoURL: { validator: validation_1.stringValidator }, timezone: { validator: validation_1.timezoneValidator }, copiedFrom: { validator: validation_1.mongoIdStringRequired }, internalNotes: { validator: validation_1.stringValidator5000EmptyOkay }, hiddenFromPortal: { validator: validation_1.booleanValidatorOptional }, enduserAttendeeLimit: { validator: validation_1.numberValidator }, bufferEndMinutes: { validator: validation_1.numberValidator }, bufferStartMinutes: { validator: validation_1.numberValidator }, canvasCoding: { validator: validation_1.canvasCodingValidator }, canvasReasonCoding: { validator: validation_1.canvasCodingValidator }, canvasLocationId: { validator: validation_1.stringValidator100 }, references: { validator: validation_1.listOfRelatedRecordsValidator, readonly: true }, completedAt: { validator: validation_1.dateValidatorOptional }, confirmedAt: { validator: validation_1.dateValidatorOptional }, tags: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, cancelledGroupAttendees: {
                validator: (0, validation_1.listValidatorOptionalOrEmptyOk)((0, validation_1.objectValidator)({
                    id: validation_1.mongoIdStringRequired,
                    at: validation_1.dateValidator,
                }))
            }, useUserURL: { validator: validation_1.booleanValidator }, instructions: { validator: validation_1.stringValidator5000EmptyOkay }, reason: { validator: validation_1.stringValidator5000 }, scheduledBy: { validator: validation_1.mongoIdStringRequired }, 
            // isAllDay: { validator: booleanValidator },
            statusChangeSource: {
                validator: (0, validation_1.objectValidator)({
                    source: validation_1.stringValidator100,
                    identifier: validation_1.stringValidator100,
                    byEnduserExternal: validation_1.booleanValidatorOptional,
                }),
            }, cancelReason: { validator: validation_1.stringValidator5000 }, dontAutoSyncPatientToHealthie: { validator: validation_1.booleanValidator }, dontBlockAvailability: { validator: validation_1.booleanValidator }, previousStartTimes: { validator: validation_1.listOfNumbersValidatorUniqueOptionalOrEmptyOkay }, requirePortalCancelReason: { validator: validation_1.booleanValidator }, startLinkToken: { validator: validation_1.stringValidator250 }, canvasEncounterId: { validator: validation_1.stringValidator100 }, allowGroupReschedule: { validator: validation_1.booleanValidator }, joinedVideoCall: {
                validator: (0, validation_1.listValidatorOptionalOrEmptyOk)((0, validation_1.objectValidator)({
                    id: validation_1.mongoIdStringRequired,
                    at: validation_1.dateValidator,
                }))
            }, createAndBookAthenaSlot: { validator: validation_1.booleanValidator } })
    },
    calendar_event_templates: {
        info: {},
        constraints: {
            unique: ['title'],
            relationship: [],
            access: []
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: { read: {}, readMany: {} },
        fields: __assign(__assign({}, BuiltInFields), { sendIcsEmail: { validator: validation_1.booleanValidator }, createAndBookAthenaSlot: { validator: validation_1.booleanValidator }, athenaDepartmentId: { validator: validation_1.stringValidator1000 }, generateAthenaTelehealthLink: { validator: validation_1.booleanValidator }, athenaTypeId: { validator: validation_1.stringValidator1000 }, athenaBookingTypeId: { validator: validation_1.stringValidator1000 }, preventCancelMinutesInAdvance: { validator: validation_1.numberValidator }, preventRescheduleMinutesInAdvance: { validator: validation_1.numberValidator }, dontSyncToCanvas: { validator: validation_1.booleanValidator }, archivedAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, allowGroupReschedule: { validator: validation_1.booleanValidator }, dontAutoSyncPatientToHealthie: { validator: validation_1.booleanValidator }, title: {
                validator: validation_1.stringValidator250,
                required: true,
                examples: ["Text"],
            }, displayTitle: { validator: validation_1.stringValidator250 }, displayDescription: { validator: validation_1.stringValidator5000 }, durationInMinutes: {
                validator: validation_1.nonNegNumberValidator,
                examples: [100],
                required: true,
            }, portalSettings: { validator: validation_1.calendarEventPortalSettingsValidator }, productIds: { validator: validation_1.listOfMongoIdStringValidatorEmptyOk }, type: { validator: validation_1.stringValidator100 }, description: { validator: validation_1.stringValidator5000 }, reminders: {
                validator: validation_1.listOfCalendarEventRemindersValidator,
                initializer: function () { return []; },
            }, publicRead: { validator: validation_1.booleanValidator }, enableVideoCall: { validator: validation_1.booleanValidator }, enableSelfScheduling: { validator: validation_1.booleanValidator }, restrictedByState: { validator: validation_1.booleanValidator }, image: { validator: validation_1.stringValidator5000 }, confirmationEmailDisabled: { validator: validation_1.booleanValidatorOptional }, confirmationSMSDisabled: { validator: validation_1.booleanValidatorOptional }, 
            // confirmationSenderId: { validator: mongoIdStringValidator },
            carePlanForms: { validator: validation_1.listOfMongoIdStringValidatorOptionalOrEmptyOk }, carePlanContent: { validator: validation_1.listOfMongoIdStringValidatorOptionalOrEmptyOk }, carePlanFiles: { validator: validation_1.listOfMongoIdStringValidatorOptionalOrEmptyOk }, carePlanTasks: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk }, videoIntegration: { validator: validation_1.videoIntegrationTypesValidator }, generateZoomLinkWhenBooked: { validator: validation_1.booleanValidator }, color: { validator: validation_1.stringValidator1000 }, apiOnly: { validator: validation_1.booleanValidator }, enduserAttendeeLimit: { validator: validation_1.numberValidator }, bufferEndMinutes: { validator: validation_1.numberValidator }, bufferStartMinutes: { validator: validation_1.numberValidator }, canvasCoding: { validator: validation_1.canvasCodingValidator }, canvasReasonCoding: { validator: validation_1.canvasCodingValidator }, tags: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, matchToHealthieTemplate: { validator: validation_1.booleanValidator }, useUserURL: { validator: validation_1.booleanValidator }, instructions: { validator: validation_1.stringValidator5000EmptyOkay }, requiresEnduser: { validator: validation_1.booleanValidator }, requirePortalCancelReason: { validator: validation_1.booleanValidator } })
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
        defaultActions: __assign(__assign({}, constants_1.DEFAULT_OPERATIONS), { update: { creatorOnly: true }, delete: { creatorOnly: true } }),
        enduserActions: { create: {}, read: {}, readMany: {}, update: {}, delete: {} },
        fields: __assign(__assign({}, BuiltInFields), { eventId: {
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['calendar_events'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, displayName: {
                validator: validation_1.stringValidator,
                initializer: function (_, s) { var _a; return (_a = s.fname) !== null && _a !== void 0 ? _a : ''; },
            }, avatar: {
                validator: validation_1.stringValidator1000,
                initializer: function (_, s) { var _a; return (_a = s.avatar) !== null && _a !== void 0 ? _a : ''; },
            }, status: { validator: validation_1.stringValidator }, creatorType: {
                readonly: true,
                validator: validation_1.sessionTypeValidator,
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
        defaultActions: __assign({}, constants_1.DEFAULT_OPERATIONS),
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { journeyId: {
                validator: validation_1.mongoIdStringRequired,
                examples: [constants_1.PLACEHOLDER_ID],
                required: true,
                dependencies: [{
                        dependsOn: ['journeys'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, events: {
                validator: validation_1.automationEventsValidator,
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
                validator: validation_1.automationActionValidator,
                required: true,
                examples: [{
                        type: "sendEmail",
                        info: {
                            senderId: constants_1.PLACEHOLDER_ID,
                            templateId: constants_1.PLACEHOLDER_ID,
                        },
                    }]
            }, conditions: { validator: validation_1.listOfAutomationConditionsValidator }, flowchartUI: { validator: validation_1.flowchartUIValidator }, continueOnError: { validator: validation_1.booleanValidator }, enduserConditions: { validator: validation_1.optionalAnyObjectValidator }, tags: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk } })
    },
    automated_actions: {
        info: {},
        constraints: {
            unique: [],
            relationship: [],
            access: []
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { cancelConditions: {
                validator: validation_1.cancelConditionsValidator,
            }, automationStepId: {
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['automation_steps'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'nop', // worth keeping as a log of some automated action, even if the automation itself is no longer active
                    }]
            }, enduserId: {
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, journeyId: {
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['journeys'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'nop', // worth keeping as a log of some automated action, even if the automation itself is no longer active
                    }]
            }, event: {
                validator: validation_1.automationEventValidator,
                examples: [{
                        type: "onJourneyStart",
                        info: {},
                    }],
                required: true,
            }, action: {
                validator: validation_1.automationActionValidator,
                required: true,
                examples: [{
                        type: "sendEmail",
                        info: {
                            senderId: constants_1.PLACEHOLDER_ID,
                            templateId: constants_1.PLACEHOLDER_ID,
                        },
                    }]
            }, status: {
                validator: validation_1.automatedActionStatusValidator,
                required: true,
                examples: ['active']
            }, processAfter: {
                validator: validation_1.nonNegNumberValidator,
                required: true,
                examples: [Date.now()],
            } })
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
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
                // dependencies: [{
                //   dependsOn: ['users'], 
                //   dependencyField: '_id',
                //   relationship: 'foreignKey',
                //   onDependencyDelete: 'delete',
                // }]
            }, enduserId: { validator: validation_1.mongoIdStringRequired }, resource: {
                validator: validation_1.stringValidator100,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
            }, resourceId: {
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
            }, action: {
                validator: validation_1.CUDStringValidator,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
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
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {
            send_user_email_notification: {
                op: "custom", access: 'create', method: "post",
                name: 'Send Team Email Notification',
                path: '/send-user-email-notification',
                description: "Sends an email notification to a team member (user)",
                parameters: {
                    userId: { validator: validation_1.mongoIdStringRequired, required: true },
                    message: { validator: validation_1.stringValidator5000, required: true },
                    subject: { validator: validation_1.stringValidator250 },
                },
                returns: {},
            },
            bulk_update: {
                op: "custom", access: 'create', method: "post",
                name: 'Bulk update (read or delete)',
                path: '/notifications/bulk-update',
                description: "Marks all as read, or deletes all notifications",
                parameters: {
                    action: { validator: validation_1.stringValidator250 },
                },
                returns: {},
            },
        },
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { userId: {
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['users'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, type: { validator: validation_1.stringValidator100, required: true, examples: ['type'] }, message: { validator: validation_1.stringValidator5000, required: true, examples: ['message'] }, read: { validator: validation_1.booleanValidator }, relatedRecords: { validator: validation_1.listOfRelatedRecordsValidator } })
    },
    enduser_observations: {
        info: {},
        constraints: {
            unique: [],
            relationship: [],
        },
        defaultActions: __assign(__assign({}, constants_1.DEFAULT_OPERATIONS), { create: {
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
                    from: { validator: validation_1.dateValidator, required: true },
                    to: { validator: validation_1.dateValidator, required: true },
                    enduserId: { validator: validation_1.mongoIdStringRequired },
                    careTeam: { validator: validation_1.listOfMongoIdStringValidatorOptionalOrEmptyOk },
                    unreviewed: { validator: validation_1.booleanValidator },
                },
                returns: {
                    observations: { validator: 'enduser_observations', required: true },
                },
            },
            acknowledge: {
                op: "custom", access: 'update', method: "post",
                name: 'Acknowledge Observations (Vitals)',
                path: '/enduser-observations/acknowledge',
                description: "Bulk acknowledge (mark reviewed) EnduserObservations",
                parameters: {
                    ids: { validator: validation_1.listOfMongoIdStringValidator, required: true },
                },
                returns: {},
            },
        },
        enduserActions: { create: {}, createMany: {}, read: {}, readMany: {}, load: {} },
        fields: __assign(__assign({}, BuiltInFields), { category: {
                required: true,
                validator: validation_1.FHIRObservationCategoryValidator,
                examples: ['vital-signs'],
            }, status: {
                required: true,
                validator: validation_1.FHIRObservationStatusCodeValidator,
                examples: ['final'],
            }, measurement: {
                required: true,
                validator: validation_1.FHIRObservationValueValidator,
                examples: [{
                        unit: 'mmol',
                        value: 8,
                    }],
            }, enduserId: {
                required: true,
                validator: validation_1.mongoIdStringRequired,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, code: { validator: validation_1.stringValidator }, source: { validator: validation_1.stringValidator }, type: { validator: validation_1.stringValidator }, notes: { validator: validation_1.stringValidator }, recordedAt: { validator: validation_1.dateValidator }, reviewedAt: { validator: validation_1.dateValidatorOptional }, timestamp: { validator: validation_1.dateValidator, initializer: function () { return new Date(); } }, statusChangedBy: { validator: validation_1.mongoIdStringRequired }, beforeMeal: { validator: validation_1.booleanValidator }, dontTrigger: { validator: validation_1.booleanValidator }, references: { validator: validation_1.listOfRelatedRecordsValidator, readonly: true }, showWithPlotsByUnit: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk }, invalidationReason: { validator: validation_1.stringValidatorOptionalEmptyOkay } })
    },
    managed_content_records: {
        info: {},
        constraints: {
            unique: [],
            relationship: [],
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {
            update_indexes: {
                op: "custom", access: 'update', method: "patch",
                name: 'Update Indexes',
                path: '/managed-content-records/update-indexes',
                description: "Updates indexes for a number of managed content records to adjust the default sorting",
                parameters: {
                    updates: { validator: validation_1.indexUpdatesValidator, required: true },
                },
                returns: {},
            },
            generate_embedding: {
                op: 'custom', access: 'delete', method: 'post',
                path: '/managed-content-records/generate-embedding',
                description: "",
                parameters: { id: { validator: validation_1.mongoIdStringRequired, required: true } },
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
                    query: { validator: validation_1.stringValidator, required: true },
                    type: { validator: (0, validation_1.exactMatchValidator)(['enduser', 'internal']) },
                },
                returns: {
                    record: { validator: 'managed_content_record', required: true },
                    matches: { validator: 'managed_content_records', required: true },
                    response: { validator: validation_1.stringValidator, required: true, }
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
                    id: { validator: validation_1.mongoIdStringRequired, required: true },
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
        fields: __assign(__assign({}, BuiltInFields), { slug: { validator: validation_1.stringValidator250 }, title: {
                validator: validation_1.stringValidator1000,
                required: true,
                examples: ["Template Name"],
            }, category: {
                validator: validation_1.stringValidator100,
            }, description: {
                validator: validation_1.stringValidator5000,
                examples: ["Template Subject"],
            }, textContent: {
                validator: validation_1.stringValidator25000,
                required: true,
                examples: ["This is the template message......"],
            }, htmlContent: {
                validator: validation_1.stringValidator25000,
                examples: ["This is the template message......"],
            }, editorState: {
                validator: validation_1.stringValidator25000,
                examples: ["This is the template message......"],
            }, type: {
                validator: validation_1.managedContentRecordTypeValidator,
                updatesDisabled: true,
            }, enduserId: {
                validator: validation_1.mongoIdStringRequired,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete', // if enduserId exist (should only be for Individual), clean up as dependency of enduser
                    }]
            }, assignmentType: { validator: validation_1.managedContentRecordAssignmentTypeValidator }, attachments: {
                validator: validation_1.listOfChatAttachmentsValidator,
            }, blocks: { validator: validation_1.blocksValidator }, headerPhoto: { validator: validation_1.stringValidator250 }, publicRead: { validator: validation_1.booleanValidator }, mode: { validator: validation_1.messageTemplateModeValidator, }, files: { validator: validation_1.listOfStringsValidatorEmptyOk }, tags: { validator: validation_1.listOfStringsValidatorEmptyOk }, embeddingType: { validator: validation_1.embeddingTypeValidator }, embedding: { validator: (0, validation_1.listValidator)(validation_1.numberValidator) }, forInternalUse: { validator: validation_1.booleanValidator }, allowUnauthenticatedAccess: { validator: validation_1.booleanValidator }, portalIndex: { validator: validation_1.numberValidator } })
    },
    managed_content_record_assignments: {
        info: {},
        constraints: {
            unique: [
                ['contentId', 'enduserId'],
            ],
            relationship: [],
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: { read: {}, readMany: {} },
        fields: __assign(__assign({}, BuiltInFields), { contentId: {
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['managed_content_records'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, enduserId: {
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
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
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: { read: {}, readMany: {} },
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: validation_1.stringValidator100,
                required: true,
                examples: ["Template Name"],
            }, description: {
                validator: validation_1.stringValidator5000,
                examples: ["Template Subject"],
            }, publicRead: { validator: validation_1.booleanValidator }, slug: { validator: validation_1.stringValidator250 } }),
    },
    forum_posts: {
        info: {},
        constraints: {
            unique: [],
            relationship: [],
            access: [{ type: 'dependency', foreignModel: 'forums', foreignField: '_id', accessField: 'forumId' }]
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: { create: {}, read: {}, readMany: {}, update: { creatorOnly: true }, delete: { creatorOnly: true } },
        fields: __assign(__assign({}, BuiltInFields), { forumId: {
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['forums'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, postedBy: {
                validator: validation_1.userIdentityValidator,
                initializer: function (_, s) { return ({ type: s.type, id: s.id }); }
            }, numComments: {
                validator: validation_1.nonNegNumberValidator,
                initializer: function () { return 0; },
                updatesDisabled: true,
            }, numLikes: {
                validator: validation_1.nonNegNumberValidator,
                updatesDisabled: true,
                initializer: function () { return 0; },
            }, title: {
                validator: validation_1.stringValidator5000,
                required: true,
                examples: ["This is the template message......"],
            }, textContent: {
                validator: validation_1.stringValidator25000,
                required: true,
                examples: ["This is the template message......"],
            }, htmlContent: {
                validator: validation_1.stringValidator25000,
                examples: ["This is the template message......"],
            }, editorState: {
                validator: validation_1.stringValidator25000,
                examples: ["This is the template message......"],
            }, slug: { validator: validation_1.stringValidator250 }, attachments: {
                validator: validation_1.listOfChatAttachmentsValidator,
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
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: { create: {}, read: {}, readMany: {}, delete: { creatorOnly: true } },
        fields: __assign(__assign({}, BuiltInFields), { forumId: {
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['forums'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, postId: {
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['forum_posts'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, threadId: {
                validator: validation_1.mongoIdStringRequired,
                examples: [constants_1.PLACEHOLDER_ID],
                initializer: function (s) { var _a; return (_a = s.replyTo) !== null && _a !== void 0 ? _a : ''; },
                dependencies: [{
                        dependsOn: ['post_comments'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'nop',
                    }]
            }, replyTo: {
                validator: validation_1.mongoIdStringRequired,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['post_comments'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'nop',
                    }]
            }, postedBy: {
                validator: validation_1.userIdentityValidator,
                initializer: function (_, s) { return ({ type: s.type, id: s.id }); },
            }, attachments: { validator: validation_1.listOfStringsValidator }, textContent: {
                validator: validation_1.stringValidator25000,
                required: true,
                examples: ["This is the template message......"],
            }, htmlContent: {
                validator: validation_1.stringValidator25000,
                examples: ["This is the template message......"],
            }, editorState: {
                validator: validation_1.stringValidator25000,
                examples: ["This is the template message......"],
            }, numLikes: { validator: validation_1.nonNegNumberValidator, updatesDisabled: true }, numReplies: { validator: validation_1.nonNegNumberValidator, updatesDisabled: true } }),
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
                    postId: { validator: validation_1.mongoIdStringRequired, required: true },
                    forumId: { validator: validation_1.mongoIdStringRequired, required: true },
                },
                returns: {} //authToken: { validator: stringValidator5000 } },
            },
            unlike_post: {
                op: "custom", access: 'update', method: "post",
                name: 'Unlike Forum Post',
                path: '/unlike-forum-post',
                description: "Removes a like for a given forum post",
                parameters: {
                    postId: { validator: validation_1.mongoIdStringRequired, required: true },
                    forumId: { validator: validation_1.mongoIdStringRequired, required: true },
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
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['forums'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, postId: {
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
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
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['forums'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, postId: {
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['forum_posts'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, commentId: {
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
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
                    name: { validator: validation_1.stringValidator250, required: true },
                    subdomain: { validator: validation_1.slugValidator, required: true },
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
                    name: { validator: validation_1.stringValidator250, required: true },
                    subdomain: { validator: validation_1.slugValidator, required: true },
                },
                returns: {
                    authToken: { validator: validation_1.stringValidator, required: true },
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
                    startAt: { validator: validation_1.dateValidator },
                    type: { validator: validation_1.athenaSubscriptionTypeValidator, required: true },
                    frequency: { validator: validation_1.nonNegNumberValidator, required: true },
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
                    type: { validator: validation_1.athenaSubscriptionTypeValidator, required: true },
                    backgroundTaskId: { validator: validation_1.mongoIdStringOptional, },
                    enduserId: { validator: validation_1.mongoIdStringOptional, },
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
                    enduserId: { validator: validation_1.mongoIdStringRequired, required: true },
                    note: { validator: validation_1.stringValidator25000, required: true },
                },
                returns: {
                    canvasId: { validator: validation_1.stringValidator100, required: true }
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
                description: "Gets detail to load an embedded Twilio UI in Tellescope",
                parameters: {
                    type: { validator: validation_1.stringValidator },
                },
                returns: {
                    id: { validator: validation_1.stringValidator, required: true },
                    token: { validator: validation_1.stringValidator, required: true },
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
                    businessId: { validator: validation_1.mongoIdStringRequired },
                    organizationIds: { validator: validation_1.listOfMongoIdStringValidatorEmptyOk },
                },
                returns: {
                    theme: { validator: validation_1.organizationThemeValidator, required: true },
                }
            },
        },
        fields: __assign(__assign({}, BuiltInFields), { bedrockAIAllowed: { validator: validation_1.booleanValidator }, creditCount: { validator: validation_1.numberValidator, readonly: true }, stripeKeyDetails: {
                validator: (0, validation_1.listValidatorOptionalOrEmptyOk)((0, validation_1.objectValidator)({
                    key: validation_1.stringValidator5000EmptyOkay,
                    title: validation_1.stringValidator5000EmptyOkay,
                }))
            }, name: {
                validator: validation_1.stringValidator100,
                required: true,
                examples: ["Template Name"],
            }, subdomain: {
                validator: validation_1.slugValidator,
                required: true,
                examples: ["subdomain"],
            }, limits: {
                validator: validation_1.organizationLimitsValidator,
                readonly: true, // to be set by Tellescope super admin only
            }, owner: { validator: validation_1.mongoIdStringRequired }, parentOrganizationId: { validator: validation_1.mongoIdStringRequired }, subscriptionExpiresAt: { validator: validation_1.dateValidator }, subscriptionPeriod: { validator: validation_1.numberValidator }, logoVersion: { validator: validation_1.numberValidator }, faviconVersion: { validator: validation_1.numberValidator }, roles: { validator: validation_1.listOfStringsValidatorEmptyOk }, skills: { validator: validation_1.listOfStringsValidator }, themeColor: { validator: validation_1.stringValidator100 }, themeColorSecondary: { validator: validation_1.stringValidator100 }, enduserDisplayName: { validator: validation_1.stringValidator100 }, customPortalURL: { validator: validation_1.stringValidator250 }, customPortalURLs: { validator: validation_1.listOfStringsValidator }, subdomains: { validator: validation_1.listOfStringsValidator }, portalSettings: { validator: validation_1.portalSettingsValidator }, settings: { validator: validation_1.organizationSettingsValidator }, timezone: { validator: validation_1.timezoneValidator }, forwardAllIncomingEmailsTo: { validator: validation_1.emailValidator }, zendeskSettings: {
                validator: (0, validation_1.objectValidator)({
                    priorityGroups: validation_1.listOfStringsValidatorOptionalOrEmptyOk,
                    resolutionFieldId: validation_1.stringValidatorOptionalEmptyOkay,
                    resolutionFieldOptions: validation_1.listOfStringsValidatorOptionalOrEmptyOk,
                })
            }, hasTicketQueues: { validator: validation_1.booleanValidator }, customAutoreplyMessage: { validator: validation_1.stringValidator1000 }, altVitalTeamIds: { validator: (0, validation_1.listValidatorEmptyOk)((0, validation_1.objectValidator)({
                    teamId: validation_1.stringValidator100,
                    label: validation_1.stringValidator100,
                })) }, billingOrganizationName: { validator: validation_1.stringValidator }, billingOrganizationNPI: { validator: validation_1.stringValidator }, billingOrganizationTaxId: { validator: validation_1.stringValidator }, billingOrganizationAddress: { validator: validation_1.addressValidator }, videoCallBackgroundImage: { validator: validation_1.stringValidator }, sendToVoicemailOOO: { validator: validation_1.booleanValidator }, forwardingOOONumber: { validator: validation_1.phoneValidator }, onCallUserIds: { validator: validation_1.listOfUniqueStringsValidatorEmptyOk }, outOfOfficeVoicemail: { validator: validation_1.phonePlaybackValidator }, enduserProfileWebhooks: { validator: validation_1.enduserProfileWebhooksValidator }, showCommunity: { validator: validation_1.booleanValidator }, phoneLabels: {
                validator: (0, validation_1.listValidatorOptionalOrEmptyOk)((0, validation_1.objectValidator)({
                    label: validation_1.stringValidator100,
                    number: validation_1.stringValidator100,
                }))
            }, athenaFieldsSync: { validator: validation_1.fieldsSyncValidator }, athenaDepartments: {
                validator: (0, validation_1.listValidatorOptionalOrEmptyOk)((0, validation_1.objectValidator)({
                    id: validation_1.stringValidator100,
                    timezone: validation_1.timezoneValidator,
                }))
            }, fieldsToAdminNote: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk }, canvasMessageSync: {
                validator: (0, validation_1.objectValidator)({
                    id: validation_1.stringValidator100,
                    questionId: validation_1.stringValidator100,
                })
            }, canvasSyncEmailConsent: { validator: validation_1.booleanValidator }, canvasSyncPhoneConsent: { validator: validation_1.booleanValidator }, enforceMFA: { validator: validation_1.booleanValidator }, replyToEnduserTransactionalEmails: { validator: validation_1.emailValidator }, customTermsOfService: { validator: validation_1.stringValidator }, customPrivacyPolicy: { validator: validation_1.stringValidator }, customPolicies: { validator: validation_1.customPoliciesValidator }, customPoliciesVersion: { validator: validation_1.stringValidator }, requireCustomTermsOnMagicLink: { validator: validation_1.booleanValidator }, allowCreateSuborganizations: { validator: validation_1.booleanValidator }, answersSyncToPortal: {
                validator: (0, validation_1.listValidatorOptionalOrEmptyOk)((0, validation_1.objectValidator)({
                    id: validation_1.stringValidator100,
                    questions: (0, validation_1.listValidatorEmptyOk)(validation_1.stringValidator1000),
                }))
            }, externalFormIdsToSync: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk }, analyticsIframes: {
                validator: (0, validation_1.listValidatorOptionalOrEmptyOk)((0, validation_1.objectValidator)({
                    title: validation_1.stringValidator1000,
                    iframeURL: validation_1.stringValidator1000,
                }))
            }, defaultDoseSpotPharmacies: {
                validator: (0, validation_1.listValidatorOptionalOrEmptyOk)((0, validation_1.objectValidator)({
                    id: validation_1.stringValidator100,
                    name: validation_1.stringValidator,
                }))
            }, groups: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, canvasURL: { validator: validation_1.stringValidator }, observationInvalidationReasons: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, customNotificationTypes: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, customerIOFields: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, customerIOIdField: { validator: validation_1.stringValidator }, createEnduserForms: { validator: validation_1.listOfMongoIdStringValidatorOptionalOrEmptyOk } }),
    },
    databases: {
        info: {},
        constraints: {
            unique: ['title'],
            relationship: [],
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: validation_1.stringValidator100,
                required: true,
                examples: ["Template Name"],
            }, fields: {
                required: true,
                validator: validation_1.databaseFieldsValidator,
            }, numRecords: {
                readonly: true,
                validator: validation_1.nonNegNumberValidator,
                initializer: function () { return 0; },
            }, 
            // organizationRead: { validator: booleanValidator },
            visibleForRoles: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk } }),
    },
    database_records: {
        info: {},
        constraints: {
            unique: [],
            relationship: [],
            access: [{ type: 'dependency', foreignModel: 'databases', foreignField: '_id', accessField: 'databaseId' }]
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { databaseId: {
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['databases'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, values: {
                required: true,
                validator: validation_1.databaseRecordValuesValidator,
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
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: { readMany: {} },
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: validation_1.stringValidator1000,
                examples: ['Example Title']
            }, page: {
                validator: validation_1.stringValidator100,
                required: true,
                examples: ['Home']
            }, blocks: {
                required: true,
                examples: [[]],
                validator: validation_1.portalBlocksValidator,
            }, disabled: { validator: validation_1.booleanValidator }, mobileBottomNavigationPosition: { validator: validation_1.nonNegNumberValidator }, headerImageURL: { validator: validation_1.stringValidator1000 }, iframeURL: { validator: validation_1.stringValidator1000 }, iconURL: { validator: validation_1.stringValidator1000 }, activeIconURL: { validator: validation_1.stringValidator1000 }, showStripePortalLink: { validator: validation_1.booleanValidator }, hideCancellatation: { validator: validation_1.booleanValidator }, hideReschedule: { validator: validation_1.booleanValidator }, hiddenEventTitles: { validator: validation_1.listOfStringsValidatorEmptyOk }, hiddenFormIds: { validator: validation_1.listOfMongoIdStringValidatorOptionalOrEmptyOk }, brandId: { validator: validation_1.mongoIdStringRequired, examples: [constants_1.PLACEHOLDER_ID] } }),
    },
    enduser_tasks: {
        info: {},
        constraints: {
            unique: [],
            relationship: [],
            access: []
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: { update: {}, read: {}, readMany: {} },
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: validation_1.stringValidator1000,
                required: true,
                examples: ['Example Title']
            }, enduserId: {
                validator: validation_1.mongoIdStringRequired,
                examples: [constants_1.PLACEHOLDER_ID],
                required: true,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, completedAt: { validator: validation_1.dateValidator }, description: { validator: validation_1.stringValidator1000 } }),
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
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: { read: {}, readMany: {} },
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: validation_1.stringValidator1000,
                required: true,
                examples: ['Example Title']
            }, enduserId: {
                validator: validation_1.mongoIdStringRequired,
                examples: [constants_1.PLACEHOLDER_ID],
                required: true,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, description: {
                validator: validation_1.stringValidator1000,
            }, eventIds: {
                validator: validation_1.listOfMongoIdStringValidatorEmptyOk,
            }, journeyId: { validator: validation_1.mongoIdStringRequired }, completedAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, htmlDescription: { validator: validation_1.stringValidator100000EmptyOkay }, hideRemainingTicketsProgress: { validator: validation_1.booleanValidator }, highlightedEnduserFields: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk }, closeAutomaticallyByTicket: { validator: validation_1.booleanValidator } }),
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
                validator: validation_1.stringValidator250,
                required: true,
                examples: ["Role"],
            }, permissions: {
                validator: validation_1.accessPermissionsValidator,
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
            }, uiRestrictions: { validator: validation_1.userUIRestrictionsValidator } })
    },
    appointment_booking_pages: {
        info: {},
        constraints: {
            unique: ['title'],
            relationship: [],
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {
            generate_access_token: {
                op: "custom", access: 'create', method: "post",
                name: 'Generate Access Token',
                path: '/appointment-booking-pages/generate-access-token',
                description: "Generates a 1-time access token for booking an appointment",
                parameters: {
                    expiresAt: { validator: validation_1.dateValidator, required: true },
                    bookingPageId: { validator: validation_1.mongoIdStringRequired },
                },
                returns: {
                    token: { validator: validation_1.stringValidator, required: true },
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
                    token: { validator: validation_1.stringValidator, required: true },
                    bookingPageId: { validator: validation_1.mongoIdStringRequired },
                },
                returns: {
                    isValid: { validator: validation_1.booleanValidator, required: true },
                }
            },
        },
        enduserActions: {
            read: {}, readMany: {}, validate_access_token: {},
        },
        fields: __assign(__assign({}, BuiltInFields), { dontRestrictRescheduleToOriginalHost: { validator: validation_1.booleanValidator }, gtmTag: { validator: validation_1.stringValidator100EscapeHTML }, archivedAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, title: {
                validator: validation_1.stringValidator100,
                required: true,
                examples: ["Appointment Booking Title"]
            }, calendarEventTemplateIds: {
                validator: validation_1.listOfMongoIdStringValidator,
                required: true,
                examples: [[constants_1.PLACEHOLDER_ID]]
            }, locationIds: {
                validator: validation_1.listOfMongoIdStringValidatorEmptyOk,
                required: true,
                examples: [[constants_1.PLACEHOLDER_ID]]
            }, terms: { validator: validation_1.appointmentTermsValidator }, endDate: { validator: validation_1.dateValidator }, startDate: { validator: validation_1.dateValidator }, backgroundColor: { validator: validation_1.stringValidator100 }, primaryColor: { validator: validation_1.stringValidator100 }, secondaryColor: { validator: validation_1.stringValidator100 }, intakeTitle: { validator: validation_1.stringValidator1000 }, intakeDescription: { validator: validation_1.stringValidator1000 }, thankYouRedirectURL: { validator: validation_1.stringValidator1000 }, thankYouTitle: { validator: validation_1.stringValidator1000 }, thankYouDescription: { validator: validation_1.stringValidator1000 }, thankYouHeaderImageURL: { validator: validation_1.stringValidator1000 }, thankYouMainImageURL: { validator: validation_1.stringValidator1000 }, ga4measurementId: { validator: validation_1.stringValidator100 }, hiddenFromPortal: { validator: validation_1.booleanValidator }, hoursBeforeBookingAllowed: { validator: validation_1.numberValidatorOptional }, limitedToCareTeam: { validator: validation_1.booleanValidator }, limitedByState: { validator: validation_1.booleanValidator }, limitedByTagsPortal: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, topLogo: { validator: validation_1.stringValidator }, requireLocationSelection: { validator: validation_1.booleanValidator }, fontFace: { validator: validation_1.stringValidator }, fontFamily: { validator: validation_1.stringValidator5000EmptyOkay }, fontURL: { validator: validation_1.stringValidator }, collectReason: { validator: (0, validation_1.exactMatchValidator)(['Do Not Collect', 'Optional', 'Required']) }, restrictionsByTemplate: { validator: validation_1.bookingRestrictionsByTemplateValidator }, publicMulti: { validator: validation_1.booleanValidator }, publicUserTags: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, publicUserFilterTags: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, appointmentSlotsMaxHeight: { validator: validation_1.numberValidatorOptional }, includeRelatedContactTypes: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay } })
    },
    appointment_locations: {
        info: {},
        constraints: {
            unique: ['title'],
            relationship: [],
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: { read: {}, readMany: {} },
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: validation_1.stringValidator100,
                required: true,
                examples: ["Appointment Booking Title"]
            }, address: { validator: validation_1.stringValidator1000 }, city: { validator: validation_1.stringValidator }, zipCode: { validator: validation_1.stringValidator1000 }, phone: { validator: validation_1.stringValidator }, state: { validator: validation_1.stateValidator }, timezone: { validator: validation_1.timezoneValidator }, canvasLocationId: { validator: validation_1.stringValidator1000 }, healthieContactType: { validator: validation_1.stringValidator100 }, healthieLocationId: { validator: validation_1.stringValidator100 }, healthieUseZoom: { validator: validation_1.booleanValidator }, instructions: { validator: validation_1.stringValidator5000EmptyOkay }, tags: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay } })
    },
    products: {
        info: {},
        constraints: {
            unique: ['title'],
            relationship: [],
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {
            prepare_stripe_checkout: {
                op: "custom", access: 'create', method: "post",
                name: 'Prepare Stripe Checkout',
                path: '/products/prepare-stripe-checkout',
                description: "Prepares a Stripe checkout process",
                parameters: {
                    productIds: { validator: validation_1.listOfMongoIdStringValidator, required: true },
                },
                returns: {
                    clientSecret: { validator: validation_1.stringValidator, required: true },
                    customerId: { validator: validation_1.stringValidator, required: true },
                    publishableKey: { validator: validation_1.stringValidator, required: true },
                    stripeAccount: { validator: validation_1.stringValidator, required: true },
                    businessName: { validator: validation_1.stringValidator, required: true },
                },
            },
            get_stripe_portal_session: {
                op: "custom", access: 'read', method: "get",
                name: 'Get Stripe Portal Session (Enduser Only)',
                path: '/products/stripe-portal-session',
                description: "Prepares a Stripe checkout process",
                parameters: {
                    stripeKey: { validator: validation_1.stringValidator250, },
                    stripeCustomerId: { validator: validation_1.stringValidator100, },
                    return_url: { validator: validation_1.stringValidator, required: true },
                },
                returns: {
                    url: { validator: validation_1.stringValidator, required: true },
                },
            },
        },
        enduserActions: {
            read: {}, readMany: {},
            prepare_stripe_checkout: {},
            get_stripe_portal_session: {},
        },
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: validation_1.stringValidator100,
                required: true,
                examples: ["Product Title"]
            }, cost: {
                validator: validation_1.costValidator,
                required: true,
                examples: [{ amount: 500, currency: 'USD' }],
            }, processor: {
                validator: validation_1.paymentProcessorValidator,
                examples: ['Stripe'],
            }, description: { validator: validation_1.stringValidator5000EmptyOkay }, htmlDescription: { validator: validation_1.stringValidator25000EmptyOkay }, cptCode: { validator: validation_1.billingCodeValidatorOptional }, image: { validator: validation_1.stringValidator100000EmptyOkay }, showInPortal: { validator: validation_1.booleanValidator }, categories: { validator: validation_1.listOfStringsValidatorEmptyOk }, maxCheckoutCount: { validator: validation_1.numberValidatorOptional }, stripeProductId: { validator: validation_1.stringValidator100 }, stripeSubscriptionId: { validator: validation_1.stringValidator100 }, stripePriceId: { validator: validation_1.stringValidator100 }, additionalStripePriceIds: { validator: validation_1.listOfStringsValidatorEmptyOk } })
    },
    purchases: {
        info: {},
        constraints: { unique: [], relationship: [] },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {
            charge_card_on_file: {
                op: "custom", access: 'create', method: "post",
                name: 'Charge Stripe Card on File',
                path: '/purchases/charge-card',
                description: "Charges an existing card on file (if saved), otherwise throws an error",
                parameters: {
                    enduserId: { validator: validation_1.mongoIdStringRequired, required: true },
                    productIds: { validator: validation_1.listOfMongoIdStringValidatorEmptyOk },
                    priceIds: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk },
                    cost: { validator: validation_1.costValidator },
                    stripeKey: { validator: validation_1.stringValidator },
                    description: { validator: validation_1.stringValidator },
                },
                returns: {},
            },
        },
        enduserActions: { read: {}, readMany: {} },
        fields: __assign(__assign({}, BuiltInFields), { productId: {
                validator: validation_1.mongoIdStringRequired,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['products'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'nop',
                    }]
            }, productIds: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk }, enduserId: {
                validator: validation_1.mongoIdStringRequired,
                examples: [constants_1.PLACEHOLDER_ID],
                required: true,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, title: {
                validator: validation_1.stringValidator100,
                required: true,
                examples: ["Product Title"]
            }, cost: {
                validator: validation_1.costValidator,
                required: true,
                examples: [{ amount: 500, currency: 'USD' }],
            }, processor: {
                validator: validation_1.paymentProcessorValidator,
                required: true,
                examples: ['Stripe'],
            }, 
            // for timestamp of old/imported data processed before Tellescope
            processedAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, description: { validator: validation_1.stringValidator5000EmptyOkay }, refundedAmount: { validator: validation_1.nonNegNumberValidator }, source: { validator: validation_1.stringValidatorOptional }, externalId: { validator: validation_1.stringValidator }, cptCode: { validator: validation_1.billingCodeValidatorOptional }, notes: { validator: validation_1.stringValidator5000EmptyOkay } })
    },
    purchase_credits: {
        info: {},
        constraints: { unique: [], relationship: [], },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { enduserId: {
                validator: validation_1.mongoIdStringRequired,
                examples: [constants_1.PLACEHOLDER_ID],
                required: true,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, title: {
                validator: validation_1.stringValidator100,
                required: true,
                examples: ["Purchase Credit"]
            }, value: {
                validator: validation_1.purchaseCreditValueValidator,
                required: true,
                examples: [{
                        type: "Credit",
                        info: { amount: 100, currency: "USD" },
                    }]
            }, usedAt: { validator: validation_1.dateOptionalOrEmptyStringValidator, }, description: { validator: validation_1.stringValidator5000EmptyOkay } })
    },
    phone_calls: {
        info: {
            description: ("\"to\" and \"from\" represent phone numbers. To represent the caller and callee, set userId and enduserId.\n\n{ \"isVoicemail\": true } indicates that an inbound call was not answered, but not necessarily that a full voicemail was left\nIf a voicemail is left, it is indicated by recordingURI, transcription, or recordingDurationInSeconds        \n")
        },
        constraints: {
            unique: [],
            relationship: [],
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {
            authenticate_calling: {
                op: "custom", access: 'create', method: "post",
                name: 'Start Phone Call',
                path: '/authenticate-twilio-phone-call',
                description: "Generates an access token for creating / receiving calls via Twilio",
                parameters: {
                    os: { validator: (0, validation_1.exactMatchValidator)(['ios', 'android']) },
                    type: { validator: validation_1.userCallRoutingBehaviorValidator },
                },
                returns: {
                    accessToken: { validator: validation_1.stringValidator, required: true },
                    identity: { validator: validation_1.stringValidator, required: true },
                }
            },
            get_report: {
                op: "custom", access: 'read', method: "get",
                name: 'Report',
                path: '/phone-calls/report',
                description: "Builds a report",
                parameters: {
                    queries: { validator: validation_1.phoneCallsReportQueriesValidator, required: true },
                    range: { validator: validation_1.dateRangeOptionalValidator },
                    enduserFilter: { validator: validation_1.objectAnyFieldsAnyValuesValidator },
                },
                returns: {
                    report: { validator: validation_1.objectAnyFieldsAnyValuesValidator, required: true }
                },
            },
            get_number_report: {
                op: "custom", access: 'read', method: "get",
                name: 'Number Report',
                path: '/phone-calls/number-report',
                description: "Builds a report showing call details by organization and user phone numbers",
                parameters: {
                    range: { validator: validation_1.dateRangeOptionalValidator },
                },
                returns: {
                    report: { validator: validation_1.objectAnyFieldsAnyValuesValidator, required: true }
                },
            },
            upgrade_to_conference: {
                op: "custom", access: 'update', method: "post",
                name: 'Upgrade to Conference',
                path: '/phone-calls/upgrade-to-conference',
                description: "Upgrades a live inbound call to a conference call",
                parameters: {
                    id: { validator: validation_1.stringValidator100, required: true },
                },
                returns: {},
            },
            add_conference_attendees: {
                op: "custom", access: 'update', method: "post",
                name: 'Remove Conference Attendees',
                path: '/phone-calls/add-conference-attendees',
                description: "Adds attendees to conference call",
                parameters: {
                    conferenceId: { validator: validation_1.stringValidator100, required: true },
                    enduserId: { validator: validation_1.mongoIdStringRequired },
                    byClientId: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk },
                    byPhone: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk },
                },
                returns: {},
            },
            remove_conference_attendees: {
                op: "custom", access: 'update', method: "post",
                name: 'Remove Conference Attendees',
                path: '/phone-calls/remove-conference-attendees',
                description: "Removes attendees from a conference call",
                parameters: {
                    conferenceId: { validator: validation_1.stringValidator100, required: true },
                    byClientId: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk },
                    byPhone: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk },
                },
                returns: {},
            },
            end_conference: {
                op: "custom", access: 'update', method: "post",
                name: 'End Conference',
                path: '/phone-calls/end-conference',
                description: "Ends an active conference call for all participants",
                parameters: {
                    id: { validator: validation_1.stringValidator100, required: true },
                },
                returns: {},
            },
            cancel_recording: {
                op: "custom", access: 'update', method: "post",
                name: 'End Conference',
                path: '/phone-calls/cancel-recording',
                description: "Stops recording an active phone call",
                parameters: {
                    enduserId: { validator: validation_1.mongoIdStringRequired, required: true },
                },
                returns: {},
            },
            delete_recordings: {
                op: "custom", access: 'delete', method: "post",
                name: 'Delete Recordings',
                path: '/phone-calls/delete-recordings',
                description: "Deletes all call recordings in Twilio from a certain date",
                parameters: {
                    callIds: { validator: validation_1.listOfMongoIdStringValidator, required: true },
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
        fields: __assign(__assign({}, BuiltInFields), { markedUnreadForAll: { validator: validation_1.booleanValidator }, inboxStatus: { validator: validation_1.stringValidator100 }, enduserId: {
                validator: validation_1.mongoIdStringRequired,
                examples: [constants_1.PLACEHOLDER_ID],
                required: true,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, inbound: { validator: validation_1.booleanValidator, required: true, examples: [true] }, externalId: { validator: validation_1.stringValidator100 }, to: { validator: validation_1.stringValidator100 }, from: { validator: validation_1.stringValidator100 }, isVoicemail: { validator: validation_1.booleanValidator }, recordingURI: { validator: validation_1.stringValidator1000 }, recordingId: { validator: validation_1.stringValidator100 }, transcriptionId: { validator: validation_1.stringValidator100 }, recordingDurationInSeconds: { validator: validation_1.nonNegNumberValidator }, transcription: { validator: validation_1.stringValidator25000 }, note: { validator: validation_1.stringValidator5000EmptyOkay }, unread: { validator: validation_1.booleanValidator }, userId: { validator: validation_1.mongoIdStringRequired }, ticketId: { validator: validation_1.mongoIdStringRequired }, pinnedAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, readBy: { validator: validation_1.idStringToDateValidator }, hiddenBy: { validator: validation_1.idStringToDateValidator }, hiddenForAll: { validator: validation_1.booleanValidator }, ticketIds: { validator: validation_1.listOfStringsValidatorEmptyOk }, tags: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk }, assignedTo: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, callDurationInSeconds: { validator: validation_1.numberValidator }, timestamp: { validator: validation_1.dateValidator } }),
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
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {
            update_indexes: {
                op: "custom", access: 'update', method: "patch",
                name: 'Update Indexes',
                path: '/analytics-frames/update-indexes',
                description: "Updates indexes for a number of analytics frames to adjust the default sorting",
                parameters: {
                    updates: { validator: validation_1.indexUpdatesValidator, required: true },
                },
                returns: {},
            },
            get_result_for_query: {
                op: "custom", access: 'read', method: "get",
                name: 'Get analytics for query',
                path: '/result-for-analytics-query',
                description: "Returns a computed result for an analytics query",
                parameters: {
                    query: { validator: validation_1.analyticsQueryValidator, required: true },
                    createdRange: { validator: validation_1.dateRangeValidator },
                    createdAvailabilities: { validator: validation_1.weeklyAvailabilitiesValidator },
                    updatedRange: { validator: validation_1.dateRangeValidator },
                    groupByCareTeam: { validator: validation_1.booleanValidator },
                },
                returns: {
                    count: { validator: validation_1.nonNegNumberValidator },
                    percentage: { validator: validation_1.stringValidator },
                    values: { validator: validation_1.analyticsQueryResultsValidator },
                }
            },
            get_custom_report: {
                op: "custom", access: 'read', method: "get",
                name: 'Get custom report',
                path: '/analytics/custom-report',
                description: "For customized analytics reporting, pre-configured by the Tellescope team for a given organization",
                parameters: {
                    key: { validator: validation_1.stringValidator, required: true },
                    lastId: { validator: validation_1.stringValidator },
                    limit: { validator: validation_1.numberValidator },
                },
                returns: { report: { validator: validation_1.objectAnyFieldsAnyValuesValidator, required: true } }
            },
        },
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { createdAvailabilities: { validator: validation_1.weeklyAvailabilitiesValidator }, title: {
                validator: validation_1.stringValidator100,
                examples: ["Example Title"]
            }, query: {
                validator: validation_1.analyticsQueryValidator,
                required: true,
                examples: [{
                        resource: "Endusers",
                        info: {
                            method: 'Total',
                            parameters: {},
                        },
                        filter: {},
                    }],
            }, createdRange: { validator: validation_1.dateRangeValidator }, updatedRange: { validator: validation_1.dateRangeValidator }, parentFrame: {
                validator: validation_1.mongoIdStringRequired,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['analytics_frames'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, type: { validator: validation_1.analyticsFrameTypeValidator }, groupMin: { validator: validation_1.nonNegNumberValidator }, groupMax: { validator: validation_1.nonNegNumberValidator }, groupByCareTeam: { validator: validation_1.booleanValidator }, displayType: { validator: validation_1.stringValidator100 }, analyticsFrameGroupingCategory: { validator: validation_1.analyticsFrameGroupingCategoriesValidator }, truncationLength: { validator: validation_1.nonNegNumberValidator }, showEllipsis: { validator: validation_1.booleanValidator }, orderedLabels: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, overrideGlobalRange: { validator: validation_1.booleanValidator }, visibleForRoles: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, visibleForUserIds: { validator: validation_1.listOfMongoIdStringValidatorOptionalOrEmptyOk } }),
    },
    availability_blocks: {
        info: {},
        constraints: {
            unique: [],
            relationship: [],
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {
            update_order: {
                op: "custom", access: 'update', method: "post",
                name: 'Update order of availability blocks',
                path: '/update-order-of-availability-blocks',
                description: "Returns a computed result for an analytics query",
                parameters: {
                    indexUpdates: { validator: validation_1.indexUpdatesValidator, required: true }
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
                    channel: { validator: validation_1.communicationsChannelValidator, required: true },
                    // messageId: { validator: mongoIdStringValidator, required: true },
                    enduserId: { validator: validation_1.mongoIdStringRequired, required: true },
                    threadId: { validator: validation_1.mongoIdStringRequired },
                    userId: { validator: validation_1.mongoIdStringRequired },
                },
                returns: {}
            },
        },
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { entity: { validator: validation_1.availabilityEntitiesValidator, required: true, examples: ['organization'] }, entityId: {
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
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
            }, index: { validator: validation_1.nonNegNumberValidator, required: true, examples: [30] }, dayOfWeekStartingSundayIndexedByZero: { validator: validation_1.nonNegNumberValidator, required: true, examples: [30] }, startTimeInMinutes: { validator: validation_1.nonNegNumberValidator, required: true, examples: [30] }, endTimeInMinutes: { validator: validation_1.nonNegNumberValidator, required: true, examples: [30] }, active: { validator: validation_1.dateRangeOptionalValidator }, source: { validator: validation_1.stringValidator100 }, externalId: { validator: validation_1.stringValidator100 }, typeId: { validator: validation_1.stringValidator100 }, athenaDepartmentId: { validator: validation_1.stringValidator100 } }),
    },
    enduser_views: {
        info: {},
        constraints: { unique: ['title'], relationship: [], },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: validation_1.stringValidator100,
                required: true,
                examples: ["Custom View"]
            }, fields: {
                validator: validation_1.listOfStringsValidator,
            }, filter: { validator: validation_1.objectAnyFieldsAnyValuesValidator }, defaultForRole: { validator: validation_1.stringValidator100 }, defaultForUserIds: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk }, hideFromRoles: { validator: validation_1.listOfStringsValidatorEmptyOk }, hideProfileLink: { validator: validation_1.booleanValidator }, customTypeId: { validator: validation_1.mongoIdStringRequired }, style: { validator: validation_1.objectAnyFieldsAnyValuesValidator }, sort: { validator: validation_1.sortingFieldsValidator } })
    },
    enduser_profile_views: {
        info: {},
        constraints: { unique: ['title'], relationship: [], },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: validation_1.stringValidator100,
                required: true,
                examples: ["Custom Profile View"]
            }, blocks: {
                validator: validation_1.enduserProfileViewBlocksValidator,
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
            }, showCompose: { validator: validation_1.booleanValidator }, defaultForRoles: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, hiddenFromRoles: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, defaultForUserIds: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay } })
    },
    background_errors: {
        info: {},
        constraints: { unique: [], relationship: [], },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
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
                validator: validation_1.stringValidator100,
                required: true,
                examples: ["Automation Error"]
            }, message: {
                validator: validation_1.stringValidator25000,
                required: true,
                examples: ["Details relating to an automation error"]
            }, acknowledgedAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, journeyId: { validator: validation_1.mongoIdStringRequired }, enduserId: { validator: validation_1.mongoIdStringRequired } })
    },
    automation_triggers: {
        info: {},
        // making title unique causes issues in journey copy when creating copy of waitForTrigger action
        constraints: { unique: [], relationship: [], },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {
            trigger_events: {
                op: "custom", access: 'create', method: "post",
                adminOnly: true,
                name: 'Trigger Event',
                path: '/automation-triggers/trigger-events',
                description: "Triggers a list of events for endusers",
                parameters: {
                    triggers: {
                        validator: (0, validation_1.listValidator)((0, validation_1.objectValidator)({
                            action: validation_1.objectAnyFieldsAnyValuesValidator,
                            automationTriggerId: validation_1.mongoIdStringRequired,
                            enduserId: validation_1.mongoIdStringRequired,
                            journeyContext: validation_1.optionalAnyObjectValidator,
                        })),
                        required: true,
                    }
                },
                returns: {}
            },
        },
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: validation_1.stringValidator100,
                required: true,
                examples: ["Automation Trigger"]
            }, event: {
                validator: validation_1.automationTriggerEventValidator,
                required: true,
                examples: [
                    {
                        type: "Form Submitted",
                        info: {
                            formId: constants_1.PLACEHOLDER_ID
                        }
                    }
                ]
            }, action: {
                validator: validation_1.automationTriggerActionValidator,
                required: true,
                examples: [
                    {
                        type: "Add To Journey",
                        info: {
                            journeyId: constants_1.PLACEHOLDER_ID
                        }
                    }
                ]
            }, status: {
                validator: validation_1.automatioNTriggerStatusValidator,
                required: true,
                examples: ["Active"]
            }, enduserCondition: {
                validator: (0, validation_1.orValidator)({
                    optional: validation_1.optionalAnyObjectValidator,
                    included: validation_1.objectAnyFieldsAnyValuesValidator,
                }, { isOptional: true })
            }, journeyId: {
                validator: validation_1.mongoIdStringRequired,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['journeys'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, oncePerEnduser: { validator: validation_1.booleanValidator }, 
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
            triggerNextAt: { validator: validation_1.dateValidator }, tags: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, availabilityTimezone: { validator: validation_1.timezoneValidator }, weeklyAvailabilities: { validator: validation_1.weeklyAvailabilitiesValidator }, archivedAt: { validator: validation_1.dateOptionalOrEmptyStringValidator } })
    },
    superbill_providers: {
        info: {},
        constraints: { unique: [], relationship: [], },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { address: {
                validator: validation_1.addressValidator,
                required: true,
                examples: [{
                        city: 'city',
                        state: 'CA',
                        lineOne: 'address line one',
                        zipCode: '12345',
                    }]
            }, email: {
                validator: validation_1.emailValidator,
                required: true,
                examples: ['example@tellescope.com']
            }, phone: {
                validator: validation_1.stringValidator,
                required: true,
                examples: ['415-415-4155'],
            }, officeName: {
                validator: validation_1.stringValidator,
                required: true,
                examples: ['office name'],
            }, taxId: {
                validator: validation_1.stringValidator,
                required: true,
                examples: ['XX-XXXXXXX'],
            }, providerName: {
                validator: validation_1.stringValidator,
                required: true,
                examples: ['provider name'],
            }, placeOfServiceCode: {
                validator: validation_1.stringValidator,
                required: true,
                examples: ['17'],
            }, providerLicense: {
                validator: validation_1.stringValidator,
                required: true,
                examples: ['17'],
            }, providerNPI: {
                validator: validation_1.stringValidator,
                required: true,
                examples: ['17'],
            } })
    },
    superbills: {
        info: {},
        constraints: { unique: [], relationship: [], },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { enduserId: {
                validator: validation_1.mongoIdStringRequired,
                examples: [constants_1.PLACEHOLDER_ID],
                required: true,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, appointmentDate: {
                validator: validation_1.dateValidator,
                required: true,
                examples: [new Date()]
            }, patient: {
                validator: validation_1.superbillPatientInfoValidator,
                required: true,
                examples: [] // too lazy
            }, provider: {
                validator: validation_1.superbillProviderInfoValidator,
                required: true,
                examples: [] // too lazy
            }, lineItems: {
                validator: validation_1.superbillLineItemsValidator,
                required: true,
                examples: [] // too lazy
            } })
    },
    enduser_medications: {
        info: {},
        constraints: { unique: [], relationship: [], },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {
            read: {}, readMany: {},
        },
        fields: __assign(__assign({}, BuiltInFields), { enduserId: {
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
                updatesDisabled: true,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, title: {
                required: true,
                validator: validation_1.stringValidator,
                examples: ['Medication Name'],
            }, calendarEventId: { validator: validation_1.mongoIdStringRequired }, prescribedBy: { validator: validation_1.mongoIdStringRequired }, prescribedAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, startedTakingAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, stoppedTakingAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, rxNormCode: { validator: validation_1.stringValidator }, fdbCode: { validator: validation_1.stringValidator }, dispensing: {
                validator: (0, validation_1.objectValidator)({
                    quantity: validation_1.numberValidator,
                    unit: validation_1.stringValidator,
                }),
            }, dosage: {
                validator: (0, validation_1.objectValidator)({
                    value: validation_1.stringValidator,
                    unit: validation_1.stringValidator,
                    quantity: validation_1.stringValidator,
                    frequency: validation_1.stringValidator,
                    frequencyDescriptor: validation_1.stringValidatorOptional,
                    description: validation_1.stringValidatorOptional,
                }),
            }, source: { validator: validation_1.stringValidator1000Optional }, externalId: { validator: validation_1.stringValidator250 }, notes: { validator: validation_1.stringValidator }, references: { validator: validation_1.listOfRelatedRecordsValidator, readonly: true }, orderStatus: { validator: validation_1.stringValidator1000 }, pharmacyName: { validator: validation_1.stringValidator1000 }, prescriberName: { validator: validation_1.stringValidator1000 }, reasonForTaking: { validator: validation_1.stringValidator }, directions: { validator: validation_1.stringValidator } })
    },
    phone_trees: {
        info: {},
        constraints: { unique: [], relationship: [], },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {
            start_outbound_call: {
                op: "custom", access: 'create', method: "post", path: "/phone-trees/start-outbound-call",
                name: 'Start Outbound Call',
                description: "Starts an phone call using the logic of an Outbound Phone Tree",
                parameters: {
                    treeId: { validator: validation_1.mongoIdStringRequired, required: true },
                    enduserId: { validator: validation_1.mongoIdStringRequired, required: true },
                    journeyId: { validator: validation_1.mongoIdStringRequired, required: true },
                    automationStepId: { validator: validation_1.mongoIdStringRequired, required: true },
                    journeyContext: { validator: validation_1.optionalAnyObjectValidator },
                },
                returns: {}
            }
        },
        enduserActions: {
            read: {}, readMany: {},
        },
        fields: __assign(__assign({}, BuiltInFields), { title: { validator: validation_1.stringValidator }, number: {
                required: true,
                validator: validation_1.stringValidator,
                examples: ['+15555555555'],
            }, isActive: {
                required: true,
                validator: validation_1.booleanValidator,
                examples: [true],
            }, nodes: {
                required: true,
                validator: validation_1.phoneTreeNodesValidator,
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
            }, testEnduserIds: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk }, enduserCondition: { validator: validation_1.phoneTreeEnduserConditionValidator }, bypassOOO: { validator: validation_1.booleanValidator }, defaultEntityType: { validator: validation_1.stringValidator100 }, tags: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, outboundNumber: { validator: validation_1.stringValidator100, examples: ['+15555555555'] } })
    },
    enduser_custom_types: {
        info: {},
        constraints: { unique: [], relationship: [], },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {
            read: {}, readMany: {},
        },
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: validation_1.stringValidator,
                required: true,
                examples: ["Title"]
            }, builtinFields: {
                validator: validation_1.buildInFieldsValidator,
            }, customFields: {
                validator: validation_1.customEnduserFieldsValidatorOptionalOrEmpty,
            } })
    },
    table_views: {
        info: {},
        constraints: { unique: [], relationship: [], },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: {
                validator: validation_1.stringValidator,
                required: true,
                examples: ["Title"]
            }, page: {
                validator: validation_1.stringValidator,
                required: true,
                examples: ["Title"]
            }, columns: {
                validator: validation_1.tableViewColumnsValidator,
                required: true,
                examples: [[]],
            }, defaultForRoles: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk }, defaultForUserIds: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk }, filter: { validator: validation_1.objectAnyFieldsAnyValuesValidator } })
    },
    email_sync_denials: {
        info: {},
        constraints: { unique: ['email'], relationship: [], },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { email: {
                validator: validation_1.emailValidator,
                required: true,
                examples: ["test@test.com"]
            } })
    },
    ticket_threads: {
        info: {
            description: 'For Zendesk integration'
        },
        constraints: { unique: [], relationship: [], },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { enduserId: {
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, source: { validator: validation_1.stringValidator100, }, externalId: { validator: validation_1.stringValidator100, }, subject: { validator: validation_1.stringValidator1000 }, pinnedAt: { validator: validation_1.dateOptionalOrEmptyStringValidator }, group: { validator: validation_1.stringValidator250 }, assignedTo: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, references: { validator: validation_1.listOfRelatedRecordsValidator, readonly: true }, tags: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay } })
    },
    ticket_thread_comments: {
        info: {
            description: 'For Zendesk integration'
        },
        constraints: {
            unique: [], relationship: [],
            access: [{ type: 'dependency', foreignModel: 'ticket_threads', foreignField: '_id', accessField: 'ticketThreadId' }]
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { markedUnreadForAll: { validator: validation_1.booleanValidator }, inboxStatus: { validator: validation_1.stringValidator100 }, externalId: { validator: validation_1.stringValidator100, }, source: { validator: validation_1.stringValidator100, }, ticketThreadId: {
                validator: validation_1.mongoIdStringRequired, required: true, examples: [constants_1.PLACEHOLDER_ID],
                dependencies: [{
                        dependsOn: ['ticket_threads'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, externalThreadId: { validator: validation_1.stringValidator100, }, public: { validator: validation_1.booleanValidator, required: true, examples: [true] }, plaintext: { validator: validation_1.stringValidator25000EmptyOkay }, html: { validator: validation_1.stringValidator25000EmptyOkay }, type: { validator: validation_1.stringValidator100, }, attachments: { validator: validation_1.listOfChatAttachmentsValidator }, enduserId: { validator: validation_1.mongoIdStringRequired }, userId: { validator: validation_1.mongoIdStringRequired }, inbound: { validator: validation_1.booleanValidator }, readBy: { validator: validation_1.idStringToDateValidator }, hiddenBy: { validator: validation_1.idStringToDateValidator }, hiddenForAll: { validator: validation_1.booleanValidator }, ticketIds: { validator: validation_1.listOfStringsValidatorEmptyOk }, group: { validator: validation_1.stringValidator250 }, references: { validator: validation_1.listOfRelatedRecordsValidator, readonly: true }, userDisplayName: { validator: validation_1.stringValidator250 }, tags: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, assignedTo: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay } })
    },
    configurations: {
        info: {},
        constraints: { unique: [], relationship: [], access: [] },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { type: { validator: validation_1.stringValidator250, examples: ['string'] }, value: { validator: validation_1.stringValidator100000OptionalEmptyOkayEscapeHTML, examples: ['string'] } }),
    },
    ticket_queues: {
        info: {},
        constraints: {
            unique: ['title'], relationship: [],
            access: [
                { type: 'filter', field: 'userIds' },
            ]
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {
            update_indexes: {
                op: "custom", access: 'update', method: "patch",
                name: 'Update Indexes',
                path: '/ticket-queues/update-indexes',
                description: "Updates indexes for a number of ticket queues to adjust the default sorting",
                parameters: {
                    updates: { validator: validation_1.indexUpdatesValidator, required: true },
                },
                returns: {},
            },
        },
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: { validator: validation_1.stringValidator, required: true, examples: ['Title'] }, userIds: { validator: validation_1.listOfMongoIdStringValidatorEmptyOk, required: true, examples: [[constants_1.PLACEHOLDER_ID]] }, type: { validator: validation_1.stringValidator100 }, defaultFromNumber: { validator: validation_1.stringValidatorOptional }, enduserFields: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk }, preventPull: { validator: validation_1.listOfMongoIdStringValidatorEmptyOk }, overdueReminderUserId: { validator: validation_1.mongoIdStringRequired } }),
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
                    message: { validator: validation_1.stringValidator, required: true },
                    sender: { validator: validation_1.mongoIdStringRequired, required: true },
                    enduserIds: { validator: validation_1.listOfMongoIdStringValidator, required: true },
                    userIds: { validator: validation_1.listOfMongoIdStringValidator, required: true },
                    phoneNumber: { validator: validation_1.phoneValidator, required: true },
                    title: { validator: validation_1.stringValidator, required: true },
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
                    message: { validator: validation_1.stringValidator, required: true },
                    sender: { validator: validation_1.mongoIdStringRequired, required: true },
                    conversationId: { validator: validation_1.mongoIdStringRequired, required: true },
                },
                returns: {
                    conversation: { validator: 'group_mms_conversations' },
                }
            },
        },
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { markedUnreadForAll: { validator: validation_1.booleanValidator }, inboxStatus: { validator: validation_1.stringValidator100 }, userIds: { validator: validation_1.listOfMongoIdStringValidatorEmptyOk, required: true, examples: [[constants_1.PLACEHOLDER_ID]] }, enduserIds: { validator: validation_1.listOfMongoIdStringValidatorEmptyOk, required: true, examples: [[constants_1.PLACEHOLDER_ID]] }, externalId: { validator: validation_1.stringValidator, readonly: true }, phoneNumber: { validator: validation_1.stringValidator, readonly: true }, destinations: { validator: validation_1.listOfStringsValidator, readonly: true }, title: { validator: validation_1.stringValidator, readonly: true }, messages: { validator: validation_1.mmsMessagesValidator, readonly: true }, userStates: { validator: validation_1.groupMMSUserStatesValidator }, tags: { validator: validation_1.listOfStringsValidatorEmptyOk }, suggestedReply: { validator: validation_1.stringValidator5000EmptyOkay }, hiddenBy: { validator: validation_1.idStringToDateValidator }, hiddenForAll: { validator: validation_1.booleanValidator }, assignedTo: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay }, pinnedAt: { validator: validation_1.dateOptionalOrEmptyStringValidator } }),
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
                    encounterId: { validator: validation_1.mongoIdStringRequired, required: true },
                },
                returns: {
                    encounter: { validator: 'enduser_encounter', required: true },
                }
            },
        },
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { externalId: { validator: validation_1.stringValidator100, examples: ['externalId'], readonly: true }, title: { validator: validation_1.stringValidator, examples: ['Title'], required: true }, integration: { validator: (0, validation_1.exactMatchValidator)([constants_1.CANDID_TITLE]), examples: [constants_1.CANDID_TITLE], readonly: true }, enduserId: {
                validator: validation_1.mongoIdStringRequired,
                examples: [constants_1.PLACEHOLDER_ID],
                required: true,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, providerUserId: { validator: validation_1.mongoIdStringRequired, required: true, examples: [constants_1.PLACEHOLDER_ID] }, authorizedRelease: { validator: validation_1.booleanValidator, required: true, examples: [true] }, dateOfService: { validator: validation_1.stringValidator, required: true, examples: ['MM-DD-YYYY'] }, diagnoses: { validator: validation_1.diagnosesValidator, required: true, examples: [[{ type: 'LOI', code: "CODE_HERE" }]] }, placeOfServiceCode: { validator: validation_1.stringValidator, required: true, examples: ['02', '11'] }, billingProviderAddress: { validator: validation_1.addressValidator }, serviceFacilityAddress: { validator: validation_1.addressValidator } })
    },
    enduser_orders: {
        info: {
            description: 'Lab, medication, and device orders'
        },
        constraints: {
            unique: [], relationship: [],
            access: [{ type: 'filter', field: 'userId' }]
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        enduserActions: { create: {}, /* for importing historical labs in portal */ read: {}, readMany: {} },
        customActions: {
            get_available_tests: {
                op: "custom", access: 'read', method: "get",
                name: 'Get Available Tests',
                path: '/enduser-orders/get-available-tests',
                description: "Gets available tests (Vital). If zipCode is provided, filters by availability.",
                parameters: {
                    zipCode: { validator: validation_1.stringValidator },
                    teamId: { validator: validation_1.stringValidator }
                },
                returns: {
                    tests: { validator: (0, validation_1.listValidatorOptionalOrEmptyOk)(validation_1.objectAnyFieldsAnyValuesValidator), required: true },
                }
            },
            create_smart_meter_order: {
                op: "custom", access: 'create', method: "post",
                name: 'Place Smart Meter Order',
                path: '/enduser-orders/create-smart-meter-order',
                description: "Creates a Smart Meter Order",
                parameters: {
                    enduserId: { validator: validation_1.mongoIdStringRequired, required: true },
                    lines: { validator: validation_1.smartMeterLinesValidator, required: true },
                    shipping: { validator: validation_1.stringValidator },
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
                    enduserId: { validator: validation_1.mongoIdStringRequired, required: true },
                    labTestId: { validator: validation_1.stringValidator, required: true },
                    physicianUserId: { validator: validation_1.mongoIdStringRequired },
                    teamId: { validator: validation_1.stringValidator },
                    activateBy: { validator: validation_1.stringValidator },
                    aoe_answers: {
                        validator: (0, validation_1.listValidatorOptionalOrEmptyOk)((0, validation_1.objectValidator)({
                            marker_id: validation_1.numberValidator,
                            question_id: validation_1.numberValidator,
                            answer: validation_1.stringValidator,
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
                    orderId: { validator: validation_1.mongoIdStringRequired, required: true },
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
                    enduserId: { validator: validation_1.mongoIdStringRequired, required: true },
                    PrescriptionImage: { validator: validation_1.stringValidator, required: true },
                    title: { validator: validation_1.stringValidator },
                    PetName: { validator: validation_1.stringValidator, required: true },
                    PetTypeId: { validator: validation_1.numberValidator, required: true },
                    OtherPetType: { validator: validation_1.stringValidator },
                    PetWeight: { validator: validation_1.stringValidator },
                    AllergyText: { validator: validation_1.stringValidator },
                    CurrentMedications: { validator: validation_1.stringValidator },
                    Gender: { validator: validation_1.stringValidator, required: true },
                    MedicalConditionText: { validator: validation_1.stringValidator },
                },
                returns: {
                    order: { validator: 'enduser_order', required: true },
                }
            },
        },
        fields: __assign(__assign({}, BuiltInFields), { externalId: { validator: validation_1.stringValidator100, examples: ['externalId'], required: true }, source: { validator: validation_1.stringValidator100, examples: ['source'], required: true }, enduserId: {
                validator: validation_1.mongoIdStringRequired,
                examples: [constants_1.PLACEHOLDER_ID],
                required: true,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, userId: { validator: validation_1.mongoIdStringRequired }, title: { validator: validation_1.stringValidator, required: true, examples: ['title'] }, status: { validator: validation_1.stringValidator, required: true, examples: ['status'] }, description: { validator: validation_1.stringValidator1000 }, frequency: { validator: validation_1.stringValidator100 }, items: { validator: (0, validation_1.listValidatorOptionalOrEmptyOk)((0, validation_1.objectValidator)({
                    title: validation_1.stringValidator,
                    tracking: validation_1.stringValidatorOptional,
                })) }, tracking: { validator: validation_1.stringValidatorOptional }, fill: { validator: validation_1.stringValidatorOptional }, sku: { validator: validation_1.stringValidatorOptional } })
    },
    vital_configurations: {
        info: {},
        constraints: {
            unique: [], relationship: [],
            access: []
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: { validator: validation_1.stringValidator, required: true, examples: ['Title'] }, unit: { validator: validation_1.stringValidator100, required: true, examples: ['lb'] }, ranges: {
                validator: validation_1.vitalConfigurationRangesValidator,
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
            }, mealStatus: { validator: (0, validation_1.exactMatchValidator)(['Any', 'Before', 'After']) }, originalConfigurationId: { validator: validation_1.mongoIdStringRequired }, enduserId: { validator: validation_1.mongoIdStringRequired } }),
    },
    blocked_phones: {
        info: {},
        constraints: {
            unique: ['phone'], relationship: [],
            access: []
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { phone: { validator: validation_1.stringValidator, required: true, examples: ['+15555555555'] } }),
    },
    prescription_routes: {
        info: {},
        constraints: {
            unique: [['state', 'templateIds', 'pharmacyId']], relationship: [],
            access: []
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: { validator: validation_1.stringValidator, required: true, examples: ['Title'] }, state: { validator: validation_1.stateValidator, required: true, examples: ['CA'] }, templateIds: { validator: validation_1.listOfStringsValidator, required: true, examples: [['tmp_01GZMD9Q71W7T44812351V9QZN']] }, pharmacyId: { validator: validation_1.stringValidator }, pharmacyLabel: { validator: validation_1.stringValidator }, tags: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay } }),
    },
    enduser_problems: {
        info: {
            description: 'Problems'
        },
        constraints: {
            unique: [], relationship: [],
            access: []
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { externalId: { validator: validation_1.stringValidator100, examples: ['externalId'] }, source: { validator: validation_1.stringValidator100, examples: ['source'] }, enduserId: {
                validator: validation_1.mongoIdStringRequired,
                examples: [constants_1.PLACEHOLDER_ID],
                required: true,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, title: { validator: validation_1.stringValidator, required: true, examples: ['title'] }, code: { validator: validation_1.stringValidator100 }, codeset: { validator: validation_1.stringValidator100 }, references: { validator: validation_1.listOfRelatedRecordsValidator, updatesDisabled: true } })
    },
    flowchart_notes: {
        info: {
            description: ''
        },
        constraints: {
            unique: [], relationship: [],
            access: []
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { flowchartId: { validator: validation_1.stringValidator100, required: true, examples: ['externalId'] }, note: { validator: validation_1.stringValidator5000, required: true, examples: ['Note'] }, flowchartUI: { validator: validation_1.flowchartUIValidator } })
    },
    webhook_logs: {
        info: { description: '' },
        constraints: { unique: [], relationship: [], access: [] },
        defaultActions: { readMany: {} },
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { payload: { validator: validation_1.objectAnyFieldsAnyValuesValidator }, response: { validator: validation_1.objectAnyFieldsAnyValuesValidator }, responseCode: { validator: validation_1.numberValidator }, url: { validator: validation_1.stringValidator } })
    },
    form_groups: {
        info: { description: '' },
        constraints: { unique: ['title'], relationship: [], access: [] },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: { read: {}, readMany: {} },
        fields: __assign(__assign({}, BuiltInFields), { title: { validator: validation_1.stringValidator, required: true, examples: ['Title'] }, formIds: { validator: validation_1.listOfMongoIdStringValidator, required: true, examples: [[constants_1.PLACEHOLDER_ID]] } })
    },
    portal_brandings: {
        info: { description: '' },
        constraints: { unique: [], relationship: [], access: [] },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: { validator: validation_1.stringValidator, required: true, examples: ['Title'] }, enduserField: { validator: validation_1.stringValidator, required: true, examples: ['Title'] }, enduserValue: { validator: validation_1.stringValidator, required: true, examples: ['Title'] }, primary: { validator: validation_1.stringValidator }, secondary: { validator: validation_1.stringValidator }, logoURL: { validator: validation_1.stringValidator }, subdomain: { validator: validation_1.stringValidator }, customPortalURL: { validator: validation_1.stringValidator }, portalSettings: { validator: validation_1.portalSettingsValidator } })
    },
    message_template_snippets: {
        info: { description: '' },
        constraints: { unique: ['key'], relationship: [], access: [] },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { key: { validator: validation_1.stringValidator, required: true, examples: ['Unique Key'] }, value: { validator: validation_1.stringValidator, required: true, examples: ['Value'] } })
    },
    fax_logs: {
        info: { description: '' },
        constraints: { unique: [], relationship: [], access: [] },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: { validator: validation_1.stringValidator100, required: true, examples: ['Title'] }, externalId: { validator: validation_1.stringValidator100, required: true, examples: ['external-uuid'] }, source: { validator: validation_1.stringValidator100, required: true, examples: ['mFax'] }, fileId: { validator: validation_1.mongoIdStringRequired, required: true, examples: [constants_1.PLACEHOLDER_ID] }, from: { validator: validation_1.stringValidator100, required: true, examples: ['+15555555555'] }, to: { validator: validation_1.stringValidator100, required: true, examples: ['+15555555555'] }, inbound: { validator: validation_1.booleanValidator, required: true, examples: [true] }, enduserId: { validator: validation_1.mongoIdStringRequired }, userId: { validator: validation_1.mongoIdStringRequired }, errorMessage: { validator: validation_1.stringValidator }, tags: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay } })
    },
    call_hold_queues: {
        info: {},
        constraints: {
            unique: ['title'], relationship: [],
            access: [
                { type: 'filter', field: 'userIds' },
            ]
        },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {
            answer_call: {
                op: "custom", access: 'read', method: "post",
                name: 'Answer Queued Call',
                path: '/call-hold-queues/answer',
                description: "Answers the next call in a hold queue, if available",
                parameters: {
                    queueId: { validator: validation_1.mongoIdStringRequired, required: true },
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
                        validator: (0, validation_1.listValidatorEmptyOk)((0, validation_1.objectValidator)({
                            averageWaitTime: validation_1.numberValidator,
                            currentSize: validation_1.numberValidator,
                            friendlyName: validation_1.stringValidator,
                        }))
                    }
                }
            },
        },
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: { validator: validation_1.stringValidator, required: true, examples: ['Title'] }, userIds: { validator: validation_1.listOfMongoIdStringValidatorEmptyOk, required: true, examples: [[constants_1.PLACEHOLDER_ID]] } }),
    },
    suggested_contacts: {
        info: { description: '' },
        constraints: { unique: [], relationship: [], access: [] },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { title: { validator: validation_1.stringValidator, required: true, examples: ['Title'] }, phone: { validator: validation_1.phoneValidator, examples: ["+15555555555"] }, email: { validator: validation_1.emailValidator, examples: ['test@tellescope.com'] } })
    },
    diagnosis_codes: {
        info: { description: '' },
        constraints: { unique: [], relationship: [], access: [] },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: { read: {}, readMany: {} },
        fields: __assign(__assign({}, BuiltInFields), { code: { validator: validation_1.stringValidator, required: true, examples: ['A000'] }, display: { validator: validation_1.stringValidator, required: true, examples: ["Cholera due to Vibrio cholerae 01, biovar cholerae"] }, system: { validator: validation_1.stringValidator, required: true, examples: ['http://hl7.org/fhir/sid/icd-10-cm'] } })
    },
    allergy_codes: {
        info: { description: '' },
        constraints: { unique: [], relationship: [], access: [] },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {},
        enduserActions: { read: {}, readMany: {} },
        fields: __assign(__assign({}, BuiltInFields), { code: { validator: validation_1.stringValidator, required: true, examples: ['6-2754'] }, display: { validator: validation_1.stringValidator, required: true, examples: ["minocycline HCl"] }, system: { validator: validation_1.stringValidator, required: true, examples: ['http://www.fdbhealth.com/'] } })
    },
    integration_logs: {
        info: { description: 'Read Only' },
        constraints: { unique: [], relationship: [], access: [] },
        defaultActions: { read: {}, readMany: {} },
        customActions: {},
        enduserActions: {},
        fields: __assign(__assign({}, BuiltInFields), { integration: { validator: validation_1.stringValidator, readonly: true, examples: ['Canvas'] }, status: { validator: (0, validation_1.exactMatchValidator)(['Success', 'Error']), readonly: true, examples: ['Error'] }, type: { validator: validation_1.stringValidator, readonly: true, examples: ['Patient Create'] }, payload: { validator: validation_1.stringValidator, readonly: true, examples: ['{}'] }, response: { validator: validation_1.stringValidator, readonly: true, examples: ['{}'] }, url: { validator: validation_1.stringValidator, readonly: true, examples: ['https://www.tellescope.com'] } })
    },
    enduser_eligibility_results: {
        info: {},
        constraints: { unique: [['externalId', 'source']], relationship: [], },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {
            develop_health_run_benefit_verification: {
                op: "custom", access: 'create', method: "post",
                name: 'Run Benefit Verification (Develop Health)',
                path: '/enduser-eligibility-results/develop-health/run-benefit-verification',
                description: "Runs a medication benefit verification for an enduser",
                parameters: {
                    enduserId: { validator: validation_1.mongoIdStringRequired, required: true },
                    providerUserId: { validator: validation_1.mongoIdStringRequired, required: true },
                    insuranceType: { validator: validation_1.stringValidator100, examples: ["Primary", "Secondary"] },
                    diagnoses: {
                        validator: validation_1.developHealthDiagnosesValidator,
                        required: true,
                    },
                    drug_history: {
                        validator: (0, validation_1.objectValidator)({
                            currently_taking_drugs: (0, validation_1.listValidatorOptionalOrEmptyOk)((0, validation_1.objectValidator)({ name: validation_1.stringValidator })),
                            previously_taken_drugs: (0, validation_1.listValidatorOptionalOrEmptyOk)((0, validation_1.objectValidator)({ name: validation_1.stringValidator })),
                        }),
                        required: true,
                    },
                    drugs: {
                        validator: validation_1.developHealthDrugsValidator,
                        required: true,
                    },
                    use_patient_plan_fund_source_check: { validator: validation_1.booleanValidator },
                    mock_result: { validator: validation_1.developHealthMockResultValidator },
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
                validator: validation_1.mongoIdStringRequired,
                required: true,
                examples: [constants_1.PLACEHOLDER_ID],
                updatesDisabled: true,
                dependencies: [{
                        dependsOn: ['endusers'],
                        dependencyField: '_id',
                        relationship: 'foreignKey',
                        onDependencyDelete: 'delete',
                    }]
            }, title: { validator: validation_1.stringValidator, required: true, examples: ["Drug Name (20mg, x8)"] }, type: { validator: validation_1.stringValidator250, required: true, examples: ["Prescription"] }, externalId: { validator: validation_1.stringValidator250, required: true, examples: [constants_1.PLACEHOLDER_ID] }, source: { validator: validation_1.stringValidator250, required: true, examples: [constants_1.DEVELOP_HEALTH_TITLE] }, status: { validator: validation_1.stringValidator250, required: true, examples: ["Pending"] } })
    },
    agent_records: {
        info: { description: '' },
        constraints: { unique: [], relationship: [], access: [] },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {
            submit_support_ticket: {
                op: "custom", access: 'create', method: "post",
                name: 'Submit Support Ticket',
                path: '/agent-records/submit-ticket',
                description: "Submits a support ticket to Tellescope",
                parameters: {
                    priority: { validator: validation_1.stringValidator, required: true },
                    message: { validator: validation_1.stringValidator25000, required: true },
                },
                returns: {}
            },
        },
        fields: __assign(__assign({}, BuiltInFields), { type: { validator: validation_1.stringValidator, required: true, examples: ['Article'] }, title: { validator: validation_1.stringValidator, required: true, examples: ['Article Title'] }, description: { validator: validation_1.stringValidator, required: true, examples: ["Article Description"] }, url: { validator: validation_1.stringValidator1000 }, content: { validator: validation_1.stringValidator100000OptionalEmptyOkay, examples: ["Article Content"] }, source: { validator: validation_1.stringValidator100 }, externalId: { validator: validation_1.stringValidator100 }, pages: { validator: validation_1.listOfStringsValidatorOptionalOrEmptyOk }, embedding: { validator: (0, validation_1.listValidator)(validation_1.numberValidator) } })
    },
    waitlists: {
        info: { description: '' },
        constraints: { unique: [], relationship: [], access: [] },
        defaultActions: constants_1.DEFAULT_OPERATIONS,
        customActions: {
            grant_access_from_waitlist: {
                op: "custom", access: 'update', method: "post",
                name: 'Remove from Waitlist',
                path: '/waitlists/grant-access',
                description: "Removes count from waitlist and adds to corresponding Journey",
                parameters: {
                    id: { validator: validation_1.mongoIdStringRequired, required: true },
                    count: { validator: validation_1.positiveNumberValidator, required: true },
                },
                returns: {
                    waitlist: { validator: 'waitlist', required: true },
                },
            },
        },
        fields: __assign(__assign({}, BuiltInFields), { title: { validator: validation_1.stringValidator, required: true, examples: ['Title'] }, journeyId: { validator: validation_1.mongoIdStringRequired, required: true, examples: [constants_1.PLACEHOLDER_ID] }, enduserIds: { validator: validation_1.listOfMongoIdStringValidatorEmptyOk, required: true, examples: [[constants_1.PLACEHOLDER_ID]] }, tags: { validator: validation_1.listOfStringsValidatorUniqueOptionalOrEmptyOkay } })
    },
    ai_conversations: {
        info: { description: '' },
        constraints: { unique: [], relationship: [], access: [] },
        defaultActions: { read: {}, readMany: {} },
        customActions: {
            send_message: {
                op: "custom", access: 'create', method: "post",
                name: 'Send Message',
                path: '/ai-conversations/send-message',
                description: "Sends a message to the AI conversation",
                parameters: {
                    message: { validator: validation_1.stringValidator25000, required: true },
                    type: { validator: validation_1.stringValidator100 },
                    maxTokens: { validator: validation_1.positiveNumberValidator },
                    conversationId: { validator: validation_1.mongoIdStringRequired },
                    prompt: { validator: validation_1.stringValidator25000 },
                },
                returns: {
                    ai_conversation: { validator: 'ai_conversation', required: true },
                },
            }
        },
        fields: __assign(__assign({}, BuiltInFields), { type: { validator: validation_1.stringValidator, required: true, examples: ['HTML Template Generation'] }, modelName: { validator: validation_1.stringValidator, required: true, examples: ['Claude Sonnet 4'] }, messages: {
                validator: (0, validation_1.listValidatorEmptyOk)((0, validation_1.objectValidator)({
                    role: (0, validation_1.exactMatchValidator)(['user', 'assistant']),
                    text: validation_1.stringValidator25000,
                    timestamp: validation_1.dateValidator,
                    tokens: validation_1.nonNegNumberValidator,
                    content: (0, validation_1.listValidatorEmptyOk)((0, validation_1.objectValidator)({
                        type: (0, validation_1.exactMatchValidator)(['text', 'image', 'file']),
                        text: validation_1.stringValidatorOptional,
                    })),
                    userId: validation_1.mongoIdStringOptional,
                }))
            } })
    }
});
// export type SchemaType = typeof schema
// export type SchemaV1 = SchemaType// & Schema
//# sourceMappingURL=schema.js.map