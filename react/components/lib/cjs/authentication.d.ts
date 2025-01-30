import React from "react";
import { Enduser, User } from "@tellescope/types-client";
import { SessionType, UserSession as UserSessionModel } from "@tellescope/types-models";
import { Session, SessionOptions, EnduserSession, EnduserSessionOptions, PublicAppointmentBookingInfo } from "@tellescope/sdk";
import { Styled } from "./mui";
export declare const useRunOnce: (action: Function) => void;
export { PublicAppointmentBookingInfo };
type UserSession = Session;
type UserSessionOptions = SessionOptions;
export interface WithAnySession {
    session: UserSession | EnduserSession;
}
interface SessionContext_T {
    session: UserSession;
    updateCount: number;
    logout: () => Promise<void>;
    refresh: (options?: {
        invalidatePreviousToken?: boolean;
    }) => Promise<void>;
    updateUserInfo: (updates: Parameters<Session['api']['users']['updateOne']>[1], options?: Parameters<Session['api']['users']['updateOne']>[2]) => Promise<User>;
    updateLocalSessionInfo: (u: Partial<User>, authToken?: string) => void;
}
export declare const SessionContext: React.Context<SessionContext_T>;
export declare const WithSession: (p: {
    children: React.ReactNode;
    sessionOptions?: UserSessionOptions;
}) => JSX.Element;
export declare const useSessionContext: () => SessionContext_T;
interface EnduserSessionContext_T {
    enduserSession: EnduserSession;
    logout: () => Promise<void>;
    refresh: (args?: {
        invalidatePreviousToken?: boolean;
    }) => Promise<void>;
    updateUserInfo: (updates: Parameters<EnduserSession['api']['endusers']['updateOne']>[1], options?: Parameters<EnduserSession['api']['endusers']['updateOne']>[2]) => Promise<void>;
    updateLocalSessionInfo: (u: Partial<Enduser>, authToken?: string) => void;
}
export declare const EnduserSessionContext: React.Context<EnduserSessionContext_T>;
export declare const WithEnduserSession: (p: {
    children: React.ReactNode;
    sessionOptions: EnduserSessionOptions;
}) => JSX.Element;
export declare const useEnduserSessionContext: () => EnduserSessionContext_T;
interface SessionHookOptions {
    throwIfMissingContext?: boolean;
}
export declare const useSession: (o?: SessionHookOptions) => Session;
export { EnduserSession };
export declare const useEnduserSession: (o?: SessionHookOptions) => EnduserSession;
interface AccountFill {
    fillEmail?: string;
    fillPassword?: string;
}
interface LoginData {
    email: string;
    password: string;
}
export declare const LoginForm: ({ onSubmit, style, fillEmail, fillPassword }: AccountFill & {
    onSubmit: (d: LoginData) => Promise<void>;
} & Styled) => JSX.Element;
interface LoginHandler<S extends {
    authToken: string;
}> {
    onLogin?: (sessionInfo: S) => void;
}
export declare const UserLogin: ({ onLogin, ...props }: AccountFill & LoginHandler<UserSessionModel & {
    authToken: string;
}> & Styled) => JSX.Element;
export declare const EnduserLogin: ({ onLogin, ...props }: AccountFill & Styled & LoginHandler<Enduser & {
    authToken: string;
}>) => JSX.Element;
export declare const Logout: ({ onLogout, children }: {
    children?: React.ReactNode;
    onLogout?: (() => void) | undefined;
}) => JSX.Element;
export declare const useResolvedSession: (type?: SessionType) => Session | EnduserSession;
//# sourceMappingURL=authentication.d.ts.map