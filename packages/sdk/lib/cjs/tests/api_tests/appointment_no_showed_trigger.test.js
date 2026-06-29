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
exports.appointment_no_showed_trigger_tests = void 0;
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || "http://localhost:8080";
// Covers the event-wide "Appointment No-Showed" trigger path (handle_no_showed_event), which had
// no dedicated test. Mirrors appointment_completed_trigger.test.ts.
var appointment_no_showed_trigger_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var t1, t2, template, t3, enduser1, enduser2, enduser3, event1, event2, event3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("Automation Trigger Tests (Appointment No-Showed)");
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Appointment No-Showed', info: {} },
                            action: { type: 'Add Tags', info: { tags: ['No-Show - Any'] } },
                            status: 'Active',
                            title: "No-Show - Any",
                        })];
                case 1:
                    t1 = _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Appointment No-Showed', info: { titles: ['Test Appointment'] } },
                            action: { type: 'Add Tags', info: { tags: ['No-Show - By Title'] } },
                            status: 'Active',
                            title: "No-Show - By Title",
                        })];
                case 2:
                    t2 = _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_event_templates.createOne({
                            title: 'No-Show Template',
                            durationInMinutes: 30,
                        })];
                case 3:
                    template = _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Appointment No-Showed', info: { templateIds: [template.id] } },
                            action: { type: 'Add Tags', info: { tags: ['No-Show - By Template'] } },
                            status: 'Active',
                            title: "No-Show - By Template",
                        })
                        // Separate endusers to avoid per-trigger throttling (1 min per trigger per enduser)
                    ];
                case 4:
                    t3 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 5:
                    enduser1 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 6:
                    enduser2 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})
                        // Note: the "Appointment No-Showed" trigger fires only on UPDATE (handle_no_showed_event);
                        // there is no create-time no-show path, so every case creates a normal event then updates it.
                        // Test 1: Update to no-showed by title (should trigger Any + By Title)
                    ];
                case 7:
                    enduser3 = _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Test Appointment',
                            durationInMinutes: 30,
                            startTimeInMS: Date.now(),
                            attendees: [{ type: 'enduser', id: enduser1.id }],
                        })];
                case 8:
                    event1 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("No initial triggers before no-show", function () { return sdk.api.endusers.getOne(enduser1.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } })];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.updateOne(event1.id, { noShowedAt: new Date() })];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Update to no-showed triggers automation (Any + By Title)", function () { return sdk.api.endusers.getOne(enduser1.id); }, { onResult: function (e) {
                                var _a;
                                return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 2
                                    && e.tags.includes('No-Show - Any')
                                    && e.tags.includes('No-Show - By Title');
                            }
                        })
                        // Test 2: Template-based no-show (should trigger Any + By Template)
                    ];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Template Test',
                            durationInMinutes: 30,
                            startTimeInMS: Date.now(),
                            attendees: [{ type: 'enduser', id: enduser2.id }],
                            templateId: template.id,
                        })];
                case 14:
                    event2 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.updateOne(event2.id, { noShowedAt: new Date() })];
                case 16:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 17:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Template-based no-showed appointment triggers automation (Any + By Template)", function () { return sdk.api.endusers.getOne(enduser2.id); }, { onResult: function (e) {
                                var _a;
                                return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 2
                                    && e.tags.includes('No-Show - Any')
                                    && e.tags.includes('No-Show - By Template');
                            }
                        })
                        // Test 3: Non-matching title only fires the "Any" trigger
                    ];
                case 18:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Other Title',
                            durationInMinutes: 30,
                            startTimeInMS: Date.now(),
                            attendees: [{ type: 'enduser', id: enduser3.id }],
                        })];
                case 19:
                    event3 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 20:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.updateOne(event3.id, { noShowedAt: new Date() })];
                case 21:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 22:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("No-show with non-matching title fires only the Any trigger", function () { return sdk.api.endusers.getOne(enduser3.id); }, { onResult: function (e) {
                                var _a;
                                return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 1
                                    && e.tags.includes('No-Show - Any');
                            }
                        })
                        // Cleanup
                    ];
                case 23:
                    _b.sent();
                    // Cleanup
                    return [4 /*yield*/, Promise.all([
                            sdk.api.automation_triggers.deleteOne(t1.id),
                            sdk.api.automation_triggers.deleteOne(t2.id),
                            sdk.api.automation_triggers.deleteOne(t3.id),
                            sdk.api.calendar_event_templates.deleteOne(template.id),
                            sdk.api.endusers.deleteOne(enduser1.id),
                            sdk.api.endusers.deleteOne(enduser2.id),
                            sdk.api.endusers.deleteOne(enduser3.id),
                            sdk.api.calendar_events.deleteOne(event1.id),
                            sdk.api.calendar_events.deleteOne(event2.id),
                            sdk.api.calendar_events.deleteOne(event3.id),
                        ])];
                case 24:
                    // Cleanup
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
};
exports.appointment_no_showed_trigger_tests = appointment_no_showed_trigger_tests;
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
                    return [4 /*yield*/, (0, exports.appointment_no_showed_trigger_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Appointment No-Showed trigger tests completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Appointment No-Showed trigger tests failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=appointment_no_showed_trigger.test.js.map