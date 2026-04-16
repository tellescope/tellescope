import React from 'react'
import { Box, IconButton, Button } from '@mui/material'
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  CallEnd as CallEndIcon,
  ScreenShare as ScreenShareIcon,
  StopScreenShare as StopScreenShareIcon,
} from '@mui/icons-material'
import { useTwilioVideo } from './TwilioVideoContext'

export interface TwilioControlBarProps {
  onLeave?: () => void
  onEndForAll?: () => void
  style?: React.CSSProperties
  /** Whether to show the screen share button. Defaults to true. */
  showScreenShare?: boolean
}

export const TwilioControlBar: React.FC<TwilioControlBarProps> = ({
  onLeave,
  onEndForAll,
  style,
  showScreenShare: showScreenShareProp = true,
}) => {
  const {
    isVideoEnabled,
    isAudioEnabled,
    isScreenSharing,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    disconnect,
    isHost,
    room,
  } = useTwilioVideo()

  const handleLeave = () => {
    disconnect()
    onLeave?.()
  }

  const handleEndForAll = () => {
    onEndForAll?.()
    disconnect()
  }

  const supportsScreenShare = typeof navigator !== 'undefined'
    && navigator.mediaDevices
    && typeof navigator.mediaDevices.getDisplayMedia === 'function'

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        backgroundColor: '#1a1a1a',
        padding: '12px 24px',
        ...style,
      }}
    >
      <IconButton
        onClick={toggleAudio}
        sx={{
          color: isAudioEnabled ? 'white' : '#ff4444',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)',
          },
        }}
      >
        {isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
      </IconButton>

      <IconButton
        onClick={toggleVideo}
        sx={{
          color: isVideoEnabled ? 'white' : '#ff4444',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)',
          },
        }}
      >
        {isVideoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
      </IconButton>

      {showScreenShareProp && supportsScreenShare && (
        <IconButton
          onClick={toggleScreenShare}
          disabled={!room}
          sx={{
            color: isScreenSharing ? '#4caf50' : 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
            '&.Mui-disabled': {
              color: 'rgba(255,255,255,0.3)',
            },
          }}
        >
          {isScreenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
        </IconButton>
      )}

      <IconButton
        onClick={handleLeave}
        sx={{
          backgroundColor: '#ff4444',
          color: 'white',
          '&:hover': {
            backgroundColor: '#cc3333',
          },
        }}
      >
        <CallEndIcon />
      </IconButton>

      {isHost && onEndForAll && (
        <Button
          variant="outlined"
          onClick={handleEndForAll}
          sx={{
            color: 'white',
            borderColor: 'white',
            marginLeft: 2,
            '&:hover': {
              borderColor: '#ff4444',
              color: '#ff4444',
            },
          }}
        >
          End For All
        </Button>
      )}
    </Box>
  )
}
