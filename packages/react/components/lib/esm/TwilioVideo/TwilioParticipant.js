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
import { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { SCREEN_SHARE_TRACK_NAME } from './TwilioVideoContext';
/** Renders a single remote audio track into its own <audio> element. */
var RemoteAudioTrackElement = function (_a) {
    var track = _a.track;
    var audioRef = useRef(null);
    useEffect(function () {
        if (audioRef.current) {
            var el_1 = audioRef.current;
            track.attach(el_1);
            return function () {
                track.detach(el_1);
            };
        }
    }, [track]);
    return _jsx("audio", { ref: audioRef, autoPlay: true });
};
export var TwilioParticipant = function (_a) {
    var participant = _a.participant, _b = _a.isLocal, isLocal = _b === void 0 ? false : _b, style = _a.style, _c = _a.resolveIdentity, resolveIdentity = _c === void 0 ? function () { return ''; } : _c, _d = _a.showScreenShare, showScreenShare = _d === void 0 ? false : _d;
    var videoRef = useRef(null);
    var _e = useState(null), cameraTrack = _e[0], setCameraTrack = _e[1];
    var _f = useState(null), screenTrack = _f[0], setScreenTrack = _f[1];
    var _g = useState([]), audioTracks = _g[0], setAudioTracks = _g[1];
    useEffect(function () {
        var handleTrackSubscribed = function (track) {
            if (track.kind === 'video') {
                if (track.name === SCREEN_SHARE_TRACK_NAME) {
                    setScreenTrack(track);
                }
                else {
                    setCameraTrack(track);
                }
            }
            else if (track.kind === 'audio') {
                // Support multiple simultaneous audio tracks (e.g. microphone + screen-share audio).
                // Add by identity, deduping so the same track isn't attached twice.
                setAudioTracks(function (prev) { return (prev.includes(track) ? prev : __spreadArray(__spreadArray([], prev, true), [track], false)); });
            }
        };
        var handleTrackUnsubscribed = function (track) {
            if (track.kind === 'video') {
                if (track.name === SCREEN_SHARE_TRACK_NAME) {
                    setScreenTrack(null);
                }
                else {
                    setCameraTrack(null);
                }
            }
            else if (track.kind === 'audio') {
                setAudioTracks(function (prev) { return prev.filter(function (t) { return t !== track; }); });
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
    useEffect(function () {
        if (activeVideoTrack && videoRef.current) {
            var el_2 = videoRef.current;
            activeVideoTrack.attach(el_2);
            return function () {
                activeVideoTrack.detach(el_2);
            };
        }
    }, [activeVideoTrack]);
    var shouldMirror = isLocal && !showScreenShare;
    return (_jsxs(Box, __assign({ sx: __assign({ position: 'relative', width: '100%', height: '100%', backgroundColor: '#1a1a1a', borderRadius: 1, overflow: 'hidden' }, style) }, { children: [_jsx("video", { ref: videoRef, autoPlay: true, muted: isLocal, playsInline: true, style: {
                    width: '100%',
                    height: '100%',
                    objectFit: showScreenShare ? 'contain' : 'cover',
                    transform: shouldMirror ? 'scaleX(-1)' : 'none',
                } }), !isLocal && audioTracks.map(function (track) { return (_jsx(RemoteAudioTrackElement, { track: track }, track.sid)); }), (function () {
                var label = resolveIdentity(participant.identity);
                if (!label && !isLocal)
                    return null;
                return (_jsxs(Typography, __assign({ variant: "caption", sx: {
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
//# sourceMappingURL=TwilioParticipant.js.map