import React from 'react'
import { Box, IconButton, Button } from '@mui/material'
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  CallEnd as CallEndIcon,
} from '@mui/icons-material'
import { useTwilioVideo } from './TwilioVideoContext'

export interface TwilioControlBarProps {
  onLeave?: () => void
  onEndForAll?: () => void
  style?: React.CSSProperties
}

export const TwilioControlBar: React.FC<TwilioControlBarProps> = ({
  onLeave,
  onEndForAll,
  style,
}) => {
  const {
    isVideoEnabled,
    isAudioEnabled,
    toggleVideo,
    toggleAudio,
    disconnect,
    isHost,
  } = useTwilioVideo()

  const handleLeave = () => {
    disconnect()
    onLeave?.()
  }

  const handleEndForAll = () => {
    onEndForAll?.()
    disconnect()
  }

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
