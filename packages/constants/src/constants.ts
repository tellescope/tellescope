import {
  Operation,
} from "@tellescope/types-utilities"
import {
  AccessAction,
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