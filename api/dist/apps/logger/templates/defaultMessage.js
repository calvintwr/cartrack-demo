"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultMessage = void 0;
const defaultMessage = function (message, options) {
    return `${(options === null || options === void 0 ? void 0 : options.timestamp) ? '[' + (new Date()).toUTCString() + '] ' : ''}${message}.`;
};
exports.defaultMessage = defaultMessage;
exports.default = defaultMessage;
//# sourceMappingURL=defaultMessage.js.map