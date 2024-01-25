import { type Request, type Response, type NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { knex } from '../../connection'
import { NO_REPLAY_EMAIL } from '../../../config'
import { InspectorStatus, Roles } from '../../consts'
import { encryptPassword } from '../../auth/auth.helper'
import { sendMail } from '../../common/libs/nodemailer.lib'
import { renderEjsTemplate } from '../../common/libs/ejs.lib'
import { PhoneRepository } from '../../common/repositories/phone.repository'
import { generatePassword } from '../../common/libs/generate-password.lib'
import { CityRepository } from '../../common/repositories/city.repository'
import { AccountRepository } from '../../common/repositories/account.repository'
import { CompanyInspectorRepository } from '../../common/repositories/company-inspectors.repository'
import { InspectorRepository } from '../../common/repositories/inspector.repository'
import { type BaseQueryString } from '../../common/helpers/validate-queries/validate-queries.helper'

import type {
  CreateCompanyInspector,
  UpdateCompanyInspector,
  ChangeCompanyInspectorStatus
} from './inspectors.interface'

export async function createNewCompanyInspector (
  req: Request<any, any, CreateCompanyInspector>,
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
    const companyInspectorRepository = new CompanyInspectorRepository(knex, 'company_inspectors')

    const city = await cityRepository.exist(req.body.city_id)

    if (!city) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'City is not found.' })

      return
    }

    const inspector = await accountRepository.findOne({ email: req.body.email })

    if (inspector != null) {
      res
        .status(StatusCodes.CONFLICT)
        .json({
          message: 'An inspector with the same email already exists.',
          error_description: 'For existing inspectors, use the POST: /companies/{companyId}/inspectors/{email} route.'
        })

      return
    }

    const password = generatePassword()

    const email = req.body.email
    const title = 'Invitation to become a secret inspector'

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
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Failed to send email.' })

      return
    }

    const encryptedPassword = encryptPassword(password)
    const id = await companyInspectorRepository.createNewInspector({
      ...req.body,
      password: encryptedPassword,
      companyId: cid
    })

    const createdInspector = await companyInspectorRepository.findCompanyInspectorByID(
      cid,
      id
    )

    res
      .status(StatusCodes.CREATED)
      .header('Location', `/companies/${cid}/inspectors/${id}`)
      .json(createdInspector)
  } catch (error) {
    next(error)
  }
}

export async function getCompanyInspectors (
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

    const cityRepository = new CityRepository(knex, 'cities')
    const companyInspectorRepository = new CompanyInspectorRepository(knex, 'company_inspectors')

    let cityId: number | undefined

    if (req.query.city != null) {
      const city = await cityRepository.findOne({ name: req.query.city })

      if (city == null) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'City is not found.' })

        return
      }

      cityId = city.id
    }

    // IMPROVEMENT: сделать единным с quries
    const inspectors = await companyInspectorRepository.findByPage(
      cid,
      req.query,
      { city: cityId, surname: req.query.surname }
    )

    res
      .status(StatusCodes.OK)
      .json({ inspectors })
  } catch (error) {
    next(error)
  }
}

export async function getCompanyInspector (
  req: Request<{ inspector_id: string }>,
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

    const INSPECTOR_ID = parseInt(req.params.inspector_id)
    const companyInspectorRepository = new CompanyInspectorRepository(knex, 'company_inspectors')

    const inspector = await companyInspectorRepository.findCompanyInspectorByID(
      cid,
      INSPECTOR_ID
    )

    if (inspector == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Inspector is not found.' })

      return
    }

    res
      .status(StatusCodes.OK)
      .json(inspector)
  } catch (error) {
    next(error)
  }
}

