import {
  Operation,
} from "@tellescope/types-utilities"
import {
  AccessAction, AccessForResource, AccessPermissions, AccessType,
} from "@tellescope/types-models"

export const PRIMARY_HEX = "#1564bf"
export const SECONDARY_HEX = "#1c4378"
export const ERROR_HEX = "#bf2c15"
export const WARNING_HEX = "#bfab15"

export const ADMIN_ROLE = "Admin"

export const BUSINESS_TYPE = "Business"
export const CREATOR_ONLY_ACCESS = 'creatorOnly'
export const DEFAULT_OPERATIONS: { [K in Operation]: { title?: string, description?: string, sideEffects?: [] }} = {
  create: {}, 
  createMany: {}, 
  update: {}, 
  read: {}, 
  readMany: {}, 
  delete: {}
}

export const ACCESS_ACTION_FOR_OPERATION: { [K in Operation]: AccessAction} = {
  create: 'create', 
  createMany: 'create',
  update: 'update', 
  read:   'read', 
  readMany: 'read', 
  delete: 'delete'
}

export const PLACEHOLDER_ID = "60398bb15da8abef87ef41f5"

export const USER_SESSION_TYPE = 'user'
export const ENDUSER_SESSION_TYPE = 'enduser'

export const SECONDS_IN_ONE_YEAR = 31560000

export const UNSEARCHABLE_FIELDS = ['_id', 'id', 'creator', 'createdAt', 'updatedAt', 'businessId', 'externalId', 'enduserId']

export const GOOGLE_INTEGRATIONS_TITLE = "Google"

export const ONE_MINUTE_IN_MS = 1000 * 60
export const ONE_HOUR_IN_MS   = 60 * ONE_MINUTE_IN_MS // 1hr
export const ONE_DAY_IN_MS    = 24 * ONE_HOUR_IN_MS
export const ONE_WEEK_IN_MS   = ONE_DAY_IN_MS * 7

export const EMAIL_SYNC_FREQUENCY_IN_MS = ONE_HOUR_IN_MS

export const UNIQUENESS_VIOLATION = 'Uniqueness Violation'

export const ALL_ACCESS: AccessType      = "All"
export const ASSIGNED_ACCESS: AccessType = "Assigned"
export const DEFAULT_ACCESS: AccessType  = "Default"
export const NO_ACCESS: AccessType       = null

export const FULL_ACCESS: AccessForResource = {   
  create: ALL_ACCESS,
  read:   ALL_ACCESS,
  update: ALL_ACCESS,
  delete: ALL_ACCESS,
}
export const ASSIGNED_AND_DEFAULT_ACCESS: AccessForResource = {
  create: ASSIGNED_ACCESS, // allow for creating self-assigned objects
  read:   ASSIGNED_ACCESS,
  update: ASSIGNED_ACCESS,
  delete: NO_ACCESS,
}
export const DEFAULT_ONLY_ACCESS: AccessForResource = {   
  create: DEFAULT_ACCESS,
  read:   DEFAULT_ACCESS,
  update: DEFAULT_ACCESS,
  delete: NO_ACCESS,
}
export const INACCESSIBLE: AccessForResource = {
  create: NO_ACCESS,
  read:   NO_ACCESS,
  update: NO_ACCESS,
  delete: NO_ACCESS,
}
export const READ_ONLY_ALL: AccessForResource = {
  create: NO_ACCESS,
  read:   ALL_ACCESS,
  update: NO_ACCESS,
  delete: NO_ACCESS,
}
export const READ_ONLY_ASSIGNED: AccessForResource = {
  create: NO_ACCESS,
  read:   ASSIGNED_ACCESS,
  update: NO_ACCESS,
  delete: NO_ACCESS,
}
export const READ_ONLY_DEFAULT: AccessForResource = {
  create: NO_ACCESS,
  read:   DEFAULT_ACCESS,
  update: NO_ACCESS,
  delete: NO_ACCESS,
}

