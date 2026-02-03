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
exports.TwilioParticipant = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var material_1 = require("@mui/material");
var TwilioParticipant = function (_a) {
    var participant = _a.participant, _b = _a.isLocal, isLocal = _b === void 0 ? false : _b, style = _a.style, _c = _a.resolveIdentity, resolveIdentity = _c === void 0 ? function () { return ''; } : _c;
    var videoRef = (0, react_1.useRef)(null);
    var audioRef = (0, react_1.useRef)(null);
    var _d = (0, react_1.useState)(null), videoTrack = _d[0], setVideoTrack = _d[1];
    var _e = (0, react_1.useState)(null), audioTrack = _e[0], setAudioTrack = _e[1];
    (0, react_1.useEffect)(function () {
        var handleTrackSubscribed = function (track) {
            if (track.kind === 'video') {
                setVideoTrack(track);
            }
            else if (track.kind === 'audio') {
                setAudioTrack(track);
            }
        };
        var handleTrackUnsubscribed = function (track) {
            if (track.kind === 'video') {
                setVideoTrack(null);
            }
            else if (track.kind === 'audio') {
                setAudioTrack(null);
            }
        };
        // Get existing tracks
        participant.tracks.forEach(function (publication) {
            if (publication.track) {
                handleTrackSubscribed(publication.track);
            }
        });
        // For remote participants, listen for track subscriptions
        if ('on' in participant) {
            participant.on('trackSubscribed', handleTrackSubscribed);
            participant.on('trackUnsubscribed', handleTrackUnsubscribed);
        }
        return function () {
            if ('off' in participant) {
                participant.off('trackSubscribed', handleTrackSubscribed);
                participant.off('trackUnsubscribed', handleTrackUnsubscribed);
            }
        };
    }, [participant]);
    // Attach video track
    (0, react_1.useEffect)(function () {
        if (videoTrack && videoRef.current) {
            videoTrack.attach(videoRef.current);
            return function () {
                videoTrack.detach();
            };
        }
    }, [videoTrack]);
    // Attach audio track (not for local participant to avoid echo)
    (0, react_1.useEffect)(function () {
        if (audioTrack && audioRef.current && !isLocal) {
            audioTrack.attach(audioRef.current);
            return function () {
                audioTrack.detach();
            };
        }
    }, [audioTrack, isLocal]);
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, __assign({ sx: __assign({ position: 'relative', width: '100%', height: '100%', backgroundColor: '#1a1a1a', borderRadius: 1, overflow: 'hidden' }, style) }, { children: [(0, jsx_runtime_1.jsx)("video", { ref: videoRef, autoPlay: true, muted: isLocal, playsInline: true, style: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: isLocal ? 'scaleX(-1)' : 'none',
                } }), !isLocal && (0, jsx_runtime_1.jsx)("audio", { ref: audioRef, autoPlay: true }), (function () {
                var label = resolveIdentity(participant.identity);
                if (!label && !isLocal)
                    return null;
                return ((0, jsx_runtime_1.jsxs)(material_1.Typography, __assign({ variant: "caption", sx: {
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        color: 'white',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        padding: '2px 8px',
                        borderRadius: 1,
                    } }, { children: [label, isLocal && (label ? ' (You)' : '(You)')] })));
            })()] })));
};
exports.TwilioParticipant = TwilioParticipant;
//# sourceMappingURL=TwilioParticipant.js.map