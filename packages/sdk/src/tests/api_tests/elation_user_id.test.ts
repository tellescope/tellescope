require('source-map-support').install();

import { Session } from "../../sdk"
import {
  async_test,
  handleAnyError,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

export const elation_user_id_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Elation User ID Tests")

  const randomElationUserId = Math.floor(Math.random() * 1000000)

  // Admin can set elationUserId
  await async_test(
    `admin can update elationUserId`,
    () => sdk.api.users.updateOne(sdk.userInfo.id, { elationUserId: randomElationUserId }),
    { shouldError: false, onResult: (u) => u.elationUserId === randomElationUserId }
  )

  // Verify the value persists on read
  await async_test(
    `elationUserId persists after update`,
    () => sdk.api.users.getOne(sdk.userInfo.id),
    { shouldError: false, onResult: (u) => u.elationUserId === randomElationUserId }
  )

  // Non-admin cannot update elationUserId
  await async_test(
    `non-admin cannot update elationUserId`,
    () => sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, { elationUserId: 999999 }),
    handleAnyError
  )
}

// Allow running this test file independently
if (require.main === module) {
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await elation_user_id_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Elation User ID test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Elation User ID test suite failed:", error)
      process.exit(1)
    })
}
