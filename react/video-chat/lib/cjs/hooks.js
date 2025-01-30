"use strict";
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
        while (_) try {
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
exports.useMeetingForCalendarEvent = exports.useJoinMeeting = exports.useStartAndJoinMeetingForCalendarEvent = void 0;
var react_1 = require("react");
var react_components_1 = require("@tellescope/react-components");
var amazon_chime_sdk_component_library_react_1 = require("amazon-chime-sdk-component-library-react");
var index_1 = require("./index");
var useStartAndJoinMeetingForCalendarEvent = function (calendarEventId) {
    var session = (0, react_components_1.useSession)();
    var _a = (0, react_components_1.useCalendarEvents)(), updateLocalEvent = _a[1].updateLocalElement;
    var meetingManager = (0, amazon_chime_sdk_component_library_react_1.useMeetingManager)();
    var _b = (0, react_1.useContext)(index_1.CurrentCallContext), setMeeting = _b.setMeeting, setIsHost = _b.setIsHost;
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
                    setMeeting(meeting);
                    return [4 /*yield*/, meetingManager.join({ meetingInfo: meeting, attendeeInfo: host.info })];
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
        var attendeeInfo, calendarEventId, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setMeeting(meeting.meetingInfo.Meeting);
                    setIsHost(meeting.creator === session.userInfo.id);
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
                case 3: return [4 /*yield*/, meetingManager.join({
                        meetingInfo: meeting.meetingInfo,
                        attendeeInfo: attendeeInfo,
                    })];
                case 4:
                    _b.sent(); // Use the join API to create a meeting session
                    return [4 /*yield*/, meetingManager.start()];
                case 5:
                    _b.sent(); // At this point you can let users setup their devices, or start the session immediately
                    return [2 /*return*/];
            }
        });
    }); }, [setMeeting, meetingManager, setMeeting, setIsHost]);
    return {
        joinMeeting: joinMeeting,
    };
};
exports.useJoinMeeting = useJoinMeeting;
var useMeetingForCalendarEvent = function (event) {
    var meeting = (0, index_1.useCurrentCallContext)().meeting;
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
//# sourceMappingURL=hooks.js.map