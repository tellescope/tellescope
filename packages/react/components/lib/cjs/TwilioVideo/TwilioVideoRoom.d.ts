import React from 'react';
export interface TwilioVideoRoomProps {
    onLeave?: () => void;
    onEndForAll?: () => void;
    style?: React.CSSProperties;
    /** Resolve participant identity to a display label. Defaults to empty string. */
    resolveIdentity?: (identity: string) => string;
}
export declare const TwilioVideoRoom: React.FC<TwilioVideoRoomProps>;
//# sourceMappingURL=TwilioVideoRoom.d.ts.map