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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { useHandleError } from "./errors";
import { LinearProgress, } from "./mui";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { FixedSizeList } from 'react-window';
import { usePageWidth } from "./CMS";
import { LoadingButton } from ".";
export var IN_REACT_WEB = true;
export var ConditionalWrap = function (_a) {
    var condition = _a.condition, Wrapper = _a.Wrapper, wrapperProps = _a.wrapperProps, children = _a.children;
    if (condition)
        return _jsx(Wrapper, __assign({}, wrapperProps, { children: children }));
    return _jsx(_Fragment, { children: children });
};
export var Image = function (_a) {
    var src = _a.src, alt = _a.alt, style = _a.style, onClick = _a.onClick, props = __rest(_a, ["src", "alt", "style", "onClick"]);
    return (_jsx("img", { src: src, alt: alt, onClick: onClick, style: __assign(__assign({ cursor: !!onClick ? 'pointer' : undefined }, props), style) }));
};
export var Video = function (_a) {
    var style = _a.style, dimensions = _a.dimensions, props = __rest(_a, ["style", "dimensions"]);
    return (_jsx("video", __assign({}, props, { controls: true, style: __assign(__assign({}, style), dimensions) })));
};
export var resolve_direction_for_props = function (row, col) { return (row ? 'row'
    : col ? 'column'
        : 'row' // default to row, like web
); };
export var compute_flex_direction_with_props = function (direction, reverse) { return (reverse === true
    ? direction + '-reverse'
    : direction); };
