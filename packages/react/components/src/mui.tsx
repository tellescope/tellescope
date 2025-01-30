import React, { CSSProperties, useState } from "react"
import { ViewStyle } from "react-native"
import { GestureResponderEvent } from "react-native"

import MuiBadge from "@mui/material/Badge"
import MuiAvatar from "@mui/material/Avatar"
import MuiCard from "@mui/material/Card"
import MuiPaper from "@mui/material/Paper"
import { PaperProps as MuiPaperProps } from "@mui/material/Paper"
import MuiTextField from "@mui/material/TextField"
import MuiButton from "@mui/material/Button"
import MuiTypography from "@mui/material/Typography"
import MuiCircularProgress from "@mui/material/CircularProgress"
import MuiLinearProgress from "@mui/material/LinearProgress"
import MuiIconButton from "@mui/material/IconButton"
import MuiTooltip from "@mui/material/Tooltip"
import MuiModal from "@mui/material/Modal"
import MuiCheckbox from "@mui/material/Checkbox"

import { AutoComplete } from "./forms"
import { DEFAULT_ICON_SIZE  } from "./constants"

import SendIconMui from "@mui/icons-material/Send"
import DownloadIconMui from "@mui/icons-material/Download"
import NavigateBeforeIconMui from '@mui/icons-material/NavigateBefore';
import NavigateNextIconMui from '@mui/icons-material/NavigateNext';
import VideoIconMui from '@mui/icons-material/Videocam';
import VideoOffIconMui from '@mui/icons-material/VideocamOff';
import MicrophoneIconMui from '@mui/icons-material/Mic';
import MicrophoneOffIconMui from '@mui/icons-material/MicOff';
import CallEndIconMui from '@mui/icons-material/CallEnd';
import AccountIconMui from '@mui/icons-material/Person';
import { defaultModalStyle } from "./controls"

import CancelIcon from '@mui/icons-material/Cancel';
import SortInactiveIcon from '@mui/icons-material/ArrowCircleDownOutlined';
import SortAscendingIcon from '@mui/icons-material/ExpandCircleDown';
import FilterIcon from '@mui/icons-material/FilterAltOutlined';
import FilterActiveIcon from '@mui/icons-material/FilterAlt';

const SortDescendingIcon = (props: any) => (
  <SortAscendingIcon {...props} style={{ transform: 'rotate(180deg)', ...props?.style }} />
)
export { SortAscendingIcon, SortDescendingIcon, SortInactiveIcon, CancelIcon, FilterIcon, FilterActiveIcon }

import {
  Link as RouterLink, 
} from "react-router-dom"
import {
  FormControlLabel,
  Grid,
  Link as MuiLink,
  SxProps
} from "@mui/material"
import { PropsWithChildren } from "react"
import { Indexable, query_string_for_object } from "@tellescope/utilities"

export const Link = <T extends string>({ to, query, ...props }: PropsWithChildren<{ to: T, query?: Indexable }>) => {
  return <MuiLink to={`${to}/${query ? query_string_for_object(query) : ''}`} {...props} component={RouterLink} />
}

const Icon = ({ Component, size=DEFAULT_ICON_SIZE, style, ...props } : IconBuilderProps) => (
  <Component style={{ fontSize: size, ...style }}/>
)
export const DownloadIcon = (p : IconProps) => <Icon {...p} Component={DownloadIconMui}/>
export const SendIcon = (p : IconProps) => <Icon {...p} Component={SendIconMui}/>
export const NavigateBeforeIcon = (p : IconProps) => <Icon {...p} Component={NavigateBeforeIconMui}/>
export const NavigateNextIcon = (p : IconProps) => <Icon {...p} Component={NavigateNextIconMui}/>
export const VideoIcon = (p : IconProps) => <Icon {...p} Component={VideoIconMui}/>
export const VideoOffIcon = (p : IconProps) => <Icon {...p} Component={VideoOffIconMui}/>
export const MicrophoneIcon = (p : IconProps) => <Icon {...p} Component={MicrophoneIconMui}/>
export const MicrophoneOffIcon = (p : IconProps) => <Icon {...p} Component={MicrophoneOffIconMui}/>
export const CallEndIcon = (p : IconProps) => <Icon {...p} Component={CallEndIconMui}/>
export const AccountIcon = (p : IconProps) => <Icon {...p} Component={AccountIconMui}/>

