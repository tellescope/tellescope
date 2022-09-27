import React, { useEffect, useCallback, useMemo, useState } from "react"
import { Filter, Indexable } from "@tellescope/types-utilities"
import { objects_equivalent, user_display_name } from "@tellescope/utilities"
import { LoadFunction, LoadFunctionArguments } from "@tellescope/sdk"
import { UNSEARCHABLE_FIELDS } from "@tellescope/constants"
import { SearchAPIProps, useSearchAPI } from "./hooks"
import { TextFieldProps } from "./mui"
import { Enduser, ManagedContentRecord, User } from "@tellescope/types-client"
import { Button, Checkbox, Flex, HoverPaper, LoadingButton, LoadingData, ScrollingList, SearchTextInput, TextField, Typography, useEndusers, useManagedContentRecords, useResolvedSession, useUsers } from "."

/* FILTER / SEARCH */
export const filter_setter_for_key = <T,>(key: string, setFilters: React.Dispatch<React.SetStateAction<Filters<T>>>) => (
  f: Filter<T>
) => setFilters(fs => ({ ...fs, [key]: { ...fs?.[key], filter: f } }))

export const apply_filters = <T,>(fs: Filters<T>, data: T[]) => (
  data.filter(d => {
    for (const f of Object.values(fs)) {
      if (!f?.filter) continue
      if (f.filter(d) === false) return false
    }
    return true
  })
)

