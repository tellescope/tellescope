require('source-map-support').install();

import { EnduserObservation } from "@tellescope/types-client"
import { Session } from "../../sdk"
import { 
  assert,
  async_test,
  handleAnyError,
  log_header,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.TEST_URL || 'http://localhost:8080' as const

// Main test function that can be called independently
export const enduser_observations_acknowledge_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Enduser Observations Acknowledge Tests")
  
  // Create test enduser
  const testEnduser = await sdk.api.endusers.createOne({})
  
  // Variables for test resource management
  let vitalConfigId: string | undefined
  let triggerId: string | undefined
  let oldObservationIds: string[] = []
  let triggerTestEndusers: string[] = [] // Track endusers created for trigger tests
  
  try {
    // Create test observations
    const testObservations = await sdk.api.enduser_observations.createSome([
      {
        category: 'vital-signs' as const,
        status: 'final' as const,
        enduserId: testEnduser.id,
        measurement: { unit: 'lbs', value: 150 },
        timestamp: new Date(),
      },
      {
        category: 'vital-signs' as const,
        status: 'final' as const,
        enduserId: testEnduser.id,
        measurement: { unit: 'mg/dL', value: 120 },
        timestamp: new Date(),
      },
      {
        category: 'vital-signs' as const,
        status: 'final' as const,
        enduserId: testEnduser.id,
        measurement: { unit: 'mmHg', value: 80 },
        timestamp: new Date(),
      }
    ])
    
    const observationIds = testObservations.created.map(obs => obs.id)

    // Test 1: Original acknowledge functionality (mark as reviewed)
    await async_test(
      'acknowledge - original functionality (mark as reviewed)',
      async () => {
        await sdk.api.enduser_observations.acknowledge({
          ids: [observationIds[0]]
        })
        
        // Verify observation was marked as reviewed
        const observation = await sdk.api.enduser_observations.getOne(observationIds[0])
        return !!observation.reviewedAt && !!observation.reviewedBy
      },
      { onResult: (result) => result === true }
    )

    // Test 2: Set exclusion flag to true
    await async_test(
      'acknowledge - set excludeFromVitalCountLookback to true',
      async () => {
        await sdk.api.enduser_observations.acknowledge({
          ids: [observationIds[1]],
          excludeFromVitalCountLookback: true
        })
        
        // Verify exclusion flag was set
        const observation = await sdk.api.enduser_observations.getOne(observationIds[1])
        return observation.excludeFromVitalCountLookback === true
      },
      { onResult: (result) => result === true }
    )

    // Test 3: Set exclusion flag to false
    await async_test(
      'acknowledge - set excludeFromVitalCountLookback to false',
      async () => {
        await sdk.api.enduser_observations.acknowledge({
          ids: [observationIds[2]],
          excludeFromVitalCountLookback: false
        })
        
        // Verify exclusion flag was set to false
        const observation = await sdk.api.enduser_observations.getOne(observationIds[2])
        return observation.excludeFromVitalCountLookback === false
      },
      { onResult: (result) => result === true }
    )

    // Test 4: Bulk operations - set multiple observations exclusion flag
    await async_test(
      'acknowledge - bulk set exclusion flag',
      async () => {
        await sdk.api.enduser_observations.acknowledge({
          ids: observationIds,
          excludeFromVitalCountLookback: true
        })
        
        // Verify all observations have exclusion flag set
        const observations = await Promise.all(
          observationIds.map(id => sdk.api.enduser_observations.getOne(id))
        )
        
        return observations.every(obs => obs.excludeFromVitalCountLookback === true)
      },
      { onResult: (result) => result === true }
    )

    // Test 5: Bulk operations - remove exclusion flag from multiple observations
    await async_test(
      'acknowledge - bulk remove exclusion flag',
      async () => {
        await sdk.api.enduser_observations.acknowledge({
          ids: observationIds,
          excludeFromVitalCountLookback: false
        })
        
        // Verify all observations have exclusion flag removed
        const observations = await Promise.all(
          observationIds.map(id => sdk.api.enduser_observations.getOne(id))
        )
        
        return observations.every(obs => obs.excludeFromVitalCountLookback === false)
      },
      { onResult: (result) => result === true }
    )

    // Test 6: Empty ids array should fail with validation error
    await async_test(
      'acknowledge - empty ids array validation error',
      () => sdk.api.enduser_observations.acknowledge({
        ids: [],
        excludeFromVitalCountLookback: true
      }),
      handleAnyError
    )

    // Test 7: Verify original acknowledge doesn't affect exclusion flag
    await async_test(
      'acknowledge - original functionality preserves exclusion flag',
      async () => {
        // First set exclusion flag
        await sdk.api.enduser_observations.acknowledge({
          ids: [observationIds[0]],
          excludeFromVitalCountLookback: true
        })
        
        // Then use original acknowledge (without exclusion parameter)
        await sdk.api.enduser_observations.acknowledge({
          ids: [observationIds[0]]
        })
        
        // Verify exclusion flag is preserved and observation is reviewed
        const observation = await sdk.api.enduser_observations.getOne(observationIds[0])
        return observation.excludeFromVitalCountLookback === true && 
               !!observation.reviewedAt && 
               !!observation.reviewedBy
      },
      { onResult: (result) => result === true }
    )

    // ===== VITAL COUNT TRIGGER INTEGRATION TESTS =====
    
    // Test 8: Setup vital configuration and test data BEFORE creating trigger
    await async_test(
      'vital count trigger - setup configuration and test endusers with observations',
      async () => {
        // Create vital configuration for blood pressure
        const vitalConfig = await sdk.api.vital_configurations.createOne({
          title: `Test BP Config ${Date.now()}`,
          unit: 'mmHg',
          ranges: [
            { 
              classification: 'Normal', 
              comparison: { type: 'Less Than', value: 120 }, 
              trendIntervalInMS: 0 
            }
          ]
        })
        vitalConfigId = vitalConfig.id
        
        // Create Test Case 1: Enduser with old observations that should trigger (no exclusions)
        const shouldTriggerEnduser = await sdk.api.endusers.createOne({})
        triggerTestEndusers.push(shouldTriggerEnduser.id)
        
        const oldTimestamp = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        
        await sdk.api.enduser_observations.createSome([
          {
            category: 'vital-signs' as const,
            status: 'final' as const,
            enduserId: shouldTriggerEnduser.id,
            measurement: { unit: 'mmHg', value: 110 },
            timestamp: oldTimestamp,
          },
          {
            category: 'vital-signs' as const,
            status: 'final' as const,
            enduserId: shouldTriggerEnduser.id,
            measurement: { unit: 'mmHg', value: 115 },
            timestamp: oldTimestamp,
          }
        ])
        
        // Create Test Case 2: Enduser with excluded observations that should NOT trigger
        const shouldNotTriggerEnduser = await sdk.api.endusers.createOne({})
        triggerTestEndusers.push(shouldNotTriggerEnduser.id)
        
        const excludedObservations = await sdk.api.enduser_observations.createSome([
          {
            category: 'vital-signs' as const,
            status: 'final' as const,
            enduserId: shouldNotTriggerEnduser.id,
            measurement: { unit: 'mmHg', value: 120 },
            timestamp: oldTimestamp,
          },
          {
            category: 'vital-signs' as const,
            status: 'final' as const,
            enduserId: shouldNotTriggerEnduser.id,
            measurement: { unit: 'mmHg', value: 125 },
            timestamp: oldTimestamp,
          }
        ])
        
        // Immediately set exclusion flags on these observations
        const excludedObsIds = excludedObservations.created.map(obs => obs.id)
        await sdk.api.enduser_observations.acknowledge({
          ids: excludedObsIds,
          excludeFromVitalCountLookback: true
        })
        
        // Create Test Case 3: Enduser with NO observations at all (should NOT trigger)
        const noObservationsEnduser = await sdk.api.endusers.createOne({})
        triggerTestEndusers.push(noObservationsEnduser.id)
        // No observations created for this enduser
        
        // Create Test Case 4: Enduser with RECENT observations (should NOT trigger)
        const recentObservationsEnduser = await sdk.api.endusers.createOne({})
        triggerTestEndusers.push(recentObservationsEnduser.id)
        
        const recentTimestamp = new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago (within 24h)
        await sdk.api.enduser_observations.createSome([
          {
            category: 'vital-signs' as const,
            status: 'final' as const,
            enduserId: recentObservationsEnduser.id,
            measurement: { unit: 'mmHg', value: 135 },
            timestamp: recentTimestamp,
          },
          {
            category: 'vital-signs' as const,
            status: 'final' as const,
            enduserId: recentObservationsEnduser.id,
            measurement: { unit: 'mmHg', value: 140 },
            timestamp: recentTimestamp,
          }
        ])
        
        return !!vitalConfig.id && triggerTestEndusers.length === 4
      },
      { onResult: (result) => result === true }
    )

    // Test 9: Create trigger AFTER all test data is set up
    await async_test(
      'vital count trigger - create trigger after test data setup',
      async () => {
        // Create automation trigger for vital count (looking for 0 readings in last 24 hours)
        const trigger = await sdk.api.automation_triggers.createOne({
          title: `Test Vital Count Trigger __BYPASS_ENDUSER_CUTOFF__ ${Date.now()}`,
          status: 'Active',
          triggerNextAt: new Date(), // Set to current time for immediate processing
          event: {
            type: 'Vital Count',
            info: {
              periodInMS: 24 * 60 * 60 * 1000, // 24 hours  
              minutes: 24 * 60, // Required field: 24 hours in minutes
              comparison: { type: 'Less Than', value: 1 }, // 0 readings in last 24 hours
              units: ['mmHg']
            }
          },
          action: {
            type: 'Add Tags',
            info: { tags: ['No-Vitals-Detected'] }
          }
        })
        
        triggerId = trigger.id
        return !!trigger.id
      },
      { onResult: (result) => result === true }
    )

    // Test 10: Validate trigger processes and SHOULD fire for enduser without exclusions
    await async_test(
      'vital count trigger - should fire for enduser without exclusion flags',
      async () => {
        const shouldTriggerEnduserId = triggerTestEndusers[0]
        
        // Get initial trigger state
        const initialTrigger = await sdk.api.automation_triggers.getOne(triggerId!)
        const initialTriggerNextAt = initialTrigger.triggerNextAt
        console.log(`Initial triggerNextAt: ${initialTriggerNextAt}`)
        
        let triggerProcessed = false
        let endUserTagged = false
        
        // Poll for up to 20 seconds for the trigger to process
        for (let i = 0; i < 20; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Check if trigger processed (triggerNextAt changed)
          const currentTrigger = await sdk.api.automation_triggers.getOne(triggerId!)
          if (currentTrigger.triggerNextAt !== initialTriggerNextAt && !triggerProcessed) {
            triggerProcessed = true
            console.log(`✓ Trigger processed after ${i + 1} seconds - triggerNextAt changed from ${initialTriggerNextAt} to ${currentTrigger.triggerNextAt}`)
          }
          
          // Check if should-trigger enduser was tagged
          const enduser = await sdk.api.endusers.getOne(shouldTriggerEnduserId)
          if (enduser.tags?.includes('No-Vitals-Detected') && !endUserTagged) {
            endUserTagged = true
            console.log(`✓ Should-trigger enduser tagged after ${i + 1} seconds`)
          }
          
          // If both happened, we're done
          if (triggerProcessed && endUserTagged) {
            return true
          }
          
          // Log progress every 5 seconds
          if (i % 5 === 0 && i > 0) {
            console.log(`Still waiting... ${i}s elapsed. Processed: ${triggerProcessed}, Tagged: ${endUserTagged}`)
          }
        }
        
        const finalEnduser = await sdk.api.endusers.getOne(shouldTriggerEnduserId)
        const finalTrigger = await sdk.api.automation_triggers.getOne(triggerId!)
        
        console.log(`Final results after 20s:`)
        console.log(`- Trigger processed: ${triggerProcessed} (triggerNextAt: ${finalTrigger.triggerNextAt})`)
        console.log(`- Should-trigger enduser tagged: ${endUserTagged} (tags: ${JSON.stringify(finalEnduser.tags)})`)
        
        // Test passes if trigger processed AND enduser was tagged (no exclusions)
        return triggerProcessed && endUserTagged
      },
      { onResult: (result) => {
        console.log(`Should-fire trigger result: ${result}`)
        return result === true
      }}
    )

    // Test 11: Validate trigger processes but SHOULD NOT fire for enduser with exclusions
    await async_test(
      'vital count trigger - should NOT fire for enduser with exclusion flags',
      async () => {
        const shouldNotTriggerEnduserId = triggerTestEndusers[1]
        
        // Wait a bit after the first trigger processing to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        let wasTagged = false
        
        // Poll for up to 20 seconds to see if excluded enduser gets tagged (shouldn't happen)
        for (let i = 0; i < 20; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Check if should-not-trigger enduser was tagged (shouldn't happen)
          const enduser = await sdk.api.endusers.getOne(shouldNotTriggerEnduserId)
          if (enduser.tags?.includes('No-Vitals-Detected')) {
            wasTagged = true
            console.log(`! Should-not-trigger enduser was tagged at ${i + 1} seconds despite exclusion flags`)
            break
          }
          
          if (i % 5 === 0 && i > 0) {
            console.log(`Checking excluded enduser... ${i}s elapsed, still no tag (good)`)
          }
        }
        
        const finalEnduser = await sdk.api.endusers.getOne(shouldNotTriggerEnduserId)
        console.log(`Final exclusion test results:`)
        console.log(`- Should-not-trigger enduser tagged: ${wasTagged} (should be false, tags: ${JSON.stringify(finalEnduser.tags)})`)
        
        // Test passes if enduser was NOT tagged (exclusion worked)
        return !wasTagged
      },
      { onResult: (result) => {
        console.log(`Exclusion prevention result: ${result}`)
        return result === true
      }}
    )

    // Test 12: Validate enduser with NO observations should NOT trigger  
    await async_test(
      'vital count trigger - enduser with no observations should NOT trigger',
      async () => {
        const noObservationsEnduserId = triggerTestEndusers[2]
        
        // Wait a bit to avoid overlapping with previous trigger processing
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        let wasTagged = false
        
        // Poll for 10 seconds to see if no-observations enduser gets tagged (shouldn't happen)
        for (let i = 0; i < 10; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const enduser = await sdk.api.endusers.getOne(noObservationsEnduserId)
          if (enduser.tags?.includes('No-Vitals-Detected')) {
            wasTagged = true
            console.log(`! No-observations enduser was tagged at ${i + 1} seconds (should NOT happen)`)
            break
          }
          
          if (i % 3 === 0) {
            console.log(`Checking no-observations enduser... ${i + 1}s elapsed, still no tag (good)`)
          }
        }
        
        const finalEnduser = await sdk.api.endusers.getOne(noObservationsEnduserId)
        console.log(`No-observations test: tagged=${wasTagged} (should be false, tags: ${JSON.stringify(finalEnduser.tags)})`)
        
        return !wasTagged
      },
      { onResult: (result) => {
        console.log(`No-observations prevention result: ${result}`)
        return result === true
      }}
    )

    // Test 13: Validate enduser with RECENT observations should NOT trigger
    await async_test(
      'vital count trigger - enduser with recent observations should NOT trigger',
      async () => {
        const recentObservationsEnduserId = triggerTestEndusers[3]
        
        // Wait a bit to avoid overlapping with previous trigger processing  
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        let wasTagged = false
        
        // Poll for 10 seconds to see if recent-observations enduser gets tagged (shouldn't happen)
        for (let i = 0; i < 10; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const enduser = await sdk.api.endusers.getOne(recentObservationsEnduserId)
          if (enduser.tags?.includes('No-Vitals-Detected')) {
            wasTagged = true
            console.log(`! Recent-observations enduser was tagged at ${i + 1} seconds (should NOT happen)`)
            break
          }
          
          if (i % 3 === 0) {
            console.log(`Checking recent-observations enduser... ${i + 1}s elapsed, still no tag (good)`)
          }
        }
        
        const finalEnduser = await sdk.api.endusers.getOne(recentObservationsEnduserId)
        console.log(`Recent-observations test: tagged=${wasTagged} (should be false, tags: ${JSON.stringify(finalEnduser.tags)})`)
        
        return !wasTagged
      },
      { onResult: (result) => {
        console.log(`Recent-observations prevention result: ${result}`)
        return result === true
      }}
    )

    // Test 14: Verify normal cutoff behavior (without bypass keyword)
    await async_test(
      'vital count trigger - normal cutoff prevents triggering for new endusers',
      async () => {
        // Create a new enduser (will be too new for normal trigger)
        const newEnduser = await sdk.api.endusers.createOne({})
        triggerTestEndusers.push(newEnduser.id)
        
        // Add old observations to this enduser  
        const oldTimestamp = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        await sdk.api.enduser_observations.createSome([
          {
            category: 'vital-signs' as const,
            status: 'final' as const,
            enduserId: newEnduser.id,
            measurement: { unit: 'mmHg', value: 130 },
            timestamp: oldTimestamp,
          }
        ])
        
        // Create trigger WITHOUT bypass keyword
        const normalTrigger = await sdk.api.automation_triggers.createOne({
          title: `Normal Cutoff Trigger ${Date.now()}`, // No bypass keyword
          status: 'Active',
          triggerNextAt: new Date(),
          event: {
            type: 'Vital Count',
            info: {
              periodInMS: 24 * 60 * 60 * 1000,
              minutes: 24 * 60,
              comparison: { type: 'Less Than', value: 1 },
              units: ['mmHg']
            }
          },
          action: {
            type: 'Add Tags',
            info: { tags: ['Normal-Cutoff-Test'] }
          }
        })
        
        let triggerProcessed = false
        let endUserTagged = false
        
        // Poll for trigger processing
        for (let i = 0; i < 15; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const currentTrigger = await sdk.api.automation_triggers.getOne(normalTrigger.id)
          const currentEnduser = await sdk.api.endusers.getOne(newEnduser.id)
          
          if (currentTrigger.triggerNextAt !== normalTrigger.triggerNextAt && !triggerProcessed) {
            triggerProcessed = true
            console.log(`✓ Normal trigger processed after ${i + 1} seconds`)
          }
          
          if (currentEnduser.tags?.includes('Normal-Cutoff-Test')) {
            endUserTagged = true
            console.log(`! Normal trigger tagged new enduser (should NOT happen)`)
            break
          }
          
          if (triggerProcessed && i > 5) break // Give it a few extra seconds after processing
        }
        
        console.log(`Normal cutoff test: processed=${triggerProcessed}, tagged=${endUserTagged}`)
        
        // Clean up the normal trigger
        await sdk.api.automation_triggers.deleteOne(normalTrigger.id)
        
        // Test passes if trigger processed but didn't tag (cutoff worked)
        return triggerProcessed && !endUserTagged
      },
      { onResult: (result) => {
        console.log(`Normal cutoff behavior result: ${result}`)
        return result === true
      }}
    )

    console.log("✅ All Enduser Observations Acknowledge tests passed!")
    console.log("✅ Vital Count trigger integration tests completed!")
    
    // Test load endpoint with exclusion flags
    console.log("\n🧪 Testing load endpoint with excludeFromVitalCountLookback...")
    
    // Test 17: Load endpoint returns excludeFromVitalCountLookback field
    console.log("17. Load endpoint returns excludeFromVitalCountLookback field")
    const loadResult = await sdk.api.enduser_observations.load({
      enduserId: testEnduser.id,
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      to: new Date()
    })
    
    if (loadResult.observations.length === 0) {
      throw new Error("Expected at least one observation in load result")
    }
    
    // Check that all observations have excludeFromVitalCountLookback field (even if undefined/null)
    loadResult.observations.forEach(obs => {
      if (!('excludeFromVitalCountLookback' in obs)) {
        throw new Error("excludeFromVitalCountLookback field missing from load response")
      }
    })
    console.log(`✅ Load endpoint returned ${loadResult.observations.length} observations, all with excludeFromVitalCountLookback field`)
    
    // Test 18: Load endpoint shows mixed exclusion states correctly
    console.log("18. Load endpoint shows mixed exclusion states correctly")
    
    // Create new observations with mixed states
    const mixedObservations = await sdk.api.enduser_observations.createSome([
      {
        category: 'vital-signs' as const,
        status: 'final' as const,
        enduserId: testEnduser.id,
        measurement: { unit: 'mmHg', value: 140 },
        timestamp: new Date(Date.now() - 1000),
        excludeFromVitalCountLookback: true // This one excluded
      },
      {
        category: 'vital-signs' as const,
        status: 'final' as const,
        enduserId: testEnduser.id,
        measurement: { unit: 'mmHg', value: 120 },
        timestamp: new Date(Date.now() - 2000),
        // This one not excluded (undefined)
      },
      {
        category: 'vital-signs' as const,
        status: 'final' as const,
        enduserId: testEnduser.id,
        measurement: { unit: 'mmHg', value: 110 },
        timestamp: new Date(Date.now() - 3000),
        excludeFromVitalCountLookback: false // This one explicitly included
      }
    ])
    
    const mixedLoadResult = await sdk.api.enduser_observations.load({
      enduserId: testEnduser.id,
      from: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago  
      to: new Date()
    })
    
    const excludedObs = mixedLoadResult.observations.find(obs => obs.excludeFromVitalCountLookback === true)
    const includedObs = mixedLoadResult.observations.find(obs => obs.excludeFromVitalCountLookback === false)
    const undefinedObs = mixedLoadResult.observations.find(obs => obs.excludeFromVitalCountLookback === undefined)
    
    if (!excludedObs) {
      throw new Error("Could not find observation with excludeFromVitalCountLookback=true in load result")
    }
    if (!includedObs) {
      throw new Error("Could not find observation with excludeFromVitalCountLookback=false in load result") 
    }
    console.log(`✅ Load endpoint correctly returned mixed exclusion states: excluded=${excludedObs.excludeFromVitalCountLookback}, included=${includedObs.excludeFromVitalCountLookback}, undefined=${undefinedObs?.excludeFromVitalCountLookback}`)
    
    console.log("✅ All load endpoint tests passed!")

  } finally {
    // Cleanup: Delete test resources
    try {
      // Delete automation trigger if created
      if (triggerId) {
        await sdk.api.automation_triggers.deleteOne(triggerId)
      }
      
      // Delete vital configuration if created  
      if (vitalConfigId) {
        await sdk.api.vital_configurations.deleteOne(vitalConfigId)
      }
      
      // Delete main test enduser (this will cascade delete related observations)
      await sdk.api.endusers.deleteOne(testEnduser.id)
      
      // Delete all trigger test endusers (cascade deletes their observations too)
      for (const enduserId of triggerTestEndusers) {
        await sdk.api.endusers.deleteOne(enduserId)
      }
    } catch (error) {
      console.error('Cleanup error:', error)
      // Still delete all endusers even if other cleanup fails
      await sdk.api.endusers.deleteOne(testEnduser.id)
      for (const enduserId of triggerTestEndusers) {
        try {
          await sdk.api.endusers.deleteOne(enduserId)
        } catch (deleteError) {
          console.error(`Failed to delete trigger test enduser ${enduserId}:`, deleteError)
        }
      }
    }
  }
}

// Allow running this test file independently
if (require.main === module) {
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })
  
  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await enduser_observations_acknowledge_tests({ sdk, sdkNonAdmin })
  }
  
  runTests()
    .then(() => {
      console.log("✅ Enduser observations acknowledge test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Enduser observations acknowledge test suite failed:", error)
      process.exit(1)
    })
}