// debug logger
import { debug as debugProto } from 'debug'
const debug = debugProto('cartrack:apps:try-again-later:memory')
debug.log = console.log.bind(console)

import Memory from './store-abstractions/js-memory/Memory'
import { Request, Response, NextFunction } from 'express'
import config from '../../configs/common'
import options from './store-abstractions/js-memory/types/options-interface'
import incrementCallback from './store-abstractions/js-memory/types/increment-callback'
import addTime from './helpers/addTime'
import loggers, { logger } from './loggers'

class RateLimit {

    quotaWithin = config.quotaWithin
    max         = config.maxRequest
    loggers     = logger
    message     = 'Too many requests, please try again later.'
    store       : Memory    // to use redis or memcache, replace this with another abstraction/adaptor   
    resetKey    : Function

    // keyGenerator takes the request body for generating a unique key.
    // can also be API key or bear token where available.
    keyGenerator(req: Request) {
        return req.ip
    }

    // lexical this
    handler = (req: Request, res: Response, next?: NextFunction) => {

        const message = this.message

        // 429 status = Too Many Requests (RFC 6585)
        res.status(429).send({
            success             : false
            , retryAfterSeconds : res.getHeader('Retry-After')
            , message
        })
    }

    // lexical this
    reject = (req: Request, res: Response, now: Date, ip: string, retryAfterSeconds: number) => {
        
        // async, non-blocking
        loggers.rejected.write(`${ip} (URI: [${req.method}]${req.originalUrl} )`)
        
        if (!res.headersSent) {
            res.setHeader(
                'Retry-After',
                addTime(now, retryAfterSeconds, 'seconds').toUTCString()
            )
        }
        return this.handler(req, res)
    }

    allow = (req: Request, next: NextFunction, ip: string) => {    
        next()

        // async, non-blocking
        logger.allowed.write(`${ip} (URI: [${req.method}]${req.originalUrl} )`)
    }

    constructor(options: options = {}) {
  
        Object.assign(this, options)

        this.store      = new Memory(this.quotaWithin!) // to use redis or memcache, replace this with another abstraction/adaptor
        this.resetKey   = this.store.resetKey.bind(this.store)

    }

    use() {
        const {
            store
            , reject
            , allow
            , keyGenerator
        } = this

        const max = this.max

        function middileware(req: Request, res: Response, next: NextFunction) {
            const key = keyGenerator!(req)
            const now = new Date()

            const callback: incrementCallback = (err, current, resetTime) => {
                
                if (err) return next(err)

                const remaining         = Math.max(max - current, 0)
                const retryAfterSeconds = Math.ceil(
                    (resetTime.getTime() - now.getTime()) / 1000
                )

                if (!res.headersSent) {

                    const now = new Date()

                    // provide server clock time -- can be used debug severe clocks desync
                    res.setHeader('Date', now.toUTCString())

                    // RateLimit Headers (there are 2 kinds of specifications in use):

                    // legacy/colloquial X headers
                    res.setHeader('X-RateLimit-Limit', max)
                    res.setHeader('X-RateLimit-Remaining', remaining)
                    res.setHeader(
                        'X-RateLimit-Reset',
                        Math.round(resetTime.getTime() / 1000)
                    )

                    // IETF Draft Rate Limit standardisation document
                    // draft-polli-ratelimit-headers-00
                    // https://datatracker.ietf.org/doc/html/draft-polli-ratelimit-headers-00
                    res.setHeader('RateLimit-Limit', max)
                    res.setHeader('RateLimit-Remaining', remaining)
                    res.setHeader('RateLimit-Reset', Math.max(0, retryAfterSeconds))

                }

                if (max && current > max) return reject(req, res, now, key, retryAfterSeconds)

                // access granted
                allow(req, next, key)
                return null

            }

            store.increment(key, max, now, callback)

            return null
        }

        return middileware
    }
      
}

export default RateLimit
export { RateLimit }