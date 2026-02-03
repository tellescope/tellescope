import { useCallback, useState } from 'react'
import { useResolvedSession, useSession } from '../authentication'
import { useCalendarEvents, useMeetings } from '../state'
import { useTwilioVideo } from './TwilioVideoContext'
import { CalendarEvent } from '@tellescope/types-client'
import { AttendeeInfo } from '@tellescope/types-models'

/**
 * Hook for hosts to start a Twilio Video call for a calendar event
 */
export const useStartTwilioVideoCall = (calendarEventId?: string) => {
  const session = useSession()
  const { connect, disconnect, setIsHost, room, isConnected } = useTwilioVideo()
  const [, { updateLocalElement: updateLocalEvent }] = useCalendarEvents()
  const [starting, setStarting] = useState(false)
  const [ending, setEnding] = useState(false)

  const startMeeting = useCallback(async (eventId?: string) => {
    const targetEventId = eventId || calendarEventId
    if (!targetEventId) {
      throw new Error('No calendar event ID provided')
    }

    setStarting(true)
    try {
      // Call backend to create Twilio room and get access token
      const response = await session.api.meetings.start_meeting_for_event({
        calendarEventId: targetEventId,
      })

      // Update local event with meetingId
      updateLocalEvent(targetEventId, { meetingId: response.id })

      // The host info contains the Twilio token (mapped to JoinToken field)
      const hostInfo = response.host.info as AttendeeInfo
      const roomName = response.meeting.Meeting.ExternalMeetingId || response.id

      setIsHost(true)
      await connect(hostInfo.JoinToken, roomName)

      return response.id
    } catch (err) {
      console.error('Failed to start Twilio meeting:', err)
      throw err
    } finally {
      setStarting(false)
    }
  }, [session, calendarEventId, connect, setIsHost, updateLocalEvent])

  const endMeeting = useCallback(async (meetingId: string) => {
    setEnding(true)
    try {
      await session.api.meetings.end_meeting({ id: meetingId })
      disconnect()
    } catch (err) {
      console.error('Failed to end Twilio meeting:', err)
      throw err
    } finally {
      setEnding(false)
    }
  }, [session, disconnect])

  return {
    starting,
    ending,
    room,
    isConnected,
    startMeeting,
    endMeeting,
  }
}

/**
 * Hook for participants to join a Twilio Video call
 */
export const useJoinTwilioVideoCall = () => {
  const session = useResolvedSession()
  const { connect, disconnect, room, isConnected } = useTwilioVideo()
  const [joining, setJoining] = useState(false)

  const joinMeeting = useCallback(async (calendarEventId: string) => {
    setJoining(true)
    try {
      // Call backend to get access token for the room
      const response = await session.api.meetings.join_meeting_for_event({
        calendarEventId,
      })

      const attendeeInfo = response.attendee.info as AttendeeInfo
      const roomName = response.meeting.Meeting.ExternalMeetingId || response.id

      await connect(attendeeInfo.JoinToken, roomName)
    } catch (err) {
      console.error('Failed to join Twilio meeting:', err)
      throw err
    } finally {
      setJoining(false)
    }
  }, [session, connect])

  const leaveMeeting = useCallback(() => {
    disconnect()
  }, [disconnect])

  return {
    joining,
    room,
    isConnected,
    joinMeeting,
    leaveMeeting,
  }
}

/**
 * Hook for calendar event-based Twilio Video calls
 * Combines start and join functionality with meeting status polling
 */
export const useTwilioMeetingForCalendarEvent = (calendarEventId: string) => {
  const session = useResolvedSession()
  const { room, isConnected } = useTwilioVideo()
  const { startMeeting, starting } = useStartTwilioVideoCall(calendarEventId)
  const { joinMeeting, joining } = useJoinTwilioVideoCall()
  const [, { findById: findEvent }] = useCalendarEvents()
  const [, { findById: findMeeting }] = useMeetings()

  const event = findEvent(calendarEventId)
  const meeting = event?.meetingId ? findMeeting(event.meetingId) : undefined

  const startAndJoinMeeting = useCallback(async () => {
    await startMeeting(calendarEventId)
  }, [startMeeting, calendarEventId])

  const join = useCallback(async () => {
    await joinMeeting(calendarEventId)
  }, [joinMeeting, calendarEventId])

  const isHost = session.userInfo.id === event?.creator

  return {
    event,
    meeting,
    room,
    isConnected,
    isHost,
    starting,
    joining,
    startAndJoinMeeting,
    joinMeeting: join,
    meetingStatus: (
      event?.videoIntegration !== 'Twilio'
        ? 'disabled'
        : !event?.meetingId
          ? 'waiting-room'
          : isConnected
            ? 'joined'
            : 'loading'
    ) as 'disabled' | 'waiting-room' | 'joined' | 'loading',
  }
}
