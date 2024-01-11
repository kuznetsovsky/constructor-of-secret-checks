import { ajv } from '../../common/libs/ajv.lib'
import { updateQuestionnaireSchema } from './questionnaire.schema'

export const updateQuestionnaireValidator = ajv.compile(updateQuestionnaireSchema)
