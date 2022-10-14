import {
  ModelForName,
  ModelForName_required,
  RecordInfo,
  Organization as BaseOrganization,
} from "@tellescope/types-models"

export type ObjectId = import('mongodb').ObjectId

export type ToServerModel<T> = Omit<T, 'id'> & { _id: ObjectId }
export type ToServerModels<T> = {
  [K in keyof T]: ToServerModel<T[K]>
}
export type ServerModelForName = ToServerModels<ModelForName>
export type ServerModelForName_required = ToServerModels<ModelForName_required>
export type APIKey = ServerModelForName['api_keys']
export type ChatMessage = ServerModelForName['chats']
export type ChatRoom = ServerModelForName['chat_rooms']
export type Enduser = ServerModelForName['endusers']
export type EnduserObservation = ServerModelForName['enduser_observations']
export type EnduserStatusUpdate = ServerModelForName['enduser_status_updates']
export type Email = ServerModelForName['emails']
export type EngagementEvent = ServerModelForName['engagement_events']
export type EngagementEvent_required = ServerModelForName_required['engagement_events']
export type File = ServerModelForName['files']
export type Journey = ServerModelForName['journeys']
export type ManagedContentRecord = ServerModelForName['managed_content_records']
export type MessageTemplate = ServerModelForName['templates']
export type SMSMessage = ServerModelForName['sms_messages']
export type Task = ServerModelForName['tasks']
export type Ticket = ServerModelForName['tickets']
export type User = ServerModelForName['users']
export type Meeting = ServerModelForName['meetings']
export type Note = ServerModelForName['notes']
export type Form = ServerModelForName['forms']
export type FormField = ServerModelForName['form_fields']
export type FormResponse = ServerModelForName['form_responses']
export type CalendarEvent = ServerModelForName['calendar_events']
export type CalendarEventTemplate = ServerModelForName['calendar_event_templates']
export type CalendarEventRSVP = ServerModelForName['calendar_event_RSVPs']
export type AutomationStep = ServerModelForName['automation_steps']
export type AutomatedAction = ServerModelForName['automated_actions']
export type UserLog = ServerModelForName['user_logs']
export type UserNotification = ServerModelForName['user_notifications']
export type WebHook = ServerModelForName['webhooks']
export type Integration = ServerModelForName['integrations']
export type Database = ServerModelForName['databases']
export type DatabaseRecord = ServerModelForName['database_records']
export type PortalCustomization = ServerModelForName['portal_customizations']
export type EnduserTask = ServerModelForName['enduser_tasks']
export type CarePlan = ServerModelForName['care_plans']

export type Forum = ServerModelForName['forums']
export type ForumPost = ServerModelForName['forum_posts']
export type PostComment = ServerModelForName['post_comments']
export type PostLike = ServerModelForName['post_likes']
export type CommentLike = ServerModelForName['comment_likes']

export type Organization = ServerModelForName['organizations']

export type DatabaseModel = ServerModelForName[keyof ModelForName]
export type InternalDatabaseRecord = ToServerModel<RecordInfo>
export { ModelName } from "@tellescope/types-models"

export type ClientType <T> = Omit<T, '_id'> & { id: string }

export interface CustomUpdateOptions {
  replaceObjectFields?: boolean,
}

export interface InternalBusinessRecord {
  _id: ObjectId,
  businessId: string,
}

export interface AccessToken extends InternalBusinessRecord {
  type: 'passwordReset',
  tokenHash: string,
  userId: string,
  expire24HoursAfter: Date,
  // fields: object,
}

export interface DelayedEvent extends InternalBusinessRecord {
  type: 'sessionTimeout' | 'sync',
  triggerAt: number,
  fields: object,
}
export interface SessionTimeoutEvent extends DelayedEvent {
  type: 'sessionTimeout'
  fields: {
    authToken: string,
  }
}

export interface ElectronicSignature extends InternalBusinessRecord {
  ip: string,
  termsVersion: '1.0',
  description: string,
  accessCode: string,
  signatureText: string,
  enduserId: string,
  formResponseId: string,
  responsesHash: string,
}