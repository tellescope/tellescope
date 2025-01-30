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
exports.Checkbox = exports.Modal = exports.Avatar = exports.Tooltip = exports.LinearProgress = exports.CircularProgress = exports.Typography = exports.Button = exports.KeyboardAvoidingTextField = exports.TextField = exports.BottomNavigation = exports.IconButton = exports.HoverPaper = exports.Paper = exports.Card = exports.Badge = exports.AccountIcon = exports.CallEndIcon = exports.MicrophoneOffIcon = exports.MicrophoneIcon = exports.VideoOffIcon = exports.VideoIcon = exports.NavigateNextIcon = exports.NavigateBeforeIcon = exports.SendIcon = exports.DownloadIcon = exports.Link = exports.FilterActiveIcon = exports.FilterIcon = exports.CancelIcon = exports.SortInactiveIcon = exports.SortDescendingIcon = exports.SortAscendingIcon = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var Badge_1 = __importDefault(require("@mui/material/Badge"));
var Avatar_1 = __importDefault(require("@mui/material/Avatar"));
var Card_1 = __importDefault(require("@mui/material/Card"));
var Paper_1 = __importDefault(require("@mui/material/Paper"));
var TextField_1 = __importDefault(require("@mui/material/TextField"));
var Button_1 = __importDefault(require("@mui/material/Button"));
var Typography_1 = __importDefault(require("@mui/material/Typography"));
var CircularProgress_1 = __importDefault(require("@mui/material/CircularProgress"));
var LinearProgress_1 = __importDefault(require("@mui/material/LinearProgress"));
var IconButton_1 = __importDefault(require("@mui/material/IconButton"));
var Tooltip_1 = __importDefault(require("@mui/material/Tooltip"));
var Modal_1 = __importDefault(require("@mui/material/Modal"));
var Checkbox_1 = __importDefault(require("@mui/material/Checkbox"));
var constants_1 = require("./constants");
var Send_1 = __importDefault(require("@mui/icons-material/Send"));
var Download_1 = __importDefault(require("@mui/icons-material/Download"));
var NavigateBefore_1 = __importDefault(require("@mui/icons-material/NavigateBefore"));
var NavigateNext_1 = __importDefault(require("@mui/icons-material/NavigateNext"));
var Videocam_1 = __importDefault(require("@mui/icons-material/Videocam"));
var VideocamOff_1 = __importDefault(require("@mui/icons-material/VideocamOff"));
var Mic_1 = __importDefault(require("@mui/icons-material/Mic"));
var MicOff_1 = __importDefault(require("@mui/icons-material/MicOff"));
var CallEnd_1 = __importDefault(require("@mui/icons-material/CallEnd"));
var Person_1 = __importDefault(require("@mui/icons-material/Person"));
var controls_1 = require("./controls");
var Cancel_1 = __importDefault(require("@mui/icons-material/Cancel"));
exports.CancelIcon = Cancel_1.default;
var ArrowCircleDownOutlined_1 = __importDefault(require("@mui/icons-material/ArrowCircleDownOutlined"));
exports.SortInactiveIcon = ArrowCircleDownOutlined_1.default;
var ExpandCircleDown_1 = __importDefault(require("@mui/icons-material/ExpandCircleDown"));
exports.SortAscendingIcon = ExpandCircleDown_1.default;
var FilterAltOutlined_1 = __importDefault(require("@mui/icons-material/FilterAltOutlined"));
exports.FilterIcon = FilterAltOutlined_1.default;
var FilterAlt_1 = __importDefault(require("@mui/icons-material/FilterAlt"));
exports.FilterActiveIcon = FilterAlt_1.default;
var SortDescendingIcon = function (props) { return ((0, jsx_runtime_1.jsx)(ExpandCircleDown_1.default, __assign({}, props, { style: __assign({ transform: 'rotate(180deg)' }, props === null || props === void 0 ? void 0 : props.style) }))); };
exports.SortDescendingIcon = SortDescendingIcon;
var react_router_dom_1 = require("react-router-dom");
var material_1 = require("@mui/material");
var utilities_1 = require("@tellescope/utilities");
var Link = function (_a) {
    var to = _a.to, query = _a.query, props = __rest(_a, ["to", "query"]);
    return (0, jsx_runtime_1.jsx)(material_1.Link, __assign({ to: "".concat(to, "/").concat(query ? (0, utilities_1.query_string_for_object)(query) : '') }, props, { component: react_router_dom_1.Link }));
};
exports.Link = Link;
var Icon = function (_a) {
    var Component = _a.Component, _b = _a.size, size = _b === void 0 ? constants_1.DEFAULT_ICON_SIZE : _b, style = _a.style, props = __rest(_a, ["Component", "size", "style"]);
    return ((0, jsx_runtime_1.jsx)(Component, { style: __assign({ fontSize: size }, style) }));
};
var DownloadIcon = function (p) { return (0, jsx_runtime_1.jsx)(Icon, __assign({}, p, { Component: Download_1.default })); };
exports.DownloadIcon = DownloadIcon;
var SendIcon = function (p) { return (0, jsx_runtime_1.jsx)(Icon, __assign({}, p, { Component: Send_1.default })); };
exports.SendIcon = SendIcon;
var NavigateBeforeIcon = function (p) { return (0, jsx_runtime_1.jsx)(Icon, __assign({}, p, { Component: NavigateBefore_1.default })); };
exports.NavigateBeforeIcon = NavigateBeforeIcon;
var NavigateNextIcon = function (p) { return (0, jsx_runtime_1.jsx)(Icon, __assign({}, p, { Component: NavigateNext_1.default })); };
exports.NavigateNextIcon = NavigateNextIcon;
var VideoIcon = function (p) { return (0, jsx_runtime_1.jsx)(Icon, __assign({}, p, { Component: Videocam_1.default })); };
exports.VideoIcon = VideoIcon;
var VideoOffIcon = function (p) { return (0, jsx_runtime_1.jsx)(Icon, __assign({}, p, { Component: VideocamOff_1.default })); };
exports.VideoOffIcon = VideoOffIcon;
var MicrophoneIcon = function (p) { return (0, jsx_runtime_1.jsx)(Icon, __assign({}, p, { Component: Mic_1.default })); };
exports.MicrophoneIcon = MicrophoneIcon;
var MicrophoneOffIcon = function (p) { return (0, jsx_runtime_1.jsx)(Icon, __assign({}, p, { Component: MicOff_1.default })); };
exports.MicrophoneOffIcon = MicrophoneOffIcon;
var CallEndIcon = function (p) { return (0, jsx_runtime_1.jsx)(Icon, __assign({}, p, { Component: CallEnd_1.default })); };
exports.CallEndIcon = CallEndIcon;
var AccountIcon = function (p) { return (0, jsx_runtime_1.jsx)(Icon, __assign({}, p, { Component: Person_1.default })); };
exports.AccountIcon = AccountIcon;
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
var Badge = function (_a) {
    var children = _a.children, style = _a.style, color = _a.color, props = __rest(_a, ["children", "style", "color"]);
    return ((0, jsx_runtime_1.jsx)(Badge_1.default, __assign({}, props, { style: __assign({ color: color }, style) }, { children: children })));
};
exports.Badge = Badge;
var Card = function (_a) {
    var children = _a.children, style = _a.style, flex = _a.flex, props = __rest(_a, ["children", "style", "flex"]);
    return ((0, jsx_runtime_1.jsx)(Card_1.default, __assign({}, props, { style: __assign(__assign({}, flex ? { display: 'flex', flexGrow: 1 } : {}), style) }, { children: children })));
};
exports.Card = Card;
var Paper = function (_a) {
    var children = _a.children, style = _a.style, flex = _a.flex, onClick = _a.onClick, onPress = _a.onPress, props = __rest(_a, ["children", "style", "flex", "onClick", "onPress"]);
    return ((0, jsx_runtime_1.jsx)(Paper_1.default, __assign({}, props, { style: __assign(__assign({}, flex ? { display: 'flex', flexGrow: 1 } : {}), style) }, { children: children })));
};
exports.Paper = Paper;
var HoverPaper = function (_a) {
    var children = _a.children, sx = _a.sx, disabled = _a.disabled, _b = _a.baseElevation, baseElevation = _b === void 0 ? 2 : _b, _c = _a.hoveredElevation, hoveredElevation = _c === void 0 ? 5 : _c, props = __rest(_a, ["children", "sx", "disabled", "baseElevation", "hoveredElevation"]);
    var _d = (0, react_1.useState)(baseElevation), elevation = _d[0], setElevation = _d[1];
    return ((0, jsx_runtime_1.jsx)(Paper_1.default, __assign({ elevation: disabled ? baseElevation : elevation, sx: __assign({ cursor: !disabled ? 'pointer' : undefined }, sx), onMouseLeave: function () { return setElevation(baseElevation); }, onMouseEnter: function () { return setElevation(hoveredElevation); } }, props, { children: children })));
};
exports.HoverPaper = HoverPaper;
var IconButton = function (_a) {
    var props = __rest(_a, []);
    return ((0, jsx_runtime_1.jsx)(IconButton_1.default, __assign({}, props)));
};
exports.IconButton = IconButton;
var BottomNavigation = function (p) {
    throw new Error("Unimplemented"); // todo: implement me
};
exports.BottomNavigation = BottomNavigation;
var TextField = function (_a) {
    var autoCapitalize = _a.autoCapitalize, autoCorrect = _a.autoCorrect, variant = _a.variant, onChange = _a.onChange, props = __rest(_a, ["autoCapitalize", "autoCorrect", "variant", "onChange"]);
    return (0, jsx_runtime_1.jsx)(TextField_1.default, __assign({ variant: variant === 'flat' ? 'filled' : variant, onChange: function (e) { return onChange === null || onChange === void 0 ? void 0 : onChange(e.target.value); } }, props));
};
exports.TextField = TextField;
exports.KeyboardAvoidingTextField = exports.TextField;
var Button = function (_a) {
    var children = _a.children, onClick = _a.onClick, onPress = _a.onPress, props = __rest(_a, ["children", "onClick", "onPress"]);
    return (0, jsx_runtime_1.jsx)(Button_1.default, __assign({}, props, { onClick: onClick !== null && onClick !== void 0 ? onClick : onPress }, { children: children }));
};
exports.Button = Button;
var Typography = function (_a) {
    var children = _a.children, onClick = _a.onClick, onPress = _a.onPress, _b = _a.component, component = _b === void 0 ? 'span' : _b, props = __rest(_a, ["children", "onClick", "onPress", "component"]);
    return (0, jsx_runtime_1.jsx)(Typography_1.default, __assign({ onClick: onClick !== null && onClick !== void 0 ? onClick : onPress, component: component }, props, { children: children }));
};
exports.Typography = Typography;
var CircularProgress = function (_a) {
    var props = __rest(_a, []);
    return (0, jsx_runtime_1.jsx)(CircularProgress_1.default, __assign({}, props));
};
exports.CircularProgress = CircularProgress;
var LinearProgress = function (_a) {
    var props = __rest(_a, []);
    return (0, jsx_runtime_1.jsx)(LinearProgress_1.default, __assign({}, props));
};
exports.LinearProgress = LinearProgress;
var Tooltip = function (_a) {
    var tooltipSx = _a.tooltipSx, label = _a.label, placement = _a.placement, _b = _a.arrow, arrow = _b === void 0 ? true : _b, open = _a.open, style = _a.style, children = _a.children, enterDelay = _a.enterDelay, _c = _a.enterNextDelay, enterNextDelay = _c === void 0 ? enterDelay : _c, props = __rest(_a, ["tooltipSx", "label", "placement", "arrow", "open", "style", "children", "enterDelay", "enterNextDelay"]);
    return ((0, jsx_runtime_1.jsx)(Tooltip_1.default, __assign({ title: label, placement: placement, arrow: arrow, open: open, enterDelay: enterDelay, enterNextDelay: enterNextDelay, style: __assign(__assign(__assign(__assign({}, placement === 'top' ? { top: 5 } : {}), placement === 'left' ? { left: 5 } : {}), placement === 'bottom' ? { bottom: 5 } : {}), placement === 'right' ? { right: 5 } : {}) }, props, { componentsProps: { tooltip: { sx: tooltipSx } } }, { children: (0, jsx_runtime_1.jsx)("span", __assign({ style: style }, { children: children })) })));
};
exports.Tooltip = Tooltip;
var Avatar = function (_a) {
    var size = _a.size, letters = _a.letters, style = _a.style, src = _a.src, props = __rest(_a, ["size", "letters", "style", "src"]);
    return (letters ? ((0, jsx_runtime_1.jsx)(Avatar_1.default, __assign({ style: size ? __assign({ height: size, width: size }, style) : style }, props, { children: letters }))) : ((0, jsx_runtime_1.jsx)(Avatar_1.default, __assign({ src: src, style: size ? __assign({ height: size, width: size }, style) : style }, props))));
};
exports.Avatar = Avatar;
var Modal = function (_a) {
    var children = _a.children, onClick = _a.onClick, open = _a.open, setOpen = _a.setOpen, _b = _a.style, style = _b === void 0 ? controls_1.defaultModalStyle : _b, zIndex = _a.zIndex;
    return ((0, jsx_runtime_1.jsx)(Modal_1.default, __assign({ open: open, onClick: onClick, onClose: function () { return setOpen(false); }, style: { zIndex: zIndex } }, { children: (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ container: true, style: style }, { children: children })) })));
};
exports.Modal = Modal;
var Checkbox = function (_a) {
    var onChange = _a.onChange, label = _a.label, props = __rest(_a, ["onChange", "label"]);
    var checkbox = ((0, jsx_runtime_1.jsx)(Checkbox_1.default, __assign({}, props, { onChange: function () { return onChange === null || onChange === void 0 ? void 0 : onChange(!props.checked); } })));
    if (!label)
        return checkbox;
    return ((0, jsx_runtime_1.jsx)(material_1.FormControlLabel, { control: checkbox, label: label }));
};
exports.Checkbox = Checkbox;
//# sourceMappingURL=mui.js.map