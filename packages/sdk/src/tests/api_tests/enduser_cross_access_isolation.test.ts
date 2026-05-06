require('source-map-support').install();

import { Session, EnduserSession } from "../../sdk"
import {
  assert,
  async_test,
  handleAnyError,
  log_header,
} from "@tellescope/testing"
import { schema } from "@tellescope/schema"
import { ModelName } from "@tellescope/types-models"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const
const businessId = '60398b1131a295e64f084ff6'

type OwnerField = 'enduserId' | 'enduserIds' | 'attendees.id'

type ModelSetupResult = {
  payloadOverride?: Record<string, any>
  cleanup: () => Promise<void>
}

type ModelCase = {
  model: string
  ownerField: OwnerField
  buildPayload: (enduserBId: string) => Record<string, any>
  setup?: (sdk: Session, enduserBId: string) => Promise<ModelSetupResult>
}

const buildAttendees = (enduserId: string) => [{ id: enduserId, type: 'enduser' as const }]

// Per-model coverage of every enduser-scoped read / ownership-mutation endpoint.
// New enduser-scoped models added with a FilterAccessConstraint on enduserId,
// enduserIds, or attendees.id MUST be added here (or to EXEMPT_MODELS) — the
// schema drift guard below will fail the test until coverage is added.
const MODEL_CASES: ModelCase[] = [
  {
    model: 'tickets',
    ownerField: 'enduserId',
    buildPayload: (enduserBId) => ({ enduserId: enduserBId, title: 'isolation: ticket' }),
  },
  {
    model: 'engagement_events',
    ownerField: 'enduserId',
    buildPayload: (enduserBId) => ({ enduserId: enduserBId, type: 'isolation', significance: 1 }),
  },
  {
    model: 'enduser_observations',
    ownerField: 'enduserId',
    buildPayload: (enduserBId) => ({
      enduserId: enduserBId,
      status: 'final',
      category: 'vital-signs',
      measurement: { unit: 'mmHg', value: 120 },
    }),
  },
  {
    model: 'enduser_tasks',
    ownerField: 'enduserId',
    buildPayload: (enduserBId) => ({ enduserId: enduserBId, title: 'isolation: task' }),
  },
  {
    model: 'care_plans',
    ownerField: 'enduserId',
    buildPayload: (enduserBId) => ({ enduserId: enduserBId, title: 'isolation: care plan' }),
  },
  {
    model: 'enduser_medications',
    ownerField: 'enduserId',
    buildPayload: (enduserBId) => ({ enduserId: enduserBId, title: 'isolation: medication' }),
  },
  {
    model: 'enduser_orders',
    ownerField: 'enduserId',
    buildPayload: (enduserBId) => ({
      enduserId: enduserBId,
      title: 'isolation: order',
      status: 'pending',
      source: 'isolation-test',
      externalId: `iso-${Date.now()}`,
    }),
  },
  {
    model: 'enduser_problems',
    ownerField: 'enduserId',
    buildPayload: (enduserBId) => ({
      enduserId: enduserBId,
      title: 'isolation: problem',
    }),
  },
  {
    model: 'managed_content_record_assignments',
    ownerField: 'enduserId',
    setup: async (sdk, _enduserBId) => {
      const content = await sdk.api.managed_content_records.createOne({
        title: `isolation content ${Date.now()}`,
        textContent: 'isolation',
        htmlContent: '<p>isolation</p>',
      })
      return {
        payloadOverride: { contentId: content.id },
        cleanup: async () => { await sdk.api.managed_content_records.deleteOne(content.id).catch(() => {}) },
      }
    },
    buildPayload: (enduserBId) => ({ enduserId: enduserBId }),
  },
  {
    model: 'purchases',
    ownerField: 'enduserId',
    buildPayload: (enduserBId) => ({
      enduserId: enduserBId,
      title: 'isolation: purchase',
      cost: { amount: 100, currency: 'USD' },
      processor: 'Stripe',
    }),
  },
  {
    model: 'purchase_credits',
    ownerField: 'enduserId',
    buildPayload: (enduserBId) => ({
      enduserId: enduserBId,
      title: 'isolation: credit',
      value: { type: 'Credit', info: { amount: 50, currency: 'USD' } },
    }),
  },
  {
    model: 'chat_rooms',
    ownerField: 'enduserIds',
    buildPayload: (enduserBId) => ({
      type: 'internal',
      userIds: [],
      enduserIds: [enduserBId],
      title: 'isolation: chat_room',
    }),
  },
  {
    model: 'chats',
    ownerField: 'enduserId',
    setup: async (sdk, enduserBId) => {
      const room = await sdk.api.chat_rooms.createOne({
        type: 'internal',
        userIds: [],
        enduserIds: [enduserBId],
        title: 'isolation: chats parent',
      })
      return {
        payloadOverride: { roomId: room.id, senderId: enduserBId },
        cleanup: async () => { await sdk.api.chat_rooms.deleteOne(room.id).catch(() => {}) },
      }
    },
    buildPayload: (enduserBId) => ({ message: 'isolation chat', enduserId: enduserBId }),
  },
  {
    model: 'calendar_events',
    ownerField: 'attendees.id',
    buildPayload: (enduserBId) => ({
      title: 'isolation: calendar_event',
      durationInMinutes: 30,
      startTimeInMS: Date.now() + 86_400_000,
      attendees: buildAttendees(enduserBId),
    }),
  },
  {
    model: 'ticket_threads',
    ownerField: 'enduserId',
    buildPayload: (enduserBId) => ({
      enduserId: enduserBId,
      subject: 'isolation: thread',
    }),
  },
  {
    model: 'ticket_thread_comments',
    ownerField: 'enduserId',
    setup: async (sdk, enduserBId) => {
      const thread = await sdk.api.ticket_threads.createOne({
        enduserId: enduserBId,
        subject: 'isolation: thread comments parent',
      })
      return {
        payloadOverride: { ticketThreadId: thread.id },
        cleanup: async () => { await sdk.api.ticket_threads.deleteOne(thread.id).catch(() => {}) },
      }
    },
    buildPayload: (enduserBId) => ({
      enduserId: enduserBId,
      ticketThreadId: '',
      html: '<p>isolation</p>',
      plaintext: 'isolation',
      inbound: true,
      public: false,
    }),
  },
  {
    model: 'form_responses',
    ownerField: 'enduserId',
    setup: async (sdk, _enduserBId) => {
      const form = await sdk.api.forms.createOne({ title: `isolation form ${Date.now()}` })
      return {
        payloadOverride: { formId: form.id },
        cleanup: async () => { await sdk.api.forms.deleteOne(form.id).catch(() => {}) },
      }
    },
    buildPayload: (enduserBId) => ({
      enduserId: enduserBId,
      formId: '',
      formTitle: 'isolation form',
    }),
  },
  {
    model: 'enduser_eligibility_results',
    ownerField: 'enduserId',
    buildPayload: (enduserBId) => ({
      enduserId: enduserBId,
      title: 'isolation: eligibility',
      type: 'Prescription',
      externalId: `iso-${Date.now()}`,
      source: 'isolation-test',
      status: 'Pending',
    }),
  },
]

