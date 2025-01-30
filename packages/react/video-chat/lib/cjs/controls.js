"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlBar = exports.LeaveMeeting = exports.EndMeeting = exports.MicrophoneToggle = exports.VideoToggle = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// components that work with web or native
var react_1 = __importDefault(require("react"));
var react_components_1 = require("@tellescope/react-components");
var video_shared_1 = require("./video_shared");
var video_1 = require("./video");
var _1 = require(".");
var DEFAULT_BUTTON_SIZE = 30;
var VideoToggle = function (_a) {
    var _b = _a.size, size = _b === void 0 ? DEFAULT_BUTTON_SIZE : _b;
    var _c = react_1.default.useContext(video_shared_1.CurrentCallContext), toggleVideo = _c.toggleVideo, videoIsEnabled = _c.videoIsEnabled;
    return ((0, jsx_runtime_1.jsx)(react_components_1.LabeledIconButton, { color: "white", size: size, Icon: videoIsEnabled ? react_components_1.VideoIcon : react_components_1.VideoOffIcon, onClick: toggleVideo, label: videoIsEnabled ? "Turn Camera Off" : "Turn Camera On" }));
};
exports.VideoToggle = VideoToggle;
var MicrophoneToggle = function (_a) {
    var _b = _a.size, size = _b === void 0 ? DEFAULT_BUTTON_SIZE : _b;
    var _c = react_1.default.useContext(video_shared_1.CurrentCallContext), microphoneIsEnabled = _c.microphoneIsEnabled, toggleMicrophone = _c.toggleMicrophone;
    return ((0, jsx_runtime_1.jsx)(react_components_1.LabeledIconButton, { color: "white", size: size, Icon: microphoneIsEnabled ? react_components_1.MicrophoneIcon : react_components_1.MicrophoneOffIcon, onClick: toggleMicrophone, label: microphoneIsEnabled ? "Turn Microphone Off" : "Turn Microphone On" }));
};
exports.MicrophoneToggle = MicrophoneToggle;
// ends meeting if host, otherwise leaves meeting
var EndMeeting = function (_a) {
    var _b = _a.size, size = _b === void 0 ? DEFAULT_BUTTON_SIZE : _b, onLeave = _a.onLeave;
    var endMeeting = (0, video_1.useStartVideoCall)().endMeeting;
    return ((0, jsx_runtime_1.jsx)(react_components_1.Button, __assign({ variant: "outlined", style: { width: 200, color: 'white', borderColor: 'white' }, onClick: function () {
            onLeave === null || onLeave === void 0 ? void 0 : onLeave();
            endMeeting();
        } }, { children: "End Meeting for All" })));
};
exports.EndMeeting = EndMeeting;
var LeaveMeeting = function (_a) {
    var onLeave = _a.onLeave, _b = _a.size, size = _b === void 0 ? DEFAULT_BUTTON_SIZE : _b;
    var leaveMeeting = (0, _1.useJoinVideoCall)().leaveMeeting;
    return ((0, jsx_runtime_1.jsx)(react_components_1.LabeledIconButton, { size: size, Icon: react_components_1.CallEndIcon, label: "Leave Meeting", color: "white", onClick: function () {
            leaveMeeting();
            onLeave === null || onLeave === void 0 ? void 0 : onLeave();
        } }));
};
exports.LeaveMeeting = LeaveMeeting;
var ControlBar = function (_a) {
    var onLeave = _a.onLeave, style = _a.style, _b = _a.spacing, spacing = _b === void 0 ? 15 : _b, size = _a.size, showEndMeeting = _a.showEndMeeting, showScreenShare = _a.showScreenShare, showBlurToggle = _a.showBlurToggle;
    var isHost = react_1.default.useContext(video_shared_1.CurrentCallContext).isHost;
    var itemStyle = { marginLeft: spacing, marginRight: spacing };
    return ((0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ flex: 1, alignItems: "center", justifyContent: "center", style: style }, { children: (0, jsx_runtime_1.jsxs)(react_components_1.Paper, __assign({ elevation: 5, style: {
                display: 'flex', flexDirection: 'row', padding: spacing,
                backgroundColor: '#00000088',
                borderColor: 'white',
            } }, { children: [showScreenShare &&
                    (0, jsx_runtime_1.jsxs)(react_components_1.Flex, __assign({ column: true, justifyContent: "center", style: itemStyle }, { children: [(0, jsx_runtime_1.jsx)(react_components_1.Flex, { children: (0, jsx_runtime_1.jsx)(_1.ScreenShareIcon, {}) }), (0, jsx_runtime_1.jsx)(react_components_1.Flex, { children: (0, jsx_runtime_1.jsx)(react_components_1.Typography, __assign({ style: { color: 'white', textAlign: 'center', fontSize: 11 } }, { children: "Screen share" })) })] })), showBlurToggle &&
                    (0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ column: true, justifyContent: "center", style: itemStyle }, { children: (0, jsx_runtime_1.jsx)(react_components_1.Flex, { children: (0, jsx_runtime_1.jsx)(_1.BlurToggleIcon, {}) }) })), !showBlurToggle && // blur toggle also provides toggle video controls
                    (0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ style: itemStyle }, { children: (0, jsx_runtime_1.jsx)(exports.VideoToggle, { size: size }) })), (0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ style: itemStyle }, { children: (0, jsx_runtime_1.jsx)(exports.MicrophoneToggle, { size: size }) })), (0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ style: itemStyle }, { children: (0, jsx_runtime_1.jsx)(exports.LeaveMeeting, { size: size, onLeave: onLeave }) })), (isHost || showEndMeeting) &&
                    (0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ style: { marginLeft: 30, marginRight: 20 } }, { children: (0, jsx_runtime_1.jsx)(exports.EndMeeting, { size: size, onLeave: onLeave }) }))] })) })));
};
exports.ControlBar = ControlBar;
//# sourceMappingURL=controls.js.map