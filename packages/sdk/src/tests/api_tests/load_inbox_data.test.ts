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

// Main test function that can be called independently

// deprecated endpoint in favor of inbox threads
export const load_inbox_data_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Inbox Loading Tests (deprecated bulk endpoint)")
  const e = await sdk.api.endusers.createOne({ fname: 'Test', lname: 'Testson' })
  const e2 = await sdk.api.endusers.createOne({ fname: 'Test2', lname: 'Testson2' })

  const email = await sdk.api.emails.createOne({
    logOnly: true,
    subject: 'Test Email',
    enduserId: e.id,
    textContent: 'This is a test email',
    inbound: true,
    userId: sdk.userInfo.id,
  })
  const sms = await sdk.api.sms_messages.createOne({
    logOnly: true,
    inbound: true,
    enduserId: e.id,
    message: 'This is a test SMS',
    userId: sdk.userInfo.id,
  })
  const groupMMS = await sdk.api.group_mms_conversations.createOne({ 
    enduserIds: [e.id],
    userIds: [sdk.userInfo.id],
    userStates: [],
  })
  const call = await sdk.api.phone_calls.createOne({ enduserId: e.id, inbound: true, userId: sdk.userInfo.id })
  const thread = await sdk.api.ticket_threads.createOne({ enduserId: e.id, subject: 'test thread' })
  const comment = await sdk.api.ticket_thread_comments.createOne({
    enduserId: e.id,
    html: '',
    inbound: true,
    plaintext: '',
    public: false,
    ticketThreadId: thread.id,
    userId: sdk.userInfo.id,
  })
  const room = await sdk.api.chat_rooms.createOne({ enduserIds: [e.id], userIds: [], title: 'Test Chat Room' })
  
  await sdk.api.chats.createOne({ roomId: room.id, message: 'test', enduserId: e.id, senderId: e.id  })
  await wait (undefined, 500) // allow for recentEnduserTimestamp to be set to indicate inbound chat in chat room

  const updatedRoom = await sdk.api.chat_rooms.getOne(room.id)

  await async_test(
    "Inbox loads messages",
    () => sdk.api.endusers.load_inbox_data({ }),
    { onResult: r => (
         r.chat_rooms.length === 1
      && r.emails.length === 1
      && r.sms_messages.length === 1
      && r.group_mms_conversations.length === 1
      && r.phone_calls.length === 1
      && r.ticket_thread_comments.length === 1
      && r.endusers.length === 1
    ) }
  )
  await async_test(
    "Inbox loads messages (lastIds)",
    () => sdk.api.endusers.load_inbox_data({ 
      lastChatRoomId: room.id,
      lastEmailId: email.id,
      lastSMSId: sms.id,
      lastGroupMMSId: groupMMS.id,
      lastPhoneCallId: call.id,
      lastTicketThreadCommentId: comment.id,
    }),
    { onResult: r => (
         r.chat_rooms.length === 0
      && r.emails.length === 0
      && r.sms_messages.length === 0
      && r.group_mms_conversations.length === 0
      && r.phone_calls.length === 0
      && r.ticket_thread_comments.length === 0
      && r.endusers.length === 0
    ) }
  )
  await async_test(
    "Inbox loads messages (blank lastIds)",
    () => sdk.api.endusers.load_inbox_data({ 
      lastChatRoomId: '',
      lastEmailId: '',
      lastSMSId: '',
      lastGroupMMSId: '',
      lastPhoneCallId: '',
      lastTicketThreadCommentId: '',
    }),
    { onResult: r => (
         r.chat_rooms.length === 0
      && r.emails.length === 0
      && r.sms_messages.length === 0
      && r.group_mms_conversations.length === 0
      && r.phone_calls.length === 0
      && r.ticket_thread_comments.length === 0
      && r.endusers.length === 0
    ) }
  )
  await async_test(
    "Inbox loads messages (lastUpdatedAt 0 date)",
    () => sdk.api.endusers.load_inbox_data({ 
      lastChatRoomUpdatedAt: new Date(0),
      lastGroupMMSUpdatedAt: new Date(0),
    }),
    { onResult: r => (
         r.chat_rooms.length === 0
      && r.emails.length === 1
      && r.sms_messages.length === 1
      && r.group_mms_conversations.length === 0
      && r.phone_calls.length === 1
      && r.ticket_thread_comments.length === 1
      && r.endusers.length === 1
    ) }
  )
  await async_test(
    "Inbox loads messages (lastUpdatedAt current date)",
    () => sdk.api.endusers.load_inbox_data({ 
      lastChatRoomUpdatedAt: new Date(),
      lastGroupMMSUpdatedAt: new Date(),
    }),
    { onResult: r => (
         r.chat_rooms.length === 1
      && r.emails.length === 1
      && r.sms_messages.length === 1
      && r.group_mms_conversations.length === 1
      && r.phone_calls.length === 1
      && r.ticket_thread_comments.length === 1
      && r.endusers.length === 1
    ) }
  )
  // backend uses $lte instead of $lt in case of different convos that have the same id
  await async_test(
    "Inbox loads messages (lastUpdatedAt initial date)",
    () => sdk.api.endusers.load_inbox_data({ 
      lastChatRoomUpdatedAt: new Date(new Date(room.updatedAt).getTime() - 1),
      lastGroupMMSUpdatedAt: new Date(new Date(groupMMS.updatedAt).getTime() - 1),
    }),
    { onResult: r => (
         r.chat_rooms.length === 0
      && r.emails.length === 1
      && r.sms_messages.length === 1
      && r.group_mms_conversations.length === 0
      && r.phone_calls.length === 1
      && r.ticket_thread_comments.length === 1
      && r.endusers.length === 1
    ) }
  )
  // providing id but using same timestamp filters out the thread itself
  await async_test(
    "Inbox loads messages (lastUpdatedAt initial date and ids provided)",
    () => sdk.api.endusers.load_inbox_data({ 
      lastChatRoomId: room.id,
      lastGroupMMSId: groupMMS.id,
      lastChatRoomUpdatedAt: new Date(new Date(room.updatedAt).getTime()),
      lastGroupMMSUpdatedAt: new Date(new Date(groupMMS.updatedAt).getTime()),
    }),
    { onResult: r => (
         r.chat_rooms.length === 0
      && r.emails.length === 1
      && r.sms_messages.length === 1
      && r.group_mms_conversations.length === 0
      && r.phone_calls.length === 1
      && r.ticket_thread_comments.length === 1
      && r.endusers.length === 1
    ) }
  )

  await async_test(
    "Inbox loads messages with used enduserId",
    () => sdk.api.endusers.load_inbox_data({ enduserIds: [e.id] }),
    { onResult: r => (
         r.chat_rooms.length === 1
      && r.emails.length === 1
      && r.sms_messages.length === 1
      && r.group_mms_conversations.length === 1
      && r.phone_calls.length === 1
      && r.ticket_thread_comments.length === 1
      && r.endusers.length === 1
    ) }
  )
  await async_test(
    "Inbox loads messages with unused enduserId",
    () => sdk.api.endusers.load_inbox_data({ enduserIds: [e2.id] }),
    { onResult: r => (
         r.chat_rooms.length === 0
      && r.emails.length === 0
      && r.sms_messages.length === 0
      && r.group_mms_conversations.length === 0
      && r.phone_calls.length === 0
      && r.ticket_thread_comments.length === 0
      && r.endusers.length === 0
    ) }
  )
  
  await async_test(
    "Inbox loads no messages (filter by self when no threads are assigned)",
    () => sdk.api.endusers.load_inbox_data({ userId: sdk.userInfo.id }),
    { onResult: r => (
         r.chat_rooms.length === 0
      && r.emails.length === 0
      && r.sms_messages.length === 0
      && r.group_mms_conversations.length === 0
      && r.phone_calls.length === 0
      && r.ticket_thread_comments.length === 0
      && r.endusers.length === 0
    ) }
  )

  await async_test(
    "Inbox loads no messages (filter by other when no threads are assigned)",
    () => sdk.api.endusers.load_inbox_data({ userId: sdkNonAdmin.userInfo.id }),
    { onResult: r => (
         r.chat_rooms.length === 0
      && r.emails.length === 0
      && r.sms_messages.length === 0
      && r.group_mms_conversations.length === 0
      && r.phone_calls.length === 0
      && r.ticket_thread_comments.length === 0
      && r.endusers.length === 0
    ) }
  )

  await async_test(
    'Non-admin cannot load inbox data without assignment',
    () => sdkNonAdmin.api.endusers.load_inbox_data({ }),
    {
      onResult: r => (
        r.chat_rooms.length === 0
        && r.emails.length === 0
        && r.sms_messages.length === 0
        && r.group_mms_conversations.length === 0
        && r.phone_calls.length === 0
        && r.ticket_thread_comments.length === 0
        && r.endusers.length === 0
      )
    }
  )
  await async_test(
    'Non-admin cannot load inbox data without assignment with used enduserId',
    () => sdkNonAdmin.api.endusers.load_inbox_data({ enduserIds: [e.id] }),
    {
      onResult: r => (
        r.chat_rooms.length === 0
        && r.emails.length === 0
        && r.sms_messages.length === 0
        && r.group_mms_conversations.length === 0
        && r.phone_calls.length === 0
        && r.ticket_thread_comments.length === 0
        && r.endusers.length === 0
      )
    }
  )
  await async_test(
    'Non-admin cannot load inbox data without assignment with unused enduserId',
    () => sdkNonAdmin.api.endusers.load_inbox_data({ enduserIds: [e2.id] }),
    {
      onResult: r => (
        r.chat_rooms.length === 0
        && r.emails.length === 0
        && r.sms_messages.length === 0
        && r.group_mms_conversations.length === 0
        && r.phone_calls.length === 0
        && r.ticket_thread_comments.length === 0
        && r.endusers.length === 0
      )
    }
  )

  await async_test(
    'Non-admin cannot load inbox data without assignment (self as filter)',
    () => sdkNonAdmin.api.endusers.load_inbox_data({ userId: sdkNonAdmin.userInfo.id }),
    {
      onResult: r => (
        r.chat_rooms.length === 0
        && r.emails.length === 0
        && r.sms_messages.length === 0
        && r.group_mms_conversations.length === 0
        && r.phone_calls.length === 0
        && r.ticket_thread_comments.length === 0
        && r.endusers.length === 0
      )
    }
  )

  await async_test(
    'Non-admin cannot load inbox data without assignment (other user as filter)',
    () => sdkNonAdmin.api.endusers.load_inbox_data({ userId: sdk.userInfo.id }),
    {
      onResult: r => (
        r.chat_rooms.length === 0
        && r.emails.length === 0
        && r.sms_messages.length === 0
        && r.group_mms_conversations.length === 0
        && r.phone_calls.length === 0
        && r.ticket_thread_comments.length === 0
        && r.endusers.length === 0
      )
    }
  )

  // assign to Enduser
  await sdk.api.endusers.updateOne(e.id, { assignedTo: [sdkNonAdmin.userInfo.id] }, { replaceObjectFields: true })
  await async_test(
    'Non-admin can load inbox data with assignment',
    () => sdkNonAdmin.api.endusers.load_inbox_data({ }),
    {
      onResult: r => (
        r.chat_rooms.length === 1
        && r.emails.length === 1
        && r.sms_messages.length === 1
        && r.group_mms_conversations.length === 1
        && r.phone_calls.length === 1
        && r.ticket_thread_comments.length === 1
        && r.endusers.length === 1
      )
    }
  )
  await async_test(
    'Non-admin can load inbox data with assignment and used enduser filter',
    () => sdkNonAdmin.api.endusers.load_inbox_data({ enduserIds: [e.id] }),
    {
      onResult: r => (
        r.chat_rooms.length === 1
        && r.emails.length === 1
        && r.sms_messages.length === 1
        && r.group_mms_conversations.length === 1
        && r.phone_calls.length === 1
        && r.ticket_thread_comments.length === 1
        && r.endusers.length === 1
      )
    }
  )
  await async_test(
    'Non-admin cant load inbox data with assignment and uused enduser filter',
    () => sdkNonAdmin.api.endusers.load_inbox_data({ enduserIds: [e2.id] }),
    {
      onResult: r => (
        r.chat_rooms.length === 0
        && r.emails.length === 0
        && r.sms_messages.length === 0
        && r.group_mms_conversations.length === 0
        && r.phone_calls.length === 0
        && r.ticket_thread_comments.length === 0
        && r.endusers.length === 0
      )
    }
  )
  await async_test(
    'Non-admin can load inbox data with assignment (self as filter)',
    () => sdkNonAdmin.api.endusers.load_inbox_data({ userId: sdkNonAdmin.userInfo.id }),
    {
      onResult: r => (
        r.chat_rooms.length === 1
        && r.emails.length === 1
        && r.sms_messages.length === 1
        && r.group_mms_conversations.length === 1
        && r.phone_calls.length === 1
        && r.ticket_thread_comments.length === 1
        && r.endusers.length === 1
      )
    }
  )
  await async_test(
    'Non-admin can load inbox data with assignment (other user as filter, not assigned)',
    () => sdkNonAdmin.api.endusers.load_inbox_data({ userId: sdk.userInfo.id }),
    {
      onResult: r => (
        r.chat_rooms.length === 0
        && r.emails.length === 0
        && r.sms_messages.length === 0
        && r.group_mms_conversations.length === 0
        && r.phone_calls.length === 0
        && r.ticket_thread_comments.length === 0
        && r.endusers.length === 0
      )
    }
  )
  await sdk.api.endusers.updateOne(e.id, { assignedTo: [sdk.userInfo.id] }, { }) // add other assignment
  await async_test(
    'Non-admin can load inbox data with assignment (other user as filter, assigned)',
    () => sdkNonAdmin.api.endusers.load_inbox_data({ userId: sdk.userInfo.id }),
    {
      onResult: r => (
        r.chat_rooms.length === 1
        && r.emails.length === 1
        && r.sms_messages.length === 1
        && r.group_mms_conversations.length === 1
        && r.phone_calls.length === 1
        && r.ticket_thread_comments.length === 1
        && r.endusers.length === 1
      )
    }
  )


  // assign admin to all threads
  await sdk.api.emails.updateOne(email.id, { assignedTo: [sdk.userInfo.id] }, { replaceObjectFields: true })
  await sdk.api.sms_messages.updateOne(sms.id, { assignedTo: [sdk.userInfo.id] }, { replaceObjectFields: true })
  await sdk.api.group_mms_conversations.updateOne(groupMMS.id, { assignedTo: [sdk.userInfo.id] }, { replaceObjectFields: true })
  await sdk.api.phone_calls.updateOne(call.id, { assignedTo: [sdk.userInfo.id] }, { replaceObjectFields: true })
  await sdk.api.ticket_threads.updateOne(thread.id, { assignedTo: [sdk.userInfo.id] }, { replaceObjectFields: true })
  await sdk.api.ticket_thread_comments.updateOne(comment.id, { assignedTo: [sdk.userInfo.id] }, { replaceObjectFields: true })
  await sdk.api.chat_rooms.updateOne(room.id, { userIds: [sdk.userInfo.id] }, { replaceObjectFields: true })

  await async_test(
    'admin doesnt load inbox data with assignedTo as other filter',
    () => sdk.api.endusers.load_inbox_data({ userId: sdkNonAdmin.userInfo.id }),
    {
      onResult: r => (
        r.chat_rooms.length === 0
        && r.emails.length === 0
        && r.sms_messages.length === 0
        && r.group_mms_conversations.length === 0
        && r.phone_calls.length === 0
        && r.ticket_thread_comments.length === 0
        && r.endusers.length === 0
      )
    }
  )
  await async_test(
    'admin loads inbox data for other user as filter assignedTo',
    () => sdk.api.endusers.load_inbox_data({ userId: sdk.userInfo.id }),
    {
      onResult: r => (
        r.chat_rooms.length === 1
        && r.emails.length === 1
        && r.sms_messages.length === 1
        && r.group_mms_conversations.length === 1
        && r.phone_calls.length === 1
        && r.ticket_thread_comments.length === 1
        && r.endusers.length === 1
      )
    }
  )
  await async_test(
    'admin loads inbox data with no user',
    () => sdk.api.endusers.load_inbox_data({ }),
    {
      onResult: r => (
        r.chat_rooms.length === 1
        && r.emails.length === 1
        && r.sms_messages.length === 1
        && r.group_mms_conversations.length === 1
        && r.phone_calls.length === 1
        && r.ticket_thread_comments.length === 1
        && r.endusers.length === 1
      )
    }
  )
  await async_test(
    'admin loads inbox data with used enduser',
    () => sdk.api.endusers.load_inbox_data({ enduserIds: [e.id] }),
    {
      onResult: r => (
        r.chat_rooms.length === 1
        && r.emails.length === 1
        && r.sms_messages.length === 1
        && r.group_mms_conversations.length === 1
        && r.phone_calls.length === 1
        && r.ticket_thread_comments.length === 1
        && r.endusers.length === 1
      )
    }
  )
  await async_test(
    'admin loads inbox data with unused enduser',
    () => sdk.api.endusers.load_inbox_data({ enduserIds: [e2.id] }),
    {
      onResult: r => (
        r.chat_rooms.length === 0
        && r.emails.length === 0
        && r.sms_messages.length === 0
        && r.group_mms_conversations.length === 0
        && r.phone_calls.length === 0
        && r.ticket_thread_comments.length === 0
        && r.endusers.length === 0
      )
    }
  )

  await async_test(
    'Non-admin cant load inbox data with assignedTo as other (self as filter)',
    () => sdkNonAdmin.api.endusers.load_inbox_data({ userId: sdkNonAdmin.userInfo.id }),
    {
      onResult: r => (
        r.chat_rooms.length === 0
        && r.emails.length === 0
        && r.sms_messages.length === 0
        && r.group_mms_conversations.length === 0
        && r.phone_calls.length === 0
        && r.ticket_thread_comments.length === 0
        && r.endusers.length === 0
      )
    }
  )
  await async_test(
    'Non-admin can load inbox data for other user as filter, assignedTo',
    () => sdkNonAdmin.api.endusers.load_inbox_data({ userId: sdk.userInfo.id }),
    {
      onResult: r => (
        r.chat_rooms.length === 1
        && r.emails.length === 1
        && r.sms_messages.length === 1
        && r.group_mms_conversations.length === 1
        && r.phone_calls.length === 1
        && r.ticket_thread_comments.length === 1
        && r.endusers.length === 1
      )
    }
  )
  await async_test(
    'Non-admin can load inbox data with no user',
    () => sdkNonAdmin.api.endusers.load_inbox_data({ }),
    {
      onResult: r => (
        r.chat_rooms.length === 1
        && r.emails.length === 1
        && r.sms_messages.length === 1
        && r.group_mms_conversations.length === 1
        && r.phone_calls.length === 1
        && r.ticket_thread_comments.length === 1
        && r.endusers.length === 1
      )
    }
  )

  // assign other user to all threads
  await sdk.api.emails.updateOne(email.id, { assignedTo: [sdkNonAdmin.userInfo.id] })
  await sdk.api.sms_messages.updateOne(sms.id, { assignedTo: [sdkNonAdmin.userInfo.id] })
  await sdk.api.group_mms_conversations.updateOne(groupMMS.id, { assignedTo: [sdkNonAdmin.userInfo.id] })
  await sdk.api.phone_calls.updateOne(call.id, { assignedTo: [sdkNonAdmin.userInfo.id] })
  await sdk.api.ticket_threads.updateOne(thread.id, { assignedTo: [sdkNonAdmin.userInfo.id] })
  await sdk.api.ticket_thread_comments.updateOne(comment.id, { assignedTo: [sdkNonAdmin.userInfo.id] })
  await sdk.api.chat_rooms.updateOne(room.id, { assignedTo: [sdkNonAdmin.userInfo.id] })

  await async_test(
    '[both assigned] admin does load inbox data with assignedTo as other filter',
    () => sdk.api.endusers.load_inbox_data({ userId: sdkNonAdmin.userInfo.id }),
    {
      onResult: r => (
        r.chat_rooms.length === 1
        && r.emails.length === 1
        && r.sms_messages.length === 1
        && r.group_mms_conversations.length === 1
        && r.phone_calls.length === 1
        && r.ticket_thread_comments.length === 1
        && r.endusers.length === 1
      )
    }
  )
  await async_test(
    '[both assigned] admin loads inbox data for other user as filter assignedTo',
    () => sdk.api.endusers.load_inbox_data({ userId: sdk.userInfo.id }),
    {
      onResult: r => (
        r.chat_rooms.length === 1
        && r.emails.length === 1
        && r.sms_messages.length === 1
        && r.group_mms_conversations.length === 1
        && r.phone_calls.length === 1
        && r.ticket_thread_comments.length === 1
        && r.endusers.length === 1
      )
    }
  )
  await async_test(
    '[both assigned] admin loads inbox data with no user',
    () => sdk.api.endusers.load_inbox_data({ }),
    {
      onResult: r => (
        r.chat_rooms.length === 1
        && r.emails.length === 1
        && r.sms_messages.length === 1
        && r.group_mms_conversations.length === 1
        && r.phone_calls.length === 1
        && r.ticket_thread_comments.length === 1
        && r.endusers.length === 1
      )
    }
  )
  await async_test(
    '[both assigned] admin loads inbox data with used enduser',
    () => sdk.api.endusers.load_inbox_data({ enduserIds: [e.id] }),
    {
      onResult: r => (
        r.chat_rooms.length === 1
        && r.emails.length === 1
        && r.sms_messages.length === 1
        && r.group_mms_conversations.length === 1
        && r.phone_calls.length === 1
        && r.ticket_thread_comments.length === 1
        && r.endusers.length === 1
      )
    }
  )
  await async_test(
    '[both assigned] admin loads inbox data with unused enduser',
    () => sdk.api.endusers.load_inbox_data({ enduserIds: [e2.id] }),
    {
      onResult: r => (
        r.chat_rooms.length === 0
        && r.emails.length === 0
        && r.sms_messages.length === 0
        && r.group_mms_conversations.length === 0
        && r.phone_calls.length === 0
        && r.ticket_thread_comments.length === 0
        && r.endusers.length === 0
      )
    }
  )

  await async_test(
    '[both assigned] Non-admin can load inbox data with assignedTo as other (self as filter)',
    () => sdkNonAdmin.api.endusers.load_inbox_data({ userId: sdkNonAdmin.userInfo.id }),
    {
      onResult: r => (
        r.chat_rooms.length === 1
        && r.emails.length === 1
        && r.sms_messages.length === 1
        && r.group_mms_conversations.length === 1
        && r.phone_calls.length === 1
        && r.ticket_thread_comments.length === 1
        && r.endusers.length === 1
      )
    }
  )
  await async_test(
    '[both assigned] Non-admin can load inbox data for other user as filter, assignedTo',
    () => sdkNonAdmin.api.endusers.load_inbox_data({ userId: sdk.userInfo.id }),
    {
      onResult: r => (
        r.chat_rooms.length === 1
        && r.emails.length === 1
        && r.sms_messages.length === 1
        && r.group_mms_conversations.length === 1
        && r.phone_calls.length === 1
        && r.ticket_thread_comments.length === 1
        && r.endusers.length === 1
      )
    }
  )
  await async_test(
    '[both assigned] Non-admin can load inbox data with no user',
    () => sdkNonAdmin.api.endusers.load_inbox_data({ }),
    {
      onResult: r => (
        r.chat_rooms.length === 1
        && r.emails.length === 1
        && r.sms_messages.length === 1
        && r.group_mms_conversations.length === 1
        && r.phone_calls.length === 1
        && r.ticket_thread_comments.length === 1
        && r.endusers.length === 1
      )
    }
  )
  await async_test(
    '[both assigned] Non-admin can load inbox data with used enduser',
    () => sdkNonAdmin.api.endusers.load_inbox_data({ enduserIds: [e.id] }),
    {
      onResult: r => (
        r.chat_rooms.length === 1
        && r.emails.length === 1
        && r.sms_messages.length === 1
        && r.group_mms_conversations.length === 1
        && r.phone_calls.length === 1
        && r.ticket_thread_comments.length === 1
        && r.endusers.length === 1
      )
    }
  )
  await async_test(
    '[both assigned] Non-admin cant load inbox data with unused enduser',
    () => sdkNonAdmin.api.endusers.load_inbox_data({ enduserIds: [e2.id] }),
    {
      onResult: r => (
        r.chat_rooms.length === 0
        && r.emails.length === 0
        && r.sms_messages.length === 0
        && r.group_mms_conversations.length === 0
        && r.phone_calls.length === 0
        && r.ticket_thread_comments.length === 0
        && r.endusers.length === 0
      )
    }
  )

  const noAccessRole = await sdk.api.role_based_access_permissions.createOne({
    role: 'No Access',
    permissions: {
      emails: { read: null, create: null, update: null, delete: null },
      sms_messages: { read: null, create: null, update: null, delete: null },
      group_mms_conversations: { read: null, create: null, update: null, delete: null },
      phone_calls: { read: null, create: null, update: null, delete: null },
      ticket_threads: { read: null, create: null, update: null, delete: null },
      ticket_thread_comments: { read: null, create: null, update: null, delete: null },
      chat_rooms: { read: null, create: null, update: null, delete: null },
      // read must be default for endpoint to return non 403
      endusers: { read: 'Default', create: null, update: null, delete: null },
    },
  })

  const roleTestUserEmail = 'inbox.role.test@tellescope.com'
  const roleTestUser = (
    await sdk.api.users.getOne({ email: roleTestUserEmail }).catch(() => null) // throws error on none found
  ) || (
    await sdk.api.users.createOne({ email: roleTestUserEmail, notificationEmailsDisabled: true })
  )
  // ensure role is set, in case GET returned a user without a role or with a different role
  await sdk.api.users.updateOne(roleTestUser.id, { roles: [noAccessRole.role] }, { replaceObjectFields: true })

  // add to care team to ensure this doesn't grant unexpected access
  await sdk.api.endusers.updateOne(e.id, { assignedTo: [roleTestUser.id] })
  await wait(undefined, 2000) // role change triggers a logout

  const sdkNoAccess = new Session({ 
    host,
    authToken: (await sdk.api.users.generate_auth_token({ id: roleTestUser.id })).authToken,
  })
  await async_test('test_authenticated (no access)', sdkNoAccess.test_authenticated, { expectedResult: 'Authenticated!' })
  await async_test('verify no-read on direct API call', sdkNoAccess.api.emails.getSome, handleAnyError) // ensures role is set up correctly

  await async_test(
    "No access reads nothing",
    () => sdkNoAccess.api.endusers.load_inbox_data({ }),
    {
      onResult: r => (
        r.chat_rooms.length === 0
        && r.emails.length === 0
        && r.sms_messages.length === 0
        && r.group_mms_conversations.length === 0
        && r.phone_calls.length === 0
        && r.ticket_thread_comments.length === 0
        && r.endusers.length === 0
      )
    }
  )
  await async_test(
    "No access reads nothing for used enduser",
    () => sdkNoAccess.api.endusers.load_inbox_data({ enduserIds: [e.id] }),
    {
      onResult: r => (
        r.chat_rooms.length === 0
        && r.emails.length === 0
        && r.sms_messages.length === 0
        && r.group_mms_conversations.length === 0
        && r.phone_calls.length === 0
        && r.ticket_thread_comments.length === 0
        && r.endusers.length === 0
      )
    }
  )
  await async_test(
    "No access reads nothing for unused enduser",
    () => sdkNoAccess.api.endusers.load_inbox_data({ enduserIds: [e2.id] }),
    {
      onResult: r => (
        r.chat_rooms.length === 0
        && r.emails.length === 0
        && r.sms_messages.length === 0
        && r.group_mms_conversations.length === 0
        && r.phone_calls.length === 0
        && r.ticket_thread_comments.length === 0
        && r.endusers.length === 0
      )
    }
  )
  await async_test(
    "No access reads nothing (for self)",
    () => sdkNoAccess.api.endusers.load_inbox_data({ userId: roleTestUser.id }),
    {
      onResult: r => (
        r.chat_rooms.length === 0
        && r.emails.length === 0
        && r.sms_messages.length === 0
        && r.group_mms_conversations.length === 0
        && r.phone_calls.length === 0
        && r.ticket_thread_comments.length === 0
        && r.endusers.length === 0
      )
    }
  )
  await async_test(
    "No access reads nothing (for assigned admin)",
    () => sdkNoAccess.api.endusers.load_inbox_data({ userId: sdk.userInfo.id }),
    {
      onResult: r => (
        r.chat_rooms.length === 0
        && r.emails.length === 0
        && r.sms_messages.length === 0
        && r.group_mms_conversations.length === 0
        && r.phone_calls.length === 0
        && r.ticket_thread_comments.length === 0
        && r.endusers.length === 0
      )
    }
  )

  const defaultAccessRole = await sdk.api.role_based_access_permissions.createOne({
    role: 'Default Access',
    permissions: {
      emails: { read: 'Default', create: 'Default', update: 'Default', delete: 'Default' },
      sms_messages: { read: 'Default', create: 'Default', update: 'Default', delete: 'Default' },
      group_mms_conversations: { read: 'Default', create: 'Default', update: 'Default', delete: 'Default' },
      phone_calls: { read: 'Default', create: 'Default', update: 'Default', delete: 'Default' },
      ticket_threads: { read: 'Default', create: 'Default', update: 'Default', delete: 'Default' },
      ticket_thread_comments: { read: 'Default', create: 'Default', update: 'Default', delete: 'Default' },
      chat_rooms: { read: 'Default', create: 'Default', update: 'Default', delete: 'Default' },
      endusers: { read: 'Default', create: 'Default', update: 'Default', delete: 'Default' },
    },
  })
  await sdk.api.users.updateOne(roleTestUser.id, { roles: [defaultAccessRole.role] }, { replaceObjectFields: true })
  await wait(undefined, 2000) // role change triggers a logout
  const sdkDefaultAccess = new Session({ 
    host,
    authToken: (await sdk.api.users.generate_auth_token({ id: roleTestUser.id })).authToken,
  })

  await async_test('test_authenticated (default access)', sdkDefaultAccess.test_authenticated, { expectedResult: 'Authenticated!' })

  await async_test(
    "Default access reads nothing",
    () => sdkDefaultAccess.api.endusers.load_inbox_data({ }),
    {
      onResult: r => (
        r.chat_rooms.length === 0
        && r.emails.length === 0
        && r.sms_messages.length === 0
        && r.group_mms_conversations.length === 0
        && r.phone_calls.length === 0
        && r.ticket_thread_comments.length === 0
        && r.endusers.length === 0
      )
    }
  )
  await async_test(
    "Default access reads nothing for used enduser",
    () => sdkDefaultAccess.api.endusers.load_inbox_data({ enduserIds: [e.id] }),
    {
      onResult: r => (
        r.chat_rooms.length === 0
        && r.emails.length === 0
        && r.sms_messages.length === 0
        && r.group_mms_conversations.length === 0
        && r.phone_calls.length === 0
        && r.ticket_thread_comments.length === 0
        && r.endusers.length === 0
      )
    }
  )
  await async_test(
    "Default access reads nothing for unused enduser",
    () => sdkDefaultAccess.api.endusers.load_inbox_data({ enduserIds: [e2.id] }),
    {
      onResult: r => (
        r.chat_rooms.length === 0
        && r.emails.length === 0
        && r.sms_messages.length === 0
        && r.group_mms_conversations.length === 0
        && r.phone_calls.length === 0
        && r.ticket_thread_comments.length === 0
        && r.endusers.length === 0
      )
    }
  )
  await async_test(
    "Default access reads nothing (for self)",
    () => sdkDefaultAccess.api.endusers.load_inbox_data({ userId: roleTestUser.id }),
    {
      onResult: r => (
        r.chat_rooms.length === 0
        && r.emails.length === 0
        && r.sms_messages.length === 0
        && r.group_mms_conversations.length === 0
        && r.phone_calls.length === 0
        && r.ticket_thread_comments.length === 0
        && r.endusers.length === 0
      )
    }
  )
  await async_test(
    "Default access reads nothing (for assigned admin)",
    () => sdkDefaultAccess.api.endusers.load_inbox_data({ userId: sdk.userInfo.id }),
    {
      onResult: r => (
        r.chat_rooms.length === 0
        && r.emails.length === 0
        && r.sms_messages.length === 0
        && r.group_mms_conversations.length === 0
        && r.phone_calls.length === 0
        && r.ticket_thread_comments.length === 0
        && r.endusers.length === 0
      )
    }
  )


  // assign default user to the specific messages by setting userId, userIds, etc.
  await sdk.api.emails.updateOne(email.id, { assignedTo: [], userId: roleTestUser.id }, { replaceObjectFields: true })
  await sdk.api.sms_messages.updateOne(sms.id, { assignedTo: [], userId: roleTestUser.id }, { replaceObjectFields: true })
  await sdk.api.group_mms_conversations.updateOne(groupMMS.id, { assignedTo: [], userIds: [roleTestUser.id] }, { replaceObjectFields: true })
  await sdk.api.phone_calls.updateOne(call.id, { assignedTo: [], userId: roleTestUser.id }, { replaceObjectFields: true })
  await sdk.api.ticket_thread_comments.updateOne(comment.id, {assignedTo: [],  userId: roleTestUser.id }, { replaceObjectFields: true })
  // need to replace assignedTo for userIds to take precedent
  await sdk.api.chat_rooms.updateOne(room.id, { assignedTo: [], userIds: [roleTestUser.id] }, { replaceObjectFields: true})

  await async_test(
    "Default access reads stuff when assigned",
    () => sdkDefaultAccess.api.endusers.load_inbox_data({ }),
    {
      onResult: r => (
        r.chat_rooms.length === 1
        && r.emails.length === 1
        && r.sms_messages.length === 1
        && r.group_mms_conversations.length === 1
        && r.phone_calls.length === 1
        && r.ticket_thread_comments.length === 1
        && r.endusers.length === 1
      )
    }
  )
  await async_test(
    "Default access reads stuff when assigned for used enduser",
    () => sdkDefaultAccess.api.endusers.load_inbox_data({ enduserIds: [e.id] }),
    {
      onResult: r => (
        r.chat_rooms.length === 1
        && r.emails.length === 1
        && r.sms_messages.length === 1
        && r.group_mms_conversations.length === 1
        && r.phone_calls.length === 1
        && r.ticket_thread_comments.length === 1
        && r.endusers.length === 1
      )
    }
  )
  await async_test(
    "Default access reads stuff when assigned for unused enduser",
    () => sdkDefaultAccess.api.endusers.load_inbox_data({ enduserIds: [e2.id] }),
    {
      onResult: r => (
        r.chat_rooms.length === 0
        && r.emails.length === 0
        && r.sms_messages.length === 0
        && r.group_mms_conversations.length === 0
        && r.phone_calls.length === 0
        && r.ticket_thread_comments.length === 0
        && r.endusers.length === 0
      )
    }
  )
  await async_test(
    "Default access reads stuff when assigned (for self)",
    () => sdkDefaultAccess.api.endusers.load_inbox_data({ userId: roleTestUser.id }),
    {
      onResult: r => (
        r.chat_rooms.length === 1
        && r.emails.length === 1
        && r.sms_messages.length === 1
        && r.group_mms_conversations.length === 1
        && r.phone_calls.length === 1
        && r.ticket_thread_comments.length === 1
        && r.endusers.length === 1
      )
    }
  )


  // PhoneNumber filtering tests
  log_header("PhoneNumber Filtering Tests")
  
  // Create test data with specific phone numbers (using validator example format)
  const testPhone1 = '+15555555550'
  const testPhone2 = '+15555555551'
  const testPhone3 = '+15555555555'
  
  // Note: Create SMS without phoneNumber first, then update them
  const smsWithPhone1 = await sdk.api.sms_messages.createOne({
    logOnly: true,
    inbound: true,
    enduserId: e.id,
    message: 'SMS with phone 1',
    userId: sdk.userInfo.id,
  })
  
  const smsWithPhone2 = await sdk.api.sms_messages.createOne({
    logOnly: true,
    inbound: true,
    enduserId: e2.id,
    message: 'SMS with phone 2',
    userId: sdk.userInfo.id,
  })
  
  // Update SMS messages with phone numbers (may bypass creation validation)
  await sdk.api.sms_messages.updateOne(smsWithPhone1.id, { phoneNumber: testPhone1 })
  await sdk.api.sms_messages.updateOne(smsWithPhone2.id, { phoneNumber: testPhone2 })
  
  const callInboundPhone1 = await sdk.api.phone_calls.createOne({
    enduserId: e.id,
    inbound: true,
    to: testPhone1,
    from: '+15550000000',
    userId: sdk.userInfo.id
  })
  
  await sdk.api.phone_calls.createOne({
    enduserId: e2.id,
    inbound: false,
    to: '+15550000000', 
    from: testPhone2,
    userId: sdk.userInfo.id
  })
  
  const callInboundPhone3 = await sdk.api.phone_calls.createOne({
    enduserId: e.id,
    inbound: true,
    to: testPhone3,
    from: '+15550000000',
    userId: sdk.userInfo.id
  })

  await async_test(
    "PhoneNumber filter: SMS messages filtered by phoneNumber",
    () => sdk.api.endusers.load_inbox_data({ phoneNumber: testPhone1 }),
    { onResult: r => (
         r.sms_messages.length === 1
      && r.sms_messages[0].id === smsWithPhone1.id
      && r.sms_messages[0].phoneNumber === testPhone1
      && r.phone_calls.length === 1 // inbound call with matching 'to' field
      && r.phone_calls[0].id === callInboundPhone1.id
    ) }
  )

  await async_test(
    "PhoneNumber filter: Inbound calls filtered by 'to' field",
    () => sdk.api.endusers.load_inbox_data({ phoneNumber: testPhone3 }),
    { onResult: r => (
         r.phone_calls.length === 1
      && r.phone_calls[0].id === callInboundPhone3.id
      && r.phone_calls[0].to === testPhone3
      && r.phone_calls[0].inbound === true
      && r.sms_messages.length === 0
    ) }
  )

  await async_test(
    "PhoneNumber filter: No matches returns empty results",
    () => sdk.api.endusers.load_inbox_data({ phoneNumber: '+15555555559' }),
    { onResult: r => (
         r.sms_messages.length === 0
      && r.phone_calls.length === 0
    ) }
  )

  await async_test(
    "PhoneNumber filter: Combined with enduserIds filter",
    () => sdk.api.endusers.load_inbox_data({ phoneNumber: testPhone1, enduserIds: [e.id] }),
    { onResult: r => (
         r.sms_messages.length === 1
      && r.sms_messages[0].id === smsWithPhone1.id
      && r.phone_calls.length === 1
      && r.phone_calls[0].id === callInboundPhone1.id
    ) }
  )

  await async_test(
    "PhoneNumber filter: Combined with enduserIds filter (no match)",
    () => sdk.api.endusers.load_inbox_data({ phoneNumber: testPhone1, enduserIds: [e2.id] }),
    { onResult: r => (
         r.sms_messages.length === 0
      && r.phone_calls.length === 0
    ) }
  )

  await async_test(
    "PhoneNumber filter: SMS and phone calls filtered correctly", 
    () => sdk.api.endusers.load_inbox_data({ phoneNumber: testPhone1 }),
    { onResult: r => (
         r.sms_messages.length === 1 // SMS correctly filtered
      && r.phone_calls.length === 1 // Phone calls correctly filtered
    ) }
  )

  await async_test(
    "No phoneNumber filter: All messages load normally",
    () => sdk.api.endusers.load_inbox_data({ }),
    { onResult: r => (
         // Should return all messages including both original and phoneNumber test data
         r.sms_messages.length >= 3 // original + 2 new SMS messages
      && r.phone_calls.length >= 3 // original + 2 new inbound phone calls
    ) }
  )

  await Promise.all([
    sdk.api.endusers.deleteOne(e.id),
    sdk.api.endusers.deleteOne(e2.id),
    sdk.api.chat_rooms.deleteOne(room.id),
    sdk.api.role_based_access_permissions.deleteOne(noAccessRole.id),
    sdk.api.role_based_access_permissions.deleteOne(defaultAccessRole.id),
    sdk.api.users.deleteOne(roleTestUser.id),
  ])
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await load_inbox_data_tests({ sdk, sdkNonAdmin })
  }
  
  runTests()
    .then(() => {
      console.log("✅ Load inbox data test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Load inbox data test suite failed:", error)
      process.exit(1)
    })
}