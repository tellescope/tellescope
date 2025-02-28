import React, { useCallback, useContext, useEffect, createContext, useRef, useState } from 'react'

import { TypedUseSelectorHook, createDispatchHook, createSelectorHook, ReactReduxContextValue, Provider, batch } from 'react-redux'
import { createSlice, configureStore,  createAction, Action, EnhancedStore, PayloadAction, Slice } from '@reduxjs/toolkit'
 
import {
  APIError,
  Indexable,
  LoadingStatus,
  LoadedData,
  UNLOADED,
  CustomUpdateOptions,
  SortOption,
} from "@tellescope/types-utilities"

import {
  ChatRoom,
  ChatMessage,
  EngagementEvent, 
  UserDisplayInfo,
  CalendarEvent,
  Email,
  SMSMessage,
  UserNotification,
  Enduser,
  Ticket,
  Meeting,
  Note,
  File,
  Template,
  Form,
  FormResponse,
  Journey,
  User,
  AutomationStep,
  EnduserObservation,
  Forum,
  ForumPost,
  ManagedContentRecord,
  PostComment,
  PostLike,
  FormField,
  Integration,
  Organization,
  CalendarEventRSVP,
  CommentLike,
  DatabaseRecord,
  Database,
  CalendarEventTemplate,
  PortalCustomization,
  CarePlan,
  EnduserTask,
  ManagedContentRecordAssignment,
  RoleBasedAccessPermission,
  AppointmentBookingPage,
  AppointmentLocation,
  Product,
  Purchase,
  PurchaseCredit,
  PhoneCall,
  AnalyticsFrame,
  AvailabilityBlock,
  BackgroundError,
  EnduserView,
  AutomationTrigger,
  SuperbillProvider,
  Superbill,
  EnduserProfileView,
  EnduserMedication,
  PhoneTree,
  EnduserCustomType,
  UserLog,
  TableView,
  EmailSyncDenial,
  TicketThread,
  TicketThreadComment,
  AutomatedAction,
  Configuration,
  TicketQueue,
  GroupMMSConversation,
  EnduserOrder,
  EnduserEncounter,
  ClientModelForName,
  VitalConfiguration,
  BlockedPhone,
  PrescriptionRoute,
  EnduserProblem,
  FlowchartNote,
  WebhookLog,
  FormGroup,
  PortalBranding,
  MessageTemplateSnippet,
  FaxLog,
  CallHoldQueue,
  SuggestedContact,
  DiagnosisCode,
  AllergyCode,
  IntegrationLog,
  EnduserEligibilityResult,
  AgentRecord,
  Waitlist,
} from "@tellescope/types-client"

import {
  useEnduserSession,
  useResolvedSession, 
  useSession,
} from "./index"
import { 
  LoadFunction,
  Session, 
  EnduserSession,
} from '@tellescope/sdk'
import { value_is_loaded } from './loading'
import { matches_organization, object_is_empty, objects_equivalent } from '@tellescope/utilities'
import { Diagnosis, ModelName, ReadFilter, SortBy } from '@tellescope/types-models'

const RESET_CACHE_TYPE = "cache/reset" as const
export const resetStateAction = createAction(RESET_CACHE_TYPE)

export const TellescopeStoreContext = React.createContext<ReactReduxContextValue<AppDispatch>>(null as any);
export const createTellescopeSelector = () => createSelectorHook(TellescopeStoreContext)

type WithId = { id: string | number }

interface FetchContextValue {
  didFetch: (s: string, force?: boolean, refetchInMS?: number) => boolean,
  setFetched: (s: string, b: boolean, timestamp?: boolean) => void;
  reset: () => void;
  getLastId: (m: string) => string | undefined,
  setLastId: (m: string, id: string) => string | undefined,
  getLastDate: (m: string) => Date | undefined,
  setLastDate: (m: string, d: Date) => void,
}
const FetchContext = createContext({} as FetchContextValue)
export const WithFetchContext = ( { children } : { children: React.ReactNode }) => {
  const lookupRef = React.useRef({} as Indexable<{ lastFetch: number, status: boolean }>)  
  const lastIdRef = React.useRef({} as Indexable<string>)  
  const lastDateRef = React.useRef({} as Indexable<Date>)  
  const reset = () => lookupRef.current = {}

  return (
    <FetchContext.Provider value={{
      didFetch: (s, force, refetchInMS=5000) => {
        const { status, lastFetch } = lookupRef.current[s] ?? {}
        if (lastFetch + refetchInMS >= Date.now()) return true // prevent more frequent reloads
        if (force) return false // trigger fetch when forced

        return status // return true status
      },
      setFetched: (s, b, timestamp=true) => {
        lookupRef.current[s] = lookupRef.current[s] ?? {}
        lookupRef.current[s].status = b
        lookupRef.current[s].lastFetch = timestamp ? Date.now() : 0
      },
      reset,
      getLastId: (m) => lastIdRef.current?.[m],
      setLastId: (m, id) => lastIdRef.current[m] = id,
      getLastDate: (m) => lastDateRef.current?.[m],
      setLastDate: (m, d) => lastDateRef.current[m] = d,
     }}>
      {children}
    </FetchContext.Provider>
  )
}

// doesn't throw
export const toLoadedData = async <T,>(p: () => Promise<T>): Promise<{
  status: LoadingStatus.Loaded, value: T,
} | {
  status: LoadingStatus.Error, value: APIError
}> => {
  try {
    return { status: LoadingStatus.Loaded, value: await p() }
  } catch(err: any) {
    return { status: LoadingStatus.Error, value: err }
  }
}

// default add to start
export const add_elements_to_array = <T extends WithId>(a: LoadedData<T[]>, elements: T[], options?: AddOptions) => {
  if (a.status !== LoadingStatus.Loaded) return { status: LoadingStatus.Loaded, value: elements }

  // original / default behavior
  if (!options?.replaceIfMatch) {
    const newValues = elements.filter(e => a.value.find(v => v.id === e.id) === undefined) 
    return { 
      status: LoadingStatus.Loaded, 
      value: options?.addTo === 'end' ? [...a.value, ...newValues] : [...newValues, ...a.value] 
    }
  }

  const newValues = elements.filter(e => a.value.find(v => v.id === e.id) === undefined) 
  const existingOrUpdatedValues = a.value.map(a => 
    elements.find(e => e.id === a.id) ?? a // return a match, deferring to the new element, or keep existing when no match
  )
  return { 
    status: LoadingStatus.Loaded, 
    value: options?.addTo === 'end' ? [...existingOrUpdatedValues, ...newValues] : [...newValues, ...existingOrUpdatedValues] 
  }
}

export const update_elements_in_array = <T extends WithId>(a: LoadedData<T[]>, updates: { [id: string]: Partial<T> }) => {
  if (a.status !== LoadingStatus.Loaded) return a

  return { status: LoadingStatus.Loaded, value: a.value.map(e => !!updates[e.id] ? { ...e, ...updates[e.id] } : e)}
}

export const replace_elements_in_array = <T extends WithId>(a: LoadedData<T[]>, updated: { [id: string]: Partial<T> }) => {
  if (a.status !== LoadingStatus.Loaded) return a

  return { status: LoadingStatus.Loaded, value: a.value.map(e => !!updated[e.id] ? updated[e.id] : e)}
}

export const remove_elements_in_array = <T extends WithId>(a: LoadedData<T[]>, ids: (string | number)[]) => {
  if (a.status !== LoadingStatus.Loaded) return a
  return { status: LoadingStatus.Loaded, value: a.value.filter(v => !ids.includes(v.id) )}
}

type PayloadActionWithOptions <DATA, OPTIONS={}> = PayloadAction<{ value: DATA, options?: OPTIONS }>

interface ListReducers<T> {
  set: (state: LoadedData<T[]>, action: PayloadActionWithOptions<LoadedData<T[]>>) => void; 
  setFetching: (state: LoadedData<T[]>) => void;
  add: (state: LoadedData<T[]>, action: PayloadActionWithOptions<T, AddOptions>) => void; 
  addSome: (state: LoadedData<T[]>, action: PayloadActionWithOptions<T[], AddOptions>) => void; 
  update: (state: LoadedData<T[]>, action: PayloadActionWithOptions<{ id: string, updates: Partial<T>}>) => void; 
  updateSome: (state: LoadedData<T[]>, action: PayloadActionWithOptions<{ [id: string]: Partial<T>}>) => void; 
  modifyElements: (state: LoadedData<T[]>, action: PayloadActionWithOptions<{ filter: (e: T) => boolean, modifier: (e: T) => T }>) => void;
  replace: (state: LoadedData<T[]>, action: PayloadActionWithOptions<{ id: string, updated: T}>) => void; 
  remove: (state: LoadedData<T[]>, action: PayloadActionWithOptions<{ id: string }>) => void; 
  removeSome: (state: LoadedData<T[]>, action: PayloadActionWithOptions<{ ids: string[] }>) => void; 
  [index: string]: any
}

export const createSliceForList = <T extends { id: string | number }, N extends string>(name: N) => createSlice<LoadedData<T[]>, ListReducers<T>, N>({
  name,
  initialState: UNLOADED as LoadedData<T[]>,
  reducers: {
    set: (_, action) => action.payload.value,
    setFetching: (s) => s.status === LoadingStatus.Unloaded ? { status: LoadingStatus.Fetching, value: undefined } : s,
    add: (state, action) => add_elements_to_array(state, [action.payload.value], action.payload.options),
    addSome: (state, action) => add_elements_to_array(state, action.payload.value, action.payload.options),
    update: (state, action) => update_elements_in_array(state, { 
      [action.payload.value.id]: {
        ...action.payload.value.updates,
        updatedAt: (action.payload as any).updatedAt ?? new Date().toString()
      }
    }),
    replace: (state, action) => replace_elements_in_array(state, { [action.payload.value.id]: action.payload.value.updated }),
    updateSome: (state, action) => update_elements_in_array(state, action.payload.value),
    modifyElements: (state, action) => {
      if (state.status !== LoadingStatus.Loaded) return state

      for (let i = 0; i < state.value.length; i++) {
        const element = state.value[i]
        if (action.payload.value.filter(element)) {
          state.value[i] = action.payload.value.modifier(element)
        }
      }

      return state
    },
    remove: (s, a) => remove_elements_in_array(s, [a.payload.value.id]),
    removeSome: (s, a) => remove_elements_in_array(s, a.payload.value.ids),
  },
  extraReducers: (builder) => {
    builder.addCase(resetStateAction, () => {
      return UNLOADED as LoadedData<T[]> 
    })
  },
})

export type ChatRoomDisplayInfo = { id: string } & { [index: string]: UserDisplayInfo }

// export type GCalEventTime = { dateTime: string, date: never } | { dateTime: never, date: string /* YYYY-MM-DD */  }

// export type GCalEvent = {
//   id: string,
//   summary: string,
//   start: GCalEventTime,
//   end: GCalEventTime,
// }

const appointmentBookingPagesSlice = createSliceForList<AppointmentBookingPage, 'appointment_booking_pages'>('appointment_booking_pages')
const appointmentLocationsSlice = createSliceForList<AppointmentLocation, 'appointment_locations'>('appointment_locations')
const chatRoomsSlice = createSliceForList<ChatRoom, 'chat_rooms'>('chat_rooms')
const calendarEventsSlice = createSliceForList<CalendarEvent, 'calendar_events'>('calendar_events')
const calendarEventTemplatesSlice = createSliceForList<CalendarEventTemplate, 'calendar_event_templates'>('calendar_event_templates')
const chatsSlice = createSliceForList<ChatMessage, 'chats'>('chats')
const chatRoomDisplayInfoslice = createSliceForList<ChatRoomDisplayInfo, 'chat-room-display-info'>('chat-room-display-info')
const engagementEventsSlice = createSliceForList<EngagementEvent, 'engagement_events'>('engagement_events')
const emailsSlice = createSliceForList<Email, 'email'>('email')
const smsMessagesSlice = createSliceForList<SMSMessage, 'sms_messages'>('sms_messages')
const userNotifcationsSlice = createSliceForList<UserNotification, 'user_notifications'>('user_notifications')
const endusersSlice = createSliceForList<Enduser, 'endusers'>('endusers')
const ticketsSlice = createSliceForList<Ticket, 'tickets'>('tickets')
const meetingsSlice = createSliceForList<Meeting, 'meetings'>('meetings')
const filesSlice = createSliceForList<File, 'files'>('files')
const notesSlice = createSliceForList<Note, 'notes'>('notes')
const templatesSlice = createSliceForList<Template, 'templates'>('templates')
const formsSlice = createSliceForList<Form, 'forms'>('forms')
const formsFieldsSlice = createSliceForList<FormField, 'form_fields'>('form_fields')
const formResponsesSlice = createSliceForList<FormResponse, 'form_response'>('form_response')
const journeysSlice = createSliceForList<Journey, 'journeys'>('journeys')
const usersSlice = createSliceForList<User, 'users'>('users')
const automationStepsSlice = createSliceForList<AutomationStep, 'automations_steps'>('automations_steps')
const usersDisplaySlice = createSliceForList<UserDisplayInfo, 'users'>('users')
const integrationsSlice = createSliceForList<Integration, 'integrations'>('integrations')
const databasesSlice = createSliceForList<Database, 'databases'>('databases')
const databaseRecordsSlice = createSliceForList<DatabaseRecord, 'database_records'>('database_records')
const portalCustomizationsSlice = createSliceForList<PortalCustomization, 'portal_customizations'>('portal_customizations')
const carePlansSlice = createSliceForList<CarePlan, 'care_plans'>('care_plans')
const enduserTasksSlice = createSliceForList<EnduserTask, 'enduser_tasks'>('enduser_tasks')
const productsSlice = createSliceForList<Product, 'products'>('products')
const purchasesSlice = createSliceForList<Purchase, 'purchases'>('purchases')
const purchaseCreditsSlice = createSliceForList<PurchaseCredit, 'purchase_credits'>('purchase_credits')
const phoneCallsSlice = createSliceForList<PhoneCall, 'phone_calls'>('phone_calls')
const analyticsFramesSlice = createSliceForList<AnalyticsFrame, 'analytics_frames'>('analytics_frames')
const enduserViewsSlice = createSliceForList<EnduserView, 'enduser_views'>('enduser_views')
const backgroundErrorsSlice = createSliceForList<BackgroundError, 'background_errors'>('background_errors')
const automationTriggersSlice = createSliceForList<AutomationTrigger, 'automation_triggers'>('automation_triggers')
const superbillsSlice = createSliceForList<Superbill, 'superbills'>('superbills')
const superbillProvidersSlice = createSliceForList<SuperbillProvider, 'superbill_providers'>('superbill_providers')
const enduserProfileViewsSlice = createSliceForList<EnduserProfileView, 'enduser_profile_views'>('enduser_profile_views')
const phoneTreesSlice = createSliceForList<PhoneTree, 'phone_trees'>('phone_trees')
const tableViewsSlice = createSliceForList<TableView, 'table_views'>('table_views')
const emailSyncDenialsSlice = createSliceForList<EmailSyncDenial, 'email_sync_denials'>('email_sync_denials')
const automatedActionsSlice = createSliceForList<AutomatedAction, 'automated_actions'>('automated_actions')
const groupMMSConversationsSlice = createSliceForList<GroupMMSConversation, 'group_mms_conversations'>('group_mms_conversations')
const blockedPhonesSlice = createSliceForList<BlockedPhone, 'blocked_phones'>('blocked_phones')
const prescriptionRoutesSlice = createSliceForList<PrescriptionRoute, 'prescription_routes'>('prescription_routes')
const enduserProblemsSlice = createSliceForList<EnduserProblem, 'enduser_problems'>('enduser_problems')

