import express from "express"
import bodyParser from 'body-parser'
import crypto from "crypto"

import {
  assert,
  async_test,
  log_header,
  wait,
} from "@tellescope/testing"
import {
  objects_equivalent, object_is_empty
} from "@tellescope/utilities"

import {
  WEBHOOK_MODELS,
  WebhookSupportedModel,
  WebhookRecord,
  WebhookCall,
  CalendarEvent,
  CUDSubscription,
  AutomationAction,
} from "@tellescope/types-models"

import { EnduserSession, Session } from "../sdk"
import { ChatMessage, Meeting } from "@tellescope/types-client"

const [email, password] = [process.env.TEST_EMAIL, process.env.TEST_PASSWORD]
const [email2, password2] = [process.env.TEST_EMAIL_2, process.env.TEST_PASSWORD_2]
const [nonAdminEmail, nonAdminPassword] = [process.env.NON_ADMIN_EMAIL, process.env.NON_ADMIN_PASSWORD]
const subUserEmail = process.env.SUB_EMAIL

const host = process.env.TEST_URL || 'http://localhost:8080'
const businessId = '60398b1131a295e64f084ff6'
const enduserSDK = new EnduserSession({ host, businessId })

if (!(email && subUserEmail && password && email2 && password2 && nonAdminEmail && nonAdminPassword)) {
  console.error("Set TEST_EMAIL and TEST_PASSWORD")
  process.exit(1)
}

const sdk = new Session({ host: 'http://localhost:8080' })
const sdkSub = new Session({ host: 'http://localhost:8080' })
const nonAdminSdk = new Session({ host: 'http://localhost:8080' })

const app = express()
app.use(bodyParser.urlencoded({ extended: true, limit: '25mb' }))
app.use(bodyParser.json({ limit: "25mb" }))

const PORT = 3999 
const TEST_SECRET = "this is a test secret for verifying integrity of web hooks"
const webhookEndpoint = '/handle-webhook'
const webhookURL = `http://127.0.0.1:${PORT}${webhookEndpoint}`

const sha256 = (s: string) => crypto.createHash('sha256').update(s).digest('hex')

const verify_integrity = ({ type, message, event, records, timestamp, integrity } : { 
  type: string, 
  message: string, 
  event?: CalendarEvent,
  records: WebhookRecord[], 
  timestamp: string, 
  integrity: string,
}) => (
  sha256(
    type === "automation" 
      ? message + timestamp + TEST_SECRET
      : type === 'calendar_event_reminder'
          ? event?.id + timestamp + TEST_SECRET 
          : records.map(r => r.id).join('') + timestamp + TEST_SECRET
  ) === integrity
)

const handledEvents: WebhookCall[] = []
app.post(webhookEndpoint, (req, res) => {
  const body = req.body as WebhookCall
  // console.log('got hook', body.records, body.timestamp, body.integrity)

  if (!verify_integrity(body)) {
    console.error("Integrity check failed for request", JSON.stringify(body, null, 2))
    process.exit(1)
  }

  handledEvents.push(req.body)
  res.status(204).end()
})

const fullSubscription = {} as { [K in WebhookSupportedModel]: CUDSubscription }
const emptySubscription = {} as { [K in WebhookSupportedModel]: CUDSubscription }
for (const model in WEBHOOK_MODELS) {
  fullSubscription[model as WebhookSupportedModel] = { create: true, update: true, delete: true }
  emptySubscription[model as WebhookSupportedModel] = { create: false, update: false, delete: false }
}

const CHECK_WEBHOOK_DELAY_MS = 75
let webhookIndex = 0
const check_next_webhook = async (evaluate: (hook: WebhookCall) => boolean, name: string, error: string, isSubscribed: boolean, noHookExpected?: boolean) => {
  if (isSubscribed === false) return

  await wait(undefined, CHECK_WEBHOOK_DELAY_MS) // wait for hook to post

  const event = handledEvents[webhookIndex]
  if (noHookExpected) {
    assert(!event, error, name)
  } else {
    assert(!!event, (error || '') + ' (did not get hook)', name || 'got hook')
  }
  if (!event) return // ensure webhookIndex not incremented

  const success = evaluate(event)
  assert(success, error, name)
  if (!success) { console.error('Got', event) }

  webhookIndex++
}

