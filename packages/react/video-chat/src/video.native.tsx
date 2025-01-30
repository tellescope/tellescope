// logic pulled + refactored from 
// https://github.com/aws-samples/amazon-chime-react-native-demo/blob/master/src/containers/Meeting.js
// which includes the following copyright disclaimer
/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */

import React, { useCallback, useContext, useEffect, useState } from "react"
import { StyleSheet } from "react-native"
import {
  AttendeeInfo,
  MeetingInfo,
} from '@tellescope/types-models'
import {
  UserIdentity,
} from '@tellescope/types-utilities'
import { 
  useResolvedSession, 
  useSession,
  Flex,
  useCalendarEvents,
  useMeetings,
} from "@tellescope/react-components"
import { 
  convert_CSS_to_RNStyles, // requires mui.native
} from "@tellescope/react-components/lib/esm/mui.native"

import {
  JoinVideoCallReturnType,
  StartVideoCallReturnType,
  VideoProps,
  AttendeeDisplayInfo,
  VideoViewProps,
  VideoCallNativeProps,
} from "./video_shared"
import {
  CurrentCallContext,
  RNVideoRenderView,
  getSDKEventEmitter,
  MobileSDKEvent,
  NativeFunction,
  ControlBar,
} from "./index.native"
// import RNSwitchAudioOutput from 'react-native-switch-audio-output';

interface TileState {
  isLocal: boolean,
  isScreenShare: boolean,
  tileId: number,
}

