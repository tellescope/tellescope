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
import { jsx as _jsx } from "react/jsx-runtime";
/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
import React from 'react';
import { requireNativeComponent, findNodeHandle } from 'react-native';
import { NativeFunction } from './bridge';
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
            NativeFunction.bindVideoView(findNodeHandle(_this), _this.props.tileId);
        }, 1000); // use explicit 1s timeout to avoid crashes on self-video toggle
    };
    RNVideoRenderView.prototype.componentWillUnmount = function () {
        NativeFunction.unbindVideoView(this.props.tileId);
    };
    RNVideoRenderView.prototype.render = function () {
        return _jsx(RNVideoRenderViewNative, __assign({}, this.props));
    };
    return RNVideoRenderView;
}(React.Component));
export { RNVideoRenderView };
// @ts-ignore 
var RNVideoRenderViewNative = requireNativeComponent('RNVideoView', RNVideoRenderView);
//# sourceMappingURL=RNVideoRenderView.js.map