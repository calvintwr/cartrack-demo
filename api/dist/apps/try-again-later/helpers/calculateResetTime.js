"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateResetTime = void 0;
const addTime_1 = __importDefault(require("./addTime"));
const calculateResetTime = function (quotaWithin, now = new Date()) {
    return (0, addTime_1.default)(now, quotaWithin, 'seconds');
};
exports.calculateResetTime = calculateResetTime;
exports.default = calculateResetTime;
//# sourceMappingURL=calculateResetTime.js.map