const enduserObservationsSlice = createSliceForList<EnduserObservation, 'enduser_observations'>('enduser_observations')
const forumsSlice = createSliceForList<Forum, 'forums'>('forums')
const forumPostsSlice = createSliceForList<ForumPost, 'forum_posts'>('forum_posts')
const managedContentRecoredsSlice = createSliceForList<ManagedContentRecord, 'managed_content_records'>('managed_content_records')
const managedContentRecoredAssignmentsSlice = createSliceForList<ManagedContentRecordAssignment, 'managed_content_record_assignments'>('managed_content_record_assignments')
const postCommentsSlice = createSliceForList<PostComment, 'post_comments'>('post_comments')
const postLikesSlice = createSliceForList<PostLike, 'post_likes'>('post_likes')
const commentLikesSlice = createSliceForList<CommentLike, 'comment_likes'>('comment_likes')
const organizationsSlice = createSliceForList<Organization, 'organizations'>('organizations')
const availabilityBlocksSlice = createSliceForList<AvailabilityBlock, 'availability_blocks'>('availability_blocks')
const enduserMedicationsSlice = createSliceForList<EnduserMedication, 'enduser_medications'>('enduser_medications')
const enduserCustomTypesSlice = createSliceForList<EnduserCustomType, 'enduser_custom_types'>('enduser_custom_types')
const ticketThreadsSlice = createSliceForList<TicketThread, 'ticket_threads'>('ticket_threads')
const ticketThreadCommentsSlice = createSliceForList<TicketThreadComment, 'ticket_thread_comments'>('ticket_thread_comments')
const configurationsSlice = createSliceForList<Configuration, 'configurations'>('configurations')
const ticketQueuesSlice = createSliceForList<TicketQueue, 'ticket_queues'>('ticket_queues')
const callHoldQueuesSlice = createSliceForList<TicketQueue, 'call_hold_queues'>('call_hold_queues')
const enduserOrdersSlice = createSliceForList<EnduserOrder, 'enduser_orders'>('enduser_orders')
const enduserEncountersSlice = createSliceForList<EnduserEncounter, 'enduser_encounters'>('enduser_encounters')
const vitalConfigurationsSlice = createSliceForList<VitalConfiguration, 'vital_configurations'>('vital_configurations')
const flowchartNotesSlice = createSliceForList<FlowchartNote, 'flowchart_notes'>('flowchart_notes')
const webhookLogsSlice = createSliceForList<WebhookLog, 'webhook_logs'>('webhook_logs')
const formGroupsSlice = createSliceForList<FormGroup, 'form_groups'>('form_groups')
const portalBrandingsSlice = createSliceForList<PortalBranding, 'portal_brandings'>('portal_brandings')
const messageTemplateSnippetsSlice = createSliceForList<MessageTemplateSnippet, 'message_template_snippets'>('message_template_snippets')
const faxLogsSlice = createSliceForList<FaxLog, 'fax_logs'>('fax_logs')
const suggestedContactsSlice = createSliceForList<SuggestedContact, 'suggested_contacts'>('suggested_contacts')
const diagnosisCodesSlice = createSliceForList<DiagnosisCode, 'diagnosis_codes'>('diagnosis_codes')
const allergyCodesSlice = createSliceForList<AllergyCode, 'allergy_codes'>('allergy_codes')
const integrationLogsSlice = createSliceForList<IntegrationLog, 'integration_logs'>('integration_logs')
const enduserEligibilityResultsSlice = createSliceForList<EnduserEligibilityResult, 'enduser_eligibility_results'>('enduser_eligibility_results')
const agentRecordsSlice = createSliceForList<AgentRecord, 'agent_records'>('agent_records')
const waitlistsSlice = createSliceForList<Waitlist, 'waitlists'>('waitlists')

const roleBasedAccessPermissionsSlice = createSliceForList<RoleBasedAccessPermission, 'role_based_access_permissions'>('role_based_access_permissions')

const calendarEventRSVPsSlice = createSliceForList<CalendarEventRSVP, 'calendar_event_rsvps'>('calendar_event_rsvps')
const userLogsSlice = createSliceForList<UserLog, 'user_logs'>('user_logs')

export const sharedConfig = {
  reducer: { 
    agent_records: agentRecordsSlice.reducer,
    enduser_eligibility_results: enduserEligibilityResultsSlice.reducer,
    integration_logs: integrationLogsSlice.reducer,
    ticket_queues: ticketQueuesSlice.reducer,
    automation_triggers: automationTriggersSlice.reducer,
    automated_actions: automatedActionsSlice.reducer,
    enduser_views: enduserViewsSlice.reducer,
    background_errors: backgroundErrorsSlice.reducer,
    availability_blocks: availabilityBlocksSlice.reducer,
    chat_rooms: chatRoomsSlice.reducer,
    chats: chatsSlice.reducer,
    chatRoomDisplayInfo: chatRoomDisplayInfoslice.reducer,
    calendar_events: calendarEventsSlice.reducer,
    calendar_event_templates: calendarEventTemplatesSlice.reducer,
    configurations: configurationsSlice.reducer,
    engagement_events: engagementEventsSlice.reducer,
    emails: emailsSlice.reducer,
    sms_messages: smsMessagesSlice.reducer,
    user_notifications: userNotifcationsSlice.reducer,
    endusers: endusersSlice.reducer,
    tickets: ticketsSlice.reducer,
    meetings: meetingsSlice.reducer,
    files: filesSlice.reducer,
    notes: notesSlice.reducer,
    templates: templatesSlice.reducer,
    forms: formsSlice.reducer,
    form_fields: formsFieldsSlice.reducer,
    form_responses: formResponsesSlice.reducer,
    journeys: journeysSlice.reducer,
    users: usersSlice.reducer,
    users_display: usersDisplaySlice.reducer,
    automation_steps: automationStepsSlice.reducer,
    enduser_observations: enduserObservationsSlice.reducer,
    forum_posts: forumPostsSlice.reducer,
    forums: forumsSlice.reducer,
    managed_content_records: managedContentRecoredsSlice.reducer,
    managed_content_record_assignments: managedContentRecoredAssignmentsSlice.reducer,
    post_comments: postCommentsSlice.reducer,
    post_likes: postLikesSlice.reducer,
    comment_likes: commentLikesSlice.reducer,
    integrations: integrationsSlice.reducer,
    organizations: organizationsSlice.reducer,
    calendar_event_RSVPs: calendarEventRSVPsSlice.reducer,
    databases: databasesSlice.reducer,
    database_records: databaseRecordsSlice.reducer,
    portal_customizations: portalCustomizationsSlice.reducer,
    enduser_tasks: enduserTasksSlice.reducer,
    care_plans: carePlansSlice.reducer,
    role_based_access_permissions: roleBasedAccessPermissionsSlice.reducer,
    appointment_booking_pages: appointmentBookingPagesSlice.reducer,
    appointment_locations: appointmentLocationsSlice.reducer,
    products: productsSlice.reducer,
    purchases: purchasesSlice.reducer,
    purchase_credits: purchaseCreditsSlice.reducer, 
    phone_calls: phoneCallsSlice.reducer, 
    phone_trees: phoneTreesSlice.reducer,
    analytics_frames: analyticsFramesSlice.reducer,
    superbills: superbillsSlice.reducer,
    superbill_providers: superbillProvidersSlice.reducer,
    enduser_profile_views: enduserProfileViewsSlice.reducer,
    enduser_medications: enduserMedicationsSlice.reducer,
    enduser_custom_types: enduserCustomTypesSlice.reducer,
    user_logs: userLogsSlice.reducer,
    table_views: tableViewsSlice.reducer,
    email_sync_denials: emailSyncDenialsSlice.reducer,
    ticket_threads: ticketThreadsSlice.reducer,
    ticket_thread_comments: ticketThreadCommentsSlice.reducer,
    group_mms_conversations: groupMMSConversationsSlice.reducer,
    enduser_orders: enduserOrdersSlice.reducer,
    enduser_encounters: enduserEncountersSlice.reducer,
    vital_configurations: vitalConfigurationsSlice.reducer,
    blocked_phones: blockedPhonesSlice.reducer,
    prescription_routes: prescriptionRoutesSlice.reducer,
    enduser_problems: enduserProblemsSlice.reducer,
    flowchart_notes: flowchartNotesSlice.reducer,
    webhook_logs: webhookLogsSlice.reducer,
    form_groups: formGroupsSlice.reducer,
    portal_brandings: portalBrandingsSlice.reducer,
    message_template_snippets: messageTemplateSnippetsSlice.reducer,
    fax_logs: faxLogsSlice.reducer,
    call_hold_queues: callHoldQueuesSlice.reducer,
    suggested_contacts: suggestedContactsSlice.reducer,
    diagnosis_codes: diagnosisCodesSlice.reducer,
    allergy_codes: allergyCodesSlice.reducer,
    waitlists: waitlistsSlice.reducer,
  },
}

const _store = configureStore(sharedConfig)
type RootState = ReturnType<typeof _store.getState>
type AppDispatch = typeof _store.dispatch

export const useResetState = () => {
  const dispatch = useTellescopeDispatch()
  const { reset: resetContext } = React.useContext(FetchContext) 

  
  return () => {
    resetContext() // resets fetch cache context
    dispatch({ type: RESET_CACHE_TYPE }) // resets Redux state
  }
  // _store.dispatch({ type: RESET_CACHE_TYPE })
}

const useTypedSelector = createTellescopeSelector() as any as TypedUseSelectorHook<RootState> 
const useTellescopeDispatch = createDispatchHook(TellescopeStoreContext) 

export const UserProvider = (props: { children: React.ReactNode }) => (
  <WithFetchContext>
  <WithDataSync>
  <Provider store={_store} context={TellescopeStoreContext}>
    {props.children}
  </Provider>
  </WithDataSync>
  </WithFetchContext>
)

export const ExtendedUserProvider = <A,B extends Action<any>>(props: { children: React.ReactNode, store: EnhancedStore<A,B> }) => (
  <WithFetchContext>
  <Provider context={TellescopeStoreContext} store={props.store}>
    {props.children}
  </Provider>
  </WithFetchContext>
)

export const EnduserProvider = (props: { children: React.ReactNode }) => (
  <WithFetchContext>
  <Provider store={_store} context={TellescopeStoreContext}>
    {props.children}
  </Provider>
  </WithFetchContext>
)
export const ExtendedEnduserProvider = <A,B extends Action<any>>(props: { children: React.ReactNode, store: EnhancedStore<A,B> }) => (
  <WithFetchContext>
  <Provider store={props.store} context={TellescopeStoreContext}>
    {props.children}
  </Provider>
  </WithFetchContext>
)

export type AddOptions = {
  addTo?: 'start' | 'end',
  replaceIfMatch?: boolean,
}

export interface LoadMoreOptions <T> {
  key?: string,
  limit?: number,
  filter?: ReadFilter<T> | undefined
}

export interface LoadMoreFunctions<T> {
  loadMore: (options?: LoadMoreOptions<T>) => Promise<void>;
  doneLoading: (id?: string) => boolean,
}

export const INACTIVE_SYNC_INTERVAL_IN_MS = 30000
export const DEFAULT_SYNC_INTERVAL_IN_MS  = 15000
export const MEDIUM_SYNC_INTERAVL         = 10000
export const FAST_SYNC_INTERVAL           = 5000

export const lastActiveForSync = { at: new Date(0), hasFocus: true }

export const lastDataSync = { current : { numResults: 0, at: new Date(0), from: new Date(0), latency: 0, duration: 0 } }

