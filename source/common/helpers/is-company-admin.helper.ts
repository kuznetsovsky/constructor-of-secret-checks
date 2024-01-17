import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Roles } from '../../consts'

export function isCompanyAdmin (req: Request<{ company_id: string }>, res: Response, next: NextFunction): void {
  const COMPANY_ID = parseInt(req.params.company_id)

  if (Number.isNaN(COMPANY_ID) || COMPANY_ID < 1) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid request parameter.' })

    return
  }

  if (req.session.user?.role === Roles.Administrator && req.session.user.cid === COMPANY_ID) {
    next()
  } else {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ error: 'This action is available only to company administrators.' })
  }
}
