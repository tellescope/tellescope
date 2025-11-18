import { ReactNativeFile, S3PresignedPost } from "@tellescope/types-utilities";
import { ClientModelForName, User } from "@tellescope/types-client";
import { Indexable } from "@tellescope/utilities";
export declare const DEFAULT_HOST = "https://api.tellescope.com";
export interface SessionOptions {
    apiKey?: string;
    authToken?: string;
    servicesSecret?: string;
    user?: User & {
        requiresMFA?: boolean;
    };
    businessId?: string;
    organizationIds?: string[];
    host?: string;
    cacheKey?: string;
    expirationInSeconds?: number;
    enableSocketLogging?: boolean;
    handleUnauthenticated?: () => Promise<any>;
    autoRefreshInMS?: number;
}
export declare const wait: (f?: Promise<void>, ms?: number) => Promise<void>;
interface RequestOptions {
    refresh_session?: () => Promise<any>;
}
export declare const SOCKET_POLLING_DELAY = 250;
export declare class Session {
    host: string;
    authToken: string;
    cacheKey: string;
    apiKey?: string;
    servicesSecret?: string;
    businessId?: string;
    organizationIds?: string[];
    userSessionInfo?: {
        id: string;
    } & Indexable;
    type?: string;
    enableSocketLogging?: boolean;
    handleUnauthenticated?: SessionOptions['handleUnauthenticated'];
    expirationInSeconds?: number;
    socketAuthenticated: boolean;
    userInfo: {
        businessId?: string;
        id?: string;
        requiresMFA?: boolean;
        denySocket?: boolean;
    };
    sessionStart: number;
    AUTO_REFRESH_MS: number;
    lastSocketConnection: number;
    handlers: Record<string, Function>;
    loadedSocketEvents: Record<string, any[]>;
    config: {
        headers: {
            Authorization: string;
        };
    };
    constructor(o?: SessionOptions & RequestOptions & {
        type: string;
    });
    resolve_field: <T>(p: () => Promise<T>, field: keyof T) => Promise<Awaited<T>[keyof T]>;
    setAuthToken: (a: string) => void;
    setUserInfo: (u: {
        businessId: string;
        organizationIds?: string[];
    }) => void;
    clearCache: () => void;
    clearState: (keepSocket?: boolean) => void;
    getAuthInfo: (requiresAuth?: boolean) => false | {
        servicesSecret?: undefined;
        sessionInfo?: undefined;
    } | {
        servicesSecret: string;
        sessionInfo: {
            businessId: string | undefined;
            organization: string | undefined;
            id?: string | undefined;
        };
    } | undefined;
    errorHandler: (_err: any) => Promise<any>;
    POST: <A, R = void>(endpoint: string, args?: A | undefined, authenticated?: boolean, o?: {
        withCredentials?: boolean;
    }) => Promise<R>;
    GET: <A, R = void>(endpoint: string, params?: A | undefined, authenticated?: boolean, options?: {
        responseType?: 'arraybuffer';
    }) => Promise<R>;
    PATCH: <A, R = void>(endpoint: string, params?: A | undefined, authenticated?: boolean) => Promise<R>;
    DELETE: <A, R = void>(endpoint: string, args?: A | undefined, authenticated?: boolean) => Promise<R>;
    UPLOAD: (presigned: S3PresignedPost, file: Blob | Buffer | ReactNativeFile) => Promise<void>;
    DOWNLOAD: (downloadURL: string) => Promise<any>;
    EMIT: (route: string, args: object, authenticated?: boolean, options?: RequestOptions) => Promise<void>;
    ON: <T = {}>(s: string, callback: (a: T) => void) => void;
    /**
    * @deprecated Use handle_events, subscription is no longer necessary
    */
    subscribe: (rooms: {
        [index: string]: keyof import("@tellescope/types-models").ModelForName;
    }, handlers?: {
        [index: string]: (a: any) => void;
    } | undefined) => void;
    handle_events: (handlers: {
        [index: string]: (a: any) => void;
    }) => void;
    unsubscribe: (roomIds: string[]) => Promise<void>;
    removeAllSocketListeners: () => void;
    removeListenersForEvent: (event: string) => void;
    socket_log: (message: string) => void;
    initialize_socket: () => void;
    socket_ping: (handler: (...args: any[]) => void) => void;
    authenticate_socket: () => void;
    /** @deprecated */
    connectSocket: () => Promise<void>;
}
export {};
//# sourceMappingURL=session.d.ts.map