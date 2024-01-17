import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { findProfileByID } from '../common/helpers/find-profile-by-id.helper'
import type { GetAccountsQueryString } from './users.interface'
import { AccountRepository } from '../common/repositories/account.repository'
import { knex } from '../connection'

export async function getAccounts (
  req: Request<never, never, never, GetAccountsQueryString>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const accountRepository = new AccountRepository(knex, 'accounts')

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
    const accounts = await accountRepository.findByPage(page, perPage, role, req.query.sort)

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
