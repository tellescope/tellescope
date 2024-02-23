import { ObjectId } from "bson"

import {
  CUD as CUDType,
  CustomUpdateOptions,
  Indexable,
  JSONType,
} from "@tellescope/types-utilities"

import {
  WEBHOOK_MODELS,
  WebhookSupportedModel, 

  FilterType,

  CustomField,
  Preference,
  JourneyState,
  JourneyStatePriority,
  EmailEncoding,
  ChatRoomType,
  AccountType,
  MessageTemplateType,
  MeetingStatus,
  SessionType,
  AttendeeInfo,
  MeetingInfo,
  CUDSubscription,
  FormField,
  AutomationEventType,
  AutomationActionType,
  AutomationEvent,
  AutomationAction,
  FormResponseAutomationEvent,
  AutomationForMessage,
  AutomationForFormRequest,
  AutomationForJourneyAndState,
  AutomationForWebhook,
  SendEmailAutomationAction,
  SendSMSAutomationAction,
  SendFormAutomationAction,
  SendWebhookAutomationAction,  
  AutomatedActionStatus,
  ChatAttachment,
  FormFieldType,
  FormResponseValue,
  CalendarEventReminderType,
  MessageTemplateMode,
  AutomationCondition,
  AutomationConditionType,
  AtJourneyStateAutomationCondition,
  ChatRoomUserInfo,
  RelatedRecord,
  SearchOptions,
  WithAutomationStepId,
  AfterActionEventInfo,
  AfterActionAutomationEvent,
  OnJourneyStartAutomationEvent,
  UnitOfTime,
  CreateTicketAutomationAction,
  FormUnsubmittedEvent,
  FormUnsubmittedEventInfo,
  CancelCondition,
  FormSubmitCancellationConditionInfo,
  SetEnduserStatusAutomationAction,
  SetEnduserStatusInfo,
  NotificationPreference,
  ObservationCategory,
  ObservationStatusCode,
  ObservationValue,
  TicketCompletedAutomationEvent,
  CreateTicketActionInfo,
  CreateTicketAssignmentStrategy,
  CreateTicketAssignmentStrategyType,
  TicketCompletedEventInfo,
  FormResponse,
  FormResponseValueAnswer,
  PreviousFormField,
  PreviousFormFieldAfterInfo,
  PreviousFormFieldAfter,
  PreviousFormFieldType,
  PreviousFormFieldRoot,
  FormResponseAnswerEmail,
  FormResponseAnswerFile,
  FormResponseAnswerMultipleChoice,
  FormResponseAnswerNumber,
  FormResponseAnswerPhone,
  FormResponseAnswerString,
  FormResponseAnswerSignature,
  FormResponseAnswerFileValue,
  FormResponseAnswerSignatureValue,
  OrganizationTheme,
  ManagedContentRecordType,
  FlowchartUI,
  PreviousFormFieldEquals,
  PreviousFormFieldEqualsInfo,
  IntegrationAuthentication,
  OAuth2AuthenticationFields,
  FormResponseAnswerRating,
  FormResponseAnswerDate,
  FormResponseAnswerRanking,
  FormFieldOptions,
  BlockType,
  Block,
  BlockContentH1,
  BlockContentHTML,
  BlockContentImage,
  BlockContentYoutube,
  BlockContentH2,
  PortalSettings,
  BlockContentPDF,
  DatabaseRecordFieldType,
  DatabaseRecordValues,
  DatabaseRecordField,
  OrganizationAccess,
  CalendarEventReminderInfoForType,
  CalendarEventReminderNotificationInfo,
  PortalPage,
  PortalBlockType,
  PortalBlockForType,
  CareTeamMemberPortalCustomizationInfo,
  EnduserTaskForEvent,
  EnduserFormResponseForEvent,
  StateCredentialInfo,
  BaseAvailabilityBlock,
  WeeklyAvailability,
  Timezone,
  TIMEZONE_MAP,
  FormType,
  FormResponseAnswerStringLong,
  ManagedContentRecordAssignmentType,
  GenericAttachment,
  CommunicationsChannel,
  AccessPermissions,
  AccessForResource,
  AccessType,
  BlockContentIFrame,
  OrganizationLimits,
  OrganizationSettings,
  GenericQuantityWithUnit,
  CustomEnduserFieldType,
  CustomEnduserFields,
  FormResponseAnswerDateString,
  TellescopeGender,
  AppointmentTerm,
  Currency,
  PaymentProcessor,
  PurchaseCreditInfo,
  PurchaseCreditInfoForType,
  PurcahseCreditType,
  Product,
  CancelConditions,
  FormsUnsubmittedEvent,
  FormResponsesAutomationEvent,
  JourneyContext,
  AnalyticsQueryType,
  AnalyticsQueryForType,
  AnalyticsQueryInfoForType,
  DateRange,
  AnalyticsQueryFilterForType,
  FormResponseAnswerGroup,
  FormSubField,
  FormResponseAnswerDescription,
  FormResponseAnswerTable,
  TableInputChoices,
  TableInputChoiceType,
  TableInputCell,
  CalendarEventPortalSettings,
  AvailabilityBlock,
  IndexUpdate,
  FormResponseAnswerAddress,
  ListQueryQualifier,
  AutomationTriggerEventType,
  AutomationTriggerEvents,
  AutomationTriggerActionType,
  AutomationTriggerActions,
  AutomationTriggerStatus,
  EnduserBuiltInField,
  AnalyticsQueryResultValue,
  AnalyticsQueryGroupingForType,
  AnalyticsQueryRange,
  AnalyticsQueryRangeInterval,
  AnalyticsQueryRangeKeyForType,
  SuperbillProvider,
  SuperbillProviderInfo,
  SuperbillPatientInfo,
  SuperbillLineItem,
  AnalyticsFrameType,
  VideoIntegrationType,
  VALID_STATES,
  ScheduledJourney,
  FormScoring,
  EmbeddingType,
  UserCallRoutingBehavior,
  UserUIRestrictions,
  ExternalChatGPTMessage,
  FormResponseAnswerTime,
  EnduserProfileViewBlocks,
  EnduserProfileViewBlockType,
  Form,
  Insurance,
  SetEnduserFieldsAutomationAction,
  EnduserFieldSetter,
  PhoneTreeEventType,
  PhoneTreeEvents,
  PhoneTreeNode,
  PhoneTreeActionType,
  PhoneTreeActions,
  PhonePlaybackType,
  PhonePlaybackInfo,
  Enduser,
  FormResponseAnswerStripe,
  PhoneTreeEnduserCondition,
  WaitForTriggerAutomationEvent,
  ShareContentAutomationAction,
  FormResponseAnswerDropdown,
  NotifyTeamAutomationAction,
  ListOfStringsWithQualifier,
  TicketActionType,
  TicketAction,
  TicketActions,
  FormResponseAnswerFiles,
  DatabaseRecordFields,
  FormResponseAnswerDatabaseSelect,
  DatabaseSelectResponse,
  AddEnduserTagsAutomationAction,
  AddToJourneyAutomationAction,
  FormResponseAnswerMedications,
  MedicationResponse,
  Language,
  RemoveFromJourneyAutomationAction,
  TableViewColumn,
  FormFieldCalloutCondition,
  FormFieldCalloutConditionComparison,
  EndusersReportQueries,
  EnduserReportQuery,
  ReportQuery,
  FormResponsesReportQuery,
  PhoneCallsReportQuery,
  TypedField,
  TicketSnooze,
  IterableSendEmailAutomationAction,
  IterableCustomEventAutomationAction,
  IterableFieldsMapping,
  ZendeskCreateTicketAutomationAction,
  CreateCarePlanAutomationAction,
  CompleteCarePlanAutomationAction,
  CustomDashboardViewBlock,
  ZusSyncAutomationAction,
  FormResponseAnswerRelatedContacts,
  AssignToQueueInfo,
  PreviousFormCompoundLogic,
  GroupMMSMessage,
  GroupMMSUserState,
  ImageAttachment,
  SortingField,
  TicketReminder,
  EnduserInsurance,
  InsuranceRelationship,
  FormResponseAnswerInsurance,
} from "@tellescope/types-models"
import {
  UserDisplayInfo,
} from "@tellescope/types-client"

import v from 'validator'
export const {
  isDate,
  isEmail,
  isMobilePhone,
  isSlug,
  isMongoId,
  isMimeType,
  isURL,
} = v
import isBoolean from "validator/lib/isBoolean" // better for tree-shaking in more configurations

// import {
//   BUSINESS_TYPE,
// } from "@tellescope/constants"

import {
  filter_object,
  is_defined,
  is_object,
  is_whitespace,
  object_is_empty,
  to_object_id,
} from "@tellescope/utilities"
import { 
  ALL_ACCESS,
  ASSIGNED_ACCESS,
  CANVAS_TITLE,
  DEFAULT_ACCESS,
  ENDUSER_FIELD_TYPES,
  FULLSCRIPT_INTEGRATIONS_TITLE,
  INSURANCE_RELATIONSHIPS,
  NO_ACCESS,
  OUTLOOK_INTEGRATIONS_TITLE,
  SQUARE_INTEGRATIONS_TITLE,
  ZENDESK_INTEGRATIONS_TITLE,
  ZOHO_TITLE,
  ZOOM_TITLE,
  ZUS_TITLE,
 } from "@tellescope/constants"

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
  unique?: boolean, // should list contain uniques
}  
export interface ValidatorOptionsForValue extends ValidatorOptions {
  listOf?: false;
}
export interface ValidatorOptionsForList extends ValidatorOptions {
  listOf: true;
}
export type ValidatorOptionsUnion = ValidatorOptionsForValue | ValidatorOptionsForList

export type EscapeWithOptions<R=any> = (o: ValidatorOptions) => (v: JSONType) => R
export type EscapeFunction<R=any> = (v: JSONType) => R
export type EscapeToList<R=any> = EscapeFunction<R[]>

export type EscapeBuilder <R=any> = {
  (o?: ValidatorOptionsForValue): EscapeFunction<R>;
  (o?: ValidatorOptionsForList):  EscapeFunction<R[]>;
}
export type ComplexEscapeBuilder <C,R=any> = (customization: C) => EscapeBuilder<R>

export type ValidatorDefinition <R=any> = {
  validate: EscapeBuilder<R>,
  getType: () => string | object,
  getExample: () => string | number | boolean | object,
}
export type ValidatorBuilder <R=any, C={}> = (options: ValidatorOptions & C) => ValidatorDefinition<R>

const EXAMPLE_OBJECT_ID = '60398b0231a295e64f084fd9'
const getTypeString = () => "string"
const getTypeNumber = () => "number"
const getExampleString = () => 'example string'
const getExampleObjectId = () => EXAMPLE_OBJECT_ID

export type InputValues <T> = { [K in keyof T]: JSONType }
export type InputValidation<T> = { [K in keyof T]: ValidatorDefinition }
export type InputValidationOld<T> = { [K in keyof T]: EscapeFunction }

export const MAX_FILE_SIZE = 1000000000 // 1gb megabytes in bytes
const DEFAULT_MAX_LENGTH = 50000
type BuildValidator_T = {
  (escapeFunction: EscapeFunction, options: ValidatorOptionsForList): EscapeToList;
  (escapeFunction: EscapeFunction, options: ValidatorOptionsForValue): EscapeFunction;
}
export const build_validator: BuildValidator_T = (escapeFunction, options={} as ValidatorOptionsUnion): EscapeToList | EscapeFunction => {
  const { 
    shouldTruncate, isOptional, toLower,
    emptyStringOk, emptyListOk, nullOk,
    isObject, isNumber, listOf, isBoolean,
    unique,
  } = options

  const minLength = options.minLength || 0
  const maxLength = options.maxLength || DEFAULT_MAX_LENGTH

  return (fieldValue: JSONType) => {
    // console.log(fieldValue)
    if (isOptional && fieldValue === undefined) return undefined
    if (isOptional && fieldValue === null && !nullOk) return undefined
    if (nullOk && fieldValue === null) return null
    if ((emptyStringOk || isOptional) && fieldValue === '') return ''
    if (!emptyStringOk && fieldValue === '') throw `Expecting non-empty string but got ${fieldValue}`
    if (isObject && typeof fieldValue !== 'object') {
      try {
        if (typeof fieldValue !== 'string') throw ''

        // be helpful and decodeURI if needed (%22 is invalid in JSON unless at least one '"" is present, so this should be safe)
        if (fieldValue && fieldValue.includes('%22') && !fieldValue.includes('"')) {
          fieldValue = JSON.parse(decodeURIComponent(fieldValue)) 
        } else {
          fieldValue = JSON.parse(fieldValue) // seems necessary for parsing query string
        }

      } catch(err) {
        throw `Expecting an object but got ${fieldValue}`
      }
    }
    if (isNumber && fieldValue === 0) return 0 // avoid falsey issues later

    if (!isOptional && !fieldValue && !(isBoolean && fieldValue === false)) {
      throw 'missing value'
    }

    // asserts for listOf === true, that fieldValue typed as array
    if (listOf && !Array.isArray(fieldValue)) throw `Expecting a list of values but got ${fieldValue}`

    if (listOf && (fieldValue as JSONType[])?.length === 0) {
      if (emptyListOk) return []
      else throw new Error("Expecting a list of values but list is empty")
    }

    if (toLower && typeof fieldValue === 'string') {
      fieldValue = fieldValue.toLowerCase()
    }

    let values = listOf && Array.isArray(fieldValue) ? fieldValue.filter(a => !!a) : [fieldValue]
    if (listOf && unique && Array.isArray(values)) {
      values = Array.from(new Set(values))
    }
    let escapedValues = []

    if (values.length > 1000) throw new Error("Arrays should not contain more than 1000 elements")

    for (let value of values) { 
        if (emptyStringOk && value === '') {
          escapedValues.push(''); continue;
        }
        let escapedValue = escapeFunction(value) // may throw exception, this is fine

        if (typeof escapedValue === 'string') { // is string
            if (escapedValue.length > maxLength) {
                if (shouldTruncate) {
                    escapedValue = escapedValue.substring(0, maxLength)
                } else {
                    throw `Length of escapedValue ${escapedValue} exceeds maxLength ${maxLength}`
                }
            }
            if (escapedValue.length < minLength) {
              throw new Error(`Length of escapedValue ${escapedValue} shorter than minLength ${minLength}`)
            }

            if (!isOptional && escapedValue.length === 0) {
                throw `Value has 0 length after escaping but field is required`
            }
        } else if (isObject && is_object(escapedValue)) { // is parsed JSON
            let parsed = JSON.stringify(escapedValue)
            if (parsed.length > maxLength) {
              throw `Length of JSON ${parsed} exceeds maxLength ${maxLength}`
            }
        } 
        escapedValues.push(escapedValue)
    }
    return listOf ? escapedValues : escapedValues[0]
  }
}

export const fieldsToValidationOld = <T>(fs: { [K in keyof T]: { validator: ValidatorDefinition, required?: boolean } }): InputValidationOld<T> => {
  const validation = {} as InputValidationOld<T>

  for (const f in fs) {
    validation[f] =  fs[f].validator.validate({ isOptional: !fs[f].required }) 
  }

  return validation
}


/********************************* VALIDATORS *********************************/
const optionsWithDefaults = (options={} as ValidatorOptions) => {
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
  }
}

export const binaryOrValidator = <A, B>(f1: EscapeFunction<A>, f2: EscapeFunction<B>): EscapeBuilder<A | B> => (o={}) => build_validator(
  value => {
    try {
      return f1(value)
    } catch(err) {
      return f2(value)
    }
  }, 
  { ...o, listOf: false }
)
export const orValidator = <T>(validators: { [K in keyof T]: ValidatorDefinition<T[K]> }, _o?: { isOptional?: boolean }): ValidatorDefinition<T[keyof T]> => ({
  validate: (o={}) => build_validator(
    value => {
      for (const field in validators) {
        const escape = validators[field]
        try {
          // console.log(field, value)
          return escape.validate()(value)
        } catch(err) { 
          // console.error(err)
          continue 
        }
      }
      throw `Value does not match any of the expected options: ${typeof value === 'object' ? JSON.stringify(value, null, 2) : ''}`
    },
    { ..._o, ...o, listOf: false }
  ),
  getExample: () => (Object.values(validators)[0] as ValidatorDefinition).getExample(),
  getType: () => [Object.values(validators).map(v => (v as ValidatorDefinition).getType())]
})

export const filterCommandsValidator: EscapeBuilder<FilterType> = (o={}) => build_validator(
  (value: any) => {
    if (!is_object(value)) { throw new Error("Expecting object value for FilterType") }
    
    if (value._exists && typeof value._exists === 'boolean' ) return { _exists: value._exists }
    if (value._gt && typeof value._gt === 'number' ) return { _gt: value._gt }
    if (value._gte && typeof value._gte === 'number' ) return { _gte: value._gte }
    if (value._lt && typeof value._lt === 'number' ) return { _lt: value._lt }
    if (value._lte && typeof value._gt === 'number' ) return { _lte: value._lte }
    if (value._all && Array.isArray(value._all)) return { _all: value._all }
    if (value._in && Array.isArray(value._in)) return { _in: value._in }
    
    if (Object.keys(value).find(k => k.startsWith('$'))) { // ignore any $ injections
      throw new Error(`Unknown filter value ${JSON.stringify(value)}`)
    }

    return value
  }, { ...o, isObject: true, listOf: false }
)

export const convertCommand = (key: string, value: any) => {
  if (key === '_exists') {
    return { $exists: value }
  } else if (key === '_lt') {
    return { $lt: value }
  } else if (key === '_lte') {
    return { $lte: value }
  } else if (key === '_gt') {
    return { $gt: value }
  } else if (key === '_gte') {
    return { $gte: value }
  } else if (key === '_all') {
    return { $all: value }
  } else if (key === '_in') {
    return { $in: value }
  }

  return null
}

export const convertCommands = (operators: Indexable<any>) => {
  const filterOperators = {} as Indexable

  for (const field in operators) {
    const value = operators[field] as FilterType
    const key = Object.keys(value)[0]

    const converted = convertCommand(key, value[key as keyof typeof value])
    if (converted) {
      filterOperators[field] = converted
    }
  }

  return filterOperators
}

interface ObjectOptions {
  emptyOk?: boolean,
  isOptional?: boolean,
  throwOnUnrecognizedField?: boolean,
}

export const objectValidatorOld = <T extends object>(i: InputValidationOld<Required<T>>, objectOptions={ emptyOk: true } as ObjectOptions): EscapeBuilder<T>  => (o={}) => build_validator(
  (object: any) => {
    const emptyOk = objectOptions.emptyOk ?? true
    const validated = {} as T

    if (!is_object(object)) {
      throw new Error(`Expected a non-null object by got ${object}`)
    }
    if (!emptyOk && object_is_empty(object)) {
      throw new Error(`Expected a non-empty object`)
    }

    // don't throw on unrecognized fields, just ignore/don't validate them
    if (objectOptions.throwOnUnrecognizedField) {
      const unrecognizedFields = []
      for (const field in object) {
        if (!(i as Indexable)[field]) {
          unrecognizedFields.push(field)
        } 
      }
      if (unrecognizedFields.length > 0) {
        throw new Error(`Got unexpected field(s) [${unrecognizedFields.join(', ')}]`)
      }
    }

    for (const field in i) {
      const value = (object as Indexable)[field] 
      const escaped = i[field](value) // may be required
      if (escaped === undefined) continue

      validated[field] = escaped
    }

    return validated
  }, { ...o, isObject: true, listOf: false }
)
export const listValidatorOld = <T>(b: EscapeFunction<T>): EscapeBuilder<T[]> => o => build_validator(
  b, { ...o, listOf: true }
)

const exampleObject = (fields: InputValidation<any>) => {
  const examples = {} as Indexable<string | number | boolean | object>

  for (const field in fields) {
    examples[field] = fields[field].getExample()
  }

  return examples
}
const typeObject = (fields: InputValidation<any>) => {
  const types = {} as Indexable<string | object>

  for (const field in fields) {
    types[field] = fields[field].getType()
  }

  return types
}

export const objectValidator = <T extends object | undefined>(i: InputValidation<Required<T>>, objectOptions={ emptyOk: true } as ObjectOptions): ValidatorDefinition<T>  => ({
  validate: (o={}) => build_validator(
    (object: any) => {
      const emptyOk = objectOptions.emptyOk ?? true
      // const isOptional = !!objectOptions.isOptional || o.isOptional
      const validated = {} as T

      if (!is_object(object)) {
        throw new Error(`Expected a non-null object by got ${object}`)
      }
      if (!emptyOk && object_is_empty(object)) {
        throw new Error(`Expected a non-empty object`)
      }

      // don't throw on unrecognized fields, just ignore/don't validate them
      if (objectOptions.throwOnUnrecognizedField) {
        const unrecognizedFields = []
        for (const field in object) {
          if (!(i as Indexable)[field]) {
            unrecognizedFields.push(field)
          } 
        }
        if (unrecognizedFields.length > 0) {
          throw new Error(`Got unexpected field(s) [${unrecognizedFields.join(', ')}]`)
        }
      }

      for (const field in i) {
        // console.log('validating field of object', field)
        const value = (object as Indexable)[field] 
        // console.log(field, value)
        const escaped = i[field].validate()(value) // may be required
        // console.log('escaped', escaped)
        if (escaped === undefined) continue

        (validated as Indexable)[field] = escaped
      }

      return validated
    }, { ...o, maxLength: 100000, isObject: true, listOf: false, isOptional: !!objectOptions.isOptional || o.isOptional }
  ),
  getExample: () => exampleObject(i),
  getType: () => typeObject(i),
})

