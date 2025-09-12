require('source-map-support').install();

import { Session } from "../../sdk"
import { 
  log_header,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

/**
 * Tests for the "Assign to Incoming Message" trigger action
 * Verifies assignment works for all incoming message types: Email, SMS, and ChatRoom
 */

export const message_assignment_trigger_tests = async ({ sdk }: { sdk: Session }) => {
  log_header("Message Assignment Trigger Tests")

  // Create different patients for each test to avoid rate limiting
  const [emailPatient, smsPatient, chatPatient] = (await sdk.api.endusers.createSome([
    { fname: 'Email', lname: 'Patient', assignedTo: [sdk.userInfo.id] }, // Assign to care team
    { fname: 'SMS', lname: 'Patient', assignedTo: [sdk.userInfo.id] },   // Assign to care team
    { fname: 'Chat', lname: 'Patient', assignedTo: [sdk.userInfo.id] },  // Assign to care team
  ])).created

  console.log(`Created test patients:`)
  console.log(`  Email: ${emailPatient.id}`)
  console.log(`  SMS: ${smsPatient.id}`)
  console.log(`  Chat: ${chatPatient.id}`)

  let emailTrigger: any
  let smsTrigger: any
  let chatTrigger: any
  let emailMessage: any
  let smsMessage: any
  let chatRoom: any
  let chatMessage: any

  try {
    // Create triggers using the "Incoming Message" event type
    emailTrigger = await sdk.api.automation_triggers.createOne({
      title: `Email Message Assignment Test ${Date.now()}`,
      status: 'Active',
      event: {
        type: 'Incoming Message',
        info: {
          channels: ['Email'], // Only trigger for email messages
        }
      },
      action: {
        type: 'Assign to Incoming Message',
        info: {
          careTeamOnly: true,
          maxUsers: 3
        }
      }
    })

    smsTrigger = await sdk.api.automation_triggers.createOne({
      title: `SMS Message Assignment Test ${Date.now()}`,
      status: 'Active',
      event: {
        type: 'Incoming Message',
        info: {
          channels: ['SMS'], // Only trigger for SMS messages
        }
      },
      action: {
        type: 'Assign to Incoming Message',
        info: {
          careTeamOnly: true,
          maxUsers: 3
        }
      }
    })

    chatTrigger = await sdk.api.automation_triggers.createOne({
      title: `Chat Message Assignment Test ${Date.now()}`,
      status: 'Active',
      event: {
        type: 'Incoming Message',
        info: {
          channels: ['Chat'], // Only trigger for chat messages
        }
      },
      action: {
        type: 'Assign to Incoming Message',
        info: {
          careTeamOnly: true,
          maxUsers: 3
        }
      }
    })

    console.log(`Created triggers:`)
    console.log(`  Email Trigger: ${emailTrigger.id}`)
    console.log(`  SMS Trigger: ${smsTrigger.id}`)
    console.log(`  Chat Trigger: ${chatTrigger.id}`)

    // Test 1: Email Message Assignment
    console.log(`\n=== Testing Email Message Assignment ===`)
    
    // Create email with logOnly: true to prevent actual sending
    // Note: In real scenarios, emails have source fields added by the system
    // For testing purposes, we'll create the email and test the assignment logic
    emailMessage = await sdk.api.emails.createOne({
      logOnly: true,
      enduserId: emailPatient.id,
      subject: 'Test Incoming Email __TELLESCOPE_TEST_INCOMING_EMAIL_AUTOMATION__',
      textContent: 'This is a test incoming email for assignment __TELLESCOPE_TEST_INCOMING_EMAIL_AUTOMATION__',
    })
    console.log(`Created email message: ${emailMessage.id}`)
    console.log(`Note: In production, creating an inbound email would automatically trigger the Incoming Message event`)
    console.log(`For testing, we rely on the trigger system to process the created email`)

    // Wait for trigger processing
    await wait(undefined, 1000)

    // Check if email was assigned
    const updatedEmail = await sdk.api.emails.getOne(emailMessage.id)
    console.log(`Email assignment result:`)
    console.log(`  assignedTo: ${JSON.stringify(updatedEmail.assignedTo)}`)
    console.log(`  Expected user: ${sdk.userInfo.id}`)
    
    const emailAssigned = updatedEmail.assignedTo?.includes(sdk.userInfo.id) ?? false
    if (emailAssigned) {
      console.log(`✅ Email message successfully assigned to user`)
    } else {
      console.log(`❌ Email message assignment failed`)
    }

    // Test 2: SMS Message Assignment  
    console.log(`\n=== Testing SMS Message Assignment ===`)
    
    // Create inbound SMS with logOnly: true and inbound: true
    smsMessage = await sdk.api.sms_messages.createOne({
      logOnly: true,
      inbound: true, // Critical: only inbound messages should trigger
      enduserId: smsPatient.id,
      message: 'This is a test incoming SMS for assignment __TELLESCOPE_TEST_INCOMING_SMS_AUTOMATION__',
    })
    console.log(`Created SMS message: ${smsMessage.id}`)
    console.log(`Note: In production, creating an inbound SMS would automatically trigger the Incoming Message event`)
    console.log(`For testing, we rely on the trigger system to process the created SMS`)

    // Wait for trigger processing
    await wait(undefined, 1000)

    // Check if SMS was assigned
    const updatedSMS = await sdk.api.sms_messages.getOne(smsMessage.id)
    console.log(`SMS assignment result:`)
    console.log(`  assignedTo: ${JSON.stringify(updatedSMS.assignedTo)}`)
    console.log(`  Expected user: ${sdk.userInfo.id}`)
    
    const smsAssigned = updatedSMS.assignedTo?.includes(sdk.userInfo.id) ?? false
    if (smsAssigned) {
      console.log(`✅ SMS message successfully assigned to user`)
    } else {
      console.log(`❌ SMS message assignment failed`)
    }

    // Test 3: Chat Room Assignment
    console.log(`\n=== Testing Chat Room Assignment ===`)
    
    // Create a chat room for the patient
    chatRoom = await sdk.api.chat_rooms.createOne({
      aboutEnduserId: chatPatient.id,
      userIds: [sdk.userInfo.id],
      enduserIds: [chatPatient.id],
    })
    console.log(`Created chat room: ${chatRoom.id}`)

    // Create a chat message in the room (this represents an incoming message)
    chatMessage = await sdk.api.chats.createOne({
      roomId: chatRoom.id,
      message: 'This is a test incoming chat message for assignment',
      senderId: chatPatient.id, // Message from patient (incoming)
    })
    console.log(`Created chat message: ${chatMessage.id}`)
    console.log(`Note: In production, creating an inbound chat would automatically trigger the Incoming Message event`)
    console.log(`For testing, we rely on the trigger system to process the created chat message`)

    // Wait for trigger processing
    await wait(undefined, 1000)

    // Check if chat room was assigned
    const updatedChatRoom = await sdk.api.chat_rooms.getOne(chatRoom.id)
    console.log(`Chat room assignment result:`)
    console.log(`  assignedTo: ${JSON.stringify(updatedChatRoom.assignedTo)}`)
    console.log(`  Expected user: ${sdk.userInfo.id}`)
    
    const chatAssigned = updatedChatRoom.assignedTo?.includes(sdk.userInfo.id) ?? false
    if (chatAssigned) {
      console.log(`✅ Chat room successfully assigned to user`)
    } else {
      console.log(`❌ Chat room assignment failed`)
    }

    // Test 4: Verify outbound messages don't trigger assignment
    console.log(`\n=== Testing Outbound Message Exclusion ===`)
    
    // Create outbound SMS (should NOT trigger assignment)
    const outboundSMS = await sdk.api.sms_messages.createOne({
      logOnly: true,
      inbound: false, // Outbound message
      enduserId: smsPatient.id,
      message: 'This is an outbound SMS that should not trigger assignment __TELLESCOPE_TEST_INCOMING_SMS_AUTOMATION__',
    })
    console.log(`Created outbound SMS: ${outboundSMS.id}`)

    console.log(`Outbound SMS created for verification that it should NOT be assigned`)
    console.log(`The Incoming Message trigger should only activate for inbound: true messages`)

    // Wait for potential trigger processing
    await wait(undefined, 1000)

    // Verify outbound SMS was NOT assigned (should still be null/undefined)
    const unchangedOutboundSMS = await sdk.api.sms_messages.getOne(outboundSMS.id)
    const outboundNotAssigned = !unchangedOutboundSMS.assignedTo || unchangedOutboundSMS.assignedTo.length === 0
    
    if (outboundNotAssigned) {
      console.log(`✅ Outbound SMS correctly NOT assigned (as expected)`)
    } else {
      console.log(`❌ Outbound SMS was incorrectly assigned: ${JSON.stringify(unchangedOutboundSMS.assignedTo)}`)
    }

    // Summary
    console.log(`\n=== Test Results Summary ===`)
    console.log(`Email Assignment: ${emailAssigned ? '✅ PASSED' : '❌ FAILED'}`)
    console.log(`SMS Assignment: ${smsAssigned ? '✅ PASSED' : '❌ FAILED'}`)
    console.log(`Chat Assignment: ${chatAssigned ? '✅ PASSED' : '❌ FAILED'}`)
    console.log(`Outbound Exclusion: ${outboundNotAssigned ? '✅ PASSED' : '❌ FAILED'}`)

    const allTestsPassed = emailAssigned && smsAssigned && chatAssigned && outboundNotAssigned
    console.log(`\nOverall Result: ${allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`)

    if (!allTestsPassed) {
      throw new Error('Message assignment trigger tests failed')
    }

    // Cleanup test triggers
    await Promise.all([
      sdk.api.automation_triggers.deleteOne(emailTrigger.id),
      sdk.api.automation_triggers.deleteOne(smsTrigger.id), 
      sdk.api.automation_triggers.deleteOne(chatTrigger.id),
    ])
    console.log(`Cleaned up test triggers`)

    // Cleanup test patients  
    await Promise.all([
      sdk.api.endusers.deleteOne(emailPatient.id),
      sdk.api.endusers.deleteOne(smsPatient.id),
      sdk.api.endusers.deleteOne(chatPatient.id),
    ])
    console.log(`Cleaned up test patients`)

    return { success: true, results: { emailAssigned, smsAssigned, chatAssigned, outboundNotAssigned } }

  } finally {
    // Ensure cleanup even if tests fail
    try {
      const cleanupPromises = []
      
      if (emailTrigger?.id) cleanupPromises.push(sdk.api.automation_triggers.deleteOne(emailTrigger.id).catch(() => {}))
      if (smsTrigger?.id) cleanupPromises.push(sdk.api.automation_triggers.deleteOne(smsTrigger.id).catch(() => {}))
      if (chatTrigger?.id) cleanupPromises.push(sdk.api.automation_triggers.deleteOne(chatTrigger.id).catch(() => {}))
      
      if (emailPatient?.id) cleanupPromises.push(sdk.api.endusers.deleteOne(emailPatient.id).catch(() => {}))
      if (smsPatient?.id) cleanupPromises.push(sdk.api.endusers.deleteOne(smsPatient.id).catch(() => {}))
      if (chatPatient?.id) cleanupPromises.push(sdk.api.endusers.deleteOne(chatPatient.id).catch(() => {}))
      
      await Promise.all(cleanupPromises)
      console.log(`Final cleanup completed`)
    } catch (error) {
      console.error(`Cleanup error: ${error}`)
    }
  }
}

// Allow running this test file independently
if (require.main === module) {
  const sdk = new Session({ host: process.env.TELLESCOPE_API_URL || 'http://localhost:5000' })
  
  const runTests = async () => {
    await setup_tests(sdk, sdk) // Use same SDK for both admin and non-admin (simplified for this test)
    await message_assignment_trigger_tests({ sdk })
  }
  
  runTests()
    .then(() => {
      console.log("✅ Message assignment trigger tests completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Message assignment trigger tests failed:", error)
      process.exit(1)
    })
}