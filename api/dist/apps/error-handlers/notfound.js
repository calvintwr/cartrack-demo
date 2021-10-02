"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorNotFound = void 0;
const errorNotFound = function (req, res, next) {
    const err = new Error('404: Not Found');
    res.statusCode = 404;
    next(err);
};
exports.errorNotFound = errorNotFound;
exports.default = errorNotFound;
//# sourceMappingURL=notfound.js.map