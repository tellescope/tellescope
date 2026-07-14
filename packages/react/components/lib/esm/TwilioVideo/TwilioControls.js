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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, } from '@mui/material';
import { Mic as MicIcon, MicOff as MicOffIcon, Videocam as VideocamIcon, VideocamOff as VideocamOffIcon, CallEnd as CallEndIcon, ScreenShare as ScreenShareIcon, StopScreenShare as StopScreenShareIcon, } from '@mui/icons-material';
import { useTwilioVideo } from './TwilioVideoContext';
import { BackgroundEffectSelector } from './BackgroundEffectSelector';
export var TwilioControlBar = function (_a) {
    var onLeave = _a.onLeave, onEndForAll = _a.onEndForAll, style = _a.style, _b = _a.showScreenShare, showScreenShareProp = _b === void 0 ? true : _b;
    var _c = useTwilioVideo(), isVideoEnabled = _c.isVideoEnabled, isAudioEnabled = _c.isAudioEnabled, isScreenSharing = _c.isScreenSharing, backgroundEffect = _c.backgroundEffect, isBackgroundEffectSupported = _c.isBackgroundEffectSupported, isImageBackgroundAvailable = _c.isImageBackgroundAvailable, isEffectLoading = _c.isEffectLoading, toggleVideo = _c.toggleVideo, toggleAudio = _c.toggleAudio, toggleScreenShare = _c.toggleScreenShare, setBackgroundEffect = _c.setBackgroundEffect, disconnect = _c.disconnect, isHost = _c.isHost, room = _c.room;
    var _d = useState(false), shareDialogOpen = _d[0], setShareDialogOpen = _d[1];
    var _e = useState(true), shareAudio = _e[0], setShareAudio = _e[1];
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
    return (_jsxs(_Fragment, { children: [_jsxs(Box, __assign({ sx: __assign({ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, backgroundColor: '#1a1a1a', padding: '12px 24px' }, style) }, { children: [_jsx(IconButton, __assign({ onClick: toggleAudio, sx: {
                            color: isAudioEnabled ? 'white' : '#ff4444',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.1)',
                            },
                        } }, { children: isAudioEnabled ? _jsx(MicIcon, {}) : _jsx(MicOffIcon, {}) })), _jsx(IconButton, __assign({ onClick: toggleVideo, sx: {
                            color: isVideoEnabled ? 'white' : '#ff4444',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.1)',
                            },
                        } }, { children: isVideoEnabled ? _jsx(VideocamIcon, {}) : _jsx(VideocamOffIcon, {}) })), isBackgroundEffectSupported && (_jsx(BackgroundEffectSelector, { effect: backgroundEffect, setEffect: setBackgroundEffect, isImageAvailable: isImageBackgroundAvailable, isLoading: isEffectLoading })), showScreenShareProp && supportsScreenShare && (_jsx(IconButton, __assign({ onClick: handleScreenShareClick, disabled: !room, sx: {
                            color: isScreenSharing ? '#4caf50' : 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.1)',
                            },
                            '&.Mui-disabled': {
                                color: 'rgba(255,255,255,0.3)',
                            },
                        } }, { children: isScreenSharing ? _jsx(StopScreenShareIcon, {}) : _jsx(ScreenShareIcon, {}) }))), _jsx(IconButton, __assign({ onClick: handleLeave, sx: {
                            backgroundColor: '#ff4444',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#cc3333',
                            },
                        } }, { children: _jsx(CallEndIcon, {}) })), isHost && onEndForAll && (_jsx(Button, __assign({ variant: "outlined", onClick: handleEndForAll, sx: {
                            color: 'white',
                            borderColor: 'white',
                            marginLeft: 2,
                            '&:hover': {
                                borderColor: '#ff4444',
                                color: '#ff4444',
                            },
                        } }, { children: "End For All" })))] })), _jsxs(Dialog, __assign({ open: shareDialogOpen, onClose: function () { return setShareDialogOpen(false); } }, { children: [_jsx(DialogTitle, { children: "Share your screen" }), _jsx(DialogContent, { children: _jsx(FormControlLabel, { control: (_jsx(Checkbox, { checked: shareAudio, onChange: function (e) { return setShareAudio(e.target.checked); } })), label: "Also share audio" }) }), _jsxs(DialogActions, { children: [_jsx(Button, __assign({ onClick: function () { return setShareDialogOpen(false); } }, { children: "Cancel" })), _jsx(Button, __assign({ variant: "contained", onClick: handleConfirmShare }, { children: "Share" }))] })] }))] }));
};
//# sourceMappingURL=TwilioControls.js.map