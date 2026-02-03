import React, { useEffect, useRef, useState } from 'react'
import {
  RemoteParticipant,
  LocalParticipant,
  VideoTrack,
  AudioTrack,
  RemoteTrackPublication,
  LocalTrackPublication,
} from 'twilio-video'
import { Box, Typography } from '@mui/material'

export interface TwilioParticipantProps {
  participant: RemoteParticipant | LocalParticipant
  isLocal?: boolean
  style?: React.CSSProperties
  /** Resolve participant identity to a display label. Defaults to empty string. */
  resolveIdentity?: (identity: string) => string
}

export const TwilioParticipant: React.FC<TwilioParticipantProps> = ({
  participant,
  isLocal = false,
  style,
  resolveIdentity = () => '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [videoTrack, setVideoTrack] = useState<VideoTrack | null>(null)
  const [audioTrack, setAudioTrack] = useState<AudioTrack | null>(null)

  useEffect(() => {
    const handleTrackSubscribed = (track: VideoTrack | AudioTrack) => {
      if (track.kind === 'video') {
        setVideoTrack(track as VideoTrack)
      } else if (track.kind === 'audio') {
        setAudioTrack(track as AudioTrack)
      }
    }

    const handleTrackUnsubscribed = (track: VideoTrack | AudioTrack) => {
      if (track.kind === 'video') {
        setVideoTrack(null)
      } else if (track.kind === 'audio') {
        setAudioTrack(null)
      }
    }

    // Get existing tracks
    participant.tracks.forEach((publication: RemoteTrackPublication | LocalTrackPublication) => {
      if (publication.track) {
        handleTrackSubscribed(publication.track as VideoTrack | AudioTrack)
      }
    })

    // For remote participants, listen for track subscriptions
    if ('on' in participant) {
      participant.on('trackSubscribed', handleTrackSubscribed)
      participant.on('trackUnsubscribed', handleTrackUnsubscribed)
    }

    return () => {
      if ('off' in participant) {
        participant.off('trackSubscribed', handleTrackSubscribed)
        participant.off('trackUnsubscribed', handleTrackUnsubscribed)
      }
    }
  }, [participant])

  // Attach video track
  useEffect(() => {
    if (videoTrack && videoRef.current) {
      videoTrack.attach(videoRef.current)
      return () => {
        videoTrack.detach()
      }
    }
  }, [videoTrack])

  // Attach audio track (not for local participant to avoid echo)
  useEffect(() => {
    if (audioTrack && audioRef.current && !isLocal) {
      audioTrack.attach(audioRef.current)
      return () => {
        audioTrack.detach()
      }
    }
  }, [audioTrack, isLocal])

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#1a1a1a',
        borderRadius: 1,
        overflow: 'hidden',
        ...style,
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted={isLocal}
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: isLocal ? 'scaleX(-1)' : 'none',
        }}
      />
      {!isLocal && <audio ref={audioRef} autoPlay />}
      {(() => {
        const label = resolveIdentity(participant.identity)
        if (!label && !isLocal) return null
        return (
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: '2px 8px',
              borderRadius: 1,
            }}
          >
            {label}{isLocal && (label ? ' (You)' : '(You)')}
          </Typography>
        )
      })()}
    </Box>
  )
}
