"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const debug_1 = require("debug");
const debug = (0, debug_1.debug)('cartrack:apps:logger:Logger');
debug.log = console.log.bind(console);
const promises_1 = require("fs/promises");
const path_1 = require("path");
const allowed_requests_1 = __importDefault(require("./templates/allowed-requests"));
const defaultMessage_1 = __importDefault(require("./templates/defaultMessage"));
const rejected_requests_1 = __importDefault(require("./templates/rejected-requests"));
class Logger {
    constructor(writeDir, writeFile, template, options) {
        this.writeDir = (0, path_1.normalize)(writeDir);
        this.writeFile = writeFile;
        this.template = template;
        this.options = options;
    }
    write(message) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('Writing log.');
            const { writeDir, writeFile, template, options } = this;
            var useTemplate;
            switch (template) {
                case 'rejected-requests':
                    useTemplate = rejected_requests_1.default;
                    break;
                case 'allowed-requests':
                    useTemplate = allowed_requests_1.default;
                    break;
                default:
                    useTemplate = defaultMessage_1.default;
            }
            const logContent = useTemplate(message, options);
            // START FILE WRITE PROMISE
            // Async logging operations for performance
            var fileHandle;
            // check if directory exist. if not, create it
            return (0, promises_1.stat)(writeDir).then(stats => {
                // if the path is a file and not a directory
                // (if the path is not a file or directory, it gets thrown into the catch)
                if (!stats.isDirectory()) {
                    debug('Directory does not exist, creating it...');
                    // create it
                    return (0, promises_1.mkdir)(writeDir, { recursive: true }).then(() => {
                        return _open(writeDir, writeFile, logContent);
                    });
                }
                else {
                    // directory exist, write to it
                    return _open(writeDir, writeFile, logContent);
                }
            }).catch(error => {
                // diretory does not exist, 
                if (error.message.indexOf('no such file or directory')) {
                    //create it and recover the promise chain from here
                    return (0, promises_1.mkdir)(writeDir, { recursive: true }).then(() => {
                        return _open(writeDir, writeFile, logContent);
                    });
                }
                else {
                    throw error;
                }
            }).then(file => {
                fileHandle = file;
                return file.write(`${logContent}\n`);
            }).then(() => {
                return fileHandle.close();
            }).then(() => {
                debug('Logging complete.');
            }).catch(err => {
                throw err;
            });
        });
    }
}
exports.Logger = Logger;
function _open(writeDir, writeFile, logContent) {
    const fullPath = (0, path_1.join)(writeDir, writeFile);
    debug(`Message: ${logContent}`);
    debug(`Writing to: ${fullPath}`);
    return (0, promises_1.open)(fullPath, 'a');
}
exports.default = Logger;
//# sourceMappingURL=Logger.js.map