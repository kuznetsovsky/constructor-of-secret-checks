import { ajv } from '../../../common/libs/ajv.lib'
import { validateQueriesSchema } from './validate-queries.schema'

export const queriesValidator = ajv.compile(validateQueriesSchema)
