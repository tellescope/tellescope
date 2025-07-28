import axios from "axios"
import NodeFormData from "form-data"

import { 
  ReactNativeFile,
  S3PresignedPost,
} from "@tellescope/types-utilities"
import { 
  ClientModelForName, User,
} from "@tellescope/types-client"
import { Indexable } from "@tellescope/utilities"

export const DEFAULT_HOST = 'https://api.tellescope.com'

export interface SessionOptions {
  apiKey?: string;
  authToken?: string;
  servicesSecret?: string,
  user?: User & { 
    requiresMFA?: boolean,
  },
  businessId?: string,
  organizationIds?: string[],
  host?: string;
  cacheKey?: string;
  expirationInSeconds?: number,
  enableSocketLogging?: boolean,
  handleUnauthenticated?: () => Promise<any>;
  autoRefreshInMS?: number,
}

export const wait = (f?: Promise<void>, ms=1000) => new Promise<void>((resolve, reject) => {
  setTimeout(() => f ? f.then(resolve).catch(reject) : resolve(), ms)
})

interface RequestOptions {
  refresh_session?: () => Promise<any>,
}

const generateBearer = (authToken: string) => `Bearer ${authToken}`
const generateAPIKeyHeader = (authToken: string) => `API_KEY ${authToken}`

const parseError = (err: any) => {
  if (err.response?.status === 413) return "Please try again with less data or a smaller file."
  if (err.response?.status === 500) return "Something went wrong on our end, and our team has been notified. Please try again later."
  if (err.response && err.response.data) return err.response.data

  // worker uses string match to detect API down and allow retry, do not change
  if (err.request)  return "No response - please check your Internet connection and try again" 

  if (err.message)  return err.message
  return err
}

const DEFAULT_AUTHTOKEN_KEY = 'tellescope_authToken'
const has_local_storage = () => {
  try {
    return (typeof window !== 'undefined' && !!window.localStorage)
  } catch(err) { // no access due to incognito browser, etc.
    console.log('error caught in has_local_storage', err)
    return false
  }
}
const set_cache = (key: string, authToken: string) => {
  if (!has_local_storage()) return 
  try {
    window.localStorage[key] = authToken // browser settings may still deny access, need to catch the error
  } catch(err) {}
}
const access_cache = (key=DEFAULT_AUTHTOKEN_KEY) => {
  if (!has_local_storage()) return
  try {
    return window.localStorage[key] // browser settings may still deny access, need to catch the error
  } catch(err) {
    return ''
  }
}

export const SOCKET_POLLING_DELAY = 250

/**
 * Custom paramsSerializer that mimics axios 0.21.4 default behavior
 * Based on the buildURL.js implementation from axios v0.21.4
 */
// this behavior makes axios 0.30 consistent with 0.21.4 which we used for a
// upgrading to 0.30 was necessary to address a 'high' security vulnerability
type ParamValue = string | number | boolean | Date | null | undefined | object | ParamValue[];

interface ParamsObject {
  [key: string]: ParamValue;
}

type ParamsSerializer = (params: ParamsObject) => string;

