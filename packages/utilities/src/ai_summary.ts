// Shared, transport-agnostic AI summary code.
//
// This module holds the *pure* parts of the Form "AI profile summary" feature so they can be
// reused by both the webapp SDK loader (data_sources.ts) and the backend DB loader
// (api/modules/ai_summary_context.ts). It must stay free of any SDK/DB/React imports — only
// plain record shapes, the types-models Enduser, and constants.

import {
  AISummaryConfiguration,
  AISummaryDataSource,
  AISummaryDataSourceConfig,
  Enduser,
  ManagedContentRecord,
  MessageTemplate,
} from "@tellescope/types-models"
import {
  DEFAULT_AI_SUMMARY_DATA_SOURCE_LIMIT,
  MAX_AI_SUMMARY_INPUT_TOKENS,
  MAX_AI_SUMMARY_RECORD_CHARS,
} from "@tellescope/constants"
// Same-package import. utils.ts re-exports this module, so this is a cycle — it resolves because
// both helpers are only ever called from inside formatter closures, long after module init.
import { plaintext_for_managed_content_record, replace_enduser_template_values } from "./utils"

/* ---------------------------------- formatters ---------------------------------- */

export const stripHtml = (s: string) => s
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim()

/* ---------------------------------- timestamps ---------------------------------- */

// Record timestamps are rendered in the organization's timezone with the zone abbreviation shown
// ("2026-10-21 19:46 EDT"), so the clock time the model reads matches the one a user reads on the
// patient timeline. An unset — or unrecognised — timezone falls back to UTC and says so, rather
// than to a US default that would be silently wrong for a west-coast practice.
export const AI_SUMMARY_FALLBACK_TIMEZONE = 'UTC'

const buildAISummaryDateFormatter = (timeZone: string) => new Intl.DateTimeFormat('en-CA', {
  timeZone,
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit',
  hour12: false,
  timeZoneName: 'short',
})

// timezone -> formatter, or null for a zone this runtime's ICU does not know. Intl.DateTimeFormat
// throws RangeError on an unknown timeZone, and constructing one per record would be wasteful, so
// the outcome (formatter *or* rejection) is memoized.
const aiSummaryDateFormatters = new Map<string, Intl.DateTimeFormat | null>()

const aiSummaryDateFormatter = (timezone: string): Intl.DateTimeFormat | null => {
  const cached = aiSummaryDateFormatters.get(timezone)
  if (cached !== undefined) return cached

  let formatter: Intl.DateTimeFormat | null = null
  try { formatter = buildAISummaryDateFormatter(timezone) } catch { formatter = null }
  aiSummaryDateFormatters.set(timezone, formatter)
  return formatter
}

let utcAISummaryDateFormatter: Intl.DateTimeFormat | undefined
const fallbackAISummaryDateFormatter = () => {
  if (!utcAISummaryDateFormatter) utcAISummaryDateFormatter = buildAISummaryDateFormatter(AI_SUMMARY_FALLBACK_TIMEZONE)
  return utcAISummaryDateFormatter
}

// The zone name written into the context header. Must agree with what the formatters actually did,
// so an unrecognised organization timezone reports UTC rather than echoing a zone nothing used.
export const aiSummaryTimezoneLabel = (timezone?: string): string => (
  (timezone && aiSummaryDateFormatter(timezone)) ? timezone : AI_SUMMARY_FALLBACK_TIMEZONE
)

const formatAISummaryDate = (date: Date, timezone?: string): string => {
  if (isNaN(date.getTime())) return ''
  const formatter = (timezone ? aiSummaryDateFormatter(timezone) : null) ?? fallbackAISummaryDateFormatter()
  // en-CA emits "2026-10-21, 19:46 EDT"; the comma is noise inside a bracketed record label.
  // Only the date/time separator is replaced — a GMT+5:30-style zone name carries no comma.
  try { return formatter.format(date).replace(', ', ' ') } catch { return '' }
}

export const fmt = (d: any, timezone?: string) => {
  if (!d) return ''
  try { return formatAISummaryDate(new Date(d), timezone) } catch { return '' }
}
export const fmtFromMS = (ms: any, timezone?: string) => {
  if (typeof ms !== 'number') return ''
  try { return formatAISummaryDate(new Date(ms), timezone) } catch { return '' }
}

