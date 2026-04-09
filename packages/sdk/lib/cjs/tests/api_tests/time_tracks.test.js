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
exports.time_tracks_edge_case_tests = exports.time_tracks_lock_tests = exports.time_tracks_review_tests = exports.time_tracks_correction_tests = exports.time_tracks_historical_tests = exports.time_tracks_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var log = console.log;
var host = process.env.REACT_APP_TELLESCOPE_API_URL || 'http://localhost:8080';
// Helper to assert that an async function throws an error
var assert_throws = function (fn, description) { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fn()];
            case 1:
                _a.sent();
                (0, testing_1.assert)(false, "".concat(description, " - expected error but succeeded"));
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                // SDK parseError returns the response body { message, info } for 4xx errors
                (0, testing_1.assert)((e_1 === null || e_1 === void 0 ? void 0 : e_1.code) === 400 || (e_1 === null || e_1 === void 0 ? void 0 : e_1.statusCode) === 400 || typeof (e_1 === null || e_1 === void 0 ? void 0 : e_1.message) === 'string', "".concat(description, " - expected error, got: ").concat(JSON.stringify(e_1)));
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// Unit tests for calculateTimeTrackDuration
var test_calculateTimeTrackDuration = function () {
    (0, testing_1.log_header)("calculateTimeTrackDuration Unit Tests");
    var calculateTimeTrackDuration = require('@tellescope/utilities').calculateTimeTrackDuration;
    // Test 1: Single start-pause interval
    var test1 = calculateTimeTrackDuration([
        { type: 'start', timestamp: new Date('2024-01-01T10:00:00Z') },
        { type: 'pause', timestamp: new Date('2024-01-01T10:05:00Z') },
    ]);
    (0, testing_1.assert)(test1 === 300000, "Single 5-minute interval should be 300000 ms, got ".concat(test1));
    // Test 2: Start-pause-resume-pause
    var test2 = calculateTimeTrackDuration([
        { type: 'start', timestamp: new Date('2024-01-01T10:00:00Z') },
        { type: 'pause', timestamp: new Date('2024-01-01T10:05:00Z') },
        { type: 'resume', timestamp: new Date('2024-01-01T10:10:00Z') },
        { type: 'pause', timestamp: new Date('2024-01-01T10:20:00Z') },
    ]);
    (0, testing_1.assert)(test2 === 900000, "Two intervals (5min + 10min) should be 900000 ms, got ".concat(test2));
    // Test 3: Start with closedAt (not paused before close)
    var test3 = calculateTimeTrackDuration([
        { type: 'start', timestamp: new Date('2024-01-01T10:00:00Z') },
    ], new Date('2024-01-01T10:15:00Z'));
    (0, testing_1.assert)(test3 === 900000, "Running for 15 minutes should be 900000 ms, got ".concat(test3));
    // Test 4: Start-pause with closedAt (paused, should not add time after pause)
    var test4 = calculateTimeTrackDuration([
        { type: 'start', timestamp: new Date('2024-01-01T10:00:00Z') },
        { type: 'pause', timestamp: new Date('2024-01-01T10:05:00Z') },
    ], new Date('2024-01-01T10:30:00Z'));
    (0, testing_1.assert)(test4 === 300000, "Paused at 5 minutes should still be 300000 ms even with later closedAt, got ".concat(test4));
    // Test 5: Start-resume without initial pause (resume should act as continuation)
    var test5 = calculateTimeTrackDuration([
        { type: 'start', timestamp: new Date('2024-01-01T10:00:00Z') },
        { type: 'pause', timestamp: new Date('2024-01-01T10:05:00Z') },
        { type: 'resume', timestamp: new Date('2024-01-01T10:05:00Z') },
    ], new Date('2024-01-01T10:10:00Z'));
    (0, testing_1.assert)(test5 === 600000, "5min paused + 5min resumed should be 600000 ms, got ".concat(test5));
    // Test 6: Empty timestamps
    var test6 = calculateTimeTrackDuration([]);
    (0, testing_1.assert)(test6 === 0, "Empty timestamps should be 0 ms, got ".concat(test6));
    // Test 7: Multiple pause/resume cycles
    var test7 = calculateTimeTrackDuration([
        { type: 'start', timestamp: new Date('2024-01-01T10:00:00Z') },
        { type: 'pause', timestamp: new Date('2024-01-01T10:10:00Z') },
        { type: 'resume', timestamp: new Date('2024-01-01T11:00:00Z') },
        { type: 'pause', timestamp: new Date('2024-01-01T11:30:00Z') },
        { type: 'resume', timestamp: new Date('2024-01-01T12:00:00Z') },
        { type: 'pause', timestamp: new Date('2024-01-01T12:05:00Z') }, // 5 min
    ]);
    (0, testing_1.assert)(test7 === 2700000, "Three intervals (10+30+5 min) should be 2700000 ms, got ".concat(test7));
    log("All calculateTimeTrackDuration unit tests passed");
};
// API tests for time_tracks CRUD operations
var time_tracks_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var userId, createdTimeTrackId, enduserId, timeTrack_1, fetchedTimeTrack, allTimeTracks, enduser, linkedTimeTrack_1, pauseTime, pausedTimeTrack, resumeTime, resumedTimeTrack, closedAt, closedTimeTrack, finalTimeTrack, updatedTimeTrack, allUserTimeTracks, activeTimeTracks, nonAdminTimeTracks, hasOtherUserTimeTrack, deletedCheck, stillExists, e_2, e_3;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    (0, testing_1.log_header)("Time Tracks API Tests");
                    userId = sdk.userInfo.id;
                    _p.label = 1;
                case 1:
                    _p.trys.push([1, , 18, 27]);
                    // Test 1: Create a time track
                    log("Creating time track...");
                    return [4 /*yield*/, sdk.api.time_tracks.createOne({
                            title: "Test Time Track",
                        })];
                case 2:
                    timeTrack_1 = _p.sent();
                    createdTimeTrackId = timeTrack_1.id;
                    (0, testing_1.assert)(timeTrack_1.title === "Test Time Track", "Title should match");
                    (0, testing_1.assert)(timeTrack_1.userId === userId, "userId should be auto-set to current user ".concat(userId, ", got ").concat(timeTrack_1.userId));
                    (0, testing_1.assert)(Array.isArray(timeTrack_1.timestamps), "timestamps should be an array");
                    (0, testing_1.assert)(((_b = timeTrack_1.timestamps) === null || _b === void 0 ? void 0 : _b.length) === 1, "timestamps should have 1 initial start event, got ".concat((_c = timeTrack_1.timestamps) === null || _c === void 0 ? void 0 : _c.length));
                    (0, testing_1.assert)(((_d = timeTrack_1.timestamps) === null || _d === void 0 ? void 0 : _d[0].type) === 'start', "First timestamp should be 'start', got ".concat((_e = timeTrack_1.timestamps) === null || _e === void 0 ? void 0 : _e[0].type));
                    (0, testing_1.assert)(!timeTrack_1.closedAt, "closedAt should not be set initially");
                    (0, testing_1.assert)(!timeTrack_1.totalDurationInMS, "totalDurationInMS should not be set initially");
                    log("Time track created with auto-set userId and initial timestamp");
                    // Test 2: Read the time track
                    log("Reading time track...");
                    return [4 /*yield*/, sdk.api.time_tracks.getOne(timeTrack_1.id)];
                case 3:
                    fetchedTimeTrack = _p.sent();
                    (0, testing_1.assert)(fetchedTimeTrack.id === timeTrack_1.id, "Fetched time track should have same id");
                    (0, testing_1.assert)(fetchedTimeTrack.title === "Test Time Track", "Fetched title should match");
                    log("Time track retrieved successfully");
                    // Test 3: Get all time tracks for current user
                    log("Getting all time tracks for current user...");
                    return [4 /*yield*/, sdk.api.time_tracks.getSome({ filter: { userId: userId } })];
                case 4:
                    allTimeTracks = _p.sent();
                    (0, testing_1.assert)(allTimeTracks.length >= 1, "Should have at least 1 time track, got ".concat(allTimeTracks.length));
                    (0, testing_1.assert)(!!allTimeTracks.find(function (t) { return t.id === timeTrack_1.id; }), "Should find our created time track");
                    log("Retrieved all time tracks for user");
                    // Test 4: Create enduser and link time track
                    log("Creating enduser for time track linkage...");
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            email: "timetrack-test-".concat(Date.now(), "@test.com"),
                            fname: "Time",
                            lname: "Track",
                        })];
                case 5:
                    enduser = _p.sent();
                    enduserId = enduser.id;
                    log("Enduser created");
                    // Test 5: Create time track with enduserId
                    log("Creating time track linked to enduser...");
                    return [4 /*yield*/, sdk.api.time_tracks.createOne({
                            title: "Client Meeting",
                            enduserId: enduser.id,
                        })];
                case 6:
                    linkedTimeTrack_1 = _p.sent();
                    (0, testing_1.assert)(linkedTimeTrack_1.enduserId === enduser.id, "enduserId should be set to ".concat(enduser.id, ", got ").concat(linkedTimeTrack_1.enduserId));
                    log("Time track linked to enduser");
                    // Test 6: Update time track - add pause timestamp
                    log("Adding pause timestamp...");
                    pauseTime = new Date();
                    return [4 /*yield*/, sdk.api.time_tracks.updateOne(timeTrack_1.id, {
                            timestamps: __spreadArray(__spreadArray([], (timeTrack_1.timestamps || []), true), [
                                { type: 'pause', timestamp: pauseTime },
                            ], false)
                        }, { replaceObjectFields: true })];
                case 7:
                    pausedTimeTrack = _p.sent();
                    (0, testing_1.assert)(((_f = pausedTimeTrack.timestamps) === null || _f === void 0 ? void 0 : _f.length) === 2, "Should have 2 timestamps after pause, got ".concat((_g = pausedTimeTrack.timestamps) === null || _g === void 0 ? void 0 : _g.length));
                    (0, testing_1.assert)(((_h = pausedTimeTrack.timestamps) === null || _h === void 0 ? void 0 : _h[1].type) === 'pause', "Second timestamp should be 'pause', got ".concat((_j = pausedTimeTrack.timestamps) === null || _j === void 0 ? void 0 : _j[1].type));
                    log("Pause timestamp added");
                    // Test 7: Update time track - add resume timestamp
                    log("Adding resume timestamp...");
                    resumeTime = new Date();
                    return [4 /*yield*/, sdk.api.time_tracks.updateOne(timeTrack_1.id, {
                            timestamps: __spreadArray(__spreadArray([], (pausedTimeTrack.timestamps || []), true), [
                                { type: 'resume', timestamp: resumeTime },
                            ], false)
                        }, { replaceObjectFields: true })];
                case 8:
                    resumedTimeTrack = _p.sent();
                    (0, testing_1.assert)(((_k = resumedTimeTrack.timestamps) === null || _k === void 0 ? void 0 : _k.length) === 3, "Should have 3 timestamps after resume, got ".concat((_l = resumedTimeTrack.timestamps) === null || _l === void 0 ? void 0 : _l.length));
                    (0, testing_1.assert)(((_m = resumedTimeTrack.timestamps) === null || _m === void 0 ? void 0 : _m[2].type) === 'resume', "Third timestamp should be 'resume', got ".concat((_o = resumedTimeTrack.timestamps) === null || _o === void 0 ? void 0 : _o[2].type));
                    log("Resume timestamp added");
                    // Test 8: Close time track and verify auto-calculation
                    log("Closing time track with closedAt...");
                    closedAt = new Date();
                    return [4 /*yield*/, sdk.api.time_tracks.updateOne(timeTrack_1.id, {
                            closedAt: closedAt,
                        })
                        // Wait a moment for the event handler to process
                    ];
                case 9:
                    closedTimeTrack = _p.sent();
                    // Wait a moment for the event handler to process
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })
                        // Fetch again to see if totalDurationInMS was calculated
                    ];
                case 10:
                    // Wait a moment for the event handler to process
                    _p.sent();
                    return [4 /*yield*/, sdk.api.time_tracks.getOne(timeTrack_1.id)];
                case 11:
                    finalTimeTrack = _p.sent();
                    (0, testing_1.assert)(!!finalTimeTrack.closedAt, "closedAt should be set");
                    (0, testing_1.assert)(typeof finalTimeTrack.totalDurationInMS === 'number', "totalDurationInMS should be a number, got ".concat(typeof finalTimeTrack.totalDurationInMS));
                    (0, testing_1.assert)(finalTimeTrack.totalDurationInMS > 0, "totalDurationInMS should be > 0, got ".concat(finalTimeTrack.totalDurationInMS));
                    log("Time track closed with auto-calculated duration: ".concat(finalTimeTrack.totalDurationInMS, " ms"));
                    // Test 9: Update title
                    log("Updating time track title...");
                    return [4 /*yield*/, sdk.api.time_tracks.updateOne(timeTrack_1.id, {
                            title: "Updated Time Track Title",
                        })];
                case 12:
                    updatedTimeTrack = _p.sent();
                    (0, testing_1.assert)(updatedTimeTrack.title === "Updated Time Track Title", "Title should be updated");
                    log("Time track title updated");
                    // Test 10: Filter by closedAt (get active time tracks)
                    log("Filtering for active time tracks (no closedAt)...");
                    return [4 /*yield*/, sdk.api.time_tracks.getSome({
                            filter: { userId: userId }
                        })];
                case 13:
                    allUserTimeTracks = _p.sent();
                    activeTimeTracks = allUserTimeTracks.filter(function (t) { return !t.closedAt; });
                    (0, testing_1.assert)(!activeTimeTracks.find(function (t) { return t.id === timeTrack_1.id; }), "Closed time track should not appear in active filter");
                    (0, testing_1.assert)(!!activeTimeTracks.find(function (t) { return t.id === linkedTimeTrack_1.id; }), "Unclosed time track should appear in active filter");
                    log("Active time tracks filtered correctly");
                    // Test 11: Access control - non-admin user should only see their own time tracks
                    log("Testing access control with non-admin user...");
                    return [4 /*yield*/, sdkNonAdmin.api.time_tracks.getSome({})];
                case 14:
                    nonAdminTimeTracks = _p.sent();
                    hasOtherUserTimeTrack = nonAdminTimeTracks.find(function (t) { return t.userId !== sdkNonAdmin.userInfo.id; });
                    (0, testing_1.assert)(!hasOtherUserTimeTrack, "Non-admin user should not see other users' time tracks");
                    log("Access control working correctly");
                    // Test 12: Delete time tracks
                    log("Deleting time tracks...");
                    return [4 /*yield*/, sdk.api.time_tracks.deleteOne(timeTrack_1.id)];
                case 15:
                    _p.sent();
                    return [4 /*yield*/, sdk.api.time_tracks.deleteOne(linkedTimeTrack_1.id)];
                case 16:
                    _p.sent();
                    return [4 /*yield*/, sdk.api.time_tracks.getSome({})];
                case 17:
                    deletedCheck = _p.sent();
                    stillExists = deletedCheck.filter(function (t) { return t.id === timeTrack_1.id || t.id === linkedTimeTrack_1.id; });
                    (0, testing_1.assert)(stillExists.length === 0, "Time tracks should be deleted");
                    log("Time tracks deleted successfully");
                    log("All time tracks API tests passed!");
                    return [3 /*break*/, 27];
                case 18:
                    if (!createdTimeTrackId) return [3 /*break*/, 22];
                    _p.label = 19;
                case 19:
                    _p.trys.push([19, 21, , 22]);
                    return [4 /*yield*/, sdk.api.time_tracks.deleteOne(createdTimeTrackId)];
                case 20:
                    _p.sent();
                    return [3 /*break*/, 22];
                case 21:
                    e_2 = _p.sent();
                    return [3 /*break*/, 22];
                case 22:
                    if (!enduserId) return [3 /*break*/, 26];
                    _p.label = 23;
                case 23:
                    _p.trys.push([23, 25, , 26]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduserId)];
                case 24:
                    _p.sent();
                    return [3 /*break*/, 26];
                case 25:
                    e_3 = _p.sent();
                    return [3 /*break*/, 26];
                case 26: return [7 /*endfinally*/];
                case 27: return [2 /*return*/];
            }
        });
    });
};
exports.time_tracks_tests = time_tracks_tests;
// ============================================================
// Group A: Historical Time Track Creation
// ============================================================
var time_tracks_historical_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var trackIds, now_1, oneHourAgo, twoHoursAgo_1, historical_1, fetched, _i, trackIds_1, id, e_4;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    (0, testing_1.log_header)("Time Tracks - Historical Creation Tests");
                    trackIds = [];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, , 7, 14]);
                    now_1 = new Date();
                    oneHourAgo = new Date(now_1.getTime() - 3600000);
                    twoHoursAgo_1 = new Date(now_1.getTime() - 7200000);
                    // Test A1: Create historical time track with all required fields
                    log("A1: Creating historical time track with all required fields...");
                    return [4 /*yield*/, sdk.api.time_tracks.createOne({
                            title: "Historical Entry",
                            isHistorical: true,
                            closedAt: now_1,
                            lockedAt: now_1,
                            lockedByUserId: sdk.userInfo.id,
                            totalDurationInMS: 3600000,
                            timestamps: [
                                { type: 'start', timestamp: twoHoursAgo_1 },
                                { type: 'pause', timestamp: oneHourAgo },
                            ],
                        })];
                case 2:
                    historical_1 = _c.sent();
                    trackIds.push(historical_1.id);
                    (0, testing_1.assert)(historical_1.isHistorical === true, "isHistorical should be true");
                    (0, testing_1.assert)(!!historical_1.closedAt, "closedAt should be set");
                    (0, testing_1.assert)(!!historical_1.lockedAt, "lockedAt should be set");
                    (0, testing_1.assert)(historical_1.lockedByUserId === sdk.userInfo.id, "lockedByUserId should match");
                    (0, testing_1.assert)(historical_1.totalDurationInMS === 3600000, "totalDurationInMS should be 3600000, got ".concat(historical_1.totalDurationInMS));
                    (0, testing_1.assert)(((_b = historical_1.timestamps) === null || _b === void 0 ? void 0 : _b.length) === 2, "timestamps should have 2 entries");
                    log("A1: Historical time track created with all fields persisted");
                    // Test A2: Create historical without closedAt - expect 400
                    log("A2: Creating historical without closedAt (should fail)...");
                    return [4 /*yield*/, assert_throws(function () { return sdk.api.time_tracks.createOne({
                            title: "Missing ClosedAt",
                            isHistorical: true,
                            lockedAt: now_1,
                            lockedByUserId: sdk.userInfo.id,
                            totalDurationInMS: 3600000,
                            timestamps: [{ type: 'start', timestamp: twoHoursAgo_1 }],
                        }); }, "A2: Historical without closedAt")];
                case 3:
                    _c.sent();
                    log("A2: Correctly rejected historical without closedAt");
                    // Test A3: Create historical without lockedAt - expect 400
                    log("A3: Creating historical without lockedAt (should fail)...");
                    return [4 /*yield*/, assert_throws(function () { return sdk.api.time_tracks.createOne({
                            title: "Missing LockedAt",
                            isHistorical: true,
                            closedAt: now_1,
                            lockedByUserId: sdk.userInfo.id,
                            totalDurationInMS: 3600000,
                            timestamps: [{ type: 'start', timestamp: twoHoursAgo_1 }],
                        }); }, "A3: Historical without lockedAt")];
                case 4:
                    _c.sent();
                    log("A3: Correctly rejected historical without lockedAt");
                    // Test A4: Verify isHistorical cannot be updated (updatesDisabled)
                    log("A4: Attempting to update isHistorical (should be rejected)...");
                    return [4 /*yield*/, assert_throws(function () { return sdk.api.time_tracks.updateOne(historical_1.id, {
                            isHistorical: false,
                        }); }, "A4: isHistorical update should be rejected")
                        // Confirm it's still true
                    ];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, sdk.api.time_tracks.getOne(historical_1.id)];
                case 6:
                    fetched = _c.sent();
                    (0, testing_1.assert)(fetched.isHistorical === true, "isHistorical should remain true after rejected update");
                    log("A4: isHistorical correctly rejected on update");
                    log("All historical creation tests passed!");
                    return [3 /*break*/, 14];
                case 7:
                    _i = 0, trackIds_1 = trackIds;
                    _c.label = 8;
                case 8:
                    if (!(_i < trackIds_1.length)) return [3 /*break*/, 13];
                    id = trackIds_1[_i];
                    _c.label = 9;
                case 9:
                    _c.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, sdk.api.time_tracks.deleteOne(id)];
                case 10:
                    _c.sent();
                    return [3 /*break*/, 12];
                case 11:
                    e_4 = _c.sent();
                    return [3 /*break*/, 12];
                case 12:
                    _i++;
                    return [3 /*break*/, 8];
                case 13: return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    });
};
exports.time_tracks_historical_tests = time_tracks_historical_tests;
// ============================================================
// Group B: Correction Flow
// ============================================================
var time_tracks_correction_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var trackIds, now, track_1, closedAt, closed_1, originalDuration, correctionTime, correctedTrack_1, track2_1, closed2_1, _i, trackIds_2, id, e_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("Time Tracks - Correction Flow Tests");
                    trackIds = [];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 16, 23]);
                    now = new Date();
                    // Create a real-time track and close it
                    log("B0: Creating and closing real-time track...");
                    return [4 /*yield*/, sdk.api.time_tracks.createOne({
                            title: "Track for Correction",
                        })];
                case 2:
                    track_1 = _b.sent();
                    trackIds.push(track_1.id);
                    // Add pause
                    return [4 /*yield*/, sdk.api.time_tracks.updateOne(track_1.id, {
                            timestamps: __spreadArray(__spreadArray([], (track_1.timestamps || []), true), [
                                { type: 'pause', timestamp: new Date() },
                            ], false)
                        }, { replaceObjectFields: true })
                        // Close it
                    ];
                case 3:
                    // Add pause
                    _b.sent();
                    closedAt = new Date();
                    return [4 /*yield*/, sdk.api.time_tracks.updateOne(track_1.id, { closedAt: closedAt })
                        // Wait for auto-calculated duration
                    ];
                case 4:
                    _b.sent();
                    // Wait for auto-calculated duration
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1500)];
                case 5:
                    // Wait for auto-calculated duration
                    _b.sent();
                    return [4 /*yield*/, sdk.api.time_tracks.getOne(track_1.id)];
                case 6:
                    closed_1 = _b.sent();
                    (0, testing_1.assert)(!!closed_1.closedAt, "Track should be closed");
                    (0, testing_1.assert)(typeof closed_1.totalDurationInMS === 'number', "Should have auto-calculated totalDurationInMS");
                    originalDuration = closed_1.totalDurationInMS;
                    log("B0: Track closed with auto-calculated duration: ".concat(originalDuration, " ms"));
                    // Test B1: Apply correction with all required fields
                    log("B1: Applying correction with all required fields...");
                    correctionTime = new Date();
                    return [4 /*yield*/, sdk.api.time_tracks.updateOne(track_1.id, {
                            correctedAt: correctionTime,
                            correctedByUserId: sdk.userInfo.id,
                            correctionNote: "Forgot to pause during lunch",
                            originalTotalDurationInMS: originalDuration,
                            totalDurationInMS: originalDuration - 1800000,
                            lockedAt: correctionTime,
                            lockedByUserId: sdk.userInfo.id,
                        })];
                case 7:
                    correctedTrack_1 = _b.sent();
                    (0, testing_1.assert)(!!correctedTrack_1.correctedAt, "correctedAt should be set");
                    (0, testing_1.assert)(correctedTrack_1.correctedByUserId === sdk.userInfo.id, "correctedByUserId should match");
                    (0, testing_1.assert)(correctedTrack_1.correctionNote === "Forgot to pause during lunch", "correctionNote should match");
                    (0, testing_1.assert)(correctedTrack_1.originalTotalDurationInMS === originalDuration, "originalTotalDurationInMS should preserve old value");
                    (0, testing_1.assert)(correctedTrack_1.totalDurationInMS === originalDuration - 1800000, "totalDurationInMS should be corrected value");
                    (0, testing_1.assert)(!!correctedTrack_1.lockedAt, "lockedAt should be set");
                    log("B1: Correction applied successfully with all fields persisted");
                    // Test B2: Correction without originalTotalDurationInMS - expect 400
                    log("B2: Correction without originalTotalDurationInMS (should fail)...");
                    return [4 /*yield*/, sdk.api.time_tracks.createOne({ title: "Track for B2" })];
                case 8:
                    track2_1 = _b.sent();
                    trackIds.push(track2_1.id);
                    return [4 /*yield*/, sdk.api.time_tracks.updateOne(track2_1.id, { closedAt: new Date() })];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1000)];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.time_tracks.getOne(track2_1.id)];
                case 11:
                    closed2_1 = _b.sent();
                    return [4 /*yield*/, assert_throws(function () { return sdk.api.time_tracks.updateOne(track2_1.id, {
                            correctedAt: new Date(),
                            totalDurationInMS: 1000,
                            lockedAt: new Date(),
                            lockedByUserId: sdk.userInfo.id,
                        }); }, "B2: Correction without originalTotalDurationInMS")];
                case 12:
                    _b.sent();
                    log("B2: Correctly rejected correction without originalTotalDurationInMS");
                    // Test B3: Correction without lockedAt - expect 400
                    log("B3: Correction without lockedAt (should fail)...");
                    return [4 /*yield*/, assert_throws(function () { return sdk.api.time_tracks.updateOne(track2_1.id, {
                            correctedAt: new Date(),
                            originalTotalDurationInMS: closed2_1.totalDurationInMS || 0,
                            totalDurationInMS: 1000,
                            lockedByUserId: sdk.userInfo.id,
                        }); }, "B3: Correction without lockedAt")];
                case 13:
                    _b.sent();
                    log("B3: Correctly rejected correction without lockedAt");
                    // Test B4: After lock, attempt to update title - expect 400
                    log("B4: Updating title on locked track (should fail)...");
                    return [4 /*yield*/, assert_throws(function () { return sdk.api.time_tracks.updateOne(track_1.id, {
                            title: "Should Not Work",
                        }); }, "B4: Title update on locked track")];
                case 14:
                    _b.sent();
                    log("B4: Correctly rejected title update on locked track");
                    // Test B5: After lock, attempt second correction - expect 400
                    log("B5: Second correction on locked track (should fail)...");
                    return [4 /*yield*/, assert_throws(function () { return sdk.api.time_tracks.updateOne(track_1.id, {
                            correctedAt: new Date(),
                            originalTotalDurationInMS: correctedTrack_1.totalDurationInMS,
                            totalDurationInMS: 500,
                            lockedAt: new Date(),
                            lockedByUserId: sdk.userInfo.id,
                        }); }, "B5: Second correction on locked track")];
                case 15:
                    _b.sent();
                    log("B5: Correctly rejected second correction on locked track");
                    log("All correction flow tests passed!");
                    return [3 /*break*/, 23];
                case 16:
                    _i = 0, trackIds_2 = trackIds;
                    _b.label = 17;
                case 17:
                    if (!(_i < trackIds_2.length)) return [3 /*break*/, 22];
                    id = trackIds_2[_i];
                    _b.label = 18;
                case 18:
                    _b.trys.push([18, 20, , 21]);
                    return [4 /*yield*/, sdk.api.time_tracks.deleteOne(id)];
                case 19:
                    _b.sent();
                    return [3 /*break*/, 21];
                case 20:
                    e_5 = _b.sent();
                    return [3 /*break*/, 21];
                case 21:
                    _i++;
                    return [3 /*break*/, 17];
                case 22: return [7 /*endfinally*/];
                case 23: return [2 /*return*/];
            }
        });
    });
};
exports.time_tracks_correction_tests = time_tracks_correction_tests;
// ============================================================
// Group C: Review Flow
// ============================================================
var time_tracks_review_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var trackIds, now, oneHourAgo, twoHoursAgo, historical, reviewTime, reviewed, historical2_1, updatedReview, historical3, rejected, _i, trackIds_3, id, e_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("Time Tracks - Review Flow Tests");
                    trackIds = [];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 9, 16]);
                    now = new Date();
                    oneHourAgo = new Date(now.getTime() - 3600000);
                    twoHoursAgo = new Date(now.getTime() - 7200000);
                    // Create a historical track for review testing
                    log("C0: Creating historical track for review tests...");
                    return [4 /*yield*/, sdk.api.time_tracks.createOne({
                            title: "Track for Review",
                            isHistorical: true,
                            closedAt: now,
                            lockedAt: now,
                            lockedByUserId: sdk.userInfo.id,
                            totalDurationInMS: 3600000,
                            timestamps: [
                                { type: 'start', timestamp: twoHoursAgo },
                                { type: 'pause', timestamp: oneHourAgo },
                            ],
                        })];
                case 2:
                    historical = _b.sent();
                    trackIds.push(historical.id);
                    log("C0: Historical track created");
                    // Test C1: Review by different user (approval)
                    log("C1: Review by different user (approval)...");
                    reviewTime = new Date();
                    return [4 /*yield*/, sdk.api.time_tracks.updateOne(historical.id, {
                            reviewedAt: reviewTime,
                            reviewedByUserId: sdkNonAdmin.userInfo.id,
                            reviewApproved: true,
                        })];
                case 3:
                    reviewed = _b.sent();
                    (0, testing_1.assert)(!!reviewed.reviewedAt, "reviewedAt should be set");
                    (0, testing_1.assert)(reviewed.reviewedByUserId === sdkNonAdmin.userInfo.id, "reviewedByUserId should match non-admin");
                    (0, testing_1.assert)(reviewed.reviewApproved === true, "reviewApproved should be true");
                    log("C1: Review approved successfully by different user");
                    // Test C2: Self-review (owner reviews own track) - expect 400
                    log("C2: Self-review (should fail)...");
                    return [4 /*yield*/, sdk.api.time_tracks.createOne({
                            title: "Track for Self-Review",
                            isHistorical: true,
                            closedAt: now,
                            lockedAt: now,
                            lockedByUserId: sdk.userInfo.id,
                            totalDurationInMS: 3600000,
                            timestamps: [
                                { type: 'start', timestamp: twoHoursAgo },
                                { type: 'pause', timestamp: oneHourAgo },
                            ],
                        })];
                case 4:
                    historical2_1 = _b.sent();
                    trackIds.push(historical2_1.id);
                    return [4 /*yield*/, assert_throws(function () { return sdk.api.time_tracks.updateOne(historical2_1.id, {
                            reviewedAt: new Date(),
                            reviewedByUserId: sdk.userInfo.id,
                            reviewApproved: true,
                        }); }, "C2: Self-review")];
                case 5:
                    _b.sent();
                    log("C2: Correctly rejected self-review");
                    // Test C3: Review fields updatable even after lock
                    log("C3: Review fields updatable after lock...");
                    return [4 /*yield*/, sdk.api.time_tracks.updateOne(historical.id, {
                            reviewedAt: new Date(),
                            reviewedByUserId: sdkNonAdmin.userInfo.id,
                            reviewApproved: false,
                            reviewNote: "Hours seem too high, please double-check",
                        })];
                case 6:
                    updatedReview = _b.sent();
                    (0, testing_1.assert)(updatedReview.reviewApproved === false, "reviewApproved should be updated to false");
                    (0, testing_1.assert)(updatedReview.reviewNote === "Hours seem too high, please double-check", "reviewNote should be set");
                    log("C3: Review fields correctly updatable on locked track");
                    // Test C4: Rejection flow with reviewNote
                    log("C4: Rejection flow with reviewNote...");
                    return [4 /*yield*/, sdk.api.time_tracks.createOne({
                            title: "Track for Rejection",
                            isHistorical: true,
                            closedAt: now,
                            lockedAt: now,
                            lockedByUserId: sdk.userInfo.id,
                            totalDurationInMS: 1800000,
                            timestamps: [
                                { type: 'start', timestamp: twoHoursAgo },
                                { type: 'pause', timestamp: oneHourAgo },
                            ],
                        })];
                case 7:
                    historical3 = _b.sent();
                    trackIds.push(historical3.id);
                    return [4 /*yield*/, sdk.api.time_tracks.updateOne(historical3.id, {
                            reviewedAt: new Date(),
                            reviewedByUserId: sdkNonAdmin.userInfo.id,
                            reviewApproved: false,
                            reviewNote: "Rejected - timestamps don't match claimed duration",
                        })];
                case 8:
                    rejected = _b.sent();
                    (0, testing_1.assert)(rejected.reviewApproved === false, "reviewApproved should be false");
                    (0, testing_1.assert)(rejected.reviewNote === "Rejected - timestamps don't match claimed duration", "reviewNote should match");
                    log("C4: Rejection flow completed successfully");
                    log("All review flow tests passed!");
                    return [3 /*break*/, 16];
                case 9:
                    _i = 0, trackIds_3 = trackIds;
                    _b.label = 10;
                case 10:
                    if (!(_i < trackIds_3.length)) return [3 /*break*/, 15];
                    id = trackIds_3[_i];
                    _b.label = 11;
                case 11:
                    _b.trys.push([11, 13, , 14]);
                    return [4 /*yield*/, sdk.api.time_tracks.deleteOne(id)];
                case 12:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 13:
                    e_6 = _b.sent();
                    return [3 /*break*/, 14];
                case 14:
                    _i++;
                    return [3 /*break*/, 10];
                case 15: return [7 /*endfinally*/];
                case 16: return [2 /*return*/];
            }
        });
    });
};
exports.time_tracks_review_tests = time_tracks_review_tests;
// ============================================================
// Group D: Lock Enforcement
// ============================================================
var time_tracks_lock_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var trackIds, now, oneHourAgo, twoHoursAgo, locked_1, reviewed, _i, trackIds_4, id, e_7;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("Time Tracks - Lock Enforcement Tests");
                    trackIds = [];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 9, 16]);
                    now = new Date();
                    oneHourAgo = new Date(now.getTime() - 3600000);
                    twoHoursAgo = new Date(now.getTime() - 7200000);
                    // Create a locked historical track
                    log("D0: Creating locked historical track...");
                    return [4 /*yield*/, sdk.api.time_tracks.createOne({
                            title: "Locked Track",
                            isHistorical: true,
                            closedAt: now,
                            lockedAt: now,
                            lockedByUserId: sdk.userInfo.id,
                            totalDurationInMS: 3600000,
                            timestamps: [
                                { type: 'start', timestamp: twoHoursAgo },
                                { type: 'pause', timestamp: oneHourAgo },
                            ],
                        })];
                case 2:
                    locked_1 = _b.sent();
                    trackIds.push(locked_1.id);
                    log("D0: Locked track created");
                    // Test D1: Locked track rejects updates to timestamps
                    log("D1: Updating timestamps on locked track (should fail)...");
                    return [4 /*yield*/, assert_throws(function () { return sdk.api.time_tracks.updateOne(locked_1.id, {
                            timestamps: [{ type: 'start', timestamp: new Date() }],
                        }); }, "D1: timestamps update on locked track")];
                case 3:
                    _b.sent();
                    log("D1: Correctly rejected timestamps update");
                    // Test D2: Locked track rejects updates to closedAt
                    log("D2: Updating closedAt on locked track (should fail)...");
                    return [4 /*yield*/, assert_throws(function () { return sdk.api.time_tracks.updateOne(locked_1.id, {
                            closedAt: new Date(),
                        }); }, "D2: closedAt update on locked track")];
                case 4:
                    _b.sent();
                    log("D2: Correctly rejected closedAt update");
                    // Test D3: Locked track rejects updates to totalDurationInMS
                    log("D3: Updating totalDurationInMS on locked track (should fail)...");
                    return [4 /*yield*/, assert_throws(function () { return sdk.api.time_tracks.updateOne(locked_1.id, {
                            totalDurationInMS: 999,
                        }); }, "D3: totalDurationInMS update on locked track")];
                case 5:
                    _b.sent();
                    log("D3: Correctly rejected totalDurationInMS update");
                    // Test D4: Locked track rejects updates to correctedAt
                    log("D4: Updating correctedAt on locked track (should fail)...");
                    return [4 /*yield*/, assert_throws(function () { return sdk.api.time_tracks.updateOne(locked_1.id, {
                            correctedAt: new Date(),
                            originalTotalDurationInMS: 3600000,
                            totalDurationInMS: 1800000,
                            lockedAt: new Date(),
                            lockedByUserId: sdk.userInfo.id,
                        }); }, "D4: correctedAt update on locked track")];
                case 6:
                    _b.sent();
                    log("D4: Correctly rejected correction on locked track");
                    // Test D5: Locked track rejects updates to title
                    log("D5: Updating title on locked track (should fail)...");
                    return [4 /*yield*/, assert_throws(function () { return sdk.api.time_tracks.updateOne(locked_1.id, {
                            title: "Should Not Change",
                        }); }, "D5: title update on locked track")];
                case 7:
                    _b.sent();
                    log("D5: Correctly rejected title update");
                    // Test D6: Locked track allows updates to review fields
                    log("D6: Updating review fields on locked track (should succeed)...");
                    return [4 /*yield*/, sdk.api.time_tracks.updateOne(locked_1.id, {
                            reviewedAt: new Date(),
                            reviewedByUserId: sdkNonAdmin.userInfo.id,
                            reviewApproved: true,
                            reviewNote: "Looks good",
                        })];
                case 8:
                    reviewed = _b.sent();
                    (0, testing_1.assert)(reviewed.reviewApproved === true, "reviewApproved should be set");
                    (0, testing_1.assert)(reviewed.reviewNote === "Looks good", "reviewNote should be set");
                    (0, testing_1.assert)(reviewed.reviewedByUserId === sdkNonAdmin.userInfo.id, "reviewedByUserId should match");
                    log("D6: Review fields correctly updatable on locked track");
                    log("All lock enforcement tests passed!");
                    return [3 /*break*/, 16];
                case 9:
                    _i = 0, trackIds_4 = trackIds;
                    _b.label = 10;
                case 10:
                    if (!(_i < trackIds_4.length)) return [3 /*break*/, 15];
                    id = trackIds_4[_i];
                    _b.label = 11;
                case 11:
                    _b.trys.push([11, 13, , 14]);
                    return [4 /*yield*/, sdk.api.time_tracks.deleteOne(id)];
                case 12:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 13:
                    e_7 = _b.sent();
                    return [3 /*break*/, 14];
                case 14:
                    _i++;
                    return [3 /*break*/, 10];
                case 15: return [7 /*endfinally*/];
                case 16: return [2 /*return*/];
            }
        });
    });
};
exports.time_tracks_lock_tests = time_tracks_lock_tests;
// ============================================================
// Group E: Edge Cases
// ============================================================
var time_tracks_edge_case_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var trackIds, track, updated, withPause, track2, closedTrack, originalDuration, corrected, _i, trackIds_5, id, e_8;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    (0, testing_1.log_header)("Time Tracks - Edge Case Tests");
                    trackIds = [];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, , 10, 17]);
                    // Test E1: Normal real-time track - lockedAt stays undefined, all fields updatable
                    log("E1: Normal real-time track is fully updatable...");
                    return [4 /*yield*/, sdk.api.time_tracks.createOne({
                            title: "Normal Track",
                        })];
                case 2:
                    track = _c.sent();
                    trackIds.push(track.id);
                    (0, testing_1.assert)(!track.lockedAt, "lockedAt should be undefined for normal track");
                    (0, testing_1.assert)(!track.isHistorical, "isHistorical should be undefined for normal track");
                    return [4 /*yield*/, sdk.api.time_tracks.updateOne(track.id, {
                            title: "Updated Normal Track",
                        })];
                case 3:
                    updated = _c.sent();
                    (0, testing_1.assert)(updated.title === "Updated Normal Track", "Title should be updatable on unlocked track");
                    return [4 /*yield*/, sdk.api.time_tracks.updateOne(track.id, {
                            timestamps: __spreadArray(__spreadArray([], (track.timestamps || []), true), [
                                { type: 'pause', timestamp: new Date() },
                            ], false)
                        }, { replaceObjectFields: true })];
                case 4:
                    withPause = _c.sent();
                    (0, testing_1.assert)(((_b = withPause.timestamps) === null || _b === void 0 ? void 0 : _b.length) === 2, "timestamps should be updatable on unlocked track");
                    log("E1: Normal track fully updatable as expected");
                    // Test E2: Original totalDurationInMS preserved after correction
                    log("E2: Original duration preserved after correction...");
                    return [4 /*yield*/, sdk.api.time_tracks.createOne({
                            title: "Track for Duration Preservation",
                        })];
                case 5:
                    track2 = _c.sent();
                    trackIds.push(track2.id);
                    // Close the track
                    return [4 /*yield*/, sdk.api.time_tracks.updateOne(track2.id, { closedAt: new Date() })];
                case 6:
                    // Close the track
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1500)];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, sdk.api.time_tracks.getOne(track2.id)];
                case 8:
                    closedTrack = _c.sent();
                    originalDuration = closedTrack.totalDurationInMS;
                    return [4 /*yield*/, sdk.api.time_tracks.updateOne(track2.id, {
                            correctedAt: new Date(),
                            correctedByUserId: sdk.userInfo.id,
                            originalTotalDurationInMS: originalDuration,
                            totalDurationInMS: 5000,
                            lockedAt: new Date(),
                            lockedByUserId: sdk.userInfo.id,
                        })];
                case 9:
                    corrected = _c.sent();
                    (0, testing_1.assert)(corrected.originalTotalDurationInMS === originalDuration, "originalTotalDurationInMS should be ".concat(originalDuration, ", got ").concat(corrected.originalTotalDurationInMS));
                    (0, testing_1.assert)(corrected.totalDurationInMS === 5000, "totalDurationInMS should be corrected to 5000, got ".concat(corrected.totalDurationInMS));
                    log("E2: Original duration correctly preserved in originalTotalDurationInMS");
                    log("All edge case tests passed!");
                    return [3 /*break*/, 17];
                case 10:
                    _i = 0, trackIds_5 = trackIds;
                    _c.label = 11;
                case 11:
                    if (!(_i < trackIds_5.length)) return [3 /*break*/, 16];
                    id = trackIds_5[_i];
                    _c.label = 12;
                case 12:
                    _c.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, sdk.api.time_tracks.deleteOne(id)];
                case 13:
                    _c.sent();
                    return [3 /*break*/, 15];
                case 14:
                    e_8 = _c.sent();
                    return [3 /*break*/, 15];
                case 15:
                    _i++;
                    return [3 /*break*/, 11];
                case 16: return [7 /*endfinally*/];
                case 17: return [2 /*return*/];
            }
        });
    });
};
exports.time_tracks_edge_case_tests = time_tracks_edge_case_tests;
// Allow running this test file independently
if (require.main === module) {
    var sdk_2 = new sdk_1.Session({ host: host });
    var sdkNonAdmin_1 = new sdk_1.Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // First run unit tests
                    test_calculateTimeTrackDuration();
                    // Then run API tests
                    return [4 /*yield*/, (0, setup_1.setup_tests)(sdk_2, sdkNonAdmin_1)];
                case 1:
                    // Then run API tests
                    _a.sent();
                    return [4 /*yield*/, (0, exports.time_tracks_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.time_tracks_historical_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.time_tracks_correction_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.time_tracks_review_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.time_tracks_lock_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.time_tracks_edge_case_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("Time tracks test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("Time tracks test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=time_tracks.test.js.map