/** @internal */
export type ByteUtils = {
    /** Transforms the input to an instance of Buffer if running on node, otherwise Uint8Array */
    toLocalBufferType(buffer: Uint8Array | ArrayBufferView | ArrayBuffer): Uint8Array;
    /** Create empty space of size */
    allocate: (size: number) => Uint8Array;
    /** Check if two Uint8Arrays are deep equal */
    equals: (a: Uint8Array, b: Uint8Array) => boolean;
    /** Check if two Uint8Arrays are deep equal */
    fromNumberArray: (array: number[]) => Uint8Array;
    /** Create a Uint8Array from a base64 string */
    fromBase64: (base64: string) => Uint8Array;
    /** Create a base64 string from bytes */
    toBase64: (buffer: Uint8Array) => string;
    /** **Legacy** binary strings are an outdated method of data transfer. Do not add public API support for interpreting this format */
    fromISO88591: (codePoints: string) => Uint8Array;
    /** **Legacy** binary strings are an outdated method of data transfer. Do not add public API support for interpreting this format */
    toISO88591: (buffer: Uint8Array) => string;
    /** Create a Uint8Array from a hex string */
    fromHex: (hex: string) => Uint8Array;
    /** Create a hex string from bytes */
    toHex: (buffer: Uint8Array) => string;
    /** Create a Uint8Array containing utf8 code units from a string */
    fromUTF8: (text: string) => Uint8Array;
    /** Create a string from utf8 code units */
    toUTF8: (buffer: Uint8Array, start: number, end: number) => string;
    /** Get the utf8 code unit count from a string if it were to be transformed to utf8 */
    utf8ByteLength: (input: string) => number;
    /** Encode UTF8 bytes generated from `source` string into `destination` at byteOffset. Returns the number of bytes encoded. */
    encodeUTF8Into(destination: Uint8Array, source: string, byteOffset: number): number;
    /** Generate a Uint8Array filled with random bytes with byteLength */
    randomBytes(byteLength: number): Uint8Array;
};
/**
 * This is the only ByteUtils that should be used across the rest of the BSON library.
 *
 * The type annotation is important here, it asserts that each of the platform specific
 * utils implementations are compatible with the common one.
 *
 * @internal
 */
export declare const ByteUtils: ByteUtils;
export declare class BSONDataView extends DataView {
    static fromUint8Array(input: Uint8Array): DataView;
}
//# sourceMappingURL=byte_utils.d.ts.map