// Custom paramsSerializer function that replicates axios 0.21.4 default behavior
function defaultParamsSerializer(params: ParamsObject): string {
  const parts: string[] = [];

  // Helper function to check if value is an array
  function isArray(val: unknown): val is unknown[] {
    return Array.isArray(val);
  }

  // Helper function to check if value is a date
  function isDate(val: unknown): val is Date {
    return Object.prototype.toString.call(val) === '[object Date]';
  }

  // Helper function to check if value is an object
  function isObject(val: unknown): val is Record<string, unknown> {
    return val !== null && typeof val === 'object' && !isArray(val) && !isDate(val);
  }

  // Helper function to iterate over object properties
  function forEach<T>(
    obj: T | T[] | null | undefined, 
    fn: (value: T, key: string | number, obj: T | T[]) => void
  ): void {
    if (obj === null || typeof obj === "undefined") {
      return;
    }

    let processObj: T | T[];
    if (typeof obj !== "object") {
      processObj = [obj as T];
    } else {
      processObj = obj;
    }

    if (isArray(processObj)) {
      for (let i = 0, l = processObj.length; i < l; i++) {
        fn.call(null, processObj[i], i, processObj);
      }
    } else {
      for (const key in processObj as Record<string, T>) {
        if (Object.prototype.hasOwnProperty.call(processObj, key)) {
          fn.call(null, (processObj as Record<string, T>)[key], key, processObj);
        }
      }
    }
  }

  forEach(params, function serialize(val: ParamValue, key: string | number): void {
    if (val === null || typeof val === "undefined") {
      return;
    }

    let processKey = String(key);
    let processVal: ParamValue | ParamValue[];

    if (isArray(val)) {
      processKey = processKey + '[]';
      processVal = val;
    } else {
      processVal = [val];
    }

    forEach(processVal, function parseValue(v: ParamValue): void {
      let stringValue: string;
      
      if (isDate(v)) {
        stringValue = v.toISOString();
      } else if (isObject(v)) {
        stringValue = JSON.stringify(v);
      } else {
        stringValue = String(v);
      }
      
      parts.push(encodeURIComponent(processKey) + '=' + encodeURIComponent(stringValue));
    });
  });

  return parts.join('&');
}

export class Session {
  host: string;
  authToken: string;
  cacheKey: string;
  apiKey?: string;
  servicesSecret?: string;
  businessId?: string;
  organizationIds?: string[];
  userSessionInfo?: { id: string } & Indexable;
  type?: string
  enableSocketLogging?: boolean;
  handleUnauthenticated?: SessionOptions['handleUnauthenticated']
  expirationInSeconds?: number;
  socketAuthenticated: boolean;
  userInfo: { businessId?: string, id?: string, requiresMFA?: boolean, denySocket?: boolean } ;
  sessionStart = Date.now();
  AUTO_REFRESH_MS = 3600000 // 1hr elapsed
  lastSocketConnection: number;
  handlers: Record<string, Function>
  loadedSocketEvents: Record<string, any[]>

  config: { headers: { Authorization: string }};

  constructor(o={} as SessionOptions & RequestOptions & { type: string }) {
    if (o.servicesSecret && !o.businessId) throw new Error("Services secret provided without businessId")

    if (o.enableSocketLogging) {
      console.log("socket log: Creating new Session")
    }

    this.lastSocketConnection = 0;

    this.handlers = {};
    this.loadedSocketEvents = {};

    this.host= o.host ?? DEFAULT_HOST
    this.apiKey = o.apiKey ?? '';
    this.servicesSecret = o.servicesSecret;
    this.businessId = o.businessId;
    this.organizationIds = o.organizationIds ?? o.user?.organizationIds;
    this.expirationInSeconds = o.expirationInSeconds
    this.socketAuthenticated = false
    this.handleUnauthenticated = o.handleUnauthenticated
    this.enableSocketLogging = o.enableSocketLogging
    this.type = o.type

    this.cacheKey = o.cacheKey || DEFAULT_AUTHTOKEN_KEY

    // keep ?? over || to allow '' argument to avoid access_cache
    this.authToken = o.authToken ?? access_cache(o.cacheKey) ?? '';

    this.userInfo = o?.user ?? JSON.parse(access_cache(o.cacheKey + 'userInfo') || '{}');
    if (this.authToken) { 
      set_cache(this.cacheKey, this.authToken)
      if ((this.businessId || this.userInfo.businessId)) {
        this.authenticate_socket()
      }
    }
    this.config = { 
      headers: {
        Authorization: (
          this.apiKey 
            ? generateAPIKeyHeader(this.apiKey)
            : generateBearer(this.authToken ?? '')
        )
    } } // initialize after authToken
  }
  
  resolve_field = async <T>(p: () => Promise<T>, field: keyof T) => (await p())[field]

  setAuthToken = (a: string) => { 
    this.authToken = a; 
    this.config.headers.Authorization = generateBearer(a);
    set_cache(this.cacheKey, a)
  }

  setUserInfo = (u: { businessId: string, organizationIds?: string[] }) => { 
    this.userInfo = u; 
    this.organizationIds = this.organizationIds ?? u.organizationIds
    set_cache(this.cacheKey + 'userInfo', JSON.stringify(u))
  }
  
