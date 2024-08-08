import React, { createContext, useContext, useEffect, useRef, useState } from "react";

import {
  Enduser, User,
} from "@tellescope/types-client"
import {
  SessionType,
  UserSession as UserSessionModel,
} from "@tellescope/types-models"
import {
  Session,
  SessionOptions,
  EnduserSession,
  EnduserSessionOptions,
  PublicAppointmentBookingInfo,
} from "@tellescope/sdk"

import {
  emailInput,
  passwordInput,
  FormBuilder,
} from "./forms"
import {
  Styled,
} from "./mui"

export const useRunOnce = (action: Function) => {
  const ref = useRef(false)

  useEffect(() => {
    if (ref.current) return
    ref.current = true

    action()
  }, [action])
}


// to avoid installing schema directly in patient portal, can move
export { PublicAppointmentBookingInfo }

type UserSession = Session
type UserSessionOptions = SessionOptions

export interface WithAnySession {
  session: UserSession | EnduserSession
}

interface SessionContext_T {
  session: UserSession,
  updateCount: number,
  logout: () => Promise<void>,
  refresh: (options?: { invalidatePreviousToken?: boolean }) => Promise<void>,
  // setSession: React.Dispatch<React.SetStateAction<Session>>
  updateUserInfo: (updates: Parameters<Session['api']['users']['updateOne']>[1], options?: Parameters<Session['api']['users']['updateOne']>[2]) => Promise<User>,
  updateLocalSessionInfo: (u: Partial<User>, authToken?: string) => void
}
export const SessionContext = createContext({} as SessionContext_T)
export const WithSession = (p : { children: React.ReactNode, sessionOptions?: UserSessionOptions }) => {
  const [session, setSession] = useState(() => new Session(p.sessionOptions))
  const [updateCount, setUpdateCount] = useState(0) // trigger refresh when keeping reference to session the same
  const lastRefreshRef = useRef(Date.now())

  const logout = () => {
    setSession(s => new Session(p.sessionOptions))
    return session.logout()
  }

  const updateLocalSessionInfo: SessionContext_T['updateLocalSessionInfo'] = (u, a) => {
    session.setUserInfo({ ...session.userInfo, ...u })
    session.setAuthToken(a || session.authToken)

    setSession(session)
    setUpdateCount(u => u+1)
  }

  const refresh = async (options?: { invalidatePreviousToken?: boolean }) => {
    if (!session.authToken) return // refresh will fail
    if (session.userInfo?.requiresMFA) return // refresh will fail

    // console.log('refreshing session')

    await session.refresh_session({ invalidatePreviousToken: options?.invalidatePreviousToken })
    .then(({ authToken, user }) => updateLocalSessionInfo(user, authToken))
    .catch(e => console.error('error refreshing', e))
  }

  useRunOnce(refresh) // refresh on load

  useEffect(() => {
    // poll to automatically refresh session every hour
    const i = setInterval(() => {
      if (!session.authToken) return
      if (lastRefreshRef.current > Date.now() - 10000) return // don't refresh if last refresh was under 10 seconds ago
      lastRefreshRef.current = Date.now()

      session.refresh_session()
      .then(({ authToken, user }) => updateLocalSessionInfo(user, authToken))
      .catch(console.error)
    }, 1000 * 60 * 60)

    return () => { clearInterval(i) }
  }, [session, updateLocalSessionInfo])


  const updateUserInfo: SessionContext_T['updateUserInfo'] = async (updates, options) => {
    const updated = await session.api.users.updateOne(session.userInfo.id, updates, options)
    await refresh()

    return updated
  }

  return (
    <SessionContext.Provider value={{ 
      session, //setSession,
      updateCount,
      refresh,
      logout,
      updateUserInfo,
      updateLocalSessionInfo,
    }}>
      {p.children}
    </SessionContext.Provider>
  )
}
export const useSessionContext = () => useContext(SessionContext)

interface EnduserSessionContext_T {
  enduserSession: EnduserSession,
  logout: () => Promise<void>,
  refresh: (args?: { invalidatePreviousToken?: boolean }) => Promise<void>,
  // setEnduserSession: React.Dispatch<React.SetStateAction<EnduserSession>>
  updateUserInfo: (updates: Parameters<EnduserSession['api']['endusers']['updateOne']>[1], options?: Parameters<EnduserSession['api']['endusers']['updateOne']>[2]) => Promise<void>,
  updateLocalSessionInfo: (u: Partial<Enduser>, authToken?: string) => void
}
export const EnduserSessionContext = createContext({} as EnduserSessionContext_T)
export const WithEnduserSession = (p : { children: React.ReactNode, sessionOptions: EnduserSessionOptions }) => {
  const [enduserSession, setEnduserSession] = useState(() => new EnduserSession(p.sessionOptions))

  const logout = () => {
    setEnduserSession(s => new EnduserSession(p.sessionOptions))
    return enduserSession.logout()
  }

  const updateLocalSessionInfo: EnduserSessionContext_T['updateLocalSessionInfo'] = (u, a) => {
    setEnduserSession(s => new EnduserSession({ 
      ...s,
      handleUnauthenticated: s.handleUnauthenticated,
      host: s.host, apiKey: s.apiKey, authToken: a ?? s.authToken, // preserve other important info
      businessId: u.businessId ?? s.businessId,
      enduser: { ...s.userInfo, ...u } 
    }))
  }

  const refresh = async (args?: { invalidatePreviousToken?: boolean }) => {
    const { authToken, enduser } = await enduserSession.refresh_session(args)
    updateLocalSessionInfo(enduser, authToken)
  }

  const updateUserInfo: EnduserSessionContext_T['updateUserInfo'] = async (updates, options) => {
    await enduserSession.api.endusers.updateOne(enduserSession.userInfo.id, updates, options)
    const { enduser, authToken } = await enduserSession.refresh_session()
    updateLocalSessionInfo(enduser, authToken)
  }

  return (
    <EnduserSessionContext.Provider value={{ 
      enduserSession, 
      refresh,
      logout,
      updateUserInfo,
      updateLocalSessionInfo,
    }}>
      {p.children}
    </EnduserSessionContext.Provider>
  )
}
export const useEnduserSessionContext = () => useContext(EnduserSessionContext)