const chats_tests = async (isSubscribed: boolean) => {
  log_header(`Chats Tests, isSubscribed=${isSubscribed}`)

  const enduser = await sdk.api.endusers.createOne({ email: 'chatwebhooktest@tellescope.com' })
  const room = await sdk.api.chat_rooms.createOne({ 
    userIds: [sdk.userInfo.id, nonAdminSdk.userInfo.id], 
    enduserIds: [enduser.id] 
  })

  const chat = await sdk.api.chats.createOne({ roomId: room.id, message: "Hello hello hi hello" })
  await check_next_webhook(
    ({ records, relatedRecords }) => {
      const record = records[0] as ChatMessage

      return (
        objects_equivalent(record, chat) && 
        relatedRecords[record.roomId] !== undefined &&
        relatedRecords[record.senderId as string] !== undefined &&
        relatedRecords[nonAdminSdk.userInfo.id] !== undefined &&
        relatedRecords[enduser.id] !== undefined &&
        relatedRecords[record.roomId]?.id  === room.id &&
        relatedRecords[record.senderId as string]?.id === room.userIds?.[0] &&
        relatedRecords[nonAdminSdk.userInfo.id]?.id  === room.userIds?.[1] &&
        relatedRecords[enduser.id]?.id === room.enduserIds?.[0]
      )
    },
    'Create chat error', 'Create chat webhook', isSubscribed
  )

  // cleanup
  await Promise.all([
    sdk.api.chat_rooms.deleteOne(room.id),
    sdk.api.endusers.deleteOne(enduser.id)
  ])

  // when chatroom support added for webhooks, check deletion here
  // await check_next_webhook(a => objects_equivalent(a.records, [chat_room]), 'Delete chat room error', 'Delete chat room webhook', isSubscribed)
}

const meetings_tests = async (isSubscribed: boolean) => {
  log_header(`Meetings Tests, isSubscribed=${isSubscribed}`)

  const enduser = await sdk.api.endusers.createOne({ email: 'deleteme@tellescope.com' })
  const meeting = await sdk.api.meetings.start_meeting()

  await check_next_webhook(a => (
      // objects_equivalent(a.records[0]?.meetingInfo, meeting.meeting)
      (a.records[0] as Meeting).attendees?.length === 1
      && (a.records[0] as Meeting).attendees?.[0].id === sdk.userInfo.id
    ),
    'Create meeting error', 'Create meeting webhook', isSubscribed
  )

  await sdk.api.meetings.add_attendees_to_meeting({ id: meeting.id, attendees: [{ type: 'enduser', id: enduser.id }]})
  await check_next_webhook(
    a => (
      a.records[0].id === meeting.id 
      && a.type === 'update'
      && a.records[0].attendees.length === 2
      && !!a.records[0].attendees.find((a: { id: string }) => a.id === enduser.id)
    ), 
    'Add attendees webhook error', 'add attendees webhook', 
    isSubscribed
  )

  // cleanup
  await sdk.api.meetings.end_meeting({ id: meeting.id }) // also cleans up messages
  await check_next_webhook(
    a => (a.records[0].id === meeting.id && a.records[0].status === 'ended' && a.type === 'update'),
    'End meeting error', 'end meeting webhook', 
    isSubscribed
  )

  const meetings = await sdk.api.meetings.my_meetings()
  const endedMeeting = meetings.find(m => m.id === meeting.id) 
  assert(
    !!endedMeeting && endedMeeting.status === 'ended' && !!endedMeeting.endedAt, 
    'Meeting missing updated values on end', 
    'Meeting ended correctly'
  )

  const meetingWithAttendees = await sdk.api.meetings.start_meeting({ attendees: [{ id: enduser.id, type: 'enduser' }]})
  await check_next_webhook((a => (
      a.records[0] as Meeting).attendees?.length === 2
    ),
    'Create meeting with attendees error', 'Create meeting with attendees webhook', isSubscribed
  )

  await sdk.api.meetings.end_meeting({ id: meetingWithAttendees.id }) // also cleans up messages

  await sdk.api.endusers.deleteOne(enduser.id)
}

