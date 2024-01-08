import { type BaseQueryString } from '../common/interfaces/query-string.interface'
import { type Roles } from '../consts'

export interface GetAccountsQueryString extends BaseQueryString {
  role: 'all' | Roles
}
