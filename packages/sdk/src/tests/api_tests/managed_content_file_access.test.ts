require('source-map-support').install();

import * as buffer from 'buffer'
import { Session, EnduserSession } from "../../sdk"
import {
  async_test,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const
const businessId = '60398b1131a295e64f084ff6'

/**
 * Tests for file_download_URL enduser access via managed content fallback.
 *
 * Verifies the backend fallback logic that allows endusers to access files
 * attached to managed content records they have access to, even when the
 * file itself does not have enduserId set or publicRead: true.
 */
export const managed_content_file_access_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Managed Content File Access Tests")

  const contentRecordIds: string[] = []
  const assignmentIds: string[] = []
  const fileIds: string[] = []
  let testEnduserId: string | undefined
  let otherEnduserId: string | undefined
  let enduserSDK: EnduserSession | undefined
  let otherEnduserSDK: EnduserSession | undefined

  const uploadFile = async (
    name: string,
    opts: { enduserId?: string, publicRead?: boolean } = {}
  ) => {
    const buff = buffer.Buffer.from(`test file content for ${name}`)
    const { presignedUpload, file } = await sdk.api.files.prepare_file_upload({
      name,
      type: 'text/plain',
      size: buff.byteLength,
      ...opts,
    })
    await sdk.UPLOAD(presignedUpload as any, buff)
    await sdk.api.files.confirm_file_upload({ id: file.id })
    fileIds.push(file.id)
    return file
  }

  try {
    console.log("Setting up test data...")

    const testEnduser = await sdk.api.endusers.createOne({
      email: `mcr_file_access_test_${Date.now()}@test.tellescope.com`,
    })
    testEnduserId = testEnduser.id
    await sdk.api.endusers.set_password({ id: testEnduser.id, password: 'TestPassword123!' })

    const otherEnduser = await sdk.api.endusers.createOne({
      email: `mcr_file_access_other_${Date.now()}@test.tellescope.com`,
    })
    otherEnduserId = otherEnduser.id
    await sdk.api.endusers.set_password({ id: otherEnduser.id, password: 'TestPassword123!' })

    enduserSDK = new EnduserSession({ host, businessId })
    await enduserSDK.authenticate(testEnduser.email!, 'TestPassword123!')

    otherEnduserSDK = new EnduserSession({ host, businessId })
    await otherEnduserSDK.authenticate(otherEnduser.email!, 'TestPassword123!')

    // ===== Test 1: File attached to assignmentType: 'All' content - enduser CAN access =====
    const fileForAll = await uploadFile('mcr-file-all.txt')
    const contentAll = await sdk.api.managed_content_records.createOne({
      title: 'MCR File Access - All',
      htmlContent: '<p>All</p>',
      textContent: 'All',
      assignmentType: 'All',
      attachments: [{ secureName: fileForAll.secureName, type: 'file', name: fileForAll.name }],
    })
    contentRecordIds.push(contentAll.id)

    await async_test(
      'staff-uploaded file in assignmentType:All content - enduser CAN access',
      async () => {
        const result = await enduserSDK!.api.files.file_download_URL({ secureName: fileForAll.secureName })
        return !!result?.downloadURL
      },
      { onResult: (r) => r === true }
    )

    // ===== Test 2: File attached to Individual content for enduser A - enduser B CANNOT access =====
    const fileForIndividual = await uploadFile('mcr-file-individual.txt')
    const contentIndividual = await sdk.api.managed_content_records.createOne({
      title: 'MCR File Access - Individual',
      htmlContent: '<p>Individual</p>',
      textContent: 'Individual',
      enduserId: testEnduser.id,
      attachments: [{ secureName: fileForIndividual.secureName, type: 'file', name: fileForIndividual.name }],
    })
    contentRecordIds.push(contentIndividual.id)

    await async_test(
      'file attached to Individual content - assigned enduser CAN access',
      async () => {
        const result = await enduserSDK!.api.files.file_download_URL({ secureName: fileForIndividual.secureName })
        return !!result?.downloadURL
      },
      { onResult: (r) => r === true }
    )

    await async_test(
      'file attached to Individual content - unassigned enduser CANNOT access',
      async () => {
        try {
          await otherEnduserSDK!.api.files.file_download_URL({ secureName: fileForIndividual.secureName })
          return false
        } catch (err) {
          return true
        }
      },
      { onResult: (r) => r === true }
    )

    // ===== Test 3: File not attached to any managed content - enduser CANNOT access =====
    const fileNoContent = await uploadFile('mcr-file-no-content.txt')

    await async_test(
      'file not attached to any managed content - enduser CANNOT access',
      async () => {
        try {
          await enduserSDK!.api.files.file_download_URL({ secureName: fileNoContent.secureName })
          return false
        } catch (err) {
          return true
        }
      },
      { onResult: (r) => r === true }
    )

    // ===== Test 4: File with enduserId set - existing behavior preserved =====
    const fileWithEnduser = await uploadFile('mcr-file-with-enduser.txt', { enduserId: testEnduser.id })

    await async_test(
      'file with enduserId set - enduser CAN access (no fallback needed)',
      async () => {
        const result = await enduserSDK!.api.files.file_download_URL({ secureName: fileWithEnduser.secureName })
        return !!result?.downloadURL
      },
      { onResult: (r) => r === true }
    )

    // ===== Test 5: File with publicRead: true - existing behavior preserved =====
    const filePublic = await uploadFile('mcr-file-public.txt', { publicRead: true })

    await async_test(
      'file with publicRead - enduser CAN access',
      async () => {
        const result = await enduserSDK!.api.files.file_download_URL({ secureName: filePublic.secureName })
        return !!result?.downloadURL
      },
      { onResult: (r) => r === true }
    )

    console.log("All Managed Content File Access tests passed!")

  } finally {
    console.log("Cleaning up test data...")

    try {
      for (const assignmentId of assignmentIds) {
        await sdk.api.managed_content_record_assignments.deleteOne(assignmentId).catch(() => {})
      }

      for (const recordId of contentRecordIds) {
        await sdk.api.managed_content_records.deleteOne(recordId).catch(() => {})
      }

      for (const fileId of fileIds) {
        await sdk.api.files.deleteOne(fileId).catch(() => {})
      }

      if (testEnduserId) {
        await sdk.api.endusers.deleteOne(testEnduserId).catch(() => {})
      }
      if (otherEnduserId) {
        await sdk.api.endusers.deleteOne(otherEnduserId).catch(() => {})
      }

      console.log("Cleanup completed")
    } catch (error) {
      console.error('Cleanup error:', error)
    }
  }
}

if (require.main === module) {
  console.log(`Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await managed_content_file_access_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("Managed content file access test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Managed content file access test suite failed:", error)
      process.exit(1)
    })
}
