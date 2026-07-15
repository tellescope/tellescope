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
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import Video, { LocalVideoTrack, LocalAudioTrack, } from 'twilio-video';
export var SCREEN_SHARE_TRACK_NAME = 'screen-share';
export var SCREEN_SHARE_AUDIO_TRACK_NAME = 'screen-share-audio';
export var BLUR_BACKGROUND_STORAGE_KEY = 'tellescope.twilio.blurBackground';
export var BLUR_BACKGROUND_ASSETS_PATH = '/twilio-video-processors';
var videoProcessorsModulePromise = null;
export var loadTwilioVideoProcessorsModule = function () {
    if (!videoProcessorsModulePromise) {
        videoProcessorsModulePromise = import('@twilio/video-processors');
    }
    return videoProcessorsModulePromise;
};
var readBlurPreference = function () {
    try {
        return typeof localStorage !== 'undefined'
            && localStorage.getItem(BLUR_BACKGROUND_STORAGE_KEY) === 'true';
    }
    catch (_a) {
        return false;
    }
};
var writeBlurPreference = function (enabled) {
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(BLUR_BACKGROUND_STORAGE_KEY, enabled ? 'true' : 'false');
        }
    }
    catch ( /* ignore */_a) { /* ignore */ }
};
var TwilioVideoContext = createContext(null);
export var useTwilioVideo = function () {
    var context = useContext(TwilioVideoContext);
    if (!context) {
        throw new Error('useTwilioVideo must be used within TwilioVideoProvider');
    }
    return context;
};
export var TwilioVideoProvider = function (_a) {
    var children = _a.children;
    var _b = useState(null), room = _b[0], setRoom = _b[1];
    var _c = useState(false), isConnecting = _c[0], setIsConnecting = _c[1];
    var _d = useState(null), localVideoTrack = _d[0], setLocalVideoTrack = _d[1];
    var _e = useState(null), localAudioTrack = _e[0], setLocalAudioTrack = _e[1];
    var _f = useState([]), participants = _f[0], setParticipants = _f[1];
    var _g = useState(null), error = _g[0], setError = _g[1];
    var _h = useState(false), isHost = _h[0], setIsHost = _h[1];
    var _j = useState(true), isVideoEnabled = _j[0], setIsVideoEnabled = _j[1];
    var _k = useState(true), isAudioEnabled = _k[0], setIsAudioEnabled = _k[1];
    var _l = useState(null), localScreenTrack = _l[0], setLocalScreenTrack = _l[1];
    var _m = useState(false), isScreenSharing = _m[0], setIsScreenSharing = _m[1];
    var _o = useState(null), screenSharingParticipantSid = _o[0], setScreenSharingParticipantSid = _o[1];
    var _p = useState(false), isBlurSupported = _p[0], setIsBlurSupported = _p[1];
    var _q = useState(readBlurPreference), isBlurEnabled = _q[0], setIsBlurEnabled = _q[1];
    var _r = useState(false), isBlurLoading = _r[0], setIsBlurLoading = _r[1];
    var localTracksRef = useRef([]);
    var screenAudioTrackRef = useRef(null);
    var blurProcessorRef = useRef(null);
    var blurAttachedTrackRef = useRef(null);
    var connect = useCallback(function (token, roomName) { return __awaiter(void 0, void 0, void 0, function () {
        var tracks, videoTrack, audioTrack, newRoom, existingParticipants, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsConnecting(true);
                    setError(null);
                    // Pick up any preference set by the pre-call preview, which lives outside
                    // this provider and only persists via localStorage.
                    setIsBlurEnabled(readBlurPreference());
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, Video.createLocalTracks({
                            audio: true,
                            video: { width: 640 },
                        })];
                case 2:
                    tracks = _a.sent();
                    localTracksRef.current = tracks;
                    videoTrack = tracks.find(function (track) { return track.kind === 'video'; });
                    audioTrack = tracks.find(function (track) { return track.kind === 'audio'; });
                    if (videoTrack)
                        setLocalVideoTrack(videoTrack);
                    if (audioTrack)
                        setLocalAudioTrack(audioTrack);
                    return [4 /*yield*/, Video.connect(token, {
                            name: roomName,
                            tracks: tracks,
                            dominantSpeaker: true,
                            networkQuality: { local: 1, remote: 1 },
                        })];
                case 3:
                    newRoom = _a.sent();
                    setRoom(newRoom);
                    existingParticipants = Array.from(newRoom.participants.values());
                    setParticipants(existingParticipants);
                    // Listen for new participants
                    newRoom.on('participantConnected', function (participant) {
                        setParticipants(function (prev) { return __spreadArray(__spreadArray([], prev, true), [participant], false); });
                    });
                    newRoom.on('participantDisconnected', function (participant) {
                        setParticipants(function (prev) { return prev.filter(function (p) { return p.sid !== participant.sid; }); });
                    });
                    // Track remote screen sharing for React re-renders
                    newRoom.on('trackSubscribed', function (track, publication, participant) {
                        if (track.kind === 'video' && track.name === SCREEN_SHARE_TRACK_NAME) {
                            setScreenSharingParticipantSid(participant.sid);
                        }
                    });
                    newRoom.on('trackUnsubscribed', function (track, publication, participant) {
                        if (track.kind === 'video' && track.name === SCREEN_SHARE_TRACK_NAME) {
                            setScreenSharingParticipantSid(null);
                        }
                    });
                    newRoom.on('disconnected', function () {
                        // Stop all local tracks when disconnected
                        localTracksRef.current.forEach(function (track) {
                            track.stop();
                        });
                        localTracksRef.current = [];
                        screenAudioTrackRef.current = null;
                        setRoom(null);
                        setLocalVideoTrack(null);
                        setLocalAudioTrack(null);
                        setLocalScreenTrack(null);
                        setIsScreenSharing(false);
                        setScreenSharingParticipantSid(null);
                        setParticipants([]);
                    });
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _a.sent();
                    setError(err_1);
                    console.error('Failed to connect to Twilio Video:', err_1);
                    return [3 /*break*/, 6];
                case 5:
                    setIsConnecting(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, []);
    var disconnect = useCallback(function () {
        if (room) {
            room.disconnect();
        }
        // Stop local tracks
        localTracksRef.current.forEach(function (track) {
            track.stop();
        });
        localTracksRef.current = [];
        screenAudioTrackRef.current = null;
        setRoom(null);
        setLocalVideoTrack(null);
        setLocalAudioTrack(null);
        setLocalScreenTrack(null);
        setIsScreenSharing(false);
        setScreenSharingParticipantSid(null);
        setParticipants([]);
    }, [room]);
    var toggleVideo = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (localVideoTrack) {
                if (isVideoEnabled) {
                    localVideoTrack.disable();
                }
                else {
                    localVideoTrack.enable();
                }
                setIsVideoEnabled(!isVideoEnabled);
            }
            return [2 /*return*/];
        });
    }); }, [localVideoTrack, isVideoEnabled]);
    var toggleAudio = useCallback(function () {
        if (localAudioTrack) {
            if (isAudioEnabled) {
                localAudioTrack.disable();
            }
            else {
                localAudioTrack.enable();
            }
            setIsAudioEnabled(!isAudioEnabled);
        }
    }, [localAudioTrack, isAudioEnabled]);
    var stopScreenShare = useCallback(function () {
        if (localScreenTrack) {
            if (room) {
                room.localParticipant.unpublishTrack(localScreenTrack);
            }
            localScreenTrack.stop();
            localTracksRef.current = localTracksRef.current.filter(function (t) { return t !== localScreenTrack; });
            setLocalScreenTrack(null);
            setIsScreenSharing(false);
        }
        // Tear down the accompanying screen-share audio track, if any
        if (screenAudioTrackRef.current) {
            var audioTrack_1 = screenAudioTrackRef.current;
            if (room) {
                room.localParticipant.unpublishTrack(audioTrack_1);
            }
            audioTrack_1.stop();
            localTracksRef.current = localTracksRef.current.filter(function (t) { return t !== audioTrack_1; });
            screenAudioTrackRef.current = null;
        }
    }, [localScreenTrack, room]);
    var toggleScreenShare = useCallback(function (options) { return __awaiter(void 0, void 0, void 0, function () {
        var stream, mediaStreamTrack, screenTrack_1, audioMediaStreamTrack, screenAudioTrack_1, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isScreenSharing) {
                        stopScreenShare();
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, navigator.mediaDevices.getDisplayMedia({ video: true, audio: !!(options === null || options === void 0 ? void 0 : options.shareAudio) })];
                case 2:
                    stream = _a.sent();
                    mediaStreamTrack = stream.getVideoTracks()[0];
                    screenTrack_1 = new LocalVideoTrack(mediaStreamTrack, { name: SCREEN_SHARE_TRACK_NAME });
                    if (!room) return [3 /*break*/, 4];
                    return [4 /*yield*/, room.localParticipant.publishTrack(screenTrack_1)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    localTracksRef.current.push(screenTrack_1);
                    setLocalScreenTrack(screenTrack_1);
                    setIsScreenSharing(true);
                    audioMediaStreamTrack = stream.getAudioTracks()[0];
                    screenAudioTrack_1 = null;
                    if (!audioMediaStreamTrack) return [3 /*break*/, 7];
                    screenAudioTrack_1 = new LocalAudioTrack(audioMediaStreamTrack, { name: SCREEN_SHARE_AUDIO_TRACK_NAME });
                    if (!room) return [3 /*break*/, 6];
                    return [4 /*yield*/, room.localParticipant.publishTrack(screenAudioTrack_1)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    localTracksRef.current.push(screenAudioTrack_1);
                    screenAudioTrackRef.current = screenAudioTrack_1;
                    _a.label = 7;
                case 7:
                    // Handle browser "Stop sharing" button
                    mediaStreamTrack.onended = function () {
                        if (room) {
                            room.localParticipant.unpublishTrack(screenTrack_1);
                        }
                        screenTrack_1.stop();
                        localTracksRef.current = localTracksRef.current.filter(function (t) { return t !== screenTrack_1; });
                        setLocalScreenTrack(null);
                        setIsScreenSharing(false);
                        if (screenAudioTrack_1) {
                            if (room) {
                                room.localParticipant.unpublishTrack(screenAudioTrack_1);
                            }
                            screenAudioTrack_1.stop();
                            localTracksRef.current = localTracksRef.current.filter(function (t) { return t !== screenAudioTrack_1; });
                            screenAudioTrackRef.current = null;
                        }
                    };
                    return [3 /*break*/, 9];
                case 8:
                    err_2 = _a.sent();
                    // User cancelled the screen share picker — not an error
                    console.log('Screen share cancelled or failed:', err_2);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); }, [isScreenSharing, stopScreenShare, room]);
    var toggleBlur = useCallback(function () {
        setIsBlurEnabled(function (prev) {
            var next = !prev;
            writeBlurPreference(next);
            return next;
        });
    }, []);
    // Probe video-processors support once on mount
    useEffect(function () {
        var mounted = true;
        loadTwilioVideoProcessorsModule()
            .then(function (_a) {
            var isSupported = _a.isSupported;
            if (mounted)
                setIsBlurSupported(!!isSupported);
        })
            .catch(function () { });
        return function () { mounted = false; };
    }, []);
    // Sync blur processor with the current local video track + enabled state
    useEffect(function () {
        if (!isBlurSupported)
            return;
        var track = localVideoTrack;
        var cancelled = false;
        var apply = function () { return __awaiter(void 0, void 0, void 0, function () {
            var previouslyAttached, GaussianBlurBackgroundProcessor, processor, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        previouslyAttached = blurAttachedTrackRef.current;
                        if (previouslyAttached && previouslyAttached !== track && blurProcessorRef.current) {
                            try {
                                previouslyAttached.removeProcessor(blurProcessorRef.current);
                            }
                            catch ( /* ignore */_b) { /* ignore */ }
                            blurAttachedTrackRef.current = null;
                        }
                        if (!track)
                            return [2 /*return*/];
                        if (!isBlurEnabled) return [3 /*break*/, 7];
                        if (!!blurProcessorRef.current) return [3 /*break*/, 6];
                        setIsBlurLoading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, loadTwilioVideoProcessorsModule()];
                    case 2:
                        GaussianBlurBackgroundProcessor = (_a.sent()).GaussianBlurBackgroundProcessor;
                        if (cancelled)
                            return [2 /*return*/];
                        processor = new GaussianBlurBackgroundProcessor({
                            assetsPath: BLUR_BACKGROUND_ASSETS_PATH,
                        });
                        return [4 /*yield*/, processor.loadModel()];
                    case 3:
                        _a.sent();
                        if (cancelled)
                            return [2 /*return*/];
                        blurProcessorRef.current = processor;
                        return [3 /*break*/, 6];
                    case 4:
                        err_3 = _a.sent();
                        console.error('Failed to load Twilio video blur processor:', err_3);
                        if (!cancelled)
                            setIsBlurEnabled(false);
                        return [2 /*return*/];
                    case 5:
                        if (!cancelled)
                            setIsBlurLoading(false);
                        return [7 /*endfinally*/];
                    case 6:
                        if (blurAttachedTrackRef.current !== track && blurProcessorRef.current) {
                            try {
                                track.addProcessor(blurProcessorRef.current, {
                                    inputFrameBufferType: 'videoframe',
                                    outputFrameBufferContextType: 'bitmaprenderer',
                                });
                                blurAttachedTrackRef.current = track;
                            }
                            catch (err) {
                                console.error('Failed to attach blur processor to track:', err);
                            }
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        if (blurAttachedTrackRef.current === track && blurProcessorRef.current) {
                            try {
                                track.removeProcessor(blurProcessorRef.current);
                            }
                            catch ( /* ignore */_c) { /* ignore */ }
                            blurAttachedTrackRef.current = null;
                        }
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        apply();
        return function () { cancelled = true; };
    }, [localVideoTrack, isBlurEnabled, isBlurSupported]);
    // Cleanup on unmount
    useEffect(function () {
        return function () {
            if (blurAttachedTrackRef.current && blurProcessorRef.current) {
                try {
                    blurAttachedTrackRef.current.removeProcessor(blurProcessorRef.current);
                }
                catch ( /* ignore */_a) { /* ignore */ }
            }
            blurAttachedTrackRef.current = null;
            if (room) {
                room.disconnect();
            }
            localTracksRef.current.forEach(function (track) {
                track.stop();
            });
        };
    }, []);
    var value = {
        room: room,
        isConnecting: isConnecting,
        isConnected: !!room,
        localVideoTrack: localVideoTrack,
        localAudioTrack: localAudioTrack,
        localScreenTrack: localScreenTrack,
        isScreenSharing: isScreenSharing,
        screenSharingParticipantSid: screenSharingParticipantSid,
        participants: participants,
        error: error,
        isHost: isHost,
        isVideoEnabled: isVideoEnabled,
        isAudioEnabled: isAudioEnabled,
        isBlurSupported: isBlurSupported,
        isBlurEnabled: isBlurEnabled,
        isBlurLoading: isBlurLoading,
        connect: connect,
        disconnect: disconnect,
        toggleVideo: toggleVideo,
        toggleAudio: toggleAudio,
        toggleScreenShare: toggleScreenShare,
        toggleBlur: toggleBlur,
        setIsHost: setIsHost,
    };
    return (_jsx(TwilioVideoContext.Provider, __assign({ value: value }, { children: children })));
};
//# sourceMappingURL=TwilioVideoContext.js.map