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
import { Box, IconButton, Button } from '@mui/material';
import { Mic as MicIcon, MicOff as MicOffIcon, Videocam as VideocamIcon, VideocamOff as VideocamOffIcon, CallEnd as CallEndIcon, ScreenShare as ScreenShareIcon, StopScreenShare as StopScreenShareIcon, } from '@mui/icons-material';
import { useTwilioVideo } from './TwilioVideoContext';
export var TwilioControlBar = function (_a) {
    var onLeave = _a.onLeave, onEndForAll = _a.onEndForAll, style = _a.style, _b = _a.showScreenShare, showScreenShareProp = _b === void 0 ? true : _b;
    var _c = useTwilioVideo(), isVideoEnabled = _c.isVideoEnabled, isAudioEnabled = _c.isAudioEnabled, isScreenSharing = _c.isScreenSharing, toggleVideo = _c.toggleVideo, toggleAudio = _c.toggleAudio, toggleScreenShare = _c.toggleScreenShare, disconnect = _c.disconnect, isHost = _c.isHost, room = _c.room;
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
    return (_jsxs(Box, __assign({ sx: __assign({ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, backgroundColor: '#1a1a1a', padding: '12px 24px' }, style) }, { children: [_jsx(IconButton, __assign({ onClick: toggleAudio, sx: {
                    color: isAudioEnabled ? 'white' : '#ff4444',
                    '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                } }, { children: isAudioEnabled ? _jsx(MicIcon, {}) : _jsx(MicOffIcon, {}) })), _jsx(IconButton, __assign({ onClick: toggleVideo, sx: {
                    color: isVideoEnabled ? 'white' : '#ff4444',
                    '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                } }, { children: isVideoEnabled ? _jsx(VideocamIcon, {}) : _jsx(VideocamOffIcon, {}) })), showScreenShareProp && supportsScreenShare && (_jsx(IconButton, __assign({ onClick: toggleScreenShare, disabled: !room, sx: {
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
                } }, { children: "End For All" })))] })));
};
//# sourceMappingURL=TwilioControls.js.map