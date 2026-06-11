import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import Video, {
  Room,
  LocalVideoTrack,
  LocalAudioTrack,
  RemoteParticipant,
  LocalTrack,
  RemoteTrack,
  LocalParticipant,
} from 'twilio-video'
import type { GaussianBlurBackgroundProcessor as GaussianBlurBackgroundProcessorType } from '@twilio/video-processors'

export const SCREEN_SHARE_TRACK_NAME = 'screen-share'
export const SCREEN_SHARE_AUDIO_TRACK_NAME = 'screen-share-audio'

export const BLUR_BACKGROUND_STORAGE_KEY = 'tellescope.twilio.blurBackground'
export const BLUR_BACKGROUND_ASSETS_PATH = '/twilio-video-processors'

let videoProcessorsModulePromise: Promise<typeof import('@twilio/video-processors')> | null = null
export const loadTwilioVideoProcessorsModule = () => {
  if (!videoProcessorsModulePromise) {
    videoProcessorsModulePromise = import('@twilio/video-processors')
  }
  return videoProcessorsModulePromise
}

const readBlurPreference = (): boolean => {
  try {
    return typeof localStorage !== 'undefined'
      && localStorage.getItem(BLUR_BACKGROUND_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

const writeBlurPreference = (enabled: boolean) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(BLUR_BACKGROUND_STORAGE_KEY, enabled ? 'true' : 'false')
    }
  } catch { /* ignore */ }
}

export interface TwilioVideoState {
  room: Room | null
  isConnecting: boolean
  isConnected: boolean
  localVideoTrack: LocalVideoTrack | null
  localAudioTrack: LocalAudioTrack | null
  localScreenTrack: LocalVideoTrack | null
  isScreenSharing: boolean
  screenSharingParticipantSid: string | null
  participants: RemoteParticipant[]
  error: Error | null
  isHost: boolean
  isVideoEnabled: boolean
  isAudioEnabled: boolean
  isBlurSupported: boolean
  isBlurEnabled: boolean
  isBlurLoading: boolean
}

export interface TwilioVideoActions {
  connect: (token: string, roomName: string) => Promise<void>
  disconnect: () => void
  toggleVideo: () => Promise<void>
  toggleAudio: () => void
  toggleScreenShare: (options?: { shareAudio?: boolean }) => Promise<void>
  toggleBlur: () => void
  setIsHost: (isHost: boolean) => void
}

export type TwilioVideoContextType = TwilioVideoState & TwilioVideoActions

const TwilioVideoContext = createContext<TwilioVideoContextType | null>(null)

export const useTwilioVideo = (): TwilioVideoContextType => {
  const context = useContext(TwilioVideoContext)
  if (!context) {
    throw new Error('useTwilioVideo must be used within TwilioVideoProvider')
  }
  return context
}

export interface TwilioVideoProviderProps {
  children: React.ReactNode
}

