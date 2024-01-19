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
  req: Request<{ company_id: string }, never, CreateEmployee>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const COMPANY_ID = parseInt(req.params.company_id)
    const cityRepository = new CityRepository(knex, 'cities')
    const accountRepository = new AccountRepository(knex, 'accounts')
    const companyEmployeeRepository = new CompanyEmployeesRepository(knex, 'company_employees')
    const city = await cityRepository.exist(req.body.city_id)

    if (!city) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'City is not found.' })

      return
    }

    const account = await accountRepository.exist({ email: req.body.email })

    if (account) {
      res
        .status(StatusCodes.CONFLICT)
        .json({ error: 'This user already exists.' })

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
        .json({ error: 'Failed to send email.' })

      return
    }

    const encryptedPassword = encryptPassword(password)
    const createdEmployeeId = await companyEmployeeRepository.createEmployee({
      ...req.body,
      password: encryptedPassword,
      companyId: COMPANY_ID
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
  req: Request<{ company_id: string }, any, any, BaseQueryString>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const COMPANY_ID = parseInt(req.params.company_id)
    const companyEmployeeRepository = new CompanyEmployeesRepository(knex, 'company_employees')
    const employees = await companyEmployeeRepository.findByPage(COMPANY_ID, req.query)

    res
      .status(StatusCodes.OK)
      .json({ employees })
  } catch (error) {
    next(error)
  }
}

export async function getCompanyEmployee (
  req: Request<{ company_id: string, employee_id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const COMPANY_ID = parseInt(req.params.company_id)
    const EMPLOYEE_ID = parseInt(req.params.employee_id)
    const companyEmployeeRepository = new CompanyEmployeesRepository(knex, 'company_employees')
    const employee = await companyEmployeeRepository.findProfile(EMPLOYEE_ID, COMPANY_ID)

    if (employee == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Employee is not found.' })

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
  req: Request<{ company_id: string, employee_id: string }, never, UpdateEmployee>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const COMPANY_ID = parseInt(req.params.company_id)
    const EMPLOYEE_ID = parseInt(req.params.employee_id)
    const cityRepository = new CityRepository(knex, 'cities')
    const companyEmployeeRepository = new CompanyEmployeesRepository(knex, 'company_employees')

    {
      const employee = await companyEmployeeRepository.exist({
        id: EMPLOYEE_ID,
        company_id: COMPANY_ID
      })

      if (!employee) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'Employee is not found.' })

        return
      }
    }

    const city = await cityRepository.exist(req.body.city_id)

    if (!city) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'City is not found.' })

      return
    }

    await companyEmployeeRepository.updateEmployee(EMPLOYEE_ID, COMPANY_ID, req.body)
    const employee = await companyEmployeeRepository.findProfile(EMPLOYEE_ID, COMPANY_ID)

    res
      .status(StatusCodes.OK)
      .json(employee)
  } catch (error) {
    next(error)
  }
}

export async function deleteCompanyEmployee (
  req: Request<{ company_id: string, employee_id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const COMPANY_ID = parseInt(req.params.company_id)
    const EMPLOYEE_ID = parseInt(req.params.employee_id)
    const companyEmployeeRepository = new CompanyEmployeesRepository(knex, 'company_employees')

    const employee = await companyEmployeeRepository.exist({
      id: EMPLOYEE_ID,
      company_id: COMPANY_ID
    })

    if (!employee) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Employee is not found.' })

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
        .json({ error: 'Failed to delete account.' })
    }
  } catch (error) {
    next(error)
  }
}