// `createdAt` is never stored on a record. The REST layer synthesizes it from `_id` in
// convert_id_name, so records reaching the SDK loader carry one and records read straight from the
// DB do not — which made every formatter's `?? record.createdAt` fallback dead on the server and
// blanked the date on tickets, phone calls, orders, medications and purchases, and on any chat,
// SMS or email whose `timestamp` was never stamped. Filling it once here, in the loader, fixes
// every source at once. Deliberately NOT done inside the formatters: the SDK path already supplies
// `createdAt`, and only the server has an ObjectId to derive one from.
export const withDerivedCreatedAt = <T,>(records: T[]): T[] => (
  (Array.isArray(records) ? records : []).map(record => {
    // duck-typed on getTimestamp(): server-side `_id` is the Mongo driver's ObjectId
    if (typeof (record as any)?._id?.getTimestamp !== 'function') return record
    try {
      // spread last so a stored `createdAt` still wins
      return { createdAt: (record as any)._id.getTimestamp(), ...record }
    } catch {
      return record
    }
  })
)

export const fmtResponses = (responses: any) => {
  if (!Array.isArray(responses)) return ''
  return responses
    .map((r: any) => {
      const ans = r?.answer
      const v = ans?.value
      if (v === undefined || v === null) return ''
      if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
        return `${r.fieldTitle || ''}: ${v}`
      }
      if (Array.isArray(v)) return `${r.fieldTitle || ''}: ${v.map((x: any) => x?.label ?? x).join(', ')}`
      return ''
    })
    .filter(Boolean)
    .join(' | ')
}

/* --------- submitted-answer formatting (the answers are the *subject*, not context) --------- */

const fmtAnswerScalar = (v: any) => (
  typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' ? String(v) : ''
)

// Shallow `key: value` rendering for object-valued answers (signatures, files, addresses,
// insurance blocks). Deliberately one level deep — deeper nesting is metadata, not an answer.
const fmtAnswerObject = (v: any): string => {
  if (!v || typeof v !== 'object') return ''
  return Object.entries(v)
    .map(([k, val]) => {
      const rendered = (
        fmtAnswerScalar(val) || (
          Array.isArray(val)
            ? val.map((x: any) => fmtAnswerScalar(x?.label ?? x)).filter(Boolean).join(', ')
            : ''
        )
      )
      return rendered ? `${k}: ${rendered}` : ''
    })
    .filter(Boolean)
    .join(', ')
}

const fmtAnswerValue = (v: any): string => {
  if (v === undefined || v === null) return ''
  const scalar = fmtAnswerScalar(v)
  if (scalar) return scalar
  if (Array.isArray(v)) {
    return v
      .map((x: any) => fmtAnswerScalar(x?.label ?? x) || fmtAnswerObject(x))
      .filter(Boolean)
      .join(', ')
  }
  if (typeof v === 'object') return fmtAnswerObject(v)
  return ''
}

// Renders one form response's answers for a summary *of those answers*.
//
// fmtResponses (above) intentionally drops object-valued answers — signatures, files, addresses,
// insurance blocks — because they add noise when a response is only background chart context.
// That is not acceptable when the answers are the subject of the summary, so those are rendered
// here as a shallow key/value list instead. One answer per line rather than ' | '-joined, since
// this text is read closely rather than skimmed alongside other records.
//
// fmtResponses is left untouched so the form_responses data-source output stays byte-identical.
export const formatFormResponseAnswersForSummary = (responses: any): string => {
  if (!Array.isArray(responses)) return ''
  return responses
    .map((r: any) => {
      const value = r?.answer?.value
      if (value === undefined || value === null) return ''

      const title = r?.fieldTitle || ''
      // an empty answer on a question the patient was shown is itself informative
      const rendered = value === '' ? '(no answer)' : fmtAnswerValue(value)
      if (!rendered) return ''

      return title ? `${title}: ${rendered}` : rendered
    })
    .filter(Boolean)
    .join('\n')
}

