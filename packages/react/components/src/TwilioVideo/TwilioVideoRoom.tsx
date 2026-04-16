import React from 'react'
import { Box, Grid } from '@mui/material'
import { useTwilioVideo } from './TwilioVideoContext'
import { TwilioParticipant } from './TwilioParticipant'
import { TwilioControlBar } from './TwilioControls'
import { RemoteParticipant, LocalParticipant } from 'twilio-video'

export interface TwilioVideoRoomProps {
  onLeave?: () => void
  onEndForAll?: () => void
  style?: React.CSSProperties
  /** Resolve participant identity to a display label. Defaults to empty string. */
  resolveIdentity?: (identity: string) => string
  /** Whether to show the screen share button. Defaults to true. */
  showScreenShare?: boolean
}

export const TwilioVideoRoom: React.FC<TwilioVideoRoomProps> = ({
  onLeave,
  onEndForAll,
  style,
  resolveIdentity,
  showScreenShare: showScreenShareProp = true,
}) => {
  const { room, participants, isScreenSharing, screenSharingParticipantSid } = useTwilioVideo()

  if (!room) return null

  const localParticipant = room.localParticipant
  const hasRemoteParticipants = participants.length > 0

  // Find who is sharing their screen (context-driven so React re-renders properly)
  const screenShareParticipant: RemoteParticipant | LocalParticipant | null = (() => {
    if (isScreenSharing) return localParticipant
    if (screenSharingParticipantSid) {
      return participants.find(p => p.sid === screenSharingParticipantSid) || null
    }
    return null
  })()

  const isScreenShareActive = screenShareParticipant !== null

  // All participants for the camera strip (local + remote)
  const allParticipants: (RemoteParticipant | LocalParticipant)[] = [
    localParticipant,
    ...participants,
  ]

  if (isScreenShareActive) {
    // Presentation layout: screen share large on top, camera strip on bottom
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          backgroundColor: '#1a1a1a',
          ...style,
        }}
      >
        {/* Screen share - main area */}
        <Box
          sx={{
            flex: 1,
            overflow: 'hidden',
            minHeight: 0,
          }}
        >
          <TwilioParticipant
            participant={screenShareParticipant}
            isLocal={screenShareParticipant === localParticipant}
            showScreenShare
            resolveIdentity={resolveIdentity}
          />
        </Box>

        {/* Camera strip */}
        <Box
          sx={{
            height: 120,
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
            padding: 1,
            overflowX: 'auto',
            flexShrink: 0,
          }}
        >
          {allParticipants.map((p) => (
            <Box
              key={p.sid}
              sx={{
                height: '100%',
                aspectRatio: '4/3',
                flexShrink: 0,
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <TwilioParticipant
                participant={p}
                isLocal={p === localParticipant}
                showScreenShare={false}
                resolveIdentity={resolveIdentity}
              />
            </Box>
          ))}
        </Box>

        {/* Control bar */}
        <TwilioControlBar onLeave={onLeave} onEndForAll={onEndForAll} showScreenShare={showScreenShareProp} />
      </Box>
    )
  }

  // Normal layout (no screen share active)
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        backgroundColor: '#1a1a1a',
        ...style,
      }}
    >
      {/* Video grid */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Remote participants */}
        {hasRemoteParticipants ? (
          <Grid
            container
            sx={{
              height: '100%',
              width: '100%',
            }}
          >
            {participants.map((participant) => (
              <Grid
                item
                key={participant.sid}
                xs={participants.length === 1 ? 12 : 6}
                sx={{ height: participants.length <= 2 ? '100%' : '50%' }}
              >
                <TwilioParticipant participant={participant} resolveIdentity={resolveIdentity} />
              </Grid>
            ))}
          </Grid>
        ) : (
          // When alone, show local video larger
          <Box sx={{ height: '100%', width: '100%' }}>
            <TwilioParticipant participant={localParticipant} isLocal resolveIdentity={resolveIdentity} />
          </Box>
        )}

        {/* Local participant (small, corner) - only when there are remote participants */}
        {hasRemoteParticipants && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 200,
              height: 150,
              zIndex: 10,
              borderRadius: 1,
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            <TwilioParticipant participant={localParticipant} isLocal resolveIdentity={resolveIdentity} />
          </Box>
        )}
      </Box>

      {/* Control bar */}
      <TwilioControlBar onLeave={onLeave} onEndForAll={onEndForAll} showScreenShare={showScreenShareProp} />
    </Box>
  )
}
