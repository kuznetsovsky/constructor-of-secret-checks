import { ajv } from '../common/libs/ajv.lib'
import { usersParamsSchema } from './users.schema'

export const usersParamsValidator = ajv.compile(usersParamsSchema)
