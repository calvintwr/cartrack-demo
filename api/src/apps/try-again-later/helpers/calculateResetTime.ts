import addTime from "./addTime"

const calculateResetTime = function(quotaWithin: number, now = new Date()): Date {
    return addTime(now, quotaWithin, 'seconds')
}

export default calculateResetTime
export { calculateResetTime }