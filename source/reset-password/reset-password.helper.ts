import { randomBytes } from 'node:crypto'

import { renderEjsTemplate } from '../common/libs/ejs.lib'
import { sendMail } from '../common/libs/nodemailer.lib'
import { NO_REPLAY_EMAIL } from '../../config'
import { redis } from '../connection'

export const sendEmailResetPassword = async (email: string, userId: number, baseUrl: string): Promise<boolean> => {
  const token = randomBytes(32).toString('base64')
  const title = 'Link to recover a forgotten password'
  const link = `${baseUrl}/reset-password?token=${token}`

  const templateString = await renderEjsTemplate('email-confirmation', {
    url: link,
    title
  })

  if (templateString == null) {
    return false
  }

  const isSuccessSendingMail = await sendMail(NO_REPLAY_EMAIL, email, title, templateString)

  await redis.set(`recovery:${token}`, userId, 'EX', 60 * 60) // 1 hour

  return isSuccessSendingMail
}
