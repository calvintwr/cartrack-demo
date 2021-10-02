import Logger from '../Logger'

const defaultMessage = function(

    message     : string
    , options   : Logger['options']

) {

    return `${options?.timestamp ? '['+(new Date()).toUTCString()+'] ' : ''}${message}.`

}
export default defaultMessage
export { defaultMessage }