const endusers_tests = async (isSubscribed: boolean) => {
  log_header(`Endusers Tests, isSubscribed=${isSubscribed}`)

  if (isSubscribed) {
    await sdk.api.webhooks.update({ subscriptionUpdates: { 
      ...emptySubscription, 
      chats: { create: true }, 
      meetings: { create: true, update: true, delete: false },
      endusers: { create: false, update: true, delete: false },
    }})
  }

  const enduser = await sdk.api.endusers.createOne({ email: 'deleteme@tellescope.com' })

  const update = { assignedTo: [sdk.userInfo.id] }
  await sdk.api.endusers.updateOne(enduser.id, update)
  await sdk.api.endusers.updateOne(enduser.id, { fields: { 'dontIncludeInWebhook': true } }, { dontSendWebhook: true })
  await check_next_webhook(
    a => {
      delete a.updates?.[0]?.recordBeforeUpdate.humanReadableId
      delete a.updates?.[0]?.recordBeforeUpdate.lockId
      delete a.updates?.[0]?.recordBeforeUpdate.updatedAt
      delete (enduser as any).updatedAt
      delete (enduser as any).___didInsert

      return (
         objects_equivalent(a.updates?.[0]?.recordBeforeUpdate, enduser)
      && objects_equivalent(a.updates?.[0]?.update, update)
      )
    },
    'Enduser update error', 'Update enduser webhook', isSubscribed
  ) 

  await sdk.api.endusers.set_password({ id: enduser.id, password: 'initialPassword' })
  await check_next_webhook(
    a => !(a.records?.[0] as any)?.password,
    'Enduser set password error', 'Set enduser password webhook', isSubscribed
  ) 

  // cleanup
  if (isSubscribed) {
    await sdk.api.webhooks.update({ subscriptionUpdates: { 
      ...emptySubscription, 
      chats: { create: true, update: false, delete: false }, 
      meetings: { create: true, update: true, delete: false },
    }})
  }

  await sdk.api.endusers.deleteOne(enduser.id)
}

const sub_organization_tests = async (isSubscribed: boolean) => {
  log_header(`Sub organization Tests, isSubscribed=${isSubscribed}`)

  if (isSubscribed) {
    await sdk.api.webhooks.update({ subscriptionUpdates: { 
      ...emptySubscription, 
      endusers: { create: true, update: false, delete: false },
    }})
  }

  const enduserSub = await sdk.api.endusers.createOne({ email: 'deleteme@tellescope.com' })

  await check_next_webhook(
    a => {
      const webhookEnduser = a.records[0]
      delete webhookEnduser.humanReadableId
      delete webhookEnduser.lockId
      delete webhookEnduser.updatedAt
      delete (enduserSub as any).updatedAt

      return (
         objects_equivalent(webhookEnduser, enduserSub)
      )
    },
    'Enduser create sub error', 'Create enduser sub webhook', isSubscribed
  ) 

  // cleanup
  if (isSubscribed) {
    await sdk.api.webhooks.update({ subscriptionUpdates: { 
      ...emptySubscription, 
      chats: { create: true }, 
      meetings: { create: true, update: true, delete: false },
    }})
  }

  await sdk.api.endusers.deleteOne(enduserSub.id)
}


const form_response_tests = async (isSubscribed: boolean) => {
  log_header(`Form Response Tests, isSubscribed=${isSubscribed}`)

  if (isSubscribed) {
    await sdk.api.webhooks.update({ subscriptionUpdates: { 
      ...emptySubscription, 
      form_responses: { create: true },
    }})
  }

  const form = await sdk.api.forms.createOne({ title: 'test form' })
  const field = await sdk.api.form_fields.createOne({ 
    title: 'test',
    formId: form.id,
    type: 'string',
    previousFields: [],
  })

  const enduser = await sdk.api.endusers.createOne({ email: 'deleteme@tellescope.com' })
  const { accessCode } = await sdk.api.form_responses.prepare_form_response({
    enduserId: enduser.id,
    formId: form.id,
  })

  const { formResponse } = await sdk.api.form_responses.submit_form_response({
    accessCode,
    responses: [
      {
        fieldId: field.id,
        fieldTitle: 'test',
        answer: {
          type: 'string',
          value: 'testing value',
        }
      }
    ]
  })

  await check_next_webhook(
    a => {
      const hook = a.records[0]

      return (
        hook.id === formResponse.id
        && hook.businessId === formResponse.businessId
        && hook.enduserId === formResponse.enduserId
        && objects_equivalent(formResponse.responses, hook.responses)
      )
    },
    'Form response on submit error', 'Form response on submit', isSubscribed
  ) 

  // cleanup
  if (isSubscribed) {
    await sdk.api.webhooks.update({ subscriptionUpdates: { 
      ...emptySubscription, 
      chats: { create: true }, 
      meetings: { create: true, update: true, delete: false },
    }})
  }

  await Promise.all([
    sdk.api.endusers.deleteOne(enduser.id),
    sdk.api.forms.deleteOne(form.id),
  ])
}

