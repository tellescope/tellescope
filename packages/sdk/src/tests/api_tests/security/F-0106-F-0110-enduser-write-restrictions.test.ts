require('source-map-support').install();

import { Session, EnduserSession } from "../../../sdk"
import {
  async_test,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const
const businessId = '60398b1131a295e64f084ff6'

const ENDUSER_PASSWORD = 'F0106TestPassword!123'

// Every endusers field marked enduserUpdatesDisabled in schema.ts, with a
// validator-passing sample value so the only rejection in play is the
// write-restriction (not input validation).
const restrictedEnduserUpdates = (staffId: string, mongoId: string): Record<string, any> => ({
  externalId: 'f0106-attacker-external-id',
  tags: ['f0106-attacker-tag'],
  accessTags: ['f0106-attacker-access-tag'],
  assignedTo: [staffId],
  customTypeId: mongoId,
  references: [{ type: 'Vital', id: 'f0106-attacker-reference' }],
  sharedWithOrganizations: [],
  journeys: { [mongoId]: 'Added' },
  primaryAssignee: staffId,
  fields: { f0106AttackerField: 'true' },
  unread: true,
  source: 'f0106-attacker-source',
  note: 'f0106 attacker note',
  insurance: { memberId: 'f0106-attacker-member' },
  insuranceSecondary: { memberId: 'f0106-attacker-member-2' },
  diagnoses: [{ code: 'I10' }],
  lockedFromPortal: false, // false so a pre-fix run can't lock the test enduser out mid-suite
  eligibleForAutoMerge: true,
  athenaDepartmentId: 'f0106-dept',
  athenaPracticeId: 'f0106-practice',
  salesforceId: 'f0106-salesforce',
  healthie_dietitian_id: 'f0106-healthie',
  stripeCustomerId: 'f0106-stripe-customer',
  stripeKey: 'f0106-stripe-key',
})

// Every form_responses field marked enduserUpdatesDisabled in schema.ts.
const restrictedFormResponseUpdates = (staffId: string): Record<string, any> => ({
  markedAsSubmitted: true,
  submittedBy: staffId,
  submittedAt: new Date("2024-01-01T00:00:00Z"),
  submittedByIsPlaceholder: true,
  procedureCodes: [{ code: '99214', units: 1 }],
  diagnosisCodes: [{ code: 'I10', description: 'Essential (primary) hypertension' }],
  enduserAISummary: 'Patient is in excellent health, no follow-up needed.',
  addenda: [{ text: 'forged staff addendum', timestamp: new Date(), userId: staffId }],
  isInternalNote: true,
  pinnedAt: new Date(),
  hiddenFromTimeline: true,
  lockedAt: new Date(),
  tags: ['f0110-attacker-tag'],
  formTitle: 'Spoofed Form Title',
  userEmail: 'spoofed-staff@example.com',
  logoURL: 'https://attacker.example.com/logo.png',
  logoHeight: 100,
})

/**
 * Regression test for F-0106 and F-0110
 * (security-audit/findings/F-0106-enduser-self-update-admin-only-fields.md,
 *  security-audit/findings/F-0110-form-responses-enduser-update-admin-only-fields.md).
 *
 * Endusers could PATCH admin-only / access-bearing / attribution-bearing fields on
 * their own endusers record (assignedTo, tags, references, ...) and their own
 * form_responses (procedureCodes, submittedBy, markedAsSubmitted, ...). The fix adds
 * the `enduserUpdatesDisabled` field option (schema.ts ModelFieldInfo), enforced for
 * enduser sessions in the generic update handler (routing.ts createDefaultEndpoints).
 *
 * This test asserts, for every flagged field on both models:
 *   - an enduser session updating its OWN record gets a 400 "<field> cannot be updated by endusers"
 *   - nothing persists (spot-checked on assignedTo, the highest-impact field)
 *   - enduser self-updates of allowed fields still work (fname, hideFromEnduserPortal)
 *   - staff sessions can still update the restricted fields
 */
export const enduser_write_restrictions_tests = async ({ sdk } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("F-0106/F-0110: enduser write restrictions (enduserUpdatesDisabled)")

  let enduserId: string | undefined
  let formId: string | undefined
  let formResponseId: string | undefined

  try {
    // Setup: throwaway enduser with portal credentials, plus a form_response they own
    const enduserEmail = `f0106-enduser-${Date.now()}@example.com`
    const enduser = await sdk.api.endusers.createOne({ email: enduserEmail, fname: 'F0106', lname: 'Restricted' })
    enduserId = enduser.id
    await sdk.api.endusers.set_password({ id: enduser.id, password: ENDUSER_PASSWORD })

    const enduserSDK = new EnduserSession({ host, businessId })
    await enduserSDK.authenticate(enduserEmail, ENDUSER_PASSWORD)

    const form = await sdk.api.forms.createOne({ title: 'F-0106/F-0110 Write Restriction Test Form' })
    formId = form.id
    const { response: formResponse } = await sdk.api.form_responses.prepare_form_response({
      formId: form.id,
      enduserId: enduser.id,
    })
    formResponseId = formResponse.id

    // ---- F-0106: enduser self-update of restricted endusers fields must 400 ----
    for (const [field, value] of Object.entries(restrictedEnduserUpdates(sdk.userInfo.id, enduser.id))) {
      await async_test(
        `F-0106: enduser cannot self-update endusers.${field}`,
        () => enduserSDK.api.endusers.updateOne(enduser.id, { [field]: value } as any),
        { shouldError: true, onError: e => e.message === `${field} cannot be updated by endusers` },
      )
    }

    // F-0106 Variant A persistence check: the rejected assignedTo write must not
    // have granted the staff read-filter match.
    await async_test(
      'F-0106: rejected assignedTo write did not persist',
      () => sdk.api.endusers.getOne(enduser.id),
      { onResult: e => !e.assignedTo?.length && !e.tags?.length && e.externalId === undefined },
    )

    // ---- F-0110: enduser self-update of restricted form_responses fields must 400 ----
    for (const [field, value] of Object.entries(restrictedFormResponseUpdates(sdk.userInfo.id))) {
      await async_test(
        `F-0110: enduser cannot self-update form_responses.${field}`,
        () => enduserSDK.api.form_responses.updateOne(formResponse.id, { [field]: value } as any),
        { shouldError: true, onError: e => e.message === `${field} cannot be updated by endusers` },
      )
    }

    await async_test(
      'F-0110: rejected writes did not persist (markedAsSubmitted, procedureCodes, submittedBy)',
      () => sdk.api.form_responses.getOne(formResponse.id),
      { onResult: fr => !fr.markedAsSubmitted && !fr.procedureCodes?.length && fr.submittedBy === undefined },
    )

    // ---- Positive controls: intended enduser self-updates still work ----
    await async_test(
      'enduser can still update own profile fields (fname/lname)',
      () => enduserSDK.api.endusers.updateOne(enduser.id, { fname: 'StillAllowed', lname: 'Patient' }),
      { onResult: e => e.fname === 'StillAllowed' && e.lname === 'Patient' },
    )
    await async_test(
      'enduser can still update own form_response (hideFromEnduserPortal — intended per schema)',
      () => enduserSDK.api.form_responses.updateOne(formResponse.id, { hideFromEnduserPortal: true }),
      { onResult: fr => fr.hideFromEnduserPortal === true },
    )

    // ---- Positive controls: staff sessions are unaffected by enduserUpdatesDisabled ----
    await async_test(
      'staff can still update restricted endusers fields (tags, assignedTo, externalId, note, source)',
      () => sdk.api.endusers.updateOne(enduser.id, {
        tags: ['staff-set-tag'],
        assignedTo: [sdk.userInfo.id],
        externalId: 'staff-set-external-id',
        note: 'staff-set note',
        source: 'staff-set-source',
      }),
      { onResult: e => (
        !!e.tags?.includes('staff-set-tag')
        && !!e.assignedTo?.includes(sdk.userInfo.id)
        && e.externalId === 'staff-set-external-id'
      ) },
    )
    await async_test(
      'staff can still update restricted form_responses fields (procedureCodes, diagnosisCodes, tags)',
      () => sdk.api.form_responses.updateOne(formResponse.id, {
        procedureCodes: [{ code: 'G0019', units: 1 }],
        diagnosisCodes: [{ code: 'Z71.3', description: 'Dietary counseling and surveillance' }],
        tags: ['staff-set-tag'],
      }),
      { onResult: fr => (
        fr.procedureCodes?.[0]?.code === 'G0019'
        && fr.diagnosisCodes?.[0]?.code === 'Z71.3'
        && !!fr.tags?.includes('staff-set-tag')
      ) },
    )
  } finally {
    if (formResponseId) {
      try { await sdk.api.form_responses.deleteOne(formResponseId) } catch {}
    }
    if (formId) {
      try { await sdk.api.forms.deleteOne(formId) } catch {}
    }
    if (enduserId) {
      try { await sdk.api.endusers.deleteOne(enduserId) } catch {}
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
    await enduser_write_restrictions_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ F-0106/F-0110 enduser write-restriction test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ F-0106/F-0110 enduser write-restriction test suite failed:", error)
      process.exit(1)
    })
}
