require('source-map-support').install();

import { Session } from "../../sdk"
import {
  async_test,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"
import { BELUGA_TITLE } from "@tellescope/constants"

const host = process.env.API_URL || 'http://localhost:8080' as const

// Manual Beluga re-sync guard tests (CU-86e1uxz1n).
//   - form_responses.push_to_EHR with target === BELUGA_TITLE
//   - files.push with destination === BELUGA_TITLE
//
// Fast / no-upload: this only verifies the bad-input / guard branches that reject before any
// Beluga call. It performs NO S3 file uploads and triggers NO actual sync (both slow and require
// live Beluga sandbox credentials). File records are created via prepare_file_upload alone — that
// inserts the DB record, which is all the guards need.
export const beluga_manual_sync_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Beluga Manual Sync Guard Tests (FormResponses & Files)")

  const errorMessage = (e: any) => (e?.message || e?.toString?.() || JSON.stringify(e)) as string

  let enduserId: string | undefined
  let belugaFormId: string | undefined
  let plainFormId: string | undefined
  const fileIds: string[] = []
  let createdBelugaIntegrationId: string | undefined

  try {
    const enduser = await sdk.api.endusers.createOne({
      fname: 'beluga-sync',
      email: `beluga_manual_sync_${Date.now()}@test.tellescope.com`,
    })
    enduserId = enduser.id

    // Beluga-configured form (belugaVisitType set) and a plain (non-Beluga) form
    const belugaForm = await sdk.api.forms.createOne({ title: 'Beluga Manual Sync Form', belugaVisitType: 'sync' })
    belugaFormId = belugaForm.id

    const plainForm = await sdk.api.forms.createOne({ title: 'Non-Beluga Manual Sync Form' })
    plainFormId = plainForm.id
    // A form needs at least one field + a matching answer to be submittable (empty responses are rejected)
    const plainField = await sdk.api.form_fields.createOne({
      formId: plainForm.id, type: 'string', title: 'Field', previousFields: [{ type: 'root', info: {} }],
    })

    const submitForm = async (formId: string) => {
      const { accessCode, response } = await sdk.api.form_responses.prepare_form_response({ enduserId: enduser.id, formId })
      await sdk.api.form_responses.submit_form_response({
        accessCode,
        responses: [{ fieldId: plainField.id, fieldTitle: 'Field', answer: { type: 'string', value: 'x' } }],
      })
      return response.id
    }

    // Create a File DB record WITHOUT uploading to S3. prepare_file_upload inserts the record and
    // returns it; skipping sdk.UPLOAD / confirm_file_upload keeps the test fast. The guards only
    // read fields off the record (formResponseId, references), so no real upload is needed.
    const createFileRecord = async (name: string) => {
      const { file } = await sdk.api.files.prepare_file_upload({
        name, type: 'text/plain', size: 1, enduserId: enduser.id,
      })
      fileIds.push(file.id)
      return file
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 1. FormResponse guards (integration-independent)
    // ──────────────────────────────────────────────────────────────────────────

    // Unsubmitted draft → rejected before any integration lookup
    const { response: draft } = await sdk.api.form_responses.prepare_form_response({ enduserId: enduser.id, formId: belugaForm.id })
    await async_test(
      "push_to_EHR(target=BELUGA) rejects an unsubmitted form response",
      () => sdk.api.form_responses.push_to_EHR({ id: draft.id, target: BELUGA_TITLE }),
      { shouldError: true, onError: (e: any) => /has not been submitted/i.test(errorMessage(e)) }
    )

    // Submitted, but the form has no belugaVisitType → rejected as not configured
    const plainResponseId = await submitForm(plainForm.id)
    await async_test(
      "push_to_EHR(target=BELUGA) rejects a form not configured for Beluga",
      () => sdk.api.form_responses.push_to_EHR({ id: plainResponseId, target: BELUGA_TITLE }),
      { shouldError: true, onError: (e: any) => /not configured for Beluga/i.test(errorMessage(e)) }
    )

    // ──────────────────────────────────────────────────────────────────────────
    // 2. files.push(destination=BELUGA) guard — the endpoint resolves the destination
    //    integration first, so a Beluga integration must exist for the branch to be reached.
    //    Create a placeholder if the org has none; skip gracefully if that's not permitted.
    // ──────────────────────────────────────────────────────────────────────────

    let belugaIntegrationAvailable = false
    try {
      const existing = await sdk.api.integrations.load_redacted({})
      belugaIntegrationAvailable = !!existing.integrations.find((i: any) => i.title === BELUGA_TITLE)
    } catch { /* load not permitted — fall through to create attempt */ }

    if (!belugaIntegrationAvailable) {
      try {
        const created = await sdk.api.integrations.createOne({
          title: BELUGA_TITLE,
          authentication: {
            type: 'oauth2',
            info: { access_token: 'test-access-token', refresh_token: 'test-refresh-token', scope: '', token_type: 'Bearer', expiry_date: new Date().getTime() },
          },
        })
        createdBelugaIntegrationId = created.id
        belugaIntegrationAvailable = true
      } catch (e) {
        console.log("Could not create a Beluga integration for testing; skipping files.push guard:", errorMessage(e))
      }
    }

    if (belugaIntegrationAvailable) {
      // A file with no associated formResponseId cannot be synced to Beluga
      const unlinkedFile = await createFileRecord('beluga-unlinked.txt')
      await async_test(
        "files.push(destination=BELUGA) rejects a file with no associated form response",
        () => sdk.api.files.push({ id: unlinkedFile.id, destination: BELUGA_TITLE }),
        { shouldError: true, onError: (e: any) => /not associated with a form response/i.test(errorMessage(e)) }
      )
    } else {
      console.log("⏭️  Skipping files.push(destination=BELUGA) guard (no Beluga integration available)")
    }
  } finally {
    for (const id of fileIds) {
      await sdk.api.files.deleteOne(id).catch(console.error)
    }
    if (belugaFormId) await sdk.api.forms.deleteOne(belugaFormId).catch(console.error)
    if (plainFormId) await sdk.api.forms.deleteOne(plainFormId).catch(console.error)
    if (enduserId) await sdk.api.endusers.deleteOne(enduserId).catch(console.error)
    if (createdBelugaIntegrationId) await sdk.api.integrations.deleteOne(createdBelugaIntegrationId).catch(console.error)
  }
}

if (require.main === module) {
  console.log(`Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await beluga_manual_sync_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Beluga manual sync test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Beluga manual sync test suite failed:", error)
      process.exit(1)
    })
}
