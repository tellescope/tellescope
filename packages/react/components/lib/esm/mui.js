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
import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import MuiBadge from "@mui/material/Badge";
import MuiAvatar from "@mui/material/Avatar";
import MuiCard from "@mui/material/Card";
import MuiPaper from "@mui/material/Paper";
import MuiTextField from "@mui/material/TextField";
import MuiButton from "@mui/material/Button";
import MuiTypography from "@mui/material/Typography";
import MuiCircularProgress from "@mui/material/CircularProgress";
import MuiLinearProgress from "@mui/material/LinearProgress";
import MuiIconButton from "@mui/material/IconButton";
import MuiTooltip from "@mui/material/Tooltip";
import MuiModal from "@mui/material/Modal";
import MuiCheckbox from "@mui/material/Checkbox";
import { DEFAULT_ICON_SIZE } from "./constants";
import SendIconMui from "@mui/icons-material/Send";
import DownloadIconMui from "@mui/icons-material/Download";
import NavigateBeforeIconMui from '@mui/icons-material/NavigateBefore';
import NavigateNextIconMui from '@mui/icons-material/NavigateNext';
import VideoIconMui from '@mui/icons-material/Videocam';
import VideoOffIconMui from '@mui/icons-material/VideocamOff';
import MicrophoneIconMui from '@mui/icons-material/Mic';
import MicrophoneOffIconMui from '@mui/icons-material/MicOff';
import CallEndIconMui from '@mui/icons-material/CallEnd';
import AccountIconMui from '@mui/icons-material/Person';
import { defaultModalStyle } from "./controls";
import CancelIcon from '@mui/icons-material/Cancel';
import SortInactiveIcon from '@mui/icons-material/ArrowCircleDownOutlined';
import SortAscendingIcon from '@mui/icons-material/ExpandCircleDown';
import FilterIcon from '@mui/icons-material/FilterAltOutlined';
import FilterActiveIcon from '@mui/icons-material/FilterAlt';
var SortDescendingIcon = function (props) { return (_jsx(SortAscendingIcon, __assign({}, props, { style: __assign({ transform: 'rotate(180deg)' }, props === null || props === void 0 ? void 0 : props.style) }))); };
export { SortAscendingIcon, SortDescendingIcon, SortInactiveIcon, CancelIcon, FilterIcon, FilterActiveIcon };
import { Link as RouterLink, } from "react-router-dom";
import { FormControlLabel, Grid, Link as MuiLink } from "@mui/material";
import { query_string_for_object } from "@tellescope/utilities";
export var Link = function (_a) {
    var to = _a.to, query = _a.query, props = __rest(_a, ["to", "query"]);
    return _jsx(MuiLink, __assign({ to: "".concat(to, "/").concat(query ? query_string_for_object(query) : '') }, props, { component: RouterLink }));
};
var Icon = function (_a) {
    var Component = _a.Component, _b = _a.size, size = _b === void 0 ? DEFAULT_ICON_SIZE : _b, style = _a.style, props = __rest(_a, ["Component", "size", "style"]);
    return (_jsx(Component, { style: __assign({ fontSize: size }, style) }));
};
export var DownloadIcon = function (p) { return _jsx(Icon, __assign({}, p, { Component: DownloadIconMui })); };
export var SendIcon = function (p) { return _jsx(Icon, __assign({}, p, { Component: SendIconMui })); };
export var NavigateBeforeIcon = function (p) { return _jsx(Icon, __assign({}, p, { Component: NavigateBeforeIconMui })); };
export var NavigateNextIcon = function (p) { return _jsx(Icon, __assign({}, p, { Component: NavigateNextIconMui })); };
export var VideoIcon = function (p) { return _jsx(Icon, __assign({}, p, { Component: VideoIconMui })); };
export var VideoOffIcon = function (p) { return _jsx(Icon, __assign({}, p, { Component: VideoOffIconMui })); };
export var MicrophoneIcon = function (p) { return _jsx(Icon, __assign({}, p, { Component: MicrophoneIconMui })); };
export var MicrophoneOffIcon = function (p) { return _jsx(Icon, __assign({}, p, { Component: MicrophoneOffIconMui })); };
export var CallEndIcon = function (p) { return _jsx(Icon, __assign({}, p, { Component: CallEndIconMui })); };
export var AccountIcon = function (p) { return _jsx(Icon, __assign({}, p, { Component: AccountIconMui })); };
var muiColors = {
    inherit: 'inherit',
    default: 'default',
    primary: 'primary',
    secondary: 'secondary',
    error: 'error',
    info: 'info',
    success: 'success',
    warning: 'warning',
};
var resolve_color = function (c) { return muiColors[c]; };
export var Badge = function (_a) {
    var children = _a.children, style = _a.style, color = _a.color, props = __rest(_a, ["children", "style", "color"]);
    return (_jsx(MuiBadge, __assign({}, props, { style: __assign({ color: color }, style) }, { children: children })));
};
export var Card = function (_a) {
    var children = _a.children, style = _a.style, flex = _a.flex, props = __rest(_a, ["children", "style", "flex"]);
    return (_jsx(MuiCard, __assign({}, props, { style: __assign(__assign({}, flex ? { display: 'flex', flexGrow: 1 } : {}), style) }, { children: children })));
};
export var Paper = function (_a) {
    var children = _a.children, style = _a.style, flex = _a.flex, onClick = _a.onClick, onPress = _a.onPress, props = __rest(_a, ["children", "style", "flex", "onClick", "onPress"]);
    return (_jsx(MuiPaper, __assign({}, props, { style: __assign(__assign({}, flex ? { display: 'flex', flexGrow: 1 } : {}), style) }, { children: children })));
};
export var HoverPaper = function (_a) {
    var children = _a.children, sx = _a.sx, disabled = _a.disabled, _b = _a.baseElevation, baseElevation = _b === void 0 ? 2 : _b, _c = _a.hoveredElevation, hoveredElevation = _c === void 0 ? 5 : _c, props = __rest(_a, ["children", "sx", "disabled", "baseElevation", "hoveredElevation"]);
    var _d = useState(baseElevation), elevation = _d[0], setElevation = _d[1];
    return (_jsx(MuiPaper, __assign({ elevation: disabled ? baseElevation : elevation, sx: __assign({ cursor: !disabled ? 'pointer' : undefined }, sx), onMouseLeave: function () { return setElevation(baseElevation); }, onMouseEnter: function () { return setElevation(hoveredElevation); } }, props, { children: children })));
};
export var IconButton = function (_a) {
    var props = __rest(_a, []);
    return (_jsx(MuiIconButton, __assign({}, props)));
};
export var BottomNavigation = function (p) {
    throw new Error("Unimplemented"); // todo: implement me
};
export var TextField = function (_a) {
    var autoCapitalize = _a.autoCapitalize, autoCorrect = _a.autoCorrect, variant = _a.variant, onChange = _a.onChange, props = __rest(_a, ["autoCapitalize", "autoCorrect", "variant", "onChange"]);
    return _jsx(MuiTextField, __assign({ variant: variant === 'flat' ? 'filled' : variant, onChange: function (e) { return onChange === null || onChange === void 0 ? void 0 : onChange(e.target.value); } }, props));
};
export var KeyboardAvoidingTextField = TextField;
export var Button = function (_a) {
    var children = _a.children, onClick = _a.onClick, onPress = _a.onPress, props = __rest(_a, ["children", "onClick", "onPress"]);
    return _jsx(MuiButton, __assign({}, props, { onClick: onClick !== null && onClick !== void 0 ? onClick : onPress }, { children: children }));
};
export var Typography = function (_a) {
    var children = _a.children, onClick = _a.onClick, onPress = _a.onPress, _b = _a.component, component = _b === void 0 ? 'span' : _b, props = __rest(_a, ["children", "onClick", "onPress", "component"]);
    return _jsx(MuiTypography, __assign({ onClick: onClick !== null && onClick !== void 0 ? onClick : onPress, component: component }, props, { children: children }));
};
export var CircularProgress = function (_a) {
    var props = __rest(_a, []);
    return _jsx(MuiCircularProgress, __assign({}, props));
};
export var LinearProgress = function (_a) {
    var props = __rest(_a, []);
    return _jsx(MuiLinearProgress, __assign({}, props));
};
export var Tooltip = function (_a) {
    var tooltipSx = _a.tooltipSx, label = _a.label, placement = _a.placement, _b = _a.arrow, arrow = _b === void 0 ? true : _b, open = _a.open, style = _a.style, children = _a.children, enterDelay = _a.enterDelay, _c = _a.enterNextDelay, enterNextDelay = _c === void 0 ? enterDelay : _c, props = __rest(_a, ["tooltipSx", "label", "placement", "arrow", "open", "style", "children", "enterDelay", "enterNextDelay"]);
    return (_jsx(MuiTooltip, __assign({ title: label, placement: placement, arrow: arrow, open: open, enterDelay: enterDelay, enterNextDelay: enterNextDelay, style: __assign(__assign(__assign(__assign({}, placement === 'top' ? { top: 5 } : {}), placement === 'left' ? { left: 5 } : {}), placement === 'bottom' ? { bottom: 5 } : {}), placement === 'right' ? { right: 5 } : {}) }, props, { componentsProps: { tooltip: { sx: tooltipSx } } }, { children: _jsx("span", __assign({ style: style }, { children: children })) })));
};
export var Avatar = function (_a) {
    var size = _a.size, letters = _a.letters, style = _a.style, src = _a.src, props = __rest(_a, ["size", "letters", "style", "src"]);
    return (letters ? (_jsx(MuiAvatar, __assign({ style: size ? __assign({ height: size, width: size }, style) : style }, props, { children: letters }))) : (_jsx(MuiAvatar, __assign({ src: src, style: size ? __assign({ height: size, width: size }, style) : style }, props))));
};
export var Modal = function (_a) {
    var children = _a.children, onClick = _a.onClick, open = _a.open, setOpen = _a.setOpen, _b = _a.style, style = _b === void 0 ? defaultModalStyle : _b, zIndex = _a.zIndex;
    return (_jsx(MuiModal, __assign({ open: open, onClick: onClick, onClose: function () { return setOpen(false); }, style: { zIndex: zIndex } }, { children: _jsx(Grid, __assign({ container: true, style: style }, { children: children })) })));
};
export var Checkbox = function (_a) {
    var onChange = _a.onChange, label = _a.label, props = __rest(_a, ["onChange", "label"]);
    var checkbox = (_jsx(MuiCheckbox, __assign({}, props, { onChange: function () { return onChange === null || onChange === void 0 ? void 0 : onChange(!props.checked); } })));
    if (!label)
        return checkbox;
    return (_jsx(FormControlLabel, { control: checkbox, label: label }));
};
//# sourceMappingURL=mui.js.map