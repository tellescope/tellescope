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
require('source-map-support').install();
import { Session, EnduserSession } from "../../sdk";
import { log_header, wait, } from "@tellescope/testing";
import { setup_tests } from "../setup";
/**
 * Tests for the "Outbound Chat Sent" automation trigger event.
 *
 * Covered cases (one shared trigger, one shared TAG):
 *  1. Single-enduser room, inbound (enduser session)        → no trigger, no recentOutboundChatAt
 *  2. Single-enduser room, outbound (user session)          → trigger fires, recentOutboundChatAt set + recent
 *  3. Multi-enduser room,  inbound (one enduser's session)  → neither enduser tagged or stamped
 *  4. Multi-enduser room,  outbound (user session)          → BOTH endusers tagged + stamped
 *  5. User session, senderId = enduser.id (backfill case)   → treated as inbound: no trigger, no stamp
 *
 * Chats are NOT explicitly deleted — they cascade-delete from chat_rooms.
 */
var isRecent = function (value, sinceMs) {
    if (!value)
        return false;
    var t = new Date(value).valueOf();
    return t >= sinceMs - 1000 && t <= Date.now() + 1000;
};
export var outbound_chat_sent_trigger_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var host, TAG, endSolo, endA, endB, endBackfill, endAutoreply, trigger, roomSolo, roomGroup, roomBackfill, roomAutoreply, settingsModified, originalOutOfOfficeHours, originalAutoReplyEnabled, tokenSolo, endSoloSDK, tokenA, endASDK, soloAfterInbound, c1_notTagged, c1_noStamp, c2_sendStart, soloAfterOutbound, c2_tagged, c2_stamped, aAfterInbound, bAfterInbound, c3_aNotTagged, c3_bNotTagged, c3_neitherTagged, c3_neitherStamped, c4_sendStart, aAfterOutbound, bAfterOutbound, c4_bothTagged, c4_bothStamped, backfillAfter, c5_notTagged, c5_noStamp, originalOrg, tokenAR, endAutoreplySDK, arAfter, roomChats, sanity_autoreplySent, c6_notTagged, c6_noStamp, allPassed, err_1, cleanups, error_1;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    log_header("Outbound Chat Sent Trigger Tests");
                    host = process.env.API_URL || 'http://localhost:8080';
                    TAG = "outbound-chat-sent-".concat(Date.now());
                    settingsModified = false;
                    originalOutOfOfficeHours = [];
                    originalAutoReplyEnabled = false;
                    _o.label = 1;
                case 1:
                    _o.trys.push([1, , 38, 46]);
                    return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'Solo', lname: 'Patient' })];
                case 2:
                    // ── Endusers ──────────────────────────────────────────────────────
                    endSolo = _o.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'GroupA', lname: 'Patient' })];
                case 3:
                    endA = _o.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'GroupB', lname: 'Patient' })];
                case 4:
                    endB = _o.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'Backfill', lname: 'Patient' })];
                case 5:
                    endBackfill = _o.sent();
                    console.log("Created endusers: solo=".concat(endSolo.id, ", A=").concat(endA.id, ", B=").concat(endB.id, ", backfill=").concat(endBackfill.id));
                    return [4 /*yield*/, sdk.api.endusers.generate_auth_token({ id: endSolo.id })];
                case 6:
                    tokenSolo = (_o.sent()).authToken;
                    endSoloSDK = new EnduserSession({ host: host, authToken: tokenSolo, businessId: sdk.userInfo.businessId });
                    return [4 /*yield*/, sdk.api.endusers.generate_auth_token({ id: endA.id })];
                case 7:
                    tokenA = (_o.sent()).authToken;
                    endASDK = new EnduserSession({ host: host, authToken: tokenA, businessId: sdk.userInfo.businessId });
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            title: "Outbound Chat Sent Test ".concat(Date.now()),
                            status: 'Active',
                            event: { type: 'Outbound Chat Sent', info: {} },
                            action: { type: 'Add Tags', info: { tags: [TAG] } },
                        })];
                case 8:
                    // ── Trigger ───────────────────────────────────────────────────────
                    trigger = _o.sent();
                    console.log("Created trigger: ".concat(trigger.id));
                    return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                            userIds: [sdk.userInfo.id],
                            enduserIds: [endSolo.id],
                        })];
                case 9:
                    // ── Rooms ─────────────────────────────────────────────────────────
                    roomSolo = _o.sent();
                    return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                            userIds: [sdk.userInfo.id],
                            enduserIds: [endA.id, endB.id],
                        })];
                case 10:
                    roomGroup = _o.sent();
                    return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                            userIds: [sdk.userInfo.id],
                            enduserIds: [endBackfill.id],
                        })];
                case 11:
                    roomBackfill = _o.sent();
                    console.log("Created rooms: solo=".concat(roomSolo.id, ", group=").concat(roomGroup.id, ", backfill=").concat(roomBackfill.id));
                    // ═════════════════════════════════════════════════════════════════
                    // Case 1: Single-enduser inbound (enduser session)
                    // ═════════════════════════════════════════════════════════════════
                    return [4 /*yield*/, endSoloSDK.api.chats.createOne({
                            roomId: roomSolo.id,
                            message: 'solo inbound from enduser',
                        })];
                case 12:
                    // ═════════════════════════════════════════════════════════════════
                    // Case 1: Single-enduser inbound (enduser session)
                    // ═════════════════════════════════════════════════════════════════
                    _o.sent();
                    return [4 /*yield*/, wait(undefined, 2000)];
                case 13:
                    _o.sent();
                    return [4 /*yield*/, sdk.api.endusers.getOne(endSolo.id)];
                case 14:
                    soloAfterInbound = _o.sent();
                    c1_notTagged = !((_b = soloAfterInbound.tags) === null || _b === void 0 ? void 0 : _b.includes(TAG));
                    c1_noStamp = !soloAfterInbound.recentOutboundChatAt;
                    console.log(c1_notTagged
                        ? "\u2705 [1] Solo inbound did NOT fire trigger"
                        : "\u274C [1] Solo inbound fired trigger. tags=".concat(JSON.stringify(soloAfterInbound.tags)));
                    console.log(c1_noStamp
                        ? "\u2705 [1] Solo inbound did NOT set recentOutboundChatAt"
                        : "\u274C [1] Solo inbound set recentOutboundChatAt=".concat(soloAfterInbound.recentOutboundChatAt));
                    c2_sendStart = Date.now();
                    return [4 /*yield*/, sdk.api.chats.createOne({
                            roomId: roomSolo.id,
                            message: 'solo outbound from user',
                            senderId: sdk.userInfo.id,
                        })];
                case 15:
                    _o.sent();
                    return [4 /*yield*/, wait(undefined, 2000)];
                case 16:
                    _o.sent();
                    return [4 /*yield*/, sdk.api.endusers.getOne(endSolo.id)];
                case 17:
                    soloAfterOutbound = _o.sent();
                    c2_tagged = !!((_c = soloAfterOutbound.tags) === null || _c === void 0 ? void 0 : _c.includes(TAG));
                    c2_stamped = isRecent(soloAfterOutbound.recentOutboundChatAt, c2_sendStart);
                    console.log(c2_tagged
                        ? "\u2705 [2] Solo outbound fired trigger"
                        : "\u274C [2] Solo outbound did NOT fire trigger. tags=".concat(JSON.stringify(soloAfterOutbound.tags)));
                    console.log(c2_stamped
                        ? "\u2705 [2] Solo outbound set recentOutboundChatAt=".concat(soloAfterOutbound.recentOutboundChatAt)
                        : "\u274C [2] Solo outbound did not set a recent recentOutboundChatAt. got=".concat(soloAfterOutbound.recentOutboundChatAt));
                    // ═════════════════════════════════════════════════════════════════
                    // Case 3: Multi-enduser inbound (endA sends in [A, B] room)
                    // ═════════════════════════════════════════════════════════════════
                    return [4 /*yield*/, endASDK.api.chats.createOne({
                            roomId: roomGroup.id,
                            message: 'group inbound from endA',
                        })];
                case 18:
                    // ═════════════════════════════════════════════════════════════════
                    // Case 3: Multi-enduser inbound (endA sends in [A, B] room)
                    // ═════════════════════════════════════════════════════════════════
                    _o.sent();
                    return [4 /*yield*/, wait(undefined, 2000)];
                case 19:
                    _o.sent();
                    return [4 /*yield*/, sdk.api.endusers.getOne(endA.id)];
                case 20:
                    aAfterInbound = _o.sent();
                    return [4 /*yield*/, sdk.api.endusers.getOne(endB.id)];
                case 21:
                    bAfterInbound = _o.sent();
                    c3_aNotTagged = !((_d = aAfterInbound.tags) === null || _d === void 0 ? void 0 : _d.includes(TAG));
                    c3_bNotTagged = !((_e = bAfterInbound.tags) === null || _e === void 0 ? void 0 : _e.includes(TAG));
                    c3_neitherTagged = c3_aNotTagged && c3_bNotTagged;
                    c3_neitherStamped = !aAfterInbound.recentOutboundChatAt && !bAfterInbound.recentOutboundChatAt;
                    console.log(c3_neitherTagged
                        ? "\u2705 [3] Group inbound did NOT fire trigger on either enduser"
                        : "\u274C [3] Group inbound fired trigger. A tags=".concat(JSON.stringify(aAfterInbound.tags), " B tags=").concat(JSON.stringify(bAfterInbound.tags)));
                    console.log(c3_neitherStamped
                        ? "\u2705 [3] Group inbound did NOT set recentOutboundChatAt on either enduser"
                        : "\u274C [3] Group inbound stamped recentOutboundChatAt. A=".concat(aAfterInbound.recentOutboundChatAt, " B=").concat(bAfterInbound.recentOutboundChatAt));
                    c4_sendStart = Date.now();
                    return [4 /*yield*/, sdk.api.chats.createOne({
                            roomId: roomGroup.id,
                            message: 'group outbound from user',
                            senderId: sdk.userInfo.id,
                        })];
                case 22:
                    _o.sent();
                    return [4 /*yield*/, wait(undefined, 2000)];
                case 23:
                    _o.sent();
                    return [4 /*yield*/, sdk.api.endusers.getOne(endA.id)];
                case 24:
                    aAfterOutbound = _o.sent();
                    return [4 /*yield*/, sdk.api.endusers.getOne(endB.id)];
                case 25:
                    bAfterOutbound = _o.sent();
                    c4_bothTagged = !!((_f = aAfterOutbound.tags) === null || _f === void 0 ? void 0 : _f.includes(TAG)) && !!((_g = bAfterOutbound.tags) === null || _g === void 0 ? void 0 : _g.includes(TAG));
                    c4_bothStamped = isRecent(aAfterOutbound.recentOutboundChatAt, c4_sendStart)
                        && isRecent(bAfterOutbound.recentOutboundChatAt, c4_sendStart);
                    console.log(c4_bothTagged
                        ? "\u2705 [4] Group outbound fired trigger on BOTH endusers"
                        : "\u274C [4] Group outbound did not tag both. A tags=".concat(JSON.stringify(aAfterOutbound.tags), " B tags=").concat(JSON.stringify(bAfterOutbound.tags)));
                    console.log(c4_bothStamped
                        ? "\u2705 [4] Group outbound set recentOutboundChatAt on BOTH endusers"
                        : "\u274C [4] Group outbound did not stamp both. A=".concat(aAfterOutbound.recentOutboundChatAt, " B=").concat(bAfterOutbound.recentOutboundChatAt));
                    // ═════════════════════════════════════════════════════════════════
                    // Case 5: User session, senderId = enduser.id (backfill)
                    // ═════════════════════════════════════════════════════════════════
                    return [4 /*yield*/, sdk.api.chats.createOne({
                            roomId: roomBackfill.id,
                            message: 'backfilled inbound (user session, enduser senderId)',
                            senderId: endBackfill.id,
                        })];
                case 26:
                    // ═════════════════════════════════════════════════════════════════
                    // Case 5: User session, senderId = enduser.id (backfill)
                    // ═════════════════════════════════════════════════════════════════
                    _o.sent();
                    return [4 /*yield*/, wait(undefined, 2000)];
                case 27:
                    _o.sent();
                    return [4 /*yield*/, sdk.api.endusers.getOne(endBackfill.id)];
                case 28:
                    backfillAfter = _o.sent();
                    c5_notTagged = !((_h = backfillAfter.tags) === null || _h === void 0 ? void 0 : _h.includes(TAG));
                    c5_noStamp = !backfillAfter.recentOutboundChatAt;
                    console.log(c5_notTagged
                        ? "\u2705 [5] Backfill (user-session + enduser senderId) did NOT fire trigger"
                        : "\u274C [5] Backfill fired trigger. tags=".concat(JSON.stringify(backfillAfter.tags)));
                    console.log(c5_noStamp
                        ? "\u2705 [5] Backfill did NOT set recentOutboundChatAt"
                        : "\u274C [5] Backfill set recentOutboundChatAt=".concat(backfillAfter.recentOutboundChatAt));
                    return [4 /*yield*/, sdk.api.organizations.getOne(sdk.userInfo.businessId)];
                case 29:
                    originalOrg = _o.sent();
                    originalOutOfOfficeHours = (_j = originalOrg.outOfOfficeHours) !== null && _j !== void 0 ? _j : [];
                    originalAutoReplyEnabled = !!((_l = (_k = originalOrg.settings) === null || _k === void 0 ? void 0 : _k.endusers) === null || _l === void 0 ? void 0 : _l.autoReplyEnabled);
                    settingsModified = true;
                    return [4 /*yield*/, sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
                            outOfOfficeHours: [{
                                    from: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                                    to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                                    autoreplyText: 'OOO autoreply (test)',
                                }],
                            settings: { endusers: { autoReplyEnabled: true } },
                        }, { replaceObjectFields: true })];
                case 30:
                    _o.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'Autoreply', lname: 'Patient' })];
                case 31:
                    endAutoreply = _o.sent();
                    return [4 /*yield*/, sdk.api.endusers.generate_auth_token({ id: endAutoreply.id })];
                case 32:
                    tokenAR = (_o.sent()).authToken;
                    endAutoreplySDK = new EnduserSession({ host: host, authToken: tokenAR, businessId: sdk.userInfo.businessId });
                    return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                            userIds: [sdk.userInfo.id],
                            enduserIds: [endAutoreply.id],
                        })];
                case 33:
                    roomAutoreply = _o.sent();
                    return [4 /*yield*/, endAutoreplySDK.api.chats.createOne({
                            roomId: roomAutoreply.id,
                            message: 'trigger an autoreply',
                        })
                        // Autoreply path involves an extra org/user lookup + insert before
                        // handle_chat_create re-runs against the autoreply chat.
                    ];
                case 34:
                    _o.sent();
                    // Autoreply path involves an extra org/user lookup + insert before
                    // handle_chat_create re-runs against the autoreply chat.
                    return [4 /*yield*/, wait(undefined, 4000)];
                case 35:
                    // Autoreply path involves an extra org/user lookup + insert before
                    // handle_chat_create re-runs against the autoreply chat.
                    _o.sent();
                    return [4 /*yield*/, sdk.api.endusers.getOne(endAutoreply.id)];
                case 36:
                    arAfter = _o.sent();
                    return [4 /*yield*/, sdk.api.chats.getSome({ filter: { roomId: roomAutoreply.id } })];
                case 37:
                    roomChats = _o.sent();
                    sanity_autoreplySent = roomChats.some(function (c) { return c.isAutoreply === true; });
                    c6_notTagged = !((_m = arAfter.tags) === null || _m === void 0 ? void 0 : _m.includes(TAG));
                    c6_noStamp = !arAfter.recentOutboundChatAt;
                    console.log(sanity_autoreplySent
                        ? "\u2705 [6] Autoreply chat was sent (sanity check)"
                        : "\u274C [6] No autoreply chat found in room \u2014 test setup invalid. Cannot validate trigger skip.");
                    console.log(c6_notTagged
                        ? "\u2705 [6] Autoreply did NOT fire trigger"
                        : "\u274C [6] Autoreply fired trigger. tags=".concat(JSON.stringify(arAfter.tags)));
                    console.log(c6_noStamp
                        ? "\u2705 [6] Autoreply did NOT set recentOutboundChatAt"
                        : "\u274C [6] Autoreply set recentOutboundChatAt=".concat(arAfter.recentOutboundChatAt));
                    // ── Summary ───────────────────────────────────────────────────────
                    console.log("\n=== Outbound Chat Sent Trigger Test Results ===");
                    console.log("[1] Solo  inbound  \u2014 no trigger:        ".concat(c1_notTagged ? '✅' : '❌'));
                    console.log("[1] Solo  inbound  \u2014 no stamp:          ".concat(c1_noStamp ? '✅' : '❌'));
                    console.log("[2] Solo  outbound \u2014 trigger:           ".concat(c2_tagged ? '✅' : '❌'));
                    console.log("[2] Solo  outbound \u2014 stamp:             ".concat(c2_stamped ? '✅' : '❌'));
                    console.log("[3] Group inbound  \u2014 no trigger (both): ".concat(c3_neitherTagged ? '✅' : '❌'));
                    console.log("[3] Group inbound  \u2014 no stamp (both):   ".concat(c3_neitherStamped ? '✅' : '❌'));
                    console.log("[4] Group outbound \u2014 trigger (both):    ".concat(c4_bothTagged ? '✅' : '❌'));
                    console.log("[4] Group outbound \u2014 stamp (both):      ".concat(c4_bothStamped ? '✅' : '❌'));
                    console.log("[5] Backfill       \u2014 no trigger:        ".concat(c5_notTagged ? '✅' : '❌'));
                    console.log("[5] Backfill       \u2014 no stamp:          ".concat(c5_noStamp ? '✅' : '❌'));
                    console.log("[6] Autoreply      \u2014 sanity sent:       ".concat(sanity_autoreplySent ? '✅' : '❌'));
                    console.log("[6] Autoreply      \u2014 no trigger:        ".concat(c6_notTagged ? '✅' : '❌'));
                    console.log("[6] Autoreply      \u2014 no stamp:          ".concat(c6_noStamp ? '✅' : '❌'));
                    allPassed = c1_notTagged && c1_noStamp
                        && c2_tagged && c2_stamped
                        && c3_neitherTagged && c3_neitherStamped
                        && c4_bothTagged && c4_bothStamped
                        && c5_notTagged && c5_noStamp
                        && sanity_autoreplySent && c6_notTagged && c6_noStamp;
                    if (!allPassed) {
                        throw new Error('Outbound Chat Sent trigger tests failed');
                    }
                    return [2 /*return*/, { success: true }];
                case 38:
                    _o.trys.push([38, 44, , 45]);
                    if (!settingsModified) return [3 /*break*/, 42];
                    _o.label = 39;
                case 39:
                    _o.trys.push([39, 41, , 42]);
                    return [4 /*yield*/, sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
                            outOfOfficeHours: originalOutOfOfficeHours,
                            settings: { endusers: { autoReplyEnabled: originalAutoReplyEnabled } },
                        }, { replaceObjectFields: true })];
                case 40:
                    _o.sent();
                    console.log("Restored org settings (autoReplyEnabled=".concat(originalAutoReplyEnabled, ", outOfOfficeHours.length=").concat(originalOutOfOfficeHours.length, ")"));
                    return [3 /*break*/, 42];
                case 41:
                    err_1 = _o.sent();
                    console.error("\u274C Failed to restore org settings \u2014 manual cleanup may be required: ".concat(err_1));
                    return [3 /*break*/, 42];
                case 42:
                    cleanups = [];
                    if (trigger === null || trigger === void 0 ? void 0 : trigger.id)
                        cleanups.push(sdk.api.automation_triggers.deleteOne(trigger.id).catch(function () { }));
                    if (roomSolo === null || roomSolo === void 0 ? void 0 : roomSolo.id)
                        cleanups.push(sdk.api.chat_rooms.deleteOne(roomSolo.id).catch(function () { }));
                    if (roomGroup === null || roomGroup === void 0 ? void 0 : roomGroup.id)
                        cleanups.push(sdk.api.chat_rooms.deleteOne(roomGroup.id).catch(function () { }));
                    if (roomBackfill === null || roomBackfill === void 0 ? void 0 : roomBackfill.id)
                        cleanups.push(sdk.api.chat_rooms.deleteOne(roomBackfill.id).catch(function () { }));
                    if (roomAutoreply === null || roomAutoreply === void 0 ? void 0 : roomAutoreply.id)
                        cleanups.push(sdk.api.chat_rooms.deleteOne(roomAutoreply.id).catch(function () { }));
                    if (endSolo === null || endSolo === void 0 ? void 0 : endSolo.id)
                        cleanups.push(sdk.api.endusers.deleteOne(endSolo.id).catch(function () { }));
                    if (endA === null || endA === void 0 ? void 0 : endA.id)
                        cleanups.push(sdk.api.endusers.deleteOne(endA.id).catch(function () { }));
                    if (endB === null || endB === void 0 ? void 0 : endB.id)
                        cleanups.push(sdk.api.endusers.deleteOne(endB.id).catch(function () { }));
                    if (endBackfill === null || endBackfill === void 0 ? void 0 : endBackfill.id)
                        cleanups.push(sdk.api.endusers.deleteOne(endBackfill.id).catch(function () { }));
                    if (endAutoreply === null || endAutoreply === void 0 ? void 0 : endAutoreply.id)
                        cleanups.push(sdk.api.endusers.deleteOne(endAutoreply.id).catch(function () { }));
                    return [4 /*yield*/, Promise.all(cleanups)];
                case 43:
                    _o.sent();
                    console.log("Outbound Chat Sent trigger test cleanup completed");
                    return [3 /*break*/, 45];
                case 44:
                    error_1 = _o.sent();
                    console.error("Cleanup error: ".concat(error_1));
                    return [3 /*break*/, 45];
                case 45: return [7 /*endfinally*/];
                case 46: return [2 /*return*/];
            }
        });
    });
};
// Allow running this test file independently
if (require.main === module) {
    var host = process.env.API_URL || 'http://localhost:8080';
    console.log("\uD83C\uDF10 Using API URL: ".concat(host));
    var sdk_1 = new Session({ host: host });
    var sdkNonAdmin_1 = new Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setup_tests(sdk_1, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, outbound_chat_sent_trigger_tests({ sdk: sdk_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Outbound Chat Sent trigger tests completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Outbound Chat Sent trigger tests failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=outbound_chat_sent_trigger.test.js.map