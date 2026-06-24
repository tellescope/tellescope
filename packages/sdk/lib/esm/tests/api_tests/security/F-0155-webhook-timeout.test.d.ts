import { Session } from "../../../sdk";
/**
 * Regression test for F-0155
 * (security-audit/findings/F-0155-outbound-webhook-no-timeout-slow-loris.md).
 *
 * Outbound webhook delivery used axios.post(url, ...) with no `timeout` (axios default = infinite).
 * A tenant-controlled receiver that accepts the connection and never responds hangs the awaited
 * request indefinitely (slow-loris → worker exhaustion). Fix: timeout: 15_000 on the axios calls.
 *
 * Repro: stand up a local HTTP server that accepts the connection but NEVER responds, point
 * send_automation_webhook (which awaits the axios call) at it, and race the call against a 20s
 * client timer.
 *   - green (fixed):  server times out at ~15s → handler returns 400 → SDK call rejects < 20s
 *   - red  (unfixed): the call is still pending at 20s → client timer wins
 */
export declare const webhook_timeout_tests: ({ sdk }: {
    sdk: Session;
    sdkNonAdmin: Session;
}) => Promise<void>;
//# sourceMappingURL=F-0155-webhook-timeout.test.d.ts.map