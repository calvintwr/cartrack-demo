import Logger from "../Logger"

const allowedRequests = function(

    info        : string
    , options   : Logger['options']

) {
    const message = `${options?.timestamp ? '['+(new Date()).toUTCString()+']' : ''} Rate limiter: ${info} was allowed access.`
    if(options?.consoleLog) options.consoleLog(message)
    return message
}
export default allowedRequests
export { allowedRequests }