import React, { useEffect, useRef, useState } from 'react'
import {
  RemoteParticipant,
  LocalParticipant,
  VideoTrack,
  AudioTrack,
  RemoteAudioTrack,
  RemoteTrackPublication,
  LocalTrackPublication,
} from 'twilio-video'
import { Box, Typography } from '@mui/material'
import { SCREEN_SHARE_TRACK_NAME } from './TwilioVideoContext'

export interface TwilioParticipantProps {
  participant: RemoteParticipant | LocalParticipant
  isLocal?: boolean
  style?: React.CSSProperties
  /** Resolve participant identity to a display label. Defaults to empty string. */
  resolveIdentity?: (identity: string) => string
  /** When true, render the screen share track instead of the camera track */
  showScreenShare?: boolean
  /** How the camera video should fit its tile. Defaults to 'cover' (backwards compatible). */
  videoFit?: 'cover' | 'contain'
}

/** Renders a single remote audio track into its own <audio> element. */
const RemoteAudioTrackElement: React.FC<{ track: AudioTrack }> = ({ track }) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      const el = audioRef.current
      track.attach(el)
      return () => {
        track.detach(el)
      }
    }
  }, [track])

  return <audio ref={audioRef} autoPlay />
}

export const TwilioParticipant: React.FC<TwilioParticipantProps> = ({
  participant,
  isLocal = false,
  style,
  resolveIdentity = () => '',
  showScreenShare = false,
  videoFit = 'cover',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraTrack, setCameraTrack] = useState<VideoTrack | null>(null)
  const [screenTrack, setScreenTrack] = useState<VideoTrack | null>(null)
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([])

  useEffect(() => {
    const handleTrackSubscribed = (track: VideoTrack | AudioTrack) => {
      if (track.kind === 'video') {
        if (track.name === SCREEN_SHARE_TRACK_NAME) {
          setScreenTrack(track as VideoTrack)
        } else {
          setCameraTrack(track as VideoTrack)
        }
      } else if (track.kind === 'audio') {
        // Support multiple simultaneous audio tracks (e.g. microphone + screen-share audio).
        // Add by identity, deduping so the same track isn't attached twice.
        setAudioTracks(prev => (prev.includes(track as AudioTrack) ? prev : [...prev, track as AudioTrack]))
      }
    }

    const handleTrackUnsubscribed = (track: VideoTrack | AudioTrack) => {
      if (track.kind === 'video') {
        if (track.name === SCREEN_SHARE_TRACK_NAME) {
          setScreenTrack(null)
        } else {
          setCameraTrack(null)
        }
      } else if (track.kind === 'audio') {
        setAudioTracks(prev => prev.filter(t => t !== (track as AudioTrack)))
      }
    }

    // Get existing tracks
    participant.tracks.forEach((publication: RemoteTrackPublication | LocalTrackPublication) => {
      if (publication.track) {
        handleTrackSubscribed(publication.track as VideoTrack | AudioTrack)
      }
    })

    if (isLocal) {
      // For local participants, listen for track publications (trackSubscribed doesn't fire for local)
      const handleTrackPublished = (publication: LocalTrackPublication) => {
        if (publication.track) {
          handleTrackSubscribed(publication.track as VideoTrack | AudioTrack)
        }
      }
      const handleTrackStopped = (track: VideoTrack | AudioTrack) => {
        handleTrackUnsubscribed(track)
      }
      participant.on('trackPublished', handleTrackPublished)
      participant.on('trackStopped', handleTrackStopped)

      return () => {
        participant.off('trackPublished', handleTrackPublished)
        participant.off('trackStopped', handleTrackStopped)
      }
    } else {
      // For remote participants, listen for track subscriptions
      participant.on('trackSubscribed', handleTrackSubscribed)
      participant.on('trackUnsubscribed', handleTrackUnsubscribed)

      return () => {
        participant.off('trackSubscribed', handleTrackSubscribed)
        participant.off('trackUnsubscribed', handleTrackUnsubscribed)
      }
    }
  }, [participant, isLocal])

  const activeVideoTrack = showScreenShare ? screenTrack : cameraTrack

  // Attach video track
  useEffect(() => {
    if (activeVideoTrack && videoRef.current) {
      const el = videoRef.current
      activeVideoTrack.attach(el)
      return () => {
        activeVideoTrack.detach(el)
      }
    }
  }, [activeVideoTrack])

  const shouldMirror = isLocal && !showScreenShare

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
          objectFit: showScreenShare ? 'contain' : videoFit,
          transform: shouldMirror ? 'scaleX(-1)' : 'none',
        }}
      />
      {/* Render one audio element per track so simultaneous tracks (mic + screen-share audio) all play */}
      {!isLocal && audioTracks.map(track => (
        <RemoteAudioTrackElement key={(track as RemoteAudioTrack).sid} track={track} />
      ))}
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
