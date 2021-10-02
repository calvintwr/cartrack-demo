
import { describe } from 'mocha'
import { should } from 'chai'
import calculateResetTime from '../../../../src/apps/try-again-later/helpers/calculateResetTime'

should()

describe('calculateResetTime', () => {

    it('should calculate reset time', () => {
        const seconds   = 9
        const now       = new Date()
        calculateResetTime(seconds, now).getTime().should.equal(now.getTime() + seconds*1000)

    })
 
})