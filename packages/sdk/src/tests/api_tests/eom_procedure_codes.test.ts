require('source-map-support').install();

import { Session } from "../../sdk"
import { async_test, log_header } from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

const sampleProcedureCodes = [
  {
    code: 'G0019',
    units: 1,
    feeCents: 12000,
    modifiers: ['25'],
  },
  {
    code: 'G0022',
    units: 0,
  },
]

const sampleDiagnosisCodes = [
  { code: 'Z71.3', description: 'Dietary counseling and surveillance' },
]

export const eom_procedure_codes_tests = async ({ sdk } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("EOM FormResponse Procedure Codes Tests")

  const enduser = await sdk.api.endusers.createOne({ fname: 'EOM', lname: 'Test' })
  const createdFormIds: string[] = []
  const createdFormResponseIds: string[] = []

  try {
    // Bootstrap a base FormResponse via prepare_form_response (bypasses the
    // form_responses.createOne path that requires non-empty responses).
    const baseForm = await sdk.api.forms.createOne({ title: 'EOM Procedure Codes Base Form' })
    createdFormIds.push(baseForm.id)
    const { response: formResponse } = await sdk.api.form_responses.prepare_form_response({
      formId: baseForm.id,
      enduserId: enduser.id,
    })
    createdFormResponseIds.push(formResponse.id)

    // ---------- FormResponse-level field tests (existing behavior) ----------
    await async_test(
      'updateOne accepts procedureCodes and diagnosisCodes on FormResponse',
      () => sdk.api.form_responses.updateOne(formResponse.id, {
        procedureCodes: sampleProcedureCodes,
        diagnosisCodes: sampleDiagnosisCodes,
      }),
      { onResult: r => !!r && Array.isArray(r.procedureCodes) && r.procedureCodes.length === 2 && Array.isArray(r.diagnosisCodes) && r.diagnosisCodes.length === 1 }
    )

    await async_test(
      'getOne returns persisted procedureCodes/diagnosisCodes',
      () => sdk.api.form_responses.getOne(formResponse.id),
      { onResult: r => (
        r.procedureCodes?.[0]?.code === 'G0019'
        && r.procedureCodes?.[0]?.units === 1
        && r.procedureCodes?.[0]?.feeCents === 12000
        && r.procedureCodes?.[1]?.code === 'G0022'
        && r.procedureCodes?.[1]?.units === 0
        && r.diagnosisCodes?.[0]?.code === 'Z71.3'
      ) }
    )

    await async_test(
      'updateOne rejects FormResponse procedureCode with non-string code',
      () => sdk.api.form_responses.updateOne(formResponse.id, {
        procedureCodes: [{ code: 12345 as any, units: 1 }],
      }),
      { shouldError: true, onError: () => true }
    )

    await async_test(
      'updateOne rejects FormResponse procedureCode with negative units',
      () => sdk.api.form_responses.updateOne(formResponse.id, {
        procedureCodes: [{ code: 'G0019', units: -1 }],
      }),
      { shouldError: true, onError: () => true }
    )

    await async_test(
      'updateOne rejects FormResponse diagnosisCode with non-string code',
      () => sdk.api.form_responses.updateOne(formResponse.id, {
        diagnosisCodes: [{ code: 12345 as any }],
      }),
      { shouldError: true, onError: () => true }
    )

    await async_test(
      'updateOne can clear procedureCodes/diagnosisCodes with empty arrays via replaceObjectFields',
      () => sdk.api.form_responses.updateOne(formResponse.id, {
        procedureCodes: [],
        diagnosisCodes: [],
      }, { replaceObjectFields: true }),
      { onResult: r => (
        Array.isArray(r.procedureCodes) && r.procedureCodes.length === 0
        && Array.isArray(r.diagnosisCodes) && r.diagnosisCodes.length === 0
      ) }
    )

    // ---------- Form-level field validators ----------
    await async_test(
      'forms.createOne accepts valid procedureCodes/diagnosisCodes',
      () => sdk.api.forms.createOne({
        title: 'EOM Procedure Codes Form (valid codes)',
        procedureCodes: sampleProcedureCodes,
        diagnosisCodes: sampleDiagnosisCodes,
      }),
      { onResult: f => {
        createdFormIds.push(f.id)
        return f.procedureCodes?.length === 2
          && f.procedureCodes?.[0]?.code === 'G0019'
          && f.diagnosisCodes?.[0]?.code === 'Z71.3'
      } }
    )

    await async_test(
      'forms.createOne rejects procedureCode with non-string code',
      () => sdk.api.forms.createOne({
        title: 'EOM Bad Form',
        procedureCodes: [{ code: 12345 as any, units: 1 }],
      }),
      { shouldError: true, onError: () => true }
    )

    await async_test(
      'forms.createOne rejects procedureCode with negative units',
      () => sdk.api.forms.createOne({
        title: 'EOM Bad Form',
        procedureCodes: [{ code: 'G0019', units: -1 }],
      }),
      { shouldError: true, onError: () => true }
    )

    await async_test(
      'forms.createOne rejects diagnosisCode with non-string code',
      () => sdk.api.forms.createOne({
        title: 'EOM Bad Form',
        diagnosisCodes: [{ code: 12345 as any }],
      }),
      { shouldError: true, onError: () => true }
    )

    // ---------- prepare_form_response copy-on-prepare from Form ----------
    const formWithCodes = await sdk.api.forms.createOne({
      title: 'EOM Procedure Codes Form (with codes)',
      procedureCodes: sampleProcedureCodes,
      diagnosisCodes: sampleDiagnosisCodes,
    })
    createdFormIds.push(formWithCodes.id)

    let preparedFromFormResponseId = ''
    await async_test(
      'prepare_form_response copies procedureCodes/diagnosisCodes from Form when no args',
      () => sdk.api.form_responses.prepare_form_response({
        formId: formWithCodes.id,
        enduserId: enduser.id,
      }),
      { onResult: r => {
        preparedFromFormResponseId = r.response.id
        createdFormResponseIds.push(r.response.id)
        return r.response.procedureCodes?.length === 2
          && r.response.procedureCodes?.[0]?.code === 'G0019'
          && r.response.diagnosisCodes?.[0]?.code === 'Z71.3'
      } }
    )

    await async_test(
      'persisted FormResponse retains Form codes after prepare',
      () => sdk.api.form_responses.getOne(preparedFromFormResponseId),
      { onResult: r => (
        r.procedureCodes?.length === 2
        && r.procedureCodes?.[0]?.code === 'G0019'
        && r.diagnosisCodes?.[0]?.code === 'Z71.3'
      ) }
    )

    // ---------- prepare args override Form defaults ----------
    const overrideProcedureCodes = [{ code: '99213', units: 1 }]
    const overrideDiagnosisCodes = [{ code: 'E11.9', description: 'Type 2 diabetes' }]

    let overridePreparedResponseId = ''
    await async_test(
      'prepare_form_response args override Form defaults',
      () => sdk.api.form_responses.prepare_form_response({
        formId: formWithCodes.id,
        enduserId: enduser.id,
        procedureCodes: overrideProcedureCodes,
        diagnosisCodes: overrideDiagnosisCodes,
      }),
      { onResult: r => {
        overridePreparedResponseId = r.response.id
        createdFormResponseIds.push(r.response.id)
        return r.response.procedureCodes?.length === 1
          && r.response.procedureCodes?.[0]?.code === '99213'
          && r.response.diagnosisCodes?.length === 1
          && r.response.diagnosisCodes?.[0]?.code === 'E11.9'
      } }
    )

    await async_test(
      'persisted overridden FormResponse retains override codes',
      () => sdk.api.form_responses.getOne(overridePreparedResponseId),
      { onResult: r => (
        r.procedureCodes?.[0]?.code === '99213'
        && r.diagnosisCodes?.[0]?.code === 'E11.9'
      ) }
    )

    // ---------- prepare with no Form defaults ----------
    const formWithoutCodes = await sdk.api.forms.createOne({
      title: 'EOM Procedure Codes Form (no codes)',
    })
    createdFormIds.push(formWithoutCodes.id)

    await async_test(
      'prepare_form_response with args on a Form lacking codes uses the args',
      () => sdk.api.form_responses.prepare_form_response({
        formId: formWithoutCodes.id,
        enduserId: enduser.id,
        procedureCodes: overrideProcedureCodes,
        diagnosisCodes: overrideDiagnosisCodes,
      }),
      { onResult: r => {
        createdFormResponseIds.push(r.response.id)
        return r.response.procedureCodes?.[0]?.code === '99213'
          && r.response.diagnosisCodes?.[0]?.code === 'E11.9'
      } }
    )

    // ---------- prepare with no defaults and no args yields no codes ----------
    await async_test(
      'prepare_form_response with no codes anywhere produces FormResponse without codes',
      () => sdk.api.form_responses.prepare_form_response({
        formId: formWithoutCodes.id,
        enduserId: enduser.id,
      }),
      { onResult: r => {
        createdFormResponseIds.push(r.response.id)
        return !r.response.procedureCodes && !r.response.diagnosisCodes
      } }
    )

    // ---------- prepare rejects bad code shapes ----------
    await async_test(
      'prepare_form_response rejects procedureCode with non-string code',
      () => sdk.api.form_responses.prepare_form_response({
        formId: formWithoutCodes.id,
        enduserId: enduser.id,
        procedureCodes: [{ code: 12345 as any, units: 1 }],
      }),
      { shouldError: true, onError: () => true }
    )

    await async_test(
      'prepare_form_response rejects procedureCode with negative units',
      () => sdk.api.form_responses.prepare_form_response({
        formId: formWithoutCodes.id,
        enduserId: enduser.id,
        procedureCodes: [{ code: 'G0019', units: -1 }],
      }),
      { shouldError: true, onError: () => true }
    )
  } finally {
    for (const id of createdFormResponseIds) {
      await sdk.api.form_responses.deleteOne(id).catch(() => {})
    }
    for (const id of createdFormIds) {
      await sdk.api.forms.deleteOne(id).catch(() => {})
    }
    await sdk.api.endusers.deleteOne(enduser.id).catch(() => {})
  }
}

if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await eom_procedure_codes_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ EOM procedure codes test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ EOM procedure codes test suite failed:", error)
      process.exit(1)
    })
}
