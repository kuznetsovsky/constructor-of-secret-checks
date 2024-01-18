import { type JSONSchemaType } from 'ajv'
import { type QueryString } from './validate-queries.helper'

import {
  DEFAULT_DIRECTION,
  DEFAULT_PAGE,
  DEFAULT_PER_PAGE,
  DEFAULT_SORT
} from '../../../../config'

export const validateQueriesSchema: JSONSchemaType<QueryString> = {
  type: 'object',
  properties: {
    page: {
      type: 'string',
      transform: ['trim'],
      pattern: '^\\d+$',
      default: DEFAULT_PAGE,
      nullable: true
    },
    per_page: {
      type: 'string',
      transform: ['trim'],
      pattern: '^\\d+$',
      default: DEFAULT_PER_PAGE,
      nullable: true
    },
    direction: {
      type: 'string',
      transform: ['trim'],
      enum: ['desc', 'asc'],
      default: DEFAULT_DIRECTION,
      nullable: true
    },
    sort: {
      type: 'string',
      transform: ['trim'],
      default: DEFAULT_SORT,
      nullable: true
    }
  }
}
