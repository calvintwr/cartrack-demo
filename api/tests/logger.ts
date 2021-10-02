import { describe } from 'mocha'
import { should } from 'chai'
import logger from '../src/apps/try-again-later/loggers'
import Logger from '../src/apps/logger/Logger'
import { join, normalize, resolve } from 'path'

should()

describe('RateLimit - logger', () => {

    it('should instantiate with correct properties', () => {

        const { allowed, rejected } = logger

        allowed.should.be.instanceOf(Logger)
        allowed.options!.should.deep.include({
            timestamp: true
        })
        Object.keys(allowed.options!).should.include('consoleLog')
        allowed.template.should.equal('allowed-requests')
        allowed.writeFile.should.equal('allowed.log')
        const allowedWriteDir = normalize(  resolve( join(__dirname, '../logs') )  )
        allowed.writeDir.should.equal(allowedWriteDir)

        rejected.should.be.instanceOf(Logger)
        rejected.options!.should.deep.include({
            timestamp: true
        })
        Object.keys(rejected.options!).should.include('consoleLog')
        rejected.template.should.equal('rejected-requests')
        rejected.writeFile.should.equal('rejected.log')

        const rejectedWriteDir = normalize(  resolve( join(__dirname, '../logs') )  )
        rejected.writeDir.should.equal(rejectedWriteDir)

    })

})