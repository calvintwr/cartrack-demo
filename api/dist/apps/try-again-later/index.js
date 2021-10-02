"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimit = void 0;
// debug logger
const debug_1 = require("debug");
const debug = (0, debug_1.debug)('cartrack:apps:try-again-later:memory');
debug.log = console.log.bind(console);
const Memory_1 = __importDefault(require("./store-abstractions/js-memory/Memory"));
const common_1 = __importDefault(require("../../configs/common"));
const addTime_1 = __importDefault(require("./helpers/addTime"));
const loggers_1 = __importStar(require("./loggers"));
class RateLimit {
    constructor(options = {}) {
        this.quotaWithin = common_1.default.quotaWithin;
        this.max = common_1.default.maxRequest;
        this.loggers = loggers_1.logger;
        this.message = 'Too many requests, please try again later.';
        // lexical this
        this.handler = (req, res, next) => {
            const message = this.message;
            // 429 status = Too Many Requests (RFC 6585)
            res.status(429).send({
                success: false,
                retryAfterSeconds: res.getHeader('Retry-After'),
                message
            });
        };
        // lexical this
        this.reject = (req, res, now, ip, retryAfterSeconds) => {
            // async, non-blocking
            loggers_1.default.rejected.write(`${ip} (URI: [${req.method}]${req.originalUrl} )`);
            if (!res.headersSent) {
                res.setHeader('Retry-After', (0, addTime_1.default)(now, retryAfterSeconds, 'seconds').toUTCString());
            }
            return this.handler(req, res);
        };
        this.allow = (req, next, ip) => {
            next();
            // async, non-blocking
            loggers_1.logger.allowed.write(`${ip} (URI: [${req.method}]${req.originalUrl} )`);
        };
        Object.assign(this, options);
        this.store = new Memory_1.default(this.quotaWithin); // to use redis or memcache, replace this with another abstraction/adaptor
        this.resetKey = this.store.resetKey.bind(this.store);
    }
    // keyGenerator takes the request body for generating a unique key.
    // can also be API key or bear token where available.
    keyGenerator(req) {
        return req.ip;
    }
    use() {
        const { store, reject, allow, keyGenerator } = this;
        const max = this.max;
        function middileware(req, res, next) {
            const key = keyGenerator(req);
            const now = new Date();
            const callback = (err, current, resetTime) => {
                if (err)
                    return next(err);
                const remaining = Math.max(max - current, 0);
                const retryAfterSeconds = Math.ceil((resetTime.getTime() - now.getTime()) / 1000);
                if (!res.headersSent) {
                    const now = new Date();
                    // provide server clock time -- can be used debug severe clocks desync
                    res.setHeader('Date', now.toUTCString());
                    // RateLimit Headers (there are 2 kinds of specifications in use):
                    // legacy/colloquial X headers
                    res.setHeader('X-RateLimit-Limit', max);
                    res.setHeader('X-RateLimit-Remaining', remaining);
                    res.setHeader('X-RateLimit-Reset', Math.round(resetTime.getTime() / 1000));
                    // IETF Draft Rate Limit standardisation document
                    // draft-polli-ratelimit-headers-00
                    // https://datatracker.ietf.org/doc/html/draft-polli-ratelimit-headers-00
                    res.setHeader('RateLimit-Limit', max);
                    res.setHeader('RateLimit-Remaining', remaining);
                    res.setHeader('RateLimit-Reset', Math.max(0, retryAfterSeconds));
                }
                if (max && current > max)
                    return reject(req, res, now, key, retryAfterSeconds);
                // access granted
                allow(req, next, key);
                return null;
            };
            store.increment(key, max, now, callback);
            return null;
        }
        return middileware;
    }
}
exports.RateLimit = RateLimit;
exports.default = RateLimit;
//# sourceMappingURL=index.js.map