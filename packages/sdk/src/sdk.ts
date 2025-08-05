import {
  CustomActions,
  schema,
  extractFields,
  PublicActions,
} from "@tellescope/schema"

import {
  UserSession,
  ReadFilter,
  WebhookSubscriptionsType,
  Attendee,
  SearchOptions,
  AccessPermissions,
  OrganizationLimits,
  SortBy,
  AnalyticsQuery,
  UserUIRestrictions,
  ModelName,
  CustomDashboardView,
  DataSyncRecord,
} from "@tellescope/types-models"

import {
  ClientModelForName,
  ClientModelForName_readonly,
  ClientModelForName_required,
  ClientModelForName_updatesDisabled,
  ChatRoom,
  Enduser,
  Meeting,
  CreateFields,
  User,
} from "@tellescope/types-client"
import { CustomUpdateOptions, SortOption, UserIdentity, FileDetails, ReactNativeFile, SessionType } from "@tellescope/types-utilities"
import { url_safe_path } from "@tellescope/utilities"

import { Session as SessionManager, SessionOptions } from "./session"

export * from "./public"
export * from "./enduser"

export const load_all_pages = async <T extends { id: string }>(load: LoadFunction<T>, o?: LoadFunctionArguments<T> & { maxPages?: number }, ) => {
  const toReturn = [] as T[]
  const maxPages = o?.maxPages ?? 100000

  let i = 0
  while (true) {
    if (i++ > maxPages) break;

    const loaded = await load({ 
      ...o,
      limit: 1000, 
      lastId: toReturn[toReturn.length - 1]?.id,
    })

    toReturn.push(...loaded)

    if (loaded.length < 1000) break; 
  }

  return toReturn
}

export interface LoadFunctionArguments <T> {
  lastId?: string, 
  limit?: number, 
  sort?: SortOption, 
  sortBy?: SortBy,
  from?: Date | number,
  to?: Date,
  fromToField?: string,
  fromUpdated?: Date,
  toUpdated?: Date,
  threadKey?: string, 
  filter?: ReadFilter<T>,
  analyticsQuery?: AnalyticsQuery,
  search?: SearchOptions,
  ids?: string[],
  returnCount?: boolean,
  mdbFilter?: any,
}

export type LoadFunction<T> = (o?: LoadFunctionArguments<T>) => Promise<T[]>

export interface APIQuery<
  N extends keyof ClientModelForName, 
  T=ClientModelForName[N], 
  CREATE=CreateFields<N>, 
  UPDATE=Omit<Partial<T>, keyof (ClientModelForName_readonly[N] & ClientModelForName_updatesDisabled[N])> & { organizationIds?: string[], sharedWithOrganizations?: string[][] },
> 
{
  createOne: (t: CREATE & { sharedWithOrganizations?: string[][], _overrideUnique?: boolean }) => Promise<T>;
  createSome: (ts: CREATE[], o?: { _overrideUnique?: boolean }) => Promise<{ created: T[], errors: object[] }>;
  getOne: (argument: string | ReadFilter<T>, mdbFilter?: any) => Promise<T>;
  getSome: LoadFunction<T>;
  getByIds: ({ ids } : { ids: string[] }) => Promise<{ matches: T[] }>;
  updateOne: (id: string, updates: UPDATE, options?: CustomUpdateOptions, _overrideUnique?: boolean) => Promise<T>;
  deleteOne: (id: string) => Promise<void>;
}

export const reload_record = async <N extends keyof ClientModelForName> (
  r: ClientModelForName[N], 
  reload: APIQuery<N>['getOne'],
  onLoad: (loaded: ClientModelForName[N]) => void
) => {
  try {
    const loaded = await reload(r.id)
    onLoad(loaded)
    return loaded
  } catch(err) {
    return r // just return the existing record and fail gracefully
  }
}

export const defaultQueries = <N extends keyof ClientModelForName>(
  s: Session, n: keyof ClientModelForName_required
): APIQuery<N> => {

  const safeName = url_safe_path(n)
  const singularName = (safeName).substring(0, safeName.length - 1)

  return {
    createOne: o => s._POST(`/v1/${singularName}`, o),
    createSome: (os, o) => s._POST(`/v1/${safeName}`, { create: os, ...o }),
    getOne: (argument, mdbFilter) => (
      (typeof argument === 'string' && argument !== '')
        ? s._GET(`/v1/${singularName}/${argument}`)
        : s._GET(`/v1/${singularName}`, { filter: argument, mdbFilter })
    ),
    getSome: (o) => s._GET(`/v1/${safeName}`, o),
    getByIds: (o) => s._POST(`/v1/${safeName}/bulk-read`, o),
    updateOne: (id, updates, options, _overrideUnique) => s._PATCH(`/v1/${singularName}/${id}`, { updates, options, _overrideUnique }),
    deleteOne: id => s._DELETE(`/v1/${singularName}/${id}`),
  }
}

const loadDefaultQueries = (s: Session): { [K in keyof ClientModelForName] : APIQuery<K> } => ({
  agent_records: defaultQueries(s, 'agent_records'),
  form_groups: defaultQueries(s, 'form_groups'),
  automation_triggers: defaultQueries(s, 'automation_triggers'),
  availability_blocks: defaultQueries(s, 'availability_blocks'),
  analytics_frames: defaultQueries(s, 'analytics_frames'),
  appointment_booking_pages: defaultQueries(s, 'appointment_booking_pages'),
  appointment_locations: defaultQueries(s, 'appointment_locations'),
  portal_customizations: defaultQueries(s, 'portal_customizations'),
  endusers: defaultQueries(s, 'endusers'),
  enduser_status_updates: defaultQueries(s, 'enduser_status_updates'),
  engagement_events: defaultQueries(s, 'engagement_events'),
  journeys: defaultQueries(s, 'journeys'),
  api_keys: defaultQueries(s, 'api_keys'),
  emails: defaultQueries(s, 'emails'),
  sms_messages: defaultQueries(s, 'sms_messages'),
  chat_rooms: defaultQueries(s, 'chat_rooms'),
  chats: defaultQueries(s, 'chats'),
  users: defaultQueries(s, 'users'),
  templates: defaultQueries(s, 'templates'),
  files: defaultQueries(s, 'files'),
  tickets: defaultQueries(s, 'tickets'),
  meetings: defaultQueries(s, 'meetings'),
  notes: defaultQueries(s, 'notes'),
  forms: defaultQueries(s, 'forms'),
  form_fields: defaultQueries(s, 'form_fields'),
  form_responses: defaultQueries(s, 'form_responses'),
  calendar_events: defaultQueries(s, 'calendar_events'),
  calendar_event_templates: defaultQueries(s, 'calendar_event_templates'),
  calendar_event_RSVPs: defaultQueries(s, 'calendar_event_RSVPs'),
  automation_steps: defaultQueries(s, 'automation_steps'),
  automated_actions: defaultQueries(s, 'automated_actions'),
  webhooks: defaultQueries(s, 'webhooks'),
  user_logs: defaultQueries(s, 'user_logs'),
  user_notifications: defaultQueries(s, 'user_notifications'),
  enduser_observations: defaultQueries(s, 'enduser_observations'),
  forum_posts: defaultQueries(s, 'forum_posts'),
  forums: defaultQueries(s, 'forums'),
  managed_content_records: defaultQueries(s, 'managed_content_records'),
  managed_content_record_assignments: defaultQueries(s, 'managed_content_record_assignments'),
  post_comments: defaultQueries(s, 'post_comments'),
  post_likes: defaultQueries(s, 'post_likes'),
  comment_likes: defaultQueries(s, 'comment_likes'),
  organizations: defaultQueries(s, 'organizations'),
  integrations: defaultQueries(s, 'integrations'),
  databases: defaultQueries(s, 'databases'),
  database_records: defaultQueries(s, 'database_records'),
  care_plans: defaultQueries(s, 'care_plans'),
  enduser_tasks: defaultQueries(s, 'enduser_tasks'),
  role_based_access_permissions: defaultQueries(s, 'role_based_access_permissions'),
  products: defaultQueries(s, 'products'),
  purchase_credits: defaultQueries(s, 'purchase_credits'),
  purchases: defaultQueries(s, 'purchases'),
  phone_calls: defaultQueries(s, 'phone_calls'),
  background_errors: defaultQueries(s, 'background_errors'),
  enduser_views: defaultQueries(s, 'enduser_views'),
  superbill_providers: defaultQueries(s, 'superbill_providers'),
  superbills: defaultQueries(s, 'superbills'), 
  enduser_profile_views: defaultQueries(s, 'enduser_profile_views'), 
  enduser_medications: defaultQueries(s, 'enduser_medications'), 
  phone_trees: defaultQueries(s, 'phone_trees'), 
  enduser_custom_types: defaultQueries(s, 'enduser_custom_types'), 
  table_views: defaultQueries(s, 'table_views'), 
  email_sync_denials: defaultQueries(s, 'email_sync_denials'), 
  ticket_threads: defaultQueries(s, 'ticket_threads'), 
  ticket_thread_comments: defaultQueries(s, 'ticket_thread_comments'), 
  configurations: defaultQueries(s, 'configurations'), 
  ticket_queues: defaultQueries(s, 'ticket_queues'), 
  group_mms_conversations: defaultQueries(s, 'group_mms_conversations'), 
  enduser_orders: defaultQueries(s, 'enduser_orders'), 
  enduser_encounters: defaultQueries(s, 'enduser_encounters'), 
  vital_configurations: defaultQueries(s, 'vital_configurations'), 
  blocked_phones: defaultQueries(s, 'blocked_phones'),
  prescription_routes: defaultQueries(s, 'prescription_routes'),
  enduser_problems: defaultQueries(s, 'enduser_problems'),
  flowchart_notes: defaultQueries(s, 'flowchart_notes'),
  webhook_logs: defaultQueries(s, 'webhook_logs'),
  portal_brandings: defaultQueries(s, 'portal_brandings'),
  message_template_snippets: defaultQueries(s, 'message_template_snippets'),
  fax_logs: defaultQueries(s, 'fax_logs'),
  call_hold_queues: defaultQueries(s, 'call_hold_queues'),
  suggested_contacts: defaultQueries(s, 'suggested_contacts'),
  diagnosis_codes: defaultQueries(s, 'diagnosis_codes'),
  allergy_codes: defaultQueries(s, 'allergy_codes'),
  integration_logs: defaultQueries(s, 'integration_logs'),
  enduser_eligibility_results: defaultQueries(s, 'enduser_eligibility_results'),
  waitlists: defaultQueries(s, 'waitlists'),
  ai_conversations: defaultQueries(s, 'ai_conversations'),
})

