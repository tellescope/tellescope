import React, { useState } from 'react';

// import DefaultIcon from '@mui/icons-material/Info';

import {
  Button,
  ButtonProps,
  Tooltip,
  IconButton,
  CircularProgress,
  Styled,
  TooltipPlacement,

  DownloadIcon,
  Modal,
} from "./mui"

import {
  Flex,
} from "./layout"
import { useResolvedSession, ModalProps } from './index';

export interface WithOffset {
  offsetX?: number,
  offsetY?: number, 
}

export interface LabeledIconButtonProps extends WithOffset {
  Icon: React.ElementType, 
  label: string, 
  id?: string, 
  ariaLabel?: string, 
  disabled?: boolean, 
  color?: "primary" | "secondary" | "inherit" | 'default' | 'white' | 'error', 
  placement?: TooltipPlacement, 
  onClick?: (e:any) => void, 
  showArrow?: boolean, 
  padding?: number,
  className?: string,
  open?: boolean | undefined,
  size?: number | undefined,
  enterDelay?: number,
  enterNextDelay?: number,
}
export const DEFAULT_ICON_BUTTON_SIZE = 25
export const LabeledIconButton = ({ 
  Icon=() => null, 
  label, 
  id = undefined, 
  ariaLabel = label, 
  disabled = false, 
  color="primary", 
  placement='top', 
  onClick=console.warn, 
  showArrow=true, 
  padding=5,
  open=undefined,
  size=DEFAULT_ICON_BUTTON_SIZE,
  offsetX=0,
  offsetY=0,
  enterDelay=0,
  enterNextDelay=enterDelay,
  style,
} : LabeledIconButtonProps & Styled) => 
{
  const positionStyle: React.CSSProperties = {
    position: "relative", top: offsetY, left: offsetX,
  }

  const Button = (
    <IconButton color={color !== 'white' ? color : undefined} aria-label={label ?? ariaLabel} 
      style={{ 
        padding, 
        ...disabled ? positionStyle : {},
        ...(color === 'white' ? { color: disabled ? '#bdbdbd' : 'white' } : {}),
        ...style,
      }}
      onClick={onClick} id={id} disabled={disabled}  
    >
      <Icon 
        size={size} // useful for native
        style={{ fontSize: size }}  // useful for web
      />
    </IconButton>
  )

  // don't include tooltip when disabled
  if (disabled) return Button

  return (
    <Tooltip label={label} placement={placement} arrow={showArrow} open={open} 
      enterDelay={enterDelay} enterNextDelay={enterNextDelay}
      style={positionStyle}
    >
      {Button}
    </Tooltip>
  ) 
}

const CircularProgressIcon = ({ style } : Styled) => <Flex style={style}><CircularProgress style={style}/></Flex>

export interface AsyncAction <T=any>{
  action: () => Promise<T>,
  staysMounted?: boolean,
  onSuccess?: (v: T) => void,
  onError?: (e: any) => void,
  onChange?: (processing: boolean) => void;
}
export const useAsyncAction = <T,>({ action, staysMounted=true, onSuccess, onError, onChange }: AsyncAction<T>) => {
  const [performingAction, setPerformingAction] = useState(false)

  const handlePerformAction = () => {
    setPerformingAction(true)
    onChange?.(true)

    action()
    .then(onSuccess)
    .catch(onError ?? console.error)
    .finally(() => { 
      if (staysMounted) {
        setPerformingAction(false); 
        onChange?.(false);
      }
    })
  }  

  return { performingAction, handlePerformAction }
}
export const AsyncIconButton = <T,>({ Icon, ...props } : LabeledIconButtonProps & AsyncAction<T> & Styled) => {
  const { performingAction, handlePerformAction } = useAsyncAction(props)

  props.size = (props.size ?? DEFAULT_ICON_BUTTON_SIZE)
  if (props.size > 10) { props.size -= 5 } // reasonable size adjustment for default size of icon button

  return <LabeledIconButton {...props} disabled={props.disabled ?? performingAction} onClick={handlePerformAction}
    Icon={performingAction 
      ? () => (
        <CircularProgressIcon style={{ 
          minHeight: props.size, minWidth: props.size,
          maxHeight: props.size, maxWidth: props.size, 
        }} />
      ) : Icon
    }
  />
}
interface AsyncButtonProps<T> extends AsyncAction<T> {
  text: string,
  loadingText?: string,
  variant?: ButtonProps['variant'],
}
export const AsyncButton = <T,>({ text, loadingText=text, variant, ...props }: AsyncButtonProps<T>) => {
  const { performingAction, handlePerformAction } = useAsyncAction(props)

  return (
    <Button disabled={performingAction} onClick={handlePerformAction} variant={variant}>
      {performingAction ? loadingText : text}
    </Button>
  )
}

