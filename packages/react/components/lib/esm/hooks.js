var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useEffect, useRef, useState } from "react";
import { LoadingStatus, UNLOADED, } from "@tellescope/types-utilities";
import { objects_equivalent, } from "@tellescope/utilities";
export var useLoadedState = function (fetch, dependencies) {
    var fetchedRef = useRef(undefined);
    var _a = useState(UNLOADED), data = _a[0], setData = _a[1];
    useEffect(function () {
        var _a;
        if (!fetch)
            return;
        if (dependencies && objects_equivalent(dependencies, (_a = fetchedRef.current) !== null && _a !== void 0 ? _a : undefined))
            return;
        if (fetchedRef.current === null)
            return;
        fetchedRef.current = dependencies !== null && dependencies !== void 0 ? dependencies : null;
        fetch(dependencies !== null && dependencies !== void 0 ? dependencies : {})
            .then(function (value) { return setData(value ? { status: LoadingStatus.Loaded, value: value } : UNLOADED); })
            .catch(function (error) { return setData({ status: LoadingStatus.Error, value: error }); });
    }, __spreadArray(__spreadArray([fetch], Object.values(dependencies !== null && dependencies !== void 0 ? dependencies : []), true), [fetchedRef], false));
    return [data, setData];
};
export var useSearchAPI = function (_a) {
    var query = _a.query, onLoad = _a.onLoad, searchAPI = _a.searchAPI;
    var searchedRef = useRef('');
    useEffect(function () {
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
export var useAddGTMTag = function (gtmTag) {
    useEffect(function () {
        if (!gtmTag)
            return;
        try {
            var existingScript = document.querySelector("script[src*=\"https://www.googletagmanager.com/gtm.js?id=".concat(gtmTag, "\"]"));
            if (existingScript)
                return;
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.text = "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\n  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\n  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n  })(window,document,'script','dataLayer','".concat(gtmTag, "');");
            document.head.appendChild(script);
        }
        catch (err) {
            console.warn(err);
        }
    }, [gtmTag]);
};
//# sourceMappingURL=hooks.js.map