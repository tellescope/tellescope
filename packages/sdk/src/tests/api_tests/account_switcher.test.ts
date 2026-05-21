require('source-map-support').install();

import { Session } from "../../sdk"
import {
  async_test,
  log_header,
  assert,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

const RAND = () => Math.random().toString(36).slice(2, 10)
const decode_jwt = (token: string): any => {
  try {
    const part = token.split('.')[1]
    const json = Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
    return JSON.parse(json)
  } catch { return null }
}

const passOnAnyResult = { shouldError: false, onResult: () => true }

export const account_switcher_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Account Switcher Tests")

  const adminId = sdk.userInfo.id
  const nonAdminId = sdkNonAdmin.userInfo.id
  const adminEmail = sdk.userInfo.email
  const nonAdminEmail = sdkNonAdmin.userInfo.email
  const nonAdminBusinessId = sdkNonAdmin.userInfo.businessId
  const adminBusinessId = sdk.userInfo.businessId

  const NON_ADMIN_EMAIL = process.env.NON_ADMIN_EMAIL
  const NON_ADMIN_PASSWORD = process.env.NON_ADMIN_PASSWORD
  if (!(NON_ADMIN_EMAIL && NON_ADMIN_PASSWORD)) {
    throw new Error("NON_ADMIN_EMAIL and NON_ADMIN_PASSWORD must be set to run account_switcher_tests")
  }

  // helper: fetch current user record server-side for inspection
  const get_user = async (s: Session, id: string) => s.api.users.getOne(id) as Promise<any>

  // The standard CRUD update path rate-limits identical updates to the same record at
  // 3/30s (routing.ts:2631). Cleanup PATCHes between sections all carry the same
  // { linkedAccountAccess: [] } payload and would trip it. Workaround: include a rotating
  // marker tag so every write has a unique JSON payload. Markers are stripped at end of run.
  let __lac_resetCounter = 0
  const sanitize_marker_tags = (tags: any[] = []) => tags.filter(t => typeof t === 'string' && !t.startsWith('__lac_'))
  const set_linkedAccountAccess = async (s: Session, ownerId: string, entries: any[]) => {
    __lac_resetCounter++
    const me: any = await s.api.users.getOne(ownerId)
    const newTags = [...sanitize_marker_tags(me?.tags ?? []), `__lac_${__lac_resetCounter}`]
    await s.api.users.updateOne(ownerId, {
      linkedAccountAccess: entries,
      tags: newTags,
    } as any, { replaceObjectFields: true })
  }
  // Idempotent clear — fetches current state and only writes if not already empty.
  // Skips the PATCH (and its rate-limit consumption) when the array is already cleared.
  const clear_linkedAccountAccess = async (s: Session, ownerId: string) => {
    const me: any = await s.api.users.getOne(ownerId)
    if (!((me?.linkedAccountAccess ?? []).length)) return
    await set_linkedAccountAccess(s, ownerId, [])
  }
  const cleanup_marker_tags = async (s: Session, ownerId: string) => {
    try {
      const me: any = await s.api.users.getOne(ownerId)
      const cleaned = sanitize_marker_tags(me?.tags ?? [])
      if ((me?.tags ?? []).length !== cleaned.length) {
        await s.api.users.updateOne(ownerId, { tags: cleaned } as any, { replaceObjectFields: true })
      }
    } catch { /* ignore */ }
  }

  await clear_linkedAccountAccess(sdk, adminId)
  await clear_linkedAccountAccess(sdkNonAdmin, nonAdminId)

  // The feature is opt-in per org. Enable it on the test business so the rest of the suite
  // exercises the feature (the O section below explicitly toggles it off to verify gating).
  const ensureOrgToggleEnabled = async () => {
    const org: any = await sdk.api.organizations.getOne(adminBusinessId)
    if (org?.accountSwitchingEnabled !== true) {
      await sdk.api.organizations.updateOne(adminBusinessId, { accountSwitchingEnabled: true } as any)
      await wait(undefined, 250)
    }
  }
  await ensureOrgToggleEnabled()

  // ============================================================
  // A. Email immutability
  // ============================================================
  log_header("A. Email immutability")

  // Tighter negative assertions — match the validation reason so a 500 won't pass silently.
  const emailRejectMatcher = (e: any) => (
    e.statusCode === 400
    || /(updates|disabled|readonly|cannot)/i.test(e.message || '')
  )
  await async_test(
    'A1. Self PATCH of own email rejected',
    () => sdkNonAdmin.api.users.updateOne(nonAdminId, { email: `evil-${RAND()}@tellescope.com` }),
    { shouldError: true, onError: emailRejectMatcher }
  )
  await async_test(
    'A2. Admin PATCH of another user email rejected',
    () => sdk.api.users.updateOne(nonAdminId, { email: `admin-rename-${RAND()}@tellescope.com` }),
    { shouldError: true, onError: emailRejectMatcher }
  )
  await async_test(
    'A3. Admin PATCH of own email rejected',
    () => sdk.api.users.updateOne(adminId, { email: `admin-self-${RAND()}@tellescope.com` }),
    { shouldError: true, onError: emailRejectMatcher }
  )
  await async_test(
    'A4. verifiedEmail/email unchanged after rejected updates',
    () => get_user(sdk, nonAdminId),
    { shouldError: false, onResult: (u: any) => u.verifiedEmail === true && u.email === nonAdminEmail }
  )

  // A5: email IS settable on user creation
  const seedEmail = `seed-${RAND()}@tellescope.com`
  let createdSeedUserId = ''
  await async_test(
    'A5. Admin can set email on user creation',
    () => sdk.api.users.createOne({ email: seedEmail, fname: 'Seed', lname: 'User' } as any),
    { shouldError: false, onResult: (u: any) => { createdSeedUserId = (u as any).id; return (u as any).email === seedEmail } }
  )
  if (createdSeedUserId) { try { await sdk.api.users.deleteOne(createdSeedUserId) } catch {} }

  // ============================================================
  // B. linkedAccountAccess PATCH-self validator
  // ============================================================
  log_header("B. linkedAccountAccess PATCH-self validator")

  // Seed: nonAdmin requests access to admin
  await sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })
  await wait(undefined, 250)

  const adminAfterRequest = await get_user(sdk, adminId)
  const pendingFromNonAdmin = (adminAfterRequest.linkedAccountAccess ?? []).find((e: any) => e.userId === nonAdminId)
  assert(!!pendingFromNonAdmin && pendingFromNonAdmin.status === 'pending', 'no pending entry seeded for B tests', 'B-seed pending entry present')

  // B14: PATCH self with array unchanged is a no-op
  await async_test(
    'B14. PATCH self with linkedAccountAccess unchanged succeeds',
    () => sdk.api.users.updateOne(adminId, { linkedAccountAccess: adminAfterRequest.linkedAccountAccess } as any, { replaceObjectFields: true }),
    passOnAnyResult
  )

  // B5/B6: cannot add entries
  const fakeEntry = {
    userId: '000000000000000000000099',
    email: 'fake@tellescope.com',
    fname: 'Fake', lname: 'User', orgName: 'Fake Org',
    status: 'accepted',
    createdAt: new Date(),
    requestExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  }
  const validatorRejectMatcher = (e: any) => (
    e.statusCode === 400
    || e.statusCode === 404
    // "No updates provided" fires when unknown fields (e.g. the removed accountAccessGrantedTo) get
    // stripped by the schema and nothing valid remains — that's a legitimate rejection mechanism.
    || /(linkedAccountAccess|owner|add entries|mutate|immutable|status can only|legacy|accountAccessGrantedTo|replaced|Could not find|No updates provided)/i.test(e.message || '')
  )
  await async_test(
    'B5. Cannot add accepted entry via PATCH',
    () => sdk.api.users.updateOne(adminId, { linkedAccountAccess: [...(adminAfterRequest.linkedAccountAccess ?? []), fakeEntry] } as any, { replaceObjectFields: true }),
    { shouldError: true, onError: validatorRejectMatcher }
  )
  await async_test(
    'B6. Cannot add pending entry via PATCH',
    () => sdk.api.users.updateOne(adminId, { linkedAccountAccess: [...(adminAfterRequest.linkedAccountAccess ?? []), { ...fakeEntry, status: 'pending' }] } as any, { replaceObjectFields: true }),
    { shouldError: true, onError: validatorRejectMatcher }
  )

  // B7-B13: cannot mutate immutable fields
  const mutations: [string, any][] = [
    ['userId', { ...pendingFromNonAdmin, userId: '000000000000000000000099' }],
    ['email', { ...pendingFromNonAdmin, email: 'mutated@tellescope.com' }],
    ['fname', { ...pendingFromNonAdmin, fname: 'MutatedF' }],
    ['lname', { ...pendingFromNonAdmin, lname: 'MutatedL' }],
    ['orgName', { ...pendingFromNonAdmin, orgName: 'MutatedOrg' }],
    ['createdAt', { ...pendingFromNonAdmin, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) }],
    ['requestExpiresAt', { ...pendingFromNonAdmin, requestExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) }],
  ]
  for (const [label, mutated] of mutations) {
    await async_test(
      `B7-13. Cannot mutate linkedAccountAccess entry ${label}`,
      () => sdk.api.users.updateOne(adminId, { linkedAccountAccess: [mutated] } as any, { replaceObjectFields: true }),
      { shouldError: true, onError: validatorRejectMatcher }
    )
  }

  // B3: pending -> accepted allowed
  await async_test(
    'B3. Owner can flip pending -> accepted',
    () => set_linkedAccountAccess(sdk, adminId, [{ ...pendingFromNonAdmin, status: 'accepted' }]),
    passOnAnyResult
  )

  // B4: accepted -> pending rejected
  await async_test(
    'B4. Cannot flip accepted -> pending',
    () => set_linkedAccountAccess(sdk, adminId, [{ ...pendingFromNonAdmin, status: 'pending' }]),
    { shouldError: true, onError: validatorRejectMatcher }
  )

  // B11/B12: non-owner PATCH of another user's linkedAccountAccess. Use a NON-empty
  // payload so the rate-limit key is unique from later admin-owned `[]` clears.
  await async_test(
    'B11/B12. Non-owner PATCH of another user linkedAccountAccess rejected',
    () => sdkNonAdmin.api.users.updateOne(adminId, { linkedAccountAccess: [{ ...pendingFromNonAdmin, status: 'accepted' }] } as any, { replaceObjectFields: true }),
    { shouldError: true, onError: validatorRejectMatcher }
  )

  // B15: legacy field no longer accepted
  await async_test(
    'B15. Legacy accountAccessGrantedTo PATCH is rejected',
    () => sdk.api.users.updateOne(adminId, { accountAccessGrantedTo: [nonAdminId] } as any),
    { shouldError: true, onError: validatorRejectMatcher }
  )

  // B1: Owner can remove a pending entry (re-seed first)
  await clear_linkedAccountAccess(sdk, adminId)
  await sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })
  await wait(undefined, 250)
  await async_test(
    'B1. Owner can remove a pending entry',
    () => set_linkedAccountAccess(sdk, adminId, []),
    passOnAnyResult
  )

  // B2: Owner can remove an accepted entry
  await sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })
  await wait(undefined, 250)
  const adminWithPending = await get_user(sdk, adminId)
  const seededPending = (adminWithPending.linkedAccountAccess ?? []).find((e: any) => e.userId === nonAdminId)
  await set_linkedAccountAccess(sdk, adminId, [{ ...seededPending, status: 'accepted' }])
  await async_test(
    'B2. Owner can remove an accepted entry',
    () => set_linkedAccountAccess(sdk, adminId, []),
    passOnAnyResult
  )

  // ============================================================
  // C. request_linked_account_access
  // ============================================================
  log_header("C. request_linked_account_access")

  const unauthedSdk = new Session({ host })
  // Unauthenticated requests can surface either a structured { statusCode: 401 } error or
  // the raw "Unauthenticated" string depending on where in the middleware the rejection fires.
  // Accept either shape but still pin to the 401 semantic.
  const is401Rejection = (e: any) => (
    e?.statusCode === 401
    || (typeof e === 'string' && /^unauthenticated$/i.test(e))
    || /^unauthenticated$/i.test(e?.message || '')
  )
  await async_test(
    'C1. Unauthenticated request returns 401',
    () => unauthedSdk.api.users.request_linked_account_access({ targetEmail: adminEmail }),
    { shouldError: true, onError: is401Rejection }
  )

  await async_test(
    'C2. Non-existent email returns {} (no error)',
    () => sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: `nobody-${RAND()}@tellescope.example` }),
    passOnAnyResult
  )
  await async_test(
    'C2. No record written for non-existent email',
    () => get_user(sdk, adminId),
    { shouldError: false, onResult: (u: any) => ((u.linkedAccountAccess ?? []) as any[]).length === 0 }
  )

  // C3: unverified email -> treated as no-match. Verify via admin-created user.
  const unverifiedEmail = `unverified-${RAND()}@tellescope.com`
  let unverifiedUserId = ''
  try {
    const created = await sdk.api.users.createOne({ email: unverifiedEmail, fname: 'Unv', lname: 'User' } as any)
    unverifiedUserId = (created as any).id
  } catch {}
  await async_test(
    'C3. Unverified email treated as no-match',
    () => sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: unverifiedEmail }),
    passOnAnyResult
  )
  if (unverifiedUserId) {
    await async_test(
      'C3. No record written on unverified target',
      () => get_user(sdk, unverifiedUserId),
      { shouldError: false, onResult: (u: any) => ((u.linkedAccountAccess ?? []) as any[]).length === 0 }
    )
    try { await sdk.api.users.deleteOne(unverifiedUserId) } catch {}
  }

  // C5: self-request
  await async_test(
    'C5. Self-request returns {} and writes nothing',
    () => sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: nonAdminEmail }),
    passOnAnyResult
  )
  await wait(undefined, 250)
  await async_test(
    'C5. No record written on self-request',
    () => get_user(sdkNonAdmin, nonAdminId),
    { shouldError: false, onResult: (u: any) => ((u.linkedAccountAccess ?? []) as any[]).length === 0 }
  )

  // C4: valid match
  await async_test(
    'C4. Valid email request returns {}',
    () => sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail }),
    passOnAnyResult
  )
  await wait(undefined, 250)
  await async_test(
    'C4. Pending entry written with requester snapshot',
    () => get_user(sdk, adminId),
    { shouldError: false, onResult: (u: any) => {
      const e = (u.linkedAccountAccess ?? []).find((x: any) => x.userId === nonAdminId)
      if (!e) return false
      const expiresOk = (new Date(e.requestExpiresAt).getTime() - Date.now()) > 6 * 24 * 60 * 60 * 1000
      return e.status === 'pending' && e.email === nonAdminEmail && !!e.createdAt && expiresOk
    }}
  )

  // C6: idempotent
  const adminPre = await get_user(sdk, adminId)
  const preLen = ((adminPre.linkedAccountAccess ?? []) as any[]).length
  await sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })
  await wait(undefined, 250)
  await async_test(
    'C6. Duplicate request inside window does not duplicate the entry',
    () => get_user(sdk, adminId),
    { shouldError: false, onResult: (u: any) => ((u.linkedAccountAccess ?? []) as any[]).length === preLen }
  )

  // C7: existing accepted -> no-op
  const adminBeforeAccept = await get_user(sdk, adminId)
  const pendingEntry = (adminBeforeAccept.linkedAccountAccess ?? []).find((e: any) => e.userId === nonAdminId)
  await set_linkedAccountAccess(sdk, adminId, [{ ...pendingEntry, status: 'accepted' }])
  await wait(undefined, 250)
  await sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })
  await wait(undefined, 250)
  await async_test(
    'C7. Re-requesting on accepted entry is a no-op',
    () => get_user(sdk, adminId),
    { shouldError: false, onResult: (u: any) => {
      const entries = (u.linkedAccountAccess ?? []) as any[]
      const e = entries.find((x: any) => x.userId === nonAdminId)
      return entries.length === 1 && e?.status === 'accepted'
    }}
  )

  // Reset
  await clear_linkedAccountAccess(sdk, adminId)

  // C9: email case-insensitivity (whitespace is rejected at the schema validator;
  // case-insensitive matching happens after emailValidator lowercases the input).
  await sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail.toUpperCase() })
  await wait(undefined, 250)
  await async_test(
    'C9. Email case-insensitive matching',
    () => get_user(sdk, adminId),
    { shouldError: false, onResult: (u: any) => ((u.linkedAccountAccess ?? []) as any[]).some((e: any) => e.userId === nonAdminId) }
  )

  // C10 is the request_linked_account_access rate-limit test. Because it exhausts admin's
  // `request-linked-${adminId}` counter for 60s, and E5/E6/E7 setup needs admin to send a
  // single request_linked_account_access (to be the source-side in the role-flipped lockout
  // tests), C10 is intentionally relocated to the bottom of the suite (after I4) so no
  // downstream test depends on admin's request_linked quota.

  // ============================================================
  // D. get_linked_accounts
  // ============================================================
  log_header("D. get_linked_accounts")

  await clear_linkedAccountAccess(sdk, adminId)
  await sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })
  await wait(undefined, 250)
  const adminWithReq = await get_user(sdk, adminId)
  const pendingForNonAdmin = (adminWithReq.linkedAccountAccess ?? []).find((e: any) => e.userId === nonAdminId)

  await async_test(
    'D2. Pending entry not returned',
    () => sdkNonAdmin.api.users.get_linked_accounts(),
    { shouldError: false, onResult: (r: any) => !((r.linkedAccounts ?? []) as any[]).some(a => a.id === adminId) }
  )

  await set_linkedAccountAccess(sdk, adminId, [{ ...pendingForNonAdmin, status: 'accepted' }])
  await wait(undefined, 250)

  await async_test(
    'D1. Accepted entry is returned',
    () => sdkNonAdmin.api.users.get_linked_accounts(),
    { shouldError: false, onResult: (r: any) => ((r.linkedAccounts ?? []) as any[]).some(a => a.id === adminId) }
  )
  await async_test(
    'D5. Returned row has expected identity fields',
    () => sdkNonAdmin.api.users.get_linked_accounts(),
    { shouldError: false, onResult: (r: any) => {
      const row = ((r.linkedAccounts ?? []) as any[]).find(a => a.id === adminId)
      return !!row && typeof row.email === 'string' && row.email.length > 0 && typeof row.orgName === 'string' && typeof row.requiresMFA === 'boolean'
    }}
  )
  await async_test(
    'D3. Self is excluded',
    () => sdkNonAdmin.api.users.get_linked_accounts(),
    { shouldError: false, onResult: (r: any) => !((r.linkedAccounts ?? []) as any[]).some(a => a.id === nonAdminId) }
  )
  await async_test(
    'D6. Empty result for caller with no grants directed at them',
    () => sdk.api.users.get_linked_accounts(),
    { shouldError: false, onResult: (r: any) => Array.isArray(r.linkedAccounts) && r.linkedAccounts.length === 0 }
  )

  // ============================================================
  // E. switch_account — grant + accessibility
  // ============================================================
  log_header("E. switch_account — grant + accessibility")

  await clear_linkedAccountAccess(sdk, adminId)
  await async_test(
    'E1. No entry -> 403',
    () => sdkNonAdmin.api.users.switch_account({ targetUserId: adminId }),
    { shouldError: true, onError: (e: any) => e.statusCode === 403 || (e.message || '').includes('not granted') }
  )

  await sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })
  await wait(undefined, 250)
  await async_test(
    'E2. Only pending -> 403',
    () => sdkNonAdmin.api.users.switch_account({ targetUserId: adminId }),
    { shouldError: true, onError: (e: any) => e.statusCode === 403 || (e.message || '').includes('not granted') }
  )

  await async_test(
    'E3. Self-switch -> 400',
    () => sdkNonAdmin.api.users.switch_account({ targetUserId: nonAdminId }),
    { shouldError: true, onError: (e: any) => e.statusCode === 400 || (e.message || '').includes('own account') }
  )

  await async_test(
    'E4. Nonexistent target -> 404',
    () => sdkNonAdmin.api.users.switch_account({ targetUserId: '000000000000000000000000' }),
    { shouldError: true, onError: (e: any) => e.statusCode === 404 || (e.message || '').includes('not found') }
  )

  // E9. Malformed targetUserId -> 400 (mongoIdStringRequired schema validator)
  await async_test(
    'E9. Malformed targetUserId -> 400',
    () => sdkNonAdmin.api.users.switch_account({ targetUserId: 'not-a-mongo-id' as any }),
    { shouldError: true, onError: (e: any) => e.statusCode === 400 || /(invalid|mongoId|parsing|format)/i.test(e.message || '') }
  )

  // E5/E6/E7. Locked target -> 401. Flip roles: admin (only user who can write locked* fields) is the
  // SOURCE, nonAdmin is the TARGET. nonAdmin grants admin access first.
  // Run BEFORE E10's rate-limit exhaustion so admin's switch counter is still fresh here.
  await clear_linkedAccountAccess(sdkNonAdmin, nonAdminId)
  await sdk.api.users.request_linked_account_access({ targetEmail: nonAdminEmail })
  await wait(undefined, 250)
  const nonAdminAfterReq = await get_user(sdkNonAdmin, nonAdminId)
  const pendingFromAdmin = (nonAdminAfterReq.linkedAccountAccess ?? []).find((e: any) => e.userId === adminId)
  if (pendingFromAdmin) {
    await set_linkedAccountAccess(sdkNonAdmin, nonAdminId, [{ ...pendingFromAdmin, status: 'accepted' }])
    await wait(undefined, 250)
  }

  // E5: lockedOutUntil in the future
  await sdk.api.users.updateOne(nonAdminId, { lockedOutUntil: Date.now() + 60_000 } as any)
  await async_test(
    'E5. Target with lockedOutUntil > now -> 401',
    () => sdk.api.users.switch_account({ targetUserId: nonAdminId }),
    { shouldError: true, onError: (e: any) => e.statusCode === 401 || /(locked|not accessible)/i.test(e.message || '') }
  )

  // E6: lockedOutUntil === 0 (indefinite lock)
  await sdk.api.users.updateOne(nonAdminId, { lockedOutUntil: 0 } as any)
  await async_test(
    'E6. Target with lockedOutUntil === 0 -> 401',
    () => sdk.api.users.switch_account({ targetUserId: nonAdminId }),
    { shouldError: true, onError: (e: any) => e.statusCode === 401 || /(locked|not accessible)/i.test(e.message || '') }
  )

  // E7: failedLoginAttempts >= 10
  await sdk.api.users.updateOne(nonAdminId, { lockedOutUntil: -1, failedLoginAttempts: 10 } as any)
  await async_test(
    'E7. Target with failedLoginAttempts >= 10 -> 401',
    () => sdk.api.users.switch_account({ targetUserId: nonAdminId }),
    { shouldError: true, onError: (e: any) => e.statusCode === 401 || /(locked|not accessible|failed login)/i.test(e.message || '') }
  )

  // Restore nonAdmin to a healthy state. Setting lockedOutUntil to 0/future in E5/E6 triggered
  // deauthenticate_user(nonAdminId) via routing.ts:2742-2752, writing `deauthenticated-${id}`
  // to cache with the current timestamp. is_logged_in rejects any token whose iat falls within
  // the 1s slack window after that timestamp — so a re-auth too quickly afterward produces a
  // token that gets immediately invalidated. Wait > 1s past E6's deauth before re-authing.
  await sdk.api.users.updateOne(nonAdminId, { lockedOutUntil: -1, failedLoginAttempts: 0 } as any)
  await wait(undefined, 1500)
  await sdkNonAdmin.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)
  await clear_linkedAccountAccess(sdkNonAdmin, nonAdminId)

  // E10. switch_account rate limit (20/min). Each failed switch consumes a quota slot
  // (rate-limit check runs first; source token not invalidated). E5-E7 above already burned
  // 3 slots from admin's switch-account counter, so prime 17 more to reach the limit, then
  // assert the next call is 429. Keep this LAST in E — exhausts admin's switch counter.
  for (let i = 0; i < 17; i++) {
    try { await sdk.api.users.switch_account({ targetUserId: '000000000000000000000000' }) } catch {}
  }
  await async_test(
    'E10. Switch beyond 20/min is rate-limited (429)',
    () => sdk.api.users.switch_account({ targetUserId: '000000000000000000000000' }),
    { shouldError: true, onError: (e: any) => e.statusCode === 429 || (e.message || '').toLowerCase().includes('rate') }
  )

  // ============================================================
  // F. switch_account — enforceMFA gap
  // ============================================================
  log_header("F. switch_account — enforceMFA gap")

  // Set up accepted grant: nonAdmin requests, admin accepts. (E section cleared admin's array.)
  await clear_linkedAccountAccess(sdk, adminId)
  await sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })
  await wait(undefined, 250)
  const adminForF = await get_user(sdk, adminId)
  const pendingForF = (adminForF.linkedAccountAccess ?? []).find((e: any) => e.userId === nonAdminId)
  if (pendingForF) {
    await set_linkedAccountAccess(sdk, adminId, [{ ...pendingForF, status: 'accepted' }])
    await wait(undefined, 250)
  }

  // Enable enforceMFA on the test business; admin (target) currently has no MFA configured.
  await sdk.api.organizations.updateOne(adminBusinessId, { enforceMFA: true } as any)
  await wait(undefined, 250)

  // F1: target with no MFA but org enforces -> 403
  await async_test(
    'F1. enforceMFA on org + target MFA not configured -> 403',
    () => sdkNonAdmin.api.users.switch_account({ targetUserId: adminId }),
    { shouldError: true, onError: (e: any) => e.statusCode === 403 || /(MFA configuration|enforceMFA)/i.test(e.message || '') }
  )

  // F2: admin configures MFA, switch now succeeds — but the switched JWT has requiresMFA: true.
  await sdk.api.users.configure_MFA({ disable: false })
  await wait(undefined, 250)
  await async_test(
    'F2. After target configures MFA, switch succeeds and switched JWT has requiresMFA: true',
    () => sdkNonAdmin.api.users.switch_account({ targetUserId: adminId }),
    { shouldError: false, onResult: (r: any) => {
      const decoded = decode_jwt(r.authToken)
      return !!r.authToken && decoded?.requiresMFA === true
    }}
  )

  // Teardown F: revert enforceMFA first (configure_MFA(disable=true) refuses while enforced),
  // then disable MFA on admin. Re-auth nonAdmin since its source token was invalidated by F2's switch.
  await sdk.api.organizations.updateOne(adminBusinessId, { enforceMFA: false } as any)
  await wait(undefined, 250)
  try { await sdk.api.users.configure_MFA({ disable: true }) } catch {}
  await sdkNonAdmin.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)

  // ============================================================
  // G. switch_account — JWT + audit
  // ============================================================
  log_header("G. switch_account — JWT + audit")

  // Set up an accepted grant. clear_linkedAccountAccess removes F's accepted entry, which
  // writes the `grant-revoked-${adminId}-${nonAdminId}` cache key. is_logged_in compares that
  // key against the new JWT's iat with a 1s slack (accounts for JWT iat second-rounding), so
  // we must ensure the new grant is minted well past that window or the freshly-switched
  // token gets rejected as if it were a pre-revocation token. Wait > 1s between the cleanup
  // and the new switch.
  await clear_linkedAccountAccess(sdk, adminId)
  await wait(undefined, 1500)
  await sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })
  await wait(undefined, 250)
  const adminPendingState = await get_user(sdk, adminId)
  const pendingNA = (adminPendingState.linkedAccountAccess ?? []).find((e: any) => e.userId === nonAdminId)
  await set_linkedAccountAccess(sdk, adminId, [{ ...pendingNA, status: 'accepted' }])
  await wait(undefined, 250)

  let switchedToken = ''
  let switchedUser: any = null
  await async_test(
    'G0. Switch succeeds when accepted grant exists',
    () => sdkNonAdmin.api.users.switch_account({ targetUserId: adminId }),
    { shouldError: false, onResult: (r: any) => {
      switchedToken = r.authToken
      switchedUser = r.user
      return typeof r.authToken === 'string' && r.authToken.length > 0 && r.user?.id === adminId
    }}
  )

  const decoded = decode_jwt(switchedToken)
  assert(!!decoded, 'JWT decode failed', 'G1. JWT decoded')
  assert(decoded?.id === adminId, `JWT.id ${decoded?.id} != expected ${adminId}`, 'G1. JWT.id == target')
  assert(decoded?.actorUserId === nonAdminId, `JWT.actorUserId mismatch`, 'G1. JWT.actorUserId == source')
  assert(decoded?.actorEmail === nonAdminEmail, `JWT.actorEmail mismatch`, 'G1. JWT.actorEmail')
  assert(decoded?.actorBusinessId === nonAdminBusinessId, `JWT.actorBusinessId mismatch`, 'G1. JWT.actorBusinessId')

  await async_test(
    'G2. Pre-switch nonAdmin token is invalidated',
    () => sdkNonAdmin.test_authenticated(),
    { shouldError: true, onError: () => true }
  )

  const switchedSdk = new Session({ host })
  switchedSdk.setAuthToken(switchedToken)
  switchedSdk.setUserInfo(switchedUser)
  await async_test(
    'G3. Switched token authenticates',
    () => switchedSdk.test_authenticated(),
    { shouldError: false, onResult: (r: any) => r === 'Authenticated!' }
  )

  await wait(undefined, 500)
  await async_test(
    'G4. user_logs has account_switch event with full info',
    () => sdk.api.user_logs.getOne({ resourceId: adminId, resource: 'users', action: 'update' } as any),
    { shouldError: false, onResult: (log: any) => {
      const info = log?.info ?? {}
      return log?.userId === nonAdminId
        && info.event === 'account_switch'
        && info.sourceUserId === nonAdminId
        && info.sourceEmail === nonAdminEmail
        && info.sourceBusinessId === nonAdminBusinessId
        && info.targetUserId === adminId
        && info.targetEmail === adminEmail
        && info.targetBusinessId === adminBusinessId
    }}
  )

  // G5: downstream user_log under switched session carries actorUserId.
  // Capture original fname so we can restore it during cleanup — downstream tests
  // (e.g. Calendar RSVPs) compare userInfo.fname against server-side values.
  const originalAdminFname = sdk.userInfo.fname
  await switchedSdk.api.users.updateOne(adminId, { fname: `Switched-${RAND()}` } as any)
  await wait(undefined, 500)
  await async_test(
    'G5. Downstream user_log under switched session has actorUserId',
    () => sdk.api.user_logs.getSome({ filter: { resourceId: adminId, resource: 'users', action: 'update' } } as any),
    { shouldError: false, onResult: (logs: any[]) => (logs ?? []).some((l: any) => l.actorUserId === nonAdminId && l.userId === adminId) }
  )

  // G6. PHI-adjacent collection: create an enduser through the switched session and assert
  // the auto-emitted CRUD user_log carries actorUserId (exercises routing.ts inline insert
  // path, not just storeUserLog or the users-collection update path).
  let g6EnduserId = ''
  try {
    const ce = await switchedSdk.api.endusers.createOne({ fname: 'Switch', lname: 'Test', email: `switch-test-${RAND()}@tellescope.example` } as any)
    g6EnduserId = (ce as any).id
  } catch (e) { /* assertion below will surface */ }
  await wait(undefined, 500)
  await async_test(
    'G6. Downstream enduser create under switched session has actorUserId',
    () => sdk.api.user_logs.getSome({ filter: { resource: 'endusers', action: 'create' } } as any),
    { shouldError: false, onResult: (logs: any[]) => (logs ?? []).some((l: any) => l.actorUserId === nonAdminId && l.userId === adminId && (g6EnduserId ? l.resourceId === g6EnduserId : true)) }
  )
  if (g6EnduserId) { try { await sdk.api.endusers.deleteOne(g6EnduserId) } catch {} }

  // G7. Cross-org boundary assertion: the switched JWT operates in the TARGET's business.
  // If a future change ever gates cross-org switching, this assertion will fire.
  assert(decoded?.businessId === adminBusinessId, `JWT.businessId mismatch (got ${decoded?.businessId}, expected ${adminBusinessId})`, 'G7. JWT.businessId == target businessId')

  // ============================================================
  // H. Real-time revocation
  // ============================================================
  log_header("H. Real-time revocation")

  await async_test(
    'H1. Baseline: switched session reads OK',
    () => switchedSdk.test_authenticated(),
    { shouldError: false, onResult: (r: any) => r === 'Authenticated!' }
  )

  // Revoke
  await clear_linkedAccountAccess(sdk, adminId)
  await wait(undefined, 750)

  await async_test(
    'H2. Switched session 401 after revoke',
    () => switchedSdk.test_authenticated(),
    { shouldError: true, onError: is401Rejection }
  )

  await async_test(
    'H3. Owner own session still works (no over-broad invalidation)',
    () => sdk.test_authenticated(),
    { shouldError: false, onResult: (r: any) => r === 'Authenticated!' }
  )

  // H6. After revoke, a brand-new switch_account attempt is also rejected (covers the
  // net-new path, complementing H2 which covers the already-minted session path).
  // nonAdmin's source token from G0 was invalidated by that successful switch; re-auth first.
  await sdkNonAdmin.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)
  await async_test(
    'H6. New switch_account after revoke -> 403',
    () => sdkNonAdmin.api.users.switch_account({ targetUserId: adminId }),
    { shouldError: true, onError: (e: any) => e.statusCode === 403 || (e.message || '').includes('not granted') }
  )

  // H5: reject of pending entry does not write a stale revocation key
  await sdkNonAdmin.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)
  await sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })
  await wait(undefined, 250)
  await clear_linkedAccountAccess(sdk, adminId)  // reject pending
  await wait(undefined, 250)
  await sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })
  await wait(undefined, 250)
  const state = await get_user(sdk, adminId)
  const newPending = (state.linkedAccountAccess ?? []).find((e: any) => e.userId === nonAdminId)
  await set_linkedAccountAccess(sdk, adminId, [{ ...newPending, status: 'accepted' }])
  await wait(undefined, 500)
  await async_test(
    'H5. New switched session works after a prior reject (no stale revocation)',
    () => sdkNonAdmin.api.users.switch_account({ targetUserId: adminId }),
    { shouldError: false, onResult: (r: any) => typeof r.authToken === 'string' && r.authToken.length > 0 }
  )
  await sdkNonAdmin.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)

  // ============================================================
  // O. Org-toggle gating (accountSwitchingEnabled)
  // ============================================================
  log_header("O. Org-toggle gating")

  // Pre-stage an accepted entry while the toggle is ON (it currently is).
  // Wait > 1s after the cleanup so the (adminId, nonAdminId) revocation key from H sits
  // clearly before the new switch's iat — is_logged_in's 1s slack would otherwise reject
  // freshly minted tokens as if they were pre-revocation.
  await clear_linkedAccountAccess(sdk, adminId)
  await wait(undefined, 1500)
  await sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })
  await wait(undefined, 250)
  const oSeedState = await get_user(sdk, adminId)
  const oPending = (oSeedState.linkedAccountAccess ?? []).find((e: any) => e.userId === nonAdminId)
  if (oPending) {
    await set_linkedAccountAccess(sdk, adminId, [{ ...oPending, status: 'accepted' }])
    await wait(undefined, 250)
  }

  // Toggle OFF.
  await sdk.api.organizations.updateOne(adminBusinessId, { accountSwitchingEnabled: false } as any)
  await wait(undefined, 250)

  // O1. request_linked_account_access silently no-ops while toggle is off.
  const oBefore = await get_user(sdk, adminId)
  const oBeforeLen = ((oBefore.linkedAccountAccess ?? []) as any[]).length
  await async_test(
    'O1. request_linked_account_access returns {} while toggle is off',
    () => sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail }),
    { shouldError: false, onResult: () => true }
  )
  await wait(undefined, 250)
  await async_test(
    'O1. No new record written while toggle is off',
    () => get_user(sdk, adminId),
    { shouldError: false, onResult: (u: any) => ((u.linkedAccountAccess ?? []) as any[]).length === oBeforeLen }
  )

  // O2. switch_account on a pre-existing accepted grant -> 403 while toggle is off.
  await async_test(
    'O2. switch_account -> 403 while target org has toggle off',
    () => sdkNonAdmin.api.users.switch_account({ targetUserId: adminId }),
    { shouldError: true, onError: (e: any) => e.statusCode === 403 || /(organization has not enabled|switching)/i.test(e.message || '') }
  )

  // O5. With the toggle off, the SOURCE-org check fires first (before the target check),
  // so switch_account responds with "Your organization has not enabled..." rather than
  // "Target organization has not enabled...". Single-org fixture means source==target here;
  // the error-message assertion is what proves the source-side gate is actually firing
  // (without it, O2 would have passed under the old target-only implementation too).
  await async_test(
    'O5. switch_account error message names the actor org (source-side check fires)',
    () => sdkNonAdmin.api.users.switch_account({ targetUserId: adminId }),
    { shouldError: true, onError: (e: any) => /your organization/i.test(e.message || '') }
  )

  // Toggle ON again.
  await sdk.api.organizations.updateOne(adminBusinessId, { accountSwitchingEnabled: true } as any)
  await wait(undefined, 250)

  // O3. switch_account now succeeds (same accepted grant as before).
  await async_test(
    'O3. switch_account succeeds once toggle is re-enabled',
    () => sdkNonAdmin.api.users.switch_account({ targetUserId: adminId }),
    { shouldError: false, onResult: (r: any) => typeof r.authToken === 'string' && r.authToken.length > 0 }
  )
  // nonAdmin's source token was invalidated by the switch; re-auth for subsequent tests.
  await sdkNonAdmin.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)

  // O4. request_linked_account_access writes a record once toggle is re-enabled.
  await clear_linkedAccountAccess(sdk, adminId)
  await sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })
  await wait(undefined, 250)
  await async_test(
    'O4. request_linked_account_access writes a pending entry once toggle is on',
    () => get_user(sdk, adminId),
    { shouldError: false, onResult: (u: any) => ((u.linkedAccountAccess ?? []) as any[]).some((e: any) => e.userId === nonAdminId && e.status === 'pending') }
  )

  // ============================================================
  // I. Cross-cutting / regressions
  // ============================================================
  log_header("I. Cross-cutting / regressions")

  await async_test(
    'I1. Legacy users.updateOne({ accountAccessGrantedTo: [...] }) rejected',
    () => sdk.api.users.updateOne(adminId, { accountAccessGrantedTo: [nonAdminId] } as any),
    { shouldError: true, onError: (e: any) => e.statusCode === 400 || /(accountAccessGrantedTo|legacy|replaced|No updates provided)/i.test(e.message || '') }
  )

  await async_test(
    'I2. After full revoke, get_linked_accounts no longer shows A',
    async () => {
      await clear_linkedAccountAccess(sdk, adminId)
      await wait(undefined, 250)
      const r = await sdkNonAdmin.api.users.get_linked_accounts()
      return ((r.linkedAccounts ?? []) as any[]).find((a: any) => a.id === adminId)
    },
    { shouldError: false, onResult: (r: any) => r === undefined }
  )

  // I4. Accepted-grant expiration semantics — lock in the chosen behavior.
  // The switch handler does NOT check requestExpiresAt for accepted entries: that field
  // only governs the *pending* TTL. If this changes, this test will fail; that's the
  // signal to make the behavior choice deliberately. (Simulating an actually-expired
  // accepted grant requires either waiting 7 days or mutating requestExpiresAt — the
  // schema validator blocks the latter, so we lock in the behavior by inspection.)
  // I2 above did clear_linkedAccountAccess → wait > 1s past the resulting revocation key
  // before re-granting; otherwise is_logged_in's 1s slack rejects the new switched token.
  await wait(undefined, 1500)
  await sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })
  await wait(undefined, 250)
  const i4State = await get_user(sdk, adminId)
  const i4Pending = (i4State.linkedAccountAccess ?? []).find((e: any) => e.userId === nonAdminId)
  if (i4Pending) {
    await set_linkedAccountAccess(sdk, adminId, [{ ...i4Pending, status: 'accepted' }])
    await wait(undefined, 250)
  }
  const i4Accepted = await get_user(sdk, adminId)
  const i4Entry = (i4Accepted.linkedAccountAccess ?? []).find((e: any) => e.userId === nonAdminId)
  await async_test(
    'I4. Switch succeeds on a future-dated accepted grant (expiration-ignored semantics locked in by inspection)',
    () => sdkNonAdmin.api.users.switch_account({ targetUserId: adminId }),
    { shouldError: false, onResult: (r: any) => (
      typeof r.authToken === 'string'
      && r.authToken.length > 0
      && !!i4Entry
      && new Date(i4Entry.requestExpiresAt).getTime() > Date.now()
    )}
  )
  // Re-auth nonAdmin since the switch invalidated its source token
  await sdkNonAdmin.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)

  // ============================================================
  // K. Actor-identity model (chained-switch + switch-back semantics)
  // ============================================================
  // Premise: the real operator is always the actor (session.actorUserId || session.id).
  // Grant checks, audit attribution, and request authorship all derive from realActor —
  // never from the proxy identity. Verified here via:
  //   - get_linked_accounts returns the actor's grants + the actor's own account (switch-back).
  //   - Validator rejects ALL linkedAccountAccess writes from switched sessions.
  //   - request_linked_account_access uses actor's email for self-check (proxy-email no-op
  //     would otherwise create a self-targeted pending entry).
  //   - switch_account back to the actor mints a JWT with actor* claims cleared.
  //   - Audit log for switch-back records event=account_switch_back with proxySessionId.
  log_header("K. Actor-identity model")

  // Seed an accepted grant so nonAdmin can switch into admin. Wait > 1s past the prior
  // clear_linkedAccountAccess so is_logged_in's iat-vs-revoked-key slack doesn't trip.
  await clear_linkedAccountAccess(sdk, adminId)
  await wait(undefined, 1500)
  await sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })
  await wait(undefined, 250)
  const kSeedState = await get_user(sdk, adminId)
  const kPending = (kSeedState.linkedAccountAccess ?? []).find((e: any) => e.userId === nonAdminId)
  await set_linkedAccountAccess(sdk, adminId, [{ ...kPending, status: 'accepted' }])
  await wait(undefined, 250)

  // K1. Establish a switched session: nonAdmin → admin.
  let kSwitchedToken = ''
  let kSwitchedUser: any = null
  await async_test(
    'K1. nonAdmin switches into admin (sets up actor-identity scenario)',
    () => sdkNonAdmin.api.users.switch_account({ targetUserId: adminId }),
    { shouldError: false, onResult: (r: any) => {
      kSwitchedToken = r.authToken
      kSwitchedUser = r.user
      return typeof r.authToken === 'string' && r.authToken.length > 0 && r.user?.id === adminId
    }}
  )
  const kSwitchedSdk = new Session({ host })
  kSwitchedSdk.setAuthToken(kSwitchedToken)
  kSwitchedSdk.setUserInfo(kSwitchedUser)

  // K2. get_linked_accounts from a switched session returns the actor's own account first
  // (the switch-back entry) and excludes the current proxy identity (admin) — querying
  // against realActor=nonAdmin would normally surface admin (it has nonAdmin: accepted),
  // but the caller IS already admin so switching there would no-op. K8b separately covers
  // the case where the list DOES include actor-grants that aren't the current proxy.
  await async_test(
    'K2. get_linked_accounts from switched session: actor first, current proxy excluded',
    () => kSwitchedSdk.api.users.get_linked_accounts(),
    { shouldError: false, onResult: (r: any) => {
      const accounts = (r?.linkedAccounts ?? []) as any[]
      if (accounts.length === 0) return false
      if (accounts[0].id !== nonAdminId) return false
      // Current proxy (admin) must NOT appear, even though admin granted nonAdmin.
      const hasSelfProxy = accounts.some((a: any) => a.id === adminId)
      return !hasSelfProxy
    }}
  )

  // K3. Validator rejects ALL linkedAccountAccess PATCHes from a switched session — even
  // ones the proxy identity (admin = ownerId) would normally be authorized to make. Closes
  // the self-approval / silent-revoke hole. Use the marker-tag helper to ensure a unique
  // payload (avoid the 3/30s identical-update rate limit colliding with this case).
  await async_test(
    'K3. Validator rejects linkedAccountAccess PATCH from switched session',
    () => set_linkedAccountAccess(kSwitchedSdk, adminId, [{ ...kPending, status: 'accepted' }]),
    { shouldError: true, onError: (e: any) => (
      e.statusCode === 400
      || /(switched session|actorUserId|while acting)/i.test(e.message || '')
    )}
  )

  // K4. request_linked_account_access from switched session uses the actor's email for the
  // self-check. Calling with targetEmail = nonAdminEmail (the actor's own email) → silent
  // {} and NO write. Old behavior would have used session.email=adminEmail for the self-
  // check, mismatched, looked up nonAdmin, and created a pending entry on nonAdmin.
  await async_test(
    'K4. request_linked_account_access from switched session uses actor email for self-check',
    () => kSwitchedSdk.api.users.request_linked_account_access({ targetEmail: nonAdminEmail }),
    passOnAnyResult,
  )
  await wait(undefined, 250)
  await async_test(
    'K4. No pending entry created on actor record (actor identity is the requester)',
    () => get_user(sdk, nonAdminId),
    { shouldError: false, onResult: (u: any) => !((u.linkedAccountAccess ?? []) as any[]).length }
  )

  // K5. switch-back: nonAdmin (acting as admin) returns to nonAdmin. No grant lookup
  // (target === realActor); resulting JWT has all actor* claims cleared.
  let kBackToken = ''
  await async_test(
    'K5. Switch-back to actor succeeds (no grant lookup required)',
    () => kSwitchedSdk.api.users.switch_account({ targetUserId: nonAdminId }),
    { shouldError: false, onResult: (r: any) => {
      kBackToken = r.authToken
      return typeof r.authToken === 'string' && r.authToken.length > 0 && r.user?.id === nonAdminId
    }}
  )
  const kBackDecoded = decode_jwt(kBackToken)
  assert(kBackDecoded?.id === nonAdminId, `JWT.id ${kBackDecoded?.id} != ${nonAdminId}`, 'K5. JWT.id == actor')
  assert(!kBackDecoded?.actorUserId, `JWT still carries actorUserId=${kBackDecoded?.actorUserId} after switch-back`, 'K5. JWT.actorUserId cleared')
  assert(!kBackDecoded?.actorEmail, `JWT still carries actorEmail after switch-back`, 'K5. JWT.actorEmail cleared')
  assert(!kBackDecoded?.actorBusinessId, `JWT still carries actorBusinessId after switch-back`, 'K5. JWT.actorBusinessId cleared')

  // K5b. The switched-back token authenticates as a normal nonAdmin session.
  const kBackSdk = new Session({ host })
  kBackSdk.setAuthToken(kBackToken)
  await async_test(
    'K5b. Switched-back token authenticates',
    () => kBackSdk.test_authenticated(),
    { shouldError: false, onResult: (r: any) => r === 'Authenticated!' }
  )

  // K6. Audit log for the switch-back: event=account_switch_back, userId=realActor (nonAdmin),
  // proxySessionId=admin (the proxy identity that issued the request).
  await wait(undefined, 500)
  await async_test(
    'K6. user_logs has account_switch_back event with realActor as userId + proxySessionId',
    () => sdk.api.user_logs.getSome({ filter: { resourceId: nonAdminId, resource: 'users', action: 'update' } } as any),
    { shouldError: false, onResult: (logs: any[]) => (logs ?? []).some((l: any) => {
      const info = l?.info ?? {}
      return l?.userId === nonAdminId
        && info.event === 'account_switch_back'
        && info.sourceUserId === nonAdminId
        && info.proxySessionId === adminId
        && info.targetUserId === nonAdminId
    })}
  )

  // K7. From the now-clean nonAdmin session (kBackSdk, minted by the K5 switch-back),
  // switching back INTO admin works normally — grant unchanged, chain restarted with no
  // leftover actor* state. Use kBackSdk because sdkNonAdmin's original token was invalidated
  // by the K1 switch and we haven't re-authed it yet.
  await async_test(
    'K7. Clean nonAdmin session can mint a fresh switch into admin (chain restarted)',
    () => kBackSdk.api.users.switch_account({ targetUserId: adminId }),
    { shouldError: false, onResult: (r: any) => typeof r.authToken === 'string' && r.authToken.length > 0 }
  )
  // Re-auth nonAdmin: its original token died in K1, and kBackSdk's token died in K7.
  await sdkNonAdmin.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)

  // ============================================================
  // K8. Chained switch A→B→C preserves the original actor (not the proxy)
  // ============================================================
  // Spec: from a switched A-as-B session, switching to C must mint a JWT with
  // actorUserId=A — never actorUserId=B. The B hop is a UI affordance and must not become
  // the new "actor" on subsequent switches. Requires a third user C with a direct grant
  // from C to A; admin creates C and uses generate_auth_token to bootstrap a C-session
  // for accepting the grant.
  log_header("K8. Chained switching preserves original actor")

  // Create user C in admin's org (org already has accountSwitchingEnabled: true from setup).
  const userCEmail = `switch-c-${RAND()}@tellescope.example`
  const userCRecord: any = await sdk.api.users.createOne({
    email: userCEmail,
    fname: 'Chained',
    lname: 'Target',
    notificationEmailsDisabled: true,
    verifiedEmail: true,
  } as any)
  const userCId = userCRecord.id

  // Mint a session token for C via admin's generate_auth_token — no need to set a password.
  const { authToken: userCToken } = await sdk.api.users.generate_auth_token({ id: userCId })
  const sdkC = new Session({ host })
  sdkC.setAuthToken(userCToken)

  // A (nonAdmin) requests access to C; C accepts (validator requires session.id === ownerId).
  await sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: userCEmail })
  await wait(undefined, 250)
  const userCState = await get_user(sdkC, userCId)
  const pendingForC = (userCState.linkedAccountAccess ?? []).find((e: any) => e.userId === nonAdminId)
  assert(!!pendingForC, 'K8 setup: pending entry should exist on C from nonAdmin', 'K8 setup: pending on C')
  await set_linkedAccountAccess(sdkC, userCId, [{ ...pendingForC, status: 'accepted' }])
  await wait(undefined, 250)

  // Establish the A-as-B switched session. The admin→nonAdmin accepted grant from K1 is
  // still in place (K7's switch consumed a slot but didn't remove the grant).
  const aAsBResp: any = await sdkNonAdmin.api.users.switch_account({ targetUserId: adminId })
  const aAsBSdk = new Session({ host })
  aAsBSdk.setAuthToken(aAsBResp.authToken)
  aAsBSdk.setUserInfo(aAsBResp.user)
  const aAsBDecoded = decode_jwt(aAsBResp.authToken)
  assert(
    aAsBDecoded?.id === adminId && aAsBDecoded?.actorUserId === nonAdminId,
    `K8 setup: A-as-B token should carry id=admin, actorUserId=nonAdmin (got id=${aAsBDecoded?.id}, actorUserId=${aAsBDecoded?.actorUserId})`,
    'K8 setup: A-as-B JWT confirmed',
  )

  // Chained switch: from the A-as-B session, switch to C. realActor=nonAdmin (the original
  // actor) so the grant check looks up C.linkedAccountAccess for nonAdmin — finds the
  // accepted entry — and the new JWT must carry actorUserId=nonAdmin, NOT admin.
  let chainedToken = ''
  await async_test(
    'K8. Chained switch A→B→C succeeds when C granted access to the actor',
    () => aAsBSdk.api.users.switch_account({ targetUserId: userCId }),
    { shouldError: false, onResult: (r: any) => {
      chainedToken = r.authToken
      return typeof r.authToken === 'string' && r.authToken.length > 0 && r.user?.id === userCId
    }}
  )
  const chainedDecoded = decode_jwt(chainedToken)
  assert(chainedDecoded?.id === userCId, `chained JWT.id ${chainedDecoded?.id} != ${userCId}`, 'K8. chained JWT.id == C')
  assert(
    chainedDecoded?.actorUserId === nonAdminId,
    `chained JWT.actorUserId is ${chainedDecoded?.actorUserId} — must remain nonAdmin (the original actor), NOT admin (the proxy hop)`,
    'K8. chained JWT.actorUserId == A (original actor preserved, NOT B)',
  )
  assert(chainedDecoded?.actorEmail === nonAdminEmail, `chained JWT.actorEmail ${chainedDecoded?.actorEmail} != ${nonAdminEmail}`, 'K8. chained JWT.actorEmail preserved')
  assert(chainedDecoded?.actorBusinessId === nonAdminBusinessId, `chained JWT.actorBusinessId mismatch`, 'K8. chained JWT.actorBusinessId preserved')

  // Audit log: the chained switch's user_log must attribute to the original actor (nonAdmin),
  // and record proxySessionId=adminId so the B-hop is reconstructable.
  await wait(undefined, 500)
  await async_test(
    'K8. Chained switch audit log attributes to actor with proxySessionId=B',
    () => sdk.api.user_logs.getSome({ filter: { resourceId: userCId, resource: 'users', action: 'update' } } as any),
    { shouldError: false, onResult: (logs: any[]) => (logs ?? []).some((l: any) => {
      const info = l?.info ?? {}
      return l?.userId === nonAdminId
        && info.event === 'account_switch'
        && info.sourceUserId === nonAdminId
        && info.proxySessionId === adminId
        && info.targetUserId === userCId
    })}
  )

  // K8b. From the chained C-session, get_linked_accounts must reflect the ACTOR's
  // perspective: actor's own account first (switch-back), plus all accounts that have
  // granted access to the actor (B/admin). The current proxy identity (C) must NOT appear
  // — caller is already in that session.
  const chainedSdk = new Session({ host })
  chainedSdk.setAuthToken(chainedToken)
  await async_test(
    'K8b. get_linked_accounts from chained C-session reflects actor + actor-grants, excludes current proxy',
    () => chainedSdk.api.users.get_linked_accounts(),
    { shouldError: false, onResult: (r: any) => {
      const accounts = (r?.linkedAccounts ?? []) as any[]
      if (accounts.length === 0) return false
      // Switch-back entry (actor's own account) is first.
      if (accounts[0].id !== nonAdminId) return false
      // Admin appears because admin has nonAdmin: accepted in linkedAccountAccess.
      const hasAdmin = accounts.some((a: any) => a.id === adminId)
      // The current proxy identity (userC) must NOT appear — it's not switchable from itself.
      const hasSelfProxy = accounts.some((a: any) => a.id === userCId)
      return hasAdmin && !hasSelfProxy
    }}
  )

  // Cleanup K8: delete C (also clears the linkedAccountAccess that the chained switch
  // consumed), and re-auth nonAdmin since the K8 setup switch invalidated its token.
  try { await sdk.api.users.deleteOne(userCId) } catch { /* ignore */ }
  await sdkNonAdmin.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)

  // ============================================================
  // L. linkedAccountAccess read-side redaction (owner-only metadata)
  // ============================================================
  // The grant list reveals who's been requesting access to whom. Only the owner needs to
  // see it (to act on pending requests / inspect accepted grants). Cross-user reads,
  // switched-session reads, and the switch_account response.user must all redact the field.
  log_header("L. linkedAccountAccess read-side redaction")

  // Seed an accepted grant so admin's record has a non-empty linkedAccountAccess for the
  // redaction assertions to be meaningful (a missing field is indistinguishable from a
  // redacted-empty field otherwise).
  await clear_linkedAccountAccess(sdk, adminId)
  await wait(undefined, 1500)
  await sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })
  await wait(undefined, 250)
  const lSeedState = await get_user(sdk, adminId)
  const lPending = (lSeedState.linkedAccountAccess ?? []).find((e: any) => e.userId === nonAdminId)
  await set_linkedAccountAccess(sdk, adminId, [{ ...lPending, status: 'accepted' }])
  await wait(undefined, 250)

  // L1. Owner reading own record from a non-switched session: field IS visible.
  await async_test(
    'L1. Owner reading own record sees linkedAccountAccess',
    () => get_user(sdk, adminId),
    { shouldError: false, onResult: (u: any) => Array.isArray(u?.linkedAccountAccess) && u.linkedAccountAccess.length > 0 }
  )

  // L2. Cross-user read (non-admin reads admin): field is redacted.
  await async_test(
    'L2. Cross-user read (nonAdmin reads admin) redacts linkedAccountAccess',
    () => get_user(sdkNonAdmin, adminId),
    { shouldError: false, onResult: (u: any) => u?.linkedAccountAccess === undefined }
  )

  // L3. Switched session reading the proxy's own record: still redacted (session.actorUserId
  // is set, so callerIsRealOwner is false even though value.id === session.id).
  const lSwitchResp: any = await sdkNonAdmin.api.users.switch_account({ targetUserId: adminId })
  const lSwitchedSdk = new Session({ host })
  lSwitchedSdk.setAuthToken(lSwitchResp.authToken)
  await async_test(
    'L3. Switched session reading proxy record (admin) redacts linkedAccountAccess',
    () => get_user(lSwitchedSdk, adminId),
    { shouldError: false, onResult: (u: any) => u?.linkedAccountAccess === undefined }
  )

  // L4. switch_account response.user does NOT include linkedAccountAccess (the response
  // bypasses applyRedactions, so the handler strips the field explicitly).
  assert(
    lSwitchResp?.user && lSwitchResp.user.id === adminId && lSwitchResp.user.linkedAccountAccess === undefined,
    `switch_account response.user.linkedAccountAccess should be undefined; got ${JSON.stringify(lSwitchResp?.user?.linkedAccountAccess)}`,
    'L4. switch_account response.user has linkedAccountAccess redacted',
  )

  // L5. After switching back to actor's own (non-switched) session, the owner CAN see their
  // own linkedAccountAccess again — the redaction only fires for cross-user / switched reads.
  // nonAdmin has no linkedAccountAccess in this fixture; verify the field is present and an
  // array (even if empty) rather than redacted-to-undefined.
  const lBackResp: any = await lSwitchedSdk.api.users.switch_account({ targetUserId: nonAdminId })
  const lBackSdk = new Session({ host })
  lBackSdk.setAuthToken(lBackResp.authToken)
  await async_test(
    'L5. Owner-in-real-session can read their own linkedAccountAccess after switch-back',
    () => get_user(lBackSdk, nonAdminId),
    { shouldError: false, onResult: (u: any) => Array.isArray(u?.linkedAccountAccess) }
  )

  // L cleanup: re-auth nonAdmin (lBackSdk's token wasn't invalidated, but we want a clean
  // sdkNonAdmin for the remaining sections).
  await sdkNonAdmin.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)

  // ============================================================
  // M. Enduser sessions are rejected on user-only endpoints
  // ============================================================
  // The three new endpoints are registered as customActions on the `users` model with no
  // `allowEnduser` and no `enduserAction` declared. With only the user-type auth path active,
  // is_logged_in's type check (authentication.ts:587 — `if (userInfo.type !== type) return false`)
  // rejects the enduser JWT and checkAccess returns 401 "Unauthenticated" before businessOnly
  // even runs. Tests here are negative assertions guarding against future drift — e.g. if
  // someone adds `allowEnduser` to a custom action by accident.
  log_header("M. Enduser sessions rejected on user endpoints")

  // Create an enduser inline and authenticate it via admin's generate_auth_token bypass.
  const enduserEmail = `switch-enduser-${RAND()}@tellescope.example`
  const enduserRec: any = await sdk.api.endusers.createOne({
    email: enduserEmail,
    fname: 'Switch',
    lname: 'Enduser',
  } as any)
  const { authToken: enduserAuthToken } = await sdk.api.endusers.generate_auth_token({ id: enduserRec.id })

  // Use a plain Session with the enduser token so we can hit the user-only routes. The
  // EnduserSession's .api shape doesn't include these methods, but the underlying HTTP
  // routes do exist server-side — we want to confirm the server-side rejection fires
  // regardless of what client SDK is used.
  const sdkAsEnduser = new Session({ host })
  sdkAsEnduser.setAuthToken(enduserAuthToken)

  // Reuse the 401 "Unauthenticated" matcher from C1 — that's what checkAccess actually
  // returns for an enduser JWT on a user-only endpoint. If a future change starts admitting
  // the enduser past checkAccess (e.g. adds allowEnduser) and the rejection moves to
  // businessOnly's 400, these assertions will fail loudly.
  const isEnduserRejection = is401Rejection

  await async_test(
    'M1. Enduser session is rejected on get_linked_accounts',
    () => sdkAsEnduser.api.users.get_linked_accounts(),
    { shouldError: true, onError: isEnduserRejection }
  )
  await async_test(
    'M2. Enduser session is rejected on switch_account',
    () => sdkAsEnduser.api.users.switch_account({ targetUserId: adminId }),
    { shouldError: true, onError: isEnduserRejection }
  )
  await async_test(
    'M3. Enduser session is rejected on request_linked_account_access',
    () => sdkAsEnduser.api.users.request_linked_account_access({ targetEmail: adminEmail }),
    { shouldError: true, onError: isEnduserRejection }
  )

  // Cleanup the inline enduser.
  try { await sdk.api.endusers.deleteOne(enduserRec.id) } catch { /* ignore */ }

  // ============================================================
  // C10. request_linked_account_access rate limit (placed last — exhausts admin's quota for 60s)
  // ============================================================
  log_header("C10. request_linked_account_access rate limit (placed last)")
  for (let i = 0; i < 30; i++) {
    try { await sdk.api.users.request_linked_account_access({ targetEmail: `rl-${RAND()}@tellescope.example` }) } catch {}
  }
  await async_test(
    'C10. 31st request inside one minute is rate-limited (429)',
    () => sdk.api.users.request_linked_account_access({ targetEmail: `rl-${RAND()}@tellescope.example` }),
    { shouldError: true, onError: (e: any) => e.statusCode === 429 || (e.message || '').toLowerCase().includes('rate') }
  )

  // ============================================================
  // J. Cleanup
  // ============================================================
  log_header("J. Cleanup")
  await clear_linkedAccountAccess(sdk, adminId)
  await clear_linkedAccountAccess(sdkNonAdmin, nonAdminId)
  await cleanup_marker_tags(sdk, adminId)
  await cleanup_marker_tags(sdkNonAdmin, nonAdminId)
  // Restore admin's fname (G5 mutated it server-side; downstream tests compare userInfo.fname to the server value).
  if (originalAdminFname) {
    try { await sdk.api.users.updateOne(adminId, { fname: originalAdminFname } as any) } catch {}
  }
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await account_switcher_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("Account switcher test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Account switcher test suite failed:", error)
      process.exit(1)
    })
}
