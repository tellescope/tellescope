require('source-map-support').install();

import { Session } from "../../sdk"
import {
  async_test,
  handleAnyError,
  log_header,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

// Main test function that can be called independently or from main test suite
export const database_cascade_delete_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Database Cascade Delete Tests")

  // Test 1: Create database and records, then delete database and verify records are cascade deleted
  await async_test(
    'cascade delete - deleting database deletes all database_records',
    async () => {
      // Create a test database
      const database = await sdk.api.databases.createOne({
        title: `__Test__CascadeDelete_${Date.now()}`,
        fields: [
          { type: 'Text', label: "Name" },
          { type: 'Number', label: "Age" },
        ],
      })

      // Create multiple database records
      const records = await sdk.api.database_records.createSome([
        {
          databaseId: database.id,
          values: [
            { type: 'Text', value: 'Alice', label: 'Name' },
            { type: 'Number', value: 25, label: 'Age' },
          ],
        },
        {
          databaseId: database.id,
          values: [
            { type: 'Text', value: 'Bob', label: 'Name' },
            { type: 'Number', value: 30, label: 'Age' },
          ],
        },
        {
          databaseId: database.id,
          values: [
            { type: 'Text', value: 'Charlie', label: 'Name' },
            { type: 'Number', value: 35, label: 'Age' },
          ],
        },
      ])

      const recordIds = records.created.map(r => r.id)
      console.log(`Created database ${database.id} with ${recordIds.length} records`)

      // Verify records exist before deletion
      const recordsBefore = await sdk.api.database_records.getSome({ filter: { databaseId: database.id } })
      if (recordsBefore.length !== 3) {
        throw new Error(`Expected 3 records before delete, got ${recordsBefore.length}`)
      }
      console.log(`Verified ${recordsBefore.length} records exist before deletion`)

      // Delete the database
      await sdk.api.databases.deleteOne(database.id)
      console.log(`Deleted database ${database.id}`)

      // Wait a moment for cascade delete to propagate
      await wait(undefined, 500)

      // Verify all records were cascade deleted
      const recordsAfter = await sdk.api.database_records.getSome({ filter: { databaseId: database.id } })

      if (recordsAfter.length !== 0) {
        throw new Error(`Expected 0 records after cascade delete, got ${recordsAfter.length}`)
      }
      console.log(`✓ Verified all records were cascade deleted`)

      // Also verify individual record fetches return 404
      for (const recordId of recordIds) {
        try {
          await sdk.api.database_records.getOne(recordId)
          throw new Error(`Record ${recordId} should have been deleted but was still found`)
        } catch (err: any) {
          if (!err.message?.includes('Could not find') && !err.message?.includes('404')) {
            throw new Error(`Unexpected error fetching deleted record: ${err.message}`)
          }
          // Expected: record not found
        }
      }
      console.log(`✓ Verified individual record fetches return not found`)

      return true
    },
    { onResult: (result) => result === true }
  )

  // Test 2: Verify database with no records can be deleted without error
  await async_test(
    'cascade delete - deleting empty database works',
    async () => {
      const database = await sdk.api.databases.createOne({
        title: `__Test__EmptyDB_${Date.now()}`,
        fields: [{ type: 'Text', label: "Field" }],
      })

      // Delete immediately without adding records
      await sdk.api.databases.deleteOne(database.id)

      // Verify database is gone
      try {
        await sdk.api.databases.getOne(database.id)
        throw new Error('Database should have been deleted')
      } catch (err: any) {
        if (!err.message?.includes('Could not find') && !err.message?.includes('404')) {
          throw new Error(`Unexpected error: ${err.message}`)
        }
      }

      return true
    },
    { onResult: (result) => result === true }
  )

  // Test 3: Verify records from other databases are not affected
  await async_test(
    'cascade delete - only affects records from deleted database',
    async () => {
      // Create two databases
      const database1 = await sdk.api.databases.createOne({
        title: `__Test__DB1_${Date.now()}`,
        fields: [{ type: 'Text', label: "Value" }],
      })
      const database2 = await sdk.api.databases.createOne({
        title: `__Test__DB2_${Date.now()}`,
        fields: [{ type: 'Text', label: "Value" }],
      })

      // Create records in both databases
      await sdk.api.database_records.createOne({
        databaseId: database1.id,
        values: [{ type: 'Text', value: 'DB1 Record', label: 'Value' }],
      })
      const db2Record = await sdk.api.database_records.createOne({
        databaseId: database2.id,
        values: [{ type: 'Text', value: 'DB2 Record', label: 'Value' }],
      })

      // Delete database1
      await sdk.api.databases.deleteOne(database1.id)
      await wait(undefined, 500)

      // Verify database2's record still exists
      const db2RecordAfter = await sdk.api.database_records.getOne(db2Record.id)
      if (!db2RecordAfter) {
        throw new Error('Database2 record should still exist')
      }
      console.log(`✓ Verified database2 record was not affected by database1 deletion`)

      // Cleanup database2
      await sdk.api.databases.deleteOne(database2.id)

      return true
    },
    { onResult: (result) => result === true }
  )

  console.log("✅ All Database Cascade Delete tests passed!")
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await database_cascade_delete_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Database cascade delete test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Database cascade delete test suite failed:", error)
      process.exit(1)
    })
}