type Queries = { [K in keyof ClientModelForName]: APIQuery<K> } & {
  availability_blocks: {
    update_order: (args: extractFields<CustomActions['availability_blocks']['update_order']['parameters']>) => (
      Promise<extractFields<CustomActions['availability_blocks']['update_order']['returns']>>
    ),
    handle_autoreply: (args: extractFields<CustomActions['availability_blocks']['handle_autoreply']['parameters']>) => (
      Promise<extractFields<CustomActions['availability_blocks']['handle_autoreply']['returns']>>
    ),
  },
  journeys: {
    delete_states: (args: extractFields<CustomActions['journeys']['delete_states']['parameters']>) => 
                          Promise<extractFields<CustomActions['journeys']['delete_states']['returns']>>,
    handle_incoming_communication: (args: extractFields<CustomActions['journeys']['handle_incoming_communication']['parameters']>) => (
      Promise<extractFields<CustomActions['journeys']['handle_incoming_communication']['returns']>>
    ),
    get_journey_statistics: (args: extractFields<CustomActions['journeys']['get_journey_statistics']['parameters']>) => (
      Promise<extractFields<CustomActions['journeys']['get_journey_statistics']['returns']>>
    ),
  },
  enduser_orders: {
    get_available_tests: (args: extractFields<CustomActions['enduser_orders']['get_available_tests']['parameters']>) => (
      Promise<extractFields<CustomActions['enduser_orders']['get_available_tests']['returns']>>
    ),
    create_lab_order: (args: extractFields<CustomActions['enduser_orders']['create_lab_order']['parameters']>) => (
      Promise<extractFields<CustomActions['enduser_orders']['create_lab_order']['returns']>>
    ),
    cancel_order: (args: extractFields<CustomActions['enduser_orders']['cancel_order']['parameters']>) => (
      Promise<extractFields<CustomActions['enduser_orders']['cancel_order']['returns']>>
    ),
    create_go_go_meds_order: (args: extractFields<CustomActions['enduser_orders']['create_go_go_meds_order']['parameters']>) => (
      Promise<extractFields<CustomActions['enduser_orders']['create_go_go_meds_order']['returns']>>
    ),
    create_smart_meter_order: (args: extractFields<CustomActions['enduser_orders']['create_smart_meter_order']['parameters']>) => (
      Promise<extractFields<CustomActions['enduser_orders']['create_smart_meter_order']['returns']>>
    ),
  },
  enduser_encounters: {
    create_candid_encounter: (args: extractFields<CustomActions['enduser_encounters']['create_candid_encounter']['parameters']>) => (
      Promise<extractFields<CustomActions['enduser_encounters']['create_candid_encounter']['returns']>>
    ),
  },
  purchases: {
    charge_card_on_file: (args: extractFields<CustomActions['purchases']['charge_card_on_file']['parameters']>) => (
      Promise<extractFields<CustomActions['purchases']['charge_card_on_file']['returns']>>
    ),
  },
  forms: {
    get_form_statistics: (args: extractFields<CustomActions['forms']['get_form_statistics']['parameters']>) => (
      Promise<extractFields<CustomActions['forms']['get_form_statistics']['returns']>>
    ),
  },
  phone_trees: {
    start_outbound_call: (args: extractFields<CustomActions['phone_trees']['start_outbound_call']['parameters']>) => (
      Promise<extractFields<CustomActions['phone_trees']['start_outbound_call']['returns']>>
    ),
  },
  call_hold_queues: {
    answer_call: (args: extractFields<CustomActions['call_hold_queues']['answer_call']['parameters']>) => (
      Promise<extractFields<CustomActions['call_hold_queues']['answer_call']['returns']>>
    ),
    get_details: (args: extractFields<CustomActions['call_hold_queues']['get_details']['parameters']>) => (
      Promise<extractFields<CustomActions['call_hold_queues']['get_details']['returns']>>
    ),
  },
  enduser_observations: {
    load: (args: extractFields<CustomActions['enduser_observations']['load']['parameters']>) => (
      Promise<extractFields<CustomActions['enduser_observations']['load']['returns']>>
    ),
    acknowledge: (args: extractFields<CustomActions['enduser_observations']['acknowledge']['parameters']>) => (
      Promise<extractFields<CustomActions['enduser_observations']['acknowledge']['returns']>>
    ),
  },
  endusers: {
    customer_io_sync: (args: extractFields<CustomActions['endusers']['customer_io_sync']['parameters']>) => (
      Promise<extractFields<CustomActions['endusers']['customer_io_sync']['returns']>>
    ),
    rename_stored_custom_fields: (args: extractFields<CustomActions['endusers']['rename_stored_custom_fields']['parameters']>) => (
      Promise<extractFields<CustomActions['endusers']['rename_stored_custom_fields']['returns']>>
    ),
    add_to_healthie_course: (args: extractFields<CustomActions['endusers']['add_to_healthie_course']['parameters']>) => (
      Promise<extractFields<CustomActions['endusers']['add_to_healthie_course']['returns']>>
    ),
    dosespot: (args: extractFields<CustomActions['endusers']['dosespot']['parameters']>) => (
      Promise<extractFields<CustomActions['endusers']['dosespot']['returns']>>
    ),
    check_eligibility: (args: extractFields<CustomActions['endusers']['check_eligibility']['parameters']>) => (
      Promise<extractFields<CustomActions['endusers']['check_eligibility']['returns']>>
    ),
    set_password: (args: { id: string, password: string }) => Promise<void>,
    is_authenticated: (args: { id?: string, authToken: string }) => Promise<{ isAuthenticated: boolean, enduser: Enduser }>
    generate_auth_token: (args: extractFields<CustomActions['endusers']['generate_auth_token']['parameters']>) => (
      Promise<extractFields<CustomActions['endusers']['generate_auth_token']['returns']>>
    ),
    add_to_journey: (args: extractFields<CustomActions['endusers']['add_to_journey']['parameters']>) => (
      Promise<extractFields<CustomActions['endusers']['add_to_journey']['returns']>>
    ),
    remove_from_journey: (args: extractFields<CustomActions['endusers']['remove_from_journey']['parameters']>) => (
      Promise<extractFields<CustomActions['endusers']['remove_from_journey']['returns']>>
    ),
    merge: (args: extractFields<CustomActions['endusers']['merge']['parameters']>) => (
      Promise<extractFields<CustomActions['endusers']['merge']['returns']>>
    ),
    push: (args: extractFields<CustomActions['endusers']['push']['parameters']>) => (
      Promise<extractFields<CustomActions['endusers']['push']['returns']>>
    ),
    bulk_update: (args: extractFields<CustomActions['endusers']['bulk_update']['parameters']>) => (
      Promise<extractFields<CustomActions['endusers']['bulk_update']['returns']>>
    ),
    bulk_assignment: (args: extractFields<CustomActions['endusers']['bulk_assignment']['parameters']>) => (
      Promise<extractFields<CustomActions['endusers']['bulk_assignment']['returns']>>
    ),
    related_contacts_report: (args: extractFields<CustomActions['endusers']['related_contacts_report']['parameters']>) => (
      Promise<extractFields<CustomActions['endusers']['related_contacts_report']['returns']>>
    ),
    get_report: (args: extractFields<CustomActions['endusers']['get_report']['parameters']>) => (
      Promise<extractFields<CustomActions['endusers']['get_report']['returns']>>
    ),
    get_engagement_statistics: (args: extractFields<CustomActions['endusers']['get_engagement_statistics']['parameters']>) => (
      Promise<extractFields<CustomActions['endusers']['get_engagement_statistics']['returns']>>
    ),
    get_engagement_statistics_by_userId: (args: extractFields<CustomActions['endusers']['get_engagement_statistics_by_userId']['parameters']>) => (
      Promise<extractFields<CustomActions['endusers']['get_engagement_statistics_by_userId']['returns']>>
    ),
    sync_zendesk: (args: extractFields<CustomActions['endusers']['sync_zendesk']['parameters']>) => (
      Promise<extractFields<CustomActions['endusers']['sync_zendesk']['returns']>>
    ),
    get_journeys_report: (args: extractFields<CustomActions['endusers']['get_journeys_report']['parameters']>) => (
      Promise<extractFields<CustomActions['endusers']['get_journeys_report']['returns']>>
    ),
    load_inbox_data: (args: extractFields<CustomActions['endusers']['load_inbox_data']['parameters']>) => (
      Promise<extractFields<CustomActions['endusers']['load_inbox_data']['returns']>>
    ),
  },
  users: {
    begin_sso: (args: extractFields<PublicActions['users']['begin_sso']['parameters']>) => (
      Promise<extractFields<PublicActions['users']['begin_sso']['returns']>>
    ),
    complete_sso: (args: extractFields<PublicActions['users']['complete_sso']['parameters']>) => (
      Promise<extractFields<PublicActions['users']['complete_sso']['returns']>>
    ),
    display_names: () => Promise<{ fname: string, lname: string, id: string }[]>,
    submit_email_verification: (args: extractFields<PublicActions['users']['submit_email_verification']['parameters']>) => (
      Promise<extractFields<PublicActions['users']['submit_email_verification']['returns']>>
    ),
    register: (args: extractFields<PublicActions['users']['register']['parameters']>) => (
      Promise<extractFields<PublicActions['users']['register']['returns']>>
    ),
    login: (args: extractFields<PublicActions['users']['login']['parameters']>) => (
      Promise<extractFields<PublicActions['users']['login']['returns']>>
    ),
    login_with_google: (args: extractFields<PublicActions['users']['login_with_google']['parameters']>) => (
      Promise<extractFields<PublicActions['users']['login_with_google']['returns']>>
    ),
    request_password_reset: (args: extractFields<PublicActions['users']['request_password_reset']['parameters']>) => 
                          Promise<extractFields<PublicActions['users']['request_password_reset']['returns']>>,
    reset_password: (args: extractFields<PublicActions['users']['reset_password']['parameters']>) => 
                          Promise<extractFields<PublicActions['users']['reset_password']['returns']>>,
    generate_auth_token: (args?: extractFields<CustomActions['users']['generate_auth_token']['parameters']>) => (
      Promise<extractFields<CustomActions['users']['generate_auth_token']['returns']>>
    ),
    send_invitation_to_existing: (args: extractFields<CustomActions['users']['send_invitation_to_existing']['parameters']>) => (
        Promise<extractFields<CustomActions['users']['send_invitation_to_existing']['returns']>>
    ),
    invite_user: (args: extractFields<CustomActions['users']['invite_user']['parameters']>) => (
      Promise<extractFields<CustomActions['users']['invite_user']['returns']>>
    ),
    configure_inbox: (args: extractFields<CustomActions['users']['configure_inbox']['parameters']>) => (
      Promise<extractFields<CustomActions['users']['configure_inbox']['returns']>>
    ),
    consent: (args: extractFields<CustomActions['users']['consent']['parameters']>) => (
      Promise<extractFields<CustomActions['users']['consent']['returns']>>
    ),
    configure_MFA: (args: extractFields<CustomActions['users']['configure_MFA']['parameters']>) => (
      Promise<extractFields<CustomActions['users']['configure_MFA']['returns']>>
    ),
    generate_MFA_challenge: (args: extractFields<CustomActions['users']['generate_MFA_challenge']['parameters']>) => (
      Promise<extractFields<CustomActions['users']['generate_MFA_challenge']['returns']>>
    ),
    submit_MFA_challenge: (args: extractFields<CustomActions['users']['submit_MFA_challenge']['parameters']>) => (
      Promise<extractFields<CustomActions['users']['submit_MFA_challenge']['returns']>>
    ),
    get_engagement_report: (args: extractFields<CustomActions['users']['get_engagement_report']['parameters']>) => (
      Promise<extractFields<CustomActions['users']['get_engagement_report']['returns']>>
    ),
    get_users_for_groups: (args: extractFields<CustomActions['users']['get_users_for_groups']['parameters']>) => (
      Promise<extractFields<CustomActions['users']['get_users_for_groups']['returns']>>
    ),
    play_phone_message: (args: extractFields<CustomActions['users']['play_phone_message']['parameters']>) => (
      Promise<extractFields<CustomActions['users']['play_phone_message']['returns']>>
    ),
  },
  files: {
    prepare_file_upload: (args: extractFields<CustomActions['files']['prepare_file_upload']['parameters']>) => (
      Promise<extractFields<CustomActions['files']['prepare_file_upload']['returns']>>
    ),
    confirm_file_upload: (args: extractFields<CustomActions['files']['confirm_file_upload']['parameters']>) => (
      Promise<extractFields<CustomActions['files']['confirm_file_upload']['returns']>>
    ),
    send_fax: (args: extractFields<CustomActions['files']['send_fax']['parameters']>) => (
      Promise<extractFields<CustomActions['files']['send_fax']['returns']>>
    ),
    file_download_URL: (args: extractFields<CustomActions['files']['file_download_URL']['parameters']>) => (
      Promise<extractFields<CustomActions['files']['file_download_URL']['returns']>>
    ),
    run_ocr: (args: extractFields<CustomActions['files']['run_ocr']['parameters']>) => (
      Promise<extractFields<CustomActions['files']['run_ocr']['returns']>>
    ),
    push: (args: extractFields<CustomActions['files']['push']['parameters']>) => (
      Promise<extractFields<CustomActions['files']['push']['returns']>>
    ),
  },
  form_fields: {
    load_choices_from_database: (args: extractFields<CustomActions['form_fields']['load_choices_from_database']['parameters']>) => (
      Promise<extractFields<CustomActions['form_fields']['load_choices_from_database']['returns']>>
    ),
    booking_info: (args: extractFields<CustomActions['form_fields']['booking_info']['parameters']>) => (
      Promise<extractFields<CustomActions['form_fields']['booking_info']['returns']>>
    ),
  },
  form_responses: {
    submit_form_response: (args: extractFields<CustomActions['form_responses']['submit_form_response']['parameters']>) => (
      Promise<extractFields<CustomActions['form_responses']['submit_form_response']['returns']>>
    ),
    save_field_response: (args: extractFields<CustomActions['form_responses']['save_field_response']['parameters']>) => (
      Promise<extractFields<CustomActions['form_responses']['save_field_response']['returns']>>
    ),
    prepare_form_response: (args: extractFields<CustomActions['form_responses']['prepare_form_response']['parameters']>) => (
      Promise<extractFields<CustomActions['form_responses']['prepare_form_response']['returns']>>
    ),
    info_for_access_code: (args: extractFields<CustomActions['form_responses']['info_for_access_code']['parameters']>) => (
      Promise<extractFields<CustomActions['form_responses']['info_for_access_code']['returns']>>
    ),
    stripe_details: (args: extractFields<CustomActions['form_responses']['stripe_details']['parameters']>) => (
      Promise<extractFields<CustomActions['form_responses']['stripe_details']['returns']>>
    ),
    chargebee_details: (args: extractFields<CustomActions['form_responses']['chargebee_details']['parameters']>) => (
      Promise<extractFields<CustomActions['form_responses']['chargebee_details']['returns']>>
    ),
    generate_pdf: (args: extractFields<CustomActions['form_responses']['generate_pdf']['parameters']>) => (
      Promise<extractFields<CustomActions['form_responses']['generate_pdf']['returns']>>
    ),
    push_to_EHR: (args: extractFields<CustomActions['form_responses']['push_to_EHR']['parameters']>) => (
      Promise<extractFields<CustomActions['form_responses']['push_to_EHR']['returns']>>
    ),
    create_canvas_note: (args: extractFields<CustomActions['form_responses']['create_canvas_note']['parameters']>) => (
      Promise<extractFields<CustomActions['form_responses']['create_canvas_note']['returns']>>
    ),
    get_report: (args: extractFields<CustomActions['form_responses']['get_report']['parameters']>) => (
      Promise<extractFields<CustomActions['form_responses']['get_report']['returns']>>
    ),
    get_related_forms_report: (args: extractFields<CustomActions['form_responses']['get_related_forms_report']['parameters']>) => (
      Promise<extractFields<CustomActions['form_responses']['get_related_forms_report']['returns']>>
    ),
    get_report_as_post: (args: extractFields<CustomActions['form_responses']['get_report']['parameters']>) => (
      Promise<extractFields<CustomActions['form_responses']['get_report']['returns']>>
    ),
    get_enduser_statistics: (args: extractFields<CustomActions['form_responses']['get_enduser_statistics']['parameters']>) => (
      Promise<extractFields<CustomActions['form_responses']['get_enduser_statistics']['returns']>>
    ),
    get_enduser_statistics_by_submitter: (args: extractFields<CustomActions['form_responses']['get_enduser_statistics_by_submitter']['parameters']>) => (
      Promise<extractFields<CustomActions['form_responses']['get_enduser_statistics_by_submitter']['returns']>>
    ),
    get_distribution_report: (args: extractFields<CustomActions['form_responses']['get_distribution_report']['parameters']>) => (
      Promise<extractFields<CustomActions['form_responses']['get_distribution_report']['returns']>>
    ),
  },
  meetings: {
    start_meeting: (args?: extractFields<CustomActions['meetings']['start_meeting']['parameters']>) => (
      Promise<extractFields<CustomActions['meetings']['start_meeting']['returns']>>
    ),
    end_meeting: (args: { id: string }) => Promise<void>, 
    add_attendees_to_meeting: (args: { id: string, attendees: UserIdentity[] }) => Promise<void>, 
    my_meetings: () => Promise<Meeting[]>,
    attendee_info: (args: { id: string }) => Promise<{ attendee: Attendee, others: UserIdentity[] }>,
    send_invite: (args: extractFields<CustomActions['meetings']['send_invite']['parameters']>) => (
      Promise<extractFields<CustomActions['meetings']['send_invite']['returns']>>
    ),
    start_meeting_for_event: (args?: extractFields<CustomActions['meetings']['start_meeting_for_event']['parameters']>) => (
      Promise<extractFields<CustomActions['meetings']['start_meeting_for_event']['returns']>>
    ),
    join_meeting_for_event: (args?: extractFields<CustomActions['meetings']['join_meeting_for_event']['parameters']>) => (
      Promise<extractFields<CustomActions['meetings']['join_meeting_for_event']['returns']>>
    ),
  },
  chat_rooms: {
    join_room: (args: { id: string }) => Promise<{ room: ChatRoom }>,
    mark_read: (args: extractFields<CustomActions['chat_rooms']['mark_read']['parameters']>) => (
      Promise<extractFields<CustomActions['chat_rooms']['mark_read']['returns']>>
    ),
    send_healthie_chat: (args: extractFields<CustomActions['chat_rooms']['send_healthie_chat']['parameters']>) => (
      Promise<extractFields<CustomActions['chat_rooms']['send_healthie_chat']['returns']>>
    ),
    display_info: (args: extractFields<CustomActions['chat_rooms']['display_info']['parameters']>) => 
                    Promise<extractFields<CustomActions['chat_rooms']['display_info']['returns']>>,
  },
  webhooks: {
    configure: (args: { url: string, secret: string, subscriptions?: WebhookSubscriptionsType }) => Promise<void>,
    update: (args: { url?: string, secret?: string, subscriptionUpdates?: WebhookSubscriptionsType }) => Promise<void>
    send_automation_webhook: (args: extractFields<CustomActions['webhooks']['send_automation_webhook']['parameters']>) => 
      Promise<extractFields<CustomActions['webhooks']['send_automation_webhook']['returns']>>,
    get_configuration: (args: extractFields<CustomActions['webhooks']['get_configuration']['parameters']>) => 
      Promise<extractFields<CustomActions['webhooks']['get_configuration']['returns']>>,
  },
  user_notifications: {
    send_user_email_notification: (args: extractFields<CustomActions['user_notifications']['send_user_email_notification']['parameters']>) => 
      Promise<extractFields<CustomActions['user_notifications']['send_user_email_notification']['returns']>>,
    bulk_update: ((args: extractFields<CustomActions['user_notifications']['bulk_update']['parameters']>) => 
      Promise<extractFields<CustomActions['user_notifications']['bulk_update']['returns']>>
    ),

  },
  post_likes: {
    create: (args: extractFields<CustomActions['post_likes']['create']['parameters']>) => (
      Promise<extractFields<CustomActions['post_likes']['create']['returns']>>
    ),
    unlike_post: (args: extractFields<CustomActions['post_likes']['unlike_post']['parameters']>) => (
      Promise<extractFields<CustomActions['post_likes']['unlike_post']['returns']>>
    ),
  },
  organizations: {
    load_twilio_embed: (args: extractFields<CustomActions['organizations']['load_twilio_embed']['parameters']>) => (
      Promise<extractFields<CustomActions['organizations']['load_twilio_embed']['returns']>>
    ),
    link_twilio: (args: extractFields<CustomActions['organizations']['link_twilio']['parameters']>) => (
      Promise<extractFields<CustomActions['organizations']['link_twilio']['returns']>>
    ),
    sync_note_to_canvas: (args: extractFields<CustomActions['organizations']['sync_note_to_canvas']['parameters']>) => (
      Promise<extractFields<CustomActions['organizations']['sync_note_to_canvas']['returns']>>
    ),
    add_athena_subscription: (args: extractFields<CustomActions['organizations']['add_athena_subscription']['parameters']>) => (
      Promise<extractFields<CustomActions['organizations']['add_athena_subscription']['returns']>>
    ),
    sync_athena_subscription: (args: extractFields<CustomActions['organizations']['sync_athena_subscription']['parameters']>) => (
      Promise<extractFields<CustomActions['organizations']['sync_athena_subscription']['returns']>>
    ),
    get_theme: (args: extractFields<PublicActions['organizations']['get_theme']['parameters']>) => (
      Promise<extractFields<PublicActions['organizations']['get_theme']['returns']>>
    ),
    create_suborganization: (args: extractFields<CustomActions['organizations']['create_suborganization']['parameters']>) => (
      Promise<extractFields<CustomActions['organizations']['create_suborganization']['returns']>>
    ),
    create_and_join: (args: extractFields<CustomActions['organizations']['create_and_join']['parameters']>) => (
      Promise<extractFields<CustomActions['organizations']['create_and_join']['returns']>>
    ),
    /** @deprecated */ //  keep here as well for backwards compatibility
    invite_user: (args: extractFields<CustomActions['users']['invite_user']['parameters']>) => (
      Promise<extractFields<CustomActions['users']['invite_user']['returns']>>
    ),
  },
  integrations: {
    update_zoom: (args: extractFields<CustomActions['integrations']['update_zoom']['parameters']>) => (
      Promise<extractFields<CustomActions['integrations']['update_zoom']['returns']>>
    ),
    proxy_read: (args: extractFields<CustomActions['integrations']['proxy_read']['parameters']>) => (
      Promise<extractFields<CustomActions['integrations']['proxy_read']['returns']>>
    ),
    proxy_write: (args: extractFields<CustomActions['integrations']['proxy_write']['parameters']>) => (
      Promise<extractFields<CustomActions['integrations']['proxy_write']['returns']>>
    ),
    load_payers: (args: extractFields<CustomActions['integrations']['load_payers']['parameters']>) => (
      Promise<extractFields<CustomActions['integrations']['load_payers']['returns']>>
    ),
    generate_google_auth_url: (args: extractFields<CustomActions['integrations']['generate_google_auth_url']['parameters']>) => (
      Promise<extractFields<CustomActions['integrations']['generate_google_auth_url']['returns']>>
    ),
    disconnect_google_integration: (args: extractFields<CustomActions['integrations']['disconnect_google_integration']['parameters']>) => (
      Promise<extractFields<CustomActions['integrations']['disconnect_google_integration']['returns']>>
    ),
    generate_oauth2_auth_url: (args: extractFields<CustomActions['integrations']['generate_oauth2_auth_url']['parameters']>) => (
      Promise<extractFields<CustomActions['integrations']['generate_oauth2_auth_url']['returns']>>
    ),
    disconnect_oauth2_integration: (args: extractFields<CustomActions['integrations']['disconnect_oauth2_integration']['parameters']>) => (
      Promise<extractFields<CustomActions['integrations']['disconnect_oauth2_integration']['returns']>>
    ),
    refresh_oauth2_session: (args: extractFields<CustomActions['integrations']['refresh_oauth2_session']['parameters']>) => (
      Promise<extractFields<CustomActions['integrations']['refresh_oauth2_session']['returns']>>
    ),
    connect_stripe: (args: extractFields<CustomActions['integrations']['connect_stripe']['parameters']>) => (
      Promise<extractFields<CustomActions['integrations']['connect_stripe']['returns']>>
    ),
    add_api_key_integration: (args: extractFields<CustomActions['integrations']['add_api_key_integration']['parameters']>) => (
      Promise<extractFields<CustomActions['integrations']['add_api_key_integration']['returns']>>
    ),
    remove_api_key_integration: (args: extractFields<CustomActions['integrations']['remove_api_key_integration']['parameters']>) => (
      Promise<extractFields<CustomActions['integrations']['remove_api_key_integration']['returns']>>
    ),
    sync_ehr: (args: extractFields<CustomActions['integrations']['sync_ehr']['parameters']>) => (
      Promise<extractFields<CustomActions['integrations']['sync_ehr']['returns']>>
    ),
    daily_sync: (args: extractFields<CustomActions['integrations']['daily_sync']['parameters']>) => (
      Promise<extractFields<CustomActions['integrations']['daily_sync']['returns']>>
    ),
    connect_photon: (args: extractFields<CustomActions['integrations']['connect_photon']['parameters']>) => (
      Promise<extractFields<CustomActions['integrations']['connect_photon']['returns']>>
    ),
    disconnect_photon: (args: extractFields<CustomActions['integrations']['disconnect_photon']['parameters']>) => (
      Promise<extractFields<CustomActions['integrations']['disconnect_photon']['returns']>>
    ),
    connect_elation: (args: extractFields<CustomActions['integrations']['connect_elation']['parameters']>) => (
      Promise<extractFields<CustomActions['integrations']['connect_elation']['returns']>>
    ),
    disconnect_elation: (args: extractFields<CustomActions['integrations']['disconnect_elation']['parameters']>) => (
      Promise<extractFields<CustomActions['integrations']['disconnect_elation']['returns']>>
    ),
    connect_zendesk: (args: extractFields<CustomActions['integrations']['connect_zendesk']['parameters']>) => (
      Promise<extractFields<CustomActions['integrations']['connect_zendesk']['returns']>>
    ),
    disconnect_zendesk: (args: extractFields<CustomActions['integrations']['disconnect_zendesk']['parameters']>) => (
      Promise<extractFields<CustomActions['integrations']['disconnect_zendesk']['returns']>>
    ),
  },
  phone_calls: {
    authenticate_calling: (args: extractFields<CustomActions['phone_calls']['authenticate_calling']['parameters']>) => (
      Promise<extractFields<CustomActions['phone_calls']['authenticate_calling']['returns']>>
    ),
    get_report: (args: extractFields<CustomActions['phone_calls']['get_report']['parameters']>) => (
      Promise<extractFields<CustomActions['phone_calls']['get_report']['returns']>>
    ),
    upgrade_to_conference: (args: extractFields<CustomActions['phone_calls']['upgrade_to_conference']['parameters']>) => (
      Promise<extractFields<CustomActions['phone_calls']['upgrade_to_conference']['returns']>>
    ),
    add_conference_attendees: (args: extractFields<CustomActions['phone_calls']['add_conference_attendees']['parameters']>) => (
      Promise<extractFields<CustomActions['phone_calls']['add_conference_attendees']['returns']>>
    ),
    remove_conference_attendees: (args: extractFields<CustomActions['phone_calls']['remove_conference_attendees']['parameters']>) => (
      Promise<extractFields<CustomActions['phone_calls']['remove_conference_attendees']['returns']>>
    ),
    end_conference: (args: extractFields<CustomActions['phone_calls']['end_conference']['parameters']>) => (
      Promise<extractFields<CustomActions['phone_calls']['end_conference']['returns']>>
    ),
    cancel_recording: (args: extractFields<CustomActions['phone_calls']['cancel_recording']['parameters']>) => (
      Promise<extractFields<CustomActions['phone_calls']['cancel_recording']['returns']>>
    ),
    delete_recordings: (args: extractFields<CustomActions['phone_calls']['delete_recordings']['parameters']>) => (
      Promise<extractFields<CustomActions['phone_calls']['delete_recordings']['returns']>>
    ),
    get_number_report: (args: extractFields<CustomActions['phone_calls']['get_number_report']['parameters']>) => (
      Promise<extractFields<CustomActions['phone_calls']['get_number_report']['returns']>>
    ),
  },
  sms_messages: {
    send_message_as_user_notification: (args: extractFields<CustomActions['sms_messages']['send_message_as_user_notification']['parameters']>) => (
      Promise<extractFields<CustomActions['sms_messages']['send_message_as_user_notification']['returns']>>
    ),
    send_with_template: (args: extractFields<CustomActions['sms_messages']['send_with_template']['parameters']>) => (
      Promise<extractFields<CustomActions['sms_messages']['send_with_template']['returns']>>
    ),
    send_message_to_number: (args: extractFields<CustomActions['sms_messages']['send_message_to_number']['parameters']>) => (
      Promise<extractFields<CustomActions['sms_messages']['send_message_to_number']['returns']>>
    ),
    get_number_report: (args: extractFields<CustomActions['sms_messages']['get_number_report']['parameters']>) => (
      Promise<extractFields<CustomActions['sms_messages']['get_number_report']['returns']>>
    ),
    get_template_report: (args: extractFields<CustomActions['sms_messages']['get_template_report']['parameters']>) => (
      Promise<extractFields<CustomActions['sms_messages']['get_template_report']['returns']>>
    ),
  },
  templates: {
    get_templated_message: (args: extractFields<CustomActions['templates']['get_templated_message']['parameters']>) => (
      Promise<extractFields<CustomActions['templates']['get_templated_message']['returns']>>
    ),
    get_suggested_reply: (args: extractFields<CustomActions['templates']['get_suggested_reply']['parameters']>) => (
      Promise<extractFields<CustomActions['templates']['get_suggested_reply']['returns']>>
    ),
    create_embedding: (args: extractFields<CustomActions['templates']['create_embedding']['parameters']>) => (
      Promise<extractFields<CustomActions['templates']['create_embedding']['returns']>>
    ),
    embedding_search: (args: extractFields<CustomActions['templates']['embedding_search']['parameters']>) => (
      Promise<extractFields<CustomActions['templates']['embedding_search']['returns']>>
    ),
  },
  analytics_frames: {
    get_result_for_query: (args: extractFields<CustomActions['analytics_frames']['get_result_for_query']['parameters']>) => (
      Promise<extractFields<CustomActions['analytics_frames']['get_result_for_query']['returns']>>
    ),
    get_custom_report: (args: extractFields<CustomActions['analytics_frames']['get_custom_report']['parameters']>) => (
      Promise<extractFields<CustomActions['analytics_frames']['get_custom_report']['returns']>>
    ),
    update_indexes: (args: extractFields<CustomActions['analytics_frames']['update_indexes']['parameters']>) => (
      Promise<extractFields<CustomActions['analytics_frames']['update_indexes']['returns']>>
    ),
  },
  emails: {
    sync_integrations: (args: extractFields<CustomActions['emails']['sync_integrations']['parameters']>) => (
      Promise<extractFields<CustomActions['emails']['sync_integrations']['returns']>>
    ),
    deliver_via_outlook: (args: extractFields<CustomActions['emails']['deliver_via_outlook']['parameters']>) => (
      Promise<extractFields<CustomActions['emails']['deliver_via_outlook']['returns']>>
    ),
    deliver_via_iterable: (args: extractFields<CustomActions['emails']['deliver_via_iterable']['parameters']>) => (
      Promise<extractFields<CustomActions['emails']['deliver_via_iterable']['returns']>>
    ),
    send_with_template: (args: extractFields<CustomActions['emails']['send_with_template']['parameters']>) => (
      Promise<extractFields<CustomActions['emails']['send_with_template']['returns']>>
    ),
    get_template_report: (args: extractFields<CustomActions['emails']['get_template_report']['parameters']>) => (
      Promise<extractFields<CustomActions['emails']['get_template_report']['returns']>>
    ),
  },
  calendar_events: {
    session_for_start_link: (args: extractFields<PublicActions['calendar_events']['session_for_start_link']['parameters']>) => (
      Promise<extractFields<PublicActions['calendar_events']['session_for_start_link']['returns']>>
    ),
    push: (args: extractFields<CustomActions['calendar_events']['push']['parameters']>) => (
      Promise<extractFields<CustomActions['calendar_events']['push']['returns']>>
    ),
    download_ics_file: (args: extractFields<CustomActions['calendar_events']['download_ics_file']['parameters']>) => (
      Promise<extractFields<CustomActions['calendar_events']['download_ics_file']['returns']>>
    ),
    get_events_for_user: (args: extractFields<CustomActions['calendar_events']['get_events_for_user']['parameters']>) => (
      Promise<extractFields<CustomActions['calendar_events']['get_events_for_user']['returns']>>
    ),
    load_events: (args: extractFields<CustomActions['calendar_events']['load_events']['parameters']>) => (
      Promise<extractFields<CustomActions['calendar_events']['load_events']['returns']>>
    ),
    generate_zoom_meeting: (args: extractFields<CustomActions['calendar_events']['generate_zoom_meeting']['parameters']>) => (
      Promise<extractFields<CustomActions['calendar_events']['generate_zoom_meeting']['returns']>>
    ),
    change_zoom_host: (args: extractFields<CustomActions['calendar_events']['change_zoom_host']['parameters']>) => (
      Promise<extractFields<CustomActions['calendar_events']['change_zoom_host']['returns']>>
    ),
    generate_meeting_link: (args: extractFields<CustomActions['calendar_events']['generate_meeting_link']['parameters']>) => (
      Promise<extractFields<CustomActions['calendar_events']['generate_meeting_link']['returns']>>
    ),
    get_report: (args: extractFields<CustomActions['calendar_events']['get_report']['parameters']>) => (
      Promise<extractFields<CustomActions['calendar_events']['get_report']['returns']>>
    ),
    get_enduser_report: (args: extractFields<CustomActions['calendar_events']['get_enduser_report']['parameters']>) => (
      Promise<extractFields<CustomActions['calendar_events']['get_enduser_report']['returns']>>
    ),
    get_status_report: (args: extractFields<CustomActions['calendar_events']['get_status_report']['parameters']>) => (
      Promise<extractFields<CustomActions['calendar_events']['get_status_report']['returns']>>
    ),
    get_appointment_availability: (args: extractFields<CustomActions['calendar_events']['get_appointment_availability']['parameters']>) => (
      Promise<extractFields<CustomActions['calendar_events']['get_appointment_availability']['returns']>>
    ),
  },
  managed_content_records: {
    load_unauthenticated: (args: extractFields<PublicActions['managed_content_records']['load_unauthenticated']['parameters']>) => (
      Promise<extractFields<PublicActions['managed_content_records']['load_unauthenticated']['returns']>>
    ),
    generate_embedding: (args: extractFields<CustomActions['managed_content_records']['generate_embedding']['parameters']>) => (
      Promise<extractFields<CustomActions['managed_content_records']['generate_embedding']['returns']>>
    ),
    search: (args: extractFields<CustomActions['managed_content_records']['search']['parameters']>) => (
      Promise<extractFields<CustomActions['managed_content_records']['search']['returns']>>
    ),
    update_indexes: (args: extractFields<CustomActions['managed_content_records']['update_indexes']['parameters']>) => (
      Promise<extractFields<CustomActions['managed_content_records']['update_indexes']['returns']>>
    ),
  },
  automation_triggers: {
    trigger_events: (args: extractFields<CustomActions['automation_triggers']['trigger_events']['parameters']>) => (
      Promise<extractFields<CustomActions['automation_triggers']['trigger_events']['returns']>>
    ),
  },
  ticket_queues: {
    update_indexes: (args: extractFields<CustomActions['ticket_queues']['update_indexes']['parameters']>) => (
      Promise<extractFields<CustomActions['ticket_queues']['update_indexes']['returns']>>
    ),
  },
  tickets: {
    bulk_assign: (args: extractFields<CustomActions['tickets']['bulk_assign']['parameters']>) => (
      Promise<extractFields<CustomActions['tickets']['bulk_assign']['returns']>>
    ),
    bulk_delete: (args: extractFields<CustomActions['tickets']['bulk_delete']['parameters']>) => (
      Promise<extractFields<CustomActions['tickets']['bulk_delete']['returns']>>
    ),
    update_indexes: (args: extractFields<CustomActions['tickets']['update_indexes']['parameters']>) => (
      Promise<extractFields<CustomActions['tickets']['update_indexes']['returns']>>
    ),
    assign_from_queue: (args: extractFields<CustomActions['tickets']['assign_from_queue']['parameters']>) => (
      Promise<extractFields<CustomActions['tickets']['assign_from_queue']['returns']>>
    ),
    get_report: (args: extractFields<CustomActions['tickets']['get_report']['parameters']>) => (
      Promise<extractFields<CustomActions['tickets']['get_report']['returns']>>
    ),
    get_distribution_report: (args: extractFields<CustomActions['tickets']['get_distribution_report']['parameters']>) => (
      Promise<extractFields<CustomActions['tickets']['get_distribution_report']['returns']>>
    ),
    close_ticket: (args: extractFields<CustomActions['tickets']['close_ticket']['parameters']>) => (
      Promise<extractFields<CustomActions['tickets']['close_ticket']['returns']>>
    ),
  },
  appointment_booking_pages: {
    generate_access_token: (args: extractFields<CustomActions['appointment_booking_pages']['generate_access_token']['parameters']>) => (
      Promise<extractFields<CustomActions['appointment_booking_pages']['generate_access_token']['returns']>>
    ),
  },
  products: {
    prepare_stripe_checkout: (args: extractFields<CustomActions['products']['prepare_stripe_checkout']['parameters']>) => (
      Promise<extractFields<CustomActions['products']['prepare_stripe_checkout']['returns']>>
    ),
  },
  group_mms_conversations: {
    start_conversation: (args: extractFields<CustomActions['group_mms_conversations']['start_conversation']['parameters']>) => (
      Promise<extractFields<CustomActions['group_mms_conversations']['start_conversation']['returns']>>
    ),
    send_message: (args: extractFields<CustomActions['group_mms_conversations']['send_message']['parameters']>) => (
      Promise<extractFields<CustomActions['group_mms_conversations']['send_message']['returns']>>
    ),
  },
  enduser_eligibility_results: {
    develop_health_run_benefit_verification: (args: extractFields<CustomActions['enduser_eligibility_results']['develop_health_run_benefit_verification']['parameters']>) => (
      Promise<extractFields<CustomActions['enduser_eligibility_results']['develop_health_run_benefit_verification']['returns']>>
    ),
  },
  agent_records: {
    submit_support_ticket: (args: extractFields<CustomActions['agent_records']['submit_support_ticket']['parameters']>) => (
      Promise<extractFields<CustomActions['agent_records']['submit_support_ticket']['returns']>>
    ),
  },
  waitlists: {
    grant_access_from_waitlist: (args: extractFields<CustomActions['waitlists']['grant_access_from_waitlist']['parameters']>) => (
      Promise<extractFields<CustomActions['waitlists']['grant_access_from_waitlist']['returns']>>
    ),
  },
  background_errors: {
    mark_read: (args: extractFields<CustomActions['background_errors']['mark_read']['parameters']>) => (
      Promise<extractFields<CustomActions['background_errors']['mark_read']['returns']>>
    ),
  },
  ai_conversations: {
    send_message: (args: extractFields<CustomActions['ai_conversations']['send_message']['parameters']>) => (
      Promise<extractFields<CustomActions['ai_conversations']['send_message']['returns']>>
    ),
  },
}

