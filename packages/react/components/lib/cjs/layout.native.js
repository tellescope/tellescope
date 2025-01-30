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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollingList = exports.WithHover = exports.List = exports.SUPPORTS_FORMS = exports.Form = exports.Flex = exports.Video = exports.Image = exports.WithHTMLFormContext = exports.IN_REACT_WEB = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var layout_js_1 = require("./layout.js");
var mui_1 = require("./mui");
var mui_native_1 = require("./mui.native");
// @ts-ignore
var react_native_video_1 = __importDefault(require("react-native-video"));
exports.IN_REACT_WEB = false;
// need to export for consistency with native
exports.WithHTMLFormContext = react_1.default.createContext({ loading: false });
var Image = function (_a) {
    var src = _a.src, alt = _a.alt, props = __rest(_a, ["src", "alt"]);
    return ((0, jsx_runtime_1.jsx)(react_native_1.Image, { accessibilityLabel: alt, source: { uri: src }, resizeMode: "contain", style: props }));
};
exports.Image = Image;
var Video = function (_a) {
    var style = _a.style, src = _a.src, dimensions = _a.dimensions, props = __rest(_a, ["style", "src", "dimensions"]);
    return ((0, jsx_runtime_1.jsx)(react_native_video_1.default, __assign({ source: { uri: src }, controls: true, paused: true, ref: function (ref) {
            if (_this) {
                // @ts-ignore
                _this.player = ref;
            }
        } }, props, { style: (0, mui_native_1.convert_CSS_to_RNStyles)(__assign(__assign({}, style), dimensions)) })));
};
exports.Video = Video;
var Flex = function (props) {
    var _a, _b, _c, _d, _e, _f;
    var direction = (0, layout_js_1.resolve_direction_for_props)(props.row, props.column);
    var flexDirection = (0, layout_js_1.compute_flex_direction_with_props)(direction, props.reverse);
    var flex = (_a = props.flex) !== null && _a !== void 0 ? _a : 0;
    var children = (_b = props.children) !== null && _b !== void 0 ? _b : null;
    var flexShrink = (_c = props.shrink) !== null && _c !== void 0 ? _c : 1; // same default as web
    var wrap = (_d = props.wrap) !== null && _d !== void 0 ? _d : 'wrap';
    var handler = (_e = props.onPress) !== null && _e !== void 0 ? _e : props.onClick;
    var style = __assign({ alignItems: props.alignItems, alignContent: (_f = props.alignContent) !== null && _f !== void 0 ? _f : 'stretch', justifyContent: props.justifyContent, alignSelf: props.alignSelf, flex: flex, flexDirection: flexDirection, flexWrap: wrap, display: 'flex', flexShrink: flexShrink }, (0, mui_native_1.convert_CSS_to_RNStyles)(props.style));
    if (handler)
        return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, __assign({ onPress: handler, style: style }, { children: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children }) })));
    return ((0, jsx_runtime_1.jsx)(react_native_1.View, __assign({ style: style }, { children: children })));
};
exports.Flex = Flex;
var Form = function (_a) {
    var children = _a.children, style = _a.style;
    return (style
        ? (0, jsx_runtime_1.jsx)(react_native_1.View, __assign({ style: (0, mui_native_1.convert_CSS_to_RNStyles)(style) }, { children: children }))
        : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children }));
};
exports.Form = Form;
exports.SUPPORTS_FORMS = false;
var List = function (_a) {
    var items = _a.items, emptyComponent = _a.emptyComponent, render = _a.render, onClick = _a.onClick, onPress = _a.onPress, reverse = _a.reverse, style = _a.style;
    if (items.length === 0 && emptyComponent)
        return emptyComponent;
    return ((0, jsx_runtime_1.jsx)(react_native_1.FlatList, { inverted: reverse, data: items, style: (0, mui_native_1.convert_CSS_to_RNStyles)(style), renderItem: function (_a) {
            var item = _a.item, index = _a.index;
            return render(item, { index: index, onClick: onPress !== null && onPress !== void 0 ? onPress : onClick });
        }, keyExtractor: function (item) { return item.id.toString(); } }));
};
exports.List = List;
// nop since hover not relevant for native mobile views
var WithHover = function (_a) {
    var children = _a.children;
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
};
exports.WithHover = WithHover;
var ScrollingList = function (_a) {
    var title = _a.title, maxHeight = _a.maxHeight, minHeight = _a.minHeight, titleStyle = _a.titleStyle, items = _a.items, emptyText = _a.emptyText, doneLoading = _a.doneLoading, loadMore = _a.loadMore, Item = _a.Item, TitleComponent = _a.TitleComponent, titleActionsComponent = _a.titleActionsComponent, style = _a.style;
    var titleStyleWithDefaults = __assign({ fontSize: 20, fontWeight: 'bold', marginBottom: 3 }, titleStyle);
    return ((0, jsx_runtime_1.jsxs)(exports.Flex, __assign({ flex: 1, column: true, style: style }, { children: [TitleComponent
                ? (0, jsx_runtime_1.jsx)(TitleComponent, { title: title, titleStyle: titleStyleWithDefaults })
                : ((0, jsx_runtime_1.jsxs)(exports.Flex, __assign({ alignItems: "center", justifyContent: "space-between" }, { children: [(0, jsx_runtime_1.jsx)(exports.Flex, { children: typeof title === 'string'
                                ? ((0, jsx_runtime_1.jsx)(mui_1.Typography, __assign({ style: titleStyleWithDefaults }, { children: title })))
                                : title }), (0, jsx_runtime_1.jsx)(exports.Flex, { children: titleActionsComponent })] }))), items.length === 0
                ? items.length === 0 && (0, jsx_runtime_1.jsx)(mui_1.Typography, { children: emptyText })
                : (0, jsx_runtime_1.jsx)(react_native_1.FlatList, { data: items, keyExtractor: function (item) { return item.id.toString(); }, renderItem: function (_a) {
                        var item = _a.item, index = _a.index;
                        return (0, jsx_runtime_1.jsx)(Item, { item: item, index: index });
                    }, onEndReached: function () {
                        if ((doneLoading === null || doneLoading === void 0 ? void 0 : doneLoading()) || !loadMore)
                            return;
                        loadMore().catch(console.error);
                    }, 
                    // includes conversion of vh and vw
                    style: (0, mui_native_1.convert_CSS_to_RNStyles)({ minHeight: minHeight, maxHeight: maxHeight }) })] })));
};
exports.ScrollingList = ScrollingList;
//# sourceMappingURL=layout.native.js.map