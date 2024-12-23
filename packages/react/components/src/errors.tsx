import React, { useCallback, useState } from "react"
import { Typography } from '.'
import { APIError } from '@tellescope/types-utilities'
import { UNIQUENESS_VIOLATION } from '@tellescope/constants'

export class ErrorBoundary extends React.Component<{ errorMessage?: string }, { hasError: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    console.error(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>{this.props.errorMessage ?? "Something went wrong."}</h1>;
    }

    return this.props.children; 
  }
}

export const stringForError = (err: any) => {
  const toReturn = (err as APIError)?.message ?? err?.toString() ?? 'An unexpected error occurred'

  // if ?.message isn't a string (by mistake), handle gracefully
  if (typeof toReturn === 'object') { return JSON.stringify(toReturn, null, 2)}

  return toReturn
}

export const parseUniquenessError = (err: any, uniquenessMessage: string) => {
  const message = stringForError(err)
  if (message === UNIQUENESS_VIOLATION) return uniquenessMessage
  return message
}

export type ErrorOptions = { uniquenessError?: string, onError?: OnApiError }
export type OnApiError = (args: { message: string }) => void
export const useHandleError = (props?: { onError?: OnApiError, throwOnError?: boolean } & ErrorOptions) => {
  const { uniquenessError } = props ?? {}
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAPIError = useCallback(async (handler: (...args: any[]) => Promise<any>) => {
    try {
      setError('')
      setLoading(true)
      await handler()
    } catch(err: any) {
      const errorMessage = stringForError(err)
      setError(
        errorMessage === UNIQUENESS_VIOLATION && uniquenessError
          ? uniquenessError 
          : errorMessage
      )

      props?.onError?.({ message: errorMessage })
      if (props?.throwOnError) throw err
    } finally {
      setLoading(false)
    }
  }, [uniquenessError])

  const errorDisplay = (
    error 
      ? <Typography style={{ marginTop: 3 }} color="error">{error}</Typography>
      : null
  )

  return {
    handleAPIError,
    error,
    loading,
    errorDisplay
  }
}