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
  SecureImage,
  ImageDimensions,
  SecureVideo,
  useUsers,
  useEndusers,
  useUserAndEnduserDisplayInfo,
  UserAndEnduserSelectorProps,
  UserAndEnduserSelector,
  TextField,
  useFileForSecureName,
  LoadedFile,
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
  formatted_date,
  truncate_string,
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
  wordBreak: 'break-word',
}
const defaultReceivedStyle: CSSProperties = {
  ...baseMessageStyle,
  marginRight: 'auto',
  marginLeft: 5,
  backgroundColor: "#444444",
  wordBreak: 'break-word',
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
  showDate?: boolean,
  showName?: boolean,
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
  showDate,
  showName,
}: MessageProps & Styled) => {
  const session = useResolvedSession()
  const chatUserId = session.userInfo.id

  const [usersLoading] = useUsers()
  const [endusersLoading] = useEndusers()

  // deep copy so that the override of background color doesn't affect other messages
  const textBGStyle = { ...message.senderId === chatUserId ? sentMessageStyle : receivedMessageStyle }
  const textStyle = { ...message.senderId === chatUserId ? sentMessageTextStyle : receivedMessageTextStyle }

  const quote = message?.quote?.join(' \n')

  if (!message.message) {
    // Only remove background if HTML has inline styles (for customization)
    // Keep background for plain HTML without styling for better visibility
    const hasInlineStyles = message.html && message.html.includes('style=')
    if (hasInlineStyles) {
      textBGStyle.backgroundColor = undefined
    }
  } else {
    if (message.senderId === chatUserId) {
      if (sentBgColor) {
        textBGStyle.backgroundColor = sentBgColor;
      }
      if (sentTextColor) {
        textBGStyle.color = sentTextColor;
      }
    } else if (message.mentions?.includes(chatUserId)) {
      textBGStyle.backgroundColor = '#f6b139';
      textBGStyle.color = 'white';
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
    <Flex column flex={1}>
      <Typography component="div" style={{ 
        ...textStyle, 
        ...textBGStyle, 
        marginBottom: attachments ? '4px' : undefined,
      }}>
        <HTMLMessage html={message.html || message.message.split('\n').join('<br/>')} />
      </Typography>
      {quote && 
        <Typography title={`Quoting: ${quote}`} 
          style={{ 
            ...textStyle, ...textBGStyle,
            backgroundColor: undefined, color: 'black',
            borderLeft: '1px solid black', borderRadius: 0, borderWidth: 2, marginTop: 2, paddingTop: 1, paddingBottom: 1,
          }}
        >
          {truncate_string(quote, { length: 75, showEllipsis: true })}
        </Typography>
      }
      {attachments}
    </Flex>
  ) : (
    <Flex flex={1}>
      <Flex style={{ ...textBGStyle }} alignItems="center">
        <Typography style={{ ...textStyle }}>
          {message.html
            ? <HTMLMessage html={message.html} />
            : message.message
          }
        </Typography>   
      </Flex>

      <Flex 
        justifyContent={message.senderId === chatUserId ? 'flex-end' : 'flex-start'} 
        style={{ width: '100%' }}
      >
        {attachments}
      </Flex>
    </Flex>
  )

  const isSender = session.userInfo.id === message.senderId

  const userOrEnduser = (
    (isSender ? session.userInfo : undefined)
    || (value_is_loaded(usersLoading) ? usersLoading.value.find(u => u.id === message.senderId) : undefined)
    || (value_is_loaded(endusersLoading) ? endusersLoading.value.find(e => e.id === message.senderId) : undefined) 
  )

  const displayPicture = (
    <DisplayPicture 
      style={{ maxWidth: '10%' }}
      user={userOrEnduser}
      size={iconSize}
    />
  )

  return (
    <Flex column>
      {showDate && (
        <Flex alignSelf="center"
          style={
            IN_REACT_WEB
              ? {}
              : {
                marginTop: 8
              }
          }
        >
        <Typography>
          {formatted_date(new Date(message.createdAt))}
        </Typography>
        </Flex>
      )
      }
      {showName && (
        <Typography style={{
          fontSize: 13, opacity: 0.8,
          marginRight: isSender ? `${iconSize + 12}px` : 0,
          marginLeft: isSender ? 'auto' : `${iconSize + 12}px`,
          marginTop: 0, marginBottom: 0,
        }}>
          {userOrEnduser?.displayName || user_display_name(userOrEnduser)}
        </Typography>
      )}
      <Flex style={{ margin: 5, marginTop: showName ? 0 : 5, flexWrap: 'nowrap', ...style }}> 
        {message.senderId !== chatUserId && displayPicture}
        {messageComponent}
        {message.senderId === chatUserId && displayPicture}
      </Flex>
    </Flex>
  )
}

export const SecureLinkText = ({ secureName } : { secureName: string }) => {
  const [file, setFile] = useState<LoadedFile>() 
  useFileForSecureName({ secureName, onLoad: setFile })

  if (!file) return  null
  return (
    <Typography 
      style={{
        cursor: 'pointer',
        textDecoration: 'underline',
      }}
      onClick={() => {
        if (IN_REACT_WEB) {
          window.open(file.downloadURL, "_blank")
        } else {
          // todo: allow a function prop for handling open without requiring ReactNative in this package
          // require('react-native').Linking.openURL(file.downloadURL)
        }
      }}
    >
      {file.name}
    </Typography>
  )
}

export const MessageAttachments = ({ message, chatUserId, imageDimensions } : { message: ChatMessage, chatUserId: string, imageDimensions?: ImageDimensions }) => {
  if (!message.attachments) return null
  if (message.attachments.length === 0) return null
  
  return (
    <Flex column alignSelf={message.senderId === chatUserId ? "flex-end" : "flex-start"}>
      {message.attachments.filter(a => !a.type.startsWith('image') && !a.type.startsWith('video')).map(a=> (
        <Flex key={a.secureName} style={{ 
          marginRight: message.senderId === chatUserId ? 0 : 10, 
          marginLeft: message.senderId === chatUserId ? 10 : 0, 
          justifyContent: message.senderId === chatUserId ? "flex-end" : "flex-start",
        }}>
          <SecureLinkText secureName={a.secureName} />
        </Flex>
      ))}
      {message.attachments.filter(a => a.type.startsWith('image')).map(a=> (
        <Flex key={a.secureName} style={{ 
          marginRight: message.senderId === chatUserId ? 0 : 10, 
          marginLeft: message.senderId === chatUserId ? 10 : 0, 
          justifyContent: message.senderId === chatUserId ? "flex-end" : "flex-start",
          ...imageDimensions,
        }}>
          <SecureImage secureName={a.secureName} alt="image attachment" {...imageDimensions} />
        </Flex>
      ))}
      {message.attachments.filter(a => a.type.startsWith('video')).map(a=> (
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

export interface Messages_T extends MessageStyles {
  resolveSenderName?: (room: ChatRoom) => React.ReactNode; 
  messages: LoadedData<ChatMessage[]>,
  chatUserId: string,
  headerProps?: MessagesHeaderProps,
  imageDimensions?: ImageDimensions,
  markRead?: boolean,
  showNames?: boolean
}
/** @deprecated */
export const MessagesWithHeader = ({ 
  resolveSenderName,
  messages, 
  chatUserId, 
  Header=MessagesHeader,
  headerProps,
  style,
  imageDimensions,
  showNames,
  ...messageStyles 
}: Omit<Messages_T, 'markRead'> & Styled & { Header?: React.JSXElementConstructor<MessagesHeaderProps> }) => (
  <LoadingLinear data={messages} render={messages => {
      let lastDate = 0
      return (
        <Flex column flex={1} style={{ ...style, overflowY: 'scroll' }}>
          {Header && <Header {...headerProps}/>}
            <List reverse items={messages} render={(message) => {
              // show after 10+ minute exchanges 
              const timestamp = new Date(message.createdAt).getTime()
              const shouldShowDate = timestamp > (lastDate + 1000 * 60 * 10 )
              if (shouldShowDate) {
                lastDate = timestamp
              }

              return (
                <Flex column>
                  <Message showName={showNames} message={message} imageDimensions={imageDimensions} showDate={shouldShowDate} {...messageStyles} />
                </Flex>
              )
            }}
          />
        </Flex>
      )}
    }
    />
)

export const Messages = ({ 
  resolveSenderName,
  messages, 
  chatUserId, 
  headerProps,
  style,
  imageDimensions,
  markRead,
  showNames,
  ...messageStyles 
}: Messages_T & Styled) => {
  const session = useResolvedSession()
  const [, { findById, updateLocalElement: updateRoom }] = useChatRooms()
  const markReadRef = useRef('')
  
  useEffect(() => {
    if (!markRead) return
    if (!value_is_loaded(messages)) return
    if (messages.value.length === 0) return


    // already marked read
    const room = findById(messages.value[0].roomId)
    if (room && room.infoForUser?.[session.userInfo.id]?.unreadCount === 0) return

    const fetchKey = new Date(room?.updatedAt ?? 0).toString()
    if (fetchKey === markReadRef.current) return
    markReadRef.current = fetchKey

    session.api.chat_rooms.mark_read({ id: messages.value[0].roomId })
    .then(({ updated }) => {
      updateRoom(updated.id, updated)
    })
    .catch(console.error)
  }, [session, markRead, findById, messages, updateRoom])

  return (
    <LoadingLinear data={messages} render={_messages => {
      const sorted = _messages.sort((m1, m2) => new Date(m1.timestamp || m1.createdAt).getTime() - new Date(m2.timestamp || m2.createdAt).getTime())
      
      let lastDate = 0
      let previousSender = ''
      const showDateForMessage = {} as Record<string, { showDate: boolean, showName: boolean }>
      for (const message of sorted) {
        const timestamp = new Date(message.createdAt).getTime()
        const showDate = timestamp > (lastDate + 1000 * 60 * 10 )
        if (showDate) {
          lastDate = timestamp
        }

        const showName = session.userInfo.id !== message.senderId && previousSender !== message.senderId
        previousSender = message.senderId || ''

        showDateForMessage[message.id] = { showDate, showName }
      }
       
      return (
        <List items={sorted} scrollToBottom
          style={style} render={(message) => (
            <Message message={message} imageDimensions={imageDimensions} 
              showDate={showDateForMessage[message.id]?.showDate} 
              showName={showNames && showDateForMessage[message.id]?.showName}
              {...messageStyles} 
            />
          )}
        />    
      )}}
    />
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
  roomType?: ChatRoom['type'],
  aboutEnduserId?: string,
  limitToUsers?: User[],
  addedUserIds?: string[],
}
export const CreateChatRoom = ({ 
  roomTitle: defaultRoomTitle = "Group Chat", 
  onSuccess, onError, 
  roomType,
  aboutEnduserId,
  addedUserIds=[],
  ...props 
} : CreateChatRoomProps) => {
  const [, { createElement: createRoom }] = useChatRooms({ dontFetch: true })
  const [roomTitle, setRoomTitle] = useState(defaultRoomTitle ?? '')

  const handleCreateRoom = useCallback(({ users, endusers }: { users: User[], endusers: Enduser[] }) => {
    const userIds = users.map(u => u.id)
    const enduserIds = endusers.map(e => e.id)

    createRoom({
      enduserIds, 
      userIds: Array.from(new Set([...userIds, ...addedUserIds])),
      title: roomTitle,
      type: roomType,
      ...aboutEnduserId ? { aboutEnduserId } : {},
    })
    .then(r => {
      onSuccess?.(r)
    })
    .catch(onError)
  }, [createRoom, roomTitle, onSuccess, onError, aboutEnduserId])
  
  return (
    <UserAndEnduserSelector {...props} onSelect={handleCreateRoom} 
      initialSelected={addedUserIds} // allows for submitting without selection
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