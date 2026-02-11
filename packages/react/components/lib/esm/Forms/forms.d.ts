import React from "react";
import { FileBlob, Styled } from "../index";
import { useTellescopeForm, Response, FileResponse, NextFieldLogicOptions } from "./hooks";
import { FormInputs } from "./types";
import { AddToDatabaseProps } from "./inputs";
import { FormResponse, FormField, Form, Enduser } from "@tellescope/types-client";
import { OrganizationTheme } from "@tellescope/types-models";
export declare const TellescopeFormContainer: ({ businessId, organizationIds, ...props }: {
    businessId?: string | undefined;
    organizationIds?: string[] | undefined;
    dontAddContext?: boolean | undefined;
    children: React.ReactNode;
    hideBg?: boolean | undefined;
    backgroundColor?: string | undefined;
    hideLogo?: boolean | undefined;
    logoHeight?: number | undefined;
    language?: string | undefined;
    onChangeLanguage?: ((l: string) => void) | undefined;
    paperMinHeight?: React.CSSProperties['minHeight'];
    maxWidth?: number | undefined;
} & Styled) => JSX.Element;
export interface TellescopeFormProps extends ReturnType<typeof useTellescopeForm> {
    form?: Form;
    isPreview?: boolean;
    onSuccess?: (r: FormResponse) => void;
    customInputs?: FormInputs;
    submitted?: boolean;
    thanksMessage?: string;
    htmlThanksMessage?: string;
    showSaveDraft?: boolean;
    formTitle?: string;
    repeats: Record<string, string | number>;
    backgroundColor?: string;
    rootResponseId?: string;
    parentResponseId?: string;
    downloadComponent?: React.ReactNode;
    enduser?: Partial<Enduser>;
    groupId?: string;
    groupInstance?: string;
    logoHeight?: number;
}
export declare const TellescopeForm: (props: TellescopeFormProps & Styled & {
    hideBg?: boolean;
    theme?: OrganizationTheme;
    inputStyle?: React.CSSProperties;
}) => JSX.Element;
export declare const QuestionForField: ({ form, value, field, file, responses, selectedFiles, onAddFile, onFieldChange, customInputs, fields, validateField, repeats, onRepeatsChange, setCustomerId, handleDatabaseSelect, enduser, goToPreviousField, isPreviousDisabled, enduserId, formResponseId, submit, groupId, groupInstance, goToNextField, spacing, isSinglePage, rootResponseId, isInQuestionGroup, logicOptions, uploadingFiles, setUploadingFiles, handleFileUpload, groupFields, AddToDatabase, }: {
    spacing?: number | undefined;
    form?: (import("@tellescope/types-models").Form & {
        id: string;
        createdAt: Date;
    }) | undefined;
    repeats: Record<string, string | number>;
    onRepeatsChange: (v: Record<string, string | number>) => void;
    value: Response;
    file: FileResponse;
    field: FormField;
    setCustomerId: React.Dispatch<React.SetStateAction<string | undefined>>;
    isSinglePage?: boolean | undefined;
    isInQuestionGroup?: boolean | undefined;
    questionGroupSize?: number | undefined;
    logicOptions?: NextFieldLogicOptions | undefined;
    handleFileUpload: (blob: FileBlob, fieldId: string) => Promise<any>;
    uploadingFiles: {
        fieldId: string;
    }[];
    setUploadingFiles: React.Dispatch<React.SetStateAction<{
        fieldId: string;
    }[]>>;
    groupFields?: (import("@tellescope/types-models").FormField & {
        id: string;
        createdAt: Date;
    })[] | undefined;
    AddToDatabase?: React.JSXElementConstructor<AddToDatabaseProps> | undefined;
} & Pick<TellescopeFormProps, "enduserId" | "fields" | "rootResponseId" | "groupId" | "groupInstance" | "responses" | "enduser" | "formResponseId" | "selectedFiles" | "submit" | "goToPreviousField" | "goToNextField" | "isPreviousDisabled" | "handleDatabaseSelect" | "onAddFile" | "onFieldChange" | "customInputs" | "validateField">) => JSX.Element | null;
export declare const TellescopeSingleQuestionFlow: typeof TellescopeForm;
export declare const DEFAULT_THANKS_MESSAGE = "Your response was successfully recorded";
export declare const ThanksMessage: ({ thanksMessage, htmlThanksMessage, showRestartAtEnd, downloadComponent, }: {
    thanksMessage?: string | undefined;
    htmlThanksMessage?: string | undefined;
    showRestartAtEnd?: boolean | undefined;
    downloadComponent?: React.ReactNode;
}) => JSX.Element;
export declare const SaveDraft: ({ selectedFiles, enduserId, responses, existingResponses, fields, onSuccess, formResponseId, includedFieldIds, formId, style, disabled, getResponsesWithQuestionGroupAnswers, isInternalNote, formTitle, rootResponseId, parentResponseId, }: Styled & Pick<TellescopeFormProps, "enduserId" | "fields" | "responses" | "onSuccess" | "existingResponses" | "selectedFiles" | "getResponsesWithQuestionGroupAnswers"> & {
    disabled?: boolean | undefined;
    formResponseId?: string | undefined;
    formId: string;
    includedFieldIds: string[];
    isInternalNote?: boolean | undefined;
    formTitle?: string | undefined;
    rootResponseId?: string | undefined;
    parentResponseId?: string | undefined;
}) => JSX.Element;
export declare const UpdateResponse: ({ selectedFiles, enduserId, responses, onSuccess, formResponseId, includedFieldIds, formId, style, disabled, getResponsesWithQuestionGroupAnswers, existingResponses, fields, }: Styled & Pick<TellescopeFormProps, "enduserId" | "fields" | "responses" | "onSuccess" | "existingResponses" | "selectedFiles" | "getResponsesWithQuestionGroupAnswers"> & {
    disabled?: boolean | undefined;
    formResponseId?: string | undefined;
    formId: string;
    includedFieldIds: string[];
}) => JSX.Element;
export declare const Description: ({ field, color, style }: {
    field: FormField;
    color?: string | undefined;
} & Styled) => JSX.Element | null;
export declare const TellescopeSinglePageForm: React.JSXElementConstructor<TellescopeFormProps & Styled & {
    updating?: boolean;
    isInternalNote?: boolean;
    submittedAt?: Date;
    updatedAt?: Date;
    otherEnduserIds?: string[];
    onBulkErrors?: (errors: {
        enduserId: string;
        message: string;
    }[]) => void;
    AddToDatabase?: React.JSXElementConstructor<AddToDatabaseProps>;
}>;
//# sourceMappingURL=forms.d.ts.map