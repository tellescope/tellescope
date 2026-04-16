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
exports.TwilioVideoRoom = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var material_1 = require("@mui/material");
var TwilioVideoContext_1 = require("./TwilioVideoContext");
var TwilioParticipant_1 = require("./TwilioParticipant");
var TwilioControls_1 = require("./TwilioControls");
var TwilioVideoRoom = function (_a) {
    var onLeave = _a.onLeave, onEndForAll = _a.onEndForAll, style = _a.style, resolveIdentity = _a.resolveIdentity, _b = _a.showScreenShare, showScreenShareProp = _b === void 0 ? true : _b;
    var _c = (0, TwilioVideoContext_1.useTwilioVideo)(), room = _c.room, participants = _c.participants, isScreenSharing = _c.isScreenSharing, screenSharingParticipantSid = _c.screenSharingParticipantSid;
    if (!room)
        return null;
    var localParticipant = room.localParticipant;
    var hasRemoteParticipants = participants.length > 0;
    // Find who is sharing their screen (context-driven so React re-renders properly)
    var screenShareParticipant = (function () {
        if (isScreenSharing)
            return localParticipant;
        if (screenSharingParticipantSid) {
            return participants.find(function (p) { return p.sid === screenSharingParticipantSid; }) || null;
        }
        return null;
    })();
    var isScreenShareActive = screenShareParticipant !== null;
    // All participants for the camera strip (local + remote)
    var allParticipants = __spreadArray([
        localParticipant
    ], participants, true);
    if (isScreenShareActive) {
        // Presentation layout: screen share large on top, camera strip on bottom
        return ((0, jsx_runtime_1.jsxs)(material_1.Box, __assign({ sx: __assign({ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: '#1a1a1a' }, style) }, { children: [(0, jsx_runtime_1.jsx)(material_1.Box, __assign({ sx: {
                        flex: 1,
                        overflow: 'hidden',
                        minHeight: 0,
                    } }, { children: (0, jsx_runtime_1.jsx)(TwilioParticipant_1.TwilioParticipant, { participant: screenShareParticipant, isLocal: screenShareParticipant === localParticipant, showScreenShare: true, resolveIdentity: resolveIdentity }) })), (0, jsx_runtime_1.jsx)(material_1.Box, __assign({ sx: {
                        height: 120,
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        padding: 1,
                        overflowX: 'auto',
                        flexShrink: 0,
                    } }, { children: allParticipants.map(function (p) { return ((0, jsx_runtime_1.jsx)(material_1.Box, __assign({ sx: {
                            height: '100%',
                            aspectRatio: '4/3',
                            flexShrink: 0,
                            borderRadius: 1,
                            overflow: 'hidden',
                        } }, { children: (0, jsx_runtime_1.jsx)(TwilioParticipant_1.TwilioParticipant, { participant: p, isLocal: p === localParticipant, showScreenShare: false, resolveIdentity: resolveIdentity }) }), p.sid)); }) })), (0, jsx_runtime_1.jsx)(TwilioControls_1.TwilioControlBar, { onLeave: onLeave, onEndForAll: onEndForAll, showScreenShare: showScreenShareProp })] })));
    }
    // Normal layout (no screen share active)
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, __assign({ sx: __assign({ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: '#1a1a1a' }, style) }, { children: [(0, jsx_runtime_1.jsxs)(material_1.Box, __assign({ sx: {
                    flex: 1,
                    position: 'relative',
                    overflow: 'hidden',
                } }, { children: [hasRemoteParticipants ? ((0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ container: true, sx: {
                            height: '100%',
                            width: '100%',
                        } }, { children: participants.map(function (participant) { return ((0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: participants.length === 1 ? 12 : 6, sx: { height: participants.length <= 2 ? '100%' : '50%' } }, { children: (0, jsx_runtime_1.jsx)(TwilioParticipant_1.TwilioParticipant, { participant: participant, resolveIdentity: resolveIdentity }) }), participant.sid)); }) }))) : (
                    // When alone, show local video larger
                    (0, jsx_runtime_1.jsx)(material_1.Box, __assign({ sx: { height: '100%', width: '100%' } }, { children: (0, jsx_runtime_1.jsx)(TwilioParticipant_1.TwilioParticipant, { participant: localParticipant, isLocal: true, resolveIdentity: resolveIdentity }) }))), hasRemoteParticipants && ((0, jsx_runtime_1.jsx)(material_1.Box, __assign({ sx: {
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            width: 200,
                            height: 150,
                            zIndex: 10,
                            borderRadius: 1,
                            overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        } }, { children: (0, jsx_runtime_1.jsx)(TwilioParticipant_1.TwilioParticipant, { participant: localParticipant, isLocal: true, resolveIdentity: resolveIdentity }) })))] })), (0, jsx_runtime_1.jsx)(TwilioControls_1.TwilioControlBar, { onLeave: onLeave, onEndForAll: onEndForAll, showScreenShare: showScreenShareProp })] })));
};
exports.TwilioVideoRoom = TwilioVideoRoom;
//# sourceMappingURL=TwilioVideoRoom.js.map