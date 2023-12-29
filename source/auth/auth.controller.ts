import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import * as authService from './auth.service'
import type * as I from './auth.interface'
import { encryptPassword } from './auth.helper'

export async function createCompany (
  req: Request<never, never, I.CreateAdministratorReqBodyInterface>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { name, email, password } = req.body

  try {
    // =-=-=-=

    const companyNameExist = await authService.findCompanyByName(name)

    if (companyNameExist) {
      res.status(StatusCodes.CONFLICT)
        .json({ message: 'A company with the same name is already registered.' })
      return
    }

    // =-=-=-=

    const accountEmailExist = await authService.findAccountByEmail(email)

    if (accountEmailExist) {
      res.status(StatusCodes.CONFLICT)
        .json({ message: 'An account with this email already exists.' })
      return
    }

    // =-=-=-=

    const encryptedPassword = encryptPassword(password)
    const accountId = await authService.createCompany(name, email, encryptedPassword)

    // =-=-=-=

    res
      .status(StatusCodes.CREATED)
      .header('Location', `/api/v1/accounts/${accountId}`)
      .json({ id: accountId })
  } catch (error) {
    next(error)
  }
}
