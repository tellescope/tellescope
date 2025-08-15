import React, { useEffect, useCallback, useMemo, useState, useRef } from "react"
import { Indexable, ScoreFilter } from "@tellescope/types-utilities"
import { is_full_iso_string_heuristic, object_is_empty, objects_equivalent, read_local_storage, replace_keys_and_values_in_object, safeJSONParse, update_local_storage, user_display_name, value_for_dotted_key } from "@tellescope/utilities"
import { LoadFunction, LoadFunctionArguments } from "@tellescope/sdk"
import { ALL_ACCESS, HEALTHIE_TITLE, UNSEARCHABLE_FIELDS } from "@tellescope/constants"
import { SearchAPIProps, useSearchAPI } from "./hooks"
import { TextFieldProps } from "./mui"
import { AgentRecord, AllergyCode, AppointmentBookingPage, AppointmentLocation, AutomationTrigger, CalendarEventTemplate, CallHoldQueue, ChatRoom, Database, DatabaseRecord, DiagnosisCode, Enduser, EnduserOrder, FaxLog, File, Form, FormGroup, Forum, Journey, ManagedContentRecord, MessageTemplateSnippet, Organization, PrescriptionRoute, SuggestedContact, Template, Ticket, TicketQueue, User, UserNotification, Waitlist } from "@tellescope/types-client"
import { Button, Checkbox, Flex, HoverPaper, LoadingButton, LoadingData, ScrollingList, SearchTextInput, Typography, useAgentRecords, useAllergyCodes, useAppointmentBookingPages, useAppointmentLocations, useAutomationTriggers, useCalendarEventTemplates, useCallHoldQueues, useChatRooms, useDatabaseRecords, useDatabases, useDiagnosisCodes, useEnduserCustomTypes, useEnduserOrders, useEndusers, useFaxLogs, useFiles, useFormGroups, useForms, useForums, useJourneys, useManagedContentRecords, useMessageTemplateSnippets, useNotifications, useOrganization, useOrganizations, usePrescriptionRoutes, useResolvedSession, useSession, useSuggestedContacts, useTemplates, useTicketQueues, useTickets, useUsers, useWaitlists, value_is_loaded } from "."
import { SxProps } from "@mui/material"
import { AccessPermissions, ListOfStringsWithQualifier } from "@tellescope/types-models"
import { phoneValidator } from "@tellescope/validation"

export type FilterV2 = Record<string, any>
export type FiltersV2 = Record<string, FilterV2>
export type FilterV2Options = { showArchived: boolean }

export const enduser_condition_to_mongodb_filter = (condition: Record<string, any> | undefined, customFields: string[]): Record<string, any> | undefined => {
  if (!condition) { return condition }

  if (condition.$and) {
    return { $and: condition.$and.map((v: any) => enduser_condition_to_mongodb_filter(v, customFields)) }
  }
  if (condition.$or) {
    return { $or: condition.$or.map((v: any) => enduser_condition_to_mongodb_filter(v, customFields)) }
  }
  if (condition.$nor) {
    return { $nor: condition.$nor.map((v: any) => enduser_condition_to_mongodb_filter(v, customFields)) }
  }
  if (condition.$not) {
    return { $not: enduser_condition_to_mongodb_filter(condition.$not, customFields) }
  }

  if (condition && typeof condition === 'object' && condition.constructor === Object) {
    const updated = { } as Record<string, any>
    for (const [_key, _value] of Object.entries(condition)) {
      const key = customFields.includes(_key) ? `fields.${_key}` : _key
      const value = enduser_condition_to_mongodb_filter(_value, customFields)
      // console.log(key, _value, value)

      if (key === 'condition') { 
        const toReturn = enduser_condition_to_mongodb_filter(value, customFields)
        delete updated.condition
        return toReturn
      } // base case is comparison to value, so just return it

      // journeys currently have a special ui/syntax in filter
      if (key === 'Journeys') {
        if ((typeof (value as any)?.$in) === 'string') {
          return { [`journeys.${(value as any).$in}`]: { $exists: true } }
        }
        else if ((typeof (value as any)?.$nin) === 'string') {
          return { [`journeys.${(value as any).$nin}`]: { $exists: false } }
        }
      }

      if (key === 'Healthie ID') {
        // $setSet ($nin null, '')
        if ((value as any)?.$nin) return { $or: [{ source: HEALTHIE_TITLE, externalId: { $nin: [null, ''] } }, { 'references.type': HEALTHIE_TITLE }] }
        // $isNotSet ($in null, '')
        if ((value as any)?.$in) return { $and: [{ source: { $ne: HEALTHIE_TITLE } }, { 'references.type': { $ne: HEALTHIE_TITLE } }] } 
      } 

      // ensure to parse string to number values
      if (key === 'height') {
        return { 
          'height.value': replace_keys_and_values_in_object(value, v => typeof v === 'string' && !v.startsWith('$') ? parseFloat(v) : v) 
        }
      }
      if (key === 'weight') {
        return { 
          'weight.value': replace_keys_and_values_in_object(value, v => typeof v === 'string' && !v.startsWith('$') ? parseFloat(v) : v) 
        }
      }
      if (key === "relationships") {
        return {
          'relationships.type': value
        }
      }

      // case for isSet and isNotSet includes empty string as unset value
      if (key === '$isSet') {
        updated.$nin = [null, '', []]
      }
      else if (key === '$isNotSet') {
        updated.$in = [null, '', []]
      }
      else if (key === '$contains') {
        updated.$regex = value
      }
      else if (key === '$doesNotContain') {
        updated.$not = { $regex: value }
      }
      else if (key === '$before') {
        updated.$lt = value
      }
      else if (key === '$after') {
        updated.$gt = value
      }
      else {
        updated[key] = value
      }
    }

    return updated
  }

  return condition
}

