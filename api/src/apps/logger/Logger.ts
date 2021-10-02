import { debug as debugProto } from 'debug'
const debug = debugProto('cartrack:apps:logger:Logger')
debug.log = console.log.bind(console)

import { stat, mkdir, open, FileHandle } from "fs/promises"
import { join, normalize } from "path"
import allowedRequests from './templates/allowed-requests'

import defaultMessage from "./templates/defaultMessage"
import rejectedRequests from "./templates/rejected-requests"

class Logger {
    writeDir    : string
    writeFile   : string
    template    : string
    options?     : {
        [key: string]: any
    }

    constructor(

        writeDir    : string
        , writeFile : string
        , template  : string
        , options?  : { [key: string]: any }

    ) {
        this.writeDir   = normalize(writeDir)
        this.writeFile  = writeFile
        this.template   = template
        this.options    = options
    }

    async write(message: string) {

        debug('Writing log.')

        const { writeDir, writeFile, template, options } = this

        var useTemplate


        switch(template) {
            case 'rejected-requests':
                useTemplate = rejectedRequests
                break
            
            case 'allowed-requests':
                useTemplate = allowedRequests
                break
                
            default:
                useTemplate = defaultMessage
        }

        const logContent = useTemplate(message, options)

        // START FILE WRITE PROMISE
        // Async logging operations for performance
        var fileHandle: FileHandle

        // check if directory exist. if not, create it
        return stat(writeDir).then(stats => {

            // if the path is a file and not a directory
            // (if the path is not a file or directory, it gets thrown into the catch)
            if(!stats.isDirectory()) {

                debug('Directory does not exist, creating it...')

                // create it
                return mkdir(writeDir, { recursive: true }).then(() => {
                    return _open(writeDir, writeFile, logContent)
                })

            } else {

                // directory exist, write to it
                return _open(writeDir, writeFile, logContent)
            }

        }).catch(error => {

            // diretory does not exist, 
            if (error.message.indexOf('no such file or directory')) {

                //create it and recover the promise chain from here
                return mkdir(writeDir, { recursive: true }).then(() => {
                    return _open(writeDir, writeFile, logContent)
                })

            } else {
                throw error
            }

        }).then(file => {

            fileHandle = file
            return file.write(`${logContent}\n`)

        }).then(() => {

            return fileHandle.close()

        }).then(() => {

            debug('Logging complete.')

        }).catch(err => {
            throw err
        })

    }
}

function _open(writeDir: string, writeFile: string, logContent:string) {

    const fullPath = join(writeDir, writeFile)
    debug(`Message: ${logContent}`)
    debug(`Writing to: ${fullPath}`)

    return open(fullPath, 'a')
}




export default Logger
export { Logger }