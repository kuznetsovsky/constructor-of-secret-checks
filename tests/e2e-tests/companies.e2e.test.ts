import request from 'supertest'
import { app } from '../../source/app'

describe('When a client', () => {
  const LOGIN_URL = '/api/v1/auth/sign-in'
  const LOGOUT_URL = '/api/v1/sign-out'
  const COMPANIES_URL = '/api/v1/companies'

  describe('not authorized', () => {
    describe(`sends request to GET: ${COMPANIES_URL}`, () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).get(COMPANIES_URL)
        expect(response.statusCode).toBe(401)
      })
    })

    describe(`sends request to GET: ${COMPANIES_URL}/{company_id}`, () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).get(`${COMPANIES_URL}/1`)
        expect(response.statusCode).toBe(401)
      })
    })

    describe(`sends request to PUT: ${COMPANIES_URL}/{company_id}`, () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).put(`${COMPANIES_URL}/1`)
        expect(response.statusCode).toBe(401)
      })
    })
  })

  describe('authorized sends request to', () => {
    let adminCookie = ''
    let inspectorCookie = ''
    let managerCookie = ''

    beforeAll(async () => {
      {
        const response = await request(app).post(LOGIN_URL)
          .send({
            email: 'www.jane@mail.com',
            password: 'Qwerty_1234'
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
      inspectorCookie = ''
      managerCookie = ''
    })

    describe(`GET: ${COMPANIES_URL}`, () => {
      it('should return the company list', async () => {
        const response = await request(app).get(COMPANIES_URL)
          .set('Cookie', inspectorCookie)

        expect(response.body.companies.length).toBe(3)
        expect(response.body.companies).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              name: 'Модный кабачок',
              description: 'Сеть ресторанов',
              website_link: null,
              vk_link: null
            }),
            expect.objectContaining({
              id: expect.any(Number),
              name: 'Res-O-Run',
              description: 'Сеть ресторанов',
              website_link: null,
              vk_link: null
            }),
            expect.objectContaining({
              id: expect.any(Number),
              name: 'Bosco',
              description: 'Сеть ресторанов',
              website_link: null,
              vk_link: null
            })
          ])
        )
      })
    })

    describe(`GET: ${COMPANIES_URL}/{company_id}`, () => {
      it('should return the status not found', async () => {
        const response = await request(app)
          .get(`${COMPANIES_URL}/100`)
          .set('Cookie', inspectorCookie)

        expect(response.statusCode).toBe(404)
      })

      it('should return the company info', async () => {
        const response = await request(app)
          .get(`${COMPANIES_URL}/1`)
          .set('Cookie', inspectorCookie)

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
          id: 1,
          name: 'Модный кабачок',
          description: 'Сеть ресторанов',
          vk_link: null,
          website_link: null,
          administrator: {
            id: 1,
            first_name: 'Jane',
            last_name: 'Fox',
            phone_number: null
          }
        })
      })
    })

    describe(`PUT: ${COMPANIES_URL}/{company_id}`, () => {
      describe('with administrator role', () => {
        it('should successfully update company profile', async () => {
          const payload = {
            name: 'Bosco Cafe',
            description: 'Simple cafe',
            website_link: 'http://localhost:8080',
            vk_link: 'https://vk.com/bosco_cafe',
            number_of_checks: 1
          }

          const response = await request(app)
            .put(`${COMPANIES_URL}/1`)
            .set('Cookie', adminCookie)
            .send(payload)

          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({
            ...payload,
            id: 1,
            number_of_checks: 1
          })
        })

        it('should return no access status', async () => {
          const payload = {
            name: 'Bosco Cafe',
            description: 'Simple cafe',
            website_link: 'http://localhost:8080',
            vk_link: 'https://vk.com/bosco_cafe',
            number_of_checks: 1
          }

          const response = await request(app)
            .put(`${COMPANIES_URL}/2`)
            .set('Cookie', adminCookie)
            .send(payload)

          expect(response.statusCode).toBe(403)
        })
      })

      describe('with inspector role', () => {
        it('should return no access status', async () => {
          const payload = {
            name: 'Bosco Cafe',
            description: 'Simple cafe',
            website_link: 'http://localhost:8080',
            vk_link: 'https://vk.com/bosco_cafe',
            number_of_checks: 0
          }

          const response = await request(app)
            .put(`${COMPANIES_URL}/1`)
            .set('Cookie', inspectorCookie)
            .send(payload)

          expect(response.statusCode).toBe(403)
        })
      })

      describe('with manager role', () => {
        it('should return no access status', async () => {
          const payload = {
            name: 'Bosco Cafe',
            description: 'Simple cafe',
            website_link: 'http://localhost:8080',
            vk_link: 'https://vk.com/bosco_cafe',
            number_of_checks: 0
          }

          const response = await request(app)
            .put(`${COMPANIES_URL}/2`)
            .set('Cookie', managerCookie)
            .send(payload)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })
})