export const fmtObservation = (o: any, _enduser?: Enduser | null, context?: AISummaryFormatContext) => {
  const m = o.measurement
  // numeric value + unit when present; fall back to qualitative result ("positive", etc.)
  const reading =
    m && typeof m.value === 'number'
      ? `${m.value}${m.unit ? ` ${m.unit}` : ''}`
      : (o.qualitativeResult ?? '')

  const name = o.type || o.code || o.category || ''      // what was measured
  const extras = [
    o.refRange ? `ref ${o.refRange}` : '',
    o.statusIndicator ?? '',                              // High / Low / Normal
  ].filter(Boolean).join(', ')

  const label = name ? `${name}: ` : ''
  const tail = extras ? ` (${extras})` : ''
  return `[Observation ${fmt(o.timestamp ?? o.recordedAt ?? o.createdAt, context?.timezone)}] ${label}${reading}${tail}`.trim()
}

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
export const fmtGroupMMSConversation = (
  c: any,
  _enduser?: Enduser | null,
  context?: AISummaryFormatContext,
): string => {
  const enduserIds: string[] = Array.isArray(c?.enduserIds) ? c.enduserIds : []
  const messages: any[] = Array.isArray(c?.messages) ? c.messages : []

  // The thread matched the lookback on `updatedAt` — the time of its most recent message — so an
  // active long-running thread arrives carrying history far outside the window. Each message is
  // windowed again on its own `timestamp` here, which is why the loader threads lookbackMS
  // through the format context. No lookback configured means the whole thread.
  const since = context?.lookbackMS ? Date.now() - context.lookbackMS : undefined
  const inWindow = (
    since === undefined
      ? messages
      : messages.filter(m => typeof m?.timestamp === 'number' && m.timestamp >= since)
  )
    // Both the header's "last" stamp and the keep-the-most-recent truncation below read position,
    // so chronological order is load-bearing. Every writer $pushes (so it holds today), but
    // nothing enforces it — sorting here makes the invariant the formatter's own.
    .slice()
    .sort((a: any, b: any) => (Number(a?.timestamp) || 0) - (Number(b?.timestamp) || 0))
  // Nothing recent enough to render. Reported as 'outside-lookback' rather than
  // 'no-readable-text': the thread is perfectly readable, it is just older than the window.
  if (inWindow.length === 0) return ''

  const lines = inWindow.map(m => {
    const sender = (m?.sender && enduserIds.includes(m.sender)) ? 'patient' : 'staff'
    // GroupMMSMessage.timestamp is epoch milliseconds (updatedAt, the sortField, is a Date)
    const stamp = fmtFromMS(m?.timestamp, context?.timezone)
    const images = Array.isArray(m?.images) ? m.images.length : 0
    // An MMS is often an image with no text at all, which would otherwise render as a blank line
    const attachments = images > 0 ? `(${images} image attachment${images === 1 ? '' : 's'})` : ''
    const message = typeof m?.message === 'string' ? m.message.trim() : ''
    // joined rather than concatenated: an image with no caption must not leave a double space
    return `  [${[stamp, sender].filter(Boolean).join(' ')}] ${[message, attachments].filter(Boolean).join(' ')}`.trimEnd()
  })

  const title = c?.title ?? ''
  const lastStamp = fmtFromMS(inWindow[inWindow.length - 1]?.timestamp, context?.timezone)
  const header = (omitted: number) => (
    `[Group MMS "${title}" ${lines.length} message${lines.length === 1 ? '' : 's'}`
    + `${lastStamp ? `, last ${lastStamp}` : ''}`
    + `${omitted > 0 ? `, oldest ${omitted} omitted for length` : ''}]`
  )

  // Truncation drops the OLDEST messages, unlike the leading `.slice(0, N)` articles and templates
  // use: an article reads from the top, while a thread over the budget is one with a long history
  // whose recent end is what the summary is about. Budgeted against the longest the header can
  // get (every message omitted) so the final string is always within MAX_AI_SUMMARY_RECORD_CHARS.
  const kept: string[] = []
  let used = header(lines.length).length
  for (let i = lines.length - 1; i >= 0; i--) {
    const cost = lines[i].length + 1 // + the newline that joins it on
    if (used + cost > MAX_AI_SUMMARY_RECORD_CHARS) break
    used += cost
    kept.unshift(lines[i])
  }
  // A single message longer than the whole budget would otherwise leave the record header-only
  if (kept.length === 0) {
    const truncated = lines[lines.length - 1].slice(0, Math.max(0, MAX_AI_SUMMARY_RECORD_CHARS - used - 1))
    if (truncated) kept.push(truncated)
  }

  return [header(lines.length - kept.length), ...kept].join('\n')
}

/* ---------------------------------- data source metadata ---------------------------------- */

export const DATA_SOURCE_LABELS: Record<AISummaryDataSource, string> = {
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
}

// Extra, source-specific context threaded into `format` by the loader. `chats` needs the room's
// member list to tell the patient's message from a staff reply; every source reads `timezone`,
// which is why it is threaded here rather than added as a fourth formatter argument.
//
// Built per source inside the loader's data-source loop, because `lookbackMS` is a property of the
// configured source rather than of the request.
export type AISummaryFormatContext = {
  // roomId -> that room's enduserIds
  enduserIdsByRoomId?: Record<string, string[]>,
  // the organization's IANA timezone. Unset or unrecognised renders in UTC (see fmt).
  timezone?: string,
  // This source's configured lookback. Only a formatter whose record CONTAINS a timeline of its
  // own needs it: a group MMS thread matches the window on its most recent message and then has
  // to drop the history that falls outside it. Unset means "no window" (All time).
  lookbackMS?: number,
}

