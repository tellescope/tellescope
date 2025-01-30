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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleBackgroundImageButton = exports.BlurToggleIcon = exports.ScreenShareIcon = exports.VideoCallNative = exports.VideoTileGrid = exports.LocalPreview = exports.useRemoteViews = exports.SelfView = exports.useJoinVideoCall = exports.useStartVideoCall = exports.WithVideo = exports.useJoinMeeting = exports.useStartAndJoinMeetingForCalendarEvent = exports.useMeetingForCalendarEvent = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var react_components_1 = require("@tellescope/react-components");
var styled_components_1 = require("styled-components");
var amazon_chime_sdk_component_library_react_1 = require("amazon-chime-sdk-component-library-react");
Object.defineProperty(exports, "VideoTileGrid", { enumerable: true, get: function () { return 
    // LocalVideo,
    amazon_chime_sdk_component_library_react_1.VideoTileGrid; } });
var index_1 = require("./index");
var amazon_chime_sdk_js_1 = require("amazon-chime-sdk-js");
var react_components_2 = require("@tellescope/react-components");
var index_2 = require("./index");
var useMeetingForCalendarEvent = function (event) {
    var meeting = (0, index_2.useCurrentCallContext)().meeting;
    var startAndJoinMeeting = (0, exports.useStartAndJoinMeetingForCalendarEvent)(event.id).startAndJoinMeeting;
    var joinMeeting = (0, exports.useJoinMeeting)().joinMeeting;
    return {
        startAndJoinMeeting: startAndJoinMeeting,
        joinMeeting: joinMeeting,
        meeting: meeting,
        meetingStatus: (!event.enableVideoCall
            ? 'disabled'
            : !(event.meetingId)
                ? 'waiting-room'
                : !!meeting
                    ? 'joined'
                    : 'loading')
    };
};
exports.useMeetingForCalendarEvent = useMeetingForCalendarEvent;
var useStartAndJoinMeetingForCalendarEvent = function (calendarEventId) {
    var session = (0, react_components_1.useSession)();
    var _a = (0, react_components_2.useCalendarEvents)(), updateLocalEvent = _a[1].updateLocalElement;
    var meetingManager = (0, amazon_chime_sdk_component_library_react_1.useMeetingManager)();
    var _b = (0, react_1.useContext)(index_1.CurrentCallContext), setMeeting = _b.setMeeting, setIsHost = _b.setIsHost;
    if (!(!!setMeeting && setIsHost)) {
        throw new Error("Missing CurrentCallContext");
    }
    var startAndJoinMeeting = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, meeting, host, id, meetingSessionConfiguration;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, session.api.meetings.start_meeting_for_event({ calendarEventId: calendarEventId })];
                case 1:
                    _a = _b.sent(), meeting = _a.meeting, host = _a.host, id = _a.id;
                    updateLocalEvent(calendarEventId, { meetingId: id });
                    setMeeting(meeting);
                    meetingSessionConfiguration = new amazon_chime_sdk_js_1.MeetingSessionConfiguration(meeting, host.info);
                    return [4 /*yield*/, meetingManager.join(meetingSessionConfiguration)];
                case 2:
                    _b.sent(); // Use the join API to create a meeting session
                    return [4 /*yield*/, meetingManager.start()];
                case 3:
                    _b.sent(); // At this point you can let users setup their devices, or start the session immediately
                    setMeeting(meeting.Meeting);
                    setIsHost(true);
                    return [2 /*return*/];
            }
        });
    }); }, [session, calendarEventId, updateLocalEvent, meetingManager, setMeeting, setIsHost]);
    return {
        startAndJoinMeeting: startAndJoinMeeting,
    };
};
exports.useStartAndJoinMeetingForCalendarEvent = useStartAndJoinMeetingForCalendarEvent;
var useJoinMeeting = function () {
    var session = (0, react_components_1.useResolvedSession)();
    var meetingManager = (0, amazon_chime_sdk_component_library_react_1.useMeetingManager)();
    var _a = (0, react_1.useContext)(index_1.CurrentCallContext), setMeeting = _a.setMeeting, setIsHost = _a.setIsHost;
    if (!(!!setMeeting && setIsHost)) {
        throw new Error("Missing CurrentCallContext");
    }
    var joinMeeting = (0, react_1.useCallback)(function (meeting) { return __awaiter(void 0, void 0, void 0, function () {
        var attendeeInfo, calendarEventId, result, meetingSessionConfiguration;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    attendeeInfo = (_a = meeting.attendees.find(function (a) { return a.id === session.userInfo.id; })) === null || _a === void 0 ? void 0 : _a.info;
                    if (!!attendeeInfo) return [3 /*break*/, 3];
                    calendarEventId = meeting.calendarEventId;
                    if (!calendarEventId) return [3 /*break*/, 2];
                    return [4 /*yield*/, session.api.meetings.join_meeting_for_event({ calendarEventId: calendarEventId })];
                case 1:
                    result = _b.sent();
                    attendeeInfo = result.attendee.info;
                    _b.label = 2;
                case 2:
                    if (!attendeeInfo) {
                        console.error("Could not find attendee info for joining meeting and failed to join");
                        return [2 /*return*/];
                    }
                    _b.label = 3;
                case 3:
                    meetingSessionConfiguration = new amazon_chime_sdk_js_1.MeetingSessionConfiguration(meeting.meetingInfo, attendeeInfo);
                    return [4 /*yield*/, meetingManager.join(meetingSessionConfiguration)];
                case 4:
                    _b.sent(); // Use the join API to create a meeting session
                    return [4 /*yield*/, meetingManager.start()];
                case 5:
                    _b.sent(); // At this point you can let users setup their devices, or start the session immediately
                    setMeeting(meeting.meetingInfo.Meeting);
                    setIsHost(meeting.creator === session.userInfo.id);
                    return [2 /*return*/];
            }
        });
    }); }, [setMeeting, meetingManager, setMeeting, setIsHost]);
    return {
        joinMeeting: joinMeeting,
    };
};
exports.useJoinMeeting = useJoinMeeting;
var useHandleDataMessages = function () {
    var _a;
    try {
        var session_1 = (0, react_components_1.useResolvedSession)();
        var audioVideo_1 = (0, amazon_chime_sdk_component_library_react_1.useAudioVideo)();
        var _b = (0, amazon_chime_sdk_component_library_react_1.useToggleLocalMute)(), muted_1 = _b.muted, toggleMute_1 = _b.toggleMute;
        (0, react_1.useEffect)(function () {
            if (!audioVideo_1) {
                return;
            }
            audioVideo_1.realtimeSubscribeToReceiveDataMessage('Message', function (data) {
                var message = (data && data.json()) || {};
                if (message.type === 'mute' && message.userId === session_1.userInfo.id && !muted_1) {
                    toggleMute_1();
                }
            });
            return function () {
                audioVideo_1.realtimeUnsubscribeFromReceiveDataMessage('Message');
            };
        }, [audioVideo_1, muted_1, toggleMute_1, (_a = session_1.userInfo) === null || _a === void 0 ? void 0 : _a.id]);
    }
    catch (err) {
        console.error(err);
    }
};
var WithContext = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(undefined), meeting = _b[0], setMeeting = _b[1];
    var _c = (0, react_1.useState)(false), isHost = _c[0], setIsHost = _c[1];
    var _d = (0, amazon_chime_sdk_component_library_react_1.useLocalVideo)(), toggleVideo = _d.toggleVideo, videoIsEnabled = _d.isVideoEnabled, localTileId = _d.tileId;
    var roster = (0, amazon_chime_sdk_component_library_react_1.useRosterState)().roster;
    var tileId = (0, amazon_chime_sdk_component_library_react_1.useContentShareState)().tileId;
    var tiles = (0, amazon_chime_sdk_component_library_react_1.useRemoteVideoTileState)().tiles;
    var _e = (0, amazon_chime_sdk_component_library_react_1.useToggleLocalMute)(), muted = _e.muted, toggleMute = _e.toggleMute;
    useHandleDataMessages();
    var attendees = [];
    for (var attendeeId in roster) {
        var externalUserId = roster[attendeeId].externalUserId;
        attendees.push({ attendeeId: attendeeId, externalUserId: externalUserId });
    }
    return ((0, jsx_runtime_1.jsx)(index_1.CurrentCallContext.Provider, __assign({ value: {
            isHost: isHost,
            setIsHost: setIsHost,
            attendees: attendees,
            localTileId: localTileId,
            videoTiles: tiles,
            shareScreenId: tileId,
            meeting: meeting,
            setMeeting: setMeeting,
            videoIsEnabled: videoIsEnabled,
            toggleVideo: toggleVideo,
            microphoneIsEnabled: !muted,
            toggleMicrophone: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, toggleMute()];
            }); }); },
        } }, { children: children })));
};
// const load_image_blob = async () => (
//   (await fetch('https://pathtoimage.jpeg')).blob()
// )
// export const WithVideo = ({ children }: VideoProps) => {
//   const [imageBlob, setImageBlob] = useState<Blob>()
//   useEffect(() => {
//     load_image_blob()
//     .then(setImageBlob)
//     .catch(console.error)
//   }, [])
//   return (
//     <ThemeProvider theme={darkTheme}>
//     <BackgroundReplacementProvider options={{ imageBlob }}>
//     <MeetingProvider>
//     <WithContext>
//       {children}
//     </WithContext>
//     </MeetingProvider>
//     </BackgroundReplacementProvider>
//     </ThemeProvider>
//   )
// }
var WithVideo = function (_a) {
    var children = _a.children;
    return ((0, jsx_runtime_1.jsx)(styled_components_1.ThemeProvider, __assign({ theme: amazon_chime_sdk_component_library_react_1.darkTheme }, { children: (0, jsx_runtime_1.jsx)(amazon_chime_sdk_component_library_react_1.MeetingProvider, { children: (0, jsx_runtime_1.jsx)(WithContext, { children: children }) }) })));
};
exports.WithVideo = WithVideo;
var useStartVideoCall = function () {
    var _a = (0, react_1.useState)(false), starting = _a[0], setStarting = _a[1];
    var _b = (0, react_1.useState)(false), ending = _b[0], setEnding = _b[1];
    var _c = react_1.default.useContext(index_1.CurrentCallContext), meeting = _c.meeting, setMeeting = _c.setMeeting, toggleVideo = _c.toggleVideo, videoIsEnabled = _c.videoIsEnabled, setIsHost = _c.setIsHost;
    var session = (0, react_components_1.useSession)(); // meetings can only be started by users, not endusers (for now)
    var meetingManager = (0, amazon_chime_sdk_component_library_react_1.useMeetingManager)();
    var createAndStartMeeting = function (initialAttendees) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, id, meeting_1, host, meetingSessionConfiguration, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setStarting(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, 6, 7]);
                    return [4 /*yield*/, session.api.meetings.start_meeting({ attendees: initialAttendees })];
                case 2:
                    _a = _b.sent(), id = _a.id, meeting_1 = _a.meeting, host = _a.host;
                    meetingSessionConfiguration = new amazon_chime_sdk_js_1.MeetingSessionConfiguration(meeting_1, host.info);
                    return [4 /*yield*/, meetingManager.join(meetingSessionConfiguration)];
                case 3:
                    _b.sent(); // Use the join API to create a meeting session
                    return [4 /*yield*/, meetingManager.start()];
                case 4:
                    _b.sent(); // At this point you can let users setup their devices, or start the session immediately
                    setMeeting(meeting_1.Meeting);
                    setIsHost(true);
                    return [2 /*return*/, id];
                case 5:
                    err_1 = _b.sent();
                    console.error(err_1);
                    throw err_1;
                case 6:
                    setStarting(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
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
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    console.error(err_2);
                    return [3 /*break*/, 4];
                case 4:
                    setEnding(false);
                    setMeeting(undefined);
                    return [2 /*return*/];
            }
        });
    }); };
    return { starting: starting, ending: ending, meeting: meeting, videoIsEnabled: videoIsEnabled, toggleVideo: toggleVideo, createAndStartMeeting: createAndStartMeeting, addAttendees: addAttendees, endMeeting: endMeeting };
};
exports.useStartVideoCall = useStartVideoCall;
var useJoinVideoCall = function (props) {
    var onCallEnd = (props !== null && props !== void 0 ? props : {}).onCallEnd;
    var session = (0, react_components_1.useResolvedSession)();
    var meetingManager = (0, amazon_chime_sdk_component_library_react_1.useMeetingManager)();
    var _a = react_1.default.useContext(index_1.CurrentCallContext), meeting = _a.meeting, setMeeting = _a.setMeeting, toggleVideo = _a.toggleVideo, videoIsEnabled = _a.videoIsEnabled;
    var status = (0, amazon_chime_sdk_component_library_react_1.useMeetingStatus)();
    // meetingInfo may be meetingId as string
    var joinMeeting = function (meetingInfo, attendeeInfo) { return __awaiter(void 0, void 0, void 0, function () {
        var meetings, meeting_2, meetingSessionConfiguration;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(typeof meetingInfo == 'string')) return [3 /*break*/, 2];
                    return [4 /*yield*/, session.api.meetings.my_meetings()];
                case 1:
                    meetings = _d.sent();
                    meeting_2 = meetings.find(function (m) { return m.id === meetingInfo; });
                    meetingInfo = meeting_2 === null || meeting_2 === void 0 ? void 0 : meeting_2.meetingInfo;
                    attendeeInfo = { Attendee: (_c = (_b = meeting_2 === null || meeting_2 === void 0 ? void 0 : (_a = meeting_2.attendees).find) === null || _b === void 0 ? void 0 : _b.call(_a, function (a) { return a.id === session.userInfo.id; })) === null || _c === void 0 ? void 0 : _c.info };
                    _d.label = 2;
                case 2:
                    if (!meetingInfo || typeof meetingInfo === 'string' || !attendeeInfo)
                        return [2 /*return*/];
                    meetingSessionConfiguration = new amazon_chime_sdk_js_1.MeetingSessionConfiguration(meetingInfo, attendeeInfo);
                    return [4 /*yield*/, meetingManager.join(meetingSessionConfiguration)];
                case 3:
                    _d.sent(); // Use the join API to create a meeting session
                    return [4 /*yield*/, meetingManager.start()];
                case 4:
                    _d.sent(); // At this point you can let users setup their devices, or start the session immediately
                    setMeeting(meetingInfo.Meeting);
                    return [2 /*return*/];
            }
        });
    }); };
    var leaveMeeting = function () {
        if (meetingManager.audioVideo) {
            meetingManager.audioVideo.stop();
            // Stop local video tile (stops sharing the video tile in the meeting)
            meetingManager.audioVideo.stopLocalVideoTile();
            // Stop a video preview that was previously started (before session starts)
            // meetingManager.audioVideo.stopVideoPreviewForVideoInput(previewVideoElement);
            // Stop the meeting session (audio and video)
            meetingManager.audioVideo && meetingManager.audioVideo.stop();
        }
        setMeeting(undefined);
    };
    (0, react_1.useEffect)(function () {
        if (!meeting)
            return;
        if (status === amazon_chime_sdk_component_library_react_1.MeetingStatus.Ended) {
            leaveMeeting();
            onCallEnd === null || onCallEnd === void 0 ? void 0 : onCallEnd();
        }
    }, [meeting, status, leaveMeeting]);
    return { meeting: meeting, videoIsEnabled: videoIsEnabled, toggleVideo: toggleVideo, joinMeeting: joinMeeting, leaveMeeting: leaveMeeting };
};
exports.useJoinVideoCall = useJoinVideoCall;
var SelfView = function (_a) {
    var style = _a.style;
    return (0, jsx_runtime_1.jsx)("div", __assign({ style: style }, { children: (0, jsx_runtime_1.jsx)(amazon_chime_sdk_component_library_react_1.LocalVideo, {}) }));
};
exports.SelfView = SelfView;
var useRemoteViews = function (props) {
    if (props === void 0) { props = {}; }
    var _a = react_1.default.useContext(index_1.CurrentCallContext), localTileId = _a.localTileId, videoTiles = _a.videoTiles;
    var nonLocal = videoTiles.filter(function (v) { return v !== localTileId; });
    return nonLocal.map(function (tileId) {
        return (0, jsx_runtime_1.jsx)(amazon_chime_sdk_component_library_react_1.RemoteVideo, { style: props.style, tileId: tileId }, tileId);
    });
};
exports.useRemoteViews = useRemoteViews;
var SwappableLogger = /** @class */ (function () {
    function SwappableLogger(inner) {
        this.inner = inner;
    }
    SwappableLogger.prototype.debug = function (debugFunction) {
        this.inner.debug(debugFunction);
    };
    SwappableLogger.prototype.info = function (msg) {
        this.inner.info(msg);
    };
    SwappableLogger.prototype.error = function (msg) {
        this.inner.error(msg);
    };
    SwappableLogger.prototype.warn = function (msg) {
        this.inner.warn(msg);
    };
    SwappableLogger.prototype.setLogLevel = function (level) {
        this.inner.setLogLevel(level);
    };
    SwappableLogger.prototype.getLogLevel = function () {
        return this.inner.getLogLevel();
    };
    return SwappableLogger;
}());
var PREVIEW_ELEMENT_ID = 'video-preview';
var defaultPreviewStyle = {
    width: 400,
    minHeight: 200,
    height: 'auto',
    maxHeight: 600,
    backgroundColor: '#f0f0f0'
};
var LocalPreview = function (_a) {
    var _b = _a.style, style = _b === void 0 ? defaultPreviewStyle : _b;
    (0, react_1.useEffect)(function () {
        var videoElement = document.getElementById(PREVIEW_ELEMENT_ID);
        if (!videoElement)
            return;
        var deviceController = new amazon_chime_sdk_js_1.DefaultDeviceController(new SwappableLogger(new amazon_chime_sdk_js_1.ConsoleLogger('SDK', amazon_chime_sdk_js_1.LogLevel.WARN)), { enableWebAudio: true });
        //List the video device list
        deviceController.listVideoInputDevices()
            .then(function (deviceList) {
            //Choose video device
            deviceController.startVideoInput(deviceList[0].deviceId)
                .then(function () {
                deviceController.startVideoPreviewForVideoInput(videoElement);
            })
                .catch(console.error);
        })
            .catch(console.error);
        // disconnect camera 
        return function () {
            deviceController.destroy();
        };
    }, []);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("video", { id: PREVIEW_ELEMENT_ID, style: style }) }));
};
exports.LocalPreview = LocalPreview;
// unimplemented for web
var VideoCallNative = function () { return (null); };
exports.VideoCallNative = VideoCallNative;
var ScreenShareIcon = function () { return ((0, jsx_runtime_1.jsx)(amazon_chime_sdk_component_library_react_1.ContentShareControl, { iconTitle: "Screen Share", label: "Share Screen" })); };
exports.ScreenShareIcon = ScreenShareIcon;
var BlurToggleIcon = function () { return ((0, jsx_runtime_1.jsx)(amazon_chime_sdk_component_library_react_1.VideoInputBackgroundBlurControl, {})); };
exports.BlurToggleIcon = BlurToggleIcon;
var ToggleBackgroundImageButton = function () {
    var meetingManager = (0, amazon_chime_sdk_component_library_react_1.useMeetingManager)();
    var selectedDevice = (0, amazon_chime_sdk_component_library_react_1.useVideoInputs)().selectedDevice;
    var _a = (0, react_1.useState)(false), isVideoTransformCheckBoxOn = _a[0], setisVideoTransformCheckBoxOn = _a[1];
    var _b = (0, amazon_chime_sdk_component_library_react_1.useBackgroundReplacement)(), isBackgroundReplacementSupported = _b.isBackgroundReplacementSupported, createBackgroundReplacementDevice = _b.createBackgroundReplacementDevice;
    (0, react_1.useEffect)(function () {
        function toggleBackgroundReplacement() {
            return __awaiter(this, void 0, void 0, function () {
                var current, intrinsicDevice, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 6, , 7]);
                            current = selectedDevice;
                            if (!isVideoTransformCheckBoxOn) return [3 /*break*/, 2];
                            return [4 /*yield*/, createBackgroundReplacementDevice(selectedDevice)];
                        case 1:
                            current = _a.sent();
                            return [3 /*break*/, 4];
                        case 2:
                            if (!(0, amazon_chime_sdk_js_1.isVideoTransformDevice)(selectedDevice)) return [3 /*break*/, 4];
                            return [4 /*yield*/, selectedDevice.intrinsicDevice()];
                        case 3:
                            intrinsicDevice = _a.sent();
                            selectedDevice.stop();
                            current = intrinsicDevice;
                            _a.label = 4;
                        case 4: return [4 /*yield*/, meetingManager.startVideoInputDevice(current)];
                        case 5:
                            _a.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            error_1 = _a.sent();
                            // Handle device selection failure here
                            console.error('Failed to toggle BackgroundReplacement');
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
        toggleBackgroundReplacement();
    }, [isVideoTransformCheckBoxOn]);
    var onClick = function () {
        setisVideoTransformCheckBoxOn(function (current) { return !current; });
    };
    return ((0, jsx_runtime_1.jsx)("div", { children: isBackgroundReplacementSupported && ((0, jsx_runtime_1.jsx)("button", __assign({ onClick: onClick }, { children: (0, amazon_chime_sdk_js_1.isVideoTransformDevice)(selectedDevice)
                ? 'Background Replacement Enabled'
                : 'Enable Background Replacement' }))) }));
};
exports.ToggleBackgroundImageButton = ToggleBackgroundImageButton;
//# sourceMappingURL=video.js.map