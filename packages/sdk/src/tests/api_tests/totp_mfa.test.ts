require('source-map-support').install();

import crypto from "crypto"
import { Session } from "../../sdk"
import {
  async_test,
  log_header,
  assert,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

const decode_jwt = (token: string): any => {
  try {
    const part = token.split('.')[1]
    const json = Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
    return JSON.parse(json)
  } catch { return null }
}

// Client-side TOTP mirror (RFC 6238, HMAC-SHA1, 6 digits, 30s period) so the test can
// compute valid codes from the secret returned by begin_TOTP_configuration
const TOTP_PERIOD_MS = 30_000
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
const base32_decode = (s: string): Buffer => {
  let bits = 0, value = 0
  const bytes: number[] = []
  for (const char of s.toUpperCase().replace(/=+$/, '')) {
    const index = BASE32_ALPHABET.indexOf(char)
    if (index === -1) throw new Error("Invalid base32 character")
    value = (value << 5) | index
    bits += 5
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255)
      bits -= 8
    }
  }
  return Buffer.from(bytes)
}
const current_timestep = () => Math.floor(Date.now() / TOTP_PERIOD_MS)
const compute_totp_code = (secret: string, timestep=current_timestep()): string => {
  const counter = Buffer.alloc(8)
  counter.writeBigUInt64BE(BigInt(timestep))
  const hmac = crypto.createHmac('sha1', base32_decode(secret)).update(counter).digest()
  const offset = hmac[hmac.length - 1] & 0xf
  const binary = (
      ((hmac[offset] & 0x7f) << 24)
    | ((hmac[offset + 1] & 0xff) << 16)
    | ((hmac[offset + 2] & 0xff) << 8)
    | (hmac[offset + 3] & 0xff)
  )
  return (binary % 1_000_000).toString().padStart(6, '0')
}
// a syntactically-valid 6-digit code guaranteed not to match the current/adjacent timesteps
const wrong_totp_code = (secret: string) => {
  const step = current_timestep()
  const valid = new Set([step - 1, step, step + 1].map(s => compute_totp_code(secret, s)))

  let candidate = (parseInt(compute_totp_code(secret, step)) + 1) % 1_000_000
  while (valid.has(candidate.toString().padStart(6, '0'))) {
    candidate = (candidate + 1) % 1_000_000
  }
  return candidate.toString().padStart(6, '0')
}

