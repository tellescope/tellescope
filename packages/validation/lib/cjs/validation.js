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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listValidatorUniqueOptionalEmptyOkay = exports.listValidatorUniqueEmptyOkay = exports.listValidatorUnique = exports.listValidatorOptionalOrEmptyOk = exports.listValidatorEmptyOk = exports.listValidator = exports.SMSMessageValidator = exports.stringValidator25000EmptyOkay = exports.stringValidator25000OptionalEmptyOkay = exports.stringValidator100000OptionalEmptyOkayEscapeHTML = exports.stringValidator100000OptionalEmptyOkay = exports.stringValidator100000EmptyOkay = exports.stringValidator25000 = exports.stringValidator5000Optional = exports.stringValidator5000EmptyOkay = exports.stringValidator20000ptional = exports.stringValidator5000 = exports.stringValidator1000Optional = exports.stringValidator1000 = exports.stringValidator250 = exports.stringValidator100EscapeHTML = exports.stringValidator100 = exports.stringValidator5000OptionalEmptyOkay = exports.stringValidatorOptionalEmptyOkay = exports.stringValidatorOptional = exports.stringValidator = exports.escapeString = exports.optionalAnyObjectValidator = exports.optionalEmptyObjectValidator = exports.objectAnyFieldsAnyValuesValidator = exports.objectAnyFieldsValidator = exports.listOfObjectsValidator = exports.objectValidator = exports.listValidatorOld = exports.objectValidatorOld = exports.convertCommands = exports.convertCommand = exports.filterCommandsValidator = exports.orValidator = exports.binaryOrValidator = exports.fieldsToValidationOld = exports.build_validator = exports.MAX_FILE_SIZE = exports.isURL = exports.isMimeType = exports.isMongoId = exports.isSlug = exports.isMobilePhone = exports.isEmail = exports.isDate = void 0;
exports.stateValidator = exports.VALID_STATES = exports.exactMatchListValidator = exports.exactMatchValidatorOptional = exports.exactMatchValidator = exports.dateRangeOptionalValidator = exports.dateRangeValidator = exports.dateValidatorOptional = exports.dateOptionalOrEmptyStringValidator = exports.dateValidator = exports.numberOrStringValidatorOptional = exports.numberOrStringValidatorEmptyOkay = exports.fileSizeValidator = exports.listOfNumbersValidatorUniqueOptionalOrEmptyOkay = exports.numberValidatorOptional = exports.numberValidator = exports.positiveNumberValidator = exports.nonNegNumberValidator = exports.numberValidatorBuilder = exports.emailValidatorEmptyOkay = exports.emailValidatorOptional = exports.emailValidator = exports.nameValidator = exports.escape_name = exports.first_letter_capitalized = exports.slugValidator = exports.sharedWithOrganizationIdsValidator = exports.listOfMongoIdStringValidatorOptionalOrEmptyOk = exports.listOfMongoIdStringValidatorEmptyOk = exports.listOfMongoIdStringValidatorOptional = exports.listOfMongoIdStringValidator = exports.mongoIdStringOptional = exports.mongoIdStringRequired = exports.listOfMongoIdValidator = exports.mongoIdOptional = exports.mongoIdRequired = exports.stringReadonlyValidator = exports.nullValidator = exports.buildMongoIdStringValidator = exports.mongoIdValidator = exports.escapeMongoId = exports.booleanValidatorOptional = exports.booleanValidator = exports.booleanValidatorBuilder = exports.listOfUniqueStringsValidatorEmptyOk = exports.listOfObjectAnyFieldsAnyValuesValidator = exports.listOfStringsValidatorUniqueOptionalOrEmptyOkay = exports.listOfStringsValidatorEmptyOk = exports.listOfStringsValidatorOptionalOrEmptyOk = exports.listOfStringsValidator = void 0;
exports.accountTypeValidator = exports.ACCOUNT_TYPES = exports.chatRoomTypeValidator = exports.CHAT_ROOM_TYPES = exports.listOfFormFieldsValidator = exports.formFieldValidator = exports.intakeDateOfBirthValidator = exports.intakePhoneValidator = exports.formResponsesValidator = exports.formResponseValidator = exports.fullscriptDisabledForEnduser = exports.photonDisabledForEnduser = exports.mmddyyyyRegex = exports.formResponseAnswerValidator = exports.insuranceOptionalValidator = exports.tellescopeGenderOptionalValidator = exports.tellescopeGenderValidator = exports.TELLESCOPE_GENDER = exports.addressOptionalValidator = exports.addressValidator = exports.INTERNAL_NAME_TO_DISPLAY_FIELD = exports.RESERVED_INTAKE_FIELDS = exports.idStringToDateValidator = exports.numberToDateValidator = exports.rejectionWithMessage = exports.indexableNumberValidator = exports.indexableValidator = exports.validateIndexable = exports.emailEncodingValidator = exports.journeyStatesValidator = exports.journeyStateValidator = exports.journeyStatePriorityValidator = exports.updateOptionsValidator = exports.preferenceValidator = exports.fieldsValidator = exports.FORM_FIELD_VALIDATORS_BY_TYPE = exports.formFieldTypeValidator = exports.FORM_FIELD_TYPES = exports.labeledFieldsValidator = exports.signatureResponseValidator = exports.fileResponseValidator = exports.subdomainValidator = exports.safeBase64Validator = exports.urlValidator = exports.fileTypeValidator = exports.phoneValidatorOptional = exports.phoneValidator = exports.escape_phone_number = exports.journeysValidator = exports.stateValidatorOptional = void 0;
exports.cancelConditionsValidatorOptional = exports.cancelConditionsValidator = exports.cancelConditionValidator = exports.listOfCalendarEventRemindersValidator = exports.calendarEventReminderValidator = exports.messageTemplateModeValidator = exports.MESSAGE_TEMPLATE_MODES = exports.communicationsChannelValidatorOptional = exports.communicationsChannelValidator = exports.COMMUNICATIONS_CHANNELS = exports.automationActionTypeValidator = exports.AUTOMATION_ACTIONS = exports.automationEventTypeValidator = exports.AUTOMATION_EVENTS = exports.automatedActionStatusValidator = exports.AUTOMATION_ENDUSER_STATUS = exports.listOfStringsWithQualifierValidatorOptionalValuesEmptyOkay = exports.listOfStringsWithQualifierValidatorOptional = exports.listOfStringsWithQualifierValidator = exports.listQueryQualifiersValidator = exports.LIST_QUERY_QUALIFIERS = exports.chatRoomUserInfoValidator = exports.meetingDisplayInfoValidator = exports.userDisplayInfoValidator = exports.meetingsListValidator = exports.listOfGenericAttachmentsValidator = exports.genericAttachmentValidator = exports.listOfChatAttachmentsValidator = exports.chatAttachmentValidator = exports.calendarEventAttendeesValidator = exports.calendarEventAttendeeValidator = exports.listOfUserIndentitiesValidator = exports.userIdentityValidator = exports.meetingInfoValidator = exports.listOfAttendeesValidator = exports.attendeeValidator = exports.attendeeInfoValidator = exports.listOfDisplayNameInfo = exports.sessionTypeOrAnyoneValidatorOptional = exports.sessionTypeValidator = exports.WebhookSubscriptionValidator = exports.UnitOfTimeValidator = exports.UNITS_OF_TIME = exports.CUDValidator = exports.CUDStringValidator = exports.CUD = exports.meetingStatusValidator = exports.MEETING_STATUSES = exports.messageTemplateTypeValidator = exports.MESSAGE_TEMPLATE_TYPES = void 0;
exports.DATABASE_RECORD_FIELD_TYPES = exports.blocksValidator = exports.is_block_type = exports.blockTypeValidator = exports.BLOCK_TYPES = exports.blockValidator = exports.formFieldOptionsValidator = exports.formFieldFeedbackValidator = exports.tableInputChoiceValidator = exports.tableInputTypesValidator = exports.TABLE_INPUT_TYPES = exports.integrationAuthenticationsValidator = exports.flowchartUIValidator = exports.passwordValidator = exports.managedContentRecordAssignmentTypeValidator = exports.MANAGED_CONTENT_RECORD_ASSIGNMENT_TYPES = exports.managedContentRecordTypeValidator = exports.MANAGED_CONTENT_RECORD_TYPES = exports.organizationThemeValidator = exports.customPoliciesValidator = exports.portalSettingsValidator = exports.previousFormFieldsValidator = exports.previousFormFieldValidator = exports.FHIRObservationValueValidator = exports.FHIRObservationStatusCodeValidator = exports.FHIR_OBSERVATION_STATUS_CODES = exports.FHIRObservationCategoryValidator = exports.notificationPreferencesValidator = exports.notificationPreferenceValidator = exports.searchOptionsValidator = exports.relatedRecordsValidatorOptional = exports.listOfRelatedRecordsValidator = exports.relatedRecordValidator = exports.journeyContextValidator = exports.automationActionValidator = exports.canvasCodingValidatorOptional = exports.canvasCodingValidator = exports.developHealthMockResultValidator = exports.developHealthDiagnosesValidator = exports.developHealthDrugsValidator = exports.automationForMessageValidator = exports.smartMeterLinesValidator = exports.senderAssignmentStrategyValidatorOptional = exports.ticketActionsValidator = exports.ticketActionValidator = exports.ticketReminderValidator = exports.listOfAutomationConditionsValidator = exports.automationConditionValidator = exports.automationEventsValidator = exports.automationEventValidator = void 0;
exports.automatioNTriggerStatusValidator = exports.AUTOMATION_TRIGGER_STATUSES = exports.automationTriggerActionValidator = exports.AUTOMATION_TRIGGER_ACTION_TYPES = exports.automationTriggerEventValidator = exports.AUTOMATION_TRIGGER_EVENT_TYPES = exports.vitalConfigurationRangesValidator = exports.vitalConfigurationRangeValidator = exports.vitalComparisonValidator = exports.calendarEventPortalSettingsValidator = exports.organizationSettingsValidator = exports.customDashboardViewValidator = exports.buildInFieldsValidator = exports.customEnduserFieldsValidatorOptionalOrEmpty = exports.customEnduserFieldValidator = exports.indexUpdatesValidator = exports.indexUpdateValidator = exports.availabilityEntitiesValidator = exports.AVAILABILITY_BLOCK_ENTITIES = exports.customEnduserFieldTypeValidator = exports.CUSTOM_ENDUSER_FIELD_TYPES = exports.accessValidator = exports.timezoneValidatorOptional = exports.timezoneValidator = exports.weeklyAvailabilitiesValidator = exports.weeklyAvailabilityValidator = exports.baseAvailabilityBlocksValidator = exports.baseAvailabilityBlockValidator = exports.stateCredentialsValidator = exports.stateCredentialValidator = exports.genericUnitWithQuantityValidator = exports.enduserFormResponsesForEventValidator = exports.enduserFormResponseForEventValidator = exports.enduserTasksForEventValidator = exports.enduserTaskForEventValidator = exports.portalTypeValidator = exports.PORTAL_BLOCK_TYPES = exports.portalBlocksValidator = exports.portalBlockValidator = exports.formTypeValidator = exports.FORM_TYPES = exports.portalPageValidator = exports.PORTAL_PAGES = exports.organizationAccessValidator = exports.databaseRecordValuesValidator = exports.databaseRecordValueValidator = exports.databaseFieldsValidator = exports.databaseFieldValidator = exports.is_database_record_field_type = exports.databaseRecordFieldTypeValidator = void 0;
exports.PHONE_TREE_ENDUSER_CONDITIONS = exports.phoneTreeNodesValidator = exports.phoneTreeNodeValidator = exports.phoneTreeActionValidator = exports.phonePlaybackValidatorOptional = exports.phonePlaybackValidator = exports.phoneTreeEventsValidator = exports.phoneTreeEventValidator = exports.insurancesValidator = exports.enduserProfileViewBlocksValidator = exports.enduserProfileViewBlockValidator = exports.sharedEnduserProfileViewBlockFields = exports.externalChatGPTMessagesValidator = exports.userUIRestrictionsValidator = exports.userCallRoutingBehaviorValidator = exports.USER_CALL_ROUTING_BEHAVIORS = exports.analyticsQueryTypeValidator = exports.ANALYTICS_QUERY_TYPES = exports.analyticsFrameTypeValidator = exports.ANALYTICS_FRAME_TYPES = exports.analyticsQueriesValidatorOptional = exports.analyticsQueryValidator = exports.compoundFilterValidator = exports.basicFilterValidator = exports.formScoringValidator = exports.scheduledJourneysValidator = exports.analyticsQueryResultsValidator = exports.videoIntegrationTypesValidator = exports.VIDEO_INTEGRATION_TYPES = exports.integrationTitleValidator = exports.purchaseCreditValueValidator = exports.costValidator = exports.paymentProcessorValidator = exports.PAYMENT_PROCESSORS = exports.currencyValidator = exports.CURRENCIES = exports.appointmentTermsValidator = exports.loginFlowResultValidator = exports.LOGIN_FLOW_RESULTS = exports.organizationLimitsValidator = exports.accessPermissionsValidator = exports.accessPermissionValidator = exports.ticketSnoozesValidator = exports.superbillLineItemsValidator = exports.billingCodeValidatorOptional = exports.billingCodeValidator = exports.superbillProviderInfoValidator = exports.superbillPatientInfoValidator = exports.embeddingTypeValidator = exports.EMBEDDING_TYPES = void 0;
exports.recentViewersValidator = exports.recentViewerValidator = exports.enduserDiagnosisValidator = exports.bookingRestrictionsByTemplateValidator = exports.analyticsFrameGroupingCategoriesValidator = exports.analyticsFrameGroupingCategoryValidator = exports.fieldMappingsValidator = exports.fieldMappingValidator = exports.athenaSubscriptionsValidator = exports.athenaSubscriptionValidator = exports.athenaSubscriptionTypeValidator = exports.fieldsSyncValidator = exports.fieldSyncValidator = exports.syncDirectionValidator = exports.enduserProfileWebhooksValidator = exports.diagnosesValidator = exports.diagnosisValidator = exports.candidProcedureCodeValidator = exports.diagnosisTypeValidator = exports.DIAGNOSIS_TYPES = exports.sortingFieldsValidator = exports.groupMMSUserStatesValidator = exports.groupMMSUserStateValidator = exports.mmsMessagesValidator = exports.mmsMessageValidator = exports.imageAttachmentValidator = exports.isDateString = exports.phoneCallsReportQueriesValidator = exports.formResponsesReportQueriesValidator = exports.endusersReportQueriesValidator = exports.formFieldCalloutConditionsValidator = exports.tableViewColumnsValidator = exports.languageValidator = exports.formCustomizationValidator = exports.phoneTreeEnduserConditionValidator = void 0;
var utilities_1 = require("@tellescope/utilities");
var types_models_1 = require("@tellescope/types-models");
Object.defineProperty(exports, "VALID_STATES", { enumerable: true, get: function () { return types_models_1.VALID_STATES; } });
var validator_1 = __importDefault(require("validator"));
exports.isDate = validator_1.default.isDate, exports.isEmail = validator_1.default.isEmail, exports.isMobilePhone = validator_1.default.isMobilePhone, exports.isSlug = validator_1.default.isSlug, exports.isMongoId = validator_1.default.isMongoId, exports.isMimeType = validator_1.default.isMimeType, exports.isURL = validator_1.default.isURL;
// import {
//   BUSINESS_TYPE,
// } from "@tellescope/constants"
var utilities_2 = require("@tellescope/utilities");
var constants_1 = require("@tellescope/constants");
var EXAMPLE_OBJECT_ID = '60398b0231a295e64f084fd9';
var getTypeString = function () { return "string"; };
var getTypeNumber = function () { return "number"; };
var getExampleString = function () { return 'example string'; };
var getExampleObjectId = function () { return EXAMPLE_OBJECT_ID; };
var escape_fieldValue = function (f) { return (typeof f === 'string'
    ? (0, utilities_1.remove_script_tags)(f)
    : f); };
