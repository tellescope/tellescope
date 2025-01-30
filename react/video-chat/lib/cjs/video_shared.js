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
exports.WaitingRoom = exports.CreateCalendarEventForAttendees = exports.useCurrentCallContext = exports.CurrentCallContext = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var react_components_1 = require("@tellescope/react-components");
var video_1 = require("./video");
exports.CurrentCallContext = react_1.default.createContext({});
var useCurrentCallContext = function () {
    return react_1.default.useContext(exports.CurrentCallContext);
};
exports.useCurrentCallContext = useCurrentCallContext;
var CreateCalendarEventForAttendees = function (_a) {
    var _b;
    var onSuccess = _a.onSuccess, onError = _a.onError, eventProps = _a.eventProps, props = __rest(_a, ["onSuccess", "onError", "eventProps"]);
    var _c = (0, react_components_1.useCalendarEvents)({ dontFetch: true }), createEvent = _c[1].createElement;
    var eventTitle = (0, react_1.useState)((_b = eventProps === null || eventProps === void 0 ? void 0 : eventProps.title) !== null && _b !== void 0 ? _b : 'Video Call')[0];
    var session = (0, react_components_1.useResolvedSession)();
    var handleCreateRoom = (0, react_1.useCallback)(function (_a) {
        var _b;
        var users = _a.users, endusers = _a.endusers;
        var userIds = users.map(function (u) { return u.id; });
        var enduserIds = endusers.map(function (e) { return e.id; });
        createEvent({
            title: eventTitle,
            attendees: (__spreadArray(__spreadArray([], userIds.map(function (id) { return ({ type: 'user', id: id }); }), true), enduserIds.map(function (id) { return ({ type: 'enduser', id: id }); }), true)),
            startTimeInMS: (_b = eventProps === null || eventProps === void 0 ? void 0 : eventProps.startTimeInMS) !== null && _b !== void 0 ? _b : Date.now(),
            durationInMinutes: (eventProps === null || eventProps === void 0 ? void 0 : eventProps.durationInMinutes) || 30,
            enableVideoCall: true,
        })
            .then(function (r) {
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(r);
        })
            .catch(onError);
    }, [session, onSuccess, onError]);
    return ((0, jsx_runtime_1.jsx)(react_components_1.UserAndEnduserSelector, __assign({}, props, { onSelect: handleCreateRoom })));
};
exports.CreateCalendarEventForAttendees = CreateCalendarEventForAttendees;
var WaitingRoomShared = function (_a) {
    var _b;
    var calendarEvent = _a.calendarEvent, join = _a.join, start = _a.start, onGoBack = _a.onGoBack;
    var session = (0, react_components_1.useResolvedSession)();
    var _c = (0, react_components_1.useCalendarEvents)(), findEvent = _c[1].findById;
    var _d = (0, react_components_1.useMeetings)(), findMeeting = _d[1].findById;
    var tsMeeting = findMeeting((_b = calendarEvent === null || calendarEvent === void 0 ? void 0 : calendarEvent.meetingId) !== null && _b !== void 0 ? _b : '');
    // poll to check for started meeting
    (0, react_1.useEffect)(function () {
        var t = setInterval(function () {
            var _a;
            var event = findEvent(calendarEvent.id, { reload: true });
            findMeeting((_a = event === null || event === void 0 ? void 0 : event.meetingId) !== null && _a !== void 0 ? _a : '', { reload: true }); // reloads tsMeeting
        }, 2500);
        return function () { clearInterval(t); };
    }, [calendarEvent, findMeeting, findEvent]);
    var meetingIsStarted = (tsMeeting === null || tsMeeting === void 0 ? void 0 : tsMeeting.status) === 'live';
    var isHost = session.userInfo.id === (calendarEvent === null || calendarEvent === void 0 ? void 0 : calendarEvent.creator);
    return ((0, jsx_runtime_1.jsxs)(react_components_1.Flex, __assign({ flex: 1, column: true, alignItems: "center", justifyContent: "center" }, { children: [(0, jsx_runtime_1.jsx)(react_components_1.Typography, __assign({ style: { fontSize: 20, fontWeight: 'bold' } }, { children: calendarEvent.title })), (0, jsx_runtime_1.jsx)(react_components_1.Typography, __assign({ style: { marginBottom: 15 } }, { children: "Waiting Room" })), (0, jsx_runtime_1.jsx)(video_1.LocalPreview, {}), (0, jsx_runtime_1.jsx)(react_components_1.LoadingButton, { variant: "contained", disabled: (!meetingIsStarted && !isHost)
                    || (!meetingIsStarted && !start)
                    || (meetingIsStarted && !tsMeeting), onClick: meetingIsStarted
                    ? function () { return join(tsMeeting.id); }
                    : start, submitText: meetingIsStarted ? "Join Meeting" : "Start Meeting", submittingText: meetingIsStarted ? "Joining" : "Starting", style: {
                    marginTop: 15,
                } }), onGoBack &&
                (0, jsx_runtime_1.jsx)(react_components_1.Button, __assign({ onClick: onGoBack, style: { width: '100%' } }, { children: "Back" })), !meetingIsStarted && !isHost &&
                (0, jsx_runtime_1.jsx)(react_components_1.Typography, __assign({ style: { marginTop: 5 } }, { children: "Waiting for the host to start the meeting" }))] })));
};
// Only users can start meeting, avoid using useStartAndJoin... hook as enduser
var WaitingRoomUser = function (props) {
    var startAndJoinMeeting = (0, video_1.useStartAndJoinMeetingForCalendarEvent)(props.calendarEvent.id).startAndJoinMeeting;
    var joinMeeting = (0, video_1.useJoinVideoCall)().joinMeeting;
    return (0, jsx_runtime_1.jsx)(WaitingRoomShared, __assign({}, props, { start: startAndJoinMeeting, join: joinMeeting }));
};
var WaitingRoomEnduser = function (props) {
    var joinMeeting = (0, video_1.useJoinVideoCall)().joinMeeting;
    return (0, jsx_runtime_1.jsx)(WaitingRoomShared, __assign({}, props, { join: joinMeeting }));
};
var WaitingRoom = function (props) {
    var session = (0, react_components_1.useResolvedSession)();
    var Component = session.type === 'user' ? WaitingRoomUser : WaitingRoomEnduser;
    return (0, jsx_runtime_1.jsx)(Component, __assign({}, props));
};
exports.WaitingRoom = WaitingRoom;
//# sourceMappingURL=video_shared.js.map