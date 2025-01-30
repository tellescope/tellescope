"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upcoming_events_sorted = exports.event_is_upcoming = void 0;
var utilities_1 = require("@tellescope/utilities");
var event_is_upcoming = function (e) { return (e.startTimeInMS > (Date.now() - 1000 * 60 * 60 * 12) // 12 hours of leeway by default
); };
exports.event_is_upcoming = event_is_upcoming;
var upcoming_events_sorted = function (es) { return ((0, utilities_1.sorted_records)(es.filter(exports.event_is_upcoming), { key: 'startTimeInMS' })); };
exports.upcoming_events_sorted = upcoming_events_sorted;
//# sourceMappingURL=utilities.js.map