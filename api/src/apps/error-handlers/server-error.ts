import { NextFunction, Request, Response } from "express"

const errorServer = function(err: Error, req: Request, res: Response, next: NextFunction) {

    // if statusCode has not been previously changed, set to generic 500
    if (res.statusCode >= 200 && res.statusCode <= 299) res.statusCode = 500

    // set locals, only providing error in development
    res.locals.message  = err.message;
    res.locals.error    = req.app.get('env') === 'development' ? err : {}

    res.send({
        success: false,
        ...res.locals
    })

}
export default errorServer
export { errorServer }
