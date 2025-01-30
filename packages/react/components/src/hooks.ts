import React, { useEffect, useRef, useState } from "react"
import {
  Indexable,
  LoadedData,
  LoadingStatus,
  UNLOADED,
} from "@tellescope/types-utilities"
import {
  objects_equivalent,
} from "@tellescope/utilities"

export const useLoadedState = <T, D={}>(fetch?: (d: Partial<D>) => Promise<T | void>, dependencies?: D) => {
  const fetchedRef = useRef(undefined as typeof dependencies | null)
  const [data, setData] = useState(UNLOADED as LoadedData<T>)

  useEffect(() => {
    if (!fetch) return
    if (dependencies && objects_equivalent(dependencies, fetchedRef.current ?? undefined)) return
    if (fetchedRef.current === null) return

    fetchedRef.current = dependencies ?? null

    fetch(dependencies ?? {})
    .then(value => setData(value ? { status: LoadingStatus.Loaded, value } : UNLOADED ))
    .catch(error => setData({ status: LoadingStatus.Error, value: error }))
  }, [fetch, ...Object.values(dependencies ?? []), fetchedRef])

  return [data, setData] as [LoadedData<T>, React.SetStateAction<LoadedData<T>>]
}

export interface SearchAPIProps <T> {
  searchAPI?: (args: { search: { query: string } }) => Promise<T[]>,
  onLoad?: (results: T[]) => void,
}
export const useSearchAPI = <T,>({ query, onLoad, searchAPI } : { query: string } & SearchAPIProps<T>) => {
  const searchedRef = useRef('')

  useEffect(() => {
    const trimmed = query?.trim()

    // don't search empty strings
    if (!trimmed) return
    if (!searchAPI) return
    if (searchedRef.current === trimmed) return

    // unbounce  
    const t = setTimeout(() => {
      searchedRef.current = trimmed // only update on successful trigger of search

      // console.log('searching')
      searchAPI({ search: { query: trimmed }})
      .then(results => {
        // console.log('got results', results)
        if (results.length === 0) { return }

        onLoad?.(results)
      })
      .catch(console.error)
    }, 150)

    return () => { clearTimeout(t) }
  }, [query, searchAPI, onLoad, searchedRef])
}