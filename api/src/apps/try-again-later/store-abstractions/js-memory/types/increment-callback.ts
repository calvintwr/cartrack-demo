type incrementCallback = (
    error       : Error | null
    , hit       : number
    , resetTime : Date
) => any

export default incrementCallback
export { incrementCallback }
