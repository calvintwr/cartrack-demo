import { NextFunction, Request, Response } from "express"

const errorNotFound = function(req: Request, res: Response, next: NextFunction) {
    const err       = new Error('404: Not Found')
    res.statusCode  = 404
    next(err)
}

export default errorNotFound
export { errorNotFound }
