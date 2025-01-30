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
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { PRIMARY_HEX, SECONDARY_HEX, ERROR_HEX, WARNING_HEX, } from "@tellescope/constants";
var build_native_theme = function (theme) {
    var _a, _b, _c, _d, _e;
    if (theme === void 0) { theme = {}; }
    return (__assign(__assign({}, DefaultTheme), { colors: __assign(__assign({}, DefaultTheme.colors), { primary: (_a = theme.primary) !== null && _a !== void 0 ? _a : PRIMARY_HEX, accent: (_b = theme.secondary) !== null && _b !== void 0 ? _b : SECONDARY_HEX, secondary: (_c = theme.secondary) !== null && _c !== void 0 ? _c : SECONDARY_HEX, error: (_d = theme.error) !== null && _d !== void 0 ? _d : ERROR_HEX, warning: (_e = theme.warning) !== null && _e !== void 0 ? _e : WARNING_HEX }) }));
};
export var WithTheme = function (_a) {
    var children = _a.children, theme = _a.theme;
    return (_jsx(PaperProvider, __assign({ theme: build_native_theme(theme) }, { children: children })));
};
//# sourceMappingURL=theme.native.js.map