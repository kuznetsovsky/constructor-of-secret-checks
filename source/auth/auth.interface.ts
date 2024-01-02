import { type Roles } from '../consts'

export interface CreateAdministratorReqBodyInterface {
  name: string
  email: string
  password: string
}

export interface CreateInspectorReqBodyInterface {
  first_name: string
  last_name: string
  email: string
  password: string
}

export interface AuthorizationReqBodyInterface {
  email: string
  password: string
}

interface CompanyDetails {
  id: number
  name: string
}

export interface ProfileInterface {
  id: number
  role: Roles
  email: string
  first_name: string
  last_name: string
  company?: CompanyDetails
}
