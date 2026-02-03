import React from 'react';
import { Room, LocalVideoTrack, LocalAudioTrack, RemoteParticipant } from 'twilio-video';
export interface TwilioVideoState {
    room: Room | null;
    isConnecting: boolean;
    isConnected: boolean;
    localVideoTrack: LocalVideoTrack | null;
    localAudioTrack: LocalAudioTrack | null;
    participants: RemoteParticipant[];
    error: Error | null;
    isHost: boolean;
    isVideoEnabled: boolean;
    isAudioEnabled: boolean;
}
export interface TwilioVideoActions {
    connect: (token: string, roomName: string) => Promise<void>;
    disconnect: () => void;
    toggleVideo: () => Promise<void>;
    toggleAudio: () => void;
    setIsHost: (isHost: boolean) => void;
}
export type TwilioVideoContextType = TwilioVideoState & TwilioVideoActions;
export declare const useTwilioVideo: () => TwilioVideoContextType;
export interface TwilioVideoProviderProps {
    children: React.ReactNode;
}
export declare const TwilioVideoProvider: React.FC<TwilioVideoProviderProps>;
//# sourceMappingURL=TwilioVideoContext.d.ts.map