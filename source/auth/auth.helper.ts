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
