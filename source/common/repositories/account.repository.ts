import { BaseRepository } from './base.repository'

export type AccountRole =
  | 'inspector'
  | 'manager'
  | 'administrator'

export interface Account {
  id: number
  role: AccountRole
  email: string
  password: string
  email_verified: string | null
  created_at: string
  last_visit: string
}

export class AccountRepository extends BaseRepository<Account> {}
