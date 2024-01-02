import { type Roles } from '../consts'

export interface SignUpAdministrator {
  name: string
  email: string
  password: string
}

export interface SignUpInspector {
  first_name: string
  last_name: string
  email: string
  password: string
}

export interface SignIn {
  email: string
  password: string
}

interface CompanyDetails {
  id: number
  name: string
}

export interface Profile {
  id: number
  role: Roles
  email: string
  first_name: string
  last_name: string
  company?: CompanyDetails
}
