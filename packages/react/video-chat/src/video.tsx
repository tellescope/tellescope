import React, { useCallback, useContext, useState, useEffect } from "react"

import {
  useResolvedSession,
  useSession,
  Styled,
} from "@tellescope/react-components"

import {
  UserIdentity,
} from "@tellescope/types-utilities"
import {
  AttendeeInfo,
  Meeting,
  MeetingInfo,
} from '@tellescope/types-models'


import { ThemeProvider } from 'styled-components';
import {
  MeetingProvider,
  darkTheme,
  useContentShareState,
  // LocalVideo,
  VideoTileGrid,
  // VideoGrid,
  // VideoTile,
  // PreviewVideo,
  RemoteVideo,
  // useAttendeeAudioStatus,
  LocalVideo,
  useLocalVideo,
  useMeetingManager,
  useRosterState,
  useRemoteVideoTileState,
  useToggleLocalMute,
  useMeetingStatus,
  MeetingStatus,
  ContentShareControl,
  VideoInputBackgroundBlurControl,
  // CameraSelection,
  useVideoInputs,
  useBackgroundReplacement,
  useAudioVideo,
  // useRemoteVideoTileState,
  // useContentShareControls, // screen sharing
} from 'amazon-chime-sdk-component-library-react';
import {
  CurrentCallContext, 
  VideoCallNativeProps,
} from "./index"
import {
  AttendeeDisplayInfo,
  VideoProps,
  VideoViewProps,
  JoinVideoCallReturnType,
  StartVideoCallReturnType,
  JoinVideoCallProps,
} from "./video_shared"
import { ConsoleLogger, DefaultDeviceController, isVideoTransformDevice, Logger, LogLevel, MeetingSessionConfiguration } from "amazon-chime-sdk-js";

import { useCalendarEvents } from "@tellescope/react-components"
import { useCurrentCallContext } from "./index"
import { CalendarEvent } from "@tellescope/types-client";

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

    const meetingSessionConfiguration = new MeetingSessionConfiguration(
      meeting,
      host.info,
    );
    await meetingManager.join(meetingSessionConfiguration); // Use the join API to create a meeting session
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
    let attendeeInfo = meeting.attendees.find(a => a.id === session.userInfo.id)?.info
    if (!attendeeInfo) {
      const calendarEventId = meeting.calendarEventId
      if (calendarEventId) {
        const result = await session.api.meetings.join_meeting_for_event({ calendarEventId })

        attendeeInfo = result.attendee.info
      }

      if (!attendeeInfo) {
        console.error("Could not find attendee info for joining meeting and failed to join")
        return
      }      
    }

    const meetingSessionConfiguration = new MeetingSessionConfiguration(
      meeting.meetingInfo,
      attendeeInfo
    );
    await meetingManager.join(meetingSessionConfiguration); // Use the join API to create a meeting session
    await meetingManager.start(); // At this point you can let users setup their devices, or start the session immediately

    setMeeting(meeting.meetingInfo.Meeting)
    setIsHost(meeting.creator === session.userInfo.id)
  }, [setMeeting, meetingManager, setMeeting, setIsHost])

  return {
    joinMeeting,
  }
}

const useHandleDataMessages = () => {
  try {
    const session = useResolvedSession()
    const audioVideo = useAudioVideo()
    const { muted, toggleMute } = useToggleLocalMute()
    
    useEffect(() => {
      if (!audioVideo) {
        return;
      }
  
      audioVideo.realtimeSubscribeToReceiveDataMessage('Message', (data) => {
        const message = (data && data.json()) || {};
  
        if (message.type === 'mute' && message.userId === session.userInfo.id && !muted) {
          toggleMute()
        }
      });
  
      return () => {
        audioVideo.realtimeUnsubscribeFromReceiveDataMessage('Message');
      }
    }, [audioVideo, muted, toggleMute, session.userInfo?.id])
  } catch(err) {
    console.error(err)
  }
}

const WithContext = ({ children } : { children: React.ReactNode }) => {
  const [meeting, setMeeting] = useState(undefined as MeetingInfo | undefined)
  const [isHost, setIsHost] = useState(false)
  const { toggleVideo, isVideoEnabled: videoIsEnabled, tileId: localTileId } = useLocalVideo();
  const { roster } = useRosterState()
  const { tileId } = useContentShareState()
  const { tiles } = useRemoteVideoTileState()
  const { muted, toggleMute } = useToggleLocalMute()
  useHandleDataMessages()

  const attendees = [] as AttendeeDisplayInfo[]
  for (const attendeeId in roster) {
    const { externalUserId } = roster[attendeeId]
    attendees.push({ attendeeId, externalUserId: externalUserId as string })
  }

  return (
    <CurrentCallContext.Provider value={{ 
      isHost, setIsHost,
      attendees, 
      localTileId,
      videoTiles: tiles, 
      shareScreenId: tileId, 
      meeting, 
      setMeeting, 
      videoIsEnabled, 
      toggleVideo, 
      microphoneIsEnabled: !muted,
      toggleMicrophone: async () => toggleMute(),
    }}>
      {children}
    </CurrentCallContext.Provider>
  )
}

