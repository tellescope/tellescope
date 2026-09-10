/// <reference types="node" />
import React from "react";
import { FileBlob, FileDetails, ReactNativeFile } from "@tellescope/types-utilities";
import { File as FileClientType } from "@tellescope/types-client";
import { Styled } from "./mui";
import { SubmitButtonOptions } from "./forms";
import { TextFieldProps, LabeledIconButtonProps } from ".";
export { FileBlob, };
interface DropzoneContentProps extends Styled {
    isDragActive: boolean;
    file?: FileDetails;
    label?: string;
}
export declare const DefaultDropzoneContent: ({ isDragActive, label, file, style }: DropzoneContentProps & Styled) => JSX.Element;
export interface FileSelector extends Styled {
    file: FileBlob | undefined;
    onChange: (f: FileBlob | undefined) => void;
    accept?: string;
    label?: string;
    dropzoneStyle?: React.CSSProperties;
    DropzoneComponent?: React.JSXElementConstructor<DropzoneContentProps>;
}
export declare const FileDropzone: ({ accept, file, label, style, dropzoneStyle, onChange, DropzoneComponent }: FileSelector) => JSX.Element;
export declare const useFileDropzone: ({ DropzoneComponent, style }: {
    DropzoneComponent?: (({ isDragActive, label, file, style }: DropzoneContentProps & Styled) => JSX.Element) | undefined;
    style?: React.CSSProperties | undefined;
}) => {
    file: FileBlob | undefined;
    setFile: React.Dispatch<React.SetStateAction<FileBlob | undefined>>;
    dropzone: JSX.Element;
};
export type FileUploadHandler = (details: FileDetails & {
    externalId?: string;
}, file: Blob | Buffer | ReactNativeFile, options?: {}) => Promise<FileClientType>;
interface UseFileUploaderOptions {
    enduserId?: string;
    publicRead?: boolean;
    publicName?: string;
    source?: string;
    isCalledOut?: boolean;
    externalId?: string;
}
export declare const useFileUpload: (o?: UseFileUploaderOptions) => {
    handleUpload: FileUploadHandler;
    uploading: boolean;
};
export declare const UploadButton: ({ file, details, handleUpload, uploading }: {
    file: FileBlob | undefined;
    handleUpload: FileUploadHandler;
    uploading: boolean;
    details: FileDetails;
}) => JSX.Element;
export declare const useDisplayPictureUploadForSelf: (o?: UseFileUploaderOptions) => {
    handleUpload: FileUploadHandler;
    updating: boolean;
};
export declare const useUserDisplayPictureUpload: (_o?: UseFileUploaderOptions & {
    userId: string;
}) => {
    handleUpload: FileUploadHandler;
    updating: boolean;
};
export interface FileUploaderProps extends SubmitButtonOptions, UseFileUploaderOptions {
    onUpload?: (file: FileClientType) => void;
}
export declare const FileUploader: ({ submitText, submittingText, onUpload, style, enduserId, dropzoneStyle, variant, ...uploadOptions }: FileUploaderProps & Styled & {
    dropzoneStyle?: React.CSSProperties | undefined;
}) => JSX.Element;
interface ConfirmationScreenProps<T> {
    action: () => Promise<T>;
    onCancel: () => void;
    onSuccess?: (result: T) => void;
    title?: string;
    description?: React.ReactNode;
    typeToConfirm?: string;
    confirmText?: string;
    loadingText?: string;
    customConfirmationComponent?: React.ReactNode;
    disabled?: boolean;
}
export declare const ConfirmationScreen: <T>({ action, onCancel, onSuccess, typeToConfirm, title, description, confirmText, loadingText, customConfirmationComponent, disabled, style, }: ConfirmationScreenProps<T> & Styled) => JSX.Element;
interface DeleteWithConfirmationIconProps extends Omit<ConfirmationScreenProps<any>, 'onCancel' | 'confirmText' | 'loadingText'> {
    modelName: string;
    color?: LabeledIconButtonProps['color'];
    iconProps?: Omit<LabeledIconButtonProps, 'Icon' | 'label'>;
}
export declare const DeleteWithConfimrationIcon: ({ modelName, color, iconProps, onSuccess, ...props }: DeleteWithConfirmationIconProps & Styled) => JSX.Element;
export declare const SearchTextInput: ({ onChange, hideIcon, ...props }: {
    value: string;
    id?: string | undefined;
    label?: string | undefined;
    disabled?: boolean | undefined;
    placeholder?: string | undefined;
    error?: boolean | undefined;
    helperText?: string | undefined;
    size?: "small" | undefined;
    onFocus?: ((e: any) => void) | undefined;
    onBlur?: ((e: any) => void) | undefined;
    autoComplete?: import("./forms").AutoComplete | undefined;
    multiline?: boolean | undefined;
    maxRows?: number | undefined;
    autoFocus?: boolean | undefined;
    InputProps?: any;
    fullWidth?: boolean | undefined;
    name?: string | undefined;
    sx?: import("@mui/material").SxProps<{}> | undefined;
    variant?: "filled" | "outlined" | "flat" | undefined;
    type?: React.HTMLInputTypeAttribute | undefined;
    autoCapitalize?: "none" | "characters" | "sentences" | "words" | undefined;
    autoCorrect?: boolean | undefined;
} & import("./mui").Changeable<string> & Styled & {
    hideIcon?: boolean | undefined;
}) => JSX.Element;
export declare const ImageOrDropzone: ({ style, maxHeight, width, existing, onUpload, uploadInModal, dropzoneText }: {
    existing?: string | undefined;
    dropzoneText?: string | undefined;
    onUpload: (secureName: string) => void;
    maxHeight?: number | undefined;
    width?: number | undefined;
    uploadInModal?: boolean | undefined;
} & Styled) => JSX.Element;
//# sourceMappingURL=inputs.d.ts.map