interface ClickToDownloadSecureFile {
  secureName: string,
  onDownload: (downloadURL: string) => void;
  onError?: (error: string) => void;
}
export const ClickToDownloadFileComponent = ({ 
  secureName,
  onDownload,
  onError, 
  children,
} : ClickToDownloadSecureFile & { children: React.ReactNode }) => {
  const session = useResolvedSession()

  return (
    <Flex onClick={async () => {
      try {
        // should be cached by API so no need to optimize with client-side state
        const { downloadURL } = await session.api.files.file_download_URL({ secureName })
        onDownload(downloadURL)
      } catch(err: any) {
        onError?.(err?.message)
      }
    }}>
      {children}
    </Flex>
  )
}

export const useDownloadSecureFile = (options: { preferInBrowser?: boolean }) => {
  const session = useResolvedSession()
  return {
    downloadFile: async (secureName: string) => {
      // should be cached by API so no need to optimize with client-side state
      const { downloadURL } = await session.api.files.file_download_URL({ secureName, ...options })
      return downloadURL
    }
  } 
}

interface DownloadButton {
  secureName?: string,
  publicURL?: string,
  onDownload: (downloadURL: string) => void;
  onError?: (error: string) => void;
  color?: "primary" | "white"
  Icon?: typeof DownloadIcon
  label?: string,
  preferInBrowser?: boolean,
}

export const DownloadFileIconButton = ({ preferInBrowser, publicURL, secureName, label="Download File", Icon=DownloadIcon, onDownload, onError, ...props }: DownloadButton) => {
  const session = useResolvedSession()
  const [downloadURL, setDownloadURL] = useState(publicURL ?? '')

  return (
    <AsyncIconButton Icon={Icon} {...props} label={label} ariaLabel='download icon' 
      action={async () => {
        if (downloadURL) {
          onDownload(downloadURL) 
          return
        }
        try {
          if (!secureName) return

          const { downloadURL } = await session.api.files.file_download_URL({ secureName, preferInBrowser })
          setDownloadURL(downloadURL)
          onDownload(downloadURL)
        } catch(err: any) { onError?.(err?.message ?? '') }          
      }}
    />
  )
}



interface UseModalIconButtonProps extends LabeledIconButtonProps {}
export const useModalIconButton = (props: UseModalIconButtonProps) => {
  const [open, setOpen] = React.useState(false)
  
  return {
    open,
    setOpen,
    ...props,
  }
}

export const defaultModalStyle: React.CSSProperties = {
  backgroundColor: '#ffffff', 
  marginTop: '10vh',
  marginLeft: '10vw',
  height: '80vh',
  width: '80vw',
  borderRadius: 10,
  padding: 25,
  alignItems: 'center',
  justifyContent: 'center',
  overflowY: 'auto',
}

export const IconModal = ({ 
  open, setOpen, children, disabled, onClick, style, ModalComponent, ...props 
}: ReturnType<typeof useModalIconButton> & Styled & { ModalComponent?: React.JSXElementConstructor<ModalProps>, children: React.ReactNode }) => {
  const defaultStyle = ModalComponent ? undefined : defaultModalStyle
  const ModalResolved = ModalComponent ?? Modal

  return (
    <>
    <ModalResolved open={open} setOpen={setOpen} style={style ?? defaultStyle}>
      {children} 
    </ModalResolved>
    <LabeledIconButton disabled={disabled || open} {...props}
      onClick={e => {
        setOpen(o => !o)
        onClick?.(e)
      }}
    />
    </>
  )
}