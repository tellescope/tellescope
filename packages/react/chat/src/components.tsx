import React, { CSSProperties, useEffect, useState } from "react"
import { ChatMessage } from "@tellescope/types-client";

import {
  AsyncIconButton,
  Flex,
  SendIcon,
  useChats,
} from "@tellescope/react-components"
import { remove_script_tags, user_display_name } from "@tellescope/utilities";
import { Checkbox, TextField, FormControlLabel, Grid } from "@mui/material";

export interface HTMLMessageProps {
  html: string,
}
export const HTMLMessage = ({ html } : HTMLMessageProps) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: remove_script_tags(
          html.replaceAll('<a', '<a style="color: white;"')
        ),
      }} 
    />

  )
}

interface SendMessage_T {
  roomId: string,
  onNewMessage?: (m: ChatMessage) => void;
  placeholderText?: string;
  Icon?: React.ElementType<any>;
  style?: CSSProperties;

  // web only
  sendOnEnterPress?: boolean,
  multiline?: boolean,
  maxRows?: number,
}
export const SendMessage = ({ 
  roomId, 
  Icon=SendIcon, 
  onNewMessage, 
  placeholderText="Enter a message", 
  style={},
  sendOnEnterPress,
  multiline,
  maxRows,
}: SendMessage_T) => {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const [disabled, setDisabled] = useState(false)
  const [chatFocused, setChatFocused] = React.useState(false)
  
  const [, { createElement: createMessage }] = useChats(roomId)

  useEffect(() => {
    if (!chatFocused) return
    if (!sendOnEnterPress) return
    if (typeof window === 'undefined') return

    const handleSend = (e: any) => {
      if (e.key !== 'Enter') return
      setDisabled(true)

      createMessage({ message, roomId })
      .then(m => {
        setMessage('')
        onNewMessage?.(m)
      })
      .catch(console.error)
      .finally(() => setDisabled(false))
    }    

    window.addEventListener('keypress', handleSend)
    return () => { window.removeEventListener('keypress', handleSend) }
  }, [sendOnEnterPress, chatFocused, message, roomId])

  return (
    <Flex row flex={1} alignContent="center" style={style}>
      <Flex column flex={1}>
        <TextField variant="outlined" value={message}  disabled={sending}
          onChange={e => setMessage(e.target.value)}
          aria-label="Enter a message" 
          multiline={multiline} maxRows={maxRows}
          placeholder={placeholderText} 
          onFocus={() => setChatFocused(true)}
          onBlur={() => setChatFocused(false)}
        />
      </Flex>
      <Flex column alignSelf="center">
        <AsyncIconButton label="send" Icon={Icon} 
          disabled={message === '' || disabled}  
          action={() => createMessage({ message, roomId })}
          onSuccess={m => {
            setMessage('')
            onNewMessage?.(m)
          }}
          onChange={setSending}
        />
      </Flex>
    </Flex> 
  )
}