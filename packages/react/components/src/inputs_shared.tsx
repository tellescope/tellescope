import React, { useEffect, useCallback, useMemo, useState, useRef } from "react"
import { Indexable, ScoreFilter } from "@tellescope/types-utilities"
import { objects_equivalent, read_local_storage, safeJSONParse, to_human_readable_phone_number, update_local_storage, user_display_name } from "@tellescope/utilities"
import { LoadFunction, LoadFunctionArguments } from "@tellescope/sdk"
import { ALL_ACCESS, UNSEARCHABLE_FIELDS } from "@tellescope/constants"
import { SearchAPIProps, useSearchAPI } from "./hooks"
import { TextFieldProps } from "./mui"
import { AgentRecord, AllergyCode, AppointmentBookingPage, AppointmentLocation, AutomationTrigger, CalendarEventTemplate, CallHoldQueue, ChatRoom, Database, DatabaseRecord, DiagnosisCode, Enduser, EnduserOrder, FaxLog, File, Form, FormGroup, Forum, Journey, ManagedContentRecord, MessageTemplateSnippet, Organization, PrescriptionRoute, SuggestedContact, Template, Ticket, TicketQueue, User, UserNotification, Waitlist } from "@tellescope/types-client"
import { Button, Checkbox, Flex, HoverPaper, LoadingButton, LoadingData, LoadingLinear, ScrollingList, SearchTextInput, Typography, useAgentRecords, useAllergyCodes, useAppointmentBookingPages, useAppointmentLocations, useAutomationTriggers, useCalendarEventTemplates, useCallHoldQueues, useChatRooms, useDatabaseRecords, useDatabases, useDiagnosisCodes, useEnduserOrders, useEndusers, useFaxLogs, useFiles, useFormGroups, useForms, useForums, useJourneys, useManagedContentRecords, useMessageTemplateSnippets, useNotifications, useOrganization, useOrganizations, usePrescriptionRoutes, useResolvedSession, useSession, useSuggestedContacts, useTemplates, useTicketQueues, useTickets, useUsers, useWaitlists, value_is_loaded } from "."
import { SxProps } from "@mui/material"
import { AccessPermissions } from "@tellescope/types-models"

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
    // console.log(JSON.stringify(joined, null, 2))

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
      const onlyNumbers = query.replaceAll(/[^0-9]/g, '')
      if ( 
        onlyNumbers.length >= 3 &&
        value.toUpperCase().includes(onlyNumbers)
      ) {
        score +=1
        continue
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
  const cacheKey = `search-cache-${filterKey}`
  const [_query, _setQuery] = useState(read_local_storage(cacheKey) || '')

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
      searchAPI={session.api.endusers.getSome}
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
        const endusers = (r.enduserIds || []).map(r => findEnduser(r, { batch: true })!).filter(e => e)

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
}) => {
  const session = useResolvedSession()
  const [endusersLoading, { loadMore: loadMoreEndusers, doneLoading: doneLoadingEndusers }] = useEndusers()
  const [usersLoading, { loadMore: loadMoreUsers, doneLoading: doneLoadingUsers }] = useUsers({
    dontFetch: !!limitToUsers
  })

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

              <Typography style={{ 
                fontWeight: selected.includes(user.id) ? 'bold' : undefined,
              }}>
                {user_display_name(user)}
              </Typography>
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