const AUTOMATION_POLLING_DELAY_MS = 3000 - CHECK_WEBHOOK_DELAY_MS
const test_automation_webhooks = async () => {
  log_header("Automation Events")
  const state1 = "State 1", state2 = "State 2";
  const testMessage = 'Test webhook from automation'
  const journey = await sdk.api.journeys.createOne({ 
    title: "Automations Test", 
    defaultState: state1,
  })

  const testAction: AutomationAction = {
    type: 'sendWebhook',
    info: { message: testMessage }
  }
  await sdk.api.automation_steps.createOne({
    journeyId: journey.id,
    events: [{ type: "onJourneyStart", info: {} }],
    action: testAction,
  })

  // trigger a1 on create
  const enduser = await sdk.api.endusers.createOne({ 
    email: "automations@tellescope.com", 
    journeys: { [journey.id]: journey.defaultState } 
  })

  // wait long enough for automation to process and send webhook
  await wait(undefined, 7000)
  
  await check_next_webhook(
    ({ message, ...rest }) => {
      return message === testMessage
    },
    'Automation webhook received', 
    'Automation webhook error', 
    true,
    false
  )

  // cleanup
  await sdk.api.journeys.deleteOne(journey.id) // automation events deleted as side effect
  await sdk.api.endusers.deleteOne(enduser.id)
}


