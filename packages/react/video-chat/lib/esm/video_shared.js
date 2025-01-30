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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback, useEffect, useState } from "react";
import { useMeetings, UserAndEnduserSelector, useCalendarEvents, Flex, Typography, LoadingButton, useResolvedSession, Button, } from "@tellescope/react-components";
import { LocalPreview, useJoinVideoCall, useStartAndJoinMeetingForCalendarEvent } from "./video";
export var CurrentCallContext = React.createContext({});
export var useCurrentCallContext = function () {
    return React.useContext(CurrentCallContext);
};
export var CreateCalendarEventForAttendees = function (_a) {
    var _b;
    var onSuccess = _a.onSuccess, onError = _a.onError, eventProps = _a.eventProps, props = __rest(_a, ["onSuccess", "onError", "eventProps"]);
    var _c = useCalendarEvents({ dontFetch: true }), createEvent = _c[1].createElement;
    var eventTitle = useState((_b = eventProps === null || eventProps === void 0 ? void 0 : eventProps.title) !== null && _b !== void 0 ? _b : 'Video Call')[0];
    var session = useResolvedSession();
    var handleCreateRoom = useCallback(function (_a) {
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
    return (_jsx(UserAndEnduserSelector, __assign({}, props, { onSelect: handleCreateRoom })));
};
var WaitingRoomShared = function (_a) {
    var _b;
    var calendarEvent = _a.calendarEvent, join = _a.join, start = _a.start, onGoBack = _a.onGoBack;
    var session = useResolvedSession();
    var _c = useCalendarEvents(), findEvent = _c[1].findById;
    var _d = useMeetings(), findMeeting = _d[1].findById;
    var tsMeeting = findMeeting((_b = calendarEvent === null || calendarEvent === void 0 ? void 0 : calendarEvent.meetingId) !== null && _b !== void 0 ? _b : '');
    // poll to check for started meeting
    useEffect(function () {
        var t = setInterval(function () {
            var _a;
            var event = findEvent(calendarEvent.id, { reload: true });
            findMeeting((_a = event === null || event === void 0 ? void 0 : event.meetingId) !== null && _a !== void 0 ? _a : '', { reload: true }); // reloads tsMeeting
        }, 2500);
        return function () { clearInterval(t); };
    }, [calendarEvent, findMeeting, findEvent]);
    var meetingIsStarted = (tsMeeting === null || tsMeeting === void 0 ? void 0 : tsMeeting.status) === 'live';
    var isHost = session.userInfo.id === (calendarEvent === null || calendarEvent === void 0 ? void 0 : calendarEvent.creator);
    return (_jsxs(Flex, __assign({ flex: 1, column: true, alignItems: "center", justifyContent: "center" }, { children: [_jsx(Typography, __assign({ style: { fontSize: 20, fontWeight: 'bold' } }, { children: calendarEvent.title })), _jsx(Typography, __assign({ style: { marginBottom: 15 } }, { children: "Waiting Room" })), _jsx(LocalPreview, {}), _jsx(LoadingButton, { variant: "contained", disabled: (!meetingIsStarted && !isHost)
                    || (!meetingIsStarted && !start)
                    || (meetingIsStarted && !tsMeeting), onClick: meetingIsStarted
                    ? function () { return join(tsMeeting.id); }
                    : start, submitText: meetingIsStarted ? "Join Meeting" : "Start Meeting", submittingText: meetingIsStarted ? "Joining" : "Starting", style: {
                    marginTop: 15,
                } }), onGoBack &&
                _jsx(Button, __assign({ onClick: onGoBack, style: { width: '100%' } }, { children: "Back" })), !meetingIsStarted && !isHost &&
                _jsx(Typography, __assign({ style: { marginTop: 5 } }, { children: "Waiting for the host to start the meeting" }))] })));
};
// Only users can start meeting, avoid using useStartAndJoin... hook as enduser
var WaitingRoomUser = function (props) {
    var startAndJoinMeeting = useStartAndJoinMeetingForCalendarEvent(props.calendarEvent.id).startAndJoinMeeting;
    var joinMeeting = useJoinVideoCall().joinMeeting;
    return _jsx(WaitingRoomShared, __assign({}, props, { start: startAndJoinMeeting, join: joinMeeting }));
};
var WaitingRoomEnduser = function (props) {
    var joinMeeting = useJoinVideoCall().joinMeeting;
    return _jsx(WaitingRoomShared, __assign({}, props, { join: joinMeeting }));
};
export var WaitingRoom = function (props) {
    var session = useResolvedSession();
    var Component = session.type === 'user' ? WaitingRoomUser : WaitingRoomEnduser;
    return _jsx(Component, __assign({}, props));
};
//# sourceMappingURL=video_shared.js.map