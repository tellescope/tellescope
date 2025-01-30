"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicEndpoints = void 0;
var session_1 = require("./session");
var PublicEndpoints = function (o) {
    var POST = new session_1.Session(__assign(__assign({}, o), { type: 'public' })).POST; // no need to authenticate 
    return {
        login_enduser: function (a) { return (POST('/v1/login-enduser', a)); },
    };
};
exports.PublicEndpoints = PublicEndpoints;
//# sourceMappingURL=public.js.map