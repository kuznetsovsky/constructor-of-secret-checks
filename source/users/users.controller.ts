import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { knex } from '../connection'
import { UserRoles, type UsersQueryString } from './users.interface'
import { findProfileByID } from '../common/helpers/find-profile-by-id.helper'
import { AccountRepository } from '../common/repositories/account.repository'

export async function getAccounts (
  req: Request<never, never, never, UsersQueryString>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const role = req.query.role ?? 'all'
    if (!UserRoles.includes(role)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({
          message: 'Wrong account role.',
          available_values: UserRoles
        })

      return
    }

    const accountRepository = new AccountRepository(knex, 'accounts')
    const users = await accountRepository.findByPage({
      ...req.query,
      role
    })

    res
      .status(StatusCodes.OK)
      .json({ users })
  } catch (error) {
    next(error)
  }
}

export async function getAccountByID (
  req: Request<{ user_id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const USER_ID = parseInt(req.params.user_id)

  if (Number.isNaN(USER_ID) || USER_ID < 1) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({
        error: 'Invalid request id parameter'
      })

    return
  }

  try {
    const profile = await findProfileByID(USER_ID)

    if (profile == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({
          error: `Account with ID ${USER_ID} not found`
        })

      return
    }

    res
      .status(StatusCodes.OK)
      .json(profile)
  } catch (error) {
    next(error)
  }
}
