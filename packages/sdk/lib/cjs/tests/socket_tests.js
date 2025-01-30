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
exports.notification_tests = exports.get_sha256 = void 0;
var crypto_1 = require("crypto");
var testing_1 = require("@tellescope/testing");
var utilities_1 = require("@tellescope/utilities");
var enduser_1 = require("../enduser");
var sdk_1 = require("../sdk");
var constants_1 = require("@tellescope/constants");
var get_sha256 = function (s) {
    if (s === void 0) { s = ''; }
    return (0, crypto_1.createHash)('sha256').update(s).digest('hex');
};
exports.get_sha256 = get_sha256;
var VERBOSE = false; // true
var AWAIT_SOCKET_DURATION = 1000; // 25ms was generally passing for Redis, 1000ms should be upper limit of performance
var host = process.env.TEST_URL || 'http://localhost:8080';
var _a = [process.env.TEST_EMAIL, process.env.TEST_PASSWORD], email = _a[0], password = _a[1];
var _b = [process.env.TEST_EMAIL_2, process.env.TEST_PASSWORD_2], email2 = _b[0], password2 = _b[1];
var _c = [process.env.NON_ADMIN_EMAIL, process.env.NON_ADMIN_PASSWORD], nonAdminEmail = _c[0], nonAdminPassword = _c[1];
var businessId = '60398b1131a295e64f084ff6';
var subUserEmail = process.env.SUB_EMAIL;
var otherSubUserEmail = process.env.OTHER_SUB_EMAIL;
var subSubUserEmail = process.env.SUB_SUB_EMAIL;
var user1 = new sdk_1.Session({ host: host, enableSocketLogging: VERBOSE });
var user2 = new sdk_1.Session({ host: host, enableSocketLogging: VERBOSE });
var sdkNonAdmin = new sdk_1.Session({ host: host });
var sdkSub = new sdk_1.Session({ host: host });
var sdkOtherSub = new sdk_1.Session({ host: host });
var sdkSubSub = new sdk_1.Session({ host: host });
var enduserSDK = new enduser_1.EnduserSession({ host: host, businessId: businessId, enableSocketLogging: VERBOSE });
if (!(email && subUserEmail && otherSubUserEmail && subSubUserEmail && password && email2 && password2 && nonAdminEmail && nonAdminPassword)) {
    console.error("Set TEST_EMAIL and TEST_PASSWORD");
    process.exit(1);
}
// consistent passing at 150ms AWAIT SOCKET DURATION
var basic_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var socket_events, e, es;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                (0, testing_1.log_header)("Basic Tests");
                socket_events = [];
                user2.handle_events({
                    'created-endusers': function (es) { return socket_events.push(es); },
                    'updated-endusers': function (es) { return socket_events.push(es); },
                    'deleted-endusers': function (es) { return socket_events.push(es); },
                });
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
            case 1:
                _e.sent();
                return [4 /*yield*/, user1.api.endusers.createOne({ email: "sockets@tellescope.com" })];
            case 2:
                e = _e.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
            case 3:
                _e.sent();
                (0, testing_1.assert)((0, utilities_1.objects_equivalent)(e, (_a = socket_events === null || socket_events === void 0 ? void 0 : socket_events[0]) === null || _a === void 0 ? void 0 : _a[0]), 'inconsistent socket create', 'socket create');
                return [4 /*yield*/, user1.api.endusers.updateOne(e.id, { fname: 'Gary' })];
            case 4:
                _e.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
            case 5:
                _e.sent();
                (0, testing_1.assert)(((_c = (_b = socket_events[1]) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.fname) === 'Gary', 'inconsistent socket update', 'socket update');
                return [4 /*yield*/, user1.api.endusers.deleteOne(e.id)];
            case 6:
                _e.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
            case 7:
                _e.sent();
                (0, testing_1.assert)(((_d = socket_events[2]) === null || _d === void 0 ? void 0 : _d[0]) === e.id, 'inconsistent socket delete', 'socket delete');
                return [4 /*yield*/, user1.api.endusers.createSome([{ email: "sockets@tellescope.com" }, { email: 'sockets2@tellescope.com' }])];
            case 8:
                es = (_e.sent()).created;
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
            case 9:
                _e.sent();
                (0, testing_1.assert)((0, utilities_1.objects_equivalent)(es, socket_events === null || socket_events === void 0 ? void 0 : socket_events[3]), 'inconsistent socket create many', 'socket create many');
                return [2 /*return*/];
        }
    });
}); };
var sub_organization_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var root_events, sub_events, other_sub_events, sub_sub_events, e, e2;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                (0, testing_1.log_header)("Sub Organization Tests");
                root_events = [];
                sub_events = [];
                other_sub_events = [];
                sub_sub_events = [];
                user1.handle_events({ 'created-endusers': function (es) { return root_events.push(es); } });
                sdkSub.handle_events({ 'created-endusers': function (es) { return sub_events.push(es); } });
                sdkOtherSub.handle_events({ 'created-endusers': function (es) { return other_sub_events.push(es); } });
                sdkSubSub.handle_events({ 'created-endusers': function (es) { return sub_sub_events.push(es); } });
                return [4 /*yield*/, sdkSub.api.endusers.createOne({ email: "sockets_other@tellescope.com" })];
            case 1:
                e = _e.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION * 3)];
            case 2:
                _e.sent();
                (0, testing_1.assert)((0, utilities_1.objects_equivalent)(e, (_a = root_events === null || root_events === void 0 ? void 0 : root_events[0]) === null || _a === void 0 ? void 0 : _a[0]), 'access error', 'root gets sub');
                (0, testing_1.assert)((0, utilities_1.objects_equivalent)(e, (_b = sub_events === null || sub_events === void 0 ? void 0 : sub_events[0]) === null || _b === void 0 ? void 0 : _b[0]), 'access error', 'sub gets sub');
                (0, testing_1.assert)(other_sub_events.length === 0, 'got access incorrectly', 'other sub no access');
                (0, testing_1.assert)(sub_sub_events.length === 0, 'got access incorrectly', 'sub sub no access');
                return [4 /*yield*/, user1.api.endusers.createOne({ email: "sockets_other_shared@tellescope.com", sharedWithOrganizations: [sdkSub.userInfo.organizationIds] })];
            case 3:
                e2 = _e.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION * 3)];
            case 4:
                _e.sent();
                (0, testing_1.assert)((0, utilities_1.objects_equivalent)(e2, (_c = root_events === null || root_events === void 0 ? void 0 : root_events[1]) === null || _c === void 0 ? void 0 : _c[0]), 'access error', 'root confirmation on shared');
                (0, testing_1.assert)((0, utilities_1.objects_equivalent)(e2, (_d = sub_events === null || sub_events === void 0 ? void 0 : sub_events[1]) === null || _d === void 0 ? void 0 : _d[0]), 'access error', 'sub gets sub shared');
                (0, testing_1.assert)(other_sub_events.length === 0, 'got access incorrectly', 'other sub no access');
                (0, testing_1.assert)(sub_sub_events.length === 0, 'got access incorrectly', 'sub sub no access');
                return [4 /*yield*/, Promise.all([
                        user1.api.endusers.deleteOne(e.id),
                        user1.api.endusers.deleteOne(e2.id),
                    ])];
            case 5:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); };
