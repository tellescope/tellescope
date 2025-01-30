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
import { BSON_MAJOR_VERSION } from './constants';
/**
 * @public
 * @category Error
 *
 * `BSONError` objects are thrown when BSON ecounters an error.
 *
 * This is the parent class for all the other errors thrown by this library.
 */
var BSONError = /** @class */ (function (_super) {
    __extends(BSONError, _super);
    function BSONError(message) {
        return _super.call(this, message) || this;
    }
    Object.defineProperty(BSONError.prototype, "bsonError", {
        /**
         * @internal
         * The underlying algorithm for isBSONError may change to improve how strict it is
         * about determining if an input is a BSONError. But it must remain backwards compatible
         * with previous minors & patches of the current major version.
         */
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BSONError.prototype, "name", {
        get: function () {
            return 'BSONError';
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @public
     *
     * All errors thrown from the BSON library inherit from `BSONError`.
     * This method can assist with determining if an error originates from the BSON library
     * even if it does not pass an `instanceof` check against this class' constructor.
     *
     * @param value - any javascript value that needs type checking
     */
    BSONError.isBSONError = function (value) {
        return (value != null &&
            typeof value === 'object' &&
            'bsonError' in value &&
            value.bsonError === true &&
            // Do not access the following properties, just check existence
            'name' in value &&
            'message' in value &&
            'stack' in value);
    };
    return BSONError;
}(Error));
export { BSONError };
/**
 * @public
 * @category Error
 */
var BSONVersionError = /** @class */ (function (_super) {
    __extends(BSONVersionError, _super);
    function BSONVersionError() {
        return _super.call(this, "Unsupported BSON version, bson types must be from bson ".concat(BSON_MAJOR_VERSION, ".x.x")) || this;
    }
    Object.defineProperty(BSONVersionError.prototype, "name", {
        get: function () {
            return 'BSONVersionError';
        },
        enumerable: false,
        configurable: true
    });
    return BSONVersionError;
}(BSONError));
export { BSONVersionError };
/**
 * @public
 * @category Error
 *
 * An error generated when BSON functions encounter an unexpected input
 * or reaches an unexpected/invalid internal state
 *
 */
var BSONRuntimeError = /** @class */ (function (_super) {
    __extends(BSONRuntimeError, _super);
    function BSONRuntimeError(message) {
        return _super.call(this, message) || this;
    }
    Object.defineProperty(BSONRuntimeError.prototype, "name", {
        get: function () {
            return 'BSONRuntimeError';
        },
        enumerable: false,
        configurable: true
    });
    return BSONRuntimeError;
}(BSONError));
export { BSONRuntimeError };
//# sourceMappingURL=error.js.map