// const load_image_blob = async () => (
//   (await fetch('https://pathtoimage.jpeg')).blob()
// )

// export const WithVideo = ({ children }: VideoProps) => {
//   const [imageBlob, setImageBlob] = useState<Blob>()

//   useEffect(() => {
//     load_image_blob()
//     .then(setImageBlob)
//     .catch(console.error)
//   }, [])

//   return (
//     <ThemeProvider theme={darkTheme}>
//     <BackgroundReplacementProvider options={{ imageBlob }}>
//     <MeetingProvider>
//     <WithContext>
//       {children}
//     </WithContext>
//     </MeetingProvider>
//     </BackgroundReplacementProvider>
//     </ThemeProvider>
//   )
// }

export const WithVideo = ({ children }: VideoProps) => (
  <ThemeProvider theme={darkTheme}>
  <MeetingProvider>
  <WithContext>
    {children}
  </WithContext>
  </MeetingProvider>
  </ThemeProvider>
)

export const useStartVideoCall = (): StartVideoCallReturnType  => {
  const [starting, setStarting] = useState(false)
  const [ending, setEnding] = useState(false)
  const { meeting, setMeeting, toggleVideo, videoIsEnabled, setIsHost } = React.useContext(CurrentCallContext)

  const session = useSession() // meetings can only be started by users, not endusers (for now)
  const meetingManager = useMeetingManager();

  const createAndStartMeeting = async (initialAttendees?: UserIdentity[]) => {
    setStarting(true)
    try {
      const { id, meeting, host } = await session.api.meetings.start_meeting({ attendees: initialAttendees })

      const meetingSessionConfiguration = new MeetingSessionConfiguration(
        meeting,
        host.info
      );
      await meetingManager.join(meetingSessionConfiguration); // Use the join API to create a meeting session
      await meetingManager.start(); // At this point you can let users setup their devices, or start the session immediately

      setMeeting(meeting.Meeting)
      setIsHost(true)
      return id
    } catch(err) {
      console.error(err)
      throw err
    }
    finally {
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
    } catch(err) { console.error(err) }

    setEnding(false)
    setMeeting(undefined)
  }

  return { starting, ending, meeting, videoIsEnabled, toggleVideo, createAndStartMeeting, addAttendees, endMeeting }
}

export const useJoinVideoCall = (props?: JoinVideoCallProps): JoinVideoCallReturnType  => {
  const { onCallEnd } = props ?? {}
  const session = useResolvedSession()
  const meetingManager = useMeetingManager();
  const { meeting, setMeeting, toggleVideo, videoIsEnabled } = React.useContext(CurrentCallContext)
  const status = useMeetingStatus()

  // meetingInfo may be meetingId as string
  const joinMeeting = async (meetingInfo: string | { Meeting: MeetingInfo }, attendeeInfo?: { Attendee: AttendeeInfo }) => {
    if (typeof meetingInfo == 'string') {
      const meetings = await session.api.meetings.my_meetings()
      const meeting = meetings.find(m => m.id === meetingInfo)
      meetingInfo = meeting?.meetingInfo as { Meeting: MeetingInfo }
      attendeeInfo = { Attendee: meeting?.attendees.find?.(a => a.id === session.userInfo.id)?.info as AttendeeInfo}
    }
    if (!meetingInfo || typeof meetingInfo === 'string' || !attendeeInfo) return

    
    const meetingSessionConfiguration = new MeetingSessionConfiguration(
      meetingInfo,
      attendeeInfo
    );
    await meetingManager.join(meetingSessionConfiguration); // Use the join API to create a meeting session
    await meetingManager.start(); // At this point you can let users setup their devices, or start the session immediately
    setMeeting(meetingInfo.Meeting)
  }

  const leaveMeeting = () => {
    if (meetingManager.audioVideo) {
      meetingManager.audioVideo.stop()

      // Stop local video tile (stops sharing the video tile in the meeting)
      meetingManager.audioVideo.stopLocalVideoTile();

      // Stop a video preview that was previously started (before session starts)
      // meetingManager.audioVideo.stopVideoPreviewForVideoInput(previewVideoElement);

      // Stop the meeting session (audio and video)
      meetingManager.audioVideo && meetingManager.audioVideo.stop() 
    }
    setMeeting(undefined)
  }

  useEffect(() => {
    if (!meeting) return
    if (status === MeetingStatus.Ended) {
      leaveMeeting()
      onCallEnd?.()
    }
  }, [meeting, status, leaveMeeting])

  return { meeting, videoIsEnabled: videoIsEnabled, toggleVideo, joinMeeting, leaveMeeting }
}

