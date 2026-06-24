require('source-map-support').install();

import { Session, EnduserSession } from "../../../sdk"
import {
  async_test,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const
const businessId = '60398b1131a295e64f084ff6'

const ENDUSER_PASSWORD = 'F0116TestPassword!123'

const CROSS_ENDUSER_MESSAGE = "enduserId does not match creator id for enduser session"

/**
 * Regression test for the enduser cross-enduser CREATE gating gaps:
 *   F-0116 enduser_observations  (security-audit/findings/F-0116-*.md)
 *   F-0117 enduser_orders        (security-audit/findings/F-0117-*.md)
 *   F-0119 managed_content_records (security-audit/findings/F-0119-*.md)
 *   F-0118 chat_rooms (enduserIds-only gate; staff userIds targeting is by-design)
 *
 * Each model exposed enduserActions.create with an `enduserId`/`enduserIds` field that
 * lacked a write-side gate, letting an authenticated enduser create records bound to a
 * DIFFERENT enduser in the same tenant. The fix adds a `constraints.relationship`
 * evaluator mirroring the canonical `tickets` pattern (schema.ts).
 *
 * Methodology: each section asserts BOTH the exploit-is-blocked case AND that the
 * legitimate path (self-create + staff-create) still works.
 */
export const enduser_cross_create_tests = async ({ sdk } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("F-0116/F-0117/F-0118/F-0119: enduser cross-enduser create gates")

  let attackerId: string | undefined
  let victimId: string | undefined
  const createdObservationIds: string[] = []
  const createdOrderIds: string[] = []
  const createdContentIds: string[] = []
  const createdRoomIds: string[] = []

  try {
    // ---- Setup: attacker enduser (with portal session) + victim enduser ----
    const attackerEmail = `f0116-attacker-${Date.now()}@example.com`
    const victimEmail = `f0116-victim-${Date.now()}@example.com`
    const attacker = await sdk.api.endusers.createOne({ email: attackerEmail, fname: 'F0116', lname: 'Attacker' })
    attackerId = attacker.id
    const victim = await sdk.api.endusers.createOne({ email: victimEmail, fname: 'F0116', lname: 'Victim' })
    victimId = victim.id
    await sdk.api.endusers.set_password({ id: attacker.id, password: ENDUSER_PASSWORD })

    const attackerSDK = new EnduserSession({ host, businessId })
    await attackerSDK.authenticate(attackerEmail, ENDUSER_PASSWORD)

    // ============================================================
    // F-0116 — enduser_observations
    // ============================================================
    await async_test(
      `F-0116: enduser cannot create observation on another enduser (createOne)`,
      () => attackerSDK.api.enduser_observations.createOne({
        enduserId: victimId!, category: 'vital-signs', status: 'final',
        measurement: { unit: 'mmHg', value: 220 },
      } as any),
      { shouldError: true, onError: e => e.message === CROSS_ENDUSER_MESSAGE },
    )
    await async_test(
      `F-0116: enduser cannot create observation on another enduser (createMany)`,
      () => attackerSDK.api.enduser_observations.createSome([{
        enduserId: victimId!, category: 'vital-signs', status: 'final',
        measurement: { unit: 'mmHg', value: 220 },
      }] as any),
      { shouldError: true, onError: e => e.message === CROSS_ENDUSER_MESSAGE },
    )

    // Positive control: enduser CAN create an observation on their OWN record
    await async_test(
      `F-0116: enduser can still create observation on own record`,
      () => attackerSDK.api.enduser_observations.createOne({
        enduserId: attackerId!, category: 'vital-signs', status: 'final',
        measurement: { unit: 'mmHg', value: 120 },
      } as any),
      { onResult: (o: any) => { if (o?.id) createdObservationIds.push(o.id); return o?.enduserId === attackerId } },
    )
    // Positive control: staff CAN create an observation on any tenant enduser
    await async_test(
      `F-0116: staff can still create observation on any enduser`,
      () => sdk.api.enduser_observations.createOne({
        enduserId: victimId!, category: 'vital-signs', status: 'final',
        measurement: { unit: 'mmHg', value: 118 },
      } as any),
      { onResult: (o: any) => { if (o?.id) createdObservationIds.push(o.id); return o?.enduserId === victimId } },
    )

    // ============================================================
    // F-0117 — enduser_orders
    // ============================================================
    const orderPayload = (enduserId: string) => ({
      enduserId, externalId: `f0117-${Date.now()}`, source: 'f0117-source',
      title: 'f0117 order', status: 'pending',
    })
    await async_test(
      `F-0117: enduser cannot create order on another enduser`,
      () => attackerSDK.api.enduser_orders.createOne(orderPayload(victimId!) as any),
      { shouldError: true, onError: e => e.message === CROSS_ENDUSER_MESSAGE },
    )
    await async_test(
      `F-0117: enduser can still create order on own record`,
      () => attackerSDK.api.enduser_orders.createOne(orderPayload(attackerId!) as any),
      { onResult: (o: any) => { if (o?.id) createdOrderIds.push(o.id); return o?.enduserId === attackerId } },
    )
    await async_test(
      `F-0117: staff can still create order on any enduser`,
      () => sdk.api.enduser_orders.createOne(orderPayload(victimId!) as any),
      { onResult: (o: any) => { if (o?.id) createdOrderIds.push(o.id); return o?.enduserId === victimId } },
    )

    // ============================================================
    // F-0119 — managed_content_records
    // ============================================================
    await async_test(
      `F-0119: enduser cannot create content with allowUnauthenticatedAccess`,
      () => attackerSDK.api.managed_content_records.createOne({
        title: 'f0119 phishing', textContent: 'x', allowUnauthenticatedAccess: true,
      } as any),
      { shouldError: true, onError: e => e.message === "allowUnauthenticatedAccess cannot be set by endusers" },
    )
    await async_test(
      `F-0119: enduser cannot create content with publicRead`,
      () => attackerSDK.api.managed_content_records.createOne({
        title: 'f0119 broadcast', textContent: 'x', publicRead: true,
      } as any),
      { shouldError: true, onError: e => e.message === "publicRead cannot be set by endusers" },
    )
    await async_test(
      `F-0119: enduser cannot create content bound to another enduser`,
      () => attackerSDK.api.managed_content_records.createOne({
        title: 'f0119 cross', textContent: 'x', enduserId: victimId!,
      } as any),
      { shouldError: true, onError: e => e.message === CROSS_ENDUSER_MESSAGE },
    )
    await async_test(
      `F-0119: enduser can still create ordinary content`,
      () => attackerSDK.api.managed_content_records.createOne({
        title: 'f0119 ok', textContent: 'hello',
      } as any),
      { onResult: (o: any) => { if (o?.id) createdContentIds.push(o.id); return !o?.publicRead && !o?.allowUnauthenticatedAccess } },
    )
    await async_test(
      `F-0119: staff can still create public content`,
      () => sdk.api.managed_content_records.createOne({
        title: 'f0119 staff public', textContent: 'x', publicRead: true,
      } as any),
      { onResult: (o: any) => { if (o?.id) createdContentIds.push(o.id); return o?.publicRead === true } },
    )

    // ============================================================
    // F-0118 — chat_rooms (enduserIds-only gate; staff userIds targeting is by-design)
    // ============================================================
    const staffId = sdk.userInfo.id
    await async_test(
      `F-0118: enduser cannot add another patient to a chat room (enduserIds)`,
      () => attackerSDK.api.chat_rooms.createOne({
        type: 'internal', enduserIds: [attackerId!, victimId!], userIds: [staffId],
      } as any),
      { shouldError: true, onError: e => e.message === "enduserIds may only contain your own id for enduser session" },
    )
    // Positive control: patient CAN create a room with care-team staff + self (intended feature)
    await async_test(
      `F-0118: enduser can still create a room with staff + self`,
      () => attackerSDK.api.chat_rooms.createOne({
        type: 'internal', enduserIds: [attackerId!], userIds: [staffId],
      } as any),
      { onResult: (o: any) => { if (o?.id) createdRoomIds.push(o.id); return o?.enduserIds?.length === 1 && o?.userIds?.includes(staffId) } },
    )
    // Positive control: staff can still create multi-patient rooms
    await async_test(
      `F-0118: staff can still create a room with multiple endusers`,
      () => sdk.api.chat_rooms.createOne({
        type: 'internal', enduserIds: [attackerId!, victimId!], userIds: [staffId],
      } as any),
      { onResult: (o: any) => { if (o?.id) createdRoomIds.push(o.id); return o?.enduserIds?.length === 2 } },
    )
  } finally {
    for (const id of createdRoomIds) {
      try { await sdk.api.chat_rooms.deleteOne(id) } catch {}
    }
    for (const id of createdContentIds) {
      try { await sdk.api.managed_content_records.deleteOne(id) } catch {}
    }
    for (const id of createdObservationIds) {
      try { await sdk.api.enduser_observations.deleteOne(id) } catch {}
    }
    for (const id of createdOrderIds) {
      try { await sdk.api.enduser_orders.deleteOne(id) } catch {}
    }
    if (attackerId) { try { await sdk.api.endusers.deleteOne(attackerId) } catch {} }
    if (victimId) { try { await sdk.api.endusers.deleteOne(victimId) } catch {} }
  }
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await enduser_cross_create_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ F-0116/F-0117/F-0118/F-0119 enduser cross-create test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ enduser cross-create test suite failed:", error)
      process.exit(1)
    })
}