  clearCache = () => {
    set_cache(this.cacheKey, '')
    set_cache(this.cacheKey + 'userInfo', '')
  }

  clearState = (keepSocket?: boolean) => {
    this.apiKey = ''
    this.authToken = ''
    this.userInfo = { }
    this.clearCache()
  }

  getAuthInfo = (requiresAuth?: boolean) => requiresAuth && (
    this.apiKey ? { } // included in headers
    : this.servicesSecret ? { 
        servicesSecret: this.servicesSecret,
        sessionInfo: { 
          ...this.userSessionInfo,
          businessId: this.businessId, 
          organization: this.businessId,
        }, 
      }
    : { }
  )
  
  errorHandler = async (_err: any) => {
    const err = parseError(_err)
    if (err === 'Unauthenticated') {
      const refreshed = await this.handleUnauthenticated?.()
      if (!refreshed) {
        this.clearState()
      }
    }

    return err
  }
  POST = async <A,R=void>(endpoint: string, args?: A, authenticated=true, o?: { withCredentials?: boolean }) => {
    try {
      return (await axios.post(
        this.host + endpoint, 
        { ...args, ...this.getAuthInfo(authenticated) }, 
        { ...this.config, ...o }
        )
        ).data as R
    } catch(err) { throw await this.errorHandler(err) }
  }

  GET = async <A,R=void>(endpoint: string, params?: A, authenticated=true, options?: { responseType?: 'arraybuffer' }) => {
    try {
      return (await axios.get(
        this.host + endpoint, 
        { 
          params: { ...params, ...this.getAuthInfo(authenticated)  }, 
          headers: this.config.headers,
          paramsSerializer: defaultParamsSerializer,
          ...options,
        })
      ).data as R
    } catch(err) { throw await this.errorHandler(err) }
  }

  PATCH = async <A,R=void>(endpoint: string, params?: A, authenticated=true) => {
    try {
      return (await axios.patch(
        this.host + endpoint, 
        { ...params, ...this.getAuthInfo(authenticated)  }, 
        this.config)
      ).data as R
    } catch(err) { throw await this.errorHandler(err) }
  }

  DELETE = async <A,R=void>(endpoint: string, args?: A, authenticated=true) => {
    try {
      return (await axios.delete(
        this.host + endpoint, 
        { data: { ...args, ...this.getAuthInfo(authenticated)  }, 
        headers: this.config.headers })
      ).data as R
    } catch(err) { throw await this.errorHandler(err) }
  }

  UPLOAD = async (presigned: S3PresignedPost, file: Blob | Buffer | ReactNativeFile) => {
    const formData = new NodeFormData();
    Object.keys(presigned.fields).forEach(key => {
      formData.append(key, presigned.fields[key as keyof S3PresignedPost['fields']]);
    });
    formData.append("file", file) // must be appended last

    const headers = formData.getHeaders ? { ...formData.getHeaders(), 'Content-Length' : (formData as any).maxDataSize  }
                  : { 'Content-Type': 'multipart/form-data' }

    await axios.post(presigned.url, formData,  { headers })
  }

  DOWNLOAD = async (downloadURL: string) => { 
    const content = await axios.get(downloadURL)
    return content.data
  }

  EMIT = async (route: string, args: object, authenticated=true, options={} as RequestOptions) => {
    // if (!this.socket) {
    //   if (this.enableSocketLogging) { 
    //     console.log('attempted emit with !this.socket')
    //   }

    //   this.authenticate_socket() // sets namespace correctly
    // }

    // this.socket?.emit(route, { ...args, ...authenticated ? { authToken: this.authToken } : {} } )
  }

  ON = <T={}>(s: string, callback: (a: T) => void) => {
    //this.socket?.on(s, callback)
  }

  /**
  * @deprecated Use handle_events, subscription is no longer necessary
  */
  subscribe = (rooms: { [index: string]: keyof ClientModelForName }, handlers?: { [index: string]: (a: any) => void } ) => {
    console.warn("subscribe is deprecated in favor of handle_events, as they are now functionally the same")
    if (handlers) { 
      this.handle_events(handlers) 
    }  
  }

