require('source-map-support').install();

import axios from "axios"
import { Session } from "../../../sdk"
import {
  assert,
  log_header,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

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
 * Reproduction + regression test for the reported vulnerability:
 *
 *   A @wearehackerone.com email "joined" a customer's organization without being invited, and
 *   duplicate user records existed for that email — each bound to a different businessId.
 *
 * Root cause: the public `POST /v1/users/register` endpoint. `addPublicEndpoint` accepts an
 * OPTIONAL, caller-supplied `businessId` (routing.ts) and bakes it into the handler's DB. The
 * register handler's only duplicate guard (`DB.users.findOne({ email })`) is therefore scoped to
 * whatever org the caller named, and the subsequent `DB.users.insertOne(...)` stamps that
 * caller-supplied businessId onto a new `accountType: 'Business'` user — bypassing the
 * globalUnique: ['email'] enforcement that only runs in the generic create route.
 *
 * The "victim org" here is the test admin's own org (sdk.userInfo.businessId): an org the
 * anonymous caller was never invited to. The admin is used purely to OBSERVE whether an
 * uninvited user record materialized inside their org (getOne({ email }) is org-scoped and
 * throws when the email is absent from the caller's tenant).
 *
 * Expected results:
 *   - VULNERABLE code: the assertions FAIL — the planted user appears inside the victim org,
 *     proving the exploit ("EXPLOIT CONFIRMED" in the failure message).
 *   - FIXED code: register ignores the caller-supplied businessId (self-signups are created
 *     org-less and duplicates are rejected globally), so nothing appears in the victim org and
 *     the assertions PASS.
 *
 * Uses unique emails per run (Date.now()) so re-runs never collide on the platform-wide unique
 * email constraint. NOTE: on the FIXED path these registrations create org-less user records
 * that an org-scoped admin cannot delete — harmless residue (unique emails), inherent to the
 * legitimate "root register, no org" signup behavior.
 */
export const register_business_id_injection_tests = async ({ sdk } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("register businessId injection")

  const victimBusinessId = sdk.userInfo.businessId
  const password = 'testpassword123!'
  const termsVersion = '1'

  // ==================================================================================
  // Scenario 1 — uninvited org join
  // An anonymous caller registers with businessId set to the victim org. On vulnerable
  // code this creates a Business user INSIDE the victim org that no one invited.
  // ==================================================================================
  const email1 = `security+reg-inject-${Date.now()}@wearehackerone.com`

  const before = await sdk.api.users.getOne({ email: email1 }).catch(() => null)
  assert(before === null, `precondition failed: ${email1} already present in victim org`, 'precondition: victim org has no such user')

  const res1 = await post('/v1/users/register', { email: email1, password, termsVersion, businessId: victimBusinessId })
  console.log(`   register(businessId=victim) -> HTTP ${res1.status}`)

  const planted1: any = await sdk.api.users.getOne({ email: email1 }).catch(() => null)
  const injectedIntoVictimOrg = !!planted1 && planted1.businessId === victimBusinessId

  // Clean up BEFORE asserting (a failed assert calls process.exit(1) and would skip cleanup).
  if (planted1?.id) await sdk.api.users.deleteOne(planted1.id).catch(() => {})

  assert(
    !injectedIntoVictimOrg,
    `❌ EXPLOIT CONFIRMED: anonymous POST /v1/users/register with businessId=${victimBusinessId} created user `
      + `${email1} (accountType=${planted1?.accountType}) inside the victim org — no invite required`,
    '✅ register ignores caller-supplied businessId — no user injected into victim org',
  )

  await wait(undefined, 1200) // register endpoint rate-limits ~1/sec per IP

  // ==================================================================================
  // Scenario 2 — cross-org duplicate for the same email
  // First register with NO businessId (the legitimate "root register, no org" record —
  // the "oldest" account in the report). Then register the SAME email WITH the victim
  // businessId. On vulnerable code the scoped duplicate check misses the org-less record,
  // so a SECOND user record for the same email is created inside the victim org.
  // ==================================================================================
  const email2 = `security+reg-dup-${Date.now()}@wearehackerone.com`

  const resRoot = await post('/v1/users/register', { email: email2, password, termsVersion })
  console.log(`   register(no businessId) -> HTTP ${resRoot.status}`)

  await wait(undefined, 1200)

  const resDup = await post('/v1/users/register', { email: email2, password, termsVersion, businessId: victimBusinessId })
  console.log(`   register(same email, businessId=victim) -> HTTP ${resDup.status}`)

  const planted2: any = await sdk.api.users.getOne({ email: email2 }).catch(() => null)
  const duplicateInVictimOrg = !!planted2 && planted2.businessId === victimBusinessId

  if (planted2?.id) await sdk.api.users.deleteOne(planted2.id).catch(() => {})

  assert(
    !duplicateInVictimOrg,
    `❌ EXPLOIT CONFIRMED: same email ${email2} registered into a second org — duplicate user `
      + `(accountType=${planted2?.accountType}) created in victim org ${victimBusinessId}`,
    '✅ register enforces global email uniqueness — no cross-org duplicate created',
  )
}

// Allow running this test file independently
if (require.main === module) {
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await register_business_id_injection_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ register businessId injection test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ register businessId injection test suite failed:", error)
      process.exit(1)
    })
}