export const listOfObjectsValidator = <T extends object>(i: InputValidation<Required<T>>, objectOptions={ emptyOk: true }): ValidatorDefinition<T[]> => ({
  validate: (o={}) => build_validator(
    (object: any) => {
      const emptyOk = !!objectOptions.emptyOk || o.emptyListOk
      const validated = {} as T

      if (!is_object(object)) {
        throw new Error(`Expected a non-null object by got ${object}`)
      }
      if (!emptyOk && object_is_empty(object)) {
        throw new Error(`Expected a non-empty object`)
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

      for (const field in i) {
        const value = (object as Indexable)[field] 

        const escaped = i[field].validate()(value) // may be required
        if (escaped === undefined) continue

        validated[field] = escaped
      }

      return validated
    }, { ...o, isObject: true, listOf: true, emptyListOk: !!objectOptions.emptyOk || o.emptyListOk }
  ),
  getExample: () => [exampleObject(i)], // don't forget list
  getType: () => [typeObject(i)] // don't forget list
})

export const objectAnyFieldsValidator = <T>(valueValidator?: ValidatorDefinition<T>): ValidatorDefinition<Indexable<T>> => ({
  validate: (o={}) => build_validator(
    (object: any) => {
      if (!is_object(object)) { throw new Error("Expected a non-null object by got ${object}") }

      const validated = {} as Indexable

      for (const field in object) {
        if (valueValidator) {
          validated[field] = valueValidator.validate()(object[field])
        } else if (typeof object[field] === 'number') {
          validated[field] = numberValidator.validate()(object[field])
        } else if (typeof object[field] === 'string') {
          validated[field] = stringValidator.validate()(object[field])
        } else if (object[field] === null) {
          validated[field] = null
        } else {
          if (valueValidator) {
            throw new Error(`Field ${field} is not a string or number`)
          }
          validated[field] = object[field]
        }
      }

      return validated
    }, { ...o, isObject: true, listOf: false }
  ),
  getExample: () => `{ "key": ${valueValidator?.getExample?.() ?? '"value"'} }`,
  getType: () => `{ "key": ${valueValidator?.getType?.() ?? 'string'} }`,
})
export const objectAnyFieldsAnyValuesValidator = objectAnyFieldsValidator()

export const optionalEmptyObjectValidator: ValidatorDefinition<object> = ({
  validate: (o={}) => build_validator(
    (object: any) => { 
      return {} 
    }, 
    { ...o, isOptional: true, isObject: true, listOf: false }
  ),
  getExample: () => `{ }`,
  getType: () => `{ }`,
})

export const optionalAnyObjectValidator: ValidatorDefinition<object> = ({
  validate: (o={}) => build_validator(
    (object: any) => { 
      if (typeof object !== 'object') throw "Must be an object value"
      return object
    }, 
    { ...o, isOptional: true, isObject: true, listOf: false }
  ),
  getExample: () => `{ }`,
  getType: () => `{ }`,
})


export const escapeString: EscapeWithOptions<string> = (o={}) => string => {
  if (typeof string !== "string") throw new Error('Expecting string value')

  if (o.trim) {
    string = string.trim()

    if (o.isOptional && string === '') {
      throw new Error(o.errorMessage || "String is only whitespace")
    }
  }
  return string
}

export const stringValidator: ValidatorDefinition<string> = {
  validate: (o={}) => build_validator(
    escapeString(o), { ...o, maxLength: o.maxLength ?? 1000, listOf: false  } 
  ),
  getExample: getExampleString,
  getType: getTypeString,
}
export const stringValidatorOptional: ValidatorDefinition<string> = {
  validate: (o={}) => build_validator(
    escapeString(o), { ...o, maxLength: o.maxLength ?? 1000, listOf: false, isOptional: true, emptyStringOk: true } 
  ),
  getExample: getExampleString,
  getType: getTypeString,
}
export const stringValidatorOptionalEmptyOkay: ValidatorDefinition<string> = {
  validate: (o={}) => build_validator(
    escapeString(o), { ...o, maxLength: o.maxLength ?? 1000, listOf: false, isOptional: true } 
  ),
  getExample: getExampleString,
  getType: getTypeString,
}
export const stringValidator5000OptionalEmptyOkay: ValidatorDefinition<string> = {
  validate: (o={}) => build_validator(
    escapeString(o), { ...o, maxLength: o.maxLength ?? 5000, listOf: false, isOptional: true } 
  ),
  getExample: getExampleString,
  getType: getTypeString,
}
export const stringValidator100: ValidatorDefinition<string> = {
  validate: (o={}) => build_validator(
    escapeString(o), { ...o, maxLength: 100, listOf: false  } 
  ),
  getExample: () => getExampleString,
  getType: () => getTypeString
}

export const stringValidator250: ValidatorDefinition<string> = {
  validate: (o={}) => build_validator(
    escapeString(o), { ...o, maxLength: 250, listOf: false  } 
  ),
  getExample: getExampleString,
  getType: getTypeString,
}
export const stringValidator1000: ValidatorDefinition<string> = {
  validate: (o={}) => build_validator(
    escapeString(o), { ...o, maxLength: 1000, listOf: false  } 
  ),
  getExample: getExampleString,
  getType: getTypeString,
}
export const stringValidator1000Optional: ValidatorDefinition<string> = {
  validate: (o={}) => build_validator(
    escapeString(o), { ...o, maxLength: 1000, listOf: false, isOptional: true, emptyStringOk: true,  } 
  ),
  getExample: getExampleString,
  getType: getTypeString,
}
export const stringValidator5000: ValidatorDefinition<string> = {
  validate: (o={}) => build_validator(
    escapeString(o), { ...o, maxLength: 5000, listOf: false  } 
  ),
  getExample: getExampleString,
  getType: getTypeString,
}
export const stringValidator5000EmptyOkay: ValidatorDefinition<string> = {
  validate: (o={}) => build_validator(
    escapeString(o), { ...o, maxLength: 5000, listOf: false, emptyStringOk: true } 
  ),
  getExample: getExampleString,
  getType: getTypeString,
}
export const stringValidator5000Optional: ValidatorDefinition<string> = {
  validate: (o={}) => build_validator(
    escapeString(o), { ...o, maxLength: 5000, listOf: false, isOptional: true, emptyStringOk: true } 
  ),
  getExample: getExampleString,
  getType: getTypeString,
}
export const stringValidator25000: ValidatorDefinition<string> = {
  validate: (o={}) => build_validator(
    escapeString(o), { ...o, maxLength: 25000, listOf: false  } 
  ),
  getExample: getExampleString,
  getType: getTypeString,
}
export const stringValidator100000EmptyOkay: ValidatorDefinition<string> = {
  validate: (o={}) => build_validator(
    escapeString(o), { ...o, maxLength: 100000, listOf: false, emptyStringOk: true } 
  ),
  getExample: getExampleString,
  getType: getTypeString,
}
export const stringValidator100000OptionalEmptyOkay: ValidatorDefinition<string> = {
  validate: (o={}) => build_validator(
    escapeString(o), { ...o, maxLength: 100000, isOptional: true, listOf: false, emptyStringOk: true } 
  ),
  getExample: getExampleString,
  getType: getTypeString,
}
export const stringValidator25000EmptyOkay: ValidatorDefinition<string> = {
  validate: (o={}) => build_validator(
    escapeString(o), { ...o, maxLength: 25000, listOf: false, emptyStringOk: true } 
  ),
  getExample: getExampleString,
  getType: getTypeString,
}
export const SMSMessageValidator: ValidatorDefinition<string> = {
  validate: (o={}) => build_validator(
    escapeString(o), { ...o, maxLength: 1200, listOf: false  } 
  ),
  getExample: getExampleString,
  getType: getTypeString,
}

export const listValidator = <T>(b: ValidatorDefinition<T>, _o?: ValidatorOptions | ValidatorOptionsForList): ValidatorDefinition<T[]> => ({
  validate: o => build_validator(b.validate(o as any), { ..._o, ...o, listOf: true }),
  getExample: () => [b.getExample()],
  getType: () => [b.getExample()],
})
export const listValidatorEmptyOk = <T>(b: ValidatorDefinition<T>, o?: ValidatorOptions): ValidatorDefinition<T[]> => ({
  validate: o => build_validator(b.validate(o as any), { ...o, listOf: true, emptyListOk: true }),
  getExample: () => [b.getExample()],
  getType: () => [b.getExample()],
})
export const listValidatorOptionalOrEmptyOk = <T>(b: ValidatorDefinition<T>, o?: ValidatorOptions): ValidatorDefinition<T[]> => ({
  validate: o => build_validator(b.validate(o as any), { ...o, listOf: true, emptyListOk: true, isOptional: true }),
  getExample: () => [b.getExample()],
  getType: () => [b.getExample()],
})
export const listValidatorUnique = <T>(b: ValidatorDefinition<T>, _o?: ValidatorOptions | ValidatorOptionsForList): ValidatorDefinition<T[]> => ({
  validate: o => build_validator(b.validate(o as any), { ..._o, ...o, listOf: true, unique: true }),
  getExample: () => [b.getExample()],
  getType: () => [b.getExample()],
})
export const listValidatorUniqueEmptyOkay = <T>(b: ValidatorDefinition<T>, _o?: ValidatorOptions | ValidatorOptionsForList): ValidatorDefinition<T[]> => ({
  validate: o => build_validator(b.validate(o as any), { ..._o, ...o, listOf: true, unique: true, emptyListOk: true }),
  getExample: () => [b.getExample()],
  getType: () => [b.getExample()],
})

export const listOfStringsValidator = listValidator(stringValidator) 
export const listOfStringsValidatorOptionalOrEmptyOk = listValidatorOptionalOrEmptyOk(stringValidator) 
export const listOfStringsValidatorEmptyOk = listValidatorEmptyOk(stringValidator) 
export const listOfObjectAnyFieldsAnyValuesValidator = listValidator(objectAnyFieldsAnyValuesValidator)

export const listOfUniqueStringsValidatorEmptyOk = listValidatorUniqueEmptyOkay(stringValidator) 

export const booleanValidatorBuilder: ValidatorBuilder<boolean> = (defaults) => ({
  validate: (options={}) => build_validator(
    boolean => {
      if (boolean === 'true') return true
      if (boolean === 'false') return false

      if (typeof boolean !== 'boolean') {
        throw new Error(options.errorMessage || "Invalid boolean")
      }
      return boolean
    }, 
    { ...defaults, ...options, isBoolean: true, listOf: false }
  ),
  getExample: () => true,
  getType: () => "boolean",
})
export const booleanValidator = booleanValidatorBuilder({ })
export const booleanValidatorOptional = booleanValidatorBuilder({ isOptional: true })

export const escapeMongoId: EscapeFunction<string> = (mongoId: any) => {
  if (typeof mongoId !== 'string') throw new Error('Expecting string id')
  if (!isMongoId(mongoId)) {
    throw new Error("Invalid id")
  }
  return mongoId
}
export const mongoIdValidator: ValidatorDefinition<ObjectId> = {
  validate: (o={}) => build_validator(
    s => to_object_id(escapeMongoId(s)), { ...optionsWithDefaults(o), maxLength: 100, listOf: false } 
  ),
  getType: getTypeString,
  getExample: getExampleObjectId,
}
export const buildMongoIdStringValidator: ValidatorBuilder<string> = (options) => ({
  validate: (o={}) => build_validator(
    escapeMongoId, { ...optionsWithDefaults({ ...options, ...o }), maxLength: 100, listOf: false } 
  ),
  getType: getTypeString,
  getExample: getExampleObjectId,
})

export const nullValidator: EscapeBuilder<null> = (o={}) => build_validator(
  v => {
    if (v !== null) throw Error('Expecting null')

    return v
  }, 
  { ...o, listOf: false }
) 

export const stringReadonlyValidator: ValidatorDefinition<string> = {
  validate: (o={}) => build_validator(
    s => { throw new Error("This field cannot be updated") }, 
    { ...o, isOptional: true, emptyStringOk: true, listOf: false }
  ),
  getType: getTypeString,
  getExample: () => "string (readonly)",
}

export const mongoIdRequired = mongoIdValidator.validate()
export const mongoIdOptional = mongoIdValidator.validate({ isOptional: true })
export const listOfMongoIdValidator = listValidator(mongoIdValidator)

export const mongoIdStringRequired = buildMongoIdStringValidator({ isOptional: false })
export const mongoIdStringOptional = buildMongoIdStringValidator({ isOptional: true })
export const listOfMongoIdStringValidator = listValidator(mongoIdStringRequired)
export const listOfMongoIdStringValidatorOptional = listValidator(mongoIdStringRequired, { isOptional: true })
export const listOfMongoIdStringValidatorEmptyOk = listValidatorEmptyOk(mongoIdStringRequired)
export const listOfMongoIdStringValidatorOptionalOrEmptyOk = listValidatorOptionalOrEmptyOk(mongoIdStringRequired)
export const sharedWithOrganizationIdsValidator = listValidatorEmptyOk(listValidator(mongoIdStringRequired))

export const slugValidator: ValidatorDefinition<string> = {
  validate: (o={}) => build_validator(
    s => {
      if (typeof s !== 'string') throw new Error("Expecting a string")
      if (!isSlug(s)) throw new Error(`Invalid format for ${s}`)
      return s
    }, 
    { ...optionsWithDefaults(o), maxLength: 10000, listOf: false },
  ),
  getType: getTypeString,
  getExample: () => 'this-is-a-slug',
}

export const first_letter_capitalized = (s='') => s.charAt(0).toUpperCase() + s.slice(1)
export const escape_name = (namestring: string) => namestring.replaceAll(/[^a-zA-Z0-9-_ /.]/g, '').substring(0, 100)

// enforces first-letter capitalization
export const nameValidator: ValidatorDefinition<string> = {
  validate: (options={}) => build_validator(
    name => {
      if (typeof name !== 'string') throw new Error('Expecting string value')

      // allow special characters, foreign language characters, accents, etc.
      name = name.substring(0, 100) // escape_name(name)  
      if (!name) throw new Error("Invalid name")

      return first_letter_capitalized(name) 
    }, 
    { ...options, maxLength: 100, trim: true, listOf: false }
  ),
  getExample: () => 'John',
  getType: getTypeString,
}

export const emailValidator: ValidatorDefinition<string> = {
  validate: (options={}) => build_validator(
    (email) => {
      if (typeof email !== 'string') throw new Error('Expecting string value')
      if (!isEmail(email)) { throw new Error(options.errorMessage || "Invalid email") }

      return email.toLowerCase()
    }, 
    { ...options, maxLength: 250, listOf: false }
  ),
  getExample: () => "example@tellescope.com",
  getType: getTypeString,
}
export const emailValidatorOptional: ValidatorDefinition<string> = {
  validate: (options={}) => build_validator(
    (email) => {
      if (typeof email !== 'string') throw new Error('Expecting string value')
      if (!isEmail(email)) { throw new Error(options.errorMessage || "Invalid email") }

      return email.toLowerCase()
    }, 
    { ...options, maxLength: 250, listOf: false, isOptional: true, emptyStringOk: true }
  ),
  getExample: () => "example@tellescope.com",
  getType: getTypeString,
}

export const emailValidatorEmptyOkay: ValidatorDefinition<string> = {
  validate: (options={}) => build_validator(
    (email) => {
      if (typeof email !== 'string') throw new Error('Expecting string value')
      if (!isEmail(email)) { throw new Error(options.errorMessage || "Invalid email") }

      return email.toLowerCase()
    }, 
    { ...options, maxLength: 250, emptyStringOk: true, listOf: false }
  ),
  getExample: () => "example@tellescope.com",
  getType: getTypeString,
}


export const numberValidatorBuilder: ValidatorBuilder<number, { lower: number, upper: number }> = ({ lower, upper, ...higherOptions }) => ({
  validate: (options={}) => {
    options.isNumber = true

    return build_validator(
    (number: any) => {
        number = Number(number) // ok to throw error!
        if (typeof number !== "number" || isNaN(number)) {
          throw new Error(options.errorMessage || `Not a valid number`)
        }
        if (!(lower || upper)) return number

        if (!(number >= lower && number <= upper)) {
          throw new Error(options.errorMessage || `Not a valid number for [${lower}-${upper}]`)
        }
        return number
      }, 
      { ...optionsWithDefaults({ ...higherOptions, ...options }), listOf: false, }
    )
  },
  getExample: () => lower, // `a number from ${lower} to ${upper}`,
  getType: getTypeNumber,
})

export const nonNegNumberValidator = numberValidatorBuilder({ lower: 0, upper: 10000000000000 }) // max is 2286 in UTC MS
export const numberValidator = numberValidatorBuilder({ lower: -10000000000000, upper: 10000000000000 }) // max is 2286 in UTC MS
export const numberValidatorOptional = numberValidatorBuilder({ lower: -10000000000000, upper: 10000000000000, isOptional: true, emptyStringOk: true }) // max is 2286 in UTC MS
export const fileSizeValidator = numberValidatorBuilder({ lower: 0, upper: MAX_FILE_SIZE })

export const numberOrStringValidatorEmptyOkay = orValidator({
  number: numberValidator,
  string: stringValidator5000EmptyOkay,
})
export const numberOrStringValidatorOptional = orValidator({
  number: numberValidatorOptional,
  string: stringValidatorOptional
})

export const dateValidator: ValidatorDefinition<Date> = {
  validate: (options={}) => build_validator(
    (date: any) => {
      if (isDate(date)) throw new Error(options.errorMessage || "Invalid date") 

      return new Date(date)
    }, 
    { ...options, maxLength: 250, listOf: false }
  ),
  getExample: () => new Date().toISOString(),
  getType: () => "Date",
}
export const dateOptionalOrEmptyStringValidator: ValidatorDefinition<Date> = {
  validate: (options={}) => build_validator(
    (date: any) => {
      if (date === '') return date
      // coerce to string in case date is an actual Date object
      if (isDate(date?.toString())) throw new Error(options.errorMessage || "Invalid date") 

      return new Date(date)
    }, 
    { ...options, maxLength: 250, emptyStringOk: true, isOptional: true, listOf: false }
  ),
  getExample: () => new Date().toISOString(),
  getType: () => "Date",
}
export const dateValidatorOptional: ValidatorDefinition<Date> = {
  validate: (options={}) => build_validator(
    (date: any) => {
      if (isDate(date)) throw new Error(options.errorMessage || "Invalid date") 

      return new Date(date)
    }, 
    { ...options, maxLength: 250, listOf: false, isOptional: true, emptyStringOk: true }
  ),
  getExample: () => new Date().toISOString(),
  getType: () => "Date",
}
export const dateRangeValidator = objectValidator<DateRange>({
  from: dateOptionalOrEmptyStringValidator,
  to: dateOptionalOrEmptyStringValidator,
})
export const dateRangeOptionalValidator = objectValidator<DateRange>({
  from: dateOptionalOrEmptyStringValidator,
  to: dateOptionalOrEmptyStringValidator,
}, { isOptional: true, emptyOk: true })


export const exactMatchValidator = <T extends string | null>(matches: T[], options?: ValidatorOptions): ValidatorDefinition<T> => ({
  validate: (o={}) => build_validator(
    (match: JSONType) => {
      if (matches.filter(m => m === match).length === 0) {
        throw new Error(`Value must match one of ${matches}`)
      }
      return match
    }, 
    { ...o, nullOk: matches.includes(null as any), listOf: false }
  ),
  getExample: () => matches[0] ?? 'null',
  getType: getTypeString,
})
export const exactMatchValidatorOptional = <T extends string | null>(matches: T[]): ValidatorDefinition<T> => ({
  validate: (o={}) => build_validator(
    (match: JSONType) => {
      if (matches.filter(m => m === match).length === 0) {
        throw new Error(`Value must match one of ${matches}`)
      }
      return match
    }, 
    { ...o, nullOk: matches.includes(null as any), listOf: false, isOptional: true }
  ),
  getExample: () => matches[0] ?? 'null',
  getType: getTypeString,
})
export const exactMatchListValidator = <T extends string | null>(matches: T[]) => listValidator(exactMatchValidator(matches))

// export for backwards compatibility after moving to types-models
export { VALID_STATES }
export const stateValidator = exactMatchValidator(VALID_STATES)
export const stateValidatorOptional = exactMatchValidatorOptional(VALID_STATES)

export const journeysValidator: ValidatorDefinition<Indexable> = {
  validate: (options={}) => build_validator(
    (journeys) => {
      if (typeof journeys !== 'object') {
        throw new Error('Expecting an object')
      }

      const mIdValidator = mongoIdValidator.validate()
      const stateValidator   = stringValidator.validate({ isOptional: true, maxLength: 75, errorMessage: "Journey state names may not exceed 75 characters" })
      for (const j in journeys) {
        mIdValidator(j);
        (journeys as Indexable)[j] = stateValidator(journeys[j as keyof typeof journeys]);
      }
      return journeys
    }, 
    { ...options, isObject: true, listOf: false }
  ),
  getExample: () => ({ [EXAMPLE_OBJECT_ID]: "status" }),
  getType: () => ({ string: "string" }),
}

export const escape_phone_number = (p='') => p.replace(/[^\d+]/g, '')

export const phoneValidator: ValidatorDefinition<string> = {
  validate: (options={}) => build_validator(
    phone => {
      if (typeof phone !== "string") throw new Error(`Expecting phone to be string but got ${phone}`)

      let escaped = escape_phone_number(phone) 
      if (escaped.length < 10) throw new Error(`Phone number must be at least 10 digits`)

      escaped = escaped.startsWith('+') ? escaped
              : escaped.length === 10   ? '+1' + escaped // assume US country code for now
                                        : "+"  + escaped // assume country code provided, but missing leading +

      if (!isMobilePhone(escaped, 'any', { strictMode: true })) {
        throw `Invalid phone number: ${phone}`
      }

      return escaped
    }, 
    { ...options, maxLength: 25, listOf: false }
  ),
  getExample: () => "+15555555555",
  getType: getTypeString,
}
export const phoneValidatorOptional: ValidatorDefinition<string> = {
  validate: (options={}) => build_validator(
    phone => {
      if (typeof phone !== "string") throw new Error(`Expecting phone to be string but got ${phone}`)

      let escaped = escape_phone_number(phone) 
      if (escaped.length < 10) throw new Error(`Phone number must be at least 10 digits`)

      escaped = escaped.startsWith('+') ? escaped
              : escaped.length === 10   ? '+1' + escaped // assume US country code for now
                                        : "+"  + escaped // assume country code provided, but missing leading +

      if (!isMobilePhone(escaped, 'any', { strictMode: true })) {
        throw `Invalid phone number: ${phone}`
      }

      return escaped
    }, 
    { ...options, maxLength: 25, listOf: false, isOptional: true, emptyStringOk: true }
  ),
  getExample: () => "+15555555555",
  getType: getTypeString,
}

export const fileTypeValidator: ValidatorDefinition<string> = {
  validate: (options={}) => build_validator(
    (s: any) => {
      if (typeof s !== 'string') throw new Error("fileType must be a string")
      if (!isMimeType(s)) throw new Error(`${s} is not a valid file type`)

      return s
    }, 
    { 
      ...options, 
      emptyStringOk: true,  // allow empty string for unknown file types
      listOf: false,
    }
  ),
  getExample: () => 'text/plain',
  getType: getTypeString,
}
export const urlValidator: ValidatorDefinition<string> = {
  validate: (options={}) => build_validator(
    (s: any) => {
      if (typeof s !== 'string') throw new Error("URL must be a string")
      if (!isURL(s)) throw new Error(`${s} is not a valid URL`)

      return s
    }, 
    { ...options, listOf: false }
  ),
  getExample: () => '"https://www.tellescope.com"',
  getType: getTypeString,
}

export const safeBase64Validator: ValidatorDefinition<string> = {
  validate: (options={}) => build_validator(
    (sb64: any) => {
      if (typeof sb64 !== 'string') throw new Error("Expecting string")

      // https://stackoverflow.com/questions/12930007/how-to-validate-base64-string-using-regex-in-javascript
      // regex with = + and / replaced as get_random_base64_URL_safe 
      if (!/^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2}..|[A-Za-z0-9_-]{3}.)?$/.test(sb64)) {
        throw `Invalid safe base64`
      }
      return sb64
    },
    { ...options, listOf: false }
  ),
  getExample: () => '129vjas0fkj1234jgfmnaef',
  getType: getTypeString,
}

