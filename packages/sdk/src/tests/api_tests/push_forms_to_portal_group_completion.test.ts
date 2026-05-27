require('source-map-support').install();

import { Session, EnduserSession } from "../../sdk"
import { log_header, wait, async_test } from "@tellescope/testing"
import { Enduser } from "@tellescope/types-client"
import { setup_tests } from "../setup"

const host = process.env.API_URL || "http://localhost:8080"

const pollFor = async <T>(
  fetchFn: () => Promise<T | undefined>,
  evaluateFn: (result: T | undefined) => result is T,
  description: string,
  intervalMs = 500,
  maxIterations = 30,
): Promise<T> => {
  let lastResult: T | undefined
  for (let i = 0; i < maxIterations; i++) {
    await wait(undefined, intervalMs)
    lastResult = await fetchFn()
    if (evaluateFn(lastResult)) return lastResult
  }
  throw new Error(`Polling timeout: ${description} - waited ${maxIterations * intervalMs}ms`)
}

export const push_forms_to_portal_group_completion_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Push Forms To Portal - Form Group Completed Trigger Tests")

  const createdEnduserIds: string[] = []
  const createdJourneyIds: string[] = []
  const createdFormIds: string[] = []
  const createdFormGroupIds: string[] = []
  const createdTriggerIds: string[] = []

  try {
    // 1. Create two forms, each with a single text field
    const formA = await sdk.api.forms.createOne({ title: 'Push To Portal Form A' })
    createdFormIds.push(formA.id)
    const fieldA = await sdk.api.form_fields.createOne({
      formId: formA.id,
      type: 'string',
      title: 'FieldA',
      previousFields: [{ type: 'root', info: {} }],
    })

    const formB = await sdk.api.forms.createOne({ title: 'Push To Portal Form B' })
    createdFormIds.push(formB.id)
    const fieldB = await sdk.api.form_fields.createOne({
      formId: formB.id,
      type: 'string',
      title: 'FieldB',
      previousFields: [{ type: 'root', info: {} }],
    })

    // 2. Create a form group containing both forms (shared across both submission flows)
    const formGroup = await sdk.api.form_groups.createOne({
      title: 'Push To Portal Test Group',
      formIds: [formA.id, formB.id],
    })
    createdFormGroupIds.push(formGroup.id)

    // Helper: run the full push-to-portal → submit → trigger flow with a configurable submitter.
    // Each invocation creates its own trigger/journey/step/enduser and asserts its own tag.
    // We test both the admin (user-session) submitter and the enduser (portal-session) submitter
    // because they exercise different DB scopes in submit_form_response — and the regression QA caught
    // was only triggered on the enduser-session path.
    const runFlow = async ({ label, tag, submitAsEnduser } : { label: string, tag: string, submitAsEnduser: boolean }) => {
      const trigger = await sdk.api.automation_triggers.createOne({
        event: { type: 'Form Group Completed', info: { groupId: formGroup.id } },
        action: { type: 'Add Tags', info: { tags: [tag] } },
        status: 'Active',
        title: `Form Group Completed - Push to Portal (${label})`,
      })
      createdTriggerIds.push(trigger.id)

      const journey = await sdk.api.journeys.createOne({
        title: `Push To Portal Trigger Journey (${label})`,
      })
      createdJourneyIds.push(journey.id)

      const pushStep = await sdk.api.automation_steps.createOne({
        journeyId: journey.id,
        action: { type: 'pushFormsToPortal', info: { formGroupIds: [formGroup.id] } },
        events: [{ type: 'onJourneyStart', info: {} }],
      })

      const enduser = await sdk.api.endusers.createOne({ fname: 'PushPortal', lname: label })
      createdEnduserIds.push(enduser.id)

      await sdk.api.endusers.add_to_journey({
        enduserIds: [enduser.id],
        journeyId: journey.id,
      })

      const pushedResponses = await pollFor(
        async () => {
          const responses = await sdk.api.form_responses.getSome({
            filter: { enduserId: enduser.id },
          })
          const pushed = responses.filter(r => !!r.pushedToPortalAt)
          return pushed.length >= 2 ? pushed : undefined
        },
        (result): result is any[] => Array.isArray(result) && result.length >= 2,
        `pushed-to-portal form_responses to be created by worker (${label})`,
        500,
        40,
      )

      for (const fr of pushedResponses) {
        if (!fr.pushedToPortalAt) {
          throw new Error(`Expected pushedToPortalAt to be set on form_response ${fr.id} (${label})`)
        }
        if (fr.groupId !== pushStep.id) {
          throw new Error(`Expected form_response.groupId (${fr.groupId}) to equal automation step id (${pushStep.id}) (${label})`)
        }
        if (fr.automationStepId !== pushStep.id) {
          throw new Error(`Expected form_response.automationStepId (${fr.automationStepId}) to equal automation step id (${pushStep.id}) (${label})`)
        }
      }

      await async_test(
        `Worker writes groupId === automationStepId and pushedToPortalAt set (${label})`,
        async () => true,
        { onResult: r => r === true },
      )

      // Build the submitter session
      let submitterApi: typeof sdk.api | EnduserSession['api']
      if (submitAsEnduser) {
        const { authToken } = await sdk.api.endusers.generate_auth_token({ id: enduser.id })
        const enduserSDK = new EnduserSession({ host, authToken, businessId: sdk.userInfo.businessId })
        submitterApi = enduserSDK.api
      } else {
        submitterApi = sdk.api
      }

      for (const fr of pushedResponses) {
        const isFormA = fr.formId === formA.id
        const targetFieldId = isFormA ? fieldA.id : fieldB.id
        const targetFieldTitle = isFormA ? 'FieldA' : 'FieldB'
        await submitterApi.form_responses.submit_form_response({
          accessCode: fr.accessCode as string,
          responses: [{
            fieldId: targetFieldId,
            fieldTitle: targetFieldTitle,
            answer: { type: 'string', value: 'pushed-portal-answer' },
          }],
        })
      }

      await pollFor(
        async () => {
          const e = await sdk.api.endusers.getOne(enduser.id)
          return e.tags?.includes(tag) ? e : undefined
        },
        (result): result is Enduser => !!result,
        `Form Group Completed trigger to apply tag after push-to-portal submissions (${label})`,
        500,
        30,
      )

      await async_test(
        `Form Group Completed trigger fires for push-to-portal completion (${label})`,
        () => sdk.api.endusers.getOne(enduser.id),
        { onResult: (e: Enduser) => !!e.tags?.includes(tag) },
      )
    }

    // Admin submitter: simulates a staff user filling in the form on behalf of the patient
    // (uses a user-scoped DB in submit_form_response).
    await runFlow({
      label: 'admin-submit',
      tag: 'form-group-completed-push-admin',
      submitAsEnduser: false,
    })

    // Enduser submitter: simulates the patient submitting via the portal
    // (uses an enduser-scoped DB in submit_form_response — exercises the path QA caught).
    await runFlow({
      label: 'enduser-submit',
      tag: 'form-group-completed-push-enduser',
      submitAsEnduser: true,
    })

  } finally {
    for (const id of createdTriggerIds) {
      try { await sdk.api.automation_triggers.deleteOne(id) } catch (e) { /* ignore */ }
    }
    for (const id of createdEnduserIds) {
      try { await sdk.api.endusers.deleteOne(id) } catch (e) { /* ignore */ }
    }
    for (const id of createdJourneyIds) {
      try { await sdk.api.journeys.deleteOne(id) } catch (e) { /* ignore */ }
    }
    for (const id of createdFormGroupIds) {
      try { await sdk.api.form_groups.deleteOne(id) } catch (e) { /* ignore */ }
    }
    for (const id of createdFormIds) {
      try { await sdk.api.forms.deleteOne(id) } catch (e) { /* ignore */ }
    }
  }
}

if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await push_forms_to_portal_group_completion_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Push forms to portal group completion test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Push forms to portal group completion test suite failed:", error)
      process.exit(1)
    })
}