export const mongo_db_filter_to_enduser_condition = (filter?: FilterV2): Record<string, any> | undefined => {
  if (!filter) { return filter }

  if (objects_equivalent(filter, {
    "$and": [
      {
        "source": {
          "$ne": "Healthie"
        }
      },
      {
        "references.type": {
          "$ne": "Healthie"
        }
      }
    ]
  })) {
    return { condition: { 'Healthie ID': { $isNotSet: 'Value' } } }
  }
  if (objects_equivalent(filter, {
    "$or": [
      {
        "source": "Healthie",
        "externalId": {
          "$nin": [
            null,
            ""
          ]
        }
      },
      {
        "references.type": "Healthie"
      }
    ]
  })) {
    return { condition: { 'Healthie ID': { $isSet: 'Value' } } }
  }

  if (filter.$and) {
    return { $and: filter.$and.map((v: any) => mongo_db_filter_to_enduser_condition(v)) }
  }
  if (filter.$or) {
    return { $or: filter.$or.map((v: any) => mongo_db_filter_to_enduser_condition(v)) }
  }
  if (filter.$nor) {
    return { $nor: filter.$nor.map((v: any) => mongo_db_filter_to_enduser_condition(v)) }
  }
  if (filter.$not) {
    return { $not: mongo_db_filter_to_enduser_condition(filter.$not) }
  }

  if (filter && typeof filter === 'object' && filter.constructor === Object) {
    if (object_is_empty(filter)) return filter

    const updated = { condition: { } as Record<string, any> }

    for (const [_key, value] of Object.entries(filter)) {
      const key = (
        (typeof _key === 'string' && _key.startsWith('fields.')) ? _key.replace('fields.', '')
      : _key === 'height.value' ? 'height'
      : _key === 'weight.value' ? 'weight'
      : _key === 'relationships.type' ? 'relationships'
          : _key
      )

      if (value && typeof value === 'object' && value.constructor === Object) {
        updated.condition[key] = {} as Record<string, any>
        if (Object.keys(value)[0] === '$exists') {
          if (key.startsWith('journeys.')) {
            // journeys currently have a special ui/syntax in filter
            updated.condition['Journeys'] = { [value.$exists ? '$in' : '$nin']: key.split('.')[1] }
          }
          else if (value.$exists) { updated.condition[key]['$isSet'] = "Value" }
          else { updated.condition[key]['$isNotSet'] = "Value" }
        }

        // case for isSet and isNotSet includes empty string as unset value
        else if (Array.isArray(value.$in) && value.$in.length === 3 && value.$in.includes(null) && value.$in.includes('') && value.$in.find((v: any) => Array.isArray(v) && v.length === 0)) {
          updated.condition[key]['$isNotSet'] = "Value"
        }
        else if (Array.isArray(value.$nin) && value.$nin.length === 3 && value.$nin.includes(null) && value.$nin.includes('') && value.$nin.find((v: any) => Array.isArray(v) && v.length === 0)) {
          updated.condition[key]['$isSet'] = "Value"
        }

        else if (Object.keys(value)[0] === '$gt' && (value.$gt instanceof Date || is_full_iso_string_heuristic(value.$gt) || value.$gt === '$now')) {
          updated.condition[key]['$after'] = value.$gt
        }
        else if (Object.keys(value)[0] === '$lt' && (value.$lt instanceof Date || is_full_iso_string_heuristic(value.$lt) || value.$lt === '$now')) {
          updated.condition[key]['$before'] = value.$lt
        }
        else if (Object.keys(value)[0] === '$regex') {
          updated.condition[key]['$contains'] = value.$regex
        }
        else if (Object.keys(value)[0] === '$not' && Object.keys(value.$not ?? {})?.[0] === '$regex') {
          updated.condition[key]['$doesNotContain'] = value.$not.$regex
        } else {
          updated.condition[key] = value
        }
      }
      else {
        updated.condition[key] = value
      }
    }

    return updated
  }

  return filter
}

export const list_of_strings_with_qualifier_to_mongodb_filter = (tags?: ListOfStringsWithQualifier) => {
  if (tags?.qualifier === 'All Of') {
    return { $all: tags.values || [] }
  }
  return { $in: tags?.values || [] }
}
export const mongo_db_filter_to_list_of_strings_with_qualifier = (filter?: FilterV2): ListOfStringsWithQualifier => {
  const defaultValue: ListOfStringsWithQualifier = { qualifier: 'One Of', values: [] }

  if (!filter) { return defaultValue }
  if (filter.$all) {
    return { values: filter.$all, qualifier: 'All Of' }
  }
  if (filter.$in) {
    return { values: filter.$in, qualifier: 'One Of' }
  }

  return defaultValue
}

export interface FilterComponentWithDefaultKeyV2 {
  filters: FiltersV2,
  setFilters: React.Dispatch<React.SetStateAction<FiltersV2>>,
  onKeyDown?: (e: { code: string }) => void,
}
// can include a version with an optional key, but make sure to use it in all cases when it's possibly passed as a prop (don't just use a string literal as default)
export interface FilterComponentV2 extends FilterComponentWithDefaultKeyV2 {
  filterKey: string,
}

export const apply_mongodb_style_filter = <T,>(data: T[], filter: FilterV2, options: FilterV2Options): T[] => {
  const matchesFilter = (item: any, filter: FilterV2): boolean => {
    if (!options.showArchived && item?.archivedAt) return false 

    for (const [key, condition] of Object.entries(filter)) {
      if (key === "$and") {
        if (!Array.isArray(condition) || !condition.every((subFilter) => matchesFilter(item, subFilter))) {
          return false;
        }
      } else if (key === "$or") {
        if (!Array.isArray(condition) || !condition.some((subFilter) => matchesFilter(item, subFilter))) {
          return false;
        }
      } else if (key === "$nor") {
        if (!Array.isArray(condition) || condition.some((subFilter) => matchesFilter(item, subFilter))) {
          return false;
        }
      } else if (key === "$not") {
        if (typeof condition !== "object" || matchesFilter(item, condition)) {
          return false;
        }
      } else {
        const value = value_for_dotted_key(item, key, { handleArray: true });
        // console.log('checking value', key, value, condition)

        // to be consistent with mongodb, $in/$nin should match null and undefined
        const modifyArrayOperandForNull = (v: any[]) => ([
          ...v,
          ...(v.includes(null) ? [undefined] : []),
        ])

        if (Array.isArray(value)) {
          if (typeof condition === "object" && condition !== null) {
            for (const [operator, operand] of Object.entries(condition)) {
              // handle empty array
              if (Array.isArray(value) && value.length === 0) {
                if (operator === '$eq' && Array.isArray(operand) && operand.length === 0) { continue }
                if (operator === '$ne' && Array.isArray(operand) && operand.length === 0) { return false }
                if (Array.isArray(operand) && operand.find(a => Array.isArray(a) && a.length === 0)) {
                  if (operator === '$in') { continue }
                  if (operator === '$nin') { return false }
                }
              }

              if (operator === '$eq' && !value.includes(operand)) return false
              if (operator === '$ne' && value.includes(operand)) return false
              
              if (operator === "$in"   && Array.isArray(operand) && !modifyArrayOperandForNull(operand).some((o: any) => value.includes(o))) return false;
              if (operator === "$nin"  && Array.isArray(operand) && modifyArrayOperandForNull(operand).some((o: any) => value.includes(o))) return false;

              if (operator === "$all"  && Array.isArray(operand) && !operand.every((o: any) => value.includes(o))) return false;
              if (operator === '$all' && condition.length === 0) return false
              if (operator === '$all' && Array.isArray(operand) && operand.length === 0) return false

              if (operator === "$size" && value.length !== operand) return false;

              if (operator === '$exists' && operand === false) return false
            }
          } else {
            if (!value.includes(condition)) return false;
          }
        } else {
          if (typeof condition === "object" && condition !== null) {          
            for (const [operator, operand] of Object.entries(condition)) {
              const numberValue = (
                is_full_iso_string_heuristic((value as any)?.toString())
                  ? new Date(value).getTime()
                  : parseFloat(value)
              )
              const parsedOperandForNumber = (
                is_full_iso_string_heuristic((operand as any)?.toString())
                  ? new Date(operand as any).getTime()
              : operand === '$now'
                  ? new Date().getTime()
                  : parseFloat(operand as any)
              )

              if (operator === "$eq" && value !== operand) return false;
              if (operator === "$ne" && value === operand) return false;
              if (operator === "$in" && (!Array.isArray(operand) || !(modifyArrayOperandForNull(operand).includes(value)))) return false; 
              if (operator === "$nin" && !(Array.isArray(operand) && !modifyArrayOperandForNull(operand).includes(value))) return false;
              if (operator === "$exists" && ((operand && value === undefined) || (!operand && value !== undefined))) return false;
              if (operator === "$regex" && !(typeof value === "string" && new RegExp(operand as string).test(value))) return false;
              if (operator === "$gt" && (numberValue <= parseFloat(parsedOperandForNumber as any) || isNaN(numberValue) || numberValue === null || numberValue === undefined)) return false;
              if (operator === "$gte" && (numberValue < parseFloat(parsedOperandForNumber as any) || isNaN(numberValue) || numberValue === null || numberValue === undefined)) return false;
              if (operator === "$lt" && (numberValue >= parseFloat(parsedOperandForNumber as any) || isNaN(numberValue) || numberValue === null || numberValue === undefined)) return false;
              if (operator === "$lte" && (numberValue > parseFloat(parsedOperandForNumber as any) || isNaN(numberValue) || numberValue === null || numberValue === undefined)) return false;

              // only valid for lists, shoujld return false by default
              if (operator === '$all') return false
            }
          } else {
            if (value !== condition) return false;
          }
        }
      }
    }

    return true;
  };

  try {
    return data.filter(item => matchesFilter(item, filter))
  } catch(err) {
    console.error("Filter error:", err)
  }

  return data
}

