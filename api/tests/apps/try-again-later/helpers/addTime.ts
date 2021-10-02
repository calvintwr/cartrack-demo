
import { describe } from 'mocha'
import { should } from 'chai'
import addTime from '../../../../src/apps/try-again-later/helpers/addTime'

should()

describe('addTime', () => {

    it('should add seconds correctly', () => {
        const seconds   = 9
        const now       = new Date()
        addTime(now, seconds, 'seconds').getTime().should.equal(now.setMilliseconds(now.getMilliseconds() + seconds*1000))
    })
 
})