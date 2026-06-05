import { Session } from "../../../sdk";
/**
 * Tenant-boundary guard for cascade_role_rename (relates to security-audit finding F-0053,
 * which was investigated and closed as a FALSE POSITIVE — see that file for the code trace).
 *
 * The `cascade_role_rename` side-effect handler
 * ([event_handlers_v2/role_based_access_permissions.ts](packages/private/api/api/v1/event_handlers_v2/role_based_access_permissions.ts))
 * runs when a `role_based_access_permissions` doc's `role` field changes. It finds every user
 * with the old role name (via `DBUnrestricted.users`) and rewrites their `roles` array, then
 * deauthenticates them. F-0053 hypothesized this query was globally cross-tenant. It is NOT:
 * `DBUnrestricted` bypasses per-user/per-role RBAC but is STILL scoped to the acting session's
 * `businessId` (see `modifyFilterForAccessConstraint` injecting `{ businessId }` at
 * database.ts:1761-1763, reached via the `unrestricted: true` branch at database.ts:2137-2144).
 *
 * This test locks that boundary in place so a future refactor of `DBUnrestricted` semantics
 * can't silently turn the cascade into a cross-tenant write:
 *   1. Tenant A creates a role `ROLE_OLD` and assigns it to a Tenant A user (positive control).
 *   2. Tenant B (separate businessId) has a user whose roles include the SAME `ROLE_OLD`.
 *   3. Tenant A renames the role `ROLE_OLD` -> `ROLE_NEW`.
 *   4. Assert the Tenant B user's roles are UNCHANGED (still `[ROLE_OLD]`)  <-- guards the tenant boundary.
 *   5. Assert the Tenant A user's roles ARE renamed to `[ROLE_NEW]`         <-- same-tenant cascade works.
 *
 * Expected on current (correct) code: BOTH assertions pass. A regression that drops the
 * `businessId` scoping would flip assertion #4 to red (Tenant B user becomes `[ROLE_NEW]`).
 *
 * A collision-proof unique role name (timestamped) is used so the test never touches real roles.
 */
export declare const cascade_role_rename_cross_tenant_tests: ({ sdk }: {
    sdk: Session;
    sdkNonAdmin: Session;
}) => Promise<void>;
//# sourceMappingURL=F-0053-cascade-role-rename-cross-tenant.test.d.ts.map