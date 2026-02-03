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
import { useCallback, useState } from 'react';
import { useResolvedSession, useSession } from '../authentication';
import { useCalendarEvents, useMeetings } from '../state';
import { useTwilioVideo } from './TwilioVideoContext';
/**
 * Hook for hosts to start a Twilio Video call for a calendar event
 */
export var useStartTwilioVideoCall = function (calendarEventId) {
    var session = useSession();
    var _a = useTwilioVideo(), connect = _a.connect, disconnect = _a.disconnect, setIsHost = _a.setIsHost, room = _a.room, isConnected = _a.isConnected;
    var _b = useCalendarEvents(), updateLocalEvent = _b[1].updateLocalElement;
    var _c = useState(false), starting = _c[0], setStarting = _c[1];
    var _d = useState(false), ending = _d[0], setEnding = _d[1];
    var startMeeting = useCallback(function (eventId) { return __awaiter(void 0, void 0, void 0, function () {
        var targetEventId, response, hostInfo, roomName, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    targetEventId = eventId || calendarEventId;
                    if (!targetEventId) {
                        throw new Error('No calendar event ID provided');
                    }
                    setStarting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, session.api.meetings.start_meeting_for_event({
                            calendarEventId: targetEventId,
                        })
                        // Update local event with meetingId
                    ];
                case 2:
                    response = _a.sent();
                    // Update local event with meetingId
                    updateLocalEvent(targetEventId, { meetingId: response.id });
                    hostInfo = response.host.info;
                    roomName = response.meeting.Meeting.ExternalMeetingId || response.id;
                    setIsHost(true);
                    return [4 /*yield*/, connect(hostInfo.JoinToken, roomName)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, response.id];
                case 4:
                    err_1 = _a.sent();
                    console.error('Failed to start Twilio meeting:', err_1);
                    throw err_1;
                case 5:
                    setStarting(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [session, calendarEventId, connect, setIsHost, updateLocalEvent]);
    var endMeeting = useCallback(function (meetingId) { return __awaiter(void 0, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setEnding(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, session.api.meetings.end_meeting({ id: meetingId })];
                case 2:
                    _a.sent();
                    disconnect();
                    return [3 /*break*/, 5];
                case 3:
                    err_2 = _a.sent();
                    console.error('Failed to end Twilio meeting:', err_2);
                    throw err_2;
                case 4:
                    setEnding(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [session, disconnect]);
    return {
        starting: starting,
        ending: ending,
        room: room,
        isConnected: isConnected,
        startMeeting: startMeeting,
        endMeeting: endMeeting,
    };
};
/**
 * Hook for participants to join a Twilio Video call
 */
export var useJoinTwilioVideoCall = function () {
    var session = useResolvedSession();
    var _a = useTwilioVideo(), connect = _a.connect, disconnect = _a.disconnect, room = _a.room, isConnected = _a.isConnected;
    var _b = useState(false), joining = _b[0], setJoining = _b[1];
    var joinMeeting = useCallback(function (calendarEventId) { return __awaiter(void 0, void 0, void 0, function () {
        var response, attendeeInfo, roomName, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setJoining(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, session.api.meetings.join_meeting_for_event({
                            calendarEventId: calendarEventId,
                        })];
                case 2:
                    response = _a.sent();
                    attendeeInfo = response.attendee.info;
                    roomName = response.meeting.Meeting.ExternalMeetingId || response.id;
                    return [4 /*yield*/, connect(attendeeInfo.JoinToken, roomName)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    err_3 = _a.sent();
                    console.error('Failed to join Twilio meeting:', err_3);
                    throw err_3;
                case 5:
                    setJoining(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [session, connect]);
    var leaveMeeting = useCallback(function () {
        disconnect();
    }, [disconnect]);
    return {
        joining: joining,
        room: room,
        isConnected: isConnected,
        joinMeeting: joinMeeting,
        leaveMeeting: leaveMeeting,
    };
};
/**
 * Hook for calendar event-based Twilio Video calls
 * Combines start and join functionality with meeting status polling
 */
export var useTwilioMeetingForCalendarEvent = function (calendarEventId) {
    var session = useResolvedSession();
    var _a = useTwilioVideo(), room = _a.room, isConnected = _a.isConnected;
    var _b = useStartTwilioVideoCall(calendarEventId), startMeeting = _b.startMeeting, starting = _b.starting;
    var _c = useJoinTwilioVideoCall(), joinMeeting = _c.joinMeeting, joining = _c.joining;
    var _d = useCalendarEvents(), findEvent = _d[1].findById;
    var _e = useMeetings(), findMeeting = _e[1].findById;
    var event = findEvent(calendarEventId);
    var meeting = (event === null || event === void 0 ? void 0 : event.meetingId) ? findMeeting(event.meetingId) : undefined;
    var startAndJoinMeeting = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, startMeeting(calendarEventId)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [startMeeting, calendarEventId]);
    var join = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, joinMeeting(calendarEventId)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [joinMeeting, calendarEventId]);
    var isHost = session.userInfo.id === (event === null || event === void 0 ? void 0 : event.creator);
    return {
        event: event,
        meeting: meeting,
        room: room,
        isConnected: isConnected,
        isHost: isHost,
        starting: starting,
        joining: joining,
        startAndJoinMeeting: startAndJoinMeeting,
        joinMeeting: join,
        meetingStatus: ((event === null || event === void 0 ? void 0 : event.videoIntegration) !== 'Twilio'
            ? 'disabled'
            : !(event === null || event === void 0 ? void 0 : event.meetingId)
                ? 'waiting-room'
                : isConnected
                    ? 'joined'
                    : 'loading'),
    };
};
//# sourceMappingURL=hooks.js.map