export const subdomainValidator: ValidatorDefinition<string> = {
  validate: (options={}) => build_validator(
    subdomain => {
      if (typeof subdomain !== 'string') throw new Error("Expecting string value") 

      subdomain = subdomain.toLowerCase()
      if (subdomain.startsWith('-')) {
        subdomain = subdomain.substring(1)
      }
      while (subdomain.endsWith('-')) {
        subdomain = subdomain.substring(0, subdomain.length - 1)
      }

      subdomain = subdomain.replace(/[^a-zA-Z\d-]/g, '')

      return subdomain
    }, 
    { ...options, maxLength: 50, listOf: false }
  ),
  getExample: () => 'example',
  getType: getTypeString,
}

type FileResponse = { type: 'file', name: string, secureName: string }
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
export const fileResponseValidator = objectValidator<FileResponse>({
  type: exactMatchValidator(['file']),
  name: stringValidator1000,
  secureName: stringValidator250,
})

type SignatureResponse = { type: 'signature', signed: string | null, fullName: string }
export const signatureResponseValidator = objectValidator<SignatureResponse>({
  type: exactMatchValidator(['signature']),
  fullName: stringValidator100,
  signed: booleanValidator, 
})


type MultipleChoiceOptions = {
  choices: string[],
  other: boolean,
  radio: boolean,
}

const DEFAULT_ENDUSER_FIELDS = [
  '_id', 'email', 'phone', 'fname', 'lname', 'journeys', 'tags', 'preference'
]

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

const _FORM_FIELD_TYPES: { [K in FormFieldType]: any } = {
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
  Dropdown: '',
  "Database Select": '',
  Medications: '',
  "Related Contacts": "",
  'Insurance': '',
}
export const FORM_FIELD_TYPES = Object.keys(_FORM_FIELD_TYPES) as FormFieldType[]
export const formFieldTypeValidator = exactMatchValidator<FormFieldType>(FORM_FIELD_TYPES)

export const FORM_FIELD_VALIDATORS_BY_TYPE: { [K in FormFieldType | 'userEmail' | 'phoneNumber']: (value?: FormResponseValueAnswer[keyof FormResponseValueAnswer], options?: any, isOptional?: boolean) => any } = {
  'Related Contacts': objectAnyFieldsAnyValuesValidator.validate(),
  'Insurance': objectAnyFieldsAnyValuesValidator.validate(),
  'Address': objectAnyFieldsAnyValuesValidator.validate(),
  'Database Select': objectAnyFieldsAnyValuesValidator.validate(),
  'Time': stringValidator.validate({ maxLength: 100 }),
  'Stripe': stringValidator.validate({ maxLength: 100 }),
  'Medications': listValidator(objectAnyFieldsAnyValuesValidator).validate(),
  Dropdown: listOfStringsValidator.validate({ emptyListOk: true }),
  'description': g => '',
  'Table Input': (g) => Array.isArray(g) ? g : [],
  'Question Group': (g) => Array.isArray(g) ? g : [],
  'string': stringValidator.validate({ maxLength: 1000, emptyStringOk: true, errorMessage: "Response must not exceed 1000 characters" }),
  'stringLong': stringValidator.validate({ maxLength: 10000, emptyStringOk: true, errorMessage: "Response must not exceed 10000 characters" }),
  'number': numberValidator.validate({ errorMessage: "Response must be a number" }),
  'email': emailValidator.validate(),

  'userEmail': emailValidator.validate(), 
  'phone': phoneValidator.validate(),
  'phoneNumber': phoneValidator.validate(), // backwards compatibility with old field name for phone

  "date": dateValidator.validate(),
  "dateString": stringValidator100.validate(),
  "ranking": listOfStringsValidator.validate(),
  "rating": numberValidator.validate(),

  // fileInfo: FileResponse
  'file': (fileInfo: any, _, isOptional) => {
    if (isOptional && (!fileInfo || object_is_empty(fileInfo))) { 
      return { type: 'file', secureName: null }
    }
    return fileResponseValidator.validate()(fileInfo)
  },
  'files': fs => fs,
  'signature': (sigInfo: any, _, isOptional) => {
    if (isOptional && (!sigInfo || object_is_empty(sigInfo)))  {
      return { type: 'signature', signed: null }
    }
    return signatureResponseValidator.validate()(sigInfo)
  },

  // choiceInfo: { indexes: [], otherText?: string }  
  'multiple_choice': (choiceInfo: any, fieldOptions: MultipleChoiceOptions, isOptional) => {
    if (isOptional && !choiceInfo) return []

    const { indexes, otherText } = choiceInfo

    if (!indexes || indexes.length === undefined) { // no indexes (or empty array) provided
      throw new Error('At least 1 choice is required')
    }

    const parsed = []
    for (const i of indexes) {
      if (typeof i !== 'number') throw new Error(`Choice ${i} is not a valid index`)
      if (i < 0 || i >= fieldOptions.choices.length) throw new Error(`Choice ${i} is not a valid index`)

      parsed.push(fieldOptions.choices[i])
    }
    if (otherText && fieldOptions.other === true) parsed.push(otherText)
    // todo: add length limit to otherText?

    if (parsed.length === 0) throw new Error(`No options provided`)
    if (parsed.length > 1 && fieldOptions.radio === true) throw new Error(`Only 1 choice is allowed`)


    return parsed
   },
}
export const fieldsValidator: ValidatorDefinition<Indexable<string | CustomField>> = {
  validate: (options={}) => build_validator(
    (fields: any) => {
      if (!is_object(fields)) throw new Error("Expecting an object")

      for (const k in fields) {
        if (DEFAULT_ENDUSER_FIELDS.includes(k)) throw new Error(`key ${k} conflicts with a built-in field.`)
        if (k.startsWith('_')) throw new Error("Fields that start with '_' are not allowed")
        if (is_whitespace(k)) {
          delete fields[k]
          continue
        }

        if (k.length > 256) throw new Error(`key ${k} is greater than 256 characters`)

        const val = fields[k]
        if (typeof val === 'string') {
          if (val.length > 512) fields[k] = val.substring(0, 512)
          continue
        } else if (typeof val === 'number' || val === null || typeof val === 'boolean') {
          continue // nothing to restrict on number type yet
        } else if (typeof val === 'object') {
          if (JSON.stringify(val).length > 10000) throw new Error(`object value for key ${k} exceeds the maximum length of 10000 characters in string representation`)
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
        } else {
          throw new Error(`Expecting value to be a string or object but got ${typeof val} for key ${k}`)
        }
      }

      return fields
    }, 
    { ...options, maxLength: 100000, isObject: true, listOf: false }
  ),
  getExample: () => `{}`,
  getType: () => `{}`,
}

export const preferenceValidator = exactMatchValidator<Preference>(['email', 'sms', 'call', 'chat'])

export const updateOptionsValidator = objectValidator<CustomUpdateOptions>({
  replaceObjectFields: booleanValidatorOptional,
  dontSendWebhook: booleanValidatorOptional,
}, { isOptional: true })

export const journeyStatePriorityValidator = exactMatchValidator<JourneyStatePriority>(["Disengaged", "N/A", "Engaged"])

export const journeyStateValidator = objectValidator<JourneyState>({
  name: stringValidator100,
  priority: journeyStatePriorityValidator, // deprecated
  description: stringValidatorOptional, // deprecated
  requiresFollowup: booleanValidatorOptional, // deprecated
})
// deprecated
// export const journeyStateUpdateValidator = objectValidator<JourneyState>({
//   name: stringValidator100({ isOptional: true }),
//   priority: journeyStatePriorityValidator({ isOptional: true }),
//   description: stringValidator({ isOptional: true }),
//   requiresFollowup: booleanValidator({ isOptional: true }),
// })
export const journeyStatesValidator = listValidator(journeyStateValidator)

export const emailEncodingValidator = exactMatchValidator<EmailEncoding>(['', 'base64'])

export const validateIndexable = <V>(keyValidator: EscapeFunction<string | number>, valueValidator: EscapeFunction<V>): EscapeBuilder<{ [index: string | number]: V }> => o => build_validator(
  v => {
    if (!is_object(v)) throw new Error("Expecting an object")

    const validated = {} as Indexable

    for (const k in v) {
      validated[keyValidator(k)] = valueValidator(v[k as keyof typeof v])
    }

    return validated
  },
  { ...o, isObject: true, listOf: false }
)
export const indexableValidator = <V>(keyValidator: ValidatorDefinition<string>, valueValidator: ValidatorDefinition<V>): ValidatorDefinition<{ [index: string]: V }> => ({
  validate: validateIndexable(keyValidator.validate(), valueValidator.validate()),
  getExample: () => `{ ${keyValidator.getExample()}: ${valueValidator.getExample()} }`,
  getType: () => `{ ${keyValidator.getType()}: ${valueValidator.getType()} }`,
})
export const indexableNumberValidator = <V>(keyValidator: ValidatorDefinition<number>, valueValidator: ValidatorDefinition<V>): ValidatorDefinition<{ [index: number]: V }> => ({
  validate: validateIndexable(keyValidator.validate(), valueValidator.validate()),
  getExample: () => `{ ${keyValidator.getExample()}: ${valueValidator.getExample()} }`,
  getType: () => `{ ${keyValidator.getType()}: ${valueValidator.getType()} }`,
})

export const rejectionWithMessage: EscapeBuilder<undefined> = o => build_validator(
  v => { throw new Error(o?.errorMessage || 'This field is not valid') }, 
  { ...o, isOptional: true, listOf: false, }
)

export const numberToDateValidator = indexableNumberValidator(numberValidator, dateValidator)
export const idStringToDateValidator = indexableValidator(mongoIdStringRequired, dateOptionalOrEmptyStringValidator)

// todo: move preference to FIELD_TYPES with drop-down option in user-facing forms
const FIELD_TYPES = ['string', 'number', 'email', 'phone', 'multiple_choice', 'file', 'signature']
const VALIDATE_OPTIONS_FOR_FIELD_TYPES = {
  'multiple_choice': {
    choices: listOfStringsValidator,
    radio: booleanValidator,
    other: booleanValidatorOptional,
    REQUIRED: ['choices', 'radio'],
  }
}
export const RESERVED_INTAKE_FIELDS = ['_id', 'id', 'externalId', 'phoneConsent', 'emailConsent', 'tags', 'journeys', 'updatedAt', 'preference', 'assignedTo', 'lastCommunication']

export const INTERNAL_NAME_TO_DISPLAY_FIELD = { 
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
}

const isFormField = (f: JSONType, fieldOptions={ forUpdate: false }) => {
  if (!is_object(f)) throw new Error("Expecting an object")
  const field = f as Indexable

  const { forUpdate } = fieldOptions
  if (forUpdate) {
    const { isOptional, type, title, description, intakeField, options } = field 
    if (
      object_is_empty(filter_object({
        isOptional, type, title, description, intakeField, options
      }, is_defined))
    )
    { 
      throw `No update provided` 
    }
  } 

  if (forUpdate === false || field.isOptional !== undefined)
    field.isOptional = !!field.isOptional // coerce to bool, defaulting to false (required)


  if (!forUpdate && !field.type) throw `field.type is required` // fieldName otherwise given as 'field' in validation for every subfield
  if (field.type) exactMatchValidator(FIELD_TYPES).validate(field.type)

  if (!forUpdate && !field.title) throw `field.title is required` // fieldName otherwise given as 'field' in validation for every subfield
  if (field.title) {
    field.title = stringValidator.validate({ 
      maxLength: 100, 
      errorMessage: "field title is required and must not exceed 100 characters" 
    })(field.title)
  }

  if (!forUpdate || field.description !== undefined){ // don't overwrite description on update with ''
    field.description = stringValidator.validate({ 
      isOptional: true,
      maxLength: 500, 
      errorMessage: "field description must be under 500 characters" 
    })(field.description) || ''
  }

  field.options = field.options || {} // ensure at least an empty object is provided
  if (VALIDATE_OPTIONS_FOR_FIELD_TYPES[field.type as keyof typeof VALIDATE_OPTIONS_FOR_FIELD_TYPES] !== undefined) {
    if (typeof field.options !== 'object') throw new Error(`Expected options to be an object but got ${typeof field.options}`)

    const validators = VALIDATE_OPTIONS_FOR_FIELD_TYPES[field.type as keyof typeof VALIDATE_OPTIONS_FOR_FIELD_TYPES]
    const requiredOptions = validators.REQUIRED
    if (requiredOptions.length > Object.keys(field.options).length) {
      for (const k of requiredOptions) {
        if (field.options[k] === undefined) {
          throw new Error(`Missing required field ${k}`)
        }
      }
    }

    for (const k in field.options) {
      if (validators[k as keyof typeof validators] === undefined) {
        throw new Error(`Got unexpected option ${k} for field of type ${INTERNAL_NAME_TO_DISPLAY_FIELD[field.type as keyof typeof INTERNAL_NAME_TO_DISPLAY_FIELD] || 'Text'}`)
      }
      field.options[k] = (validators[k as keyof typeof validators] as ValidatorDefinition).validate(field.options[k])
    }
  }

  if (field.intakeField !== undefined) { // allow null to unset intake
    if (RESERVED_INTAKE_FIELDS.includes(field.intakeField)) {
      throw new Error(`${field.intakeField} is reserved for internal use only and cannot be used as an intake field`)
    }

    const intakeType = ENDUSER_FIELD_TYPES[field.intakeField as keyof typeof ENDUSER_FIELD_TYPES]
    if (intakeType && intakeType !== field.type) {
      throw new Error(
        `Intake field ${field.intakeField} requires a form field type of ${INTERNAL_NAME_TO_DISPLAY_FIELD[intakeType as keyof typeof INTERNAL_NAME_TO_DISPLAY_FIELD] || 'Text'}`
      )
    }
  }

  return field
}

export const addressValidator = objectValidator<SuperbillProvider['address']>({
  city: stringValidator,
  state: stateValidator,
  lineOne: stringValidator,
  lineTwo: stringValidatorOptional,
  zipCode: stringValidator100,
  zipPlusFour: stringValidator1000Optional,
})
export const addressOptionalValidator = objectValidator<SuperbillProvider['address']>({
  city: stringValidatorOptional,
  state: stateValidatorOptional,
  lineOne: stringValidatorOptional,
  lineTwo: stringValidatorOptional,
  zipCode: stringValidator1000Optional,
  zipPlusFour: stringValidator1000Optional,
}, { isOptional: true, emptyOk: true })

export const insuranceOptionalValidator = objectValidator<EnduserInsurance>({
  memberId: stringValidatorOptional,
  payerId: stringValidatorOptional,
  payerName: stringValidatorOptional,
  cardFront: stringValidatorOptional,
  cardBack: stringValidatorOptional,
  relationship: exactMatchValidator(INSURANCE_RELATIONSHIPS),
  canvasId: stringValidatorOptional,
  eligible: booleanValidatorOptional,
  eligibilityRanAt: dateValidatorOptional,
  relationshipDetails: objectValidator<EnduserInsurance['relationshipDetails']>({
    address: addressOptionalValidator,
    fname: stringValidatorOptional,
    lname: stringValidatorOptional,
    email: emailValidatorOptional,
    phone: phoneValidatorOptional,
  }, { isOptional: true, emptyOk: true })
}, { isOptional: true, emptyOk: true })

// validate optional vs not at endpoint-level
export const formResponseAnswerValidator = orValidator<{ [K in FormFieldType]: FormResponseValueAnswer & { type: K } } >({
  "Related Contacts": objectValidator<FormResponseAnswerRelatedContacts>({
    type: exactMatchValidator(['Related Contacts']),
    value: listValidatorOptionalOrEmptyOk(objectAnyFieldsAnyValuesValidator),
  }),
  "Insurance": objectValidator<FormResponseAnswerInsurance>({
    type: exactMatchValidator(['Insurance']),
    value: insuranceOptionalValidator,
  }),
  "Question Group": objectValidator<FormResponseAnswerGroup>({
    type: exactMatchValidator(['Question Group']),
    value: listValidatorEmptyOk(objectValidator<FormSubField>({ 
      id: mongoIdStringRequired,
    }))
  }),
  "Address": objectValidator<FormResponseAnswerAddress>({
    type: exactMatchValidator(['Address']),
    value: objectValidator<FormResponseAnswerAddress['value']>({ 
      addressLineOne: stringValidator1000Optional,
      addressLineTwo: stringValidator1000Optional,
      city: stringValidator1000Optional,
      state: stateValidatorOptional,
      zipCode: stringValidator1000Optional,
      zipPlusFour: stringValidator1000Optional,
    }, { emptyOk: true, isOptional: true })
  }),
  "Table Input": objectValidator<FormResponseAnswerTable>({
    type: exactMatchValidator(['Table Input']),
    value: listValidatorOptionalOrEmptyOk( // optional to support optional Table Input questions
      listValidator(objectValidator<TableInputCell>({
        label: stringValidator,
        entry: stringValidatorOptionalEmptyOkay,
      })
    ))
  }),
  description: objectValidator<FormResponseAnswerDescription>({
    type: exactMatchValidator(['description']),
    value: stringValidatorOptionalEmptyOkay,
  }),
  email: objectValidator<FormResponseAnswerEmail>({
    type: exactMatchValidator(['email']),
    value: emailValidatorOptional,
  }),
  number: objectValidator<FormResponseAnswerNumber>({
    type: exactMatchValidator(['number']),
    value: numberValidatorOptional,
  }),
  rating: objectValidator<FormResponseAnswerRating>({
    type: exactMatchValidator(['rating']),
    value: numberValidatorOptional, 
  }),
  phone: objectValidator<FormResponseAnswerPhone>({
    type: exactMatchValidator(['phone']),
    value: phoneValidatorOptional,
  }),
  string: objectValidator<FormResponseAnswerString>({
    type: exactMatchValidator(['string']),
    value: stringValidator5000Optional,
  }),
  Time: objectValidator<FormResponseAnswerTime>({
    type: exactMatchValidator(['Time']),
    value: stringValidator1000Optional,
  }),
  Stripe: objectValidator<FormResponseAnswerStripe>({
    type: exactMatchValidator(['Stripe']),
    value: stringValidator1000Optional,
  }),
  stringLong: objectValidator<FormResponseAnswerStringLong>({
    type: exactMatchValidator(['stringLong']),
    value: stringValidator5000Optional,
  }),
  date: objectValidator<FormResponseAnswerDate>({
    type: exactMatchValidator(['date']),
    value: dateValidatorOptional,
  }),
  dateString: objectValidator<FormResponseAnswerDateString>({
    type: exactMatchValidator(['dateString']),
    value: stringValidator1000Optional,
  }),
  file: objectValidator<FormResponseAnswerFile>({
    type: exactMatchValidator(['file']),
    value: objectValidator<FormResponseAnswerFileValue>({
      name: stringValidator5000,
      secureName: stringValidator250,
      type: stringValidator1000Optional,
    }, { emptyOk: false, isOptional: true }),
  }),
  files: objectValidator<FormResponseAnswerFiles>({
    type: exactMatchValidator(['files']),
    value: listValidatorOptionalOrEmptyOk(objectValidator<FormResponseAnswerFileValue>({
      name: stringValidator5000,
      secureName: stringValidator250,
      type: stringValidator1000Optional,
    }, { emptyOk: false, isOptional: true })),
  }),
  multiple_choice: objectValidator<FormResponseAnswerMultipleChoice>({
    type: exactMatchValidator(['multiple_choice']),
    value: listOfStringsValidatorOptionalOrEmptyOk,
  }),
  Dropdown: objectValidator<FormResponseAnswerDropdown>({
    type: exactMatchValidator(['Dropdown']),
    value: listOfStringsValidatorOptionalOrEmptyOk,
  }),
  ranking: objectValidator<FormResponseAnswerRanking>({
    type: exactMatchValidator(['ranking']),
    value:  listOfStringsValidatorOptionalOrEmptyOk,
  }),
  signature: objectValidator<FormResponseAnswerSignature>({
    type: exactMatchValidator(['signature']),
    value: objectValidator<FormResponseAnswerSignatureValue>({
      fullName: stringValidator1000Optional,
      signed: booleanValidatorOptional,
      pdfAttachment: stringValidatorOptional,
      url: stringValidator1000Optional,
      signedPdfSecureName: stringReadonlyValidator, // created/set in backend only
    }, { emptyOk: false, isOptional: true }),
  }),
  "Database Select": objectValidator<FormResponseAnswerDatabaseSelect>({
    type: exactMatchValidator(['Database Select']),
    value: listValidatorOptionalOrEmptyOk(
      objectValidator<DatabaseSelectResponse>({
        recordId: mongoIdStringRequired,
        databaseId: mongoIdStringRequired,
        text: stringValidator25000,
      }, { emptyOk: false, isOptional: true })
    ),
  }),
  "Medications": objectValidator<FormResponseAnswerMedications>({
    type: exactMatchValidator(['Medications']),
    value: listValidatorOptionalOrEmptyOk(
      objectValidator<MedicationResponse>({
        displayTerm: stringValidatorOptionalEmptyOkay,
        drugName: stringValidatorOptionalEmptyOkay,
        drugSynonym: stringValidatorOptionalEmptyOkay,
        otherDrug: stringValidatorOptionalEmptyOkay,
        NDCs: listOfStringsValidatorOptionalOrEmptyOk,
        rxNormCode: stringValidatorOptionalEmptyOkay,
        reasonForTaking: stringValidatorOptionalEmptyOkay,
        dosage: objectValidator<MedicationResponse['dosage']>({
          value: stringValidatorOptionalEmptyOkay,
          unit: stringValidatorOptionalEmptyOkay,
          quantity: stringValidatorOptionalEmptyOkay,
          frequency: stringValidatorOptionalEmptyOkay,
        }, { emptyOk: true, isOptional: true }),
      }, { emptyOk: false, isOptional: true })
    ),
  }),

})

