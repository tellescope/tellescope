require('source-map-support').install();

import { Session, EnduserSession } from "../../sdk"
import {
  log_header,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

/**
 * Tests for the "Outbound Chat Sent" automation trigger event.
 *
 * Covered cases (one shared trigger, one shared TAG):
 *  1. Single-enduser room, inbound (enduser session)        → no trigger, no recentOutboundChatAt
 *  2. Single-enduser room, outbound (user session)          → trigger fires, recentOutboundChatAt set + recent
 *  3. Multi-enduser room,  inbound (one enduser's session)  → neither enduser tagged or stamped
 *  4. Multi-enduser room,  outbound (user session)          → BOTH endusers tagged + stamped
 *  5. User session, senderId = enduser.id (backfill case)   → treated as inbound: no trigger, no stamp
 *
 * Chats are NOT explicitly deleted — they cascade-delete from chat_rooms.
 */

const isRecent = (value: Date | string | undefined, sinceMs: number): boolean => {
  if (!value) return false
  const t = new Date(value).valueOf()
  return t >= sinceMs - 1000 && t <= Date.now() + 1000
}

export const outbound_chat_sent_trigger_tests = async ({ sdk }: { sdk: Session }) => {
  log_header("Outbound Chat Sent Trigger Tests")

  const host = process.env.API_URL || 'http://localhost:8080'
  const TAG = `outbound-chat-sent-${Date.now()}`

  let endSolo: { id: string } | undefined
  let endA: { id: string } | undefined
  let endB: { id: string } | undefined
  let endBackfill: { id: string } | undefined
  let endAutoreply: { id: string } | undefined

  let trigger: { id: string } | undefined
  let roomSolo: { id: string } | undefined
  let roomGroup: { id: string } | undefined
  let roomBackfill: { id: string } | undefined
  let roomAutoreply: { id: string } | undefined

  let settingsModified = false
  let originalOutOfOfficeHours: any[] = []
  let originalAutoReplyEnabled = false

  try {
    // ── Endusers ──────────────────────────────────────────────────────
    endSolo = await sdk.api.endusers.createOne({ fname: 'Solo', lname: 'Patient' })
    endA = await sdk.api.endusers.createOne({ fname: 'GroupA', lname: 'Patient' })
    endB = await sdk.api.endusers.createOne({ fname: 'GroupB', lname: 'Patient' })
    endBackfill = await sdk.api.endusers.createOne({ fname: 'Backfill', lname: 'Patient' })
    console.log(`Created endusers: solo=${endSolo.id}, A=${endA.id}, B=${endB.id}, backfill=${endBackfill.id}`)

    // ── Enduser sessions for inbound sends ────────────────────────────
    const { authToken: tokenSolo } = await sdk.api.endusers.generate_auth_token({ id: endSolo.id })
    const endSoloSDK = new EnduserSession({ host, authToken: tokenSolo, businessId: sdk.userInfo.businessId })

    const { authToken: tokenA } = await sdk.api.endusers.generate_auth_token({ id: endA.id })
    const endASDK = new EnduserSession({ host, authToken: tokenA, businessId: sdk.userInfo.businessId })

    // ── Trigger ───────────────────────────────────────────────────────
    trigger = await sdk.api.automation_triggers.createOne({
      title: `Outbound Chat Sent Test ${Date.now()}`,
      status: 'Active',
      event: { type: 'Outbound Chat Sent', info: {} },
      action: { type: 'Add Tags', info: { tags: [TAG] } },
    })
    console.log(`Created trigger: ${trigger.id}`)

    // ── Rooms ─────────────────────────────────────────────────────────
    roomSolo = await sdk.api.chat_rooms.createOne({
      userIds: [sdk.userInfo.id],
      enduserIds: [endSolo.id],
    })
    roomGroup = await sdk.api.chat_rooms.createOne({
      userIds: [sdk.userInfo.id],
      enduserIds: [endA.id, endB.id],
    })
    roomBackfill = await sdk.api.chat_rooms.createOne({
      userIds: [sdk.userInfo.id],
      enduserIds: [endBackfill.id],
    })
    console.log(`Created rooms: solo=${roomSolo.id}, group=${roomGroup.id}, backfill=${roomBackfill.id}`)

    // ═════════════════════════════════════════════════════════════════
    // Case 1: Single-enduser inbound (enduser session)
    // ═════════════════════════════════════════════════════════════════
    await endSoloSDK.api.chats.createOne({
      roomId: roomSolo.id,
      message: 'solo inbound from enduser',
    })
    await wait(undefined, 2000)

    const soloAfterInbound = await sdk.api.endusers.getOne(endSolo.id)
    const c1_notTagged = !soloAfterInbound.tags?.includes(TAG)
    const c1_noStamp = !soloAfterInbound.recentOutboundChatAt
    console.log(c1_notTagged
      ? `✅ [1] Solo inbound did NOT fire trigger`
      : `❌ [1] Solo inbound fired trigger. tags=${JSON.stringify(soloAfterInbound.tags)}`)
    console.log(c1_noStamp
      ? `✅ [1] Solo inbound did NOT set recentOutboundChatAt`
      : `❌ [1] Solo inbound set recentOutboundChatAt=${soloAfterInbound.recentOutboundChatAt}`)

    // ═════════════════════════════════════════════════════════════════
    // Case 2: Single-enduser outbound (user session)
    // ═════════════════════════════════════════════════════════════════
    const c2_sendStart = Date.now()
    await sdk.api.chats.createOne({
      roomId: roomSolo.id,
      message: 'solo outbound from user',
      senderId: sdk.userInfo.id,
    })
    await wait(undefined, 2000)

    const soloAfterOutbound = await sdk.api.endusers.getOne(endSolo.id)
    const c2_tagged = !!soloAfterOutbound.tags?.includes(TAG)
    const c2_stamped = isRecent(soloAfterOutbound.recentOutboundChatAt, c2_sendStart)
    console.log(c2_tagged
      ? `✅ [2] Solo outbound fired trigger`
      : `❌ [2] Solo outbound did NOT fire trigger. tags=${JSON.stringify(soloAfterOutbound.tags)}`)
    console.log(c2_stamped
      ? `✅ [2] Solo outbound set recentOutboundChatAt=${soloAfterOutbound.recentOutboundChatAt}`
      : `❌ [2] Solo outbound did not set a recent recentOutboundChatAt. got=${soloAfterOutbound.recentOutboundChatAt}`)

    // ═════════════════════════════════════════════════════════════════
    // Case 3: Multi-enduser inbound (endA sends in [A, B] room)
    // ═════════════════════════════════════════════════════════════════
    await endASDK.api.chats.createOne({
      roomId: roomGroup.id,
      message: 'group inbound from endA',
    })
    await wait(undefined, 2000)

    const aAfterInbound = await sdk.api.endusers.getOne(endA.id)
    const bAfterInbound = await sdk.api.endusers.getOne(endB.id)
    const c3_aNotTagged = !aAfterInbound.tags?.includes(TAG)
    const c3_bNotTagged = !bAfterInbound.tags?.includes(TAG)
    const c3_neitherTagged = c3_aNotTagged && c3_bNotTagged
    const c3_neitherStamped = !aAfterInbound.recentOutboundChatAt && !bAfterInbound.recentOutboundChatAt
    console.log(c3_neitherTagged
      ? `✅ [3] Group inbound did NOT fire trigger on either enduser`
      : `❌ [3] Group inbound fired trigger. A tags=${JSON.stringify(aAfterInbound.tags)} B tags=${JSON.stringify(bAfterInbound.tags)}`)
    console.log(c3_neitherStamped
      ? `✅ [3] Group inbound did NOT set recentOutboundChatAt on either enduser`
      : `❌ [3] Group inbound stamped recentOutboundChatAt. A=${aAfterInbound.recentOutboundChatAt} B=${bAfterInbound.recentOutboundChatAt}`)

    // ═════════════════════════════════════════════════════════════════
    // Case 4: Multi-enduser outbound (user sends in [A, B] room)
    // ═════════════════════════════════════════════════════════════════
    const c4_sendStart = Date.now()
    await sdk.api.chats.createOne({
      roomId: roomGroup.id,
      message: 'group outbound from user',
      senderId: sdk.userInfo.id,
    })
    await wait(undefined, 2000)

    const aAfterOutbound = await sdk.api.endusers.getOne(endA.id)
    const bAfterOutbound = await sdk.api.endusers.getOne(endB.id)
    const c4_bothTagged = !!aAfterOutbound.tags?.includes(TAG) && !!bAfterOutbound.tags?.includes(TAG)
    const c4_bothStamped = isRecent(aAfterOutbound.recentOutboundChatAt, c4_sendStart)
      && isRecent(bAfterOutbound.recentOutboundChatAt, c4_sendStart)
    console.log(c4_bothTagged
      ? `✅ [4] Group outbound fired trigger on BOTH endusers`
      : `❌ [4] Group outbound did not tag both. A tags=${JSON.stringify(aAfterOutbound.tags)} B tags=${JSON.stringify(bAfterOutbound.tags)}`)
    console.log(c4_bothStamped
      ? `✅ [4] Group outbound set recentOutboundChatAt on BOTH endusers`
      : `❌ [4] Group outbound did not stamp both. A=${aAfterOutbound.recentOutboundChatAt} B=${bAfterOutbound.recentOutboundChatAt}`)

    // ═════════════════════════════════════════════════════════════════
    // Case 5: User session, senderId = enduser.id (backfill)
    // ═════════════════════════════════════════════════════════════════
    await sdk.api.chats.createOne({
      roomId: roomBackfill.id,
      message: 'backfilled inbound (user session, enduser senderId)',
      senderId: endBackfill.id,
    })
    await wait(undefined, 2000)

    const backfillAfter = await sdk.api.endusers.getOne(endBackfill.id)
    const c5_notTagged = !backfillAfter.tags?.includes(TAG)
    const c5_noStamp = !backfillAfter.recentOutboundChatAt
    console.log(c5_notTagged
      ? `✅ [5] Backfill (user-session + enduser senderId) did NOT fire trigger`
      : `❌ [5] Backfill fired trigger. tags=${JSON.stringify(backfillAfter.tags)}`)
    console.log(c5_noStamp
      ? `✅ [5] Backfill did NOT set recentOutboundChatAt`
      : `❌ [5] Backfill set recentOutboundChatAt=${backfillAfter.recentOutboundChatAt}`)

    // ═════════════════════════════════════════════════════════════════
    // Case 6: Autoreply — enduser inbound triggers an org autoreply.
    //   The autoreply chat (isAutoreply: true) MUST NOT fire the trigger
    //   or stamp recentOutboundChatAt.
    //
    // Setup requires enabling org autoreply with an OOO window covering
    // "now" (is_out_of_office returns false on empty config).
    // ═════════════════════════════════════════════════════════════════
    const originalOrg = await sdk.api.organizations.getOne(sdk.userInfo.businessId)
    originalOutOfOfficeHours = originalOrg.outOfOfficeHours ?? []
    originalAutoReplyEnabled = !!originalOrg.settings?.endusers?.autoReplyEnabled

    settingsModified = true
    await sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
      outOfOfficeHours: [{
        from: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        to:   new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        autoreplyText: 'OOO autoreply (test)',
      }] as any,
      settings: { endusers: { autoReplyEnabled: true } } as any,
    }, { replaceObjectFields: true })

    endAutoreply = await sdk.api.endusers.createOne({ fname: 'Autoreply', lname: 'Patient' })
    const { authToken: tokenAR } = await sdk.api.endusers.generate_auth_token({ id: endAutoreply.id })
    const endAutoreplySDK = new EnduserSession({ host, authToken: tokenAR, businessId: sdk.userInfo.businessId })

    roomAutoreply = await sdk.api.chat_rooms.createOne({
      userIds: [sdk.userInfo.id],
      enduserIds: [endAutoreply.id],
    })

    await endAutoreplySDK.api.chats.createOne({
      roomId: roomAutoreply.id,
      message: 'trigger an autoreply',
    })

    // Autoreply path involves an extra org/user lookup + insert before
    // handle_chat_create re-runs against the autoreply chat.
    await wait(undefined, 4000)

    const arAfter = await sdk.api.endusers.getOne(endAutoreply.id)
    const roomChats = await sdk.api.chats.getSome({ filter: { roomId: roomAutoreply.id } })
    const sanity_autoreplySent = roomChats.some(c => (c as any).isAutoreply === true)

    const c6_notTagged = !arAfter.tags?.includes(TAG)
    const c6_noStamp = !arAfter.recentOutboundChatAt

    console.log(sanity_autoreplySent
      ? `✅ [6] Autoreply chat was sent (sanity check)`
      : `❌ [6] No autoreply chat found in room — test setup invalid. Cannot validate trigger skip.`)
    console.log(c6_notTagged
      ? `✅ [6] Autoreply did NOT fire trigger`
      : `❌ [6] Autoreply fired trigger. tags=${JSON.stringify(arAfter.tags)}`)
    console.log(c6_noStamp
      ? `✅ [6] Autoreply did NOT set recentOutboundChatAt`
      : `❌ [6] Autoreply set recentOutboundChatAt=${arAfter.recentOutboundChatAt}`)

    // ── Summary ───────────────────────────────────────────────────────
    console.log(`\n=== Outbound Chat Sent Trigger Test Results ===`)
    console.log(`[1] Solo  inbound  — no trigger:        ${c1_notTagged ? '✅' : '❌'}`)
    console.log(`[1] Solo  inbound  — no stamp:          ${c1_noStamp ? '✅' : '❌'}`)
    console.log(`[2] Solo  outbound — trigger:           ${c2_tagged ? '✅' : '❌'}`)
    console.log(`[2] Solo  outbound — stamp:             ${c2_stamped ? '✅' : '❌'}`)
    console.log(`[3] Group inbound  — no trigger (both): ${c3_neitherTagged ? '✅' : '❌'}`)
    console.log(`[3] Group inbound  — no stamp (both):   ${c3_neitherStamped ? '✅' : '❌'}`)
    console.log(`[4] Group outbound — trigger (both):    ${c4_bothTagged ? '✅' : '❌'}`)
    console.log(`[4] Group outbound — stamp (both):      ${c4_bothStamped ? '✅' : '❌'}`)
    console.log(`[5] Backfill       — no trigger:        ${c5_notTagged ? '✅' : '❌'}`)
    console.log(`[5] Backfill       — no stamp:          ${c5_noStamp ? '✅' : '❌'}`)
    console.log(`[6] Autoreply      — sanity sent:       ${sanity_autoreplySent ? '✅' : '❌'}`)
    console.log(`[6] Autoreply      — no trigger:        ${c6_notTagged ? '✅' : '❌'}`)
    console.log(`[6] Autoreply      — no stamp:          ${c6_noStamp ? '✅' : '❌'}`)

    const allPassed =
      c1_notTagged && c1_noStamp
      && c2_tagged && c2_stamped
      && c3_neitherTagged && c3_neitherStamped
      && c4_bothTagged && c4_bothStamped
      && c5_notTagged && c5_noStamp
      && sanity_autoreplySent && c6_notTagged && c6_noStamp

    if (!allPassed) {
      throw new Error('Outbound Chat Sent trigger tests failed')
    }

    return { success: true }
  } finally {
    try {
      // Restore org settings FIRST (sequentially, before deletes), so a
      // failure here doesn't leave autoReplyEnabled=true polluting other tests.
      if (settingsModified) {
        try {
          await sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
            outOfOfficeHours: originalOutOfOfficeHours as any,
            settings: { endusers: { autoReplyEnabled: originalAutoReplyEnabled } } as any,
          }, { replaceObjectFields: true })
          console.log(`Restored org settings (autoReplyEnabled=${originalAutoReplyEnabled}, outOfOfficeHours.length=${originalOutOfOfficeHours.length})`)
        } catch (err) {
          console.error(`❌ Failed to restore org settings — manual cleanup may be required: ${err}`)
        }
      }

      const cleanups: Promise<any>[] = []

      if (trigger?.id) cleanups.push(sdk.api.automation_triggers.deleteOne(trigger.id).catch(() => {}))
      if (roomSolo?.id) cleanups.push(sdk.api.chat_rooms.deleteOne(roomSolo.id).catch(() => {}))
      if (roomGroup?.id) cleanups.push(sdk.api.chat_rooms.deleteOne(roomGroup.id).catch(() => {}))
      if (roomBackfill?.id) cleanups.push(sdk.api.chat_rooms.deleteOne(roomBackfill.id).catch(() => {}))
      if (roomAutoreply?.id) cleanups.push(sdk.api.chat_rooms.deleteOne(roomAutoreply.id).catch(() => {}))
      if (endSolo?.id) cleanups.push(sdk.api.endusers.deleteOne(endSolo.id).catch(() => {}))
      if (endA?.id) cleanups.push(sdk.api.endusers.deleteOne(endA.id).catch(() => {}))
      if (endB?.id) cleanups.push(sdk.api.endusers.deleteOne(endB.id).catch(() => {}))
      if (endBackfill?.id) cleanups.push(sdk.api.endusers.deleteOne(endBackfill.id).catch(() => {}))
      if (endAutoreply?.id) cleanups.push(sdk.api.endusers.deleteOne(endAutoreply.id).catch(() => {}))

      await Promise.all(cleanups)
      console.log(`Outbound Chat Sent trigger test cleanup completed`)
    } catch (error) {
      console.error(`Cleanup error: ${error}`)
    }
  }
}

// Allow running this test file independently
if (require.main === module) {
  const host = process.env.API_URL || 'http://localhost:8080'
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await outbound_chat_sent_trigger_tests({ sdk })
  }

  runTests()
    .then(() => {
      console.log("✅ Outbound Chat Sent trigger tests completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Outbound Chat Sent trigger tests failed:", error)
      process.exit(1)
    })
}
