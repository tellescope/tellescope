require('source-map-support').install();

import axios from "axios"
import { Session } from "../../sdk"
import {
  async_test,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

// Coverage for the /v1/login-enduser response surface:
// - When an enduser has no password set, the error response must not include
//   enduser fields (PHI, hashedPassword, etc.).
// - The "enduser not found" and "wrong password" cases must be indistinguishable
//   (same status code, same message) to prevent account enumeration.
// - verify_otp invalid-code error must not include enduser fields.

const post_login = async (body: any) => {
  try {
    const res = await axios.post(`${host}/v1/login-enduser`, body, { validateStatus: () => true })
    return { status: res.status, data: res.data }
  } catch (err: any) {
    return { status: err?.response?.status, data: err?.response?.data }
  }
}

export const enduser_login_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Enduser Login Tests")

  const ts = Date.now()
  // Distinctive markers we can grep the response body for.
  const MARKER_FNAME = `LoginTestFname${ts}`
  const MARKER_ADDRESS = `${ts} Test Way`
  const MARKER_DOB = '01-01-1990'

  const noPasswordEnduser = await sdk.api.endusers.createOne({
    fname: MARKER_FNAME,
    lname: 'LoginTest',
    email: `login-test-no-password-${ts}@tellescope.com`,
    dateOfBirth: MARKER_DOB,
    addressLineOne: MARKER_ADDRESS,
    addressLineTwo: 'Apt 4B',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    gender: 'Female',
    assignedTo: [sdk.userInfo.id],
    fields: { secretField: `should-not-leak-${ts}` },
    tags: ['vip', 'sensitive'],
  })

  const withPasswordEnduser = await sdk.api.endusers.createOne({
    fname: 'PasswordedEnduser',
    lname: 'LoginTest',
    email: `login-test-with-password-${ts}@tellescope.com`,
  })
  await sdk.api.endusers.set_password({ id: withPasswordEnduser.id, password: 'CorrectPassword123!' })

  try {
    // Login response for an enduser without a password set must not include
    // enduser fields.
    const noPasswordResp = await post_login({
      email: noPasswordEnduser.email,
      password: 'arbitrary-password',
      businessId: sdk.userInfo.businessId,
    })

    const noPasswordBody = JSON.stringify(noPasswordResp.data ?? {})

    await async_test(
      'No-password login response does not include fname marker',
      async () => noPasswordBody.includes(MARKER_FNAME) ? 'leaked' : 'safe',
      { expectedResult: 'safe' }
    )
    await async_test(
      'No-password login response does not include dateOfBirth',
      async () => noPasswordBody.includes(MARKER_DOB) ? 'leaked' : 'safe',
      { expectedResult: 'safe' }
    )
    await async_test(
      'No-password login response does not include addressLineOne marker',
      async () => noPasswordBody.includes(MARKER_ADDRESS) ? 'leaked' : 'safe',
      { expectedResult: 'safe' }
    )
    for (const sensitiveKey of ['hashedPassword', 'assignedTo', 'fields', 'tags', 'insurance', 'customFields']) {
      await async_test(
        `No-password login response does not include "${sensitiveKey}" key`,
        async () => noPasswordBody.includes(`"${sensitiveKey}"`) ? 'leaked' : 'safe',
        { expectedResult: 'safe' }
      )
    }
    await async_test(
      'No-password login response info field is absent or empty',
      async () => {
        const info = (noPasswordResp.data ?? {}).info
        if (info === undefined) return 'safe'
        if (typeof info === 'object' && info !== null && Object.keys(info).length === 0) return 'safe'
        return 'leaked'
      },
      { expectedResult: 'safe' }
    )

    // All three failure modes (no-password-set, wrong-password, unknown-email)
    // must return an identical 401 + identical message — no enumeration of
    // which case actually applies.
    const wrongPasswordResp = await post_login({
      email: withPasswordEnduser.email,
      password: 'WrongPassword!2025',
      businessId: sdk.userInfo.businessId,
    })
    const unknownEmailResp = await post_login({
      email: `does-not-exist-${ts}@tellescope.com`,
      password: 'AnyPassword!2025',
      businessId: sdk.userInfo.businessId,
    })

    await async_test(
      'Login returns 401 for no-password account (indistinguishable from wrong password)',
      async () => `${noPasswordResp.status}:${noPasswordResp.data?.message ?? ''}`,
      { expectedResult: '401:Login details are invalid' }
    )
    await async_test(
      'Login returns same status for no-password vs wrong-password vs unknown-email',
      async () => {
        const statuses = [noPasswordResp.status, wrongPasswordResp.status, unknownEmailResp.status]
        const allSame = statuses.every(s => s === statuses[0])
        return allSame ? `same:${statuses[0]}` : `diff:${statuses.join(',')}`
      },
      { expectedResult: 'same:401' }
    )
    await async_test(
      'Login returns same message for no-password vs wrong-password vs unknown-email',
      async () => {
        const messages = [noPasswordResp.data?.message, wrongPasswordResp.data?.message, unknownEmailResp.data?.message]
        const allSame = messages.every(m => m === messages[0])
        return allSame ? 'same' : `diff:${JSON.stringify(messages)}`
      },
      { expectedResult: 'same' }
    )

    // verify_otp invalid-code response must not include enduser fields.
    const verifyOtpInvalidResp = await axios.post(
      `${host}/v1/verify-otp-code`,
      { token: 'not-a-real-token', code: '000000', businessId: sdk.userInfo.businessId },
      { validateStatus: () => true }
    )
    const verifyOtpBody = JSON.stringify(verifyOtpInvalidResp.data ?? {})
    await async_test(
      'verify_otp invalid-code response does not include any enduser fields',
      async () => (
        verifyOtpBody.includes('"hashedPassword"')
        || verifyOtpBody.includes('"assignedTo"')
        || verifyOtpBody.includes(MARKER_FNAME)
          ? 'leaked' : 'safe'
      ),
      { expectedResult: 'safe' }
    )

    // Regression: admin creating a duplicate enduser (same email) must still
    // receive the existing record's id in the error info — this is an
    // authenticated, intentional API-aid pattern via uniquenessError and must
    // not be regressed by the public-endpoint sanitizer.
    let duplicateError: any = null
    try {
      await sdk.api.endusers.createOne({ email: noPasswordEnduser.email })
    } catch (err: any) {
      duplicateError = err
    }
    await async_test(
      'Admin duplicate enduser create rejects with 409 Uniqueness Violation',
      async () => duplicateError?.message ?? 'no-error',
      { expectedResult: 'Uniqueness Violation' }
    )
    await async_test(
      'Admin duplicate enduser create returns the existing record id in info',
      async () => {
        const info = duplicateError?.info
        if (!Array.isArray(info) || info.length === 0) return `no-info:${JSON.stringify(info)}`
        const existing = info[0]?.existingRecord
        const existingId = existing?._id ?? existing?.id
        return existingId === noPasswordEnduser.id ? 'matched' : `mismatched:${existingId}`
      },
      { expectedResult: 'matched' }
    )
  } finally {
    await Promise.all([
      sdk.api.endusers.deleteOne(noPasswordEnduser.id).catch(() => null),
      sdk.api.endusers.deleteOne(withPasswordEnduser.id).catch(() => null),
    ])
  }
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await enduser_login_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Enduser login test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Enduser login test suite failed:", error)
      process.exit(1)
    })
}
