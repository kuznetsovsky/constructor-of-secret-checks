import { type Roles } from '../../consts'

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

export interface AdminProfile extends BaseProfile {
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
