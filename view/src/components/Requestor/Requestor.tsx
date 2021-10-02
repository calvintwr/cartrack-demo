import React from 'react'
import config from '../../configs/common'
import Timer from './Timer'
import Toggle from '../commons/Toggle'

interface Props {}

interface State {
    totalRequests       : number

    serverMaxQuota      : number
    serverRemaining     : number
    serverTimeOfReset?  : number | null

    requestOngoing?     : boolean
    requestButtonText   : string

    // CLIENT-SIDE IMPOSED LIMITERS
    // when server does not explicitly define rate limits
    // or when you just want to limit your users 
    // because perhaps per API calls (especially to 3rd parties like Google Map) cost you money
    clientRemaining     : number
    clientTimeOfReset?  : number | null
    clientSideLimiter   : boolean

}

class Requestor extends React.Component<Props, State> {

    requestButtonText   = 'Make Request'

    // client side limiters
    clientDuration      = (config.quotaWithin + 0.4)    // add 400ms to buffer race conditions
    clientMaxQuota      = config.maxRequest
    
    constructor(props: Props) {
        super(props)
        this.state = {
            totalRequests       : 0
            , serverMaxQuota    : 0
            , serverRemaining   : 0
            , requestButtonText : this.requestButtonText
            , clientSideLimiter : false
            , clientRemaining   : this.clientMaxQuota
        }
    }

    componentDidMount() {
        this.makeRequest() 
    }

    makeRequest = () => {

        if(this.state.clientSideLimiter && this.state.clientRemaining < 1) {
            alert('[Client-side limiter] You run out of request quota. Please wait and try again later.')
            return
        }

        const headers: any  = {}
        let ok              = false

        this.setState({
            requestOngoing: true
            , requestButtonText: 'Requesting...'
        })
    
        return fetch('http://localhost:3000/', {
            mode: 'cors'
        }).then(res => {
    
            res.headers.forEach((value, key) => headers[key] = value)
            ok = res.ok
            return res.json()
    
        }).then(res => {
    
            if(!ok) throw Error(res.message)

            console.log('%cBody:', 'color: green')
            console.log(res)
            console.log('%cHeaders', 'color: blue')
            console.log(headers)

            // RateLimit Headers (there are 2 kinds of specifications in use):

            // IETF Draft Rate Limit standardisation (document "draft-polli-ratelimit-headers-00"):
            // ratelimit-limit
            // ratelimit-remaining
            // ratelimit-reset

            // Legacy/colloquial X-RATELIMIT headers
            // x-ratelimit-limit
            // x-ratelimit-remaining
            // x-ratelimit-reset
            
            this.setState({
                totalRequests       : this.state.totalRequests + 1
                , serverMaxQuota    : headers['ratelimit-limit']
                , serverRemaining   : headers['ratelimit-remaining']

                // use an aggregated function to use `x-ratelimit-reset` or `ratelimit-reset` depending on which is available
                , serverTimeOfReset : calculateTimeOfReset(headers['x-ratelimit-reset'], headers['ratelimit-reset'])
            })

            // client-side limiter
            this.setState({
                clientRemaining     : this.state.clientRemaining - 1
            })
            // need to check if the time of reset has passed to set a new one (thereby renewing the quota).
            // else the quota is not renewed
            if(!this.state.clientTimeOfReset || new Date().getTime() > this.state.clientTimeOfReset) {
                this.setState({
                    clientTimeOfReset : calculateTimeOfReset(null, this.clientDuration)
                })                
            }
    
        }).catch(err => {

            alert(err)
            console.warn(err)

        }).finally(() => {

            // #setTimeout is purely to simulate real world API lag
            // else an API call to localhost will respond almost immediately
            setTimeout(() => {
                this.setState({
                    requestOngoing      : false
                    , requestButtonText : this.requestButtonText
                })
            }, 500)

        })
    }

    clientSideLimiterChange = (checked: State['clientSideLimiter']) => {
        this.setState({
            clientSideLimiter: checked
        })
    }

    resetClientQuota = (clientRemaining = this.clientMaxQuota) => {
        this.setState({ clientRemaining })
    }

    resetServerQuota = (serverRemaining = this.state.serverMaxQuota) => {
        this.setState({ serverRemaining })
    }

    render() {

        const { 
            totalRequests
            , serverMaxQuota
            , serverRemaining
            , serverTimeOfReset
            , clientRemaining
            , clientTimeOfReset
            , clientSideLimiter
            , requestOngoing
            , requestButtonText
        } = this.state

        const { 
            makeRequest
            , clientSideLimiterChange
            , clientMaxQuota 
            , resetClientQuota
            , resetServerQuota
        } = this

        return (
            <div>

                <article>
                    <h2>Both server and client should impose rate limiting.</h2>
                    <p>Client-side rate limiting blocks excessive requests at the earliest possible opportunity, 
                        saving network resources, or cuts unneccessary 3rd party API costs (e.g. Google Map).</p>
                    <p>Server-side rate limit is the "last line" of defence, and can also mitigate DDoS to a certain extent.</p>
                    <p>
                        In the example below, you can toggle on and off the client-side rate limiter (server rate limit is always on). 
                        The slight difference in countdown between the two timers represents the server lag, or client/server clock differences. 
                    </p>
                </article>
                
                <h1>Hello, you've made {totalRequests} request{ totalRequests > 1 ? 's' : ''} successfully.</h1>
                <p>(See console for response body and headers)</p>

                <button 
                    disabled    = { requestOngoing }
                    onClick     = { makeRequest }
                >{ requestButtonText }</button>

                <Toggle 
                    id          = "clientSideLimiter"
                    checked     = { clientSideLimiter } 
                    onChange    = { clientSideLimiterChange }
                    label       = "Use client-side rate limiter"
                />

                { clientSideLimiter ? (
                    <span>
                        <h2>Client-side limiter (using client-side defined parameters)</h2>
                        <Timer 
                            timeOfReset         = { clientTimeOfReset }
                            maxQuota            = { clientMaxQuota }  
                            requestsRemaining   = { clientRemaining }
                            reset               = { resetClientQuota }
                        />
                    </span>
                ) : (
                    <span>
                        <h2>Server-side rate limiter (using RateLimit Headers)</h2>
                        <Timer 
                            timeOfReset         = { serverTimeOfReset }
                            maxQuota            = { serverMaxQuota }  
                            requestsRemaining   = { serverRemaining }
                            reset               = { resetServerQuota }
                        />
                    </span>
                )}
                    
            </div>     
        )
    }
}

const calculateTimeOfReset = (
    xRateLimitReset : number | null
    , duration?     : number
    , now           = new Date().getTime()
) => {
    if(xRateLimitReset) return xRateLimitReset * 1000
    if(!duration) throw Error('`duration` must be defined if `xRateLimitReset` is not defined.')
    return now + (duration * 1000)
}

export default Requestor
export { Requestor, calculateTimeOfReset }