exports.MAX_FILE_SIZE = 1000000000; // 1gb megabytes in bytes
var DEFAULT_MAX_LENGTH = 50000;
var build_validator = function (escapeFunction, options) {
    if (options === void 0) { options = {}; }
    var shouldTruncate = options.shouldTruncate, isOptional = options.isOptional, toLower = options.toLower, emptyStringOk = options.emptyStringOk, emptyListOk = options.emptyListOk, nullOk = options.nullOk, isObject = options.isObject, isNumber = options.isNumber, listOf = options.listOf, isBoolean = options.isBoolean, unique = options.unique, _a = options.field, field = _a === void 0 ? '' : _a, escapeHTML = options.escapeHTML;
    var minLength = options.minLength || 0;
    var maxLength = options.maxLength || DEFAULT_MAX_LENGTH;
    return function (fieldValue) {
        if (isOptional && fieldValue === undefined)
            return undefined;
        if (isOptional && fieldValue === null && !nullOk)
            return undefined;
        if (nullOk && fieldValue === null)
            return null;
        // ensure this comes before emptyStringOk to ensure empty string types are coerced to empty array when empty list is ok
        if (listOf && (fieldValue === null || fieldValue === void 0 ? void 0 : fieldValue.length) === 0) {
            if (emptyListOk)
                return [];
            else
                throw new Error("Expecting a list of values but list is empty");
        }
        if ((emptyStringOk || isOptional) && fieldValue === '')
            return '';
        if (!emptyStringOk && fieldValue === '')
            throw "Expecting non-empty string but got ".concat(escape_fieldValue(fieldValue));
        if (isObject && typeof fieldValue !== 'object') {
            try {
                if (typeof fieldValue !== 'string')
                    throw '';
                // be helpful and decodeURI if needed (%22 is invalid in JSON unless at least one '"" is present, so this should be safe)
                if (fieldValue && fieldValue.includes('%22') && !fieldValue.includes('"')) {
                    fieldValue = JSON.parse(decodeURIComponent(fieldValue));
                }
                else {
                    fieldValue = JSON.parse(fieldValue); // seems necessary for parsing query string
                }
            }
            catch (err) {
                throw "Expecting an object but got ".concat(escape_fieldValue(fieldValue));
            }
        }
        if (isNumber && fieldValue === 0)
            return 0; // avoid falsey issues later
        if (!isOptional && !fieldValue && !(isBoolean && fieldValue === false)) {
            throw { message: 'missing value', field: field };
        }
        // asserts for listOf === true, that fieldValue typed as array
        if (listOf && !Array.isArray(fieldValue))
            throw "Expecting a list of values but got ".concat(escape_fieldValue(fieldValue));
        if (toLower && typeof fieldValue === 'string') {
            fieldValue = fieldValue.toLowerCase();
        }
        var values = listOf && Array.isArray(fieldValue) ? fieldValue.filter(function (a) { return !!a || (a === 0 && isNumber); }) : [fieldValue];
        if (listOf && unique && Array.isArray(values)) {
            values = Array.from(new Set(values));
        }
        var escapedValues = [];
        if (values.length > 1000)
            throw new Error("Arrays should not contain more than 1000 elements");
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var value = values_1[_i];
            if (emptyStringOk && value === '') {
                escapedValues.push('');
                continue;
            }
            var escapedValue = escapeFunction(value); // may throw exception, this is fine
            if (typeof escapedValue === 'string' && escapeHTML) {
                escapedValue = (0, utilities_1.sanitize_html)(escapedValue);
            }
            if (typeof escapedValue === 'string') { // is string
                if (escapedValue.length > maxLength) {
                    if (shouldTruncate) {
                        escapedValue = escapedValue.substring(0, maxLength);
                    }
                    else {
                        throw "Length of escapedValue ".concat(escapedValue, " exceeds maxLength ").concat(maxLength);
                    }
                }
                if (escapedValue.length < minLength) {
                    throw new Error("Length of escapedValue ".concat(escapedValue, " shorter than minLength ").concat(minLength));
                }
                if (!isOptional && escapedValue.length === 0) {
                    throw "Value has 0 length after escaping but field is required";
                }
            }
            else if (isObject && (0, utilities_2.is_object)(escapedValue)) { // is parsed JSON
                var parsed = JSON.stringify(escapedValue);
                if (parsed.length > maxLength) {
                    throw "Length of JSON ".concat(parsed, " exceeds maxLength ").concat(maxLength);
                }
            }
            escapedValues.push(escapedValue);
        }
        return listOf ? escapedValues : escapedValues[0];
    };
};
exports.build_validator = build_validator;
var fieldsToValidationOld = function (fs) {
    var validation = {};
    for (var f in fs) {
        validation[f] = fs[f].validator.validate({ isOptional: !fs[f].required });
    }
    return validation;
};
exports.fieldsToValidationOld = fieldsToValidationOld;
/********************************* VALIDATORS *********************************/
var optionsWithDefaults = function (options) {
    if (options === void 0) { options = {}; }
    return {
        maxLength: options.maxLength || 1000,
        minLength: options.minLength || 0,
        shouldTruncate: options.shouldTruncate || false,
        isOptional: options.isOptional || false,
        emptyStringOk: options.emptyStringOk || false,
        nullOk: options.nullOk || false,
        isObject: options.isObject || false,
        isNumber: options.isNumber || false,
        isBoolean: options.isBoolean || false,
        listOf: options.listOf || false,
        emptyListOk: options.emptyListOk || false,
    };
};
var binaryOrValidator = function (f1, f2) { return function (o) {
    if (o === void 0) { o = {}; }
    return (0, exports.build_validator)(function (value) {
        try {
            return f1(value);
        }
        catch (err) {
            return f2(value);
        }
    }, __assign(__assign({}, o), { listOf: false }));
}; };
exports.binaryOrValidator = binaryOrValidator;
var orValidator = function (validators, _o) { return ({
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)(function (value) {
            for (var field in validators) {
                var escape_1 = validators[field];
                try {
                    // console.log(field, value)
                    return escape_1.validate()(value);
                }
                catch (err) {
                    // console.error(err)
                    continue;
                }
            }
            throw "Value does not match any of the expected options: ".concat(typeof value === 'object' ? JSON.stringify(value, null, 2) : '');
        }, __assign(__assign(__assign({}, _o), o), { listOf: false }));
    },
    getExample: function () { return Object.values(validators)[0].getExample(); },
    getType: function () { return [Object.values(validators).map(function (v) { return v.getType(); })]; }
}); };
exports.orValidator = orValidator;
var filterCommandsValidator = function (o) {
    if (o === void 0) { o = {}; }
    return (0, exports.build_validator)(function (value) {
        if (!(0, utilities_2.is_object)(value)) {
            throw new Error("Expecting object value for FilterType");
        }
        // this incorrectly prevents multiple combinations (e.g. gt and lt)
        // if (value._exists && typeof value._exists === 'boolean' ) return { _exists: value._exists }
        // if (value._gt && typeof value._gt === 'number' ) return { _gt: value._gt }
        // if (value._gte && typeof value._gte === 'number' ) return { _gte: value._gte }
        // if (value._lt && typeof value._lt === 'number' ) return { _lt: value._lt }
        // if (value._lte && typeof value._gt === 'number' ) return { _lte: value._lte }
        // if (value._all && Array.isArray(value._all)) return { _all: value._all }
        // if (value._in && Array.isArray(value._in)) return { _in: value._in }
        // if (value._nin && Array.isArray(value._nin)) return { _nin: value._nin }
        // if (value._ne) return { _ne: value._ne }
        if (Object.keys(value).find(function (k) { return k.startsWith('$'); })) { // ignore any $ injections
            throw new Error("Unknown filter value ".concat(JSON.stringify(value)));
        }
        return value;
    }, __assign(__assign({}, o), { isObject: true, listOf: false }));
};
exports.filterCommandsValidator = filterCommandsValidator;
var convertCommand = function (key, value) {
    if (key === '_exists') {
        return { $exists: value };
    }
    else if (key === '_lt') {
        return { $lt: value };
    }
    else if (key === '_lte') {
        return { $lte: value };
    }
    else if (key === '_gt') {
        return { $gt: value };
    }
    else if (key === '_gte') {
        return { $gte: value };
    }
    else if (key === '_all') {
        return { $all: value };
    }
    else if (key === '_in') {
        return { $in: value };
    }
    else if (key === '_nin') {
        return { $nin: value };
    }
    else if (key === '_ne') {
        return { $ne: value };
    }
    return null;
};
exports.convertCommand = convertCommand;
var convertCommands = function (operators) {
    var filterOperators = {};
    for (var field in operators) {
        var value = operators[field];
        var keys = Object.keys(value);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            var converted = (0, exports.convertCommand)(key, value[key]);
            if (converted) {
                filterOperators[field] = __assign(__assign({}, filterOperators[field]), converted);
            }
        }
    }
    return filterOperators;
};
exports.convertCommands = convertCommands;
var objectValidatorOld = function (i, objectOptions) {
    if (objectOptions === void 0) { objectOptions = { emptyOk: true }; }
    return function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)(function (object) {
            var _a;
            var emptyOk = (_a = objectOptions.emptyOk) !== null && _a !== void 0 ? _a : true;
            var validated = {};
            if (!(0, utilities_2.is_object)(object)) {
                throw new Error("Expected a non-null object by got ".concat(object));
            }
            if (!emptyOk && (0, utilities_2.object_is_empty)(object)) {
                throw new Error("Expected a non-empty object");
            }
            // don't throw on unrecognized fields, just ignore/don't validate them
            if (objectOptions.throwOnUnrecognizedField) {
                var unrecognizedFields = [];
                for (var field in object) {
                    if (!i[field]) {
                        unrecognizedFields.push(field);
                    }
                }
                if (unrecognizedFields.length > 0) {
                    throw new Error("Got unexpected field(s) [".concat(unrecognizedFields.join(', '), "]"));
                }
            }
            for (var field in i) {
                var value = object[field];
                var escaped = i[field](value); // may be required
                if (escaped === undefined)
                    continue;
                validated[field] = escaped;
            }
            return validated;
        }, __assign(__assign({}, o), { isObject: true, listOf: false }));
    };
};
exports.objectValidatorOld = objectValidatorOld;
var listValidatorOld = function (b) { return function (o) { return (0, exports.build_validator)(b, __assign(__assign({}, o), { listOf: true })); }; };
exports.listValidatorOld = listValidatorOld;
var exampleObject = function (fields) {
    var examples = {};
    for (var field in fields) {
        examples[field] = fields[field].getExample();
    }
    return examples;
};
var typeObject = function (fields) {
    var types = {};
    for (var field in fields) {
        types[field] = fields[field].getType();
    }
    return types;
};
var objectValidator = function (i, objectOptions) {
    if (objectOptions === void 0) { objectOptions = { emptyOk: true }; }
    return ({
        validate: function (o) {
            if (o === void 0) { o = {}; }
            return (0, exports.build_validator)(function (_object) {
                var _a, _b;
                var object = ((_a = objectOptions.inputModifier) === null || _a === void 0 ? void 0 : _a.call(objectOptions, _object)) || _object;
                var emptyOk = (_b = objectOptions.emptyOk) !== null && _b !== void 0 ? _b : true;
                // const isOptional = !!objectOptions.isOptional || o.isOptional
                var validated = {};
                if (!(0, utilities_2.is_object)(object)) {
                    throw new Error("Expected a non-null object by got ".concat(object));
                }
                if (!emptyOk && (0, utilities_2.object_is_empty)(object)) {
                    throw new Error("Expected a non-empty object");
                }
                // don't throw on unrecognized fields, just ignore/don't validate them
                if (objectOptions.throwOnUnrecognizedField) {
                    var unrecognizedFields = [];
                    for (var field in object) {
                        if (!i[field]) {
                            unrecognizedFields.push(field);
                        }
                    }
                    if (unrecognizedFields.length > 0) {
                        throw new Error("Got unexpected field(s) [".concat(unrecognizedFields.join(', '), "]"));
                    }
                }
                for (var field in i) {
                    // console.log('validating field of object', field)
                    var value = object[field];
                    try {
                        var escaped = i[field].validate({ field: field })(value); // may be required
                        // console.log('escaped', escaped)
                        if (escaped === undefined)
                            continue;
                        validated[field] = escaped;
                    }
                    catch (err) {
                        if (err.message === 'missing value') {
                            throw __assign(__assign({}, err), { field: o.field || field });
                        }
                        throw err;
                    }
                }
                return validated;
            }, __assign(__assign({}, o), { maxLength: 100000, isObject: true, listOf: false, isOptional: !!objectOptions.isOptional || o.isOptional }));
        },
        getExample: function () { return exampleObject(i); },
        getType: function () { return typeObject(i); },
    });
};
exports.objectValidator = objectValidator;
var listOfObjectsValidator = function (i, objectOptions) {
    if (objectOptions === void 0) { objectOptions = { emptyOk: true }; }
    return ({
        validate: function (o) {
            if (o === void 0) { o = {}; }
            return (0, exports.build_validator)(function (object) {
                var emptyOk = !!objectOptions.emptyOk || o.emptyListOk;
                var validated = {};
                if (!(0, utilities_2.is_object)(object)) {
                    throw new Error("Expected a non-null object by got ".concat(object));
                }
                if (!emptyOk && (0, utilities_2.object_is_empty)(object)) {
                    throw new Error("Expected a non-empty object");
                }
                // don't throw on unrecognized fields, just ignore/don't validate them
                // const unrecognizedFields = []
                // for (const field in object) {
                //   if (!(i as Indexable)[field]) {
                //     unrecognizedFields.push(field)
                //   } 
                // }
                // if (unrecognizedFields.length > 0) {
                //   throw new Error(`Got unexpected field(s) [${unrecognizedFields.join(', ')}]`)
                // }
                for (var field in i) {
                    var value = object[field];
                    var escaped = i[field].validate()(value); // may be required
                    if (escaped === undefined)
                        continue;
                    validated[field] = escaped;
                }
                return validated;
            }, __assign(__assign({}, o), { isObject: true, listOf: true, emptyListOk: !!objectOptions.emptyOk || o.emptyListOk }));
        },
        getExample: function () { return [exampleObject(i)]; },
        getType: function () { return [typeObject(i)]; } // don't forget list
    });
};
exports.listOfObjectsValidator = listOfObjectsValidator;
var objectAnyFieldsValidator = function (valueValidator) { return ({
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)(function (object) {
            if (object === void 0) { object = {}; }
            if (!(0, utilities_2.is_object)(object)) {
                throw new Error("Expected a non-null object by got ${object}");
            }
            var validated = {};
            for (var field in object) {
                if (valueValidator) {
                    validated[field] = valueValidator.validate()(object[field]);
                }
                else if (typeof object[field] === 'number') {
                    validated[field] = exports.numberValidator.validate()(object[field]);
                }
                else if (typeof object[field] === 'string') {
                    validated[field] = exports.stringValidator.validate({ emptyStringOk: true })(object[field]);
                }
                else if (object[field] === null) {
                    validated[field] = null;
                }
                else {
                    if (valueValidator) {
                        throw new Error("Field ".concat(field, " is not a string or number"));
                    }
                    validated[field] = object[field];
                }
            }
            return validated;
        }, __assign(__assign({}, o), { isObject: true, listOf: false, isOptional: true }));
    },
    getExample: function () { var _a, _b; return "{ \"key\": ".concat((_b = (_a = valueValidator === null || valueValidator === void 0 ? void 0 : valueValidator.getExample) === null || _a === void 0 ? void 0 : _a.call(valueValidator)) !== null && _b !== void 0 ? _b : '"value"', " }"); },
    getType: function () { var _a, _b; return "{ \"key\": ".concat((_b = (_a = valueValidator === null || valueValidator === void 0 ? void 0 : valueValidator.getType) === null || _a === void 0 ? void 0 : _a.call(valueValidator)) !== null && _b !== void 0 ? _b : 'string', " }"); },
}); };
exports.objectAnyFieldsValidator = objectAnyFieldsValidator;
exports.objectAnyFieldsAnyValuesValidator = (0, exports.objectAnyFieldsValidator)();
exports.optionalEmptyObjectValidator = ({
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)(function (object) {
            return {};
        }, __assign(__assign({}, o), { isOptional: true, isObject: true, listOf: false }));
    },
    getExample: function () { return "{ }"; },
    getType: function () { return "{ }"; },
});
exports.optionalAnyObjectValidator = ({
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)(function (object) {
            if (typeof object !== 'object')
                throw "Must be an object value";
            return object;
        }, __assign(__assign({}, o), { isOptional: true, isObject: true, listOf: false }));
    },
    getExample: function () { return "{ }"; },
    getType: function () { return "{ }"; },
});
var escapeString = function (o) {
    if (o === void 0) { o = {}; }
    return function (string) {
        if (typeof string !== "string")
            throw new Error('Expecting string value');
        if (o.trim) {
            string = string.trim();
            if (o.isOptional && string === '') {
                throw new Error(o.errorMessage || "String is only whitespace");
            }
        }
        return string;
    };
};
exports.escapeString = escapeString;
exports.stringValidator = {
    validate: function (o) {
        var _a;
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)((0, exports.escapeString)(o), __assign(__assign({}, o), { maxLength: (_a = o.maxLength) !== null && _a !== void 0 ? _a : 1000, listOf: false }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
exports.stringValidatorOptional = {
    validate: function (o) {
        var _a;
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)((0, exports.escapeString)(o), __assign(__assign({}, o), { maxLength: (_a = o.maxLength) !== null && _a !== void 0 ? _a : 1000, listOf: false, isOptional: true, emptyStringOk: true }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
exports.stringValidatorOptionalEmptyOkay = {
    validate: function (o) {
        var _a;
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)((0, exports.escapeString)(o), __assign(__assign({}, o), { maxLength: (_a = o.maxLength) !== null && _a !== void 0 ? _a : 1000, listOf: false, isOptional: true }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
exports.stringValidator5000OptionalEmptyOkay = {
    validate: function (o) {
        var _a;
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)((0, exports.escapeString)(o), __assign(__assign({}, o), { maxLength: (_a = o.maxLength) !== null && _a !== void 0 ? _a : 5000, listOf: false, isOptional: true }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
exports.stringValidator100 = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)((0, exports.escapeString)(o), __assign(__assign({}, o), { maxLength: 100, listOf: false }));
    },
    getExample: getExampleString,
    getType: getTypeString
};
exports.stringValidator100EscapeHTML = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)((0, exports.escapeString)(o), __assign(__assign({}, o), { maxLength: 100, listOf: false, escapeHTML: true }));
    },
    getExample: getExampleString,
    getType: getTypeString
};
exports.stringValidator250 = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)((0, exports.escapeString)(o), __assign(__assign({}, o), { maxLength: 250, listOf: false }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
exports.stringValidator1000 = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)((0, exports.escapeString)(o), __assign(__assign({}, o), { maxLength: 1000, listOf: false }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
exports.stringValidator1000Optional = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)((0, exports.escapeString)(o), __assign(__assign({}, o), { maxLength: 1000, listOf: false, isOptional: true, emptyStringOk: true }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
exports.stringValidator5000 = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)((0, exports.escapeString)(o), __assign(__assign({}, o), { maxLength: 5000, listOf: false }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
exports.stringValidator20000ptional = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)((0, exports.escapeString)(o), __assign(__assign({}, o), { maxLength: 20000, listOf: false, isOptional: true, emptyStringOk: true }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
exports.stringValidator5000EmptyOkay = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)((0, exports.escapeString)(o), __assign(__assign({}, o), { maxLength: 5000, listOf: false, emptyStringOk: true }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
exports.stringValidator5000Optional = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)((0, exports.escapeString)(o), __assign(__assign({}, o), { maxLength: 5000, listOf: false, isOptional: true, emptyStringOk: true }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
exports.stringValidator25000 = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)((0, exports.escapeString)(o), __assign(__assign({}, o), { maxLength: 25000, listOf: false }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
exports.stringValidator100000EmptyOkay = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)((0, exports.escapeString)(o), __assign(__assign({}, o), { maxLength: 100000, listOf: false, emptyStringOk: true }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
exports.stringValidator100000OptionalEmptyOkay = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)((0, exports.escapeString)(o), __assign(__assign({}, o), { maxLength: 100000, isOptional: true, listOf: false, emptyStringOk: true }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
exports.stringValidator100000OptionalEmptyOkayEscapeHTML = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)((0, exports.escapeString)(o), __assign(__assign({}, o), { maxLength: 100000, isOptional: true, listOf: false, emptyStringOk: true, escapeHTML: true }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
exports.stringValidator25000OptionalEmptyOkay = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)((0, exports.escapeString)(o), __assign(__assign({}, o), { maxLength: 25000, isOptional: true, listOf: false, emptyStringOk: true }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
exports.stringValidator25000EmptyOkay = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)((0, exports.escapeString)(o), __assign(__assign({}, o), { maxLength: 25000, listOf: false, emptyStringOk: true }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
exports.SMSMessageValidator = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)((0, exports.escapeString)(o), __assign(__assign({}, o), { maxLength: 1200, listOf: false }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
var listValidator = function (b, _o) { return ({
    validate: function (o) { return (0, exports.build_validator)(b.validate(o), __assign(__assign(__assign({}, _o), o), { listOf: true })); },
    getExample: function () { return [b.getExample()]; },
    getType: function () { return [b.getExample()]; },
}); };
exports.listValidator = listValidator;
var listValidatorEmptyOk = function (b, o) { return ({
    validate: function (o) { return (0, exports.build_validator)(b.validate(o), __assign(__assign({}, o), { listOf: true, emptyListOk: true })); },
    getExample: function () { return [b.getExample()]; },
    getType: function () { return [b.getExample()]; },
}); };
exports.listValidatorEmptyOk = listValidatorEmptyOk;
var listValidatorOptionalOrEmptyOk = function (b, o) { return ({
    validate: function (o) { return (0, exports.build_validator)(b.validate(o), __assign(__assign({}, o), { listOf: true, emptyListOk: true, isOptional: true })); },
    getExample: function () { return [b.getExample()]; },
    getType: function () { return [b.getExample()]; },
}); };
exports.listValidatorOptionalOrEmptyOk = listValidatorOptionalOrEmptyOk;
var listValidatorUnique = function (b, _o) { return ({
    validate: function (o) { return (0, exports.build_validator)(b.validate(o), __assign(__assign(__assign({}, _o), o), { listOf: true, unique: true })); },
    getExample: function () { return [b.getExample()]; },
    getType: function () { return [b.getExample()]; },
}); };
exports.listValidatorUnique = listValidatorUnique;
var listValidatorUniqueEmptyOkay = function (b, _o) { return ({
    validate: function (o) { return (0, exports.build_validator)(b.validate(o), __assign(__assign(__assign({}, _o), o), { listOf: true, unique: true, emptyListOk: true })); },
    getExample: function () { return [b.getExample()]; },
    getType: function () { return [b.getExample()]; },
}); };
exports.listValidatorUniqueEmptyOkay = listValidatorUniqueEmptyOkay;
var listValidatorUniqueOptionalEmptyOkay = function (b, _o) { return ({
    validate: function (o) { return (0, exports.build_validator)(b.validate(o), __assign(__assign(__assign({}, _o), o), { listOf: true, unique: true, emptyListOk: true, isOptional: true })); },
    getExample: function () { return [b.getExample()]; },
    getType: function () { return [b.getExample()]; },
}); };
exports.listValidatorUniqueOptionalEmptyOkay = listValidatorUniqueOptionalEmptyOkay;
exports.listOfStringsValidator = (0, exports.listValidator)(exports.stringValidator);
exports.listOfStringsValidatorOptionalOrEmptyOk = (0, exports.listValidatorOptionalOrEmptyOk)(exports.stringValidator);
exports.listOfStringsValidatorEmptyOk = (0, exports.listValidatorEmptyOk)(exports.stringValidator);
exports.listOfStringsValidatorUniqueOptionalOrEmptyOkay = (0, exports.listValidatorUniqueOptionalEmptyOkay)(exports.stringValidator);
exports.listOfObjectAnyFieldsAnyValuesValidator = (0, exports.listValidator)(exports.objectAnyFieldsAnyValuesValidator);
exports.listOfUniqueStringsValidatorEmptyOk = (0, exports.listValidatorUniqueEmptyOkay)(exports.stringValidator);
var booleanValidatorBuilder = function (defaults) { return ({
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return (0, exports.build_validator)(function (boolean) {
            if (boolean === 'true')
                return true;
            if (boolean === 'false')
                return false;
            if (typeof boolean !== 'boolean') {
                throw new Error(options.errorMessage || "Invalid boolean");
            }
            return boolean;
        }, __assign(__assign(__assign({}, defaults), options), { isBoolean: true, listOf: false }));
    },
    getExample: function () { return true; },
    getType: function () { return "boolean"; },
}); };
exports.booleanValidatorBuilder = booleanValidatorBuilder;
exports.booleanValidator = (0, exports.booleanValidatorBuilder)({});
exports.booleanValidatorOptional = (0, exports.booleanValidatorBuilder)({ isOptional: true });
var escapeMongoId = function (mongoId) {
    if (typeof mongoId !== 'string')
        throw new Error('Expecting string id');
    if (!(0, exports.isMongoId)(mongoId)) {
        throw new Error("Invalid id");
    }
    return mongoId;
};
exports.escapeMongoId = escapeMongoId;
exports.mongoIdValidator = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)(function (s) { return (0, utilities_2.to_object_id)((0, exports.escapeMongoId)(s)); }, __assign(__assign({}, optionsWithDefaults(o)), { maxLength: 100, listOf: false }));
    },
    getType: getTypeString,
    getExample: getExampleObjectId,
};
var buildMongoIdStringValidator = function (options) { return ({
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)(exports.escapeMongoId, __assign(__assign({}, optionsWithDefaults(__assign(__assign({}, options), o))), { maxLength: 100, listOf: false }));
    },
    getType: getTypeString,
    getExample: getExampleObjectId,
}); };
exports.buildMongoIdStringValidator = buildMongoIdStringValidator;
var nullValidator = function (o) {
    if (o === void 0) { o = {}; }
    return (0, exports.build_validator)(function (v) {
        if (v !== null)
            throw Error('Expecting null');
        return v;
    }, __assign(__assign({}, o), { listOf: false }));
};
exports.nullValidator = nullValidator;
exports.stringReadonlyValidator = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)(function (s) { throw new Error("This field cannot be updated"); }, __assign(__assign({}, o), { isOptional: true, emptyStringOk: true, listOf: false }));
    },
    getType: getTypeString,
    getExample: function () { return "string (readonly)"; },
};
exports.mongoIdRequired = exports.mongoIdValidator.validate();
exports.mongoIdOptional = exports.mongoIdValidator.validate({ isOptional: true });
exports.listOfMongoIdValidator = (0, exports.listValidator)(exports.mongoIdValidator);
exports.mongoIdStringRequired = (0, exports.buildMongoIdStringValidator)({ isOptional: false });
exports.mongoIdStringOptional = (0, exports.buildMongoIdStringValidator)({ isOptional: true });
exports.listOfMongoIdStringValidator = (0, exports.listValidator)(exports.mongoIdStringRequired);
exports.listOfMongoIdStringValidatorOptional = (0, exports.listValidator)(exports.mongoIdStringRequired, { isOptional: true });
exports.listOfMongoIdStringValidatorEmptyOk = (0, exports.listValidatorEmptyOk)(exports.mongoIdStringRequired);
exports.listOfMongoIdStringValidatorOptionalOrEmptyOk = (0, exports.listValidatorOptionalOrEmptyOk)(exports.mongoIdStringRequired);
exports.sharedWithOrganizationIdsValidator = (0, exports.listValidatorEmptyOk)((0, exports.listValidator)(exports.mongoIdStringRequired));
exports.slugValidator = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)(function (s) {
            if (typeof s !== 'string')
                throw new Error("Expecting a string");
            if (!(0, exports.isSlug)(s))
                throw new Error("Invalid format for ".concat(s));
            return s;
        }, __assign(__assign({}, optionsWithDefaults(o)), { maxLength: 10000, listOf: false }));
    },
    getType: getTypeString,
    getExample: function () { return 'this-is-a-slug'; },
};
var first_letter_capitalized = function (s) {
    if (s === void 0) { s = ''; }
    return s.charAt(0).toUpperCase() + s.slice(1);
};
exports.first_letter_capitalized = first_letter_capitalized;
var escape_name = function (namestring) { return namestring.replaceAll(/[^a-zA-Z0-9-_ /.]/g, '').substring(0, 100); };
exports.escape_name = escape_name;
// enforces first-letter capitalization
exports.nameValidator = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return (0, exports.build_validator)(function (name) {
            if (typeof name !== 'string')
                throw new Error('Expecting string value');
            // need to explicitly trim here, trim: true not currently working (mar 7, 2024)
            name = name.trim().substring(0, 100); // escape_name(name)  
            if (!name)
                throw new Error("Invalid name");
            return (0, exports.first_letter_capitalized)(name);
        }, __assign(__assign({}, options), { maxLength: 100, trim: true, listOf: false }));
    },
    getExample: function () { return 'John'; },
    getType: getTypeString,
};
exports.emailValidator = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return (0, exports.build_validator)(function (email) {
            if (typeof email !== 'string')
                throw new Error('Expecting string value');
            if (!(0, exports.isEmail)(email)) {
                throw new Error(options.errorMessage || "Invalid email: ".concat(escape_fieldValue(email)));
            }
            return email.toLowerCase();
        }, __assign(__assign({}, options), { maxLength: 250, listOf: false }));
    },
    getExample: function () { return "example@tellescope.com"; },
    getType: getTypeString,
};
exports.emailValidatorOptional = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return (0, exports.build_validator)(function (email) {
            if (typeof email !== 'string')
                throw new Error('Expecting string value');
            if (!(0, exports.isEmail)(email)) {
                throw new Error(options.errorMessage || "Invalid email: ".concat(escape_fieldValue(email)));
            }
            return email.toLowerCase();
        }, __assign(__assign({}, options), { maxLength: 250, listOf: false, isOptional: true, emptyStringOk: true }));
    },
    getExample: function () { return "example@tellescope.com"; },
    getType: getTypeString,
};
exports.emailValidatorEmptyOkay = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return (0, exports.build_validator)(function (email) {
            if (typeof email !== 'string')
                throw new Error('Expecting string value');
            if (!(0, exports.isEmail)(email)) {
                throw new Error(options.errorMessage || "Invalid email: ".concat(escape_fieldValue(email)));
            }
            return email.toLowerCase();
        }, __assign(__assign({}, options), { maxLength: 250, emptyStringOk: true, listOf: false }));
    },
    getExample: function () { return "example@tellescope.com"; },
    getType: getTypeString,
};
var numberValidatorBuilder = function (_a) {
    var lower = _a.lower, upper = _a.upper, higherOptions = __rest(_a, ["lower", "upper"]);
    return ({
        validate: function (options) {
            if (options === void 0) { options = {}; }
            options.isNumber = true;
            return (0, exports.build_validator)(function (number) {
                number = Number(number); // ok to throw error!
                if (typeof number !== "number" || isNaN(number)) {
                    throw new Error(options.errorMessage || "Not a valid number");
                }
                if (!(lower || upper))
                    return number;
                if (!(number >= lower && number <= upper)) {
                    throw new Error(options.errorMessage || "Not a valid number for [".concat(lower, "-").concat(upper, "]"));
                }
                return number;
            }, __assign(__assign({}, optionsWithDefaults(__assign(__assign({}, higherOptions), options))), { listOf: false }));
        },
        getExample: function () { return lower; },
        getType: getTypeNumber,
    });
};
exports.numberValidatorBuilder = numberValidatorBuilder;
exports.nonNegNumberValidator = (0, exports.numberValidatorBuilder)({ lower: 0, upper: 10000000000000 }); // max is 2286 in UTC MS
exports.positiveNumberValidator = (0, exports.numberValidatorBuilder)({ lower: 1, upper: 10000000000000 }); // max is 2286 in UTC MS
exports.numberValidator = (0, exports.numberValidatorBuilder)({ lower: -10000000000000, upper: 10000000000000 }); // max is 2286 in UTC MS
exports.numberValidatorOptional = (0, exports.numberValidatorBuilder)({ lower: -10000000000000, upper: 10000000000000, isOptional: true, emptyStringOk: true }); // max is 2286 in UTC MS
exports.listOfNumbersValidatorUniqueOptionalOrEmptyOkay = (0, exports.listValidatorUniqueOptionalEmptyOkay)(exports.numberValidator, { isNumber: true });
exports.fileSizeValidator = (0, exports.numberValidatorBuilder)({ lower: 0, upper: exports.MAX_FILE_SIZE });
exports.numberOrStringValidatorEmptyOkay = (0, exports.orValidator)({
    number: exports.numberValidator,
    string: exports.stringValidator5000EmptyOkay,
});
exports.numberOrStringValidatorOptional = (0, exports.orValidator)({
    number: exports.numberValidatorOptional,
    string: exports.stringValidatorOptional
});
exports.dateValidator = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return (0, exports.build_validator)(function (date) {
            if ((0, exports.isDate)(date))
                throw new Error(options.errorMessage || "Invalid date");
            return new Date(date);
        }, __assign(__assign({}, options), { maxLength: 250, listOf: false }));
    },
    getExample: function () { return new Date().toISOString(); },
    getType: function () { return "Date"; },
};
exports.dateOptionalOrEmptyStringValidator = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return (0, exports.build_validator)(function (date) {
            if (date === '')
                return date;
            // coerce to string in case date is an actual Date object
            if ((0, exports.isDate)(date === null || date === void 0 ? void 0 : date.toString()))
                throw new Error(options.errorMessage || "Invalid date");
            return new Date(date);
        }, __assign(__assign({}, options), { maxLength: 250, emptyStringOk: true, isOptional: true, listOf: false }));
    },
    getExample: function () { return new Date().toISOString(); },
    getType: function () { return "Date"; },
};
exports.dateValidatorOptional = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return (0, exports.build_validator)(function (date) {
            if ((0, exports.isDate)(date))
                throw new Error(options.errorMessage || "Invalid date");
            return new Date(date);
        }, __assign(__assign({}, options), { maxLength: 250, listOf: false, isOptional: true, emptyStringOk: true }));
    },
    getExample: function () { return new Date().toISOString(); },
    getType: function () { return "Date"; },
};
exports.dateRangeValidator = (0, exports.objectValidator)({
    from: exports.dateOptionalOrEmptyStringValidator,
    to: exports.dateOptionalOrEmptyStringValidator,
});
exports.dateRangeOptionalValidator = (0, exports.objectValidator)({
    from: exports.dateOptionalOrEmptyStringValidator,
    to: exports.dateOptionalOrEmptyStringValidator,
}, { isOptional: true, emptyOk: true });
var exactMatchValidator = function (matches, options) { return ({
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)(function (match) {
            if (matches.filter(function (m) { return m === match; }).length === 0) {
                throw new Error("Value must match one of ".concat(matches));
            }
            return match;
        }, __assign(__assign({}, o), { nullOk: matches.includes(null), listOf: false }));
    },
    getExample: function () { var _a; return (_a = matches[0]) !== null && _a !== void 0 ? _a : 'null'; },
    getType: getTypeString,
}); };
exports.exactMatchValidator = exactMatchValidator;
var exactMatchValidatorOptional = function (matches) { return ({
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return (0, exports.build_validator)(function (match) {
            if (matches.filter(function (m) { return m === match; }).length === 0) {
                throw new Error("Value must match one of ".concat(matches));
            }
            return match;
        }, __assign(__assign({}, o), { nullOk: matches.includes(null), listOf: false, isOptional: true }));
    },
    getExample: function () { var _a; return (_a = matches[0]) !== null && _a !== void 0 ? _a : 'null'; },
    getType: getTypeString,
}); };
exports.exactMatchValidatorOptional = exactMatchValidatorOptional;
var exactMatchListValidator = function (matches) { return (0, exports.listValidator)((0, exports.exactMatchValidator)(matches)); };
exports.exactMatchListValidator = exactMatchListValidator;
exports.stateValidator = (0, exports.exactMatchValidator)(types_models_1.VALID_STATES);
exports.stateValidatorOptional = (0, exports.exactMatchValidatorOptional)(types_models_1.VALID_STATES);
exports.journeysValidator = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return (0, exports.build_validator)(function (journeys) {
            if (typeof journeys !== 'object') {
                throw new Error('Expecting an object');
            }
            var mIdValidator = exports.mongoIdValidator.validate();
            var stateValidator = exports.stringValidator.validate({ isOptional: true, maxLength: 75, errorMessage: "Journey state names may not exceed 75 characters" });
            for (var j in journeys) {
                mIdValidator(j);
                journeys[j] = stateValidator(journeys[j]);
            }
            return journeys;
        }, __assign(__assign({}, options), { isObject: true, listOf: false }));
    },
    getExample: function () {
        var _a;
        return (_a = {}, _a[EXAMPLE_OBJECT_ID] = "status", _a);
    },
    getType: function () { return ({ string: "string" }); },
};
var escape_phone_number = function (p) {
    if (p === void 0) { p = ''; }
    return p.replace(/[^\d+]/g, '');
};
exports.escape_phone_number = escape_phone_number;
exports.phoneValidator = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return (0, exports.build_validator)(function (phone) {
            if (typeof phone !== "string")
                throw new Error("Expecting phone to be string but got ".concat(phone));
            var escaped = (0, exports.escape_phone_number)(phone);
            if (escaped === '311')
                return escaped;
            if (escaped.length < 10)
                throw new Error("Phone number must be at least 10 digits");
            escaped = escaped.startsWith('+') ? escaped
                : escaped.length === 10 ? '+1' + escaped // assume US country code for now
                    : "+" + escaped; // assume country code provided, but missing leading +
            // phone numbers from Gambia, which is not supported by isMobilePhone
            if (escaped.length === 11 && escaped.startsWith('+220') && /[0-9]$/.test(escaped.substring(1))) {
                return escaped;
            }
            if (!(0, exports.isMobilePhone)(escaped, 'any', { strictMode: true })) {
                throw "Invalid phone number: ".concat(phone);
            }
            return escaped;
        }, __assign(__assign({}, options), { maxLength: 25, listOf: false }));
    },
    getExample: function () { return "+15555555555"; },
    getType: getTypeString,
};
exports.phoneValidatorOptional = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return (0, exports.build_validator)(function (phone) {
            if (typeof phone !== "string")
                throw new Error("Expecting phone to be string but got ".concat(phone));
            var escaped = (0, exports.escape_phone_number)(phone);
            if (escaped === '311')
                return escaped;
            if (escaped.length < 10)
                throw new Error("Phone number must be at least 10 digits");
            escaped = escaped.startsWith('+') ? escaped
                : escaped.length === 10 ? '+1' + escaped // assume US country code for now
                    : "+" + escaped; // assume country code provided, but missing leading +
            // phone numbers from Gambia, which is not supported by isMobilePhone
            if (escaped.length === 11 && escaped.startsWith('+220') && /[0-9]$/.test(escaped.substring(1))) {
                return escaped;
            }
            if (!(0, exports.isMobilePhone)(escaped, 'any', { strictMode: true })) {
                throw "Invalid phone number: ".concat(phone);
            }
            return escaped;
        }, __assign(__assign({}, options), { maxLength: 25, listOf: false, isOptional: true, emptyStringOk: true }));
    },
    getExample: function () { return "+15555555555"; },
    getType: getTypeString,
};
exports.fileTypeValidator = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return (0, exports.build_validator)(function (s) {
            if (typeof s !== 'string')
                throw new Error("fileType must be a string");
            if (!(0, exports.isMimeType)(s))
                throw new Error("".concat(s, " is not a valid file type"));
            return s;
        }, __assign(__assign({}, options), { emptyStringOk: true, listOf: false }));
    },
    getExample: function () { return 'text/plain'; },
    getType: getTypeString,
};
exports.urlValidator = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return (0, exports.build_validator)(function (s) {
            if (typeof s !== 'string')
                throw new Error("URL must be a string");
            if (!(0, exports.isURL)(s))
                throw new Error("".concat(s, " is not a valid URL"));
            return s;
        }, __assign(__assign({}, options), { listOf: false }));
    },
    getExample: function () { return '"https://www.tellescope.com"'; },
    getType: getTypeString,
};
exports.safeBase64Validator = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return (0, exports.build_validator)(function (sb64) {
            if (typeof sb64 !== 'string')
                throw new Error("Expecting string");
            // https://stackoverflow.com/questions/12930007/how-to-validate-base64-string-using-regex-in-javascript
            // regex with = + and / replaced as get_random_base64_URL_safe 
            if (!/^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2}..|[A-Za-z0-9_-]{3}.)?$/.test(sb64)) {
                throw "Invalid safe base64";
            }
            return sb64;
        }, __assign(__assign({}, options), { listOf: false }));
    },
    getExample: function () { return '129vjas0fkj1234jgfmnaef'; },
    getType: getTypeString,
};
exports.subdomainValidator = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return (0, exports.build_validator)(function (subdomain) {
            if (typeof subdomain !== 'string')
                throw new Error("Expecting string value");
            subdomain = subdomain.toLowerCase();
            if (subdomain.startsWith('-')) {
                subdomain = subdomain.substring(1);
            }
            while (subdomain.endsWith('-')) {
                subdomain = subdomain.substring(0, subdomain.length - 1);
            }
            subdomain = subdomain.replace(/[^a-zA-Z\d-]/g, '');
            return subdomain;
        }, __assign(__assign({}, options), { maxLength: 50, listOf: false }));
    },
    getExample: function () { return 'example'; },
    getType: getTypeString,
};
// export const fileResponseValidator: EscapeBuilder<FileResponse> = (options={}) => build_validator(
//   (file: any) => {
//     if (!file.secureName) throw new Error("Missing name")
//     return {
//       type: 'file',
//       name: stringValidator({ shouldTruncate: true, maxLength: 250 })(file.name).substring(0, 250),
//       secureName: safeBase64Validator()(file.secureName)
//     }
//   }, 
//   { ...options, isObject: true, listOf: false }
// )
exports.fileResponseValidator = (0, exports.objectValidator)({
    type: (0, exports.exactMatchValidator)(['file']),
    name: exports.stringValidator1000,
    secureName: exports.stringValidator250,
});
exports.signatureResponseValidator = (0, exports.objectValidator)({
    type: (0, exports.exactMatchValidator)(['signature']),
    fullName: exports.stringValidator100,
    signed: exports.booleanValidator,
});
exports.labeledFieldsValidator = (0, exports.listValidatorOptionalOrEmptyOk)((0, exports.objectValidator)({
    field: exports.stringValidator100,
    value: exports.stringValidator5000,
}));
var DEFAULT_ENDUSER_FIELDS = [
    '_id', 'email', 'phone', 'fname', 'lname', 'journeys', 'tags', 'preference'
];
// todo: move preference to FIELD_TYPES with drop-down option in user-facing forms
// const FIELD_TYPES = ['string', 'number', 'email', 'phone', 'multiple_choice', 'file', 'signature']
// const VALIDATE_OPTIONS_FOR_FIELD_TYPES = {
//   'multiple_choice': {
//     choices: listOfStringsValidator({  maxLength: 100, errorMessage: "Multiple choice options must be under 100 characters, and you must have at least one option." }),
//     radio: booleanValidator({ errorMessage: "radio must be a boolean" }),
//     other: booleanValidator({ isOptional: true, errorMessage: "other must be a boolean" }),
//     REQUIRED: ['choices', 'radio'],
//   }
// }
var _FORM_FIELD_TYPES = {
    "Appointment Booking": '',
    email: '',
    file: '',
    files: '',
    multiple_choice: '',
    number: '',
    phone: '',
    signature: '',
    string: '',
    stringLong: '',
    ranking: '',
    rating: '',
    date: '',
    dateString: '',
    "Question Group": '',
    "Table Input": '',
    description: '',
    Address: '',
    Time: '',
    Stripe: '',
    Chargebee: '',
    Dropdown: '',
    "Database Select": '',
    Medications: '',
    "Related Contacts": "",
    'Insurance': '',
    Height: '',
    Redirect: '',
    'Hidden Value': '',
    Emotii: '',
    Allergies: "",
    Conditions: "",
    "Rich Text": "",
};
exports.FORM_FIELD_TYPES = Object.keys(_FORM_FIELD_TYPES);
exports.formFieldTypeValidator = (0, exports.exactMatchValidator)(exports.FORM_FIELD_TYPES);
exports.FORM_FIELD_VALIDATORS_BY_TYPE = {
    'Chargebee': exports.objectAnyFieldsAnyValuesValidator.validate(),
    'Allergies': exports.objectAnyFieldsAnyValuesValidator.validate(),
    'Conditions': exports.objectAnyFieldsAnyValuesValidator.validate(),
    "Emotii": exports.stringValidator.validate({ maxLength: 5000 }),
    "Hidden Value": exports.stringValidator.validate({ maxLength: 5000 }),
    'Appointment Booking': exports.stringValidator.validate({ maxLength: 100, isOptional: true }),
    'Redirect': exports.stringValidator.validate({ maxLength: 100 }),
    'Related Contacts': exports.objectAnyFieldsAnyValuesValidator.validate(),
    'Insurance': exports.objectAnyFieldsAnyValuesValidator.validate(),
    'Address': exports.objectAnyFieldsAnyValuesValidator.validate(),
    'Database Select': exports.objectAnyFieldsAnyValuesValidator.validate(),
    'Height': exports.objectAnyFieldsAnyValuesValidator.validate(),
    'Time': exports.stringValidator.validate({ maxLength: 100 }),
    'Stripe': exports.stringValidator.validate({ maxLength: 100 }),
    'Medications': (0, exports.listValidator)(exports.objectAnyFieldsAnyValuesValidator).validate(),
    Dropdown: exports.listOfStringsValidator.validate({ emptyListOk: true }),
    'description': function (g) { return ''; },
    'Table Input': function (g) { return Array.isArray(g) ? g : []; },
    'Question Group': function (g) { return Array.isArray(g) ? g : []; },
    // need to keep consistent with other validation
    'string': exports.stringValidator.validate({ maxLength: 5000, emptyStringOk: true, errorMessage: "Response must not exceed 5000 characters" }),
    'stringLong': exports.stringValidator.validate({ maxLength: 20000, emptyStringOk: true, errorMessage: "Response must not exceed 20000 characters" }),
    'Rich Text': exports.stringValidator.validate({ maxLength: 25000, emptyStringOk: true, errorMessage: "Response must not exceed 25000 characters" }),
    'number': exports.numberValidator.validate({ errorMessage: "Response must be a number" }),
    'email': exports.emailValidator.validate(),
    'userEmail': exports.emailValidator.validate(),
    'phone': exports.phoneValidator.validate(),
    'phoneNumber': exports.phoneValidator.validate(),
    "date": exports.dateValidator.validate(),
    "dateString": exports.stringValidator100.validate(),
    "ranking": exports.listOfStringsValidator.validate(),
    "rating": exports.numberValidator.validate(),
    // fileInfo: FileResponse
    'file': function (fileInfo, _, isOptional) {
        if (isOptional && (!fileInfo || (0, utilities_2.object_is_empty)(fileInfo))) {
            return { type: 'file', secureName: null };
        }
        return exports.fileResponseValidator.validate()(fileInfo);
    },
    'files': function (fs) { return fs; },
    'signature': function (sigInfo, _, isOptional) {
        if (isOptional && (!sigInfo || (0, utilities_2.object_is_empty)(sigInfo))) {
            return { type: 'signature', signed: null };
        }
        return exports.signatureResponseValidator.validate()(sigInfo);
    },
    // choiceInfo: { indexes: [], otherText?: string }  
    'multiple_choice': function (choiceInfo, fieldOptions, isOptional) {
        if (isOptional && !choiceInfo)
            return [];
        var indexes = choiceInfo.indexes, otherText = choiceInfo.otherText;
        if (!indexes || indexes.length === undefined) { // no indexes (or empty array) provided
            throw new Error('At least 1 choice is required');
        }
        var parsed = [];
        for (var _i = 0, indexes_1 = indexes; _i < indexes_1.length; _i++) {
            var i = indexes_1[_i];
            if (typeof i !== 'number')
                throw new Error("Choice ".concat(i, " is not a valid index"));
            if (i < 0 || i >= fieldOptions.choices.length)
                throw new Error("Choice ".concat(i, " is not a valid index"));
            parsed.push(fieldOptions.choices[i]);
        }
        if (otherText && fieldOptions.other === true)
            parsed.push(otherText);
        // todo: add length limit to otherText?
        if (parsed.length === 0)
            throw new Error("No options provided");
        if (parsed.length > 1 && fieldOptions.radio === true)
            throw new Error("Only 1 choice is allowed");
        return parsed;
    },
};
exports.fieldsValidator = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return (0, exports.build_validator)(function (fields) {
            if (!(0, utilities_2.is_object)(fields))
                throw new Error("Expecting an object");
            for (var k in fields) {
                if (DEFAULT_ENDUSER_FIELDS.includes(k))
                    throw new Error("key ".concat(k, " conflicts with a built-in field."));
                if (k.startsWith('_'))
                    throw new Error("Fields that start with '_' are not allowed");
                if ((0, utilities_2.is_whitespace)(k)) {
                    delete fields[k];
                    continue;
                }
                if (k.length > 256)
                    throw new Error("key ".concat(k, " is greater than 256 characters"));
                var val = fields[k];
                if (typeof val === 'string') {
                    if (val.length > 512)
                        fields[k] = val.substring(0, 512);
                    continue;
                }
                else if (typeof val === 'number' || val === null || typeof val === 'boolean') {
                    continue; // nothing to restrict on number type yet
                }
                else if (typeof val === 'object') {
                    if (JSON.stringify(val).length > 10000)
                        throw new Error("object value for key ".concat(k, " exceeds the maximum length of 10000 characters in string representation"));
                    // previous restricted structure for fields object
                    // try {
                    //   if (val.type && typeof val.type === 'string') { // form responses can be stored as custom fields (form responses is simple array)
                    //     FORM_FIELD_VALIDATORS_BY_TYPE[val.type as keyof typeof FORM_FIELD_VALIDATORS_BY_TYPE](val, undefined as never, undefined as never)
                    //     continue
                    //   }
                    //   if (val.length && typeof val.length === 'number') { // array of strings is ok too, (inclusive of multiple-choice responses)
                    //     if (val.find((s: any) => typeof s !== 'string') !== undefined) {
                    //       throw new Error('List must contain only strings')
                    //     }
                    //     continue 
                    //   }
                    //   if (val.value === undefined) throw new Error(`value field is undefined for key ${k}`)
                    //   if (JSON.stringify(val).length > 1024) throw new Error(`object value for key ${k} exceeds the maximum length of 1024 characters in string representation`)
                    //   const escaped = { value: val.value } as Indexable // create new object to omit unrecognized fields
                    //   escaped.title = val.title // optional
                    //   escaped.description = val.description // optional
                    //   fields[k] = escaped
                    // } catch(err) {
                    //   throw new Error(`object value is invalid JSON for key ${k}`)
                    // }
                }
                else {
                    throw new Error("Expecting value to be a string or object but got ".concat(typeof val, " for key ").concat(k));
                }
            }
            return fields;
        }, __assign(__assign({}, options), { maxLength: 100000, isObject: true, listOf: false }));
    },
    getExample: function () { return "{}"; },
    getType: function () { return "{}"; },
};
exports.preferenceValidator = (0, exports.exactMatchValidator)(['email', 'sms', 'call', 'chat']);
exports.updateOptionsValidator = (0, exports.objectValidator)({
    replaceObjectFields: exports.booleanValidatorOptional,
    dontSendWebhook: exports.booleanValidatorOptional,
}, { isOptional: true });
exports.journeyStatePriorityValidator = (0, exports.exactMatchValidator)(["Disengaged", "N/A", "Engaged"]);
exports.journeyStateValidator = (0, exports.objectValidator)({
    name: exports.stringValidator100,
    priority: exports.journeyStatePriorityValidator,
    description: exports.stringValidatorOptional,
    requiresFollowup: exports.booleanValidatorOptional, // deprecated
});
// deprecated
// export const journeyStateUpdateValidator = objectValidator<JourneyState>({
//   name: stringValidator100({ isOptional: true }),
//   priority: journeyStatePriorityValidator({ isOptional: true }),
//   description: stringValidator({ isOptional: true }),
//   requiresFollowup: booleanValidator({ isOptional: true }),
// })
exports.journeyStatesValidator = (0, exports.listValidator)(exports.journeyStateValidator);
exports.emailEncodingValidator = (0, exports.exactMatchValidator)(['', 'base64']);
var validateIndexable = function (keyValidator, valueValidator) { return function (o) { return (0, exports.build_validator)(function (v) {
    if (!(0, utilities_2.is_object)(v))
        throw new Error("Expecting an object");
    var validated = {};
    for (var k in v) {
        validated[keyValidator(k)] = valueValidator(v[k]);
    }
    return validated;
}, __assign(__assign({}, o), { isObject: true, listOf: false })); }; };
exports.validateIndexable = validateIndexable;
var indexableValidator = function (keyValidator, valueValidator) { return ({
    validate: (0, exports.validateIndexable)(keyValidator.validate(), valueValidator.validate()),
    getExample: function () { return "{ ".concat(keyValidator.getExample(), ": ").concat(valueValidator.getExample(), " }"); },
    getType: function () { return "{ ".concat(keyValidator.getType(), ": ").concat(valueValidator.getType(), " }"); },
}); };
exports.indexableValidator = indexableValidator;
var indexableNumberValidator = function (keyValidator, valueValidator) { return ({
    validate: (0, exports.validateIndexable)(keyValidator.validate(), valueValidator.validate()),
    getExample: function () { return "{ ".concat(keyValidator.getExample(), ": ").concat(valueValidator.getExample(), " }"); },
    getType: function () { return "{ ".concat(keyValidator.getType(), ": ").concat(valueValidator.getType(), " }"); },
}); };
exports.indexableNumberValidator = indexableNumberValidator;
var rejectionWithMessage = function (o) { return (0, exports.build_validator)(function (v) { throw new Error((o === null || o === void 0 ? void 0 : o.errorMessage) || 'This field is not valid'); }, __assign(__assign({}, o), { isOptional: true, listOf: false })); };
exports.rejectionWithMessage = rejectionWithMessage;
exports.numberToDateValidator = (0, exports.indexableNumberValidator)(exports.numberValidator, exports.dateValidator);
exports.idStringToDateValidator = (0, exports.indexableValidator)(exports.mongoIdStringRequired, exports.dateOptionalOrEmptyStringValidator);
// todo: move preference to FIELD_TYPES with drop-down option in user-facing forms
var FIELD_TYPES = ['string', 'number', 'email', 'phone', 'multiple_choice', 'file', 'signature'];
var VALIDATE_OPTIONS_FOR_FIELD_TYPES = {
    'multiple_choice': {
        choices: exports.listOfStringsValidator,
        radio: exports.booleanValidator,
        other: exports.booleanValidatorOptional,
        REQUIRED: ['choices', 'radio'],
    }
};
exports.RESERVED_INTAKE_FIELDS = ['_id', 'id', 'externalId', 'phoneConsent', 'emailConsent', 'tags', 'journeys', 'updatedAt', 'preference', 'assignedTo', 'lastCommunication'];
exports.INTERNAL_NAME_TO_DISPLAY_FIELD = {
    "string": 'Text',
    "stringLong": 'Text Long',
    'file': "File",
    'dateString': "Date",
    'date': "Date & Time",
    'rating': "Rating",
    'ranking': "Ranking",
    "number": 'Number',
    "email": "Email",
    "phone": "Phone Number",
    multiple_choice: "Multiple Choice",
    "signature": "Signature",
};
var isFormField = function (f, fieldOptions) {
    if (fieldOptions === void 0) { fieldOptions = { forUpdate: false }; }
    if (!(0, utilities_2.is_object)(f))
        throw new Error("Expecting an object");
    var field = f;
    var forUpdate = fieldOptions.forUpdate;
    if (forUpdate) {
        var isOptional = field.isOptional, type = field.type, title = field.title, description = field.description, intakeField = field.intakeField, options = field.options;
        if ((0, utilities_2.object_is_empty)((0, utilities_2.filter_object)({
            isOptional: isOptional,
            type: type,
            title: title,
            description: description,
            intakeField: intakeField,
            options: options
        }, utilities_2.is_defined))) {
            throw "No update provided";
        }
    }
    if (forUpdate === false || field.isOptional !== undefined)
        field.isOptional = !!field.isOptional; // coerce to bool, defaulting to false (required)
    if (!forUpdate && !field.type)
        throw "field.type is required"; // fieldName otherwise given as 'field' in validation for every subfield
    if (field.type)
        (0, exports.exactMatchValidator)(FIELD_TYPES).validate(field.type);
    if (!forUpdate && !field.title)
        throw "field.title is required"; // fieldName otherwise given as 'field' in validation for every subfield
    if (field.title) {
        field.title = exports.stringValidator.validate({
            maxLength: 100,
            errorMessage: "field title is required and must not exceed 100 characters"
        })(field.title);
    }
    if (!forUpdate || field.description !== undefined) { // don't overwrite description on update with ''
        field.description = exports.stringValidator.validate({
            isOptional: true,
            maxLength: 500,
            errorMessage: "field description must be under 500 characters"
        })(field.description) || '';
    }
    field.options = field.options || {}; // ensure at least an empty object is provided
    if (VALIDATE_OPTIONS_FOR_FIELD_TYPES[field.type] !== undefined) {
        if (typeof field.options !== 'object')
            throw new Error("Expected options to be an object but got ".concat(typeof field.options));
        var validators = VALIDATE_OPTIONS_FOR_FIELD_TYPES[field.type];
        var requiredOptions = validators.REQUIRED;
        if (requiredOptions.length > Object.keys(field.options).length) {
            for (var _i = 0, requiredOptions_1 = requiredOptions; _i < requiredOptions_1.length; _i++) {
                var k = requiredOptions_1[_i];
                if (field.options[k] === undefined) {
                    throw new Error("Missing required field ".concat(k));
                }
            }
        }
        for (var k in field.options) {
            if (validators[k] === undefined) {
                throw new Error("Got unexpected option ".concat(k, " for field of type ").concat(exports.INTERNAL_NAME_TO_DISPLAY_FIELD[field.type] || 'Text'));
            }
            field.options[k] = validators[k].validate(field.options[k]);
        }
    }
    if (field.intakeField !== undefined) { // allow null to unset intake
        if (exports.RESERVED_INTAKE_FIELDS.includes(field.intakeField)) {
            throw new Error("".concat(field.intakeField, " is reserved for internal use only and cannot be used as an intake field"));
        }
        var intakeTypes = constants_1.ENDUSER_FIELD_TYPES[field.intakeField];
        if (intakeTypes && !intakeTypes.includes(field.type)) {
            throw new Error("Intake field ".concat(field.intakeField, " requires a form field type of ").concat(intakeTypes.join(', ') || 'Text'));
        }
    }
    return field;
};
exports.addressValidator = (0, exports.objectValidator)({
    city: exports.stringValidator,
    state: exports.stateValidator,
    lineOne: exports.stringValidator,
    lineTwo: exports.stringValidatorOptional,
    zipCode: exports.stringValidator100,
    zipPlusFour: exports.stringValidator1000Optional,
    title: exports.stringValidator1000Optional,
});
exports.addressOptionalValidator = (0, exports.objectValidator)({
    city: exports.stringValidatorOptional,
    state: exports.stateValidatorOptional,
    lineOne: exports.stringValidatorOptional,
    lineTwo: exports.stringValidatorOptional,
    zipCode: exports.stringValidator1000Optional,
    zipPlusFour: exports.stringValidator1000Optional,
    title: exports.stringValidator1000Optional,
}, { isOptional: true, emptyOk: true });
var _TELLESCOPE_GENDER = {
    Female: '',
    Male: '',
    Other: '',
    Unknown: '',
};
exports.TELLESCOPE_GENDER = Object.keys(_TELLESCOPE_GENDER);
exports.tellescopeGenderValidator = (0, exports.exactMatchValidator)(exports.TELLESCOPE_GENDER);
exports.tellescopeGenderOptionalValidator = (0, exports.exactMatchValidatorOptional)(__spreadArray(__spreadArray([], exports.TELLESCOPE_GENDER, true), [''], false));
exports.insuranceOptionalValidator = (0, exports.objectValidator)({
    memberId: exports.stringValidatorOptional,
    payerId: exports.stringValidatorOptional,
    payerName: exports.stringValidatorOptional,
    cardFront: exports.stringValidatorOptional,
    cardBack: exports.stringValidatorOptional,
    relationship: (0, exports.exactMatchValidatorOptional)(constants_1.INSURANCE_RELATIONSHIPS),
    coverageId: exports.stringValidatorOptional,
    requestId: exports.stringValidatorOptional,
    eligibility: exports.stringValidator100000OptionalEmptyOkay,
    // eligible: booleanValidatorOptional,
    eligibilityRanAt: exports.dateValidatorOptional,
    status: exports.stringValidatorOptional,
    relationshipDetails: (0, exports.objectValidator)({
        // address: addressOptionalValidator, // optional for Candid
        fname: exports.stringValidatorOptional,
        lname: exports.stringValidatorOptional,
        gender: exports.tellescopeGenderOptionalValidator,
        dateOfBirth: exports.stringValidatorOptional, // required for Canvas, optional for Candid
    }, { isOptional: true, emptyOk: true }),
    payerType: exports.stringValidatorOptional,
    groupNumber: exports.stringValidatorOptional,
    planName: exports.stringValidatorOptional,
    startDate: exports.stringValidatorOptional,
}, { isOptional: true, emptyOk: true });
// validate optional vs not at endpoint-level
exports.formResponseAnswerValidator = (0, exports.orValidator)({
    Height: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Height']),
        value: (0, exports.objectValidator)({
            feet: exports.numberValidatorOptional,
            inches: exports.numberValidatorOptional,
        }, { emptyOk: true, isOptional: true }),
    }),
    "Appointment Booking": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Appointment Booking']),
        value: exports.stringValidatorOptional,
    }),
    "Redirect": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Redirect']),
        value: exports.stringValidator,
    }),
    "Related Contacts": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Related Contacts']),
        value: (0, exports.listValidatorOptionalOrEmptyOk)(exports.objectAnyFieldsAnyValuesValidator),
    }),
    "Insurance": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Insurance']),
        value: exports.insuranceOptionalValidator,
    }),
    "Question Group": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Question Group']),
        value: (0, exports.listValidatorEmptyOk)((0, exports.objectValidator)({
            id: exports.mongoIdStringRequired,
        }))
    }),
    "Address": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Address']),
        value: (0, exports.objectValidator)({
            addressLineOne: exports.stringValidator1000Optional,
            addressLineTwo: exports.stringValidator1000Optional,
            city: exports.stringValidator1000Optional,
            state: exports.stateValidatorOptional,
            zipCode: exports.stringValidator1000Optional,
            zipPlusFour: exports.stringValidator1000Optional,
        }, { emptyOk: true, isOptional: true })
    }),
    "Table Input": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Table Input']),
        value: (0, exports.listValidatorOptionalOrEmptyOk)(// optional to support optional Table Input questions
        (0, exports.listValidator)((0, exports.objectValidator)({
            label: exports.stringValidator,
            entry: exports.stringValidatorOptionalEmptyOkay,
        })))
    }),
    description: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['description']),
        value: exports.stringValidatorOptionalEmptyOkay,
    }),
    email: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['email']),
        value: exports.emailValidatorOptional,
    }),
    number: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['number']),
        value: exports.numberValidatorOptional,
    }),
    rating: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['rating']),
        value: exports.numberValidatorOptional,
    }),
    phone: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['phone']),
        value: exports.phoneValidatorOptional,
    }),
    string: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['string']),
        value: exports.stringValidator5000Optional,
    }, {
        inputModifier: (function (o) {
            if (typeof (o === null || o === void 0 ? void 0 : o.value) === 'number') {
                return __assign(__assign({}, o), { value: o.value.toString() });
            }
            if (Array.isArray(o === null || o === void 0 ? void 0 : o.value) && o.value.length === 1 && typeof (o === null || o === void 0 ? void 0 : o.value[0]) === 'string') {
                return __assign(__assign({}, o), { value: o.value[0] });
            }
            return o;
        })
    }),
    Time: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Time']),
        value: exports.stringValidator1000Optional,
    }),
    "Hidden Value": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Hidden Value']),
        value: exports.stringValidator1000Optional,
    }),
    "Emotii": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Emotii']),
        value: exports.stringValidator1000Optional,
    }),
    Stripe: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Stripe']),
        value: exports.stringValidator1000Optional,
    }),
    // need to keep consistent with other validation
    stringLong: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['stringLong']),
        value: exports.stringValidator20000ptional,
    }),
    "Rich Text": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Rich Text']),
        value: exports.stringValidator25000OptionalEmptyOkay,
    }),
    date: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['date']),
        value: exports.dateValidatorOptional,
    }),
    dateString: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['dateString']),
        value: exports.stringValidator1000Optional,
    }),
    file: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['file']),
        value: (0, exports.objectValidator)({
            name: exports.stringValidator5000,
            secureName: exports.stringValidator250,
            type: exports.stringValidator1000Optional,
        }, { emptyOk: false, isOptional: true }),
    }),
    files: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['files']),
        value: (0, exports.listValidatorOptionalOrEmptyOk)((0, exports.objectValidator)({
            name: exports.stringValidator5000,
            secureName: exports.stringValidator250,
            type: exports.stringValidator1000Optional,
        }, { emptyOk: false, isOptional: true })),
    }),
    multiple_choice: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['multiple_choice']),
        value: exports.listOfStringsValidatorOptionalOrEmptyOk,
    }, {
        inputModifier: (function (o) {
            if (typeof (o === null || o === void 0 ? void 0 : o.value) === 'string') {
                return __assign(__assign({}, o), { value: [o.value] });
            }
            return o;
        })
    }),
    Dropdown: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Dropdown']),
        value: exports.listOfStringsValidatorOptionalOrEmptyOk,
    }, {
        inputModifier: (function (o) {
            if (typeof (o === null || o === void 0 ? void 0 : o.value) === 'string') {
                return __assign(__assign({}, o), { value: [o.value] });
            }
            return o;
        })
    }),
    ranking: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['ranking']),
        value: exports.listOfStringsValidatorOptionalOrEmptyOk,
    }),
    signature: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['signature']),
        value: (0, exports.objectValidator)({
            fullName: exports.stringValidator1000Optional,
            signed: exports.booleanValidatorOptional,
            pdfAttachment: exports.stringValidatorOptional,
            url: exports.stringValidator1000Optional,
            signedPdfSecureName: exports.stringReadonlyValidator, // created/set in backend only
        }, { emptyOk: false, isOptional: true }),
    }),
    "Database Select": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Database Select']),
        value: (0, exports.listValidatorOptionalOrEmptyOk)((0, exports.objectValidator)({
            recordId: exports.stringValidatorOptional,
            databaseId: exports.mongoIdStringOptional,
            text: exports.stringValidator25000,
        }, { emptyOk: false, isOptional: true })),
    }, {
        inputModifier: (function (o) {
            var _a;
            if (typeof (o === null || o === void 0 ? void 0 : o.value) === 'string') {
                return __assign(__assign({}, o), { value: [{ text: o.value }] });
            }
            if (Array.isArray(o === null || o === void 0 ? void 0 : o.value) && typeof ((_a = o === null || o === void 0 ? void 0 : o.value) === null || _a === void 0 ? void 0 : _a[0]) === 'string') {
                return __assign(__assign({}, o), { value: o.value.map(function (text) { return ({ text: text }); }) });
            }
            return o;
        })
    }),
    "Medications": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Medications']),
        value: (0, exports.listValidatorOptionalOrEmptyOk)((0, exports.objectValidator)({
            displayTerm: exports.stringValidatorOptionalEmptyOkay,
            drugName: exports.stringValidatorOptionalEmptyOkay,
            drugSynonym: exports.stringValidatorOptionalEmptyOkay,
            otherDrug: exports.stringValidatorOptionalEmptyOkay,
            NDCs: exports.listOfStringsValidatorOptionalOrEmptyOk,
            rxNormCode: exports.stringValidatorOptionalEmptyOkay,
            fdbCode: exports.stringValidatorOptionalEmptyOkay,
            reasonForTaking: exports.stringValidatorOptionalEmptyOkay,
            dosage: (0, exports.objectValidator)({
                description: exports.stringValidatorOptionalEmptyOkay,
                value: exports.stringValidatorOptionalEmptyOkay,
                unit: exports.stringValidatorOptionalEmptyOkay,
                quantity: exports.stringValidatorOptionalEmptyOkay,
                frequency: exports.stringValidatorOptionalEmptyOkay,
                frequencyDescriptor: exports.stringValidatorOptionalEmptyOkay,
            }, { emptyOk: true, isOptional: true }),
        }, { emptyOk: false, isOptional: true })),
    }),
    "Allergies": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Allergies']),
        value: (0, exports.listValidatorOptionalOrEmptyOk)((0, exports.objectValidator)({
            code: exports.stringValidator100,
            display: exports.stringValidator,
            system: exports.stringValidatorOptional,
            note: exports.stringValidatorOptional,
            severity: exports.stringValidatorOptional,
        })),
    }),
    "Conditions": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Conditions']),
        value: (0, exports.listValidatorOptionalOrEmptyOk)((0, exports.objectValidator)({
            code: exports.stringValidator100,
            display: exports.stringValidator,
            system: exports.stringValidator1000,
        })),
    }),
    Chargebee: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Chargebee']),
        value: (0, exports.objectValidator)({
            url: exports.stringValidatorOptional
        }, { emptyOk: true, isOptional: true })
    })
});
exports.mmddyyyyRegex = /^\d{2}-\d{2}-\d{4}$/;
var photonDisabledForEnduser = function (enduser) { return !(enduser.fname && enduser.lname && enduser.gender && enduser.phone
    && enduser.dateOfBirth && exports.mmddyyyyRegex.test(enduser.dateOfBirth)); };
