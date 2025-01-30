import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { Modal, TextInput, useWindowDimensions } from "react-native"
import { Avatar } from 'react-native-paper'
import {
  useFileUpload,
  Flex,
  Typography,
  AsyncIconButton,
  SendIcon,
  LabeledIconButton,
  Button,
  Paper,
  useChats,
  useResolvedSession, 
} from "@tellescope/react-components"
import { useState } from 'react';
import { HTMLMessageProps } from './components';
import { remove_script_tags } from '@tellescope/utilities';
import RenderHtml from 'react-native-render-html';

export const HTMLMessage = ({ html: htmlUnprocessed, color="white", selectable=true } : HTMLMessageProps) => {
  const html = (
    htmlUnprocessed.endsWith('<br/>')
      ? htmlUnprocessed.substring(0, htmlUnprocessed.length - 5)
      : htmlUnprocessed
  )

  const { width } = useWindowDimensions();
  return (
    <RenderHtml defaultTextProps={{ selectable }}
      baseStyle={{
        paddingTop: 4, // causes better fit into both 1-line and multiline chat bubbles
      }}
      contentWidth={width}
      source={{ 
        html: (
          remove_script_tags(html) 
        )
      }}
      tagsStyles={{
        'body': {
          color,
        },
        'a': {
          color,
          textDecorationColor: color, // underline color in the link
        }
      }}
    />
  );
}

const CHAT_ICON_SIZE = 35
const SendImageOrVideo = ({ 
  onUpload, 
  disabled 
} : { 
  disabled?: boolean, 
  onUpload: (file: { secureName: string }, assetType: 'image' | 'video') => void,
}) => {
  const session = useResolvedSession()
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
          style={{ marginBottom: 20, fontSize: 18, padding: 10  }}
        >
          Upload Photo or Video
        </Button>
        <Button disabled={menuDisabled} variant="contained" onPress={() => handleImageSelect('camera')}
          style={{ fontSize: 18, padding: 10 }}
        >
          Take Photo
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