export var WithHover = function (_a) {
    var hoveredColor = _a.hoveredColor, notHoveredColor = _a.notHoveredColor, flex = _a.flex, disabled = _a.disabled, children = _a.children, _b = _a.style, style = _b === void 0 ? {} : _b;
    var _c = useState(false), hovered = _c[0], setHovered = _c[1];
    if (disabled)
        return _jsx(_Fragment, { children: children });
    return (_jsx("span", __assign({ onMouseEnter: function () { return setHovered(true); }, onMouseLeave: function () { return setHovered(false); }, style: __assign({ display: flex ? 'flex' : undefined, flex: flex ? 1 : undefined, cursor: disabled ? undefined : 'pointer', backgroundColor: hovered && !disabled ? hoveredColor : notHoveredColor }, style) }, { children: children })));
};
export var Flex = function (props) {
    var _a, _b, _c, _d, _e, _f, _g;
    var direction = resolve_direction_for_props(props.row, props.column);
    var flexDirection = compute_flex_direction_with_props(direction, props.reverse);
    var flex = (_a = props.flex) !== null && _a !== void 0 ? _a : 0;
    var flexShrink = (_b = props.shrink) !== null && _b !== void 0 ? _b : 1; // same default as web
    var children = (_c = props.children) !== null && _c !== void 0 ? _c : null;
    var wrap = (_d = props.wrap) !== null && _d !== void 0 ? _d : 'wrap';
    var style = __assign({ alignItems: props.alignItems, alignContent: (_e = props.alignContent) !== null && _e !== void 0 ? _e : 'stretch', justifyContent: props.justifyContent, alignSelf: props.alignSelf, flex: flex, flexDirection: flexDirection, flexWrap: wrap, display: 'flex', flexShrink: flexShrink }, props.style);
    if (props.component === 'span')
        return (_jsx("span", __assign({ style: style, id: props.id, onClick: (_f = props.onClick) !== null && _f !== void 0 ? _f : props.onPress }, { children: children })));
    return (_jsx("div", __assign({ style: style, id: props.id, onClick: (_g = props.onClick) !== null && _g !== void 0 ? _g : props.onPress }, { children: children })));
};
export var WithHTMLFormContext = React.createContext({ loading: false });
export var Form = function (_a) {
    var onSubmit = _a.onSubmit, uniquenessError = _a.uniquenessError, onError = _a.onError, children = _a.children, style = _a.style;
    var _b = useHandleError({ uniquenessError: uniquenessError, onError: onError }), errorDisplay = _b.errorDisplay, handleAPIError = _b.handleAPIError, loading = _b.loading;
    return (_jsx(WithHTMLFormContext.Provider, __assign({ value: { loading: loading } }, { children: _jsxs("form", __assign({ style: style, onSubmit: function (e) { return handleAPIError(function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            e.preventDefault();
                            return [4 /*yield*/, onSubmit()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }); } }, { children: [children, errorDisplay && errorDisplay] })) })));
};
export var SUPPORTS_FORMS = true;
export var ObjectHeader = function (_a) {
    var item = _a.item;
    return (_jsx(Flex, __assign({ row: true }, { children: Object.keys(item).map(function (k) {
            return (_jsx(Flex, { children: k }, k));
        }) })));
};
export var ObjectRow = function (_a) {
    var item = _a.item, onClick = _a.onClick, index = _a.index, style = _a.style;
    return (_jsx(Flex, __assign({ row: true, style: style }, { children: Object.keys(item).map(function (_k, i) {
            var key = _k;
            return (_jsx(Flex, __assign({ column: true, onClick: function () { return onClick === null || onClick === void 0 ? void 0 : onClick(item); } }, { children: typeof item[key] === 'object'
                    ? JSON.stringify(item[key])
                    : item[key] }), _k !== null && _k !== void 0 ? _k : i));
        }) })));
};
export var ListItem = function (_a) {
    var item = _a.item, index = _a.index, render = _a.render, onClick = _a.onClick, renderProps = _a.renderProps, style = _a.style;
    if (render)
        return render(item, __assign({ index: index, onClick: onClick }, renderProps));
    return _jsx(ObjectRow, { item: item, index: index, onClick: onClick, style: style });
};
export var List = function (_a) {
    var scrollToBottom = _a.scrollToBottom, items = _a.items, hoveredColor = _a.hoveredColor, notHoveredColor = _a.notHoveredColor, emptyComponent = _a.emptyComponent, render = _a.render, renderProps = _a.renderProps, onClick = _a.onClick, reverse = _a.reverse, style = _a.style, rowStyle = _a.rowStyle;
    var scrollRef = useRef(null);
    if (items.length === 0 && emptyComponent)
        return emptyComponent;
    useEffect(function () {
        var _a, _b;
        if (!scrollToBottom)
            return;
        (_b = (_a = scrollRef.current) === null || _a === void 0 ? void 0 : _a.scroll) === null || _b === void 0 ? void 0 : _b.call(_a, { top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [scrollToBottom, items.length]);
    return (_jsx("div", __assign({ style: __assign({ overflowY: 'auto' }, style), ref: scrollRef }, { children: _jsx(Flex, __assign({ flex: 1, column: true, reverse: reverse }, { children: items.map(function (item, i) {
                var _a, _b;
                return hoveredColor
                    ? _jsx(WithHover, __assign({ flex: true, hoveredColor: hoveredColor, notHoveredColor: notHoveredColor }, { children: _jsx(ListItem, { index: i, item: item, render: render, renderProps: renderProps, onClick: onClick, style: rowStyle }) }), (_a = item.id) !== null && _a !== void 0 ? _a : i)
                    : _jsx(ListItem, { index: i, item: item, render: render, renderProps: renderProps, onClick: onClick, style: rowStyle }, (_b = item.id) !== null && _b !== void 0 ? _b : i);
            }) })) })));
};
export var ScrollingList = function (_a) {
    var _b, _c;
    var title = _a.title, maxHeight = _a.maxHeight, maxWidth = _a.maxWidth, minHeight = _a.minHeight, titleStyle = _a.titleStyle, items = _a.items, emptyText = _a.emptyText, doneLoading = _a.doneLoading, loadMore = _a.loadMore, Item = _a.Item, TitleComponent = _a.TitleComponent, titleActionsComponent = _a.titleActionsComponent, style = _a.style, header = _a.header, itemContainerStyle = _a.itemContainerStyle, virtualization = _a.virtualization, loadMoreOptions = _a.loadMoreOptions;
    var width = usePageWidth();
    var fetchRef = useRef(0);
    var titleStyleWithDefaults = __assign({ fontSize: 20, fontWeight: 'bold', marginBottom: 3 }, titleStyle);
    var rowHeight = (_b = virtualization === null || virtualization === void 0 ? void 0 : virtualization.rowHeight) !== null && _b !== void 0 ? _b : 40;
    var _d = useState(false), loading = _d[0], setLoading = _d[1];
    return (_jsxs(Grid, __assign({ container: true, direction: "column", style: __assign({ maxWidth: maxWidth, overflowX: maxWidth ? 'auto' : undefined }, style) }, { children: [TitleComponent
                ? _jsx(TitleComponent, { title: title, titleStyle: titleStyleWithDefaults })
                : (_jsxs(Grid, __assign({ container: true, alignItems: "center", justifyContent: "space-between" }, { children: [typeof title === 'string'
                            ? (_jsx(Typography, __assign({ style: titleStyleWithDefaults }, { children: title })))
                            : title, _jsx(Grid, __assign({ item: true }, { children: titleActionsComponent }))] }))), header, _jsxs("div", __assign({ style: __assign({ minHeight: minHeight, maxHeight: maxHeight, overflowY: (virtualization === null || virtualization === void 0 ? void 0 : virtualization.virtualize) ? undefined : 'auto' }, itemContainerStyle), onScroll: function (e) {
                    if ((doneLoading === null || doneLoading === void 0 ? void 0 : doneLoading()) || !loadMore)
                        return;
                    var atBottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop <= e.currentTarget.clientHeight + 5;
                    if (!atBottom)
                        return;
                    if (fetchRef.current === e.currentTarget.scrollHeight)
                        return;
                    fetchRef.current = e.currentTarget.scrollHeight;
                    loadMore().catch(console.error);
                } }, { children: [items.length === 0
                        ? typeof emptyText === 'string'
                            ? _jsx(Typography, { children: emptyText })
                            : emptyText
                        : (virtualization === null || virtualization === void 0 ? void 0 : virtualization.virtualize) ? (
                        // keep consistent with DraggableList
                        _jsx(FixedSizeList, __assign({ style: { overflowX: (virtualization === null || virtualization === void 0 ? void 0 : virtualization.hideHorizontalScroll) ? 'hidden' : undefined }, height: (virtualization === null || virtualization === void 0 ? void 0 : virtualization.height) || window.innerHeight - 225, width: typeof virtualization.width === 'string'
                                ? virtualization.width
                                : ((_c = virtualization === null || virtualization === void 0 ? void 0 : virtualization.width) !== null && _c !== void 0 ? _c : width) - 200 - ((virtualization === null || virtualization === void 0 ? void 0 : virtualization.widthOffset) || 0), itemCount: items.length, itemSize: rowHeight, itemData: items, itemKey: function (index, data) { return data[index].id; }, onScroll: function (p) {
                                var tableHeight = (virtualization === null || virtualization === void 0 ? void 0 : virtualization.height) || window.innerHeight - 225;
                                if (p.scrollOffset, (tableHeight + p.scrollOffset) / (items.length * rowHeight) < .75) {
                                    return;
                                }
                                if ((doneLoading === null || doneLoading === void 0 ? void 0 : doneLoading()) || !loadMore)
                                    return;
                                setLoading(true);
                                loadMore(loadMoreOptions).catch(console.error).finally(function () { return setLoading(false); });
                            } }, { children: function (_a) {
                                var data = _a.data, index = _a.index, style = _a.style;
                                return (_jsxs("div", __assign({ style: style }, { children: [_jsx(Item, { item: data[index], index: index }, data[index].id), index === items.length - 1 && loadMore && !(doneLoading === null || doneLoading === void 0 ? void 0 : doneLoading()) &&
                                            _jsx("div", __assign({ style: { textAlign: 'center' } }, { children: _jsx(LoadingButton, { submitText: "Load Older Data", submittingText: "Loading...", disabled: doneLoading === null || doneLoading === void 0 ? void 0 : doneLoading(), onClick: loadMore, variant: "outlined", style: { width: 200, textAlign: 'center', marginTop: 10 } }) }))] })));
                            } }))) : (items.map(function (item, index) { return (_jsx(Item, { item: item, index: index }, item.id)); })), loading && _jsx(LinearProgress, { style: { position: 'relative', bottom: 3, minHeight: 7 } })] }))] })));
};
var getListStyle = function (isDraggingOver) { return ({
// background: isDraggingOver ? "#ffffff44" : undefined,
// padding: `${grid}px`,
// width: '250px'
}); };
var grid = 2;
var defaultStyles = {
// border: '1px solid',
// borderColor: "primary.main",
// borderRadius: grid / 2,
};
var getItemStyle = function (isDragging, draggableStyle) { return (__assign(__assign({ 
    // some basic styles to make the items look a bit nicer
    userSelect: "none", padding: "".concat(grid, "px"), margin: "0 0 ".concat(grid, "px 0"), 
    // change background colour if dragging
    backgroundColor: isDragging ? "#ffffff88" : undefined }, defaultStyles), draggableStyle)); };
var reorder = function (list, startIndex, endIndex) {
    var result = Array.from(list);
    var removed = result.splice(startIndex, 1)[0];
    result.splice(endIndex, 0, removed);
    return result;
};
var DRAG_ICON_WIDTH = 20;
export var DraggableList = function (_a) {
    var _b;
    var title = _a.title, titleStyle = _a.titleStyle, _items = _a.items, emptyText = _a.emptyText, Item = _a.Item, TitleComponent = _a.TitleComponent, titleActionsComponent = _a.titleActionsComponent, style = _a.style, noWrap = _a.noWrap, header = _a.header, itemContainerStyle = _a.itemContainerStyle, onReorder = _a.onReorder, virtualization = _a.virtualization, doneLoading = _a.doneLoading, loadMore = _a.loadMore, maxWidth = _a.maxWidth, minHeight = _a.minHeight, maxHeight = _a.maxHeight, loadMoreOptions = _a.loadMoreOptions;
    var width = usePageWidth();
    var titleStyleWithDefaults = __assign({ fontSize: 20, fontWeight: 'bold', marginBottom: 3 }, titleStyle);
    var rowHeight = (_b = virtualization === null || virtualization === void 0 ? void 0 : virtualization.rowHeight) !== null && _b !== void 0 ? _b : 40;
    var _c = useState(_items), items = _c[0], setItems = _c[1];
    var _d = useState(false), updating = _d[0], setUpdating = _d[1];
    var _e = useState(false), loading = _e[0], setLoading = _e[1];
    useEffect(function () {
        setItems(_items);
    }, [_items]);
    var Row = useMemo(function () { return function (_a) {
        var data = _a.data, index = _a.index, style = _a.style;
        return (_jsx(Draggable, __assign({ index: index, draggableId: data[index].id.toString(), isDragDisabled: updating }, { children: function (provided, snapshot) { return (_jsxs(Grid, __assign({ container: true, alignItems: "center", wrap: "nowrap", ref: provided.innerRef }, provided.draggableProps, provided.dragHandleProps, { sx: __assign({}, getItemStyle(snapshot.isDragging, provided.draggableProps.style)), style: __assign({ height: rowHeight }, style) }, { children: [_jsx(Grid, __assign({ item: true, sx: { width: DRAG_ICON_WIDTH, height: DRAG_ICON_WIDTH, ml: '2px' } }, { children: _jsx(DragIndicatorIcon, { fontSize: 'small', color: updating ? 'inherit' : "primary" }) })), _jsx(Item, { item: data[index], index: index }, data[index].id)] }))); } }), data[index].id));
    }; }, [updating, rowHeight, Item]);
    var handleDragEnd = useCallback(function (result) { return __awaiter(void 0, void 0, void 0, function () {
        var updated, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!result.destination) {
                        return [2 /*return*/];
                    }
                    if (result.destination === result.source)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    updated = reorder(items, result.source.index, result.destination.index);
                    setItems(updated);
                    setUpdating(true);
                    return [4 /*yield*/, (onReorder === null || onReorder === void 0 ? void 0 : onReorder(updated.map(function (_a, index) {
                            var id = _a.id;
                            return ({ id: id.toString(), index: index });
                        })))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setItems(items); // in case of error, reset with original data
                    return [3 /*break*/, 5];
                case 4:
                    setUpdating(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [items, onReorder]);
    return (_jsxs(Grid, __assign({ container: true, direction: "column", wrap: noWrap ? 'nowrap' : undefined, style: __assign({ maxWidth: maxWidth, overflowX: maxWidth ? 'auto' : undefined }, style) }, { children: [TitleComponent
                ? _jsx(TitleComponent, { title: title, titleStyle: titleStyleWithDefaults })
                : (_jsxs(Grid, __assign({ container: true, alignItems: "center", justifyContent: "space-between" }, { children: [typeof title === 'string'
                            ? (_jsx(Typography, __assign({ style: titleStyleWithDefaults }, { children: title })))
                            : title, _jsx(Grid, __assign({ item: true }, { children: titleActionsComponent }))] }))), header, _jsxs("div", __assign({ style: __assign({ minHeight: minHeight, maxHeight: maxHeight }, itemContainerStyle) }, { children: [items.length === 0
                        ? typeof emptyText === 'string'
                            ? _jsx(Typography, { children: emptyText })
                            : emptyText
                        : null, _jsx(DragDropContext, __assign({ onDragEnd: handleDragEnd }, { children: _jsx(Droppable, __assign({ droppableId: "droppable", mode: "virtual", renderClone: function (provided, snapshot, rubric) { return (_jsxs(Grid, __assign({ container: true, alignItems: "center", wrap: "nowrap", ref: provided.innerRef }, provided.draggableProps, provided.dragHandleProps, { sx: __assign({}, getItemStyle(snapshot.isDragging, provided.draggableProps.style)), style: { height: rowHeight, margin: 0 } }, { children: [_jsx(Grid, __assign({ item: true, sx: { width: DRAG_ICON_WIDTH, height: DRAG_ICON_WIDTH, ml: '2px' } }, { children: _jsx(DragIndicatorIcon, { fontSize: 'small', color: updating ? 'inherit' : "primary" }) })), _jsx(Item, { item: items[rubric.source.index], index: rubric.source.index }, items[rubric.source.index].id)] }))); } }, { children: function (provided) {
                                var _a;
                                return (_jsx(FixedSizeList, __assign({ style: { overflowX: (virtualization === null || virtualization === void 0 ? void 0 : virtualization.hideHorizontalScroll) ? 'hidden' : undefined }, height: (virtualization === null || virtualization === void 0 ? void 0 : virtualization.height) || window.innerHeight - 225, width: typeof (virtualization === null || virtualization === void 0 ? void 0 : virtualization.width) === 'string'
                                        ? virtualization === null || virtualization === void 0 ? void 0 : virtualization.width
                                        : ((_a = virtualization === null || virtualization === void 0 ? void 0 : virtualization.width) !== null && _a !== void 0 ? _a : width) - 200 - ((virtualization === null || virtualization === void 0 ? void 0 : virtualization.widthOffset) || 0), itemCount: items.length, itemSize: rowHeight, outerRef: provided.innerRef, itemData: items, itemKey: function (index, data) { return data[index].id; }, onScroll: function (p) {
                                        var tableHeight = (virtualization === null || virtualization === void 0 ? void 0 : virtualization.height) || window.innerHeight - 225;
                                        if (p.scrollOffset, (tableHeight + p.scrollOffset) / (items.length * rowHeight) < .75) {
                                            return;
                                        }
                                        if ((doneLoading === null || doneLoading === void 0 ? void 0 : doneLoading()) || !loadMore)
                                            return;
                                        setLoading(true);
                                        loadMore(loadMoreOptions).finally(function () { return setLoading(false); });
                                    } }, { children: Row })));
                            } })) })), loading && _jsx(LinearProgress, { style: { position: 'relative', bottom: 3, minHeight: 7 } })] }))] })));
};
//# sourceMappingURL=layout.js.map