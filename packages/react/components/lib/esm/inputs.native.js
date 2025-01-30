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
import { useDisplayPictureUploadForSelf, useFileUpload, } from "./inputs.js";
import { TextField } from "./mui";
export { useDisplayPictureUploadForSelf, useFileUpload };
export var FileDropzone = function () {
    throw new Error("Dropzone is not supported in Native");
};
export var FileUploader = function (p) {
    throw new Error("Unimplemented");
};
export var SearchTextInput = function (props) { return (_jsx(TextField, __assign({ size: "small", placeholder: "Search..." }, props))); };
//# sourceMappingURL=inputs.native.js.map