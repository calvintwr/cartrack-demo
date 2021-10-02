"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectedRequests = void 0;
const rejectedRequests = function (info, options) {
    const message = `${(options === null || options === void 0 ? void 0 : options.timestamp) ? '[' + (new Date()).toUTCString() + ']' : ''} Rate limiter: ${info} was denied access.`;
    if (options === null || options === void 0 ? void 0 : options.consoleLog)
        options.consoleLog(message);
    return message;
};
exports.rejectedRequests = rejectedRequests;
exports.default = rejectedRequests;
//# sourceMappingURL=rejected-requests.js.map