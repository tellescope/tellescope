import { Session, SessionOptions } from "./session"
import { APIQuery } from "./sdk"
import { url_safe_path } from "@tellescope/utilities"

import { FileDetails, ReactNativeFile, S3PresignedPost, SessionType, UserIdentity } from "@tellescope/types-utilities"
import { 
  Attendee,
} from "@tellescope/types-models"
import {
  ClientModelForName,
  ClientModelForName_required,
  Enduser,
  File,
  Meeting,
  UserDisplayInfo,
} from "@tellescope/types-client"
import { schema, CustomActions, extractFields, PublicActions, CustomAction } from '@tellescope/schema'

export interface EnduserSessionOptions extends SessionOptions { enduser?: Enduser, businessId: string }

type EnduserAccessibleModels = (
    'endusers' 
  | 'appointment_booking_pages'
  | 'users'
  | 'form_responses' 
  | "chat_rooms" 
  | 'chats' 
  | 'files' 
  | 'form_fields'
  | 'tickets' 
  | 'calendar_events' 
  | 'calendar_event_templates' // for self schedulign 
  | 'engagement_events'
  | "enduser_observations"
  | "forum_posts"
  | "forums"
  | "managed_content_records"
  | "managed_content_record_assignments"
  | "post_comments"
  | "post_likes"
  | "comment_likes"
  | 'meetings'
  | 'portal_customizations'
  | "calendar_event_RSVPs"
  | "care_plans"
  | "enduser_tasks"
  | 'integrations' // may want OAuth2 support in future
  | 'products'
  | 'purchases'
  | 'purchase_credits'
  | 'appointment_locations'
  | 'enduser_medications'
  | 'ticket_threads'
  | 'ticket_thread_comments'
  | 'enduser_orders'
  | 'enduser_problems'
  | 'diagnosis_codes'
  | 'allergy_codes'
  | 'forms'
  | 'enduser_eligibility_results'
)

export const defaultQueries = <N extends keyof ClientModelForName>(
  s: EnduserSession, n: keyof ClientModelForName_required
): APIQuery<N> => {

  const safeName = url_safe_path(n)
  const singularName = (safeName).substring(0, safeName.length - 1)

  return {
    createOne: o => s._POST(`/v1/${singularName}`, o),
    createSome: os => s._POST(`/v1/${safeName}`, { create: os }),
    getOne: (argument) => typeof argument === 'string' ? s._GET(`/v1/${singularName}/${argument}`)
                                                       : s._GET(`/v1/${singularName}`, { filter: argument}),
    getSome: o => s._GET(`/v1/${safeName}`, o),
    getByIds: (o) => s._POST(`/v1/${safeName}/bulk-read`, o),
    updateOne: (id, updates, options) => s._PATCH(`/v1/${singularName}/${id}`, { updates, options }),
    deleteOne: id => s._DELETE(`/v1/${singularName}/${id}`),
  }
}

