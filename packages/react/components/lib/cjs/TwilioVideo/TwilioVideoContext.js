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
exports.TwilioVideoProvider = exports.useTwilioVideo = exports.BLUR_BACKGROUND_ASSETS_PATH = exports.loadTwilioVideoProcessorsModule = exports.SCREEN_SHARE_AUDIO_TRACK_NAME = exports.SCREEN_SHARE_TRACK_NAME = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var twilio_video_1 = __importStar(require("twilio-video"));
var backgroundEffects_1 = require("./backgroundEffects");
exports.SCREEN_SHARE_TRACK_NAME = 'screen-share';
exports.SCREEN_SHARE_AUDIO_TRACK_NAME = 'screen-share-audio';
// Re-exported for convenience / backward compatibility
var backgroundEffects_2 = require("./backgroundEffects");
Object.defineProperty(exports, "loadTwilioVideoProcessorsModule", { enumerable: true, get: function () { return backgroundEffects_2.loadTwilioVideoProcessorsModule; } });
Object.defineProperty(exports, "BLUR_BACKGROUND_ASSETS_PATH", { enumerable: true, get: function () { return backgroundEffects_2.BLUR_BACKGROUND_ASSETS_PATH; } });
var TwilioVideoContext = (0, react_1.createContext)(null);
var useTwilioVideo = function () {
    var context = (0, react_1.useContext)(TwilioVideoContext);
    if (!context) {
        throw new Error('useTwilioVideo must be used within TwilioVideoProvider');
    }
    return context;
};
exports.useTwilioVideo = useTwilioVideo;
var TwilioVideoProvider = function (_a) {
    var children = _a.children, backgroundImageURL = _a.backgroundImageURL;
    var _b = (0, react_1.useState)(null), room = _b[0], setRoom = _b[1];
    var _c = (0, react_1.useState)(false), isConnecting = _c[0], setIsConnecting = _c[1];
    var _d = (0, react_1.useState)(null), localVideoTrack = _d[0], setLocalVideoTrack = _d[1];
    var _e = (0, react_1.useState)(null), localAudioTrack = _e[0], setLocalAudioTrack = _e[1];
    var _f = (0, react_1.useState)([]), participants = _f[0], setParticipants = _f[1];
    var _g = (0, react_1.useState)(null), error = _g[0], setError = _g[1];
    var _h = (0, react_1.useState)(false), isHost = _h[0], setIsHost = _h[1];
    var _j = (0, react_1.useState)(true), isVideoEnabled = _j[0], setIsVideoEnabled = _j[1];
    var _k = (0, react_1.useState)(true), isAudioEnabled = _k[0], setIsAudioEnabled = _k[1];
    var _l = (0, react_1.useState)(null), localScreenTrack = _l[0], setLocalScreenTrack = _l[1];
    var _m = (0, react_1.useState)(false), isScreenSharing = _m[0], setIsScreenSharing = _m[1];
    var _o = (0, react_1.useState)(null), screenSharingParticipantSid = _o[0], setScreenSharingParticipantSid = _o[1];
    var _p = (0, react_1.useState)(false), isBackgroundEffectSupported = _p[0], setIsBackgroundEffectSupported = _p[1];
    var _q = (0, react_1.useState)(backgroundEffects_1.readEffectPreference), backgroundEffect = _q[0], setBackgroundEffectState = _q[1];
    var _r = (0, react_1.useState)(false), isEffectLoading = _r[0], setIsEffectLoading = _r[1];
    var _s = (0, react_1.useState)(null), backgroundImageEl = _s[0], setBackgroundImageEl = _s[1];
    var localTracksRef = (0, react_1.useRef)([]);
    // Mirrors the room state so unmount/page-unload cleanup can reach the live
    // room without re-registering listeners (state closures go stale)
    var roomRef = (0, react_1.useRef)(null);
    var screenAudioTrackRef = (0, react_1.useRef)(null);
    var backgroundControllerRef = (0, react_1.useRef)(new backgroundEffects_1.BackgroundEffectController());
    var isImageBackgroundAvailable = isBackgroundEffectSupported && !!backgroundImageURL;
    var connect = (0, react_1.useCallback)(function (token, roomName) { return __awaiter(void 0, void 0, void 0, function () {
        var tracks, videoTrack, audioTrack, newRoom, existingParticipants, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsConnecting(true);
                    setError(null);
                    // Pick up any preference set by the pre-call preview, which lives outside
                    // this provider and only persists via localStorage.
                    setBackgroundEffectState((0, backgroundEffects_1.readEffectPreference)());
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, twilio_video_1.default.createLocalTracks({
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
                    return [4 /*yield*/, twilio_video_1.default.connect(token, {
                            name: roomName,
                            tracks: tracks,
                            dominantSpeaker: true,
                            networkQuality: { local: 1, remote: 1 },
                        })];
                case 3:
                    newRoom = _a.sent();
                    setRoom(newRoom);
                    roomRef.current = newRoom;
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
                        if (track.kind === 'video' && track.name === exports.SCREEN_SHARE_TRACK_NAME) {
                            setScreenSharingParticipantSid(participant.sid);
                        }
                    });
                    newRoom.on('trackUnsubscribed', function (track, publication, participant) {
                        if (track.kind === 'video' && track.name === exports.SCREEN_SHARE_TRACK_NAME) {
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
                        roomRef.current = null;
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
    var disconnect = (0, react_1.useCallback)(function () {
        if (room) {
            room.disconnect();
        }
        // Stop local tracks
        localTracksRef.current.forEach(function (track) {
            track.stop();
        });
        localTracksRef.current = [];
        screenAudioTrackRef.current = null;
        roomRef.current = null;
        setRoom(null);
        setLocalVideoTrack(null);
        setLocalAudioTrack(null);
        setLocalScreenTrack(null);
        setIsScreenSharing(false);
        setScreenSharingParticipantSid(null);
        setParticipants([]);
    }, [room]);
    var toggleVideo = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
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
    var toggleAudio = (0, react_1.useCallback)(function () {
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
    var stopScreenShare = (0, react_1.useCallback)(function () {
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
    var toggleScreenShare = (0, react_1.useCallback)(function (options) { return __awaiter(void 0, void 0, void 0, function () {
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
                    screenTrack_1 = new twilio_video_1.LocalVideoTrack(mediaStreamTrack, { name: exports.SCREEN_SHARE_TRACK_NAME });
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
                    screenAudioTrack_1 = new twilio_video_1.LocalAudioTrack(audioMediaStreamTrack, { name: exports.SCREEN_SHARE_AUDIO_TRACK_NAME });
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
    var setBackgroundEffect = (0, react_1.useCallback)(function (effect) {
        setBackgroundEffectState(effect);
        (0, backgroundEffects_1.writeEffectPreference)(effect);
    }, []);
    // Probe video-processors support once on mount
    (0, react_1.useEffect)(function () {
        var mounted = true;
        (0, backgroundEffects_1.loadTwilioVideoProcessorsModule)()
            .then(function (_a) {
            var isSupported = _a.isSupported;
            if (mounted)
                setIsBackgroundEffectSupported(!!isSupported);
        })
            .catch(function () { });
        return function () { mounted = false; };
    }, []);
    // Load the background image once per URL
    (0, react_1.useEffect)(function () {
        if (!backgroundImageURL) {
            setBackgroundImageEl(null);
            return;
        }
        var cancelled = false;
        (0, backgroundEffects_1.loadBackgroundImage)(backgroundImageURL)
            .then(function (img) { if (!cancelled)
            setBackgroundImageEl(img); })
            .catch(function (err) {
            console.error('Failed to load Twilio background image:', err);
            if (!cancelled)
                setBackgroundImageEl(null);
        });
        return function () { cancelled = true; };
    }, [backgroundImageURL]);
    // Sync the background-effect processor with the current local video track + effect
    (0, react_1.useEffect)(function () {
        if (!isBackgroundEffectSupported)
            return;
        var cancelled = false;
        var controller = backgroundControllerRef.current;
        var run = function () { return __awaiter(void 0, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (backgroundEffect !== 'none')
                            setIsEffectLoading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, controller.apply(localVideoTrack, backgroundEffect, backgroundImageEl)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        err_3 = _a.sent();
                        console.error('Failed to apply Twilio background effect:', err_3);
                        // Fall back to no effect if the processor/image failed to load
                        if (!cancelled)
                            setBackgroundEffect('none');
                        return [3 /*break*/, 5];
                    case 4:
                        if (!cancelled)
                            setIsEffectLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        run();
        return function () { cancelled = true; };
    }, [localVideoTrack, backgroundEffect, isBackgroundEffectSupported, backgroundImageEl, setBackgroundEffect]);
    // Cleanup on unmount (e.g. SPA navigation away from the call)
    (0, react_1.useEffect)(function () {
        var controller = backgroundControllerRef.current;
        return function () {
            var _a;
            controller.detach();
            (_a = roomRef.current) === null || _a === void 0 ? void 0 : _a.disconnect();
            localTracksRef.current.forEach(function (track) {
                track.stop();
            });
        };
    }, []);
    // Disconnect on page unload (tab close, browser back out of the SPA) so the
    // remote side gets participantDisconnected immediately instead of a frozen
    // frame until Twilio's media timeout. pagehide covers modern browsers
    // (including mobile Safari + bfcache); beforeunload is an older fallback.
    // Disconnecting an already-disconnected room is a no-op.
    (0, react_1.useEffect)(function () {
        var handleUnload = function () {
            var _a;
            (_a = roomRef.current) === null || _a === void 0 ? void 0 : _a.disconnect();
        };
        window.addEventListener('pagehide', handleUnload);
        window.addEventListener('beforeunload', handleUnload);
        return function () {
            window.removeEventListener('pagehide', handleUnload);
            window.removeEventListener('beforeunload', handleUnload);
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
        backgroundEffect: backgroundEffect,
        isBackgroundEffectSupported: isBackgroundEffectSupported,
        isImageBackgroundAvailable: isImageBackgroundAvailable,
        isEffectLoading: isEffectLoading,
        connect: connect,
        disconnect: disconnect,
        toggleVideo: toggleVideo,
        toggleAudio: toggleAudio,
        toggleScreenShare: toggleScreenShare,
        setBackgroundEffect: setBackgroundEffect,
        setIsHost: setIsHost,
    };
    return ((0, jsx_runtime_1.jsx)(TwilioVideoContext.Provider, __assign({ value: value }, { children: children })));
};
exports.TwilioVideoProvider = TwilioVideoProvider;
//# sourceMappingURL=TwilioVideoContext.js.map