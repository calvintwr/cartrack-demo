import { Request, Response, NextFunction } from 'express'
import Memory from '../Memory'

interface options {
    quotaWithin?: number
    max?: number
    message?: string
    keyGenerator?: keyGenerator
    handler?: handler
    store?: Memory
}

type keyGenerator = (req: Request) => string
type handler = (req: Request, res: Response, next?: NextFunction) => void 

export default options
export { options }