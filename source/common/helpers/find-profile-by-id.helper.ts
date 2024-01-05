import { type AccountInterface } from 'knex/types/tables'
import * as accountService from '../services/account.service'
import { Roles } from '../../consts'

import type {
  AdminProfile,
  InspectorProfile
} from '../interfaces/profile.interface'

type Profile = AdminProfile | InspectorProfile
type UserRoles = 'inspector' | 'manager' | 'administrator' | 'sysadmin'

export async function findProfileByID (id: number, userRole?: UserRoles): Promise<undefined | Profile> {
  let role = userRole

  let account: AccountInterface | undefined

  if (role == null) {
    account = await accountService.findAccountByID(id, ['role'])

    if (account == null) {
      return undefined
    }

    role = account.role
  }

  let profile: undefined | Profile

  if (role === Roles.Inspector) {
    profile = await accountService.findInspectorProfileByID(id)
  } else if (role === Roles.Administrator) {
    profile = await accountService.findAdministratorProfileByID(id)
  } else if (role === Roles.Manager) {
    // TODO: сделать, когда будут менеджеры
    // findManagerProfileByID
  }

  return profile
}