// Why a loaded record produced no line. Surfaced per record in the sources drawer, so each value
// needs its own copy there — a group MMS thread with nothing recent is not a PDF nobody can read.
export type AISummarySkippedReason = 'no-readable-text' | 'outside-lookback'

export type DataSourceMapEntry = {
  // collection key equals the source key for every entry; callers map this to their own
  // transport (session.api[collection] / DB[collection]).
  collection: AISummaryDataSource,
  sortField: string,
  // `enduser` is supplied for sources whose rendering depends on the patient (template merge
  // fields). Enduser-scoped sources ignore it. `context` carries source-specific extras the
  // loader resolved up front (see AISummaryFormatContext).
  format: (record: any, enduser?: Enduser | null, context?: AISummaryFormatContext) => string,
  enduserMatchClause?: (enduserId: string) => object,
  // true when this source's sortField is only set by whatever happened to stamp it, so the
  // lookback must also admit records that never got one (matched on creation time instead).
  lookbackIncludesUnstampedRecords?: boolean,
  // true when sortField holds epoch milliseconds rather than a Date
  lookbackIsNumeric?: boolean,
  // true when the source is scoped to the patient's chat rooms rather than by an enduser clause
  roomScoped?: boolean,
  // true when records that were never actually sent — unsaved drafts, and sends still scheduled
  // for the future — must be excluded. Mirrors what database.ts already strips for enduser
  // sessions; the AI paths run with no enduser, so they would otherwise see them.
  excludeUnsentRecords?: boolean,
  // false = an org-wide reference collection with no enduserId link, so no enduser clause is
  // applied and records are chosen by `ids` instead of a recency window.
  enduserScoped?: boolean,
  // always-applied data-layer constraint, ANDed with the customer's filter
  baseFilter?: object,
  // true when `format` needs the enduser loaded even if the profile block is excluded
  formatNeedsEnduser?: boolean,
  // why a record of this source formats to '' — reported in the section's `skipped` list.
  // Defaults to 'no-readable-text', which is true of every source whose body is a blob of text.
  emptyFormatReason?: AISummarySkippedReason,
}

