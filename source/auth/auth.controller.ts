import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import * as authService from './auth.service'
import type * as I from './auth.interface'
import { checkPasswordCorrect, encryptPassword } from './auth.helper'
import { Roles } from '../consts'

export async function createCompany (
  req: Request<never, never, I.CreateAdministratorReqBodyInterface>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { name, email, password } = req.body

  try {
    // =-=-=-=

    const companyNameExist = await authService.checkExistenceOfCompanyByName(name)

    if (companyNameExist) {
      res.status(StatusCodes.CONFLICT)
        .json({ message: 'A company with the same name is already registered.' })
      return
    }

    // =-=-=-=

    const accountEmailExist = await authService.checkAccountExistenceByEmail(email)

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

export async function createInspector (
  req: Request<never, never, I.CreateInspectorReqBodyInterface>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const {
    email,
    password,
    first_name: firstName,
    last_name: lastName
  } = req.body

  try {
    // =-=-=-=

    const isAccountExist = await authService.checkAccountExistenceByEmail(email)

    if (isAccountExist) {
      res.status(StatusCodes.CONFLICT)
        .json({ message: 'An account with this email already exists.' })
      return
    }

    // =-=-=-=

    const encryptedPassword = encryptPassword(password)
    const accountId = await authService.createInspector(
      email,
      encryptedPassword,
      firstName,
      lastName
    )

    // =-=-=-=

    res
      .status(StatusCodes.CREATED)
      .header('Location', `/api/v1/accounts/${accountId}`)
      .json({ id: accountId })
  } catch (error) {
    next(error)
  }
}

export async function authorization (
  req: Request<never, never, I.AuthorizationReqBodyInterface>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const MSG = 'The user was not found with these login details or the account was not verified.'
  const { email, password } = req.body

  try {
    // =-=-=-=

    const account = await authService.findVerifiedAccountByEmail(email)

    if (account === undefined) {
      res.status(StatusCodes.UNAUTHORIZED)
        .json({ message: MSG })

      return
    }

    // =-=-=-=

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const passwordsMatch = checkPasswordCorrect(password, account.password)

    if (!passwordsMatch) {
      res.status(StatusCodes.UNAUTHORIZED)
        .json({ message: MSG })

      return
    }

    // =-=-=-=
    let profile: undefined | I.ProfileInterface

    if (account.role === Roles.Inspector) {
      profile = await authService.findInspectorProfile(account.id)
    } else if (account.role === Roles.Manager) {
      // findManagerProfile
    } else if (account.role === Roles.Administrator) {
      profile = await authService.findAdministratorProfile(account.id)
    }

    if (profile !== undefined) {
      req.session.user = {
        id: profile.id,
        role: profile.role,
        cid: profile.company?.id
      }
    }

    res
      .status(StatusCodes.OK)
      .json(profile)
  } catch (error) {
    next(error)
  }
}

export async function logout (
  req: Request<never, never, I.AuthorizationReqBodyInterface>,
  res: Response,
  next: NextFunction
): Promise<void> {
  req.session.destroy((err) => {
    if (err != null) {
      next(err)
      return
    }

    res.clearCookie('connect.sid')
    res.status(StatusCodes.OK).end()
  })
}