export const WithVideo = ({ children } : VideoProps) => {
  const [meeting, setMeeting] = useState(undefined as MeetingInfo | undefined)
  const [isHost, setIsHost] = useState(false)

  const [inMeeting, setInMeeting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [muted, setMuted] = useState(false)
  const [videoIsEnabled, setVideoIsEnabled] = useState(false)
  const [videoTiles, setVideoTiles] = useState([] as number[])
  const [localTileId, setLocalTileId] = useState(null as number | null)
  const [screenShareTile, setScreenShareTile] = useState(null as number | null)
  const [attendees, setAttendees] = useState ([] as AttendeeDisplayInfo[])

  const resetState = () => {
    setMeeting(undefined)
    setIsHost(false)
    setMuted(false)
    setVideoIsEnabled(false)
    setVideoTiles([])
    setLocalTileId(null)
    setScreenShareTile(null)
    setAttendees([])
  }

  const toggleVideo = async () => {
    NativeFunction.setCameraOn(!videoIsEnabled)
    if (videoIsEnabled) {
      setLocalTileId(null)
    }
    setVideoIsEnabled(v => !v)
  }
  const toggleMic = async () => {
    NativeFunction.setMute(!muted)
    setMuted(m => !m)
  }
  const emitter = getSDKEventEmitter()

  useEffect(() => { 
    const startSubscription = emitter.addListener(MobileSDKEvent.OnMeetingStart, () => {
      setInMeeting(true)
      setIsLoading(false)
    });

    // called when user clicks Leave Meeting or meeting is ended by host
    const endSubscription = emitter.addListener(MobileSDKEvent.OnMeetingEnd, a => {
      resetState()
    });

    const joinSubscription = emitter.addListener(MobileSDKEvent.OnAttendeesJoin, (added: { attendeeId: string, externalUserId: string }) => {
      const { attendeeId, externalUserId } = added
      setAttendees(as => !as.find(a => a.attendeeId === attendeeId) 
        ? [{ attendeeId, externalUserId, muted: false }, ...as] 
        : as
      )
    });

    const leaveSubscription = emitter.addListener(MobileSDKEvent.OnAttendeesLeave, (leaving: { attendeeId: string }) => {
      const { attendeeId } = leaving
      setAttendees(as => as.filter(a => a.attendeeId !== attendeeId))
    });

    const errorSubscription = emitter.addListener(MobileSDKEvent.OnError, (message) => {
      console.error("SDK Error in errorSubscription", message);
    });

    const muteSubscription = emitter.addListener(MobileSDKEvent.OnAttendeesMute, attendeeId => {
      setAttendees(as => as.map(a => a.attendeeId === attendeeId ? { ...a, muted: true } : a))
    });

    const unmuteSubscription = emitter.addListener(MobileSDKEvent.OnAttendeesUnmute, attendeeId => {
      setAttendees(as => as.map(a => a.attendeeId === attendeeId ? { ...a, muted: false } : a))
    });

    const addVideoSubscription = emitter.addListener(MobileSDKEvent.OnAddVideoTile, (tileState: TileState) => {
      if (tileState.isScreenShare) {
        setScreenShareTile(tileState.tileId)
        return
      }
      if (tileState.isLocal) {
        setLocalTileId(tileState.tileId)
      }
      setVideoTiles(v => [...v, tileState.tileId])
      setVideoIsEnabled(v => tileState.isLocal ? true : v)
    });

    const removeVideoSubscription = emitter.addListener(MobileSDKEvent.OnRemoveVideoTile, (tileState: TileState) => {
      if (tileState.isScreenShare) {
        setScreenShareTile(null)
        return
      }
      setVideoTiles(vs => vs.filter(v => v !== tileState.tileId))
      setVideoIsEnabled(v => tileState.isLocal ? false : v)
    });

    // clean up any old meetings when the context is loaded
    NativeFunction.stopMeeting()

    return () => {
      startSubscription.remove();
      endSubscription.remove();
      errorSubscription.remove();
      joinSubscription.remove();
      leaveSubscription.remove();
      muteSubscription.remove();
      unmuteSubscription.remove();
      addVideoSubscription.remove();
      removeVideoSubscription.remove();
    }
  }, [emitter]) 

  return (
    <CurrentCallContext.Provider value={{ 
      isHost, setIsHost,
      attendees, 
      localTileId,
      videoTiles, 
      meeting, 
      shareScreenId: screenShareTile, 
      setMeeting, 
      videoIsEnabled, 
      toggleVideo, 
      microphoneIsEnabled: !muted,
      toggleMicrophone: toggleMic,
    }}>
      {children}
    </CurrentCallContext.Provider>
  )
}


export const useRemoteViews = (props={} as { style: React.CSSProperties }) => {
  const { localTileId, videoTiles } = React.useContext(CurrentCallContext)
  const nonLocal = videoTiles.filter(v => v !== localTileId)

  return nonLocal.map(tileId => 
    <RNVideoRenderView key={tileId} style={convert_CSS_to_RNStyles(props.style) ?? styles.video} tileId={tileId} />
  )
}

export const SelfView = ({ style } : VideoViewProps) => {
  const { localTileId } = React.useContext(CurrentCallContext)
  if (localTileId === null) return null // localTileId may be zero, don't return null on simple falsey check
  
  return (
    <RNVideoRenderView style={convert_CSS_to_RNStyles(style) ?? styles.video} tileId={localTileId} />
  )
}

export const useStartVideoCall = (): StartVideoCallReturnType => {
  const session = useSession()
  const { meeting, setMeeting, setIsHost, videoIsEnabled, toggleVideo } = React.useContext(CurrentCallContext)

  const [, { updateLocalElement: updateLocalMeeting }] = useMeetings({ dontFetch: true })

  const [starting, setStarting] = useState(false)
  const [ending, setEnding] = useState(false)

  const createAndStartMeeting = async (initialAttendees?: UserIdentity[]) => {
    setStarting(true)
    try {
      const { id, meeting, host } = await session.api.meetings.start_meeting({ attendees: initialAttendees })
      await NativeFunction.startMeeting(meeting.Meeting, host.info)

      setMeeting(meeting.Meeting)
      setIsHost(true)

      return id
    } catch(err) {
      console.error(err)
      throw err
    } finally {
      setStarting(false)
    }
  }

  const addAttendees = useCallback(async (attendees: UserIdentity[]) => {
    if (!meeting) return
    await session.api.meetings.add_attendees_to_meeting({ id: meeting?.ExternalMeetingId, attendees }) 
  }, [session, meeting])

  const endMeeting = async () => {
    if (!meeting) return
    setEnding(true)

    try {
      await session.api.meetings.end_meeting({ id: meeting.ExternalMeetingId })

      updateLocalMeeting(meeting.ExternalMeetingId, { 
        status: 'ended',
        // @ts-ignore
        endedAt: new Date().toString(), 
      })
    } catch(err) { console.error(err) }

    NativeFunction.stopMeeting()
  }

  return { 
    meeting, 
    videoIsEnabled, 
    starting, 
    ending, 
    toggleVideo, 
    createAndStartMeeting, 
    addAttendees, 
    endMeeting,
  }
}

export const useStartAndJoinMeetingForCalendarEvent = (calendarEventId: string) => {
  const session = useSession()
  const [, { updateLocalElement: updateLocalEvent }] = useCalendarEvents()

  const { setMeeting, setIsHost } = useContext(CurrentCallContext)
  if (!(!!setMeeting && setIsHost)) {
    throw new Error("Missing CurrentCallContext")
  }

  const startAndJoinMeeting = useCallback(async () => {
    const { meeting, host, id } = await session.api.meetings.start_meeting_for_event({ calendarEventId })

    updateLocalEvent(calendarEventId, { meetingId: id } )

    await NativeFunction.startMeeting(meeting.Meeting, host.info)

    setMeeting(meeting.Meeting)
    setIsHost(true)
  }, [session, setMeeting, setIsHost, updateLocalEvent])

  return {
    startAndJoinMeeting,
  }
}

export const useJoinVideoCall = (): JoinVideoCallReturnType => {
  const session = useResolvedSession()
  const { meeting, setIsHost, setMeeting, videoIsEnabled, toggleVideo } = React.useContext(CurrentCallContext)

  const joinMeeting = async (meetingInfo: string | { Meeting: MeetingInfo }, attendeeInfo?: { Attendee: AttendeeInfo }) => {
    let isHost = false
    if (typeof meetingInfo == 'string') {
      const meetings = await session.api.meetings.my_meetings()
      const meeting = meetings.find(m => m.id === meetingInfo)
      meetingInfo = meeting?.meetingInfo as { Meeting: MeetingInfo }
      attendeeInfo = { Attendee: meeting?.attendees.find?.(a => a.id === session.userInfo.id)?.info as AttendeeInfo}

      if (attendeeInfo.Attendee.ExternalUserId === meeting?.creator) {
        isHost = true
      }
    }

    if (!meetingInfo || typeof meetingInfo === 'string' || !attendeeInfo) return

    try {
      await NativeFunction.startMeeting(meetingInfo.Meeting ?? meetingInfo, attendeeInfo.Attendee ?? attendeeInfo)
    } catch(err) {
      await NativeFunction.startMeeting(meetingInfo.Meeting ?? meetingInfo, attendeeInfo.Attendee ?? attendeeInfo)
    }

    setMeeting(meetingInfo.Meeting ?? meetingInfo)
    setIsHost(isHost)
  }

  const leaveMeeting = () => {
    NativeFunction.stopMeeting()
    // setMeeting(undefined)
  }

  return { meeting, videoIsEnabled, toggleVideo, joinMeeting, leaveMeeting }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: '700'
  },
  subtitle: {
    marginBottom: 25,
    marginTop: 10,
    color: 'grey' 
  },
  videoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    height: '95%',
    // This is an existing React Native issue:
    // When you create a native android component
    // that use GLSurfaceView (We use this internally), the entire screen will
    // black out
    overflow: 'hidden'
  },
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  screenShare: {
    width: '90%',
    margin: '1%',
    aspectRatio: 16 / 9,
  },
  attendeeList: {
    flex: 1,
    width: '80%'
  },
  attendeeContainer: {
    fontSize: 20,
    margin: 5,
    padding: 5,
    height: 30,
    backgroundColor: '#eee',
    justifyContent: 'space-between', 
    flexDirection: 'row',  
  },
  attendeeMuteImage: {
    resizeMode: 'contain',
    width: 20,
    height: 20
  },
  inputBox: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    margin: 5,
    width: '50%',
    padding: 10,
    color: 'black'
  },
  meetingButton: {
    resizeMode: 'contain',
    width: 50,
    height: 50
  }
});

