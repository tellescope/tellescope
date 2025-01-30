import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { LoadingStatus, } from "@tellescope/types-utilities";
import { LinearProgress, Typography, } from "./mui";
export { LoadingStatus };
export var renderDefaultError = function (error) {
    var _a;
    console.error(error);
    return _jsx(Typography, { children: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : 'An error occurred' });
};
export var LoadingLinear = function (_a) {
    var data = _a.data, render = _a.render, _b = _a.onError, onError = _b === void 0 ? renderDefaultError : _b;
    if (data.status === LoadingStatus.Loaded)
        return render(data.value);
    if (data.status === LoadingStatus.Error)
        return onError(data.value);
    return _jsx(LinearProgress, {});
};
export var value_is_loaded = function (data) { return (data.status === LoadingStatus.Loaded); };
export var LoadingData = function (_a) {
    var data = _a.data, render = _a.render, _b = _a.onError, onError = _b === void 0 ? renderDefaultError : _b;
    var values = Object.values(data);
    var error = values.find(function (v) { return v.status === LoadingStatus.Error; });
    if (error) {
        return onError(error.value);
    }
    // if anything is still loading
    if (values.find(function (v) { return v.status !== LoadingStatus.Loaded; })) {
        return _jsx(LinearProgress, {});
    }
    var loadedData = {};
    for (var k in data) {
        loadedData[k] = data[k].value;
    }
    return render(loadedData);
};
export var Resolver = function (p) {
    var item = p.item, resolver = p.resolver, initialValue = p.initialValue;
    var _a = useState(initialValue !== null && initialValue !== void 0 ? initialValue : null), resolved = _a[0], setResolved = _a[1];
    useEffect(function () {
        setResolved(resolver(item));
    }, [resolver]);
    return _jsx(_Fragment, { children: resolved });
};
//# sourceMappingURL=loading.js.map