import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import * as usersService from './users.service'
import { Roles } from '../consts'

import type {
  AdministratorProfile,
  InspectorProfile,
  GetAccountsQuery
} from './users.interface'

export async function getAccounts (
  req: Request<never, never, never, GetAccountsQuery>,
  res: Response,
  next: NextFunction
): Promise<void> {
  let page: number | undefined = parseInt(req.query.page)
  let perPage: number | undefined = parseInt(req.query.per_page)
  const role = req.query.role

  if (Number.isNaN(page)) {
    page = undefined
  }

  if (Number.isNaN(perPage)) {
    perPage = undefined
  }

  try {
    const accounts = await usersService.findAccounts(page, perPage, role)

    res
      .status(StatusCodes.OK)
      .json({
        data: accounts
      })
  } catch (error) {
    next(error)
  }
}

export async function getAccountByID (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const id = parseInt(req.params.id)

  if (Number.isNaN(id) || id < 1) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({
        error: 'Invalid request id parameter'
      })

    return
  }

  try {
    const account = await usersService.findAccountByID(id, ['role'])

    if (account == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({
          error: `Account with ID ${id} not found`
        })

      return
    }

    let profile: undefined | AdministratorProfile | InspectorProfile

    if (account.role === Roles.Inspector) {
      profile = await usersService.findInspectorProfileByID(id)
    } else if (account.role === Roles.Administrator) {
      profile = await usersService.findAdministratorProfileByID(id)
    } else if (account.role === Roles.Manager) {
      // TODO: сделать, когда будут менеджеры
      // findManagerProfileByID
    }

    res
      .status(StatusCodes.OK)
      .json(profile)
  } catch (error) {
    next(error)
  }
}