export const useDataSync____internal = () => {
  const session = useSession()
  const lastFetch = React.useRef(new Date())
  const loadTimings = React.useRef({ } as { [index: string]: number })
  const loaded = React.useRef({ } as { [K in string]?: ClientModelForName[keyof ClientModelForName][] })
  const deleted = React.useRef({ } as { [K in string]?: string[] })
  const handlers = React.useRef({ } as { [K in string]?: () => void })

  useEffect(() => {
    try {
      // not compatible with React Native
      if (typeof window === 'undefined') { return }
      if (global?.navigator?.product === 'ReactNative') { return }

      const onMouseMove = () => { lastActiveForSync.at = new Date() }
      window.addEventListener('mousemove', onMouseMove)

      const onFocus = () => { lastActiveForSync.hasFocus = true }
      window.addEventListener('focus', onFocus)

      const onBlur = () => { lastActiveForSync.hasFocus = false }
      window.addEventListener('blur', onBlur)

      return () => { 
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('focus', onFocus);
        window.removeEventListener('blur', onBlur);
      }
    } catch(err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    if (!session.authToken) return

    const i = setInterval(() => {
      const isActive = lastActiveForSync.hasFocus && lastActiveForSync.at.getTime() > (Date.now() - 1000 * 15)

      const pollDurationInMS = Math.min(
        isActive ? DEFAULT_SYNC_INTERVAL_IN_MS : INACTIVE_SYNC_INTERVAL_IN_MS, 
        ...Object.values(loadTimings.current).filter(v => v > 999)
      )

      const handleLoadedData = () => {
        for (const handler of Object.values(handlers.current)) {
          try {
            handler?.()
          } catch(err) { console.error(err) }
        }
      }

      if (lastFetch.current.getTime() + pollDurationInMS > Date.now()) {
        return
      }

      // ensure we don't miss updates due to latency
      const from = new Date(lastFetch.current.getTime() - 1000) // large leeway could result in same data being fetched twice, but helps ensure nothing is dropped
      lastFetch.current = new Date() // update before syncing, not after it returns

      session
      .sync({ from })
      .then(({ results }) => {
        lastDataSync.current = { 
          numResults: results.length, at: lastFetch.current, from, 
          latency: Date.now() - lastFetch.current.getTime(),
          duration: pollDurationInMS,
        }

        for (const r of results) {
          if (r.data === 'deleted') {
            if (!deleted.current[r.modelName]) {
              deleted.current[r.modelName] = [] 
            }
            deleted.current[r.modelName]!.push(r.recordId)
          } else {
            if (!loaded.current[r.modelName]) {
              loaded.current[r.modelName] = [] 
            }
            try {
              loaded.current[r.modelName]!.push(JSON.parse(r.data))
            } catch(err) {
              console.error(err)
            }
          }
        }
      })
      .then(handleLoadedData)
      .catch(err => {
        console.error('Sync error', err)
        lastFetch.current = from // don't skip this interval yet
      })
    }, 1000)

    return () => { clearInterval(i) }
  }, [session])

  const getLoaded = useCallback(<T extends string>(modelName: T) => loaded.current[modelName] || [], [])
  const getDeleted = useCallback(<T extends string>(modelName: T) => deleted.current[modelName] || [], [])

  const popLoaded = useCallback(<T extends string>(modelName: T) => {
    const toReturn = loaded.current[modelName] || []
    loaded.current[modelName] = []
    return toReturn
  }, [])
  const popDeleted = useCallback(<T extends string>(modelName: T) => {
    const toReturn = deleted.current[modelName] || []
    deleted.current[modelName] = []
    return toReturn
  }, [])

  const setLoadTiming = useCallback((key: string, loadTimeInMS: number) => {
    loadTimings.current[key] = loadTimeInMS
  }, [])

  const setHandler = useCallback((key: string, handler: undefined | (() => void)) => {
    // call handler when initially set in case results were loaded when there was no handler
    if (!handlers.current[key] && handler) {
      try {
        // console.log("handle on add", key)
        handler?.() 
      } 
      catch(err) { 
        console.error(err) 
      }
    }

    // console.log('setting handler', key)
    handlers.current[key] = handler
  }, [])

  const removeHandler = useCallback((key: string, handler: () => void) => {
    if (handlers.current[key] !== handler) return // if a handler was overwritten, don't remove it

    // console.log('removing handler', key)
    delete handlers.current[key]
  }, [])

  return {
    setLoadTiming, 
    setHandler, removeHandler,
    getLoaded, getDeleted,
    popLoaded, popDeleted,
  }
}
const SyncContext = React.createContext({ } as ReturnType<typeof useDataSync____internal>)
export const WithDataSync = ({ children } : { children: React.ReactNode }) => (
  <SyncContext.Provider value={useDataSync____internal()}>
    {children}
  </SyncContext.Provider>
)
export const useSyncContext = () => useContext(SyncContext)

const DEFAULT_FETCH_LIMIT = 500
const BULK_READ_DEFAULT_LIMIT = 1000 // 1000 is max
const DONE_LOADING_TOKEN = 'doneLoading'

export type UpdateElement <T,> = (id: string, e: Partial<T>, o?: CustomUpdateOptions) => Promise<T>

export interface ListUpdateMethods <T, ADD> extends LoadMoreFunctions<T> {
  addLocalElement: (e: T, o?: AddOptions) => T,
  addLocalElements: (e: T[], o?: AddOptions) => T[],
  replaceLocalElement: (id: string, e: T) => T,
  createElement: (e: ADD, o?: AddOptions) => Promise<T>,
  createElements: (e: ADD[], o?: AddOptions) => Promise<T[]>,
  findById: (id: string | number, options?: { reload?: boolean, batch?: boolean }) => T | undefined | null,
  findByFilter: (match: (potential: T) => boolean, options?: { loadFilter?: ReadFilter<T>, reload?: boolean }) => T | undefined | null,
  searchLocalElements: (query: string) => T[],
  updateElement: UpdateElement<T>,
  updateLocalElement: (id: string, e: Partial<T>) => void,
  updateLocalElements: (updates: { [id: string]: Partial<T> }) => void,
  modifyLocalElements: (filter: (e: T) => boolean, modifier: (e: T) => T) => void,
  removeElement: (id: string) => Promise<void>,
  removeLocalElements: (ids: string[]) => void,
  reload: (loadOptions?: Pick<HookOptions<T>, 'loadFilter'>) => void;
  filtered: (filter: (value: T) => boolean) => LoadedData<T[]>;
  getOldestLoadedDate: () => Date | undefined,
  setOldestLoadedDate: (d: Date) => void,
  getOldestLoadedId: () => string | undefined,
  setOldestLoadedId: (id: string) => void,
  loadRecentlyCreated: () => Promise<T[]>,
  recentlyCreatedFetch: Date,
}
export type ListStateReturnType <T extends { id: string | number }, ADD=Partial<T>> = [LoadedData<T[]>, ListUpdateMethods<T, ADD>]

export const useListStateHook = <T extends { id: string | number }, ADD extends Partial<T>> (
  modelName: string,
  state: LoadedData<T[]>, 
  session: Session | EnduserSession,
  slice: Slice<any, ListReducers<T>>,
  apiCalls: {
    loadQuery?: LoadFunction<T>, 
    findOne?: (idOrFilter: string | ReadFilter<T>) => Promise<T>,
    findByIds?: ({ ids } : { ids: string[] }) => Promise<{ matches: T[] }>,
    addOne?: (value: ADD) => Promise<T>,
    addSome?: (values: ADD[]) => Promise<{ created: T[], errors: any[] }>,
    updateOne?: (id: string, updates: Partial<T>, o?: CustomUpdateOptions) => Promise<T>,
    deleteOne?: (id: string) => Promise<void>,
  },
  options?: {
    onAdd?: (n: T[]) => void;
    onUpdate?: (n: ({ id: string } & Partial<T>)[]) => void;
    onDelete?: (id: string[]) => void;
  } & HookOptions<T>
): ListStateReturnType<T, ADD> => 
{
  const { setHandler, popDeleted, popLoaded, removeHandler } = useSyncContext() ?? {}
  const { loadQuery, findOne, findByIds, addOne, addSome, updateOne, deleteOne } = apiCalls
  if (options?.refetchInMS !== undefined && options.refetchInMS < 5000) {
    throw new Error("refetchInMS must be greater than 5000")
  }

  const batchRef = useRef({
    fetching: false,
    ids: [] as string[],
    nextBatch: [] as string[], 
  })

  const dispatch = useTellescopeDispatch()
  const { didFetch, setFetched, getLastId, setLastId, getLastDate, setLastDate } = useContext(FetchContext)

  const now = new Date()
  const recentlyCreatedFetch = useRef(getLastDate(`${modelName}-recentlyCreatedFetch`) || now)
  if (now.getTime() === recentlyCreatedFetch.current.getTime()) {
    setLastDate(`${modelName}-recentlyCreatedFetch`, now)
  }

  const addLocalElement = useCallback((e: T, o?: AddOptions) => {
    dispatch(slice.actions.add({ value: e, options: o }))
    options?.onAdd?.([e])
    return e
  }, [dispatch, options, slice])
  const addLocalElements = useCallback((es: T[], o?: AddOptions) => {
    dispatch(slice.actions.addSome({ value: es, options: o }))
    options?.onAdd?.(es)
    return es
  }, [dispatch, options, slice])
  const createElement = useCallback(async (e: ADD, options?: AddOptions) => {
    if (!addOne) throw new Error(`Add element by API is not supported`)
    return addLocalElement(await addOne(e), options)
  }, [addLocalElement, addOne])
  const createElements = useCallback(async (es: ADD[], options?: AddOptions) => {
    if (!addSome) throw new Error(`Add elements by API is not supported`)
    const { created, errors } = await addSome(es)
    if (errors.length) { console.error(errors) }
    return addLocalElements(created, options)
  }, [addLocalElements, addSome])
 
  const updateLocalElement = useCallback((id: string, updates: Partial<T>) => {
    dispatch(slice.actions.update({ value: { id, updates } }))
    options?.onUpdate?.([{ id, ...updates }])
  }, [dispatch, options, slice])
  const updateLocalElements = useCallback((updates: { [id: string] : Partial<T> }) => {
    dispatch(slice.actions.updateSome({ value: updates }))

    const updated: ({ id: string } & Partial<T>)[] = []
    for (const id in updates) {
      updated.push({ id, ...updates[id] })
    }
    options?.onUpdate?.(updated)
  }, [dispatch, options, slice])

  const modifyLocalElements: ListUpdateMethods<T, ADD>['modifyLocalElements'] = useCallback((filter, modifier) => {
    dispatch(slice.actions.modifyElements({ value: { filter, modifier } }))
  }, [dispatch, options, slice])

  const replaceLocalElement = useCallback((id: string, updated: T) => {
    dispatch(slice.actions.replace({ value: { id, updated } }))
    options?.onUpdate?.([{ ...updated, id }])
    return updated
  }, [dispatch, options, slice])
  const updateElement = useCallback(async (id: string, e: Partial<T>, o?: CustomUpdateOptions) => {
    if (!updateOne) throw new Error(`Update element by API is not supported`)
    return replaceLocalElement(id, await updateOne(id, e, o)) // API returns updated model, avoids needing to merge object fields client-side, so just replace
  }, [replaceLocalElement, updateOne])

  const removeLocalElement = useCallback(id => {
    dispatch(slice.actions.remove({ value: { id } }))
    options?.onDelete?.([id])
  }, [dispatch, options, slice])
  const removeLocalElements = useCallback(ids => {
    dispatch(slice.actions.removeSome({ value: { ids } }))
    options?.onDelete?.(ids)
  }, [dispatch, options, slice])
  const removeElement = useCallback(async (id: string) => {
    if (!deleteOne) throw new Error(`Add element by API is not supported`)
    await deleteOne(id)
    removeLocalElement(id)
  }, [removeLocalElement, deleteOne])

  useEffect(() => {
    // context not provided
    if (!setHandler) return

    const handler = () => {
      if (state.status !== LoadingStatus.Loaded) return
      
      const deleted = popDeleted(modelName)
      const loaded = popLoaded(modelName)

      if (deleted?.length) {
        removeLocalElements(deleted)
      }
      if (loaded?.length) {
        addLocalElements(loaded as any, { replaceIfMatch: true })
      }
    }

    setHandler(modelName, handler)

    return () => { removeHandler(modelName, handler) }
  }, [modelName, state.status, setHandler, removeHandler, addLocalElements, removeLocalElements, popDeleted, popLoaded])

  const findById: ListUpdateMethods<T, ADD>['findById'] = useCallback((id, options) => {
    if (!id) return undefined

    const value = (
      state.status === LoadingStatus.Loaded
        ? state.value.find(v => v.id.toString() === id.toString())
        : undefined
    )

    if (
       didFetch('recordNotFound' + modelName + id)
    && !value // if value is added after an initial failure to find, or an error happened on refresh, make sure we don't return null
    ) {
      return null
    }

    // prevent frequent refetches 
    if (value && options?.reload && didFetch('findById' + modelName + id, true)) return value

    if (options?.reload || (value === undefined && !didFetch('findById' + modelName + id))) {
      setFetched('findById' + modelName + id, true) // prevent multiple API calls

      if (options?.batch) {
        // ensure duplicate ids are not provided
        if (!batchRef.current.nextBatch.includes(id.toString()) && !batchRef.current.ids.includes(id.toString())) {
          if (batchRef.current.fetching) {
            batchRef.current.nextBatch.push(id.toString()) // fetch in next batch if currently fetching
          } else {
            batchRef.current.ids.push(id.toString())
          }
        }
      } else {
        findOne?.(id.toString())
        .then(found => {
          // prevent unnecessary re-renders by calling addLocalElement, when the exact value already exists
          const existingUnchanged = value_is_loaded(state) && state.value.find(v => v.id === id && objects_equivalent(v, found))
          if (existingUnchanged) return

          addLocalElement(found, { replaceIfMatch: true })
        })
        .catch(e => {
          setFetched('recordNotFound' + modelName + id, true) // mark record not found for id
          console.error(e) 
        })
      }
    }

    return value
  }, [addLocalElement, findOne, state, modelName, setFetched, didFetch])

  useEffect(() => {
    if (!findByIds) return

    const i = window.setInterval(() => {
      if (batchRef.current.fetching) return // already fetching
      if (batchRef.current.ids.length === 0) return

      // can only load max of 1000, ensure other ids are included in nextBatch
      if (batchRef.current.ids.length > BULK_READ_DEFAULT_LIMIT) {
        batchRef.current.nextBatch.unshift(...batchRef.current.ids.slice(BULK_READ_DEFAULT_LIMIT))
      }

      batchRef.current.fetching = true
      findByIds({
        ids: batchRef.current.ids.slice(0, BULK_READ_DEFAULT_LIMIT), // ensure limited to 1000 entries
      })
      .then(({ matches }) => {
        if (matches.length) { 
          addLocalElements(matches, { replaceIfMatch: true })
          options?.onBulkRead?.(matches) 
        }
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        // ensure we make progress to prevent looping on an error
        batchRef.current.ids = batchRef.current.nextBatch
        batchRef.current.nextBatch = []
        
        // allow next fetch
        batchRef.current.fetching = false
      })
    }, 333)

    return () => { clearInterval(i) }
  }, [findByIds, addLocalElements, options?.onBulkRead])

  const findByFilter: ListUpdateMethods<T, ADD>['findByFilter'] = useCallback((filter, options) => {
    const loadFilter = options?.loadFilter
    const queryKey = modelName + JSON.stringify(options?.loadFilter ?? {})

    const value = (
      state.status === LoadingStatus.Loaded
        ? state.value.find(filter)
        : undefined
    );

    // if value is added after an initial failure to find, make sure we return it in instead of null
    if (didFetch('recordNotFound' + queryKey)) { // return null if record not found for id
      return value || null
    }
    
    // prevent frequent refetches 
    if (value && options?.reload && didFetch('findOne' + queryKey, true)) return value

    if (loadFilter && (options?.reload || (value === undefined && !didFetch('findOne' + queryKey)))) {
      setFetched('findOne' + queryKey, true) // prevent multiple API calls

      findOne?.(loadFilter)
      .then(found => {
        // prevent unnecessary re-renders by calling addLocalElement, when the exact value already exists
        const existingUnchanged = value_is_loaded(state) && state.value.find(v => filter(v) && objects_equivalent(v, found))
        if (existingUnchanged) return

        addLocalElement(found, { replaceIfMatch: true })
      })
      .catch(e => {
        setFetched('recordNotFound' + queryKey, true) // mark record not found for id
        console.error(e) 
      })
    }

    return value
  }, [addLocalElement, findOne, state, modelName, setFetched, didFetch])

  // make consistent with search function in Webapp search.tsx
  const searchLocalElements: ListUpdateMethods<T, ADD>['searchLocalElements'] = useCallback(query => {
    const matches: T[] = []
    if (state.status !== LoadingStatus.Loaded) return matches

    const queryLC = query.toLowerCase()
    for (const element of state.value) {
      // todo: recursive search matches on array / object fields
      for (const field in element) {
        if (['createdAt', 'updatedAt', 'businessId', 'creator'].includes(field)) continue

        const value = element[field]

        if (field === 'id'){
          if ((value as any as string | number).toString().toLowerCase() === queryLC) {
            matches.push(element)
          } 
        } else if (typeof value === 'string' && value.toLowerCase().includes(queryLC)) {
          matches.push(element);
          break;
        }
      }
    }

    return matches
  }, [state])

  const filtered: ListUpdateMethods<T, ADD>['filtered'] = useCallback(filter => {
    if (value_is_loaded(state)) {
      return {
        status: state.status,
        value: state.value.filter(filter)
      }
    } 
    return state
  }, [state])

  const cantRead = (
    session.type === 'user' && !(session as Session)?.userInfo?.access?.[modelName as ModelName]?.read
  )
  const load = useCallback((force: boolean, loadOptions?: HookOptions<T> & { reloading?: boolean }) => {
    if (cantRead) return;

    const _loadFilter = loadOptions?.loadFilter ?? options?.loadFilter
    const loadFilter = (_loadFilter && object_is_empty(_loadFilter)) ? undefined : _loadFilter
    const sort = loadOptions?.sort ?? options?.sort
    const sortBy = loadOptions?.sortBy ?? options?.sortBy

    if (!loadQuery) return
    if (options?.dontFetch && !force) return
    const fetchKey = (loadFilter || sort || sortBy) ? JSON.stringify({ ...loadFilter, sort, sortBy }) + modelName : modelName

    if (didFetch(fetchKey, force, options?.refetchInMS)) return
    setFetched(fetchKey, true)

    const limit = options?.limit || DEFAULT_FETCH_LIMIT
    toLoadedData(() => loadQuery({ filter: loadFilter, limit, sort, sortBy })).then(
      es => {
        if (es.status === LoadingStatus.Loaded) {
          if (es.value.length < limit && !loadFilter) {
            setFetched('id' + modelName + DONE_LOADING_TOKEN, true) 
          }
          if (es.value.length) { // don't store oldest record from a filter, may skip some pages
            setLastId(
              modelName + (loadFilter ? JSON.stringify(loadFilter): ''), 
              es.value[es.value.length - 1]?.id?.toString()
            )
            const createdAt: any = (es.value[es.value.length - 1] as any).createdAt;
            if (typeof createdAt === 'string' || createdAt instanceof Date) {
              setLastDate(modelName, new Date(createdAt))
            }
          }
          dispatch(slice.actions.addSome({ value: es.value, options: { replaceIfMatch: true } }))
        } else {
          // don't overwrite previously loaded data when an error occurs on reload
          if (loadOptions?.reloading) {
            return console.error(es)
          } 
          dispatch(slice.actions.set({ value: es }))
        }
      }
    )
  }, [cantRead, setFetched, didFetch, modelName, options, loadQuery, options?.dontFetch, dispatch])

  const getOldestLoadedId = () => getLastId(modelName)
  const setOldestLoadedId = (id: string) => setLastId(modelName, id)
  const setOldestLoadedDate = (d: Date) => setLastDate(modelName, d)
  const getOldestLoadedDate = () => getLastDate(modelName)

  const reload: ListUpdateMethods <T, ADD>['reload'] = useCallback(options => load(true, { ...options, reloading: true }), [load])

  useEffect(() => {
    load(false)
  }, [load])

  useEffect(() => {
    if (didFetch(modelName + 'socket')) return
    setFetched(modelName + 'socket', true, false)
 
    session.handle_events({
      // create, update, and delete must go in this order 
      // e.g. to ensure delete events are processed last, so deleted records don't appear as created
      [`created-${modelName}`]: addLocalElements,
      [`updated-${modelName}`]: es => {
        const idToUpdates = {} as Indexable<Partial<T>>
        for (const { id, ...e } of es) {
          idToUpdates[id] = e 
        }
        updateLocalElements(idToUpdates)
      },
      [`deleted-${modelName}`]: removeLocalElements,
    })

    return () => { 
      setFetched(modelName + 'socket', false, false)
      session.removeListenersForEvent(`created-${modelName}`)
      session.removeListenersForEvent(`updated-${modelName}`)
      session.removeListenersForEvent(`deleted-${modelName}`)
    }
  }, [session, addLocalElement, updateLocalElements, removeLocalElements, modelName, didFetch])

  const doneLoading = useCallback((key="id") => (
    didFetch(key + modelName + DONE_LOADING_TOKEN)
  ), [didFetch, modelName])

  const loadMore = useCallback(async (loadOptions?: LoadMoreOptions<T>) => {
    const filter = loadOptions?.filter ?? options?.loadFilter

    const lastId = getLastId(
      modelName + (filter ? JSON.stringify(filter) : ""), 
    )
    if (!lastId) return
    if (!loadQuery) return
    if (didFetch(modelName + 'lastId' + lastId)) return
    setFetched(modelName + 'lastId' + lastId, true)

    // todo: support for updatedAt as well, and more?
    const key = loadOptions?.key ?? 'id' 
    if (key !== 'id') console.warn("Unrecognized key provided")

    const limit = loadOptions?.limit ?? options?.limit ?? DEFAULT_FETCH_LIMIT
    return toLoadedData(() => loadQuery({ 
      // lastId: !options?.filter ? oldestRecord?.id?.toString() : undefined,  // don't provide a lastId when there's a filter, filter could include that on its own
      lastId,
      limit, 
      filter,
    })).then(
      es => {
        if (es.status === LoadingStatus.Loaded) {
          if (es.value.length < limit) {
            setFetched(key + modelName + DONE_LOADING_TOKEN, true) 
          }
          const newLastId = es.value[es.value.length - 1]?.id?.toString()
          if (newLastId) {
            setLastId(
              modelName + (filter ? JSON.stringify(filter) : ""), 
              newLastId
            )
          }

          dispatch(slice.actions.addSome({ value: es.value, options: { replaceIfMatch: true, addTo: 'end' } }))
        } else if (es.status === LoadingStatus.Error) {
          console.error('error loading more', es.value)
        }
      }
    )
  }, [getLastId, modelName, loadQuery, didFetch, setFetched])

  const loadRecentlyCreated = React.useCallback(async () => {
    if (!loadQuery) return []

    const from = recentlyCreatedFetch.current

    if (from.getTime() + 1000 > Date.now()) return [] // throttle by 1 sec
    recentlyCreatedFetch.current = new Date()
    setLastDate(`${modelName}-recentlyCreatedFetch`, recentlyCreatedFetch.current)

    try {
      const created = await loadQuery({ from })
      if (created.length === 0) return []

      return addLocalElements(created, { replaceIfMatch: true })
    } catch(err) { console.error(err) }

    return []
  }, [session.api, modelName, addLocalElements, loadQuery, setLastDate])
  
  return [
    state,
    {
      addLocalElement, addLocalElements, replaceLocalElement, modifyLocalElements, searchLocalElements,
      createElement, createElements, updateElement, updateLocalElement, updateLocalElements, findByFilter, findById, removeElement, removeLocalElements,
      reload, loadMore, doneLoading, filtered, 
      getOldestLoadedDate, setOldestLoadedDate, setOldestLoadedId, getOldestLoadedId,
      loadRecentlyCreated,
      recentlyCreatedFetch: recentlyCreatedFetch.current,
    }
  ]
}

export type HookOptions<T> = {
  sort?: SortOption, 
  sortBy?: SortBy,
  limit?: number,
  loadFilter?: ReadFilter<T>,
  refetchInMS?: number,
  dontFetch?: boolean,
  addTo?: AddOptions['addTo'],
  onBulkRead?: (matches: T[]) => void,
}

export const useChatRoomDisplayInfo = (roomId: string, options={} as HookOptions<ChatRoomDisplayInfo>) => {
  const session = useResolvedSession()
  const state = useTypedSelector(s => s.chatRoomDisplayInfo)
  const [lookup] = useListStateHook(
    'chat-room-display-info', state, session, chatRoomDisplayInfoslice,
    { 
      loadQuery: async () => {
        const { id, display_info } = await session.api.chat_rooms.display_info({ id: roomId })
        return [{ id, ...display_info }] as ChatRoomDisplayInfo[]
      }
    },
    { ...options }
  ) 

  return (
    value_is_loaded(lookup) 
      ? [{ status: LoadingStatus.Loaded, value: lookup.value.find(v => v.id === roomId) ?? {} }] 
      : [{ status: lookup.status, value: {} }]
  ) as [LoadedData<{ [index: string]: UserDisplayInfo }>]
}

export const useUserAndEnduserDisplayInfo = () => {
  const [usersLoading] = useUsers()
  const [endusersLoading] = useEndusers()
  const displayInfo = {} as Indexable<UserDisplayInfo>

  if (value_is_loaded(usersLoading)) {
    for (const u of usersLoading.value) {
      displayInfo[u.id] = {
        id: u.id,
        avatar: u.avatar,
        fname: u.fname,
        lname: u.lname,
        createdAt: u.createdAt,
        lastActive: new Date(u.lastActive || 0),
        lastLogout: new Date(u.lastLogout || 0),
      }
    }
  }

  if (value_is_loaded(endusersLoading)) {
    for (const u of endusersLoading.value) {
      displayInfo[u.id] = {
        id: u.id,
        avatar: u.avatar,
        fname: u.fname,
        lname: u.lname,
        createdAt: u.createdAt,
        lastActive: new Date(u.lastActive || 0),
        lastLogout: new Date(u.lastLogout || 0),
      }
    }
  }

  return displayInfo
}

export const useEnduserEligibilityResults = (options={} as HookOptions<EnduserEligibilityResult>) => {
  const session = useResolvedSession()

  return useListStateHook('enduser_eligibility_results', useTypedSelector(s => s.enduser_eligibility_results), session, enduserEligibilityResultsSlice,
    { 
      loadQuery: session.api.enduser_eligibility_results.getSome,
      findOne: session.api.enduser_eligibility_results.getOne,
      findByIds: session.api.enduser_eligibility_results.getByIds,
      addOne: session.api.enduser_eligibility_results.createOne,
      addSome: session.api.enduser_eligibility_results.createSome,
      deleteOne: session.api.enduser_eligibility_results.deleteOne,
      updateOne: session.api.enduser_eligibility_results.updateOne,
    },
    { 
      ...options,
    },
  )
}

export const useAgentRecords = (options={} as HookOptions<AgentRecord>) => {
  const session = useSession()

  return useListStateHook('agent_records', useTypedSelector(s => s.agent_records), session, agentRecordsSlice,
    { 
      loadQuery: session.api.agent_records.getSome,
      findOne: session.api.agent_records.getOne,
      findByIds: session.api.agent_records.getByIds,
      addOne: session.api.agent_records.createOne,
      addSome: session.api.agent_records.createSome,
      deleteOne: session.api.agent_records.deleteOne,
      updateOne: session.api.agent_records.updateOne,
    },
    { 
      ...options,
    },
  )
}

export const useSuggestedContacts = (options={} as HookOptions<SuggestedContact>) => {
  const session = useSession()

  return useListStateHook('suggested_contacts', useTypedSelector(s => s.suggested_contacts), session, suggestedContactsSlice,
    { 
      loadQuery: session.api.suggested_contacts.getSome,
      findOne: session.api.suggested_contacts.getOne,
      findByIds: session.api.suggested_contacts.getByIds,
      addOne: session.api.suggested_contacts.createOne,
      addSome: session.api.suggested_contacts.createSome,
      deleteOne: session.api.suggested_contacts.deleteOne,
      updateOne: session.api.suggested_contacts.updateOne,
    },
    { 
      ...options,
    },
  )
}

export const useFaxLogs = (options={} as HookOptions<FaxLog>) => {
  const session = useSession()

  return useListStateHook('fax_logs', useTypedSelector(s => s.fax_logs), session, faxLogsSlice,
    { 
      loadQuery: session.api.fax_logs.getSome,
      findOne: session.api.fax_logs.getOne,
      findByIds: session.api.fax_logs.getByIds,
      addOne: session.api.fax_logs.createOne,
      addSome: session.api.fax_logs.createSome,
      deleteOne: session.api.fax_logs.deleteOne,
      updateOne: session.api.fax_logs.updateOne,
    },
    { 
      ...options,
    },
  )
}
export const useMessageTemplateSnippets = (options={} as HookOptions<MessageTemplateSnippet>) => {
  const session = useSession()

  return useListStateHook('message_template_snippets', useTypedSelector(s => s.message_template_snippets), session, messageTemplateSnippetsSlice,
    { 
      loadQuery: session.api.message_template_snippets.getSome,
      findOne: session.api.message_template_snippets.getOne,
      findByIds: session.api.message_template_snippets.getByIds,
      addOne: session.api.message_template_snippets.createOne,
      addSome: session.api.message_template_snippets.createSome,
      deleteOne: session.api.message_template_snippets.deleteOne,
      updateOne: session.api.message_template_snippets.updateOne,
    },
    { 
      ...options,
    },
  )
}
export const usePortalBrandings = (options={} as HookOptions<PortalBranding>) => {
  const session = useSession()

  return useListStateHook('portal_brandings', useTypedSelector(s => s.portal_brandings), session, portalBrandingsSlice,
    { 
      loadQuery: session.api.portal_brandings.getSome,
      findOne: session.api.portal_brandings.getOne,
      findByIds: session.api.portal_brandings.getByIds,
      addOne: session.api.portal_brandings.createOne,
      addSome: session.api.portal_brandings.createSome,
      deleteOne: session.api.portal_brandings.deleteOne,
      updateOne: session.api.portal_brandings.updateOne,
    },
    { 
      ...options,
    },
  )
}
export const useAllergyCodes = (options={} as HookOptions<AllergyCode>) => {
  const session = useResolvedSession()

  return useListStateHook('allergy_codes', useTypedSelector(s => s.allergy_codes), session, allergyCodesSlice,
    { 
      loadQuery: session.api.allergy_codes.getSome,
      findOne: session.api.allergy_codes.getOne,
      findByIds: session.api.allergy_codes.getByIds,
      addOne: session.api.allergy_codes.createOne,
      addSome: session.api.allergy_codes.createSome,
      deleteOne: session.api.allergy_codes.deleteOne,
      updateOne: session.api.allergy_codes.updateOne,
    },
    { 
      ...options,
    },
  )
}
export const useDiagnosisCodes = (options={} as HookOptions<DiagnosisCode>) => {
  const session = useResolvedSession()

  return useListStateHook('diagnosis_codes', useTypedSelector(s => s.diagnosis_codes), session, diagnosisCodesSlice,
    { 
      loadQuery: session.api.diagnosis_codes.getSome,
      findOne: session.api.diagnosis_codes.getOne,
      findByIds: session.api.diagnosis_codes.getByIds,
      addOne: session.api.diagnosis_codes.createOne,
      addSome: session.api.diagnosis_codes.createSome,
      deleteOne: session.api.diagnosis_codes.deleteOne,
      updateOne: session.api.diagnosis_codes.updateOne,
    },
    { 
      ...options,
    },
  )
}
export const useEnduserProblems = (options={} as HookOptions<EnduserProblem>) => {
  const session = useResolvedSession()

  return useListStateHook('enduser_problems', useTypedSelector(s => s.enduser_problems), session, enduserProblemsSlice,
    { 
      loadQuery: session.api.enduser_problems.getSome,
      findOne: session.api.enduser_problems.getOne,
      findByIds: session.api.enduser_problems.getByIds,
      addOne: session.api.enduser_problems.createOne,
      addSome: session.api.enduser_problems.createSome,
      deleteOne: session.api.enduser_problems.deleteOne,
      updateOne: session.api.enduser_problems.updateOne,
    },
    { 
      ...options,
    },
  )
}
export const useEnduserMedications = (options={} as HookOptions<EnduserMedication>) => {
  const session = useResolvedSession()

  return useListStateHook('enduser_medications', useTypedSelector(s => s.enduser_medications), session, enduserMedicationsSlice,
    { 
      loadQuery: session.api.enduser_medications.getSome,
      findOne: session.api.enduser_medications.getOne,
      findByIds: session.api.enduser_medications.getByIds,
      addOne: session.api.enduser_medications.createOne,
      addSome: session.api.enduser_medications.createSome,
      deleteOne: session.api.enduser_medications.deleteOne,
      updateOne: session.api.enduser_medications.updateOne,
    },
    { 
      ...options,
    },
  )
}
export const useEnduserOrders = (options={} as HookOptions<EnduserOrder>) => {
  const session = useResolvedSession()
  return useListStateHook(
    'enduser_orders', useTypedSelector(s => s.enduser_orders), session, enduserOrdersSlice, 
    { 
      loadQuery: session.api.enduser_orders.getSome,
      findOne: session.api.enduser_orders.getOne,
      findByIds: session.api.enduser_orders.getByIds,
      addOne: session.api.enduser_orders.createOne,
      addSome: session.api.enduser_orders.createSome,
      deleteOne: session.api.enduser_orders.deleteOne,
      updateOne: session.api.enduser_orders.updateOne,
    }, 
    {...options}
  )
}
export const useIntegrationLogs = (options={} as HookOptions<IntegrationLog>) => {
  const session = useSession()
  return useListStateHook(
    'integration_logs', useTypedSelector(s => s.integration_logs), session, integrationLogsSlice, 
    { 
      loadQuery: session.api.integration_logs.getSome,
      findOne: session.api.integration_logs.getOne,
      findByIds: session.api.integration_logs.getByIds,
      addOne: session.api.integration_logs.createOne,
      addSome: session.api.integration_logs.createSome,
      deleteOne: session.api.integration_logs.deleteOne,
      updateOne: session.api.integration_logs.updateOne,
    }, 
    {...options}
  )
}
export const useWebhookLogs = (options={} as HookOptions<WebhookLog>) => {
  const session = useSession()
  return useListStateHook(
    'webhook_logs', useTypedSelector(s => s.webhook_logs), session, webhookLogsSlice, 
    { 
      loadQuery: session.api.webhook_logs.getSome,
      findOne: session.api.webhook_logs.getOne,
      findByIds: session.api.webhook_logs.getByIds,
      addOne: session.api.webhook_logs.createOne,
      addSome: session.api.webhook_logs.createSome,
      deleteOne: session.api.webhook_logs.deleteOne,
      updateOne: session.api.webhook_logs.updateOne,
    }, 
    {...options}
  )
}
export const useFormGroups = (options={} as HookOptions<FormGroup>) => {
  const session = useSession()
  return useListStateHook(
    'form_groups', useTypedSelector(s => s.form_groups), session, formGroupsSlice, 
    { 
      loadQuery: session.api.form_groups.getSome,
      findOne: session.api.form_groups.getOne,
      findByIds: session.api.form_groups.getByIds,
      addOne: session.api.form_groups.createOne,
      addSome: session.api.form_groups.createSome,
      deleteOne: session.api.form_groups.deleteOne,
      updateOne: session.api.form_groups.updateOne,
    }, 
    {...options}
  )
}
export const useFlowchartNotes = (options={} as HookOptions<FlowchartNote>) => {
  const session = useSession()
  return useListStateHook(
    'flowchart_notes', useTypedSelector(s => s.flowchart_notes), session, flowchartNotesSlice, 
    { 
      loadQuery: session.api.flowchart_notes.getSome,
      findOne: session.api.flowchart_notes.getOne,
      findByIds: session.api.flowchart_notes.getByIds,
      addOne: session.api.flowchart_notes.createOne,
      addSome: session.api.flowchart_notes.createSome,
      deleteOne: session.api.flowchart_notes.deleteOne,
      updateOne: session.api.flowchart_notes.updateOne,
    }, 
    {...options}
  )
}
export const useEnduserEncounters = (options={} as HookOptions<EnduserEncounter>) => {
  const session = useSession()
  return useListStateHook(
    'enduser_encounters', useTypedSelector(s => s.enduser_encounters), session, enduserEncountersSlice, 
    { 
      loadQuery: session.api.enduser_encounters.getSome,
      findOne: session.api.enduser_encounters.getOne,
      findByIds: session.api.enduser_encounters.getByIds,
      addOne: session.api.enduser_encounters.createOne,
      addSome: session.api.enduser_encounters.createSome,
      deleteOne: session.api.enduser_encounters.deleteOne,
      updateOne: session.api.enduser_encounters.updateOne,
    }, 
    {...options}
  )
}
export const useVitalConfigurations = (options={} as HookOptions<VitalConfiguration>) => {
  const session = useSession()
  return useListStateHook(
    'vital_configurations', useTypedSelector(s => s.vital_configurations), session, vitalConfigurationsSlice, 
    { 
      loadQuery: session.api.vital_configurations.getSome,
      findOne: session.api.vital_configurations.getOne,
      findByIds: session.api.vital_configurations.getByIds,
      addOne: session.api.vital_configurations.createOne,
      addSome: session.api.vital_configurations.createSome,
      deleteOne: session.api.vital_configurations.deleteOne,
      updateOne: session.api.vital_configurations.updateOne,
    }, 
    {...options}
  )
}

export const useCalendarEvents = (options={} as HookOptions<CalendarEvent>) => {
  const session = useResolvedSession()

  return useListStateHook('calendar_events', useTypedSelector(s => s.calendar_events), session, calendarEventsSlice,
    { 
      loadQuery: session.api.calendar_events.getSome,
      findOne: session.api.calendar_events.getOne,
      findByIds: session.api.calendar_events.getByIds,
      addOne: session.api.calendar_events.createOne,
      addSome: session.api.calendar_events.createSome,
      deleteOne: session.api.calendar_events.deleteOne,
      updateOne: session.api.calendar_events.updateOne,
    },
    { 
      ...options,
    },
  )
}

export const useEngagementEvents = (options={} as HookOptions<EngagementEvent>) => {
  const session = useResolvedSession()

  return useListStateHook('engagement_events', useTypedSelector(s => s.engagement_events), session, engagementEventsSlice,
    { 
      loadQuery: session.api.engagement_events.getSome,
      findOne: session.api.engagement_events.getOne,
      findByIds: session.api.engagement_events.getByIds,
      addOne: session.api.engagement_events.createOne,
      addSome: session.api.engagement_events.createSome,
      deleteOne: session.api.engagement_events.deleteOne,
      updateOne: session.api.engagement_events.updateOne,
    },
    { 
      ...options,
    },
  )
}

export const useGroupMMSConversations = (options={} as HookOptions<GroupMMSConversation>) => {
  const session = useSession() 

  return useListStateHook('group_mms_conversations', useTypedSelector(s => s.group_mms_conversations), session, groupMMSConversationsSlice,
    { 
      loadQuery: session.api.group_mms_conversations.getSome,
      findOne: session.api.group_mms_conversations.getOne,
      findByIds: session.api.group_mms_conversations.getByIds,
      addOne: session.api.group_mms_conversations.createOne,
      addSome: session.api.group_mms_conversations.createSome,
      deleteOne: session.api.group_mms_conversations.deleteOne,
      updateOne: session.api.group_mms_conversations.updateOne,
    },
    { 
      ...options,
    },
  )
}

export const useEnduserProfileViews = (options={} as HookOptions<EnduserProfileView>) => {
  const session = useSession() 

  return useListStateHook('enduser_profile_views', useTypedSelector(s => s.enduser_profile_views), session, enduserProfileViewsSlice,
    { 
      loadQuery: session.api.enduser_profile_views.getSome,
      findOne: session.api.enduser_profile_views.getOne,
      findByIds: session.api.enduser_profile_views.getByIds,
      addOne: session.api.enduser_profile_views.createOne,
      addSome: session.api.enduser_profile_views.createSome,
      deleteOne: session.api.enduser_profile_views.deleteOne,
      updateOne: session.api.enduser_profile_views.updateOne,
    },
    { 
      ...options,
    },
  )
}
export const useCallHoldQueues = (options={} as HookOptions<CallHoldQueue>) => {
  const session = useSession() 

  return useListStateHook('call_hold_queues', useTypedSelector(s => s.call_hold_queues), session, callHoldQueuesSlice,
    { 
      loadQuery: session.api.call_hold_queues.getSome,
      findOne: session.api.call_hold_queues.getOne,
      findByIds: session.api.call_hold_queues.getByIds,
      addOne: session.api.call_hold_queues.createOne,
      addSome: session.api.call_hold_queues.createSome,
      deleteOne: session.api.call_hold_queues.deleteOne,
      updateOne: session.api.call_hold_queues.updateOne,
    },
    { 
      ...options,
    },
  )
}
export const useTicketQueues = (options={} as HookOptions<TicketQueue>) => {
  const session = useSession() 

  return useListStateHook('ticket_queues', useTypedSelector(s => s.ticket_queues), session, ticketQueuesSlice,
    { 
      loadQuery: session.api.ticket_queues.getSome,
      findOne: session.api.ticket_queues.getOne,
      findByIds: session.api.ticket_queues.getByIds,
      addOne: session.api.ticket_queues.createOne,
      addSome: session.api.ticket_queues.createSome,
      deleteOne: session.api.ticket_queues.deleteOne,
      updateOne: session.api.ticket_queues.updateOne,
    },
    { 
      ...options,
    },
  )
}
export const useConfigurations = (options={} as HookOptions<Configuration>) => {
  const session = useSession() 

  return useListStateHook('configurations', useTypedSelector(s => s.configurations), session, configurationsSlice,
    { 
      loadQuery: session.api.configurations.getSome,
      findOne: session.api.configurations.getOne,
      findByIds: session.api.configurations.getByIds,
      addOne: session.api.configurations.createOne,
      addSome: session.api.configurations.createSome,
      deleteOne: session.api.configurations.deleteOne,
      updateOne: session.api.configurations.updateOne,
    },
    { 
      ...options,
    },
  )
}
export const usePhoneTrees = (options={} as HookOptions<PhoneTree>) => {
  const session = useSession() 

  return useListStateHook('phone_trees', useTypedSelector(s => s.phone_trees), session, phoneTreesSlice,
    { 
      loadQuery: session.api.phone_trees.getSome,
      findOne: session.api.phone_trees.getOne,
      findByIds: session.api.phone_trees.getByIds,
      addOne: session.api.phone_trees.createOne,
      addSome: session.api.phone_trees.createSome,
      deleteOne: session.api.phone_trees.deleteOne,
      updateOne: session.api.phone_trees.updateOne,
    },
    { 
      ...options,
    },
  )
}
export const useAutomationTriggers = (options={} as HookOptions<AutomationTrigger>) => {
  const session = useSession() 

  return useListStateHook('automation_triggers', useTypedSelector(s => s.automation_triggers), session, automationTriggersSlice,
    { 
      loadQuery: session.api.automation_triggers.getSome,
      findOne: session.api.automation_triggers.getOne,
      findByIds: session.api.automation_triggers.getByIds,
      addOne: session.api.automation_triggers.createOne,
      addSome: session.api.automation_triggers.createSome,
      deleteOne: session.api.automation_triggers.deleteOne,
      updateOne: session.api.automation_triggers.updateOne,
    },
    { 
      ...options,
    },
  )
}
export const useAutomatedActions = (options={} as HookOptions<AutomatedAction>) => {
  const session = useSession() 

  return useListStateHook('automated_actions', useTypedSelector(s => s.automated_actions), session, automatedActionsSlice,
    { 
      loadQuery: session.api.automated_actions.getSome,
      findOne: session.api.automated_actions.getOne,
      findByIds: session.api.automated_actions.getByIds,
      addOne: session.api.automated_actions.createOne,
      addSome: session.api.automated_actions.createSome,
      deleteOne: session.api.automated_actions.deleteOne,
      updateOne: session.api.automated_actions.updateOne,
    },
    { 
      ...options,
    },
  )
}
export const useEmails = (options={} as HookOptions<Email>) => {
  const session = useSession() // endusers cannot send emails for now

  return useListStateHook('emails', useTypedSelector(s => s.emails), session, emailsSlice,
    { 
      loadQuery: session.api.emails.getSome,
      findOne: session.api.emails.getOne,
      findByIds: session.api.emails.getByIds,
      addOne: session.api.emails.createOne,
      addSome: session.api.emails.createSome,
      deleteOne: session.api.emails.deleteOne,
      updateOne: session.api.emails.updateOne,
    },
    { 
      ...options,
    },
  )
}
export const useSmsMessages = (options={} as HookOptions<SMSMessage>) => {
  const session = useSession() // endusers cannot send sms messages for now

  return useListStateHook('sms_messages', useTypedSelector(s => s.sms_messages), session, smsMessagesSlice,
    { 
      loadQuery: session.api.sms_messages.getSome,
      findOne: session.api.sms_messages.getOne,
      findByIds: session.api.sms_messages.getByIds,
      addOne: session.api.sms_messages.createOne,
      addSome: session.api.sms_messages.createSome,
      deleteOne: session.api.sms_messages.deleteOne,
      updateOne: session.api.sms_messages.updateOne,
    },
    { 
      ...options,
    },
  )
}
export const useNotifications = (options={} as HookOptions<UserNotification>) => {
  const session = useSession() // endusers do not have notifications

  return useListStateHook('user_notifications', useTypedSelector(s => s.user_notifications), session, userNotifcationsSlice,
    { 
      loadQuery: session.api.user_notifications.getSome,
      findOne: session.api.user_notifications.getOne,
      findByIds: session.api.user_notifications.getByIds,
      addOne: session.api.user_notifications.createOne,
      addSome: session.api.user_notifications.createSome,
      deleteOne: session.api.user_notifications.deleteOne,
      updateOne: session.api.user_notifications.updateOne,
    },
    { 
      ...options,
    },
  )
}

export const useUserLogs = (options={} as HookOptions<UserLog>) => {
  const session = useSession() 

  return useListStateHook('user_logs', useTypedSelector(s => s.user_logs), session, userLogsSlice,
    { 
      loadQuery: session.api.user_logs.getSome,
      findOne: session.api.user_logs.getOne,
      findByIds: session.api.user_logs.getByIds,
      addOne: session.api.user_logs.createOne,
      addSome: session.api.user_logs.createSome,
      deleteOne: session.api.user_logs.deleteOne,
      updateOne: session.api.user_logs.updateOne,
    },
    { 
      ...options,
    },
  )
}

export const useAnalyticsFrames = (options={} as HookOptions<AnalyticsFrame>) => {
  const session = useSession() 

  return useListStateHook('analytics_frames', useTypedSelector(s => s.analytics_frames), session, analyticsFramesSlice,
    { 
      loadQuery: session.api.analytics_frames.getSome,
      findOne: session.api.analytics_frames.getOne,
      findByIds: session.api.analytics_frames.getByIds,
      addOne: session.api.analytics_frames.createOne,
      addSome: session.api.analytics_frames.createSome,
      deleteOne: session.api.analytics_frames.deleteOne,
      updateOne: session.api.analytics_frames.updateOne,
    },
    { 
      ...options,
    },
  )
}

export const useEnduserCustomTypes = (options={} as HookOptions<EnduserCustomType>) => {
  const session = useSession() 

  return useListStateHook('enduser_custom_types', useTypedSelector(s => s.enduser_custom_types), session, enduserCustomTypesSlice,
    { 
      loadQuery: session.api.enduser_custom_types.getSome,
      findOne: session.api.enduser_custom_types.getOne,
      findByIds: session.api.enduser_custom_types.getByIds,
      addOne: session.api.enduser_custom_types.createOne,
      addSome: session.api.enduser_custom_types.createSome,
      deleteOne: session.api.enduser_custom_types.deleteOne,
      updateOne: session.api.enduser_custom_types.updateOne,
    },
    { 
      ...options,
    },
  )
}

export const useChatRooms = (options={} as HookOptions<ChatRoom>) => {
  const session = useResolvedSession()
  // const dispatch = useTellescopeDispatch()
  const rooms = useTypedSelector(s => s.chat_rooms)

  // const onUpdate = useCallback((updated: ({ id: string | number } & Partial<ChatRoom>)[]) => {
  //   for (const u of updated) {
  //     // fetch updated display info if enduserIds or userIds have changed
  //     if (!(value_is_loaded(rooms) && rooms.value.find(v => v.id === u.id && v.updatedAt === u.updatedAt))) {
  //       session.api.chat_rooms.display_info({ id: u.id })
  //       .then(({ id, display_info }) => {
  //         dispatch(chatRoomDisplayInfoslice.actions.update({ value: { id, updates: display_info }}))
  //       })
  //       .catch(e => console.error('Error fetching chatRoomDisplayInfo in useChatRooms onUpdate', e))
  //     }
  //   }
  // }, [session, dispatch])

  return useListStateHook('chat_rooms', rooms, session, chatRoomsSlice,
    { 
      loadQuery: session.api.chat_rooms.getSome,
      findOne: session.api.chat_rooms.getOne,
      findByIds: session.api.chat_rooms.getByIds,
      addOne: session.api.chat_rooms.createOne,
      addSome: session.api.chat_rooms.createSome,
      deleteOne: session.api.chat_rooms.deleteOne,
      updateOne: session.api.chat_rooms.updateOne,
    },
    { 
      // onUpdate, 
      ...options,
    },
  )
}

export const useChats = (roomId?: string, options={} as HookOptions<ChatMessage>) => {
  const session = useResolvedSession()
  const state = useTypedSelector(s => s.chats)
  const [_, { updateLocalElement: updateLocalChatRoom }] = useChatRooms()  

  // don't rely on socket update for new messages
  const onAdd = useCallback((ms: ChatMessage[]) => {
    if (ms.length === 0) return

    const newest = ms[0]
    updateLocalChatRoom(newest.roomId, { 
      recentMessage: newest.message, 
      recentSender: newest.senderId ?? '',
      recentMessageSentAt: Date.now(),
    })
  }, [updateLocalChatRoom])

  const toReturn = useListStateHook(
    'chats', state, session, chatsSlice,
    { 
      loadQuery: session.api.chats.getSome, // !roomId ? undefined : session.api.chats.getSome,
      findOne: session.api.chats.getOne,
      findByIds: session.api.chats.getByIds,
      addOne: session.api.chats.createOne,
      addSome: session.api.chats.createSome,
      deleteOne: session.api.chats.deleteOne,
      updateOne: session.api.chats.updateOne,
    }, 
    {
      ...options,
      loadFilter: { ...options.loadFilter, roomId },
      // returnFilter: v => (options.returnFilter ?? (v => true))(v) && v.roomId === roomId,
      onAdd,
    }
  ) 

  if (roomId) {
    return [toReturn[1].filtered(c => c.roomId === roomId), toReturn[1]] as typeof toReturn
  }
  
  return toReturn
}

export const useEndusers = (options={} as HookOptions<Enduser>) => {
  const session = useResolvedSession()
  return useListStateHook(
    'endusers', 
    useTypedSelector(s => s.endusers), 
    session, 
    endusersSlice, 
    { 
      loadQuery: session.api.endusers.getSome,
      findOne: session.api.endusers.getOne,
      findByIds: session.api.endusers.getByIds,
      addOne: session.api.endusers.createOne,
      addSome: session.api.endusers.createSome,
      deleteOne: session.api.endusers.deleteOne,
      updateOne: session.api.endusers.updateOne,
     },
    {...options}
  )
}
export const useTickets = (options={} as HookOptions<Ticket>) => {
  const session = useResolvedSession()
  return useListStateHook(
    'tickets', useTypedSelector(s => s.tickets), session, ticketsSlice, 
    { 
      loadQuery: session.api.tickets.getSome,
      findOne: session.api.tickets.getOne,
      findByIds: session.api.tickets.getByIds,
      addOne: session.api.tickets.createOne,
      addSome: session.api.tickets.createSome,
      deleteOne: session.api.tickets.deleteOne,
      updateOne: session.api.tickets.updateOne,
    }, 
    {...options}
  )
}
export const useMeetings = (options={} as HookOptions<Meeting>) => {
  const session = useResolvedSession()
  return useListStateHook(
    'meetings', useTypedSelector(s => s.meetings), session, meetingsSlice, 
    { 
      loadQuery: session.api.meetings.my_meetings,
      findOne: session.api.meetings.getOne,
      findByIds: session.api.meetings.getByIds,
      addOne: session.api.meetings.createOne,
      addSome: session.api.meetings.createSome,
      deleteOne: session.api.meetings.deleteOne,
      updateOne: session.api.meetings.updateOne,
    }, 
    {...options}
  )
}
export const useFiles = (options={} as HookOptions<File>) => {
  const session = useResolvedSession()
  return useListStateHook(
    'files', useTypedSelector(s => s.files), session, filesSlice, 
    { 
      loadQuery: session.api.files.getSome,
      findOne: session.api.files.getOne,
      findByIds: session.api.files.getByIds,
      deleteOne: session.api.files.deleteOne,
      updateOne: session.api.files.updateOne,
    }, 
    {...options}
  )
}
export const useJourneys = (options={} as HookOptions<Journey>) => {
  const session = useSession()
  return useListStateHook(
    'journeys', useTypedSelector(s => s.journeys), session, journeysSlice, 
    { 
      loadQuery: session.api.journeys.getSome,
      findOne: session.api.journeys.getOne,
      findByIds: session.api.journeys.getByIds,
      addOne: session.api.journeys.createOne,
      addSome: session.api.journeys.createSome,
      deleteOne: session.api.journeys.deleteOne,
      updateOne: session.api.journeys.updateOne,
    }, 
    {...options}
  )
}
export const useUsers = (options={} as HookOptions<User>) => {
  const session = useResolvedSession()
  return useListStateHook(
    'users', useTypedSelector(s => s.users), session, usersSlice, 
    { 
      loadQuery: session.api.users.getSome,
      findOne: session.api.users.getOne,
      findByIds: session.api.users.getByIds,
      addOne: session.api.users.createOne,
      addSome: session.api.users.createSome,
      deleteOne: session.api.users.deleteOne,
      updateOne: session.api.users.updateOne,
    }, 
    {...options}
  )
}
export const useAutomationSteps = (options={} as HookOptions<AutomationStep>) => {
  const session = useSession()
  return useListStateHook(
    'automation_steps', useTypedSelector(s => s.automation_steps), session, automationStepsSlice, 
    { 
      loadQuery: session.api.automation_steps.getSome,
      findOne: session.api.automation_steps.getOne,
      findByIds: session.api.automation_steps.getByIds,
      addOne: session.api.automation_steps.createOne,
      addSome: session.api.automation_steps.createSome,
      deleteOne: session.api.automation_steps.deleteOne,
      updateOne: session.api.automation_steps.updateOne,
    }, 
    {...options}
  )
}
export const useNotes = (options={} as HookOptions<Note>) => {
  const session = useSession()
  return useListStateHook(
    'notes', useTypedSelector(s => s.notes), session, notesSlice, 
    { 
      loadQuery: session.api.notes.getSome,
      findOne: session.api.notes.getOne,
      findByIds: session.api.notes.getByIds,
      addOne: session.api.notes.createOne,
      addSome: session.api.notes.createSome,
      deleteOne: session.api.notes.deleteOne,
      updateOne: session.api.notes.updateOne,
    }, 
    {...options}
  )
}
export const useAvailabilityBlocks = (options={} as HookOptions<AvailabilityBlock>) => {
  const session = useSession()
  return useListStateHook(
    'availability_blocks', useTypedSelector(s => s.availability_blocks), session, availabilityBlocksSlice, 
    { 
      loadQuery: session.api.availability_blocks.getSome,
      findOne: session.api.availability_blocks.getOne,
      findByIds: session.api.availability_blocks.getByIds,
      addOne: session.api.availability_blocks.createOne,
      addSome: session.api.availability_blocks.createSome,
      deleteOne: session.api.availability_blocks.deleteOne,
      updateOne: session.api.availability_blocks.updateOne,
    }, 
    {...options}
  )
}
export const useTemplates = (options={} as HookOptions<Template>) => {
  const session = useSession()
  return useListStateHook(
    'templates', useTypedSelector(s => s.templates), session, templatesSlice, 
    { 
      loadQuery: session.api.templates.getSome,
      findOne: session.api.templates.getOne,
      findByIds: session.api.templates.getByIds,
      addOne: session.api.templates.createOne,
      addSome: session.api.templates.createSome,
      deleteOne: session.api.templates.deleteOne,
      updateOne: session.api.templates.updateOne,
    }, 
    {...options}
  )
}
export const useForms = (options={} as HookOptions<Form>) => {
  const session = useResolvedSession()
  return useListStateHook(
    'forms', useTypedSelector(s => s.forms), session, formsSlice, 
    { 
      loadQuery: session.api.forms.getSome,
      findOne: session.api.forms.getOne,
      findByIds: session.api.forms.getByIds,
      addOne: session.api.forms.createOne,
      addSome: session.api.forms.createSome,
      deleteOne: session.api.forms.deleteOne,
      updateOne: session.api.forms.updateOne,
    }, 
    {...options}
  )
}
export const useFormFields = (options={} as HookOptions<FormField>) => {
  const session = useResolvedSession()
  return useListStateHook(
    'form_fields', useTypedSelector(s => s.form_fields), session, formsFieldsSlice, 
    { 
      loadQuery: session.api.form_fields.getSome,
      findOne: session.api.form_fields.getOne,
      findByIds: session.api.form_fields.getByIds,
      addOne: session.api.form_fields.createOne,
      addSome: session.api.form_fields.createSome,
      deleteOne: session.api.form_fields.deleteOne,
      updateOne: session.api.form_fields.updateOne,
    }, 
    {...options}
  )
}

export const useFormResponses = (options={} as HookOptions<FormResponse>) => {
  const session = useResolvedSession()
  return useListStateHook(
    'form_responses', useTypedSelector(s => s.form_responses), session, formResponsesSlice, 
    { 
      loadQuery: session.api.form_responses.getSome,
      findOne: session.api.form_responses.getOne,
      findByIds: session.api.form_responses.getByIds,
      addOne: session.api.form_responses.createOne,
      addSome: session.api.form_responses.createSome,
      deleteOne: session.api.form_responses.deleteOne,
      updateOne: session.api.form_responses.updateOne,
    }, 
    {
      ...options,
    }
  ) 
}

/** @deprecated */
export const useUserDisplayInfo = (options={} as HookOptions<UserDisplayInfo>) => {
  const session = useEnduserSession()  
  const state = useTypedSelector(s => s.users_display)
  return useListStateHook(
    'users', state, session, usersDisplaySlice, 
    { 
      loadQuery: session.api.users.display_info,
    }, 
    { ...options }
  )
}

export const useEnduserObservations = (options={} as HookOptions<EnduserObservation>) => {
  const session = useResolvedSession()
  return useListStateHook(
    'enduser_observations', useTypedSelector(s => s.enduser_observations), session, enduserObservationsSlice, 
    { 
      loadQuery: session.api.enduser_observations.getSome,
      findOne: session.api.enduser_observations.getOne,
      findByIds: session.api.enduser_observations.getByIds,
      addOne: session.api.enduser_observations.createOne,
      addSome: session.api.enduser_observations.createSome,
      deleteOne: session.api.enduser_observations.deleteOne,
      updateOne: session.api.enduser_observations.updateOne,
    }, 
    {...options}
  )
}

export const useManagedContentRecords = (options={} as HookOptions<ManagedContentRecord>) => {
  const session = useResolvedSession()
  return useListStateHook(
    'managed_content_records', useTypedSelector(s => s.managed_content_records), session, managedContentRecoredsSlice, 
    { 
      loadQuery: session.api.managed_content_records.getSome,
      findOne: session.api.managed_content_records.getOne,
      findByIds: session.api.managed_content_records.getByIds,
      addOne: session.api.managed_content_records.createOne,
      addSome: session.api.managed_content_records.createSome,
      deleteOne: session.api.managed_content_records.deleteOne,
      updateOne: session.api.managed_content_records.updateOne,
    }, 
    {...options}
  )
}
export const useManagedContentRecordAssignments = (options={} as HookOptions<ManagedContentRecordAssignment>) => {
  const session = useResolvedSession()
  return useListStateHook(
    'managed_content_record_assignments', useTypedSelector(s => s.managed_content_record_assignments), session, managedContentRecoredAssignmentsSlice, 
    { 
      loadQuery: session.api.managed_content_record_assignments.getSome,
      findOne: session.api.managed_content_record_assignments.getOne,
      findByIds: session.api.managed_content_record_assignments.getByIds,
      addOne: session.api.managed_content_record_assignments.createOne,
      addSome: session.api.managed_content_record_assignments.createSome,
      deleteOne: session.api.managed_content_record_assignments.deleteOne,
      updateOne: session.api.managed_content_record_assignments.updateOne,
    }, 
    {...options}
  )
}
export const useAssignedManagedContentRecords = () => {
  const session = useEnduserSession()
  
  const [, { filtered }] = useManagedContentRecords()
  const [eventsLoading] = useCalendarEvents()

  const [assignmentsLoading] = useManagedContentRecordAssignments()

  if (!value_is_loaded(assignmentsLoading)) return {
    status: assignmentsLoading.status,
    value: undefined
  } as LoadedData<ManagedContentRecord[]>

  const recordsLoading = filtered(r => 
      r.assignmentType === 'All'
    || r.enduserId === session.userInfo.id
    || !!assignmentsLoading.value.find(e => e.contentId === r.id)
    || (
        r.assignmentType === 'By Tags' 
    &&  r.tags?.length 
    &&  !!r.tags.find(t => session.userInfo.tags?.includes(t))
    ) 
    || (
       value_is_loaded(eventsLoading)
    && !!eventsLoading.value.find(e => e.sharedContentIds?.includes(r.id))
    )
  )

  return recordsLoading
}

export const useForums = (options={} as HookOptions<Forum>) => {
  const session = useResolvedSession()
  return useListStateHook(
    'forums', useTypedSelector(s => s.forums), session, forumsSlice, 
    { 
      loadQuery: session.api.forums.getSome,
      findOne: session.api.forums.getOne,
      findByIds: session.api.forums.getByIds,
      addOne: session.api.forums.createOne,
      addSome: session.api.forums.createSome,
      deleteOne: session.api.forums.deleteOne,
      updateOne: session.api.forums.updateOne,
    }, 
    {...options}
  )
}
export const useForumPosts = (options={} as HookOptions<ForumPost>) => {
  const session = useResolvedSession()
  return useListStateHook(
    'forum_posts', useTypedSelector(s => s.forum_posts), session, forumPostsSlice, 
    { 
      loadQuery: session.api.forum_posts.getSome,
      findOne: session.api.forum_posts.getOne,
      findByIds: session.api.forum_posts.getByIds,
      addOne: session.api.forum_posts.createOne,
      addSome: session.api.forum_posts.createSome,
      deleteOne: session.api.forum_posts.deleteOne,
      updateOne: session.api.forum_posts.updateOne,
    }, 
    {...options}
  )
}
export const usePostComments = (options={} as HookOptions<PostComment>) => {
  const session = useResolvedSession()
  return useListStateHook(
    'post_comments', useTypedSelector(s => s.post_comments), session, postCommentsSlice, 
    { 
      loadQuery: session.api.post_comments.getSome,
      findOne: session.api.post_comments.getOne,
      findByIds: session.api.post_comments.getByIds,
      addOne: session.api.post_comments.createOne,
      addSome: session.api.post_comments.createSome,
      deleteOne: session.api.post_comments.deleteOne,
      updateOne: session.api.post_comments.updateOne,
    }, 
    {...options}
  )
}
export const usePostLikes = (options={} as HookOptions<PostLike>) => {
  const session = useResolvedSession()
  return useListStateHook(
    'post_likes', useTypedSelector(s => s.post_likes), session, postLikesSlice, 
    { 
      loadQuery: session.api.post_likes.getSome,
      findOne: session.api.post_likes.getOne,
      findByIds: session.api.post_likes.getByIds,
      addOne: session.api.post_likes.createOne,
      addSome: session.api.post_likes.createSome,
      deleteOne: session.api.post_likes.deleteOne,
      updateOne: session.api.post_likes.updateOne,
    }, 
    {...options}
  )
}
export const useCommentLikes = (options={} as HookOptions<CommentLike>) => {
  const session = useResolvedSession()
  return useListStateHook(
    'comment_likes', useTypedSelector(s => s.comment_likes), session, commentLikesSlice, 
    { 
      loadQuery: session.api.comment_likes.getSome,
      findOne: session.api.comment_likes.getOne,
      findByIds: session.api.comment_likes.getByIds,
      addOne: session.api.comment_likes.createOne,
      addSome: session.api.comment_likes.createSome,
      deleteOne: session.api.comment_likes.deleteOne,
      updateOne: session.api.comment_likes.updateOne,
    }, 
    {...options}
  )
}

export const useCalendarEventRSVPs = (options={} as HookOptions<CalendarEventRSVP>) => {
  const session = useResolvedSession()
  return useListStateHook(
    'calendar_event_RSVPs', useTypedSelector(s => s.calendar_event_RSVPs), session, calendarEventRSVPsSlice, 
    { 
      loadQuery: session.api.calendar_event_RSVPs.getSome,
      findOne: session.api.calendar_event_RSVPs.getOne,
      findByIds: session.api.calendar_event_RSVPs.getByIds,
      addOne: session.api.calendar_event_RSVPs.createOne,
      addSome: session.api.calendar_event_RSVPs.createSome,
      deleteOne: session.api.calendar_event_RSVPs.deleteOne,
      updateOne: session.api.calendar_event_RSVPs.updateOne,
    }, 
    {...options}
  )
}


export const useRoleBasedAccessPermissions = (options={} as HookOptions<Organization>) => {
  const session = useSession()
  return useListStateHook(
    'role_based_access_permissions', useTypedSelector(s => s.role_based_access_permissions), session, roleBasedAccessPermissionsSlice, 
    { 
      loadQuery: session.api.role_based_access_permissions.getSome,
      findOne: session.api.role_based_access_permissions.getOne,
      findByIds: session.api.role_based_access_permissions.getByIds,
      addOne: session.api.role_based_access_permissions.createOne,
      addSome: session.api.role_based_access_permissions.createSome,
      deleteOne: session.api.role_based_access_permissions.deleteOne,
      updateOne: session.api.role_based_access_permissions.updateOne,
    }, 
    // @ts-ignore
    {...options}
  )
}


export const useTicketThreads = (options={} as HookOptions<TicketThread>) => {
  const session = useSession()
  return useListStateHook(
    'ticket_threads', useTypedSelector(s => s.ticket_threads), session, ticketThreadsSlice, 
    { 
      loadQuery: session.api.ticket_threads.getSome,
      findOne: session.api.ticket_threads.getOne,
      findByIds: session.api.ticket_threads.getByIds,
      addOne: session.api.ticket_threads.createOne,
      addSome: session.api.ticket_threads.createSome,
      deleteOne: session.api.ticket_threads.deleteOne,
      updateOne: session.api.ticket_threads.updateOne,
    }, 
    { // don't attempt to fetch if not enabled
      ...options,
      dontFetch: options.dontFetch ?? !session.userInfo.ticketThreadsEnabled,
    }
  )
}
export const useTicketThreadComments = (options={} as HookOptions<TicketThreadComment>) => {
  const session = useSession()
  return useListStateHook(
    'ticket_thread_comments', useTypedSelector(s => s.ticket_thread_comments), session, ticketThreadCommentsSlice, 
    { 
      loadQuery: session.api.ticket_thread_comments.getSome,
      findOne: session.api.ticket_thread_comments.getOne,
      findByIds: session.api.ticket_thread_comments.getByIds,
      addOne: session.api.ticket_thread_comments.createOne,
      addSome: session.api.ticket_thread_comments.createSome,
      deleteOne: session.api.ticket_thread_comments.deleteOne,
      updateOne: session.api.ticket_thread_comments.updateOne,
    }, 
    { // don't attempt to fetch if not enabled
      ...options,
      dontFetch: options.dontFetch ?? !session.userInfo.ticketThreadsEnabled,
    }
  )
}
export const useSuperbills = (options={} as HookOptions<Superbill>) => {
  const session = useSession()
  return useListStateHook(
    'superbills', useTypedSelector(s => s.superbills), session, superbillsSlice, 
    { 
      loadQuery: session.api.superbills.getSome,
      findOne: session.api.superbills.getOne,
      findByIds: session.api.superbills.getByIds,
      addOne: session.api.superbills.createOne,
      addSome: session.api.superbills.createSome,
      deleteOne: session.api.superbills.deleteOne,
      updateOne: session.api.superbills.updateOne,
    }, 
    {...options}
  )
}
export const useSuperbillProviders = (options={} as HookOptions<SuperbillProvider>) => {
  const session = useSession()
  return useListStateHook(
    'superbill_providers', useTypedSelector(s => s.superbill_providers), session, superbillProvidersSlice, 
    { 
      loadQuery: session.api.superbill_providers.getSome,
      findOne: session.api.superbill_providers.getOne,
      findByIds: session.api.superbill_providers.getByIds,
      addOne: session.api.superbill_providers.createOne,
      addSome: session.api.superbill_providers.createSome,
      deleteOne: session.api.superbill_providers.deleteOne,
      updateOne: session.api.superbill_providers.updateOne,
    }, 
    {...options}
  )
}
export const useTableViews = (options={} as HookOptions<TableView>) => {
  const session = useSession()
  return useListStateHook(
    'table_views', useTypedSelector(s => s.table_views), session, tableViewsSlice, 
    { 
      loadQuery: session.api.table_views.getSome,
      findOne: session.api.table_views.getOne,
      findByIds: session.api.table_views.getByIds,
      addOne: session.api.table_views.createOne,
      addSome: session.api.table_views.createSome,
      deleteOne: session.api.table_views.deleteOne,
      updateOne: session.api.table_views.updateOne,
    }, 
    {...options}
  )
}
export const useEmailSyncDenials = (options={} as HookOptions<EmailSyncDenial>) => {
  const session = useSession()
  return useListStateHook(
    'email_sync_denials', useTypedSelector(s => s.email_sync_denials), session, emailSyncDenialsSlice, 
    { 
      loadQuery: session.api.email_sync_denials.getSome,
      findOne: session.api.email_sync_denials.getOne,
      findByIds: session.api.email_sync_denials.getByIds,
      addOne: session.api.email_sync_denials.createOne,
      addSome: session.api.email_sync_denials.createSome,
      deleteOne: session.api.email_sync_denials.deleteOne,
      updateOne: session.api.email_sync_denials.updateOne,
    }, 
    {...options}
  )
}


export const usePhoneCalls = (options={} as HookOptions<PhoneCall>) => {
  const session = useSession()
  return useListStateHook(
    'phone_calls', useTypedSelector(s => s.phone_calls), session, phoneCallsSlice, 
    { 
      loadQuery: session.api.phone_calls.getSome,
      findOne: session.api.phone_calls.getOne,
      findByIds: session.api.phone_calls.getByIds,
      addOne: session.api.phone_calls.createOne,
      addSome: session.api.phone_calls.createSome,
      deleteOne: session.api.phone_calls.deleteOne,
      updateOne: session.api.phone_calls.updateOne,
    }, 
    { 
      ...options,
      dontFetch: options.dontFetch ?? !(session.userInfo.orgTwilioNumber || session.userInfo.twilioNumber)
    }
  )
}

export const useOrganizations = (options={} as HookOptions<Organization>) => {
  const session = useSession()
  return useListStateHook(
    'organizations', useTypedSelector(s => s.organizations), session, organizationsSlice, 
    { 
      loadQuery: session.api.organizations.getSome,
      findOne: session.api.organizations.getOne,
      findByIds: session.api.organizations.getByIds,
      // addOne: session.api.organizations.createOne,
      // addSome: session.api.organizations.createSome,
      deleteOne: session.api.organizations.deleteOne,
      updateOne: session.api.organizations.updateOne,
    }, 
    {...options}
  )
}
export const useOrganization = (options={} as HookOptions<Organization>) => {
  const session = useResolvedSession()
  const [organizationsLoading, actions] = useOrganizations(options)

  return [
    {
      status: organizationsLoading.status,
      value: (
        value_is_loaded(organizationsLoading)
          ? organizationsLoading.value.find(o => matches_organization(session.userInfo, o)) 
          : undefined
      )
    } as LoadedData<Organization>,
    actions as ReturnType<typeof useOrganizations>[1],
  ] as const
}

export const useIntegrations = (options={} as HookOptions<Integration>) => {
  const session = useResolvedSession()
  return useListStateHook(
    'integrations', useTypedSelector(s => s.integrations), session, integrationsSlice, 
    { 
      loadQuery: session.api.integrations.getSome,
      findOne: session.api.integrations.getOne,
      findByIds: session.api.integrations.getByIds,
      addOne: session.api.integrations.createOne,
      addSome: session.api.integrations.createSome,
      deleteOne: session.api.integrations.deleteOne,
      updateOne: session.api.integrations.updateOne,
    }, 
    {...options}
  )
}

export const usePortalCustomizations = (options={} as HookOptions<PortalCustomization>) => {
  const session = useResolvedSession()
  return useListStateHook(
    'portal_customizations', useTypedSelector(s => s.portal_customizations), session, portalCustomizationsSlice, 
    { 
      loadQuery: session.api.portal_customizations.getSome,
      findOne: session.api.portal_customizations.getOne,
      findByIds: session.api.portal_customizations.getByIds,
      addOne: session.api.portal_customizations.createOne,
      addSome: session.api.portal_customizations.createSome,
      deleteOne: session.api.portal_customizations.deleteOne,
      updateOne: session.api.portal_customizations.updateOne,
    }, 
    {...options}
  )
}

export const useCarePlans = (options={} as HookOptions<CarePlan>) => {
  const session = useResolvedSession()
  return useListStateHook(
    'care_plans', useTypedSelector(s => s.care_plans), session, carePlansSlice, 
    { 
      loadQuery: session.api.care_plans.getSome,
      findOne: session.api.care_plans.getOne,
      findByIds: session.api.care_plans.getByIds,
      addOne: session.api.care_plans.createOne,
      addSome: session.api.care_plans.createSome,
      deleteOne: session.api.care_plans.deleteOne,
      updateOne: session.api.care_plans.updateOne,
    }, 
    {...options}
  )
}

export const useEnduserTasks = (options={} as HookOptions<EnduserTask>) => {
  const session = useResolvedSession()
  return useListStateHook(
    'enduser_tasks', useTypedSelector(s => s.enduser_tasks), session, enduserTasksSlice, 
    { 
      loadQuery: session.api.enduser_tasks.getSome,
      findOne: session.api.enduser_tasks.getOne,
      findByIds: session.api.enduser_tasks.getByIds,
      addOne: session.api.enduser_tasks.createOne,
      addSome: session.api.enduser_tasks.createSome,
      deleteOne: session.api.enduser_tasks.deleteOne,
      updateOne: session.api.enduser_tasks.updateOne,
    }, 
    {...options}
  )
}

export const useCalendarEventTemplates = (options={} as HookOptions<CalendarEventTemplate>) => {
  const session = useResolvedSession()
  return useListStateHook(
    'calendar_event_templates', useTypedSelector(s => s.calendar_event_templates), session, calendarEventTemplatesSlice, 
    { 
      loadQuery: session.api.calendar_event_templates.getSome,
      findOne: session.api.calendar_event_templates.getOne,
      findByIds: session.api.calendar_event_templates.getByIds,
      addOne: session.api.calendar_event_templates.createOne,
      addSome: session.api.calendar_event_templates.createSome,
      deleteOne: session.api.calendar_event_templates.deleteOne,
      updateOne: session.api.calendar_event_templates.updateOne,
    }, 
    {...options}
  )
}
export const useAppointmentBookingPages = (options={} as HookOptions<AppointmentBookingPage>) => {
  const session = useResolvedSession() // enduser should be able to load for self-scheduling
  return useListStateHook(
    'appointment_booking_pages', useTypedSelector(s => s.appointment_booking_pages), session, appointmentBookingPagesSlice, 
    { 
      loadQuery: session.api.appointment_booking_pages.getSome,
      findOne: session.api.appointment_booking_pages.getOne,
      findByIds: session.api.appointment_booking_pages.getByIds,
      addOne: session.api.appointment_booking_pages.createOne,
      addSome: session.api.appointment_booking_pages.createSome,
      deleteOne: session.api.appointment_booking_pages.deleteOne,
      updateOne: session.api.appointment_booking_pages.updateOne,
    }, 
    {...options}
  )
}
export const useEnduserViews = (options={} as HookOptions<EnduserView>) => {
  const session = useSession()
  return useListStateHook(
    'enduser_views', useTypedSelector(s => s.enduser_views), session, enduserViewsSlice, 
    { 
      loadQuery: session.api.enduser_views.getSome,
      findOne: session.api.enduser_views.getOne,
      findByIds: session.api.enduser_views.getByIds,
      addOne: session.api.enduser_views.createOne,
      addSome: session.api.enduser_views.createSome,
      deleteOne: session.api.enduser_views.deleteOne,
      updateOne: session.api.enduser_views.updateOne,
    }, 
    {...options}
  )
}
export const useBackgroundErrors = (options={} as HookOptions<BackgroundError>) => {
  const session = useSession()
  return useListStateHook(
    'background_errors', useTypedSelector(s => s.background_errors), session, backgroundErrorsSlice, 
    { 
      loadQuery: session.api.background_errors.getSome,
      findOne: session.api.background_errors.getOne,
      findByIds: session.api.background_errors.getByIds,
      addOne: session.api.background_errors.createOne,
      addSome: session.api.background_errors.createSome,
      deleteOne: session.api.background_errors.deleteOne,
      updateOne: session.api.background_errors.updateOne,
    }, 
    {...options}
  )
}
export const useAppointmentLocations = (options={} as HookOptions<AppointmentLocation>) => {
  const session = useResolvedSession()
  return useListStateHook(
    'appointment_locations', useTypedSelector(s => s.appointment_locations), session, appointmentLocationsSlice, 
    { 
      loadQuery: session.api.appointment_locations.getSome,
      findOne: session.api.appointment_locations.getOne,
      findByIds: session.api.appointment_locations.getByIds,
      addOne: session.api.appointment_locations.createOne,
      addSome: session.api.appointment_locations.createSome,
      deleteOne: session.api.appointment_locations.deleteOne,
      updateOne: session.api.appointment_locations.updateOne,
    }, 
    {...options}
  )
}

export const useDatabases = (options={} as HookOptions<Database>) => {
  const session = useSession()
  return useListStateHook(
    'databases', useTypedSelector(s => s.databases), session, databasesSlice, 
    { 
      loadQuery: session.api.databases.getSome,
      findOne: session.api.databases.getOne,
      findByIds: session.api.databases.getByIds,
      addOne: session.api.databases.createOne,
      addSome: session.api.databases.createSome,
      deleteOne: session.api.databases.deleteOne,
      updateOne: session.api.databases.updateOne,
    }, 
    {...options}
  )
}
export const useDatabaseRecords = (options={} as HookOptions<DatabaseRecord>) => {
  const session = useSession()
  return useListStateHook(
    'database_records', useTypedSelector(s => s.database_records), session, databaseRecordsSlice, 
    { 
      loadQuery: (
        options.loadFilter?.databaseId 
          ? session.api.database_records.getSome 
          : undefined
      ),
      findOne: session.api.database_records.getOne,
      findByIds: session.api.database_records.getByIds,
      addOne: session.api.database_records.createOne,
      addSome: session.api.database_records.createSome,
      deleteOne: session.api.database_records.deleteOne,
      updateOne: session.api.database_records.updateOne,
    }, 
    {...options}
  )
}

export const useProducts = (options={} as HookOptions<Product>) => {
  const session = useResolvedSession()

  return useListStateHook('products', useTypedSelector(s => s.products), session, productsSlice,
    { 
      loadQuery: session.api.products.getSome,
      findOne: session.api.products.getOne,
      findByIds: session.api.products.getByIds,
      addOne: session.api.products.createOne,
      addSome: session.api.products.createSome,
      deleteOne: session.api.products.deleteOne,
      updateOne: session.api.products.updateOne,
    },
    { 
      ...options,
    },
  )
}
export const usePurchases = (options={} as HookOptions<Purchase>) => {
  const session = useResolvedSession()

  return useListStateHook('purchases', useTypedSelector(s => s.purchases), session, purchasesSlice,
    { 
      loadQuery: session.api.purchases.getSome,
      findOne: session.api.purchases.getOne,
      findByIds: session.api.purchases.getByIds,
      addOne: session.api.purchases.createOne,
      addSome: session.api.purchases.createSome,
      deleteOne: session.api.purchases.deleteOne,
      updateOne: session.api.purchases.updateOne,
    },
    { 
      ...options,
    },
  )
}
export const usePurchaseCredits = (options={} as HookOptions<PurchaseCredit>) => {
  const session = useResolvedSession()

  return useListStateHook('purchase_credits', useTypedSelector(s => s.purchase_credits), session, purchaseCreditsSlice,
    { 
      loadQuery: session.api.purchase_credits.getSome,
      findOne: session.api.purchase_credits.getOne,
      findByIds: session.api.purchase_credits.getByIds,
      addOne: session.api.purchase_credits.createOne,
      addSome: session.api.purchase_credits.createSome,
      deleteOne: session.api.purchase_credits.deleteOne,
      updateOne: session.api.purchase_credits.updateOne,
    },
    { 
      ...options,
    },
  )
}

export const useBlockedPhones = (options={} as HookOptions<BlockedPhone>) => {
  const session = useSession()

  return useListStateHook('blocked_phones', useTypedSelector(s => s.blocked_phones), session, blockedPhonesSlice,
    { 
      loadQuery: session.api.blocked_phones.getSome,
      findOne: session.api.blocked_phones.getOne,
      findByIds: session.api.blocked_phones.getByIds,
      addOne: session.api.blocked_phones.createOne,
      addSome: session.api.blocked_phones.createSome,
      deleteOne: session.api.blocked_phones.deleteOne,
      updateOne: session.api.blocked_phones.updateOne,
    },
    {
      ...options,
    }
  )
}

export const usePrescriptionRoutes = (options={} as HookOptions<PrescriptionRoute>) => {
  const session = useSession()

  return useListStateHook('prescription_routes', useTypedSelector(s => s.prescription_routes), session, prescriptionRoutesSlice,
    { 
      loadQuery: session.api.prescription_routes.getSome,
      findOne: session.api.prescription_routes.getOne,
      findByIds: session.api.prescription_routes.getByIds,
      addOne: session.api.prescription_routes.createOne,
      addSome: session.api.prescription_routes.createSome,
      deleteOne: session.api.prescription_routes.deleteOne,
      updateOne: session.api.prescription_routes.updateOne,
    },
    {
      ...options,
    }
  )
}

// gapi reference
// export const useIntegratedCalendarEvents = (options={} as HookOptions<GCalEvent>) => {
//   const session = useSession()
//   const [integrationsLoading] = useIntegrations()

//   const loadedRef = useRef<Indexable<number>>({ })
//   const [authenticated, setAuthenticated] = useState(false)

//   const googleIntegration = (
//     value_is_loaded(integrationsLoading)
//       ? integrationsLoading.value.find(v => v.title === GOOGLE_INTEGRATIONS_TITLE)
//       : undefined
//   )

//   useEffect(() => {
//     const gapi = (window as any).gapi    
//     if (!(googleIntegration && gapi)) return

//     gapi.client.init({
//       apiKey: getGoogleClientAPIKey(), 
//       discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'], 
//     })
//     .then(() => {
//       if (googleIntegration.authentication.info.expiry_date > Date.now()) {
//         gapi.client.setToken(googleIntegration.authentication.info)
//         setAuthenticated(true)
//       }
//       else {
//         session.api.integrations.refresh_oauth2_session({ title: GOOGLE_INTEGRATIONS_TITLE })
//         .then(r => {
//           gapi.client.setToken(r)
//           setAuthenticated(true)
//         })
//         .catch(console.error)
//       }
//     })
//   }, [googleIntegration])

//   const [gcalEventsLoading, { addLocalElements }] = useListStateHook(
//     'gcal', useTypedSelector(s => s.gcal_events), session, externalEventsSlice, 
//     { }, 
//     {...options}
//   )

//   const loadEvents = useCallback((options?: {
//     start?: Date,
//     limit?: number,
//   }) => {
//     const gapi = (window as any).gapi    
//     if (!(gapi && authenticated)) return
    
//     const key = JSON.stringify(options ?? {})
//     if (loadedRef.current[key]) return
//     loadedRef.current[key] = Date.now()

//     gapi.client.calendar.events.list({
//       'calendarId': 'primary',
//       'timeMin': (options?.start ?? new Date()).toISOString(),
//       'showDeleted': false,
//       'singleEvents': true,
//       'maxResults': options?.limit || 50,
//       'orderBy': 'startTime',
//     })
//     .then((r: any) => {
//       if (!r?.result?.items) return

//       addLocalElements(r.result.items)
//     })
//     .catch(console.error)
//   }, [authenticated, addLocalElements])

//   return [gcalEventsLoading, { authenticated, loadEvents }] as const
// }

// includes internal and integrated events
interface LoadEventOptions {
  userId?: string,
  userIds?: string[],
  from?: Date,
  limit?: number
}
export const useCalendarEventsForUser = (options={} as HookOptions<CalendarEvent> & LoadEventOptions) => {
  const session = useSession()
  const loadedRef = useRef<Indexable<number>>({ })

  const fetchEvents = React.useCallback(async (calledOptions?: LoadEventOptions) => {
    return (await 
      session.api.calendar_events.get_events_for_user({
        userId: calledOptions?.userId ?? options?.userId ?? session.userInfo.id,
        userIds: calledOptions?.userIds,
        limit: calledOptions?.limit ?? options?.limit,
        from: calledOptions?.from ?? options?.from ?? new Date(),
      })
    ).events.filter((e: any) => e.title !== '[Tellescope Event Placeholder]')
  }, [options, session])

  const [eventsLoading, { addLocalElements, filtered }] = useCalendarEvents()

  const loadEvents = useCallback((options?: LoadEventOptions) => {
    const key = JSON.stringify(options ?? {})
    if (loadedRef.current[key]) return
    loadedRef.current[key] = Date.now()

    fetchEvents(options)
    .then(es => addLocalElements(es, { replaceIfMatch: true }))
    .catch(console.error)
  }, [session, loadedRef, fetchEvents, addLocalElements])

  return [eventsLoading, { loadEvents, filtered }] as const
}

export const useWaitlists = (options={} as HookOptions<Waitlist>) => {
  const session = useSession()

  return useListStateHook('waitlists', useTypedSelector(s => s.waitlists), session, waitlistsSlice,
    { 
      loadQuery: session.api.waitlists.getSome,
      findOne: session.api.waitlists.getOne,
      findByIds: session.api.waitlists.getByIds,
      addOne: session.api.waitlists.createOne,
      addSome: session.api.waitlists.createSome,
      deleteOne: session.api.waitlists.deleteOne,
      updateOne: session.api.waitlists.updateOne,
    },
    { 
      ...options,
    },
  )
}