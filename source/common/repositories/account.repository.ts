import { BaseRepository } from './base.repository'
import { paginate } from '../helpers/paginate.helper'
import { type UsersQueryString } from '../../users/users.interface'
import { type Roles } from '../../consts'

export interface Account {
  id: number
  role: Roles
  email: string
  password: string
  email_verified: string | null
  created_at: string
  last_visit: string
}

export class AccountRepository extends BaseRepository<Account> {
  async findByPage (queries: UsersQueryString): Promise<Omit<Account, 'password'> | undefined> {
    const { limit, offset } = paginate(parseInt(queries.page), parseInt(queries.per_page))

    const query = this.qb
      .select(
        'id',
        'role',
        'email',
        'email_verified',
        'created_at',
        'last_visit'
      )

    if (queries.role !== 'all') {
      void query.where('role', queries.role)
    }

    const accounts = await query
      .offset(offset)
      .limit(limit)
      .orderBy(queries.sort, queries.direction)

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
