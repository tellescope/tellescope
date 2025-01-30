import React, { CSSProperties } from "react";
import { ViewStyle } from "react-native";
import { GestureResponderEvent } from "react-native";
import { PaperProps as MuiPaperProps } from "@mui/material/Paper";
import { AutoComplete } from "./forms";
import CancelIcon from '@mui/icons-material/Cancel';
import SortInactiveIcon from '@mui/icons-material/ArrowCircleDownOutlined';
import SortAscendingIcon from '@mui/icons-material/ExpandCircleDown';
import FilterIcon from '@mui/icons-material/FilterAltOutlined';
import FilterActiveIcon from '@mui/icons-material/FilterAlt';
declare const SortDescendingIcon: (props: any) => JSX.Element;
export { SortAscendingIcon, SortDescendingIcon, SortInactiveIcon, CancelIcon, FilterIcon, FilterActiveIcon };
import { SxProps } from "@mui/material";
import { PropsWithChildren } from "react";
import { Indexable } from "@tellescope/utilities";
export declare const Link: <T extends string>({ to, query, ...props }: React.PropsWithChildren<{
    to: T;
    query?: Indexable<any> | undefined;
}>) => JSX.Element;
export declare const DownloadIcon: (p: IconProps) => JSX.Element;
export declare const SendIcon: (p: IconProps) => JSX.Element;
export declare const NavigateBeforeIcon: (p: IconProps) => JSX.Element;
export declare const NavigateNextIcon: (p: IconProps) => JSX.Element;
export declare const VideoIcon: (p: IconProps) => JSX.Element;
export declare const VideoOffIcon: (p: IconProps) => JSX.Element;
export declare const MicrophoneIcon: (p: IconProps) => JSX.Element;
export declare const MicrophoneOffIcon: (p: IconProps) => JSX.Element;
export declare const CallEndIcon: (p: IconProps) => JSX.Element;
export declare const AccountIcon: (p: IconProps) => JSX.Element;
export type Styled = {
    style?: CSSProperties;
};
export type NativeStyled = {
    style?: CSSProperties | ViewStyle;
};
export type CanFlex = {
    flex?: boolean;
};
export type Parent = {
    children: React.ReactNode;
};
export type Elevation = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type Elevated = {
    elevation?: Elevation;
};
type MuiColor = 'inherit' | 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
export interface Clickable {
    onClick?: React.MouseEventHandler<HTMLElement> | ((e: GestureResponderEvent) => void);
    onPress?: React.MouseEventHandler<HTMLElement> | ((e: GestureResponderEvent) => void);
}
export interface ClickableWeb extends Clickable {
    onClick?: React.MouseEventHandler<HTMLElement>;
    onPress?: React.MouseEventHandler<HTMLElement>;
}
export interface ClickableNative extends Clickable {
    onClick?: ((e: GestureResponderEvent) => void);
    onPress?: ((e: GestureResponderEvent) => void);
}
export interface Changeable<T = string> {
    onChange?: (s: T) => void;
}
export interface BadgeProps extends Styled, Partial<Parent> {
    size?: number;
    color?: CSSProperties['color'];
}
export declare const Badge: ({ children, style, color, ...props }: BadgeProps) => JSX.Element;
export interface CardProps extends Styled, Parent, Elevated, CanFlex {
}
export declare const Card: ({ children, style, flex, ...props }: CardProps) => JSX.Element;
export interface PaperProps extends Styled, Parent, Elevated, CanFlex, ClickableWeb {
}
export declare const Paper: ({ children, style, flex, onClick, onPress, ...props }: PaperProps) => JSX.Element;
export declare const HoverPaper: ({ children, sx, disabled, baseElevation, hoveredElevation, ...props }: PaperProps & {
    baseElevation?: number | undefined;
    hoveredElevation?: number | undefined;
    disabled?: boolean | undefined;
    sx?: MuiPaperProps['sx'];
}) => JSX.Element;
export interface IconProps extends Styled {
    size?: number;
    color?: MuiColor | string;
}
export type IconButtonProps = {
    children: React.ReactNode;
    color?: MuiColor;
    disabled?: boolean;
    size?: 'small' | 'medium' | 'large';
    style?: any;
    id?: string;
} & Clickable;
export declare const IconButton: ({ ...props }: IconButtonProps & ClickableWeb) => JSX.Element;
export interface BottomNavigationProps<T extends {
    [index: string]: any;
}> {
    initialPageIndex?: number;
    routes: {
        key: keyof T & string;
        title: string;
        icon: string;
        Component: React.JSXElementConstructor<any>;
    }[];
}
export declare const BottomNavigation: <T extends {
    [index: string]: any;
}>(p: BottomNavigationProps<T>) => never;
export type TextFieldProps = {
    value: string;
    id?: string;
    label?: string;
    disabled?: boolean;
    placeholder?: string;
    error?: boolean;
    helperText?: string;
    size?: 'small';
    onFocus?: (e: any) => void;
    onBlur?: (e: any) => void;
    autoComplete?: AutoComplete;
    multiline?: boolean;
    maxRows?: number;
    autoFocus?: boolean;
    InputProps?: any;
    fullWidth?: boolean;
    name?: string;
    sx?: SxProps;
    variant?: 'filled' | 'outlined' | 'flat';
    type?: React.HTMLInputTypeAttribute;
    autoCapitalize?: 'none' | 'characters' | 'sentences' | 'words';
    autoCorrect?: boolean;
} & Changeable & Styled;
export declare const TextField: ({ autoCapitalize, autoCorrect, variant, onChange, ...props }: TextFieldProps) => JSX.Element;
export declare const KeyboardAvoidingTextField: ({ autoCapitalize, autoCorrect, variant, onChange, ...props }: TextFieldProps) => JSX.Element;
export type ButtonProps = {
    color?: "primary" | "secondary";
    variant?: "text" | "contained" | "outlined";
    type?: 'button' | 'reset' | 'submit';
    fullWidth?: boolean;
    onClick?: () => void;
    onPress?: () => void;
    disabled?: boolean;
    children?: React.ReactNode;
    style?: any;
};
export declare const Button: ({ children, onClick, onPress, ...props }: ButtonProps) => JSX.Element;
export type TypographyProps = {
    color?: 'primary' | 'secondary' | 'warning' | 'error';
    children?: React.ReactNode;
    style?: any;
    component?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
    noWrap?: boolean;
    title?: string;
    selectable?: boolean;
} & Clickable;
export declare const Typography: ({ children, onClick, onPress, component, ...props }: TypographyProps & ClickableWeb) => JSX.Element;
export type CircularProgressProps = {
    color?: 'primary' | 'secondary' | 'warning' | 'error';
    style?: any;
    size?: number;
};
export declare const CircularProgress: ({ ...props }: CircularProgressProps) => JSX.Element;
export type LinearProgressProps = {
    color?: 'primary' | 'secondary' | 'warning' | 'error';
    style?: any;
    size?: number;
};
export declare const LinearProgress: ({ ...props }: LinearProgressProps) => JSX.Element;
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
export interface TooltipProps extends Styled {
    label: React.ReactChild;
    placement?: TooltipPlacement;
    arrow?: boolean;
    open?: boolean;
    children: React.ReactElement;
    enterDelay?: number;
    enterNextDelay?: number;
    tooltipSx?: SxProps;
}
export declare const Tooltip: ({ tooltipSx, label, placement, arrow, open, style, children, enterDelay, enterNextDelay, ...props }: TooltipProps) => JSX.Element;
export interface AvatarProps extends Styled {
    letters?: string;
    src?: string;
    size?: number;
    alt?: string;
}
export declare const Avatar: ({ size, letters, style, src, ...props }: AvatarProps) => JSX.Element;
export interface ModalProps extends Styled {
    children: React.ReactNode;
    open: boolean;
    setOpen: (b: boolean) => void;
    onClick?: () => void;
    ref?: any;
    zIndex?: number;
}
export declare const Modal: ({ children, onClick, open, setOpen, style, zIndex }: ModalProps) => JSX.Element;
export interface CheckboxProps extends Styled {
    checked?: boolean;
    disabled?: boolean;
    onChange?: (b: boolean) => void;
    label?: string;
}
export declare const Checkbox: ({ onChange, label, ...props }: CheckboxProps) => JSX.Element;
//# sourceMappingURL=mui.d.ts.map