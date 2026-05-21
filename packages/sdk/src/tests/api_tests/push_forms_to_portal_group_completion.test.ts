require('source-map-support').install();

import { Session } from "../../sdk"
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

    // 2. Create a form group containing both forms
    const formGroup = await sdk.api.form_groups.createOne({
      title: 'Push To Portal Test Group',
      formIds: [formA.id, formB.id],
    })
    createdFormGroupIds.push(formGroup.id)

    // 3. Configure trigger with event.info.groupId = the real formGroupId
    const trigger = await sdk.api.automation_triggers.createOne({
      event: { type: 'Form Group Completed', info: { groupId: formGroup.id } },
      action: { type: 'Add Tags', info: { tags: ['form-group-completed-push'] } },
      status: 'Active',
      title: 'Form Group Completed - Push to Portal',
    })
    createdTriggerIds.push(trigger.id)

    // 4. Create journey with a pushFormsToPortal step referencing the form group
    const journey = await sdk.api.journeys.createOne({
      title: 'Push To Portal Trigger Journey',
    })
    createdJourneyIds.push(journey.id)

    const pushStep = await sdk.api.automation_steps.createOne({
      journeyId: journey.id,
      action: { type: 'pushFormsToPortal', info: { formGroupIds: [formGroup.id] } },
      events: [{ type: 'onJourneyStart', info: {} }],
    })

    // 5. Create enduser and add to journey
    const enduser = await sdk.api.endusers.createOne({ fname: 'PushPortal', lname: 'Tester' })
    createdEnduserIds.push(enduser.id)

    await sdk.api.endusers.add_to_journey({
      enduserIds: [enduser.id],
      journeyId: journey.id,
    })

    // 6. Poll for the worker to create the push-to-portal form_responses
    const pushedResponses = await pollFor(
      async () => {
        const responses = await sdk.api.form_responses.getSome({
          filter: { enduserId: enduser.id },
        })
        const pushed = responses.filter(r => !!r.pushedToPortalAt)
        return pushed.length >= 2 ? pushed : undefined
      },
      (result): result is any[] => Array.isArray(result) && result.length >= 2,
      'pushed-to-portal form_responses to be created by worker',
      500,
      40,
    )

    // 7. Assert worker behavior: groupId === automationStepId and pushedToPortalAt is set
    for (const fr of pushedResponses) {
      if (!fr.pushedToPortalAt) {
        throw new Error(`Expected pushedToPortalAt to be set on form_response ${fr.id}`)
      }
      if (fr.groupId !== pushStep.id) {
        throw new Error(`Expected form_response.groupId (${fr.groupId}) to equal automation step id (${pushStep.id})`)
      }
      if (fr.automationStepId !== pushStep.id) {
        throw new Error(`Expected form_response.automationStepId (${fr.automationStepId}) to equal automation step id (${pushStep.id})`)
      }
    }

    await async_test(
      "Worker writes groupId === automationStepId and pushedToPortalAt set",
      async () => true,
      { onResult: r => r === true },
    )

    // 8. Submit every form_response on behalf of the enduser
    // Identify which form_response corresponds to formA / formB via formId
    for (const fr of pushedResponses) {
      const isFormA = fr.formId === formA.id
      const targetFieldId = isFormA ? fieldA.id : fieldB.id
      const targetFieldTitle = isFormA ? 'FieldA' : 'FieldB'
      await sdk.api.form_responses.submit_form_response({
        accessCode: fr.accessCode as string,
        responses: [{
          fieldId: targetFieldId,
          fieldTitle: targetFieldTitle,
          answer: { type: 'string', value: 'pushed-portal-answer' },
        }],
      })
    }

    // 9. Poll for the trigger's side-effect (tag on enduser)
    await pollFor(
      async () => {
        const e = await sdk.api.endusers.getOne(enduser.id)
        return e.tags?.includes('form-group-completed-push') ? e : undefined
      },
      (result): result is Enduser => !!result,
      'Form Group Completed trigger to apply tag after push-to-portal submissions',
      500,
      30,
    )

    await async_test(
      "Form Group Completed trigger fires for push-to-portal completion",
      () => sdk.api.endusers.getOne(enduser.id),
      { onResult: (e: Enduser) => !!e.tags?.includes('form-group-completed-push') },
    )

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