export const mmddyyyyRegex = /^\d{2}-\d{2}-\d{4}$/
export const photonDisabledForEnduser = (
  enduser: Pick<Enduser, 'phone' | 'fname' | 'lname' | 'gender' | 'dateOfBirth'>
) => !(
  enduser.fname && enduser.lname && enduser.gender && enduser.phone
  && enduser.dateOfBirth && mmddyyyyRegex.test(enduser.dateOfBirth)
)

export const fullscriptDisabledForEnduser = (enduser: Pick<Enduser, 'email' | 'fname' | 'lname'>) => !(
  enduser.fname && enduser.lname && enduser.email
)

export const formResponseValidator = objectValidator<FormResponseValue>({
  fieldId: stringValidatorOptionalEmptyOkay,
  fieldTitle: stringValidator5000EmptyOkay,
  fieldDescription: stringValidator5000Optional,
  fieldHtmlDescription: stringValidator5000Optional,
  answer: formResponseAnswerValidator,
  externalId: stringValidatorOptional,
  sharedWithEnduser: booleanValidatorOptional,
  isCalledOut: booleanValidatorOptional,
  isHighlightedOnTimeline: booleanValidatorOptional,
  computedValueKey: stringValidatorOptional,
})
export const formResponsesValidator = listValidator(formResponseValidator)

export const intakePhoneValidator = exactMatchValidator<Required<Form>['intakePhone']>(['optional', 'required', 'hidden'])
export const intakeDateOfBirthValidator = exactMatchValidator<Required<Form>['intakeDateOfBirth']>(['optional', 'required', 'hidden'])

export const formFieldValidator: EscapeBuilder<FormField> = (options={}, fieldOptions={ forUpdate: false }) => build_validator(
  v => isFormField(v, fieldOptions), 
  { ...options, isObject: true, listOf: false }
)
export const listOfFormFieldsValidator: EscapeBuilder<FormField[]> = (options={}, fieldOptions={ forUpdate: false }) => build_validator(
  v => isFormField(v, fieldOptions), 
  { ...options, isObject: true, listOf: true, emptyListOk: true }
)


// // to ensure all topics in type have coverage at compile-time
// const _CHAT_ROOM_TOPICS: { [K in ChatRoomTopic]: any } = {
//   task: '',
//   enduser: '',
// }
// export const CHAT_ROOM_TOPICS = Object.keys(_CHAT_ROOM_TOPICS) as ChatRoomTopic[]
// export const chatRoomTopicValidator = exactMatchValidator<ChatRoomTopic>(CHAT_ROOM_TOPICS)

// to ensure all topics in type have coverage at compile-time
const _CHAT_ROOM_TYPES: { [K in ChatRoomType]: any } = {
  internal: '',
  external: '',
  'Group Chat': '',
}
export const CHAT_ROOM_TYPES = Object.keys(_CHAT_ROOM_TYPES) as ChatRoomType[]
export const chatRoomTypeValidator = exactMatchValidator<ChatRoomType>(CHAT_ROOM_TYPES)


const _ACCOUNT_TYPES: { [K in AccountType]: any } = {
  Business: '',
}
export const ACCOUNT_TYPES = Object.keys(_ACCOUNT_TYPES) as AccountType[]
export const accountTypeValidator = exactMatchValidator<AccountType>(ACCOUNT_TYPES)

const _MESSAGE_TEMPLATE_TYPES: { [K in MessageTemplateType]: any } = {
  enduser: '',
  team: '',
  Reply: '',
}
export const MESSAGE_TEMPLATE_TYPES = Object.keys(_MESSAGE_TEMPLATE_TYPES) as MessageTemplateType[]
export const messageTemplateTypeValidator = exactMatchValidator<MessageTemplateType>(MESSAGE_TEMPLATE_TYPES)

const _MEETING_STATUSES: { [K in MeetingStatus]: any } = {
  ended: '',
  live: '',
  scheduled: '',
}
export const MEETING_STATUSES = Object.keys(_MEETING_STATUSES) as MeetingStatus[]
export const meetingStatusValidator = exactMatchValidator<MeetingStatus>(MEETING_STATUSES)

const _CUD: { [K in CUDType]: any } = {
  create: '',
  update: '',
  delete: '',
}
export const CUD = Object.keys(_CUD) as CUDType[]

export const CUDStringValidator = exactMatchValidator<CUDType>(CUD)

export const CUDValidator = objectValidator<CUDSubscription>({
  create: booleanValidatorOptional,
  update: booleanValidatorOptional,
  delete: booleanValidatorOptional,
}, { isOptional: true })

const _UNIT_OF_TIME: { [K in UnitOfTime]: any } = {
  Days: '',
  Hours: '',
  Minutes: '',
  Seconds: '',
}
export const UNITS_OF_TIME = Object.keys(_UNIT_OF_TIME) as UnitOfTime[]

export const UnitOfTimeValidator = exactMatchValidator<UnitOfTime>(UNITS_OF_TIME)

const WebhookSubscriptionValidatorObject = {} as { [K in WebhookSupportedModel]: ValidatorDefinition<CUDSubscription> } 
for (const model in WEBHOOK_MODELS) {
  WebhookSubscriptionValidatorObject[model as WebhookSupportedModel] = CUDValidator
}
export const WebhookSubscriptionValidator = objectValidator<{ [K in WebhookSupportedModel]: CUDSubscription}>(
  WebhookSubscriptionValidatorObject,
  { throwOnUnrecognizedField: true }
)

export const sessionTypeValidator = exactMatchValidator<SessionType>(['user', 'enduser'])
export const sessionTypeOrAnyoneValidatorOptional = exactMatchValidatorOptional<SessionType | 'Anyone'>(['user', 'enduser', 'Anyone'])

export const listOfDisplayNameInfo = listValidator(objectValidator<{ fname: string, lname: string, id: string }>({ 
  fname: nameValidator, 
  lname: nameValidator,
  id: listOfMongoIdStringValidator,
}))

export const attendeeInfoValidator = objectValidator<AttendeeInfo>({
  AttendeeId: stringValidator,
  ExternalUserId: mongoIdStringRequired,
  JoinToken: stringValidator,
})

export const attendeeValidator = objectValidator<{
  type: SessionType,
  id: string,
  info: AttendeeInfo,
}>({ 
  type: sessionTypeValidator,
  id: mongoIdStringRequired,
  info: attendeeInfoValidator,
}) 
export const listOfAttendeesValidator = listValidator(attendeeValidator)
export const meetingInfoValidator = objectValidator<{ Meeting: MeetingInfo }>({ 
  Meeting: objectAnyFieldsAnyValuesValidator,
}) 

export const userIdentityValidator = objectValidator<{
  type: SessionType,
  id: string,
}>({ 
  type: sessionTypeValidator,
  id: mongoIdStringRequired,
}) 
export const listOfUserIndentitiesValidator = listValidator(userIdentityValidator)

export const chatAttachmentValidator = objectValidator<ChatAttachment>({ 
  type: stringValidator100,
  name: stringValidatorOptional,
  secureName: stringValidator250,
}) 
export const listOfChatAttachmentsValidator = listValidatorEmptyOk(chatAttachmentValidator)

export const genericAttachmentValidator = objectValidator<GenericAttachment>({ 
  displayName: stringValidator1000,
  fileId: mongoIdStringRequired,
  type: stringValidatorOptional,
  secureName: stringValidator250,
}) 
export const listOfGenericAttachmentsValidator = listValidatorEmptyOk(genericAttachmentValidator)

export const meetingsListValidator = listValidator(objectValidator<{
  id: string,
  updatedAt: string,
  status: MeetingStatus,
}>({
  id: mongoIdStringRequired,
  updatedAt: stringValidator,
  status: meetingStatusValidator,
}))

export const userDisplayInfoValidator = objectValidator<UserDisplayInfo>({
  id: mongoIdStringRequired,
  createdAt: dateValidator,
  avatar: stringValidator,
  fname: nameValidator, 
  lname: nameValidator,
  lastActive: dateValidator,
  lastLogout: dateValidator,
  email: emailValidator,
})
export const meetingDisplayInfoValidator = indexableValidator(mongoIdStringRequired, userDisplayInfoValidator)

export const chatRoomUserInfoValidator = objectAnyFieldsValidator(objectValidator<ChatRoomUserInfo>({
  unreadCount: nonNegNumberValidator,
}))

const _LIST_QUERY_QUALIFIERS: { [K in ListQueryQualifier]: any} = {
  "One Of": '',
  "All Of": "",
} 
export const LIST_QUERY_QUALIFIERS = Object.keys(_LIST_QUERY_QUALIFIERS) as ListQueryQualifier[]
export const listQueryQualifiersValidator = exactMatchValidator<ListQueryQualifier>(LIST_QUERY_QUALIFIERS)

export const listOfStringsWithQualifierValidator = objectValidator<ListOfStringsWithQualifier>({
  qualifier: listQueryQualifiersValidator,
  values: listOfStringsValidator,
})
export const listOfStringsWithQualifierValidatorOptional = objectValidator<ListOfStringsWithQualifier>({
  qualifier: listQueryQualifiersValidator,
  values: listOfStringsValidator,
}, { isOptional: true })

const _AUTOMATION_ENDUSER_STATUS: { [K in AutomatedActionStatus]: any } = {
  active: '',
  finished: '',
  cancelled: '',
  error: '',
}
export const AUTOMATION_ENDUSER_STATUS = Object.keys(_AUTOMATION_ENDUSER_STATUS) as AutomatedActionStatus[]
export const automatedActionStatusValidator = exactMatchValidator<AutomatedActionStatus>(AUTOMATION_ENDUSER_STATUS)

const _AUTOMATION_EVENTS: { [K in AutomationEventType]: any } = {
  formResponse: '',
  formResponses: '',
  afterAction: '',
  onJourneyStart: '',
  formUnsubmitted: '',
  formsUnsubmitted: '',
  ticketCompleted: '',
  waitForTrigger: '',
}
export const AUTOMATION_EVENTS = Object.keys(_AUTOMATION_EVENTS) as AutomationEventType[]
export const automationEventTypeValidator = exactMatchValidator<AutomationEventType>(AUTOMATION_EVENTS)

const _AUTOMATION_ACTIONS: { [K in AutomationActionType]: any } = {
  createTicket: '',
  createCarePlan: '',
  completeCarePlan: '',
  sendEmail: '',
  sendSMS: '',
  sendForm: '',
  sendWebhook: '',
  setEnduserStatus: '',
  setEnduserFields: '',
  shareContent: '',
  notifyTeam: '',
  addEnduserTags: '',
  addToJourney: '',
  removeFromJourney: '',
  iterableSendEmail: '',
  iterableCustomEvent: '',
  zendeskCreateTicket: '',
  zusSync: '',
}
export const AUTOMATION_ACTIONS = Object.keys(_AUTOMATION_ACTIONS) as AutomationActionType[]
export const automationActionTypeValidator = exactMatchValidator<AutomationActionType>(AUTOMATION_ACTIONS)

const _COMMUNICATIONS_CHANNELS: { [K in CommunicationsChannel]: any } = {
  Email: '',
  SMS: '',
  Chat: '',
}
export const COMMUNICATIONS_CHANNELS = Object.keys(_COMMUNICATIONS_CHANNELS) as CommunicationsChannel[]
export const communicationsChannelValidator = exactMatchValidator<CommunicationsChannel>(COMMUNICATIONS_CHANNELS)
export const communicationsChannelValidatorOptional = exactMatchValidatorOptional<CommunicationsChannel>(COMMUNICATIONS_CHANNELS)

const _MESSAGE_TEMPLATE_MODES: { [K in MessageTemplateMode]: any } = {
  richtext: '',
  html: '',
}
export const MESSAGE_TEMPLATE_MODES = Object.keys(_MESSAGE_TEMPLATE_MODES) as MessageTemplateMode[]
export const messageTemplateModeValidator = exactMatchValidator<MessageTemplateMode>(MESSAGE_TEMPLATE_MODES)

const sharedReminderValidators = {
  msBeforeStartTime: numberValidator,
  didRemind: booleanValidatorOptional,
}

export const calendarEventReminderValidator = orValidator<{ [K in CalendarEventReminderType]: CalendarEventReminderInfoForType[K] } >({
  webhook: objectValidator<CalendarEventReminderInfoForType['webhook']>({
    info: objectValidator<{}>({}, { emptyOk: true, isOptional: true }),
    type: exactMatchValidator<'webhook'>(['webhook']), 
    ...sharedReminderValidators, 
  }),
  'add-to-journey': objectValidator<CalendarEventReminderInfoForType['add-to-journey']>({
    info: objectValidator<CalendarEventReminderInfoForType['add-to-journey']['info']>({
      journeyId: mongoIdStringRequired,
    }),
    type: exactMatchValidator<'add-to-journey'>(['add-to-journey']), 
    ...sharedReminderValidators, 
  }),
  "enduser-notification": objectValidator<CalendarEventReminderInfoForType['enduser-notification']>({
    info: objectValidator<CalendarEventReminderNotificationInfo>({
      templateId: mongoIdStringOptional, 
      channel: communicationsChannelValidatorOptional,
    }, { emptyOk: true }),
    type: exactMatchValidator<'enduser-notification'>(['enduser-notification']), 
    ...sharedReminderValidators, 
  }),
  "user-notification": objectValidator<CalendarEventReminderInfoForType['user-notification']>({
    info: objectValidator<CalendarEventReminderNotificationInfo>({
      templateId: mongoIdStringOptional,
      channel: communicationsChannelValidatorOptional,
    }, { emptyOk: true }),
    type: exactMatchValidator<'user-notification'>(['user-notification']), 
    ...sharedReminderValidators, 
  }),
  "create-ticket": objectValidator<CalendarEventReminderInfoForType['create-ticket']>({
    info: objectValidator<CalendarEventReminderInfoForType['create-ticket']['info']>({
      title: stringValidator1000Optional,
    }, { emptyOk: true }),
    type: exactMatchValidator<'create-ticket'>(['create-ticket']), 
    ...sharedReminderValidators, 
  }),
})
export const listOfCalendarEventRemindersValidator = listValidatorEmptyOk(calendarEventReminderValidator)


export const cancelConditionValidator = orValidator<{ [K in keyof CancelConditions]: CancelCondition & { type: K } } >({
  formResponse: objectValidator<CancelConditions['formResponse']>({
    type: exactMatchValidator(['formResponse']),
    info: objectValidator<CancelConditions['formResponse']['info']>({
      automationStepId: mongoIdStringRequired,
    }, { emptyOk: false }),
  }),
  formResponses: objectValidator<CancelConditions['formResponses']>({
    type: exactMatchValidator(['formResponses']),
    info: objectValidator<CancelConditions['formResponses']['info']>({
      automationStepId: mongoIdStringRequired,
      unsubmittedFormCount: numberValidator,
    }, { emptyOk: false }),
  }),
})

export const cancelConditionsValidator = listOfObjectsValidator<CancelCondition>({
  type: exactMatchValidator(['formResponse']),
  info: objectValidator<FormSubmitCancellationConditionInfo>({
    automationStepId: mongoIdStringRequired,
  }, { emptyOk: false }),
})
export const cancelConditionsValidatorOptional = listValidatorOptionalOrEmptyOk(objectValidator<CancelCondition>({
  type: exactMatchValidator(['formResponse']),
  info: objectValidator<FormSubmitCancellationConditionInfo>({
    automationStepId: mongoIdStringRequired,
  }, { emptyOk: false }),
}))

const delayValidation = { 
  automationStepId: mongoIdStringRequired, 
  delayInMS: nonNegNumberValidator, // use 0 when no delay
  delay: nonNegNumberValidator, // for UI only
  unit: UnitOfTimeValidator, // for UI only
  cancelConditions: cancelConditionsValidatorOptional,
}

export const automationEventValidator = orValidator<{ [K in AutomationEventType]: AutomationEvent & { type: K } } >({
  formResponse: objectValidator<FormResponseAutomationEvent>({
    type: exactMatchValidator(['formResponse']),
    info: objectValidator<WithAutomationStepId>({ 
      automationStepId: mongoIdStringRequired,
    }, { emptyOk: false }),
  }),
  formResponses: objectValidator<FormResponsesAutomationEvent>({
    type: exactMatchValidator(['formResponses']),
    info: objectValidator<WithAutomationStepId>({ 
      automationStepId: mongoIdStringRequired,
    }, { emptyOk: false }),
  }),
  afterAction: objectValidator<AfterActionAutomationEvent>({
    type: exactMatchValidator(['afterAction']),
    info: objectValidator<AfterActionAutomationEvent['info']>({
      ...delayValidation,
      formCondition: objectValidator<AfterActionAutomationEvent['info']['formCondition']>({
        formId: mongoIdStringRequired,
        formFieldId: mongoIdStringRequired,
        before: booleanValidatorOptional,
      }, { isOptional: true, emptyOk: true, }),
      fieldCondition: objectValidator<AfterActionAutomationEvent['info']['fieldCondition']>({
        field: stringValidator,
        before: booleanValidatorOptional,
      }, { isOptional: true, emptyOk: true, }),
    }, { emptyOk: false }),
  }),
  formUnsubmitted: objectValidator<FormUnsubmittedEvent>({
    type: exactMatchValidator(['formUnsubmitted']),
    info: objectValidator<FormUnsubmittedEventInfo>({ 
      ...delayValidation,
      automationStepId: mongoIdStringRequired, 
    }, { emptyOk: false }),
  }),
  formsUnsubmitted: objectValidator<FormsUnsubmittedEvent>({
    type: exactMatchValidator(['formsUnsubmitted']),
    info: objectValidator<FormUnsubmittedEventInfo>({ 
      ...delayValidation,
      automationStepId: mongoIdStringRequired, 
    }, { emptyOk: false }),
  }),
  onJourneyStart: objectValidator<OnJourneyStartAutomationEvent>({
    type: exactMatchValidator(['onJourneyStart']),
    info: objectValidator<{}>({ }, { emptyOk: true }),
  }),
  ticketCompleted: objectValidator<TicketCompletedAutomationEvent>({
    type: exactMatchValidator(['ticketCompleted']),
    info: objectValidator<TicketCompletedEventInfo>({ 
      automationStepId: mongoIdStringRequired, 
      closedForReason: stringValidatorOptional,
    }, { emptyOk: false }),
  }),
  waitForTrigger: objectValidator<WaitForTriggerAutomationEvent>({
    type: exactMatchValidator(['waitForTrigger']),
    info: objectValidator<WaitForTriggerAutomationEvent['info']>({ 
      automationStepId: mongoIdStringRequired, 
      triggerId: mongoIdStringRequired, 
    }, { emptyOk: false }),
  }),
})
export const automationEventsValidator = listValidatorEmptyOk(automationEventValidator)

export const automationConditionValidator = orValidator<{ [K in AutomationConditionType]: AutomationCondition & { type: K } } >({
  atJourneyState: objectValidator<AtJourneyStateAutomationCondition>({
    type: exactMatchValidator(['atJourneyState']),
    info: objectValidator<AutomationForJourneyAndState>({ state: stringValidator100, journeyId: mongoIdStringRequired }, { emptyOk: false }),
  }),
})
export const listOfAutomationConditionsValidator = listValidatorEmptyOk(automationConditionValidator)

export const ticketReminderValidator = objectValidator<TicketReminder>({
  msBeforeDueDate: numberValidator,
  didRemind: booleanValidatorOptional,
})

export const ticketActionValidator = orValidator<{ [K in TicketActionType]: TicketAction & { type: K } } >({
  "Complete Form": objectValidator<TicketActions['Complete Form']>({
    type: exactMatchValidator(['Complete Form']),
    info: objectValidator<TicketActions['Complete Form']['info']>({ 
      formId: mongoIdStringRequired, 
      formResponseId: mongoIdStringOptional, 
    }, { emptyOk: false }),
    completedAt: dateOptionalOrEmptyStringValidator,
  }),
  "Create Prescription": objectValidator<TicketActions['Create Prescription']>({
    type: exactMatchValidator(['Create Prescription']),
    info: objectValidator<TicketActions['Create Prescription']['info']>({}, { emptyOk: true, isOptional: true }),
    completedAt: dateOptionalOrEmptyStringValidator,
  }),
})
export const ticketActionsValidator = listValidatorOptionalOrEmptyOk(ticketActionValidator)

