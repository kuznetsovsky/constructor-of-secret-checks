import { type JSONSchemaType } from 'ajv'
import { type UpdateQuestionnaire } from './questionnaire.interface'

export const updateQuestionnaireSchema: JSONSchemaType<UpdateQuestionnaire> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'description',
    'is_required_address',
    'is_required_birthday',
    'is_required_city',
    'is_required_phone_number',
    'is_required_vk_link'
  ],
  properties: {
    description: {
      type: 'string',
      transform: ['trim'],
      maxLength: 120
    },
    is_required_address: {
      type: 'boolean'
    },
    is_required_birthday: {
      type: 'boolean'
    },
    is_required_city: {
      type: 'boolean'
    },
    is_required_phone_number: {
      type: 'boolean'
    },
    is_required_vk_link: {
      type: 'boolean'
    }
  }
}