export const DATA_SOURCE_MAP: Record<AISummaryDataSource, DataSourceMapEntry> = {
  enduser_observations: {
    collection: 'enduser_observations',
    sortField: 'timestamp',
    format: fmtObservation,
  },
  form_responses: {
    collection: 'form_responses',
    sortField: 'submittedAt',
    format: (fr, _enduser, context) => `[Form "${fr.formTitle ?? ''}" ${fmt(fr.submittedAt ?? fr.createdAt, context?.timezone)}] ${fmtResponses(fr.responses)}`,
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
    format: (m, _enduser, context) => {
      const members = context?.enduserIdsByRoomId?.[m.roomId]
      // A sender in the room's enduserIds is the patient; anyone else (and an unknown room) is
      // staff. Erring towards 'staff' keeps an automated outbound chat from reading to the model
      // as the patient speaking.
      const sender = (m.senderId && members?.includes(m.senderId)) ? 'patient' : 'staff'
      return `[Chat ${fmt(m.timestamp ?? m.createdAt, context?.timezone)} ${sender}] ${m.message ?? ''}`
    },
  },
  phone_calls: {
    collection: 'phone_calls',
    sortField: 'createdAt',
    format: (c, _enduser, context) => `[Call ${fmt(c.createdAt, context?.timezone)} ${c.direction ?? ''} ${c.durationInSeconds ?? 0}s] ${c.aiSummary ?? c.summary ?? ''}`,
  },
  calendar_events: {
    collection: 'calendar_events',
    sortField: 'startTimeInMS',
    // startTimeInMS holds epoch milliseconds, so the lookback must compare numbers
    lookbackIsNumeric: true,
    format: (e, _enduser, context) => `[Appt ${fmtFromMS(e.startTimeInMS, context?.timezone)}] ${e.title ?? ''} (${e.type ?? ''})`,
    enduserMatchClause: enduserId => ({ 'attendees.id': enduserId }),
  },
  tickets: {
    collection: 'tickets',
    sortField: 'createdAt',
    // "How long has this been unresolved?" needs both ends of the ticket's life, so the closed
    // date is rendered rather than just the word "closed".
    format: (t, _enduser, context) => {
      const closedAt = t.closedAt ? fmt(t.closedAt, context?.timezone) : ''
      const status = t.closedAt ? `closed${closedAt ? ` ${closedAt}` : ''}` : 'open'
      return `[Ticket created ${fmt(t.createdAt, context?.timezone)}, ${status}] ${t.title ?? ''}`
    },
  },
  sms_messages: {
    collection: 'sms_messages',
    sortField: 'timestamp',
    lookbackIncludesUnstampedRecords: true,
    format: (s, _enduser, context) => `[SMS ${fmt(s.timestamp ?? s.createdAt, context?.timezone)} ${s.inbound ? 'in' : 'out'}] ${s.message ?? ''}`,
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
    enduserMatchClause: enduserId => ({ enduserIds: enduserId }),
    // Trashed threads are deleted by another name and stay out. `archivedAt`, `hiddenBy` and
    // `hiddenForAll` deliberately do NOT: staff set those as routine inbox triage on everything
    // they have dealt with, so excluding them would empty this source for most organizations.
    baseFilter: { $or: [{ trashedAt: { $in: [null, ''] } }, { trashedAt: { $exists: false } }] },
    emptyFormatReason: 'outside-lookback',
    format: fmtGroupMMSConversation,
  },
  emails: {
    collection: 'emails',
    sortField: 'timestamp',
    format: (e, _enduser, context) => {
      const body = e.textContent || stripHtml(e.HTMLContent || '')
      return `[Email ${fmt(e.timestamp ?? e.createdAt, context?.timezone)}] ${e.subject ?? ''}\n${body.slice(0, 2000)}`
    },
  },
  enduser_orders: {
    collection: 'enduser_orders',
    sortField: 'createdAt',
    format: (o, _enduser, context) => `[Order ${fmt(o.createdAt, context?.timezone)}] ${o.status ?? ''} — ${(o.items ?? []).map((i: any) => i.title ?? i.sku ?? '').filter(Boolean).join(', ')}`,
  },
  enduser_medications: {
    collection: 'enduser_medications',
    sortField: 'createdAt',
    format: (m, _enduser, context) => `[Medication ${fmt(m.createdAt, context?.timezone)}] ${m.title ?? ''} ${m.dosage ?? ''} ${m.status ?? ''}`.trim(),
  },
  purchases: {
    collection: 'purchases',
    sortField: 'createdAt',
    format: (p, _enduser, context) => `[Purchase ${fmt(p.createdAt, context?.timezone)}] ${p.title ?? ''} ${typeof p.amount === 'number' ? `$${p.amount}` : ''}`.trim(),
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
    format: (r: ManagedContentRecord) => {
      const body = plaintext_for_managed_content_record(r)
      if (!body?.trim()) return ''
      const description = r.description ? ` ${r.description}` : ''
      return `[Content "${r.title ?? ''}"]${description}\n${body.trim().slice(0, MAX_AI_SUMMARY_RECORD_CHARS)}`
    },
  },
  templates: {
    collection: 'templates',
    sortField: 'createdAt',
    enduserScoped: false,
    formatNeedsEnduser: true,
    format: (t: MessageTemplate, enduser) => {
      const raw = t.message || stripHtml(t.html || '')
      if (!raw?.trim()) return ''
      // Resolve {{merge}} fields so the model reads concrete text instead of placeholders.
      // Unresolvable ones stay literal; the caller's prompt tells the model to fill or drop them.
      const body = replace_enduser_template_values(raw, enduser)
      const subject = t.subject
        ? ` Subject: ${replace_enduser_template_values(t.subject, enduser)}`
        : ''
      const type = t.type ? ` type:${t.type}` : ''
      return `[Template "${t.title ?? ''}"${type}]${subject}\n${body.trim().slice(0, MAX_AI_SUMMARY_RECORD_CHARS)}`
    },
  },
}

export const enduserProfileToText = (e: Enduser): string => {
  const lines: string[] = []
  lines.push('## enduser')
  if (e.fname || e.lname) lines.push(`Name: ${e.fname ?? ''} ${e.lname ?? ''}`.trim())
  if (e.dateOfBirth) lines.push(`DOB: ${e.dateOfBirth}`)
  if (e.gender) lines.push(`Gender: ${e.gender}`)
  if (e.state) lines.push(`State: ${e.state}`)
  if (e.email) lines.push(`Email: ${e.email}`)
  if (e.phone) lines.push(`Phone: ${e.phone}`)
  if (e.tags?.length) lines.push(`Tags: ${e.tags.join(', ')}`)
  if (e.fields && typeof e.fields === 'object') {
    const entries = Object.entries(e.fields).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    if (entries.length) {
      lines.push('Custom fields:')
      for (const [k, v] of entries) {
        lines.push(`  - ${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`)
      }
    }
  }
  // Last, and as two lines: the note is free text that may itself be multi-line, so inlining it
  // after its label (the way Tags: does) would run its first line into the label and leave the
  // rest dangling. Placed after the custom-fields list so it can never split that list.
  if (e.note?.trim()) {
    lines.push('Notes:')
    lines.push(e.note)
  }
  return lines.join('\n')
}