export const automationActionValidator = orValidator<{ [K in AutomationActionType]: AutomationAction & { type: K } } >({
  setEnduserStatus: objectValidator<SetEnduserStatusAutomationAction>({
    type: exactMatchValidator(['setEnduserStatus']),
    info: objectValidator<SetEnduserStatusInfo>({ status: stringValidator250 }, { emptyOk: false }),
  }),
  sendEmail: objectValidator<SendEmailAutomationAction>({
    type: exactMatchValidator(['sendEmail']),
    info: objectValidator<AutomationForMessage>({ senderId: mongoIdStringRequired, templateId: mongoIdStringRequired }, { emptyOk: false }),
  }),
  sendSMS: objectValidator<SendSMSAutomationAction>({
    type: exactMatchValidator(['sendSMS']),
    info: objectValidator<AutomationForMessage>({ senderId: mongoIdStringRequired, templateId: mongoIdStringRequired }, { emptyOk: false }),
  }),
  notifyTeam: objectValidator<NotifyTeamAutomationAction>({
    type: exactMatchValidator(['notifyTeam']),
    info: objectValidator<NotifyTeamAutomationAction['info']>(
      { 
        templateId: mongoIdStringRequired,
        forAssigned: booleanValidator,
        roles: listOfStringsValidatorOptionalOrEmptyOk,
      }, 
      { emptyOk: false }
    ),
  }),
  sendForm: objectValidator<SendFormAutomationAction>({
    type: exactMatchValidator(['sendForm']),
    info: objectValidator<AutomationForFormRequest>({ 
      senderId: mongoIdStringRequired, 
      formId: mongoIdStringRequired,
      channel: communicationsChannelValidatorOptional,
    }, { emptyOk: false }),
  }),
  shareContent: objectValidator<ShareContentAutomationAction>({
    type: exactMatchValidator(['shareContent']),
    info: objectValidator<ShareContentAutomationAction['info']>({ 
      managedContentRecordIds: listOfMongoIdStringValidator, 
    }, { emptyOk: false }),
  }),
  createTicket: objectValidator<CreateTicketAutomationAction>({
    type: exactMatchValidator(['createTicket']),
    info: objectValidator<CreateTicketActionInfo>({ 
      title: stringValidator1000,
      description: stringValidatorOptionalEmptyOkay,
      assignmentStrategy: orValidator<{ [K in CreateTicketAssignmentStrategyType ]: CreateTicketAssignmentStrategy }>({
        'care-team-random': objectValidator<CreateTicketAssignmentStrategy>({ 
          type: exactMatchValidator<'care-team-random'>(['care-team-random']),
          info: objectValidator<object>({}, { emptyOk: true }),
        }),
        'care-team-primary': objectValidator<CreateTicketAssignmentStrategy>({ 
          type: exactMatchValidator<'care-team-primary'>(['care-team-primary']),
          info: objectValidator<object>({}, { emptyOk: true }),
        }),
        'previous-owner': objectValidator<CreateTicketAssignmentStrategy>({ 
          type: exactMatchValidator<'previous-owner'>(['previous-owner']),
          info: objectValidator<object>({}, { emptyOk: true }),
        }),
        'by-tags': objectValidator<CreateTicketAssignmentStrategy>({ 
          type: exactMatchValidator<'by-tags'>(['by-tags']),
          info: listOfStringsWithQualifierValidator,
        }),
        'queue': objectValidator<CreateTicketAssignmentStrategy>({ 
          type: exactMatchValidator<'queue'>(['queue']),
          info: objectValidator<AssignToQueueInfo>({
            queueId: mongoIdStringRequired,
          }),
        }),
        'default': objectValidator<CreateTicketAssignmentStrategy>({ 
          type: exactMatchValidator<'default'>(['default']),
          info: objectValidator<object>({}, { emptyOk: true }),
        }),
      }), 
      closeReasons: listOfStringsValidatorOptionalOrEmptyOk,
      restrictByState: booleanValidatorOptional,
      restrictByCareTeam: booleanValidatorOptional,
      defaultAssignee: mongoIdStringRequired,
      forCarePlan: booleanValidatorOptional,
      hiddenFromTickets: booleanValidatorOptional,
      htmlDescription: stringValidator100000OptionalEmptyOkay, // keep consistent with validator on Tickets model
      actions: ticketActionsValidator,
      dueDateOffsetInMS: numberValidatorOptional,
      closeOnFinishedActions: booleanValidatorOptional,
      requireConfirmation: booleanValidatorOptional,
      reminders: listValidatorOptionalOrEmptyOk(ticketReminderValidator),
    }, { emptyOk: false }),
  }),
  sendWebhook: objectValidator<SendWebhookAutomationAction>({
    type: exactMatchValidator(['sendWebhook']),
    info: objectValidator<AutomationForWebhook>({ message: stringValidator5000 }, { emptyOk: false }),
  }),
  setEnduserFields: objectValidator<SetEnduserFieldsAutomationAction>({
    type: exactMatchValidator(['setEnduserFields']),
    info: objectValidator<SetEnduserFieldsAutomationAction['info']>({ 
      fields: listValidator(objectValidator<EnduserFieldSetter>({
        name: stringValidator,
        type: stringValidator,
        value: stringValidator,
      }))
    }, { emptyOk: false }),
  }),
  addEnduserTags: objectValidator<AddEnduserTagsAutomationAction>({
    type: exactMatchValidator(['addEnduserTags']),
    info: objectValidator<AddEnduserTagsAutomationAction['info']>({ 
      tags: listOfStringsValidator, 
    }, { emptyOk: false }),
  }),
  addToJourney: objectValidator<AddToJourneyAutomationAction>({
    type: exactMatchValidator(['addToJourney']),
    info: objectValidator<AddToJourneyAutomationAction['info']>({ 
      journeyId: mongoIdStringRequired, 
    }, { emptyOk: false }),
  }),
  removeFromJourney: objectValidator<RemoveFromJourneyAutomationAction>({
    type: exactMatchValidator(['removeFromJourney']),
    info: objectValidator<RemoveFromJourneyAutomationAction['info']>({ 
      journeyId: mongoIdStringRequired, 
    }, { emptyOk: false }),
  }),
  iterableSendEmail: objectValidator<IterableSendEmailAutomationAction>({
    type: exactMatchValidator(['iterableSendEmail']),
    info: objectValidator<IterableSendEmailAutomationAction['info']>({ 
      campaignId: stringValidator, 
    }, { emptyOk: false }),
  }),
  iterableCustomEvent: objectValidator<IterableCustomEventAutomationAction>({
    type: exactMatchValidator(['iterableCustomEvent']),
    info: objectValidator<IterableCustomEventAutomationAction['info']>({ 
      eventName: stringValidator, 
      description: stringValidator, 
      dataFieldsMapping: listValidatorOptionalOrEmptyOk(
        objectValidator<IterableFieldsMapping>({
          iterable: stringValidator,
          tellescope: stringValidator,
        })
      )
    }, { emptyOk: false }),
  }),
  zendeskCreateTicket: objectValidator<ZendeskCreateTicketAutomationAction>({
    type: exactMatchValidator(['zendeskCreateTicket']),
    info: objectValidator<ZendeskCreateTicketAutomationAction['info']>({ 
      templateId: mongoIdStringRequired, 
      defaultSenderId: mongoIdStringRequired, 
    }, { emptyOk: false }),
  }),
  createCarePlan: objectValidator<CreateCarePlanAutomationAction>({
    type: exactMatchValidator(['createCarePlan']),
    info: objectValidator<CreateCarePlanAutomationAction['info']>({ 
      title: stringValidator1000, 
      htmlDescription: stringValidator100000EmptyOkay, 
      hideRemainingTicketsProgress: booleanValidatorOptional,
      highlightedEnduserFields: listOfStringsValidatorOptionalOrEmptyOk,
    }, { emptyOk: false }),
  }),
  completeCarePlan: objectValidator<CompleteCarePlanAutomationAction>({
    type: exactMatchValidator(['completeCarePlan']),
    info: objectValidator<CompleteCarePlanAutomationAction['info']>({ }, { emptyOk: true }),
  }), 
  zusSync: objectValidator<ZusSyncAutomationAction>({
    type: exactMatchValidator(['zusSync']),
    info: objectValidator<ZusSyncAutomationAction['info']>({ }, { emptyOk: true }),
  }),
})

export const journeyContextValidator = objectValidator<JourneyContext>({
  calendarEventId: mongoIdStringOptional,
  formResponseId: mongoIdStringOptional,
  purchaseId: mongoIdStringOptional,
})

export const relatedRecordValidator = objectValidator<RelatedRecord>({
  type: stringValidator100,
  id: mongoIdStringRequired,
  creator: mongoIdStringOptional,
  environment: stringValidatorOptional,
})
export const listOfRelatedRecordsValidator = listValidatorEmptyOk(relatedRecordValidator)

export const searchOptionsValidator = objectValidator<SearchOptions>({
  query: stringValidator100,
})

export const notificationPreferenceValidator = objectValidator<NotificationPreference>({
  email: booleanValidatorOptional,
})
export const notificationPreferencesValidator = objectAnyFieldsValidator(notificationPreferenceValidator)

export const FHIRObservationCategoryValidator = exactMatchValidator<ObservationCategory>(['vital-signs'])

const _FHIR_OBSERVATION_STATUS_CODES: { [K in ObservationStatusCode]: any } = {
  "entered-in-error": '',
  amended : '',
  cancelled: '',
  corrected: '',
  final: '',
  preliminary: '',
  registered: '',
  unknown: '',
}
export const FHIR_OBSERVATION_STATUS_CODES = Object.keys(_FHIR_OBSERVATION_STATUS_CODES) as ObservationStatusCode[]
export const FHIRObservationStatusCodeValidator = exactMatchValidator<ObservationStatusCode>(FHIR_OBSERVATION_STATUS_CODES)

export const FHIRObservationValueValidator = objectValidator<ObservationValue>({
  unit: stringValidator,
  value: numberValidator,
})

export const previousFormFieldValidator = orValidator<{ [K in PreviousFormFieldType]: PreviousFormField & { type: K } } >({
  root: objectValidator<PreviousFormFieldRoot>({
    type: exactMatchValidator(['root']),
    info: objectValidator<{}>({}, { emptyOk: true }),
  }),
  "after": objectValidator<PreviousFormFieldAfter>({
    type: exactMatchValidator(['after']),
    info: objectValidator<PreviousFormFieldAfterInfo>({ fieldId: mongoIdStringRequired }, { emptyOk: false }),
  }),
  "previousEquals": objectValidator<PreviousFormFieldEquals>({
    type: exactMatchValidator(['previousEquals']),
    info: objectValidator<PreviousFormFieldEqualsInfo>({ 
      fieldId: mongoIdStringRequired,
      equals: stringValidator250,
    }, { emptyOk: false }),
  }),
  "compoundLogic": objectValidator<PreviousFormCompoundLogic>({
    type: exactMatchValidator(['compoundLogic']),
    info: objectValidator<PreviousFormCompoundLogic['info']>({ 
      fieldId: mongoIdStringRequired,
      priority: numberValidator,
      label: stringValidatorOptionalEmptyOkay,
      condition: objectAnyFieldsAnyValuesValidator,
    }, { emptyOk: false }),
  }),
})
export const previousFormFieldsValidator = listValidatorEmptyOk(previousFormFieldValidator)

export const portalSettingsValidator = objectValidator<PortalSettings>({
  authentication: objectValidator<PortalSettings['authentication']>({
    landingTitle: stringValidator1000Optional,
    landingGraphic: stringValidator1000Optional,
    landingLogo: stringValidator1000Optional,
    loginDescription: stringValidator1000Optional,
    loginGraphic: stringValidator1000Optional,
    loginTitle: stringValidator1000Optional,
    registerDescription: stringValidator1000Optional,
    registerGraphic: stringValidator1000Optional,
    registerTitle: stringValidator1000Optional,
    hideRegister: booleanValidatorOptional,
  }, { isOptional: true, emptyOk: true, }),
  communication: objectValidator<PortalSettings['communication']>({
    allowEnduserInitiatedChat: booleanValidatorOptional,
    sendEmailNotificationsToEnduser: booleanValidatorOptional,
    enduserInitiatedChatDefaultSubject: stringValidator5000OptionalEmptyOkay,
  }, { isOptional: true, emptyOk: true })
})

export const organizationThemeValidator = objectValidator<OrganizationTheme>({
  logoURL: stringValidatorOptional, // these don't really need to be optional
  themeColor: stringValidatorOptional, // these don't really need to be optional
  themeColorSecondary: stringValidatorOptional, // these don't really need to be optional
  name: stringValidator250,
  subdomain: stringValidator250,
  businessId: mongoIdStringRequired,
  faviconURL: stringValidator250,
  customPortalURL: stringValidator250,
  portalSettings: portalSettingsValidator,
  organizationIds: listOfStringsValidatorOptionalOrEmptyOk,
  customPrivacyPolicy: stringValidatorOptional,
  customTermsOfService: stringValidatorOptional,
})

const _MANAGED_CONTENT_RECORD_TYPES: { [K in ManagedContentRecordType]: any } = {
  Article: '',
  PDF: '',
  Video: '',
}
export const MANAGED_CONTENT_RECORD_TYPES = Object.keys(_MANAGED_CONTENT_RECORD_TYPES) as ManagedContentRecordType[]
export const managedContentRecordTypeValidator = exactMatchValidator<ManagedContentRecordType>(MANAGED_CONTENT_RECORD_TYPES)

const _MANAGED_CONTENT_RECORD_ASSIGNMENT_TYPES: { [K in ManagedContentRecordAssignmentType]: any } = {
  'All': '',
  'By Tags': '',
  Manual: '',
  Individual: '',
}
export const MANAGED_CONTENT_RECORD_ASSIGNMENT_TYPES = Object.keys(_MANAGED_CONTENT_RECORD_ASSIGNMENT_TYPES) as ManagedContentRecordAssignmentType[]
export const managedContentRecordAssignmentTypeValidator = exactMatchValidator<ManagedContentRecordAssignmentType>(MANAGED_CONTENT_RECORD_ASSIGNMENT_TYPES)

export const passwordValidator: ValidatorDefinition<string> = {
  getExample: getExampleString,
  getType: getTypeString,
  validate: (
    (o) => build_validator((password) => {
      if (typeof password !== 'string') {
        throw new Error("Password must be a string")
      }
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long")
      }

      if (
          (password.match(/[a-z]/g)?.length ?? 0) < 1 // 1 lowercase
      || (
        (password.match(/[A-Z]/g)?.length ?? 0) < 1 // 1 uppercase
        && (password.match(/[0-9]/g)?.length ?? 0) < 1 // 1 number
        && (password.match(/[^a-zA-Z0-9]/g)?.length ?? 0) < 1 // 1 special character
      )
      ) {
      console.error('bad password regex')
        throw new Error('Password must included 1 uppercase letter, 1 number, or 1 symbol') 
      }

      return password 
    }, { ...o, listOf: false, emptyStringOk: false, })
  ),
}

export const flowchartUIValidator = objectValidator<FlowchartUI>({
  x: numberValidator,
  y: numberValidator,
}, { emptyOk: true })



export const integrationAuthenticationsValidator = objectValidator<IntegrationAuthentication>({
  type: exactMatchValidator(['oauth2', 'apiKey']),
  info: objectValidator<OAuth2AuthenticationFields>({
    access_token: stringValidator250,
    refresh_token: stringValidator250,
    scope: stringValidator25000EmptyOkay,
    expiry_date: nonNegNumberValidator,
    token_type: exactMatchValidator<'Bearer'>(['Bearer']),
    external_id: stringValidatorOptional,
    state: stringValidatorOptional,
    email: emailValidatorOptional,
  }),
})

const _TABLE_INPUT_TYPES: { [K in TableInputChoiceType]: any } = {
  Date: '',
  Text: '',
  Select: '',
}
export const TABLE_INPUT_TYPES = Object.keys(_TABLE_INPUT_TYPES) as TableInputChoiceType[]
export const tableInputTypesValidator = exactMatchValidator<TableInputChoiceType>(TABLE_INPUT_TYPES)

export const tableInputChoiceValidator = orValidator<{ [K in TableInputChoiceType]: TableInputChoices[K] }>({
  Text: objectValidator<TableInputChoices['Text']>({
    type: exactMatchValidator<'Text'>(['Text']),
    label: stringValidator1000,
    info: optionalEmptyObjectValidator,
  }),
  Date: objectValidator<TableInputChoices['Date']>({
    type: exactMatchValidator<'Date'>(['Date']),
    label: stringValidator1000,
    info: optionalEmptyObjectValidator,
  }),
  Select: objectValidator<TableInputChoices['Select']>({
    type: exactMatchValidator<'Select'>(['Select']),
    label: stringValidator1000,
    info: objectValidator<TableInputChoices['Select']['info']>({
      choices: listOfStringsValidator,
    }),
  }),
})

export const formFieldOptionsValidator = objectValidator<FormFieldOptions>({
  tableChoices: listValidatorOptionalOrEmptyOk(tableInputChoiceValidator),
  choices: listOfStringsValidatorOptionalOrEmptyOk,
  from: numberValidatorOptional,
  to: numberValidatorOptional,
  other: booleanValidatorOptional,
  radio: booleanValidatorOptional,
  pdfAttachment: stringValidator5000Optional,
  subFields: listValidatorOptionalOrEmptyOk(objectValidator<FormSubField>({ 
    id: mongoIdStringRequired,
  })),
  validFileTypes: listOfStringsValidatorOptionalOrEmptyOk,
  productIds: listOfStringsValidatorOptionalOrEmptyOk,
  chargeImmediately: booleanValidatorOptional,
  signatureUrl: stringValidator5000Optional,
  maxLength: numberValidatorOptional,
  minLength: numberValidatorOptional,
  repeat: booleanValidatorOptional,
  databaseId: mongoIdStringOptional,
  databaseLabel: stringValidatorOptionalEmptyOkay,
  databaseLabels: listOfStringsValidatorOptionalOrEmptyOk,
  databaseFilter: objectValidator<FormFieldOptions['databaseFilter']>({
    databaseLabel: stringValidator1000Optional,
    fieldId: mongoIdStringOptional,
  }, { isOptional: true, emptyOk: true }),
  useDatePicker: booleanValidatorOptional,
  sharedIntakeFields: listOfStringsValidatorOptionalOrEmptyOk,
  disableGoBack: booleanValidatorOptional,
  disableNext: booleanValidatorOptional,
})

export const blockValidator = orValidator<{ [K in BlockType]: Block & { type: K } } >({
  h1: objectValidator<BlockContentH1>({
    type: exactMatchValidator(['h1']),
    info: objectValidator<BlockContentH1['info']>({
      text: stringValidator5000EmptyOkay,
    }),
  }),
  h2: objectValidator<BlockContentH2>({
    type: exactMatchValidator(['h2']),
    info: objectValidator<BlockContentH1['info']>({
      text: stringValidator5000EmptyOkay,
    }),
  }),
  html: objectValidator<BlockContentHTML>({
    type: exactMatchValidator(['html']),
    info: objectValidator<BlockContentHTML['info']>({
      html: stringValidator25000EmptyOkay,
    }),
  }),
  image: objectValidator<BlockContentImage>({
    type: exactMatchValidator(['image']),
    info: objectValidator<BlockContentImage['info']>({
      link: stringValidator5000EmptyOkay,
      name: stringValidatorOptional,
      height: numberValidatorOptional,
      maxHeight: numberValidatorOptional,
      width: numberValidatorOptional,
      maxWidth: numberValidatorOptional,
    }),
  }),
  pdf: objectValidator<BlockContentPDF>({
    type: exactMatchValidator(['pdf']),
    info: objectValidator<BlockContentPDF['info']>({
      link: stringValidator5000EmptyOkay,
      name: stringValidatorOptional,
      height: numberValidatorOptional,
      maxHeight: numberValidatorOptional,
      width: numberValidatorOptional,
      maxWidth: numberValidatorOptional,
    }),
  }),
  youtube: objectValidator<BlockContentYoutube>({
    type: exactMatchValidator(['youtube']),
    info: objectValidator<BlockContentYoutube['info']>({
      link: stringValidator5000EmptyOkay,
      name: stringValidatorOptional,
      height: numberValidatorOptional,
      maxHeight: numberValidatorOptional,
      width: numberValidatorOptional,
      maxWidth: numberValidatorOptional,
    }),
  }),
  iframe: objectValidator<BlockContentIFrame>({
    type: exactMatchValidator(['iframe']),
    info: objectValidator<BlockContentIFrame['info']>({
      link: stringValidator5000EmptyOkay,
      name: stringValidatorOptional,
      height: numberValidatorOptional,
      maxHeight: numberValidatorOptional,
      width: numberValidatorOptional,
      maxWidth: numberValidatorOptional,
    }),
  }),
})

const _BLOCK_TYPES: { [K in BlockType]: any } = {
  h1: '',
  h2: '',
  html: '',
  image: '',
  pdf: '',
  youtube: '',
  iframe: '',
}
export const BLOCK_TYPES = Object.keys(_BLOCK_TYPES) as BlockType[]
export const blockTypeValidator = exactMatchValidator<BlockType>(BLOCK_TYPES)
export const is_block_type = (type: any): type is BlockType => BLOCK_TYPES.includes(type)

export const blocksValidator = listValidatorEmptyOk(blockValidator)

const _DATABASE_RECORD_FIELD_TYPES: { [K in DatabaseRecordFieldType]: any } = {
  Text: '',
  "Text Long": '',
  "Text List": '',
  Number: '',
  Address: '',
  'Multiple Select': '',
}
export const DATABASE_RECORD_FIELD_TYPES = Object.keys(_DATABASE_RECORD_FIELD_TYPES) as DatabaseRecordFieldType[]
export const databaseRecordFieldTypeValidator = exactMatchValidator<DatabaseRecordFieldType>(DATABASE_RECORD_FIELD_TYPES)
export const is_database_record_field_type = (type: any): type is DatabaseRecordFieldType => DATABASE_RECORD_FIELD_TYPES.includes(type)

