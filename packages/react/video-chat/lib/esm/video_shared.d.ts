import React, { CSSProperties } from "react";
import { AttendeeInfo, MeetingInfo } from '@tellescope/types-models';
import { CalendarEvent } from '@tellescope/types-client';
import { APIError, UserIdentity } from '@tellescope/types-utilities';
import { UserAndEnduserSelectorProps } from "@tellescope/react-components";
export type AttendeeDisplayInfo = {
    attendeeId: string;
    externalUserId: string;
};
export interface CallContext {
    meeting: MeetingInfo | undefined;
    setMeeting: (m: MeetingInfo | undefined) => void;
    videoIsEnabled: boolean;
    toggleVideo: () => Promise<void>;
    microphoneIsEnabled: boolean;
    toggleMicrophone: () => Promise<void>;
    attendees: AttendeeDisplayInfo[];
    shareScreenId: number | null;
    localTileId: number | null;
    isHost: boolean;
    setIsHost: (b: boolean) => void;
    videoTiles: (number)[];
}
export declare const CurrentCallContext: React.Context<CallContext>;
export declare const useCurrentCallContext: () => CallContext;
export interface VideoProps {
    children?: React.ReactNode;
}
export interface VideoViewProps {
    style?: CSSProperties;
}
export interface JoinVideoCallProps {
    onCallEnd?: () => void;
}
export interface JoinVideoCallReturnType {
    meeting: CallContext['meeting'];
    videoIsEnabled: CallContext['videoIsEnabled'];
    toggleVideo: CallContext['toggleVideo'];
    leaveMeeting: () => void;
    joinMeeting: (meetingInfo: {
        Meeting: MeetingInfo;
    } | string, attendeeInfo?: {
        Attendee: AttendeeInfo;
    }) => Promise<void>;
}
export interface StartVideoCallReturnType {
    starting: boolean;
    ending: boolean;
    meeting: CallContext['meeting'];
    videoIsEnabled: CallContext['videoIsEnabled'];
    toggleVideo: CallContext['toggleVideo'];
    createAndStartMeeting: (initialAttendees?: UserIdentity[]) => Promise<string>;
    addAttendees: (attendees: UserIdentity[]) => Promise<void>;
    endMeeting: () => Promise<void>;
}
export interface CreateCalendarEventForAttendeesProps extends Omit<UserAndEnduserSelectorProps, 'onSelect'> {
    onSuccess?: (c: CalendarEvent) => void;
    onError?: (e: APIError) => void;
    eventProps?: Pick<CalendarEvent, 'startTimeInMS' | 'durationInMinutes' | 'title'>;
}
export declare const CreateCalendarEventForAttendees: ({ onSuccess, onError, eventProps, ...props }: CreateCalendarEventForAttendeesProps) => JSX.Element;
export type WaitingRoomProps = {
    calendarEvent: CalendarEvent;
    onGoBack?: () => void;
};
export declare const WaitingRoom: (props: WaitingRoomProps) => JSX.Element;
export interface VideoCallNativeProps {
    onLeave?: () => void;
}
//# sourceMappingURL=video_shared.d.ts.map