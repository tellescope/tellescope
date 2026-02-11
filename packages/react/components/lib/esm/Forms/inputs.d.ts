import React from "react";
import { SxProps, TextFieldProps } from "@mui/material";
import { FormInputProps } from "./types";
import { Enduser, FormResponseValue, Pharmacy } from "@tellescope/types-models";
import { FileBlob, Styled } from "..";
import { DatabaseRecord, FormField } from "@tellescope/types-client";
export declare const getBridgeEligibilityUserIds: () => string[];
export declare const setBridgeEligibilityUserIds: (userIds: string[]) => void;
export declare const LanguageSelect: ({ value, ...props }: {
    value: string;
    onChange: (s: string) => void;
}) => JSX.Element;
export declare const defaultInputProps: {
    sx: SxProps;
};
export declare const defaultButtonStyles: React.CSSProperties;
export declare const PdfViewer: ({ url, height }: {
    url: string;
    height?: number | undefined;
}) => JSX.Element;
export declare const RatingInput: ({ field, value, onChange }: FormInputProps<'rating'>) => JSX.Element;
export declare const RankingInput: ({ field, value, onChange, form }: FormInputProps<'ranking'>) => JSX.Element;
export declare const DateInput: ({ field, value, onChange, placement, ...props }: {
    field: FormField;
    placement?: "top" | "bottom" | "left" | "right" | undefined;
} & FormInputProps<"date"> & Styled) => JSX.Element;
export declare const TableInput: ({ field, value, onChange, form, ...props }: FormInputProps<'Input Table'>) => JSX.Element;
export declare const AutoFocusTextField: (props: (import("@mui/material").FilledTextFieldProps | import("@mui/material").OutlinedTextFieldProps | import("@mui/material").StandardTextFieldProps) & {
    inputProps?: {
        sx: SxProps;
    } | undefined;
}) => JSX.Element;
export declare const DateStringInput: ({ field, value, onChange, form, ...props }: FormInputProps<'string'>) => JSX.Element;
export declare const StringInput: ({ field, value, form, onChange, ...props }: FormInputProps<'string'>) => JSX.Element;
export declare const StringLongInput: ({ field, value, onChange, form, ...props }: FormInputProps<'string'>) => JSX.Element;
export declare const PhoneInput: ({ field, value, onChange, form, ...props }: FormInputProps<'phone'>) => JSX.Element;
export declare const EmailInput: ({ field, value, onChange, form, ...props }: FormInputProps<'email'>) => JSX.Element;
export declare const NumberInput: ({ field, value, onChange, form, ...props }: FormInputProps<'number'>) => JSX.Element;
export declare const InsuranceInput: ({ field, onDatabaseSelect, value, onChange, form, responses, enduser, inputProps, ...props }: FormInputProps<"Insurance"> & {
    inputProps?: {
        sx: SxProps;
    } | undefined;
}) => JSX.Element;
export declare const BridgeEligibilityInput: ({ field, value, onChange, responses, enduser, inputProps, enduserId, form, ...props }: FormInputProps<"Bridge Eligibility"> & {
    inputProps?: {
        sx: SxProps;
    } | undefined;
}) => JSX.Element;
export declare const PharmacySearchInput: ({ field, value: rawValue, onChange, responses, enduser, form, ...props }: Omit<FormInputProps<"string">, "value" | "onChange"> & {
    value: Pharmacy | undefined;
    onChange: (v: Pharmacy | undefined, fieldId: string) => void;
}) => JSX.Element;
export declare const TimeInput: ({ field, value, onChange, ...props }: FormInputProps<'string'>) => JSX.Element;
export declare const TimezoneInput: ({ value, field, onChange, ...props }: FormInputProps<'Timezone'>) => JSX.Element;
export declare const AddressInput: ({ field, form, value, onChange, ...props }: FormInputProps<'Address'>) => JSX.Element;
export declare const ESignatureTerms: () => JSX.Element;
export declare const SignatureInput: ({ value, field, autoFocus, enduser, onChange, form }: FormInputProps<'signature'>) => JSX.Element;
export declare function convertHEIC(file: FileBlob | string): Promise<string>;
export declare const FileInput: ({ value, onChange, field, existingFileName, uploadingFiles, handleFileUpload, setUploadingFiles, form }: FormInputProps<"file"> & {
    existingFileName?: string | undefined;
}) => JSX.Element;
export declare const safe_create_url: (file: any) => string | null;
export declare const FilesInput: ({ value, onChange, field, existingFileName, uploadingFiles, handleFileUpload, setUploadingFiles, form }: FormInputProps<"files"> & {
    existingFileName?: string | undefined;
}) => JSX.Element;
export declare const MultipleChoiceInput: ({ field, form, value: _value, onChange, responses, enduser }: FormInputProps<'multiple_choice'>) => JSX.Element;
export declare const StripeInput: ({ field, value, onChange, setCustomerId, enduserId, form, responses, enduser }: FormInputProps<"Stripe"> & {
    setCustomerId: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => JSX.Element;
export declare const Progress: ({ numerator, denominator, style }: {
    numerator: number;
    denominator: number;
} & Styled) => JSX.Element;
export declare const DropdownInput: ({ field, value, onChange }: FormInputProps<'Dropdown'>) => JSX.Element;
export interface AddToDatabaseProps {
    databaseId: string;
    onAdd: (record: DatabaseRecord) => void;
}
export declare const DatabaseSelectInput: ({ AddToDatabase, field, value: _value, onChange, onDatabaseSelect, responses, size, disabled, enduser, inputProps }: FormInputProps<"Database Select"> & {
    responses: FormResponseValue[];
    AddToDatabase?: React.JSXElementConstructor<AddToDatabaseProps> | undefined;
    inputProps?: {
        sx: SxProps;
    } | undefined;
}) => JSX.Element;
export declare const CanvasMedicationsInput: ({ field, value, onChange, form }: FormInputProps<'Medications'>) => JSX.Element;
export declare const MedicationsInput: ({ field, value, onChange, form, ...props }: FormInputProps<'Medications'>) => JSX.Element;
export declare const BelugaPatientPreferenceInput: ({ field, value: _value, onChange, form }: FormInputProps<'Beluga Patient Preference'>) => JSX.Element;
export declare const contact_is_valid: (e: Partial<Enduser>) => "Email is invalid" | "Phone is invalid" | "Date of birth should be MM-DD-YYYY" | undefined;
export declare const RelatedContactsInput: ({ field, value: _value, onChange, error: parentError, form, ...props }: FormInputProps<'Related Contacts'>) => JSX.Element;
export declare const AppointmentBookingInput: ({ formResponseId, field, value, onChange, form, responses, goToPreviousField, isPreviousDisabled, enduserId, ...props }: FormInputProps<'Appointment Booking'>) => JSX.Element;
export declare const HeightInput: ({ field, value, onChange, form, ...props }: FormInputProps<'Height'>) => JSX.Element;
export declare const include_current_url_parameters_if_templated: (url: string) => string;
export declare const RedirectInput: ({ enduserId, groupId, groupInsance, rootResponseId, formResponseId, field, submit, value, onChange, responses, enduser, ...props }: FormInputProps<'Redirect'>) => JSX.Element | null;
export declare const HiddenValueInput: ({ goToNextField, goToPreviousField, field, value, onChange, isSinglePage, groupFields }: FormInputProps<'email'>) => JSX.Element;
export declare const EmotiiInput: ({ goToNextField, goToPreviousField, field, value, onChange, form, formResponseId, ...props }: FormInputProps<'email'>) => JSX.Element;
export declare const AllergiesInput: ({ goToNextField, goToPreviousField, field, value, onChange, form, formResponseId, ...props }: FormInputProps<'Allergies'>) => JSX.Element;
export declare const ConditionsInput: ({ goToNextField, goToPreviousField, field, value, onChange, form, formResponseId, ...props }: FormInputProps<'Conditions'>) => JSX.Element;
export declare const RichTextInput: ({ field, value, onChange }: FormInputProps<'Rich Text'>) => JSX.Element;
export declare const ChargeebeeInput: ({ field, value, onChange, setCustomerId }: FormInputProps<"Chargebee"> & {
    setCustomerId: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => JSX.Element;
//# sourceMappingURL=inputs.d.ts.map