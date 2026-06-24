require('source-map-support').install();

import http from "http"
import { Session } from "../../../sdk"
import {
  async_test,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

// The server-side axios timeout is 15s (F-0155 fix). We bound our own wait above that.
const CLIENT_WAIT_MS = 20_000

/**
 * Regression test for F-0155
 * (security-audit/findings/F-0155-outbound-webhook-no-timeout-slow-loris.md).
 *
 * Outbound webhook delivery used axios.post(url, ...) with no `timeout` (axios default = infinite).
 * A tenant-controlled receiver that accepts the connection and never responds hangs the awaited
 * request indefinitely (slow-loris → worker exhaustion). Fix: timeout: 15_000 on the axios calls.
 *
 * Repro: stand up a local HTTP server that accepts the connection but NEVER responds, point
 * send_automation_webhook (which awaits the axios call) at it, and race the call against a 20s
 * client timer.
 *   - green (fixed):  server times out at ~15s → handler returns 400 → SDK call rejects < 20s
 *   - red  (unfixed): the call is still pending at 20s → client timer wins
 */
export const webhook_timeout_tests = async ({ sdk } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("F-0155: outbound webhook timeout")

  let enduserId: string | undefined
  const slowServer = http.createServer(() => { /* accept connection, never respond */ })

  try {
    await new Promise<void>(resolve => slowServer.listen(0, '127.0.0.1', () => resolve()))
    const port = (slowServer.address() as any).port
    const blackholeUrl = `http://127.0.0.1:${port}/hook`

    const enduser = await sdk.api.endusers.createOne({ email: `f0155-${Date.now()}@example.com`, fname: 'F0155', lname: 'Webhook' })
    enduserId = enduser.id

    await async_test(
      'F-0155: outbound webhook to a non-responding receiver times out server-side (does not hang)',
      async () => {
        const start = Date.now()
        const outcome = await Promise.race([
          sdk.api.webhooks.send_automation_webhook({
            enduserId: enduser.id,
            action: { info: { url: blackholeUrl } },
          } as any).then(() => 'completed').catch(() => 'errored'),
          new Promise<string>(r => setTimeout(() => r('client-timeout'), CLIENT_WAIT_MS)),
        ])
        return { outcome, elapsed: Date.now() - start }
      },
      // green: the server-side axios timeout fired (call settled) before our 20s client wait
      { onResult: (r: any) => r.outcome !== 'client-timeout' && r.elapsed < CLIENT_WAIT_MS },
    )
  } finally {
    slowServer.close()
    if (enduserId) { try { await sdk.api.endusers.deleteOne(enduserId) } catch {} }
  }
}

if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await webhook_timeout_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ F-0155 webhook timeout test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ F-0155 webhook timeout test suite failed:", error)
      process.exit(1)
    })
}
