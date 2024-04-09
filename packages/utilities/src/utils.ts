import { CalendarEvent, CompoundFilter, Enduser, EnduserRelationship, FormField, FormResponseAnswerNumber, FormResponseAnswerString, FormResponseValue, FormResponseValueAnswer, ManagedContentRecord, MedicationResponse, Organization, Purchase, RoundRobinAssignmentInfo, TableInputCell, Ticket, Timezone, USA_STATE_TO_TIMEZONE, User, UserActivityInfo, UserActivityStatus } from "@tellescope/types-models"
import { ADMIN_ROLE, get_inverse_relationship_type } from "@tellescope/constants"
import sanitizeHtml from 'sanitize-html';

import { ObjectId } from "./ObjectId/objectid";
export { ObjectId }

export type Indexable<T=any> = { [index: string]: T }

export const user_is_admin = (u: { id: string, roles?: string[] } & ({ type: 'user' } | { type: 'enduser' })) => 
  u.type === 'enduser' ? false :  !!u?.roles?.includes(ADMIN_ROLE)

export const first_letter_capitalized = (s='') => s.charAt(0).toUpperCase() + s.slice(1)
export const first_letter_lowercase = (s='') => s.charAt(0).toLowerCase() + s.slice(1)

export const object_is_empty = (o : object) => Object.keys(o).length === 0 && o.constructor === Object

export const is_truthy = (f?: any) => !!f
export const is_defined = (f?: any) => f !== undefined
export const filter_object = (o={} as Indexable, validator=is_defined) => {
  const newObject = {} as Indexable
  for (const f in o) {
    const value = o[f]
    if (validator(value))
      newObject[f] = value  
  } 
  
  return newObject
}
export const is_object = (obj: any): obj is Indexable => typeof obj === "object" && obj !== null

// fields that are defined and match by equality
export const matching_fields = (fields: string[], o1: Indexable, o2: Indexable) => {
  const matches = {} as Indexable
  for (const k of fields) {
    if (o1[k] && o1[k] === o2[k]) { // may need deeper equality check for objects
      matches[k] = o1[k]
    }
  }
  return matches
}

const WHITE_SPACE_EXP = /^\s*$/
export const is_whitespace = (s='') => WHITE_SPACE_EXP.test(s)

export const url_safe_path = (p='' as string | string) => p.replace(/_/g, '-')

export const to_object_id = (s='') => new ObjectId(s)

export const objects_equivalent = (o1?: any, o2?: any) => {
  if (o1 === null || o2 === null) return o1 === o2 // null is base case for typeof === object

  // date case
  if (o1 instanceof Date && typeof o2 === 'string') {
    return o1.getTime() === new Date(o2).getTime()
  }
  if (o2 instanceof Date && typeof o1 === 'string') {
    return o2.getTime() === new Date(o1).getTime()
  }

  if (typeof o1 !== "object" || typeof o2 !== 'object') return o1 === o2 // base case  

  const k1 = Object.keys(o1), k2 = Object.keys(o2);
  for (const k of k1) { // keys must be equal sets
    if (!k2.includes(k)) return false
  }
  for (const k of k2) { // keys must be equal sets
    if (!k1.includes(k)) return false
  }
  
  for (const k of k1) { // recurse in case 
    if (!objects_equivalent(o1[k], o2[k])) {
      return false
    }
  }

  return true
}

export const user_display_name = (user?: { fname?: string, lname?: string, email?: string, phone?: string, id?: string, displayName?: string, internalDisplayName?: string } | null) => {
  if (!user) return ''
  const { fname, lname, email, phone, id, displayName, internalDisplayName } = user

  if (internalDisplayName) return internalDisplayName
  if (fname && lname) return `${fname} ${lname}`
  if (fname) return fname
  if (displayName) return displayName
  if (email) return email
  if (phone) return phone 
  if (id) return `User ${id}`

  return ''
}

export interface ActivityOptions {
  activeThresholdMS?: number, 
  inactiveThresholdMS?: number 
}
export const user_is_active = (user?: UserActivityInfo, options?: ActivityOptions): UserActivityStatus | null => {
  if (!user) return null 

  const activeThresholdMS = options?.activeThresholdMS || 300000 // 5 minutes
  const inactiveThresholdMS = options?.inactiveThresholdMS || 1500000 // 15 minutes
  if (activeThresholdMS < 0) throw new Error('activeThresholdMS must be positive')
  if (inactiveThresholdMS < 0) throw new Error('inactiveThresholdMS must be positive')

  const lastLogout = new Date(user.lastLogout).getTime()
  const lastActive = new Date(user.lastActive).getTime()

  if (lastLogout > lastActive) return 'Unavailable'
  if (Date.now() - lastActive < activeThresholdMS) return 'Active'
  if (Date.now() - lastActive < inactiveThresholdMS) return 'Away'

  return 'Unavailable'
}

export const defined_fields = <T extends {}>(o: T): Partial<T> => {
  const filtered = {} as Partial<T>
  for (const field in o) {
    if (o[field] !== undefined) filtered[field] = o[field]
  }
  return filtered
}

export const truncate_string = (s='', options={} as { showEllipsis?: boolean, length?: number }) => {
  if (typeof options.length === 'number' && options.length < 0) throw new Error("Length must be positive")

  const showEllipsis = options.showEllipsis ?? true
  const length = options.length ?? 25

  return (
    s.substring(0, length) + 
      (showEllipsis && s.length > length ? '...' : '')
  )
}

export const map_object = <T extends object, R>(object: T, handler: (key: keyof T, value: T[typeof key]) => R): R[] => (
  Object.keys(object).map((key) => handler(key as keyof typeof object, object[key as keyof typeof object]))
)

const [ LINK_START, LINK_END, TEXT_START, TEXT_END ] = [0, 1, 2, 3]
export const parse_link_template = (text: string, startFrom?: number) => {
  let start = 0
  let state = LINK_START
  let linkChars = []
  const linkTextChars = []
  
  for (let i = startFrom || 0; i < text.length; i++) {
    const char = text[i]
    if (state === LINK_START) {
      if (char === '{') {
        start = i;
        state = LINK_END
      }
    } 
    else if (state === LINK_END) {
      if (char === '}') {
        state = TEXT_START
      } else {
        linkChars.push(char)
      }
    } 
    else if (state === TEXT_START) {
      if (char === '[') {
        state = TEXT_END
      }
      else if (!is_whitespace(char)) { // only allow whitespace between {link} and [linkText]
        start = 0; linkChars = []; state = LINK_START; // start seeking new link
      }
    }
    else {
      if (char === ']') {
        return {
          url: linkChars.join(''),
          displayName: linkTextChars.join('')
        }
      } else {
        linkTextChars.push(char)
      }
    } 
  }

  return null
}

const findTemplateElement = (text: string) => {
  const startIndex = text.indexOf('{{')
  if (startIndex === -1) return undefined

  const endIndex = text.indexOf('}}')
  if (endIndex === -1) return undefined

  // omits start '{{' with +2, endIndex is not inclusive, so it omits last '}}' 
  return text.substring(startIndex + 2, endIndex) 
}

