import React from 'react';
import { RemoteParticipant, LocalParticipant } from 'twilio-video';
export interface TwilioParticipantProps {
    participant: RemoteParticipant | LocalParticipant;
    isLocal?: boolean;
    style?: React.CSSProperties;
    /** Resolve participant identity to a display label. Defaults to empty string. */
    resolveIdentity?: (identity: string) => string;
    /** When true, render the screen share track instead of the camera track */
    showScreenShare?: boolean;
}
export declare const TwilioParticipant: React.FC<TwilioParticipantProps>;
//# sourceMappingURL=TwilioParticipant.d.ts.map