export const totp_mfa_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("TOTP MFA Tests")

  const NON_ADMIN_EMAIL = process.env.NON_ADMIN_EMAIL
  const NON_ADMIN_PASSWORD = process.env.NON_ADMIN_PASSWORD
  if (!(NON_ADMIN_EMAIL && NON_ADMIN_PASSWORD)) {
    throw new Error("NON_ADMIN_EMAIL and NON_ADMIN_PASSWORD must be set to run totp_mfa_tests")
  }

  const nonAdminId = sdkNonAdmin.userInfo.id
  const businessId = sdk.userInfo.businessId

  // the enrollment secret, captured in section A and used through later sections
  let totpSecret = ''
  // last timestep consumed by a successful server-side verification — a new verification
  // in the same 30s window would be rejected as a replay, so wait for the window to roll over
  let lastVerifiedStep = 0
  const wait_for_fresh_totp_step = async () => {
    while (current_timestep() <= lastVerifiedStep) {
      await wait(undefined, 1000)
    }
  }

  const set_allowed_mfa_methods = async (methods: string[]) => {
    await sdk.api.users.updateOne(nonAdminId, { allowedMFAMethods: methods } as any, { replaceObjectFields: true })
    await wait(undefined, 250)
  }
  // idempotent clear — skips the PATCH (identical updates to a record are limited to 3/30s)
  const clear_allowed_mfa_methods = async () => {
    const u: any = await sdk.api.users.getOne(nonAdminId)
    if (!(u.allowedMFAMethods ?? []).length) return
    await set_allowed_mfa_methods([])
  }

  // defensive cleanup of state from a previously-aborted run
  const reset_mfa_state = async () => {
    try { await sdk.api.organizations.updateOne(businessId, { enforceMFA: false } as any) } catch {}
    await wait(undefined, 250)
    try { await clear_allowed_mfa_methods() } catch {}
    try {
      const { authToken, user } = await sdkNonAdmin.api.users.configure_MFA({ disable: true })
      await sdkNonAdmin.handle_new_session({ ...user, authToken } as any)
    } catch {}
    await wait(undefined, 250)
  }

  await reset_mfa_state()

  try {
    // ============================================================
    // A. Enrollment
    // ============================================================
    log_header("A. TOTP Enrollment")

    let otpauthURL = ''
    await async_test(
      'A1. begin_TOTP_configuration returns otpauthURL + secret',
      () => sdkNonAdmin.api.users.begin_TOTP_configuration({}),
      { shouldError: false, onResult: (r: any) => {
        totpSecret = r.secret
        otpauthURL = r.otpauthURL
        return typeof r.secret === 'string' && r.secret.length >= 16 && /^[A-Z2-7]+$/.test(r.secret)
      }}
    )
    assert(otpauthURL.includes(totpSecret), 'otpauthURL missing secret', 'A2. otpauthURL contains secret')
    assert(otpauthURL.startsWith('otpauth://totp/'), 'unexpected otpauth scheme', 'A3. otpauth scheme')
    assert(otpauthURL.includes('issuer=Tellescope'), 'otpauthURL missing issuer', 'A4. otpauthURL issuer')

    await async_test(
      'A5. confirm with wrong code -> 401',
      () => sdkNonAdmin.api.users.confirm_TOTP_configuration({ code: wrong_totp_code(totpSecret) }),
      { shouldError: true, onError: (e: any) => e.statusCode === 401 || /invalid/i.test(e.message || '') }
    )

    await wait(undefined, 600) // confirm rate limit is 1/500ms
    await async_test(
      'A6. confirm with correct code -> enabled, 10 recovery codes, requiresMFA false',
      () => sdkNonAdmin.api.users.confirm_TOTP_configuration({ code: compute_totp_code(totpSecret) }),
      { shouldError: false, onResult: (r: any) => {
        if (r.authToken) sdkNonAdmin.handle_new_session({ ...r.user, authToken: r.authToken } as any)
        return (
          r.recoveryCodes?.length === 10
          && r.user?.mfa?.authenticator === true
          && decode_jwt(r.authToken)?.requiresMFA === false
        )
      }}
    )
    lastVerifiedStep = current_timestep()

    await async_test(
      'A7. user record has mfa.authenticator === true',
      () => sdk.api.users.getOne(nonAdminId),
      { shouldError: false, onResult: (u: any) => u.mfa?.authenticator === true && !u.mfa?.email }
    )

    await async_test(
      'A8. begin again while enrolled -> 400',
      () => sdkNonAdmin.api.users.begin_TOTP_configuration({}),
      { shouldError: true, onError: (e: any) => e.statusCode === 400 || /already configured/i.test(e.message || '') }
    )

    // ============================================================
    // B. Login challenge + replay protection
    // ============================================================
    log_header("B. TOTP Challenge + Replay")

    const challengeSession = new Session({ host })
    await challengeSession.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)
    assert(
      !!challengeSession.userInfo.requiresMFA || decode_jwt((challengeSession as any).authToken)?.requiresMFA === true,
      'expected requiresMFA session after password login with TOTP enabled',
      'B1. password login yields requiresMFA session'
    )

    await wait_for_fresh_totp_step()
    const challengeCode = compute_totp_code(totpSecret)
    await async_test(
      'B2. submit_MFA_challenge with TOTP code -> full session',
      () => challengeSession.api.users.submit_MFA_challenge({ code: challengeCode }),
      { shouldError: false, onResult: (r: any) => decode_jwt(r.authToken)?.requiresMFA === false }
    )
    lastVerifiedStep = current_timestep()

    // replay: same code from a fresh requiresMFA session must be rejected
    const replaySession = new Session({ host })
    await replaySession.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)
    await wait(undefined, 600) // submit rate limit is 1/500ms
    await async_test(
      'B3. replaying the same TOTP code -> 401',
      () => replaySession.api.users.submit_MFA_challenge({ code: challengeCode }),
      { shouldError: true, onError: (e: any) => e.statusCode === 401 || /invalid/i.test(e.message || '') }
    )

    // ============================================================
    // C. Recovery-code interplay with a second method
    // ============================================================
    log_header("C. Recovery-code interplay")

    await async_test(
      'C1. enabling email MFA when TOTP already configured -> recoveryCodes []',
      () => sdkNonAdmin.api.users.configure_MFA({}),
      { shouldError: false, onResult: (r: any) => {
        if (r.authToken) sdkNonAdmin.handle_new_session({ ...r.user, authToken: r.authToken } as any)
        return r.recoveryCodes?.length === 0 && r.user?.mfa?.email === true && r.user?.mfa?.authenticator === true
      }}
    )

    // ============================================================
    // D. Method-scoped disable + enforceMFA last-method rule
    // ============================================================
    log_header("D. Method-scoped disable")

    await sdk.api.organizations.updateOne(businessId, { enforceMFA: true } as any)
    await wait(undefined, 250)

    await async_test(
      'D1. disable email (other method remains) succeeds under enforceMFA',
      () => sdkNonAdmin.api.users.configure_MFA({ disable: true, method: 'email' }),
      { shouldError: false, onResult: (r: any) => {
        if (r.authToken) sdkNonAdmin.handle_new_session({ ...r.user, authToken: r.authToken } as any)
        return !r.user?.mfa?.email && r.user?.mfa?.authenticator === true
      }}
    )

    await async_test(
      'D2. disabling last method under enforceMFA -> 400',
      () => sdkNonAdmin.api.users.configure_MFA({ disable: true, method: 'authenticator' }),
      { shouldError: true, onError: (e: any) => e.statusCode === 400 || /at least one/i.test(e.message || '') }
    )

    await sdk.api.organizations.updateOne(businessId, { enforceMFA: false } as any)
    await wait(undefined, 250)

    await async_test(
      'D3. disable authenticator (enforceMFA off) succeeds',
      () => sdkNonAdmin.api.users.configure_MFA({ disable: true, method: 'authenticator' }),
      { shouldError: false, onResult: (r: any) => {
        if (r.authToken) sdkNonAdmin.handle_new_session({ ...r.user, authToken: r.authToken } as any)
        return !r.user?.mfa?.authenticator && !r.user?.mfa?.email
      }}
    )

    await async_test(
      'D4. user record mfa cleared',
      () => sdk.api.users.getOne(nonAdminId),
      { shouldError: false, onResult: (u: any) => !u.mfa?.authenticator && !u.mfa?.email }
    )

    // TOTP secret deleted with the method: a still-valid-looking code must no longer verify
    await wait_for_fresh_totp_step()
    await wait(undefined, 600) // submit rate limit is 1/500ms
    await async_test(
      'D5. TOTP submit after disable -> 401 (secret deleted)',
      () => sdkNonAdmin.api.users.submit_MFA_challenge({ code: compute_totp_code(totpSecret) }),
      { shouldError: true, onError: (e: any) => e.statusCode === 401 || /invalid/i.test(e.message || '') }
    )

    // ============================================================
    // E. allowedMFAMethods restriction gating + grace
    // ============================================================
    log_header("E. allowedMFAMethods gating")

    await set_allowed_mfa_methods(['authenticator'])

    await async_test(
      'E1. restricted to authenticator: enabling email MFA -> 403',
      () => sdkNonAdmin.api.users.configure_MFA({}),
      { shouldError: true, onError: (e: any) => e.statusCode === 403 || /not permitted/i.test(e.message || '') }
    )

    await async_test(
      'E2. restricted to authenticator + email unconfigured: email challenge -> 403',
      () => sdkNonAdmin.api.users.generate_MFA_challenge({ method: 'email' }),
      { shouldError: true, onError: (e: any) => e.statusCode === 403 || /not permitted/i.test(e.message || '') }
    )

    await set_allowed_mfa_methods(['email'])

    await async_test(
      'E3. restricted to email: begin_TOTP_configuration -> 403',
      () => sdkNonAdmin.api.users.begin_TOTP_configuration({}),
      { shouldError: true, onError: (e: any) => e.statusCode === 403 || /not permitted/i.test(e.message || '') }
    )

    await async_test(
      'E4. restricted to email: enabling email MFA succeeds (first method -> 10 recovery codes)',
      () => sdkNonAdmin.api.users.configure_MFA({}),
      { shouldError: false, onResult: (r: any) => {
        if (r.authToken) sdkNonAdmin.handle_new_session({ ...r.user, authToken: r.authToken } as any)
        return r.recoveryCodes?.length === 10 && r.user?.mfa?.email === true
      }}
    )

    // grace: email is configured, then the user is restricted to authenticator-only —
    // the already-configured email method must keep working (no lockout)
    await set_allowed_mfa_methods(['authenticator'])

    await async_test(
      'E5. grace: configured email challenge still works after restriction',
      () => sdkNonAdmin.api.users.generate_MFA_challenge({ method: 'email' }),
      { shouldError: false, onResult: () => true }
    )

    // cleanup E: clear restriction + disable email
    await clear_allowed_mfa_methods()
    await async_test(
      'E6. cleanup: disable email',
      () => sdkNonAdmin.api.users.configure_MFA({ disable: true, method: 'email' }),
      { shouldError: false, onResult: (r: any) => {
        if (r.authToken) sdkNonAdmin.handle_new_session({ ...r.user, authToken: r.authToken } as any)
        return true
      }}
    )

    // ============================================================
    // F. allowedMFAMethods is admin-only
    // ============================================================
    log_header("F. allowedMFAMethods admin gate")

    await async_test(
      'F1. non-admin cannot update allowedMFAMethods',
      () => sdkNonAdmin.api.users.updateOne(nonAdminId, { allowedMFAMethods: ['email'] } as any, { replaceObjectFields: true }),
      { shouldError: true, onError: (e: any) => /admin/i.test(e.message || '') || e.statusCode === 400 || e.statusCode === 403 }
    )

    await async_test(
      'F2. admin can update allowedMFAMethods',
      () => sdk.api.users.updateOne(nonAdminId, { allowedMFAMethods: ['email'] } as any, { replaceObjectFields: true }),
      { shouldError: false, onResult: () => true }
    )
    await wait(undefined, 250)
    await async_test(
      'F3. allowedMFAMethods persisted',
      () => sdk.api.users.getOne(nonAdminId),
      { shouldError: false, onResult: (u: any) => JSON.stringify(u.allowedMFAMethods) === JSON.stringify(['email']) }
    )
    await clear_allowed_mfa_methods()

    // ============================================================
    // G. Brute-force rate limit (runs last: exhausts the 10/10min submit bucket)
    // ============================================================
    log_header("G. Brute-force rate limit")

    let saw429 = false
    for (let i = 0; i < 12 && !saw429; i++) {
      await wait(undefined, 600) // stay under the 1/500ms bucket so only the 10/10min bucket trips
      try {
        await sdkNonAdmin.api.users.submit_MFA_challenge({ code: '123456' })
      } catch (e: any) {
        if (e.statusCode === 429 || /rate limit/i.test(e.message || '')) saw429 = true
      }
    }
    assert(saw429, 'expected 429 from repeated bad MFA submissions', 'G1. repeated bad codes hit 10/10min rate limit')
  } finally {
    await reset_mfa_state()
  }
}

// Allow running this test file independently
if (require.main === module) {
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await totp_mfa_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ TOTP MFA test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ TOTP MFA test suite failed:", error)
      process.exit(1)
    })
}