export const getTemplatedData = (text: string) => {
  const value = findTemplateElement(text)

  const badValue = (reason='') => { throw Error(`Unrecognized template field: ${value}${reason && ` (${reason})`}`) }

  if (value === undefined) return badValue()
  if (value.startsWith('forms')) {
    const [_, formId, _field, ...rest] = value.split('.')
    const field = _field + (
      rest.length 
        ? ('.' + rest.join('.'))
        : ''
    )
    
    if (field.startsWith('link')) { return { id: formId, displayName: field.substring(5) } }
    return badValue()
  }
  if (value.startsWith('files')) {
    const [_, fileId, field] = value.split('.')

    if (field.startsWith('link')) { return { id: fileId, displayName: field.substring(5) } }
    throw Error(`Unrecognized template field: ${value}`)
  } 
  if (value.startsWith('portal.')) {
    const [_, action, pageWithText] = value.split('.')

    if (action.startsWith('link') && pageWithText) { 
      const [page, displayName] = pageWithText.split(':').map(s => s.trim())

      if (page && displayName) {
        return { page, displayName } 
      }
    }
    throw Error(`Unrecognized template field: ${value}`)
  } 
  
  return badValue()
}

type ToTemplateString <T> = (data: T) => string
export const build_link_string: ToTemplateString<{ url: string, displayName: string }> = d => `{${d.url}}[${d.displayName}]`
export const build_form_link_string: ToTemplateString<{ id: string, displayName: string }> = d => `{{forms.${d.id}.link:${d.displayName}}}`
export const build_file_link_string: ToTemplateString<{ id: string, displayName: string }> = d => `{{files.${d.id}.link:${d.displayName}}}`
export const build_portal_link_string: ToTemplateString<{ page: string, displayName: string }> = d => `{{portal.link.${d.page}:${d.displayName}}}`

export const to_absolute_url = (link : string) => link.startsWith('http') ? link : '//' + link // ensure absolute url 

export const throwFunction = (s: string) => { throw s }

export const wait = (f?: Promise<void>, ms=1000) => new Promise<void>((resolve, reject) => {
  setTimeout(() => f ? f.then(resolve).catch(reject) : resolve(), ms)
})

export const sorted_records = <T extends { createdAt: string | Date, updatedAt: string | Date }>(
  records: T[],
  options?: { direction?: 'oldFirst' | 'newFirst', key?: (keyof T) & string, 
    reverseIfEqual?: boolean // assumes list of documents that are already in sorted order (new to old)
  }
) => {
  return [...records].sort((_r1, _r2) => {
    const r1 = options?.direction === 'oldFirst' ? _r2 : _r1
    const r2 = options?.direction === 'oldFirst' ? _r1 : _r2

    const result = (
        new Date(r1[options?.key ?? 'createdAt'] as string).getTime() 
      - new Date(r2[options?.key ?? 'createdAt'] as string).getTime() 
    )

    if (options?.reverseIfEqual && result === 0) return -1

    return result
  })
}

export const MONTHS_FULL = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]
export const get_time_values = (date: Date, options?: { fullMonth: boolean }) => {
  const dayOfMonth = date.getDate()
  const monthNumber = date.getMonth() + 1
  const month = (options?.fullMonth ? MONTHS_FULL : MONTHS)[monthNumber - 1]
  const hours = date.getHours()
  const minutesRaw = date.getMinutes()
  const minutes = minutesRaw >= 10 ? minutesRaw : `0${minutesRaw}`
  const year = date.getFullYear()

  const amPm = hours < 12 ? 'am' : 'pm' as const
  const hoursAmPm = (
    hours === 0
      ? 12
      : hours <= 12 ? hours : hours - 12
  )
  return { dayOfMonth, monthNumber, month, hours, hoursAmPm, amPm, minutes, year,  }
}

export const formatted_date = (date: Date): string => {
  const { dayOfMonth, month, year, hoursAmPm, amPm, minutes  } = get_time_values(date)
  if (
    isNaN(dayOfMonth) 
  || !month 
  || isNaN(year) 
  || isNaN(hoursAmPm) 
  || !amPm
  || (typeof minutes === 'number' && isNaN(minutes))
  ) {
    return ''
  }
  return `${month} ${dayOfMonth} ${year}, ${hoursAmPm}:${minutes}${amPm}`
}

export const yyyy_mm_dd = (date: Date): string => {
  const { dayOfMonth, month, year } = get_time_values(date)
  return `${year}-${month}-${dayOfMonth}`
}
export const mm_dd_yyyy = (date: Date): string => {
  const { dayOfMonth, monthNumber, year } = get_time_values(date)
  return `${monthNumber < 10 ? '0': ''}${monthNumber}-${dayOfMonth < 10 ? '0' : ''}${dayOfMonth}-${year}`
}

export const fullMonth_day_year = (date: Date): string => {
  const { dayOfMonth, month, year } = get_time_values(date, { fullMonth: true })
  return `${month} ${dayOfMonth}, ${year}`
}

export const time_for_calendar_event = (event: Pick<CalendarEvent, 'startTimeInMS' | 'durationInMinutes'>): string => {
  const start = new Date(event.startTimeInMS)
  const end = new Date(event.startTimeInMS + event.durationInMinutes * 60 * 1000)
  const { hoursAmPm, minutes, amPm } = get_time_values(start)
  const { hoursAmPm: hoursEnd, minutes: minutesEnd, amPm: amPmEnd } = get_time_values(end)

  return `${hoursAmPm}:${minutes}${amPm === amPmEnd ? '' : amPm}-${hoursEnd}:${minutesEnd}${amPmEnd}`
}

export const remove_script_tags = (s: string) => s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
export const remove_style_tags = (s: string) => s.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
export const remove_image_tags = (s: string) => s.replace(/<img[\s\S]*?>/gi, '')

export const query_string_for_object = (query: Indexable) => {
  let queryString = ''

  if (query && !object_is_empty(query)) {
    queryString = '?'
    for (const key in query) {
      queryString += `${key}=${query[key]}&`
    } 
  }

  return queryString
}

export const PROD_API_URL = 'https://api.tellescope.com' 
export const STAGING_API_URL = 'https://staging-api.tellescope.com' 
export const TEST_API_URL = "http://localhost:8080"

export const getEnvironment = () => (
  window.location.origin.includes('staging') 
    ? 'staging'
    : (window.location.origin.includes('localhost:') || window.location.origin.includes('127.0.0.1:')) // don't check for Tellescope, may be hosted on a custom URL
        ? 'test'
        : 'prod'
)
export const getApiURL = () => (
  window.location.origin.includes('staging') 
    ? STAGING_API_URL
    : (window.location.origin.includes('localhost:') || window.location.origin.includes('127.0.0.1:')) // don't check for Tellescope, may be hosted on a custom URL
      ? TEST_API_URL
      : PROD_API_URL
)
export const getGoogleClientId = () => {
  const api = getApiURL()
  return (
    api === PROD_API_URL 
      ? "526353775713-puib79782ac254evqj2fs0sb7acsij65.apps.googleusercontent.com"
  : api === STAGING_API_URL 
      ? '826276796073-6rcrqp4duqatbhn8k71saopenqc2fb0i.apps.googleusercontent.com'
      : '842986734352-2c73i6iq2aoau3dj1jvqtmufn2j9g0dm.apps.googleusercontent.com'
  )
}
export const getGoogleClientAPIKey = () => {
  const api = getApiURL()
  return (
    api === PROD_API_URL 
      ? 'AIzaSyCYCWiLkYifffepu5L-p1x4yUExf5aWpuA'
  : api === STAGING_API_URL 
      ? "AIzaSyDUCT6r5qQx8yniMuP-Y9Ni08THoLQtG6M" 
      : "AIzaSyBW9D0mg3ISvNQcSB0Z_PwHNuD0OhFdMKg"
  )
}

