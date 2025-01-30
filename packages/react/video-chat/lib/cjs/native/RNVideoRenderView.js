"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RNVideoRenderView = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var bridge_1 = require("./bridge");
var RNVideoRenderView = /** @class */ (function (_super) {
    __extends(RNVideoRenderView, _super);
    function RNVideoRenderView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RNVideoRenderView.prototype.componentDidMount = function () {
        var _this = this;
        // we need to delay the bind video 
        // Because "componentDidMount" will be called "immediately after the initial rendering occurs"
        // This is *before* RCTUIManager add this view to register (so that viewForReactTag() can return a view)
        // So we need to dispatch bindVideoView after this function complete
        setTimeout(function () {
            bridge_1.NativeFunction.bindVideoView((0, react_native_1.findNodeHandle)(_this), _this.props.tileId);
        }, 1000); // use explicit 1s timeout to avoid crashes on self-video toggle
    };
    RNVideoRenderView.prototype.componentWillUnmount = function () {
        bridge_1.NativeFunction.unbindVideoView(this.props.tileId);
    };
    RNVideoRenderView.prototype.render = function () {
        return (0, jsx_runtime_1.jsx)(RNVideoRenderViewNative, __assign({}, this.props));
    };
    return RNVideoRenderView;
}(react_1.default.Component));
exports.RNVideoRenderView = RNVideoRenderView;
// @ts-ignore 
var RNVideoRenderViewNative = (0, react_native_1.requireNativeComponent)('RNVideoView', RNVideoRenderView);
//# sourceMappingURL=RNVideoRenderView.js.map