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
var TwilioVideoContext_1 = require("./TwilioVideoContext");
var TwilioParticipant = function (_a) {
    var participant = _a.participant, _b = _a.isLocal, isLocal = _b === void 0 ? false : _b, style = _a.style, _c = _a.resolveIdentity, resolveIdentity = _c === void 0 ? function () { return ''; } : _c, _d = _a.showScreenShare, showScreenShare = _d === void 0 ? false : _d;
    var videoRef = (0, react_1.useRef)(null);
    var audioRef = (0, react_1.useRef)(null);
    var _e = (0, react_1.useState)(null), cameraTrack = _e[0], setCameraTrack = _e[1];
    var _f = (0, react_1.useState)(null), screenTrack = _f[0], setScreenTrack = _f[1];
    var _g = (0, react_1.useState)(null), audioTrack = _g[0], setAudioTrack = _g[1];
    (0, react_1.useEffect)(function () {
        var handleTrackSubscribed = function (track) {
            if (track.kind === 'video') {
                if (track.name === TwilioVideoContext_1.SCREEN_SHARE_TRACK_NAME) {
                    setScreenTrack(track);
                }
                else {
                    setCameraTrack(track);
                }
            }
            else if (track.kind === 'audio') {
                setAudioTrack(track);
            }
        };
        var handleTrackUnsubscribed = function (track) {
            if (track.kind === 'video') {
                if (track.name === TwilioVideoContext_1.SCREEN_SHARE_TRACK_NAME) {
                    setScreenTrack(null);
                }
                else {
                    setCameraTrack(null);
                }
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
        if (isLocal) {
            // For local participants, listen for track publications (trackSubscribed doesn't fire for local)
            var handleTrackPublished_1 = function (publication) {
                if (publication.track) {
                    handleTrackSubscribed(publication.track);
                }
            };
            var handleTrackStopped_1 = function (track) {
                handleTrackUnsubscribed(track);
            };
            participant.on('trackPublished', handleTrackPublished_1);
            participant.on('trackStopped', handleTrackStopped_1);
            return function () {
                participant.off('trackPublished', handleTrackPublished_1);
                participant.off('trackStopped', handleTrackStopped_1);
            };
        }
        else {
            // For remote participants, listen for track subscriptions
            participant.on('trackSubscribed', handleTrackSubscribed);
            participant.on('trackUnsubscribed', handleTrackUnsubscribed);
            return function () {
                participant.off('trackSubscribed', handleTrackSubscribed);
                participant.off('trackUnsubscribed', handleTrackUnsubscribed);
            };
        }
    }, [participant, isLocal]);
    var activeVideoTrack = showScreenShare ? screenTrack : cameraTrack;
    // Attach video track
    (0, react_1.useEffect)(function () {
        if (activeVideoTrack && videoRef.current) {
            var el_1 = videoRef.current;
            activeVideoTrack.attach(el_1);
            return function () {
                activeVideoTrack.detach(el_1);
            };
        }
    }, [activeVideoTrack]);
    // Attach audio track (not for local participant to avoid echo)
    (0, react_1.useEffect)(function () {
        if (audioTrack && audioRef.current && !isLocal) {
            var el_2 = audioRef.current;
            audioTrack.attach(el_2);
            return function () {
                audioTrack.detach(el_2);
            };
        }
    }, [audioTrack, isLocal]);
    var shouldMirror = isLocal && !showScreenShare;
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, __assign({ sx: __assign({ position: 'relative', width: '100%', height: '100%', backgroundColor: '#1a1a1a', borderRadius: 1, overflow: 'hidden' }, style) }, { children: [(0, jsx_runtime_1.jsx)("video", { ref: videoRef, autoPlay: true, muted: isLocal, playsInline: true, style: {
                    width: '100%',
                    height: '100%',
                    objectFit: showScreenShare ? 'contain' : 'cover',
                    transform: shouldMirror ? 'scaleX(-1)' : 'none',
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