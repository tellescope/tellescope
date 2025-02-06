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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// components that work with web or native
import React, { useCallback, useEffect, useState } from "react";
import { VideoIcon, VideoOffIcon, MicrophoneIcon, MicrophoneOffIcon, CallEndIcon, LabeledIconButton, Flex, Button, } from "@tellescope/react-components";
import { CurrentCallContext } from "./video_shared";
import { useStartVideoCall } from "./video";
import { useJoinVideoCall } from ".";
import { AudioInputControl, AudioOutputControl, ControlBar as BaseControlBar, Camera, ContentShareControl, ControlBarButton, Phone, useBackgroundBlur, useMeetingManager, useVideoInputs } from "amazon-chime-sdk-component-library-react";
import { isVideoTransformDevice } from "amazon-chime-sdk-js";
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
var useToggleBlur = function () {
    var meetingManager = useMeetingManager();
    var selectedDevice = useVideoInputs().selectedDevice;
    var _a = useBackgroundBlur(), isBackgroundBlurSupported = _a.isBackgroundBlurSupported, createBackgroundBlurDevice = _a.createBackgroundBlurDevice;
    var _b = useState(false), isVideoTransformCheckBoxOn = _b[0], setisVideoTransformCheckBoxOn = _b[1];
    useEffect(function () {
        function toggleBackgroundBlur() {
            return __awaiter(this, void 0, void 0, function () {
                var current, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 6, , 7]);
                            current = selectedDevice;
                            if (!isVideoTransformCheckBoxOn) return [3 /*break*/, 2];
                            return [4 /*yield*/, createBackgroundBlurDevice(selectedDevice)];
                        case 1:
                            current = _a.sent();
                            return [3 /*break*/, 4];
                        case 2:
                            if (!isVideoTransformDevice(selectedDevice)) return [3 /*break*/, 4];
                            return [4 /*yield*/, selectedDevice.intrinsicDevice()];
                        case 3:
                            current = _a.sent();
                            _a.label = 4;
                        case 4: return [4 /*yield*/, meetingManager.startVideoInputDevice(current)];
                        case 5:
                            _a.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            error_1 = _a.sent();
                            // Handle device selection failure here
                            console.error('Failed to toggle Background Blur');
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
        toggleBackgroundBlur();
        // eslint-disable-next-line
    }, [isVideoTransformCheckBoxOn]);
    var toggleBlur = useCallback(function () { return setisVideoTransformCheckBoxOn(function (current) { return !current; }); }, []);
    return {
        blurIsActive: isVideoTransformCheckBoxOn,
        isBackgroundBlurSupported: isBackgroundBlurSupported,
        toggleBlur: toggleBlur,
    };
};
export var ControlBar = function (_a) {
    var onLeave = _a.onLeave, style = _a.style, _b = _a.spacing, spacing = _b === void 0 ? 15 : _b, size = _a.size, showEndMeeting = _a.showEndMeeting, showScreenShare = _a.showScreenShare, showBlurToggle = _a.showBlurToggle;
    var isHost = React.useContext(CurrentCallContext).isHost;
    var itemStyle = { marginLeft: spacing, marginRight: spacing };
    var leaveMeeting = useJoinVideoCall().leaveMeeting;
    var _c = React.useContext(CurrentCallContext), toggleVideo = _c.toggleVideo, cameraActive = _c.videoIsEnabled;
    var _d = useToggleBlur(), blurIsActive = _d.blurIsActive, isBackgroundBlurSupported = _d.isBackgroundBlurSupported, toggleBlur = _d.toggleBlur;
    // const { backgroundIsActive, isBackgroundReplacementSupported, toggleBackground } = useToggleReplacement()
    var cameraButtonProps = {
        icon: cameraActive ? _jsx(Camera, {}) : _jsx(Camera, { disabled: true }),
        isSelected: true,
        popOver: (__spreadArray([], (isBackgroundBlurSupported ?
            [{
                    onClick: toggleBlur,
                    children: (_jsx("span", __assign({ style: { fontWeight: blurIsActive ? 'bold' : undefined } }, { children: blurIsActive ? "Disable Blur" : "Blur Background" })))
                }]
            : []), true)),
        onClick: toggleVideo,
        label: 'Camera',
    };
    var hangUpButtonProps = {
        icon: _jsx(Phone, {}),
        onClick: leaveMeeting,
        label: 'Leave',
    };
    return (_jsxs(BaseControlBar, __assign({ showLabels: true, layout: "bottom", css: "position: absolute;", style: style }, { children: [_jsx(AudioInputControl, {}), _jsx(AudioOutputControl, {}), _jsx(ControlBarButton, __assign({}, cameraButtonProps)), showScreenShare && _jsx(ContentShareControl, { iconTitle: "Screen", label: "Share" }), _jsx(ControlBarButton, __assign({}, hangUpButtonProps)), (isHost || showEndMeeting) &&
                _jsx(Flex, __assign({ style: { marginLeft: 30, marginRight: 20 } }, { children: _jsx(EndMeeting, { size: size, onLeave: onLeave }) }))] })));
};
//# sourceMappingURL=controls.js.map