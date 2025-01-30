import { NativeEventEmitter } from 'react-native';
export declare const MobileSDKEvent: {
    OnMeetingStart: string;
    OnMeetingEnd: string;
    OnAttendeesJoin: string;
    OnAttendeesLeave: string;
    OnAttendeesMute: string;
    OnAttendeesUnmute: string;
    OnAddVideoTile: string;
    OnRemoveVideoTile: string;
    OnDataMessageReceive: string;
    OnError: string;
};
export declare const MeetingError: {
    OnMaximumConcurrentVideoReached: string;
};
export declare function getSDKEventEmitter(): NativeEventEmitter;
/**
 * These are functions available for React native to call on native
 * i.e. React Native -> Native
 *
 * NativeModules.NativeMobileSDKBridge.startMeeting(meetingId, userName)
 * NativeModules.NativeMobileSDKBridge.stopMeeting()
 * NativeModules.NativeMobileSDKBridge.setMute(isMute) -> boolean
 * NativeModules.NativeMobileSDKBridge.setCameraOn(isOn) -> boolean
 * NativeModules.NativeMobileSDKBridge.bindVideoView(reactTagId, tileId)
 * NativeModules.NativeMobileSDKBridge.unbindVideoView(reactTagId, tileId)
 */
export declare const NativeFunction: {
    startMeeting: any;
    stopMeeting: any;
    setMute: any;
    setCameraOn: any;
    bindVideoView: any;
    unbindVideoView: any;
    sendDataMessage: any;
};
//# sourceMappingURL=bridge.d.ts.map