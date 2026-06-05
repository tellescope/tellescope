import { Session } from "../../../sdk";
/**
 * Self-role privilege-escalation guard (relates to security-audit finding F-0076, which was
 * investigated and closed as a FALSE POSITIVE — see that file for the full code trace).
 *
 * F-0076 hypothesized that a non-admin staff user could `PATCH /v1/users/{their-own-id}` with
 * `{ roles: ['Admin'] }` and self-promote to Admin, because the FIRST `users` relationship
 * constraint ("Only admin users can set the admin role",
 * [schema.ts:3446](packages/public/schema/src/schema.ts#L3446)) has a self-exception
 * (`if (_id === session.id) return`).
 *
 * That analysis missed the SECOND constraint, "Only admin users can update user roles"
 * ([schema.ts:3486](packages/public/schema/src/schema.ts#L3486)), which has NO self-exception.
 * Relationship constraints are AND-evaluated — `validateRelationshipConstraints`
 * ([routing.ts:1240-1252](packages/private/api/api/modules/routing.ts#L1240)) loops the whole
 * array and throws 400 on the FIRST evaluator that returns a string. So a non-admin self-update
 * that includes `roles` passes constraint #1 (self-exception) but is rejected by constraint #2.
 * The self-promotion is blocked.
 *
 * This test locks that boundary in place so a future refactor of the role constraints can't
 * silently reintroduce the escalation. A dedicated throwaway non-admin user is used as the
 * "attacker" (we never mutate the shared sdkNonAdmin's roles):
 *   1. Admin creates a throwaway user and assigns it a non-admin role (`['Provider']`).
 *   2. Authenticate AS that user via a freshly-minted auth token.
 *   3. As the attacker, attempt four self-role mutations — ['Admin'], ['Provider','Admin'],
 *      an arbitrary role, and [] — and assert EACH is blocked.       <-- the security assertions
 *   4. Confirm (as admin) the attacker's roles are still ['Provider'] — nothing slipped through.
 *   5. Positive control: admin CAN update the throwaway user's roles. <-- guards against an
 *      over-restrictive regression that would block legitimate admin role management.
 *
 * Expected on current (correct) code: all assertions pass. A regression that made the self-update
 * path role-writable by non-admins would flip the step-3/step-4 assertions to red.
 */
export declare const self_admin_role_assignment_tests: ({ sdk }: {
    sdk: Session;
    sdkNonAdmin: Session;
}) => Promise<void>;
//# sourceMappingURL=F-0076-self-admin-role-assignment.test.d.ts.map