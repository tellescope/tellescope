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
import Video from 'twilio-video';
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
    var localTracksRef = useRef([]);
    var connect = useCallback(function (token, roomName) { return __awaiter(void 0, void 0, void 0, function () {
        var tracks, videoTrack, audioTrack, newRoom, existingParticipants, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsConnecting(true);
                    setError(null);
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
                    newRoom.on('disconnected', function () {
                        // Stop all local tracks when disconnected
                        localTracksRef.current.forEach(function (track) {
                            track.stop();
                        });
                        localTracksRef.current = [];
                        setRoom(null);
                        setLocalVideoTrack(null);
                        setLocalAudioTrack(null);
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
        setRoom(null);
        setLocalVideoTrack(null);
        setLocalAudioTrack(null);
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
    // Cleanup on unmount
    useEffect(function () {
        return function () {
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
        participants: participants,
        error: error,
        isHost: isHost,
        isVideoEnabled: isVideoEnabled,
        isAudioEnabled: isAudioEnabled,
        connect: connect,
        disconnect: disconnect,
        toggleVideo: toggleVideo,
        toggleAudio: toggleAudio,
        setIsHost: setIsHost,
    };
    return (_jsx(TwilioVideoContext.Provider, __assign({ value: value }, { children: children })));
};
//# sourceMappingURL=TwilioVideoContext.js.map