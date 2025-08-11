require('source-map-support').install();
import axios from "axios"
import crypto from "crypto"
import * as buffer from "buffer" // only node >=15.7.0

import {
  Enduser,
  ClientModelForName,
  ClientModelForName_required,
  UserDisplayInfo,
  Ticket,
  VitalConfiguration,
  EnduserObservation,
  FormResponse,
} from "@tellescope/types-client"
import { 
  CompoundFilter,
  CreateTicketActionInfo,
  CreateTicketAssignmentStrategies,
  CreateTicketAssignmentStrategy,
  FormResponseValue,
  ModelName,
  RoundRobinAssignmentInfo,
  User,
} from "@tellescope/types-models"

import {
  Indexable,
  Operation,
} from "@tellescope/types-utilities"

import {
  fieldsToValidationOld,

  InputValidationOld,
  mongoIdStringRequired,
} from "@tellescope/validation"

import { Session, APIQuery, EnduserSession } from "../sdk"
import { evaluate_conditional_logic_for_enduser_fields, FORM_LOGIC_CALCULATED_FIELDS, get_care_team_primary, get_flattened_fields, get_next_reminder_timestamp, replace_enduser_template_values, responses_satisfy_conditions, weighted_round_robin, YYYY_MM_DD_to_MM_DD_YYYY } from "@tellescope/utilities"
import { DEFAULT_OPERATIONS, PLACEHOLDER_ID, ZOOM_TITLE } from "@tellescope/constants"
import { 
  schema, 
  Model, 
  ModelFields,
} from "@tellescope/schema"

import {
  assert,
  async_test,
  log_header,
  wait,
} from "@tellescope/testing"

import {
  objects_equivalent,
  url_safe_path,
} from "@tellescope/utilities"

import fs from "fs"
import { response } from "express";
import { log } from "console";

const UniquenessViolationMessage = 'Uniqueness Violation'

const host = process.env.TEST_URL || 'http://localhost:8080' as const
const [email, password] = [process.env.TEST_EMAIL, process.env.TEST_PASSWORD]
const [mfaEmail, mfaPassword] = [process.env.MFA_EMAIL, process.env.TEST_PASSWORD]

// email2 should not be a @tellescope.com domain in order to validate access for agent_records
const [email2, password2] = [process.env.TEST_EMAIL_2, process.env.TEST_PASSWORD_2]
const [nonAdminEmail, nonAdminPassword] = [process.env.NON_ADMIN_EMAIL, process.env.NON_ADMIN_PASSWORD]

const subUserEmail = process.env.SUB_EMAIL
const otherSubUserEmail = process.env.OTHER_SUB_EMAIL
const subSubUserEmail = process.env.SUB_SUB_EMAIL

const userId = '60398b0231a295e64f084fd9'
const businessId = '60398b1131a295e64f084ff6'

// const example_SDK_usage = async () => {
//   // initialize SDK and authenticate a user
//   const sdk = new Session()
//   await sdk.authenticate("user-email", 'user-password')

//   // create a record, using Enduser model as example
//   const enduser = await sdk.api.endusers.createOne({ email: "enduser1@tellescope.com" })

//   // update an existing record
//   await sdk.api.endusers.updateOne(enduser.id, { phone: "+15555555555" })

//   // fetch a record by id, or a list of recent records
//   const existingEnduser: Enduser = await sdk.api.endusers.getOne(enduser.id)  
//   const existingEndusers: Enduser[] = await sdk.api.endusers.getSome({ limit: 5, lastId: enduser.id })  

//   // delete an individual record
//   await sdk.api.endusers.deleteOne(enduser.id)
// }

// const migrate_enduser_names = async () => {
//   const sdk = new Session({ apiKey: 'API_KEY_HERE'})

//   const endusers = await sdk.api.endusers.getSome({ limit: 1000 }) // 1000 is max

//   for (const e of endusers) {
//     await sdk.api.endusers.updateOne(e.id, { 
//       unredactedFields: {
//         fname: e.fname || '',
//         lname: e.lname || '',
//       }
//     })
//   }
// }

const sdk = new Session({ host })
const sdkSub = new Session({ host })
const sdkOtherSub = new Session({ host })
const sdkSubSub = new Session({ host })
const sdkOther = new Session({ host, apiKey: "ba745e25162bb95a795c5fa1af70df188d93c4d3aac9c48b34a5c8c9dd7b80f7" })
const sdkMfa = new Session({ host })
const sdkMfaApiKey = new Session({ host, apiKey: "9d4f9dff00f60df2690a16da2cb848f289b447614ad9bef850e54af09a1fbf7a" })
const sdkNonAdmin = new Session({ host })
const enduserSDK = new EnduserSession({ host, businessId })
const subEnduserSDK = new EnduserSession({ host, businessId,"organizationIds" : ["636d3c230067fc6b4c92c59c"] })
const enduserSDKDifferentBusinessId = new EnduserSession({ host, businessId: '80398b1131a295e64f084ff6' })
// const sdkOtherEmail = "sebass@tellescope.com"

if (!(email && mfaEmail && mfaPassword && subUserEmail && otherSubUserEmail && subSubUserEmail && password && email2 && password2 && nonAdminEmail && nonAdminPassword)) {
  console.error("Set TEST_EMAIL and TEST_PASSWORD")
  process.exit()
}

const recordNotFound =  { shouldError: true, onError: (e: { message: string }) => e.message === 'Could not find a record for the given id' } 
const voidResult = () => true
const passOnVoid = { shouldError: false, onResult: voidResult }
// const isNull = (d: any) => d === null

const setup_tests = async () => {
  log_header("Setup")
  await async_test('test_online', sdk.test_online, { expectedResult: 'API V1 Online' })
  await async_test('test_authenticated', sdk.test_authenticated, { expectedResult: 'Authenticated!' })

  await async_test(
    'test_authenticated (with API Key)', 
    (new Session({ host, apiKey: '3n5q0SCBT_iUvZz-b9BJtX7o7HQUVJ9v132PgHJNJsg.' /* local test key */  })).test_authenticated, 
    { expectedResult: 'Authenticated!' }
  )

  // login rate limit tests
  const badSDK = new Session({ host });
  await badSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)
  await badSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)
  await badSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)
  await badSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)
  await badSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)
  await async_test(
    'login rate limited', 
    () => badSDK.authenticate('bademail@tellescope.com', 'badpassword@tellescope.com'),
    { shouldError: true, onError: e => e.message === 'Too many login attempts' }
  )
  await async_test(
    'login not rate limited for other user', 
    () => sdk.authenticate(email, password),
    passOnAnyResult
  )

  const badEnduserSDK = new EnduserSession({ host, businessId });
  await badEnduserSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)
  await badEnduserSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)
  await badEnduserSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)
  await badEnduserSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)
  await badEnduserSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)
  await async_test(
    'login rate limited', 
    () => badEnduserSDK.authenticate('bademail@tellescope.com', 'badpassword@tellescope.com'),
    { shouldError: true, onError: e => e.message === 'Too many login attempts' }
  )
  await async_test(
    'login not rate limited for other enduser', 
    () => badEnduserSDK.authenticate('otherbademail@tellescope.com', 'badpassword@tellescope.com'),
    { shouldError: true, onError: e => e.message !== 'Too many login attempts' }
  )

  // prevent additional login throttling
  await async_test('reset_db', () => sdk.reset_db(), passOnVoid)

  await sdk.logout()
  await async_test<string, string>('test_authenticated - (logout invalidates jwt)', sdk.test_authenticated, { shouldError: true, onError: e => e === 'Unauthenticated' })
  await sdk.authenticate(email, password)
  await async_test('test_authenticated (re-authenticated)', sdk.test_authenticated, { expectedResult: 'Authenticated!' })

  const uInfo = sdk.userInfo
  const originalAuthToken = sdk.authToken
  await sdk.refresh_session()
  assert(uInfo.id === sdk.userInfo.id, 'userInfo mismatch', 'userInfo id preserved after refresh') 
  assert(
    !!originalAuthToken && !!sdk.authToken && sdk.authToken !== originalAuthToken, 
    'same authToken after refresh', 
    'authToken refresh'
  ) 

  await async_test(
    'role change by non-admin prevented (admin)', 
    () => sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: ['Admin'] }, { replaceObjectFields: true }),
    handleAnyError
  )
  await async_test(
    'email change by non-admin prevented (admin)', 
    () => sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, { email: 'otheremail@tellescope.com' }, { replaceObjectFields: true }),
    handleAnyError
  )
  await async_test(
    'role change by non-admin prevented (non-admin)', 
    () => sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: ['Not Admin'] }, { replaceObjectFields: true }),
    handleAnyError
  )
  // would assign default non-admin role, which could grant additional permissions than currently-defined non-admin role, should block
  await async_test(
    'role change by non-admin prevented (empty)', 
    () => sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [] }, { replaceObjectFields: true }),
    handleAnyError
  )

  // ensure that going to "Non-Admin" triggers a role change
  await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: ['Test'] }, { replaceObjectFields: true })
  
  await wait(undefined, 2000) // wait for role change to propagate so authenticate does fail next

  await sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)
  await async_test('non admin authenticated', sdkNonAdmin.test_authenticated, { expectedResult: 'Authenticated!' })

  // reset nonAdmin role to a default non-admin
  await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: ['Non-Admin'] }, { replaceObjectFields: true }),

  // should be unauthenticated due to role change
  await wait(undefined, 100) 
  await async_test('role change causes deauthentication', sdkNonAdmin.test_authenticated, handleAnyError)

  // reauthenticate
  await wait(undefined, 1000) 
  await sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)

  // may do some stuff in background after returning
  await async_test('reset_db', () => sdk.reset_db(), passOnVoid)
  await wait(undefined, 250)
}

const multi_tenant_tests = async () => {
  log_header("Multi Tenant")
  const e1 = await sdk.api.endusers.createOne({ email: "hi@tellescope.com" })
  const e2 = await sdkOther.api.endusers.createOne({ email: "hi@tellescope.com" })
  if (!e1) process.exit()
  if (!e2) process.exit()

  /* Test global uniqueness, create must be enabled for users model */
  // await sdk.api.users.createOne({ email }).catch(console.error)
  // await sdk.api.users.createSome([{ email }, { email }]).catch(console.error)
  // await sdkOther.users.createOne({ email }).catch(console.error)
  // await sdkOther.users.createSome([{ email }, { email }]).catch(console.error)
  // await sdk.api.users.updateOne(userId, { email: sdkOtherEmail }).catch(console.error)

  await async_test(
    "o1 get o2", () => sdk.api.endusers.getOne(e2.id), recordNotFound
  )
  await async_test(
    "o2 get o1", () => sdkOther.api.endusers.getOne(e1.id), recordNotFound
  )

  await async_test(
    "o1 get many", () => sdk.api.endusers.getSome(), { onResult: es => es.length === 1 }
  )
  await async_test(
    "o2 get many", () => sdkOther.api.endusers.getSome(), { onResult: es => es.length === 1 }
  ) 

  const update = { fname: "billy" }
  await async_test(
    "o1 update o2", () => sdk.api.endusers.updateOne(e2.id, update), recordNotFound
  )
  await async_test(
    "o2 update o1", () => sdkOther.api.endusers.updateOne(e1.id, update), recordNotFound
  )

  await async_test(
    "o1 delete o2", () => sdk.api.endusers.deleteOne(e2.id), recordNotFound
  )
  await async_test(
    "o2 delete o1", () => sdkOther.api.endusers.deleteOne(e1.id), recordNotFound
  )

  await sdk.api.endusers.deleteOne(e1.id)
  await sdkOther.api.endusers.deleteOne(e2.id)
}

const sub_organization_tests = async() => {
  log_header("Sub Organizations")

  const rootEnduser = await sdk.api.endusers.createOne({ email: 'root@tellescope.com' })
  const subEnduser = await sdkSub.api.endusers.createOne({ email: 'sub@tellescope.com' })
  const subSubEnduser = await sdkSubSub.api.endusers.createOne({ email: 'subsub@tellescope.com' })

  await async_test(`root get root`, () => sdk.api.endusers.getOne(rootEnduser.id), passOnAnyResult)
  await async_test(`sub get root error`, () => sdkSub.api.endusers.getOne(rootEnduser.id), handleAnyError)
  await async_test(`other sub get root error`, () => sdkOtherSub.api.endusers.getOne(rootEnduser.id), handleAnyError)
  await async_test(`subsub get root error`, () => sdkSubSub.api.endusers.getOne(rootEnduser.id), handleAnyError)

  await async_test(`root get sub`, () => sdk.api.endusers.getOne(subEnduser.id), passOnAnyResult)
  await async_test(`sub get sub`, () => sdkSub.api.endusers.getOne(subEnduser.id), passOnAnyResult)
  await async_test(`other sub get sub error`, () => sdkOtherSub.api.endusers.getOne(subEnduser.id), handleAnyError)
  await async_test(`subsub get sub error`, () => sdkSubSub.api.endusers.getOne(subEnduser.id), handleAnyError)

  await async_test(`root get subsub`, () => sdk.api.endusers.getOne(subSubEnduser.id), passOnAnyResult)
  await async_test(`sub get subsub`, () => sdkSub.api.endusers.getOne(subSubEnduser.id), passOnAnyResult)
  await async_test(`other sub get sub sub error`, () => sdkOtherSub.api.endusers.getOne(subSubEnduser.id), handleAnyError)
  await async_test(`subsub get subsub`, () => sdkSubSub.api.endusers.getOne(subSubEnduser.id), passOnAnyResult)

  await sdk.api.endusers.set_password({ id: rootEnduser.id, password })
  await enduserSDK.authenticate(rootEnduser.email!, password)
  await async_test(
    `root enduser create`, 
    () => enduserSDK.api.engagement_events.createOne({ significance: 1, type: 'test', enduserId: rootEnduser.id }), 
    { onResult: t => t.businessId === rootEnduser.businessId && !t.organizationIds?.length },
  )

  await async_test(`enduser cannot update organizationIds`, () => enduserSDK.api.endusers.updateOne(enduserSDK.userInfo.id, { organizationIds: [] }), handleAnyError)
  await async_test(`users cannot update organizationIds`, () => sdk.api.users.updateOne(sdk.userInfo.id, { organizationIds: [] }), handleAnyError)


  await sdk.api.endusers.set_password({ id: subEnduser.id, password })
  await enduserSDK.authenticate(subEnduser.email!, password)
  await async_test(
    `sub enduser create`, 
    () => enduserSDK.api.engagement_events.createOne({ significance: 1, type: 'test', enduserId: subEnduser.id }), 
    { onResult: t => t.businessId === rootEnduser.businessId && t.organizationIds?.length === 1 },
  )

  await sdk.api.endusers.set_password({ id: subSubEnduser.id, password })
  await enduserSDK.authenticate(subSubEnduser.email!, password)
  await async_test(
    `subSub enduser create`, 
    () => enduserSDK.api.engagement_events.createOne({ significance: 1, type: 'test', enduserId: subSubEnduser.id }), 
    { onResult: t => t.businessId === rootEnduser.businessId && t.organizationIds?.length === 2},
  )

  await sdk.api.endusers.updateOne(rootEnduser.id, { organizationIds: subEnduser.organizationIds })
  await async_test(`root get sub adjusted`, () => sdk.api.endusers.getOne(rootEnduser.id), passOnAnyResult)
  await async_test(`sub get sub adjusted`, () => sdkSub.api.endusers.getOne(rootEnduser.id), passOnAnyResult)
  await async_test(`other sub get sub adjusted error`, () => sdkOtherSub.api.endusers.getOne(rootEnduser.id), handleAnyError)
  await async_test(`subsub get sub adjusted error`, () => sdkSubSub.api.endusers.getOne(rootEnduser.id), handleAnyError)

  await async_test(
    `push behavior for organization ids (don't push by default)`, 
    () => sdk.api.endusers.updateOne(rootEnduser.id, { organizationIds: subEnduser.organizationIds }),
    { onResult: e => e.organizationIds?.length === subEnduser.organizationIds?.length },
  )
  await async_test(
    `push behavior for organization ids (replace working)`, 
    () => sdk.api.endusers.updateOne(rootEnduser.id, { organizationIds: subEnduser.organizationIds }, { replaceObjectFields: true }),
    { onResult: e => e.organizationIds?.length === subEnduser.organizationIds?.length },
  )

  await Promise.all([
    sdk.api.endusers.deleteOne(rootEnduser.id),
    sdk.api.endusers.deleteOne(subEnduser.id),
    sdk.api.endusers.deleteOne(subSubEnduser.id),
  ])
}

const sub_organization_enduser_tests = async() => {
  log_header("Sub Organizations (Enduser-Facing Tests)")

  await enduserSDK.register({ email: 'root@tellescope.com', password })
  await wait(undefined, 1000) // avoid rate limiting error
  await subEnduserSDK.register({ email: 'sub@tellescope.com', password })
  await wait(undefined, 1000) // avoid rate limiting error
  await enduserSDK.authenticate('root@tellescope.com', password)
  await wait(undefined, 1000) // avoid rate limiting error
  await subEnduserSDK.authenticate('sub@tellescope.com', password)

  assert(!enduserSDK.userInfo.organizationIds?.length, 'bad root organizationIds', 'root auth org ids')
  assert(subEnduserSDK.userInfo.organizationIds?.length === 1, 'bad sub organizationIds', 'sub auth org ids')

  const rootTicket = await enduserSDK.api.tickets.createOne({ title: 'root', enduserId: enduserSDK.userInfo.id })
  
  await async_test(`root get root`, () => sdk.api.endusers.getOne(enduserSDK.userInfo.id), passOnAnyResult)
  await async_test(`sub get root error`, () => sdkSub.api.endusers.getOne(enduserSDK.userInfo.id), handleAnyError)
  await async_test(`root get sub`, () => sdk.api.endusers.getOne(subEnduserSDK.userInfo.id), passOnAnyResult)
  await async_test(`sub get sub`, () => sdkSub.api.endusers.getOne(subEnduserSDK.userInfo.id), passOnAnyResult)
  await async_test(`root get root ticket`, () => sdk.api.tickets.getOne(rootTicket.id), passOnAnyResult)
  await async_test(`sub get root ticket error`, () => sdkSub.api.tickets.getOne(rootTicket.id), handleAnyError)

  await sdk.api.endusers.updateOne(enduserSDK.userInfo.id, { sharedWithOrganizations: [sdkSub.userInfo.organizationIds ?? []] })
  await enduserSDK.refresh_session() // ensure updated session includes new sharedWithOrganizations
  const rootTicketAfterUpdate = await enduserSDK.api.tickets.createOne({ title: 'root with shared', enduserId: enduserSDK.userInfo.id })

  await async_test(`root get root`, () => sdk.api.endusers.getOne(enduserSDK.userInfo.id), passOnAnyResult)
  await async_test(`sub get root after update`, () => sdkSub.api.endusers.getOne(enduserSDK.userInfo.id), passOnAnyResult)
  await async_test(`root get sub`, () => sdk.api.endusers.getOne(subEnduserSDK.userInfo.id), passOnAnyResult)
  await async_test(`sub get sub`, () => sdkSub.api.endusers.getOne(subEnduserSDK.userInfo.id), passOnAnyResult)
  await async_test(`root get root ticket after update`, () => sdk.api.tickets.getOne(rootTicketAfterUpdate.id), passOnAnyResult)
  await async_test(`sub get root ticket after update`, () => sdkSub.api.tickets.getOne(rootTicketAfterUpdate.id), passOnAnyResult)

  await Promise.all([
    sdk.api.endusers.deleteOne(enduserSDK.userInfo.id),
    sdk.api.endusers.deleteOne(subEnduserSDK.userInfo.id),
    sdk.api.tickets.deleteOne(rootTicket.id),
    sdk.api.tickets.deleteOne(rootTicketAfterUpdate.id),
  ])
}

const threadKeyTests = async () => {
  log_header("threadKey")
  const enduser = await sdk.api.endusers.createOne({ email: 'threadkeytests@tellescope.com' })
  const [e1, e2, e3] = await Promise.all([
    sdk.api.engagement_events.createOne({ enduserId: enduser.id, type: 'Type 1', significance: 5 }),
    sdk.api.engagement_events.createOne({ enduserId: enduser.id, type: 'Type 2', significance: 5 }),
    sdk.api.engagement_events.createOne({ enduserId: enduser.id, type: 'Type 3', significance: 5 }),
  ])
  await wait(undefined, 1000) // sort struggles when all 6 documents created in the same second
  const [e4, e5, e6] = await Promise.all([
    sdk.api.engagement_events.createOne({ enduserId: enduser.id, type: 'Type 1', significance: 5 }),
    sdk.api.engagement_events.createOne({ enduserId: enduser.id, type: 'Type 2', significance: 5 }),
    sdk.api.engagement_events.createOne({ enduserId: enduser.id, type: 'Type 3', significance: 5 }),
  ])

  let es = await sdk.api.engagement_events.getSome({ threadKey: 'type', sort: 'oldFirst' })
  assert(es.length === 3, 'threadKey got duplicates', 'threadKey no duplicates (length, old)')
  assert(new Set(es.map(e => e.type)).size === 3, 'threadKey got duplicates', 'threadKey no duplicates explicit')
  assert(es.find(e => e.id === e1.id) !== undefined, 'threadKey got duplicates', 'threadKey no duplicates (key 1, old)')
  assert(es.find(e => e.id === e2.id) !== undefined, 'threadKey got duplicates', 'threadKey no duplicates (key 2, old)')
  assert(es.find(e => e.id === e3.id) !== undefined, 'threadKey got duplicates', 'threadKey no duplicates (key 3, old)')

  es = await sdk.api.engagement_events.getSome({ threadKey: 'type', sort: 'newFirst' })
  assert(es.length === 3, 'threadKey got duplicates', 'threadKey no duplicates (length, new)')
  assert(new Set(es.map(e => e.type)).size === 3, 'threadKey got duplicates', 'threadKey no duplicates explicit')
  assert(es.find(e => e.id === e4.id) !== undefined, 'threadKey got duplicates', 'threadKey no duplicates (key 1, new)')
  assert(es.find(e => e.id === e5.id) !== undefined, 'threadKey got duplicates', 'threadKey no duplicates (key 2, new)')
  assert(es.find(e => e.id === e6.id) !== undefined, 'threadKey got duplicates', 'threadKey no duplicates (key 3, new)')

  // cleanup
  await sdk.api.endusers.deleteOne(enduser.id) // cleans up automatin events too
}

const badInputTests = async () => {
  log_header("Bad Input")
  await async_test(
    `_-prefixed fields are not allowed`, 
    () => sdk.api.endusers.createOne({ email: 'failure@tellescope.com', fields: { "_notallowed": 'hello' } }), 
    { shouldError: true, onError: e => e.message === "Error parsing field fields: Fields that start with '_' are not allowed" },
  )
  await async_test(
    `_-prefixed fields are not allowed`, 
    () => sdk.api.notes.createOne({ enduserId: PLACEHOLDER_ID, fields: { "_notallowed": 'hello' } }), 
    { shouldError: true, onError: e => e.message === "Error parsing field fields: Fields that start with '_' are not allowed" },
  )
}

const filterTests = async () => {
  log_header("Filter Tests")
  const enduser = await sdk.api.endusers.createOne({ email: 'filtertests@tellescope.com', fname: 'test', fields: { field1: 'value1', field2: 'value2' } })
  const otherEnduser = await sdk.api.endusers.createOne({ email: 'other@tellescope.com' })
  await async_test(
    `find enduser by filter`, 
    () => sdk.api.endusers.getSome({ filter: { email: 'filtertests@tellescope.com' }}), 
    { onResult: es => es.length === 1 && es[0].id === enduser.id },
  )
  await async_test(
    `find enduser by _exists filter`, 
    () => sdk.api.endusers.getSome({ filter: { fname: { _exists: true } }}), 
    { onResult: es => es.length === 1 && es[0].id === enduser.id },
  )
  await async_test(
    `find enduser by _exists filter (findOne)`, 
    // () => sdk.api.endusers.getOne({ fname: { _exists: true } }), 
    () => sdk.api.endusers.getOne({ fname: { _exists: true } }), 
    { onResult: e => e.id === enduser.id },
  )
  await async_test(
    `find enduser by compound filter`, 
    () => sdk.api.endusers.getSome({ filter: { email: 'filtertests@tellescope.com', fname: 'test' }}), 
    { onResult: es => es.length === 1 && es[0].id === enduser.id },
  )
  await async_test(
    `nothing found by invalid compound filter`, 
    () => sdk.api.endusers.getSome({ filter: { email: 'filtertests@tellescope.com', fname: 'nottest' }}), 
    { onResult: es => es.length === 0 },
  )
  await async_test(
    `nothing found for invalid filter`, 
    () => sdk.api.endusers.getSome({ filter: { email: 'doesnotexist@tellescope.com' }}), 
    { onResult: es => es.length === 0 },
  )
  await async_test(
    `find enduser by nested filter`, 
    () => sdk.api.endusers.getSome({ filter: { fields: { field1: 'value1' } } }), 
    { onResult: es => es.length === 1 && es[0].id === enduser.id },
  )
  await async_test(
    `nothing found by invalid nested filter`, 
    () => sdk.api.endusers.getSome({ filter: { fields: { field1: 'not a nested field value' } }}), 
    { onResult: es => es.length === 0 },
  )
  await async_test(
    `find enduser by compound nested filter`, 
    () => sdk.api.endusers.getSome({ filter: { fields: { field1: 'value1', field2: 'value2' } } }), 
    { onResult: es => es.length === 1 && es[0].id === enduser.id },
  )
  await async_test(
    `nothing found by compound invalid nested filter`, 
    () => sdk.api.endusers.getSome({ filter: { fields: { field1: 'not a nested field value', field2: 'value2' } }}), 
    { onResult: es => es.length === 0 },
  )
  await async_test(
    `find enduser by compound nested filter with non-nested field as well`, 
    () => sdk.api.endusers.getSome({ filter: {email: 'filtertests@tellescope.com', fields: { field1: 'value1', field2: 'value2' } } }), 
    { onResult: es => es.length === 1 && es[0].id === enduser.id },
  )
  await async_test(
    `nothing found for compound nested filter with non-nested field as well`, 
    () => sdk.api.endusers.getSome({ filter: {email: 'doesnotexist@tellescope.com', fields: { field1: 'value1', field2: 'value2' } } }), 
    { onResult: es => es.length === 0 },
  )

  await sdk.api.endusers.deleteOne(enduser.id)
  await sdk.api.endusers.deleteOne(otherEnduser.id)
}

const updatesTests = async () => {
  log_header("Updates Tests")
  const enduser = await sdk.api.endusers.createOne({ email: 'test@tellescope.com', phone: '+15555555555' })
  await sdk.api.endusers.updateOne(enduser.id, { phone: '+15555555552' }) // update to new phone number 
  await sdk.api.endusers.updateOne(enduser.id, { phone: '+15555555552' }) // update to same phone number
  assert(!!enduser, '', 'Updated phone number')

  await sdk.api.endusers.deleteOne(enduser.id)
}

const generate_user_auth_tests = async () => {
  log_header("Generated User/Enduser authToken")

  // test authenticating user, rest of tests should pass as normal now
  const info = await sdk.api.users.generate_auth_token({ id: sdk.userInfo.id })
  sdk.authToken = info.authToken; 
  sdk.userInfo  = info.user as any;

  const externalId = '1029f9v9sjd0as'
  const e = await sdk.api.endusers.createOne({ email: 'generated@tellescope.com', phone: '+15555555555', externalId })

  const { authToken, enduser } = await sdk.api.users.generate_auth_token({ id: e.id })
  if (!enduser) throw new Error("Didn't get enduser when generate_auth_token called")
  assert(!!authToken && !!enduser, 'invalid returned values', 'Generate authTokea and get enduser')
  let { isAuthenticated } = await sdk.api.endusers.is_authenticated({ id: enduser.id, authToken })
  assert(isAuthenticated, 'invalid authToken generated for enduser', 'Generate authToken for enduser is valid')
  assert(
    (await sdk.api.endusers.is_authenticated({ authToken })).isAuthenticated,
    'id omitted results in failed authentication',
    'id optional for is_authenticated'
  )
  let withDurationResult = await sdk.api.endusers.generate_auth_token({ id: e.id, durationInSeconds: 1000 })
  assert(!!withDurationResult, 'no result for id with duration', 'id with duration')

  const { authToken: authTokenUID, enduser: enduser2 } = await sdk.api.endusers.generate_auth_token({ externalId })
  assert(!!authTokenUID && !!enduser2, 'invalid returned values eid', 'Generate authToken and get enduser eid')
  assert((
    await sdk.api.endusers.is_authenticated({ id: enduser2.id, authToken: authTokenUID })).isAuthenticated, 
    'invalid authToken generated for enduser', 'Generate authToken for enduser is valid'
  )
  withDurationResult = await sdk.api.endusers.generate_auth_token({ externalId, durationInSeconds: 1000  })
  assert(!!withDurationResult, 'no result for externalId with duration', 'externalId with duration')

  await async_test(
    `auth by externalId`, () => sdk.api.endusers.generate_auth_token({ externalId: e.externalId }), passOnVoid,
  ) 
  await async_test(
    `auth by email`, () => sdk.api.endusers.generate_auth_token({ email: e.email }), passOnVoid,
  ) 
  await async_test(
    `auth by phone`, () => sdk.api.endusers.generate_auth_token({ phone: e.phone }), passOnVoid,
  ) 
  await async_test(
    `auth by nothing throws error`, () => sdk.api.endusers.generate_auth_token({ phone: undefined }), 
    { shouldError: true, onError: e => e.message === "One of id, externalId, email, or phone is required" },
  ) 
  await async_test(
    `auth by bad field throws error`, () => sdk.api.endusers.generate_auth_token({ email: "notavalidemail@tellescope.com" }), 
    { shouldError: true, onError: e => e.message === "Could not find a corresponding enduser" },
  ) 

  await sdk.api.endusers.deleteOne(enduser.id)
}

const generateEnduserAuthTests = async () => {
  log_header("Generated Enduser authToken")
  const externalId = '1029f9v9sjd0as'
  const e = await sdk.api.endusers.createOne({ email: 'generated@tellescope.com', phone: '+15555555555', externalId })

  const { authToken, enduser } = await sdk.api.endusers.generate_auth_token({ id: e.id })
  assert(!!authToken && !!enduser, 'invalid returned values', 'Generate authToken and get enduser')
  let { isAuthenticated } = await sdk.api.endusers.is_authenticated({ id: enduser.id, authToken })
  assert(isAuthenticated, 'invalid authToken generated for enduser', 'Generate authToken for enduser is valid')
  assert(
    (await sdk.api.endusers.is_authenticated({ authToken })).isAuthenticated,
    'id omitted results in failed authentication',
    'id optional for is_authenticated'
  )
  let withDurationResult = await sdk.api.endusers.generate_auth_token({ id: e.id, durationInSeconds: 1000 })
  assert(!!withDurationResult, 'no result for id with duration', 'id with duration')

  const { authToken: authTokenUID, enduser: enduser2 } = await sdk.api.endusers.generate_auth_token({ externalId })
  assert(!!authTokenUID && !!enduser2, 'invalid returned values eid', 'Generate authToken and get enduser eid')
  assert((
    await sdk.api.endusers.is_authenticated({ id: enduser2.id, authToken: authTokenUID })).isAuthenticated, 
    'invalid authToken generated for enduser', 'Generate authToken for enduser is valid'
  )
  withDurationResult = await sdk.api.endusers.generate_auth_token({ externalId, durationInSeconds: 1000  })
  assert(!!withDurationResult, 'no result for externalId with duration', 'externalId with duration')

  await async_test(
    `auth by externalId`, () => sdk.api.endusers.generate_auth_token({ externalId: e.externalId }), passOnVoid,
  ) 
  await async_test(
    `auth by email`, () => sdk.api.endusers.generate_auth_token({ email: e.email }), passOnVoid,
  ) 
  await async_test(
    `auth by phone`, () => sdk.api.endusers.generate_auth_token({ phone: e.phone }), passOnVoid,
  ) 
  await async_test(
    `auth by nothing throws error`, () => sdk.api.endusers.generate_auth_token({ phone: undefined }), 
    { shouldError: true, onError: e => e.message === "One of id, externalId, email, or phone is required" },
  ) 
  await async_test(
    `auth by bad field throws error`, () => sdk.api.endusers.generate_auth_token({ email: "notavalidemail@tellescope.com" }), 
    { shouldError: true, onError: e => e.message === "Could not find a corresponding enduser" },
  ) 

  await sdk.api.endusers.deleteOne(enduser.id)
}

const instanceForModel = <N extends ModelName, T=ClientModelForName[N], REQ=ClientModelForName_required[N]>(model: Model<T, N>, i=0) => {
  const instance = {} as Indexable
  const updates = {} as Indexable
  const filter = {} as Indexable

  for (const k in model.fields) {
    if (model.fields[k].readonly) continue

    if ((model.fields[k]?.examples?.length ?? 0) > i) {
      instance[k] = model.fields[k]?.examples?.[i]

      if (model?.readFilter?.[k]) {
        filter[k] = model.fields[k]?.examples?.[i]
      }

      if (model?.fields?.[k].updatesDisabled !== true) {
        updates[k] = model.fields[k]?.examples?.[i]
      }
    }
  }
  return { instance, updates, filter } as { instance: REQ & Partial<T>, updates: Partial<T>, filter: Partial<T> }
}

const has_required_field = <T>(fields: ModelFields<T>) => Object.values(fields).find((f: any) => f.required === true) !== undefined

interface GeneratedTest <N extends ModelName, T = ClientModelForName[N]> {
  queries: APIQuery<N>,
  model: Model<T, N>, 
  name: ModelName,
  returns: {
    create?: ModelFields<T>,
  }
}

const verify_missing_defaults = async <N extends ModelName>({ queries, model, name }: GeneratedTest<N>) => {
  const queryForOperation: { [O in Operation]: () => Promise<any> } = {
    create: () => queries.createOne({} as any),
    createMany: () => queries.createSome([{} as any, {} as any]),
    read: () => queries.getOne('fakeid'),
    readMany: () => queries.getSome(),
    update: () => queries.updateOne('fakeid', {} as any),
    delete: () => queries.deleteOne('fakeid'),
  }

  let o: Operation
  for (o in DEFAULT_OPERATIONS) {
    if (Object.keys(model.defaultActions).includes(o) || model.customActions[o]) continue // action is implemented

    await async_test(
      `${o} unavailable for ${name}`,
      () => queryForOperation[o](), 
      { shouldError: true, onError: e => e.message === 'This action is not allowed' || e.message === 'Inaccessible' },
    )
  }
}

// const validator_to_boolean = <T>(v: EscapeFunction<T>) => (i: JSONType) => {
//   try {
//     v(i)
//     return true
//   } catch(err) {
//     console.error(err)
//     return false
//   }
// }
// const isMongoId = validator_to_boolean(mongoIdValidator())

type DefaultValidation = InputValidationOld<{ _default: boolean, id: string }>
const validateReturnType = <N extends ModelName, T=ClientModelForName[N]>(fs: ModelFields<T> | undefined, r: T, d: DefaultValidation) => {
  const validation = fieldsToValidationOld(fs ?? {} as Indexable)

  try {
    for (const f in r) {
      (validation[f] || d._default)(r[f as keyof typeof r] as any)
    }
    return true
  } catch(err) {
    console.error(err)
    return false
  }
}

let defaultEnduser = undefined as Enduser | undefined
const run_generated_tests = async <N extends ModelName>({ queries, model, name, returns } : GeneratedTest<N>) => {
  if (
    name === 'post_likes' 
  || name === 'users'
  || name === 'integrations'
  || name === 'databases'
  || name === 'database_records'
  || name === 'phone_calls'
  || name === 'analytics_frames'
  || name === 'superbills'
  || name === 'webhooks'
  || name === 'integration_logs' // readonly
  || name === 'automated_actions' // might process in background and cause false failure
  || name === 'waitlists' // while waitlist updates are not stored in logs
  ) return 
  if (!defaultEnduser) defaultEnduser = await sdk.api.endusers.createOne({ email: 'default@tellescope.com', phone: "5555555555"  })

  const { instance, updates, filter } = instanceForModel(model) 
  if ((instance as Indexable).enduserId) (instance as Indexable).enduserId = (defaultEnduser as Indexable).id
  if ((updates as Indexable).enduserId) (updates as Indexable).enduserId = (defaultEnduser as Indexable).id

  let _id = ''
  const safeName = url_safe_path(name)
  const singularName = safeName.substring(0, safeName.length - 1)

  await verify_missing_defaults({ queries, model, name, returns })

  // only validate id for general objects, for now
  const defaultValidation: DefaultValidation = { 
    id: mongoIdStringRequired.validate(), _default: x => x,
  }
                   

  // If no create, cannot test get, update, or delete
  if (!(model.defaultActions.create || model.customActions.create)) return
  
  if (has_required_field(model.fields)) {
    await async_test(
      `create-${singularName} (missing a required field)`,
      () => queries.createOne({} as any), 
      { shouldError: true, onError: e => e.message.endsWith('is required') || e.message.includes('Value not provided') },
    )
  }
  
  await async_test(
    `create-${singularName}`, 
    () => queries.createOne(instance), 
    { onResult: r => !!(_id = r.id) && (name === 'api_keys' || !!r.creator) && validateReturnType(returns.create, r, defaultValidation) }
  )
  await wait(undefined, 25)
  await async_test(
    `log-${singularName} create`, 
    () => sdk.api.user_logs.getOne({ resourceId: _id, resource: name, action: 'create' }), 
    { onResult: r => r && r.userId === sdk.userInfo.id }
  )

  if (model.defaultActions.update) {
    await async_test(
      `update-${singularName}`, 
      () => queries.updateOne(_id, updates, { replaceObjectFields: true }), 
      { onResult: u => typeof u === 'object' && u.id === _id }
    )
    await wait(undefined, 25)
    await async_test(
      `log-${singularName} update`, 
      () => sdk.api.user_logs.getOne({ resourceId: _id, resource: name, action: 'update' }), 
      { onResult: r => r && r.userId === sdk.userInfo.id }
    )
  }
  await async_test(
    `get-${singularName}`, 
    () => queries.getOne(_id), 
    { onResult: d => {
        if (!d?.id) return false

        for (const k in instance) {
          // @ts-ignore
          if (!objects_equivalent(instance[k], d[k as keyof typeof d])) return false
        }
        return true
      }
    } 
  )
  await async_test(
    `get-${safeName}`, 
    () => queries.getSome({ filter }), 
    { onResult: ([d, /*...others */]) => {
        // if (others.length !== 0) return false // some collections are not reset during testing, like API keys
        if (!d?.id) return false

        for (const k in instance) {
          // @ts-ignore
          if (!objects_equivalent(instance[k], d[k as keyof typeof d])) return false
        }
        return true
      }
    } 
  )

  await async_test(
    `delete-${singularName}`, 
    () => queries.deleteOne(_id), 
    passOnVoid
  )
  await wait(undefined, 25)
  await async_test(
    `get-${singularName} (verify delete)`, 
    () => queries.getOne(_id), 
    { shouldError: true, onError: e => e.message === 'Could not find a record for the given id' } 
  )

  // lots of side effects
  if (name === 'endusers') {
    await wait(undefined, 100)
  } else {
    await wait(undefined, 50)
  }
  await async_test(
    `log-${singularName} delete`, 
    () => sdk.api.user_logs.getOne({ resourceId: _id, resource: name, action: 'delete' }), 
    { onResult: r => r && r.userId === sdk.userInfo.id }
  )
}

const enduser_tests = async (queries=sdk.api.endusers) => {
  log_header("Enduser")
  
  const e1 = await queries.createOne({ email: 'test1@gmail.com', phone: '+14155555500' })
  const e2 = await queries.createOne({ email: 'test2@gmail.com', phone: '+14155555501' })

  await enduserSDK.register({ email: 'test3@gmail.com', password: "testenduserpassword" })
  await async_test(
    `get-enduser registered`,
    () => queries.getOne({ email: 'test3@gmail.com' }), 
    { onResult: e => !!e },
  )
  await async_test(
    `enduser registered can log in`,
    () => enduserSDK.authenticate('test3@gmail.com', 'testenduserpassword'), 
    { onResult: e => !!e.authToken && e.enduser.email === 'test3@gmail.com' },
  )

  await async_test(
    `update-enduser email conflict`, 
    () => queries.updateOne(e1.id ?? '', { email: e2.email }), 
    { shouldError: true, onError: () => true }
  )
  // no longer restricted
  // await async_test(
  //   `update-enduser phone conflict`, 
  //   () => queries.updateOne(e1.id ?? '', { phone: e2.phone }), 
  //   { shouldError: true, onError: () => true }
  // )
  await async_test(
    `update-enduser email and phone conflict`, 
    () => queries.updateOne(e1.id ?? '', { email: e2.email, phone: e2.phone }), 
    { shouldError: true, onError: () => true }
  )
  await async_test(
    `update-enduser working`, 
    () => queries.updateOne(e1.id ?? '', { email: 'edited' + e1.email }), 
    passOnVoid,
  )

  await async_test(
    `update-enduser test replaceObjectFields 1`,
    () => queries.updateOne(e1.id ?? '', { fields: { field1: '1'} }), 
    passOnVoid,
  )
  await async_test(
    `get-enduser test replaceObjectFields verify 1`,
    () => queries.getOne(e1.id ?? ''), 
    { onResult: e => e.fields?.field1 === '1' },
  )
  
  await async_test(
    `update-enduser test replaceObjectFields 2`,
    () => queries.updateOne(e1.id ?? '', { fields: { field2: '2'} }), 
    passOnVoid,
  )
  await async_test(
    `get-enduser test replaceObjectFields verify 2`,
    () => queries.getOne(e1.id ?? ''), 
    { onResult: e => e.fields?.field1 === '1' && e.fields?.field2 === '2' },
  )

  await async_test(
    `update-enduser test replaceObjectFields true 1`,
    () => queries.updateOne(e1.id ?? '', { fields: { field2: '_2'} }, { replaceObjectFields: true }), 
    passOnVoid,
  )
  await async_test(
    `get-enduser test replaceObjectFields verify true 1`,
    () => queries.getOne(e1.id ?? ''), 
    { onResult: e => e.fields?.field1 === undefined && e.fields?.field2 === '_2' },
  )

  await async_test(
    `update-enduser test replaceObjectFields true unset`,
    () => queries.updateOne(e1.id ?? '', { fields: { } }, { replaceObjectFields: true }), 
    passOnVoid,
  )
  await async_test(
    `get-enduser test replaceObjectFields verify true unset`,
    () => queries.getOne(e1.id ?? ''), 
    { onResult: e => objects_equivalent(e.fields, {}) },
  )

  const eToDup1: Partial<Enduser> = { email: 'dup1@tellescope.com' }
  const eToDup2: Partial<Enduser> = { email: 'dup2@tellescope.com' }
  await queries.createOne(eToDup1)
  await queries.createOne(eToDup2)
  await async_test(
    `create-many-endusers - all conflict (1)`, 
    () => queries.createSome([eToDup1]), 
    { shouldError: true, onError: e => e.message === 'Uniqueness Violation' }
  )
  await async_test(
    `create-many-endusers - all conflict (2)`, 
    () => queries.createSome([eToDup1, eToDup2]), 
    { shouldError: true, onError: e => e.message === 'Uniqueness Violation' }
  )
  await async_test(
    `create-many-endusers - multiple email conflict`,
    () => queries.createSome([eToDup1, eToDup2, { email: "unique@tellescope.com"}]), 
    { onResult: ({ created, errors }) => created.length === 1 && errors.length === 2 }
  )
  await async_test(
    `create-many-endusers - create conflict, one unique`, 
    () => queries.createSome([{ email: 'd1@tellescope.com'}, { email: 'd1@tellescope.com'}, { email: 'd1@tellescope.com'}]), 
    { onResult: ({ created, errors }) => created.length === 1 && errors.length === 2 }
  )
  await async_test(
    `create-many-endusers - create conflict, two unique`, 
    () => queries.createSome([{ email: 'd2@tellescope.com'}, { email: 'd2@tellescope.com'}, { email: 'createme@tellescope.com' }]), 
    { onResult: ({ created, errors }) => created.length === 2 && errors.length === 1 }
  )
}

const api_key_tests = async () => { }
const engagement_tests = async () => { }
const journey_tests = async (queries=sdk.api.journeys) => { 
  await async_test(
    `create-journey - states missing defaultState`, 
    () => queries.createOne({ title: 'Error', defaultState: 'default', states: [{ name: 'not-default', priority: 'N/A' }]  }), 
    { shouldError: true, onError: e => e.message === 'defaultState does not exist in states' }
  )
  await async_test(
    `create-journey - duplicate states`, 
    () => queries.createOne({ title: 'Error', defaultState: 'default', states: [{ name: 'default', priority: 'N/A' }, { name: 'default', priority: 'N/A' }] }), 
    { shouldError: true, onError: e => e.message === 'Uniqueness Violation' }
  )

  const journey = await sdk.api.journeys.createOne({ title: 'Test Journey' })
  const journey2 = await sdk.api.journeys.createOne({ title: 'Test Journey 2' })

  await sdk.api.journeys.updateOne(journey.id, { 
    states: [
      { name: 'Delete Me 1', priority: 'N/A' },
      { name: 'Delete Me 2', priority: 'N/A' },
    ] 
  })
  const updated = (await sdk.api.journeys.delete_states({ id: journey.id, states: ['Delete Me 1', 'Delete Me 2']})).updated
  assert(!!updated.id && updated.states.length === 1 && updated.states[0].name === 'New', 'delete states fail on returned update', 'delete states returns updated value')

  const fetchAfterDeletion = await sdk.api.journeys.getOne(journey.id)
  assert(fetchAfterDeletion.states.length === 1 && fetchAfterDeletion.states[0].name === 'New', 'delete states fail', 'delete states worked')

  assert(journey.defaultState === 'New', 'defaultState not set on create', 'journey-create - defaultState initialized')
  assert(journey.states[0].name === 'New', 'defaultState not set on create', 'journey-create - states initialized')

  await sdk.api.journeys.updateOne(journey.id, { states: [{ name: 'ToDuplicate', priority: "N/A" }] })
  let withAddedState = await sdk.api.journeys.getOne(journey.id)
  assert(
    withAddedState.states.length === 2 && withAddedState.states.find(s => s.name === 'ToDuplicate') !== undefined, 
    'new state added', 'journey-update - push state change'
  )

  await async_test(
    `create-journey - add duplicate state`, 
    () => sdk.api.journeys.updateOne(journey.id, { states: [{ name: 'ToDuplicate', priority: "N/A" }] }), 
    { shouldError: true, onError: e => e.message === 'Uniqueness Violation' }
  )
  await async_test(
    `create-journey - add duplicate states in update`, 
    () => sdk.api.journeys.updateOne(journey.id, { states: [{ name: 'DuplicateUpdate', priority: "N/A" }, { name: 'DuplicateUpdate', priority: "N/A" }] }), 
    { shouldError: true, onError: e => e.message === 'Uniqueness Violation' }
  )
  
  await sdk.api.journeys.updateOne(journey.id, { defaultState: 'Added', states: [{ name: 'Added', priority: "N/A" }, { name: "Other", priority: "N/A" }] }, { replaceObjectFields: true })
  withAddedState = await sdk.api.journeys.getOne(journey.id)
  assert(
    withAddedState.states.length === 2 && withAddedState.states.find(s => s.name === 'Added') !== undefined
      && withAddedState.defaultState === 'Added',
    'duplicate state not added', 'journey-update - replace states'
  )

  await async_test(
    `journey-update - states replace with missing default`, 
    () => queries.updateOne(journey.id, { states: [{ name: 'Not Default', priority: "N/A" }]  }, { replaceObjectFields: true }), 
    { shouldError: true, onError: e => e.message === 'defaultState does not exist in states' }
  )

  const e1 = await sdk.api.endusers.createOne({ email: 'journeyunset1@tellescope.com', journeys: { [journey.id]: 'Added' } })
  const e2 = await sdk.api.endusers.createOne({ email: 'journeyunset2@tellescope.com', journeys: { [journey.id]: 'Added', [journey2.id]: 'New' } })

  await async_test(
    `create-enduser - invalid journey id`, 
    () => sdk.api.endusers.createOne({ email: 'journeyunset3@tellescope.com', journeys: { [e1.id]: 'Added' } }), 
    { shouldError: true, onError: e => e.message === 'Could not find a related record for the given id(s)' }
  )
  await async_test(
    `update-enduser - invalid journey id`, 
    () => sdk.api.endusers.updateOne(e1.id, { journeys: { [e1.id]: 'Added' } }), 
    { shouldError: true, onError: e => e.message === 'Could not find a related record for the given id(s)' }
  )
  await async_test(
    `update-enduser - one invalid journey id`, 
    () => sdk.api.endusers.updateOne(e1.id, { journeys: { [journey.id]: 'Added', [e1.id]: 'Added' } }), 
    { shouldError: true, onError: e => e.message === 'Could not find a related record for the given id(s)' }
  )

  await sdk.api.endusers.updateOne(e1.id, { journeys: { [journey.id]: 'Other' } }) // valid state change
  await sdk.api.endusers.updateOne(e1.id, { journeys: { [journey.id]: 'Added' } }) // change back
  await wait(undefined, 25) // wait for side effects to add engagement
  let engagement = await sdk.api.engagement_events.getSome()
  assert(engagement.filter(e => e.enduserId === e1.id && e.type === "STATE_CHANGE").length === 2, 
    'STATE_CHANGE engagement not tracked', 
    'Update enduser tracks state changes'
  )

  const es = (
    await sdk.api.endusers.createSome([ { email: "1@tellescope.com", journeys: { [journey.id]: 'Added' } }, { email: "2@tellescope.com", journeys: { [journey.id]: 'Added' } } ])
  ).created
  engagement = await sdk.api.engagement_events.getSome()
  assert(engagement.filter(e => e.enduserId === es[0].id && e.type === "JOURNEY_SET").length === 1, 
    'JOURNEY_SET engagement not tracked', 
    'Create endusers tracks engagement events (1)'
  )
  assert(engagement.filter(e => e.enduserId === es[1].id && e.type === "JOURNEY_SET").length === 1, 
    'JOURNEY_SET engagement not tracked', 
    'Create endusers tracks engagement events (2)'
  )
  

  await queries.updateOne(journey.id, { states: [{ name: 'First', priority: "N/A" }, { name: 'Added', priority: "N/A" }]  }, { replaceObjectFields: true })
  await async_test(
    `journey-update - insert new state at front`, 
    () => queries.getOne(journey.id), 
    { onResult: j => objects_equivalent(j.states, [{ name: 'First', priority: "N/A" }, { name: 'Added', priority: "N/A" }])}
  )

  // removed
  // await async_test(
  //   `journey-updateState`, 
  //   () => queries.update_state({ id: journey.id, name: 'Added', updates: { name: 'Updated', priority: 'N/A' }}),
  //   passOnVoid,
  // )
  // await wait(undefined, 25) // wait for side effects to update endusers
  // await async_test(
  //   `journey-updateState verify propagation to enduser 1`, 
  //   () => sdk.api.endusers.getOne(e1.id),
  //   { onResult: e => objects_equivalent(e.journeys, { [journey.id]: 'Updated' })},
  // )
  // await async_test(
  //   `journey-updateState verify propagation to enduser 2`, 
  //   () => sdk.api.endusers.getOne(e2.id),
  //   { onResult: e => objects_equivalent(e.journeys, { [journey.id]: 'Updated', [journey2.id]: 'New' })},
  // )


  await queries.deleteOne(journey.id)
  await wait(undefined, 25) // wait for side effects to update endusers
  await async_test(
    `journey-delete - corresponding enduser journeys are unset 1`, 
    () => sdk.api.endusers.getOne(e1.id), 
    { onResult: e => objects_equivalent(e.journeys, {}) }
  )
  await async_test(
    `journey-delete - corresponding enduser journeys are unset, others left`, 
    () => sdk.api.endusers.getOne(e2.id), 
    { onResult: e => objects_equivalent(e.journeys, { [journey2.id]: 'New' }) }
  )
}

const email_tests = async (queries=sdk.api.emails) => { 
  const me = await sdk.api.endusers.createOne({ email: 'sebass@tellescope.com' })
  const meNoEmail = await sdk.api.endusers.createOne({ phone: "4444444444" })
  const meNoConsent = await sdk.api.endusers.createOne({ email: 'sebass22@tellescope.com', emailConsent: false })

  const testEmail = {
    logOnly: true, // change to false to test real email sending
    enduserId: me.id,
    subject: "Test Email",
    textContent: "This is at est email"
  }

  await async_test(
    `send-email - missing email`, 
    () => queries.createOne({ ...testEmail, enduserId: meNoEmail.id, logOnly: false }), // constraint ignored when logOnly is true
    { shouldError: true, onError: e => e.message === "Missing email" }
  )
  // await async_test(
  //   `send-email - missing consent`, 
  //   () => queries.createOne({ ...testEmail, enduserId: meNoConsent.id, logOnly: false }), // constraint ignored when logOnly is true
  //   { shouldError: true, onError: e => e.message === "Missing email consent" }
  // )
  // await async_test(
  //   `send-email - missing consent (multiple)`, 
  //   () => queries.createSome([{ ...testEmail, enduserId: meNoConsent.id, logOnly: false }, { ...testEmail, enduserId: meNoConsent.id, logOnly: false }]), // constraint ignored when logOnly is true
  //   { shouldError: true, onError: e => e.message === "Missing email consent" }
  // )


  await async_test(
    `send-email`, 
    () => queries.createOne(testEmail), 
    { onResult: t => !!t }
  )
  testEmail.subject = "Test Email (Multi-Send)"
  testEmail.textContent = "Multiple content"
  await async_test(
    `send-email (multiple)`, 
    () => queries.createSome([ testEmail, testEmail, testEmail ]), 
    { onResult: t => !!t }
  )

  await sdk.api.endusers.deleteOne(me.id)
  await sdk.api.endusers.deleteOne(meNoEmail.id)
  await sdk.api.endusers.deleteOne(meNoConsent.id)
}

const sms_tests = async (queries=sdk.api.sms_messages) => { 
  const me = await sdk.api.endusers.createOne({ phone: '14152618149' })
  const meNoPhone = await sdk.api.endusers.createOne({ email: "sebassss@tellescope.com" })
  const meNoConsent = await sdk.api.endusers.createOne({ phone: '4444444444', phoneConsent: false })
  
  const testSMS = {
    logOnly: true, // change to false to test real email sending
    enduserId: me.id,
    message: "Test SMS",
  }

  // await async_test(
  //   `send-sms - blank message`, 
  //   () => queries.createOne({ ...testSMS, message: '' }), // constraint ignored when logOnly is true
  //   { shouldError: true, onError: e => e.message === "message must not be blank" }
  // )

  await async_test(
    `send-sms - missing phone`, 
    () => queries.createOne({ ...testSMS, enduserId: meNoPhone.id, logOnly: false }), // constraint ignored when logOnly is true
    { shouldError: true, onError: e => e.message === "Missing phone" }
  )
  // await async_test(
  //   `send-sms - missing phone consent`, 
  //   () => queries.createOne({ ...testSMS, enduserId: meNoConsent.id, logOnly: false }), // constraint ignored when logOnly is true
  //   { shouldError: true, onError: e => e.message === "Missing phone consent" }
  // )
  // await async_test(
  //   `send-sms - missing phone (multiple)`, 
  //   () => queries.createSome([{ ...testSMS, enduserId: meNoPhone.id, logOnly: false }, { ...testSMS, enduserId: meNoPhone.id, logOnly: false }]),
  //   { shouldError: true, onError: e => e.message === "Missing phone" }
  // )

  await async_test(
    `send-sms`, 
    () => queries.createOne(testSMS), 
    { onResult: t => !!t }
  )
  testSMS.message = "(Multi-Send)" // sending 3 or more will exceed rate limit of 3-per-3 seconds
  await async_test(
    `send-sms (multiple)`, 
    () => queries.createSome([ testSMS, testSMS ]), 
    { onResult: t => !!t }
  )

  await sdk.api.endusers.deleteOne(me.id)
  await sdk.api.endusers.deleteOne(meNoPhone.id)
  await sdk.api.endusers.deleteOne(meNoConsent.id)
}

const chat_room_tests = async () => {
  log_header("Chat Room Tests")
  const sdk2 = new Session({ host })
  await sdk2.authenticate(nonAdminEmail, nonAdminPassword) // non-admin has access restrictions we want to test 
  await sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword) 

  const email='enduser@tellescope.com', password='enduserPassword!';
  const enduser = await sdk.api.endusers.createOne({ email })
  await sdk.api.endusers.set_password({ id: enduser.id, password }).catch(console.error)
  await enduserSDK.authenticate(email, password).catch(console.error) 

  const enduserLoggedIn = await sdk.api.endusers.getOne(enduser.id)
  assert(new Date(enduserLoggedIn.lastActive).getTime() > Date.now() - 100, 'lastActive fail for enduser', 'lastActive for enduser')

  const room = await sdk.api.chat_rooms.createOne({ type: 'internal', userIds: [userId], enduserIds: [enduserSDK.userInfo.id] })
  assert(room.numMessages === 0, 'num mesages no update', 'num messages on creation')
  await async_test(
    `get-chat-room (not a user)`, 
    () => sdk2.api.chat_rooms.getOne(room.id), 
    { shouldError: true, onError: e => e.message === "Could not find a record for the given id" }
  )
  // await async_test(
  //   `user_display_info for room (not a user)`, 
  //   () => sdk2.api.chat_rooms.display_info({ id: room.id }), 
  //   { shouldError: true, onError: e => e.message === "Could not find a record for the given id" }
  // )

  await sdk.api.chats.createOne({ roomId: room.id, message: 'test message', attachments: [{ type: 'file', secureName: 'testsecurename'}] })
  let roomWithMessage = await sdk.api.chat_rooms.getOne(room.id)
  assert(roomWithMessage.numMessages === 1, 'num mesages no update', 'num messages on send message')
  assert((roomWithMessage?.recentMessageSentAt ?? 0) > Date.now() - 1000, 'recent message timestamp bad', 'recent message timestamp')
  assert(!roomWithMessage?.infoForUser?.[userId]?.unreadCount, 'bad unread count for user', 'unread count for user')
  assert(roomWithMessage?.infoForUser?.[enduserSDK.userInfo.id]?.unreadCount === 1, 'bad unread count for enduser', 'unread count for enduser')

  roomWithMessage = await sdk.api.chat_rooms.updateOne(roomWithMessage.id, { infoForUser: { [userId]: { unreadCount: 0 }}})
  assert(roomWithMessage?.infoForUser?.[userId]?.unreadCount === 0, 'bad reset unread count for user', 'reset unread count for user')

  // todo: enable this test when createMany allowed for messages
  // await sdk.api.chats.createSome([{ roomId: room.id, message: 'test message 3' }, { roomId: room.id, message: 'test message 3' }])
  // roomWithMessage = await sdk.api.chat_rooms.getOne(room.id)
  // assert(roomWithMessage.numMessages === 3, 'num mesages no update', 'num messages on send messages')

  const verifyRoomDisplayInfo = (info: Indexable<UserDisplayInfo>) => {
    if (!info) return false
    if (typeof info !== 'object') return false
    if (Object.keys(info).length !== 2) return false
    if (!info[sdk.userInfo.id]) return false
    if (!info[enduserSDK.userInfo.id]) return false
    const [user, enduser] = [info[sdk.userInfo.id], info[enduserSDK.userInfo.id]]
    if (!(
      user.id === sdk.userInfo.id &&
      user.fname === sdk.userInfo.fname &&
      user.lname === sdk.userInfo.lname &&
      user.avatar === sdk.userInfo.avatar &&
      !!user.createdAt &&
      !!user.lastActive &&
      !!user.lastLogout 
    )) return false
    if (!(
      enduser.id === enduserSDK.userInfo.id &&
      enduser.fname === enduserSDK.userInfo.fname &&
      enduser.lname === enduserSDK.userInfo.lname &&
      enduser.avatar === enduserSDK.userInfo.avatar &&
      !!enduser.createdAt &&
      !!enduser.lastActive &&
      !!enduser.lastLogout 
    )) return false
    return true
  }
  await async_test(
    `user_display_info for room (for user)`, 
    () => sdk.api.chat_rooms.display_info({ id: room.id }), 
    { onResult: r => r.id === room.id && verifyRoomDisplayInfo(r.display_info) }
  )
  await async_test(
    `user_display_info for room (for enduser)`, 
    () => enduserSDK.api.chat_rooms.display_info({ id: room.id }), 
    { onResult: r => r.id === room.id && verifyRoomDisplayInfo(r.display_info) }
  )
  await async_test(
    "non admin can't get room without enduser",
    () => sdkNonAdmin.api.chat_rooms.getOne({ id: room.id }),
    handleAnyError
  )
  await async_test(
    "non admin can't get chats from room without enduser",
    () => sdkNonAdmin.api.chats.getSome({ filter: { roomId: room.id } }),
    handleAnyError
  )
  await sdk.api.endusers.updateOne(enduser.id, { assignedTo: [sdkNonAdmin.userInfo.id] })
  await async_test(
    "non admin can get room with enduser",
    () => sdkNonAdmin.api.chat_rooms.getOne(room.id),
    passOnAnyResult
  )
  await async_test(
    "non admin can get chats from room with enduser",
    () => sdkNonAdmin.api.chats.getSome({ filter: { roomId: room.id } }),
    passOnAnyResult
  )

  await sdk.api.chat_rooms.deleteOne(room.id)

  
  const emptyRoom = await sdk.api.chat_rooms.createOne({ })
  await async_test(
    `get-chat-room (creator can access, even when not in userIds)`, 
    () => sdk.api.chat_rooms.getOne(emptyRoom.id), 
    { onResult: r => r.id === emptyRoom.id }
  ) 
  await async_test(
    `get-chat-room (not in empty room)`, 
    () => sdk2.api.chat_rooms.getOne(emptyRoom.id), 
    { shouldError: true, onError: e => e.message === "Could not find a record for the given id" }
  ) 
  await async_test(
    `join-room`, 
    () => sdk2.api.chat_rooms.join_room({ id: emptyRoom.id }), 
    { onResult: ({ room }) => room.id === emptyRoom.id }
  ) 
  await async_test(
    `get-chat-room (join successful)`, 
    () => sdk2.api.chat_rooms.getOne(emptyRoom.id), 
    { onResult: r => r.id === emptyRoom.id }
  ) 
  await async_test(
    `create-chat (join successful)`, 
    () => sdk2.api.chats.createOne({ roomId: emptyRoom.id, message: 'test' }), 
    passOnAnyResult
  ) 
  await async_test(
    `get-chat (join successful)`, 
    () => sdk2.api.chats.getSome({ filter: { roomId: emptyRoom.id } }), 
    { onResult: r => r.length > 0 }
  ) 
  await async_test(
    `[bulk] get-chat-room (join successful)`, 
    () => sdk2.bulk_load({ load: [{ model: 'chat_rooms' }] }), 
    { onResult: r => r.results?.[0]?.records?.find(r => r.id === emptyRoom.id )}
  )

  await enduserSDK.logout()
  const loggedOutEnduser = await sdk.api.endusers.getOne(enduser.id)
  assert(new Date(loggedOutEnduser.lastLogout).getTime() > Date.now() - 100, 'lastLogout fail for enduser', 'lastLogout for enduser')

  await sdk.api.endusers.deleteOne(enduser.id)
  await sdk.api.chat_rooms.deleteOne(emptyRoom.id)

}

const chat_tests = async() => {
  log_header("Chat")

  const sdk2 = new Session({ host })
  await sdk2.authenticate(nonAdminEmail, nonAdminPassword) // non-admin has access restrictions we want to test 

  const enduser = await sdk.api.endusers.createOne({ email })
  await sdk.api.endusers.set_password({ id: enduser.id, password }).catch(console.error)
  await enduserSDK.authenticate(email, password).catch(console.error)

  const room  = await sdk.api.chat_rooms.createOne({ type: 'internal', userIds: [userId] })
  const chat  = await sdk.api.chats.createOne({ roomId: room.id, message: "Hello!" })
  const chat2 = await sdk.api.chats.createOne({ roomId: room.id, message: "Hello..." })

  const enduserRoom = await sdk.api.chat_rooms.createOne({ type: 'internal', userIds: [userId], enduserIds: [enduser.id] })
  await sdk.api.chats.createOne({ roomId: enduserRoom.id, message: 'enduser'})
  await enduserSDK.api.chats.createOne({ roomId: enduserRoom.id, message: 'enduser'})

  await async_test(
    `get-chats for enduser`, 
    () => enduserSDK.api.chats.getSome({ filter: { roomId: enduserRoom.id } }), 
    { onResult: c => c?.length === 2 }
  )

  // this is allowed now
  // await async_test(
  //   `get-chat (without filter)`, 
  //   () => sdk.api.chats.getOne(chat.id), 
  //   { shouldError: true, onError: () => true }
  // )
  // this is allowed now
  // await async_test(
  //   `get-chats (without filter)`, 
  //   () => sdk.api.chats.getSome({}), 
  //   { shouldError: true, onError: () => true }
  // )
  await async_test(
    `get-chats (with filter)`, 
    () => sdk.api.chats.getSome({ filter: { roomId: room.id } }), 
    { onResult: c => c?.length === 2 }
  )

  await async_test(
    `get-chats not allowed`, 
    () => sdk2.api.chats.getSome({ filter: { roomId: room.id } }), 
    { shouldError: true, onError: e => e.message === 'You do not have permission to access this resource' }
  )
  await async_test(
    `get-chats admin`, 
    () => sdk.api.chats.getSome({ filter: { roomId: room.id } }), 
    { onResult: () => true }
  )
  // currently disabled endpoint altogether
  // await async_test(
  //   `update-chat not allowed`, 
  //   () => sdk2.api.chats.updateOne(chat.id, { message: 'Hi' }), 
  //   { shouldError: true, onError: e => e.message === 'You do not have permission to access this resource' }
  // )
  await async_test(
    `delete-chat not allowed`, () => sdk2.api.chats.deleteOne(chat.id), handleAnyError
  )

  // currently disabled endpoint altogether
  // await async_test(
  //   `update-chat can't update roomId`, 
  //   () => sdk.api.chats.updateOne(chat.id, { roomId: room.id } as any), // cast to any to allow calling with bad argument, but typing should catch this too
  //   { shouldError: true, onError: e => e.message === 'Error parsing field updates: roomId is not valid for updates' }
  // )

  await sdk.api.chat_rooms.deleteOne(room.id)
  await wait(undefined, 25)
  await async_test(
    `get-chat (deleted as dependency of room 1)`,
    () => sdk.api.chats.getOne(chat.id), 
    { shouldError: true, onError: e => e.message === 'Could not find a record for the given id' }
  )
  await async_test(
    `get-chat (deleted as dependency of room 2)`,
    () => sdk.api.chats.getOne(chat2.id), 
    { shouldError: true, onError: e => e.message === 'Could not find a record for the given id' }
  )

  const sharedRoom  = await sdk.api.chat_rooms.createOne({ type: 'internal', userIds: [userId, sdk2.userInfo.id] })
  const sharedChat  = await sdk.api.chats.createOne({ roomId: sharedRoom.id, message: "Hello!", })
  const sharedChat2 = await sdk2.api.chats.createOne({ roomId: sharedRoom.id, message: "Hello there!", })
  await async_test(
    `get-chat (shared, user1)`,
    () => sdk.api.chats.getOne(sharedChat.id), 
    { onResult: r => r.id === sharedChat.id }
  )
  await async_test(
    `get-chat (shared, user2)`,
    () => sdk2.api.chats.getOne(sharedChat.id), 
    { onResult: r => r.id === sharedChat.id }
  )
  await async_test(
    `get-chats (shared, user1)`,
    () => sdk.api.chats.getSome({ filter: { roomId: sharedRoom.id } }, ), 
    { onResult: cs => cs.length === 2 && !!cs.find(c => c.id === sharedChat.id) && !!cs.find(c => c.id === sharedChat2.id) }
  )
  await async_test(
    `get-chats (shared, user2)`,
    () => sdk2.api.chats.getSome({ filter: { roomId: sharedRoom.id } }), 
    { onResult: cs => cs.length === 2 && !!cs.find(c => c.id === sharedChat.id) && !!cs.find(c => c.id === sharedChat2.id) }
  )


  // test setNull dependency
  const roomNull  = await sdk.api.chat_rooms.createOne({ type: 'internal', userIds: [userId] })
  const chatNull  = await sdk.api.chats.createOne({ roomId: roomNull.id, message: "Hello!" })
  const chat2Null = await sdk.api.chats.createOne({ roomId: roomNull.id, message: "Hello...", replyId: chatNull.id })

  const chatScheduled = await sdk.api.chats.createOne({ roomId: roomNull.id, message: "Scheduled", sendAt: new Date(Date.now() + 1000 * 60 * 60 * 24) })
  await wait(undefined, 2000) // should be greater than 1s

  await sdk.api.chats.updateOne(chatScheduled.id, { sendAt: new Date(0) }) // trigger scheduled send
  await wait(undefined, 250)
  await async_test(
    `Scheduled chat timestamps`,
    () => sdk.api.chats.getOne(chatScheduled.id), 
    { onResult: c => 
      !!c.sendAt && new Date(c.sendAt).getTime() === 0 
      && !!c.timestamp && new Date(c.timestamp).getTime() < Date.now()
      && !!c.timestamp && new Date(c.timestamp).getTime() > Date.now() - 1000 // should be less than delay after chatScheduled
      // createdAt is only precise to the second but should be different than timestamp
      && Math.floor(new Date(c.timestamp).getTime() / 1000) !== Math.floor(new Date(c.createdAt).getTime() / 1000)
    }
  )
  
  await sdk.api.chats.deleteOne(chatNull.id)
  await wait(undefined, 250)
  await async_test(
    `get-chat (setNull working)`,
    () => sdk.api.chats.getOne(chat2Null.id), 
    { onResult: c => c.replyId === null }
  )

  await Promise.all([
    sdk.api.endusers.deleteOne(enduser.id),
    sdk.api.chat_rooms.deleteOne(enduserRoom.id),
  ])
}

const enduserAccessTests = async () => {
  log_header("Enduser Access")
  const email = 'enduser@tellescope.com'
  const password = 'testpassword'

  const enduser = await sdk.api.endusers.createOne({ email })
  const enduser2 = await sdk.api.endusers.createOne({ email: 'hi' + email })
  await sdk.api.endusers.set_password({ id: enduser.id, password }).catch(console.error)
  await enduserSDK.authenticate(email, password).catch(console.error)

  await wait(undefined, 1000) // wait so that refresh_session generates a new authToken (different timestamp)

  const uInfo = enduserSDK.userInfo
  const originalAuthToken = enduserSDK.authToken
  await enduserSDK.refresh_session()
  assert(uInfo.id === enduserSDK.userInfo.id, 'userInfo mismatch', 'userInfo id preserved after refresh') 
  assert(
    !!originalAuthToken && !!enduserSDK.authToken && enduserSDK.authToken !== originalAuthToken, 
    'same authToken after refresh', 
    'authToken refresh'
  ) 

  await async_test(
    `no-enduser-access for different businessId`,
    () => enduserSDKDifferentBusinessId.authenticate(email, password), 
    { shouldError: true, onError: (e: any) => e?.message === "Login details are invalid" }
  )

  for (const n in schema) {
    const endpoint = url_safe_path(n)
    const model = schema[n as keyof typeof schema]
    if (n === 'webhooks') continue // no default endpoints implemented
    if (n === 'form_groups') continue

    //@ts-ignore
    if (!model?.enduserActions?.read && (model.defaultActions.read || model.customActions.read)) {
      await async_test(
        `no-enduser-access getOne (${endpoint})`,
        () => enduserSDK.GET(`/v1/${endpoint.substring(0, endpoint.length - 1)}/:id`), 
        { shouldError: true, onError: (e: any) => e === 'Unauthenticated' || e?.message === 'This action is not allowed' }
      )
    } 
    //@ts-ignore
    if (!model.enduserActions?.readMany && (model.defaultActions.readMany || model.customActions.readMany)) {
      await async_test(
        `no-enduser-access getSome (${endpoint})`,
        () => enduserSDK.GET(`/v1/${endpoint}`), 
        { shouldError: true, onError: (e: any) => e === 'Unauthenticated' || e?.message === 'This action is not allowed' }
      )
    } 
    //@ts-ignore
    if (!model.enduserActions?.create && (model.defaultActions.create || model.customActions.create)) {
      await async_test(
        `no-enduser-access createOne (${endpoint})`,
        () => enduserSDK.POST(`/v1/${endpoint.substring(0, endpoint.length - 1)}`), 
        { shouldError: true, onError: (e: any) => e === 'Unauthenticated' || e?.message === 'This action is not allowed' }
      )
    } 
    //@ts-ignore
    if (!model.enduserActions?.createMany && (model.defaultActions.createMany || model.customActions.createMany)) {
      await async_test(
        `no-enduser-access createMany (${endpoint})`,
        () => enduserSDK.POST(`/v1/${endpoint}`), 
        { shouldError: true, onError: (e: any) => e === 'Unauthenticated' || e?.message === 'This action is not allowed' }
      )
    } 
    //@ts-ignore
    if (!model.enduserActions?.update && (model.defaultActions.update || model.customActions.update)) {
      await async_test(
        `no-enduser-access update (${endpoint})`,
        () => enduserSDK.PATCH(`/v1/${endpoint.substring(0, endpoint.length - 1)}/:id`), 
        { shouldError: true, onError: (e: any) => e === 'Unauthenticated' || e?.message === 'This action is not allowed' }
      )
    } 
    //@ts-ignore
    if (!model.enduserActions?.delete && (model.defaultActions.delete || model.customActions.delete)) {
      await async_test(
        `no-enduser-access delete (${endpoint})`,
        () => enduserSDK.DELETE(`/v1/${endpoint.substring(0, endpoint.length - 1)}/:id`), 
        { shouldError: true, onError: (e: any) => e === 'Unauthenticated' || e?.message === 'This action is not allowed' }
      )
    } 
  }

  await async_test(
    `enduser can find self`,
    () => enduserSDK.api.endusers.getOne(enduser.id),
    { onResult: e => e.id === enduser.id }
  )
  await async_test(
    `enduser can update self`,
    () => enduserSDK.api.endusers.updateOne(enduser.id, { fname: "Sebastian", lname: "Coates" }), 
    { onResult: e => e.id === enduser.id && e.fname === 'Sebastian' && e.lname === "Coates" }
  )
  await async_test(
    `enduser can't update other enduser`,
    () => enduserSDK.api.endusers.updateOne(enduser2.id, { fname: "Shouldn't Work"}), 
    { shouldError: true, onError: e => e.message === "Endusers may only update their own profile" }
  )

  const ticketAccessible = await sdk.api.tickets.createOne({ enduserId: enduser.id, title: "Accessible ticket" })
  const ticketInaccessible = await sdk.api.tickets.createOne({ enduserId: enduser2.id, title: "Inaccessible ticket" })
  await async_test(
    `enduser cannot create ticket for another enduser`,
    () => enduserSDK.api.tickets.createOne({ enduserId: sdk.userInfo.id, title: "Error on Creation" }),
    { shouldError: true, onError: e => !!e.message }
  )
  await async_test(
    `enduser-access default, no access constraints, matching enduserId`,
    () => enduserSDK.api.tickets.getOne(ticketAccessible.id),
    { onResult: t => t.id === ticketAccessible.id }
  )
  await async_test(
    `no-enduser-access default, no access constraints, non-matching enduserId`,
    () => enduserSDK.api.tickets.getOne(ticketInaccessible.id),
    { shouldError: true, onError: e => e.message.startsWith("Could not find")}
  )
  await async_test(
    `no-enduser-access default, no access constraints, get many`,
    () => enduserSDK.api.tickets.getSome(),
    { onResult: ts => ts.length === 1 }
  )

  const hiddenTemplate = await sdk.api.calendar_event_templates.createOne({ 
    title: "hidden", durationInMinutes: 5,
    enableSelfScheduling: false,
  })
  const shownTemplate = await sdk.api.calendar_event_templates.createOne({ 
    title: "shown", durationInMinutes: 5,
    enableSelfScheduling: true,
  })
  await async_test(
    `Filter calendar event templates`,
    () => enduserSDK.api.calendar_event_templates.getSome(),
    { onResult: vs => vs.length === 1 && !vs.find(v => v.id === hiddenTemplate.id) }
  )

  const hiddenForm = await sdk.api.forms.createOne({ 
    title: "hidden", allowPortalSubmission: false,
  })
  const shownForm = await sdk.api.forms.createOne({ 
    title: "shown", allowPortalSubmission: true,
  })
  await async_test(
    `Filter forms`,
    () => enduserSDK.api.forms.getSome(),
    { onResult: vs => vs.length === 1 && !vs.find(v => v.id === hiddenForm.id) }
  )

  const hiddenEvent = await sdk.api.calendar_events.createOne({
    title: "hidden", startTimeInMS: Date.now(), durationInMinutes: 5,
  })
  const shownEvent = await sdk.api.calendar_events.createOne({
    title: "shown", startTimeInMS: Date.now(), durationInMinutes: 5,
    publicRead: true,
  })
  const attendedEvent = await sdk.api.calendar_events.createOne({
    title: "shown", startTimeInMS: Date.now(), durationInMinutes: 5,
    attendees: [{ id: enduser.id, type: 'enduser' }],
  })
  await async_test(
    `Filter calendar events`,
    () => enduserSDK.api.calendar_events.getSome(),
    { onResult: vs => vs.length === 2 && !vs.find(v => v.id === hiddenEvent.id) }
  )

  const hiddenForum = await sdk.api.forums.createOne({ title: "Hidden Forum", publicRead: false })
  const shownForum = await sdk.api.forums.createOne({ title: "Forum", publicRead: true })
  await async_test(
    `Filter forums`,
    () => enduserSDK.api.forums.getSome(),
    { onResult: vs => vs.length === 1 && !vs.find(v => v.id === hiddenForum.id) }
  )

  await sdk.api.tickets.deleteOne(ticketAccessible.id)
  await sdk.api.tickets.deleteOne(ticketInaccessible.id)
  await sdk.api.endusers.deleteOne(enduser.id)
  await sdk.api.endusers.deleteOne(enduser2.id)
  await sdk.api.calendar_event_templates.deleteOne(hiddenTemplate.id)
  await sdk.api.calendar_event_templates.deleteOne(shownTemplate.id)
  await sdk.api.forms.deleteOne(hiddenForm.id)
  await sdk.api.forms.deleteOne(shownForm.id)
  await sdk.api.calendar_events.deleteOne(hiddenEvent.id)
  await sdk.api.calendar_events.deleteOne(shownEvent.id)
  await sdk.api.calendar_events.deleteOne(attendedEvent.id)
  await sdk.api.forums.deleteOne(hiddenForum.id)
  await sdk.api.forums.deleteOne(shownForum.id)
}

const files_tests = async () => {
  log_header("Files")
  const enduser = await sdk.api.endusers.createOne({ email })
  await sdk.api.endusers.set_password({ id: enduser.id, password }).catch(console.error)
  await enduserSDK.authenticate(email, password).catch(console.error)
  await sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword) // to use new role, handle logout on role change

  const buff = buffer.Buffer.from('test file data')

  await async_test(
    `non admin can prepare file upload`,
    () => sdkNonAdmin.api.files.prepare_file_upload({ 
      name: 'Test File', size: buff.byteLength, type: 'text/plain' 
    }),
    { onResult: t => true }
  )

  const { presignedUpload, file } = await sdk.api.files.prepare_file_upload({ 
    name: 'Test Private', size: buff.byteLength, type: 'text/plain', enduserId: enduser.id, 
  })

  const { presignedUpload: presignedNonEnduser, file: fileNonEnduser } = await sdk.api.files.prepare_file_upload({ 
    name: 'Test Private (no enduser)', size: buff.byteLength, type: 'text/plain', 
  })

  const { presignedUpload: presigned2 } = await sdk.api.files.prepare_file_upload({ 
    name: 'Test Public', size: buff.byteLength, type: 'text/plain',
    enduserId: enduser.id,
    publicRead: true,
    publicName: 'public',
  })
  
  await sdk.UPLOAD(
    // @ts-ignore
    presignedUpload, 
    buff
  )
  await sdk.UPLOAD(
    // @ts-ignore
    presignedNonEnduser, 
    buff
  )
  await sdk.UPLOAD(
    // @ts-ignore
    presigned2, 
    buff
  )

  await async_test(
    `Files associated with enduser on prepare_file_upload`,
    () => sdk.api.files.getSome({ filter: { enduserId: enduser.id } }),
    { onResult: fs => fs.length === 2 }
  )

  const { downloadURL } = await sdk.api.files.file_download_URL({ secureName: file.secureName })
  const downloaded: string = await sdk.DOWNLOAD(downloadURL)

  assert(downloaded === buff.toString(), 'downloaded file does not match uploaded file', 'upload, download comparison') 

  const { downloadURL: cachedURL } = await sdk.api.files.file_download_URL({ secureName: file.secureName })
  assert(downloadURL === cachedURL, 'cache download url failed', 'download url cache')

  const { downloadURL: urlForEnduser } = await enduserSDK.api.files.file_download_URL({ secureName: file.secureName })
  assert(downloadURL === urlForEnduser, 'failed to get download url for enduser', 'download url for enduser')

  await Promise.all([
    sdk.api.endusers.deleteOne(enduser.id),
  ])

  await wait(undefined, 2000) // wait for files to be deleted as side effect
  await async_test(
    `Files cleaned up as side effect of deleting enduser`,
    () => sdk.api.files.getSome({ filter: { enduserId: enduser.id } }),
    { onResult: fs => fs.length === 0 }
  )
  await async_test(
    `Non-enduser file is left`,
    () => sdk.api.files.getSome(),
    { onResult: fs => fs.length > 0 }
  )
  
  // cleanup other file
  await Promise.all([
    sdk.api.files.deleteOne(fileNonEnduser.id),
  ])
}

const enduser_session_tests = async () => {
  log_header("Enduser Session")
  const email = 'enduser@tellescope.com'
  const password = 'testpassword'

  const enduser = await sdk.api.endusers.createOne({ email })
  await sdk.api.endusers.set_password({ id: enduser.id, password }).catch(console.error)
  await enduserSDK.authenticate(email, password).catch(console.error)

  const users = await enduserSDK.api.users.display_info()
  assert(users && users.length > 0, 'No users returned', 'Get user display info for enduser')

  await async_test(
    `Enduser session refresh on authenticated session includes enduser info`,
    () => enduserSDK.refresh_session(),
    { onResult: ({ authToken, enduser }) => !!authToken && !!enduser.email }
  ) 
  await async_test(
    `Enduser session refresh on authenticated session includes enduser info (2x)`,
    () => enduserSDK.refresh_session(),
    { onResult: ({ authToken, enduser }) => !!authToken && !!enduser.email }
  ) 

  const form = await sdk.api.forms.createOne({ title: 'session test', allowPublicURL: true })
  await sdk.api.form_fields.createOne({ formId: form.id, previousFields: [{ type: 'root', info: {} }], title: 'session test', type: 'string' })
  const formSession = await new EnduserSession({ businessId: form.businessId, host }).api.form_responses.session_for_public_form({
    formId: form.id,
    businessId: form.businessId,
    email: enduser.email,
    phone: '5555555555',
    fname: 'session',
    lname: 'test',
  })

  const formEnduserSession = new EnduserSession({ authToken: formSession.authToken, businessId: form.businessId, host })
  await async_test(
    `Enduser session refresh does not leak info for public form session`,
    () => formEnduserSession.refresh_session(),
    { onResult: ({ authToken, enduser }) => !!authToken && !enduser.email }
  ) 
  await async_test(
    `2x Enduser session refresh does not leak info for public form session`,
    () => formEnduserSession.refresh_session(),
    { onResult: ({ authToken, enduser }) => !!authToken && !enduser.email }
  ) 

  const template = await sdk.api.calendar_event_templates.createOne({ title: 'session test', durationInMinutes: 15 })
  const bookingSession = await new EnduserSession({ businessId: form.businessId, host }).api.calendar_events.session_for_public_appointment_booking({
    businessId: form.businessId,
    email: enduser.email!,
    phone: '5555555555',
    calendarEventTemplateId: template.id,
    dateOfBirth: '12-20-1997',
    fname: 'session',
    lname: 'test',
  })
  const bookingEnduserSession = new EnduserSession({ authToken: bookingSession.authToken, businessId: form.businessId, host })
  await async_test(
    `Enduser session refresh does not leak info for public booking session`,
    () => bookingEnduserSession.refresh_session(),
    { onResult: ({ authToken, enduser }) => !!authToken && !enduser.email }
  ) 
  await async_test(
    `2x Enduser session refresh does not leak info for public booking session`,
    () => bookingEnduserSession.refresh_session(),
    { onResult: ({ authToken, enduser }) => !!authToken && !enduser.email }
  ) 

  await Promise.all([
    sdk.api.endusers.deleteOne(enduser.id),
    sdk.api.forms.deleteOne(form.id),
    sdk.api.calendar_event_templates.deleteOne(template.id),
  ])
}

const users_tests = async () => {
  log_header("Users Tests")
  const randomFieldValue = crypto.randomBytes(32).toString('hex').toUpperCase() // uppercase so name parsing doesn't cause case change
  const randomFieldNumber = Math.random()

  const created = await sdk.api.users.createOne({ email: 'created@tellescope.com', verifiedEmail: true })
  assert(created.verifiedEmail, 'user not created with verified email', 'user created, with verifiedEmail')
  await sdk.api.users.deleteOne(created.id)

  /* Update user tests */
  await async_test(
    `update user (non-admin, other user)`,
    () => sdkNonAdmin.api.users.updateOne(sdk.userInfo.id, { fname: randomFieldValue }),
    handleAnyError
  )
  await async_test(
    `verify no update`,
    () => sdk.api.users.getOne(sdk.userInfo.id),
    { onResult: u => u.fname !== randomFieldValue }
  )
  await async_test(
    `update user (non-admin, self)`,
    () => sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, { fname: 'Updated' }),
    { onResult: u => u.id === sdkNonAdmin.userInfo.id && u.fname === "Updated" }
  )
  await async_test(
    `verify user update with admin get`,
    () => sdk.api.users.getOne(sdkNonAdmin.userInfo.id), 
    { onResult: u => u.id === sdkNonAdmin.userInfo.id && u.fname === "Updated" }
  )

  // reset fname to "Non" if this test throws, otherwise will falsely pass on next run
  // NOT Supported behavior any more
  // assert(sdkNonAdmin.userInfo.fname === 'Updated', 'refresh_session not called on self after update', 'sdk updated on user update')

  await async_test(
    `update user (admin, other user)`,
    () => sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { fname: 'Non' }), // change back
    { onResult: u => u.id === sdkNonAdmin.userInfo.id && u.fname === "Non" }
  )
  // sdkNonAdmin.userInfo.fname = 'Non' // update back in sdk instance as well

  await async_test(
    `verify user update with admin get`,
    () => sdk.api.users.getOne(sdkNonAdmin.userInfo.id), 
    { onResult: u => u.id === sdkNonAdmin.userInfo.id && u.fname === "Non" }
  )

  await async_test(
    `update user (custom fields)`,
    () => sdk.api.users.updateOne(sdk.userInfo.id, { fields: { boolean: true, f1: randomFieldValue, f2: randomFieldNumber, f3: { object: randomFieldValue } } }), // change back
    { onResult: u => u.id === sdk.userInfo.id && u.fields?.f1 === randomFieldValue && u.fields?.f2 === randomFieldNumber && (u.fields?.f3 as any).object == randomFieldValue }
  )
  // sdkNonAdmin.userInfo.fname = 'Non' // update back in sdk instance as well

  await async_test(
    `verify user update (custom fields)`,
    () => sdk.api.users.getOne(sdk.userInfo.id), 
    { onResult: u => u.id === sdk.userInfo.id && u.fields?.f1 === randomFieldValue && u.fields?.f2 === randomFieldNumber && (u.fields?.f3 as any).object == randomFieldValue }
  )
}

const calendar_events_tests = async () => {
  log_header("Calendar Events")

  const { id } = await sdk.api.endusers.createOne({ email })
  const { authToken, enduser } = await sdk.api.endusers.generate_auth_token({ id })
  const enduserSDK = new EnduserSession({ host, authToken, enduser, businessId: sdk.userInfo.businessId })

  const event = await sdk.api.calendar_events.createOne({ 
    title: "Event", durationInMinutes: 30, startTimeInMS: Date.now()
  })
  const eventWithEnduser = await sdk.api.calendar_events.createOne({ 
    title: "Event with Enduser", durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ id, type: 'enduser' }]
  })
  const publicEvent = await sdk.api.calendar_events.createOne({ 
    title: "Event", durationInMinutes: 30, startTimeInMS: Date.now(), publicRead: true,
  })



  await async_test(
    `user can access own event`,
    () => sdk.api.calendar_events.getOne(event.id),
    { onResult: e => e && e.id === event.id }
  ) 
  await async_test(
    `user can access public event`,
    () => sdk.api.calendar_events.getOne(publicEvent.id),
    { onResult: e => e && e.id === publicEvent.id }
  ) 
  // TODO: implement support for publicRead for users, 
  // await async_test(
  //   `non-creator, non-admin user can access public event`,
  //   () => sdkNonAdmin.api.calendar_events.getOne(publicEvent.id),
  //   { onResult: e => e && e.id === event.id }
  // ) 
  await async_test(
    `user can access own events and public events`,
    () => sdk.api.calendar_events.getSome(),
    { onResult: es => es && es.length === 3 }
  ) 
  await async_test(
    `user can access own event with enduser attendee`,
    () => sdk.api.calendar_events.getOne(eventWithEnduser.id),
    { onResult: e => e && e.id === eventWithEnduser.id }
  ) 

  await async_test(
    `enduser can't access uninvited event`,
    () => enduserSDK.api.calendar_events.getOne(event.id),
    { shouldError: true, onError: e => e.message === "Could not find a record for the given id" }
  ) 
  await async_test(
    `enduser can access event as attendee`,
    () => enduserSDK.api.calendar_events.getOne(eventWithEnduser.id),
    { onResult: e => e && e.id === eventWithEnduser.id }
  ) 
  await async_test(
    `enduser can access public event`,
    () => enduserSDK.api.calendar_events.getOne(publicEvent.id),
    { onResult: e => e && e.id === publicEvent.id }
  ) 
  await async_test(
    `enduser can access own events and public events`,
    () => enduserSDK.api.calendar_events.getSome(),
    { onResult: es => es && es.length === 2 }
  ) 
  await async_test(
    `enduser cannot update publicEvent `,
    () => enduserSDK.api.calendar_events.updateOne(publicEvent.id, { title: "CHANGED "}),
    handleAnyError
  ) 
  await async_test(
    `enduser cannot delete publicEvent`,
    () => enduserSDK.api.calendar_events.deleteOne(publicEvent.id),
    handleAnyError
  ) 

  await Promise.all([
    sdk.api.endusers.deleteOne(enduser.id),
    sdk.api.calendar_events.deleteOne(event.id),
    sdk.api.calendar_events.deleteOne(eventWithEnduser.id),
    sdk.api.calendar_events.deleteOne(publicEvent.id),
  ])
}

const formEventTests = async () => {
  log_header("Form Events")

  const enduser = await sdk.api.endusers.createOne({ email: 'deletemeee@tellescope.com' })
  const journey = await sdk.api.journeys.createOne({ title: 'test journey '})
  const form = await sdk.api.forms.createOne({ title: 'test form' })
  const field = await sdk.api.form_fields.createOne({
    formId: form.id,
    title: 'question', 
    type: 'string',
    previousFields: [{ type: 'root', info: {} }]
  })

  const triggerStep = await sdk.api.automation_steps.createOne({
    journeyId: journey.id,
    events: [{ type: 'onJourneyStart', info: { } }],
    // in practice, this would send a form, so that the next step(s) could handle the response
    // but we don't want to send emails in testing, and can still attach this Id to a form response to test a trigger
    action: {
      type: 'setEnduserStatus', 
      info: { status: 'placeholder' },
    },
  })
  await sdk.api.automation_steps.createOne({
    journeyId: journey.id,
    events: [{ 
      type: 'formResponse', 
      info: { automationStepId: triggerStep.id } 
    }],
    action: {
      type: 'setEnduserStatus',
      info: { status: 'placeholder' },
    },
  })

  const { accessCode: acNoStep } = await sdk.api.form_responses.prepare_form_response({ formId: form.id, enduserId: enduser.id })
  const { accessCode: acStep } = await sdk.api.form_responses.prepare_form_response({ formId: form.id, enduserId: enduser.id })

  const testResponse: FormResponseValue = {
    answer: {
      type: 'string',
      value: 'answer'
    },
    fieldId: field.id,
    fieldTitle: field.title,
  }

  const { formResponse } = await sdk.api.form_responses.submit_form_response({ accessCode: acNoStep, responses: [testResponse] })
  assert(objects_equivalent(formResponse.responses, [testResponse]), 'bad form resonse returned', 'form response returned correctly')

  await sdk.api.form_responses.submit_form_response({ accessCode: acStep, automationStepId: triggerStep.id, responses: [testResponse] })
  await wait(undefined, 250) // allow background creation with generous pause

  await async_test(
    `Without automation stepId, form response handler is not triggered`,
    () => sdk.api.automated_actions.getSome(),
    { onResult: steps => steps.length === 1 /* NOT 2 or more */ }
  )  

  await Promise.all([
    sdk.api.forms.deleteOne(form.id),
    sdk.api.journeys.deleteOne(journey.id),
    sdk.api.endusers.deleteOne(enduser.id)
  ])
}

const ticketEventTests = async () => {
  log_header("Ticket Events")

  const testCloseReasons = ['Yes', 'No', 'Maybe']

  const enduser = await sdk.api.endusers.createOne({ email: 'deletemeee@tellescope.com' })
  const enduserWithTeam = await sdk.api.endusers.createOne({ email: 'deleteme2@tellescope.com', assignedTo: [sdkNonAdmin.userInfo.id] })

  const journey = await sdk.api.journeys.createOne({ title: 'test journey with completion options'})
  const nullJourney = await sdk.api.journeys.createOne({ title: 'test journey null'})

  const root = await sdk.api.automation_steps.createOne({
    journeyId: journey.id,
    events: [{ type: 'onJourneyStart', info: { } }],
    action: {
      type: 'createTicket', 
      info: { 
        title: 'close reasons tests',
        assignmentStrategy: {
          type: 'care-team-random', 
          info: {},
        },
        closeReasons: testCloseReasons,
        defaultAssignee: sdk.userInfo.id,
      },
    },
  })
  const nullRoot = await sdk.api.automation_steps.createOne({
    journeyId: nullJourney.id,
    events: [{ type: 'onJourneyStart', info: { } }],
    action: {
      type: 'createTicket', 
      info: { 
        title: 'null test',
        assignmentStrategy: {
          type: 'care-team-random', 
          info: {},
        },
        closeReasons: [],
        defaultAssignee: sdk.userInfo.id,
      },
    },
  })

  const createStep = (journeyId: string, automationStepId: string, closedForReason?: string ) => (
    sdk.api.automation_steps.createOne({
      journeyId,
      events: [{ type: 'ticketCompleted', info: { automationStepId, closedForReason, } }],
      action: { type: 'setEnduserStatus', info: { status: closedForReason ?? 'Null' }, },
    })
  )
  await createStep(nullJourney.id, nullRoot.id)
  await createStep(nullJourney.id, nullRoot.id, testCloseReasons[0])
  await createStep(nullJourney.id, nullRoot.id, testCloseReasons[1])
  await createStep(nullJourney.id, nullRoot.id, testCloseReasons[2])

  await createStep(journey.id, root.id)
  await createStep(journey.id, root.id, testCloseReasons[0])
  await createStep(journey.id, root.id, testCloseReasons[1])
  await createStep(journey.id, root.id, testCloseReasons[2])

  await sdk.api.endusers.updateOne(enduser.id, { journeys: { [journey.id]: 'Added' }})
  await sdk.api.endusers.updateOne(enduserWithTeam.id, { journeys: { [nullJourney.id]: 'Added (Null)' }})

  await async_test(
    `Tickets automatically created`,
    () => pollForResults(
      sdk.api.tickets.getSome,
      tickets => tickets?.length === 2,
      500,
      15,
    ),
    passOnAnyResult
  )  

  await async_test(
    `Ticket for enduser, default assignment, testCloseReasons`,
    () => sdk.api.tickets.getSome({ filter: { enduserId: enduser.id }}),
    { onResult: tickets => (
        tickets.length === 1 
      && tickets[0].closeReasons?.length === 3
      && tickets[0].owner === sdk.userInfo.id
    )}
  )  
  const ticket = await sdk.api.tickets.getOne({ enduserId: enduser.id })
  await async_test(
    `Ticket for enduser, care team assignment, no reasons`,
    () => sdk.api.tickets.getSome({ filter: { enduserId: enduserWithTeam.id }}),
    { onResult: tickets => tickets.length === 1 
      && tickets[0].closeReasons?.length === 0
      && tickets[0].owner === sdkNonAdmin.userInfo.id
    }
  )  
  const ticketNull = await sdk.api.tickets.getOne({ enduserId: enduserWithTeam.id })

  await sdk.api.tickets.updateOne(ticket.id, { closedForReason: 'Maybe', closedAt: new Date() })
  await sdk.api.tickets.updateOne(ticketNull.id, { closedAt: new Date() })
  await wait(undefined, 250) // wait for actions to be automatically created

  await async_test(
    `Automated actions for handle ticket created`,
    () => sdk.api.automated_actions.getSome(),
    { onResult: (
        actions => actions?.length === 4 // ticket creations + ticket completions = 2 + 2
    && (
      !!actions.find(a => 
        a.event.type === 'ticketCompleted' 
        && a.enduserId === enduser.id 
        && a.action.type === 'setEnduserStatus' 
        && a.action.info.status === 'Maybe' // maybe branch
      )
    )
    && (
      !!actions.find(a => 
        a.event.type === 'ticketCompleted' 
        && a.enduserId === enduserWithTeam.id 
        && a.action.type === 'setEnduserStatus' 
        && a.action.info.status === 'Null' // null branch when completed without closedForReason
      )
    )
    )}
  )  

  await Promise.all([
    sdk.api.journeys.deleteOne(journey.id),
    sdk.api.journeys.deleteOne(nullJourney.id),
    sdk.api.endusers.deleteOne(enduser.id),
    sdk.api.endusers.deleteOne(enduserWithTeam.id),
  ])
}

const removeFromJourneyTests = async () => {
  log_header("Remove from Journey")

  const journey = await sdk.api.journeys.createOne({ title: 'test journey'})
  const enduser = await sdk.api.endusers.createOne({ email: 'test@tellescope.com' })

  const TEST_DELAY = 1000

  const step = await (
    sdk.api.automation_steps.createOne({
      journeyId: journey.id,
      events: [{ type: 'onJourneyStart', info: { } }],
      action: { type: 'setEnduserStatus', info: { status: 'Root' }, },
    })
  )
  await (
    sdk.api.automation_steps.createOne({
      journeyId: journey.id,
      events: [{ type: 'afterAction', info: { 
        automationStepId: step.id,
        delay: TEST_DELAY / 1000,
        delayInMS: TEST_DELAY,
        unit: 'Seconds',
      } }],
      action: { type: 'setEnduserStatus', info: { status: 'Delayed Step' }, },
    })
  )
  // test empty events step doesn't get triggered or cause errors
  await (
    sdk.api.automation_steps.createOne({
      journeyId: journey.id,
      events: [],
      action: { type: 'setEnduserStatus', info: { status: 'INVARIANT_VIOLATION' }, },
    })
  )

  // add to journey to trigger initial action
  await sdk.api.endusers.updateOne(enduser.id, { journeys: { [journey.id]: 'New' } }, { replaceObjectFields: true })
  await wait(undefined, 250)
  await async_test(
    `Root action triggered (only root)`,
    () => sdk.api.automated_actions.getSome({ filter: { enduserId: enduser.id }}),
    { onResult: es => es.length === 1 }
  )  
  await wait(undefined, 250)
  await async_test(
    `Next step not trigged early`,
    () => sdk.api.endusers.getOne(enduser.id),
    { onResult: e => e.journeys?.[journey.id] !== 'Delayed Step' }
  )  

  await async_test(
    `Sequenced action triggered`,
    () => pollForResults(
      () => sdk.api.endusers.getOne(enduser.id),
      e => e.journeys?.[journey.id] === 'Delayed Step',
      TEST_DELAY,
      15,
    ),
    passOnAnyResult
  )  

  await Promise.all([ 
    sdk.api.journeys.deleteOne(journey.id),
    sdk.api.endusers.deleteOne(enduser.id),
  ])
}

const sequenceTests = async () => {
  log_header("Automation Sequencing")

  const journey = await sdk.api.journeys.createOne({ title: 'test journey'})
  const journey2 = await sdk.api.journeys.createOne({ title: 'other journey'})

  const enduser = await sdk.api.endusers.createOne({ email: 'test@tellescope.com' })
  const enduser2 = await sdk.api.endusers.createOne({ email: 'test2@tellescope.com' })
  await sdk.api.endusers.updateOne(enduser.id, { journeys: { [journey.id]: 'Added', [journey2.id]: 'Added2' }})

  const step = await (
    sdk.api.automation_steps.createOne({
      journeyId: journey.id,
      events: [{ type: 'onJourneyStart', info: { } }],
      action: { type: 'setEnduserStatus', info: { status: 'Root' }, },
    })
  )
  const step2 = await (
    sdk.api.automation_steps.createOne({
      journeyId: journey2.id,
      events: [{ type: 'onJourneyStart', info: { } }],
      action: { type: 'setEnduserStatus', info: { status: 'Root' }, },
    })
  )

  const createAction = (journeyId: string, step: { id: string }, enduserId?: string) => (
    sdk.api.automated_actions.createOne({
      journeyId,
      automationStepId: step.id,
      enduserId: enduserId ?? enduser.id,
      processAfter: Date.now() + 1000000, // add delay to make sure it doesn't happen
      status: 'active',
      event: { type: 'onJourneyStart', info: { } },
      action: { type: 'setEnduserStatus', info: { status: 'Test Status' }, },
    })
  )

  const numberOfActions = 4
  for (let i = 0; i < numberOfActions; i++) {
    await createAction(journey.id, step); 
    await createAction(journey2.id, step2); 
    await createAction(journey.id, step, enduser2.id); 
  }

  // remove from journey, should set all statuses to cancelled
  await sdk.api.endusers.updateOne(enduser.id, { journeys: { } }, { replaceObjectFields: true })
  await wait(undefined, 250)

  await async_test(
    `Automated actions for handle ticket created`,
    () => sdk.api.automated_actions.getSome(),
    { onResult: (actions => (
        // enduser removed from multiple journeys
        actions.filter(a => a.status === 'cancelled').length === numberOfActions * 2

         // other enduser is unaffected
     && actions.filter(a => a.status === 'active').length === numberOfActions
    ))}
  )  


  await Promise.all([ 
    sdk.api.journeys.deleteOne(journey.id),
    sdk.api.journeys.deleteOne(journey2.id),
    sdk.api.endusers.deleteOne(enduser.id),
    sdk.api.endusers.deleteOne(enduser2.id),
  ])
}

export const formUnsubmittedCancelConditionTest = async () => {
  log_header("formUnsubmitted Cancel Condition Tests")

  const enduser = await sdk.api.endusers.createOne({ email: 'deletemeee@tellescope.com' })
  const journey = await sdk.api.journeys.createOne({ title: 'test journey '})
  const form = await sdk.api.forms.createOne({ title: 'test form' })
  const field = await sdk.api.form_fields.createOne({
    formId: form.id, title: 'question', type: 'string', 
    previousFields: [{ type: 'root', info: {} }]
  })

  // this action won't be fired, because patient isn't added to journey as part of tests
  const triggerStep = await sdk.api.automation_steps.createOne({
    journeyId: journey.id,
    events: [{ type: 'onJourneyStart', info: { } }],
    // in practice, this would send a form, so that the next step(s) could handle the response
    // but we don't want to send emails in testing, and can still attach this Id to a form response to test a trigger
    action: {
      type: 'setEnduserStatus', 
      info: { status: 'start' },
    },
  })

  const unsub = await sdk.api.automation_steps.createOne({
    journeyId: journey.id,
    events: [{ 
      type: 'formUnsubmitted', 
      info: { 
        automationStepId: triggerStep.id,
        delayInMS: 0, // should trigger 
        delay: 0, unit: 'Seconds', // don't matter
        // this cancelCondition is now added automatically, does not need to be part of step
        // cancelConditions: [{ type: 'formResponse', info: { automationStepId: triggerStep.id }}]
      } 
    }],
    action: {
      type: 'setEnduserStatus',
      info: { status: 'triggered' },
    },
  })

  // should occur right after unsub
  const fastFollowup = await sdk.api.automation_steps.createOne({
    journeyId: journey.id,
    events: [{ 
      type: 'afterAction', 
      info: { 
        automationStepId: unsub.id,
        delayInMS: 0,  // ensure it triggers right after unsub
        delay: 0, unit: 'Seconds', // don't matter
        // this cancelCondition is now added automatically, does not need to be part of step
        // cancelConditions: [{ type: 'formResponse', info: { automationStepId: triggerStep.id }}]
      } 
    }],
    action: {
      type: 'setEnduserStatus',
      info: { status: 'triggered again' },
    },
  })
  
  // should be cancelled after unsub
  await sdk.api.automation_steps.createOne({
    journeyId: journey.id,
    events: [{ 
      type: 'afterAction', 
      info: { 
        automationStepId: unsub.id,
        delayInMS: 1000000,  // ensure it doesn't trigger
        delay: 0, unit: 'Seconds', // don't matter
        // this cancelCondition is now added automatically, passed down from unsub
        // cancelConditions: [{ type: 'formResponse', info: { automationStepId: triggerStep.id }}]
      } 
    }],
    action: {
      type: 'setEnduserStatus',
      info: { status: 'violation 1' },
    },
  })

  // should be cancelled after unsub
  // a second followup to the unsub event (to create example of two actions with same cancel condition)
  await sdk.api.automation_steps.createOne({
    journeyId: journey.id,
    events: [{ 
      type: 'afterAction', 
      info: { 
        automationStepId: unsub.id,
        delayInMS: 1000000,  // ensure it doesn't trigger
        delay: 0, unit: 'Seconds', // don't matter
        // this cancelCondition is now added automatically, does not need to be part of step
        // cancelConditions: [{ type: 'formResponse', info: { automationStepId: triggerStep.id }}]
      } 
    }],
    action: {
      type: 'setEnduserStatus',
      info: { status: 'violation 2' },
    },
  })

  const { accessCode } = await sdk.api.form_responses.prepare_form_response({ 
    formId: form.id, 
    automationStepId: triggerStep.id, // must be included for trigger to happen
    enduserId: enduser.id 
  })

  // allow fast followup to trigger
  await async_test(
    `formUnsubmitted event with short delay is triggered`,
    () => pollForResults(
      () => sdk.api.endusers.getOne(enduser.id),
      e => e?.journeys?.[journey.id] === 'triggered again',
      1000,
      20,
    ),
    passOnAnyResult
  )  

  // trigger cancel conditions
  await sdk.api.form_responses.submit_form_response({ accessCode, automationStepId: triggerStep.id, responses: [{
    answer: {
      type: 'string',
      value: 'answer'
    },
    fieldId: field.id,
    fieldTitle: field.title,
  }] })

  await wait(undefined, 1500) // allow background creation with generous pause

  await async_test(
    `Cancel conditions work for followup`,
    () => sdk.api.automated_actions.getSome(),
    { onResult: as => as.length === 4 
        && as.find(a => a.automationStepId === unsub.id)?.status === 'finished' 
        && as.find(a => a.automationStepId === fastFollowup.id)?.status === 'finished' 
        && as.filter(a => a.status === 'cancelled').length === 2
    }
  )  

  await Promise.all([
    sdk.api.forms.deleteOne(form.id),
    sdk.api.journeys.deleteOne(journey.id),
    sdk.api.endusers.deleteOne(enduser.id)
  ])
}

export const formsUnsubmittedCancelConditionTest = async () => {
  log_header("formsUnsubmitted Cancel Condition Tests")

  const enduser = await sdk.api.endusers.createOne({ email: 'deletemeee@tellescope.com' })
  const journey = await sdk.api.journeys.createOne({ title: 'test journey '})
  const form = await sdk.api.forms.createOne({ title: 'test form' })
  const field = await sdk.api.form_fields.createOne({
    formId: form.id, title: 'question', type: 'string', 
    previousFields: [{ type: 'root', info: {} }]
  })

  // this action won't be fired, because patient isn't added to journey as part of tests
  const triggerStep = await sdk.api.automation_steps.createOne({
    journeyId: journey.id,
    events: [{ type: 'onJourneyStart', info: { } }],
    // in practice, this would send a form, so that the next step(s) could handle the response
    // but we don't want to send emails in testing, and can still attach this Id to a form response to test a trigger
    action: {
      type: 'setEnduserStatus', 
      info: { status: 'start' },
    },
  })

  const unsub = await sdk.api.automation_steps.createOne({
    journeyId: journey.id,
    events: [{ 
      type: 'formsUnsubmitted', 
      info: { 
        automationStepId: triggerStep.id,
        delayInMS: 10000, // should't trigger 
        delay: 0, unit: 'Seconds', // don't matter
        cancelConditions: [
          // { type: 'formResponse', info: { automationStepId: triggerStep.id }}
        ]
      } 
    }],
    action: {
      type: 'setEnduserStatus',
      info: { status: 'triggered' },
    },
  })

  // test for all forms submitted triggering update
  await sdk.api.automation_steps.createOne({
    journeyId: journey.id,
    events: [{ 
      type: 'formResponses', 
      info: { automationStepId: triggerStep.id } 
    }],
    action: {
      type: 'setEnduserStatus',
      info: { status: 'formsSubmitted' },
    },
  })
  
  // triggers formsUnsubmitted automated actions to be created when forms generated in templated message
  await sdk.api.templates.get_templated_message({
    channel: 'Email',
    enduserId: enduser.id,
    message: `{{forms.${form.id}.link:title}} {{forms.${form.id}.link:title}}`,
    userId: sdk.userInfo.id,
    automationStepId: triggerStep.id,
  })

  const form_responses = await sdk.api.form_responses.getSome()

  // allow fast followup to trigger
  await wait(undefined, 2500) // allow background creation with generous pause


  await async_test(
    `FormsUnsubmitted action created with cancel conditions`,
    () => sdk.api.automated_actions.getSome(),
    { onResult: as =>  {
      const match = as.find(a => a.automationStepId === unsub.id)
      return !!(
         as.length === 1
      && match?.status === 'active'
      && match?.event.type === 'formsUnsubmitted'
      && match.event.info.cancelConditions?.find(c => 
             c.type === 'formResponses' 
          && c.info.automationStepId === triggerStep.id
          && c.info.unsubmittedFormCount === 2
        )
      )
    }}
  )  
  await async_test(
    `formResponses not triggered with all forms unsubmitted`,
    () => sdk.api.endusers.getOne(enduser.id),
    { onResult: e => e?.journeys?.[journey.id] !== 'formsSubmitted' }
  )  

  // trigger cancel conditions
  await sdk.api.form_responses.submit_form_response({ accessCode: form_responses[0].accessCode!, automationStepId: triggerStep.id, responses: [{
    answer: {
      type: 'string',
      value: 'answer'
    },
    fieldId: field.id,
    fieldTitle: field.title,
  }] })
  await wait(undefined, 2500) // allow background creation with generous pause

  await async_test(
    `FormsUnsubmitted cancel conditions working`,
    () => sdk.api.automated_actions.getSome(),
    { onResult: as =>  {
      const match = as.find(a => a.automationStepId === unsub.id)
      return !!(
         as.length === 1
      && match?.status === 'active'
      && match?.event.type === 'formsUnsubmitted'
      && match.event.info.cancelConditions?.find(c => 
             c.type === 'formResponses' 
          && c.info.automationStepId === triggerStep.id
          && c.info.unsubmittedFormCount === 1
        )
      )
    }}
  )  
  await async_test(
    `formResponses not triggered yet after 1 form remaining`,
    () => sdk.api.endusers.getOne(enduser.id),
    { onResult: e => e?.journeys?.[journey.id] !== 'formsSubmitted' }
  )  

  await sdk.api.form_responses.submit_form_response({ accessCode: form_responses[1].accessCode!, automationStepId: triggerStep.id, responses: [{
    answer: {
      type: 'string',
      value: 'answer'
    },
    fieldId: field.id,
    fieldTitle: field.title,
  }] })

  await wait(undefined, 4000) // allow background creation with generous pause

  await async_test(
    `FormsUnsubmitted cancel conditions work`,
    () => sdk.api.automated_actions.getSome(),
    { onResult: as =>  {
      const match = as.find(a => a.automationStepId === unsub.id)
      return !!(
         as.length === 2 // this now includes formResponses event as well, which we test has worked in the next test
      && match?.status === 'cancelled'
      && match?.event.type === 'formsUnsubmitted'
      && match.event.info.cancelConditions?.find(c => 
             c.type === 'formResponses' 
          && c.info.automationStepId === triggerStep.id
          && c.info.unsubmittedFormCount === 0
        )
      )
    }}
  )  
  await async_test(
    `formResponses triggered after both forms submitted`,
    () => pollForResults(
      () => sdk.api.endusers.getOne(enduser.id),
      e => e?.journeys?.[journey.id] === 'formsSubmitted',
      500,
      10,
    ),
    passOnAnyResult
  )  

  await Promise.all([
    sdk.api.forms.deleteOne(form.id),
    sdk.api.journeys.deleteOne(journey.id),
    sdk.api.endusers.deleteOne(enduser.id)
  ])
}

// to ensure that unsubmitted branch can complete and then complete form still triggers next branch
export const formsUnsubmittedTest = async () => {
  log_header("formsUnsubmitted Tests")

  const enduser = await sdk.api.endusers.createOne({ email: 'deletemeee@tellescope.com' })
  const journey = await sdk.api.journeys.createOne({ title: 'test journey '})
  const form = await sdk.api.forms.createOne({ title: 'test form' })
  const field = await sdk.api.form_fields.createOne({
    formId: form.id, title: 'question', type: 'string', 
    previousFields: [{ type: 'root', info: {} }]
  })

  // this action won't be fired, because patient isn't added to journey as part of tests
  const triggerStep = await sdk.api.automation_steps.createOne({
    journeyId: journey.id,
    events: [{ type: 'onJourneyStart', info: { } }],
    // in practice, this would send a form, so that the next step(s) could handle the response
    // but we don't want to send emails in testing, and can still attach this Id to a form response to test a trigger
    action: {
      type: 'setEnduserStatus', 
      info: { status: 'start' },
    },
  })

  await sdk.api.automation_steps.createOne({
    journeyId: journey.id,
    events: [{ 
      type: 'formsUnsubmitted', 
      info: { 
        automationStepId: triggerStep.id,
        delayInMS: 0, // *SHOULD* trigger 
        delay: 0, unit: 'Seconds', // don't matter
        cancelConditions: [
          // { type: 'formResponse', info: { automationStepId: triggerStep.id }}
        ]
      } 
    }],
    action: {
      type: 'setEnduserStatus',
      info: { status: 'triggered' },
    },
  })

  // test for all forms submitted triggering update
  await sdk.api.automation_steps.createOne({
    journeyId: journey.id,
    events: [{ 
      type: 'formResponses', 
      info: { automationStepId: triggerStep.id } 
    }],
    action: {
      type: 'setEnduserStatus',
      info: { status: 'formsSubmitted' },
    },
  })
  
  // triggers formsUnsubmitted automated actions to be created when forms generated in templated message
  await sdk.api.templates.get_templated_message({
    channel: 'Email',
    enduserId: enduser.id,
    message: `{{forms.${form.id}.link:title}} {{forms.${form.id}.link:title}}`,
    userId: sdk.userInfo.id,
    automationStepId: triggerStep.id,
  })

  const form_responses = await sdk.api.form_responses.getSome()

  await async_test(
    `formsUnsubmitted handler worked`,
    () => pollForResults(
      () => sdk.api.endusers.getOne(enduser.id),
      e => e?.journeys?.[journey.id] === 'triggered',
      1000,
      10
    ),
    passOnAnyResult,
  )  

  // trigger cancel conditions
  await sdk.api.form_responses.submit_form_response({ accessCode: form_responses[0].accessCode!, automationStepId: triggerStep.id, responses: [{
    answer: {
      type: 'string',
      value: 'answer'
    },
    fieldId: field.id,
    fieldTitle: field.title,
  }] })
  await wait(undefined, 5000) // allow background creation with generous pause

  await async_test(
    `formResponses not triggered yet after 1 form remaining`,
    () => sdk.api.endusers.getOne(enduser.id),
    { onResult: e => e?.journeys?.[journey.id] !== 'formsSubmitted' }
  )  

  await sdk.api.form_responses.submit_form_response({ accessCode: form_responses[1].accessCode!, automationStepId: triggerStep.id, responses: [{
    answer: {
      type: 'string',
      value: 'answer'
    },
    fieldId: field.id,
    fieldTitle: field.title,
  }] })

  await wait(undefined, 5000) // allow background creation with generous pause

  await async_test(
    `formResponses triggered after both forms submitted`,
    () => sdk.api.endusers.getOne(enduser.id),
    { onResult: e => e?.journeys?.[journey.id] === 'formsSubmitted' }
  )  

  await Promise.all([
    sdk.api.forms.deleteOne(form.id),
    sdk.api.journeys.deleteOne(journey.id),
    sdk.api.endusers.deleteOne(enduser.id)
  ])
}

export const formsSubmittedNoUnsubmittedTest = async () => {
  log_header("formsSubmitted, with no unsubmitted branch, Tests")

  const enduser = await sdk.api.endusers.createOne({ email: 'deletemeee@tellescope.com' })
  const journey = await sdk.api.journeys.createOne({ title: 'test journey '})
  const form = await sdk.api.forms.createOne({ title: 'test form' })
  const field = await sdk.api.form_fields.createOne({
    formId: form.id, title: 'question', type: 'string', 
    previousFields: [{ type: 'root', info: {} }]
  })

  // this action won't be fired, because patient isn't added to journey as part of tests
  const triggerStep = await sdk.api.automation_steps.createOne({
    journeyId: journey.id,
    events: [{ type: 'onJourneyStart', info: { } }],
    // in practice, this would send a form, so that the next step(s) could handle the response
    // but we don't want to send emails in testing, and can still attach this Id to a form response to test a trigger
    action: {
      type: 'setEnduserStatus', 
      info: { status: 'start' },
    },
  })

  // test for all forms submitted triggering update
  await sdk.api.automation_steps.createOne({
    journeyId: journey.id,
    events: [{ 
      type: 'formResponses', 
      info: { automationStepId: triggerStep.id } 
    }],
    action: {
      type: 'setEnduserStatus',
      info: { status: 'formsSubmitted' },
    },
  })

  // simulates sending 2 outstanding forms to pt with expected follow-up
  await sdk.api.templates.get_templated_message({
    channel: 'Email',
    enduserId: enduser.id,
    message: `{{forms.${form.id}.link:title}} {{forms.${form.id}.link:title}}`,
    userId: sdk.userInfo.id,
    automationStepId: triggerStep.id,
  })
  
  const form_responses = await sdk.api.form_responses.getSome()

  // trigger submission
  await sdk.api.form_responses.submit_form_response({ accessCode: form_responses[0].accessCode!, automationStepId: triggerStep.id, responses: [{
    answer: {
      type: 'string',
      value: 'answer'
    },
    fieldId: field.id,
    fieldTitle: field.title,
  }] })
  await wait(undefined, 5000) // allow background creation with generous pause

  await async_test(
    `formResponses not triggered yet after 1 form remaining`,
    () => sdk.api.endusers.getOne(enduser.id),
    { onResult: e => e?.journeys?.[journey.id] !== 'formsSubmitted' }
  )  

  await sdk.api.form_responses.submit_form_response({ accessCode: form_responses[1].accessCode!, automationStepId: triggerStep.id, responses: [{
    answer: {
      type: 'string',
      value: 'answer'
    },
    fieldId: field.id,
    fieldTitle: field.title,
  }] })

  await wait(undefined, 5000) // allow background creation with generous pause

  await async_test(
    `formResponses triggered after both forms submitted`,
    () => sdk.api.endusers.getOne(enduser.id),
    { onResult: e => e?.journeys?.[journey.id] === 'formsSubmitted' }
  )  

  await Promise.all([
    sdk.api.forms.deleteOne(form.id),
    sdk.api.journeys.deleteOne(journey.id),
    sdk.api.endusers.deleteOne(enduser.id)
  ])
}


// ensure child steps come from the same journey
export const automationSameJourneyTests = async () => {
  log_header("automationSameJourney")

  const journey = await sdk.api.journeys.createOne({ title: 'test journey' })
  const journey2 = await sdk.api.journeys.createOne({ title: 'test other journey' })
 
  // this action won't be fired, because patient isn't added to journey as part of tests
  const badRoot = await sdk.api.automation_steps.createOne({
    journeyId: journey.id,
    events: [{ type: 'onJourneyStart', info: { } }],
    // in practice, this would send a form, so that the next step(s) could handle the response
    // but we don't want to send emails in testing, and can still attach this Id to a form response to test a trigger
    action: {
      type: 'setEnduserStatus', 
      info: { status: 'start' },
    },
  })

  await async_test(
    `can't create child of other journey`,
    () => (
      sdk.api.automation_steps.createOne({
        journeyId: journey2.id,
        events: [{ 
          type: 'afterAction', 
          info: { automationStepId: badRoot.id, delay: 0, delayInMS: 0, unit:'Days' } 
        }],
        action: { type: 'setEnduserStatus', info: { status: 'irrelevant' } },
      })
    ),
    handleAnyError
  )  

  await Promise.all([
    sdk.api.journeys.deleteOne(journey.id),
    sdk.api.journeys.deleteOne(journey2.id)
  ])
}

const addToJourneyTests = async () => {
  log_header("Add / Re-add to Journey")

  const journey = await sdk.api.journeys.createOne({ title: 'test journey' })
  const enduser = await sdk.api.endusers.createOne({ email: 'test@tellescope.com' })

  const root = await (
    sdk.api.automation_steps.createOne({
      journeyId: journey.id,
      events: [{ type: 'onJourneyStart', info: { } }],
      action: { type: 'setEnduserStatus', info: { status: 'Root' }, },
    })
  )
  const follow = await (
    sdk.api.automation_steps.createOne({
      journeyId: journey.id,
      events: [{ type: 'afterAction', info: { 
        automationStepId: root.id,
        delay: 100000,
        delayInMS: 100000, // big number, so shouldn't trigger
        unit: 'Seconds',
      } }],
      action: { type: 'setEnduserStatus', info: { status: 'Delayed Step' }, },
    })
  )

  // add to journey and re-add
  await sdk.api.endusers.add_to_journey({ enduserIds: [enduser.id], journeyId: journey.id })

  await async_test(
    `Journey state correctly set by add_to_journey (to default state)`,
    () => sdk.api.endusers.getOne(enduser.id),
    { onResult: e => e.journeys?.[journey.id] === '' || e.journeys?.[journey.id] === 'Root' } 
  )  

  // ensure that second step is generated before first is cancelled
  await pollForResults(
    sdk.api.automated_actions.getSome,
    es => es.length === 2,
    100,
    100,
  ),

  await sdk.api.endusers.add_to_journey({ enduserIds: [enduser.id], journeyId: journey.id })

  await async_test(
    `Enduser correctly added and re-added`,
    () => pollForResults(
      sdk.api.automated_actions.getSome,
      es => (es.length === 4
        && es.filter(e => e.status === 'cancelled' && e.automationStepId === follow.id).length === 1 // one afterAction is cancelled
        && es.filter(e => e.status === 'active' && e.automationStepId === follow.id).length === 1 // one afterAction is still active
        && es.filter(e => e.status === 'finished' && e.automationStepId === root.id).length === 2 // two initial onJourneyStart
      ),
      250,
      40
    ),
    passOnAnyResult
  ) 

  await async_test(
    `Enduser throttle journey add working`,
    () => sdk.api.endusers.add_to_journey({ enduserIds: [enduser.id], journeyId: journey.id, throttle: true }),
    handleAnyError
  )

  await Promise.all([ 
    sdk.api.journeys.deleteOne(journey.id),
    sdk.api.endusers.deleteOne(enduser.id),
  ])
}

const directAutomatedActionTest = async () => {
  log_header("Manual Action Tests")

  const enduser = await sdk.api.endusers.createOne({ fname: 'test' })
  const action = await sdk.api.automated_actions.createOne({ 
    event: {
      type: 'onJourneyStart',
      info: {}
    },
    action: {
      type: 'setEnduserStatus',
      info: { status: "Working" }
    },
    enduserId: enduser.id,
    processAfter: 0,
    status: 'active',
    automationStepId: PLACEHOLDER_ID,
    journeyId: PLACEHOLDER_ID,
  })

  await async_test(
    `Enduser status set by manual automated action`,
    () => pollForResults(
      () => sdk.api.endusers.getOne(enduser.id),
      e => e.journeys?.[PLACEHOLDER_ID] === 'Working',
      1000,
      10
    ),
    passOnAnyResult
  )  

  await async_test(
    `Automated action is finished`,
    () => sdk.api.automated_actions.getOne(action.id),
    { onResult: e => e.status === 'finished' }
  )  

  await Promise.all([
    sdk.api.endusers.deleteOne(enduser.id),
    sdk.api.automated_actions.deleteOne(action.id) ,
  ])
}

const automation_events_tests = async () => {
  log_header("Automation Events")
  await directAutomatedActionTest()
  await formsSubmittedNoUnsubmittedTest()
  await automationSameJourneyTests()
  await formsUnsubmittedTest()
  await formsUnsubmittedCancelConditionTest() 
  await formUnsubmittedCancelConditionTest()
  await addToJourneyTests()
  await sequenceTests()
  await formEventTests()
  await ticketEventTests()
  await removeFromJourneyTests() 
}

const formSubmittedTriggerTests = async () => {
  log_header("Automation Trigger: Form Response --> Add To Journey")

  const enduser = await sdk.api.endusers.createOne({ fname: 'test' })
  const journey1 = await sdk.api.journeys.createOne({ title: 'journey' })
  const journey2 = await sdk.api.journeys.createOne({ title: 'journey2' })
  const journey3 = await sdk.api.journeys.createOne({ title: 'journey3' })
  const form = await sdk.api.forms.createOne({ title: 'form' })
  const field = await sdk.api.form_fields.createOne({ 
    formId: form.id,
    type: 'string',
    title: 'Test',
    previousFields: [
      {
        type: 'root',
        info: {},
      }
    ],
  })

  const active = await sdk.api.automation_triggers.createOne({ 
    event: { type: 'Form Submitted', info: { formId: form.id }},
    action: { type: 'Add To Journey', info: { journeyId: journey1.id }},
    status: 'Active',
    title: "Active"
  })
  const dupActive = await sdk.api.automation_triggers.createOne({ 
    event: { type: 'Form Submitted', info: { formId: form.id }},
    action: { type: 'Add To Journey', info: { journeyId: journey2.id }},
    status: 'Active',
    title: "Dup Active"
  })
  const inactive = await sdk.api.automation_triggers.createOne({ 
    event: { type: 'Form Submitted', info: { formId: form.id }},
    action: { type: 'Add To Journey', info: { journeyId: journey3.id }},
    status: 'Inactive',
    title: "Inactive"
  })

  const noConditions = await sdk.api.automation_triggers.createOne({ 
    event: { 
      type: 'Form Submitted', 
      info: { 
        formId: form.id,
      },
    },
    action: { type: 'Add Tags', info: { tags: ['No Conditions'] }},
    status: 'Active',
    title: "No Conditions"
  })
  const equals = await sdk.api.automation_triggers.createOne({ 
    event: { 
      type: 'Form Submitted', 
      info: { 
        formId: form.id,
      },
      conditions : {
        "$and" : [
            {
              "condition" : {
                  [field.id]: "trigger 2"
              }
            }
        ]
      },
    },
    action: { type: 'Add Tags', info: { tags: ['Equals'] }},
    status: 'Active',
    title: "Equals"
  })
  const equalsFalse = await sdk.api.automation_triggers.createOne({ 
    event: { 
      type: 'Form Submitted', 
      info: { 
        formId: form.id,
      },
      conditions : {
        "$and" : [
            {
              "condition" : {
                  [field.id]: "tri"
              }
            }
        ]
      },
    },
    action: { type: 'Add Tags', info: { tags: ['No'] }},
    status: 'Active',
    title: "Equals False"
  })
  const existsTrue = await sdk.api.automation_triggers.createOne({ 
    event: { 
      type: 'Form Submitted', 
      info: { 
        formId: form.id,
      },
      conditions : {
        "$and" : [
            {
              "condition" : {
                  [field.id]: { $exists: true }
              }
            }
        ]
      },
    },
    action: { type: 'Add Tags', info: { tags: ['exists'] }},
    status: 'Active',
    title: "Exists true"
  })
  const existsFalse = await sdk.api.automation_triggers.createOne({ 
    event: { 
      type: 'Form Submitted', 
      info: { 
        formId: form.id,
      },
      conditions : {
        "$and" : [
            {
              "condition" : {
                  [field.id]: { $exists: false }
              }
            }
        ]
      },
    },
    action: { type: 'Add Tags', info: { tags: ['No'] }},
    status: 'Active',
    title: "Exists False"
  })
  const doesNotContainTrue = await sdk.api.automation_triggers.createOne({ 
    event: { 
      type: 'Form Submitted', 
      info: { 
        formId: form.id,
      },
      conditions : {
        "$and" : [
            {
              "condition" : {
                  [field.id]: {
                      "$doesNotContain" : "tri2"
                  }
              }
            }
        ]
      },
    },
    action: { type: 'Add Tags', info: { tags: ['doesNotContain'] }},
    status: 'Active',
    title: "doesNotContainTrue"
  })
  const doesNotContainFalse = await sdk.api.automation_triggers.createOne({ 
    event: { 
      type: 'Form Submitted', 
      info: { 
        formId: form.id,
      },
      conditions : {
        "$and" : [
            {
              "condition" : {
                  [field.id]: {
                      "$doesNotContain" : "tri"
                  }
              }
            }
        ]
      },
    },
    action: { type: 'Add Tags', info: { tags: ['No'] }},
    status: 'Active',
    title: "doesNotContainFalse"
  })
  const containFalse = await sdk.api.automation_triggers.createOne({ 
    event: { 
      type: 'Form Submitted', 
      info: { 
        formId: form.id,
      },
      conditions : {
        "$and" : [
            {
              "condition" : {
                  [field.id]: {
                      "$contains" : "tri2"
                  }
              }
            }
        ]
      },
    },
    action: { type: 'Add Tags', info: { tags: ['No'] }},
    status: 'Active',
    title: "containFalse"
  })
  const containTrue = await sdk.api.automation_triggers.createOne({ 
    event: { 
      type: 'Form Submitted', 
      info: { 
        formId: form.id,
      },
      conditions : {
        "$and" : [
            {
              "condition" : {
                  [field.id]: {
                      "$contains" : "tri"
                  }
              }
            }
        ]
      },
    },
    action: { type: 'Add Tags', info: { tags: ['contains'] }},
    status: 'Active',
    title: "containTrue"
  })

  const { accessCode } = await sdk.api.form_responses.prepare_form_response({
    enduserId: enduser.id,
    formId: form.id,
  })

  await sdk.api.form_responses.submit_form_response({
    accessCode,
    responses: [
      {
        fieldId: field.id,
        fieldTitle: field.title,
        answer: {
          type: 'string',
          value: 'trigger 2',
        },
      },
    ],
  })

  // allow triggers to happen
  await wait(undefined, 1000)

  await async_test(
    `Triggers with conditional works`,
    () => sdk.api.endusers.getOne(enduser.id),
    { onResult: e => !!(
       e.tags?.includes('Equals') 
    && e.tags?.includes('contains')
    && e.tags?.includes('exists')
    && e.tags?.includes('No Conditions')
    && e.tags?.includes('doesNotContain')
    && !e.tags?.includes('No')
    )}
  )  

  await async_test(
    `Automated triggers work`,
    () => sdk.api.endusers.getOne(enduser.id),
    { onResult: e => !!(
       e.journeys?.[journey1.id] === ''
    && e.journeys?.[journey2.id] === ''
    && e.journeys?.[journey3.id] === undefined
    ) }
  )  
  await Promise.all([
    sdk.api.journeys.deleteOne(journey1.id),
    sdk.api.journeys.deleteOne(journey2.id),
    sdk.api.journeys.deleteOne(journey3.id),
    sdk.api.endusers.deleteOne(enduser.id),
    sdk.api.forms.deleteOne(form.id),
    sdk.api.automation_triggers.deleteOne(active.id),
    sdk.api.automation_triggers.deleteOne(dupActive.id),
    sdk.api.automation_triggers.deleteOne(inactive.id),
    sdk.api.automation_triggers.deleteOne(equals.id),
    sdk.api.automation_triggers.deleteOne(doesNotContainTrue.id),
    sdk.api.automation_triggers.deleteOne(containTrue.id),
    sdk.api.automation_triggers.deleteOne(noConditions.id),
    sdk.api.automation_triggers.deleteOne(existsTrue.id),
    sdk.api.automation_triggers.deleteOne(existsFalse.id),
    sdk.api.automation_triggers.deleteOne(containFalse.id),
    sdk.api.automation_triggers.deleteOne(equalsFalse.id),
    sdk.api.automation_triggers.deleteOne(doesNotContainFalse.id),
  ])
}

const order_created_tests = async () => {
  log_header("Automation Trigger Tests (Order Created)")

  const t1 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Order Created', info: {} },
    action: { type: 'Add Tags', info: { tags: ['No conditions'] }},
    status: 'Active',
    title: "No conditions"
  })
  const t2 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Order Created', info: { titles: ['Title'] } },
    action: { type: 'Add Tags', info: { tags: ['Title'] }},
    status: 'Active',
    title: "Title Condition"
  })
  const t3 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Order Created', info: { fills: ['Fill'] } },
    action: { type: 'Add Tags', info: { tags: ['Fill'] }},
    status: 'Active',
    title: "Fill Condition"
  })
  const t4 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Order Created', info: { partialFrequency: 'freq' } },
    action: { type: 'Add Tags', info: { tags: ['Frequency'] }},
    status: 'Active',
    title: "Frequency Condition"
  })

  const e = await sdk.api.endusers.createOne({})

  await sdk.api.enduser_orders.createOne({ status: 'test', source: 'test', title: 'nomatch', fill: 'nomatch', frequency: 'nomatch', externalId: '1', enduserId: e.id })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "First tag is added",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !!(
       e.tags?.length === 1
    && e.tags?.includes('No conditions')
    && !e.tags?.includes('Title')
    && !e.tags?.includes('Fill')
    && !e.tags?.includes('Frequency')
    ) }
  )

  await sdk.api.enduser_orders.createOne({ status: 'test', source: 'test', externalId: '2', enduserId: e.id, title: "Title" })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Second tag is added",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !!(
       e.tags?.length === 2
    && e.tags?.includes('No conditions')
    && e.tags?.includes('Title')
    && !e.tags?.includes('Fill')
    && !e.tags?.includes('Frequency')
    ) }
  )

  await sdk.api.enduser_orders.createOne({ status: 'test', source: 'test', externalId: '3', enduserId: e.id, title: "Title", fill: "Fill" })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Third tag is added",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !!(
       e.tags?.length === 3
    && e.tags?.includes('No conditions')
    && e.tags?.includes('Title')
    && e.tags?.includes('Fill')
    && !e.tags?.includes('Frequency')
    ) }
  )

  await sdk.api.enduser_orders.createOne({ status: 'test', source: 'test', externalId: '4', enduserId: e.id, title: "Title", fill: "Fill", frequency: '1029freq--29' })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Fourth tag is added",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !!(
       e.tags?.length === 4
    && e.tags?.includes('No conditions')
    && e.tags?.includes('Title')
    && e.tags?.includes('Fill')
    && e.tags?.includes('Frequency')
    ) }
  )

  await Promise.all([
    sdk.api.automation_triggers.deleteOne(t1.id),
    sdk.api.automation_triggers.deleteOne(t2.id),
    sdk.api.automation_triggers.deleteOne(t3.id),
    sdk.api.automation_triggers.deleteOne(t4.id),
    sdk.api.endusers.deleteOne(e.id),
  ])
}

const order_status_equals_tests = async () => {
  log_header("Automation Trigger Tests (Order Status Equals)")

  const t1 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Order Status Equals', info: { source: 'Source', status: "Status",  } },
    action: { type: 'Add Tags', info: { tags: ['Source'] }},
    status: 'Active',
    title: "No conditions"
  })
  const t2 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Order Status Equals', info: { source: 'Source', status: "Filled", fills: ['Fill'] } },
    action: { type: 'Add Tags', info: { tags: ['Fill'] }},
    status: 'Active',
    title: "Fill Condition"
  })
  const t3 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Order Status Equals', info: { source: 'Source', status: "Update" } },
    action: { type: 'Add Tags', info: { tags: ['Status Update'] }},
    status: 'Active',
    title: "No conditions"
  })
  const t4 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Order Status Equals', info: { source: 'Source', status: "Update", fills: ['Update'] } },
    action: { type: 'Add Tags', info: { tags: ['Fill Update'] }},
    status: 'Active',
    title: "Fill Condition"
  })
  const t5 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Order Status Equals', info: { source: 'Source', status: "Update", skus: ['SKU'] } },
    action: { type: 'Add Tags', info: { tags: ['SKU Update'] }},
    status: 'Active',
    title: "SKU Condition"
  })
  const t6 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Order Status Equals', info: { source: 'Source', status: "Update", skuPartials: ['SKU-PARTIAL'] } },
    action: { type: 'Add Tags', info: { tags: ['SKU Partial Update'] }},
    status: 'Active',
    title: "SKU Partial Condition"
  })
  const t7 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Order Status Equals', info: { source: 'Source', status: "Update", titlePartials: ['TITLE-PARTIAL'] } },
    action: { type: 'Add Tags', info: { tags: ['Title Partial Update'] }},
    status: 'Active',
    title: "Title Partial Condition"
  })

  const e = await sdk.api.endusers.createOne({})

  await sdk.api.enduser_orders.createOne({ status: 'Nooo', source: 'Source', title: 'nomatch', externalId: '1', enduserId: e.id })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "No tag is added (no fill)",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !e.tags?.length }
  )

  await sdk.api.enduser_orders.createOne({ status: 'Filled', source: 'Source', title: 'nomatch', externalId: '2', enduserId: e.id, fill: 'nomatch' })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "No tag is added (fill mistmatch)",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !e.tags?.length }
  )

  await sdk.api.enduser_orders.createOne({ status: 'Status', source: 'Source', externalId: '3', enduserId: e.id, title: "Title" })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "First tag is added",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !!(
       e.tags?.length === 1
    && e.tags?.includes('Source')
    ) }
  )

  await sdk.api.enduser_orders.createOne({ status: 'Status', source: 'Source', externalId: '4', enduserId: e.id, title: "Title", fill: '1' })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Fill tag not added yet (mismatch)",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !!(
       e.tags?.length === 1
    && e.tags?.includes('Source')
    && !e.tags?.includes('Fill')
    ) }
  )

  await sdk.api.enduser_orders.createOne({ status: 'Filled', source: 'Source', externalId: '5', enduserId: e.id, title: "Title", fill: "Fill" })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Fill tag added",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !!(
       e.tags?.length === 2
    && e.tags?.includes('Source')
    && e.tags?.includes('Fill')
    ) }
  )

  const u = await sdk.api.enduser_orders.createOne({ status: 'Status', source: 'Source', externalId: '6', enduserId: e.id, title: "Title" })
  await sdk.api.enduser_orders.updateOne(u.id, { status: 'Update' })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Status update tag added",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !!(
       e.tags?.length === 3
    && e.tags?.includes('Source')
    && e.tags?.includes('Fill')
    && e.tags?.includes('Status Update')
    ) }
  )
  
  // duplicate updates get rate limited, so we need to make each update unique
  await sdk.api.enduser_orders.updateOne(u.id, { status: 'Toggle' })
  await sdk.api.enduser_orders.updateOne(u.id, { status: "Update", fill: 'Update', externalId: 'avoid rate limiting' })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Fill update tag added",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !!(
       e.tags?.length === 4
    && e.tags?.includes('Source')
    && e.tags?.includes('Fill')
    && e.tags?.includes('Status Update')
    && e.tags?.includes('Fill Update')
    ) }
  )

  await sdk.api.enduser_orders.updateOne(u.id, { status: 'Toggle', externalId: "also avoid rate limit 1" })
  await sdk.api.enduser_orders.updateOne(u.id, { status: "Update", sku: 'SK', externalId: 'avoid rate limiting 2' })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "SKU update no match",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !!(
       e.tags?.length === 4
    && e.tags?.includes('Source')
    && e.tags?.includes('Fill')
    && e.tags?.includes('Status Update')
    && e.tags?.includes('Fill Update')
    ) }
  )

  await sdk.api.enduser_orders.updateOne(u.id, { status: 'Toggle', externalId: "also avoid rate limit 2" })
  await sdk.api.enduser_orders.updateOne(u.id, { status: "Update", sku: 'SKU', externalId: 'avoid rate limiting 3' })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "SKU update tag added",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !!(
       e.tags?.length === 5
    && e.tags?.includes('Source')
    && e.tags?.includes('Fill')
    && e.tags?.includes('Status Update')
    && e.tags?.includes('Fill Update')
    && e.tags?.includes('SKU Update')
    ) }
  )

  await sdk.api.enduser_orders.updateOne(u.id, { status: 'Toggle', externalId: "also avoid rate limit 3" })
  await sdk.api.enduser_orders.updateOne(u.id, { status: "Update", sku: '___SKU-PARTIAL--_' })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "SKU partial update tag added",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !!(
       e.tags?.length === 6
    && e.tags?.includes('Source')
    && e.tags?.includes('Fill')
    && e.tags?.includes('Status Update')
    && e.tags?.includes('Fill Update')
    && e.tags?.includes('SKU Update')
    && e.tags?.includes('SKU Partial Update')
    ) }
  )

  await sdk.api.enduser_orders.updateOne(u.id, { status: 'Toggle', externalId: "also avoid rate limit 4" })
  await sdk.api.enduser_orders.updateOne(u.id, { status: "Update", title: "TITLE-PARTIAL" })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Title partial update tag added",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !!(
       e.tags?.length === 7
    && e.tags?.includes('Source')
    && e.tags?.includes('Fill')
    && e.tags?.includes('Status Update')
    && e.tags?.includes('Fill Update')
    && e.tags?.includes('SKU Update')
    && e.tags?.includes('SKU Partial Update')
    && e.tags?.includes('Title Partial Update')
    ) }
  )

  await Promise.all([
    sdk.api.automation_triggers.deleteOne(t1.id),
    sdk.api.automation_triggers.deleteOne(t2.id),
    sdk.api.automation_triggers.deleteOne(t3.id),
    sdk.api.automation_triggers.deleteOne(t4.id),
    sdk.api.automation_triggers.deleteOne(t5.id),
    sdk.api.automation_triggers.deleteOne(t6.id),
    sdk.api.automation_triggers.deleteOne(t7.id),
    sdk.api.endusers.deleteOne(e.id),
  ])
}

const tag_added_tests = async () => {
  log_header("Automation Trigger Tests (Tag Added)")

  const t1 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Tag Added', info: { tag: "1" } },
    action: { type: 'Add Tags', info: { tags: ['1 Added'] }},
    status: 'Active',
    title: "No conditions"
  })
  const t2 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Tag Added', info: { tag: "2" } },
    action: { type: 'Add Tags', info: { tags: ['2 Added'] }},
    status: 'Active',
    title: "Title Condition"
  })
  const t3 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Tag Added', info: { tag: "3" } },
    action: { type: 'Add Tags', info: { tags: ['3 Added'] }},
    status: 'Active',
    title: "Fill Condition"
  })

  const e = await sdk.api.endusers.createOne({})

  await sdk.api.endusers.updateOne(e.id, { fname: 'no tags added'})
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "No tags added",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !e.tags?.length }
  )

  await sdk.api.endusers.updateOne(e.id, { tags: ['1'] })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Tag 1 added",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !!(
       e.tags?.length === 2
      && e.tags.includes('1')
      && e.tags.includes('1 Added')
    ) }
  )

  await sdk.api.endusers.updateOne(e.id, { tags: ['4'] })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    'Unrecognized tag added',
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !!(
        e.tags?.length === 3
      && e.tags.includes('1')
      && e.tags.includes('1 Added')
      && e.tags.includes('4')
    )}
  )

  await sdk.api.endusers.updateOne(e.id, { tags: ['2', '3'] })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Tag 2 and 3 added",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !!(
        e.tags?.length === 7
      && e.tags.includes('1')
      && e.tags.includes('1 Added')
      && e.tags.includes('4')
      && e.tags.includes('2')
      && e.tags.includes('3')
      && e.tags.includes('2 Added')
      && e.tags.includes('3 Added')
    )}
  )


  await Promise.all([
    sdk.api.automation_triggers.deleteOne(t1.id),
    sdk.api.automation_triggers.deleteOne(t2.id),
    sdk.api.automation_triggers.deleteOne(t3.id),
    sdk.api.endusers.deleteOne(e.id),
  ])
}

const appointment_cancelled_tests = async () => {
  log_header("Automation Trigger Tests (Appointment Cancelled)")

  const t1 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Appointment Cancelled', info: { } },
    action: { type: 'Add Tags', info: { tags: ['By Any'] }},
    status: 'Active',
    title: "By Any"
  })
  const t2 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Appointment Cancelled', info: { titles: ['Title']  } },
    action: { type: 'Add Tags', info: { tags: ['By Title'] }},
    status: 'Active',
    title: "By Title"
  })
  const t3 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Appointment Cancelled', info: { templateIds: [PLACEHOLDER_ID] } },
    action: { type: 'Add Tags', info: { tags: ['By templateId'] }},
    status: 'Active',
    title: "By templateId"
  })
  const t4 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Appointment Cancelled', info: { by: 'enduser' } },
    action: { type: 'Add Tags', info: { tags: ['By enduser'] }},
    status: 'Active',
    title: "By enduser"
  })
  const t5 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Appointment Cancelled', info: { by: 'user' } },
    action: { type: 'Add Tags', info: { tags: ['By user'] }},
    status: 'Active',
    title: "By user"
  })

  const e = await sdk.api.endusers.createOne({})

  const event1 = await sdk.api.calendar_events.createOne({ title: 'Test', durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })
  await wait(undefined, 500) // allow triggers to happen (nothing should trigger til cancelled)
  await async_test(
    "No tags added",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !e.tags?.length }
  )

  const event2 = await sdk.api.calendar_events.createOne({ title: 'Test 2', durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })
  await sdk.api.calendar_events.updateOne(event2.id, { cancelledAt: new Date() })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Any cancel",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => 
        e.tags?.length === 1
     && e.tags.includes('By Any')
    }
  )

  const event3 = await sdk.api.calendar_events.createOne({ title: 'Title', durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })
  await sdk.api.calendar_events.updateOne(event3.id, { cancelledAt: new Date() })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "By title",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => 
        e.tags?.length === 2
     && e.tags.includes('By Any')
     && e.tags.includes('By Title')
    }
  )

  const event4 = await sdk.api.calendar_events.createOne({ title: 'Title', templateId: PLACEHOLDER_ID, durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })
  await sdk.api.calendar_events.updateOne(event4.id, { cancelledAt: new Date() })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "By templateId",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => 
        e.tags?.length === 3
     && e.tags.includes('By Any')
     && e.tags.includes('By Title')
     && e.tags.includes('By templateId')
    }
  )


  const event5 = await sdk.api.calendar_events.createOne({ title: 'Title', durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })
  await sdk.api.calendar_events.updateOne(event5.id, { cancelledAt: new Date(), statusChangeSource: { source: 'enduser', identifier: 'Tellescope' } })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "By enduser",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => 
        e.tags?.length === 4
     && e.tags.includes('By Any')
     && e.tags.includes('By Title')
     && e.tags.includes('By templateId')
     && e.tags.includes('By enduser')
    }
  )

  const event6 = await sdk.api.calendar_events.createOne({ title: 'Title', durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })
  await sdk.api.calendar_events.updateOne(event6.id, { cancelledAt: new Date(), statusChangeSource: { source: 'user', identifier: 'Tellescope' } })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "By user",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => 
        e.tags?.length === 5
     && e.tags.includes('By Any')
     && e.tags.includes('By Title')
     && e.tags.includes('By templateId')
     && e.tags.includes('By enduser')
     && e.tags.includes('By user')
    }
  )

  const t6 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Appointment Cancelled', info: { excludeTemplateIds: [PLACEHOLDER_ID] } },
    action: { type: 'Add Tags', info: { tags: ['By excluded templateId'] }},
    status: 'Active',
    title: "By excluded templateId"
  })

  const event7 = await sdk.api.calendar_events.createOne({ title: 'Title', templateId: PLACEHOLDER_ID, durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })
  await sdk.api.calendar_events.updateOne(event7.id, { cancelledAt: new Date() })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Dont trigger when excluded templateId is provided",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => 
        e.tags?.length === 5
     && e.tags.includes('By Any')
     && e.tags.includes('By Title')
     && e.tags.includes('By templateId')
     && e.tags.includes('By enduser')
     && e.tags.includes('By user')
    }
  )

  const event8 = await sdk.api.calendar_events.createOne({ title: 'Title', durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })
  await sdk.api.calendar_events.updateOne(event8.id, { cancelledAt: new Date() })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Do trigger when excluded templateId is not provided",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => 
        e.tags?.length === 6
     && e.tags.includes('By Any')
     && e.tags.includes('By Title')
     && e.tags.includes('By templateId')
     && e.tags.includes('By enduser')
     && e.tags.includes('By user')
     && e.tags.includes('By excluded templateId')
    }
  )


  await Promise.all([
    sdk.api.automation_triggers.deleteOne(t1.id),
    sdk.api.automation_triggers.deleteOne(t2.id),
    sdk.api.automation_triggers.deleteOne(t3.id),
    sdk.api.automation_triggers.deleteOne(t4.id),
    sdk.api.automation_triggers.deleteOne(t5.id),
    sdk.api.automation_triggers.deleteOne(t6.id),
    sdk.api.endusers.deleteOne(e.id),
    sdk.api.calendar_events.deleteOne(event1.id),
    sdk.api.calendar_events.deleteOne(event2.id),
    sdk.api.calendar_events.deleteOne(event3.id),
    sdk.api.calendar_events.deleteOne(event4.id),
    sdk.api.calendar_events.deleteOne(event5.id),
    sdk.api.calendar_events.deleteOne(event6.id),
    sdk.api.calendar_events.deleteOne(event7.id),
    sdk.api.calendar_events.deleteOne(event8.id),
  ])
}

const appointment_created_tests = async () => {
  log_header("Automation Trigger Tests (Appointment Created)")

  const t1 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Appointment Created', info: { } },
    action: { type: 'Add Tags', info: { tags: ['By Any'] }},
    status: 'Active',
    title: "By Any"
  })
  const t2 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Appointment Created', info: { titles: ['Title']  } },
    action: { type: 'Add Tags', info: { tags: ['By Title'] }},
    status: 'Active',
    title: "By Title"
  })
  const t3 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Appointment Created', info: { templateIds: [PLACEHOLDER_ID] } },
    action: { type: 'Add Tags', info: { tags: ['By templateId'] }},
    status: 'Active',
    title: "By templateId"
  })

  const e = await sdk.api.endusers.createOne({})

  const event1 = await sdk.api.calendar_events.createOne({ title: 'Test 2', durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Any cancel",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => 
        e.tags?.length === 1
     && e.tags.includes('By Any')
    }
  )

  const event2 = await sdk.api.calendar_events.createOne({ title: 'Title', durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "By title",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => 
        e.tags?.length === 2
     && e.tags.includes('By Any')
     && e.tags.includes('By Title')
    }
  )

  const event3 = await sdk.api.calendar_events.createOne({ title: 'Title', templateId: PLACEHOLDER_ID, durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "By templateId",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => 
        e.tags?.length === 3
     && e.tags.includes('By Any')
     && e.tags.includes('By Title')
     && e.tags.includes('By templateId')
    }
  )

  const t4 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Appointment Created', info: { excludeTemplateIds: [PLACEHOLDER_ID] } },
    action: { type: 'Add Tags', info: { tags: ['By excluded templateId'] }},
    status: 'Active',
    title: "By excluded templateId"
  })

  const event4 = await sdk.api.calendar_events.createOne({ title: 'Title', templateId: PLACEHOLDER_ID, durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Dont trigger when excluded templateId is provided",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => 
        e.tags?.length === 3
     && e.tags.includes('By Any')
     && e.tags.includes('By Title')
     && e.tags.includes('By templateId')
    }
  )

  const event5 = await sdk.api.calendar_events.createOne({ title: 'Title', durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Do trigger when excluded templateId is not provided",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => 
        e.tags?.length === 4
     && e.tags.includes('By Any')
     && e.tags.includes('By Title')
     && e.tags.includes('By templateId')
     && e.tags.includes('By excluded templateId')
    }
  )


  await Promise.all([
    sdk.api.automation_triggers.deleteOne(t1.id),
    sdk.api.automation_triggers.deleteOne(t2.id),
    sdk.api.automation_triggers.deleteOne(t3.id),
    sdk.api.automation_triggers.deleteOne(t4.id),
    sdk.api.endusers.deleteOne(e.id),
    sdk.api.calendar_events.deleteOne(event1.id),
    sdk.api.calendar_events.deleteOne(event2.id),
    sdk.api.calendar_events.deleteOne(event3.id),
    sdk.api.calendar_events.deleteOne(event4.id),
    sdk.api.calendar_events.deleteOne(event5.id),
  ])
}

const contact_created_tests = async () => {
  log_header("Automation Trigger Tests (Contact Created)")

  const t1 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Contact Created', info: { } },
    action: { type: 'Add Tags', info: { tags: ['No Filter'] }},
    status: 'Active',
    title: "1"
  })
  const t2 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Contact Created', info: { entityTypes: [] } },
    action: { type: 'Add Tags', info: { tags: ['Empty Filter'] }},
    status: 'Active',
    title: "2"
  })
  const t3 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Contact Created', info: { entityTypes: ["Default"] } },
    action: { type: 'Add Tags', info: { tags: ['Default in Filter'] }},
    status: 'Active',
    title: "3"
  })
  const t4 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Contact Created', info: { entityTypes: [PLACEHOLDER_ID] } },
    action: { type: 'Add Tags', info: { tags: ['ID in Filter'] }},
    status: 'Active',
    title: "4"
  })
  const t5 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Contact Created', info: { entityTypes: [PLACEHOLDER_ID, 'Default'] } },
    action: { type: 'Add Tags', info: { tags: ['Both'] }},
    status: 'Active',
    title: "5"
  })

  const e = await sdk.api.endusers.createOne({})
  await wait(undefined, 250) // allow triggers to happen
  await async_test(
    "Default type",
    () => sdk.api.endusers.getOne(e.id),
    { 
      onResult: e => !!(
        e.tags?.length === 4 
        && e.tags?.includes('No Filter') && e.tags?.includes('Empty Filter') && e.tags?.includes('Both')
        && e.tags?.includes('Default in Filter')
      )
    }
  )

  const e2 = await sdk.api.endusers.createOne({ customTypeId: PLACEHOLDER_ID})
  await wait(undefined, 250) // allow triggers to happen
  await async_test(
    "Custom type",
    () => sdk.api.endusers.getOne(e2.id),
    { 
      onResult: e => !!(
        e.tags?.length === 4 
        && e.tags?.includes('No Filter') && e.tags?.includes('Empty Filter') && e.tags?.includes('Both')
        && e.tags?.includes('ID in Filter')
      )
    }
  )



  await Promise.all([
    sdk.api.automation_triggers.deleteOne(t1.id),
    sdk.api.automation_triggers.deleteOne(t2.id),
    sdk.api.automation_triggers.deleteOne(t3.id),
    sdk.api.automation_triggers.deleteOne(t4.id),
    sdk.api.automation_triggers.deleteOne(t5.id),
    sdk.api.endusers.deleteOne(e.id),
    sdk.api.endusers.deleteOne(e2.id),
  ])
}

// includes primary care team tests
const assign_care_team_tests = async () => {
  log_header("Automation Trigger Tests (Assign Care Team)")

  assert(get_care_team_primary({ } ) === undefined, 'get_care_team_primary failed', 'get_care_team_primary missing')
  assert(get_care_team_primary({ assignedTo: []} ) === undefined, 'get_care_team_primary failed', 'get_care_team_primary empty')
  assert(get_care_team_primary({ primaryAssignee: '1' } ) === undefined, 'get_care_team_primary failed', 'get_care_team_primary missing (with primaryAssignee)')
  assert(get_care_team_primary({ assignedTo: [], primaryAssignee: '1' } ) === undefined, 'get_care_team_primary failed', 'get_care_team_primary empty (with primaryAssignee)')
  assert(get_care_team_primary({ assignedTo: ['1', '2', '3']} ) === '1', 'get_care_team_primary failed', 'get_care_team_primary included')
  assert(get_care_team_primary({ assignedTo: ['1', '2'], primaryAssignee: '3' } ) === '1', 'get_care_team_primary failed', 'get_care_team_primary included')
  assert(get_care_team_primary({ assignedTo: ['1', '2'], primaryAssignee: '2' } ) === '2', 'get_care_team_primary failed', 'get_care_team_primary included')
  assert(get_care_team_primary({ assignedTo: ['1', '2'], primaryAssignee: '1' } ) === '1', 'get_care_team_primary failed', 'get_care_team_primary included')

  await sdk.api.users.updateOne(sdk.userInfo.id, { tags: ['Assignment'] }, { replaceObjectFields: true })

  const t1 = await sdk.api.automation_triggers.createOne({
    title: 't1',
    event: { type: 'Tag Added', info: { tag: 'No Match' } },
    action: {
      type: "Assign Care Team",
      info: {
        tags: { qualifier: 'One Of', values: ["_not_a_match"] },
      },
    },
    status: 'Active',
  })
  const t2 = await sdk.api.automation_triggers.createOne({
    title: 't1',
    event: { type: 'Tag Added', info: { tag: 'Trigger' } },
    action: {
      type: "Assign Care Team",
      info: {
        tags: { qualifier: 'One Of', values: ["Assignment"] },
      },
    },
    status: 'Active',
  })
  const t3 = await sdk.api.automation_triggers.createOne({
    title: 't1',
    event: { type: 'Tag Added', info: { tag: 'Trigger Primary' } },
    action: {
      type: "Assign Care Team",
      info: {
        tags: { qualifier: 'One Of', values: ["Assignment"] },
        setAsPrimary: true,
      },
    },
    status: 'Active',
  })
  const e1 = await sdk.api.endusers.createOne({ })

  await sdk.api.endusers.updateOne(e1.id, { tags: ['No Match'] })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "No care team added",
    () => sdk.api.endusers.getOne(e1.id),
    { onResult: e => !e.assignedTo?.length && !e.primaryAssignee },
  )

  await sdk.api.endusers.updateOne(e1.id, { tags: ['Trigger'] })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Care team added",
    () => sdk.api.endusers.getOne(e1.id),
    { onResult: e => e.assignedTo?.length === 1 && !e.primaryAssignee }
  )

  await sdk.api.endusers.updateOne(e1.id, { assignedTo: [], tags: ['Trigger Primary'] }, { replaceObjectFields: true })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Care team added and set as primary",
    () => sdk.api.endusers.getOne(e1.id),
    { onResult: e => e.assignedTo?.length === 1 && e.primaryAssignee === e.assignedTo[0] }
  )

  await Promise.all([
    sdk.api.users.updateOne(sdk.userInfo.id, { tags: [] }, { replaceObjectFields: true }),
    sdk.api.endusers.deleteOne(e1.id),
    sdk.api.automation_triggers.deleteOne(t1.id),
    sdk.api.automation_triggers.deleteOne(t2.id),
    sdk.api.automation_triggers.deleteOne(t3.id),
  ])
}

const set_fields_tests = async () => {
  log_header("Automation Trigger Tests (Set Fields)")
  
  const e1 = await sdk.api.endusers.createOne({  })
  const t1 = await sdk.api.automation_triggers.createOne({
    title: "Appointment Created Fields", status: 'Active',
    event: { type: 'Appointment Created', info: { } },
    action: {
      type: 'Set Fields',
      info: {
        fields: [
          { name: 'test',  value: "Test", type: 'Custom Value' } ,
          { name: 'test2', value: "{{calendar_event.start}}", type: 'Custom Value' } ,
          { name: 'test3', value: "{{calendar_event.title}}", type: 'Custom Value' } ,
        ]
      },
    }
  })
  const t2 = await sdk.api.automation_triggers.createOne({
    title: "Appointment Created Fields", status: 'Active',
    event: { type: 'Tag Added', info: { tag: 'Trigger' } },
    action: {
      type: 'Set Fields',
      info: {
        fields: [
          { name: 'not_appointment',  value: "Test", type: 'Custom Value' } ,
          { name: 'still_not_appointment', value: "Test2", type: 'Custom Value' } ,
        ]
      },
    }
  })

  const a1 = await sdk.api.calendar_events.createOne({ title: 'Test', durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e1.id }] })
  await wait (undefined, 500) // allow triggers to happen
  await async_test(
    "Set fields on appointment created",
    () => sdk.api.endusers.getOne(e1.id),
    { onResult: e => 
      e.fields?.test === 'Test'
      && e.fields?.test2 === new Date(a1.startTimeInMS).toISOString()
      && e.fields?.test3 === a1.title
    }
  )

  await sdk.api.endusers.updateOne(e1.id, { tags: ['Trigger'] })
  await wait (undefined, 500) // allow triggers to happen
  await async_test(
    "Set fields on tag added",
    () => sdk.api.endusers.getOne(e1.id),
    { onResult: e =>
      e.fields?.not_appointment === 'Test'
      && e.fields?.still_not_appointment === 'Test2'
    }
  )
  
  return Promise.all([
    sdk.api.automation_triggers.deleteOne(t1.id),
    sdk.api.automation_triggers.deleteOne(t2.id),
    sdk.api.endusers.deleteOne(e1.id),
    sdk.api.calendar_events.deleteOne(a1.id),
  ])
}

const fields_changed_tests = async () => {
  log_header("Automation Trigger Tests (Fields Changed)")

  const t1 = await sdk.api.automation_triggers.createOne({
    title: "Fname changed", status: 'Active',
    event: { type: 'Fields Changed', info: { fields: ['fname'] } },
    action: { type: 'Add Tags', info: { tags: ['1'] } }
  })
  const t2 = await sdk.api.automation_triggers.createOne({
    title: "Fname and custom field changed", status: 'Active',
    event: { type: 'Fields Changed', info: { fields: ['fname', 'Custom1'] } },
    action: { type: 'Add Tags', info: { tags: ['2'] } }
  })
  const t3 = await sdk.api.automation_triggers.createOne({
    title: "custom field changed", status: 'Active',
    event: { type: 'Fields Changed', info: { fields: ['Custom1'] } },
    action: { type: 'Add Tags', info: { tags: ['3'] } }
  })
  const t4 = await sdk.api.automation_triggers.createOne({
    title: "Fname and custom fields changed", status: 'Active',
    event: { type: 'Fields Changed', info: { fields: ['fname', 'Custom1', 'Custom2'] } },
    action: { type: 'Add Tags', info: { tags: ['4'] } }
  })

  const e1 = await sdk.api.endusers.createOne({ fname: 'hi', fields: { Custom1: "c1", Custom2: 'c2' } })
  await wait (undefined, 500) // allow triggers to happen
  await async_test(
    'No trigger on create',
    () => sdk.api.endusers.getOne(e1.id),
    { onResult: e => !e.tags?.length },
  )

  await sdk.api.endusers.updateOne(e1.id, { lname: 'Trigger', fields: { Custom3: 'c3' } })
  await wait (undefined, 500) // allow triggers to happen
  await async_test(
    'No trigger on unrelated fields',
    () => sdk.api.endusers.getOne(e1.id),
    { onResult: e => !e.tags?.length },
  )

  // changing fname should trigger t1
  await sdk.api.endusers.updateOne(e1.id, { fname: 'hello' })
  await wait (undefined, 500) // allow triggers to happen
  await async_test(
    'Trigger on fname change',
    () => sdk.api.endusers.getOne(e1.id),
    { onResult: e => e.tags?.length === 1 && e.tags.includes('1') },
  )

  // changing custom field should trigger t3
  await sdk.api.endusers.updateOne(e1.id, { fields: { Custom1: 'changed' } })
  await wait (undefined, 500) // allow triggers to happen
  await async_test(
    'Trigger on custom field change',
    () => sdk.api.endusers.getOne(e1.id),
    { onResult: e => e.tags?.length === 2 && e.tags.includes('3') && e.tags.includes('1') },
  ) 

  // changing fname and custom field should trigger t2
  await sdk.api.endusers.updateOne(e1.id, { fname: 'changed', fields: { Custom1: 'changed again' } })
  await wait (undefined, 500) // allow triggers to happen
  await async_test(
    'Trigger on fname and custom field change',
    () => sdk.api.endusers.getOne(e1.id),
    { onResult: e => e.tags?.length === 3 && e.tags.includes('2') && e.tags.includes('3') && e.tags.includes('1') },
  )

  // not changing one of them should not trigger t4
  await sdk.api.endusers.updateOne(e1.id, { fname: 'changed again', fields: { Custom1: 'changed again', Custom2: 'changed' } })
  await wait (undefined, 500) // allow triggers to happen
  await async_test(
    'No trigger on fname and custom fields change',
    () => sdk.api.endusers.getOne(e1.id),
    { onResult: e => e.tags?.length === 3 && e.tags.includes('2') && e.tags.includes('3') && e.tags.includes('1') },
  )

  // changing fname and custom fields should trigger t4
  await sdk.api.endusers.updateOne(e1.id, { fname: 'changed4', fields: { Custom1: 'changed4', Custom2: 'changed4' } })
  await wait (undefined, 500) // allow triggers to happen
  await async_test(
    'Trigger on fname and custom fields change',
    () => sdk.api.endusers.getOne(e1.id),
    { onResult: e => e.tags?.length === 4 && e.tags.includes('4') && e.tags.includes('2') && e.tags.includes('3') && e.tags.includes('1') },
  )
  
  return Promise.all([
    sdk.api.endusers.deleteOne(e1.id),
    sdk.api.automation_triggers.deleteOne(t1.id),
    sdk.api.automation_triggers.deleteOne(t2.id),
    sdk.api.automation_triggers.deleteOne(t3.id),
    sdk.api.automation_triggers.deleteOne(t4.id),
  ])
}

const trigger_events_api_tests = async () => {
  log_header("Automation Trigger Events API Tests")

  const e = await sdk.api.endusers.createOne({ })
  const t1 = await sdk.api.automation_triggers.createOne({
    title: "Trigger Events API Test",
    status: 'Active',
    event: { type: 'Field Equals', info: { field: 'does not matter', value: 'also does not matter' } },
    action: { type: 'Add Tags', info: { tags: ['Trigger Events API Test'] } }
  })

  await sdk.api.automation_triggers.trigger_events({
    triggers: [{
      automationTriggerId: t1.id,
      enduserId: e.id,
    }]
  })
  await wait (undefined, 500) // allow triggers to happen
  await async_test(
    'Trigger event fired (real trigger)',
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !!e.tags?.includes('Trigger Events API Test') }
  )

  await sdk.api.automation_triggers.trigger_events({
    triggers: [{
      automationTriggerId: PLACEHOLDER_ID,
      enduserId: e.id,
      action: {
        type: 'Add Tags',
        info: { tags: ['Placeholder Action'] },
      }
    }]
  })
  await wait (undefined, 500) // allow triggers to happen
  await async_test(
    'Trigger event fired (placeholder trigger)',
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !!e.tags?.includes('Placeholder Action') }
  )


  await Promise.all([
    sdk.api.endusers.deleteOne(e.id),
    sdk.api.automation_triggers.deleteOne(t1.id),
  ])
}

const automation_trigger_tests = async () => {
  log_header("Automation Trigger Tests")

  await order_status_equals_tests()
  await trigger_events_api_tests()
  await fields_changed_tests()
  await field_equals_trigger_tests()
  await set_fields_tests()
  await assign_care_team_tests()
  await contact_created_tests()
  await appointment_cancelled_tests()
  await appointment_created_tests()
  await tag_added_tests()
  await order_created_tests()
  await formSubmittedTriggerTests() 
}

const form_response_tests = async () => {
  log_header("Form Responses")

  const stringResponse = 'Test Response Value'
  const stringIntakeField = 'testIntakeField'
  const stringTitle = 'Test'
  const enduser = await sdk.api.endusers.createOne({ email: "formresponse@tellescope.com" })
  const form = await sdk.api.forms.createOne({
    title: 'test form',
  })
  assert(form.numFields === 0, 'numFields bad init', 'num fields on init')

  const field = await sdk.api.form_fields.createOne({
    formId: form.id,
    title: stringTitle,
    description: 'Enter a string',
    type: 'string',
    isOptional: false,
    intakeField: stringIntakeField,
    previousFields: [{ type: 'root', info: {} }]
  })
  const field2 = await sdk.api.form_fields.createOne({
    formId: form.id,
    title: stringTitle,
    description: 'Enter a string',
    type: 'string',
    isOptional: false,
    intakeField: stringIntakeField,
    previousFields: [{ type: 'root', info: {} }]
  })
  await wait(undefined, 250)

  await async_test(
    `numFields incremented on new field`,
    () => sdk.api.forms.getOne(form.id),
    { onResult: f => f.numFields === 2},
  )  

  await sdk.api.form_fields.deleteOne(field2.id)
  await wait(undefined, 250)
  await async_test(
    `numFields decremented after delete`,
    () => sdk.api.forms.getOne(form.id),
    { onResult: f => f.numFields === 1},
  )  


  // await sdk.api.automation_steps.createOne({
  //   event: { type: "formResponse", info: { formId: form.id } },
  //   action: { type: 'sendWebhook', info: { message: 'test' } },
  // })

  const { accessCode } = await sdk.api.form_responses.prepare_form_response({ formId: form.id, enduserId: enduser.id })
  await sdk.api.form_responses.submit_form_response({ accessCode, responses: [
    {
      fieldTitle: 'doesnot matter',
      fieldId: field.id,
      answer: {
        type: 'string',
        value: stringResponse,
      },
    }
  ]})

  // const [triggeredAutomation] = await sdk.api.automated_actions.getSome()
  const enduserWithUpdate = await sdk.api.endusers.getOne(enduser.id)
  const recordedResponse = await sdk.api.form_responses.getOne({ accessCode })

  // assert(triggeredAutomation?.event?.type === 'formResponse', 'no form response event', 'form response event triggered')
  assert(enduserWithUpdate?.fields?.[stringIntakeField] === stringResponse, 'no enduser update', 'enduser updated')
  assert(
    recordedResponse?.responses?.length === 1 && recordedResponse.responses[0]?.answer.value === stringResponse, 
    'response not recorded', 
    'response recorded'
  )

  await async_test(
    "Can set lockedAt field on form response",
    () => sdk.api.form_responses.updateOne(recordedResponse.id, { lockedAt: new Date() }),
    { onResult: r => !!r.lockedAt }
  )

  await async_test(
    "Can unset lockedAt",
    () => sdk.api.form_responses.updateOne(recordedResponse.id, { lockedAt: '' }),
    { onResult: r => !r.lockedAt }
  )

  await sdk.api.endusers.deleteOne(enduser.id)
  await sdk.api.forms.deleteOne(form.id)
}

export const meetings_tests = async () => {
  log_header("Meetings")

  const enduser = await sdk.api.endusers.createOne({ email })
  await sdk.api.endusers.set_password({ id: enduser.id, password }).catch(console.error)
  await enduserSDK.authenticate(email, password).catch(console.error) 

  const privateMeeting = await sdk.api.meetings.start_meeting({ })
  const publicMeeting = await sdk.api.meetings.start_meeting({ publicRead: true })

  await async_test(
    `Admin can get meetings`,
    sdk.api.meetings.getSome,
    { onResult: () => true },
  ) 
  await async_test(
    `Non-Admin can't get meetings`,
    sdkNonAdmin.api.meetings.getSome,
    { shouldError: true, onError: e => e.message === "Admin access only" },
  ) 

  await async_test(
    `Enduser can access public meeting, not private meeting`,
    enduserSDK.api.meetings.my_meetings,
    { onResult: ms => ms.length === 1 && !!ms.find(m => m.id === publicMeeting.id) }
  )

  await Promise.all([
    sdk.api.meetings.end_meeting({ id: publicMeeting.id }),
    sdk.api.meetings.end_meeting({ id: privateMeeting.id }),
    sdk.api.endusers.deleteOne(enduser.id),
  ])

  // await Promise.all([
  //   sdk.api.meetings.deleteOne(publicMeeting.id),
  //   sdk.api.meetings.deleteOne(privateMeeting.id),
  // ])
}

const search_tests = async () => {
  log_header("Search")

  await async_test(
    `user_logs earch disabled`,
    () => sdk.api.user_logs.getSome({ search: { query: 'john'} }),
    handleAnyError
  )  

  const e1 = await sdk.api.endusers.createOne({ email: 'e1_search@tellescope.com', fname: 'JoHn', lname: "strauss" })
  const e2 = await sdk.api.endusers.createOne({ email: 'e2_search@tellescope.com', fname: 'sebastian', lname: "coates" })

  await async_test(
    `Search error message`,
    () => sdk.api.endusers.getSome({ search: "alert(1)" as any }),
    { 
      shouldError: true, 
      onError: e => !e.message.includes('script') && e.message.startsWith("Error parsing field search: Expecting an object but got alert(1)")
    },
  )  
  await async_test(
    `Search error does not return script tags `,
    () => sdk.api.endusers.getSome({ search: "<script>alert(1)</script>" as any }),
    { 
      shouldError: true, 
      onError: e => !e.message.includes('script') && e.message.startsWith("Error parsing field search: Expecting an object but got")
    },
  )  
  
  await async_test(
    `Search full fname case insensitive`,
    () => sdk.api.endusers.getSome({ search: { query: 'john'} }),
    { onResult: es => es.length === 1 && es[0].id === e1.id },
  )  
  await async_test(
    `Search start fname case insensitive`,
    () => sdk.api.endusers.getSome({ search: { query: 'joh'} }),
    { onResult: es => es.length === 1 && es[0].id === e1.id },
  )  
  await async_test(
    `Search end fname case insensitive`,
    () => sdk.api.endusers.getSome({ search: { query: 'ohn'} }),
    { onResult: es => es.length === 1 && es[0].id === e1.id },
  )  
  await async_test(
    `Search by email`,
    () => sdk.api.endusers.getSome({ search: { query: 'search@tellescope'} }),
    { onResult: es => es.length === 2 },
  )  

  await Promise.all([
    sdk.api.endusers.deleteOne(e1.id),
    sdk.api.endusers.deleteOne(e2.id),
  ])
}

const notifications_tests = async () => {
  log_header("Notifications")

  const room = await sdk.api.chat_rooms.createOne({ type: 'internal', userIds: [sdk.userInfo.id, sdkNonAdmin.userInfo.id ]})
  const chat = await sdk.api.chats.createOne({ message: 'test', roomId: room.id, })
  const ticket = await sdk.api.tickets.createOne({ title: 'Ticket for notification', owner: sdkNonAdmin.userInfo.id })
  
  await wait(undefined, 250) // notifications may be created in background

  // neither should throw error
  const ticketNotifications = await sdk.api.user_notifications.getSome({ filter: { type: 'newTicket' } }) 
  const chatNotifications = await sdk.api.user_notifications.getSome({ filter: { type: 'newTeamChatMessage' } }) 

  assert(!!ticketNotifications.find(n => n.relatedRecords?.find(r => r.id === ticket.id)), 'No ticket notification', 'Got notification for new new ticket')
  assert(!!chatNotifications.find(notification => notification.relatedRecords?.find(r => r.id === chat.id)), 'No chat notification', 'Got notification for new chat')

  await Promise.all([
    sdk.api.chat_rooms.deleteOne(room.id),
    sdk.api.tickets.deleteOne(ticket.id),
    sdk.api.user_notifications.deleteOne(ticketNotifications.find(n => n.relatedRecords?.find(r => r.id === ticket.id))!.id),
    ...chatNotifications.map(n => 
      sdk.api.user_notifications.deleteOne(n.id),
    ),
  ])
}

const handleAnyError = { shouldError: true, onError: () => true }
const passOnAnyResult = { onResult: () => true }

const role_based_access_tests = async () => {
  log_header("Role Based Access Tests")
  const adminId = sdk.userInfo.id

  const e = await sdk.api.endusers.createOne({ email: 'roletest@gmail.com' })

  const adminTicket = await sdk.api.tickets.createOne({ title: 'ticket', enduserId: e.id, owner: adminId })
  const ticketCreatedByNonAdmin = await sdkNonAdmin.api.tickets.createOne({ title: 'ticket' })

  const email = await sdk.api.emails.createOne({ enduserId: e.id, logOnly: true, subject: 'blah', textContent: 'blah blah' })
  const sms = await sdk.api.sms_messages.createOne({ enduserId: e.id, logOnly: true, message: 'blah blah' })
  const calendarEvent = await sdk.api.calendar_events.createOne({ 
    attendees: [{ id: e.id, type: 'enduser' }],
    durationInMinutes: 50,
    startTimeInMS: 2000000,
    title: 'Access Test'
  })

  const chatRoom = await sdk.api.chat_rooms.createOne({ enduserIds: [e.id ]})
  const chatMessage = await sdk.api.chats.createOne({ roomId: chatRoom.id, message: 'test chat access' })
  await sdk.api.chats.createOne({ roomId: chatRoom.id, message: 'test chat access 2' })

  // unassigned to enduser access tests
  await async_test(
    `Admin / creator can access enduser without being assigned`,
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !!e },
  )  
  await async_test(
    `Unassigned non-admin can't access enduser without being assigned`,
    () => sdkNonAdmin.api.endusers.getOne(e.id), handleAnyError,
  )  
  await async_test(
    `non-admin for enduser ticket bad`,
    () => sdkNonAdmin.api.tickets.getOne(adminTicket.id), handleAnyError,
  )  
  await async_test(
    `[bulkd] Admin / creator can access enduser without being assigned`,
    () => sdk.bulk_load({ load: [{ model: 'endusers' }] }),
    { onResult: r => r.results[0]?.records !== undefined && r.results[0].records?.find(r => r.id === e.id) } 
  )  
  await async_test(
    `[bulk] Unassigned non-admin can't access enduser without being assigned`,
      () => sdkNonAdmin.bulk_load({ load: [{ model: 'endusers' }] }),
      { onResult: r => r.results[0]?.records !== undefined && !r.results[0].records?.find(r => r.id === e.id) } 
  )  
  await async_test(
    `non-admin for enduser ticket bad`,
      () => sdkNonAdmin.bulk_load({ load: [{ model: 'tickets' }] }),
      { onResult: r => r.results[0]?.records !== undefined && !r.results[0].records?.find(r => r.id === adminTicket.id) } 
  )

  await async_test(
    `Non-admin for own ticket`, () => sdkNonAdmin.api.tickets.getOne(ticketCreatedByNonAdmin.id), passOnAnyResult
  )  
  await async_test(
    `Non-admin for tickets`, () => sdkNonAdmin.api.tickets.getSome(), { onResult: ts => ts.length === 1 }
  )  
  await async_test(
    `[bulk] Non-admin for tickets`, 
    () => sdkNonAdmin.bulk_load({ load: [{ model: 'tickets' }] }), 
    { onResult: r => r.results?.[0]?.records?.length === 1 }
  )  
  await async_test(
    `non-admin for email bad`, () => sdkNonAdmin.api.emails.getOne(email.id), handleAnyError,
  )  
  await async_test(
    `[bulk] non-admin for email bad`, 
    () => sdkNonAdmin.bulk_load({ load: [{ model: 'emails' }] }), 
    { onResult: r => r.results?.[0]?.records?.length === 0 }
  )  
  await async_test(
    `non-admin for sms bad`, () => sdkNonAdmin.api.sms_messages.getOne(sms.id), handleAnyError,
  )  
  await async_test(
    `admin for calendar`, () => sdk.api.calendar_events.getOne(calendarEvent.id), passOnAnyResult,
  )  
  await async_test(
    `non-admin for calendar bad`, () => sdkNonAdmin.api.calendar_events.getOne(calendarEvent.id), handleAnyError,
  )  
  await async_test(
    `[bulk] non-admin for calendar bad`, 
    () => sdkNonAdmin.bulk_load({ load: [{ model: 'calendar_events' }] }), 
    { onResult: r => r.results?.[0]?.records?.length === 0 }
  )  
  await async_test(
    `non-admin for chat room bad`, () => sdkNonAdmin.api.chat_rooms.getOne(chatRoom.id), handleAnyError,
  )  
  await async_test(
    `[bulk] non-admin for chat room bad`, 
    () => sdkNonAdmin.bulk_load({ load: [{ model: 'chat_rooms' }] }), 
    { onResult: r => r.results?.[0]?.records?.length === 0 }
  )  
  await async_test(
    `non-admin for chat message bad`, () => sdkNonAdmin.api.chats.getOne(chatMessage.id), handleAnyError,
  )  
  await async_test(
    `[bulk] non-admin for chat message bad`, 
    () => sdkNonAdmin.bulk_load({ load: [{ model: 'chats' }] }), 
    // { onResult: result => result.results.flatMap(r => r?.records || []).length === 0 }
    handleAnyError // throws error in this case in enforceForeignAccessConstraints because there are no accessible chats
  )  
  await async_test(
    `Non-admin for chats`, () => sdkNonAdmin.api.chats.getSome({ filter: { roomId: chatRoom.id } }), handleAnyError,
  )  
  await async_test(
    `Non-admin for tickets with enduserId in filter`, 
    () => sdkNonAdmin.api.tickets.getSome({ filter: { enduserId: e.id } }), 
    { onResult: r => !r.find(t => t.id === adminTicket.id)}
  )  

  // unassigned update / delete coverage
  await async_test(
    `non-admin for enduser ticket update bad`,
    () => sdkNonAdmin.api.tickets.updateOne(adminTicket.id, { title: 'updated' }), handleAnyError,
  )  
  await async_test(
    `non-admin for enduser ticket delete bad`, () => sdkNonAdmin.api.tickets.deleteOne(adminTicket.id), handleAnyError,
  )  


  // set assignees
  await sdk.api.endusers.updateOne(e.id, { assignedTo: [sdk.userInfo.id, sdkNonAdmin.userInfo.id]})

  // assigned access tests
  await async_test(
    `Admin / creator can access enduser while assigned`, () => sdk.api.endusers.getOne(e.id), passOnAnyResult
  )  
  await async_test(
    `Unassigned non-admin can access enduser while assigned`, () => sdkNonAdmin.api.endusers.getOne(e.id), passOnAnyResult
  )  
  await async_test(
    `non-admin for enduser ticket`, () => sdkNonAdmin.api.tickets.getOne(adminTicket.id), passOnAnyResult,
  )  
  await async_test(
    `[bulk] non-admin for enduser ticket`, 
    () => sdkNonAdmin.bulk_load({ load: [{ model: 'tickets' }] }), 
    { onResult: r => r.results?.[0]?.records?.find(r => r.id === adminTicket.id )}
  )

  await async_test(
    `Non-admin for tickets`, () => sdkNonAdmin.api.tickets.getSome(), { onResult: ts => ts.length === 2 }
  )  
  await async_test(
    `non-admin for email`, () => sdkNonAdmin.api.emails.getOne(email.id), passOnAnyResult,
  )  
  await async_test(
    `[bulk] non-admin for email`, 
    () => sdkNonAdmin.bulk_load({ load: [{ model: 'emails' }] }), 
    { onResult: r => r.results?.[0]?.records?.find(r => r.id === email.id )}
  )
  await async_test(
    `non-admin for sms`, () => sdkNonAdmin.api.sms_messages.getOne(sms.id), passOnAnyResult,
  )  
  await async_test(
    `non-admin for calendar`, () => sdkNonAdmin.api.calendar_events.getOne(calendarEvent.id), passOnAnyResult,
  )  
  await async_test(
    `[bulk] non-admin for calendar`, 
    () => sdkNonAdmin.bulk_load({ load: [{ model: 'calendar_events' }] }), 
    { onResult: r => r.results?.[0]?.records?.find(r => r.id === calendarEvent.id )}
  )
  await async_test(
    `non-admin for chat room`, () => sdkNonAdmin.api.chat_rooms.getOne(chatRoom.id), passOnAnyResult,
  )  
  await async_test(
    `[bulk] non-admin for chat room`, 
    () => sdkNonAdmin.bulk_load({ load: [{ model: 'chat_rooms' }] }), 
    { onResult: r => r.results?.[0]?.records?.find(r => r.id === chatRoom.id )}
  )
  await async_test(
    `non-admin for chat message`, () => sdkNonAdmin.api.chats.getOne(chatMessage.id), passOnAnyResult,
  )  
  await async_test(
    `[bulk] non-admin for chat message`, 
    () => sdkNonAdmin.bulk_load({ load: [{ model: 'chats' }] }), 
    { onResult: r => r.results?.[0]?.records?.find(r => r.id === chatMessage.id )}
  )
  await async_test(
    `Non-admin for chats`, () => sdkNonAdmin.api.chats.getSome({ filter: { roomId: chatRoom.id } }), 
    { onResult: cs => cs.length === 2 },
  )  


  // update / delete coverage for assigned tickets
  await async_test(
    `non-admin assigned enduser ticket update find`,
    () => sdkNonAdmin.api.tickets.updateOne(adminTicket.id, { title: 'updated' }), passOnAnyResult,
  )  
  await async_test(
    `non-admin for enduser ticket delete still bad`, () => sdkNonAdmin.api.tickets.deleteOne(adminTicket.id), handleAnyError,
  )  

  // cleanup
  await Promise.all([
    sdk.api.endusers.deleteOne(e.id),
    sdk.api.calendar_events.deleteOne(calendarEvent.id),
    sdk.api.chat_rooms.deleteOne(chatRoom.id),
    sdk.api.tickets.deleteOne(ticketCreatedByNonAdmin.id), // not associated with enduser, needs own cleanup
  ])
}

const status_update_tests = async () => {
  log_header("Enduser Status Updates")

  const journey = await sdk.api.journeys.createOne({ title: 'test' })
  const enduser = await sdk.api.endusers.createOne({ email: 'delete@tellescope.com'  })
  const status  = await sdk.api.enduser_status_updates.createOne({ enduserId: enduser.id, journeyId: journey.id, status: "Working"})

  // status update on enduser is a side effect
  await wait(undefined, 100)
  await async_test(
    `status update`, () => sdk.api.endusers.getOne(enduser.id), {
      onResult: e => e.journeys?.[journey.id] === status.status
    },
  )  

  await Promise.all([
    sdk.api.journeys.deleteOne(journey.id), // status deleted as side effect 
    sdk.api.endusers.deleteOne(enduser.id), // status deleted as side effect
  ])
}

const community_tests = async () => {
  log_header("Community")

  const enduser = await sdk.api.endusers.createOne({ email })
  await sdk.api.endusers.set_password({ id: enduser.id, password }).catch(console.error)
  await enduserSDK.authenticate(email, password).catch(console.error) 

  const forum = await sdk.api.forums.createOne({ title: 'test', publicRead: true })
  const privateForum = await sdk.api.forums.createOne({ title: 'test 2', publicRead: false })

  await async_test(
    `enduser access forum`, () => enduserSDK.api.forums.getOne(forum.id), { onResult: f => f.id === forum.id } 
  )  
  await async_test(`enduser access privateForum error`, () => enduserSDK.api.forums.getOne(privateForum.id), handleAnyError)  

  const enduserPost = await enduserSDK.api.forum_posts.createOne({ title: 'title', forumId: forum.id, htmlContent: 'enduser', textContent: 'enduser' })
  assert(!!enduserPost, 'enduser post failed', 'enduser post successful')
  const userPost = await sdk.api.forum_posts.createOne({ title: 'title', forumId: forum.id, htmlContent: 'user', textContent: 'user' })
  assert(!!userPost, 'user post failed', 'user post successful')

  assert(enduserPost.numComments === 0 && enduserPost.numLikes === 0, 'counts not initialized', 'counts initialized at 0')

  await async_test(
    `enduser post private errors`, 
    () => enduserSDK.api.forum_posts.createOne({ title: 'title', forumId: privateForum.id, htmlContent: 'enduser', textContent: 'enduser' }), 
    handleAnyError
  )  

  await async_test(
    `enduser can access single post for forumId`, 
    () => enduserSDK.api.forum_posts.getOne({ forumId: forum.id }), 
    passOnAnyResult,
  )
  await async_test(
    `enduser can access self post by id`, 
    () => enduserSDK.api.forum_posts.getOne(enduserPost.id), 
    passOnAnyResult,
  )
  await async_test(
    `enduser can access other post by id`, 
    () => enduserSDK.api.forum_posts.getOne(userPost.id), 
    passOnAnyResult,
  )
  await async_test(
    `enduser can access posts`, 
    () => enduserSDK.api.forum_posts.getSome({ filter: { forumId: forum.id } }), 
    { onResult: r => r.length === 2 }
  )  
  
  const enduserSelfComment = await enduserSDK.api.post_comments.createOne({ forumId: forum.id, postId: enduserPost.id, htmlContent: 'enduser', textContent: 'enduser' })
  const userComment = await sdk.api.post_comments.createOne({ forumId: forum.id, postId: enduserPost.id, htmlContent: 'user', textContent: 'user' })
  assert(!!enduserSelfComment, 'enduser comment failed', 'enduser comment successful')
  assert(!!userComment, 'user comment failed', 'user comment successful')
  await async_test(
    `enduser can access post comments`, 
    () => enduserSDK.api.post_comments.getSome({ filter: { forumId: forum.id, postId: enduserPost.id  } }), 
    { onResult: r => r.length === 2 }
  )

  await enduserSDK.api.post_likes.createOne({ forumId: forum.id, postId: enduserPost.id })
  await async_test(
    `double-like not allowed`, 
    () => enduserSDK.api.post_likes.createOne({ forumId: forum.id, postId: enduserPost.id }),
    handleAnyError
  )  

  await wait(undefined, 50)
  await async_test(
    `post and like counts on create`, 
    () => sdk.api.forum_posts.getOne(enduserPost.id), 
    { onResult: p => p.numComments === 2 && p.numLikes === 1}
  )  

  await enduserSDK.api.post_likes.unlike_post({ postId: enduserPost.id, forumId: enduserPost.forumId })
  await wait(undefined, 50)
  await async_test(
    `post and like counts after unlike`, 
    () => sdk.api.forum_posts.getOne(enduserPost.id), 
    { onResult: p => p.numComments === 2 && p.numLikes === 0 }
  )  


  const userSelfPost = await sdk.api.forum_posts.createOne({ title: 'title', forumId: privateForum.id, htmlContent: 'user', textContent: 'user' })
  assert(!!userSelfPost, 'user private post failed', 'user private post successful')

  const userSelfPostComment = await sdk.api.post_comments.createOne({ forumId: privateForum.id, postId: userSelfPost.id, htmlContent: 'user', textContent: 'user' })
  assert(!!userSelfPostComment, 'user private post comment failed', 'user private post comment successful')

  await async_test(
    `enduser comment private errors`, 
    () => enduserSDK.api.post_comments.createOne({ forumId: privateForum.id, postId: userSelfPost.id, htmlContent: 'enduser', textContent: 'enduser' }), 
    handleAnyError
  )  
  await async_test(
    'enduser cannot access private post by id',
    () => enduserSDK.api.forum_posts.getOne(userSelfPost.id),
    handleAnyError,
  )
  await async_test(
    'enduser cannot access private post by filter',
    () => enduserSDK.api.forum_posts.getOne({ forumId: privateForum.id }),
    handleAnyError,
  )
  await async_test(
    'enduser cannot access private comment by id',
    () => enduserSDK.api.post_comments.getOne(userSelfPostComment.id),
    handleAnyError,
  )
  await async_test(
    'enduser cannot access private comment by filter (forum id)',
    () => enduserSDK.api.post_comments.getOne({ forumId: privateForum.id }),
    handleAnyError,
  )
  await async_test(
    'enduser cannot access private comment by filter (post id)',
    () => enduserSDK.api.post_comments.getOne({ postId: userSelfPost.id }),
    handleAnyError,
  )
  await async_test(
    'enduser cannot access private comment by filter (forum and post id)',
    () => enduserSDK.api.post_comments.getOne({ forumId: privateForum.id, postId: userSelfPost.id }),
    handleAnyError,
  )
  await async_test(
    'enduser cannot access private posts',
    () => enduserSDK.api.forum_posts.getSome({ filter: { forumId: privateForum.id }}),
    handleAnyError,
    // { onResult: posts => posts.length === 0 },
  )
  await async_test(
    'enduser cannot access private comments',
    () => enduserSDK.api.post_comments.getSome({ filter: { forumId: privateForum.id }}),
    handleAnyError,
    // { onResult: comments => comments.length === 0 },
  )
  
  await Promise.all([
    await sdk.api.endusers.deleteOne(enduser.id),
    await sdk.api.forums.deleteOne(forum.id),
    await sdk.api.forums.deleteOne(privateForum.id),
  ])
}

const redaction_tests = async () => {
  log_header("Redaction")

  const enduser = await sdk.api.endusers.createOne({ email })
  const enduserOther = await sdk.api.endusers.createOne({ email: 'otherenduser@tellescope.com' })
  await sdk.api.endusers.set_password({ id: enduser.id, password }).catch(console.error)
  await enduserSDK.authenticate(email, password).catch(console.error)  

  const endusers = await enduserSDK.api.endusers.getSome()
  const forUser  = await sdk.api.endusers.getSome()
  assert(endusers.length > 0, "enduser can't fetch others", "enduser get others successful")

  const redactedFields = (
    Object.keys(schema.endusers.fields)
    .filter(f => 
       schema.endusers.fields[f as keyof typeof schema.endusers.fields]?.redactions?.includes('enduser')
    || schema.endusers.fields[f as keyof typeof schema.endusers.fields]?.redactions?.includes('all')
    )
  )
  assert(redactedFields.length > 0, 'no redacted fields', 'redacted fields exists')

  assert(
    endusers.find(e => redactedFields.filter(f => !!e[f as keyof typeof e]).length > 0) === undefined,
    'got redacted data',
    'data correctly redacted',
  )

  assert(
    !forUser.find(u => u.hashedPassword),
    'got redacted data',
    'hashed password redacted, even for admin user',
  )

  const zoomIntegration = await sdk.api.integrations.createOne({
    title: ZOOM_TITLE,
    authentication: {
      type: 'oauth2',
      info: {
        access_token: 'token',
        expiry_date: new Date().getTime(),
        refresh_token: 'refresh_token',
        scope: '',
        token_type: 'Bearer',
      }
    }
  })
  const notZoomIntegration = await sdk.api.integrations.createOne({
    title: "Not Zoom",
    authentication: {
      type: 'oauth2',
      info: {
        access_token: 'token',
        expiry_date: new Date().getTime(),
        refresh_token: 'refresh_token',
        scope: '',
        token_type: 'Bearer',
      }
    }
  })

  await async_test(
    'Zoom integration redacts authentication info',
    () => sdk.api.integrations.getOne(zoomIntegration.id),
    { onResult: i => !i.authentication},
  )
  await async_test(
    'Generic integration includes authentication info (for now, while used in front-end for some integrations like Zendesk)',
    () => sdk.api.integrations.getOne(notZoomIntegration.id),
    { onResult: i => !!i.authentication},
  )

  await Promise.all([
    sdk.api.endusers.deleteOne(enduser.id),
    sdk.api.endusers.deleteOne(enduserOther.id),
    sdk.api.integrations.deleteOne(zoomIntegration.id),
    sdk.api.integrations.deleteOne(notZoomIntegration.id),
  ])
}

const public_form_tests = async () => {
  log_header("Public Form")

  const journey = await sdk.api.journeys.createOne({ title: 'test journey '})
  const nonPublicForm = await sdk.api.forms.createOne({
    title: 'test form',
    intakePhone: 'optional',
  })
  const form = await sdk.api.forms.createOne({
    title: 'test form',
    allowPublicURL: true,
    intakePhone: 'optional',
  })
  const submitInfo = {
    businessId: form.businessId,
    email: 'publicformtest@tellescope.com',
    formId: form.id,
    fname: 'sebastian',
    lname: 'coates',
  }
  const submitInfoNonPublic = { ...submitInfo, formId: nonPublicForm.id }

  await async_test(
    'non-public form blocked',
    () => enduserSDK.api.form_responses.session_for_public_form(submitInfoNonPublic),
    handleAnyError,
  )
  await async_test(
    'no questions form blocked',
    () => enduserSDK.api.form_responses.session_for_public_form(submitInfo),
    handleAnyError,
  )

  const field = await sdk.api.form_fields.createOne({
    formId: form.id,
    title: 'question', 
    type: 'string',
    previousFields: [{ type: 'root', info: {} }]
  })
  const testResponse: FormResponseValue = {
    answer: {
      type: 'string',
      value: 'answer'
    },
    fieldId: field.id,
    fieldTitle: field.title,
  }

  // upserts enduser
  const responseInfo = await enduserSDK.api.form_responses.session_for_public_form(submitInfo)

  // verify enduser is actually upserted
  const enduser = await sdk.api.endusers.getOne({ email: 'publicformtest@tellescope.com'})

  // test case for existing enduser
  await enduserSDK.api.form_responses.session_for_public_form(submitInfo)

  enduserSDK.setAuthToken(responseInfo.authToken)
  await enduserSDK.refresh_session() // should be allowed

  // assert((enduserSDK.userInfo as any).allowedPaths.length === 3, 'allowed paths not preserved', 'allowed paths preserved after refresh')

  await async_test(
    'enduser cannot use non-allowed path',
    () => enduserSDK.api.endusers.updateOne(enduserSDK.userInfo.id, { fields: { testFiedl: 'testValue' } }),
    handleAnyError,
  )

  await async_test(
    'enduser can submit public form',
    () => enduserSDK.api.form_responses.submit_form_response({ accessCode: responseInfo.accessCode, responses: [testResponse] }),
    passOnAnyResult,
  )
  
  // delete enduser and re-initiate for testing UTMs
  await sdk.api.endusers.deleteOne(enduser.id)

  await enduserSDK.api.form_responses.session_for_public_form({ ...submitInfo, utm: [{ field: 'utm_source', value: 'testsource' }] })
  const enduser2 = await sdk.api.endusers.getOne({ email: 'publicformtest@tellescope.com'})
  assert(enduser2.fields?.['utm_source'] === "testsource", 'UTM not preserved', 'UTM preserved after refresh')

  await enduserSDK.api.form_responses.session_for_public_form({ ...submitInfo, utm: [{ field: 'utm_source', value: 'testsource_updated' }] })
  await async_test(
    'enduser can update UTM',
    () => sdk.api.endusers.getOne(enduser2.id),
    { onResult: e => e.fields?.['utm_source'] === "testsource_updated" },
  )

  await Promise.all([
    sdk.api.forms.deleteOne(form.id),
    sdk.api.journeys.deleteOne(journey.id),
    sdk.api.endusers.deleteOne(enduser2.id),
  ])
}

export const managed_content_records_tests = async () => {
  log_header("Managed Content Records")

  await enduserSDK.register({ email: 'content@tellescope.com', password: "testenduserpassword" })
  await enduserSDK.authenticate('content@tellescope.com', "testenduserpassword")

  const record = await sdk.api.managed_content_records.createOne({
    title: "title", htmlContent: '<br />', textContent: 'content',
    publicRead: true,
  })
  const record2 = await sdk.api.managed_content_records.createOne({
    title: "title 2", htmlContent: '<br />', textContent: 'content',
    publicRead: false,
  })


  await async_test(
    'enduser can access content by default (1)',
    () => enduserSDK.api.managed_content_records.getOne(record.id),
    passOnAnyResult,
  )
  await async_test(
    'enduser can access content by default (many)',
    () => enduserSDK.api.managed_content_records.getSome(),
    { onResult: rs => rs.length === 1 },
  )

  await Promise.all([
    sdk.api.endusers.deleteOne(enduserSDK.userInfo.id),
    sdk.api.managed_content_records.deleteOne(record.id),
    sdk.api.managed_content_records.deleteOne(record2.id),
  ])
}

export const calendar_event_RSVPs_tests = async () => {
  log_header("Calendar Event RSVPs")

  await enduserSDK.register({ email: 'rsvps@tellescope.com', password: "testenduserpassword" })
  await enduserSDK.authenticate('rsvps@tellescope.com', "testenduserpassword")

  const event = await sdk.api.calendar_events.createOne({
    title: "RSVP Event",
    startTimeInMS: Date.now(), 
    durationInMinutes: 60,
  })
  const event2 = await sdk.api.calendar_events.createOne({
    title: "RSVP Event 2",
    startTimeInMS: Date.now(), 
    durationInMinutes: 60,
  })

  const userRSVP = await sdk.api.calendar_event_RSVPs.createOne({ eventId: event.id })
  assert(userRSVP.displayName === sdk.userInfo.fname, 'display name init bad', 'display name init')
  
  await sdk.api.calendar_event_RSVPs.createOne({ eventId: event2.id }) // can create second event for non-match

  const enduserRSVP = await enduserSDK.api.calendar_event_RSVPs.createOne({ eventId: event.id })

  await async_test(
    'user cannot create duplicate RSVP',
    () => sdk.api.calendar_event_RSVPs.createOne({ eventId: event.id }),
    { shouldError: true, onError: e => e.message === UniquenessViolationMessage},
  )
  await async_test(
    'enduser cannot create duplicate RSVP',
    () => enduserSDK.api.calendar_event_RSVPs.createOne({ eventId: event.id }),
    { shouldError: true, onError: e => e.message === UniquenessViolationMessage},
  )

  await async_test(
    'enduser cannot delete user RSVP',
    () => enduserSDK.api.calendar_event_RSVPs.deleteOne(userRSVP.id),
    handleAnyError,
  )
  await async_test(
    'user cannot delete enduser RSVP',
    () => sdk.api.calendar_event_RSVPs.deleteOne(enduserRSVP.id),
    handleAnyError,
  )

  await async_test(
    'enduser cannot update user RSVP',
    () => enduserSDK.api.calendar_event_RSVPs.updateOne(userRSVP.id, { status: 'Maybe' }),
    handleAnyError,
  )
  await async_test(
    'user cannot update enduser RSVP',
    () => sdk.api.calendar_event_RSVPs.updateOne(enduserRSVP.id, { status: 'Maybe' }),
    handleAnyError,
  )

  await async_test(
    'RSVPs incremented',
    () => sdk.api.calendar_events.getOne(event.id),
    { onResult: c => c.numRSVPs === 2},
  )
  await async_test(
    'enduser can delete own RSVP',
    () => enduserSDK.api.calendar_event_RSVPs.deleteOne(enduserRSVP.id),
    passOnAnyResult,
  )
  await async_test(
    'user can delete own RSVP',
    () => sdk.api.calendar_event_RSVPs.deleteOne(userRSVP.id),
    passOnAnyResult,
  )
  await async_test(
    'RSVPs decremented',
    () => sdk.api.calendar_events.getOne(event.id),
    { onResult: c => c.numRSVPs === 0 },
  )

  await Promise.all([
    sdk.api.endusers.deleteOne(enduserSDK.userInfo.id),
    sdk.api.calendar_events.deleteOne(event.id),
    sdk.api.calendar_events.deleteOne(event2.id),
  ])
}

const post_comments_tests = async () => {
  log_header("Post Comments")

  await enduserSDK.register({ email: 'rsvps@tellescope.com', password: "testenduserpassword" })
  await enduserSDK.authenticate('rsvps@tellescope.com', "testenduserpassword")

  const forumId = (await sdk.api.forums.createOne({ title: "RSVP Event", publicRead: true })).id
  const postId = (await sdk.api.forum_posts.createOne({ forumId, title: 'Post', htmlContent: '', textContent: '',  })).id

  const userComment = await sdk.api.post_comments.createOne({ 
    forumId, postId, htmlContent: '', textContent: '',
  })
  const enduserCommentInReply = await enduserSDK.api.post_comments.createOne({ 
    forumId, postId, htmlContent: '', textContent: '',
    threadId: userComment.id, replyTo: userComment.id,
  })
  await wait (undefined, 500)
  await async_test(
    'num replies incremented',
    () => sdk.api.post_comments.getOne({ id: postId, forumId }),
    { onResult: c => c.numReplies === 1 },
  )

  const userLike = await sdk.api.comment_likes.createOne({ 
    forumId, postId, commentId: userComment.id,
  })
  const enduserLike = await enduserSDK.api.comment_likes.createOne({ 
    forumId, postId, commentId: userComment.id,
  })
  await async_test(
    'num likes incremented',
    () => sdk.api.post_comments.getOne({ id: postId, forumId }),
    { onResult: c => c.numLikes === 2 },
  )

  await async_test(
    'user cannot create duplicate comment like',
    () => sdk.api.comment_likes.createOne({ forumId, postId, commentId: userComment.id }),
    { shouldError: true, onError: e => e.message === UniquenessViolationMessage},
  )
  await async_test(
    'enduser cannot create duplicate comment like',
    () => enduserSDK.api.comment_likes.createOne({ forumId, postId, commentId: userComment.id }),
    { shouldError: true, onError: e => e.message === UniquenessViolationMessage},
  )

  await enduserSDK.api.post_comments.deleteOne(enduserCommentInReply.id)
  await async_test(
    'num comments decrementted',
    () => sdk.api.post_comments.getOne({ id: postId, forumId }),
    { onResult: c => c.numReplies === 0 },
  )

  await sdk.api.comment_likes.deleteOne(userLike.id)
  await enduserSDK.api.comment_likes.deleteOne(enduserLike.id)
  await async_test(
    'num likes decremented',
    () => sdk.api.post_comments.getOne({ id: postId, forumId }),
    { onResult: c => c.numLikes === 0 },
  )

  await Promise.all([
    sdk.api.endusers.deleteOne(enduserSDK.userInfo.id),
    sdk.api.forums.deleteOne(forumId)
  ])
}

export const databases_tests = async () => {
  log_header("Databases")
  
  const database = (await sdk.api.databases.createOne({ 
    title: "__Test__Database", 
    fields: [{ type: 'Text', label: "String" }],
    // organizationRead: true,
  }))
  const databaseNoRead = (await sdk.api.databases.createOne({ 
    title: "__Test__Database No Read", 
    fields: [{ type: 'Text', label: "String" }],
    // organizationRead: false,
  }))

  const databaseRecord = await sdk.api.database_records.createOne({ 
    databaseId: database.id, 
    values: [{ type: 'Text', value: 'value', label: 'label' }],
  })
  await wait(undefined, 250)
  await async_test(
    'numRecords incremented',
    () => sdk.api.databases.getOne(database.id),
    { onResult: c => c.numRecords === 1 },
  )    

  await async_test(
    'Non admin can access correctly',
    () => sdkNonAdmin.api.databases.getOne(database.id),
    passOnAnyResult,
  )
  // await async_test(
  //   'Non admin cannot access correctly',
  //   () => sdkNonAdmin.api.databases.getOne(databaseNoRead.id),
  //   handleAnyError,
  // )

  // cleanup and test cache
  await sdk.api.database_records.deleteOne(databaseRecord.id)
  await wait(undefined, 250)
  await async_test(
    'numRecords decremented',
    () => sdk.api.databases.getOne(database.id),
    { onResult: c => c.numRecords === 0 },
  )
  await Promise.all([
    sdk.api.databases.deleteOne(database.id),
    sdk.api.databases.deleteOne(databaseNoRead.id),
  ])
}

export const filter_by_date_tests = async () => {
  log_header("Filter by Dates")

  const enduser1 = await sdk.api.endusers.createOne({ email: 'deleteme@tellescope.com' })
  await wait(undefined, 2000) // ensure meaningful delay in createdAt timestamp

  const now = new Date()
  const enduser2 = await sdk.api.endusers.createOne({ email: 'deleteme2@tellescope.com' })

  await async_test(
    'Filtered by from',
    () => sdk.api.endusers.getSome({ from: now }),
    { onResult: es => (
         es.length === 1 
      && es[0].email === enduser2.email
    )},
  )

  return await Promise.all([
    sdk.api.endusers.deleteOne(enduser1.id),
    sdk.api.endusers.deleteOne(enduser2.id),
  ])
}

export const self_serve_appointment_booking_tests = async () => {
  log_header("Self Serve Appointment Booking")

  const e1 = await sdk.api.endusers.createOne({ email: 'sebass+ny@tellescope.com', state: 'NY' }) 
  const e2 = await sdk.api.endusers.createOne({ email: 'sebass+ca@tellescope.com', state: 'CA' })
  const e3 = await sdk.api.endusers.createOne({ email: 'sebass+3@tellescope.com' })
  await sdk.api.endusers.set_password({ id: e1.id, password })
  await sdk.api.endusers.set_password({ id: e2.id, password })
  await sdk.api.endusers.set_password({ id: e3.id, password })
  
  const event15min = await sdk.api.calendar_event_templates.createOne({ 
    title: 'test 2', durationInMinutes: 15,
    confirmationEmailDisabled: true,
    confirmationSMSDisabled: true,
  })
  const event30min = await sdk.api.calendar_event_templates.createOne({ 
    title: 'test 1', durationInMinutes: 30,
    confirmationEmailDisabled: true,
    confirmationSMSDisabled: true,
  })
  const event30minGroup = await sdk.api.calendar_event_templates.createOne({ 
    title: 'test group', durationInMinutes: 30,
    confirmationEmailDisabled: true,
    confirmationSMSDisabled: true,
    enduserAttendeeLimit: 2, 
  })

  // ensure it doesn't match current day, to avoid errors on testing
  const dayOfWeekStartingSundayIndexedByZero = (new Date().getDay() + 1) % 7 

  await sdk.api.users.updateOne(sdk.userInfo.id, { 
    weeklyAvailabilities: [
      { 
        dayOfWeekStartingSundayIndexedByZero,
        startTimeInMinutes: 60 * 12, // noon,
        endTimeInMinutes: 60 * 13, // 1pm,
      },
      { // include as duplicate of above to ensure it doesn't produce extra availability slots 
        dayOfWeekStartingSundayIndexedByZero, // sunday
        startTimeInMinutes: 60 * 12, // noon,
        endTimeInMinutes: 60 * 13, // 1pm,
      },
    ],
    credentialedStates: [{ state: 'NY' }, { state: "CA" }],
    timezone: 'America/New_York',
  }, {
    replaceObjectFields: true,
  })

  await sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, { 
    weeklyAvailabilities: [
      { 
        dayOfWeekStartingSundayIndexedByZero, // sunday
        startTimeInMinutes: 60 * 12, // noon,
        endTimeInMinutes: 60 * 13, // 1pm,
      },
    ],
    credentialedStates: [{ state: "CA" }],
    timezone: 'America/Los_Angeles',
  }, {
    replaceObjectFields: true,
  })

  const enduserSDK2 = new EnduserSession({ host, businessId })
  await enduserSDK2.authenticate('sebass+ca@tellescope.com', password).catch(console.error) 

  const enduserSDK3 = new EnduserSession({ host, businessId })
  await enduserSDK3.authenticate('sebass+3@tellescope.com', password).catch(console.error) 

  // NY Enduser Tests
  await enduserSDK.authenticate('sebass+ny@tellescope.com', password).catch(console.error) 
  await async_test(
    '30 minute slots for state restriction',
    () => enduserSDK.api.calendar_events.get_appointment_availability({
      calendarEventTemplateId: event30min.id,
      from: new Date(Date.now() - 10000),
      to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      restrictedByState: true,
    }),
    { onResult: r => r.availabilityBlocks.length === 2 }, // 1 providers with 1 hour availability for 30 minute meetings
  )
  await async_test(
    '30 minute slots for state restriction (called as user)',
    () => sdk.api.calendar_events.get_appointment_availability({
      calendarEventTemplateId: event30min.id,
      from: new Date(Date.now() - 10000),
      to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      restrictedByState: true,
      state: "NY", // same state as enduserSDK
    }),
    { onResult: r => r.availabilityBlocks.length === 2 }, // 1 providers with 1 hour availability for 30 minute meetings
  )
  await async_test(
    '30 minute slots for state restriction with 15 min interval',
    () => enduserSDK.api.calendar_events.get_appointment_availability({
      calendarEventTemplateId: event30min.id,
      from: new Date(Date.now() - 10000),
      to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      restrictedByState: true,
      intervalInMinutes: 15,
    }),
    { onResult: r => r.availabilityBlocks.length === 3 }, // 1 providers with 1 hour availability for 30 minute meetings
  )
  await async_test(
    '30 minute slots for state restriction with 10 min interval',
    () => enduserSDK.api.calendar_events.get_appointment_availability({
      calendarEventTemplateId: event30min.id,
      from: new Date(Date.now() - 10000),
      to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      restrictedByState: true,
      intervalInMinutes: 10,
    }),
    { onResult: r => r.availabilityBlocks.length === 4 }, // 1 providers with 1 hour availability for 30 minute meetings
  )
  await async_test(
    '30 minute slots for no state restrictions',
    () => enduserSDK.api.calendar_events.get_appointment_availability({
      calendarEventTemplateId: event30min.id,
      from: new Date(Date.now() - 10000),
      to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      restrictedByState: false,
    }),
    { onResult: r => {
      if (r.availabilityBlocks.length !== 4) return false // 2 providers with 1 hour availability for 30 minute meetings

      const user1block1_ET = r.availabilityBlocks.find(b => b.userId === sdk.userInfo.id)
      const user2block1_PT = r.availabilityBlocks.find(b => b.userId === sdkNonAdmin.userInfo.id)

      if (!(user1block1_ET && user2block1_PT)) return false // should be slots for both users

      if (user2block1_PT.startTimeInMS - user1block1_ET.startTimeInMS !== 1000 * 60 * 60 * 3) {
        return false // difference should be three hours, since same availability in different timezones
      }

      return true
    }},
  )

  const nySlots = await enduserSDK.api.calendar_events.get_appointment_availability({
    calendarEventTemplateId: event30min.id,
    from: new Date(Date.now() - 10000),
      to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    restrictedByState: true,
  })
  const bookedAppointment = (await enduserSDK.api.calendar_events.book_appointment({
    calendarEventTemplateId: event30min.id,
    startTime: new Date(nySlots.availabilityBlocks[0].startTimeInMS),
    userId: nySlots.availabilityBlocks[0].userId, 
    fields: {
      test: "Custom",
      fields: "Test",
    }
  })).createdEvent
  assert(bookedAppointment.attendees.length === 2, 'did not get 2 attendees', '2 attendees fo non-multi-event')

  await async_test(
    'double-booking prevented',
    () => enduserSDK.api.calendar_events.book_appointment({
      calendarEventTemplateId: event30min.id,
      startTime: new Date(nySlots.availabilityBlocks[0].startTimeInMS),
      userId: nySlots.availabilityBlocks[0].userId, 
    }),
    handleAnyError
  )
  await async_test(
    '30 minute slots for state restriction with 1 overlapping conflict',
    () => enduserSDK.api.calendar_events.get_appointment_availability({
      calendarEventTemplateId: event30min.id,
      from: new Date(Date.now() - 10000),
      to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      restrictedByState: true,
    }),
    {  onResult: r => 
        r.availabilityBlocks.length === 1 
    &&  r.availabilityBlocks[0].startTimeInMS === nySlots.availabilityBlocks[1].startTimeInMS // the first slot of nySlots is booked
    }, 
  )

  const conflict = await sdk.api.calendar_events.createOne({ 
    title: 'conflict', 
    startTimeInMS: nySlots.availabilityBlocks[1].startTimeInMS,
    durationInMinutes: nySlots.availabilityBlocks[1].durationInMinutes,
    attendees: [{ type: 'user', id: sdk.userInfo.id }]
  })
  await async_test(
    '30 minute slots for state restriction with 2 overlapping conflict',
    () => enduserSDK.api.calendar_events.get_appointment_availability({
      calendarEventTemplateId: event30min.id,
      from: new Date(Date.now() - 10000),
      to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      restrictedByState: true,
    }),
    {  onResult: r => r.availabilityBlocks.length === 0 }, 
  )
  await async_test(
    'booking against conflict prevented',
    () => enduserSDK.api.calendar_events.book_appointment({
      calendarEventTemplateId: event30min.id,
      startTime: new Date(nySlots.availabilityBlocks[1].startTimeInMS),
      userId: nySlots.availabilityBlocks[1].userId, 
    }),
    handleAnyError
  )

  // test group bookings
  await sdk.api.calendar_events.updateOne(conflict.id, { enduserAttendeeLimit: 2 })
  await async_test(
    '[group booking] different event type conflict as group still blocks availability',
    () => enduserSDK.api.calendar_events.get_appointment_availability({
      calendarEventTemplateId: event30minGroup.id,
      from: new Date(Date.now() - 10000),
      to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    }),
    {  onResult: r => r.availabilityBlocks.length === 2 }, 
  )
  await sdk.api.calendar_events.deleteOne(conflict.id)
  await async_test(
    '[group booking] availability',
    () => enduserSDK.api.calendar_events.get_appointment_availability({
      calendarEventTemplateId: event30minGroup.id,
      from: new Date(Date.now() - 10000),
      to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    }),
    {  onResult: r => r.availabilityBlocks.length === 3 }, 
  )
  const groupEvent = (await enduserSDK.api.calendar_events.book_appointment({
    calendarEventTemplateId: event30minGroup.id,
    startTime: new Date(nySlots.availabilityBlocks[1].startTimeInMS),
    userId: nySlots.availabilityBlocks[1].userId, 
  })).createdEvent
  await async_test(
    '[group booking] more booking allowed',
    () => enduserSDK.api.calendar_events.get_appointment_availability({
      calendarEventTemplateId: event30minGroup.id,
      from: new Date(Date.now() - 10000),
      to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    }),
    {  onResult: r => r.availabilityBlocks.length === 3 }, 
  )
  await async_test(
    '[group booking] prevent double-book same-enduser',
    () => enduserSDK.api.calendar_events.book_appointment({
      calendarEventTemplateId: event30minGroup.id,
      startTime: new Date(nySlots.availabilityBlocks[1].startTimeInMS),
      userId: nySlots.availabilityBlocks[1].userId, 
    }),
    handleAnyError
  )
  await async_test(
    '[group booking] allow other enduser to book',
    () => enduserSDK2.api.calendar_events.book_appointment({
      calendarEventTemplateId: event30minGroup.id,
      startTime: new Date(nySlots.availabilityBlocks[1].startTimeInMS),
      userId: nySlots.availabilityBlocks[1].userId, 
    }),
    passOnAnyResult
  )
  await async_test(
    '[group booking] no more booking allowed',
    () => enduserSDK.api.calendar_events.get_appointment_availability({
      calendarEventTemplateId: event30minGroup.id,
      from: new Date(Date.now() - 10000),
      to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    }),
    {  onResult: r => r.availabilityBlocks.length === 2 }, 
  )
  await async_test(
    '[group booking] other enduser cant book over capacity',
    () => enduserSDK3.api.calendar_events.book_appointment({
      calendarEventTemplateId: event30minGroup.id,
      startTime: new Date(nySlots.availabilityBlocks[1].startTimeInMS),
      userId: nySlots.availabilityBlocks[1].userId, 
    }),
    handleAnyError
  )

  // test 'multi' flag for booking multiple providers for a given patient
  await sdk.api.users.updateOne(sdk.userInfo.id, { 
    weeklyAvailabilities: [
      { 
        dayOfWeekStartingSundayIndexedByZero: 0,
        startTimeInMinutes: 60 * 12, // noon,
        endTimeInMinutes: 60 * 13, // 1pm,
      },
    ],
    timezone: 'America/New_York',
  }, {
    replaceObjectFields: true,
  })
  await sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, { 
    weeklyAvailabilities: [
      { 
        dayOfWeekStartingSundayIndexedByZero: 0,
        startTimeInMinutes: 60 * 12, // noon,
        endTimeInMinutes: 60 * 14, // 2pm,
      },
    ],
    timezone: 'America/New_York',
  }, {
    replaceObjectFields: true,
  })

  const multiSlots = await enduserSDK.api.calendar_events.get_appointment_availability({
    calendarEventTemplateId: event30min.id,
    from: new Date(Date.now()),
    to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    multi: true,
    userIds: [sdk.userInfo.id, sdkNonAdmin.userInfo.id]
  })
  
  assert(multiSlots.availabilityBlocks.length === 2, 'expected 2 slots', 'multi slots are intersection of availability')

  const bookedMultiAppointment = (await enduserSDK.api.calendar_events.book_appointment({
    calendarEventTemplateId: event30min.id,
    startTime: new Date(multiSlots.availabilityBlocks[0].startTimeInMS),
    userId: sdk.userInfo.id, 
    otherUserIds: [sdkNonAdmin.userInfo.id]
  })).createdEvent
  assert(
    (
      bookedMultiAppointment.attendees.length === 3 
      && bookedMultiAppointment.attendees.filter(a => a.type === 'enduser').length === 1
    ),
    'did not get valid attendees', 
    'Multi attendees fo multi-event'
  )

  await async_test(
    'booking against conflict prevented 1 user',
    () => enduserSDK.api.calendar_events.book_appointment({
      calendarEventTemplateId: event30min.id,
      startTime: new Date(multiSlots.availabilityBlocks[0].startTimeInMS),
      userId: sdk.userInfo.id, 
    }),
    handleAnyError
  )
  await async_test(
    'booking against conflict prevented other user',
    () => enduserSDK.api.calendar_events.book_appointment({
      calendarEventTemplateId: event30min.id,
      startTime: new Date(multiSlots.availabilityBlocks[0].startTimeInMS),
      userId: sdkNonAdmin.userInfo.id, 
    }),
    handleAnyError
  )
  await async_test(
    'booking against conflict prevented 2 users',
    () => enduserSDK.api.calendar_events.book_appointment({
      calendarEventTemplateId: event30min.id,
      startTime: new Date(multiSlots.availabilityBlocks[0].startTimeInMS),
      userId: sdk.userInfo.id, 
      otherUserIds: [sdkNonAdmin.userInfo.id],
    }),
    handleAnyError
  )

  const conflict2 = await sdk.api.calendar_events.createOne({ 
    title: 'conflict', 
    startTimeInMS: nySlots.availabilityBlocks[0].startTimeInMS,
    durationInMinutes: nySlots.availabilityBlocks[0].durationInMinutes,
    attendees: [{ type: 'user', id: sdk.userInfo.id }]
  })
  await sdk.api.calendar_events.updateOne(conflict2.id, { bufferEndMinutes: 30 })
  await async_test(
    'Event buffer end prevents booking',
    () => enduserSDK.api.calendar_events.book_appointment({
      calendarEventTemplateId: event30min.id,
      startTime: new Date(nySlots.availabilityBlocks[1].startTimeInMS),
      userId: nySlots.availabilityBlocks[1].userId, 
    }),
    handleAnyError
  )
  await sdk.api.calendar_events.updateOne(conflict2.id, { bufferEndMinutes: 0 })
  await sdk.api.calendar_event_templates.updateOne(event30min.id, { bufferStartMinutes: 30 })
  await async_test(
    'Template buffer start prevents booking',
    () => enduserSDK.api.calendar_events.book_appointment({
      calendarEventTemplateId: event30min.id,
      startTime: new Date(nySlots.availabilityBlocks[1].startTimeInMS),
      userId: nySlots.availabilityBlocks[1].userId, 
    }),
    handleAnyError
  )

  await sdk.api.calendar_event_templates.updateOne(event30min.id, { bufferStartMinutes: 0 })
  await sdk.api.calendar_events.deleteOne(conflict2.id)

  const conflict3 = await sdk.api.calendar_events.createOne({ 
    title: 'conflict', 
    startTimeInMS: nySlots.availabilityBlocks[1].startTimeInMS,
    durationInMinutes: nySlots.availabilityBlocks[1].durationInMinutes,
    attendees: [{ type: 'user', id: sdk.userInfo.id }]
  })
  await sdk.api.calendar_events.updateOne(conflict3.id, { bufferStartMinutes: 30 })
  await async_test(
    'Event buffer start prevents booking',
    () => enduserSDK.api.calendar_events.book_appointment({
      calendarEventTemplateId: event30min.id,
      startTime: new Date(nySlots.availabilityBlocks[0].startTimeInMS),
      userId: nySlots.availabilityBlocks[0].userId, 
    }),
    handleAnyError
  )
  await sdk.api.calendar_events.updateOne(conflict3.id, { bufferStartMinutes: 0 })
  await sdk.api.calendar_event_templates.updateOne(event30min.id, { bufferEndMinutes: 30 })
  await async_test(
    'Template buffer end prevents booking',
    () => enduserSDK.api.calendar_events.book_appointment({
      calendarEventTemplateId: event30min.id,
      startTime: new Date(nySlots.availabilityBlocks[0].startTimeInMS),
      userId: nySlots.availabilityBlocks[0].userId, 
    }),
    handleAnyError
  )

  await Promise.all([
    sdk.api.endusers.deleteOne(e1.id),
    sdk.api.endusers.deleteOne(e2.id),
    sdk.api.endusers.deleteOne(e3.id),
    sdk.api.calendar_event_templates.deleteOne(event30min.id),
    sdk.api.calendar_event_templates.deleteOne(event30minGroup.id),
    sdk.api.calendar_event_templates.deleteOne(event15min.id),
    sdk.api.calendar_events.deleteOne(bookedAppointment.id),
    sdk.api.calendar_events.deleteOne(bookedMultiAppointment.id),
    sdk.api.calendar_events.deleteOne(groupEvent.id),
    sdk.api.calendar_events.deleteOne(conflict3.id),
  ])
}

export const role_based_access_permissions_tests = async () => {
  log_header("Role Based Access Permission (Custom Roles)")
  const noEnduserAccessRole = 'no-enduser-access'

  const rbap = await sdk.api.role_based_access_permissions.createOne({
    role: noEnduserAccessRole,
    permissions: {
      endusers: {
        create: null,
        read: null,
        delete: null,
        update: null,
      }
    }
  })
  const sdkNonAdminId = sdkNonAdmin.userInfo.id

  await sdk.api.users.updateOne(sdkNonAdminId, { roles: [noEnduserAccessRole] }, { replaceObjectFields: true }),
  await sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword) // to use new role, handle logout on role change

  await async_test(
    'non-root admin can read',
    () => sdkSub.api.role_based_access_permissions.getOne(rbap.id),
    passOnAnyResult,
  ) 
  await async_test(
    'non-root admin can read many',
    () => sdkSub.api.role_based_access_permissions.getSome(),
    { onResult: rs => rs.length > 0 },
  ) 
  await async_test(
    'non-root admin blocked create',
    () => sdkSub.api.role_based_access_permissions.createOne({
      role: noEnduserAccessRole,
      permissions: {
        endusers: {
          create: null,
          read: null,
          delete: null,
          update: null,
        }
      }
    }),
    handleAnyError
  ) 
  await async_test(
    'non-root admin blocked update',
    () => sdkSub.api.role_based_access_permissions.updateOne(rbap.id, { role: 'updated'}),
    handleAnyError
  ) 
  await async_test(
    'non-root admin blocked delete',
    () => sdkSub.api.role_based_access_permissions.deleteOne(rbap.id),
    handleAnyError
  ) 

  await async_test(
    'enduser read access restriction working',
    () => sdkNonAdmin.api.endusers.getSome(),
    handleAnyError
  ) 

  // cleanup
  await sdk.api.role_based_access_permissions.deleteOne(rbap.id)
  await sdk.api.users.updateOne(sdkNonAdminId, { roles: ['Non-Admin'], tags: ['avoid rate limit'] }, { replaceObjectFields: true })
  await sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword) // to use new role, handle logout on role change
}

// runs tests and resets availability afterwards
// creates a new enduser (to avoid duplicate autoreply)
const run_autoreply_test = async (title: string, { expectingAutoreply, autoreplyText } : { expectingAutoreply: boolean, autoreplyText?: string }) => {
  log_header(`Autoreply: ${title}`)

  const enduser = await sdk.api.endusers.createOne({ fname: 'Autoreply', lname: "Test", email: "autoreply@tellescope.com" })
  await sdk.api.endusers.set_password({ id: enduser.id, password })
  await enduserSDK.authenticate(enduser.email!, password)

  const room = await sdk.api.chat_rooms.createOne({ 
    userIds: [sdk.userInfo.id],
    enduserIds: [enduser.id]
  })

  await sdk.api.chats.createOne({ roomId: room.id, message: 'user' })
  await wait (undefined, 50)
  await async_test(
    'User/outbound chat does not trigger autoreply',
    () => sdk.api.chats.getSome({ filter: { roomId: room.id }}),
    { onResult: cs => cs.length === 1 }
  ) 
 
  await enduserSDK.api.chats.createOne({ roomId: room.id, message: 'enduser' })
  await async_test(
    'Main test',
    () => pollForResults(
      () => sdk.api.chats.getSome({ filter: { roomId: room.id }}),
      cs => (
        expectingAutoreply
          ? (cs.length === 3 && (!autoreplyText || cs[0].message === autoreplyText))
          : cs.length === 2
      ),
      25,
      10
    ),
    passOnAnyResult
  ) 

  await enduserSDK.api.chats.createOne({ roomId: room.id, message: 'enduser again' })
  await wait (undefined, 50)
  await async_test(
    "Duplicate autoreply avoided",
    () => sdk.api.chats.getSome({ filter: { roomId: room.id }}),
    { onResult: cs => (
      expectingAutoreply
        ? cs.length === 4
        : cs.length === 3
    ) }
  ) 

  // cleanup, including any availability blocks
  const blocks = await sdk.api.availability_blocks.getSome()
  await Promise.all([
    sdk.api.endusers.deleteOne(enduser.id),
    sdk.api.chat_rooms.deleteOne(room.id),

    // cleanup availabilities
    sdk.api.users.updateOne(sdk.userInfo.id, {
      weeklyAvailabilities: [],
      url: Math.random().toString().slice(2, 10), // avoid rate limit
    }, {
      replaceObjectFields: true
    }),
    ...blocks.map(b => (
      sdk.api.availability_blocks.deleteOne(b.id)
    ))
  ])
}

const auto_reply_tests = async () => {
  // cleanup user availabilities / autoReplyEnabled to avoid conflicts
  await sdk.api.users.updateOne(sdk.userInfo.id, {
    autoReplyEnabled: false,
    weeklyAvailabilities: [],
    url: Math.random().toString().slice(2, 10), // avoid rate limit
  }, { replaceObjectFields: true })
  await sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
    settings: { endusers: { autoReplyEnabled: false } }
  })
  await sdk.api.organizations.updateOne(
    sdk.userInfo.businessId, 
    { outOfOfficeHours: [] }, 
    { replaceObjectFields: true }
  )

  log_header("Autoreply (Organization-wide)")
  await run_autoreply_test('No availabilities', { expectingAutoreply: false })

  const today = new Date()


  // test organization out of office blocks
  const oooMessage = "Custom out of office reply" 
  await sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
    settings: { endusers: { autoReplyEnabled: true } }
  })
  await sdk.api.organizations.updateOne(
    sdk.userInfo.businessId, 
    {
      outOfOfficeHours: [{
        from: new Date(Date.now() - 1000 * 60 * 60 * 24),
        to: new Date(Date.now() + 1000 * 60 * 60 * 24),
        autoreplyText: oooMessage
      }]
    },
    { replaceObjectFields: true }
  )

  await run_autoreply_test('Organization OOO overlap', { expectingAutoreply: true, autoreplyText: oooMessage })

  await sdk.api.organizations.updateOne(
    sdk.userInfo.businessId, 
    {
      outOfOfficeHours: [
        {
          from: new Date(Date.now() - 1000 * 60 * 60 * 48),
          to: new Date(Date.now() - 1000 * 60 * 60 * 24),
          autoreplyText: oooMessage
        },
        {
          from: new Date(Date.now() + 1000 * 60 * 60 * 24),
          to: new Date(Date.now() + 1000 * 60 * 60 * 48),
          autoreplyText: oooMessage
        },
      ]
    },
    { replaceObjectFields: true }
  )

  await run_autoreply_test('Organization OOO no overlap', { expectingAutoreply: false })

  // cleanup
  await sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
    settings: { endusers: { autoReplyEnabled: false } }
  })
  await sdk.api.organizations.updateOne(
    sdk.userInfo.businessId, 
    { outOfOfficeHours: [] }, 
    { replaceObjectFields: true }
  )
  await run_autoreply_test('Organization no OOO blocks', { expectingAutoreply: false })
  // done test organization out of office blocks


  const activeBlockInfo = { 
    dayOfWeekStartingSundayIndexedByZero: today.getDay(),
    startTimeInMinutes: 0,
    endTimeInMinutes: 60 * 24,
    entity: 'organization' as const,
    entityId: sdk.userInfo.businessId,
    index: 0,
  }
  const activeWithRange = { 
    ...activeBlockInfo,
    active: {
      from: new Date(Date.now() - 1000000),
      to: new Date(Date.now() + 1000000),
    }
  }
  const inactiveEarly = { 
    ...activeBlockInfo,
    active: { from: new Date(Date.now() + 1000000) }
  }
  const inactiveLate = { 
    ...activeBlockInfo,
    active: { to: new Date(Date.now() - 1000000) }
  }
  const wrongDayBlockInfo = { 
    ...activeBlockInfo,
    dayOfWeekStartingSundayIndexedByZero: (today.getDay() + 1) % 7,
  }
  const wrongEntityTypeBlockInfo = { 
    ...activeBlockInfo,
    entity: 'user' as const,
  }
  const wrongEntityIdInfo = { 
    ...activeBlockInfo,
    entityId: sdk.userInfo.id,
  }
  const wrongTimeBlockInfo = { 
    ...activeBlockInfo, 
    endTimeInMinutes: 0, // start and end at 0
  }

  await sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
    settings: { endusers: { autoReplyEnabled: false } }
  })

  await sdk.api.availability_blocks.createSome([wrongTimeBlockInfo])
  await run_autoreply_test('Autoreply disabled', { expectingAutoreply: false })

  await sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
    settings: { endusers: { autoReplyEnabled: true } }
  })

  await sdk.api.availability_blocks.createSome([wrongTimeBlockInfo])
  await run_autoreply_test('One bad', { expectingAutoreply: true })

  await sdk.api.availability_blocks.createSome([
    inactiveEarly,
    inactiveLate, 
    wrongDayBlockInfo, 
    wrongEntityIdInfo, 
    wrongEntityTypeBlockInfo, 
    wrongTimeBlockInfo,
  ])
  await run_autoreply_test('Multiple bad blocks', { expectingAutoreply: true })

  await sdk.api.availability_blocks.createSome([activeBlockInfo])
  await run_autoreply_test('One active block', { expectingAutoreply: false })

  await sdk.api.availability_blocks.createSome([activeWithRange])
  await run_autoreply_test('One active with range', { expectingAutoreply: false })

  await sdk.api.availability_blocks.createSome([activeBlockInfo, activeWithRange, activeBlockInfo, activeWithRange])
  await run_autoreply_test('Multiple active blocks', { expectingAutoreply: false })


  log_header("Autoreply (User)")
  await sdk.api.users.updateOne(sdk.userInfo.id, {
    autoReplyEnabled: false,
  })

  await sdk.api.users.updateOne(sdk.userInfo.id, { 
    weeklyAvailabilities: [wrongTimeBlockInfo]
  })
  await run_autoreply_test('User: Autoreply disabled', { expectingAutoreply: false })

  await sdk.api.users.updateOne(sdk.userInfo.id, {
    autoReplyEnabled: true,
  })

  await sdk.api.users.updateOne(sdk.userInfo.id, { weeklyAvailabilities: [wrongTimeBlockInfo] })
  await run_autoreply_test('User: One bad', { expectingAutoreply: true })

  await sdk.api.users.updateOne(sdk.userInfo.id, { 
    weeklyAvailabilities: [
      inactiveEarly,
      inactiveLate, 
      wrongDayBlockInfo, 
    ]
  })
  await run_autoreply_test('User: Multiple bad blocks', { expectingAutoreply: true })

  await sdk.api.users.updateOne(sdk.userInfo.id, { weeklyAvailabilities: [activeBlockInfo] })
  await run_autoreply_test('User: One active block', { expectingAutoreply: false })

  await sdk.api.users.updateOne(sdk.userInfo.id, { weeklyAvailabilities: [activeWithRange] })
  await run_autoreply_test('User: One active with range', { expectingAutoreply: false })

  await sdk.api.users.updateOne(sdk.userInfo.id, { weeklyAvailabilities: [activeBlockInfo, activeWithRange, activeBlockInfo, activeWithRange] })
  await run_autoreply_test('User: Multiple active blocks', { expectingAutoreply: false })
}

const merge_enduser_tests = async () => {
  log_header("Merge Endusers")

  const stripeCustomerId = 'example_cu_id';
  const stripeKey = 'example_stripe_key';
  const [source, destination, otherEnduser] = (await sdk.api.endusers.createSome([
    { 
      email: 'source@tellescope.com', fname: 'source', lname: 'enduser', 
      references: [{ type: '2', id: '2.2' }, { type: '3', id: '3.2' }, { type: '4', id: '4.2'}], 
      // @ts-ignore
      stripeCustomerId,
      stripeKey,
      athenaPracticeId: '12345',
      athenaDepartmentId: '54321',
    },
    { email: 'destination@tellescope.com', source: '4', externalId: "4", references: [{ type: '1', id: '1' }, { type: '2', id: '2' }] },
    { email: 'other@tellescope.com'},
  ])).created

  // represents any model with enduserId field
  const [emailToMove, email] = (await sdk.api.emails.createSome([
    { enduserId: source.id, subject: 'subject', logOnly: true, textContent: 'email' },
    { enduserId: otherEnduser.id, subject: 'subject', logOnly: true, textContent: 'email' },
  ])).created

  const [eventToMove, event] = (await sdk.api.calendar_events.createSome([
    { attendees: [{ type: 'enduser', id: source.id }], durationInMinutes: 5, startTimeInMS: Date.now(), title: 'title' },
    { attendees: [{ type: 'enduser', id: otherEnduser.id }], durationInMinutes: 5, startTimeInMS: Date.now(), title: 'title' },
  ])).created

  const [roomToMove, room] = (await sdk.api.chat_rooms.createSome([
    { enduserIds: [source.id], title: 'title' },
    { enduserIds: [otherEnduser.id], title: 'title' },
  ])).created

  const chatToMove = await sdk.api.chats.createOne(
    { roomId: roomToMove.id, senderId: source.id, message: 'test' },
  )
  const chat = await sdk.api.chats.createOne({ 
    roomId: room.id, senderId: otherEnduser.id, message: 'test' 
  })

  await sdk.api.endusers.merge({ sourceEnduserId: source.id, destinationEnduserId: destination.id })

  await async_test(
    "Source is deleted",
    () => sdk.api.endusers.getOne(source.id),
    handleAnyError
  )
  await async_test(
    "Destination merged",
    () => sdk.api.endusers.getOne(destination.id),
    { onResult: e => (
         e.email === destination.email
      && e.fname === source.fname
      && e.lname === source.lname
      && e.stripeKey === stripeKey
      && e.stripeCustomerId === stripeCustomerId
      && !!e.athenaPracticeId   && e.athenaPracticeId === source.athenaPracticeId
      && !!e.athenaDepartmentId && e.athenaDepartmentId === source.athenaDepartmentId
      && e.source === '4' && e.externalId === '4' // should prevent 4 from syncing to references at all
      && e.references?.find(r => r.type === '1')?.id === '1'
      && e.references?.find(r => r.type === '2')?.id === '2'
      && e.references?.find(r => r.type === '3')?.id === '3.2'
      && !e.references?.find(r => r.type === '4')?.id 
    )}
  )
    
  await async_test(
    "Other email is unchanged",
    () => sdk.api.emails.getOne(email.id),
    { onResult: e => e.enduserId === otherEnduser.id}
  )
  await async_test(
    "Other event is unchanged",
    () => sdk.api.calendar_events.getOne(event.id),
    { onResult: e => e.attendees?.length === 1 && !!e.attendees.find(e => e.id === otherEnduser.id)}
  )
  await async_test(
    "Other room is unchanged",
    () => sdk.api.chat_rooms.getOne(room.id),
    { onResult: e => room.enduserIds?.length === 1 && !!e.enduserIds?.find(id => id === otherEnduser.id)}
  )
  await async_test(
    "Other chat is unchanged",
    () => sdk.api.chats.getOne(chat.id),
    { onResult: e => e.senderId === otherEnduser.id}
  )

  await async_test(
    "Email moved",
    () => sdk.api.emails.getOne(emailToMove.id),
    { onResult: e => e.enduserId === destination.id }
  )
  await async_test(
    "Chat moved",
    () => sdk.api.chats.getOne(chatToMove.id),
    { onResult: e => e.senderId === destination.id }
  )
  await async_test(
    "Room moved",
    () => sdk.api.chat_rooms.getOne(roomToMove.id),
    { onResult: e => e.enduserIds?.length === 1 && !!e.enduserIds?.includes(destination.id) }
  )
  await async_test(
    "Event moved",
    () => sdk.api.calendar_events.getOne(eventToMove.id),
    { onResult: e => e.attendees.length === 1 && !!e.attendees?.find(a => a.id === destination.id) }
  )

  await Promise.all([
    sdk.api.endusers.deleteOne(destination.id),
    sdk.api.endusers.deleteOne(otherEnduser.id),
    sdk.api.calendar_events.deleteOne(event.id),
    sdk.api.calendar_events.deleteOne(eventToMove.id),
  ])
}

const wait_for_trigger_tests = async () => {
  log_header("Wait for Trigger")

  const [eTrigger, eNoTrigger] = (await sdk.api.endusers.createSome([
    { fname: 'Trigger' },
    { fname: 'No Trigger' },
  ])).created

  const journey = await sdk.api.journeys.createOne({
    title: "Trigger test",
  })
  const start = await sdk.api.automation_steps.createOne({
    events: [{ type: 'onJourneyStart', info: { } }],
    action: { type: 'setEnduserStatus', info: { status: 'Started' } },
    journeyId: journey.id,
  })
  const trigger = await sdk.api.automation_triggers.createOne({
    event: { type: 'Field Equals', info: { field: 'Test', value: "Trigger" } },
    action: { type: "Move To Step", info: { } },
    status: 'Active',
    title: 'In-Journey Trigger',
    journeyId: journey.id, 
  })
  await sdk.api.automation_steps.createOne({
    events: [{ type: 'waitForTrigger', info: { triggerId: trigger.id, automationStepId: start.id } }],
    action: { type: 'setEnduserStatus', info: { status: 'Triggered' } },
    journeyId: journey.id,
  })

  await sdk.api.endusers.add_to_journey({ enduserIds: [eTrigger.id], journeyId: journey.id })
  await wait(undefined, 8000)

  await async_test(
    "Journey started",
    () => sdk.api.endusers.getOne(eTrigger.id),
    { onResult: e => e.journeys?.[journey.id] === 'Started' }
  )

  await sdk.api.endusers.updateOne(eTrigger.id, { fields: { Test: 'Trigger' } })
  await sdk.api.endusers.updateOne(eNoTrigger.id, { fields: { Test: 'Trigger' } })
  await wait(undefined, 8000)
  
  // TODO - Test a delayed action which comes after the triggered action

  await async_test(
    "Trigger worked while in journey",
    () => sdk.api.endusers.getOne(eTrigger.id),
    { onResult: e => e.journeys?.[journey.id] === 'Triggered' }
  )
  await async_test(
    "Trigger did not fire while not journey",
    () => sdk.api.endusers.getOne(eNoTrigger.id),
    { onResult: e => !e.journeys?.[journey.id] }
  )

  // cleanup
  await Promise.all([
    sdk.api.endusers.deleteOne(eTrigger.id),
    sdk.api.endusers.deleteOne(eNoTrigger.id),
    sdk.api.journeys.deleteOne(journey.id),
  ])

  // test trigger cleaned up on journey delete
  await async_test(
    "Trigger cleaned up by journey deletion",
    () => pollForResults(
      sdk.api.automation_triggers.getSome,
      results => !results.find(r => r.id === trigger.id),
      100,
      10,
    ),
    passOnAnyResult
  )

  // double-check that wait for trigger step triggers were deleted
}


const handleRateLimitError = { shouldError: true, onError: (e: { message: string }) => e.message === 'Rate limit exceeded'}
const rate_limit_tests = async () => {
  log_header("Rate Limits")

  // these fields indicate messages won't be sent even without logOnly: true
  const [e1, e2, e3] = (await sdk.api.endusers.createSome([
    { fname: '1', email: 'dontsend@tellescope.com', phone: '+15555555555' },
    { fname: '2', email: 'dontsend2@tellescope.com', phone: '+15555555555' },
    { fname: 'Logonly', email: 'dontsend3@tellescope.com', phone: '+15555555555' },
  ])).created

  // prevent duplicate updates to same enduser
  await async_test(
    "Duplicate updates 1",
    () => sdk.api.endusers.updateOne(e1.id, { fields: { Test: 'Trigger' } }),
    passOnAnyResult
  )
  await async_test(
    "Duplicate updates 2",
    () => sdk.api.endusers.updateOne(e1.id, { fields: { Test: 'Trigger' } }),
    passOnAnyResult
  )
  await async_test(
    "Duplicate updates 3",
    () => sdk.api.endusers.updateOne(e1.id, { fields: { Test: 'Trigger' } }),
    passOnAnyResult
  )
  await async_test(
    "Duplicate updates 4 (should trip)",
    () => sdk.api.endusers.updateOne(e1.id, { fields: { Test: 'Trigger' } }),
    handleRateLimitError
  )
  await async_test(
    "Duplicate updates 5 (should trip again)",
    () => sdk.api.endusers.updateOne(e1.id, { fields: { Test: 'Trigger' } }),
    handleRateLimitError
  )
  await async_test(
    "Duplicate updates other enduser (should not again)",
    () => sdk.api.endusers.updateOne(e2.id, { fields: { Test: 'Trigger' } }),
    passOnAnyResult
  )

  await async_test(
    "Same template email rate limit 1-per-minute",
    () => sdk.api.emails.createSome([
      { enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', templateId: PLACEHOLDER_ID },
      { enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', templateId: PLACEHOLDER_ID },
    ]),
    handleRateLimitError
  )

  // these should work, as 1 each is safe
  const [email1, email2] = (await sdk.api.emails.createSome([
    { enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', templateId: PLACEHOLDER_ID },
    { enduserId: e2.id, subject: 'ratelimit', textContent: 'rate limit', templateId: PLACEHOLDER_ID },
  ])).created
  // already has 1 created 
  await async_test(
    "Same enduser rate limit 5 per 5 seconds",
    () => sdk.api.emails.createSome([
      { enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', },
      { enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', },
      { enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', },
      { enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', },
      { enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit' },
    ]),
    handleRateLimitError
  )

  await async_test(
    "Same enduser rate limit 5 per 5 seconds not for log only",
    () => sdk.api.emails.createSome([
      { logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', },
      { logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', },
      { logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', },
      { logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', },
      { logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit' },
    ]),
    passOnAnyResult
  )

  await wait(undefined, 2500) // give it some time before trying again, to ensure still blocked after 2.5 < 60 seconds
  await async_test(
    "Same template email rate limit 1-per-minute after creating",
    () => sdk.api.emails.createOne({
      enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', templateId: PLACEHOLDER_ID
    }),
    handleRateLimitError
  )
  await async_test(
    "Same template email rate limit 1-per-minute not for logOnly 1",
    () => sdk.api.emails.createOne({
      logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', templateId: PLACEHOLDER_ID
    }),
    passOnAnyResult
  )
  await async_test(
    "Same template email rate limit 1-per-minute not for logOnly 2",
    () => sdk.api.emails.createOne({
      logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', templateId: PLACEHOLDER_ID
    }),
    passOnAnyResult
  )


  await async_test(
    "Same template sms rate limit 1-per-minute",
    () => sdk.api.sms_messages.createSome([
      { enduserId: e1.id, templateId: PLACEHOLDER_ID, message: 'hi' },
      { enduserId: e1.id, templateId: PLACEHOLDER_ID, message: 'hi' },
    ]),
    handleRateLimitError
  )

  // these should work, as 1 each is safe
  const [sms1, sms2] = (await sdk.api.sms_messages.createSome([
    { enduserId: e1.id, templateId: PLACEHOLDER_ID, message: 'hi' },
    { enduserId: e2.id, templateId: PLACEHOLDER_ID, message: 'hi' },
  ])).created
  // already has 1 created, so 3 new should error (4 > 3)
  await async_test(
    "Same enduser sms rate limit 3 per 3 seconds",
    () => sdk.api.sms_messages.createSome([
      { enduserId: e1.id, message: 'hi' },
      { enduserId: e1.id, message: 'hi' },
      { enduserId: e1.id, message: 'hi' },
    ]),
    handleRateLimitError
  )

  await async_test(
    "Same enduser sms rate limit not applied on logOnly 3 per 3 seconds",
    () => sdk.api.sms_messages.createSome([
      { logOnly: true, enduserId: e3.id, message: 'hi' },
      { logOnly: true, enduserId: e3.id, message: 'hi' },
      { logOnly: true, enduserId: e3.id, message: 'hi' },
      { logOnly: true, enduserId: e3.id, message: 'hi' },
      { logOnly: true, enduserId: e3.id, message: 'hi' },
    ]),
    passOnAnyResult
  )

  await wait(undefined, 2500) // give it some time before trying again, to ensure still blocked after 2.5 < 60 seconds
  await async_test(
    "Same template sms rate limit 1-per-minute after creating",
    () => sdk.api.sms_messages.createOne({ 
      enduserId: e2.id, templateId: PLACEHOLDER_ID, message: 'hi' 
    }),
    handleRateLimitError
  )
  await async_test(
    "Same template sms rate limit 1-per-minute logonly does not apply 1",
    () => sdk.api.sms_messages.createOne({ 
      logOnly: true, enduserId: e2.id, templateId: PLACEHOLDER_ID, message: 'hi' 
    }),
    passOnAnyResult
  )
  await async_test(
    "Same template sms rate limit 1-per-minute logonly does not apply 2",
    () => sdk.api.sms_messages.createOne({ 
      logOnly: true, enduserId: e2.id, templateId: PLACEHOLDER_ID, message: 'hi' 
    }),
    passOnAnyResult
  )

  // these should work, as they do not have the same template
  await sdk.api.emails.createSome([
    { enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit' },
    { enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit' },
    { enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit' },
  ])
 
  await Promise.all([
    sdk.api.endusers.deleteOne(e1.id),
    sdk.api.endusers.deleteOne(e2.id),
    sdk.api.endusers.deleteOne(e3.id),
  ])
}

const remove_from_journey_on_incoming_comms_tests = async () => {
  log_header("Remove From Journey (Incoming Comms)")

  const [e1, e2] = (await sdk.api.endusers.createSome([
    { fname: '1', email: 'e1@tellescope.com', phone: '+15555555555' },
    { fname: '2', email: 'e2@tellescope.com', phone: '+15555555555' },
  ])).created

  const [jRemove, jDontRemove] = (await sdk.api.journeys.createSome([
    { title: "j1", onIncomingEnduserCommunication: 'Remove' },
    { title: "j2" },
  ])).created

  const removeStep1 = await sdk.api.automation_steps.createOne({
    journeyId: jRemove.id,
    events: [{ type: 'onJourneyStart', info: {} }],
    action: { type: 'setEnduserStatus', info: { status: 'Started' } },
  })
  const removeStep2 = await sdk.api.automation_steps.createOne({
    journeyId: jRemove.id,
    events: [{ type: 'afterAction', info: { automationStepId: removeStep1.id, delay: 0, delayInMS: 1000000, unit: 'Days' } }],
    action: { type: 'setEnduserStatus', info: { status: 'Continued' } },
  })

  const dontRemoveStep1 = await sdk.api.automation_steps.createOne({
    journeyId: jDontRemove.id,
    events: [{ type: 'onJourneyStart', info: {} }],
    action: { type: 'setEnduserStatus', info: { status: 'Started' } },
  })
  const dontRemoveStep2 = await sdk.api.automation_steps.createOne({
    journeyId: jDontRemove.id,
    events: [{ type: 'afterAction', info: { automationStepId: dontRemoveStep1.id, delay: 0, delayInMS: 1000000, unit: 'Days' } }],
    action: { type: 'setEnduserStatus', info: { status: 'Continued' } },
  })

  await sdk.api.endusers.updateOne(e1.id, { journeys: { [jRemove.id]: '', [jDontRemove.id]: '' } })
  await sdk.api.endusers.updateOne(e2.id, { journeys: { [jRemove.id]: '', [jDontRemove.id]: '' } })
  await wait(undefined, 100)

  const room = await sdk.api.chat_rooms.createOne({ })
  await sdk.api.chats.createOne({ roomId: room.id, senderId: e1.id, message: 'cancel' })

  await async_test(
    "Appropriate Automated Actions are cancelled on incoming message",
    () => pollForResults(
      sdk.api.automated_actions.getSome,
      actions => (
          !!actions.find(a => 
              a.journeyId === jRemove.id
            && a.automationStepId === removeStep1.id
            && a.enduserId === e1.id
            && a.status === 'cancelled'
          )
        && !!actions.find(a => 
            a.journeyId === jRemove.id
          && a.automationStepId === removeStep1.id
          && a.enduserId === e2.id
          && a.status === 'active'
        )
        && !!actions.find(a => 
            a.journeyId === jDontRemove.id
          && a.automationStepId === dontRemoveStep1.id
          && a.enduserId === e1.id
          && a.status === 'active'
        )
        && !!actions.find(a => 
            a.journeyId === jDontRemove.id
          && a.automationStepId === dontRemoveStep1.id
          && a.enduserId === e2.id
          && a.status === 'active'
        )
      ),
      50,
      400,
    ),
    passOnAnyResult,
  ) 

  await sdk.api.journeys.handle_incoming_communication({ enduserId: e2.id })
  await async_test(
    "handle_incoming_communication test for other enduser",
    () => pollForResults(
      sdk.api.automated_actions.getSome,
      actions => (
        !!actions.find(a => 
            a.journeyId === jRemove.id
          && a.automationStepId === removeStep1.id
          && a.enduserId === e2.id
          && a.status === 'cancelled'
        )
      ),
      100,
      25,
    ),
    passOnAnyResult
  ) 
 
  await Promise.all([
    sdk.api.endusers.deleteOne(e1.id),
    sdk.api.endusers.deleteOne(e2.id),
    sdk.api.journeys.deleteOne(jRemove.id),
    sdk.api.journeys.deleteOne(jDontRemove.id),
    sdk.api.chat_rooms.deleteOne(room.id),
  ])
}

const pdf_generation = async () => {
  log_header("pdf_generation Tests")

  const e = await sdk.api.endusers.createOne({ fname: 'test' })

  // include lots of answers to ensure PDF height doesn't produce any cut-off
  const responses: FormResponseValue[] = []
  for (let i=0; i < 3; i++) {
    responses.push({
      fieldId: PLACEHOLDER_ID, fieldTitle: 'test', answer: { 
        type: 'string', 
        value: `Answer ${i} 😅 _-!@#$%^&*()+<>?{}|[] áccéñt test`
      },
    })
  }
  const fr = await sdk.api.form_responses.createOne({ 
    formId: PLACEHOLDER_ID, 
    enduserId: e.id,
    formTitle: 'Form Title',
    responses: responses
  })

  axios.get(
    `http://localhost:8080/v1/form-responses/generate-pdf?id=${fr.id}`,
    {
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${sdk.authToken}`
      }
    }
  )
  .then(d => (
    fs.writeFileSync('test_generated.pdf', d.data)
  ))
  
  await Promise.all([
    sdk.api.endusers.deleteOne(e.id),
  ])
}

const mfa_tests = async () => {
  log_header("MFA Tests")
  await sdkMfa.authenticate(mfaEmail, mfaPassword)

  await async_test(
    "MFA must be handled before sdk works",
    () => sdkMfa.api.endusers.createOne({ fname: 'wont work'}),
    { shouldError: true, onError: (e: any) => e === 'Unauthenticated' }
  ) 

  const enduser = await sdkMfaApiKey.api.endusers.createOne({ fname: 'will work' })
  await async_test(
    "API Key Auth does not require MFA",
    () => sdkMfaApiKey.api.endusers.deleteOne(enduser.id),
    passOnAnyResult
  ) 
  
  sdkMfa.setAuthToken((await sdkMfaApiKey.api.users.generate_auth_token({ email: mfaEmail })).authToken)

  // test usage and cleanup
  const e = await sdkMfa.api.endusers.createOne({ fname: 'will work'})
  await async_test(
    "API-key generated token does not require MFA",
    () => sdkMfa.api.endusers.deleteOne(e.id),
    passOnAnyResult
  ) 
}

const nextReminderInMS_tests = async () => {
  log_header("nextReminderInMS Tests")

  const startTimeInMS = Date.now() + 1000 * 60 * 60 * 24 * 7
  const durationInMinutes = 60

  const eNoReminders = await sdk.api.calendar_events.createOne({ title: 'eNoReminders', startTimeInMS, durationInMinutes })
  await wait(undefined, 100)
  await async_test(
    "Create no reminders",
    () => sdk.api.calendar_events.getOne(eNoReminders.id),
    { onResult: e => e.nextReminderInMS === -1 }
  ) 

  await sdk.api.calendar_events.updateOne(eNoReminders.id, { title: 'updated title' })
  await wait(undefined, 100)
  await async_test(
    "Update title, no change",
    () => sdk.api.calendar_events.getOne(eNoReminders.id),
    { onResult: e => e.nextReminderInMS === -1}
  ) 

  const eOneReminder = await sdk.api.calendar_events.createOne({ 
    title: 'eOneReminder', startTimeInMS, durationInMinutes,
    reminders: [{ type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 1000 }]
  })
  await wait(undefined, 100)
  await async_test(
    "Create one reminder",
    () => sdk.api.calendar_events.getOne(eOneReminder.id),
    { onResult: e => e.nextReminderInMS === startTimeInMS - 1000 }
  ) 

  await sdk.api.calendar_events.updateOne(eOneReminder.id, { startTimeInMS: startTimeInMS - 1000 })
  await wait(undefined, 100)
  await async_test(
    "Update startTimeInMS",
    () => sdk.api.calendar_events.getOne(eOneReminder.id),
    { onResult: e => e.nextReminderInMS === startTimeInMS - 1000 - 1000 }
  ) 

  await sdk.api.calendar_events.updateOne(eOneReminder.id, { 
    reminders: [{ type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 5000 }]
  }, { replaceObjectFields: true })
  await wait(undefined, 100)
  await async_test(
    "Update earliest reminder",
    () => sdk.api.calendar_events.getOne(eOneReminder.id),
    { onResult: e => e.nextReminderInMS === startTimeInMS - 5000 - 1000 }
  ) 

  await sdk.api.calendar_events.updateOne(eOneReminder.id, { 
    reminders: [{ type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 1000 }]
  })
  await wait(undefined, 100)
  await async_test(
    "Later reminder added",
    () => sdkMfaApiKey.api.calendar_events.getOne(eOneReminder.id),
    { onResult: e => e.nextReminderInMS === startTimeInMS - 5000 - 1000 }
  ) 

  await sdk.api.calendar_events.updateOne(eOneReminder.id, { 
    reminders: [{ type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 7500 }]
  })
  await wait(undefined, 100)
  await async_test(
    "Earlier reminder added",
    () => sdk.api.calendar_events.getOne(eOneReminder.id),
    { onResult: e => e.nextReminderInMS === startTimeInMS - 7500 - 1000 }
  ) 

  const eOneReminderDidRemind = await sdk.api.calendar_events.createOne({ 
    title: 'eOneReminderDidRemind', startTimeInMS, durationInMinutes,
    reminders: [{ type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 1000, didRemind: true }]
  })
  await wait(undefined, 100)
  await async_test(
    "One reminder with didRemind: true",
    () => sdk.api.calendar_events.getOne(eOneReminderDidRemind.id),
    { onResult: e => e.nextReminderInMS === -1 }
  ) 

  const eOneReminderDidRemindWithValid = await sdk.api.calendar_events.createOne({ 
    title: 'eOneReminderDidRemindWithValid', startTimeInMS, durationInMinutes,
    reminders: [
      { type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 1000, didRemind: true },
      { type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 0 },
    ]
  })
  await wait(undefined, 100)
  await async_test(
    "Multiple reminders with one didRemind: true",
    () => sdk.api.calendar_events.getOne(eOneReminderDidRemindWithValid.id),
    { onResult: e => e.nextReminderInMS === startTimeInMS }
  ) 

  const eMultipleReminders = await sdk.api.calendar_events.createOne({ 
    title: 'eMultipleReminders', startTimeInMS, durationInMinutes,
    reminders: [
      { type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 1000 },
      { type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 5000 },
      { type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: -3000 },
    ]
  })
  await wait(undefined, 100)
  await async_test(
    "Create multiple reminders",
    () => sdk.api.calendar_events.getOne(eMultipleReminders.id),
    { onResult: e => e.nextReminderInMS === startTimeInMS - 5000 }
  ) 

  // changing far out reminders shouldn't change nextReminderInMS
  await sdk.api.calendar_events.updateOne(eMultipleReminders.id, { 
    reminders: [
      { type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: -1000 },
      { type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 5000 },
      { type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: -8000 },
    ]
  }, { replaceObjectFields: true })
  await wait(undefined, 100)
  await async_test(
    "Later reminders changed", 
    () => sdk.api.calendar_events.getOne(eMultipleReminders.id),
    { onResult: e => e.nextReminderInMS === startTimeInMS - 5000 }
  ) 

  // changing nearest reminder shouldn change nextReminderInMS
  await sdk.api.calendar_events.updateOne(eMultipleReminders.id, { 
    reminders: [
      { type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 6000 },
      { type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 7000 },
      { type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 5000 },
    ]
  }, { replaceObjectFields: true })
  await wait(undefined, 100)
  await async_test(
    "Earlier reminders changed", 
    () => sdkMfaApiKey.api.calendar_events.getOne(eMultipleReminders.id),
    { onResult: e => e.nextReminderInMS === startTimeInMS - 7000 }
  ) 

  await sdk.api.calendar_events.updateOne(eMultipleReminders.id, { 
    startTimeInMS: startTimeInMS - 3000 
  })
  await wait(undefined, 100)
  await async_test(
    "startTimeInMS changed for multiple reminders", 
    () => sdk.api.calendar_events.getOne(eMultipleReminders.id),
    { onResult: e => e.nextReminderInMS === startTimeInMS - 7000 - 3000 }
  ) 

  await Promise.all([
    sdk.api.calendar_events.deleteOne(eNoReminders.id),
    sdk.api.calendar_events.deleteOne(eMultipleReminders.id),
    sdk.api.calendar_events.deleteOne(eOneReminderDidRemindWithValid.id),
    sdk.api.calendar_events.deleteOne(eOneReminderDidRemind.id),
    sdk.api.calendar_events.deleteOne(eOneReminder.id),
  ])
}

const pollForResults = async <T>(f: () => Promise<T>, evaluate: (r: T) => boolean, intervalInMS=500, iterations=20, shouldError=false) => {
  let lastResult = undefined as any
  for (let i = 0; i < iterations; i++) {
    await wait(undefined, intervalInMS)
    const result = await f()
    lastResult = result
    if (evaluate(result)) return result
  }

  if (shouldError) return lastResult

  console.log(lastResult)
  throw new Error("failed pollForResults")
}

const test_ticket_automation_assignment_and_optimization = async () => {
  log_header("Ticket Automation / Assignment Tests")

  const users = await sdk.api.users.getSome()
  if (users.length < 3) throw new Error("Must have at least 3 users to detect invalid assignment")

  await sdk.api.users.updateOne(sdk.userInfo.id, { tags: ['tag1', 'tag2'] })
  await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { tags: ['tag1', 'tag3'] })

  const journey = await sdk.api.journeys.createOne({ title: "Testing" })

  const queue = await sdk.api.ticket_queues.createOne({ title: 'test queue', userIds: [] })

  let foregroundTestCounter = 0
  const testForegroundTicket = async ({
    assignedTo,
    info,
    validOwners,
    enduser,
    closedForReason,
    testDelayedChild,
  } : {
    assignedTo: string[]
    info: Pick<CreateTicketActionInfo, 'assignmentStrategy' | 'defaultAssignee'>,
    validOwners: string[],
    closedForReason?: string,
    enduser?: Enduser,
    testDelayedChild?: boolean,
  }) => {

    const e = enduser || await sdk.api.endusers.createOne({ assignedTo, journeys: { [journey.id]: '' }, fields: { Tag: "tag3"} })

    const step = await sdk.api.automation_steps.createOne({
      action: { type: 'createTicket', info: { ...info, title: 'background ticket' } },
      events: [{ 
        type: 'ticketCompleted', 
        info: closedForReason ? { automationStepId: PLACEHOLDER_ID, closedForReason }  : { automationStepId: PLACEHOLDER_ID } 
      }],
      journeyId: journey.id,
    })
    const statusStep = await sdk.api.automation_steps.createOne({
      action: { type: 'setEnduserStatus', info: { status: 'Test Status' } },
      events: [{ 
        type: 'ticketCompleted', 
        info: closedForReason ? { automationStepId: PLACEHOLDER_ID, closedForReason }  : { automationStepId: PLACEHOLDER_ID } 
      }],
      journeyId: journey.id,
    })
    const child = await sdk.api.automation_steps.createOne({
      action: { type: 'setEnduserStatus', info: { status: 'Test Status' } },
      events: [{ 
        type: 'afterAction', 
        info: {
          automationStepId: step.id,
          delay: 0, delayInMS: 0, unit: 'Days', 
        }
      }],
      journeyId: journey.id,
    })

    const ticket = await sdk.api.tickets.createOne({
      title: 'foreground ticket',
      enduserId: e.id,
      automationStepId: PLACEHOLDER_ID,
      journeyId: journey.id,
      owner: validOwners[0],
      closedForReason,
    })

    await async_test(
      `Foreground ticket assignment ${++foregroundTestCounter}`, 
      () => sdk.api.tickets.close_ticket({ ticketId: ticket.id, closedForReason }),
      { onResult: ({ generated }) => 
           (validOwners.length === 0 && generated?.queueId === queue.id && !generated.owner)
        || (!!generated?.owner && validOwners.includes(generated.owner) )
      }
    ) 
    await async_test(
      `Foreground ticket nop, no duplicates`,
      () => sdk.api.automated_actions.getSome({ filter: { automationStepId: step.id } }),
      { onResult: steps => steps.length === 1 && !!steps[0].isNOP }
    ) 
    await async_test(
      `Background action queued, no duplicates`,
      () => sdk.api.automated_actions.getSome({ filter: { automationStepId: statusStep.id } }),
      { 
        onResult: steps => steps.length === 1 && !steps[0].isNOP 
      }
    ) 

    // verify that ticket generated by close_ticket goes on to generate its own delayed actions
    if (testDelayedChild) {
      await async_test(
        `Delayed child ticket`, 
        () => pollForResults(() => sdk.api.automated_actions.getSome({ filter: { automationStepId: child.id } }), t => !!t.length),
        { onResult: steps => steps.length === 1 && !steps[0].isNOP }
      ) 
    }

    await Promise.all([
      sdk.api.endusers.deleteOne(e.id),
      sdk.api.automation_steps.deleteOne(step.id),
      sdk.api.automation_steps.deleteOne(statusStep.id),
      sdk.api.automation_steps.deleteOne(child.id),
    ])
  }

  await testForegroundTicket({ 
    assignedTo: [],  
    info: { 
      assignmentStrategy: { type: 'queue', info: { queueId: queue.id } } , 
      defaultAssignee: sdk.userInfo.id 
    },
    validOwners: [],
    testDelayedChild: true,
  })
  await testForegroundTicket({ 
    assignedTo: [],  
    info: { 
      assignmentStrategy: { type: 'default', info: {} } , 
      defaultAssignee: sdk.userInfo.id 
    },
    validOwners: [sdk.userInfo.id],
    testDelayedChild: true,
  })
  await testForegroundTicket({ 
    assignedTo: [],  
    info: { 
      assignmentStrategy: { type: 'default', info: {} } , 
      defaultAssignee: sdk.userInfo.id 
    },
    validOwners: [sdk.userInfo.id],
    closedForReason: "closedForReason test",
    testDelayedChild: true,
  })
  await testForegroundTicket({ 
    assignedTo: [],  
    info: { 
      assignmentStrategy: { type: 'default', info: {} } , 
      defaultAssignee: sdkNonAdmin.userInfo.id 
    },
    validOwners: [sdkNonAdmin.userInfo.id],
  })
  await testForegroundTicket({ 
    assignedTo: [],  
    info: { 
      assignmentStrategy: { type: 'previous-owner', info: {} } , 
      defaultAssignee: sdk.userInfo.id 
    },
    validOwners: [sdkNonAdmin.userInfo.id],
  })
  await testForegroundTicket({ 
    assignedTo: [sdkNonAdmin.userInfo.id, sdk.userInfo.id],  
    info: { 
      assignmentStrategy: { type: 'care-team-primary', info: {} } , 
      defaultAssignee: sdk.userInfo.id 
    },
    validOwners: [sdkNonAdmin.userInfo.id],
  })
  await testForegroundTicket({ 
    assignedTo: [sdkNonAdmin.userInfo.id, sdk.userInfo.id],
    info: { 
      assignmentStrategy: { type: 'care-team-random', info: {} } , 
      defaultAssignee: sdk.userInfo.id 
    },
    validOwners: [sdkNonAdmin.userInfo.id, sdk.userInfo.id],
  })
  await testForegroundTicket({ 
    assignedTo: [sdkNonAdmin.userInfo.id, sdk.userInfo.id],
    info: { 
      assignmentStrategy: { type: 'by-tags', info: { qualifier: 'One Of', values: ['tag1']} } , 
      defaultAssignee: sdkNonAdmin.userInfo.id, 
    },
    validOwners: [sdk.userInfo.id, sdkNonAdmin.userInfo.id, ],
  })
  await testForegroundTicket({ 
    assignedTo: [sdkNonAdmin.userInfo.id, sdk.userInfo.id],
    info: { 
      assignmentStrategy: { type: 'by-tags', info: { qualifier: 'One Of', values: ['tag2']} } , 
      defaultAssignee: sdkNonAdmin.userInfo.id 
    },
    validOwners: [sdk.userInfo.id],
  })
  await testForegroundTicket({ 
    assignedTo: [],
    info: { 
      assignmentStrategy: { type: 'by-tags', info: { qualifier: 'One Of', values: ['{{enduser.Tag}}']} } , 
      defaultAssignee: sdk.userInfo.id 
    },
    validOwners: [sdkNonAdmin.userInfo.id],
  })


  let backgroundTestCounter = 0
  const testBackgroundTicket = async ({
    assignedTo,
    info,
    validOwners,
    enduser,
  } : {
    assignedTo: string[]
    info: Pick<CreateTicketActionInfo, 'assignmentStrategy' | 'defaultAssignee'>,
    validOwners: string[],
    enduser?: Enduser,
  }) => {
    const e = enduser || await sdk.api.endusers.createOne({ assignedTo, fields: { Tag: 'tag3' } })
    await sdk.api.automated_actions.createOne({
      action: { type: 'createTicket', info: { ...info, title: 'background ticket' } },
      automationStepId: PLACEHOLDER_ID,
      enduserId: e.id,
      event: { type: 'afterAction', info: { automationStepId: PLACEHOLDER_ID, delay: 0, delayInMS: 0, unit: 'Days' } },
      journeyId: journey.id,
      status: 'active',
      processAfter: Date.now(),
    })

    await async_test(
      `Background ticket assignment ${++backgroundTestCounter}`, 
      () => pollForResults(() => sdk.api.tickets.getSome({ filter: { enduserId: e.id, title: 'background ticket' } }), t => !!t.length, 500, 20),
      { 
        onResult: ts => (
          ts.length === 1 && (
            (validOwners.length === 0 && ts[0].queueId === queue.id && !ts[0].owner)
          ||(!!ts[0].owner && validOwners.includes(ts[0].owner) )
          )
        )
      }
    ) 

    await sdk.api.endusers.deleteOne(e.id)
  }

  await testBackgroundTicket({ 
    assignedTo: [],  
    info: { 
      assignmentStrategy: { type: 'queue', info: { queueId: queue.id } } , 
      defaultAssignee: sdk.userInfo.id 
    },
    validOwners: [],
  })
  await testBackgroundTicket({ 
    assignedTo: [],  
    info: { 
      assignmentStrategy: { type: 'default', info: {} } , 
      defaultAssignee: sdk.userInfo.id 
    },
    validOwners: [sdk.userInfo.id],
  })
  await testBackgroundTicket({ 
    assignedTo: [],  
    info: { 
      assignmentStrategy: { type: 'default', info: {} } , 
      defaultAssignee: sdkNonAdmin.userInfo.id 
    },
    validOwners: [sdkNonAdmin.userInfo.id],
  })

  // ticket needs existing enduser, previous owner for test to work
  const enduser = await sdk.api.endusers.createOne({ fname: 'previous-owner-test'})  
  await sdk.api.tickets.createOne({ 
    // title should be different than 'background test' so it doesn't create false positive test
    title: 'previous-owner-test', enduserId: enduser.id, journeyId: journey.id, owner: sdkNonAdmin.userInfo.id 
  })
  await testBackgroundTicket({ 
    assignedTo: [],  
    enduser,
    info: { 
      assignmentStrategy: { type: 'previous-owner', info: {} } , 
      defaultAssignee: sdk.userInfo.id 
    },
    validOwners: [sdkNonAdmin.userInfo.id],
  })
  
  await testBackgroundTicket({ 
    assignedTo: [sdkNonAdmin.userInfo.id, sdk.userInfo.id],  
    info: { 
      assignmentStrategy: { type: 'care-team-primary', info: {} } , 
      defaultAssignee: sdk.userInfo.id 
    },
    validOwners: [sdkNonAdmin.userInfo.id],
  })
  await testBackgroundTicket({ 
    assignedTo: [sdkNonAdmin.userInfo.id, sdk.userInfo.id],
    info: { 
      assignmentStrategy: { type: 'care-team-random', info: {} } , 
      defaultAssignee: sdk.userInfo.id 
    },
    validOwners: [sdkNonAdmin.userInfo.id, sdk.userInfo.id],
  })
  await testBackgroundTicket({ 
    assignedTo: [sdkNonAdmin.userInfo.id, sdk.userInfo.id],
    info: { 
      assignmentStrategy: { type: 'by-tags', info: { qualifier: 'One Of', values: ['tag1']} } , 
      defaultAssignee: sdkNonAdmin.userInfo.id, 
    },
    validOwners: [sdk.userInfo.id, sdkNonAdmin.userInfo.id, ],
  })
  await testBackgroundTicket({ 
    assignedTo: [sdkNonAdmin.userInfo.id, sdk.userInfo.id],
    info: { 
      assignmentStrategy: { type: 'by-tags', info: { qualifier: 'One Of', values: ['tag2']} } , 
      defaultAssignee: sdkNonAdmin.userInfo.id 
    },
    validOwners: [sdk.userInfo.id],
  })
  await testBackgroundTicket({ 
    assignedTo: [],
    info: { 
      assignmentStrategy: { type: 'by-tags', info: { qualifier: 'One Of', values: ['{{enduser.Tag}}']} } , 
      defaultAssignee: sdk.userInfo.id 
    },
    validOwners: [sdkNonAdmin.userInfo.id],
  })

  return Promise.all([
    await sdk.api.journeys.deleteOne(journey.id),
    await sdk.api.ticket_queues.deleteOne(queue.id),
  ])
}

const field_equals_trigger_tests = async () => {
  log_header("Field Equals / Trigger Tests")

  const journey = await sdk.api.journeys.createOne({ title: 'test' })
  const step = await sdk.api.automation_steps.createOne({
    journeyId: journey.id,
    events: [{
      type: 'onJourneyStart',
      info: {}
    }],
    action: {
      type: 'addEnduserTags',
      info: { tags: ['Journey Tag']}
    },
  })

  const existsTriggerTags = await sdk.api.automation_triggers.createOne({ 
    event: { type: 'Field Equals', info: { field: 'fname', value: "$exists" } },
    action: { type: 'Add Tags', info: { tags: ["Tag"] } },
    status: "Active",
    title: 'existsTriggerTags',
  })
  const existsTriggerAddToJourney = await sdk.api.automation_triggers.createOne({ 
    event: { type: 'Field Equals', info: { field: 'fname', value: "$exists" } },
    action: { type: 'Add To Journey', info: { journeyId: journey.id } },
    status: "Active",
    title: 'existsTriggerAddToJourney',
  })
  const equalsTriggerTags = await sdk.api.automation_triggers.createOne({ 
    event: { type: 'Field Equals', info: { field: 'lname', value: "Explicit" } },
    action: { type: 'Add Tags', info: { tags: ["Tag"] } },
    status: "Active",
    title: 'equalsTriggerTags',
  })
  const equalsTriggerAddToJourney = await sdk.api.automation_triggers.createOne({ 
    event: { type: 'Field Equals', info: { field: 'lname', value: "Explicit" } },
    action: { type: 'Add To Journey', info: { journeyId: journey.id } },
    enduserCondition: { $and: [ { condition: { lname: 'Explicit' } } ] },
    status: "Active",
    title: 'equalsTriggerAddToJourney',
  })
  const conditionalTriggerTags = await sdk.api.automation_triggers.createOne({ 
    event: { type: 'Field Equals', info: { field: 'mname', value: "$exists" } },
    action: { type: 'Add Tags', info: { tags: ["Tag"] } },
    status: "Active",
    enduserCondition: { $and: [ { condition: { lname: 'Conditional' } } ] },
    title: 'conditionalTriggerTags',
  })
  const conditionalTriggerAddToJourney = await sdk.api.automation_triggers.createOne({ 
    event: { type: 'Field Equals', info: { field: 'mname', value: "$exists" } },
    action: { type: 'Add To Journey', info: { journeyId: journey.id } },
    enduserCondition: { $and: [ { condition: { lname: 'Conditional' } } ] },
    status: "Active",
    title: 'conditionalTriggerAddToJourney',
  })

  // names are capitalized automatically, so make sure that is reflected in conditions
  const endusers = (await sdk.api.endusers.createSome([
    { fname: 'Test' },
    { fname: 'Test' },
    { lname: 'Test' }, // should not be added to any journey
    { lname: 'Explicit' }, 
    { mname: 'Test' }, // should not be added to any journey for failing conditional logic
    { mname: 'Test' }, // should not be added to any journey for failing conditional logic
    { mname: 'Test', lname: 'Nonconditional' }, // should not be added to any journey for failing conditional logic
    { mname: 'Test', lname: 'Conditional' },
  ])).created

  await async_test(
    `Journey and tags set`, 
    () => pollForResults(
      sdk.api.endusers.getSome, 
      es => (
        es.filter(e => e.tags?.includes('Tag') && e.journeys?.[journey.id] !== undefined).length === 4
      ),
      200,
      25,
    ),
    passOnAnyResult,
  ) 
  await async_test(
    `Background action queued for journey`, 
    () => pollForResults(
      sdk.api.automated_actions.getSome, 
      as => (
        as.filter(a => a.automationStepId === step.id && endusers.find(e => e.id === a.enduserId)).length === 4
      ),
      200,
      25,
    ),
    passOnAnyResult,
  )
  await async_test(
    `Endusers have trigger ids`, 
    sdk.api.endusers.getSome,
    { onResult: es => es.filter(e => e.triggerIds?.length === 2).length === 4 },
  )

  await Promise.all([
    sdk.api.journeys.deleteOne(journey.id),
    sdk.api.automation_triggers.deleteOne(existsTriggerTags.id),
    sdk.api.automation_triggers.deleteOne(existsTriggerAddToJourney.id),
    sdk.api.automation_triggers.deleteOne(equalsTriggerAddToJourney.id),
    sdk.api.automation_triggers.deleteOne(equalsTriggerTags.id),
    sdk.api.automation_triggers.deleteOne(conditionalTriggerTags.id),
    sdk.api.automation_triggers.deleteOne(conditionalTriggerAddToJourney.id),
    ...endusers.map(e => sdk.api.endusers.deleteOne(e.id)),
  ])

  const numberField = await sdk.api.automation_triggers.createOne({ 
    event: { type: 'Field Equals', info: { field: 'Number', value: "1" } },
    action: { type: 'Add Tags', info: { tags: ["Number 1"] } },
    status: "Active",
    title: 'numberField',
  })
  const enum1 = await sdk.api.endusers.createOne({ fields: { Number: 1 } })
  const enum1s = await sdk.api.endusers.createOne({ fields: { Number: "1" } })
  const enum2 = await sdk.api.endusers.createOne({ fields: { Number: 2 } })
  const enum2s = await sdk.api.endusers.createOne({ fields: { Number: "2" } })
  const enum3 = await sdk.api.endusers.createOne({ fields: { Number: "3" } })

  await wait(undefined, 250)
  await async_test(
    `Number field triggers on create`, 
    () => sdk.api.endusers.getSome({ ids: [enum1.id, enum1s.id, enum2.id, enum2s.id] }),
    {
      onResult: es => (
        es.filter(e => e.tags?.includes('Number 1')).length === 2 &&
        es.filter(e => e.tags?.includes('Number 2')).length === 0
      ),
    }
  )

  await sdk.api.endusers.updateOne(enum2.id, { fields: { Number: 1 } })
  await sdk.api.endusers.updateOne(enum2s.id, { fields: { Number: "1" } })
  await sdk.api.endusers.updateOne(enum3.id, { fields: { Number: 3 } })
  await wait(undefined, 250)
  await async_test(
    `Number field triggers on update`, 
    () => sdk.api.endusers.getSome({ ids: [enum1.id, enum1s.id, enum2.id, enum2s.id] }),
    {
      onResult: es => (
        es.filter(e => e.tags?.includes('Number 1')).length === 4 &&
        es.filter(e => e.tags?.includes('Number 2')).length === 0
      ),
    }
  )

  await Promise.all([
    sdk.api.automation_triggers.deleteOne(numberField.id),
    sdk.api.endusers.deleteOne(enum1.id),
    sdk.api.endusers.deleteOne(enum1s.id),
    sdk.api.endusers.deleteOne(enum2.id),
    sdk.api.endusers.deleteOne(enum2s.id),
    sdk.api.endusers.deleteOne(enum3.id),
  ])
}

export const no_chained_triggers_tests = async () => {
  log_header("No Chained Triggers Tests")
  const t1 = await sdk.api.automation_triggers.createOne({
    title: 't1', status: 'Active',
    event: {
      type: 'Field Equals',
      info: {
        field: 'fname',
        value: 'Trigger'
      },
    },
    action: {
      type: 'Add Tags',
      info: { tags: ['t1', '{{enduser.fname}}'] }
    }
  })

  const t2 = await sdk.api.automation_triggers.createOne({
    title: 't2', status: 'Active',
    event: {
      type: 'Field Equals',
      info: {
        field: 'fname',
        value: '$exists'
      },
    },
    action: {
      type: 'Add Tags',
      info: { tags: ['t2'] }
    },
    enduserCondition: { $and: [ { condition: { tags: 't1' } } ] },
  })

  // should only trigger t1, t1 would trigger t2 if allowed, but should not
  const enduser = await sdk.api.endusers.createOne({ fname: 'Trigger' })

  await wait(undefined, 250)
  await async_test(
    `Trigger not activated by other trigger update`, 
    () => sdk.api.endusers.getOne(enduser.id),
    { onResult: e => !!(!e.tags?.includes('t2') && e.tags?.includes('t1') && e.tags?.includes('Trigger')) },
  )

  // should cover both triggers now, which results in adding only the second tag
  await sdk.api.endusers.updateOne(enduser.id, { fname: "Updated" })

  await wait(undefined, 250)
  await async_test(
    `Trigger activated directly`, 
    () => sdk.api.endusers.getOne(enduser.id),
    { onResult: e => !!(e.tags?.includes('t1') && e.tags.includes('t2')) },
  )

  await Promise.all([
    sdk.api.automation_triggers.deleteOne(t1.id),
    sdk.api.automation_triggers.deleteOne(t2.id),
    sdk.api.endusers.deleteOne(enduser.id)
  ])
}

export const ticket_queue_tests = async () => {
  log_header("Ticket Queue Tests")

  const queue = await sdk.api.ticket_queues.createOne({ title: 'queue', userIds: [sdkNonAdmin.userInfo.id] })
  const queueUnshared = await sdk.api.ticket_queues.createOne({ title: 'queue unshared', userIds: [] })

  const enduser = await sdk.api.endusers.createOne({ fname: 'ticket' })

  await async_test(
    `Ticket queue empty on general pull`, 
    () => sdk.api.tickets.assign_from_queue({ queueId: queue.id }),
    { shouldError: true, onError: e => e.message === "Queue is empty" },
  )

  const ticket = await sdk.api.tickets.createOne({ title: 'ticket in queue', queueId: queue.id, enduserId: enduser.id })
  const ticketUnshared = await sdk.api.tickets.createOne({ title: 'ticket no access', queueId: queueUnshared.id })

  await async_test(
    `Admin ticket access`, 
    sdk.api.tickets.getSome,
    { onResult: ts => ts.length === 2 },
  )
  await async_test(
    `Admin ticket access (specified queue)`, 
    () => sdk.api.tickets.getSome({ filter: { queueId: queue.id }}),
    { onResult: ts => ts.length === 1 },
  )
  await async_test(
    `Admin ticket access (specified queue, other)`, 
    () => sdk.api.tickets.getSome({ filter: { queueId: queueUnshared.id }}),
    { onResult: ts => ts.length === 1 },
  )
  await async_test(
    `Non-Admin ticket access (unspecified queue)`, 
    sdkNonAdmin.api.tickets.getSome,
    { onResult: ts => ts.length === 0 },
  )
  await async_test(
    `Non-Admin ticket access (specified queue)`, 
    () => sdkNonAdmin.api.tickets.getSome({ filter: { queueId: queue.id }}),
    { onResult: ts => ts.length === 1 },
  )
  await async_test(
    `Non-Admin ticket access (specified queue, no access)`, 
    () => sdkNonAdmin.api.tickets.getSome({ filter: { queueId: queueUnshared.id }}),
    handleAnyError
  )

  await async_test(
    `Queue caches number of tickets on add`, 
    () => sdk.api.ticket_queues.getOne(queue.id),
    { onResult: q => q.count === 1 },
  )
  await async_test(
    `Non-Admin can assign ticket to self`, 
    () => sdkNonAdmin.api.tickets.assign_from_queue({ ticketId: ticket.id }),
    { onResult: ({ ticket }) => ticket.owner === sdkNonAdmin.userInfo.id && !ticket.queueId && !!ticket.dequeuedAt }
  )
  await async_test(
    `Ticket can't be double-assigned ticket to self`, 
    () => sdk.api.tickets.assign_from_queue({ ticketId: ticket.id }),
    handleAnyError
  )
  await async_test(
    `Non-Admin ticket cannot assign ticket to self when can't access queue`, 
    () => sdkNonAdmin.api.tickets.assign_from_queue({ ticketId: ticketUnshared.id }),
    handleAnyError
  )
  await async_test(
    `Non-Admin can access ticket after assignment`, 
    () => sdkNonAdmin.api.tickets.getOne(ticket.id),
    { onResult: ticket => ticket.owner === sdkNonAdmin.userInfo.id && !ticket.queueId && !!ticket }
  )

  await async_test(
    `Queue caches number of tickets on assignment`, 
    () => pollForResults(
      () => sdk.api.ticket_queues.getOne(queue.id),
      q => q.count === 0,
      50,
      10
    ),
    passOnAnyResult
  )
  await async_test(
    `Added to care team after queue pull`, 
    () => sdkNonAdmin.api.endusers.getOne(enduser.id),
    { onResult: e => !!e.assignedTo?.includes(sdkNonAdmin.userInfo.id) }
  )

  const ticketToPull = await sdk.api.tickets.createOne({ title: 'ticket to pull without id', queueId: queue.id })
  await async_test(
    `Ticket queue general pull`, 
    () => sdk.api.tickets.assign_from_queue({ queueId: queue.id }),
    { onResult: r => r.ticket.id === ticketToPull.id },
  )
  await async_test(
    `Ticket queue empty on general pull again`, 
    () => sdk.api.tickets.assign_from_queue({ queueId: queue.id }),
    { shouldError: true, onError: e => e.message === "Queue is empty" },
  )

  const stateTicket = await sdk.api.tickets.createOne({ title: 'ticket in queue', queueId: queue.id, enduserId: enduser.id, restrictByState: 'AK' })
  await sdk.api.users.updateOne(sdk.userInfo.id, { credentialedStates: [] }, { replaceObjectFields: true })
  await async_test(
    `Ticket queue empty for no state match`, 
    () => sdk.api.tickets.assign_from_queue({ queueId: queue.id }),
    { shouldError: true, onError: e => e.message === "Queue is empty" },
  )
  await sdk.api.users.updateOne(sdk.userInfo.id, { credentialedStates: [{ state: 'AK' }] })
  await async_test(
    `Ticket restricted by state`, 
    () => sdk.api.tickets.assign_from_queue({ queueId: queue.id }),
    { onResult: r => r.ticket.id === stateTicket.id },
  )

  const allTagsTicket = await sdk.api.tickets.createOne({ title: 'all tags', queueId: queue.id, enduserId: enduser.id, restrictByTagsQualifier: 'All Of', restrictByTags: ['A', 'B'] })
  await sdk.api.users.updateOne(sdk.userInfo.id, { tags: [] }, { replaceObjectFields: true })
  await async_test(
    `Ticket queue empty for no tags match`, 
    () => sdk.api.tickets.assign_from_queue({ queueId: queue.id }),
    { shouldError: true, onError: e => e.message === "Queue is empty" },
  )
  await sdk.api.users.updateOne(sdk.userInfo.id, { tags: ['A'] }, { replaceObjectFields: true })
  await async_test(
    `Ticket queue empty for partial tags match`, 
    () => sdk.api.tickets.assign_from_queue({ queueId: queue.id }),
    { shouldError: true, onError: e => e.message === "Queue is empty" },
  )
  await sdk.api.users.updateOne(sdk.userInfo.id, { tags: ['A', 'B'] }, { replaceObjectFields: true })
  await async_test(
    `Ticket by all of tags`, 
    () => sdk.api.tickets.assign_from_queue({ queueId: queue.id }),
    { onResult: r => r.ticket.id === allTagsTicket.id },
  )

  const oneTagTicket = await sdk.api.tickets.createOne({ title: 'one tag', queueId: queue.id, enduserId: enduser.id, restrictByTagsQualifier: 'One Of', restrictByTags: ['A', 'B'] })
  await sdk.api.users.updateOne(sdk.userInfo.id, { tags: [] }, { replaceObjectFields: true })
  await async_test(
    `Ticket queue empty for no tags match`, 
    () => sdk.api.tickets.assign_from_queue({ queueId: queue.id }),
    { shouldError: true, onError: e => e.message === "Queue is empty" },
  )
  await sdk.api.users.updateOne(sdk.userInfo.id, { tags: ['C'] }, { replaceObjectFields: true })
  await async_test(
    `Ticket queue empty for no tags match`, 
    () => sdk.api.tickets.assign_from_queue({ queueId: queue.id }),
    { shouldError: true, onError: e => e.message === "Queue is empty" },
  )
  await sdk.api.users.updateOne(sdk.userInfo.id, { tags: ['A'] }, { replaceObjectFields: true })
  await async_test(
    `Ticket by all of tags`, 
    () => sdk.api.tickets.assign_from_queue({ queueId: queue.id }),
    { onResult: r => r.ticket.id === oneTagTicket.id },
  )
 
  await Promise.all([
    sdk.api.ticket_queues.deleteOne(queue.id),
    sdk.api.ticket_queues.deleteOne(queueUnshared.id),
    sdk.api.endusers.deleteOne(enduser.id), // cleans up ticket
    sdk.api.tickets.deleteOne(ticketUnshared.id),
    sdk.api.tickets.deleteOne(ticketToPull.id),
  ])
}

export const alternate_phones_tests = async () => {
  log_header("Alternate Phones Tests")

  const createPhone = "+15555555554"
  const updatePhone = "+15555555555"
  const e = await sdk.api.endusers.createOne({ fname: 'test', fields: { createPhone, notAPhone: 'hi' } })
  await sdk.api.endusers.updateOne(e.id, {fields: { updatePhone, stillNotAPhone: 'hi' } })

  await async_test(
    `alternatePhones automatically populated with custom fields on create and update`, 
    () => pollForResults(
      () => sdk.api.endusers.getOne(e.id),
      e => (
         e.fields?.createPhone === createPhone
      && e.fields?.updatePhone === updatePhone
      && e.alternatePhones?.length === 2
      && e.alternatePhones.includes(createPhone)
      && e.alternatePhones.includes(updatePhone)
      ),
      50,
      20
    ),
    passOnAnyResult
  )

  await sdk.api.endusers.deleteOne(e.id)
}

// test that backend side-effects cause relationships to be set correctly
export const relationships_tests = async () => {
  log_header("Relationships Tests")

  const e1 = await sdk.api.endusers.createOne({ fname: 'To Relate' })
  const e2 = await sdk.api.endusers.createOne({ fname: 'Related', relationships: [{ type: 'Parent', id: e1.id }] })
  const e3 = await sdk.api.endusers.createOne({ fname: 'To Update' })

  await sdk.api.endusers.updateOne(e3.id, { relationships: [{ type: 'Caregiver', id: e1.id }, { type: 'Grandchild', id: e2.id }] })

  // allow side effects to propagate
  await wait(undefined, 250)

  await async_test(
    `Relationships set correctly on create`,
    () => sdk.api.endusers.getOne(e1.id),
    { onResult: e => e.relationships?.length === 2 && e.relationships[0].type === 'Child' && e.relationships[0].id === e2.id }
  )

  await async_test(
    `Relationships set correctly on update`,
    () => sdk.api.endusers.getOne(e1.id),
    { onResult: e => e.relationships?.length === 2 && e.relationships[1].type === 'Care Recipient' && e.relationships[1].id === e3.id }
  )

  await async_test(
    `Relationships set correctly on update (multiple relationships)`,
    () => sdk.api.endusers.getOne(e2.id),
    { onResult: e => e.relationships?.length === 2 && e.relationships[1].type === 'Grandparent' && e.relationships[1].id === e3.id }
  )
  
  await Promise.all([
    sdk.api.endusers.deleteOne(e1.id),
    sdk.api.endusers.deleteOne(e2.id),
    sdk.api.endusers.deleteOne(e3.id),
  ])
}

export const switch_to_related_contacts_tests = async () => {
  log_header("Switch to Related Contacts Tests")

  const parent = await sdk.api.endusers.createOne({ fname: "Parent" })
  const child  = await sdk.api.endusers.createOne({ relationships: [{ type: 'Parent', id: parent.id }] })

  const journey = await sdk.api.journeys.createOne({ title: "Parent Child Switch Test"})

  const step1 = await sdk.api.automation_steps.createOne({
    journeyId: journey.id,
    events: [{ type: 'onJourneyStart', info: {} }],
    action: {
      type: 'switchToRelatedContact',
      info: { type: 'Parent' },
    }
  })
  await sdk.api.automation_steps.createOne({
    journeyId: journey.id,
    events: [{ type: 'afterAction', info: { automationStepId: step1.id, delay: 0, delayInMS: 0, unit: 'Seconds' } }],
    action: {
      type: 'addEnduserTags',
      info: { tags: ['Success'] },
    }
  })

  await sdk.api.endusers.updateOne(child.id, { journeys: { [journey.id]: '' } })

  await async_test(
    `Related contact got tags`, 
    () => pollForResults(
      () => sdk.api.endusers.getOne(parent.id),
      e => !!e.tags?.includes('Success'),
      50,
      100,
    ),
    passOnAnyResult
  )

  return Promise.all([
    sdk.api.endusers.deleteOne(parent.id),
    sdk.api.endusers.deleteOne(child.id),
    sdk.api.journeys.deleteOne(journey.id),
  ])
}

export const formsort_tests = async () => {
  log_header("FormSort Tests")

  const form = await sdk.api.forms.createOne({ title: "FormSort" })

  const postToFormsort = async ({ matchByName=false, createNewEnduser=false, ...o }: { 
    answers: { key: string, value: any }[],
    responder_uuid: string,
    finalized: boolean,
    matchByName?: boolean,
    createNewEnduser?: boolean,
  }) => {
    await axios.post(`${host}/v1/webhooks/formsort/9d4f9dff00f60df2690a16da2cb848f289b447614ad9bef850e54af09a1fbf7a?formId=${form.id}&matchByName=${matchByName}&createNewEnduser=${createNewEnduser}`, o)
  }

  const postToFormsortGeneric = async ({ matchByName=false, createNewEnduser=false, ...o }: { 
    answers: { key: string, value: any }[],
    responder_uuid: string,
    finalized: boolean,
    matchByName?: boolean,
    createNewEnduser?: boolean,
  }) => {
    await axios.post(`${host}/v1/webhooks/form-ingestion/9d4f9dff00f60df2690a16da2cb848f289b447614ad9bef850e54af09a1fbf7a?formId=${form.id}&matchByName=${matchByName}&createNewEnduser=${createNewEnduser}`, o)
  }

  const emailAnswer = { key: 'email', value: 'test@tellescope.com' }
  const nameAnswers = [{ key: 'fname', value: 'First' }, { key: 'lname', value: 'Last' }]

  await postToFormsort({ answers: [{ key: 'test', value: 'test' }], responder_uuid: "1", finalized: false })
  await async_test(`Partial no contact`, sdk.api.form_responses.getSome, { onResult: r => r.length === 0 })
  await async_test(`Partial no contact`, sdk.api.endusers.getSome, { onResult: r => r.length === 0 })

  await postToFormsort({ answers: [{ key: 'test', value: 'test' }, { key: 'termsVersion', value: '1.0' }], responder_uuid: "1", finalized: true })
  await async_test(`Submitted no contact`, sdk.api.form_responses.getSome, { onResult: r => r.length === 1 })
  await async_test(`Submitted no contact`, sdk.api.endusers.getSome, { 
    onResult: r => r.length === 1 && r[0].termsVersion === '1.0' && !!r[0].termsSigned 
  })

  await postToFormsort({ answers: [emailAnswer], responder_uuid: "2", finalized: false })
  await async_test(`Partial email`, sdk.api.form_responses.getSome, { onResult: r => r.length === 2 })
  await async_test(`Partial email`, sdk.api.endusers.getSome, { onResult: r => r.length === 2 })

  await postToFormsort({ answers: [emailAnswer], responder_uuid: "2", finalized: true })
  await async_test(`Submitted email`, sdk.api.form_responses.getSome, { onResult: r => r.length === 2 })
  await async_test(`Submitted email`, sdk.api.endusers.getSome, { onResult: r => r.length === 2 })

  await postToFormsort({ answers: [emailAnswer], responder_uuid: "3", finalized: true })
  await async_test(`Matched email`, sdk.api.form_responses.getSome, { onResult: r => r.length === 3 })
  await async_test(`Matched email`, sdk.api.endusers.getSome, { onResult: r => r.length === 2 })


  await postToFormsort({ answers: [emailAnswer], responder_uuid: "4", finalized: false, matchByName: true })
  await async_test(`Email no name partial`, sdk.api.form_responses.getSome, { onResult: r => r.length === 3 })
  await async_test(`Email no name partial`, sdk.api.endusers.getSome, { onResult: r => r.length === 2 })

  await postToFormsort({ answers: [emailAnswer, ...nameAnswers], responder_uuid: "4", finalized: false, matchByName: true })
  await async_test(`Email with name partial`, sdk.api.form_responses.getSome, { onResult: r => r.length === 4 })
  await async_test(`Email with name partial`, sdk.api.endusers.getSome, { onResult: r => r.length === 3 })

  await postToFormsortGeneric({ answers: [emailAnswer, ...nameAnswers], responder_uuid: "5", finalized: false, matchByName: true })
  await async_test(`Email with name match partial`, sdk.api.form_responses.getSome, { onResult: r => r.length === 5 })
  await async_test(`Email with name match partial`, sdk.api.endusers.getSome, { onResult: r => r.length === 3 })

  await postToFormsort({ answers: [emailAnswer, ...nameAnswers], responder_uuid: "5", finalized: true, matchByName: true })
  await async_test(`Email with name match`, sdk.api.form_responses.getSome, { onResult: r => r.length === 5 })
  await async_test(`Email with name match`, sdk.api.endusers.getSome, { onResult: r => r.length === 3 })

  const answersEmail = "formsortanswers@tellescope.com"
  const address = {
    address_1: 'Address 1',
    address_2: 'Address 2',
    city: 'City',
    state: 'State',
    postal_code: 'ZIP',
  }
  const answers = [
    { key: 'stripeCustomerId', value: 'test-customer-id' },
    { key: 'email', value: answersEmail },
    { key: 'phone', value: "+15555555555" },
    { key: 'fname', value: 'Fname' },
    { key: 'lname', value: 'Lname' },
    { key: 'gender', value: 'Male' },
    { key: 'defaultFromEmail', value: 'from@tellescope.com' },
    { key: 'useDefaultFromEmailInAutomations', value: true },
    { key: 'defaultFromPhone', value: '+15555555555' },
    { key: 'useDefaultFromPhoneInAutomations', value: true },
    { key: 'language', value: 'Spanish' },
    { key: 'timezone', value: 'US/Eastern' },
    { key: 'healthie_dietitian_id', value: 'test_id' },
    { key: 'height', value: 10 },
    { key: 'weight', value: 20 },
    { key: 'address', value: address },
    { key: 'dateOfBirth', value: '2000-12-20' },
    { key: 'insurance.payerId', value: 'insurance 1' },
    { key: 'insuranceSecondary.payerId', value: 'insurance 2' },
    { key: 'ts_enduser_custom', value: 'Custom' },
    { key: 'ts_enduser_custom2', value: 'Custom 2' },
    { key: 'multiple_choice', value: ['multiple choice'] },
  ]
  await sdk.api.endusers.createOne({ email: answersEmail })
  await postToFormsort({ 
    answers, 
    responder_uuid: "6", 
    finalized: false,
    matchByName: false,
  })
  let submissionEnduser = await sdk.api.endusers.getOne({ email: answersEmail })

  const validateResponse = (fr: FormResponse, key: string, value: any): boolean => {
    const answer = fr.responses?.find(r => r.externalId === key)?.answer?.value

    if (typeof value === 'object') {
      return objects_equivalent(answer, value)
    }

    return answer === value
  }
  // EXISTING ENDUSER FIELDS ARE CURRENTLY ONLY UPDATED ON SUBMISSION
  await async_test(
    `Answers and fields (unfinalized)`, 
    () => sdk.api.form_responses.getOne({ externalId: '6' }),
    { 
      onResult: r => {
        if (!r) { return false }
        if (r.submittedAt) { return false }
        if (!r.formsort?.length) { return false }
        if (!r.responses?.length) { return false }
        if (r.responses.length !== answers.length) { return false }

        if (!validateResponse(r, 'address', JSON.stringify(address, null, 2))) { return false }
        if (!validateResponse(r, 'stripeCustomerId', "test-customer-id")) { return false }
        if (!validateResponse(r, 'email', answersEmail)) { return false }
        if (!validateResponse(r, 'phone', "+15555555555")) { return false }
        if (!validateResponse(r, 'fname', "Fname")) { return false }
        if (!validateResponse(r, 'lname', "Lname")) { return false }
        if (!validateResponse(r, 'gender', "Male")) { return false }
        if (!validateResponse(r, 'defaultFromEmail', "from@tellescope.com")) { return false }
        if (!validateResponse(r, 'useDefaultFromEmailInAutomations', "true")) { return false }
        if (!validateResponse(r, 'defaultFromPhone', "+15555555555")) { return false }
        if (!validateResponse(r, 'useDefaultFromPhoneInAutomations', "true")) { return false }
        if (!validateResponse(r, 'language', "Spanish")) { return false }
        if (!validateResponse(r, 'timezone', "US/Eastern")) { return false }
        if (!validateResponse(r, 'healthie_dietitian_id', "test_id")) { return false }
        if (!validateResponse(r, 'height', "10")) { return false }
        if (!validateResponse(r, 'weight', "20")) { return false }
        if (!validateResponse(r, 'dateOfBirth', "2000-12-20")) { return false }
        if (!validateResponse(r, 'insurance.payerId', "insurance 1")) { return false }
        if (!validateResponse(r, 'insuranceSecondary.payerId', "insurance 2")) { return false }
        if (!validateResponse(r, 'ts_enduser_custom', "Custom")) { return false }
        if (!validateResponse(r, 'ts_enduser_custom2', "Custom 2")) { return false }
        if (!validateResponse(r, 'multiple_choice', ['multiple choice'])) { return false }

        return true
      }
    }
  )

  await postToFormsort({ 
    answers,
    responder_uuid: "6", 
    finalized: true,
    matchByName: false,
  })
  submissionEnduser = await sdk.api.endusers.getOne({ email: answersEmail })
  // EXISTING ENDUSER FIELDS ARE CURRENTLY ONLY UPDATED ON SUBMISSION
  await async_test(
    `Answers and fields (finalized)`, 
    () => sdk.api.form_responses.getOne({ externalId: '6' }),
    { 
      onResult: r => {
        if (!r) { return false }
        if (!r.submittedAt) { return false }
        if (!r.formsort?.length) { return false }
        if (!r.responses?.length) { return false }
        if (r.responses.length !== answers.length) { return false }

        if (!validateResponse(r, 'address', JSON.stringify(address, null, 2))) { return false }
        if (!validateResponse(r, 'email', answersEmail)) { return false }
        if (!validateResponse(r, 'phone', "+15555555555")) { return false }
        if (!validateResponse(r, 'fname', "Fname")) { return false }
        if (!validateResponse(r, 'lname', "Lname")) { return false }
        if (!validateResponse(r, 'gender', "Male")) { return false }
        if (!validateResponse(r, 'defaultFromEmail', "from@tellescope.com")) { return false }
        if (!validateResponse(r, 'useDefaultFromEmailInAutomations', "true")) { return false }
        if (!validateResponse(r, 'defaultFromPhone', "+15555555555")) { return false }
        if (!validateResponse(r, 'useDefaultFromPhoneInAutomations', "true")) { return false }
        if (!validateResponse(r, 'language', "Spanish")) { return false }
        if (!validateResponse(r, 'timezone', "US/Eastern")) { return false }
        if (!validateResponse(r, 'healthie_dietitian_id', "test_id")) { return false }
        if (!validateResponse(r, 'height', "10")) { return false }
        if (!validateResponse(r, 'weight', "20")) { return false }
        if (!validateResponse(r, 'dateOfBirth', "2000-12-20")) { return false }
        if (!validateResponse(r, 'insurance.payerId', "insurance 1")) { return false }
        if (!validateResponse(r, 'insuranceSecondary.payerId', "insurance 2")) { return false }
        if (!validateResponse(r, 'ts_enduser_custom', "Custom")) { return false }
        if (!validateResponse(r, 'ts_enduser_custom2', "Custom 2")) { return false }
        if (!validateResponse(r, 'multiple_choice', ['multiple choice'])) { return false }

        if (submissionEnduser.stripeCustomerId !== 'test-customer-id') { return false }
        if (submissionEnduser.email !== answersEmail) { return false }
        if (submissionEnduser.fname !== 'Fname') { return false }
        if (submissionEnduser.lname !== 'Lname') { return false }
        if (submissionEnduser.gender !== 'Male') { return false }
        if (submissionEnduser.phone !== '+15555555555') { return false }
        if (submissionEnduser.defaultFromEmail !== 'from@tellescope.com') { return false }
        if (submissionEnduser.useDefaultFromEmailInAutomations !== true) { return false }
        if (submissionEnduser.defaultFromPhone !== '+15555555555') { return false }
        if (submissionEnduser.useDefaultFromPhoneInAutomations !== true) { return false }
        if (submissionEnduser.language?.displayName !== "Spanish") { return false }
        if (submissionEnduser.timezone !== "US/Eastern") { return false }
        if (submissionEnduser.healthie_dietitian_id !== "test_id") { return false }
        if (submissionEnduser.height?.value !== 10) { return false }
        if (submissionEnduser.weight?.value !== 20) { return false }
        if (submissionEnduser.addressLineOne !== 'Address 1') { return false }
        if (submissionEnduser.addressLineTwo !== 'Address 2') { return false }
        if (submissionEnduser.city !== 'City') { return false }
        if (submissionEnduser.state !== 'State') { return false }
        if (submissionEnduser.zipCode !== 'ZIP') { return false }
        if (submissionEnduser.dateOfBirth !== '12-20-2000') { return false }
        if (submissionEnduser.insurance?.payerId !== 'insurance 1') { return false }
        if (submissionEnduser.insuranceSecondary?.payerId !== 'insurance 2') { return false }
        if (submissionEnduser.fields?.custom !== 'Custom') { return false }
        if (submissionEnduser.fields?.custom2 !== 'Custom 2') { return false }

        return true
      }
    }
  )

  await postToFormsort({ answers: [emailAnswer], responder_uuid: "createNewEnduser", finalized: false, createNewEnduser: true })
  await async_test(`new enduser and form response created (1)`, sdk.api.form_responses.getSome, { onResult: r => r.length === 7 })
  await async_test(`new enduser and form response created (1)`, sdk.api.endusers.getSome, { onResult: r => r.length === 5 })

  await postToFormsort({ answers: [emailAnswer], responder_uuid: "createNewEnduser", finalized: false, createNewEnduser: true })
  await async_test(`new enduser and form response created (2)`, sdk.api.form_responses.getSome, { 
    onResult: r => r.length === 8 && r.filter(e => e.externalId === 'createNewEnduser').length === 2
  })
  await async_test(`new enduser and form response created (2)`, sdk.api.endusers.getSome, { 
    onResult: r => r.length === 6 && r.filter(e => e.externalId === 'createNewEnduser').length === 2
  })

  await postToFormsort({ answers: [emailAnswer], responder_uuid: "createNewEnduser", finalized: true, createNewEnduser: true })
  await async_test(`new enduser and form response created (3, finalized)`, sdk.api.form_responses.getSome, { 
    onResult: r => r.length === 9 && r.filter(e => e.externalId === 'createNewEnduser').length === 3
  })
  await async_test(`new enduser and form response created (3, finalized)`, sdk.api.endusers.getSome, { 
    onResult: r => r.length === 7 
    && r.filter(e => e.externalId === 'createNewEnduser').length === 3
    && r.filter(e => e.externalId === 'createNewEnduser' && e.email === emailAnswer.value).length === 1 // email set on finalized
  })

  // cleanup
  const endusers = await sdk.api.endusers.getSome()
  await Promise.all([
    sdk.api.forms.deleteOne(form.id),
    ...endusers.map(e => sdk.api.endusers.deleteOne(e.id)),
  ])
}

// initially added to validate items can be added via API
export const enduser_orders_tests = async () => {
  log_header("EnduserOrders Tests")

  await async_test(
    `Items are optional`, 
    () => sdk.api.enduser_orders.createOne({ title: 'test', status: 'test' , externalId: '1', source: 'test', enduserId: PLACEHOLDER_ID }),
    { onResult: r => !!r.enduserId }
  )

  await async_test(
    `Items are allowed (singleton)`, 
    () => sdk.api.enduser_orders.createOne({ title: 'test', status: 'test', externalId: '2', source: 'test', enduserId: PLACEHOLDER_ID, items: [{ title: 'item 1'}] }),
    { onResult: r => r.items?.length === 1 }
  )

  await async_test(
    `Items are allowed (multiple)`, 
    () => sdk.api.enduser_orders.createOne({ title: 'test', status: 'test', externalId: '3', source: 'test', enduserId: PLACEHOLDER_ID, items: [{ title: 'item 1'}, { title: 'item 2', tracking: 'tracking' }] }),
    { onResult: r => r.items?.length === 2 && r.items[0].title === 'item 1' && !r.items[0].tracking && r.items[1].title === 'item 2' && r.items[1].tracking === 'tracking' }
  )
   
  const orders = await sdk.api.enduser_orders.getSome()
  return Promise.all(orders.map(o => sdk.api.enduser_orders.deleteOne(o.id)))
}

const agent_record_tests = async () => {
  log_header("AgentRecord Tests")

  const r1 = await sdk.api.agent_records.createOne({ title: 'test', description: '', type: 'Article' })
  await sdk.api.agent_records.updateOne(r1.id, { title: 'updated' })  
  const [r2, r3] = (await sdk.api.agent_records.createSome([{ title: 'test 2', description: '', type: 'Article' }, { title: 'test 3', description: '', type: 'Article' }])).created

  const sdkOther = new Session({ host })
  await sdkOther.authenticate(email2, password2)

  await async_test(
    `AgentRecord create blocked`,
    () => sdkOther.api.agent_records.createOne({ title: 'test', description: '', type: 'Article' }),
    { shouldError: true, onError: e => true },
  )
  await async_test(
    `AgentRecord create many blocked`,
    () => sdkOther.api.agent_records.createSome([{ title: 'test', description: '', type: 'Article' }, { title: 'test', description: '', type: 'Article' }]),
    { shouldError: true, onError: e => true },
  )
  await async_test(
    `AgentRecord update blocked`,
    () => sdkOther.api.agent_records.updateOne(r1.id, { title: 'updated' }),
    { shouldError: true, onError: e => true },
  )
  await async_test(
    `AgentRecord delete blocked`,
    () => sdkOther.api.agent_records.deleteOne(r1.id),
    { shouldError: true, onError: e => true },
  )

  await async_test(
    `AgentRecord read access allowed in a different organizatino`,
    () => sdkSub.api.agent_records.getSome(),
    { onResult: r => !!r.find(r => r.businessId !== sdkSub.userInfo.businessId) },
  )

  await Promise.all([
    sdk.api.agent_records.deleteOne(r1.id),
    sdk.api.agent_records.deleteOne(r2.id),
    sdk.api.agent_records.deleteOne(r3.id),
  ])
}

const waitlist_tests = async () => {
  log_header("Waitlist Tests")

  const e1 = await sdk.api.endusers.createOne({ fname: 'test1' })
  const e2 = await sdk.api.endusers.createOne({ fname: 'test2' })
  const e3 = await sdk.api.endusers.createOne({ fname: 'test3' })
  const e4 = await sdk.api.endusers.createOne({ fname: 'test4' })
  const e5 = await sdk.api.endusers.createOne({ fname: 'test5' })
  const j = await sdk.api.journeys.createOne({ title: 'test' })
  const list = await sdk.api.waitlists.createOne({ title: 'test', journeyId: j.id, enduserIds: [e1.id, e2.id, e3.id, e4.id, e5.id] })

  await sdk.api.waitlists.grant_access_from_waitlist({ id: list.id, count: 2 })
  await async_test(
    `Waitlist remove updates enduserids`,
    () => sdk.api.waitlists.getOne(list.id),
    { onResult: l => l.enduserIds.length === 3 && l.enduserIds[0] === e3.id }
  )

  await async_test(
    `Waitlist adds to Journey`,
    () => pollForResults(
      () => sdk.api.endusers.getSome(),
      es => (
           es.find(e => e.id === e1.id)?.journeys?.[j.id] !== undefined
        && es.find(e => e.id === e2.id)?.journeys?.[j.id] !== undefined
        && es.find(e => e.id === e3.id)?.journeys?.[j.id] === undefined
        && es.find(e => e.id === e4.id)?.journeys?.[j.id] === undefined
        && es.find(e => e.id === e5.id)?.journeys?.[j.id] === undefined
      ),
      25,
      10,
    ),
    passOnAnyResult
  )  
  
  await sdk.api.endusers.deleteOne(e3.id)
  await async_test(
    `Deleting enduser removes from Waitlist`,
    () => pollForResults(
      () => sdk.api.waitlists.getOne(list.id),
      w => w.enduserIds.length === 2,
      25,
      10,
    ),
    passOnAnyResult
  )  

  await sdk.api.endusers.merge({ sourceEnduserId: e4.id, destinationEnduserId: e5.id })
  await async_test(
    `Deleting enduser via merge removes from Waitlist`,
    () => pollForResults(
      () => sdk.api.waitlists.getOne(list.id),
      w => w.enduserIds.length === 1,
      25,
      10,
    ),
    passOnAnyResult
  )

  return (
    Promise.all([
      sdk.api.waitlists.deleteOne(list.id),
      sdk.api.endusers.deleteOne(e1.id),
      sdk.api.endusers.deleteOne(e2.id),
      sdk.api.endusers.deleteOne(e5.id),
      sdk.api.journeys.deleteOne(j.id),
    ])
  )
}

const configurations_tests = async () => {
  log_header("Configurations Tests")

  const c = await sdk.api.configurations.createOne({ type: 'testing', value: '<script>hello</script>!!!' })

  await async_test(
    `Configurations strips html tags`,
    () => sdk.api.configurations.getOne(c.id),
    { onResult: r => r.value === '!!!' }
  )

  await sdk.api.configurations.deleteOne(c.id)
}

const NO_TEST = () => {}
const tests: { [K in keyof ClientModelForName]: () => void } = {
  agent_records: agent_record_tests,
  enduser_eligibility_results: NO_TEST,
  diagnosis_codes: NO_TEST,
  allergy_codes: NO_TEST,
  suggested_contacts: NO_TEST,
  call_hold_queues: NO_TEST,
  fax_logs: NO_TEST,
  form_groups: NO_TEST,
  webhook_logs: NO_TEST,
  flowchart_notes: NO_TEST,
  enduser_problems: NO_TEST,
  vital_configurations: NO_TEST,
  enduser_encounters: NO_TEST,
  enduser_orders: enduser_orders_tests,
  ticket_queues: NO_TEST,
  phone_trees: NO_TEST,
  enduser_medications: NO_TEST,
  automation_triggers: NO_TEST,
  automation_steps: automation_events_tests,
  background_errors: NO_TEST,
  enduser_views: NO_TEST,
  availability_blocks: NO_TEST,
  analytics_frames: NO_TEST,
  products: NO_TEST,
  purchase_credits: NO_TEST,
  purchases: NO_TEST,
  appointment_locations: NO_TEST,
  appointment_booking_pages: NO_TEST,
  role_based_access_permissions: role_based_access_permissions_tests,
  chat_rooms: chat_room_tests,
  files: files_tests,
  enduser_tasks: NO_TEST,
  care_plans: NO_TEST,
  portal_customizations: NO_TEST,
  calendar_event_templates: NO_TEST,
  databases: databases_tests,
  database_records: NO_TEST,
  post_comments: NO_TEST,// post_comments_tests,
  journeys: journey_tests,
  calendar_event_RSVPs: calendar_event_RSVPs_tests,
  chats: chat_tests,
  endusers: enduser_tests,
  api_keys: api_key_tests,
  engagement_events: engagement_tests,
  emails: email_tests,
  sms_messages: sms_tests,
  users: users_tests,
  templates: NO_TEST,
  tickets: NO_TEST,
  meetings: meetings_tests,
  notes: NO_TEST,
  forms: NO_TEST,
  form_fields: NO_TEST,
  form_responses: form_response_tests,
  calendar_events: calendar_events_tests,
  webhooks: NO_TEST, // tested separately,
  automated_actions: NO_TEST,
  enduser_status_updates: status_update_tests,
  user_logs: NO_TEST,
  user_notifications: notifications_tests,
  enduser_observations: NO_TEST,
  forum_posts: NO_TEST,
  forums: community_tests,
  managed_content_records: managed_content_records_tests,
  managed_content_record_assignments: NO_TEST,
  post_likes: NO_TEST,
  comment_likes: NO_TEST,
  organizations: NO_TEST,
  integrations: NO_TEST,
  phone_calls: NO_TEST,
  superbill_providers: NO_TEST,
  superbills: NO_TEST,
  enduser_profile_views: NO_TEST,
  enduser_custom_types: NO_TEST,
  table_views: NO_TEST,
  email_sync_denials: NO_TEST,
  ticket_threads: NO_TEST,
  ticket_thread_comments: NO_TEST,
  configurations: configurations_tests,
  group_mms_conversations: NO_TEST,
  blocked_phones: NO_TEST,
  prescription_routes: NO_TEST,
  portal_brandings: NO_TEST,
  message_template_snippets: NO_TEST,
  integration_logs: NO_TEST,
  ai_conversations: NO_TEST,
  waitlists: waitlist_tests,
};

const TRACK_OPEN_IMAGE = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  'base64'
);

const validate_schema = () => {
  log_header("Validate Schema")

  const endpoints = new Set<string>([])

  let modelName = undefined! as ModelName
  for (modelName in schema) {
    for (const endpointName in schema[modelName].customActions) {
      const path = schema[modelName].customActions[endpointName].path || ''
      if (path === '' && endpointName === 'create') continue // uses default

      if (endpoints.has(path)) {
        throw new Error(`Duplicate path: ${path}, ${endpointName}`)
      }

      endpoints.add(path)
    }

    for (const endpointName in (schema[modelName] as any).publicActions ?? {}) {
      const path = (schema[modelName] as any).publicActions[endpointName].path || ''

      if (endpoints.has(path)) {
        throw new Error(`Duplicate path: ${path}, ${endpointName}`)
      }

      endpoints.add(path)
    }
  }

  console.log("Schema validated")
}

const test_weighted_round_robin = async () => {
  log_header("Test validate_weighted_round_robin")

  const testUsers: Pick<User, 'id' | 'ticketAssignmentPriority'>[] = [
    { id: '0', ticketAssignmentPriority: undefined }, // will default to 5
    { id: '1', ticketAssignmentPriority: 1 },
    { id: '2', ticketAssignmentPriority: 2 },
    { id: '3', ticketAssignmentPriority: 3 },
  ]
  const userIds = testUsers.map(u => u.id)
  const testAssignments: RoundRobinAssignmentInfo[] = testUsers.map((u, i) => ({ 
    id: i.toString(),
    key: 'test',
    timestamp: Date.now() - 1000,
    userId: u.id,
  }))

  await async_test(
    `Both empty`, 
    async () => weighted_round_robin({ assignments: [], users: [] }),
    { onResult: r => r.selected === undefined }
  )
  await async_test(
    `Single user, empty assignment`, 
    async () => weighted_round_robin({ assignments: [], users: [testUsers[0]] }),
    { onResult: r => r.selected === testUsers[0].id }
  )
  await async_test(
    `Both singletons`, 
    async () => weighted_round_robin({ assignments: [testAssignments[0]], users: [testUsers[0]] }),
    { onResult: r => r.selected === testUsers[0].id }
  )

  const run_assignment_simulation = ({
    iterations,
    expectedSelections,
    users=testUsers,
    title=`Simulation ${iterations}`,
  } : {
    expectedSelections: string[],
    iterations: number,
    users?: typeof testUsers,
    title?: string,
  }) => {
    const assignments: RoundRobinAssignmentInfo[] = []
    const selections: (string | undefined)[] = []

    for (let i = 0; i < iterations; i++) {
      if (assignments.length !== i) {
        throw new Error("Invariant Violation: assignment not saved in history")
      }

      const { selected } = weighted_round_robin({ assignments, users })
      selections.push(selected)

      const assignment: RoundRobinAssignmentInfo = { 
        id: i.toString(),
        userId: selected || '',
        key: 'test',
        timestamp: i, // simply ensures increasing timestamps per assignment
      }

      // ensure that assignment order doesn't matter (e.g. weighted_round_robin sorts internally)
      if (i % 2 === 0) {
        assignments.push(assignment) // add to back
      } else {
        assignments.unshift(assignment) // add to front
      }
    }

    assert(objects_equivalent(selections, expectedSelections), title + '\n' + JSON.stringify({ expected: expectedSelections, got: selections }, null, 2), title)
  }

  run_assignment_simulation({ expectedSelections: [], iterations: 0 })
  run_assignment_simulation({ expectedSelections: [userIds[0]], iterations: 1 })
  run_assignment_simulation({ expectedSelections: [userIds[0], userIds[1]], iterations: 2 })
  run_assignment_simulation({ expectedSelections: [userIds[0], userIds[1], userIds[2]], iterations: 3 })
  run_assignment_simulation({ expectedSelections: [userIds[0], userIds[1], userIds[2], userIds[3]], iterations: 4 })
  run_assignment_simulation({ iterations: 5,
    expectedSelections: [
      userIds[0], userIds[1], userIds[2], userIds[3],
      userIds[0],
    ], 
  })
  run_assignment_simulation({ iterations: 6, expectedSelections: [
    userIds[0], userIds[1], userIds[2], userIds[3],
    userIds[0], userIds[2],
  ]})
  run_assignment_simulation({ iterations: 7, expectedSelections: [
      userIds[0], userIds[1], userIds[2], userIds[3],
      userIds[0], userIds[2], userIds[3],
  ]})
  run_assignment_simulation({ iterations: 8, expectedSelections: [
      userIds[0], userIds[1], userIds[2], userIds[3],
      userIds[0], userIds[2], userIds[3],
      userIds[0], 
  ]})
  run_assignment_simulation({ iterations: 9,
    expectedSelections: [
      userIds[0], userIds[1], userIds[2], userIds[3],
      userIds[0], userIds[2], userIds[3],
      userIds[0], userIds[3],
    ], 
  })
  run_assignment_simulation({ iterations: 10,
    expectedSelections: [
      userIds[0], userIds[1], userIds[2], userIds[3],
      userIds[0], userIds[2], userIds[3],
      userIds[0], userIds[3],
      userIds[0], 
    ], 
  })
  run_assignment_simulation({ iterations: 11,
    expectedSelections: [
      userIds[0], userIds[1], userIds[2], userIds[3],
      userIds[0], userIds[2], userIds[3],
      userIds[0], userIds[3],
      userIds[0], 
      userIds[0], 
    ], 
  })
  run_assignment_simulation({ iterations: 12,
    expectedSelections: [
      userIds[0], userIds[1], userIds[2], userIds[3],
      userIds[0], userIds[2], userIds[3],
      userIds[0], userIds[3],
      userIds[0], 
      userIds[0], 
      userIds[0], 
    ], 
  })
  run_assignment_simulation({ iterations: 13,
    expectedSelections: [
      userIds[0], userIds[1], userIds[2], userIds[3],
      userIds[0], userIds[2], userIds[3],
      userIds[0], userIds[3],
      userIds[0], 
      userIds[0], 
      userIds[0], userIds[1],
    ], 
  })
  run_assignment_simulation({ iterations: 14,
    expectedSelections: [
      userIds[0], userIds[1], userIds[2], userIds[3],
      userIds[0], userIds[2], userIds[3],
      userIds[0], userIds[3],
      userIds[0], 
      userIds[0], 
      userIds[0], userIds[1], userIds[2],
    ], 
  })
  run_assignment_simulation({ iterations: 15,
    expectedSelections: [
      userIds[0], userIds[1], userIds[2], userIds[3],
      userIds[0], userIds[2], userIds[3],
      userIds[0], userIds[3],
      userIds[0], 
      userIds[0], 
      userIds[0], userIds[1], userIds[2], userIds[3],
    ], 
  })
}

const enduser_access_tags_tests = async () => {
  log_header("enduser_access_tags_tests")

  const matchTag = 'Access'
  const dontMatchTag = 'No Access'
  const ticketTitle = 'ticket'

  const matchEnduser = await sdk.api.endusers.createOne({ accessTags: [matchTag]})
  const matchMultiTagEnduser = await sdk.api.endusers.createOne({ accessTags: [matchTag, dontMatchTag]})
  const dontMatchEnduser = await sdk.api.endusers.createOne({ accessTags: [dontMatchTag]})
  const matchTicket = await sdk.api.tickets.createOne({ enduserId: matchEnduser.id, title: ticketTitle })
  const dontMatchTicket = await sdk.api.tickets.createOne({ enduserId: dontMatchEnduser.id, title: ticketTitle })

  // start with disabled setting an no tags on non-admin
  await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { tags: [] }, { replaceObjectFields: true })
  await sdk.api.organizations.updateOne(sdkNonAdmin.userInfo.businessId, { 
    settings: { endusers: { enableAccessTags: false } }
  })
  await sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword) // ensure enableAccessTags setting stored correctly on jwt
  await async_test(`Setting disabled, no tags, list`, sdkNonAdmin.api.endusers.getSome, { onResult: r => r.length === 0 })
  await async_test(`Setting disabled, matchEnduser`, () => sdkNonAdmin.api.endusers.getOne(matchEnduser.id), handleAnyError)
  await async_test(`Setting disabled, dontMatchEnduser`, () => sdkNonAdmin.api.endusers.getOne(dontMatchEnduser.id), handleAnyError)
  await async_test(`Setting disabled, no tags, tickets`, sdkNonAdmin.api.tickets.getSome, { onResult: r => r.length === 0 })
  await async_test(`Setting disabled, no tags, tickets search`, 
    () => sdkNonAdmin.api.tickets.getSome({ search: { query: ticketTitle }}), 
    { onResult: r => r.length === 0 }
  )
  await async_test(`Setting disabled, matchEnduser ticket`, () => sdkNonAdmin.api.tickets.getOne(matchTicket.id), handleAnyError)
  await async_test(`Setting disabled, dontMatchEnduser ticket`, () => sdkNonAdmin.api.tickets.getOne(dontMatchTicket.id), handleAnyError)
  await async_test(
    `tickets filter enduser valid`, 
    () => sdkNonAdmin.api.tickets.getSome({ filter: { enduserId: matchEnduser.id }}), { 
    onResult: r => r.length === 0
  })
  await async_test(
    `tickets filter enduser invalid`, 
    () => sdkNonAdmin.api.tickets.getSome({ filter: { enduserId: dontMatchEnduser.id }}), { 
    onResult: r => r.length === 0
  })


  // enable setting, disable tags
  await sdk.api.organizations.updateOne(sdkNonAdmin.userInfo.businessId, { 
    settings: { endusers: { enableAccessTags: true } }
  })
  await sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword) // ensure enableAccessTags setting stored correctly on jwt
  await async_test(`enable setting, disable tags`, sdkNonAdmin.api.endusers.getSome, { onResult: r => r.length === 0 })
  await async_test(`enable setting, matchEnduser`, () => sdkNonAdmin.api.endusers.getOne(matchEnduser.id), handleAnyError)
  await async_test(`enable setting, dontMatchEnduser`, () => sdkNonAdmin.api.endusers.getOne(dontMatchEnduser.id), handleAnyError)
  await async_test(`enable setting, no tags, tickets`, sdkNonAdmin.api.tickets.getSome, { onResult: r => r.length === 0 })
  await async_test(`enable setting, no tags, tickets search`, 
    () => sdkNonAdmin.api.tickets.getSome({ search: { query: ticketTitle }}), 
    { onResult: r => r.length === 0 }
  )
  await async_test(`enable setting, matchEnduser ticket`, () => sdkNonAdmin.api.tickets.getOne(matchTicket.id), handleAnyError)
  await async_test(`enable setting, dontMatchEnduser ticket`, () => sdkNonAdmin.api.tickets.getOne(dontMatchTicket.id), handleAnyError)
  await async_test(
    `tickets filter enduser valid`, 
    () => sdkNonAdmin.api.tickets.getSome({ filter: { enduserId: matchEnduser.id }}), { 
    onResult: r => r.length === 0
  })
  await async_test(
    `tickets filter enduser invalid`, 
    () => sdkNonAdmin.api.tickets.getSome({ filter: { enduserId: dontMatchEnduser.id }}), { 
    onResult: r => r.length === 0
  })


  // disable setting, enable tags
  await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { tags: [matchTag] }, { replaceObjectFields: true })
  await sdk.api.organizations.updateOne(sdkNonAdmin.userInfo.businessId, { 
    settings: { endusers: { enableAccessTags: false } }
  })
  await sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword) // ensure enableAccessTags setting stored correctly on jwt
  await async_test(`disable setting, enable tags`, sdkNonAdmin.api.endusers.getSome, { onResult: r => r.length === 0 })
  await async_test(`disable setting, matchEnduser`, () => sdkNonAdmin.api.endusers.getOne(matchEnduser.id), handleAnyError)
  await async_test(`disable setting, dontMatchEnduser`, () => sdkNonAdmin.api.endusers.getOne(dontMatchEnduser.id), handleAnyError)
  await async_test(`disable setting, enable tags, tickets`, sdkNonAdmin.api.tickets.getSome, { onResult: r => r.length === 0 })
  await async_test(`disable setting, no tags, tickets search`, 
    () => sdkNonAdmin.api.tickets.getSome({ search: { query: ticketTitle }}), 
    { onResult: r => r.length === 0 }
  )
  await async_test(`disable setting, matchEnduser ticket`, () => sdkNonAdmin.api.tickets.getOne(matchTicket.id), handleAnyError)
  await async_test(`disable setting, dontMatchEnduser ticket`, () => sdkNonAdmin.api.tickets.getOne(dontMatchTicket.id), handleAnyError)
  await async_test(
    `tickets filter enduser valid`, 
    () => sdkNonAdmin.api.tickets.getSome({ filter: { enduserId: matchEnduser.id }}), { 
    onResult: r => r.length === 0
  })
  await async_test(
    `tickets filter enduser invalid`, 
    () => sdkNonAdmin.api.tickets.getSome({ filter: { enduserId: dontMatchEnduser.id }}), { 
    onResult: r => r.length === 0
  })


  // enabled setting AND tags (keeps tags enabled)
  await sdk.api.organizations.updateOne(sdkNonAdmin.userInfo.businessId, { 
    settings: { endusers: { enableAccessTags: true } }
  })
  await sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword) // ensure enableAccessTags setting stored correctly on jwt
  await async_test(`Access by tag with setting works`, sdkNonAdmin.api.endusers.getSome, {
    onResult: r => r.length === 2 && !r.find(e => e.id === dontMatchEnduser.id) 
  })
  await async_test(`access matchEnduser`, () => sdkNonAdmin.api.endusers.getOne(matchEnduser.id), passOnAnyResult)
  await async_test(`access dontMatchEnduser bad`, () => sdkNonAdmin.api.endusers.getOne(dontMatchEnduser.id), handleAnyError)
  await async_test(`access setting, tickets`, sdkNonAdmin.api.tickets.getSome, { 
    onResult: r => r.length === 1 && !r.find(t => t.id === dontMatchTicket.id) 
  })
  await async_test(`access setting tickets search`, 
    () => sdkNonAdmin.api.tickets.getSome({ search: { query: ticketTitle }}), 
    { onResult: r => r.length === 1 }
  )
  await async_test(`access, matchEnduser ticket`, () => sdkNonAdmin.api.tickets.getOne(matchTicket.id), passOnAnyResult)
  await async_test(`access, dontMatchEnduser ticket`, () => sdkNonAdmin.api.tickets.getOne(dontMatchTicket.id), handleAnyError)
  await async_test(
    `tickets filter enduser valid`, 
    () => sdkNonAdmin.api.tickets.getSome({ filter: { enduserId: matchEnduser.id }}), { 
    onResult: r => r.length === 1
  })
  await async_test(
    `tickets filter enduser invalid`, 
    () => sdkNonAdmin.api.tickets.getSome({ filter: { enduserId: dontMatchEnduser.id }}), { 
    onResult: r => r.length === 0
  })

  await async_test(`Non-admin can't update tags`, 
    () => sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, { tags: ['new tag'] }), 
    handleAnyError
  )
  await async_test(`Non-admin can't update tags (with other updates)`, 
    () => sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, { tags: ['new tag'], bio: '' }), 
    handleAnyError
  )
  await async_test(`Non-admin can update other fields`, 
    () => sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, { bio: '' }), 
    passOnAnyResult
  )

  // cleanup
  await sdk.api.organizations.updateOne(sdkNonAdmin.userInfo.businessId, { 
    settings: { endusers: { enableAccessTags: false } }
  })
  await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { tags: [] }, { replaceObjectFields: true })
  await sdkNonAdmin.refresh_session()
  await Promise.all([
    sdk.api.endusers.deleteOne(matchEnduser.id),
    sdk.api.endusers.deleteOne(matchMultiTagEnduser.id),
    sdk.api.endusers.deleteOne(dontMatchEnduser.id),
  ])
}

const unique_strings_tests = async () => {
  log_header("unique_strings test")

  const e = await sdk.api.endusers.createOne({ assignedTo: ['1', '2', '2', '1', '3'], tags: ['1', '2', '2', '1', '3'] })
  await async_test(`Duplicate care team assignments are prevented`, 
    () => sdk.api.endusers.getOne(e.id), 
    { onResult: e => 
      e.assignedTo?.length === 3 && e.assignedTo.includes('1') && e.assignedTo.includes('2') && e.assignedTo.includes('3' )
      && e.tags?.length === 3 && e.tags.includes('1') && e.tags.includes('2') && e.tags.includes('3' )
    }
  )

  // attempt to push duplicates of each
  await sdk.api.endusers.updateOne(e.id, { assignedTo: ['1', '2', '3'], tags: ['1', '2', '3'] }, { replaceObjectFields: false })
  await async_test(`Duplicate care team assignments are prevented (update)`, 
    () => sdk.api.endusers.getOne(e.id), 
    { onResult: e => 
      e.assignedTo?.length === 3 && e.assignedTo.includes('1') && e.assignedTo.includes('2') && e.assignedTo.includes('3' )
      && e.tags?.length === 3 && e.tags.includes('1') && e.tags.includes('2') && e.tags.includes('3' )
    }
  )

  // validate setting empty is allowed
  await async_test(`Setting empty is still allowed`, 
    () =>  sdk.api.endusers.updateOne(e.id, { assignedTo: [] }, { replaceObjectFields: true }),
    passOnAnyResult
  )

  return await Promise.all([
    sdk.api.endusers.deleteOne(e.id),
  ])
}

const marketing_email_unsubscribe_tests = async () => {
  log_header("marketing_email_unsubscribe_tests")

  const e = await sdk.api.endusers.createOne({ email: 'test@tellescope.com' })
  await async_test(
    `Non-marketing email good`,
    () => sdk.api.emails.createOne({ logOnly: true, subject: '', enduserId: e.id, textContent: '', HTMLContent: '' }), 
    passOnAnyResult
  )
  await async_test(
    `Marketing email good when subscribed`,
    () => sdk.api.emails.createOne({ logOnly: true, isMarketing: true, subject: '', enduserId: e.id, textContent: '', HTMLContent: '' }), 
    passOnAnyResult
  )

  // attempt to push duplicates of each
  await sdk.GET('/v1/unsubscribe', { enduserId: e.id })
  await async_test(
    `GET /v1/unsubscribe works`,
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => e.unsubscribedFromMarketing === true }
  )

  await async_test(
    `Non-marketing email good`,
    () => sdk.api.emails.createOne({ logOnly: true, subject: '', enduserId: e.id, textContent: '', HTMLContent: '' }), 
    passOnAnyResult
  )
  await async_test(
    `Marketing email bad when unsubscribed`,
    () => sdk.api.emails.createOne({ logOnly: true, isMarketing: true, subject: '', enduserId: e.id, textContent: '', HTMLContent: '' }), 
    handleAnyError
  )
  await async_test(
    `Marketing email bad when unsubscribed (bulk)`,
    () => sdk.api.emails.createSome([{ logOnly: true, isMarketing: true, subject: '', enduserId: e.id, textContent: '', HTMLContent: '' }]), 
    handleAnyError
  )


  return await Promise.all([
    sdk.api.endusers.deleteOne(e.id),
  ])
}

export const form_conditional_logic_tests = async () => {
  log_header("Form Conditional Logic Tests")

  const responses: FormResponseValue[] = [
    {
      fieldId: "0",
      answer: { type: 'string', value: 'hello' },
      fieldTitle: '',
    },
    {
      fieldId: "0list",
      answer: { type: 'multiple_choice', value: ['hello'] },
      fieldTitle: '',
    },
    {
      fieldId: "1",
      answer: { type: 'string', value: '' },
      fieldTitle: '',
    },
    {
      fieldId: "2",
      answer: { type: 'multiple_choice', value: [''] },
      fieldTitle: '',
    },
    {
      fieldId: "3",
      answer: { type: 'number', value: 73 },
      fieldTitle: '',
      computedValueKey: 'Height',
    },
    {
      fieldId: "4",
      answer: { type: 'number', value: 190 },
      fieldTitle: '',
      computedValueKey: 'Weight',
    },
  ]
  
  let i = 0
  const run_conditional_form_test = (conditions: CompoundFilter<string>, expected: boolean, title=`Test ${++i}`) => {
    assert(
      responses_satisfy_conditions(responses, conditions) === expected,
      `Failed condition:\n${JSON.stringify(conditions, null, 2)}`,
      title,
    )
  }

  run_conditional_form_test({ $and: [{ condition: { '0': { $contains: 'hel'} } }] }, true)
  run_conditional_form_test({ $and: [{ condition: { '0': { $contains: 'hello'} } }] }, true)
  run_conditional_form_test({ $and: [{ condition: { '0': { $contains: 'hllo'} } }] }, false)
  run_conditional_form_test({ $and: [{ condition: { '0list': { $contains: 'hel'} } }] }, true)
  run_conditional_form_test({ $and: [{ condition: { '0list': { $contains: 'hello'} } }] }, true)
  run_conditional_form_test({ $and: [{ condition: { '0list': { $contains: 'hllo'} } }] }, false)
  run_conditional_form_test({ $and: [{ condition: { '1': '' } }] }, true)
  run_conditional_form_test({ $and: [{ condition: { '1': { $exists: true } } }] }, false)
  run_conditional_form_test({ $and: [{ condition: { '1': { $exists: false } } }] }, true)
  run_conditional_form_test({ $and: [{ condition: { '2': '' } }] }, true)
  run_conditional_form_test({ $and: [{ condition: { '2': { $exists: true } } }] }, true)
  run_conditional_form_test({ $and: [{ condition: { '2': { $exists: false } } }] }, false)
  run_conditional_form_test({ $and: [{ condition: { '3': { $gt: 72 } } }] }, true)
  run_conditional_form_test({ $and: [{ condition: { '3': { $gt: 73 } } }] }, false)
  run_conditional_form_test({ $and: [{ condition: { '3': { $gt: 74 } } }] }, false)
  run_conditional_form_test({ $and: [{ condition: { '3': { $lt: 72 } } }] }, false)
  run_conditional_form_test({ $and: [{ condition: { '3': { $lt: 73 } } }] }, false)
  run_conditional_form_test({ $and: [{ condition: { '3': { $lt: 74 } } }] }, true)
  run_conditional_form_test({ $and: [{ condition: { [FORM_LOGIC_CALCULATED_FIELDS[0]]: { $exists: true } } }] }, true)
  run_conditional_form_test({ $and: [{ condition: { [FORM_LOGIC_CALCULATED_FIELDS[0]]: { $gt: 25 } } }] }, true)
  run_conditional_form_test({ $and: [{ condition: { [FORM_LOGIC_CALCULATED_FIELDS[0]]: { $lt: 25 } } }] }, false)
}

export const enduser_conditional_logic_tests = async () => {
  log_header("Enduser Conditional Logic Tests")

  const requiredPlaceholders = {
    businessId: '', creator: '', hashedPassword: '', lastActive: '', lastLogout: '', updatedAt: new Date(), 
  }

  assert(
    evaluate_conditional_logic_for_enduser_fields({ ...requiredPlaceholders, _upcomingEvents: [] }, {  }),
    'Conditional logic error',
    'blank upcoming events with blank condition',
  )

  assert(
    evaluate_conditional_logic_for_enduser_fields({ ...requiredPlaceholders, _upcomingEvents: [] }, { "$and": [] }),
    'Conditional logic error',
    'blank upcoming events with empty and condition',
  )

  assert(
    evaluate_conditional_logic_for_enduser_fields({ ...requiredPlaceholders, _upcomingEvents: [] }, {
      "$and": [{ "condition": { "__upcomingEvents__": { "$lt": "1", "$fromOffset": -3600000, "$toOffset": 3600000 }}}]
    }),
    'Conditional logic error',
    'blank upcoming events with less than 1 condition',
  )

  assert(
    !evaluate_conditional_logic_for_enduser_fields({ ...requiredPlaceholders, _upcomingEvents: [] }, {
      "$and": [{ "condition": { "__upcomingEvents__": { "$lt": "0", "$fromOffset": -3600000, "$toOffset": 3600000 }}}]
    }),
    'Conditional logic error',
    'blank upcoming events with less than 0 condition',
  )

  assert(
    !evaluate_conditional_logic_for_enduser_fields({ ...requiredPlaceholders, _upcomingEvents: [] }, {
      "$and": [{ "condition": { "__upcomingEvents__": { "$gt": "0", "$fromOffset": -3600000, "$toOffset": 3600000 }}}] 
    }),
    'Conditional logic error',
    'blank upcoming events with greater than 0 condition',
  )

  assert(
    !evaluate_conditional_logic_for_enduser_fields({ ...requiredPlaceholders, _upcomingEvents: [{ startTimeInMS: Date.now() - 10000 }] }, {
      "$and": [{ "condition": { "__upcomingEvents__": { "$gt": "0" }}}] 
    }),
    'Conditional logic error',
    'past events are ignored by default (no $fromOffset set)',
  )

  assert(
    evaluate_conditional_logic_for_enduser_fields({ ...requiredPlaceholders, _upcomingEvents: [{ startTimeInMS: Date.now() + 10000 }] }, {
      "$and": [{ "condition": { "__upcomingEvents__": { "$gt": "0" }}}] 
    }),
    'Conditional logic error',
    'future events are recognized by default (no $fromOffset set)',
  )

  assert(
    !evaluate_conditional_logic_for_enduser_fields({ ...requiredPlaceholders, _upcomingEvents: [{ startTimeInMS: Date.now() - 100000 }] }, {
      "$and": [{ "condition": { "__upcomingEvents__": { "$gt": "0", "$fromOffset": -10000, "$toOffset": 3600000 }}}] 
    }),
    'Conditional logic error',
    'Past event outside of window',
  )

  assert(
    evaluate_conditional_logic_for_enduser_fields({ ...requiredPlaceholders, _upcomingEvents: [{ startTimeInMS: Date.now() - 100 }] }, {
      "$and": [{ "condition": { "__upcomingEvents__": { "$gt": "0", "$fromOffset": -10000, "$toOffset": 3600000 }}}] 
    }),
    'Conditional logic error',
    'Past event inside of window',
  )

  assert(
    !evaluate_conditional_logic_for_enduser_fields({ ...requiredPlaceholders, _upcomingEvents: [{ startTimeInMS: Date.now() + 1000000 }] }, {
      "$and": [{ "condition": { "__upcomingEvents__": { "$gt": "0", "$fromOffset": -10000, "$toOffset": 10000 }}}] 
    }),
    'Conditional logic error',
    'Future event outside of window',
  )

  assert(
    evaluate_conditional_logic_for_enduser_fields({ ...requiredPlaceholders, _upcomingEvents: [{ startTimeInMS: Date.now() + 100 }] }, {
      "$and": [{ "condition": { "__upcomingEvents__": { "$gt": "0", "$fromOffset": -10000, "$toOffset": 10000 }}}] 
    }),
    'Conditional logic error',
    'Future event inside of window',
  )

  assert(
    evaluate_conditional_logic_for_enduser_fields({ ...requiredPlaceholders, fields: { Number: "1" } }, {
      "$and": [{ "condition": { "Number": "1" }}] 
    }),
    'Type coercion error',
    'Number string matches string field',
  )
  assert(
    !evaluate_conditional_logic_for_enduser_fields({ ...requiredPlaceholders, fields: { Number: "2" } }, {
      "$and": [{ "condition": { "Number": "1" }}] 
    }),
    'Type coercion error',
    'Number string does not match different string field',
  )

  assert(
    evaluate_conditional_logic_for_enduser_fields({ ...requiredPlaceholders, fields: { Number: 1 } }, {
      "$and": [{ "condition": { "Number": "1" }}] 
    }),
    'Type coercion error',
    'Number string matches number field',
  )
  assert(
    !evaluate_conditional_logic_for_enduser_fields({ ...requiredPlaceholders, fields: { Number: 2 } }, {
      "$and": [{ "condition": { "Number": "1" }}] 
    }),
    'Type coercion error',
    'Number string does not match different number field',
  )
}

export const cancel_upcoming_appointments_journey_action_test = async () => {
  log_header("Cancel Upcoming Appointments Journey Action Test")

  const enduser = await sdk.api.endusers.createOne({ })
  const e1 = await sdk.api.calendar_events.createOne({ title: 'past', startTimeInMS: Date.now() - 100000, durationInMinutes: 60, attendees: [{ type: 'enduser', id: enduser.id }] })
  const e2 = await sdk.api.calendar_events.createOne({ title: 'future', startTimeInMS: Date.now() + 100000, durationInMinutes: 60, attendees: [{ type: 'enduser', id: enduser.id }]})
  const e3 = await sdk.api.calendar_events.createOne({ title: 'past, not enduser', startTimeInMS: Date.now() + 100000, durationInMinutes: 60 })
  const e4 = await sdk.api.calendar_events.createOne({ title: 'future, not enduser', startTimeInMS: Date.now() + 100000, durationInMinutes: 60 })

  await sdk.api.automated_actions.createOne({
    automationStepId: PLACEHOLDER_ID, journeyId: PLACEHOLDER_ID,
    processAfter: 0, status: 'active',
    enduserId: enduser.id,
    event: { type: 'onJourneyStart', info: {} },
    action: { type: 'cancelFutureAppointments', info: {} },
  })

  await async_test(
    `Upcoming event is cancelled, past appointment is not`,
    () => pollForResults(
      sdk.api.calendar_events.getSome,
      es => (
           !!es.find(e => e.id === e1.id && !e.cancelledAt)  // past event should not be cancelled
        && !!es.find(e => e.id === e2.id && !!e.cancelledAt) // future event should be cancelled
        && !!es.find(e => e.id === e3.id && !e.cancelledAt)  // past event not enduser should not be cancelled
        && !!es.find(e => e.id === e4.id && !e.cancelledAt)  // future event not enduser should not be cancelled
      ),
      50,
      100,
    ),
    passOnAnyResult
  )  

  await Promise.all([
    sdk.api.endusers.deleteOne(enduser.id),
    sdk.api.calendar_events.deleteOne(e1.id),
    sdk.api.calendar_events.deleteOne(e2.id),
    sdk.api.calendar_events.deleteOne(e3.id),
    sdk.api.calendar_events.deleteOne(e4.id),
  ])
}

export const ticket_reminder_tests = async () => {
  log_header("Ticket Reminder Tests")

  const toDelete: Ticket[] = []

  const dueDateInMS = Date.now() + 1000 * 60 * 60 * 24
  const title = 't'

  const LEEWAY = 200
  const withLeeway = (source: number | undefined, target: number) => (
    source !== undefined && ((source - LEEWAY) < target || (source + LEEWAY) > target)
  )

  await async_test(
    `No reminders`,
    () => sdk.api.tickets.createOne({ title }),
    { onResult: t => { toDelete.push(t); return t.nextReminderInMS === -1 }}
  )
  await async_test(
    `Empty reminders`,
    () => sdk.api.tickets.createOne({ title, reminders: [] }),
    { onResult: t => { toDelete.push(t); return t.nextReminderInMS === -1 }}
  )
  await async_test(
    `No due date`,
    () => sdk.api.tickets.createOne({ title, reminders: [{ msBeforeDueDate: 0, didRemind: true }] }),
    { onResult: t => { toDelete.push(t); return t.nextReminderInMS === -1 }}
  )
  await async_test(
    `One reminder`,
    () => sdk.api.tickets.createOne({ title, dueDateInMS, reminders: [{ msBeforeDueDate: 0, didRemind: true }] }),
    { onResult: t => { toDelete.push(t); return withLeeway(t.dueDateInMS, dueDateInMS - Date.now()) }}
  )

  const tToUpdate = await sdk.api.tickets.createOne({ title, reminders: [{ msBeforeDueDate: 0, didRemind: true }] })
  toDelete.push(tToUpdate)
  assert(tToUpdate.nextReminderInMS === -1, 'bad cache', 'update ticket starts with no nextReminderInMS')

  await sdk.api.tickets.updateOne(tToUpdate.id, { dueDateInMS })
  await async_test(
    `Setting due date sets nextReminderInMS`,
    () => pollForResults(
      () => sdk.api.tickets.getOne(tToUpdate.id),
      t => withLeeway(t.dueDateInMS, dueDateInMS - Date.now()),
      25,
      10,
    ),
    passOnAnyResult
  )  
  
  await sdk.api.tickets.updateOne(tToUpdate.id, { dueDateInMS: '' as any })
  await async_test(
    `Unsetting due date sets nextReminderInMS`,
    () => pollForResults(
      () => sdk.api.tickets.getOne(tToUpdate.id),
      t => t.nextReminderInMS === -1,
      25,
      10,
    ),
    passOnAnyResult
  )  

  await sdk.api.tickets.updateOne(tToUpdate.id, { dueDateInMS, reminders: [
    { msBeforeDueDate: 0 },
    { msBeforeDueDate: 1000 },
    { msBeforeDueDate: 7000 },
    { msBeforeDueDate: 5000 },
    { msBeforeDueDate: 9000, didRemind: false },
  ] })
  await async_test(
    `Correct reminder picked when multiple due date sets nextReminderInMS`,
    () => pollForResults(
      () => sdk.api.tickets.getOne(tToUpdate.id),
      t => withLeeway(t.dueDateInMS, dueDateInMS - Date.now() - 7000),
      25,
      10,
    ),
    passOnAnyResult
  )  

  // test actual reminders without setting owner to avoid email notifications
  const tToRemind = await sdk.api.tickets.createOne({ 
    title, 
    dueDateInMS: Date.now(),
    reminders: [
      { msBeforeDueDate: 0 }, // should remind right away
      { msBeforeDueDate: -8000 }, // should then remind after
    ] 
  })
  toDelete.push(tToRemind)

  await async_test(
    `Reminder processed right away`,
    () => pollForResults(
      () => sdk.api.tickets.getOne(tToRemind.id),
      t => (
           t.reminders?.[0]?.didRemind === true 
        && t.nextReminderInMS !== -1
        && t.reminders?.filter(r => r.didRemind)?.length === 1
      ),
      100,
      100,
    ),
    passOnAnyResult
  )  
  await async_test(
    `Delayed reminder not processed yet`,
    () => sdk.api.tickets.getOne(tToRemind.id),
    {
      onResult: (
        t => (
            t.reminders?.[0]?.didRemind === true 
          && t.nextReminderInMS !== -1
          && t.reminders?.filter(r => r.didRemind)?.length === 1
        )
      )
    } 
  )  
  await async_test(
    `Reminder processed after delay`,
    () => pollForResults(
      () => sdk.api.tickets.getOne(tToRemind.id),
      t => (
           t.reminders?.[0]?.didRemind === true 
        && t.nextReminderInMS === -1
        && t.reminders?.[1]?.didRemind === true 
        && t.reminders?.length === 2
      ),
      100,
      100,
    ),
    passOnAnyResult
  )  

  // cleanup
  await Promise.all(toDelete.map(t => sdk.api.tickets.deleteOne(t.id)))
}

const bulk_update_tests = async () => {
  log_header("Bulk Update Tests")

  const e1 = await sdk.api.endusers.createOne({ })
  const e2 = await sdk.api.endusers.createOne({ })

  await async_test(
    "primaryAssignee (set initial)",
    () => sdk.api.endusers.bulk_update({ ids: [e1.id], primaryAssignee: PLACEHOLDER_ID }),
    {
      onResult: ({ updated: [u, ...rest] }) => (
        rest.length === 0
      && u.id === e1.id
      && u.primaryAssignee === PLACEHOLDER_ID
      && u.assignedTo?.length === 1
      && u.assignedTo?.[0] === PLACEHOLDER_ID
      )
    }
  )

  await async_test(
    "primaryAssignee (set to another)",
    () => sdk.api.endusers.bulk_update({ ids: [e1.id], primaryAssignee: sdk.userInfo.id }),
    {
      onResult: ({ updated: [u, ...rest] }) => (
        rest.length === 0
      && u.id === e1.id
      && u.primaryAssignee === sdk.userInfo.id
      && u.assignedTo?.length === 2
      && u.assignedTo.includes(PLACEHOLDER_ID)
      && u.assignedTo.includes(sdk.userInfo.id)
      )
    }
  )

  await Promise.all([
    await sdk.api.endusers.deleteOne(e1.id),
    await sdk.api.endusers.deleteOne(e2.id),
  ])
}

const bulk_read_tests = async () => {
  log_header("Bulk Read (ID-lookup) Tests")

  const numEndusers = 101
  const endusers = (
    await sdk.api.endusers.createSome(
      Array.from(Array(numEndusers).keys()).map(() => 0).map(() => ({ }))
    )
  ).created

  await async_test(
    "bulk id lookup isn't limited to 100 (default for backend)",
    () => sdk.api.endusers.getByIds({ ids: endusers.map(e => e.id )}),
    { onResult: result => (
         result.matches.length === numEndusers 
      && result.matches.filter(e => endusers.find(_e => _e.id === e.id)).length === result.matches.length
    )}
  ) 

  await async_test(
    "bulk id lookup limited to 1000 (success)",
    () => sdk.api.endusers.getByIds({ ids: Array.from(Array(1000).keys()).map(() => endusers[0].id) }),
    passOnAnyResult
  ) 
  await async_test(
    "bulk id lookup limited to 1000",
    () => sdk.api.endusers.getByIds({ ids: Array.from(Array(1001).keys()).map(() => endusers[0].id) }),
    { 
      shouldError: true,
      onError: e => e.message === 'Error parsing field ids: Arrays should not contain more than 1000 elements'
    }
  ) 

  // cleanup
  for (const e of endusers) {
    await sdk.api.endusers.deleteOne(e.id)
  }
}

const test_send_with_template = async () => {
  log_header("test_send_with_template")

  const [enduser, template] = await Promise.all([
    sdk.api.endusers.createOne({ email: 'sebass192@gmail.com' }),
    sdk.api.templates.createOne({ message: 'Text Message', subject: "test_send_with_template", title: 'test_send_with_template', html: "HTML Message" }),
  ])

  await async_test(
    "send with template",
    () => sdk.api.emails.send_with_template({
      enduserId: enduser.id, templateId: template.id, senderId: sdk.userInfo.id,
    }),
    { onResult: ({ email }) => !!email.id && email.enduserId === enduser.id && email.templateId === template.id }
  ) 

  await wait(undefined, 3000)
  await Promise.all([
    sdk.api.endusers.deleteOne(enduser.id),
    sdk.api.templates.deleteOne(template.id),
  ])
}

const delete_user_tests = async () => {
  log_header("Delete user tests")
  // delete if previous test failed and user still exists
  const existing = await sdk.api.users.getSome({ filter: { email: 'deleteme@tellescope.com'}})
  if (existing[0]?.email === 'deleteme@tellescope.com') {
    await sdk.api.users.deleteOne(existing[0].id)
  }

  const u = await sdk.api.users.createOne({ email: 'deleteme@tellescope.com', verifiedEmail: true })  

  const { authToken } = await sdk.api.users.generate_auth_token({ id: u.id })
  const createdUserSDK = new Session({ host, authToken })

  await async_test(
    "Authenticated",
    createdUserSDK.test_authenticated,
    passOnAnyResult
  )  

  await sdk.api.users.deleteOne(u.id)
  await wait(undefined, 250)
  await async_test(
    "De-authenticated after deletion",
    createdUserSDK.test_authenticated,
    handleAnyError
  )  

  const enduser = await sdk.api.endusers.createOne({ })
  const { authToken: enduserAuthToken } = await sdk.api.endusers.generate_auth_token({ id: enduser.id })
  const enduserSDK = new EnduserSession({ host, businessId, authToken: enduserAuthToken })

  await async_test(
    "Enduser Authenticated",
    () => enduserSDK.api.endusers.getSome(),
    passOnAnyResult
  )  

  await sdk.api.endusers.deleteOne(enduser.id)
  await wait(undefined, 250)
  await async_test(
    "Enduser De-authenticated after deletion",
    () => enduserSDK.api.endusers.getSome(),
    handleAnyError
  )  
}

const sdkMfaApiKeyUserId = '6525a43e1e75f0350d62afc4'
const lockout_tests = async () => {
  log_header("Lockout tests")

  await async_test(
    "API Key is authenticated",
    sdkMfaApiKey.test_authenticated,
    passOnAnyResult,
  )
  await async_test(
    "API Key lock to future date",
    () => sdk.api.users.updateOne(sdkMfaApiKeyUserId, { lockedOutUntil: 0 }),
    passOnAnyResult
  )
  await wait(undefined, 250)
  await async_test(
    "API Key is de-authenticated when locked",
    sdkMfaApiKey.test_authenticated,
    handleAnyError,
  )
  await async_test(
    "API Key unlock to -1",
    () => sdk.api.users.updateOne(sdkMfaApiKeyUserId, { lockedOutUntil: -1 }),
    passOnAnyResult
  )
  await async_test(
    "API Key is authenticated",
    sdkMfaApiKey.test_authenticated,
    passOnAnyResult,
  )

  const nonAdminId = sdkNonAdmin.userInfo.id
  await async_test(
    "users cannot update own lock status",
    () => sdk.api.users.updateOne(sdk.userInfo.id, { lockedOutUntil: -1 }),
    handleAnyError,
  )
  await async_test(
    "non-admin can't lock out others",
    () => sdkNonAdmin.api.users.updateOne(sdk.userInfo.id, { lockedOutUntil: Date.now() }),
    handleAnyError
  )
  await async_test(
    "non-admin is authenticated",
    sdkNonAdmin.test_authenticated,
    passOnAnyResult,
  )
  await async_test(
    "admin unlock to -1",
    () => sdk.api.users.updateOne(nonAdminId, { lockedOutUntil: -1 }),
    passOnAnyResult,
  )
  await async_test(
    "non-admin is authenticated (-1)",
    sdkNonAdmin.test_authenticated,
    passOnAnyResult,
  )
  await async_test(
    "admin lock to past date",
    () => sdk.api.users.updateOne(nonAdminId, { lockedOutUntil: Date.now() - 1000 }),
    passOnAnyResult, 
  )
  await async_test(
    "non-admin is authenticated (past date)",
    sdkNonAdmin.test_authenticated,
    passOnAnyResult,
  )

  await async_test(
    "admin lock to 0 (indefinite)",
    () => sdk.api.users.updateOne(nonAdminId, { lockedOutUntil: 0 }),
    passOnAnyResult
  )
  await wait(undefined, 250)
  await async_test(
    "non-admin is de-authenticated when locked to 0",
    sdkNonAdmin.test_authenticated,
    handleAnyError,
  )
  await async_test(
    "non-admin can't authenciate when locked to 0",
    () => sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword),
    handleAnyError,
  )
  await async_test(
    "admin unlock to -1",
    () => sdk.api.users.updateOne(nonAdminId, { lockedOutUntil: -1 }),
    passOnAnyResult
  )
  await async_test(
    "non-admin can re authenciate when locked to 0",
    () => sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword),
    passOnAnyResult,
  )
  await async_test(
    "non-admin is authenticated",
    sdkNonAdmin.test_authenticated,
    passOnAnyResult,
  )

  await async_test(
    "admin lock to future date",
    () => sdk.api.users.updateOne(nonAdminId, { lockedOutUntil: Date.now() + 10000 }),
    passOnAnyResult
  )
  await wait(undefined, 250)
  await async_test(
    "non-admin is de-authenticated when locked to future date",
    sdkNonAdmin.test_authenticated,
    handleAnyError,
  )
  await async_test(
    "non-admin can't authenciate when locked to future date",
    () => sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword),
    handleAnyError,
  )
  await async_test(
    "admin unlock to -1",
    () => sdk.api.users.updateOne(nonAdminId, { lockedOutUntil: -1 }),
    passOnAnyResult
  )
  await async_test(
    "non-admin can re authenciate when locked to future date",
    () => sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword),
    passOnAnyResult,
  )
  await async_test(
    "non-admin is authenticated",
    sdkNonAdmin.test_authenticated,
    passOnAnyResult,
  )
}

const sync_tests = async () => {
  log_header("Data Sync")
 
  const from = new Date()

  await async_test(
    "No new records, admin",
    () => sdk.sync({ from }),
    { onResult: ({ results }) => results.length === 0 },
  )
  await async_test(
    "No new records, non-admin",
    () => sdkNonAdmin.sync({ from }),
    { onResult: ({ results }) => results.length === 0 },
  )

  const e = await sdk.api.endusers.createOne({ })
  await wait(undefined, 100)
  await async_test(
    "Enduser create, admin",
    () => sdk.sync({ from }),
    { onResult: ({ results }) => (
      results.length === 1 
      && results[0].modelName === 'endusers' 
      && results[0].recordId === e.id 
      && results[0].data.includes(e.id) 
      && JSON.parse(results[0].data) // tests no error throwing
    )},
  )
  await async_test(
    "Enduser create, non-admin",
    () => sdkNonAdmin.sync({ from }),
    { onResult: ({ results }) => results.length === 0 },
  )
  await async_test(
    "Enduser create, sub organization",
    () => sdkSub.sync({ from }),
    { onResult: ({ results }) => results.length === 0 },
  )
  await async_test(
    "Other organization",
    () => sdkOther.sync({ from }),
    { onResult: ({ results }) => results.filter(e => e.modelName === 'endusers' && e.data !== 'deleted').length === 0 },
  )

  await sdk.api.endusers.updateOne(e.id, { fname: "UPDATE_TEST"})
  await wait(undefined, 100)
  await async_test(
    "Enduser update, admin",
    () => sdk.sync({ from }),
    { onResult: ({ results }) => (
      results.length === 1 
      && results[0].modelName === 'endusers' 
      && results[0].recordId === e.id 
      && results[0].data.includes("UPDATE_TEST") 
    )},
  )
  await async_test(
    "Enduser update, non-admin",
    () => sdkNonAdmin.sync({ from }),
    { onResult: ({ results }) => results.length === 0 },
  )
  await async_test(
    "Enduser update, sub organization",
    () => sdkSub.sync({ from }),
    { onResult: ({ results }) => results.length === 0 },
  )
  await async_test(
    "Other organization",
    () => sdkOther.sync({ from }),
    { onResult: ({ results }) => results.filter(e => e.modelName === 'endusers' && e.data !== 'deleted').length === 0 },
  )

  const t = await sdk.api.tickets.createOne({ title: 'access test'  })
  await wait(undefined, 100)
  await async_test(
    "Non-admin can't access ticket",
    () => sdkNonAdmin.sync({ from }),
    { onResult: ({ results }) => results.length === 0 },
  )

  // creates a user notification which increments count/index
  sdk.api.tickets.updateOne(t.id, { owner: sdkNonAdmin.userInfo.id  })
  await wait(undefined, 100)

  await async_test(
    "Non-admin can access tickets on assignment",
    () => sdkNonAdmin.sync({ from }),
    { onResult: ({ results }) => results.length === 2 },
  )
  await async_test(
    "Sub organization still 0",
    () => sdkSub.sync({ from }),
    { onResult: ({ results }) => results.length === 0 },
  )
  await async_test(
    "Other organization still 0",
    () => sdkOther.sync({ from }),
    { onResult: ({ results }) => results.filter(e => e.modelName === 'endusers' && e.data !== 'deleted').length === 0 },
  )

  sdk.api.tickets.updateOne(t.id, { owner: ''  })
  await wait(undefined, 100)
  await async_test(
    "Non-admin can't access tickets on unassignment",
    () => sdkNonAdmin.sync({ from }),
    { onResult: ({ results }) => results.length === 1 }, // still includes user notification
  )
  await async_test(
    "Sub organization still 0",
    () => sdkSub.sync({ from }),
    { onResult: ({ results }) => results.length === 0 },
  )
  await async_test(
    "Other organization still 0",
    () => sdkOther.sync({ from }),
    { onResult: ({ results }) => results.filter(e => e.modelName === 'endusers' && e.data !== 'deleted').length === 0 },
  )

  await sdk.api.endusers.updateOne(e.id, { assignedTo: [sdkNonAdmin.userInfo.id] }, { replaceObjectFields: true })
  await wait(undefined, 100)
  await async_test(
    "Enduser update non-admin assignment, can access",
    () => sdkNonAdmin.sync({ from }),
    { onResult: ({ results }) => results.length === 2 }, // enduser and ticket user notification
  )
  await async_test(
    "Sub organization still 0",
    () => sdkSub.sync({ from }),
    { onResult: ({ results }) => results.length === 0 },
  )
  await async_test(
    "Other organization still 0",
    () => sdkOther.sync({ from }),
    { onResult: ({ results }) => results.filter(e => e.modelName === 'endusers' && e.data !== 'deleted').length === 0 },
  )

  sdk.api.tickets.updateOne(t.id, { owner: '', enduserId: e.id  })
  await wait(undefined, 100)
  await async_test(
    "Non-admin can access ticket (and enduser) after enduser assignment",
    () => sdkNonAdmin.sync({ from }),
    { 
      onResult: ({ results }) => (
        results.length === 3 
        && results.filter(r => r.modelName === 'tickets' && r.recordId === t.id).length === 1
        && results.filter(r => r.modelName === 'endusers' && r.recordId === e.id).length === 1
      )
    },
  )
  await async_test(
    "Sub organization still 0",
    () => sdkSub.sync({ from }),
    { onResult: ({ results }) => results.length === 0 },
  )
  await async_test(
    "Other organization still 0",
    () => sdkOther.sync({ from }),
    { onResult: ({ results }) => results.filter(e => e.modelName === 'endusers' && e.data !== 'deleted').length === 0 },
  )

  await sdk.api.endusers.updateOne(e.id, { assignedTo: [] }, { replaceObjectFields: true })
  await wait(undefined, 100)
  await async_test(
    "Enduser update non-admin assignment, revoked access to enduser and ticket",
    () => sdkNonAdmin.sync({ from }),
    { onResult: ({ results }) => 
      // still has user notification
      results.length === 1 &&  
      results.filter(r => r.modelName === 'user_notifications').length === 1
    },
  )
  await async_test(
    "Sub organization still 0",
    () => sdkSub.sync({ from }),
    { onResult: ({ results }) => results.length === 0 },
  )
  await async_test(
    "Other organization still 0",
    () => sdkOther.sync({ from }),
    { onResult: ({ results }) => results.filter(e => e.modelName === 'endusers' && e.data !== 'deleted').length === 0 },
  )
  
  // enduser, ticket, and ticket assignment user_notification created
  await sdk.api.endusers.deleteOne(e.id)
  await wait(undefined, 100)
  await async_test(
    "Enduser delete, admin",
    () => sdk.sync({ from }),
    { onResult: ({ results }) => (
      results.length === 3 
      && results[0].modelName === 'endusers' 
      && results[0].recordId === e.id 
      && results[0].data === 'deleted' 
    )},
  )
  await async_test(
    "Enduser delete, non-admin",
    () => sdkNonAdmin.sync({ from }),
    { onResult: ({ results }) => 
      // still includes user notification
      results.length === 1 
      && results.filter(r => r.modelName === 'user_notifications').length === 1
    }, 
  )
  await async_test(
    "Enduser delete, sub organization",
    () => sdkSub.sync({ from }),
    { onResult: ({ results }) => results.length === 0 },
  )
  await async_test(
    "Other organization",
    () => sdkOther.sync({ from }),
    { onResult: ({ results }) => results.filter(e => e.modelName === 'endusers' && e.data !== 'deleted').length === 0 },
  )
  
  // bulk create test coverage
  const [e2] = (await sdk.api.endusers.createSome([{ }])).created
  await wait(undefined, 100)
  await async_test(
    "Bulk Enduser create, admin",
    () => sdk.sync({ from }),
    { onResult: ({ results }) => (
      results.length === 4 
      && results[0].modelName === 'endusers' 
      && results[0].recordId === e2.id 
      && results[0].data.includes(e2.id) 
      && JSON.parse(results[0].data) // tests no error throwing
    )},
  )
  await async_test(
    "Bulk Enduser create, non-admin",
    () => sdkNonAdmin.sync({ from }),
    { onResult: ({ results }) => results.length === 1 }, // still includes user notification
  )
  await async_test(
    "Bulk Enduser create, sub organization",
    () => sdkSub.sync({ from }),
    { onResult: ({ results }) => results.length === 0 },
  )
  await async_test(
    "Other organization",
    () => sdkOther.sync({ from }),
    { onResult: ({ results }) => results.filter(e => e.modelName === 'endusers' && e.data !== 'deleted').length === 0 },
  )

  await sdk.api.endusers.deleteOne(e2.id)
  await wait(undefined, 100)
  await async_test(
    "Bulk Enduser delete, admin",
    () => sdk.sync({ from }),
    { onResult: ({ results }) => (
      results.length === 4 
      && results[0].modelName === 'endusers' 
      && results[0].recordId === e2.id 
      && results[0].data === 'deleted' 
    )},
  )
  await async_test(
    "Bulk Enduser delete, non-admin",
    () => sdkNonAdmin.sync({ from }),
    { onResult: ({ results }) => 
      // still includes user notification
      results.length === 1 
      && results.filter(r => r.modelName === 'user_notifications').length === 1
    }, 
  )
  await async_test(
    "Bulk Enduser delete, sub organization",
    () => sdkSub.sync({ from }),
    { onResult: ({ results }) => results.length === 0 },
  )
  await async_test(
    "Other organization",
    () => sdkOther.sync({ from }),
    { onResult: ({ results }) => results.filter(e => e.modelName === 'endusers' && e.data !== 'deleted').length === 0 },
  )
}

const sync_tests_with_access_tags = async () => {
  log_header("Data Sync with Access Tags")

  // set before from is set, so that user update does not end up in sync
  const matchTag = 'Access'
  await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { tags: [matchTag] }, { replaceObjectFields: true })


  await sdk.api.organizations.updateOne(sdkNonAdmin.userInfo.businessId, { 
    settings: { endusers: { enableAccessTags: true } }
  })
  await sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword) // ensure enableAccessTags setting stored correctly on jwt
  await wait(undefined, 1000)

  const from = new Date()
  const e = await sdk.api.endusers.createOne({ })
  const t = await sdk.api.tickets.createOne({ title: 'access test', enduserId: e.id })

  await sdk.api.endusers.updateOne(e.id, { accessTags: [matchTag] }, { replaceObjectFields: true })
  await wait(undefined, 100)
  await async_test(
    "Access tags non-admin assignment, granted access to enduser and ticket",
    () => sdkNonAdmin.sync({ from }),
    { 
      onResult: ({ results }) => (
        results.length === 2
        && results.filter(r => r.modelName === 'tickets' && r.recordId === t.id).length === 1
        && results.filter(r => r.modelName === 'endusers' && r.recordId === e.id).length === 1
      )
    },
  )
  await async_test(
    "Sub organization still 0",
    () => sdkSub.sync({ from }),
    { onResult: ({ results }) => results.length === 0 },
  )
  await async_test(
    "Other organization still 0",
    () => sdkOther.sync({ from }),
    { onResult: ({ results }) => results.filter(e => e.modelName === 'endusers' && e.data !== 'deleted').length === 0 },
  )
   await sdk.api.endusers.updateOne(e.id, { accessTags: [] }, { replaceObjectFields: true })
  await wait(undefined, 100)
  await async_test(
    "Removed access tags non-admin, revoked access to enduser and ticket",
    () => sdkNonAdmin.sync({ from }),
    { onResult: ({ results }) => results.length === 0 }
  )
  await async_test(
    "Sub organization still 0",
    () => sdkSub.sync({ from }),
    { onResult: ({ results }) => results.length === 0 },
  )
  await async_test(
    "Other organization still 0",
    () => sdkOther.sync({ from }),
    { onResult: ({ results }) => results.filter(e => e.modelName === 'endusers' && e.data !== 'deleted').length === 0 },
  )
  await sdk.api.organizations.updateOne(sdkNonAdmin.userInfo.businessId, { 
    settings: { endusers: { enableAccessTags: false } }
  })
  await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { tags: [] }, { replaceObjectFields: true })
  await sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword) // ensure enableAccessTags setting stored correctly on jwt 
  await sdk.api.endusers.deleteOne(e.id)
  await wait(undefined, 1000) // ensure delete does not appear in next sync, sdkNonAdmin connected
}
// to cover potential vulernabilities with enduser public register endpoint
const register_as_enduser_tests = async () => {
  log_header("Register as Enduser")

  await async_test(
    "Enduser register",
    () => enduserSDK.register({ email: 'test@tellescope.com', password: 'testpassWord12345!' }),
    passOnAnyResult
  )
  await async_test(
    "Enduser register (rate limited)",
    () => enduserSDK.register({ email: 'test@tellescope.com', password: 'testpassWord12345!' }),
    { shouldError: true, onError: e => e.message === "Too many requests" }
  )
  await wait(undefined, 1000)
  await async_test(
    "Enduser duplicate register (same response, no ability to enumerate contacts)",
    () => enduserSDK.register({ email: 'test@tellescope.com', password: 'testpassWord12345!' }),
    passOnAnyResult
  )

  const enduser = await sdk.api.endusers.getOne({ email: 'test@tellescope.com'})
  if (enduser) {
    await sdk.api.endusers.deleteOne(enduser.id)
  }
}

const close_reasons_no_duplicates_tests = async () => {
  log_header("Close reasons no duplicates")
  
  const tNone = await sdk.api.tickets.createOne({ title: '1'})
  const tDuplicates = await sdk.api.tickets.createOne({ title: '1', 'closeReasons': ["1", "2", "1"]})
  assert(tDuplicates.closeReasons?.length === 2, 'closeReasons not unique on create', 'closeReasons are unique on create') 
  const updated = await sdk.api.tickets.updateOne(tDuplicates.id, { closeReasons: ['1', '2', '3'] })
  assert(updated.closeReasons?.length === 3, 'closeReasons not unique on update', 'closeReasons are unique on update') 

  await async_test(
    "Filters duplicates before validating length too long",
    () => sdk.api.tickets.updateOne(tDuplicates.id, { 
      closeReasons: '1,'.repeat(1500).split(','),
    }),
    passOnAnyResult
  )

  await Promise.all([
    sdk.api.tickets.deleteOne(tNone.id),
    sdk.api.tickets.deleteOne(tDuplicates.id),
  ])
}

const vital_trigger_tests = async () => {
  log_header("Vital Update Trigger")
 
  const runTriggerTest = async ({
    configurations: _configurations,
    triggers: _triggers,
    shouldTrigger,
    otherEnduserShouldTrigger,
    vitals,
    title,
    enduserConfigurations: _enduserConfigurations,
  } : {
    configurations: Pick<VitalConfiguration, 'mealStatus' | 'unit' | 'ranges'>[]
    triggers: { configurationIndexes: number[], classifications: string[] }[],
    vitals: (Pick<EnduserObservation, 'measurement'> & Pick<Partial<EnduserObservation>, | 'timestamp' | 'beforeMeal' | 'dontTrigger'>)[],
    shouldTrigger: boolean,
    otherEnduserShouldTrigger?: boolean,
    title: string,
    enduserConfigurations?: Pick<VitalConfiguration, 'mealStatus' | 'unit' | 'ranges'>[]
  }) => {
    const e = await sdk.api.endusers.createOne({ weight: { unit: 'LB', value: 180 } })
    const e2 = await sdk.api.endusers.createOne({ weight: { unit: 'LB', value: 180 } })
    const configurations = (
      await sdk.api.vital_configurations.createSome(_configurations.map((c, i) => ({
        title: `configuration ${i}`,
        ...c,
      })))
    ).created

    const enduserConfigurations = (
      _enduserConfigurations?.length
        ? (
          await sdk.api.vital_configurations.createSome(_enduserConfigurations.map((c, i) => ({
            title: `enduser configuration ${i}`,
            enduserId: e.id,
            originalConfigurationId: configurations[i].id,
            ...c,
          })))
        ).created
        : []
    )

    const triggers = (
      await sdk.api.automation_triggers.createSome(_triggers.map((t, i) => ({
        title: `trigger ${i}`,
        status: 'Active', 
        event: {
          type: "Vital Update",
          info: {
            classifications: t.classifications,
            configurationIds: configurations.filter((_, i) => t.configurationIndexes.includes(i)).map(c => c.id),
          }
        },
        action: {
          type: 'Add Tags',
          info: { tags: ['Triggered'] },
        },
      })))
    ).created

    await sdk.api.enduser_observations.createSome(vitals.map(v => ({
      ...v,
      category: 'vital-signs',
      enduserId: e.id,
      status: 'registered',
    })))

    await async_test(
      title,
      () => pollForResults(
        () => sdk.api.endusers.getOne(e.id),
        e => {
          // console.log(title, e.tags, (!!e.tags?.includes("Triggered")) === shouldTrigger)
          return (!!e.tags?.includes("Triggered")) === shouldTrigger
        },
        50,
        10,
        shouldTrigger
      ),
      passOnAnyResult,
    )  

    if (enduserConfigurations.length) {
      await async_test(
        title + ' other enduser',
        () => pollForResults(
          () => sdk.api.endusers.getOne(e2.id),
          e => {
            // console.log(title, e.tags, (!!e.tags?.includes("Triggered")) === shouldTrigger)
            return (!!e.tags?.includes("Triggered")) === otherEnduserShouldTrigger 
          },
          50,
          10,
          otherEnduserShouldTrigger 
        ),
        passOnAnyResult,
      )  
    }

    await Promise.all([
      sdk.api.endusers.deleteOne(e.id),
      sdk.api.endusers.deleteOne(e2.id),
      ...configurations.map(c => sdk.api.vital_configurations.deleteOne(c.id)),
      ...enduserConfigurations.map(c => sdk.api.vital_configurations.deleteOne(c.id)),
      ...triggers.map(t => sdk.api.automation_triggers.deleteOne(t.id)),
    ])
  }

  await runTriggerTest({
    title: "Basic Passing Test (dontTrigger)",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 2 }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'LB', value: 1 },
      timestamp: new Date(),
      dontTrigger: true,
    }]
  })

  await runTriggerTest({
    title: "Enduser Specific trigger",
    shouldTrigger: true,
    otherEnduserShouldTrigger: false,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 0 }, trendIntervalInMS: 0 }, ],
    }],
    enduserConfigurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 2 }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'LB', value: 1 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "Enduser Specific trigger (both)",
    shouldTrigger: true,
    otherEnduserShouldTrigger: true,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 2 }, trendIntervalInMS: 0 }, ],
    }],
    enduserConfigurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 2 }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'LB', value: 1 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "Enduser Specific dont trigger",
    shouldTrigger: false,
    otherEnduserShouldTrigger: true,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 2 }, trendIntervalInMS: 0 }, ],
    }],
    enduserConfigurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 0 }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'LB', value: 1 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "Enduser Specific dont trigger (both)",
    shouldTrigger: false,
    otherEnduserShouldTrigger: false,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 0 }, trendIntervalInMS: 0 }, ],
    }],
    enduserConfigurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 0 }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'LB', value: 1 },
      timestamp: new Date(),
    }]
  })

  await runTriggerTest({
    title: "Any Meal Passing (Unset)",
    shouldTrigger: true,
    configurations: [{ 
      unit: 'mg/dL',
      // no meal status
      // mealStatus: 'Before', 
      ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'mg/dL', value: 100 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "Any Meal Passing (Unset) [Before]",
    shouldTrigger: true,
    configurations: [{ 
      unit: 'mg/dL',
      ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      beforeMeal: true,
      measurement: { unit: 'mg/dL', value: 100 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "Any Meal Passing (Unset) [After]",
    shouldTrigger: true,
    configurations: [{ 
      unit: 'mg/dL',
      ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      beforeMeal: false,
      measurement: { unit: 'mg/dL', value: 100 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "Any Meal Passing",
    shouldTrigger: true,
    configurations: [{ 
      unit: 'mg/dL',
      mealStatus: 'Any', 
      ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'mg/dL', value: 100 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "Before Meal Passing",
    shouldTrigger: true,
    configurations: [{ 
      unit: 'mg/dL',
      mealStatus: 'Before',
      ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      beforeMeal: true,
      measurement: { unit: 'mg/dL', value: 100 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "Before Meal Failing (omitted)",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'mg/dL',
      mealStatus: 'Before',
      ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'mg/dL', value: 100 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "Before Meal Failing",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'mg/dL',
      mealStatus: 'Before',
      ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      beforeMeal: false,
      measurement: { unit: 'mg/dL', value: 100 },
      timestamp: new Date(),
    }]
  })

  await runTriggerTest({
    title: "After Meal Passing",
    shouldTrigger: true,
    configurations: [{ 
      unit: 'mg/dL',
      mealStatus: 'After',
      ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      beforeMeal: false,
      measurement: { unit: 'mg/dL', value: 100 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "After Meal Failing (omitted)",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'mg/dL',
      mealStatus: 'After',
      ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'mg/dL', value: 100 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "After Meal Failing",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'mg/dL',
      mealStatus: 'After',
      ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      beforeMeal: true,
      measurement: { unit: 'mg/dL', value: 100 },
      timestamp: new Date(),
    }]
  })

  await runTriggerTest({
    title: "Before meal trend passing",
    shouldTrigger: true,
    configurations: [{ 
      mealStatus: 'Before',
      unit: 'mg/dL',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 1 }, trendIntervalInMS: 1000 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [
      { beforeMeal: true,  measurement: { unit: 'mg/dL', value: 1 }, timestamp: new Date() },
      { beforeMeal: true, measurement: { unit: 'mg/dL', value: 1 }, timestamp: new Date(new Date().getTime() - 999) },
    ]
  })
  await runTriggerTest({
    title: "Before meal trend failing, undefined",
    shouldTrigger: false,
    configurations: [{ 
      mealStatus: 'Before',
      unit: 'mg/dL',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 1 }, trendIntervalInMS: 1000 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [
      { measurement: { unit: 'mg/dL', value: 1 }, timestamp: new Date() },
      { measurement: { unit: 'mg/dL', value: 1 }, timestamp: new Date(new Date().getTime() - 999) },
    ]
  })
  await runTriggerTest({
    title: "Before meal trend failing",
    shouldTrigger: false,
    configurations: [{ 
      mealStatus: 'Before',
      unit: 'mg/dL',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 1 }, trendIntervalInMS: 1000 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [
      { beforeMeal: false, measurement: { unit: 'mg/dL', value: 1 }, timestamp: new Date() },
      { beforeMeal: false, measurement: { unit: 'mg/dL', value: 1 }, timestamp: new Date(new Date().getTime() - 999) },
    ]
  })


  await runTriggerTest({
    title: "After meal trend passing",
    shouldTrigger: true,
    configurations: [{ 
      mealStatus: 'After',
      unit: 'mg/dL',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 1 }, trendIntervalInMS: 1000 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [
      { beforeMeal: false,  measurement: { unit: 'mg/dL', value: 1 }, timestamp: new Date() },
      { beforeMeal: false, measurement: { unit: 'mg/dL', value: 1 }, timestamp: new Date(new Date().getTime() - 999) },
    ]
  })
  await runTriggerTest({
    title: "After meal trend failing, undefined",
    shouldTrigger: false,
    configurations: [{ 
      mealStatus: 'After',
      unit: 'mg/dL',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 1 }, trendIntervalInMS: 1000 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [
      { measurement: { unit: 'mg/dL', value: 1 }, timestamp: new Date() },
      { measurement: { unit: 'mg/dL', value: 1 }, timestamp: new Date(new Date().getTime() - 999) },
    ]
  })
  await runTriggerTest({
    title: "After meal trend failing",
    shouldTrigger: false,
    configurations: [{ 
      mealStatus: 'After',
      unit: 'mg/dL',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 1 }, trendIntervalInMS: 1000 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [
      { beforeMeal: true, measurement: { unit: 'mg/dL', value: 1 }, timestamp: new Date() },
      { beforeMeal: true, measurement: { unit: 'mg/dL', value: 1 }, timestamp: new Date(new Date().getTime() - 999) },
    ]
  })

  await runTriggerTest({
    title: "Weight Trend from Profile (positive, not enough)",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, deviationFromProfileWeight: true, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'LB', value: 180 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "Weight Trend from Profile (negative, not enough)",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: -1 }, deviationFromProfileWeight: true, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'LB', value: 175 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "Weight Trend from Profile",
    shouldTrigger: true,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, deviationFromProfileWeight: true, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'LB', value: 182 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "Weight Trend from Profile (negative)",
    shouldTrigger: true,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: -1 }, deviationFromProfileWeight: true, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'LB', value: 178 },
      timestamp: new Date(),
    }]
  })

  await runTriggerTest({
    title: "Basic Passing Test (Less Than Sucess)",
    shouldTrigger: true,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 2 }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'LB', value: 1 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "Less Than Fail",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 1 }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'LB', value: 1 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "Greater Than Success",
    shouldTrigger: true,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 0 }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'LB', value: 1 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "Greater Than Fail",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 0 }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'LB', value: 0 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "Between Low Bound",
    shouldTrigger: true,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Between', value: { lower: 0, upper: 1 } }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'LB', value: 0 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "Between Upper Bound",
    shouldTrigger: true,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Between', value: { lower: 0, upper: 1 } }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'LB', value: 1 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "Between Middle",
    shouldTrigger: true,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Between', value: { lower: 0, upper: 2 } }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'LB', value: 1 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "Between Below Low Bound",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Between', value: { lower: 0, upper: 1 } }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'LB', value: -1 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "Between Above Upper Bound",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Between', value: { lower: 0, upper: 1 } }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'LB', value: 2 },
      timestamp: new Date(),
    }]
  })

  await runTriggerTest({
    title: "Mismatch Unit",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'DIFFERENT',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 200 }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'LB', value: 1 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "Mismatch Classification",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 200 }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['High'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'LB', value: 1 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "Multiple Configurations, first considered works",
    shouldTrigger: true,
    configurations: [{ 
      unit: 'LB',
      ranges: [
        { classification: 'High', comparison: { type: 'Less Than', value: 100 }, trendIntervalInMS: 0 }, 
        { classification: 'Target', comparison: { type: 'Less Than', value: 200 }, trendIntervalInMS: 0 }, 
      ],
    }],
    triggers: [{ classifications: ['High'], configurationIndexes: [0,1] }],
    vitals: [{
      measurement: { unit: 'LB', value: 1 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "Multiple Configurations, first considered fails",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'LB',
      ranges: [
        { classification: 'Target', comparison: { type: 'Less Than', value: 200 }, trendIntervalInMS: 0 }, 
        { classification: 'High', comparison: { type: 'Less Than', value: 100 }, trendIntervalInMS: 0 }, 
      ],
    }],
    triggers: [{ classifications: ['High'], configurationIndexes: [0,1] }],
    vitals: [{
      measurement: { unit: 'LB', value: 1 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "Multiple Configurations (Comparisons)",
    shouldTrigger: true,
    configurations: [{ 
      unit: 'LB',
      ranges: [
        { classification: 'Target', comparison: { type: 'Less Than', value: 0 }, trendIntervalInMS: 0 }, 
        { classification: 'High', comparison: { type: 'Less Than', value: 100 }, trendIntervalInMS: 0 }, 
      ],
    }],
    triggers: [{ classifications: ['High'], configurationIndexes: [0,1] }],
    vitals: [{
      measurement: { unit: 'LB', value: 1 },
      timestamp: new Date(),
    }]
  })

  await runTriggerTest({
    title: "Multiple vitals, 0 passes",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 200 }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [
      { measurement: { unit: 'LB', value: 500 }, timestamp: new Date() },
      { measurement: { unit: 'LB', value: 1000 }, timestamp: new Date(Date.now() - 100) },
      { measurement: { unit: 'LB', value: 250 }, timestamp: new Date(Date.now() - 250)  },
    ]
  })
  await runTriggerTest({
    title: "Multiple vitals, 1 passes",
    shouldTrigger: true,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 200 }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [
      { measurement: { unit: 'LB', value: 500 }, timestamp: new Date() },
      { measurement: { unit: 'LB', value: 1 }, timestamp: new Date(Date.now() - 100) },
      { measurement: { unit: 'LB', value: 250 }, timestamp: new Date(Date.now() - 250)  },
    ]
  })
  await runTriggerTest({
    title: "Multiple vitals, multiple pass",
    shouldTrigger: true,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 200 }, trendIntervalInMS: 0 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [
      { measurement: { unit: 'LB', value: 1 }, timestamp: new Date() },
      { measurement: { unit: 'LB', value: 2 }, timestamp: new Date(Date.now() - 100) },
      { measurement: { unit: 'LB', value: 3 }, timestamp: new Date(Date.now() - 250)  },
    ]
  })

  // trend tests
  await runTriggerTest({
    title: "Singleton trend should not work",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 200 }, trendIntervalInMS: 1000 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [{
      measurement: { unit: 'LB', value: 1 },
      timestamp: new Date(),
    }]
  })
  await runTriggerTest({
    title: "2-point trend passing",
    shouldTrigger: true,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 1 }, trendIntervalInMS: 1000 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [
      { measurement: { unit: 'LB', value: 1 }, timestamp: new Date() },
      { measurement: { unit: 'LB', value: 1 }, timestamp: new Date(new Date().getTime() - 999) },
    ]
  })
  await runTriggerTest({
    title: "2-point trend passing (negative)",
    shouldTrigger: true,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: -1 }, trendIntervalInMS: 1000 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [
      { measurement: { unit: 'LB', value: 1 }, timestamp: new Date() },
      { measurement: { unit: 'LB', value: 10 }, timestamp: new Date(new Date().getTime() - 999) },
    ]
  })
  await runTriggerTest({
    title: "2-point trend failing (negative)",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: -1 }, trendIntervalInMS: 1000 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [
      { measurement: { unit: 'LB', value: 1 }, timestamp: new Date() },
      { measurement: { unit: 'LB', value: 2 }, timestamp: new Date(new Date().getTime() - 999) },
    ]
  })
  await runTriggerTest({
    title: "2-point trend failing for difference too small",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 1 }, trendIntervalInMS: 1000 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [
      { measurement: { unit: 'LB', value: 1 }, timestamp: new Date() },
      { measurement: { unit: 'LB', value: 0 }, timestamp: new Date(new Date().getTime() - 999) },
    ]
  })
  await runTriggerTest({
    title: "2-point trend failing for point out of time range",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 5 }, trendIntervalInMS: 1000 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [
      { measurement: { unit: 'LB', value: 1 }, timestamp: new Date() },
      { measurement: { unit: 'LB', value: 0 }, timestamp: new Date(new Date().getTime() - 1001) },
    ]
  })
  await runTriggerTest({
    title: "3-point trend passing (1 point of out range)",
    shouldTrigger: true,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 2 }, trendIntervalInMS: 1000 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [
      { measurement: { unit: 'LB', value: 2 }, timestamp: new Date() },
      { measurement: { unit: 'LB', value: 1 }, timestamp: new Date(new Date().getTime() - 100) },
      { measurement: { unit: 'LB', value: 0 }, timestamp: new Date(new Date().getTime() - 1001) },
    ]
  })
  await runTriggerTest({
    title: "3-point trend passing (1 point wrong unit)",
    shouldTrigger: true,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 2 }, trendIntervalInMS: 1000 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [
      { measurement: { unit: 'LB', value: 2 }, timestamp: new Date() },
      { measurement: { unit: 'LB', value: 1 }, timestamp: new Date(new Date().getTime() - 100) },
      { measurement: { unit: 'OTHER', value: 0 }, timestamp: new Date(new Date().getTime() - 200) },
    ]
  })
  await runTriggerTest({
    title: "3-point trend failing (1 point of out range)",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 2 }, trendIntervalInMS: 1000 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [
      { measurement: { unit: 'LB', value: 2 }, timestamp: new Date() },
      { measurement: { unit: 'LB', value: 0 }, timestamp: new Date(new Date().getTime() - 100) },
      { measurement: { unit: 'LB', value: 1 }, timestamp: new Date(new Date().getTime() - 1001) },
    ]
  })
  await runTriggerTest({
    title: "3-point trend failing (1 point wrong unit)",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 2 }, trendIntervalInMS: 1000 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [
      { measurement: { unit: 'LB', value: 2 }, timestamp: new Date() },
      { measurement: { unit: 'LB', value: 0 }, timestamp: new Date(new Date().getTime() - 100) },
      { measurement: { unit: 'OTHER', value: 1 }, timestamp: new Date(new Date().getTime() - 200) },
    ]
  })
  await runTriggerTest({
    title: "multiple trend passing",
    shouldTrigger: true,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 1000 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [
      { measurement: { unit: 'LB', value: 3 }, timestamp: new Date() },
      { measurement: { unit: 'LB', value: 2 }, timestamp: new Date(new Date().getTime() - 100) },
      { measurement: { unit: 'LB', value: 1 }, timestamp: new Date(new Date().getTime() - 200) },
    ]
  })
  await runTriggerTest({
    title: "multiple trend failing (not enough)",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 1000 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [
      { measurement: { unit: 'LB', value: 2 }, timestamp: new Date() },
      { measurement: { unit: 'LB', value: 2 }, timestamp: new Date(new Date().getTime() - 100) },
      { measurement: { unit: 'LB', value: 1 }, timestamp: new Date(new Date().getTime() - 200) },
    ]
  })
  await runTriggerTest({
    title: "multiple trend failing (wrong order)",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 1000 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [
      { measurement: { unit: 'LB', value: 1 }, timestamp: new Date() },
      { measurement: { unit: 'LB', value: 2 }, timestamp: new Date(new Date().getTime() - 100) },
      { measurement: { unit: 'LB', value: 3 }, timestamp: new Date(new Date().getTime() - 200) },
    ]
  })
  await runTriggerTest({
    title: "multiple trend failing (not enough, and wrong order)",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 1000 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [
      { measurement: { unit: 'LB', value: 1 }, timestamp: new Date() },
      { measurement: { unit: 'LB', value: 2 }, timestamp: new Date(new Date().getTime() - 100) },
      { measurement: { unit: 'LB', value: 2 }, timestamp: new Date(new Date().getTime() - 200) },
    ]
  })
  await runTriggerTest({
    title: "multiple trend failing (lots)",
    shouldTrigger: false,
    configurations: [{ 
      unit: 'LB',
      ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 1000 }, ],
    }],
    triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
    vitals: [
      { measurement: { unit: 'LB', value: 1 }, timestamp: new Date() },
      { measurement: { unit: 'LB', value: 2 }, timestamp: new Date(new Date().getTime() - 100) },
      { measurement: { unit: 'LB', value: 2 }, timestamp: new Date(new Date().getTime() - 200) },
      { measurement: { unit: 'LB', value: 1 }, timestamp: new Date(new Date().getTime() - 300) },
      { measurement: { unit: 'LB', value: 1 }, timestamp: new Date(new Date().getTime() - 400) },
      { measurement: { unit: 'LB', value: 2 }, timestamp: new Date(new Date().getTime() - 500) },
      { measurement: { unit: 'LB', value: 1 }, timestamp: new Date(new Date().getTime() - 600) },
    ]
  })
}

const superadmin_tests = async () => {
  log_header("Superadmin Tests")

  await async_test(
    "switch tenant is limited",
    () => sdk.change_tenant({ all: true }),
    handleAnyError
  ) 
}

const mdb_filter_tests = async () => {
  log_header("MongoDB Filter Tests")

  const enduser = await sdk.api.endusers.createOne({ 
    fname: 'Test',
    lname: 'Testson',
    tags: ["tag1", "tag2"],
    fields: { custom: 1, nested: { custom: 2 } },
  })
  const otherEnduser = await sdk.api.endusers.createOne({ 
    fname: 'Other',
    lname: 'Enduser',
    tags: ["tag1", "tag2"],
    fields: { custom: 1, nested: { custom: 2 } },
  })


  await async_test(
    "$and",
    () => sdk.api.endusers.getOne('', { $and: [{ fname: 'Test' }, { lname: 'Testson' }, { 'fields.custom': 1 }, { 'fields.nested.custom' : 2 } ] }),
    { onResult: e => e.id === enduser.id }
  ) 
  await async_test(
    "$and (list)",
    () => sdk.api.endusers.getSome({ mdbFilter: { $and: [{ fname: 'Test' }, { lname: 'Testson' }, { 'fields.custom': 1 }, { 'fields.nested.custom' : 2 }] } }),
    { onResult: e => e.length === 1 && e[0].id === enduser.id }
  ) 
  await async_test(
    "$and no match",
    () => sdk.api.endusers.getOne('', { $and: [{ fname: 'Not Test' }, { lname: 'Testson' }] }),
    handleAnyError
  ) 
  await async_test(
    "$and no match (list)",
    () => sdk.api.endusers.getSome({ mdbFilter: { $and: [{ fname: 'Not Test' }, { lname: 'Testson' }] } }),
    { onResult: e => e.length === 0 }
  ) 
  await async_test(
    "bad query",
    () => sdk.api.endusers.getOne('', { $bad: 'query' }),
    { shouldError: true, onError: e => e.message === `unknown top level operator: $bad. If you have a field name that starts with a '$' symbol, consider using $getField or $setField.` }
  ) 
  await async_test(
    "bad query (list)",
    () => sdk.api.endusers.getSome({ mdbFilter: { $bad: 'query' } }),
    { shouldError: true, onError: e => e.message === `unknown top level operator: $bad. If you have a field name that starts with a '$' symbol, consider using $getField or $setField.` }
  ) 

  return Promise.all([
    sdk.api.endusers.deleteOne(enduser.id),
    sdk.api.endusers.deleteOne(otherEnduser.id),
  ])
}

const uniqueness_tests = async () => {
  log_header("Uniqueness Tests")
  const email = "test@tellescope.com"
  const externalId = "12345"
  const dateOfBirth = "12-20-1997"

  const form = await sdk.api.forms.createOne({ title: 'test form for duplication', allowPublicURL: true })
  await sdk.api.form_fields.createOne({ formId: form.id, title: 'title', type: 'string', previousFields: [{ type: 'root', info: { }}]})

  const [eExternalId, other] = (await sdk.api.endusers.createSome([{ email, externalId }, { }])).created
  const eExternalIdOnUpdate = await sdk.api.endusers.createOne({ })

  await enduserSDK.api.form_responses.session_for_public_form({ businessId: form.businessId, formId: form.id, skipMatch: true, dateOfBirth })
  const enduserNoCreator = await sdk.api.endusers.getOne({ dateOfBirth })
  
  assert(enduserNoCreator.creator === null, 'creator null from public form', 'creator null from public form')

  await async_test(
    "Cannot create with duplicate externalId",
    () => sdk.api.endusers.createOne({ email: 'notaconflict2@tellescope.com', phone: "+15555555555", externalId }),
    { shouldError: true, onError: e => e.message === UniquenessViolationMessage }
  ) 

  await async_test(
    "Cannot update to set duplicate externalId",
    () => sdk.api.endusers.updateOne(eExternalIdOnUpdate.id, { email, phone: "+15555555555", externalId }, { replaceObjectFields: true }),
    { shouldError: true, onError: e => e.message === UniquenessViolationMessage }
  ) 

  await async_test(
    "Cannot update to set duplicate externalId",
    () => sdk.api.endusers.updateOne(enduserNoCreator.id, { email, phone: "+15555555555", externalId }, { replaceObjectFields: true }),
    { shouldError: true, onError: e => e.message === UniquenessViolationMessage }
  )

  await Promise.all([
    sdk.api.endusers.deleteOne(eExternalId.id),
    sdk.api.endusers.deleteOne(other.id),
    sdk.api.endusers.deleteOne(eExternalIdOnUpdate.id),
    sdk.api.endusers.deleteOne(enduserNoCreator.id),
    sdk.api.forms.deleteOne(form.id),
  ])

  // tests for _overrideUnique: true
  const e  = await sdk.api.endusers.createOne({ fname: "1", email, _overrideUnique: true })
  const e2 = await sdk.api.endusers.createOne({ fname: "2", email, _overrideUnique: true })
  const [e3, e4] = (await sdk.api.endusers.createSome([{ fname: "3", email }, { fname: "4", email }], { _overrideUnique: true })).created
  const eUpdate = await sdk.api.endusers.createOne({ fname: "5", })
  await sdk.api.endusers.updateOne(eUpdate.id, { email }, {}, true)

  await async_test(
    "Duplicates allowed via _overrideUnique: true",
    () => sdk.api.endusers.getSome({ filter: { email }}),
    { onResult: v => v.length === 5 }
  )

  await Promise.all([
    sdk.api.endusers.deleteOne(e.id),
    sdk.api.endusers.deleteOne(e2.id),
    sdk.api.endusers.deleteOne(e3.id),
    sdk.api.endusers.deleteOne(e4.id),
    sdk.api.endusers.deleteOne(eUpdate.id),
  ])
}

const input_modifier_tests = async () => {
  log_header("Input Modifiers")
  const e = await sdk.api.endusers.createOne({})

  await async_test(
    "Regular string",
    () => sdk.api.form_responses.createOne({ 
      enduserId: e.id,
      formId: PLACEHOLDER_ID,
      formTitle: "input modifiers",
      responses: [{
        fieldTitle: '',
        fieldId: '',
        answer: { type: 'string', value: 'hello' }
      }]
    }),
    { onResult: r => r.responses?.[0].answer.value === 'hello' }
  )
  await async_test(
    "Number coerce to string",
    () => sdk.api.form_responses.createOne({ 
      enduserId: e.id,
      formId: PLACEHOLDER_ID,
      formTitle: "input modifiers",
      responses: [{
        fieldTitle: '',
        fieldId: '',
        answer: { type: 'string', value: 55 as any }
      }]
    }),
    { onResult: r => r.responses?.[0].answer.value === '55' }
  )

  await Promise.all([
    sdk.api.endusers.deleteOne(e.id),
  ])
  await wait (undefined, 500) // allows for background deletion of form responses
}

const calendar_event_care_team_tests = async () => {
  log_header("Calendar Event Care Team Test")
  const e = await sdk.api.endusers.createOne({})
  const userId = sdk.userInfo.id

  const ev1 = await sdk.api.calendar_events.createOne({ 
    title: 'test', durationInMinutes: 60, startTimeInMS: Date.now(),
    attendees: [{ type: 'enduser', id: e.id }, { type: 'user', id: userId }], 
  })
  const ev2 = await sdk.api.calendar_events.createOne({ 
    title: 'test', durationInMinutes: 60, startTimeInMS: Date.now(),
    attendees: [{ type: 'enduser', id: e.id }], 
  })
  await async_test(
    `User assigned on event create`,
    () => pollForResults(
      () => sdk.api.endusers.getOne(e.id),
      e => !!e.assignedTo?.includes(userId),
      50,
      10,
    ),
    passOnAnyResult
  )  
  await sdk.api.endusers.updateOne(e.id, { assignedTo: [] }, { replaceObjectFields: true })

  await sdk.api.calendar_events.updateOne(ev2.id, { attendees: [{ type: 'user', id: userId }]})
  await async_test(
    `User assigned on add to event`,
    () => pollForResults(
      () => sdk.api.endusers.getOne(e.id),
      e => !!e.assignedTo?.includes(userId),
      50,
      10,
    ),
    passOnAnyResult
  )  
  await sdk.api.endusers.updateOne(e.id, { assignedTo: [] }, { replaceObjectFields: true })

  await sdk.api.calendar_events.updateOne(ev2.id, { title: "Updated title"})
  await async_test(
    `User not assinged on non-attendee event change`,
    () => pollForResults(
      () => sdk.api.endusers.getOne(e.id),
      e => !e.assignedTo?.includes(userId),
      1000,
      1,
    ),
    passOnAnyResult
  )  

  return Promise.all([
    sdk.api.endusers.deleteOne(e.id),
    sdk.api.calendar_events.deleteOne(ev1.id),
    sdk.api.calendar_events.deleteOne(ev2.id),
  ])
}

const ticket_tests = async () => {
  log_header("Ticket No Care Team Setting Tests")

  const organization = (await sdk.api.organizations.getSome()).find(o => o.id === sdk.userInfo.businessId)
  if (!organization) { throw new Error("Organization not found") }

  // set behavior for these tests
  await sdk.api.organizations.updateOne(organization.id, {
    settings: { tickets: { dontAddToCareTeamOnTicketAssignment: true } }
  })

  const e = await sdk.api.endusers.createOne({})
  const userId = sdk.userInfo.id

  // test tags as empty '' coereced to []
  // facilitates backwards compatible change to allow '' as a valid tags, but store as array so our system won't make mistakes
  const t = await sdk.api.tickets.createOne({ title: 'test', enduserId: e.id, owner: userId, tags: '' as any })
  await async_test(
    "Ticket tags coerced to empty array",
    () => sdk.api.tickets.getOne(t.id),
    { onResult: t => Array.isArray(t.tags) && t.tags.length === 0 }
  )

  await sdk.api.tickets.createOne({ title: 'test', enduserId: e.id, owner: userId })
  await wait(undefined, 1000) 
  await async_test(
    "Not on care team after ticket create",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !e.assignedTo?.includes(userId) }
  )
  
  const tOnwerOnUpdate = await sdk.api.tickets.createOne({ title: 'test', enduserId: e.id })
  await sdk.api.tickets.updateOne(tOnwerOnUpdate.id, { owner: userId })
  await wait(undefined, 1000) 
  await async_test(
    "Not on care team after ticket owner set",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !e.assignedTo?.includes(userId) }
  )
  
  const queue = await sdk.api.ticket_queues.createOne({ title: "Assignment Testing", userIds: [userId] })
  await sdk.api.tickets.createOne({ title: 'test', enduserId: e.id, queueId: queue.id }) 
  await sdk.api.tickets.assign_from_queue({ overrideRestrictions: true, queueId: queue.id, userId })
  await wait(undefined, 1000) 
  await async_test(
    "Not on care team after ticket pulled from queue",
    () => sdk.api.endusers.getOne(e.id),
    { onResult: e => !e.assignedTo?.includes(userId) }
  )

  // reset behavior to default for other tests
  await sdk.api.organizations.updateOne(organization.id, {
    settings: { tickets: { dontAddToCareTeamOnTicketAssignment: false } }
  })

  return Promise.all([
    sdk.api.endusers.deleteOne(e.id), 
    sdk.api.ticket_queues.deleteOne(queue.id),
  ])
}

const fromEmailOverride_tests = async () => {
  log_header("fromEmailOvrride")

  const enduser = await sdk.api.endusers.createOne({ email: 'test@tellescope.com' })

  await async_test(
    "fromEmailOverride missing",
    () => sdk.api.emails.createOne({ 
      logOnly: true,
      subject: 'test',
      enduserId: enduser.id,
      textContent: '',
    }),
    passOnAnyResult
  )
  await async_test(
    "fromEmailOverride missing bulk",
    () => sdk.api.emails.createSome([{ 
      logOnly: true,
      subject: 'test',
      enduserId: enduser.id,
      textContent: '',
    }]),
    passOnAnyResult
  )
  await async_test(
    "fromEmailOverride My Email",
    () => sdk.api.emails.createOne({ 
      logOnly: true,
      subject: 'test',
      enduserId: enduser.id,
      textContent: '',
      fromEmailOverride: "My Email"
    }),
    passOnAnyResult
  )
  await async_test(
    "fromEmailOverride My Email (bulk)",
    () => sdk.api.emails.createSome([{ 
      logOnly: true,
      subject: 'test',
      enduserId: enduser.id,
      textContent: '',
      fromEmailOverride: "My Email"
    }]),
    passOnAnyResult
  )
  await async_test(
    "fromEmailOverride test@",
    () => sdk.api.emails.createOne({ 
      logOnly: true,
      subject: 'test',
      enduserId: enduser.id,
      textContent: '',
      fromEmailOverride: "test@tellescope.com"
    }),
    passOnAnyResult
  )
  await async_test(
    "fromEmailOverride test@ bulk",
    () => sdk.api.emails.createSome([{ 
      logOnly: true,
      subject: 'test',
      enduserId: enduser.id,
      textContent: '',
      fromEmailOverride: "test@tellescope.com"
    }]),
    passOnAnyResult
  )
  await async_test(
    "fromEmailOverride fail@",
    () => sdk.api.emails.createOne({ 
      logOnly: true,
      subject: 'test',
      enduserId: enduser.id,
      textContent: '',
      fromEmailOverride: "fail@tellescope.com"
    }),
    handleAnyError
  )
  await async_test(
    "fromEmailOverride fail@ bulk",
    () => sdk.api.emails.createSome([{ 
      logOnly: true,
      subject: 'test',
      enduserId: enduser.id,
      textContent: '',
      fromEmailOverride: "fail@tellescope.com"
    }]),
    handleAnyError
  )


  return await Promise.all([
    sdk.api.endusers.deleteOne(enduser.id)
  ])
}

const date_parsing_tests = () => {
  log_header("Date Parsing Tests")

  assert(YYYY_MM_DD_to_MM_DD_YYYY('') === '', 'YYYY_MM_DD_to_MM_DD_YYYY fails', 'YYYY_MM_DD_to_MM_DD_YYYY empty string')
  assert(YYYY_MM_DD_to_MM_DD_YYYY(undefined!) === '', 'YYYY_MM_DD_to_MM_DD_YYYY fails', 'YYYY_MM_DD_to_MM_DD_YYYY undefined')
  assert(YYYY_MM_DD_to_MM_DD_YYYY(null!) === '', 'YYYY_MM_DD_to_MM_DD_YYYY fails', 'YYYY_MM_DD_to_MM_DD_YYYY null')
  assert(YYYY_MM_DD_to_MM_DD_YYYY('2024-07-09') === '07-09-2024', 'YYYY_MM_DD_to_MM_DD_YYYY fails', 'YYYY_MM_DD_to_MM_DD_YYYY')
}

const test_form_response_search = async () => {
  log_header("Form Response Search Tests")

  const f = await sdk.api.forms.createOne({ title: 'KEYWORD for search', allowPublicURL: true })
  const e = await sdk.api.endusers.createOne({ email: 'test@tellescope.com' })

  const fr = await sdk.api.form_responses.prepare_form_response({
    enduserId: e.id,
    formId: f.id,
  })
  await sdk.api.form_responses.submit_form_response({
    accessCode: fr.accessCode,
    responses: [
      {
        fieldId: '',
        fieldTitle: 'unsearchable',
        answer: {
          type: 'string',
          value: 'unsearchable',
        }
      }
    ],
  })


  await async_test(
    "Search for searchable title",
    () => sdk.api.form_responses.getSome({ search: { query: 'KEYWORD' } }),
    { onResult: r => r.length === 1 },
  )
  await async_test(
    "Search for searchable title (case sensitivity)",
    () => sdk.api.form_responses.getSome({ search: { query: 'kEYWORD' } }),
    { onResult: r => r.length === 0 },
  )

  await async_test(
    "Search for email",
    () => sdk.api.form_responses.getSome({ search: { query: 'test@tellescope.com' } }),
    { onResult: r => r.length === 1 },
  )

  await async_test(
    "Search for unsearchable field",
    () => sdk.api.form_responses.getSome({ search: { query: 'unsearchable' } }),
    { onResult: r => r.length === 0 },
  )

  return await Promise.all([
    sdk.api.forms.deleteOne(f.id),
    sdk.api.endusers.deleteOne(e.id),
  ])
}

const get_templated_message_tests = async () => {
  log_header("Get Templated Message Tests")

  const enduser = await sdk.api.endusers.createOne({ fname: "Main", fields: { CustomField: "Enduser" } })
  const related = await sdk.api.endusers.createOne({ lname: "Related", fields: { OtherCustomField: "Contact" } })
  const form = await sdk.api.forms.createOne({ title: 'test form for templated message' })
  
  await async_test(
    "Fields are templated correctly for enduser and relatedcontact",
    () => sdk.api.templates.get_templated_message({
      enduserId: enduser.id,
      relatedContactId: related.id,
      channel: 'Chat',
      message: `Hello {name}{{enduser.fname}}{{enduser.lname}}{{enduser.CustomField}}{{enduser.OtherCustomField}}{{relatedcontact.fname}}{{relatedcontact.lname}}{{relatedcontact.OtherCustomField}} goodbye`,
      userId: sdk.userInfo.id,
    }),
    { onResult: 
      r => r.plaintext === `Hello MainMainEnduserRelatedContact goodbye` 
    }
  )

  await async_test(
    "{{organization.name}}",
    () => sdk.api.templates.get_templated_message({
      enduserId: enduser.id,
      relatedContactId: related.id,
      channel: 'Chat',
      message: `{{organization.name}}`,
      userId: sdk.userInfo.id,
    }),
    { onResult: 
      r => r.plaintext === `Tellescope` 
    }
  )

  await async_test(
    "Unformatted link",
    () => sdk.api.templates.get_templated_message({
      enduserId: enduser.id,
      channel: 'Email',
      message: `https://www.tellescope.com`,
      html: `https://www.tellescope.com`,
      userId: sdk.userInfo.id,
    }),
    { 
      onResult: r => (
        r.plaintext === 'https://www.tellescope.com'
      && r.html === 'https://www.tellescope.com'
      )
    }
  )

  await async_test(
    "link format",
    () => sdk.api.templates.get_templated_message({
      enduserId: enduser.id,
      channel: 'Email',
      message: `{https://www.tellescope.com}[click here]`,
      html: `{https://www.tellescope.com}[click here]`,
      userId: sdk.userInfo.id,
    }),
    { onResult: 
      r => (
         r.plaintext.includes('/r/') && r.plaintext.includes('click here') 
      && r.html.includes('/r/') && r.html.includes('<a') && r.html.includes('click here') && r.html.includes("</a>")
      )
    }
  )
  await async_test(
    "plain $LINK_ONLY",
    () => sdk.api.templates.get_templated_message({
      enduserId: enduser.id,
      channel: 'Email',
      message: `{https://www.tellescope.com}[$LINK_ONLY]`,
      html: `{https://www.tellescope.com}[$LINK_ONLY]`,
      userId: sdk.userInfo.id,
    }),
    { onResult: 
      r => (
         r.plaintext.includes('/r/') && !r.plaintext.includes('$LINK_ONLY') 
      && r.html.includes('/r/') && !r.html.includes('$LINK_ONLY')
      )
    }
  )

  await async_test(
    "form link",
    () => sdk.api.templates.get_templated_message({
      enduserId: enduser.id,
      channel: 'Email',
      message: `{{forms.${form.id}.link:click here}}`,
      html: `{{forms.${form.id}.link:click here}}`,
      userId: sdk.userInfo.id,
    }),
    { onResult: 
      r => (
        r.plaintext.includes('/r/') && r.plaintext.includes('click here')
        && r.html.includes('/r/') && r.html.includes('<a') && r.html.includes('click here') && r.html.includes("</a>")
      )
    }
  )
  await async_test(
    "form $LINK_ONLY",
    () => sdk.api.templates.get_templated_message({
      enduserId: enduser.id,
      channel: 'Email',
      message: `{{forms.${form.id}.link:$LINK_ONLY}}`,
      html: `{{forms.${form.id}.link:$LINK_ONLY}}`,
      userId: sdk.userInfo.id,
    }),
    { onResult: 
      r => (
        r.plaintext.includes('/r/') && !r.plaintext.includes('$LINK_ONLY')
        && r.html.includes('/r/') && !r.html.includes('$LINK_ONLY')
      )
    }
  )

  await Promise.all([
    sdk.api.endusers.deleteOne(enduser.id),
    sdk.api.endusers.deleteOne(related.id),
    sdk.api.forms.deleteOne(form.id),
  ])
}

const file_source_tests = async () => { 
  log_header("File Source Tests")

  const { file: f } = await sdk.api.files.prepare_file_upload({
    name: 'test',
    type: 'application/pdf',
    size: 100,
    source: 'test'
  })

  await async_test(
    "No filter returns value",
    () => sdk.api.files.getSome({ }),
    { onResult: r => r.length === 1 && r[0].id === f.id }
  )
  await async_test(
    "Filter by source returns value",
    () => sdk.api.files.getSome({ filter: { source: 'test' } }),
    { onResult: r => r.length === 1 && r[0].id === f.id }
  )
  await async_test(
    "Filter by differnt source returns no value",
    () => sdk.api.files.getSome({ filter: { source: 'other' } }),
    { onResult: r => r.length === 0 }
  )

  await sdk.api.files.deleteOne(f.id)
}

const updatedAt_tests = async () => {
  log_header("UpdatedAt Tests")

  const e = await sdk.api.endusers.createOne({ fname: 'Test', lname: 'Testson' })
  await wait(undefined, 500) // some background stuff may run and change updatedAt again

  const original = new Date((await sdk.api.endusers.getOne(e.id)).updatedAt) // may slightly differ from what's returned on creation

  await wait(undefined, 500)
  await async_test(
    "updatedAt doesn't change with a non-log update",
    () => sdk.api.endusers.updateOne(e.id, { recentViewers: [{ at: new Date(), id: sdk.userInfo.id }] }, { replaceObjectFields: true }),
    {
      onResult: e => {
        const updatedAt = new Date(e.updatedAt)
        console.log('updatedAt', updatedAt, 'original', original)
        return updatedAt.getTime() === original.getTime()
      }
    }
  )
  await async_test(
    'get to verify that updatedAt is not changed',
    () => sdk.api.endusers.getOne(e.id),
    {
      onResult: e => {
        const updatedAt = new Date(e.updatedAt)
        return updatedAt.getTime() === original.getTime()
      }
    }
  )

  await async_test(
    "updatedAt changes with a log update",
    () => sdk.api.endusers.updateOne(e.id, { fname: 'Test2' }, { replaceObjectFields: true }),
    {
      onResult: e => {
        const updatedAt = new Date(e.updatedAt)
        return updatedAt.getTime() > original.getTime()
      }
    }
  )
  await async_test(
    'get to verify that updatedAt is changed',
    () => sdk.api.endusers.getOne(e.id),
    {
      onResult: e => {
        const updatedAt = new Date(e.updatedAt)
        return updatedAt.getTime() > original.getTime()
      }
    }
  )

  await Promise.all([
    sdk.api.endusers.deleteOne(e.id),
  ])
}

const replace_enduser_template_values_tests = async () => {
  log_header("Replace Enduser Template Values Tests")

  const enduser = await sdk.api.endusers.createOne({ fname: "Test", lname: "User", fields: { CustomField: "Enduser" } })

  assert(replace_enduser_template_values('', enduser) === '', 'fail blank', 'blank')
  assert(replace_enduser_template_values('test', enduser) === 'test', 'fail test', 'test')
  assert(replace_enduser_template_values('{{enduser.fname}}', enduser) === 'Test', 'fail fname', 'fname')
  assert(replace_enduser_template_values('{{enduser.unknown}}', enduser) === '{{enduser.unknown}}', 'fail unknown', 'unknown')
  assert(replace_enduser_template_values('{{enduser.CustomField}}', enduser) === 'Enduser', 'fail CustomField', 'CustomField')
  assert(replace_enduser_template_values('{{enduser.UnknownCustomField}}', enduser) === '{{enduser.UnknownCustomField}}', 'fail UnknownCustomField', 'UnknownCustomField')

  const d = Date.now()
  assert(replace_enduser_template_values(d as any, enduser) === d as any, 'fail non-string', 'non-string')

  await sdk.api.endusers.deleteOne(enduser.id)
}

const inbox_loading_tests = async () => {
  log_header("Inbox Loading Tests")
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
    await sdk.api.users.createOne({ email: roleTestUserEmail })
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


  await Promise.all([
    sdk.api.endusers.deleteOne(e.id),
    sdk.api.endusers.deleteOne(e2.id),
    sdk.api.chat_rooms.deleteOne(room.id),
    sdk.api.role_based_access_permissions.deleteOne(noAccessRole.id),
    sdk.api.role_based_access_permissions.deleteOne(defaultAccessRole.id),
    sdk.api.users.deleteOne(roleTestUser.id),
  ])
}

const get_next_reminder_timestamp_tests = () => {
  log_header("Get Next Reminder Timestamp Tests")

  const startTimeInMS = Date.now()
  assert(
    get_next_reminder_timestamp({ attendees: [], startTimeInMS }) === -1,
    'invalid get_next_reminder_timestamp',
    'get_next_reminder_timestamp with no attendees, no reminders'
  )

  assert(
    get_next_reminder_timestamp({ attendees: [], startTimeInMS, reminders: [] }) === -1,
    'invalid get_next_reminder_timestamp',
    'get_next_reminder_timestamp with no attendees, empty reminders'
  )

  assert(
    get_next_reminder_timestamp({ attendees: [], startTimeInMS, 
      reminders: [{ type: 'Remove From Journey', info: { journeyId: PLACEHOLDER_ID }, msBeforeStartTime: 0, didRemind: true } ] 
    }) === -1,
    'invalid get_next_reminder_timestamp',
    'get_next_reminder_timestamp with no attendees, didRemind true'
  )

  assert(
    get_next_reminder_timestamp({ attendees: [], startTimeInMS, 
      reminders: [{ type: 'add-to-journey', info: { journeyId: PLACEHOLDER_ID }, msBeforeStartTime: 0 } ] 
    }) === -1,
    'invalid get_next_reminder_timestamp',
    'get_next_reminder_timestamp with no attendees, add-to-journey no attendees'
  )

  assert(
    get_next_reminder_timestamp({ attendees: [], startTimeInMS, 
      reminders: [{ type: 'Remove From Journey', info: { journeyId: PLACEHOLDER_ID }, msBeforeStartTime: 0 } ] 
    }) === startTimeInMS,
    'invalid get_next_reminder_timestamp',
    'get_next_reminder_timestamp with no attendees, Remove From Journey'
  )

  assert(
    get_next_reminder_timestamp({ attendees: [{ id: '', type: 'enduser' }], startTimeInMS, 
      reminders: [{ type: 'add-to-journey', info: { journeyId: PLACEHOLDER_ID }, msBeforeStartTime: 0 } ] 
    }) === startTimeInMS,
    'invalid get_next_reminder_timestamp',
    'get_next_reminder_timestamp with no attendees, add-to-journey with attendees',
  )
  
  assert(
    get_next_reminder_timestamp({ attendees: [{ id: '', type: 'enduser' }], startTimeInMS, 
      reminders: [{ type: 'add-to-journey', info: { journeyId: PLACEHOLDER_ID }, msBeforeStartTime: 0 } ] 
    }) === startTimeInMS,
    'invalid get_next_reminder_timestamp',
    'get_next_reminder_timestamp with no attendees, Remove from Journey with attendees',
  )

  assert(
    get_next_reminder_timestamp({ attendees: [{ id: '', type: 'enduser' }], startTimeInMS, 
      reminders: [{ type: 'add-to-journey', info: { journeyId: PLACEHOLDER_ID }, msBeforeStartTime: -1000 } ] 
    }) === startTimeInMS + 1000,
    'invalid get_next_reminder_timestamp',
    'get_next_reminder_timestamp with no attendees, start time in future',
  )

  assert(
    get_next_reminder_timestamp({ attendees: [{ id: '', type: 'enduser' }], startTimeInMS, 
      reminders: [{ type: 'add-to-journey', info: { journeyId: PLACEHOLDER_ID }, msBeforeStartTime: 1000 } ] 
    }) === startTimeInMS - 1000,
    'invalid get_next_reminder_timestamp',
    'get_next_reminder_timestamp with no attendees, start time in past',
  )

  assert(
    get_next_reminder_timestamp({ attendees: [{ id: '', type: 'enduser' }], startTimeInMS, 
      reminders: [
        { type: 'add-to-journey', info: { journeyId: PLACEHOLDER_ID }, msBeforeStartTime: 1000 },
        { type: 'add-to-journey', info: { journeyId: PLACEHOLDER_ID }, msBeforeStartTime: -3000 },
        { type: 'add-to-journey', info: { journeyId: PLACEHOLDER_ID }, msBeforeStartTime: -5000 },
      ] 
    }) === startTimeInMS - 1000,
    'invalid get_next_reminder_timestamp',
    'get_next_reminder_timestamp with no attendees multiple reminders',
  )
}

const ip_address_form_tests = async () => {
  log_header("IP Address Form Tests")

  const form = await sdk.api.forms.createOne({
    title: 'IP Address Form Test',
    allowPublicURL: true,
    ipAddressCustomField: 'IP'
  })
  // form (may) need at least 1 question for future endpoints to work
  await sdk.api.form_fields.createOne({
    formId: form.id,
    title: 'IP Address Field',
    type: 'description',
    previousFields: [{ type: 'root', info: { }}]
  })

  const enduserSDKPublic = new EnduserSession({ host, businessId: form.businessId })
  const { enduserId} = await enduserSDKPublic.api.form_responses.session_for_public_form({
    formId: form.id,
    businessId: form.businessId,
    email: 'test@tellescope.com',
    phone: '+15555555555',
    fname: 'session',
    lname: 'test',
  })

  await wait(undefined, 500) // wait for IP to be set
  async_test(
    'IP Set on Enduser creation',
    () => sdk.api.endusers.getOne(enduserId),
    { onResult: result => !!result.fields?.IP }
  )

  // clear ip and set other field to make sure IP doesn't overwrite other custom fields
  await sdk.api.endusers.updateOne(enduserId, { fields: { otherField: "Set" } }, { replaceObjectFields: true }) 

  // should match and update in place
  await enduserSDKPublic.api.form_responses.session_for_public_form({
    formId: form.id,
    businessId: form.businessId,
    email: 'test@tellescope.com',
    phone: '+15555555555',
    fname: 'session',
    lname: 'test',
  })

  async_test(
    'IP Set on update',
    () => sdk.api.endusers.getOne(enduserId),
    { onResult: result => !!result.fields?.IP && result.fields?.otherField === 'Set' && result.id === enduserId }
  )

  await Promise.all([
    sdk.api.forms.deleteOne(form.id),
    sdk.api.endusers.deleteOne(enduserId),
  ])
}

(async () => {
  log_header("API")

  await async_test(
    "email-image tracking endpoint is live",
    () => axios.get('http://localhost:8080/email-image/'),
    { onResult: result => result.data === TRACK_OPEN_IMAGE.toString('utf-8')}
  ) 

  try {
    get_next_reminder_timestamp_tests()
    form_conditional_logic_tests()

    await test_weighted_round_robin()

    await validate_schema()

    const fields = get_flattened_fields([
      { otherField: '', insurance: { payerName: '' }, },
      { insurance: { payerName: '' }, },
      { insurance: {}, insuranceSecondary: {}, },
      { insurance: {}, insuranceSecondary: { memberId: '' }, },
    ])
    assert(objects_equivalent(fields, ['otherField', 'insurance.payerName', 'insuranceSecondary.memberId']), 'flattened object fields fail', 'flattened object fields')

    await Promise.all([
      sdk.authenticate(email, password),
      sdkSub.authenticate(subUserEmail, password),
      sdkOtherSub.authenticate(otherSubUserEmail, password),
      sdkSubSub.authenticate(subSubUserEmail, password),
      sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword),
    ]) 

    await async_test(
      'Nested error message',
      () => sdk.api.endusers.createOne({ bookingNotes: [{ note: 'optional note' } as any]}),
      { shouldError: true, onError: e => e.message === 'Value not provided for required field: bookingNotes.bookingPageId'}
    )
    await async_test(
      'Nested error message',
      () => sdk.api.endusers.createOne({ weight: { unit: undefined as any, value: 10 }}),
      { shouldError: true, onError: e => e.message === 'Value not provided for required field: weight.unit'}
    )
    // await async_test(
    //   'Nested error message?',
    //   () => sdk.api.form_responses.createOne({ 
    //       enduserId: PLACEHOLDER_ID,
    //       formId: PLACEHOLDER_ID,
    //       formTitle: 'test',
    //       responses: [
    //         {
    //           'fieldId': '113', 
    //           'fieldTitle': 'Thanks! Could you share a few more details about your insurance plan with us, please?',
    //           answer: {
    //             type: "Table Input",
    //             value: [
    //               []
    //             ]
    //           }

    //         },
    //       ]
    //   }),
    //   passOnAnyResult
    // )

    await async_test(
      "Uniqueness violation redacts sensitive existing record details",
      () => sdk.api.users.createOne({ email }),
      { 
        shouldError: true, 
        onError: e => (
          e.message === "Uniqueness Violation"
        && Object.keys((e.info as any)?.[0]?.conflictingFields).length === 1
        && (e.info as any)?.[0]?.conflictingFields.email === email
        && Object.keys((e.info as any)?.[0]?.existingRecord).length === 2 // only _id and businessId should be exposed
        && (e.info as any)?.[0]?.existingRecord?._id
        && (e.info as any)?.[0]?.existingRecord?.businessId
        )
      }
    )

    // console.log(JSON.stringify(await sdk.bulk_load({ load: [{ model: 'users' }]}), null, 2))
 
    await async_test(
      "email validation error message",
      // @ts-ignore
      () => sdk.api.endusers.createOne({ email: 'not-an-email' }),
      { shouldError: true, onError: e => e.message === 'Error parsing field email: Invalid email: not-an-email' }
    ) 

    await async_test(
      "count exists",
      // @ts-ignore
      () => sdk.api.endusers.getSome({ returnCount: true }),
      { onResult: result => typeof (result as any).count === 'number' }
    ) 

    await async_test(
      "push_to_EHR allows missing addedResponses",
      () => sdk.api.form_responses.push_to_EHR({ id: PLACEHOLDER_ID }),
      { shouldError: true, onError: e => { return e?.message === 'Could not find a record for the given id' } }
    ) 

    await async_test(
      "Support phone numbers from Gambia",
      () => sdk.api.endusers.createOne({ phone: "+2201231234" }),
      { onResult: (e => !!sdk.api.endusers.deleteOne(e.id)) },
    ) 


    await enduser_conditional_logic_tests()
    await replace_enduser_template_values_tests()
    await mfa_tests()
    await setup_tests()
    await inbox_loading_tests()
    await auto_reply_tests()
    await relationships_tests()
    await rate_limit_tests()
    await ip_address_form_tests()
    await bulk_update_tests()
    await formsort_tests()
    await cancel_upcoming_appointments_journey_action_test()
    await multi_tenant_tests() // should come right after setup tests
    await sync_tests_with_access_tags() // should come directly after setup to avoid extra sync values
    await sync_tests() // should come directly after setup to avoid extra sync values
    await get_templated_message_tests()
    await updatedAt_tests()
    await automation_trigger_tests()
    await file_source_tests()
    await enduser_access_tags_tests()
    await enduserAccessTests()
    await test_form_response_search()
    await date_parsing_tests()
    await fromEmailOverride_tests()
    await ticket_tests()
    await uniqueness_tests()
    await enduser_orders_tests()
    await calendar_event_care_team_tests()
    await merge_enduser_tests()
    await input_modifier_tests()
    await switch_to_related_contacts_tests()
    await redaction_tests()
    await self_serve_appointment_booking_tests()
    await no_chained_triggers_tests()
    await mdb_filter_tests()
    await test_ticket_automation_assignment_and_optimization()
    await superadmin_tests()
    await ticket_queue_tests()
    await vital_trigger_tests()
    await close_reasons_no_duplicates_tests()
    await register_as_enduser_tests()
    await lockout_tests()
    await delete_user_tests()
    // await test_send_with_template()
    await bulk_read_tests()
    await ticket_reminder_tests()
    await marketing_email_unsubscribe_tests()
    await unique_strings_tests()
    await alternate_phones_tests()
    await role_based_access_tests()
    await enduser_session_tests()
    await nextReminderInMS_tests()
    await search_tests()
    await wait_for_trigger_tests()
    await pdf_generation()
    await remove_from_journey_on_incoming_comms_tests().catch(console.error) // timing is unreliable, uncomment if changing logic
    await sub_organization_enduser_tests()
    await sub_organization_tests()
    await filter_by_date_tests()
    await generate_user_auth_tests()
    await generateEnduserAuthTests()
    await public_form_tests()
    await badInputTests()
    await filterTests()
    await updatesTests()
    await threadKeyTests()
  } catch(err: any) {
    console.error("Failed during custom test")
    if (err.message && err.info) {
      console.error(err.message, JSON.stringify(err.info, null, 2))
    } else {
      console.error(err)
    }
    process.exit(1)
  }


  let n: keyof typeof schema;
  for (n in schema) {
    const returnValidation = (schema[n].customActions as any)?.create?.returns

    await run_generated_tests({
      queries: sdk.api[n] as any, 
      model: schema[n] as any, 
      name: n as any,
      returns: {
        create: returnValidation as any// ModelFields<ClientModel>,
      }
    })
  }

  let t: keyof typeof tests
  for (t in tests) {
    try {
      await tests[t]()  
    } catch(err) {
      console.error("Error running test:")
      console.error(err)
      process.exit(1)
    }
  }

  process.exit()
})()