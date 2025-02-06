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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlBar = exports.LeaveMeeting = exports.EndMeeting = exports.MicrophoneToggle = exports.VideoToggle = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// components that work with web or native
var react_1 = __importStar(require("react"));
var react_components_1 = require("@tellescope/react-components");
var video_shared_1 = require("./video_shared");
var video_1 = require("./video");
var _1 = require(".");
var amazon_chime_sdk_component_library_react_1 = require("amazon-chime-sdk-component-library-react");
var amazon_chime_sdk_js_1 = require("amazon-chime-sdk-js");
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
var useToggleBlur = function () {
    var meetingManager = (0, amazon_chime_sdk_component_library_react_1.useMeetingManager)();
    var selectedDevice = (0, amazon_chime_sdk_component_library_react_1.useVideoInputs)().selectedDevice;
    var _a = (0, amazon_chime_sdk_component_library_react_1.useBackgroundBlur)(), isBackgroundBlurSupported = _a.isBackgroundBlurSupported, createBackgroundBlurDevice = _a.createBackgroundBlurDevice;
    var _b = (0, react_1.useState)(false), isVideoTransformCheckBoxOn = _b[0], setisVideoTransformCheckBoxOn = _b[1];
    (0, react_1.useEffect)(function () {
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
                            if (!(0, amazon_chime_sdk_js_1.isVideoTransformDevice)(selectedDevice)) return [3 /*break*/, 4];
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
    var toggleBlur = (0, react_1.useCallback)(function () { return setisVideoTransformCheckBoxOn(function (current) { return !current; }); }, []);
    return {
        blurIsActive: isVideoTransformCheckBoxOn,
        isBackgroundBlurSupported: isBackgroundBlurSupported,
        toggleBlur: toggleBlur,
    };
};
var ControlBar = function (_a) {
    var onLeave = _a.onLeave, style = _a.style, _b = _a.spacing, spacing = _b === void 0 ? 15 : _b, size = _a.size, showEndMeeting = _a.showEndMeeting, showScreenShare = _a.showScreenShare, showBlurToggle = _a.showBlurToggle;
    var isHost = react_1.default.useContext(video_shared_1.CurrentCallContext).isHost;
    var itemStyle = { marginLeft: spacing, marginRight: spacing };
    var leaveMeeting = (0, _1.useJoinVideoCall)().leaveMeeting;
    var _c = react_1.default.useContext(video_shared_1.CurrentCallContext), toggleVideo = _c.toggleVideo, cameraActive = _c.videoIsEnabled;
    var _d = useToggleBlur(), blurIsActive = _d.blurIsActive, isBackgroundBlurSupported = _d.isBackgroundBlurSupported, toggleBlur = _d.toggleBlur;
    // const { backgroundIsActive, isBackgroundReplacementSupported, toggleBackground } = useToggleReplacement()
    var cameraButtonProps = {
        icon: cameraActive ? (0, jsx_runtime_1.jsx)(amazon_chime_sdk_component_library_react_1.Camera, {}) : (0, jsx_runtime_1.jsx)(amazon_chime_sdk_component_library_react_1.Camera, { disabled: true }),
        isSelected: true,
        popOver: (__spreadArray([], (isBackgroundBlurSupported ?
            [{
                    onClick: toggleBlur,
                    children: ((0, jsx_runtime_1.jsx)("span", __assign({ style: { fontWeight: blurIsActive ? 'bold' : undefined } }, { children: blurIsActive ? "Disable Blur" : "Blur Background" })))
                }]
            : []), true)),
        onClick: toggleVideo,
        label: 'Camera',
    };
    var hangUpButtonProps = {
        icon: (0, jsx_runtime_1.jsx)(amazon_chime_sdk_component_library_react_1.Phone, {}),
        onClick: leaveMeeting,
        label: 'Leave',
    };
    return ((0, jsx_runtime_1.jsxs)(amazon_chime_sdk_component_library_react_1.ControlBar, __assign({ showLabels: true, layout: "bottom", css: "position: absolute;", style: style }, { children: [(0, jsx_runtime_1.jsx)(amazon_chime_sdk_component_library_react_1.AudioInputControl, {}), (0, jsx_runtime_1.jsx)(amazon_chime_sdk_component_library_react_1.AudioOutputControl, {}), (0, jsx_runtime_1.jsx)(amazon_chime_sdk_component_library_react_1.ControlBarButton, __assign({}, cameraButtonProps)), showScreenShare && (0, jsx_runtime_1.jsx)(amazon_chime_sdk_component_library_react_1.ContentShareControl, { iconTitle: "Screen", label: "Share" }), (0, jsx_runtime_1.jsx)(amazon_chime_sdk_component_library_react_1.ControlBarButton, __assign({}, hangUpButtonProps)), (isHost || showEndMeeting) &&
                (0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ style: { marginLeft: 30, marginRight: 20 } }, { children: (0, jsx_runtime_1.jsx)(exports.EndMeeting, { size: size, onLeave: onLeave }) }))] })));
};
exports.ControlBar = ControlBar;
//# sourceMappingURL=controls.js.map