  handle_events = ( handlers: { [index: string]: (a: any) => void } ) => {
    for (const handler in handlers) {
      // load any data that was pushed to this event while handler was off
      const loadedData = this.loadedSocketEvents[handler]
      if (Array.isArray(loadedData) && loadedData.length > 0) {
        this.loadedSocketEvents[handler] = []

        handlers[handler](loadedData)
      }

      // set handler on to load data directly for an event
      this.handlers[handler] = handlers[handler]
    }
  } 

  unsubscribe = (roomIds: string[]) => this.EMIT('leave-rooms', { roomIds })
  removeAllSocketListeners = () => {
    if (this.enableSocketLogging) { console.log('removeAllSocketListeners') }
    this.handlers = {}
  }

  removeListenersForEvent = (event: string) => {
    delete this.handlers[event]
  }

  socket_log = (message: string) => {
    console.log(`${this.type} ${this.userInfo.id} got socket message: ${message}`)
  }
  initialize_socket = () => {
    if (!(this.userInfo?.businessId || this.businessId)) {
      if (this.enableSocketLogging) {
        console.warn("Attempting to initialize_socket without businessId set")
      }
      return 
    }
    if (!this.authToken) return

    if (this.userInfo.denySocket) {
      console.warn("not attempting socket connection since denySocket: true")
      return
    }
  }

  socket_ping = (handler: (...args: any[]) => void) => {}

  authenticate_socket = () => { 
    // if (this.userInfo.requiresMFA) return
    // if (this.lastSocketConnection + 2500 > Date.now()) return
    // this.lastSocketConnection = Date.now()

    // if (this.enableSocketLogging) console.log('authenticating socket')

    // this.initialize_socket()
    // if (!this.socket) {
    //   console.warn("failed to initialize_socket")
    //   return
    // }

    // this.socket.removeAllListeners()

    // this.socket.on('ping', () => {
    //   if (this.enableSocketLogging) { this.socket_log("pong") }
    // })

    // // handle events which are sent when handlers may be off
    // this.socket?.onAny((e, v)=> {
    //   if (this.handlers[e] && v) {
    //     this.handlers[e](v)
    //   } else if (Array.isArray(v)) {
    //     if (!this.loadedSocketEvents[e]) {
    //       this.loadedSocketEvents[e] = []
    //     }
    //     this.loadedSocketEvents[e].push(...v)
    //   }
    // })

    // this.socket.on('connect', () => {
    //   if (this.enableSocketLogging) { this.socket_log(`connect, authenticated=${this.socketAuthenticated}`) }
    // })

    // this.socket.on('disconnect', () => { 
    //   this.socketAuthenticated = false 
    //   if (this.enableSocketLogging) { this.socket_log("disconnect") }
    // })
    // this.socket.on('authenticated', () => { 
    //   this.socketAuthenticated = true 
    //   // if (this.enableSocketLogging) { 
    //   this.socket_log("authenticated") 
    //   // }
    // })
    // this.socket.on('error', (error: any) => {
    //   console.warn('socket error: ', error)
    // })
    // this.socket.on('connect_error', (error: any) => {
    //   console.warn('connect_error: ', error)
    //   // setTimeout(() => {
    //   //   this.socket?.connect()
    //   // })
    // })
  }

  /** @deprecated */
  connectSocket = async () => {
    if (this.socketAuthenticated) return

    let loopCount = 0
    // await wait(undefined, SOCKET_POLLING_DELAY)
  
    this.authenticate_socket()
    while (!(this.socketAuthenticated) && ++loopCount < 10) {
      await wait(undefined, SOCKET_POLLING_DELAY)
    }
    
    if (loopCount === 10) {
      console.error(`Failed to authenticate ${this.type} ${this.userInfo.id} after 10 attempts`)
      return
    }
  
    if (this.enableSocketLogging) {
      console.log(`Authenticated ${this.type} ${this.userInfo.id} after ${loopCount} reconnection attempts`)
    }
  }
}