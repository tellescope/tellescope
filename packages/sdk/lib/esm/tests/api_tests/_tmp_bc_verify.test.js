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
// THROWAWAY verification harness — deleted after running.
import { Session } from "../../sdk";
var host = process.env.API_URL || 'http://localhost:8080';
var _a = [process.env.TEST_EMAIL, process.env.TEST_PASSWORD], email = _a[0], password = _a[1];
var wait = function (ms) { return new Promise(function (r) { return setTimeout(r, ms); }); };
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sdk, BA, BD, BD2, pass, fail, check, eb1, eb2, eb3, r1, r2, r3;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                sdk = new Session({ host: host });
                return [4 /*yield*/, sdk.authenticate(email, password)];
            case 1:
                _k.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Order Status Equals', info: { source: 'BulkSource' } },
                        action: { type: 'Add Tags', info: { tags: ['BulkAny'] } }, status: 'Active', title: "bulk blank"
                    })];
            case 2:
                BA = _k.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Order Status Equals', info: { source: 'BulkSource', status: 'Shipped' } },
                        action: { type: 'Add Tags', info: { tags: ['BulkShipped'] } }, status: 'Active', title: "bulk shipped"
                    })];
            case 3:
                BD = _k.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Order Status Equals', info: { source: 'BulkSource', status: 'NeverInBatch' } },
                        action: { type: 'Add Tags', info: { tags: ['BulkNever'] } }, status: 'Active', title: "bulk absent"
                    })];
            case 4:
                BD2 = _k.sent();
                pass = 0, fail = 0;
                check = function (n, c) { c ? (pass++, console.log("✅", n)) : (fail++, console.log("❌", n)); };
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 5:
                eb1 = _k.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 6:
                eb2 = _k.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 7:
                eb3 = _k.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.createSome([
                        { status: 'StatusA', source: 'BulkSource', title: 'Title', externalId: 'bc-1', enduserId: eb1.id },
                        { status: 'Shipped', source: 'BulkSource', title: 'Title', externalId: 'bc-2', enduserId: eb2.id },
                        { status: 'StatusB', source: 'BulkSource', title: 'Title', externalId: 'bc-3', enduserId: eb3.id },
                    ])];
            case 8:
                _k.sent();
                return [4 /*yield*/, wait(900)];
            case 9:
                _k.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(eb1.id)];
            case 10:
                r1 = _k.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(eb2.id)];
            case 11:
                r2 = _k.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(eb3.id)];
            case 12:
                r3 = _k.sent();
                check("eb1 StatusA: BulkAny, !BulkShipped, !BulkNever", !!(((_a = r1.tags) === null || _a === void 0 ? void 0 : _a.includes('BulkAny')) && !((_b = r1.tags) === null || _b === void 0 ? void 0 : _b.includes('BulkShipped')) && !((_c = r1.tags) === null || _c === void 0 ? void 0 : _c.includes('BulkNever'))));
                check("eb2 Shipped: BulkAny + BulkShipped, !BulkNever", !!(((_d = r2.tags) === null || _d === void 0 ? void 0 : _d.includes('BulkAny')) && ((_e = r2.tags) === null || _e === void 0 ? void 0 : _e.includes('BulkShipped')) && !((_f = r2.tags) === null || _f === void 0 ? void 0 : _f.includes('BulkNever'))));
                check("eb3 StatusB: BulkAny, !BulkShipped, !BulkNever", !!(((_g = r3.tags) === null || _g === void 0 ? void 0 : _g.includes('BulkAny')) && !((_h = r3.tags) === null || _h === void 0 ? void 0 : _h.includes('BulkShipped')) && !((_j = r3.tags) === null || _j === void 0 ? void 0 : _j.includes('BulkNever'))));
                return [4 /*yield*/, Promise.all([
                        sdk.api.automation_triggers.deleteOne(BA.id),
                        sdk.api.automation_triggers.deleteOne(BD.id),
                        sdk.api.automation_triggers.deleteOne(BD2.id),
                        sdk.api.endusers.deleteOne(eb1.id),
                        sdk.api.endusers.deleteOne(eb2.id),
                        sdk.api.endusers.deleteOne(eb3.id),
                    ])];
            case 13:
                _k.sent();
                console.log("\n".concat(pass, " passed, ").concat(fail, " failed"));
                process.exit(fail ? 1 : 0);
                return [2 /*return*/];
        }
    });
}); };
run().catch(function (e) { console.error("HARNESS ERROR", e); process.exit(1); });
//# sourceMappingURL=_tmp_bc_verify.test.js.map