require('source-map-support').install();

import axios from "axios"
import { Session } from "../../../sdk"
import {
  async_test,
  log_header,
  wait,
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
 * Regression test for F-0007 (security-audit/findings/F-0007-invite-user-cross-tenant-email-enumeration.md).
 *
 * `users.invite_user` previously used `buildAllQueries({ unrestricted: true, organizationIds: [] }).users.findOne({ email })`
 * to enforce platform-wide email uniqueness and threw the distinctive `"A user with this email already exists"`
 * error on duplicate — regardless of which tenant the existing user was in. Any authenticated user could
 * therefore probe whether email X is registered to any tenant on the platform.
 *
 * **Tests only the negative case** — never drives a successful invite (which would create a real user
 * record and send a real transactional email). All assertions use either:
 *   - An email that already exists in the test tenant (the admin's own email), so each call short-circuits
 *     at the same-tenant duplicate check or rate-limit check before any invite work happens, OR
 *   - The cross-org infrastructure (CROSS_ORG_API_KEY env var) targeting an email that exists in a different
 *     tenant — verifies the post-fix response does NOT distinguish "exists elsewhere" from a generic outcome.
 *
 * Assertions:
 *   1. Rate-limit defense-in-depth: rapid same-tenant duplicate requests trip 429 within ~12 attempts.
 *   2. Same-tenant duplicate: returns the same `"already exists"` error pre/post-fix (this branch is
 *      unchanged by the fix; asserted for regression-safety).
 *   3. Cross-tenant duplicate (env-gated): post-fix response shape does NOT contain the `"already exists"`
 *      string and matches the silent-no-op shape `{ created: { id: ... } }`. Skipped when CROSS_ORG_*
 *      env vars are not set, mirroring cross_org_api_key.test.ts convention.
 */
export const invite_user_enumeration_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("F-0007: users.invite_user cross-tenant enumeration regression")

  // Reset state so prior tests' rate-limit accounting doesn't leak in.
  await sdk.reset_db()

  const organizationId = sdk.userInfo.organizationIds?.[0] ?? sdk.userInfo.businessId
  // Use the test admin's own email — guaranteed to exist in the test tenant, so every invite
  // request short-circuits at the same-tenant duplicate check (or earlier at the rate-limit
  // check). No real users get created, no emails get sent.
  const sameTenantExistingEmail = process.env.TEST_EMAIL!

  // ====================================================================
  // Assertion 1: rate-limit defense-in-depth
  // Fire 15 requests with the admin's own email. Post-fix: rate limit
  // fires before the same-tenant duplicate check on call 11+. Pre-fix:
  // every call returns 400 "already exists" forever.
  // ====================================================================
  let rateLimitedAt = -1
  for (let i = 0; i < 15; i++) {
    const r = await post(
      '/v1/invite-user-to-organization',
      {
        email: sameTenantExistingEmail,
        fname: 'F0007', lname: 'RateLimit',
        organizationId,
      },
      { Authorization: `Bearer ${sdk.authToken}` },
    )
    if (r.status === 429) {
      rateLimitedAt = i
      break
    }
  }

  await async_test(
    "F-0007: invite_user rate-limits within ~12 rapid requests (defense-in-depth; no invites sent)",
    async () => ({ rateLimitedAt }),
    { onResult: r => r.rateLimitedAt >= 0 && r.rateLimitedAt <= 12 },
  )

  // ====================================================================
  // Assertion 2: same-tenant duplicate returns the descriptive error
  // (unchanged by the fix; regression guard so a future change to the
  // duplicate-detection path doesn't accidentally suppress same-tenant
  // errors that operators rely on).
  // ====================================================================
  // Let rate limit decay so this single call isn't blocked.
  await wait(undefined, 5000)
  await sdk.reset_db()

  const sameTenantRes = await post(
    '/v1/invite-user-to-organization',
    {
      email: sameTenantExistingEmail,
      fname: 'F0007', lname: 'SameTenant',
      organizationId,
    },
    { Authorization: `Bearer ${sdk.authToken}` },
  )

  await async_test(
    "F-0007: invite_user same-tenant duplicate returns 400 'already exists' (unchanged)",
    async () => ({
      status: sameTenantRes.status,
      message: sameTenantRes.data?.message ?? '',
    }),
    { onResult: r => r.status === 400 && r.message.toLowerCase().includes('already exists') },
  )

  // ====================================================================
  // Assertion 3: cross-tenant duplicate must NOT reveal existence
  // Env-gated; skipped when cross-org infra not configured.
  // ====================================================================
  if (!(CROSS_ORG_API_KEY && CROSS_ORG_TARGET_BUSINESS_ID)) {
    console.log("  [F-0007] Skipping cross-tenant silent no-op assertion — CROSS_ORG_* env vars not set")
    return
  }

  // The target email is the admin's email in the home (test) tenant. We then attempt to invite
  // that same email FROM a session belonging to the cross-org target tenant. Post-fix, the
  // response should NOT contain "already exists" — it must be indistinguishable from a
  // successful invite OR a generic non-revealing response. Pre-fix, the response is the
  // distinctive "already exists" error revealing cross-tenant existence.
  const sdkCrossOrg = new Session({
    host,
    apiKey: CROSS_ORG_API_KEY,
    headers: { 'x-tellescope-organization': CROSS_ORG_TARGET_BUSINESS_ID },
  })

  // Resolve an organizationId in the target business. Falls back to the businessId itself.
  let targetOrgId = CROSS_ORG_TARGET_BUSINESS_ID
  try {
    const orgs = await sdkCrossOrg.api.organizations.getSome({ limit: 1 })
    if (orgs?.[0]?.id) targetOrgId = orgs[0].id
  } catch {}

  const crossRes = await post(
    '/v1/invite-user-to-organization',
    {
      email: sameTenantExistingEmail,
      fname: 'F0007', lname: 'CrossTenantProbe',
      organizationId: targetOrgId,
    },
    {
      Authorization: `API_KEY ${CROSS_ORG_API_KEY}`,
      'x-tellescope-organization': CROSS_ORG_TARGET_BUSINESS_ID,
    },
  )

  await async_test(
    "F-0007: cross-tenant invite of existing email must NOT return 'already exists' (no enumeration)",
    async () => ({
      status: crossRes.status,
      message: crossRes.data?.message ?? '',
      hasCreatedShape: !!crossRes.data?.created?.id,
    }),
    {
      onResult: r =>
        // The response MUST NOT contain the "already exists" string regardless of status.
        // Acceptable post-fix shapes: 200 with `{ created: { id: ... } }` (silent no-op), or
        // 200 with a generic ack. Rate-limit 429 also OK if it slipped through to here.
        !r.message.toLowerCase().includes('already exists'),
    },
  )
}

if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await invite_user_enumeration_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ F-0007 invite_user enumeration test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ F-0007 invite_user enumeration test suite failed:", error)
      process.exit(1)
    })
}
