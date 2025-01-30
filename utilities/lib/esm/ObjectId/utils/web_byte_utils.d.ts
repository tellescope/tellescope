type ArrayBufferViewWithTag = ArrayBufferView & {
    [Symbol.toStringTag]?: string;
};
/** @internal */
export declare function webMathRandomBytes(byteLength: number): Uint8Array;
/** @internal */
export declare const webByteUtils: {
    toLocalBufferType(potentialUint8array: Uint8Array | ArrayBufferViewWithTag | ArrayBuffer): Uint8Array;
    allocate(size: number): Uint8Array;
    equals(a: Uint8Array, b: Uint8Array): boolean;
    fromNumberArray(array: number[]): Uint8Array;
    fromBase64(base64: string): Uint8Array;
    toBase64(uint8array: Uint8Array): string;
    /** **Legacy** binary strings are an outdated method of data transfer. Do not add public API support for interpreting this format */
    fromISO88591(codePoints: string): Uint8Array;
    /** **Legacy** binary strings are an outdated method of data transfer. Do not add public API support for interpreting this format */
    toISO88591(uint8array: Uint8Array): string;
    fromHex(hex: string): Uint8Array;
    toHex(uint8array: Uint8Array): string;
    fromUTF8(text: string): Uint8Array;
    toUTF8(uint8array: Uint8Array, start: number, end: number): string;
    utf8ByteLength(input: string): number;
    encodeUTF8Into(buffer: Uint8Array, source: string, byteOffset: number): number;
    randomBytes: (byteLength: number) => Uint8Array;
};
export {};
//# sourceMappingURL=web_byte_utils.d.ts.map