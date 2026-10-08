# Tellescope SDK

## Purpose
Official TypeScript SDK for integrating with the Tellescope healthcare platform API with type-safe access to all platform features.

## Key Features
- Type-safe API with auto-completion
- Built-in session management and authentication
- Complete CRUD operations for all healthcare data models
- Real-time WebSocket support
- HIPAA-compliant file management

## Entry Points
- **Main**: `src/sdk.ts` - Main SDK class with session management
- **Public**: `src/public.ts` - Unauthenticated endpoints
- **Patient**: `src/enduser.ts` - Patient-specific operations
- **Session**: `src/session.ts` - Authentication and session management

## Critical Safety Notes
- 🔒 All methods automatically enforce organization-scoped queries for multi-tenancy
- 🔒 Built-in audit logging for PHI access
- ✅ Safe to add new utility methods and type definitions

## Test credentials
- Tests read `.env` in this directory via `node -r dotenv/config` (`API_URL`, `TEST_EMAIL`, `TEST_PASSWORD`, `NON_ADMIN_EMAIL`, `NON_ADMIN_PASSWORD`, plus `TEST_BUSINESS_ID` / `TEST_SUBDOMAIN` / `TEST_API_KEY` / `TEST_TENANT_PROVISIONED` for a provisioned tenant; the front-end suite in `packages/private/e2e` reads the same file and points the portal at `TEST_SUBDOMAIN`). The template is `env.example`.
- `npm run bootstrap` at the repo root provisions a throwaway tenant on a local API (`LOCAL=true`) through `/test-support/provision-tenant` and writes those values to the file without printing them (emails and ids only; `--show-secrets` is an explicit human opt-in); it refuses to replace existing credentials without `--force`, and `--teardown <businessId>` removes the tenant again.
- `src/tests/setup_isolated.ts` provisions a tenant per test with no configuration at all; prefer it for new tests.

## Enrolling an isolated suite in the parallel pool
An isolated (tenant-provisioned) suite registers itself — **nothing in `src/tests/tests.ts` is edited**, so two branches adding tests no longer collide there. Export the descriptor from the test's own file, next to its asserting wrapper:

```typescript
import { Check, IsolatedSuite, assert_checks, setup_isolated_tenant } from "../setup_isolated"

export const my_feature_checks = async (): Promise<Check[]> => { /* collects Check[], tears down in a finally */ }

export const my_feature_tests = async () => { assert_checks('My feature', await my_feature_checks()) }

/** Enrolls this suite in the auto-discovered parallel pool — see run_discovered_isolated_suites. */
export const ISOLATED_SUITE: IsolatedSuite = { name: 'My feature', run: my_feature_checks }
```

`run_discovered_isolated_suites()` (called once from `tests.ts`) walks the **compiled** `lib/cjs/tests/api_tests` tree recursively, loads every `*.test.js`, collects the `ISOLATED_SUITE` exports, sorts them by relative path and runs them in batches of `TEST_PARALLELISM` (default 8), asserting after each batch settles.

Rules this depends on:
- `run` must collect `Check[]`, tear its own tenants down in a `finally`, and **never assert** — `assert` calls `process.exit`, which skips every other in-flight suite's teardown and strands its tenants permanently (an organization record cannot be deleted).
- Isolated suites must never call `sdk.reset_db()`; it clears throttle namespaces shared with concurrent suites.
- Keep the `if (require.main === module)` guard. Discovery `require()`s every test file, so anything at module scope runs at discovery time.
- Discovery reads the compiled tree, so a stale `lib/cjs` silently drops a suite. `npm run check:build` (run automatically by `npm test` / `npm run test-api` / `npm run test:modular`) is what catches it, and `unit_tests/isolated_suite_discovery.test.ts` fails the run if a `src` file enrolls a suite that discovery did not find.
- A suite that enrolls must not also be awaited by name in `tests.ts` — it would run, and provision tenants, twice. The discovery unit test asserts this.
- `TEST_PARALLELISM` tunes the pool without a rebuild; a non-positive or non-integer value falls back to 8. Above ~8 against a local API, the per-record update throttles start returning 429s that look like failures.

## Dependencies
- @tellescope/schema, @tellescope/types-*
- axios for HTTP client