export type Styled = {
  style?: CSSProperties,
}
export type NativeStyled = {
  style?: CSSProperties | ViewStyle,
}
export type CanFlex = {
  flex?: boolean,
}
export type Parent = {
  children: React.ReactNode,
}
export type Elevation = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
export type Elevated = {
  elevation?: Elevation,
}

type MuiColor = 'inherit'
  | 'default'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning'

const muiColors: { [K in MuiColor]: K } = {
  inherit: 'inherit',
  default: 'default',
  primary: 'primary',
  secondary: 'secondary',
  error: 'error',
  info: 'info',
  success: 'success',
  warning: 'warning',
}

const resolve_color = (c: string) => muiColors[c as MuiColor] 

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

export interface Changeable<T=string> {
  onChange?: (s: T) => void;
}

export interface BadgeProps extends Styled, Partial<Parent> { size?: number, color?: CSSProperties['color'] }
export const Badge = ({ children, style, color, ...props }: BadgeProps) => (
  <MuiBadge {...props} style={{ color, ...style }}>{children}</MuiBadge>
)

export interface CardProps extends Styled, Parent, Elevated, CanFlex {}
export const Card = ({ children, style, flex, ...props } : CardProps) => (
  <MuiCard {...props} style={{ ...flex ? { display: 'flex', flexGrow: 1 } : {}, ...style }}>{children}</MuiCard>
)

export interface PaperProps extends Styled, Parent, Elevated, CanFlex, ClickableWeb {}
export const Paper = ({ children, style, flex, onClick, onPress, ...props } : PaperProps) => (
  <MuiPaper {...props} style={{ ...flex ? { display: 'flex', flexGrow: 1 } : {}, ...style }}>
    {children}
  </MuiPaper>
)

export const HoverPaper = ({ 
  children, sx, disabled, 
  baseElevation=2,
  hoveredElevation=5,
  ...props 
} : PaperProps & { baseElevation?: number, hoveredElevation?: number, disabled?: boolean, sx?: MuiPaperProps['sx'] }) => {
  const [elevation, setElevation] = useState(baseElevation)

  return (
    <MuiPaper elevation={disabled ? baseElevation : elevation} sx={{
      cursor: !disabled ? 'pointer' : undefined,
      ...sx,
    }} 
      onMouseLeave={() => setElevation(baseElevation)}
      onMouseEnter={() => setElevation(hoveredElevation)}
      {...props} 
    >
      {children}
    </MuiPaper>
  )
}

export interface IconProps extends Styled {
  size?: number,
  color?: MuiColor | string,
}
interface IconBuilderProps extends IconProps {
  Component: React.JSXElementConstructor<Styled>
}

export type IconButtonProps = {
  children: React.ReactNode;
  color?: MuiColor;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large'
  style?: any,
  id?: string,
} & Clickable
export const IconButton = ({ ...props }: IconButtonProps & ClickableWeb) => (
  <MuiIconButton { ...props} />
)

export interface BottomNavigationProps <T extends { [index: string]: any }>{
  initialPageIndex?: number, 
  routes: {
    key: keyof T & string,
    title: string, 
    icon: string,
    Component: React.JSXElementConstructor<any>//{ route?: any; jumpTo?: (key: T) => void; }>,
  }[]
}
export const BottomNavigation = <T extends { [index: string]: any }>(p: BottomNavigationProps<T>) => {
  throw new Error("Unimplemented") // todo: implement me
}

export type TextFieldProps = {
  // shared without modification
  value: string,
  id?: string,
  label?: string,
  disabled?: boolean,
  placeholder?: string,
  error?: boolean,
  helperText?: string,
  size?: 'small',
  onFocus?: (e: any) => void,
  onBlur?: (e: any) => void,
  
  // web only
  autoComplete?: AutoComplete
  multiline?: boolean,
  maxRows?: number,
  autoFocus?: boolean,
  InputProps?: any,
  fullWidth?: boolean,
  name?: string,
  sx?: SxProps,

  // mixed
  variant?: 'filled' | 'outlined' | 'flat',
  type?: React.HTMLInputTypeAttribute,

  // native
  autoCapitalize?: 'none' | 'characters' | 'sentences' | 'words'
  autoCorrect?: boolean,
} & Changeable & Styled
export const TextField = ({ autoCapitalize, autoCorrect, variant, onChange, ...props }: TextFieldProps) => {
  return <MuiTextField 
    variant={ variant === 'flat' ? 'filled' : variant } 
    onChange={e => onChange?.(e.target.value)}
    {...props}
  />
}
export const KeyboardAvoidingTextField = TextField

