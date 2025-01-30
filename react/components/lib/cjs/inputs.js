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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageOrDropzone = exports.SearchTextInput = exports.DeleteWithConfimrationIcon = exports.ConfirmationScreen = exports.FileUploader = exports.useUserDisplayPictureUpload = exports.useDisplayPictureUploadForSelf = exports.UploadButton = exports.useFileUpload = exports.useFileDropzone = exports.FileDropzone = exports.DefaultDropzoneContent = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_dropzone_1 = require("react-dropzone");
var sdk_1 = require("@tellescope/sdk");
var layout_1 = require("./layout");
var mui_1 = require("./mui");
var authentication_1 = require("./authentication");
var _1 = require(".");
var material_1 = require("@mui/material");
var Delete_1 = __importDefault(require("@mui/icons-material/Delete"));
var Search_1 = __importDefault(require("@mui/icons-material/Search"));
var Close_1 = __importDefault(require("@mui/icons-material/Close"));
var DefaultDropzoneContent = function (_a) {
    var isDragActive = _a.isDragActive, label = _a.label, file = _a.file, style = _a.style;
    return ((0, jsx_runtime_1.jsx)(layout_1.Flex, __assign({ flex: 1, style: __assign(__assign({}, style), isDragActive ? { border: '1px dashed gray' } : {}) }, { children: (0, jsx_runtime_1.jsx)(mui_1.Typography, __assign({ style: { cursor: 'pointer' } }, { children: isDragActive ? "Drop to select file"
                : file ? "".concat(file.name, " selected!")
                    : label !== null && label !== void 0 ? label : "Select a File" })) })));
};
exports.DefaultDropzoneContent = DefaultDropzoneContent;
var FileDropzone = function (_a) {
    var accept = _a.accept, file = _a.file, label = _a.label, style = _a.style, dropzoneStyle = _a.dropzoneStyle, onChange = _a.onChange, _b = _a.DropzoneComponent, DropzoneComponent = _b === void 0 ? exports.DefaultDropzoneContent : _b;
    var onDrop = (0, react_1.useCallback)(function (acceptedFiles) {
        var newFile = acceptedFiles.pop();
        onChange(newFile);
    }, [onChange]);
    var _c = (0, react_dropzone_1.useDropzone)({ onDrop: onDrop }), getRootProps = _c.getRootProps, getInputProps = _c.getInputProps, isDragActive = _c.isDragActive;
    return ((0, jsx_runtime_1.jsxs)("div", __assign({}, getRootProps(), { style: style }, { children: [(0, jsx_runtime_1.jsx)("input", __assign({}, getInputProps({ multiple: false, accept: accept }))), (0, jsx_runtime_1.jsx)(DropzoneComponent, { label: label, isDragActive: isDragActive, file: file, style: dropzoneStyle })] })));
};
exports.FileDropzone = FileDropzone;
var useFileDropzone = function (_a) {
    var _b = _a.DropzoneComponent, DropzoneComponent = _b === void 0 ? exports.DefaultDropzoneContent : _b, _c = _a.style, style = _c === void 0 ? {} : _c;
    var _d = (0, react_1.useState)(undefined), file = _d[0], setFile = _d[1];
    return {
        file: file,
        setFile: setFile,
        dropzone: (0, jsx_runtime_1.jsx)(exports.FileDropzone, { file: file, onChange: setFile, DropzoneComponent: DropzoneComponent, dropzoneStyle: style })
    };
};
exports.useFileDropzone = useFileDropzone;
var useFileUpload = function (o) {
    if (o === void 0) { o = {}; }
    var enduserId = o.enduserId, publicRead = o.publicRead, publicName = o.publicName, source = o.source, isCalledOut = o.isCalledOut, externalId = o.externalId;
    var session = (0, authentication_1.useResolvedSession)();
    var _a = (0, _1.useFiles)({ dontFetch: true }), addLocalElement = _a[1].addLocalElement;
    var _b = (0, react_1.useState)(false), uploading = _b[0], setUploading = _b[1];
    var handleUpload = (0, react_1.useCallback)(function (details, file) { return __awaiter(void 0, void 0, void 0, function () {
        var createdFile, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setUploading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, session.prepare_and_upload_file(__assign(__assign({ externalId: externalId }, details), { publicName: publicName, enduserId: enduserId, publicRead: publicRead, source: source, isCalledOut: isCalledOut }), file)];
                case 2:
                    createdFile = _a.sent();
                    addLocalElement(createdFile);
                    return [2 /*return*/, createdFile];
                case 3:
                    err_1 = _a.sent();
                    throw err_1;
                case 4:
                    setUploading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [session, setUploading, isCalledOut, enduserId]);
    return {
        handleUpload: handleUpload,
        uploading: uploading,
    };
};
exports.useFileUpload = useFileUpload;
var UploadButton = function (_a) {
    var file = _a.file, details = _a.details, handleUpload = _a.handleUpload, uploading = _a.uploading;
    return ((0, jsx_runtime_1.jsx)(_1.LoadingButton, { disabled: !file || uploading, submitText: "Upload", submittingText: "Uploading", onClick: function () {
            if (!file)
                return;
            handleUpload({ name: details.name, size: details.size, type: details.type }, // allows passing a File as details without issue
            file);
        } }));
};
exports.UploadButton = UploadButton;
var useDisplayPictureUploadForSelf = function (o) {
    if (o === void 0) { o = {}; }
    var session = (0, authentication_1.useResolvedSession)();
    var updateUserInfo = (0, react_1.useContext)(authentication_1.SessionContext).updateUserInfo;
    var updateEnduserInfo = (0, react_1.useContext)(authentication_1.EnduserSessionContext).updateUserInfo;
    var _a = (0, exports.useFileUpload)(o), uploading = _a.uploading, hookHandleUpload = _a.handleUpload;
    var _b = (0, react_1.useState)(false), updating = _b[0], setUpdating = _b[1];
    var handleUpload = (0, react_1.useCallback)(function (details, file, options) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, secureName, fileInfo, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setUpdating(true);
                    return [4 /*yield*/, hookHandleUpload({
                            name: details.name, type: details.type, size: details.size, enduserId: o.enduserId,
                        }, file, options)];
                case 1:
                    _a = _b.sent(), secureName = _a.secureName, fileInfo = __rest(_a, ["secureName"]);
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 7, 8, 9]);
                    if (!(session instanceof sdk_1.Session)) return [3 /*break*/, 4];
                    return [4 /*yield*/, updateUserInfo({ avatar: secureName })];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, updateEnduserInfo({ avatar: secureName })];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6: return [3 /*break*/, 9];
                case 7:
                    err_2 = _b.sent();
                    throw (err_2);
                case 8:
                    setUpdating(false);
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/, __assign({ secureName: secureName }, fileInfo)];
            }
        });
    }); }, [session]);
    return {
        handleUpload: handleUpload,
        updating: updating || uploading,
    };
};
exports.useDisplayPictureUploadForSelf = useDisplayPictureUploadForSelf;
var useUserDisplayPictureUpload = function (_o) {
    if (_o === void 0) { _o = {}; }
    var session = (0, _1.useSession)();
    var _a = (0, _1.useUsers)({ dontFetch: true }), updateUser = _a[1].updateElement;
    var userId = _o.userId, o = __rest(_o, ["userId"]);
    var _b = (0, exports.useFileUpload)(o), uploading = _b.uploading, hookHandleUpload = _b.handleUpload;
    var _c = (0, react_1.useState)(false), updating = _c[0], setUpdating = _c[1];
    var handleUpload = (0, react_1.useCallback)(function (details, file, options) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, secureName, fileInfo, err_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setUpdating(true);
                    return [4 /*yield*/, hookHandleUpload({
                            name: details.name, type: details.type, size: details.size, enduserId: o.enduserId,
                        }, file, options)];
                case 1:
                    _a = _b.sent(), secureName = _a.secureName, fileInfo = __rest(_a, ["secureName"]);
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, 5, 6]);
                    return [4 /*yield*/, updateUser(userId, { avatar: secureName })];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 4:
                    err_3 = _b.sent();
                    throw (err_3);
                case 5:
                    setUpdating(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/, __assign({ secureName: secureName }, fileInfo)];
            }
        });
    }); }, [session]);
    return {
        handleUpload: handleUpload,
        updating: updating || uploading,
    };
};
exports.useUserDisplayPictureUpload = useUserDisplayPictureUpload;
var FileUploader = function (_a) {
    var _b = _a.submitText, submitText = _b === void 0 ? "Upload" : _b, _c = _a.submittingText, submittingText = _c === void 0 ? "Uploading" : _c, onUpload = _a.onUpload, style = _a.style, enduserId = _a.enduserId, dropzoneStyle = _a.dropzoneStyle, variant = _a.variant, uploadOptions = __rest(_a, ["submitText", "submittingText", "onUpload", "style", "enduserId", "dropzoneStyle", "variant"]);
    var _d = (0, exports.useFileUpload)(uploadOptions), handleUpload = _d.handleUpload, uploading = _d.uploading;
    var _e = (0, react_1.useState)(undefined), file = _e[0], setFile = _e[1];
    return ((0, jsx_runtime_1.jsxs)(layout_1.Flex, __assign({ column: true, style: style }, { children: [(0, jsx_runtime_1.jsx)(exports.FileDropzone, { file: file, onChange: setFile, dropzoneStyle: dropzoneStyle }), (0, jsx_runtime_1.jsx)(_1.LoadingButton, { variant: variant, onClick: function () { return __awaiter(void 0, void 0, void 0, function () {
                    var uploadedFile;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!file)
                                    return [2 /*return*/];
                                return [4 /*yield*/, handleUpload({
                                        name: file.name, type: file.type, size: file.size,
                                        enduserId: enduserId
                                    }, file)];
                            case 1:
                                uploadedFile = _a.sent();
                                onUpload === null || onUpload === void 0 ? void 0 : onUpload(uploadedFile);
                                return [2 /*return*/];
                        }
                    });
                }); }, submitText: submitText, submittingText: submittingText, disabled: file === undefined, submitting: uploading })] })));
};
exports.FileUploader = FileUploader;
var ConfirmationScreen = function (_a) {
    var action = _a.action, onCancel = _a.onCancel, onSuccess = _a.onSuccess, _b = _a.typeToConfirm, typeToConfirm = _b === void 0 ? '' : _b, _c = _a.title, title = _c === void 0 ? "Confirmation" : _c, _d = _a.description, description = _d === void 0 ? '' : _d, _e = _a.confirmText, confirmText = _e === void 0 ? 'Confirm' : _e, _f = _a.loadingText, loadingText = _f === void 0 ? "Loading" : _f, customConfirmationComponent = _a.customConfirmationComponent, disabled = _a.disabled, style = _a.style;
    var _g = (0, react_1.useState)(''), text = _g[0], setText = _g[1];
    var _h = (0, react_1.useState)(false), submitting = _h[0], setSubmitting = _h[1];
    var handleConfirm = function () { return (action()
        .then(onSuccess)
        .finally(function () {
        setSubmitting(false);
    })); };
    return ((0, jsx_runtime_1.jsx)(_1.Modal, __assign({ open: true, setOpen: function (o) { return !o && onCancel(); } }, { children: (0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, direction: "column", sx: { width: 500 } }, { children: [(0, jsx_runtime_1.jsx)(mui_1.Typography, __assign({ style: { fontSize: 25, marginBottom: 5 } }, { children: title })), description &&
                    (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, sx: { minHeight: 'min(40vh, 100px)' } }, { children: (0, jsx_runtime_1.jsx)(mui_1.Typography, __assign({ style: { fontSize: 18 }, color: "primary" }, { children: description })) })), customConfirmationComponent && (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: customConfirmationComponent })), typeToConfirm &&
                    (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(_1.TextField, { variant: "outlined", type: "text", fullWidth: true, name: "Confirmation", label: "Type \"".concat(typeToConfirm, "\" to confirm"), placeholder: typeToConfirm, value: text, onChange: function (value) { return setText(value.substring(0, 250)); } }) })), (0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, sx: { mt: 1 } }, { children: [(0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: 8 }, { children: (0, jsx_runtime_1.jsx)(_1.Button, __assign({ color: "primary", variant: 'outlined', onClick: onCancel }, { children: "Cancel" })) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: 4 }, { children: (0, jsx_runtime_1.jsx)(_1.LoadingButton, { onClick: handleConfirm, submitting: submitting, disabled: disabled || typeToConfirm !== text, submitText: confirmText, submittingText: loadingText }) }))] }))] })) })));
};
exports.ConfirmationScreen = ConfirmationScreen;
var DeleteWithConfimrationIcon = function (_a) {
    var _b;
    var modelName = _a.modelName, color = _a.color, iconProps = _a.iconProps, onSuccess = _a.onSuccess, props = __rest(_a, ["modelName", "color", "iconProps", "onSuccess"]);
    var modalProps = (0, _1.useModalIconButton)(__assign({ Icon: Delete_1.default, label: "Delete ".concat(modelName), id: "delete-".concat(modelName, "-icon"), color: color }, iconProps));
    var defaultOnSuccess = function () {
        modalProps.setOpen(false);
    };
    return ((0, jsx_runtime_1.jsx)(_1.IconModal, __assign({}, modalProps, { children: (0, jsx_runtime_1.jsx)(exports.ConfirmationScreen, __assign({}, props, { title: (_b = props.title) !== null && _b !== void 0 ? _b : 'Delete Confirmation', description: props.description || "This operation is permanent and cannot be undone", style: { maxWidth: 500 }, onSuccess: onSuccess !== null && onSuccess !== void 0 ? onSuccess : defaultOnSuccess, onCancel: function () { return modalProps.setOpen(false); }, confirmText: "Delete", loadingText: "Deleting..." })) })));
};
exports.DeleteWithConfimrationIcon = DeleteWithConfimrationIcon;
var SearchTextInput = function (_a) {
    var onChange = _a.onChange, hideIcon = _a.hideIcon, props = __rest(_a, ["onChange", "hideIcon"]);
    return ((0, jsx_runtime_1.jsx)(_1.TextField, __assign({ size: "small", placeholder: "Search...", onChange: function (s) { return onChange === null || onChange === void 0 ? void 0 : onChange(s); }, InputProps: hideIcon ? undefined : {
            startAdornment: ((0, jsx_runtime_1.jsx)(material_1.InputAdornment, __assign({ position: "start" }, { children: (0, jsx_runtime_1.jsx)(Search_1.default, { color: props.value ? 'primary' : undefined }) }))),
            endAdornment: ((props.value && onChange) ? ((0, jsx_runtime_1.jsx)(material_1.InputAdornment, __assign({ position: "end" }, { children: (0, jsx_runtime_1.jsx)(_1.IconButton, { children: (0, jsx_runtime_1.jsx)(Close_1.default, { color: props.value ? 'primary' : undefined, onClick: function () { return onChange(''); } }) }) })))
                : undefined),
        } }, props)));
};
exports.SearchTextInput = SearchTextInput;
var ImageOrDropzone = function (_a) {
    var style = _a.style, maxHeight = _a.maxHeight, width = _a.width, existing = _a.existing, onUpload = _a.onUpload, uploadInModal = _a.uploadInModal, _b = _a.dropzoneText, dropzoneText = _b === void 0 ? "Select a Photo" : _b;
    var _c = (0, react_1.useState)(undefined), selectedFile = _c[0], setSelectedFile = _c[1];
    var _d = (0, react_1.useState)(false), open = _d[0], setOpen = _d[1];
    var _e = (0, react_1.useState)(''), error = _e[0], setError = _e[1];
    var _f = (0, exports.useFileUpload)(), handleUpload = _f.handleUpload, uploading = _f.uploading;
    var upload = ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, direction: "column" }, { children: [(0, jsx_runtime_1.jsx)(exports.FileDropzone, { file: selectedFile, onChange: setSelectedFile, label: dropzoneText, accept: ".png,.jpg,.jpeg,.gif", dropzoneStyle: {
                    cursor: 'pointer',
                    border: '1px solid black',
                    borderRadius: 5,
                    height: maxHeight,
                    // width: 400,
                    alignItems: 'center',
                    justifyContent: 'center',
                } }), selectedFile &&
                (0, jsx_runtime_1.jsx)(_1.LoadingButton, { submitText: "Upload", submittingText: "Uploading...", disabled: !selectedFile, submitting: uploading, onClick: function () { return __awaiter(void 0, void 0, void 0, function () {
                        var secureName, err_4;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!selectedFile)
                                        return [2 /*return*/];
                                    setError('');
                                    if (!(selectedFile.type.includes('png')
                                        || selectedFile.type.includes('jpg')
                                        || selectedFile.type.includes('jpeg')
                                        || selectedFile.type.includes('gif'))) {
                                        return [2 /*return*/, setError("Please attach an image file")];
                                    }
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, handleUpload({
                                            name: selectedFile.name,
                                            type: selectedFile.type,
                                            size: selectedFile.size,
                                        }, selectedFile)];
                                case 2:
                                    secureName = (_b.sent()).secureName;
                                    onUpload(secureName);
                                    setOpen(false);
                                    setSelectedFile(undefined);
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_4 = _b.sent();
                                    setError((_a = err_4 === null || err_4 === void 0 ? void 0 : err_4.message) !== null && _a !== void 0 ? _a : err_4 === null || err_4 === void 0 ? void 0 : err_4.toString());
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); } }), (0, jsx_runtime_1.jsx)(mui_1.Typography, __assign({ color: "error" }, { children: error }))] })));
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [!(uploadInModal || open)
                ?
                    existing
                        ? ((0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ container: true, alignItems: "center", justifyContent: "center", style: style, onClick: function () { return setOpen(true); }, sx: {
                                cursor: 'pointer',
                            } }, { children: (0, jsx_runtime_1.jsx)(_1.SecureImage, { secureName: existing, maxHeight: maxHeight, width: width }) })))
                        : upload
                : null, uploadInModal
                ? ((0, jsx_runtime_1.jsx)(_1.Modal, __assign({ open: open, setOpen: setOpen }, { children: upload })))
                : open
                    ? upload
                    : null] }));
};
exports.ImageOrDropzone = ImageOrDropzone;
//# sourceMappingURL=inputs.js.map