require('source-map-support').install();

import { Session } from "../../sdk"
import { 
  async_test,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

// Test function that can be called independently
export const create_user_notifications_trigger_tests = async ({ sdk } : { sdk: Session }) => {
  log_header("Create User Notifications Trigger Tests")
  
  // Test resource tracking
  let testEnduser: any
  let triggerId: string | undefined
  let formId: string | undefined
  
  try {
    // Test 1: Setup - Create enduser assigned to the authenticated user
    await async_test(
      'setup - create test enduser assigned to authenticated user',
      async () => {
        testEnduser = await sdk.api.endusers.createOne({
          assignedTo: [sdk.userInfo.id]
        })
        
        return testEnduser.assignedTo?.length === 1 && testEnduser.assignedTo[0] === sdk.userInfo.id
      },
      { onResult: (result) => result === true }
    )

    // set up trigger
    await async_test(
      'create trigger - field equals event',
      async () => {
        const trigger = await sdk.api.automation_triggers.createOne({
          title: `User Notification Test ${Date.now()}`,
          status: 'Active',
          event: {
            type: 'Field Equals',
            info: { 
              field: '0',
              value: 'trigger-test'
            }
          },
          action: {
            type: 'Create User Notifications',
            info: {
              message: 'Field equals notification',
              notificationType: 'field-equals-notification',
              careTeamOnly: true,
              maxUsers: 1
            }
          }
        })
        triggerId = trigger.id
        return !!trigger.id
      },
      { onResult: (result) => result === true }
    )

    // Test 4: Submit form and verify notification
    await async_test(
      'submit form - verify notification created',
      async () => {
        await sdk.api.endusers.updateOne(testEnduser.id, {
          fields: {
            '0': 'trigger-test'
          }
        })

        // Wait up to 10 seconds for notification
        for (let i = 0; i < 10; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const notifications = await sdk.api.user_notifications.getSome({ filter: {
            type: 'field-equals-notification',
            userId: sdk.userInfo.id
          } })
          
          if (notifications.length > 0) {
            console.log(`✓ Found notification after ${i + 1} seconds`)
            
            const notification = notifications[0]
            
            // Verify notification structure and relatedRecords
            console.log(`Notification details:`)
            console.log(`  - Type: ${notification.type}`)
            console.log(`  - User ID: ${notification.userId}`)
            console.log(`  - Message: ${notification.message}`)
            console.log(`  - Related Records: ${JSON.stringify(notification.relatedRecords)}`)
            
            // Check if relatedRecords contains our test enduser
            const hasCorrectEnduser = notification.relatedRecords?.some(record => 
              record.type === 'enduser' && record.id === testEnduser.id
            )
            
            if (!hasCorrectEnduser) {
              console.log(`❌ Notification does not contain correct enduser ID`)
              console.log(`   Expected enduser ID: ${testEnduser.id}`)
              console.log(`   Found related records: ${JSON.stringify(notification.relatedRecords)}`)
              return false
            }
            
            console.log(`✓ Notification correctly associated with enduser ${testEnduser.id}`)
            return true
          }
        }
        
        console.log(`❌ No notification found after 10 seconds`)
        return false
      },
      { onResult: (result) => result === true }
    )

    console.log("✅ Create User Notifications trigger test passed!")
    
  } catch (error) {
    console.error('Test execution error:', error)
    throw error
  } finally {
    // Cleanup
    console.log("🧹 Cleaning up test resources...")
    
    try {
      if (triggerId) {
        await sdk.api.automation_triggers.deleteOne(triggerId)
      }
      
      if (formId) {
        await sdk.api.forms.deleteOne(formId)
      }
      
      if (testEnduser?.id) {
        await sdk.api.endusers.deleteOne(testEnduser.id)
      }
      
      const testNotifications = (await sdk.api.user_notifications.getSome({}))
        .filter(n => n.type === 'field-equals-notification')
      
      for (const notification of testNotifications) {
        await sdk.api.user_notifications.deleteOne(notification.id)
      }
      
    } catch (cleanupError) {
      console.error('Cleanup error (non-fatal):', cleanupError)
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
    await create_user_notifications_trigger_tests({ sdk })
  }
  
  runTests()
    .then(() => {
      console.log("✅ Create User Notifications trigger test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Create User Notifications trigger test suite failed:", error)
      process.exit(1)
    })
}