export const PROVIDER_PERMISSIONS: AccessPermissions = {
  api_keys: INACCESSIBLE,
  apiKeys: INACCESSIBLE, // backwards compatibility with legacy webapp usage
  automation_steps: INACCESSIBLE,
  automated_actions: ASSIGNED_AND_DEFAULT_ACCESS,
  chats: FULL_ACCESS, // access is later filtered by chat rooms
  chat_rooms:  ASSIGNED_AND_DEFAULT_ACCESS,
  emails: ASSIGNED_AND_DEFAULT_ACCESS,
  endusers: DEFAULT_ONLY_ACCESS, // equivalent to assigned access, but more efficient in this case
  enduser_status_updates: ASSIGNED_AND_DEFAULT_ACCESS,
  engagement_events: ASSIGNED_AND_DEFAULT_ACCESS,
  files: FULL_ACCESS, 
  forms: READ_ONLY_DEFAULT,
  form_fields: READ_ONLY_DEFAULT,
  form_responses: ASSIGNED_AND_DEFAULT_ACCESS, 
  journeys: READ_ONLY_DEFAULT,
  meetings: ASSIGNED_AND_DEFAULT_ACCESS,
  sms_messages: ASSIGNED_AND_DEFAULT_ACCESS,
  tasks: ASSIGNED_AND_DEFAULT_ACCESS,
  tickets: ASSIGNED_AND_DEFAULT_ACCESS,
  templates: READ_ONLY_ALL,
  organizations: READ_ONLY_ALL,
  users: {
    ...READ_ONLY_ALL,
    update: 'Default', // allow updating self, separate restriction exists to prevent updating other users if non-admin
  },
  notes: ASSIGNED_AND_DEFAULT_ACCESS,
  webhooks: INACCESSIBLE,
  calendar_events: {
    ...ASSIGNED_AND_DEFAULT_ACCESS,
    delete: ASSIGNED_ACCESS,
  },
  calendar_event_templates: {
    ...ASSIGNED_AND_DEFAULT_ACCESS,
    create: NO_ACCESS,
  },
  calendar_event_RSVPs: {
    ...ASSIGNED_AND_DEFAULT_ACCESS,
    delete: ASSIGNED_ACCESS,
  },
  user_logs: INACCESSIBLE,
  user_notifications: ASSIGNED_AND_DEFAULT_ACCESS,
  enduser_observations: ASSIGNED_AND_DEFAULT_ACCESS,
  forum_posts: ASSIGNED_AND_DEFAULT_ACCESS,
  forums: ASSIGNED_AND_DEFAULT_ACCESS,
  managed_content_records: ASSIGNED_AND_DEFAULT_ACCESS,
  managed_content_record_assignments: {
    ...ASSIGNED_AND_DEFAULT_ACCESS,
    delete: ASSIGNED_ACCESS,
  },
  post_comments: ASSIGNED_AND_DEFAULT_ACCESS,
  post_likes: ASSIGNED_AND_DEFAULT_ACCESS,
  comment_likes: ASSIGNED_AND_DEFAULT_ACCESS,
  integrations: FULL_ACCESS, // controlled by creator only
  databases: {
    read: ALL_ACCESS,
    create: NO_ACCESS,
    delete: NO_ACCESS,
    update: NO_ACCESS
  },
  database_records: ASSIGNED_AND_DEFAULT_ACCESS,
  portal_customizations: INACCESSIBLE,
  care_plans: ASSIGNED_AND_DEFAULT_ACCESS,
  enduser_tasks: ASSIGNED_AND_DEFAULT_ACCESS,
  role_based_access_permissions: INACCESSIBLE, // also controlled by adminOnly in schema
}

export const ADMIN_PERMISSIONS: AccessPermissions = {
  api_keys: FULL_ACCESS,
  apiKeys: FULL_ACCESS, // backwards compatibility with legacy webapp usage
  automated_actions: FULL_ACCESS,
  chat_rooms: FULL_ACCESS,
  emails: FULL_ACCESS,
  endusers: FULL_ACCESS,
  enduser_status_updates: FULL_ACCESS,
  engagement_events: FULL_ACCESS,
  files: FULL_ACCESS, 
  forms: FULL_ACCESS,
  form_fields: FULL_ACCESS,
  form_responses: FULL_ACCESS, 
  journeys: FULL_ACCESS,
  meetings: FULL_ACCESS,
  chats: FULL_ACCESS,
  sms_messages: FULL_ACCESS,
  tasks: FULL_ACCESS,
  tickets: FULL_ACCESS,
  templates: FULL_ACCESS,
  users: FULL_ACCESS, // create and delete adminOnly
  notes: FULL_ACCESS,
  webhooks: FULL_ACCESS,
  calendar_events: FULL_ACCESS,
  calendar_event_templates: FULL_ACCESS,
  calendar_event_RSVPs: FULL_ACCESS,
  automation_steps: FULL_ACCESS,
  user_logs: {
    ...FULL_ACCESS,
    delete: null,
  },
  user_notifications: FULL_ACCESS,
  enduser_observations: FULL_ACCESS,
  forum_posts: FULL_ACCESS,
  forums: FULL_ACCESS,
  managed_content_records: FULL_ACCESS,
  post_comments: FULL_ACCESS,
  post_likes: FULL_ACCESS,
  comment_likes: FULL_ACCESS,
  organizations: FULL_ACCESS,
  integrations: FULL_ACCESS,
  databases: FULL_ACCESS,
  database_records: FULL_ACCESS,
  portal_customizations: FULL_ACCESS,
  care_plans: FULL_ACCESS,
  enduser_tasks: FULL_ACCESS,
  managed_content_record_assignments: FULL_ACCESS,
  role_based_access_permissions: FULL_ACCESS,
}

export const PORTAL_DEFAULT_LANDING_TITLE = "Your Portal"
export const PORTAL_DEFAULT_LOGIN_TITLE = "Welcome back!"
export const PORTAL_DEFAULT_LOGIN_DESCRIPTION = "Log in to your account."
export const PORTAL_DEFAULT_REGISTER_TITLE = "Getting Started"
export const PORTAL_DEFAULT_REGISTER_DESCRIPTION = "Let's create your account."