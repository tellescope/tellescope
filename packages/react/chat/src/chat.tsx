import React, { useState, CSSProperties, useEffect, useRef, useCallback } from "react"

import {
  DisplayPicture,
  IN_REACT_WEB,
  List,
  Flex,
  Badge,
  Styled,
  Typography,
  LoadingLinear,
  value_is_loaded,
  useSession,
  useEnduserSession,
  useResolvedSession,
  useChatRooms,
  useChats,
  useChatRoomDisplayInfo,
  ChatRoomDisplayInfo,
  SecureImage,
  ImageDimensions,
  SecureVideo,
  useUsers,
  useEndusers,
  useUserAndEnduserDisplayInfo,
  UserAndEnduserSelectorProps,
  UserAndEnduserSelector,
  TextField,
} from "@tellescope/react-components"

import {
  ChatRoom,
  ChatMessage,
  UserDisplayInfo,
  User,
  Enduser,
} from "@tellescope/types-client"
import {
  UserActivityStatus,
  UserActivityInfo,
} from "@tellescope/types-models"

import {
  APIError,
  LoadedData, 
  SessionType,
} from "@tellescope/types-utilities"

import {
  ActivityOptions,
  user_display_name, user_is_active,
} from "@tellescope/utilities"

import {
  PRIMARY_HEX,
} from "@tellescope/constants"

import {
  Session,
  EnduserSession,
} from "@tellescope/sdk"
import { HTMLMessage, SendMessage } from "./components"

export {
  user_display_name, // for convenience
}

const MESSAGE_BORDER_RADIUS = 25

const baseMessageStyle: CSSProperties = {
  borderRadius: MESSAGE_BORDER_RADIUS,
  paddingRight: 10,
  paddingLeft: 10,
  paddingTop: 6,
  paddingBottom: 6,
}
const defaultSentStyle: CSSProperties = {
  ...baseMessageStyle,
  marginLeft: 'auto',
  marginRight: 5,
  backgroundColor: PRIMARY_HEX,
}
const defaultReceivedStyle: CSSProperties = {
  ...baseMessageStyle,
  marginRight: 'auto',
  marginLeft: 5,
  backgroundColor: "#444444",
}

const baseTextStyle = {
  color: "#ffffff",
}
const defaultSentTextStyle = {
  ...baseTextStyle,
  marginRight: 5,
  marginLeft: 5,
}
const defaultReceivedTextStyle = {
  ...baseTextStyle,
  marginRight: 5,
  marginLeft: 5,
}

export interface MessagesHeaderProps {
  room?: ChatRoom;
  resolveSenderName?: (room: ChatRoom) => React.ReactNode; 
  style?: CSSProperties;
}

const MessagesHeader = ({ room, resolveSenderName, ...p}: MessagesHeaderProps) => (
  <Flex>
    <Typography>
      {room &&  resolveSenderName?.(room)}
    </Typography>
  </Flex>
)

interface MessageStyles {
  receivedMessageContainerStyle?: CSSProperties,
  sentMessageContainerStyle?: CSSProperties,
  receivedMessageStyle?: CSSProperties,
  receivedMessageTextStyle?: CSSProperties,
  sentMessageStyle?: CSSProperties,
  sentMessageTextStyle?: CSSProperties,
  sentBgColor?: string,
  sentTextColor?: string,
  receivedBgColor?: string,
  receivedTextColor?: string,
}

