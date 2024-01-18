import { Roles } from '../../consts'
import { knex } from '../../connection'

import {
  AccountRepository,
  type Account
} from '../repositories/account.repository'

import {
  type InspectorProfile,
  InspectorRepository
} from '../repositories/inspector.repository'

import {
  type AdministratorProfile,
  AdminsitratorRepository
} from '../repositories/administrator.repository'

import {
  type ManagerProfile,
  ManagerRepository
} from '../repositories/manager.repository'

type AccountRole =
  | 'inspector'
  | 'manager'
  | 'administrator'

type Profile = InspectorProfile | AdministratorProfile | ManagerProfile

export async function findProfileByID (id: number, userRole?: AccountRole): Promise<undefined | Profile> {
  const accountRepository = new AccountRepository(knex, 'accounts')
  const inspectorRepository = new InspectorRepository(knex, 'inspectors')
  const administratorRepository = new AdminsitratorRepository(knex, 'company_contact_persons')
  const managerRepository = new ManagerRepository(knex, 'company_employees')

  let role = userRole

  let account: Account | undefined

  if (role == null) {
    account = await accountRepository.findOne(id, ['role'])

    if (account == null) {
      return undefined
    }

    role = account.role
  }

  let profile: undefined | Profile

  if (role === Roles.Inspector) {
    profile = await inspectorRepository.findProfileByID(id)
  } else if (role === Roles.Administrator) {
    profile = await administratorRepository.findProfileByID(id)
  } else if (role === Roles.Manager) {
    profile = await managerRepository.findProfileByID(id)
  }

  return profile
}
