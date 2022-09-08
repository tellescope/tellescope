import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { Modal, View, TextInput } from "react-native"
import { Avatar, RadioButton } from 'react-native-paper'
import {
  useFileUpload,
  Flex,
  Typography,
  useEnduserSession,
  AsyncIconButton,
  SendIcon,
  LabeledIconButton,
  Button,
  Paper,
  useChats,
  useUsers,
  useEndusers,
  List,
  LoadingData,
  useChatRooms,
  APIError,
  LoadingButton,
  useResolvedSession, 
} from "@tellescope/react-components"
import { useState } from 'react';
import { ChatRoom } from '@tellescope/types-client';
import { render } from 'react-dom';
import { user_display_name } from '@tellescope/utilities';
import { CreateChatRoomProps } from './components';

const CHAT_ICON_SIZE = 35
const SendImageOrVideo = ({ 
  onUpload, 
  disabled 
} : { 
  disabled?: boolean, 
  onUpload: (file: { secureName: string }, assetType: 'image' | 'video') => void,
}) => {
  const session = useEnduserSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { handleUpload, uploading } = useFileUpload({ enduserId: session.userInfo.id })

  const handleImageSelect = async (type: 'library' | 'camera') => {
    if (uploading) return
    setErrorMessage('')

    const result = await (type === 'library' ? launchImageLibrary : launchCamera)({
      mediaType: 'mixed', // library' ? 'mixed' : 'photo', // mixed only works for library
      maxWidth: 500,
      maxHeight: 500,
    })
    if (result.didCancel) return
    if (result.errorCode || result.errorMessage) {
      setErrorMessage(
        result.errorCode === 'camera_unavailable' ? "Your camera is unavailable"
      : result.errorCode === 'permission' ? "We do have permission to access your camera"
      : result.errorMessage || 'An error occurred' 
      )
      return
    }
    const image = result.assets?.[0]
    if (!image) return

    const blob = await (await fetch(image.uri as string)).blob()
    const actualSize = blob.size // image.size is incorrect by an unpredictable margin

    try {
      const file = await handleUpload({ 
        name: image.fileName as string,
        size: actualSize, // image.fileSize as number,
        type: image.type as string,
      }, {
        uri: image.uri as string,
        name: image.fileName as string,
        type: image.type as string,
      })
      onUpload(
        file,
        result.assets?.[0]?.duration ? 'video' : 'image',
      )
      setMenuOpen(false)
    } catch(err: any) {
      setErrorMessage(err?.message ?? err.toString())
    }
  }

  const menuDisabled = uploading || disabled
  return (
    <>
    <Modal animationType='fade' transparent={true}
      visible={menuOpen} onRequestClose={() => setMenuOpen(false)}
    >
      <Flex flex={1} alignItems="center" justifyContent="center">
      <Paper flex style={{ padding: 25, margin: 10, }} >
        <Button disabled={menuDisabled} variant="contained" onPress={() => handleImageSelect('library')}
          style={{ marginBottom: 20 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 40 }}>
            <Typography style={{ fontSize: 18, marginRight: 10, color: 'white' }}>
              Upload
            </Typography>
            <Avatar.Icon icon="image" color="white" size={CHAT_ICON_SIZE} />
          </View>
        </Button>
        <Button disabled={menuDisabled} variant="contained" onPress={() => handleImageSelect('camera')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 40 }}>
            <Typography style={{ fontSize: 18, marginRight: 10, color: 'white' }}>
              Take Photo
            </Typography>
            <Avatar.Icon icon="camera" color="white" size={CHAT_ICON_SIZE} />
          </View>
        </Button>
        <Button variant='outlined' onPress={() => setMenuOpen(false)} style={{ marginTop: 25 }}>
          Cancel
        </Button> 

        <Typography style={{ marginTop: 5, color: '#ff4444'}}>
          {errorMessage}
        </Typography>
      </Paper>
      </Flex>
    </Modal>

    <LabeledIconButton label="attach image" disabled={menuDisabled} 
      onClick={() => setMenuOpen(true)}
      Icon={() => <Avatar.Icon icon={'image'} size={CHAT_ICON_SIZE} />}
    />
    </>
  )
}

