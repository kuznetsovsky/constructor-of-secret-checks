import { randomBytes } from 'node:crypto'
import { type Knex } from 'knex'

import { createQuestionnaireUrl } from '../../source/common/helpers/links.helper'
import { type Questionnaire } from '../../source/common/repositories/questionnaires.repository'

interface Q extends Pick<Questionnaire, 'description' | 'token' | 'link'> {}

const createQuestionnaire = (): Q => {
  const token = randomBytes(24).toString('base64')

  return {
    link: createQuestionnaireUrl(1, token),
    token: '',
    description: 'Описание акеты'
  }
}

const questionnaires: Q[] = []

for (let i = 0; i < 3; i++) {
  questionnaires.push(createQuestionnaire())
}

export async function seed (knex: Knex): Promise<void> {
  await knex<Questionnaire>('company_questionnaires')
    .del()
    .insert(questionnaires)
}
