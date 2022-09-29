import React, { CSSProperties, useCallback, useEffect, useState } from "react"

import {
  AttendeeInfo,
  MeetingInfo,
} from '@tellescope/types-models'
import {
  CalendarEvent,
  Enduser,
  User,
} from '@tellescope/types-client'

import {
  APIError,
  UserIdentity,
} from '@tellescope/types-utilities'

import {
  UserAndEnduserSelectorProps,
  useMeetings,
  UserAndEnduserSelector,
  useCalendarEvents,
  Flex,
  Typography,
  LoadingButton,
  useResolvedSession,
  Button,
} from "@tellescope/react-components"
import { LocalPreview, useJoinVideoCall, useStartAndJoinMeetingForCalendarEvent } from "./video"

export type AttendeeDisplayInfo =  { attendeeId: string, externalUserId: string }
export interface CallContext {
  meeting: MeetingInfo | undefined, setMeeting: (m: MeetingInfo | undefined) => void,
  videoIsEnabled: boolean, toggleVideo: () => Promise<void>,
  microphoneIsEnabled: boolean, toggleMicrophone: () => Promise<void>,
  attendees: AttendeeDisplayInfo[], shareScreenId: number | null,
  localTileId: number | null,
  isHost: boolean, setIsHost: (b: boolean) => void;
  videoTiles: (number)[],
  // leaveMeeting: () => void,
}

export const CurrentCallContext = React.createContext({} as CallContext)

export const useCurrentCallContext = () => {
  return React.useContext(CurrentCallContext)
}

export interface VideoProps {
  children?: React.ReactNode,
}

export interface VideoViewProps {
  style?: CSSProperties,
}

export interface JoinVideoCallProps {
  onCallEnd?: () => void;
}
export interface JoinVideoCallReturnType {
  meeting: CallContext['meeting'], 
  videoIsEnabled: CallContext['videoIsEnabled'], 
  toggleVideo: CallContext['toggleVideo'], 
  leaveMeeting: () => void,
  joinMeeting: (meetingInfo: { Meeting: MeetingInfo } | string, attendeeInfo?: { Attendee: AttendeeInfo }) => Promise<void>,
}

export interface StartVideoCallReturnType {
  starting: boolean, 
  ending: boolean, 
  meeting: CallContext['meeting'],
  videoIsEnabled: CallContext['videoIsEnabled'], 
  toggleVideo: CallContext['toggleVideo'], 
  createAndStartMeeting: (initialAttendees?: UserIdentity[]) => Promise<string>, 
  addAttendees: (attendees: UserIdentity[]) => Promise<void>, 
  endMeeting: () => Promise<void>,
}

export interface CreateCalendarEventForAttendeesProps extends Omit<UserAndEnduserSelectorProps, 'onSelect'> {
  onSuccess?: (c: CalendarEvent) => void,
  onError?: (e: APIError) => void,
  eventProps?: Pick<CalendarEvent, 'startTimeInMS' | 'durationInMinutes' | 'title'>
}
export const CreateCalendarEventForAttendees = ({ 
  onSuccess, 
  onError, 
  eventProps,
  ...props 
} : CreateCalendarEventForAttendeesProps) => {
  const [, { createElement: createEvent }] = useCalendarEvents({ dontFetch: true })
  const [eventTitle, /*setEventTitle*/] = useState(eventProps?.title ?? 'Video Call')
  const session = useResolvedSession()

  const handleCreateRoom = useCallback(({ users, endusers }: { users: User[], endusers: Enduser[] }) => {
    const userIds = users.map(u => u.id)
    const enduserIds = endusers.map(e => e.id)

    createEvent({
      title: eventTitle,
      attendees: ([
        ...userIds.map(id => ({ type: 'user', id } as UserIdentity)),
        ...enduserIds.map(id => ({ type: 'enduser', id } as UserIdentity)),
      ]),
      startTimeInMS: eventProps?.startTimeInMS ?? Date.now(),
      durationInMinutes: eventProps?.durationInMinutes || 30,
      enableVideoCall: true,
    })
    .then(r => {
      onSuccess?.(r)
    })
    .catch(onError)
  }, [session, onSuccess, onError])
  
  return (
    <UserAndEnduserSelector {...props} onSelect={handleCreateRoom} />
  )
}

export type WaitingRoomProps = {
  calendarEvent: CalendarEvent,
  onGoBack?: () => void,
}
interface WaitingRoomResolvedProps extends WaitingRoomProps {
  join: (meetingInfo: { Meeting: MeetingInfo } | string, attendeeInfo?: { Attendee: AttendeeInfo }) => Promise<void>,
  start?: () => void,
}
const WaitingRoomShared = ({ calendarEvent, join, start, onGoBack }: WaitingRoomResolvedProps) => {
  const session = useResolvedSession()
  const [, { findById: findEvent }] = useCalendarEvents()
  const [, { findById: findMeeting }] = useMeetings()

  const tsMeeting = findMeeting(calendarEvent?.meetingId ?? '')

  // poll to check for started meeting
  useEffect(() => { 
    const t = setInterval(() => {
      const event = findEvent(calendarEvent.id, { reload: true })
      findMeeting(event?.meetingId ?? '', { reload: true }) // reloads tsMeeting
    }, 2500)
    
    return () => { clearInterval(t) }
  }, [calendarEvent, findMeeting, findEvent])

  const meetingIsStarted = tsMeeting?.status === 'live'
  const isHost = session.userInfo.id === calendarEvent?.creator

  return (
    <Flex flex={1} column alignItems="center" justifyContent="center">
      <Typography style={{ fontSize: 20, fontWeight: 'bold' }}>
        {calendarEvent.title}
      </Typography>

      <Typography style={{ marginBottom: 15 }}>
        Waiting Room
      </Typography>

      <LocalPreview />

      <LoadingButton variant="contained" 
        disabled={
           (!meetingIsStarted && !isHost)
        || (!meetingIsStarted && !start)
        || (meetingIsStarted && !tsMeeting)
        }
        onClick={
          meetingIsStarted 
            ? () => join(tsMeeting.id) 
            : start
        } 
        submitText={
          meetingIsStarted ? "Join Meeting" : "Start Meeting" 
        }
        submittingText={
          meetingIsStarted ? "Joining" : "Starting"
        }
        style={{
          marginTop: 15,
        }} 
      />

      {onGoBack && 
        <Button onClick={onGoBack} style={{ width: '100%' }}>
          Back
        </Button>
      }

      {!meetingIsStarted && !isHost && 
        <Typography style={{ marginTop: 5 }}>
          Waiting for the host to start the meeting 
        </Typography>
      }   
    </Flex>
  )
}

// Only users can start meeting, avoid using useStartAndJoin... hook as enduser
const WaitingRoomUser = (props : WaitingRoomProps) => {
  const { startAndJoinMeeting } = useStartAndJoinMeetingForCalendarEvent(props.calendarEvent.id)
  const { joinMeeting } = useJoinVideoCall()

  return <WaitingRoomShared {...props} start={startAndJoinMeeting} join={joinMeeting} />
}

const WaitingRoomEnduser = (props : WaitingRoomProps) => {
  const { joinMeeting } = useJoinVideoCall()
  return <WaitingRoomShared {...props} join={joinMeeting} />
}

export const WaitingRoom = (props: WaitingRoomProps) => {
  const session = useResolvedSession()
  const Component = session.type === 'user' ? WaitingRoomUser : WaitingRoomEnduser

  return <Component {...props} />
}

export interface VideoCallNativeProps {
  onLeave?: () => void,
}