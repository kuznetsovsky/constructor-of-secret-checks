import { StatusCodes } from 'http-status-codes'
import type { ValidateFunction } from 'ajv'
import type { Request, Response, NextFunction } from 'express'

export function validateParams (validate: ValidateFunction) {
  return function _validateParams (req: Request, res: Response, next: NextFunction): void {
    if (!validate(req.params)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({
          type: 'params',
          message: 'Validation failed.',
          errors: validate.errors
        })

      return
    }

    next()
  }
}
