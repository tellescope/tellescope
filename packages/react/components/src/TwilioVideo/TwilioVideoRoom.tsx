import React from 'react'
import { Box, Grid } from '@mui/material'
import { useTwilioVideo } from './TwilioVideoContext'
import { TwilioParticipant } from './TwilioParticipant'
import { TwilioControlBar } from './TwilioControls'

export interface TwilioVideoRoomProps {
  onLeave?: () => void
  onEndForAll?: () => void
  style?: React.CSSProperties
  /** Resolve participant identity to a display label. Defaults to empty string. */
  resolveIdentity?: (identity: string) => string
}

export const TwilioVideoRoom: React.FC<TwilioVideoRoomProps> = ({
  onLeave,
  onEndForAll,
  style,
  resolveIdentity,
}) => {
  const { room, participants } = useTwilioVideo()

  if (!room) return null

  const localParticipant = room.localParticipant
  const hasRemoteParticipants = participants.length > 0

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
      <TwilioControlBar onLeave={onLeave} onEndForAll={onEndForAll} />
    </Box>
  )
}
