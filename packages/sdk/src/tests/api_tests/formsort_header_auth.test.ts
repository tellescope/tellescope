require('source-map-support').install();

import axios from "axios"
import { Session } from "../../sdk"
import { log_header, async_test, assert } from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || "http://localhost:8080"

// same seeded test API key used by formsort_tests (tests.ts)
const TEST_API_KEY = "9d4f9dff00f60df2690a16da2cb848f289b447614ad9bef850e54af09a1fbf7a"
// seeded second-tenant key (sdkOther in tests.ts) — valid, but for a different organization
const OTHER_TENANT_API_KEY = "ba745e25162bb95a795c5fa1af70df188d93c4d3aac9c48b34a5c8c9dd7b80f7"
const TEST_EMAIL = "formsort-header-auth@tellescope.com"

export const formsort_header_auth_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("FormSort Header Auth Tests")

  const form = await sdk.api.forms.createOne({ title: "FormSort Header Auth" })

  const buildUrl = (route: 'formsort' | 'form-ingestion', pathSegment: string) => {
    const url = new URL(`${host}/v1/webhooks/${route}/${pathSegment}`)
    url.searchParams.set('formId', form.id)
    url.searchParams.set('returnJSON', 'true')
    return url.toString()
  }

  const bodyFor = (responder_uuid: string) => ({
    answers: [{ key: 'email', value: TEST_EMAIL }],
    responder_uuid,
    finalized: true,
  })

  const formResponseIds: string[] = []

  try {
    // 1. Valid key via Authorization: API_KEY header (placeholder path segment)
    const headerAuthResult = await axios.post(
      buildUrl('formsort', 'key-in-header'),
      bodyFor("fha-1"),
      { headers: { Authorization: `API_KEY ${TEST_API_KEY}` } },
    )
    assert(
      headerAuthResult.status === 200 && !!headerAuthResult.data?.formResponseId && !!headerAuthResult.data?.enduserId,
      `Header auth failed: ${headerAuthResult.status} ${JSON.stringify(headerAuthResult.data)}`,
      "Valid API_KEY header authenticates",
    )
    if (headerAuthResult.data?.formResponseId) formResponseIds.push(headerAuthResult.data.formResponseId)

    await async_test(
      "Form response created via header auth is retrievable",
      () => sdk.api.form_responses.getOne(headerAuthResult.data.formResponseId),
      { onResult: fr => fr.formId === form.id && fr.source === 'Formsort' && !!fr.submittedAt },
    )

    // 2. Invalid key in header rejected, even with a valid key in the path (header takes precedence)
    await async_test(
      "Invalid API_KEY header rejected despite valid key in path",
      () => axios.post(
        buildUrl('formsort', TEST_API_KEY),
        bodyFor("fha-2"),
        { headers: { Authorization: `API_KEY not-a-real-key` } },
      ),
      { shouldError: true, onError: (e: any) => e.response?.status === 401 },
    )

    // 3. Back-compat: valid key in path, no Authorization header
    const pathAuthResult = await axios.post(buildUrl('formsort', TEST_API_KEY), bodyFor("fha-3"))
    assert(
      pathAuthResult.status === 200 && !!pathAuthResult.data?.formResponseId,
      `Path auth failed: ${pathAuthResult.status} ${JSON.stringify(pathAuthResult.data)}`,
      "Path-segment API key still authenticates (no header)",
    )
    if (pathAuthResult.data?.formResponseId) formResponseIds.push(pathAuthResult.data.formResponseId)

    // 4. Back-compat: non-API_KEY Authorization scheme falls through to path key
    const bearerFallthroughResult = await axios.post(
      buildUrl('formsort', TEST_API_KEY),
      bodyFor("fha-4"),
      { headers: { Authorization: 'Bearer unrelated-token' } },
    )
    assert(
      bearerFallthroughResult.status === 200 && !!bearerFallthroughResult.data?.formResponseId,
      `Bearer fallthrough failed: ${bearerFallthroughResult.status} ${JSON.stringify(bearerFallthroughResult.data)}`,
      "Non-API_KEY Authorization scheme falls through to path key",
    )
    if (bearerFallthroughResult.data?.formResponseId) formResponseIds.push(bearerFallthroughResult.data.formResponseId)

    // 5. No valid key in header or path
    await async_test(
      "No valid key anywhere rejected",
      () => axios.post(buildUrl('formsort', 'not-a-real-key'), bodyFor("fha-5")),
      { shouldError: true, onError: (e: any) => e.response?.status === 401 },
    )

    // 6. Alias route accepts header auth too
    const aliasResult = await axios.post(
      buildUrl('form-ingestion', 'key-in-header'),
      bodyFor("fha-6"),
      { headers: { Authorization: `API_KEY ${TEST_API_KEY}` } },
    )
    assert(
      aliasResult.status === 200 && !!aliasResult.data?.formResponseId,
      `form-ingestion header auth failed: ${aliasResult.status} ${JSON.stringify(aliasResult.data)}`,
      "form-ingestion alias accepts API_KEY header",
    )
    if (aliasResult.data?.formResponseId) formResponseIds.push(aliasResult.data.formResponseId)

    // 7. Back-compat: API_KEY scheme with no value falls through to the path key
    const emptyValueResult = await axios.post(
      buildUrl('formsort', TEST_API_KEY),
      bodyFor("fha-7"),
      { headers: { Authorization: 'API_KEY' } },
    )
    assert(
      emptyValueResult.status === 200 && !!emptyValueResult.data?.formResponseId,
      `Empty-value header fallthrough failed: ${emptyValueResult.status} ${JSON.stringify(emptyValueResult.data)}`,
      "API_KEY scheme without value falls through to path key",
    )
    if (emptyValueResult.data?.formResponseId) formResponseIds.push(emptyValueResult.data.formResponseId)

    // 8. Back-compat: single-token (schemeless) Authorization header falls through to the path key
    const singleTokenResult = await axios.post(
      buildUrl('formsort', TEST_API_KEY),
      bodyFor("fha-8"),
      { headers: { Authorization: 'some-opaque-token' } },
    )
    assert(
      singleTokenResult.status === 200 && !!singleTokenResult.data?.formResponseId,
      `Single-token header fallthrough failed: ${singleTokenResult.status} ${JSON.stringify(singleTokenResult.data)}`,
      "Schemeless Authorization header falls through to path key",
    )
    if (singleTokenResult.data?.formResponseId) formResponseIds.push(singleTokenResult.data.formResponseId)

    // 9. When header and path both hold VALID keys, the header key's organization scopes the request:
    // the formId belongs to the primary tenant, so an other-tenant header key must fail form lookup (400),
    // proving the path key's org is not used
    await async_test(
      "Valid other-tenant header key overrides valid path key (org scoping)",
      () => axios.post(
        buildUrl('formsort', TEST_API_KEY),
        bodyFor("fha-9"),
        { headers: { Authorization: `API_KEY ${OTHER_TENANT_API_KEY}` } },
      ),
      { shouldError: true, onError: (e: any) => e.response?.status === 400 && e.response?.data === 'formId Invalid' },
    )
  } finally {
    for (const id of formResponseIds) {
      try { await sdk.api.form_responses.deleteOne(id) } catch (err) { /* may not exist */ }
    }
    try {
      const enduser = await sdk.api.endusers.getOne({ email: TEST_EMAIL })
      await sdk.api.endusers.deleteOne(enduser.id)
    } catch (err) { /* may not exist */ }
    try { await sdk.api.forms.deleteOne(form.id) } catch (err) { /* may not exist */ }
  }
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await formsort_header_auth_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ FormSort header auth tests completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ FormSort header auth tests failed:", error)
      process.exit(1)
    })
}