type EnduserQueries = { [K in EnduserAccessibleModels]: APIQuery<K> } & {
  endusers: {
    logout: () => Promise<void>;
    current_session_info: () => Promise<extractFields<CustomActions['endusers']['current_session_info']['returns']>>,
    add_to_journey: (args: extractFields<CustomActions['endusers']['add_to_journey']['parameters']>) => (
      Promise<extractFields<CustomActions['endusers']['add_to_journey']['returns']>>
    ),
    set_password: (args: extractFields<CustomActions['endusers']['set_password']['parameters']>) => (
      Promise<extractFields<CustomActions['endusers']['set_password']['returns']>>
    ),
    unsubscribe: (args: extractFields<PublicActions['endusers']['unsubscribe']['parameters']>) => (
      Promise<extractFields<PublicActions['endusers']['unsubscribe']['returns']>>
    ),
    get_otp_methods: (args: extractFields<PublicActions['endusers']['get_otp_methods']['parameters']>) => (
      Promise<extractFields<PublicActions['endusers']['get_otp_methods']['returns']>>
    ),
    send_otp: (args: extractFields<PublicActions['endusers']['send_otp']['parameters']>) => (
      Promise<extractFields<PublicActions['endusers']['send_otp']['returns']>>
    ),
    verify_otp: (args: extractFields<PublicActions['endusers']['verify_otp']['parameters']>) => (
      Promise<extractFields<PublicActions['endusers']['verify_otp']['returns']>>
    ),
  },
  users: {
    display_info: () => Promise<UserDisplayInfo[]>
  },
  files: {
    prepare_file_upload: (args: FileDetails & { externalId?: string, publicRead?: boolean, publicName?: string, }) => Promise<{ presignedUpload: S3PresignedPost, file: File }>,
    file_download_URL: (args: extractFields<CustomActions['files']['file_download_URL']['parameters']>) => 
                          Promise<extractFields<CustomActions['files']['file_download_URL']['returns']>>,
    confirm_file_upload: (args: extractFields<CustomActions['files']['confirm_file_upload']['parameters']>) => 
                          Promise<extractFields<CustomActions['files']['confirm_file_upload']['returns']>>,
  },
  form_fields: {
    load_choices_from_database: (args: extractFields<CustomActions['form_fields']['load_choices_from_database']['parameters']>) => (
      Promise<extractFields<CustomActions['form_fields']['load_choices_from_database']['returns']>>
    ),
    booking_info: (args: extractFields<CustomActions['form_fields']['booking_info']['parameters']>) => (
      Promise<extractFields<CustomActions['form_fields']['booking_info']['returns']>>
    ),
    // load_payers: (args: extractFields<CustomActions['form_fields']['load_payers']['parameters']>) => (
    //   Promise<extractFields<CustomActions['form_fields']['load_payers']['returns']>>
    // ),
  },
  form_responses: {
    save_field_response: (args: extractFields<CustomActions['form_responses']['save_field_response']['parameters']>) => (
      Promise<extractFields<CustomActions['form_responses']['save_field_response']['returns']>>
    ),
    submit_form_response: (args: extractFields<CustomActions['form_responses']['submit_form_response']['parameters']>) => (
      Promise<extractFields<CustomActions['form_responses']['submit_form_response']['returns']>>
    ),
    prepare_form_response: (args: extractFields<CustomActions['form_responses']['prepare_form_response']['parameters']>) => (
      Promise<extractFields<CustomActions['form_responses']['prepare_form_response']['returns']>>
    ),
    session_for_public_form: (args: extractFields<PublicActions['form_responses']['session_for_public_form']['parameters']>) => (
      Promise<extractFields<PublicActions['form_responses']['session_for_public_form']['returns']>>
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
  },
  meetings: {
    attendee_info: (args: { id: string }) => Promise<{ attendee: Attendee, others: UserIdentity[] }>,
    my_meetings: () => Promise<Meeting[]>,
    join_meeting_for_event: (args?: extractFields<CustomActions['meetings']['join_meeting_for_event']['parameters']>) => (
      Promise<extractFields<CustomActions['meetings']['join_meeting_for_event']['returns']>>
    ),
  },
  chat_rooms: {
    display_info: (args: extractFields<CustomActions['chat_rooms']['display_info']['parameters']>) => (
      Promise<extractFields<CustomActions['chat_rooms']['display_info']['returns']>>
    ),
    mark_read: (args: extractFields<CustomActions['chat_rooms']['mark_read']['parameters']>) => (
      Promise<extractFields<CustomActions['chat_rooms']['mark_read']['returns']>>
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
    get_theme: (args: extractFields<PublicActions['organizations']['get_theme']['parameters']>) => (
      Promise<extractFields<PublicActions['organizations']['get_theme']['returns']>>
    ),
  },
  sms_messages: {
    leave_message: (args: extractFields<PublicActions['sms_messages']['leave_message']['parameters']>) => (
      Promise<extractFields<PublicActions['sms_messages']['leave_message']['returns']>>
    ),
  },
  calendar_events: {
    get_appointment_availability: (args: extractFields<CustomActions['calendar_events']['get_appointment_availability']['parameters']>) => (
      Promise<extractFields<CustomActions['calendar_events']['get_appointment_availability']['returns']>>
    ),
    book_appointment: (args: extractFields<CustomActions['calendar_events']['book_appointment']['parameters']>) => (
      Promise<extractFields<CustomActions['calendar_events']['book_appointment']['returns']>>
    ),
    stripe_details: (args: extractFields<CustomActions['calendar_events']['stripe_details']['parameters']>) => (
      Promise<extractFields<CustomActions['calendar_events']['stripe_details']['returns']>>
    ),
    session_for_public_appointment_booking: (args: extractFields<PublicActions['calendar_events']['session_for_public_appointment_booking']['parameters']>) => (
      Promise<extractFields<PublicActions['calendar_events']['session_for_public_appointment_booking']['returns']>>
    ),
    session_for_join_link: (args: extractFields<PublicActions['calendar_events']['session_for_join_link']['parameters']>) => (
      Promise<extractFields<PublicActions['calendar_events']['session_for_join_link']['returns']>>
    ),
    details_for_appointment_booking_page: (args: extractFields<PublicActions['calendar_events']['details_for_appointment_booking_page']['parameters']>) => (
      Promise<extractFields<PublicActions['calendar_events']['details_for_appointment_booking_page']['returns']>>
    ),
    download_ics_file: (args: extractFields<CustomActions['calendar_events']['download_ics_file']['parameters']>) => (
      Promise<extractFields<CustomActions['calendar_events']['download_ics_file']['returns']>>
    ),
  },
  managed_content_records: {
    search: (args: extractFields<CustomActions['managed_content_records']['search']['parameters']>) => (
      Promise<extractFields<CustomActions['managed_content_records']['search']['returns']>>
    ),
  },
  forms: {
    public_form_details: (args: extractFields<PublicActions['forms']['public_form_details']['parameters']>) => (
      Promise<extractFields<PublicActions['forms']['public_form_details']['returns']>>
    ),
  },
  appointment_booking_pages: {
    validate_access_token: (args: extractFields<PublicActions['appointment_booking_pages']['validate_access_token']['parameters']>) => (
      Promise<extractFields<PublicActions['appointment_booking_pages']['validate_access_token']['returns']>>
    ),
  },
  products: {
    prepare_stripe_checkout: (args: extractFields<CustomActions['products']['prepare_stripe_checkout']['parameters']>) => (
      Promise<extractFields<CustomActions['products']['prepare_stripe_checkout']['returns']>>
    ),
    get_stripe_portal_session: (args: extractFields<CustomActions['products']['get_stripe_portal_session']['parameters']>) => (
      Promise<extractFields<CustomActions['products']['get_stripe_portal_session']['returns']>>
    ),
  },
  integrations: {
    proxy_read: (args: extractFields<CustomActions['integrations']['proxy_read']['parameters']>) => (
      Promise<extractFields<CustomActions['integrations']['proxy_read']['returns']>>
    ),
    proxy_write: (args: extractFields<CustomActions['integrations']['proxy_write']['parameters']>) => (
      Promise<extractFields<CustomActions['integrations']['proxy_write']['returns']>>
    ),
  },
  enduser_observations: {
    load: (args: extractFields<CustomActions['enduser_observations']['load']['parameters']>) => (
      Promise<extractFields<CustomActions['enduser_observations']['load']['returns']>>
    ),
  },
}

export type PublicAppointmentBookingInfo = extractFields<PublicActions['calendar_events']['details_for_appointment_booking_page']['returns']>

const loadDefaultQueries = (s: EnduserSession): { [K in EnduserAccessibleModels] : APIQuery<K> } => ({
  appointment_booking_pages: defaultQueries(s, 'appointment_booking_pages'),
  chat_rooms: defaultQueries(s, 'chat_rooms'),
  chats: defaultQueries(s, 'chats'),
  endusers: defaultQueries(s, 'endusers'),
  calendar_events: defaultQueries(s, 'calendar_events'),
  calendar_event_templates: defaultQueries(s, 'calendar_event_templates'), // for self-scheduling
  engagement_events: defaultQueries(s, 'engagement_events'),
  files: defaultQueries(s, 'files'),
  tickets: defaultQueries(s, 'tickets'),
  form_fields: defaultQueries(s, 'form_fields'),
  form_responses: defaultQueries(s, 'form_responses'),
  enduser_observations: defaultQueries(s, 'enduser_observations'),
  forum_posts: defaultQueries(s, 'forum_posts'),
  forums: defaultQueries(s, 'forums'),
  managed_content_records: defaultQueries(s, 'managed_content_records'),
  managed_content_record_assignments: defaultQueries(s, 'managed_content_record_assignments'),
  post_comments: defaultQueries(s, 'post_comments'),
  post_likes: defaultQueries(s, 'post_likes'),
  comment_likes: defaultQueries(s, 'comment_likes'),
  users: defaultQueries(s, 'users'),
  meetings: defaultQueries(s, 'meetings'),
  integrations: defaultQueries(s, 'integrations'),
  calendar_event_RSVPs: defaultQueries(s, 'calendar_event_RSVPs'),
  portal_customizations: defaultQueries(s, 'portal_customizations'),
  care_plans: defaultQueries(s, 'care_plans'),
  enduser_tasks: defaultQueries(s, 'enduser_tasks'),
  products: defaultQueries(s, 'products'),
  purchase_credits: defaultQueries(s, 'purchase_credits'),
  purchases: defaultQueries(s, 'purchases'),
  appointment_locations: defaultQueries(s, 'appointment_locations'),
  enduser_medications: defaultQueries(s, 'enduser_medications'),
  ticket_threads: defaultQueries(s, 'ticket_threads'), 
  ticket_thread_comments: defaultQueries(s, 'ticket_thread_comments'), 
  enduser_orders: defaultQueries(s, 'enduser_orders'), 
  enduser_problems: defaultQueries(s, 'enduser_problems'), 
  diagnosis_codes: defaultQueries(s, 'diagnosis_codes'), 
  allergy_codes: defaultQueries(s, 'allergy_codes'), 
  forms: defaultQueries(s, 'forms'), 
  enduser_eligibility_results: defaultQueries(s, 'enduser_eligibility_results'), 
})


export class EnduserSession extends Session {
  userInfo!: Enduser & { passwordIsUnset?: boolean, denySocket?: boolean }; 
  api: EnduserQueries;
  businessId: string;
  type: SessionType = 'enduser';

  constructor(o: EnduserSessionOptions) {
    super({ ...o, cacheKey: o?.cacheKey || "tellescope_enduser", type: 'enduser' })
    if (o?.enduser) this.userInfo = o.enduser

    this.businessId = o?.businessId

    this.api = loadDefaultQueries(this) as EnduserQueries 

    this.api.calendar_events.get_appointment_availability = a => this._GET(`/v1${schema.calendar_events.customActions.get_appointment_availability.path}`, a)
    this.api.calendar_events.book_appointment = a => this._POST(`/v1${schema.calendar_events.customActions.book_appointment.path}`, a)
    this.api.calendar_events.session_for_public_appointment_booking = a => this._POST(`/v1${schema.calendar_events.publicActions.session_for_public_appointment_booking.path}`, a)
    this.api.calendar_events.details_for_appointment_booking_page = a => this._GET(`/v1${schema.calendar_events.publicActions.details_for_appointment_booking_page.path}`, a)
    this.api.calendar_events.session_for_join_link = a => this._GET(`/v1${schema.calendar_events.publicActions.session_for_join_link.path}`, a)
    this.api.calendar_events.stripe_details = a => this._GET(`/v1${schema.calendar_events.customActions.stripe_details.path}`, a)
    this.api.calendar_events.download_ics_file = a => this._GET(`/v1${schema.calendar_events.customActions.download_ics_file.path}`, a, true, { responseType: 'arraybuffer' })

    this.api.chat_rooms.display_info = a => this._GET(`/v1${schema.chat_rooms.customActions.display_info.path}`, a)
    this.api.chat_rooms.mark_read = a => this._POST(`/v1${schema.chat_rooms.customActions.mark_read.path}`, a)

    this.api.endusers.logout = () => this._POST('/v1/logout-enduser')
    this.api.endusers.unsubscribe = a => this._POST(`/v1${schema.endusers.publicActions.unsubscribe.path}`, a)
    this.api.endusers.get_otp_methods = a => this._GET(`/v1${schema.endusers.publicActions.get_otp_methods.path}`, a)
    this.api.endusers.send_otp = a => this._POST(`/v1${schema.endusers.publicActions.send_otp.path}`, a)
    this.api.endusers.verify_otp = a => this._POST(`/v1${schema.endusers.publicActions.verify_otp.path}`, a)
    this.api.endusers.current_session_info = () => this._GET(`/v1${schema.endusers.customActions.current_session_info.path}`)
    this.api.endusers.add_to_journey = a => this._POST(`/v1${schema.endusers.customActions.add_to_journey.path}`, a)
    this.api.endusers.set_password = a => this._POST(`/v1${schema.endusers.customActions.set_password.path}`, a)

    this.api.users.display_info = () => this._GET<{}, UserDisplayInfo[] >(`/v1/user-display-info`),
    
    this.api.meetings.attendee_info = a => this._GET('/v1/attendee-info', a)
    this.api.meetings.my_meetings = () => this._GET('/v1/my-meetings')
    this.api.meetings.join_meeting_for_event = a => this._POST(`/v1${schema.meetings.customActions.join_meeting_for_event.path}`, a)

    this.api.organizations = {
      get_theme: a => this._GET(`/v1/${schema.organizations.publicActions.get_theme.path}`, a)
    }

    this.api.form_fields.load_choices_from_database = args => this._GET(`/v1${schema.form_fields.customActions.load_choices_from_database.path}`, args)
    this.api.form_fields.booking_info = args => this._GET(`/v1${schema.form_fields.customActions.booking_info.path}`, args)
    // this.api.form_fields.load_payers = args => this._GET(`/v1${schema.form_fields.customActions.load_payers.path}`, args)

    this.api.form_responses.prepare_form_response   = args => this._POST(`/v1${schema.form_responses.customActions.prepare_form_response.path}`, args)
    this.api.form_responses.session_for_public_form = args => this._POST(`/v1${schema.form_responses.publicActions.session_for_public_form.path}`, args)
    this.api.form_responses.submit_form_response    = args => this._PATCH(`/v1${schema.form_responses.customActions.submit_form_response.path}`, args)
    this.api.form_responses.save_field_response     = args => this._PATCH(`/v1${schema.form_responses.customActions.save_field_response.path}`, args)
    this.api.form_responses.info_for_access_code    = args => this._GET(`/v1${schema.form_responses.customActions.info_for_access_code.path}`, args)
    this.api.form_responses.stripe_details          = args => this._GET(`/v1${schema.form_responses.customActions.stripe_details.path}`, args)
    this.api.form_responses.chargebee_details       = args => this._GET(`/v1${schema.form_responses.customActions.chargebee_details.path}`, args)

    // files have defaultQueries
    this.api.files.prepare_file_upload = a => this._POST(`/v1/prepare-file-upload`, a)
    this.api.files.confirm_file_upload = args => this._POST(`/v1${schema.files.customActions.confirm_file_upload.path}`, args)
    this.api.files.file_download_URL = a => this._GET('/v1/file-download-URL', a)

    this.api.post_likes.createOne = args => this._POST(`/v1${schema.post_likes.customActions.create.path}`, args)
    this.api.post_likes.unlike_post = args => this._POST(`/v1${schema.post_likes.customActions.unlike_post.path}`, args)

    this.api.managed_content_records.search = args => this._POST(`/v1${schema.managed_content_records.customActions.search.path}`, args)

    this.api.forms.public_form_details = args => this._GET(`/v1${schema.forms.publicActions.public_form_details.path}`, args)
  
    this.api.sms_messages = {
      leave_message: args => this._POST(`/v1${schema.sms_messages.publicActions.leave_message.path}`, args)
    }

    this.api.appointment_booking_pages.validate_access_token = args => this._GET(`/v1${schema.appointment_booking_pages.publicActions.validate_access_token.path}`, args)

    this.api.products.prepare_stripe_checkout = args => this._POST(`/v1${schema.products.customActions.prepare_stripe_checkout.path}`, args)
    this.api.products.get_stripe_portal_session = args => this._GET(`/v1${schema.products.customActions.get_stripe_portal_session.path}`, args)

    this.api.integrations.proxy_read = args => this._GET(`/v1${schema.integrations.customActions.proxy_read.path}`, args)
    this.api.integrations.proxy_write = args => this._POST(`/v1${schema.integrations.customActions.proxy_write.path}`, args)

    this.api.enduser_observations.load = args => this._GET(`/v1${schema.enduser_observations.customActions.load.path}`, args)
    // if (this.authToken) this.refresh_session()
  }

  _POST = async <A,R=void>(endpoint: string, args?: A, authenticated=true) => {
    await this.refresh_session_if_expiring_soon()
    return await this.POST<A,R>(endpoint, args, authenticated)
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

  prepare_and_upload_file = async (details: FileDetails & { publicRead?: boolean, publicName?: string, source?: string, externalId?: string }, file: Blob | Buffer | ReactNativeFile) => {
    const { name, size, type, enduserId, publicName, publicRead, source, externalId } = details
    const { presignedUpload, file: createdFile } = await this.api.files.prepare_file_upload({ externalId, name, size, type, enduserId, publicRead, publicName, source })
    await this.UPLOAD(presignedUpload, file)

    this.api.files.confirm_file_upload({ id: createdFile.id }).catch(console.error)

    return createdFile
  }

  handle_new_session = async ({ authToken, enduser }: { authToken: string, enduser: Enduser }) => {
    this.clearState(enduser.id === this.userInfo.id) // true to keep existing socket for same user

    this.sessionStart = Date.now()
    this.setAuthToken(authToken)
    this.setUserInfo(enduser)

    return { authToken, enduser }
  }

  authenticate = async (email: string, password: string, o?: { durationInSeconds?: number }) => this.handle_new_session(
    await this.POST<
      { email: string, password: string, businessId?: string, organizationIds?: string[], durationInSeconds?: number }, 
      { authToken: string, enduser: Enduser }
    >('/v1/login-enduser', { email, password, businessId: this.businessId, organizationIds: this.organizationIds, ...o })
  )

  begin_login_flow = async (a: Omit<extractFields<PublicActions['endusers']['begin_login_flow']['parameters']>, 'businessId' | 'organizationIds'>) => (
    await this.POST<
      extractFields<PublicActions['endusers']['begin_login_flow']['parameters']>, 
      extractFields<PublicActions['endusers']['begin_login_flow']['returns']>
    >(`/v1/${schema.endusers.publicActions.begin_login_flow.path}`, {
      ...a,
      businessId: this.businessId,
      organizationIds: this.organizationIds,
    })
  )

  register = async (args: Omit<extractFields<PublicActions['endusers']['register']['parameters']>, 'businessId'> & { businessId?: string }) => (
    this.POST<typeof args, Promise<extractFields<PublicActions['endusers']['register']['returns']>>>(
      `/v1${schema.endusers.publicActions.register.path}`, { ...args, businessId: this.businessId, organizationIds: this.organizationIds, }
    )
  )

  request_password_reset = async (args: extractFields<PublicActions['endusers']['request_password_reset']['parameters']>) => (
    this.POST<typeof args & { businessId: string }, Promise<extractFields<PublicActions['endusers']['request_password_reset']['returns']>>>(
      `/v1${schema.endusers.publicActions.request_password_reset.path}`, { ...args, businessId: this.businessId, 
        organizationIds: this.organizationIds, 
      }
    )
  )
  
  reset_password = async (args: extractFields<PublicActions['endusers']['reset_password']['parameters']>) => (
    this.POST<typeof args & { businessId: string }, Promise<extractFields<PublicActions['endusers']['reset_password']['returns']>>>(
      `/v1${schema.endusers.publicActions.reset_password.path}`, { ...args, businessId: this.businessId, 
        organizationIds: this.organizationIds, 
      }
    )
  )

  refresh_session = async (args?: { invalidatePreviousToken?: boolean }) => {
    const { enduser, authToken } = await this.POST<typeof args, { enduser: Enduser } & { authToken: string }>('/v1/refresh-enduser-session', args)
    return this.handle_new_session({ authToken, enduser })
  }

  refresh_session_if_expiring_soon = async () => {
    const elapsedSessionMS =  Date.now() - (this.sessionStart || Date.now())
    
    if (this.AUTO_REFRESH_MS < elapsedSessionMS) { 
      return await this.refresh_session()
    }
  }

  logout = () => {
    this.clearState()
    return this.api.endusers.logout()
  }

  test_authenticated = () => this.GET<{}, string>('/v1/test-authenticated')
}