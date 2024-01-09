import { StatusCodes } from 'http-status-codes'
import sanitizer from 'sanitize-html'

import { knex } from '../connection'
import { FEEDBACK_EMAIL } from '../../config'
import { type Feedback } from './feedback.interface'
import { sendMail } from '../common/libs/nodemailer.lib'
import { AccountRepository } from '../common/repositories/account.repository'

import type {
  Request,
  Response,
  NextFunction
} from 'express'

export async function sendFeedback (
  req: Request<never, never, Feedback>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const accountRepository = new AccountRepository(knex, 'accounts')

  const { message } = req.body
  const ID = req.session.user?.id

  if (ID == null) {
    const error = new Error('ID is missing.')
    next(error)
    return
  }

  try {
    const account = await accountRepository.findOne(ID, ['email'])

    if (account == null) {
      const error = new Error('account is missing.')
      next(error)
      return
    }

    // TODO:
    // 2. make restrictions on sending spam messages

    const sanitizeMessage = sanitizer(message)
    const sendingMailStatus = await sendMail(account.email, FEEDBACK_EMAIL, 'User feedback', sanitizeMessage)

    if (sendingMailStatus) {
      res
        .status(StatusCodes.OK)
        .end()
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: 'Failed to send message'
        })
    }
  } catch (error) {
    next(error)
  }
}
