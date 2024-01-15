import { type GenerateOptions, generate } from 'generate-password'

export function generatePassword (options?: GenerateOptions): string {
  return generate({
    numbers: true,
    ...options
  })
}
