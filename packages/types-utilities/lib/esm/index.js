export var LoadingStatus;
(function (LoadingStatus) {
    LoadingStatus[LoadingStatus["Unloaded"] = 0] = "Unloaded";
    LoadingStatus[LoadingStatus["Fetching"] = 1] = "Fetching";
    LoadingStatus[LoadingStatus["Error"] = 2] = "Error";
    LoadingStatus[LoadingStatus["Loaded"] = 3] = "Loaded";
})(LoadingStatus || (LoadingStatus = {}));
export var UNLOADED = {
    status: LoadingStatus.Unloaded,
    value: undefined,
};
export var isErrorCode = function (c) {
    return [400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 429, 500].includes(c);
};
export var isFileBlob = function (f) {
    return typeof f === 'object' && typeof f.name === 'string' && typeof f.size === 'number' &&
        typeof f.type === 'string';
};
export var assertUnreachable = function (x) {
    throw new Error("Reached invalid code - conditional logic is likely not exhaustive");
};
//# sourceMappingURL=index.js.map