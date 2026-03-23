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
export const get_some_projection_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("getSome Projection Support")

  // Create test enduser
  const testEnduser = await sdk.api.endusers.createOne({ fname: 'ProjectionTest', lname: 'User', email: 'projection-test@tellescope.com' })

  let observationIds: string[] = []

  try {
    // Create test observations
    const obs1 = await sdk.api.enduser_observations.createOne({
      enduserId: testEnduser.id,
      status: 'final',
      category: 'vital-signs',
      measurement: { value: 120, unit: 'mmHg' },
    })
    const obs2 = await sdk.api.enduser_observations.createOne({
      enduserId: testEnduser.id,
      status: 'final',
      category: 'vital-signs',
      measurement: { value: 80, unit: 'mmHg' },
    })
    const obs3 = await sdk.api.enduser_observations.createOne({
      enduserId: testEnduser.id,
      status: 'final',
      category: 'vital-signs',
      measurement: { value: 98, unit: 'bpm' },
    })
    observationIds = [obs1.id, obs2.id, obs3.id]

    // Test 1: Inclusion projection returns only specified fields
    await async_test(
      'projection-inclusion',
      async () => {
        const results = await sdk.api.enduser_observations.getSome({
          filter: { enduserId: testEnduser.id },
          projection: { timestamp: 1, measurement: 1, enduserId: 1 },
        })
        assert(results.length === 3, 'Expected 3 observations with projection', 'Got correct count with projection')

        for (const r of results) {
          assert(r.id !== undefined, 'id should always be present')
          assert(r.createdAt !== undefined, 'createdAt should always be present')
          assert(r.measurement !== undefined, 'measurement should be present in projection')
          assert(r.enduserId !== undefined, 'enduserId should be present in projection')
          assert(r.timestamp !== undefined, 'timestamp should be present in projection')
          // Fields NOT in projection should be excluded
          assert((r as any).status === undefined, 'status should NOT be present when not in projection')
          assert((r as any).category === undefined, 'category should NOT be present when not in projection')
        }
        return results
      },
      { onResult: () => true },
    )

    // Test 2: No projection returns all fields (backward compatibility)
    await async_test(
      'no-projection-returns-all-fields',
      async () => {
        const results = await sdk.api.enduser_observations.getSome({
          filter: { enduserId: testEnduser.id },
        })
        assert(results.length === 3, 'Expected 3 observations without projection')

        for (const r of results) {
          assert(r.id !== undefined, 'id should be present')
          assert(r.status !== undefined, 'status should be present without projection')
          assert(r.category !== undefined, 'category should be present without projection')
          assert(r.measurement !== undefined, 'measurement should be present without projection')
          assert(r.enduserId !== undefined, 'enduserId should be present without projection')
        }
        return results
      },
      { onResult: () => true },
    )

    // Test 3: Projection with other filters (filter, limit, sortBy)
    await async_test(
      'projection-with-filters',
      async () => {
        const results = await sdk.api.enduser_observations.getSome({
          filter: { enduserId: testEnduser.id },
          projection: { measurement: 1 },
          limit: 2,
          sortBy: 'timestamp',
        })
        assert(results.length === 2, 'Expected 2 observations with limit=2', `Got ${results.length}`)

        for (const r of results) {
          assert(r.measurement !== undefined, 'measurement should be present in projection')
          assert((r as any).status === undefined, 'status should NOT be present when not in projection')
        }
        return results
      },
      { onResult: () => true },
    )

    // Test 4: Projection works across different models (endusers)
    await async_test(
      'projection-on-endusers',
      async () => {
        const results = await sdk.api.endusers.getSome({
          filter: { email: 'projection-test@tellescope.com' },
          projection: { fname: 1, email: 1 },
        })
        assert(results.length >= 1, 'Expected at least 1 enduser')

        const enduser = results[0]
        assert(enduser.id !== undefined, 'id should always be present')
        assert(enduser.fname !== undefined, 'fname should be present in projection')
        assert(enduser.email !== undefined, 'email should be present in projection')
        assert((enduser as any).lname === undefined, 'lname should NOT be present when not in projection')
        return results
      },
      { onResult: () => true },
    )

    // Test 5: Projection with pagination (lastId)
    await async_test(
      'projection-with-pagination',
      async () => {
        // First page
        const page1 = await sdk.api.enduser_observations.getSome({
          filter: { enduserId: testEnduser.id },
          projection: { measurement: 1, enduserId: 1 },
          limit: 2,
          sort: 'oldFirst',
        })
        assert(page1.length === 2, 'Expected 2 observations on first page')

        // Second page using lastId from first page
        const lastId = page1[page1.length - 1].id
        const page2 = await sdk.api.enduser_observations.getSome({
          filter: { enduserId: testEnduser.id },
          projection: { measurement: 1, enduserId: 1 },
          limit: 2,
          sort: 'oldFirst',
          lastId,
        })
        assert(page2.length === 1, 'Expected 1 observation on second page')

        // Verify consistent fields across pages
        for (const r of [...page1, ...page2]) {
          assert(r.measurement !== undefined, 'measurement should be present across pages')
          assert(r.enduserId !== undefined, 'enduserId should be present across pages')
          assert((r as any).status === undefined, 'status should NOT be present across pages')
        }
        return [...page1, ...page2]
      },
      { onResult: () => true },
    )

    // Test 6: Empty projection returns all fields (no crash)
    await async_test(
      'empty-projection',
      async () => {
        const results = await sdk.api.enduser_observations.getSome({
          filter: { enduserId: testEnduser.id },
          projection: {},
        })
        assert(results.length === 3, 'Expected 3 observations with empty projection')

        for (const r of results) {
          assert(r.status !== undefined, 'status should be present with empty projection')
          assert(r.category !== undefined, 'category should be present with empty projection')
          assert(r.measurement !== undefined, 'measurement should be present with empty projection')
        }
        return results
      },
      { onResult: () => true },
    )

    // Test 7: Non-admin access with projection (RBA still applies)
    await async_test(
      'non-admin-projection',
      async () => {
        const results = await sdkNonAdmin.api.enduser_observations.getSome({
          filter: { enduserId: testEnduser.id },
          projection: { measurement: 1, enduserId: 1 },
        })
        // Non-admin should still get results (RBA should apply)
        assert(Array.isArray(results), 'Non-admin should receive an array response')

        for (const r of results) {
          assert(r.measurement !== undefined, 'measurement should be present for non-admin projection')
          assert(r.enduserId !== undefined, 'enduserId should be present for non-admin projection')
        }
        return results
      },
      { onResult: () => true },
    )

  } finally {
    // Cleanup: Delete test resources
    try {
      for (const obsId of observationIds) {
        await sdk.api.enduser_observations.deleteOne(obsId)
      }
      await sdk.api.endusers.deleteOne(testEnduser.id)
    } catch (error) {
      console.error('Cleanup error:', error)
      // Try to at least delete the enduser (cascade deletes observations)
      try {
        await sdk.api.endusers.deleteOne(testEnduser.id)
      } catch (deleteError) {
        console.error('Failed to delete test enduser:', deleteError)
      }
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
    await get_some_projection_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ getSome projection test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ getSome projection test suite failed:", error)
      process.exit(1)
    })
}
