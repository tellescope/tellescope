require('source-map-support').install();

import { Session } from "../../sdk"
import {
  assert,
  async_test,
  log_header,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

// fields that the admin org-wide list endpoint is allowed to return
const ALLOWED_FIELDS = ['id', 'creator', 'businessId', 'updatedAt'].sort()

export const organization_api_keys_tests = async (
  { sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }
) => {
  log_header("Organization API Keys (admin org-wide management)")

  // We never mutate sdkNonAdmin's roles here (throwaway-user rule). Instead we create a
  // dedicated throwaway user in the SAME org that DOES have api_keys access (via a custom
  // role), so it can create its own key (the offboarded-employee scenario) and so the
  // admin-gating negative tests below exercise the adminOnly gate (401) rather than the
  // access-permission gate (403) — a non-admin without api_keys access is rejected with
  // "Inaccessible" before adminOnly is ever reached.
  const adminKeyIds: string[] = []
  let otherKeyId: string | undefined
  let otherUserId: string | undefined
  let apiKeysRoleId: string | undefined

  try {
    // A custom role that grants api_keys access (merged over PROVIDER_PERMISSIONS server-side)
    const apiKeysRole = await sdk.api.role_based_access_permissions.createOne({
      role: 'api-keys-test-role',
      permissions: { api_keys: { create: 'All', read: 'All', update: 'All', delete: 'All' } },
    })
    apiKeysRoleId = apiKeysRole.id

    // A throwaway non-admin user in the same org, holding that role
    const otherUser = (
      await sdk.api.users.getOne({ email: 'api.keys.other.user@tellescope.com' }).catch(() => null)
    ) || (
      await sdk.api.users.createOne({ email: 'api.keys.other.user@tellescope.com', notificationEmailsDisabled: true, verifiedEmail: true })
    )
    otherUserId = otherUser.id
    await sdk.api.users.updateOne(otherUser.id, { roles: [apiKeysRole.role] }, { replaceObjectFields: true })
    await wait(undefined, 2000) // wait for the role change to propagate before authenticating

    const otherSdk = new Session({
      host,
      authToken: (await sdk.api.users.generate_auth_token({ id: otherUser.id })).authToken,
    })

    // A key created by the admin...
    const adminKey = await sdk.api.api_keys.createOne({})
    adminKeyIds.push(adminKey.id)

    // ...and a key created by ANOTHER user in the org (the offboarded-employee scenario)
    const otherKey = await otherSdk.api.api_keys.createOne({})
    otherKeyId = otherKey.id

    // =============================================
    // CORE: admin sees keys created by other users
    // =============================================
    const { apiKeys } = await sdk.api.api_keys.get_organization_api_keys()

    assert(
      apiKeys.some(k => k.id === otherKeyId),
      `admin list did not include another user's key ${otherKeyId}`,
      "admin get_organization_api_keys returns keys created by other users in the org"
    )
    assert(
      apiKeys.some(k => k.id === adminKey.id),
      "admin list did not include the admin's own key",
      "admin get_organization_api_keys returns the admin's own keys"
    )
    assert(
      !!apiKeys.find(k => k.id === otherKeyId && k.creator === otherUser.id),
      "creator on the other user's key did not match",
      "returned key reports the correct creator"
    )

    // =============================================
    // SECRET REDACTION (server-side, allowlist)
    // =============================================
    assert(
      apiKeys.every(k => (k as any).key === undefined),
      "a returned record exposed a plaintext `key`",
      "no returned record exposes a plaintext key (legacy field)"
    )
    assert(
      apiKeys.every(k => (k as any).hashedKey === undefined),
      "a returned record exposed `hashedKey`",
      "no returned record exposes hashedKey"
    )
    // Strict allowlist: every returned field must be in the allowlist (no extra/sensitive field
    // ever leaks). We can't require all allowlisted fields to be PRESENT — never-updated keys
    // have no `updatedAt`, and res.json() drops undefined values — so this is a subset check.
    const offending = apiKeys
      .map(k => Object.keys(k).filter(key => !ALLOWED_FIELDS.includes(key)))
      .find(extra => extra.length > 0)
    assert(
      offending === undefined,
      `a returned record exposed non-allowlisted fields: ${JSON.stringify(offending)}`,
      "returned records contain only allowlisted fields (subset of id, creator, businessId, updatedAt)"
    )

    // =============================================
    // CROSS-ORG ISOLATION (no leakage across businesses)
    // =============================================
    assert(
      apiKeys.every(k => k.businessId === sdk.userInfo.businessId),
      "a returned key belonged to a different business",
      "all returned keys are scoped to the admin's businessId"
    )

    // =============================================
    // ADMIN GATING (negative tests)
    // =============================================
    await async_test(
      "non-admin get_organization_api_keys is rejected (401)",
      () => otherSdk.api.api_keys.get_organization_api_keys(),
      { shouldError: true, onError: (e: any) => e.statusCode === 401 || /admin access only/i.test(e.message || '') }
    )
    await async_test(
      "non-admin delete_organization_api_key is rejected (401)",
      () => otherSdk.api.api_keys.delete_organization_api_key({ id: adminKey.id }),
      { shouldError: true, onError: (e: any) => e.statusCode === 401 || /admin access only/i.test(e.message || '') }
    )

    // confirm the gating did not delete the key
    const afterGating = await sdk.api.api_keys.get_organization_api_keys()
    assert(
      afterGating.apiKeys.some(k => k.id === adminKey.id),
      "rejected non-admin delete still removed the key",
      "rejected non-admin delete left the key intact"
    )

    // =============================================
    // ADMIN DELETE another user's key
    // =============================================
    await async_test(
      "admin delete_organization_api_key deletes another user's key",
      () => sdk.api.api_keys.delete_organization_api_key({ id: otherKeyId! }),
      { shouldError: false, onResult: () => true }
    )

    const afterDelete = await sdk.api.api_keys.get_organization_api_keys()
    assert(
      !afterDelete.apiKeys.some(k => k.id === otherKeyId),
      "deleted key still present in org-wide list",
      "deleted key no longer appears in the org-wide list"
    )
    otherKeyId = undefined // successfully deleted; nothing to clean up

    // deleting a key in a different org (fabricated id) must be a no-op for our org
    await async_test(
      "admin delete of a non-existent/cross-org key id is a safe no-op",
      () => sdk.api.api_keys.delete_organization_api_key({ id: '000000000000000000000000' }),
      { shouldError: false, onResult: () => true }
    )
    const afterNoop = await sdk.api.api_keys.get_organization_api_keys()
    assert(
      afterNoop.apiKeys.some(k => k.id === adminKey.id),
      "no-op delete removed an unrelated key",
      "no-op cross-org delete left our org's keys intact"
    )
  } finally {
    // cleanup: remove any keys we created (creator-only default delete)
    for (const id of adminKeyIds) {
      await sdk.api.api_keys.deleteOne(id).catch(() => {})
    }
    // the admin can clean up the throwaway user's key org-wide; fall through is harmless
    if (otherKeyId) {
      await sdk.api.api_keys.delete_organization_api_key({ id: otherKeyId }).catch(() => {})
    }
    if (otherUserId) {
      await sdk.api.users.deleteOne(otherUserId).catch(() => {})
    }
    if (apiKeysRoleId) {
      await sdk.api.role_based_access_permissions.deleteOne(apiKeysRoleId).catch(() => {})
    }
  }
}

// Allow running this test file independently
if (require.main === module) {
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await organization_api_keys_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Organization API keys test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Organization API keys test suite failed:", error)
      process.exit(1)
    })
}
