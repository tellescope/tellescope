import React from 'react';
import { ButtonProps, Styled, TooltipPlacement, DownloadIcon } from "./mui";
import { ModalProps } from './index';
export interface WithOffset {
    offsetX?: number;
    offsetY?: number;
}
export interface LabeledIconButtonProps extends WithOffset {
    Icon: React.ElementType;
    label: string;
    id?: string;
    ariaLabel?: string;
    disabled?: boolean;
    color?: "primary" | "secondary" | "inherit" | 'default' | 'white' | 'error';
    placement?: TooltipPlacement;
    onClick?: (e: any) => void;
    showArrow?: boolean;
    padding?: number;
    className?: string;
    open?: boolean | undefined;
    size?: number | undefined;
    enterDelay?: number;
    enterNextDelay?: number;
}
export declare const DEFAULT_ICON_BUTTON_SIZE = 25;
export declare const LabeledIconButton: ({ Icon, label, id, ariaLabel, disabled, color, placement, onClick, showArrow, padding, open, size, offsetX, offsetY, enterDelay, enterNextDelay, style, }: LabeledIconButtonProps & Styled) => JSX.Element;
export interface AsyncAction<T = any> {
    action: () => Promise<T>;
    staysMounted?: boolean;
    onSuccess?: (v: T) => void;
    onError?: (e: any) => void;
    onChange?: (processing: boolean) => void;
}
export declare const useAsyncAction: <T>({ action, staysMounted, onSuccess, onError, onChange }: AsyncAction<T>) => {
    performingAction: boolean;
    handlePerformAction: () => void;
};
export declare const AsyncIconButton: <T>({ Icon, ...props }: LabeledIconButtonProps & AsyncAction<T> & Styled) => JSX.Element;
interface AsyncButtonProps<T> extends AsyncAction<T> {
    text: string;
    loadingText?: string;
    variant?: ButtonProps['variant'];
}
export declare const AsyncButton: <T>({ text, loadingText, variant, ...props }: AsyncButtonProps<T>) => JSX.Element;
interface ClickToDownloadSecureFile {
    secureName: string;
    onDownload: (downloadURL: string) => void;
    onError?: (error: string) => void;
}
export declare const ClickToDownloadFileComponent: ({ secureName, onDownload, onError, children, }: ClickToDownloadSecureFile & {
    children: React.ReactNode;
}) => JSX.Element;
export declare const useDownloadSecureFile: (options: {
    preferInBrowser?: boolean;
}) => {
    downloadFile: (secureName: string) => Promise<string>;
};
interface DownloadButton {
    secureName?: string;
    publicURL?: string;
    onDownload: (downloadURL: string) => void;
    onError?: (error: string) => void;
    color?: "primary" | "white";
    Icon?: typeof DownloadIcon;
    label?: string;
    preferInBrowser?: boolean;
    offsetX?: number;
    offsetY?: number;
}
export declare const DownloadFileIconButton: ({ preferInBrowser, publicURL, secureName, label, Icon, onDownload, onError, ...props }: DownloadButton) => JSX.Element;
interface UseModalIconButtonProps extends LabeledIconButtonProps {
}
export declare const useModalIconButton: (props: UseModalIconButtonProps) => {
    Icon: React.ElementType;
    label: string;
    id?: string | undefined;
    ariaLabel?: string | undefined;
    disabled?: boolean | undefined;
    color?: "inherit" | "error" | "primary" | "secondary" | "white" | "default" | undefined;
    placement?: TooltipPlacement | undefined;
    onClick?: ((e: any) => void) | undefined;
    showArrow?: boolean | undefined;
    padding?: number | undefined;
    className?: string | undefined;
    open: boolean;
    size?: number | undefined;
    enterDelay?: number | undefined;
    enterNextDelay?: number | undefined;
    offsetX?: number | undefined;
    offsetY?: number | undefined;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export declare const defaultModalStyle: React.CSSProperties;
export declare const IconModal: ({ open, setOpen, children, disabled, onClick, style, ModalComponent, ...props }: {
    Icon: React.ElementType;
    label: string;
    id?: string | undefined;
    ariaLabel?: string | undefined;
    disabled?: boolean | undefined;
    color?: "inherit" | "error" | "primary" | "secondary" | "white" | "default" | undefined;
    placement?: TooltipPlacement | undefined;
    onClick?: ((e: any) => void) | undefined;
    showArrow?: boolean | undefined;
    padding?: number | undefined;
    className?: string | undefined;
    open: boolean;
    size?: number | undefined;
    enterDelay?: number | undefined;
    enterNextDelay?: number | undefined;
    offsetX?: number | undefined;
    offsetY?: number | undefined;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & Styled & {
    ModalComponent?: React.JSXElementConstructor<ModalProps> | undefined;
    children: React.ReactNode;
}) => JSX.Element;
export {};
//# sourceMappingURL=controls.d.ts.map