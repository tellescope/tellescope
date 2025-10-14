/// <reference types="react" />
import { ChangeHandler, FormFieldNode } from "./types";
import { DatabaseRecord, Enduser, Form, FormField, FormResponse } from "@tellescope/types-client";
import { FileBlob } from "@tellescope/types-utilities";
import { CompoundFilter, FormCustomization, FormResponseValue, OrganizationTheme, PreviousFormFieldType } from "@tellescope/types-models";
export declare const useFlattenedTree: (root?: FormFieldNode) => (import("@tellescope/types-models").FormField & {
    id: string;
    createdAt: Date;
})[];
export declare const useNodeInTree: (root: FormFieldNode, nodeId: string) => FormFieldNode | undefined;
type BasicEdge = {
    source: string;
    target: string;
};
export declare const loopDetected: (edges: (BasicEdge & {
    id: string;
})[], startId: string, endId: string) => boolean;
export declare const default_label_for_compound_logic: (f: CompoundFilter<string>) => string;
export declare const COMPOUND_LOGIC_LABEL_SENTINEL = "___compound___";
export declare const useGraphForFormFields: (fields: FormField[]) => {
    nodes: (import("@tellescope/types-models").FormField & {
        id: string;
        createdAt: Date;
    })[];
    edges: {
        id: string;
        source: string;
        target: string;
        type: PreviousFormFieldType;
        label?: React.ReactNode;
    }[];
};
export declare const useTreeForFormFields: (_fields: FormField[]) => FormFieldNode;
export type NextFieldLogicOptions = {
    urlLogicValue?: string;
    dateOfBirth?: string;
    gender?: string;
    state?: string;
    form?: Form;
    activeResponses?: FormResponseValue[];
};
export declare const getNextField: (activeField: FormFieldNode, currentValue: Response, responses: FormResponseValue[], options?: NextFieldLogicOptions) => import("@tellescope/types-utilities").TreeNode<import("@tellescope/types-models").FormField & {
    id: string;
    createdAt: Date;
}> | undefined;
export declare const useListForFormFields: (fields: FormField[], responses: Response[], options?: {
    dateOfBirth?: string;
    urlLogicValue?: string;
    gender?: string;
    form?: Form;
}) => (import("@tellescope/types-models").FormField & {
    id: string;
    createdAt: Date;
})[];
export declare const useLoadTreeForFormFields: (formId: string) => FormFieldNode | undefined;
export declare const useFieldsForForm: (formId?: string) => import("@tellescope/types-utilities").LoadedData<(import("@tellescope/types-models").FormField & {
    id: string;
    createdAt: Date;
})[]>;
export type SubmitStatus = 'uploading-files' | 'submitting' | undefined;
interface UseTellescopeFormOptions {
    enduserId: string;
    accessCode: string;
    automationStepId?: string;
    form?: Form;
    fields: FormField[];
    existingResponses?: (FormResponseValue & {
        isPrepopulatedFromEnduserField?: boolean;
    })[];
    formResponseId?: string;
    isInternalNote?: boolean;
    formTitle?: string;
    customization?: FormCustomization;
    startingFieldId?: string;
    ga4measurementId?: string;
    submitRedirectURL?: string;
    rootResponseId?: string;
    parentResponseId?: string;
    carePlanId?: string;
    calendarEventId?: string;
    context?: string;
    urlLogicValue?: string;
    enduser?: Partial<Enduser>;
    isPublicForm?: boolean;
    dontAutoadvance?: boolean;
    groupId?: string;
    groupInstance?: string;
    groupPosition?: number;
}
export declare const WithOrganizationTheme: ({ businessId, organizationIds, children }: {
    children: React.ReactNode;
    businessId?: string | undefined;
    organizationIds?: string[] | undefined;
}) => JSX.Element;
export declare const useOrganizationTheme: () => OrganizationTheme;
export declare const isDateString: (_s?: string) => boolean;
export type Response = FormResponseValue & {
    touched: boolean;
    includeInSubmit: boolean;
    field: FormField;
};
export type FileResponse = {
    fieldId: string;
    fieldTitle: string;
    blobs?: FileBlob[];
};
export declare const useTellescopeForm: ({ dontAutoadvance, isPublicForm, form, urlLogicValue, customization, carePlanId, calendarEventId, context, ga4measurementId, rootResponseId, parentResponseId, accessCode, existingResponses, automationStepId, enduserId, formResponseId, fields, isInternalNote, formTitle, submitRedirectURL, enduser, groupId, groupInstance, groupPosition, startingFieldId }: UseTellescopeFormOptions) => {
    enduserId: string;
    formResponseId: string | undefined;
    activeField: FormFieldNode;
    currentValue: Response | undefined;
    currentFileValue: FileResponse | undefined;
    getResponsesWithQuestionGroupAnswers: (responsesToSubmit: Response[]) => Response[];
    fields: (import("@tellescope/types-models").FormField & {
        id: string;
        createdAt: Date;
    })[];
    responses: Response[];
    selectedFiles: FileResponse[];
    onFieldChange: ChangeHandler<any>;
    onAddFile: (blobs?: FileBlob | FileBlob[], fieldId?: any) => void;
    isNextDisabled: () => boolean;
    isPreviousDisabled: () => boolean;
    goToPreviousField: () => void;
    goToNextField: (answer: FormResponseValue['answer'] | undefined) => void;
    submit: (options?: {
        onPreRedirect?: (() => void) | undefined;
        onFileUploadsDone?: (() => void) | undefined;
        onSuccess?: ((r: FormResponse) => void) | undefined;
        includedFieldIds?: string[] | undefined;
        otherEnduserIds?: string[] | undefined;
        onBulkErrors?: ((errors: {
            enduserId: string;
            message: string;
        }[]) => void) | undefined;
    } | undefined) => Promise<void>;
    showSubmit: boolean;
    submitErrorMessage: string;
    submittingStatus: SubmitStatus;
    validateField: (field: FormField) => any;
    validateResponsesForFields: (_fields?: any) => any;
    validateCurrentField: () => any;
    existingResponses: (FormResponseValue & {
        isPrepopulatedFromEnduserField?: boolean | undefined;
    })[] | undefined;
    repeats: Record<string, string | number>;
    setRepeats: import("react").Dispatch<import("react").SetStateAction<Record<string, string | number>>>;
    currentPageIndex: number;
    getNumberOfRemainingPages: (field?: FormField, explored?: string[]) => number;
    setCustomerId: import("react").Dispatch<import("react").SetStateAction<string | undefined>>;
    customization: FormCustomization | undefined;
    handleDatabaseSelect: (databaseRecords: Pick<DatabaseRecord, "values" | "databaseId">[]) => void;
    logicOptions: NextFieldLogicOptions;
    uploadingFiles: {
        fieldId: string;
    }[];
    setUploadingFiles: import("react").Dispatch<import("react").SetStateAction<{
        fieldId: string;
    }[]>>;
    handleFileUpload: (blob: FileBlob, fieldId: string) => Promise<void>;
    isAutoAdvancing: boolean;
};
export {};
//# sourceMappingURL=hooks.d.ts.map