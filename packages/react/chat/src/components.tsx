import React, { CSSProperties, useEffect, useState } from "react"
import { ChatMessage } from "@tellescope/types-client";

import {
  AsyncIconButton,
  Flex,
  SendIcon,
  useChats,
} from "@tellescope/react-components"
import { remove_script_tags, user_display_name } from "@tellescope/utilities";

const stripOuterParagraphTags = (html: string): string => {
  let result = html.trim()
  while (result.startsWith('<p>') && result.endsWith('</p>')) {
    result = result.slice(3, -4).trim()
  }
  return result
}
import { Checkbox, TextField, FormControlLabel, Grid } from "@mui/material";
import { ChatAttachment } from "@tellescope/types-models";

export interface HTMLMessageProps {
  html: string,
  color?: string,
  selectable?: boolean,
}
export const HTMLMessage = ({ html } : HTMLMessageProps) => (
  <div style={{ padding: 2 }}
    dangerouslySetInnerHTML={{
      __html: remove_script_tags(
        stripOuterParagraphTags(html).replace(/<a/g, '<a style="color: white;"')
      ),
    }} 
  />
)

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
  size?: 'small',
  getAttachments?: () => Promise<ChatAttachment[]>
  inputRef?: React.Ref<HTMLInputElement>
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
  size,
  getAttachments,
  inputRef,
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

    const handleSend = async (e: any) => {
      if (e.key !== 'Enter') return
      setDisabled(true)
      if (!message.trim()) return

      const attachments = await getAttachments?.()

      createMessage({ message, roomId, attachments })
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
        <TextField variant="outlined" value={message} disabled={sending}
          size={size} ref={inputRef}
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
          action={async () => {
            const attachments = await getAttachments?.()
            return createMessage({ message, roomId, attachments })
          }}
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