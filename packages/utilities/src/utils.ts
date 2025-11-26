import { AllergyResponse, AvailabilityBlock, CalendarEvent, CalendarEventLimit, CompoundFilter, Enduser, EnduserInsurance, EnduserObservation, EnduserRelationship, File, Form, FormField, FormFieldType, FormResponse, FormResponseAnswerAddress, FormResponseAnswerNumber, FormResponseAnswerString, FormResponseValue, FormResponseValueAnswer, Integration, LabeledField, ManagedContentRecord, MedicationResponse, Organization, OutOfOfficeBlock, Product, Purchase, RoundRobinAssignmentInfo, SMSMessage, TableInputCell, Ticket, Timezone, TIMEZONES, USA_STATE_TO_TIMEZONE, User, UserActivityInfo, UserActivityStatus, VitalComparison, VitalConfiguration } from "@tellescope/types-models"
import { ADMIN_ROLE, ALL_ENDUSER_FIELDS_TO_DISPLAY_NAME, CANVAS_TITLE, ENDUSER_FIELDS_WITH_NESTED_PATHS_DISPLAY_NAME, get_inverse_relationship_type, HEALTHIE_TITLE, MM_DD_YYYY_REGEX, READONLY_ENDUSER_FIELDS_TO_DISPLAY_NAME } from "@tellescope/constants"
import sanitizeHtml from 'sanitize-html';
import { DateTime } from "luxon"

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
  if (typeof s !== 'string') return '' // safeguard
  if (typeof options.length === 'number' && options.length < 0) throw new Error("Length must be positive")

  const showEllipsis = options.showEllipsis ?? true
  const length = options.length ?? 25

  return (
    s.substring(0, length) +
      (showEllipsis && s.length > length ? '...' : '')
  )
}

