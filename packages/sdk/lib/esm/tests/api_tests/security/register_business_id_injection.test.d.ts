import { Session } from "../../../sdk";
/**
 * Reproduction + regression test for the reported vulnerability:
 *
 *   A @wearehackerone.com email "joined" a customer's organization without being invited, and
 *   duplicate user records existed for that email — each bound to a different businessId.
 *
 * Root cause: the public `POST /v1/users/register` endpoint. `addPublicEndpoint` accepts an
 * OPTIONAL, caller-supplied `businessId` (routing.ts) and bakes it into the handler's DB. The
 * register handler's only duplicate guard (`DB.users.findOne({ email })`) is therefore scoped to
 * whatever org the caller named, and the subsequent `DB.users.insertOne(...)` stamps that
 * caller-supplied businessId onto a new `accountType: 'Business'` user — bypassing the
 * globalUnique: ['email'] enforcement that only runs in the generic create route.
 *
 * The "victim org" here is the test admin's own org (sdk.userInfo.businessId): an org the
 * anonymous caller was never invited to. The admin is used purely to OBSERVE whether an
 * uninvited user record materialized inside their org (getOne({ email }) is org-scoped and
 * throws when the email is absent from the caller's tenant).
 *
 * Expected results:
 *   - VULNERABLE code: the assertions FAIL — the planted user appears inside the victim org,
 *     proving the exploit ("EXPLOIT CONFIRMED" in the failure message).
 *   - FIXED code: register ignores the caller-supplied businessId (self-signups are created
 *     org-less and duplicates are rejected globally), so nothing appears in the victim org and
 *     the assertions PASS.
 *
 * Uses unique emails per run (Date.now()) so re-runs never collide on the platform-wide unique
 * email constraint. NOTE: on the FIXED path these registrations create org-less user records
 * that an org-scoped admin cannot delete — harmless residue (unique emails), inherent to the
 * legitimate "root register, no org" signup behavior.
 */
export declare const register_business_id_injection_tests: ({ sdk }: {
    sdk: Session;
    sdkNonAdmin: Session;
}) => Promise<void>;
//# sourceMappingURL=register_business_id_injection.test.d.ts.map