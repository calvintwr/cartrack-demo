"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const common_1 = __importDefault(require("./configs/common"));
const http_1 = __importDefault(require("http"));
const try_again_later_1 = __importDefault(require("./apps/try-again-later"));
// routings imports
const index_1 = __importDefault(require("./routes/index"));
// error handlers
const notfound_1 = __importDefault(require("./apps/error-handlers/notfound"));
const server_error_1 = __importDefault(require("./apps/error-handlers/server-error"));
// instantiations
const app = (0, express_1.default)();
const port = common_1.default.port || 3000;
const rateLimit = new try_again_later_1.default();
app.set('port', port); // set port
/* MIDDLEWARES */
app.use((0, cors_1.default)()); // enable cors for cross-domain api requests.
app.use(rateLimit.use()); // rate limit before any middleware to reduce load
app.use(express_1.default.json()); // parses JSON when it sees it
app.use(express_1.default.urlencoded({ extended: true })); // parses urlencoded (with object-rich payloads) when it sees it
// expose headers for cors
// so that requestor can use information such as RateLimit
app.use((req, res, next) => {
    res.setHeader('Access-Control-Expose-Headers', '*');
    next();
});
// routings
app.use('/', index_1.default);
// error handling
app.use(notfound_1.default);
app.use(server_error_1.default);
/* CREATE SERVER */
const server = http_1.default.createServer(app);
server.listen(port);
server.on('listening', () => {
    console.log(`Listening on port ${port}.`);
});
server.on('error', (error) => {
    if (error.syscall !== 'listen')
        throw error;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(`${port} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${port} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});
//# sourceMappingURL=index.js.map