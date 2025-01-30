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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Checkbox = exports.Avatar = exports.Tooltip = exports.LinearProgress = exports.CircularProgress = exports.Typography = exports.IconButton = exports.Button = exports.KeyboardAvoidingTextField = exports.TextField = exports.BottomNavigation = exports.HoverPaper = exports.Paper = exports.Card = exports.Badge = exports.AccountIcon = exports.CallEndIcon = exports.MicrophoneOffIcon = exports.MicrophoneIcon = exports.VideoOffIcon = exports.VideoIcon = exports.NavigateNextIcon = exports.NavigateBeforeIcon = exports.SendIcon = exports.DownloadIcon = exports.MuiNaviveIcon = exports.convert_CSS_to_RNStyles = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = __importStar(require("react"));
var react_native_1 = require("react-native");
var react_native_paper_1 = require("react-native-paper");
var css_to_react_native_1 = __importDefault(require("css-to-react-native"));
var constants_1 = require("./constants");
var convert_CSS_to_RNStyles = function (style) {
    if (!style)
        return style;
    var input = [];
    for (var k in style) {
        var styling = style[k];
        if (!styling)
            continue;
        var smoothed = ((typeof styling === 'number') && k !== 'opacity'
            ? "".concat(styling, "px") // allow for plain number => pixel
            : styling.toString().replace('vh', '%').replace('vw', '%'));
        input.push([k, smoothed]);
    }
    try {
        return (0, css_to_react_native_1.default)(input);
    }
    catch (err) {
        return style;
    }
};
exports.convert_CSS_to_RNStyles = convert_CSS_to_RNStyles;
var MuiNaviveIcon = function (_a) {
    var icon = _a.icon, style = _a.style, size = _a.size, props = __rest(_a, ["icon", "style", "size"]);
    return ((0, jsx_runtime_1.jsx)(react_native_paper_1.Avatar.Icon, __assign({ icon: icon, style: (0, exports.convert_CSS_to_RNStyles)(style), size: size !== null && size !== void 0 ? size : constants_1.DEFAULT_ICON_SIZE }, props)));
};
exports.MuiNaviveIcon = MuiNaviveIcon;
var DownloadIcon = function (p) { return (0, jsx_runtime_1.jsx)(exports.MuiNaviveIcon, __assign({}, p, { icon: "download" })); };
exports.DownloadIcon = DownloadIcon;
var SendIcon = function (p) { return (0, jsx_runtime_1.jsx)(exports.MuiNaviveIcon, __assign({}, p, { icon: "send" })); };
exports.SendIcon = SendIcon;
var NavigateBeforeIcon = function (p) { return (0, jsx_runtime_1.jsx)(exports.MuiNaviveIcon, __assign({}, p, { icon: "chevron-left" })); };
exports.NavigateBeforeIcon = NavigateBeforeIcon;
var NavigateNextIcon = function (p) { return (0, jsx_runtime_1.jsx)(exports.MuiNaviveIcon, __assign({}, p, { icon: "chevron-right" })); };
exports.NavigateNextIcon = NavigateNextIcon;
var VideoIcon = function (p) { return (0, jsx_runtime_1.jsx)(exports.MuiNaviveIcon, __assign({}, p, { icon: "video" })); };
exports.VideoIcon = VideoIcon;
var VideoOffIcon = function (p) { return (0, jsx_runtime_1.jsx)(exports.MuiNaviveIcon, __assign({}, p, { icon: "video-off" })); };
exports.VideoOffIcon = VideoOffIcon;
var MicrophoneIcon = function (p) { return (0, jsx_runtime_1.jsx)(exports.MuiNaviveIcon, __assign({}, p, { icon: "microphone" })); };
exports.MicrophoneIcon = MicrophoneIcon;
var MicrophoneOffIcon = function (p) { return (0, jsx_runtime_1.jsx)(exports.MuiNaviveIcon, __assign({}, p, { icon: "microphone-off" })); };
exports.MicrophoneOffIcon = MicrophoneOffIcon;
var CallEndIcon = function (p) { return (0, jsx_runtime_1.jsx)(exports.MuiNaviveIcon, __assign({}, p, { icon: "phone-hangup" })); };
exports.CallEndIcon = CallEndIcon;
var AccountIcon = function (p) { return (0, jsx_runtime_1.jsx)(exports.MuiNaviveIcon, __assign({}, p, { icon: "account" })); };
exports.AccountIcon = AccountIcon;
var Badge = function (_a) {
    var children = _a.children, color = _a.color, style = _a.style, props = __rest(_a, ["children", "color", "style"]);
    return ((0, jsx_runtime_1.jsx)(react_native_paper_1.Badge, __assign({ style: __assign({ backgroundColor: color }, (0, exports.convert_CSS_to_RNStyles)(style)) }, props, { children: (typeof children === 'number' || typeof children === 'string')
            ? (children !== null && children !== void 0 ? children : ' ')
            : ' ' })));
};
exports.Badge = Badge;
var Card = function (_a) {
    var style = _a.style, flex = _a.flex, children = _a.children, props = __rest(_a, ["style", "flex", "children"]);
    return ((0, jsx_runtime_1.jsx)(react_native_paper_1.Card, __assign({ style: __assign(__assign({}, flex ? { display: 'flex', flexGrow: 1 } : {}), (0, exports.convert_CSS_to_RNStyles)(style)) }, props, { children: children })));
};
exports.Card = Card;
var Paper = function (_a) {
    var style = _a.style, flex = _a.flex, children = _a.children, elevation = _a.elevation, onClick = _a.onClick, onPress = _a.onPress, props = __rest(_a, ["style", "flex", "children", "elevation", "onClick", "onPress"]);
    return ((0, jsx_runtime_1.jsx)(react_native_paper_1.Surface, __assign({ style: __assign(__assign(__assign({}, flex ? { display: 'flex', flexGrow: 1 } : {}), (0, exports.convert_CSS_to_RNStyles)(style)), { elevation: elevation }) }, props, { children: onPress
            ? (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, __assign({ onPress: onPress, style: { display: 'flex', flex: 1 } }, { children: children }))
            : children })));
};
exports.Paper = Paper;
exports.HoverPaper = exports.Paper; // no support for 'hover' on mobile
var BottomNavigation = function (_a) {
    var initialPageIndex = _a.initialPageIndex, routes = _a.routes;
    var _b = React.useState(initialPageIndex !== null && initialPageIndex !== void 0 ? initialPageIndex : 0), index = _b[0], setIndex = _b[1];
    var routing = {};
    for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
        var r = routes_1[_i];
        routing[r.key] = r.Component;
    }
    return ((0, jsx_runtime_1.jsx)(react_native_paper_1.BottomNavigation, { navigationState: { index: index, routes: routes }, onIndexChange: setIndex, renderScene: react_native_paper_1.BottomNavigation.SceneMap(routing) }));
};
exports.BottomNavigation = BottomNavigation;
var TextField = function (_a) {
    var autoComplete = _a.autoComplete, _b = _a.autoCorrect, autoCorrect = _b === void 0 ? false : _b, _c = _a.autoCapitalize, autoCapitalize = _c === void 0 ? "none" : _c, variant = _a.variant, onChange = _a.onChange, type = _a.type, error = _a.error, helperText = _a.helperText, style = _a.style, size = _a.size, props = __rest(_a, ["autoComplete", "autoCorrect", "autoCapitalize", "variant", "onChange", "type", "error", "helperText", "style", "size"]);
    var theme = (0, react_native_paper_1.useTheme)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(react_native_paper_1.TextInput, __assign({ secureTextEntry: type === 'password', autoCorrect: autoCorrect, autoCapitalize: autoCapitalize, mode: variant === 'outlined' ? 'outlined' : 'flat', onChangeText: onChange, error: error, style: __assign({ height: size === 'small' ? 40 : undefined }, (0, exports.convert_CSS_to_RNStyles)(style)), autoComplete: undefined }, props)), helperText
                ? (0, jsx_runtime_1.jsx)(exports.Typography, __assign({ color: error ? 'error' : undefined }, { children: helperText }))
                : null] }));
};
exports.TextField = TextField;
var KeyboardAvoidingTextField = function (props) {
    return ((0, jsx_runtime_1.jsx)(react_native_1.KeyboardAvoidingView
    /* May want to change behavior depending on ios/android */
    , __assign({ 
        /* May want to change behavior depending on ios/android */
        behavior: react_native_1.Platform.OS === "ios" ? 'padding' : 'padding' }, { children: (0, jsx_runtime_1.jsx)(exports.TextField, __assign({}, props)) })));
};
exports.KeyboardAvoidingTextField = KeyboardAvoidingTextField;
var Button = function (_a) {
    var type = _a.type, variant = _a.variant, children = _a.children, color = _a.color, style = _a.style, onClick = _a.onClick, onPress = _a.onPress, props = __rest(_a, ["type", "variant", "children", "color", "style", "onClick", "onPress"]);
    return ((0, jsx_runtime_1.jsx)(react_native_paper_1.Button, __assign({}, props, { onPress: onPress !== null && onPress !== void 0 ? onPress : onClick, mode: variant, color: (color === null || color === void 0 ? void 0 : color.startsWith('#')) ? color : '', style: (0, exports.convert_CSS_to_RNStyles)(style) }, { children: children })));
};
exports.Button = Button;
var IconButton = function (_a) {
    var children = _a.children, color = _a.color, style = _a.style, onClick = _a.onClick, onPress = _a.onPress, disabled = _a.disabled, props = __rest(_a, ["children", "color", "style", "onClick", "onPress", "disabled"]);
    return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, __assign({ onPress: onPress !== null && onPress !== void 0 ? onPress : onClick, disabled: disabled }, { children: children })));
};
exports.IconButton = IconButton;
var Typography = function (_a) {
    var children = _a.children, onClick = _a.onClick, onPress = _a.onPress, color = _a.color, style = _a.style, props = __rest(_a, ["children", "onClick", "onPress", "color", "style"]);
    var colorStyle = { color: color ? (0, react_native_paper_1.useTheme)().colors[color] : undefined };
    return ((0, jsx_runtime_1.jsx)(react_native_paper_1.Text, __assign({}, props, { onPress: onPress !== null && onPress !== void 0 ? onPress : onClick, style: __assign(__assign({}, colorStyle), (0, exports.convert_CSS_to_RNStyles)(style)) }, { children: children })));
};
exports.Typography = Typography;
var CircularProgress = function (_a) {
    var style = _a.style, props = __rest(_a, ["style"]);
    return ((0, jsx_runtime_1.jsx)(react_native_paper_1.ActivityIndicator, __assign({}, props, { style: (0, exports.convert_CSS_to_RNStyles)(style) })));
};
exports.CircularProgress = CircularProgress;
var LinearProgress = function (_a) {
    var style = _a.style, props = __rest(_a, ["style"]);
    return ((0, jsx_runtime_1.jsx)(react_native_paper_1.ProgressBar, __assign({}, props, { indeterminate: true, style: (0, exports.convert_CSS_to_RNStyles)(style) })));
};
exports.LinearProgress = LinearProgress;
// nop 
var Tooltip = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    return children;
};
exports.Tooltip = Tooltip;
var Avatar = function (_a) {
    var size = _a.size, style = _a.style, letters = _a.letters, src = _a.src;
    return (letters ? ((0, jsx_runtime_1.jsx)(react_native_paper_1.Avatar.Text, { size: size, style: (0, exports.convert_CSS_to_RNStyles)(style), label: letters })) : (src
        ? (0, jsx_runtime_1.jsx)(react_native_paper_1.Avatar.Image, { size: size, style: (0, exports.convert_CSS_to_RNStyles)(style), source: { uri: src } })
        : (0, jsx_runtime_1.jsx)(exports.AccountIcon, { size: size })));
};
exports.Avatar = Avatar;
var Checkbox = function (_a) {
    var checked = _a.checked, props = __rest(_a, ["checked"]);
    return ((0, jsx_runtime_1.jsx)(react_native_paper_1.Checkbox, { status: checked ? 'checked' : 'unchecked' }));
};
exports.Checkbox = Checkbox;
//# sourceMappingURL=mui.native.js.map