import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { knex } from '../../connection'
import { type UpdateEmployee, type CreateEmployee } from './employees.interface'
import { CityRepository } from '../../common/repositories/city.repository'
import { generatePassword } from '../../common/libs/generate-password.lib'
import { AccountRepository } from '../../common/repositories/account.repository'
import { CompanyEmployeesRepository } from '../../common/repositories/company-employees.repository'
import { renderEjsTemplate } from '../../common/libs/ejs.lib'
import { encryptPassword } from '../../auth/auth.helper'
import { sendMail } from '../../common/libs/nodemailer.lib'
import { NO_REPLAY_EMAIL } from '../../../config'
import { type BaseQueryString } from '../../common/helpers/validate-queries/validate-queries.helper'

export async function createCompanyEmployee (
  req: Request<any, any, CreateEmployee>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.session.user
    if (user == null) {
      const error = new Error('"req.session.user" is missing.')
      next(error)
      return
    }

    const { cid } = user
    if (cid == null) {
      const error = new Error('"req.session.user.cid" is missing.')
      next(error)
      return
    }

    const cityRepository = new CityRepository(knex, 'cities')
    const accountRepository = new AccountRepository(knex, 'accounts')
    const companyEmployeeRepository = new CompanyEmployeesRepository(knex, 'company_employees')
    const city = await cityRepository.exist(req.body.city_id)

    if (!city) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'City is not found.' })

      return
    }

    const account = await accountRepository.exist({ email: req.body.email })

    if (account) {
      res
        .status(StatusCodes.CONFLICT)
        .json({ message: 'This user already exists.' })

      return
    }

    const password = generatePassword()
    const email = req.body.email
    const title = 'Access for company manager'

    const templateString = await renderEjsTemplate('new-user', {
      title,
      password,
      login: email
    })

    if (templateString == null) {
      const error = new Error('Failed to create ejs template.')
      next(error)
      return
    }

    const isSuccessSendingMail = await sendMail(NO_REPLAY_EMAIL, email, title, templateString)

    if (!isSuccessSendingMail) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to send email.' })

      return
    }

    const encryptedPassword = encryptPassword(password)
    const createdEmployeeId = await companyEmployeeRepository.createEmployee({
      ...req.body,
      password: encryptedPassword,
      companyId: cid
    })

    const employee = await companyEmployeeRepository.findProfile(createdEmployeeId)

    res
      .status(StatusCodes.CREATED)
      .json(employee)
  } catch (error) {
    next(error)
  }
}

export async function getCompanyEmployees (
  req: Request<any, any, any, BaseQueryString>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.session.user
    if (user == null) {
      const error = new Error('"req.session.user" is missing.')
      next(error)
      return
    }

    const { cid } = user
    if (cid == null) {
      const error = new Error('"req.session.user.cid" is missing.')
      next(error)
      return
    }

    const companyEmployeeRepository = new CompanyEmployeesRepository(knex, 'company_employees')
    const employees = await companyEmployeeRepository.findByPage(cid, req.query)

    if (employees == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'List is empty or wrong page.' })

      return
    }

    res
      .status(StatusCodes.OK)
      .json(employees)
  } catch (error) {
    next(error)
  }
}

export async function getCompanyEmployee (
  req: Request<{ employee_id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.session.user
    if (user == null) {
      const error = new Error('"req.session.user" is missing.')
      next(error)
      return
    }

    const { cid } = user
    if (cid == null) {
      const error = new Error('"req.session.user.cid" is missing.')
      next(error)
      return
    }

    const EMPLOYEE_ID = parseInt(req.params.employee_id)
    const companyEmployeeRepository = new CompanyEmployeesRepository(knex, 'company_employees')
    const employee = await companyEmployeeRepository.findProfile(EMPLOYEE_ID, cid)

    if (employee == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Employee is not found.' })

      return
    }

    res
      .status(StatusCodes.OK)
      .json(employee)
  } catch (error) {
    next(error)
  }
}

export async function updateCompanyEmployee (
  req: Request<{ employee_id: string }, never, UpdateEmployee>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.session.user
    if (user == null) {
      const error = new Error('"req.session.user" is missing.')
      next(error)
      return
    }

    const { cid } = user
    if (cid == null) {
      const error = new Error('"req.session.user.cid" is missing.')
      next(error)
      return
    }

    const EMPLOYEE_ID = parseInt(req.params.employee_id)
    const cityRepository = new CityRepository(knex, 'cities')
    const companyEmployeeRepository = new CompanyEmployeesRepository(knex, 'company_employees')

    {
      const employee = await companyEmployeeRepository.exist({
        id: EMPLOYEE_ID,
        company_id: cid
      })

      if (!employee) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Employee is not found.' })

        return
      }
    }

    const city = await cityRepository.exist(req.body.city_id)

    if (!city) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'City is not found.' })

      return
    }

    await companyEmployeeRepository.updateEmployee(EMPLOYEE_ID, cid, req.body)
    const employee = await companyEmployeeRepository.findProfile(EMPLOYEE_ID, cid)

    res
      .status(StatusCodes.OK)
      .json(employee)
  } catch (error) {
    next(error)
  }
}

export async function deleteCompanyEmployee (
  req: Request<{ employee_id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.session.user
    if (user == null) {
      const error = new Error('"req.session.user" is missing.')
      next(error)
      return
    }

    const { cid } = user
    if (cid == null) {
      const error = new Error('"req.session.user.cid" is missing.')
      next(error)
      return
    }

    const EMPLOYEE_ID = parseInt(req.params.employee_id)
    const companyEmployeeRepository = new CompanyEmployeesRepository(knex, 'company_employees')

    const employee = await companyEmployeeRepository.exist({
      id: EMPLOYEE_ID,
      company_id: cid
    })

    if (!employee) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Employee is not found.' })

      return
    }

    const deletedCount = await companyEmployeeRepository.delete(EMPLOYEE_ID)

    if (deletedCount !== 0) {
      res
        .status(StatusCodes.NO_CONTENT)
        .end()
    } else {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Failed to delete account.' })
    }
  } catch (error) {
    next(error)
  }
}
