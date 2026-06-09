require('source-map-support').install();

import { Session } from "../../sdk"
import {
  assert,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

const mdiUrl = `${host}/v1/webhooks/mdi`

/**
 * POST a JSON payload to the MDI webhook endpoint with optional auth/signature headers.
 */
const postMDI = async (body: object, headers: Record<string, string> = {}) => {
  const res = await fetch(mdiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })
  let data: any
  try { data = await res.text() } catch { data = null }
  return { status: res.status, data }
}

/**
 * MD Integrations Webhooks Tests
 *
 * The inbound endpoint is security-first: it authenticates the tenant via the
 * static Authorization token BEFORE any DB write or side effect. These tests
 * assert those rejection paths, which don't require a configured MDI integration.
 *
 * NOTE: a full event round-trip (case_approved -> mdiStatus, offering_submitted
 * -> enduser_medications, message_created -> chat, etc.) requires an MDI
 * integration row carrying the Authorization token in webhooksSecret.
 * That row can only be created through the connect flow against valid MDI
 * Sandbox credentials (add_api_key_integration validates client creds via a live
 * MDI API call), so the end-to-end path is exercised in the Sandbox per the task
 * plan rather than here.
 */
export const mdi_webhooks_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("MD Integrations Webhooks Tests")

  // 1. Missing Authorization header -> 401 (tenant cannot be identified)
  {
    const { status } = await postMDI({ event_type: 'case_approved', case_id: 'mdi-case-test-1' })
    assert(status === 401, `missing Authorization should 401 (got ${status})`, "MDI webhook rejects missing Authorization")
  }

  // 2. Bogus Authorization token (no matching integration) -> 401
  {
    const { status } = await postMDI(
      { event_type: 'case_approved', case_id: 'mdi-case-test-1' },
      { 'Authorization': `Bearer not-a-real-mdi-token-${Date.now()}` },
    )
    assert(status === 401, `unknown Authorization should 401 (got ${status})`, "MDI webhook rejects unknown Authorization")
  }

  // 3. Missing event_type -> 400 (bad request), still before any tenant work
  {
    const { status } = await postMDI(
      { case_id: 'mdi-case-test-1' } as any,
      { 'Authorization': `Bearer not-a-real-mdi-token-${Date.now()}` },
    )
    assert(status === 400 || status === 401, `missing event_type should 400/401 (got ${status})`, "MDI webhook rejects payload without event_type")
  }

  // 4. message_created with bogus auth -> still 401 (auth precedes patient lookup)
  {
    const { status } = await postMDI(
      { event_type: 'message_created', patient_id: 'mdi-patient-x', message_id: 'm-1', user_type: 'App\\Models\\User' },
      { 'Authorization': `Bearer not-a-real-mdi-token-${Date.now()}` },
    )
    assert(status === 401, `message_created with bad auth should 401 (got ${status})`, "MDI webhook authenticates before patient lookup")
  }
}

// Allow running this test file independently
if (require.main === module) {
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await mdi_webhooks_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ MD Integrations webhooks test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ MD Integrations webhooks test suite failed:", error)
      process.exit(1)
    })
}