export type ButtonProps = {
  color?: "primary" | "secondary",
  variant?: "text" | "contained" | "outlined",
  type?: 'button' | 'reset' | 'submit',
  fullWidth?: boolean,
  onClick?: () => void,
  onPress?: () => void,
  disabled?: boolean,
  children?: React.ReactNode,
  style?: any, // todo: universal style
}
export const Button = ({ children, onClick, onPress, ...props}: ButtonProps) => {
  return <MuiButton {...props} onClick={onClick ?? onPress}>{children}</MuiButton>
}

export type TypographyProps = {
  color?: 'primary' | 'secondary' | 'warning' | 'error'
  children?: React.ReactNode,
  style?: any, // todo: universal style
  component?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5',
  noWrap?: boolean,
  title?: string,
  selectable?: boolean, 
} & Clickable
export const Typography = ({ children, onClick, onPress, component='span', ...props}: TypographyProps & ClickableWeb) => {
  return <MuiTypography onClick={onClick ?? onPress} component={component} {...props}>{children}</MuiTypography>
}

export type CircularProgressProps = {
  color?: 'primary' | 'secondary' | 'warning' | 'error',
  style?: any, // todo: universal style,
  size?: number,
}
export const CircularProgress = ({ ...props}: CircularProgressProps) => {
  return <MuiCircularProgress {...props}/>
}

export type LinearProgressProps = {
  color?: 'primary' | 'secondary' | 'warning' | 'error',
  style?: any, // todo: universal style,
  size?: number,
}
export const LinearProgress = ({ ...props}: LinearProgressProps) => {
  return <MuiLinearProgress {...props}/>
}

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

// with overridden default styles to better fit UI elements
export interface TooltipProps extends Styled {
  label: React.ReactChild;
  placement?: TooltipPlacement;
  arrow?: boolean;
  open?: boolean;
  children: React.ReactElement;
  enterDelay?: number;
  enterNextDelay?: number,
  tooltipSx?: SxProps,
}
export const Tooltip = ({ tooltipSx, label, placement, arrow=true, open, style, children, enterDelay, enterNextDelay=enterDelay, ...props } : TooltipProps) => {
  return (
    <MuiTooltip title={label} placement={placement} arrow={arrow} open={open}
      enterDelay={enterDelay} enterNextDelay={enterNextDelay}
      style={{
        ...placement === 'top' ? { top: 5 } : {},
        ...placement === 'left' ? { left: 5 } : {},
        ...placement === 'bottom' ? { bottom: 5 } : {},
        ...placement === 'right' ? { right: 5 } : {},
      }}
      {...props}
      componentsProps={{ tooltip: { sx: tooltipSx } }}
    >
      {/* Wrap with span for hover to work properly, avoid forcing breaks with div */}
      <span style={style}>
        {children}
      </span>
    </MuiTooltip>
  )
}

export interface AvatarProps extends Styled {
  letters?: string,
  src?: string,
  size?: number,
  alt?: string,
}
export const Avatar = ({ size, letters, style, src, ...props }: AvatarProps) => (
  letters ? (
    <MuiAvatar style={size ? { height: size, width: size, ...style } : style} {...props}>{letters}</MuiAvatar>
  ) : (
    <MuiAvatar src={src} style={size ? { height: size, width: size, ...style } : style} {...props}/>
  )
)

export interface ModalProps extends Styled {
  children: React.ReactNode,
  open: boolean,
  setOpen: (b: boolean) => void,
  onClick?: () => void,
  ref?: any,
  zIndex?: number,
}
export const Modal = ({ children, onClick, open, setOpen, style=defaultModalStyle, zIndex }: ModalProps) => (
  <MuiModal open={open} onClick={onClick} onClose={() => setOpen(false)} style={{ zIndex }}>
  <Grid container style={style}>
    {children}
  </Grid>
  </MuiModal>
)

export interface CheckboxProps extends Styled {
  checked?: boolean,
  disabled?: boolean,
  onChange?: (b: boolean) => void,
  label?: string,
}
export const Checkbox = ({ onChange, label, ...props } : CheckboxProps) => {
  const checkbox = (
    <MuiCheckbox {...props} 
      onChange={() => onChange?.(!props.checked)} 
    />
  )
  if (!label) return checkbox

  return (
    <FormControlLabel control={checkbox} label={label} />
  )
}