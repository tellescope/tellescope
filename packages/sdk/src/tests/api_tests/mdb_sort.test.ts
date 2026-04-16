require('source-map-support').install();

import { Session } from "../../sdk"
import {
  assert,
  async_test,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

// Main test function that can be called independently
export const mdb_sort_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("mdbSort Custom Sorting Support")

  // Create test endusers with known field values for sorting
  const testEndusers = await Promise.all([
    sdk.api.endusers.createOne({ fname: 'Alice', lname: 'Smith', email: 'alice-mdbsort@tellescope.com' }),
    sdk.api.endusers.createOne({ fname: 'Bob', lname: 'Jones', email: 'bob-mdbsort@tellescope.com' }),
    sdk.api.endusers.createOne({ fname: 'Charlie', lname: 'Adams', email: 'charlie-mdbsort@tellescope.com' }),
    sdk.api.endusers.createOne({ fname: 'Alice', lname: 'Zeta', email: 'alice2-mdbsort@tellescope.com' }), // Same fname for multi-field test
  ])

  const enduserIds = testEndusers.map(e => e.id)

  try {
    // Test 1: Sort by fname ascending (alphabetical order)
    await async_test(
      'mdbSort-fname-ascending',
      async () => {
        const results = await sdk.api.endusers.getSome({
          filter: { id: { _in: enduserIds } },
          mdbSort: { fname: 1 },
        })
        assert(results.length === 4, 'Expected 4 endusers', `Got ${results.length}`)

        // Verify alphabetical order: Alice, Alice, Bob, Charlie
        assert(results[0].fname === 'Alice', 'First should be Alice')
        assert(results[1].fname === 'Alice', 'Second should be Alice')
        assert(results[2].fname === 'Bob', 'Third should be Bob')
        assert(results[3].fname === 'Charlie', 'Fourth should be Charlie')

        return results
      },
      { onResult: () => true },
    )

    // Test 2: Sort by fname descending (reverse alphabetical order)
    await async_test(
      'mdbSort-fname-descending',
      async () => {
        const results = await sdk.api.endusers.getSome({
          filter: { id: { _in: enduserIds } },
          mdbSort: { fname: -1 },
        })
        assert(results.length === 4, 'Expected 4 endusers')

        // Verify reverse alphabetical order: Charlie, Bob, Alice, Alice
        assert(results[0].fname === 'Charlie', 'First should be Charlie')
        assert(results[1].fname === 'Bob', 'Second should be Bob')
        assert(results[2].fname === 'Alice', 'Third should be Alice')
        assert(results[3].fname === 'Alice', 'Fourth should be Alice')

        return results
      },
      { onResult: () => true },
    )

    // Test 3: Multi-field sort (fname ascending, then lname ascending for ties)
    await async_test(
      'mdbSort-multi-field',
      async () => {
        const results = await sdk.api.endusers.getSome({
          filter: { id: { _in: enduserIds } },
          mdbSort: { fname: 1, lname: 1 },
        })
        assert(results.length === 4, 'Expected 4 endusers')

        // Verify multi-field sort:
        // Alice Smith (fname: Alice, lname: Smith)
        // Alice Zeta  (fname: Alice, lname: Zeta)
        // Bob Jones   (fname: Bob)
        // Charlie Adams (fname: Charlie)
        assert(results[0].fname === 'Alice' && results[0].lname === 'Smith', 'First should be Alice Smith')
        assert(results[1].fname === 'Alice' && results[1].lname === 'Zeta', 'Second should be Alice Zeta')
        assert(results[2].fname === 'Bob', 'Third should be Bob')
        assert(results[3].fname === 'Charlie', 'Fourth should be Charlie')

        return results
      },
      { onResult: () => true },
    )

    // Test 4: mdbSort combined with mdbFilter
    await async_test(
      'mdbSort-with-mdbFilter',
      async () => {
        const results = await sdk.api.endusers.getSome({
          mdbFilter: {
            email: { $in: ['alice-mdbsort@tellescope.com', 'alice2-mdbsort@tellescope.com'] },
            fname: 'Alice', // Only get Alice endusers
          },
          mdbSort: { lname: 1 }, // Sort by last name
        })
        assert(results.length === 2, 'Expected 2 Alice endusers', `Got ${results.length}`)

        // Verify both are Alice and sorted by lname: Smith, then Zeta
        assert(results[0].fname === 'Alice' && results[0].lname === 'Smith', 'First Alice should be Smith')
        assert(results[1].fname === 'Alice' && results[1].lname === 'Zeta', 'Second Alice should be Zeta')

        return results
      },
      { onResult: () => true },
    )

    // Test 5: mdbSort keyset pagination via mdbFilter $or
    // Note: filter is ignored when mdbFilter is present, so both id scoping and keyset cursor
    // must be expressed in mdbFilter.
    await async_test(
      'mdbSort-keyset-pagination',
      async () => {
        const testEmails = [
          'alice-mdbsort@tellescope.com',
          'alice2-mdbsort@tellescope.com',
          'bob-mdbsort@tellescope.com',
          'charlie-mdbsort@tellescope.com',
        ]

        // Page 1: first 2 results sorted by fname ascending → both Alices
        const page1 = await sdk.api.endusers.getSome({
          mdbFilter: { email: { $in: testEmails } },
          mdbSort: { fname: 1 },
          limit: 2,
        })
        assert(page1.length === 2, 'Expected 2 endusers on page 1')
        assert(page1[0].fname === 'Alice', 'Page 1 first should be Alice')
        assert(page1[1].fname === 'Alice', 'Page 1 second should be Alice')

        // Page 2: keyset cursor — fname > last seen fname ('Alice')
        const lastFname = page1[page1.length - 1].fname
        const page2 = await sdk.api.endusers.getSome({
          mdbFilter: {
            email: { $in: testEmails },
            fname: { $gt: lastFname },
          },
          mdbSort: { fname: 1 },
          limit: 2,
        })
        assert(page2.length === 2, 'Expected 2 endusers on page 2')
        assert(page2[0].fname === 'Bob', 'Page 2 first should be Bob')
        assert(page2[1].fname === 'Charlie', 'Page 2 second should be Charlie')

        return [...page1, ...page2]
      },
      { onResult: () => true },
    )

    // Test 6: mdbSort with projection (ensure both work together)
    await async_test(
      'mdbSort-with-projection',
      async () => {
        const results = await sdk.api.endusers.getSome({
          filter: { id: { _in: enduserIds } },
          mdbSort: { fname: -1 },
          projection: { fname: 1, lname: 1 },
        })
        assert(results.length === 4, 'Expected 4 endusers')

        // Verify sort order (descending)
        assert(results[0].fname === 'Charlie', 'First should be Charlie')

        // Verify projection (only fname, lname, plus id and createdAt)
        assert(results[0].fname !== undefined, 'fname should be present')
        assert(results[0].lname !== undefined, 'lname should be present')
        assert((results[0] as any).email === undefined, 'email should NOT be present')

        return results
      },
      { onResult: () => true },
    )

    // Test 7: Non-admin access with mdbSort (RBA still applies)
    await async_test(
      'non-admin-mdbSort',
      async () => {
        const results = await sdkNonAdmin.api.endusers.getSome({
          filter: { id: { _in: enduserIds } },
          mdbSort: { fname: 1 },
        })

        // Non-admin should still get results (RBA should apply)
        assert(Array.isArray(results), 'Non-admin should receive an array response')

        // Verify sort order
        if (results.length >= 2) {
          const fnames = results.map(e => e.fname)
          // Should be sorted alphabetically
          assert(fnames[0]! <= fnames[1]!, 'Non-admin results should be sorted')
        }

        return results
      },
      { onResult: () => true },
    )

    // Test 8: mdbSort fallback behavior (no mdbSort uses sortBy default)
    await async_test(
      'no-mdbSort-fallback',
      async () => {
        // Without mdbSort, should fall back to default sorting by _id
        const results = await sdk.api.endusers.getSome({
          filter: { id: { _in: enduserIds } },
          sortBy: 'updatedAt',
          sort: 'oldFirst',
        })
        assert(results.length === 4, 'Expected 4 endusers')

        // Verify traditional sortBy still works when mdbSort not provided
        assert(results[0].id !== undefined, 'Should return valid endusers')

        return results
      },
      { onResult: () => true },
    )

  } finally {
    // Cleanup: Delete test resources
    try {
      for (const enduserId of enduserIds) {
        await sdk.api.endusers.deleteOne(enduserId)
      }
    } catch (error) {
      console.error('Cleanup error:', error)
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
    await mdb_sort_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ mdbSort test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ mdbSort test suite failed:", error)
      process.exit(1)
    })
}