export const remove_inactive_filters = (filters: Record<string, any>[]) => (
  filters.map(f => {
    // gpt4o
    const cleanedFilter = Object.entries(f).reduce((acc, [key, value]) => {
      if (key === "$and" || key === "$or") {
        const subFilters = Array.isArray(value) ? value.filter(sub => Object.keys(sub).length > 0) : [];
        if (subFilters.length > 0) {
          acc[key] = subFilters;
        }
      } else if (key === "$in" || key === "$all") {
        if (Array.isArray(value) && value.length > 0) {
          acc[key] = value;
        }
      } else if (key === "$exists" || key === "$not") {
        acc[key] = value;
      } else if (typeof value === "object" && value !== null) {
        const nestedFilter = remove_inactive_filters([value])[0];
        if (nestedFilter && Object.keys(nestedFilter).length > 0) {
          acc[key] = nestedFilter;
        }
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    return Object.keys(cleanedFilter).length > 0 ? cleanedFilter : null;

  })
  .filter(v => v && !object_is_empty(v))
)

export const useFiltersV2 = <T,>(
  args?: { 
    memoryId?: string, 
    initialFilters?: FiltersV2,
    reload?: boolean, 
    onFilterChange?: (fs: FiltersV2) => void,
    showArchived?: boolean,
  }
) => {
  const { onFilterChange, reload, memoryId, initialFilters, showArchived } = args ?? {}

  const loadFilters = useCallback(() => (
    initialFilters || (
      memoryId 
        ? (safeJSONParse(read_local_storage(memoryId)) || {}) 
        : {}
    )
  ), [initialFilters, memoryId])

  const [filters, setFilters] = React.useState<FiltersV2>(loadFilters())

  const didReloadRef = useRef(false)
  useEffect(() => {
    if (!reload) return
    if (didReloadRef.current) return
    didReloadRef.current = true

    setFilters(loadFilters)
  }, [reload, loadFilters])

  useEffect(() => {
    if (!memoryId) return
    update_local_storage(memoryId, JSON.stringify(filters))
  }, [filters, memoryId])

  const prevFilterRef = React.useRef(filters)
  useEffect(() => {
    if (!onFilterChange) return
    if (objects_equivalent(prevFilterRef.current, filters)) return

    prevFilterRef.current = filters
    onFilterChange(filters)
  }, [filters, onFilterChange])

  const mdbFilter = useMemo(() => ({ 
    $and: remove_inactive_filters(Object.values(filters))
  }), [filters])

  const applyFilters = useCallback((
    (data: T[]) => apply_mongodb_style_filter(data, mdbFilter, { showArchived: !!showArchived })
  ), [mdbFilter, showArchived])

  return { 
    mdbFilter,
    filters, 
    setFilters,
    applyFilters,
    activeFilterCount: Object.values(filters).filter(f => !!f.filter).length
  }
}

/* FILTER / SEARCH */
export const filter_setter_for_key = <T,>(key: string, setFilters: React.Dispatch<React.SetStateAction<Filters<T>>>) => (
  f: ScoreFilter<T>
) => setFilters(fs => ({ ...fs, [key]: { ...fs?.[key], filter: f } }))

export const apply_filters = <T,>(fs: Filters<T>, data: T[]): T[] => {
  let shouldSort = false
  const scored: { value: T, score: number }[] = []
  const filtered = data.filter(d => {
    let totalScore = 0
    for (const f of Object.values(fs)) {
      if (!f?.filter) continue

      const score = f.filter(d)
      if (score === 0) return false

      totalScore += score
    }

    if (totalScore > 1) {
      shouldSort = true
      scored.push({
        score: totalScore,
        value: d,
      })
    }
    return true
  })

  return (
    shouldSort
      ? scored.sort((v1, v2) => v2.score - v1.score).map(v => v.value)
      : filtered
  )
}

export const useFilters = <T,>(
  args?: 
  { 
    memoryId?: string, 
    initialFilters?: Filters<T>, 
    reload?: boolean, 
    deserialize?: (fs: Filters<T>) => Filters<T>, 
    onFilterChange?: (fs: Filters<T>) => void,
    showArchived?: boolean,
  }
) => {
  const { onFilterChange, reload, memoryId, initialFilters, deserialize, showArchived, } = args ?? {}
  if (memoryId && !deserialize) console.warn("memoryId provided without deserialize")

  const [filters, setFilters] = React.useState<Filters<T>>(
    initialFilters || (
      (memoryId && deserialize)
        ? deserialize((safeJSONParse(read_local_storage(memoryId)) || {}))
        : {}
    )
  )

  const didReloadRef = useRef(false)
  useEffect(() => {
    if (!reload) return
    if (didReloadRef.current) return
    didReloadRef.current = true

    setFilters(
      initialFilters || (
        (memoryId && deserialize)
          ? deserialize((safeJSONParse(read_local_storage(memoryId)) || {}))
          : {}
      )
    )

  }, [reload, initialFilters, memoryId, deserialize])

  useEffect(() => {
    if (!memoryId) return
    update_local_storage(memoryId, JSON.stringify(filters))
  }, [filters, memoryId])

  const prevFilterRef = React.useRef(filters)
  useEffect(() => {
    if (!onFilterChange) return
    if (objects_equivalent(prevFilterRef.current, filters)) return

    prevFilterRef.current = filters
    onFilterChange(filters)
  }, [filters, onFilterChange])

  const applyFilters = useCallback((
      (data: T[]) => apply_filters(filters, data).filter(v => 
        (showArchived ?? true) ? true : !(v as any).archivedAt
      )
    ),
    [filters, showArchived]
  )

  const compoundApiFilter = useMemo(() => {
    let toReturn: LoadFunctionArguments<T> | null = (
      Object.values(filters).map(f => f.apiFilter).filter(a => !!a).length === 0
        ? null
        : {}
    )

    if (toReturn) {
      for (const f of Object.values(filters)) {
        if (!f.apiFilter) continue

        toReturn = { 
          ...toReturn,
          filter: {
            ...toReturn?.filter, 
            ...f.apiFilter.filter,
          },
        }

        // add search when included, defaulting to most recent (tho, there should only be one)
        if (f.apiFilter?.search?.query) {
          toReturn.search = f.apiFilter.search
        }
      }
    }

    return toReturn
  }, [filters])

  return { 
    filters, 
    compoundApiFilter,
    setFilters,
    applyFilters,
    activeFilterCount: Object.values(filters).filter(f => !!f.filter).length
  }
}

export const record_field_matches_query = (value: any, query: string) => {
  if (
    typeof value === 'string' && value.toUpperCase().includes(query.toUpperCase())
  ) {
    return true
  }
  
  if (typeof value === 'number' && value.toString() === query) {
    return true
  }

  if (typeof value === 'object') {
    for (const k in value) {
      if (record_field_matches_query(value[k], query)) {
        return true
      }
    }
  }

  return false
}

export const record_matches_for_query = <T,>(records: T[], query: string) => {
  const matches = [] as T[]

  for (const record of records) {
    for (const field in record) {
      const value = record[field]
      if (UNSEARCHABLE_FIELDS.includes(field)) continue

      if (record_field_matches_query(value, query)) {
        matches.push(record)
        break; 
      }
    }
  }

  return matches
}

const is_phone_prefix = (s: string) => {
  if (s.length <= 3) return false

  // has ONLY numbers, (), +, - and spaces
  return /^[ 0-9()+-]+$/.test(s)
}

export const filter_for_query = <T,>(query: string, getAdditionalFields?: (v: T) => Indexable | undefined): FilterWithData<T> => {
  const baseFilter = (record: Indexable): number => {
    if (!record) return 0
    if (query === '') return 1
    const queryLC = query.toLowerCase()

    let score = 0

    // heuristic for high priority matching against full name
    if (record?.fname && record?.lname) {
      const fullName = `${record.fname} ${record.lname}`.toLowerCase()
      if (fullName === queryLC) {
        score += 50 
      }
      else if (fullName.startsWith(queryLC)) {
        score += 25
      } 
      else if (fullName.includes(queryLC) && queryLC.length > 3) {
        score += 10
      }
    }

    const toAdd = getAdditionalFields?.(record as T)
    const joined = { ...toAdd, ...record }

    for (const field in joined) {
      const value = joined[field as keyof typeof record]

      // exact match is useful for things like id match and easy heuristic check for others
      if (value === query) {
        score += 10; 
        continue
      }
      
      if (UNSEARCHABLE_FIELDS.includes(field)) continue
      
      // ensure not-null
      if (value && typeof value === 'object') {
        // recursve on nested object values
        if (Object.values(value).find(
          a => {
            if (typeof a === 'string') return a.toUpperCase().includes(query.toUpperCase())
            if (typeof a === 'object') return baseFilter(a as Indexable)
            return false
          }
        )) {
          score += 1
          continue
        }
      }       
      if (typeof value !== 'string') continue
      if (value.toUpperCase().includes(query.toUpperCase())) {
        score +=1
        continue
      }
      // for phone number search, replace human-readable entries which are not stored
      if (is_phone_prefix(query)) {
        const onlyNumbers = query.replaceAll(/[^0-9]/g, '')
        if ( 
          onlyNumbers.length >= 3 &&
          value.toUpperCase().includes(onlyNumbers)
        ) {
          score +=1
          continue
        } 
      }
    }

    return score
  }

  return ({
    filter: (record: T) => baseFilter(record as Indexable),
    apiFilter: { search: { query } },
  })
}

export const performBulkAction = async <T extends { id: string }, R> ({ 
  allSelected,
  // apiFilter, 
  applyFilters,
  selected, 
  processBatch, 
  onSuccess,
  fetchBatch,
  batchSize=100, 
  dontAlert,
} : BulkActionProps<T> & {
  batchSize?: number,
  fetchBatch: LoadFunction<T>,
  processBatch: (matches: T[]) => Promise<R & { error?: string, successCount?: number }>,
  dontAlert?: boolean,
}) => {
  if (!(selected || allSelected)) throw new Error("One of allSelected or selected is required")
  if (batchSize <= 0) throw new Error("batchSize must be at least 1")
  const args: LoadFunctionArguments<T> = (
    allSelected 
      ? {}
      : { ids: selected }
  )

  let successCount = 0
  const errors: string[] = []

  args.limit = batchSize
  const results = []
  const loaded: T[] = []
  while (true) {
    const matches = await fetchBatch(args)
    if (matches.length === 0) break

    loaded.push(...matches)

    const toProcess = applyFilters(matches)

    if (toProcess.length) {
      const { successCount: _successCount, error, ...result } = await processBatch(toProcess)
      results.push(result)
      if (_successCount) { successCount += _successCount }
      if (error) { errors.push(error) }
    }
    
    if (matches.length < batchSize) {
      break
    }

    args.lastId = matches[matches.length - 1].id
  }

  if (!dontAlert && (successCount || errors.length)) {
    alert(
`Success Count: ${successCount}${errors.length ? `\nErrors: ${errors.join('\n')}` : ''}`
)
  }

  // clean up in case same object is reused for future queries
  delete args.lastId

  onSuccess?.(loaded)

  return results
}

export interface BulkActionProps <T>{
  allSelected?: boolean,
  selected?: string[],
  customTypeId?: string,
  // apiFilter?: LoadFunctionArguments<T> | null,
  applyFilters: (v: T[]) => T[],
  onSuccess?: (loaded: T[]) => void,
  onError?: (message: string) => void,
}

export type NumericFilter<T,> = ((f: T) => number)
export type FilterWithData<T> = {
  filter: null | NumericFilter<T>,
  apiFilter: LoadFunctionArguments<T> | null,
  data?: Indexable,
}
export interface Filters<T> {
  [index: string]: FilterWithData<T>
}

export interface FilterComponentWithDefaultKey<T> {
  filters: Filters<T>,
  setFilters: React.Dispatch<React.SetStateAction<Filters<T>>>,
  onKeyDown?: (e: { code: string }) => void,
}
// can include a version with an optional key, but make sure to use it in all cases when it's possibly passed as a prop (don't just use a string literal as default)
export interface FilterComponent<T> extends FilterComponentWithDefaultKey<T> {
  filterKey: string,
}

export interface GenericSearchProps <T> extends FilterComponent<T> {
  placeholder?: string,
  fullWidth?: boolean,
  label?: string,
  style?: React.CSSProperties,
  size?: TextFieldProps['size'],
  sx?: SxProps,
  attachSearchableFields?: (v: T) => Indexable | undefined,
  dontFetch?: boolean,
  autoFocus?: boolean,
  value?: string,
  onChange?: (s: string) => void,
  hideIcon?: boolean,
  variant?: TextFieldProps['variant'],
}
interface ModelSearchProps<T> extends GenericSearchProps<T>, SearchAPIProps<T> {}
export const ModelSearchInput = <T,>({ 
  filterKey, setFilters, searchAPI, onLoad, 
  attachSearchableFields,

  // @ts-ignore remove from props if provided by mistake
  activeFilterCount, 
  // @ts-ignore remove from props if provided by mistake
  compoundApiFilter, 

  value,
  onChange,

  ...props 
} : ModelSearchProps<T>) => {
  let dontPersist = false
  try { // may fail to load if enduser session
    const [organizationLoading] = useOrganization()
    dontPersist = !!(value_is_loaded(organizationLoading) ? organizationLoading.value?.settings?.interface?.dontPersistSearches : undefined  )
  } catch(err) {}

  const cacheKey = `search-cache-${filterKey}`
  const [_query, _setQuery] = useState(dontPersist ? '' : (read_local_storage(cacheKey) || ''))

  const query = value ?? _query
  const setQuery = onChange ?? _setQuery
  const filterOnLoadRef = useRef(!!query)

  useEffect(() => {
    update_local_storage(cacheKey, query) 
  }, [query])

  useEffect(() => onChange?.(query), [onChange, query])

  useSearchAPI({ query, searchAPI, onLoad })

  useEffect(() => {
    const t = setTimeout(() => {
      setFilters(fs => (
        (fs[filterKey]?.apiFilter?.search?.query === query && !filterOnLoadRef.current)
          ? fs
          : { ...fs, [filterKey]: filter_for_query(query, attachSearchableFields) }
      )) 

      filterOnLoadRef.current = false
    }, 50)

    return () => { clearTimeout(t) } 
  }, [query, filterKey, setFilters, attachSearchableFields])

  return (
    <SearchTextInput {...props} value={query} onChange={(s: string) => setQuery(s)} />
  )
}


export const EnduserSearch = (props: Omit<GenericSearchProps<Enduser>, 'filterKey'> & { filterKey?: string }) => {
  const session = useResolvedSession()
  const [, { addLocalElements }] = useEndusers()
  const [usersLoading, { findById: findUser }] = useUsers() 

  // wait for users to load, so that a saved query is able to match attachSearchableFields
  // only wait when users have ALL_ACCESS to ensures users can actually load
  if (((session.userInfo as any)?.access as AccessPermissions)?.users?.read === ALL_ACCESS && !value_is_loaded(usersLoading)) return null
  return (
    <ModelSearchInput filterKey="endusers" {...props} 
      searchAPI={async ({ search }) => {
        // handle case of formatted phone number in search bar by parsing to standard phone format and searching explicitly by phone
        // in this case, also search by generic search term in case user is intending to search by something else (e.g. externalId)
        try {
          const phone = phoneValidator.validate()(search.query)
          if (phone) {
            return (
              await Promise.all([
                session.api.endusers.getSome({ filter: { phone }}),
                session.api.endusers.getSome({ search }),
              ])
            ).flatMap(v => v)
          }
        } catch(err) {}
        return session.api.endusers.getSome({ search })
      }}
      onLoad={addLocalElements}
      attachSearchableFields={t => {
        const users = t.assignedTo?.map(userId => findUser(userId, { batch: true })).filter(u => u) as User[]
        if (!users?.length) return undefined

        const toJoin = {} as Record<string,string>
        users.forEach((user, i) => {
          toJoin[`${i}fname`] = user.fname || '';
          toJoin[`${i}lname`] = user.lname || '';
          toJoin[`${i}fullname`]=  `${user.fname} ${user.lname}`;
        })

        return toJoin
      }}
    />
  )
}

export const CHAT_ROOM_SEARCH = 'chat-room-search'
export const ChatRoomSearch = (props: Omit<GenericSearchProps<ChatRoom>, 'filterKey'> & { filterKey?: string }) => {
  const session = useResolvedSession()
  const [, { addLocalElements }] = useChatRooms()
  const [usersLoading, { findById: findUser }] = useUsers() 
  const [endusersLoading, { findById: findEnduser }] = useEndusers()

  // wait for users/endusers to load, so that a saved query is able to match attachSearchableFields
  if (!value_is_loaded(usersLoading)) return null
  if (!value_is_loaded(endusersLoading)) return null
  return (
    <ModelSearchInput filterKey={TICKET_SEARCH_FILTER_KEY} {...props} 
      searchAPI={session.api.chat_rooms.getSome}
      onLoad={addLocalElements}
      attachSearchableFields={r => {
        const users = (r.userIds || []).map(r => findUser(r, { batch: true })!).filter(u => u)

        const enduserIds = [
          ...r.enduserIds || [],
          ...r.aboutEnduserId ? [r.aboutEnduserId] : [],
        ]
        const endusers = enduserIds.map(r => findEnduser(r, { batch: true })!).filter(e => e)

        const fields = {} as Record<string, string>
        let i = 0
        for (const user of users) {
          i ++
          fields[`user_fname${i}`] = user.fname || '';
          fields[`user_lname${i}`] = user.lname || '';
          fields[`user_fullname${i}`] = `${user.fname} ${user.lname}`;
          fields[`user_email${i}`] = user.email || '';
        }

        i = 0
        for (const enduser of endusers) {
          i ++
          fields[`enduser_fname${i}`] = enduser.fname || '';
          fields[`enduser_lname${i}`] = enduser.lname || '';
          fields[`enduser_fullname${i}`] = `${enduser.fname} ${enduser.lname}`;
          fields[`enduser_email${i}`] = enduser.email || '';
          if (enduser.tags?.length) {
            fields[`tags${i}`] = enduser.tags.join(',')
          }
        }
    
        return fields
      }}
    />
  )
}

export const TICKET_SEARCH_FILTER_KEY = 'ticket-search'
export const TicketSearch = (props: Omit<GenericSearchProps<Ticket>, 'filterKey'> & { filterKey?: string }) => {
  const session = useResolvedSession()
  const [, { addLocalElements }] = useTickets()
  const [usersLoading, { findById: findUser }] = useUsers() 
  const [endusersLoading, { findById: findEnduser }] = useEndusers() 

  // wait for users/endusers to load, so that a saved query is able to match attachSearchableFields
  if (!value_is_loaded(usersLoading)) return null
  if (!value_is_loaded(endusersLoading)) return null
  return (
    <ModelSearchInput filterKey={TICKET_SEARCH_FILTER_KEY} {...props} 
      searchAPI={session.api.tickets.getSome}
      onLoad={addLocalElements}
      attachSearchableFields={t => {
        const user = findUser(t.owner ?? '', { batch: true })
        const enduser = findEnduser(t.enduserId ?? '', { batch: true })
        if (!(user || enduser)) return undefined
    
        const fields = {} as Record<string, string>
        if (user) {
          fields.user_fname = user.fname || '';
          fields.user_lname = user.lname || '';
          fields.user_fullname = `${user.fname} ${user.lname}`;
          fields.user_email = user.email || '';
        }
        if (enduser) {
          fields.enduser_fname = enduser.fname || '';
          fields.enduser_lname = enduser.lname || '';
          fields.enduser_fullname = `${enduser.fname} ${enduser.lname}`;
          fields.enduser_email = enduser.email || '';
          if (enduser.tags?.length) {
            fields.tags = enduser.tags.join(',')
          }
        }
    
        return fields
      }}
    />
  )
}

export const ENDUSER_ORDERS_SEARCH_FILTER_KEY = 'ticket-search'
export const EnduserOrdersSearch = (props: Omit<GenericSearchProps<EnduserOrder>, 'filterKey'> & { filterKey?: string }) => {
  const session = useResolvedSession()
  const [, { addLocalElements }] = useEnduserOrders()
  const [endusersLoading, { findById: findEnduser }] = useEndusers() 

  // wait for users/endusers to load, so that a saved query is able to match attachSearchableFields
  if (!value_is_loaded(endusersLoading)) return null
  return (
    <ModelSearchInput filterKey={ENDUSER_ORDERS_SEARCH_FILTER_KEY} {...props} 
      searchAPI={session.api.enduser_orders.getSome}
      onLoad={addLocalElements}
      attachSearchableFields={t => {
        const enduser = findEnduser(t.enduserId ?? '', { batch: true })
        if (!enduser) return undefined
    
        const fields = {} as Record<string, string>
        if (enduser) {
          fields.enduser_fname = enduser.fname || '';
          fields.enduser_lname = enduser.lname || '';
          fields.enduser_fullname = `${enduser.fname} ${enduser.lname}`;
          fields.enduser_email = enduser.email || '';
          if (enduser.tags?.length) {
            fields.tags = enduser.tags.join(',')
          }
        }
    
        return fields
      }}
    />
  )
}

export const PrescriptionRoutesSearch = (props: Omit<GenericSearchProps<PrescriptionRoute>, 'filterKey'> & { filterKey?: string }) => {
  const session = useSession()
  const [, { addLocalElements }] = usePrescriptionRoutes()

  return (
    <ModelSearchInput filterKey="prescription_routes" {...props} 
      searchAPI={session.api.prescription_routes.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const FaxSearch = (props: Omit<GenericSearchProps<FaxLog>, 'filterKey'> & { filterKey?: string }) => {
  const session = useSession()
  const [, { addLocalElements }] = useFaxLogs()

  return (
    <ModelSearchInput filterKey="fax_logs" {...props} 
      searchAPI={session.api.fax_logs.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const FileSearch = (props: Omit<GenericSearchProps<File>, 'filterKey'> & { filterKey?: string }) => {
  const session = useSession()
  const [, { addLocalElements }] = useFiles()
  const [, { findById: findEnduser }] = useEndusers() 

  return (
    <ModelSearchInput filterKey="files" {...props} 
      searchAPI={session.api.files.getSome}
      onLoad={addLocalElements}
      attachSearchableFields={t => {
        const enduser = t.enduserId ? findEnduser(t.enduserId, { batch: true }) : undefined
        if (!enduser) return undefined

        const toJoin = {
          fname: enduser.fname,
          lname: enduser.lname,
          fullname: `${enduser.fname} ${enduser.lname}`,
        } 

        return toJoin
      }}
    />
  )
}

export const SuggestedContactSearch = (props: Omit<GenericSearchProps<SuggestedContact>, 'filterKey'> & { filterKey?: string }) => {
  const session = useSession()
  const [, { addLocalElements }] = useSuggestedContacts({ dontFetch: true })
  return (
    <ModelSearchInput filterKey="suggested-contact" {...props} 
      searchAPI={session.api.suggested_contacts.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const WaitlistSearch = (props: Omit<GenericSearchProps<Waitlist>, 'filterKey'> & { filterKey?: string }) => {
  const session = useSession()
  const [, { addLocalElements }] = useWaitlists({ dontFetch: true })
  return (
    <ModelSearchInput filterKey="waitlist" {...props} 
      searchAPI={session.api.waitlists.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const AgentRecordSearch = (props: Omit<GenericSearchProps<AgentRecord>, 'filterKey'> & { filterKey?: string }) => {
  const session = useSession()
  const [, { addLocalElements }] = useAgentRecords({ dontFetch: true })
  return (
    <ModelSearchInput filterKey="agent-record" {...props} 
      searchAPI={session.api.agent_records.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const AllergyCodeSearch = (props: Omit<GenericSearchProps<AllergyCode>, 'filterKey'> & { filterKey?: string }) => {
  const session = useSession()
  const [, { addLocalElements }] = useAllergyCodes({ dontFetch: true })
  return (
    <ModelSearchInput filterKey="allergy-code" {...props} 
      searchAPI={session.api.allergy_codes.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const DiagnosisCodeSearch = (props: Omit<GenericSearchProps<DiagnosisCode>, 'filterKey'> & { filterKey?: string }) => {
  const session = useSession()
  const [, { addLocalElements }] = useDiagnosisCodes({ dontFetch: true })
  return (
    <ModelSearchInput filterKey="diagnoses-code" {...props} 
      searchAPI={session.api.diagnosis_codes.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const CallHoldQueueSearch = (props: Omit<GenericSearchProps<CallHoldQueue>, 'filterKey'> & { filterKey?: string }) => {
  const session = useSession()
  const [, { addLocalElements }] = useCallHoldQueues({ dontFetch: true })
  return (
    <ModelSearchInput filterKey="call-hold-queue" {...props} 
      searchAPI={session.api.call_hold_queues.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const TicketQueueSearch = (props: Omit<GenericSearchProps<TicketQueue>, 'filterKey'> & { filterKey?: string }) => {
  const session = useSession()
  const [, { addLocalElements }] = useTicketQueues({ dontFetch: true })
  return (
    <ModelSearchInput filterKey="ticket-queue" {...props} 
      searchAPI={session.api.ticket_queues.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const NotificationSearch = (props: Omit<GenericSearchProps<UserNotification>, 'filterKey'> & { filterKey?: string }) => {
  const session = useSession()
  const [, { addLocalElements }] = useNotifications()
  return (
    <ModelSearchInput filterKey="notifications-search" {...props} 
      searchAPI={session.api.user_notifications.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const FormSearch = (props: Omit<GenericSearchProps<Form>, 'filterKey'> & { filterKey?: string }) => {
  const session = useSession()
  const [, { addLocalElements }] = useForms()
  return (
    <ModelSearchInput filterKey="form-search" {...props} 
      searchAPI={session.api.forms.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const FormGroupSearch = (props: Omit<GenericSearchProps<FormGroup>, 'filterKey'> & { filterKey?: string }) => {
  const session = useSession()
  const [, { addLocalElements }] = useFormGroups()
  return (
    <ModelSearchInput filterKey="form-group-search" {...props} 
      searchAPI={session.api.form_groups.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const AutomationTriggerSearch = (props: Omit<GenericSearchProps<AutomationTrigger>, 'filterKey'> & { filterKey?: string }) => {
  const session = useSession()
  const [, { addLocalElements }] = useAutomationTriggers()
  return (
    <ModelSearchInput filterKey="trigger-search" {...props} 
      searchAPI={session.api.automation_triggers.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const JourneySearch = (props: Omit<GenericSearchProps<Journey>, 'filterKey'> & { filterKey?: string }) => {
  const session = useSession()
  const [, { addLocalElements }] = useJourneys()
  return (
    <ModelSearchInput filterKey="journeys" {...props} 
      searchAPI={session.api.journeys.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const TemplateSearch = (props: Omit<GenericSearchProps<Template>, 'filterKey'> & { filterKey?: string }) => {
  const session = useSession()
  const [, { addLocalElements }] = useTemplates()
  return (
    <ModelSearchInput filterKey="templates" {...props} 
      searchAPI={session.api.templates.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const ForumSearch = (props: Omit<GenericSearchProps<Forum>, 'filterKey'> & { filterKey?: string }) => {
  const session = useResolvedSession()
  const [, { addLocalElements }] = useForums()
  return (
    <ModelSearchInput filterKey="forums" {...props} 
      searchAPI={session.api.forums.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const UserSearch = (props: Omit<GenericSearchProps<User>, 'filterKey'> & { filterKey?: string }) => {
  const session = useResolvedSession()
  const [, { addLocalElements }] = useUsers()
  return (
    <ModelSearchInput filterKey="users" {...props} 
      searchAPI={session.api.users.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const OrganizationSearch = (props: Omit<GenericSearchProps<Organization>, 'filterKey'> & { filterKey?: string }) => {
  const session = useSession()
  const [, { addLocalElements }] = useOrganizations()
  return (
    <ModelSearchInput filterKey="organizations" {...props} 
      searchAPI={session.api.organizations.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const EnduserOrUserSearch = (props: Omit<GenericSearchProps<Enduser | User>, 'filterKey'> & { filterKey?: string }) => {
  const session = useResolvedSession()
  const [, { addLocalElements: addLocalEndusers }] = useEndusers()
  const [, { addLocalElements: addLocalUsers }] = useUsers()

  const searchAPI: SearchAPIProps<Enduser | User>['searchAPI'] = async (args) => {
    const [endusers, users] = await Promise.all([
      session.api.endusers.getSome(args),
      session.api.users.getSome(args),
    ])

    if (endusers.length > 0) addLocalEndusers(endusers)
    if (users.length > 0)    addLocalUsers(users)

    return [...endusers, ...users]
  }

  return (
    <ModelSearchInput filterKey="endusers-or-users" {...props} 
      searchAPI={searchAPI}
    />
  )
}

export const MessageTemplateSnippetSearch = ({ dontFetch, ...props }: Omit<GenericSearchProps<MessageTemplateSnippet>, 'filterKey'> & { filterKey?: string }) => {
  const session = useSession()
  const [, { addLocalElements }] = useMessageTemplateSnippets({ dontFetch })
  return (
    <ModelSearchInput filterKey="message_template_snippets" {...props} 
      searchAPI={session.api.message_template_snippets.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const ContentSearch = ({ dontFetch, ...props }: Omit<GenericSearchProps<ManagedContentRecord>, 'filterKey'> & { filterKey?: string }) => {
  const session = useResolvedSession()
  const [, { addLocalElements }] = useManagedContentRecords({ dontFetch })
  return (
    <ModelSearchInput filterKey="managed_content_records" {...props} 
      searchAPI={session.api.managed_content_records.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const CalendarEventTemplatesSearch = (props: Omit<GenericSearchProps<CalendarEventTemplate>, 'filterKey'> & { filterKey?: string }) => {
  const session = useSession()
  const [, { addLocalElements }] = useCalendarEventTemplates()
  return (
    <ModelSearchInput  filterKey="calendar_event_templates" {...props}
      searchAPI={session.api.calendar_event_templates.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const AppointmentLocationSearch = (props: Omit<GenericSearchProps<AppointmentLocation>, 'filterKey'> & { filterKey?: string }) => {
  const session = useSession()
  const [, { addLocalElements }] = useAppointmentLocations()
  return (
    <ModelSearchInput filterKey="appointment_locations" {...props}
      searchAPI={session.api.appointment_locations.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const AppointmentBookingPagesSearch = (props: Omit<GenericSearchProps<AppointmentBookingPage>, 'filterKey'> & { filterKey?: string }) => {
  const session = useSession()
  const [, { addLocalElements }] = useAppointmentBookingPages()
  return (
    <ModelSearchInput filterKey="appointment_booking_pages" {...props}
      searchAPI={session.api.appointment_booking_pages.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const DatabaseSearch = (props: Omit<GenericSearchProps<Database>, 'filterKey'> & { filterKey?: string }) => {
  const session = useSession()
  const [, { addLocalElements }] = useDatabases()
  return (
    <ModelSearchInput filterKey="databases" {...props} 
      searchAPI={session.api.databases.getSome}
      onLoad={addLocalElements}
    />
  )
}
export const DatabaseRecordSearch = ({ databaseId, ...props }: Omit<GenericSearchProps<DatabaseRecord> & { databaseId: string }, 'filterKey'> & { filterKey?: string }) => {
  const session = useSession()
  const [, { addLocalElements }] = useDatabaseRecords()

  const searchAPI: SearchAPIProps<DatabaseRecord>['searchAPI'] = useCallback(query => (
    session.api.database_records.getSome({ filter: { databaseId }, ...query })
  ), [session, databaseId])

  return (
    <ModelSearchInput filterKey="database_records" {...props} 
      searchAPI={searchAPI}
      onLoad={addLocalElements}
    />
  )
}

const SEARCHBAR_MIN_WIDTH = '125px'
export interface UserAndEnduserSelectorProps {
  excludeEndusers?: boolean,
  excludeUsers?: boolean,
  onSelect?: (selected: { users: User[], endusers: Enduser[] }) => void,
  onGoBack?: () => void,
  title?: string,
  titleInput?: React.ReactNode,
  radio?: boolean,
  minHeight?: React.CSSProperties['maxHeight']
  maxHeight?: React.CSSProperties['maxHeight']
  showTitleInput?: boolean,
  searchBarPlacement?: "top" | "bottom", 
  hiddenIds?: string[]
  initialSelected?: string[]
  buttonText?: string,
  filter?: (e: Enduser | User) => boolean,
  limitToUsers?: User[],
  dontIncludeSelf: boolean,
  virtualizationHeight?: number,
  showEntityType?: boolean,
}
export const UserAndEnduserSelector: React.JSXElementConstructor<UserAndEnduserSelectorProps> = ({
  titleInput,
  excludeEndusers,
  excludeUsers,
  onGoBack, 
  onSelect,
  showTitleInput,
  hiddenIds,
  title="Select Members",
  minHeight,
  maxHeight='50vh',
  searchBarPlacement="top",
  initialSelected=[],
  buttonText="Create",
  filter,
  radio,
  limitToUsers,
  dontIncludeSelf,
  virtualizationHeight,
  showEntityType,
}) => {
  const session = useResolvedSession()
  const [endusersLoading, { loadMore: loadMoreEndusers, doneLoading: doneLoadingEndusers }] = useEndusers()
  const [usersLoading, { loadMore: loadMoreUsers, doneLoading: doneLoadingUsers }] = useUsers({
    dontFetch: !!limitToUsers
  })
  const [typesLoading] = useEnduserCustomTypes({ dontFetch: !showEntityType })
  const entityTypes = useMemo(() => (
    value_is_loaded(typesLoading) ? typesLoading.value : [] 
  ),[typesLoading])

  const doneLoading = useCallback(() => 
    (excludeUsers || doneLoadingUsers()) && (excludeEndusers || doneLoadingEndusers()), 
    [doneLoadingEndusers, excludeUsers, excludeEndusers, doneLoadingUsers]
  )

  const loadMore = useCallback(async () => {
    if (!excludeEndusers && !doneLoadingEndusers()) { loadMoreEndusers().catch(console.error) };
    if (!excludeUsers && !doneLoadingUsers()) { loadMoreUsers().catch(console.error) };
  }, [doneLoadingEndusers, doneLoadingUsers, loadMoreEndusers, loadMoreUsers])

  const [selected, setSelected] = useState<string[]>(initialSelected)

  const { applyFilters, ...filterProps } = useFilters<any>()

  const searchbarFullWidth = searchBarPlacement === "bottom"

  const searchbar = useMemo(() => (
    excludeUsers 
      ? <EnduserSearch {...filterProps} style={{ minWidth: SEARCHBAR_MIN_WIDTH }} fullWidth={searchbarFullWidth} />
  : excludeEndusers
      ? <UserSearch {...filterProps} style={{ minWidth: SEARCHBAR_MIN_WIDTH }} fullWidth={searchbarFullWidth} />
      : <EnduserOrUserSearch {...filterProps} style={{ minWidth: SEARCHBAR_MIN_WIDTH }} fullWidth={searchbarFullWidth} />
  ), [excludeUsers, excludeEndusers, filterProps, searchbarFullWidth])

  const handleSelect = useCallback((users: User[], endusers: Enduser[]) => {
    const usersSelected = users.filter(u => selected.includes(u.id))
    const endusersSelected = endusers.filter(e => selected.includes(e.id))
    
    if (!dontIncludeSelf) {
      if (session.type === 'enduser' && !endusersSelected.find(e => e.id === session.userInfo.id)) {
        endusersSelected.push(session.userInfo as any)
      } else if (session.type === 'user' && !usersSelected.find(e => e.id === session.userInfo.id)) {
        usersSelected.push(session.userInfo as any)
      }
    }
    
    onSelect?.({ users: usersSelected, endusers: endusersSelected })
  }, [onSelect, selected, dontIncludeSelf])

  const users = (
    limitToUsers 
      ? limitToUsers 
      : value_is_loaded(usersLoading)
        ? usersLoading.value 
        : []
  )
  
  return (
    <LoadingData data={{ endusers: endusersLoading }} render={({ endusers }) => {
      const itemsUnfiltered = [...excludeUsers ? [] : users, ... excludeEndusers ? [] : endusers].filter(i => !hiddenIds?.includes(i.id))
      const items = applyFilters(
        filter
          ? itemsUnfiltered.filter(filter)
          : itemsUnfiltered
      )
      return (
      <Flex flex={1} column justifyContent="center">
        <Flex alignItems="center" justifyContent={"space-between"} wrap="nowrap"
          style={{
            marginBottom: 10,
          }}
        >
          {onGoBack &&  
            <Button onClick={onGoBack}>
              Back
            </Button>
          }
          <Typography style={{ fontSize: 16, textAlign: 'center' }}>
            {title}
          </Typography>

          <LoadingButton submitText={buttonText} submittingText={buttonText} 
            disabled={selected.length === 0 && !initialSelected?.length}
            style={{ display: 'flex' }}
            onClick={() => handleSelect(users, endusers)}
          />
        </Flex>

        <ScrollingList items={items}
          virtualization={
            virtualizationHeight ? {
              virtualize: true,
              height: virtualizationHeight,
              rowHeight: 45,
              width: '100%',
              hideHorizontalScroll: true,
            } : undefined
          }
          emptyText={
            itemsUnfiltered.length === 0 
              ? "No contacts found" 
              : "No one found for search"
          }
          minHeight={minHeight} maxHeight={maxHeight}
          doneLoading={doneLoading}
          loadMore={loadMore}
          title={showTitleInput ? titleInput : undefined}
          titleStyle={searchBarPlacement !== "top" ?
            {
              width: '100%',
            }
            : { }
          }
          titleActionsComponent={
            searchBarPlacement === 'top' 
              ? <Flex flex={1} justifyContent="flex-end" style={{ marginLeft: 'auto' }}>{searchbar}</Flex> 
              : undefined
          }
          itemContainerStyle={{ padding: 4 }}
          Item={({ item: user }) => (
            <HoverPaper style={{ marginBottom: 4 }}>
            <Flex flex={1} alignItems="center" justifyContent="space-between" 
              onClick={() => 
                radio 
                  ? (
                    setSelected(ss => 
                      ss.includes(user.id) 
                        ? []
                        : [user.id]
                    ) 
                  )
                  : setSelected(ss => (
                      ss.includes(user.id) 
                        ? ss.filter(s => s !== user.id)
                        : [user.id, ...ss]
                  ))
              }
              style={{
                paddingLeft: 5, paddingRight: 5,
              }}
            >
              <Checkbox checked={selected.includes(user.id)} />

              <Flex flex={1} column alignItems="flex-end" justifyContent="center">
                <Typography style={{ 
                  fontWeight: selected.includes(user.id) ? 'bold' : undefined,
                }}>
                  {user_display_name(user)}
                </Typography>

                {showEntityType && (user as Enduser).customTypeId &&
                  <Typography style={{ 
                    fontWeight: selected.includes(user.id) ? 'bold' : undefined,
                    fontSize: 12.5,
                  }}>
                    {entityTypes.find(t => t.id === (user as Enduser).customTypeId)?.title}
                  </Typography> 
                }
              </Flex>
            </Flex>
            </HoverPaper>
          )} 
        />

        {searchBarPlacement === 'bottom' &&
          <Flex alignSelf="flex-end" style={{ marginTop: 4, width: '100%' }}>
            {searchbar}
          </Flex>
        }
      </Flex>
      )}
    } />
  )
}