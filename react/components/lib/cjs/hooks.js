"use strict";
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
exports.useSearchAPI = exports.useLoadedState = void 0;
var react_1 = require("react");
var types_utilities_1 = require("@tellescope/types-utilities");
var utilities_1 = require("@tellescope/utilities");
var useLoadedState = function (fetch, dependencies) {
    var fetchedRef = (0, react_1.useRef)(undefined);
    var _a = (0, react_1.useState)(types_utilities_1.UNLOADED), data = _a[0], setData = _a[1];
    (0, react_1.useEffect)(function () {
        var _a;
        if (!fetch)
            return;
        if (dependencies && (0, utilities_1.objects_equivalent)(dependencies, (_a = fetchedRef.current) !== null && _a !== void 0 ? _a : undefined))
            return;
        if (fetchedRef.current === null)
            return;
        fetchedRef.current = dependencies !== null && dependencies !== void 0 ? dependencies : null;
        fetch(dependencies !== null && dependencies !== void 0 ? dependencies : {})
            .then(function (value) { return setData(value ? { status: types_utilities_1.LoadingStatus.Loaded, value: value } : types_utilities_1.UNLOADED); })
            .catch(function (error) { return setData({ status: types_utilities_1.LoadingStatus.Error, value: error }); });
    }, __spreadArray(__spreadArray([fetch], Object.values(dependencies !== null && dependencies !== void 0 ? dependencies : []), true), [fetchedRef], false));
    return [data, setData];
};
exports.useLoadedState = useLoadedState;
var useSearchAPI = function (_a) {
    var query = _a.query, onLoad = _a.onLoad, searchAPI = _a.searchAPI;
    var searchedRef = (0, react_1.useRef)('');
    (0, react_1.useEffect)(function () {
        var trimmed = query === null || query === void 0 ? void 0 : query.trim();
        // don't search empty strings
        if (!trimmed)
            return;
        if (!searchAPI)
            return;
        if (searchedRef.current === trimmed)
            return;
        // unbounce  
        var t = setTimeout(function () {
            searchedRef.current = trimmed; // only update on successful trigger of search
            // console.log('searching')
            searchAPI({ search: { query: trimmed } })
                .then(function (results) {
                // console.log('got results', results)
                if (results.length === 0) {
                    return;
                }
                onLoad === null || onLoad === void 0 ? void 0 : onLoad(results);
            })
                .catch(console.error);
        }, 150);
        return function () { clearTimeout(t); };
    }, [query, searchAPI, onLoad, searchedRef]);
};
exports.useSearchAPI = useSearchAPI;
//# sourceMappingURL=hooks.js.map