require('source-map-support').install();

import { Session, EnduserSession } from "../sdk"
import { 
  async_test,
  handleAnyError,
  log_header,
  wait,
  assert,
} from "@tellescope/testing"

const host = process.env.API_URL || 'http://localhost:8080' as const
const [email, password] = [process.env.TEST_EMAIL, process.env.TEST_PASSWORD]
const [nonAdminEmail, nonAdminPassword] = [process.env.NON_ADMIN_EMAIL, process.env.NON_ADMIN_PASSWORD]
const businessId = '60398b1131a295e64f084ff6'

if (!(email && password)) {
  console.error("Set TEST_EMAIL and TEST_PASSWORD")
  process.exit()
}

if (!(nonAdminEmail && nonAdminPassword)) {
  console.error("Set NON_ADMIN_EMAIL and NON_ADMIN_PASSWORD")
  process.exit()
}

const passOnAnyResult = { shouldError: false, onResult: () => true }
const voidResult = () => true
const passOnVoid = { shouldError: false, onResult: voidResult }

// Reusable setup function that can be called independently
export const setup_tests = async (sdk: Session, sdkNonAdmin: Session) => {
  log_header("Setup")
  console.log(`🌐 Using API URL: ${host}`)
  await async_test('test_online', sdk.test_online, { expectedResult: 'API V1 Online' })
  
  // Authenticate the SDKs first
  await sdk.authenticate(email, password)
  await sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)
  
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