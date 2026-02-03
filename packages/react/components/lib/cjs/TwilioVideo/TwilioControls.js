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
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var TwilioVideoContext_1 = require("./TwilioVideoContext");
var TwilioControlBar = function (_a) {
    var onLeave = _a.onLeave, onEndForAll = _a.onEndForAll, style = _a.style;
    var _b = (0, TwilioVideoContext_1.useTwilioVideo)(), isVideoEnabled = _b.isVideoEnabled, isAudioEnabled = _b.isAudioEnabled, toggleVideo = _b.toggleVideo, toggleAudio = _b.toggleAudio, disconnect = _b.disconnect, isHost = _b.isHost;
    var handleLeave = function () {
        disconnect();
        onLeave === null || onLeave === void 0 ? void 0 : onLeave();
    };
    var handleEndForAll = function () {
        onEndForAll === null || onEndForAll === void 0 ? void 0 : onEndForAll();
        disconnect();
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, __assign({ sx: __assign({ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, backgroundColor: '#1a1a1a', padding: '12px 24px' }, style) }, { children: [(0, jsx_runtime_1.jsx)(material_1.IconButton, __assign({ onClick: toggleAudio, sx: {
                    color: isAudioEnabled ? 'white' : '#ff4444',
                    '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                } }, { children: isAudioEnabled ? (0, jsx_runtime_1.jsx)(icons_material_1.Mic, {}) : (0, jsx_runtime_1.jsx)(icons_material_1.MicOff, {}) })), (0, jsx_runtime_1.jsx)(material_1.IconButton, __assign({ onClick: toggleVideo, sx: {
                    color: isVideoEnabled ? 'white' : '#ff4444',
                    '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                } }, { children: isVideoEnabled ? (0, jsx_runtime_1.jsx)(icons_material_1.Videocam, {}) : (0, jsx_runtime_1.jsx)(icons_material_1.VideocamOff, {}) })), (0, jsx_runtime_1.jsx)(material_1.IconButton, __assign({ onClick: handleLeave, sx: {
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
                } }, { children: "End For All" })))] })));
};
exports.TwilioControlBar = TwilioControlBar;
//# sourceMappingURL=TwilioControls.js.map