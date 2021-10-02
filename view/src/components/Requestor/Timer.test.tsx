import * as Timer from './Timer'

test('calculateTimeLeft: rounds down to 0 when <500ms difference', () => {
    const now = 20000
    let result = Timer._calculateTimeLeft(20499, now)
    expect(result).toBe(0)
    result = Timer._calculateTimeLeft(20500, now)
    expect(result).toBe(1)
})

test('calculateTimeLeft: rounds up to 1 when >=500ms difference', () => {
    const now = 20000
    let result = Timer._calculateTimeLeft(20499, now)
    expect(result).toBe(0)
    result = Timer._calculateTimeLeft(20500, now)
    expect(result).toBe(1)
})