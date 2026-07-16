require('source-map-support').install();

import { Session } from "../../sdk"
import { log_header, async_test } from "@tellescope/testing"
import { FormResponse } from "@tellescope/types-client"
import { setup_tests } from "../setup"

const host = process.env.API_URL || "http://localhost:8080"

export const dont_sync_to_elation_form_submission_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Submit Form Response dontSyncToElation Tests")

  // Elation-note-configured form: without dontSyncToElation, submission would trigger a visit-note push
  const form = await sdk.api.forms.createOne({
    title: 'dontSyncToElation Test Form',
    isNonVisitElationNote: true,
  })
  const field = await sdk.api.form_fields.createOne({
    formId: form.id,
    type: 'string',
    title: 'Consent',
    previousFields: [{ type: 'root', info: {} }],
  })

  const enduser = await sdk.api.endusers.createOne({ fname: 'dont-sync-elation' })

  const responses = [{
    fieldId: field.id, fieldTitle: 'Consent',
    answer: { type: 'string' as const, value: 'verbal consent recorded' },
  }]

  try {
    // ── Submission with dontSyncToElation: true is accepted and recorded ──
    const { accessCode: accessCodeSkip } = await sdk.api.form_responses.prepare_form_response({
      enduserId: enduser.id, formId: form.id,
    })
    await async_test(
      "submit_form_response accepts dontSyncToElation: true",
      () => sdk.api.form_responses.submit_form_response({
        accessCode: accessCodeSkip,
        responses,
        dontSyncToElation: true,
      }),
      { onResult: ({ formResponse }: { formResponse: FormResponse }) => (
          !!formResponse.submittedAt
        && formResponse.responses?.length === 1
      )}
    )

    // ── Regression: submission without the flag still succeeds ──
    const { accessCode: accessCodeDefault } = await sdk.api.form_responses.prepare_form_response({
      enduserId: enduser.id, formId: form.id,
    })
    await async_test(
      "submit_form_response without dontSyncToElation still succeeds",
      () => sdk.api.form_responses.submit_form_response({
        accessCode: accessCodeDefault,
        responses,
      }),
      { onResult: ({ formResponse }: { formResponse: FormResponse }) => (
          !!formResponse.submittedAt
        && formResponse.responses?.length === 1
      )}
    )
  } finally {
    try { await sdk.api.endusers.deleteOne(enduser.id) } catch (err) { /* ignore */ }
    try { await sdk.api.forms.deleteOne(form.id) } catch (err) { /* ignore */ }
  }
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await dont_sync_to_elation_form_submission_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ dontSyncToElation form submission tests completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ dontSyncToElation form submission tests failed:", error)
      process.exit(1)
    })
}
