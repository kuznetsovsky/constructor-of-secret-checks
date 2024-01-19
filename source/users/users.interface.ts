import { type BaseQueryString } from '../common/helpers/validate-queries/validate-queries.helper'
import { Roles } from '../consts'

export const UserRoles = [
  Roles.Administrator,
  Roles.Inspector,
  Roles.Manager,
  'all'
]

export interface UsersQueryString extends BaseQueryString {
  role: 'all' | Roles
}

export interface UsersParams {
  user_id: string
}