// Helper function to format Stripe subscription interval display
export const format_stripe_subscription_interval = (interval?: string, intervalCount?: number): string => {
  if (!interval || !intervalCount) return '/month' // default fallback

  if (intervalCount === 1) {
    return `/${interval}` // "/month", "/week", "/year", "/day"
  }

  // Pluralize the interval
  const pluralInterval = interval === 'day' ? 'days'
    : interval === 'week' ? 'weeks'
    : interval === 'month' ? 'months'
    : interval === 'year' ? 'years'
    : interval

  return `/${intervalCount} ${pluralInterval}` // "/12 weeks", "/3 months", etc.
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
  
  let additionalOpenBraceCount = 0
  for (let i = startFrom || 0; i < text.length; i++) {
    const char = text[i]
    if (state === LINK_START) {
      if (char === '{') {
        start = i;
        state = LINK_END
      }
    } 
    else if (state === LINK_END) {
      if (char === '{') {
        additionalOpenBraceCount++
        linkChars.push(char)
      }
      else if (char === '}') {
        if (additionalOpenBraceCount) {
          additionalOpenBraceCount--
          linkChars.push(char)
        } else {
          state = TEXT_START
        }
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
  if (value.startsWith('forms') || value.startsWith('form_groups')) {
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
  if (value.startsWith('content')) {
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
export const build_form_group_link_string: ToTemplateString<{ id: string, displayName: string }> = d => `{{form_groups.${d.id}.link:${d.displayName}}}`
export const build_file_link_string: ToTemplateString<{ id: string, displayName: string }> = d => `{{files.${d.id}.link:${d.displayName}}}`
export const build_content_link_string: ToTemplateString<{ id: string, displayName: string }> = d => `{{content.${d.id}.link:${d.displayName}}}`
export const build_portal_link_string: ToTemplateString<{ page: string, displayName: string }> = d => `{{portal.link.${d.page}:${d.displayName}}}`

export const to_absolute_url = (link : string) => link.startsWith('http') ? link : '//' + link // ensure absolute url

export const ensure_https_url = (url?: string) => {
  if (!url) return url
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `https://${url}`
}

export const throwFunction = (s: string) => { throw s }

export const findFirstUnansweredField = (fields: any[], existingResponses: any[]): string | undefined => {
  if (!existingResponses || existingResponses.length === 0) {
    return undefined
  }

  // Create a simple map of field responses for quick lookup
  const responseMap = new Map(existingResponses.map(r => [r.fieldId, r]))

  // Find root field
  const rootField = fields.find(f => f.previousFields.find((p: any) => p.type === 'root'))
  if (!rootField) return undefined

  // Traverse fields in order to find first unanswered
  const visited = new Set<string>()
  const toProcess = [rootField]

  while (toProcess.length > 0) {
    const currentField = toProcess.shift()!
    if (visited.has(currentField.id)) continue
    visited.add(currentField.id)

    // Check if this field has a response
    const response = responseMap.get(currentField.id)
    if (!response || !response.answer?.value) {
      return currentField.id
    }

    // Add next fields to process
    const nextFields = fields.filter(f =>
      f.previousFields.some((p: any) => p.type !== 'root' && (p.info as any)?.fieldId === currentField.id)
    )
    toProcess.push(...nextFields)
  }

  return undefined // All questions are answered
}

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
  const secondsRaw = date.getSeconds()
  const seconds = secondsRaw >= 10 ? secondsRaw : `0${secondsRaw}`
  const minutes = minutesRaw >= 10 ? minutesRaw : `0${minutesRaw}`
  const year = date.getFullYear()

  const amPm = hours < 12 ? 'am' : 'pm' as const
  const hoursAmPm = (
    hours === 0
      ? 12
      : hours <= 12 ? hours : hours - 12
  )
  return { dayOfMonth, monthNumber, month, hours, hoursAmPm, amPm, minutes, year, seconds }
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

export const get_add_to_gcal_link = (event: Pick<CalendarEvent, "startTimeInMS" | 'durationInMinutes' | 'title' |'videoURL' | 'description' | 'displayDescription' | 'displayTitle' | 'healthieZoomJoinURL' | 'externalVideoURL'>) => {
  const start = DateTime.fromMillis(event.startTimeInMS, { zone: 'UTC' })
  const end   = DateTime.fromMillis(event.startTimeInMS + event.durationInMinutes * 60 * 1000, { zone: 'UTC' })
  const startString = `${start.toFormat('yyyyLLdd')}T${start.toFormat('HHmmss')}Z`
  const endString = `${end.toFormat('yyyyLLdd')}T${end.toFormat('HHmmss')}Z`
  const description = event.displayDescription || event.description || '' 
  const videoURL = (event.videoURL || event.externalVideoURL || event.healthieZoomJoinURL)
  return (
`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${(event.displayTitle || event.title).replaceAll(' ', '+')}&details=${videoURL || ''}${videoURL ? '<br/>' : ''}${description}&dates=${startString}/${endString}`
  )
}

export const formatted_date_hh_mm = (date: Date) => {
  const { minutes, hoursAmPm, amPm,  } = get_time_values(date)
  return `${hoursAmPm}:${minutes}${amPm}`
}

/** @deprecated uses month name instead of number */ 
export const yyyy_mm_dd = (date: Date): string => {
  const { dayOfMonth, month, year } = get_time_values(date)
  return `${year}-${month}-${dayOfMonth}`
}
export const yyyy_mm_dd_numeric = (date: Date): string => {
  const { dayOfMonth, monthNumber, year } = get_time_values(date)
  return `${year}-${monthNumber}-${dayOfMonth}`
}
export const mm_dd_yyyy = (date: Date): string => {
  const { dayOfMonth, monthNumber, year } = get_time_values(date)
  return `${monthNumber < 10 ? '0': ''}${monthNumber}-${dayOfMonth < 10 ? '0' : ''}${dayOfMonth}-${year}`
}

/**
 * Parses a date string that can be in ISO format, YYYY-MM-DD format, or MM-DD-YYYY format
 * Uses Luxon for consistent timezone handling - all dates are parsed as UTC to avoid timezone issues
 * @param dateString - Date string in various formats:
 *   - ISO with time: "2024-01-15T10:30:00Z" or "2024-01-15T10:30:00"
 *   - ISO date only: "2024-01-15"
 *   - MM-DD-YYYY: "01-15-2024"
 * @returns Luxon DateTime object or null if parsing fails
 */
export const parse_date_string = (dateString: string): DateTime | null => {
  if (!dateString) return null

  // Try ISO format first (with or without time)
  let parsed = DateTime.fromISO(dateString, { zone: 'utc' })
  if (parsed.isValid) {
    return parsed
  }

  // Try MM-DD-YYYY format (common in US date entry)
  if (MM_DD_YYYY_REGEX.test(dateString)) {
    const [month, day, year] = dateString.split('-').map(Number)
    parsed = DateTime.fromObject({ year, month, day }, { zone: 'utc' })
    if (parsed.isValid) {
      return parsed
    }
  }

  return null
}

/**
 * Calculates the number of days between two dates using Luxon for consistent timezone handling
 * All calculations are done in UTC to avoid timezone-related inconsistencies
 * @param date1 - First date (can be Date object, ISO string like "2024-01-15T10:30:00Z" or "2024-01-15", MM-DD-YYYY string like "01-15-2024", or "$now")
 * @param date2 - Second date (can be Date object, ISO string like "2024-01-15T10:30:00Z" or "2024-01-15", MM-DD-YYYY string like "01-15-2024", or "$now")
 * @returns Number of days between the two dates (absolute value, rounded down)
 * @throws Error if either date cannot be parsed
 */
export const calculate_days_between_dates = (date1: Date | string, date2: Date | string): number => {
  // Handle $now special case - use current UTC time
  const d1 = date1 === '$now'
    ? DateTime.utc()
    : (date1 instanceof Date ? DateTime.fromJSDate(date1, { zone: 'utc' }) : parse_date_string(date1))

  const d2 = date2 === '$now'
    ? DateTime.utc()
    : (date2 instanceof Date ? DateTime.fromJSDate(date2, { zone: 'utc' }) : parse_date_string(date2))

  if (!d1 || !d1.isValid) {
    throw new Error(`Invalid date1: ${date1}`)
  }
  if (!d2 || !d2.isValid) {
    throw new Error(`Invalid date2: ${date2}`)
  }

  // Use Luxon's diff method to get the difference in days
  // startOf('day') ensures we're comparing dates at midnight UTC, avoiding partial day issues
  const diff = d2.startOf('day').diff(d1.startOf('day'), 'days')
  return Math.floor(Math.abs(diff.days))
}

/**
 * Resolves a date value that could be a field reference, hardcoded date string, or "$now"
 * @param dateRef - Date reference which can be:
 *   - "$now" for current date
 *   - A field name to look up in enduserFields
 *   - A direct date string (ISO, YYYY-MM-DD, or MM-DD-YYYY format)
 * @param enduserFields - Object containing enduser custom fields
 * @returns Resolved date value as a string
 */
export const resolve_date_value = (dateRef: string, enduserFields?: Indexable<any>): string => {
  // Handle $now special case
  if (dateRef === '$now') {
    return '$now'
  }

  // Try to resolve as a field reference first
  if (enduserFields?.[dateRef]) {
    return enduserFields[dateRef].toString()
  }

  // Otherwise treat as a direct date string
  return dateRef
}

/**
 * Calculates the number of days between two dates, resolving field references from enduser data
 * This is a convenience function that combines resolve_date_value and calculate_days_between_dates
 * @param date1Ref - First date reference (field name, "$now", or date string)
 * @param date2Ref - Second date reference (field name, "$now", or date string)
 * @param enduserFields - Object containing enduser custom fields for resolving field references
 * @returns Number of days between the two dates (absolute value, rounded down)
 * @throws Error if either date cannot be resolved or parsed
 */
export const calculate_days_between_dates_from_enduser = (
  date1Ref: string,
  date2Ref: string,
  enduserFields?: Indexable<any>
): number => {
  const date1Value = resolve_date_value(date1Ref, enduserFields)
  const date2Value = resolve_date_value(date2Ref, enduserFields)

  return calculate_days_between_dates(date1Value, date2Value)
}

/**
 * Safely calculates date difference for use in Set Fields actions with validation and error handling
 * This function is designed for use in automation triggers and journey actions
 * @param dateDifferenceOptions - Configuration object with date1 and date2 references
 * @param enduserFields - Object containing enduser custom fields for resolving field references
 * @param fieldName - Name of the field being set (for error logging)
 * @param silent - If true, suppresses error console logs (useful for testing error cases)
 * @returns Number of days as a number, or empty string if calculation fails
 */
export const calculate_date_difference_for_set_fields = (
  dateDifferenceOptions: { date1: string, date2: string } | undefined,
  enduserFields: Indexable<any> | undefined,
  fieldName: string,
  silent = false
): number | '' => {
  try {
    if (!dateDifferenceOptions) {
      if (!silent) {
        console.error(`Date Difference field '${fieldName}' is missing dateDifferenceOptions`)
      }
      return ''
    }

    const daysDifference = calculate_days_between_dates_from_enduser(
      dateDifferenceOptions.date1,
      dateDifferenceOptions.date2,
      enduserFields
    )

    return daysDifference
  } catch (error) {
    if (!silent) {
      console.error(`Error calculating date difference for field '${fieldName}':`, error)
    }
    return ''
  }
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

// Sanitizes HTML to allow safe hyperlinks and basic text formatting while removing potentially harmful tags
export const sanitize_html_with_links = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: ['a', 'strong', 'b', 'em', 'i', 'u', 'br', 'p', 'img', 'div', 'span'],
    allowedAttributes: {
      'a': ['href', 'target', 'rel', 'style'],
      'img': ['src', 'alt', 'width', 'height', 'style'],
      'div': ['style'],
      'span': ['style'],
      'p': ['style'],
      'strong': ['style'],
      'b': ['style'],
      'em': ['style'],
      'i': ['style'],
      'u': ['style']
    },
    // Automatically add security attributes to external links
    transformTags: {
      'a': (tagName, attribs) => {
        const href = attribs.href || '';
        // Add target="_blank" and security attributes for external links
        if (href.startsWith('http://') || href.startsWith('https://')) {
          return {
            tagName,
            attribs: {
              ...attribs,
              target: '_blank',
              rel: 'noopener noreferrer'
            }
          };
        }
        return { tagName, attribs };
      }
    },
    // Allow only safe protocols for images
    allowedSchemesByTag: {
      img: ['http', 'https', 'data']
    }
  })

// Sanitizes HTML for CMS content - allows rich formatting while blocking XSS attacks
// More permissive than sanitize_html_with_links to support headers, lists, tables, etc.
export const sanitize_html_for_cms = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: [
      'a', 'strong', 'b', 'em', 'i', 'u', 'br', 'p', 'img', 'div', 'span',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'table', 'thead', 'tbody', 'tr', 'td', 'th',
      'blockquote', 'code', 'pre',
      'hr',
    ],
    allowedAttributes: {
      'a': ['href', 'target', 'rel', 'style'],
      'img': ['src', 'alt', 'width', 'height', 'style'],
      'div': ['style', 'class'],
      'span': ['style', 'class'],
      'p': ['style', 'class'],
      'table': ['style', 'class'],
      'td': ['style', 'colspan', 'rowspan'],
      'th': ['style', 'colspan', 'rowspan'],
      'h1': ['style'], 'h2': ['style'], 'h3': ['style'],
      'h4': ['style'], 'h5': ['style'], 'h6': ['style'],
      'ul': ['style'], 'ol': ['style'], 'li': ['style'],
      'blockquote': ['style'], 'code': ['style'], 'pre': ['style'],
    },
    transformTags: {
      'a': (tagName, attribs) => {
        const href = attribs.href || '';
        if (href.startsWith('http://') || href.startsWith('https://')) {
          return {
            tagName,
            attribs: {
              ...attribs,
              target: '_blank',
              rel: 'noopener noreferrer'
            }
          };
        }
        return { tagName, attribs };
      }
    },
    allowedSchemesByTag: {
      img: ['http', 'https', 'data'],
      a: ['http', 'https', 'mailto', 'tel']
    }
  })

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

export const form_response_value_to_string = (value: FormResponseValueAnswer['value'] | string | boolean | number | null | undefined | object, options?: { convertISODate?: boolean, returnRawCheckbox?: boolean }): string => {
  if (value === null || value === undefined) return ''

  if (value && typeof value === 'string' && is_checkbox_custom_field_value(value)) {
    if (options?.returnRawCheckbox) return value
    
    return "✅"
  }

  const maybeDate = (
    (options?.convertISODate && typeof value === 'string')
      ? is_full_iso_string_heuristic(value) 
      : undefined
  )
  if (maybeDate) {
    return formatted_date(maybeDate)
  }

  if (value instanceof Date) {
    return formatted_date(value)
  }

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

    if (Array.isArray(anyValue) && (anyValue[0]?.display || anyValue[0]?.code)) {
      return anyValue.map((v: AllergyResponse) => `${v.display} (${v.code})`).join('\n\n')
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

export const safeJSONParse = (s?: string) => {
  try {
    if (!s) return undefined

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

export const get_conditional_logic_values = <T extends string>(conditions: CompoundFilter<T>): any[] => {
  const key = Object.keys(conditions)[0] as '$and' | '$or' | 'condition' | 'string'

  if (key === '$and') {
    const andConditions = conditions[key] as CompoundFilter<string>[]
    return andConditions.flatMap(get_conditional_logic_values)
  } else if (key === '$or') {
    const orConditions = conditions[key] as CompoundFilter<string>[]
    return orConditions.flatMap(get_conditional_logic_values)
  } else if (key === 'condition') {
    if (!Object.values(conditions[key] as object)[0]) {
      return [Object.keys(conditions[key] as object)[0]]
    } else {
      return [Object.values(conditions[key] as object)[0]]
    }
  }

  return []
}

export const replace_keys_and_values_in_object = <T>(value: T, replacer: (v: any) => any): T => {
  const replacement = replacer(value)
  if (replacement !== value) return replacement as T

  if (Array.isArray(value)) {
    return [...value].map(v => replace_keys_and_values_in_object(v, replacer)) as T
  }
  // make sure it's a basic object (constructor === Object) and not a Class, Date, etc.
  if (value && typeof value === 'object' && value.constructor === Object) {
    // don't deep copy, so that we replace keys rather than adding new keys
    const newValue = { } as Record<string, any>
    for (const k in value) {
      newValue[replace_keys_and_values_in_object(k, replacer)] = replace_keys_and_values_in_object(value[k], replacer)
    }
    return newValue as T
  }

  return value
}
// console.log(
//   'replacement test case',
//   JSON.stringify(
//     replace_values_in_object(
//       {
//         a: 'replace_me',
//         b: 'not_replaced',
//         c: {
//           d: 'replace_me',
//           e: 'not_replaced',
//           f: {
//             g: 'replace_me',
//             h: 'not_replaced',
//           }
//         },
//         d: ['replace_me', 'not_replaced'],
//         f: [{ f: 'replace_me' }, 'not_replaced'],
//       },
//       r => r === 'replace_me' ? 'REPLACED!' : r
//     ), 
//     null, 2
//   )
// )

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

export const get_enduser_field_value_for_key = (enduser: Omit<Enduser, 'id'>, key: string) => {
  if (key === 'insurance.payerName') return enduser?.insurance?.payerName
  if (key === 'insurance.memberId') return enduser?.insurance?.memberId
  if (key === 'insurance.payerId') return enduser?.insurance?.payerId
  if (key === 'insurance.groupNumber') return enduser?.insurance?.groupNumber
  if (key === 'insurance.planName') return enduser?.insurance?.planName
  if (key === 'insurance.relationship') return enduser?.insurance?.relationship
  if (key === 'insurance.eligibility') return enduser?.insurance?.eligibility
  if (key === 'insurance.status') return enduser?.insurance?.status
  if (key === 'insurance.payerType') return enduser?.insurance?.payerType
  if (key === 'insurance.startDate') return enduser?.insurance?.startDate
  if (key === 'insuranceSecondary.payerName') return enduser?.insuranceSecondary?.payerName
  if (key === 'insuranceSecondary.memberId') return enduser?.insuranceSecondary?.memberId
  if (key === 'insuranceSecondary.payerId') return enduser?.insuranceSecondary?.payerId
  if (key === 'insuranceSecondary.groupNumber') return enduser?.insuranceSecondary?.groupNumber
  if (key === 'insuranceSecondary.planName') return enduser?.insuranceSecondary?.planName
  if (key === 'insuranceSecondary.relationship') return enduser?.insuranceSecondary?.relationship
  if (key === 'insuranceSecondary.eligibility') return enduser?.insuranceSecondary?.eligibility
  if (key === 'insuranceSecondary.status') return enduser?.insuranceSecondary?.status
  if (key === 'insuranceSecondary.payerType') return enduser?.insuranceSecondary?.payerType
  if (key === 'insuranceSecondary.startDate') return enduser?.insuranceSecondary?.startDate
  if (key === 'insurance.relationshipDetails') {
    try {
      return JSON.stringify(enduser?.insurance?.relationshipDetails ?? {})
    } catch(err) {}
  }
  if (key === 'insuranceSecondary.relationshipDetails') {
    try {
      return JSON.stringify(enduser?.insuranceSecondary?.relationshipDetails ?? {})
    } catch(err) {}
  }

  try {
    if (key === 'createdAt' && (enduser as any)._id) {
      return ((enduser as any)._id as ObjectId).getTimestamp().toISOString()
    }
  } catch(err) { }

  try {
    if (key === 'id' && (enduser as any)._id) {
      return ((enduser as any)._id as ObjectId).toString()
    }
  } catch(err) { }

  if (key === "Healthie ID") {
    return (
      enduser.source === HEALTHIE_TITLE && enduser.externalId
        ? enduser.externalId
        : enduser.references?.find(r => r.type === HEALTHIE_TITLE)?.id
    )
  }

  return enduser?.[key as keyof typeof enduser] as any
}

type EnduserAugmentations = {
  _upcomingEvents?: Pick<CalendarEvent, 'startTimeInMS' | "templateId">[]
}

export const UPCOMING_EVENT_COUNT_KEY = '__upcomingEvents__'

export const evaluate_conditional_logic_for_enduser_fields = (enduser: Omit<Enduser, 'id'> & EnduserAugmentations, conditions: Record<string, any>, o?: {
  ignoreUpcomingEvents?: boolean, // if this condition type should not be evaluated
}) => (
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
      : (key === UPCOMING_EVENT_COUNT_KEY && typeof value === 'object')
        ? (() => {
          if (o?.ignoreUpcomingEvents) return true 

          const templateIds = value?.['$templateIds'] ?? [] as string[]
          const fromOffset = value?.['$fromOffset']
          const toOffset = value?.['$toOffset']

          const upcomingEventCount = (
            (enduser._upcomingEvents || [])
            .filter(e => templateIds.length === 0 || templateIds.includes(e.templateId))
            .filter(e => e.startTimeInMS >= (Date.now() + (fromOffset || 0))) // by default, from offset should be zero, as this used to be limited to "upcoming events"
            .filter(e => !toOffset || (e.startTimeInMS <= (Date.now() + toOffset)))
            .length 
          ) ?? 0

          const result = (
            value?.['$lt'] !== undefined
              ? (upcomingEventCount < parseInt(value['$lt']))
          : value?.['$gt'] !== undefined
              ? (upcomingEventCount > parseInt(value['$gt']))
              : false
          )

          return result
        })()
      : key === 'BMI' && typeof value === 'object'
        ? (() => {
          const height = parseInt(enduser.height?.value?.toString() || '0')
          const weight = parseInt(enduser.weight?.value?.toString() || '0')

          if (!(height && weight)) return false

          const bmi = 703 * weight / (height * height)

          const result = (
            value?.['$lt'] !== undefined
              ? (bmi < parseInt(value['$lt']))
          : value?.['$gt'] !== undefined
              ? (bmi > parseInt(value['$gt']))
              : false
          )

          return result
        })()
      : key === 'relationships' && typeof value === 'string'
        ? (
          !!enduser?.relationships?.find(r => r.type === get_inverse_relationship_type(value as any))
        )
      : key === 'customTypeId'
        ? (() => {
          const enduserCustomTypeId = enduser.customTypeId

          // Helper function to check if a value represents the default type (Patient)
          const isDefaultType = (val: any) => !val

          if (typeof value === 'string') {
            // Direct string comparison
            if (isDefaultType(value)) {
              return isDefaultType(enduserCustomTypeId)
            }
            return enduserCustomTypeId === value
          } else if (typeof value === 'object' && value !== null) {
            // Handle operators like $ne, $in, etc.
            const operator = Object.keys(value)[0]
            const operatorValue = Object.values(value)[0]

            if (operator === '$ne') {
              if (isDefaultType(operatorValue)) {
                return !isDefaultType(enduserCustomTypeId)
              }
              return enduserCustomTypeId !== operatorValue
            }

            // Add other operators as needed
            return false
          } else if (value === null || value === undefined) {
            // Handle case where condition value is null/undefined - treat as default type
            return isDefaultType(enduserCustomTypeId)
          }

          return false
        })()
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
            const vDate = v === '$now' ? new Date() : new Date(v)
            if (isNaN(vDate.getTime())) return false

            const eDateField = enduser.fields?.[key] ?? get_enduser_field_value_for_key(enduser, key)
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

          if (k === '$lt' || k === '$gt') {
            const enduserValue = enduser.fields?.[key]
            if (typeof enduserValue !== 'number') return false

            const _v = (
              typeof v === 'number'
                ? v
                : parseInt(v)
            )
            if (isNaN(_v)) return false

            return (
                (k === '$lt' && enduserValue < _v)
            ||  (k === '$gt' && enduserValue > _v)
            )
          }

          if (k === '$contains' || k === '$doesNotContain') {
            const enduserValue = (enduser.fields?.[key] ?? get_enduser_field_value_for_key(enduser, key))
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
            const enduserValue = (enduser.fields?.[key] ?? get_enduser_field_value_for_key(enduser, key))
            const isSet = (
              Array.isArray(enduserValue)
                ? enduserValue.length > 0
                : !!enduserValue
            )

            return (k === "$isSet" && isSet) || (k === '$isNotSet' && !isSet)
          }

          // should negate the typeof value === 'string' (defaults to $equals) condition
          if (k === '$ne') {
            const enduserValue = (enduser.fields?.[key] ?? get_enduser_field_value_for_key(enduser, key))
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
            (enduser.fields?.[key] ?? get_enduser_field_value_for_key(enduser, key)) === value
            || (enduser.fields?.[key] ?? get_enduser_field_value_for_key(enduser, key)) === parseInt(value)
            || (
              Array.isArray(enduser.fields?.[key])
              && (enduser?.fields?.[key] as string[]).includes(value)
            )
            || (
              Array.isArray(get_enduser_field_value_for_key(enduser, key))
              && (enduser[key as keyof typeof enduser] as string[]).includes(value)
            )
            )
          : false
    )  
  )
)

export const string_matches_key_or_value = <T>(value: T, match: string): boolean => {
  if (typeof value === 'string') {
    return value === match
  }
  if (Array.isArray(value)) {
    return value.find(v => string_matches_key_or_value(v, match)) !== undefined
  }
  if (value && typeof value === 'object') {
    for (const k in value) {
      if (k === match) return true
      if (string_matches_key_or_value(value[k], match)) return true
    }
  }

  return false
}
// console.log(
//   'string match test case',
//   string_matches_key_or_value(
//     {
//       $and: [
//         {
//           condition: {
//             __upcomingEvents__: {
//               $gt: 0,
//             }
//           }
//         }
//       ]
//     }, 
//     UPCOMING_EVENT_COUNT_KEY,
//   )
// )

export const getLocalTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone as Timezone

export const YYYY_MM_DD_to_MM_DD_YYYY = (yyyyMmDd: string, delimiter='-') => {
  if (!yyyyMmDd) return '' // also handles null/undefined if provided mistakenly
  
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

export const get_next_reminder_timestamp = ({ startTimeInMS, reminders: _reminders, attendees=[] } : Pick<CalendarEvent, 'attendees' | 'startTimeInMS' | 'reminders'>): number => {
  let reminders = _reminders || []

  // don't process add-to-journey reminders unless at least 1 enduser is attending
  try {
    reminders = reminders.filter(r => 
      attendees.filter(a => a.type === 'enduser').length > 0 
      || (r.type !== 'add-to-journey')
    )
  } catch(err) {
    console.error(err)
  }
  

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

export const calculate_form_scoring = ({
  response,
  form, 
}: {
  response: Pick<FormResponse, 'responses'>,
  form: Pick<Form, 'scoring'>,
}) => {
  if (!form.scoring?.length) return

  const scores: Record<string, number> = {}

  for (const scoreCondition of form.scoring) {
    const r = response.responses?.find(
      r => r.fieldId === scoreCondition.fieldId
        && (
          r.answer.type !== 'multiple_choice'
        || (
          Array.isArray(r.answer.value)
        && typeof scoreCondition.response === 'string'
        && r.answer.value.includes(scoreCondition.response)
        )
        )
    )
    if (!r) continue

    if (scores[scoreCondition.title] === undefined) {
      scores[scoreCondition.title] = 0
    }

    if (r.answer.type === 'multiple_choice' && typeof scoreCondition.score === 'number') {
      scores[scoreCondition.title] += scoreCondition.score
    } else if (typeof r.answer.value === 'number') {
      scores[scoreCondition.title] += r.answer.value
    }
  }
  if (object_is_empty(scores)) return

  const scoresList = [] as { title: string, value: number }[]
  for (const title in scores) {
    scoresList.push({
      title,
      value: scores[title]
    })
  }

  return scoresList
}

// don't change order without updating responses_satisfy_conditions calculations
export const FORM_LOGIC_CALCULATED_FIELDS = ['Calculated: BMI', 'Calculated: Age', 'Calculated: Score', 'Gender', 'State']
export const FORM_LOGIC_URL_PARAMETER = 'URL Logic Parameter'

export const calculate_bmi = (e: Pick<Enduser, 'height' | 'weight'>) => {
  const height = typeof e.height?.value === 'number' ? e.height.value : parseInt(e.height?.value || '0')
  const weight = typeof e.weight?.value === 'number' ? e.weight.value : parseInt(e.weight?.value || '0')
  if (!height) return -1
  if (!weight) return -1

  return (703 * weight / (height * height))
}

export const calculate_bmi_from_responses = (responses: FormResponseValue[]): number | undefined => {
  // Find height from intake fields
  const h = (
    responses.find(r => r.answer.type === 'number' && r.answer.value && r.computedValueKey === 'Height')?.answer
    || responses.find(r => r.answer.type === 'Height' && r.answer.value && r.computedValueKey === 'Height')?.answer
  )

  const height = (
    (h?.type === 'number' && h.value)
      ? h.value
  : (h?.type === 'Height' && typeof h.value?.feet === 'number')
      ? h.value.feet * 12 + (h.value.inches || 0)
      : undefined
  )

  // Find weight from intake fields
  const w = responses.find(r => r.answer.type === 'number' && r.answer.value && r.computedValueKey === 'Weight')?.answer
  const weight = w?.type === 'number' && w.value ? w.value : undefined

  if (!(height && weight)) return undefined

  return 703 * weight / (height * height)
}

const evaluate_response_equals = (answer: FormResponseValueAnswer, comparison: string) => {
  if (answer.type === 'Database Select' && answer.value?.length) {
    return (
      !!answer.value.find(v => v?.text === comparison)
    )
  }

  if (answer.type === 'Insurance') {
    return answer.value?.payerName === comparison
  }

  if (answer.type === 'Address') {
    return (
       comparison === answer.value?.state
    || comparison === answer.value?.zipCode
    || comparison === answer.value?.city
    )
  }
  if (answer.type === 'number' && typeof comparison === 'string') {
    return comparison === answer.value?.toString()
  }

  return (
    Array.isArray(answer.value)
      ? (answer.value as string[]).includes(comparison)
      : answer.value === comparison
  )
}

// keep consistent with convert_form_logic_to_filter logic in analytics.ts
export const responses_satisfy_conditions = (responses: FormResponseValue[], conditions: CompoundFilter<string>, options?: {
  dateOfBirth?: string,
  gender?: string,
  state?: string,
  urlLogicValue?: string,
  form?: Form, // required for calculating scoring
  activeResponses?: FormResponseValue[], // current and previous answers (not future answers)
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
      fieldIdOrCalculated === FORM_LOGIC_CALCULATED_FIELDS[0] // bmi
        ? (() => {
          const h = (
            responses.find(r => r.answer.type === 'number' && r.answer.value && r.computedValueKey === 'Height')?.answer
          || responses.find(r => r.answer.type === 'Height' && r.answer.value && r.computedValueKey === 'Height')?.answer
          )
          const w = responses.find(r => r.answer.type === 'number' && r.answer.value && r.computedValueKey === 'Weight')?.answer

          const height = (
            (h?.type === 'number' && h.value)
              ? h.value 
          : (h?.type === 'Height' && typeof h.value?.feet === 'number')
              ? h.value.feet * 12 + (h.value.inches || 0)
              : undefined
          )
          const weight = w?.type === 'number' && w.value ? w?.value : undefined

          if (!(height && weight)) return undefined

          const BMI: FormResponseAnswerNumber = {
            type: 'number',
            value: 703 * weight / (height * height)
          }

          return BMI
        })()
      : fieldIdOrCalculated === FORM_LOGIC_CALCULATED_FIELDS[1] // age
        ? (() => {
          const dob = options?.dateOfBirth || responses.find(r => r.answer.type === 'dateString' && r.answer.value && r.computedValueKey === 'Date of Birth')?.answer?.value?.toString()
          if (!dob) return undefined

          try {
            const age = age_for_dob_mmddyyyy(dob)
            if (typeof age !== 'number') return undefined

            const Age: FormResponseAnswerNumber = {
              type: 'number',
              value: age
            }

            return Age
          } catch(err) {
            console.error(err)
          }
        })()
      : fieldIdOrCalculated === FORM_LOGIC_CALCULATED_FIELDS[2] // score
        ? (() => {
          const form = options?.form
          if (!form) return undefined

          const scores = calculate_form_scoring({ response: { responses: options.activeResponses || responses }, form })
          if (!scores?.length) return  

          const Score: FormResponseAnswerNumber = {
            type: 'number',
            value: scores[0].value,
          }

          return Score 
        })()
      : fieldIdOrCalculated === FORM_LOGIC_CALCULATED_FIELDS[3] // gender
        ? (() => {
          const gender = (
            ( // responses should be priority, in case they're being used to change gender
              responses.find(
                r => (r.answer.type === 'Dropdown' || r.answer.type === 'multiple_choice') && r.computedValueKey === 'Gender'
              )?.answer?.value as string[]
            )?.[0]
            || options?.gender 
          )

          const Gender: FormResponseAnswerString = {
            type: 'string',
            value: gender || '',
          }

          return Gender
        })()
      : fieldIdOrCalculated === FORM_LOGIC_CALCULATED_FIELDS[4] // state
        ? (() => {
          const state = (
            (responses.find(r => r.answer.type === 'Address' && r.computedValueKey === 'State')?.answer as FormResponseAnswerAddress)?.value?.state  
            || options?.state 
          )

          const State: FormResponseAnswerString = {
            type: 'string',
            value: state || '',
          }

          return State 
        })()
      : fieldIdOrCalculated === FORM_LOGIC_URL_PARAMETER
        ? { type: 'string', value: options?.urlLogicValue || '' } as FormResponseAnswerString
        : responses.find(r => r.fieldId === fieldIdOrCalculated)?.answer
    )
    if (!answer) return false

    const comparison = (conditions[key] as Indexable)[fieldIdOrCalculated]
    if (typeof comparison === 'string') {
      return evaluate_response_equals(answer, comparison)
    } else {
      const condition = Object.keys(comparison)[0] as '$ne' | '$exists' | '$contains' | '$doesNotContain' | '$range' | '$lt' | '$gt'
      const conditionValue = comparison[condition]

      if (condition === "$ne") {
        return !evaluate_response_equals(answer, conditionValue)
      }

      if (condition === '$lt' || condition === '$gt') {
        if (conditionValue === '$now') {
          if (answer.type === 'date' && answer.value) {
            const number = Date.now()
            const answerNumber = new Date(answer.value).getTime()
            if (condition === '$lt') { return answerNumber < number }
            if (condition === '$gt') { return answerNumber > number }
          }
          if (answer.type === 'dateString' && answer.value) {
            const number = new Date(MM_DD_YYYY_to_YYYY_MM_DD(mm_dd_yyyy(new Date()))).getTime()
            const answerNumber = new Date(MM_DD_YYYY_to_YYYY_MM_DD(answer.value)).getTime()
            if (condition === '$lt') { return answerNumber < number }
            if (condition === '$gt') { return answerNumber > number }
          }
        }

        const number = (
          typeof conditionValue === 'string' && conditionValue.startsWith("$JS(") && conditionValue.endsWith(")")
            ? new Function('answer', conditionValue.substring(4, conditionValue.length - 1))(answer)
            : parseInt(conditionValue)
        )
        const answerNumber = (
          (answer.type === 'date' && answer.value)
            ? new Date(answer.value).getTime()
          : (answer.type === 'dateString' && answer.value)
            ? new Date(MM_DD_YYYY_to_YYYY_MM_DD(answer.value)).getTime()
            : answer.value as number
        )

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
  if (!enduser.insurance.relationship) { return "Subscriber relationship not set" }
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

export const validate_enduser_for_smart_meter = (enduser?: Omit<Enduser, 'id'> | null) => {
  if (!enduser) return "Enduser is required"
  if (!enduser.fname) return "First name is required"
  if (!enduser.lname) return "Last name is required"

  if (!enduser.addressLineOne) return "Address is required (Line One)"
  if (!enduser.city) return "Address is required (City)"
  if (!enduser.state) return "Address is required (State)"
  if (!enduser.zipCode) return "Address is required (ZIP)"
}

export const validate_enduser_for_dose_spot = (enduser?: Omit<Enduser, 'id'> | null) => {
  if (!enduser) return "Enduser is required"

  if (!enduser.fname) return "First name is required"
  if (!enduser.lname) return "Last name is required"

  if (!enduser.gender) return "Gender is required"
  if (!enduser.dateOfBirth) return "Date of Birth is required"

  if (!enduser.addressLineOne) return "Address is required (Line One)"
  if (!enduser.city) return "Address is required (City)"
  if (!enduser.state) return "Address is required (State)"
  if (!enduser.zipCode) return "Address is required (ZIP)"

  if (!enduser.phone) return "Phone is required"

  const age = age_for_dob_mmddyyyy(enduser.dateOfBirth)
  if (typeof age === 'number' && age < 19) {
    if (!enduser.height?.value) return "Height is required for patients under 19"
    if (!enduser.weight?.value) return "Weight is required for patients under 19"
  }
}

export const validate_enduser_for_script_sure = (enduser?: Omit<Enduser, 'id'> | null) => {
  if (!enduser) return "Enduser is required"

  if (!enduser.fname) return "First name is required"
  if (!enduser.lname) return "Last name is required"

  if (!enduser.gender) return "Gender is required"
  if (!enduser.dateOfBirth) return "Date of Birth is required"

  if (!enduser.addressLineOne) return "Address is required (Line One)"
  if (!enduser.city) return "Address is required (City)"
  if (!enduser.state) return "Address is required (State)"
  if (!enduser.zipCode) return "Address is required (ZIP)"

  if (!enduser.phone) return "Phone is required"
}

export const validate_enduser_for_develop_health = (enduser?: Omit<Enduser, 'id'> | null, insuranceType?: string) => {
  if (!enduser) return "Enduser is required"
  
  if (!enduser.fname) return "First name is required"
  if (!enduser.lname) return "Last name is required"

  if (!enduser.gender) return "Gender is required"
  if (!enduser.dateOfBirth || !MM_DD_YYYY_REGEX.test(enduser.dateOfBirth)) return "Date of Birth is required in MM-DD-YYYY format"

  if (!enduser.addressLineOne) return "Patient address is required (Line One)"
  if (!enduser.city) return "Patient address is required (City)"
  if (!enduser.state) return "Patient address is required (State)"
  if (!enduser.zipCode) return "Patient address is required (ZIP)"

  const insurance = (
    insuranceType === 'Secondary'
      ? enduser.insuranceSecondary
      : enduser.insurance
  )
  if (!insurance) return "Patient insurance is not set"

  if (!(
    (insurance.cardFront && insurance.cardBack)
  || (insurance.payerName && insurance.memberId)
  )) {
    return "Payer name and member ID or front and back insurance images are required"  
  }
}
export const validate_user_for_develop_health = (user?: Omit<User, 'id'> | null) => {
  if (!user) return "Provider is required"
  
  if (!user.fname) return "First name is required"
  if (!user.lname) return "Last name is required"
  if (!user.NPI) return "NPI is required"
}
export const validate_organization_for_develop_health = (organization?: Omit<Organization, 'id'> | null) => {
  if (!organization) return "Organization is required"
  if (!organization.billingOrganizationName) return "Billing organization name is required"
  if (!organization.billingOrganizationTaxId) return "Billing organization Tax ID"
  if (!organization?.billingOrganizationAddress?.lineOne) return "Billing organization address is required (Line One)"
  if (!organization?.billingOrganizationAddress?.city) return "Billing organization address is required (City)"
  if (!organization?.billingOrganizationAddress?.state) return "Billing organization address is required (State)"
  if (!organization?.billingOrganizationAddress?.zipCode) return "Billing organization address is required (ZIP)"
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
  if (type === 'Appointment Booking') return true
  if (type === 'Stripe') return true

  return false
}
export const field_can_autosubmit = ({ type, options } : Pick<FormField, 'type' | 'options'>) => {
  if (type === 'Appointment Booking') return true
  if (type === 'Stripe') return true

  return false
}

export const satisfies_vital_comparison = (comparison: VitalComparison, value: number) => {
  if (comparison.type === 'Less Than') { return value < comparison.value }
  if (comparison.type === 'Greater Than') { return value > comparison.value }
  if (comparison.type === 'Between') { return value >= comparison.value.lower && value <= comparison.value.upper }

  return false
}

export const SMS_UNSUBSCRIBE_KEYWORDS = ['stop', 'stopall', 'unsubscribe', 'end', 'quit', 'cancel']

export const classification_for_vital = (v: Pick<EnduserObservation, 'measurement' | 'classifications'>, configurations: VitalConfiguration[]) => {
  const classification = (
    v.classifications?.length === 1 ? v.classifications[0].classification
    : (
      v.classifications
        ?.find(c => configurations.find(_c => _c.id === c.configurationId))
        ?.classification
    )
  )

  return classification || ''
}

// ,'High','Low','Very High','Very Low','Critical High','Critical Low'
export const color_for_classification = (c: string, ifNoMatch?: string) => (
  c === 'Target' ? '#44cc4466'
: c === 'Low' ? '#cccc4466'
: c === 'High' ? '#cccc4466'
: c === 'Very High' ? '#cc444466'
: c === 'Very Low' ? '#cc444466'
: c === 'Critical High' ? 'violet'
: c === 'Critical Low' ? 'violet'
: ifNoMatch
)

export const is_out_of_office = (
  blocks: Pick<AvailabilityBlock, 'dayOfWeekStartingSundayIndexedByZero' | 'startTimeInMinutes' | 'endTimeInMinutes' | 'active'>[], 
  date = new Date(),
  zone = 'America/New_York' as Timezone,
  outOfOfficeBlocks = [] as OutOfOfficeBlock[],
) => {
  const outOfOfficeBlock = outOfOfficeBlocks.find(b => (
    new Date(b.from).getTime() <= date.getTime()
  && new Date(b.to).getTime() >= date.getTime()
  ))
  if (outOfOfficeBlock) { // may have additional detail, like reply text
    return outOfOfficeBlock
  }

  if (blocks.length === 0) return false

  const nowInTimezone = DateTime.fromJSDate(date, { zone })
  const nowMinutes = nowInTimezone.minute + 60 * nowInTimezone.hour
  const nowDay = ( // convert to zero indexing by Sunday
    nowInTimezone.weekday === 7  // Get the day of the week. 1 is Monday and 7 is Sunday
      ? 0
      : nowInTimezone.weekday
  )

  for (const block of blocks) {
    if (block.active?.to && (new Date(block.active.to).getTime() < Date.now())) continue // ends before now
    if (block.active?.from && (new Date(block.active.from).getTime() > Date.now())) continue // starts after now

    if (nowDay !== block.dayOfWeekStartingSundayIndexedByZero) continue // different day

    // same day, and within the availability window
    // this must be inclusive in order to be in office all day (0:00 to 23:59)
    if (nowMinutes >= block.startTimeInMinutes && nowMinutes <= block.endTimeInMinutes) {
      return false // is in office
    }
  }

  return true
}

export const get_utm_params = () => {
  const params = new URL(window.location.href).searchParams
  const utmParams: LabeledField[] = []

  params.forEach((value, field) => {
    if (field.toLowerCase().startsWith('utm_') || field === 'ours_user_id') {
      utmParams.push({ field, value  })
    }
  })

  return utmParams
}

export const append_current_utm_params = (targetURL: string) => {
  try {
    const params = new URL(window.location.href).searchParams
    const utmParams = {} as Record<string, string>

    params.forEach((value, key) => {
      if (key.toLowerCase().startsWith('utm_') || key === 'ours_user_id') {
        utmParams[key] = value
      }
    })

    if (object_is_empty(utmParams)) { return targetURL }

    let modifiedURL = targetURL
    if (!modifiedURL.includes('?')) {
      modifiedURL += '?'
    }
    else if (!modifiedURL.endsWith('&')) {
      modifiedURL += '&'
    }
    for (const param in utmParams) {
      modifiedURL += `${param}=${utmParams[param]}&`
    }

    return modifiedURL
  } catch(err) {
    console.error(err)
  };

  return targetURL
}

export const replace_tag_template_values_for_enduser = (tags: string[], enduser: Omit<Enduser, 'id'>) => (
  tags.map(t => {
    if (t.startsWith('{{') && t.endsWith('}}')) {
      const tagField = (t.split('{{enduser.').pop() || '').replace("}}", '')
      if (tagField === 'hashedPassword') return t

      if (tagField === 'Age' && enduser.dateOfBirth) {
        return age_for_dob_mmddyyyy(enduser.dateOfBirth)
      }
      if (tagField === 'BMI' && enduser.height?.value && enduser.weight?.value) {
        return calculate_bmi(enduser).toFixed(2)
      }

      return (
           enduser.fields?.[tagField]?.toString() 
        || get_enduser_field_value_for_key(enduser, tagField)?.toString() // accounts for dotted fields like insurance.payerName
        || t
      )
    }

    return t
  })
)

// todo: refactor with replacer below, mirroring replace_sms_template_values
export const replace_purchase_template_values = (s: string, purchase?: Omit<Purchase, 'id'> | null) => {
  if (!purchase) return s
  if (typeof s !== 'string') return s // e.g. Date value

  let i = 0
  let start = 0
  let templates = [] as { match: string, replacement: string }[]
  while (i < 100) {
    i++

    start = s.indexOf('{{purchase.', start)
    if (start === -1) break;

    const end = s.indexOf('}}', start)
    if (end === -1) break;

    const match = s.substring(start, end + 2) // +2 accounts for '}}' 
    templates.push({
      match,
      replacement: (
        match === '{{purchase.name}}' ? purchase.title
      : match === '{{purchase.id}}' ? ((purchase as any)?._id?.toString() || (purchase as any)?.id || '')
      : match === '{{purchase.externalId}}' ? (purchase.externalId || '')
      : match === '{{purchase.source}}' ? (purchase.source || '')
      : match === '{{purchase.cost.amount}}' ? purchase.cost.amount.toString()
        : ''
      )
    })

    start = end + 2
  }

  let replaced = s.toString()
  for (const { match, replacement } of templates) {
    replaced = replaced.replace(match, replacement)
  }

  return replaced
}

export const replace_form_field_template_values = (
  s: string,
  options: {
    enduser?: Partial<Enduser>,
    responses?: FormResponseValue[],
  }
) => {
  if (!s) return s
  if (typeof s !== 'string') return s

  const { enduser, responses = [] } = options

  let i = 0
  let start = 0
  let templates = [] as { match: string, replacement: string }[]

  while (i < 100) {
    i++

    start = s.indexOf('{{enduser.', start)
    if (start === -1) break

    const end = s.indexOf('}}', start)
    if (end === -1) break

    const match = s.substring(start, end + 2) // +2 accounts for '}}'
    const fieldPath = match.substring('{{enduser.'.length, match.length - 2) // extract field name

    let replacement = ''

    // Special case: BMI calculation
    if (fieldPath === 'BMI') {
      // First try to calculate from responses (intake fields)
      if (responses.length > 0) {
        const bmi = calculate_bmi_from_responses(responses)
        if (bmi !== undefined) {
          replacement = bmi.toFixed(1)
        }
      }
      // Fall back to enduser fields if no BMI from responses
      if (!replacement && enduser?.height?.value && enduser?.weight?.value) {
        const bmi = calculate_bmi(enduser)
        if (bmi !== -1) {
          replacement = bmi.toFixed(1)
        }
      }
    }
    // Special case: Age calculation
    else if (fieldPath === 'Age') {
      // First try to get dateOfBirth from intake field responses
      const dobResponse = responses.find(r => r.intakeField === 'dateOfBirth' || r.computedValueKey === 'Date of Birth')
      let dob: string | undefined

      if (dobResponse?.answer?.value && typeof dobResponse.answer.value === 'string') {
        dob = dobResponse.answer.value
      }
      // Fall back to enduser dateOfBirth
      else if (enduser?.dateOfBirth) {
        dob = enduser.dateOfBirth
      }

      if (dob) {
        replacement = age_for_dob_mmddyyyy(dob).toString()
      }
    }
    // Regular enduser field - check both responses (intake fields) and enduser object
    else {
      // First try to get from intake field responses
      // Map common field names to their intake field equivalents
      const intakeFieldMapping: Record<string, string> = {
        'fname': 'fname',
        'firstName': 'fname',
        'lname': 'lname',
        'lastName': 'lname',
        'email': 'email',
        'phone': 'phone',
        'dateOfBirth': 'dateOfBirth',
        'gender': 'gender',
      }

      const intakeFieldName = intakeFieldMapping[fieldPath] || fieldPath
      const intakeResponse = responses.find(r => r.intakeField === intakeFieldName)

      if (intakeResponse?.answer?.value) {
        // Handle different answer types
        if (typeof intakeResponse.answer.value === 'string' || typeof intakeResponse.answer.value === 'number') {
          replacement = intakeResponse.answer.value.toString()
        } else if (intakeResponse.answer.type === 'Address' && typeof intakeResponse.answer.value === 'object') {
          // For address fields, might want specific sub-fields
          replacement = JSON.stringify(intakeResponse.answer.value)
        }
      }
      // Fall back to enduser object if not found in responses
      else if (enduser) {
        const value = (
          enduser.fields?.[fieldPath]?.toString()
          || get_enduser_field_value_for_key(enduser as Omit<Enduser, 'id'>, fieldPath)?.toString()
          || (enduser as any)[fieldPath]?.toString() // Try direct property access
          || ''
        )
        replacement = value
      }
    }

    templates.push({
      match,
      replacement
    })

    start = end + 2
  }

  let replaced = s.toString()
  for (const { match, replacement } of templates) {
    replaced = replaced.replace(match, replacement)
  }

  return replaced
}

const replacer = (prefix: string, s: string, handleMatch: (s: string) => string) => {
  let i = 0
  let start = 0
  let templates = [] as { match: string, replacement: string }[]
  while (i < 100) {
    i++

    start = s.indexOf(prefix, start)
    if (start === -1) break;

    const end = s.indexOf('}}', start)
    if (end === -1) break;

    const match = s.substring(start, end + 2) // +2 accounts for '}}' 
    templates.push({
      match,
      replacement: handleMatch(match)
    })

    start = end + 2
  }

  let replaced = s.toString()
  for (const { match, replacement } of templates) {
    replaced = replaced.replace(match, replacement)
  }

  return replaced
}

export const replace_sms_template_values = (s: string, sms?: Omit<SMSMessage, 'id'> | null) => {
  if (!sms) return s
  if (typeof s !== 'string') return s // e.g. Date value

  return replacer('{{sms.', s, (match) => {
    if (match === '{{sms.message}}') {
      return sms.message || ''
    }

    return ''
  })
}

export const get_secret_names = (s: string) => {
  const titles: string[] = [] 
  if (typeof s !== 'string') return titles


  replacer('{{secrets.', s, (match) => {
    const title = match.replace('{{secrets.', '').replace('}}', '')
    titles.push(title)
    return match
  })

  return titles
}
export const replace_secret_values = (s: string, integrations?: Pick<Integration, 'authentication' | 'title'>[]) => {
  if (!integrations) return s
  if (typeof s !== 'string') return s // e.g. Date value

  return replacer('{{secrets.', s, (match) => {
    const integration = integrations.find(i => i.title === match.replace('{{secrets.', '').replace('}}', ''))
    return integration?.authentication?.info?.access_token || ''
  })
}

export const replace_enduser_template_values = (s: string, enduser?: Omit<Enduser, 'id'> | null) => {
  if (!enduser) return s
  if (typeof s !== 'string') return s // e.g. Date value

  let i = 0
  let start = 0
  let templates = [] as { match: string, replacement: string }[]
  while (i < 100) {
    i++

    start = s.indexOf('{{enduser.', start)
    if (start === -1) break;

    const end = s.indexOf('}}', start)
    if (end === -1) break;

    const match = s.substring(start, end + 2) // +2 accounts for '}}' 
    templates.push({
      match,
      replacement: replace_tag_template_values_for_enduser([match], enduser)[0],
    }) 

    start = end + 2
  }

  let replaced = s.toString()
  for (const { match, replacement } of templates) {
    replaced = replaced.replace(match, replacement)
  }

  return replaced
}

export const display_time_for_seconds = (seconds?: number) => (
  typeof seconds !== 'number'
    ? ''
    : seconds > 60
      ? ` (${Math.floor(seconds / 60)} Minutes)`
      : ` (${seconds} Seconds)`
)


export const is_full_iso_string_heuristic = (d: string): Date | undefined => {
  try {
    if (d.length < 12) return // don't consider simple YYYY-MM-DD (10 characters) dates
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) { // if it's just YYYY-MM-DD, return
      return 
    }
    // ensure it does start YYYY-MM-DD but has future characters
    if (!(/\d{4}-\d{2}-\d{2}.*/.test(d))) {
      return 
    }

    const asDate = new Date(d)
    return !isNaN(asDate.getTime()) ? asDate : undefined
  } catch(err) {
    return
  }
}

export const skip_due_date_as_needed = (toSkip?: number[]) => (dueDateInMS?: number) => {
  if (!dueDateInMS) return dueDateInMS
  if (!toSkip?.length) return dueDateInMS

  let adjusted = dueDateInMS
  for (let i = 0; i < 7; i++) { // limit to 7 iterations
    if (toSkip.includes(new Date(adjusted).getDay())) {
      adjusted += 1000 * 60 * 60 * 24
    } else {
      break;
    }
  }

  return adjusted
}

export const get_flattened_fields = <T extends object>(objects: T[], options?: { includeObjectRoot?: boolean, ignore?: (keyof T & string)[], maxDepth?: number, depth?: number }): string[] => {
  const { ignore=[], maxDepth=5, depth=0, includeObjectRoot } = options ?? {}
  const fields: string[] = []

  if (depth > maxDepth) { return fields }

  for (const o of objects) {
    if (!o || typeof o !== 'object' || Array.isArray(o)) continue

    for (const rootField in o) {
      if (ignore.includes(rootField)) continue

      const value = o[rootField]      
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        fields.push(rootField)
        continue
      }

      const field = rootField

      // captures root field of object fields
      if (includeObjectRoot) {
        if (!fields.includes(field)) {
          fields.push(field)
        }
      }

      // don't include root on nested fields
      const nestedFields = get_flattened_fields([value], { ...options, includeObjectRoot: false, ignore: [], depth: depth + 1 })
      for (const nestedField of nestedFields) {
        const toAdd = `${field}.${nestedField}`
        if (fields.includes(toAdd)) continue

        fields.push(toAdd)
      }
    }
  }

  return fields
}

export const value_for_dotted_key = (v: any, key: string, o?: { handleArray?: boolean }): any => {
  let value = v
  const keys = key.split('.')

  if (o?.handleArray && keys.length >= 2 && Array.isArray(value[keys[0]])) {
    return value_for_dotted_key(value[keys[0]], keys.slice(1).join('.'), o)
  }

  for (const k of keys) {
    value = value?.[k]
  }
  return value
}

export const add_value_for_dotted_key = (_object: Record<any, any>, field: string, value: any) => {
  const keys = field.split('.')

  let object = _object
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (i === keys.length - 1) {
      object[key] = value
      continue
    }
    object = object[key]
  }
}

export const INVALID_PREPOPULATION_TYPES: FormFieldType[] = [
  'file', // won't have file data for re-upload
  'files', // won't have file data for re-upload
  'description',
  'Question Group', // unnecessary
  'Stripe', // can't prepopulate this

  // now supported
  // "Address", // split into different patient fields and non-trivial to pre-load  
]

export const get_prepopulated_responses = (fields: FormField[], enduser: Enduser, existingResponses?: FormResponseValue[]) => (
  fields
  .filter(v => (
    v.prepopulateFromFields && !INVALID_PREPOPULATION_TYPES.includes(v.type) && v.intakeField 
    && (
      (v.intakeField === 'Address' && 
        (enduser.addressLineOne || enduser.addressLineTwo || enduser.zipCode || enduser.city || enduser.zipCode || enduser.state)
      )
    || (v.intakeField === 'insurance.details' && enduser.insurance)
    || (v.intakeField === 'insuranceSecondary.details' && enduser.insuranceSecondary)
    || (enduser?.[v.intakeField as keyof typeof enduser] || enduser?.fields?.[v.intakeField])
    )
  ))
  .map(v => ({
    fieldId: v.id,
    fieldTitle: v.title,
    externalId: v.externalId,
    fieldDescription: v.description,
    fieldHtmlDescription: v.htmlDescription,
    sharedWithEnduser: v.sharedWithEnduser,
    isPrepopulatedFromEnduserField: true,
    answer: (v.type === 'Address' && v.intakeField === 'Address')
      ? {
        type: 'Address',
        value: {
          addressLineOne : enduser.addressLineOne || '',
          addressLineTwo: enduser.addressLineTwo || '',
          city: enduser.city || '',
          state: enduser.state || '',
          zipCode: enduser.zipCode || '',
          zipPlusFour: enduser.zipPlusFour || '',
        }
      }
    : (v.type === 'Insurance' && v.intakeField === 'insurance.details')
      ? {
        type: 'Insurance',
        value: enduser.insurance,
      }
    : (v.type === 'Insurance' && v.intakeField === 'insuranceSecondary.details')
      ? {
        type: 'Insurance',
        value: enduser.insuranceSecondary,
      }
    : (v.type === 'Database Select' && typeof (enduser?.[v.intakeField as keyof typeof enduser] || enduser?.fields?.[v.intakeField!]) === 'string')
      ? {
        type: "Database Select",
        value: [(enduser?.[v.intakeField as keyof typeof enduser] || enduser?.fields?.[v.intakeField!])]
      }
    : (v.type === 'Height' && enduser.height?.value)
      ? { 
        type: 'Height',
        value: {
          feet: Math.floor((parseInt(enduser.height.value as string) / 12)),
          inches: Math.floor((parseInt(enduser.height.value as string) % 12)),
        }
      }
    : (v.type === 'number' && v.intakeField === 'weight' && enduser?.weight?.value)
      ? { type: 'number', value: parseInt(enduser?.weight?.value as string) }
    : (v.type === 'number' && v.intakeField === 'height' && enduser?.height?.value)
      ? { type: 'number', value: parseInt(enduser?.height?.value as string) }
    : {
      type: v.type,
      value: (enduser?.[v.intakeField as keyof typeof enduser] || enduser?.fields?.[v.intakeField!])
    } as any
  }))
)

export const downloadFile = (data: Uint8Array | Blob | Buffer | string, options : { name?: string, dataIsURL?: boolean, type?: string}) => {
  let { name, type } = options
  name = name || "download.txt"
  type = type || "octet/stream"

  let a = document.createElement("a");
  document.body.appendChild(a);
  a.style.display = "none"

  const blob = new Blob([data as any], {type});
  const url = (
    (options.dataIsURL && typeof data === 'string')
      ? data
      : window.URL.createObjectURL(blob)
  )
  
  a.href = url;
  a.download = name;
  a.click();
  window.URL.revokeObjectURL(url);
}

export const is_timezone = (value: any): value is Timezone => (typeof value === 'string' && TIMEZONES.includes(value as Timezone))

export const enduser_address_string = (e: Enduser) => (
  `${e.addressLineOne ? e.addressLineOne : ''}${e.addressLineTwo ? ` ${e.addressLineTwo}` : ''}${e.addressLineOne || e.addressLineTwo ? ', ' : ''}${e.city ? `${e.city}, ` : ''}${e.state ? `${e.state}${e.zipCode ? ', ' : ''}` : ''}${e.zipCode ? e.zipCode : ''}${e.zipPlusFour && e.zipCode ? `-${e.zipPlusFour}`: ''}`
)
export const enduser_insurance_string = (i?: EnduserInsurance) => !i ? '' : (
  `${i.payerName}${i.memberId ? ` (${i.memberId})` : ''}`
)

export const should_show_unsubmitted_form_response_for_interval = (fr: FormResponse & { createdAt: any }) => {
  if (!fr.createdAt) return false 
  if (typeof fr.hideAfterUnsubmittedInMS !== 'number') return true
  if (fr.hideAfterUnsubmittedInMS === -1) return true
  if (new Date(fr.createdAt).getTime() + fr.hideAfterUnsubmittedInMS > Date.now()) return true

  return false
}

export const get_canvas_id = (v: Pick<Enduser, 'source' | 'externalId' | 'references'>) => (
  (v.source === CANVAS_TITLE && v.externalId)
    ? v.externalId
    : v.references?.find(r => r.type === CANVAS_TITLE)?.id
)

export const to_human_readable_phone_number = (phone?: string) => {
  if (!phone) { return '' }
  
  if (phone.length === 10) {
    return `(${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6)}`
  }

  const countryCode = phone.substring(0, phone.length - 10)
  const withoutCountryCode = phone.replace(countryCode, '')
  return `${countryCode.startsWith('+') ? '' : '+'}${countryCode} (${withoutCountryCode.substring(0, 3)}) ${withoutCountryCode.substring(3, 6)}-${withoutCountryCode.substring(6)}`
}

export const enrich_doxy_url = (url: string, e?: Enduser) => {
  if (!e) return url
  if (!url?.includes('doxy.me')) return url
  if (url.includes('?')) return url // already has query params

  return (
    `${url}?username=${e.fname || ''}${e.fname && ' '}${e.lname || ''}&autocheckin=false&pid=${e.references?.find(r => r.type === HEALTHIE_TITLE)?.id || e.id}`
  )
}

export const is_checkbox_custom_field_value = (value?: any): value is string => {
  if (!value) return false
  if (typeof value !== 'string') return false

  if (value.startsWith('checkbox:') && value.split(':')[1]?.length === 24) {
    return true
  }

  return false
}

export const get_care_team_primary = (e: Pick<Enduser, 'assignedTo' | 'primaryAssignee'>) => {
  if (!e) return
  if (!e.assignedTo?.length) return
  if (e.primaryAssignee && e.assignedTo.includes(e.primaryAssignee)) {
    return e.primaryAssignee
  }
  return e.assignedTo[0]
}

export const emit_gtm_event = (event: Record<string, any> & { event: string }) => {
  try {
    if (typeof window === 'undefined' || !(window as any).dataLayer) return

    // ensure event is not empty
    if (!event || typeof event !== 'object' || Object.keys(event).length === 0) return

    // ensure event has a name
    if (!event.event) {
      console.warn('GTM event does not have an "event" property', event)
      return
    }

    (window as any).dataLayer.push(event)
    console.log('GTM event emitted:', event)
  } catch(err) {}
}

// Find snippet keys in text, supporting both {{snippet:key}} and {{snippet.key}} syntax
export const get_snippet_keys = (s: string) => {
  const keys: string[] = []
  if (typeof s !== 'string') return keys

  // Support {{snippet:key}} syntax (original message template format)
  replacer('{{snippet:', s, (match) => {
    const key = match.replace('{{snippet:', '').replace('}}', '')
    if (key && !keys.includes(key)) {
      keys.push(key)
    }
    return match
  })

  // Support {{snippet.key}} syntax (for consistency with other template variables)
  replacer('{{snippet.', s, (match) => {
    const key = match.replace('{{snippet.', '').replace('}}', '')
    if (key && !keys.includes(key)) {
      keys.push(key)
    }
    return match
  })

  return keys
}

// Replace snippet templates with their values, supporting both {{snippet:key}} and {{snippet.key}} syntax
export const replace_snippet_template_values = (s: string, snippets?: { key: string, value: string }[]) => {
  if (!snippets?.length) return s
  if (typeof s !== 'string') return s // e.g. Date value

  let result = s

  // Replace {{snippet:key}} syntax (original message template format)
  result = replacer('{{snippet:', result, (match) => {
    const key = match.replace('{{snippet:', '').replace('}}', '')
    const snippet = snippets.find(snippet => snippet.key === key)
    return snippet?.value || ''
  })

  // Replace {{snippet.key}} syntax (for consistency with other template variables)
  result = replacer('{{snippet.', result, (match) => {
    const key = match.replace('{{snippet.', '').replace('}}', '')
    const snippet = snippets.find(snippet => snippet.key === key)
    return snippet?.value || ''
  })

  return result
}

export const resolve_integration_id = (e: Pick<Enduser, 'references' | 'source' | 'externalId'>, integrationTitle: string) => (
  (e?.source === integrationTitle && e.externalId) ? e.externalId : e.references?.find(r => r.type === integrationTitle)?.id
)

// Replace form_response template variables with their values from form responses
export const replace_form_response_template_values = (s: string, formResponse?: Pick<FormResponse, 'responses'> | null) => {
  if (!formResponse?.responses?.length) return s
  if (typeof s !== 'string') return s // e.g. Date value

  let result = s

  // Handle {{form_response.externalId}} template variables
  result = replacer('{{form_response.', result, (match) => {
    const templateMatch = match.match(/\{\{form_response\.([^}]+)\}\}/)
    if (!templateMatch) return match

    const externalId = templateMatch[1]
    const responseValue = formResponse.responses?.find(r => r.externalId === externalId)
    if (!responseValue) return match

    // Extract the string value from the response
    let stringValue = ''
    if (typeof responseValue.answer.value === 'string') {
      stringValue = responseValue.answer.value
    } else if (typeof responseValue.answer.value === 'number') {
      stringValue = responseValue.answer.value.toString()
    } else if (Array.isArray(responseValue.answer.value)) {
      // For multiple choice, dropdown, etc., join with commas
      stringValue = responseValue.answer.value.join(', ')
    } else if (responseValue.answer.value && typeof responseValue.answer.value === 'object') {
      // For complex objects, stringify them
      stringValue = JSON.stringify(responseValue.answer.value)
    }
    
    return stringValue
  })

  return result
}

/**
 * Checks if a potential availability slot violates any calendar event limits.
 *
 * @returns true if the slot should be EXCLUDED (violates a limit), false if allowed
 *
 * A slot is excluded if booking it would exceed the limit for any configured restriction.
 * For example, with a limit of "2 per 7 days", if there are already 2 events in the 7 days
 * BEFORE this slot, the slot is excluded.
 */
export const slot_violates_calendar_event_limits = ({
  slotStartTimeInMS,
  templateId,
  userId,
  calendarEventLimits,
  existingEvents,
  timezone,
}: {
  slotStartTimeInMS: number,
  templateId: string,
  userId: string,
  calendarEventLimits?: CalendarEventLimit[],
  existingEvents: Array<{ startTimeInMS: number, templateId?: string, attendees: Array<{ id: string }> }>,
  timezone: string,
}): boolean => {
  // No limits configured - slot is allowed
  if (!calendarEventLimits || calendarEventLimits.length === 0) {
    return false
  }

  // Find limits that apply to this template
  const relevantLimits = calendarEventLimits.filter(limit => limit.templateId === templateId)

  if (relevantLimits.length === 0) {
    return false
  }

  // Filter events to only those for this user and template
  const userTemplateEvents = existingEvents.filter(e =>
    e.templateId === templateId &&
    e.attendees.some(a => a.id === userId)
  )

  // Check each limit
  for (const limit of relevantLimits) {
    let eventsInPeriod: typeof userTemplateEvents = []

    if (limit.period === 1) {
      // For 1-day limit, use calendar day logic (midnight to midnight in user's timezone)
      // Include events on the same calendar day, regardless of time
      const slotDate = new Date(slotStartTimeInMS).toLocaleString('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })

      eventsInPeriod = userTemplateEvents.filter(e => {
        const eventDate = new Date(e.startTimeInMS).toLocaleString('en-US', {
          timeZone: timezone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
        return eventDate === slotDate
      })
    } else {
      // For multi-day limits, use rolling window from start of calendar day
      // Get the start of the slot's calendar day in the user's timezone
      const slotDateTime = new Date(slotStartTimeInMS)
      const slotDateStr = slotDateTime.toLocaleString('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
      const [month, day, year] = slotDateStr.split('/')

      // Create start of day in user's timezone, then convert to UTC
      const startOfDayLocal = new Date(`${year}-${month}-${day}T00:00:00`)
      const startOfDayUTC = new Date(startOfDayLocal.toLocaleString('en-US', { timeZone: 'UTC' }))
      const tzOffset = startOfDayLocal.getTime() - startOfDayUTC.getTime()
      const startOfDayInMS = slotStartTimeInMS - (slotStartTimeInMS % (24 * 60 * 60 * 1000)) - tzOffset

      // Look back (N-1) days from the start of the current day, since we include the current day
      // Example: 7-day limit = current day + previous 6 days = 7 total days
      const periodStart = startOfDayInMS - ((limit.period - 1) * 24 * 60 * 60 * 1000)
      const periodEnd = startOfDayInMS + (24 * 60 * 60 * 1000) // end of current day

      eventsInPeriod = userTemplateEvents.filter(e =>
        e.startTimeInMS >= periodStart && e.startTimeInMS < periodEnd
      )
    }

    // If we're at or over the limit, this slot violates the restriction
    if (eventsInPeriod.length >= limit.limit) {
      return true // Exclude this slot
    }
  }

  return false // All limits satisfied, slot is allowed
}

/**
 * Validates that all custom fields referenced in conditional logic exist in the organization's configuration.
 * Used to detect configuration errors in Journeys and Triggers before endusers encounter them.
 *
 * @param conditions - The conditional logic object (enduserCondition or enduserConditions)
 * @param validFields - Set of custom field names that exist in organization settings
 * @returns Array of field names that are referenced but don't exist
 *
 * @example
 * const validFields = new Set(['customField1', 'customField2'])
 * const conditions = { condition: { customField3: 'value' } }
 * const missing = validate_custom_field_references(conditions, validFields)
 * // Returns: ['customField3']
 */
export const validate_custom_field_references = (
  conditions: Record<string, any> | null | undefined,
  validFields: Set<string>
): string[] => {
  if (!conditions || object_is_empty(conditions)) {
    return []
  }

  // Built-in fields that should not be validated as custom fields
  // These are standard Enduser model fields or special derived fields
  const BUILT_IN_FIELDS = new Set([
    // Derived fields
    'Age',
    'BMI',
    'Journeys',
    'Tags', // capitalized version
    'tags', // lowercase version used in actual conditions
    'Healthie ID',
    'insurance.payerName', // Insurance Primary
    'insuranceSecondary.payerName', // Insurance Secondary
    UPCOMING_EVENT_COUNT_KEY, // '__upcomingEvents__'
    // All fields from ALL_ENDUSER_FIELDS_TO_DISPLAY_NAME
    ...Object.keys(ALL_ENDUSER_FIELDS_TO_DISPLAY_NAME),
    // All readonly fields
    ...Object.keys(READONLY_ENDUSER_FIELDS_TO_DISPLAY_NAME),
    // All nested path fields (insurance fields, etc.)
    ...Object.keys(ENDUSER_FIELDS_WITH_NESTED_PATHS_DISPLAY_NAME),
  ])

  const missingFields = new Set<string>()

  const checkConditions = (obj: any): void => {
    if (!obj || typeof obj !== 'object') {
      return
    }

    // Handle compound conditions ($and, $or)
    if (obj.$and && Array.isArray(obj.$and)) {
      obj.$and.forEach((cond: any) => checkConditions(cond))
    }
    if (obj.$or && Array.isArray(obj.$or)) {
      obj.$or.forEach((cond: any) => checkConditions(cond))
    }

    // Check the 'condition' object which contains the actual field references
    if (obj.condition && typeof obj.condition === 'object') {
      for (const fieldName in obj.condition) {
        // Skip if it's a built-in field
        if (BUILT_IN_FIELDS.has(fieldName)) {
          continue
        }

        // If it's not a built-in field and not in validFields, it's missing
        if (!validFields.has(fieldName)) {
          missingFields.add(fieldName)
        }
      }
    }
  }

  checkConditions(conditions)
  return Array.from(missingFields).sort()
}

export function calculateTimeTrackDuration(
  timestamps: { type: 'start' | 'pause' | 'resume', timestamp: Date }[],
  closedAt?: Date
): number {
  let totalMS = 0
  let lastStart: Date | null = null

  for (const event of timestamps) {
    if (event.type === 'start' || event.type === 'resume') {
      lastStart = event.timestamp
    } else if (event.type === 'pause' && lastStart) {
      totalMS += new Date(event.timestamp).getTime() - new Date(lastStart).getTime()
      lastStart = null
    }
  }

  // If still running (not paused) and closedAt is set, add final interval
  if (lastStart && closedAt) {
    totalMS += new Date(closedAt).getTime() - new Date(lastStart).getTime()
  }

  return Math.round(totalMS)
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const pad = (num: number) => num.toString().padStart(2, '0')

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}
