import Ajv from 'ajv'
import ajvFormats from 'ajv-formats'
import ajvKeywords from 'ajv-keywords'

export const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: true
})

ajvFormats(ajv)
ajvKeywords(ajv)
