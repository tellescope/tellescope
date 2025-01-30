import React from "react";
import { Styled } from "@tellescope/react-components";
import { Meeting, MeetingInfo } from '@tellescope/types-models';
import { VideoTileGrid } from 'amazon-chime-sdk-component-library-react';
import { VideoCallNativeProps } from "./index";
import { VideoProps, VideoViewProps, JoinVideoCallReturnType, StartVideoCallReturnType, JoinVideoCallProps } from "./video_shared";
import { CalendarEvent } from "@tellescope/types-client";
export declare const useMeetingForCalendarEvent: (event: CalendarEvent) => {
    startAndJoinMeeting: () => Promise<void>;
    joinMeeting: (meeting: Meeting) => Promise<void>;
    meeting: MeetingInfo | undefined;
    meetingStatus: string;
};
export declare const useStartAndJoinMeetingForCalendarEvent: (calendarEventId: string) => {
    startAndJoinMeeting: () => Promise<void>;
};
export declare const useJoinMeeting: () => {
    joinMeeting: (meeting: Meeting) => Promise<void>;
};
export declare const WithVideo: ({ children }: VideoProps) => JSX.Element;
export declare const useStartVideoCall: () => StartVideoCallReturnType;
export declare const useJoinVideoCall: (props?: JoinVideoCallProps) => JoinVideoCallReturnType;
export declare const SelfView: ({ style }: VideoViewProps) => JSX.Element;
export declare const useRemoteViews: (props?: VideoViewProps) => JSX.Element[];
export declare const LocalPreview: ({ style }: Styled) => JSX.Element;
export { VideoTileGrid };
export declare const VideoCallNative: React.JSXElementConstructor<VideoCallNativeProps>;
export declare const ScreenShareIcon: () => JSX.Element;
export declare const BlurToggleIcon: () => JSX.Element;
export declare const ToggleBackgroundImageButton: () => JSX.Element;
//# sourceMappingURL=video.d.ts.map