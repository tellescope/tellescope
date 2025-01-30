import { sorted_records } from "@tellescope/utilities";
export var event_is_upcoming = function (e) { return (e.startTimeInMS > (Date.now() - 1000 * 60 * 60 * 12) // 12 hours of leeway by default
); };
export var upcoming_events_sorted = function (es) { return (sorted_records(es.filter(event_is_upcoming), { key: 'startTimeInMS' })); };
//# sourceMappingURL=utilities.js.map