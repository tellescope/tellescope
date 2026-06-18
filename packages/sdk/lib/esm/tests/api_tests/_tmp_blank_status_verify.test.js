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
// THROWAWAY verification harness — not part of the committed suite. Deleted after running.
import { Session } from "../../sdk";
var host = process.env.API_URL || 'http://localhost:8080';
var _a = [process.env.TEST_EMAIL, process.env.TEST_PASSWORD], email = _a[0], password = _a[1];
var wait = function (ms) { return new Promise(function (r) { return setTimeout(r, ms); }); };
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sdk, A, A2, B, D, pass, fail, check, e2, e2r, e3, e3r, e4, e4r, e5, e5r, e6, e6r, e7, o7, e7a, e7b;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    return __generator(this, function (_s) {
        switch (_s.label) {
            case 0:
                sdk = new Session({ host: host });
                return [4 /*yield*/, sdk.authenticate(email, password)];
            case 1:
                _s.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Order Status Equals', info: { source: 'BlankSource' } },
                        action: { type: 'Add Tags', info: { tags: ['AnyOmit'] } },
                        status: 'Active', title: "Blank status (omitted)"
                    })];
            case 2:
                A = _s.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Order Status Equals', info: { source: 'BlankSource', status: '' } },
                        action: { type: 'Add Tags', info: { tags: ['AnyEmpty'] } },
                        status: 'Active', title: "Blank status (empty)"
                    })];
            case 3:
                A2 = _s.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Order Status Equals', info: { source: 'BlankSource', status: '', skus: ['MATCH-SKU'] } },
                        action: { type: 'Add Tags', info: { tags: ['BlankWithSku'] } },
                        status: 'Active', title: "Blank + sku"
                    })];
            case 4:
                B = _s.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Order Status Equals', info: { source: 'BlankSource', status: 'Shipped' } },
                        action: { type: 'Add Tags', info: { tags: ['ShippedOnly'] } },
                        status: 'Active', title: "Status-specific"
                    })];
            case 5:
                D = _s.sent();
                pass = 0, fail = 0;
                check = function (name, cond) {
                    if (cond) {
                        pass++;
                        console.log("✅", name);
                    }
                    else {
                        fail++;
                        console.log("❌", name);
                    }
                };
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 6:
                e2 = _s.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'StatusOne', source: 'BlankSource', title: 'Title', externalId: 'tmp-1', enduserId: e2.id })];
            case 7:
                _s.sent();
                return [4 /*yield*/, wait(700)];
            case 8:
                _s.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(e2.id)];
            case 9:
                e2r = _s.sent();
                check("blank fires on arbitrary status; no false positives", !!(((_a = e2r.tags) === null || _a === void 0 ? void 0 : _a.includes('AnyOmit')) && ((_b = e2r.tags) === null || _b === void 0 ? void 0 : _b.includes('AnyEmpty')) && !((_c = e2r.tags) === null || _c === void 0 ? void 0 : _c.includes('BlankWithSku')) && !((_d = e2r.tags) === null || _d === void 0 ? void 0 : _d.includes('ShippedOnly'))));
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 10:
                e3 = _s.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'totally-arbitrary-xyz', source: 'BlankSource', title: 'Title', externalId: 'tmp-2', enduserId: e3.id })];
            case 11:
                _s.sent();
                return [4 /*yield*/, wait(700)];
            case 12:
                _s.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(e3.id)];
            case 13:
                e3r = _s.sent();
                check("blank fires on a different arbitrary status", !!(((_e = e3r.tags) === null || _e === void 0 ? void 0 : _e.includes('AnyOmit')) && ((_f = e3r.tags) === null || _f === void 0 ? void 0 : _f.includes('AnyEmpty'))));
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 14:
                e4 = _s.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'StatusOne', source: 'DifferentSource', title: 'Title', externalId: 'tmp-3', enduserId: e4.id })];
            case 15:
                _s.sent();
                return [4 /*yield*/, wait(700)];
            case 16:
                _s.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(e4.id)];
            case 17:
                e4r = _s.sent();
                check("source isolation (blank scoped to its source)", !!(!((_g = e4r.tags) === null || _g === void 0 ? void 0 : _g.includes('AnyOmit')) && !((_h = e4r.tags) === null || _h === void 0 ? void 0 : _h.includes('AnyEmpty'))));
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 18:
                e5 = _s.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'whatever', source: 'BlankSource', title: 'Title', externalId: 'tmp-4', enduserId: e5.id, sku: 'NOPE' })];
            case 19:
                _s.sent();
                return [4 /*yield*/, wait(700)];
            case 20:
                _s.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(e5.id)];
            case 21:
                e5r = _s.sent();
                check("blank + sku filter: no fire on mismatch", !!(((_j = e5r.tags) === null || _j === void 0 ? void 0 : _j.includes('AnyOmit')) && !((_k = e5r.tags) === null || _k === void 0 ? void 0 : _k.includes('BlankWithSku'))));
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 22:
                e6 = _s.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'whatever', source: 'BlankSource', title: 'Title', externalId: 'tmp-5', enduserId: e6.id, sku: 'MATCH-SKU' })];
            case 23:
                _s.sent();
                return [4 /*yield*/, wait(700)];
            case 24:
                _s.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(e6.id)];
            case 25:
                e6r = _s.sent();
                check("blank + sku filter: fires on match", !!(((_l = e6r.tags) === null || _l === void 0 ? void 0 : _l.includes('AnyOmit')) && ((_m = e6r.tags) === null || _m === void 0 ? void 0 : _m.includes('BlankWithSku'))));
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 26:
                e7 = _s.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'Created', source: 'BlankSource', title: 'Title', externalId: 'tmp-6', enduserId: e7.id })];
            case 27:
                o7 = _s.sent();
                return [4 /*yield*/, wait(700)];
            case 28:
                _s.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(e7.id)];
            case 29:
                e7a = _s.sent();
                check("create: blank fires, ShippedOnly not yet", !!(((_o = e7a.tags) === null || _o === void 0 ? void 0 : _o.includes('AnyOmit')) && !((_p = e7a.tags) === null || _p === void 0 ? void 0 : _p.includes('ShippedOnly'))));
                return [4 /*yield*/, sdk.api.enduser_orders.updateOne(o7.id, { status: 'Shipped', externalId: 'tmp-6-shipped' })];
            case 30:
                _s.sent();
                return [4 /*yield*/, wait(700)];
            case 31:
                _s.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(e7.id)];
            case 32:
                e7b = _s.sent();
                check("update to Shipped: blank still present + ShippedOnly fires", !!(((_q = e7b.tags) === null || _q === void 0 ? void 0 : _q.includes('AnyOmit')) && ((_r = e7b.tags) === null || _r === void 0 ? void 0 : _r.includes('ShippedOnly'))));
                return [4 /*yield*/, Promise.all([
                        sdk.api.automation_triggers.deleteOne(A.id),
                        sdk.api.automation_triggers.deleteOne(A2.id),
                        sdk.api.automation_triggers.deleteOne(B.id),
                        sdk.api.automation_triggers.deleteOne(D.id),
                        sdk.api.endusers.deleteOne(e2.id),
                        sdk.api.endusers.deleteOne(e3.id),
                        sdk.api.endusers.deleteOne(e4.id),
                        sdk.api.endusers.deleteOne(e5.id),
                        sdk.api.endusers.deleteOne(e6.id),
                        sdk.api.endusers.deleteOne(e7.id),
                    ])];
            case 33:
                _s.sent();
                console.log("\n".concat(pass, " passed, ").concat(fail, " failed"));
                process.exit(fail ? 1 : 0);
                return [2 /*return*/];
        }
    });
}); };
run().catch(function (e) { console.error("HARNESS ERROR", e); process.exit(1); });
//# sourceMappingURL=_tmp_blank_status_verify.test.js.map