var access_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var user1Events, nonAdminEvents, enduserEvents, user1Id, user2Id, room, sharedRoom, sharedChat, sharedChat2, unassignedEnduser, assignedEnduser, roomUnassigned, roomUnassignedWithUser, roomAssigned, userMessage, enduserMessage, nonAdminMessage, _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                user1Events = [];
                nonAdminEvents = [];
                enduserEvents = [];
                user1.handle_events({ 'created-chat_rooms': function (rs) { return user1Events.push.apply(user1Events, rs); } });
                sdkNonAdmin.handle_events({ 'created-chat_rooms': function (rs) { return nonAdminEvents.push.apply(nonAdminEvents, rs); } });
                user1Id = user1.userInfo.id;
                user2Id = sdkNonAdmin.userInfo.id;
                return [4 /*yield*/, user1.api.chat_rooms.createOne({ type: 'internal', userIds: [user1Id] })];
            case 1:
                room = _d.sent();
                return [4 /*yield*/, user1.api.chat_rooms.createOne({ type: 'internal', userIds: [user1Id, user2Id] })];
            case 2:
                sharedRoom = _d.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
            case 3:
                _d.sent();
                (0, testing_1.assert)(user1Events.length === 2, 'bad event distribution for filter', 'creator gets socket notifications');
                (0, testing_1.assert)(nonAdminEvents.length === 1 && sharedRoom.id === nonAdminEvents[0].id, 'bad event distribution for filter', 'verify filter socket push');
                user1.handle_events({
                    'created-chat_rooms': function (rs) { return user1Events.push.apply(user1Events, rs); },
                    'created-chats': function (rs) { return user1Events.push.apply(user1Events, rs); },
                    'created-tickets': function (rs) { return user1Events.push.apply(user1Events, rs); },
                    'created-endusers': function (rs) { return user1Events.push.apply(user1Events, rs); },
                    'updated-chats': function (rs) { return user1Events.push.apply(user1Events, rs); },
                    'deleted-chats': function (rs) { return user1Events.push.apply(user1Events, rs); },
                });
                sdkNonAdmin.handle_events({
                    'created-chat_rooms': function (rs) { return nonAdminEvents.push.apply(nonAdminEvents, rs); },
                    'created-chats': function (rs) { return nonAdminEvents.push.apply(nonAdminEvents, rs); },
                    'created-tickets': function (rs) { return nonAdminEvents.push.apply(nonAdminEvents, rs); },
                    'created-endusers': function (rs) { return nonAdminEvents.push.apply(nonAdminEvents, rs); },
                    'updated-chats': function (rs) { return nonAdminEvents.push.apply(nonAdminEvents, rs); },
                    'deleted-chats': function (rs) { return nonAdminEvents.push.apply(nonAdminEvents, rs); },
                });
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
            case 4:
                _d.sent();
                return [4 /*yield*/, user1.api.chats.createOne({ roomId: room.id, message: "Hello!", })];
            case 5:
                _d.sent();
                return [4 /*yield*/, user1.api.chats.createOne({ roomId: room.id, message: "Hello...", })];
            case 6:
                _d.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
            case 7:
                _d.sent();
                (0, testing_1.assert)(user1Events.length === 4, 'bad chats self', 'chats to self');
                (0, testing_1.assert)(nonAdminEvents.length === 1, 'non-admin got chats', 'non admin doesnt get chats for unassigned room');
                return [4 /*yield*/, user1.api.chats.createOne({ roomId: sharedRoom.id, message: "Hello from admin on shared", })];
            case 8:
                sharedChat = _d.sent();
                return [4 /*yield*/, sdkNonAdmin.api.chats.createOne({ roomId: sharedRoom.id, message: "Hello from nonadmin on shared", })];
            case 9:
                sharedChat2 = _d.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
            case 10:
                _d.sent();
                (0, testing_1.assert)(user1Events.length === 6 && !!user1Events.find(function (r) { return (r === null || r === void 0 ? void 0 : r.id) === sharedChat2.id; }), 'bad chats other', 'verify chat received');
                (0, testing_1.assert)(nonAdminEvents.length === 3 && !!nonAdminEvents.find(function (e) { return e.id === sharedChat.id; }), 'bad chats self, non-admin', 'push valid for non-admin default access');
                return [4 /*yield*/, user1.api.endusers.createOne({ email: 'unassigned@tellescope.com' })];
            case 11:
                unassignedEnduser = _d.sent();
                return [4 /*yield*/, user1.api.endusers.createOne({ email: 'assigned@tellescope.com', assignedTo: [user2Id] })];
            case 12:
                assignedEnduser = _d.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
            case 13:
                _d.sent();
                (0, testing_1.assert)(!!user1Events.find(function (e) { return e.id === unassignedEnduser.id; }) && !!user1Events.find(function (e) { return e.id === assignedEnduser.id; }), 'admin did not get endusers', 'admin got assigned and unassigned endusers');
                (0, testing_1.assert)(!nonAdminEvents.find(function (e) { return e.id === unassignedEnduser.id; }) && !!nonAdminEvents.find(function (e) { return e.id === assignedEnduser.id; }), 'non-admin got incorrect endusers', 'non-admin got assigned enduser');
                return [4 /*yield*/, user1.api.endusers.set_password({ id: unassignedEnduser.id, password: 'enduserPassword!' })];
            case 14:
                _d.sent();
                return [4 /*yield*/, enduserSDK.authenticate(unassignedEnduser.email, 'enduserPassword!')];
            case 15:
                _d.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
            case 16:
                _d.sent();
                enduserSDK.handle_events({
                    'created-chat_rooms': function (rs) { return enduserEvents.push.apply(enduserEvents, rs); },
                    'created-chats': function (rs) { return enduserEvents.push.apply(enduserEvents, rs); },
                    'created-tickets': function (rs) { return enduserEvents.push.apply(enduserEvents, rs); },
                });
                return [4 /*yield*/, user1.api.chat_rooms.createOne({ enduserIds: [unassignedEnduser.id] })
                    // test non-admin user in userIds gets message
                ];
            case 17:
                roomUnassigned = _d.sent();
                return [4 /*yield*/, user1.api.chat_rooms.createOne({ enduserIds: [unassignedEnduser.id], userIds: [user2Id] })
                    // test non-admin user who is assigned to enduser gets messages
                ];
            case 18:
                roomUnassignedWithUser = _d.sent();
                return [4 /*yield*/, user1.api.chat_rooms.createOne({ enduserIds: [assignedEnduser.id] })];
            case 19:
                roomAssigned = _d.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
            case 20:
                _d.sent();
                (0, testing_1.assert)((!!user1Events.find(function (e) { return e.id === roomUnassigned.id; })
                    && !!user1Events.find(function (e) { return e.id === roomUnassignedWithUser.id; })
                    && !!user1Events.find(function (e) { return e.id === roomAssigned.id; })), 'user did not get chat rooms', 'user got chat rooms');
                (0, testing_1.assert)((!nonAdminEvents.find(function (e) { return e.id === roomUnassigned.id; }) // shouldn't get as non-admin
                    && !!nonAdminEvents.find(function (e) { return e.id === roomUnassignedWithUser.id; }) // gets for in room
                    && !!nonAdminEvents.find(function (e) { return e.id === roomAssigned.id; }) // gets for enduser assignment
                ), 'non-admin did not get chat rooms', 'non-admin got chat rooms');
                (0, testing_1.assert)((!!enduserEvents.find(function (e) { return e.id === roomUnassigned.id; })
                    && !!enduserEvents.find(function (e) { return e.id === roomUnassignedWithUser.id; })
                    && !enduserEvents.find(function (e) { return e.id === roomAssigned.id; })), "enduser did not get chat rooms: ".concat(JSON.stringify(enduserEvents, null, 2)), 'enduser got chat rooms');
                return [4 /*yield*/, user1.api.chats.createOne({ message: 'user unassigned', roomId: roomUnassigned.id })];
            case 21:
                userMessage = _d.sent();
                return [4 /*yield*/, enduserSDK.api.chats.createOne({ message: 'enduseruser unassigned', roomId: roomUnassigned.id })];
            case 22:
                enduserMessage = _d.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
            case 23:
                _d.sent();
                (0, testing_1.assert)(!!enduserEvents.find(function (e) { return e.id === userMessage.id; }), 'enduser did not get message', 'enduser got message from user');
                (0, testing_1.assert)(!!user1Events.find(function (e) { return e.id === enduserMessage.id; }), 'user did not get message', 'user got message from enduser');
                (0, testing_1.assert)(!nonAdminEvents.find(function (e) { return e.id === enduserMessage.id; }) && !nonAdminEvents.find(function (e) { return e.id === userMessage.id; }), 'non-admin got unexpected message', 'non-admin correctly did not get message from enduser or user');
                return [4 /*yield*/, user1.api.chats.createOne({ message: 'user unassigned with user', roomId: roomUnassignedWithUser.id })];
            case 24:
                userMessage = _d.sent();
                return [4 /*yield*/, enduserSDK.api.chats.createOne({ message: 'enduser unassigned with user', roomId: roomUnassignedWithUser.id })];
            case 25:
                enduserMessage = _d.sent();
                return [4 /*yield*/, sdkNonAdmin.api.chats.createOne({ message: 'non-admin unassigned with non', roomId: roomUnassignedWithUser.id })];
            case 26:
                nonAdminMessage = _d.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
            case 27:
                _d.sent();
                (0, testing_1.assert)(!!enduserEvents.find(function (e) { return e.id === userMessage.id; }) && !!enduserEvents.find(function (e) { return e.id === nonAdminMessage.id; }), 'enduser did not get message', 'enduser got message from user');
                (0, testing_1.assert)(!!user1Events.find(function (e) { return e.id === enduserMessage.id; }) && !!user1Events.find(function (e) { return e.id === nonAdminMessage.id; }), 'user did not get messages', 'user got messages');
                (0, testing_1.assert)(!!nonAdminEvents.find(function (e) { return e.id === enduserMessage.id; }) && !!nonAdminEvents.find(function (e) { return e.id === userMessage.id; }), 'non-admin didnt get messages', 'non-admin got message from user and enduser');
                return [4 /*yield*/, user1.api.endusers.set_password({ id: assignedEnduser.id, password: 'enduserPassword!' })];
            case 28:
                _d.sent();
                return [4 /*yield*/, enduserSDK.authenticate(assignedEnduser.email, 'enduserPassword!')];
            case 29:
                _d.sent();
                enduserSDK.handle_events({
                    'created-chats': function (rs) { return enduserEvents.push.apply(enduserEvents, rs); },
                });
                return [4 /*yield*/, user1.api.chats.createOne({ message: 'user assigned', roomId: roomAssigned.id })];
            case 30:
                userMessage = _d.sent();
                return [4 /*yield*/, enduserSDK.api.chats.createOne({ message: 'enduser assigned', roomId: roomAssigned.id })];
            case 31:
                enduserMessage = _d.sent();
                return [4 /*yield*/, sdkNonAdmin.api.chats.createOne({ message: 'non-admin assigned', roomId: roomAssigned.id })];
            case 32:
                nonAdminMessage = _d.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION * 2)];
            case 33:
                _d.sent();
                (0, testing_1.assert)(!!enduserEvents.find(function (e) { return e.id === userMessage.id; }) && !!enduserEvents.find(function (e) { return e.id === nonAdminMessage.id; }), 'enduser did not get messages', 'enduser got messages from users');
                (0, testing_1.assert)(!!user1Events.find(function (e) { return e.id === enduserMessage.id; }) && !!user1Events.find(function (e) { return e.id === nonAdminMessage.id; }), 'user did not get messages', 'user got messages');
                (0, testing_1.assert)(!!nonAdminEvents.find(function (e) { return e.id === enduserMessage.id; }) && !!nonAdminEvents.find(function (e) { return e.id === userMessage.id; }), 'non-admin didnt get messages', 'non-admin got message from user and enduser');
                _b = (_a = Promise).all;
                return [4 /*yield*/, user1.api.endusers.deleteOne(unassignedEnduser.id)];
            case 34:
                _c = [
                    _d.sent()
                ];
                return [4 /*yield*/, user1.api.endusers.deleteOne(assignedEnduser.id)];
            case 35:
                _c = _c.concat([
                    _d.sent()
                ]);
                return [4 /*yield*/, user1.api.chat_rooms.deleteOne(roomAssigned.id)];
            case 36:
                _c = _c.concat([
                    _d.sent()
                ]);
                return [4 /*yield*/, user1.api.chat_rooms.deleteOne(roomUnassigned.id)];
            case 37:
                _c = _c.concat([
                    _d.sent()
                ]);
                return [4 /*yield*/, user1.api.chat_rooms.deleteOne(roomUnassignedWithUser.id)];
            case 38: return [4 /*yield*/, _b.apply(_a, [_c.concat([
                        _d.sent()
                    ])])];
            case 39:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); };
