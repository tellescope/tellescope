export function isAnyArrayBuffer(value) {
    return ['[object ArrayBuffer]', '[object SharedArrayBuffer]'].includes(Object.prototype.toString.call(value));
}
export function isUint8Array(value) {
    return Object.prototype.toString.call(value) === '[object Uint8Array]';
}
export function isBigInt64Array(value) {
    return Object.prototype.toString.call(value) === '[object BigInt64Array]';
}
export function isBigUInt64Array(value) {
    return Object.prototype.toString.call(value) === '[object BigUint64Array]';
}
export function isRegExp(d) {
    return Object.prototype.toString.call(d) === '[object RegExp]';
}
export function isMap(d) {
    return Object.prototype.toString.call(d) === '[object Map]';
}
export function isDate(d) {
    return Object.prototype.toString.call(d) === '[object Date]';
}
//# sourceMappingURL=utils.js.map