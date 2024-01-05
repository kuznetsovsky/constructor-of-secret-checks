import { StatusCodes } from 'http-status-codes'
import type { ValidateFunction } from 'ajv'
import type { Request, Response, NextFunction } from 'express'

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
