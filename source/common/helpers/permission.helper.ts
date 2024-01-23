import { StatusCodes } from 'http-status-codes'
import type { NextFunction, Request, Response } from 'express'
import { Roles } from '../../consts'

export const onlyUsersWithAdminRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = req.session.user
  if (user == null) {
    const error = new Error('"req.session.user" is missing.')
    next(error)
    return
  }

  const { role } = user
  if (role !== Roles.Administrator) {
    res.status(StatusCodes.FORBIDDEN)
      .json({ message: 'Only available to users with administrator role.' })

    return
  }

  next()
}

export const onlyUsersWithAdminOrManagerRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = req.session.user
  if (user == null) {
    const error = new Error('"req.session.user" is missing.')
    next(error)
    return
  }

  const { role } = user
  if (role === Roles.Administrator || role === Roles.Manager) {
    next()
  } else {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: 'Only available to users with administrator role or manager.' })
  }
}

export const onlyUsersWithInspectorRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = req.session.user
  if (user == null) {
    const error = new Error('"req.session.user" is missing.')
    next(error)
    return
  }

  const { role } = user
  if (role !== Roles.Inspector) {
    res.status(StatusCodes.FORBIDDEN)
      .json({ message: 'Only available to users with inspector role.' })

    return
  }

  next()
}
