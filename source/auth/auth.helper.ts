import crypto from 'node:crypto'

export function encryptPassword (password: string): string {
  const passwordSalt = crypto
    .randomBytes(16)
    .toString('base64')

  const passwordHash = crypto
    .createHmac('sha512', passwordSalt)
    .update(password)
    .digest('base64')

  return `${passwordSalt}$${passwordHash}`
}

export function checkPasswordCorrect (password: string, encryptedPassword: string): boolean {
  const [salt, passwordHash] = encryptedPassword.split('$')

  const hash = crypto
    .createHmac('sha512', salt)
    .update(password)
    .digest('base64')

  return hash === passwordHash
}