// session info that's currently required/used on front-end but not part of base user model
type UserInfo = User & {
  type: 'user',
  orgTwilioNumber?: string,
  dashboardView?: CustomDashboardView,
  ticketThreadsEnabled?: boolean, // zendesk enabled
  enduserDisplayName?: string,
  access: AccessPermissions,
  orgName?: string,
  limits?: OrganizationLimits,
  uiRestrictions?: UserUIRestrictions,
  requiresMFA?: boolean,
  hasTicketQueues?: boolean,
}

export type BulkLoadOptions = {
  lastId?: string,  
  limit?: number,
  from?: Date,
  filter?: Record<string, any>,
  includeFields?: string[],
}

export class Session extends SessionManager {
  api: Queries;
  userInfo!: UserInfo;
  type: SessionType = 'user';

  constructor(o?: SessionOptions & { userInfo?: UserInfo }) {
    super({ ...o, cacheKey: o?.cacheKey || "tellescope_user", type: 'user' })
    if (o?.userInfo) this.userInfo = o.userInfo

    const queries = loadDefaultQueries(this) as Queries


    // removed
    // queries.journeys.update_state = ({id, name, updates}) => this._PATCH(`/v1/journey/${id}/state/${name}`, { updates })
    queries.journeys.delete_states = ({ id, states }) => this._DELETE(`/v1/journey/${id}/states`, { states })
    queries.journeys.handle_incoming_communication = a => (
      this._POST(`/v1${schema.journeys.customActions.handle_incoming_communication.path}`, a)
    )
    queries.journeys.get_journey_statistics = a => this._GET(`/v1${schema.journeys.customActions.get_journey_statistics.path}`, a)

    queries.enduser_orders.get_available_tests = a => this._GET(`/v1${schema.enduser_orders.customActions.get_available_tests.path}`, a)
    queries.enduser_orders.create_lab_order = a => this._POST(`/v1${schema.enduser_orders.customActions.create_lab_order.path}`, a)
    queries.enduser_orders.cancel_order = a => this._POST(`/v1${schema.enduser_orders.customActions.cancel_order.path}`, a)
    queries.enduser_orders.create_go_go_meds_order = a => this._POST(`/v1${schema.enduser_orders.customActions.create_go_go_meds_order.path}`, a)
    queries.enduser_orders.create_smart_meter_order = a => this._POST(`/v1${schema.enduser_orders.customActions.create_smart_meter_order.path}`, a)

    queries.endusers.set_password = args => this._POST(`/v1/set-enduser-password`, args)
    queries.endusers.add_to_healthie_course = a => this._POST(`/v1${schema.endusers.customActions.add_to_healthie_course.path}`, a)
    queries.endusers.add_to_journey = a => this._POST(`/v1${schema.endusers.customActions.add_to_journey.path}`, a)
    queries.endusers.remove_from_journey = a => this._POST(`/v1${schema.endusers.customActions.remove_from_journey.path}`, a)
    queries.endusers.is_authenticated = ({id, authToken}) => this._GET(`/v1/enduser-is-authenticated`, { id, authToken })
    queries.endusers.generate_auth_token = args => this._GET(`/v1/generate-enduser-auth-token`, args)
    queries.endusers.merge = a => this._POST(`/v1${schema.endusers.customActions.merge.path}`, a)
    queries.endusers.push = a => this._POST(`/v1${schema.endusers.customActions.push.path}`, a)
    queries.endusers.bulk_update = a => this._PATCH(`/v1${schema.endusers.customActions.bulk_update.path}`, a)
    queries.endusers.bulk_assignment = a => this._PATCH(`/v1${schema.endusers.customActions.bulk_assignment.path}`, a)
    queries.endusers.get_report = a => this._GET(`/v1/${schema.endusers.customActions.get_report.path}`, a)
    queries.endusers.related_contacts_report = a => this._GET(`/v1/${schema.endusers.customActions.related_contacts_report.path}`, a)
    queries.endusers.get_engagement_statistics = a => this._GET(`/v1/${schema.endusers.customActions.get_engagement_statistics.path}`, a)
    queries.endusers.get_engagement_statistics_by_userId = a => this._GET(`/v1/${schema.endusers.customActions.get_engagement_statistics_by_userId.path}`, a)
    queries.endusers.sync_zendesk = a => this._POST(`/v1${schema.endusers.customActions.sync_zendesk.path}`, a)
    queries.endusers.get_journeys_report = a => this._POST(`/v1${schema.endusers.customActions.get_journeys_report.path}`, a)
    queries.endusers.check_eligibility = a => this._POST(`/v1${schema.endusers.customActions.check_eligibility.path}`, a)
    queries.endusers.dosespot = a => this._POST(`/v1${schema.endusers.customActions.dosespot.path}`, a)
    queries.endusers.customer_io_sync = a => this._POST(`/v1${schema.endusers.customActions.customer_io_sync.path}`, a)
    queries.endusers.rename_stored_custom_fields = a => this._PATCH(`/v1${schema.endusers.customActions.rename_stored_custom_fields.path}`, a)
    queries.endusers.load_inbox_data = a => this._GET(`/v1/${schema.endusers.customActions.load_inbox_data.path}`, a)

    queries.users.display_names = () => this._GET<{}, { fname: string, lname: string, id: string }[]>(`/v1/user-display-names`)
    queries.users.begin_sso = a => this._POST(`/v1/${schema.users.publicActions.begin_sso.path}`, a)
    queries.users.complete_sso = a => this._POST(`/v1/${schema.users.publicActions.complete_sso.path}`, a)
    queries.users.register = (args) => this._POST(`/v1${schema.users.publicActions.register.path}`, args)
    queries.users.login = (args) => this._POST(`/v1${schema.users.publicActions.login.path}`, args)
    queries.users.login_with_google = (args) => this._POST(`/v1${schema.users.publicActions.login_with_google.path}`, args)
    queries.users.request_password_reset = (args) => this._POST(`/v1${schema.users.publicActions.request_password_reset.path}`, args)
    queries.users.submit_email_verification = (args) => this._POST(`/v1${schema.users.publicActions.submit_email_verification.path}`, args)
    queries.users.reset_password = (args) => this._POST(`/v1${schema.users.publicActions.reset_password.path}`, args)
    queries.users.generate_auth_token = args => this._GET(`/v1/${schema.users.customActions.generate_auth_token.path}`, args) 
    queries.users.send_invitation_to_existing = args => this._POST(`/v1/${schema.users.customActions.send_invitation_to_existing.path}`, args) 
    queries.users.invite_user = a => this._POST(`/v1/${schema.users.customActions.invite_user.path}`, a)
    queries.users.configure_inbox = a => this._POST(`/v1/${schema.users.customActions.configure_inbox.path}`, a)
    queries.users.consent = a => this._PATCH(`/v1/${schema.users.customActions.consent.path}`, a)
    queries.users.get_engagement_report = a => this._GET(`/v1/${schema.users.customActions.get_engagement_report.path}`, a)
    queries.users.get_users_for_groups = a => this._GET(`/v1/${schema.users.customActions.get_users_for_groups.path}`, a)
    queries.users.play_phone_message = a => this._POST(`/v1/${schema.users.customActions.play_phone_message.path}`, a)

    queries.users.configure_MFA = a => this._POST(`/v1/${schema.users.customActions.configure_MFA.path}`, a)
    queries.users.generate_MFA_challenge = a => this._POST(`/v1/${schema.users.customActions.generate_MFA_challenge.path}`, a)
    queries.users.submit_MFA_challenge = a => this._POST(`/v1/${schema.users.customActions.submit_MFA_challenge.path}`, a)

    /** @deprecated */ //  keep here as well for backwards compatibility
    queries.organizations.invite_user = a => this._POST(`/v1/${schema.users.customActions.invite_user.path}`, a) 

    queries.forms.get_form_statistics = args => this._GET(`/v1${schema.forms.customActions.get_form_statistics.path}`, args)

    queries.form_fields.load_choices_from_database = args => this._GET(`/v1${schema.form_fields.customActions.load_choices_from_database.path}`, args)
    queries.form_fields.booking_info = args => this._GET(`/v1${schema.form_fields.customActions.booking_info.path}`, args)

    queries.form_responses.prepare_form_response = (args) => this._POST(`/v1${schema.form_responses.customActions.prepare_form_response.path}`, args)
    queries.form_responses.submit_form_response = (args) => this._PATCH(`/v1${schema.form_responses.customActions.submit_form_response.path}`, args)
    queries.form_responses.save_field_response = (args) => this._PATCH(`/v1${schema.form_responses.customActions.save_field_response.path}`, args)
    queries.form_responses.info_for_access_code = (args) => this._GET(`/v1${schema.form_responses.customActions.info_for_access_code.path}`, args)
    queries.form_responses.stripe_details = (args) => this._GET(`/v1${schema.form_responses.customActions.stripe_details.path}`, args)
    queries.form_responses.chargebee_details = (args) => this._GET(`/v1${schema.form_responses.customActions.chargebee_details.path}`, args)
    queries.form_responses.push_to_EHR = (args) => this._POST(`/v1${schema.form_responses.customActions.push_to_EHR.path}`, args)
    queries.form_responses.create_canvas_note = (args) => this._POST(`/v1${schema.form_responses.customActions.create_canvas_note.path}`, args)
    queries.form_responses.get_report = a => this._POST(`/v1/${schema.form_responses.customActions.get_report.path}`, a)
    queries.form_responses.get_enduser_statistics = a => this._POST(`/v1/${schema.form_responses.customActions.get_enduser_statistics.path}`, a)
    queries.form_responses.get_enduser_statistics_by_submitter = a => this._POST(`/v1/${schema.form_responses.customActions.get_enduser_statistics_by_submitter.path}`, a)
    queries.form_responses.get_related_forms_report = a => this._POST(`/v1/${schema.form_responses.customActions.get_related_forms_report.path}`, a)
    queries.form_responses.get_distribution_report = a => this._POST(`/v1/${schema.form_responses.customActions.get_distribution_report.path}`, a)
    
    // need arraybuffer response type, see tests.ts
    // queries.form_responses.generate_pdf = (args) => (
    //   this._GET(`/v1${schema.form_responses.customActions.generate_pdf.path}`, args)
    // )

    queries.files.prepare_file_upload = (args) => this._POST(`/v1/prepare-file-upload`, args)
    queries.files.confirm_file_upload = a => this._POST(`/v1${schema.files.customActions.confirm_file_upload.path}`, a)
    queries.files.send_fax = a => this._POST(`/v1${schema.files.customActions.send_fax.path}`, a)
    queries.files.file_download_URL = a => this._GET('/v1/file-download-URL', a)
    queries.files.run_ocr = a => this._POST(`/v1${schema.files.customActions.run_ocr.path}`, a)
    queries.files.push = a => this._POST(`/v1${schema.files.customActions.push.path}`, a)

    queries.chat_rooms.join_room = a => this._POST('/v1/join-chat-room', a)
    queries.chat_rooms.display_info = a => this._GET(`/v1${schema.chat_rooms.customActions.display_info.path}`, a)
    queries.chat_rooms.mark_read = a => this._POST(`/v1${schema.chat_rooms.customActions.mark_read.path}`, a)
    queries.chat_rooms.send_healthie_chat = a => this._POST(`/v1${schema.chat_rooms.customActions.send_healthie_chat.path}`, a)

    queries.meetings.start_meeting = a => this._POST('/v1/start-meeting', a)
    queries.meetings.end_meeting = a => this._POST('/v1/end-meeting', a)
    queries.meetings.add_attendees_to_meeting = a => this._POST('/v1/add-attendees-to-meeting', a)
    queries.meetings.attendee_info = a => this._GET('/v1/attendee-info', a)
    queries.meetings.my_meetings = () => this._GET('/v1/my-meetings')
    queries.meetings.send_invite = a => this._POST(`/v1${schema.meetings.customActions.send_invite.path}`, a)
    queries.meetings.start_meeting_for_event = a => this._POST(`/v1${schema.meetings.customActions.start_meeting_for_event.path}`, a)
    queries.meetings.join_meeting_for_event = a => this._POST(`/v1${schema.meetings.customActions.join_meeting_for_event.path}`, a)

    queries.webhooks.configure = a => this._POST('/v1/configure-webhooks', a)
    queries.webhooks.update = a => this._PATCH('/v1/update-webhooks', a)
    queries.webhooks.send_automation_webhook = a => this._POST(`/v1${schema.webhooks.customActions.send_automation_webhook.path}`, a)
    queries.webhooks.get_configuration = a => this._GET(`/v1${schema.webhooks.customActions.get_configuration.path}`, a)

    queries.user_notifications.send_user_email_notification = a => this._POST(`/v1${schema.user_notifications.customActions.send_user_email_notification.path}`, a),
    queries.user_notifications.bulk_update = a => this._POST(`/v1${schema.user_notifications.customActions.bulk_update.path}`, a),

    queries.post_likes.create = args => this._POST(`/v1${schema.post_likes.customActions.create.path}`, args)
    queries.post_likes.unlike_post = args => this._POST(`/v1${schema.post_likes.customActions.unlike_post.path}`, args)

    queries.organizations.get_theme = a => this._GET(`/v1/${schema.organizations.publicActions.get_theme.path}`, a)
    queries.organizations.create_suborganization = a => this._POST(`/v1/${schema.organizations.customActions.create_suborganization.path}`, a)
    queries.organizations.create_and_join = a => this._POST(`/v1${schema.organizations.customActions.create_and_join.path}`, a)
    queries.organizations.add_athena_subscription = a => this._POST(`/v1${schema.organizations.customActions.add_athena_subscription.path}`, a)
    queries.organizations.sync_athena_subscription = a => this._POST(`/v1${schema.organizations.customActions.sync_athena_subscription.path}`, a)
    queries.organizations.sync_note_to_canvas = a => this._POST(`/v1${schema.organizations.customActions.sync_note_to_canvas.path}`, a)
    queries.organizations.link_twilio = a => this._POST(`/v1${schema.organizations.customActions.link_twilio.path}`, a)
    queries.organizations.load_twilio_embed = a => this._GET(`/v1${schema.organizations.customActions.load_twilio_embed.path}`, a)
 
    queries.integrations.update_zoom = args => this._POST(`/v1${schema.integrations.customActions.update_zoom.path}`, args)
    queries.integrations.load_payers = args => this._GET(`/v1${schema.integrations.customActions.load_payers.path}`, args)
    queries.integrations.proxy_read = args => this._GET(`/v1${schema.integrations.customActions.proxy_read.path}`, args)
    queries.integrations.proxy_write = args => this._POST(`/v1${schema.integrations.customActions.proxy_write.path}`, args)
    queries.integrations.generate_google_auth_url = a => this._POST(`/v1/${schema.integrations.customActions.generate_google_auth_url.path}`, a)
    queries.integrations.disconnect_google_integration = a => this._POST(`/v1/${schema.integrations.customActions.disconnect_google_integration.path}`, a)
    queries.integrations.refresh_oauth2_session = a => this._POST(`/v1/${schema.integrations.customActions.refresh_oauth2_session.path}`, a)
    queries.integrations.generate_oauth2_auth_url = a => this._POST(`/v1/${schema.integrations.customActions.generate_oauth2_auth_url.path}`, a)
    queries.integrations.disconnect_oauth2_integration = a => this._POST(`/v1/${schema.integrations.customActions.disconnect_oauth2_integration.path}`, a)
    queries.integrations.connect_stripe = a => this._POST(`/v1/${schema.integrations.customActions.connect_stripe.path}`, a)
    queries.integrations.add_api_key_integration = a => this._POST(`/v1/${schema.integrations.customActions.add_api_key_integration.path}`, a)
    queries.integrations.remove_api_key_integration = a => this._DELETE(`/v1/${schema.integrations.customActions.remove_api_key_integration.path}`, a)
    queries.integrations.sync_ehr = a => this._POST(`/v1/${schema.integrations.customActions.sync_ehr.path}`, a)
    queries.integrations.daily_sync = a => this._POST(`/v1${schema.integrations.customActions.daily_sync.path}`, a)
    queries.integrations.connect_photon = a => this._POST(`/v1/${schema.integrations.customActions.connect_photon.path}`, a)
    queries.integrations.disconnect_photon = a => this._POST(`/v1/${schema.integrations.customActions.disconnect_photon.path}`, a)
    queries.integrations.connect_elation = a => this._POST(`/v1${schema.integrations.customActions.connect_elation.path}`, a)
    queries.integrations.disconnect_elation = a => this._POST(`/v1${schema.integrations.customActions.disconnect_elation.path}`, a)
    queries.integrations.connect_zendesk = a => this._POST(`/v1${schema.integrations.customActions.connect_zendesk.path}`, a)
    queries.integrations.disconnect_zendesk = a => this._POST(`/v1${schema.integrations.customActions.disconnect_zendesk.path}`, a)
    
    queries.emails.sync_integrations = a => this._POST(`/v1/${schema.emails.customActions.sync_integrations.path}`, a)
    queries.emails.deliver_via_outlook = a => this._POST(`/v1/${schema.emails.customActions.deliver_via_outlook.path}`, a)
    queries.emails.deliver_via_iterable = a => this._POST(`/v1/${schema.emails.customActions.deliver_via_iterable.path}`, a)
    queries.emails.send_with_template = a => this._POST(`/v1/${schema.emails.customActions.send_with_template.path}`, a)
    queries.emails.get_template_report = a => this._GET(`/v1/${schema.emails.customActions.get_template_report.path}`, a)
    
    queries.calendar_events.session_for_start_link = a => this._GET(`/v1${schema.calendar_events.publicActions.session_for_start_link.path}`, a)
    queries.calendar_events.get_events_for_user = a => this._GET(`/v1/${schema.calendar_events.customActions.get_events_for_user.path}`, a)
    queries.calendar_events.load_events = a => this._GET(`/v1/${schema.calendar_events.customActions.load_events.path}`, a)
    queries.calendar_events.generate_meeting_link = a => this._POST(`/v1/${schema.calendar_events.customActions.generate_meeting_link.path}`, a)
    queries.calendar_events.generate_zoom_meeting = a => this._POST(`/v1/${schema.calendar_events.customActions.generate_zoom_meeting.path}`, a)
    queries.calendar_events.change_zoom_host = a => this._POST(`/v1/${schema.calendar_events.customActions.change_zoom_host.path}`, a)
    queries.calendar_events.get_report = a => this._POST(`/v1${schema.calendar_events.customActions.get_report.path}`, a)
    queries.calendar_events.get_enduser_report = a => this._POST(`/v1${schema.calendar_events.customActions.get_enduser_report.path}`, a)
    queries.calendar_events.get_status_report = a => this._POST(`/v1${schema.calendar_events.customActions.get_status_report.path}`, a)
    queries.calendar_events.get_appointment_availability = a => this._GET(`/v1${schema.calendar_events.customActions.get_appointment_availability.path}`, a)
    queries.calendar_events.push = a => this._POST(`/v1${schema.calendar_events.customActions.push.path}`, a)

    // this returns an array buffer, avoid using for copy + paste
    queries.calendar_events.download_ics_file = a => this._GET(`/v1${schema.calendar_events.customActions.download_ics_file.path}`, a, true, { responseType: 'arraybuffer' })
    // 

    queries.phone_calls.get_report = a => this._GET(`/v1/${schema.phone_calls.customActions.get_report.path}`, a)
    queries.phone_calls.authenticate_calling = a => this._POST(`/v1${schema.phone_calls.customActions.authenticate_calling.path}`, a)
    queries.phone_calls.upgrade_to_conference = a => this._POST(`/v1${schema.phone_calls.customActions.upgrade_to_conference.path}`, a)
    queries.phone_calls.add_conference_attendees = a => this._POST(`/v1${schema.phone_calls.customActions.add_conference_attendees.path}`, a)
    queries.phone_calls.remove_conference_attendees = a => this._POST(`/v1${schema.phone_calls.customActions.remove_conference_attendees.path}`, a)
    queries.phone_calls.end_conference = a => this._POST(`/v1${schema.phone_calls.customActions.end_conference.path}`, a)
    queries.phone_calls.cancel_recording = a => this._POST(`/v1${schema.phone_calls.customActions.cancel_recording.path}`, a)
    queries.phone_calls.delete_recordings = a => this._POST(`/v1${schema.phone_calls.customActions.delete_recordings.path}`, a)
    queries.phone_calls.get_number_report = a => this._GET(`/v1${schema.phone_calls.customActions.get_number_report.path}`, a)

    queries.templates.get_templated_message = a => this._POST(`/v1/${schema.templates.customActions.get_templated_message.path}`, a)
    queries.templates.get_suggested_reply = a => this._POST(`/v1/${schema.templates.customActions.get_suggested_reply.path}`, a)
    queries.templates.create_embedding = a => this._POST(`/v1/${schema.templates.customActions.create_embedding.path}`, a)
    queries.templates.embedding_search = a => this._POST(`/v1/${schema.templates.customActions.embedding_search.path}`, a)
    
    queries.analytics_frames.get_result_for_query = a => this._GET(`/v1${schema.analytics_frames.customActions.get_result_for_query.path}`, a)
    queries.analytics_frames.get_custom_report = a => this._GET(`/v1${schema.analytics_frames.customActions.get_custom_report.path}`, a)
    queries.analytics_frames.update_indexes = a => this._PATCH(`/v1${schema.analytics_frames.customActions.update_indexes.path}`, a)

    queries.availability_blocks.update_order = a => this._POST(`/v1/${schema.availability_blocks.customActions.update_order.path}`, a)
    queries.availability_blocks.handle_autoreply = a => this._POST(`/v1/${schema.availability_blocks.customActions.handle_autoreply.path}`, a)

    queries.managed_content_records.load_unauthenticated = a => this._GET(`/v1/${schema.managed_content_records.publicActions.load_unauthenticated.path}`, a)
    queries.managed_content_records.generate_embedding = a => this._POST(`/v1/${schema.managed_content_records.customActions.generate_embedding.path}`, a)
    queries.managed_content_records.search = a => this._POST(`/v1/${schema.managed_content_records.customActions.search.path}`, a)
    queries.managed_content_records.update_indexes = a => this._PATCH(`/v1/${schema.managed_content_records.customActions.update_indexes.path}`, a)

    queries.automation_triggers.trigger_events = a => this._POST(`/v1/${schema.automation_triggers.customActions.trigger_events.path}`, a)

    queries.ticket_queues.update_indexes = a => this._PATCH(`/v1/${schema.ticket_queues.customActions.update_indexes.path}`, a)

    queries.tickets.bulk_delete = a => this._DELETE(`/v1/${schema.tickets.customActions.bulk_delete.path}`, a)
    queries.tickets.bulk_assign = a => this._PATCH(`/v1/${schema.tickets.customActions.bulk_assign.path}`, a)
    queries.tickets.update_indexes = a => this._PATCH(`/v1/${schema.tickets.customActions.update_indexes.path}`, a)
    queries.tickets.assign_from_queue = a => this._PATCH(`/v1/${schema.tickets.customActions.assign_from_queue.path}`, a)
    queries.tickets.get_report = a => this._POST(`/v1/${schema.tickets.customActions.get_report.path}`, a)
    queries.tickets.get_distribution_report = a => this._POST(`/v1/${schema.tickets.customActions.get_distribution_report.path}`, a)
    queries.tickets.close_ticket = a => this._POST(`/v1/${schema.tickets.customActions.close_ticket.path}`, a)

    queries.appointment_booking_pages.generate_access_token = a => this._POST(`/v1/${schema.appointment_booking_pages.customActions.generate_access_token.path}`, a)

    queries.sms_messages.send_message_to_number = a => this._POST(`/v1/${schema.sms_messages.customActions.send_message_to_number.path}`, a)
    queries.sms_messages.get_number_report = a => this._GET(`/v1/${schema.sms_messages.customActions.get_number_report.path}`, a)
    queries.sms_messages.get_template_report = a => this._GET(`/v1/${schema.sms_messages.customActions.get_template_report.path}`, a)
    queries.sms_messages.send_with_template = a => this._POST(`/v1/${schema.sms_messages.customActions.send_with_template.path}`, a)
    queries.sms_messages.send_message_as_user_notification = a => this._POST(`/v1/${schema.sms_messages.customActions.send_message_as_user_notification.path}`, a)

    queries.purchases.charge_card_on_file = a => this._POST(`/v1/${schema.purchases.customActions.charge_card_on_file.path}`, a)

    queries.products.prepare_stripe_checkout = args => this._POST(`/v1${schema.products.customActions.prepare_stripe_checkout.path}`, args)

    queries.group_mms_conversations.start_conversation = args => this._POST(`/v1${schema.group_mms_conversations.customActions.start_conversation.path}`, args)
    queries.group_mms_conversations.send_message = args => this._POST(`/v1${schema.group_mms_conversations.customActions.send_message.path}`, args)

    queries.enduser_encounters.create_candid_encounter = args => this._POST(`/v1${schema.enduser_encounters.customActions.create_candid_encounter.path}`, args)
    
    queries.call_hold_queues.answer_call = args => this._POST(`/v1${schema.call_hold_queues.customActions.answer_call.path}`, args)
    queries.call_hold_queues.get_details = args => this._GET(`/v1${schema.call_hold_queues.customActions.get_details.path}`, args)

    queries.enduser_observations.load = args => this._GET(`/v1${schema.enduser_observations.customActions.load.path}`, args)
    queries.enduser_observations.acknowledge = args => this._POST(`/v1${schema.enduser_observations.customActions.acknowledge.path}`, args)

    queries.enduser_eligibility_results.develop_health_run_benefit_verification = args => this._POST(`/v1${schema.enduser_eligibility_results.customActions.develop_health_run_benefit_verification.path}`, args)

    queries.agent_records.submit_support_ticket = args => this._POST(`/v1${schema.agent_records.customActions.submit_support_ticket.path}`, args)

    queries.waitlists.grant_access_from_waitlist = args => this._POST(`/v1${schema.waitlists.customActions.grant_access_from_waitlist.path}`, args)

    queries.background_errors.mark_read = args => this._POST(`/v1${schema.background_errors.customActions.mark_read.path}`, args)

    queries.phone_trees.start_outbound_call = args => this._POST(`/v1${schema.phone_trees.customActions.start_outbound_call.path}`, args)

    queries.ai_conversations.send_message = args => this._POST(`/v1${schema.ai_conversations.customActions.send_message.path}`, args)

    this.api = queries
  }

