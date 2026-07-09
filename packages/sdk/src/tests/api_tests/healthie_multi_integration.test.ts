require('source-map-support').install();

import axios from "axios"
import { Session } from "../../sdk"
import {
  async_test,
  log_header,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../setup"
import { BUILT_INS_FOR_SET_FIELDS, HEALTHIE_TITLE } from "@tellescope/constants"

const host = process.env.API_URL || 'http://localhost:8080' as const

const TAG = 'clinic-two'
const FORMSORT_TEST_KEY = '9d4f9dff00f60df2690a16da2cb848f289b447614ad9bef850e54af09a1fbf7a'

export const healthie_multi_integration_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Multiple Healthie Integrations Tests")

  const businessId = sdk.userInfo.businessId

  let primaryIntegrationId = ''
  let taggedIntegrationId = ''
  let enduserId = ''
  let formsortEnduserId = ''
  let formId = ''

  try {
    // ── Set Fields support ────────────────────────────────────────────────────────────────────
    if (!BUILT_INS_FOR_SET_FIELDS.includes('healthieIntegrationId')) {
      throw new Error("healthieIntegrationId missing from BUILT_INS_FOR_SET_FIELDS")
    }
    console.log("✅ healthieIntegrationId exposed in BUILT_INS_FOR_SET_FIELDS")

    // ── Create primary (untagged, sandbox-style key) + additional (tagged, production-style key)
    // via the standard REST create endpoint — the real creation path for additional connections ──
    const primary = await sdk.api.integrations.createOne({
      title: HEALTHIE_TITLE,
      disableEnduserAutoSync: true, // fake keys — avoid auto-sync attempts during the test
      disableTicketAutoSync: true,
      authentication: {
        type: 'apiKey',
        info: { access_token: 'gh_sbox_fake_primary_key', refresh_token: 'unused', scope: '', token_type: 'Bearer', expiry_date: 0 },
      },
    })
    primaryIntegrationId = primary.id

    const tagged = await sdk.api.integrations.createOne({
      title: HEALTHIE_TITLE,
      tenantId: TAG,
      disableEnduserAutoSync: true,
      disableTicketAutoSync: true,
      authentication: {
        type: 'apiKey',
        info: { access_token: 'fake_production_key', refresh_token: 'unused', scope: '', token_type: 'Bearer', expiry_date: 0 },
      },
    })
    taggedIntegrationId = tagged.id

    if (tagged.tenantId !== TAG) {
      throw new Error(`tenantId not persisted on create (got "${tagged.tenantId}")`)
    }
    console.log("✅ tenantId persists via standard integrations create")

    // ── Per-connection settings: update_settings works against a tagged integration ──
    await async_test(
      "update_settings updates a tagged integration",
      () => sdk.api.integrations.update_settings({ id: taggedIntegrationId, updates: { pushAddedTags: true } }),
      { onResult: r => r.integration?.pushAddedTags === true },
    )
    await async_test(
      "tagged integration settings persist independently",
      () => sdk.api.integrations.getOne(taggedIntegrationId),
      { onResult: i => i.pushAddedTags === true && i.tenantId === TAG },
    )
    await async_test(
      "primary integration unaffected by tagged settings update",
      () => sdk.api.integrations.getOne(primaryIntegrationId),
      { onResult: i => !i.pushAddedTags },
    )

    // ── Organization.healthieIntegrationIds pushed by create side effect ──
    await wait(undefined, 2000) // side effects are async
    await async_test(
      "organization.healthieIntegrationIds includes tag after create",
      () => sdk.api.organizations.getOne(businessId),
      { onResult: o => !!(o as any).healthieIntegrationIds?.includes(TAG) },
    )

    // ── Inbound webhook resolution (help page proves the integration lookup without network) ──
    await async_test(
      "webhook help page resolves primary (sandbox) without query param",
      () => axios.get(`${host}/v1/webhooks/healthie/${businessId}`),
      { onResult: r => typeof r.data === 'string' && r.data.startsWith('Sandbox') },
    )
    await async_test(
      "webhook help page resolves tagged (production) integration via healthieIntegrationId param",
      () => axios.get(`${host}/v1/webhooks/healthie/${businessId}?healthieIntegrationId=${TAG}`),
      { onResult: r => typeof r.data === 'string' && r.data.startsWith('Production') },
    )
    await async_test(
      "webhook help page rejects unknown healthieIntegrationId",
      () => axios.get(`${host}/v1/webhooks/healthie/${businessId}?healthieIntegrationId=not-a-real-id`),
      { shouldError: true, onError: (e: any) => e?.response?.status === 400 },
    )

    // ── Enduser field + one-org-per-patient lock (relationship constraint) ──
    const enduser = await sdk.api.endusers.createOne({
      email: 'multi-healthie-test@tellescope.com',
      healthieIntegrationId: TAG,
    })
    enduserId = enduser.id
    if (enduser.healthieIntegrationId !== TAG) {
      throw new Error("healthieIntegrationId not persisted on enduser create")
    }

    await async_test(
      "healthieIntegrationId freely changeable while unlinked",
      () => sdk.api.endusers.updateOne(enduserId, { healthieIntegrationId: '' }),
      { onResult: e => !e.healthieIntegrationId },
    )
    await async_test(
      "healthieIntegrationId re-set while unlinked",
      () => sdk.api.endusers.updateOne(enduserId, { healthieIntegrationId: TAG }),
      { onResult: e => e.healthieIntegrationId === TAG },
    )

    // link the patient to Healthie (reference with a Healthie patient id)
    await sdk.api.endusers.updateOne(enduserId, { references: [{ type: HEALTHIE_TITLE, id: '12345' }] } as any, { replaceObjectFields: true })

    await async_test(
      "healthieIntegrationId locked once a Healthie patient ID exists",
      () => sdk.api.endusers.updateOne(enduserId, { healthieIntegrationId: 'somewhere-else' }),
      { shouldError: true, onError: (e: any) => (e?.message || e?.toString() || '').includes('healthieIntegrationId') },
    )
    await async_test(
      "no-op write of the same value still allowed while locked",
      () => sdk.api.endusers.updateOne(enduserId, { healthieIntegrationId: TAG }),
      { onResult: e => e.healthieIntegrationId === TAG },
    )

    // unlink → changeable again
    await sdk.api.endusers.updateOne(enduserId, { references: [] } as any, { replaceObjectFields: true })
    await async_test(
      "healthieIntegrationId changeable again after unlinking",
      () => sdk.api.endusers.updateOne(enduserId, { healthieIntegrationId: '' }),
      { onResult: e => !e.healthieIntegrationId },
    )

    // ── Formsort mapping ──
    const form = await sdk.api.forms.createOne({ title: "Multi Healthie FormSort" })
    formId = form.id

    const formsortEmail = 'multi-healthie-formsort@tellescope.com'
    const postToFormsort = (answers: { key: string, value: any }[], responder_uuid: string) => {
      const url = new URL(`${host}/v1/webhooks/formsort/${FORMSORT_TEST_KEY}`)
      url.searchParams.set('formId', form.id)
      return axios.post(url.toString(), { answers, responder_uuid, finalized: true })
    }

    await postToFormsort([
      { key: 'email', value: formsortEmail },
      { key: 'healthieIntegrationId', value: TAG },
    ], "multi-healthie-1")

    await async_test(
      "formsort sets healthieIntegrationId on unlinked enduser",
      () => sdk.api.endusers.getSome({ filter: { email: formsortEmail } }),
      { onResult: es => {
        const e = es.find(e => e.email === formsortEmail)
        formsortEnduserId = e?.id || ''
        return e?.healthieIntegrationId === TAG
      }},
    )

    // link the formsort enduser, then attempt a relink via formsort — field change must be dropped
    await sdk.api.endusers.updateOne(formsortEnduserId, { references: [{ type: HEALTHIE_TITLE, id: '6789' }] } as any, { replaceObjectFields: true })
    await postToFormsort([
      { key: 'email', value: formsortEmail },
      { key: 'healthieIntegrationId', value: 'somewhere-else' },
    ], "multi-healthie-2")
    await wait(undefined, 1000)

    await async_test(
      "formsort relink attempt on linked enduser is dropped",
      () => sdk.api.endusers.getOne(formsortEnduserId),
      { onResult: e => e.healthieIntegrationId === TAG },
    )
    await async_test(
      "formsort relink attempt logs a customer-visible background error",
      () => sdk.api.background_errors.getSome(),
      { onResult: errors => errors.some(e =>
        e.title === "Healthie Integration Change Blocked" && e.enduserId === formsortEnduserId
      )},
    )

    // ── Removing the primary must not affect the tagged integration; org list recomputes on delete ──
    await sdk.api.integrations.deleteOne(primaryIntegrationId)
    primaryIntegrationId = ''
    await async_test(
      "tagged integration survives primary deletion",
      () => sdk.api.integrations.getOne(taggedIntegrationId),
      { onResult: i => i.tenantId === TAG },
    )

    await sdk.api.integrations.deleteOne(taggedIntegrationId)
    taggedIntegrationId = ''
    await wait(undefined, 2000) // delete side effect is async
    await async_test(
      "organization.healthieIntegrationIds recomputed (emptied) after delete",
      () => sdk.api.organizations.getOne(businessId),
      { onResult: o => !(o as any).healthieIntegrationIds?.includes(TAG) },
    )
  } finally {
    for (const id of [primaryIntegrationId, taggedIntegrationId]) {
      if (!id) continue
      await sdk.api.integrations.deleteOne(id).catch(console.error)
    }
    if (enduserId) await sdk.api.endusers.deleteOne(enduserId).catch(console.error)
    if (formsortEnduserId) await sdk.api.endusers.deleteOne(formsortEnduserId).catch(console.error)
    if (formId) await sdk.api.forms.deleteOne(formId).catch(console.error)
  }
}

if (require.main === module) {
  console.log(`Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await healthie_multi_integration_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Multiple Healthie integrations test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Multiple Healthie integrations test suite failed:", error)
      process.exit(1)
    })
}
