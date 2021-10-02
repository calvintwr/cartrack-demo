
import { describe } from 'mocha'
import { should } from 'chai'
import Memory from '../../../../../src/apps/try-again-later/store-abstractions/js-memory/Memory'
import * as crypto from 'crypto'

should()

describe('Memory #increment', () => {

    it('should add a key', () => {

        let memory = new Memory(0.1)
        memory.increment('key', 99)
        memory.hits['key'].hit.should.be.eq(1)

    })

    it('should delete a key after timeout', (done) => {

        const duration = 100 // in miliseconds
        
        const memory = new Memory(duration/1000)
        memory.increment('key', 99)
    
        memory.hits['key'].hit.should.be.eq(1)
        setTimeout(() => {
            Object.keys(memory.hits).length.should.be.eq(0)
            done()
        }, duration)

    })

    it('should callback with hit count and resetTime', () => {
        
        const memory = new Memory(0.1)
        memory.increment('key', 99, new Date(), (error, hit, resetTime) => {
            error?.should.be.null
            hit.should.be.equal(1)
            resetTime.should.not.be.undefined
        })
    
    })
})

describe('Memory #resetAll', () => {

    it('should delete all records', () => {
        
        const memory = new Memory(0.1)
        memory.increment('key', 99, new Date(), (error, hit, resetTime) => {
            error?.should.be.null
            hit.should.be.equal(1)
            resetTime.should.not.be.undefined
        })
        memory.resetAll()
        Object.keys(memory.hits).length.should.be.equal(0)
    
    })

})

describe('Memory #resetKey', () => {

    it('should delete a record', () => {
        
        const memory = new Memory(0.1)
        memory.increment('key', 99, new Date(), (error, hit, resetTime) => {
            error?.should.be.null
            hit.should.be.equal(1)
            resetTime.should.not.be.undefined
        })
        memory.increment('key2', 9380, new Date(), (error, hit, resetTime) => {
            error?.should.be.null
            hit.should.be.equal(1)
            resetTime.should.not.be.undefined
        })
        memory.resetKey('key')
        Object.keys(memory.hits).length.should.be.equal(1)
        Object.keys(memory.hits).should.have.members(['key2'])
    
    })

})

describe('Memory - Heap memory usage load test.', function() {

    this.timeout(10000) // use of `this` here needs function scope, and not arrow functions

    it('should consume less than 5mb heap memory for 1,000 records', () => {

        const memory            = new Memory(10) // 10 seconds
        const load              = 1000 // 1k records
        const memoryUsageBefore = process.memoryUsage().heapUsed / 1024 / 1024

        for(let i=0; i<load; i++) {
            let pseudoKey = crypto.randomUUID()
            memory.increment(pseudoKey, 10, undefined, ()=>{})
        }

        const memoryUsageAfter = process.memoryUsage().heapUsed / 1024 / 1024

        console.log(`   Heap before: ${memoryUsageBefore}`)
        console.log(`   Heap after: ${memoryUsageAfter}`)
        const memDelta = memoryUsageAfter - memoryUsageBefore

        console.log(`   Heap memory used: ${memDelta}`)

        memDelta.should.be.lt(20)   
    })

})