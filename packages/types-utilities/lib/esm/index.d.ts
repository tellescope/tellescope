/// <reference types="node" />
export interface Indexable<T = any> {
    [index: string]: T;
}
export type Filter<T> = (v: T) => boolean;
export type ScoreFilter<T> = (v: T) => number;
export declare enum LoadingStatus {
    Unloaded = 0,
    Fetching = 1,
    Error = 2,
    Loaded = 3
}
export declare const UNLOADED: {
    status: LoadingStatus.Unloaded;
    value: undefined;
};
export type LoadedDataSuccess<T> = {
    status: LoadingStatus.Loaded;
    value: T;
};
export type LoadedData<T = any> = typeof UNLOADED | {
    status: LoadingStatus.Fetching;
    value: undefined;
} | {
    status: LoadingStatus.Error;
    value: APIError;
} | LoadedDataSuccess<T>;
export type ErrorType = "User" | "Internal";
export type ErrorCode = 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 429 | 500;
export declare const isErrorCode: (c: any) => c is ErrorCode;
export interface ErrorInfo {
    message: string;
    info: object;
}
export interface APIError extends ErrorInfo {
    code: ErrorCode;
}
export type APIErrorHandler = (e: APIError) => void;
export type SessionType = "user" | "enduser";
export type SortOption = "oldFirst" | "newFirst";
export type JSONType = null | number | boolean | string | object | undefined;
export interface CustomUpdateOptions {
    replaceObjectFields?: boolean;
    dontSendWebhook?: boolean;
}
export type CUD = 'create' | 'update' | 'delete';
export type CRUD = CUD | 'read';
export type HTTPMethod = 'post' | 'get' | 'patch' | 'delete' | 'all';
export type Operation = CRUD | 'createMany' | 'readMany';
export interface FileBlob extends Blob {
    name: string;
}
export declare const isFileBlob: (f: any) => f is FileBlob;
export interface FileDetails {
    name: string;
    size: number;
    type: string;
    enduserId?: string;
    source?: string;
}
export interface FileBuffer extends Buffer, FileDetails {
}
export interface ReactNativeFile {
    uri: string;
    name: string;
    type: string;
}
export interface S3PresignedPost {
    url: string;
    fields: {
        'Content-Type': string;
        key: string;
        bucket: string;
        'X-Amz-Algorithm': string;
        'X-Amz-Credential': string;
        'X-Amz-Date': string;
        Policy: string;
        'X-Amz-Signature': string;
    };
}
export type UserIdentity = {
    type: SessionType;
    id: string;
};
export type TreeNode<T> = {
    value: T;
    children: TreeNode<T>[];
};
export declare const assertUnreachable: (x: never) => never;
//# sourceMappingURL=index.d.ts.map