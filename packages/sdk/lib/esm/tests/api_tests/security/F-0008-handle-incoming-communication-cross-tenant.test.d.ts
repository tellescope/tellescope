import { Session } from "../../../sdk";
/**
 * Regression test for F-0008 (security-audit/findings/F-0008-handle-incoming-communication-cross-tenant-enduser-lookup.md).
 *
 * `journeys.handle_incoming_communication` previously used `buildAllQueries({ unrestricted: true, organizationIds: [] }).endusers.findById(enduserId)`,
 * permitting cross-tenant lookup of any enduser by id. The handler then called `handleIncomingCommunication(...)`
 * against the matched enduser, triggering journey progression and automated actions on someone else's tenant.
 *
 * The fix switches to the standard tenant-scoped `DB.endusers.findById(enduserId)` wrapper, which automatically
 * filters by `req.session.businessId`. Cross-tenant lookups now return null → handler returns 404 → no side effect.
 *
 * Note: the same-tenant happy path is already covered by the existing test at
 * `packages/public/sdk/src/tests/tests.ts:7588` ("handle_incoming_communication test for other enduser") — that
 * test creates endusers in the test tenant, sets up journeys, calls handle_incoming_communication, and asserts
 * journey-step cancellation. This file covers the negative cases only.
 *
 * **Negative-only by design**: the test never drives `handleIncomingCommunication` against a cross-tenant
 * enduser — the post-fix code returns 404 before any side effects fire, and the assertion confirms that.
 */
export declare const handle_incoming_communication_cross_tenant_tests: ({ sdk, sdkNonAdmin }: {
    sdk: Session;
    sdkNonAdmin: Session;
}) => Promise<void>;
//# sourceMappingURL=F-0008-handle-incoming-communication-cross-tenant.test.d.ts.map