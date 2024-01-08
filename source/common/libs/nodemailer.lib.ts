import nodemailer from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'

import {
  IS_DEV,
  IS_TEST,
  MAILER_HOST,
  MAILER_PORT,
  MAILER_SECURE,
  MAILER_PASS,
  MAILER_USER
} from '../../../config'

async function getTransport (): Promise<SMTPTransport.Options> {
  if (IS_DEV || IS_TEST) {
    const testAccount = await nodemailer.createTestAccount()

    return {
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    }
  } else {
    return {
      host: MAILER_HOST,
      port: MAILER_PORT,
      secure: MAILER_SECURE,
      auth: {
        user: MAILER_USER,
        pass: MAILER_PASS
      }
    }
  }
}

export async function sendMail (from: string, to: string, subject: string, templateString: string): Promise<void> {
  try {
    const options = await getTransport()
    const transporter = nodemailer.createTransport(options)

    const message = {
      from,
      to,
      subject,
      html: templateString
    }

    transporter.sendMail(message, (error, info) => {
      if (error instanceof Error) {
        console.log(`Error occurred. ${error.message}`)
        return
      }

      console.log('Message sent: %s', info.messageId)
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
    })
  } catch (error) {
    console.error(error)
  }
}
