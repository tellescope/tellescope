import React from "react";
import { LoadedData } from "@tellescope/types-utilities";
export declare const useLoadedState: <T, D = {}>(fetch?: ((d: Partial<D>) => Promise<void | T>) | undefined, dependencies?: D | undefined) => [LoadedData<T>, React.SetStateAction<LoadedData<T>>];
export interface SearchAPIProps<T> {
    searchAPI?: (args: {
        search: {
            query: string;
        };
    }) => Promise<T[]>;
    onLoad?: (results: T[]) => void;
}
export declare const useSearchAPI: <T>({ query, onLoad, searchAPI }: {
    query: string;
} & SearchAPIProps<T>) => void;
//# sourceMappingURL=hooks.d.ts.map