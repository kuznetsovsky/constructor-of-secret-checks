import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { knex } from '../../connection'
import { type UpdateQuestionnaire } from './questionnaire.interface'
import { QuestionnaireRepository } from '../../common/repositories/questionnaires.repository'
import { CompanyRepository } from '../../common/repositories/company.repository'

export async function getQuestionnaire (req: Request, res: Response, next: NextFunction): Promise<void> {
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

    const questionnaireRepository = new QuestionnaireRepository(knex, 'company_questionnaires')
    const companyRepository = new CompanyRepository(knex, 'companies')
    const company = await companyRepository.findOne(cid, ['questionnaire_id'])

    if (company == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Company is not found' })

      return
    }

    const questionnaire = await questionnaireRepository.findOne(company.questionnaire_id)

    if (questionnaire == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Questionnaire is not found.' })

      return
    }

    res
      .status(StatusCodes.OK)
      .json(questionnaire)
  } catch (error) {
    next(error)
  }
}

export async function updateQuestionnaire (req: Request<any, any, UpdateQuestionnaire>, res: Response, next: NextFunction): Promise<void> {
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

    const questionnaireRepository = new QuestionnaireRepository(knex, 'company_questionnaires')
    const companyRepository = new CompanyRepository(knex, 'companies')
    const company = await companyRepository.findOne(cid, ['questionnaire_id'])

    if (company == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Company is not found.' })

      return
    }

    await questionnaireRepository.update(company.questionnaire_id, req.body)
    const questionnaire = await questionnaireRepository.findOne(company.questionnaire_id)

    if (questionnaire == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Questionnaire is not found.' })

      return
    }

    res
      .status(StatusCodes.OK)
      .json(questionnaire)
  } catch (error) {
    next(error)
  }
}