export const TwilioVideoProvider: React.FC<TwilioVideoProviderProps> = ({ children }) => {
  const [room, setRoom] = useState<Room | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [localVideoTrack, setLocalVideoTrack] = useState<LocalVideoTrack | null>(null)
  const [localAudioTrack, setLocalAudioTrack] = useState<LocalAudioTrack | null>(null)
  const [participants, setParticipants] = useState<RemoteParticipant[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [isHost, setIsHost] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [localScreenTrack, setLocalScreenTrack] = useState<LocalVideoTrack | null>(null)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [screenSharingParticipantSid, setScreenSharingParticipantSid] = useState<string | null>(null)
  const [isBlurSupported, setIsBlurSupported] = useState(false)
  const [isBlurEnabled, setIsBlurEnabled] = useState<boolean>(readBlurPreference)
  const [isBlurLoading, setIsBlurLoading] = useState(false)

  const localTracksRef = useRef<(LocalVideoTrack | LocalAudioTrack)[]>([])
  const screenAudioTrackRef = useRef<LocalAudioTrack | null>(null)
  const blurProcessorRef = useRef<GaussianBlurBackgroundProcessorType | null>(null)
  const blurAttachedTrackRef = useRef<LocalVideoTrack | null>(null)

  const connect = useCallback(async (token: string, roomName: string) => {
    setIsConnecting(true)
    setError(null)

    // Pick up any preference set by the pre-call preview, which lives outside
    // this provider and only persists via localStorage.
    setIsBlurEnabled(readBlurPreference())

    try {
      // Create local tracks
      const tracks = await Video.createLocalTracks({
        audio: true,
        video: { width: 640 },
      })

      localTracksRef.current = tracks as (LocalVideoTrack | LocalAudioTrack)[]

      const videoTrack = tracks.find((track: LocalTrack) => track.kind === 'video') as LocalVideoTrack | undefined
      const audioTrack = tracks.find((track: LocalTrack) => track.kind === 'audio') as LocalAudioTrack | undefined

      if (videoTrack) setLocalVideoTrack(videoTrack)
      if (audioTrack) setLocalAudioTrack(audioTrack)

      // Connect to room
      const newRoom = await Video.connect(token, {
        name: roomName,
        tracks,
        dominantSpeaker: true,
        networkQuality: { local: 1, remote: 1 },
      })

      setRoom(newRoom)

      // Handle existing participants
      const existingParticipants = Array.from(newRoom.participants.values())
      setParticipants(existingParticipants)

      // Listen for new participants
      newRoom.on('participantConnected', (participant: RemoteParticipant) => {
        setParticipants(prev => [...prev, participant])
      })

      newRoom.on('participantDisconnected', (participant: RemoteParticipant) => {
        setParticipants(prev => prev.filter(p => p.sid !== participant.sid))
      })

      // Track remote screen sharing for React re-renders
      newRoom.on('trackSubscribed', (track: RemoteTrack, publication, participant: RemoteParticipant) => {
        if (track.kind === 'video' && track.name === SCREEN_SHARE_TRACK_NAME) {
          setScreenSharingParticipantSid(participant.sid)
        }
      })
      newRoom.on('trackUnsubscribed', (track: RemoteTrack, publication, participant: RemoteParticipant) => {
        if (track.kind === 'video' && track.name === SCREEN_SHARE_TRACK_NAME) {
          setScreenSharingParticipantSid(null)
        }
      })

      newRoom.on('disconnected', () => {
        // Stop all local tracks when disconnected
        localTracksRef.current.forEach(track => {
          track.stop()
        })
        localTracksRef.current = []
        screenAudioTrackRef.current = null
        setRoom(null)
        setLocalVideoTrack(null)
        setLocalAudioTrack(null)
        setLocalScreenTrack(null)
        setIsScreenSharing(false)
        setScreenSharingParticipantSid(null)
        setParticipants([])
      })

    } catch (err) {
      setError(err as Error)
      console.error('Failed to connect to Twilio Video:', err)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    if (room) {
      room.disconnect()
    }

    // Stop local tracks
    localTracksRef.current.forEach(track => {
      track.stop()
    })
    localTracksRef.current = []
    screenAudioTrackRef.current = null

    setRoom(null)
    setLocalVideoTrack(null)
    setLocalAudioTrack(null)
    setLocalScreenTrack(null)
    setIsScreenSharing(false)
    setScreenSharingParticipantSid(null)
    setParticipants([])
  }, [room])

  const toggleVideo = useCallback(async () => {
    if (localVideoTrack) {
      if (isVideoEnabled) {
        localVideoTrack.disable()
      } else {
        localVideoTrack.enable()
      }
      setIsVideoEnabled(!isVideoEnabled)
    }
  }, [localVideoTrack, isVideoEnabled])

  const toggleAudio = useCallback(() => {
    if (localAudioTrack) {
      if (isAudioEnabled) {
        localAudioTrack.disable()
      } else {
        localAudioTrack.enable()
      }
      setIsAudioEnabled(!isAudioEnabled)
    }
  }, [localAudioTrack, isAudioEnabled])

  const stopScreenShare = useCallback(() => {
    if (localScreenTrack) {
      if (room) {
        room.localParticipant.unpublishTrack(localScreenTrack)
      }
      localScreenTrack.stop()
      localTracksRef.current = localTracksRef.current.filter(t => t !== localScreenTrack)
      setLocalScreenTrack(null)
      setIsScreenSharing(false)
    }

    // Tear down the accompanying screen-share audio track, if any
    if (screenAudioTrackRef.current) {
      const audioTrack = screenAudioTrackRef.current
      if (room) {
        room.localParticipant.unpublishTrack(audioTrack)
      }
      audioTrack.stop()
      localTracksRef.current = localTracksRef.current.filter(t => t !== audioTrack)
      screenAudioTrackRef.current = null
    }
  }, [localScreenTrack, room])

  const toggleScreenShare = useCallback(async (options?: { shareAudio?: boolean }) => {
    if (isScreenSharing) {
      stopScreenShare()
      return
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: !!options?.shareAudio })
      const mediaStreamTrack = stream.getVideoTracks()[0]
      const screenTrack = new LocalVideoTrack(mediaStreamTrack, { name: SCREEN_SHARE_TRACK_NAME })

      if (room) {
        await room.localParticipant.publishTrack(screenTrack)
      }

      localTracksRef.current.push(screenTrack)
      setLocalScreenTrack(screenTrack)
      setIsScreenSharing(true)

      // Capture & publish screen/tab audio if the browser provided an audio track
      const audioMediaStreamTrack = stream.getAudioTracks()[0]
      let screenAudioTrack: LocalAudioTrack | null = null
      if (audioMediaStreamTrack) {
        screenAudioTrack = new LocalAudioTrack(audioMediaStreamTrack, { name: SCREEN_SHARE_AUDIO_TRACK_NAME })
        if (room) {
          await room.localParticipant.publishTrack(screenAudioTrack)
        }
        localTracksRef.current.push(screenAudioTrack)
        screenAudioTrackRef.current = screenAudioTrack
      }

      // Handle browser "Stop sharing" button
      mediaStreamTrack.onended = () => {
        if (room) {
          room.localParticipant.unpublishTrack(screenTrack)
        }
        screenTrack.stop()
        localTracksRef.current = localTracksRef.current.filter(t => t !== screenTrack)
        setLocalScreenTrack(null)
        setIsScreenSharing(false)

        if (screenAudioTrack) {
          if (room) {
            room.localParticipant.unpublishTrack(screenAudioTrack)
          }
          screenAudioTrack.stop()
          localTracksRef.current = localTracksRef.current.filter(t => t !== screenAudioTrack)
          screenAudioTrackRef.current = null
        }
      }
    } catch (err) {
      // User cancelled the screen share picker — not an error
      console.log('Screen share cancelled or failed:', err)
    }
  }, [isScreenSharing, stopScreenShare, room])

  const toggleBlur = useCallback(() => {
    setIsBlurEnabled(prev => {
      const next = !prev
      writeBlurPreference(next)
      return next
    })
  }, [])

  // Probe video-processors support once on mount
  useEffect(() => {
    let mounted = true
    loadTwilioVideoProcessorsModule()
      .then(({ isSupported }) => { if (mounted) setIsBlurSupported(!!isSupported) })
      .catch(() => { /* leave unsupported */ })
    return () => { mounted = false }
  }, [])

  // Sync blur processor with the current local video track + enabled state
  useEffect(() => {
    if (!isBlurSupported) return
    const track = localVideoTrack

    let cancelled = false
    const apply = async () => {
      // Detach from any previously-attached track if it differs from the current one
      const previouslyAttached = blurAttachedTrackRef.current
      if (previouslyAttached && previouslyAttached !== track && blurProcessorRef.current) {
        try { previouslyAttached.removeProcessor(blurProcessorRef.current) } catch { /* ignore */ }
        blurAttachedTrackRef.current = null
      }

      if (!track) return

      if (isBlurEnabled) {
        if (!blurProcessorRef.current) {
          setIsBlurLoading(true)
          try {
            const { GaussianBlurBackgroundProcessor } = await loadTwilioVideoProcessorsModule()
            if (cancelled) return
            const processor = new GaussianBlurBackgroundProcessor({
              assetsPath: BLUR_BACKGROUND_ASSETS_PATH,
            })
            await processor.loadModel()
            if (cancelled) return
            blurProcessorRef.current = processor
          } catch (err) {
            console.error('Failed to load Twilio video blur processor:', err)
            if (!cancelled) setIsBlurEnabled(false)
            return
          } finally {
            if (!cancelled) setIsBlurLoading(false)
          }
        }

        if (blurAttachedTrackRef.current !== track && blurProcessorRef.current) {
          try {
            track.addProcessor(blurProcessorRef.current, {
              inputFrameBufferType: 'videoframe',
              outputFrameBufferContextType: 'bitmaprenderer',
            })
            blurAttachedTrackRef.current = track
          } catch (err) {
            console.error('Failed to attach blur processor to track:', err)
          }
        }
      } else if (blurAttachedTrackRef.current === track && blurProcessorRef.current) {
        try { track.removeProcessor(blurProcessorRef.current) } catch { /* ignore */ }
        blurAttachedTrackRef.current = null
      }
    }

    apply()

    return () => { cancelled = true }
  }, [localVideoTrack, isBlurEnabled, isBlurSupported])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (blurAttachedTrackRef.current && blurProcessorRef.current) {
        try { blurAttachedTrackRef.current.removeProcessor(blurProcessorRef.current) } catch { /* ignore */ }
      }
      blurAttachedTrackRef.current = null
      if (room) {
        room.disconnect()
      }
      localTracksRef.current.forEach(track => {
        track.stop()
      })
    }
  }, [])

  const value: TwilioVideoContextType = {
    room,
    isConnecting,
    isConnected: !!room,
    localVideoTrack,
    localAudioTrack,
    localScreenTrack,
    isScreenSharing,
    screenSharingParticipantSid,
    participants,
    error,
    isHost,
    isVideoEnabled,
    isAudioEnabled,
    isBlurSupported,
    isBlurEnabled,
    isBlurLoading,
    connect,
    disconnect,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    toggleBlur,
    setIsHost,
  }

  return (
    <TwilioVideoContext.Provider value={value}>
      {children}
    </TwilioVideoContext.Provider>
  )
}
