// components that work with web or native
import React from "react"

import { 
  VideoIcon,
  VideoOffIcon,
  MicrophoneIcon,
  MicrophoneOffIcon,
  CallEndIcon,
  LabeledIconButton,
  Flex,
  Paper,
  Styled,
  Button,
  Typography,
} from "@tellescope/react-components"
import { CurrentCallContext } from "./video_shared"
import { useStartVideoCall } from "./video"
import { BlurToggleIcon, ScreenShareIcon, useJoinVideoCall } from "."

const DEFAULT_BUTTON_SIZE = 30
interface ButtonProps {
  size?: number,
}
export const VideoToggle = ({ size=DEFAULT_BUTTON_SIZE } : ButtonProps) => {
  const { toggleVideo, videoIsEnabled } = React.useContext(CurrentCallContext)

  return (
    <LabeledIconButton color="white" size={size} Icon={videoIsEnabled ? VideoIcon : VideoOffIcon} onClick={toggleVideo} 
      label={videoIsEnabled ? "Turn Camera Off" : "Turn Camera On"}
    />
  )
}

export const MicrophoneToggle = ({ size=DEFAULT_BUTTON_SIZE }: ButtonProps) => {
  const { microphoneIsEnabled, toggleMicrophone } = React.useContext(CurrentCallContext)

  return (
    <LabeledIconButton color="white" size={size} Icon={microphoneIsEnabled ? MicrophoneIcon : MicrophoneOffIcon} onClick={toggleMicrophone} 
      label={microphoneIsEnabled ? "Turn Microphone Off" : "Turn Microphone On"}
    />
  )
}

// ends meeting if host, otherwise leaves meeting
export const EndMeeting = ({ size=DEFAULT_BUTTON_SIZE, onLeave }: ButtonProps & LeaveMeetingProps) => {
  const { endMeeting } = useStartVideoCall()

  return (
    <Button variant="outlined"
      style={{ width: 200, color: 'white', borderColor: 'white' }}
      onClick={() => { 
        onLeave?.()
        endMeeting()
      }}    
    >
      End Meeting for All 
    </Button>
  )
}

interface LeaveMeetingProps {
  onLeave?: () => void,
}
export const LeaveMeeting = ({ onLeave, size=DEFAULT_BUTTON_SIZE } : LeaveMeetingProps & ButtonProps) => {
  const { leaveMeeting } = useJoinVideoCall()


  return (
    <LabeledIconButton size={size} Icon={CallEndIcon} label="Leave Meeting"
      color="white"
        onClick={() => {
          leaveMeeting()
          onLeave?.()
        }}
      />
  )
}

interface ControlbarProps {
  spacing?: number,
  size?: number,
  showEndMeeting?: boolean,
  showScreenShare?: boolean,
  showBlurToggle?: boolean,
}
export const ControlBar = ({ onLeave, style, spacing=15, size, showEndMeeting, showScreenShare, showBlurToggle } : ControlbarProps & LeaveMeetingProps & Styled) => {
  const { isHost } = React.useContext(CurrentCallContext)
  const itemStyle = { marginLeft: spacing, marginRight: spacing }

  return (
    <Flex flex={1} alignItems="center" justifyContent="center" style={style}>
      <Paper elevation={5} 
        style={{ 
          display: 'flex', flexDirection: 'row', padding: spacing,
          backgroundColor: '#00000088',
          borderColor: 'white',
        }}
      >
        {showScreenShare &&
          <Flex column justifyContent="center" style={itemStyle}>
            <Flex>
              <ScreenShareIcon />
            </Flex>

            <Flex>
            <Typography style={{ color: 'white', textAlign: 'center', fontSize: 11 }}>
              Screen share
            </Typography>
            </Flex>
          </Flex>
        }
        {showBlurToggle &&
          <Flex column justifyContent="center" style={itemStyle}>
            <Flex>
              <BlurToggleIcon />
            </Flex>
          </Flex>
        }
        {!showBlurToggle && // blur toggle also provides toggle video controls
          <Flex style={itemStyle}>
            <VideoToggle size={size}/>
          </Flex>
        }
        <Flex style={itemStyle}>
          <MicrophoneToggle size={size}/>
        </Flex>
        <Flex style={itemStyle}>
          <LeaveMeeting size={size} onLeave={onLeave}/>
        </Flex>
        {(isHost || showEndMeeting) && 
          <Flex style={{ marginLeft: 30, marginRight: 20 }}>
            <EndMeeting size={size} onLeave={onLeave} />
          </Flex>
        }
      </Paper>
    </Flex>
  )
}
