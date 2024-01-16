import { type Knex } from 'knex'

export async function seed (knex: Knex): Promise<void> {
  await knex('accounts')
    .del()
    .insert([
      { // 1
        role: 'inspector',
        email: 'www.jhon@mail.com',
        email_verified: '2024-01-01T00:00:00.000Z',
        password: '1qJfUmC4cZimiM6djJ3Bpw==$TrLeF5pFo0xwf2lNxBVCdilIBUc25oiaaOXuPOWru/i9zCApGnFm9fMhBxFtvMtiCqhLMJuuY8Sjjqx4wdgdDA=='
      },
      { // 2
        role: 'administrator',
        email: 'www.jane@mail.com',
        email_verified: '2024-01-01T00:00:00.000Z',
        password: 'H5XXXvMiw14leZUc2iVRTw==$AN0uUKt8iJE/cFO6EfhxP7r6Xf4G3TPBqPuTFSDcWRhua5xwLyRHGrGK7AsjrchPQvWCpyrkxRPdTms24rtVcg=='
      },
      { // 3
        role: 'manager',
        email: 'www.bob@mail.com',
        email_verified: '2024-01-01T00:00:00.000Z',
        password: 'onZGV6/vdwtkT2pw1GgnAA==$5z4REDsk3+ZelMtKgWpZMoxG+Fy7bORBaTlMAJQzaIIvnWJ9IkHvvrUlLponEM2YVWYQ3n0S51GbsDxkmNLCtA=='
      },
      { // 4
        role: 'inspector',
        email: 'www.tim@mail.com',
        password: 'H5XXXvMiw14leZUc2iVRTw==$AN0uUKt8iJE/cFO6EfhxP7r6Xf4G3TPBqPuTFSDcWRhua5xwLyRHGrGK7AsjrchPQvWCpyrkxRPdTms24rtVcg=='
      },
      { // 5
        role: 'administrator',
        email: 'www.alex@mail.com',
        email_verified: '2024-01-01T00:00:00.000Z',
        password: '1qJfUmC4cZimiM6djJ3Bpw==$TrLeF5pFo0xwf2lNxBVCdilIBUc25oiaaOXuPOWru/i9zCApGnFm9fMhBxFtvMtiCqhLMJuuY8Sjjqx4wdgdDA=='
      },
      { // 6
        role: 'administrator',
        email: 'www.alice@mail.com',
        email_verified: '2024-01-01T00:00:00.000Z',
        password: '1qJfUmC4cZimiM6djJ3Bpw==$TrLeF5pFo0xwf2lNxBVCdilIBUc25oiaaOXuPOWru/i9zCApGnFm9fMhBxFtvMtiCqhLMJuuY8Sjjqx4wdgdDA=='
      },
      //
      { // 7
        role: 'inspector',
        email: 'www.lana@mail.com',
        email_verified: '2024-01-01T00:00:00.000Z',
        password: '1qJfUmC4cZimiM6djJ3Bpw==$TrLeF5pFo0xwf2lNxBVCdilIBUc25oiaaOXuPOWru/i9zCApGnFm9fMhBxFtvMtiCqhLMJuuY8Sjjqx4wdgdDA=='
      },
      { // 8
        role: 'inspector',
        email: 'www.ketty@mail.com',
        email_verified: '2024-01-01T00:00:00.000Z',
        password: '1qJfUmC4cZimiM6djJ3Bpw==$TrLeF5pFo0xwf2lNxBVCdilIBUc25oiaaOXuPOWru/i9zCApGnFm9fMhBxFtvMtiCqhLMJuuY8Sjjqx4wdgdDA=='
      },
      { // 9
        role: 'inspector',
        email: 'www.barbara@mail.com',
        email_verified: '2024-01-01T00:00:00.000Z',
        password: '1qJfUmC4cZimiM6djJ3Bpw==$TrLeF5pFo0xwf2lNxBVCdilIBUc25oiaaOXuPOWru/i9zCApGnFm9fMhBxFtvMtiCqhLMJuuY8Sjjqx4wdgdDA=='
      },
      { // 10
        role: 'inspector',
        email: 'www.britney@mail.com',
        email_verified: '2024-01-01T00:00:00.000Z',
        password: '1qJfUmC4cZimiM6djJ3Bpw==$TrLeF5pFo0xwf2lNxBVCdilIBUc25oiaaOXuPOWru/i9zCApGnFm9fMhBxFtvMtiCqhLMJuuY8Sjjqx4wdgdDA=='
      },
      { // 11
        role: 'inspector',
        email: 'www.betty@mail.com',
        email_verified: '2024-01-01T00:00:00.000Z',
        password: '1qJfUmC4cZimiM6djJ3Bpw==$TrLeF5pFo0xwf2lNxBVCdilIBUc25oiaaOXuPOWru/i9zCApGnFm9fMhBxFtvMtiCqhLMJuuY8Sjjqx4wdgdDA=='
      },
      { // 12
        role: 'inspector',
        email: 'www.boris@mail.com',
        email_verified: '2024-01-01T00:00:00.000Z',
        password: '1qJfUmC4cZimiM6djJ3Bpw==$TrLeF5pFo0xwf2lNxBVCdilIBUc25oiaaOXuPOWru/i9zCApGnFm9fMhBxFtvMtiCqhLMJuuY8Sjjqx4wdgdDA=='
      },
      { // 13
        role: 'inspector',
        email: 'www.michael@mail.com',
        email_verified: '2024-01-01T00:00:00.000Z',
        password: '1qJfUmC4cZimiM6djJ3Bpw==$TrLeF5pFo0xwf2lNxBVCdilIBUc25oiaaOXuPOWru/i9zCApGnFm9fMhBxFtvMtiCqhLMJuuY8Sjjqx4wdgdDA=='
      },
      { // 14
        role: 'manager',
        email: 'www.miller@mail.com',
        email_verified: '2024-01-01T00:00:00.000Z',
        password: '1qJfUmC4cZimiM6djJ3Bpw==$TrLeF5pFo0xwf2lNxBVCdilIBUc25oiaaOXuPOWru/i9zCApGnFm9fMhBxFtvMtiCqhLMJuuY8Sjjqx4wdgdDA=='
      },
      { // 15
        role: 'manager',
        email: 'www.morello@mail.com',
        email_verified: '2024-01-01T00:00:00.000Z',
        password: '1qJfUmC4cZimiM6djJ3Bpw==$TrLeF5pFo0xwf2lNxBVCdilIBUc25oiaaOXuPOWru/i9zCApGnFm9fMhBxFtvMtiCqhLMJuuY8Sjjqx4wdgdDA=='
      },
      { // 16
        role: 'manager',
        email: 'www.thomson@mail.com',
        email_verified: '2024-01-01T00:00:00.000Z',
        password: '1qJfUmC4cZimiM6djJ3Bpw==$TrLeF5pFo0xwf2lNxBVCdilIBUc25oiaaOXuPOWru/i9zCApGnFm9fMhBxFtvMtiCqhLMJuuY8Sjjqx4wdgdDA=='
      },
      { // 17
        role: 'manager',
        email: 'www.sanchez@mail.com',
        email_verified: '2024-01-01T00:00:00.000Z',
        password: '1qJfUmC4cZimiM6djJ3Bpw==$TrLeF5pFo0xwf2lNxBVCdilIBUc25oiaaOXuPOWru/i9zCApGnFm9fMhBxFtvMtiCqhLMJuuY8Sjjqx4wdgdDA=='
      }
    ])
}
