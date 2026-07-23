require('source-map-support').install();

import axios from "axios"
import { Session } from "../../sdk"
import {
  assert,
  async_test,
  log_header,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../setup"
import { FORM_INGESTION_API_KEY_SCOPE } from "@tellescope/types-models"

const host = process.env.API_URL || "http://localhost:8080"

const TEST_EMAIL = "scoped-api-keys@tellescope.com"

export const scoped_api_keys_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Scoped API Keys (form-ingestion)")

  const form = await sdk.api.forms.createOne({ title: "Scoped API Key Test Form" })

  const buildUrl = (pathSegment: string) => {
    const url = new URL(`${host}/v1/webhooks/form-ingestion/${pathSegment}`)
    url.searchParams.set('formId', form.id)
    url.searchParams.set('returnJSON', 'true')
    return url.toString()
  }

  const bodyFor = (responder_uuid: string) => ({
    answers: [{ key: 'email', value: TEST_EMAIL }],
    responder_uuid,
    finalized: true,
  })

  const keyIds: string[] = []
  const formResponseIds: string[] = []
  let throwawayUserId: string | undefined
  let throwawayRoleId: string | undefined

  try {
    // =============================================
    // (a) Admin creates a scoped key
    // =============================================
    const scoped = await sdk.api.api_keys.createOne({ scopes: [FORM_INGESTION_API_KEY_SCOPE] })
    keyIds.push(scoped.id)
    assert(!!scoped.id && !!scoped.key, "scoped key create returned no id/key", "admin creates a form-ingestion-scoped key")

    // record reflects the scope for its creator (CREATOR_ONLY_ACCESS read)
    await async_test(
      "scoped key record stores scopes",
      () => sdk.api.api_keys.getOne(scoped.id),
      { onResult: k => JSON.stringify(k.scopes) === JSON.stringify([FORM_INGESTION_API_KEY_SCOPE]) },
    )

    // =============================================
    // (b) Scoped key is rejected on all general /v1 auth
    // =============================================
    await async_test(
      "scoped key rejected on /v1/test-authenticated",
      () => new Session({ host, apiKey: scoped.key }).test_authenticated(),
      // SDK parseError surfaces a raw 401 body as the string 'Unauthenticated'
      { shouldError: true, onError: (e: any) => e === 'Unauthenticated' || e?.statusCode === 401 || /unauthenticated/i.test(e?.message || '') },
    )
    await async_test(
      "scoped key rejected on GET /v1/endusers",
      () => axios.get(`${host}/v1/endusers`, { headers: { Authorization: `API_KEY ${scoped.key}` } }),
      { shouldError: true, onError: (e: any) => e.response?.status === 401 },
    )
    await async_test(
      "scoped key rejected on cross-org targeting (x-tellescope-organization)",
      () => axios.get(`${host}/v1/endusers`, {
        headers: {
          Authorization: `API_KEY ${scoped.key}`,
          'x-tellescope-organization': sdk.userInfo.businessId,
        },
      }),
      { shouldError: true, onError: (e: any) => e.response?.status === 401 },
    )

    // =============================================
    // (c) Scoped key IS accepted by the form-ingestion webhook
    // =============================================
    const headerResult = await axios.post(
      buildUrl('key-in-header'),
      bodyFor("scoped-1"),
      { headers: { Authorization: `API_KEY ${scoped.key}` } },
    )
    assert(
      headerResult.status === 200 && !!headerResult.data?.formResponseId,
      `scoped key header auth failed: ${headerResult.status} ${JSON.stringify(headerResult.data)}`,
      "scoped key authenticates the form-ingestion webhook via header",
    )
    if (headerResult.data?.formResponseId) formResponseIds.push(headerResult.data.formResponseId)

    const pathResult = await axios.post(buildUrl(scoped.key), bodyFor("scoped-2"))
    assert(
      pathResult.status === 200 && !!pathResult.data?.formResponseId,
      `scoped key path auth failed: ${pathResult.status} ${JSON.stringify(pathResult.data)}`,
      "scoped key authenticates the form-ingestion webhook via path segment",
    )
    if (pathResult.data?.formResponseId) formResponseIds.push(pathResult.data.formResponseId)

    // =============================================
    // (d) Non-admin cannot create a scoped key (throwaway user, never mutate existing roles)
    // =============================================
    const apiKeysRole = await sdk.api.role_based_access_permissions.createOne({
      role: 'scoped-api-keys-test-role',
      permissions: { api_keys: { create: 'All', read: 'All', update: 'All', delete: 'All' } },
    })
    throwawayRoleId = apiKeysRole.id

    const throwawayUser = (
      await sdk.api.users.getOne({ email: 'scoped.api.keys.user@tellescope.com' }).catch(() => null)
    ) || (
      await sdk.api.users.createOne({ email: 'scoped.api.keys.user@tellescope.com', notificationEmailsDisabled: true, verifiedEmail: true })
    )
    throwawayUserId = throwawayUser.id
    await sdk.api.users.updateOne(throwawayUser.id, { roles: [apiKeysRole.role] }, { replaceObjectFields: true })
    await wait(undefined, 2000) // wait for the role change to propagate before authenticating

    const otherSdk = new Session({
      host,
      authToken: (await sdk.api.users.generate_auth_token({ id: throwawayUser.id })).authToken,
    })

    await async_test(
      "non-admin cannot create a scoped key (401)",
      () => otherSdk.api.api_keys.createOne({ scopes: [FORM_INGESTION_API_KEY_SCOPE] }),
      { shouldError: true, onError: (e: any) => e === 'Unauthenticated' || e?.statusCode === 401 || /admin/i.test(e?.message || '') },
    )

    // ...but CAN still create an unscoped key; an empty scopes list is rejected by validation (fail closed)
    const nonAdminKey = await otherSdk.api.api_keys.createOne({})
    await async_test(
      "empty scopes list rejected by validation",
      () => otherSdk.api.api_keys.createOne({ scopes: [] }),
      { shouldError: true, onError: (e: any) => e?.statusCode === 400 || /empty|not valid|invalid/i.test(e?.message || '') },
    )
    // creator-only cleanup for the throwaway user's key before the user is deleted
    await otherSdk.api.api_keys.deleteOne(nonAdminKey.id).catch(() => {})

    // =============================================
    // (e) Unscoped keys are unchanged (no regression)
    // =============================================
    const unscoped = await sdk.api.api_keys.createOne({})
    const unscopedKeyValue = (unscoped as any).key as string
    keyIds.push(unscoped.id)

    await async_test(
      "unscoped key still authenticates general /v1",
      () => new Session({ host, apiKey: unscopedKeyValue }).test_authenticated(),
      { onResult: r => !!r },
    )
    // Frozen pre-existing behavior: unscoped /v1-created keys store a utf8-encoded hashedKey, which the
    // webhook's hex lookup never matches — only legacy plaintext keys and hex-stored scoped keys work there.
    // (Legacy-key webhook auth is covered by formsort_header_auth.test.ts.)
    await async_test(
      "unscoped /v1-created key still does NOT authenticate the webhook (frozen encoding quirk)",
      () => axios.post(
        buildUrl('key-in-header'),
        bodyFor("scoped-3"),
        { headers: { Authorization: `API_KEY ${unscopedKeyValue}` } },
      ),
      { shouldError: true, onError: (e: any) => e.response?.status === 401 },
    )

    // =============================================
    // (f) Admin org-wide list includes scopes (and still never leaks secrets)
    // =============================================
    const { apiKeys } = await sdk.api.api_keys.get_organization_api_keys()
    assert(
      !!apiKeys.find(k => k.id === scoped.id && JSON.stringify(k.scopes) === JSON.stringify([FORM_INGESTION_API_KEY_SCOPE])),
      "org list did not report scopes on the scoped key",
      "get_organization_api_keys reports scopes on scoped keys",
    )
    assert(
      !!apiKeys.find(k => k.id === unscoped.id && k.scopes === undefined),
      "org list reported scopes on an unscoped key",
      "get_organization_api_keys omits scopes on unscoped keys",
    )
    assert(
      apiKeys.every(k => (k as any).key === undefined && (k as any).hashedKey === undefined),
      "org list leaked key material",
      "get_organization_api_keys still never returns key/hashedKey",
    )

    // =============================================
    // Validation: unknown scope values are rejected
    // =============================================
    await async_test(
      "unknown scope value rejected by validation",
      () => sdk.api.api_keys.createOne({ scopes: ['not-a-real-scope'] as any }),
      { shouldError: true, onError: (e: any) => e?.statusCode === 400 || /must match|not valid|invalid/i.test(e?.message || '') },
    )
  } finally {
    for (const id of keyIds) {
      await sdk.api.api_keys.deleteOne(id).catch(() => {})
    }
    for (const id of formResponseIds) {
      await sdk.api.form_responses.deleteOne(id).catch(() => {})
    }
    try {
      const enduser = await sdk.api.endusers.getOne({ email: TEST_EMAIL })
      await sdk.api.endusers.deleteOne(enduser.id)
    } catch (err) { /* may not exist */ }
    await sdk.api.forms.deleteOne(form.id).catch(() => {})
    if (throwawayUserId) {
      await sdk.api.users.deleteOne(throwawayUserId).catch(() => {})
    }
    if (throwawayRoleId) {
      await sdk.api.role_based_access_permissions.deleteOne(throwawayRoleId).catch(() => {})
    }
  }
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await scoped_api_keys_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Scoped API keys test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Scoped API keys test suite failed:", error)
      process.exit(1)
    })
}
