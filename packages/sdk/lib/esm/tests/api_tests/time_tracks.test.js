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
require('source-map-support').install();
import { Session } from "../../sdk";
import { assert, log_header } from "@tellescope/testing";
import { setup_tests } from "../setup";
var log = console.log;
var host = process.env.REACT_APP_TELLESCOPE_API_URL || 'http://localhost:8080';
// Unit tests for calculateTimeTrackDuration
var test_calculateTimeTrackDuration = function () {
    log_header("calculateTimeTrackDuration Unit Tests");
    var calculateTimeTrackDuration = require('@tellescope/utilities').calculateTimeTrackDuration;
    // Test 1: Single start-pause interval
    var test1 = calculateTimeTrackDuration([
        { type: 'start', timestamp: new Date('2024-01-01T10:00:00Z') },
        { type: 'pause', timestamp: new Date('2024-01-01T10:05:00Z') },
    ]);
    assert(test1 === 300000, "Single 5-minute interval should be 300000 ms, got ".concat(test1));
    // Test 2: Start-pause-resume-pause
    var test2 = calculateTimeTrackDuration([
        { type: 'start', timestamp: new Date('2024-01-01T10:00:00Z') },
        { type: 'pause', timestamp: new Date('2024-01-01T10:05:00Z') },
        { type: 'resume', timestamp: new Date('2024-01-01T10:10:00Z') },
        { type: 'pause', timestamp: new Date('2024-01-01T10:20:00Z') },
    ]);
    assert(test2 === 900000, "Two intervals (5min + 10min) should be 900000 ms, got ".concat(test2));
    // Test 3: Start with closedAt (not paused before close)
    var test3 = calculateTimeTrackDuration([
        { type: 'start', timestamp: new Date('2024-01-01T10:00:00Z') },
    ], new Date('2024-01-01T10:15:00Z'));
    assert(test3 === 900000, "Running for 15 minutes should be 900000 ms, got ".concat(test3));
    // Test 4: Start-pause with closedAt (paused, should not add time after pause)
    var test4 = calculateTimeTrackDuration([
        { type: 'start', timestamp: new Date('2024-01-01T10:00:00Z') },
        { type: 'pause', timestamp: new Date('2024-01-01T10:05:00Z') },
    ], new Date('2024-01-01T10:30:00Z'));
    assert(test4 === 300000, "Paused at 5 minutes should still be 300000 ms even with later closedAt, got ".concat(test4));
    // Test 5: Start-resume without initial pause (resume should act as continuation)
    var test5 = calculateTimeTrackDuration([
        { type: 'start', timestamp: new Date('2024-01-01T10:00:00Z') },
        { type: 'pause', timestamp: new Date('2024-01-01T10:05:00Z') },
        { type: 'resume', timestamp: new Date('2024-01-01T10:05:00Z') },
    ], new Date('2024-01-01T10:10:00Z'));
    assert(test5 === 600000, "5min paused + 5min resumed should be 600000 ms, got ".concat(test5));
    // Test 6: Empty timestamps
    var test6 = calculateTimeTrackDuration([]);
    assert(test6 === 0, "Empty timestamps should be 0 ms, got ".concat(test6));
    // Test 7: Multiple pause/resume cycles
    var test7 = calculateTimeTrackDuration([
        { type: 'start', timestamp: new Date('2024-01-01T10:00:00Z') },
        { type: 'pause', timestamp: new Date('2024-01-01T10:10:00Z') },
        { type: 'resume', timestamp: new Date('2024-01-01T11:00:00Z') },
        { type: 'pause', timestamp: new Date('2024-01-01T11:30:00Z') },
        { type: 'resume', timestamp: new Date('2024-01-01T12:00:00Z') },
        { type: 'pause', timestamp: new Date('2024-01-01T12:05:00Z') }, // 5 min
    ]);
    assert(test7 === 2700000, "Three intervals (10+30+5 min) should be 2700000 ms, got ".concat(test7));
    log("✅ All calculateTimeTrackDuration unit tests passed");
};
// API tests for time_tracks CRUD operations
export var time_tracks_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var userId, createdTimeTrackId, enduserId, timeTrack_1, fetchedTimeTrack, allTimeTracks, enduser, linkedTimeTrack_1, pauseTime, pausedTimeTrack, resumeTime, resumedTimeTrack, closedAt, closedTimeTrack, finalTimeTrack, updatedTimeTrack, allUserTimeTracks, activeTimeTracks, nonAdminTimeTracks, hasOtherUserTimeTrack, deletedCheck, stillExists, e_1, e_2;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    log_header("Time Tracks API Tests");
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
                    assert(timeTrack_1.title === "Test Time Track", "Title should match");
                    assert(timeTrack_1.userId === userId, "userId should be auto-set to current user ".concat(userId, ", got ").concat(timeTrack_1.userId));
                    assert(Array.isArray(timeTrack_1.timestamps), "timestamps should be an array");
                    assert(((_b = timeTrack_1.timestamps) === null || _b === void 0 ? void 0 : _b.length) === 1, "timestamps should have 1 initial start event, got ".concat((_c = timeTrack_1.timestamps) === null || _c === void 0 ? void 0 : _c.length));
                    assert(((_d = timeTrack_1.timestamps) === null || _d === void 0 ? void 0 : _d[0].type) === 'start', "First timestamp should be 'start', got ".concat((_e = timeTrack_1.timestamps) === null || _e === void 0 ? void 0 : _e[0].type));
                    assert(!timeTrack_1.closedAt, "closedAt should not be set initially");
                    assert(!timeTrack_1.totalDurationInMS, "totalDurationInMS should not be set initially");
                    log("✅ Time track created with auto-set userId and initial timestamp");
                    // Test 2: Read the time track
                    log("Reading time track...");
                    return [4 /*yield*/, sdk.api.time_tracks.getOne(timeTrack_1.id)];
                case 3:
                    fetchedTimeTrack = _p.sent();
                    assert(fetchedTimeTrack.id === timeTrack_1.id, "Fetched time track should have same id");
                    assert(fetchedTimeTrack.title === "Test Time Track", "Fetched title should match");
                    log("✅ Time track retrieved successfully");
                    // Test 3: Get all time tracks for current user
                    log("Getting all time tracks for current user...");
                    return [4 /*yield*/, sdk.api.time_tracks.getSome({ filter: { userId: userId } })];
                case 4:
                    allTimeTracks = _p.sent();
                    assert(allTimeTracks.length >= 1, "Should have at least 1 time track, got ".concat(allTimeTracks.length));
                    assert(!!allTimeTracks.find(function (t) { return t.id === timeTrack_1.id; }), "Should find our created time track");
                    log("✅ Retrieved all time tracks for user");
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
                    log("✅ Enduser created");
                    // Test 5: Create time track with enduserId
                    log("Creating time track linked to enduser...");
                    return [4 /*yield*/, sdk.api.time_tracks.createOne({
                            title: "Client Meeting",
                            enduserId: enduser.id,
                        })];
                case 6:
                    linkedTimeTrack_1 = _p.sent();
                    assert(linkedTimeTrack_1.enduserId === enduser.id, "enduserId should be set to ".concat(enduser.id, ", got ").concat(linkedTimeTrack_1.enduserId));
                    log("✅ Time track linked to enduser");
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
                    assert(((_f = pausedTimeTrack.timestamps) === null || _f === void 0 ? void 0 : _f.length) === 2, "Should have 2 timestamps after pause, got ".concat((_g = pausedTimeTrack.timestamps) === null || _g === void 0 ? void 0 : _g.length));
                    assert(((_h = pausedTimeTrack.timestamps) === null || _h === void 0 ? void 0 : _h[1].type) === 'pause', "Second timestamp should be 'pause', got ".concat((_j = pausedTimeTrack.timestamps) === null || _j === void 0 ? void 0 : _j[1].type));
                    log("✅ Pause timestamp added");
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
                    assert(((_k = resumedTimeTrack.timestamps) === null || _k === void 0 ? void 0 : _k.length) === 3, "Should have 3 timestamps after resume, got ".concat((_l = resumedTimeTrack.timestamps) === null || _l === void 0 ? void 0 : _l.length));
                    assert(((_m = resumedTimeTrack.timestamps) === null || _m === void 0 ? void 0 : _m[2].type) === 'resume', "Third timestamp should be 'resume', got ".concat((_o = resumedTimeTrack.timestamps) === null || _o === void 0 ? void 0 : _o[2].type));
                    log("✅ Resume timestamp added");
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
                    assert(!!finalTimeTrack.closedAt, "closedAt should be set");
                    assert(typeof finalTimeTrack.totalDurationInMS === 'number', "totalDurationInMS should be a number, got ".concat(typeof finalTimeTrack.totalDurationInMS));
                    assert(finalTimeTrack.totalDurationInMS > 0, "totalDurationInMS should be > 0, got ".concat(finalTimeTrack.totalDurationInMS));
                    log("\u2705 Time track closed with auto-calculated duration: ".concat(finalTimeTrack.totalDurationInMS, " ms"));
                    // Test 9: Update title
                    log("Updating time track title...");
                    return [4 /*yield*/, sdk.api.time_tracks.updateOne(timeTrack_1.id, {
                            title: "Updated Time Track Title",
                        })];
                case 12:
                    updatedTimeTrack = _p.sent();
                    assert(updatedTimeTrack.title === "Updated Time Track Title", "Title should be updated");
                    log("✅ Time track title updated");
                    // Test 10: Filter by closedAt (get active time tracks)
                    log("Filtering for active time tracks (no closedAt)...");
                    return [4 /*yield*/, sdk.api.time_tracks.getSome({
                            filter: { userId: userId }
                        })];
                case 13:
                    allUserTimeTracks = _p.sent();
                    activeTimeTracks = allUserTimeTracks.filter(function (t) { return !t.closedAt; });
                    assert(!activeTimeTracks.find(function (t) { return t.id === timeTrack_1.id; }), "Closed time track should not appear in active filter");
                    assert(!!activeTimeTracks.find(function (t) { return t.id === linkedTimeTrack_1.id; }), "Unclosed time track should appear in active filter");
                    log("✅ Active time tracks filtered correctly");
                    // Test 11: Access control - non-admin user should only see their own time tracks
                    log("Testing access control with non-admin user...");
                    return [4 /*yield*/, sdkNonAdmin.api.time_tracks.getSome({})];
                case 14:
                    nonAdminTimeTracks = _p.sent();
                    hasOtherUserTimeTrack = nonAdminTimeTracks.find(function (t) { return t.userId !== sdkNonAdmin.userInfo.id; });
                    assert(!hasOtherUserTimeTrack, "Non-admin user should not see other users' time tracks");
                    log("✅ Access control working correctly");
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
                    assert(stillExists.length === 0, "Time tracks should be deleted");
                    log("✅ Time tracks deleted successfully");
                    log("✅ All time tracks API tests passed!");
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
                    e_1 = _p.sent();
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
                    e_2 = _p.sent();
                    return [3 /*break*/, 26];
                case 26: return [7 /*endfinally*/];
                case 27: return [2 /*return*/];
            }
        });
    });
};
// Allow running this test file independently
if (require.main === module) {
    var sdk_1 = new Session({ host: host });
    var sdkNonAdmin_1 = new Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // First run unit tests
                    test_calculateTimeTrackDuration();
                    // Then run API tests
                    return [4 /*yield*/, setup_tests(sdk_1, sdkNonAdmin_1)];
                case 1:
                    // Then run API tests
                    _a.sent();
                    return [4 /*yield*/, time_tracks_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Time tracks test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Time tracks test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=time_tracks.test.js.map