interface MessageProps extends MessageStyles {
  message: ChatMessage,
  iconSize?: number,
  imageDimensions?: ImageDimensions,
}
export const Message = ({ 
  message, 
  iconSize=30,
  sentBgColor,
  sentTextColor,
  receivedBgColor,
  receivedTextColor,
  sentMessageStyle=defaultSentStyle,
  receivedMessageStyle=defaultReceivedStyle, 
  sentMessageTextStyle=defaultSentTextStyle,
  receivedMessageTextStyle=defaultReceivedTextStyle,
  imageDimensions,
  style,
}: MessageProps & Styled) => {
  const session = useResolvedSession()
  const chatUserId = session.userInfo.id

  const [usersLoading] = useUsers()
  const [endusersLoading] = useEndusers()

  // deep copy so that the override of background color doesn't affect other messages
  const textBGStyle = { ...message.senderId === chatUserId ? sentMessageStyle : receivedMessageStyle }
  const textStyle = { ...message.senderId === chatUserId ? sentMessageTextStyle : receivedMessageTextStyle }

  if (!message.message) {
    textBGStyle.backgroundColor = undefined
  } else {
    if (message.senderId === chatUserId) {
      if (sentBgColor) {
        textBGStyle.backgroundColor = sentBgColor;
      }
      if (sentTextColor) {
        textBGStyle.color = sentTextColor;
      }
    } else {
      if (receivedBgColor) {
        textBGStyle.backgroundColor = receivedBgColor;
      }
      if (receivedTextColor) {
        textBGStyle.color = receivedTextColor;
      }
    }
  }

  const attachments = (
    !!message.attachments && message.attachments.length > 0 
      && <MessageAttachments message={message} chatUserId={chatUserId} imageDimensions={imageDimensions} />
  )

  const messageComponent = IN_REACT_WEB ? (
    <Typography component="div" style={{ ...textStyle, ...textBGStyle }}>
      {message.html
        ? <HTMLMessage html={message.html} />
        : message.message
      }
      {attachments}
    </Typography>
  ) : (
    <Flex style={{ ...textBGStyle }} alignItems="center">
      <Typography component="div" style={{ ...textStyle }}>
        {message.html
          ? <HTMLMessage html={message.html} />
          : message.message
        }
        {attachments}
      </Typography>   
    </Flex>
  )

  const displayPicture = (
    <DisplayPicture 
      style={{ maxWidth: '10%' }}
      user={
         (session.userInfo.id === message.senderId ? session.userInfo : undefined)
      || (value_is_loaded(usersLoading) ? usersLoading.value.find(u => u.id === message.senderId) : undefined)
      || (value_is_loaded(endusersLoading) ? endusersLoading.value.find(e => e.id === message.senderId) : undefined) 
      }
      size={iconSize}
    />
  )

  return (
    <Flex style={{ margin: 5, flexWrap: 'nowrap', ...style }}> 
      {message.senderId !== chatUserId && displayPicture}
      {messageComponent}
      {message.senderId === chatUserId && displayPicture}
    </Flex>
  )
}

export const MessageAttachments = ({ message, chatUserId, imageDimensions } : { message: ChatMessage, chatUserId: string, imageDimensions?: ImageDimensions }) => {
  if (!message.attachments) return null
  if (message.attachments.length === 0) return null
  
  return (
    <Flex column alignSelf={message.senderId === chatUserId ? "flex-end" : "flex-start"}>
      {message.attachments.filter(a => a.type === 'image').map(a=> (
        <Flex key={a.secureName} style={{ 
          marginRight: message.senderId === chatUserId ? 0 : 10, 
          marginLeft: message.senderId === chatUserId ? 10 : 0, 
          justifyContent: message.senderId === chatUserId ? "flex-end" : "flex-start",
          ...imageDimensions,
        }}>
          <SecureImage secureName={a.secureName} alt="image attachment" {...imageDimensions} />
        </Flex>
      ))}
      {message.attachments.filter(a => a.type === 'video').map(a=> (
        <Flex key={a.secureName} style={{ 
          justifyContent: message.senderId === chatUserId ? "flex-end" : "flex-start",
          ...imageDimensions,
        }}>
          <SecureVideo secureName={a.secureName} {...imageDimensions} />
        </Flex>
      ))}
    </Flex>
  )
}

export type MessageTheme = { theme?: string }

interface Messages_T extends MessageStyles {
  resolveSenderName?: (room: ChatRoom) => React.ReactNode; 
  messages: LoadedData<ChatMessage[]>,
  chatUserId: string,
  headerProps?: MessagesHeaderProps,
  imageDimensions?: ImageDimensions,
  markRead?: boolean,
}
export const MessagesWithHeader = ({ 
  resolveSenderName,
  messages, 
  chatUserId, 
  Header=MessagesHeader,
  headerProps,
  style,
  imageDimensions,
  ...messageStyles 
}: Omit<Messages_T, 'markRead'> & Styled & { Header?: React.JSXElementConstructor<MessagesHeaderProps> }) => (
  <LoadingLinear data={messages} render={messages => (
    <Flex column flex={1} style={{ ...style, overflowY: 'scroll' }}>
      {Header && <Header {...headerProps}/>}
      <List reverse items={messages} render={(message, i) => (
        <Flex column>
          <Message message={message} imageDimensions={imageDimensions} {...messageStyles} />
        </Flex>
      )}/>    
    </Flex>
  )}/>
)

export const Messages = ({ 
  resolveSenderName,
  messages, 
  chatUserId, 
  headerProps,
  style,
  imageDimensions,
  markRead,
  ...messageStyles 
}: Messages_T & Styled) => {
  const session = useResolvedSession()
  const [, { updateLocalElement: updateRoom }] = useChatRooms()
  const markReadRef = useRef(false)
  
  useEffect(() => {
    if (!markRead) return
    if (!value_is_loaded(messages)) return
    if (messages.value.length === 0) return

    if (markReadRef.current) return
    markReadRef.current = true

    session.api.chat_rooms.mark_read({ id: messages.value[0].roomId })
    .then(({ updated }) => {
      updateRoom(updated.id, updated)
    })
    .catch(console.error)
  }, [session, markRead, messages, markReadRef, updateRoom])


  return (
    <LoadingLinear data={messages} render={messages => (
      <List reverse items={messages} style={style} render={(message) => (
        <Message message={message} imageDimensions={imageDimensions} {...messageStyles} />
      )}/>    
    )}/>
  )
}

