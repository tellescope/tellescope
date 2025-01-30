"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resolver = exports.LoadingData = exports.value_is_loaded = exports.LoadingLinear = exports.renderDefaultError = exports.LoadingStatus = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var types_utilities_1 = require("@tellescope/types-utilities");
Object.defineProperty(exports, "LoadingStatus", { enumerable: true, get: function () { return types_utilities_1.LoadingStatus; } });
var mui_1 = require("./mui");
var renderDefaultError = function (error) {
    var _a;
    console.error(error);
    return (0, jsx_runtime_1.jsx)(mui_1.Typography, { children: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : 'An error occurred' });
};
exports.renderDefaultError = renderDefaultError;
var LoadingLinear = function (_a) {
    var data = _a.data, render = _a.render, _b = _a.onError, onError = _b === void 0 ? exports.renderDefaultError : _b;
    if (data.status === types_utilities_1.LoadingStatus.Loaded)
        return render(data.value);
    if (data.status === types_utilities_1.LoadingStatus.Error)
        return onError(data.value);
    return (0, jsx_runtime_1.jsx)(mui_1.LinearProgress, {});
};
exports.LoadingLinear = LoadingLinear;
var value_is_loaded = function (data) { return (data.status === types_utilities_1.LoadingStatus.Loaded); };
exports.value_is_loaded = value_is_loaded;
var LoadingData = function (_a) {
    var data = _a.data, render = _a.render, _b = _a.onError, onError = _b === void 0 ? exports.renderDefaultError : _b;
    var values = Object.values(data);
    var error = values.find(function (v) { return v.status === types_utilities_1.LoadingStatus.Error; });
    if (error) {
        return onError(error.value);
    }
    // if anything is still loading
    if (values.find(function (v) { return v.status !== types_utilities_1.LoadingStatus.Loaded; })) {
        return (0, jsx_runtime_1.jsx)(mui_1.LinearProgress, {});
    }
    var loadedData = {};
    for (var k in data) {
        loadedData[k] = data[k].value;
    }
    return render(loadedData);
};
exports.LoadingData = LoadingData;
var Resolver = function (p) {
    var item = p.item, resolver = p.resolver, initialValue = p.initialValue;
    var _a = (0, react_1.useState)(initialValue !== null && initialValue !== void 0 ? initialValue : null), resolved = _a[0], setResolved = _a[1];
    (0, react_1.useEffect)(function () {
        setResolved(resolver(item));
    }, [resolver]);
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: resolved });
};
exports.Resolver = Resolver;
//# sourceMappingURL=loading.js.map