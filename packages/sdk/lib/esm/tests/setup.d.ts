import { Session, EnduserSession } from "../sdk";
declare const email: string | undefined;
export declare const setup_tests: (sdk: Session, sdkNonAdmin: Session) => Promise<void>;
export declare const authenticate_enduser_via_token: (sdk: Session, enduserSDK: EnduserSession, filter: {
    id?: string;
    email?: string;
    externalId?: string;
}) => Promise<import("@tellescope/types-models").Enduser & {
    id: string;
    createdAt: Date;
}>;
export {};
//# sourceMappingURL=setup.d.ts.map