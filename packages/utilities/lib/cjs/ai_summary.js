"use strict";
// Shared, transport-agnostic AI summary code.
//
// This module holds the *pure* parts of the Form "AI profile summary" feature so they can be
// reused by both the webapp SDK loader (data_sources.ts) and the backend DB loader
// (api/modules/ai_summary_context.ts). It must stay free of any SDK/DB/React imports — only
// plain record shapes, the types-models Enduser, and constants.
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAISummaryContext = exports.assembleAISummaryContext = exports.aiSummaryCurrentDateBlock = exports.normalizeAISummaryChatRooms = exports.buildAISummarySourceFilter = exports.buildAISummaryUnsentClause = exports.buildAISummaryLookbackClause = exports.sanitizeFilter = exports.aiSummaryError = exports.FORBIDDEN_FILTER_OPERATORS = exports.enduserProfileToText = exports.DATA_SOURCE_MAP = exports.DATA_SOURCE_LABELS = exports.fmtGroupMMSConversation = exports.fmtObservation = exports.formatFormResponseAnswersForSummary = exports.fmtResponses = exports.withDerivedCreatedAt = exports.fmtFromMS = exports.fmt = exports.aiSummaryTimezoneLabel = exports.AI_SUMMARY_FALLBACK_TIMEZONE = exports.stripHtml = void 0;
var constants_1 = require("@tellescope/constants");
// Same-package import. utils.ts re-exports this module, so this is a cycle — it resolves because
// both helpers are only ever called from inside formatter closures, long after module init.
var utils_1 = require("./utils");
/* ---------------------------------- formatters ---------------------------------- */
var stripHtml = function (s) { return s
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim(); };
exports.stripHtml = stripHtml;
/* ---------------------------------- timestamps ---------------------------------- */
// Record timestamps are rendered in the organization's timezone with the zone abbreviation shown
// ("2026-10-21 19:46 EDT"), so the clock time the model reads matches the one a user reads on the
// patient timeline. An unset — or unrecognised — timezone falls back to UTC and says so, rather
// than to a US default that would be silently wrong for a west-coast practice.
exports.AI_SUMMARY_FALLBACK_TIMEZONE = 'UTC';
var buildAISummaryDateFormatter = function (timeZone) { return new Intl.DateTimeFormat('en-CA', {
    timeZone: timeZone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
    hour12: false,
    timeZoneName: 'short',
}); };
// timezone -> formatter, or null for a zone this runtime's ICU does not know. Intl.DateTimeFormat
// throws RangeError on an unknown timeZone, and constructing one per record would be wasteful, so
// the outcome (formatter *or* rejection) is memoized.
var aiSummaryDateFormatters = new Map();
var aiSummaryDateFormatter = function (timezone) {
    var cached = aiSummaryDateFormatters.get(timezone);
    if (cached !== undefined)
        return cached;
    var formatter = null;
    try {
        formatter = buildAISummaryDateFormatter(timezone);
    }
    catch (_a) {
        formatter = null;
    }
    aiSummaryDateFormatters.set(timezone, formatter);
    return formatter;
};
var utcAISummaryDateFormatter;
var fallbackAISummaryDateFormatter = function () {
    if (!utcAISummaryDateFormatter)
        utcAISummaryDateFormatter = buildAISummaryDateFormatter(exports.AI_SUMMARY_FALLBACK_TIMEZONE);
    return utcAISummaryDateFormatter;
};
// The zone name written into the context header. Must agree with what the formatters actually did,
// so an unrecognised organization timezone reports UTC rather than echoing a zone nothing used.
var aiSummaryTimezoneLabel = function (timezone) { return ((timezone && aiSummaryDateFormatter(timezone)) ? timezone : exports.AI_SUMMARY_FALLBACK_TIMEZONE); };
exports.aiSummaryTimezoneLabel = aiSummaryTimezoneLabel;
var formatAISummaryDate = function (date, timezone) {
    var _a;
    if (isNaN(date.getTime()))
        return '';
    var formatter = (_a = (timezone ? aiSummaryDateFormatter(timezone) : null)) !== null && _a !== void 0 ? _a : fallbackAISummaryDateFormatter();
    // en-CA emits "2026-10-21, 19:46 EDT"; the comma is noise inside a bracketed record label.
    // Only the date/time separator is replaced — a GMT+5:30-style zone name carries no comma.
    try {
        return formatter.format(date).replace(', ', ' ');
    }
    catch (_b) {
        return '';
    }
};
var fmt = function (d, timezone) {
    if (!d)
        return '';
    try {
        return formatAISummaryDate(new Date(d), timezone);
    }
    catch (_a) {
        return '';
    }
};
exports.fmt = fmt;
var fmtFromMS = function (ms, timezone) {
    if (typeof ms !== 'number')
        return '';
    try {
        return formatAISummaryDate(new Date(ms), timezone);
    }
    catch (_a) {
        return '';
    }
};
exports.fmtFromMS = fmtFromMS;
// `createdAt` is never stored on a record. The REST layer synthesizes it from `_id` in
// convert_id_name, so records reaching the SDK loader carry one and records read straight from the
// DB do not — which made every formatter's `?? record.createdAt` fallback dead on the server and
// blanked the date on tickets, phone calls, orders, medications and purchases, and on any chat,
// SMS or email whose `timestamp` was never stamped. Filling it once here, in the loader, fixes
// every source at once. Deliberately NOT done inside the formatters: the SDK path already supplies
// `createdAt`, and only the server has an ObjectId to derive one from.
var withDerivedCreatedAt = function (records) { return ((Array.isArray(records) ? records : []).map(function (record) {
    var _a;
    // duck-typed on getTimestamp(): server-side `_id` is the Mongo driver's ObjectId
    if (typeof ((_a = record === null || record === void 0 ? void 0 : record._id) === null || _a === void 0 ? void 0 : _a.getTimestamp) !== 'function')
        return record;
    try {
        // spread last so a stored `createdAt` still wins
        return __assign({ createdAt: record._id.getTimestamp() }, record);
    }
    catch (_b) {
        return record;
    }
})); };
exports.withDerivedCreatedAt = withDerivedCreatedAt;
var fmtResponses = function (responses) {
    if (!Array.isArray(responses))
        return '';
    return responses
        .map(function (r) {
        var ans = r === null || r === void 0 ? void 0 : r.answer;
        var v = ans === null || ans === void 0 ? void 0 : ans.value;
        if (v === undefined || v === null)
            return '';
        if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
            return "".concat(r.fieldTitle || '', ": ").concat(v);
        }
        if (Array.isArray(v))
            return "".concat(r.fieldTitle || '', ": ").concat(v.map(function (x) { var _a; return (_a = x === null || x === void 0 ? void 0 : x.label) !== null && _a !== void 0 ? _a : x; }).join(', '));
        return '';
    })
        .filter(Boolean)
        .join(' | ');
};
exports.fmtResponses = fmtResponses;
/* --------- submitted-answer formatting (the answers are the *subject*, not context) --------- */
var fmtAnswerScalar = function (v) { return (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' ? String(v) : ''); };
// Shallow `key: value` rendering for object-valued answers (signatures, files, addresses,
// insurance blocks). Deliberately one level deep — deeper nesting is metadata, not an answer.
var fmtAnswerObject = function (v) {
    if (!v || typeof v !== 'object')
        return '';
    return Object.entries(v)
        .map(function (_a) {
        var k = _a[0], val = _a[1];
        var rendered = (fmtAnswerScalar(val) || (Array.isArray(val)
            ? val.map(function (x) { var _a; return fmtAnswerScalar((_a = x === null || x === void 0 ? void 0 : x.label) !== null && _a !== void 0 ? _a : x); }).filter(Boolean).join(', ')
            : ''));
        return rendered ? "".concat(k, ": ").concat(rendered) : '';
    })
        .filter(Boolean)
        .join(', ');
};
var fmtAnswerValue = function (v) {
    if (v === undefined || v === null)
        return '';
    var scalar = fmtAnswerScalar(v);
    if (scalar)
        return scalar;
    if (Array.isArray(v)) {
        return v
            .map(function (x) { var _a; return fmtAnswerScalar((_a = x === null || x === void 0 ? void 0 : x.label) !== null && _a !== void 0 ? _a : x) || fmtAnswerObject(x); })
            .filter(Boolean)
            .join(', ');
    }
    if (typeof v === 'object')
        return fmtAnswerObject(v);
    return '';
};
// Renders one form response's answers for a summary *of those answers*.
//
// fmtResponses (above) intentionally drops object-valued answers — signatures, files, addresses,
// insurance blocks — because they add noise when a response is only background chart context.
// That is not acceptable when the answers are the subject of the summary, so those are rendered
// here as a shallow key/value list instead. One answer per line rather than ' | '-joined, since
// this text is read closely rather than skimmed alongside other records.
//
// fmtResponses is left untouched so the form_responses data-source output stays byte-identical.
var formatFormResponseAnswersForSummary = function (responses) {
    if (!Array.isArray(responses))
        return '';
    return responses
        .map(function (r) {
        var _a;
        var value = (_a = r === null || r === void 0 ? void 0 : r.answer) === null || _a === void 0 ? void 0 : _a.value;
        if (value === undefined || value === null)
            return '';
        var title = (r === null || r === void 0 ? void 0 : r.fieldTitle) || '';
        // an empty answer on a question the patient was shown is itself informative
        var rendered = value === '' ? '(no answer)' : fmtAnswerValue(value);
        if (!rendered)
            return '';
        return title ? "".concat(title, ": ").concat(rendered) : rendered;
    })
        .filter(Boolean)
        .join('\n');
};
exports.formatFormResponseAnswersForSummary = formatFormResponseAnswersForSummary;
var fmtObservation = function (o, _enduser, context) {
    var _a, _b, _c, _d;
    var m = o.measurement;
    // numeric value + unit when present; fall back to qualitative result ("positive", etc.)
    var reading = m && typeof m.value === 'number'
        ? "".concat(m.value).concat(m.unit ? " ".concat(m.unit) : '')
        : ((_a = o.qualitativeResult) !== null && _a !== void 0 ? _a : '');
    var name = o.type || o.code || o.category || ''; // what was measured
    var extras = [
        o.refRange ? "ref ".concat(o.refRange) : '',
        (_b = o.statusIndicator) !== null && _b !== void 0 ? _b : '',
    ].filter(Boolean).join(', ');
    var label = name ? "".concat(name, ": ") : '';
    var tail = extras ? " (".concat(extras, ")") : '';
    return "[Observation ".concat((0, exports.fmt)((_d = (_c = o.timestamp) !== null && _c !== void 0 ? _c : o.recordedAt) !== null && _d !== void 0 ? _d : o.createdAt, context === null || context === void 0 ? void 0 : context.timezone), "] ").concat(label).concat(reading).concat(tail).trim();
};
exports.fmtObservation = fmtObservation;
/* ---------------------------------- group MMS threads ---------------------------------- */
// One group MMS thread is ONE record, rendered as a header line plus one line per message — the
// messages live inside the conversation document, so there is nothing else to render them from.
//
// Sender labelling copies what staff already see on the patient timeline
// (GroupMMSTimelineItemExpanded): `sender` is an id, and an id in the thread's `enduserIds` is a
// patient. Anything else — a staff user, an unknown id, a missing one — is 'staff', the same
// fail-towards-staff rule `chats` uses, so an automated outbound message can never read to the
// model as the patient speaking.
//
// `logOnly` messages render like any other: they were logged against the thread deliberately and
// are part of the conversation a summary should read (which is why this source sets no
// excludeUnsentRecords — nothing here is a draft or a future-dated send).
//
// A multi-patient thread is rendered in full for every member patient, matching the timeline.
var fmtGroupMMSConversation = function (c, _enduser, context) {
    var _a, _b;
    var enduserIds = Array.isArray(c === null || c === void 0 ? void 0 : c.enduserIds) ? c.enduserIds : [];
    var messages = Array.isArray(c === null || c === void 0 ? void 0 : c.messages) ? c.messages : [];
    // The thread matched the lookback on `updatedAt` — the time of its most recent message — so an
    // active long-running thread arrives carrying history far outside the window. Each message is
    // windowed again on its own `timestamp` here, which is why the loader threads lookbackMS
    // through the format context. No lookback configured means the whole thread.
    var since = (context === null || context === void 0 ? void 0 : context.lookbackMS) ? Date.now() - context.lookbackMS : undefined;
    var inWindow = (since === undefined
        ? messages
        : messages.filter(function (m) { return typeof (m === null || m === void 0 ? void 0 : m.timestamp) === 'number' && m.timestamp >= since; }))
        // Both the header's "last" stamp and the keep-the-most-recent truncation below read position,
        // so chronological order is load-bearing. Every writer $pushes (so it holds today), but
        // nothing enforces it — sorting here makes the invariant the formatter's own.
        .slice()
        .sort(function (a, b) { return (Number(a === null || a === void 0 ? void 0 : a.timestamp) || 0) - (Number(b === null || b === void 0 ? void 0 : b.timestamp) || 0); });
    // Nothing recent enough to render. Reported as 'outside-lookback' rather than
    // 'no-readable-text': the thread is perfectly readable, it is just older than the window.
    if (inWindow.length === 0)
        return '';
    var lines = inWindow.map(function (m) {
        var sender = ((m === null || m === void 0 ? void 0 : m.sender) && enduserIds.includes(m.sender)) ? 'patient' : 'staff';
        // GroupMMSMessage.timestamp is epoch milliseconds (updatedAt, the sortField, is a Date)
        var stamp = (0, exports.fmtFromMS)(m === null || m === void 0 ? void 0 : m.timestamp, context === null || context === void 0 ? void 0 : context.timezone);
        var images = Array.isArray(m === null || m === void 0 ? void 0 : m.images) ? m.images.length : 0;
        // An MMS is often an image with no text at all, which would otherwise render as a blank line
        var attachments = images > 0 ? "(".concat(images, " image attachment").concat(images === 1 ? '' : 's', ")") : '';
        var message = typeof (m === null || m === void 0 ? void 0 : m.message) === 'string' ? m.message.trim() : '';
        // joined rather than concatenated: an image with no caption must not leave a double space
        return "  [".concat([stamp, sender].filter(Boolean).join(' '), "] ").concat([message, attachments].filter(Boolean).join(' ')).trimEnd();
    });
    var title = (_a = c === null || c === void 0 ? void 0 : c.title) !== null && _a !== void 0 ? _a : '';
    var lastStamp = (0, exports.fmtFromMS)((_b = inWindow[inWindow.length - 1]) === null || _b === void 0 ? void 0 : _b.timestamp, context === null || context === void 0 ? void 0 : context.timezone);
    var header = function (omitted) { return ("[Group MMS \"".concat(title, "\" ").concat(lines.length, " message").concat(lines.length === 1 ? '' : 's')
        + "".concat(lastStamp ? ", last ".concat(lastStamp) : '')
        + "".concat(omitted > 0 ? ", oldest ".concat(omitted, " omitted for length") : '', "]")); };
    // Truncation drops the OLDEST messages, unlike the leading `.slice(0, N)` articles and templates
    // use: an article reads from the top, while a thread over the budget is one with a long history
    // whose recent end is what the summary is about. Budgeted against the longest the header can
    // get (every message omitted) so the final string is always within MAX_AI_SUMMARY_RECORD_CHARS.
    var kept = [];
    var used = header(lines.length).length;
    for (var i = lines.length - 1; i >= 0; i--) {
        var cost = lines[i].length + 1; // + the newline that joins it on
        if (used + cost > constants_1.MAX_AI_SUMMARY_RECORD_CHARS)
            break;
        used += cost;
        kept.unshift(lines[i]);
    }
    // A single message longer than the whole budget would otherwise leave the record header-only
    if (kept.length === 0) {
        var truncated = lines[lines.length - 1].slice(0, Math.max(0, constants_1.MAX_AI_SUMMARY_RECORD_CHARS - used - 1));
        if (truncated)
            kept.push(truncated);
    }
    return __spreadArray([header(lines.length - kept.length)], kept, true).join('\n');
};
exports.fmtGroupMMSConversation = fmtGroupMMSConversation;
/* ---------------------------------- data source metadata ---------------------------------- */
exports.DATA_SOURCE_LABELS = {
    enduser_observations: 'Observations',
    form_responses: 'Form Responses',
    chats: 'Chat Messages',
    phone_calls: 'Phone Calls',
    calendar_events: 'Calendar Events',
    tickets: 'Tickets',
    sms_messages: 'SMS Messages',
    group_mms_conversations: 'Group MMS',
    emails: 'Emails',
    enduser_orders: 'Orders',
    enduser_medications: 'Medications',
    purchases: 'Purchases',
    managed_content_records: 'Content (Articles)',
    templates: 'Message Templates',
};
exports.DATA_SOURCE_MAP = {
    enduser_observations: {
        collection: 'enduser_observations',
        sortField: 'timestamp',
        format: exports.fmtObservation,
    },
    form_responses: {
        collection: 'form_responses',
        sortField: 'submittedAt',
        format: function (fr, _enduser, context) { var _a, _b; return "[Form \"".concat((_a = fr.formTitle) !== null && _a !== void 0 ? _a : '', "\" ").concat((0, exports.fmt)((_b = fr.submittedAt) !== null && _b !== void 0 ? _b : fr.createdAt, context === null || context === void 0 ? void 0 : context.timezone), "] ").concat((0, exports.fmtResponses)(fr.responses)); },
    },
    chats: {
        collection: 'chats',
        sortField: 'timestamp',
        // Loaded by room rather than by `enduserId`: that field is set both by the enduser-session
        // initializer and by the worker's outbound automation chats, so it identifies neither the
        // patient nor the sender. The room's member list does both (analogue: api/modules/inbox.ts).
        roomScoped: true,
        lookbackIncludesUnstampedRecords: true,
        excludeUnsentRecords: true,
        format: function (m, _enduser, context) {
            var _a, _b, _c;
            var members = (_a = context === null || context === void 0 ? void 0 : context.enduserIdsByRoomId) === null || _a === void 0 ? void 0 : _a[m.roomId];
            // A sender in the room's enduserIds is the patient; anyone else (and an unknown room) is
            // staff. Erring towards 'staff' keeps an automated outbound chat from reading to the model
            // as the patient speaking.
            var sender = (m.senderId && (members === null || members === void 0 ? void 0 : members.includes(m.senderId))) ? 'patient' : 'staff';
            return "[Chat ".concat((0, exports.fmt)((_b = m.timestamp) !== null && _b !== void 0 ? _b : m.createdAt, context === null || context === void 0 ? void 0 : context.timezone), " ").concat(sender, "] ").concat((_c = m.message) !== null && _c !== void 0 ? _c : '');
        },
    },
    phone_calls: {
        collection: 'phone_calls',
        sortField: 'createdAt',
        format: function (c, _enduser, context) { var _a, _b, _c, _d; return "[Call ".concat((0, exports.fmt)(c.createdAt, context === null || context === void 0 ? void 0 : context.timezone), " ").concat((_a = c.direction) !== null && _a !== void 0 ? _a : '', " ").concat((_b = c.durationInSeconds) !== null && _b !== void 0 ? _b : 0, "s] ").concat((_d = (_c = c.aiSummary) !== null && _c !== void 0 ? _c : c.summary) !== null && _d !== void 0 ? _d : ''); },
    },
    calendar_events: {
        collection: 'calendar_events',
        sortField: 'startTimeInMS',
        // startTimeInMS holds epoch milliseconds, so the lookback must compare numbers
        lookbackIsNumeric: true,
        format: function (e, _enduser, context) { var _a, _b; return "[Appt ".concat((0, exports.fmtFromMS)(e.startTimeInMS, context === null || context === void 0 ? void 0 : context.timezone), "] ").concat((_a = e.title) !== null && _a !== void 0 ? _a : '', " (").concat((_b = e.type) !== null && _b !== void 0 ? _b : '', ")"); },
        enduserMatchClause: function (enduserId) { return ({ 'attendees.id': enduserId }); },
    },
    tickets: {
        collection: 'tickets',
        sortField: 'createdAt',
        // "How long has this been unresolved?" needs both ends of the ticket's life, so the closed
        // date is rendered rather than just the word "closed".
        format: function (t, _enduser, context) {
            var _a;
            var closedAt = t.closedAt ? (0, exports.fmt)(t.closedAt, context === null || context === void 0 ? void 0 : context.timezone) : '';
            var status = t.closedAt ? "closed".concat(closedAt ? " ".concat(closedAt) : '') : 'open';
            return "[Ticket created ".concat((0, exports.fmt)(t.createdAt, context === null || context === void 0 ? void 0 : context.timezone), ", ").concat(status, "] ").concat((_a = t.title) !== null && _a !== void 0 ? _a : '');
        },
    },
    sms_messages: {
        collection: 'sms_messages',
        sortField: 'timestamp',
        lookbackIncludesUnstampedRecords: true,
        format: function (s, _enduser, context) { var _a, _b; return "[SMS ".concat((0, exports.fmt)((_a = s.timestamp) !== null && _a !== void 0 ? _a : s.createdAt, context === null || context === void 0 ? void 0 : context.timezone), " ").concat(s.inbound ? 'in' : 'out', "] ").concat((_b = s.message) !== null && _b !== void 0 ? _b : ''); },
    },
    group_mms_conversations: {
        collection: 'group_mms_conversations',
        // `updatedAt` is the time of the thread's last WRITE, which is at least as recent as its last
        // message: every message is $pushed through an update, and the DB layer stamps updatedAt on
        // every update. It is deliberately NOT only the last message — marking a thread read,
        // archiving, tagging or assigning bumps it too, so the window is over-inclusive at the thread
        // level and each message is re-windowed on its own timestamp in the formatter. `createdAt`
        // would window on when the thread STARTED, so a long-running active conversation never matches.
        sortField: 'updatedAt',
        lookbackIncludesUnstampedRecords: true,
        // The model has no `enduserId` — a thread carries a list of member patients — so without this
        // the map's default `{ enduserId }` clause would silently match nothing at all.
        enduserMatchClause: function (enduserId) { return ({ enduserIds: enduserId }); },
        // Trashed threads are deleted by another name and stay out. `archivedAt`, `hiddenBy` and
        // `hiddenForAll` deliberately do NOT: staff set those as routine inbox triage on everything
        // they have dealt with, so excluding them would empty this source for most organizations.
        baseFilter: { $or: [{ trashedAt: { $in: [null, ''] } }, { trashedAt: { $exists: false } }] },
        emptyFormatReason: 'outside-lookback',
        format: exports.fmtGroupMMSConversation,
    },
    emails: {
        collection: 'emails',
        sortField: 'timestamp',
        format: function (e, _enduser, context) {
            var _a, _b;
            var body = e.textContent || (0, exports.stripHtml)(e.HTMLContent || '');
            return "[Email ".concat((0, exports.fmt)((_a = e.timestamp) !== null && _a !== void 0 ? _a : e.createdAt, context === null || context === void 0 ? void 0 : context.timezone), "] ").concat((_b = e.subject) !== null && _b !== void 0 ? _b : '', "\n").concat(body.slice(0, 2000));
        },
    },
    enduser_orders: {
        collection: 'enduser_orders',
        sortField: 'createdAt',
        format: function (o, _enduser, context) { var _a, _b; return "[Order ".concat((0, exports.fmt)(o.createdAt, context === null || context === void 0 ? void 0 : context.timezone), "] ").concat((_a = o.status) !== null && _a !== void 0 ? _a : '', " \u2014 ").concat(((_b = o.items) !== null && _b !== void 0 ? _b : []).map(function (i) { var _a, _b; return (_b = (_a = i.title) !== null && _a !== void 0 ? _a : i.sku) !== null && _b !== void 0 ? _b : ''; }).filter(Boolean).join(', ')); },
    },
    enduser_medications: {
        collection: 'enduser_medications',
        sortField: 'createdAt',
        format: function (m, _enduser, context) { var _a, _b, _c; return "[Medication ".concat((0, exports.fmt)(m.createdAt, context === null || context === void 0 ? void 0 : context.timezone), "] ").concat((_a = m.title) !== null && _a !== void 0 ? _a : '', " ").concat((_b = m.dosage) !== null && _b !== void 0 ? _b : '', " ").concat((_c = m.status) !== null && _c !== void 0 ? _c : '').trim(); },
    },
    purchases: {
        collection: 'purchases',
        sortField: 'createdAt',
        format: function (p, _enduser, context) { var _a; return "[Purchase ".concat((0, exports.fmt)(p.createdAt, context === null || context === void 0 ? void 0 : context.timezone), "] ").concat((_a = p.title) !== null && _a !== void 0 ? _a : '', " ").concat(typeof p.amount === 'number' ? "$".concat(p.amount) : '').trim(); },
    },
    // Org-wide reference sources below: approved material the AI is grounded in, rather than
    // records describing the patient. Selected by `ids`, so no enduser clause and no lookback.
    managed_content_records: {
        collection: 'managed_content_records',
        sortField: 'createdAt',
        enduserScoped: false,
        // Articles only. PDF/Video bodies live in an attached file that can't be read, so they're
        // excluded here rather than relying on the UI to keep them out.
        baseFilter: { type: 'Article' },
        format: function (r) {
            var _a;
            var body = (0, utils_1.plaintext_for_managed_content_record)(r);
            if (!(body === null || body === void 0 ? void 0 : body.trim()))
                return '';
            var description = r.description ? " ".concat(r.description) : '';
            return "[Content \"".concat((_a = r.title) !== null && _a !== void 0 ? _a : '', "\"]").concat(description, "\n").concat(body.trim().slice(0, constants_1.MAX_AI_SUMMARY_RECORD_CHARS));
        },
    },
    templates: {
        collection: 'templates',
        sortField: 'createdAt',
        enduserScoped: false,
        formatNeedsEnduser: true,
        format: function (t, enduser) {
            var _a;
            var raw = t.message || (0, exports.stripHtml)(t.html || '');
            if (!(raw === null || raw === void 0 ? void 0 : raw.trim()))
                return '';
            // Resolve {{merge}} fields so the model reads concrete text instead of placeholders.
            // Unresolvable ones stay literal; the caller's prompt tells the model to fill or drop them.
            var body = (0, utils_1.replace_enduser_template_values)(raw, enduser);
            var subject = t.subject
                ? " Subject: ".concat((0, utils_1.replace_enduser_template_values)(t.subject, enduser))
                : '';
            var type = t.type ? " type:".concat(t.type) : '';
            return "[Template \"".concat((_a = t.title) !== null && _a !== void 0 ? _a : '', "\"").concat(type, "]").concat(subject, "\n").concat(body.trim().slice(0, constants_1.MAX_AI_SUMMARY_RECORD_CHARS));
        },
    },
};
var enduserProfileToText = function (e) {
    var _a, _b, _c, _d;
    var lines = [];
    lines.push('## enduser');
    if (e.fname || e.lname)
        lines.push("Name: ".concat((_a = e.fname) !== null && _a !== void 0 ? _a : '', " ").concat((_b = e.lname) !== null && _b !== void 0 ? _b : '').trim());
    if (e.dateOfBirth)
        lines.push("DOB: ".concat(e.dateOfBirth));
    if (e.gender)
        lines.push("Gender: ".concat(e.gender));
    if (e.state)
        lines.push("State: ".concat(e.state));
    if (e.email)
        lines.push("Email: ".concat(e.email));
    if (e.phone)
        lines.push("Phone: ".concat(e.phone));
    if ((_c = e.tags) === null || _c === void 0 ? void 0 : _c.length)
        lines.push("Tags: ".concat(e.tags.join(', ')));
    if (e.fields && typeof e.fields === 'object') {
        var entries = Object.entries(e.fields).filter(function (_a) {
            var _ = _a[0], v = _a[1];
            return v !== '' && v !== null && v !== undefined;
        });
        if (entries.length) {
            lines.push('Custom fields:');
            for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                var _e = entries_1[_i], k = _e[0], v = _e[1];
                lines.push("  - ".concat(k, ": ").concat(typeof v === 'object' ? JSON.stringify(v) : String(v)));
            }
        }
    }
    // Last, and as two lines: the note is free text that may itself be multi-line, so inlining it
    // after its label (the way Tags: does) would run its first line into the label and leave the
    // rest dangling. Placed after the custom-fields list so it can never split that list.
    if ((_d = e.note) === null || _d === void 0 ? void 0 : _d.trim()) {
        lines.push('Notes:');
        lines.push(e.note);
    }
    return lines.join('\n');
};
exports.enduserProfileToText = enduserProfileToText;
/* ---------------------------------- filter sanitization ---------------------------------- */
exports.FORBIDDEN_FILTER_OPERATORS = ['$where', '$function'];
var aiSummaryError = function (code, message) { return Object.assign(new Error(message), { code: code }); };
exports.aiSummaryError = aiSummaryError;
var sanitizeFilter = function (filter) {
    if (!filter || typeof filter !== 'object')
        return {};
    var json = JSON.stringify(filter);
    for (var _i = 0, FORBIDDEN_FILTER_OPERATORS_1 = exports.FORBIDDEN_FILTER_OPERATORS; _i < FORBIDDEN_FILTER_OPERATORS_1.length; _i++) {
        var op = FORBIDDEN_FILTER_OPERATORS_1[_i];
        if (json.includes(op)) {
            throw (0, exports.aiSummaryError)(400, "AI summary filter cannot contain ".concat(op));
        }
    }
    return filter;
};
exports.sanitizeFilter = sanitizeFilter;
// The lookback window for one source. Built fresh on every call: transformFilterForQuery
// (api/modules/database.ts) rewrites the never-stored `createdAt` to `_id` by MUTATING the filter
// it is handed, so a shared clause object would be corrupted by the first source that used it.
var buildAISummaryLookbackClause = function (lookbackMS, mapEntry) {
    var _a, _b, _c, _d;
    if (!lookbackMS)
        return {};
    var since = Date.now() - lookbackMS;
    // startTimeInMS holds epoch milliseconds, so this has to be a plain number — and must stay one
    // through the webapp transport, which JSON-serialises the clause and revives ISO date strings
    // as Dates. Comparing a Date against a number matched nothing at all.
    if (mapEntry.lookbackIsNumeric)
        return _a = {}, _a[mapEntry.sortField] = { $gte: since }, _a;
    // Sources whose sortField is only set by whatever stamped it. An inbound Twilio SMS is written
    // with a raw insert that bypasses the routed-create initializer, so it has no `timestamp` at
    // all and `{timestamp:{$gte:D}}` silently dropped the patient's own message. Event time is
    // still preferred where it exists — a scheduled send is created days before it goes out, so
    // windowing on creation time alone would place it wrongly.
    if (mapEntry.lookbackIncludesUnstampedRecords) {
        return {
            $or: [
                (_b = {}, _b[mapEntry.sortField] = { $gte: new Date(since) }, _b),
                (_c = {}, _c[mapEntry.sortField] = { $exists: false }, _c.createdAt = { $gte: new Date(since) }, _c),
            ],
        };
    }
    return _d = {}, _d[mapEntry.sortField] = { $gte: new Date(since) }, _d;
};
exports.buildAISummaryLookbackClause = buildAISummaryLookbackClause;
// Drafts and future-dated scheduled sends are not conversation: nobody has said them yet. The old
// `{enduserId}` chats clause excluded them as a side effect (a staff draft carries no enduserId);
// scoping by room does not, so they are excluded explicitly rather than being allowed to steer an
// AI Decision branch or land in a generated note. Shape copied from the enduser-session guard in
// api/modules/database.ts, which strips exactly these for patients.
var buildAISummaryUnsentClause = function () { return ({
    $and: [
        { isDraft: { $ne: true } },
        { $or: [{ sendAt: { $in: [null, ''] } }, { sendAt: { $exists: false } }, { sendAt: { $lte: new Date() } }] },
    ],
}); };
exports.buildAISummaryUnsentClause = buildAISummaryUnsentClause;
// Build the mongo filter + effective limit for a single data source. Shared by both loaders so
// the lookback / enduserMatch / sanitized-filter / default-limit logic stays identical.
// `ids` is returned rather than folded into mdbFilter: _id needs ObjectId conversion on the DB
// side, and the readMany endpoint takes `ids` natively, so each transport applies it.
var buildAISummarySourceFilter = function (_a) {
    var _b, _c, _d;
    var ds = _a.ds, enduserId = _a.enduserId, mapEntry = _a.mapEntry, roomIds = _a.roomIds;
    var userFilter = (0, exports.sanitizeFilter)(ds.filter);
    var lookbackClause = (0, exports.buildAISummaryLookbackClause)(ds.lookbackMS, mapEntry);
    var enduserMatch = (mapEntry.enduserScoped === false
        ? {}
        // A patient with no rooms must load NOTHING. `{roomId:{$in:[]}}` says exactly that; omitting
        // the clause would hand the prompt the newest chats in the whole organization.
        : mapEntry.roomScoped ? { roomId: { $in: roomIds !== null && roomIds !== void 0 ? roomIds : [] } }
            : mapEntry.enduserMatchClause ? mapEntry.enduserMatchClause(enduserId) : { enduserId: enduserId });
    var unsentClause = mapEntry.excludeUnsentRecords ? (0, exports.buildAISummaryUnsentClause)() : {};
    var mdbFilter = { $and: [userFilter, lookbackClause, enduserMatch, (_b = mapEntry.baseFilter) !== null && _b !== void 0 ? _b : {}, unsentClause] };
    var effectiveLimit = (_c = ds.limit) !== null && _c !== void 0 ? _c : constants_1.DEFAULT_AI_SUMMARY_DATA_SOURCE_LIMIT;
    return { mdbFilter: mdbFilter, effectiveLimit: effectiveLimit, ids: ((_d = ds.ids) === null || _d === void 0 ? void 0 : _d.length) ? ds.ids : undefined };
};
exports.buildAISummarySourceFilter = buildAISummarySourceFilter;
// Normalise whatever shape a transport's chat_rooms fetcher returned into room ids + members.
// The two shapes differ: DB.chat_rooms.findPage yields `_id` as an ObjectId, while
// session.api.chat_rooms.getSome yields a string `id`. chats.roomId is a STRING
// (mongoIdStringValidator), so every id must be stringified or the `$in` matches nothing.
var normalizeAISummaryChatRooms = function (rooms) {
    var _a, _b, _c;
    var roomIds = [];
    var enduserIdsByRoomId = {};
    for (var _i = 0, _d = (Array.isArray(rooms) ? rooms : []); _i < _d.length; _i++) {
        var room = _d[_i];
        var id = (_a = room === null || room === void 0 ? void 0 : room.id) !== null && _a !== void 0 ? _a : (_c = (_b = room === null || room === void 0 ? void 0 : room._id) === null || _b === void 0 ? void 0 : _b.toString) === null || _c === void 0 ? void 0 : _c.call(_b);
        if (!id)
            continue;
        roomIds.push(id);
        enduserIdsByRoomId[id] = Array.isArray(room === null || room === void 0 ? void 0 : room.enduserIds) ? room.enduserIds : [];
    }
    return { roomIds: roomIds, enduserIdsByRoomId: enduserIdsByRoomId };
};
exports.normalizeAISummaryChatRooms = normalizeAISummaryChatRooms;
// "Two days ago" is unanswerable without knowing what today is, and every record timestamp below
// is rendered in one zone, so both facts are stated once at the top of the context. Emitted
// unconditionally — even when no source produced a line — so the model never has to guess either.
var aiSummaryCurrentDateBlock = function (timezone, now) {
    if (now === void 0) { now = new Date(); }
    return ("Current date and time: ".concat((0, exports.fmt)(now, timezone), " (").concat((0, exports.aiSummaryTimezoneLabel)(timezone), "). ")
        + "All timestamps in this context are in this timezone.");
};
exports.aiSummaryCurrentDateBlock = aiSummaryCurrentDateBlock;
// Join the current-date header + profile block + per-source blocks, estimate tokens, and enforce
// the input budget.
var assembleAISummaryContext = function (_a) {
    var profileBlock = _a.profileBlock, sources = _a.sources, timezone = _a.timezone, now = _a.now;
    var blocks = sources
        .filter(function (s) { return s.formattedLines.length > 0; })
        .map(function (s) { return "## ".concat(s.heading, "\n").concat(s.formattedLines.join('\n')); });
    var contextText = __spreadArray([(0, exports.aiSummaryCurrentDateBlock)(timezone, now), profileBlock], blocks, true).filter(Boolean).join('\n\n');
    var estimatedTokens = Math.ceil(contextText.length / 4);
    if (estimatedTokens > constants_1.MAX_AI_SUMMARY_INPUT_TOKENS) {
        throw (0, exports.aiSummaryError)(413, 'AI summary input exceeds token budget — reduce limits, shorten lookback, or remove data sources.');
    }
    return { contextText: contextText, estimatedTokens: estimatedTokens, profileBlock: profileBlock, sources: sources };
};
exports.assembleAISummaryContext = assembleAISummaryContext;
// Transport-agnostic loader. Callers inject loadProfile/loadRecords backed by the SDK (webapp) or
// the DB (api). Per-source failures degrade to an empty section so one broken collection doesn't
// sink the whole summary; filter-sanitization (400) and the token-budget (413) errors still throw.
var loadAISummaryContext = function (_a) {
    var enduserId = _a.enduserId, configuration = _a.configuration, loadProfile = _a.loadProfile, loadRecords = _a.loadRecords, loadChatRooms = _a.loadChatRooms, _b = _a.includeProfile, includeProfile = _b === void 0 ? true : _b, timezone = _a.timezone;
    return __awaiter(void 0, void 0, void 0, function () {
        var dataSources, needsEnduserForFormat, enduser, _c, profileBlock, chatRooms, _d, err_1, sharedFormatContext, sections, sources;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    dataSources = (_e = configuration.dataSources) !== null && _e !== void 0 ? _e : [];
                    needsEnduserForFormat = dataSources.some(function (ds) { var _a; return (_a = exports.DATA_SOURCE_MAP[ds.type]) === null || _a === void 0 ? void 0 : _a.formatNeedsEnduser; });
                    if (!(includeProfile || needsEnduserForFormat)) return [3 /*break*/, 2];
                    return [4 /*yield*/, loadProfile(enduserId)];
                case 1:
                    _c = _f.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _c = null;
                    _f.label = 3;
                case 3:
                    enduser = _c;
                    profileBlock = (includeProfile && enduser) ? (0, exports.enduserProfileToText)(enduser) : '';
                    chatRooms = { roomIds: [], enduserIdsByRoomId: {} };
                    if (!(loadChatRooms && dataSources.some(function (ds) { var _a; return (_a = exports.DATA_SOURCE_MAP[ds.type]) === null || _a === void 0 ? void 0 : _a.roomScoped; }))) return [3 /*break*/, 7];
                    _f.label = 4;
                case 4:
                    _f.trys.push([4, 6, , 7]);
                    _d = exports.normalizeAISummaryChatRooms;
                    return [4 /*yield*/, loadChatRooms(enduserId)];
                case 5:
                    chatRooms = _d.apply(void 0, [_f.sent()]);
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _f.sent();
                    console.error('Failed to load chat rooms for AI summary', err_1);
                    return [3 /*break*/, 7];
                case 7:
                    sharedFormatContext = { enduserIdsByRoomId: chatRooms.enduserIdsByRoomId, timezone: timezone };
                    return [4 /*yield*/, Promise.all(dataSources.map(function (ds) { return __awaiter(void 0, void 0, void 0, function () {
                            var m, _a, mdbFilter, effectiveLimit, ids, formatContext, base, records, list, formattedLines, skipped, _i, list_1, record, line, err_2;
                            var _b, _c, _d, _e, _f, _g;
                            return __generator(this, function (_h) {
                                switch (_h.label) {
                                    case 0:
                                        m = exports.DATA_SOURCE_MAP[ds.type];
                                        if (!m)
                                            return [2 /*return*/, null];
                                        _a = (0, exports.buildAISummarySourceFilter)({ ds: ds, enduserId: enduserId, mapEntry: m, roomIds: chatRooms.roomIds }), mdbFilter = _a.mdbFilter, effectiveLimit = _a.effectiveLimit, ids = _a.ids;
                                        formatContext = __assign(__assign({}, sharedFormatContext), { lookbackMS: ds.lookbackMS });
                                        base = {
                                            type: ds.type,
                                            label: (_b = exports.DATA_SOURCE_LABELS[ds.type]) !== null && _b !== void 0 ? _b : ds.type,
                                            heading: ds.label || ds.type,
                                            lookbackMS: ds.lookbackMS,
                                            limit: effectiveLimit,
                                        };
                                        // Reference collections are selected exclusively by ids — an empty selection means "load
                                        // nothing", never "no id restriction" (which would pull the newest org-wide records into the prompt)
                                        if (m.enduserScoped === false && !ids)
                                            return [2 /*return*/, __assign(__assign({}, base), { records: [], formattedLines: [], skipped: [] })];
                                        _h.label = 1;
                                    case 1:
                                        _h.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, loadRecords({ type: ds.type, collection: m.collection, mdbFilter: mdbFilter, limit: effectiveLimit, sortField: m.sortField, ids: ids })];
                                    case 2:
                                        records = _h.sent();
                                        list = Array.isArray(records) ? records : [];
                                        formattedLines = [];
                                        skipped = [];
                                        for (_i = 0, list_1 = list; _i < list_1.length; _i++) {
                                            record = list_1[_i];
                                            line = m.format(record, enduser, formatContext);
                                            if (line)
                                                formattedLines.push(line);
                                            else
                                                skipped.push({
                                                    id: (_f = (_c = record === null || record === void 0 ? void 0 : record.id) !== null && _c !== void 0 ? _c : (_e = (_d = record === null || record === void 0 ? void 0 : record._id) === null || _d === void 0 ? void 0 : _d.toString) === null || _e === void 0 ? void 0 : _e.call(_d)) !== null && _f !== void 0 ? _f : '',
                                                    title: record === null || record === void 0 ? void 0 : record.title,
                                                    reason: (_g = m.emptyFormatReason) !== null && _g !== void 0 ? _g : 'no-readable-text',
                                                });
                                        }
                                        return [2 /*return*/, __assign(__assign({}, base), { records: list, formattedLines: formattedLines, skipped: skipped })];
                                    case 3:
                                        err_2 = _h.sent();
                                        console.error("Failed to load ".concat(ds.type, " for AI summary"), err_2);
                                        return [2 /*return*/, __assign(__assign({}, base), { records: [], formattedLines: [], skipped: [] })];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 8:
                    sections = _f.sent();
                    sources = sections.filter(function (s) { return s !== null; });
                    return [2 /*return*/, (0, exports.assembleAISummaryContext)({ profileBlock: profileBlock, sources: sources, timezone: timezone })];
            }
        });
    });
};
exports.loadAISummaryContext = loadAISummaryContext;
//# sourceMappingURL=ai_summary.js.map