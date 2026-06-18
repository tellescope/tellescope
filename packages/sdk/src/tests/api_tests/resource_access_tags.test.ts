require('source-map-support').install();

import { Session } from "../../sdk"
import {
  async_test,
  handleAnyError,
  log_header,
  wait,
  assert,
} from "@tellescope/testing"
import { PROVIDER_PERMISSIONS } from "@tellescope/constants"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

const RAND = () => Math.random().toString(36).slice(2, 10)

const TAG_A = 'resource-access-tag-A'
const TAG_B = 'resource-access-tag-B'

/**
 * Tests for settings.users.enableResourceAccessTags (the `erat` session flag).
 *
 * When the org setting is enabled, org-level configuration resources carrying `accessTags`
 * become visible only to non-admin (Default/Assigned) users whose own tags intersect the
 * record's accessTags. This mirrors the existing enduser accessTags behavior, generalized
 * to the 9 RESOURCE_ACCESS_TAG_MODELS.
 *
 * The model is ADDITIVE: a record only becomes tag-gated once an admin sets accessTags on it.
 * Records without accessTags keep their existing rules (Default == creator-only). Admins and
 * All-access users are unaffected.
 *
 * Per the throwaway-user testing guidance, this test creates throwaway users rather than
 * mutating existing user roles. Tokens are minted via generate_auth_token AFTER the org
 * setting is enabled, so the `erat` flag lands in their sessions.
 */