/* ---------------------------------- filter sanitization ---------------------------------- */

export const FORBIDDEN_FILTER_OPERATORS = ['$where', '$function']
export const aiSummaryError = (code: number, message: string) => Object.assign(new Error(message), { code })

export const sanitizeFilter = (filter: any) => {
  if (!filter || typeof filter !== 'object') return {}
  const json = JSON.stringify(filter)
  for (const op of FORBIDDEN_FILTER_OPERATORS) {
    if (json.includes(op)) {
      throw aiSummaryError(400, `AI summary filter cannot contain ${op}`)
    }
  }
  return filter
}

/* ---------------------------------- context assembly ---------------------------------- */

export type AISummarySourceSection = {
  type: AISummaryDataSource,
  label: string,
  lookbackMS?: number,
  limit: number,
  records: any[],
  formattedLines: string[],
  // records that loaded but produced no usable text (e.g. a PDF selected before the Articles-only
  // filter, or an empty article). Surfaced in the sources drawer so exclusions are visible.
  skipped: { id: string, title?: string, reason: AISummarySkippedReason }[],
  // heading used for this section's block in the context text
  heading: string,
}

export type AISummaryContext = {
  contextText: string,
  estimatedTokens: number,
  profileBlock: string,
  sources: AISummarySourceSection[],
}

// The lookback window for one source. Built fresh on every call: transformFilterForQuery
// (api/modules/database.ts) rewrites the never-stored `createdAt` to `_id` by MUTATING the filter
// it is handed, so a shared clause object would be corrupted by the first source that used it.
export const buildAISummaryLookbackClause = (
  lookbackMS: number | undefined,
  mapEntry: DataSourceMapEntry,
): object => {
  if (!lookbackMS) return {}
  const since = Date.now() - lookbackMS

  // startTimeInMS holds epoch milliseconds, so this has to be a plain number — and must stay one
  // through the webapp transport, which JSON-serialises the clause and revives ISO date strings
  // as Dates. Comparing a Date against a number matched nothing at all.
  if (mapEntry.lookbackIsNumeric) return { [mapEntry.sortField]: { $gte: since } }

  // Sources whose sortField is only set by whatever stamped it. An inbound Twilio SMS is written
  // with a raw insert that bypasses the routed-create initializer, so it has no `timestamp` at
  // all and `{timestamp:{$gte:D}}` silently dropped the patient's own message. Event time is
  // still preferred where it exists — a scheduled send is created days before it goes out, so
  // windowing on creation time alone would place it wrongly.
  if (mapEntry.lookbackIncludesUnstampedRecords) {
    return {
      $or: [
        { [mapEntry.sortField]: { $gte: new Date(since) } },
        { [mapEntry.sortField]: { $exists: false }, createdAt: { $gte: new Date(since) } },
      ],
    }
  }

  return { [mapEntry.sortField]: { $gte: new Date(since) } }
}

// Drafts and future-dated scheduled sends are not conversation: nobody has said them yet. The old
// `{enduserId}` chats clause excluded them as a side effect (a staff draft carries no enduserId);
// scoping by room does not, so they are excluded explicitly rather than being allowed to steer an
// AI Decision branch or land in a generated note. Shape copied from the enduser-session guard in
// api/modules/database.ts, which strips exactly these for patients.
export const buildAISummaryUnsentClause = (): object => ({
  $and: [
    { isDraft: { $ne: true } },
    { $or: [{ sendAt: { $in: [null, ''] } }, { sendAt: { $exists: false } }, { sendAt: { $lte: new Date() } }] },
  ],
})

