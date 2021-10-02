const config = {
    port            : 3000
    , maxRequest    : 5     // max number of requests before hitting 429 response
    , quotaWithin   : 10    // within duration -- in seconds        
}
export default config