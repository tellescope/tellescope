# /new-api-test

Creates a new modular API test following Tellescope testing conventions.

## Usage
`/new-api-test [endpoint-name]`

## What This Command Does

1. **Creates test file** in `packages/public/sdk/src/tests/api_tests/`
2. **Follows established patterns** from existing modular tests
3. **Includes proper cleanup** with test enduser creation/deletion
4. **Supports independent execution** - can run standalone or as part of suite

## Generated Test Structure

```typescript
// Generated template includes:
- Required imports (Session, async_test, etc.)
- Authentication setup
- Test enduser creation
- Multiple test cases with proper assertions
- Comprehensive cleanup in finally block
- Independent execution capability
```

## Test Patterns Included

### Test Helpers
- `handleAnyError = { shouldError: true, onError: () => true }` - For expected failures
- `passOnAnyResult = { onResult: () => true }` - When success/failure doesn't matter
- `{ onResult: (result) => result === expectedValue }` - For value assertions

### Test Data Management
- Unique test data using timestamps/random values
- Test enduser creation with proper cleanup
- Related record creation (observations, tickets, etc.)

### Test Execution
```bash
# Build and run the generated test
npm run build:cjs && node -r dotenv/config lib/cjs/tests/api_tests/[endpoint-name].test.js
```

## Example Generated Test

For `/new-api-test user_profiles`, creates:
- File: `user_profiles.test.ts`
- Function: `user_profiles_tests()`
- Tests: CRUD operations, validation, edge cases
- Cleanup: Deletes test enduser and related records

## Environment Requirements

Tests require standard Tellescope test environment:
- `TEST_EMAIL` - Test account email
- `TEST_PASSWORD` - Test account password
- `TEST_URL` - API endpoint (defaults to localhost:8080)

## Best Practices Enforced

1. **Unique Test Data** - Prevents conflicts with other tests
2. **Proper Error Handling** - Tests both success and failure scenarios
3. **Complete Cleanup** - No test data pollution
4. **Modular Design** - Can run independently or integrate with main suite
5. **Clear Naming** - Descriptive test names and clear assertions

## Integration with Main Test Suite

**IMPORTANT**: Always integrate new tests into the main test suite for comprehensive coverage.

### Step 1: Add Import
In `packages/public/sdk/src/tests/tests.ts`, add import at the top:
```typescript
import { endpoint_name_tests } from "./api_tests/endpoint_name.test"
```

### Step 2: Add to Execution Flow
Find the main test execution section (after `setup_tests()`) and add your test:
```typescript
await setup_tests()
await endpoint_name_tests()  // Add your test here
await inbox_threads_building_tests()
```

### Step 3: Verify Integration
```bash
# Build and run full test suite
npm run test

# Or run just API tests
npm run test-api
```

### Example: enduser_observations Integration
```typescript
// Import added at top of file
import { enduser_observations_acknowledge_tests } from "./api_tests/enduser_observations_acknowledge.test"

// Added to execution flow
await setup_tests()
await enduser_observations_acknowledge_tests()
await inbox_threads_building_tests()
```

This ensures new tests run as part of the complete validation suite as **ad-hoc tests**, maintaining comprehensive API coverage and preventing regressions. The tests object should remain unchanged with `NO_TEST` entries.