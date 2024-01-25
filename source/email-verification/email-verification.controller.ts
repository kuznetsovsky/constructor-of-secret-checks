import { StatusCodes } from 'http-status-codes'

import { knex, redis } from '../connection'
import { type EmailVerify } from './email-verification.interface'
import { AccountRepository } from '../common/repositories/account.repository'
import { EXPIRES_IN_FIFTEEN_MINUTES } from '../../config'

import type {
  Request,
  Response,
  NextFunction
} from 'express'

export async function verify (
  req: Request<never, never, EmailVerify>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { ip } = req
  const accountRepository = new AccountRepository(knex, 'accounts')
  const { verification_code: verificationCode } = req.body
  const email = atob(req.body.email)

  try {
    {
      const key = `email_verification_attempts:${ip}`
      const activationAttempts = await redis.get(key)

      if (activationAttempts != null && parseInt(activationAttempts) >= 3) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'Account activation attempts exceeded. Please try again in 15 minutes.' })

        return
      }

      await redis.incr(key)
      await redis.expire(key, EXPIRES_IN_FIFTEEN_MINUTES)
    }

    const code = await redis.get(`email_verification:${email}`)

    if (code == null || code !== verificationCode) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Invalid activation code or activation time has expired.' })

      return
    }

    const account = await accountRepository.findOne({ email })

    if (account == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Account is not found' })

      return
    }

    await accountRepository.update(account.id, {
      email_verified: knex.fn.now() as unknown as string
    })

    res
      .status(StatusCodes.OK)
      .json({ message: 'Account activated successfully.' })
  } catch (error) {
    next(error)
  }
}
