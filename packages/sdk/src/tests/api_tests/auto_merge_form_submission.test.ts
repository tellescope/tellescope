require('source-map-support').install();

import * as buffer from 'buffer'
import { Session, EnduserSession } from "../../sdk"
import {
  async_test,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"
import { Form, FormField } from "@tellescope/types-client"

const host = process.env.API_URL || 'http://localhost:8080' as const

/**
 * Helper: Create a form with auto-merge enabled and intake fields
 */
const createAutoMergeForm = async (sdk: Session, autoMergeOnSubmission = true) => {
  const form = await sdk.api.forms.createOne({
    title: 'Auto Merge Test Form',
    allowPublicURL: true,
    autoMergeOnSubmission,
  })

  // Add intake fields - must create sequentially due to previousFields dependencies
  const fnameField = await sdk.api.form_fields.createOne({
    formId: form.id,
    title: 'First Name',
    type: 'string',
    intakeField: 'fname',
    previousFields: [{ type: 'root', info: {} }]
  })
  const lnameField = await sdk.api.form_fields.createOne({
    formId: form.id,
    title: 'Last Name',
    type: 'string',
    intakeField: 'lname',
    previousFields: [{ type: 'after', info: { fieldId: fnameField.id } }]
  })
  const emailField = await sdk.api.form_fields.createOne({
    formId: form.id,
    title: 'Email',
    type: 'email',
    intakeField: 'email',
    previousFields: [{ type: 'after', info: { fieldId: lnameField.id } }]
  })
  const phoneField = await sdk.api.form_fields.createOne({
    formId: form.id,
    title: 'Phone',
    type: 'phone',
    intakeField: 'phone',
    previousFields: [{ type: 'after', info: { fieldId: emailField.id } }]
  })
  const dobField = await sdk.api.form_fields.createOne({
    formId: form.id,
    title: 'Date of Birth',
    type: 'dateString',
    intakeField: 'dateOfBirth',
    previousFields: [{ type: 'after', info: { fieldId: phoneField.id } }]
  })

  const fields = [fnameField, lnameField, emailField, phoneField, dobField]
  return { form, fields }
}

/**
 * Helper: Submit a public form with skipMatch and get the created enduser ID
 */
const submitPublicFormWithSkipMatch = async (
  form: Form,
  fields: FormField[],
  values: { fname?: string, lname?: string, email?: string, phone?: string, dateOfBirth?: string }
) => {
  const enduserSDK = new EnduserSession({ host, businessId: form.businessId })

  const { authToken, accessCode, enduserId } = await enduserSDK.api.form_responses.session_for_public_form({
    formId: form.id,
    businessId: form.businessId,
    skipMatch: true,
  })

  const authedSDK = new EnduserSession({ host, businessId: form.businessId, authToken })

  const responses = []
  const fnameField = fields.find(f => f.intakeField === 'fname')
  const lnameField = fields.find(f => f.intakeField === 'lname')
  const emailField = fields.find(f => f.intakeField === 'email')
  const phoneField = fields.find(f => f.intakeField === 'phone')
  const dobField = fields.find(f => f.intakeField === 'dateOfBirth')

  if (values.fname && fnameField) {
    responses.push({ fieldId: fnameField.id, fieldTitle: fnameField.title, answer: { type: 'string' as const, value: values.fname } })
  }
  if (values.lname && lnameField) {
    responses.push({ fieldId: lnameField.id, fieldTitle: lnameField.title, answer: { type: 'string' as const, value: values.lname } })
  }
  if (values.email && emailField) {
    responses.push({ fieldId: emailField.id, fieldTitle: emailField.title, answer: { type: 'email' as const, value: values.email } })
  }
  if (values.phone && phoneField) {
    responses.push({ fieldId: phoneField.id, fieldTitle: phoneField.title, answer: { type: 'phone' as const, value: values.phone } })
  }
  if (values.dateOfBirth && dobField) {
    responses.push({ fieldId: dobField.id, fieldTitle: dobField.title, answer: { type: 'dateString' as const, value: values.dateOfBirth } })
  }

  await authedSDK.api.form_responses.submit_form_response({
    accessCode,
    responses,
  })

  return { enduserId, accessCode, authedSDK }
}

/**
 * Helper: Check if enduser has been deleted (immediate check, no polling)
 * Since auto-merge is now synchronous, we don't need to poll
 */
const isEnduserDeleted = async (sdk: Session, enduserId: string): Promise<boolean> => {
  try {
    await sdk.api.endusers.getOne(enduserId)
    return false // Still exists
  } catch {
    return true // Deleted
  }
}

/**
 * Main test function that can be called independently or as part of the test suite
 */
export const auto_merge_form_submission_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Auto-Merge Form Submission Tests")

  // Test 1: Happy Path - Merge by Email Match
  await async_test(
    "Auto-merge: Merge occurs when matching by email",
    async () => {
      const testEmail = `automerge.email.${Date.now()}@test.com`
      const destination = await sdk.api.endusers.createOne({
        fname: 'John',
        lname: 'Doe',
        email: testEmail
      })
      const { form, fields } = await createAutoMergeForm(sdk, true)

      const { enduserId: sourceId } = await submitPublicFormWithSkipMatch(form, fields, {
        fname: 'John',
        lname: 'Doe',
        email: testEmail,
      })

      // Merge is synchronous - source should be deleted immediately after submission
      const sourceDeleted = await isEnduserDeleted(sdk, sourceId)
      const updatedDestination = await sdk.api.endusers.getOne(destination.id)
      const formResponses = await sdk.api.form_responses.getSome({ filter: { enduserId: destination.id } })

      // Cleanup
      await sdk.api.forms.deleteOne(form.id)
      await sdk.api.endusers.deleteOne(destination.id)

      return sourceDeleted
        && updatedDestination.mergedIds?.includes(sourceId)
        && formResponses.length === 1
    },
    { expectedResult: true }
  )

  // Test 2: Happy Path - Merge by Phone Match
  await async_test(
    "Auto-merge: Merge occurs when matching by phone",
    async () => {
      const testPhone = '+15555551234'
      const destination = await sdk.api.endusers.createOne({
        fname: 'Jane',
        lname: 'Smith',
        phone: testPhone
      })
      const { form, fields } = await createAutoMergeForm(sdk, true)

      const { enduserId: sourceId } = await submitPublicFormWithSkipMatch(form, fields, {
        fname: 'Jane',
        lname: 'Smith',
        phone: testPhone,
      })

      // Merge is synchronous - source should be deleted immediately after submission
      const sourceDeleted = await isEnduserDeleted(sdk, sourceId)
      const updatedDestination = await sdk.api.endusers.getOne(destination.id)

      // Cleanup
      await sdk.api.forms.deleteOne(form.id)
      await sdk.api.endusers.deleteOne(destination.id)

      return sourceDeleted && updatedDestination.mergedIds?.includes(sourceId)
    },
    { expectedResult: true }
  )

  // Test 3: Happy Path - Merge by DateOfBirth Match
  await async_test(
    "Auto-merge: Merge occurs when matching by dateOfBirth",
    async () => {
      const testDOB = '1990-05-15'
      const destination = await sdk.api.endusers.createOne({
        fname: 'Bob',
        lname: 'Johnson',
        dateOfBirth: testDOB
      })
      const { form, fields } = await createAutoMergeForm(sdk, true)

      const { enduserId: sourceId } = await submitPublicFormWithSkipMatch(form, fields, {
        fname: 'Bob',
        lname: 'Johnson',
        dateOfBirth: testDOB,
      })

      // Merge is synchronous - source should be deleted immediately after submission
      const sourceDeleted = await isEnduserDeleted(sdk, sourceId)
      const updatedDestination = await sdk.api.endusers.getOne(destination.id)

      // Cleanup
      await sdk.api.forms.deleteOne(form.id)
      await sdk.api.endusers.deleteOne(destination.id)

      return sourceDeleted && updatedDestination.mergedIds?.includes(sourceId)
    },
    { expectedResult: true }
  )

  // Test 4: No Merge - Multiple Matches
  await async_test(
    "Auto-merge: No merge when multiple matches found",
    async () => {
      // Use dateOfBirth for matching since email/phone have uniqueness constraints
      const testDOB = '1975-01-15'
      const destination1 = await sdk.api.endusers.createOne({
        fname: 'Multi',
        lname: 'Match',
        dateOfBirth: testDOB
      })
      const destination2 = await sdk.api.endusers.createOne({
        fname: 'Multi',
        lname: 'Match',
        dateOfBirth: testDOB
      })
      const { form, fields } = await createAutoMergeForm(sdk, true)

      const { enduserId: sourceId } = await submitPublicFormWithSkipMatch(form, fields, {
        fname: 'Multi',
        lname: 'Match',
        dateOfBirth: testDOB,
      })

      // Merge is synchronous - no need to wait, source should still exist
      const sourceDeleted = await isEnduserDeleted(sdk, sourceId)
      const dest1 = await sdk.api.endusers.getOne(destination1.id)
      const dest2 = await sdk.api.endusers.getOne(destination2.id)

      // Cleanup
      await sdk.api.forms.deleteOne(form.id)
      await sdk.api.endusers.deleteOne(destination1.id)
      await sdk.api.endusers.deleteOne(destination2.id)
      if (!sourceDeleted) await sdk.api.endusers.deleteOne(sourceId)

      return !sourceDeleted // Source should NOT be deleted
        && !dest1.mergedIds?.includes(sourceId)
        && !dest2.mergedIds?.includes(sourceId)
    },
    { expectedResult: true }
  )

  // Test 5: No Merge - autoMergeOnSubmission Disabled
  await async_test(
    "Auto-merge: No merge when autoMergeOnSubmission is disabled",
    async () => {
      const testEmail = `automerge.disabled.${Date.now()}@test.com`
      const destination = await sdk.api.endusers.createOne({
        fname: 'Disabled',
        lname: 'Test',
        email: testEmail
      })
      const { form, fields } = await createAutoMergeForm(sdk, false) // Disabled

      const { enduserId: sourceId } = await submitPublicFormWithSkipMatch(form, fields, {
        fname: 'Disabled',
        lname: 'Test',
        email: testEmail,
      })

      // Merge is synchronous - no need to wait, source should still exist
      const sourceDeleted = await isEnduserDeleted(sdk, sourceId)

      // Cleanup
      await sdk.api.forms.deleteOne(form.id)
      await sdk.api.endusers.deleteOne(destination.id)
      if (!sourceDeleted) await sdk.api.endusers.deleteOne(sourceId)

      return !sourceDeleted // Source should NOT be deleted
    },
    { expectedResult: true }
  )

  // Test 6: No Merge - No Matching Enduser
  await async_test(
    "Auto-merge: No merge when no matching enduser exists",
    async () => {
      const { form, fields } = await createAutoMergeForm(sdk, true)

      const { enduserId: sourceId } = await submitPublicFormWithSkipMatch(form, fields, {
        fname: 'NoMatch',
        lname: 'Person',
        email: `nomatch.${Date.now()}@test.com`,
      })

      // Merge is synchronous - no need to wait, source should still exist (no match found)
      const sourceDeleted = await isEnduserDeleted(sdk, sourceId)

      // Cleanup
      await sdk.api.forms.deleteOne(form.id)
      if (!sourceDeleted) await sdk.api.endusers.deleteOne(sourceId)

      return !sourceDeleted // Source should NOT be deleted
    },
    { expectedResult: true }
  )

  // Test 7: Case Sensitive Matching - No Merge When Case Differs
  await async_test(
    "Auto-merge: No merge when case differs (case-sensitive matching)",
    async () => {
      const testEmail = `automerge.case.${Date.now()}@test.com`
      const destination = await sdk.api.endusers.createOne({
        fname: 'Case',
        lname: 'Test',
        email: testEmail
      })
      const { form, fields } = await createAutoMergeForm(sdk, true)

      // Submit with different case - should NOT match due to case-sensitive matching
      const { enduserId: sourceId } = await submitPublicFormWithSkipMatch(form, fields, {
        fname: 'CASE',  // Different case
        lname: 'TEST',  // Different case
        email: testEmail.toUpperCase(),  // Different case
      })

      // Merge is case-sensitive - source should still exist (no match found)
      const sourceDeleted = await isEnduserDeleted(sdk, sourceId)
      const updatedDestination = await sdk.api.endusers.getOne(destination.id)

      // Cleanup
      await sdk.api.forms.deleteOne(form.id)
      await sdk.api.endusers.deleteOne(destination.id)
      if (!sourceDeleted) await sdk.api.endusers.deleteOne(sourceId)

      return !sourceDeleted // Source should NOT be deleted (no merge)
        && !updatedDestination.mergedIds?.includes(sourceId)
    },
    { expectedResult: true }
  )

  // Test 8: eligibleForAutoMerge Flag Verification
  await async_test(
    "Auto-merge: eligibleForAutoMerge flag is set correctly",
    async () => {
      // Form with autoMergeOnSubmission: true
      const { form: formEnabled, fields: fieldsEnabled } = await createAutoMergeForm(sdk, true)
      const enduserSDKEnabled = new EnduserSession({ host, businessId: formEnabled.businessId })
      const { enduserId: enabledEnduserId } = await enduserSDKEnabled.api.form_responses.session_for_public_form({
        formId: formEnabled.id,
        businessId: formEnabled.businessId,
        skipMatch: true,
      })
      const enabledEnduser = await sdk.api.endusers.getOne(enabledEnduserId)

      // Form with autoMergeOnSubmission: false
      const { form: formDisabled, fields: fieldsDisabled } = await createAutoMergeForm(sdk, false)
      const enduserSDKDisabled = new EnduserSession({ host, businessId: formDisabled.businessId })
      const { enduserId: disabledEnduserId } = await enduserSDKDisabled.api.form_responses.session_for_public_form({
        formId: formDisabled.id,
        businessId: formDisabled.businessId,
        skipMatch: true,
      })
      const disabledEnduser = await sdk.api.endusers.getOne(disabledEnduserId)

      // Cleanup
      await sdk.api.forms.deleteOne(formEnabled.id)
      await sdk.api.forms.deleteOne(formDisabled.id)
      await sdk.api.endusers.deleteOne(enabledEnduserId)
      await sdk.api.endusers.deleteOne(disabledEnduserId)

      return enabledEnduser.eligibleForAutoMerge === true
        && disabledEnduser.eligibleForAutoMerge !== true
    },
    { expectedResult: true }
  )

  // Test 9: Files Transfer on Merge
  await async_test(
    "Auto-merge: Files are transferred to destination enduser",
    async () => {
      const testEmail = `automerge.files.${Date.now()}@test.com`
      const destination = await sdk.api.endusers.createOne({
        fname: 'Files',
        lname: 'Test',
        email: testEmail
      })
      const { form, fields } = await createAutoMergeForm(sdk, true)

      // Create public session to get source enduser
      const enduserSDK = new EnduserSession({ host, businessId: form.businessId })
      const { authToken, accessCode, enduserId: sourceId } = await enduserSDK.api.form_responses.session_for_public_form({
        formId: form.id,
        businessId: form.businessId,
        skipMatch: true,
      })

      // Create a file for the source enduser using prepare_file_upload + UPLOAD
      const buff = buffer.Buffer.from('test file data for auto-merge')
      const { presignedUpload, file } = await sdk.api.files.prepare_file_upload({
        name: 'test-file.txt',
        type: 'text/plain',
        size: buff.byteLength,
        enduserId: sourceId,
      })
      await sdk.UPLOAD(presignedUpload as any, buff)

      // Now submit the form to trigger merge
      const authedSDK = new EnduserSession({ host, businessId: form.businessId, authToken })
      const fnameField = fields.find(f => f.intakeField === 'fname')!
      const lnameField = fields.find(f => f.intakeField === 'lname')!
      const emailField = fields.find(f => f.intakeField === 'email')!

      await authedSDK.api.form_responses.submit_form_response({
        accessCode,
        responses: [
          { fieldId: fnameField.id, fieldTitle: fnameField.title, answer: { type: 'string', value: 'Files' } },
          { fieldId: lnameField.id, fieldTitle: lnameField.title, answer: { type: 'string', value: 'Test' } },
          { fieldId: emailField.id, fieldTitle: emailField.title, answer: { type: 'email', value: testEmail } },
        ],
      })

      // Merge is synchronous - source should be deleted immediately after submission
      const sourceDeleted = await isEnduserDeleted(sdk, sourceId)
      const updatedFile = await sdk.api.files.getOne(file.id)

      // Cleanup
      await sdk.api.forms.deleteOne(form.id)
      await sdk.api.files.deleteOne(file.id)
      await sdk.api.endusers.deleteOne(destination.id)

      return sourceDeleted && updatedFile.enduserId === destination.id
    },
    { expectedResult: true }
  )

  // Test 10: Calendar Events Transfer on Merge
  await async_test(
    "Auto-merge: Calendar events are transferred to destination enduser",
    async () => {
      const testEmail = `automerge.events.${Date.now()}@test.com`
      const destination = await sdk.api.endusers.createOne({
        fname: 'Events',
        lname: 'Test',
        email: testEmail
      })
      const { form, fields } = await createAutoMergeForm(sdk, true)

      // Create public session to get source enduser
      const enduserSDK = new EnduserSession({ host, businessId: form.businessId })
      const { authToken, accessCode, enduserId: sourceId } = await enduserSDK.api.form_responses.session_for_public_form({
        formId: form.id,
        businessId: form.businessId,
        skipMatch: true,
      })

      // Create a calendar event with source enduser as attendee
      const event = await sdk.api.calendar_events.createOne({
        title: 'Test Event',
        startTimeInMS: Date.now() + 86400000, // Tomorrow
        durationInMinutes: 30,
        attendees: [{ id: sourceId, type: 'enduser' }],
      })

      // Now submit the form to trigger merge
      const authedSDK = new EnduserSession({ host, businessId: form.businessId, authToken })
      const fnameField = fields.find(f => f.intakeField === 'fname')!
      const lnameField = fields.find(f => f.intakeField === 'lname')!
      const emailField = fields.find(f => f.intakeField === 'email')!

      await authedSDK.api.form_responses.submit_form_response({
        accessCode,
        responses: [
          { fieldId: fnameField.id, fieldTitle: fnameField.title, answer: { type: 'string', value: 'Events' } },
          { fieldId: lnameField.id, fieldTitle: lnameField.title, answer: { type: 'string', value: 'Test' } },
          { fieldId: emailField.id, fieldTitle: emailField.title, answer: { type: 'email', value: testEmail } },
        ],
      })

      // Merge is synchronous - source should be deleted immediately after submission
      const sourceDeleted = await isEnduserDeleted(sdk, sourceId)
      const updatedEvent = await sdk.api.calendar_events.getOne(event.id)

      // Cleanup
      await sdk.api.forms.deleteOne(form.id)
      await sdk.api.calendar_events.deleteOne(event.id)
      await sdk.api.endusers.deleteOne(destination.id)

      return sourceDeleted && updatedEvent.attendees?.some(a => a.id === destination.id)
    },
    { expectedResult: true }
  )

  // Test 11: Form response enduserId is updated to destination (placeholder is updated before submission completes)
  await async_test(
    "Auto-merge: Form response enduserId is updated to destination",
    async () => {
      const testEmail = `automerge.directfr.${Date.now()}@test.com`
      const destination = await sdk.api.endusers.createOne({
        fname: 'Direct',
        lname: 'Response',
        email: testEmail
      })
      const { form, fields } = await createAutoMergeForm(sdk, true)

      const { enduserId: sourceId, accessCode } = await submitPublicFormWithSkipMatch(form, fields, {
        fname: 'Direct',
        lname: 'Response',
        email: testEmail,
      })

      // Merge is synchronous - verify form response was created with destination ID
      const sourceDeleted = await isEnduserDeleted(sdk, sourceId)

      // Get form responses by accessCode to find the one we created
      const formResponses = await sdk.api.form_responses.getSome({ filter: { accessCode } })
      const createdFormResponse = formResponses[0]

      // Cleanup
      await sdk.api.forms.deleteOne(form.id)
      await sdk.api.endusers.deleteOne(destination.id)

      // The form response should have been created directly with destination enduser ID
      // (not transferred after creation)
      return sourceDeleted
        && createdFormResponse !== undefined
        && createdFormResponse.enduserId === destination.id
    },
    { expectedResult: true }
  )

  // Test 12: Intake fields update destination enduser directly
  await async_test(
    "Auto-merge: Intake fields update destination enduser directly",
    async () => {
      const testEmail = `automerge.intake.${Date.now()}@test.com`
      const destination = await sdk.api.endusers.createOne({
        fname: 'Intake',
        lname: 'Test',
        email: testEmail,
        // No phone or DOB set initially
      })
      const { form, fields } = await createAutoMergeForm(sdk, true)

      const newPhone = '+15555559876'
      const newDOB = '1985-03-20'

      const { enduserId: sourceId } = await submitPublicFormWithSkipMatch(form, fields, {
        fname: 'Intake',
        lname: 'Test',
        email: testEmail,
        phone: newPhone,
        dateOfBirth: newDOB,
      })

      // Merge is synchronous - verify intake fields updated destination directly
      const sourceDeleted = await isEnduserDeleted(sdk, sourceId)
      const updatedDestination = await sdk.api.endusers.getOne(destination.id)

      // Cleanup
      await sdk.api.forms.deleteOne(form.id)
      await sdk.api.endusers.deleteOne(destination.id)

      // Intake fields should have been applied to the destination enduser
      return sourceDeleted
        && updatedDestination.phone === newPhone
        && updatedDestination.dateOfBirth === newDOB
    },
    { expectedResult: true }
  )

  // Test 13: eligibleForAutoMerge is unset after submission (no merge case)
  await async_test(
    "Auto-merge: eligibleForAutoMerge is unset after submission when no merge occurs",
    async () => {
      const { form, fields } = await createAutoMergeForm(sdk, true)

      // Submit form - no match exists, so no merge will happen
      const { enduserId: sourceId } = await submitPublicFormWithSkipMatch(form, fields, {
        fname: 'Unset',
        lname: 'Flag',
        email: `unset.flag.${Date.now()}@test.com`,
      })

      // Verify enduser still exists and eligibleForAutoMerge is unset
      const updatedEnduser = await sdk.api.endusers.getOne(sourceId)

      // Cleanup
      await sdk.api.forms.deleteOne(form.id)
      await sdk.api.endusers.deleteOne(sourceId)

      // eligibleForAutoMerge should be unset (undefined/falsy) after submission
      return updatedEnduser.eligibleForAutoMerge !== true
    },
    { expectedResult: true }
  )

  // ============================================
  // BACKWARDS COMPATIBILITY & EDGE CASE TESTS
  // ============================================

  // Test 14: No merge when source enduser has multiple form responses
  await async_test(
    "Auto-merge: No merge when source enduser already has multiple form responses",
    async () => {
      const testEmail = `automerge.multiresponse.${Date.now()}@test.com`
      const destination = await sdk.api.endusers.createOne({
        fname: 'Multi',
        lname: 'Response',
        email: testEmail
      })
      const { form: form1, fields: fields1 } = await createAutoMergeForm(sdk, true)
      const { form: form2, fields: fields2 } = await createAutoMergeForm(sdk, true)

      // Create first public session and submit (this creates first form response)
      const enduserSDK1 = new EnduserSession({ host, businessId: form1.businessId })
      const session1 = await enduserSDK1.api.form_responses.session_for_public_form({
        formId: form1.id,
        businessId: form1.businessId,
        skipMatch: true,
      })
      const sourceId = session1.enduserId

      // Submit first form with non-matching data (no merge should happen)
      const authedSDK1 = new EnduserSession({ host, businessId: form1.businessId, authToken: session1.authToken })
      const fnameField1 = fields1.find(f => f.intakeField === 'fname')!
      const lnameField1 = fields1.find(f => f.intakeField === 'lname')!
      const emailField1 = fields1.find(f => f.intakeField === 'email')!
      await authedSDK1.api.form_responses.submit_form_response({
        accessCode: session1.accessCode,
        responses: [
          { fieldId: fnameField1.id, fieldTitle: fnameField1.title, answer: { type: 'string', value: 'Different' } },
          { fieldId: lnameField1.id, fieldTitle: lnameField1.title, answer: { type: 'string', value: 'Person' } },
          { fieldId: emailField1.id, fieldTitle: emailField1.title, answer: { type: 'email', value: `different.${Date.now()}@test.com` } },
        ],
      })

      // Now create a second form response for the SAME source enduser via admin SDK
      await sdk.api.form_responses.createOne({
        formId: form2.id,
        formTitle: 'Auto Merge Test Form',
        enduserId: sourceId,
      })

      // Re-set eligibleForAutoMerge manually to simulate another attempt
      await sdk.api.endusers.updateOne(sourceId, { eligibleForAutoMerge: true })

      // Create another public session that would match - but source now has 2+ form responses
      const enduserSDK2 = new EnduserSession({ host, businessId: form2.businessId })
      const session2 = await enduserSDK2.api.form_responses.session_for_public_form({
        formId: form2.id,
        businessId: form2.businessId,
        skipMatch: true,
      })
      const sourceId2 = session2.enduserId

      // Manually add another form response to sourceId2 to trigger the >1 check
      await sdk.api.form_responses.createOne({
        formId: form1.id,
        formTitle: 'Auto Merge Test Form',
        enduserId: sourceId2,
      })

      // Submit with matching data - should NOT merge because source has >1 form responses
      const authedSDK2 = new EnduserSession({ host, businessId: form2.businessId, authToken: session2.authToken })
      const fnameField2 = fields2.find(f => f.intakeField === 'fname')!
      const lnameField2 = fields2.find(f => f.intakeField === 'lname')!
      const emailField2 = fields2.find(f => f.intakeField === 'email')!
      await authedSDK2.api.form_responses.submit_form_response({
        accessCode: session2.accessCode,
        responses: [
          { fieldId: fnameField2.id, fieldTitle: fnameField2.title, answer: { type: 'string', value: 'Multi' } },
          { fieldId: lnameField2.id, fieldTitle: lnameField2.title, answer: { type: 'string', value: 'Response' } },
          { fieldId: emailField2.id, fieldTitle: emailField2.title, answer: { type: 'email', value: testEmail } },
        ],
      })

      // Source should NOT be deleted because it had multiple form responses
      const sourceStillExists = !(await isEnduserDeleted(sdk, sourceId2))

      // Cleanup
      await sdk.api.forms.deleteOne(form1.id)
      await sdk.api.forms.deleteOne(form2.id)
      await sdk.api.endusers.deleteOne(destination.id)
      await sdk.api.endusers.deleteOne(sourceId)
      if (sourceStillExists) await sdk.api.endusers.deleteOne(sourceId2)

      return sourceStillExists
    },
    { expectedResult: true }
  )

  // Test 15: Backwards compat - skipMatch=false does NOT set eligibleForAutoMerge
  await async_test(
    "Backwards compat: skipMatch=false does not set eligibleForAutoMerge even with autoMergeOnSubmission=true",
    async () => {
      const { form, fields } = await createAutoMergeForm(sdk, true)
      const testPhone = `+1555555${Date.now().toString().slice(-4)}`

      // Create public session WITHOUT skipMatch (normal flow - requires phone)
      const enduserSDK = new EnduserSession({ host, businessId: form.businessId })
      const { enduserId } = await enduserSDK.api.form_responses.session_for_public_form({
        formId: form.id,
        businessId: form.businessId,
        phone: testPhone, // Phone is required when skipMatch is not set
        // skipMatch is NOT set (defaults to false)
      })

      const enduser = await sdk.api.endusers.getOne(enduserId)

      // Cleanup
      await sdk.api.forms.deleteOne(form.id)
      await sdk.api.endusers.deleteOne(enduserId)

      // eligibleForAutoMerge should NOT be set when skipMatch is false
      return enduser.eligibleForAutoMerge !== true
    },
    { expectedResult: true }
  )

  // Test 16: Backwards compat - Private form submission doesn't trigger auto-merge
  await async_test(
    "Backwards compat: Private form submission does not trigger auto-merge",
    async () => {
      const testEmail = `backcompat.private.${Date.now()}@test.com`
      const destination = await sdk.api.endusers.createOne({
        fname: 'Private',
        lname: 'Test',
        email: testEmail
      })

      // Create source enduser with eligibleForAutoMerge manually set
      const source = await sdk.api.endusers.createOne({
        fname: 'Private',
        lname: 'Test',
        email: testEmail + '.source',
        eligibleForAutoMerge: true, // Manually set to test that private submission ignores it
      })

      const { form, fields } = await createAutoMergeForm(sdk, true)

      // Create form response via admin SDK (private/non-public submission)
      const fnameField = fields.find(f => f.intakeField === 'fname')!
      const lnameField = fields.find(f => f.intakeField === 'lname')!
      const emailField = fields.find(f => f.intakeField === 'email')!

      await sdk.api.form_responses.createOne({
        formId: form.id,
        formTitle: form.title,
        enduserId: source.id,
        responses: [
          { fieldId: fnameField.id, fieldTitle: fnameField.title, answer: { type: 'string', value: 'Private' } },
          { fieldId: lnameField.id, fieldTitle: lnameField.title, answer: { type: 'string', value: 'Test' } },
          { fieldId: emailField.id, fieldTitle: emailField.title, answer: { type: 'email', value: testEmail } },
        ],
      })

      // Source should NOT be deleted because this was a private submission (not publicSubmit)
      const sourceStillExists = !(await isEnduserDeleted(sdk, source.id))

      // Cleanup
      await sdk.api.forms.deleteOne(form.id)
      await sdk.api.endusers.deleteOne(destination.id)
      if (sourceStillExists) await sdk.api.endusers.deleteOne(source.id)

      return sourceStillExists
    },
    { expectedResult: true }
  )

  // Test 17: OR logic - matches on email even when phone differs
  await async_test(
    "Auto-merge: Merge occurs when email matches even if phone differs (OR logic)",
    async () => {
      const testEmail = `automerge.orlogic.${Date.now()}@test.com`
      const destination = await sdk.api.endusers.createOne({
        fname: 'OrLogic',
        lname: 'Test',
        email: testEmail,
        phone: '+15555550001', // Different phone
      })
      const { form, fields } = await createAutoMergeForm(sdk, true)

      // Submit with matching email but DIFFERENT phone
      const { enduserId: sourceId } = await submitPublicFormWithSkipMatch(form, fields, {
        fname: 'OrLogic',
        lname: 'Test',
        email: testEmail,
        phone: '+15555550002', // Different phone than destination
      })

      // Should merge because email matches (OR logic, not AND)
      const sourceDeleted = await isEnduserDeleted(sdk, sourceId)
      const updatedDestination = await sdk.api.endusers.getOne(destination.id)

      // Cleanup
      await sdk.api.forms.deleteOne(form.id)
      await sdk.api.endusers.deleteOne(destination.id)

      return sourceDeleted && updatedDestination.mergedIds?.includes(sourceId)
    },
    { expectedResult: true }
  )

  // Test 18: Partial name mismatch - fname matches but lname differs
  await async_test(
    "Auto-merge: No merge when fname matches but lname differs",
    async () => {
      const testEmail = `automerge.partial.${Date.now()}@test.com`
      const destination = await sdk.api.endusers.createOne({
        fname: 'Partial',
        lname: 'Match',
        email: testEmail
      })
      const { form, fields } = await createAutoMergeForm(sdk, true)

      // Submit with same fname but DIFFERENT lname
      const { enduserId: sourceId } = await submitPublicFormWithSkipMatch(form, fields, {
        fname: 'Partial',      // Same
        lname: 'Different',    // Different!
        email: testEmail,      // Same email
      })

      // Should NOT merge because lname differs
      const sourceDeleted = await isEnduserDeleted(sdk, sourceId)

      // Cleanup
      await sdk.api.forms.deleteOne(form.id)
      await sdk.api.endusers.deleteOne(destination.id)
      if (!sourceDeleted) await sdk.api.endusers.deleteOne(sourceId)

      return !sourceDeleted // Source should NOT be deleted
    },
    { expectedResult: true }
  )
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await auto_merge_form_submission_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("Auto-merge form submission test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Auto-merge form submission test suite failed:", error)
      process.exit(1)
    })
}
