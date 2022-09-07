import React, { CSSProperties, useEffect, useState } from "react"
import { ChatMessage, ChatRoom } from "@tellescope/types-client";

import {
  APIError,
  AsyncIconButton,
  Flex,
  SendIcon,
  TextField,
  useChatRooms,
  useChats,
  useEndusers,
  useUsers,
} from "@tellescope/react-components"

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
        <TextField variant="outlined" value={message} onChange={setMessage} disabled={sending}
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

export interface CreateChatRoomProps {
  excludeEndusers?: boolean,
  excludeUsers?: boolean,
  onGoBack?: () => void,
  onSuccess?: (c: ChatRoom) => void,
  onError?: (e: APIError) => void,
  roomTitle?: string,
  radio?: boolean,
}
export const CreateChatRoom: React.JSXElementConstructor<CreateChatRoomProps> = ({
  excludeEndusers,
  excludeUsers,
  onGoBack, 
  onSuccess, 
  onError=console.error,
  roomTitle="Group Chat",
}) => {
  return null
  // const [, { createElement: createRoom }] = useChatRooms()
  // const [endusersLoading] = useEndusers()
  // const [usersLoading] = useUsers()

  // const [selected, setSelected] = useState<string[]>([])

  // return (
  //   <LoadingData data={{ endusers: endusersLoading, users: usersLoading }} render={({ users, endusers }) => (
  //   <Flex flex={1} column>
  //     <Flex alignItems="center" justifyContent={"space-between"} style={{
  //       marginBottom: 10,
  //     }}>
  //       {onGoBack &&  
  //         <Button onClick={onGoBack}>
  //           Back
  //         </Button>
  //       }
  //       <Typography style={{ fontSize: 20, textAlign: 'center' }}>
  //         Select Members
  //       </Typography>

  //       <LoadingButton submitText='Create' submittingText='Create' 
  //         disabled={selected.length === 0}
  //         style={{ display: 'flex', marginRight: 5 }}
  //         onClick={() => {
  //           const userIds = selected.filter(s => users.find(u => u.id === s))
  //           const enduserIds = selected.filter(s => endusers.find(u => u.id === s))

  //           createRoom({
  //             enduserIds, 
  //             userIds,
  //             title: roomTitle,
  //           })
  //           .then(r => {
  //             setSelected([])
  //             onSuccess?.(r)
  //           })
  //           .catch(onError)
  //         }}
  //       />
  //     </Flex>

  //     <List items={[...excludeUsers ? [] : users, ... excludeEndusers ? [] : endusers]} render={user => (
  //       <Paper flex elevation={5} style={{
  //         marginBottom: 2,
  //       }}>
  //       <Flex flex={1} alignItems="center" justifyContent="space-between" 
  //         onClick={() => setSelected(ss => (
  //           ss.includes(user.id) 
  //             ? ss.filter(s => s !== user.id)
  //             : [user.id, ...ss]
  //         ))}
  //         style={{
  //           paddingLeft: 5, paddingRight: 5,
  //         }}
  //       >
  //         <RadioButton value={user.id}
  //           status={selected.includes(user.id) ? 'checked' : 'unchecked'}
  //         />

  //         <Typography style={{ 
  //           fontWeight: selected.includes(user.id) ? 'bold' : undefined,
  //         }}>
  //           {user_display_name(user)}
  //         </Typography>
  //       </Flex>
  //       </Paper>
  //     )} />
  //   </Flex>
  //   )} />
  // )
}