  bulk_load = async (args: { load: { model: ModelName, options?: BulkLoadOptions }[] }) => {
    await this.refresh_session_if_expiring_soon()
    return await this.POST<typeof args, { results: (null | { records: any[] })[] }>(`/v1/bulk-actions/read`, args, true)
  }

  _POST = async <A,R=void>(endpoint: string, args?: A, authenticated=true, o?: { withCredentials?: boolean }) => {
    await this.refresh_session_if_expiring_soon()
    return await this.POST<A,R>(endpoint, args, authenticated, o)
  }

  _GET = async <A,R=void>(endpoint: string, params?: A, authenticated=true, options?: { responseType?: 'arraybuffer' }) => {
    await this.refresh_session_if_expiring_soon()
    return await this.GET<A,R>(endpoint, params, authenticated, options)
  }

  _PATCH = async <A,R=void>(endpoint: string, params?: A, authenticated=true) => {
    await this.refresh_session_if_expiring_soon()
    return await this.PATCH<A,R>(endpoint, params, authenticated)
  }

  _DELETE = async <A,R=void>(endpoint: string, args?: A, authenticated=true) => {
    await this.refresh_session_if_expiring_soon()
    return await this.DELETE<A,R>(endpoint, args, authenticated)
  }
 
  handle_new_session = async ({ authToken, ...userInfo }:   UserSession & { authToken: string }) => {
    this.clearState(userInfo.id === this.userInfo.id) // true to keep existing socket for same user

    this.sessionStart = Date.now()
    this.setAuthToken(authToken)
    this.setUserInfo(userInfo)

    return { authToken, ...userInfo }
  }

