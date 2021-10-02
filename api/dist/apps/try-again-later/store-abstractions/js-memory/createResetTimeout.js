"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetTimeout = void 0;
// debug logger
const debug_1 = require("debug");
const debug = (0, debug_1.debug)('cartrack:apps:try-again-later:memory:resetTimeout');
debug.log = console.log.bind(console);
const resetTimeout = function (hits, key, quotaWithin) {
    return setTimeout(() => {
        debug(`Resetting quota for ${key}:`);
        debug(hits[key]);
        delete hits[key];
    }, quotaWithin * 1000);
};
exports.resetTimeout = resetTimeout;
exports.default = resetTimeout;
//# sourceMappingURL=createResetTimeout.js.map