exports.photonDisabledForEnduser = photonDisabledForEnduser;
var fullscriptDisabledForEnduser = function (enduser) { return !(enduser.fname && enduser.lname && enduser.email); };
exports.fullscriptDisabledForEnduser = fullscriptDisabledForEnduser;
exports.formResponseValidator = (0, exports.objectValidator)({
    fieldId: exports.stringValidatorOptionalEmptyOkay,
    fieldTitle: exports.stringValidator5000EmptyOkay,
    fieldDescription: exports.stringValidator5000Optional,
    fieldHtmlDescription: exports.stringValidator25000OptionalEmptyOkay,
    answer: exports.formResponseAnswerValidator,
    answerIsHTML: exports.booleanValidatorOptional,
    externalId: exports.stringValidatorOptional,
    sharedWithEnduser: exports.booleanValidatorOptional,
    isCalledOut: exports.booleanValidatorOptional,
    isHighlightedOnTimeline: exports.booleanValidatorOptional,
    computedValueKey: exports.stringValidatorOptional,
    disabled: exports.booleanValidatorOptional,
    intakeField: exports.stringValidatorOptionalEmptyOkay,
});
exports.formResponsesValidator = (0, exports.listValidator)(exports.formResponseValidator);
exports.intakePhoneValidator = (0, exports.exactMatchValidator)(['optional', 'required', 'hidden']);
exports.intakeDateOfBirthValidator = (0, exports.exactMatchValidator)(['optional', 'required', 'hidden']);
var formFieldValidator = function (options, fieldOptions) {
    if (options === void 0) { options = {}; }
    if (fieldOptions === void 0) { fieldOptions = { forUpdate: false }; }
    return (0, exports.build_validator)(function (v) { return isFormField(v, fieldOptions); }, __assign(__assign({}, options), { isObject: true, listOf: false }));
};
exports.formFieldValidator = formFieldValidator;
var listOfFormFieldsValidator = function (options, fieldOptions) {
    if (options === void 0) { options = {}; }
    if (fieldOptions === void 0) { fieldOptions = { forUpdate: false }; }
    return (0, exports.build_validator)(function (v) { return isFormField(v, fieldOptions); }, __assign(__assign({}, options), { isObject: true, listOf: true, emptyListOk: true }));
};
exports.listOfFormFieldsValidator = listOfFormFieldsValidator;
// // to ensure all topics in type have coverage at compile-time
// const _CHAT_ROOM_TOPICS: { [K in ChatRoomTopic]: any } = {
//   task: '',
//   enduser: '',
// }
// export const CHAT_ROOM_TOPICS = Object.keys(_CHAT_ROOM_TOPICS) as ChatRoomTopic[]
// export const chatRoomTopicValidator = exactMatchValidator<ChatRoomTopic>(CHAT_ROOM_TOPICS)
// to ensure all topics in type have coverage at compile-time
var _CHAT_ROOM_TYPES = {
    internal: '',
    external: '',
    'Group Chat': '',
};
exports.CHAT_ROOM_TYPES = Object.keys(_CHAT_ROOM_TYPES);
exports.chatRoomTypeValidator = (0, exports.exactMatchValidator)(exports.CHAT_ROOM_TYPES);
var _ACCOUNT_TYPES = {
    Business: '',
};
exports.ACCOUNT_TYPES = Object.keys(_ACCOUNT_TYPES);
exports.accountTypeValidator = (0, exports.exactMatchValidator)(exports.ACCOUNT_TYPES);
var _MESSAGE_TEMPLATE_TYPES = {
    enduser: '',
    team: '',
    Reply: '',
};
exports.MESSAGE_TEMPLATE_TYPES = Object.keys(_MESSAGE_TEMPLATE_TYPES);
exports.messageTemplateTypeValidator = (0, exports.exactMatchValidator)(exports.MESSAGE_TEMPLATE_TYPES);
var _MEETING_STATUSES = {
    ended: '',
    live: '',
    scheduled: '',
};
exports.MEETING_STATUSES = Object.keys(_MEETING_STATUSES);
exports.meetingStatusValidator = (0, exports.exactMatchValidator)(exports.MEETING_STATUSES);
var _CUD = {
    create: '',
    update: '',
    delete: '',
};
exports.CUD = Object.keys(_CUD);
exports.CUDStringValidator = (0, exports.exactMatchValidator)(exports.CUD);
exports.CUDValidator = (0, exports.objectValidator)({
    create: exports.booleanValidatorOptional,
    update: exports.booleanValidatorOptional,
    delete: exports.booleanValidatorOptional,
}, { isOptional: true });
var _UNIT_OF_TIME = {
    Days: '',
    Hours: '',
    Minutes: '',
    Seconds: '',
};
exports.UNITS_OF_TIME = Object.keys(_UNIT_OF_TIME);
exports.UnitOfTimeValidator = (0, exports.exactMatchValidator)(exports.UNITS_OF_TIME);
var WebhookSubscriptionValidatorObject = {};
for (var model in types_models_1.WEBHOOK_MODELS) {
    WebhookSubscriptionValidatorObject[model] = exports.CUDValidator;
}
exports.WebhookSubscriptionValidator = (0, exports.objectValidator)(WebhookSubscriptionValidatorObject, { throwOnUnrecognizedField: true });
exports.sessionTypeValidator = (0, exports.exactMatchValidator)(['user', 'enduser']);
exports.sessionTypeOrAnyoneValidatorOptional = (0, exports.exactMatchValidatorOptional)(['user', 'enduser', 'Anyone']);
exports.listOfDisplayNameInfo = (0, exports.listValidator)((0, exports.objectValidator)({
    fname: exports.nameValidator,
    lname: exports.nameValidator,
    id: exports.listOfMongoIdStringValidator,
}));
exports.attendeeInfoValidator = (0, exports.objectValidator)({
    AttendeeId: exports.stringValidator,
    ExternalUserId: exports.mongoIdStringRequired,
    JoinToken: exports.stringValidator,
});
exports.attendeeValidator = (0, exports.objectValidator)({
    type: exports.sessionTypeValidator,
    id: exports.mongoIdStringRequired,
    info: exports.attendeeInfoValidator,
});
exports.listOfAttendeesValidator = (0, exports.listValidator)(exports.attendeeValidator);
exports.meetingInfoValidator = (0, exports.objectValidator)({
    Meeting: exports.objectAnyFieldsAnyValuesValidator,
});
exports.userIdentityValidator = (0, exports.objectValidator)({
    type: exports.sessionTypeValidator,
    id: exports.mongoIdStringRequired,
});
exports.listOfUserIndentitiesValidator = (0, exports.listValidator)(exports.userIdentityValidator);
exports.calendarEventAttendeeValidator = (0, exports.objectValidator)({
    type: exports.sessionTypeValidator,
    id: exports.mongoIdStringRequired,
    joinLinkToken: exports.stringValidatorOptionalEmptyOkay,
});
exports.calendarEventAttendeesValidator = (0, exports.listValidator)(exports.calendarEventAttendeeValidator);
exports.chatAttachmentValidator = (0, exports.objectValidator)({
    type: exports.stringValidator100,
    name: exports.stringValidatorOptional,
    secureName: exports.stringValidator250,
});
exports.listOfChatAttachmentsValidator = (0, exports.listValidatorEmptyOk)(exports.chatAttachmentValidator);
exports.genericAttachmentValidator = (0, exports.objectValidator)({
    displayName: exports.stringValidator1000,
    fileId: exports.mongoIdStringRequired,
    type: exports.stringValidatorOptional,
    secureName: exports.stringValidator250,
});
exports.listOfGenericAttachmentsValidator = (0, exports.listValidatorEmptyOk)(exports.genericAttachmentValidator);
exports.meetingsListValidator = (0, exports.listValidator)((0, exports.objectValidator)({
    id: exports.mongoIdStringRequired,
    updatedAt: exports.stringValidator,
    status: exports.meetingStatusValidator,
}));
exports.userDisplayInfoValidator = (0, exports.objectValidator)({
    id: exports.mongoIdStringRequired,
    createdAt: exports.dateValidator,
    avatar: exports.stringValidator,
    fname: exports.nameValidator,
    lname: exports.nameValidator,
    lastActive: exports.dateValidator,
    lastLogout: exports.dateValidator,
    email: exports.emailValidator,
});
exports.meetingDisplayInfoValidator = (0, exports.indexableValidator)(exports.mongoIdStringRequired, exports.userDisplayInfoValidator);
exports.chatRoomUserInfoValidator = (0, exports.objectAnyFieldsValidator)((0, exports.objectValidator)({
    unreadCount: exports.nonNegNumberValidator,
    markedUnread: exports.booleanValidatorOptional,
}));
var _LIST_QUERY_QUALIFIERS = {
    "One Of": '',
    "All Of": "",
};
exports.LIST_QUERY_QUALIFIERS = Object.keys(_LIST_QUERY_QUALIFIERS);
exports.listQueryQualifiersValidator = (0, exports.exactMatchValidator)(exports.LIST_QUERY_QUALIFIERS);
exports.listOfStringsWithQualifierValidator = (0, exports.objectValidator)({
    qualifier: exports.listQueryQualifiersValidator,
    values: exports.listOfStringsValidator,
});
exports.listOfStringsWithQualifierValidatorOptional = (0, exports.objectValidator)({
    qualifier: exports.listQueryQualifiersValidator,
    values: exports.listOfStringsValidator,
}, { isOptional: true });
exports.listOfStringsWithQualifierValidatorOptionalValuesEmptyOkay = (0, exports.objectValidator)({
    qualifier: exports.listQueryQualifiersValidator,
    values: exports.listOfStringsValidatorEmptyOk,
}, { isOptional: true });
var _AUTOMATION_ENDUSER_STATUS = {
    active: '',
    finished: '',
    cancelled: '',
    error: '',
};
exports.AUTOMATION_ENDUSER_STATUS = Object.keys(_AUTOMATION_ENDUSER_STATUS);
exports.automatedActionStatusValidator = (0, exports.exactMatchValidator)(exports.AUTOMATION_ENDUSER_STATUS);
var _AUTOMATION_EVENTS = {
    formResponse: '',
    formResponses: '',
    afterAction: '',
    onJourneyStart: '',
    formUnsubmitted: '',
    formsUnsubmitted: '',
    ticketCompleted: '',
    waitForTrigger: '',
    onCallOutcome: '',
};
exports.AUTOMATION_EVENTS = Object.keys(_AUTOMATION_EVENTS);
exports.automationEventTypeValidator = (0, exports.exactMatchValidator)(exports.AUTOMATION_EVENTS);
var _AUTOMATION_ACTIONS = {
    createTicket: '',
    createCarePlan: '',
    completeCarePlan: '',
    sendEmail: '',
    sendSMS: '',
    sendChat: '',
    pushFormsToPortal: '',
    sendForm: '',
    sendWebhook: '',
    setEnduserStatus: '',
    setEnduserFields: '',
    shareContent: '',
    notifyTeam: '',
    addEnduserTags: '',
    removeEnduserTags: '',
    addToJourney: '',
    removeFromJourney: '',
    removeFromAllJourneys: '',
    iterableSendEmail: '',
    iterableCustomEvent: '',
    zendeskCreateTicket: '',
    zusSync: '',
    zusPull: '',
    zusSubscribe: '',
    pagerDutyCreateIncident: '',
    smartMeterPlaceOrder: '',
    healthieSync: '',
    healthieAddToCourse: '',
    healthieSendChat: '',
    completeTickets: '',
    changeContactType: '',
    activeCampaignSync: '',
    activeCampaignAddToLists: '',
    switchToRelatedContact: '',
    canvasSync: '',
    canvasCreateNote: '',
    elationSync: '',
    developHealthMedEligibility: '',
    cancelFutureAppointments: '',
    customerIOIdentify: '',
    customerIOTrack: '',
    addAccessTags: '',
    removeAccessTags: '',
    cancelCurrentEvent: '',
    confirmCurrentEvent: '',
    athenaSync: '',
    outboundCall: '',
    assignCareTeam: '',
    removeCareTeam: '',
    callUser: '',
};
exports.AUTOMATION_ACTIONS = Object.keys(_AUTOMATION_ACTIONS);
exports.automationActionTypeValidator = (0, exports.exactMatchValidator)(exports.AUTOMATION_ACTIONS);
var _COMMUNICATIONS_CHANNELS = {
    Email: '',
    SMS: '',
    Chat: '',
};
exports.COMMUNICATIONS_CHANNELS = Object.keys(_COMMUNICATIONS_CHANNELS);
exports.communicationsChannelValidator = (0, exports.exactMatchValidator)(exports.COMMUNICATIONS_CHANNELS);
exports.communicationsChannelValidatorOptional = (0, exports.exactMatchValidatorOptional)(exports.COMMUNICATIONS_CHANNELS);
var _MESSAGE_TEMPLATE_MODES = {
    richtext: '',
    html: '',
};
exports.MESSAGE_TEMPLATE_MODES = Object.keys(_MESSAGE_TEMPLATE_MODES);
exports.messageTemplateModeValidator = (0, exports.exactMatchValidator)(exports.MESSAGE_TEMPLATE_MODES);
var sharedReminderValidators = {
    msBeforeStartTime: exports.numberValidator,
    didRemind: exports.booleanValidatorOptional,
    dontSendIfPassed: exports.booleanValidatorOptional,
    dontSendIfJoined: exports.booleanValidatorOptional,
};
exports.calendarEventReminderValidator = (0, exports.orValidator)({
    webhook: (0, exports.objectValidator)(__assign({ info: (0, exports.objectValidator)({}, { emptyOk: true, isOptional: true }), type: (0, exports.exactMatchValidator)(['webhook']) }, sharedReminderValidators)),
    'add-to-journey': (0, exports.objectValidator)(__assign({ info: (0, exports.objectValidator)({
            journeyId: exports.mongoIdStringRequired,
            firstAttendeeOnly: exports.booleanValidatorOptional,
        }), type: (0, exports.exactMatchValidator)(['add-to-journey']) }, sharedReminderValidators)),
    'Remove From Journey': (0, exports.objectValidator)(__assign({ info: (0, exports.objectValidator)({
            journeyId: exports.mongoIdStringRequired,
        }), type: (0, exports.exactMatchValidator)(['Remove From Journey']) }, sharedReminderValidators)),
    "enduser-notification": (0, exports.objectValidator)(__assign({ info: (0, exports.objectValidator)({
            templateId: exports.mongoIdStringOptional,
            channel: exports.communicationsChannelValidatorOptional,
        }, { emptyOk: true }), type: (0, exports.exactMatchValidator)(['enduser-notification']) }, sharedReminderValidators)),
    "user-notification": (0, exports.objectValidator)(__assign({ info: (0, exports.objectValidator)({
            templateId: exports.mongoIdStringOptional,
            channel: exports.communicationsChannelValidatorOptional,
        }, { emptyOk: true }), type: (0, exports.exactMatchValidator)(['user-notification']) }, sharedReminderValidators)),
    "create-ticket": (0, exports.objectValidator)(__assign({ info: (0, exports.objectValidator)({
            title: exports.stringValidator1000Optional,
        }, { emptyOk: true }), type: (0, exports.exactMatchValidator)(['create-ticket']) }, sharedReminderValidators)),
});
exports.listOfCalendarEventRemindersValidator = (0, exports.listValidatorEmptyOk)(exports.calendarEventReminderValidator);
exports.cancelConditionValidator = (0, exports.orValidator)({
    formResponse: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['formResponse']),
        info: (0, exports.objectValidator)({
            automationStepId: exports.mongoIdStringRequired,
        }, { emptyOk: false }),
    }),
    formResponses: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['formResponses']),
        info: (0, exports.objectValidator)({
            automationStepId: exports.mongoIdStringRequired,
            unsubmittedFormCount: exports.numberValidator,
        }, { emptyOk: false }),
    }),
});
exports.cancelConditionsValidator = (0, exports.listOfObjectsValidator)({
    type: (0, exports.exactMatchValidator)(['formResponse']),
    info: (0, exports.objectValidator)({
        automationStepId: exports.mongoIdStringRequired,
    }, { emptyOk: false }),
});
exports.cancelConditionsValidatorOptional = (0, exports.listValidatorOptionalOrEmptyOk)((0, exports.objectValidator)({
    type: (0, exports.exactMatchValidator)(['formResponse']),
    info: (0, exports.objectValidator)({
        automationStepId: exports.mongoIdStringRequired,
    }, { emptyOk: false }),
}));
var delayValidation = {
    automationStepId: exports.mongoIdStringRequired,
    delayInMS: exports.nonNegNumberValidator,
    delay: exports.nonNegNumberValidator,
    unit: exports.UnitOfTimeValidator,
    cancelConditions: exports.cancelConditionsValidatorOptional,
    officeHoursOnly: exports.booleanValidatorOptional,
    useEnduserTimezone: exports.booleanValidatorOptional,
    abTestCondition: exports.stringValidatorOptionalEmptyOkay,
};
exports.automationEventValidator = (0, exports.orValidator)({
    formResponse: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['formResponse']),
        info: (0, exports.objectValidator)({
            automationStepId: exports.mongoIdStringRequired,
        }, { emptyOk: false }),
    }),
    formResponses: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['formResponses']),
        info: (0, exports.objectValidator)({
            automationStepId: exports.mongoIdStringRequired,
        }, { emptyOk: false }),
    }),
    afterAction: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['afterAction']),
        info: (0, exports.objectValidator)(__assign(__assign({}, delayValidation), { formCondition: (0, exports.objectValidator)({
                formId: exports.mongoIdStringRequired,
                formFieldId: exports.mongoIdStringRequired,
                before: exports.booleanValidatorOptional,
            }, { isOptional: true, emptyOk: true, }), fieldCondition: (0, exports.objectValidator)({
                field: exports.stringValidator,
                before: exports.booleanValidatorOptional,
            }, { isOptional: true, emptyOk: true, }), eventCondition: (0, exports.objectValidator)({
                before: exports.booleanValidatorOptional,
            }, { isOptional: true, emptyOk: true }), skipIfDelayPassed: exports.booleanValidatorOptional }), { emptyOk: false }),
    }),
    formUnsubmitted: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['formUnsubmitted']),
        info: (0, exports.objectValidator)(__assign(__assign({}, delayValidation), { automationStepId: exports.mongoIdStringRequired }), { emptyOk: false }),
    }),
    formsUnsubmitted: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['formsUnsubmitted']),
        info: (0, exports.objectValidator)(__assign(__assign({}, delayValidation), { automationStepId: exports.mongoIdStringRequired }), { emptyOk: false }),
    }),
    onJourneyStart: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['onJourneyStart']),
        info: (0, exports.objectValidator)({}, { emptyOk: true }),
    }),
    ticketCompleted: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['ticketCompleted']),
        info: (0, exports.objectValidator)({
            automationStepId: exports.mongoIdStringRequired,
            closedForReason: exports.stringValidatorOptional,
        }, { emptyOk: false }),
    }),
    waitForTrigger: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['waitForTrigger']),
        info: (0, exports.objectValidator)({
            automationStepId: exports.mongoIdStringRequired,
            triggerId: exports.mongoIdStringRequired,
        }, { emptyOk: false }),
    }),
    onCallOutcome: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['onCallOutcome']),
        info: (0, exports.objectValidator)({
            automationStepId: exports.mongoIdStringRequired,
            outcome: exports.stringValidator,
        }, { emptyOk: false }),
    }),
});
exports.automationEventsValidator = (0, exports.listValidatorEmptyOk)(exports.automationEventValidator);
exports.automationConditionValidator = (0, exports.orValidator)({
    atJourneyState: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['atJourneyState']),
        info: (0, exports.objectValidator)({ state: exports.stringValidator100, journeyId: exports.mongoIdStringRequired }, { emptyOk: false }),
    }),
});
exports.listOfAutomationConditionsValidator = (0, exports.listValidatorEmptyOk)(exports.automationConditionValidator);
exports.ticketReminderValidator = (0, exports.objectValidator)({
    msBeforeDueDate: exports.numberValidator,
    didRemind: exports.booleanValidatorOptional,
    queueId: exports.mongoIdStringOptional,
});
exports.ticketActionValidator = (0, exports.orValidator)({
    "Complete Form": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Complete Form']),
        info: (0, exports.objectValidator)({
            formId: exports.mongoIdStringRequired,
            formResponseId: exports.mongoIdStringOptional,
            bulkForEvent: exports.booleanValidatorOptional, // for bulk SMS to all event attendees
        }, { emptyOk: false }),
        completedAt: exports.dateOptionalOrEmptyStringValidator,
        optional: exports.booleanValidatorOptional,
    }),
    "Create Prescription": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Create Prescription']),
        info: (0, exports.objectValidator)({}, { emptyOk: true, isOptional: true }),
        completedAt: exports.dateOptionalOrEmptyStringValidator,
        optional: exports.booleanValidatorOptional,
    }),
    "Send SMS": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Send SMS']),
        info: (0, exports.objectValidator)({
            templateId: exports.mongoIdStringRequired,
            smsId: exports.mongoIdStringOptional,
            bulkForEvent: exports.booleanValidatorOptional, // for bulk SMS to all event attendees
        }, { emptyOk: false }),
        completedAt: exports.dateOptionalOrEmptyStringValidator,
        optional: exports.booleanValidatorOptional,
    }),
    "Send Email": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Send Email']),
        info: (0, exports.objectValidator)({
            templateId: exports.mongoIdStringRequired,
            emailId: exports.mongoIdStringOptional,
        }, { emptyOk: false }),
        completedAt: exports.dateOptionalOrEmptyStringValidator,
        optional: exports.booleanValidatorOptional,
    }),
    "Send Chat": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Send Chat']),
        info: (0, exports.objectValidator)({
            templateId: exports.mongoIdStringRequired,
            chatId: exports.mongoIdStringOptional,
            chatRoomId: exports.mongoIdStringOptional,
        }, { emptyOk: false }),
        completedAt: exports.dateOptionalOrEmptyStringValidator,
        optional: exports.booleanValidatorOptional,
    }),
});
exports.ticketActionsValidator = (0, exports.listValidatorOptionalOrEmptyOk)(exports.ticketActionValidator);
exports.senderAssignmentStrategyValidatorOptional = (0, exports.orValidator)({
    'Care Team Primary': (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Care Team Primary']),
        info: (0, exports.objectValidator)({}, { emptyOk: true }),
    }),
    'Default': (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Default']),
        info: (0, exports.objectValidator)({}, { emptyOk: true }),
    }),
}, { isOptional: true });
exports.smartMeterLinesValidator = (0, exports.listValidator)((0, exports.objectValidator)({
    quantity: exports.nonNegNumberValidator,
    sku: exports.stringValidator,
}));
exports.automationForMessageValidator = (0, exports.objectValidator)({
    senderId: exports.mongoIdStringRequired,
    templateId: exports.mongoIdStringRequired,
    assignment: exports.senderAssignmentStrategyValidatorOptional,
    sendToDestinationOfRelatedContactTypes: exports.listOfStringsValidatorOptionalOrEmptyOk,
    hiddenFromTimeline: exports.booleanValidatorOptional,
}, { emptyOk: false });
exports.developHealthDrugsValidator = (0, exports.listValidator)((0, exports.objectValidator)({
    name: exports.stringValidator,
    dosage: exports.stringValidator,
    quantity: exports.numberValidator,
}));
exports.developHealthDiagnosesValidator = (0, exports.listValidatorEmptyOk)((0, exports.objectValidator)({
    code: exports.stringValidator,
}));
exports.developHealthMockResultValidator = (0, exports.objectValidator)({
    status: exports.stringValidator,
    case: exports.stringValidator,
}, { emptyOk: true, isOptional: true });
exports.canvasCodingValidator = (0, exports.objectValidator)({
    code: exports.stringValidator,
    display: exports.stringValidator,
    system: exports.stringValidator,
}, {});
exports.canvasCodingValidatorOptional = (0, exports.objectValidator)({
    code: exports.stringValidatorOptional,
    display: exports.stringValidatorOptional,
    system: exports.stringValidatorOptional,
}, {});
exports.automationActionValidator = (0, exports.orValidator)({
    developHealthMedEligibility: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['developHealthMedEligibility']),
        info: (0, exports.objectValidator)({
            drugs: exports.developHealthDrugsValidator,
            diagnoses: exports.developHealthDiagnosesValidator,
            mock_result: exports.developHealthMockResultValidator,
            providerUserId: exports.mongoIdStringRequired,
        }, { emptyOk: false }),
        continueOnError: exports.booleanValidatorOptional,
    }),
    setEnduserStatus: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['setEnduserStatus']),
        info: (0, exports.objectValidator)({ status: exports.stringValidator250 }, { emptyOk: false }),
        continueOnError: exports.booleanValidatorOptional,
    }),
    sendEmail: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['sendEmail']),
        info: (0, exports.objectValidator)({
            senderId: exports.mongoIdStringRequired,
            templateId: exports.mongoIdStringRequired,
            assignment: exports.senderAssignmentStrategyValidatorOptional,
            fromEmailOverride: exports.emailValidatorOptional,
            sendToDestinationOfRelatedContactTypes: exports.listOfStringsValidatorOptionalOrEmptyOk,
            ccRelatedContactTypes: exports.listOfStringsValidatorOptionalOrEmptyOk,
            hiddenFromTimeline: exports.booleanValidatorOptional,
        }, { emptyOk: false }),
        continueOnError: exports.booleanValidatorOptional,
    }),
    sendSMS: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['sendSMS']),
        info: exports.automationForMessageValidator,
        continueOnError: exports.booleanValidatorOptional,
    }),
    notifyTeam: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['notifyTeam']),
        info: (0, exports.objectValidator)({
            templateId: exports.mongoIdStringRequired,
            forAssigned: exports.booleanValidatorOptional,
            roles: exports.listOfStringsValidatorOptionalOrEmptyOk,
            tags: exports.listOfStringsWithQualifierValidatorOptionalValuesEmptyOkay,
        }, { emptyOk: false }),
        continueOnError: exports.booleanValidatorOptional,
    }),
    sendForm: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['sendForm']),
        info: (0, exports.objectValidator)({
            senderId: exports.mongoIdStringRequired,
            formId: exports.mongoIdStringRequired,
            channel: exports.communicationsChannelValidatorOptional,
            assignment: exports.senderAssignmentStrategyValidatorOptional,
        }, { emptyOk: false }),
        continueOnError: exports.booleanValidatorOptional,
    }),
    shareContent: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['shareContent']),
        info: (0, exports.objectValidator)({
            managedContentRecordIds: exports.listOfMongoIdStringValidator,
        }, { emptyOk: false }),
        continueOnError: exports.booleanValidatorOptional,
    }),
    createTicket: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['createTicket']),
        info: (0, exports.objectValidator)({
            title: exports.stringValidator1000,
            description: exports.stringValidatorOptionalEmptyOkay,
            assignmentStrategy: (0, exports.orValidator)({
                'care-team-random': (0, exports.objectValidator)({
                    type: (0, exports.exactMatchValidator)(['care-team-random']),
                    info: (0, exports.objectValidator)({}, { emptyOk: true }),
                }),
                'care-team-primary': (0, exports.objectValidator)({
                    type: (0, exports.exactMatchValidator)(['care-team-primary']),
                    info: (0, exports.objectValidator)({}, { emptyOk: true }),
                }),
                'previous-owner': (0, exports.objectValidator)({
                    type: (0, exports.exactMatchValidator)(['previous-owner']),
                    info: (0, exports.objectValidator)({}, { emptyOk: true }),
                }),
                'by-tags': (0, exports.objectValidator)({
                    type: (0, exports.exactMatchValidator)(['by-tags']),
                    info: exports.listOfStringsWithQualifierValidator,
                }),
                'queue': (0, exports.objectValidator)({
                    type: (0, exports.exactMatchValidator)(['queue']),
                    info: (0, exports.objectValidator)({
                        queueId: exports.mongoIdStringRequired,
                        tags: exports.listOfStringsWithQualifierValidatorOptional,
                    }),
                }),
                'Recently-Booked Appointment Host': (0, exports.objectValidator)({
                    type: (0, exports.exactMatchValidator)(['Recently-Booked Appointment Host']),
                    info: (0, exports.objectValidator)({}, { emptyOk: true }),
                }),
                'Form Submitter for Journey Trigger': (0, exports.objectValidator)({
                    type: (0, exports.exactMatchValidator)(['Form Submitter for Journey Trigger']),
                    info: (0, exports.objectValidator)({}, { emptyOk: true }),
                }),
                'default': (0, exports.objectValidator)({
                    type: (0, exports.exactMatchValidator)(['default']),
                    info: (0, exports.objectValidator)({}, { emptyOk: true }),
                }),
            }),
            closeReasons: exports.listOfStringsValidatorOptionalOrEmptyOk,
            restrictByState: exports.booleanValidatorOptional,
            restrictByCareTeam: exports.booleanValidatorOptional,
            defaultAssignee: exports.mongoIdStringRequired,
            forCarePlan: exports.booleanValidatorOptional,
            hiddenFromTickets: exports.booleanValidatorOptional,
            htmlDescription: exports.stringValidator100000OptionalEmptyOkay,
            actions: exports.ticketActionsValidator,
            dueDateOffsetInMS: exports.numberValidatorOptional,
            skipDaysOfWeekForDueDate: exports.listOfNumbersValidatorUniqueOptionalOrEmptyOkay,
            closeOnFinishedActions: exports.booleanValidatorOptional,
            requireConfirmation: exports.booleanValidatorOptional,
            reminders: (0, exports.listValidatorOptionalOrEmptyOk)(exports.ticketReminderValidator),
            priority: exports.numberValidatorOptional,
            preserveContext: exports.booleanValidatorOptional,
            tags: exports.listOfStringsValidatorUniqueOptionalOrEmptyOkay,
            contextFormIds: exports.listOfMongoIdStringValidatorOptionalOrEmptyOk,
            contextEnduserFields: exports.listOfStringsValidatorUniqueOptionalOrEmptyOkay,
            contextContentIds: exports.listOfMongoIdStringValidatorOptionalOrEmptyOk,
            disableEditTitle: exports.booleanValidatorOptional,
        }, { emptyOk: false }),
    }),
    sendWebhook: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['sendWebhook']),
        info: (0, exports.objectValidator)({
            message: exports.stringValidator5000Optional,
            url: exports.stringValidator20000ptional,
            fields: exports.labeledFieldsValidator,
            secret: exports.stringValidatorOptional,
            method: exports.stringValidatorOptional,
            headers: exports.labeledFieldsValidator,
        }, { emptyOk: false }),
    }),
    setEnduserFields: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['setEnduserFields']),
        info: (0, exports.objectValidator)({
            fields: (0, exports.listValidator)((0, exports.objectValidator)({
                name: exports.stringValidator,
                type: exports.stringValidator,
                value: exports.stringValidator,
                increment: exports.numberValidatorOptional,
            }))
        }, { emptyOk: false }),
    }),
    addEnduserTags: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['addEnduserTags']),
        info: (0, exports.objectValidator)({
            tags: exports.listOfStringsValidator,
            replaceExisting: exports.booleanValidatorOptional,
        }, { emptyOk: false }),
    }),
    removeEnduserTags: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['removeEnduserTags']),
        info: (0, exports.objectValidator)({
            tags: exports.listOfStringsValidator,
        }, { emptyOk: false }),
    }),
    addAccessTags: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['addAccessTags']),
        info: (0, exports.objectValidator)({
            tags: exports.listOfStringsValidator,
            replaceExisting: exports.booleanValidatorOptional,
        }, { emptyOk: false }),
    }),
    removeAccessTags: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['removeAccessTags']),
        info: (0, exports.objectValidator)({
            tags: exports.listOfStringsValidator,
        }, { emptyOk: false }),
    }),
    addToJourney: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['addToJourney']),
        info: (0, exports.objectValidator)({
            journeyId: exports.mongoIdStringRequired,
        }, { emptyOk: false }),
    }),
    removeFromJourney: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['removeFromJourney']),
        info: (0, exports.objectValidator)({
            journeyId: exports.mongoIdStringRequired,
        }, { emptyOk: false }),
    }),
    removeFromAllJourneys: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['removeFromAllJourneys']),
        info: (0, exports.objectValidator)({}, { emptyOk: true, isOptional: true }),
    }),
    iterableSendEmail: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['iterableSendEmail']),
        info: (0, exports.objectValidator)({
            campaignId: exports.stringValidator,
        }, { emptyOk: false }),
    }),
    iterableCustomEvent: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['iterableCustomEvent']),
        info: (0, exports.objectValidator)({
            eventName: exports.stringValidator,
            description: exports.stringValidator,
            dataFieldsMapping: (0, exports.listValidatorOptionalOrEmptyOk)((0, exports.objectValidator)({
                iterable: exports.stringValidator,
                tellescope: exports.stringValidator,
            })),
            environment: exports.stringValidatorOptional,
            customEmailField: exports.stringValidatorOptional,
        }, { emptyOk: false }),
    }),
    zendeskCreateTicket: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['zendeskCreateTicket']),
        info: (0, exports.objectValidator)({
            templateId: exports.mongoIdStringRequired,
            defaultSenderId: exports.mongoIdStringRequired,
        }, { emptyOk: false }),
    }),
    createCarePlan: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['createCarePlan']),
        info: (0, exports.objectValidator)({
            title: exports.stringValidator1000,
            htmlDescription: exports.stringValidator100000EmptyOkay,
            hideRemainingTicketsProgress: exports.booleanValidatorOptional,
            highlightedEnduserFields: exports.listOfStringsValidatorOptionalOrEmptyOk,
            closeAutomaticallyByTicket: exports.booleanValidatorOptional,
        }, { emptyOk: false }),
    }),
    completeCarePlan: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['completeCarePlan']),
        info: (0, exports.objectValidator)({}, { emptyOk: true }),
    }),
    zusSync: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['zusSync']),
        info: (0, exports.objectValidator)({}, { emptyOk: true }),
    }),
    zusPull: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['zusPull']),
        info: (0, exports.objectValidator)({}, { emptyOk: true }),
    }),
    zusSubscribe: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['zusSubscribe']),
        info: (0, exports.objectValidator)({
            practitionerId: exports.stringValidator,
            packageIds: exports.listOfStringsValidator,
        }),
    }),
    pagerDutyCreateIncident: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['pagerDutyCreateIncident']),
        info: (0, exports.objectValidator)({
            title: exports.stringValidator,
            type: exports.stringValidator,
            serviceId: exports.stringValidator,
        }),
    }),
    smartMeterPlaceOrder: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['smartMeterPlaceOrder']),
        info: (0, exports.objectValidator)({
            lines: exports.smartMeterLinesValidator,
            shipping: exports.stringValidator100,
        }),
    }),
    sendChat: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['sendChat']),
        info: (0, exports.objectValidator)({
            templateId: exports.mongoIdStringRequired,
            identifier: exports.stringValidator100,
            includeCareTeam: exports.booleanValidatorOptional,
            userIds: exports.listOfMongoIdStringValidatorOptionalOrEmptyOk,
            sendToDestinationOfRelatedContactTypes: exports.listOfStringsValidatorOptionalOrEmptyOk,
        }),
    }),
    healthieSync: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['healthieSync']),
        info: (0, exports.objectValidator)({}, { emptyOk: true }),
    }),
    elationSync: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['elationSync']),
        info: (0, exports.objectValidator)({}, { emptyOk: true }),
    }),
    athenaSync: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['athenaSync']),
        info: (0, exports.objectValidator)({ departmentid: exports.stringValidator100 }, { emptyOk: true }),
    }),
    canvasSync: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['canvasSync']),
        info: (0, exports.objectValidator)({}, { emptyOk: true }),
    }),
    canvasCreateNote: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['canvasCreateNote']),
        info: (0, exports.objectValidator)({
            formIds: exports.listOfMongoIdStringValidator,
            matchCareTeamTagsForCanvasPractitionerResolution: exports.listOfStringsWithQualifierValidator,
            noteCoding: exports.canvasCodingValidator,
        }),
    }),
    healthieAddToCourse: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['healthieAddToCourse']),
        info: (0, exports.objectValidator)({ courseId: exports.stringValidator100 }),
    }),
    healthieSendChat: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['healthieSendChat']),
        info: (0, exports.objectValidator)({
            templateId: exports.mongoIdStringRequired,
            identifier: exports.stringValidator100,
            includeCareTeam: exports.booleanValidatorOptional,
        }),
    }),
    completeTickets: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['completeTickets']),
        info: (0, exports.objectValidator)({
            journeyIds: exports.listOfMongoIdStringValidatorOptionalOrEmptyOk,
        }),
    }),
    changeContactType: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['changeContactType']),
        info: (0, exports.objectValidator)({
            type: exports.stringValidatorOptional, // can be empty string for default contact type or id for others
        }),
    }),
    activeCampaignSync: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['activeCampaignSync']),
        info: (0, exports.objectValidator)({}, { emptyOk: true }),
    }),
    activeCampaignAddToLists: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['activeCampaignAddToLists']),
        info: (0, exports.objectValidator)({
            listIds: exports.listOfStringsValidator,
        }),
    }),
    switchToRelatedContact: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['switchToRelatedContact']),
        info: (0, exports.objectValidator)({
            type: exports.stringValidator100,
            otherTypes: exports.listOfStringsValidatorUniqueOptionalOrEmptyOkay,
        }, {}),
    }),
    pushFormsToPortal: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['pushFormsToPortal']),
        info: (0, exports.objectValidator)({
            formIds: exports.listOfMongoIdStringValidator,
        }, { emptyOk: false }),
    }),
    cancelFutureAppointments: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['cancelFutureAppointments']),
        info: (0, exports.objectValidator)({}, { emptyOk: true }),
    }),
    customerIOIdentify: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['customerIOIdentify']),
        info: (0, exports.objectValidator)({}, { emptyOk: true }),
    }),
    customerIOTrack: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['customerIOTrack']),
        info: (0, exports.objectValidator)({
            event: exports.stringValidator,
            trackProperties: exports.listOfStringsValidatorOptionalOrEmptyOk,
        }, { emptyOk: false }),
    }),
    cancelCurrentEvent: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['cancelCurrentEvent']),
        info: (0, exports.objectValidator)({}, { emptyOk: true, isOptional: true }),
    }),
    confirmCurrentEvent: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['confirmCurrentEvent']),
        info: (0, exports.objectValidator)({}, { emptyOk: true, isOptional: true }),
    }),
    outboundCall: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['outboundCall']),
        info: (0, exports.objectValidator)({
            treeId: exports.mongoIdStringRequired,
        }, { emptyOk: false }),
    }),
    assignCareTeam: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['assignCareTeam']),
        info: (0, exports.objectValidator)({
            tags: exports.listOfStringsWithQualifierValidator,
            limitToOneUser: exports.booleanValidatorOptional,
            setAsPrimary: exports.booleanValidatorOptional,
        }, { emptyOk: false }) // at least tags is required
    }),
    removeCareTeam: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['removeCareTeam']),
        info: (0, exports.objectValidator)({
            tags: exports.listOfStringsWithQualifierValidator,
        }, { emptyOk: false }) // at least tags is required
    }),
    callUser: (0, exports.objectValidator)({
        continueOnError: exports.booleanValidatorOptional,
        type: (0, exports.exactMatchValidator)(['callUser']),
        info: (0, exports.objectValidator)({
            message: exports.stringValidator25000,
            routeBy: (0, exports.exactMatchValidator)(['Appointment Host']),
        }, { emptyOk: false }) // at least tags is required
    })
});
exports.journeyContextValidator = (0, exports.objectValidator)({
    calendarEventId: exports.mongoIdStringOptional,
    formResponseId: exports.mongoIdStringOptional,
    purchaseId: exports.mongoIdStringOptional,
    templateId: exports.mongoIdStringOptional,
    orderId: exports.mongoIdStringOptional,
    observationId: exports.mongoIdStringOptional,
    phoneCallId: exports.mongoIdStringOptional,
    smsId: exports.mongoIdStringOptional,
    chatId: exports.mongoIdStringOptional,
    emailId: exports.mongoIdStringOptional,
    formGroupId: exports.mongoIdStringOptional,
    publicIdentifier: exports.stringValidatorOptional,
    databaseRecordId: exports.mongoIdStringOptional,
    databaseRecordCreator: exports.mongoIdStringOptional,
    eligibilityResultId: exports.mongoIdStringOptional,
    fileId: exports.mongoIdStringOptional,
    chatRoomId: exports.mongoIdStringOptional,
});
exports.relatedRecordValidator = (0, exports.objectValidator)({
    type: exports.stringValidator100,
    id: exports.stringValidator100,
    creator: exports.mongoIdStringOptional,
    environment: exports.stringValidatorOptional,
});
exports.listOfRelatedRecordsValidator = (0, exports.listValidatorEmptyOk)(exports.relatedRecordValidator);
exports.relatedRecordsValidatorOptional = (0, exports.listValidatorOptionalOrEmptyOk)(exports.relatedRecordValidator);
exports.searchOptionsValidator = (0, exports.objectValidator)({
    query: exports.stringValidator100,
});
exports.notificationPreferenceValidator = (0, exports.objectValidator)({
    email: exports.booleanValidatorOptional,
});
exports.notificationPreferencesValidator = (0, exports.objectAnyFieldsValidator)(exports.notificationPreferenceValidator);
exports.FHIRObservationCategoryValidator = (0, exports.exactMatchValidator)(['vital-signs']);
var _FHIR_OBSERVATION_STATUS_CODES = {
    "entered-in-error": '',
    amended: '',
    cancelled: '',
    corrected: '',
    final: '',
    preliminary: '',
    registered: '',
    unknown: '',
};
exports.FHIR_OBSERVATION_STATUS_CODES = Object.keys(_FHIR_OBSERVATION_STATUS_CODES);
exports.FHIRObservationStatusCodeValidator = (0, exports.exactMatchValidator)(exports.FHIR_OBSERVATION_STATUS_CODES);
exports.FHIRObservationValueValidator = (0, exports.objectValidator)({
    unit: exports.stringValidator,
    value: exports.numberValidator,
});
exports.previousFormFieldValidator = (0, exports.orValidator)({
    root: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['root']),
        info: (0, exports.objectValidator)({}, { emptyOk: true }),
    }),
    "after": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['after']),
        info: (0, exports.objectValidator)({ fieldId: exports.mongoIdStringRequired }, { emptyOk: false }),
    }),
    "previousEquals": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['previousEquals']),
        info: (0, exports.objectValidator)({
            fieldId: exports.mongoIdStringRequired,
            equals: exports.stringValidator250,
        }, { emptyOk: false }),
    }),
    "compoundLogic": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['compoundLogic']),
        info: (0, exports.objectValidator)({
            fieldId: exports.mongoIdStringRequired,
            priority: exports.numberValidator,
            label: exports.stringValidatorOptionalEmptyOkay,
            condition: exports.objectAnyFieldsAnyValuesValidator,
        }, { emptyOk: false }),
    }),
});
exports.previousFormFieldsValidator = (0, exports.listValidatorEmptyOk)(exports.previousFormFieldValidator);
exports.portalSettingsValidator = (0, exports.objectValidator)({
    authentication: (0, exports.objectValidator)({
        landingTitle: exports.stringValidator1000Optional,
        landingGraphic: exports.stringValidator1000Optional,
        landingLogo: exports.stringValidator1000Optional,
        loginDescription: exports.stringValidator1000Optional,
        loginGraphic: exports.stringValidator1000Optional,
        loginTitle: exports.stringValidator1000Optional,
        registerDescription: exports.stringValidator1000Optional,
        registerGraphic: exports.stringValidator1000Optional,
        registerTitle: exports.stringValidator1000Optional,
        hideRegister: exports.booleanValidatorOptional,
        dontPromptSetPassword: exports.booleanValidatorOptional,
        requireOTP: exports.booleanValidatorOptional,
    }, { isOptional: true, emptyOk: true, }),
    communication: (0, exports.objectValidator)({
        allowEnduserInitiatedChat: exports.booleanValidatorOptional,
        allowChatCareTeamSelection: exports.booleanValidatorOptional,
        sendEmailNotificationsToEnduser: exports.booleanValidatorOptional,
        sendSMSNotificationsToEnduser: exports.booleanValidatorOptional,
        enduserInitiatedChatDefaultSubject: exports.stringValidator5000OptionalEmptyOkay,
    }, { isOptional: true, emptyOk: true }),
    orders: (0, exports.objectValidator)({
        customOrderTrackingURL: exports.stringValidatorOptionalEmptyOkay,
    }, { isOptional: true, emptyOk: true }),
    documents: (0, exports.objectValidator)({
        hideMissingAnswers: exports.booleanValidatorOptional,
        availableFormsTitle: exports.stringValidatorOptionalEmptyOkay,
        outstandingFormsTitle: exports.stringValidatorOptionalEmptyOkay,
    }, { isOptional: true, emptyOk: true }),
});
exports.customPoliciesValidator = (0, exports.listValidatorOptionalOrEmptyOk)((0, exports.objectValidator)({
    title: exports.stringValidator1000,
    url: exports.stringValidator1000,
}));
exports.organizationThemeValidator = (0, exports.objectValidator)({
    logoURL: exports.stringValidatorOptional,
    themeColor: exports.stringValidatorOptional,
    themeColorSecondary: exports.stringValidatorOptional,
    name: exports.stringValidator250,
    subdomain: exports.stringValidator250,
    businessId: exports.mongoIdStringRequired,
    faviconURL: exports.stringValidator250,
    customPortalURL: exports.stringValidator250,
    portalSettings: exports.portalSettingsValidator,
    organizationIds: exports.listOfStringsValidatorOptionalOrEmptyOk,
    customPrivacyPolicy: exports.stringValidatorOptional,
    customTermsOfService: exports.stringValidatorOptional,
    customPoliciesVersion: exports.stringValidatorOptional,
    requireCustomTermsOnMagicLink: exports.booleanValidatorOptional,
    customPolicies: exports.customPoliciesValidator,
    hasConnectedVital: exports.booleanValidatorOptional,
    brandId: exports.mongoIdStringOptional,
});
var _MANAGED_CONTENT_RECORD_TYPES = {
    Article: '',
    PDF: '',
    Video: '',
};
exports.MANAGED_CONTENT_RECORD_TYPES = Object.keys(_MANAGED_CONTENT_RECORD_TYPES);
exports.managedContentRecordTypeValidator = (0, exports.exactMatchValidator)(exports.MANAGED_CONTENT_RECORD_TYPES);
var _MANAGED_CONTENT_RECORD_ASSIGNMENT_TYPES = {
    'All': '',
    'By Tags': '',
    Manual: '',
    Individual: '',
};
exports.MANAGED_CONTENT_RECORD_ASSIGNMENT_TYPES = Object.keys(_MANAGED_CONTENT_RECORD_ASSIGNMENT_TYPES);
exports.managedContentRecordAssignmentTypeValidator = (0, exports.exactMatchValidator)(exports.MANAGED_CONTENT_RECORD_ASSIGNMENT_TYPES);
exports.passwordValidator = {
    getExample: getExampleString,
    getType: getTypeString,
    validate: (function (o) { return (0, exports.build_validator)(function (password) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (typeof password !== 'string') {
            throw new Error("Password must be a string");
        }
        if (password.length < 8) {
            throw new Error("Password must be at least 8 characters long");
        }
        if (((_b = (_a = password.match(/[a-z]/g)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) < 1 // 1 lowercase
            || (((_d = (_c = password.match(/[A-Z]/g)) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) < 1 // 1 uppercase
                && ((_f = (_e = password.match(/[0-9]/g)) === null || _e === void 0 ? void 0 : _e.length) !== null && _f !== void 0 ? _f : 0) < 1 // 1 number
                && ((_h = (_g = password.match(/[^a-zA-Z0-9]/g)) === null || _g === void 0 ? void 0 : _g.length) !== null && _h !== void 0 ? _h : 0) < 1 // 1 special character
            )) {
            console.error('bad password regex');
            throw new Error('Password must included 1 uppercase letter, 1 number, or 1 symbol');
        }
        return password;
    }, __assign(__assign({}, o), { listOf: false, emptyStringOk: false })); }),
};
exports.flowchartUIValidator = (0, exports.objectValidator)({
    x: exports.numberValidator,
    y: exports.numberValidator,
}, { emptyOk: true });
exports.integrationAuthenticationsValidator = (0, exports.objectValidator)({
    type: (0, exports.exactMatchValidator)(['oauth2', 'apiKey']),
    info: (0, exports.objectValidator)({
        access_token: exports.stringValidator250,
        refresh_token: exports.stringValidator250,
        scope: exports.stringValidator25000EmptyOkay,
        expiry_date: exports.nonNegNumberValidator,
        token_type: (0, exports.exactMatchValidator)(['Bearer']),
        external_id: exports.stringValidatorOptional,
        state: exports.stringValidatorOptional,
        email: exports.emailValidatorOptional,
    }),
});
var _TABLE_INPUT_TYPES = {
    Date: '',
    Text: '',
    Select: '',
    Database: '',
};
exports.TABLE_INPUT_TYPES = Object.keys(_TABLE_INPUT_TYPES);
exports.tableInputTypesValidator = (0, exports.exactMatchValidator)(exports.TABLE_INPUT_TYPES);
exports.tableInputChoiceValidator = (0, exports.orValidator)({
    Text: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Text']),
        label: exports.stringValidator1000,
        info: exports.optionalEmptyObjectValidator,
    }),
    Date: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Date']),
        label: exports.stringValidator1000,
        info: exports.optionalEmptyObjectValidator,
    }),
    Select: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Select']),
        label: exports.stringValidator1000,
        info: (0, exports.objectValidator)({
            choices: exports.listOfStringsValidator,
        }),
    }),
    Database: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Database']),
        label: exports.stringValidator1000,
        info: (0, exports.objectValidator)({
            databaseId: exports.mongoIdStringRequired,
            databaseLabel: exports.stringValidator1000,
        }),
    }),
});
exports.formFieldFeedbackValidator = (0, exports.objectValidator)({
    ifEquals: exports.stringValidator,
    display: exports.stringValidator,
});
exports.formFieldOptionsValidator = (0, exports.objectValidator)({
    default: exports.stringValidatorOptional,
    bookingPageId: exports.stringValidatorOptional,
    tableChoices: (0, exports.listValidatorOptionalOrEmptyOk)(exports.tableInputChoiceValidator),
    choices: exports.listOfStringsValidatorOptionalOrEmptyOk,
    radioChoices: exports.listOfStringsValidatorOptionalOrEmptyOk,
    canvasCodings: (0, exports.listValidatorOptionalOrEmptyOk)(exports.canvasCodingValidator),
    from: exports.numberValidatorOptional,
    to: exports.numberValidatorOptional,
    other: exports.booleanValidatorOptional,
    radio: exports.booleanValidatorOptional,
    pdfAttachment: exports.stringValidator5000Optional,
    subFields: (0, exports.listValidatorOptionalOrEmptyOk)((0, exports.objectValidator)({
        id: exports.mongoIdStringRequired,
    })),
    validFileTypes: exports.listOfStringsValidatorOptionalOrEmptyOk,
    productIds: exports.listOfStringsValidatorOptionalOrEmptyOk,
    chargeImmediately: exports.booleanValidatorOptional,
    signatureUrl: exports.stringValidator5000Optional,
    maxLength: exports.numberValidatorOptional,
    minLength: exports.numberValidatorOptional,
    repeat: exports.booleanValidatorOptional,
    databaseId: exports.mongoIdStringOptional,
    databaseLabel: exports.stringValidatorOptionalEmptyOkay,
    databaseLabels: exports.listOfStringsValidatorOptionalOrEmptyOk,
    databaseFilter: (0, exports.objectValidator)({
        databaseLabel: exports.stringValidator1000Optional,
        fieldId: exports.mongoIdStringOptional,
    }, { isOptional: true, emptyOk: true }),
    useDatePicker: exports.booleanValidatorOptional,
    sharedIntakeFields: exports.listOfStringsValidatorOptionalOrEmptyOk,
    hiddenDefaultFields: exports.listOfStringsValidatorOptionalOrEmptyOk,
    copyResponse: exports.booleanValidatorOptional,
    disableGoBack: exports.booleanValidatorOptional,
    disableNext: exports.booleanValidatorOptional,
    canvasConsentCategory: (0, exports.objectValidator)({
        code: exports.stringValidator,
        display: exports.stringValidator,
        system: exports.stringValidator,
    }, { isOptional: true, emptyOk: true }),
    canvasDocumentCoding: (0, exports.objectValidator)({
        code: exports.stringValidator,
        system: exports.stringValidator,
    }, { isOptional: true, emptyOk: true }),
    canvasDocumentType: (0, exports.objectValidator)({
        code: exports.stringValidator,
        system: exports.stringValidator,
        display: exports.stringValidator,
    }, { isOptional: true, emptyOk: true }),
    canvasDocumentComment: exports.stringValidatorOptional,
    canvasReviewMode: exports.stringValidatorOptional,
    customPriceMessage: exports.stringValidatorOptional,
    billingProvider: exports.stringValidatorOptional,
    addressFields: exports.listOfStringsValidatorOptionalOrEmptyOk,
    validStates: exports.listOfStringsValidatorOptionalOrEmptyOk,
    autoAdvance: exports.booleanValidatorOptional,
    autoSubmit: exports.booleanValidatorOptional,
    userTags: exports.listOfStringsValidatorOptionalOrEmptyOk,
    userFilterTags: exports.listOfStringsValidatorOptionalOrEmptyOk,
    prefillSignature: exports.booleanValidatorOptional,
    requirePredefinedInsurer: exports.booleanValidatorOptional,
    includeGroupNumber: exports.booleanValidatorOptional,
    holdAppointmentMinutes: exports.numberValidatorOptional,
    rangeStepSize: exports.numberValidatorOptional,
    redirectFormId: exports.mongoIdStringOptional,
    redirectExternalUrl: exports.stringValidatorOptional,
    customTypeId: exports.mongoIdStringOptional,
    groupPadding: exports.numberValidatorOptional,
    saveIntakeOnPartial: exports.booleanValidatorOptional,
    max: exports.numberValidatorOptional,
    min: exports.numberValidatorOptional,
    stripeKey: exports.stringValidatorOptionalEmptyOkay,
    dataSource: exports.stringValidatorOptionalEmptyOkay,
    esignatureTermsCompanyName: exports.stringValidatorOptionalEmptyOkay,
    observationCode: exports.stringValidatorOptionalEmptyOkay,
    observationDisplay: exports.stringValidatorOptionalEmptyOkay,
    observationUnit: exports.stringValidatorOptionalEmptyOkay,
    autoUploadFiles: exports.booleanValidatorOptional,
    chargebeeEnvironment: exports.stringValidatorOptional,
    chargebeePlanId: exports.stringValidatorOptional,
    chargebeeItemId: exports.stringValidatorOptional,
    relatedContactTypes: exports.listOfStringsValidatorOptionalOrEmptyOk,
    elationHistoryType: exports.stringValidatorOptional,
    elationIsAllergy: exports.booleanValidatorOptional,
    elationAppendToNote: exports.booleanValidatorOptional,
    elationAppendToNotePrefix: exports.stringValidatorOptionalEmptyOkay,
    allowAddToDatabase: exports.booleanValidatorOptional,
});
exports.blockValidator = (0, exports.orValidator)({
    h1: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['h1']),
        info: (0, exports.objectValidator)({
            text: exports.stringValidator5000EmptyOkay,
        }),
    }),
    h2: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['h2']),
        info: (0, exports.objectValidator)({
            text: exports.stringValidator5000EmptyOkay,
        }),
    }),
    html: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['html']),
        info: (0, exports.objectValidator)({
            html: exports.stringValidator25000EmptyOkay,
        }),
    }),
    image: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['image']),
        info: (0, exports.objectValidator)({
            link: exports.stringValidator5000EmptyOkay,
            name: exports.stringValidatorOptional,
            height: exports.numberValidatorOptional,
            maxHeight: exports.numberValidatorOptional,
            width: exports.numberValidatorOptional,
            maxWidth: exports.numberValidatorOptional,
        }),
    }),
    pdf: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['pdf']),
        info: (0, exports.objectValidator)({
            link: exports.stringValidator5000EmptyOkay,
            name: exports.stringValidatorOptional,
            height: exports.numberValidatorOptional,
            maxHeight: exports.numberValidatorOptional,
            width: exports.numberValidatorOptional,
            maxWidth: exports.numberValidatorOptional,
        }),
    }),
    youtube: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['youtube']),
        info: (0, exports.objectValidator)({
            link: exports.stringValidator5000EmptyOkay,
            name: exports.stringValidatorOptional,
            height: exports.numberValidatorOptional,
            maxHeight: exports.numberValidatorOptional,
            width: exports.numberValidatorOptional,
            maxWidth: exports.numberValidatorOptional,
        }),
    }),
    iframe: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['iframe']),
        info: (0, exports.objectValidator)({
            link: exports.stringValidator5000EmptyOkay,
            name: exports.stringValidatorOptional,
            height: exports.numberValidatorOptional,
            maxHeight: exports.numberValidatorOptional,
            width: exports.numberValidatorOptional,
            maxWidth: exports.numberValidatorOptional,
        }),
    }),
    "content-link": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(["content-link"]),
        info: (0, exports.objectValidator)({
            recordId: exports.mongoIdStringRequired,
        }),
    }),
});
var _BLOCK_TYPES = {
    h1: '',
    h2: '',
    html: '',
    image: '',
    pdf: '',
    youtube: '',
    iframe: '',
    "content-link": '',
};
exports.BLOCK_TYPES = Object.keys(_BLOCK_TYPES);
exports.blockTypeValidator = (0, exports.exactMatchValidator)(exports.BLOCK_TYPES);
var is_block_type = function (type) { return exports.BLOCK_TYPES.includes(type); };
exports.is_block_type = is_block_type;
exports.blocksValidator = (0, exports.listValidatorEmptyOk)(exports.blockValidator);
var _DATABASE_RECORD_FIELD_TYPES = {
    Text: '',
    "Text Long": '',
    "Text List": '',
    Number: '',
    Address: '',
    'Multiple Select': '',
    Email: '',
    Phone: '',
    Date: '',
    Dropdown: '',
    Timestamp: '',
};
exports.DATABASE_RECORD_FIELD_TYPES = Object.keys(_DATABASE_RECORD_FIELD_TYPES);
exports.databaseRecordFieldTypeValidator = (0, exports.exactMatchValidator)(exports.DATABASE_RECORD_FIELD_TYPES);
var is_database_record_field_type = function (type) { return exports.DATABASE_RECORD_FIELD_TYPES.includes(type); };
exports.is_database_record_field_type = is_database_record_field_type;
exports.databaseFieldValidator = (0, exports.orValidator)({
    Text: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Text']),
        label: exports.stringValidator250,
        showConditions: exports.optionalAnyObjectValidator,
        hideFromTable: exports.booleanValidatorOptional,
        wrap: exports.stringValidatorOptional,
        required: exports.booleanValidatorOptional,
        options: (0, exports.objectValidator)({
            width: exports.stringValidatorOptionalEmptyOkay,
        }, { isOptional: true, emptyOk: true }),
    }),
    Email: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Email']),
        label: exports.stringValidator250,
        showConditions: exports.optionalAnyObjectValidator,
        hideFromTable: exports.booleanValidatorOptional,
        wrap: exports.stringValidatorOptional,
        required: exports.booleanValidatorOptional,
        options: (0, exports.objectValidator)({
            width: exports.stringValidatorOptionalEmptyOkay,
        }, { isOptional: true, emptyOk: true }),
    }),
    Phone: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Phone']),
        label: exports.stringValidator250,
        showConditions: exports.optionalAnyObjectValidator,
        hideFromTable: exports.booleanValidatorOptional,
        wrap: exports.stringValidatorOptional,
        required: exports.booleanValidatorOptional,
        options: (0, exports.objectValidator)({
            width: exports.stringValidatorOptionalEmptyOkay,
        }, { isOptional: true, emptyOk: true }),
    }),
    'Text Long': (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Text Long']),
        label: exports.stringValidator250,
        showConditions: exports.optionalAnyObjectValidator,
        hideFromTable: exports.booleanValidatorOptional,
        wrap: exports.stringValidatorOptional,
        required: exports.booleanValidatorOptional,
        options: (0, exports.objectValidator)({
            width: exports.stringValidatorOptionalEmptyOkay,
        }, { isOptional: true, emptyOk: true }),
    }),
    'Text List': (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Text List']),
        label: exports.stringValidator250,
        showConditions: exports.optionalAnyObjectValidator,
        hideFromTable: exports.booleanValidatorOptional,
        wrap: exports.stringValidatorOptional,
        required: exports.booleanValidatorOptional,
        options: (0, exports.objectValidator)({
            width: exports.stringValidatorOptionalEmptyOkay,
        }, { isOptional: true, emptyOk: true }),
    }),
    'Number': (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Number']),
        label: exports.stringValidator250,
        showConditions: exports.optionalAnyObjectValidator,
        hideFromTable: exports.booleanValidatorOptional,
        wrap: exports.stringValidatorOptional,
        required: exports.booleanValidatorOptional,
        options: (0, exports.objectValidator)({
            width: exports.stringValidatorOptionalEmptyOkay,
        }, { isOptional: true, emptyOk: true }),
    }),
    'Address': (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Address']),
        label: exports.stringValidator250,
        showConditions: exports.optionalAnyObjectValidator,
        hideFromTable: exports.booleanValidatorOptional,
        wrap: exports.stringValidatorOptional,
        required: exports.booleanValidatorOptional,
        options: (0, exports.objectValidator)({
            width: exports.stringValidatorOptionalEmptyOkay,
        }, { isOptional: true, emptyOk: true }),
    }),
    'Multiple Select': (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Multiple Select']),
        label: exports.stringValidator250,
        showConditions: exports.optionalAnyObjectValidator,
        hideFromTable: exports.booleanValidatorOptional,
        wrap: exports.stringValidatorOptional,
        required: exports.booleanValidatorOptional,
        options: (0, exports.objectValidator)({
            width: exports.stringValidatorOptionalEmptyOkay,
            options: exports.listOfStringsValidatorEmptyOk,
        }, { isOptional: true, emptyOk: true }),
    }),
    'Dropdown': (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Dropdown']),
        label: exports.stringValidator250,
        showConditions: exports.optionalAnyObjectValidator,
        hideFromTable: exports.booleanValidatorOptional,
        wrap: exports.stringValidatorOptional,
        required: exports.booleanValidatorOptional,
        options: (0, exports.objectValidator)({
            width: exports.stringValidatorOptionalEmptyOkay,
            options: exports.listOfStringsValidatorEmptyOk,
        }, { isOptional: true, emptyOk: true }),
    }),
    'Timestamp': (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Timestamp']),
        label: exports.stringValidator250,
        showConditions: exports.optionalAnyObjectValidator,
        hideFromTable: exports.booleanValidatorOptional,
        wrap: exports.stringValidatorOptional,
        required: exports.booleanValidatorOptional,
        options: (0, exports.objectValidator)({
            width: exports.stringValidatorOptionalEmptyOkay,
        }, { isOptional: true, emptyOk: true }),
    }),
    'Date': (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Date']),
        label: exports.stringValidator250,
        showConditions: exports.optionalAnyObjectValidator,
        hideFromTable: exports.booleanValidatorOptional,
        wrap: exports.stringValidatorOptional,
        required: exports.booleanValidatorOptional,
        options: (0, exports.objectValidator)({
            width: exports.stringValidatorOptionalEmptyOkay,
        }, { isOptional: true, emptyOk: true }),
    }),
});
exports.databaseFieldsValidator = (0, exports.listValidator)(exports.databaseFieldValidator);
exports.databaseRecordValueValidator = (0, exports.orValidator)({
    Text: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Text']),
        value: exports.stringValidator5000OptionalEmptyOkay,
        label: exports.stringValidator250,
    }),
    Phone: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Phone']),
        value: exports.phoneValidatorOptional,
        label: exports.stringValidator250,
    }),
    Email: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Email']),
        value: exports.emailValidatorOptional,
        label: exports.stringValidator250,
    }),
    'Text Long': (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Text Long']),
        value: exports.stringValidator5000OptionalEmptyOkay,
        label: exports.stringValidator250,
    }),
    'Text List': (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Text List']),
        value: exports.listOfStringsValidatorOptionalOrEmptyOk,
        label: exports.stringValidator250,
    }),
    'Number': (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Number']),
        value: exports.numberValidatorOptional,
        label: exports.stringValidator250,
    }),
    'Address': (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Address']),
        value: exports.addressOptionalValidator,
        label: exports.stringValidator250,
    }),
    'Multiple Select': (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Multiple Select']),
        value: exports.listOfStringsValidatorOptionalOrEmptyOk,
        label: exports.stringValidator250,
    }),
    'Dropdown': (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Dropdown']),
        value: exports.stringValidatorOptional,
        label: exports.stringValidator250,
    }),
    'Date': (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Date']),
        value: exports.stringValidatorOptional,
        label: exports.stringValidator250,
    }),
    'Timestamp': (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Timestamp']),
        value: exports.stringValidatorOptional,
        label: exports.stringValidator250,
    }),
});
exports.databaseRecordValuesValidator = (0, exports.listValidator)(exports.databaseRecordValueValidator);
exports.organizationAccessValidator = (0, exports.objectValidator)({
    create: exports.booleanValidatorOptional,
    update: exports.booleanValidatorOptional,
    read: exports.booleanValidatorOptional,
    delete: exports.booleanValidatorOptional,
});
var _PORTAL_PAGES = {
    "Care Plan": true,
    "Appointment Booking": true,
    Documents: true,
    Education: true,
    Home: true,
    Community: true,
    Communications: true,
    "My Events": true,
    Orders: true,
    Vitals: true,
};
exports.PORTAL_PAGES = Object.keys(_PORTAL_PAGES);
exports.portalPageValidator = (0, exports.exactMatchValidator)(exports.PORTAL_PAGES);
var _FORM_TYPES = {
    note: true,
    enduserFacing: true,
};
exports.FORM_TYPES = Object.keys(_FORM_TYPES);
exports.formTypeValidator = (0, exports.exactMatchValidator)(exports.FORM_TYPES);
exports.portalBlockValidator = (0, exports.orValidator)({
    carePlan: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['carePlan']),
        info: (0, exports.objectValidator)({}, { emptyOk: true })
    }),
    education: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['education']),
        info: (0, exports.objectValidator)({}, { emptyOk: true })
    }),
    Events: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Events']),
        info: (0, exports.objectValidator)({}, { emptyOk: true })
    }),
    careTeam: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['careTeam']),
        info: (0, exports.objectValidator)({
            title: exports.stringValidator,
            roles: exports.listOfStringsValidatorOptionalOrEmptyOk,
            showAll: exports.booleanValidatorOptional,
            // members: listValidatorEmptyOk(
            //   objectValidator<CareTeamMemberPortalCustomizationInfo>({
            //     title: stringValidator(),
            //     role: stringValidator({ isOptional: true }),
            //   })()
            // )()
        })
    }),
    text: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['text']),
        info: (0, exports.objectValidator)({
            text: exports.stringValidator5000,
        })
    }),
    chat: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['chat']),
        info: (0, exports.objectValidator)({}, { emptyOk: true })
    }),
    "Manage Subscription Button": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Manage Subscription Button']),
        info: (0, exports.objectValidator)({}, { emptyOk: true })
    }),
    "Orders": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Orders']),
        info: (0, exports.objectValidator)({}, { emptyOk: true })
    }),
    HTML: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['HTML']),
        info: (0, exports.objectValidator)({
            html: exports.stringValidator5000,
        })
    }),
});
exports.portalBlocksValidator = (0, exports.listValidatorEmptyOk)(exports.portalBlockValidator);
var _PORTAL_BLOCK_TYPES = {
    carePlan: '',
    careTeam: '',
    education: '',
    text: '',
    Events: '',
    chat: '',
    "Manage Subscription Button": '',
    Orders: '',
    HTML: '',
};
exports.PORTAL_BLOCK_TYPES = Object.keys(_PORTAL_BLOCK_TYPES);
exports.portalTypeValidator = (0, exports.exactMatchValidator)(exports.PORTAL_BLOCK_TYPES);
exports.enduserTaskForEventValidator = (0, exports.objectValidator)({
    id: exports.mongoIdStringRequired,
    enduserId: exports.mongoIdStringRequired,
});
exports.enduserTasksForEventValidator = (0, exports.listValidatorEmptyOk)(exports.enduserTaskForEventValidator);
exports.enduserFormResponseForEventValidator = (0, exports.objectValidator)({
    enduserId: exports.mongoIdStringRequired,
    formId: exports.mongoIdStringRequired,
    accessCode: exports.stringValidator1000,
});
exports.enduserFormResponsesForEventValidator = (0, exports.listValidatorEmptyOk)(exports.enduserFormResponseForEventValidator);
exports.genericUnitWithQuantityValidator = (0, exports.objectValidator)({
    value: exports.numberOrStringValidatorEmptyOkay,
    unit: exports.stringValidator1000,
});
exports.stateCredentialValidator = (0, exports.objectValidator)({
    expiresAt: exports.dateValidatorOptional,
    licenseId: exports.stringValidatorOptionalEmptyOkay,
    state: exports.stateValidator,
});
exports.stateCredentialsValidator = (0, exports.listValidatorEmptyOk)(exports.stateCredentialValidator);
exports.baseAvailabilityBlockValidator = (0, exports.objectValidator)({
    durationInMinutes: exports.nonNegNumberValidator,
    startTimeInMS: exports.nonNegNumberValidator,
    userId: exports.mongoIdStringRequired,
    externalId: exports.stringValidatorOptionalEmptyOkay,
});
exports.baseAvailabilityBlocksValidator = (0, exports.listValidatorEmptyOk)(exports.baseAvailabilityBlockValidator);
exports.weeklyAvailabilityValidator = (0, exports.objectValidator)({
    dayOfWeekStartingSundayIndexedByZero: exports.nonNegNumberValidator,
    endTimeInMinutes: exports.nonNegNumberValidator,
    startTimeInMinutes: exports.nonNegNumberValidator,
    locationId: exports.mongoIdStringOptional,
    locationIds: exports.listOfMongoIdStringValidatorOptionalOrEmptyOk,
    active: exports.dateRangeOptionalValidator,
    validTemplateIds: exports.listOfMongoIdStringValidatorOptionalOrEmptyOk,
    intervalInMinutes: exports.numberValidatorOptional,
    priority: exports.numberValidatorOptional,
    bufferStartMinutes: exports.numberValidatorOptional,
});
exports.weeklyAvailabilitiesValidator = (0, exports.listValidatorEmptyOk)(exports.weeklyAvailabilityValidator);
exports.timezoneValidator = (0, exports.exactMatchValidator)(Object.keys(types_models_1.TIMEZONE_MAP));
exports.timezoneValidatorOptional = (0, exports.exactMatchValidator)(Object.keys(types_models_1.TIMEZONE_MAP), { isOptional: true });
exports.accessValidator = (0, exports.exactMatchValidator)([
    constants_1.ALL_ACCESS, constants_1.DEFAULT_ACCESS, constants_1.ASSIGNED_ACCESS, constants_1.NO_ACCESS,
]);
var _CUSTOM_ENDUSER_FIELD_TYPES = {
    "Select": true,
    "Multiple Select": true,
    "Text": true,
    "Multiple Text": true,
    "Date": true,
    "Auto Detect": true,
    Table: true,
    File: true,
    Number: true,
    Checkbox: true,
    "Database Select": true,
};
exports.CUSTOM_ENDUSER_FIELD_TYPES = Object.keys(_CUSTOM_ENDUSER_FIELD_TYPES);
exports.customEnduserFieldTypeValidator = (0, exports.exactMatchValidator)(exports.CUSTOM_ENDUSER_FIELD_TYPES);
var _AVAILABILITY_BLOCK_ENTITIES = {
    organization: true,
    user: true,
};
exports.AVAILABILITY_BLOCK_ENTITIES = Object.keys(_AVAILABILITY_BLOCK_ENTITIES);
exports.availabilityEntitiesValidator = (0, exports.exactMatchValidator)(exports.AVAILABILITY_BLOCK_ENTITIES);
exports.indexUpdateValidator = (0, exports.objectValidator)({
    id: exports.mongoIdStringRequired,
    index: exports.nonNegNumberValidator,
});
exports.indexUpdatesValidator = (0, exports.listValidator)(exports.indexUpdateValidator);
exports.customEnduserFieldValidator = (0, exports.orValidator)({
    Select: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Select']),
        info: (0, exports.objectValidator)({
            options: exports.listOfStringsValidator,
            other: exports.booleanValidatorOptional,
        }),
        field: exports.stringValidator,
        required: exports.booleanValidatorOptional,
        hiddenFromProfile: exports.booleanValidatorOptional,
        requireConfirmation: exports.booleanValidatorOptional,
    }),
    "Multiple Select": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Multiple Select']),
        info: (0, exports.objectValidator)({
            options: exports.listOfStringsValidator,
        }),
        field: exports.stringValidator,
        required: exports.booleanValidatorOptional,
        hiddenFromProfile: exports.booleanValidatorOptional,
        requireConfirmation: exports.booleanValidatorOptional,
    }),
    Text: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Text']),
        info: exports.optionalEmptyObjectValidator,
        field: exports.stringValidator,
        required: exports.booleanValidatorOptional,
        hiddenFromProfile: exports.booleanValidatorOptional,
        requireConfirmation: exports.booleanValidatorOptional,
    }),
    Number: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Number']),
        info: exports.optionalEmptyObjectValidator,
        field: exports.stringValidator,
        required: exports.booleanValidatorOptional,
        hiddenFromProfile: exports.booleanValidatorOptional,
        requireConfirmation: exports.booleanValidatorOptional,
    }),
    File: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['File']),
        info: exports.optionalEmptyObjectValidator,
        field: exports.stringValidator,
        required: exports.booleanValidatorOptional,
        hiddenFromProfile: exports.booleanValidatorOptional,
        requireConfirmation: exports.booleanValidatorOptional,
    }),
    "Multiple Text": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(["Multiple Text"]),
        info: exports.optionalEmptyObjectValidator,
        field: exports.stringValidator,
        required: exports.booleanValidatorOptional,
        hiddenFromProfile: exports.booleanValidatorOptional,
        requireConfirmation: exports.booleanValidatorOptional,
    }),
    Date: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Date']),
        info: exports.optionalEmptyObjectValidator,
        field: exports.stringValidator,
        required: exports.booleanValidatorOptional,
        hiddenFromProfile: exports.booleanValidatorOptional,
        requireConfirmation: exports.booleanValidatorOptional,
    }),
    "Auto Detect": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(["Auto Detect"]),
        info: exports.optionalEmptyObjectValidator,
        field: exports.stringValidator,
        required: exports.booleanValidatorOptional,
        hiddenFromProfile: exports.booleanValidatorOptional,
        requireConfirmation: exports.booleanValidatorOptional,
    }),
    "Table": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(["Table"]),
        info: (0, exports.objectValidator)({
            columns: (0, exports.listValidator)(exports.tableInputChoiceValidator),
        }),
        field: exports.stringValidator,
        required: exports.booleanValidatorOptional,
        hiddenFromProfile: exports.booleanValidatorOptional,
        requireConfirmation: exports.booleanValidatorOptional,
    }),
    "Checkbox": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(["Checkbox"]),
        info: exports.optionalEmptyObjectValidator,
        field: exports.stringValidator,
        required: exports.booleanValidatorOptional,
        hiddenFromProfile: exports.booleanValidatorOptional,
        requireConfirmation: exports.booleanValidatorOptional,
    }),
    "Database Select": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(["Database Select"]),
        info: (0, exports.objectValidator)({
            databaseId: exports.mongoIdStringRequired,
            columns: exports.listOfStringsValidator,
        }),
        field: exports.stringValidator,
        required: exports.booleanValidatorOptional,
        hiddenFromProfile: exports.booleanValidatorOptional,
        requireConfirmation: exports.booleanValidatorOptional,
    }),
});
exports.customEnduserFieldsValidatorOptionalOrEmpty = (0, exports.listValidatorOptionalOrEmptyOk)(exports.customEnduserFieldValidator);
exports.buildInFieldsValidator = (0, exports.listValidatorOptionalOrEmptyOk)((0, exports.objectValidator)({
    field: exports.stringValidator100,
    label: exports.stringValidator100,
    hidden: exports.booleanValidatorOptional,
    required: exports.booleanValidatorOptional,
    requireConfirmation: exports.booleanValidatorOptional,
}));
exports.customDashboardViewValidator = ((0, exports.objectValidator)({
    blocks: (0, exports.listValidatorOptionalOrEmptyOk)((0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Inbox', 'Tickets', 'Team Chats', 'Upcoming Events', "To-Dos", "Database"]),
        info: (0, exports.objectValidator)({
            databaseId: exports.mongoIdStringOptional,
        }, { emptyOk: true, isOptional: true }),
    }))
}, { isOptional: true, emptyOk: true }));
exports.organizationSettingsValidator = (0, exports.objectValidator)({
    endusers: (0, exports.objectValidator)({
        disableMultipleChatRooms: exports.booleanValidatorOptional,
        disableCalendarEventAutoAssignment: exports.booleanValidatorOptional,
        disableAdhocFields: exports.booleanValidatorOptional,
        autoReplyEnabled: exports.booleanValidatorOptional,
        recordCalls: exports.booleanValidatorOptional,
        transcribeCalls: exports.booleanValidatorOptional,
        showFreeNote: exports.booleanValidatorOptional,
        autoSaveFreeNote: exports.booleanValidatorOptional,
        canDeleteFreeNote: exports.booleanValidatorOptional,
        customFields: exports.customEnduserFieldsValidatorOptionalOrEmpty,
        builtinFields: exports.buildInFieldsValidator,
        tags: exports.listOfStringsValidatorOptionalOrEmptyOk,
        transcribeCallInboundPlayback: exports.stringValidatorOptionalEmptyOkay,
        sendSMSOnZoomStart: exports.booleanValidatorOptional,
        enableGroupMMS: exports.booleanValidatorOptional,
        enableAccessTags: exports.booleanValidatorOptional,
        flaggedFileText: exports.stringValidatorOptional,
        defaultPhoneNumber: exports.stringValidatorOptional,
        showBulkFormInput: exports.booleanValidatorOptional,
        autofillSignature: exports.booleanValidatorOptional,
        showFullVitalsTab: exports.booleanValidatorOptional,
        canMoveCalls: exports.booleanValidatorOptional,
        canMoveSMS: exports.booleanValidatorOptional,
        showDeleteCallRecordingOnTimeline: exports.booleanValidatorOptional,
        inboxRepliesMarkRead: exports.booleanValidatorOptional,
        recordCallAudioPlayback: exports.stringValidatorOptional,
        dontRecordCallsToPhone: exports.listOfStringsValidatorOptionalOrEmptyOk,
        disableAutoreplyForCustomEntities: exports.booleanValidatorOptional,
        alwaysShowInsurance: exports.booleanValidatorOptional,
        defaultToOutboundConferenceCall: exports.booleanValidatorOptional,
        sharedInboxReadStatus: exports.booleanValidatorOptional,
        dontMarkReadForAssigned: exports.booleanValidatorOptional,
        matchEmailAndNames: exports.booleanValidatorOptional,
        hideNotesFromComposeForm: exports.booleanValidatorOptional,
        showSalesforceId: exports.booleanValidatorOptional,
        loopQueueCallSound: exports.booleanValidatorOptional,
        showOrdersInSidebar: exports.booleanValidatorOptional,
        showDiagnoses: exports.booleanValidatorOptional,
        requireObservationInvalidationReason: exports.booleanValidatorOptional,
        showDeviceOrders: exports.booleanValidatorOptional,
        defaultHideFilesFromPortal: exports.booleanValidatorOptional,
        hideUnorderedFullscriptMeds: exports.booleanValidatorOptional,
        detailField: exports.stringValidatorOptional,
        showDownloadCallRecordings: exports.booleanValidatorOptional,
        launchDosespotWebhookURL: exports.stringValidatorOptionalEmptyOkay,
        reverseTimeline: exports.booleanValidatorOptional,
    }, { isOptional: true }),
    tickets: (0, exports.objectValidator)({
        defaultJourneyDueDateOffsetInMS: exports.numberValidatorOptional,
        disableSnooze: exports.booleanValidatorOptional,
        showCommunications: exports.booleanValidatorOptional,
        showJourneys: exports.booleanValidatorOptional,
        requireDueDate: exports.booleanValidatorOptional,
        allowArchival: exports.booleanValidatorOptional,
        returnToTicketsList: exports.booleanValidatorOptional,
        dontAddToCareTeamOnTicketAssignment: exports.booleanValidatorOptional,
    }, { isOptional: true }),
    calendar: (0, exports.objectValidator)({
        dayStart: (0, exports.objectValidator)({
            hour: exports.numberValidator,
            minute: exports.numberValidatorOptional,
            // timezone: timezoneValidator, // weird stuff happens at the boundaries with timezones, leave out for now
        }, { isOptional: true }),
        dayEnd: (0, exports.objectValidator)({
            hour: exports.numberValidator,
            minute: exports.numberValidatorOptional,
            // timezone: timezoneValidator, // weird stuff happens at the boundaries with timezones, leave out for now
        }, { isOptional: true }),
        bookingStartOffset: (0, exports.objectValidator)({
            month: exports.numberValidatorOptional,
            day: exports.numberValidatorOptional,
            hour: exports.numberValidatorOptional,
        }, { isOptional: true }),
        bookingEndOffset: (0, exports.objectValidator)({
            month: exports.numberValidatorOptional,
            day: exports.numberValidatorOptional,
            hour: exports.numberValidatorOptional,
        }, { isOptional: true }),
        templateRequired: exports.booleanValidatorOptional,
        locationRequired: exports.booleanValidatorOptional,
        cancelReasons: exports.listOfStringsValidatorOptionalOrEmptyOk,
        copyRemindersByDefault: exports.booleanValidatorOptional,
        showMakeRecurringOnProfile: exports.booleanValidatorOptional,
    }, { isOptional: true }),
    dashboard: (0, exports.objectValidator)({
        view: exports.customDashboardViewValidator,
    }, { isOptional: true, emptyOk: true, }),
    users: (0, exports.objectValidator)({
        sessionDurationInHours: exports.numberValidatorOptional,
    }, { isOptional: true, emptyOk: true, }),
    integrations: (0, exports.objectValidator)({
        vitalLabOrderPhysicianOptional: exports.booleanValidatorOptional,
        athenaAppointmentSyncJITSeconds: exports.numberValidatorOptional,
    }, { isOptional: true, emptyOk: true, }),
    interface: (0, exports.objectValidator)({
        dontPersistSearches: exports.booleanValidatorOptional,
        showEndusersV2: exports.booleanValidatorOptional,
        showInboxV2: exports.booleanValidatorOptional,
        showDialerInTopbar: exports.booleanValidatorOptional,
    }, { isOptional: true, emptyOk: true, }),
});
exports.calendarEventPortalSettingsValidator = (0, exports.objectValidator)({
    hideUsers: exports.booleanValidatorOptional,
});
exports.vitalComparisonValidator = (0, exports.orValidator)({
    "Less Than": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Less Than']),
        value: exports.numberValidator,
    }),
    "Greater Than": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Greater Than']),
        value: exports.numberValidator,
    }),
    "Between": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Between']),
        value: (0, exports.objectValidator)({
            lower: exports.numberValidator,
            upper: exports.numberValidator,
        }),
    }),
});
exports.vitalConfigurationRangeValidator = (0, exports.objectValidator)({
    classification: exports.stringValidator100,
    trendIntervalInMS: exports.numberValidatorOptional,
    comparison: exports.vitalComparisonValidator,
    deviationFromProfileWeight: exports.booleanValidatorOptional,
});
exports.vitalConfigurationRangesValidator = (0, exports.listValidator)(exports.vitalConfigurationRangeValidator);
var _AUTOMATION_TRIGGER_EVENT_TYPES = {
    "Form Submitted": true,
    "Form Unsubmitted": true,
    "Form Started": true,
    "Purchase Made": true,
    "Refund Issued": true,
    "Subscription Ended": true,
    "Subscription Payment Failed": true,
    "Appointment No-Showed": true,
    "Appointment Created": true,
    "Appointment Cancelled": true,
    "Appointment Completed": true,
    "Appointment Rescheduled": true,
    "Field Equals": true,
    "Fields Changed": true,
    "Tag Added": true,
    "Contact Created": true,
    "No Recent Appointment": true,
    "Medication Added": true,
    "On Birthday": true,
    "Has Not Engaged": true,
    "Vital Count": true,
    'Vital Update': true,
    "SMS Reply": true,
    "Order Status Equals": true,
    "Missed Call": true,
    "Order Created": true,
    "Problem Created": true,
    "Message Delivery Failure": true,
    "Incoming Message": true,
    "Pregnancy Ended": true,
    "Form Group Completed": true,
    "Form Group Incomplete": true,
    "Left Voicemail": true,
    "Message Opened": true,
    "Message Link Clicked": true,
    "Healthie Note Locked": true,
    "Database Entry Added": true,
    "Eligibility Result Received": true,
    "File Added": true,
};
exports.AUTOMATION_TRIGGER_EVENT_TYPES = Object.keys(_AUTOMATION_TRIGGER_EVENT_TYPES);
exports.automationTriggerEventValidator = (0, exports.orValidator)({
    "Form Submitted": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Form Submitted']),
        info: (0, exports.objectValidator)({
            formId: exports.mongoIdStringRequired,
            otherFormIds: exports.listOfMongoIdStringValidatorOptionalOrEmptyOk,
            publicIdentifier: exports.stringValidatorOptionalEmptyOkay,
            submitterType: exports.sessionTypeOrAnyoneValidatorOptional,
            hasExpiredEvent: exports.booleanValidatorOptional,
        }),
        conditions: (0, exports.orValidator)({
            optional: exports.optionalAnyObjectValidator,
            included: exports.objectAnyFieldsAnyValuesValidator,
        }, { isOptional: true }),
    }),
    "Form Unsubmitted": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Form Unsubmitted']),
        info: (0, exports.objectValidator)({
            formId: exports.mongoIdStringRequired,
            intervalInMS: exports.nonNegNumberValidator,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Form Started": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Form Started']),
        info: (0, exports.objectValidator)({
            formIds: exports.listOfMongoIdStringValidatorOptionalOrEmptyOk,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Field Equals": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Field Equals']),
        info: (0, exports.objectValidator)({
            field: exports.stringValidator1000,
            value: exports.stringValidator1000,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Fields Changed": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Fields Changed']),
        info: (0, exports.objectValidator)({
            fields: exports.listOfStringsValidator,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Contact Created": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Contact Created']),
        info: (0, exports.objectValidator)({
            entityTypes: exports.listOfStringsValidatorOptionalOrEmptyOk,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "No Recent Appointment": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['No Recent Appointment']),
        info: (0, exports.objectValidator)({
            intervalInMS: exports.nonNegNumberValidator,
            templateIds: exports.listOfStringsValidatorOptionalOrEmptyOk,
            titles: exports.listOfStringsValidatorOptionalOrEmptyOk,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Purchase Made": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Purchase Made']),
        info: (0, exports.objectValidator)({
            titles: exports.listOfStringsValidatorOptionalOrEmptyOk,
            productIds: exports.listOfMongoIdStringValidatorOptionalOrEmptyOk,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Refund Issued": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Refund Issued']),
        info: exports.optionalEmptyObjectValidator,
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Subscription Ended": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Subscription Ended']),
        info: exports.optionalEmptyObjectValidator,
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Subscription Payment Failed": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Subscription Payment Failed']),
        info: exports.optionalEmptyObjectValidator,
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Message Delivery Failure": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Message Delivery Failure']),
        info: exports.optionalEmptyObjectValidator,
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Incoming Message": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Incoming Message']),
        info: (0, exports.objectValidator)({
            noCareTeam: exports.booleanValidatorOptional,
            destinations: exports.listOfStringsValidatorOptionalOrEmptyOk,
            channels: exports.listOfStringsValidatorOptionalOrEmptyOk,
            keywords: exports.listOfStringsValidatorOptionalOrEmptyOk,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Appointment No-Showed": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Appointment No-Showed']),
        info: (0, exports.objectValidator)({
            titles: exports.listOfStringsValidatorOptionalOrEmptyOk,
            templateIds: exports.listOfMongoIdStringValidatorOptionalOrEmptyOk,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Appointment Created": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Appointment Created']),
        info: (0, exports.objectValidator)({
            titles: exports.listOfStringsValidatorOptionalOrEmptyOk,
            templateIds: exports.listOfMongoIdStringValidatorOptionalOrEmptyOk,
            excludeTemplateIds: exports.listOfMongoIdStringValidatorOptionalOrEmptyOk,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Appointment Completed": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Appointment Completed']),
        info: (0, exports.objectValidator)({
            titles: exports.listOfStringsValidatorOptionalOrEmptyOk,
            templateIds: exports.listOfMongoIdStringValidatorOptionalOrEmptyOk,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Appointment Cancelled": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Appointment Cancelled']),
        info: (0, exports.objectValidator)({
            titles: exports.listOfStringsValidatorOptionalOrEmptyOk,
            by: (0, exports.exactMatchValidatorOptional)(['', 'enduser', 'user']),
            templateIds: exports.listOfMongoIdStringValidatorOptionalOrEmptyOk,
            excludeTemplateIds: exports.listOfMongoIdStringValidatorOptionalOrEmptyOk,
            excludeCancelUpcomingEventsJourney: exports.booleanValidatorOptional,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Appointment Rescheduled": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Appointment Rescheduled']),
        info: (0, exports.objectValidator)({
            titles: exports.listOfStringsValidatorOptionalOrEmptyOk,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Medication Added": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Medication Added']),
        info: (0, exports.objectValidator)({
            titles: exports.listOfStringsValidatorEmptyOk,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "On Birthday": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['On Birthday']),
        info: (0, exports.objectValidator)({
            minutes: exports.nonNegNumberValidator,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Has Not Engaged": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Has Not Engaged']),
        info: (0, exports.objectValidator)({
            intervalInMS: exports.nonNegNumberValidator,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Vital Count": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Vital Count']),
        info: (0, exports.objectValidator)({
            minutes: exports.nonNegNumberValidator,
            units: exports.listOfStringsValidatorEmptyOk,
            comparison: exports.vitalComparisonValidator,
            periodInMS: exports.numberValidator,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Vital Update": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Vital Update']),
        info: (0, exports.objectValidator)({
            configurationIds: exports.listOfMongoIdStringValidator,
            classifications: exports.listOfStringsValidator,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "SMS Reply": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['SMS Reply']),
        info: (0, exports.objectValidator)({
            templateIds: exports.listOfMongoIdStringValidator,
            replyKeywords: exports.listOfStringsValidatorOptionalOrEmptyOk,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Order Status Equals": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Order Status Equals']),
        info: (0, exports.objectValidator)({
            source: exports.stringValidator100,
            status: exports.stringValidator100,
            fills: exports.listOfStringsValidatorOptionalOrEmptyOk,
            skus: exports.listOfStringsValidatorOptionalOrEmptyOk,
            skuPartials: exports.listOfStringsValidatorOptionalOrEmptyOk,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Missed Call": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Missed Call']),
        info: (0, exports.objectValidator)({
            inputs: exports.listOfStringsValidatorOptionalOrEmptyOk,
            phoneNumbers: exports.listOfStringsValidatorOptionalOrEmptyOk,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Left Voicemail": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Left Voicemail']),
        info: (0, exports.objectValidator)({
            inputs: exports.listOfStringsValidatorOptionalOrEmptyOk,
            phoneNumbers: exports.listOfStringsValidatorOptionalOrEmptyOk,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Order Created": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Order Created']),
        info: (0, exports.objectValidator)({
            titles: exports.listOfStringsValidatorOptionalOrEmptyOk,
            fills: exports.listOfStringsValidatorOptionalOrEmptyOk,
            partialFrequency: exports.stringValidatorOptional,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Problem Created": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Problem Created']),
        info: (0, exports.objectValidator)({
            titles: exports.listOfStringsValidatorOptionalOrEmptyOk,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Pregnancy Ended": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Pregnancy Ended']),
        info: (0, exports.objectValidator)({
            reason: exports.stringValidatorOptional,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Form Group Completed": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Form Group Completed']),
        info: (0, exports.objectValidator)({
            groupId: exports.mongoIdStringRequired,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Form Group Incomplete": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Form Group Incomplete']),
        info: (0, exports.objectValidator)({
            groupId: exports.mongoIdStringRequired,
            intervalInMS: exports.nonNegNumberValidator,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Message Opened": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Message Opened']),
        info: (0, exports.objectValidator)({
            templateIds: exports.listOfMongoIdStringValidatorOptionalOrEmptyOk,
        }, { emptyOk: true }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Message Link Clicked": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Message Link Clicked']),
        info: (0, exports.objectValidator)({
            templateIds: exports.listOfMongoIdStringValidatorOptionalOrEmptyOk,
        }, { emptyOk: true }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Healthie Note Locked": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Healthie Note Locked']),
        info: (0, exports.objectValidator)({
            healthieFormIds: exports.listOfStringsValidatorOptionalOrEmptyOk,
            answersCondition: exports.objectAnyFieldsAnyValuesValidator,
        }, { emptyOk: true }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Database Entry Added": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Database Entry Added']),
        info: (0, exports.objectValidator)({
            databaseId: exports.mongoIdStringRequired,
        }, { emptyOk: true }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Eligibility Result Received": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Eligibility Result Received']),
        info: (0, exports.objectValidator)({
            source: exports.stringValidator100,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "File Added": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['File Added']),
        info: (0, exports.objectValidator)({
            source: exports.stringValidator100,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
    "Tag Added": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Tag Added']),
        info: (0, exports.objectValidator)({
            tag: exports.stringValidator100,
        }),
        conditions: exports.optionalEmptyObjectValidator,
    }),
});
var _AUTOMATION_TRIGGER_ACTION_TYPES = {
    "Add To Journey": true,
    "Remove From Journey": true,
    "Move To Step": true,
    "Set Fields": true,
    "Add Tags": true,
    "Remove Tags": true,
    "Add Access Tags": true,
    "Assign Care Team": true,
    "Remove Care Team": true,
    "Remove From All Journeys": true,
    "Canvas: Add Patient": true,
    "Zus: Delete Enrollment": true,
    "Require Form Followups": true,
    "Add to Waitlist": true,
    "Grant Access From Waitlist": true,
    "Reply to Chat": true,
};
exports.AUTOMATION_TRIGGER_ACTION_TYPES = Object.keys(_AUTOMATION_TRIGGER_ACTION_TYPES);
exports.automationTriggerActionValidator = (0, exports.orValidator)({
    "Add To Journey": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Add To Journey']),
        info: (0, exports.objectValidator)({
            journeyId: exports.mongoIdStringRequired,
            doNotRestart: exports.booleanValidatorOptional,
        }),
    }),
    "Remove From Journey": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Remove From Journey']),
        info: (0, exports.objectValidator)({
            journeyId: exports.mongoIdStringRequired,
        }),
    }),
    "Move To Step": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Move To Step']),
        info: exports.optionalEmptyObjectValidator,
    }),
    "Add Tags": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Add Tags']),
        info: (0, exports.objectValidator)({
            tags: exports.listOfStringsValidator,
            replaceExisting: exports.booleanValidatorOptional,
        }),
    }),
    "Remove Tags": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Remove Tags']),
        info: (0, exports.objectValidator)({
            tags: exports.listOfStringsValidator,
        }),
    }),
    "Add Access Tags": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Add Access Tags']),
        info: (0, exports.objectValidator)({
            tags: exports.listOfStringsValidator,
        }),
    }),
    "Assign Care Team": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Assign Care Team']),
        info: (0, exports.objectValidator)({
            tags: exports.listOfStringsWithQualifierValidator,
            limitToOneUser: exports.booleanValidatorOptional,
            setAsPrimary: exports.booleanValidatorOptional,
        }),
    }),
    "Remove Care Team": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Remove Care Team']),
        info: (0, exports.objectValidator)({
            tags: exports.listOfStringsWithQualifierValidator,
        }),
    }),
    "Set Fields": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Set Fields']),
        info: (0, exports.objectValidator)({
            fields: (0, exports.listValidator)((0, exports.objectValidator)({
                name: exports.stringValidator,
                type: exports.stringValidator,
                value: exports.stringValidator,
                increment: exports.numberValidatorOptional,
            }))
        }),
    }),
    "Remove From All Journeys": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Remove From All Journeys']),
        info: exports.optionalEmptyObjectValidator,
    }),
    "Canvas: Add Patient": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Canvas: Add Patient']),
        info: exports.optionalEmptyObjectValidator,
    }),
    "Zus: Delete Enrollment": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Zus: Delete Enrollment']),
        info: (0, exports.objectValidator)({
            packageId: exports.stringValidator100,
        }),
    }),
    "Require Form Followups": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Require Form Followups']),
        info: (0, exports.objectValidator)({
            formIds: exports.listOfUniqueStringsValidatorEmptyOk,
        }),
    }),
    "Add to Waitlist": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Add to Waitlist']),
        info: (0, exports.objectValidator)({
            waitlistId: exports.mongoIdStringRequired,
        }),
    }),
    "Grant Access From Waitlist": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Grant Access From Waitlist']),
        info: (0, exports.objectValidator)({
            waitlistId: exports.mongoIdStringRequired,
            count: exports.numberValidator,
        }),
    }),
    "Reply to Chat": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Reply to Chat']),
        info: (0, exports.objectValidator)({
            message: exports.stringValidator,
        }),
    }),
});
var _AUTOMATION_TRIGGER_STATUSES = {
    Active: true,
    Inactive: true,
};
exports.AUTOMATION_TRIGGER_STATUSES = Object.keys(_AUTOMATION_TRIGGER_STATUSES);
exports.automatioNTriggerStatusValidator = (0, exports.exactMatchValidator)(exports.AUTOMATION_TRIGGER_STATUSES);
var _EMBEDDING_TYPES = {
    "text-embedding-ada-002": true,
};
exports.EMBEDDING_TYPES = Object.keys(_EMBEDDING_TYPES);
exports.embeddingTypeValidator = (0, exports.exactMatchValidator)(exports.EMBEDDING_TYPES);
exports.superbillPatientInfoValidator = (0, exports.objectValidator)({
    dateOfBirth: exports.stringValidator,
    name: exports.stringValidator,
    phone: exports.stringValidator,
});
exports.superbillProviderInfoValidator = (0, exports.objectValidator)({
    address: exports.addressValidator,
    email: exports.emailValidator,
    officeName: exports.stringValidator1000,
    phone: exports.stringValidator,
    placeOfServiceCode: exports.stringValidatorOptionalEmptyOkay,
    providerLicense: exports.stringValidator,
    providerName: exports.stringValidator,
    providerNPI: exports.stringValidator,
    taxId: exports.stringValidator,
});
exports.billingCodeValidator = (0, exports.objectValidator)({
    code: exports.numberOrStringValidatorOptional,
    label: exports.stringValidator,
});
exports.billingCodeValidatorOptional = (0, exports.objectValidator)({
    code: exports.numberValidatorOptional,
    label: exports.stringValidatorOptional,
}, { emptyOk: true, isOptional: true });
var superbillLineItemValidator = (0, exports.objectValidator)({
    billingCode: exports.billingCodeValidator,
    quantity: exports.numberValidator,
    cost: (0, exports.objectValidator)({
        amount: exports.numberValidator,
        currency: exports.stringValidator,
    }),
    discount: exports.numberValidatorOptional,
    diagnosisCodes: exports.listOfStringsValidatorOptionalOrEmptyOk,
});
exports.superbillLineItemsValidator = (0, exports.listValidator)(superbillLineItemValidator);
var ticketSnoozeValidator = (0, exports.objectValidator)({
    at: exports.dateValidator,
    until: exports.dateValidator,
    reason: exports.stringValidatorOptional,
});
exports.ticketSnoozesValidator = (0, exports.listValidatorOptionalOrEmptyOk)(ticketSnoozeValidator);
// for each model name, this should be optional, but when a model name is provided, all CRUD fields should be required
// if this changes (e.g. CRUD fields are made optional), must merge better in authentication.ts in API
exports.accessPermissionValidator = (0, exports.objectValidator)({
    create: exports.accessValidator,
    delete: exports.accessValidator,
    read: exports.accessValidator,
    update: exports.accessValidator,
    showInSidebar: exports.booleanValidatorOptional,
}, { isOptional: true });
exports.accessPermissionsValidator = (0, exports.objectValidator)({
    enduser_custom_types: exports.accessPermissionValidator,
    superbill_providers: exports.accessPermissionValidator,
    superbills: exports.accessPermissionValidator,
    availability_blocks: exports.accessPermissionValidator,
    analytics_frames: exports.accessPermissionValidator,
    endusers: exports.accessPermissionValidator,
    enduser_status_updates: exports.accessPermissionValidator,
    engagement_events: exports.accessPermissionValidator,
    journeys: exports.accessPermissionValidator,
    api_keys: exports.accessPermissionValidator,
    emails: exports.accessPermissionValidator,
    sms_messages: exports.accessPermissionValidator,
    chat_rooms: exports.accessPermissionValidator,
    chats: exports.accessPermissionValidator,
    users: exports.accessPermissionValidator,
    templates: exports.accessPermissionValidator,
    files: exports.accessPermissionValidator,
    tickets: exports.accessPermissionValidator,
    meetings: exports.accessPermissionValidator,
    notes: exports.accessPermissionValidator,
    forms: exports.accessPermissionValidator,
    form_fields: exports.accessPermissionValidator,
    form_responses: exports.accessPermissionValidator,
    calendar_events: exports.accessPermissionValidator,
    calendar_event_templates: exports.accessPermissionValidator,
    calendar_event_RSVPs: exports.accessPermissionValidator,
    automation_steps: exports.accessPermissionValidator,
    automated_actions: exports.accessPermissionValidator,
    webhooks: exports.accessPermissionValidator,
    user_logs: exports.accessPermissionValidator,
    user_notifications: exports.accessPermissionValidator,
    enduser_observations: exports.accessPermissionValidator,
    managed_content_records: exports.accessPermissionValidator,
    managed_content_record_assignments: exports.accessPermissionValidator,
    forums: exports.accessPermissionValidator,
    forum_posts: exports.accessPermissionValidator,
    post_likes: exports.accessPermissionValidator,
    comment_likes: exports.accessPermissionValidator,
    post_comments: exports.accessPermissionValidator,
    organizations: exports.accessPermissionValidator,
    integrations: exports.accessPermissionValidator,
    databases: exports.accessPermissionValidator,
    database_records: exports.accessPermissionValidator,
    portal_customizations: exports.accessPermissionValidator,
    care_plans: exports.accessPermissionValidator,
    enduser_tasks: exports.accessPermissionValidator,
    role_based_access_permissions: exports.accessPermissionValidator,
    appointment_booking_pages: exports.accessPermissionValidator,
    appointment_locations: exports.accessPermissionValidator,
    products: exports.accessPermissionValidator,
    purchase_credits: exports.accessPermissionValidator,
    purchases: exports.accessPermissionValidator,
    phone_calls: exports.accessPermissionValidator,
    background_errors: exports.accessPermissionValidator,
    enduser_views: exports.accessPermissionValidator,
    automation_triggers: exports.accessPermissionValidator,
    enduser_profile_views: exports.accessPermissionValidator,
    enduser_medications: exports.accessPermissionValidator,
    phone_trees: exports.accessPermissionValidator,
    table_views: exports.accessPermissionValidator,
    email_sync_denials: exports.accessPermissionValidator,
    ticket_thread_comments: exports.accessPermissionValidator,
    ticket_threads: exports.accessPermissionValidator,
    configurations: exports.accessPermissionValidator,
    ticket_queues: exports.accessPermissionValidator,
    group_mms_conversations: exports.accessPermissionValidator,
    enduser_orders: exports.accessPermissionValidator,
    enduser_encounters: exports.accessPermissionValidator,
    vital_configurations: exports.accessPermissionValidator,
    blocked_phones: exports.accessPermissionValidator,
    prescription_routes: exports.accessPermissionValidator,
    enduser_problems: exports.accessPermissionValidator,
    flowchart_notes: exports.accessPermissionValidator,
    webhook_logs: exports.accessPermissionValidator,
    form_groups: exports.accessPermissionValidator,
    portal_brandings: exports.accessPermissionValidator,
    message_template_snippets: exports.accessPermissionValidator,
    fax_logs: exports.accessPermissionValidator,
    call_hold_queues: exports.accessPermissionValidator,
    suggested_contacts: exports.accessPermissionValidator,
    diagnosis_codes: exports.accessPermissionValidator,
    allergy_codes: exports.accessPermissionValidator,
    integration_logs: exports.accessPermissionValidator,
    enduser_eligibility_results: exports.accessPermissionValidator,
    agent_records: exports.accessPermissionValidator,
    waitlists: exports.accessPermissionValidator,
    ai_conversations: exports.accessPermissionValidator,
    // deprecated but for backwards compatibility
    apiKeys: exports.accessPermissionValidator,
});
exports.organizationLimitsValidator = (0, exports.objectValidator)({
    ai_conversations: exports.accessPermissionValidator,
    suggested_contacts: exports.accessPermissionValidator,
    message_template_snippets: exports.accessPermissionValidator,
    webhook_logs: exports.accessPermissionValidator,
    enduser_problems: exports.accessPermissionValidator,
    prescription_routes: exports.accessPermissionValidator,
    group_mms_conversations: exports.accessPermissionValidator,
    enduser_custom_types: exports.numberValidatorOptional,
    superbill_providers: exports.numberValidatorOptional,
    superbills: exports.numberValidatorOptional,
    automation_triggers: exports.numberValidatorOptional,
    background_errors: exports.numberValidatorOptional,
    enduser_views: exports.numberValidatorOptional,
    availability_blocks: exports.numberValidatorOptional,
    analytics_frames: exports.numberValidatorOptional,
    endusers: exports.numberValidatorOptional,
    enduser_status_updates: exports.numberValidatorOptional,
    engagement_events: exports.numberValidatorOptional,
    journeys: exports.numberValidatorOptional,
    api_keys: exports.numberValidatorOptional,
    emails: exports.numberValidatorOptional,
    sms_messages: exports.numberValidatorOptional,
    chat_rooms: exports.numberValidatorOptional,
    chats: exports.numberValidatorOptional,
    users: exports.numberValidatorOptional,
    templates: exports.numberValidatorOptional,
    files: exports.numberValidatorOptional,
    tickets: exports.numberValidatorOptional,
    meetings: exports.numberValidatorOptional,
    notes: exports.numberValidatorOptional,
    forms: exports.numberValidatorOptional,
    form_fields: exports.numberValidatorOptional,
    form_responses: exports.numberValidatorOptional,
    calendar_events: exports.numberValidatorOptional,
    calendar_event_templates: exports.numberValidatorOptional,
    calendar_event_RSVPs: exports.numberValidatorOptional,
    automation_steps: exports.numberValidatorOptional,
    automated_actions: exports.numberValidatorOptional,
    webhooks: exports.numberValidatorOptional,
    user_logs: exports.numberValidatorOptional,
    user_notifications: exports.numberValidatorOptional,
    enduser_observations: exports.numberValidatorOptional,
    managed_content_records: exports.numberValidatorOptional,
    managed_content_record_assignments: exports.numberValidatorOptional,
    forums: exports.numberValidatorOptional,
    forum_posts: exports.numberValidatorOptional,
    post_likes: exports.numberValidatorOptional,
    comment_likes: exports.numberValidatorOptional,
    post_comments: exports.numberValidatorOptional,
    organizations: exports.numberValidatorOptional,
    integrations: exports.numberValidatorOptional,
    databases: exports.numberValidatorOptional,
    database_records: exports.numberValidatorOptional,
    portal_customizations: exports.numberValidatorOptional,
    care_plans: exports.numberValidatorOptional,
    enduser_tasks: exports.numberValidatorOptional,
    role_based_access_permissions: exports.numberValidatorOptional,
    appointment_booking_pages: exports.numberValidatorOptional,
    appointment_locations: exports.numberValidatorOptional,
    products: exports.numberValidatorOptional,
    purchase_credits: exports.numberValidatorOptional,
    purchases: exports.numberValidatorOptional,
    phone_calls: exports.numberValidatorOptional,
    enduser_profile_views: exports.numberValidatorOptional,
    enduser_medications: exports.numberValidatorOptional,
    phone_trees: exports.numberValidatorOptional,
    table_views: exports.numberValidatorOptional,
    email_sync_denials: exports.numberValidatorOptional,
    ticket_threads: exports.numberValidatorOptional,
    ticket_thread_comments: exports.numberValidatorOptional,
    configurations: exports.numberValidatorOptional,
    ticket_queues: exports.numberValidatorOptional,
    enduser_orders: exports.numberValidatorOptional,
    enduser_encounters: exports.numberValidatorOptional,
    vital_configurations: exports.numberValidatorOptional,
    blocked_phones: exports.numberValidatorOptional,
    flowchart_notes: exports.numberValidatorOptional,
    form_groups: exports.numberValidatorOptional,
    portal_brandings: exports.numberValidatorOptional,
    fax_logs: exports.numberValidatorOptional,
    call_hold_queues: exports.numberValidatorOptional,
    diagnosis_codes: exports.numberValidatorOptional,
    allergy_codes: exports.numberValidatorOptional,
    integration_logs: exports.numberValidatorOptional,
    enduser_eligibility_results: exports.numberValidatorOptional,
    agent_records: exports.numberValidatorOptional,
    waitlists: exports.numberValidatorOptional,
}, { emptyOk: true });
var _LOGIN_FLOW_RESULTS = {
    // "continue-set-password": true, // something we may turn on later / as requested
    "continue-with-password": true,
    "sent-email": true,
    "sent-sms": true
};
exports.LOGIN_FLOW_RESULTS = Object.keys(_LOGIN_FLOW_RESULTS);
exports.loginFlowResultValidator = (0, exports.exactMatchValidator)(exports.LOGIN_FLOW_RESULTS);
exports.appointmentTermsValidator = (0, exports.listValidatorEmptyOk)((0, exports.objectValidator)({
    link: exports.stringValidator5000,
    title: exports.stringValidator1000,
}));
var _CURRENCIES = {
    USD: '',
};
exports.CURRENCIES = Object.keys(_CURRENCIES);
exports.currencyValidator = (0, exports.exactMatchValidator)(exports.CURRENCIES);
var _PAYMENT_PROCESSORS = {
    Stripe: '',
    Square: '',
};
exports.PAYMENT_PROCESSORS = Object.keys(_PAYMENT_PROCESSORS);
exports.paymentProcessorValidator = (0, exports.exactMatchValidator)(exports.PAYMENT_PROCESSORS);
exports.costValidator = (0, exports.objectValidator)({
    amount: exports.nonNegNumberValidator,
    currency: exports.currencyValidator,
});
exports.purchaseCreditValueValidator = (0, exports.orValidator)({
    Credit: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Credit']),
        info: (0, exports.objectValidator)({
            amount: exports.numberValidator,
            currency: exports.currencyValidator,
        }),
    }),
    // Voucher: objectValidator<PurchaseCreditInfoForType['Voucher']>({
    //   type: exactMatchValidator(['Voucher']),
    //   info: objectValidator<PurchaseCreditInfoForType['Voucher']['info']>({}),
    // }), 
});
exports.integrationTitleValidator = (0, exports.exactMatchValidator)([
    constants_1.SQUARE_INTEGRATIONS_TITLE,
    constants_1.OUTLOOK_INTEGRATIONS_TITLE,
    constants_1.ZOHO_TITLE,
    constants_1.ZOOM_TITLE,
    constants_1.ZENDESK_INTEGRATIONS_TITLE,
    constants_1.FULLSCRIPT_INTEGRATIONS_TITLE,
    constants_1.ZUS_TITLE,
    constants_1.CANVAS_TITLE,
    constants_1.CANDID_TITLE,
    constants_1.GOGO_MEDS_TITLE,
    constants_1.PAGER_DUTY_TITLE,
    constants_1.SMART_METER_TITLE,
    constants_1.MFAX_TITLE,
    constants_1.ATHENA_TITLE,
    constants_1.DOSESPOT_TITLE,
    constants_1.DOCSUMO_TITLE,
    constants_1.ACTIVE_CAMPAIGN_TITLE,
    constants_1.STRIPE_TITLE,
    constants_1.EMOTII_TITLE,
    constants_1.DEVELOP_HEALTH_TITLE,
]);
var _VIDEO_INTEGRATION_TYPES = {
    Zoom: '',
    "No Integration": '',
};
exports.VIDEO_INTEGRATION_TYPES = Object.keys(_VIDEO_INTEGRATION_TYPES);
exports.videoIntegrationTypesValidator = (0, exports.exactMatchValidator)(exports.VIDEO_INTEGRATION_TYPES);
exports.analyticsQueryResultsValidator = (0, exports.listValidator)((0, exports.objectValidator)({
    key: exports.stringValidator100,
    timestamp: exports.dateOptionalOrEmptyStringValidator,
    unit: exports.stringValidator,
    value: exports.numberValidator,
    numerator: exports.numberValidatorOptional,
    denominator: exports.numberValidatorOptional,
    userId: exports.mongoIdStringOptional,
}));
exports.scheduledJourneysValidator = (0, exports.listValidatorOptionalOrEmptyOk)((0, exports.objectValidator)({
    journeyId: exports.mongoIdStringRequired,
    addAt: exports.dateValidator,
}));
exports.formScoringValidator = (0, exports.listValidatorOptionalOrEmptyOk)((0, exports.objectValidator)({
    title: exports.stringValidator100,
    fieldId: exports.mongoIdStringRequired,
    response: exports.stringValidatorOptional,
    score: (0, exports.orValidator)({
        responseValue: exports.stringValidator,
        number: exports.numberValidator, // use the pre-defined number as the score for this response
    }, { isNumber: true }) // set to allow 0
}));
// // todo: add more restrictions
// export const basicFilterValidateFuction: EscapeBuilder<BasicFilter<string>> = o => build_validator(v => {
//   if (!v) throw new Error("Filter value must be defined")
//   if (typeof v !== 'object') throw new Error('Expecting an object')
//   return v
// }, { ...o, listOf: false })
// // todo: add more restrictions
// export const compoundFilterValidateFuction: EscapeBuilder<CompoundFilter<string>> = o => build_validator(v => {
//   if (!v) throw new Error("Filter value must be defined")
//   if (typeof v !== 'object') throw new Error('Expecting an object')
//   return v
// }, { ...o, listOf: false })
exports.basicFilterValidator = exports.objectAnyFieldsAnyValuesValidator;
exports.compoundFilterValidator = exports.objectAnyFieldsAnyValuesValidator;
var enduserFieldsAnalyticsValidator = (0, exports.listValidatorOptionalOrEmptyOk)((0, exports.objectValidator)({
    key: exports.stringValidator1000,
    value: exports.stringValidator5000EmptyOkay,
    range: exports.dateRangeOptionalValidator,
    operator: exports.stringValidatorOptional,
}));
exports.analyticsQueryValidator = (0, exports.orValidator)({
    Endusers: (0, exports.objectValidator)({
        resource: (0, exports.exactMatchValidator)(['Endusers']),
        filter: (0, exports.objectValidator)({
            activeSince: exports.dateOptionalOrEmptyStringValidator,
            "Contacted Since": exports.dateOptionalOrEmptyStringValidator,
            gender: exports.tellescopeGenderOptionalValidator,
            fields: enduserFieldsAnalyticsValidator,
            "Submitted Forms": (0, exports.objectValidator)({
                qualifier: exports.listQueryQualifiersValidator,
                formIds: exports.listOfMongoIdStringValidator,
                formResponseCondition: (0, exports.orValidator)({
                    optional: exports.optionalAnyObjectValidator,
                    included: exports.objectAnyFieldsAnyValuesValidator,
                }, { isOptional: true }),
            }, { isOptional: true }),
            "assignedTo": (0, exports.objectValidator)({
                qualifier: exports.listQueryQualifiersValidator,
                userIds: exports.listOfMongoIdStringValidator,
            }, { isOptional: true }),
            "born": (0, exports.objectValidator)({
                from: exports.dateOptionalOrEmptyStringValidator,
                to: exports.dateOptionalOrEmptyStringValidator,
            }, { isOptional: true }),
            tags: exports.listOfStringsWithQualifierValidatorOptional,
            entityTypes: exports.listOfStringsValidatorOptionalOrEmptyOk,
        }, { isOptional: true, emptyOk: true }),
        info: (0, exports.orValidator)({
            "Total": (0, exports.objectValidator)({
                method: (0, exports.exactMatchValidator)(['Total']),
                parameters: exports.optionalEmptyObjectValidator,
            }),
            "Sum of Field": (0, exports.objectValidator)({
                method: (0, exports.exactMatchValidator)(['Sum of Field']),
                parameters: (0, exports.objectValidator)({
                    field: exports.stringValidator250,
                }),
            }),
        }),
        grouping: (0, exports.objectValidator)({
            Gender: exports.booleanValidatorOptional,
            "Assigned To": exports.booleanValidatorOptional,
            Field: exports.stringValidatorOptionalEmptyOkay,
            Tags: exports.booleanValidatorOptional,
            Age: exports.booleanValidatorOptional,
            State: exports.booleanValidatorOptional,
            Phone: exports.booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: (0, exports.objectValidator)({
            interval: (0, exports.exactMatchValidator)(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: (0, exports.exactMatchValidator)(['Created At', 'Updated At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "Calendar Events": (0, exports.objectValidator)({
        resource: (0, exports.exactMatchValidator)(['Calendar Events']),
        filter: (0, exports.objectValidator)({
            templateIds: exports.listOfMongoIdStringValidatorOptionalOrEmptyOk,
            starts: exports.dateRangeOptionalValidator,
            wasSelfScheduled: exports.booleanValidatorOptional,
            wasCancelled: exports.booleanValidatorOptional,
            wasCompleted: exports.booleanValidatorOptional,
            wasNoShowed: exports.booleanValidatorOptional,
            wasRescheduled: exports.booleanValidatorOptional,
            userIds: exports.listOfMongoIdStringValidatorOptionalOrEmptyOk,
            scheduledBy: exports.mongoIdStringOptional,
        }, { isOptional: true, emptyOk: true }),
        info: (0, exports.orValidator)({
            "Total": (0, exports.objectValidator)({
                method: (0, exports.exactMatchValidator)(['Total']),
                parameters: exports.optionalEmptyObjectValidator,
            }),
        }),
        grouping: (0, exports.objectValidator)({
            Type: exports.booleanValidatorOptional,
            Enduser: exports.booleanValidatorOptional,
            Gender: exports.booleanValidatorOptional,
            "Assigned To": exports.booleanValidatorOptional,
            Field: exports.stringValidatorOptionalEmptyOkay,
            Tags: exports.booleanValidatorOptional,
            Age: exports.booleanValidatorOptional,
            State: exports.booleanValidatorOptional,
            Phone: exports.booleanValidatorOptional,
            "Scheduled By": exports.booleanValidatorOptional,
            alsoGroupByHost: exports.booleanValidatorOptional,
            "Cancel Reason": exports.booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: (0, exports.objectValidator)({
            interval: (0, exports.exactMatchValidator)(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: (0, exports.exactMatchValidator)(['Created At', 'Updated At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "Form Responses": (0, exports.objectValidator)({
        resource: (0, exports.exactMatchValidator)(['Form Responses']),
        filter: (0, exports.objectValidator)({
            formIds: exports.listOfMongoIdStringValidatorOptionalOrEmptyOk,
            tags: exports.listOfStringsWithQualifierValidatorOptional,
            formResponseCondition: (0, exports.orValidator)({
                optional: exports.optionalAnyObjectValidator,
                included: exports.objectAnyFieldsAnyValuesValidator,
            }, { isOptional: true }),
        }, { isOptional: true, emptyOk: true }),
        info: (0, exports.orValidator)({
            "Total": (0, exports.objectValidator)({
                method: (0, exports.exactMatchValidator)(['Total']),
                parameters: exports.optionalEmptyObjectValidator,
            }),
        }),
        grouping: (0, exports.objectValidator)({
            "Submitted By": exports.booleanValidatorOptional,
            "Public Identifier": exports.booleanValidatorOptional,
            Enduser: exports.booleanValidatorOptional,
            Gender: exports.booleanValidatorOptional,
            "Assigned To": exports.booleanValidatorOptional,
            Field: exports.stringValidatorOptionalEmptyOkay,
            Tags: exports.booleanValidatorOptional,
            Age: exports.booleanValidatorOptional,
            State: exports.booleanValidatorOptional,
            Phone: exports.booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: (0, exports.objectValidator)({
            interval: (0, exports.exactMatchValidator)(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: (0, exports.exactMatchValidator)(['Created At', 'Updated At', 'Submitted At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "Purchases": (0, exports.objectValidator)({
        resource: (0, exports.exactMatchValidator)(['Purchases']),
        filter: (0, exports.objectValidator)({}, { isOptional: true, emptyOk: true }),
        info: (0, exports.orValidator)({
            "Total": (0, exports.objectValidator)({
                method: (0, exports.exactMatchValidator)(['Total']),
                parameters: exports.optionalEmptyObjectValidator,
            }),
        }),
        grouping: (0, exports.objectValidator)({
            Enduser: exports.booleanValidatorOptional,
            Cost: exports.booleanValidatorOptional,
            Gender: exports.booleanValidatorOptional,
            "Assigned To": exports.booleanValidatorOptional,
            Field: exports.stringValidatorOptionalEmptyOkay,
            Tags: exports.booleanValidatorOptional,
            Age: exports.booleanValidatorOptional,
            State: exports.booleanValidatorOptional,
            Phone: exports.booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: (0, exports.objectValidator)({
            interval: (0, exports.exactMatchValidator)(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: (0, exports.exactMatchValidator)(['Created At', 'Updated At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "Purchase Credits": (0, exports.objectValidator)({
        resource: (0, exports.exactMatchValidator)(['Purchase Credits']),
        filter: (0, exports.objectValidator)({}, { isOptional: true, emptyOk: true }),
        info: (0, exports.orValidator)({
            "Total": (0, exports.objectValidator)({
                method: (0, exports.exactMatchValidator)(['Total']),
                parameters: exports.optionalEmptyObjectValidator,
            }),
        }),
        grouping: (0, exports.objectValidator)({
            Enduser: exports.booleanValidatorOptional,
            Gender: exports.booleanValidatorOptional,
            "Assigned To": exports.booleanValidatorOptional,
            Field: exports.stringValidatorOptionalEmptyOkay,
            Tags: exports.booleanValidatorOptional,
            Age: exports.booleanValidatorOptional,
            State: exports.booleanValidatorOptional,
            Phone: exports.booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: (0, exports.objectValidator)({
            interval: (0, exports.exactMatchValidator)(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: (0, exports.exactMatchValidator)(['Created At', 'Updated At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "Tickets": (0, exports.objectValidator)({
        resource: (0, exports.exactMatchValidator)(['Tickets']),
        filter: (0, exports.objectValidator)({
            closeReasons: exports.listOfStringsValidatorOptionalOrEmptyOk,
            titles: exports.listOfStringsValidatorOptionalOrEmptyOk,
            userTags: exports.listOfStringsWithQualifierValidatorOptionalValuesEmptyOkay,
            enduserFields: enduserFieldsAnalyticsValidator,
            closedAtRange: exports.dateRangeOptionalValidator,
        }, { isOptional: true, emptyOk: true }),
        info: (0, exports.orValidator)({
            "Total": (0, exports.objectValidator)({
                method: (0, exports.exactMatchValidator)(['Total']),
                parameters: exports.optionalEmptyObjectValidator,
            }),
        }),
        grouping: (0, exports.objectValidator)({
            Owner: exports.booleanValidatorOptional,
            Outcome: exports.booleanValidatorOptional,
            Title: exports.booleanValidatorOptional,
            Enduser: exports.booleanValidatorOptional,
            Gender: exports.booleanValidatorOptional,
            "Assigned To": exports.booleanValidatorOptional,
            Field: exports.stringValidatorOptionalEmptyOkay,
            Tags: exports.booleanValidatorOptional,
            Age: exports.booleanValidatorOptional,
            State: exports.booleanValidatorOptional,
            Phone: exports.booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: (0, exports.objectValidator)({
            interval: (0, exports.exactMatchValidator)(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: (0, exports.exactMatchValidator)(['Created At', 'Updated At', 'Closed At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "Emails": (0, exports.objectValidator)({
        resource: (0, exports.exactMatchValidator)(['Emails']),
        filter: (0, exports.objectValidator)({
            direction: exports.stringValidatorOptional,
            templateIds: exports.listOfMongoIdStringValidatorOptionalOrEmptyOk,
            subjects: exports.listOfStringsValidatorOptionalOrEmptyOk,
            "Email Tags": exports.listOfStringsWithQualifierValidatorOptionalValuesEmptyOkay,
        }, { isOptional: true, emptyOk: true }),
        info: (0, exports.orValidator)({
            "Total": (0, exports.objectValidator)({
                method: (0, exports.exactMatchValidator)(['Total']),
                parameters: exports.optionalEmptyObjectValidator,
            }),
        }),
        grouping: (0, exports.objectValidator)({
            Enduser: exports.booleanValidatorOptional,
            Gender: exports.booleanValidatorOptional,
            "Assigned To": exports.booleanValidatorOptional,
            Field: exports.stringValidatorOptionalEmptyOkay,
            Tags: exports.booleanValidatorOptional,
            Age: exports.booleanValidatorOptional,
            State: exports.booleanValidatorOptional,
            Phone: exports.booleanValidatorOptional,
            "Email Tags": exports.booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: (0, exports.objectValidator)({
            interval: (0, exports.exactMatchValidator)(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: (0, exports.exactMatchValidator)(['Created At', 'Updated At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "Phone Calls": (0, exports.objectValidator)({
        resource: (0, exports.exactMatchValidator)(['Phone Calls']),
        filter: (0, exports.objectValidator)({}, { isOptional: true, emptyOk: true }),
        info: (0, exports.orValidator)({
            "Total": (0, exports.objectValidator)({
                method: (0, exports.exactMatchValidator)(['Total']),
                parameters: exports.optionalEmptyObjectValidator,
            }),
            "Duration": (0, exports.objectValidator)({
                method: (0, exports.exactMatchValidator)(['Duration']),
                parameters: exports.optionalEmptyObjectValidator,
            }),
        }),
        grouping: (0, exports.objectValidator)({
            Enduser: exports.booleanValidatorOptional,
            Gender: exports.booleanValidatorOptional,
            "Assigned To": exports.booleanValidatorOptional,
            Field: exports.stringValidatorOptionalEmptyOkay,
            Tags: exports.booleanValidatorOptional,
            Age: exports.booleanValidatorOptional,
            State: exports.booleanValidatorOptional,
            Phone: exports.booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: (0, exports.objectValidator)({
            interval: (0, exports.exactMatchValidator)(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: (0, exports.exactMatchValidator)(['Created At', 'Updated At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "SMS Messages": (0, exports.objectValidator)({
        resource: (0, exports.exactMatchValidator)(['SMS Messages']),
        filter: (0, exports.objectValidator)({
            direction: exports.stringValidatorOptional,
            messages: exports.listOfStringsValidatorOptionalOrEmptyOk,
            "SMS Tags": exports.listOfStringsWithQualifierValidatorOptionalValuesEmptyOkay,
        }, { isOptional: true, emptyOk: true }),
        info: (0, exports.orValidator)({
            "Total": (0, exports.objectValidator)({
                method: (0, exports.exactMatchValidator)(['Total']),
                parameters: exports.optionalEmptyObjectValidator,
            }),
        }),
        grouping: (0, exports.objectValidator)({
            Score: exports.booleanValidatorOptional,
            Enduser: exports.booleanValidatorOptional,
            Gender: exports.booleanValidatorOptional,
            "Assigned To": exports.booleanValidatorOptional,
            Field: exports.stringValidatorOptionalEmptyOkay,
            Tags: exports.booleanValidatorOptional,
            Age: exports.booleanValidatorOptional,
            State: exports.booleanValidatorOptional,
            Phone: exports.booleanValidatorOptional,
            "SMS Tags": exports.booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: (0, exports.objectValidator)({
            interval: (0, exports.exactMatchValidator)(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: (0, exports.exactMatchValidator)(['Created At', 'Updated At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "Medications": (0, exports.objectValidator)({
        resource: (0, exports.exactMatchValidator)(['Medications']),
        filter: (0, exports.objectValidator)({}, { isOptional: true, emptyOk: true }),
        info: (0, exports.orValidator)({
            "Total": (0, exports.objectValidator)({
                method: (0, exports.exactMatchValidator)(['Total']),
                parameters: exports.optionalEmptyObjectValidator,
            }),
        }),
        grouping: (0, exports.objectValidator)({
            Enduser: exports.booleanValidatorOptional,
            Gender: exports.booleanValidatorOptional,
            "Assigned To": exports.booleanValidatorOptional,
            Field: exports.stringValidatorOptionalEmptyOkay,
            Tags: exports.booleanValidatorOptional,
            Age: exports.booleanValidatorOptional,
            State: exports.booleanValidatorOptional,
            Phone: exports.booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: (0, exports.objectValidator)({
            interval: (0, exports.exactMatchValidator)(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: (0, exports.exactMatchValidator)(['Created At', 'Updated At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "Files": (0, exports.objectValidator)({
        resource: (0, exports.exactMatchValidator)(['Files']),
        filter: (0, exports.objectValidator)({
            names: exports.listOfStringsValidatorOptionalOrEmptyOk,
        }, { isOptional: true, emptyOk: true }),
        info: (0, exports.orValidator)({
            "Total": (0, exports.objectValidator)({
                method: (0, exports.exactMatchValidator)(['Total']),
                parameters: exports.optionalEmptyObjectValidator,
            }),
        }),
        grouping: (0, exports.objectValidator)({
            Enduser: exports.booleanValidatorOptional,
            Gender: exports.booleanValidatorOptional,
            "Assigned To": exports.booleanValidatorOptional,
            Field: exports.stringValidatorOptionalEmptyOkay,
            Tags: exports.booleanValidatorOptional,
            Age: exports.booleanValidatorOptional,
            State: exports.booleanValidatorOptional,
            Phone: exports.booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: (0, exports.objectValidator)({
            interval: (0, exports.exactMatchValidator)(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: (0, exports.exactMatchValidator)(['Created At', 'Updated At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "Meetings": (0, exports.objectValidator)({
        resource: (0, exports.exactMatchValidator)(['Meetings']),
        filter: (0, exports.objectValidator)({}, { isOptional: true, emptyOk: true }),
        info: (0, exports.orValidator)({
            "Total": (0, exports.objectValidator)({
                method: (0, exports.exactMatchValidator)(['Total']),
                parameters: exports.optionalEmptyObjectValidator,
            }),
            "Duration": (0, exports.objectValidator)({
                method: (0, exports.exactMatchValidator)(['Duration']),
                parameters: exports.optionalEmptyObjectValidator,
            }),
        }),
        grouping: (0, exports.objectValidator)({
            Host: exports.booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: (0, exports.objectValidator)({
            interval: (0, exports.exactMatchValidator)(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: (0, exports.exactMatchValidator)(['Created At', 'Updated At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "Journey Logs": (0, exports.objectValidator)({
        resource: (0, exports.exactMatchValidator)(['Journey Logs']),
        filter: (0, exports.objectValidator)({
            automationStepIds: exports.listOfMongoIdStringValidatorOptionalOrEmptyOk,
        }, { isOptional: true, emptyOk: true }),
        info: (0, exports.orValidator)({
            "Total": (0, exports.objectValidator)({
                method: (0, exports.exactMatchValidator)(['Total']),
                parameters: exports.optionalEmptyObjectValidator,
            }),
        }),
        grouping: (0, exports.objectValidator)({
            Enduser: exports.booleanValidatorOptional,
            Gender: exports.booleanValidatorOptional,
            "Assigned To": exports.booleanValidatorOptional,
            Field: exports.stringValidatorOptionalEmptyOkay,
            Tags: exports.booleanValidatorOptional,
            Age: exports.booleanValidatorOptional,
            State: exports.booleanValidatorOptional,
            Phone: exports.booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: (0, exports.objectValidator)({
            interval: (0, exports.exactMatchValidator)(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: (0, exports.exactMatchValidator)(['Created At', 'Updated At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "Orders": (0, exports.objectValidator)({
        resource: (0, exports.exactMatchValidator)(['Orders']),
        filter: (0, exports.objectValidator)({
            automationStepIds: exports.listOfMongoIdStringValidatorOptionalOrEmptyOk,
        }, { isOptional: true, emptyOk: true }),
        info: (0, exports.orValidator)({
            "Total": (0, exports.objectValidator)({
                method: (0, exports.exactMatchValidator)(['Total']),
                parameters: exports.optionalEmptyObjectValidator,
            }),
        }),
        grouping: (0, exports.objectValidator)({
            Enduser: exports.booleanValidatorOptional,
            Gender: exports.booleanValidatorOptional,
            "Assigned To": exports.booleanValidatorOptional,
            Field: exports.stringValidatorOptionalEmptyOkay,
            Tags: exports.booleanValidatorOptional,
            Age: exports.booleanValidatorOptional,
            State: exports.booleanValidatorOptional,
            Phone: exports.booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: (0, exports.objectValidator)({
            interval: (0, exports.exactMatchValidator)(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: (0, exports.exactMatchValidator)(['Created At', 'Updated At']),
        }, { isOptional: true, emptyOk: true })
    }),
});
exports.analyticsQueriesValidatorOptional = (0, exports.listValidatorOptionalOrEmptyOk)(exports.analyticsQueryValidator);
var _ANALYTICS_FRAME_TYPES = {
    Percentage: '',
};
exports.ANALYTICS_FRAME_TYPES = Object.keys(_ANALYTICS_FRAME_TYPES);
exports.analyticsFrameTypeValidator = (0, exports.exactMatchValidator)(exports.ANALYTICS_FRAME_TYPES);
var _ANALYTICS_QUERY_TYPES = {
    Endusers: true,
    "Calendar Events": true,
    "Form Responses": true,
    Purchases: true,
    "Purchase Credits": true,
    Tickets: true,
    "Phone Calls": true,
    "SMS Messages": true,
    Emails: true,
    Medications: true,
    Files: true,
    Meetings: true,
    "Journey Logs": true,
    Orders: true,
};
exports.ANALYTICS_QUERY_TYPES = Object.keys(_ANALYTICS_QUERY_TYPES);
exports.analyticsQueryTypeValidator = (0, exports.exactMatchValidator)(exports.ANALYTICS_QUERY_TYPES);
var _USER_CALL_ROUTING_BEHAVIORS = {
    "": '',
    All: '',
    Assigned: '',
    Unassigned: '',
};
exports.USER_CALL_ROUTING_BEHAVIORS = Object.keys(_USER_CALL_ROUTING_BEHAVIORS);
exports.userCallRoutingBehaviorValidator = (0, exports.exactMatchValidator)(exports.USER_CALL_ROUTING_BEHAVIORS);
exports.userUIRestrictionsValidator = (0, exports.objectValidator)({
    hideDashboard: exports.booleanValidatorOptional,
    hideInbox: exports.booleanValidatorOptional,
    hideTeamChat: exports.booleanValidatorOptional,
    hideEnduserChat: exports.booleanValidatorOptional,
    disableTicketDueDate: exports.booleanValidatorOptional,
    disableUnstructuredNotes: exports.booleanValidatorOptional,
    hideCareplan: exports.booleanValidatorOptional,
    hiddenFields: (0, exports.listValidatorOptionalOrEmptyOk)((0, exports.objectValidator)({
        field: exports.stringValidator,
        type: exports.mongoIdStringOptional,
    })),
    disabledFields: (0, exports.listValidatorOptionalOrEmptyOk)((0, exports.objectValidator)({
        field: exports.stringValidator,
        type: exports.mongoIdStringOptional,
    })),
    hideUnsubmittedForms: exports.booleanValidatorOptional,
    hideMergeEndusers: exports.booleanValidatorOptional,
    hideQueuedTicketsViewer: exports.booleanValidatorOptional,
    hideIncomingFaxesIcon: exports.booleanValidatorOptional,
    hideBulkEnduserActions: exports.booleanValidatorOptional,
    visibleIntegrations: exports.listOfStringsValidatorUniqueOptionalOrEmptyOkay,
}, { emptyOk: true });
var externalChatGPTMessageValidator = (0, exports.objectValidator)({
    role: (0, exports.exactMatchValidator)(['assistant', 'user']),
    content: exports.stringValidator5000,
});
exports.externalChatGPTMessagesValidator = (0, exports.listValidator)(externalChatGPTMessageValidator);
exports.sharedEnduserProfileViewBlockFields = {
    width: exports.stringValidator1000Optional,
    maxHeight: exports.numberValidatorOptional,
};
exports.enduserProfileViewBlockValidator = (0, exports.orValidator)({
    "Field Group": (0, exports.objectValidator)(__assign(__assign({}, exports.sharedEnduserProfileViewBlockFields), { type: (0, exports.exactMatchValidator)(['Field Group']), info: (0, exports.objectValidator)({
            title: exports.stringValidator100,
            fields: exports.listOfStringsValidator,
            displayFields: (0, exports.listValidatorOptionalOrEmptyOk)((0, exports.objectValidator)({
                field: exports.stringValidator,
                display: exports.stringValidator,
            }))
        }) })),
    "Form Responses": (0, exports.objectValidator)(__assign(__assign({}, exports.sharedEnduserProfileViewBlockFields), { type: (0, exports.exactMatchValidator)(['Form Responses']), info: (0, exports.objectValidator)({
            title: exports.stringValidator100,
            formId: exports.mongoIdStringOptional,
            fieldIds: exports.listOfMongoIdStringValidatorEmptyOk,
            showAllForms: exports.booleanValidatorOptional,
            expandable: exports.booleanValidatorOptional,
        }) })),
    "Zus Encounters": (0, exports.objectValidator)(__assign(__assign({}, exports.sharedEnduserProfileViewBlockFields), { type: (0, exports.exactMatchValidator)(['Zus Encounters']), info: (0, exports.objectValidator)({
            title: exports.stringValidator100,
        }) })),
    "Files": (0, exports.objectValidator)(__assign(__assign({}, exports.sharedEnduserProfileViewBlockFields), { type: (0, exports.exactMatchValidator)(['Files']), info: (0, exports.objectValidator)({
            title: exports.stringValidator100,
        }) })),
    "Tickets": (0, exports.objectValidator)(__assign(__assign({}, exports.sharedEnduserProfileViewBlockFields), { type: (0, exports.exactMatchValidator)(['Tickets']), info: (0, exports.objectValidator)({
            title: exports.stringValidator100,
        }) })),
    "Events": (0, exports.objectValidator)(__assign(__assign({}, exports.sharedEnduserProfileViewBlockFields), { type: (0, exports.exactMatchValidator)(['Events']), info: (0, exports.objectValidator)({
            title: exports.stringValidator100,
        }) })),
    "Labs": (0, exports.objectValidator)(__assign(__assign({}, exports.sharedEnduserProfileViewBlockFields), { type: (0, exports.exactMatchValidator)(['Labs']), info: (0, exports.objectValidator)({
            title: exports.stringValidator100,
        }) })),
    "Medications": (0, exports.objectValidator)(__assign(__assign({}, exports.sharedEnduserProfileViewBlockFields), { type: (0, exports.exactMatchValidator)(['Medications']), info: (0, exports.objectValidator)({
            title: exports.stringValidator100,
        }) })),
    "Diagnoses": (0, exports.objectValidator)(__assign(__assign({}, exports.sharedEnduserProfileViewBlockFields), { type: (0, exports.exactMatchValidator)(['Diagnoses']), info: (0, exports.objectValidator)({
            title: exports.stringValidator100,
        }) })),
    "Timeline": (0, exports.objectValidator)(__assign(__assign({}, exports.sharedEnduserProfileViewBlockFields), { type: (0, exports.exactMatchValidator)(['Timeline']), info: (0, exports.objectValidator)({
            title: exports.stringValidator100,
        }) })),
    "Shared Content": (0, exports.objectValidator)(__assign(__assign({}, exports.sharedEnduserProfileViewBlockFields), { type: (0, exports.exactMatchValidator)(['Shared Content']), info: (0, exports.objectValidator)({
            title: exports.stringValidator100,
        }) })),
});
exports.enduserProfileViewBlocksValidator = (0, exports.listValidator)(exports.enduserProfileViewBlockValidator);
var insuranceValidator = (0, exports.objectValidator)({
    name: exports.stringValidator100,
});
exports.insurancesValidator = (0, exports.listValidator)(insuranceValidator);
exports.phoneTreeEventValidator = (0, exports.orValidator)({
    "Start": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Start']),
        info: exports.optionalEmptyObjectValidator,
        parentId: exports.stringValidator1000Optional,
    }),
    "On Gather": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['On Gather']),
        parentId: exports.stringValidator100,
        info: (0, exports.objectValidator)({
            digits: exports.stringValidatorOptional,
            transcription: exports.stringValidatorOptional,
            handleNoInput: exports.booleanValidatorOptional,
        }),
    }),
    "If True": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['If True']),
        info: exports.optionalEmptyObjectValidator,
        parentId: exports.stringValidator1000Optional,
    }),
    "If False": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['If False']),
        info: exports.optionalEmptyObjectValidator,
        parentId: exports.stringValidator1000Optional,
    }),
    "If No Users Match": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['If No Users Match']),
        info: exports.optionalEmptyObjectValidator,
        parentId: exports.stringValidator1000Optional,
    }),
    "If No Users Answer": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['If No Users Answer']),
        info: exports.optionalEmptyObjectValidator,
        parentId: exports.stringValidator1000Optional,
    }),
});
exports.phoneTreeEventsValidator = (0, exports.listValidatorEmptyOk)(exports.phoneTreeEventValidator);
exports.phonePlaybackValidator = (0, exports.orValidator)({
    Play: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Play']),
        info: (0, exports.objectValidator)({
            url: exports.stringValidator5000,
            script: exports.stringValidatorOptional,
        }),
    }),
    Say: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Say']),
        info: (0, exports.objectValidator)({
            script: exports.stringValidator5000,
            url: exports.stringValidatorOptional,
        }),
    }),
});
exports.phonePlaybackValidatorOptional = (0, exports.orValidator)({
    Play: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Play']),
        info: (0, exports.objectValidator)({
            url: exports.stringValidator5000,
            script: exports.stringValidatorOptional,
        }),
    }),
    Say: (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Say']),
        info: (0, exports.objectValidator)({
            script: exports.stringValidator5000,
            url: exports.stringValidatorOptional,
        }),
    }),
    optional: exports.optionalEmptyObjectValidator,
}, { isOptional: true });
exports.phoneTreeActionValidator = (0, exports.orValidator)({
    // "Play": objectValidator<PhoneTreeActions["Play"]>({
    //   type: exactMatchValidator(['Play']),
    //   info: objectValidator<PhoneTreeActions["Play"]['info']>({
    //     playback: phonePlaybackValidator,
    //   }),
    // }), 
    "Gather": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Gather']),
        info: (0, exports.objectValidator)({
            playback: exports.phonePlaybackValidator,
            digits: exports.booleanValidator,
            speech: exports.booleanValidator,
            duration: exports.numberValidatorOptional,
        }),
    }),
    "Voicemail": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Voicemail']),
        info: (0, exports.objectValidator)({
            playback: exports.phonePlaybackValidator,
            journeyId: exports.mongoIdStringOptional,
        }),
    }),
    "Play Message": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Play Message']),
        info: (0, exports.objectValidator)({
            playback: exports.phonePlaybackValidator,
            journeyId: exports.mongoIdStringOptional,
            cancelAppointment: exports.booleanValidatorOptional,
            confirmAppointment: exports.booleanValidatorOptional,
            outcome: exports.stringValidatorOptionalEmptyOkay,
        }),
    }),
    "Dial Users": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Dial Users']),
        info: (0, exports.objectValidator)({
            userIds: exports.listOfMongoIdStringValidatorEmptyOk,
            playback: exports.phonePlaybackValidatorOptional,
            duration: exports.numberValidatorOptional,
        }),
    }),
    "Route Call": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Route Call']),
        info: (0, exports.objectValidator)({
            byCareTeamPrimary: exports.booleanValidatorOptional,
            byCareTeam: exports.booleanValidatorOptional,
            byRole: exports.stringValidatorOptional,
            byTags: exports.listOfStringsWithQualifierValidatorOptionalValuesEmptyOkay,
            prePlayback: exports.phonePlaybackValidatorOptional,
            playback: exports.phonePlaybackValidatorOptional,
            duration: exports.numberValidatorOptional,
            addToCareTeam: exports.booleanValidatorOptional,
            dialRecentAgent: exports.booleanValidatorOptional,
        }),
    }),
    "Forward Call": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Forward Call']),
        info: (0, exports.objectValidator)({
            to: exports.phoneValidator,
        }),
    }),
    "Conditional Split": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Conditional Split']),
        info: (0, exports.objectValidator)({
            weeklyAvailabilities: exports.weeklyAvailabilitiesValidator,
            timezone: exports.timezoneValidatorOptional,
            hasCareTeam: exports.booleanValidatorOptional,
            hasOneCareTeamMember: exports.booleanValidatorOptional,
        }),
    }),
    "Select Care Team Member": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Select Care Team Member']),
        info: (0, exports.objectValidator)({
            playback: exports.phonePlaybackValidatorOptional,
            playbackVoicemail: exports.phonePlaybackValidatorOptional,
        }, { emptyOk: true }),
    }),
    "Add to Queue": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Add to Queue']),
        info: (0, exports.objectValidator)({
            queueId: exports.mongoIdStringRequired,
            playback: exports.phonePlaybackValidatorOptional,
        }),
    }),
    "Route Extensions": (0, exports.objectValidator)({
        type: (0, exports.exactMatchValidator)(['Route Extensions']),
        info: (0, exports.objectValidator)({
            extensions: (0, exports.listValidator)((0, exports.objectValidator)({
                userId: exports.mongoIdStringRequired,
                input: exports.stringValidator,
            })),
            playback: exports.phonePlaybackValidatorOptional,
        }),
    }),
});
exports.phoneTreeNodeValidator = (0, exports.objectValidator)({
    id: exports.stringValidator100,
    action: exports.phoneTreeActionValidator,
    events: exports.phoneTreeEventsValidator,
    flowchartUI: exports.flowchartUIValidator,
});
exports.phoneTreeNodesValidator = (0, exports.listValidatorEmptyOk)(exports.phoneTreeNodeValidator);
var _PHONE_TREE_ENDUSER_CONDITIONS = {
    All: '',
    Unassigned: '',
};
exports.PHONE_TREE_ENDUSER_CONDITIONS = Object.keys(_PHONE_TREE_ENDUSER_CONDITIONS);
exports.phoneTreeEnduserConditionValidator = (0, exports.exactMatchValidator)(exports.PHONE_TREE_ENDUSER_CONDITIONS);
exports.formCustomizationValidator = (0, exports.objectValidator)({
    publicFormHTMLDescription: exports.stringValidator5000OptionalEmptyOkay,
    publicFormSubmitHTMLDescription: exports.stringValidator5000OptionalEmptyOkay,
    publicLabelPrefix: exports.stringValidator5000OptionalEmptyOkay,
    hideProgressBar: exports.booleanValidatorOptional,
    hideLogo: exports.booleanValidatorOptional,
    showRestartAtEnd: exports.booleanValidatorOptional,
    multiPagePublicQuestions: exports.booleanValidatorOptional,
    logoHeight: exports.numberValidatorOptional,
    hideBg: exports.booleanValidatorOptional,
    portalShowThanksAfterSubmission: exports.booleanValidatorOptional,
    publicFnameLabel: exports.stringValidatorOptionalEmptyOkay,
    publicLnameLabel: exports.stringValidatorOptionalEmptyOkay,
    publicDateOfBirthLabel: exports.stringValidatorOptionalEmptyOkay,
    publicEmailLabel: exports.stringValidatorOptionalEmptyOkay,
    publicGenderLabel: exports.stringValidatorOptionalEmptyOkay,
    publicPhoneLabel: exports.stringValidatorOptionalEmptyOkay,
    publicStateLabel: exports.stringValidatorOptionalEmptyOkay,
});
exports.languageValidator = (0, exports.objectValidator)({
    displayName: exports.stringValidator100,
    iso6391: exports.stringValidator100,
});
exports.tableViewColumnsValidator = (0, exports.listValidatorEmptyOk)((0, exports.objectValidator)({
    field: exports.stringValidator100,
    width: exports.numberValidatorOptional,
    type: exports.stringValidatorOptionalEmptyOkay,
    wrap: exports.stringValidatorOptional,
}));
exports.formFieldCalloutConditionsValidator = (0, exports.listValidatorOptionalOrEmptyOk)((0, exports.objectValidator)({
    comparison: (0, exports.exactMatchValidator)(['Equals']),
    value: exports.stringValidator1000,
}));
exports.endusersReportQueriesValidator = (0, exports.objectAnyFieldsValidator)((0, exports.objectValidator)({
    groupBy: exports.stringValidatorOptional,
    createdAtBuckets: (0, exports.listValidatorOptionalOrEmptyOk)(exports.dateValidator),
    range: exports.dateRangeOptionalValidator,
    activeSince: exports.dateOptionalOrEmptyStringValidator,
    fields: (0, exports.listValidatorOptionalOrEmptyOk)((0, exports.objectValidator)({ field: exports.stringValidator, value: exports.stringValidator })),
    mmddyyyyRangeField: exports.stringValidatorOptional,
    filter: exports.objectAnyFieldsAnyValuesValidator,
    // hasSubmittedForms: objectValidator<EnduserReportQuery['hasSubmittedForms']>({
    //   formIds: listOfStringsValidatorOptionalOrEmptyOk,
    //   range: dateRangeOptionalValidator,
    // }, { isOptional: true, emptyOk: true }),
    // hasNotSubmittedForms: objectValidator<EnduserReportQuery['hasNotSubmittedForms']>({
    //   formIds: listOfStringsValidatorOptionalOrEmptyOk,
    //   range: dateRangeOptionalValidator,
    // }, { isOptional: true, emptyOk: true }),
    // hasAppointment: objectValidator<EnduserReportQuery['hasAppointment']>({
    //   range: dateRangeOptionalValidator,
    // }, { isOptional: true, emptyOk: true }),
    // hasInboundCall: objectValidator<EnduserReportQuery['hasInboundCall']>({
    //   range: dateRangeOptionalValidator,
    // }, { isOptional: true, emptyOk: true }),
    // hasInboundChat: objectValidator<EnduserReportQuery['hasInboundChat']>({
    //   range: dateRangeOptionalValidator,
    // }, { isOptional: true, emptyOk: true }),
    // hasInboundEmail: objectValidator<EnduserReportQuery['hasInboundEmail']>({
    //   range: dateRangeOptionalValidator,
    // }, { isOptional: true, emptyOk: true }),
    // hasInboundSMS: objectValidator<EnduserReportQuery['hasInboundSMS']>({
    //   range: dateRangeOptionalValidator,
    // }, { isOptional: true, emptyOk: true }),
    // hasEngaged: objectValidator<EnduserReportQuery['hasEngaged']>({ // when provided, the above engagement queries are ignored
    //   range: dateRangeOptionalValidator,
    //   omitFormResponses: booleanValidatorOptional,
    //   formIds: listOfStringsValidatorOptionalOrEmptyOk,
    // }, { isOptional: true, emptyOk: true }),
}));
exports.formResponsesReportQueriesValidator = (0, exports.objectAnyFieldsValidator)((0, exports.objectValidator)({
    groupBy: exports.stringValidatorOptional,
    range: exports.dateRangeOptionalValidator,
    submittedAtRange: exports.dateRangeOptionalValidator,
    answers: exports.listOfStringsValidatorOptionalOrEmptyOk,
    submittedAtBuckets: (0, exports.listValidatorOptionalOrEmptyOk)(exports.dateValidator),
    mmddyyyyRangeField: exports.stringValidatorOptional,
    createdAtBuckets: (0, exports.listValidatorOptionalOrEmptyOk)(exports.dateValidator),
}));
exports.phoneCallsReportQueriesValidator = (0, exports.objectAnyFieldsValidator)((0, exports.objectValidator)({
    groupBy: exports.stringValidatorOptional,
    range: exports.dateRangeOptionalValidator,
    createdAtBuckets: (0, exports.listValidatorOptionalOrEmptyOk)(exports.dateValidator),
    mmddyyyyRangeField: exports.stringValidatorOptional,
}));
// duped in react components, forms, hooks
var isDateString = function (_s) {
    if (_s === void 0) { _s = ''; }
    var s = _s.trim();
    if (!/^\d{2}-\d{2}-\d{4}$/.test(s)) {
        return false;
    }
    // this seems to have inconsistent behavior in some mobile browsers, leave out for now
    // // ensure mm-dd-yyyy is actually valid
    // const [mm,dd,yyyy] = s.split('-').map(v => parseInt(v)) // don't shorthand, for radix argument of parseInt gets messed up
    // const d = Date.parse(`${yyyy}-${mm}-${dd}`) // this format should be explicitly supported by all implementations
    // if (isNaN(d)) return false
    return true;
};
exports.isDateString = isDateString;
exports.imageAttachmentValidator = (0, exports.objectValidator)({
    type: exports.stringValidator,
    url: exports.stringValidator,
});
exports.mmsMessageValidator = (0, exports.objectValidator)({
    message: exports.stringValidator1000,
    sender: exports.mongoIdStringRequired,
    timestamp: exports.nonNegNumberValidator,
    images: (0, exports.listValidatorOptionalOrEmptyOk)(exports.imageAttachmentValidator),
});
exports.mmsMessagesValidator = (0, exports.listValidator)(exports.mmsMessageValidator);
exports.groupMMSUserStateValidator = (0, exports.objectValidator)({
    numUnread: exports.nonNegNumberValidator,
    id: exports.stringValidator,
    markedUnread: exports.booleanValidatorOptional,
});
exports.groupMMSUserStatesValidator = (0, exports.listValidatorOptionalOrEmptyOk)(exports.groupMMSUserStateValidator);
var sortingFieldValidator = (0, exports.objectValidator)({
    ascending: exports.booleanValidator,
    field: exports.stringValidator1000,
    type: (0, exports.exactMatchValidator)(['date', 'number', 'string'])
});
exports.sortingFieldsValidator = (0, exports.listValidatorEmptyOk)(sortingFieldValidator);
var _DIAGNOSIS_TYPES = {
    ABF: '',
    ABJ: '',
    ABK: '',
    APR: '',
    BF: '',
    BJ: '',
    BK: '',
    DR: '',
    LOI: '',
    PR: '',
};
exports.DIAGNOSIS_TYPES = Object.keys(_DIAGNOSIS_TYPES);
exports.diagnosisTypeValidator = (0, exports.exactMatchValidator)(exports.DIAGNOSIS_TYPES);
exports.candidProcedureCodeValidator = (0, exports.objectValidator)({
    code: exports.stringValidator,
    quantity: exports.numberValidator,
    units: (0, exports.exactMatchValidator)(["MJ", "UN"]),
});
exports.diagnosisValidator = (0, exports.objectValidator)({
    type: exports.diagnosisTypeValidator,
    code: exports.stringValidator,
    procedureCodes: (0, exports.listValidatorOptionalOrEmptyOk)(exports.candidProcedureCodeValidator),
    modifiers: exports.listOfStringsValidatorOptionalOrEmptyOk,
});
exports.diagnosesValidator = (0, exports.listValidator)(exports.diagnosisValidator);
var enduserProfileWebhookValidator = (0, exports.objectValidator)({
    label: exports.stringValidator,
    url: exports.stringValidator,
    method: (0, exports.exactMatchValidator)(['Link', 'POST'], { isOptional: true })
});
exports.enduserProfileWebhooksValidator = (0, exports.listValidatorEmptyOk)(enduserProfileWebhookValidator);
exports.syncDirectionValidator = (0, exports.exactMatchValidator)(['Bidirectional', 'From Tellescope', 'To Tellescope']);
exports.fieldSyncValidator = (0, exports.objectValidator)({
    field: exports.stringValidator100,
    externalField: (0, exports.objectValidator)({
        id: exports.stringValidator100,
        options: (0, exports.listValidatorOptionalOrEmptyOk)((0, exports.objectValidator)({
            id: exports.stringValidator,
            value: exports.stringValidator,
        }))
    }),
    direction: exports.syncDirectionValidator,
    dateFormat: exports.stringValidatorOptional,
});
exports.fieldsSyncValidator = (0, exports.listValidatorEmptyOk)(exports.fieldSyncValidator);
exports.athenaSubscriptionTypeValidator = (0, exports.exactMatchValidator)(['patients', 'appointments', 'orders', 'chart/healthhistory/problems', 'obepisode']);
exports.athenaSubscriptionValidator = (0, exports.objectValidator)({
    type: exports.athenaSubscriptionTypeValidator,
    frequencyInMinutes: exports.nonNegNumberValidator,
    lastSyncedAt: exports.dateValidator,
});
exports.athenaSubscriptionsValidator = (0, exports.listValidatorEmptyOk)(exports.athenaSubscriptionValidator);
exports.fieldMappingValidator = (0, exports.objectValidator)({
    field: exports.stringValidator250,
    externalField: exports.stringValidator250,
    type: exports.stringValidator100,
});
exports.fieldMappingsValidator = (0, exports.listValidatorEmptyOk)(exports.fieldMappingValidator);
exports.analyticsFrameGroupingCategoryValidator = (0, exports.objectValidator)({
    category: exports.stringValidator250,
    keys: exports.listOfStringsValidatorEmptyOk,
});
exports.analyticsFrameGroupingCategoriesValidator = (0, exports.listValidatorEmptyOk)(exports.analyticsFrameGroupingCategoryValidator);
exports.bookingRestrictionsByTemplateValidator = (0, exports.listValidatorEmptyOk)((0, exports.objectValidator)({
    templateId: exports.mongoIdStringRequired,
    restrictions: (0, exports.objectValidator)({
        careTeam: exports.booleanValidatorOptional,
        state: exports.booleanValidatorOptional,
        hoursBefore: exports.numberValidatorOptional,
        hoursAfter: exports.numberValidatorOptional,
        tagsPortal: exports.listOfStringsValidatorOptionalOrEmptyOk,
        shouldOpenJoinLink: exports.booleanValidatorOptional,
    }),
}));
exports.enduserDiagnosisValidator = (0, exports.objectValidator)({
    id: exports.stringValidatorOptional,
    active: exports.booleanValidatorOptional,
    code: exports.stringValidator100,
    display: exports.stringValidatorOptionalEmptyOkay,
    end: exports.stringValidatorOptional,
    start: exports.stringValidatorOptional,
    externalId: exports.stringValidatorOptional,
    source: exports.stringValidatorOptional,
    references: exports.relatedRecordsValidatorOptional,
    createdAt: exports.dateValidatorOptional,
});
exports.recentViewerValidator = (0, exports.objectValidator)({
    id: exports.stringValidator100,
    at: exports.dateValidator,
});
exports.recentViewersValidator = (0, exports.listValidatorOptionalOrEmptyOk)(exports.recentViewerValidator);
//# sourceMappingURL=validation.js.map