var enduser_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var enduser, userEvents, enduserEvents, room, messageToEnduser, messageToUser, unusedTicket, ticketForEnduser, ticketFromEnduser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, testing_1.log_header)("Enduser Tests");
                return [4 /*yield*/, user1.api.endusers.createOne({ email: "enduser@tellescope.com" })];
            case 1:
                enduser = _a.sent();
                return [4 /*yield*/, user1.api.endusers.set_password({ id: enduser.id, password: 'enduserPassword!' })];
            case 2:
                _a.sent();
                return [4 /*yield*/, enduserSDK.authenticate(enduser.email, 'enduserPassword!')];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
            case 4:
                _a.sent();
                userEvents = [];
                enduserEvents = [];
                user1.handle_events({
                    'created-chats': function (rs) { return userEvents.push.apply(userEvents, rs); },
                    'created-tickets': function (rs) { return userEvents.push.apply(userEvents, rs); },
                });
                enduserSDK.handle_events({
                    'created-chats': function (rs) { return enduserEvents.push.apply(enduserEvents, rs); },
                    'created-tickets': function (rs) { return enduserEvents.push.apply(enduserEvents, rs); },
                });
                return [4 /*yield*/, user1.api.chat_rooms.createOne({
                        type: 'external',
                        userIds: [user1.userInfo.id],
                        enduserIds: [enduser.id],
                    })];
            case 5:
                room = _a.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
            case 6:
                _a.sent();
                return [4 /*yield*/, user1.api.chats.createOne({ roomId: room.id, message: "Hello!" })];
            case 7:
                messageToEnduser = _a.sent();
                return [4 /*yield*/, enduserSDK.api.chats.createOne({ roomId: room.id, message: "Hello right back!" })];
            case 8:
                messageToUser = _a.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
            case 9:
                _a.sent();
                (0, testing_1.assert)(!!userEvents.find(function (e) { return e.id === messageToUser.id; }), 'no message on socket for user', 'push message to user');
                (0, testing_1.assert)(!!enduserEvents.find(function (e) { return e.id === messageToEnduser.id; }), 'no message on socket for enduser', 'push message to enduser');
                return [4 /*yield*/, user1.api.tickets.createOne({ enduserId: constants_1.PLACEHOLDER_ID, title: "For Noone" })]; // should not get pushed to enduser
            case 10:
                unusedTicket = _a.sent() // should not get pushed to enduser
                ;
                return [4 /*yield*/, user1.api.tickets.createOne({ enduserId: enduser.id, title: "For enduser" })];
            case 11:
                ticketForEnduser = _a.sent();
                return [4 /*yield*/, enduserSDK.api.tickets.createOne({ enduserId: enduser.id, title: "By enduser" })];
            case 12:
                ticketFromEnduser = _a.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
            case 13:
                _a.sent();
                (0, testing_1.assert)(!!userEvents.find(function (t) { return t.id === ticketFromEnduser.id; }), 'no ticket on socket for user', 'push ticket to user');
                (0, testing_1.assert)(!!enduserEvents.find(function (t) { return t.id === ticketForEnduser.id; }), 'no ticket on socket for enduser', 'push ticket to enduser');
                (0, testing_1.assert)(!enduserEvents.find(function (t) { return t.id === unusedTicket.id; }), 'enduser got an orgwide ticket', 'enduser does not receive org-wide ticket');
                return [4 /*yield*/, user1.api.tickets.deleteOne(unusedTicket.id)];
            case 14:
                _a.sent();
                return [4 /*yield*/, user1.api.tickets.deleteOne(ticketForEnduser.id)];
            case 15:
                _a.sent();
                return [4 /*yield*/, user1.api.tickets.deleteOne(ticketFromEnduser.id)
                    // test enduser logout
                ];
            case 16:
                _a.sent();
                // test enduser logout
                return [4 /*yield*/, enduserSDK.api.endusers.logout()];
            case 17:
                // test enduser logout
                _a.sent();
                return [4 /*yield*/, (0, testing_1.async_test)("verify enduser logout works", function () { return enduserSDK.api.chats.getOne({}); }, { shouldError: true, onError: function (e) { return e === 'Unauthenticated'; } }
                    // { shouldError: true, onError: (e: string) => !!e }
                    )
                    // keep these models around for front-end testing
                    // cleanup
                    // await user1.api.endusers.deleteOne(enduser.id) 
                    // await user1.api.chats.deleteOne(messageToEnduser.id)
                    // await user1.api.chats.deleteOne(messageToUser.id)
                ];
            case 18:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var TEST_SESSION_DURATION = 2; // seconds
