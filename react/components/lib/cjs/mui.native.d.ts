import * as React from 'react';
import { ViewStyle } from 'react-native';
import { AvatarProps, BadgeProps, BottomNavigationProps, ButtonProps, CardProps, CircularProgressProps, ClickableNative, LinearProgressProps, IconProps, IconButtonProps, PaperProps, TextFieldProps, TooltipProps, TypographyProps, CheckboxProps } from "./mui.js";
export declare const convert_CSS_to_RNStyles: (style?: React.CSSProperties | ViewStyle) => ViewStyle | undefined;
export declare const MuiNaviveIcon: ({ icon, style, size, ...props }: IconProps & {
    icon: string;
}) => JSX.Element;
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
export declare const Badge: ({ children, color, style, ...props }: BadgeProps) => JSX.Element;
export declare const Card: ({ style, flex, children, ...props }: CardProps) => JSX.Element;
export declare const Paper: ({ style, flex, children, elevation, onClick, onPress, ...props }: PaperProps & ClickableNative) => JSX.Element;
export declare const HoverPaper: ({ style, flex, children, elevation, onClick, onPress, ...props }: PaperProps & ClickableNative) => JSX.Element;
export declare const BottomNavigation: <T extends {
    [index: string]: any;
}>({ initialPageIndex, routes }: BottomNavigationProps<T>) => JSX.Element;
export declare const TextField: ({ autoComplete, autoCorrect, autoCapitalize, variant, onChange, type, error, helperText, style, size, ...props }: TextFieldProps) => JSX.Element;
export declare const KeyboardAvoidingTextField: (props: TextFieldProps) => JSX.Element;
export declare const Button: ({ type, variant, children, color, style, onClick, onPress, ...props }: ButtonProps) => JSX.Element;
export declare const IconButton: ({ children, color, style, onClick, onPress, disabled, ...props }: IconButtonProps & ClickableNative) => JSX.Element;
export declare const Typography: ({ children, onClick, onPress, color, style, ...props }: TypographyProps & ClickableNative) => JSX.Element;
export declare const CircularProgress: ({ style, ...props }: CircularProgressProps) => JSX.Element;
export declare const LinearProgress: ({ style, ...props }: LinearProgressProps) => JSX.Element;
export declare const Tooltip: ({ children, ...props }: TooltipProps) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
export declare const Avatar: ({ size, style, letters, src }: AvatarProps) => JSX.Element;
export declare const Checkbox: ({ checked, ...props }: CheckboxProps) => JSX.Element;
//# sourceMappingURL=mui.native.d.ts.map