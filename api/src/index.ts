import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import config from './configs/common'
import http from 'http'
import RateLimit from './apps/try-again-later'


// routings imports
import indexRouter from './routes/index'


// error handlers
import errorNotFound from './apps/error-handlers/notfound'
import errorServer from './apps/error-handlers/server-error'


// instantiations
const app       = express()
const port      = config.port || 3000
const rateLimit = new RateLimit()

app.set('port', port) // set port

/* MIDDLEWARES */
app.use(cors())                                 // enable cors for cross-domain api requests.
app.use(rateLimit.use())                        // rate limit before any middleware to reduce load
app.use(express.json())                         // parses JSON when it sees it
app.use(express.urlencoded({ extended: true })) // parses urlencoded (with object-rich payloads) when it sees it

// expose headers for cors
// so that requestor can use information such as RateLimit
app.use((req, res, next) => {
    res.setHeader('Access-Control-Expose-Headers', '*')
    next()
})

// routings
app.use('/', indexRouter)

// error handling
app.use(errorNotFound)
app.use(errorServer)


/* CREATE SERVER */
const server = http.createServer(app)
server.listen(port)
server.on('listening', () => { 
    console.log(`Listening on port ${port}.`) 
})
server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') throw error

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(`${port} requires elevated privileges`)
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(`${port} is already in use`)
            process.exit(1)
            break
        default:
            throw error
    }
})
