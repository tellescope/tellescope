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

export const useAddGTMTag = (gtmTag?: string) => {
  useEffect(() => {
    if (!gtmTag) return

    try {
      const existingScript = document.querySelector(
        `script[src*="https://www.googletagmanager.com/gtm.js?id=${gtmTag}"]`
      )
      if (existingScript) return

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.text = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${gtmTag}');`
      document.head.appendChild(script);
    } catch(err) {
      console.warn(err)
    }
  }, [gtmTag])
}