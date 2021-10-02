import { debug as debugProto } from 'debug'
import { join, resolve } from 'path'
const debug = debugProto('cartrack:apps:try-again-later:logger')
debug.log = console.log.bind(console)

import Logger from "../logger/Logger"

const logDir            = resolve(join(__dirname, '../../../logs'))
const rejectedLogFile   = 'rejected.log'
const allowedLogFile    = 'allowed.log'

const logger = {
    allowed: new Logger(logDir, allowedLogFile, 'allowed-requests', {
        timestamp: true
        , consoleLog: debug
    })
    , rejected: new Logger(logDir, rejectedLogFile, 'rejected-requests', {
        timestamp: true
        , consoleLog: debug
    })
}

export default logger
export { logger }