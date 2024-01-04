import { type Roles } from '../consts'

export interface GetAccountsQuery {
  page: string
  per_page: string
  role: 'all' | Roles
}

export interface GetAccounts {
  id: number
  role: Roles
  email: string
  email_verified: string | null
  created_at: string
  last_visit: string
}