export const SelfView = ({ style }: VideoViewProps) => <div style={style}><LocalVideo/></div>

export const useRemoteViews = (props={} as VideoViewProps) => {
  const { localTileId, videoTiles } = React.useContext(CurrentCallContext)
  const nonLocal = videoTiles.filter(v => v !== localTileId)

  return nonLocal.map(tileId => 
    <RemoteVideo key={tileId} style={props.style} tileId={tileId} />
  )
}


class SwappableLogger implements Logger {
  constructor(public inner: Logger) {}
  debug(debugFunction: string | (() => string)): void {
    this.inner.debug(debugFunction);
  }

  info(msg: string): void {
    this.inner.info(msg);
  }

  error(msg: string): void {
    this.inner.error(msg);
  }

  warn(msg: string): void {
    this.inner.warn(msg);
  }

  setLogLevel(level: LogLevel): void {
    this.inner.setLogLevel(level);
  }

  getLogLevel(): LogLevel {
    return this.inner.getLogLevel();
  }
}

const PREVIEW_ELEMENT_ID = 'video-preview'
const defaultPreviewStyle = {
  width: 400,
  minHeight: 200,
  height: 'auto',
  maxHeight: 600,
  backgroundColor: '#f0f0f0'
}
export const LocalPreview = ({ style=defaultPreviewStyle }: Styled) => {
  useEffect(() => {
    const videoElement = document.getElementById(PREVIEW_ELEMENT_ID) as HTMLVideoElement;
    if (!videoElement) return

    const deviceController = new DefaultDeviceController(new SwappableLogger(new ConsoleLogger('SDK', LogLevel.WARN)), { enableWebAudio: true });

    //List the video device list
    deviceController.listVideoInputDevices()
    .then(deviceList => {
      //Choose video device
      deviceController.startVideoInput(deviceList[0].deviceId)
      .then(() => {
        deviceController.startVideoPreviewForVideoInput(videoElement)
      })
      .catch(console.error)
    })
    .catch(console.error)

    // disconnect camera 
    return () => {
      deviceController.destroy()
    }
  }, [])

  return (
    <>
    <video id={PREVIEW_ELEMENT_ID} style={style}/>
    </>
  )
}
export { VideoTileGrid }

// unimplemented for web
export const VideoCallNative: React.JSXElementConstructor<VideoCallNativeProps> = () => (
  null
)

export const ScreenShareIcon = () => (
  <ContentShareControl iconTitle="Screen Share" label="Share Screen" />
)

export const BlurToggleIcon = () => (
  <VideoInputBackgroundBlurControl />
)

export const ToggleBackgroundImageButton = () => {
  const meetingManager = useMeetingManager();
  const { selectedDevice } = useVideoInputs();
  const [isVideoTransformCheckBoxOn, setisVideoTransformCheckBoxOn] = useState(false);
  const { isBackgroundReplacementSupported, createBackgroundReplacementDevice } = useBackgroundReplacement();

  useEffect(() => {
    async function toggleBackgroundReplacement() {
      try {
        let current = selectedDevice;
        if (isVideoTransformCheckBoxOn) {
          current = await createBackgroundReplacementDevice(selectedDevice as any);
        } else {
          if (isVideoTransformDevice(selectedDevice)) {
            let intrinsicDevice = await selectedDevice.intrinsicDevice();
            selectedDevice.stop();
            current = intrinsicDevice;
          }
        }
        await meetingManager.startVideoInputDevice(current!);
      } catch (error) {
        // Handle device selection failure here
        console.error('Failed to toggle BackgroundReplacement');
      }
    }

    toggleBackgroundReplacement();
  }, [isVideoTransformCheckBoxOn]);

  const onClick = () => {
    setisVideoTransformCheckBoxOn((current) => !current);
  };

  return (
    <div>
      {isBackgroundReplacementSupported && (
        <button onClick={onClick}>
          {isVideoTransformDevice(selectedDevice)
            ? 'Background Replacement Enabled'
            : 'Enable Background Replacement'}
        </button>
      )}
    </div>
  );
};