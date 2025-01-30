var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// components that work with web or native
import React from "react";
import { VideoIcon, VideoOffIcon, MicrophoneIcon, MicrophoneOffIcon, CallEndIcon, LabeledIconButton, Flex, Paper, Button, Typography, } from "@tellescope/react-components";
import { CurrentCallContext } from "./video_shared";
import { useStartVideoCall } from "./video";
import { BlurToggleIcon, ScreenShareIcon, useJoinVideoCall } from ".";
var DEFAULT_BUTTON_SIZE = 30;
export var VideoToggle = function (_a) {
    var _b = _a.size, size = _b === void 0 ? DEFAULT_BUTTON_SIZE : _b;
    var _c = React.useContext(CurrentCallContext), toggleVideo = _c.toggleVideo, videoIsEnabled = _c.videoIsEnabled;
    return (_jsx(LabeledIconButton, { color: "white", size: size, Icon: videoIsEnabled ? VideoIcon : VideoOffIcon, onClick: toggleVideo, label: videoIsEnabled ? "Turn Camera Off" : "Turn Camera On" }));
};
export var MicrophoneToggle = function (_a) {
    var _b = _a.size, size = _b === void 0 ? DEFAULT_BUTTON_SIZE : _b;
    var _c = React.useContext(CurrentCallContext), microphoneIsEnabled = _c.microphoneIsEnabled, toggleMicrophone = _c.toggleMicrophone;
    return (_jsx(LabeledIconButton, { color: "white", size: size, Icon: microphoneIsEnabled ? MicrophoneIcon : MicrophoneOffIcon, onClick: toggleMicrophone, label: microphoneIsEnabled ? "Turn Microphone Off" : "Turn Microphone On" }));
};
// ends meeting if host, otherwise leaves meeting
export var EndMeeting = function (_a) {
    var _b = _a.size, size = _b === void 0 ? DEFAULT_BUTTON_SIZE : _b, onLeave = _a.onLeave;
    var endMeeting = useStartVideoCall().endMeeting;
    return (_jsx(Button, __assign({ variant: "outlined", style: { width: 200, color: 'white', borderColor: 'white' }, onClick: function () {
            onLeave === null || onLeave === void 0 ? void 0 : onLeave();
            endMeeting();
        } }, { children: "End Meeting for All" })));
};
export var LeaveMeeting = function (_a) {
    var onLeave = _a.onLeave, _b = _a.size, size = _b === void 0 ? DEFAULT_BUTTON_SIZE : _b;
    var leaveMeeting = useJoinVideoCall().leaveMeeting;
    return (_jsx(LabeledIconButton, { size: size, Icon: CallEndIcon, label: "Leave Meeting", color: "white", onClick: function () {
            leaveMeeting();
            onLeave === null || onLeave === void 0 ? void 0 : onLeave();
        } }));
};
export var ControlBar = function (_a) {
    var onLeave = _a.onLeave, style = _a.style, _b = _a.spacing, spacing = _b === void 0 ? 15 : _b, size = _a.size, showEndMeeting = _a.showEndMeeting, showScreenShare = _a.showScreenShare, showBlurToggle = _a.showBlurToggle;
    var isHost = React.useContext(CurrentCallContext).isHost;
    var itemStyle = { marginLeft: spacing, marginRight: spacing };
    return (_jsx(Flex, __assign({ flex: 1, alignItems: "center", justifyContent: "center", style: style }, { children: _jsxs(Paper, __assign({ elevation: 5, style: {
                display: 'flex', flexDirection: 'row', padding: spacing,
                backgroundColor: '#00000088',
                borderColor: 'white',
            } }, { children: [showScreenShare &&
                    _jsxs(Flex, __assign({ column: true, justifyContent: "center", style: itemStyle }, { children: [_jsx(Flex, { children: _jsx(ScreenShareIcon, {}) }), _jsx(Flex, { children: _jsx(Typography, __assign({ style: { color: 'white', textAlign: 'center', fontSize: 11 } }, { children: "Screen share" })) })] })), showBlurToggle &&
                    _jsx(Flex, __assign({ column: true, justifyContent: "center", style: itemStyle }, { children: _jsx(Flex, { children: _jsx(BlurToggleIcon, {}) }) })), !showBlurToggle && // blur toggle also provides toggle video controls
                    _jsx(Flex, __assign({ style: itemStyle }, { children: _jsx(VideoToggle, { size: size }) })), _jsx(Flex, __assign({ style: itemStyle }, { children: _jsx(MicrophoneToggle, { size: size }) })), _jsx(Flex, __assign({ style: itemStyle }, { children: _jsx(LeaveMeeting, { size: size, onLeave: onLeave }) })), (isHost || showEndMeeting) &&
                    _jsx(Flex, __assign({ style: { marginLeft: 30, marginRight: 20 } }, { children: _jsx(EndMeeting, { size: size, onLeave: onLeave }) }))] })) })));
};
//# sourceMappingURL=controls.js.map