export async function updateCompanyInspector (
  req: Request<{ inspector_id: string }, never, UpdateCompanyInspector>,
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

    const INSPECTOR_ID = parseInt(req.params.inspector_id)
    const cityRepository = new CityRepository(knex, 'cities')
    const phoneRepository = new PhoneRepository(knex, 'phone_numbers')
    const companyInspectorRepository = new CompanyInspectorRepository(knex, 'company_inspectors')

    const inspector = await companyInspectorRepository.findOne({
      company_id: cid,
      id: INSPECTOR_ID
    })

    if (inspector == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Inspector is not found.' })

      return
    }

    const city = await cityRepository.exist(req.body.city_id)

    if (!city) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'City is not found.' })

      return
    }

    await phoneRepository.update(inspector.phone_number_id, {
      phone_number: req.body.phone_number
    })

    delete (req.body as any).phone_number
    await companyInspectorRepository.update(INSPECTOR_ID, req.body)

    const companyInspector = await companyInspectorRepository.findCompanyInspectorByID(
      cid,
      INSPECTOR_ID
    )

    res
      .status(StatusCodes.OK)
      .json(companyInspector)
  } catch (error) {
    next(error)
  }
}

export async function updateCompanyInspectorStatus (
  req: Request<{ inspector_id: string }, never, ChangeCompanyInspectorStatus>,
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

    const INSPECTOR_ID = parseInt(req.params.inspector_id)
    const companyInspectorRepository = new CompanyInspectorRepository(knex, 'company_inspectors')

    const inspector = await companyInspectorRepository.findOne({
      company_id: cid,
      id: INSPECTOR_ID
    })

    if (inspector == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Inspector is not found.' })

      return
    }

    if (inspector.status === req.body.status) {
      res
        .status(StatusCodes.NOT_MODIFIED)
        .end()

      return
    }

    res
      .status(StatusCodes.OK)
      .json({ message: 'Status updated successfully.' })
  } catch (error) {
    next(error)
  }
}

export async function deleteCompanyInspector (
  req: Request<{ inspector_id: string }>,
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

    const INSPECTOR_ID = parseInt(req.params.inspector_id)
    const companyInspectorRepository = new CompanyInspectorRepository(knex, 'company_inspectors')

    const inspector = await companyInspectorRepository.findCompanyInspectorByID(
      cid,
      INSPECTOR_ID
    )

    if (inspector == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Inspector is not found.' })

      return
    }

    res
      .status(StatusCodes.NO_CONTENT)
      .end()
  } catch (error) {
    next(error)
  }
}

export async function getCompanyInspectorByEmail (
  req: Request<{ email: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const EMAIL = req.params.email
    const accountRepository = new AccountRepository(knex, 'accounts')
    const inspector = await accountRepository.exist({ email: EMAIL })

    if (inspector) {
      res
        .status(StatusCodes.OK)
        .end()
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .end()
    }
  } catch (error) {
    next(error)
  }
}

export async function createCompanyInspectorByEmail (
  req: Request<{ email: string }>,
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

    const EMAIL = req.params.email
    const companyInspectorRepository = new CompanyInspectorRepository(knex, 'company_inspectors')
    const inspectorRepository = new InspectorRepository(knex, 'inspectors')
    const accountRepository = new AccountRepository(knex, 'accounts')

    const account = await accountRepository.findOne({ email: EMAIL })

    if (account != null) {
      if (account.role !== Roles.Inspector) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'This user cannot be designated as an inspector.' })

        return
      }

      const inspector = await inspectorRepository.findOne(account.id)

      if (inspector == null) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Inspector is not found.' })

        return
      }

      await companyInspectorRepository.create({
        account_id: account.id,
        company_id: cid,
        city_id: inspector.city_id ?? undefined,
        inspector_id: inspector.id,
        phone_number_id: inspector.phone_number_id ?? undefined,
        email: account.email,
        status: InspectorStatus.Verification,
        address: inspector.address,
        birthday: inspector.birthday,
        first_name: inspector.first_name ?? undefined,
        last_name: inspector.last_name ?? undefined
      })

      res
        .status(StatusCodes.OK)
        .end()
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Inspector is not found.' })
    }
  } catch (error) {
    next(error)
  }
}
