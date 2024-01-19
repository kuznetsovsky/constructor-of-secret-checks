import { ajv } from '../common/libs/ajv.lib'
import { cityParamsSchema } from './cities.schema'

export const citiesParamsValidator = ajv.compile(cityParamsSchema)
