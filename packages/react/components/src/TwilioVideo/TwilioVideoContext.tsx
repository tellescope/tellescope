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

export interface TwilioVideoState {
  room: Room | null
  isConnecting: boolean
  isConnected: boolean
  localVideoTrack: LocalVideoTrack | null
  localAudioTrack: LocalAudioTrack | null
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

      newRoom.on('disconnected', () => {
        // Stop all local tracks when disconnected
        localTracksRef.current.forEach(track => {
          track.stop()
        })
        localTracksRef.current = []
        setRoom(null)
        setLocalVideoTrack(null)
        setLocalAudioTrack(null)
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
    participants,
    error,
    isHost,
    isVideoEnabled,
    isAudioEnabled,
    connect,
    disconnect,
    toggleVideo,
    toggleAudio,
    setIsHost,
  }

  return (
    <TwilioVideoContext.Provider value={value}>
      {children}
    </TwilioVideoContext.Provider>
  )
}
