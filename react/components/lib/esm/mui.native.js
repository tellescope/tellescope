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
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Avatar as MuiAvatar, ActivityIndicator as MuiCircularProgress, Badge as MuiBadge, BottomNavigation as MuiBottomNavigation, Card as MuiCard, TextInput as MuiTextField, Button as MuiButton, Surface as MuiPaper, Text as MuiText, ProgressBar as MuiLinearProgress, 
// TouchableRipple,
useTheme, Checkbox as CheckboxMui, } from 'react-native-paper';
import transform from 'css-to-react-native';
import { DEFAULT_ICON_SIZE } from "./constants";
export var convert_CSS_to_RNStyles = function (style) {
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
        return transform(input);
    }
    catch (err) {
        return style;
    }
};
export var MuiNaviveIcon = function (_a) {
    var icon = _a.icon, style = _a.style, size = _a.size, props = __rest(_a, ["icon", "style", "size"]);
    return (_jsx(MuiAvatar.Icon, __assign({ icon: icon, style: convert_CSS_to_RNStyles(style), size: size !== null && size !== void 0 ? size : DEFAULT_ICON_SIZE }, props)));
};
export var DownloadIcon = function (p) { return _jsx(MuiNaviveIcon, __assign({}, p, { icon: "download" })); };
export var SendIcon = function (p) { return _jsx(MuiNaviveIcon, __assign({}, p, { icon: "send" })); };
export var NavigateBeforeIcon = function (p) { return _jsx(MuiNaviveIcon, __assign({}, p, { icon: "chevron-left" })); };
export var NavigateNextIcon = function (p) { return _jsx(MuiNaviveIcon, __assign({}, p, { icon: "chevron-right" })); };
export var VideoIcon = function (p) { return _jsx(MuiNaviveIcon, __assign({}, p, { icon: "video" })); };
export var VideoOffIcon = function (p) { return _jsx(MuiNaviveIcon, __assign({}, p, { icon: "video-off" })); };
export var MicrophoneIcon = function (p) { return _jsx(MuiNaviveIcon, __assign({}, p, { icon: "microphone" })); };
export var MicrophoneOffIcon = function (p) { return _jsx(MuiNaviveIcon, __assign({}, p, { icon: "microphone-off" })); };
export var CallEndIcon = function (p) { return _jsx(MuiNaviveIcon, __assign({}, p, { icon: "phone-hangup" })); };
export var AccountIcon = function (p) { return _jsx(MuiNaviveIcon, __assign({}, p, { icon: "account" })); };
export var Badge = function (_a) {
    var children = _a.children, color = _a.color, style = _a.style, props = __rest(_a, ["children", "color", "style"]);
    return (_jsx(MuiBadge, __assign({ style: __assign({ backgroundColor: color }, convert_CSS_to_RNStyles(style)) }, props, { children: (typeof children === 'number' || typeof children === 'string')
            ? (children !== null && children !== void 0 ? children : ' ')
            : ' ' })));
};
export var Card = function (_a) {
    var style = _a.style, flex = _a.flex, children = _a.children, props = __rest(_a, ["style", "flex", "children"]);
    return (_jsx(MuiCard, __assign({ style: __assign(__assign({}, flex ? { display: 'flex', flexGrow: 1 } : {}), convert_CSS_to_RNStyles(style)) }, props, { children: children })));
};
export var Paper = function (_a) {
    var style = _a.style, flex = _a.flex, children = _a.children, elevation = _a.elevation, onClick = _a.onClick, onPress = _a.onPress, props = __rest(_a, ["style", "flex", "children", "elevation", "onClick", "onPress"]);
    return (_jsx(MuiPaper, __assign({ style: __assign(__assign(__assign({}, flex ? { display: 'flex', flexGrow: 1 } : {}), convert_CSS_to_RNStyles(style)), { elevation: elevation }) }, props, { children: onPress
            ? _jsx(TouchableOpacity, __assign({ onPress: onPress, style: { display: 'flex', flex: 1 } }, { children: children }))
            : children })));
};
export var HoverPaper = Paper; // no support for 'hover' on mobile
export var BottomNavigation = function (_a) {
    var initialPageIndex = _a.initialPageIndex, routes = _a.routes;
    var _b = React.useState(initialPageIndex !== null && initialPageIndex !== void 0 ? initialPageIndex : 0), index = _b[0], setIndex = _b[1];
    var routing = {};
    for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
        var r = routes_1[_i];
        routing[r.key] = r.Component;
    }
    return (_jsx(MuiBottomNavigation, { navigationState: { index: index, routes: routes }, onIndexChange: setIndex, renderScene: MuiBottomNavigation.SceneMap(routing) }));
};
export var TextField = function (_a) {
    var autoComplete = _a.autoComplete, _b = _a.autoCorrect, autoCorrect = _b === void 0 ? false : _b, _c = _a.autoCapitalize, autoCapitalize = _c === void 0 ? "none" : _c, variant = _a.variant, onChange = _a.onChange, type = _a.type, error = _a.error, helperText = _a.helperText, style = _a.style, size = _a.size, props = __rest(_a, ["autoComplete", "autoCorrect", "autoCapitalize", "variant", "onChange", "type", "error", "helperText", "style", "size"]);
    var theme = useTheme();
    return (_jsxs(_Fragment, { children: [_jsx(MuiTextField, __assign({ secureTextEntry: type === 'password', autoCorrect: autoCorrect, autoCapitalize: autoCapitalize, mode: variant === 'outlined' ? 'outlined' : 'flat', onChangeText: onChange, error: error, style: __assign({ height: size === 'small' ? 40 : undefined }, convert_CSS_to_RNStyles(style)), autoComplete: undefined }, props)), helperText
                ? _jsx(Typography, __assign({ color: error ? 'error' : undefined }, { children: helperText }))
                : null] }));
};
export var KeyboardAvoidingTextField = function (props) {
    return (_jsx(KeyboardAvoidingView
    /* May want to change behavior depending on ios/android */
    , __assign({ 
        /* May want to change behavior depending on ios/android */
        behavior: Platform.OS === "ios" ? 'padding' : 'padding' }, { children: _jsx(TextField, __assign({}, props)) })));
};
export var Button = function (_a) {
    var type = _a.type, variant = _a.variant, children = _a.children, color = _a.color, style = _a.style, onClick = _a.onClick, onPress = _a.onPress, props = __rest(_a, ["type", "variant", "children", "color", "style", "onClick", "onPress"]);
    return (_jsx(MuiButton, __assign({}, props, { onPress: onPress !== null && onPress !== void 0 ? onPress : onClick, mode: variant, color: (color === null || color === void 0 ? void 0 : color.startsWith('#')) ? color : '', style: convert_CSS_to_RNStyles(style) }, { children: children })));
};
export var IconButton = function (_a) {
    var children = _a.children, color = _a.color, style = _a.style, onClick = _a.onClick, onPress = _a.onPress, disabled = _a.disabled, props = __rest(_a, ["children", "color", "style", "onClick", "onPress", "disabled"]);
    return (_jsx(TouchableOpacity, __assign({ onPress: onPress !== null && onPress !== void 0 ? onPress : onClick, disabled: disabled }, { children: children })));
};
export var Typography = function (_a) {
    var children = _a.children, onClick = _a.onClick, onPress = _a.onPress, color = _a.color, style = _a.style, props = __rest(_a, ["children", "onClick", "onPress", "color", "style"]);
    var colorStyle = { color: color ? useTheme().colors[color] : undefined };
    return (_jsx(MuiText, __assign({}, props, { onPress: onPress !== null && onPress !== void 0 ? onPress : onClick, style: __assign(__assign({}, colorStyle), convert_CSS_to_RNStyles(style)) }, { children: children })));
};
export var CircularProgress = function (_a) {
    var style = _a.style, props = __rest(_a, ["style"]);
    return (_jsx(MuiCircularProgress, __assign({}, props, { style: convert_CSS_to_RNStyles(style) })));
};
export var LinearProgress = function (_a) {
    var style = _a.style, props = __rest(_a, ["style"]);
    return (_jsx(MuiLinearProgress, __assign({}, props, { indeterminate: true, style: convert_CSS_to_RNStyles(style) })));
};
// nop 
export var Tooltip = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    return children;
};
export var Avatar = function (_a) {
    var size = _a.size, style = _a.style, letters = _a.letters, src = _a.src;
    return (letters ? (_jsx(MuiAvatar.Text, { size: size, style: convert_CSS_to_RNStyles(style), label: letters })) : (src
        ? _jsx(MuiAvatar.Image, { size: size, style: convert_CSS_to_RNStyles(style), source: { uri: src } })
        : _jsx(AccountIcon, { size: size })));
};
export var Checkbox = function (_a) {
    var checked = _a.checked, props = __rest(_a, ["checked"]);
    return (_jsx(CheckboxMui, { status: checked ? 'checked' : 'unchecked' }));
};
//# sourceMappingURL=mui.native.js.map