const defaultSidebarStyle: CSSProperties  = {
  borderRadius: 5,
  overflowY: 'auto',
}
const defaultSidebarItemStyle: CSSProperties  = {
  borderRadius: 5,
  cursor: 'pointer',
  maxHeight: 60,
  justifyContent: 'center',
}
const defaultSidebarItemStyleSelected = { 
  ...defaultSidebarItemStyle,
  backgroundColor: PRIMARY_HEX,
  cursor: "default",
}
const defaultMessageNameStyle: CSSProperties = {
  textAlign: 'right',
}
const defaultMessagePreviewStyle: CSSProperties = {
  textAlign: 'right',
}

export interface ConversationPreviewProps {
  room: ChatRoom;
  displayInfo: { [index: string]: UserDisplayInfo };
  onClick?: (room: ChatRoom) => void;
  selected?: boolean;
  style?: CSSProperties;
  selectedStyle?: CSSProperties;
}

export const resolve_chat_room_name = (room: ChatRoom, displayInfo: { [index: string]: UserDisplayInfo }, userType: SessionType, currentUserId: string) => {
  if (room.recentSender !== currentUserId) {
    return user_display_name(displayInfo[room.recentSender ?? ''])
  }
  if (userType === 'user') {
    return user_display_name(displayInfo[room?.enduserIds?.[0] ?? room.creator ?? ''])
  }
  if (userType === 'enduser') {
    console.log(room.recentSender, room.creator, displayInfo[room.creator])
    return user_display_name(displayInfo[room?.userIds?.[0] ?? room.creator ?? ''])
  }
  return ''
}

export type PreviewComponentType = React.JSXElementConstructor<ConversationPreviewProps> 

interface SidebarInfo {
  selectedRoom?: string;
  onRoomSelect: (roomId: string) => void;
  style?: CSSProperties;
  selectedItemStyle?: CSSProperties;
  itemStyle?: CSSProperties;
  nameStyle?: CSSProperties;
  PreviewComponent?: PreviewComponentType,
  previewStyle?: CSSProperties;
}

const ConversationPreview = ({ onClick, selected, room, style, displayInfo, selectedStyle }: ConversationPreviewProps) => {
  const session = useResolvedSession()

  return (
    <Flex flex={1} column onClick={() => !selected && onClick?.(room)} 
      style={selected ? (selectedStyle ?? defaultSidebarItemStyleSelected) : (style ?? defaultSidebarItemStyle) }
    >
      <Typography style={defaultMessageNameStyle}>
        {resolve_chat_room_name(room, displayInfo, session.type, session.userInfo.id)}
      </Typography>

      <Typography style={defaultMessagePreviewStyle}>
        {room.recentMessage ?? room.title}
      </Typography>
    </Flex>
  )
}

const PreviewWithData = ({ PreviewComponent=ConversationPreview, ...props }: Omit<ConversationPreviewProps, 'displayInfo'> & Pick<SidebarInfo, 'PreviewComponent'>) => {
  const [displayInfo] = useChatRoomDisplayInfo(props.room.id)

  return (
    <PreviewComponent displayInfo={value_is_loaded(displayInfo) ? displayInfo.value : {} } 
      {...props} 
    />
  )
}

interface ConversationsProps extends SidebarInfo {
  rooms: LoadedData<ChatRoom[]>;
}
export const Conversations = ({ rooms, selectedRoom, onRoomSelect, PreviewComponent=ConversationPreview, style, selectedItemStyle, itemStyle } : ConversationsProps) => ( 
  <LoadingLinear data={rooms} render={rooms =>
    <List items={[...rooms].sort((r1, r2) => new Date(r2.updatedAt).getTime() - new Date(r1.updatedAt).getTime() )} 
      style={style ?? defaultSidebarStyle} onClick={r => onRoomSelect(r.id)} 
      render={(room, { onClick, index }) => 
        <PreviewWithData key={room.id} room={room} onClick={onClick} selected={selectedRoom === room.id} 
          selectedStyle={selectedItemStyle} style={itemStyle} PreviewComponent={PreviewComponent}
        />
      }  
    />    
  }/>
)


// deprecated while Conversations relies on useResolvedSession
export const EndusersConversations = ({ enduserId, ...p } : SidebarInfo & { enduserId: string }) => <Conversations {...p} rooms={useChatRooms()[0]} />

