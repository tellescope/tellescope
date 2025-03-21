import React, { HTMLInputTypeAttribute, CSSProperties } from "react";
import * as Yup from 'yup';
import { ButtonProps, Styled, TextField } from "./mui";
import { OnApiError } from "./errors";
export interface HasValidator {
    validator: Yup.AnySchema;
}
export interface HasValidators {
    [index: string]: HasValidator;
}
export type InputSchema<T extends HasValidators, V = any> = {
    [K in (keyof T) & string]: {
        validator: T[K]['validator'];
        initialValue?: Yup.InferType<T[K]['validator']>;
        id?: string;
        name?: string;
        label?: string;
        type?: string;
        values?: V[];
        style?: CSSProperties;
        required?: boolean;
    };
};
export declare const create_input_schema: <T extends InputSchema<any, any>>(o: T) => InputSchema<T, any>;
export declare const validation_for_input_schema: <T extends InputSchema<any, any>>(schema: T) => import("yup/lib/object").OptionalObjectSchema<{ [K in keyof T]: T[K]["validator"]; }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{ [K in keyof T]: T[K]["validator"]; }>>;
export declare const initial_values_for_input_schema: <T extends InputSchema<any, any>>(schema: T, dynamicallySet?: { [K in keyof T]?: Yup.Asserts<T[K]["validator"]> | undefined; }) => { [K_1 in keyof T]?: Yup.Asserts<T[K_1]["validator"]> | undefined; };
export declare const initial_values_for_formik: <T extends InputSchema<any, any>>(schema: T, dynamicallySet?: { [K in keyof T]?: Yup.Asserts<T[K]["validator"]> | undefined; }) => { [K_1 in keyof T]: string; };
export type AutoComplete = "name" | "honorific-prefix" | "given-name" | "additional-name" | "family-name" | "honorific-suffix" | "nickname" | "username" | "new-password" | "current-password" | "one-time-code" | "organization-title" | "organization" | "street-address" | "address-line1" | "address-line2" | "address-line3" | "address-level4" | "address-level3" | "address-level2" | "address-level1" | "country" | "country-name" | "postal-code" | "cc-name" | "cc-given-name" | "cc-additional-name" | "cc-family-name" | "cc-number" | "cc-exp" | "cc-exp-month" | "cc-exp-year" | "cc-csc" | "cc-type" | "transaction-currency" | "transaction-amount" | "language" | "bday" | "bday-day" | "bday-month" | "bday-year" | "sex" | "url" | "photo";
export declare const validators: {
    firstName: Yup.StringSchema<string | undefined, import("yup/lib/types").AnyObject, string | undefined>;
    lastName: Yup.StringSchema<string | undefined, import("yup/lib/types").AnyObject, string | undefined>;
    email: Yup.StringSchema<string | undefined, import("yup/lib/types").AnyObject, string | undefined>;
    password: Yup.StringSchema<string | undefined, import("yup/lib/types").AnyObject, string | undefined>;
};
interface MuiComponentProps<V> {
    id: string;
    name: string;
    label: string;
    value: V;
    onChange: (e: V) => void;
    onBlur: (e: any) => void;
    required: boolean;
    type?: HTMLInputTypeAttribute;
    style?: any;
}
interface MuiFormikComponentProps<V> extends MuiComponentProps<V> {
    error: boolean;
    helperText: React.ReactNode;
}
interface FormFieldInfo<T, ID extends keyof T, V = T[ID]> {
    id: ID & string;
    autoComplete?: AutoComplete;
    name?: string;
    label?: string;
    initialValue?: V;
}
interface FormField<T, ID extends keyof T, P = {}, V = T[ID], CMui = MuiComponentProps<V>, CFormik = MuiFormikComponentProps<V>> extends FormFieldInfo<T, ID, V> {
    validation: ReturnType<typeof Yup.string>;
    Component: (props: any) => React.ReactElement;
    componentProps?: Partial<CMui & P>;
}
export declare const emailInput: <T, ID extends keyof T>({ id, name, label, initialValue, required, autoComplete, ...props }: FormFieldInfo<T, ID, string> & Partial<MuiComponentProps<string>>) => FormField<T, ID, import("./mui").TextFieldProps, string, MuiComponentProps<string>, MuiFormikComponentProps<string>>;
export declare const passwordInput: <T, ID extends keyof T>({ id, name, label, initialValue, required, autoComplete, ...props }: FormFieldInfo<T, ID, string> & Partial<MuiComponentProps<string>>) => FormField<T, ID, import("./mui").TextFieldProps, string, MuiComponentProps<string>, MuiFormikComponentProps<string>>;
export interface SubmitButtonOptions {
    submitText?: string;
    submittingText?: string;
    variant?: ButtonProps['variant'];
}
interface FormikSubmitButtonProps extends SubmitButtonOptions, Styled {
    formik: {
        isValid: boolean;
        dirty: boolean;
        isSubmitting: boolean;
    };
    disabled?: boolean;
    enabled?: boolean;
    onClick?: () => void;
    disabledIfUnchanged?: boolean;
}
export declare const FormikSubmitButton: ({ formik, enabled, disabledIfUnchanged, disabled, onClick, submitText, submittingText, style, ...props }: FormikSubmitButtonProps) => JSX.Element;
interface LoadingButtonProps extends SubmitButtonOptions {
    disabled?: boolean;
    submitting?: boolean;
    throwOnError?: boolean;
    uniquenessError?: string;
    onError?: OnApiError;
    onClick?: ((...args: any[]) => void) | (() => Promise<any>);
    muiColor?: string;
}
export declare const LoadingButton: ({ muiColor, disabled, uniquenessError, throwOnError, variant, onError, submitting, onClick, submitText, submittingText, type, style }: LoadingButtonProps & Styled & {
    type?: "submit" | undefined;
}) => JSX.Element;
export declare const SubmitButton: ({ onClick, ...props }: LoadingButtonProps & Styled) => JSX.Element;
interface FormBuilder_T<T> extends SubmitButtonOptions, Styled {
    fields: {
        [K in keyof T]: FormField<T, K>;
    };
    onSubmit: (v: T) => Promise<void>;
    onSuccess?: () => void;
    onError?: (e: any) => void;
    disabledIfUnchanged?: boolean;
}
export declare const FormBuilder: <T>({ fields, onSubmit, onSuccess, onError, style, disabledIfUnchanged, ...options }: FormBuilder_T<T>) => JSX.Element;
export {};
//# sourceMappingURL=forms.d.ts.map