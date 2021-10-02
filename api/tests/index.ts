import { describe } from 'mocha'
import { should } from 'chai'
import RateLimit from '../src/apps/try-again-later'
import mock from 'mock-fs'

should()

interface responseHeaders {
    Date?: Date
    'X-RateLimit-Limit'?: number
    'X-RateLimit-Remaining'?: number
    'X-RateLimit-Reset'?: number
    'RateLimit-Limit'?: number 
    'RateLimit-Remaining'?: number
    'RateLimit-Reset'?: number
    'Retry-After'?: number
}

const headers: responseHeaders = {}

const mockRes = function() {

    return {

        headers
        , sent      : {}
        , statusCode: 200

        , setHeader(header: string, value: any) {
            //@ts-ignore
            this.headers[header] = value
        }
        , getHeader(header: string) {
            //@ts-ignore
            return this.headers[header]
        }
        , status(status: number) {
            this.statusCode = status
            return this
        }
        , send(body = {}) {
            this.sent = body
        }
    }

}

describe('RateLimit', () => {

    // mock the log file
    const dir = `${process.cwd()}/logs`
    const fileName = 'rate-limited.txt'

    before(() => {
        const mockParams: any = {}
        mockParams[dir] = {}
        mockParams[dir][fileName] = ''
        mock(mockParams)
    })

    after(() => {
        mock.restore()
    })
    

    it('should set headers (default settings)', () => {
        const res = mockRes()
        const rateLimit = new RateLimit()

        const middleware = rateLimit.use()

        //@ts-ignore
        middleware(false, res, () => {})

        res.headers.should.include({
            'X-RateLimit-Remaining' : 4
            , 'RateLimit-Limit'     : 5
            , 'RateLimit-Remaining' : 4
            , 'RateLimit-Reset'     : 10
        })
        Object.keys(res.headers).should.include.members([
            'X-RateLimit-Reset'
            , 'Date'
        ])
    })

    it('should set headers (custom settings)', () => {
        const res = mockRes()
        const rateLimit = new RateLimit({
            quotaWithin : 9
            , max       : 890
            , handler   : () =>{ }
        })

        const middleware = rateLimit.use()

        //@ts-ignore
        middleware(false, res, () => {})

        res.headers.should.include({
            'X-RateLimit-Remaining' : 889
            , 'RateLimit-Limit'     : 890
            , 'RateLimit-Remaining' : 889
            , 'RateLimit-Reset'     : 9
        })
        Object.keys(res.headers).should.include.members([
            'X-RateLimit-Reset'
            , 'Date'
        ])
    })

})

describe('RateLimit - when quota exceeds', () => {

    const res       = mockRes()
    const rateLimit = new RateLimit({
        quotaWithin : 9
        , max       : 1
    })
    const middleware = rateLimit.use()
    const mockReq = {
        ip: 'foo'
    }

    // mock the log file
    const dir = `${process.cwd()}/logs`
    const fileName = 'rate-limited.txt'

    before(() => {
        const mockParams: any = {}
        mockParams[dir] = {}
        mockParams[dir][fileName] = ''
        mock(mockParams)
    })

    after(() => {
        mock.restore()
    })

    beforeEach(() => {
        //@ts-ignore
        middleware(mockReq, res, () => {})
        //@ts-ignore
        middleware(mockReq, res, () => {})
    })
    
    it('should have correct headers', () => {
        res.headers.should.include({
            'X-RateLimit-Remaining' : 0
            , 'RateLimit-Limit'     : 1
            , 'RateLimit-Remaining' : 0
            , 'RateLimit-Reset'     : 9
        })
        Object.keys(res.headers).should.include.members([
            'X-RateLimit-Reset'
            , 'Date'
        ])

        res.headers['X-RateLimit-Reset']!.should.not.be.NaN
    })


    it('should respond with status code of 429', () => {  
        res.statusCode.should.equal(429)
    })

    it('should have "Retry-After" header, consistent with RateLimit-Reset (draft-polli-ratelimit-headers-00 s5/s6.1.4)', () => {
        
        res.headers['Retry-After']!.should.not.be.undefined

        const date = new Date(res.headers['Date']!)
        date.setMilliseconds(date.getMilliseconds() + res.headers['RateLimit-Reset']! * 1000)

        const retryAfter = new Date(res.headers['Retry-After']!)
        date.getTime().should.equal(retryAfter.getTime())
    })
})