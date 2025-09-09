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
exports.CreateChatRoom = exports.AttendeesList = exports.UserActiveBadge = exports.EnduserChatSplit = exports.UserChatSplit = exports.SplitChat = exports.UsersConversations = exports.EndusersConversations = exports.Conversations = exports.resolve_chat_room_name = exports.Messages = exports.MessagesWithHeader = exports.MessageAttachments = exports.SecureLinkText = exports.Message = exports.user_display_name = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_components_1 = require("@tellescope/react-components");
var utilities_1 = require("@tellescope/utilities");
Object.defineProperty(exports, "user_display_name", { enumerable: true, get: function () { return utilities_1.user_display_name; } });
var constants_1 = require("@tellescope/constants");
var components_1 = require("./components");
var MESSAGE_BORDER_RADIUS = 25;
var baseMessageStyle = {
    borderRadius: MESSAGE_BORDER_RADIUS,
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 6,
    paddingBottom: 6,
};
var defaultSentStyle = __assign(__assign({}, baseMessageStyle), { marginLeft: 'auto', marginRight: 5, backgroundColor: constants_1.PRIMARY_HEX, wordBreak: 'break-word' });
var defaultReceivedStyle = __assign(__assign({}, baseMessageStyle), { marginRight: 'auto', marginLeft: 5, backgroundColor: "#444444", wordBreak: 'break-word' });
var baseTextStyle = {
    color: "#ffffff",
};
var defaultSentTextStyle = __assign(__assign({}, baseTextStyle), { marginRight: 5, marginLeft: 5 });
var defaultReceivedTextStyle = __assign(__assign({}, baseTextStyle), { marginRight: 5, marginLeft: 5 });
var MessagesHeader = function (_a) {
    var room = _a.room, resolveSenderName = _a.resolveSenderName, p = __rest(_a, ["room", "resolveSenderName"]);
    return ((0, jsx_runtime_1.jsx)(react_components_1.Flex, { children: (0, jsx_runtime_1.jsx)(react_components_1.Typography, { children: room && (resolveSenderName === null || resolveSenderName === void 0 ? void 0 : resolveSenderName(room)) }) }));
};
var Message = function (_a) {
    var _b, _c;
    var message = _a.message, _d = _a.iconSize, iconSize = _d === void 0 ? 30 : _d, sentBgColor = _a.sentBgColor, sentTextColor = _a.sentTextColor, receivedBgColor = _a.receivedBgColor, receivedTextColor = _a.receivedTextColor, _e = _a.sentMessageStyle, sentMessageStyle = _e === void 0 ? defaultSentStyle : _e, _f = _a.receivedMessageStyle, receivedMessageStyle = _f === void 0 ? defaultReceivedStyle : _f, _g = _a.sentMessageTextStyle, sentMessageTextStyle = _g === void 0 ? defaultSentTextStyle : _g, _h = _a.receivedMessageTextStyle, receivedMessageTextStyle = _h === void 0 ? defaultReceivedTextStyle : _h, imageDimensions = _a.imageDimensions, style = _a.style, showDate = _a.showDate, showName = _a.showName;
    var session = (0, react_components_1.useResolvedSession)();
    var chatUserId = session.userInfo.id;
    var usersLoading = (0, react_components_1.useUsers)()[0];
    var endusersLoading = (0, react_components_1.useEndusers)()[0];
    // deep copy so that the override of background color doesn't affect other messages
    var textBGStyle = __assign({}, message.senderId === chatUserId ? sentMessageStyle : receivedMessageStyle);
    var textStyle = __assign({}, message.senderId === chatUserId ? sentMessageTextStyle : receivedMessageTextStyle);
    var quote = (_b = message === null || message === void 0 ? void 0 : message.quote) === null || _b === void 0 ? void 0 : _b.join(' \n');
    if (!message.message) {
        // Only remove background if HTML has inline styles (for customization)
        // Keep background for plain HTML without styling for better visibility
        var hasInlineStyles = message.html && message.html.includes('style=');
        if (hasInlineStyles) {
            textBGStyle.backgroundColor = undefined;
        }
    }
    else {
        if (message.senderId === chatUserId) {
            if (sentBgColor) {
                textBGStyle.backgroundColor = sentBgColor;
            }
            if (sentTextColor) {
                textBGStyle.color = sentTextColor;
            }
        }
        else if ((_c = message.mentions) === null || _c === void 0 ? void 0 : _c.includes(chatUserId)) {
            textBGStyle.backgroundColor = '#f6b139';
            textBGStyle.color = 'white';
        }
        else {
            if (receivedBgColor) {
                textBGStyle.backgroundColor = receivedBgColor;
            }
            if (receivedTextColor) {
                textBGStyle.color = receivedTextColor;
            }
        }
    }
    var attachments = (!!message.attachments && message.attachments.length > 0
        && (0, jsx_runtime_1.jsx)(exports.MessageAttachments, { message: message, chatUserId: chatUserId, imageDimensions: imageDimensions }));
    var messageComponent = react_components_1.IN_REACT_WEB ? ((0, jsx_runtime_1.jsxs)(react_components_1.Flex, __assign({ column: true, flex: 1 }, { children: [(0, jsx_runtime_1.jsx)(react_components_1.Typography, __assign({ component: "div", style: __assign(__assign(__assign({}, textStyle), textBGStyle), { marginBottom: attachments ? '4px' : undefined }) }, { children: (0, jsx_runtime_1.jsx)(components_1.HTMLMessage, { html: message.html || message.message.split('\n').join('<br/>') }) })), quote &&
                (0, jsx_runtime_1.jsx)(react_components_1.Typography, __assign({ title: "Quoting: ".concat(quote), style: __assign(__assign(__assign({}, textStyle), textBGStyle), { backgroundColor: undefined, color: 'black', borderLeft: '1px solid black', borderRadius: 0, borderWidth: 2, marginTop: 2, paddingTop: 1, paddingBottom: 1 }) }, { children: (0, utilities_1.truncate_string)(quote, { length: 75, showEllipsis: true }) })), attachments] }))) : ((0, jsx_runtime_1.jsxs)(react_components_1.Flex, __assign({ flex: 1 }, { children: [(0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ style: __assign({}, textBGStyle), alignItems: "center" }, { children: (0, jsx_runtime_1.jsx)(react_components_1.Typography, __assign({ style: __assign({}, textStyle) }, { children: message.html
                        ? (0, jsx_runtime_1.jsx)(components_1.HTMLMessage, { html: message.html })
                        : message.message })) })), (0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ justifyContent: message.senderId === chatUserId ? 'flex-end' : 'flex-start', style: { width: '100%' } }, { children: attachments }))] })));
    var isSender = session.userInfo.id === message.senderId;
    var userOrEnduser = ((isSender ? session.userInfo : undefined)
        || ((0, react_components_1.value_is_loaded)(usersLoading) ? usersLoading.value.find(function (u) { return u.id === message.senderId; }) : undefined)
        || ((0, react_components_1.value_is_loaded)(endusersLoading) ? endusersLoading.value.find(function (e) { return e.id === message.senderId; }) : undefined));
    var displayPicture = ((0, jsx_runtime_1.jsx)(react_components_1.DisplayPicture, { style: { maxWidth: '10%' }, user: userOrEnduser, size: iconSize }));
    return ((0, jsx_runtime_1.jsxs)(react_components_1.Flex, __assign({ column: true }, { children: [showDate && ((0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ alignSelf: "center", style: react_components_1.IN_REACT_WEB
                    ? {}
                    : {
                        marginTop: 8
                    } }, { children: (0, jsx_runtime_1.jsx)(react_components_1.Typography, { children: (0, utilities_1.formatted_date)(new Date(message.createdAt)) }) }))), showName && ((0, jsx_runtime_1.jsx)(react_components_1.Typography, __assign({ style: {
                    fontSize: 13, opacity: 0.8,
                    marginRight: isSender ? "".concat(iconSize + 12, "px") : 0,
                    marginLeft: isSender ? 'auto' : "".concat(iconSize + 12, "px"),
                    marginTop: 0, marginBottom: 0,
                } }, { children: (userOrEnduser === null || userOrEnduser === void 0 ? void 0 : userOrEnduser.displayName) || (0, utilities_1.user_display_name)(userOrEnduser) }))), (0, jsx_runtime_1.jsxs)(react_components_1.Flex, __assign({ style: __assign({ margin: 5, marginTop: showName ? 0 : 5, flexWrap: 'nowrap' }, style) }, { children: [message.senderId !== chatUserId && displayPicture, messageComponent, message.senderId === chatUserId && displayPicture] }))] })));
};
exports.Message = Message;
var SecureLinkText = function (_a) {
    var secureName = _a.secureName;
    var _b = (0, react_1.useState)(), file = _b[0], setFile = _b[1];
    (0, react_components_1.useFileForSecureName)({ secureName: secureName, onLoad: setFile });
    if (!file)
        return null;
    return ((0, jsx_runtime_1.jsx)(react_components_1.Typography, __assign({ style: {
            cursor: 'pointer',
            textDecoration: 'underline',
        }, onClick: function () {
            if (react_components_1.IN_REACT_WEB) {
                window.open(file.downloadURL, "_blank");
            }
            else {
                // todo: allow a function prop for handling open without requiring ReactNative in this package
                // require('react-native').Linking.openURL(file.downloadURL)
            }
        } }, { children: file.name })));
};
exports.SecureLinkText = SecureLinkText;
var MessageAttachments = function (_a) {
    var message = _a.message, chatUserId = _a.chatUserId, imageDimensions = _a.imageDimensions;
    if (!message.attachments)
        return null;
    if (message.attachments.length === 0)
        return null;
    return ((0, jsx_runtime_1.jsxs)(react_components_1.Flex, __assign({ column: true, alignSelf: message.senderId === chatUserId ? "flex-end" : "flex-start" }, { children: [message.attachments.filter(function (a) { return !a.type.startsWith('image') && !a.type.startsWith('video'); }).map(function (a) { return ((0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ style: {
                    marginRight: message.senderId === chatUserId ? 0 : 10,
                    marginLeft: message.senderId === chatUserId ? 10 : 0,
                    justifyContent: message.senderId === chatUserId ? "flex-end" : "flex-start",
                } }, { children: (0, jsx_runtime_1.jsx)(exports.SecureLinkText, { secureName: a.secureName }) }), a.secureName)); }), message.attachments.filter(function (a) { return a.type.startsWith('image'); }).map(function (a) { return ((0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ style: __assign({ marginRight: message.senderId === chatUserId ? 0 : 10, marginLeft: message.senderId === chatUserId ? 10 : 0, justifyContent: message.senderId === chatUserId ? "flex-end" : "flex-start" }, imageDimensions) }, { children: (0, jsx_runtime_1.jsx)(react_components_1.SecureImage, __assign({ secureName: a.secureName, alt: "image attachment" }, imageDimensions)) }), a.secureName)); }), message.attachments.filter(function (a) { return a.type.startsWith('video'); }).map(function (a) { return ((0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ style: __assign({ justifyContent: message.senderId === chatUserId ? "flex-end" : "flex-start" }, imageDimensions) }, { children: (0, jsx_runtime_1.jsx)(react_components_1.SecureVideo, __assign({ secureName: a.secureName }, imageDimensions)) }), a.secureName)); })] })));
};
exports.MessageAttachments = MessageAttachments;
/** @deprecated */
var MessagesWithHeader = function (_a) {
    var resolveSenderName = _a.resolveSenderName, messages = _a.messages, chatUserId = _a.chatUserId, _b = _a.Header, Header = _b === void 0 ? MessagesHeader : _b, headerProps = _a.headerProps, style = _a.style, imageDimensions = _a.imageDimensions, showNames = _a.showNames, messageStyles = __rest(_a, ["resolveSenderName", "messages", "chatUserId", "Header", "headerProps", "style", "imageDimensions", "showNames"]);
    return ((0, jsx_runtime_1.jsx)(react_components_1.LoadingLinear, { data: messages, render: function (messages) {
            var lastDate = 0;
            return ((0, jsx_runtime_1.jsxs)(react_components_1.Flex, __assign({ column: true, flex: 1, style: __assign(__assign({}, style), { overflowY: 'scroll' }) }, { children: [Header && (0, jsx_runtime_1.jsx)(Header, __assign({}, headerProps)), (0, jsx_runtime_1.jsx)(react_components_1.List, { reverse: true, items: messages, render: function (message) {
                            // show after 10+ minute exchanges 
                            var timestamp = new Date(message.createdAt).getTime();
                            var shouldShowDate = timestamp > (lastDate + 1000 * 60 * 10);
                            if (shouldShowDate) {
                                lastDate = timestamp;
                            }
                            return ((0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ column: true }, { children: (0, jsx_runtime_1.jsx)(exports.Message, __assign({ showName: showNames, message: message, imageDimensions: imageDimensions, showDate: shouldShowDate }, messageStyles)) })));
                        } })] })));
        } }));
};
exports.MessagesWithHeader = MessagesWithHeader;
var Messages = function (_a) {
    var resolveSenderName = _a.resolveSenderName, messages = _a.messages, chatUserId = _a.chatUserId, headerProps = _a.headerProps, style = _a.style, imageDimensions = _a.imageDimensions, markRead = _a.markRead, showNames = _a.showNames, messageStyles = __rest(_a, ["resolveSenderName", "messages", "chatUserId", "headerProps", "style", "imageDimensions", "markRead", "showNames"]);
    var session = (0, react_components_1.useResolvedSession)();
    var _b = (0, react_components_1.useChatRooms)(), _c = _b[1], findById = _c.findById, updateRoom = _c.updateLocalElement;
    var markReadRef = (0, react_1.useRef)('');
    (0, react_1.useEffect)(function () {
        var _a, _b, _c;
        if (!markRead)
            return;
        if (!(0, react_components_1.value_is_loaded)(messages))
            return;
        if (messages.value.length === 0)
            return;
        // already marked read
        var room = findById(messages.value[0].roomId);
        if (room && ((_b = (_a = room.infoForUser) === null || _a === void 0 ? void 0 : _a[session.userInfo.id]) === null || _b === void 0 ? void 0 : _b.unreadCount) === 0)
            return;
        var fetchKey = new Date((_c = room === null || room === void 0 ? void 0 : room.updatedAt) !== null && _c !== void 0 ? _c : 0).toString();
        if (fetchKey === markReadRef.current)
            return;
        markReadRef.current = fetchKey;
        session.api.chat_rooms.mark_read({ id: messages.value[0].roomId })
            .then(function (_a) {
            var updated = _a.updated;
            updateRoom(updated.id, updated);
        })
            .catch(console.error);
    }, [session, markRead, findById, messages, updateRoom]);
    return ((0, jsx_runtime_1.jsx)(react_components_1.LoadingLinear, { data: messages, render: function (_messages) {
            var sorted = _messages.sort(function (m1, m2) { return new Date(m1.timestamp || m1.createdAt).getTime() - new Date(m2.timestamp || m2.createdAt).getTime(); });
            var lastDate = 0;
            var previousSender = '';
            var showDateForMessage = {};
            for (var _i = 0, sorted_1 = sorted; _i < sorted_1.length; _i++) {
                var message = sorted_1[_i];
                var timestamp = new Date(message.createdAt).getTime();
                var showDate = timestamp > (lastDate + 1000 * 60 * 10);
                if (showDate) {
                    lastDate = timestamp;
                }
                var showName = session.userInfo.id !== message.senderId && previousSender !== message.senderId;
                previousSender = message.senderId || '';
                showDateForMessage[message.id] = { showDate: showDate, showName: showName };
            }
            return ((0, jsx_runtime_1.jsx)(react_components_1.List, { items: sorted, scrollToBottom: true, style: style, render: function (message) {
                    var _a, _b;
                    return ((0, jsx_runtime_1.jsx)(exports.Message, __assign({ message: message, imageDimensions: imageDimensions, showDate: (_a = showDateForMessage[message.id]) === null || _a === void 0 ? void 0 : _a.showDate, showName: showNames && ((_b = showDateForMessage[message.id]) === null || _b === void 0 ? void 0 : _b.showName) }, messageStyles)));
                } }));
        } }));
};
exports.Messages = Messages;
var defaultSidebarStyle = {
    borderRadius: 5,
    overflowY: 'auto',
};
var defaultSidebarItemStyle = {
    borderRadius: 5,
    cursor: 'pointer',
    maxHeight: 60,
    justifyContent: 'center',
};
var defaultSidebarItemStyleSelected = __assign(__assign({}, defaultSidebarItemStyle), { backgroundColor: constants_1.PRIMARY_HEX, cursor: "default" });
var defaultMessageNameStyle = {
    textAlign: 'right',
};
var defaultMessagePreviewStyle = {
    textAlign: 'right',
};
var resolve_chat_room_name = function (room, displayInfo, userType, currentUserId) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (room.recentSender !== currentUserId) {
        return (0, utilities_1.user_display_name)(displayInfo[(_a = room.recentSender) !== null && _a !== void 0 ? _a : '']);
    }
    if (userType === 'user') {
        return (0, utilities_1.user_display_name)(displayInfo[(_d = (_c = (_b = room === null || room === void 0 ? void 0 : room.enduserIds) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : room.creator) !== null && _d !== void 0 ? _d : '']);
    }
    if (userType === 'enduser') {
        return (0, utilities_1.user_display_name)(displayInfo[(_g = (_f = (_e = room === null || room === void 0 ? void 0 : room.userIds) === null || _e === void 0 ? void 0 : _e[0]) !== null && _f !== void 0 ? _f : room.creator) !== null && _g !== void 0 ? _g : '']);
    }
    return '';
};
exports.resolve_chat_room_name = resolve_chat_room_name;
var ConversationPreview = function (_a) {
    var _b;
    var onClick = _a.onClick, selected = _a.selected, room = _a.room, style = _a.style, displayInfo = _a.displayInfo, selectedStyle = _a.selectedStyle;
    var session = (0, react_components_1.useResolvedSession)();
    return ((0, jsx_runtime_1.jsxs)(react_components_1.Flex, __assign({ flex: 1, column: true, onClick: function () { return !selected && (onClick === null || onClick === void 0 ? void 0 : onClick(room)); }, style: selected ? (selectedStyle !== null && selectedStyle !== void 0 ? selectedStyle : defaultSidebarItemStyleSelected) : (style !== null && style !== void 0 ? style : defaultSidebarItemStyle) }, { children: [(0, jsx_runtime_1.jsx)(react_components_1.Typography, __assign({ style: defaultMessageNameStyle }, { children: (0, exports.resolve_chat_room_name)(room, displayInfo, session.type, session.userInfo.id) })), (0, jsx_runtime_1.jsx)(react_components_1.Typography, __assign({ style: defaultMessagePreviewStyle }, { children: (_b = room.recentMessage) !== null && _b !== void 0 ? _b : room.title }))] })));
};
var PreviewWithData = function (_a) {
    var _b = _a.PreviewComponent, PreviewComponent = _b === void 0 ? ConversationPreview : _b, props = __rest(_a, ["PreviewComponent"]);
    var displayInfo = (0, react_components_1.useChatRoomDisplayInfo)(props.room.id)[0];
    return ((0, jsx_runtime_1.jsx)(PreviewComponent, __assign({ displayInfo: (0, react_components_1.value_is_loaded)(displayInfo) ? displayInfo.value : {} }, props)));
};
var Conversations = function (_a) {
    var rooms = _a.rooms, selectedRoom = _a.selectedRoom, onRoomSelect = _a.onRoomSelect, _b = _a.PreviewComponent, PreviewComponent = _b === void 0 ? ConversationPreview : _b, style = _a.style, selectedItemStyle = _a.selectedItemStyle, itemStyle = _a.itemStyle;
    return ((0, jsx_runtime_1.jsx)(react_components_1.LoadingLinear, { data: rooms, render: function (rooms) {
            return (0, jsx_runtime_1.jsx)(react_components_1.List, { items: __spreadArray([], rooms, true).sort(function (r1, r2) { return new Date(r2.updatedAt).getTime() - new Date(r1.updatedAt).getTime(); }), style: style !== null && style !== void 0 ? style : defaultSidebarStyle, onClick: function (r) { return onRoomSelect(r.id); }, render: function (room, _a) {
                    var onClick = _a.onClick, index = _a.index;
                    return (0, jsx_runtime_1.jsx)(PreviewWithData, { room: room, onClick: onClick, selected: selectedRoom === room.id, selectedStyle: selectedItemStyle, style: itemStyle, PreviewComponent: PreviewComponent }, room.id);
                } });
        } }));
};
exports.Conversations = Conversations;
// deprecated while Conversations relies on useResolvedSession
var EndusersConversations = function (_a) {
    var enduserId = _a.enduserId, p = __rest(_a, ["enduserId"]);
    return (0, jsx_runtime_1.jsx)(exports.Conversations, __assign({}, p, { rooms: (0, react_components_1.useChatRooms)()[0] }));
};
exports.EndusersConversations = EndusersConversations;
// deprecated while Conversations relies on useResolvedSession
var UsersConversations = function (_a) {
    var userId = _a.userId, p = __rest(_a, ["userId"]);
    return (0, jsx_runtime_1.jsx)(exports.Conversations, __assign({}, p, { rooms: (0, react_components_1.useChatRooms)()[0] }));
};
exports.UsersConversations = UsersConversations;
var defaultSplitChatStyle = {};
var SplitChat = function (_a) {
    var session = _a.session, type = _a.type, _b = _a.style, style = _b === void 0 ? defaultSplitChatStyle : _b;
    var _c = (0, react_1.useState)(''), selectedRoom = _c[0], setSelectedRoom = _c[1];
    var messages = (0, react_components_1.useChats)(selectedRoom)[0];
    return ((0, jsx_runtime_1.jsxs)(react_components_1.Flex, __assign({ row: true, style: style, flex: 1 }, { children: [(0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ column: true, flex: 1 }, { children: type === 'user'
                    ? (0, jsx_runtime_1.jsx)(exports.UsersConversations, { userId: session.userInfo.id, selectedRoom: selectedRoom, onRoomSelect: setSelectedRoom })
                    : (0, jsx_runtime_1.jsx)(exports.EndusersConversations, { selectedRoom: selectedRoom, enduserId: session.userInfo.id, onRoomSelect: setSelectedRoom }) })), (0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ column: true, flex: 2, style: { borderRadius: 5 } }, { children: selectedRoom &&
                    (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ row: true, flex: 8 }, { children: (0, jsx_runtime_1.jsx)(exports.Messages, { messages: messages, chatUserId: session.userInfo.id }) })), (0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ row: true, flex: 1, style: { marginLeft: 10, marginRight: 10 } }, { children: (0, jsx_runtime_1.jsx)(components_1.SendMessage, { roomId: selectedRoom }) }))] }) }))] })));
};
exports.SplitChat = SplitChat;
var UserChatSplit = function (_a) {
    var _b = _a.style, style = _b === void 0 ? defaultSplitChatStyle : _b;
    var session = (0, react_components_1.useSession)();
    return ((0, jsx_runtime_1.jsx)(exports.SplitChat, { session: session, type: "user", style: style }));
};
exports.UserChatSplit = UserChatSplit;
var EnduserChatSplit = function (_a) {
    var _b = _a.style, style = _b === void 0 ? defaultSplitChatStyle : _b;
    var session = (0, react_components_1.useEnduserSession)();
    return ((0, jsx_runtime_1.jsx)(exports.SplitChat, { session: session, type: "enduser", style: style }));
};
exports.EnduserChatSplit = EnduserChatSplit;
var defaultColorForStatus = {
    Active: '#15ba11',
    Away: '#FFD125',
    Unavailable: '#DC1717'
};
var UserActiveBadge = function (_a) {
    var user = _a.user, style = _a.style, size = _a.size, activeThresholdMS = _a.activeThresholdMS, inactiveThresholdMS = _a.inactiveThresholdMS;
    var status = (0, utilities_1.user_is_active)(user, { activeThresholdMS: activeThresholdMS, inactiveThresholdMS: inactiveThresholdMS });
    if (status === null || status === 'Unavailable')
        return null;
    return ((0, jsx_runtime_1.jsx)(react_components_1.Badge, { color: defaultColorForStatus[status], size: size, style: style }));
};
exports.UserActiveBadge = UserActiveBadge;
var AttendeesList = function (_a) {
    var _b, _c, _d, _e;
    var roomId = _a.roomId, style = _a.style, attendeeStyle = _a.attendeeStyle;
    var _f = (0, react_components_1.useChatRooms)({ dontFetch: true }), findRoom = _f[1].findById;
    var displayInfo = (0, react_components_1.useUserAndEnduserDisplayInfo)();
    var room = findRoom(roomId);
    if (!room)
        return null;
    if (!(((_b = room.enduserIds) === null || _b === void 0 ? void 0 : _b.length) || ((_c = room.userIds) === null || _c === void 0 ? void 0 : _c.length)))
        throw new Error("This room has no users or endusers");
    return ((0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ flex: 1, column: true, style: style }, { children: __spreadArray(__spreadArray([], (_d = room.userIds) !== null && _d !== void 0 ? _d : [], true), (_e = room.enduserIds) !== null && _e !== void 0 ? _e : [], true).map(function (id) { return ((0, jsx_runtime_1.jsx)(react_components_1.Typography, __assign({ style: __assign({ fontSize: 18, narginBottom: 10 }, attendeeStyle) }, { children: (0, utilities_1.user_display_name)(displayInfo[id]) }))); }) })));
};
exports.AttendeesList = AttendeesList;
var CreateChatRoom = function (_a) {
    var _b = _a.roomTitle, defaultRoomTitle = _b === void 0 ? "Group Chat" : _b, onSuccess = _a.onSuccess, onError = _a.onError, roomType = _a.roomType, aboutEnduserId = _a.aboutEnduserId, _c = _a.addedUserIds, addedUserIds = _c === void 0 ? [] : _c, props = __rest(_a, ["roomTitle", "onSuccess", "onError", "roomType", "aboutEnduserId", "addedUserIds"]);
    var _d = (0, react_components_1.useChatRooms)({ dontFetch: true }), createRoom = _d[1].createElement;
    var _e = (0, react_1.useState)(defaultRoomTitle !== null && defaultRoomTitle !== void 0 ? defaultRoomTitle : ''), roomTitle = _e[0], setRoomTitle = _e[1];
    var handleCreateRoom = (0, react_1.useCallback)(function (_a) {
        var users = _a.users, endusers = _a.endusers;
        var userIds = users.map(function (u) { return u.id; });
        var enduserIds = endusers.map(function (e) { return e.id; });
        createRoom(__assign({ enduserIds: enduserIds, userIds: Array.from(new Set(__spreadArray(__spreadArray([], userIds, true), addedUserIds, true))), title: roomTitle, type: roomType }, aboutEnduserId ? { aboutEnduserId: aboutEnduserId } : {}))
            .then(function (r) {
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(r);
        })
            .catch(onError);
    }, [createRoom, roomTitle, onSuccess, onError, aboutEnduserId]);
    return ((0, jsx_runtime_1.jsx)(react_components_1.UserAndEnduserSelector, __assign({}, props, { onSelect: handleCreateRoom, initialSelected: addedUserIds, titleInput: (0, jsx_runtime_1.jsx)(react_components_1.TextField, { autoFocus: true, value: roomTitle, onChange: function (t) { return setRoomTitle(t); }, style: {
                width: props.searchBarPlacement !== 'top'
                    ? '100%'
                    : undefined
            }, label: "Title", placeholder: "Enter conversation title...", size: "small" }) })));
};
exports.CreateChatRoom = CreateChatRoom;
//# sourceMappingURL=chat.js.map