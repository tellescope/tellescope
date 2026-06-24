require('source-map-support').install();

import { Session } from "../../../sdk"
import {
  async_test,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

/**
 * Regression test for F-0145
 * (security-audit/findings/F-0145-globalunique-conflict-leaks-cross-tenant-record.md).
 *
 * The create endpoint generator's unconditional globalUnique-enforcement block
 * (routing.ts, "globalUnique should be enforced even if _overrideUnique is true")
 * threw uniquenessError([{ existingRecord: matches[0] }]) with the RAW matched record.
 * `findSomeByMatchAny_Global` deletes businessId, so the match is global; for `users`
 * (globalUnique: ['email','phone']) the 409 body leaked the full record incl. hashedPass.
 *
 * Fix: redact existingRecord to { _id, businessId } like the safe validateUniquenessConstraints
 * path. This reproduces the leak with a same-tenant collision (same code path) and asserts the
 * 409 body's existingRecord exposes nothing beyond _id + businessId.
 */
export const globalunique_leak_tests = async ({ sdk } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("F-0145: globalUnique conflict response redaction")

  let userId: string | undefined
  try {
    const email = `f0145-victim-${Date.now()}@example.com`
    const user = await sdk.api.users.createOne({ email } as any)
    userId = user.id

    await async_test(
      'F-0145: globalUnique 409 existingRecord exposes only _id + businessId (no email/hashedPass)',
      () => sdk.api.users.createOne({ email, _overrideUnique: true } as any),
      {
        shouldError: true,
        onError: (e: any) => {
          const rec = e?.info?.[0]?.existingRecord
          if (!rec || typeof rec !== 'object') return false
          const keys = Object.keys(rec)
          return (
            keys.length > 0
            && keys.every(k => k === '_id' || k === 'businessId' || k === 'id')
            && !('email' in rec)
            && !('hashedPass' in rec)
            && !('hashedInviteCode' in rec)
          )
        },
      },
    )
  } finally {
    if (userId) { try { await sdk.api.users.deleteOne(userId) } catch {} }
  }
}

if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await globalunique_leak_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ F-0145 globalUnique leak test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ F-0145 globalUnique leak test suite failed:", error)
      process.exit(1)
    })
}
