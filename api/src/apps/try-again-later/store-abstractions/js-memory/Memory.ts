import calculateResetTime from '../../helpers/calculateResetTime'
import hitsInterface from './types/hits-interface'
import createResetTimeout from './createResetTimeout'
import incrementCallback from './types/increment-callback'

// debug logger
import { debug as debugProto } from 'debug'
const debug = debugProto('cartrack:apps:try-again-later:memory')
debug.log = console.log.bind(console)

class Memory {

    quotaWithin : number
    hits        : hitsInterface = {}

    constructor(quotaWithin: number) {
        this.quotaWithin = quotaWithin
    }

    // increment the hit count 
    increment(key: string, max: number, now = new Date(), callback?: incrementCallback) {

        const { hits, quotaWithin } = this

        debug('Before increment:')
        debug(hits)
        
        if (hits[key]) {
            hits[key].hit++
        } else {

            // once a fresh record is created, set it to perish within the quota window
            hits[key] = {
                hit: 1
                , resetTimeout  : createResetTimeout(hits, key, quotaWithin)
                , resetTime     : calculateResetTime(quotaWithin, now)
            }

        }
        debug('After increment')
        debug(hits)
        if(callback) callback(null, hits[key].hit, hits[key].resetTime)
    }

    // API to reset all quotas
    resetAll() {

        debug('Resetting all...')

        // optional -- clear out all the timeouts to avoid any potential memory leaks
        Object.keys(this.hits).forEach(key => {
            const hit = this.hits[key]
            clearTimeout(hit.resetTimeout)
        })

        // give it a brand new reference
        this.hits = {}

        debug('Resetting all completed.')
    }

    // API to reset a specific quota
    resetKey(key: string) {

        debug(`Reset for ${key}.`)
        clearTimeout(this.hits[key].resetTimeout)
        delete this.hits[key]

    }

}

export default Memory
export { Memory }