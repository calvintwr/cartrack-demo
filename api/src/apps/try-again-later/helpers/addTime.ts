const addTime = function(
    now     : Date
    , add   : number
    , unit  : 'minutes' | 'seconds' | 'addMiliseconds'
): Date {

    const d = new Date(now.getTime())
    
    var addMiliseconds

    switch (unit) {

        case 'minutes':
            addMiliseconds = add * 60 * 1000
            break
        
        case 'seconds':
            addMiliseconds = add * 1000
            break

        default:
            addMiliseconds = add
    }
    d.setMilliseconds(d.getMilliseconds() + addMiliseconds)
    return d

}

export default addTime
export { addTime }