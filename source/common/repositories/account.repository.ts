import { BaseRepository } from './base.repository'
import { paginate } from '../helpers/paginate.helper'
import { type UsersQueryString } from '../../users/users.interface'
import { type Roles } from '../../consts'
import { type EntityPaginateInterface, createPaginationResult } from '../helpers/create-pagination-result.helper'

export interface Account {
  id: number
  role: Roles
  email: string
  password: string
  email_verified: string | null
  created_at: string
  last_visit: string
}

export interface AccountsByPage extends EntityPaginateInterface {
  users: Array<Omit<Account, 'password'>>
}

export class AccountRepository extends BaseRepository<Account> {
  async findByPage (queries: UsersQueryString): Promise<AccountsByPage | null> {
    const { limit, offset, page } = paginate(parseInt(queries.page), parseInt(queries.per_page))

    const query = this.qb
      .select(
        'id',
        'role',
        'email',
        'email_verified',
        'created_at',
        'last_visit'
      )

    const accountsCountQuery = this.qb.count('id as accountsCount')

    if (queries.role !== 'all') {
      void query.where('role', queries.role)
      void accountsCountQuery.where('role', queries.role)
    }

    const users = await query
      .offset(offset)
      .limit(limit)
      .orderBy(queries.sort, queries.direction)

    if (users == null) {
      return null
    }

    const { accountsCount } = await accountsCountQuery.first()
    const count = parseInt(accountsCount as string)
    const info = createPaginationResult(count, { limit, page })

    if (info == null) {
      return null
    } else {
      return Object.assign({}, { users }, info)
    }
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
