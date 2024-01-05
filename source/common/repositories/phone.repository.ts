import { BaseRepository } from './base.repository'

export interface Phone {
  id: number
  phone_number: string
}

export class PhoneRepository extends BaseRepository<Phone> {}
