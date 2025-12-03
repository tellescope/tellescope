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
exports.managed_content_enduser_access_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
var businessId = '60398b1131a295e64f084ff6';
/**
 * Tests for managed_content_records enduser access filtering.
 * Validates that the backend correctly filters content based on:
 * 1. assignmentType: 'All' - visible to all endusers
 * 2. enduserId match - direct individual assignment
 * 3. ManagedContentRecordAssignment - manual assignments
 * 4. assignmentType: 'By Tags' + tag overlap - tag-based assignment
 * 5. CalendarEvent.sharedContentIds - content shared via events
 *
 * Also verifies that filtering does NOT apply to user sessions.
 */
var managed_content_enduser_access_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var contentRecordIds, assignmentIds, calendarEventIds, testEnduserId, otherEnduserId, enduserSDK, otherEnduserSDK, testEnduser, otherEnduser, contentAll_1, contentDirect_1, contentByTagsMatch_1, contentByTagsNoMatch, contentNoAssignment, contentManualAssignment_1, assignment, contentViaEvent_1, calendarEvent, _i, calendarEventIds_1, eventId, _b, assignmentIds_1, assignmentId, _c, contentRecordIds_1, recordId, error_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    (0, testing_1.log_header)("Managed Content Enduser Access Tests");
                    contentRecordIds = [];
                    assignmentIds = [];
                    calendarEventIds = [];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, , 30, 50]);
                    // ===== SETUP =====
                    console.log("Setting up test data...");
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            email: "mcr_access_test_".concat(Date.now(), "@test.tellescope.com"),
                            tags: ['premium', 'diabetes-management']
                        })];
                case 2:
                    testEnduser = _d.sent();
                    testEnduserId = testEnduser.id;
                    return [4 /*yield*/, sdk.api.endusers.set_password({ id: testEnduser.id, password: 'TestPassword123!' })];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            email: "mcr_access_other_".concat(Date.now(), "@test.tellescope.com"),
                            tags: ['basic'] // Different tags
                        })];
                case 4:
                    otherEnduser = _d.sent();
                    otherEnduserId = otherEnduser.id;
                    return [4 /*yield*/, sdk.api.endusers.set_password({ id: otherEnduser.id, password: 'TestPassword123!' })
                        // Create and authenticate enduser sessions
                    ];
                case 5:
                    _d.sent();
                    // Create and authenticate enduser sessions
                    enduserSDK = new sdk_1.EnduserSession({ host: host, businessId: businessId });
                    return [4 /*yield*/, enduserSDK.authenticate(testEnduser.email, 'TestPassword123!')];
                case 6:
                    _d.sent();
                    otherEnduserSDK = new sdk_1.EnduserSession({ host: host, businessId: businessId });
                    return [4 /*yield*/, otherEnduserSDK.authenticate(otherEnduser.email, 'TestPassword123!')
                        // Create managed content records with different assignment types
                        // 1. Content with assignmentType: 'All'
                    ];
                case 7:
                    _d.sent();
                    return [4 /*yield*/, sdk.api.managed_content_records.createOne({
                            title: 'Content for All',
                            htmlContent: '<p>All users</p>',
                            textContent: 'All users',
                            assignmentType: 'All',
                            publicRead: true,
                        })];
                case 8:
                    contentAll_1 = _d.sent();
                    contentRecordIds.push(contentAll_1.id);
                    return [4 /*yield*/, sdk.api.managed_content_records.createOne({
                            title: 'Content Direct Assignment',
                            htmlContent: '<p>Direct</p>',
                            textContent: 'Direct',
                            enduserId: testEnduser.id,
                            publicRead: true,
                        })];
                case 9:
                    contentDirect_1 = _d.sent();
                    contentRecordIds.push(contentDirect_1.id);
                    return [4 /*yield*/, sdk.api.managed_content_records.createOne({
                            title: 'Content By Tags Match',
                            htmlContent: '<p>Tags</p>',
                            textContent: 'Tags',
                            assignmentType: 'By Tags',
                            tags: ['diabetes-management'],
                            publicRead: true,
                        })];
                case 10:
                    contentByTagsMatch_1 = _d.sent();
                    contentRecordIds.push(contentByTagsMatch_1.id);
                    return [4 /*yield*/, sdk.api.managed_content_records.createOne({
                            title: 'Content By Tags No Match',
                            htmlContent: '<p>Tags No Match</p>',
                            textContent: 'Tags No Match',
                            assignmentType: 'By Tags',
                            tags: ['cardiac-care'],
                            publicRead: true,
                        })];
                case 11:
                    contentByTagsNoMatch = _d.sent();
                    contentRecordIds.push(contentByTagsNoMatch.id);
                    return [4 /*yield*/, sdk.api.managed_content_records.createOne({
                            title: 'Content No Assignment',
                            htmlContent: '<p>No assignment</p>',
                            textContent: 'No assignment',
                            publicRead: true,
                            // No assignmentType, no enduserId, no tags
                        })];
                case 12:
                    contentNoAssignment = _d.sent();
                    contentRecordIds.push(contentNoAssignment.id);
                    return [4 /*yield*/, sdk.api.managed_content_records.createOne({
                            title: 'Content Manual Assignment',
                            htmlContent: '<p>Manual</p>',
                            textContent: 'Manual',
                            publicRead: true,
                        })];
                case 13:
                    contentManualAssignment_1 = _d.sent();
                    contentRecordIds.push(contentManualAssignment_1.id);
                    return [4 /*yield*/, sdk.api.managed_content_record_assignments.createOne({
                            contentId: contentManualAssignment_1.id,
                            enduserId: testEnduser.id,
                        })];
                case 14:
                    assignment = _d.sent();
                    assignmentIds.push(assignment.id);
                    return [4 /*yield*/, sdk.api.managed_content_records.createOne({
                            title: 'Content Via Event',
                            htmlContent: '<p>Event</p>',
                            textContent: 'Event',
                            publicRead: true,
                        })];
                case 15:
                    contentViaEvent_1 = _d.sent();
                    contentRecordIds.push(contentViaEvent_1.id);
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Test Event with Shared Content',
                            startTimeInMS: Date.now() + 86400000,
                            durationInMinutes: 60,
                            attendees: [{ id: testEnduser.id, type: 'enduser' }],
                            sharedContentIds: [contentViaEvent_1.id],
                        })];
                case 16:
                    calendarEvent = _d.sent();
                    calendarEventIds.push(calendarEvent.id);
                    console.log("Test data created successfully");
                    console.log("- Created ".concat(contentRecordIds.length, " content records"));
                    console.log("- Created ".concat(assignmentIds.length, " manual assignments"));
                    console.log("- Created ".concat(calendarEventIds.length, " calendar events"));
                    // ===== TEST CASES =====
                    // Test 1: Content with assignmentType: 'All' visible to enduser
                    return [4 /*yield*/, (0, testing_1.async_test)('assignmentType All - visible to enduser', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, enduserSDK.api.managed_content_records.getSome({
                                            filter: { title: 'Content for All' }
                                        })];
                                    case 1:
                                        results = _a.sent();
                                        return [2 /*return*/, results.length === 1 && results[0].id === contentAll_1.id];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 2: Direct enduserId assignment - visible to assigned enduser
                    ];
                case 17:
                    // ===== TEST CASES =====
                    // Test 1: Content with assignmentType: 'All' visible to enduser
                    _d.sent();
                    // Test 2: Direct enduserId assignment - visible to assigned enduser
                    return [4 /*yield*/, (0, testing_1.async_test)('direct enduserId - visible to assigned enduser', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, enduserSDK.api.managed_content_records.getSome({
                                            filter: { title: 'Content Direct Assignment' }
                                        })];
                                    case 1:
                                        results = _a.sent();
                                        return [2 /*return*/, results.length === 1 && results[0].id === contentDirect_1.id];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 3: Direct enduserId assignment - NOT visible to other enduser
                    ];
                case 18:
                    // Test 2: Direct enduserId assignment - visible to assigned enduser
                    _d.sent();
                    // Test 3: Direct enduserId assignment - NOT visible to other enduser
                    return [4 /*yield*/, (0, testing_1.async_test)('direct enduserId - NOT visible to other enduser', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, otherEnduserSDK.api.managed_content_records.getSome({
                                            filter: { title: 'Content Direct Assignment' }
                                        })];
                                    case 1:
                                        results = _a.sent();
                                        return [2 /*return*/, results.length === 0];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 4: By Tags with matching tags - visible to enduser
                    ];
                case 19:
                    // Test 3: Direct enduserId assignment - NOT visible to other enduser
                    _d.sent();
                    // Test 4: By Tags with matching tags - visible to enduser
                    return [4 /*yield*/, (0, testing_1.async_test)('By Tags match - visible to enduser', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, enduserSDK.api.managed_content_records.getSome({
                                            filter: { title: 'Content By Tags Match' }
                                        })];
                                    case 1:
                                        results = _a.sent();
                                        return [2 /*return*/, results.length === 1 && results[0].id === contentByTagsMatch_1.id];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 5: By Tags with non-matching tags - NOT visible to enduser
                    ];
                case 20:
                    // Test 4: By Tags with matching tags - visible to enduser
                    _d.sent();
                    // Test 5: By Tags with non-matching tags - NOT visible to enduser
                    return [4 /*yield*/, (0, testing_1.async_test)('By Tags no match - NOT visible to enduser', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, enduserSDK.api.managed_content_records.getSome({
                                            filter: { title: 'Content By Tags No Match' }
                                        })];
                                    case 1:
                                        results = _a.sent();
                                        return [2 /*return*/, results.length === 0];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 6: Content without assignment criteria - NOT visible to enduser
                    ];
                case 21:
                    // Test 5: By Tags with non-matching tags - NOT visible to enduser
                    _d.sent();
                    // Test 6: Content without assignment criteria - NOT visible to enduser
                    return [4 /*yield*/, (0, testing_1.async_test)('no assignment criteria - NOT visible to enduser', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, enduserSDK.api.managed_content_records.getSome({
                                            filter: { title: 'Content No Assignment' }
                                        })];
                                    case 1:
                                        results = _a.sent();
                                        return [2 /*return*/, results.length === 0];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 7: Manual assignment via ManagedContentRecordAssignment - visible to enduser
                    ];
                case 22:
                    // Test 6: Content without assignment criteria - NOT visible to enduser
                    _d.sent();
                    // Test 7: Manual assignment via ManagedContentRecordAssignment - visible to enduser
                    return [4 /*yield*/, (0, testing_1.async_test)('manual assignment - visible to assigned enduser', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, enduserSDK.api.managed_content_records.getSome({
                                            filter: { title: 'Content Manual Assignment' }
                                        })];
                                    case 1:
                                        results = _a.sent();
                                        return [2 /*return*/, results.length === 1 && results[0].id === contentManualAssignment_1.id];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 8: Manual assignment - NOT visible to other enduser
                    ];
                case 23:
                    // Test 7: Manual assignment via ManagedContentRecordAssignment - visible to enduser
                    _d.sent();
                    // Test 8: Manual assignment - NOT visible to other enduser
                    return [4 /*yield*/, (0, testing_1.async_test)('manual assignment - NOT visible to other enduser', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, otherEnduserSDK.api.managed_content_records.getSome({
                                            filter: { title: 'Content Manual Assignment' }
                                        })];
                                    case 1:
                                        results = _a.sent();
                                        return [2 /*return*/, results.length === 0];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 9: Content shared via CalendarEvent - visible to event attendee
                    ];
                case 24:
                    // Test 8: Manual assignment - NOT visible to other enduser
                    _d.sent();
                    // Test 9: Content shared via CalendarEvent - visible to event attendee
                    return [4 /*yield*/, (0, testing_1.async_test)('event sharedContentIds - visible to attendee', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, enduserSDK.api.managed_content_records.getSome({
                                            filter: { title: 'Content Via Event' }
                                        })];
                                    case 1:
                                        results = _a.sent();
                                        return [2 /*return*/, results.length === 1 && results[0].id === contentViaEvent_1.id];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 10: Content shared via CalendarEvent - NOT visible to non-attendee
                    ];
                case 25:
                    // Test 9: Content shared via CalendarEvent - visible to event attendee
                    _d.sent();
                    // Test 10: Content shared via CalendarEvent - NOT visible to non-attendee
                    return [4 /*yield*/, (0, testing_1.async_test)('event sharedContentIds - NOT visible to non-attendee', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, otherEnduserSDK.api.managed_content_records.getSome({
                                            filter: { title: 'Content Via Event' }
                                        })];
                                    case 1:
                                        results = _a.sent();
                                        return [2 /*return*/, results.length === 0];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 11: User session can see ALL content (no filtering applied)
                    ];
                case 26:
                    // Test 10: Content shared via CalendarEvent - NOT visible to non-attendee
                    _d.sent();
                    // Test 11: User session can see ALL content (no filtering applied)
                    return [4 /*yield*/, (0, testing_1.async_test)('user session - sees all content (no filtering)', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results, testRecords;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.managed_content_records.getSome({})
                                        // Filter to only our test content by checking IDs
                                    ];
                                    case 1:
                                        results = _a.sent();
                                        testRecords = results.filter(function (r) { return contentRecordIds.includes(r.id); });
                                        return [2 /*return*/, testRecords.length === 7];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 12: Count total visible records for enduser
                    ];
                case 27:
                    // Test 11: User session can see ALL content (no filtering applied)
                    _d.sent();
                    // Test 12: Count total visible records for enduser
                    return [4 /*yield*/, (0, testing_1.async_test)('enduser - correct total visible count', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results, testRecords;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, enduserSDK.api.managed_content_records.getSome({})
                                        // Filter to only our test content by checking IDs
                                    ];
                                    case 1:
                                        results = _a.sent();
                                        testRecords = results.filter(function (r) { return contentRecordIds.includes(r.id); });
                                        console.log("Enduser can see ".concat(testRecords.length, " out of 7 content records"));
                                        console.log("Visible: ".concat(testRecords.map(function (r) { return r.title; }).join(', ')));
                                        return [2 /*return*/, testRecords.length === 5];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 13: Other enduser sees only assignmentType: 'All'
                    ];
                case 28:
                    // Test 12: Count total visible records for enduser
                    _d.sent();
                    // Test 13: Other enduser sees only assignmentType: 'All'
                    return [4 /*yield*/, (0, testing_1.async_test)('other enduser - sees only All assignment type', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results, testRecords;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, otherEnduserSDK.api.managed_content_records.getSome({})
                                        // Filter to only our test content by checking IDs
                                    ];
                                    case 1:
                                        results = _a.sent();
                                        testRecords = results.filter(function (r) { return contentRecordIds.includes(r.id); });
                                        console.log("Other enduser can see ".concat(testRecords.length, " content records"));
                                        console.log("Visible: ".concat(testRecords.map(function (r) { return r.title; }).join(', ')));
                                        // Only "Content for All" should be visible
                                        return [2 /*return*/, testRecords.length === 1 && testRecords[0].title === 'Content for All'];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })];
                case 29:
                    // Test 13: Other enduser sees only assignmentType: 'All'
                    _d.sent();
                    console.log("All Managed Content Enduser Access tests passed!");
                    return [3 /*break*/, 50];
                case 30:
                    // Cleanup
                    console.log("Cleaning up test data...");
                    _d.label = 31;
                case 31:
                    _d.trys.push([31, 48, , 49]);
                    _i = 0, calendarEventIds_1 = calendarEventIds;
                    _d.label = 32;
                case 32:
                    if (!(_i < calendarEventIds_1.length)) return [3 /*break*/, 35];
                    eventId = calendarEventIds_1[_i];
                    return [4 /*yield*/, sdk.api.calendar_events.deleteOne(eventId).catch(function () { })];
                case 33:
                    _d.sent();
                    _d.label = 34;
                case 34:
                    _i++;
                    return [3 /*break*/, 32];
                case 35:
                    _b = 0, assignmentIds_1 = assignmentIds;
                    _d.label = 36;
                case 36:
                    if (!(_b < assignmentIds_1.length)) return [3 /*break*/, 39];
                    assignmentId = assignmentIds_1[_b];
                    return [4 /*yield*/, sdk.api.managed_content_record_assignments.deleteOne(assignmentId).catch(function () { })];
                case 37:
                    _d.sent();
                    _d.label = 38;
                case 38:
                    _b++;
                    return [3 /*break*/, 36];
                case 39:
                    _c = 0, contentRecordIds_1 = contentRecordIds;
                    _d.label = 40;
                case 40:
                    if (!(_c < contentRecordIds_1.length)) return [3 /*break*/, 43];
                    recordId = contentRecordIds_1[_c];
                    return [4 /*yield*/, sdk.api.managed_content_records.deleteOne(recordId).catch(function () { })];
                case 41:
                    _d.sent();
                    _d.label = 42;
                case 42:
                    _c++;
                    return [3 /*break*/, 40];
                case 43:
                    if (!testEnduserId) return [3 /*break*/, 45];
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduserId).catch(function () { })];
                case 44:
                    _d.sent();
                    _d.label = 45;
                case 45:
                    if (!otherEnduserId) return [3 /*break*/, 47];
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(otherEnduserId).catch(function () { })];
                case 46:
                    _d.sent();
                    _d.label = 47;
                case 47:
                    console.log("Cleanup completed");
                    return [3 /*break*/, 49];
                case 48:
                    error_1 = _d.sent();
                    console.error('Cleanup error:', error_1);
                    return [3 /*break*/, 49];
                case 49: return [7 /*endfinally*/];
                case 50: return [2 /*return*/];
            }
        });
    });
};
exports.managed_content_enduser_access_tests = managed_content_enduser_access_tests;
// Allow running this test file independently
if (require.main === module) {
    console.log("Using API URL: ".concat(host));
    var sdk_2 = new sdk_1.Session({ host: host });
    var sdkNonAdmin_1 = new sdk_1.Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, setup_1.setup_tests)(sdk_2, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.managed_content_enduser_access_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("Managed content enduser access test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("Managed content enduser access test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=managed_content_enduser_access.test.js.map