let CALENDAR_EVENT_WEBHOOK_COUNT = 0 // 
const calendar_event_reminders_tests = async (isSubscribed: boolean) => {
  log_header(`Calendar Event Reminders, isSubscribed=${isSubscribed}`)

  const firstRemindAt = AUTOMATION_POLLING_DELAY_MS * 4
  const secondRemindAt = AUTOMATION_POLLING_DELAY_MS * 2
  const thirdRemindAt = AUTOMATION_POLLING_DELAY_MS * 0
  const sampleCalendarEventReminders: CalendarEvent['reminders'] = [
    {
      msBeforeStartTime: firstRemindAt,
      type: 'webhook',
      info: {},
    },
    {
      msBeforeStartTime: thirdRemindAt, // include before secondRemindAt as test that order doesn't matter
      type: 'webhook',
      info: {},
    },
    {
      didRemind: false, // test to ensure order of fields doesn't matter in automations query
      msBeforeStartTime: secondRemindAt,
      type: 'webhook',
      info: {},
    }
  ]
  const calendarEvent = await sdk.api.calendar_events.createOne({
    durationInMinutes: 10,
    startTimeInMS: Date.now() + firstRemindAt,
    title: "Test Notifications",
    reminders: sampleCalendarEventReminders,
  })
  CALENDAR_EVENT_WEBHOOK_COUNT = sampleCalendarEventReminders.length

  // wait long enough for automation to process and send webhook
  await wait(undefined, AUTOMATION_POLLING_DELAY_MS * 2) 
  await check_next_webhook(
    ({ event }) => (
      event?.id === calendarEvent.id && 
      !!event?.reminders?.find(r => r.msBeforeStartTime === firstRemindAt )
    ),
    'Calendar event successful webhook error', 
    'First calendar event reminder received', 
    true,
  )
  await async_test(
    'First reminder progress',
    () => sdk.api.calendar_events.getOne(calendarEvent.id),
    { onResult: c => (
        c.nextReminderInMS === c.startTimeInMS - secondRemindAt 
        && c.reminders?.filter(r => r.didRemind).length === 1
        && c.startTimeInMS === calendarEvent.startTimeInMS // ensure this isn't changed in background
      ) 
    }
  )

  await wait(undefined, AUTOMATION_POLLING_DELAY_MS) 
  await check_next_webhook(
    () => true,
    "Correctly didn't get webhook yet", 
    'Got calendar event webhook too early', 
    true, true,
  )
  await async_test(
    'First reminder progress pending',
    () => sdk.api.calendar_events.getOne(calendarEvent.id),
    { onResult: c => (
        c.nextReminderInMS === c.startTimeInMS - secondRemindAt 
        && c.reminders?.filter(r => r.didRemind).length === 1
        && c.startTimeInMS === calendarEvent.startTimeInMS // ensure this isn't changed in background
      ) 
    }
  )

  await wait(undefined, AUTOMATION_POLLING_DELAY_MS) 
  await check_next_webhook(
    ({ event }) => (
      event?.id === calendarEvent.id && 
      !!event?.reminders?.find(r => r.msBeforeStartTime === secondRemindAt ) &&
      !!event?.reminders?.find(r => r.msBeforeStartTime === firstRemindAt && r.didRemind === true )
    ),
    'Calendar event successful webhook error', 
    'First calendar event reminder received', 
    true
  )
  await async_test(
    'Second reminder progress',
    () => sdk.api.calendar_events.getOne(calendarEvent.id),
    { onResult: c => (
        c.nextReminderInMS === c.startTimeInMS - thirdRemindAt 
        && c.reminders?.filter(r => r.didRemind).length === 2
        && c.startTimeInMS === calendarEvent.startTimeInMS // ensure this isn't changed in background
      ) 
    }
  )

  await wait(undefined, AUTOMATION_POLLING_DELAY_MS) 
  await check_next_webhook(
    () => true,
    "Correctly didn't get webhook yet", 
    'Got calendar event webhook too early', 
    true, true,
  )
  await async_test(
    'Second reminder progress pending',
    () => sdk.api.calendar_events.getOne(calendarEvent.id),
    { onResult: c => (
        c.nextReminderInMS === c.startTimeInMS - thirdRemindAt 
        && c.reminders?.filter(r => r.didRemind).length === 2
        && c.startTimeInMS === calendarEvent.startTimeInMS // ensure this isn't changed in background
      ) 
    }
  )

  await wait(undefined, AUTOMATION_POLLING_DELAY_MS) 
  await check_next_webhook(
    ({ event }) => (
      event?.id === calendarEvent.id && 
      !!event?.reminders?.find(r => r.msBeforeStartTime === thirdRemindAt ) &&
      !!event?.reminders?.find(r => r.msBeforeStartTime === secondRemindAt && r.didRemind === true ) &&
      !!event?.reminders?.find(r => r.msBeforeStartTime === firstRemindAt && r.didRemind === true )
    ),
    'Calendar event successful webhook error', 
    'First calendar event reminder received', 
    true
  )

  await wait(undefined, AUTOMATION_POLLING_DELAY_MS) 
  await check_next_webhook(
    () => true,
    "Correctly didn't get webhook yet", 
    'Got calendar event webhook too early', 
    true, true,
  )

  await async_test(
    'Reminders are done processing',
    () => sdk.api.calendar_events.getOne(calendarEvent.id),
    { onResult: c => (
      c.nextReminderInMS === -1 
      && c.startTimeInMS === calendarEvent.startTimeInMS // ensure this isn't changed in background
      && !c.reminders?.find(r => !r.didRemind) 
      && c.reminders?.filter(r => r.didRemind).length === 3
    )}
  )

  // cleanup
  await sdk.api.calendar_events.deleteOne(calendarEvent.id)
}

