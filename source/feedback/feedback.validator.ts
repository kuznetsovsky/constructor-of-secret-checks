import { ajv } from '../common/libs/ajv.lib'
import { sendFeedbackSchema } from './feedback.schema'

export const sendFeedbackValidator = ajv.compile(sendFeedbackSchema)