interface SessionHookOptions {
  throwIfMissingContext?: boolean,
}
export const useSession = (o={} as SessionHookOptions) => {
  const { session } = useContext(SessionContext)
  if (!session && o.throwIfMissingContext !== false) { 
    throw new Error("useSession used outside of WithSession") 
  }

  return session ?? null
}
export { EnduserSession }
export const useEnduserSession = (o={} as SessionHookOptions): EnduserSession => {
  const { enduserSession } = useContext(EnduserSessionContext)
  if (!enduserSession && o.throwIfMissingContext !== false) { 
    throw new Error("useEnduserSession used outside of WithEnduserSession") 
  }

  return enduserSession ?? null
}

interface AccountFill {
  fillEmail?: string;
  fillPassword?: string,
}

interface LoginData {
  email: string;
  password: string,
}
export const LoginForm = ({ onSubmit, style, fillEmail, fillPassword } : AccountFill & { onSubmit: (d: LoginData) => Promise<void> } & Styled) => (
  <FormBuilder<{ email: string, password: string }>
    disabledIfUnchanged={false}
    style={style}
    fields={{
      email: emailInput({ id: 'email', initialValue: fillEmail }),
      password: passwordInput({ id: 'password', initialValue: fillPassword }),
    }}
    submitText="Login"
    submittingText="Logging in"
    onSubmit={onSubmit}
  />
)

interface LoginHandler <S extends { authToken: string }> {
  onLogin?: (sessionInfo: S) => void;
}

export const UserLogin = ({ onLogin, ...props }: AccountFill & LoginHandler<UserSessionModel & { authToken: string }> & Styled) => {
  const { session, updateLocalSessionInfo } = useContext(SessionContext)
  if (!(session && updateLocalSessionInfo)) throw new Error("UserLogin used outside of WithSession")

  return (
    <LoginForm {...props} onSubmit={async ({ email, password }) => {
      const { authToken, ...userInfo } = await session.authenticate(email, password)
      updateLocalSessionInfo?.(userInfo, authToken)
      onLogin?.({ authToken, ...userInfo as UserSessionModel })
    }}/>
  )
}

export const EnduserLogin = ({ onLogin, ...props }: AccountFill & Styled & LoginHandler<Enduser & { authToken: string }>) => {
  const { enduserSession, updateLocalSessionInfo } = useContext(EnduserSessionContext)
  if (!(enduserSession && updateLocalSessionInfo)) throw new Error("EnduserLogin used outside of WithEnduserSession")

  return (
    <LoginForm {...props} onSubmit={async ({ email, password }) => {
      const { authToken, enduser } = await enduserSession.authenticate(email, password)
      updateLocalSessionInfo?.(enduser, authToken)
      onLogin?.({ authToken, ...enduser })
    }}/>
  )
}

export const Logout = ({ onLogout, children } : { 
  children?: React.ReactNode, 
  onLogout?: () => void 
}) => {
  const { session, updateLocalSessionInfo, logout: logoutUser } = useContext(SessionContext) ?? {}
  const { enduserSession, updateLocalSessionInfo: updateLocalEnduserSessionInfo, logout: logoutEnduser } = useContext(EnduserSessionContext) ?? {}
  const loggedOut = useRef(false)

  useEffect(() => {
    if (loggedOut.current) return
    loggedOut.current = true

    const s = (session ?? enduserSession) as Session | EnduserSession
    if (!s) throw new Error("Missing SessionContext and EnduserSessionContext")
    
    s.logout()
    .finally(() => {
      if (session) { logoutUser().catch(console.error) }
      else { logoutEnduser().catch(console.error) }
      onLogout?.()
    })
  }, [session, enduserSession, updateLocalSessionInfo, updateLocalEnduserSessionInfo, loggedOut])

  return <>{children}</>
}

export const useResolvedSession = (type?: SessionType) => {
  const u_session = useSession({ throwIfMissingContext: type === 'user' })
  const e_session = useEnduserSession({ throwIfMissingContext: type === 'enduser' })

  if (u_session === null && e_session === null) {
    throw new Error("Could not resolve session for user or enduser. Ensure you are using the proper WithSession or WithEnduserSession provider.")
  }

  return (
      type === 'user' ? u_session 
    : type === 'enduser' ? e_session
    : (u_session ?? e_session)
  )
}
