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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.ScreenShareIcon = exports.VideoCallNative = exports.LocalPreview = exports.useJoinVideoCall = exports.useStartAndJoinMeetingForCalendarEvent = exports.useStartVideoCall = exports.SelfView = exports.useRemoteViews = exports.WithVideo = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// logic pulled + refactored from 
// https://github.com/aws-samples/amazon-chime-react-native-demo/blob/master/src/containers/Meeting.js
// which includes the following copyright disclaimer
/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var react_components_1 = require("@tellescope/react-components");
var mui_native_1 = require("@tellescope/react-components/lib/esm/mui.native");
var index_native_1 = require("./index.native");
var WithVideo = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(undefined), meeting = _b[0], setMeeting = _b[1];
    var _c = (0, react_1.useState)(false), isHost = _c[0], setIsHost = _c[1];
    var _d = (0, react_1.useState)(false), inMeeting = _d[0], setInMeeting = _d[1];
    var _e = (0, react_1.useState)(false), isLoading = _e[0], setIsLoading = _e[1];
    var _f = (0, react_1.useState)(false), muted = _f[0], setMuted = _f[1];
    var _g = (0, react_1.useState)(false), videoIsEnabled = _g[0], setVideoIsEnabled = _g[1];
    var _h = (0, react_1.useState)([]), videoTiles = _h[0], setVideoTiles = _h[1];
    var _j = (0, react_1.useState)(null), localTileId = _j[0], setLocalTileId = _j[1];
    var _k = (0, react_1.useState)(null), screenShareTile = _k[0], setScreenShareTile = _k[1];
    var _l = (0, react_1.useState)([]), attendees = _l[0], setAttendees = _l[1];
    var resetState = function () {
        setMeeting(undefined);
        setIsHost(false);
        setMuted(false);
        setVideoIsEnabled(false);
        setVideoTiles([]);
        setLocalTileId(null);
        setScreenShareTile(null);
        setAttendees([]);
    };
    var toggleVideo = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            index_native_1.NativeFunction.setCameraOn(!videoIsEnabled);
            if (videoIsEnabled) {
                setLocalTileId(null);
            }
            setVideoIsEnabled(function (v) { return !v; });
            return [2 /*return*/];
        });
    }); };
    var toggleMic = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            index_native_1.NativeFunction.setMute(!muted);
            setMuted(function (m) { return !m; });
            return [2 /*return*/];
        });
    }); };
    var emitter = (0, index_native_1.getSDKEventEmitter)();
    (0, react_1.useEffect)(function () {
        var startSubscription = emitter.addListener(index_native_1.MobileSDKEvent.OnMeetingStart, function () {
            setInMeeting(true);
            setIsLoading(false);
        });
        // called when user clicks Leave Meeting or meeting is ended by host
        var endSubscription = emitter.addListener(index_native_1.MobileSDKEvent.OnMeetingEnd, function (a) {
            resetState();
        });
        var joinSubscription = emitter.addListener(index_native_1.MobileSDKEvent.OnAttendeesJoin, function (added) {
            var attendeeId = added.attendeeId, externalUserId = added.externalUserId;
            setAttendees(function (as) { return !as.find(function (a) { return a.attendeeId === attendeeId; })
                ? __spreadArray([{ attendeeId: attendeeId, externalUserId: externalUserId, muted: false }], as, true) : as; });
        });
        var leaveSubscription = emitter.addListener(index_native_1.MobileSDKEvent.OnAttendeesLeave, function (leaving) {
            var attendeeId = leaving.attendeeId;
            setAttendees(function (as) { return as.filter(function (a) { return a.attendeeId !== attendeeId; }); });
        });
        var errorSubscription = emitter.addListener(index_native_1.MobileSDKEvent.OnError, function (message) {
            console.error("SDK Error in errorSubscription", message);
        });
        var muteSubscription = emitter.addListener(index_native_1.MobileSDKEvent.OnAttendeesMute, function (attendeeId) {
            setAttendees(function (as) { return as.map(function (a) { return a.attendeeId === attendeeId ? __assign(__assign({}, a), { muted: true }) : a; }); });
        });
        var unmuteSubscription = emitter.addListener(index_native_1.MobileSDKEvent.OnAttendeesUnmute, function (attendeeId) {
            setAttendees(function (as) { return as.map(function (a) { return a.attendeeId === attendeeId ? __assign(__assign({}, a), { muted: false }) : a; }); });
        });
        var addVideoSubscription = emitter.addListener(index_native_1.MobileSDKEvent.OnAddVideoTile, function (tileState) {
            if (tileState.isScreenShare) {
                setScreenShareTile(tileState.tileId);
                return;
            }
            if (tileState.isLocal) {
                setLocalTileId(tileState.tileId);
            }
            setVideoTiles(function (v) { return __spreadArray(__spreadArray([], v, true), [tileState.tileId], false); });
            setVideoIsEnabled(function (v) { return tileState.isLocal ? true : v; });
        });
        var removeVideoSubscription = emitter.addListener(index_native_1.MobileSDKEvent.OnRemoveVideoTile, function (tileState) {
            if (tileState.isScreenShare) {
                setScreenShareTile(null);
                return;
            }
            setVideoTiles(function (vs) { return vs.filter(function (v) { return v !== tileState.tileId; }); });
            setVideoIsEnabled(function (v) { return tileState.isLocal ? false : v; });
        });
        // clean up any old meetings when the context is loaded
        index_native_1.NativeFunction.stopMeeting();
        return function () {
            startSubscription.remove();
            endSubscription.remove();
            errorSubscription.remove();
            joinSubscription.remove();
            leaveSubscription.remove();
            muteSubscription.remove();
            unmuteSubscription.remove();
            addVideoSubscription.remove();
            removeVideoSubscription.remove();
        };
    }, [emitter]);
    return ((0, jsx_runtime_1.jsx)(index_native_1.CurrentCallContext.Provider, __assign({ value: {
            isHost: isHost,
            setIsHost: setIsHost,
            attendees: attendees,
            localTileId: localTileId,
            videoTiles: videoTiles,
            meeting: meeting,
            shareScreenId: screenShareTile,
            setMeeting: setMeeting,
            videoIsEnabled: videoIsEnabled,
            toggleVideo: toggleVideo,
            microphoneIsEnabled: !muted,
            toggleMicrophone: toggleMic,
        } }, { children: children })));
};
exports.WithVideo = WithVideo;
var useRemoteViews = function (props) {
    if (props === void 0) { props = {}; }
    var _a = react_1.default.useContext(index_native_1.CurrentCallContext), localTileId = _a.localTileId, videoTiles = _a.videoTiles;
    var nonLocal = videoTiles.filter(function (v) { return v !== localTileId; });
    return nonLocal.map(function (tileId) { var _a; return (0, jsx_runtime_1.jsx)(index_native_1.RNVideoRenderView, { style: (_a = (0, mui_native_1.convert_CSS_to_RNStyles)(props.style)) !== null && _a !== void 0 ? _a : styles.video, tileId: tileId }, tileId); });
};
exports.useRemoteViews = useRemoteViews;
var SelfView = function (_a) {
    var _b;
    var style = _a.style;
    var localTileId = react_1.default.useContext(index_native_1.CurrentCallContext).localTileId;
    if (localTileId === null)
        return null; // localTileId may be zero, don't return null on simple falsey check
    return ((0, jsx_runtime_1.jsx)(index_native_1.RNVideoRenderView, { style: (_b = (0, mui_native_1.convert_CSS_to_RNStyles)(style)) !== null && _b !== void 0 ? _b : styles.video, tileId: localTileId }));
};
exports.SelfView = SelfView;
var useStartVideoCall = function () {
    var session = (0, react_components_1.useSession)();
    var _a = react_1.default.useContext(index_native_1.CurrentCallContext), meeting = _a.meeting, setMeeting = _a.setMeeting, setIsHost = _a.setIsHost, videoIsEnabled = _a.videoIsEnabled, toggleVideo = _a.toggleVideo;
    var _b = (0, react_components_1.useMeetings)({ dontFetch: true }), updateLocalMeeting = _b[1].updateLocalElement;
    var _c = (0, react_1.useState)(false), starting = _c[0], setStarting = _c[1];
    var _d = (0, react_1.useState)(false), ending = _d[0], setEnding = _d[1];
    var createAndStartMeeting = function (initialAttendees) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, id, meeting_1, host, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setStarting(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, session.api.meetings.start_meeting({ attendees: initialAttendees })];
                case 2:
                    _a = _b.sent(), id = _a.id, meeting_1 = _a.meeting, host = _a.host;
                    return [4 /*yield*/, index_native_1.NativeFunction.startMeeting(meeting_1.Meeting, host.info)];
                case 3:
                    _b.sent();
                    setMeeting(meeting_1.Meeting);
                    setIsHost(true);
                    return [2 /*return*/, id];
                case 4:
                    err_1 = _b.sent();
                    console.error(err_1);
                    throw err_1;
                case 5:
                    setStarting(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var addAttendees = (0, react_1.useCallback)(function (attendees) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!meeting)
                        return [2 /*return*/];
                    return [4 /*yield*/, session.api.meetings.add_attendees_to_meeting({ id: meeting === null || meeting === void 0 ? void 0 : meeting.ExternalMeetingId, attendees: attendees })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [session, meeting]);
    var endMeeting = function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!meeting)
                        return [2 /*return*/];
                    setEnding(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, session.api.meetings.end_meeting({ id: meeting.ExternalMeetingId })];
                case 2:
                    _a.sent();
                    updateLocalMeeting(meeting.ExternalMeetingId, {
                        status: 'ended',
                        // @ts-ignore
                        endedAt: new Date().toString(),
                    });
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    console.error(err_2);
                    return [3 /*break*/, 4];
                case 4:
                    index_native_1.NativeFunction.stopMeeting();
                    return [2 /*return*/];
            }
        });
    }); };
    return {
        meeting: meeting,
        videoIsEnabled: videoIsEnabled,
        starting: starting,
        ending: ending,
        toggleVideo: toggleVideo,
        createAndStartMeeting: createAndStartMeeting,
        addAttendees: addAttendees,
        endMeeting: endMeeting,
    };
};
exports.useStartVideoCall = useStartVideoCall;
var useStartAndJoinMeetingForCalendarEvent = function (calendarEventId) {
    var session = (0, react_components_1.useSession)();
    var _a = (0, react_components_1.useCalendarEvents)(), updateLocalEvent = _a[1].updateLocalElement;
    var _b = (0, react_1.useContext)(index_native_1.CurrentCallContext), setMeeting = _b.setMeeting, setIsHost = _b.setIsHost;
    if (!(!!setMeeting && setIsHost)) {
        throw new Error("Missing CurrentCallContext");
    }
    var startAndJoinMeeting = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, meeting, host, id;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, session.api.meetings.start_meeting_for_event({ calendarEventId: calendarEventId })];
                case 1:
                    _a = _b.sent(), meeting = _a.meeting, host = _a.host, id = _a.id;
                    updateLocalEvent(calendarEventId, { meetingId: id });
                    return [4 /*yield*/, index_native_1.NativeFunction.startMeeting(meeting.Meeting, host.info)];
                case 2:
                    _b.sent();
                    setMeeting(meeting.Meeting);
                    setIsHost(true);
                    return [2 /*return*/];
            }
        });
    }); }, [session, setMeeting, setIsHost, updateLocalEvent]);
    return {
        startAndJoinMeeting: startAndJoinMeeting,
    };
};
exports.useStartAndJoinMeetingForCalendarEvent = useStartAndJoinMeetingForCalendarEvent;
var useJoinVideoCall = function () {
    var session = (0, react_components_1.useResolvedSession)();
    var _a = react_1.default.useContext(index_native_1.CurrentCallContext), meeting = _a.meeting, setIsHost = _a.setIsHost, setMeeting = _a.setMeeting, videoIsEnabled = _a.videoIsEnabled, toggleVideo = _a.toggleVideo;
    var joinMeeting = function (meetingInfo, attendeeInfo) { return __awaiter(void 0, void 0, void 0, function () {
        var isHost, meetings, meeting_2, err_3;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    isHost = false;
                    if (!(typeof meetingInfo == 'string')) return [3 /*break*/, 2];
                    return [4 /*yield*/, session.api.meetings.my_meetings()];
                case 1:
                    meetings = _j.sent();
                    meeting_2 = meetings.find(function (m) { return m.id === meetingInfo; });
                    meetingInfo = meeting_2 === null || meeting_2 === void 0 ? void 0 : meeting_2.meetingInfo;
                    attendeeInfo = { Attendee: (_c = (_b = meeting_2 === null || meeting_2 === void 0 ? void 0 : (_a = meeting_2.attendees).find) === null || _b === void 0 ? void 0 : _b.call(_a, function (a) { return a.id === session.userInfo.id; })) === null || _c === void 0 ? void 0 : _c.info };
                    if (attendeeInfo.Attendee.ExternalUserId === (meeting_2 === null || meeting_2 === void 0 ? void 0 : meeting_2.creator)) {
                        isHost = true;
                    }
                    _j.label = 2;
                case 2:
                    if (!meetingInfo || typeof meetingInfo === 'string' || !attendeeInfo)
                        return [2 /*return*/];
                    _j.label = 3;
                case 3:
                    _j.trys.push([3, 5, , 7]);
                    return [4 /*yield*/, index_native_1.NativeFunction.startMeeting((_d = meetingInfo.Meeting) !== null && _d !== void 0 ? _d : meetingInfo, (_e = attendeeInfo.Attendee) !== null && _e !== void 0 ? _e : attendeeInfo)];
                case 4:
                    _j.sent();
                    return [3 /*break*/, 7];
                case 5:
                    err_3 = _j.sent();
                    return [4 /*yield*/, index_native_1.NativeFunction.startMeeting((_f = meetingInfo.Meeting) !== null && _f !== void 0 ? _f : meetingInfo, (_g = attendeeInfo.Attendee) !== null && _g !== void 0 ? _g : attendeeInfo)];
                case 6:
                    _j.sent();
                    return [3 /*break*/, 7];
                case 7:
                    setMeeting((_h = meetingInfo.Meeting) !== null && _h !== void 0 ? _h : meetingInfo);
                    setIsHost(isHost);
                    return [2 /*return*/];
            }
        });
    }); };
    var leaveMeeting = function () {
        index_native_1.NativeFunction.stopMeeting();
        // setMeeting(undefined)
    };
    return { meeting: meeting, videoIsEnabled: videoIsEnabled, toggleVideo: toggleVideo, joinMeeting: joinMeeting, leaveMeeting: leaveMeeting };
};
exports.useJoinVideoCall = useJoinVideoCall;
var styles = react_native_1.StyleSheet.create({
    title: {
        fontSize: 30,
        fontWeight: '700'
    },
    subtitle: {
        marginBottom: 25,
        marginTop: 10,
        color: 'grey'
    },
    videoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        height: '95%',
        // This is an existing React Native issue:
        // When you create a native android component
        // that use GLSurfaceView (We use this internally), the entire screen will
        // black out
        overflow: 'hidden'
    },
    video: {
        width: '100%',
        aspectRatio: 16 / 9,
    },
    screenShare: {
        width: '90%',
        margin: '1%',
        aspectRatio: 16 / 9,
    },
    attendeeList: {
        flex: 1,
        width: '80%'
    },
    attendeeContainer: {
        fontSize: 20,
        margin: 5,
        padding: 5,
        height: 30,
        backgroundColor: '#eee',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    attendeeMuteImage: {
        resizeMode: 'contain',
        width: 20,
        height: 20
    },
    inputBox: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        margin: 5,
        width: '50%',
        padding: 10,
        color: 'black'
    },
    meetingButton: {
        resizeMode: 'contain',
        width: 50,
        height: 50
    }
});
var LocalPreview = function () {
    // console.error("LocalPreview unimplemented for Native")
    return null;
};
exports.LocalPreview = LocalPreview;
var get_video_styles = function (count) {
    return ({
        borderWidth: '1px',
        borderColor: '#888888',
        borderRadius: 5,
        padding: 5,
        width: count === 1 ? '100%' : '50%',
        maxHeight: (count <= 4
            ? '50%'
            : count <= 8
                ? '25%'
                : '20%'),
        backgroundColor: '#bbbbbb'
    });
};
var VideoCallNative = function (_a) {
    var props = __rest(_a, []);
    var remoteViews = (0, exports.useRemoteViews)();
    // RNSwitchAudioOutput.selectAudioOutput(RNSwitchAudioOutput.AUDIO_SPEAKER)
    var selfView = ((0, jsx_runtime_1.jsx)(exports.SelfView
    // style={{ 
    //   position: 'absolute', 
    //   zIndex: '100', 
    //   borderRadius: 100, 
    //   width: 130, 
    //   height: 130, 
    //   bottom: 120, 
    //   right: 25 
    // }} 
    , {}));
    var style = get_video_styles(remoteViews.length + 1);
    return ((0, jsx_runtime_1.jsxs)(react_components_1.Flex, __assign({ column: true, flex: 1, style: {} }, { children: [(0, jsx_runtime_1.jsxs)(react_components_1.Flex, __assign({ flex: 1, style: { marginBottom: 75 } }, { children: [remoteViews.map(function (view, i) { return ((0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ alignItems: "center", justifyContent: "center", style: style }, { children: view }), i)); }), (0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ alignItems: "center", justifyContent: "center", style: style }, { children: selfView }))] })), (0, jsx_runtime_1.jsx)(index_native_1.ControlBar, __assign({}, props, { size: 50, spacing: 20, style: { position: 'absolute', bottom: 20, width: '100%' } }))] })));
};
exports.VideoCallNative = VideoCallNative;
var ScreenShareIcon = function () { return null; };
exports.ScreenShareIcon = ScreenShareIcon;
//# sourceMappingURL=video.native.js.map