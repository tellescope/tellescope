import { Session } from "../../sdk";
/**
 * Exercises generate_ai_decision with the new `aiSummaryConfiguration` payload (CU-86e1h0j7f).
 *
 * The handler responds early with `{}` and then builds context + calls Bedrock in the background,
 * so the deterministic, Bedrock-independent assertions here are:
 *   1. A valid `aiSummaryConfiguration` payload is accepted (schema + validator wiring) → resolves.
 *   2. The legacy `{ prompt, sources }` payload still validates (back-compat) → resolves.
 *   3. A malformed `aiSummaryConfiguration` (invalid data source type) is rejected by the validator
 *      BEFORE the early response → throws.
 */
export declare const ai_decision_summary_config_tests: ({ sdk }: {
    sdk: Session;
    sdkNonAdmin: Session;
}) => Promise<void>;
//# sourceMappingURL=ai_decision_summary_config.test.d.ts.map