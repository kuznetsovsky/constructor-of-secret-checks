import { BaseRepository } from './base.repository'
import { paginate } from '../helpers/paginate.helper'

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

export class AccountRepository extends BaseRepository<Account> {
  async findByPage (
    page: number | undefined,
    perPage: number | undefined,
    role: AccountRole | 'all' = 'all',
    sort: 'asc' | 'desc' = 'asc'
  ): Promise<Omit<Account, 'password'> | undefined> {
    const { limit, offset } = paginate(page, perPage)

    const query = this.qb
      .select(
        'id',
        'role',
        'email',
        'email_verified',
        'created_at',
        'last_visit'
      )

    if (role !== 'all') {
      void query.where('role', role)
    }

    const accounts = await query
      .offset(offset)
      .limit(limit)
      .orderBy('id', sort)

    return accounts
  }

  async findVerifiedAccountByEmail (email: string): Promise<Account | undefined> {
    const result = await this.qb
      .select('*')
      .where({ email })
      .whereNot('email_verified', null)
      .first()

    return result
  }
}
