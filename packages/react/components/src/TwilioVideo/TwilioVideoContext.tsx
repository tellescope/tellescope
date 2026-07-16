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
import {
  BackgroundEffect,
  BackgroundEffectController,
  loadTwilioVideoProcessorsModule,
  loadBackgroundImage,
  readEffectPreference,
  writeEffectPreference,
  BLUR_BACKGROUND_ASSETS_PATH,
} from './backgroundEffects'

export const SCREEN_SHARE_TRACK_NAME = 'screen-share'
export const SCREEN_SHARE_AUDIO_TRACK_NAME = 'screen-share-audio'

// Re-exported for convenience / backward compatibility
export {
  loadTwilioVideoProcessorsModule,
  BLUR_BACKGROUND_ASSETS_PATH,
} from './backgroundEffects'
export type { BackgroundEffect } from './backgroundEffects'

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
  backgroundEffect: BackgroundEffect
  isBackgroundEffectSupported: boolean
  isImageBackgroundAvailable: boolean
  isEffectLoading: boolean
}

export interface TwilioVideoActions {
  connect: (token: string, roomName: string) => Promise<void>
  disconnect: () => void
  toggleVideo: () => Promise<void>
  toggleAudio: () => void
  toggleScreenShare: (options?: { shareAudio?: boolean }) => Promise<void>
  setBackgroundEffect: (effect: BackgroundEffect) => void
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
  /**
   * Optional URL of an image to offer as a virtual background. Only the
   * provider webapp supplies this (from the org's videoCallBackgroundImage);
   * when absent the Image effect option is hidden (patient portal).
   */
  backgroundImageURL?: string
}

export const TwilioVideoProvider: React.FC<TwilioVideoProviderProps> = ({ children, backgroundImageURL }) => {
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
  const [isBackgroundEffectSupported, setIsBackgroundEffectSupported] = useState(false)
  const [backgroundEffect, setBackgroundEffectState] = useState<BackgroundEffect>(readEffectPreference)
  const [isEffectLoading, setIsEffectLoading] = useState(false)
  const [backgroundImageEl, setBackgroundImageEl] = useState<HTMLImageElement | null>(null)

  const localTracksRef = useRef<(LocalVideoTrack | LocalAudioTrack)[]>([])
  // Mirrors the room state so unmount/page-unload cleanup can reach the live
  // room without re-registering listeners (state closures go stale)
  const roomRef = useRef<Room | null>(null)
  const screenAudioTrackRef = useRef<LocalAudioTrack | null>(null)
  const backgroundControllerRef = useRef<BackgroundEffectController>(new BackgroundEffectController())

  const isImageBackgroundAvailable = isBackgroundEffectSupported && !!backgroundImageURL

  const connect = useCallback(async (token: string, roomName: string) => {
    setIsConnecting(true)
    setError(null)

    // Pick up any preference set by the pre-call preview, which lives outside
    // this provider and only persists via localStorage.
    setBackgroundEffectState(readEffectPreference())

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
      roomRef.current = newRoom

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
        roomRef.current = null
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

    roomRef.current = null
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

  const setBackgroundEffect = useCallback((effect: BackgroundEffect) => {
    setBackgroundEffectState(effect)
    writeEffectPreference(effect)
  }, [])

  // Probe video-processors support once on mount
  useEffect(() => {
    let mounted = true
    loadTwilioVideoProcessorsModule()
      .then(({ isSupported }) => { if (mounted) setIsBackgroundEffectSupported(!!isSupported) })
      .catch(() => { /* leave unsupported */ })
    return () => { mounted = false }
  }, [])

  // Load the background image once per URL
  useEffect(() => {
    if (!backgroundImageURL) {
      setBackgroundImageEl(null)
      return
    }
    let cancelled = false
    loadBackgroundImage(backgroundImageURL)
      .then(img => { if (!cancelled) setBackgroundImageEl(img) })
      .catch(err => {
        console.error('Failed to load Twilio background image:', err)
        if (!cancelled) setBackgroundImageEl(null)
      })
    return () => { cancelled = true }
  }, [backgroundImageURL])

  // Sync the background-effect processor with the current local video track + effect
  useEffect(() => {
    if (!isBackgroundEffectSupported) return

    let cancelled = false
    const controller = backgroundControllerRef.current
    const run = async () => {
      if (backgroundEffect !== 'none') setIsEffectLoading(true)
      try {
        await controller.apply(localVideoTrack, backgroundEffect, backgroundImageEl)
      } catch (err) {
        console.error('Failed to apply Twilio background effect:', err)
        // Fall back to no effect if the processor/image failed to load
        if (!cancelled) setBackgroundEffect('none')
      } finally {
        if (!cancelled) setIsEffectLoading(false)
      }
    }
    run()

    return () => { cancelled = true }
  }, [localVideoTrack, backgroundEffect, isBackgroundEffectSupported, backgroundImageEl, setBackgroundEffect])

  // Cleanup on unmount (e.g. SPA navigation away from the call)
  useEffect(() => {
    const controller = backgroundControllerRef.current
    return () => {
      controller.detach()
      roomRef.current?.disconnect()
      localTracksRef.current.forEach(track => {
        track.stop()
      })
    }
  }, [])

  // Disconnect on page unload (tab close, browser back out of the SPA) so the
  // remote side gets participantDisconnected immediately instead of a frozen
  // frame until Twilio's media timeout. pagehide covers modern browsers
  // (including mobile Safari + bfcache); beforeunload is an older fallback.
  // Disconnecting an already-disconnected room is a no-op.
  useEffect(() => {
    const handleUnload = () => {
      roomRef.current?.disconnect()
    }
    window.addEventListener('pagehide', handleUnload)
    window.addEventListener('beforeunload', handleUnload)
    return () => {
      window.removeEventListener('pagehide', handleUnload)
      window.removeEventListener('beforeunload', handleUnload)
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
    backgroundEffect,
    isBackgroundEffectSupported,
    isImageBackgroundAvailable,
    isEffectLoading,
    connect,
    disconnect,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    setBackgroundEffect,
    setIsHost,
  }

  return (
    <TwilioVideoContext.Provider value={value}>
      {children}
    </TwilioVideoContext.Provider>
  )
}