export const databaseFieldValidator = orValidator<{ [K in DatabaseRecordFieldType]: DatabaseRecordFields[K] }>({
  Text: objectValidator<DatabaseRecordFields['Text']>({
    type: exactMatchValidator(['Text']),
    label: stringValidator250,
    hideFromTable: booleanValidatorOptional,
    options: objectValidator<DatabaseRecordFields['Text']['options']>({
      width: stringValidatorOptionalEmptyOkay,
    }, { isOptional: true, emptyOk: true }),
  }), 
  'Text Long': objectValidator<DatabaseRecordFields['Text Long']>({
    type: exactMatchValidator(['Text Long']),
    label: stringValidator250,
    hideFromTable: booleanValidatorOptional,
    options: objectValidator<DatabaseRecordFields['Text Long']['options']>({
      width: stringValidatorOptionalEmptyOkay,
    }, { isOptional: true, emptyOk: true }),
  }), 
  'Text List': objectValidator<DatabaseRecordFields['Text List']>({
    type: exactMatchValidator(['Text List']),
    label: stringValidator250,
    hideFromTable: booleanValidatorOptional,
    options: objectValidator<DatabaseRecordFields['Text List']['options']>({
      width: stringValidatorOptionalEmptyOkay,
    }, { isOptional: true, emptyOk: true }),
  }), 
  'Number': objectValidator<DatabaseRecordFields['Number']>({
    type: exactMatchValidator(['Number']),
    label: stringValidator250,
    hideFromTable: booleanValidatorOptional,
    options: objectValidator<DatabaseRecordFields['Number']['options']>({
      width: stringValidatorOptionalEmptyOkay,
    }, { isOptional: true, emptyOk: true }),
  }), 
  'Address': objectValidator<DatabaseRecordFields['Address']>({
    type: exactMatchValidator(['Address']),
    label: stringValidator250,
    hideFromTable: booleanValidatorOptional,
    options: objectValidator<DatabaseRecordFields['Address']['options']>({
      width: stringValidatorOptionalEmptyOkay,
    }, { isOptional: true, emptyOk: true }),
  }), 
  'Multiple Select': objectValidator<DatabaseRecordFields['Multiple Select']>({
    type: exactMatchValidator(['Multiple Select']),
    label: stringValidator250,
    hideFromTable: booleanValidatorOptional,
    options: objectValidator<DatabaseRecordFields['Multiple Select']['options']>({
      width: stringValidatorOptionalEmptyOkay,
      options: listOfStringsValidatorEmptyOk,
    }, { isOptional: true, emptyOk: true }),
  }), 
})
export const databaseFieldsValidator = listValidator(databaseFieldValidator)


export const databaseRecordValueValidator = orValidator<{ [K in DatabaseRecordFieldType]: DatabaseRecordValues[K] } >({
  Text: objectValidator<DatabaseRecordValues['Text']>({
    type: exactMatchValidator(['Text']),
    value: stringValidator5000OptionalEmptyOkay,
    label: stringValidator250,
  }), 
  'Text Long': objectValidator<DatabaseRecordValues['Text Long']>({
    type: exactMatchValidator(['Text Long']),
    value: stringValidator5000OptionalEmptyOkay,
    label: stringValidator250,
  }), 
  'Text List': objectValidator<DatabaseRecordValues['Text List']>({
    type: exactMatchValidator(['Text List']),
    value: listOfStringsValidatorOptionalOrEmptyOk,
    label: stringValidator250,
  }), 
  'Number': objectValidator<DatabaseRecordValues['Number']>({
    type: exactMatchValidator(['Number']),
    value: numberValidatorOptional,
    label: stringValidator250,
  }), 
  'Address': objectValidator<DatabaseRecordValues['Address']>({
    type: exactMatchValidator(['Address']),
    value: addressOptionalValidator,
    label: stringValidator250,
  }), 
  'Multiple Select': objectValidator<DatabaseRecordValues['Multiple Select']>({
    type: exactMatchValidator(['Multiple Select']),
    value: listOfStringsValidatorEmptyOk,
    label: stringValidator250,
  }), 
})
export const databaseRecordValuesValidator = listValidator(databaseRecordValueValidator)

export const organizationAccessValidator = objectValidator<OrganizationAccess>({
  create: booleanValidatorOptional,
  update: booleanValidatorOptional,
  read: booleanValidatorOptional,
  delete: booleanValidatorOptional,
})

const _PORTAL_PAGES: { [K in PortalPage]: any } = {
  "Care Plan": true,
  "Appointment Booking": true,
  Documents: true,
  Education: true,
  Home: true,
  Community: true,
  Communications: true,
}
export const PORTAL_PAGES = Object.keys(_PORTAL_PAGES) as PortalPage[]
export const portalPageValidator = exactMatchValidator<PortalPage>(PORTAL_PAGES)

const _FORM_TYPES: { [K in FormType]: any } = {
  note: true,
  enduserFacing: true,
}
export const FORM_TYPES = Object.keys(_FORM_TYPES) as FormType[]
export const formTypeValidator = exactMatchValidator<FormType>(FORM_TYPES)


export const portalBlockValidator = orValidator<{ [K in PortalBlockType]: PortalBlockForType[K] } >({
  carePlan: objectValidator<PortalBlockForType['carePlan']>({
    type: exactMatchValidator(['carePlan']),
    info: objectValidator<PortalBlockForType['carePlan']['info']>({}, { emptyOk: true })
  }), 
  education: objectValidator<PortalBlockForType['education']>({
    type: exactMatchValidator(['education']),
    info: objectValidator<PortalBlockForType['education']['info']>({}, { emptyOk: true })
  }), 
  Events: objectValidator<PortalBlockForType['Events']>({
    type: exactMatchValidator(['Events']),
    info: objectValidator<PortalBlockForType['Events']['info']>({}, { emptyOk: true })
  }), 
  careTeam: objectValidator<PortalBlockForType['careTeam']>({
    type: exactMatchValidator(['careTeam']),
    info: objectValidator<PortalBlockForType['careTeam']['info']>({
      title: stringValidator,
      // members: listValidatorEmptyOk(
      //   objectValidator<CareTeamMemberPortalCustomizationInfo>({
      //     title: stringValidator(),
      //     role: stringValidator({ isOptional: true }),
      //   })()
      // )()
    })
  }), 
  text: objectValidator<PortalBlockForType['text']>({
    type: exactMatchValidator(['text']),
    info: objectValidator<PortalBlockForType['text']['info']>({
      text: stringValidator5000,
    })
  }), 
})
export const portalBlocksValidator = listValidatorEmptyOk(portalBlockValidator)

const _PORTAL_BLOCK_TYPES: { [K in PortalBlockType]: any } = {
  carePlan: '',
  careTeam: '',
  education: '',
  text: '',
  Events: '',
}
export const PORTAL_BLOCK_TYPES = Object.keys(_PORTAL_BLOCK_TYPES) as PortalBlockType[]
export const portalTypeValidator = exactMatchValidator<PortalBlockType>(PORTAL_BLOCK_TYPES)


export const enduserTaskForEventValidator = objectValidator<EnduserTaskForEvent>({
  id: mongoIdStringRequired,
  enduserId: mongoIdStringRequired,
})
export const enduserTasksForEventValidator = listValidatorEmptyOk(enduserTaskForEventValidator)

export const enduserFormResponseForEventValidator = objectValidator<EnduserFormResponseForEvent>({
  enduserId: mongoIdStringRequired,
  formId: mongoIdStringRequired,
  accessCode: stringValidator1000,
})
export const enduserFormResponsesForEventValidator = listValidatorEmptyOk(enduserFormResponseForEventValidator)

export const genericUnitWithQuantityValidator = objectValidator<GenericQuantityWithUnit>({
  value: numberOrStringValidatorEmptyOkay,
  unit: stringValidator1000,
})

export const stateCredentialValidator = objectValidator<StateCredentialInfo>({
  expiresAt: dateValidatorOptional,
  licenseId: stringValidatorOptionalEmptyOkay,
  state: stateValidator,
})
export const stateCredentialsValidator = listValidatorEmptyOk(stateCredentialValidator)

export const baseAvailabilityBlockValidator = objectValidator<BaseAvailabilityBlock>({
  durationInMinutes: nonNegNumberValidator,
  startTimeInMS: nonNegNumberValidator,
  userId: mongoIdStringRequired,
})
export const baseAvailabilityBlocksValidator = listValidatorEmptyOk(baseAvailabilityBlockValidator)

export const weeklyAvailabilityValidator = objectValidator<WeeklyAvailability>({
  dayOfWeekStartingSundayIndexedByZero: nonNegNumberValidator,
  endTimeInMinutes: nonNegNumberValidator,
  startTimeInMinutes: nonNegNumberValidator,
  locationId: mongoIdStringOptional,
  active: dateRangeOptionalValidator,
  validTemplateIds: listOfMongoIdStringValidatorOptionalOrEmptyOk,
})
export const weeklyAvailabilitiesValidator = listValidatorEmptyOk(weeklyAvailabilityValidator)

export const timezoneValidator = exactMatchValidator<Timezone>(Object.keys(TIMEZONE_MAP) as Timezone[])

export const accessValidator = exactMatchValidator<AccessType>([
  ALL_ACCESS, DEFAULT_ACCESS, ASSIGNED_ACCESS, NO_ACCESS,
])

const _CUSTOM_ENDUSER_FIELD_TYPES: { [K in CustomEnduserFieldType]: any } = {
  "Select": true,
  "Multiple Select": true,
  "Text": true,
  "Multiple Text": true,
  "Date": true,
  "Auto Detect": true,
  Table: true,
  File: true,
}
export const CUSTOM_ENDUSER_FIELD_TYPES = Object.keys(_CUSTOM_ENDUSER_FIELD_TYPES) as CustomEnduserFieldType[]
export const customEnduserFieldTypeValidator = exactMatchValidator<CustomEnduserFieldType>(CUSTOM_ENDUSER_FIELD_TYPES)

const _AVAILABILITY_BLOCK_ENTITIES: { [K in AvailabilityBlock['entity']]: any } = {
  organization: true,
  user: true,
}
export const AVAILABILITY_BLOCK_ENTITIES = Object.keys(_AVAILABILITY_BLOCK_ENTITIES) as AvailabilityBlock['entity'][]
export const availabilityEntitiesValidator = exactMatchValidator<AvailabilityBlock['entity']>(AVAILABILITY_BLOCK_ENTITIES)

export const indexUpdateValidator = objectValidator<IndexUpdate>({
  id: mongoIdStringRequired,
  index: nonNegNumberValidator,
})
export const indexUpdatesValidator = listValidator(indexUpdateValidator)

export const customEnduserFieldValidator = orValidator<{ [K in CustomEnduserFieldType]: CustomEnduserFields[K] } >({
  Select: objectValidator<CustomEnduserFields['Select']>({
    type: exactMatchValidator(['Select']),
    info: objectValidator<CustomEnduserFields['Select']['info']>({
      options: listOfStringsValidator,
      other: booleanValidatorOptional,
    }),
    field: stringValidator,
    required: booleanValidatorOptional,
    hiddenFromProfile: booleanValidatorOptional,
  }), 
  "Multiple Select": objectValidator<CustomEnduserFields['Multiple Select']>({
    type: exactMatchValidator(['Multiple Select']),
    info: objectValidator<CustomEnduserFields['Multiple Select']['info']>({
      options: listOfStringsValidator,
    }),
    field: stringValidator,
    required: booleanValidatorOptional,
    hiddenFromProfile: booleanValidatorOptional,
  }), 
  Text: objectValidator<CustomEnduserFields['Text']>({
    type: exactMatchValidator(['Text']),
    info: optionalEmptyObjectValidator,
    field: stringValidator,
    required: booleanValidatorOptional,
    hiddenFromProfile: booleanValidatorOptional,
  }), 
  File: objectValidator<CustomEnduserFields['File']>({
    type: exactMatchValidator(['File']),
    info: optionalEmptyObjectValidator,
    field: stringValidator,
    required: booleanValidatorOptional,
    hiddenFromProfile: booleanValidatorOptional,
  }), 
  "Multiple Text": objectValidator<CustomEnduserFields["Multiple Text"]>({
    type: exactMatchValidator(["Multiple Text"]),
    info: optionalEmptyObjectValidator,
    field: stringValidator,
    required: booleanValidatorOptional,
    hiddenFromProfile: booleanValidatorOptional,
  }), 
  Date: objectValidator<CustomEnduserFields['Date']>({
    type: exactMatchValidator(['Date']),
    info: optionalEmptyObjectValidator,
    field: stringValidator,
    required: booleanValidatorOptional,
    hiddenFromProfile: booleanValidatorOptional,
  }), 
  "Auto Detect": objectValidator<CustomEnduserFields["Auto Detect"]>({
    type: exactMatchValidator(["Auto Detect"]),
    info: optionalEmptyObjectValidator,
    field: stringValidator,
    required: booleanValidatorOptional,
    hiddenFromProfile: booleanValidatorOptional,
  }), 
  "Table": objectValidator<CustomEnduserFields["Table"]>({
    type: exactMatchValidator(["Table"]),
    info: objectValidator<CustomEnduserFields['Table']['info']>({
      columns: listValidator(tableInputChoiceValidator),
    }),
    field: stringValidator,
    required: booleanValidatorOptional,
    hiddenFromProfile: booleanValidatorOptional,
  }), 
})
export const customEnduserFieldsValidatorOptionalOrEmpty = listValidatorOptionalOrEmptyOk(customEnduserFieldValidator)

export const buildInFieldsValidator = listValidatorOptionalOrEmptyOk(objectValidator<EnduserBuiltInField>({
  field: stringValidator100,
  label: stringValidator100,
  hidden: booleanValidatorOptional,
  required: booleanValidatorOptional,
  requireConfirmation: booleanValidatorOptional,
}))

export const organizationSettingsValidator = objectValidator<OrganizationSettings>({
  endusers: objectValidator<OrganizationSettings['endusers']>({
    disableMultipleChatRooms: booleanValidatorOptional,
    disableCalendarEventAutoAssignment: booleanValidatorOptional,
    disableAdhocFields: booleanValidatorOptional,
    autoReplyEnabled: booleanValidatorOptional,
    recordCalls: booleanValidatorOptional,
    transcribeCalls: booleanValidatorOptional,
    showFreeNote: booleanValidatorOptional,
    customFields: customEnduserFieldsValidatorOptionalOrEmpty,
    builtinFields: buildInFieldsValidator,
    tags: listOfStringsValidatorOptionalOrEmptyOk,
    transcribeCallInboundPlayback: stringValidatorOptionalEmptyOkay,
    sendSMSOnZoomStart: booleanValidatorOptional,
    enableGroupMMS: booleanValidatorOptional,
    enableAccessTags: booleanValidatorOptional,
  }, { isOptional: true }),
  tickets: objectValidator<OrganizationSettings['tickets']>({
    defaultJourneyDueDateOffsetInMS: numberValidatorOptional,
    disableSnooze: booleanValidatorOptional,
    showCommunications: booleanValidatorOptional,
  }, { isOptional: true }),
  calendar: objectValidator<OrganizationSettings['calendar']>({
    dayStart: objectValidator<Required<OrganizationSettings>['calendar']['dayStart']>({
      hour: numberValidator, 
      minute: numberValidatorOptional, 
      // timezone: timezoneValidator, // weird stuff happens at the boundaries with timezones, leave out for now
    }, { isOptional: true }),
    dayEnd: objectValidator<Required<OrganizationSettings>['calendar']['dayEnd']>({
      hour: numberValidator, 
      minute: numberValidatorOptional, 
      // timezone: timezoneValidator, // weird stuff happens at the boundaries with timezones, leave out for now
    }, { isOptional: true }),
    bookingStartOffset: objectValidator<Required<OrganizationSettings>['calendar']['bookingStartOffset']>({
      month: numberValidatorOptional, 
      day: numberValidatorOptional, 
      hour: numberValidatorOptional, 
    }, { isOptional: true }),
    bookingEndOffset: objectValidator<Required<OrganizationSettings>['calendar']['bookingEndOffset']>({
      month: numberValidatorOptional, 
      day: numberValidatorOptional, 
      hour: numberValidatorOptional, 
    }, { isOptional: true }),
    templateRequired: booleanValidatorOptional,
    locationRequired: booleanValidatorOptional,
  }, { isOptional: true }),
  dashboard: objectValidator<OrganizationSettings['dashboard']>({
    view: objectValidator<Required<OrganizationSettings>['dashboard']['view']>({
      blocks: listValidatorOptionalOrEmptyOk(objectValidator<CustomDashboardViewBlock>({
        type: exactMatchValidator(['Inbox', 'Tickets']),
      }))
    }, { isOptional: true, emptyOk: true, }),
  }, { isOptional: true, emptyOk: true, }),
})

export const calendarEventPortalSettingsValidator = objectValidator<CalendarEventPortalSettings>({
  hideUsers: booleanValidatorOptional,
})

const _AUTOMATION_TRIGGER_EVENT_TYPES: { [K in AutomationTriggerEventType]: any } = {
  "Form Submitted": true,
  "Form Unsubmitted": true,
  "Purchase Made": true,
  "Appointment No-Showed": true,
  "Appointment Created": true,
  "Field Equals": true,
  "No Recent Appointment": true,
  "Medication Added": true,
  "On Birthday": true,
  "Has Not Engaged": true,
}
export const AUTOMATION_TRIGGER_EVENT_TYPES = Object.keys(_AUTOMATION_TRIGGER_EVENT_TYPES) as AutomationTriggerEventType[]

export const automationTriggerEventValidator = orValidator<{ [K in AutomationTriggerEventType]: AutomationTriggerEvents[K] } >({
  "Form Submitted": objectValidator<AutomationTriggerEvents["Form Submitted"]>({
    type: exactMatchValidator(['Form Submitted']),
    info: objectValidator<AutomationTriggerEvents['Form Submitted']['info']>({
      formId: mongoIdStringRequired,
      publicIdentifier: stringValidatorOptionalEmptyOkay,
      submitterType: sessionTypeOrAnyoneValidatorOptional,
    }),
    conditions: orValidator({
      optional: optionalAnyObjectValidator,
      included: objectAnyFieldsAnyValuesValidator,
    }, { isOptional: true }),
  }), 
  "Form Unsubmitted": objectValidator<AutomationTriggerEvents["Form Unsubmitted"]>({
    type: exactMatchValidator(['Form Unsubmitted']),
    info: objectValidator<AutomationTriggerEvents['Form Unsubmitted']['info']>({
      formId: mongoIdStringRequired,
      intervalInMS: nonNegNumberValidator,
    }),
    conditions: optionalEmptyObjectValidator,
  }), 
  "Field Equals": objectValidator<AutomationTriggerEvents["Field Equals"]>({
    type: exactMatchValidator(['Field Equals']),
    info: objectValidator<AutomationTriggerEvents['Field Equals']['info']>({
      field: stringValidator1000,
      value: stringValidator1000,
    }),
    conditions: optionalEmptyObjectValidator,
  }), 
  "No Recent Appointment": objectValidator<AutomationTriggerEvents["No Recent Appointment"]>({
    type: exactMatchValidator(['No Recent Appointment']),
    info: objectValidator<AutomationTriggerEvents['No Recent Appointment']['info']>({
      intervalInMS: nonNegNumberValidator,
      templateIds: listOfStringsValidatorOptionalOrEmptyOk,
      titles: listOfStringsValidatorOptionalOrEmptyOk,
    }),
    conditions: optionalEmptyObjectValidator,
  }), 
  "Purchase Made": objectValidator<AutomationTriggerEvents["Purchase Made"]>({
    type: exactMatchValidator(['Purchase Made']),
    info: optionalEmptyObjectValidator,
    conditions: optionalEmptyObjectValidator,
  }), 
  "Appointment No-Showed": objectValidator<AutomationTriggerEvents["Appointment No-Showed"]>({
    type: exactMatchValidator(['Appointment No-Showed']),
    info: optionalEmptyObjectValidator,
    conditions: optionalEmptyObjectValidator,
  }), 
  "Appointment Created": objectValidator<AutomationTriggerEvents["Appointment Created"]>({
    type: exactMatchValidator(['Appointment Created']),
    info: optionalEmptyObjectValidator,
    conditions: optionalEmptyObjectValidator,
  }), 
  "Medication Added": objectValidator<AutomationTriggerEvents["Medication Added"]>({
    type: exactMatchValidator(['Medication Added']),
    info: objectValidator<AutomationTriggerEvents['Medication Added']['info']>({
      titles: listOfStringsValidatorEmptyOk,
    }),
    conditions: optionalEmptyObjectValidator,
  }), 
  "On Birthday": objectValidator<AutomationTriggerEvents["On Birthday"]>({
    type: exactMatchValidator(['On Birthday']),
    info: objectValidator<AutomationTriggerEvents['On Birthday']['info']>({
      minutes: nonNegNumberValidator,
    }),
    conditions: optionalEmptyObjectValidator,
  }), 
  "Has Not Engaged": objectValidator<AutomationTriggerEvents["Has Not Engaged"]>({
    type: exactMatchValidator(['Has Not Engaged']),
    info: objectValidator<AutomationTriggerEvents['Has Not Engaged']['info']>({
      intervalInMS: nonNegNumberValidator,
    }),
    conditions: optionalEmptyObjectValidator,
  }), 
})

const _AUTOMATION_TRIGGER_ACTION_TYPES: { [K in AutomationTriggerActionType]: any } = {
  "Add To Journey": true,
  "Remove From Journey": true,
  "Move To Step": true,
  "Add Tags": true,
  "Add Access Tags": true,
  "Assign Care Team": true,
  "Remove From All Journeys": true
}
export const AUTOMATION_TRIGGER_ACTION_TYPES = Object.keys(_AUTOMATION_TRIGGER_ACTION_TYPES) as AutomationTriggerActionType[]

