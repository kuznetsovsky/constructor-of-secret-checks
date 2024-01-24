import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { knex, redis } from '../connection'
import { type ResetPassword, type ResetEmail } from './reset-password.interface'
import { AccountRepository } from '../common/repositories/account.repository'
import { sendEmailResetPassword } from './reset-password.helper'
import { encryptPassword } from '../auth/auth.helper'
import { EXPIRE_THROUGH_FIFTEEN_MINUTES } from '../../config'

export const email = async (
  req: Request<any, any, ResetEmail>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const message = 'You will receive a reset email if user with that email exist.'

  try {
    const { email } = req.body
    const accountRepository = new AccountRepository(knex, 'accounts')
    const account = await accountRepository.findVerifiedAccountByEmail(email)

    if (account == null) {
      res.status(StatusCodes.ACCEPTED)
        .json({ message })

      return
    }

    const baseUrl = `${req.protocol}://${req.hostname}`
    await sendEmailResetPassword(email, account.id, baseUrl)

    res
      .status(StatusCodes.ACCEPTED)
      .json({ message })
  } catch (error) {
    next(error)
  }
}

export const password = async (
  req: Request<any, any, ResetPassword>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const attemptKey = `attempts_to_reset_password:${req.ip}`
    const attempts = await redis.get(attemptKey)
    if (attempts != null && parseInt(attempts) >= 3) {
      res.status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Reset password attempts exceeded. Repeat after 15 minutes.' })

      return
    }

    const { token } = req.body
    const userId = await redis.get(`recovery:${token}`)
    if (userId == null) {
      await redis.incr(`attempts_to_reset_password:${req.ip}`)
      await redis.expire(attemptKey, EXPIRE_THROUGH_FIFTEEN_MINUTES)

      res.status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid recovery token.' })

      return
    }

    const { password } = req.body
    const accountRepository = new AccountRepository(knex, 'accounts')
    const encryptedPassword = encryptPassword(password)
    await accountRepository.update(parseInt(userId), {
      password: encryptedPassword
    })

    res
      .status(StatusCodes.NO_CONTENT)
      .end()
  } catch (error) {
    next(error)
  }
}
