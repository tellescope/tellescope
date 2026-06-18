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
    var sdk, Any, D, pass, fail, check, e, o, r;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                sdk = new Session({ host: host });
                return [4 /*yield*/, sdk.authenticate(email, password)];
            case 1:
                _f.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Order Status Equals', info: { source: 'BlankSource' } },
                        action: { type: 'Add Tags', info: { tags: ['AnyOmit'] } },
                        status: 'Active', title: "blank"
                    })];
            case 2:
                Any = _f.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Order Status Equals', info: { source: 'BlankSource', status: 'Shipped' } },
                        action: { type: 'Add Tags', info: { tags: ['ShippedOnly'] } },
                        status: 'Active', title: "status-specific"
                    })];
            case 3:
                D = _f.sent();
                pass = 0, fail = 0;
                check = function (n, c) { c ? (pass++, console.log("✅", n)) : (fail++, console.log("❌", n)); };
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 4:
                e = _f.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'Created', source: 'BlankSource', title: 'Title', externalId: 'nm-1', enduserId: e.id })];
            case 5:
                o = _f.sent();
                return [4 /*yield*/, wait(700)];
            case 6:
                _f.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(e.id)];
            case 7:
                r = _f.sent();
                check("create 'Created': ShippedOnly NOT fired", !!(((_a = r.tags) === null || _a === void 0 ? void 0 : _a.includes('AnyOmit')) && !((_b = r.tags) === null || _b === void 0 ? void 0 : _b.includes('ShippedOnly'))));
                return [4 /*yield*/, sdk.api.enduser_orders.updateOne(o.id, { status: 'Delivered', externalId: 'nm-1-delivered' })];
            case 8:
                _f.sent();
                return [4 /*yield*/, wait(700)];
            case 9:
                _f.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(e.id)];
            case 10:
                r = _f.sent();
                check("update->'Delivered' (non-match): ShippedOnly NOT fired, update processed", !!(((_c = r.tags) === null || _c === void 0 ? void 0 : _c.includes('AnyOmit')) && !((_d = r.tags) === null || _d === void 0 ? void 0 : _d.includes('ShippedOnly'))));
                return [4 /*yield*/, sdk.api.enduser_orders.updateOne(o.id, { status: 'Shipped', externalId: 'nm-1-shipped' })];
            case 11:
                _f.sent();
                return [4 /*yield*/, wait(700)];
            case 12:
                _f.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(e.id)];
            case 13:
                r = _f.sent();
                check("update->'Shipped' (match): ShippedOnly fires", !!((_e = r.tags) === null || _e === void 0 ? void 0 : _e.includes('ShippedOnly')));
                return [4 /*yield*/, Promise.all([
                        sdk.api.automation_triggers.deleteOne(Any.id),
                        sdk.api.automation_triggers.deleteOne(D.id),
                        sdk.api.endusers.deleteOne(e.id),
                    ])];
            case 14:
                _f.sent();
                console.log("\n".concat(pass, " passed, ").concat(fail, " failed"));
                process.exit(fail ? 1 : 0);
                return [2 /*return*/];
        }
    });
}); };
run().catch(function (e) { console.error("HARNESS ERROR", e); process.exit(1); });
//# sourceMappingURL=_tmp_nonmatch_verify.test.js.map