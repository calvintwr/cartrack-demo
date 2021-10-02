"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    port: 3000,
    maxRequest: 5 // max number of requests before hitting 429 response
    ,
    quotaWithin: 10 // within duration -- in seconds        
};
exports.default = config;
//# sourceMappingURL=common.js.map