export const LocalPreview = () => {
  // console.error("LocalPreview unimplemented for Native")
  return null
}

const get_video_styles = (count: number): React.CSSProperties => {
  return ({
    borderWidth: '1px',
    borderColor: '#888888',
    borderRadius: 5,
    padding: 5,
    width: count === 1 ? '100%' : '50%',
    maxHeight: (
      count <= 4
        ? '50%'
    : count <= 8
        ? '25%'
        : '20%'
    ),
    backgroundColor: '#bbbbbb'
  })
}
export const VideoCallNative: React.JSXElementConstructor<VideoCallNativeProps> = ({
  ...props
}) => {
  const remoteViews = useRemoteViews()
  // RNSwitchAudioOutput.selectAudioOutput(RNSwitchAudioOutput.AUDIO_SPEAKER)
  const selfView = (
    <SelfView 
      // style={{ 
      //   position: 'absolute', 
      //   zIndex: '100', 
      //   borderRadius: 100, 
      //   width: 130, 
      //   height: 130, 
      //   bottom: 120, 
      //   right: 25 
      // }} 
    />
  )

  const style = get_video_styles(remoteViews.length + 1)
  
  return (
    <Flex column flex={1} style={{ }}>
      <Flex flex={1} style={{ marginBottom: 75 }}>

        {remoteViews.map((view, i) => (
          <Flex key={i} alignItems="center" justifyContent="center" style={style}>
            {view}
          </Flex>
        ))}

        <Flex alignItems="center" justifyContent="center" style={style}>
          {selfView}
        </Flex>

      </Flex>

      <ControlBar {...props} size={50} spacing={20} style={{ position: 'absolute', bottom: 20, width: '100%' }} />
    </Flex>
  )
}

export const ScreenShareIcon = () => null