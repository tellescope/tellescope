require('source-map-support').install();

import express from "express"
import bodyParser from "body-parser"
import crypto from "crypto"
import http from "http"

import { Session } from "../../sdk"
import {
  assert,
  async_test,
  log_header,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

const TEST_SECRET = "this is a test secret for verifying integrity of web hooks"
const sha256 = (s: string) => crypto.createHash('sha256').update(s).digest('hex')

// DNS resolution for the reserved .invalid TLD always fails => axios ENOTFOUND (no err.response)
const ENOTFOUND_URL = `http://webhook-error-handling-test.invalid/hook`

const POLL_TIMEOUT_MS = 10_000
const POLL_INTERVAL_MS = 500

const find_log_for_url = async (sdk: Session, url: string) => {
  const start = Date.now()
  while (Date.now() - start < POLL_TIMEOUT_MS) {
    const logs = await sdk.api.webhook_logs.getSome({ limit: 50, sort: 'newFirst' as any }) as Array<any>
    const match = logs.find(l => l.url === url)
    if (match) return match
    await wait(undefined, POLL_INTERVAL_MS)
  }
  return null
}

const get_failure_count = async (sdk: Session) => {
  const configs = await sdk.api.webhooks.getSome() as Array<any>
  return (configs[0]?.deliveryFailureCount ?? 0) as number
}

// the $inc on the webhook config is fire-and-forget — poll until it lands
const wait_for_failure_count = async (sdk: Session, expected: number) => {
  const start = Date.now()
  let count = -1
  while (Date.now() - start < POLL_TIMEOUT_MS) {
    count = await get_failure_count(sdk)
    if (count === expected) return count
    await wait(undefined, POLL_INTERVAL_MS)
  }
  return count
}

// Main test function that can be called independently
export const webhook_error_handling_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Webhook Error Handling Tests")

  // local receiver: error paths for failure scenarios, a healthy path that verifies integrity
  const app = express()
  app.use(bodyParser.json({ limit: '25mb' }))

  let successIntegrityVerified = false
  app.post('/fail-400', (_, res) => { res.status(400).json({ error: 'bad request' }) })
  app.post('/fail-500', (_, res) => { res.status(500).json({ error: 'server error' }) })
  app.post('/success', (req, res) => {
    const { records, timestamp, integrity } = req.body
    successIntegrityVerified = (
      sha256((records ?? []).map((r: { id: string }) => r.id).join('') + timestamp + TEST_SECRET) === integrity
    )
    res.status(200).json({})
  })

  const server: http.Server = await new Promise(resolve => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s))
  })
  const receiverBase = `http://127.0.0.1:${(server.address() as any).port}`

  const enduserIds: string[] = []
  const trigger_delivery = async (label: string) => {
    const enduser = await sdk.api.endusers.createOne({ email: `webhook-error-${label}-${Date.now()}@tellescope.com` })
    enduserIds.push(enduser.id)
  }

  try {
    await async_test(
      'configure webhook',
      () => sdk.api.webhooks.configure({ url: ENOTFOUND_URL, secret: TEST_SECRET }),
      { shouldError: false, onResult: () => true },
    )
    await sdk.api.webhooks.update({ subscriptionUpdates: { endusers: { create: true, update: false, delete: false } } })

    const initialCount = await get_failure_count(sdk)

    // Scenario 1: ENOTFOUND — no HTTP response at all
    await trigger_delivery('enotfound')
    const enotfoundLog = await find_log_for_url(sdk, ENOTFOUND_URL)
    assert(!!enotfoundLog, 'no webhook_logs entry for ENOTFOUND delivery', 'ENOTFOUND failure logged to webhook_logs')
    assert(
      typeof enotfoundLog?.response === 'string' && enotfoundLog.response.length > 0,
      `expected string error message response, got: ${JSON.stringify(enotfoundLog?.response)}`,
      'ENOTFOUND log has error message as response'
    )
    assert(enotfoundLog?.responseCode === undefined, 'unexpected responseCode for ENOTFOUND', 'ENOTFOUND log has no responseCode')
    assert(
      await wait_for_failure_count(sdk, initialCount + 1) === initialCount + 1,
      'deliveryFailureCount not incremented after ENOTFOUND',
      'deliveryFailureCount incremented after ENOTFOUND'
    )

    // Scenario 2a: HTTP 400 from the receiver
    await sdk.api.webhooks.update({ url: `${receiverBase}/fail-400` })
    await trigger_delivery('http400')
    const log400 = await find_log_for_url(sdk, `${receiverBase}/fail-400`)
    assert(log400?.responseCode === 400, `expected responseCode 400, got ${log400?.responseCode}`, 'HTTP 400 responseCode recorded')
    assert(
      await wait_for_failure_count(sdk, initialCount + 2) === initialCount + 2,
      'deliveryFailureCount not incremented after HTTP 400',
      'deliveryFailureCount incremented after HTTP 400'
    )

    // Scenario 2b: HTTP 500 from the receiver
    await sdk.api.webhooks.update({ url: `${receiverBase}/fail-500` })
    await trigger_delivery('http500')
    const log500 = await find_log_for_url(sdk, `${receiverBase}/fail-500`)
    assert(log500?.responseCode === 500, `expected responseCode 500, got ${log500?.responseCode}`, 'HTTP 500 responseCode recorded')
    assert(
      await wait_for_failure_count(sdk, initialCount + 3) === initialCount + 3,
      'deliveryFailureCount not incremented after HTTP 500',
      'deliveryFailureCount incremented after HTTP 500'
    )

    // Scenario 3 (timeout): skipped — WEBHOOK_TIMEOUT_MS is a constant (15s), not env-overridable,
    // and a 15s+ non-responding receiver would make this suite unacceptably slow.
    // Covered by security/F-0155-webhook-timeout.test.ts via send_automation_webhook.

    // Scenario 4: success path unchanged — 200 logged, counter untouched
    await sdk.api.webhooks.update({ url: `${receiverBase}/success` })
    await trigger_delivery('success')
    const successLog = await find_log_for_url(sdk, `${receiverBase}/success`)
    assert(successLog?.responseCode === 200, `expected responseCode 200, got ${successLog?.responseCode}`, 'success responseCode recorded')
    assert(successIntegrityVerified, 'integrity check failed on success delivery', 'success delivery integrity verified')
    await wait(undefined, 1000) // allow any (erroneous) counter update to land before checking
    assert(
      await get_failure_count(sdk) === initialCount + 3,
      'deliveryFailureCount changed on successful delivery',
      'deliveryFailureCount untouched on success'
    )

    // deliveryFailureCount is server-managed: not settable through the public update endpoint
    const configs = await sdk.api.webhooks.getSome() as Array<any>
    const webhookId = configs[0]?.id
    await sdk.api.webhooks.updateOne(webhookId, { deliveryFailureCount: 9999 } as any).catch(() => {}) // may reject (readonly)
    assert(
      await get_failure_count(sdk) === initialCount + 3,
      'customer was able to overwrite deliveryFailureCount',
      'deliveryFailureCount not customer-settable'
    )
  } finally {
    // stop deliveries for subsequent tests and shut down the local receiver
    await sdk.api.webhooks.update({ subscriptionUpdates: { endusers: { create: false, update: false, delete: false } } }).catch(() => {})
    server.close()
    for (const id of enduserIds) {
      try { await sdk.api.endusers.deleteOne(id) } catch {}
    }
  }
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await webhook_error_handling_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Webhook error handling test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Webhook error handling test suite failed:", error)
      process.exit(1)
    })
}
