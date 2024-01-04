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

interface Company {
  id: number
  name: string
}

interface City {
  id: number
  name: string
}

interface BaseProfile {
  id: number
  email: string
  first_name: string | null
  last_name: string | null
  phone_number: string | null
}

export interface AdministratorProfile extends BaseProfile {
  role: Roles.Administrator
  company: Company | null
}

export interface InspectorProfile {
  role: Roles.Inspector
  birthday: string | null
  vk_link: string | null
  address: string | null
  city: City | null
}
