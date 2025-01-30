import { CalendarEvent, Meeting } from "@tellescope/types-client";
export declare const useStartAndJoinMeetingForCalendarEvent: (calendarEventId: string) => {
    startAndJoinMeeting: () => Promise<void>;
};
export declare const useJoinMeeting: () => {
    joinMeeting: (meeting: Meeting) => Promise<void>;
};
export declare const useMeetingForCalendarEvent: (event: CalendarEvent) => {
    startAndJoinMeeting: () => Promise<void>;
    joinMeeting: (meeting: Meeting) => Promise<void>;
    meeting: import("@tellescope/types-models/src").MeetingInfo | undefined;
    meetingStatus: string;
};
//# sourceMappingURL=hooks.d.ts.map