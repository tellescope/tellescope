import React from 'react';
export interface TwilioVideoRoomProps {
    onLeave?: () => void;
    onEndForAll?: () => void;
    style?: React.CSSProperties;
    /** Resolve participant identity to a display label. Defaults to empty string. */
    resolveIdentity?: (identity: string) => string;
    /** Whether to show the screen share button. Defaults to true. */
    showScreenShare?: boolean;
}
export declare const TwilioVideoRoom: React.FC<TwilioVideoRoomProps>;
//# sourceMappingURL=TwilioVideoRoom.d.ts.map