import { knex } from '../../knex/connection'
import { type Roles } from '../consts'
import { paginate } from '../helpers'

import type { GetAccounts } from './users.interface'

export async function findAccounts (
  page: number | undefined,
  perPage: number | undefined,
  role: Roles | 'all' = 'all'
): Promise<GetAccounts[]> {
  const { limit, offset } = paginate(page, perPage)
  // TODO: improve create sort / order_by

  const qb = knex('accounts')
    .select(
      'id',
      'role',
      'email',
      'email_verified',
      'created_at',
      'last_visit'
    )

  if (role !== 'all') {
    void qb.where('role', role)
  }

  const result = await qb
    .offset(offset)
    .limit(limit)
    .orderBy('id', 'asc')

  return result as unknown as GetAccounts[]
}
