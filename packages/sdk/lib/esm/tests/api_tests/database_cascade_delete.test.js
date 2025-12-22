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
// Main test function that can be called independently or from main test suite
export var database_cascade_delete_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("Database Cascade Delete Tests");
                    // Test 1: Create database and records, then delete database and verify records are cascade deleted
                    return [4 /*yield*/, async_test('cascade delete - deleting database deletes all database_records', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var database, records, recordIds, recordsBefore, recordsAfter, _i, recordIds_1, recordId, err_1;
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, sdk.api.databases.createOne({
                                            title: "__Test__CascadeDelete_".concat(Date.now()),
                                            fields: [
                                                { type: 'Text', label: "Name" },
                                                { type: 'Number', label: "Age" },
                                            ],
                                        })
                                        // Create multiple database records
                                    ];
                                    case 1:
                                        database = _c.sent();
                                        return [4 /*yield*/, sdk.api.database_records.createSome([
                                                {
                                                    databaseId: database.id,
                                                    values: [
                                                        { type: 'Text', value: 'Alice', label: 'Name' },
                                                        { type: 'Number', value: 25, label: 'Age' },
                                                    ],
                                                },
                                                {
                                                    databaseId: database.id,
                                                    values: [
                                                        { type: 'Text', value: 'Bob', label: 'Name' },
                                                        { type: 'Number', value: 30, label: 'Age' },
                                                    ],
                                                },
                                                {
                                                    databaseId: database.id,
                                                    values: [
                                                        { type: 'Text', value: 'Charlie', label: 'Name' },
                                                        { type: 'Number', value: 35, label: 'Age' },
                                                    ],
                                                },
                                            ])];
                                    case 2:
                                        records = _c.sent();
                                        recordIds = records.created.map(function (r) { return r.id; });
                                        console.log("Created database ".concat(database.id, " with ").concat(recordIds.length, " records"));
                                        return [4 /*yield*/, sdk.api.database_records.getSome({ filter: { databaseId: database.id } })];
                                    case 3:
                                        recordsBefore = _c.sent();
                                        if (recordsBefore.length !== 3) {
                                            throw new Error("Expected 3 records before delete, got ".concat(recordsBefore.length));
                                        }
                                        console.log("Verified ".concat(recordsBefore.length, " records exist before deletion"));
                                        // Delete the database
                                        return [4 /*yield*/, sdk.api.databases.deleteOne(database.id)];
                                    case 4:
                                        // Delete the database
                                        _c.sent();
                                        console.log("Deleted database ".concat(database.id));
                                        // Wait a moment for cascade delete to propagate
                                        return [4 /*yield*/, wait(undefined, 500)
                                            // Verify all records were cascade deleted
                                        ];
                                    case 5:
                                        // Wait a moment for cascade delete to propagate
                                        _c.sent();
                                        return [4 /*yield*/, sdk.api.database_records.getSome({ filter: { databaseId: database.id } })];
                                    case 6:
                                        recordsAfter = _c.sent();
                                        if (recordsAfter.length !== 0) {
                                            throw new Error("Expected 0 records after cascade delete, got ".concat(recordsAfter.length));
                                        }
                                        console.log("\u2713 Verified all records were cascade deleted");
                                        _i = 0, recordIds_1 = recordIds;
                                        _c.label = 7;
                                    case 7:
                                        if (!(_i < recordIds_1.length)) return [3 /*break*/, 12];
                                        recordId = recordIds_1[_i];
                                        _c.label = 8;
                                    case 8:
                                        _c.trys.push([8, 10, , 11]);
                                        return [4 /*yield*/, sdk.api.database_records.getOne(recordId)];
                                    case 9:
                                        _c.sent();
                                        throw new Error("Record ".concat(recordId, " should have been deleted but was still found"));
                                    case 10:
                                        err_1 = _c.sent();
                                        if (!((_a = err_1.message) === null || _a === void 0 ? void 0 : _a.includes('Could not find')) && !((_b = err_1.message) === null || _b === void 0 ? void 0 : _b.includes('404'))) {
                                            throw new Error("Unexpected error fetching deleted record: ".concat(err_1.message));
                                        }
                                        return [3 /*break*/, 11];
                                    case 11:
                                        _i++;
                                        return [3 /*break*/, 7];
                                    case 12:
                                        console.log("\u2713 Verified individual record fetches return not found");
                                        return [2 /*return*/, true];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 2: Verify database with no records can be deleted without error
                    ];
                case 1:
                    // Test 1: Create database and records, then delete database and verify records are cascade deleted
                    _b.sent();
                    // Test 2: Verify database with no records can be deleted without error
                    return [4 /*yield*/, async_test('cascade delete - deleting empty database works', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var database, err_2;
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, sdk.api.databases.createOne({
                                            title: "__Test__EmptyDB_".concat(Date.now()),
                                            fields: [{ type: 'Text', label: "Field" }],
                                        })
                                        // Delete immediately without adding records
                                    ];
                                    case 1:
                                        database = _c.sent();
                                        // Delete immediately without adding records
                                        return [4 /*yield*/, sdk.api.databases.deleteOne(database.id)
                                            // Verify database is gone
                                        ];
                                    case 2:
                                        // Delete immediately without adding records
                                        _c.sent();
                                        _c.label = 3;
                                    case 3:
                                        _c.trys.push([3, 5, , 6]);
                                        return [4 /*yield*/, sdk.api.databases.getOne(database.id)];
                                    case 4:
                                        _c.sent();
                                        throw new Error('Database should have been deleted');
                                    case 5:
                                        err_2 = _c.sent();
                                        if (!((_a = err_2.message) === null || _a === void 0 ? void 0 : _a.includes('Could not find')) && !((_b = err_2.message) === null || _b === void 0 ? void 0 : _b.includes('404'))) {
                                            throw new Error("Unexpected error: ".concat(err_2.message));
                                        }
                                        return [3 /*break*/, 6];
                                    case 6: return [2 /*return*/, true];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 3: Verify records from other databases are not affected
                    ];
                case 2:
                    // Test 2: Verify database with no records can be deleted without error
                    _b.sent();
                    // Test 3: Verify records from other databases are not affected
                    return [4 /*yield*/, async_test('cascade delete - only affects records from deleted database', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var database1, database2, db2Record, db2RecordAfter;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.databases.createOne({
                                            title: "__Test__DB1_".concat(Date.now()),
                                            fields: [{ type: 'Text', label: "Value" }],
                                        })];
                                    case 1:
                                        database1 = _a.sent();
                                        return [4 /*yield*/, sdk.api.databases.createOne({
                                                title: "__Test__DB2_".concat(Date.now()),
                                                fields: [{ type: 'Text', label: "Value" }],
                                            })
                                            // Create records in both databases
                                        ];
                                    case 2:
                                        database2 = _a.sent();
                                        // Create records in both databases
                                        return [4 /*yield*/, sdk.api.database_records.createOne({
                                                databaseId: database1.id,
                                                values: [{ type: 'Text', value: 'DB1 Record', label: 'Value' }],
                                            })];
                                    case 3:
                                        // Create records in both databases
                                        _a.sent();
                                        return [4 /*yield*/, sdk.api.database_records.createOne({
                                                databaseId: database2.id,
                                                values: [{ type: 'Text', value: 'DB2 Record', label: 'Value' }],
                                            })
                                            // Delete database1
                                        ];
                                    case 4:
                                        db2Record = _a.sent();
                                        // Delete database1
                                        return [4 /*yield*/, sdk.api.databases.deleteOne(database1.id)];
                                    case 5:
                                        // Delete database1
                                        _a.sent();
                                        return [4 /*yield*/, wait(undefined, 500)
                                            // Verify database2's record still exists
                                        ];
                                    case 6:
                                        _a.sent();
                                        return [4 /*yield*/, sdk.api.database_records.getOne(db2Record.id)];
                                    case 7:
                                        db2RecordAfter = _a.sent();
                                        if (!db2RecordAfter) {
                                            throw new Error('Database2 record should still exist');
                                        }
                                        console.log("\u2713 Verified database2 record was not affected by database1 deletion");
                                        // Cleanup database2
                                        return [4 /*yield*/, sdk.api.databases.deleteOne(database2.id)];
                                    case 8:
                                        // Cleanup database2
                                        _a.sent();
                                        return [2 /*return*/, true];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })];
                case 3:
                    // Test 3: Verify records from other databases are not affected
                    _b.sent();
                    console.log("✅ All Database Cascade Delete tests passed!");
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
                    return [4 /*yield*/, database_cascade_delete_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Database cascade delete test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Database cascade delete test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=database_cascade_delete.test.js.map