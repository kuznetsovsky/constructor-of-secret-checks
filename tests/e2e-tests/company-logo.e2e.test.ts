import fs from 'node:fs/promises'
import request from 'supertest'
import { app } from '../../source/app'

describe('When a client sends request to', () => {
  const LOGIN_URL = '/api/v1/auth/sign-in'
  const LOGOUT_URL = '/api/v1/sign-out'
  const LOGOS_URL = '/api/v1/companies/logo'

  let adminCookie = ''
  let admin2Cookie = ''
  let inspectorCookie = ''
  let managerCookie = ''

  beforeAll(async () => {
    {
      const response = await request(app).post(LOGIN_URL)
        .send({
          email: 'www.jane@mail.com',
          password: 'Qwerty_1234'
        })

      admin2Cookie = response.headers['set-cookie']
    }
    {
      const response = await request(app).post(LOGIN_URL)
        .send({
          email: 'www.alex@mail.com',
          password: 'Qwerty1234'
        })

      adminCookie = response.headers['set-cookie']
    }
    {
      const response = await request(app).post(LOGIN_URL)
        .send({
          email: 'www.jhon@mail.com',
          password: 'Qwerty1234'
        })

      inspectorCookie = response.headers['set-cookie']
    }
    {
      const response = await request(app).post(LOGIN_URL)
        .send({
          email: 'www.bob@mail.com',
          password: '!Qwerty1234'
        })

      managerCookie = response.headers['set-cookie']
    }
  })

  afterAll(async () => {
    await request(app).delete(LOGOUT_URL)
    adminCookie = ''
    admin2Cookie = ''
    inspectorCookie = ''
    managerCookie = ''
  })

  describe(`GET: ${LOGOS_URL}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).get(LOGOS_URL)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return not found status (admin 1)', async () => {
          const response = await request(app)
            .get(LOGOS_URL)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should successfully return logo data (admin 2)', async () => {
          const response = await request(app)
            .get(LOGOS_URL)
            .set('Cookie', admin2Cookie)

          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({
            id: 1,
            company_id: 1,
            src: '/public/uploads/logos/9-n9qwaZMY9b8vilp8PfM.png',
            created_at: expect.any(String),
            updated_at: expect.any(String)
          })
        })
      })

      describe('and with manager role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .get(LOGOS_URL)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(403)
        })
      })

      describe('and with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .get(LOGOS_URL)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`PUT: ${LOGOS_URL}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).put(LOGOS_URL)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        // TODO: write tests
      })

      describe('and with manager role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .put(LOGOS_URL)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(403)
        })
      })

      describe('and with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .put(LOGOS_URL)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`DELETE: ${LOGOS_URL}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).delete(LOGOS_URL)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return not found status (admin 1)', async () => {
          const response = await request(app)
            .delete(LOGOS_URL)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should return no content status (admin 2)', async () => {
          await fs.writeFile('./public/uploads/logos/9-n9qwaZMY9b8vilp8PfM.png', '')

          const response = await request(app)
            .delete(LOGOS_URL)
            .set('Cookie', admin2Cookie)

          expect(response.statusCode).toBe(204)
        })
      })

      describe('and with manager role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .delete(LOGOS_URL)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(403)
        })
      })

      describe('and with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .delete(LOGOS_URL)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })
})
