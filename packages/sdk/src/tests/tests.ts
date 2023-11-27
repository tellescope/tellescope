require('source-map-support').install();
import axios from "axios"
import crypto from "crypto"
import * as buffer from "buffer" // only node >=15.7.0

import {
  Enduser,
  ClientModelForName,
  ClientModelForName_required,
  UserDisplayInfo,
} from "@tellescope/types-client"
import { 
  FormResponseValue,
  ModelName,
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
import {  } from "@tellescope/utilities"
import { DEFAULT_OPERATIONS, PLACEHOLDER_ID } from "@tellescope/constants"
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

const UniquenessViolationMessage = 'Uniqueness Violation'

const host = process.env.TEST_URL || 'http://localhost:8080'
const [email, password] = [process.env.TEST_EMAIL, process.env.TEST_PASSWORD]
const [mfaEmail, mfaPassword] = [process.env.MFA_EMAIL, process.env.TEST_PASSWORD]
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

  // reset nonAdmin role to a default non-admin
  await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: ['Non-Admin'] }, { replaceObjectFields: true }),

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
  await subEnduserSDK.register({ email: 'sub@tellescope.com', password })
  await enduserSDK.authenticate('root@tellescope.com', password)
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
  || name === 'referral_providers'
  || name === 'webhooks'
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
  assert(roomWithMessage?.infoForUser?.[userId]?.unreadCount === undefined, 'bad unread count for user', 'unread count for user')
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

  await sdk.api.tickets.deleteOne(ticketAccessible.id)
  await sdk.api.tickets.deleteOne(ticketInaccessible.id)
  await sdk.api.endusers.deleteOne(enduser.id)
  await sdk.api.endusers.deleteOne(enduser2.id)
}

