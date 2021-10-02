"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTime = void 0;
const addTime = function (now, add, unit) {
    const d = new Date(now.getTime());
    var addMiliseconds;
    switch (unit) {
        case 'minutes':
            addMiliseconds = add * 60 * 1000;
            break;
        case 'seconds':
            addMiliseconds = add * 1000;
            break;
        default:
            addMiliseconds = add;
    }
    d.setMilliseconds(d.getMilliseconds() + addMiliseconds);
    return d;
};
exports.addTime = addTime;
exports.default = addTime;
//# sourceMappingURL=addTime.js.map