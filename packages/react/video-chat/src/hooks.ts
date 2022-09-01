import { useCallback, useContext } from "react"
import { useCalendarEvents, useResolvedSession, useSession } from "@tellescope/react-components"
import { useMeetingManager } from "amazon-chime-sdk-component-library-react"
import { CurrentCallContext, useCurrentCallContext } from "./index"
import { CalendarEvent, Meeting } from "@tellescope/types-client"

export const useStartAndJoinMeetingForCalendarEvent = (calendarEventId: string) => {
  const session = useSession()
  const [, { updateLocalElement: updateLocalEvent }] = useCalendarEvents()

  const meetingManager = useMeetingManager();

  const { setMeeting, setIsHost } = useContext(CurrentCallContext)
  if (!(!!setMeeting && setIsHost)) {
    throw new Error("Missing CurrentCallContext")
  }

  const startAndJoinMeeting = useCallback(async () => {
    const { meeting, host, id } = await session.api.meetings.start_meeting_for_event({ calendarEventId })

    updateLocalEvent(calendarEventId, { meetingId: id } )

    setMeeting(meeting as any)

    await meetingManager.join({ meetingInfo: meeting, attendeeInfo: host.info }); // Use the join API to create a meeting session
    await meetingManager.start(); // At this point you can let users setup their devices, or start the session immediately

    setMeeting(meeting.Meeting)
    setIsHost(true)
  }, [session, calendarEventId, updateLocalEvent, meetingManager, setMeeting, setIsHost])

  return {
    startAndJoinMeeting,
  }
}

export const useJoinMeeting = () => {
  const session = useResolvedSession()
  const meetingManager = useMeetingManager();

  const { setMeeting, setIsHost } = useContext(CurrentCallContext)
  if (!(!!setMeeting && setIsHost)) {
    throw new Error("Missing CurrentCallContext")
  }

  const joinMeeting = useCallback(async (meeting: Meeting) => {
    setMeeting(meeting.meetingInfo.Meeting)
    setIsHost(meeting.creator === session.userInfo.id)
    
    await meetingManager.join({ 
      meetingInfo: meeting.meetingInfo, 
      attendeeInfo: meeting.attendees.find(a => a.id === session.userInfo.id)!.info
    }); // Use the join API to create a meeting session
    await meetingManager.start(); // At this point you can let users setup their devices, or start the session immediately

  }, [setMeeting, meetingManager, setMeeting, setIsHost])

  return {
    joinMeeting,
  }
}

export const useMeetingForCalendarEvent = (event: CalendarEvent) => {
  const { meeting } = useCurrentCallContext()
  const { startAndJoinMeeting } = useStartAndJoinMeetingForCalendarEvent(event.id)
  const { joinMeeting } = useJoinMeeting()

  return {
    startAndJoinMeeting,
    joinMeeting,
    meeting,
    meetingStatus: (
      !event.enableVideoCall 
        ? 'disabled'
    : !(event.meetingId)
        ? 'waiting-room'
    : !!meeting
        ? 'joined'
        : 'loading'

    )
  }
} 