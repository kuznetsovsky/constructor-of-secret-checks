import { type Knex } from 'knex'

export async function seed (knex: Knex): Promise<void> {
  await knex('company_templates')
    .del()
    .insert([
      {
        company_id: 1,
        check_type_id: 1,
        task_name: 'Проверка качества обслуживания',
        instruction: 'Инструкция к выполнению задания',
        tasks: []
      },
      {
        company_id: 2,
        check_type_id: 4,
        task_name: 'Проверка качества обслуживания',
        instruction: 'Инструкция к выполнению задания',
        tasks: []
      },
      {
        company_id: 2,
        check_type_id: 5,
        task_name: 'Проверка внешнего вида персонала',
        instruction: 'Инструкция к выполнению задания',
        tasks: []
      }
    ])
}
