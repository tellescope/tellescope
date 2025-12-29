import { AutomationStep, Form, FormField, Journey, MessageTemplate } from "@tellescope/types-models";
export declare const ACCOUNT_EXPORT_DATA_TYPES: readonly [{
    readonly key: keyof import("@tellescope/types-models").ModelForName;
    readonly label: "Message Templates";
}, {
    readonly key: keyof import("@tellescope/types-models").ModelForName;
    readonly label: "Forms";
}, {
    readonly key: keyof import("@tellescope/types-models").ModelForName;
    readonly label: "Journeys";
}];
export type AccountExportDataTypeKey = typeof ACCOUNT_EXPORT_DATA_TYPES[number]['key'];
export interface AccountExportData {
    exportedAt: string;
    organizationId: string;
    organizationName: string;
    version: string;
    data: {
        templates?: MessageTemplate[];
        forms?: (Form & {
            fields: FormField[];
        })[];
        journeys?: (Journey & {
            steps: AutomationStep[];
        })[];
    };
}
export declare const build_account_export_filename: (orgName: string) => string;
export interface LoadFunction<T> {
    (options?: {
        lastId?: string;
        limit?: number;
    }): Promise<T[]>;
}
export interface AccountExportSession {
    templates: {
        getSome: LoadFunction<MessageTemplate>;
    };
    forms: {
        getSome: LoadFunction<Form>;
    };
    form_fields: {
        getSome: LoadFunction<FormField>;
    };
    journeys: {
        getSome: LoadFunction<Journey>;
    };
    automation_steps: {
        getSome: LoadFunction<AutomationStep>;
    };
}
export interface LoadAccountExportDataOptions {
    selectedTypes: AccountExportDataTypeKey[];
}
/**
 * Loads all account export data from the API, paginating as necessary.
 * Joins form_fields to forms and automation_steps to journeys.
 */
export declare const load_account_export_data: (session: AccountExportSession, options: LoadAccountExportDataOptions) => Promise<AccountExportData['data']>;
//# sourceMappingURL=account_export.d.ts.map