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
import { Session } from "../../sdk";
import { async_test, log_header, wait, } from "@tellescope/testing";
import { setup_tests } from "../setup";
var host = process.env.API_URL || 'http://localhost:8080';
export var custom_dashboards_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var basicDashboard, duplicateTitleDashboard, fullDashboard, dashboardWithUserIds, updatedTitle, dashboardWithNewTypes, read, list, dashboardWithComplexBlocks, dashboardWithBuiltInTypes, dashboardWithUnknownBlockField, updatedGridConfig, typedDashboard, updatedType, secondTypedDashboard, nonAdminList, restrictedRole, restrictedUserEmail, restrictedUser, sdkRestricted, _b, hiddenDashboard, orgWideDashboard, explicitFalseDashboard, assignedDashboard;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    log_header("Custom Dashboards");
                    return [4 /*yield*/, sdk.api.custom_dashboards.createOne({
                            title: "Test Dashboard",
                            blocks: [{ type: "Inbox", colSpan: 4 }],
                        })];
                case 1:
                    basicDashboard = _d.sent();
                    return [4 /*yield*/, async_test("Basic dashboard created correctly", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
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
                    _d.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.createOne({
                            title: "Test Dashboard",
                            blocks: [{ type: "Tickets", colSpan: 6 }],
                        })];
                case 3:
                    duplicateTitleDashboard = _d.sent();
                    return [4 /*yield*/, async_test("Duplicate title dashboard created successfully", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, duplicateTitleDashboard];
                        }); }); }, {
                            onResult: function (r) { return (r.title === "Test Dashboard"
                                && r.id !== basicDashboard.id); }
                        })
                        // Test 2: Create dashboard with all fields
                    ];
                case 4:
                    _d.sent();
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
                    fullDashboard = _d.sent();
                    return [4 /*yield*/, async_test("Full dashboard with all fields created correctly", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
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
                    _d.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.createOne({
                            title: "Dashboard With UserIds",
                            blocks: [{ type: "Inbox", colSpan: 12 }],
                            userIds: [sdk.userInfo.id],
                        })];
                case 7:
                    dashboardWithUserIds = _d.sent();
                    return [4 /*yield*/, async_test("Dashboard with userIds created correctly", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, dashboardWithUserIds];
                        }); }); }, {
                            onResult: function (r) { return (r.userIds !== undefined
                                && r.userIds.length === 1
                                && r.userIds[0] === sdk.userInfo.id); }
                        })
                        // Test 3: Update dashboard title only (blocks array updates append by default)
                    ];
                case 8:
                    _d.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.updateOne(basicDashboard.id, {
                            title: "Updated Dashboard",
                        })];
                case 9:
                    updatedTitle = _d.sent();
                    return [4 /*yield*/, async_test("Dashboard title updated correctly", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, updatedTitle];
                        }); }); }, {
                            onResult: function (r) { return (r.title === "Updated Dashboard"
                                && r.blocks.length === 1
                                && r.blocks[0].type === "Inbox"); }
                        })
                        // Test 3b: Create a new dashboard to test blocks with new block types
                    ];
                case 10:
                    _d.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.createOne({
                            title: "Dashboard With Custom Types",
                            blocks: [
                                { type: "Inbox", colSpan: 6 },
                                { type: "NewBlockType", info: { custom: "data", nested: { value: 123 } }, colSpan: 6 },
                            ],
                        })];
                case 11:
                    dashboardWithNewTypes = _d.sent();
                    return [4 /*yield*/, async_test("Dashboard with new block types created correctly", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, dashboardWithNewTypes];
                        }); }); }, {
                            onResult: function (r) { return (r.blocks.length === 2
                                && r.blocks[1].type === "NewBlockType"
                                && r.blocks[1].info !== undefined && r.blocks[1].info.custom === "data"); }
                        })
                        // Test 4: Read dashboard by ID
                    ];
                case 12:
                    _d.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.getOne(dashboardWithNewTypes.id)];
                case 13:
                    read = _d.sent();
                    return [4 /*yield*/, async_test("Dashboard read by ID correctly", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, read];
                        }); }); }, {
                            onResult: function (r) { return (r.id === dashboardWithNewTypes.id
                                && r.title === "Dashboard With Custom Types"); }
                        })
                        // Test 5: List dashboards
                    ];
                case 14:
                    _d.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.getSome({ filter: {} })];
                case 15:
                    list = _d.sent();
                    return [4 /*yield*/, async_test("Dashboard list returned", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, list];
                        }); }); }, { onResult: function (r) { return r.length >= 2; } })
                        // Test 6: Create dashboard with complex/arbitrary block info to verify permissive validation
                    ];
                case 16:
                    _d.sent();
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
                    dashboardWithComplexBlocks = _d.sent();
                    return [4 /*yield*/, async_test("Dashboard with complex block info created correctly", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, dashboardWithComplexBlocks];
                        }); }); }, {
                            onResult: function (r) { return (r.blocks[0].type === "ChartWidget"
                                && r.blocks[0].info !== undefined && r.blocks[0].info.chartType === "bar"
                                && r.blocks[0].info !== undefined && Array.isArray(r.blocks[0].info.colors) && r.blocks[0].info.colors.length === 2); }
                        })
                        // Test 6b: Create dashboard with every built-in block type (legacy renderer set)
                    ];
                case 18:
                    _d.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.createOne({
                            title: "Built-In Block Types Dashboard",
                            blocks: [
                                { type: "Inbox" },
                                { type: "Tickets" },
                                { type: "Team Chats" },
                                { type: "Upcoming Events" },
                                { type: "To-Dos" },
                                { type: "Database", info: { databaseId: "60398b0231a295e64f084fd9" } },
                            ],
                        })];
                case 19:
                    dashboardWithBuiltInTypes = _d.sent();
                    return [4 /*yield*/, async_test("Dashboard with all built-in block types created correctly", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, dashboardWithBuiltInTypes];
                        }); }); }, {
                            onResult: function (r) { return (r.blocks.length === 6
                                && r.blocks[0].type === "Inbox"
                                && r.blocks[1].type === "Tickets"
                                && r.blocks[2].type === "Team Chats"
                                && r.blocks[3].type === "Upcoming Events"
                                && r.blocks[4].type === "To-Dos"
                                && r.blocks[5].type === "Database"
                                && r.blocks[5].info !== undefined && r.blocks[5].info.databaseId === "60398b0231a295e64f084fd9"); }
                        })
                        // Test 6c: Unknown top-level block fields are stripped on save (params belong in info)
                    ];
                case 20:
                    _d.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.createOne({
                            title: "Unknown Block Field Dashboard",
                            blocks: [
                                { type: "Inbox", customTopLevel: "x", info: { kept: true } },
                            ],
                        })];
                case 21:
                    dashboardWithUnknownBlockField = _d.sent();
                    return [4 /*yield*/, async_test("Unknown top-level block fields stripped, info preserved", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, dashboardWithUnknownBlockField];
                        }); }); }, {
                            onResult: function (r) { return (r.blocks.length === 1
                                && r.blocks[0].customTopLevel === undefined
                                && r.blocks[0].info !== undefined && r.blocks[0].info.kept === true); }
                        })
                        // Test 7: Update gridConfig only
                    ];
                case 22:
                    _d.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.updateOne(dashboardWithNewTypes.id, {
                            gridConfig: { columns: 24, gap: 8 },
                        })];
                case 23:
                    updatedGridConfig = _d.sent();
                    return [4 /*yield*/, async_test("GridConfig updated correctly", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, updatedGridConfig];
                        }); }); }, {
                            onResult: function (r) { return (r.gridConfig !== undefined && r.gridConfig.columns === 24
                                && r.gridConfig !== undefined && r.gridConfig.gap === 8); }
                        })
                        // Test 7b: Create dashboard with top-level type field
                    ];
                case 24:
                    _d.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.createOne({
                            title: "Typed Dashboard",
                            type: "home",
                            blocks: [{ type: "Inbox", colSpan: 12 }],
                        })];
                case 25:
                    typedDashboard = _d.sent();
                    return [4 /*yield*/, async_test("Dashboard with top-level type created correctly", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, typedDashboard];
                        }); }); }, { onResult: function (r) { return r.type === "home"; } })
                        // Test 7c: Dashboards without type still work (backwards compatibility)
                    ];
                case 26:
                    _d.sent();
                    // Test 7c: Dashboards without type still work (backwards compatibility)
                    return [4 /*yield*/, async_test("Dashboard without type has undefined type", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, sdk.api.custom_dashboards.getOne(basicDashboard.id)];
                        }); }); }, { onResult: function (r) { return r.type === undefined; } })
                        // Test 7d: Update top-level type
                    ];
                case 27:
                    // Test 7c: Dashboards without type still work (backwards compatibility)
                    _d.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.updateOne(typedDashboard.id, {
                            type: "clinical",
                        })];
                case 28:
                    updatedType = _d.sent();
                    return [4 /*yield*/, async_test("Dashboard type updated correctly", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, updatedType];
                        }); }); }, { onResult: function (r) { return r.type === "clinical"; } })
                        // Test 7e: Filter dashboards by type
                    ];
                case 29:
                    _d.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.createOne({
                            title: "Second Typed Dashboard",
                            type: "clinical",
                            blocks: [{ type: "Tickets", colSpan: 12 }],
                        })];
                case 30:
                    secondTypedDashboard = _d.sent();
                    return [4 /*yield*/, async_test("Dashboards filtered by type via filter", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, sdk.api.custom_dashboards.getSome({ filter: { type: "clinical" } })];
                        }); }); }, {
                            onResult: function (r) { return (r.length === 2
                                && r.every(function (d) { return d.type === "clinical"; })); }
                        })
                        // Test 7f: Filter dashboards by type via mdbFilter
                    ];
                case 31:
                    _d.sent();
                    // Test 7f: Filter dashboards by type via mdbFilter
                    return [4 /*yield*/, async_test("Dashboards filtered by type via mdbFilter", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, sdk.api.custom_dashboards.getSome({ mdbFilter: { type: "clinical" } })];
                        }); }); }, {
                            onResult: function (r) { return (r.length === 2
                                && r.every(function (d) { return d.type === "clinical"; })); }
                        })
                        // Test 8: Non-admin can read all dashboards by default
                    ];
                case 32:
                    // Test 7f: Filter dashboards by type via mdbFilter
                    _d.sent();
                    return [4 /*yield*/, sdkNonAdmin.api.custom_dashboards.getSome({ filter: {} })];
                case 33:
                    nonAdminList = _d.sent();
                    return [4 /*yield*/, async_test("Non-admin can read all dashboards", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, nonAdminList];
                        }); }); }, { onResult: function (r) { return r.length >= 2; } })
                        // Test 9: visibleToAllUsers grants org-wide access to users without full read access
                    ];
                case 34:
                    _d.sent();
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.createOne({
                            role: 'Dashboard Default Access',
                            permissions: {
                                custom_dashboards: { read: 'Default', create: null, update: null, delete: null },
                            },
                        })];
                case 35:
                    restrictedRole = _d.sent();
                    restrictedUserEmail = 'dashboard.restricted.test@tellescope.com';
                    return [4 /*yield*/, sdk.api.users.getOne({ email: restrictedUserEmail }).catch(function () { return null; })]; // throws error on none found
                case 36:
                    restrictedUser = _d.sent() // throws error on none found
                    ;
                    if (!(restrictedUser && !restrictedUser.verifiedEmail)) return [3 /*break*/, 38];
                    return [4 /*yield*/, sdk.api.users.deleteOne(restrictedUser.id)];
                case 37:
                    _d.sent();
                    restrictedUser = null;
                    _d.label = 38;
                case 38:
                    if (!!restrictedUser) return [3 /*break*/, 40];
                    return [4 /*yield*/, sdk.api.users.createOne({ email: restrictedUserEmail, notificationEmailsDisabled: true, verifiedEmail: true })];
                case 39:
                    restrictedUser = _d.sent();
                    _d.label = 40;
                case 40: 
                // ensure role is set, in case GET returned a user without a role or with a different role
                return [4 /*yield*/, sdk.api.users.updateOne(restrictedUser.id, { roles: [restrictedRole.role] }, { replaceObjectFields: true })];
                case 41:
                    // ensure role is set, in case GET returned a user without a role or with a different role
                    _d.sent();
                    return [4 /*yield*/, wait(undefined, 2000)]; // role change triggers a logout
                case 42:
                    _d.sent(); // role change triggers a logout
                    _b = Session.bind;
                    _c = {
                        host: host
                    };
                    return [4 /*yield*/, sdk.api.users.generate_auth_token({ id: restrictedUser.id })];
                case 43:
                    sdkRestricted = new (_b.apply(Session, [void 0, (_c.authToken = (_d.sent()).authToken,
                            _c)]))();
                    return [4 /*yield*/, async_test('test_authenticated (restricted dashboard user)', sdkRestricted.test_authenticated, { expectedResult: 'Authenticated!' })];
                case 44:
                    _d.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.createOne({
                            title: "Hidden From Restricted",
                            blocks: [{ type: "Inbox", colSpan: 12 }],
                        })];
                case 45:
                    hiddenDashboard = _d.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.createOne({
                            title: "Org-Wide Dashboard",
                            visibleToAllUsers: true,
                            blocks: [{ type: "Inbox", colSpan: 12 }],
                        })];
                case 46:
                    orgWideDashboard = _d.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.createOne({
                            title: "Explicit False Dashboard",
                            visibleToAllUsers: false,
                            blocks: [{ type: "Inbox", colSpan: 12 }],
                        })];
                case 47:
                    explicitFalseDashboard = _d.sent();
                    return [4 /*yield*/, sdk.api.custom_dashboards.createOne({
                            title: "Assigned To Restricted",
                            userIds: [restrictedUser.id],
                            blocks: [{ type: "Inbox", colSpan: 12 }],
                        })];
                case 48:
                    assignedDashboard = _d.sent();
                    return [4 /*yield*/, async_test("Restricted user sees org-wide and assigned dashboards only", function () { return sdkRestricted.api.custom_dashboards.getSome({ filter: {} }); }, {
                            onResult: function (r) { return (!!r.find(function (d) { return d.id === orgWideDashboard.id; })
                                && !!r.find(function (d) { return d.id === assignedDashboard.id; })
                                && !r.find(function (d) { return d.id === hiddenDashboard.id; })
                                && !r.find(function (d) { return d.id === explicitFalseDashboard.id; })); }
                        })];
                case 49:
                    _d.sent();
                    return [4 /*yield*/, async_test("Restricted user can read org-wide dashboard by id", function () { return sdkRestricted.api.custom_dashboards.getOne(orgWideDashboard.id); }, { onResult: function (r) { return r.id === orgWideDashboard.id && r.visibleToAllUsers === true; } })];
                case 50:
                    _d.sent();
                    return [4 /*yield*/, async_test("Restricted user cannot read unshared dashboard by id", function () { return sdkRestricted.api.custom_dashboards.getOne(hiddenDashboard.id); }, { shouldError: true, onError: function () { return true; } })
                        // Toggling the flag on takes effect for the restricted user
                    ];
                case 51:
                    _d.sent();
                    // Toggling the flag on takes effect for the restricted user
                    return [4 /*yield*/, sdk.api.custom_dashboards.updateOne(hiddenDashboard.id, { visibleToAllUsers: true })];
                case 52:
                    // Toggling the flag on takes effect for the restricted user
                    _d.sent();
                    return [4 /*yield*/, async_test("Restricted user can read dashboard after visibleToAllUsers enabled", function () { return sdkRestricted.api.custom_dashboards.getOne(hiddenDashboard.id); }, { onResult: function (r) { return r.id === hiddenDashboard.id; } })
                        // Admin continues to see everything, including unshared dashboards
                    ];
                case 53:
                    _d.sent();
                    // Admin continues to see everything, including unshared dashboards
                    return [4 /*yield*/, async_test("Admin still sees explicit-false dashboard", function () { return sdk.api.custom_dashboards.getOne(explicitFalseDashboard.id); }, { onResult: function (r) { return r.id === explicitFalseDashboard.id; } })
                        // Cleanup
                    ];
                case 54:
                    // Admin continues to see everything, including unshared dashboards
                    _d.sent();
                    // Cleanup
                    return [4 /*yield*/, Promise.all([
                            sdk.api.custom_dashboards.deleteOne(hiddenDashboard.id),
                            sdk.api.custom_dashboards.deleteOne(orgWideDashboard.id),
                            sdk.api.custom_dashboards.deleteOne(explicitFalseDashboard.id),
                            sdk.api.custom_dashboards.deleteOne(assignedDashboard.id),
                            sdk.api.custom_dashboards.deleteOne(basicDashboard.id),
                            sdk.api.custom_dashboards.deleteOne(duplicateTitleDashboard.id),
                            sdk.api.custom_dashboards.deleteOne(fullDashboard.id),
                            sdk.api.custom_dashboards.deleteOne(dashboardWithUserIds.id),
                            sdk.api.custom_dashboards.deleteOne(dashboardWithNewTypes.id),
                            sdk.api.custom_dashboards.deleteOne(dashboardWithComplexBlocks.id),
                            sdk.api.custom_dashboards.deleteOne(dashboardWithBuiltInTypes.id),
                            sdk.api.custom_dashboards.deleteOne(dashboardWithUnknownBlockField.id),
                            sdk.api.custom_dashboards.deleteOne(typedDashboard.id),
                            sdk.api.custom_dashboards.deleteOne(secondTypedDashboard.id),
                        ])];
                case 55:
                    // Cleanup
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// Allow running this test file independently
if (require.main === module) {
    console.log("\uD83C\uDF10 Using API URL: ".concat(host));
    var sdk_1 = new Session({ host: host });
    var sdkNonAdmin_1 = new Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setup_tests(sdk_1, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, custom_dashboards_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
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