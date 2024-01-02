import { type Knex } from 'knex'

export async function seed (knex: Knex): Promise<void> {
  await knex('accounts')
    .del()
    .insert([
      {
        role: 'inspector',
        email: 'www.jhon@mail.com',
        email_verified: '2024-01-01T00:00:00.000Z',
        password: '1qJfUmC4cZimiM6djJ3Bpw==$TrLeF5pFo0xwf2lNxBVCdilIBUc25oiaaOXuPOWru/i9zCApGnFm9fMhBxFtvMtiCqhLMJuuY8Sjjqx4wdgdDA=='
      },
      {
        role: 'administrator',
        email: 'www.jane@mail.com',
        email_verified: '2024-01-01T00:00:00.000Z',
        password: 'H5XXXvMiw14leZUc2iVRTw==$AN0uUKt8iJE/cFO6EfhxP7r6Xf4G3TPBqPuTFSDcWRhua5xwLyRHGrGK7AsjrchPQvWCpyrkxRPdTms24rtVcg=='
      },
      {
        role: 'manager',
        email: 'www.bob@mail.com',
        email_verified: '2024-01-01T00:00:00.000Z',
        password: 'onZGV6/vdwtkT2pw1GgnAA==$5z4REDsk3+ZelMtKgWpZMoxG+Fy7bORBaTlMAJQzaIIvnWJ9IkHvvrUlLponEM2YVWYQ3n0S51GbsDxkmNLCtA=='
      },
      {
        role: 'inspector',
        email: 'www.tim@mail.com',
        password: 'H5XXXvMiw14leZUc2iVRTw==$AN0uUKt8iJE/cFO6EfhxP7r6Xf4G3TPBqPuTFSDcWRhua5xwLyRHGrGK7AsjrchPQvWCpyrkxRPdTms24rtVcg=='
      }
    ])
}
