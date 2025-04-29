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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replace_links = exports.useDisplayInfoForSenderId = exports.ResolveDisplayName = exports.DisplayNameForUser = exports.DisplayNameForEnduser = exports.ResolveDisplayPicture = exports.DisplayPictureForUser = exports.DisplayPictureForEnduser = exports.DisplayPictureForSelf = exports.useUserForId = exports.useEnduserForId = exports.elapsed_time_display_string = exports.DisplayPicture = exports.SecureVideo = exports.SecureImage = exports.useFileForSecureName = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var utilities_1 = require("@tellescope/utilities");
var index_1 = require("./index");
var mui_1 = require("./mui");
var _1 = require(".");
var layout_1 = require("./layout");
// supports actual secureName as well as URL values
var useFileForSecureName = function (_a) {
    var _b;
    var secureName = _a.secureName, onError = _a.onError, _c = _a.cacheKey, cacheKey = _c === void 0 ? secureName : _c, onLoad = _a.onLoad, preferInBrowser = _a.preferInBrowser;
    var session = (0, _1.useResolvedSession)();
    var _d = (0, react_1.useState)([]), loadedImages = _d[0], setLoadedImages = _d[1];
    var fetchRef = (0, react_1.useRef)({});
    (0, react_1.useEffect)(function () {
        if (!secureName)
            return;
        if (secureName.startsWith('http'))
            return; // not actually a secureName
        if (loadedImages.find(function (i) { return i.cacheKey === cacheKey; }))
            return;
        if (fetchRef.current[cacheKey])
            return; // already fetching
        fetchRef.current[cacheKey] = true;
        session === null || session === void 0 ? void 0 : session.api.files.file_download_URL({ secureName: secureName, preferInBrowser: preferInBrowser }).then(function (_a) {
            var downloadURL = _a.downloadURL, name = _a.name;
            onLoad === null || onLoad === void 0 ? void 0 : onLoad({ downloadURL: downloadURL, name: name });
            if (name.toLowerCase().endsWith('heic') || name.toLowerCase().endsWith('heif')) {
                (0, index_1.convertHEIC)(downloadURL)
                    .then(function (downloadURL) {
                    setLoadedImages(function (ls) { return __spreadArray(__spreadArray([], ls, true), [{ uri: downloadURL, cacheKey: cacheKey, name: name }], false); });
                })
                    .catch(console.error);
            }
            else {
                setLoadedImages(function (ls) { return __spreadArray(__spreadArray([], ls, true), [{ uri: downloadURL, cacheKey: cacheKey, name: name }], false); });
            }
        }).catch(function (err) {
            if (onError)
                onError === null || onError === void 0 ? void 0 : onError(err);
            else
                console.warn("Error getting url for DisplayPicture", err);
        });
    }, [cacheKey, fetchRef, secureName, loadedImages, onError, session, onLoad, preferInBrowser]);
    return (secureName.startsWith('http')
        ? secureName
        : (((_b = loadedImages.find(function (i) { return i.cacheKey === cacheKey; })) === null || _b === void 0 ? void 0 : _b.uri) || ''));
};
exports.useFileForSecureName = useFileForSecureName;
var SecureImage = function (_a) {
    var secureName = _a.secureName, placeholder = _a.placeholder, onImageClick = _a.onImageClick, props = __rest(_a, ["secureName", "placeholder", "onImageClick"]);
    var loadedImage = (0, exports.useFileForSecureName)({ secureName: secureName });
    // if user doesn't have picture, or it's still loading
    if (loadedImage === '')
        return placeholder !== null && placeholder !== void 0 ? placeholder : null;
    return ((0, jsx_runtime_1.jsx)(layout_1.Image, __assign({ src: loadedImage }, props, { onClick: function () { return onImageClick === null || onImageClick === void 0 ? void 0 : onImageClick({ src: loadedImage }); } })));
};
exports.SecureImage = SecureImage;
var SecureVideo = function (_a) {
    var secureName = _a.secureName, placeholder = _a.placeholder, props = __rest(_a, ["secureName", "placeholder"]);
    var loadedVideo = (0, exports.useFileForSecureName)({ secureName: secureName });
    // if user doesn't have picture, or it's still loading
    if (loadedVideo === '')
        return placeholder !== null && placeholder !== void 0 ? placeholder : null;
    return ((0, jsx_runtime_1.jsx)(layout_1.Video, { src: loadedVideo, dimensions: props }));
};
exports.SecureVideo = SecureVideo;
var DisplayPicture = function (_a) {
    var _b, _c, _d, _e, _f;
    var user = _a.user, onError = _a.onError, avatarProps = __rest(_a, ["user", "onError"]);
    var loadedImage = (0, exports.useFileForSecureName)({
        secureName: (_b = user === null || user === void 0 ? void 0 : user.avatar) !== null && _b !== void 0 ? _b : '',
        cacheKey: ((_c = user === null || user === void 0 ? void 0 : user.id) !== null && _c !== void 0 ? _c : '') + ((_d = user === null || user === void 0 ? void 0 : user.avatar) !== null && _d !== void 0 ? _d : ''),
    });
    // if user doesn't have picture, or it's still loading
    if (loadedImage === '') {
        var letters = "".concat((user === null || user === void 0 ? void 0 : user.fname) ? user.fname[0] : '').concat((user === null || user === void 0 ? void 0 : user.lname) ? user.lname[0] : '');
        return ((0, jsx_runtime_1.jsx)(mui_1.Avatar, __assign({ letters: letters || ((_f = (_e = user === null || user === void 0 ? void 0 : user.displayName) === null || _e === void 0 ? void 0 : _e.substring(0, 2)) === null || _f === void 0 ? void 0 : _f.toUpperCase()) }, avatarProps)));
    }
    return ((0, jsx_runtime_1.jsx)(mui_1.Avatar, __assign({}, avatarProps, { src: loadedImage })));
};
exports.DisplayPicture = DisplayPicture;
var elapsed_time_display_string = function (date) {
    var elapsedSeconds = (Date.now() - date.getTime()) / 1000;
    if (elapsedSeconds < 60)
        return "".concat(Math.ceil(elapsedSeconds), " seconds ago");
    if (elapsedSeconds < 60 * 60) {
        return "".concat(Math.floor(elapsedSeconds / (60)), " minutes ago");
    }
    if (elapsedSeconds < 60 * 60 * 24) {
        return "".concat(Math.floor(elapsedSeconds / (60 * 60)), " hours ago");
    }
    return "".concat(Math.floor(elapsedSeconds / (60 * 60 * 24)), " days ago");
};
exports.elapsed_time_display_string = elapsed_time_display_string;
var useEnduserForId = function (enduserId) {
    var _a = (0, index_1.useEndusers)(), findById = _a[1].findById;
    return findById(enduserId);
};
exports.useEnduserForId = useEnduserForId;
var useUserForId = function (userId) {
    var usersLoading = (0, index_1.useUsers)()[0];
    return (0, index_1.value_is_loaded)(usersLoading) ? usersLoading.value.find(function (u) { return u.id === userId; }) : undefined;
};
exports.useUserForId = useUserForId;
var DisplayPictureForSelf = function (props) {
    var user = (0, _1.useResolvedSession)().userInfo;
    return (0, jsx_runtime_1.jsx)(exports.DisplayPicture, __assign({ user: user }, props));
};
exports.DisplayPictureForSelf = DisplayPictureForSelf;
var DisplayPictureForEnduser = function (_a) {
    var id = _a.id, props = __rest(_a, ["id"]);
    var enduser = (0, exports.useEnduserForId)(id);
    return (0, jsx_runtime_1.jsx)(exports.DisplayPicture, __assign({ user: enduser }, props));
};
exports.DisplayPictureForEnduser = DisplayPictureForEnduser;
var DisplayPictureForUser = function (_a) {
    var id = _a.id, props = __rest(_a, ["id"]);
    var user = (0, exports.useUserForId)(id);
    return (0, jsx_runtime_1.jsx)(exports.DisplayPicture, __assign({ user: user }, props));
};
exports.DisplayPictureForUser = DisplayPictureForUser;
var ResolveDisplayPicture = function (_a) {
    var type = _a.type, props = __rest(_a, ["type"]);
    if (type === 'enduser')
        return (0, jsx_runtime_1.jsx)(exports.DisplayPictureForEnduser, __assign({}, props));
    return (0, jsx_runtime_1.jsx)(exports.DisplayPictureForUser, __assign({}, props));
};
exports.ResolveDisplayPicture = ResolveDisplayPicture;
var DisplayNameForEnduser = function (_a) {
    var id = _a.id, props = __rest(_a, ["id"]);
    var enduser = (0, exports.useEnduserForId)(id);
    if (!enduser)
        return null;
    return (0, jsx_runtime_1.jsx)(index_1.Typography, __assign({}, props, { children: (0, utilities_1.user_display_name)(enduser) }));
};
exports.DisplayNameForEnduser = DisplayNameForEnduser;
var DisplayNameForUser = function (_a) {
    var id = _a.id, props = __rest(_a, ["id"]);
    var user = (0, exports.useUserForId)(id);
    if (!user)
        return null;
    return (0, jsx_runtime_1.jsx)(index_1.Typography, __assign({}, props, { children: (0, utilities_1.user_display_name)(user) }));
};
exports.DisplayNameForUser = DisplayNameForUser;
var ResolveDisplayName = function (_a) {
    var type = _a.type, props = __rest(_a, ["type"]);
    if (type === 'enduser')
        return (0, jsx_runtime_1.jsx)(exports.DisplayNameForEnduser, __assign({}, props));
    return (0, jsx_runtime_1.jsx)(exports.DisplayNameForUser, __assign({}, props));
};
exports.ResolveDisplayName = ResolveDisplayName;
var useDisplayInfoForSenderId = function (id) {
    var _a;
    var session = (0, _1.useResolvedSession)();
    var _b = (0, index_1.useUsers)(), findUser = _b[1].findById;
    var _c = (0, index_1.useEndusers)(), findEnduser = _c[1].findById;
    if (session.userInfo.id === id)
        return session.userInfo;
    return (_a = findUser(id)) !== null && _a !== void 0 ? _a : findEnduser(id);
};
exports.useDisplayInfoForSenderId = useDisplayInfoForSenderId;
var WHITE_SPACE_EXP = /^\s*$/;
var is_whitespace = function (str) { return WHITE_SPACE_EXP.test(str); };
var _a = [0, 1, 2, 3, 4, 5], LINK_START = _a[0], LINK_END = _a[1], TEXT_START = _a[2], TEXT_END = _a[3], STYLE_START = _a[4], STYLE_END = _a[5];
var find_link = function (text, startFrom) {
    var start = 0;
    var state = LINK_START;
    var linkChars = [];
    var linkTextChars = [];
    for (var i = startFrom || 0; i < text.length; i++) {
        var char = text[i];
        if (state === LINK_START) {
            if (char === '{') {
                start = i;
                state = LINK_END;
            }
        }
        else if (state === LINK_END) {
            if (char === '}') {
                state = TEXT_START;
            }
            else {
                linkChars.push(char);
            }
        }
        else if (state === TEXT_START) {
            if (char === '[') {
                state = TEXT_END;
            }
            else if (!is_whitespace(char)) { // only allow whitespace between {link} and [linkText]
                start = 0;
                linkChars = [];
                state = LINK_START; // start seeking new link
            }
        }
        else {
            if (char === ']') {
                return {
                    start: start,
                    end: i,
                    link: linkChars.join(''),
                    linkText: linkTextChars.join('')
                };
            }
            else {
                linkTextChars.push(char);
            }
        }
    }
    return undefined;
};
var find_link_style = function (text, startFrom) {
    var state = STYLE_START;
    var textChars = [];
    var styleChars = [];
    for (var i = startFrom || 0; i < text.length; i++) {
        var char = text[i];
        if (state === STYLE_START) {
            if (char === '<') {
                state = STYLE_END;
            }
            else {
                textChars.push(char);
            }
        }
        else if (state === STYLE_END) {
            if (char === '>') {
                return {
                    unstyledText: textChars.join(''),
                    style: styleChars.join(''),
                };
            }
            else {
                styleChars.push(char);
            }
        }
    }
    return { unstyledText: text, style: '' };
};
var replace_links = function (html) {
    var foundLink = undefined;
    while ((foundLink = find_link(html))) {
        var link = foundLink.link, linkText = foundLink.linkText;
        var _a = find_link_style(linkText), _unstyledText = _a.unstyledText, style = _a.style;
        var linkTemplate = "{".concat(link, "}[").concat(linkText, "]");
        if (linkText === "$LINK_ONLY") {
            if (html !== undefined && typeof html === 'string') {
                html = html.replace(linkTemplate, link);
            }
            continue;
        }
        // if _unstyled text is empty, undefined, etc, default to the link itself
        var unstyledText = ((typeof _unstyledText === 'string' && !(_unstyledText === null || _unstyledText === void 0 ? void 0 : _unstyledText.trim()))
            ? link
            : !_unstyledText
                ? link
                : _unstyledText === 'undefined'
                    ? link
                    : _unstyledText);
        var replacementHTML = ("<a".concat(style ? " style=\"".concat(style, "\"") : '', " href=\"").concat(link, "\" target=\"_blank\">").concat(unstyledText, "</a>"));
        html = html.replace(linkTemplate, replacementHTML);
    }
    return (0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: { __html: html } });
};
exports.replace_links = replace_links;
//# sourceMappingURL=displays.js.map