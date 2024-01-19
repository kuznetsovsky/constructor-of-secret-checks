import { StatusCodes } from 'http-status-codes'
import type { NextFunction, Request, Response } from 'express'
import { Roles } from '../../consts'

export function onlyCompanyOwner (
  req: Request<{ company_id: string }>,
  res: Response,
  next: NextFunction
): void {
  const user = req.session.user

  if (user == null) {
    const error = new Error('"req.session.user" is missing.')
    next(error)
    return
  }

  const { role, cid } = user
  const COMPANY_ID = parseInt(req.params.company_id)

  if (role === Roles.Administrator && cid === COMPANY_ID) {
    next()
  } else {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "You don't have access to this action." })
  }
}

export function onlyCompanyAdminOrManager (
  req: Request<{ company_id: string }>,
  res: Response,
  next: NextFunction
): void {
  const user = req.session.user

  if (user == null) {
    const error = new Error('"req.session.user" is missing.')
    next(error)
    return
  }

  const { role, cid } = user
  const COMPANY_ID = parseInt(req.params.company_id)

  if (!(role === Roles.Administrator || role === Roles.Manager)) {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "You don't have access to this action." })

    return
  }

  if (COMPANY_ID !== cid) {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "You don't have access to this action." })

    return
  }

  next()
}
