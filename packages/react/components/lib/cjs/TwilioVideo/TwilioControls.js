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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioControlBar = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var TwilioVideoContext_1 = require("./TwilioVideoContext");
var TwilioControlBar = function (_a) {
    var onLeave = _a.onLeave, onEndForAll = _a.onEndForAll, style = _a.style, _b = _a.showScreenShare, showScreenShareProp = _b === void 0 ? true : _b;
    var _c = (0, TwilioVideoContext_1.useTwilioVideo)(), isVideoEnabled = _c.isVideoEnabled, isAudioEnabled = _c.isAudioEnabled, isScreenSharing = _c.isScreenSharing, isBlurSupported = _c.isBlurSupported, isBlurEnabled = _c.isBlurEnabled, isBlurLoading = _c.isBlurLoading, toggleVideo = _c.toggleVideo, toggleAudio = _c.toggleAudio, toggleScreenShare = _c.toggleScreenShare, toggleBlur = _c.toggleBlur, disconnect = _c.disconnect, isHost = _c.isHost, room = _c.room;
    var _d = (0, react_1.useState)(false), shareDialogOpen = _d[0], setShareDialogOpen = _d[1];
    var _e = (0, react_1.useState)(true), shareAudio = _e[0], setShareAudio = _e[1];
    var handleScreenShareClick = function () {
        if (isScreenSharing) {
            // Already sharing — stop immediately, no dialog
            toggleScreenShare();
        }
        else {
            setShareDialogOpen(true);
        }
    };
    var handleConfirmShare = function () {
        // This click is a user gesture, so getDisplayMedia is allowed
        toggleScreenShare({ shareAudio: shareAudio });
        setShareDialogOpen(false);
    };
    var handleLeave = function () {
        disconnect();
        onLeave === null || onLeave === void 0 ? void 0 : onLeave();
    };
    var handleEndForAll = function () {
        onEndForAll === null || onEndForAll === void 0 ? void 0 : onEndForAll();
        disconnect();
    };
    var supportsScreenShare = typeof navigator !== 'undefined'
        && navigator.mediaDevices
        && typeof navigator.mediaDevices.getDisplayMedia === 'function';
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(material_1.Box, __assign({ sx: __assign({ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, backgroundColor: '#1a1a1a', padding: '12px 24px' }, style) }, { children: [(0, jsx_runtime_1.jsx)(material_1.IconButton, __assign({ onClick: toggleAudio, sx: {
                            color: isAudioEnabled ? 'white' : '#ff4444',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.1)',
                            },
                        } }, { children: isAudioEnabled ? (0, jsx_runtime_1.jsx)(icons_material_1.Mic, {}) : (0, jsx_runtime_1.jsx)(icons_material_1.MicOff, {}) })), (0, jsx_runtime_1.jsx)(material_1.IconButton, __assign({ onClick: toggleVideo, sx: {
                            color: isVideoEnabled ? 'white' : '#ff4444',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.1)',
                            },
                        } }, { children: isVideoEnabled ? (0, jsx_runtime_1.jsx)(icons_material_1.Videocam, {}) : (0, jsx_runtime_1.jsx)(icons_material_1.VideocamOff, {}) })), isBlurSupported && ((0, jsx_runtime_1.jsx)(material_1.IconButton, __assign({ onClick: toggleBlur, disabled: isBlurLoading, sx: {
                            color: isBlurEnabled ? '#4caf50' : 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.1)',
                            },
                            '&.Mui-disabled': {
                                color: 'rgba(255,255,255,0.5)',
                            },
                        } }, { children: isBlurLoading
                            ? (0, jsx_runtime_1.jsx)(material_1.CircularProgress, { size: 20, sx: { color: 'white' } })
                            : isBlurEnabled ? (0, jsx_runtime_1.jsx)(icons_material_1.BlurOn, {}) : (0, jsx_runtime_1.jsx)(icons_material_1.BlurOff, {}) }))), showScreenShareProp && supportsScreenShare && ((0, jsx_runtime_1.jsx)(material_1.IconButton, __assign({ onClick: handleScreenShareClick, disabled: !room, sx: {
                            color: isScreenSharing ? '#4caf50' : 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.1)',
                            },
                            '&.Mui-disabled': {
                                color: 'rgba(255,255,255,0.3)',
                            },
                        } }, { children: isScreenSharing ? (0, jsx_runtime_1.jsx)(icons_material_1.StopScreenShare, {}) : (0, jsx_runtime_1.jsx)(icons_material_1.ScreenShare, {}) }))), (0, jsx_runtime_1.jsx)(material_1.IconButton, __assign({ onClick: handleLeave, sx: {
                            backgroundColor: '#ff4444',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#cc3333',
                            },
                        } }, { children: (0, jsx_runtime_1.jsx)(icons_material_1.CallEnd, {}) })), isHost && onEndForAll && ((0, jsx_runtime_1.jsx)(material_1.Button, __assign({ variant: "outlined", onClick: handleEndForAll, sx: {
                            color: 'white',
                            borderColor: 'white',
                            marginLeft: 2,
                            '&:hover': {
                                borderColor: '#ff4444',
                                color: '#ff4444',
                            },
                        } }, { children: "End For All" })))] })), (0, jsx_runtime_1.jsxs)(material_1.Dialog, __assign({ open: shareDialogOpen, onClose: function () { return setShareDialogOpen(false); } }, { children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: "Share your screen" }), (0, jsx_runtime_1.jsx)(material_1.DialogContent, { children: (0, jsx_runtime_1.jsx)(material_1.FormControlLabel, { control: ((0, jsx_runtime_1.jsx)(material_1.Checkbox, { checked: shareAudio, onChange: function (e) { return setShareAudio(e.target.checked); } })), label: "Also share audio" }) }), (0, jsx_runtime_1.jsxs)(material_1.DialogActions, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, __assign({ onClick: function () { return setShareDialogOpen(false); } }, { children: "Cancel" })), (0, jsx_runtime_1.jsx)(material_1.Button, __assign({ variant: "contained", onClick: handleConfirmShare }, { children: "Share" }))] })] }))] }));
};
exports.TwilioControlBar = TwilioControlBar;
//# sourceMappingURL=TwilioControls.js.map