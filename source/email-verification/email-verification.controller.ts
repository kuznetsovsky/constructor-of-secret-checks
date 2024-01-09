import { StatusCodes } from 'http-status-codes'

import { type EmailVerify } from './email-verification.interface'
import { AccountRepository } from '../common/repositories/account.repository'
import { knex, redis } from '../connection'

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
  const accountRepository = new AccountRepository(knex, 'accounts')
  const { verification_code: verificationCode } = req.body
  const email = atob(req.body.email)

  try {
    // TODO: create restrict activation attempts

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
