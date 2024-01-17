import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Roles } from '../../consts'

export function isCompanyAdminOrManager (req: Request<{ company_id: string }>, res: Response, next: NextFunction): void {
  const COMPANY_ID = parseInt(req.params.company_id)

  if (Number.isNaN(COMPANY_ID) || COMPANY_ID < 1) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid request parameter.' })

    return
  }

  if (!(req.session.user?.role === Roles.Administrator || req.session.user?.role === Roles.Manager)) {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ error: 'Access is allowed only to administrators or company managers.' })

    return
  }

  if (COMPANY_ID !== req.session.user?.cid) {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ error: 'You do not have rights for this action.' })

    return
  }

  next()
}