const self_serve_appointment_booking_tests = async () => {
  log_header("Self Serve Appointment Booking")

  await sdk.api.webhooks.update({ subscriptionUpdates: { 
    ...emptySubscription, 
    calendar_events: { create: true, update: true, delete: false } } 
  })

  const e1 = await sdk.api.endusers.createOne({ email: 'sebass+selfserve@tellescope.com' }) 
  await sdk.api.endusers.set_password({ id: e1.id, password })
  await enduserSDK.authenticate('sebass+selfserve@tellescope.com', password)

  const event30min = await sdk.api.calendar_event_templates.createOne({ 
    title: 'test 1', durationInMinutes: 30, confirmationEmailDisabled: true, confirmationSMSDisabled: true,
  })

  // ensure it doesn't match current day, to avoid errors on testing
  const dayOfWeekStartingSundayIndexedByZero = (new Date().getDay() + 1) % 7 

  await sdk.api.users.updateOne(sdk.userInfo.id, { 
    weeklyAvailabilities: [
      { 
        dayOfWeekStartingSundayIndexedByZero,
        startTimeInMinutes: 60 * 12, // noon,
        endTimeInMinutes: 60 * 14, // 2pm,
      },
    ],
    timezone: 'America/New_York',
  }, {
    replaceObjectFields: true,
  })

  const slots = await enduserSDK.api.calendar_events.get_appointment_availability({
    calendarEventTemplateId: event30min.id,
    from: new Date(),
  })
  const toCancel = (await enduserSDK.api.calendar_events.book_appointment({
    calendarEventTemplateId: event30min.id,
    startTime: new Date(slots.availabilityBlocks[0].startTimeInMS),
    userId: slots.availabilityBlocks[0].userId, 
  })).createdEvent
  await check_next_webhook(
    a => (
      a.type === 'create' &&  a.records[0].id === toCancel.id 
    ), 
    'book-appointment webhook', 'book-appointment webhook error', true,
  )

  await enduserSDK.api.calendar_events.updateOne(toCancel.id, { cancelledAt: new Date() })
  await check_next_webhook(
    a => (
      a.records[0].id === toCancel.id 
      && a.type === 'update'
    ), 
    'cancel appointment webhook', 'cancel appointment webhook error', true,
  )

  const toReschedule = (await enduserSDK.api.calendar_events.book_appointment({
    calendarEventTemplateId: event30min.id,
    startTime: new Date(slots.availabilityBlocks[0].startTimeInMS),
    userId: slots.availabilityBlocks[0].userId, 
  })).createdEvent
  await check_next_webhook(
    a => (
      a.records[0].id === toReschedule.id 
    ), 
    'to reschedule webhook', 'to reschedule webhook error', true,
  )

  const rescheduledAppointment = (await enduserSDK.api.calendar_events.book_appointment({
    calendarEventTemplateId: event30min.id,
    rescheduledCalendarEventId: toReschedule.id,
    startTime: new Date(slots.availabilityBlocks[1].startTimeInMS),
    userId: slots.availabilityBlocks[1].userId, 
  })).createdEvent

  await wait(undefined, 250)

  // should get two webhooks on reschedule, and order may not be guaranteed
  await check_next_webhook(
    a => (
      (a.type === 'create' && a.records[0].id === rescheduledAppointment.id)
    || (a.type === 'update' && a.records[0].id === toReschedule.id && a.description === 'calendar event rescheduled')
    ), 
    'reschedule webhook', 'reschedule webhook error', true,
  )
  await check_next_webhook(
    a => (
      (a.type === 'create' && a.records[0].id === rescheduledAppointment.id)
    || (a.type === 'update' && a.records[0].id === toReschedule.id && a.description === 'calendar event rescheduled')
    ), 
    'reschedule webhook', 'reschedule webhook error', true,
  )

  await Promise.all([
    sdk.api.endusers.deleteOne(e1.id),
    sdk.api.calendar_event_templates.deleteOne(event30min.id),
    sdk.api.calendar_events.deleteOne(toCancel.id),
    sdk.api.calendar_events.deleteOne(toReschedule.id),
    sdk.api.calendar_events.deleteOne(rescheduledAppointment.id),
    sdk.api.users.updateOne(sdk.userInfo.id, 
      { weeklyAvailabilities: [] }, 
      { replaceObjectFields: true },
    ),
    sdk.api.webhooks.update({ subscriptionUpdates: emptySubscription })
  ])
}


