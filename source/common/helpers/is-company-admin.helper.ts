import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Roles } from '../../consts'

export function isCompanyAdmin (req: Request, res: Response, next: NextFunction): void {
  let ID = parseInt(req.params.companyId)

  if (Number.isNaN(ID)) {
    ID = -1
  }

  if (req.session.user?.role === Roles.Administrator && req.session.user.cid === ID) {
    next()
  } else {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ error: 'This action is available only to company administrators.' })
  }
}
