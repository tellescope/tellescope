require('source-map-support').install();

import { Session } from "../../sdk"
import {
  async_test,
  handleAnyError,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

const NONEXISTENT_MONGO_ID = '60398b1131a295e64f084fff'

// Validation-path tests for the cold transfer endpoint. All assertions below hit
// validations that run before any Twilio access, so no Twilio config is needed.
export const phone_calls_cold_transfer_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Phone Calls Cold Transfer Tests")

  const enduser = await sdk.api.endusers.createOne({ fname: 'Cold', lname: 'Transfer' })
  const targetUsers: { id: string }[] = []

  try {
    const inboundCall = await sdk.api.phone_calls.createOne({
      enduserId: enduser.id,
      inbound: true,
      externalId: 'CAcoldtransfertestinbound000000001',
      from: '+15550001111',
      to: '+15550002222',
      userId: sdk.userInfo.id,
    })
    const outboundCall = await sdk.api.phone_calls.createOne({
      enduserId: enduser.id,
      inbound: false,
      externalId: 'CAcoldtransfertestoutbound00000001',
      from: '+15550002222',
      to: '+15550001111',
      userId: sdk.userInfo.id,
    })

    // throwaway target users (never modify existing users' roles)
    const disabledTargetUser = await sdk.api.users.createOne({
      email: 'cold.transfer.disabled@tellescope.com',
      verifiedEmail: true,
      notificationEmailsDisabled: true,
      disableIncomingPhoneCalls: true,
    })
    targetUsers.push(disabledTargetUser)

    await async_test(
      "cold_transfer: cannot transfer to yourself",
      () => sdk.api.phone_calls.cold_transfer({ callSid: inboundCall.externalId, targetUserId: sdk.userInfo.id }),
      { shouldError: true, onError: (e: any) => e.message === "Cannot transfer a call to yourself" }
    )
    await async_test(
      "cold_transfer: bogus callSid rejected",
      () => sdk.api.phone_calls.cold_transfer({ callSid: 'CAdoesnotexist0000000000000000000', targetUserId: disabledTargetUser.id }),
      { shouldError: true, onError: (e: any) => e.message === "Call not found" }
    )
    await async_test(
      "cold_transfer: outbound calls rejected",
      () => sdk.api.phone_calls.cold_transfer({ callSid: outboundCall.externalId, targetUserId: disabledTargetUser.id }),
      { shouldError: true, onError: (e: any) => e.message === "Only inbound calls can be transferred" }
    )
    // conferenceId is not settable via the public API (only set internally by conference webhooks),
    // so the "Conference calls cannot be transferred" branch is covered by manual E2E testing only
    await async_test(
      "cold_transfer: nonexistent target user rejected",
      () => sdk.api.phone_calls.cold_transfer({ callSid: inboundCall.externalId, targetUserId: NONEXISTENT_MONGO_ID }),
      { shouldError: true, onError: (e: any) => e.message === "Target user not found" }
    )
    await async_test(
      "cold_transfer: target user with incoming calls disabled rejected",
      () => sdk.api.phone_calls.cold_transfer({ callSid: inboundCall.externalId, targetUserId: disabledTargetUser.id }),
      { shouldError: true, onError: (e: any) => e.message === "Target user has incoming calls disabled" }
    )
    // non-admin either can't see the call (Call not found) or is stopped by a later
    // validation (target has incoming calls disabled) — errors on every path
    await async_test(
      "cold_transfer: non-admin cannot transfer an inaccessible call",
      () => sdkNonAdmin.api.phone_calls.cold_transfer({ callSid: inboundCall.externalId, targetUserId: disabledTargetUser.id }),
      handleAnyError
    )
  } finally {
    // deleting the enduser cascades deletion of its phone_calls records
    await Promise.all([
      sdk.api.endusers.deleteOne(enduser.id),
      ...targetUsers.map(u => sdk.api.users.deleteOne(u.id)),
    ]).catch(console.error)
  }
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await phone_calls_cold_transfer_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Phone calls cold transfer test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Phone calls cold transfer test suite failed:", error)
      process.exit(1)
    })
}
