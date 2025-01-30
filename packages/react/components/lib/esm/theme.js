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
import { jsx as _jsx } from "react/jsx-runtime";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { PRIMARY_HEX, SECONDARY_HEX, ERROR_HEX, WARNING_HEX, } from "@tellescope/constants";
var build_web_theme = function (theme) {
    var _a, _b, _c, _d;
    if (theme === void 0) { theme = {}; }
    return createTheme({
        palette: {
            primary: {
                main: (_a = theme.primary) !== null && _a !== void 0 ? _a : PRIMARY_HEX,
            },
            secondary: {
                main: (_b = theme.secondary) !== null && _b !== void 0 ? _b : SECONDARY_HEX,
            },
            error: {
                main: (_c = theme.error) !== null && _c !== void 0 ? _c : ERROR_HEX,
            },
            warning: {
                main: (_d = theme.warning) !== null && _d !== void 0 ? _d : WARNING_HEX,
            }
        },
    });
};
export var WithTheme = function (_a) {
    var children = _a.children, theme = _a.theme;
    return (_jsx(ThemeProvider, __assign({ theme: build_web_theme(theme) }, { children: children })));
};
//# sourceMappingURL=theme.js.map