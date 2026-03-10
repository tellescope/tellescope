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
exports.custom_dashboards_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
var custom_dashboards_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var basicDashboard, duplicateTitleDashboard, fullDashboard, dashboardWithUserIds, updatedTitle, dashboardWithNewTypes, read, list, dashboardWithComplexBlocks, updatedGridConfig, nonAdminList;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("Custom Dashboards");
                    return [4 /*yield*/, sdk.api.custom_dashboards.createOne({
                            title: "Test Dashboard",
                            blocks: [{ type: "Inbox", colSpan: 4 }],
                        })];
                case 1:
                    basicDashboard = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Basic dashboard created correctly", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, basicDashboard];
                        }); }); }, {
                            onResult: function (r) { return (r.title === "Test Dashboard"
                                && r.blocks.length === 1
                                && r.blocks[0].type === "Inbox"
                                && r.blocks[0].colSpan === 4); }
                        })
                        // Test 1b: Duplicate titles are allowed
                    ];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.createOne({
                            title: "Test Dashboard",
                            blocks: [{ type: "Tickets", colSpan: 6 }],
                        })];
                case 3:
                    duplicateTitleDashboard = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Duplicate title dashboard created successfully", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, duplicateTitleDashboard];
                        }); }); }, {
                            onResult: function (r) { return (r.title === "Test Dashboard"
                                && r.id !== basicDashboard.id); }
                        })
                        // Test 2: Create dashboard with all fields
                    ];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.createOne({
                            title: "Full Dashboard",
                            description: "A complete dashboard with all options",
                            blocks: [
                                { type: "Inbox", info: { showUnread: true }, colSpan: 4, rowSpan: 2 },
                                { type: "Tickets", info: { status: "open" }, colSpan: 4, rowSpan: 1 },
                                {
                                    type: "CustomWidget",
                                    info: { widgetId: "xyz", nestedConfig: { foo: "bar" } },
                                    colSpan: 4,
                                    responsive: {
                                        sm: { colSpan: 12, hidden: false },
                                        md: { colSpan: 6 },
                                        lg: { colSpan: 4 }
                                    },
                                    style: { backgroundColor: "#ffffff", borderRadius: 8 }
                                },
                            ],
                            defaultForRoles: ["Admin", "Manager"],
                            hiddenFromRoles: ["Guest"],
                            defaultForUserIds: [],
                            gridConfig: { columns: 12, gap: 16, rowHeight: 100 },
                        })];
                case 5:
                    fullDashboard = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Full dashboard with all fields created correctly", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, fullDashboard];
                        }); }); }, {
                            onResult: function (r) { return (r.blocks.length === 3
                                && r.gridConfig !== undefined && r.gridConfig.columns === 12
                                && r.gridConfig !== undefined && r.gridConfig.gap === 16
                                && r.defaultForRoles !== undefined && r.defaultForRoles.includes("Admin")
                                && r.blocks[2].responsive !== undefined && r.blocks[2].responsive.sm !== undefined && r.blocks[2].responsive.sm.colSpan === 12
                                && r.blocks[0].info !== undefined && r.blocks[0].info.showUnread === true); }
                        })
                        // Test 2b: Create dashboard with userIds
                    ];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.createOne({
                            title: "Dashboard With UserIds",
                            blocks: [{ type: "Inbox", colSpan: 12 }],
                            userIds: [sdk.userInfo.id],
                        })];
                case 7:
                    dashboardWithUserIds = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Dashboard with userIds created correctly", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, dashboardWithUserIds];
                        }); }); }, {
                            onResult: function (r) { return (r.userIds !== undefined
                                && r.userIds.length === 1
                                && r.userIds[0] === sdk.userInfo.id); }
                        })
                        // Test 3: Update dashboard title only (blocks array updates append by default)
                    ];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.updateOne(basicDashboard.id, {
                            title: "Updated Dashboard",
                        })];
                case 9:
                    updatedTitle = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Dashboard title updated correctly", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, updatedTitle];
                        }); }); }, {
                            onResult: function (r) { return (r.title === "Updated Dashboard"
                                && r.blocks.length === 1
                                && r.blocks[0].type === "Inbox"); }
                        })
                        // Test 3b: Create a new dashboard to test blocks with new block types
                    ];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.createOne({
                            title: "Dashboard With Custom Types",
                            blocks: [
                                { type: "Inbox", colSpan: 6 },
                                { type: "NewBlockType", info: { custom: "data", nested: { value: 123 } }, colSpan: 6 },
                            ],
                        })];
                case 11:
                    dashboardWithNewTypes = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Dashboard with new block types created correctly", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, dashboardWithNewTypes];
                        }); }); }, {
                            onResult: function (r) { return (r.blocks.length === 2
                                && r.blocks[1].type === "NewBlockType"
                                && r.blocks[1].info !== undefined && r.blocks[1].info.custom === "data"); }
                        })
                        // Test 4: Read dashboard by ID
                    ];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.getOne(dashboardWithNewTypes.id)];
                case 13:
                    read = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Dashboard read by ID correctly", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, read];
                        }); }); }, {
                            onResult: function (r) { return (r.id === dashboardWithNewTypes.id
                                && r.title === "Dashboard With Custom Types"); }
                        })
                        // Test 5: List dashboards
                    ];
                case 14:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.getSome({ filter: {} })];
                case 15:
                    list = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Dashboard list returned", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, list];
                        }); }); }, { onResult: function (r) { return r.length >= 2; } })
                        // Test 6: Create dashboard with complex/arbitrary block info to verify permissive validation
                    ];
                case 16:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.createOne({
                            title: "Complex Blocks Dashboard",
                            blocks: [
                                {
                                    type: "ChartWidget",
                                    info: {
                                        chartType: "bar",
                                        dataSource: "appointments",
                                        dateRange: "30d",
                                        colors: ["#ff0000", "#00ff00"],
                                        aggregation: { field: "status", method: "count" }
                                    },
                                    colSpan: 8,
                                    rowSpan: 2,
                                },
                            ],
                        })];
                case 17:
                    dashboardWithComplexBlocks = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Dashboard with complex block info created correctly", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, dashboardWithComplexBlocks];
                        }); }); }, {
                            onResult: function (r) { return (r.blocks[0].type === "ChartWidget"
                                && r.blocks[0].info !== undefined && r.blocks[0].info.chartType === "bar"
                                && r.blocks[0].info !== undefined && Array.isArray(r.blocks[0].info.colors) && r.blocks[0].info.colors.length === 2); }
                        })
                        // Test 7: Update gridConfig only
                    ];
                case 18:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.updateOne(dashboardWithNewTypes.id, {
                            gridConfig: { columns: 24, gap: 8 },
                        })];
                case 19:
                    updatedGridConfig = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("GridConfig updated correctly", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, updatedGridConfig];
                        }); }); }, {
                            onResult: function (r) { return (r.gridConfig !== undefined && r.gridConfig.columns === 24
                                && r.gridConfig !== undefined && r.gridConfig.gap === 8); }
                        })
                        // Test 8: Non-admin can read all dashboards by default
                    ];
                case 20:
                    _b.sent();
                    return [4 /*yield*/, sdkNonAdmin.api.custom_dashboards.getSome({ filter: {} })];
                case 21:
                    nonAdminList = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Non-admin can read all dashboards", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, nonAdminList];
                        }); }); }, { onResult: function (r) { return r.length >= 2; } })
                        // Cleanup
                    ];
                case 22:
                    _b.sent();
                    // Cleanup
                    return [4 /*yield*/, Promise.all([
                            sdk.api.custom_dashboards.deleteOne(basicDashboard.id),
                            sdk.api.custom_dashboards.deleteOne(duplicateTitleDashboard.id),
                            sdk.api.custom_dashboards.deleteOne(fullDashboard.id),
                            sdk.api.custom_dashboards.deleteOne(dashboardWithUserIds.id),
                            sdk.api.custom_dashboards.deleteOne(dashboardWithNewTypes.id),
                            sdk.api.custom_dashboards.deleteOne(dashboardWithComplexBlocks.id),
                        ])];
                case 23:
                    // Cleanup
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
};
exports.custom_dashboards_tests = custom_dashboards_tests;
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
                    return [4 /*yield*/, (0, exports.custom_dashboards_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Custom dashboards test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Custom dashboards test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=custom_dashboards.test.js.map