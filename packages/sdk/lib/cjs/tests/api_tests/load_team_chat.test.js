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
exports.load_team_chat_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
var load_team_chat_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var enduserForCareTeam, enduserNotOnCareTeam, roomWithUserInIds, roomWhereUserIsCreator, roomWithCareTeamAccess, roomNoAccessForNonAdmin, roomNoAccessForAdmin, roomNoCareTeamAccess, closedRoom, externalRoom, roomWithEndusers, firstBatch, lastRoom_1, assignedEnduserAccessRole, noEnduserAccessRole, enduserAccessTestEmail, enduserAccessTestUser, _b, enduserNotAssignedToTestUser, roomWithUnassignedEnduser, sdkAssignedAccess, _c, sdkNoEnduserAccess, _d, accessTagTestTag, accessTagRole, accessTagTestEmail, accessTagTestUser, _e, enduserWithAccessTag, roomWithAccessTagEnduser, sdkAccessTagUser, _f;
        var _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    (0, testing_1.log_header)("Load Team Chat Tests");
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'CareTeam',
                            lname: 'TestPatient',
                            assignedTo: [sdkNonAdmin.userInfo.id], // Non-admin is on care team
                        })];
                case 1:
                    enduserForCareTeam = _k.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'NoCareTeam',
                            lname: 'TestPatient',
                        })
                        // Create various team chat rooms for testing
                        // Room 1: Non-admin is in userIds
                    ];
                case 2:
                    enduserNotOnCareTeam = _k.sent();
                    return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                            type: 'internal',
                            userIds: [sdkNonAdmin.userInfo.id],
                            title: 'Room with user in userIds',
                        })
                        // Room 2: Non-admin is creator
                    ];
                case 3:
                    roomWithUserInIds = _k.sent();
                    return [4 /*yield*/, sdkNonAdmin.api.chat_rooms.createOne({
                            type: 'internal',
                            userIds: [],
                            title: 'Room where user is creator',
                        })
                        // Room 3: aboutEnduserId with care team access
                    ];
                case 4:
                    roomWhereUserIsCreator = _k.sent();
                    return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                            type: 'internal',
                            userIds: [],
                            aboutEnduserId: enduserForCareTeam.id,
                            title: 'Room with care team access',
                        })
                        // Room 4: No access for non-admin (different creator, not in userIds, no care team)
                    ];
                case 5:
                    roomWithCareTeamAccess = _k.sent();
                    return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                            type: 'internal',
                            userIds: [],
                            title: 'Room with no access for non-admin',
                        })
                        // Room 4b: No access for admin (non-admin is creator, admin not in userIds, not on care team)
                    ];
                case 6:
                    roomNoAccessForNonAdmin = _k.sent();
                    return [4 /*yield*/, sdkNonAdmin.api.chat_rooms.createOne({
                            type: 'internal',
                            userIds: [],
                            title: 'Room with no access for admin',
                        })
                        // Room 5: aboutEnduserId but non-admin NOT on care team
                    ];
                case 7:
                    roomNoAccessForAdmin = _k.sent();
                    return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                            type: 'internal',
                            userIds: [],
                            aboutEnduserId: enduserNotOnCareTeam.id,
                            title: 'Room without care team access',
                        })
                        // Room 6: Closed room (has endedAt)
                    ];
                case 8:
                    roomNoCareTeamAccess = _k.sent();
                    return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                            type: 'internal',
                            userIds: [sdkNonAdmin.userInfo.id],
                            title: 'Closed room',
                            endedAt: new Date(),
                        })
                        // Room 7: External type (should be excluded)
                    ];
                case 9:
                    closedRoom = _k.sent();
                    return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                            type: 'external',
                            userIds: [sdkNonAdmin.userInfo.id],
                            title: 'External room',
                        })
                        // Room 8: Room with enduserIds (should be excluded - not a team chat)
                    ];
                case 10:
                    externalRoom = _k.sent();
                    return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                            type: 'internal',
                            userIds: [sdkNonAdmin.userInfo.id],
                            enduserIds: [enduserForCareTeam.id],
                            title: 'Room with endusers',
                        })
                        // Wait for timestamps to settle
                    ];
                case 11:
                    roomWithEndusers = _k.sent();
                    // Wait for timestamps to settle
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)
                        // Test 1: Basic loading - rooms where user is in userIds
                    ];
                case 12:
                    // Wait for timestamps to settle
                    _k.sent();
                    // Test 1: Basic loading - rooms where user is in userIds
                    return [4 /*yield*/, (0, testing_1.async_test)("Loads room where user is in userIds", function () { return sdkNonAdmin.api.chat_rooms.load_team_chat({}); }, {
                            onResult: function (r) { return r.chat_rooms.some(function (room) { return room.id === roomWithUserInIds.id; }); }
                        })
                        // Test 2: Creator access
                    ];
                case 13:
                    // Test 1: Basic loading - rooms where user is in userIds
                    _k.sent();
                    // Test 2: Creator access
                    return [4 /*yield*/, (0, testing_1.async_test)("Loads room where user is creator", function () { return sdkNonAdmin.api.chat_rooms.load_team_chat({}); }, {
                            onResult: function (r) { return r.chat_rooms.some(function (room) { return room.id === roomWhereUserIsCreator.id; }); }
                        })
                        // Test 3: Care team access
                    ];
                case 14:
                    // Test 2: Creator access
                    _k.sent();
                    // Test 3: Care team access
                    return [4 /*yield*/, (0, testing_1.async_test)("Loads room where user is on care team for aboutEnduserId", function () { return sdkNonAdmin.api.chat_rooms.load_team_chat({}); }, {
                            onResult: function (r) { return r.chat_rooms.some(function (room) { return room.id === roomWithCareTeamAccess.id; }); }
                        })
                        // Test 4: Returns endusers for aboutEnduserId
                    ];
                case 15:
                    // Test 3: Care team access
                    _k.sent();
                    // Test 4: Returns endusers for aboutEnduserId
                    return [4 /*yield*/, (0, testing_1.async_test)("Returns endusers for aboutEnduserId display", function () { return sdkNonAdmin.api.chat_rooms.load_team_chat({}); }, {
                            onResult: function (r) { return r.endusers.some(function (e) { return e.id === enduserForCareTeam.id; }); }
                        })
                        // Test 5: Access exclusion - no access room should be excluded for non-admin
                    ];
                case 16:
                    // Test 4: Returns endusers for aboutEnduserId
                    _k.sent();
                    // Test 5: Access exclusion - no access room should be excluded for non-admin
                    return [4 /*yield*/, (0, testing_1.async_test)("Excludes rooms user has no access to", function () { return sdkNonAdmin.api.chat_rooms.load_team_chat({}); }, {
                            onResult: function (r) { return !r.chat_rooms.some(function (room) { return room.id === roomNoAccessForNonAdmin.id; }); }
                        })
                        // Test 6: No care team access exclusion
                    ];
                case 17:
                    // Test 5: Access exclusion - no access room should be excluded for non-admin
                    _k.sent();
                    // Test 6: No care team access exclusion
                    return [4 /*yield*/, (0, testing_1.async_test)("Excludes rooms where user is not on care team for aboutEnduserId", function () { return sdkNonAdmin.api.chat_rooms.load_team_chat({}); }, {
                            onResult: function (r) { return !r.chat_rooms.some(function (room) { return room.id === roomNoCareTeamAccess.id; }); }
                        })
                        // Test 7: Closed rooms excluded by default
                    ];
                case 18:
                    // Test 6: No care team access exclusion
                    _k.sent();
                    // Test 7: Closed rooms excluded by default
                    return [4 /*yield*/, (0, testing_1.async_test)("Excludes closed rooms by default", function () { return sdkNonAdmin.api.chat_rooms.load_team_chat({}); }, {
                            onResult: function (r) { return !r.chat_rooms.some(function (room) { return room.id === closedRoom.id; }); }
                        })
                        // Test 8: Closed rooms included with showClosed=true
                    ];
                case 19:
                    // Test 7: Closed rooms excluded by default
                    _k.sent();
                    // Test 8: Closed rooms included with showClosed=true
                    return [4 /*yield*/, (0, testing_1.async_test)("Includes closed rooms when showClosed=true", function () { return sdkNonAdmin.api.chat_rooms.load_team_chat({ showClosed: true }); }, {
                            onResult: function (r) { return r.chat_rooms.some(function (room) { return room.id === closedRoom.id; }); }
                        })
                        // Test 9: External type excluded
                    ];
                case 20:
                    // Test 8: Closed rooms included with showClosed=true
                    _k.sent();
                    // Test 9: External type excluded
                    return [4 /*yield*/, (0, testing_1.async_test)("Excludes external type rooms", function () { return sdkNonAdmin.api.chat_rooms.load_team_chat({}); }, {
                            onResult: function (r) { return !r.chat_rooms.some(function (room) { return room.id === externalRoom.id; }); }
                        })
                        // Test 10: Rooms with enduserIds excluded
                    ];
                case 21:
                    // Test 9: External type excluded
                    _k.sent();
                    // Test 10: Rooms with enduserIds excluded
                    return [4 /*yield*/, (0, testing_1.async_test)("Excludes rooms with enduserIds (not team chats)", function () { return sdkNonAdmin.api.chat_rooms.load_team_chat({}); }, {
                            onResult: function (r) { return !r.chat_rooms.some(function (room) { return room.id === roomWithEndusers.id; }); }
                        })
                        // Test 11: Admin also filtered to rooms they're involved in
                        // (Admins who need all rooms can use standard GET endpoints)
                    ];
                case 22:
                    // Test 10: Rooms with enduserIds excluded
                    _k.sent();
                    // Test 11: Admin also filtered to rooms they're involved in
                    // (Admins who need all rooms can use standard GET endpoints)
                    return [4 /*yield*/, (0, testing_1.async_test)("Admin does NOT see rooms they're not involved in", function () { return sdk.api.chat_rooms.load_team_chat({}); }, {
                            onResult: function (r) { return !r.chat_rooms.some(function (room) { return room.id === roomNoAccessForAdmin.id; }); }
                        })
                        // Test 12: Pagination with limit
                    ];
                case 23:
                    // Test 11: Admin also filtered to rooms they're involved in
                    // (Admins who need all rooms can use standard GET endpoints)
                    _k.sent();
                    // Test 12: Pagination with limit
                    return [4 /*yield*/, (0, testing_1.async_test)("Respects limit parameter", function () { return sdk.api.chat_rooms.load_team_chat({ limit: 2 }); }, {
                            onResult: function (r) { return r.chat_rooms.length <= 2; }
                        })
                        // Test 13: Pagination with lastUpdatedAt cursor
                    ];
                case 24:
                    // Test 12: Pagination with limit
                    _k.sent();
                    return [4 /*yield*/, sdk.api.chat_rooms.load_team_chat({ limit: 2 })];
                case 25:
                    firstBatch = _k.sent();
                    if (!(firstBatch.chat_rooms.length === 2)) return [3 /*break*/, 27];
                    lastRoom_1 = firstBatch.chat_rooms[firstBatch.chat_rooms.length - 1];
                    return [4 /*yield*/, (0, testing_1.async_test)("Pagination with lastUpdatedAt returns older rooms", function () { return sdk.api.chat_rooms.load_team_chat({ lastUpdatedAt: new Date(lastRoom_1.updatedAt) }); }, {
                            onResult: function (r) {
                                // Should not contain any rooms from first batch
                                var firstBatchIds = firstBatch.chat_rooms.map(function (room) { return room.id; });
                                return !r.chat_rooms.some(function (room) { return firstBatchIds.includes(room.id); });
                            }
                        })];
                case 26:
                    _k.sent();
                    _k.label = 27;
                case 27: 
                // Test 14: Sorted by updatedAt descending
                return [4 /*yield*/, (0, testing_1.async_test)("Results sorted by updatedAt descending", function () { return sdk.api.chat_rooms.load_team_chat({}); }, {
                        onResult: function (r) {
                            for (var i = 1; i < r.chat_rooms.length; i++) {
                                var prev = new Date(r.chat_rooms[i - 1].updatedAt).getTime();
                                var curr = new Date(r.chat_rooms[i].updatedAt).getTime();
                                if (prev < curr)
                                    return false;
                            }
                            return true;
                        }
                    })
                    // ============================================
                    // Enduser Access Control Tests
                    // ============================================
                    // Create a role with "Assigned" enduser access and chat_rooms access
                ];
                case 28:
                    // Test 14: Sorted by updatedAt descending
                    _k.sent();
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.createOne({
                            role: 'Assigned Enduser Access',
                            permissions: {
                                chat_rooms: { read: 'Default', create: 'Default', update: 'Default', delete: 'Default' },
                                endusers: { read: 'Assigned', create: null, update: null, delete: null },
                            },
                        })
                        // Create a role with no enduser access but chat_rooms access
                    ];
                case 29:
                    assignedEnduserAccessRole = _k.sent();
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.createOne({
                            role: 'No Enduser Access',
                            permissions: {
                                chat_rooms: { read: 'Default', create: 'Default', update: 'Default', delete: 'Default' },
                                endusers: { read: null, create: null, update: null, delete: null },
                            },
                        })
                        // Create test user for enduser access tests
                    ];
                case 30:
                    noEnduserAccessRole = _k.sent();
                    enduserAccessTestEmail = 'team.chat.enduser.access.test@tellescope.com';
                    return [4 /*yield*/, sdk.api.users.getOne({ email: enduserAccessTestEmail }).catch(function () { return null; })];
                case 31:
                    _b = (_k.sent());
                    if (_b) return [3 /*break*/, 33];
                    return [4 /*yield*/, sdk.api.users.createOne({ email: enduserAccessTestEmail, notificationEmailsDisabled: true, verifiedEmail: true })];
                case 32:
                    _b = (_k.sent());
                    _k.label = 33;
                case 33:
                    enduserAccessTestUser = _b;
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'NotAssigned',
                            lname: 'ToTestUser',
                        })
                        // Create a room aboutEnduserId pointing to the unassigned enduser, but add test user to userIds
                    ];
                case 34:
                    enduserNotAssignedToTestUser = _k.sent();
                    return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                            type: 'internal',
                            userIds: [enduserAccessTestUser.id],
                            aboutEnduserId: enduserNotAssignedToTestUser.id,
                            title: 'Room with unassigned enduser',
                        })];
                case 35:
                    roomWithUnassignedEnduser = _k.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)
                        // Test 15: User with "Assigned" enduser access - only sees endusers they're assigned to
                    ];
                case 36:
                    _k.sent();
                    // Test 15: User with "Assigned" enduser access - only sees endusers they're assigned to
                    return [4 /*yield*/, sdk.api.users.updateOne(enduserAccessTestUser.id, { roles: [assignedEnduserAccessRole.role] }, { replaceObjectFields: true })];
                case 37:
                    // Test 15: User with "Assigned" enduser access - only sees endusers they're assigned to
                    _k.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 2000)]; // role change triggers logout
                case 38:
                    _k.sent(); // role change triggers logout
                    _c = sdk_1.Session.bind;
                    _g = {
                        host: host
                    };
                    return [4 /*yield*/, sdk.api.users.generate_auth_token({ id: enduserAccessTestUser.id })];
                case 39:
                    sdkAssignedAccess = new (_c.apply(sdk_1.Session, [void 0, (_g.authToken = (_k.sent()).authToken,
                            _g)]))();
                    // User can see the chat room (via userIds) but should NOT see the enduser (not assigned)
                    return [4 /*yield*/, (0, testing_1.async_test)("Assigned enduser access: sees room but not unassigned enduser", function () { return sdkAssignedAccess.api.chat_rooms.load_team_chat({}); }, {
                            onResult: function (r) {
                                var hasRoom = r.chat_rooms.some(function (room) { return room.id === roomWithUnassignedEnduser.id; });
                                var hasUnassignedEnduser = r.endusers.some(function (e) { return e.id === enduserNotAssignedToTestUser.id; });
                                return hasRoom && !hasUnassignedEnduser;
                            }
                        })
                        // Now assign user to an enduser and verify they CAN see that enduser
                    ];
                case 40:
                    // User can see the chat room (via userIds) but should NOT see the enduser (not assigned)
                    _k.sent();
                    // Now assign user to an enduser and verify they CAN see that enduser
                    return [4 /*yield*/, sdk.api.endusers.updateOne(enduserForCareTeam.id, {
                            assignedTo: __spreadArray(__spreadArray([], (enduserForCareTeam.assignedTo || []), true), [enduserAccessTestUser.id], false)
                        })];
                case 41:
                    // Now assign user to an enduser and verify they CAN see that enduser
                    _k.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Assigned enduser access: sees enduser when assigned", function () { return sdkAssignedAccess.api.chat_rooms.load_team_chat({}); }, {
                            onResult: function (r) {
                                // Should see enduserForCareTeam (now assigned) but not enduserNotAssignedToTestUser
                                var hasAssignedEnduser = r.endusers.some(function (e) { return e.id === enduserForCareTeam.id; });
                                var hasUnassignedEnduser = r.endusers.some(function (e) { return e.id === enduserNotAssignedToTestUser.id; });
                                return hasAssignedEnduser && !hasUnassignedEnduser;
                            }
                        })
                        // Test 16: User with no enduser access - sees no endusers
                    ];
                case 42:
                    _k.sent();
                    // Test 16: User with no enduser access - sees no endusers
                    return [4 /*yield*/, sdk.api.users.updateOne(enduserAccessTestUser.id, { roles: [noEnduserAccessRole.role] }, { replaceObjectFields: true })];
                case 43:
                    // Test 16: User with no enduser access - sees no endusers
                    _k.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 2000)]; // role change triggers logout
                case 44:
                    _k.sent(); // role change triggers logout
                    _d = sdk_1.Session.bind;
                    _h = {
                        host: host
                    };
                    return [4 /*yield*/, sdk.api.users.generate_auth_token({ id: enduserAccessTestUser.id })];
                case 45:
                    sdkNoEnduserAccess = new (_d.apply(sdk_1.Session, [void 0, (_h.authToken = (_k.sent()).authToken,
                            _h)]))();
                    return [4 /*yield*/, (0, testing_1.async_test)("No enduser access: sees rooms but no endusers", function () { return sdkNoEnduserAccess.api.chat_rooms.load_team_chat({}); }, {
                            onResult: function (r) {
                                var hasRoom = r.chat_rooms.some(function (room) { return room.id === roomWithUnassignedEnduser.id; });
                                var hasAnyEnduser = r.endusers.length > 0;
                                return hasRoom && !hasAnyEnduser;
                            }
                        })
                        // Test 17: Admin (All access) sees all endusers
                    ];
                case 46:
                    _k.sent();
                    // Test 17: Admin (All access) sees all endusers
                    return [4 /*yield*/, (0, testing_1.async_test)("Admin (All access): sees all endusers", function () { return sdk.api.chat_rooms.load_team_chat({}); }, {
                            onResult: function (r) {
                                // Admin should see both endusers
                                var hasEnduserForCareTeam = r.endusers.some(function (e) { return e.id === enduserForCareTeam.id; });
                                var hasEnduserNotAssigned = r.endusers.some(function (e) { return e.id === enduserNotAssignedToTestUser.id; });
                                return hasEnduserForCareTeam && hasEnduserNotAssigned;
                            }
                        })
                        // Test 18: Access tags grant enduser visibility (not on care team, but matching access tag)
                    ];
                case 47:
                    // Test 17: Admin (All access) sees all endusers
                    _k.sent();
                    accessTagTestTag = 'access-tag-test-team-chat';
                    // Enable access tags at the organization level
                    return [4 /*yield*/, sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
                            settings: { endusers: { enableAccessTags: true } }
                        })
                        // Create a role with Assigned enduser access (which uses access tags)
                    ];
                case 48:
                    // Enable access tags at the organization level
                    _k.sent();
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.createOne({
                            role: 'Access Tag Enduser Access',
                            permissions: {
                                chat_rooms: { read: 'Default', create: 'Default', update: 'Default', delete: 'Default' },
                                endusers: { read: 'Assigned', create: null, update: null, delete: null },
                            },
                        })
                        // Create a user with the access tag
                    ];
                case 49:
                    accessTagRole = _k.sent();
                    accessTagTestEmail = 'team.chat.access.tag.test@tellescope.com';
                    return [4 /*yield*/, sdk.api.users.getOne({ email: accessTagTestEmail }).catch(function () { return null; })];
                case 50:
                    _e = (_k.sent());
                    if (_e) return [3 /*break*/, 52];
                    return [4 /*yield*/, sdk.api.users.createOne({
                            email: accessTagTestEmail,
                            notificationEmailsDisabled: true,
                            verifiedEmail: true,
                            tags: [accessTagTestTag],
                        })];
                case 51:
                    _e = (_k.sent());
                    _k.label = 52;
                case 52:
                    accessTagTestUser = _e;
                    // Ensure user has the tag and role
                    return [4 /*yield*/, sdk.api.users.updateOne(accessTagTestUser.id, {
                            tags: [accessTagTestTag],
                            roles: [accessTagRole.role]
                        }, { replaceObjectFields: true })
                        // Create an enduser with matching access tag (but user is NOT in assignedTo)
                    ];
                case 53:
                    // Ensure user has the tag and role
                    _k.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'AccessTag',
                            lname: 'TestEnduser',
                            accessTags: [accessTagTestTag],
                            // Note: NOT assigning accessTagTestUser to this enduser
                        })
                        // Create a room about the enduser with access tag, add user to userIds
                    ];
                case 54:
                    enduserWithAccessTag = _k.sent();
                    return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                            type: 'internal',
                            userIds: [accessTagTestUser.id],
                            aboutEnduserId: enduserWithAccessTag.id,
                            title: 'Room with access tag enduser',
                        })];
                case 55:
                    roomWithAccessTagEnduser = _k.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 2000)
                        // Re-authenticate to get the updated JWT with eat (enableAccessTags) flag
                    ]; // role change triggers logout
                case 56:
                    _k.sent(); // role change triggers logout
                    _f = sdk_1.Session.bind;
                    _j = {
                        host: host
                    };
                    return [4 /*yield*/, sdk.api.users.generate_auth_token({ id: accessTagTestUser.id })];
                case 57:
                    sdkAccessTagUser = new (_f.apply(sdk_1.Session, [void 0, (_j.authToken = (_k.sent()).authToken,
                            _j)]))();
                    return [4 /*yield*/, (0, testing_1.async_test)("Access tags: user sees enduser via matching access tag (not assigned)", function () { return sdkAccessTagUser.api.chat_rooms.load_team_chat({}); }, {
                            onResult: function (r) {
                                var hasRoom = r.chat_rooms.some(function (room) { return room.id === roomWithAccessTagEnduser.id; });
                                var hasEnduserViaAccessTag = r.endusers.some(function (e) { return e.id === enduserWithAccessTag.id; });
                                // User should NOT see enduserNotAssignedToTestUser (no access tag match, not assigned)
                                var hasUnrelatedEnduser = r.endusers.some(function (e) { return e.id === enduserNotAssignedToTestUser.id; });
                                return hasRoom && hasEnduserViaAccessTag && !hasUnrelatedEnduser;
                            }
                        })
                        // Cleanup - disable access tags before deleting test data
                    ];
                case 58:
                    _k.sent();
                    // Cleanup - disable access tags before deleting test data
                    return [4 /*yield*/, sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
                            settings: { endusers: { enableAccessTags: false } }
                        })];
                case 59:
                    // Cleanup - disable access tags before deleting test data
                    _k.sent();
                    return [4 /*yield*/, Promise.all([
                            sdk.api.chat_rooms.deleteOne(roomWithUserInIds.id),
                            sdk.api.chat_rooms.deleteOne(roomWhereUserIsCreator.id),
                            sdk.api.chat_rooms.deleteOne(roomWithCareTeamAccess.id),
                            sdk.api.chat_rooms.deleteOne(roomNoAccessForNonAdmin.id),
                            sdk.api.chat_rooms.deleteOne(roomNoAccessForAdmin.id),
                            sdk.api.chat_rooms.deleteOne(roomNoCareTeamAccess.id),
                            sdk.api.chat_rooms.deleteOne(closedRoom.id),
                            sdk.api.chat_rooms.deleteOne(externalRoom.id),
                            sdk.api.chat_rooms.deleteOne(roomWithEndusers.id),
                            sdk.api.chat_rooms.deleteOne(roomWithUnassignedEnduser.id),
                            sdk.api.chat_rooms.deleteOne(roomWithAccessTagEnduser.id),
                            sdk.api.endusers.deleteOne(enduserForCareTeam.id),
                            sdk.api.endusers.deleteOne(enduserNotOnCareTeam.id),
                            sdk.api.endusers.deleteOne(enduserNotAssignedToTestUser.id),
                            sdk.api.endusers.deleteOne(enduserWithAccessTag.id),
                            sdk.api.role_based_access_permissions.deleteOne(assignedEnduserAccessRole.id),
                            sdk.api.role_based_access_permissions.deleteOne(noEnduserAccessRole.id),
                            sdk.api.role_based_access_permissions.deleteOne(accessTagRole.id),
                            sdk.api.users.deleteOne(enduserAccessTestUser.id),
                            sdk.api.users.deleteOne(accessTagTestUser.id),
                        ])];
                case 60:
                    _k.sent();
                    return [2 /*return*/];
            }
        });
    });
};
exports.load_team_chat_tests = load_team_chat_tests;
// Allow running this test file independently
if (require.main === module) {
    console.log("\uD83C\uDF10 Using API URL: ".concat(host));
    var sdk_2 = new sdk_1.Session({ host: host });
    var sdkNonAdmin_1 = new sdk_1.Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, setup_1.setup_tests)(sdk_2, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.load_team_chat_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Load team chat test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Load team chat test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=load_team_chat.test.js.map