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

## Dependencies
- @tellescope/schema, @tellescope/types-*
- axios for HTTP client