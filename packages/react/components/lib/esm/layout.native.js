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
var _this = this;
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { Image as ImageNative, View, FlatList, TouchableOpacity } from "react-native";
import { resolve_direction_for_props, compute_flex_direction_with_props, } from "./layout.js";
import { Typography, } from "./mui";
import { convert_CSS_to_RNStyles } from "./mui.native";
// @ts-ignore
import NativeVideo from 'react-native-video';
export var IN_REACT_WEB = false;
// need to export for consistency with native
export var WithHTMLFormContext = React.createContext({ loading: false });
export var Image = function (_a) {
    var src = _a.src, alt = _a.alt, props = __rest(_a, ["src", "alt"]);
    return (_jsx(ImageNative, { accessibilityLabel: alt, source: { uri: src }, resizeMode: "contain", style: props }));
};
export var Video = function (_a) {
    var style = _a.style, src = _a.src, dimensions = _a.dimensions, props = __rest(_a, ["style", "src", "dimensions"]);
    return (_jsx(NativeVideo, __assign({ source: { uri: src }, controls: true, paused: true, ref: function (ref) {
            if (_this) {
                // @ts-ignore
                _this.player = ref;
            }
        } }, props, { style: convert_CSS_to_RNStyles(__assign(__assign({}, style), dimensions)) })));
};
export var Flex = function (props) {
    var _a, _b, _c, _d, _e, _f;
    var direction = resolve_direction_for_props(props.row, props.column);
    var flexDirection = compute_flex_direction_with_props(direction, props.reverse);
    var flex = (_a = props.flex) !== null && _a !== void 0 ? _a : 0;
    var children = (_b = props.children) !== null && _b !== void 0 ? _b : null;
    var flexShrink = (_c = props.shrink) !== null && _c !== void 0 ? _c : 1; // same default as web
    var wrap = (_d = props.wrap) !== null && _d !== void 0 ? _d : 'wrap';
    var handler = (_e = props.onPress) !== null && _e !== void 0 ? _e : props.onClick;
    var style = __assign({ alignItems: props.alignItems, alignContent: (_f = props.alignContent) !== null && _f !== void 0 ? _f : 'stretch', justifyContent: props.justifyContent, alignSelf: props.alignSelf, flex: flex, flexDirection: flexDirection, flexWrap: wrap, display: 'flex', flexShrink: flexShrink }, convert_CSS_to_RNStyles(props.style));
    if (handler)
        return (_jsx(TouchableOpacity, __assign({ onPress: handler, style: style }, { children: _jsx(_Fragment, { children: children }) })));
    return (_jsx(View, __assign({ style: style }, { children: children })));
};
export var Form = function (_a) {
    var children = _a.children, style = _a.style;
    return (style
        ? _jsx(View, __assign({ style: convert_CSS_to_RNStyles(style) }, { children: children }))
        : _jsx(_Fragment, { children: children }));
};
export var SUPPORTS_FORMS = false;
export var List = function (_a) {
    var items = _a.items, emptyComponent = _a.emptyComponent, render = _a.render, onClick = _a.onClick, onPress = _a.onPress, reverse = _a.reverse, style = _a.style;
    if (items.length === 0 && emptyComponent)
        return emptyComponent;
    return (_jsx(FlatList, { inverted: reverse, data: items, style: convert_CSS_to_RNStyles(style), renderItem: function (_a) {
            var item = _a.item, index = _a.index;
            return render(item, { index: index, onClick: onPress !== null && onPress !== void 0 ? onPress : onClick });
        }, keyExtractor: function (item) { return item.id.toString(); } }));
};
// nop since hover not relevant for native mobile views
export var WithHover = function (_a) {
    var children = _a.children;
    return _jsx(_Fragment, { children: children });
};
export var ScrollingList = function (_a) {
    var title = _a.title, maxHeight = _a.maxHeight, minHeight = _a.minHeight, titleStyle = _a.titleStyle, items = _a.items, emptyText = _a.emptyText, doneLoading = _a.doneLoading, loadMore = _a.loadMore, Item = _a.Item, TitleComponent = _a.TitleComponent, titleActionsComponent = _a.titleActionsComponent, style = _a.style;
    var titleStyleWithDefaults = __assign({ fontSize: 20, fontWeight: 'bold', marginBottom: 3 }, titleStyle);
    return (_jsxs(Flex, __assign({ flex: 1, column: true, style: style }, { children: [TitleComponent
                ? _jsx(TitleComponent, { title: title, titleStyle: titleStyleWithDefaults })
                : (_jsxs(Flex, __assign({ alignItems: "center", justifyContent: "space-between" }, { children: [_jsx(Flex, { children: typeof title === 'string'
                                ? (_jsx(Typography, __assign({ style: titleStyleWithDefaults }, { children: title })))
                                : title }), _jsx(Flex, { children: titleActionsComponent })] }))), items.length === 0
                ? items.length === 0 && _jsx(Typography, { children: emptyText })
                : _jsx(FlatList, { data: items, keyExtractor: function (item) { return item.id.toString(); }, renderItem: function (_a) {
                        var item = _a.item, index = _a.index;
                        return _jsx(Item, { item: item, index: index });
                    }, onEndReached: function () {
                        if ((doneLoading === null || doneLoading === void 0 ? void 0 : doneLoading()) || !loadMore)
                            return;
                        loadMore().catch(console.error);
                    }, 
                    // includes conversion of vh and vw
                    style: convert_CSS_to_RNStyles({ minHeight: minHeight, maxHeight: maxHeight }) })] })));
};
//# sourceMappingURL=layout.native.js.map