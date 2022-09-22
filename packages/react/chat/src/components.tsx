import React, { CSSProperties, useCallback, useEffect, useMemo, useState } from "react"
import { ChatMessage, ChatRoom, Enduser, User } from "@tellescope/types-client";

import {
  APIError,
  AsyncIconButton,
  Button,
  EnduserOrUserSearch,
  EnduserSearch,
  Flex,
  HoverPaper,
  List,
  LoadingButton,
  LoadingData,
  Paper,
  ScrollingList,
  SendIcon,
  Typography,
  useChatRooms,
  useChats,
  useEndusers,
  useFilters,
  UserSearch,
  useUsers,
} from "@tellescope/react-components"
import { user_display_name } from "@tellescope/utilities";
import { Checkbox, TextField, FormControlLabel, Grid } from "@mui/material";

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

export interface CreateChatRoomProps {
  excludeEndusers?: boolean,
  excludeUsers?: boolean,
  onGoBack?: () => void,
  onSuccess?: (c: ChatRoom) => void,
  onError?: (e: APIError) => void,
  title?: string,
  roomTitle?: string,
  radio?: boolean,
  minHeight?: React.CSSProperties['maxHeight']
  maxHeight?: React.CSSProperties['maxHeight']
  showTitleInput?: boolean,
  searchBarPlacement?: "top" | "bottom", 
}
export const CreateChatRoom: React.JSXElementConstructor<CreateChatRoomProps> = ({
  excludeEndusers,
  excludeUsers,
  onGoBack, 
  onSuccess, 
  onError=console.error,
  showTitleInput,
  title="Select Members",
  roomTitle: defaultRoomTitle = "Group Chat",
  minHeight,
  maxHeight='50vh',
  searchBarPlacement="top"
}) => {
  const [, { createElement: createRoom }] = useChatRooms()
  const [endusersLoading, { loadMore: loadMoreEndusers, doneLoading: doneLoadingEndusers }] = useEndusers()
  const [usersLoading, { loadMore: loadMoreUsers, doneLoading: doneLoadingUsers }] = useUsers()
  const [roomTitle, setRoomTitle] = useState(defaultRoomTitle)

  const doneLoading = useCallback(() => 
    (excludeUsers || doneLoadingUsers()) && (excludeEndusers || doneLoadingEndusers()), 
    [doneLoadingEndusers, excludeUsers, excludeEndusers, doneLoadingUsers]
  )

  const loadMore = useCallback(async () => {
    if (!excludeEndusers && !doneLoadingEndusers()) { loadMoreEndusers().catch(console.error) };
    if (!excludeUsers && !doneLoadingUsers()) { loadMoreUsers().catch(console.error) };
  }, [doneLoadingEndusers, doneLoadingUsers, loadMoreEndusers, loadMoreUsers])

  const [selected, setSelected] = useState<string[]>([])

  const { applyFilters, ...filterProps } = useFilters<any>()

  const searchbarFullWidth = searchBarPlacement === "bottom"

  const searchbar = useMemo(() => (
    excludeUsers 
      ? <EnduserSearch {...filterProps} fullWidth={searchbarFullWidth} />
  : excludeEndusers
      ? <UserSearch {...filterProps} fullWidth={searchbarFullWidth} />
      : <EnduserOrUserSearch {...filterProps} fullWidth={searchbarFullWidth} />
  ), [excludeUsers, excludeEndusers, filterProps, searchbarFullWidth])

  const handleCreateRoom = useCallback((users: User[], endusers: Enduser[]) => {
    const userIds = selected.filter(s => users.find(u => u.id === s))
    const enduserIds = selected.filter(s => endusers.find(u => u.id === s))

    createRoom({
      enduserIds, 
      userIds,
      title: roomTitle,
    })
    .then(r => {
      setSelected([])
      onSuccess?.(r)
    })
    .catch(onError)
  }, [createRoom, roomTitle, onSuccess, onError])
  
  return (
    <LoadingData data={{ endusers: endusersLoading, users: usersLoading }} render={({ users, endusers }) => {
      const itemsUnfiltered = [...excludeUsers ? [] : users, ... excludeEndusers ? [] : endusers]
      const items = applyFilters(itemsUnfiltered)
      return (
      <Flex flex={1} column>
        <Grid container alignItems="center" justifyContent={"space-between"} wrap="nowrap"
          style={{
            marginBottom: 10,
          }}
        >
          {onGoBack &&  
            <Button onClick={onGoBack}>
              Back
            </Button>
          }
          <Typography style={{ fontSize: 16, textAlign: 'center' }}>
            {title}
          </Typography>

          <LoadingButton submitText='Create' submittingText='Create' 
            disabled={selected.length === 0}
            style={{ display: 'flex' }}
            onClick={() => handleCreateRoom(users, endusers)}
          />
        </Grid>

        <ScrollingList items={items} 
          emptyText={
            itemsUnfiltered.length === 0 
              ? "No contacts found" 
              : "No one found for search"
          }
          minHeight={minHeight} maxHeight={maxHeight}
          doneLoading={doneLoading}
          loadMore={loadMore}
          title={
            showTitleInput && 
              <TextField autoFocus value={roomTitle} onChange={e => setRoomTitle(e.target.value)} 
                fullWidth={searchBarPlacement !== 'top'}
                label="Title" placeholder="Enter conversation title..." 
                size="small"
              />
          }
          titleStyle={searchBarPlacement !== "top" ?
            {
              width: '100%',
            }
            : {}
          }
          titleActionsComponent={searchBarPlacement === 'top' ? searchbar : undefined}
          Item={({ item: user }) => (
            <HoverPaper style={{
              marginBottom: 4,
            }}>
            <Flex flex={1} alignItems="center" justifyContent="space-between" 
              onClick={() => setSelected(ss => (
                ss.includes(user.id) 
                  ? ss.filter(s => s !== user.id)
                  : [user.id, ...ss]
              ))}
              style={{
                paddingLeft: 5, paddingRight: 5,
              }}
            >
              <FormControlLabel control={<Checkbox checked={selected.includes(user.id)} />} label="" />

              <Typography style={{ 
                fontWeight: selected.includes(user.id) ? 'bold' : undefined,
              }}>
                {user_display_name(user)}
              </Typography>
            </Flex>
            </HoverPaper>
          )} 
        />

        {searchBarPlacement === 'bottom' &&
          <Grid item alignSelf="flex-end" sx={{ mt: 1, width: '100%' }}>
            {searchbar}
          </Grid>
        }
      </Flex>
      )}
    } />
  )
}