import { StatusCodes } from 'http-status-codes'
import type { ValidateFunction } from 'ajv'
import type { Request, Response, NextFunction } from 'express'

import {
  DEFAULT_PAGE,
  DEFAULT_PER_PAGE,
  MAX_PER_PAGE
} from '../config'

export function validateBody (validate: ValidateFunction) {
  return function bodyValidateMiddleware (req: Request, res: Response, next: NextFunction): void {
    if (!validate(req.body)) {
      res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({
          message: 'Validation failed',
          errors: validate.errors
        })

      return
    }

    next()
  }
}

export function isAuthorized (req: Request, res: Response, next: NextFunction): void {
  if (req.session?.user != null) {
    next()
  } else {
    res.status(StatusCodes.UNAUTHORIZED).end()
  }
}

interface Paginate {
  limit: number
  offset: number
}

export function paginate (
  page: number = DEFAULT_PAGE,
  perPage: number = DEFAULT_PER_PAGE
): Paginate {
  if (perPage > MAX_PER_PAGE) {
    perPage = MAX_PER_PAGE
  }

  if (page < 1) {
    page = 1
  }

  const limit = perPage
  const offset = (page - 1) * perPage

  return { limit, offset }
}
