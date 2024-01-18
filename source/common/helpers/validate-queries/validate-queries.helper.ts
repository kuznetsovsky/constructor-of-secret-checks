import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { queriesValidator } from './validate-queries.validator'

export interface BaseQueryString<T extends string = 'id'> {
  [key: string]: string
  page: string
  per_page: string
  direction: 'desc' | 'asc'
  sort: T
}

export interface QueryString {
  [key: string]: any
  sort?: string
  direction?: 'desc' | 'asc'
  page?: string
  per_page?: string
}

export function validateQueries (sortings: string[] = ['id']) {
  return function _validateQueries (
    req: Request<any, any, any, QueryString>,
    res: Response,
    next: NextFunction
  ): void {
    const validate = queriesValidator(req.query)
    if (!validate) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({
          type: 'query_string',
          message: 'Validation failed.',
          errors: queriesValidator.errors
        })

      return
    }

    const { sort = 'desc' } = req.query
    if (!sortings.includes(sort)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({
          error: 'Invalid "sort" query string.',
          available_values: sortings
        })

      return
    }

    next()
  }
}
