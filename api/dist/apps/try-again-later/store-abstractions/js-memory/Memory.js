"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memory = void 0;
const calculateResetTime_1 = __importDefault(require("../../helpers/calculateResetTime"));
const createResetTimeout_1 = __importDefault(require("./createResetTimeout"));
// debug logger
const debug_1 = require("debug");
const debug = (0, debug_1.debug)('cartrack:apps:try-again-later:memory');
debug.log = console.log.bind(console);
class Memory {
    constructor(quotaWithin) {
        this.hits = {};
        this.quotaWithin = quotaWithin;
    }
    // increment the hit count 
    increment(key, max, now = new Date(), callback) {
        const { hits, quotaWithin } = this;
        debug('Before increment:');
        debug(hits);
        if (hits[key]) {
            hits[key].hit++;
        }
        else {
            // once a fresh record is created, set it to perish within the quota window
            hits[key] = {
                hit: 1,
                resetTimeout: (0, createResetTimeout_1.default)(hits, key, quotaWithin),
                resetTime: (0, calculateResetTime_1.default)(quotaWithin, now)
            };
        }
        debug('After increment');
        debug(hits);
        if (callback)
            callback(null, hits[key].hit, hits[key].resetTime);
    }
    // API to reset all quotas
    resetAll() {
        debug('Resetting all...');
        // optional -- clear out all the timeouts to avoid any potential memory leaks
        Object.keys(this.hits).forEach(key => {
            const hit = this.hits[key];
            clearTimeout(hit.resetTimeout);
        });
        // give it a brand new reference
        this.hits = {};
        debug('Resetting all completed.');
    }
    // API to reset a specific quota
    resetKey(key) {
        debug(`Reset for ${key}.`);
        clearTimeout(this.hits[key].resetTimeout);
        delete this.hits[key];
    }
}
exports.Memory = Memory;
exports.default = Memory;
//# sourceMappingURL=Memory.js.map