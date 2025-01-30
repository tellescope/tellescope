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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchTextInput = exports.FileUploader = exports.FileDropzone = exports.useFileUpload = exports.useDisplayPictureUploadForSelf = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var inputs_js_1 = require("./inputs.js");
Object.defineProperty(exports, "useDisplayPictureUploadForSelf", { enumerable: true, get: function () { return inputs_js_1.useDisplayPictureUploadForSelf; } });
Object.defineProperty(exports, "useFileUpload", { enumerable: true, get: function () { return inputs_js_1.useFileUpload; } });
var mui_1 = require("./mui");
var FileDropzone = function () {
    throw new Error("Dropzone is not supported in Native");
};
exports.FileDropzone = FileDropzone;
var FileUploader = function (p) {
    throw new Error("Unimplemented");
};
exports.FileUploader = FileUploader;
var SearchTextInput = function (props) { return ((0, jsx_runtime_1.jsx)(mui_1.TextField, __assign({ size: "small", placeholder: "Search..." }, props))); };
exports.SearchTextInput = SearchTextInput;
//# sourceMappingURL=inputs.native.js.map