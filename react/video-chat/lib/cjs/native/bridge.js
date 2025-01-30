"use strict";
/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeFunction = exports.getSDKEventEmitter = exports.MeetingError = exports.MobileSDKEvent = void 0;
var react_native_1 = require("react-native");
/**
 * These are the function that will be called from native side
 * i.e. Native -> React Native
 *
 * NativeEventEmitter.onMeetingStart(meetingName)
 * NativeEventEmitter.onMeetingEnd()
 * NativeEventEmitter.onAttendeesJoin(attendeeInfo)
 * NativeEventEmitter.onAttendeesLeave(attendeeInfo)
 * NativeEventEmitter.onAddVideoTile(tileState)
 * NativeEventEmitter.onRemoveVideoTile(tileState)
 * NativeEventEmitter.onError(errorMessage)
 */
var _eventEmitter = new react_native_1.NativeEventEmitter(react_native_1.NativeModules.NativeMobileSDKBridge);
exports.MobileSDKEvent = {
    OnMeetingStart: 'OnMeetingStart',
    OnMeetingEnd: 'OnMeetingEnd',
    OnAttendeesJoin: 'OnAttendeesJoin',
    OnAttendeesLeave: 'OnAttendeesLeave',
    OnAttendeesMute: 'OnAttendeesMute',
    OnAttendeesUnmute: 'OnAttendeesUnmute',
    OnAddVideoTile: 'OnAddVideoTile',
    OnRemoveVideoTile: 'OnRemoveVideoTile',
    OnDataMessageReceive: 'OnDataMessageReceive',
    OnError: 'OnError',
};
exports.MeetingError = {
    OnMaximumConcurrentVideoReached: "OnMaximumConcurrentVideoReached"
};
function getSDKEventEmitter() {
    return _eventEmitter;
}
exports.getSDKEventEmitter = getSDKEventEmitter;
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
exports.NativeFunction = {
    startMeeting: react_native_1.NativeModules.NativeMobileSDKBridge.startMeeting,
    stopMeeting: react_native_1.NativeModules.NativeMobileSDKBridge.stopMeeting,
    setMute: react_native_1.NativeModules.NativeMobileSDKBridge.setMute,
    setCameraOn: react_native_1.NativeModules.NativeMobileSDKBridge.setCameraOn,
    bindVideoView: react_native_1.NativeModules.NativeMobileSDKBridge.bindVideoView,
    unbindVideoView: react_native_1.NativeModules.NativeMobileSDKBridge.unbindVideoView,
    sendDataMessage: react_native_1.NativeModules.NativeMobileSDKBridge.sendDataMessage,
};
//# sourceMappingURL=bridge.js.map