export const useFilters = <T,>(args?: { onFilterChange: () => void }) => {
  const { onFilterChange } = args ?? {}
  const [filters, setFilters] = React.useState({} as Filters<T>)

  const prevFilterRef = React.useRef(filters)
  useEffect(() => {
    if (!onFilterChange) return
    if (objects_equivalent(prevFilterRef.current, filters)) return

    prevFilterRef.current = filters
    onFilterChange()
  }, [filters, onFilterChange])

  const applyFilters = useCallback((data: T[]) => apply_filters(filters, data), [filters])

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

export const record_matches_for_query = <T,>(records: T[], query: string) => {
  const matches = [] as T[]

  for (const record of records) {
    for (const field in record) {
      const value = record[field]
      if (typeof value !== 'string') continue
      if (UNSEARCHABLE_FIELDS.includes(field)) continue

      if (value.toUpperCase().includes(query.toUpperCase())) {
        matches.push(record)
        break; 
      }
    }
  }

  return matches
}

export const filter_for_query = <T,>(query: string): FilterWithData<T> => ({
  filter: (record: T) => {
    for (const field in record) {
      const value = record[field]
      if (typeof value !== 'string') continue
      if (UNSEARCHABLE_FIELDS.includes(field)) continue

      if (value.toUpperCase().includes(query.toUpperCase())) {
        return true
      }
    }

    return false
  },
  apiFilter: { search: { query } },
})

export const performBulkAction = async <T extends { id: string }, R> ({ 
  allSelected,
  apiFilter, 
  selected, 
  processBatch, 
  fetchBatch,
  batchSize=250, 
} : BulkActionProps<T> & {
  batchSize?: number,
  fetchBatch: LoadFunction<T>,
  processBatch: (matches: T[]) => Promise<R>,
}) => {
  if (!(selected || allSelected || apiFilter)) throw new Error("One of allSelected, apiFilter, or selected is required")
  if (batchSize <= 0) throw new Error("batchSize must be at least 1")
  const args: LoadFunctionArguments<T> = (
    allSelected 
      ? (apiFilter ?? {})
      : { ids: selected }
  )

  args.limit = batchSize
  const results = []
  while (true) {
    const matches = await fetchBatch(args)
    if (matches.length === 0) break

    results.push(await processBatch(matches))

    if (matches.length < batchSize) {
      break
    }

    args.lastId = matches[matches.length - 1].id
  }

  // clean up in case same object is reused for future queries
  delete args.lastId

  return results
}

export interface BulkActionProps <T>{
  allSelected?: boolean,
  selected?: string[],
  apiFilter?: LoadFunctionArguments<T> | null,
  onSuccess?: () => void,
  onError?: (message: string) => void,
}

export type FilterWithData<T> = {
  filter: null | ((f: T) => boolean),
  apiFilter: LoadFunctionArguments<T> | null,
  data?: Indexable,
}
export interface Filters<T> {
  [index: string]: FilterWithData<T>
}

export interface FilterComponentWithDefaultKey<T> {
  filters: Filters<T>,
  setFilters: React.Dispatch<React.SetStateAction<Filters<T>>>,
}
// can include a version with an optional key, but make sure to use it in all cases when it's possibly passed as a prop (don't just use a string literal as default)
export interface FilterComponent<T> extends FilterComponentWithDefaultKey<T> {
  filterKey: string,
}

interface GenericSearchProps <T> extends FilterComponent<T> {
  placeholder?: string,
  fullWidth?: boolean,
  label?: string,
  style?: React.CSSProperties,
  size?: TextFieldProps['size'],
}
interface ModelSearchProps<T> extends GenericSearchProps<T>, SearchAPIProps<T> {}
export const ModelSearchInput = <T,>({ 
  filterKey, setFilters, searchAPI, onLoad, 
  // @ts-ignore remove from props if provided by mistake
  activeFilterCount, 
  ...props 
} : ModelSearchProps<T>) => {
  const [query, setQuery] = useState('')

  useSearchAPI({ query, searchAPI, onLoad })

  useEffect(() => {
    setFilters(fs => (
      fs[filterKey]?.apiFilter?.search?.query === query
        ? fs
        : { ...fs, [filterKey]: filter_for_query(query) }
    )) 
  }, [query, filterKey, setFilters])

  return <SearchTextInput {...props} value={query} onChange={(s: string) => setQuery(s)} />
}


export const EnduserSearch = (props: Omit<GenericSearchProps<Enduser>, 'filterKey'>) => {
  const session = useResolvedSession()
  const [, { addLocalElements }] = useEndusers()
  return (
    <ModelSearchInput {...props} filterKey="endusers"
      searchAPI={session.api.endusers.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const UserSearch = (props: Omit<GenericSearchProps<User>, 'filterKey'>) => {
  const session = useResolvedSession()
  const [, { addLocalElements }] = useUsers()
  return (
    <ModelSearchInput {...props} filterKey="users"
      searchAPI={session.api.users.getSome}
      onLoad={addLocalElements}
    />
  )
}

export const EnduserOrUserSearch = (props: Omit<GenericSearchProps<Enduser | User>, 'filterKey'>) => {
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
    <ModelSearchInput {...props} filterKey="endusers-or-users"
      searchAPI={searchAPI}
    />
  )
}

export const ContentSearch = (props: Omit<GenericSearchProps<ManagedContentRecord>, 'filterKey'>) => {
  const session = useResolvedSession()
  const [, { addLocalElements }] = useManagedContentRecords()
  return (
    <ModelSearchInput {...props} filterKey="managed_content_records"
      searchAPI={session.api.managed_content_records.getSome}
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
}
export const UserAndEnduserSelector: React.JSXElementConstructor<UserAndEnduserSelectorProps> = ({
  titleInput,
  excludeEndusers,
  excludeUsers,
  onGoBack, 
  onSelect,
  showTitleInput,
  title="Select Members",
  minHeight,
  maxHeight='50vh',
  searchBarPlacement="top"
}) => {
  const [endusersLoading, { loadMore: loadMoreEndusers, doneLoading: doneLoadingEndusers }] = useEndusers()
  const [usersLoading, { loadMore: loadMoreUsers, doneLoading: doneLoadingUsers }] = useUsers()

  const doneLoading = useCallback(() => 
    (excludeUsers || doneLoadingUsers()) && (excludeEndusers || doneLoadingEndusers()), 
    [doneLoadingEndusers, excludeUsers, excludeEndusers, doneLoadingUsers]
  )

  const loadMore = useCallback(async () => {
    if (!excludeEndusers && !doneLoadingEndusers()) { loadMoreEndusers().catch(console.error) };
    if (!excludeUsers && !doneLoadingUsers()) { loadMoreUsers().catch(console.error) };
  }, [doneLoadingEndusers, doneLoadingUsers, loadMoreEndusers, loadMoreUsers])

  const [selected, setSelected] = useState<string[]>([])

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
    onSelect?.({ 
      users: users.filter(u => selected.includes(u.id)), 
      endusers: endusers.filter(e => selected.includes(e.id)),
    })
  }, [onSelect, selected])
  
  return (
    <LoadingData data={{ endusers: endusersLoading, users: usersLoading }} render={({ users, endusers }) => {
      const itemsUnfiltered = [...excludeUsers ? [] : users, ... excludeEndusers ? [] : endusers]
      const items = applyFilters(itemsUnfiltered)
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

          <LoadingButton submitText='Create' submittingText='Create' 
            disabled={selected.length === 0}
            style={{ display: 'flex' }}
            onClick={() => handleSelect(users, endusers)}
          />
        </Flex>

        <ScrollingList items={items} 
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
            : {}
          }
          titleActionsComponent={searchBarPlacement === 'top' ? searchbar : undefined}
          Item={({ item: user }) => (
            <HoverPaper style={{ marginBottom: 4 }}>
            <Flex flex={1} alignItems="center" justifyContent="space-between" 
              onClick={() => setSelected(ss => (
                ss.includes(user.id) 
                  ? ss.filter(s => s !== user.id)
                  : [user.id, ...ss]
              ))}
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