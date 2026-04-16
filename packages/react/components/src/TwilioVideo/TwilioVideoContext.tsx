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

export const SCREEN_SHARE_TRACK_NAME = 'screen-share'

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
}

export interface TwilioVideoActions {
  connect: (token: string, roomName: string) => Promise<void>
  disconnect: () => void
  toggleVideo: () => Promise<void>
  toggleAudio: () => void
  toggleScreenShare: () => Promise<void>
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

  const localTracksRef = useRef<(LocalVideoTrack | LocalAudioTrack)[]>([])

  const connect = useCallback(async (token: string, roomName: string) => {
    setIsConnecting(true)
    setError(null)

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
  }, [localScreenTrack, room])

  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      stopScreenShare()
      return
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      const mediaStreamTrack = stream.getVideoTracks()[0]
      const screenTrack = new LocalVideoTrack(mediaStreamTrack, { name: SCREEN_SHARE_TRACK_NAME })

      if (room) {
        await room.localParticipant.publishTrack(screenTrack)
      }

      localTracksRef.current.push(screenTrack)
      setLocalScreenTrack(screenTrack)
      setIsScreenSharing(true)

      // Handle browser "Stop sharing" button
      mediaStreamTrack.onended = () => {
        if (room) {
          room.localParticipant.unpublishTrack(screenTrack)
        }
        screenTrack.stop()
        localTracksRef.current = localTracksRef.current.filter(t => t !== screenTrack)
        setLocalScreenTrack(null)
        setIsScreenSharing(false)
      }
    } catch (err) {
      // User cancelled the screen share picker — not an error
      console.log('Screen share cancelled or failed:', err)
    }
  }, [isScreenSharing, stopScreenShare, room])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
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
    connect,
    disconnect,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    setIsHost,
  }

  return (
    <TwilioVideoContext.Provider value={value}>
      {children}
    </TwilioVideoContext.Provider>
  )
}