// Build the mongo filter + effective limit for a single data source. Shared by both loaders so
// the lookback / enduserMatch / sanitized-filter / default-limit logic stays identical.
// `ids` is returned rather than folded into mdbFilter: _id needs ObjectId conversion on the DB
// side, and the readMany endpoint takes `ids` natively, so each transport applies it.
export const buildAISummarySourceFilter = ({ ds, enduserId, mapEntry, roomIds } : {
  ds: AISummaryDataSourceConfig,
  enduserId: string,
  mapEntry: DataSourceMapEntry,
  // the patient's chat room ids, resolved by the loader for roomScoped sources
  roomIds?: string[],
}): { mdbFilter: object, effectiveLimit: number, ids?: string[] } => {
  const userFilter = sanitizeFilter(ds.filter)
  const lookbackClause = buildAISummaryLookbackClause(ds.lookbackMS, mapEntry)

  const enduserMatch = (
    mapEntry.enduserScoped === false
      ? {}
      // A patient with no rooms must load NOTHING. `{roomId:{$in:[]}}` says exactly that; omitting
      // the clause would hand the prompt the newest chats in the whole organization.
      : mapEntry.roomScoped ? { roomId: { $in: roomIds ?? [] } }
      : mapEntry.enduserMatchClause ? mapEntry.enduserMatchClause(enduserId) : { enduserId }
  )
  const unsentClause = mapEntry.excludeUnsentRecords ? buildAISummaryUnsentClause() : {}
  const mdbFilter = { $and: [userFilter, lookbackClause, enduserMatch, mapEntry.baseFilter ?? {}, unsentClause] }
  const effectiveLimit = ds.limit ?? DEFAULT_AI_SUMMARY_DATA_SOURCE_LIMIT

  return { mdbFilter, effectiveLimit, ids: ds.ids?.length ? ds.ids : undefined }
}

export type AISummaryChatRooms = {
  roomIds: string[],
  enduserIdsByRoomId: Record<string, string[]>,
}

// Normalise whatever shape a transport's chat_rooms fetcher returned into room ids + members.
// The two shapes differ: DB.chat_rooms.findPage yields `_id` as an ObjectId, while
// session.api.chat_rooms.getSome yields a string `id`. chats.roomId is a STRING
// (mongoIdStringValidator), so every id must be stringified or the `$in` matches nothing.
export const normalizeAISummaryChatRooms = (rooms: any): AISummaryChatRooms => {
  const roomIds: string[] = []
  const enduserIdsByRoomId: Record<string, string[]> = {}

  for (const room of (Array.isArray(rooms) ? rooms : [])) {
    const id = room?.id ?? room?._id?.toString?.()
    if (!id) continue
    roomIds.push(id)
    enduserIdsByRoomId[id] = Array.isArray(room?.enduserIds) ? room.enduserIds : []
  }

  return { roomIds, enduserIdsByRoomId }
}

// "Two days ago" is unanswerable without knowing what today is, and every record timestamp below
// is rendered in one zone, so both facts are stated once at the top of the context. Emitted
// unconditionally — even when no source produced a line — so the model never has to guess either.
export const aiSummaryCurrentDateBlock = (timezone?: string, now: Date = new Date()): string => (
  `Current date and time: ${fmt(now, timezone)} (${aiSummaryTimezoneLabel(timezone)}). `
  + `All timestamps in this context are in this timezone.`
)

// Join the current-date header + profile block + per-source blocks, estimate tokens, and enforce
// the input budget.
export const assembleAISummaryContext = ({ profileBlock, sources, timezone, now } : {
  profileBlock: string,
  sources: AISummarySourceSection[],
  // the organization's IANA timezone; unset or unrecognised renders in UTC
  timezone?: string,
  // injectable for tests; production always uses the real clock
  now?: Date,
}): AISummaryContext => {
  const blocks = sources
    .filter(s => s.formattedLines.length > 0)
    .map(s => `## ${s.heading}\n${s.formattedLines.join('\n')}`)

  const contextText = [aiSummaryCurrentDateBlock(timezone, now), profileBlock, ...blocks].filter(Boolean).join('\n\n')
  const estimatedTokens = Math.ceil(contextText.length / 4)
  if (estimatedTokens > MAX_AI_SUMMARY_INPUT_TOKENS) {
    throw aiSummaryError(413, 'AI summary input exceeds token budget — reduce limits, shorten lookback, or remove data sources.')
  }
  return { contextText, estimatedTokens, profileBlock, sources }
}

/* ---------------------------------- transport-agnostic loader ---------------------------------- */

export type LoadAISummaryRecordsArgs = {
  type: AISummaryDataSource,
  collection: AISummaryDataSource,
  mdbFilter: object,
  limit: number,
  sortField: string,
  // when set, restrict to these record ids (see buildAISummarySourceFilter)
  ids?: string[],
}

