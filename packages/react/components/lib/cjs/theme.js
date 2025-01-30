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
exports.WithTheme = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var styles_1 = require("@mui/material/styles");
var constants_1 = require("@tellescope/constants");
var build_web_theme = function (theme) {
    var _a, _b, _c, _d;
    if (theme === void 0) { theme = {}; }
    return (0, styles_1.createTheme)({
        palette: {
            primary: {
                main: (_a = theme.primary) !== null && _a !== void 0 ? _a : constants_1.PRIMARY_HEX,
            },
            secondary: {
                main: (_b = theme.secondary) !== null && _b !== void 0 ? _b : constants_1.SECONDARY_HEX,
            },
            error: {
                main: (_c = theme.error) !== null && _c !== void 0 ? _c : constants_1.ERROR_HEX,
            },
            warning: {
                main: (_d = theme.warning) !== null && _d !== void 0 ? _d : constants_1.WARNING_HEX,
            }
        },
    });
};
var WithTheme = function (_a) {
    var children = _a.children, theme = _a.theme;
    return ((0, jsx_runtime_1.jsx)(styles_1.ThemeProvider, __assign({ theme: build_web_theme(theme) }, { children: children })));
};
exports.WithTheme = WithTheme;
//# sourceMappingURL=theme.js.map