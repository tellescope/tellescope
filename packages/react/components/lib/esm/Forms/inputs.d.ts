import React from "react";
import { SxProps, TextFieldProps } from "@mui/material";
import { FormInputProps } from "./types";
import { Enduser, FormResponseValue } from "@tellescope/types-models";
import { FileBlob, Styled } from "..";
import { FormField } from "@tellescope/types-client";
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
export declare const RankingInput: ({ field, value, onChange }: FormInputProps<'ranking'>) => JSX.Element;
export declare const DateInput: ({ field, value, onChange, placement, ...props }: {
    field: FormField;
    placement?: "top" | "right" | "bottom" | "left" | undefined;
} & FormInputProps<"date"> & Styled) => JSX.Element;
export declare const TableInput: ({ field, value, onChange, ...props }: FormInputProps<'Input Table'>) => JSX.Element;
export declare const AutoFocusTextField: (props: TextFieldProps) => JSX.Element;
export declare const DateStringInput: ({ field, value, onChange, ...props }: FormInputProps<'string'>) => JSX.Element;
export declare const StringInput: ({ field, value, form, onChange, ...props }: FormInputProps<'string'>) => JSX.Element;
export declare const StringLongInput: ({ field, value, onChange, form, ...props }: FormInputProps<'string'>) => JSX.Element;
export declare const PhoneInput: ({ field, value, onChange, form, ...props }: FormInputProps<'phone'>) => JSX.Element;
export declare const EmailInput: ({ field, value, onChange, form, ...props }: FormInputProps<'email'>) => JSX.Element;
export declare const NumberInput: ({ field, value, onChange, form, ...props }: FormInputProps<'number'>) => JSX.Element;
export declare const InsuranceInput: ({ field, value, onChange, form, responses, enduser, ...props }: FormInputProps<'Insurance'>) => JSX.Element;
export declare const TimeInput: ({ field, value, onChange, ...props }: FormInputProps<'string'>) => JSX.Element;
export declare const AddressInput: ({ field, form, value, onChange, ...props }: FormInputProps<'Address'>) => JSX.Element;
export declare const ESignatureTerms: () => JSX.Element;
export declare const SignatureInput: ({ value, field, autoFocus, enduser, onChange }: FormInputProps<'signature'>) => JSX.Element;
export declare function convertHEIC(file: FileBlob | string): Promise<string>;
export declare const FileInput: ({ value, onChange, field, existingFileName }: FormInputProps<"file"> & {
    existingFileName?: string | undefined;
}) => JSX.Element;
export declare const safe_create_url: (file: any) => string | null;
export declare const FilesInput: ({ value, onChange, field, existingFileName }: FormInputProps<"files"> & {
    existingFileName?: string | undefined;
}) => JSX.Element;
export declare const MultipleChoiceInput: ({ field, form, value: _value, onChange }: FormInputProps<'multiple_choice'>) => JSX.Element;
export declare const StripeInput: ({ field, value, onChange, setCustomerId }: FormInputProps<"Stripe"> & {
    setCustomerId: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => JSX.Element;
export declare const Progress: ({ numerator, denominator, style }: {
    numerator: number;
    denominator: number;
} & Styled) => JSX.Element;
export declare const DropdownInput: ({ field, value, onChange }: FormInputProps<'Dropdown'>) => JSX.Element;
export declare const DatabaseSelectInput: ({ field, value: _value, onChange, onDatabaseSelect, responses }: FormInputProps<"Database Select"> & {
    responses: FormResponseValue[];
}) => JSX.Element;
export declare const CanvasMedicationsInput: ({ field, value, onChange }: FormInputProps<'Medications'>) => JSX.Element;
export declare const MedicationsInput: ({ field, value, onChange, ...props }: FormInputProps<'Medications'>) => JSX.Element;
export declare const contact_is_valid: (e: Partial<Enduser>) => "Email is invalid" | "Phone is invalid" | "Date of birth should be MM-DD-YYYY" | undefined;
export declare const RelatedContactsInput: ({ field, value: _value, onChange, ...props }: FormInputProps<'Related Contacts'>) => JSX.Element;
export declare const AppointmentBookingInput: ({ formResponseId, field, value, onChange, form, responses, goToPreviousField, isPreviousDisabled, enduserId, ...props }: FormInputProps<'Appointment Booking'>) => JSX.Element;
export declare const HeightInput: ({ field, value, onChange, ...props }: FormInputProps<'Height'>) => JSX.Element;
export declare const RedirectInput: ({ enduserId, groupId, groupInsance, rootResponseId, formResponseId, field, submit, value, onChange, responses, enduser, ...props }: FormInputProps<'Redirect'>) => JSX.Element | null;
export declare const HiddenValueInput: ({ goToNextField, goToPreviousField, field, value, onChange, form, isSinglePage, }: FormInputProps<'email'>) => JSX.Element;
export declare const EmotiiInput: ({ goToNextField, goToPreviousField, field, value, onChange, form, formResponseId, ...props }: FormInputProps<'email'>) => JSX.Element;
export declare const AllergiesInput: ({ goToNextField, goToPreviousField, field, value, onChange, form, formResponseId, ...props }: FormInputProps<'Allergies'>) => JSX.Element;
export declare const ConditionsInput: ({ goToNextField, goToPreviousField, field, value, onChange, form, formResponseId, ...props }: FormInputProps<'Conditions'>) => JSX.Element;
//# sourceMappingURL=inputs.d.ts.map