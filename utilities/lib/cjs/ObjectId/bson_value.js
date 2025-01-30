"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BSONValue = void 0;
var constants_1 = require("./constants");
/** @public */
var BSONValue = /** @class */ (function () {
    function BSONValue() {
    }
    Object.defineProperty(BSONValue.prototype, Symbol.for('@@mdb.bson.version'), {
        /** @internal */
        get: function () {
            return constants_1.BSON_MAJOR_VERSION;
        },
        enumerable: false,
        configurable: true
    });
    return BSONValue;
}());
exports.BSONValue = BSONValue;
//# sourceMappingURL=bson_value.js.map