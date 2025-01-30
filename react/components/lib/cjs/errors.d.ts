import React from "react";
export declare class ErrorBoundary extends React.Component<{
    errorMessage?: string;
}, {
    hasError: boolean;
}> {
    constructor(props: {});
    static getDerivedStateFromError(error: any): {
        hasError: boolean;
    };
    componentDidCatch(error: any, errorInfo: any): void;
    render(): React.ReactNode;
}
export declare const stringForError: (err: any) => string;
export declare const parseUniquenessError: (err: any, uniquenessMessage: string) => string;
export type ErrorOptions = {
    uniquenessError?: string;
    onError?: OnApiError;
};
export type OnApiError = (args: {
    message: string;
}) => void;
export declare const useHandleError: (props?: {
    onError?: OnApiError;
    throwOnError?: boolean;
} & ErrorOptions) => {
    handleAPIError: (handler: (...args: any[]) => Promise<any>) => Promise<void>;
    error: string;
    loading: boolean;
    errorDisplay: JSX.Element | null;
};
//# sourceMappingURL=errors.d.ts.map