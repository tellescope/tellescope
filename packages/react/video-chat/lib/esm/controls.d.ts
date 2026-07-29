/// <reference types="react" />
import { Styled } from "@tellescope/react-components";
interface ButtonProps {
    size?: number;
}
export declare const VideoToggle: ({ size }: ButtonProps) => JSX.Element;
export declare const MicrophoneToggle: ({ size }: ButtonProps) => JSX.Element;
export declare const EndMeeting: ({ size, onLeave }: ButtonProps & LeaveMeetingProps) => JSX.Element;
interface LeaveMeetingProps {
    onLeave?: () => void;
}
export declare const LeaveMeeting: ({ onLeave, size }: LeaveMeetingProps & ButtonProps) => JSX.Element;
interface ControlbarProps {
    autoCamera?: boolean;
    spacing?: number;
    size?: number;
    showEndMeeting?: boolean;
    showScreenShare?: boolean;
    showBlurToggle?: boolean;
}
export declare const ControlBar: ({ autoCamera, onLeave, style, spacing, size, showEndMeeting, showScreenShare, showBlurToggle }: ControlbarProps & LeaveMeetingProps & Styled) => JSX.Element;
export {};
//# sourceMappingURL=controls.d.ts.map