import Logger from "../Logger"

const rejectedRequests = function(

    info        : string
    , options   : Logger['options']

) {
    const message = `${options?.timestamp ? '['+(new Date()).toUTCString()+']' : ''} Rate limiter: ${info} was denied access.`
    if(options?.consoleLog) options.consoleLog(message)
    return message
}
export default rejectedRequests
export { rejectedRequests }