export interface AdminProfile {
  first_name: string
  last_name: string
  phone_number: string
}

export interface InspectorProfile extends AdminProfile {
  birthday: string
  vk_link: string
  address: string
  city_id: number
}

export type Profile = AdminProfile | InspectorProfile
