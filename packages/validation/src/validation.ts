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
  ChatAttachmentType,
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
  AvailabilityBlock,
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
} from "@tellescope/types-models"
import {
  DatabaseRecord,
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
  DEFAULT_ACCESS,
  NO_ACCESS,
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

export const MAX_FILE_SIZE = 25000000 // 25 megabytes in bytes
const DEFAULT_MAX_LENGTH = 5000
type BuildValidator_T = {
  (escapeFunction: EscapeFunction, options: ValidatorOptionsForList): EscapeToList;
  (escapeFunction: EscapeFunction, options: ValidatorOptionsForValue): EscapeFunction;
}
export const build_validator: BuildValidator_T = (escapeFunction, options={} as ValidatorOptionsUnion): EscapeToList | EscapeFunction => {
  const { 
    shouldTruncate, isOptional, toLower,
    emptyStringOk, emptyListOk, nullOk,
    isObject, isNumber, listOf, isBoolean,
  } = options

  const minLength = options.minLength || 0
  const maxLength = options.maxLength || DEFAULT_MAX_LENGTH

  return (fieldValue: JSONType) => {
    if (isOptional && fieldValue === undefined) return undefined
    if (isOptional && fieldValue === null && !nullOk) return undefined
    if (nullOk && fieldValue === null) return null
    if ((emptyStringOk || isOptional) && fieldValue === '') return ''
    if (!emptyStringOk && fieldValue === '') throw `Expecting non-empty string but got ${fieldValue}`
    if (isObject && typeof fieldValue !== 'object') {
      try {
        if (typeof fieldValue !== 'string') throw ''

        fieldValue = JSON.parse(fieldValue) // seems necessary for parsing query string
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
export const orValidator = <T>(validators: { [K in keyof T]: ValidatorDefinition<T[K]> }): ValidatorDefinition<T[keyof T]> => ({
  validate: (o={}) => build_validator(
    value => {
      for (const field in validators) {
        const escape = validators[field]
        try {
          return escape.validate()(value)
        } catch(err) { 
          continue 
        }
      }
      throw `Value does not match any of the expected options`
    },
    { ...o, listOf: false }
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

export const objectValidator = <T extends object>(i: InputValidation<Required<T>>, objectOptions={ emptyOk: true } as ObjectOptions): ValidatorDefinition<T>  => ({
  validate: (o={}) => build_validator(
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
        const escaped = i[field].validate()(value) // may be required
        if (escaped === undefined) continue

        validated[field] = escaped
      }

      return validated
    }, { ...o, isObject: true, listOf: false, isOptional: !!objectOptions.isOptional || o.isOptional }
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
    escapeString(o), { ...o, maxLength: o.maxLength ?? 1000, listOf: false, isOptional: true } 
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
    escapeString(o), { ...o, maxLength: 1000, listOf: false, isOptional: true  } 
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
export const stringValidator25000EmptyOkay: ValidatorDefinition<string> = {
  validate: (o={}) => build_validator(
    escapeString(o), { ...o, maxLength: 25000, listOf: false, emptyStringOk: true } 
  ),
  getExample: getExampleString,
  getType: getTypeString,
}
export const SMSMessageValidator: ValidatorDefinition<string> = {
  validate: (o={}) => build_validator(
    escapeString(o), { ...o, maxLength: 630, listOf: false  } 
  ),
  getExample: getExampleString,
  getType: getTypeString,
}

export const listValidator = <T>(b: ValidatorDefinition<T>, o?: ValidatorOptions | ValidatorOptionsForList): ValidatorDefinition<T[]> => ({
  validate: o => build_validator(b.validate(o as any), { ...o, listOf: true }),
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

export const listOfStringsValidator = listValidator(stringValidator) 
export const listOfStringsValidatorOptionalOrEmptyOk = listValidatorOptionalOrEmptyOk(stringValidator) 
export const listOfStringsValidatorEmptyOk = listValidatorEmptyOk(stringValidator) 
export const listOfObjectAnyFieldsAnyValuesValidator = listValidator(objectAnyFieldsAnyValuesValidator)

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
export const listOfMongoIdStringValidatorEmptyOk = listValidatorEmptyOk(mongoIdStringRequired)

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
export const escape_name = (namestring: string) => namestring.replace(/[^a-zA-Z0-9-_ /.]/, '').substring(0, 100)

// enforces first-letter capitalization
export const nameValidator: ValidatorDefinition<string> = {
  validate: (options={}) => build_validator(
    name => {
      if (typeof name !== 'string') throw new Error('Expecting string value')

      name = escape_name(name)  
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
export const numberValidator = numberValidatorBuilder({ lower: -100000000, upper: 10000000000000 }) // max is 2286 in UTC MS
export const numberValidatorOptional = numberValidatorBuilder({ lower: -100000000, upper: 10000000000000, isOptional: true, emptyStringOk: true }) // max is 2286 in UTC MS
export const fileSizeValidator = numberValidatorBuilder({ lower: 0, upper: MAX_FILE_SIZE })

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
        throw `Invalid phone number`
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
        throw `Invalid phone number`
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
    { ...options, listOf: false }
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
  multiple_choice: '',
  number: '',
  phone: '',
  signature: '',
  string: '',
  stringLong: '',
  ranking: '',
  rating: '',
  date: '',
}
export const FORM_FIELD_TYPES = Object.keys(_FORM_FIELD_TYPES) as FormFieldType[]
export const formFieldTypeValidator = exactMatchValidator<FormFieldType>(FORM_FIELD_TYPES)

export const FORM_FIELD_VALIDATORS_BY_TYPE: { [K in FormFieldType | 'userEmail' | 'phoneNumber']: (value?: FormResponseValueAnswer[keyof FormResponseValueAnswer], options?: any, isOptional?: boolean) => any } = {
  'string': stringValidator.validate({ maxLength: 1000, emptyStringOk: true, errorMessage: "Response must not exceed 1000 characters" }),
  'stringLong': stringValidator.validate({ maxLength: 10000, emptyStringOk: true, errorMessage: "Response must not exceed 10000 characters" }),
  'number': numberValidator.validate({ errorMessage: "Response must be a number" }),
  'email': emailValidator.validate(),

  'userEmail': emailValidator.validate(), 
  'phone': phoneValidator.validate(),
  'phoneNumber': phoneValidator.validate(), // backwards compatibility with old field name for phone

  "date": dateValidator.validate(),
  "ranking": listOfStringsValidator.validate(),
  "rating": numberValidator.validate(),

  // fileInfo: FileResponse
  'file': (fileInfo: any, _, isOptional) => {
    if (isOptional && (!fileInfo || object_is_empty(fileInfo))) { 
      return { type: 'file', secureName: null }
    }
    return fileResponseValidator.validate()(fileInfo)
  },
  // sigInfo: SignatureResponse
  
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
          if (JSON.stringify(val).length > 1024) throw new Error(`object value for key ${k} exceeds the maximum length of 1024 characters in string representation`)
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
          throw new Error(`Expecting value to be a string or object but got ${typeof val} for key {k}`)
        }
      }

      return fields
    }, 
    { ...options, isObject: true, listOf: false }
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
export const idStringToDateValidator = indexableValidator(mongoIdStringRequired, dateValidator)

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

export const ENDUSER_FIELD_TYPES = {
  'email': 'email',
  'phone': 'phone',
  'fname': 'string',
  'lname': 'string',
} 
export const INTERNAL_NAME_TO_DISPLAY_FIELD = { 
  "string": 'Text',
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

// validate optional vs not at endpoint-level
export const formResponseAnswerValidator = orValidator<{ [K in FormFieldType]: FormResponseValueAnswer & { type: K } } >({
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
  stringLong: objectValidator<FormResponseAnswerStringLong>({
    type: exactMatchValidator(['stringLong']),
    value: stringValidator5000Optional,
  }),
  date: objectValidator<FormResponseAnswerDate>({
    type: exactMatchValidator(['date']),
    value: dateValidatorOptional,
  }),
  file: objectValidator<FormResponseAnswerFile>({
    type: exactMatchValidator(['file']),
    value: objectValidator<FormResponseAnswerFileValue>({
      name: stringValidator5000,
      secureName: stringValidator250,
    }, { emptyOk: false, isOptional: true }),
  }),
  multiple_choice: objectValidator<FormResponseAnswerMultipleChoice>({
    type: exactMatchValidator(['multiple_choice']),
    value: listOfStringsValidatorEmptyOk,
  }),
  ranking: objectValidator<FormResponseAnswerRanking>({
    type: exactMatchValidator(['ranking']),
    value:  listOfStringsValidatorOptionalOrEmptyOk,
  }),
  signature: objectValidator<FormResponseAnswerSignature>({
    type: exactMatchValidator(['signature']),
    value: objectValidator<FormResponseAnswerSignatureValue>({
      fullName: stringValidator250,
      signed: booleanValidator,
      pdfAttachment: stringValidatorOptional,
      signedPdfSecureName: stringReadonlyValidator, // created/set in backend only
    }, { emptyOk: false, isOptional: true }),
  }),
})

export const formResponseValidator = objectValidator<FormResponseValue>({
  fieldId: mongoIdStringRequired,
  fieldTitle: stringValidator5000,
  fieldDescription: stringValidator5000Optional,
  answer: formResponseAnswerValidator,
})
export const formResponsesValidator = listValidator(formResponseValidator)

export const intakePhoneValidator = exactMatchValidator<'optional' | 'required'>(['optional', 'required'])

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
  type: exactMatchValidator<ChatAttachmentType>(['image', 'video', 'file']),
  secureName: stringValidator250,
}) 
export const listOfChatAttachmentsValidator = listValidatorEmptyOk(chatAttachmentValidator)

export const genericAttachmentValidator = objectValidator<GenericAttachment>({ 
  displayName: stringValidator1000,
  fileId: mongoIdStringRequired,
  type: stringValidator100,
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
  afterAction: '',
  onJourneyStart: '',
  formUnsubmitted: '',
  ticketCompleted: '',
}
export const AUTOMATION_EVENTS = Object.keys(_AUTOMATION_EVENTS) as AutomationEventType[]
export const automationEventTypeValidator = exactMatchValidator<AutomationEventType>(AUTOMATION_EVENTS)

const _AUTOMATION_ACTIONS: { [K in AutomationActionType]: any } = {
  createTicket: '',
  sendEmail: '',
  sendSMS: '',
  sendForm: '',
  sendWebhook: '',
  setEnduserStatus: '',
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
  msBeforeStartTime: nonNegNumberValidator,
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
})
export const listOfCalendarEventRemindersValidator = listValidatorEmptyOk(calendarEventReminderValidator)

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
  afterAction: objectValidator<AfterActionAutomationEvent>({
    type: exactMatchValidator(['afterAction']),
    info: objectValidator<AfterActionEventInfo>(delayValidation, { emptyOk: false }),
  }),
  formUnsubmitted: objectValidator<FormUnsubmittedEvent>({
    type: exactMatchValidator(['formUnsubmitted']),
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
})
export const automationEventsValidator = listValidatorEmptyOk(automationEventValidator)

export const automationConditionValidator = orValidator<{ [K in AutomationConditionType]: AutomationCondition & { type: K } } >({
  atJourneyState: objectValidator<AtJourneyStateAutomationCondition>({
    type: exactMatchValidator(['atJourneyState']),
    info: objectValidator<AutomationForJourneyAndState>({ state: stringValidator100, journeyId: mongoIdStringRequired }, { emptyOk: false }),
  }),
})
export const listOfAutomationConditionsValidator = listValidatorEmptyOk(automationConditionValidator)

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
  sendForm: objectValidator<SendFormAutomationAction>({
    type: exactMatchValidator(['sendForm']),
    info: objectValidator<AutomationForFormRequest>({ 
      senderId: mongoIdStringRequired, 
      formId: mongoIdStringRequired,
      channel: communicationsChannelValidatorOptional,
    }, { emptyOk: false }),
  }),
  createTicket: objectValidator<CreateTicketAutomationAction>({
    type: exactMatchValidator(['createTicket']),
    info: objectValidator<CreateTicketActionInfo>({ 
      title: stringValidatorOptional,
      assignmentStrategy: orValidator<{ [K in CreateTicketAssignmentStrategyType ]: CreateTicketAssignmentStrategy & { type: K } }>({
        'care-team-random': objectValidator<CreateTicketAssignmentStrategy>({ 
          type: exactMatchValidator<CreateTicketAssignmentStrategyType>(['care-team-random']),
          info: objectValidator<object>({}, { emptyOk: true }),
        })
      }), 
      closeReasons: listOfStringsValidatorOptionalOrEmptyOk,
      defaultAssignee: mongoIdStringRequired,
    }, { emptyOk: false }),
  }),
  sendWebhook: objectValidator<SendWebhookAutomationAction>({
    type: exactMatchValidator(['sendWebhook']),
    info: objectValidator<AutomationForWebhook>({ message: stringValidator5000 }, { emptyOk: false }),
  }),
})

export const relatedRecordValidator = objectValidator<RelatedRecord>({
  type: stringValidator100,
  id: mongoIdStringRequired,
  creator: mongoIdStringOptional,
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
  }, { isOptional: true })
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
  type: exactMatchValidator(['oauth2']),
  info: objectValidator<OAuth2AuthenticationFields>({
    access_token: stringValidator250,
    refresh_token: stringValidator250,
    scope: stringValidator5000,
    expiry_date: nonNegNumberValidator,
    token_type: exactMatchValidator<'Bearer'>(['Bearer']),
    state: stringValidatorOptional,
    email: emailValidatorOptional,
  }),
})


export const formFieldOptionsValidator = objectValidator<FormFieldOptions>({
  choices: listOfStringsValidatorOptionalOrEmptyOk,
  from: numberValidatorOptional,
  to: numberValidatorOptional,
  other: booleanValidatorOptional,
  radio: booleanValidatorOptional,
  pdfAttachment: stringValidator5000Optional,
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
      width: numberValidatorOptional,
    }),
  }),
  pdf: objectValidator<BlockContentPDF>({
    type: exactMatchValidator(['pdf']),
    info: objectValidator<BlockContentPDF['info']>({
      link: stringValidator5000EmptyOkay,
      name: stringValidatorOptional,
      height: numberValidatorOptional,
      width: numberValidatorOptional,
    }),
  }),
  youtube: objectValidator<BlockContentYoutube>({
    type: exactMatchValidator(['youtube']),
    info: objectValidator<BlockContentYoutube['info']>({
      link: stringValidator5000EmptyOkay,
      name: stringValidatorOptional,
      height: numberValidatorOptional,
      width: numberValidatorOptional,
    }),
  }),
  iframe: objectValidator<BlockContentIFrame>({
    type: exactMatchValidator(['iframe']),
    info: objectValidator<BlockContentIFrame['info']>({
      link: stringValidator5000EmptyOkay,
      name: stringValidatorOptional,
      height: numberValidatorOptional,
      width: numberValidatorOptional,
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
  "string-long": '',
  number: '',
  string: '',
}
export const DATABASE_RECORD_FIELD_TYPES = Object.keys(_DATABASE_RECORD_FIELD_TYPES) as DatabaseRecordFieldType[]
export const databaseRecordFieldTypeValidator = exactMatchValidator<DatabaseRecordFieldType>(DATABASE_RECORD_FIELD_TYPES)
export const is_database_record_field_type = (type: any): type is DatabaseRecordFieldType => DATABASE_RECORD_FIELD_TYPES.includes(type)

// structure in this way to support potential differences in the future, like options which apply to only specific types
// export const databaseFieldValidator = orValidator<{ [K in DatabaseRecordFieldType]: DatabaseRecordFields[K] } >({
//   string: objectValidator<DatabaseRecordFields['string']>({
//     type: exactMatchValidator(['string'])(),
//     label: stringValidator250(),
//   })(), 
//   'string-long': objectValidator<DatabaseRecordFields['string-long']>({
//     type: exactMatchValidator(['string-long'])(),
//     label: stringValidator250(),
//   })(), 
//   'number': objectValidator<DatabaseRecordFields['number']>({
//     type: exactMatchValidator(['number'])(),
//     label: stringValidator250(),
//   })(), 
// })

// structure as above instead if need unique label or additional config based on type
export const databaseFieldValidator = objectValidator<DatabaseRecordField>({
  type: databaseRecordFieldTypeValidator,
  label: stringValidator250,
})
export const databaseFieldsValidator = listValidator(databaseFieldValidator)


export const databaseRecordValueValidator = orValidator<{ [K in DatabaseRecordFieldType]: DatabaseRecordValues[K] } >({
  string: objectValidator<DatabaseRecordValues['string']>({
    type: exactMatchValidator(['string']),
    value: stringValidator1000,
  }), 
  'string-long': objectValidator<DatabaseRecordValues['string-long']>({
    type: exactMatchValidator(['string-long']),
    value: stringValidator5000,
  }), 
  'number': objectValidator<DatabaseRecordValues['number']>({
    type: exactMatchValidator(['number']),
    value: numberValidator,
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
  value: stringValidator5000EmptyOkay,
  unit: stringValidator1000,
})

export const VALID_STATES: string[] = [
  "AK", 
  "AL", 
  "AR", 
  "AS", 
  "AZ", 
  "CA", 
  "CO", 
  "CT", 
  "DC", 
  "DE", 
  "FL", 
  "GA", 
  "GU", 
  "HI", 
  "IA", 
  "ID", 
  "IL", 
  "IN", 
  "KS", 
  "KY", 
  "LA", 
  "MA", 
  "MD", 
  "ME", 
  "MI", 
  "MN", 
  "MO", 
  "MP", 
  "MS", 
  "MT", 
  "NC", 
  "ND", 
  "NE", 
  "NH", 
  "NJ", 
  "NM", 
  "NV", 
  "NY", 
  "OH", 
  "OK", 
  "OR", 
  "PA", 
  "PR", 
  "RI", 
  "SC", 
  "SD", 
  "TN", 
  "TX", 
  "UM", 
  "UT", 
  "VA", 
  "VI", 
  "VT", 
  "WA", 
  "WI", 
  "WV",
  "WY",
]
export const stateValidator = exactMatchValidator(VALID_STATES)

export const stateCredentialValidator = objectValidator<StateCredentialInfo>({
  expiresAt: dateValidatorOptional,
  state: stateValidator,
})
export const stateCredentialsValidator = listValidatorEmptyOk(stateCredentialValidator)

export const availabilityBlockValidator = objectValidator<AvailabilityBlock>({
  durationInMinutes: nonNegNumberValidator,
  startTimeInMS: nonNegNumberValidator,
  userId: mongoIdStringRequired,
})
export const availabilityBlocksValidator = listValidatorEmptyOk(availabilityBlockValidator)

export const weeklyAvailabilityValidator = objectValidator<WeeklyAvailability>({
  dayOfWeekStartingSundayIndexedByZero: nonNegNumberValidator,
  endTimeInMinutes: nonNegNumberValidator,
  startTimeInMinutes: nonNegNumberValidator,
})
export const weeklyAvailabilitiesValidator = listValidatorEmptyOk(weeklyAvailabilityValidator)

export const timezoneValidator = exactMatchValidator<Timezone>(Object.keys(TIMEZONE_MAP) as Timezone[])

export const accessValidator = exactMatchValidator<AccessType>([
  ALL_ACCESS, DEFAULT_ACCESS, ASSIGNED_ACCESS, NO_ACCESS,
])

const _CUSTOM_ENDUSER_FIELD_TYPES: { [K in CustomEnduserFieldType]: any } = {
  "Select": true,
}
export const CUSTOM_ENDUSER_FIELD_TYPES = Object.keys(_CUSTOM_ENDUSER_FIELD_TYPES) as CustomEnduserFieldType[]
export const customEnduserFieldTypeValidator = exactMatchValidator<CustomEnduserFieldType>(CUSTOM_ENDUSER_FIELD_TYPES)

export const customEnduserFieldValidator = orValidator<{ [K in CustomEnduserFieldType]: CustomEnduserFields[K] } >({
  Select: objectValidator<CustomEnduserFields['Select']>({
    type: exactMatchValidator(['Select']),
    info: objectValidator<CustomEnduserFields['Select']['info']>({
      options: listOfStringsValidator,
    }),
    field: stringValidator,
    required: booleanValidatorOptional,
  }), 
})
export const customEnduserFieldsValidatorOptionalOrEmpty = listValidatorOptionalOrEmptyOk(customEnduserFieldValidator)

export const organizationSettingsValidator = objectValidator<OrganizationSettings>({
  endusers: objectValidator<OrganizationSettings['endusers']>({
    disableMultipleChatRooms: booleanValidatorOptional,
    customFields: customEnduserFieldsValidatorOptionalOrEmpty,
  }, { isOptional: true })
})

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
  endusers: accessPermissionValidator,
  enduser_status_updates: accessPermissionValidator,
  engagement_events: accessPermissionValidator,
  journeys: accessPermissionValidator,
  api_keys: accessPermissionValidator,
  tasks: accessPermissionValidator,
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

  // deprecated but for backwards compatibility
  apiKeys: accessPermissionValidator,
})

export const organizationLimitsValidator = objectValidator<OrganizationLimits>({
  endusers: numberValidatorOptional,
  enduser_status_updates: numberValidatorOptional,
  engagement_events: numberValidatorOptional,
  journeys: numberValidatorOptional,
  api_keys: numberValidatorOptional,
  tasks: numberValidatorOptional,
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
}, { emptyOk: true })