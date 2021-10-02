import hitsInterface from './types/hits-interface'

// debug logger
import { debug as debugProto } from 'debug'
const debug = debugProto('cartrack:apps:try-again-later:memory:resetTimeout')
debug.log = console.log.bind(console)

const resetTimeout = function(hits: hitsInterface, key: string, quotaWithin: number) {

    return setTimeout(() => { 

        debug(`Resetting quota for ${key}:`)
        debug(hits[key])

        delete hits[key] 

    }, quotaWithin * 1000)
    
}

export default resetTimeout
export { resetTimeout }