// Transport-agnostic loader. Callers inject loadProfile/loadRecords backed by the SDK (webapp) or
// the DB (api). Per-source failures degrade to an empty section so one broken collection doesn't
// sink the whole summary; filter-sanitization (400) and the token-budget (413) errors still throw.
export const loadAISummaryContext = async ({
  enduserId, configuration, loadProfile, loadRecords, loadChatRooms, includeProfile = true, timezone,
} : {
  enduserId: string,
  configuration: AISummaryConfiguration,
  loadProfile: (enduserId: string) => Promise<Enduser>,
  loadRecords: (args: LoadAISummaryRecordsArgs) => Promise<any[]>,
  // the patient's chat rooms, for the roomScoped `chats` source. Must match on `enduserIds` only
  // and never `aboutEnduserId`: internal care-team rooms ABOUT a patient stay out of AI prompts.
  // Left out, `chats` loads nothing rather than falling back to an unscoped query.
  loadChatRooms?: (enduserId: string) => Promise<any[]>,
  // include the enduser profile block (name/DOB/fields/custom fields/Notes box) in the context. Defaults to
  // true for the summary use case; the AI Decision step passes false to avoid prompt clutter.
  includeProfile?: boolean,
  // The organization's IANA timezone (resolved by the caller — sub-organization wins). Every
  // record timestamp and the current-date header render in it. Unset or unrecognised => UTC.
  timezone?: string,
}): Promise<AISummaryContext> => {
  const dataSources = configuration.dataSources ?? []
  // some formatters (message templates) need the patient to resolve merge fields, so load the
  // enduser for those even when the profile block itself is excluded from the context
  const needsEnduserForFormat = dataSources.some(ds => DATA_SOURCE_MAP[ds.type]?.formatNeedsEnduser)
  const enduser = (includeProfile || needsEnduserForFormat) ? await loadProfile(enduserId) : null
  const profileBlock = (includeProfile && enduser) ? enduserProfileToText(enduser) : ''

  // Resolved once up front: every roomScoped source needs both the ids (to filter on) and each
  // room's members (to label a message's sender). A failure here degrades to "no rooms", matching
  // the per-source try/catch below — so a broken lookup empties the chats section rather than
  // widening the query.
  let chatRooms: AISummaryChatRooms = { roomIds: [], enduserIdsByRoomId: {} }
  if (loadChatRooms && dataSources.some(ds => DATA_SOURCE_MAP[ds.type]?.roomScoped)) {
    try {
      chatRooms = normalizeAISummaryChatRooms(await loadChatRooms(enduserId))
    } catch (err) {
      console.error('Failed to load chat rooms for AI summary', err)
    }
  }
  // Everything that is the same for every source. `lookbackMS` is added per source below.
  const sharedFormatContext: AISummaryFormatContext = { enduserIdsByRoomId: chatRooms.enduserIdsByRoomId, timezone }

  const sections = await Promise.all(dataSources.map(async (ds: AISummaryDataSourceConfig): Promise<AISummarySourceSection | null> => {
    const m = DATA_SOURCE_MAP[ds.type]
    if (!m) return null

    const { mdbFilter, effectiveLimit, ids } = buildAISummarySourceFilter({ ds, enduserId, mapEntry: m, roomIds: chatRooms.roomIds })
    // Two sources of the same type may be configured with different windows, so the lookback is
    // per source and the context has to be built here rather than once for the whole request.
    const formatContext: AISummaryFormatContext = { ...sharedFormatContext, lookbackMS: ds.lookbackMS }
    const base = {
      type: ds.type,
      label: DATA_SOURCE_LABELS[ds.type] ?? ds.type,
      heading: ds.label || ds.type,
      lookbackMS: ds.lookbackMS,
      limit: effectiveLimit,
    }

    // Reference collections are selected exclusively by ids — an empty selection means "load
    // nothing", never "no id restriction" (which would pull the newest org-wide records into the prompt)
    if (m.enduserScoped === false && !ids) return { ...base, records: [], formattedLines: [], skipped: [] }

    try {
      const records = await loadRecords({ type: ds.type, collection: m.collection, mdbFilter, limit: effectiveLimit, sortField: m.sortField, ids })
      const list: any[] = Array.isArray(records) ? records : []

      const formattedLines: string[] = []
      const skipped: AISummarySourceSection['skipped'] = []
      for (const record of list) {
        const line = m.format(record, enduser, formatContext)
        if (line) formattedLines.push(line)
        else skipped.push({
          id: record?.id ?? record?._id?.toString?.() ?? '',
          title: record?.title,
          reason: m.emptyFormatReason ?? 'no-readable-text',
        })
      }

      return { ...base, records: list, formattedLines, skipped }
    } catch (err) {
      console.error(`Failed to load ${ds.type} for AI summary`, err)
      return { ...base, records: [], formattedLines: [], skipped: [] }
    }
  }))

  const sources = sections.filter((s): s is AISummarySourceSection => s !== null)
  return assembleAISummaryContext({ profileBlock, sources, timezone })
}
