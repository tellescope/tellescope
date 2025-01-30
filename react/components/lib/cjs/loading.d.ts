import React from "react";
import { APIError, LoadedData, LoadedDataSuccess, LoadingStatus } from "@tellescope/types-utilities";
export { LoadedData, LoadedDataSuccess, APIError, LoadingStatus };
interface LoadingElement<T> {
    data: LoadedData<T>;
    render: (data: T) => React.ReactElement;
    onError?: (error: APIError) => React.ReactElement;
}
export declare const renderDefaultError: (error: APIError) => JSX.Element;
export declare const LoadingLinear: <T>({ data, render, onError }: LoadingElement<T>) => JSX.Element;
export declare const value_is_loaded: <T>(data: LoadedData<T>) => data is {
    status: LoadingStatus.Loaded;
    value: T;
};
interface LoadingDataProps<T> {
    data: {
        [K in keyof T]: LoadedData<T[K]>;
    };
    render: (data: T) => React.ReactElement;
    onError?: (error: APIError) => React.ReactElement;
}
export declare const LoadingData: <T>({ data, render, onError }: LoadingDataProps<T>) => JSX.Element;
export declare const Resolver: <T>(p: {
    item: T;
    initialValue?: React.ReactNode;
    resolver: (k: T) => React.ReactNode;
}) => JSX.Element;
//# sourceMappingURL=loading.d.ts.map