// deprecated while Conversations relies on useResolvedSession
export const UsersConversations = ({ userId, ...p } : SidebarInfo & { userId: string }) => <Conversations {...p} rooms={useChatRooms()[0]}/>

const defaultSplitChatStyle: CSSProperties = {}
interface SplitChat_T {
  session: EnduserSession | Session,
  type: SessionType,
}
export const SplitChat = ({ session, type, style=defaultSplitChatStyle } : SplitChat_T & Styled) => {
  const [selectedRoom, setSelectedRoom] = useState('')
  const [messages] = useChats(selectedRoom)

  return (
    <Flex row style={style} flex={1}>
      <Flex column flex={1}>
        {type === 'user'
          ? <UsersConversations userId={session.userInfo.id} selectedRoom={selectedRoom} onRoomSelect={setSelectedRoom} />
          : <EndusersConversations selectedRoom={selectedRoom} enduserId={session.userInfo.id} onRoomSelect={setSelectedRoom} />
        }
      </Flex>

      <Flex column flex={2} style={{ borderRadius: 5 }}>
        {selectedRoom && 
          <>
          <Flex row flex={8}>
            <Messages messages={messages} chatUserId={session.userInfo.id} />
          </Flex>

          <Flex row flex={1} style={{ marginLeft: 10, marginRight: 10 }}>
            <SendMessage roomId={selectedRoom} /> 
          </Flex>
          </>
        }
      </Flex>
    </Flex>
  )
}

export const UserChatSplit = ({ style=defaultSplitChatStyle } : Styled) => {
  const session = useSession()
  return (
    <SplitChat session={session} type="user" style={style}/>
  )
}

export const EnduserChatSplit = ({ style=defaultSplitChatStyle } : Styled) => {
  const session = useEnduserSession()
  return (
    <SplitChat session={session} type="enduser" style={style}/>
  )
}

const defaultColorForStatus: { [K in UserActivityStatus]: CSSProperties['color'] } = {
  Active: '#15ba11',
  Away: '#FFD125',
  Unavailable: '#DC1717'
}
export const UserActiveBadge = ({ user, style, size, activeThresholdMS, inactiveThresholdMS }: { 
  user?: UserActivityInfo, 
  size?: number,
} & ActivityOptions & Styled) => {
  const status = user_is_active(user, { activeThresholdMS, inactiveThresholdMS }) 
  if (status === null || status === 'Unavailable') return null
 
  return (
    <Badge color={defaultColorForStatus[status]} size={size} style={style}/>
  )
}

export const AttendeesList = ({ roomId, style, attendeeStyle } : { roomId: string, attendeeStyle?: React.CSSProperties } & Styled) => {
const [, { findById: findRoom } ] = useChatRooms({ dontFetch: true })
  const displayInfo = useUserAndEnduserDisplayInfo() 

  const room = findRoom(roomId)
  if (!room) return null
  
  if (!(room.enduserIds?.length || room.userIds?.length )) throw new Error("This room has no users or endusers")

  return (
    <Flex flex={1} column style={style}>
    {[...room.userIds ?? [], ...room.enduserIds ?? []].map(id => (
      <Typography style={{ fontSize: 18, narginBottom: 10, ...attendeeStyle }}>
        {user_display_name(displayInfo[id])}
      </Typography>
    ))}
    </Flex>
  )
}

export interface CreateChatRoomProps extends Omit<UserAndEnduserSelectorProps, 'onSelect'> {
  onSuccess?: (c: ChatRoom) => void,
  onError?: (e: APIError) => void,
  roomTitle?: string,
}
export const CreateChatRoom = ({ 
  roomTitle: defaultRoomTitle = "Group Chat", 
  onSuccess, onError, 
  ...props 
} : CreateChatRoomProps) => {
  const [, { createElement: createRoom }] = useChatRooms({ dontFetch: true })
  const [roomTitle, setRoomTitle] = useState(defaultRoomTitle ?? '')

  const handleCreateRoom = useCallback(({ users, endusers }: { users: User[], endusers: Enduser[] }) => {
    const userIds = users.map(u => u.id)
    const enduserIds = endusers.map(e => e.id)

    createRoom({
      enduserIds, 
      userIds,
      title: roomTitle,
    })
    .then(r => {
      onSuccess?.(r)
    })
    .catch(onError)
  }, [createRoom, roomTitle, onSuccess, onError])
  
  return (
    <UserAndEnduserSelector {...props} onSelect={handleCreateRoom} 
      titleInput={
        <TextField autoFocus value={roomTitle} onChange={t => setRoomTitle(t)} 
          style={{ 
            width: props.searchBarPlacement !== 'top'
              ? '100%'
              : undefined
          }}
          label="Title" placeholder="Enter conversation title..." 
          size="small"
        />
      }
    />
  )
}