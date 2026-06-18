import { Session } from "../../sdk";
/**
 * Tests for settings.users.enableResourceAccessTags (the `erat` session flag).
 *
 * When the org setting is enabled, org-level configuration resources carrying `accessTags`
 * become visible only to non-admin (Default/Assigned) users whose own tags intersect the
 * record's accessTags. This mirrors the existing enduser accessTags behavior, generalized
 * to the 9 RESOURCE_ACCESS_TAG_MODELS.
 *
 * The model is ADDITIVE: a record only becomes tag-gated once an admin sets accessTags on it.
 * Records without accessTags keep their existing rules (Default == creator-only). Admins and
 * All-access users are unaffected.
 *
 * Per the throwaway-user testing guidance, this test creates throwaway users rather than
 * mutating existing user roles. Tokens are minted via generate_auth_token AFTER the org
 * setting is enabled, so the `erat` flag lands in their sessions.
 */
export declare const resource_access_tags_tests: ({ sdk }: {
    sdk: Session;
    sdkNonAdmin: Session;
}) => Promise<void>;
//# sourceMappingURL=resource_access_tags.test.d.ts.map