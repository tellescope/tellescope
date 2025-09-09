import { APIError } from "@tellescope/types-utilities";
export declare const log_header: (n?: string) => void;
export declare const asPromise: <T>(f: (...args: any[]) => T) => Promise<T>;
type async_test_options_T<T> = {
    shouldError?: false;
    expectedResult?: T;
    onResult?: (r: T) => boolean;
    benchmark?: number;
};
type async_test_options_error_T<E = APIError> = {
    shouldError: true;
    onError?: (e: E) => boolean;
    benchmark?: number;
};
export declare const async_test: <T, E = APIError>(name: string, run_test: () => Promise<T>, options: async_test_options_T<T> | async_test_options_error_T<E>) => Promise<number>;
export declare const assert: (assertion: boolean, message: string, title?: string) => void;
export declare const wait: (f?: Promise<void>, ms?: number) => Promise<void>;
export declare const handleAnyError: {
    shouldError: boolean;
    onError: () => boolean;
};
export declare const passOnAnyResult: {
    onResult: () => boolean;
};
export {};
//# sourceMappingURL=testing.d.ts.map