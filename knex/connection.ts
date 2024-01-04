import knexInstance from 'knex'
import knexConfig from '../knexfile'
import * as cfg from '../config'

declare module 'knex/types/tables' {
  interface AccountInterface {
    id: number
    role: 'inspector' | 'manager' | 'administrator' | 'sysadmin'
    email: string
    password: string
    email_verified: string | null
    created_at: string
    last_visit: string
  }

  interface CityInterface {
    id: number
    name: string
  }

  interface PhoneInterface {
    id: number
    phone_number: string
  }

  interface InspectorInterface {
    id: number
    account_id: number
    city_id: number | null
    phone_number_id: number | null
    first_name: string | null
    last_name: string | null
    birthday: string | null
    vk_link: string | null
    address: string | null
  }

  interface CompanyInterface {
    id: number
    questionnaire_id: number
    name: string
    description: string | null
    website_link: string | null
    vk_link: string | null
    logo: string | null
    number_of_checks: number | null
    created_at: string
    updated_at: string
  }

  interface CompanyContactPersonsInterface {
    id: number
    account_id: number
    company_id: number
    phone_number_id: number | null
    first_name: string | null
    last_name: string | null
  }

  interface CompanyQuestionnairesInterface {
    id: number
    link: string
    description: string
    is_required_city: boolean
    is_required_address: boolean
    is_required_phone_number: boolean
    is_required_vk_link: boolean
    is_required_birthday: boolean
  }

  interface Tables {
    accounts: AccountInterface
    cities: CityInterface
    phone_numbers: PhoneInterface
    inspectors: InspectorInterface
    companies: CompanyInterface
    company_contact_persons: CompanyContactPersonsInterface
    company_questionnaires: CompanyQuestionnairesInterface
  }
}

export const knex = knexInstance(knexConfig[cfg.ENV])

async function checkConnectionToPostgres (): Promise<void> {
  try {
    await knex.raw('SELECT now();')
  } catch (error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    throw new Error(error)
  }
}

void checkConnectionToPostgres()
