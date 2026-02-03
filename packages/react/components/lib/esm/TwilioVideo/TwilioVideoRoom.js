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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Grid } from '@mui/material';
import { useTwilioVideo } from './TwilioVideoContext';
import { TwilioParticipant } from './TwilioParticipant';
import { TwilioControlBar } from './TwilioControls';
export var TwilioVideoRoom = function (_a) {
    var onLeave = _a.onLeave, onEndForAll = _a.onEndForAll, style = _a.style, resolveIdentity = _a.resolveIdentity;
    var _b = useTwilioVideo(), room = _b.room, participants = _b.participants;
    if (!room)
        return null;
    var localParticipant = room.localParticipant;
    var hasRemoteParticipants = participants.length > 0;
    return (_jsxs(Box, __assign({ sx: __assign({ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: '#1a1a1a' }, style) }, { children: [_jsxs(Box, __assign({ sx: {
                    flex: 1,
                    position: 'relative',
                    overflow: 'hidden',
                } }, { children: [hasRemoteParticipants ? (_jsx(Grid, __assign({ container: true, sx: {
                            height: '100%',
                            width: '100%',
                        } }, { children: participants.map(function (participant) { return (_jsx(Grid, __assign({ item: true, xs: participants.length === 1 ? 12 : 6, sx: { height: participants.length <= 2 ? '100%' : '50%' } }, { children: _jsx(TwilioParticipant, { participant: participant, resolveIdentity: resolveIdentity }) }), participant.sid)); }) }))) : (
                    // When alone, show local video larger
                    _jsx(Box, __assign({ sx: { height: '100%', width: '100%' } }, { children: _jsx(TwilioParticipant, { participant: localParticipant, isLocal: true, resolveIdentity: resolveIdentity }) }))), hasRemoteParticipants && (_jsx(Box, __assign({ sx: {
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            width: 200,
                            height: 150,
                            zIndex: 10,
                            borderRadius: 1,
                            overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        } }, { children: _jsx(TwilioParticipant, { participant: localParticipant, isLocal: true, resolveIdentity: resolveIdentity }) })))] })), _jsx(TwilioControlBar, { onLeave: onLeave, onEndForAll: onEndForAll })] })));
};
//# sourceMappingURL=TwilioVideoRoom.js.map