import { StatusCodes } from 'http-status-codes'
import type { ValidateFunction } from 'ajv'
import type { Request, Response, NextFunction } from 'express'
import * as accountService from './common/services/account.service'
import type { AdminProfile, InspectorProfile } from './common/interfaces/profile.interface'

import {
  DEFAULT_PAGE,
  DEFAULT_PER_PAGE,
  MAX_PER_PAGE
} from '../config'

import { Roles } from './consts'
import { type AccountInterface } from 'knex/types/tables'

export function validateBody (validate: ValidateFunction) {
  return function bodyValidateMiddleware (req: Request, res: Response, next: NextFunction): void {
    if (!validate(req.body)) {
      res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({
          message: 'Validation failed',
          errors: validate.errors
        })

      return
    }

    next()
  }
}

export function isAuthorized (req: Request, res: Response, next: NextFunction): void {
  if (req.session?.user != null) {
    next()
  } else {
    res.status(StatusCodes.UNAUTHORIZED).end()
  }
}

interface Paginate {
  limit: number
  offset: number
}

export function paginate (
  page: number = DEFAULT_PAGE,
  perPage: number = DEFAULT_PER_PAGE
): Paginate {
  if (perPage > MAX_PER_PAGE) {
    perPage = MAX_PER_PAGE
  }

  if (page < 1) {
    page = 1
  }

  const limit = perPage
  const offset = (page - 1) * perPage

  return { limit, offset }
}

type Profile = AdminProfile | InspectorProfile
type UserRoles = 'inspector' | 'manager' | 'administrator' | 'sysadmin'

export async function findProfileByID (id: number, userRole?: UserRoles): Promise<undefined | Profile> {
  let role = userRole

  let account: AccountInterface | undefined

  if (role == null) {
    account = await accountService.findAccountByID(id, ['role'])

    if (account == null) {
      return undefined
    }

    role = account.role
  }

  let profile: undefined | Profile

  if (role === Roles.Inspector) {
    profile = await accountService.findInspectorProfileByID(id)
  } else if (role === Roles.Administrator) {
    profile = await accountService.findAdministratorProfileByID(id)
  } else if (role === Roles.Manager) {
    // TODO: сделать, когда будут менеджеры
    // findManagerProfileByID
  }

  return profile
}
