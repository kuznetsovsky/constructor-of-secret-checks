import { type Roles } from '../consts'

export interface GetAccountsQuery {
  page: string
  per_page: string
  role: 'all' | Roles
  sort: 'asc' | 'desc'
}