const COVERED_MODELS = new Set(MODEL_CASES.map(c => c.model))

// Models that have a FilterAccessConstraint on enduserId / enduserIds /
// attendees.id but are intentionally NOT exercised here. Each entry must
// include a one-line reason. Empty by default; add only with justification.
const EXEMPT_MODELS: { model: string, reason: string }[] = [
  {
    model: 'meetings',
    reason: 'No default CRUD ops — created via admin-only start_meeting and read by endusers via custom my_meetings/read/join_meeting_for_event actions, which do not match this fixture pattern.',
  },
]

const RELEVANT_OWNER_FIELDS = new Set<string>(['enduserId', 'enduserIds', 'attendees.id'])

const discoverEnduserScopedModels = (): string[] => {
  const found: string[] = []
  for (const name of Object.keys(schema) as (keyof typeof schema)[]) {
    const model = schema[name] as any
    const access = model?.constraints?.access as Array<{ type: string, field?: string }> | undefined
    if (!access) continue
    const hasFilter = access.some(c => c?.type === 'filter' && typeof c.field === 'string' && RELEVANT_OWNER_FIELDS.has(c.field))
    if (hasFilter) found.push(name as string)
  }
  return found
}

const assertNotPresent = (records: { id: string }[], id: string, label: string) => {
  assert(
    !records.find(r => r.id === id),
    `${label} returned record owned by other enduser (id=${id})`,
    label,
  )
}

const expectForbidden = <T>(label: string, run: () => Promise<T>) => async_test(label, run, handleAnyError)

const expectEmptyOrForbidden = <T>(label: string, run: () => Promise<T[]>) => async_test(
  label,
  async () => {
    try {
      const r = await run()
      return { rejected: false, length: r.length }
    } catch (_e) {
      return { rejected: true, length: 0 }
    }
  },
  { onResult: r => r.rejected || r.length === 0 },
)

