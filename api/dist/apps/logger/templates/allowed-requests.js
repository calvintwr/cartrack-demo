"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedRequests = void 0;
const allowedRequests = function (info, options) {
    const message = `${(options === null || options === void 0 ? void 0 : options.timestamp) ? '[' + (new Date()).toUTCString() + ']' : ''} Rate limiter: ${info} was allowed access.`;
    if (options === null || options === void 0 ? void 0 : options.consoleLog)
        options.consoleLog(message);
    return message;
};
exports.allowedRequests = allowedRequests;
exports.default = allowedRequests;
//# sourceMappingURL=allowed-requests.js.map