  change_tenant = async (args?: { all?: boolean, businessId?: string }) => {
    const { user, authToken } = await this.GET<typeof args, { user: UserSession } & { authToken: string }>('/v1/switch-tenant', args)
    this.handle_new_session({ ...user, authToken })
    return { user, authToken }
  }

  refresh_session = async (args?: { invalidatePreviousToken?: boolean }) => {
    const { user, authToken } = await this.POST<typeof args, { user: UserSession } & { authToken: string }>('/v1/refresh-session', args)
    this.handle_new_session({ ...user, authToken })
    return { user, authToken }
  }
  refresh_session_if_expiring_soon = async () => {
    if (!this.authToken) return
    const elapsedSessionMS =  Date.now() - (this.sessionStart || Date.now())
    
    if (this.AUTO_REFRESH_MS < elapsedSessionMS) { 
      return await this.refresh_session()
    }
  }

  /* using new api */
  authenticate = async (email: string, password: string, o?: { expirationInSeconds?: number }) => {
    const { authToken, user } = await this.api.users.login({ email, password, ...o })
    return this.handle_new_session({ authToken, ...user as any as UserSession } )
  }

  /* using old api */
  // authenticate = async (email: string, password: string, o?: { expirationInSeconds?: number }) => (
  //   this.handle_new_session(
  //     await this.POST<
  //       {email: string, password: string, expirationInSeconds?: number }, 
  //       UserSession & { authToken: string }
  //     >('/submit-login', { email, password, ...o })
  //   )
  // ) 

  logout = async () => {
    this.clearState()
    await this.POST('/logout-api').catch(console.error)
  }

  prepare_and_upload_file = async (details: FileDetails & { publicRead?: boolean, publicName?: string, isCalledOut?: boolean, externalId?: string, source?: string }, file: Blob | Buffer | ReactNativeFile) => {
    const { name, size, type, enduserId, publicRead, publicName, source, isCalledOut, externalId, hiddenFromEnduser } = details
    const { presignedUpload, file: createdFile } = await this.api.files.prepare_file_upload({ name, size, type, enduserId, publicRead, publicName, source, isCalledOut, externalId, hiddenFromEnduser })
    await this.UPLOAD(presignedUpload as any, file)

    this.api.files.confirm_file_upload({ id: createdFile.id }).catch(console.error)

    return createdFile
  }

  reset_db = () => this.POST('/reset-demo')
  test_online = () => this.GET<{}, string>('/v1')
  test_authenticated = () => this.GET<{}, string>('/v1/test-authenticated')

  sync = (a: { from: Date }) => this.GET<typeof a, { results: Pick<DataSyncRecord, 'modelName' | 'recordId' | 'data'>[] }>('/v1/data-sync', a)
}

export { SessionOptions }