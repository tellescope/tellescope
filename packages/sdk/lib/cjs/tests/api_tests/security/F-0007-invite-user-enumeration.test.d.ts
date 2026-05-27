import { Session } from "../../../sdk";
/**
 * Regression test for F-0007 (security-audit/findings/F-0007-invite-user-cross-tenant-email-enumeration.md).
 *
 * `users.invite_user` previously used `buildAllQueries({ unrestricted: true, organizationIds: [] }).users.findOne({ email })`
 * to enforce platform-wide email uniqueness and threw the distinctive `"A user with this email already exists"`
 * error on duplicate — regardless of which tenant the existing user was in. Any authenticated user could
 * therefore probe whether email X is registered to any tenant on the platform.
 *
 * **Tests only the negative case** — never drives a successful invite (which would create a real user
 * record and send a real transactional email). All assertions use either:
 *   - An email that already exists in the test tenant (the admin's own email), so each call short-circuits
 *     at the same-tenant duplicate check or rate-limit check before any invite work happens, OR
 *   - The cross-org infrastructure (CROSS_ORG_API_KEY env var) targeting an email that exists in a different
 *     tenant — verifies the post-fix response does NOT distinguish "exists elsewhere" from a generic outcome.
 *
 * Assertions:
 *   1. Rate-limit defense-in-depth: rapid same-tenant duplicate requests trip 429 within ~12 attempts.
 *   2. Same-tenant duplicate: returns the same `"already exists"` error pre/post-fix (this branch is
 *      unchanged by the fix; asserted for regression-safety).
 *   3. Cross-tenant duplicate (env-gated): post-fix response shape does NOT contain the `"already exists"`
 *      string and matches the silent-no-op shape `{ created: { id: ... } }`. Skipped when CROSS_ORG_*
 *      env vars are not set, mirroring cross_org_api_key.test.ts convention.
 */
export declare const invite_user_enumeration_tests: ({ sdk, sdkNonAdmin }: {
    sdk: Session;
    sdkNonAdmin: Session;
}) => Promise<void>;
//# sourceMappingURL=F-0007-invite-user-enumeration.test.d.ts.map