require('source-map-support').install();

import { Session } from "../../sdk"
import {
  async_test,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"
import { INTEGRATION_SENSITIVE_FIELDS } from "@tellescope/constants"

const host = process.env.API_URL || 'http://localhost:8080' as const

const hasNoSensitiveFields = (integration: any) => {
  for (const field of INTEGRATION_SENSITIVE_FIELDS) {
    if (field in integration) return false
  }
  return true
}

export const integrations_redacted_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Integrations Redacted Endpoints Tests")

  let integrationId = ''
  let sensitiveIntegrationId = ''

  try {
    // Create an integration with real auth data
    const created = await sdk.api.integrations.createOne({
      title: 'Test Redacted Integration',
      authentication: { type: 'oauth2', info: { access_token: 'test-access-token', refresh_token: 'test-refresh-token', scope: '', token_type: 'Bearer', expiry_date: new Date().getTime() } },
      webhooksSecret: 'super-secret-webhook',
      emailDisabled: false,
    })
    integrationId = created.id

    // load_redacted as creator — verify integration is returned, no sensitive fields present
    await async_test(
      "load_redacted as creator returns redacted integrations",
      () => sdk.api.integrations.load_redacted({}),
      { onResult: r => {
        const found = r.integrations.find((i: any) => i.id === integrationId)
        return !!found && hasNoSensitiveFields(found) && found.title === 'Test Redacted Integration'
      }}
    )

    // load_redacted as non-creator — verify same integration visible and redacted
    await async_test(
      "load_redacted as non-creator returns redacted integrations (bypasses CREATOR_ONLY)",
      () => sdkNonAdmin.api.integrations.load_redacted({}),
      { onResult: r => {
        const found = r.integrations.find((i: any) => i.id === integrationId)
        return !!found && hasNoSensitiveFields(found) && found.title === 'Test Redacted Integration'
      }}
    )

    // Standard load endpoints enforce CREATOR_ONLY — creator gets full object, non-creator gets nothing
    await async_test(
      "getOne as creator returns full integration including sensitive fields",
      () => sdk.api.integrations.getOne(integrationId),
      { onResult: i => !!i && 'authentication' in i && 'webhooksSecret' in i }
    )

    await async_test(
      "getOne as non-creator returns 404 (CREATOR_ONLY access control)",
      () => sdkNonAdmin.api.integrations.getOne(integrationId),
      { shouldError: true, onError: () => true }
    )

    await async_test(
      "getSome as non-creator returns empty list (CREATOR_ONLY access control)",
      () => sdkNonAdmin.api.integrations.getSome(),
      { onResult: r => Array.isArray(r) && r.find((i: any) => i.id === integrationId) === undefined }
    )

    // update_settings as creator — update a non-sensitive field
    await async_test(
      "update_settings as creator updates non-sensitive field",
      () => sdk.api.integrations.update_settings({ id: integrationId, updates: { emailDisabled: true } }),
      { onResult: r => {
        return !!r.integration && r.integration.emailDisabled === true && hasNoSensitiveFields(r.integration)
      }}
    )

    // update_settings as non-creator — update another field
    await async_test(
      "update_settings as non-creator updates non-sensitive field",
      () => sdkNonAdmin.api.integrations.update_settings({ id: integrationId, updates: { disableEnduserAutoSync: true } }),
      { onResult: r => {
        return !!r.integration && r.integration.disableEnduserAutoSync === true && hasNoSensitiveFields(r.integration)
      }}
    )

    // update_settings rejects sensitive fields
    await async_test(
      "update_settings rejects authentication update",
      () => sdkNonAdmin.api.integrations.update_settings({ id: integrationId, updates: { authentication: { type: 'apiKey', info: { api_key: 'hacked' } } } as any }),
      { shouldError: true, onError: () => true }
    )

    await async_test(
      "update_settings rejects webhooksSecret update",
      () => sdkNonAdmin.api.integrations.update_settings({ id: integrationId, updates: { webhooksSecret: 'hacked' } as any }),
      { shouldError: true, onError: () => true }
    )

    await async_test(
      "update_settings rejects fhirClientSecret update",
      () => sdkNonAdmin.api.integrations.update_settings({ id: integrationId, updates: { fhirClientSecret: 'hacked' } as any }),
      { shouldError: true, onError: () => true }
    )

    // Group 1: Dot-notation bypass tests (validates the allowlist fix)
    await async_test(
      "update_settings rejects dot-notation authentication.info.api_key update",
      () => sdk.api.integrations.update_settings({ id: integrationId, updates: { "authentication.info.api_key": "hacked" } as any }),
      { shouldError: true, onError: () => true }
    )

    await async_test(
      "update_settings rejects dot-notation authentication.type update",
      () => sdk.api.integrations.update_settings({ id: integrationId, updates: { "authentication.type": "hacked" } as any }),
      { shouldError: true, onError: () => true }
    )

    // Group 2: Remaining sensitive field rejections
    await async_test(
      "update_settings rejects fhirClientId update",
      () => sdk.api.integrations.update_settings({ id: integrationId, updates: { fhirClientId: 'hacked' } as any }),
      { shouldError: true, onError: () => true }
    )

    await async_test(
      "update_settings rejects fhirAccessToken update",
      () => sdk.api.integrations.update_settings({ id: integrationId, updates: { fhirAccessToken: 'hacked' } as any }),
      { shouldError: true, onError: () => true }
    )

    // Group 3: Non-allowlisted field rejections
    await async_test(
      "update_settings rejects title update (not in allowlist)",
      () => sdk.api.integrations.update_settings({ id: integrationId, updates: { title: 'hacked' } as any }),
      { shouldError: true, onError: () => true }
    )

    await async_test(
      "update_settings rejects environment update (not in allowlist)",
      () => sdk.api.integrations.update_settings({ id: integrationId, updates: { environment: 'hacked' } as any }),
      { shouldError: true, onError: () => true }
    )

    await async_test(
      "update_settings rejects unknown field update",
      () => sdk.api.integrations.update_settings({ id: integrationId, updates: { unknownField: 'hacked' } as any }),
      { shouldError: true, onError: () => true }
    )

    // Group 4: Verify additional allowlisted fields can be updated
    await async_test(
      "update_settings allows syncUnrecognizedSenders update",
      () => sdk.api.integrations.update_settings({ id: integrationId, updates: { syncUnrecognizedSenders: true } }),
      { onResult: r => !!r.integration && r.integration.syncUnrecognizedSenders === true && hasNoSensitiveFields(r.integration) }
    )

    await async_test(
      "update_settings allows pushCalendarDetails update",
      () => sdk.api.integrations.update_settings({ id: integrationId, updates: { pushCalendarDetails: true } }),
      { onResult: r => !!r.integration && r.integration.pushCalendarDetails === true && hasNoSensitiveFields(r.integration) }
    )

    // Group 5: Explicit per-field redaction verification
    // Note: fhirClientId/fhirClientSecret/fhirAccessToken are set server-side via OAuth flows only,
    // so we test redaction of the fields that can be set via createOne (authentication, webhooksSecret)
    const sensitiveIntegration = await sdk.api.integrations.createOne({
      title: 'Test All Sensitive Fields',
      authentication: { type: 'oauth2', info: { access_token: 'secret-access-token', refresh_token: 'secret-refresh-token', scope: '', token_type: 'Bearer', expiry_date: new Date().getTime() } },
      webhooksSecret: 'super-secret-webhook-456',
      emailDisabled: true,
    })
    sensitiveIntegrationId = sensitiveIntegration.id

    await async_test(
      "load_redacted omits authentication field individually",
      () => sdk.api.integrations.load_redacted({}),
      { onResult: r => {
        const found = r.integrations.find((i: any) => i.id === sensitiveIntegrationId)
        return !!found && !('authentication' in found)
      }}
    )

    await async_test(
      "load_redacted omits webhooksSecret field individually",
      () => sdk.api.integrations.load_redacted({}),
      { onResult: r => {
        const found = r.integrations.find((i: any) => i.id === sensitiveIntegrationId)
        return !!found && !('webhooksSecret' in found)
      }}
    )

    await async_test(
      "load_redacted still returns non-sensitive fields",
      () => sdk.api.integrations.load_redacted({}),
      { onResult: r => {
        const found = r.integrations.find((i: any) => i.id === sensitiveIntegrationId)
        return !!found && found.emailDisabled === true && found.title === 'Test All Sensitive Fields'
      }}
    )

  } finally {
    if (integrationId) {
      try {
        await sdk.api.integrations.deleteOne(integrationId)
      } catch (error) {
        console.error('Cleanup error:', error)
      }
    }
    if (sensitiveIntegrationId) {
      try {
        await sdk.api.integrations.deleteOne(sensitiveIntegrationId)
      } catch (error) {
        console.error('Cleanup error (sensitive integration):', error)
      }
    }
  }
}

if (require.main === module) {
  console.log(`Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await integrations_redacted_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("Integrations redacted test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Integrations redacted test suite failed:", error)
      process.exit(1)
    })
}
