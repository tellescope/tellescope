import { AISummaryConfiguration, AISummaryDataSource, AISummaryDataSourceConfig, Enduser } from "@tellescope/types-models";
export declare const stripHtml: (s: string) => string;
export declare const fmt: (d: any) => string;
export declare const fmtFromMS: (ms: any) => string;
export declare const fmtResponses: (responses: any) => string;
export declare const fmtObservation: (o: any) => string;
export declare const DATA_SOURCE_LABELS: Record<AISummaryDataSource, string>;
export type DataSourceMapEntry = {
    collection: AISummaryDataSource;
    sortField: string;
    format: (record: any) => string;
    enduserMatchClause?: (enduserId: string) => object;
};
export declare const DATA_SOURCE_MAP: Record<AISummaryDataSource, DataSourceMapEntry>;
export declare const enduserProfileToText: (e: Enduser) => string;
export declare const FORBIDDEN_FILTER_OPERATORS: string[];
export declare const aiSummaryError: (code: number, message: string) => Error & {
    code: number;
};
export declare const sanitizeFilter: (filter: any) => any;
export type AISummarySourceSection = {
    type: AISummaryDataSource;
    label: string;
    lookbackMS?: number;
    limit: number;
    records: any[];
    formattedLines: string[];
};
export type AISummaryContext = {
    contextText: string;
    estimatedTokens: number;
    profileBlock: string;
    sources: AISummarySourceSection[];
};
export declare const buildAISummarySourceFilter: ({ ds, enduserId, mapEntry }: {
    ds: AISummaryDataSourceConfig;
    enduserId: string;
    mapEntry: DataSourceMapEntry;
}) => {
    mdbFilter: object;
    effectiveLimit: number;
};
export declare const assembleAISummaryContext: ({ profileBlock, sources }: {
    profileBlock: string;
    sources: AISummarySourceSection[];
}) => AISummaryContext;
export type LoadAISummaryRecordsArgs = {
    type: AISummaryDataSource;
    collection: AISummaryDataSource;
    mdbFilter: object;
    limit: number;
    sortField: string;
};
export declare const loadAISummaryContext: ({ enduserId, configuration, loadProfile, loadRecords, includeProfile, }: {
    enduserId: string;
    configuration: AISummaryConfiguration;
    loadProfile: (enduserId: string) => Promise<Enduser>;
    loadRecords: (args: LoadAISummaryRecordsArgs) => Promise<any[]>;
    includeProfile?: boolean | undefined;
}) => Promise<AISummaryContext>;
//# sourceMappingURL=ai_summary.d.ts.map