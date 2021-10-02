# Demo for Cartrack

The project code is decoupled into `api` and `view`.

## Requirements

### 1. To build a web service that throttles/limits requests for an IP using NodeJS & React.

The best practice for rate-limiting are implemented in both server and client-side.

For server-side rate-limiting, the logic is in `api/apps/try-again-later`. It provides API users with the request quotating remaining/limit, and reset timings, via HTTP rate-limit headers (both legacy `X-RateLimit` and <a href="https://datatracker.ietf.org/doc/html/draft-polli-ratelimit-headers-00" target="_blank">`IETF draft-polli-ratelimit-headers-00`</a> headers standards). Status`429` is also sent out when limit is reached. This allow users to build their apps keeping within prescribe limits.

For client-side rate-limiting, the logic is in the React component `view/src/component/Requestor`. It simply disables the UI button when quota is expended. Client-side rate-limiting is a best practice to block requests from even reaching the server. It negates app abuse by users, and in some instances, can make DDoS harder.

### 2. Values not hardcoded

See `api/src/configs` and `view/src/configs`. A larger app will have more parameters in there.

### 3. Requests should be sent to an API endpoint. All errors and responses in JSON format.

All errors and responses have proper headers and status codes. For JSON body, the following standard is adopted:

```ts
{
  success: [bool]
  , data: [any]
}
```

The reason for the `success` flag is to provide better layman messaging. For example, when someone searches for a person using a name, if such person does not exist in the database, some API endpoints returns `404 Not found` status. 

This can trip API users as it is often mistaken for having used the wrong URI, or method. In fact, the requestor has reached the API, and performed a successful search, and is notified that the person requested is not available.

A better way is to return a `success: false ` flag, with `400 Bad request`, or even `200 Success` -- to signal that the API resource is fully functional, and has completed it's job. It cannot give you what you want unless you change your request.

### 4. Maintain log of allowed and denied requests

Logger is in `api/src/apps/logger`. The Logger app follows best practice for logging: (1) Asynchronous, and (2) Transparent -- it's success or failure should not disrupt API operations.

Logger is written in promise style, with modularised templates (under `templates` folder) that can be extended to log other stuff.

Log files are output to `logs/allowed.log` and `logs/rejected.log` after operating the API. If you are running the app using a user that does not have write priviledges, you will need to perform `chmod` or `chown`.

Note: Client-side limited requests will be not logged as they do not reach the server.

### 5. Minimal impact on response time of server at scale

Server resources are optimised by: 

(1) Client-side rate-limiting.

(2) prioritising rate-limit express middleware to reject requests before other operations like body parsing etc:

```ts
// api/src/index.ts
app.use(cors())
app.use(rateLimit.use())  // requests will be stopped here if quota exceeded              
app.use(express.json())   // this precludes expensive operations such as #json() which parses the request body.
app.use(express.urlencoded({ extended: true }))
```

(3) Asynchronous on a as-far-as-possible basis. All `fs` operations are async:

```ts
return stat(writeDir).then(stats => {

    // if the path is a file and not a directory
    if(!stats.isDirectory()) {

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
}).catch(err => {
    throw err
})
```

(4) Performance tracking in tests. Tracking heap memory usage of `js-memory` in `tests/apps/try-again-later/Memory.ts`:

```ts

describe('Memory - Heap memory usage load test.', function() {
    this.timeout(10000)
    it('should consume less than 5mb heap memory for 1,000 records', () => {

        const memory            = new Memory(10) // 10 seconds
        const load              = 1000 // 1k records
        const memoryUsageBefore = process.memoryUsage().heapUsed / 1024 / 1024
        for(let i=0; i<load; i++) {
            let pseudoKey = crypto.randomUUID()
            memory.increment(pseudoKey, 10, undefined, ()=>{})
        }

        const memoryUsageAfter = process.memoryUsage().heapUsed / 1024 / 1024
        memDelta.should.be.lt(20)   
    })

})
```

(NOTE: `js-memory` is for demo purposes only. For production use, write a drop-in replacement adaptor "Memory.ts" for `Redis` or `Memcached`.) 

### 6. Frontend application must display information on requests (success, or hit limit)

See `view/src/components/Requestor/Requestor.tsx` and `Timer.tsx`.

### 7. Proper development start guide and README files.

See `api/readme.md` and `view/readme.md`.