interface hitsInterface {
    
    [ key: string ]: {
        hit         : number
        resetTimeout: ReturnType<typeof setTimeout>
        resetTime   : Date
    }

}

export default hitsInterface
export { hitsInterface }