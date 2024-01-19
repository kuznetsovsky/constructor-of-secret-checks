import { type JSONSchemaType } from 'ajv'
import { type UpdateCompany, type CompaniesParams } from './companies.interface'

export const updateCompanySchema: JSONSchemaType<UpdateCompany> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'name',
    'description',
    'website_link',
    'vk_link',
    'number_of_checks'
  ],
  properties: {
    name: {
      type: 'string',
      transform: ['trim'],
      minLength: 5,
      maxLength: 32
    },
    description: {
      type: 'string',
      transform: ['trim'],
      maxLength: 90
    },
    website_link: {
      type: 'string',
      transform: ['trim'],
      format: 'uri',
      maxLength: 90
    },
    vk_link: {
      type: 'string',
      format: 'uri',
      // eslint-disable-next-line no-useless-escape
      pattern: '^https:\/\/vk\\.com',
      maxLength: 90
    },
    number_of_checks: {
      type: 'number',
      minimum: 0
    }
  }
}

export const companiesParamsSchema: JSONSchemaType<CompaniesParams> = {
  type: 'object',
  additionalProperties: true,
  required: ['company_id'],
  properties: {
    company_id: {
      type: 'string',
      transform: ['trim'],
      pattern: '^\\d+$'
    }
  }
}
