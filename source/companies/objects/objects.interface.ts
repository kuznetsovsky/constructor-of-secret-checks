import { type EntryTypes } from '../../consts'

export interface CompanyObject {
  city_id: number
  entry_type: EntryTypes
  name: string
  street: string
  house_number: string
}

export interface ObjectsParams {
  object_id: string
}
