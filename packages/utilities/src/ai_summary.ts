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

export const fmt = (d: any) => {
  if (!d) return ''
  try { return new Date(d).toISOString().slice(0, 16).replace('T', ' ') } catch { return '' }
}
export const fmtFromMS = (ms: any) => {
  if (typeof ms !== 'number') return ''
  try { return new Date(ms).toISOString().slice(0, 16).replace('T', ' ') } catch { return '' }
}
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
export const fmtObservation = (o: any) => {
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
  return `[Observation ${fmt(o.timestamp ?? o.recordedAt ?? o.createdAt)}] ${label}${reading}${tail}`.trim()
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
  emails: 'Emails',
  enduser_orders: 'Orders',
  enduser_medications: 'Medications',
  purchases: 'Purchases',
  managed_content_records: 'Content (Articles)',
  templates: 'Message Templates',
}

export type DataSourceMapEntry = {
  // collection key equals the source key for every entry; callers map this to their own
  // transport (session.api[collection] / DB[collection]).
  collection: AISummaryDataSource,
  sortField: string,
  // `enduser` is supplied for sources whose rendering depends on the patient (template merge
  // fields). Enduser-scoped sources ignore it.
  format: (record: any, enduser?: Enduser | null) => string,
  enduserMatchClause?: (enduserId: string) => object,
  // false = an org-wide reference collection with no enduserId link, so no enduser clause is
  // applied and records are chosen by `ids` instead of a recency window.
  enduserScoped?: boolean,
  // always-applied data-layer constraint, ANDed with the customer's filter
  baseFilter?: object,
  // true when `format` needs the enduser loaded even if the profile block is excluded
  formatNeedsEnduser?: boolean,
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
    format: fr => `[Form "${fr.formTitle ?? ''}" ${fmt(fr.submittedAt ?? fr.createdAt)}] ${fmtResponses(fr.responses)}`,
  },
  chats: {
    collection: 'chats',
    sortField: 'timestamp',
    // enduserId is set only on enduser-authored chats (schema initializer); senderId is always set
    // (userId for staff, enduserId for patients) so it can't distinguish the sender.
    format: m => `[Chat ${fmt(m.timestamp ?? m.createdAt)} ${m.enduserId ? 'patient' : 'staff'}] ${m.message ?? ''}`,
  },
  phone_calls: {
    collection: 'phone_calls',
    sortField: 'createdAt',
    format: c => `[Call ${fmt(c.createdAt)} ${c.direction ?? ''} ${c.durationInSeconds ?? 0}s] ${c.aiSummary ?? c.summary ?? ''}`,
  },
  calendar_events: {
    collection: 'calendar_events',
    sortField: 'startTimeInMS',
    format: e => `[Appt ${fmtFromMS(e.startTimeInMS)}] ${e.title ?? ''} (${e.type ?? ''})`,
    enduserMatchClause: enduserId => ({ 'attendees.id': enduserId }),
  },
  tickets: {
    collection: 'tickets',
    sortField: 'createdAt',
    format: t => `[Ticket ${fmt(t.createdAt)} ${t.closedAt ? 'closed' : 'open'}] ${t.title ?? ''}`,
  },
  sms_messages: {
    collection: 'sms_messages',
    sortField: 'timestamp',
    format: s => `[SMS ${fmt(s.timestamp ?? s.createdAt)} ${s.inbound ? 'in' : 'out'}] ${s.message ?? ''}`,
  },
  emails: {
    collection: 'emails',
    sortField: 'timestamp',
    format: e => {
      const body = e.textContent || stripHtml(e.HTMLContent || '')
      return `[Email ${fmt(e.timestamp ?? e.createdAt)}] ${e.subject ?? ''}\n${body.slice(0, 2000)}`
    },
  },
  enduser_orders: {
    collection: 'enduser_orders',
    sortField: 'createdAt',
    format: o => `[Order ${fmt(o.createdAt)}] ${o.status ?? ''} — ${(o.items ?? []).map((i: any) => i.title ?? i.sku ?? '').filter(Boolean).join(', ')}`,
  },
  enduser_medications: {
    collection: 'enduser_medications',
    sortField: 'createdAt',
    format: m => `[Medication ${fmt(m.createdAt)}] ${m.title ?? ''} ${m.dosage ?? ''} ${m.status ?? ''}`.trim(),
  },
  purchases: {
    collection: 'purchases',
    sortField: 'createdAt',
    format: p => `[Purchase ${fmt(p.createdAt)}] ${p.title ?? ''} ${typeof p.amount === 'number' ? `$${p.amount}` : ''}`.trim(),
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
  skipped: { id: string, title?: string, reason: 'no-readable-text' }[],
  // heading used for this section's block in the context text
  heading: string,
}