const PUBLIC_ASSET_BUCKET = "tellescope-public-files"
export const getBuiltInPublicFileName = ({ name, organizationIds } : { name: 'logo' | 'favicon', organizationIds?: string[] }) => (
  `${name}${organizationIds?.[organizationIds.length - 1] ?? ''}`
)
export const getOrgnizationLogoURL = ({ organizationIds, id, businessId, logoVersion, ...args } : { id: string, businessId: string, organizationIds?: string[], logoVersion?: number, apiURL?: string }) => (
  getPublicFileURL({ ...args, version: logoVersion, businessId: businessId ?? id, name: getBuiltInPublicFileName({ organizationIds, name: 'logo' })})
)
export const getOrgnizationFaviconURL = ({ organizationIds, businessId, id, faviconVersion, ...args } : { id: string, businessId: string, organizationIds?: string[], faviconVersion?: number, apiURL?: string }) => (
  getPublicFileURL({ ...args, version: faviconVersion, businessId: businessId ?? id, name: getBuiltInPublicFileName({ organizationIds, name: 'favicon' })})
)

export const getPublicFileURL = ({ businessId, name, version, apiURL } : { businessId: string, name: string, version?: number, apiURL?: string }) => {
  const api = apiURL || getApiURL()
  const ENV_PREFIX = api === PROD_API_URL ? "prod"
                   : api === STAGING_API_URL ? "staging"
                   : "test"

  return `https://${PUBLIC_ASSET_BUCKET}.s3.amazonaws.com/${ENV_PREFIX}/${businessId}/${name}?version=${version ?? 0}`
}

export const getDefaultPortalURL = ({ subdomain } : { subdomain: string }) => {
  const api = getApiURL()

  if (api === TEST_API_URL) return `http://localhost:3030`
  return (
    `https://${subdomain}.${api === PROD_API_URL ? 'portal' : 'staging-portal'}.tellescope.com`
  )
}

export const matches_organization = (value: { id: string, businessId: string, organizationIds?: string [] }, orgInfo: { businessId: string, organizationIds?: string [] }) => {
  // case of organization model itself where businessId isn't necessarily set
  if (value.id === orgInfo?.businessId && !orgInfo?.organizationIds) return true

  // case of using organization as orgInfo
  if (!orgInfo?.businessId && !value.organizationIds?.length) return true


  if (value?.businessId !== orgInfo?.businessId) return false
  if ((value?.organizationIds ?? []).length !== (orgInfo.organizationIds ?? []).length) return false
  
  // since length is same, we need a 1-way match that all organizationIds in orgInfo are found in value.organizationIds
  const mismatch = orgInfo.organizationIds?.find(id => !(value?.organizationIds ?? [])?.includes(id))
  if (mismatch) return false

  return true
}

export const is_suborganization = ({ parent, child } : { parent: string[], child: string[] } ) => {
  for (const value of parent) {
    if (!child.includes(value)) return false
  }
  return true
}

// !u.organizationIds?.length // [] or undefined  
// || ( // enduser is shared with the user's organization
//   (enduser.sharedWithOrganizations ?? [])
//   .find(sharedIds => 
//     u.organizationIds?.find(ids => objects_equivalent(sharedIds, ids))
//   )
export const user_has_record_access = (user: User, record: { businessId: string, organizationIds?: string [], sharedWithOrganizations?: string[][] }): boolean => {
  if (user.businessId !== record.businessId) return false
  if (!user.organizationIds?.length) return true // user is part of root organization

  if (record.organizationIds) {
    if (is_suborganization({ parent: user.organizationIds ?? [], child: record.organizationIds })) {
      return true
    }
  } 

  for (const organizationIds of record.sharedWithOrganizations ?? []) {
    // this must be an exact match
    if (objects_equivalent(organizationIds, user.organizationIds)) return true
  }

  return false
}

export const is_table_input_response = (v: any): v is TableInputCell[][] => (
  !!(Array.isArray(v) && Array.isArray(v[0]) && v[0][0].label)
)

export const form_response_value_to_string = (value: FormResponseValueAnswer['value'] | string | boolean | number | null | undefined | object): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return value.toString()

  const anyValue = value as Indexable
  if (anyValue?.value !== 'object' && anyValue?.unit
    && typeof anyValue?.value !== 'object' && typeof anyValue?.unit !== 'object'
  ) {
    return `${anyValue.value} ${anyValue.unit}`
  }

  if (anyValue?.text && anyValue?.recordId) return anyValue.text

  if (anyValue.name) { // file
    return anyValue.name
  } 
  else if (Array.isArray(anyValue)) {
    // VALUE MAY BE UNDEFINED
    
    const value = anyValue[0]
    if (value?.text && value?.recordId) { // DatabaseSelect repsonse
      console.log(anyValue)
      return (
        anyValue.map(row => (row.text || 'No response provided')).join(', ')
      )
    }

    if (Array.isArray(anyValue) && (anyValue[0]?.displayTerm || anyValue[0]?.drugName)) {
      return anyValue.map((medication = { } as MedicationResponse) => 
`${medication.drugName && medication.drugName !== 'Unknown' ? medication.drugName : medication.displayTerm}
${medication.dosage?.quantity ? `${medication.dosage.quantity} units` : ''}${medication.dosage?.frequency ? `${medication.dosage?.quantity ? ', ' : ''}${medication.dosage.frequency}x daily` : ''}
Reason: ${medication.reasonForTaking || 'Not provided'}`
      ).join('\n\n')
    }

    if (Array.isArray(value) && value[0].label) { // is Table Input response --> todo: replace with is_table_input_response
      return (
        anyValue
        .map(row => 
          row
          .map((c: any) => c.entry || 'No response provided')
          .join(', ')
        )
        .join('\n')
      )
    }

    return anyValue.join(', ')
  } else if (anyValue.fullName) { // signature
    return anyValue.fullName
  }

  if (typeof anyValue === 'object') {
    let response = `\n`
    for (const k in anyValue) {
      response += `${k}: ${anyValue[k]?.toString()}\n`
    }

    return response
    // return JSON.stringify(anyValue, null, 2)
  }

  return value?.toString() ?? ''
}

export const is_organization_owner = (organization: Organization, userId: string) => (
  organization.owner // when owner is defined, creator is not relevant / overridden
    ? organization.owner === userId
    : organization.creator === userId
)

export const update_local_storage = (key: string, value: string) => {
  try {
    window.localStorage[key] = value
  } catch(err) { }
}

export const read_local_storage = (key: string) => {
  try {
    return window.localStorage[key]
  } catch(err) { }
}

export const payment_cost_to_string = (c: Purchase['cost']): string => {
  if (c.currency === 'USD') {
    return `$${(c.amount / 100).toFixed(2)}`
  }
   
  return ''
}

export const safeJSONParse = (s: string) => {
  try {
    return JSON.parse(s)
  } catch(err) {
    return undefined
  }
}

export const timezone_for_enduser = (e: Pick<Enduser, 'state' | 'timezone'>) => (
  e.timezone 
    ? e.timezone 
    : (
      e.state
        ? USA_STATE_TO_TIMEZONE[e.state]
        : undefined
    )
)

export const sanitize_html = (t: string) => sanitizeHtml(t, { allowedTags: [], allowedAttributes: {} })

