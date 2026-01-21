import React from "react";
import { Indexable, ScoreFilter } from "@tellescope/types-utilities";
import { LoadFunction, LoadFunctionArguments } from "@tellescope/sdk";
import { SearchAPIProps } from "./hooks";
import { TextFieldProps } from "./mui";
import { AgentRecord, AllergyCode, AppointmentBookingPage, AppointmentLocation, AutomationTrigger, CalendarEventTemplate, CallHoldQueue, ChatRoom, Database, DatabaseRecord, DiagnosisCode, Enduser, EnduserOrder, FaxLog, File, Form, FormGroup, Forum, Journey, ManagedContentRecord, MessageTemplateSnippet, Organization, PrescriptionRoute, SuggestedContact, Template, Ticket, TicketQueue, User, UserNotification, Waitlist } from "@tellescope/types-client";
import { SxProps } from "@mui/material";
import { ListOfStringsWithQualifier } from "@tellescope/types-models";
export type FilterV2 = Record<string, any>;
export type FiltersV2 = Record<string, FilterV2>;
export type FilterV2Options = {
    showArchived: boolean;
};
export declare const enduser_condition_to_mongodb_filter: (condition: Record<string, any> | undefined, customFields: string[]) => Record<string, any> | undefined;
export declare const mongo_db_filter_to_enduser_condition: (filter?: FilterV2) => Record<string, any> | undefined;
export declare const list_of_strings_with_qualifier_to_mongodb_filter: (tags?: ListOfStringsWithQualifier) => {
    $all: string[];
    $in?: undefined;
} | {
    $in: string[];
    $all?: undefined;
};
export declare const mongo_db_filter_to_list_of_strings_with_qualifier: (filter?: FilterV2) => ListOfStringsWithQualifier;
export interface FilterComponentWithDefaultKeyV2 {
    filters: FiltersV2;
    setFilters: React.Dispatch<React.SetStateAction<FiltersV2>>;
    onKeyDown?: (e: {
        code: string;
    }) => void;
}
export interface FilterComponentV2 extends FilterComponentWithDefaultKeyV2 {
    filterKey: string;
}
export declare const apply_mongodb_style_filter: <T>(data: T[], filter: FilterV2, options: FilterV2Options) => T[];
export declare const remove_inactive_filters: (filters: Record<string, any>[]) => (Record<string, any> | null)[];
export declare const useFiltersV2: <T>(args?: {
    memoryId?: string | undefined;
    initialFilters?: FiltersV2 | undefined;
    reload?: boolean | undefined;
    onFilterChange?: ((fs: FiltersV2) => void) | undefined;
    showArchived?: boolean | undefined;
} | undefined) => {
    mdbFilter: {
        $and: (Record<string, any> | null)[];
    };
    filters: FiltersV2;
    setFilters: React.Dispatch<React.SetStateAction<FiltersV2>>;
    applyFilters: (data: T[]) => T[];
    activeFilterCount: number;
};
export declare const filter_setter_for_key: <T>(key: string, setFilters: React.Dispatch<React.SetStateAction<Filters<T>>>) => (f: ScoreFilter<T>) => void;
export declare const apply_filters: <T>(fs: Filters<T>, data: T[]) => T[];
export declare const useFilters: <T>(args?: {
    memoryId?: string | undefined;
    initialFilters?: Filters<T> | undefined;
    reload?: boolean | undefined;
    deserialize?: ((fs: Filters<T>) => Filters<T>) | undefined;
    onFilterChange?: ((fs: Filters<T>) => void) | undefined;
    showArchived?: boolean | undefined;
} | undefined) => {
    filters: Filters<T>;
    compoundApiFilter: LoadFunctionArguments<T> | null;
    setFilters: React.Dispatch<React.SetStateAction<Filters<T>>>;
    applyFilters: (data: T[]) => T[];
    activeFilterCount: number;
};
export declare const record_field_matches_query: (value: any, query: string) => boolean;
export declare const record_matches_for_query: <T>(records: T[], query: string) => T[];
export declare const filter_for_query: <T>(query: string, getAdditionalFields?: ((v: T) => Indexable | undefined) | undefined) => FilterWithData<T>;
export declare const performBulkAction: <T extends {
    id: string;
}, R>({ allSelected, applyFilters, selected, processBatch, onSuccess, fetchBatch, batchSize, dontAlert, }: BulkActionProps<T> & {
    batchSize?: number | undefined;
    fetchBatch: LoadFunction<T>;
    processBatch: (matches: T[]) => Promise<R & {
        error?: string | undefined;
        successCount?: number | undefined;
    }>;
    dontAlert?: boolean | undefined;
}) => Promise<Omit<R & {
    error?: string | undefined;
    successCount?: number | undefined;
}, "error" | "successCount">[]>;
export interface BulkActionProps<T> {
    allSelected?: boolean;
    selected?: string[];
    customTypeId?: string;
    applyFilters: (v: T[]) => T[];
    onSuccess?: (loaded: T[]) => void;
    onError?: (message: string) => void;
}
export type NumericFilter<T> = ((f: T) => number);
export type FilterWithData<T> = {
    filter: null | NumericFilter<T>;
    apiFilter: LoadFunctionArguments<T> | null;
    data?: Indexable;
};
export interface Filters<T> {
    [index: string]: FilterWithData<T>;
}
export interface FilterComponentWithDefaultKey<T> {
    filters: Filters<T>;
    setFilters: React.Dispatch<React.SetStateAction<Filters<T>>>;
    onKeyDown?: (e: {
        code: string;
    }) => void;
}
export interface FilterComponent<T> extends FilterComponentWithDefaultKey<T> {
    filterKey: string;
}
export interface GenericSearchProps<T> extends FilterComponent<T> {
    placeholder?: string;
    fullWidth?: boolean;
    label?: string;
    style?: React.CSSProperties;
    size?: TextFieldProps['size'];
    sx?: SxProps;
    attachSearchableFields?: (v: T) => Indexable | undefined;
    dontFetch?: boolean;
    autoFocus?: boolean;
    value?: string;
    onChange?: (s: string) => void;
    hideIcon?: boolean;
    variant?: TextFieldProps['variant'];
}
interface ModelSearchProps<T> extends GenericSearchProps<T>, SearchAPIProps<T> {
}
export declare const ModelSearchInput: <T>({ filterKey, setFilters, searchAPI, onLoad, attachSearchableFields, activeFilterCount, compoundApiFilter, value, onChange, ...props }: ModelSearchProps<T>) => JSX.Element;
export declare const EnduserSearch: (props: Omit<GenericSearchProps<import("@tellescope/types-models").Enduser & {
    id: string;
    createdAt: Date;
}>, "filterKey"> & {
    filterKey?: string | undefined;
    excludeCareTeamFromSearch?: boolean | undefined;
}) => JSX.Element | null;
export declare const CHAT_ROOM_SEARCH = "chat-room-search";
export declare const ChatRoomSearch: (props: Omit<GenericSearchProps<ChatRoom>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element | null;
export declare const TICKET_SEARCH_FILTER_KEY = "ticket-search";
export declare const TicketSearch: (props: Omit<GenericSearchProps<Ticket>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element | null;
export declare const ENDUSER_ORDERS_SEARCH_FILTER_KEY = "ticket-search";
export declare const EnduserOrdersSearch: (props: Omit<GenericSearchProps<EnduserOrder>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element | null;
export declare const PrescriptionRoutesSearch: (props: Omit<GenericSearchProps<PrescriptionRoute>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const FaxSearch: (props: Omit<GenericSearchProps<FaxLog>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const FileSearch: (props: Omit<GenericSearchProps<File>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const SuggestedContactSearch: (props: Omit<GenericSearchProps<SuggestedContact>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const WaitlistSearch: (props: Omit<GenericSearchProps<Waitlist>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const AgentRecordSearch: (props: Omit<GenericSearchProps<AgentRecord>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const AllergyCodeSearch: (props: Omit<GenericSearchProps<AllergyCode>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const DiagnosisCodeSearch: (props: Omit<GenericSearchProps<DiagnosisCode>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const CallHoldQueueSearch: (props: Omit<GenericSearchProps<CallHoldQueue>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const TicketQueueSearch: (props: Omit<GenericSearchProps<TicketQueue>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const NotificationSearch: (props: Omit<GenericSearchProps<UserNotification>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const FormSearch: (props: Omit<GenericSearchProps<Form>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const FormGroupSearch: (props: Omit<GenericSearchProps<FormGroup>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const AutomationTriggerSearch: (props: Omit<GenericSearchProps<AutomationTrigger>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const JourneySearch: (props: Omit<GenericSearchProps<Journey>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const TemplateSearch: (props: Omit<GenericSearchProps<Template>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const ForumSearch: (props: Omit<GenericSearchProps<Forum>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const UserSearch: (props: Omit<GenericSearchProps<User>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const OrganizationSearch: (props: Omit<GenericSearchProps<Organization>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const EnduserOrUserSearch: (props: Omit<GenericSearchProps<Enduser | User>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const MessageTemplateSnippetSearch: ({ dontFetch, ...props }: Omit<GenericSearchProps<MessageTemplateSnippet>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const ContentSearch: ({ dontFetch, ...props }: Omit<GenericSearchProps<ManagedContentRecord>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const CalendarEventTemplatesSearch: (props: Omit<GenericSearchProps<CalendarEventTemplate>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const AppointmentLocationSearch: (props: Omit<GenericSearchProps<AppointmentLocation>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const AppointmentBookingPagesSearch: (props: Omit<GenericSearchProps<AppointmentBookingPage>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const DatabaseSearch: (props: Omit<GenericSearchProps<Database>, 'filterKey'> & {
    filterKey?: string;
}) => JSX.Element;
export declare const DatabaseRecordSearch: ({ databaseId, ...props }: Omit<GenericSearchProps<import("@tellescope/types-models").DatabaseRecord & {
    id: string;
    createdAt: Date;
}> & {
    databaseId: string;
}, "filterKey"> & {
    filterKey?: string | undefined;
}) => JSX.Element;
export interface UserAndEnduserSelectorProps {
    excludeEndusers?: boolean;
    excludeUsers?: boolean;
    onSelect?: (selected: {
        users: User[];
        endusers: Enduser[];
    }) => void;
    onGoBack?: () => void;
    title?: string;
    titleInput?: React.ReactNode;
    radio?: boolean;
    minHeight?: React.CSSProperties['maxHeight'];
    maxHeight?: React.CSSProperties['maxHeight'];
    showTitleInput?: boolean;
    searchBarPlacement?: "top" | "bottom";
    hiddenIds?: string[];
    initialSelected?: string[];
    buttonText?: string;
    filter?: (e: Enduser | User) => boolean;
    limitToUsers?: User[];
    dontIncludeSelf: boolean;
    virtualizationHeight?: number;
    showEntityType?: boolean;
}
export declare const UserAndEnduserSelector: React.JSXElementConstructor<UserAndEnduserSelectorProps>;
export {};
//# sourceMappingURL=inputs_shared.d.ts.map