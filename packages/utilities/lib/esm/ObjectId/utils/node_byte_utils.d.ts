type NodeJsEncoding = 'base64' | 'hex' | 'utf8' | 'binary';
type NodeJsBuffer = ArrayBufferView & Uint8Array & {
    write(string: string, offset: number, length: undefined, encoding: 'utf8'): number;
    copy(target: Uint8Array, targetStart: number, sourceStart: number, sourceEnd: number): number;
    toString: (this: Uint8Array, encoding: NodeJsEncoding, start?: number, end?: number) => string;
    equals: (this: Uint8Array, other: Uint8Array) => boolean;
};
/** @internal */
export declare function nodejsMathRandomBytes(byteLength: number): NodeJsBuffer;
/** @internal */
export declare const nodeJsByteUtils: {
    toLocalBufferType(potentialBuffer: Uint8Array | NodeJsBuffer | ArrayBuffer): NodeJsBuffer;
    allocate(size: number): NodeJsBuffer;
    equals(a: Uint8Array, b: Uint8Array): boolean;
    fromNumberArray(array: number[]): NodeJsBuffer;
    fromBase64(base64: string): NodeJsBuffer;
    toBase64(buffer: Uint8Array): string;
    /** **Legacy** binary strings are an outdated method of data transfer. Do not add public API support for interpreting this format */
    fromISO88591(codePoints: string): NodeJsBuffer;
    /** **Legacy** binary strings are an outdated method of data transfer. Do not add public API support for interpreting this format */
    toISO88591(buffer: Uint8Array): string;
    fromHex(hex: string): NodeJsBuffer;
    toHex(buffer: Uint8Array): string;
    fromUTF8(text: string): NodeJsBuffer;
    toUTF8(buffer: Uint8Array, start: number, end: number): string;
    utf8ByteLength(input: string): number;
    encodeUTF8Into(buffer: Uint8Array, source: string, byteOffset: number): number;
    randomBytes: (byteLength: number) => Uint8Array;
};
export {};
//# sourceMappingURL=node_byte_utils.d.ts.map