export const plaintext_for_managed_content_record = (record: Pick<ManagedContentRecord, 'type' | 'blocks'>) => {
  if (record.type === 'PDF') return null
  if (record.type === 'Video') return null

  if (!record.blocks?.length) return null

  return (
    record
    .blocks
    .filter(
      b => (
           b.type === 'h1' 
        || b.type === 'h2'
        || b.type === 'html'
      )
    )
    .map(
      b => (
        b.type === 'h1'
          ? b.info.text
      : b.type === 'h2'
          ? b.info.text
      :  b.type === 'html'
          ? sanitize_html(b.info.html)
          : ''

      )
    )
    .join('\n')
  )  
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export const shuffle_array_in_place = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export const evaluate_conditional_logic = <T extends string>(conditions: CompoundFilter<T>, evaluate: (key: string, value: T) => boolean): boolean => {
  const key = Object.keys(conditions)[0] as '$and' | '$or' | 'condition' | 'string' // string is form id
  if (key === '$and') {
    const andConditions = conditions[key] as CompoundFilter<string>[]
    for (const c of andConditions) {
      if (!evaluate_conditional_logic(c, evaluate)) {
        return false
      }
    }

    return true
  } else if (key === '$or') {
    const orConditions = conditions[key] as CompoundFilter<string>[]
    for (const c of orConditions) {
      if (evaluate_conditional_logic(c, evaluate)) {
        return true
      }
    }

    return false
  } else if (key === 'condition') {
    const evalKey = Object.keys(conditions[key] as object)[0]

    return evaluate(
      evalKey, 
      // @ts-ignore
      conditions[key][evalKey],
    )
  }

  return true
}

export const age_for_dob_mmddyyyy = (mmddyyyy: string) => {
  const [mm, dd, yyyy] = mmddyyyy.split('-').map(s => parseInt(s)) // ensure second argument to parseInt is not provided
  if (isNaN(mm) || isNaN(dd) || isNaN(yyyy)) return ''

  const monthIndexedByOne = new Date().getMonth() + 1

  const ageForYear = new Date().getFullYear() - yyyy
  const actualAge = (
    // dob is previous month, or dob is current month and day has passed
    (mm < monthIndexedByOne || (mm === monthIndexedByOne && dd <= new Date().getDate()))
      ? ageForYear 
      : ageForYear - 1
  )
  return actualAge
}

export const evaluate_conditional_logic_for_enduser_fields = (enduser: Omit<Enduser, 'id'>, conditions: Record<string, any>) => (
  evaluate_conditional_logic(
    conditions, 
    (key, value: string | Record<string, any>) => (
      (key === 'Age' && typeof value === 'object')
        ? (() => {
          if (!enduser.dateOfBirth) return false

          const age = age_for_dob_mmddyyyy(enduser.dateOfBirth)
          if (age === '') return false

          const result = (
            value?.['$lt'] !== undefined
              ? (age < parseInt(value['$lt']))
          : value?.['$gt'] !== undefined
              ? (age > parseInt(value['$gt']))
              : false
          )

          return result
        })()
      // : (key === 'Tags' && typeof value === 'object')
      //   ? (() => {
      //     if (!(value as ListOfStringsWithQualifier)?.values?.length) return true
          
      //     return (
      //       (value as ListOfStringsWithQualifier)?.qualifier === 'All Of'
      //         ? (
      //             !!enduser.tags?.length
      //           && enduser.tags?.filter(t => (value as ListOfStringsWithQualifier)?.values?.includes(t)).length === (value as ListOfStringsWithQualifier)?.values?.length
      //         )
      //         : !!enduser.tags?.find(t => (value as ListOfStringsWithQualifier)?.values?.includes(t))
      //     )
      //   })()
      : key === 'relationships' && typeof value === 'string'
        ? (
          !!enduser?.relationships?.find(r => r.type === get_inverse_relationship_type(value as any))
        )
      : typeof value === 'object'
        ? (() => {
          const k = Object.keys(value)[0]
          const v = Object.values(value)[0]

          if (key === 'Journeys' && (k === '$in' || k === '$nin')) {
            const isInJourney = enduser?.journeys?.[v] !== undefined 
            return (
                 (k === '$in'  && isInJourney)
              || (k === "$nin" && !isInJourney)
            )
          }

          if (k === '$before' || k === '$after') {
            const vDate = new Date(v)
            if (isNaN(vDate.getTime())) return false

            const eDateField = (enduser.fields?.[key] ?? enduser?.[key as keyof typeof enduser])         
            if (!eDateField) return false
            if (typeof eDateField !== 'string') return false

            const eDate = (
              (eDateField.includes('-') && eDateField.length === 10)
                ? new Date(MM_DD_YYYY_to_YYYY_MM_DD(eDateField))
                : new Date(eDateField)
            )
            if (isNaN(eDate.getTime())) return false

            return (
               (k === '$before' && eDate.getTime() < vDate.getTime())
            || (k === '$after' && eDate.getTime() > vDate.getTime())
            )
          }

          if (k === '$contains' || k === '$doesNotContain') {
            const enduserValue = (enduser.fields?.[key] ?? enduser?.[key as keyof typeof enduser])
            const contains = (
              Array.isArray(enduserValue)
                ? !!enduserValue.find((ev: string) => typeof ev === 'string' && ev.includes(v))
                : typeof enduserValue === 'string'
                  ? enduserValue.includes(v)
                  : enduserValue === v
            )

            return (
                (k === '$contains' && contains)
            ||  (k === '$doesNotContain' && !contains)
            )
          }

          if (k === '$isSet' || k === '$isNotSet') {
            const enduserValue = (enduser.fields?.[key] ?? enduser?.[key as keyof typeof enduser])
            const isSet = (
              Array.isArray(enduserValue)
                ? enduserValue.length > 0
                : !!enduserValue
            )

            return (k === "$isSet" && isSet) || (k === '$isNotSet' && !isSet)
          }

          // should negate the typeof value === 'string' (defaults to $equals) condition
          if (k === '$ne') {
            const enduserValue = (enduser.fields?.[key] ?? enduser?.[key as keyof typeof enduser])
            return !(
              enduserValue === v 
              || (
                Array.isArray(enduserValue) && (enduserValue).includes(v)
              )
            )
          }

          return false
        })()
      : typeof value === 'string'
          ? (
            (enduser.fields?.[key] ?? enduser?.[key as keyof typeof enduser]) === value
            || (
              Array.isArray(enduser.fields?.[key]) 
              && (enduser?.fields?.[key] as string[]).includes(value)
            )
            || (
              Array.isArray(enduser?.[key as keyof typeof enduser]) 
              && (enduser[key as keyof typeof enduser] as string[]).includes(value)
            ) 
            )
          : false
    )  
  )
)

export const getLocalTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone as Timezone

export const YYYY_MM_DD_to_MM_DD_YYYY = (yyyyMmDd: string, delimiter='-') => {
  const [yyyy, mm, dd] = yyyyMmDd.split(delimiter)
  return `${mm}-${dd}-${yyyy}`
}

export const MM_DD_YYYY_to_YYYY_MM_DD = (MMDDYYYY: string, delimiter='-') => {
  const [mm, dd, yyyy] = MMDDYYYY.split(delimiter)
  return `${yyyy}-${mm}-${dd}`
}

export const get_recent_engagement_date = (e: Enduser) => {
  const dates = []
  if (e.recentEventBookedAt) {
    dates.push(new Date(e.recentEventBookedAt).getTime())
  }
  if (e.recentFormSubmittedAt) {
    dates.push(new Date(e.recentFormSubmittedAt).getTime())
  }
  if (e.recentInboundCallAt) {
    dates.push(new Date(e.recentInboundCallAt).getTime())
  }
  if (e.recentInboundChatAt) {
    dates.push(new Date(e.recentInboundChatAt).getTime())
  }
  if (e.recentInboundSMSAt) {
    dates.push(new Date(e.recentInboundSMSAt).getTime())
  }
  if (e.recentInboundEmailAt) {
    dates.push(new Date(e.recentInboundEmailAt).getTime())
  }
  const max = dates.sort().pop()

  return max ? new Date(max) : undefined
}

export const get_recent_outbound_communication_date = (e: Enduser) => {
  const dates = []
  if (e.recentOutboundCallAt) {
    dates.push(new Date(e.recentOutboundCallAt).getTime())
  }
  if (e.recentOutboundChatAt) {
    dates.push(new Date(e.recentOutboundChatAt).getTime())
  }
  if (e.recentOutboundSMSAt) {
    dates.push(new Date(e.recentOutboundSMSAt).getTime())
  }
  if (e.recentOutboundEmailAt) {
    dates.push(new Date(e.recentOutboundEmailAt).getTime())
  }

  const max = dates.sort().pop()
  return max ? new Date(max) : undefined
}

// https://www.w3schools.com/tags/ref_urlencode.ASP
// AWS provides = instead of % for some reason, so handle accoringly
const URIReplacements = {
  "=21": "!",
  "=22": "\"",
  "=23": "#",
  "=24": "$",
  "=25": "%",
  "=26": "&",
  "=27": "'",
  "=28": "(",
  "=29": ")",
  "=2A": "*",
  "=2B": "=+",
  "=2C": ",",
  "=2D": "-",
  "=2E": ".",
  "=2F": "/",
  "=30": "0",
  "=31": "1",
  "=32": "2",
  "=33": "3",
  "=34": "4",
  "=35": "5",
  "=36": "6",
  "=37": "7",
  "=38": "8",
  "=39": "9",
  "=3A": ":",
  "=3B": ";",
  "=3C": "<",
  "=3D": "=",
  "=3E": ">",
  "=3F": "?",
  "=40": "@",
  "=41": "A",
  "=42": "B",
  "=43": "C",
  "=44": "D",
  "=45": "E",
  "=46": "F",
  "=47": "G",
  "=48": "H",
  "=49": "I",
  "=4A": "J",
  "=4B": "K",
  "=4C": "L",
  "=4D": "M",
  "=4E": "N",
  "=4F": "O",
  "=50": "P",
  "=51": "Q",
  "=52": "R",
  "=53": "S",
  "=54": "T",
  "=55": "U",
  "=56": "V",
  "=57": "W",
  "=58": "X",
  "=59": "Y",
  "=5A": "Z",
  "=5B": "[",
  "=5C": "\\",
  "=5D": "]",
  "=5E": "^",
  "=5F": "_",
  "=60": "`",
  "=61": "a",
  "=62": "b",
  "=63": "c",
  "=64": "d",
  "=65": "e",
  "=66": "f",
  "=67": "g",
  "=68": "h",
  "=69": "i",
  "=6A": "j",
  "=6B": "k",
  "=6C": "l",
  "=6D": "m",
  "=6E": "n",
  "=6F": "o",
  "=70": "p",
  "=71": "q",
  "=72": "r",
  "=73": "s",
  "=74": "t",
  "=75": "u",
  "=76": "v",
  "=77": "w",
  "=78": "x",
  "=79": "y",
  "=7A": "z",
  "=7B": "{",
  "=7C": "|",
  "=7D": "}", 
  "=7E": "~",
  "=7F": "",
  "=80": "", //"€",
  "=E2=82=AC": "", //"€",
  "=81": "",
  "=82": "", //"‚",
  "=E2=80=9A": "", //"‚",
  "=83": "", //"ƒ",
  "=C6=92": "", //"ƒ",
  "=84": "", //"„",
  "=E2=80=9E": "", //"„",
  "=85": "", //"…",
  "=E2=80=A6": "", //"…",
  "=86": "", //"†",
  "=E2=80=A0": "", //"†",
  "=87": "", //"‡",
  "=E2=80=A1": "", //"‡",
  "=88": "", //"ˆ",
  "=CB=86": "", //"ˆ",
  "=89": "", //"‰",
  "=E2=80=B0": "", //"‰",
  "=8A": "", //"Š",
  "=C5=A0": "", //"Š",
  "=8B": "", //"‹",
  "=E2=80=B9": "", //"‹",
  "=8C": "", //"Œ",
  "=C5=92": "", //"Œ",
  "=8D": "",
  "=C5=8D": "",
  "=8E": "Ž",
  "=C5=BD": "Ž",
  "=8F": "",
  "=90": "",
  "=C2=90": "",
  "=91": "‘",
  "=E2=80=98": "‘",
  "=92": "’",
  "=E2=80=99": "’",
  "=93": "“",
  "=E2=80=9C": "“",
  "=94": "”",
  "=E2=80=9D": "”",
  "=95": "•",
  "=E2=80=A2": "•",
  "=96": "–",
  "=E2=80=93": "–",
  "=97": "—",
  "=E2=80=94": "—",
  "=98": "˜",
  "=CB=9C": "˜",
  "=99": "™",
  "=E2=84": "™",
  "=9A": "", // "š",
  "=C5=A1": "", // "š",
  "=9B":"", // "›",
  "=E2=80":"", // "›",
  "=9C": "", //"œ",
  "=C5=93": "", //"œ",
  "=9D": "", //"",
  "=9E": "", //"ž",
  "=C5=BE": "", //"ž",
  "=9F": "", //"Ÿ",
  "=C5=B8": "", //"Ÿ",
  "=A0": "",
  "=C2=A0": "",
  "=A1": "", //"¡",
  "=C2=A1": "", //"¡",
  "=A2": "", //"¢",
  "=C2=A2": "", //"¢",
  "=A3": "", //"£",
  "=C2=A3": "", //"£",
  "=A4": "", //"¤",
  "=C2=A4": "", //"¤",
  "=A5": "", //"¥",
  "=C2=A5": "", //"¥",
  "=A6": "", //"¦",
  "=C2=A6": "", //"¦",
  "=A7": "", //"§",
  "=C2=A7": "", //"§",
  "=A8": "", //"¨",
  "=C2=A8": "", //"¨",
  "=A9": "", //"©",
  "=C2=A9": "", //"©",
  "=AA": "", //"ª",
  "=C2=AA": "", //"ª",
  "=AB": "", //"«",
  "=C2=AB": "", //"«",
  "=AC": "", //"¬",
  "=C2=AC": "", //"¬",
  "=AD": "", //"­",
  "=C2=AD": "", //"­",
  "=AE": "", //"®",
  "=C2=AE": "", //"®",
  "=AF": "", //"¯",
  "=C2=AF": "", //"¯",
  "=B0": "", //"°",
  "=C2=B0": "", //"°",
  "=B1": "", //"±",
  "=C2=B1": "", //"±",
  "=B2": "", //"²",
  "=C2=B2": "", //"²",
  "=B3": "", //"³",
  "=C2=B3": "", //"³",
  "=B4": "", //"´",
  "=C2=B4": "", //"´",
  "=B5": "", //"µ",
  "=C2=B5": "", //"µ",
  "=B6": "", //"¶",
  "=C2=B6": "", //"¶",
  "=B7": "", //"·",
  "=C2=B7": "", //"·",
  "=B8": "", //"¸",
  "=C2=B8": "", //"¸",
  "=B9": "", //"¹",
  "=C2=B9": "", //"¹",
  "=BA": "", //"º",
  "=C2=BA": "", //"º",
  "=BB": "", //"»",
  "=C2=BB": "", //"»",
  "=BC": "", //"¼",
  "=C2=BC": "", //"¼",
  "=BD": "", //"½",
  "=C2=BD": "", //"½",
  "=BE": "", //"¾",
  "=C2=BE": "", //"¾",
  "=BF": "", //"¿",
  "=C2=BF": "", //"¿",
  "=C0": "", //"À",
  "=C3=80": "", //"À",
  "=C1": "", //"Á",
  "=C3=81": "", //"Á",
  "=C2": "", //"Â",
  "=C3=82": "", //"Â",
  "=C3": "", //"Ã",
  "=C3=83": "", //"Ã",
  "=C4": "", //"Ä",
  "=C3=84": "", //"Ä",
  "=C5": "", //"Å",
  "=C3=85": "", //"Å",
  "=C6": "", //"Æ",
  "=C3=86": "", //"Æ",
  "=C7": "", //"Ç",
  "=C3=87": "", //"Ç",
  "=C8": "", //"È",
  "=C3=88": "", //"È",
  "=C9": "", //"É",
  "=C3=89": "", //"É",
  "=CA": "", //"Ê",
  "=C3=8A": "", //"Ê",
  "=CB": "", //"Ë",
  "=C3=8B": "", //"Ë",
  "=CC": "", //"Ì",
  "=C3=8C": "", //"Ì",
  "=CD": "", //"Í",
  "=C3=8D": "", //"Í",
  "=CE": "", //"Î",
  "=C3=8E": "", //"Î",
  "=CF": "", //"Ï",
  "=C3=8F": "", //"Ï",
  "=D0": "", //"Ð",
  "=C3=90": "", //"Ð",
  "=D1": "", //"Ñ",
  "=C3=91": "", //"Ñ",
  "=D2": "", //"Ò",
  "=C3=92": "", //"Ò",
  "=D3": "", //"Ó",
  "=C3=93": "", //"Ó",
  "=D4": "", //"Ô",
  "=C3=94": "", //"Ô",
  "=D5": "", //"Õ",
  "=C3=95": "", //"Õ",
  "=D6": "", //"Ö",
  "=C3=96": "", //"Ö",
  "=D7": "", //"×",
  "=C3=97": "", //"×",
  "=D8": "", //"Ø",
  "=C3=98": "", //"Ø",
  "=D9": "", //"Ù",
  "=C3=99": "", //"Ù",
  "=DA": "", //"Ú",
  "=C3=9A": "", //"Ú",
  "=DB": "", //"Û",
  "=C3=9B": "", //"Û",
  "=DC": "", //"Ü",
  "=C3=9C": "", //"Ü",
  "=DD": "", //"Ý",
  "=C3=9D": "", //"Ý",
  "=DE": "", //"Þ",
  "=C3=9E": "", //"Þ",
  "=DF": "", //"ß",
  "=C3=9F": "", //"ß",
  "=E0": "", //"à",
  "=C3=A0": "", //"à",
  "=E1": "", //"á",
  "=C3=A1": "", //"á",
  "=E2": "", //"â",
  "=C3=A2": "", //"â",
  "=E3": "", //"ã",
  "=C3=A3": "", //"ã",
  "=E4": "", //"ä",
  "=C3=A4": "", //"ä",
  "=E5": "", //"å",
  "=C3=A5": "", //"å",
  "=E6": "", //"æ",
  "=C3=A6": "", //"æ",
  "=E7": "", //"ç",
  "=C3=A7": "", //"ç",
  "=E8": "", //"è",
  "=C3=A8": "", //"è",
  "=E9": "", //"é",
  "=C3=A9": "", //"é",
  "=EA": "", //"ê",
  "=C3=AA": "", //"ê",
  "=EB": "", //"ë",
  "=C3=AB": "", //"ë",
  "=EC": "", //"ì",
  "=C3=AC": "", //"ì",
  "=ED": "", //"í",
  "=C3=AD": "", //"í",
  "=EE": "", //"î",
  "=C3=AE": "", //"î",
  "=EF": "", //"ï",
  "=C3=AF": "", //"ï",
  "=F0": "", //"ð",
  "=C3=B0": "", //"ð",
  "=F1": "", //"ñ",
  "=C3=B1": "", //"ñ",
  "=F2": "", //"ò",
  "=C3=B2": "", //"ò",
  "=F3": "", //"ó",
  "=C3=B3": "", //"ó",
  "=F4": "", //"ô",
  "=C3=B4": "", //"ô",
  "=F5": "", //"õ",
  "=C3=B5": "", //"õ",
  "=F6": "", //"ö",
  "=C3=B6": "", //"ö",
  "=F7": "", //"÷",
  "=C3=B7": "", //"÷",
  "=F8": "", //"ø",
  "=C3=B8": "", //"ø",
  "=F9": "", //"ù",
  "=C3=B9": "", //"ù",
  "=FA": "", //"ú",
  "=C3=BA": "", //"ú",
  "=FB": "", //"û",
  "=C3=BB": "", //"û",
  "=FC": "", //"ü",
  "=C3=BC": "", //"ü",
  "=FD": "", //"ý",
  "=C3=BD": "", //"ý",
  "=FE": "", //"þ",
  "=C3=BE": "", //"þ",
  "=FF": "", //"ÿ",
  "=C3=BF":"", // "ÿ"
}

export const URIDecodeEmail = (content: string, verbose?: boolean) => (
  content
  .replace(/=\s/gi, '')
  .replaceAll("\r\n", '')
  .replace(
    /=21|=3D|=22|=23|=24|=25|=26|=27|=28|=29|=2A|=2B|=2C|=2D|=2E|=2F|=30|=31|=32|=33|=34|=35|=36|=37|=38|=39|=3A|=3B|=3C|=3E|=3F|=40|=41|=42|=43|=44|=45|=46|=47|=48|=49|=4A|=4B|=4C|=4D|=4E|=4F|=50|=51|=52|=53|=54|=55|=56|=57|=58|=59|=5A|=5B|=5C|=5D|=5E|=5F|=60|=61|=62|=63|=64|=65|=66|=67|=68|=69|=6A|=6B|=6C|=6D|=6E|=6F|=70|=71|=72|=73|=74|=75|=76|=77|=78|=79|=7A|=7B|=7C|=7D|=7E|=7F|=80|=E2=82=AC|=81|=82|=E2=80=9A|=83|=C6=92|=84|=E2=80=9E|=85|=E2=80=A6|=86|=E2=80=A0|=87|=E2=80=A1|=88|=CB=86|=89|=E2=80=B0|=8A|=C5=A0|=8B|=E2=80=B9|=8C|=C5=92|=8D|=C5=8D|=8E|=C5=BD|=8F|=90|=C2=90|=91|=E2=80=98|=92|=E2=80=99|=93|=E2=80=9C|=94|=E2=80=9D|=95|=E2=80=A2|=96|=E2=80=93|=97|=E2=80=94|=98|=CB=9C|=99|=E2=84|=9A|=C5=A1|=9B|=E2=80|=9C|=C5=93|=9D|=9E|=C5=BE|=9F|=C5=B8|=A0|=C2=A0|=A1|=C2=A1|=A2|=C2=A2|=A3|=C2=A3|=A4|=C2=A4|=A5|=C2=A5|=A6|=C2=A6|=A7|=C2=A7|=A8|=C2=A8|=A9|=C2=A9|=AA|=C2=AA|=AB|=C2=AB|=AC|=C2=AC|=AD|=C2=AD|=AE|=C2=AE|=AF|=C2=AF|=B0|=C2=B0|=B1|=C2=B1|=B2|=C2=B2|=B3|=C2=B3|=B4|=C2=B4|=B5|=C2=B5|=B6|=C2=B6|=B7|=C2=B7|=B8|=C2=B8|=B9|=C2=B9|=BA|=C2=BA|=BB|=C2=BB|=BC|=C2=BC|=BD|=C2=BD|=BE|=C2=BE|=BF|=C2=BF|=C0|=C3=80|=C1|=C3=81|=C2|=C3=82|=C3|=C3=83|=C4|=C3=84|=C5|=C3=85|=C6|=C3=86|=C7|=C3=87|=C8|=C3=88|=C9|=C3=89|=CA|=C3=8A|=CB|=C3=8B|=CC|=C3=8C|=CD|=C3=8D|=CE|=C3=8E|=CF|=C3=8F|=D0|=C3=90|=D1|=C3=91|=D2|=C3=92|=D3|=C3=93|=D4|=C3=94|=D5|=C3=95|=D6|=C3=96|=D7|=C3=97|=D8|=C3=98|=D9|=C3=99|=DA|=C3=9A|=DB|=C3=9B|=DC|=C3=9C|=DD|=C3=9D|=DE|=C3=9E|=DF|=C3=9F|=E0|=C3=A0|=E1|=C3=A1|=E2|=C3=A2|=E3|=C3=A3|=E4|=C3=A4|=E5|=C3=A5|=E6|=C3=A6|=E7|=C3=A7|=E8|=C3=A8|=E9|=C3=A9|=EA|=C3=AA|=EB|=C3=AB|=EC|=C3=AC|=ED|=C3=AD|=EE|=C3=AE|=EF|=C3=AF|=F0|=C3=B0|=F1|=C3=B1|=F2|=C3=B2|=F3|=C3=B3|=F4|=C3=B4|=F5|=C3=B5|=F6|=C3=B6|=F7|=C3=B7|=F8|=C3=B8|=F9|=C3=B9|=FA|=C3=BA|=FB|=C3=BB|=FC|=C3=BC|=FD|=C3=BD|=FE|=C3=BE|=FF|=C3=BF/gi,
    (k, ...v) => {
      // verbose 
      //   ? console.log(k, v[1]?.substring(v[0] - 8, v[0] + 8)) 
      //   : undefined,

      // const [i, s] = v
      // const match = s.substring(i, i + k.length) // match just equals k when used this way, but can -/+ to see longer string

      const toReturn = URIReplacements[k as keyof typeof URIReplacements] ?? k
      // if (i > 3700 && i < 4000) {
      //   if (verbose) { console.log(s.substring(i - 25, i + k.length + 25).replace(k, '=')) }
      //   return match
      // }

      return toReturn
    }
  )
)

export const mfa_is_enabled = (u: { mfa?: User['mfa'] }) => (
  !!u?.mfa?.email
)

export const get_next_reminder_timestamp = ({ startTimeInMS, reminders } : Pick<CalendarEvent, 'startTimeInMS' | 'reminders'>): number => {
  const pending = reminders?.filter(r => !r.didRemind)
  if (!pending?.length) return -1

  const maxMsBeforeStartTime = Math.max(...pending.map(p => p.msBeforeStartTime))

  return startTimeInMS - maxMsBeforeStartTime 
}

export const capture_is_supported = () => {
  try {
    return document.createElement('input').capture !== undefined
  } catch(err) {
    console.error(err)
    return false
  }
}

export const batch_array = <T>(array: T[], size: number) => {
  const batches: T[][] = []

  for (let i = 0; i < Math.ceil(array.length / size); i++) {
    const batch: T[] = []
    for (let j=i * size; j < (i + 1) * size; j++) {
      if (j >= array.length) break;

      batch.push(array[j])
    }
    batches.push(batch)
  }

  return batches
}

// don't change order without updating responses_satisfy_conditions calculations
export const FORM_LOGIC_CALCULATED_FIELDS = ['Calculated: BMI']
export const FORM_LOGIC_URL_PARAMETER = 'URL Logic Parameter'

export const calculate_bmi = (e: Pick<Enduser, 'height' | 'weight'>) => {
  const height = parseInt(e.height?.value || '0')
  const weight = parseInt(e.weight?.value || '0')
  if (!height) return -1
  if (!weight) return -1

  return (703 * weight / (height * height))
}

// keep consistent with convert_form_logic_to_filter logic in analytics.ts
export const responses_satisfy_conditions = (responses: FormResponseValue[], conditions: CompoundFilter<string>, options?: {
  urlLogicValue?: string,
}): boolean => {
  const key = Object.keys(conditions)[0] as '$and' | '$or' | 'condition' | 'string' // string is form id
  if (key === '$and') {
    const andConditions = conditions[key] as CompoundFilter<string>[]
    for (const c of andConditions) {
      if (!responses_satisfy_conditions(responses, c, options)) {
        return false
      }
    }

    return true
  } else if (key === '$or') {
    const orConditions = conditions[key] as CompoundFilter<string>[]
    for (const c of orConditions) {
      if (responses_satisfy_conditions(responses, c, options)) {
        return true
      }
    }

    return false
  } else if (key === 'condition') {
    const fieldIdOrCalculated = Object.keys(conditions[key] as object)[0]
    const answer = (
      fieldIdOrCalculated === FORM_LOGIC_CALCULATED_FIELDS[0]
        ? (() => {
          const h = responses.find(r => r.answer.type === 'number' && r.answer.value && r.computedValueKey === 'Height')?.answer
          const w = responses.find(r => r.answer.type === 'number' && r.answer.value && r.computedValueKey === 'Weight')?.answer

          const height = h?.type === 'number' && h.value ? h.value : undefined
          const weight = w?.type === 'number' && w.value ? w?.value : undefined

          if (!(height && weight)) return undefined

          const BMI: FormResponseAnswerNumber = {
            type: 'number',
            value: 703 * weight / (height * height)
          }

          return BMI
        })()
      : fieldIdOrCalculated === FORM_LOGIC_URL_PARAMETER
        ? { type: 'string', value: options?.urlLogicValue || '' } as FormResponseAnswerString
        : responses.find(r => r.fieldId === fieldIdOrCalculated)?.answer
    )
    if (!answer) return false

    const comparison = (conditions[key] as Indexable)[fieldIdOrCalculated]
    if (typeof comparison === 'string') {
      if (answer.type === 'Database Select' && answer.value?.length) {
        return (
          !!answer.value.find(v => v?.text === comparison)
        )
      }

      if (answer.type === 'Address') {
        return (
           comparison === answer.value?.state
        || comparison === answer.value?.zipCode
        || comparison === answer.value?.city
        )
      }

      return (
        Array.isArray(answer.value)
          ? (answer.value as string[]).includes(comparison)
          : answer.value === comparison
      )
    } else {
      const condition = Object.keys(comparison)[0] as '$exists' | '$contains' | '$doesNotContain' | '$range' | '$lt' | '$gt'
      const conditionValue = comparison[condition]

      if (condition === '$lt' || condition === '$gt') {
        const number = parseInt(conditionValue)  
        const answerNumber = answer.value as number
        if (isNaN(number)) return false
        if (typeof answerNumber !== 'number') return false

        if (condition === '$lt') { return answerNumber < number }
        if (condition === '$gt') { return answerNumber > number }
      }
      else if (condition === '$exists') {
        return (
             answer.value !== undefined
          && answer.value !== null
          && answer.value !== ''
          && !(Array.isArray(answer.value) && answer.value.length === 0)
        ) === conditionValue
      } else if (condition === '$contains' || condition === '$doesNotContain') {
        if (answer.value === undefined || answer.value === null || answer.value === '') {
          return condition === '$doesNotContain' // empty responses cannot contain anything
        }
        if (answer.type === 'Database Select' && answer.value?.length) {
          const contains = !!answer.value.find(v => v.text?.includes(conditionValue))
          return (
             (contains && condition === '$contains')
          || (!contains && condition === '$doesNotContain') 
          )
        }
        if (Array.isArray(answer.value)) {
          const contains = (answer.value as string[]).find(v => typeof v === 'string' && v.includes(conditionValue))
          return (
             (contains && condition === '$contains')
          || (!contains && condition === '$doesNotContain') 
          )
        }
        if (typeof answer.value === 'string') {
          const contains = answer.value.includes(conditionValue)
          return (
             (contains && condition === '$contains')
          || (!contains && condition === '$doesNotContain') 
          )
        }
      }
    }
  }

  return true
}

export const weighted_round_robin = ({ assignments: _assignments, users: _users } : {
  assignments: RoundRobinAssignmentInfo[], 
  users: Pick<User, 'id' | 'ticketAssignmentPriority'>[], 
}): ({ selected?: string }) => {
  if (!_users.length) {
    return { selected: undefined }
  }
  if (_users.length === 1) {
    return { selected: _users[0].id }
  }

  // ensure default value set (5) with max of 10
  const users = _users.map(u => ({
    id: u.id,
    ticketAssignmentPriority: Math.min(u.ticketAssignmentPriority || 5, 10),
  }))
  const windowSize = users.reduce((t, u) => t + u.ticketAssignmentPriority, 0)
 
  // descending, with newest timestamp at [0], oldest timestamp at [assignments.length - 1]
  const assignments = (
    [..._assignments] // sort a deep copy to defend against bad input 
    .sort((a1, a2) => a2.timestamp - a1.timestamp)
    .filter((a, i) => users.find(u => u.id === a.userId) && i < windowSize - 1) // pigeonhole to ensure 1 available user
  )

  const capacityForUser = {} as Record<string, number>

  for (const user of users) {
    capacityForUser[user.id] = user.ticketAssignmentPriority
  }
  for (const a of assignments) {
    if (!capacityForUser[a.userId]) continue
    capacityForUser[a.userId] -= 1
  }

  // find user with capacity who has gone the longest without a ticket assignment
  const delayScores = {} as Record<string, number>
  for (let i = 0; i < users.length; i++) {
    const delayIndex = assignments.findIndex(a => a.userId === users[i].id)
    delayScores[users[i].id] = delayIndex === -1 ? assignments.length : delayIndex 
  }
  const usersSorted = [...users].sort((u1, u2) => delayScores[u2.id] - delayScores[u1.id])
  for (const user of usersSorted) {
    if (capacityForUser[user.id] !== undefined && capacityForUser[user.id] > 0) { 
      return { selected: user.id }
    }
  }

  // for (let i = assignments.length -1; i >= 0; i--) {
  //   const a = assignments[i]
  //   const user = users.find(u => u.id === a.userId)
  //   if (!user) { continue }

  //   if (capacityForUser[user.id] !== undefined && capacityForUser[user.id] > 0) { 
  //     return { selected: user.id }
  //   }
  //   // return { selected: user.id }
  // }
    
  return { selected: undefined }
}

export const validate_insurance_for_eligibility = (enduser: Pick<Enduser, 'insurance'>) => {
  if (!enduser.insurance) { return "Insurance not set" }
  if (!enduser.insurance.payerName) { return "Payer name not set" }
  if (!enduser.insurance.payerId) { return "Payer id not set" }
  if (!enduser.insurance.memberId) { return "Member id not set" }
  if (!enduser.insurance.relationship) { return "Subscriber relationship set" }
  if (enduser.insurance.relationship !== 'Self') {
    if (!enduser.insurance.relationshipDetails?.fname) { return "Subscriber first name not set" }
    if (!enduser.insurance.relationshipDetails?.lname) { return "Subscriber last name not set" } 
    if (!enduser.insurance.relationshipDetails?.gender) { return "Subscriber gender not set" } 
  }
}

export const validate_organization_for_candid = (organization?: Omit<Organization, 'id'> | null) => {
  if (!organization) return "Organization is required"
  if (!organization.billingOrganizationName) return "Billing organization name is required"
  if (!organization.billingOrganizationNPI) return "Billing organization NPI is required"
  if (!organization.billingOrganizationTaxId) return "Billing organization Tax ID is required"

  if (!organization.billingOrganizationAddress?.lineOne) return "Billing organization address is required (Line One)"
  if (!organization.billingOrganizationAddress?.city) return "Billing organization address is required (City)"
  if (!organization.billingOrganizationAddress?.state) return "Billing organization address is required (State)"
  if (!organization.billingOrganizationAddress?.zipCode) return "Billing organization address is required (ZIP)"
  if (!organization.billingOrganizationAddress?.zipPlusFour) return "Billing organization address is required (ZIP+4)"
}
export const validate_provider_for_candid = (user?: Omit<User, 'id'> | null) => {
  if (!user) return "User is required"
  if (!user.fname)  return "User first name is required"
  if (!user.lname)  return "User last name is required"
  if (!user.NPI)    return "User NPI is required"
}
export const validate_enduser_for_candid = (enduser?: Omit<Enduser, 'id'> | null) => {
  if (!enduser) return "Enduser is required"
  if (!enduser.fname) return "First name is required"
  if (!enduser.lname) return "Last name is required"
  if (!enduser.dateOfBirth) return "Date of birth is required"
  if (!enduser.gender) return "Gender is required"

  if (!enduser.addressLineOne) return "Address is required (Line One)"
  if (!enduser.city) return "Address is required (City)"
  if (!enduser.state) return "Address is required (State)"
  if (!enduser.zipCode) return "Address is required (ZIP)"
}

export const json_error_string = (s: string) => {
  try {
    return JSON.stringify(JSON.parse(s), null, 2)
  } catch(err) { return s }
}

export const validate_enduser_for_gogo = (enduser?: Omit<Enduser, 'id'> | null) => {
  if (!enduser) return "Enduser is required"
  if (!enduser.fname) return "First name is required"
  if (!enduser.lname) return "Last name is required"
  if (!enduser.phone) return "Phone is required"

  if (!enduser.addressLineOne) return "Address is required (Line One)"
  if (!enduser.city) return "Address is required (City)"
  if (!enduser.state) return "Address is required (State)"
  if (!enduser.zipCode) return "Address is required (ZIP)"
}

// https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
export const decodeJWT = <T extends { exp: number }>(jwt: string): T | null => {
  try {
    var base64Url = jwt.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch(err) {
    return null
  }
}

export const field_can_autoadvance = ({ type, options } : Pick<FormField, 'type' | 'options'>) => {
  if (type === 'multiple_choice' && options?.radio) return true
  if (type === 'Dropdown' && options?.radio) return true

  return false
}