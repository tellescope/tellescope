require('source-map-support').install();

import axios from "axios"
import { ObjectId } from 'bson'
import { Session } from "../../../sdk"
import {
  async_test,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

const CROSS_ORG_API_KEY = process.env.CROSS_ORG_API_KEY
const CROSS_ORG_TARGET_BUSINESS_ID = process.env.CROSS_ORG_TARGET_BUSINESS_ID

const post = async (path: string, body: any, headers: Record<string, string> = {}) => {
  try {
    const res = await axios.post(`${host}${path}`, body, {
      validateStatus: () => true,
      headers,
    })
    return { status: res.status, data: res.data }
  } catch (err: any) {
    return { status: err?.response?.status, data: err?.response?.data }
  }
}

/**
 * Regression test for F-0008 (security-audit/findings/F-0008-handle-incoming-communication-cross-tenant-enduser-lookup.md).
 *
 * `journeys.handle_incoming_communication` previously used `buildAllQueries({ unrestricted: true, organizationIds: [] }).endusers.findById(enduserId)`,
 * permitting cross-tenant lookup of any enduser by id. The handler then called `handleIncomingCommunication(...)`
 * against the matched enduser, triggering journey progression and automated actions on someone else's tenant.
 *
 * The fix switches to the standard tenant-scoped `DB.endusers.findById(enduserId)` wrapper, which automatically
 * filters by `req.session.businessId`. Cross-tenant lookups now return null → handler returns 404 → no side effect.
 *
 * Note: the same-tenant happy path is already covered by the existing test at
 * `packages/public/sdk/src/tests/tests.ts:7588` ("handle_incoming_communication test for other enduser") — that
 * test creates endusers in the test tenant, sets up journeys, calls handle_incoming_communication, and asserts
 * journey-step cancellation. This file covers the negative cases only.
 *
 * **Negative-only by design**: the test never drives `handleIncomingCommunication` against a cross-tenant
 * enduser — the post-fix code returns 404 before any side effects fire, and the assertion confirms that.
 */
export const handle_incoming_communication_cross_tenant_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("F-0008: handle_incoming_communication cross-tenant rejection")

  // ====================================================================
  // Assertion 1: nonexistent enduserId returns 404 (baseline; regression
  // guard for the not-found path that any cross-tenant call now lands in).
  // ====================================================================
  const nonexistentId = new ObjectId().toHexString()
  const nonexistentRes = await post(
    '/v1/journeys/handle-incoming-communication',
    { enduserId: nonexistentId },
    { Authorization: `Bearer ${sdk.authToken}` },
  )
  await async_test(
    "F-0008: handle_incoming_communication with nonexistent enduserId returns 404",
    async () => ({ status: nonexistentRes.status }),
    { onResult: r => r.status === 404 },
  )

  // ====================================================================
  // Assertion 2: cross-tenant enduserId returns 404 (the actual F-0008 fix).
  // Env-gated; skipped when cross-org infra isn't configured.
  // Safe to run post-fix because the tenant-scoped DB returns null for
  // cross-tenant lookups — no handleIncomingCommunication side effect fires.
  // ====================================================================
  if (!(CROSS_ORG_API_KEY && CROSS_ORG_TARGET_BUSINESS_ID)) {
    console.log("  [F-0008] Skipping cross-tenant rejection assertion — CROSS_ORG_* env vars not set")
    return
  }

  const sdkCrossOrg = new Session({
    host,
    apiKey: CROSS_ORG_API_KEY,
    headers: { 'x-tellescope-organization': CROSS_ORG_TARGET_BUSINESS_ID },
  })

  // Create a sentinel enduser in the cross-org tenant. Use a clearly-test email
  // so any accidental side-effect routing is obvious in logs.
  const ts = Date.now()
  const crossEnduser = await sdkCrossOrg.api.endusers.createOne({
    fname: 'F0008CrossTenant', lname: 'Sentinel',
    email: `f0008-cross-${ts}@tellescope.com`,
  } as any)

  try {
    const crossRes = await post(
      '/v1/journeys/handle-incoming-communication',
      { enduserId: crossEnduser.id },
      { Authorization: `Bearer ${sdk.authToken}` },
    )

    await async_test(
      "F-0008: handle_incoming_communication with cross-tenant enduserId returns 404 (no side effect)",
      async () => ({
        status: crossRes.status,
        message: crossRes.data?.message ?? null,
      }),
      { onResult: r => r.status === 404 },
    )
  } finally {
    try { await sdkCrossOrg.api.endusers.deleteOne(crossEnduser.id) } catch {}
  }
}

if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await handle_incoming_communication_cross_tenant_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ F-0008 handle_incoming_communication cross-tenant test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ F-0008 handle_incoming_communication cross-tenant test suite failed:", error)
      process.exit(1)
    })
}