export const resource_access_tags_tests = async ({ sdk } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Resource Access Tags Tests")

  const DEFAULT_RW = { create: 'Default', read: 'Default', update: 'Default', delete: 'Default' } as const
  const ALL_RW = { create: 'All', read: 'All', update: 'All', delete: 'All' } as const

  const RESOURCE_MODELS = [
    'templates', 'forms', 'journeys', 'automation_triggers', 'calendar_event_templates',
    'appointment_booking_pages', 'table_views', 'files', 'managed_content_records',
  ] as const

  // track everything we create for cleanup
  const createdUserIds: string[] = []
  const createdRoleIds: string[] = []
  const createdByModel: Record<string, string[]> = {}
  for (const m of RESOURCE_MODELS) createdByModel[m] = []
  let helperTemplateId: string | undefined // calendar_event_template used as a booking-page dependency

  const orgId = sdk.userInfo.businessId

  try {
    // ── 1. Enable the org setting ───────────────────────────────────────────────
    // Explicitly disable enduser access tags (eat) so that the tag-edit-restriction
    // assertions below prove the `erat` flag alone enforces the protection (otherwise
    // a residual `eat` could mask the gap). Settings deep-merge, so this is targeted.
    await sdk.api.organizations.updateOne(orgId, {
      settings: { users: { enableResourceAccessTags: true }, endusers: { enableAccessTags: false } },
    })

    // ── 2. Roles: Default read for a tag-gated user, All read for a control user ──
    const defaultPermissions: any = { ...PROVIDER_PERMISSIONS }
    const allPermissions: any = { ...PROVIDER_PERMISSIONS }
    for (const m of RESOURCE_MODELS) {
      defaultPermissions[m] = { ...DEFAULT_RW }
      allPermissions[m] = { ...ALL_RW }
    }

    const defaultRole = `resource-access-tags-default-${RAND()}`
    const allRole = `resource-access-tags-all-${RAND()}`
    const rbapDefault = await sdk.api.role_based_access_permissions.createOne({ role: defaultRole, permissions: defaultPermissions })
    const rbapAll = await sdk.api.role_based_access_permissions.createOne({ role: allRole, permissions: allPermissions })
    createdRoleIds.push(rbapDefault.id, rbapAll.id)

    // ── 3. Throwaway users + tokens (minted AFTER enabling the setting → erat set) ─
    const mkUser = async (tags: string[], roles: string[]) => {
      const user = await sdk.api.users.createOne({
        email: `resource-access-tags-${RAND()}@tellescope.example`,
        fname: 'Resource', lname: 'AccessTags',
        notificationEmailsDisabled: true, verifiedEmail: true,
        tags, roles,
      } as any)
      createdUserIds.push(user.id)
      // mint AFTER the setting is enabled so the erat flag lands in the session/JWT
      const { authToken, user: sessionUser } = await sdk.api.users.generate_auth_token({ id: user.id })
      const session = new Session({ host })
      session.setAuthToken(authToken)
      session.setUserInfo(sessionUser as any)
      return { session, sessionUser: sessionUser as any }
    }

    const { session: sdkWithTag, sessionUser: withTagUser } = await mkUser([TAG_A], [defaultRole]) // Default access, carries the gating tag
    const { session: sdkWithoutTag } = await mkUser([TAG_B], [defaultRole]) // Default access, lacks the gating tag
    const { session: sdkAllAccess } = await mkUser([TAG_B], [allRole])      // All access, lacks the tag (should still see everything)

    // sanity check: erat made it into the gated sessions
    assert(!!withTagUser.erat, 'erat flag missing on tagged user session', 'erat flag present on tagged user session')

    // ── 4. Per-model record creation (tagged with TAG_A + untagged control) ──────
    // calendar_event_template dependency for booking pages
    const helperTemplate = await sdk.api.calendar_event_templates.createOne({ title: `RAT helper ${RAND()}`, durationInMinutes: 30 })
    helperTemplateId = helperTemplate.id
    createdByModel['calendar_event_templates'].push(helperTemplate.id)

    const createRecord = async (model: typeof RESOURCE_MODELS[number], accessTags?: string[]): Promise<string> => {
      const tags = accessTags ? { accessTags } : {}
      let id: string
      switch (model) {
        case 'templates': {
          const r = await sdk.api.templates.createOne({ title: `RAT tmpl ${RAND()}`, subject: 's', html: '<p>x</p>', message: 'm', ...tags } as any)
          id = r.id; break
        }
        case 'forms': {
          const r = await sdk.api.forms.createOne({ title: `RAT form ${RAND()}`, ...tags } as any)
          id = r.id; break
        }
        case 'journeys': {
          const r = await sdk.api.journeys.createOne({ title: `RAT jrn ${RAND()}`, ...tags } as any)
          id = r.id; break
        }
        case 'automation_triggers': {
          const r = await sdk.api.automation_triggers.createOne({
            title: `RAT trg ${RAND()}`, status: 'Active',
            event: { type: 'Appointment Completed', info: {} },
            action: { type: 'Add Tags', info: { tags: ['x'] } },
            ...tags,
          } as any)
          id = r.id; break
        }
        case 'calendar_event_templates': {
          const r = await sdk.api.calendar_event_templates.createOne({ title: `RAT cet ${RAND()}`, durationInMinutes: 30, ...tags } as any)
          id = r.id; break
        }
        case 'appointment_booking_pages': {
          const r = await sdk.api.appointment_booking_pages.createOne({
            title: `RAT bp ${RAND()}`, calendarEventTemplateIds: [helperTemplateId!], locationIds: [], ...tags,
          } as any)
          id = r.id; break
        }
        case 'table_views': {
          const r = await sdk.api.table_views.createOne({ title: `RAT view ${RAND()}`, page: 'Ticket', columns: [], ...tags } as any)
          id = r.id; break
        }
        case 'files': {
          const { file } = await sdk.api.files.prepare_file_upload({ name: `RAT file ${RAND()}`, type: 'text/plain', size: 1 })
          if (accessTags) await sdk.api.files.updateOne(file.id, { accessTags } as any)
          id = file.id; break
        }
        case 'managed_content_records': {
          const r = await sdk.api.managed_content_records.createOne({ title: `RAT content ${RAND()}`, textContent: 't', ...tags } as any)
          id = r.id; break
        }
        default: throw new Error(`unhandled model ${model}`)
      }
      createdByModel[model].push(id)
      return id
    }

    const recordsByModel: Record<string, { taggedId: string, untaggedId: string }> = {}
    for (const model of RESOURCE_MODELS) {
      const taggedId = await createRecord(model, [TAG_A])
      const untaggedId = await createRecord(model)
      recordsByModel[model] = { taggedId, untaggedId }
    }

    // ── 5. Assertions per model ──────────────────────────────────────────────────
    const visibleIds = async (session: Session, model: string, ids: string[]): Promise<Set<string>> => {
      const records = await (session.api as any)[model].getSome({ ids, limit: 100 })
      return new Set(records.map((r: any) => r.id))
    }

    for (const model of RESOURCE_MODELS) {
      const { taggedId, untaggedId } = recordsByModel[model]
      const ids = [taggedId, untaggedId]

      const withTag = await visibleIds(sdkWithTag, model, ids)
      const withoutTag = await visibleIds(sdkWithoutTag, model, ids)
      const admin = await visibleIds(sdk, model, ids)
      const allAccess = await visibleIds(sdkAllAccess, model, ids)

      await async_test(
        `${model}: user WITH matching tag CAN read the tagged record`,
        async () => withTag.has(taggedId),
        { onResult: r => r === true },
      )
      await async_test(
        `${model}: user WITHOUT matching tag CANNOT read the tagged record`,
        async () => withoutTag.has(taggedId),
        { onResult: r => r === false },
      )
      await async_test(
        `${model}: untagged admin record NOT visible to tagged user (additive model)`,
        async () => withTag.has(untaggedId),
        { onResult: r => r === false },
      )
      await async_test(
        `${model}: untagged admin record NOT visible to untagged user (additive model)`,
        async () => withoutTag.has(untaggedId),
        { onResult: r => r === false },
      )
      await async_test(
        `${model}: admin sees both records (gating does not apply)`,
        async () => admin.has(taggedId) && admin.has(untaggedId),
        { onResult: r => r === true },
      )
      await async_test(
        `${model}: All-access user sees both records (gating does not apply)`,
        async () => allAccess.has(taggedId) && allAccess.has(untaggedId),
        { onResult: r => r === true },
      )
    }

    // ── 5b. Tag-edit restriction: a non-admin cannot edit tags to self-escalate ──
    // With erat ON and eat OFF, the users.tags edit guard must still fire — proving
    // resource access tags (not just enduser access tags) trigger the protection.
    log_header("Resource Access Tags: tag-edit blocked")
    const withTagUserId = createdUserIds[0]
    await async_test(
      `non-admin can't update own tags (erat enabled)`,
      () => sdkWithTag.api.users.updateOne(withTagUserId, { tags: ['escalate'] }),
      handleAnyError,
    )
    await async_test(
      `non-admin can't update own tags alongside other fields (erat enabled)`,
      () => sdkWithTag.api.users.updateOne(withTagUserId, { tags: ['escalate'], bio: '' }),
      handleAnyError,
    )
    await async_test(
      `non-admin can still update non-tag fields (control)`,
      () => sdkWithTag.api.users.updateOne(withTagUserId, { bio: '' }),
      { shouldError: false, onResult: () => true },
    )

    // ── 6. Org-setting-OFF control: disabling the flag gates the whole feature ────
    log_header("Resource Access Tags: org-setting-OFF control")
    await sdk.api.organizations.updateOne(orgId, {
      settings: { users: { enableResourceAccessTags: false } },
    })
    // re-mint the tagged user's token so the (now-disabled) setting is reflected in the session
    const { authToken: reAuthToken, user: reAuthUser } = await sdk.api.users.generate_auth_token({ id: createdUserIds[0] })
    const sdkWithTagOff = new Session({ host })
    sdkWithTagOff.setAuthToken(reAuthToken)
    sdkWithTagOff.setUserInfo(reAuthUser as any)
    assert(!(reAuthUser as any).erat, 'erat flag should be absent after disabling setting', 'erat flag absent after disabling setting')

    const { taggedId: templatesTaggedId } = recordsByModel['templates']
    const offVisible = await visibleIds(sdkWithTagOff, 'templates', [templatesTaggedId])
    await async_test(
      `templates: tagged record NOT visible to tagged user once setting is OFF`,
      async () => offVisible.has(templatesTaggedId),
      { onResult: r => r === false },
    )

    console.log("\n" + "=".repeat(60))
    console.log("Resource Access Tags Tests Complete")
    console.log("=".repeat(60))
  } finally {
    // ── Cleanup ────────────────────────────────────────────────────────────────
    for (const model of RESOURCE_MODELS) {
      for (const id of createdByModel[model]) {
        await (sdk.api as any)[model].deleteOne(id).catch(() => {})
      }
    }
    for (const id of createdRoleIds) {
      await sdk.api.role_based_access_permissions.deleteOne(id).catch(() => {})
    }
    for (const id of createdUserIds) {
      await sdk.api.users.deleteOne(id).catch(() => {})
    }
    // reset the org setting
    await sdk.api.organizations.updateOne(orgId, {
      settings: { users: { enableResourceAccessTags: false } },
    }).catch(() => {})
    await wait(undefined, 250)
  }
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await resource_access_tags_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Resource access tags test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Resource access tags test suite failed:", error)
      process.exit(1)
    })
}
