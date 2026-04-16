import React from 'react';
export interface TwilioControlBarProps {
    onLeave?: () => void;
    onEndForAll?: () => void;
    style?: React.CSSProperties;
    /** Whether to show the screen share button. Defaults to true. */
    showScreenShare?: boolean;
}
export declare const TwilioControlBar: React.FC<TwilioControlBarProps>;
//# sourceMappingURL=TwilioControls.d.ts.map