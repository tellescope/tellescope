"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertUnreachable = exports.isFileBlob = exports.isErrorCode = exports.UNLOADED = exports.LoadingStatus = void 0;
var LoadingStatus;
(function (LoadingStatus) {
    LoadingStatus[LoadingStatus["Unloaded"] = 0] = "Unloaded";
    LoadingStatus[LoadingStatus["Fetching"] = 1] = "Fetching";
    LoadingStatus[LoadingStatus["Error"] = 2] = "Error";
    LoadingStatus[LoadingStatus["Loaded"] = 3] = "Loaded";
})(LoadingStatus = exports.LoadingStatus || (exports.LoadingStatus = {}));
exports.UNLOADED = {
    status: LoadingStatus.Unloaded,
    value: undefined,
};
var isErrorCode = function (c) {
    return [400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 429, 500].includes(c);
};
exports.isErrorCode = isErrorCode;
var isFileBlob = function (f) {
    return typeof f === 'object' && typeof f.name === 'string' && typeof f.size === 'number' &&
        typeof f.type === 'string';
};
exports.isFileBlob = isFileBlob;
var assertUnreachable = function (x) {
    throw new Error("Reached invalid code - conditional logic is likely not exhaustive");
};
exports.assertUnreachable = assertUnreachable;
//# sourceMappingURL=index.js.map