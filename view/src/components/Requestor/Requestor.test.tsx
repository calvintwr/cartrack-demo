import * as Requestor from './Requestor'

test('calculateTimeOfReset - x-ratelimit-reset available', () => {
    let now = Math.round(new Date().getTime() / 1000) // divide by 1000 coz x-ratelimit-reset is in unix seconds
    let result = Requestor.calculateTimeOfReset(now, 9999)
    expect(result).toBe(now * 1000)
})

test('calculateTimeOfReset - ratelimit-reset available', () => {
    let now = new Date().getTime()
    let duration = 10
    let result = Requestor.calculateTimeOfReset(null, duration, now)
    expect(result).toBe(now + (duration*1000))
})