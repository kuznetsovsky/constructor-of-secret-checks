import request from 'supertest'
import { app } from '../../source/app'

describe('When a client', () => {
  const LOGIN_URL = '/api/v1/auth/sign-in'
  const LOGOUT_URL = '/api/v1/sign-out'
  const QUESTIONNAIRE_URL = '/api/v1/companies/questionnaire'

  describe('not authorized sends request to', () => {
    describe(`GET: ${QUESTIONNAIRE_URL}`, () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).get(QUESTIONNAIRE_URL)
        expect(response.statusCode).toBe(401)
      })
    })

    describe(`PUT: ${QUESTIONNAIRE_URL}/{company_id}`, () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).put(QUESTIONNAIRE_URL)
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
      inspectorCookie = ''
      managerCookie = ''
    })

    describe(`GET: ${QUESTIONNAIRE_URL}`, () => {
      describe('when administrator role', () => {
        it('should return questionnaire data', async () => {
          const response = await request(app)
            .get(QUESTIONNAIRE_URL)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({
            id: 2,
            link: expect.any(String),
            token: expect.any(String),
            description: 'Описание акеты',
            is_required_city: true,
            is_required_address: true,
            is_required_phone_number: true,
            is_required_vk_link: true,
            is_required_birthday: true
          })
        })
      })

      describe('when manager role', () => {
        it('should return questionnaire data', async () => {
          const response = await request(app)
            .get(QUESTIONNAIRE_URL)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({
            id: 2,
            link: expect.any(String),
            token: expect.any(String),
            description: 'Описание акеты',
            is_required_city: true,
            is_required_address: true,
            is_required_phone_number: true,
            is_required_vk_link: true,
            is_required_birthday: true
          })
        })
      })

      describe('when inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .get(QUESTIONNAIRE_URL)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })

    describe(`PUT: ${QUESTIONNAIRE_URL}`, () => {
      describe('when administrator role', () => {
        it('should return updated questionnaire data', async () => {
          const payload = {
            description: 'Обновленное описание акеты',
            is_required_city: true,
            is_required_address: true,
            is_required_phone_number: true,
            is_required_vk_link: false,
            is_required_birthday: false
          }

          const response = await request(app)
            .put(QUESTIONNAIRE_URL)
            .set('Cookie', adminCookie)
            .send(payload)

          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({
            ...payload,
            id: 2,
            link: expect.any(String),
            token: expect.any(String)
          })
        })
      })

      describe('when manager role', () => {
        it('should return updated questionnaire data', async () => {
          const payload = {
            description: 'Обновленное описание акеты',
            is_required_city: true,
            is_required_address: true,
            is_required_phone_number: true,
            is_required_vk_link: false,
            is_required_birthday: false
          }

          const response = await request(app)
            .put(QUESTIONNAIRE_URL)
            .set('Cookie', managerCookie)
            .send(payload)

          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({
            ...payload,
            id: 2,
            link: expect.any(String),
            token: expect.any(String)
          })
        })
      })

      describe('when inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .put(QUESTIONNAIRE_URL)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })
})
