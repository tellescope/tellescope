import React from "react";
import { JoinVideoCallReturnType, StartVideoCallReturnType, VideoProps, VideoViewProps, VideoCallNativeProps } from "./video_shared";
export declare const WithVideo: ({ children }: VideoProps) => JSX.Element;
export declare const useRemoteViews: (props?: {
    style: React.CSSProperties;
}) => JSX.Element[];
export declare const SelfView: ({ style }: VideoViewProps) => JSX.Element | null;
export declare const useStartVideoCall: () => StartVideoCallReturnType;
export declare const useStartAndJoinMeetingForCalendarEvent: (calendarEventId: string) => {
    startAndJoinMeeting: () => Promise<void>;
};
export declare const useJoinVideoCall: () => JoinVideoCallReturnType;
export declare const LocalPreview: () => null;
export declare const VideoCallNative: React.JSXElementConstructor<VideoCallNativeProps>;
export declare const ScreenShareIcon: () => null;
//# sourceMappingURL=video.native.d.ts.map