const files_tests = async () => {
  log_header("Files")
  const enduser = await sdk.api.endusers.createOne({ email })
  await sdk.api.endusers.set_password({ id: enduser.id, password }).catch(console.error)
  await enduserSDK.authenticate(email, password).catch(console.error)

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
  await wait(undefined, 2250) // wait for tickets to be automatically created

  await async_test(
    `Tickets automatically created`,
    () => sdk.api.tickets.getSome(),
    { onResult: tickets => tickets?.length === 2 }
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
    sdk.api.tickets.deleteOne(ticket.id),
    sdk.api.tickets.deleteOne(ticketNull.id),
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

  await wait(undefined, 4 * TEST_DELAY) // wait long enough for automation to process and delay to pass
  await async_test(
    `Sequenced action triggered`,
    () => sdk.api.endusers.getOne(enduser.id),
    { onResult: e => e.journeys?.[journey.id] === 'Delayed Step' }
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
  await wait(undefined, 4000) // allow background creation with generous pause
  await async_test(
    `formUnsubmitted event with short delay is triggered`,
    () => sdk.api.endusers.getOne(enduser.id),
    { onResult: e => e?.journeys?.[journey.id] === 'triggered again' }
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
    () => sdk.api.endusers.getOne(enduser.id),
    { onResult: e => e?.journeys?.[journey.id] === 'formsSubmitted' }
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

  // allow fast followup to trigger
  await wait(undefined, 5000) // allow background creation with generous pause

  await async_test(
    `formsUnsubmitted handler worked`,
    () => sdk.api.endusers.getOne(enduser.id),
    { onResult: e => e?.journeys?.[journey.id] === 'triggered' }
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

  await wait(undefined, 4000) // allow onJourneyStart step to trigger
  await sdk.api.endusers.add_to_journey({ enduserIds: [enduser.id], journeyId: journey.id })

  await async_test(
    `Enduser throttle journey add working`,
    () => sdk.api.endusers.add_to_journey({ enduserIds: [enduser.id], journeyId: journey.id, throttle: true }),
    handleAnyError
  )

  await wait(undefined, 4000) // allow onJourneyStart step to trigger

  await async_test(
    `Enduser correctly added and re-added`,
    () => sdk.api.automated_actions.getSome(),
    { onResult: es => es.length === 4
      && es.filter(e => e.status === 'cancelled' && e.automationStepId === follow.id).length === 1 // one afterAction is cancelled
      && es.filter(e => e.status === 'active' && e.automationStepId === follow.id).length === 1 // one afterAction is still active
      && es.filter(e => e.status === 'finished' && e.automationStepId === root.id).length === 2 // two initial onJourneyStart
    }
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

  await wait(undefined, 3000)  

  await async_test(
    `Enduser status set by manual automated action`,
    () => sdk.api.endusers.getOne(enduser.id),
    { onResult: e => e.journeys?.[PLACEHOLDER_ID] === 'Working' }
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

const automation_trigger_tests = async () => {
  log_header("Automation Trigger Tests")

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
    sdk.api.tickets.deleteOne(adminTicket.id),
    sdk.api.tickets.deleteOne(ticketCreatedByNonAdmin.id),
    sdk.api.emails.deleteOne(email.id),
    sdk.api.sms_messages.deleteOne(sms.id),
    sdk.api.calendar_events.deleteOne(calendarEvent.id),
    sdk.api.chat_rooms.deleteOne(chatRoom.id),
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

const enduser_redaction_tests = async () => {
  log_header("Enduser Redaction")

  const enduser = await sdk.api.endusers.createOne({ email })
  const enduserOther = await sdk.api.endusers.createOne({ email: 'otherenduser@tellescope.com' })
  await sdk.api.endusers.set_password({ id: enduser.id, password }).catch(console.error)
  await enduserSDK.authenticate(email, password).catch(console.error)  

  const endusers = await enduserSDK.api.endusers.getSome()
  assert(endusers.length > 0, "enduser can't fetch others", "enduser get others successful")

  const redactedFields = (
    Object.keys(schema.endusers.fields)
    .filter(f => schema.endusers.fields[f as keyof typeof schema.endusers.fields]?.redactions?.includes('enduser'))
  )
  assert(redactedFields.length > 0, 'no redacted fields', 'redacted fields exists')

  assert(
    endusers.find(e => redactedFields.filter(f => !!e[f as keyof typeof e]).length > 0) === undefined,
    'got redacted data',
    'data correctly redacted',
  )

  await Promise.all([
    sdk.api.endusers.deleteOne(enduser.id),
    sdk.api.endusers.deleteOne(enduserOther.id),
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
    () => enduserSDK.api.form_responses. session_for_public_form(submitInfoNonPublic),
    handleAnyError,
  )
  await async_test(
    'no questions form blocked',
    () => enduserSDK.api.form_responses. session_for_public_form(submitInfo),
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
  const responseInfo = await enduserSDK.api.form_responses. session_for_public_form(submitInfo)

  // verify enduser is actually upserted
  const enduser = await sdk.api.endusers.getOne({ email: 'publicformtest@tellescope.com'})

  // test case for existing enduser
  await enduserSDK.api.form_responses. session_for_public_form(submitInfo)

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

  await Promise.all([
    sdk.api.forms.deleteOne(form.id),
    sdk.api.journeys.deleteOne(journey.id),
    sdk.api.endusers.deleteOne(enduser.id),
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
  assert(userRSVP.displayName === sdk.userInfo.fname ?? '', 'display name init bad', 'display name init')
  
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
  await sdk.api.endusers.set_password({ id: e1.id, password })
  await sdk.api.endusers.set_password({ id: e2.id, password })
  
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
        console.log(user1block1_ET.startTimeInMS, user2block1_PT.startTimeInMS, user1block1_ET.startTimeInMS - user2block1_PT.startTimeInMS)
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

  await Promise.all([
    sdk.api.endusers.deleteOne(e1.id),
    sdk.api.endusers.deleteOne(e2.id),
    sdk.api.calendar_event_templates.deleteOne(event30min.id),
    sdk.api.calendar_event_templates.deleteOne(event15min.id),
    sdk.api.calendar_events.deleteOne(bookedAppointment.id),
    sdk.api.calendar_events.deleteOne(conflict.id),
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
  await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [noEnduserAccessRole] }, { replaceObjectFields: true }),
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
  await Promise.all([
    sdk.api.role_based_access_permissions.deleteOne(rbap.id),
    sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: ['Non-Admin'] }, { replaceObjectFields: true }),
  ])
  await sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword) // to use new role, handle logout on role change
}

// runs tests and resets availability afterwards
// creates a new enduser (to avoid duplicate autoreply)
const run_autoreply_test = async (title: string, { expectingAutoreply } : { expectingAutoreply: boolean }) => {
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
  await wait (undefined, 50)
  await async_test(
    'Main test',
    () => sdk.api.chats.getSome({ filter: { roomId: room.id }}),
    { onResult: cs => (
      expectingAutoreply
        ? cs.length === 3
        : cs.length === 2
    ) }
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
      weeklyAvailabilities: []
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
  }, { replaceObjectFields: true })

  log_header("Autoreply (Organization-wide)")
  await run_autoreply_test('No availabilities', { expectingAutoreply: false })

  const today = new Date()

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

  const [source, destination, otherEnduser] = (await sdk.api.endusers.createSome([
    { email: 'source@tellescope.com', fname: 'source', lname: 'enduser' },
    { email: 'destination@tellescope.com'},
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
  await wait(undefined, 3000)
  
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
  await wait(undefined, 150)
  await async_test(
    "Trigger did not fire while not journey",
    () => sdk.api.automation_triggers.getOne(trigger.id),
    handleAnyError
  )

  // double-check that wait for trigger step triggers were deleted
}


const handleRateLimitError = { shouldError: true, onError: (e: { message: string }) => e.message === 'Rate limit exceeded'}
const rate_limit_tests = async () => {
  log_header("Rate Limits")

  const [e1, e2] = (await sdk.api.endusers.createSome([
    { fname: '1', email: 'e1@tellescope.com', phone: '+15555555555' },
    { fname: '2', email: 'e2@tellescope.com', phone: '+15555555555' },
  ])).created

  await async_test(
    "Same template email rate limit 1-per-minute",
    () => sdk.api.emails.createSome([
      { logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', templateId: PLACEHOLDER_ID },
      { logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', templateId: PLACEHOLDER_ID },
    ]),
    handleRateLimitError
  )

  // these should work, as 1 each is safe
  const [email1, email2] = (await sdk.api.emails.createSome([
    { logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', templateId: PLACEHOLDER_ID },
    { logOnly: true, enduserId: e2.id, subject: 'ratelimit', textContent: 'rate limit', templateId: PLACEHOLDER_ID },
  ])).created
  // already has 1 created 
  await async_test(
    "Same enduser rate limit 5 per 5 seconds",
    () => sdk.api.emails.createSome([
      { logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', },
      { logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', },
      { logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', },
      { logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', },
      { logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit' },
    ]),
    handleRateLimitError
  )

  await wait(undefined, 2500) // give it some time before trying again, to ensure still blocked after 2.5 < 60 seconds
  await async_test(
    "Same template email rate limit 1-per-minute after creating",
    () => sdk.api.emails.createOne({
      logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', templateId: PLACEHOLDER_ID
    }),
    handleRateLimitError
  )


  await async_test(
    "Same template sms rate limit 1-per-minute",
    () => sdk.api.sms_messages.createSome([
      { logOnly: true, enduserId: e1.id, templateId: PLACEHOLDER_ID, message: 'hi' },
      { logOnly: true, enduserId: e1.id, templateId: PLACEHOLDER_ID, message: 'hi' },
    ]),
    handleRateLimitError
  )

  // these should work, as 1 each is safe
  const [sms1, sms2] = (await sdk.api.sms_messages.createSome([
    { logOnly: true, enduserId: e1.id, templateId: PLACEHOLDER_ID, message: 'hi' },
    { logOnly: true, enduserId: e2.id, templateId: PLACEHOLDER_ID, message: 'hi' },
  ])).created
  // already has 1 created, so 3 new should error (4 > 3)
  await async_test(
    "Same enduser sms rate limit 3 per 3 seconds",
    () => sdk.api.sms_messages.createSome([
      { logOnly: true, enduserId: e1.id, message: 'hi' },
      { logOnly: true, enduserId: e1.id, message: 'hi' },
      { logOnly: true, enduserId: e1.id, message: 'hi' },
    ]),
    handleRateLimitError
  )

  await wait(undefined, 2500) // give it some time before trying again, to ensure still blocked after 2.5 < 60 seconds
  await async_test(
    "Same template sms rate limit 1-per-minute after creating",
    () => sdk.api.sms_messages.createOne({ 
      logOnly: true, enduserId: e2.id, templateId: PLACEHOLDER_ID, message: 'hi' 
    }),
    handleRateLimitError
  )

  // these should work, as they do not have the same template
  const [email3, email4, email5] = (await sdk.api.emails.createSome([
    { logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit' },
    { logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit' },
    { logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit' },
  ])).created
 
  await Promise.all([
    sdk.api.endusers.deleteOne(e1.id),
    sdk.api.endusers.deleteOne(e2.id),
    sdk.api.emails.deleteOne(email1.id),
    sdk.api.emails.deleteOne(email2.id),
    sdk.api.emails.deleteOne(email3.id),
    sdk.api.emails.deleteOne(email4.id),
    sdk.api.emails.deleteOne(email5.id),
    sdk.api.sms_messages.deleteOne(sms1.id),
    sdk.api.sms_messages.deleteOne(sms2.id),
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
  await wait(undefined, 100)

  console.log(jRemove.id, removeStep2.id, e1.id)
  await async_test(
    "Appropriate Automated Actions are cancelled on incoming message",
    () => sdk.api.automated_actions.getSome(),
    { onResult: actions => (
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
    )}
  ) 

  await sdk.api.journeys.handle_incoming_communication({ enduserId: e2.id })
  await wait(undefined, 250)
  await async_test(
    "handle_incoming_communication test for other enduser",
    () => sdk.api.automated_actions.getSome(),
    { onResult: actions => (
        !!actions.find(a => 
            a.journeyId === jRemove.id
          && a.automationStepId === removeStep1.id
          && a.enduserId === e2.id
          && a.status === 'cancelled'
        )
    )}
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
    sdk.api.form_responses.deleteOne(fr.id),
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

const NO_TEST = () => {}
const tests: { [K in keyof ClientModelForName]: () => void } = {
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
  referral_providers: NO_TEST,
  enduser_custom_types: NO_TEST,
  table_views: NO_TEST,
  email_sync_denials: NO_TEST,
  ticket_threads: NO_TEST,
  ticket_thread_comments: NO_TEST,
};

const TRACK_OPEN_IMAGE = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  'base64'
);

(async () => {
  log_header("API")

  await async_test(
    "email-image tracking endpoint is live",
    () => axios.get('http://localhost:8080/email-image/'),
    { onResult: result => result.data === TRACK_OPEN_IMAGE.toString('utf-8')}
  ) 

  try {
    await Promise.all([
      sdk.authenticate(email, password),
      sdkSub.authenticate(subUserEmail, password),
      sdkOtherSub.authenticate(otherSubUserEmail, password),
      sdkSubSub.authenticate(subSubUserEmail, password),
      sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword),
    ]) 

    // console.log(JSON.stringify(await sdk.bulk_load({ load: [{ model: 'users' }]}), null, 2))
 
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

    await mfa_tests()
    await setup_tests()
    await automation_trigger_tests()
    await enduser_session_tests()
    await nextReminderInMS_tests()
    await search_tests()
    await wait_for_trigger_tests()
    await role_based_access_tests()
    await multi_tenant_tests() // should come right after setup tests
    await pdf_generation()
    await remove_from_journey_on_incoming_comms_tests()
    await rate_limit_tests()
    await merge_enduser_tests()
    await self_serve_appointment_booking_tests()
    await auto_reply_tests()
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
    await enduserAccessTests()
    await enduser_redaction_tests()
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