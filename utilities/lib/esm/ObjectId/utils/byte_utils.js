var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _a;
import { nodeJsByteUtils } from './node_byte_utils';
import { webByteUtils } from './web_byte_utils';
/**
 * Check that a global Buffer exists that is a function and
 * does not have a '_isBuffer' property defined on the prototype
 * (this is to prevent using the npm buffer)
 */
var hasGlobalBuffer = typeof Buffer === 'function' && ((_a = Buffer.prototype) === null || _a === void 0 ? void 0 : _a._isBuffer) !== true;
/**
 * This is the only ByteUtils that should be used across the rest of the BSON library.
 *
 * The type annotation is important here, it asserts that each of the platform specific
 * utils implementations are compatible with the common one.
 *
 * @internal
 */
export var ByteUtils = hasGlobalBuffer ? nodeJsByteUtils : webByteUtils;
var BSONDataView = /** @class */ (function (_super) {
    __extends(BSONDataView, _super);
    function BSONDataView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BSONDataView.fromUint8Array = function (input) {
        return new DataView(input.buffer, input.byteOffset, input.byteLength);
    };
    return BSONDataView;
}(DataView));
export { BSONDataView };
//# sourceMappingURL=byte_utils.js.map