import { type BaseQueryString } from '../../common/interfaces/query-string.interface'
import { type InspectorStatus } from '../../consts'

export interface QueryString extends BaseQueryString {
  city: string
  surname: string
}

interface CompanyInspector {
  email: string
  first_name: string
  last_name: string
  city_id: number
}

export interface CreateCompanyInspector extends CompanyInspector {
  phone_number: string | null
  birthday: string | null
  address: string | null
  vk_link: string | null
}

export interface UpdateCompanyInspector extends CompanyInspector {
  phone_number: string
  birthday: string
  address: string
  vk_link: string
  note: string
}

export interface ChangeCompanyInspectorStatus {
  status: InspectorStatus
}