var SESSION_TIMEOUT_DELAY = 4000; // ms
var deauthentication_tests = function (byTimeout) {
    if (byTimeout === void 0) { byTimeout = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var enduser, room, userEvents, enduserEvents, badChatEnduser, badChat;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, testing_1.log_header)("Unauthenticated Tests ".concat(byTimeout ? '- With Timeout, requires Worker' : '- With Manual Logout'));
                    return [4 /*yield*/, user1.api.endusers.createOne({ email: "socketenduser@tellescope.com" })];
                case 1:
                    enduser = _a.sent();
                    return [4 /*yield*/, user1.api.endusers.set_password({ id: enduser.id, password: 'enduserPassword!' })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, enduserSDK.authenticate(enduser.email, 'enduserPassword!', { durationInSeconds: byTimeout ? TEST_SESSION_DURATION : undefined })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, user1.api.chat_rooms.createOne({
                            type: 'external',
                            userIds: [user1.userInfo.id],
                            enduserIds: [enduser.id],
                        })];
                case 5:
                    room = _a.sent();
                    userEvents = [];
                    enduserEvents = [];
                    user1.handle_events({ 'created-chats': function (rs) { return userEvents.push.apply(userEvents, rs); } });
                    enduserSDK.handle_events({ 'created-chats': function (rs) { return enduserEvents.push.apply(enduserEvents, rs); } });
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
                case 6:
                    _a.sent();
                    if (!!byTimeout) return [3 /*break*/, 8];
                    return [4 /*yield*/, enduserSDK.api.endusers.logout()];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, (0, testing_1.wait)(undefined, TEST_SESSION_DURATION * 1000 + SESSION_TIMEOUT_DELAY)];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10: return [4 /*yield*/, user1.api.chats.createOne({ roomId: room.id, message: "Hello!" })];
                case 11:
                    badChatEnduser = _a.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
                case 12:
                    _a.sent();
                    (0, testing_1.assert)(enduserEvents.find(function (c) { return c.id === badChatEnduser.id; }) === undefined, 'enduser got message after logout on socket', 'enduser logged out');
                    // re-authenticate enduser to send message to user
                    return [4 /*yield*/, enduserSDK.authenticate(enduser.email, 'enduserPassword!')
                        // ensure user logged out appropriately for not receiving message
                    ];
                case 13:
                    // re-authenticate enduser to send message to user
                    _a.sent();
                    // ensure user logged out appropriately for not receiving message
                    return [4 /*yield*/, user1.logout()];
                case 14:
                    // ensure user logged out appropriately for not receiving message
                    _a.sent();
                    if (!byTimeout) return [3 /*break*/, 17];
                    return [4 /*yield*/, user1.authenticate(email, password, { expirationInSeconds: byTimeout ? TEST_SESSION_DURATION : undefined })];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, TEST_SESSION_DURATION * 1000 + SESSION_TIMEOUT_DELAY)];
                case 16:
                    _a.sent();
                    return [3 /*break*/, 19];
                case 17: return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
                case 18:
                    _a.sent();
                    _a.label = 19;
                case 19: return [4 /*yield*/, enduserSDK.api.chats.createOne({ roomId: room.id, message: "Hello right back!" })];
                case 20:
                    badChat = _a.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
                case 21:
                    _a.sent();
                    (0, testing_1.assert)(userEvents.find(function (e) { return e.id === badChat.id; }) === undefined, 'user got message after logout', 'user logged out');
                    // must come before cleanup, so cleanup works
                    return [4 /*yield*/, user1.authenticate(email, password)];
                case 22:
                    // must come before cleanup, so cleanup works
                    _a.sent();
                    // cleanup
                    return [4 /*yield*/, Promise.all([
                            user1.api.endusers.deleteOne(enduser.id),
                            user1.api.chat_rooms.deleteOne(room.id), // deletes chats as side effect
                        ])];
                case 23:
                    // must come before cleanup, so cleanup works
                    // cleanup
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
var notification_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var userEvents, notification;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, testing_1.log_header)("Notification Tests");
                userEvents = [];
                user2.handle_events({ 'created-user_notifications': function (rs) { return userEvents.push.apply(userEvents, rs); } });
                return [4 /*yield*/, user1.api.user_notifications.createOne({
                        message: 'test notification',
                        type: 'type',
                        userId: user2.userInfo.id,
                    })];
            case 1:
                notification = _a.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
            case 2:
                _a.sent();
                (0, testing_1.assert)(userEvents.length === 1 && userEvents[0].id === notification.id, 'user did not get notification', 'user got notification');
                // cleanup
                return [4 /*yield*/, user1.api.user_notifications.deleteOne(notification.id)];
            case 3:
                // cleanup
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.notification_tests = notification_tests;
var calendar_events = function () { return __awaiter(void 0, void 0, void 0, function () {
    var enduser, userEvents, enduserEvents, event;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, testing_1.log_header)("Calendar Events Tests");
                return [4 /*yield*/, user1.api.endusers.createOne({ email: "socketenduser@tellescope.com" })];
            case 1:
                enduser = _a.sent();
                return [4 /*yield*/, user1.api.endusers.set_password({ id: enduser.id, password: 'enduserPassword!' })];
            case 2:
                _a.sent();
                return [4 /*yield*/, enduserSDK.authenticate(enduser.email, 'enduserPassword!')];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
            case 4:
                _a.sent();
                userEvents = [];
                enduserEvents = [];
                user1.handle_events({ 'created-calendar_events': function (rs) { return userEvents.push.apply(userEvents, rs); } });
                enduserSDK.handle_events({ 'created-calendar_events': function (rs) { return enduserEvents.push.apply(enduserEvents, rs); } });
                return [4 /*yield*/, user1.api.calendar_events.createOne({
                        durationInMinutes: 30,
                        startTimeInMS: Date.now(),
                        title: 'Test Socket Event',
                        attendees: [{ type: 'enduser', id: enduser.id }],
                    })];
            case 5:
                event = _a.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)];
            case 6:
                _a.sent();
                (0, testing_1.assert)(userEvents.length === 1, 'creator push bad', 'calendar event gone to creator');
                (0, testing_1.assert)(enduserEvents.length === 1 && enduserEvents[0].id === event.id, 'enduser did not get calendar event', 'calendar event on create for attending enduser');
                // cleanup
                return [4 /*yield*/, user1.api.endusers.deleteOne(enduser.id)];
            case 7:
                // cleanup
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var cleanup_cache = function () {
    user1.loadedSocketEvents = {};
    user2.loadedSocketEvents = {};
    sdkSub.loadedSocketEvents = {};
    sdkOtherSub.loadedSocketEvents = {};
    sdkSubSub.loadedSocketEvents = {};
    enduserSDK.loadedSocketEvents = {};
};
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, testing_1.log_header)("Sockets");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 14, , 15]);
                return [4 /*yield*/, user1.authenticate(email, password)];
            case 2:
                _a.sent();
                return [4 /*yield*/, user1.reset_db()];
            case 3:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        user2.authenticate(email2, password2),
                        sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword),
                        sdkSub.authenticate(subUserEmail, password),
                        sdkOtherSub.authenticate(otherSubUserEmail, password),
                        sdkSubSub.authenticate(subSubUserEmail, password),
                    ])];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AWAIT_SOCKET_DURATION)]; // wait for socket connections
            case 5:
                _a.sent(); // wait for socket connections
                cleanup_cache();
                return [4 /*yield*/, basic_tests()];
            case 6:
                _a.sent();
                cleanup_cache();
                return [4 /*yield*/, sub_organization_tests()];
            case 7:
                _a.sent();
                cleanup_cache();
                return [4 /*yield*/, access_tests()];
            case 8:
                _a.sent();
                cleanup_cache();
                return [4 /*yield*/, calendar_events()];
            case 9:
                _a.sent();
                cleanup_cache();
                return [4 /*yield*/, enduser_tests()];
            case 10:
                _a.sent();
                cleanup_cache();
                return [4 /*yield*/, (0, exports.notification_tests)()];
            case 11:
                _a.sent();
                cleanup_cache();
                return [4 /*yield*/, deauthentication_tests()]; // should come last!
            case 12:
                _a.sent(); // should come last!
                cleanup_cache();
                return [4 /*yield*/, deauthentication_tests(true)]; // should come last!
            case 13:
                _a.sent(); // should come last!
                return [3 /*break*/, 15];
            case 14:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 15];
            case 15:
                process.exit();
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=socket_tests.js.map