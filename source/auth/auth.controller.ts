import { randomBytes } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import type {
  SignIn,
  Profile,
  SignUpAdministrator,
  SignUpInspector
} from './auth.interface'

import * as authService from './auth.service'
import { checkPasswordCorrect, encryptPassword } from './auth.helper'
import { Roles } from '../consts'
import { CompanyRepository } from '../common/repositories/company.repository'
import { knex } from '../connection'
import { AccountRepository } from '../common/repositories/account.repository'
import { InspectorRepository } from '../common/repositories/inspector.repository'
import { sendMail } from '../common/libs/nodemailer.lib'
import { NO_REPLAY_EMAIL } from '../../config'
import { renderEjsTemplate } from '../common/libs/ejs.lib'

export async function signUpCompany (
  req: Request<never, never, SignUpAdministrator>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const companyRepository = new CompanyRepository(knex, 'companies')
  const accountRepository = new AccountRepository(knex, 'accounts')

  const { name, email, password } = req.body

  try {
    // =-=-=-=

    const company = await companyRepository.findOne({ name })

    if (company != null) {
      res.status(StatusCodes.CONFLICT)
        .json({ message: 'A company with the same name is already registered.' })
      return
    }

    // =-=-=-=

    const account = await accountRepository.findOne({ email })

    if (account != null) {
      res.status(StatusCodes.CONFLICT)
        .json({ message: 'An account with this email already exists.' })
      return
    }

    // =-=-=-=

    const encryptedPassword = encryptPassword(password)
    const accountId = await companyRepository.createAdministrator(name, email, encryptedPassword)

    // =-=-=-=

    const code = randomBytes(24).toString('base64')
    const emailInBase64 = btoa(email)
    const title = 'Email confirmation'
    const BASE_URL = `${req.protocol}://${req.hostname}`
    const link = `${BASE_URL}/email-verification?email=${emailInBase64}&verification_code=${code}`

    const templateString = await renderEjsTemplate('email-confirmation', {
      url: link,
      title
    })

    if (templateString == null) {
      const error = new Error('Failed to create ejs template')
      next(error)
      return
    }

    const isSuccessSendingMail = await sendMail(NO_REPLAY_EMAIL, email, title, templateString)

    if (isSuccessSendingMail) {
      res
        .status(StatusCodes.CREATED)
        .header('Location', `/api/v1/accounts/${accountId}`)
        .json({ id: accountId })
    } else {
      const error = new Error('Failed to send email')
      next(error)
    }
  } catch (error) {
    next(error)
  }
}

export async function signUpInspector (
  req: Request<never, never, SignUpInspector>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const accountRepository = new AccountRepository(knex, 'accounts')
  const inspectorRepository = new InspectorRepository(knex, 'inspectors')

  const {
    email,
    password,
    first_name: firstName,
    last_name: lastName
  } = req.body

  try {
    // =-=-=-=

    const account = await accountRepository.findOne({ email })

    if (account != null) {
      res.status(StatusCodes.CONFLICT)
        .json({ message: 'An account with this email already exists.' })
      return
    }

    // =-=-=-=

    const encryptedPassword = encryptPassword(password)
    const accountId = await inspectorRepository.createInspector(
      email,
      encryptedPassword,
      firstName,
      lastName
    )

    // =-=-=-=

    const code = randomBytes(24).toString('base64')
    const emailInBase64 = btoa(email)
    const title = 'Email confirmation'
    const BASE_URL = `${req.protocol}://${req.hostname}`
    const link = `${BASE_URL}/email-verification?email=${emailInBase64}&verification_code=${code}`

    const templateString = await renderEjsTemplate('email-confirmation', {
      url: link,
      title
    })

    if (templateString == null) {
      const error = new Error('Failed to create ejs template')
      next(error)
      return
    }

    const isSuccessSendingMail = await sendMail(NO_REPLAY_EMAIL, email, title, templateString)

    if (isSuccessSendingMail) {
      res
        .status(StatusCodes.CREATED)
        .header('Location', `/api/v1/accounts/${accountId}`)
        .json({ id: accountId })
    } else {
      const error = new Error('Failed to send email')
      next(error)
    }
  } catch (error) {
    next(error)
  }
}

export async function signIn (
  req: Request<never, never, SignIn>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const accountRepository = new AccountRepository(knex, 'accounts')

  const MSG = 'The user was not found with these login details or the account was not verified.'
  const { email, password } = req.body

  try {
    const account = await accountRepository.findVerifiedAccountByEmail(email)

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

    let profile: undefined | Profile

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

export async function signOut (
  req: Request,
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
