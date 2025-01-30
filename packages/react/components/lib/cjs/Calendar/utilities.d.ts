import { CalendarEvent } from "@tellescope/types-client";
export declare const event_is_upcoming: (e: CalendarEvent) => boolean;
export declare const upcoming_events_sorted: (es: CalendarEvent[]) => (import("@tellescope/types-models").CalendarEvent & {
    id: string;
    createdAt: Date;
})[];
//# sourceMappingURL=utilities.d.ts.map