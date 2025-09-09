# API Tests

This directory contains modular API endpoint tests that can be run independently from the main test suite.

## Running Tests

### Individual Test Files
```bash
# Build and run a specific test file
npm run build:cjs && node -r dotenv/config lib/cjs/tests/api_tests/[test-file].js
```

### Example: Running the acknowledge endpoint tests
```bash
npm run build:cjs && node -r dotenv/config lib/cjs/tests/api_tests/enduser_observations_acknowledge.test.js
```

## Test Structure

Each test file follows this pattern:

1. **Setup**: Import required dependencies and test helpers
2. **Authentication**: Authenticate with the test API
3. **Test Data**: Create placeholder enduser and related test data
4. **Test Cases**: Execute specific endpoint functionality tests
5. **Cleanup**: Delete test enduser (cascades to delete related records)

## Available Tests

- `enduser_observations_acknowledge.test.ts` - Tests for the acknowledge endpoint's exclusion flag functionality

## Environment Requirements

Tests require the same environment variables as the main test suite:
- `TEST_EMAIL` - Test account email
- `TEST_PASSWORD` - Test account password  
- `TEST_URL` - API endpoint (defaults to http://localhost:8080)

## Adding New Tests

1. Create a new `.test.ts` file in this directory
2. Follow the existing pattern for imports and test structure
3. Export a main test function for potential integration
4. Include both independent execution and module export
5. Always include proper cleanup of test data

## Test Patterns

- Use `handleAnyError = { shouldError: true, onError: () => true }` for expected failures
- Use `passOnAnyResult = { onResult: () => true }` for operations where success/failure doesn't matter
- Use `{ onResult: (result) => result === expectedValue }` for value assertions
- Always create unique test data (use timestamps or random values)
- Always cleanup test endusers in a `finally` block