import { BaseRepository } from './base.repository'

export interface Questionnaire {
  id: number
  link: string
  token: string
  description: string
  is_required_city: boolean
  is_required_address: boolean
  is_required_phone_number: boolean
  is_required_vk_link: boolean
  is_required_birthday: boolean
}

export class QuestionnaireRepository extends BaseRepository<Questionnaire> {}