export const automationTriggerActionValidator = orValidator<{ [K in AutomationTriggerActionType]: AutomationTriggerActions[K] } >({
  "Add To Journey": objectValidator<AutomationTriggerActions["Add To Journey"]>({
    type: exactMatchValidator(['Add To Journey']),
    info: objectValidator<AutomationTriggerActions['Add To Journey']['info']>({
      journeyId: mongoIdStringRequired,
      doNotRestart: booleanValidatorOptional,
    }),
  }), 
  "Remove From Journey": objectValidator<AutomationTriggerActions["Remove From Journey"]>({
    type: exactMatchValidator(['Remove From Journey']),
    info: objectValidator<AutomationTriggerActions['Remove From Journey']['info']>({
      journeyId: mongoIdStringRequired,
    }),
  }), 
  "Move To Step": objectValidator<AutomationTriggerActions["Move To Step"]>({
    type: exactMatchValidator(['Move To Step']),
    info: optionalEmptyObjectValidator,
  }), 
  "Add Tags": objectValidator<AutomationTriggerActions["Add Tags"]>({
    type: exactMatchValidator(['Add Tags']),
    info: objectValidator<AutomationTriggerActions['Add Tags']['info']>({
      tags: listOfStringsValidator,
    }),
  }),
  "Add Access Tags": objectValidator<AutomationTriggerActions["Add Access Tags"]>({
    type: exactMatchValidator(['Add Access Tags']),
    info: objectValidator<AutomationTriggerActions['Add Access Tags']['info']>({
      tags: listOfStringsValidator,
    }),
  }),
  "Assign Care Team": objectValidator<AutomationTriggerActions["Assign Care Team"]>({
    type: exactMatchValidator(['Assign Care Team']),
    info: objectValidator<AutomationTriggerActions['Assign Care Team']['info']>({
      tags: listOfStringsWithQualifierValidator,
    }),
  }), 
  "Remove From All Journeys": objectValidator<AutomationTriggerActions["Remove From All Journeys"]>({
    type: exactMatchValidator(['Remove From All Journeys']),
    info: optionalEmptyObjectValidator,
  }), 
})


const _AUTOMATION_TRIGGER_STATUSES: { [K in AutomationTriggerStatus]: any } = {
  Active: true,
  Inactive: true,
}
export const AUTOMATION_TRIGGER_STATUSES = Object.keys(_AUTOMATION_TRIGGER_STATUSES) as AutomationTriggerStatus[]
export const automatioNTriggerStatusValidator = exactMatchValidator<AutomationTriggerStatus>(AUTOMATION_TRIGGER_STATUSES)

const _EMBEDDING_TYPES: { [K in EmbeddingType]: any } = {
  "text-embedding-ada-002": true,
}
export const EMBEDDING_TYPES = Object.keys(_EMBEDDING_TYPES) as EmbeddingType[]
export const embeddingTypeValidator = exactMatchValidator<EmbeddingType>(EMBEDDING_TYPES)

export const superbillPatientInfoValidator = objectValidator<SuperbillPatientInfo>({
  dateOfBirth: stringValidator,
  name: stringValidator,
  phone: stringValidator,
})
export const superbillProviderInfoValidator = objectValidator<SuperbillProviderInfo>({
  address: addressValidator,
  email: emailValidator,
  officeName: stringValidator1000,
  phone: stringValidator,
  placeOfServiceCode: stringValidatorOptionalEmptyOkay,
  providerLicense: stringValidator,
  providerName: stringValidator,
  providerNPI: stringValidator,
  taxId: stringValidator,
})
export const billingCodeValidator = objectValidator<SuperbillLineItem['billingCode']>({
  code: numberValidator, 
  label: stringValidator,
})
export const billingCodeValidatorOptional = objectValidator<SuperbillLineItem['billingCode']>({
  code: numberValidatorOptional, 
  label: stringValidatorOptional,
}, { emptyOk: true, isOptional: true })

const superbillLineItemValidator = objectValidator<SuperbillLineItem>({
  billingCode: billingCodeValidator,
  quantity: numberValidator,
  cost: objectValidator<SuperbillLineItem['cost']>({
    amount: numberValidator,
    currency: stringValidator,
  }),
  discount: numberValidatorOptional,
})
export const superbillLineItemsValidator = listValidator(superbillLineItemValidator)

const ticketSnoozeValidator = objectValidator<TicketSnooze>({
  at: dateValidator,
  until: dateValidator,
})
export const ticketSnoozesValidator = listValidatorOptionalOrEmptyOk(ticketSnoozeValidator)

// for each model name, this should be optional, but when a model name is provided, all CRUD fields should be required
// if this changes (e.g. CRUD fields are made optional), must merge better in authentication.ts in API
export const accessPermissionValidator = objectValidator<AccessForResource>({
  create: accessValidator,
  delete: accessValidator,
  read: accessValidator,
  update: accessValidator,
  showInSidebar: booleanValidatorOptional,
}, { isOptional: true })
export const accessPermissionsValidator = objectValidator<AccessPermissions>({
  enduser_custom_types: accessPermissionValidator,
  superbill_providers: accessPermissionValidator,
  superbills: accessPermissionValidator,
  availability_blocks: accessPermissionValidator,
  analytics_frames: accessPermissionValidator,
  endusers: accessPermissionValidator,
  enduser_status_updates: accessPermissionValidator,
  engagement_events: accessPermissionValidator,
  journeys: accessPermissionValidator,
  api_keys: accessPermissionValidator,
  emails: accessPermissionValidator,
  sms_messages: accessPermissionValidator,
  chat_rooms: accessPermissionValidator,
  chats: accessPermissionValidator,
  users: accessPermissionValidator,
  templates: accessPermissionValidator,
  files: accessPermissionValidator, 
  tickets: accessPermissionValidator,
  meetings: accessPermissionValidator, 
  notes: accessPermissionValidator, 
  forms: accessPermissionValidator,
  form_fields: accessPermissionValidator,
  form_responses: accessPermissionValidator,
  calendar_events: accessPermissionValidator,
  calendar_event_templates: accessPermissionValidator,
  calendar_event_RSVPs: accessPermissionValidator,
  automation_steps: accessPermissionValidator,
  automated_actions: accessPermissionValidator,
  webhooks: accessPermissionValidator, 
  user_logs: accessPermissionValidator,
  user_notifications: accessPermissionValidator,
  enduser_observations: accessPermissionValidator,
  managed_content_records: accessPermissionValidator,
  managed_content_record_assignments: accessPermissionValidator,
  forums: accessPermissionValidator,
  forum_posts: accessPermissionValidator,
  post_likes: accessPermissionValidator,
  comment_likes: accessPermissionValidator,
  post_comments: accessPermissionValidator,
  organizations: accessPermissionValidator,
  integrations: accessPermissionValidator,
  databases: accessPermissionValidator,
  database_records: accessPermissionValidator,
  portal_customizations: accessPermissionValidator,
  care_plans: accessPermissionValidator,
  enduser_tasks: accessPermissionValidator,
  role_based_access_permissions: accessPermissionValidator,
  appointment_booking_pages: accessPermissionValidator,
  appointment_locations: accessPermissionValidator,
  products: accessPermissionValidator,
  purchase_credits: accessPermissionValidator,
  purchases: accessPermissionValidator,
  phone_calls: accessPermissionValidator,
  background_errors: accessPermissionValidator,
  enduser_views: accessPermissionValidator,
  automation_triggers: accessPermissionValidator,
  enduser_profile_views: accessPermissionValidator,
  referral_providers: accessPermissionValidator,
  enduser_medications: accessPermissionValidator,
  phone_trees: accessPermissionValidator,
  table_views: accessPermissionValidator,
  email_sync_denials: accessPermissionValidator,
  ticket_thread_comments: accessPermissionValidator,
  ticket_threads: accessPermissionValidator,
  configurations: accessPermissionValidator,
  ticket_queues: accessPermissionValidator,
  group_mms_conversations: accessPermissionValidator,
  enduser_orders: accessPermissionValidator,

  // deprecated but for backwards compatibility
  apiKeys: accessPermissionValidator,
})

export const organizationLimitsValidator = objectValidator<OrganizationLimits>({
  group_mms_conversations: accessPermissionValidator,
  enduser_custom_types: numberValidatorOptional,
  referral_providers: numberValidatorOptional,
  superbill_providers: numberValidatorOptional,
  superbills: numberValidatorOptional,
  automation_triggers: numberValidatorOptional,
  background_errors: numberValidatorOptional,
  enduser_views: numberValidatorOptional,
  availability_blocks: numberValidatorOptional,
  analytics_frames: numberValidatorOptional,
  endusers: numberValidatorOptional,
  enduser_status_updates: numberValidatorOptional,
  engagement_events: numberValidatorOptional,
  journeys: numberValidatorOptional,
  api_keys: numberValidatorOptional,
  emails: numberValidatorOptional,
  sms_messages: numberValidatorOptional,
  chat_rooms: numberValidatorOptional,
  chats: numberValidatorOptional,
  users: numberValidatorOptional,
  templates: numberValidatorOptional,
  files: numberValidatorOptional, 
  tickets: numberValidatorOptional,
  meetings: numberValidatorOptional, 
  notes: numberValidatorOptional, 
  forms: numberValidatorOptional,
  form_fields: numberValidatorOptional,
  form_responses: numberValidatorOptional,
  calendar_events: numberValidatorOptional,
  calendar_event_templates: numberValidatorOptional,
  calendar_event_RSVPs: numberValidatorOptional,
  automation_steps: numberValidatorOptional,
  automated_actions: numberValidatorOptional,
  webhooks: numberValidatorOptional, 
  user_logs: numberValidatorOptional,
  user_notifications: numberValidatorOptional,
  enduser_observations: numberValidatorOptional,
  managed_content_records: numberValidatorOptional,
  managed_content_record_assignments: numberValidatorOptional,
  forums: numberValidatorOptional,
  forum_posts: numberValidatorOptional,
  post_likes: numberValidatorOptional,
  comment_likes: numberValidatorOptional,
  post_comments: numberValidatorOptional,
  organizations: numberValidatorOptional,
  integrations: numberValidatorOptional,
  databases: numberValidatorOptional,
  database_records: numberValidatorOptional,
  portal_customizations: numberValidatorOptional,
  care_plans: numberValidatorOptional,
  enduser_tasks: numberValidatorOptional,
  role_based_access_permissions: numberValidatorOptional,
  appointment_booking_pages: numberValidatorOptional,
  appointment_locations: numberValidatorOptional,
  products: numberValidatorOptional,
  purchase_credits: numberValidatorOptional,
  purchases: numberValidatorOptional,
  phone_calls: numberValidatorOptional,
  enduser_profile_views: numberValidatorOptional,
  enduser_medications: numberValidatorOptional,
  phone_trees: numberValidatorOptional,
  table_views: numberValidatorOptional,
  email_sync_denials: numberValidatorOptional,
  ticket_threads: numberValidatorOptional,
  ticket_thread_comments: numberValidatorOptional,
  configurations: numberValidatorOptional,
  ticket_queues: numberValidatorOptional,
  enduser_orders: numberValidatorOptional,
}, { emptyOk: true })

const _LOGIN_FLOW_RESULTS = {
  // "continue-set-password": true, // something we may turn on later / as requested
  "continue-with-password": true,
  "sent-email": true,
  "sent-sms": true
} as const
export type LoginFlowResult = keyof typeof _LOGIN_FLOW_RESULTS
export const LOGIN_FLOW_RESULTS = Object.keys(_LOGIN_FLOW_RESULTS) as LoginFlowResult[]
export const loginFlowResultValidator = exactMatchValidator<LoginFlowResult>(LOGIN_FLOW_RESULTS)

const _TELLESCOPE_GENDER: { [K in TellescopeGender]: any} = {
  Female: '',
  Male: '',
  Other: '',
  Unknown: '',
} 
export const TELLESCOPE_GENDER = Object.keys(_TELLESCOPE_GENDER) as TellescopeGender[]
export const tellescopeGenderValidator = exactMatchValidator<TellescopeGender>(TELLESCOPE_GENDER)
export const tellescopeGenderOptionalValidator = exactMatchValidatorOptional<TellescopeGender | ''>([...TELLESCOPE_GENDER, ''])

export const appointmentTermsValidator = listValidatorEmptyOk(objectValidator<AppointmentTerm>({
  link: stringValidator5000,
  title: stringValidator1000,
}))

const _CURRENCIES: { [K in Currency]: any} = {
  USD: '',
} 
export const CURRENCIES = Object.keys(_CURRENCIES) as Currency[]
export const currencyValidator = exactMatchValidator<Currency>(CURRENCIES)

const _PAYMENT_PROCESSORS: { [K in PaymentProcessor]: any} = {
  Stripe: '',
  Square: '',
} 
export const PAYMENT_PROCESSORS = Object.keys(_PAYMENT_PROCESSORS) as PaymentProcessor[]
export const paymentProcessorValidator = exactMatchValidator<PaymentProcessor>(PAYMENT_PROCESSORS)

export const costValidator = objectValidator<Product['cost']>({
  amount: nonNegNumberValidator,
  currency: currencyValidator,
})

export const purchaseCreditValueValidator = orValidator<{ [K in PurcahseCreditType]: PurchaseCreditInfoForType[K] }>({
  Credit: objectValidator<PurchaseCreditInfoForType['Credit']>({
    type: exactMatchValidator(['Credit']),
    info: objectValidator<PurchaseCreditInfoForType['Credit']['info']>({
      amount: numberValidator,
      currency: currencyValidator,
    }),
  }), 
  // Voucher: objectValidator<PurchaseCreditInfoForType['Voucher']>({
  //   type: exactMatchValidator(['Voucher']),
  //   info: objectValidator<PurchaseCreditInfoForType['Voucher']['info']>({}),
  // }), 
})

export type IntegrationsTitleType = (
  typeof SQUARE_INTEGRATIONS_TITLE 
| typeof OUTLOOK_INTEGRATIONS_TITLE 
| typeof ZOHO_TITLE 
| typeof ZOOM_TITLE
| typeof ZENDESK_INTEGRATIONS_TITLE
| typeof FULLSCRIPT_INTEGRATIONS_TITLE
| typeof ZUS_TITLE
| typeof CANVAS_TITLE
)
export const integrationTitleValidator = exactMatchValidator<IntegrationsTitleType>([
  SQUARE_INTEGRATIONS_TITLE,
  OUTLOOK_INTEGRATIONS_TITLE,
  ZOHO_TITLE,
  ZOOM_TITLE,
  ZENDESK_INTEGRATIONS_TITLE,
  FULLSCRIPT_INTEGRATIONS_TITLE,
  ZUS_TITLE,
  CANVAS_TITLE,
])

const _VIDEO_INTEGRATION_TYPES: { [K in VideoIntegrationType]: any} = {
  Zoom: '',
  "No Integration": '',
} 
export const VIDEO_INTEGRATION_TYPES = Object.keys(_VIDEO_INTEGRATION_TYPES) as VideoIntegrationType[]
export const videoIntegrationTypesValidator = exactMatchValidator<VideoIntegrationType>(VIDEO_INTEGRATION_TYPES)

export const analyticsQueryResultsValidator = listValidator(objectValidator<AnalyticsQueryResultValue>({
  key: stringValidator100,
  timestamp: dateOptionalOrEmptyStringValidator,
  unit: stringValidator,
  value: numberValidator,
  numerator: numberValidatorOptional,
  denominator: numberValidatorOptional,
}))

export const scheduledJourneysValidator = listValidatorOptionalOrEmptyOk(objectValidator<ScheduledJourney>({
  journeyId: mongoIdStringRequired,
  addAt: dateValidator,
}))

export const formScoringValidator = listValidatorOptionalOrEmptyOk(objectValidator<FormScoring>({
  title: stringValidator100,
  fieldId: mongoIdStringRequired,
  response: stringValidatorOptional,
  score: orValidator({
    responseValue: stringValidator, // use the numerical response as the score
    number: numberValidator, // use the pre-defined number as the score for this response
  })
}))

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

export const basicFilterValidator = objectAnyFieldsAnyValuesValidator
export const compoundFilterValidator = objectAnyFieldsAnyValuesValidator

