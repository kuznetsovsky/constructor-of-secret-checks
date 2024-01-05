import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

export function isAuthorized (req: Request, res: Response, next: NextFunction): void {
  if (req.session?.user != null) {
    next()
  } else {
    res.status(StatusCodes.UNAUTHORIZED).end()
  }
}
