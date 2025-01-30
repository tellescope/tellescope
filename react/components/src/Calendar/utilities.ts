import { CalendarEvent } from "@tellescope/types-client"
import { sorted_records } from "@tellescope/utilities"

export const event_is_upcoming = (e: CalendarEvent) => (
  e.startTimeInMS > (Date.now() - 1000 * 60 * 60 * 12) // 12 hours of leeway by default
)

export const upcoming_events_sorted = (es: CalendarEvent[]) => (
  sorted_records(es.filter(event_is_upcoming), { key: 'startTimeInMS' })
)