export const analyticsQueryValidator = orValidator<{ [K in AnalyticsQueryType]: AnalyticsQueryForType[K] } >({
  Endusers: objectValidator<AnalyticsQueryForType['Endusers']>({
    resource: exactMatchValidator<'Endusers'>(['Endusers']),
    filter: objectValidator<AnalyticsQueryFilterForType['Endusers']>({
      activeSince: dateOptionalOrEmptyStringValidator,
      gender: tellescopeGenderOptionalValidator,
      fields: listValidatorOptionalOrEmptyOk(objectValidator({
        key: stringValidator1000,
        value: stringValidator5000EmptyOkay,
        range: dateRangeOptionalValidator, 
      })),
      "Submitted Forms": objectValidator<AnalyticsQueryFilterForType['Endusers']['Submitted Forms']>({
        qualifier: listQueryQualifiersValidator,
        formIds: listOfMongoIdStringValidator,
        formResponseCondition: orValidator({
          optional: optionalAnyObjectValidator,
          included: objectAnyFieldsAnyValuesValidator,
        }, { isOptional: true }),
      }, { isOptional: true }),
      "assignedTo": objectValidator<AnalyticsQueryFilterForType['Endusers']['assignedTo']>({
        qualifier: listQueryQualifiersValidator,
        userIds: listOfMongoIdStringValidator,
      }, { isOptional: true }),
      "born": objectValidator<AnalyticsQueryFilterForType['Endusers']['born']>({
        from: dateOptionalOrEmptyStringValidator,
        to: dateOptionalOrEmptyStringValidator,
      }, { isOptional: true }),
      tags: listOfStringsWithQualifierValidatorOptional,
    }, { isOptional: true, emptyOk: true }),
    info: orValidator<{ [K in keyof AnalyticsQueryInfoForType['Endusers']]: AnalyticsQueryInfoForType['Endusers'][K] }>({
      "Total": objectValidator<AnalyticsQueryInfoForType['Endusers']['Total']>({
        method: exactMatchValidator<"Total">(['Total']),
        parameters: optionalEmptyObjectValidator,
      }),
    }),
    grouping: objectValidator<AnalyticsQueryGroupingForType['Endusers']>({
      Gender: booleanValidatorOptional,
      "Assigned To": booleanValidatorOptional,
      Field: stringValidatorOptionalEmptyOkay,
      Tags: booleanValidatorOptional,
      Age: booleanValidatorOptional,
    }, { isOptional: true, emptyOk: true }),
    range: objectValidator<AnalyticsQueryRange<any>>({
      interval: exactMatchValidator<AnalyticsQueryRangeInterval>(['Daily', 'Weekly', 'Monthly']),
      key: exactMatchValidator<AnalyticsQueryRangeKeyForType['Endusers']>(['Created At', 'Updated At']),
    }, { isOptional: true, emptyOk: true })
  }), 
  "Calendar Events": objectValidator<AnalyticsQueryForType['Calendar Events']>({
    resource: exactMatchValidator<'Calendar Events'>(['Calendar Events']),
    filter: objectValidator<AnalyticsQueryFilterForType['Calendar Events']>({
      templateIds: listOfMongoIdStringValidatorOptionalOrEmptyOk,
      starts: dateRangeOptionalValidator,
      wasSelfScheduled: booleanValidatorOptional,
      wasCancelled: booleanValidatorOptional,
      wasNoShowed: booleanValidatorOptional,
      wasRescheduled: booleanValidatorOptional,
      userIds: listOfMongoIdStringValidatorOptionalOrEmptyOk,
    }, { isOptional: true, emptyOk: true }),
    info: orValidator<{ [K in keyof AnalyticsQueryInfoForType['Calendar Events']]: AnalyticsQueryInfoForType['Calendar Events'][K] }>({
      "Total": objectValidator<AnalyticsQueryInfoForType['Calendar Events']['Total']>({
        method: exactMatchValidator<"Total">(['Total']),
        parameters: optionalEmptyObjectValidator,
      }),
    }),
    grouping: objectValidator<AnalyticsQueryGroupingForType['Calendar Events']>({
      Type: booleanValidatorOptional,
    }, { isOptional: true, emptyOk: true }),
    range: objectValidator<AnalyticsQueryRange<any>>({
      interval: exactMatchValidator<AnalyticsQueryRangeInterval>(['Daily', 'Weekly', 'Monthly']),
      key: exactMatchValidator<AnalyticsQueryRangeKeyForType['Calendar Events']>(['Created At', 'Updated At']),
    }, { isOptional: true, emptyOk: true })
  }), 
  "Form Responses": objectValidator<AnalyticsQueryForType['Form Responses']>({
    resource: exactMatchValidator<'Form Responses'>(['Form Responses']),
    filter: objectValidator<AnalyticsQueryFilterForType['Form Responses']>({
      formIds: listOfMongoIdStringValidatorOptionalOrEmptyOk,
      formResponseCondition: orValidator({
        optional: optionalAnyObjectValidator,
        included: objectAnyFieldsAnyValuesValidator,
      }, { isOptional: true }),
    }, { isOptional: true, emptyOk: true }),
    info: orValidator<{ [K in keyof AnalyticsQueryInfoForType['Form Responses']]: AnalyticsQueryInfoForType['Form Responses'][K] }>({
      "Total": objectValidator<AnalyticsQueryInfoForType['Form Responses']['Total']>({
        method: exactMatchValidator<"Total">(['Total']),
        parameters: optionalEmptyObjectValidator,
      }),
    }),
    grouping: objectValidator<AnalyticsQueryGroupingForType['Form Responses']>({
      "Public Identifier": booleanValidatorOptional,
      Enduser: booleanValidatorOptional,
      Gender: booleanValidatorOptional,
      "Assigned To": booleanValidatorOptional,
      Field: stringValidatorOptionalEmptyOkay,
      Tags: booleanValidatorOptional,
      Age: booleanValidatorOptional,
    }, { isOptional: true, emptyOk: true }),
    range: objectValidator<AnalyticsQueryRange<any>>({
      interval: exactMatchValidator<AnalyticsQueryRangeInterval>(['Daily', 'Weekly', 'Monthly']),
      key: exactMatchValidator<AnalyticsQueryRangeKeyForType['Form Responses']>(['Created At', 'Updated At']),
    }, { isOptional: true, emptyOk: true })
  }), 
  "Purchases": objectValidator<AnalyticsQueryForType['Purchases']>({
    resource: exactMatchValidator<'Purchases'>(['Purchases']),
    filter: objectValidator<AnalyticsQueryFilterForType['Purchases']>({ }, { isOptional: true, emptyOk: true }),
    info: orValidator<{ [K in keyof AnalyticsQueryInfoForType['Purchases']]: AnalyticsQueryInfoForType['Purchases'][K] }>({
      "Total": objectValidator<AnalyticsQueryInfoForType['Purchases']['Total']>({
        method: exactMatchValidator<"Total">(['Total']),
        parameters: optionalEmptyObjectValidator,
      }),
    }),
    grouping: objectValidator<AnalyticsQueryGroupingForType['Purchases']>({
      Enduser: booleanValidatorOptional,
      Cost: booleanValidatorOptional,
      Gender: booleanValidatorOptional,
      "Assigned To": booleanValidatorOptional,
      Field: stringValidatorOptionalEmptyOkay,
      Tags: booleanValidatorOptional,
      Age: booleanValidatorOptional,
    }, { isOptional: true, emptyOk: true }),
    range: objectValidator<AnalyticsQueryRange<any>>({
      interval: exactMatchValidator<AnalyticsQueryRangeInterval>(['Daily', 'Weekly', 'Monthly']),
      key: exactMatchValidator<AnalyticsQueryRangeKeyForType['Calendar Events']>(['Created At', 'Updated At']),
    }, { isOptional: true, emptyOk: true })
  }), 
  "Purchase Credits": objectValidator<AnalyticsQueryForType['Purchase Credits']>({
    resource: exactMatchValidator<'Purchase Credits'>(['Purchase Credits']),
    filter: objectValidator<AnalyticsQueryFilterForType['Purchase Credits']>({ }, { isOptional: true, emptyOk: true }),
    info: orValidator<{ [K in keyof AnalyticsQueryInfoForType['Purchase Credits']]: AnalyticsQueryInfoForType['Purchase Credits'][K] }>({
      "Total": objectValidator<AnalyticsQueryInfoForType['Purchase Credits']['Total']>({
        method: exactMatchValidator<"Total">(['Total']),
        parameters: optionalEmptyObjectValidator,
      }),
    }),
    grouping: objectValidator<AnalyticsQueryGroupingForType['Purchase Credits']>({
      Enduser: booleanValidatorOptional,
      Gender: booleanValidatorOptional,
      "Assigned To": booleanValidatorOptional,
      Field: stringValidatorOptionalEmptyOkay,
      Tags: booleanValidatorOptional,
      Age: booleanValidatorOptional,
    }, { isOptional: true, emptyOk: true }),
    range: objectValidator<AnalyticsQueryRange<any>>({
      interval: exactMatchValidator<AnalyticsQueryRangeInterval>(['Daily', 'Weekly', 'Monthly']),
      key: exactMatchValidator<AnalyticsQueryRangeKeyForType['Purchase Credits']>(['Created At', 'Updated At']),
    }, { isOptional: true, emptyOk: true })
  }), 
  "Tickets": objectValidator<AnalyticsQueryForType['Tickets']>({
    resource: exactMatchValidator<'Tickets'>(['Tickets']),
    filter: objectValidator<AnalyticsQueryFilterForType['Tickets']>({ }, { isOptional: true, emptyOk: true }),
    info: orValidator<{ [K in keyof AnalyticsQueryInfoForType['Tickets']]: AnalyticsQueryInfoForType['Tickets'][K] }>({
      "Total": objectValidator<AnalyticsQueryInfoForType['Tickets']['Total']>({
        method: exactMatchValidator<"Total">(['Total']),
        parameters: optionalEmptyObjectValidator,
      }),
    }),
    grouping: objectValidator<AnalyticsQueryGroupingForType['Tickets']>({
      Enduser: booleanValidatorOptional,
      Gender: booleanValidatorOptional,
      "Assigned To": booleanValidatorOptional,
      Field: stringValidatorOptionalEmptyOkay,
      Tags: booleanValidatorOptional,
      Age: booleanValidatorOptional,
    }, { isOptional: true, emptyOk: true }),
    range: objectValidator<AnalyticsQueryRange<any>>({
      interval: exactMatchValidator<AnalyticsQueryRangeInterval>(['Daily', 'Weekly', 'Monthly']),
      key: exactMatchValidator<AnalyticsQueryRangeKeyForType['Tickets']>(['Created At', 'Updated At']),
    }, { isOptional: true, emptyOk: true })
  }), 
  "Emails": objectValidator<AnalyticsQueryForType['Emails']>({
    resource: exactMatchValidator<'Emails'>(['Emails']),
    filter: objectValidator<AnalyticsQueryFilterForType['Emails']>({ }, { isOptional: true, emptyOk: true }),
    info: orValidator<{ [K in keyof AnalyticsQueryInfoForType['Emails']]: AnalyticsQueryInfoForType['Emails'][K] }>({
      "Total": objectValidator<AnalyticsQueryInfoForType['Emails']['Total']>({
        method: exactMatchValidator<"Total">(['Total']),
        parameters: optionalEmptyObjectValidator,
      }),
    }),
    grouping: objectValidator<AnalyticsQueryGroupingForType['Emails']>({
      Enduser: booleanValidatorOptional,
      Gender: booleanValidatorOptional,
      "Assigned To": booleanValidatorOptional,
      Field: stringValidatorOptionalEmptyOkay,
      Tags: booleanValidatorOptional,
      Age: booleanValidatorOptional,
    }, { isOptional: true, emptyOk: true }),
    range: objectValidator<AnalyticsQueryRange<any>>({
      interval: exactMatchValidator<AnalyticsQueryRangeInterval>(['Daily', 'Weekly', 'Monthly']),
      key: exactMatchValidator<AnalyticsQueryRangeKeyForType['Emails']>(['Created At', 'Updated At']),
    }, { isOptional: true, emptyOk: true })
  }), 
  "Phone Calls": objectValidator<AnalyticsQueryForType['Phone Calls']>({
    resource: exactMatchValidator<'Phone Calls'>(['Phone Calls']),
    filter: objectValidator<AnalyticsQueryFilterForType['Phone Calls']>({ }, { isOptional: true, emptyOk: true }),
    info: orValidator<{ [K in keyof AnalyticsQueryInfoForType['Phone Calls']]: AnalyticsQueryInfoForType['Phone Calls'][K] }>({
      "Total": objectValidator<AnalyticsQueryInfoForType['Phone Calls']['Total']>({
        method: exactMatchValidator<"Total">(['Total']),
        parameters: optionalEmptyObjectValidator,
      }),
      "Duration": objectValidator<AnalyticsQueryInfoForType['Phone Calls']['Duration']>({
        method: exactMatchValidator<"Duration">(['Duration']),
        parameters: optionalEmptyObjectValidator,
      }),
    }),
    grouping: objectValidator<AnalyticsQueryGroupingForType['Phone Calls']>({
      Enduser: booleanValidatorOptional,
      Gender: booleanValidatorOptional,
      "Assigned To": booleanValidatorOptional,
      Field: stringValidatorOptionalEmptyOkay,
      Tags: booleanValidatorOptional,
      Age: booleanValidatorOptional,
    }, { isOptional: true, emptyOk: true }),
    range: objectValidator<AnalyticsQueryRange<any>>({
      interval: exactMatchValidator<AnalyticsQueryRangeInterval>(['Daily', 'Weekly', 'Monthly']),
      key: exactMatchValidator<AnalyticsQueryRangeKeyForType['Phone Calls']>(['Created At', 'Updated At']),
    }, { isOptional: true, emptyOk: true })
  }), 
  "SMS Messages": objectValidator<AnalyticsQueryForType['SMS Messages']>({
    resource: exactMatchValidator<'SMS Messages'>(['SMS Messages']),
    filter: objectValidator<AnalyticsQueryFilterForType['SMS Messages']>({ }, { isOptional: true, emptyOk: true }),
    info: orValidator<{ [K in keyof AnalyticsQueryInfoForType['SMS Messages']]: AnalyticsQueryInfoForType['SMS Messages'][K] }>({
      "Total": objectValidator<AnalyticsQueryInfoForType['SMS Messages']['Total']>({
        method: exactMatchValidator<"Total">(['Total']),
        parameters: optionalEmptyObjectValidator,
      }),
    }),
    grouping: objectValidator<AnalyticsQueryGroupingForType['SMS Messages']>({
      Score: booleanValidatorOptional,
      Enduser: booleanValidatorOptional,
      Gender: booleanValidatorOptional,
      "Assigned To": booleanValidatorOptional,
      Field: stringValidatorOptionalEmptyOkay,
      Tags: booleanValidatorOptional,
      Age: booleanValidatorOptional,
    }, { isOptional: true, emptyOk: true }),
    range: objectValidator<AnalyticsQueryRange<any>>({
      interval: exactMatchValidator<AnalyticsQueryRangeInterval>(['Daily', 'Weekly', 'Monthly']),
      key: exactMatchValidator<AnalyticsQueryRangeKeyForType['SMS Messages']>(['Created At', 'Updated At']),
    }, { isOptional: true, emptyOk: true })
  }), 
  "Medications": objectValidator<AnalyticsQueryForType['Medications']>({
    resource: exactMatchValidator<'Medications'>(['Medications']),
    filter: objectValidator<AnalyticsQueryFilterForType['Medications']>({ }, { isOptional: true, emptyOk: true }),
    info: orValidator<{ [K in keyof AnalyticsQueryInfoForType['Medications']]: AnalyticsQueryInfoForType['Medications'][K] }>({
      "Total": objectValidator<AnalyticsQueryInfoForType['Medications']['Total']>({
        method: exactMatchValidator<"Total">(['Total']),
        parameters: optionalEmptyObjectValidator,
      }),
    }),
    grouping: objectValidator<AnalyticsQueryGroupingForType['Medications']>({
      Enduser: booleanValidatorOptional,
      Gender: booleanValidatorOptional,
      "Assigned To": booleanValidatorOptional,
      Field: stringValidatorOptionalEmptyOkay,
      Tags: booleanValidatorOptional,
      Age: booleanValidatorOptional,
    }, { isOptional: true, emptyOk: true }),
    range: objectValidator<AnalyticsQueryRange<any>>({
      interval: exactMatchValidator<AnalyticsQueryRangeInterval>(['Daily', 'Weekly', 'Monthly']),
      key: exactMatchValidator<AnalyticsQueryRangeKeyForType['Medications']>(['Created At', 'Updated At']),
    }, { isOptional: true, emptyOk: true })
  }), 
})
export const analyticsQueriesValidatorOptional = listValidatorOptionalOrEmptyOk(analyticsQueryValidator)

const _ANALYTICS_FRAME_TYPES: { [K in AnalyticsFrameType]: any } = {
  Percentage: '',
}
export const ANALYTICS_FRAME_TYPES = Object.keys(_ANALYTICS_FRAME_TYPES) as AnalyticsFrameType[]
export const analyticsFrameTypeValidator = exactMatchValidator<AnalyticsFrameType>(ANALYTICS_FRAME_TYPES)

const _ANALYTICS_QUERY_TYPES: { [K in AnalyticsQueryType]: any } = {
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
}
export const ANALYTICS_QUERY_TYPES = Object.keys(_ANALYTICS_QUERY_TYPES) as AnalyticsQueryType[]
export const analyticsQueryTypeValidator = exactMatchValidator<AnalyticsQueryType>(ANALYTICS_QUERY_TYPES)

const _USER_CALL_ROUTING_BEHAVIORS: { [K in UserCallRoutingBehavior]: any } = {
  "": '',
  All: '',
  Assigned: '',
  Unassigned: '',
}
export const USER_CALL_ROUTING_BEHAVIORS = Object.keys(_USER_CALL_ROUTING_BEHAVIORS) as UserCallRoutingBehavior[]
export const userCallRoutingBehaviorValidator = exactMatchValidator<UserCallRoutingBehavior>(USER_CALL_ROUTING_BEHAVIORS)

export const userUIRestrictionsValidator = objectValidator<UserUIRestrictions>({
  hideDashboard: booleanValidatorOptional,
  hideInbox: booleanValidatorOptional,
  hideTeamChat: booleanValidatorOptional,
  hideEnduserChat: booleanValidatorOptional,
  disableTicketDueDate: booleanValidatorOptional,
  disableUnstructuredNotes: booleanValidatorOptional,
  hiddenFields: listValidatorOptionalOrEmptyOk(objectValidator<TypedField>({
    field: stringValidator,
    type: mongoIdStringOptional,
  })),
  disabledFields: listValidatorOptionalOrEmptyOk(objectValidator<TypedField>({
    field: stringValidator,
    type: mongoIdStringOptional,
  })),
}, { emptyOk: true })

const externalChatGPTMessageValidator = objectValidator<ExternalChatGPTMessage>({
  role: exactMatchValidator<ExternalChatGPTMessage['role']>(['assistant', 'user']),
  content: stringValidator5000,
})
export const externalChatGPTMessagesValidator = listValidator(externalChatGPTMessageValidator)

export const sharedEnduserProfileViewBlockFields = {
  width: stringValidator1000Optional,
}

export const enduserProfileViewBlockValidator = orValidator<{ [K in EnduserProfileViewBlockType]: EnduserProfileViewBlocks[K] } >({
  "Field Group": objectValidator<EnduserProfileViewBlocks["Field Group"]>({
    ...sharedEnduserProfileViewBlockFields,
    type: exactMatchValidator(['Field Group']),
    info: objectValidator<EnduserProfileViewBlocks['Field Group']['info']>({
      title: stringValidator100,
      fields: listOfStringsValidator, 
      displayFields: listValidatorOptionalOrEmptyOk(
        objectValidator<{ field: string, display: string }>({
          field: stringValidator,
          display: stringValidator,
        })
      )
    }),
  }), 
})
export const enduserProfileViewBlocksValidator = listValidator(enduserProfileViewBlockValidator)

const insuranceValidator = objectValidator<Insurance>({
  name: stringValidator100,
})
export const insurancesValidator = listValidator(insuranceValidator)

export const phoneTreeEventValidator = orValidator<{ [K in PhoneTreeEventType]: PhoneTreeEvents[K] } >({
  "Start": objectValidator<PhoneTreeEvents["Start"]>({
    type: exactMatchValidator(['Start']),
    info: optionalEmptyObjectValidator,
    parentId: stringValidator1000Optional,
  }), 
  "On Gather": objectValidator<PhoneTreeEvents["On Gather"]>({
    type: exactMatchValidator(['On Gather']),
    parentId: stringValidator100,
    info: objectValidator<PhoneTreeEvents["On Gather"]['info']>({
      digits: stringValidatorOptional,
      transcription: stringValidatorOptional,
    }),
  }), 
})
export const phoneTreeEventsValidator = listValidatorEmptyOk(phoneTreeEventValidator)

export const phonePlaybackValidator = orValidator<{ [K in PhonePlaybackType]: PhonePlaybackInfo[K] }>({
  Play: objectValidator<PhonePlaybackInfo['Play']>({
    type: exactMatchValidator(['Play']),
    info: objectValidator<PhonePlaybackInfo["Play"]['info']>({
      url: stringValidator5000,
      script: stringValidatorOptional,
    }),
  }), 
  Say: objectValidator<PhonePlaybackInfo['Say']>({
    type: exactMatchValidator(['Say']),
    info: objectValidator<PhonePlaybackInfo["Say"]['info']>({
      script: stringValidator5000,
      url: stringValidatorOptional,
    }),
  }), 
})
export const phonePlaybackValidatorOptional = orValidator<{ 
  [K in PhonePlaybackType | 'optional']: K extends PhonePlaybackType ? PhonePlaybackInfo[K] : {} 
}>({
  Play: objectValidator<PhonePlaybackInfo['Play']>({
    type: exactMatchValidator(['Play']),
    info: objectValidator<PhonePlaybackInfo["Play"]['info']>({
      url: stringValidator5000,
      script: stringValidatorOptional,
    }),
  }), 
  Say: objectValidator<PhonePlaybackInfo['Say']>({
    type: exactMatchValidator(['Say']),
    info: objectValidator<PhonePlaybackInfo["Say"]['info']>({
      script: stringValidator5000,
      url: stringValidatorOptional,
    }),
  }), 
  optional: optionalEmptyObjectValidator, 
}, { isOptional: true })

export const phoneTreeActionValidator = orValidator<{ [K in PhoneTreeActionType]: PhoneTreeActions[K] }>({
  // "Play": objectValidator<PhoneTreeActions["Play"]>({
  //   type: exactMatchValidator(['Play']),
  //   info: objectValidator<PhoneTreeActions["Play"]['info']>({
  //     playback: phonePlaybackValidator,
  //   }),
  // }), 
  "Gather": objectValidator<PhoneTreeActions["Gather"]>({
    type: exactMatchValidator(['Gather']),
    info: objectValidator<PhoneTreeActions["Gather"]['info']>({
      playback: phonePlaybackValidator,
      digits: booleanValidator,
      speech: booleanValidator,
    }),
  }), 
  "Voicemail": objectValidator<PhoneTreeActions["Voicemail"]>({
    type: exactMatchValidator(['Voicemail']),
    info: objectValidator<PhoneTreeActions["Voicemail"]['info']>({
      playback: phonePlaybackValidator,
    }),
  }),
  "Dial Users": objectValidator<PhoneTreeActions["Dial Users"]>({
    type: exactMatchValidator(['Dial Users']),
    info: objectValidator<PhoneTreeActions["Dial Users"]['info']>({
      userIds: listOfMongoIdStringValidatorEmptyOk,
      playback: phonePlaybackValidatorOptional,
    }),
  }),
})

export const phoneTreeNodeValidator = objectValidator<PhoneTreeNode>({
  id: stringValidator100,
  action: phoneTreeActionValidator,
  events: phoneTreeEventsValidator,
  flowchartUI: flowchartUIValidator,
})
export const phoneTreeNodesValidator = listValidatorEmptyOk(phoneTreeNodeValidator)

const _PHONE_TREE_ENDUSER_CONDITIONS: { [K in PhoneTreeEnduserCondition]: any } = {
  All: '',
  Unassigned: '',
}
export const PHONE_TREE_ENDUSER_CONDITIONS = Object.keys(_PHONE_TREE_ENDUSER_CONDITIONS) as PhoneTreeEnduserCondition[]
export const phoneTreeEnduserConditionValidator = exactMatchValidator<PhoneTreeEnduserCondition>(PHONE_TREE_ENDUSER_CONDITIONS)

export const formCustomizationValidator = objectValidator<Form['customization']>({
  publicFormHTMLDescription: stringValidator5000OptionalEmptyOkay, // all strings should be optional or empty ok!
  publicFormSubmitHTMLDescription: stringValidator5000OptionalEmptyOkay, // all strings should be optional or empty ok!
  publicLabelPrefix: stringValidator5000OptionalEmptyOkay, // all strings should be optional or empty ok!
  hideProgressBar: booleanValidatorOptional,
  hideLogo: booleanValidatorOptional,
  showRestartAtEnd: booleanValidatorOptional,
  multiPagePublicQuestions: booleanValidatorOptional,
  hideBg: booleanValidatorOptional,
})

export const languageValidator = objectValidator<Language>({
  displayName: stringValidator100,
  iso6391: stringValidator100,
})

export const tableViewColumnsValidator = listValidatorEmptyOk(objectValidator<TableViewColumn>({
  field: stringValidator100,
  width: numberValidatorOptional,
  type: stringValidatorOptionalEmptyOkay,
}))

export const formFieldCalloutConditionsValidator = listValidatorOptionalOrEmptyOk(objectValidator<FormFieldCalloutCondition>({
  comparison: exactMatchValidator<FormFieldCalloutConditionComparison>(['Equals']),
  value: stringValidator1000,
}))

export const endusersReportQueriesValidator = objectAnyFieldsValidator(objectValidator<EnduserReportQuery>({
  groupBy: stringValidatorOptional,
  createdAtBuckets: listValidatorOptionalOrEmptyOk(dateValidator),
  range: dateRangeOptionalValidator,
  activeSince: dateOptionalOrEmptyStringValidator,
  fields: listValidatorOptionalOrEmptyOk(objectValidator<{ field: string, value: string }>({ field: stringValidator, value: stringValidator })),
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
}))
export const formResponsesReportQueriesValidator = objectAnyFieldsValidator(objectValidator<FormResponsesReportQuery>({
  groupBy: stringValidatorOptional,
  range: dateRangeOptionalValidator,
  submittedAtRange: dateRangeOptionalValidator,
  answers: listOfStringsValidatorOptionalOrEmptyOk,
  submittedAtBuckets: listValidatorOptionalOrEmptyOk(dateValidator),
  createdAtBuckets: listValidatorOptionalOrEmptyOk(dateValidator),
}))
export const phoneCallsReportQueriesValidator = objectAnyFieldsValidator(objectValidator<PhoneCallsReportQuery>({
  groupBy: stringValidatorOptional,
  range: dateRangeOptionalValidator,
  createdAtBuckets: listValidatorOptionalOrEmptyOk(dateValidator),
}))

// duped in react components, forms, hooks
export const isDateString = (_s='') => {
  const s = _s.trim()

  if (!/^\d{2}-\d{2}-\d{4}$/.test(s)) {
    return false
  }

  // this seems to have inconsistent behavior in some mobile browsers, leave out for now
  // // ensure mm-dd-yyyy is actually valid
  // const [mm,dd,yyyy] = s.split('-').map(v => parseInt(v)) // don't shorthand, for radix argument of parseInt gets messed up
  // const d = Date.parse(`${yyyy}-${mm}-${dd}`) // this format should be explicitly supported by all implementations
  // if (isNaN(d)) return false
  
  return true
}

export const imageAttachmentValidator = objectValidator<ImageAttachment>({
  type: stringValidator,
  url: stringValidator,
})

export const mmsMessageValidator = objectValidator<GroupMMSMessage>({
  message: stringValidator1000,
  sender: mongoIdStringRequired,
  timestamp: nonNegNumberValidator,
  images: listValidatorOptionalOrEmptyOk(imageAttachmentValidator),
})
export const mmsMessagesValidator = listValidator(mmsMessageValidator)

export const groupMMSUserStateValidator = objectValidator<GroupMMSUserState>({
  numUnread: nonNegNumberValidator,
  id: stringValidator,
})
export const groupMMSUserStatesValidator = listValidatorOptionalOrEmptyOk(groupMMSUserStateValidator)

const sortingFieldValidator = objectValidator<SortingField>({
  ascending: booleanValidator,
  field: stringValidator1000,
  type: exactMatchValidator<SortingField['type']>(['date', 'number', 'string'])
})
export const sortingFieldsValidator = listValidatorEmptyOk(sortingFieldValidator)