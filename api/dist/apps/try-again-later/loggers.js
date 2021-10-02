"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const debug_1 = require("debug");
const path_1 = require("path");
const debug = (0, debug_1.debug)('cartrack:apps:try-again-later:logger');
debug.log = console.log.bind(console);
const Logger_1 = __importDefault(require("../logger/Logger"));
const logDir = (0, path_1.resolve)((0, path_1.join)(__dirname, '../../../logs'));
const rejectedLogFile = 'rejected.log';
const allowedLogFile = 'allowed.log';
const logger = {
    allowed: new Logger_1.default(logDir, allowedLogFile, 'allowed-requests', {
        timestamp: true,
        consoleLog: debug
    }),
    rejected: new Logger_1.default(logDir, rejectedLogFile, 'rejected-requests', {
        timestamp: true,
        consoleLog: debug
    })
};
exports.logger = logger;
exports.default = logger;
//# sourceMappingURL=loggers.js.map