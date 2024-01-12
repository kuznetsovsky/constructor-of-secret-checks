import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Roles } from '../../consts'

export function isCompanyAdminOrManager (req: Request, res: Response, next: NextFunction): void {
  let ID = parseInt(req.params.companyId)

  if (Number.isNaN(ID)) {
    ID = -1
  }

  if (!(req.session.user?.role === Roles.Administrator || req.session.user?.role === Roles.Manager)) {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ error: 'Access is allowed only to administrators or company managers.' })

    return
  }

  if (ID !== req.session.user?.cid) {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ error: 'You do not have rights for this action.' })

    return
  }

  next()
}