const expectMatchesEmptyOrForbidden = (label: string, run: () => Promise<{ matches: any[] }>) => async_test(
  label,
  async () => {
    try {
      const r = await run()
      return { rejected: false, length: (r?.matches ?? []).length }
    } catch (_e) {
      return { rejected: true, length: 0 }
    }
  },
  { onResult: r => r.rejected || r.length === 0 },
)

const expectGetOneFails = <T>(label: string, run: () => Promise<T>) => async_test(
  label,
  async () => {
    try {
      const r = await run()
      // some models may return undefined on no-match; that's also acceptable
      return { rejected: false, found: !!r }
    } catch (_e) {
      return { rejected: true, found: false }
    }
  },
  { onResult: r => r.rejected || !r.found },
)

const recordHasOwner = (record: any, ownerField: OwnerField, enduserId: string): boolean => {
  if (!record) return false
  if (ownerField === 'enduserId') return record.enduserId === enduserId
  if (ownerField === 'enduserIds') return Array.isArray(record.enduserIds) && record.enduserIds.includes(enduserId)
  if (ownerField === 'attendees.id') return Array.isArray(record.attendees) && record.attendees.some((a: any) => a?.id === enduserId)
  return false
}

export const enduser_cross_access_isolation_tests = async (
  { sdk, sdkNonAdmin: _sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }
) => {
  log_header("Enduser cross-access isolation")

  // ===== Schema drift guard =====
  const discovered = discoverEnduserScopedModels()
  const exemptSet = new Set(EXEMPT_MODELS.map(e => e.model))
  const missing = discovered.filter(m => !COVERED_MODELS.has(m) && !exemptSet.has(m))
  assert(
    missing.length === 0,
    `Missing isolation coverage for enduser-scoped models: ${missing.join(', ')}. ` +
    `Add to MODEL_CASES or EXEMPT_MODELS in enduser_cross_access_isolation.test.ts.`,
    'schema drift guard: every FilterAccessConstraint on enduserId/enduserIds/attendees.id is covered',
  )

  const password = 'IsolationTestPassword123!'
  const ts = Date.now()
  const enduserA = await sdk.api.endusers.createOne({ email: `iso_a_${ts}@test.tellescope.com` })
  const enduserB = await sdk.api.endusers.createOne({ email: `iso_b_${ts}@test.tellescope.com` })

  await sdk.api.endusers.set_password({ id: enduserA.id, password })
  await sdk.api.endusers.set_password({ id: enduserB.id, password })

  const sdkA = new EnduserSession({ host, businessId })
  const sdkB = new EnduserSession({ host, businessId })

  try {
    // Sanity check: each enduser session can authenticate. We only use sdkA
    // for negative assertions, but a failed sdkB auth would mean the test
    // data setup itself is malformed.
    await sdkA.authenticate(enduserA.email!, password)
    await sdkB.authenticate(enduserB.email!, password)

    for (const c of MODEL_CASES) {
      const sublog = (variant: string) => `${c.model}: ${variant}`

      let setupResult: ModelSetupResult | undefined
      if (c.setup) {
        try {
          setupResult = await c.setup(sdk, enduserB.id)
        } catch (e) {
          assert(false, `${c.model}: setup hook failed: ${(e as Error).message}`, sublog('setup'))
          continue
        }
      }

      const payload = { ...c.buildPayload(enduserB.id), ...(setupResult?.payloadOverride ?? {}) }

      let createdId: string | undefined
      try {
        const created = await (sdk.api as any)[c.model].createOne(payload)
        createdId = created?.id
      } catch (e) {
        assert(false, `${c.model}: admin createOne failed: ${(e as Error).message}`, sublog('admin createOne'))
        if (setupResult) await setupResult.cleanup().catch(() => {})
        continue
      }

      if (!createdId) {
        assert(false, `${c.model}: admin createOne did not return an id`, sublog('admin createOne'))
        if (setupResult) await setupResult.cleanup().catch(() => {})
        continue
      }

      const enduserApi = (sdkA.api as any)[c.model]

      try {
        // 0a. Fixture sanity: admin can re-fetch the record AND its owner
        // field is actually set to enduser B. Without this, A's negative
        // assertions could pass trivially (e.g. if createOne silently
        // dropped the ownership field, no enduser would ever match).
        await async_test(
          sublog('fixture: admin re-fetch confirms ownership set to enduser B'),
          async () => {
            const fetched = await (sdk.api as any)[c.model].getOne(createdId!)
            return { fetched, owned: recordHasOwner(fetched, c.ownerField, enduserB.id) }
          },
          { onResult: r => !!r.fetched && r.owned === true },
        )

        // 0b. Fixture sanity: enduser B (the legitimate owner) can see the
        // record via getOne. Models that block all enduser reads (empty
        // enduserActions) will reject — that's accepted. The check fails
        // only if B is "found" returns a different record id.
        await async_test(
          sublog('fixture: owner enduser B can fetch own record (or model blocks endusers)'),
          async () => {
            try {
              const fetched = await (sdkB.api as any)[c.model].getOne(createdId!)
              return { rejected: false, matched: !!fetched && fetched.id === createdId }
            } catch (_e) {
              return { rejected: true, matched: false }
            }
          },
          { onResult: r => r.rejected || r.matched },
        )

        // 1. getOne by id — expect throw or undefined
        await expectGetOneFails(
          sublog('getOne by id rejects or returns nothing'),
          () => enduserApi.getOne(createdId!),
        )

        // 2. getOne by ownership filter — expect throw or undefined
        await expectGetOneFails(
          sublog('getOne by owner filter rejects or returns nothing'),
          () => enduserApi.getOne({ [c.ownerField]: enduserB.id }),
        )

        // 3. getSome (no filter) — record must not appear (or call rejected)
        await async_test(
          sublog('getSome (no filter) excludes other-enduser record'),
          async () => {
            try {
              const records: { id: string }[] = await enduserApi.getSome({})
              return { rejected: false, hasRecord: !!records.find((r: any) => r.id === createdId) }
            } catch (_e) {
              return { rejected: true, hasRecord: false }
            }
          },
          { onResult: r => r.rejected || !r.hasRecord },
        )

        // 4. getSome (owner filter) — must be empty (or rejected)
        await expectEmptyOrForbidden(
          sublog('getSome (owner filter) returns empty or rejects'),
          () => enduserApi.getSome({ filter: { [c.ownerField]: enduserB.id } }),
        )

        // 5. getByIds — matches must be empty (or rejected)
        await expectMatchesEmptyOrForbidden(
          sublog('getByIds returns no matches or rejects'),
          () => enduserApi.getByIds({ ids: [createdId!] }),
        )

        // 6. /bulk-actions/read with owner filter
        await async_test(
          sublog('bulk_load (owner filter) returns null or empty for other-enduser data'),
          async () => {
            try {
              const r = await sdkA.bulk_load({
                load: [{
                  model: c.model as ModelName,
                  options: { filter: { [c.ownerField]: enduserB.id } },
                }],
              })
              const result = r.results[0]
              if (result === null) return { ok: true }
              return { ok: result.records.length === 0, count: result.records.length }
            } catch (_e) {
              return { ok: true } // rejection is also safe
            }
          },
          { onResult: r => r.ok === true },
        )

        // 7. /bulk-actions/read with no filter — record must not appear
        await async_test(
          sublog('bulk_load (no filter) excludes other-enduser record'),
          async () => {
            try {
              const r = await sdkA.bulk_load({
                load: [{ model: c.model as ModelName, options: {} }],
              })
              const result = r.results[0]
              if (result === null) return { ok: true }
              return { ok: !result.records.find((rec: any) => rec.id === createdId) }
            } catch (_e) {
              return { ok: true }
            }
          },
          { onResult: r => r.ok === true },
        )

        // 8. updateOne — expect throw
        await expectForbidden(
          sublog('updateOne rejects'),
          () => enduserApi.updateOne(createdId!, { /* no-op-ish update */ } as any),
        )

        // 9. deleteOne — expect throw
        await expectForbidden(
          sublog('deleteOne rejects'),
          () => enduserApi.deleteOne(createdId!),
        )

        // After all attempted writes, confirm the record still exists when
        // fetched as admin — i.e. enduser A's failed update/delete were no-ops.
        await async_test(
          sublog('record still exists after failed enduser writes (admin verify)'),
          async () => {
            try {
              const found = await (sdk.api as any)[c.model].getOne(createdId!)
              return !!found && found.id === createdId
            } catch {
              return false
            }
          },
          { onResult: r => r === true },
        )
      } finally {
        // Admin-side cleanup of the record itself
        try {
          await (sdk.api as any)[c.model].deleteOne(createdId).catch(() => {})
        } catch { /* ignore */ }
        if (setupResult) await setupResult.cleanup().catch(() => {})
      }
    }
  } finally {
    await sdk.api.endusers.deleteOne(enduserA.id).catch(() => {})
    await sdk.api.endusers.deleteOne(enduserB.id).catch(() => {})
  }
}

if (require.main === module) {
  console.log(`Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await enduser_cross_access_isolation_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("Enduser cross-access isolation test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Enduser cross-access isolation test suite failed:", error)
      process.exit(1)
    })
}
