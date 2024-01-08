import { StatusCodes } from 'http-status-codes'
import { type Feedback } from './feedback.interface'

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
  const { message } = req.body

  // TODO:
  // 1. send a message by email
  // 2. make restrictions on sending spam messages
  console.log('Feedback', message)

  try {
    res
      .status(StatusCodes.OK)
      .end()
  } catch (error) {
    next(error)
  }
}
