require('source-map-support').install();

import { Session } from "../../../sdk"
import {
  async_test,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

const ENDUSER_PASSWORD = 'F0151TestPassword!123'

/**
 * Regression test for F-0151
 * (security-audit/findings/F-0151-load-inbox-data-endusers-unredacted.md).
 *
 * load_inbox_data serialized $lookup'ed endusers via convert_id_name only (NOT applyRedactions),
 * so endusers.hashedPassword (redactions:['all']) leaked to staff sessions — while the sibling
 * phone_calls in the same response correctly went through applyRedactions.
 *
 * Repro: create an enduser, set their portal password (→ hashedPassword), seed an inbound
 * (logOnly) email so the enduser appears in the inbox join, then load_inbox_data as staff and
 * assert the returned enduser entry has NO hashedPassword.
 */
export const load_inbox_redaction_tests = async ({ sdk } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("F-0151: load_inbox_data enduser redaction")

  let enduserId: string | undefined
  let emailId: string | undefined
  try {
    const email = `f0151-enduser-${Date.now()}@example.com`
    const enduser = await sdk.api.endusers.createOne({ email, fname: 'F0151', lname: 'Inbox' })
    enduserId = enduser.id
    await sdk.api.endusers.set_password({ id: enduser.id, password: ENDUSER_PASSWORD })

    // Seed an inbound logOnly email so the enduser is joined into the inbox payload
    const seeded = await sdk.api.emails.createOne({
      enduserId: enduser.id, subject: 'F0151 seed', textContent: 'seed',
      logOnly: true, inbound: true,
    } as any)
    emailId = seeded.id

    await async_test(
      'F-0151: load_inbox_data does not leak enduser.hashedPassword to staff',
      () => sdk.api.endusers.load_inbox_data({ enduserIds: [enduser.id] } as any),
      {
        onResult: (r: any) => {
          const returned = (r?.endusers ?? []).find((e: any) => (e.id || e._id)?.toString() === enduserId)
          // require that the enduser actually came back (so the assertion is meaningful),
          // and that hashedPassword is absent
          return !!returned && !('hashedPassword' in returned)
        },
      },
    )
  } finally {
    if (emailId) { try { await sdk.api.emails.deleteOne(emailId) } catch {} }
    if (enduserId) { try { await sdk.api.endusers.deleteOne(enduserId) } catch {} }
  }
}

if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await load_inbox_redaction_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ F-0151 load_inbox_data redaction test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ F-0151 load_inbox_data redaction test suite failed:", error)
      process.exit(1)
    })
}
