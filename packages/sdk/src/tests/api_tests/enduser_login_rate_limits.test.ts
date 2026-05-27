require('source-map-support').install();

import axios from "axios"
import { Session } from "../../sdk"
import {
  async_test,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

// Per-IP rate limits applied to enduser public endpoints:
//   POST /v1/login-enduser              20 / min, 100 / hour
//   POST /v1/begin-enduser-login-flow   10 / min,  50 / hour
//   POST /v1/endusers/send-otp-code      5 / min,  30 / hour
// Plus a per-identifier limit on begin_login_flow: 5 / 10 min per email|phone.

const post = async (path: string, body: any) => {
  try {
    const res = await axios.post(`${host}${path}`, body, { validateStatus: () => true })
    return { status: res.status, data: res.data }
  } catch (err: any) {
    return { status: err?.response?.status, data: err?.response?.data }
  }
}

const fire_until_429 = async (cap: number, send: (i: number) => Promise<{ status: number }>) => {
  let triggeredAt = -1
  for (let i = 0; i < cap + 5; i++) {
    const { status } = await send(i)
    if (status === 429) {
      triggeredAt = i
      break
    }
  }
  return triggeredAt
}

export const enduser_login_rate_limits_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Enduser Login Rate Limit Tests")

  const businessId = sdk.userInfo.businessId

  // Ensure throttled_events from prior tests don't bleed in.
  await sdk.reset_db()

  // ---- /v1/login-enduser per-IP cap (20/min) ----
  // Bogus emails ensure we never reach the actual DB lookup / login work.
  const loginTrip = await fire_until_429(20, i => post('/v1/login-enduser', {
    email: `rl-login-${Date.now()}-${i}@tellescope.com`,
    password: 'NotARealPassword!2025',
    businessId,
  }))
  await async_test(
    'login per-IP throttle trips within first 21 requests',
    async () => (loginTrip >= 0 && loginTrip <= 20) ? 'tripped' : `not-tripped:${loginTrip}`,
    { expectedResult: 'tripped' }
  )

  await sdk.reset_db()

  // ---- /v1/begin-enduser-login-flow per-IP cap (10/min) ----
  // Use distinct emails so the per-identifier limit (5/10min) does NOT trip first;
  // we want the IP cap to be the first thing to fire.
  const beginIpTrip = await fire_until_429(10, i => post('/v1/begin-enduser-login-flow', {
    email: `rl-begin-ip-${Date.now()}-${i}@tellescope.com`,
    businessId,
  }))
  await async_test(
    'begin_login_flow per-IP throttle trips within first 11 requests',
    async () => (beginIpTrip >= 0 && beginIpTrip <= 10) ? 'tripped' : `not-tripped:${beginIpTrip}`,
    { expectedResult: 'tripped' }
  )

  await sdk.reset_db()

  // ---- /v1/begin-enduser-login-flow per-identifier cap (5 / 10 min per email) ----
  // Hit a single email below the per-IP cap.
  const fixedEmail = `rl-begin-id-${Date.now()}@tellescope.com`
  const beginIdTrip = await fire_until_429(5, () => post('/v1/begin-enduser-login-flow', {
    email: fixedEmail,
    businessId,
  }))
  await async_test(
    'begin_login_flow per-identifier throttle trips within first 6 requests',
    async () => (beginIdTrip >= 0 && beginIdTrip <= 5) ? 'tripped' : `not-tripped:${beginIdTrip}`,
    { expectedResult: 'tripped' }
  )

  await sdk.reset_db()

  // ---- /v1/endusers/send-otp-code per-IP cap (5/min) ----
  // Use a bogus JWT-shaped token so we trip the IP guard first (it runs before any DB work).
  const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCJ9.sig'
  const sendOtpTrip = await fire_until_429(5, () => post('/v1/endusers/send-otp-code', {
    token: fakeToken,
    method: 'email',
  }))
  await async_test(
    'send_otp per-IP throttle trips within first 6 requests',
    async () => (sendOtpTrip >= 0 && sendOtpTrip <= 5) ? 'tripped' : `not-tripped:${sendOtpTrip}`,
    { expectedResult: 'tripped' }
  )

  // Confirm 429 response does not leak the keying strategy (no mention of "ip" or "address").
  const tripped = await post('/v1/endusers/send-otp-code', { token: fakeToken, method: 'email' })
  await async_test(
    '429 response does not mention "ip" or "address"',
    async () => {
      const msg = (tripped.data?.message ?? '').toLowerCase()
      return (msg.includes('ip') || msg.includes('address')) ? 'leaked' : 'safe'
    },
    { expectedResult: 'safe' }
  )

  // ---- Legitimate-login regression: a single successful login should still go through ----
  // Reset state, then create a real enduser with a password and confirm one login succeeds.
  await sdk.reset_db()

  const ts = Date.now()
  const enduser = await sdk.api.endusers.createOne({
    fname: 'RateLimitOk', lname: 'Enduser',
    email: `rl-legit-${ts}@tellescope.com`,
  })
  try {
    await sdk.api.endusers.set_password({ id: enduser.id, password: 'CorrectPassword123!' })

    const goodLogin = await post('/v1/login-enduser', {
      email: enduser.email,
      password: 'CorrectPassword123!',
      businessId,
    })
    await async_test(
      'legitimate login still succeeds (returns authToken, not 429)',
      async () => goodLogin.status === 200 && !!goodLogin.data?.authToken ? 'ok' : `failed:${goodLogin.status}`,
      { expectedResult: 'ok' }
    )

    // A subsequent successful login by the same user/IP should also succeed —
    // a single legitimate user retrying must not trip the per-IP cap.
    const goodLoginRetry = await post('/v1/login-enduser', {
      email: enduser.email,
      password: 'CorrectPassword123!',
      businessId,
    })
    await async_test(
      'legitimate login retry still succeeds',
      async () => goodLoginRetry.status === 200 && !!goodLoginRetry.data?.authToken ? 'ok' : `failed:${goodLoginRetry.status}`,
      { expectedResult: 'ok' }
    )
  } finally {
    await sdk.api.endusers.deleteOne(enduser.id).catch(() => null)
    await sdk.reset_db().catch(() => null)
  }
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await enduser_login_rate_limits_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Enduser login rate limit test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Enduser login rate limit test suite failed:", error)
      process.exit(1)
    })
}
