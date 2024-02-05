import { type Knex } from 'knex'

export const createData = (days: number): string => {
  const time = new Date()
  const date = (new Date(time.setDate(time.getDate() + days)).toISOString()).split('T')[0]
  return date
}

export async function seed (knex: Knex): Promise<void> {
  await knex('object_checks')
    .del()
    .insert([
      {
        template_id: 2,
        company_id: 2,
        object_id: 1,
        check_type_id: 4,
        inspector_id: null,
        link_url: '/company-check?check_code=FYqfjFrO7B68nEnFo6N9oQ',
        date_of_inspection: createData(2)
      },
      {
        template_id: 2,
        company_id: 2,
        object_id: 1,
        check_type_id: 4,
        inspector_id: 1,
        link_url: '/company-check?check_code=RbBBrCDUXPCG1S4wxggO1w',
        date_of_inspection: createData(1)
      },
      {
        template_id: 1,
        company_id: 1,
        object_id: 2,
        check_type_id: 2,
        inspector_id: 2,
        link_url: '/company-check?check_code=1rZM_WIqW-5fROtXNlMb-Q',
        date_of_inspection: createData(1)
      }
    ])
};
