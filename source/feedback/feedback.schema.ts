import { type JSONSchemaType } from 'ajv'
import { type Feedback } from './feedback.interface'

export const sendFeedbackSchema: JSONSchemaType<Feedback> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'message'
  ],
  properties: {
    message: {
      type: 'string',
      maxLength: 128,
      transform: ['trim']
    }
  }
}
