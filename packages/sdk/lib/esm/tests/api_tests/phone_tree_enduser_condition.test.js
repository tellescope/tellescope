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
import { assert, async_test, handleAnyError, log_header, } from "@tellescope/testing";
import { setup_tests } from "../setup";
var host = process.env.API_URL || 'http://localhost:8080';
var SPLIT_NODE_ID = 'enduser-condition-split-node';
var VIP_NODE_ID = 'vip-play-message-node';
var ELSE_NODE_ID = 'else-play-message-node';
var valid_condition_split_nodes = [
    {
        id: SPLIT_NODE_ID,
        action: {
            type: 'Enduser Condition Split',
            info: {
                branches: [
                    { name: 'VIP', enduserCondition: { $and: [{ condition: { tags: 'VIP' } }] } },
                    { name: 'Everyone Else' }, // no condition — catch-all
                ],
            },
        },
        events: [{ type: 'Start', parentId: SPLIT_NODE_ID, info: {} }],
        flowchartUI: { x: 0, y: 0 },
    },
    {
        id: VIP_NODE_ID,
        action: {
            type: 'Play Message',
            info: { playback: { type: 'Say', info: { script: 'Welcome, VIP caller' } } },
        },
        events: [{ type: 'On Condition Branch', parentId: SPLIT_NODE_ID, info: { branch: 'VIP' } }],
        flowchartUI: { x: -100, y: 100 },
    },
    {
        id: ELSE_NODE_ID,
        action: {
            type: 'Play Message',
            info: { playback: { type: 'Say', info: { script: 'Welcome' } } },
        },
        events: [{ type: 'On Condition Branch', parentId: SPLIT_NODE_ID, info: { branch: 'Everyone Else' } }],
        flowchartUI: { x: 100, y: 100 },
    },
];
export var phone_tree_enduser_condition_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var treeIds, tree, loaded, loadedSplit, conditionalSplitTree, _i, treeIds_1, id;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("Phone Tree Enduser Condition Split Tests");
                    treeIds = [];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 8, 13]);
                    return [4 /*yield*/, sdk.api.phone_trees.createOne({
                            number: '+15005550006',
                            isActive: false,
                            nodes: valid_condition_split_nodes,
                        })];
                case 2:
                    tree = _b.sent();
                    treeIds.push(tree.id);
                    assert(!!tree.id, 'failed to create tree with Enduser Condition Split', 'create tree with Enduser Condition Split');
                    return [4 /*yield*/, sdk.api.phone_trees.getOne(tree.id)];
                case 3:
                    loaded = _b.sent();
                    loadedSplit = loaded.nodes.find(function (n) { return n.action.type === 'Enduser Condition Split'; });
                    assert((loadedSplit === null || loadedSplit === void 0 ? void 0 : loadedSplit.action.type) === 'Enduser Condition Split'
                        && loadedSplit.action.info.branches.length === 2
                        && loadedSplit.action.info.branches[0].name === 'VIP'
                        && !!loadedSplit.action.info.branches[0].enduserCondition
                        && loadedSplit.action.info.branches[1].enduserCondition === undefined, 'branches did not round-trip', 'branches (conditions + catch-all) round-trip on read');
                    return [4 /*yield*/, sdk.api.phone_trees.createOne({
                            number: '+15005550006',
                            isActive: false,
                            nodes: [{
                                    id: 'conditional-split-node',
                                    // timezone + weeklyAvailabilities included to match the webapp's default Conditional Split shape
                                    action: { type: 'Conditional Split', info: { timezone: 'US/Eastern', weeklyAvailabilities: [], hasCareTeam: true } },
                                    events: [{ type: 'Start', parentId: 'conditional-split-node', info: {} }],
                                    flowchartUI: { x: 0, y: 0 },
                                }],
                        })];
                case 4:
                    conditionalSplitTree = _b.sent();
                    treeIds.push(conditionalSplitTree.id);
                    assert(!!conditionalSplitTree.id, 'failed to create Conditional Split tree', 'existing Conditional Split still saves (regression)');
                    // invalid: enduserCondition must be an object
                    return [4 /*yield*/, async_test("non-object enduserCondition is rejected", function () { return sdk.api.phone_trees.createOne({
                            number: '+15005550006',
                            isActive: false,
                            nodes: [{
                                    id: SPLIT_NODE_ID,
                                    action: {
                                        type: 'Enduser Condition Split',
                                        info: { branches: [{ name: 'Bad', enduserCondition: "not-an-object" }] },
                                    },
                                    events: [{ type: 'Start', parentId: SPLIT_NODE_ID, info: {} }],
                                    flowchartUI: { x: 0, y: 0 },
                                }],
                        }).then(function (t) { treeIds.push(t.id); return t; }); }, // cleanup if it unexpectedly passes
                        handleAnyError)
                        // invalid: branches must include a name
                    ];
                case 5:
                    // invalid: enduserCondition must be an object
                    _b.sent();
                    // invalid: branches must include a name
                    return [4 /*yield*/, async_test("branch without a name is rejected", function () { return sdk.api.phone_trees.createOne({
                            number: '+15005550006',
                            isActive: false,
                            nodes: [{
                                    id: SPLIT_NODE_ID,
                                    action: {
                                        type: 'Enduser Condition Split',
                                        info: { branches: [{ enduserCondition: {} }] },
                                    },
                                    events: [{ type: 'Start', parentId: SPLIT_NODE_ID, info: {} }],
                                    flowchartUI: { x: 0, y: 0 },
                                }],
                        }).then(function (t) { treeIds.push(t.id); return t; }); }, handleAnyError)
                        // invalid: On Condition Branch events must include a branch value
                    ];
                case 6:
                    // invalid: branches must include a name
                    _b.sent();
                    // invalid: On Condition Branch events must include a branch value
                    return [4 /*yield*/, async_test("On Condition Branch event without branch is rejected", function () { return sdk.api.phone_trees.createOne({
                            number: '+15005550006',
                            isActive: false,
                            nodes: valid_condition_split_nodes.map(function (n) { return (n.id !== VIP_NODE_ID
                                ? n
                                : __assign(__assign({}, n), { events: [{ type: 'On Condition Branch', parentId: SPLIT_NODE_ID, info: {} }] })); }),
                        }).then(function (t) { treeIds.push(t.id); return t; }); }, handleAnyError)];
                case 7:
                    // invalid: On Condition Branch events must include a branch value
                    _b.sent();
                    return [3 /*break*/, 13];
                case 8:
                    _i = 0, treeIds_1 = treeIds;
                    _b.label = 9;
                case 9:
                    if (!(_i < treeIds_1.length)) return [3 /*break*/, 12];
                    id = treeIds_1[_i];
                    return [4 /*yield*/, sdk.api.phone_trees.deleteOne(id).catch(console.error)];
                case 10:
                    _b.sent();
                    _b.label = 11;
                case 11:
                    _i++;
                    return [3 /*break*/, 9];
                case 12: return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    });
};
// Allow running this test file independently
if (require.main === module) {
    console.log("Using API URL: ".concat(host));
    var sdk_1 = new Session({ host: host });
    var sdkNonAdmin_1 = new Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setup_tests(sdk_1, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, phone_tree_enduser_condition_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Phone tree enduser condition test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Phone tree enduser condition test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=phone_tree_enduser_condition.test.js.map