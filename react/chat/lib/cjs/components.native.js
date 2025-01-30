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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessage = exports.HTMLMessage = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_native_image_picker_1 = require("react-native-image-picker");
var react_native_1 = require("react-native");
var react_native_paper_1 = require("react-native-paper");
var react_components_1 = require("@tellescope/react-components");
var react_1 = require("react");
var utilities_1 = require("@tellescope/utilities");
var react_native_render_html_1 = __importDefault(require("react-native-render-html"));
var HTMLMessage = function (_a) {
    var htmlUnprocessed = _a.html, _b = _a.color, color = _b === void 0 ? "white" : _b, _c = _a.selectable, selectable = _c === void 0 ? true : _c;
    var html = (htmlUnprocessed.endsWith('<br/>')
        ? htmlUnprocessed.substring(0, htmlUnprocessed.length - 5)
        : htmlUnprocessed);
    var width = (0, react_native_1.useWindowDimensions)().width;
    return ((0, jsx_runtime_1.jsx)(react_native_render_html_1.default, { defaultTextProps: { selectable: selectable }, baseStyle: {
            paddingTop: 4, // causes better fit into both 1-line and multiline chat bubbles
        }, contentWidth: width, source: {
            html: ((0, utilities_1.remove_script_tags)(html))
        }, tagsStyles: {
            'body': {
                color: color,
            },
            'a': {
                color: color,
                textDecorationColor: color, // underline color in the link
            }
        } }));
};
exports.HTMLMessage = HTMLMessage;
var CHAT_ICON_SIZE = 35;
var SendImageOrVideo = function (_a) {
    var onUpload = _a.onUpload, disabled = _a.disabled;
    var session = (0, react_components_1.useResolvedSession)();
    var _b = (0, react_1.useState)(false), menuOpen = _b[0], setMenuOpen = _b[1];
    var _c = (0, react_1.useState)(''), errorMessage = _c[0], setErrorMessage = _c[1];
    var _d = (0, react_components_1.useFileUpload)({ enduserId: session.userInfo.id }), handleUpload = _d.handleUpload, uploading = _d.uploading;
    var handleImageSelect = function (type) { return __awaiter(void 0, void 0, void 0, function () {
        var result, image, blob, actualSize, file, err_1;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (uploading)
                        return [2 /*return*/];
                    setErrorMessage('');
                    return [4 /*yield*/, (type === 'library' ? react_native_image_picker_1.launchImageLibrary : react_native_image_picker_1.launchCamera)({
                            mediaType: 'mixed',
                            maxWidth: 500,
                            maxHeight: 500,
                        })];
                case 1:
                    result = _e.sent();
                    if (result.didCancel)
                        return [2 /*return*/];
                    if (result.errorCode || result.errorMessage) {
                        setErrorMessage(result.errorCode === 'camera_unavailable' ? "Your camera is unavailable"
                            : result.errorCode === 'permission' ? "We do have permission to access your camera"
                                : result.errorMessage || 'An error occurred');
                        return [2 /*return*/];
                    }
                    image = (_a = result.assets) === null || _a === void 0 ? void 0 : _a[0];
                    if (!image)
                        return [2 /*return*/];
                    return [4 /*yield*/, fetch(image.uri)];
                case 2: return [4 /*yield*/, (_e.sent()).blob()];
                case 3:
                    blob = _e.sent();
                    actualSize = blob.size // image.size is incorrect by an unpredictable margin
                    ;
                    _e.label = 4;
                case 4:
                    _e.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, handleUpload({
                            name: image.fileName,
                            size: actualSize,
                            type: image.type,
                        }, {
                            uri: image.uri,
                            name: image.fileName,
                            type: image.type,
                        })];
                case 5:
                    file = _e.sent();
                    onUpload(file, ((_c = (_b = result.assets) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.duration) ? 'video' : 'image');
                    setMenuOpen(false);
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _e.sent();
                    setErrorMessage((_d = err_1 === null || err_1 === void 0 ? void 0 : err_1.message) !== null && _d !== void 0 ? _d : err_1.toString());
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var menuDisabled = uploading || disabled;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(react_native_1.Modal, __assign({ animationType: 'fade', transparent: true, visible: menuOpen, onRequestClose: function () { return setMenuOpen(false); } }, { children: (0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ flex: 1, alignItems: "center", justifyContent: "center" }, { children: (0, jsx_runtime_1.jsxs)(react_components_1.Paper, __assign({ flex: true, style: { padding: 25, margin: 10, } }, { children: [(0, jsx_runtime_1.jsx)(react_components_1.Button, __assign({ disabled: menuDisabled, variant: "contained", onPress: function () { return handleImageSelect('library'); }, style: { marginBottom: 20, fontSize: 18, padding: 10 } }, { children: "Upload Photo or Video" })), (0, jsx_runtime_1.jsx)(react_components_1.Button, __assign({ disabled: menuDisabled, variant: "contained", onPress: function () { return handleImageSelect('camera'); }, style: { fontSize: 18, padding: 10 } }, { children: "Take Photo" })), (0, jsx_runtime_1.jsx)(react_components_1.Button, __assign({ variant: 'outlined', onPress: function () { return setMenuOpen(false); }, style: { marginTop: 25 } }, { children: "Cancel" })), (0, jsx_runtime_1.jsx)(react_components_1.Typography, __assign({ style: { marginTop: 5, color: '#ff4444' } }, { children: errorMessage }))] })) })) })), (0, jsx_runtime_1.jsx)(react_components_1.LabeledIconButton, { label: "attach image", disabled: menuDisabled, onClick: function () { return setMenuOpen(true); }, Icon: function () { return (0, jsx_runtime_1.jsx)(react_native_paper_1.Avatar.Icon, { icon: 'image', size: CHAT_ICON_SIZE }); } })] }));
};
var SendMessage = function (_a) {
    var roomId = _a.roomId, _b = _a.placeholderText, placeholderText = _b === void 0 ? "Enter a message" : _b, _c = _a.style, style = _c === void 0 ? {} : _c;
    var _d = (0, react_1.useState)(''), message = _d[0], setMessage = _d[1];
    var _e = (0, react_1.useState)(false), sending = _e[0], setSending = _e[1];
    var _f = (0, react_components_1.useChats)(roomId), createMessage = _f[1].createElement;
    return ((0, jsx_runtime_1.jsxs)(react_components_1.Flex, __assign({ row: true, flex: 1, alignContent: "center", style: __assign({ marginTop: 8 }, style) }, { children: [(0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ column: true, flex: 1, style: { marginLeft: 5, marginRight: 5 } }, { children: (0, jsx_runtime_1.jsx)(react_native_1.TextInput, { value: message, onChangeText: setMessage, style: {
                        width: '100%',
                        borderColor: '#0f0f0f',
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 5,
                    }, "aria-label": "Enter a message...", placeholder: placeholderText }) })), (0, jsx_runtime_1.jsxs)(react_components_1.Flex, __assign({ alignSelf: "center" }, { children: [(0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ style: { marginRight: 5 } }, { children: (0, jsx_runtime_1.jsx)(react_components_1.AsyncIconButton, { label: "send", Icon: function () { return (0, jsx_runtime_1.jsx)(react_components_1.SendIcon, { size: CHAT_ICON_SIZE }); }, disabled: message === '', action: function () { return createMessage({ message: message, roomId: roomId }); }, onSuccess: function () { return setMessage(''); }, onChange: setSending }) })), (0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ style: { marginRight: 5 } }, { children: (0, jsx_runtime_1.jsx)(SendImageOrVideo, { disabled: sending, onUpload: function (_a, type) {
                                var secureName = _a.secureName;
                                return __awaiter(void 0, void 0, void 0, function () {
                                    var err_2;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                setSending(true);
                                                _b.label = 1;
                                            case 1:
                                                _b.trys.push([1, 3, 4, 5]);
                                                return [4 /*yield*/, createMessage({
                                                        roomId: roomId,
                                                        message: '',
                                                        attachments: [{ type: type, secureName: secureName }]
                                                    })];
                                            case 2:
                                                _b.sent();
                                                return [3 /*break*/, 5];
                                            case 3:
                                                err_2 = _b.sent();
                                                console.error(err_2);
                                                return [3 /*break*/, 5];
                                            case 4:
                                                setSending(false);
                                                return [7 /*endfinally*/];
                                            case 5: return [2 /*return*/];
                                        }
                                    });
                                });
                            } }) }))] }))] })));
};
exports.SendMessage = SendMessage;
//# sourceMappingURL=components.native.js.map