export type AISummaryContext = {
  contextText: string,
  estimatedTokens: number,
  profileBlock: string,
  sources: AISummarySourceSection[],
}

// Build the mongo filter + effective limit for a single data source. Shared by both loaders so
// the lookback / enduserMatch / sanitized-filter / default-limit logic stays identical.
// `ids` is returned rather than folded into mdbFilter: _id needs ObjectId conversion on the DB
// side, and the readMany endpoint takes `ids` natively, so each transport applies it.
export const buildAISummarySourceFilter = ({ ds, enduserId, mapEntry } : {
  ds: AISummaryDataSourceConfig,
  enduserId: string,
  mapEntry: DataSourceMapEntry,
}): { mdbFilter: object, effectiveLimit: number, ids?: string[] } => {
  const userFilter = sanitizeFilter(ds.filter)
  const lookbackClause = ds.lookbackMS
    ? { [mapEntry.sortField]: { $gte: new Date(Date.now() - ds.lookbackMS) } }
    : {}

  const enduserMatch = (
    mapEntry.enduserScoped === false
      ? {}
      : mapEntry.enduserMatchClause ? mapEntry.enduserMatchClause(enduserId) : { enduserId }
  )
  const mdbFilter = { $and: [userFilter, lookbackClause, enduserMatch, mapEntry.baseFilter ?? {}] }
  const effectiveLimit = ds.limit ?? DEFAULT_AI_SUMMARY_DATA_SOURCE_LIMIT

  return { mdbFilter, effectiveLimit, ids: ds.ids?.length ? ds.ids : undefined }
}

// Join the profile block + per-source blocks, estimate tokens, and enforce the input budget.
export const assembleAISummaryContext = ({ profileBlock, sources } : {
  profileBlock: string,
  sources: AISummarySourceSection[],
}): AISummaryContext => {
  const blocks = sources
    .filter(s => s.formattedLines.length > 0)
    .map(s => `## ${s.heading}\n${s.formattedLines.join('\n')}`)

  const contextText = [profileBlock, ...blocks].filter(Boolean).join('\n\n')
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
  enduserId, configuration, loadProfile, loadRecords, includeProfile = true,
} : {
  enduserId: string,
  configuration: AISummaryConfiguration,
  loadProfile: (enduserId: string) => Promise<Enduser>,
  loadRecords: (args: LoadAISummaryRecordsArgs) => Promise<any[]>,
  // include the enduser profile block (name/DOB/fields/custom fields) in the context. Defaults to
  // true for the summary use case; the AI Decision step passes false to avoid prompt clutter.
  includeProfile?: boolean,
}): Promise<AISummaryContext> => {
  const dataSources = configuration.dataSources ?? []
  // some formatters (message templates) need the patient to resolve merge fields, so load the
  // enduser for those even when the profile block itself is excluded from the context
  const needsEnduserForFormat = dataSources.some(ds => DATA_SOURCE_MAP[ds.type]?.formatNeedsEnduser)
  const enduser = (includeProfile || needsEnduserForFormat) ? await loadProfile(enduserId) : null
  const profileBlock = (includeProfile && enduser) ? enduserProfileToText(enduser) : ''

  const sections = await Promise.all(dataSources.map(async (ds: AISummaryDataSourceConfig): Promise<AISummarySourceSection | null> => {
    const m = DATA_SOURCE_MAP[ds.type]
    if (!m) return null

    const { mdbFilter, effectiveLimit, ids } = buildAISummarySourceFilter({ ds, enduserId, mapEntry: m })
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
        const line = m.format(record, enduser)
        if (line) formattedLines.push(line)
        else skipped.push({ id: record?.id ?? record?._id?.toString?.() ?? '', title: record?.title, reason: 'no-readable-text' })
      }

      return { ...base, records: list, formattedLines, skipped }
    } catch (err) {
      console.error(`Failed to load ${ds.type} for AI summary`, err)
      return { ...base, records: [], formattedLines: [], skipped: [] }
    }
  }))

  const sources = sections.filter((s): s is AISummarySourceSection => s !== null)
  return assembleAISummaryContext({ profileBlock, sources })
}
