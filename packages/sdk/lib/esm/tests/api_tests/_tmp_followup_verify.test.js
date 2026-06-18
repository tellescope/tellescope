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
    var sdk, A, D, P, BA, BD, pass, fail, check, e8, o8, r8, afterClear, e9, r9, e10, r10, eb1, eb2, eb3, rb1, rb2, rb3;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0:
                sdk = new Session({ host: host });
                return [4 /*yield*/, sdk.authenticate(email, password)];
            case 1:
                _p.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Order Status Equals', info: { source: 'BlankSource' } },
                        action: { type: 'Add Tags', info: { tags: ['AnyOmit'] } }, status: 'Active', title: "blank"
                    })];
            case 2:
                A = _p.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Order Status Equals', info: { source: 'BlankSource', status: 'Shipped' } },
                        action: { type: 'Add Tags', info: { tags: ['ShippedOnly'] } }, status: 'Active', title: "shipped"
                    })];
            case 3:
                D = _p.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Order Status Equals', info: { source: 'BlankSource', status: '', protocols: ['Protocol-A'] } },
                        action: { type: 'Add Tags', info: { tags: ['BlankProtocol'] } }, status: 'Active', title: "protocol"
                    })];
            case 4:
                P = _p.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Order Status Equals', info: { source: 'BulkSource' } },
                        action: { type: 'Add Tags', info: { tags: ['BulkAny'] } }, status: 'Active', title: "bulk blank"
                    })];
            case 5:
                BA = _p.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Order Status Equals', info: { source: 'BulkSource', status: 'Shipped' } },
                        action: { type: 'Add Tags', info: { tags: ['BulkShipped'] } }, status: 'Active', title: "bulk shipped"
                    })];
            case 6:
                BD = _p.sent();
                pass = 0, fail = 0;
                check = function (n, c) { c ? (pass++, console.log("✅", n)) : (fail++, console.log("❌", n)); };
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 7:
                e8 = _p.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'Shipped', source: 'BlankSource', title: 'Title', externalId: 'nc-1', enduserId: e8.id })];
            case 8:
                o8 = _p.sent();
                return [4 /*yield*/, wait(700)];
            case 9:
                _p.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(e8.id)];
            case 10:
                r8 = _p.sent();
                check("Case8 setup: Shipped fired on create", !!(((_a = r8.tags) === null || _a === void 0 ? void 0 : _a.includes('AnyOmit')) && ((_b = r8.tags) === null || _b === void 0 ? void 0 : _b.includes('ShippedOnly'))));
                return [4 /*yield*/, sdk.api.endusers.updateOne(e8.id, { tags: [] }, { replaceObjectFields: true })];
            case 11:
                _p.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(e8.id)];
            case 12:
                afterClear = _p.sent();
                console.log("   [diag] tags right after clearing:", JSON.stringify(afterClear.tags));
                return [4 /*yield*/, sdk.api.enduser_orders.updateOne(o8.id, { tracking: 'tracking-123', externalId: 'nc-1b' })];
            case 13:
                _p.sent();
                return [4 /*yield*/, wait(700)];
            case 14:
                _p.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(e8.id)];
            case 15:
                r8 = _p.sent();
                console.log("   [diag] tags after no-status-change update:", JSON.stringify(r8.tags));
                check("Case8: update with unchanged status fires nothing", !((_c = r8.tags) === null || _c === void 0 ? void 0 : _c.length));
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 16:
                e9 = _p.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'whatever', source: 'BlankSource', title: 'Title', externalId: 'pr-1', enduserId: e9.id })];
            case 17:
                _p.sent();
                return [4 /*yield*/, wait(700)];
            case 18:
                _p.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(e9.id)];
            case 19:
                r9 = _p.sent();
                check("Case9: no protocol -> protocol trigger does NOT fire", !!(((_d = r9.tags) === null || _d === void 0 ? void 0 : _d.includes('AnyOmit')) && !((_e = r9.tags) === null || _e === void 0 ? void 0 : _e.includes('BlankProtocol'))));
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 20:
                e10 = _p.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'whatever', source: 'BlankSource', title: 'Title', externalId: 'pr-2', enduserId: e10.id, protocol: 'Protocol-A' })];
            case 21:
                _p.sent();
                return [4 /*yield*/, wait(700)];
            case 22:
                _p.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(e10.id)];
            case 23:
                r10 = _p.sent();
                check("Case9: matching protocol -> protocol trigger fires", !!(((_f = r10.tags) === null || _f === void 0 ? void 0 : _f.includes('AnyOmit')) && ((_g = r10.tags) === null || _g === void 0 ? void 0 : _g.includes('BlankProtocol'))));
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 24:
                eb1 = _p.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 25:
                eb2 = _p.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 26:
                eb3 = _p.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.createSome([
                        { status: 'StatusA', source: 'BulkSource', title: 'Title', externalId: 'bk-1', enduserId: eb1.id },
                        { status: 'Shipped', source: 'BulkSource', title: 'Title', externalId: 'bk-2', enduserId: eb2.id },
                        { status: 'StatusB', source: 'BulkSource', title: 'Title', externalId: 'bk-3', enduserId: eb3.id },
                    ])];
            case 27:
                _p.sent();
                return [4 /*yield*/, wait(900)];
            case 28:
                _p.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(eb1.id)];
            case 29:
                rb1 = _p.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(eb2.id)];
            case 30:
                rb2 = _p.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(eb3.id)];
            case 31:
                rb3 = _p.sent();
                check("Case7: bulk non-Shipped #1 -> BulkAny, !BulkShipped", !!(((_h = rb1.tags) === null || _h === void 0 ? void 0 : _h.includes('BulkAny')) && !((_j = rb1.tags) === null || _j === void 0 ? void 0 : _j.includes('BulkShipped'))));
                check("Case7: bulk Shipped -> BulkAny + BulkShipped", !!(((_k = rb2.tags) === null || _k === void 0 ? void 0 : _k.includes('BulkAny')) && ((_l = rb2.tags) === null || _l === void 0 ? void 0 : _l.includes('BulkShipped'))));
                check("Case7: bulk non-Shipped #2 -> BulkAny, !BulkShipped", !!(((_m = rb3.tags) === null || _m === void 0 ? void 0 : _m.includes('BulkAny')) && !((_o = rb3.tags) === null || _o === void 0 ? void 0 : _o.includes('BulkShipped'))));
                return [4 /*yield*/, Promise.all([
                        sdk.api.automation_triggers.deleteOne(A.id),
                        sdk.api.automation_triggers.deleteOne(D.id),
                        sdk.api.automation_triggers.deleteOne(P.id),
                        sdk.api.automation_triggers.deleteOne(BA.id),
                        sdk.api.automation_triggers.deleteOne(BD.id),
                        sdk.api.endusers.deleteOne(e8.id),
                        sdk.api.endusers.deleteOne(e9.id),
                        sdk.api.endusers.deleteOne(e10.id),
                        sdk.api.endusers.deleteOne(eb1.id),
                        sdk.api.endusers.deleteOne(eb2.id),
                        sdk.api.endusers.deleteOne(eb3.id),
                    ])];
            case 32:
                _p.sent();
                console.log("\n".concat(pass, " passed, ").concat(fail, " failed"));
                process.exit(fail ? 1 : 0);
                return [2 /*return*/];
        }
    });
}); };
run().catch(function (e) { console.error("HARNESS ERROR", e); process.exit(1); });
//# sourceMappingURL=_tmp_followup_verify.test.js.map