const tests: { [K in WebhookSupportedModel  | 'calendarEventReminders' | 'sub']?: (isSubscribed: boolean) => Promise<void> } = {
  form_responses: form_response_tests,
  sub: sub_organization_tests,
  endusers: endusers_tests,
  chats: chats_tests,
  calendarEventReminders: calendar_event_reminders_tests, 
  meetings: meetings_tests,
}

const run_tests = async () => {
  log_header("Webhooks Tests")
  await sdk.authenticate(email, password)
  await sdkSub.authenticate(subUserEmail, password)
  await sdk.reset_db() 
  await nonAdminSdk.authenticate(nonAdminEmail, nonAdminPassword)

  await async_test(
    'configure webhook is admin only',
    () => nonAdminSdk.api.webhooks.configure({ url: webhookURL, secret: TEST_SECRET }),
    { shouldError: true, onError: e => e.message === "Inaccessible" || e.message === "Admin access only"}
  )
  await async_test(
    'update webhook is admin only',
    () => nonAdminSdk.api.webhooks.update({ subscriptionUpdates: fullSubscription }),
    { shouldError: true, onError: e => e.message === "Inaccessible" || e.message === "Admin access only"}
  )

  await async_test(
    'configure webhook',
    () => sdk.api.webhooks.configure({ url: webhookURL, secret: TEST_SECRET }),
    { onResult: _ => true }
  )
  await async_test(
    'configure webhook (overwrite)',
    () => sdk.api.webhooks.configure({ url: webhookURL, secret: TEST_SECRET }),
    { onResult: () => true }
    // { shouldError: true, onError: e => e.message === "Only one webhook configuration is supported per organization. Use /update-webooks to update your configuration." }
  )
  await async_test(
    'get initial webhook configuration',
    () => sdk.api.webhooks.get_configuration({}),
    { onResult: r => r.url === webhookURL && object_is_empty(r.subscriptions ?? {}) }
  )
  await async_test(
    'update webhook (set empty subscription)',
    () => sdk.api.webhooks.update({ subscriptionUpdates: {} }),
    { onResult: _ => true }
  )
  await async_test(
    'update webhook (set partial subscription)',
    () => sdk.api.webhooks.update({ subscriptionUpdates: { chats: { create: true }} }),
    { onResult: _ => true }
  )
  await async_test(
    'update webhook (set subscriptions)',
    () => sdk.api.webhooks.update({ subscriptionUpdates: fullSubscription }),
    { onResult: _ => true }
  )
  await async_test(
    'update webhook invalid model',
    () => sdk.api.webhooks.update({ subscriptionUpdates: { notAModel: { create: false } } as any }),
    { shouldError: true, onError: e => e.message === "Error parsing field subscriptionUpdates: Got unexpected field(s) [notAModel]" }
  )
  await async_test(
    'get initial webhook configuration after updates',
    () => sdk.api.webhooks.get_configuration({}),
    { onResult: r => r.url === webhookURL && objects_equivalent(r.subscriptions, fullSubscription) }
  )

  await self_serve_appointment_booking_tests()

  // reset to only poartial / testing fields
  // todo: subscribe in individual tests to avoid issues in ordering of tests / subscriptions
  await sdk.api.webhooks.update({ subscriptionUpdates: { 
    ...emptySubscription, 
    chats: { create: true }, 
    meetings: { create: true, update: true, delete: false } } 
  })

  log_header("Webhooks Tests with Subscriptions")
  await test_automation_webhooks()
  for (const t in tests) {
    await tests[t as keyof typeof tests]?.(true)
  }
  const finalLength = handledEvents.length

  await async_test(
    'update webhook (set subscriptions empty)',
    () => sdk.api.webhooks.update({ subscriptionUpdates: { ...emptySubscription } }),
    { onResult: _ => true }
  )

  log_header("Webhooks Tests without Subscriptions")
  for (const t in tests) {
    if (tests[t as keyof typeof tests] === tests.calendarEventReminders) {
      continue // don't require subscription / can't unsubscribe
    }

    await tests[t as keyof typeof tests]?.(false)
  }

  assert(finalLength === handledEvents.length, 'length changed after subscriptions', 'No webhooks posted when no subscription')

}

app.listen(PORT, async () => {
  try { 
    await run_tests()
  } catch(err) { console.error(err) }

  process.exit()
})