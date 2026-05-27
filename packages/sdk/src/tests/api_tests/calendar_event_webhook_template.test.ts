require('source-map-support').install();

import { Session } from "../../sdk"
import {
  async_test,
  log_header,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

const HEALTHIE_TITLE = 'Healthie' // mirror @tellescope/constants HEALTHIE_TITLE

// Unreachable webhook target — the request will fail quickly but the API still writes
// the resolved payload to webhook_logs, which is what we're verifying.
const WEBHOOK_TARGET_URL = 'http://127.0.0.1:9'

const find_log_for_url = async (sdk: Session, url: string, expectedHealthieId: string) => {
  const start = Date.now()
  while (Date.now() - start < 10_000) {
    const logs = await sdk.api.webhook_logs.getSome({ limit: 50, sort: 'newFirst' as any }) as Array<any>
    const match = logs.find(l => l.url === url && (l.payload as any)?.healthieId === expectedHealthieId)
    if (match) return match
    await wait(undefined, 500)
  }
  return null
}

// Main test function that can be called independently
export const calendar_event_webhook_template_tests = async (
  { sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }
) => {
  log_header("Calendar Event Webhook Template Tests")

  const enduser = await sdk.api.endusers.createOne({})

  // Case 1: Healthie ID resolved via source + externalId
  const externalIdEvent = await sdk.api.calendar_events.createOne({
    title: 'External ID Calendar Event',
    durationInMinutes: 30,
    startTimeInMS: Date.now(),
    attendees: [{ type: 'enduser', id: enduser.id }],
    source: HEALTHIE_TITLE,
    externalId: 'evt_HEALTHIE_123',
  } as any)

  // Case 2: Healthie ID resolved via references
  const referencesEvent = await sdk.api.calendar_events.createOne({
    title: 'References Calendar Event',
    durationInMinutes: 30,
    startTimeInMS: Date.now(),
    attendees: [{ type: 'enduser', id: enduser.id }],
    references: [{ type: HEALTHIE_TITLE, id: 'evt_REF_456' }],
  } as any)

  // create an automation step to satisfy schema validation (automationStepId is required)
  const journey = await sdk.api.journeys.createOne({
    title: 'Calendar Event Webhook Template Tests',
    defaultState: 'State 1',
  })
  const step = await sdk.api.automation_steps.createOne({
    journeyId: journey.id,
    events: [{ type: 'onJourneyStart', info: {} }],
    action: {
      type: 'sendWebhook',
      info: {
        message: 'placeholder',
        url: WEBHOOK_TARGET_URL,
      },
    },
  })

  try {
    await async_test(
      'Send Webhook resolves {{calendar_event.Healthie ID}} from source+externalId',
      async () => {
        const url = `${WEBHOOK_TARGET_URL}/external/${externalIdEvent.id}`
        await sdk.api.webhooks.send_automation_webhook({
          message: 'placeholder',
          enduserId: enduser.id,
          automationStepId: step.id,
          action: {
            type: 'sendWebhook',
            info: {
              message: 'placeholder',
              url,
              fields: [
                { field: 'healthieId', value: '{{calendar_event.Healthie ID}}' },
                { field: 'title', value: '{{calendar_event.title}}' },
              ],
            },
          },
          context: { calendarEventId: externalIdEvent.id },
        }).catch(() => {}) // the unreachable URL is expected to error after logging

        const log = await find_log_for_url(sdk, url, 'evt_HEALTHIE_123')
        if (!log) return false
        const payload = log.payload as any
        return payload?.healthieId === 'evt_HEALTHIE_123'
          && payload?.title === externalIdEvent.title
      },
      { onResult: r => r === true }
    )

    await async_test(
      'Send Webhook resolves {{calendar_event.Healthie ID}} from references',
      async () => {
        const url = `${WEBHOOK_TARGET_URL}/refs/${referencesEvent.id}`
        await sdk.api.webhooks.send_automation_webhook({
          message: 'placeholder',
          enduserId: enduser.id,
          automationStepId: step.id,
          action: {
            type: 'sendWebhook',
            info: {
              message: 'placeholder',
              url,
              fields: [
                { field: 'healthieId', value: '{{calendar_event.Healthie ID}}' },
                { field: 'title', value: '{{calendar_event.title}}' },
              ],
            },
          },
          context: { calendarEventId: referencesEvent.id },
        }).catch(() => {})

        const log = await find_log_for_url(sdk, url, 'evt_REF_456')
        if (!log) return false
        const payload = log.payload as any
        return payload?.healthieId === 'evt_REF_456'
          && payload?.title === referencesEvent.title
      },
      { onResult: r => r === true }
    )

    await async_test(
      'Send Webhook leaves {{calendar_event.Healthie ID}} blank when no calendarEventId in context',
      async () => {
        const url = `${WEBHOOK_TARGET_URL}/nocontext`
        await sdk.api.webhooks.send_automation_webhook({
          message: 'placeholder',
          enduserId: enduser.id,
          automationStepId: step.id,
          action: {
            type: 'sendWebhook',
            info: {
              message: 'placeholder',
              url,
              fields: [
                { field: 'healthieId', value: '{{calendar_event.Healthie ID}}' },
              ],
            },
          },
          // no calendarEventId
        }).catch(() => {})

        // Without a calendar event in context, the templating helper returns the input
        // unchanged, so the literal template string remains in the payload.
        const start = Date.now()
        while (Date.now() - start < 10_000) {
          const logs = await sdk.api.webhook_logs.getSome({ limit: 50, sort: 'newFirst' as any }) as Array<any>
          const match = logs.find(l => l.url === url)
          if (match) {
            const payload = match.payload as any
            return payload?.healthieId === '{{calendar_event.Healthie ID}}'
          }
          await wait(undefined, 500)
        }
        return false
      },
      { onResult: r => r === true }
    )

  } finally {
    try { await sdk.api.calendar_events.deleteOne(externalIdEvent.id) } catch {}
    try { await sdk.api.calendar_events.deleteOne(referencesEvent.id) } catch {}
    try { await sdk.api.automation_steps.deleteOne(step.id) } catch {}
    try { await sdk.api.journeys.deleteOne(journey.id) } catch {}
    try { await sdk.api.endusers.deleteOne(enduser.id) } catch {}
  }
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await calendar_event_webhook_template_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Calendar event webhook template test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Calendar event webhook template test suite failed:", error)
      process.exit(1)
    })
}
