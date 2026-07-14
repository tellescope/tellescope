import React from 'react';
import { Room, LocalVideoTrack, LocalAudioTrack, RemoteParticipant } from 'twilio-video';
import { BackgroundEffect } from './backgroundEffects';
export declare const SCREEN_SHARE_TRACK_NAME = "screen-share";
export declare const SCREEN_SHARE_AUDIO_TRACK_NAME = "screen-share-audio";
export { loadTwilioVideoProcessorsModule, BLUR_BACKGROUND_ASSETS_PATH, } from './backgroundEffects';
export type { BackgroundEffect } from './backgroundEffects';
export interface TwilioVideoState {
    room: Room | null;
    isConnecting: boolean;
    isConnected: boolean;
    localVideoTrack: LocalVideoTrack | null;
    localAudioTrack: LocalAudioTrack | null;
    localScreenTrack: LocalVideoTrack | null;
    isScreenSharing: boolean;
    screenSharingParticipantSid: string | null;
    participants: RemoteParticipant[];
    error: Error | null;
    isHost: boolean;
    isVideoEnabled: boolean;
    isAudioEnabled: boolean;
    backgroundEffect: BackgroundEffect;
    isBackgroundEffectSupported: boolean;
    isImageBackgroundAvailable: boolean;
    isEffectLoading: boolean;
}
export interface TwilioVideoActions {
    connect: (token: string, roomName: string) => Promise<void>;
    disconnect: () => void;
    toggleVideo: () => Promise<void>;
    toggleAudio: () => void;
    toggleScreenShare: (options?: {
        shareAudio?: boolean;
    }) => Promise<void>;
    setBackgroundEffect: (effect: BackgroundEffect) => void;
    setIsHost: (isHost: boolean) => void;
}
export type TwilioVideoContextType = TwilioVideoState & TwilioVideoActions;
export declare const useTwilioVideo: () => TwilioVideoContextType;
export interface TwilioVideoProviderProps {
    children: React.ReactNode;
    /**
     * Optional URL of an image to offer as a virtual background. Only the
     * provider webapp supplies this (from the org's videoCallBackgroundImage);
     * when absent the Image effect option is hidden (patient portal).
     */
    backgroundImageURL?: string;
}
export declare const TwilioVideoProvider: React.FC<TwilioVideoProviderProps>;
//# sourceMappingURL=TwilioVideoContext.d.ts.map