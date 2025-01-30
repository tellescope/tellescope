import { BSON_MAJOR_VERSION } from './constants';
/** @public */
var BSONValue = /** @class */ (function () {
    function BSONValue() {
    }
    Object.defineProperty(BSONValue.prototype, Symbol.for('@@mdb.bson.version'), {
        /** @internal */
        get: function () {
            return BSON_MAJOR_VERSION;
        },
        enumerable: false,
        configurable: true
    });
    return BSONValue;
}());
export { BSONValue };
//# sourceMappingURL=bson_value.js.map