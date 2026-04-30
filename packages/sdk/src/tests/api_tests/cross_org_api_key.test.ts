require('source-map-support').install();

import { Session, EnduserSession } from "../../sdk"
import {
  async_test,
  handleAnyError,
  log_header,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

const CROSS_ORG_API_KEY = process.env.CROSS_ORG_API_KEY
const CROSS_ORG_TARGET_BUSINESS_ID = process.env.CROSS_ORG_TARGET_BUSINESS_ID
const CROSS_ORG_UNAPPROVED_BUSINESS_ID = process.env.CROSS_ORG_UNAPPROVED_BUSINESS_ID
const NON_ADMIN_EMAIL = process.env.NON_ADMIN_EMAIL
const NON_ADMIN_PASSWORD = process.env.NON_ADMIN_PASSWORD

export const cross_org_api_key_tests = async (
  { sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }
) => {
  log_header("Cross-Organization API Key Tests")

  if (!(CROSS_ORG_API_KEY && CROSS_ORG_TARGET_BUSINESS_ID && CROSS_ORG_UNAPPROVED_BUSINESS_ID)) {
    console.log("Skipping cross-org API key tests — env vars not set")
    return
  }

  // --- Session Setup ---
  // Session using the cross-org API key WITHOUT the org header (default behavior)
  const sdkDefault = new Session({ host, apiKey: CROSS_ORG_API_KEY })

  // Session using the cross-org API key WITH approved target org header
  const sdkCrossOrg = new Session({
    host,
    apiKey: CROSS_ORG_API_KEY,
    headers: { 'x-tellescope-organization': CROSS_ORG_TARGET_BUSINESS_ID },
  })

  // Session using the cross-org API key WITH UNAPPROVED org header
  const sdkUnapproved = new Session({
    host,
    apiKey: CROSS_ORG_API_KEY,
    headers: { 'x-tellescope-organization': CROSS_ORG_UNAPPROVED_BUSINESS_ID },
  })

  // Session with a completely invalid/nonexistent org ID
  const sdkInvalidOrg = new Session({
    host,
    apiKey: CROSS_ORG_API_KEY,
    headers: { 'x-tellescope-organization': '000000000000000000000000' },
  })

  const homeBusinessId = sdk.userInfo.businessId

  // Create a real regular API key (no approvedBusinessIds) — used across multiple test sections
  const regularApiKeyRecord = await sdk.api.api_keys.createOne({})
  const regularApiKey = (regularApiKeyRecord as any).key as string
  const sdkRegularApiKey = new Session({ host, apiKey: regularApiKey })

  try {
    // =============================================
    // AUTHORIZED ACCESS TESTS
    // =============================================

    // 1. Default behavior (no header) still works — backward compatibility
    await async_test(
      "API key without org header authenticates to home org",
      () => sdkDefault.test_authenticated(),
      { expectedResult: 'Authenticated!' }
    )

    // 2. Cross-org header with approved org works
    await async_test(
      "API key with approved org header authenticates successfully",
      () => sdkCrossOrg.test_authenticated(),
      { expectedResult: 'Authenticated!' }
    )

    // 3. Targeting own org explicitly via header (should work as a no-op)
    const sdkOwnOrgExplicit = new Session({
      host,
      apiKey: CROSS_ORG_API_KEY,
      headers: { 'x-tellescope-organization': homeBusinessId },
    })
    await async_test(
      "API key targeting its own org explicitly via header still works",
      () => sdkOwnOrgExplicit.test_authenticated(),
      { expectedResult: 'Authenticated!' }
    )

    // 4. Can read data from target org
    await async_test(
      "Can read endusers from target org",
      () => sdkCrossOrg.api.endusers.getSome(),
      { onResult: r => Array.isArray(r) }
    )

    // 5-9. Full CRUD in target org + cross-direction isolation
    let crossOrgEnduserId: string | undefined
    let homeOrgEnduserId: string | undefined
    try {
      // 5. Create in target org — verify record gets target org's businessId
      await async_test(
        "Can create enduser in target org with correct businessId",
        () => sdkCrossOrg.api.endusers.createOne({ fname: 'CrossOrgTest', lname: 'Enduser' }),
        { onResult: e => {
          crossOrgEnduserId = e.id
          return e.fname === 'CrossOrgTest' && e.businessId === CROSS_ORG_TARGET_BUSINESS_ID
        }}
      )

      // 6. Record created in target org is NOT visible from home org (data isolation)
      if (crossOrgEnduserId) {
        await async_test(
          "Cross-org record is NOT visible from home org session",
          () => sdkDefault.api.endusers.getOne(crossOrgEnduserId!),
          handleAnyError
        )
      }

      // 7. Create a record in home org and verify it's NOT visible from cross-org session
      await async_test(
        "Home org record is NOT visible from cross-org session",
        async () => {
          const homeEnduser = await sdkDefault.api.endusers.createOne({ fname: 'HomeOrgTest', lname: 'Enduser' })
          homeOrgEnduserId = homeEnduser.id
          return sdkCrossOrg.api.endusers.getOne(homeEnduser.id)
        },
        handleAnyError
      )

      // 8. Update record in target org (full CRUD — update)
      if (crossOrgEnduserId) {
        await async_test(
          "Can update enduser in target org",
          () => sdkCrossOrg.api.endusers.updateOne(crossOrgEnduserId!, { fname: 'CrossOrgUpdated' }),
          { onResult: () => true }
        )
      }

      // 9. Delete record in target org (full CRUD — delete)
      if (crossOrgEnduserId) {
        await async_test(
          "Can delete enduser in target org",
          () => sdkCrossOrg.api.endusers.deleteOne(crossOrgEnduserId!),
          { onResult: () => true }
        )
        crossOrgEnduserId = undefined // already deleted
      }
    } finally {
      if (crossOrgEnduserId) {
        await sdkCrossOrg.api.endusers.deleteOne(crossOrgEnduserId).catch(console.error)
      }
      if (homeOrgEnduserId) {
        await sdkDefault.api.endusers.deleteOne(homeOrgEnduserId).catch(console.error)
      }
    }

    // =============================================
    // UNAUTHORIZED ACCESS TESTS
    // =============================================

    // 10. Unapproved org ID is rejected
    await async_test(
      "API key with unapproved org header is rejected",
      () => sdkUnapproved.test_authenticated(),
      handleAnyError
    )

    // 11. Nonexistent org ID is rejected
    await async_test(
      "API key with nonexistent org header is rejected",
      () => sdkInvalidOrg.test_authenticated(),
      handleAnyError
    )

    // 12. Malformed (non-ObjectId) org header is rejected
    const sdkMalformedOrg = new Session({
      host,
      apiKey: CROSS_ORG_API_KEY,
      headers: { 'x-tellescope-organization': 'not-a-valid-id' },
    })
    await async_test(
      "API key with malformed org header is rejected",
      () => sdkMalformedOrg.test_authenticated(),
      handleAnyError
    )

    // 13. Empty string org header falls back to home org
    const sdkEmptyHeader = new Session({
      host,
      apiKey: CROSS_ORG_API_KEY,
      headers: { 'x-tellescope-organization': '' },
    })
    await async_test(
      "API key with empty org header falls back to home org",
      () => sdkEmptyHeader.test_authenticated(),
      { expectedResult: 'Authenticated!' }
    )

    // 14. Regular API key (no approvedBusinessIds) with org header is rejected
    const sdkRegularKeyWithHeader = new Session({
      host,
      apiKey: regularApiKey,
      headers: { 'x-tellescope-organization': CROSS_ORG_TARGET_BUSINESS_ID },
    })
    await async_test(
      "Regular API key (no approvedBusinessIds) with org header is rejected",
      () => sdkRegularKeyWithHeader.test_authenticated(),
      handleAnyError
    )

    // 15. Password-auth session with org header is rejected
    await async_test(
      "Password-auth session with org header is rejected",
      async () => {
        const sdkPasswordWithOrgHeader = new Session({
          host,
          headers: { 'x-tellescope-organization': CROSS_ORG_TARGET_BUSINESS_ID },
        })
        await sdkPasswordWithOrgHeader.authenticate(process.env.TEST_EMAIL!, process.env.TEST_PASSWORD!)
        return sdkPasswordWithOrgHeader.test_authenticated()
      },
      handleAnyError
    )

    // =============================================
    // READONLY ENFORCEMENT TESTS
    // =============================================

    // 16. approvedBusinessIds cannot be set when creating a new API key
    await async_test(
      "Cannot set approvedBusinessIds on API key creation",
      () => sdk.api.api_keys.createOne({ approvedBusinessIds: [CROSS_ORG_TARGET_BUSINESS_ID] } as any),
      handleAnyError
    )

    // 18. approvedBusinessIds cannot be set via bulk create
    await async_test(
      "Cannot set approvedBusinessIds via bulk create (createSome)",
      () => sdk.api.api_keys.createSome([{ approvedBusinessIds: [CROSS_ORG_TARGET_BUSINESS_ID] }] as any),
      handleAnyError
    )

    // 17a-c. approvedBusinessIds cannot be updated via API — all replaceObjectFields variants
    let testKeyId: string | undefined
    try {
      const newKey = await sdk.api.api_keys.createOne({})
      testKeyId = newKey.id

      await async_test(
        "Cannot update approvedBusinessIds on existing API key (no replaceObjectFields)",
        () => sdk.api.api_keys.updateOne(testKeyId!, { approvedBusinessIds: [CROSS_ORG_TARGET_BUSINESS_ID] } as any),
        handleAnyError
      )
      await async_test(
        "Cannot update approvedBusinessIds on existing API key (replaceObjectFields: false)",
        () => sdk.api.api_keys.updateOne(testKeyId!, { approvedBusinessIds: [CROSS_ORG_TARGET_BUSINESS_ID] } as any, { replaceObjectFields: false }),
        handleAnyError
      )
      await async_test(
        "Cannot update approvedBusinessIds on existing API key (replaceObjectFields: true)",
        () => sdk.api.api_keys.updateOne(testKeyId!, { approvedBusinessIds: [CROSS_ORG_TARGET_BUSINESS_ID] } as any, { replaceObjectFields: true }),
        handleAnyError
      )
    } finally {
      if (testKeyId) {
        await sdk.api.api_keys.deleteOne(testKeyId).catch(console.error)
      }
    }

    // API key listing isolation — cross-org API key must not be visible to target org sessions,
    // and target org's keys must not be visible to home org sessions
    await async_test(
      "Cross-org session cannot list home org API keys",
      () => sdkCrossOrg.api.api_keys.getSome(),
      { onResult: keys => keys.every(k => k.businessId !== homeBusinessId) }
    )
    await async_test(
      "Home org session cannot list target org API keys",
      () => sdkDefault.api.api_keys.getSome(),
      { onResult: keys => keys.every(k => k.businessId !== CROSS_ORG_TARGET_BUSINESS_ID) }
    )
    await async_test(
      "Regular API key session cannot list target org API keys",
      () => sdkRegularApiKey.api.api_keys.getSome(),
      { onResult: keys => keys.every(k => k.businessId !== CROSS_ORG_TARGET_BUSINESS_ID) }
    )

    // Direct ID lookup isolation — cross-org session cannot access home org API keys by specific ID.
    // Distinct code path from getSome: a creator-only check firing before org-scope could expose home org keys.
    await async_test(
      "Cross-org session cannot getOne a home org API key by ID",
      () => sdkCrossOrg.api.api_keys.getOne(regularApiKeyRecord.id),
      handleAnyError
    )
    await async_test(
      "Cross-org session getByIds returns no matches for a home org API key",
      () => sdkCrossOrg.api.api_keys.getByIds({ ids: [regularApiKeyRecord.id] }),
      { onResult: (r: any) => r.matches.length === 0 }
    )
    await async_test(
      "Cross-org session bulk_load contains no home org API keys",
      () => sdkCrossOrg.bulk_load({ load: [{ model: 'api_keys' }] }),
      { onResult: (r: any) => (r.results[0]?.records ?? []).every((k: any) => k.id !== regularApiKeyRecord.id) }
    )

    // Creator-only access: only the user who created an API key can read it (intra-org isolation).
    // Elevate sdkNonAdmin to Admin (full read permissions) so any test failure is clearly due to
    // creator-only enforcement, not missing role permissions.
    await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: ['Admin'] }, { replaceObjectFields: true })
    await wait(undefined, 2000) // wait for role change to propagate
    await sdkNonAdmin.authenticate(NON_ADMIN_EMAIL!, NON_ADMIN_PASSWORD!)
    const nonAdminKeyRecord = await sdkNonAdmin.api.api_keys.createOne({})
    try {
      // sdkNonAdmin (Admin) cannot read sdk's key
      await async_test(
        "Admin user cannot getOne another admin's API key",
        () => sdkNonAdmin.api.api_keys.getOne(regularApiKeyRecord.id),
        handleAnyError
      )
      await async_test(
        "Admin user getSome excludes another admin's API key",
        () => sdkNonAdmin.api.api_keys.getSome(),
        { onResult: keys => keys.every(k => k.id !== regularApiKeyRecord.id) }
      )
      await async_test(
        "Admin user getByIds returns no matches for another admin's API key",
        () => sdkNonAdmin.api.api_keys.getByIds({ ids: [regularApiKeyRecord.id] }),
        { onResult: (r: any) => r.matches.length === 0 }
      )
      await async_test(
        "Admin user bulk_load excludes another admin's API key",
        () => sdkNonAdmin.bulk_load({ load: [{ model: 'api_keys' }] }),
        { onResult: (r: any) => (r.results[0]?.records ?? []).every((k: any) => k.id !== regularApiKeyRecord.id) }
      )

      // sdk (Admin) cannot read sdkNonAdmin's key
      await async_test(
        "Admin cannot getOne a key created by a different admin user",
        () => sdk.api.api_keys.getOne(nonAdminKeyRecord.id),
        handleAnyError
      )
      await async_test(
        "Admin getSome excludes keys created by a different admin user",
        () => sdk.api.api_keys.getSome(),
        { onResult: keys => keys.every(k => k.id !== nonAdminKeyRecord.id) }
      )
      await async_test(
        "Admin getByIds returns no matches for a key created by a different admin user",
        () => sdk.api.api_keys.getByIds({ ids: [nonAdminKeyRecord.id] }),
        { onResult: (r: any) => r.matches.length === 0 }
      )
      await async_test(
        "Admin bulk_load excludes keys created by a different admin user",
        () => sdk.bulk_load({ load: [{ model: 'api_keys' }] }),
        { onResult: (r: any) => (r.results[0]?.records ?? []).every((k: any) => k.id !== nonAdminKeyRecord.id) }
      )

      // Write isolation: neither admin can mutate the other's key.
      // Use a non-empty body with a readonly field (hashedKey) so the test exercises a real payload,
      // not just an empty-object rejection.
      await async_test(
        "Admin user cannot updateOne another admin's API key",
        () => sdkNonAdmin.api.api_keys.updateOne(regularApiKeyRecord.id, { hashedKey: 'attack' } as any),
        handleAnyError
      )
      await async_test(
        "Admin user cannot deleteOne another admin's API key",
        () => sdkNonAdmin.api.api_keys.deleteOne(regularApiKeyRecord.id),
        handleAnyError
      )
      await async_test(
        "Admin cannot updateOne a key created by a different admin user",
        () => sdk.api.api_keys.updateOne(nonAdminKeyRecord.id, { hashedKey: 'attack' } as any),
        handleAnyError
      )
      await async_test(
        "Admin cannot deleteOne a key created by a different admin user",
        () => sdk.api.api_keys.deleteOne(nonAdminKeyRecord.id),
        handleAnyError
      )
    } finally {
      await sdkNonAdmin.api.api_keys.deleteOne(nonAdminKeyRecord.id).catch(console.error)
      // Restore sdkNonAdmin to Non-Admin and reauthenticate so subsequent tests are unaffected
      await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: ['Non-Admin'] }, { replaceObjectFields: true })
      await wait(undefined, 1000)
      await sdkNonAdmin.authenticate(NON_ADMIN_EMAIL!, NON_ADMIN_PASSWORD!)
    }

    // =============================================
    // MULTI-TENANT DATA ISOLATION TESTS
    // =============================================

    const isolationIds: { id: string, inTargetOrg: boolean }[] = []
    try {
      // Create one enduser in each org to test isolation against
      const targetOrgEnduser = await sdkCrossOrg.api.endusers.createOne({ fname: 'IsolationTest', lname: 'TargetOrg' })
      isolationIds.push({ id: targetOrgEnduser.id, inTargetOrg: true })

      const homeOrgEnduser = await sdkDefault.api.endusers.createOne({ fname: 'IsolationTest', lname: 'HomeOrg' })
      isolationIds.push({ id: homeOrgEnduser.id, inTargetOrg: false })

      // --- getOne isolation ---

      // 18. Password-auth session cannot getOne a record from another org by ID
      await async_test(
        "Password-auth session cannot getOne a target org record by ID",
        () => sdk.api.endusers.getOne(targetOrgEnduser.id),
        handleAnyError
      )

      // 19. Regular API key session cannot getOne a record from another org by ID
      await async_test(
        "Regular API key session cannot getOne a target org record by ID",
        () => sdkRegularApiKey.api.endusers.getOne(targetOrgEnduser.id),
        handleAnyError
      )

      // 20. Cross-org session cannot getOne a home org record by ID (reverse direction)
      await async_test(
        "Cross-org session cannot getOne a home org record by ID",
        () => sdkCrossOrg.api.endusers.getOne(homeOrgEnduser.id),
        handleAnyError
      )

      // --- getSome isolation ---

      // 21. getSome from home org (password-auth) never returns records belonging to the target org
      await async_test(
        "Password-auth session getSome contains no target org records",
        () => sdk.api.endusers.getSome(),
        { onResult: endusers =>
            endusers.every(e => e.businessId !== CROSS_ORG_TARGET_BUSINESS_ID && e.id !== targetOrgEnduser.id)
        }
      )

      // 22. getSome via regular API key never returns records belonging to the target org
      await async_test(
        "Regular API key getSome contains no target org records",
        () => sdkRegularApiKey.api.endusers.getSome(),
        { onResult: endusers =>
            endusers.every(e => e.businessId !== CROSS_ORG_TARGET_BUSINESS_ID && e.id !== targetOrgEnduser.id)
        }
      )

      // 23. getSome from target org session never returns records belonging to the home org
      await async_test(
        "Cross-org session getSome contains no home org records",
        () => sdkCrossOrg.api.endusers.getSome(),
        { onResult: endusers =>
            endusers.every(e => e.businessId !== homeBusinessId && e.id !== homeOrgEnduser.id)
        }
      )

      // --- getSome filter injection ---

      // 24. Passing an explicit businessId filter cannot expose cross-tenant records
      await async_test(
        "Regular API key getSome with explicit businessId filter cannot expose target org records",
        () => sdkRegularApiKey.api.endusers.getSome({ filter: { businessId: CROSS_ORG_TARGET_BUSINESS_ID } } as any),
        { onResult: endusers =>
            endusers.every(e => e.businessId !== CROSS_ORG_TARGET_BUSINESS_ID && e.id !== targetOrgEnduser.id)
        }
      )

      // 25. Cross-org session cannot use businessId filter to expose home org records
      await async_test(
        "Cross-org session getSome with explicit businessId filter cannot expose home org records",
        () => sdkCrossOrg.api.endusers.getSome({ filter: { businessId: homeBusinessId } } as any),
        { onResult: endusers =>
            endusers.every(e => e.businessId !== homeBusinessId && e.id !== homeOrgEnduser.id)
        }
      )

      // --- getByIds isolation ---
      await async_test(
        "Password-auth session getByIds returns no matches for target org record",
        () => sdk.api.endusers.getByIds({ ids: [targetOrgEnduser.id] }),
        { onResult: (r: any) => r.matches.length === 0 }
      )
      await async_test(
        "Regular API key session getByIds returns no matches for target org record",
        () => sdkRegularApiKey.api.endusers.getByIds({ ids: [targetOrgEnduser.id] }),
        { onResult: (r: any) => r.matches.length === 0 }
      )
      await async_test(
        "Cross-org session getByIds returns no matches for home org record",
        () => sdkCrossOrg.api.endusers.getByIds({ ids: [homeOrgEnduser.id] }),
        { onResult: (r: any) => r.matches.length === 0 }
      )

      // --- bulk_load isolation ---
      await async_test(
        "Password-auth session bulk_load contains no target org endusers",
        () => sdk.bulk_load({ load: [{ model: 'endusers' }] }),
        { onResult: (r: any) => (r.results[0]?.records ?? []).every((e: any) => e.id !== targetOrgEnduser.id) }
      )
      await async_test(
        "Regular API key session bulk_load contains no target org endusers",
        () => sdkRegularApiKey.bulk_load({ load: [{ model: 'endusers' }] }),
        { onResult: (r: any) => (r.results[0]?.records ?? []).every((e: any) => e.id !== targetOrgEnduser.id) }
      )
      await async_test(
        "Cross-org session bulk_load contains no home org endusers",
        () => sdkCrossOrg.bulk_load({ load: [{ model: 'endusers' }] }),
        { onResult: (r: any) => (r.results[0]?.records ?? []).every((e: any) => e.id !== homeOrgEnduser.id) }
      )

      // --- updateOne isolation ---

      // 26. Password-auth session cannot updateOne a record from another org
      await async_test(
        "Password-auth session cannot updateOne a target org record",
        () => sdk.api.endusers.updateOne(targetOrgEnduser.id, { fname: 'ShouldNotUpdate' }),
        handleAnyError
      )

      // 27. Regular API key session cannot updateOne a record from another org
      await async_test(
        "Regular API key session cannot updateOne a target org record",
        () => sdkRegularApiKey.api.endusers.updateOne(targetOrgEnduser.id, { fname: 'ShouldNotUpdate' }),
        handleAnyError
      )

      // 28. Cross-org session cannot updateOne a home org record
      await async_test(
        "Cross-org session cannot updateOne a home org record",
        () => sdkCrossOrg.api.endusers.updateOne(homeOrgEnduser.id, { fname: 'ShouldNotUpdate' }),
        handleAnyError
      )

      // --- deleteOne isolation ---
      // Records still exist at this point (prior deletes should have failed);
      // cleanup in finally handles actual deletion via the correct sessions

      // 29. Password-auth session cannot deleteOne a record from another org
      await async_test(
        "Password-auth session cannot deleteOne a target org record",
        () => sdk.api.endusers.deleteOne(targetOrgEnduser.id),
        handleAnyError
      )

      // 30. Regular API key session cannot deleteOne a record from another org
      await async_test(
        "Regular API key session cannot deleteOne a target org record",
        () => sdkRegularApiKey.api.endusers.deleteOne(targetOrgEnduser.id),
        handleAnyError
      )

      // 31. Cross-org session cannot deleteOne a home org record
      await async_test(
        "Cross-org session cannot deleteOne a home org record",
        () => sdkCrossOrg.api.endusers.deleteOne(homeOrgEnduser.id),
        handleAnyError
      )

      // --- businessId spoofing on create ---

      // 32. Cross-org session cannot plant a record in the home org by passing an explicit businessId
      await async_test(
        "Cross-org create with explicit home org businessId is rejected",
        () => sdkCrossOrg.api.endusers.createOne({ fname: 'SpoofTest', lname: 'CrossOrg', businessId: homeBusinessId } as any),
        handleAnyError
      )

      // 33. Home org session cannot plant a record in the target org by passing an explicit businessId
      await async_test(
        "Home org create with explicit target org businessId is rejected",
        () => sdkDefault.api.endusers.createOne({ fname: 'SpoofTest', lname: 'HomeOrg', businessId: CROSS_ORG_TARGET_BUSINESS_ID } as any),
        handleAnyError
      )

    } finally {
      for (const { id, inTargetOrg } of isolationIds) {
        const session = inTargetOrg ? sdkCrossOrg : sdkDefault
        await session.api.endusers.deleteOne(id).catch(console.error)
      }
    }

    // =============================================
    // ENDUSER SESSION TESTS
    // =============================================

    // 34. EnduserSession with org header is rejected
    await async_test(
      "EnduserSession with org header is rejected",
      () => (new EnduserSession({
        host,
        businessId: homeBusinessId,
        cacheKey: 'cross_org_test_enduser', // unique key — avoids stomping on main suite's enduser session cache
        headers: { 'x-tellescope-organization': CROSS_ORG_TARGET_BUSINESS_ID },
      })).test_authenticated(),
      handleAnyError
    )

    // =============================================
    // USERS (STAFF) RESOURCE ISOLATION TESTS
    // =============================================

    // 35. Cross-org session getSome users contains no home org users
    await async_test(
      "Cross-org session getSome users contains no home org users",
      () => sdkCrossOrg.api.users.getSome(),
      { onResult: users => users.every(u => u.businessId !== homeBusinessId) }
    )

    // 36. Regular API key getSome users contains no target org users
    await async_test(
      "Regular API key getSome users contains no target org users",
      () => sdkRegularApiKey.api.users.getSome(),
      { onResult: users => users.every(u => u.businessId !== CROSS_ORG_TARGET_BUSINESS_ID) }
    )

    // =============================================
    // CREATOR FIELD BEHAVIOR (CROSS-ORG)
    // =============================================

    // 37. Record created via cross-org session has creator set to home org user, not a target org user
    let creatorTestId: string | undefined
    try {
      await async_test(
        "Cross-org created record has a creator from the home org, not the target org",
        async () => {
          const created = await sdkCrossOrg.api.endusers.createOne({ fname: 'CreatorTest', lname: 'CrossOrg' })
          creatorTestId = created.id
          const targetOrgUserIds = new Set((await sdkCrossOrg.api.users.getSome()).map(u => u.id))
          return created.creator !== undefined && !targetOrgUserIds.has(created.creator)
        },
        { onResult: r => r === true }
      )
    } finally {
      if (creatorTestId) {
        await sdkCrossOrg.api.endusers.deleteOne(creatorTestId).catch(console.error)
      }
    }

  } finally {
    await sdk.api.api_keys.deleteOne(regularApiKeyRecord.id).catch(console.error)
  }
}

// Allow running independently
if (require.main === module) {
  console.log(`Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await cross_org_api_key_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("Cross-org API key test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Cross-org API key test suite failed:", error)
      process.exit(1)
    })
}
