"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorServer = void 0;
const errorServer = function (err, req, res, next) {
    // if statusCode has not been previously changed, set to generic 500
    if (res.statusCode >= 200 && res.statusCode <= 299)
        res.statusCode = 500;
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.send(Object.assign({ success: false }, res.locals));
};
exports.errorServer = errorServer;
exports.default = errorServer;
//# sourceMappingURL=server-error.js.map