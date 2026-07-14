/**
 * Hook for hosts to start a Twilio Video call for a calendar event
 */
export declare const useStartTwilioVideoCall: (calendarEventId?: string) => {
    starting: boolean;
    ending: boolean;
    room: import("twilio-video").Room | null;
    isConnected: boolean;
    startMeeting: (eventId?: string) => Promise<string>;
    endMeeting: (meetingId: string) => Promise<void>;
};
/**
 * Hook for participants to join a Twilio Video call
 */
export declare const useJoinTwilioVideoCall: () => {
    joining: boolean;
    room: import("twilio-video").Room | null;
    isConnected: boolean;
    joinMeeting: (calendarEventId: string) => Promise<void>;
    leaveMeeting: () => void;
};
/**
 * Hook for calendar event-based Twilio Video calls
 * Combines start and join functionality with meeting status polling
 */
export declare const useTwilioMeetingForCalendarEvent: (calendarEventId: string) => {
    event: (import("@tellescope/types-models").CalendarEvent & {
        id: string;
        createdAt: Date;
    }) | null | undefined;
    meeting: (import("@tellescope/types-models").Meeting & {
        id: string;
        createdAt: Date;
    }) | null | undefined;
    room: import("twilio-video").Room | null;
    isConnected: boolean;
    isHost: boolean;
    starting: boolean;
    joining: boolean;
    startAndJoinMeeting: () => Promise<void>;
    joinMeeting: () => Promise<void>;
    meetingStatus: "disabled" | "loading" | "waiting-room" | "joined";
};
//# sourceMappingURL=hooks.d.ts.map