interface SendMessage_T {
  roomId: string,
  placeholderText?: string;
  style?: React.CSSProperties;
}
export const SendMessage = ({ 
  roomId, 
  placeholderText="Enter a message", 
  style={},
}: SendMessage_T) => {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  
  const [, { createElement: createMessage }] = useChats(roomId)

  return (
    <Flex row flex={1} alignContent="center" style={{ marginTop: 8, ...style }}>
      <Flex column flex={1} style={{ marginLeft: 5, marginRight: 5 }}>
        <TextInput value={message} onChangeText={setMessage} 
          style={{ 
            width: '100%',
            borderColor: '#0f0f0f',
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
          }}
          aria-label="Enter a message..." 
          placeholder={placeholderText} 
        />
      </Flex>
      <Flex alignSelf="center">
        <Flex style={{ marginRight: 5 }}>
        <AsyncIconButton label="send" Icon={() => <SendIcon size={CHAT_ICON_SIZE} />} 
          disabled={message === ''}  
          action={() => createMessage({ message, roomId })}
          onSuccess={() => setMessage('')}
          onChange={setSending}
        />
        </Flex>

        <Flex style={{ marginRight: 5 }}>
        <SendImageOrVideo disabled={sending} onUpload={async ({ secureName }, type) => {
          setSending(true)
          try {
            await createMessage({ 
              roomId, message: '',
              attachments: [{ type, secureName }]
            })
          } catch(err: any) {
            console.error(err)
          } finally {
            setSending(false)
          }
         }} />
         </Flex>
      </Flex>
    </Flex> 
  )
}

export const CreateChatRoom = ({
  excludeEndusers,
  excludeUsers,
  onGoBack, 
  onSuccess, 
  onError=console.error,
  roomTitle="Group Chat",
  radio,
}: CreateChatRoomProps) => {
  const session = useResolvedSession()
  const [, { createElement: createRoom }] = useChatRooms()
  const [endusersLoading] = useEndusers()
  const [usersLoading] = useUsers()

  const [selected, setSelected] = useState<string[]>([])

  return (
    <LoadingData data={{ endusers: endusersLoading, users: usersLoading }} render={({ users, endusers }) => (
    <Flex flex={1} column>
      <Flex alignItems="center" justifyContent={"space-between"} style={{
        marginBottom: 10,
      }}>
        {onGoBack &&  
          <Button onClick={onGoBack}>
            Back
          </Button>
        }
        <Typography style={{ fontSize: 20, textAlign: 'center' }}>
          Select Members
        </Typography>

        <LoadingButton submitText='Create' submittingText='Create' 
          disabled={selected.length === 0}
          style={{ display: 'flex', marginRight: 5 }}
          onClick={() => {
            const userIds = selected.filter(s => users.find(u => u.id === s))
            const enduserIds = selected.filter(s => endusers.find(u => u.id === s))

            if (session.type === 'enduser') {
              enduserIds.push(session.userInfo.id)
            } else {
              userIds.push(session.userInfo.id)
            }

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
          }}
        />
      </Flex>

      <List items={[...excludeUsers ? [] : users, ... excludeEndusers ? [] : endusers].filter(u => u.id !== session.userInfo.id)} 
        render={user => (
          <Paper flex elevation={5} style={{
            marginBottom: 2,
          }}>
          <Flex flex={1} alignItems="center" justifyContent="space-between" 
            onClick={() => setSelected(ss => (
              ss.includes(user.id) 
                ? radio 
                  ? []
                  : ss.filter(s => s !== user.id)
                :radio 
                  ? [user.id]
                  : [user.id, ...ss]
            ))}
            style={{
              paddingLeft: 5, paddingRight: 5,
            }}
          >
            <RadioButton value={user.id}
              status={selected.includes(user.id) ? 'checked' : 'unchecked'}
            />

            <Typography style={{ 
              fontWeight: selected.includes(user.id) ? 'bold' : undefined,
            }}>
              {user_display_name(user)}
            </Typography>
          </Flex>
          </Paper>
        )} />
    </Flex>
    )} />
  )
}